import { cmsItem, cmsItems } from '../cms/parseCMS'
import { useSiteDataContext } from '../context/useSiteDataContext'
import { CMSButtons, CMSCardActions } from './CMSBlocks'

export default function Facilities() {
  const { cms } = useSiteDataContext()
  const section = cmsItem(cms, 'seccion', 'instalaciones')
  const facilities = cmsItems(cms, 'card').filter(item => item.grupo === 'instalacion')
  const note = cmsItems(cms, 'card').find(item => item.grupo === 'instalacion-nota')
  const [featured, ...rest] = facilities

  return (
    <section className="section" id="instalaciones">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">{section.eyebrow}</span>
          <h2>{section.titulo}</h2>
          {section.descripcion && <p>{section.descripcion}</p>}
        </div>
        <div className="facilities-grid">
          {featured && (
            <figure className="facility facility--tall reveal">
              {featured.imagen && <img src={featured.imagen} alt={featured.imagen_alt || featured.titulo} loading="lazy" />}
              <figcaption className="facility__cap">
                <b>{featured.titulo}</b>
                {featured.descripcion && <p>{featured.descripcion}</p>}
                <CMSCardActions item={featured} />
              </figcaption>
            </figure>
          )}
          <div className="facility-stack">
            {rest.map(item => (
              <figure className="facility reveal" key={item.id}>
                {item.imagen && <img src={item.imagen} alt={item.imagen_alt || item.titulo} loading="lazy" />}
                <figcaption className="facility__cap">
                  <b>{item.titulo}</b>
                  {item.descripcion && <p>{item.descripcion}</p>}
                  <CMSCardActions item={item} />
                </figcaption>
              </figure>
            ))}
            {note && <div className="facility-note reveal"><p className="q">"{note.titulo}"</p><p>{note.descripcion}</p><CMSCardActions item={note} /></div>}
          </div>
          <CMSButtons group="instalaciones" />
        </div>
      </div>
    </section>
  )
}
