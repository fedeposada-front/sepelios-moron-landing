import { cmsItem, cmsItems } from '../cms/parseCMS'
import { useSiteDataContext } from '../context/useSiteDataContext'
import { CMSButtons, CMSCardActions } from './CMSBlocks'

export default function Process() {
  const { cms } = useSiteDataContext()
  const section = cmsItem(cms, 'seccion', 'proceso')
  const steps = cmsItems(cms, 'card').filter(item => item.grupo === 'proceso')

  return (
    <section className="section process" id="proceso">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">{section.eyebrow}</span>
          <h2>{section.titulo}</h2>
          <p>{section.descripcion}</p>
        </div>
        <div className="steps">
          {steps.map((item, index) => (
            <div className="step reveal" key={item.id}>
              {index < steps.length - 1 && <span className="step__line"></span>}
              <div className="step__num">{item.numero || String(index + 1).padStart(2, '0')}</div>
              <h3>{item.titulo}</h3>
              <p>{item.descripcion}</p>
              <CMSCardActions item={item} />
            </div>
          ))}
        </div>
        <CMSButtons group="proceso" />
      </div>
    </section>
  )
}
