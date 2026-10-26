import { cmsItem, cmsItems } from '../cms/parseCMS'
import { useSiteDataContext } from '../context/useSiteDataContext'
import { CMSButtons } from './CMSBlocks'

export default function Coverage() {
  const { data, cms } = useSiteDataContext()
  const section = cmsItem(cms, 'seccion', 'cobertura')
  const zones = cmsItems(cms, 'zona')

  return (
    <section className="section" id="cobertura">
      <div className="wrap">
        <div className="coverage-grid">
          <div className="reveal">
            <div className="section-head" style={{ marginBottom: '8px' }}>
              <span className="eyebrow">{section.eyebrow}</span>
              <h2>{section.titulo}</h2>
              <p>{section.descripcion}</p>
            </div>
            <CMSButtons group="cobertura" />
            <div className="zones">
              {zones.map((zone, index) => (
                <span key={zone.id} className={`zone${index === 0 ? ' is-primary' : ''}`}>
                  {index === 0 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  )}
                  {zone.nombre}
                </span>
              ))}
            </div>
            {zones.length > 0 && <p className="coverage__note">{data.coverage_note}</p>}
          </div>
          <div className="coverage-image reveal">
            <img src={data.coverage_map_url} alt={data.coverage_map_alt} loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  )
}
