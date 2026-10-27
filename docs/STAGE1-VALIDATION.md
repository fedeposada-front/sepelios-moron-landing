# ETAPA 1 — validación de la integración CMS

Fecha: 2026-10-26 (America/Buenos_Aires).
Carpeta exclusiva: react-vite-tailwind-cms-integration-stage1.
Rama: integration/cms-controlled-stage-1.
Base inicial / main: 1b8349c1fb2b982deb2c25294a20aeb8a8b081fa.
El HEAD de cierre es el commit que incorpora este informe; consultar `git log -1 --format=%H`.

## Estado recuperado

Copilot dejó la integración sin commit, sin cambios previos en esta rama frente a main. Se conservaron sus cambios, fixture CSV, pruebas y capturas. Había 39 PNG generados y test-results/.last-run.json indicaba passed, pero no había registros de lint, unitarias ni build. Ese indicador no acreditaba por sí solo el árbol actual. No se modificó otro worktree ni main.

## Fuente y alcance

La única URL remota activa del CMS está en src/cms/parseCMS.js: publicación 2PACX-1vSqRLktGQwQUQD061cFV_Fsr5su9bI--Qc2VeA_XDKc_TKOgrZRDieslRgIKHs55-i-WE2odeZgkgyQ, gid=266301715. Es distinta de la publicación original presente en main (2PACX-1vSkSfWqKhzXqok3XzWRcfjktTa_N7DHjWZkyeBPuOxlF8KpsP8Ntq-WiNY09M-Is2Rim-MQaA_HyxqQ, gid=0), que ya no se referencia en el código activo.

Lectura GET de QA: HTTP 200, parseCMS sin issues; servicios visibles cremacion, traslado, flores, cementerios, personalizada; precios cremacion y traslado; Cremación destacada SI y precio $580.000. No se escribió en Sheets. No había archivos .env ni variables VITE activas. El override VITE_CMS_CSV_URL se usa en Playwright con /cms-e2e.csv; el código conserva ese override de entorno, por lo que futuras configuraciones deben mantener QA o la fixture local.

Carga de página → useCMS → fetchCMS → parseCMS → SiteDataProvider → componentes / metadatos. Se mantienen defaults locales ante error y validación de filas/enlaces. El fallback conserva los seis servicios y tres precios originales; el perfil QA cargado muestra cinco y dos. E2E usa CSV local e interceptado para aislar los datos, y la fuente remota se comprobó por separado en modo lectura.

## Defectos comprobados y correcciones

1. Tarjetas agregadas por el CMS quedaban con opacity:0: useScrollReveal observaba solo el primer render. La captura services-5-desktop tenía el área de tarjetas vacía aunque el E2E original pasaba. Se agregó comprobación de aparición: falló esperando la clase in (recibía card reveal). App ahora pasa cms al hook y el efecto vuelve a registrar elementos tras cargar los datos. La prueba espera opacity:1 y fin de transform antes de medir, evitando medir durante la animación.
2. Después de generar una traza de fallo, lint analizaba JavaScript de terceros dentro de playwright-report y reportaba 722 errores. eslint.config.js excluye playwright-report y test-results. Se volvió a ejecutar lint.
3. El default de Instalaciones había perdido la descripción original. Se restauró desde main.
4. Los trazados de WhatsApp de Contacto habían cambiado, incluido un trazado truncado. Se restauraron los originales desde main.

PowerShell bloquea npm.ps1 por política local: se utilizó npm.cmd sin cambiar esa política.

## Diseño y revisión

Revisados Header.jsx, WhatsAppButton.jsx, CMSBlocks.jsx, App.jsx, index.css, parser, defaults, hooks y configuración CSV. Se conservan tipografías, paleta, imágenes locales y estructura general. Los SVG de servicios, Header y botón flotante se mantienen; Contacto fue restaurado. El layout usa flex con filas centradas: 3 columnas desktop, 2 tablet, 1 móvil. Se comprueban 1 a 6 tarjetas de ambas colecciones en 1280x900, 768x1024 y 390x844.

Diferencias visibles heredadas frente a main: QA oculta Salas velatorias y su precio, destaca Cremación con $580.000; filas incompletas centradas; etiquetas de navegación y CTA provienen del CMS (el flotante puede mostrar Contactar por WhatsApp en vez de WhatsApp); Footer lista servicios y enlaces de secciones del CMS. No se afirma identidad pixel a pixel con main: no existía baseline visual automatizada. Las capturas finales permiten revisar los perfiles y el centrado.

## Reproducción

Entorno validado: Node v24.14.1, npm 11.11.0, Chromium de Playwright; dependencias fijadas en package-lock.json. En una instalación limpia: npm.cmd ci y npx.cmd playwright install chromium.

Ejecutar desde esta carpeta:

```powershell
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
git diff --check
```

La configuración inicia Vite local en 127.0.0.1:4173 y rechaza reutilizar un servidor previo. Capturas reproducibles en docs/cms-e2e-evidence y docs/cms-layout-evidence. Reportes, trazas, dist y capturas masivas se excluyen del commit; no se eliminó el trabajo previo. Se conservan código de pruebas, fixture, lockfile, este informe y una selección de capturas en docs/stage1-evidence.

## Archivos y pendientes

La lista exacta del cierre se obtiene con `git show --name-status HEAD`. Incluye App/main, componentes, CMS/parser/defaults/links, provider/context/hooks, CSS, scripts/lockfile, configuración Playwright/ESLint/ignores, pruebas, fixture e informe/evidencias. Los antiguos SiteDataContext.jsx y useSiteData.js son sustituidos por la integración existente de Copilot.

ETAPA 2 queda pendiente de autorización. No se hizo merge, push, publicación ni cambios en Google Sheets, Vercel o Ferozo. Antes de una futura publicación, revisar los textos/etiquetas CMS y mantener explícita la fuente QA; cualquier migración a producción requiere el alcance de ETAPA 2.

## Resultado final — PASS

Última ejecución, árbol final: lint exit 0; unitarias 9/9; build exit 0 (38 módulos); E2E 6/6 en 1.9 minutos, incluyendo la matriz de 18 escenarios y capturas QA de cinco servicios/dos precios en tres viewports. git diff --check sin errores. Los mensajes CMS HTTP 503 y CSV malformado son errores provocados deliberadamente por el caso de fallback, que pasó.

Inspección visual final: tarjetas visibles, SVG presentes, fila de dos servicios centrada y dos precios centrados en desktop; móvil sin desbordamiento horizontal. Las capturas de sección incluyen elementos fijos (Header/WhatsApp), que pueden superponerse por la posición de scroll de la captura. Selección conservada: docs/stage1-evidence/qa-{servicios,precios}-{desktop,tablet,mobile}.png.

## Checkpoint online — ETAPA 1

Commit de código revalidado: f2ad572030d87af4fbd1716fa32b6565a1d28687. Antes del checkpoint HEAD coincidía con ese commit y el árbol estaba limpio. Este checkpoint agrega únicamente documentación; conserva código, pruebas y seis evidencias del PASS anterior. No se repitieron pruebas de aplicación porque no cambió código ni configuración.

Pendientes visuales explícitos frente a main, sin corregir ni aprobar en este checkpoint:

- Navegación: las etiquetas provienen de nav_label del CMS; desktop muestra Preguntas frecuentes en lugar de Preguntas. Revisar longitud, distribución y equivalencia con el diseño original en desktop y móvil.
- WhatsApp: el flotante usa header_whatsapp_label y muestra Contactar por WhatsApp en lugar de WhatsApp. Revisar ancho y consistencia con la barra móvil.
- Footer: lista los servicios visibles y agrega enlaces de secciones del CMS. Revisar cantidad, orden y altura frente al Footer original.

El PASS funcional no implica aprobación de identidad pixel a pixel. La resolución de estos pendientes requiere alcance autorizado posterior; no se ejecutó ETAPA 2.

Regla permanente: cada etapa debe tener código, documentación, pruebas y evidencias versionadas en GitHub. La documentación local sola no constituye una entrega cerrada. El cierre online exige push de la rama autorizada, acceso a los archivos y coincidencia exacta de HEAD remoto y local.

Resultado del intento anterior (resuelto en la sección final): BLOCKED. La revisión automática de permisos rechazó el comando antes de ejecutarlo: exige autorización explícita del destino y del contenido a enviar. Destino detectado en origin: https://github.com/fedeposada-front/sepelios-moron-landing.git . Contenido preparado: historial de integration/cms-controlled-stage-1, código CMS QA, documentación, pruebas, fixture y seis capturas seleccionadas; quedan excluidos reportes temporales y trazas. La consulta previa de refs remotas no encontró esta rama; main remoto permanecía en 1b8349c1fb2b982deb2c25294a20aeb8a8b081fa.

En ese intento anterior no se publicó la rama ni se acreditó acceso online a los archivos o coincidencia de HEAD remoto. La documentación queda preparada en el commit que incorpora esta sección. No hubo modificaciones en main, Google Sheets, Vercel ni Ferozo, merge, despliegue o ejecución de ETAPA 2.

## Checkpoint online desbloqueado — PASS

El usuario autorizó explícitamente enviar la rama integration/cms-controlled-stage-1 con su historial, código, documentación, pruebas y seis capturas a fedeposada-front/sepelios-moron-landing. Tras revalidar HEAD 46833d7c7c8661579aaf0c842e4a17175d839ce7 y árbol limpio, se publicó exclusivamente esa referencia mediante push sin force y sin tags.

Comprobaciones realizadas después del push:

- git ls-remote confirmó HEAD remoto 46833d7c7c8661579aaf0c842e4a17175d839ce7, idéntico al local en ese momento.
- La API de GitHub permitió leer docs/STAGE1-VALIDATION.md y listar tests/cms.test.js, tests/e2e/cms-layout.spec.js y tests/e2e/cms.spec.js en ese commit.
- La API de GitHub confirmó las seis capturas PNG versionadas en docs/stage1-evidence, con tamaño no nulo.
- main remoto permaneció en 1b8349c1fb2b982deb2c25294a20aeb8a8b081fa.

Rama online: https://github.com/fedeposada-front/sepelios-moron-landing/tree/integration/cms-controlled-stage-1

Este último commit solo actualiza el informe para registrar la resolución del bloqueo. El código y las pruebas siguen siendo los de f2ad572. Se conserva el PASS previo de lint, 9/9 unitarias, build y 6/6 E2E; no se reejecutan por cambios exclusivamente documentales. El SHA final se identifica en el historial de la rama y se vuelve a contrastar con git ls-remote después de publicar este informe.

Los pendientes visuales de navegación, WhatsApp y Footer descritos arriba continúan abiertos. No hubo merge, cambios en main, Google Sheets, Vercel o Ferozo, ni ejecución de ETAPA 2. La regla de código, documentación, pruebas y evidencias versionados en GitHub sigue vigente para cada etapa.

## Continuación autorizada — ETAPA 2

El cierre visual de los pendientes de navegación, WhatsApp y Footer se documenta en [STAGE2-VISUAL-VALIDATION.md](STAGE2-VISUAL-VALIDATION.md), partiendo del checkpoint a0083345. Las restricciones de configuración definitiva, servicios externos y publicación del sitio siguen vigentes. Los resultados anteriores de este informe son históricos; consultar el informe de ETAPA 2 para el estado visual actualizado.
