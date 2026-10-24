# CMS — contrato de campos

**Fuente autorizada:** pestaña pública `WEB_CMS`, `gid=266301715`, URL configurada en `src/cms/parseCMS.js`. No consumir `gid=0`.
**Estado:** contrato implementado en el adaptador; los fallbacks se mantienen en `src/cms/defaults.js`.

## Forma de la hoja

Encabezado obligatorio, en este orden:

```csv
tipo,id,campo,valor,mostrar,orden,ayuda
```

Una fila representa un campo. `tipo`, `id` y `campo` son identificadores en minúscula; `valor` es texto UTF-8 sin HTML. `ayuda` es una columna editorial opcional y no es procesada por el frontend.

| Columna | Contrato |
|---|---|
| `tipo` | `config`, `seccion`, `servicio`, `precio`, `faq`, `zona`, `seo`, `card`, `aviso` o `boton`. |
| `id` | `site` para `config`; ID único del registro en los demás tipos. Patrón permitido: letras ASCII minúsculas, números, `_` y `-`. |
| `campo` | Clave admitida por la allowlist de su tipo, descrita abajo. `mostrar` y `orden` son metadatos reservados compatibles. |
| `valor` | Texto de hasta 4.000 caracteres. Las celdas vacías no borran el fallback aprobado. |
| `mostrar` | `SI` o `NO`, sin distinción de mayúsculas. Es metadato del registro y debe ser igual en todas sus filas. `NO` conserva los datos y excluye el registro de la interfaz. |
| `orden` | Número finito mayor o igual a cero, igual en todas las filas de un registro. Los elementos se ordenan por número y, en empate, por ID. |
| `ayuda` | Texto opcional para editores; no modifica el sitio. |

Las filas duplicadas `(tipo,id,campo)`, tipos/campos no permitidos, identificadores inválidos, secciones/IDs no montados, campos usados en la sección equivocada, grupos sin renderer, booleanos no reconocidos, orden inconsistente, visibilidad inconsistente, destinos inseguros y valores inválidos se reportan en `cms.issues` y no sustituyen el valor aprobado. Una respuesta HTTP no exitosa o CSV inválido usa el fallback local y deja `status=fallback` y `error` explícitos.

## `config/site`

Los 68 campos de configuración son cadenas. Un campo ausente, no publicado o con `valor` vacío conserva el default local. Teléfonos se normalizan antes de generar `tel:` y WhatsApp; los campos de imagen y enlace pasan por validación específica.

| Campo | Uso / regla |
|---|---|
| `brand_name` | Nombre visible en header, contacto y footer. |
| `brand_tagline` | Bajada de marca en el header. |
| `logo_url` | Imagen de marca; HTTPS o `/assets/...`. |
| `logo_alt` | Texto alternativo del logo. |
| `whatsapp_numero` | Número internacional argentino normalizado a dígitos `549...`; no incluir mensaje. |
| `telefono_principal` | Teléfono principal visible y destino de llamada. |
| `telefono_2` | Teléfono alternativo 2. |
| `telefono_3` | Teléfono alternativo 3. |
| `direccion_calle` | Dirección visible de contacto y datos estructurados. |
| `direccion_provincia` | Provincia visible y región en datos estructurados. |
| `horario_atencion` | Horario visible en contacto. |
| `wa_msg_header` | Mensaje de WhatsApp del header y menú móvil. |
| `wa_msg_asistencia` | Mensaje general, botón flotante y tarjetas sin mensaje específico. |
| `wa_msg_cremacion_consulta` | Mensaje para consultar cremación. |
| `wa_msg_cremacion_contratar` | Mensaje de contratación de cremación; acepta `{precio}`. |
| `wa_msg_velatorio_consulta` | Mensaje para consultar servicio velatorio. |
| `wa_msg_velatorio_contratar` | Mensaje de contratación de velatorio; acepta `{precio}`. |
| `wa_msg_traslado_consulta` | Mensaje para consultar traslado. |
| `wa_msg_traslado_contratar` | Mensaje de contratación de traslado; acepta `{precio}`. |
| `wa_msg_faq` | Mensaje del CTA de preguntas frecuentes. |
| `wa_msg_contacto` | Mensaje del CTA de contacto. |
| `precio_cremacion` | Texto de importe/consulta de cremación; se muestra tal cual, no se certifica vigencia comercial. |
| `precio_cremacion_subtexto` | Vigencia/nota secundaria del precio de cremación. |
| `precio_velatorio` | Texto de importe/consulta de velatorio. |
| `precio_velatorio_subtexto` | Nota secundaria de velatorio. |
| `precio_traslado` | Texto de importe/consulta de traslado. |
| `precio_traslado_subtexto` | Nota secundaria de traslado. |
| `precio_nota` | Nota general bajo tarjetas de precio. |
| `zona_principal` | Compatibilidad con el valor legado de localidad principal. La lista visible usa `zona`. |
| `zona_2` | Valor de compatibilidad con la estructura anterior; la lista visible usa `zona`. |
| `zona_3` | Valor de compatibilidad con la estructura anterior; la lista visible usa `zona`. |
| `zona_4` | Valor de compatibilidad con la estructura anterior; la lista visible usa `zona`. |
| `zona_5` | Valor de compatibilidad con la estructura anterior; la lista visible usa `zona`. |
| `zona_6` | Valor de compatibilidad con la estructura anterior; la lista visible usa `zona`. |
| `zona_7` | Valor de compatibilidad con la estructura anterior; la lista visible usa `zona`. |
| `maps_url` | Enlace HTTPS a Google Maps. |
| `maps_embed_url` | URL HTTPS del iframe del mapa. |
| `map_iframe_title` | Nombre accesible del iframe. |
| `instagram_url` | Enlace HTTPS a la cuenta de Instagram. Un valor vacío conserva el fallback local. |
| `instagram_label` | Texto visible del enlace de Instagram. |
| `footer_description` | Descripción de marca del footer. |
| `footer_copyright` | Texto adicional del pie legal. |
| `footer_badge` | Distintivo del footer. |
| `footer_brand_tagline` | Bajada de marca del footer. |
| `footer_services_title` | Encabezado de la lista de servicios del footer. |
| `footer_contact_title` | Encabezado del bloque de contacto del footer. |
| `header_phone_label` | Nombre accesible del teléfono del header. |
| `header_whatsapp_label` | Etiqueta visible/accesible de WhatsApp en header, FAB y barra móvil. |
| `call_label` | Texto/etiqueta de la acción de llamada. |
| `trust_image` | Imagen de confianza; HTTPS o `/assets/...`. |
| `trust_image_alt` | Texto alternativo de la imagen de confianza. |
| `trust_badge_title` | Título del distintivo de confianza. |
| `trust_badge_description` | Descripción del distintivo. |
| `contact_address_label` | Etiqueta visible de dirección. |
| `contact_phones_label` | Etiqueta visible de teléfonos. |
| `contact_whatsapp_label` | Etiqueta del bloque horario/contacto WhatsApp. |
| `contact_button_label` | CTA de contacto si la sección no redefine `button_text`. |
| `map_link_label` | Texto del enlace externo al mapa. |
| `price_featured_label` | Etiqueta CSS/visual de precio destacado. |
| `price_consult_label` | CTA por defecto cuando el importe es consulta/placeholder. |
| `price_hire_label` | CTA por defecto cuando existe un importe no-placeholder. |
| `coverage_note` | Nota de cobertura bajo las zonas. |
| `coverage_map_url` | Imagen de cobertura; HTTPS o `/assets/...`. |
| `coverage_map_alt` | Texto alternativo del mapa de cobertura. |
| `seo_title` | Título SEO de fallback. |
| `seo_description` | Descripción SEO de fallback. |
| `seo_image` | Imagen OG de fallback; HTTPS o `/assets/...`. |
| `canonical_url` | URL canónica HTTPS validada. |

`telefono_principal`, `telefono_2`, `telefono_3` aceptan los formatos nacionales usados en Argentina y se convierten a E.164 móvil `+549...`; `whatsapp_numero` acepta un teléfono argentino válido y se convierte a solo dígitos. Un número no válido no reemplaza el fallback.

## Registros y campos

Todos los campos de texto admiten texto plano, no HTML. Los campos opcionales vacíos no borran el fallback. `mostrar` y `orden` se aplican por registro; los nuevos IDs válidos se incorporan a la colección.

`seccion` admite solo los nueve IDs montados y `seo` solo `home`; los demás tipos de colección aceptan nuevos IDs válidos porque sus renderers recorren la colección. Los valores permitidos de `grupo` están limitados a los grupos conectados de `card`, `aviso` y `boton` enumerados en la tabla; un grupo no montado se rechaza.

| Tipo | IDs de fallback iniciales | Campos de contenido admitidos |
|---|---|---|
| `seccion` | `hero`, `servicios`, `confianza`, `instalaciones`, `proceso`, `cobertura`, `precios`, `preguntas`, `contacto` | `titulo` (heading), `descripcion` (bajada), `imagen` / `imagen_alt` (solo `hero`), `boton` (solo `hero`, compatibilidad CTA), `button_text` / `button_href` / `button_action` / `button_message` (solo `hero`, `preguntas` y `contacto`), `destacado` (solo `hero`, subcadena del título), `eyebrow`, `nav_label`, `nav_visible`. |
| `servicio` | `cremacion`, `velatorio`, `traslado`, `flores`, `cementerios`, `personalizada` | `titulo`, `descripcion`, `imagen`, `imagen_alt`, `icono`, `visible_en_servicios`, `button_text`, `button_href`, `button_action`, `button_message`. |
| `precio` | `cremacion`, `velatorio`, `traslado` | `titulo`, `descripcion`, `precio`, `subtexto`, `destacada`, `beneficio_1`, `beneficio_2`, `beneficio_3`, `button_text`, `button_href`, `button_action`, `button_message`. El primer precio visible ordenado con `destacada=SI` queda destacado; si ninguno lo está, se conserva el comportamiento visual por defecto de velatorio cuando está disponible. |
| `faq` | `horarios`, `cremaciones`, `velatorios`, `traslados`, `presupuesto`, `ubicacion` | `pregunta`, `respuesta`, `button_text`, `button_href`, `button_action`, `button_message`. |
| `zona` | `zona_1`–`zona_7` | `nombre`, `button_text`, `button_href`, `button_action`. |
| `seo` | `home` | `titulo`, `descripcion`, `imagen`, `imagen_alt`. Los metadatos se actualizan en cliente; los valores iniciales del HTML estático no se prerenderizan desde Sheets. |
| `card` | `confianza_24hs`, `confianza_humana`, `confianza_tramites`, `confianza_ambulancia`, `confianza_acompanamiento`, `instalacion_oficina`, `instalacion_frente`, `instalacion_nota`, `proceso_contacto`, `proceso_coordinacion`, `proceso_tramites`, `proceso_acompanamiento`, `hero_atencion`, `hero_zona`, `hero_gestion` | `grupo`, `numero`, `titulo`, `descripcion`, `imagen`, `imagen_alt`, `icono`, `button_text`, `button_href`, `button_action`, `button_message`, `enlace_texto`, `enlace_href`. Grupos conectados: `confianza`, `instalacion`, `instalacion-nota`, `proceso`, `hero-trust`. |
| `aviso` | Sin registros iniciales | `grupo`, `titulo`, `descripcion`, `button_text`, `button_href`, `button_action`, `button_message`. El único grupo montado es `hero`. |
| `boton` | Sin registros iniciales | `grupo`, `titulo`, `button_text`, `button_href`, `button_action`, `button_message`. Grupos conectados: `hero`, `servicios`, `confianza`, `instalaciones`, `proceso`, `cobertura`, `precios`, `preguntas`, `contacto`, `footer`. |

### Validación de medios, enlaces y acciones

- `imagen`, `mapa`, `logo_url`, `coverage_map_url`, `seo_image` y `trust_image`: HTTPS sin usuario/clave o ruta local `/assets/...`; se rechazan esquemas como `javascript:`.
- `*_href`, `maps_url`, `maps_embed_url`, `instagram_url` y `canonical_url`: HTTPS, `tel:` normalizable, `mailto:` simple o ancla `#id` según la función; las imágenes no aceptan `data:`.
- `button_action`: `whatsapp`, `phone` o `link`. La acción WhatsApp usa el número validado y el mensaje especificado/default; `phone` genera `tel:`; `link` usa `button_href` validado.
- Los destinos HTTPS abiertos en una pestaña nueva incluyen `rel="noopener noreferrer"`.
- `destacado` resalta la primera coincidencia, sin distinguir mayúsculas, dentro del heading configurado. Si no aparece, el título se muestra sin énfasis.

La hoja es pública. No incluir credenciales, secretos ni información personal no autorizada para publicación. Los importes y claims de negocio requieren aprobación del responsable; la validación técnica no confirma su vigencia.
