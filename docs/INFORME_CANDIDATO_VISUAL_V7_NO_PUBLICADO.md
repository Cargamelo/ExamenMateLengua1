# La Liga del Saber — Candidato artístico v7 (23/10/2026)

## Estado: NO APTO PARA PUBLICACIÓN
Implementación real en la rama `arte-alta-fidelidad-2026-10-23`, construida sobre el commit `54d7240fadc32f54d5a426f5f6e6a50d890cff1b` (RPG v6).
La comparación directa con las cinco maquetas aprobadas revela una diferencia artística considerable: el estilo vectorial ilustrado de los escenarios v7 NO equivale a la ambientación pintada y densa en detalles de referencia. No integrar ni publicar hasta disponer de escenarios artísticos equivalentes, preservando los controles HTML dinámicos.

## Cambios implementados en el repositorio
- `assets/escenarios/mapa-rpg-matematicas.svg` y `mapa-rpg-lengua.svg`: sustituidos por escenarios SVG elaborados, con castillos, árboles, viviendas, puentes, río, cascadas, cristales y iluminación, separados de los nodos interactivos.
- `mapas.js`: recorrido panorámico irregular para las 15 fases. Los identificadores `math-stage-XX` y `lang-stage-XX`, estados, títulos funcionales y lógica de bloqueo permanecen intactos. Mapa vertical original conservado en móviles.
- `tema-aventura-v6.css`: portada de portales arqueados, escala mayor de escenarios en escritorio, tratamiento de pergaminos, controles y álbum. Se ha extendido el archivo final existente sin añadir otra hoja de estilos.
- `sw.js`: versión de caché PWA v8 para evitar mezcla de recursos.
- `qa-pixel.js` y `.github/workflows/qa-alta-fidelidad-v7.yml`: capturas reales en 1920 × 1080, 2560 × 1440, 390 × 844 y 360 × 800, además de QA actual a 1366, tableta y móvil de alta densidad.

## Validación
- Workflow de QA de candidato: 280 comprobaciones superadas, 0 fallos. Ejecutadas en Chromium con datos aislados.
- Integridad JS, SVG y recursos; guardado y recuperación de sesiones; 15 fases por asignatura; estados de bloqueo; navegación de ejercicios; filtros, anverso y reverso de las 24 cartas originales.
- Se han tomado capturas reales de portada, ambos mapas, ambos ejercicios, colección, errores y logros.
- No se ha realizado prueba en dispositivos físicos ni ensayos de resistencia en hardware antiguo.
- **Deficiencia bloqueante:** diferencias significativas de calidad escénica, personajes integrados y composición respecto a las referencias aprobadas. Las imágenes aprobadas no pueden utilizarse como fondos completos con controles ficticios, y los escenarios SVG actuales no alcanzan esa fidelidad. Persisten diferencias en portada, mapas, ejercicios y colección.

## Restricciones respetadas
Sin cambios en `juego.js`, `fases.js`, `partida-local.js`, `sincronizacion.js`, esquemas Supabase, preguntas, reglas de desbloqueo o persistencia. Los retratos de Tiko y Nara y las 24 cartas originales permanecen intactos. Las pruebas no alteraron partidas reales. No se puede certificar sin más la preservación de todos los datos históricos de usuarios reales; sí que se mantuvieron las interfaces de persistencia y se verificaron escenarios automatizados de guardado.

## Publicación y reversión
`main` sigue en `54d7240fadc32f54d5a426f5f6e6a50d890cff1b` al cierre de esta ejecución; GitHub Pages mantiene la versión RPG v6. La nueva rama no se fusiona y no requiere revertir cambios de producción. Restauración del candidato: volver al commit base indicado o cerrar su PR sin fusionarlo.

## Próxima condición técnica necesaria
Preparar fondos de escenarios **sin texto ni controles**, en estilo ilustrado equivalente a las maquetas, como recursos WebP optimizados, con capas propias para profundidad e iluminación. Sustituir solo el arte del paisaje en la rama, mantener los nodos/ejercicios/cartas como DOM real y repetir la comparación visual. No asumir fidelidad por haber pasado QA funcional.
