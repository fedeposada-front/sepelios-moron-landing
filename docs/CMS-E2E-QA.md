# CMS-E2E-QA — resultados Playwright

**Rama:** `qa/cms-e2e-isolated`

**Base validada:** `2d51caa5279abd1c003215271bd54ada7b4208ac`

**Fixture:** `public/cms-e2e.csv` (valores ficticios; nunca se solicitó el CSV real durante E2E).
**Automatización:** Playwright Chromium, `playwright.config.js`, `tests/e2e/cms.spec.js`.

## Resultado

**E2E local: PASS — 4/4.**

**Pruebas de unidad: PASS — 9/9.**

**Lint: PASS.**
**Build local: PASS.**

El servidor de pruebas recibe `VITE_CMS_CSV_URL=/cms-e2e.csv`, por lo que el navegador lee el fixture estático y no accede a Google Sheets. El valor por defecto del CMS sigue apuntando a la única URL oficial (`gid=266301715`); el CSV publicado real no fue editado.

## Campos y comportamientos verificados

| Dominio | Casos automatizados |
|---|---|
| Configuración / contacto | Marca, teléfono principal/secundarios ficticios, normalización a `tel:`, número y mensaje de WhatsApp ficticios, dirección de prueba, título del iframe del mapa y etiquetas de contacto/header. |
| Secciones y texto | Títulos/descripciones de hero, servicios, confianza, instalaciones, proceso, cobertura, precios, FAQ y contacto. El título hero aplica un fragmento configurable `destacado`; el CTA y el mensaje se toman del fixture. |
| Navegación / visibilidad | `nav_visible=NO` quita el enlace al proceso en desktop y móvil. Menú móvil abre/cierra y Escape lo cierra. |
| Servicios | Se cambia el contenido, se reordena velatorio/cremación y se ocultan servicios incluidos por fallback. |
| Tarjetas | Dos tarjetas de confianza verifican el nuevo orden; datos de instalación/imagen y pasos del proceso provienen del fixture. Tarjetas fallback se ocultan por `mostrar=NO`. |
| Precios | Textos, un importe de prueba no comercial, beneficios, orden, tarjeta destacada `SI` y tarjeta oculta. |
| Imágenes | Hero y tarjeta de instalación cambian `src` y `alt`; Playwright confirma que la imagen hero cargó (`naturalWidth > 0`). |
| FAQ | Encabezado, pregunta/respuesta, interacción accesible del acordeón y pregunta oculta. |
| Zonas / SEO | Localidades reordenadas/ocultas; title y description SEO dinámicos aparecen después de cargar el CSV fixture. |
| Fallback ante errores | HTTP 503 y CSV con encabezado inválido conservan el contenido local aprobado; el hook registra explícitamente los dos errores. |
| Responsive | Prueba de layout en tres viewports con captura: desktop 1280×720, tablet 768×1024 y móvil 390×844. |

## Capturas

Las capturas se regeneran en cada ejecución del test y están versionadas en esta rama:

| Viewport | Evidencia |
|---|---|
| Desktop, 1280×720 | [`desktop.png`](./cms-e2e-evidence/desktop.png) |
| Tablet, 768×1024 | [`tablet.png`](./cms-e2e-evidence/tablet.png) |
| Móvil, 390×844 | [`mobile.png`](./cms-e2e-evidence/mobile.png) |

Las imágenes muestran el hero, el texto de prueba, el énfasis configurable, la imagen y CTA del fixture. La aserción sobre el resto de secciones y colecciones se realiza en el test de desktop con la página completa en ejecución.

## Deploy Vercel — aislamiento y límites

El proyecto comercial no debe recibir alias, cambios de configuración ni producción. La regla documentada de Vercel hace que el primer deployment de un proyecto nuevo siempre sea `production`, incluso si se omite `--prod`. Por eso se retiraron los deployments iniciales de dos proyectos QA creados durante la preparación y se borraron esos proyectos; no se cambió el proyecto `sepelios-moron-landing` durante esos intentos. No se alteraron permisos de GitHub ni protecciones Vercel.

**Estado del preview final:** se informará aquí solo después de verificar que el deployment queda en target `preview`, tiene una URL única y carga este fixture. Un preview de la rama QA no debe apuntar a una URL alias de producción ni al CSV real.

La protección `vercel_authentication` del proyecto puede impedir acceso público en navegador; no se desactivará ni se cambiarán permisos para sortearla. La evidencia E2E ejecutada corresponde al preview local aislado y Playwright, no a un navegador autenticado contra Vercel.

## Ejecución reproducible

```powershell
npm ci
npx playwright install chromium
npm test
npm run lint
npm run build
npm run test:e2e
```

Un primer intento de E2E detectó filas del fixture con una columna mal formada y elementos fallback que no se habían ocultado; se corrigió exclusivamente `public/cms-e2e.csv` y no fue necesario corregir código funcional por ese resultado. La ejecución final pasó los cuatro casos sin filas CMS inválidas.
