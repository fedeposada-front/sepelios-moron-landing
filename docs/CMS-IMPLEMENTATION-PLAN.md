# CMS-IMPLEMENTATION-PLAN — propuesta de arquitectura y gates

**Estado:** propuesta histórica posterior a QA-CMS-01. CMS-IMPLEMENTATION-01 fue autorizado posteriormente y ejecutado localmente; resultados actuales en `CMS-IMPLEMENTATION-QA.md`.
**Base auditada:** `feature/web-cms-unificado` / `300cedd4f80cf45caa1f238add12c97afd17584c`.
**Restricción del gate actual:** esta implementación no modificó Google Sheets, Vercel ni producción. Las etapas y decisiones pendientes de este plan siguen siendo gates antes de staging/publicación.

## Arquitectura recomendada

Mantener la landing como frontend estático y tratar el Sheet publicado como **contenido público no confidencial**, servido por un único adaptador de contenido:

1. **Una fuente aprobada:** un endpoint y contrato CMS con versión/esquema; eliminar la ambigüedad entre `gid=266301715` y `gid=0` solo después de confirmar cuál es la fuente oficial y que todos los datos necesarios están en ella.
2. **Adaptador de lectura aislado:** responsable de fetch, timeout/abort, estado (`loading`, `ready`, `error`), parseo CSV, validación de encabezado y normalización de dominio. No exponer la forma CSV directamente a los componentes.
3. **Contrato con lista permitida:** mapear por tipo/ID/campo; aceptar solo campos declarados, tamaños y tipos esperados; normalizar booleanos/orden/teléfonos; reportar filas duplicadas, inválidas o desconocidas. Mantener la protección actual de imágenes y fijar destinos permitidos para enlaces.
4. **Contexto de contenido único:** entregar contenido validado y fallbacks aprobados. Diferenciar colección ausente, vacía, oculta y no cargada para no borrar por accidente servicios/FAQ ni restaurarlos cuando el editor decidió que no se muestren.
5. **Componentes por superficie:** conectar cada campo visible aprobado o declararlo explícitamente estático. El control de visibilidad debe sincronizar secciones y navegación; los tipos sin renderer no deben presentarse como editables.
6. **Datos sensibles fuera del Sheet público:** no incluir credenciales, datos privados ni información que no se quiera indexada/accesible públicamente. El frontend no debe contener secretos.
7. **SEO apropiado para sitio estático:** title/description/OG/canonical/JSON-LD deben estar presentes en el HTML servido y ser consistentes. Si se administran desde CMS, preferir generación en build o pre-render con revisión; no asumir que una mutación cliente es suficiente para todos los crawlers.
8. **Precios con control de vigencia:** solo mostrar un importe si se aprobó para publicación y conserva una vigencia verificable; de lo contrario, mostrar consulta. El precio y CTA deben derivar del mismo estado validado.

## Etapas propuestas

| Etapa | Objetivo | Alcance | Gate para avanzar |
|---|---|---|---|
| 0 — Decisiones y datos | Resolver H-01/H-03 y fuente de verdad | Confirmar tres teléfonos, WhatsApp, importes vigentes, dueño del Sheet, permisos de `gid=0` y `gid=266301715`, campos administrables y textos legales/comerciales. | Aprobación escrita del responsable; CSV público no contiene datos privados; contrato de campos cerrado. |
| 1 — Fiabilidad de entrada | Corregir diseño del flujo de carga | Un único endpoint/adaptador; manejo de HTTP, timeout, CSV inválido, duplicados, filas omitidas y colección vacía; fallbacks y observabilidad no sensibles. | Tests del adaptador/parser cubren escenarios válidos e inválidos; error no produce estado de éxito engañoso. |
| 2 — Integridad de contacto y precios | Evitar pérdida de contacto o valor incorrecto | Normalización de teléfono común a `tel:`/WhatsApp; precio con vigencia/estado; sincronizar tarjeta, etiqueta, mensaje y CTA. | Casos aprobados pasan tests con formatos, valores inválidos, precio vencido y campos vacíos. |
| 3 — Conexión de contenido | Cerrar brechas de cobertura | Títulos de confianza/instalaciones/proceso, SEO, descripción de cobertura, imágenes/alt, FAQ/servicios vacíos; decidir y conectar o retirar `card`, `aviso`, `boton`. | Todo elemento está clasificado como editable o estático en la matriz actualizada; ningún campo publicado queda sin consumidor. |
| 4 — Calidad y accesibilidad | Asegurar el comportamiento integral | Tests unitarios de parser/helpers; tests de componentes CMS; teclado, foco, lector de pantalla, enlaces externos y breakpoints. | `npm run lint`, tests y `npm run build` en verde; no hay `href` a secciones ocultas; accesibilidad manual documentada. |
| 5 — Staging y decisión de publicación | Validar comportamiento de extremo a extremo | Preview aislado, CSV de prueba (sin cambiar la hoja oficial), fallos controlados, desktop/móvil y verificación de HTML SEO. | Smoke test aprobado por QA y dueño de contenido; riesgos altos resueltos/aceptados explícitamente; autorización separada para producción. |

## Criterios de aceptación verificables

### Contrato y carga

- La respuesta HTTP no-2xx, timeout, CORS, encabezado inesperado, CSV truncado y fila inválida se reportan como error identificable; no se convierten silenciosamente en contenido actual.
- Parser CSV conserva comas, comillas escapadas, CRLF, saltos de línea y acentos; valida encabezado, tipos permitidos e IDs únicos.
- Los campos aceptados tienen allowlist por tipo/ID; valores vacíos, booleanos, `orden`, teléfono e imagen tienen validación documentada.
- El estado de una colección diferencia explícitamente `no cargada`, `error`, `vacía`, `todos ocultos` y `con contenido`.
- En error o colección vacía, el fallback aprobado conserva los elementos críticos sin presentar una carga exitosa; el estado degradado es observable sin filtrar datos personales.

### Contenido y contacto

- Cada clave del Sheet tiene consumidor comprobado o queda excluida del contrato y documentada como estática.
- Los nueve campos de sección se reflejan o se clasifican estáticos; ocultar una sección elimina también enlaces/anclas asociados.
- Servicios y FAQ ocultos/visibles se comportan igual con mayúsculas/minúsculas y no dejan una sección engañosamente vacía.
- Los tres números confirmados generan `tel:` con todos y solo los dígitos esperados; WhatsApp usa el número internacional validado y mensajes específicos correctos en todos los CTA.
- Ningún importe aparece como vigente si falta aprobación/fecha de vigencia; su texto, botón y mensaje de WhatsApp corresponden al mismo importe/estado.
- Medios CMS tienen URL autorizada, carga/estado de error y texto alternativo relacionado al recurso.

### Pruebas y release

- Pruebas unitarias cubren parser y normalización: encabezado, BOM, comillas, comas, saltos, duplicados, IDs inválidos, fila desconocida, imágenes, precio y teléfono.
- Pruebas de componentes cubren carga/error/fallback, secciones ocultas, colección vacía y navegación.
- `npm run lint`, suite de tests y `npm run build` deben pasar; `npm audit` debe revisarse por advisory, alcance y exposición, con aceptación explícita de cualquier residual.
- Smoke en staging cubre escritorio y móvil: header, hero, servicios, cobertura, precios, FAQ, contacto, mapa, footer, WhatsApp, llamada, navegación, teclado y lectura de pantalla.
- El HTML servido incluye metadatos SEO previstos; los valores JSON-LD, teléfono, dirección, horario y área de servicio coinciden con datos aprobados.
- No se hace deploy ni escritura en la hoja oficial como parte de esta etapa; una autorización de release se solicita después de QA y aprobación comercial.

## Dependencias y riesgos del plan

- **Owner de negocio:** confirmar teléfonos, mensajes, ubicaciones, claims y precios; QA no puede certificar su veracidad.
- **Owner del Sheet:** confirmar pestaña oficial, publicación anónima, encabezados y política de cambios.
- **Build/DevEx:** revisar los 7 hallazgos `high` y 4 `moderate` de `npm audit` con advisories/versiones lockeadas; no usar actualización forzada como atajo.
- **SEO:** decidir cómo generar metadatos indexables desde el contenido en una app Vite estática.

La primera actividad posterior recomendada es el **Gate 0 de decisiones y datos**, no la implementación. Solo cuando el usuario lo autorice debe iniciarse una tarea separada que corrija los hallazgos de mayor prioridad y ejecute los criterios de aceptación.
