/* Sepelios Morón · integración WEB_CMS sobre demo aprobada 5a493e5.
   No requiere servidor ni compilación. En caso de error de lectura preserva el diseño base.
*/
(() => {
'use strict';
const SPREADSHEET='13VRy5XxuwpejxwIn72xihGrk2g1x2bmYeLX-oZwNfSk';
const GID='266301715';
const ANGEL='https://sepelioselangel.com.ar/';
const CSV=`https://docs.google.com/spreadsheets/d/${SPREADSHEET}/gviz/tq?tqx=out:csv&gid=${GID}`;
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const serviceDefs=[
 ['cremacion',/cremac/i],['velatorio',/velator/i],['traslado',/traslad/i],
 ['flores',/flora|flore/i],['cementerios',/cementer/i],['personalizada',/personaliz/i]
];
const fallback={servicio:new Map([
 ['cremacion',{titulo:'Cremaciones',mostrar:true,orden:1}],
 ['velatorio',{titulo:'Salas velatorias',mostrar:false,orden:2}],
 ['traslado',{titulo:'Traslados nacionales e internacionales',mostrar:true,orden:3}],
 ['flores',{titulo:'Servicios florales',mostrar:true,orden:4}],
 ['cementerios',{titulo:'Gestión en cementerios',mostrar:true,orden:5}],
 ['personalizada',{titulo:'Atención personalizada',mostrar:true,orden:6}]
 ]),faq:new Map(),seccion:new Map(),config:new Map(),seo:new Map(),zona:new Map()};
let cms=fallback, loaded=false, scheduled=false, running=false;
function csvRows(input){
 const res=[];let row=[],field='',quoted=false;
 input=String(input).replace(/^\uFEFF/,'');
 for(let i=0;i<input.length;i++){
  const ch=input[i];
  if(quoted){if(ch==='"'&&input[i+1]==='"'){field+='"';i++;}else if(ch==='"')quoted=false;else field+=ch;}
  else if(ch==='"') quoted=true;
  else if(ch===','){row.push(field);field='';}
  else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&input[i+1]==='\n')i++;row.push(field);if(row.some(x=>x!==''))res.push(row);row=[];field='';}
  else field+=ch;
 }
 if(quoted)throw Error('CSV con comillas sin cerrar');
 if(field.length||row.length){row.push(field);res.push(row);}
 return res;
}
function readCms(input){
 const rows=csvRows(input);const header=rows.shift().map(x=>normalize(x));
 const col=name=>header.indexOf(name);
 for(const name of ['tipo','id','campo','valor','mostrar','orden'])if(col(name)<0)throw Error('Falta columna WEB_CMS: '+name);
 const result={servicio:new Map(),faq:new Map(),seccion:new Map(),config:new Map(),seo:new Map(),zona:new Map()};
 for(const row of rows){
  const tipo=normalize(row[col('tipo')]),id=String(row[col('id')]||'').trim(),campo=normalize(row[col('campo')]);
  if(!result[tipo]||!id||!campo)continue;
  const key=tipo==='config'?id+'|'+campo:id;
  const item=result[tipo].get(key)||{id};
  item[campo]=String(row[col('valor')]??'').trim();
  item.mostrar=normalize(row[col('mostrar')])!=='no';
  item.orden=Number(row[col('orden')])||999;
  result[tipo].set(key,item);
 }
 if(!result.servicio.size)throw Error('No se encontraron servicios en WEB_CMS');
 return result;
}
const update=(el,text)=>{if(el&&text!=null&&el.textContent!==text)el.textContent=text;};
function canShow(item){return item?.mostrar!==false;}
function serviceId(el){
 if(el.dataset.cmsId)return el.dataset.cmsId;
 const title=normalize(el.querySelector('h3,.card__title')?.textContent);
 return serviceDefs.find(([,re])=>re.test(title))?.[0]||null;
}
function getSorted(map){return [...map.values()].sort((a,b)=>(a.orden||999)-(b.orden||999));}
function services(){
 const wrap=document.querySelector('#servicios .services-grid');if(!wrap)return;
 for(const card of [...wrap.children]){if(!(card instanceof HTMLElement))continue;const id=serviceId(card);if(id&&!card.dataset.cmsId)card.dataset.cmsId=id;}
 const cards=new Map([...wrap.children].filter(x=>x.dataset.cmsId).map(x=>[x.dataset.cmsId,x]));
 const all=getSorted(cms.servicio);
 for(const item of all){
  let card=cards.get(item.id);
  if(!card){
   const prototype=[...cards.values()].find(x=>x.dataset.cmsId==='cremacion')||wrap.querySelector('article');
   if(!prototype)continue;
   card=prototype.cloneNode(true);
   card.dataset.cmsId=item.id;card.classList.remove('reveal');
   wrap.appendChild(card);cards.set(item.id,card);
  }
  if(item.titulo)update(card.querySelector('h3'),item.titulo);
  if(item.descripcion)update(card.querySelector('p'),item.descripcion);
  card.hidden=!canShow(item);
  if(card.hidden){card.style.display='none';}else if(card.style.display==='none'){card.style.removeProperty('display');}
  card.dataset.cmsOrder=String(item.orden||999);
 }
 // Si un servicio ya no figura en el CMS, se oculta, sin borrarlo del DOM.
 for(const [id,card] of cards)if(!cms.servicio.has(id)){card.hidden=true;card.style.display='none';}
 const expected=all.map(x=>cards.get(x.id)).filter(Boolean);
 const current=[...wrap.children].filter(x=>expected.includes(x));
 if(expected.some((el,i)=>current[i]!==el))for(const card of expected)wrap.appendChild(card);
}
function faqId(text){
 const t=normalize(text);
 if(/velator/.test(t))return 'velatorios';if(/cremac/.test(t))return 'cremaciones';
 if(/24 horas/.test(t))return 'horarios';if(/traslad/.test(t))return 'traslados';
 if(/precio|presupuesto/.test(t))return 'presupuesto';if(/ubicad|donde est/.test(t))return 'ubicacion';return null;
}
function faqs(){
 const wrap=document.querySelector('#preguntas .faq-list');if(!wrap)return;
 if(!cms.faq.size){for(const node of wrap.children){if(/velator/i.test(node.querySelector('.faq-q')?.textContent||'')){node.hidden=true;node.style.display='none';}}return;}
 const nodes=new Map();
 for(const el of [...wrap.children]){
  if(!(el instanceof HTMLElement))continue;
  const id=el.dataset.cmsId||faqId(el.querySelector('.faq-q,button')?.textContent);
  if(id){el.dataset.cmsId=id;nodes.set(id,el);}
 }
 for(const item of getSorted(cms.faq)){
  let node=nodes.get(item.id);
  if(!node){
   // Mantener el acordeón original de React; para FAQs nuevas se crea un acordeón HTML independiente.
   node=document.createElement('div');node.className='faq-item cms-faq';node.dataset.cmsId=item.id;
   const button=document.createElement('button');button.type='button';button.className='faq-q';
   const body=document.createElement('div');body.className='faq-a';body.style.maxHeight='0';
   const p=document.createElement('p');body.appendChild(p);node.append(button,body);
   button.addEventListener('click',()=>{const open=node.classList.toggle('open');body.style.maxHeight=open?'400px':'0';});
   wrap.appendChild(node);nodes.set(item.id,node);
  }
  const q=node.querySelector('.faq-q,button');
  if(node.classList.contains('cms-faq'))update(q,item.pregunta||item.id);
  else if(q&&item.pregunta){
    // Conservar iconos visuales del acordeón nativo.
    const text=[...q.childNodes].find(x=>x.nodeType===Node.TEXT_NODE);
    if(text&&text.textContent.trim()!==item.pregunta)text.textContent=item.pregunta;
  }
  update(node.querySelector('.faq-a p'),item.respuesta||'');
  let shown=canShow(item);
  // Una FAQ de velatorios nunca se exhibe mientras el servicio velatorio está deshabilitado.
  if(item.id==='velatorios'&&!canShow(cms.servicio.get('velatorio')))shown=false;
  node.hidden=!shown;node.style.display=shown?'':'none';
 }
 for(const [id,node] of nodes)if(!cms.faq.has(id)){node.hidden=true;node.style.display='none';}
 const expected=getSorted(cms.faq).map(x=>nodes.get(x.id)).filter(Boolean);
 const current=[...wrap.children].filter(x=>expected.includes(x));
 if(expected.some((el,i)=>current[i]!==el))for(const node of expected)wrap.appendChild(node);
}
function pricing(){
 const wrap=document.querySelector('#precios .pricing-grid');if(!wrap)return;
 for(const el of [...wrap.children]){
  const label=normalize(el.querySelector('.price-card__name')?.textContent);
  const id=/velator/.test(label)?'velatorio':/cremac/.test(label)?'cremacion':/traslad/.test(label)?'traslado':null;
  if(!id)continue;
  const shown=canShow(cms.servicio.get(id));
  el.hidden=!shown;el.style.display=shown?'':'none';
  if(id==='cremacion'){
    const price=cms.config.get('site|precio_cremacion')?.valor;
    if(price){const b=el.querySelector('.price-card__value b');update(b,price);}
  }
 }
}
function updateHeroTitle(node, fullTitle, emphasized) {
 if(!node||!fullTitle)return;
 const title=String(fullTitle).trim();
 const fragment=String(emphasized||'').trim();
 const index=fragment?title.toLocaleLowerCase('es').indexOf(fragment.toLocaleLowerCase('es')):-1;
 if(index<0){
  if(node.textContent!==title||node.querySelector('em'))node.textContent=title;
  return;
 }
 const match=title.slice(index,index+fragment.length);
 if(node.textContent===title&&node.querySelectorAll('em').length===1&&node.querySelector('em').textContent===match)return;
 const em=document.createElement('em');em.textContent=match;
 node.replaceChildren(document.createTextNode(title.slice(0,index)),em,document.createTextNode(title.slice(index+fragment.length)));
}
function sections(){
 const selectors={hero:'.hero',servicios:'#servicios',confianza:'#confianza',instalaciones:'#instalaciones',proceso:'#proceso',cobertura:'#cobertura',precios:'#precios',preguntas:'#preguntas',contacto:'#contacto'};
 for(const item of cms.seccion.values()){
  const sec=document.querySelector(selectors[item.id]);if(!sec)continue;
  if(!canShow(item)){sec.hidden=true;sec.style.display='none';continue;}
  sec.hidden=false;if(sec.style.display==='none')sec.style.removeProperty('display');
  // Solamente el título y descripción de secciones explícitamente mapeadas.
  if(item.id==='hero'){
   updateHeroTitle(sec.querySelector('h1'),item.titulo,item.destacado);
   update(sec.querySelector('.hero__sub'),item.descripcion);
  }else{
   update(sec.querySelector('h2'),item.titulo);
   const subtitle=sec.querySelector('.section-head > p');
   if(subtitle&&item.descripcion)update(subtitle,item.descripcion);
  }
 }
}
function cleanVelatorioCopy(){
 const disabled=!canShow(cms.servicio.get('velatorio'));
 document.documentElement.classList.toggle('cms-velatorio-disabled',disabled);
 if(!disabled)return;
 const footer=document.querySelector('footer');
 if(footer){
  for(const li of footer.querySelectorAll('li'))if(/velator/i.test(li.textContent))li.style.display='none';
  for(const p of footer.querySelectorAll('p')){
   if(!/velator/i.test(p.textContent))continue;
   const original=p.dataset.cmsOriginal||p.textContent;
   p.dataset.cmsOriginal=original;
   update(p,original.replace(/\s*[,·–-]?\s*(salas? velatorias?|servicios? velatorios?)(\s*[,·–-]?\s*)/gi,', ').replace(/,\s*,/g,',').replace(/,\s*\./g,'.').trim());
  }
 }
 const desc=document.querySelector('meta[name="description"]');
 if(desc&&/velator/i.test(desc.content))desc.content=desc.content.replace(/\s*[,·–-]?\s*(salas? velatorias?|servicios? velatorios?)(\s*[,·–-]?\s*)/gi,', ').replace(/,\s*,/g,',').replace(/,\s*\./g,'.');
}
function angelLink(){
 // La referencia a El Ángel forma parte de la tarjeta de contacto aprobada,
 // justo debajo de la dirección y antes del mapa; nunca suelta en el footer.
 const footer=document.querySelector('footer');
 footer?.querySelector('#cms-el-angel')?.remove(); // quita el agregado anterior
 const card=document.querySelector('#contacto .contact-card, .contact-card');
 if(!card)return;
 const title=card.querySelector('h3');
 const address=title?.nextElementSibling;
 if(!title||!address)return;
 let ref=card.querySelector('#cms-el-angel');
 if(!ref){
  ref=document.createElement('p');
  ref.id='cms-el-angel';
  ref.className='contact-card__headquarters';
  ref.style.cssText='margin:10px 0 14px;padding:2px 0 2px 11px;border-left:2px solid #c8ad85;font-size:11px;line-height:1.5;color:#777';
  const prefix=document.createElement('span');prefix.textContent='Sucursal de ';
  const anchor=document.createElement('a');
  anchor.href=ANGEL;anchor.target='_blank';anchor.rel='noopener noreferrer';
  anchor.textContent='Sepelios El Ángel ↗';
  anchor.style.cssText='font-weight:700;color:#682a27;text-decoration:none';
  const detail=document.createElement('span');
  detail.textContent='Casa principal · Darwin 1353 · Villa Bosch';
  detail.style.cssText='display:block;font-size:10px;margin-top:1px';
  ref.append(prefix,anchor,detail);
  address.insertAdjacentElement('afterend',ref);
 }
 const anchor=ref.querySelector('a');
 if(anchor&&anchor.href!==ANGEL)anchor.href=ANGEL;
}
function apply(){if(running)return;running=true;try{services();faqs();pricing();sections();cleanVelatorioCopy();angelLink();}catch(err){console.error('[Morón CMS] Error al dibujar CMS',err);}finally{running=false;}}
function queue(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply();});}
window.MoronCMS={getState:()=>({loaded,serviceCount:cms.servicio.size,services:[...cms.servicio.values()].map(s=>({id:s.id,mostrar:s.mostrar,orden:s.orden}))}),parseCsv:csvRows,parseCms:readCms,refresh:()=>fetchData()};
async function fetchData(){
 try{
  const response=await fetch(CSV,{cache:'no-store',redirect:'follow'});
  if(!response.ok)throw Error('HTTP '+response.status);
  const text=await response.text();
  if(/^\s*<!doctype|^\s*<html/i.test(text))throw Error('Google devolvió HTML; revisar acceso público/publicación de WEB_CMS');
  cms=readCms(text);loaded=true;console.info('[Morón CMS] WEB_CMS cargado:',cms.servicio.size,'servicios');queue();
 }catch(error){loaded=false;console.error('[Morón CMS] WEB_CMS no disponible. Se conserva la versión aprobada sin velatorios.',error);queue();}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{queue();fetchData();});else{queue();fetchData();}
// Reaplica el CMS si React modifica o reemplaza nodos dinámicos, sin reescribir los mismos datos.
const observer=new MutationObserver(records=>{if(running)return;if(records.some(r=>r.type==='childList'&&([...r.addedNodes].some(n=>n.nodeType===1&&!n.closest?.('#cms-el-angel')))))queue();});
observer.observe(document.documentElement,{childList:true,subtree:true});
})();