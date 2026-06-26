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
              <li><a href={`tel:${data.telefono_principal_tel}`}>{data.telefono_principal}</a> · Línea principal</li>
              <li><a href={`tel:${data.telefono_2_tel}`}>{data.telefono_2}</a></li>
              <li><a href={`tel:${data.telefono_3_tel}`}>{data.telefono_3}</a></li>
              <li>
                <a
                  href="https://www.instagram.com/sepelios_moron/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                  </svg>
                  Instagram
                </a>
              </li>
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
