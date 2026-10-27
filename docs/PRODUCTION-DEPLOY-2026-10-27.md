# Despliegue a producción — 2026-10-27

## Estado
**Publicado y validado funcionalmente por el responsable del proyecto.** URL: https://www.sepeliosmoron.com.ar/ . Hosting: DonWeb / Ferozo, carpeta `public_html`.

## Fuente
Rama `integration/cms-controlled-stage-1`; código preparado con commit `1fac09502172b341649649a0c0a24253d9c32b14`, que configura el CSV original publicado de la pestaña `WEB_CMS` de Ignacio (gid `266301715`). Build local Vite realizado correctamente. `main` se mantiene sin modificar; no hubo merge a `main`.

## Procedimiento realizado
1. Se utilizó como referencia de reversión un respaldo Ferozo fechado 2026-10-21 que incluye `public_html` original; se descargó también una copia de `index.html` antes de sustituirlo.
2. Se subieron `assets/index-DAuHgHCp.js` y `assets/index-gzJL72YU.css` **sin eliminar** los archivos CSS/JS originales.
3. Se reemplazó únicamente `public_html/index.html` para activar los nuevos assets. No se hizo borrado masivo de `public_html` ni se modificó `cgi-bin`.
4. El responsable confirmó que la web publicada se ve como la aprobada por Ignacio y que una edición en la hoja `WEB_CMS` se refleja en producción (prueba de extremo a extremo). Se notificó al cliente.

## SEO y preservación
Según la revisión previa al despliegue, el HTML conservaba título, descripción, URL canónica, Open Graph, Twitter y JSON-LD `FuneralHome`. `robots.txt`, `sitemap.xml`, `.htaccess`, imágenes, íconos y logos no se reemplazaron en este despliegue. No se afirma una auditoría independiente posterior de rankings o indexación de Google.

## Reversión
Si falla el sitio, restaurar `public_html/index.html` desde la copia descargada antes del cambio. Los JS/CSS originales permanecen en `public_html/assets`, por lo que el HTML previo vuelve a referenciarlos. Si fuera necesario, recuperar archivos desde el respaldo Ferozo del 2026-10-21. No borrar assets originales hasta cerrar el período de mantenimiento.

## Límites y pendientes
- La prueba de edición en Google Sheets y la aprobación visual son confirmaciones del responsable, no una captura automatizada adjunta.
- La publicación se hizo manualmente en Ferozo, no mediante Vercel.
- No hay necesidad de modificar producción para completar esta documentación.
- Pago y nueva web de «El Ángel»: asuntos comerciales separados, no forman parte del despliegue.
