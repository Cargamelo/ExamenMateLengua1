# La Liga del Saber — V11 candidato visual (NO publicable todavía)

Fecha: 24/10/2026. Base de rama: main `969f8e398f1b2ee44f9298fd24aa2a866966b756`.

## Implementación real en esta rama
- Sistema visual compartido: `tema-interior-v11.css` para cabeceras, mapas, pergaminos, misiones, ejercicios, resultados, celebraciones, botones, estados y responsive.
- Salas de colección, logros, errores y ajustes: `salas-v11.css`; filtros y números de inventario siguen siendo reales.
- Mapas: fuente pictórica WebP `assets/arte-v4/mapa-{numeros,palabras}.webp` para pantalla ancha y estrecha. Cada uno conserva sus quince botones HTML, sus identificadores persistentes y sus condiciones de desbloqueo.
- Entradas y celebraciones: se reutilizan `tiko-portada.webp` y `nara-portada.webp`, conservando los retratos anteriores en el repositorio.
- `index.html` incorpora solo el tema de salas, sin rediseñar la portada V10.
- `sw.js` incorpora las dos hojas y cambia el identificador de caché para futuras publicaciones.
- `tests/qa-interior-v11.cjs`: capturas y verificación en 9 viewports; `qa-pixel.js` actualizado para comprobar WebP.
- `.github/workflows/qa-interior-v11.yml`: Playwright, 30 fases, compatibilidad de cartas, guardado, navegación y regresión.

## Pruebas
GitHub Actions en la rama: `40078479742` finalizado con éxito. Se superaron controles V11, regresión QA, 30 fases, concesión e inventario de cartas, y guardado/bloqueo. Pruebas realizadas con contextos de navegador aislados; no demuestra integridad de datos de usuarios reales.

## Bloqueo para publicación
La comparación manual de capturas reales (mapas 1920 y 390, misión y biblioteca) confirma que los recursos de `assets/arte-v4` conservan trazos de pixel art o una representación menos pictórica que la portada V10. La biblioteca mejora pero sigue usando paneles web decorados; las variantes interiores de expresiones y escenas 2.5D de alta fidelidad todavía no están disponibles.

La generación de cuatro fondos pictóricos independientes no se pudo iniciar: el servicio Higgsfield conectado respondió «Requires basic plan or higher». Ningún trabajo gráfico se envió, por lo que NO deben declararse ilustraciones nuevas generadas ni incorporadas.

Faltan para cumplir los criterios obligatorios:
1. Crear e integrar escenarios originales 2.5D sin texto ni controles incrustados para Matemáticas, Lengua, actividades y biblioteca.
2. Unificar todas las expresiones y sprites de Tiko y Nara con el retrato aprobado V10, con control de identidad.
3. Revisar manualmente y corregir diferencias en las nueve resoluciones, incluidas actividades especiales, minijuegos, resultados y final de asignatura.
4. Ejecutar de nuevo la suite completa con los recursos definitivos y validar GitHub Pages tras la fusión.

## Seguridad y reversión
**NO fusionar esta PR todavía.** Mantener main y producción en V10 hasta alcanzar fidelidad y QA completas. Revertir cualquier aplicación accidental mediante `git revert` del commit de fusión; no borrar ni migrar claves de IndexedDB/localStorage. No se cambió deliberadamente ningún sistema educativo, de datos, progreso ni recompensas en esta rama.
