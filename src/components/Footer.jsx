import { useSiteDataContext } from '../context/SiteDataContext'

export default function Footer() {
  const { data } = useSiteDataContext()

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div>
            <div className="footer__brand">
              <img src="/assets/logo-sm.png" alt="Logo Sepelios Morón" />
              <span>
                <b>Sepelios Morón</b>
                <span>Atención las 24 horas</span>
              </span>
            </div>
            <p>Atención fúnebre integral en Morón y Zona Oeste. Cremaciones, salas velatorias, traslados y acompañamiento humano para cada familia.</p>
          </div>
          <div>
            <h4>Servicios</h4>
            <ul>
              <li><a href="#servicios">Cremaciones</a></li>
              <li><a href="#servicios">Salas velatorias</a></li>
              <li><a href="#servicios">Traslados</a></li>
              <li><a href="#servicios">Servicios florales</a></li>
              <li><a href="#precios">Precios</a></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li>{data.direccion_calle}</li>
              <li><a href={data.telefono_principal_tel}>{data.telefono_principal}</a> · Línea principal</li>
              <li><a href={data.telefono_2_tel}>{data.telefono_2}</a></li>
              <li><a href={data.telefono_3_tel}>{data.telefono_3}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 Sepelios Morón. Empresa de servicios fúnebres en Morón, Provincia de Buenos Aires.</span>
          <span className="tag">
            <span className="dot"></span>
            Atención las 24 horas
          </span>
        </div>
      </div>
    </footer>
  )
}
