import { useSiteDataContext } from '../context/SiteDataContext'

function parseZonas(raw) {
  if (!raw) return []
  return raw.split('|').map(z => z.trim()).filter(Boolean)
}

export default function Coverage() {
  const { data } = useSiteDataContext()
  const zonas = parseZonas(data.zonas_cobertura)

  return (
    <section className="section" id="cobertura">
      <div className="wrap">
        <div className="coverage-grid">
          <div className="reveal">
            <div className="section-head" style={{ marginBottom: '8px' }}>
              <span className="eyebrow">Cobertura</span>
              <h2>Atendemos en Morón y alrededores</h2>
              <p>Llegamos con rapidez a toda la Zona Oeste del Gran Buenos Aires, con la misma atención cuidada en cada localidad.</p>
            </div>
            <div className="zones">
              {zonas.map((zona, i) => (
                <span key={zona} className={`zone${i === 0 ? ' is-primary' : ''}`}>
                  {i === 0 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  )}
                  {zona}
                </span>
              ))}
            </div>
            <p className="coverage__note">Si su localidad no aparece en la lista, consultenos igualmente.</p>
          </div>
          <div className="coverage-image reveal">
            <img
              src="/assets/coverage-areas.png"
              alt="Mapa de cobertura — Morón y Zona Oeste del Gran Buenos Aires"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
