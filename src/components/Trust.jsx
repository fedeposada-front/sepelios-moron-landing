export default function Trust() {
  return (
    <section className="section trust" id="confianza">
      <div className="wrap">
        <div className="trust-grid">
          <div>
            <div className="section-head reveal" style={{ marginBottom: '32px' }}>
              <span className="eyebrow">Por qué elegirnos</span>
              <h2>Por qué elegir Sepelios Morón</h2>
            </div>
            <div className="trust-list reveal">
              <div className="trust-item">
                <span className="trust-item__num">01</span>
                <div>
                  <h3>Atención permanente las 24 horas</h3>
                  <p>Estamos disponibles todos los días del año para responder en el momento en que más se nos necesita.</p>
                </div>
              </div>
              <div className="trust-item">
                <span className="trust-item__num">02</span>
                <div>
                  <h3>Trato humano y respetuoso</h3>
                  <p>Cada familia es acompañada con sensibilidad, calma y la contención que el momento requiere.</p>
                </div>
              </div>
              <div className="trust-item">
                <span className="trust-item__num">03</span>
                <div>
                  <h3>Gestión integral de trámites</h3>
                  <p>Nos ocupamos de la documentación, permisos y coordinaciones para que la familia no cargue con lo administrativo.</p>
                </div>
              </div>
              <div className="trust-item">
                <span className="trust-item__num">04</span>
                <div>
                  <h3>Ambulancia propia</h3>
                  <p>Contamos con vehículo propio para traslados, garantizando rapidez y un servicio cuidado en cada movimiento.</p>
                </div>
              </div>
              <div className="trust-item">
                <span className="trust-item__num">05</span>
                <div>
                  <h3>Acompañamiento personalizado</h3>
                  <p>Un mismo referente guía a la familia de principio a fin, con cercanía y disponibilidad real.</p>
                </div>
              </div>
            </div>
          </div>
          <figure className="trust-figure reveal">
            <img src="/assets/24-hs.png" alt="Atención 24 horas Sepelios Morón" />
            <div className="badge">
              <b>24/7</b>
              <span>Disponibilidad real, todos los días del año, para asistir a su familia.</span>
            </div>
          </figure>
        </div>
      </div>
    </section>
  )
}
