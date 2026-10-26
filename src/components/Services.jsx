import { cmsItem, cmsItems } from '../cms/parseCMS'
import { useSiteDataContext } from '../context/useSiteDataContext'
import { CMSButtons, CMSCardActions } from './CMSBlocks'

function ServiceIcon({ name }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.7', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  if (name === 'flame') return <svg {...common}><path d="M12 2c1 3-1 4-1 6a3 3 0 0 0 6 0c0-1-.3-2-1-3 2 1 4 3.5 4 7a7 7 0 0 1-14 0c0-4 3-6 4-8 .8-1.4 1.5-2.5 2-2z" /></svg>
  if (name === 'house') return <svg {...common}><path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" /><line x1="9" y1="21" x2="9" y2="12" /><line x1="15" y1="21" x2="15" y2="12" /><path d="M12 4v3" /></svg>
  if (name === 'truck') return <svg {...common}><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
  if (name === 'flower') return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M12 9c0-3 1.5-5 0-7-1.5 2 0 4 0 7zM12 15c0 3-1.5 5 0 7 1.5-2 0-4 0-7zM9 12c-3 0-5-1.5-7 0 2 1.5 4 0 7 0zM15 12c3 0 5 1.5 7 0-2-1.5-4 0-7 0z" /></svg>
  if (name === 'file-text') return <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" /></svg>
  return <svg {...common}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
}

export default function Services() {
  const { cms } = useSiteDataContext()
  const section = cmsItem(cms, 'seccion', 'servicios')
  const services = cmsItems(cms, 'servicio').filter(item => item.visible_en_servicios?.toLocaleUpperCase('es') !== 'NO')

  return (
    <section className="section" id="servicios">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">{section.eyebrow}</span>
          <h2>{section.titulo}</h2>
          <p>{section.descripcion}</p>
        </div>
        <div className="services-grid">
          {services.map(item => (
            <article className="card reveal" key={item.id}>
              {item.imagen
                ? <img className="cms-card__image" src={item.imagen} alt={item.imagen_alt || item.titulo} loading="lazy" />
                : <div className="card__icon"><ServiceIcon name={item.icono} /></div>}
              <h3>{item.titulo}</h3>
              <p>{item.descripcion}</p>
              <CMSCardActions item={item} />
            </article>
          ))}
        </div>
        <CMSButtons group="servicios" />
      </div>
    </section>
  )
}
