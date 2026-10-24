import { cmsItem } from '../cms/parseCMS'
import { useSiteDataContext } from '../context/useSiteDataContext'
import { CMSButtons, CMSCards } from './CMSBlocks'

export default function Services() {
  const { cms } = useSiteDataContext()
  const section = cmsItem(cms, 'seccion', 'servicios')

  return (
    <section className="section" id="servicios">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">{section.eyebrow}</span>
          <h2>{section.titulo}</h2>
          <p>{section.descripcion}</p>
        </div>
        <CMSCards type="servicio" />
        <CMSButtons group="servicios" />
      </div>
    </section>
  )
}
