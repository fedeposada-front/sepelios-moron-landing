import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync('moron-web-cms.js','utf8');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function scenario(visible,url){
 const oldFooter={hidden:false,style:{setProperty(name,value){this[name]=value;this.display=value}}};
 const footerLink={closest(sel){return sel==='p'?oldFooter:null},style:{setProperty(){}}};
 const footer={
  querySelector(){return null},
  querySelectorAll(sel){return sel.includes('sepelioselangel.com.ar')?[footerLink]:[]},
  contains(node){return node===oldFooter}
 };
 const img={
  dataset:{},hidden:false,style:{display:'',removeProperty(key){this[key]=''}},
  attributes:{src:'/assets/storefront.png'},
  getAttribute(key){return this.attributes[key]||null},
  setAttribute(key,value){this.attributes[key]=value},
  handlers:{},addEventListener(key,fn){this.handlers[key]=fn}
 };
 const title={
  textContent:'Original',
  querySelector(){return null},querySelectorAll(){return []},
  replaceChildren(...nodes){this.textContent=nodes.map(n=>n.textContent).join('');this.em=nodes.find(n=>n.tagName==='em')}
 };
 const hero={hidden:false,style:{display:''},querySelector(sel){return sel==='h1'?title:null}};
 const document={
  readyState:'complete',documentElement:{classList:{toggle(){}}},
  querySelector(sel){if(sel==='footer')return footer;if(sel==='.hero')return hero;return null},
  querySelectorAll(sel){return sel==='.hero__media img'?[img]:[]},
  createElement(tag){return {tagName:tag,textContent:''}},
  createTextNode(text){return {textContent:text}}
 };
 const csv=[
  'tipo,id,campo,valor,Enlace / URL,mostrar,orden,ayuda',
  'config,site,email,contacto@example.com,,SI,0,',
  'seccion,hero,titulo,Cremaciones las 24 horas en Morón,,SI,1,',
  'seccion,hero,destacado,24 horas,,SI,1,',
  'servicio,cremacion,titulo,Cremaciones,,SI,1,',
  'image,hero,titulo,Foto principal,'+url+','+(visible?'SI':'NO')+',2,'
 ].join('\n');
 const ctx={
  document,window:{location:{origin:'https://www.sepeliosmoron.com.ar'}},URL,console,
  Node:{TEXT_NODE:3},HTMLElement:class {},
  MutationObserver:class{observe(){}},requestAnimationFrame(fn){fn()},
  fetch:async()=>({ok:true,text:async()=>csv}),setTimeout
 };
 vm.runInNewContext(source,ctx,{timeout:1200});
 await sleep(25);
 assert.equal(ctx.window.MoronCMS.getState().loaded,true);
 assert.equal(ctx.window.MoronCMS.getState().version,'v4-20261127');
 assert.equal(title.textContent,'Cremaciones las 24 horas en Morón');
 assert.equal(title.em?.textContent,'24 horas');
 assert.equal(img.hidden,!visible);
 assert.equal(img.style.display,visible?'':'none');
 assert.equal(img.getAttribute('src'),visible?url:'/assets/storefront.png');
 assert.equal(oldFooter.hidden,true);
 assert.equal(oldFooter.style.display,'none');
 assert.equal(ctx.window.MoronCMS.parseCms(csv).config.get('site|email').email,'contacto@example.com');
 if(visible){img.handlers.error();assert.equal(img.getAttribute('src'),'/assets/storefront.png')}
}
await scenario(false,'https://example.org/new.jpg');
await scenario(true,'https://example.org/new.jpg');
console.log('PASS: image SI/NO and remote URL fallback, hero highlight, footer duplicate, email data');
