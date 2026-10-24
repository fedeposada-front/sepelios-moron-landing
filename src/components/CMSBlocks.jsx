import {cmsItems,cmsItem} from '../cms/parseCMS';
import {useSiteDataContext} from '../context/SiteDataContext';
import {buildWaHref} from '../hooks/useSiteData';
export function CMSSection({cms,id,children}){
 const item=cmsItem(cms,'seccion',id);return item&&!item.mostrar?null:children;
}
export function CMSCards({cms,type='card'}){
 const {data}=useSiteDataContext();const items=cmsItems(cms,type);
 if(!items.length)return null;
 return <section className="section" id={type==='card'?'beneficios':'servicios-dinamicos'}><div className="wrap"><div className="services-grid">
 {items.map(item=><article className="card reveal" key={item.id}>
 {item.imagen&&<img src={item.imagen} alt={item.titulo||''} loading="lazy"/>}
 <h3>{item.titulo}</h3><p>{item.descripcion}</p>
 {item.boton&&<a className="btn btn--wa" href={buildWaHref(data.whatsapp_numero,data.wa_msg_asistencia)} target="_blank" rel="noopener noreferrer">{item.boton}</a>}
 </article>)}
 </div></div></section>;
}
export function CMSFAQ({cms}){
 const items=cmsItems(cms,'faq');if(!items.length)return null;
 return <section className="section" id="preguntas"><div className="wrap"><div className="section-head center"><h2>{cmsItem(cms,'seccion','preguntas')?.titulo||'Preguntas frecuentes'}</h2></div><div className="faq-list">
 {items.map(x=><details className="faq-item" key={x.id}><summary className="faq-q">{x.pregunta}</summary><div className="faq-a" style={{maxHeight:'none'}}><p>{x.respuesta}</p></div></details>)}
 </div></div></section>;
}
