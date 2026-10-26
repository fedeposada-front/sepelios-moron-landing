import { DEFAULT_COLLECTIONS, DEFAULT_CONFIG } from './defaults.js'

export const CMS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSkSfWqKhzXqok3XzWRcfjktTa_N7DHjWZkyeBPuOxlF8KpsP8Ntq-WiNY09M-Is2Rim-MQaA_HyxqQ/pub?gid=266301715&single=true&output=csv'

const TYPES = new Set(['config', ...Object.keys(DEFAULT_COLLECTIONS), 'aviso', 'boton'])
const CONFIG_FIELDS = new Set(Object.keys(DEFAULT_CONFIG))
const HTTPS_FIELDS = new Set(['maps_url', 'maps_embed_url', 'instagram_url', 'canonical_url'])
const SECTION_IDS = new Set(['hero', 'servicios', 'confianza', 'instalaciones', 'proceso', 'cobertura', 'precios', 'preguntas', 'contacto'])
const CARD_GROUPS = new Set(['confianza', 'instalacion', 'instalacion-nota', 'proceso', 'hero-trust'])
const BUTTON_GROUPS = new Set(['hero', 'servicios', 'confianza', 'instalaciones', 'proceso', 'cobertura', 'precios', 'preguntas', 'contacto', 'footer'])
const COLLECTION_FIELDS = {
  seccion: new Set(['titulo', 'descripcion', 'imagen', 'imagen_alt', 'boton', 'button_text', 'button_href', 'button_action', 'button_message', 'destacado', 'eyebrow', 'nav_label', 'nav_visible']),
  servicio: new Set(['titulo', 'descripcion', 'imagen', 'imagen_alt', 'icono', 'visible_en_servicios', 'button_text', 'button_href', 'button_action', 'button_message']),
  precio: new Set(['titulo', 'descripcion', 'precio', 'subtexto', 'destacada', 'beneficio_1', 'beneficio_2', 'beneficio_3', 'button_text', 'button_href', 'button_action', 'button_message']),
  card: new Set(['grupo', 'numero', 'titulo', 'descripcion', 'imagen', 'imagen_alt', 'icono', 'button_text', 'button_href', 'button_action', 'button_message', 'enlace_texto', 'enlace_href']),
  faq: new Set(['pregunta', 'respuesta', 'button_text', 'button_href', 'button_action', 'button_message']),
  zona: new Set(['nombre']),
  aviso: new Set(['grupo', 'titulo', 'descripcion', 'button_text', 'button_href', 'button_action', 'button_message']),
  boton: new Set(['grupo', 'titulo', 'button_text', 'button_href', 'button_action', 'button_message']),
  seo: new Set(['titulo', 'descripcion', 'imagen']),
}
const HEADER = ['tipo', 'id', 'campo', 'valor', 'mostrar', 'orden']
const MAX_CELL_LENGTH = 4000
const ID_PATTERN = /^[a-z0-9_-]+$/

function isYes(value) {
  return String(value).trim().toLocaleUpperCase('es') === 'SI'
}

function cloneDefaults() {
  const collections = Object.fromEntries(
    Object.entries(DEFAULT_COLLECTIONS).map(([type, items]) => [
      type,
      items.map(item => ({ ...item, mostrar: true })),
    ]),
  )
  return {
    config: {
      ...DEFAULT_CONFIG,
      telefono_principal_tel: normalizePhone(DEFAULT_CONFIG.telefono_principal),
      telefono_2_tel: normalizePhone(DEFAULT_CONFIG.telefono_2),
      telefono_3_tel: normalizePhone(DEFAULT_CONFIG.telefono_3),
    },
    collections,
    issues: [],
    status: 'fallback',
    error: null,
  }
}

export function parseCSV(text) {
  if (typeof text !== 'string') throw new TypeError('El CSV CMS debe ser texto.')
  if (text.startsWith('\uFEFF')) text = text.slice(1)
  const rows = []
  let row = []
  let value = ''
  let quoted = false
  let closedQuote = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        value += '"'
        i += 1
      } else if (char === '"') {
        quoted = false
        closedQuote = true
      } else {
        value += char
      }
      continue
    }

    if (char === '"') {
      if (value !== '' || closedQuote) throw new Error('Comillas CSV en posición inválida.')
      quoted = true
    } else if (char === ',' || char === '\n' || char === '\r') {
      row.push(value)
      value = ''
      closedQuote = false
      if (char === ',') continue
      if (char === '\r' && text[i + 1] === '\n') i += 1
      if (row.some(cell => cell.trim() !== '')) rows.push(row)
      row = []
    } else {
      if (closedQuote) throw new Error('Contenido CSV después de una comilla de cierre.')
      value += char
    }
  }

  if (quoted) throw new Error('CSV inválido: comilla sin cerrar.')
  row.push(value)
  if (row.some(cell => cell.trim() !== '')) rows.push(row)
  return rows
}

export function normalizePhone(raw) {
  if (typeof raw !== 'string' && typeof raw !== 'number') return ''
  let digits = String(raw).replace(/\D/g, '')
  if (!digits) return ''

  if (digits.startsWith('549') && digits.length === 13) return `+${digits}`
  if (digits.startsWith('54') && digits.length === 12) return `+549${digits.slice(2)}`
  if (digits.startsWith('54') && digits.length === 13 && digits[2] === '9') return `+${digits}`

  if (digits.startsWith('0')) digits = digits.slice(1)
  if (digits.length === 11 && digits.startsWith('1115')) digits = `${digits.slice(0, 2)}${digits.slice(4)}`
  if (digits.length === 12 && digits.startsWith('15', 2)) digits = `${digits.slice(0, 2)}${digits.slice(4)}`
  else if (digits.length === 12 && digits.startsWith('15', 3)) digits = `${digits.slice(0, 3)}${digits.slice(5)}`
  if (digits.length !== 10) return ''

  return `+549${digits}`
}

export function normalizeWhatsApp(raw) {
  const normalized = normalizePhone(raw)
  return normalized.startsWith('+') ? normalized.slice(1) : ''
}

export function safeHref(raw) {
  if (typeof raw !== 'string') return ''
  const value = raw.trim()
  if (!value || value.length > 2048) return ''
  if (/^#[a-z][a-z0-9_-]*$/i.test(value)) return value
  if (/^tel:/i.test(value)) {
    const phone = normalizePhone(value.slice(4))
    return phone ? `tel:${phone}` : ''
  }
  if (/^mailto:[^\s<>]+@[^\s<>]+$/i.test(value)) return value
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password) return ''
    return url.href
  } catch {
    return ''
  }
}

function isSafeImage(value) {
  if (!value) return true
  if (/^\/assets\/(?!.*(?:^|\/)\.\.(?:\/|$))[\w./-]+$/.test(value)) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password
  } catch {
    return false
  }
}

function validateValue(type, field, value) {
  if (value.length > MAX_CELL_LENGTH) return 'cell_too_long'
  if (value === '' && !['mostrar', 'orden'].includes(field)) return null
  if (field === 'mostrar' || field === 'destacada' || field === 'nav_visible' || field === 'visible_en_servicios') {
    return /^(SI|NO)$/i.test(value) ? null : 'invalid_boolean'
  }
  if (field === 'orden') return Number.isFinite(Number(value)) && Number(value) >= 0 ? null : 'invalid_order'
  if (['imagen', 'mapa', 'logo_url', 'coverage_map_url', 'seo_image', 'trust_image'].includes(field)) return isSafeImage(value) ? null : 'unsafe_image_url'
  if (HTTPS_FIELDS.has(field)) {
    try {
      const url = new URL(value)
      if (url.protocol !== 'https:' || url.username || url.password) return 'unsafe_link'
    } catch {
      return 'unsafe_link'
    }
  }
  if (field.endsWith('_href') || ['maps_url', 'maps_embed_url', 'instagram_url', 'canonical_url'].includes(field)) {
    return safeHref(value) ? null : 'unsafe_link'
  }
  if (field === 'button_action' && !['whatsapp', 'phone', 'link'].includes(value.toLocaleLowerCase('es'))) return 'invalid_button_action'
  if (field === 'grupo') {
    const allowedGroups = type === 'card' ? CARD_GROUPS : type === 'boton' ? BUTTON_GROUPS : type === 'aviso' ? new Set(['hero']) : null
    if (allowedGroups && !allowedGroups.has(value)) return 'invalid_group'
  }
  if (type === 'config' && ['telefono_principal', 'telefono_2', 'telefono_3'].includes(field) && !normalizePhone(value)) return 'invalid_phone'
  if (type === 'config' && field === 'whatsapp_numero' && !normalizeWhatsApp(value)) return 'invalid_whatsapp'
  return null
}

function addIssue(issues, row, code) {
  issues.push({ row, code })
}

function mergeConfigValue(config, field, value) {
  if (!value) return
  if (field === 'whatsapp_numero') {
    config.whatsapp_numero = normalizeWhatsApp(value)
    return
  }
  if (field === 'telefono_principal' || field === 'telefono_2' || field === 'telefono_3') {
    config[field] = value
    config[`${field}_tel`] = normalizePhone(value)
    return
  }
  config[field] = value
}

export function parseCMS(text) {
  const normalized = text.replace(/^\uFEFF/, '')
  const rows = parseCSV(normalized)
  if (!rows.length || rows[0].length < HEADER.length || HEADER.some((field, index) => rows[0][index]?.trim().toLocaleLowerCase('es') !== field)) {
    throw new Error('Formato CMS inesperado: se requiere tipo,id,campo,valor,mostrar,orden.')
  }

  const cms = cloneDefaults()
  const records = new Map()
  const seen = new Set()
  const issues = []

  rows.slice(1).forEach((cells, index) => {
    const rowNumber = index + 2
    if (cells.length < HEADER.length) {
      addIssue(issues, rowNumber, 'missing_columns')
      return
    }
    const [rawType, rawId, rawField, rawValue = '', rawShow = 'SI', rawOrder = '0'] = cells
    const type = rawType.trim().toLocaleLowerCase('es')
    const id = rawId.trim().toLocaleLowerCase('es')
    const field = rawField.trim().toLocaleLowerCase('es')
    const value = rawValue.trim()
    const show = rawShow.trim()
    const order = rawOrder.trim() || '0'

    if (!TYPES.has(type) || !ID_PATTERN.test(id) || !ID_PATTERN.test(field)) {
      addIssue(issues, rowNumber, 'invalid_type_or_identifier')
      return
    }
    if (type === 'seccion' && !SECTION_IDS.has(id)) {
      addIssue(issues, rowNumber, 'unsupported_section')
      return
    }
    if (type === 'seo' && id !== 'home') {
      addIssue(issues, rowNumber, 'unsupported_seo_record')
      return
    }
    if (type === 'config' && (id !== 'site' || !CONFIG_FIELDS.has(field))) {
      addIssue(issues, rowNumber, 'unknown_config_field')
      return
    }
    if (type !== 'config' && !COLLECTION_FIELDS[type]?.has(field) && !['mostrar', 'orden'].includes(field)) {
      addIssue(issues, rowNumber, 'unknown_field')
      return
    }
    if (type === 'seccion') {
      const heroFields = new Set(['imagen', 'imagen_alt', 'boton', 'destacado'])
      const sectionButtonFields = new Set(['button_text', 'button_href', 'button_action', 'button_message'])
      if ((heroFields.has(field) && id !== 'hero') || (sectionButtonFields.has(field) && !['hero', 'preguntas', 'contacto'].includes(id))) {
        addIssue(issues, rowNumber, 'unsupported_field_for_section')
        return
      }
    }
    if (!/^(SI|NO)$/i.test(show)) {
      addIssue(issues, rowNumber, 'invalid_field_visibility')
      return
    }
    const valueError = validateValue(type, field, value)
    if (valueError) {
      addIssue(issues, rowNumber, valueError)
      return
    }
    const key = `${type}:${id}:${field}`
    if (seen.has(key)) {
      addIssue(issues, rowNumber, 'duplicate_field')
      return
    }
    seen.add(key)
    if (type === 'config') {
      if (isYes(show)) mergeConfigValue(cms.config, field, value)
      return
    }

    const recordKey = `${type}:${id}`
    let item = records.get(recordKey)
    if (!item) {
      item = { type, id, mostrar: isYes(show), orden: Number(order) }
      records.set(recordKey, item)
    } else {
      if (item.orden !== Number(order)) {
        addIssue(issues, rowNumber, 'inconsistent_item_order')
        return
      }
      if (item.mostrar !== isYes(show)) {
        addIssue(issues, rowNumber, 'inconsistent_item_visibility')
        return
      }
    }

    if (field === 'mostrar') {
      item.mostrar = isYes(value) && item.mostrar
    } else if (field === 'orden') {
      item.orden = Number(value)
    } else if (value !== '') {
      item[field] = field === 'button_action' ? value.toLocaleLowerCase('es') : value
    }
  })

  for (const item of records.values()) {
    const current = cms.collections[item.type] || []
    const defaultItem = current.find(candidate => candidate.id === item.id)
    if (defaultItem) Object.assign(defaultItem, item)
    else {
      ;(cms.collections[item.type] ||= []).push(item)
    }
  }
  for (const items of Object.values(cms.collections)) {
    items.sort((left, right) => left.orden - right.orden || left.id.localeCompare(right.id))
  }
  cms.issues = issues
  cms.status = 'ready'
  return cms
}

export function createFallbackCMS(error = null) {
  const fallback = cloneDefaults()
  fallback.error = error ? String(error.message || error) : null
  return fallback
}

export async function fetchCMS(fetcher = globalThis.fetch, signal, url = CMS_URL) {
  try {
    const response = await fetcher(url, { signal, cache: 'no-store' })
    if (!response.ok) throw new Error(`CMS HTTP ${response.status}`)
    const cms = parseCMS(await response.text())
    cms.status = 'ready'
    return cms
  } catch (error) {
    if (signal?.aborted) throw error
    return createFallbackCMS(error)
  }
}

export const cmsItems = (cms, type) => (cms?.collections?.[type] || []).filter(item => item.mostrar)
export const cmsItem = (cms, type, id) => cms?.collections?.[type]?.find(item => item.id === id)
