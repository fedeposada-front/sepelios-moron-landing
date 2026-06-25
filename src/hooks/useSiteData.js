import { useState, useEffect } from 'react'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSkSfWqKhzXqok3XzWRcfjktTa_N7DHjWZkyeBPuOxlF8KpsP8Ntq-WiNY09M-Is2Rim-MQaA_HyxqQ/pub?gid=0&single=true&output=csv'

function normalizeArgPhone(raw) {
  if (!raw) return ''
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('54') && digits.length >= 12) {
    return '+' + digits
  }
  if (digits.startsWith('0')) {
    digits = digits.slice(1)
  }
  if (digits.length === 10 && digits.slice(2, 4) === '15') {
    digits = digits.slice(0, 2) + digits.slice(4)
  }
  if (digits.length < 9) return raw
  return '+549' + digits.slice(-10).replace(/^9/, '')
}

export function buildWaHref(numero, mensaje) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
}

export function fillPrecio(template, precio) {
  return template.replace('{precio}', precio)
}

const FALLBACK = {
  telefono_principal: '11-5413-3407',
  telefono_principal_tel: '+5491154133407',
  telefono_2: '11-3918-7173',
  telefono_2_tel: '+5491139187173',
  telefono_3: '11-4975-6793',
  telefono_3_tel: '+5491149756793',
  whatsapp_numero: '5491154133407',
  direccion_calle: 'M. Sarratea 383, Morón',
  direccion_provincia: 'Provincia de Buenos Aires',
  horario_atencion: 'Atención las 24 horas, todos los días del año',
  precio_cremacion: 'Consultar valor actualizado',
  precio_cremacion_subtexto: 'Presupuesto sin cargo por WhatsApp',
  precio_velatorio: 'Consultar valor actualizado',
  precio_velatorio_subtexto: 'Presupuesto sin cargo por WhatsApp',
  precio_traslado: 'Según distancia y gestión',
  precio_traslado_subtexto: 'Le cotizamos según el destino',
  precio_nota: 'Los valores se informan actualizados al momento de la consulta. Escribanos por WhatsApp y le enviamos un presupuesto claro y sin compromiso.',
  wa_msg_header: 'Hola Sepelios Morón, necesito información sobre sus servicios.',
  wa_msg_asistencia: 'Hola Sepelios Morón, necesito asistencia.',
  wa_msg_cremacion_consulta: 'Hola, quiero consultar el valor de una cremación.',
  wa_msg_cremacion_contratar: 'Hola, quiero contratar el servicio de cremación. Vi que el valor es {precio}.',
  wa_msg_velatorio_consulta: 'Hola, quiero consultar el valor de un servicio velatorio.',
  wa_msg_velatorio_contratar: 'Hola, quiero contratar el servicio de velatorio. Vi que el valor es {precio}.',
  wa_msg_traslado_consulta: 'Hola, quiero consultar el valor de un traslado.',
  wa_msg_traslado_contratar: 'Hola, quiero contratar el servicio de traslado. Vi que el valor es {precio}.',
  wa_msg_faq: 'Hola, tengo una consulta.',
  wa_msg_contacto: 'Hola Sepelios Morón, necesito asistencia.',
  zona_principal: 'Morón',
  zona_2: 'Castelar',
  zona_3: 'Haedo',
  zona_4: 'Ituzaingó',
  zona_5: 'Ramos Mejía',
  zona_6: 'Merlo',
  zona_7: 'Zona Oeste',
}

export function useSiteData() {
  const [data, setData] = useState(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(CSV_URL)
      .then(r => r.text())
      .then(text => {
        const lines = text.trim().split('\n').slice(1)
        const parsed = {}
        lines.forEach(line => {
          const commaIndex = line.indexOf(',')
          if (commaIndex === -1) return
          const key = line.slice(0, commaIndex).trim().replace(/^"|"$/g, '')
          const value = line.slice(commaIndex + 1).trim().replace(/^"|"$/g, '')
          if (key) parsed[key] = value
        })
        parsed.telefono_principal_tel = normalizeArgPhone(parsed.telefono_principal || FALLBACK.telefono_principal)
        parsed.telefono_2_tel = normalizeArgPhone(parsed.telefono_2 || FALLBACK.telefono_2)
        parsed.telefono_3_tel = normalizeArgPhone(parsed.telefono_3 || FALLBACK.telefono_3)
        setData({ ...FALLBACK, ...parsed })
      })
      .catch(() => setData(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading }
}
