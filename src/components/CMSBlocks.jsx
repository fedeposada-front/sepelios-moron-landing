import { cmsItem, cmsItems, safeHref } from '../cms/parseCMS'
import { resolveButtonHref } from '../cms/links'
import { useSiteDataContext } from '../context/useSiteDataContext'

export function CMSSection({ id, children }) {
  const { cms } = useSiteDataContext()
  return cmsItem(cms, 'seccion', id)?.mostrar === false ? null : children
}

export function CMSCardActions({ item }) {
  const { data } = useSiteDataContext()
  const buttonHref = item.button_text
    ? resolveButtonHref(item, data, 'whatsapp', item.button_message || data.wa_msg_asistencia)
    : ''
  const linkHref = item.enlace_texto ? safeHref(item.enlace_href) : ''

  if (!buttonHref && !linkHref) return null
  return (
    <div className="cms-button-group">
      {buttonHref && (
        <a
          className={`btn ${buttonHref.startsWith('https:') ? 'btn--wa' : 'btn--primary'}`}
          href={buttonHref}
          target={buttonHref.startsWith('https:') ? '_blank' : undefined}
          rel={buttonHref.startsWith('https:') ? 'noopener noreferrer' : undefined}
        >
          {item.button_text}
        </a>
      )}
      {linkHref && <a className="cms-card__link" href={linkHref}>{item.enlace_texto}</a>}
    </div>
  )
}

export function CMSButtons({ group }) {
  const { data, cms } = useSiteDataContext()
  const buttons = cmsItems(cms, 'boton').filter(button => button.grupo === group)
  if (!buttons.length) return null

  return (
    <div className="cms-button-group">
      {buttons.map(button => {
        const href = resolveButtonHref(button, data, 'link', button.button_message || data.wa_msg_asistencia)
        if (!href) return null
        return (
          <a
            className="btn btn--primary"
            href={href}
            target={href.startsWith('https:') ? '_blank' : undefined}
            rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined}
            key={button.id}
          >
            {button.button_text || button.titulo}
          </a>
        )
      })}
    </div>
  )
}

export function CMSNotices({ group }) {
  const { data, cms } = useSiteDataContext()
  const notices = cmsItems(cms, 'aviso').filter(notice => notice.grupo === group)
  if (!notices.length) return null

  return (
    <div className="cms-notices">
      {notices.map(notice => {
        const href = notice.button_text
          ? resolveButtonHref(notice, data, 'whatsapp', notice.button_message || data.wa_msg_asistencia)
          : ''
        return (
          <aside className="cms-notice" role="status" key={notice.id}>
            {notice.titulo && <strong>{notice.titulo}</strong>}
            {notice.descripcion && <p>{notice.descripcion}</p>}
            {notice.button_text && href && (
              <a href={href} target={href.startsWith('https:') ? '_blank' : undefined} rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined}>
                {notice.button_text}
              </a>
            )}
          </aside>
        )
      })}
    </div>
  )
}
