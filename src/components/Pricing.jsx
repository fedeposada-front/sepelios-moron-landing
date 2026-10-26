import { cmsItem, cmsItems } from '../cms/parseCMS'
import { fillPrecio, resolveButtonHref } from '../cms/links'
import { useSiteDataContext } from '../context/useSiteDataContext'
import { CMSButtons } from './CMSBlocks'

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const PLACEHOLDER_PATTERN = /consultar|según distancia|presupuesto|cotizamos/i
const isRealPrice = value => Boolean(value && !PLACEHOLDER_PATTERN.test(value))

export default function Pricing() {
  const { data, cms } = useSiteDataContext()
  const section = cmsItem(cms, 'seccion', 'precios')
  const cards = cmsItems(cms, 'precio')
  const featuredId = cards.find(item => item.destacada?.toLocaleUpperCase('es') === 'SI')?.id
    || (cards.some(item => item.id === 'velatorio') ? 'velatorio' : '')

  return (
    <section className="section process" id="precios">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">{section.eyebrow}</span>
          <h2>{section.titulo}</h2>
          <p>{section.descripcion}</p>
        </div>
        <div className="pricing-grid">
          {cards.map(item => {
            const price = item.precio || data[`precio_${item.id}`] || 'Consultar valor actualizado'
            const subtext = item.subtexto || data[`precio_${item.id}_subtexto`] || ''
            const hasPrice = isRealPrice(price)
            const defaultMessage = hasPrice ? data[`wa_msg_${item.id}_contratar`] : data[`wa_msg_${item.id}_consulta`]
            const message = fillPrecio(item.button_message || defaultMessage || data.wa_msg_asistencia, price)
            const href = resolveButtonHref(item, data, 'whatsapp', message)
            const benefits = [item.beneficio_1, item.beneficio_2, item.beneficio_3].filter(Boolean)
            const buttonText = item.button_text || (hasPrice ? data.price_hire_label : data.price_consult_label)

            return (
              <article
                className={`price-card${featuredId === item.id ? ' is-featured' : ''} reveal`}
                key={item.id}
                data-featured-label={data.price_featured_label}
              >
                <div className="price-card__name">{item.titulo}</div>
                <p className="price-card__desc">{item.descripcion}</p>
                <div className={`price-card__value${hasPrice ? ' price-card__value--precio' : ''}`}>
                  {!hasPrice && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <div><b>{price}</b><small>{subtext}</small></div>
                </div>
                <ul className="price-card__feats">
                  {benefits.map((benefit, index) => <li key={`${item.id}-benefit-${index}`}><CheckIcon /> {benefit}</li>)}
                </ul>
                {href && (
                  <a
                    className={`btn ${featuredId === item.id ? 'btn--wa' : 'btn--primary'} btn--block`}
                    href={href}
                    target={href.startsWith('https:') ? '_blank' : undefined}
                    rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined}
                  >
                    {buttonText}
                  </a>
                )}
              </article>
            )
          })}
        </div>
        <p className="pricing-note">{data.precio_nota}</p>
        <CMSButtons group="precios" />
      </div>
    </section>
  )
}
