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

**Auditoría de dependencias:** `npm audit` informó 3 vulnerabilidades moderate en dependencias de desarrollo de Tailwind; `npm audit --omit=dev` informó 0. No se ejecutó `npm audit fix`.

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

Para completar el pedido sin crear otro proyecto ni reasignar la preview comercial, se usará el proyecto existente `sepelios-moron-landing`, con `--environment preview` explícito y el fixture pasado como `VITE_CMS_CSV_URL=/cms-e2e.csv`. El deployment tendrá una URL única; no se promoverá, ni se tocarán los aliases de producción u otras ramas. `.vercelignore` excluye documentación, tests y artefactos locales, manteniendo `public/cms-e2e.csv` dentro del build.

**Preview publicado:** [URL única](https://sepelios-moron-landing-d96d1jda8-fedeposadas-projects.vercel.app), deployment `dpl_HQgJ3QArc5vFxk5mW6omwdcpXiuD`, snapshot del commit `e6e6e0fe4a86a5f083455d2f246479aaea9bbfe6`. Vercel informa `target=preview`, `readyState=READY`; `vercel deploy --verify` obtuvo HTTP 200. No se ejecutó promoción ni se reasignaron aliases.

La protección `vercel_authentication` sigue activa. Por eso Playwright verificó localmente el build/fixture y no navegó el preview protegido; las capturas desktop/tablet/móvil son del servidor local con el mismo fixture. No se desactivó la protección ni se cambiaron permisos para sortearla. El preview existe y está listo, pero una persona sin acceso autorizado a Vercel puede ver la pantalla de autenticación en lugar del sitio.

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
