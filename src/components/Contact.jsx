import { cmsItem } from '../cms/parseCMS'
import { buildTelHref, resolveButtonHref } from '../cms/links'
import { useSiteDataContext } from '../context/useSiteDataContext'

export default function Contact() {
  const { data, cms } = useSiteDataContext()
  const section = cmsItem(cms, 'seccion', 'contacto')
  const contactHref = resolveButtonHref(section, data, 'whatsapp', section.button_message || data.wa_msg_contacto)

  return (
    <section className="section contact" id="contacto">
      <div className="wrap">
        <div className="contact-grid">
          <div className="reveal">
            <span className="eyebrow">{section.eyebrow}</span>
            <h2 style={{ marginTop: '16px' }}>{section.titulo}</h2>
            <p className="contact__lead">{section.descripcion}</p>
            <div className="contact-lines">
              <div className="cline">
                <span className="cline__ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div className="cline__body">
                  <label className="contact-label">{data.contact_address_label}</label>
                  <b>{data.direccion_calle}</b>
                  <div className="alt">{data.direccion_provincia}</div>
                </div>
              </div>
              <div className="cline">
                <span className="cline__ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <div className="cline__body">
                  <label className="contact-label">{data.contact_phones_label}</label>
                  <b><a href={buildTelHref(data.telefono_principal)}>{data.telefono_principal}</a></b>
                  <div className="phones-alt">
                    <a href={buildTelHref(data.telefono_2)}>{data.telefono_2}</a>
                    <a href={buildTelHref(data.telefono_3)}>{data.telefono_3}</a>
                  </div>
                </div>
              </div>
              <div className="cline">
                <span className="cline__ic">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.47 14.38c-.3-.15-1.74-.86-2-.96-.27-.1-.47-.15-.66.15-.2.3-.76.95-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5l-.56-.01c-.2 0-.5.07-.77.36s-1.02 1-1.02 2.42 1.05 2.8 1.2 3c.15.2 2.07 3.16 5.02 4.43.7.3 1.25.48 1.67.62.7.22 1.34.2 1.85.12.56-.08 1.74-.71 1.98-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
                  </svg>
                </span>
                <div className="cline__body">
                  <label className="contact-label">{data.contact_whatsapp_label}</label>
                  <div className="alt">{data.horario_atencion}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-card reveal">
            <h3>{data.brand_name}</h3>
            <p>{data.direccion_calle} — {data.direccion_provincia}</p>
            <div className="map">
              <iframe
                src={data.maps_embed_url}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title={data.map_iframe_title}
              />
            </div>
            <a className="map-link" href={data.maps_url} target="_blank" rel="noopener noreferrer">
              {data.map_link_label}
            </a>
            <div className="hours">
              <span className="dot"></span>
              {data.horario_atencion}
            </div>
            {contactHref && (
              <a
                className={`btn ${contactHref.startsWith('https:') ? 'btn--wa' : 'btn--primary'} btn--lg btn--block`}
                href={contactHref}
                target={contactHref.startsWith('https:') ? '_blank' : undefined}
                rel={contactHref.startsWith('https:') ? 'noopener noreferrer' : undefined}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.47 14.38c-.3-.15-1.74-.86-2-.96-.27-.1-.47-.15-.66.15-.2.3-.76.95-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5l-.56-.01c-.2 0-.5.07-.77.36s-1.02 1-1.02 2.42 1.05 2.8 1.2 3c.15.2 2.07 3.16 5.02 4.43.7.3 1.25.48 1.67.62.7.22 1.34.2 1.85.12.56-.08 1.74-.71 1.98-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
                </svg>
                {section.button_text || data.contact_button_label}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
