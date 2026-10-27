import { useState, useEffect, useRef } from 'react'
import { cmsItem } from '../cms/parseCMS'
import { buildTelHref, buildWaHref } from '../cms/links'
import { useSiteDataContext } from '../context/useSiteDataContext'

const DESKTOP_NAV_IDS = ['servicios', 'instalaciones', 'cobertura', 'preguntas', 'contacto']
const MOBILE_NAV_IDS = ['servicios', 'instalaciones', 'proceso', 'cobertura', 'precios', 'preguntas', 'contacto']
const NAV_LABELS = {
  servicios: 'Servicios',
  instalaciones: 'Instalaciones',
  proceso: 'Cómo trabajamos',
  cobertura: 'Cobertura',
  precios: 'Precios',
  preguntas: 'Preguntas frecuentes',
  contacto: 'Contacto',
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data, cms } = useSiteDataContext()
  const burgerRef = useRef(null)
  const closeRef = useRef(null)
  const navItems = ids => ids
    .map(id => cmsItem(cms, 'seccion', id))
    .filter(section => section && section.mostrar !== false && section.nav_visible?.toLocaleUpperCase('es') !== 'NO')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (menuOpen) closeRef.current?.focus()
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    burgerRef.current?.focus()
  }

  const handleMenuKeyDown = event => {
    if (event.key === 'Escape') {
      closeMenu()
      return
    }
    if (event.key !== 'Tab') return
    const focusable = event.currentTarget.querySelectorAll('a[href], button:not([disabled])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`} id="header">
        <div className="wrap header__inner">
          <a href="#top" className="brand" aria-label="Sepelios Morón — inicio">
            <img className="brand__mark" src={data.logo_url} alt={data.logo_alt} />
            <span className="brand__name">
              <b>{data.brand_name}</b>
              <span>{data.brand_tagline}</span>
            </span>
          </a>

          <nav className="nav" aria-label="Navegación principal">
            {navItems(DESKTOP_NAV_IDS).map(section => (
              <a href={`#${section.id}`} key={section.id}>{section.id === 'preguntas' && (!section.nav_label || section.nav_label === NAV_LABELS.preguntas)
                ? 'Preguntas'
                : section.nav_label || NAV_LABELS[section.id]}</a>
            ))}
          </nav>

          <div className="header__cta">
            <a className="header__phone" href={buildTelHref(data.telefono_principal)} aria-label={`${data.header_phone_label}: ${data.telefono_principal}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{data.telefono_principal}</span>
            </a>
            <button ref={burgerRef} className="burger" aria-label="Abrir menú" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} id="mobile-navigation" role={menuOpen ? 'dialog' : undefined} aria-modal={menuOpen || undefined} aria-label={menuOpen ? 'Navegación móvil' : undefined} onKeyDown={handleMenuKeyDown}>
        <div className="mobile-menu__top">
          <span className="brand__name">
            <b style={{ fontFamily: 'var(--ff-head)', fontSize: '19px' }}>{data.brand_name}</b>
          </span>
          <button ref={closeRef} className="mobile-menu__close" aria-label="Cerrar menú" onClick={closeMenu}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
        <nav aria-label="Navegación móvil">
          {navItems(MOBILE_NAV_IDS).map(section => (
            <a href={`#${section.id}`} onClick={closeMenu} key={section.id}>
              {section.nav_label || NAV_LABELS[section.id]}
            </a>
          ))}
        </nav>
        <div className="mobile-menu__actions">
          <a
            className="btn btn--wa btn--lg btn--block"
            href={buildWaHref(data.whatsapp_numero, data.wa_msg_header)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.header_whatsapp_label}
          </a>
          <a className="btn btn--ghost btn--lg btn--block" href={buildTelHref(data.telefono_principal)}>
            {data.call_label} · {data.telefono_principal}
          </a>
        </div>
      </div>

      <span id="top"></span>
    </>
  )
}
