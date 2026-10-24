import { cmsItem, cmsItems } from '../cms/parseCMS'
import { buildTelHref } from '../cms/links'
import { useSiteDataContext } from '../context/useSiteDataContext'
import { CMSButtons } from './CMSBlocks'

export default function Footer() {
  const { data, cms } = useSiteDataContext()
  const serviceSection = cmsItem(cms, 'seccion', 'servicios')
  const visibleSections = cmsItems(cms, 'seccion').filter(section => section.id !== 'hero' && section.nav_visible?.toLocaleUpperCase('es') !== 'NO' && section.nav_label)
  const servicesVisible = cmsItem(cms, 'seccion', 'servicios')?.mostrar !== false
  const services = servicesVisible ? cmsItems(cms, 'servicio').filter(service => service.visible_en_servicios?.toLocaleUpperCase('es') !== 'NO') : []

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div>
            <div className="footer__brand">
              <img src={data.logo_url} alt={data.logo_alt} />
              <span><b>{data.brand_name}</b><span>{data.footer_brand_tagline}</span></span>
            </div>
            <p>{data.footer_description}</p>
            <CMSButtons group="footer" />
          </div>
          <div>
            <h4>{data.footer_services_title}</h4>
            <ul>
              {services.map(service => <li key={service.id}><a href="#servicios">{service.titulo}</a></li>)}
              {serviceSection?.mostrar && cmsItem(cms, 'seccion', 'precios')?.mostrar && <li><a href="#precios">{cmsItem(cms, 'seccion', 'precios').nav_label}</a></li>}
              {visibleSections.filter(section => !['servicios', 'precios'].includes(section.id)).map(section => <li key={section.id}><a href={`#${section.id}`}>{section.nav_label}</a></li>)}
            </ul>
          </div>
          <div>
            <h4>{data.footer_contact_title}</h4>
            <ul>
              <li>{data.direccion_calle}</li>
              <li><a href={buildTelHref(data.telefono_principal)}>{data.telefono_principal}</a> · Línea principal</li>
              <li><a href={buildTelHref(data.telefono_2)}>{data.telefono_2}</a></li>
              <li><a href={buildTelHref(data.telefono_3)}>{data.telefono_3}</a></li>
              {data.instagram_url && (
                <li>
                  <a href={data.instagram_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                    </svg>
                    {data.instagram_label}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {data.brand_name}. {data.footer_copyright}</span>
          <span className="tag"><span className="dot"></span>{data.footer_badge}</span>
        </div>
      </div>
    </footer>
  )
}
