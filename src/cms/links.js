import { normalizePhone, normalizeWhatsApp, safeHref } from './parseCMS.js'

export function buildTelHref(rawPhone) {
  const phone = normalizePhone(rawPhone)
  return phone ? `tel:${phone}` : ''
}

export function buildWaHref(rawPhone, message = '') {
  const phone = normalizeWhatsApp(rawPhone)
  if (!phone) return ''
  return `https://wa.me/${phone}?text=${encodeURIComponent(String(message))}`
}

export function fillPrecio(template = '', precio = '') {
  return String(template).replaceAll('{precio}', String(precio))
}

export function resolveButtonHref(item, config, defaultAction = 'whatsapp', message = config.wa_msg_asistencia) {
  const action = (item?.button_action || defaultAction).toLocaleLowerCase('es')
  if (action === 'phone') return buildTelHref(config.telefono_principal)
  if (action === 'whatsapp') return buildWaHref(config.whatsapp_numero, message)
  if (action === 'link') return safeHref(item?.button_href)
  return ''
}
