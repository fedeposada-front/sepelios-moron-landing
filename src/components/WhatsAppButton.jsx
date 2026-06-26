import { useSiteDataContext } from '../context/SiteDataContext'
import { buildWaHref } from '../hooks/useSiteData'

const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.47 14.38c-.3-.15-1.74-.86-2-.96-.27-.1-.47-.15-.66.15-.2.3-.76.95-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5l-.56-.01c-.2 0-.5.07-.77.36s-1.02 1-1.02 2.42 1.05 2.8 1.2 3c.15.2 2.07 3.16 5.02 4.43.7.3 1.25.48 1.67.62.7.22 1.34.2 1.85.12.56-.08 1.74-.71 1.98-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
  </svg>
)

export default function WhatsAppButton() {
  const { data } = useSiteDataContext()

  return (
    <>
      <a
        className="fab"
        href={buildWaHref(data.whatsapp_numero, data.wa_msg_asistencia)}
        target="_blank"
        rel="noopener"
        aria-label="Contactar por WhatsApp"
      >
        <span className="fab__pulse"></span>
        <WaIcon />
        <span className="fab__label">WhatsApp</span>
      </a>

      <div className="mobile-bar">
        <a
          className="btn btn--wa"
          href={buildWaHref(data.whatsapp_numero, data.wa_msg_asistencia)}
          target="_blank"
          rel="noopener"
        >
          Contactar por WhatsApp
        </a>
        <a className="call" href={`tel:${data.telefono_principal_tel}`} aria-label="Llamar ahora">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
      </div>
    </>
  )
}
