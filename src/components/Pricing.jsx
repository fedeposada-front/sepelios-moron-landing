import { useSiteDataContext } from '../context/SiteDataContext'
import { buildWaHref, fillPrecio } from '../hooks/useSiteData'

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const PLACEHOLDERS = [
  'consultar valor actualizado',
  'según distancia y gestión',
  'consultar',
]

function isRealPrice(value) {
  if (!value) return false
  return !PLACEHOLDERS.some(p => value.toLowerCase().includes(p.toLowerCase().slice(0, 10)))
}

export default function Pricing() {
  const { data } = useSiteDataContext()

  const cremacionTienePrecio = isRealPrice(data.precio_cremacion)
  const velatorioTienePrecio = isRealPrice(data.precio_velatorio)
  const trasladoTienePrecio  = isRealPrice(data.precio_traslado)

  const waHref = {
    cremacion: cremacionTienePrecio
      ? buildWaHref(data.whatsapp_numero, fillPrecio(data.wa_msg_cremacion_contratar, data.precio_cremacion))
      : buildWaHref(data.whatsapp_numero, data.wa_msg_cremacion_consulta),
    velatorio: velatorioTienePrecio
      ? buildWaHref(data.whatsapp_numero, fillPrecio(data.wa_msg_velatorio_contratar, data.precio_velatorio))
      : buildWaHref(data.whatsapp_numero, data.wa_msg_velatorio_consulta),
    traslado: trasladoTienePrecio
      ? buildWaHref(data.whatsapp_numero, fillPrecio(data.wa_msg_traslado_contratar, data.precio_traslado))
      : buildWaHref(data.whatsapp_numero, data.wa_msg_traslado_consulta),
  }

  return (
    <section className="section process" id="precios">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">Precios</span>
          <h2>Servicios con precios claros</h2>
          <p>Le brindamos un presupuesto transparente y actualizado según el servicio que su familia necesite, sin sorpresas.</p>
        </div>
        <div className="pricing-grid">

          <article className="price-card reveal">
            <div className="price-card__name">Cremación</div>
            <p className="price-card__desc">Servicio de cremación con opciones de urna y memorial.</p>
            <div className={`price-card__value${isRealPrice(data.precio_cremacion) ? ' price-card__value--precio' : ''}`}>
              {!isRealPrice(data.precio_cremacion) && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <div>
                <b>{data.precio_cremacion}</b>
                <small>{data.precio_cremacion_subtexto}</small>
              </div>
            </div>
            <ul className="price-card__feats">
              <li><CheckIcon /> Coordinación completa</li>
              <li><CheckIcon /> Opciones de urna</li>
              <li><CheckIcon /> Gestión de trámites</li>
            </ul>
            <a
              className="btn btn--primary btn--block"
              href={waHref.cremacion}
              target="_blank"
              rel="noopener"
            >
              {cremacionTienePrecio ? 'Contratar servicio' : 'Solicitar presupuesto'}
            </a>
          </article>

          <article className="price-card is-featured reveal">
            <div className="price-card__name">Servicio velatorio</div>
            <p className="price-card__desc">Sala velatoria con acompañamiento integral a la familia.</p>
            <div className={`price-card__value${isRealPrice(data.precio_velatorio) ? ' price-card__value--precio' : ''}`}>
              {!isRealPrice(data.precio_velatorio) && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <div>
                <b>{data.precio_velatorio}</b>
                <small>{data.precio_velatorio_subtexto}</small>
              </div>
            </div>
            <ul className="price-card__feats">
              <li><CheckIcon /> Sala velatoria privada</li>
              <li><CheckIcon /> Acompañamiento permanente</li>
              <li><CheckIcon /> Coordinación de ceremonia</li>
            </ul>
            <a
              className="btn btn--wa btn--block"
              href={waHref.velatorio}
              target="_blank"
              rel="noopener"
            >
              {velatorioTienePrecio ? 'Contratar servicio' : 'Solicitar presupuesto'}
            </a>
          </article>

          <article className="price-card reveal">
            <div className="price-card__name">Traslados</div>
            <p className="price-card__desc">Traslados nacionales e internacionales con gestión completa.</p>
            <div className={`price-card__value${isRealPrice(data.precio_traslado) ? ' price-card__value--precio' : ''}`}>
              {!isRealPrice(data.precio_traslado) && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              )}
              <div>
                <b>{data.precio_traslado}</b>
                <small>{data.precio_traslado_subtexto}</small>
              </div>
            </div>
            <ul className="price-card__feats">
              <li><CheckIcon /> Interior y exterior del país</li>
              <li><CheckIcon /> Documentación incluida</li>
              <li><CheckIcon /> Ambulancia propia</li>
            </ul>
            <a
              className="btn btn--primary btn--block"
              href={waHref.traslado}
              target="_blank"
              rel="noopener"
            >
              {trasladoTienePrecio ? 'Contratar servicio' : 'Solicitar presupuesto'}
            </a>
          </article>

        </div>
        <p className="pricing-note">{data.precio_nota}</p>
      </div>
    </section>
  )
}
