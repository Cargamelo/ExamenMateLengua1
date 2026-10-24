# Diversificación de actividades de La Liga del Saber (V2)

## Línea base y alcance

- Carpeta Lengua: 22 recursos (5 controles + 17 actividades).
- Carpeta Matemáticas: 16 recursos pedagógicos (4 controles + 10 actividades y un recurso visual no curricular en raíz, según inventario global de 38 que incluye además un historial privado excluido).
- Total enumerado en ambas carpetas: **38 archivos** (22 Lengua + 16 Matemáticas). Los dos elementos del directorio raíz de Matemáticas incluyen el historial de conversaciones, que se **excluye**, y el décimo visual, que no se utiliza para construir soluciones curriculares.
- Material previamente analizado: controles de repaso, hojas de numeración/valor posicional, comparación/ordenación/aproximación, ordinales, operaciones, imágenes de sinónimos/antónimos y comunicación, presentaciones sobre verbal/no verbal y elementos de la comunicación.
- No se ha reproducido material editorial ni se han publicado imágenes privadas. Las respuestas y enunciados nuevos son originales y los números se resuelven independientemente.

## Entregables implementados

Se mantiene el banco **original de 124 preguntas más 6 actividades de lectura** y se añade un banco separado de **61 retos** con IDs `VAR-M-*` y `VAR-L-*`:

| Materia | Cantidad |
| --- | ---: |
| Matemáticas | 36 |
| Lengua | 25 |
| Total nuevo | 61 |
| Banco anterior sin eliminar | 130 |

## Mecánicas nuevas y aprovechadas

| Formato | Cantidad | Comportamiento |
| --- | ---: | --- |
| Escritura breve y numérica | 28 | Campo de texto; cifras equivalentes, minúsculas y espacios normalizados; vocabulario con variantes expresamente aceptadas |
| Completar varios huecos | 13 | Corrección por campo, guardar borrador y permitir recarga |
| Ordenar números | 5 | Ordenación de vagones mediante botones, también táctiles |
| Seleccionar signo o verdadero/falso | 8 | Selección contextual, con feedback |
| Clasificar situaciones | 2 | Botones de categoría por elemento, sin exigir arrastrar |
| Emparejar | 2 | Parejas distintas de las del juego antiguo |
| Escritura guiada | 3 | Rúbrica objetiva parcial con autoevaluación de sentido; no hace una corrección semántica automática |
| **Total** | **61** | |

Además se conservan los minijuegos ya existentes de cifras, carrera ordinal, señalización, máquina de operaciones, mayúsculas y emparejamiento.

## Selector e integración

El motor original incorpora una pregunta del banco Drive cada tres retos en condiciones normales (`n%3===1`). La V2 añade un reto de mecánica variada en el tercer turno (`n%3===2`) cuando la fase, el concepto, el escalón adaptativo y el signo lo permiten. Si no hay reto compatible, se utiliza el generador existente.

No altera los 6 pasos adaptativos, las 15 fases por asignatura, el desbloqueo por finalización, cartas o economía. Las fases 5/6 de comunicación y la fase 5 de descomposición mantienen sus filtros especiales. Las fases 10 y 11 de Matemáticas solo admiten las operaciones del signo correspondiente.

## Persistencia y privacidad

Borradores de campos escritos, huecos y escritura guiada se guardan en el checkpoint ya existente, conservando la compatibilidad de datos del PR #2. No se activa Supabase. No se transmiten textos infantiles a servicios externos. Las respuestas guiadas no se califican por inteligencia artificial.

## Pruebas

- `node tests/variedad-educativa.cjs`: inventario 61, 124 previas intactas, sintaxis, formatos, soluciones estructuradas y controles correctos/incorrectos.
- `node tests/variedad-browser.cjs`: matriz de 61 IDs × dos respuestas (122 escenarios) desde la aplicación real en Chromium; pistas, recuperación antes y después de contestar, guardado y continuación.
- `node tests/certificar-30-fases.cjs`: 30 fases de 15 retos y actividades especiales, más protección de premios.
- `node tests/contenidos-drive-browser.cjs`, `node tests/smoke-pixel.cjs`, `node tests/guardar-y-bloquear.cjs`, `node qa-pixel.js`, `node tests/certificar-offline-pwa.cjs`: regresiones y PWA.

**La aprobación exige GitHub Actions verde sobre el SHA de revisión.** No se atribuyen resultados de una ejecución anterior al commit nuevo.

## Pendientes del alcance pedagógico amplio

Esta entrega no pretende equivalencia literal uno-a-uno con toda ficha de Google Drive. Quedan por construir/validar contra más fuentes: recta numérica interactiva, editor de operaciones en columna, oración con corrección de errores complejos, comprensión lectora con respuestas libres y lectura original en varias modalidades. No se presentan como funcionalidades terminadas.

La rama se propone para revisión sin fusión a `main` ni despliegue en GitHub Pages.
