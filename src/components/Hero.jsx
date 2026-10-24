import { cmsItem, cmsItems } from '../cms/parseCMS'
import { buildTelHref, resolveButtonHref } from '../cms/links'
import { useSiteDataContext } from '../context/useSiteDataContext'
import { CMSButtons, CMSCardActions, CMSNotices } from './CMSBlocks'

function TrustIcon({ name }) {
  if (name === 'clock') {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  }
  if (name === 'location') {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
}

export default function Hero() {
  const { data, cms } = useSiteDataContext()
  const content = cmsItem(cms, 'seccion', 'hero')
  const trustItems = cmsItems(cms, 'card').filter(item => item.grupo === 'hero-trust')
  const title = content.titulo
  const emphasis = content.destacado || ''
  const start = emphasis ? title.toLocaleLowerCase('es').indexOf(emphasis.toLocaleLowerCase('es')) : -1
  const buttonText = content.button_text || content.boton || data.header_whatsapp_label
  const buttonHref = resolveButtonHref(content, data, 'whatsapp', content.button_message || data.wa_msg_asistencia)

  return (
    <section className="hero">
      <div className="hero__media">
        <img src={content.imagen} alt={content.imagen_alt} />
      </div>
      <div className="wrap hero__inner reveal">
        <CMSNotices group="hero" />
        <span className="hero__eyebrow">
          <span className="dot"></span> {content.eyebrow}
        </span>
        <h1>{start >= 0 ? <>{title.slice(0, start)}<em>{title.slice(start, start + emphasis.length)}</em>{title.slice(start + emphasis.length)}</> : title}</h1>
        <p className="hero__sub">{content.descripcion}</p>
        <div className="hero__actions">
          {buttonHref && (
            <a className={`btn ${buttonHref.startsWith('https:') ? 'btn--wa' : 'btn--primary'} btn--lg`} href={buttonHref} target={buttonHref.startsWith('https:') ? '_blank' : undefined} rel={buttonHref.startsWith('https:') ? 'noopener noreferrer' : undefined}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.47 14.38c-.3-.15-1.74-.86-2-.96-.27-.1-.47-.15-.66.15-.2.3-.76.95-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5l-.56-.01c-.2 0-.5.07-.77.36s-1.02 1-1.02 2.42 1.05 2.8 1.2 3c.15.2 2.07 3.16 5.02 4.43.7.3 1.25.48 1.67.62.7.22 1.34.2 1.85.12.56-.08 1.74-.71 1.98-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
              </svg>
              {buttonText}
            </a>
          )}
          <a className="btn btn--ghost-light btn--lg" href={buildTelHref(data.telefono_principal)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {data.call_label}
          </a>
        </div>
        <div className="hero__trust">
          {trustItems.map(item => (
            <div className="item" key={item.id}>
              <TrustIcon name={item.icono} />
              <span>{item.titulo}</span>
              <CMSCardActions item={item} />
            </div>
          ))}
        </div>
        <CMSButtons group="hero" />
      </div>
    </section>
  )
}
