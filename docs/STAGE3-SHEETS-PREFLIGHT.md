# ETAPA 3 — preflight Google Sheets

Fecha: 2026-10-27 (America/Buenos_Aires).
Resultado: **BLOCKED operativo / PASS de datos**. No aplicar cambios.

## Checkpoint y límite

Se revalidó e8ec30b899ed5d18e8a396e05b6c12623a22d1f4: HEAD local y remoto idénticos, árbol limpio, rama integration/cms-controlled-stage-1. main local/remoto permanece en 1b8349c1fb2b982deb2c25294a20aeb8a8b081fa. Se consultó el informe de ETAPA 2; no se repitieron las auditorías visuales, unitarias, build ni E2E ya cerradas.

Solo se agregan este informe, respaldos de datos, evidencia HTTP, tabla de celdas y un validador offline. No se modifica código de aplicación, CMS_URL, parser, configuración ni pruebas anteriores. No se editó Google Sheets, permisos o publicación; tampoco main, Vercel ni Ferozo. No hubo merge ni despliegue.

## Fuentes verificadas en modo lectura

| Fuente | Spreadsheet | Pestaña | gid | Publicación WEB_CMS |
| --- | --- | --- | --- | --- |
| QA | [CMS QA AISLADO](https://docs.google.com/spreadsheets/d/1xPKzwTf1mIOvLoG23_XUlxf5nELlOitBieHD5osbQaE/edit) | WEB_CMS | 266301715 | [CSV QA](https://docs.google.com/spreadsheets/d/e/2PACX-1vSqRLktGQwQUQD061cFV_Fsr5su9bI--Qc2VeA_XDKc_TKOgrZRDieslRgIKHs55-i-WE2odeZgkgyQ/pub?gid=266301715&single=true&output=csv) |
| Original indicada | [sepelios moron pagina web](https://docs.google.com/spreadsheets/d/13VRy5XxuwpejxwIn72xihGrk2g1x2bmYeLX-oZwNfSk/edit) | WEB_CMS | 266301715 | [CSV original WEB_CMS](https://docs.google.com/spreadsheets/d/e/2PACX-1vSkSfWqKhzXqok3XzWRcfjktTa_N7DHjWZkyeBPuOxlF8KpsP8Ntq-WiNY09M-Is2Rim-MQaA_HyxqQ/pub?gid=266301715&single=true&output=csv) |

Ambas fuentes WEB_CMS responden HTTP 200 y text/csv; charset=utf-8. Tienen 93 filas (cabecera y 92 registros), siete columnas tipo,id,campo,valor,mostrar,orden,ayuda y el mismo SHA-256:

`da4e182225b9c084491c7e40e7f6482b7588670dff507070caf2988ae5d028fe`

Cada CSV pesa 9289 bytes. Las respuestas publicadas coinciden exactamente con los valores leídos mediante el conector nativo, sin normalizar previamente los datos. Metadata confirmó los nombres y sheetId; no se asumieron pestañas por defecto. La hoja QA termina en la fila 93; la lectura original A1:G100 devuelve 93 filas y la comprobación A101:G1000 está vacía. La cobertura del respaldo es el contrato CMS A:G, no otras pestañas ni columnas H:Z.

## Diferencia imprevista: endpoint heredado

La URL registrada en main:src/hooks/useSiteData.js usa la publicación original pero gid=0. Esa pestaña figura en metadata como ANTIGUO (no usar), no WEB_CMS. La consulta devuelve HTTP 401 y text/html; el parser no puede tratarla como CSV. La primera lectura falló por comillas al intentar analizar ese HTML; se diagnosticó la respuesta HTTP sin modificar el parser. La evidencia HTTP final está en [http-evidence.json](stage3-evidence/http-evidence.json); no se versiona el HTML de acceso.

El endpoint original WEB_CMS se verificó cambiando gid solamente en la solicitud de lectura a la pestaña identificada por metadata. No se cambió ninguna URL en el código ni la publicación de Google. WEB_CMS sí funciona públicamente y pasa el parser.

Por la regla de detenerse ante diferencias imprevistas, se detiene toda preparación ejecutable de conexión o actualización: queda BLOCKED la aprobación operativa del endpoint heredado. No es un bloqueo de datos, ni se infiere que la web desplegada esté caída: no se inspeccionó ni modificó producción. Se completaron únicamente el respaldo y la comparación de lectura requeridos para documentar la situación.

## Comparación exacta por tipo + id + campo

**92 claves comunes, 0 duplicadas, 0 exclusivas de QA, 0 exclusivas de original, 0 diferencias** en valor, mostrar, orden o ayuda. La comparación no depende de que las filas ocupen el mismo número. No hay diferencias de contenido que justificarían editar la hoja.

**Tabla de actualización necesaria: cero filas / cero celdas.** No hay valores actual → aprobado distintos. [cell-table.md](stage3-evidence/cell-table.md) registra 32 celdas críticas con su A1 exacta y actual → aprobado iguales, incluyendo espacios y saltos de línea expresados como strings JSON. El resultado completo está en [comparison.json](stage3-evidence/comparison.json), con requiredCellUpdates vacío.

Comprobaciones clave en ambas hojas:

- WEB_CMS!D11: $580.000 → $580.000; E11: SI → SI.
- E50:E52: NO → NO en las tres filas de servicio + velatorio. Permanecen visibles cremacion, traslado, flores, cementerios y personalizada: cinco servicios.
- E90:E91: NO → NO para precio + velatorio; D90:D91 conservan SI. La columna E es metadata de visibilidad y basta para ocultar ese registro; no confundirla con el valor en D ni normalizarla con una escritura innecesaria.
- D88 y E88: SI; D89 y E89: SI. Cremación está visible y destacada. Traslado está visible en D92/E92 y no destacado en D93. Solo aparecen dos precios.
- Hero: D33 contiene Cremaciones con atención las 24 horas en Morón y un salto de línea final; D34 contiene Acompañamos a las familias en la coordinación de cremaciones y traslados, con trato humano y respetuoso en cada paso. y dos saltos finales. D45: /assets/storefront.png; D46: Contactar por WhatsApp; D86: 24 horas. Todo coincide con QA y se conserva sin limpieza adicional.

## Validación con el parser CMS existente

Se ejecutó `node docs/stage3-evidence/validate.mjs`: PASS de datos. Usa parseCSV, parseCMS, cmsItems y cmsItem originales, sin cambios. Para ambos respaldos: status ready, issues vacías, cinco servicios, dos precios, únicamente Cremación destacada, precio exacto $580.000 y hero idéntico. El parser recorta los saltos finales del hero de la misma forma en ambos casos, por lo que no son una diferencia ni requieren editar celdas.

Se ejecutó `npx.cmd eslint docs/stage3-evidence/validate.mjs`: PASS. El validador comprueba cabecera, siete columnas por fila, unicidad de claves, hashes, correspondencia nativa/publicada, igualdad por claves y perfil esperado; ante diferencias nuevas falla sin generar una actualización. El estado global que registra es BLOCKED_LEGACY_ENDPOINT, distinto del PASS de datos.

## Respaldos y reproducción

Se versionan qa-published.csv y original-published.csv, qa-native.json y original-native.json (metadata y valores formateados), http-evidence.json, comparison.json, cell-table.md y validate.mjs en [stage3-evidence](stage3-evidence/).

Son respaldos de datos del rango CMS y evidencia de lectura, no copias completas del libro: no incluyen fórmulas, formatos, validaciones, permisos, historial ni el resto de las pestañas. No se creó una copia de Google Sheets. Si una futura tarea autorizada requiriera edición real del libro, debe preservar esos elementos antes de escribir.

Reproducir offline sin consultar ni editar Sheets:

```powershell
node docs/stage3-evidence/validate.mjs
npx.cmd eslint docs/stage3-evidence/validate.mjs
git diff --check
```

La ejecución exitosa del script acredita los datos respaldados, no una disponibilidad futura de los endpoints. http-evidence.json tiene timestamp UTC de las lecturas; los rangos nativos también tienen timestamp de captura. Deben releerse antes de cualquier acción futura.

## Riesgos y procedimiento posterior (no ejecutado)

1. **No actualizar celdas:** el delta es vacío. No copiar QA encima de original ni rehacer la hoja. Un cambio de orden de filas obligaría a resolver las A1 nuevamente mediante las claves.
2. **Confirmar el destino en una nueva autorización:** el candidato ya verificado es la publicación original WEB_CMS, gid=266301715. No usar gid=0 y no alterar ni reparar ANTIGUO, publicación o permisos como parte de este preflight.
3. Antes de una futura conexión autorizada, releer metadata/rangos y ambos CSV, volver a comparar por claves y ejecutar el parser. Ante cualquier diferencia nueva, detenerse. Si siguen iguales, la actualización de Sheets continúa siendo una operación vacía.
4. Una futura sustitución de CMS_URL debe limitarse a la rama de integración y al parser CMS nuevo, con autorización expresa y pruebas del flujo real. main conserva un hook legado con otro contrato de datos; no se debe cambiar su URL ni migrarlo en este procedimiento. La integración actual sigue leyendo exclusivamente QA.
5. Verificar cinco servicios, dos precios, Cremación destacada, $580.000 y hero aprobado antes de considerar configuración definitiva. No mezclar ese paso con merge, despliegue ni publicación del sitio. Una reversión futura de conexión debe volver al checkpoint QA; actualmente no hay datos editados que restaurar.

La entrega documental y los respaldos se publican exclusivamente en la rama de integración. El SHA remoto se informa en el cierre tras comprobar igualdad exacta con HEAD local y acceso GitHub. La condición operativa queda reportada para decisión del usuario; no se amplía el alcance para resolverla.

### Integridad del respaldo en Git

La comprobación posterior al primer push detectó normalización CRLF/LF de Git en los dos CSV: el blob versionado no mantenía los 9289 bytes de la respuesta original. Se corrigió con una regla acotada en .gitattributes (docs/stage3-evidence/*-published.csv -text -diff) y se volvieron a agregar solo esos respaldos. Esa regla conserva sus bytes exactos y permite reproducir el SHA-256 en distintos sistemas; no afecta el código de la aplicación ni otros CSV. Se repitió el validador y se comprueba el tamaño/hash de los blobs remotos antes del cierre.

Se marca también -diff para que Git trate esos respaldos como bytes y no confunda sus CRLF originales con espacios accidentales; los datos comparables están disponibles en los JSON y en la tabla.
