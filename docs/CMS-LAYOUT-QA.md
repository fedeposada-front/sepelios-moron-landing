# CMS-LAYOUT-01 — QA de centrado dinámico

## Resultado

**PASS:** 18 combinaciones de Playwright (6 cantidades × desktop/tablet/móvil). En cada combinación se comprobaron ambas colecciones, Servicios y Precios: **36 layouts verificados, 36 capturas**.

| Viewport | Tamaño probado | Columnas esperadas |
|---|---:|---:|
| Desktop | 1280 × 900 | 3 |
| Tablet | 768 × 1024 | 2 |
| Móvil | 390 × 844 | 1 |

Para cada viewport se validaron de 1 a 6 elementos. Las aserciones verifican:

- orden CMS renderizado sin cambios;
- cantidad de tarjetas por fila y alineación central de cada fila (tolerancia <1 px);
- ancho consistente entre las tarjetas de una colección (diferencia <1 px);
- ninguna tarjeta sale de los límites del contenedor;
- ningún desbordamiento horizontal en la colección ni en el documento.

Casos solicitados:

- **Servicios:** 5 tarjetas en desktop: 3 en primera fila y 2 centradas en la segunda.
- **Precios:** 2 tarjetas centradas con ancho consistente, verificado en las tres dimensiones.

## Evidencia visual

Cada celda contiene capturas de las dos colecciones:

| Elementos | Desktop | Tablet | Móvil |
|---:|---|---|---|
| 1 | [Servicios](./cms-layout-evidence/services-1-desktop.png) · [Precios](./cms-layout-evidence/prices-1-desktop.png) | [Servicios](./cms-layout-evidence/services-1-tablet.png) · [Precios](./cms-layout-evidence/prices-1-tablet.png) | [Servicios](./cms-layout-evidence/services-1-mobile.png) · [Precios](./cms-layout-evidence/prices-1-mobile.png) |
| 2 | [Servicios](./cms-layout-evidence/services-2-desktop.png) · [Precios](./cms-layout-evidence/prices-2-desktop.png) | [Servicios](./cms-layout-evidence/services-2-tablet.png) · [Precios](./cms-layout-evidence/prices-2-tablet.png) | [Servicios](./cms-layout-evidence/services-2-mobile.png) · [Precios](./cms-layout-evidence/prices-2-mobile.png) |
| 3 | [Servicios](./cms-layout-evidence/services-3-desktop.png) · [Precios](./cms-layout-evidence/prices-3-desktop.png) | [Servicios](./cms-layout-evidence/services-3-tablet.png) · [Precios](./cms-layout-evidence/prices-3-tablet.png) | [Servicios](./cms-layout-evidence/services-3-mobile.png) · [Precios](./cms-layout-evidence/prices-3-mobile.png) |
| 4 | [Servicios](./cms-layout-evidence/services-4-desktop.png) · [Precios](./cms-layout-evidence/prices-4-desktop.png) | [Servicios](./cms-layout-evidence/services-4-tablet.png) · [Precios](./cms-layout-evidence/prices-4-tablet.png) | [Servicios](./cms-layout-evidence/services-4-mobile.png) · [Precios](./cms-layout-evidence/prices-4-mobile.png) |
| 5 | [Servicios](./cms-layout-evidence/services-5-desktop.png) · [Precios](./cms-layout-evidence/prices-5-desktop.png) | [Servicios](./cms-layout-evidence/services-5-tablet.png) · [Precios](./cms-layout-evidence/prices-5-tablet.png) | [Servicios](./cms-layout-evidence/services-5-mobile.png) · [Precios](./cms-layout-evidence/prices-5-mobile.png) |
| 6 | [Servicios](./cms-layout-evidence/services-6-desktop.png) · [Precios](./cms-layout-evidence/prices-6-desktop.png) | [Servicios](./cms-layout-evidence/services-6-tablet.png) · [Precios](./cms-layout-evidence/prices-6-tablet.png) | [Servicios](./cms-layout-evidence/services-6-mobile.png) · [Precios](./cms-layout-evidence/prices-6-mobile.png) |

## Implementación

Los contenedores `.services-grid` y `.pricing-grid` usan Flexbox con `flex-wrap` y `justify-content: center`. Cada tarjeta conserva el ancho de su columna de diseño: 3 columnas en desktop, 2 en tablet y 1 en móvil. Las filas incompletas se centran de forma natural, sin elementos invisibles ni ajustes dependientes de una cantidad particular.

La fixture se intercepta solo dentro de Playwright. No se leyó ni se modificó Google Sheets.

## Validaciones

- `npm run test:e2e`: **PASS — 5/5 tests**, incluyendo la matriz de 18 combinaciones.
- `npm test`: **PASS — 9/9**.
- `npm run lint`: **PASS**.
- `npm run build`: **PASS**.
- `git diff --check`: **PASS**.

El primer intento focalizado agotó el timeout predeterminado de 30 segundos al tomar capturas de toda la página. Se cambió la evidencia a capturas acotadas de cada colección y se amplió el timeout del test; la suite completa posterior pasó en 1,3 minutos.

## Preview

URL y SHA de deployment se agregarán tras publicar y verificar el target `preview`. No promover a producción ni usar aliases comerciales.
