export default function Services() {
  return (
    <section className="section" id="servicios">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">Servicios</span>
          <h2>Servicios funerarios integrales</h2>
          <p>Acompañamos a cada familia con un servicio completo y cuidado, resolviendo cada detalle con respeto y profesionalismo.</p>
        </div>
        <div className="services-grid">

          <article className="card reveal">
            <div className="card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2c1 3-1 4-1 6a3 3 0 0 0 6 0c0-1-.3-2-1-3 2 1 4 3.5 4 7a7 7 0 0 1-14 0c0-4 3-6 4-8 .8-1.4 1.5-2.5 2-2z" />
              </svg>
            </div>
            <h3>Cremaciones</h3>
            <p>Servicio de cremación realizado con la máxima dignidad, ofreciendo distintas opciones de urnas y memoriales para la familia.</p>
          </article>

          <article className="card reveal">
            <div className="card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18" />
                <path d="M5 21V8l7-4 7 4v13" />
                <line x1="9" y1="21" x2="9" y2="12" />
                <line x1="15" y1="21" x2="15" y2="12" />
                <path d="M12 4v3" />
              </svg>
            </div>
            <h3>Salas velatorias</h3>
            <p>Espacios sobrios, cómodos y preparados para recibir a familiares y allegados en un ambiente de calma y recogimiento.</p>
          </article>

          <article className="card reveal">
            <div className="card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 3h15v13H1z" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <h3>Traslados nacionales e internacionales</h3>
            <p>Coordinación de traslados al interior y exterior del país, gestionando trámites y documentación de principio a fin.</p>
          </article>

          <article className="card reveal">
            <div className="card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 9c0-3 1.5-5 0-7-1.5 2 0 4 0 7zM12 15c0 3-1.5 5 0 7 1.5-2 0-4 0-7zM9 12c-3 0-5-1.5-7 0 2 1.5 4 0 7 0zM15 12c3 0 5 1.5 7 0-2-1.5-4 0-7 0z" />
              </svg>
            </div>
            <h3>Servicios florales</h3>
            <p>Arreglos y ofrendas florales seleccionadas con buen gusto para acompañar la ceremonia y honrar la memoria.</p>
          </article>

          <article className="card reveal">
            <div className="card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="13" y2="17" />
              </svg>
            </div>
            <h3>Gestión en cementerios</h3>
            <p>Tramitamos inhumaciones, nichos y toda la documentación necesaria ante cementerios públicos y privados.</p>
          </article>

          <article className="card reveal">
            <div className="card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h3>Atención personalizada</h3>
            <p>Un asesor acompaña a la familia en todo momento, escuchando sus necesidades y resolviendo cada consulta con cercanía.</p>
          </article>

        </div>
      </div>
    </section>
  )
}
