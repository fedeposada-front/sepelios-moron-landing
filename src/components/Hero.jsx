import { useSiteDataContext } from '../context/SiteDataContext'
import { buildWaHref } from '../hooks/useSiteData'

export default function Hero() {
  const { data } = useSiteDataContext()

  return (
    <section className="hero">
      <div className="hero__media">
        <img src="/assets/storefront.png" alt="Frente de Sepelios Morón en M. Sarratea 383, Morón" />
      </div>
      <div className="wrap hero__inner reveal">
        <span className="hero__eyebrow">
          <span className="dot"></span> Atención disponible ahora · 24 horas
        </span>
        <h1>Atención fúnebre las <em>24 horas</em> en Morón</h1>
        <p className="hero__sub">
          Cremaciones, salas velatorias, traslados y acompañamiento integral para las familias, con trato humano y respetuoso en cada paso.
        </p>
        <div className="hero__actions">
          <a
            className="btn btn--wa btn--lg"
            href={buildWaHref(data.whatsapp_numero, data.wa_msg_asistencia)}
            target="_blank"
            rel="noopener"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.47 14.38c-.3-.15-1.74-.86-2-.96-.27-.1-.47-.15-.66.15-.2.3-.76.95-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5l-.56-.01c-.2 0-.5.07-.77.36s-1.02 1-1.02 2.42 1.05 2.8 1.2 3c.15.2 2.07 3.16 5.02 4.43.7.3 1.25.48 1.67.62.7.22 1.34.2 1.85.12.56-.08 1.74-.71 1.98-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
            </svg>
            Contactar por WhatsApp
          </a>
          <a className="btn btn--ghost-light btn--lg" href={`tel:${data.telefono_principal_tel}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Llamar ahora
          </a>
        </div>
        <div className="hero__trust">
          <span className="item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Atención 24 hs
          </span>
          <span className="item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Morón y alrededores
          </span>
          <span className="item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Gestión integral
          </span>
        </div>
      </div>
    </section>
  )
}
