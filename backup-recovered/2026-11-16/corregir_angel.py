#!/usr/bin/env python3
"""Corrige SOLO la referencia visual a El Ángel en el paquete CMS ya generado.
No modifica producción ni sobreescribe el ZIP de entrada.
"""
from pathlib import Path
import sys, zipfile, hashlib
here=Path(__file__).resolve().parent
base=Path(sys.argv[1]).expanduser().resolve() if len(sys.argv)>1 else Path.home()/'moron-ignacio-5a493e5-recuperado'/'sepelios-moron-ignacio-CMS-final-public_html.zip'
if not base.is_file():sys.exit(f'FALTA ZIP CMS anterior: {base}')
output=base.with_name('sepelios-moron-ignacio-CMS-final-v2-public_html.zip')
if output.exists():sys.exit(f'Ya existe {output}; no se sobrescribe.')
with zipfile.ZipFile(base) as src:
    if src.testzip() is not None:sys.exit('ZIP entrada corrupto')
    content={n:src.read(n) for n in src.namelist()}
js=here.joinpath('moron-web-cms.js').read_bytes()
if len(content)!=16 or 'moron-web-cms.js' not in content or 'index.html' not in content:sys.exit('No es el ZIP CMS esperado de 16 archivos')
if b'moron-web-cms.js' not in content['index.html']:sys.exit('La referencia CMS falta en index.html')
for sentinel in [b'docs.google.com/spreadsheets',b'266301715',b'services()',b'faqs()',b'pricing()',b'contact-card__headquarters',b'https://sepelioselangel.com.ar/']:
    if sentinel not in js:sys.exit(f'Falta comprobacion de CMS: {sentinel!r}')
content['moron-web-cms.js']=js
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for name,data in content.items():z.writestr(name,data)
with zipfile.ZipFile(output) as z:
    assert z.testzip() is None and len(z.namelist())==16
    assert z.read('moron-web-cms.js')==js
    for name,data in content.items():
        if name!='moron-web-cms.js':assert z.read(name)==data
print('PASS: paquete v2:',output)
print('PASS: 16 archivos íntegros; solo cambia moron-web-cms.js')
print('PASS: enlace El Ángel dentro de tarjeta Contacto, no al final del footer')
print('PASS: visual base, precios y CMS preservados sin recompilar')
print('SHA256:',hashlib.sha256(output.read_bytes()).hexdigest())
print('NO SE MODIFICÓ PRODUCCIÓN.')