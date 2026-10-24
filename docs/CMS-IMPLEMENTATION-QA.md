# CMS-IMPLEMENTATION-01 — resultados de QA local

**Repositorio:** `fedeposada-front/sepelios-moron-landing`
**Worktree:** `react-vite-tailwind-cms-audit`
**Rama:** `feature/web-cms-unificado`
**Base de implementación:** `84dec92404f313b7e216ba50889ea266062595a4`
**Fuente única configurada:** pestaña pública `WEB_CMS`, `gid=266301715`; el código no consulta `gid=0`.
**Alcance:** implementación y QA local solamente. No se escribió en Google Sheets ni se desplegó a Vercel/producción.

## Veredicto

- **QA automatizado local: PASS** — `npm ci`, lint, build y las ocho pruebas del parser/normalización pasan.
- **QA de contenido publicado: PASS técnico** — descarga real HTTP 200, esquema válido y cero filas inválidas para el adaptador final.
- **Release/staging gate: FAIL / bloqueado** — quedan tres advisories moderados en dependencias de desarrollo, falta aprobación comercial de vigencia del importe publicado y no se ejecutaron pruebas visuales/manuales ni verificación del HTML SEO servido.
- **Hallazgos críticos de seguridad confirmados: ninguno.** `npm audit` no reporta vulnerabilidades critical/high; el árbol de producción reporta cero.

## Evidencia ejecutada

| Comando/verificación | Resultado | Evidencia |
|---|---|---|
| HEAD/branch/worktree | **PASS** | Trabajo en `feature/web-cms-unificado`, worktree `react-vite-tailwind-cms-audit`; base `84dec92404f313b7e216ba50889ea266062595a4`. |
| `npm ci` | **PASS** | Instalación reproducible desde `package-lock.json`; npm informa tres advisories moderados. |
| `npm test` | **PASS** | `node --test`: 9/9 tests, 0 fallas. |
| `npm run lint` | **PASS** | ESLint final sin errores ni warnings. |
| `npm run build` | **PASS** | Vite 8.3.5 generó `dist`; 38 módulos transformados. |
| `npm audit` | **WARN / gate bloqueado** | 3 moderadas, 0 high, 0 critical. `postcss-selector-parser` afectado vía `postcss-nested`/Tailwind 3. El arreglo sugerido por npm requiere `tailwindcss@4.3.3`, un salto mayor; no se forzó para evitar regresión del diseño/configuración existente. |
| `npm audit --omit=dev` | **PASS** | 0 vulnerabilidades en dependencias runtime. |
| CSV real oficial + parser final | **PASS** | HTTP 200; encabezado correcto; 92 filas de datos; `status=ready`; cero `cms.issues`; 9 secciones, 6 servicios, 6 FAQ, 7 zonas, 3 precios y 1 SEO. La colección `card` se completa con los 15 fallbacks locales. |
| Filas propuestas de migración | **PASS** | Dos bloques CSV parseados: 80 + 58 filas = 138; todas tienen siete columnas. Al combinar en memoria esas filas con la descarga actual y validar el resultado con el parser final, hubo cero issues. No se ejecutó ninguna escritura. |
| CSV inválido/red/fallo HTTP | **PASS** | Tests con fallo de red, HTTP 503 y encabezado malformado retornan fallback explícito con error. |
| Visibilidad, orden y campos vacíos | **PASS** | Tests verifican alta de un registro, ocultamiento por metadato `mostrar`, detección de visibilidad inconsistente, ordenación y preservación del fallback al recibir vacío. |
| Teléfonos, `tel:`, WhatsApp y enlaces | **PASS** | Tests para los tres teléfonos de negocio, formato nacional móvil/internacional, enlace `tel:`, `wa.me`, mensaje codificado y rechazo de `javascript:`/destino inseguro. |
| Imagen/enlaces y datos CMS inválidos | **PASS** | Tests comprueban allowlists, campo desconocido, destino inseguro, URL de mapa y duplicados. |
| `git diff --check` | **PASS** | Sin errores de whitespace. |

## Cobertura y migración pendiente

La aplicación tiene **12 superficies visibles principales** (header, hero, servicios, confianza, instalaciones, proceso, cobertura, precios, FAQ, contacto, footer y CTA flotante/barra móvil). **11/12 están conectadas íntegramente a campos CMS/fallback: 91,7%, redondeado a 92%.** Footer es parcial por el texto fijo “Línea principal” y el año generado por el sistema. Se excluyen iconos decorativos y etiquetas técnicas de controles.

Por separado, se contaron los campos de fallback que pueden administrarse: **88/226 (38,9%)** tienen una fila de contenido correspondiente en la lectura actual del Sheet; faltan **138 filas**, detalladas con valores iniciales en `CMS-SHEETS-MIGRATION.md`. Hasta que se autorice y realice esa migración, los valores faltantes siguen editándose solo desde los fallbacks versionados.

SEO se actualiza en cliente al cargar el CMS; el HTML estático inicial no recibe los metadatos de la hoja durante el build. La prueba de HTML servido/crawler no se ejecutó.

## Hallazgos y límites

1. **Precio vigente:** la hoja pública actual incluye `$580.000` para cremación. El parser lo conserva y el botón/mensaje se construyen desde el mismo valor, pero no existe campo de aprobación/fecha de expiración. QA técnico no valida exactitud comercial; el responsable debe confirmar vigencia antes del gate de staging.
2. **Dependencias:** los tres avisos moderados están en la cadena de desarrollo de Tailwind 3; la actualización correctiva sugerida por `npm audit` es un cambio mayor a Tailwind 4. El riesgo queda documentado, sin forzar upgrade.
3. **Cobertura de filas:** 138 valores iniciales todavía no están en el Sheet. La lista de migración está preparada, pero no se aplicó.
4. **No ejecutado:** pruebas visuales/responsive en navegador, interacción con lector de pantalla, llamadas/WhatsApp en dispositivo real, disponibilidad de imagen externa/iframe y verificación de SEO en HTML prerenderizado.
5. **Restricciones respetadas:** no hubo cambios a la hoja, permisos, Vercel ni producción; no se añadieron secretos ni infraestructura paga.

## Próximo gate recomendado

Solicitar al responsable de negocio confirmación escrita del precio publicado y los datos comerciales; después, aprobar explícitamente las 138 filas de migración. Con esa autorización, ejecutar revisión visual/interactiva desktop y móvil, accesibilidad manual y smoke de SEO en un preview aislado, y decidir cómo resolver los advisories moderados sin migración mayor no probada. **No publicar ni desplegar** hasta completar esos pasos y obtener autorización separada.

El SHA del commit local de implementación se informa en la entrega junto con este reporte.
