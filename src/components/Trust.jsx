import { cmsItem, cmsItems } from '../cms/parseCMS'
import { useSiteDataContext } from '../context/useSiteDataContext'
import { CMSButtons, CMSCardActions } from './CMSBlocks'

export default function Trust() {
  const { data, cms } = useSiteDataContext()
  const section = cmsItem(cms, 'seccion', 'confianza')
  const items = cmsItems(cms, 'card').filter(item => item.grupo === 'confianza')

  return (
    <section className="section trust" id="confianza">
      <div className="wrap">
        <div className="trust-grid">
          <div>
            <div className="section-head reveal" style={{ marginBottom: '32px' }}>
              <span className="eyebrow">{section.eyebrow}</span>
              <h2>{section.titulo}</h2>
              {section.descripcion && <p>{section.descripcion}</p>}
            </div>
            <div className="trust-list reveal">
              {items.map(item => (
                <div className="trust-item" key={item.id}>
                  <span className="trust-item__num">{item.numero}</span>
                  <div>
                    <h3>{item.titulo}</h3>
                    <p>{item.descripcion}</p>
                    <CMSCardActions item={item} />
                  </div>
                  <CMSButtons group="confianza" />
                </div>
              ))}
            </div>
          </div>
          <figure className="trust-figure reveal">
            <img src={data.trust_image} alt={data.trust_image_alt} loading="lazy" />
            <div className="badge">
              <b>{data.trust_badge_title}</b>
              <span>{data.trust_badge_description}</span>
            </div>
          </figure>
        </div>
      </div>
    </section>
  )
}
