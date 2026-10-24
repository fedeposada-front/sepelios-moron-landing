# QA-CMS-01 — Auditoría de CMS

**Fecha:** 2026-10-24
**Repositorio:** `fedeposada-front/sepelios-moron-landing`
**Worktree:** `react-vite-tailwind-cms-audit`
**Rama:** `feature/web-cms-unificado`
**HEAD auditado:** `300cedd4f80cf45caa1f238add12c97afd17584c`
**Alcance:** revisión de lectura de la aplicación, del CSV público configurado y de dependencias; no se modificaron código funcional, Google Sheets, Vercel ni producción.

## Veredicto

**QA GLOBAL: FAIL — no habilitar implementación/despliegue todavía.**

La compilación de producción y una prueba aislada del parser pasan. El gate falla por un defecto de normalización de teléfonos que puede romper llamadas desde los datos CMS, ESLint falla y la auditoría de dependencias informa vulnerabilidades altas. Además, el endpoint legacy devuelve HTTP 401 desde el entorno de QA y no fue posible verificarlo con datos reales.

## Hallazgos

| ID | Severidad | Hallazgo y evidencia | Riesgo / condición de salida |
|---|---|---|---|
| H-01 | **HIGH — bloqueante de contacto** | En `src/context/SiteDataContext.jsx`, los teléfonos CMS se normalizan con `replace(/\\D/g, '')`. Esa expresión no elimina los separadores de una cadena como `11-5413-3407`; el posterior `slice(-10)` puede recortar dígitos y formar un `tel:` incorrecto. El CSV CMS actual sí publica `telefono_principal`, `telefono_2` y `telefono_3`. | Validar la conversión con los tres números de negocio y verificar los `tel:` resultantes en desktop y móvil antes de liberar. |
| H-02 | **HIGH — cadena de dependencias** | `npm audit` reportó **7 high, 4 moderate, 0 critical** en el lockfile. Entre los paquetes directos marcados como afectados aparecen `vite` y `postcss`; los demás hallazgos incluyen dependencias transitivas como `brace-expansion`, `browserslist`, `nanoid`, `source-map-js` y `zod`. | Revisar versiones/advisories y actualizar de forma controlada en una tarea de implementación separada; no se ejecutó `npm audit fix`. El reporte incluye dependencias de desarrollo y no demuestra por sí solo exposición en runtime. |
| H-03 | **HIGH — actualización de precios** | El CMS permite publicar importes por `config` y el frontend decide si un importe es real mediante una comparación textual (`src/components/Pricing.jsx`). No hay fecha de vigencia, aprobación ni expiración. La pestaña CMS contiene un importe numérico para cremación; su exactitud comercial no pudo verificarse. | Obtener confirmación del responsable de precios y un criterio de vigencia/aprobación antes de mostrar o promocionar importes. |
| M-01 | **MEDIUM — fuente legacy no verificable** | `src/hooks/useSiteData.js` todavía solicita la pestaña `gid=0`, mientras que el CMS tipado usa `gid=266301715` en `src/cms/parseCMS.js`. En esta sesión, `gid=266301715` respondió HTTP 200 y `gid=0` HTTP 401. El primer hook no comprueba `response.ok`; con la respuesta actual, intenta tratar el body de error como CSV y las claves ausentes conservan los valores fallback. | Acordar una fuente única, verificar permisos de publicación y probar el comportamiento de fallo y recuperación del endpoint legacy o retirarlo en una implementación posterior. |
| M-02 | **MEDIUM — contenido CMS parcialmente conectado** | La pestaña pública contiene registros `seo`, pero el HTML SEO sigue siendo estático en `index.html`; las secciones `confianza`, `instalaciones` y `proceso` tienen filas CMS pero sus títulos no se consumen. `CMSCards` y `CMSFAQ` existen en `src/components/CMSBlocks.jsx`, pero no se montan desde `src/App.jsx`; `card`, `aviso` y `boton` no tienen renderizado activo. | La matriz exhaustiva identifica qué se puede editar realmente. No presentar campos no conectados como controles CMS funcionales. |
| M-03 | **MEDIUM — degradación silenciosa** | `src/hooks/useCMS.js` registra un `console.warn` y deja `cms` en `null` al fallar fetch/parse; `useSiteData.js` oculta el error y conserva fallback. Si el fetch CMS responde correctamente pero una colección llega vacía, `Services` y `FAQ` no recuperan sus elementos estáticos. | Definir estado visible/observabilidad para carga, error y contenido vacío; conservar un fallback aprobado por colección y probar cada escenario. |
| M-04 | **MEDIUM — lint bloqueante** | `npm run lint` falla en `src/context/SiteDataContext.jsx` con `react-refresh/only-export-components` (exportación de `useSiteDataContext` desde el mismo archivo del componente proveedor). | Corregir en una tarea funcional posterior y exigir lint verde como gate. No se modificó el archivo en esta auditoría. |
| L-01 | **LOW — accesibilidad de controles** | Los botones de navegación móvil y FAQ no exponen `aria-expanded`/relación de control explícita en `Header.jsx` y `FAQ.jsx`. Algunos `target="_blank"` usan `rel="noopener"` sin `noreferrer`. | Completar revisión con teclado/lector de pantalla y normalizar atributos en la tarea de implementación. |

No se confirmó una vulnerabilidad crítica en `npm audit` ni se reprodujo ejecución de código desde contenido del Sheet. React renderiza el texto del CMS como texto y el parser restringe el campo `imagen`; esto no sustituye una revisión de seguridad específica.

## Resultado del CMS público

La descarga de lectura del endpoint tipado `gid=266301715` respondió **HTTP 200** y el parser aceptó el esquema publicado. Se observaron:

| Tipo | Registros |
|---|---:|
| `config` | 31 claves |
| `seccion` | 9 |
| `servicio` | 6 |
| `faq` | 6 |
| `zona` | 7 |
| `precio` | 3 |
| `seo` | 1 |

No se encontraron registros ocultos en esas colecciones en la lectura realizada. `gid=0` respondió **HTTP 401** desde este entorno; por eso sus valores actuales no se consideran verificados. La pestaña CMS es pública: no debe contener secretos ni datos personales no destinados a publicación. No se editó ninguna hoja.

## QA ejecutado

| Verificación | Resultado | Evidencia |
|---|---|---|
| Confirmación de rama y HEAD | **PASS** | `feature/web-cms-unificado`, HEAD `300cedd4f80cf45caa1f238add12c97afd17584c`; worktree inicialmente limpia y sin cambios funcionales durante QA. |
| Descarga y parseo de la pestaña CMS tipada | **PASS** | HTTP 200; 31 claves y colecciones de acuerdo con la tabla anterior. |
| Parser: esquema, agrupación y visibilidad `mostrar=NO` | **PASS** | Fixture aislado ejecutado contra `src/cms/parseCMS.js`. |
| `npm run build` | **PASS** | Vite generó `dist` correctamente. |
| `npm run lint` | **FAIL** | Una infracción `react-refresh/only-export-components` en `SiteDataContext.jsx`. |
| Disponibilidad de la pestaña legacy `gid=0` | **FAIL / no verificable** | HTTP 401 en la consulta de solo lectura desde esta sesión. |
| `npm audit` | **FAIL** | 7 high, 4 moderate, 0 critical. |
| Pruebas automatizadas de componentes / navegador | **NOT RUN** | El `package.json` no define script de tests; no se realizó prueba visual interactiva ni se abrió la producción. |
| Hojas, Vercel y producción | **NO MODIFICADOS** | Solo se consultó el CSV público; no hubo escrituras ni despliegues. |

## Próximo gate recomendado

1. Obtener validación del responsable sobre números, precios vigentes y hoja de datos que debe ser la fuente oficial.
2. Abrir una tarea de implementación separada para H-01 y M-04; revisar H-02 con advisories concretos sin actualizar dependencias a ciegas.
3. Acordar el contrato y alcance real de los campos CMS pendientes según `CMS-COVERAGE-MATRIX.md`.
4. Ejecutar pruebas unitarias/integración, `lint`, `build` y smoke tests desktop/móvil en staging; validar `tel:`, WhatsApp, toggles CMS, accesibilidad básica y fallback ante HTTP 401/CSV inválido.
5. Repetir QA-CMS-01 y exigir **PASS completo** más aprobación de precios/contactos antes de cualquier gate de producción.

Este documento registra hallazgos y propone gates; **no autoriza ni ejecuta implementación**.
