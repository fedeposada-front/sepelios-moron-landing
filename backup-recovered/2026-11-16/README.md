# Sepelios Morón — snapshot recuperado 16/11/2026

Backup **no desplegable automáticamente**, preservado en una rama separada para no ejecutar el workflow de Ferozo. Rama base `main` en `cb8d877e4c7191a1823689c47152d1d5c247d740`.

- `moron-web-cms-final-v2.js` es la versión más nueva disponible en el paquete de corrección visual. Coloca la referencia a El Ángel dentro de la tarjeta de contacto y evita el enlace suelto en el footer.
- `moron-web-cms-original.js` y los scripts adjuntos guardan la cadena de recuperación e instalación sobre el build aprobado `5a493e5`.
- `public_html/` contiene el HTML, CSS, JS y archivos auxiliares recuperados del respaldo manual del 16/11; las imágenes de ese respaldo no están duplicadas en esta rama (el repositorio principal sí contiene imágenes del proyecto, pero no se ha verificado equivalencia byte a byte con las originales recuperadas).

**No declarar que `main` incluye el CMS de v2.** El paquete v2 requiere el ZIP CMS base y QA en navegador. Esta rama es un respaldo técnico, no una autorización de publicación ni un release probado.
