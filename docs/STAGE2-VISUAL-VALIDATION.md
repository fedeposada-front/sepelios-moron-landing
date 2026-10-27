# ETAPA 2 — cierre visual

Fecha: 2026-10-27 (America/Buenos_Aires).
Rama exclusiva: integration/cms-controlled-stage-1.
Checkpoint de partida revalidado: a0083345bb1de0b633359f7fc9a2583cc6192538, local y remoto idénticos, árbol limpio.
Referencia de diseño: main en 1b8349c1fb2b982deb2c25294a20aeb8a8b081fa, solo lectura.

## Alcance y diferencias resueltas

Se revisaron el informe de ETAPA 1, Header.jsx, WhatsAppButton.jsx y Footer.jsx contra git show main:<ruta>. La corrección se limita a tres componentes y no modifica CSS, SVG, imágenes, parser, defaults, configuración CSV, colecciones, precios ni servicios externos.

| Elemento | Checkpoint a0083345 | Diseño original de main | Resultado |
| --- | --- | --- | --- |
| Navegación desktop | Preguntas frecuentes | Preguntas | Restaurado Preguntas cuando la etiqueta es la predeterminada; una etiqueta CMS personalizada sigue mostrándose. |
| Navegación móvil | Preguntas frecuentes | Preguntas frecuentes | Conservada, junto a las acciones, foco y cierre con Escape. |
| WhatsApp flotante | Contactar por WhatsApp | WhatsApp | Restaurado el texto corto; aria-label, número, mensaje y destino siguen siendo CMS. |
| Barra móvil WhatsApp | Texto, teléfono y destino CMS | Contactar por WhatsApp y llamada | Conservada, incluidas las etiquetas personalizadas del CMS. |
| Footer / Servicios | Todos los servicios visibles más cinco enlaces a secciones | Cremaciones, Salas velatorias, Traslados, Servicios florales y Precios | Restaurados los cuatro espacios de servicios originales y Precios; se respeta visibilidad y orden CMS. Traslados vuelve a ser corto solo para el título predeterminado, conservando títulos personalizados. |

Los servicios Gestión en cementerios y Atención personalizada siguen disponibles en la colección y en las tarjetas; dejan de agregarse automáticamente al Footer porque no pertenecían a su lista original. Los servicios nuevos siguen renderizándose en Servicios. Los botones explícitos del grupo footer continúan soportados. Se elimina únicamente la navegación adicional que la integración había insertado sin corresponder al diseño.

No se fuerza a mostrar Salas velatorias: QA la oculta deliberadamente y el Footer resultante contiene Cremaciones, Traslados, Servicios florales y Precios. Ocultar Servicios o Precios continúa suprimiendo sus enlaces. Se mantienen marca, descripción, contacto, Instagram, copyright y badge del CMS; no se cambian sus estilos ni los iconos.

## Validación previa, corrección y repetición

Antes de modificar componentes se agregaron cuatro pruebas E2E específicas y se ejecutaron sobre el checkpoint. Fallaron 4/4: etiqueta desktop larga, texto largo del flotante, Footer con once enlaces en vez de cuatro en QA, y el mismo exceso del Footer con datos personalizados. Esos resultados reprodujeron las diferencias comprobadas contra main; las capturas before corresponden al código de a0083345.

Después de corregir los tres componentes: lint PASS y las cuatro pruebas afectadas PASS (10.5 s). Los casos verifican tres viewports (1280x900, 768x1024, 390x844), etiquetas originales, menú, Escape/foco, ausencia de desbordamiento, destinos tel/WhatsApp, títulos CMS personalizados, navegación oculta y sección Precios oculta.

La suite existente de ETAPA 1 se mantiene: perfil QA de cinco servicios con SVG y dos precios, Cremación destacada a $580.000, y matriz de 1–6 elementos de ambas colecciones con centrado en desktop, tablet y móvil. No se reemplazan ni debilitan sus comprobaciones.

## Evidencias versionadas

Las 22 capturas ocupan aproximadamente 663 kB y se generaron con los mismos datos QA y tamaños antes y después. No son capturas de main: la referencia original se contrastó con su código y los estilos originales de estos elementos se conservaron. No se afirma una comparación automática pixel a pixel de toda la página.

| Comparación | Antes (checkpoint) | Después |
| --- | --- | --- |
| Header desktop | [Antes](stage2-evidence/before/header-desktop.png) | [Después](stage2-evidence/after/header-desktop.png) |
| Flotante desktop | [Antes](stage2-evidence/before/whatsapp-desktop.png) | [Después](stage2-evidence/after/whatsapp-desktop.png) |
| Footer desktop | [Antes](stage2-evidence/before/footer-desktop.png) | [Después](stage2-evidence/after/footer-desktop.png) |
| Menú móvil | [Antes](stage2-evidence/before/menu-mobile.png) | [Después](stage2-evidence/after/menu-mobile.png) |
| Barra móvil | [Antes](stage2-evidence/before/whatsapp-mobile.png) | [Después](stage2-evidence/after/whatsapp-mobile.png) |
| Footer móvil | [Antes](stage2-evidence/before/footer-mobile.png) | [Después](stage2-evidence/after/footer-mobile.png) |

Las carpetas before y after incluyen también Header, WhatsApp, Footer y menú de tablet. Las capturas de sección pueden incluir Header/barra fija superpuestos según el scroll; el flotante y los menús se capturan por separado. Se revisaron visualmente Header desktop, flotante, Footer antes/después y menú/Footer móvil.

Reproducir el resultado final desde esta carpeta:

```powershell
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
git diff --check
```

Pruebas afectadas solamente: npm.cmd run test:e2e -- tests/e2e/stage2-visual.spec.js . Por defecto regeneran docs/stage2-evidence/after. Para reproducir before se debe usar el código de a0083345 con este archivo de pruebas y STAGE2_CAPTURE_PHASE=before; esas expectativas fallan deliberadamente sobre el checkpoint. No ejecutar ese modo sobre el resultado corregido para representar el estado anterior.

La configuración de Playwright usa /cms-e2e.csv local. La única URL CMS remota sigue siendo la QA (publicación 2PACX-1vSqRLktGQwQUQD061cFV_Fsr5su9bI--Qc2VeA_XDKc_TKOgrZRDieslRgIKHs55-i-WE2odeZgkgyQ, gid=266301715). No cambian el hook, el override de pruebas ni la hoja original. Reportes HTML, trazas, node_modules y dist siguen excluidos del commit.

## Pendientes reales y límites

Los tres pendientes visuales heredados quedan resueltos dentro del alcance: navegación, flotante y Footer. Continúan como diferencias intencionales los datos/etiquetas personalizados del CMS y la visibilidad QA (cinco servicios/dos precios). No son defectos de presentación.

No se realizó configuración definitiva, cambio de fuente CMS, migración a producción, merge, despliegue ni publicación del sitio. Cualquiera de esas acciones requiere nueva autorización. No se modificaron main, Google Sheets, Vercel ni Ferozo. La entrega de esta etapa exige código, informe, pruebas y capturas en GitHub sobre la rama de integración, y verificación del HEAD remoto contra el local.

## Resultado final — PASS

Árbol final validado: lint PASS; unitarias 9/9; build PASS (38 módulos); E2E 10/10 en 1.7 minutos; git diff --check PASS. Los errores CMS HTTP 503 y CSV malformado son provocados por la prueba de fallback, que pasa. La matriz responsive vuelve a confirmar 18 escenarios (1–6 elementos en tres viewports) para Servicios y Precios, con aparición, tamaño y centrado comprobados.

Se incorporan además las seis capturas QA de Servicios/Precios de esta ejecución a stage2-evidence/after/qa-{servicios,precios}-{desktop,tablet,mobile}.png. Total de evidencia seleccionada de ETAPA 2: 28 PNG (22 comparativas y 6 de colecciones). Se conserva intacta la evidencia histórica de ETAPA 1.

Código, documentación, prueba nueva y capturas se entregan mediante un commit de la rama de integración. El SHA final es el commit que incorpora este informe y se informa en el cierre junto a la URL remota. Después del push se comprueba git ls-remote y acceso GitHub al informe, las pruebas y el directorio de evidencia; el resultado efectivo de esa comprobación se comunica en el cierre de chat. Los pendientes de configuración definitiva y publicación siguen fuera de alcance.
