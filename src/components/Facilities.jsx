export default function Facilities() {
  return (
    <section className="section" id="instalaciones">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Instalaciones</span>
          <h2>Nuestras instalaciones</h2>
          <p>Un espacio cuidado, sobrio y preparado para acompañar a las familias con tranquilidad y respeto.</p>
        </div>
        <div className="facilities-grid">
          <figure className="facility facility--tall reveal">
            <img src="/assets/office-interior.png" alt="Sala de atención de Sepelios Morón, sobria y cuidada" />
            <figcaption className="facility__cap">
              <b>Oficina de atención</b>
              <p>Un ambiente tranquilo donde recibimos a las familias y coordinamos cada detalle del servicio.</p>
            </figcaption>
          </figure>
          <div className="facility-stack">
            <figure className="facility reveal">
              <img src="/assets/storefront.png" alt="Frente de Sepelios Morón en M. Sarratea 383" />
              <figcaption className="facility__cap">
                <b>M. Sarratea 383, Morón</b>
                <p>Fácil acceso en el centro de Morón.</p>
              </figcaption>
            </figure>
            <div className="facility-note reveal">
              <p className="q">"Un lugar pensado para acompañar, no solo para gestionar."</p>
              <p>Cada espacio fue preparado para brindar contención, privacidad y serenidad en un momento difícil.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
