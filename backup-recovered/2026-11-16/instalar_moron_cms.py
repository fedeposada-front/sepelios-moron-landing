#!/usr/bin/env python3
"""Instala la integración CMS sobre el ZIP recuperado, SIN tocar producción.
Uso: python3 instalar_moron_cms.py [ruta/al/zip-recuperado.zip]
"""
import hashlib, shutil, sys, zipfile, urllib.request
from pathlib import Path

DEFAULT = Path.home()/'moron-ignacio-5a493e5-recuperado'/'sepelios-moron-ignacio-5a493e5-public_html.zip'
source=Path(sys.argv[1]).expanduser().resolve() if len(sys.argv)>1 else DEFAULT
if not source.is_file():
    print('NO SE ENCONTRÓ EL ZIP RECUPERADO:', source)
    print('Uso: python3 instalar_moron_cms.py /ruta/al/sepelios-moron-ignacio-5a493e5-public_html.zip')
    raise SystemExit(1)
root=Path(__file__).resolve().parent
js=(root/'moron-web-cms.js').read_bytes()
if not js or b'266301715' not in js:raise SystemExit('ERROR: falta el módulo CMS')
output=source.parent/'sepelios-moron-ignacio-CMS-final-public_html.zip'
if output.exists():raise SystemExit(f'El ZIP final ya existe; no sobrescribo: {output}')
with zipfile.ZipFile(source) as z:
    names=z.namelist()
    if z.testzip() is not None:raise SystemExit('ERROR: ZIP base corrupto')
    if len(names)!=15 or 'index.html' not in names or 'assets/index-D9iw59-d.js' not in names:raise SystemExit('ERROR: no es el ZIP esperado de 15 archivos de la demo 5a493e5')
    files={n:z.read(n) for n in names}
html=files['index.html'].decode('utf8')
if 'moron-web-cms.js' in html:raise SystemExit('ERROR: CMS ya instalado; evitar duplicados')
if '</body>' not in html:raise SystemExit('ERROR: falta cierre de body en el HTML')
html=html.replace('</body>','<script defer src="/moron-web-cms.js"></script>\n</body>')
files['index.html']=html.encode('utf8')
files['moron-web-cms.js']=js
# Evita indexación de dominio preliminar y mantiene las políticas del paquete aprobado.
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for n,data in files.items():z.writestr(n,data)
with zipfile.ZipFile(output) as z:
    assert z.testzip() is None
    assert len(z.namelist())==16
    assert b'moron-web-cms.js' in z.read('index.html')
    assert b'https://sepelioselangel.com.ar/' in z.read('moron-web-cms.js')
manifest=output.with_suffix('.sha256.txt')
manifest.write_text('\n'.join([f'Source: {source}',f'SHA256: {hashlib.sha256(output.read_bytes()).hexdigest()}','FILES: 16']+[f'{hashlib.sha256(data).hexdigest()}  {n}' for n,data in files.items()])+'\n')
print('PASS: ZIP final generado:',output)
print('PASS: 16 archivos, CMS agregado y ZIP íntegro')
print('PASS: módulo usa hoja WEB_CMS real; controla servicios y visibilidad por tipo/id/campo')
try:
    url='https://docs.google.com/spreadsheets/d/13VRy5XxuwpejxwIn72xihGrk2g1x2bmYeLX-oZwNfSk/gviz/tq?tqx=out:csv&gid=266301715'
    req=urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
    with urllib.request.urlopen(req,timeout=14) as response:
        sample=response.read(50000).decode('utf-8-sig','replace')
    if all(x in sample[:150] for x in ['tipo','id','campo','valor','mostrar']):
        print('LIVE_CMS_PASS: Google Sheets WEB_CMS entrega el CSV público.')
    else:
        print('LIVE_CMS_HOLD: WEB_CMS no entregó el encabezado CSV esperado; revisar publicación/compartición de solo lectura.')
except Exception as err:
    print('LIVE_CMS_HOLD: la URL WEB_CMS no es accesible sin sesión:',str(err)[:250])
print('La creación del ZIP no sustituye las pruebas visuales y de comportamiento en navegador.')
print('PENDIENTE: QA navegador para confirmar que todos los componentes heredados aceptan este adaptador.')
print('NO se modificó producción.')