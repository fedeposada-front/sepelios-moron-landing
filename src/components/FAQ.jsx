import { useState } from 'react'
import { useSiteDataContext } from '../context/SiteDataContext'
import { buildWaHref } from '../hooks/useSiteData'

const items = [
  {
    q: '¿Atienden las 24 horas?',
    a: 'Sí. Sepelios Morón brinda atención fúnebre las 24 horas, todos los días del año. Puede comunicarse en cualquier momento por WhatsApp o teléfono y le responderemos de inmediato.',
  },
  {
    q: '¿Realizan cremaciones en Morón?',
    a: 'Realizamos servicios de cremación con la máxima dignidad, coordinando todo el proceso y ofreciendo distintas opciones de urnas y memoriales para la familia.',
  },
  {
    q: '¿Ofrecen salas velatorias?',
    a: 'Sí, contamos con salas velatorias sobrias y preparadas para recibir a familiares y allegados en un ambiente de calma, privacidad y respeto.',
  },
  {
    q: '¿Hacen traslados al interior o exterior del país?',
    a: 'Coordinamos traslados nacionales e internacionales, gestionando la documentación y los permisos necesarios de principio a fin, con ambulancia propia.',
  },
  {
    q: '¿Puedo consultar precios por WhatsApp?',
    a: 'Por supuesto. Escríbanos por WhatsApp al 11-5413-3407 y le enviamos un presupuesto claro y actualizado, sin compromiso, según el servicio que necesite.',
  },
  {
    q: '¿Dónde están ubicados?',
    a: 'Nuestra oficina está en M. Sarratea 383, Morón, Provincia de Buenos Aires. Atendemos en Morón y toda la Zona Oeste: Castelar, Haedo, Ituzaingó, Ramos Mejía y Merlo.',
  },
]

export default function FAQ() {
  const { data } = useSiteDataContext()
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section className="section" id="preguntas">
      <div className="wrap">
        <div className="faq-wrap">
          <div className="reveal">
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 style={{ fontSize: 'clamp(28px,3.4vw,40px)', marginTop: '16px' }}>
              Respondemos sus dudas
            </h2>
            <p style={{ color: 'var(--muted)', marginTop: '16px', fontSize: '16px' }}>
              Si tiene cualquier otra consulta, escríbanos por WhatsApp y le respondemos de inmediato, a cualquier hora.
            </p>
            <a
              className="btn btn--wa btn--lg"
              style={{ marginTop: '24px' }}
              href={buildWaHref(data.whatsapp_numero, data.wa_msg_faq)}
              target="_blank"
              rel="noopener"
            >
              Hacer una consulta
            </a>
          </div>
          <div className="faq-list">
            {items.map((item, i) => (
              <div key={i} className={openIndex === i ? 'faq-item open' : 'faq-item'}>
                <button className="faq-q" onClick={() => toggle(i)}>
                  {item.q}
                  <span className="ic"></span>
                </button>
                <div className="faq-a" style={{ maxHeight: openIndex === i ? '400px' : '0' }}>
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
