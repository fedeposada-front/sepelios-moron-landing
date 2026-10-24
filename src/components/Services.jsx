import { useSiteDataContext } from '../context/SiteDataContext'
import { cmsItems, cmsItem } from '../cms/parseCMS'

export default function Services() {
  const { cms } = useSiteDataContext()
  const section = cmsItem(cms, 'seccion', 'servicios')
  const items = cmsItems(cms, 'servicio')
  return (
    <section className="section" id="servicios">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">Servicios</span>
          <h2>{section?.titulo || 'Servicios funerarios integrales'}</h2>
          <p>{section?.descripcion || 'Acompañamos a cada familia con un servicio completo y cuidado, resolviendo cada detalle con respeto y profesionalismo.'}</p>
        </div>
        <div className="services-grid">
          {(cms ? items : [
            {id:'cremacion',titulo:'Cremaciones',descripcion:'Servicio de cremación realizado con la máxima dignidad, ofreciendo distintas opciones de urnas y memoriales para la familia.',icono:'flame'},
            {id:'velatorio',titulo:'Salas velatorias',descripcion:'Espacios sobrios, cómodos y preparados para recibir a familiares y allegados en un ambiente de calma y recogimiento.',icono:'house'},
            {id:'traslado',titulo:'Traslados nacionales e internacionales',descripcion:'Coordinación de traslados al interior y exterior del país, gestionando trámites y documentación de principio a fin.',icono:'truck'},
            {id:'flores',titulo:'Servicios florales',descripcion:'Arreglos y ofrendas florales seleccionadas con buen gusto para acompañar la ceremonia y honrar la memoria.',icono:'flower'},
            {id:'cementerios',titulo:'Gestión en cementerios',descripcion:'Tramitamos inhumaciones, nichos y toda la documentación necesaria ante cementerios públicos y privados.',icono:'file-text'},
            {id:'personalizada',titulo:'Atención personalizada',descripcion:'Un asesor acompaña a la familia en todo momento, escuchando sus necesidades y resolviendo cada consulta con cercanía.',icono:'heart'}
          ]).map(item => (
            <article className="card reveal" key={item.id}>
              <div className="card__icon" aria-hidden="true"><span style={{fontSize: '20px', lineHeight: 1}}>{({"flame":"♨","house":"⌂","truck":"↦","flower":"✿","file-text":"▤","heart":"♡"})[item.icono] || '✦'}</span></div>
              <h3>{item.titulo}</h3><p>{item.descripcion}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
