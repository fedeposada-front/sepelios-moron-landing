import { useState, useEffect } from 'react'
import { useSiteDataContext } from '../context/SiteDataContext'
import { buildWaHref } from '../hooks/useSiteData'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data } = useSiteDataContext()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`} id="header">
        <div className="wrap header__inner">
          <a href="#top" className="brand" aria-label="Sepelios Morón — inicio">
            <img className="brand__mark" src="/assets/logo-sm.png" alt="Logo Sepelios Morón" />
            <span className="brand__name">
              <b>Sepelios Morón</b>
              <span>Atención las 24 horas</span>
            </span>
          </a>

          <nav className="nav" aria-label="Navegación principal">
            <a href="#servicios">Servicios</a>
            <a href="#instalaciones">Instalaciones</a>
            <a href="#proceso">Cómo trabajamos</a>
            <a href="#cobertura">Cobertura</a>
            <a href="#preguntas">Preguntas</a>
            <a href="#contacto">Contacto</a>
          </nav>

          <div className="header__cta">
            <a className="header__phone" href={data.telefono_principal_tel}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span><small>Línea directa</small>{data.telefono_principal}</span>
            </a>
            <a
              className="btn btn--wa"
              href={buildWaHref(data.whatsapp_numero, data.wa_msg_header)}
              target="_blank"
              rel="noopener"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.47 14.38c-.3-.15-1.74-.86-2-.96-.27-.1-.47-.15-.66.15-.2.3-.76.95-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5l-.56-.01c-.2 0-.5.07-.77.36s-1.02 1-1.02 2.42 1.05 2.8 1.2 3c.15.2 2.07 3.16 5.02 4.43.7.3 1.25.48 1.67.62.7.22 1.34.2 1.85.12.56-.08 1.74-.71 1.98-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.46 9.46 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.45 9.45 0 1 1 8.03 4.43zM20.5 3.49A11.78 11.78 0 0 0 12.04 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.16 1.6 5.97L0 24l6.22-1.63a11.9 11.9 0 0 0 5.82 1.48h.01c6.58 0 11.94-5.36 11.94-11.95 0-3.19-1.24-6.19-3.49-8.41z" />
              </svg>
              WhatsApp
            </a>
            <button className="burger" aria-label="Abrir menú" onClick={() => setMenuOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="mobile-menu__top">
          <span className="brand__name">
            <b style={{ fontFamily: 'var(--ff-head)', fontSize: '19px' }}>Sepelios Morón</b>
          </span>
          <button className="mobile-menu__close" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
        <nav>
          <a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
          <a href="#instalaciones" onClick={() => setMenuOpen(false)}>Instalaciones</a>
          <a href="#proceso" onClick={() => setMenuOpen(false)}>Cómo trabajamos</a>
          <a href="#cobertura" onClick={() => setMenuOpen(false)}>Cobertura</a>
          <a href="#precios" onClick={() => setMenuOpen(false)}>Precios</a>
          <a href="#preguntas" onClick={() => setMenuOpen(false)}>Preguntas frecuentes</a>
          <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
        </nav>
        <div className="mobile-menu__actions">
          <a
            className="btn btn--wa btn--lg btn--block"
            href={buildWaHref(data.whatsapp_numero, data.wa_msg_header)}
            target="_blank"
            rel="noopener"
          >
            Contactar por WhatsApp
          </a>
          <a className="btn btn--ghost btn--lg btn--block" href={data.telefono_principal_tel}>
            Llamar ahora · {data.telefono_principal}
          </a>
        </div>
      </div>

      <span id="top"></span>
    </>
  )
}
