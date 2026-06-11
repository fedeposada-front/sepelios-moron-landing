import { useSiteDataContext } from '../context/SiteDataContext'

export default function Coverage() {
  const { data } = useSiteDataContext()

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
              <span className="zone is-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {data.zona_principal}
              </span>
              <span className="zone">{data.zona_2}</span>
              <span className="zone">{data.zona_3}</span>
              <span className="zone">{data.zona_4}</span>
              <span className="zone">{data.zona_5}</span>
              <span className="zone">{data.zona_6}</span>
              <span className="zone">{data.zona_7}</span>
            </div>
          </div>
          <div className="coverage-map reveal" aria-hidden="true">
            <div className="grid-bg"></div>
            <svg className="roads" viewBox="0 0 400 300" fill="none" stroke="var(--gold)" strokeWidth="2" opacity="0.5">
              <path d="M0 180 Q140 120 200 150 T400 110" />
              <path d="M60 0 Q120 150 90 300" />
              <path d="M300 0 Q260 140 320 300" />
            </svg>
            <div className="pin">
              <span className="dot"></span>
              <span>{data.zona_principal} · {data.direccion_calle}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
