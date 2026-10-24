import test from 'node:test'
import assert from 'node:assert/strict'
import {
  CMS_URL,
  cmsItem,
  cmsItems,
  createFallbackCMS,
  fetchCMS,
  normalizePhone,
  normalizeWhatsApp,
  parseCMS,
  parseCSV,
  safeHref,
} from '../src/cms/parseCMS.js'
import { buildTelHref, buildWaHref, fillPrecio, resolveButtonHref } from '../src/cms/links.js'
import { DEFAULT_CONFIG } from '../src/cms/defaults.js'

const HEADER = ['tipo', 'id', 'campo', 'valor', 'mostrar', 'orden', 'ayuda']
const csv = rows => rows.map(row => row.map(value => {
  const text = String(value ?? '')
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}).join(',')).join('\r\n')

test('parseCSV handles BOM, CRLF, quoted commas, escaped quotes and embedded newlines', () => {
  const rows = parseCSV(`\uFEFF${csv([HEADER, ['seccion', 'hero', 'titulo', 'Hola, "familia"\ncon respeto', 'SI', 1, '']])}`)
  assert.deepEqual(rows[1].slice(0, 4), ['seccion', 'hero', 'titulo', 'Hola, "familia"\ncon respeto'])
})

test('parseCSV and parseCMS reject malformed structure and quoting', () => {
  assert.throws(() => parseCSV('a,"sin cerrar'), /comilla sin cerrar/i)
  assert.throws(() => parseCMS('clave,valor\ntelefono,123'), /Formato CMS inesperado/)
})

test('CMS validation skips unsafe fields, unknown fields and invalid row values', () => {
  const result = parseCMS(csv([
    HEADER,
    ['seccion', 'hero', 'titulo', 'Título válido', 'SI', 1, ''],
    ['seccion', 'hero', 'button_href', 'javascript:alert(1)', 'SI', 1, ''],
    ['seccion', 'hero', 'campo_desconocido', 'no debe entrar', 'SI', 1, ''],
    ['zona', 'zona_invalida', 'nombre', 'Localidad', 'tal vez', 1, ''],
    ['card', 'imagen_invalida', 'imagen', 'javascript:alert(1)', 'SI', 1, ''],
  ]))

  assert.equal(cmsItem(result, 'seccion', 'hero').titulo, 'Título válido')
  assert.equal(cmsItem(result, 'seccion', 'hero').button_href, undefined)
  assert.equal(cmsItem(result, 'card', 'imagen_invalida'), undefined)
  assert.deepEqual(result.issues.map(issue => issue.code), ['unsafe_link', 'unknown_field', 'invalid_field_visibility', 'unsafe_image_url'])
})

test('config rejects unsafe map destinations and duplicate fields, but preserves defaults for blanks', () => {
  const result = parseCMS(csv([
    HEADER,
    ['config', 'site', 'canonical_url', '', 'SI', 0, ''],
    ['config', 'site', 'maps_embed_url', 'javascript:alert(1)', 'SI', 0, ''],
    ['config', 'site', 'brand_name', 'Primer nombre', 'SI', 0, ''],
    ['config', 'site', 'brand_name', 'Nombre duplicado', 'SI', 0, ''],
  ]))

  assert.equal(result.config.canonical_url, 'https://www.sepeliosmoron.com.ar/')
  assert.equal(result.config.maps_embed_url, DEFAULT_CONFIG.maps_embed_url)
  assert.equal(result.config.brand_name, 'Primer nombre')
  assert.deepEqual(result.issues.map(issue => issue.code), ['unsafe_link', 'duplicate_field'])
})

test('CMS rejects unsupported sections, section-only fields and unrendered groups', () => {
  const result = parseCMS(csv([
    HEADER,
    ['seccion', 'otra', 'titulo', 'No renderizada', 'SI', 0, ''],
    ['seccion', 'cobertura', 'imagen', '/assets/storefront.png', 'SI', 5, ''],
    ['card', 'card_fuera', 'grupo', 'grupo-inexistente', 'SI', 0, ''],
    ['boton', 'boton_fuera', 'grupo', 'grupo-inexistente', 'SI', 0, ''],
  ]))

  assert.deepEqual(result.issues.map(issue => issue.code), [
    'unsupported_section',
    'unsupported_field_for_section',
    'invalid_group',
    'invalid_group',
  ])
})

test('items can be hidden, newly added, and reordered; blank fields retain approved fallbacks', () => {
  const result = parseCMS(csv([
    HEADER,
    ['servicio', 'nuevo', 'titulo', 'Servicio nuevo', 'SI', 1, ''],
    ['servicio', 'nuevo', 'orden', 1, 'SI', 1, ''],
    ['servicio', 'primero', 'titulo', 'Primero visible', 'SI', 2, ''],
    ['servicio', 'primero', 'mostrar', 'SI', 'SI', 2, ''],
    ['servicio', 'oculto', 'titulo', 'Oculto', 'NO', 3, ''],
    ['seccion', 'hero', 'titulo', '', 'SI', 1, ''],
  ]))

  assert.deepEqual(
    cmsItems(result, 'servicio').filter(item => ['nuevo', 'primero'].includes(item.id)).map(item => item.id),
    ['nuevo', 'primero'],
  )
  assert.equal(cmsItem(result, 'servicio', 'oculto').mostrar, false)
  assert.equal(cmsItem(result, 'servicio', 'oculto').titulo, 'Oculto')
  assert.equal(cmsItems(result, 'servicio').some(item => item.id === 'oculto'), false)
  assert.equal(cmsItem(result, 'seccion', 'hero').titulo, 'Atención fúnebre las 24 horas en Morón')
})

test('item visibility is record metadata and inconsistent visibility is reported', () => {
  const result = parseCMS(csv([
    HEADER,
    ['card', 'hidden', 'titulo', 'Preserve hidden content', 'NO', 1, ''],
    ['card', 'hidden', 'descripcion', 'Ready if re-enabled', 'NO', 1, ''],
    ['card', 'conflict', 'titulo', 'Visible record', 'SI', 2, ''],
    ['card', 'conflict', 'descripcion', 'Conflicting metadata', 'NO', 2, ''],
  ]))

  assert.equal(cmsItem(result, 'card', 'hidden').titulo, 'Preserve hidden content')
  assert.equal(cmsItem(result, 'card', 'hidden').mostrar, false)
  assert.equal(cmsItems(result, 'card').some(item => item.id === 'hidden'), false)
  assert.deepEqual(result.issues.map(issue => issue.code), ['inconsistent_item_visibility'])
})

test('phone and link helpers produce valid tel and WhatsApp URLs and reject invalid destinations', () => {
  assert.equal(normalizePhone('11-5413-3407'), '+5491154133407')
  assert.equal(normalizePhone('011 15 5413-3407'), '+5491154133407')
  assert.equal(normalizePhone('+54 9 11 5413-3407'), '+5491154133407')
  assert.equal(normalizePhone('11-3918-7173'), '+5491139187173')
  assert.equal(normalizePhone('11-4975-6793'), '+5491149756793')
  assert.equal(normalizePhone('123'), '')
  assert.equal(normalizeWhatsApp('5491154133407'), '5491154133407')
  assert.equal(buildTelHref('11-5413-3407'), 'tel:+5491154133407')
  assert.equal(buildWaHref('5491154133407', 'Hola Sepelios'), 'https://wa.me/5491154133407?text=Hola%20Sepelios')
  assert.equal(buildWaHref('123', 'Hola'), '')
  assert.equal(safeHref('javascript:alert(1)'), '')
  assert.equal(safeHref('https://maps.google.com/'), 'https://maps.google.com/')
  assert.equal(safeHref('tel:11-5413-3407'), 'tel:+5491154133407')
  assert.equal(fillPrecio('Valor {precio}', '$580.000'), 'Valor $580.000')
  assert.equal(resolveButtonHref({ button_action: 'phone' }, { telefono_principal: '11-5413-3407' }), 'tel:+5491154133407')
})

test('one official sheet URL is used and failed CSV requests return approved fallback content', async () => {
  assert.match(CMS_URL, /gid=266301715/)
  assert.doesNotMatch(CMS_URL, /gid=0(?:&|$)/)

  const networkFailure = await fetchCMS(async () => { throw new Error('offline') })
  assert.equal(networkFailure.status, 'fallback')
  assert.match(networkFailure.error, /offline/)
  assert.equal(cmsItem(networkFailure, 'seccion', 'hero').titulo, 'Atención fúnebre las 24 horas en Morón')

  const httpFailure = await fetchCMS(async () => ({ ok: false, status: 503 }))
  assert.equal(httpFailure.status, 'fallback')
  assert.match(httpFailure.error, /503/)

  const malformedResponse = await fetchCMS(async () => ({ ok: true, text: async () => 'not,cms' }))
  assert.equal(malformedResponse.status, 'fallback')
  assert.match(malformedResponse.error, /Formato CMS inesperado/)
  assert.equal(createFallbackCMS().status, 'fallback')
})
