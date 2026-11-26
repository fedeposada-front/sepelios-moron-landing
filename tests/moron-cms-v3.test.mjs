import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const script = fs.readFileSync('moron-web-cms.js', 'utf8');
const csv = [
  'tipo,id,campo,valor,Enlace / URL,mostrar,orden,ayuda',
  'config,site,whatsapp_numero,5491154133407,,SI,0,',
  'config,site,email,contacto@example.com,,SI,0,',
  'seccion,hero,titulo,Cremaciones con atención las 24 horas en Morón y alrededores,,SI,1,',
  'seccion,hero,destacado,24 horas,,SI,1,',
  'servicio,cremacion,titulo,Cremaciones,,SI,1,',
  'servicio,cremacion,descripcion,Servicio de cremación,,SI,1,',
  'servicio,cremacion,precio,$580.000,,SI,1,',
  'servicio,cremacion,precio_subtexto,Consultar por WhatsApp,,SI,1,',
  'servicio,cremacion,precio_mostrar,SI,,SI,1,',
  'servicio,cremacion,precio_destacada,SI,,SI,1,',
  'servicio,cremacion,whatsapp_consulta,Consulta por cremación,,SI,1,',
  'social,instagram,titulo,Instagram,https://www.instagram.com/sepelios_moron/,SI,1,',
  'image,hero,titulo,Foto principal,https://www.sepeliosmoron.com.ar/assets/storefront.png,NO,1,'
].join('\n');
const elements = {
  name: { textContent: 'Cremación' },
  desc: { textContent: 'Descripción anterior' },
  price: { textContent: 'Consultar valor actualizado' },
  small: { textContent: 'Antes' },
  cta: { href: 'https://wa.me/5491154133407' },
  note: { textContent: '' }
};
const toggles = {};
const card = {
  dataset: {},
  hidden: false,
  style: { display: '', removeProperty(k) { this[k] = ''; } },
  classList: { toggle(key, on) { toggles[key] = on; } },
  querySelector(sel) {
    return ({
      '.price-card__name': elements.name,
      '.price-card__desc': elements.desc,
      '.price-card__value b': elements.price,
      '.price-card__value small': elements.small,
      'a.btn[href*="wa.me"]': elements.cta
    })[sel] ?? null;
  }
};
const document = {
  readyState: 'complete',
  documentElement: { classList: { toggle() {} } },
  querySelector(sel) {
    if (sel === '#precios .pricing-grid') return { children: [card] };
    if (sel === '#precios .pricing-note') return elements.note;
    return null;
  },
  querySelectorAll() { return []; },
  createElement() { return { textContent: '' }; },
  createTextNode(text) { return { textContent: text }; }
};
const ctx = {
  window: { location: { origin: 'https://www.sepeliosmoron.com.ar' } },
  document, URL, console,
  Node: { TEXT_NODE: 3 },
  HTMLElement: class {},
  MutationObserver: class { observe() {} },
  requestAnimationFrame(fn) { fn(); },
  fetch: async () => ({ ok: true, text: async () => csv }),
  setTimeout
};
vm.runInNewContext(script,ctx);
await new Promise(resolve => setTimeout(resolve, 30));
assert.equal(elements.price.textContent,'$580.000');
assert.equal(elements.name.textContent,'Cremaciones');
assert.equal(elements.desc.textContent,'Servicio de cremación');
assert.equal(elements.small.textContent,'Consultar por WhatsApp');
assert.equal(toggles['is-featured'],true);
assert.equal(elements.cta.href,'https://wa.me/5491154133407?text=Consulta%20por%20cremaci%C3%B3n');
const parsed = ctx.window.MoronCMS.parseCms(csv);
assert.equal(parsed.seccion.get('hero').destacado,'24 horas');
assert.equal(parsed.servicio.get('cremacion').precio,'$580.000');
assert.equal(parsed.social.get('instagram').enlace,'https://www.instagram.com/sepelios_moron/');
assert.equal(parsed.imagen.get('hero').mostrar,false);
assert.equal(parsed.config.get('site|email').email,'contacto@example.com');
console.log('PASS: service price and label, CTA, CMS image/social/email parsing, hero highlighted fragment');
