# Distribución definitiva V1 de cartas coleccionables

**Versión del sistema:** V1 · **Total:** 30 fases, 24 identificadores de carta, seis copias adicionales. La asignación es estable y no utiliza azar. «Segunda copia prevista» se refiere al listado ordenado: si se juega Lengua antes que Matemáticas, la primera o segunda copia puede recibirse en orden distinto.

| ID de fase | ID de carta | Asignatura | Rareza | Recompensa |
|---|---|---|---|---|
| `math-stage-01` | `C007` | Matemáticas | comun | Primera aparición prevista |
| `math-stage-02` | `C001` | Matemáticas | comun | Primera aparición prevista |
| `math-stage-03` | `C002` | Matemáticas | comun | Primera aparición prevista |
| `math-stage-04` | `C008` | Matemáticas | comun | Primera aparición prevista |
| `math-stage-05` | `C005` | Matemáticas | comun | Primera aparición prevista |
| `math-stage-06` | `C009` | Matemáticas | comun | Primera aparición prevista |
| `math-stage-07` | `C003` | Matemáticas | rara | Primera aparición prevista |
| `math-stage-08` | `C010` | Matemáticas | comun | Primera aparición prevista |
| `math-stage-09` | `C004` | Matemáticas | rara | Primera aparición prevista |
| `math-stage-10` | `C011` | Matemáticas | rara | Primera aparición prevista |
| `math-stage-11` | `C006` | Matemáticas | rara | Primera aparición prevista |
| `math-stage-12` | `C020` | Matemáticas | rara | Primera aparición prevista |
| `math-stage-13` | `C021` | Matemáticas | rara | Primera aparición prevista |
| `math-stage-14` | `C023` | Matemáticas | legendaria | Primera aparición prevista |
| `math-stage-15` | `C024` | Matemáticas | legendaria | Primera aparición prevista |
| `lang-stage-01` | `C012` | Lengua | comun | Primera aparición prevista |
| `lang-stage-02` | `C013` | Lengua | comun | Primera aparición prevista |
| `lang-stage-03` | `C014` | Lengua | comun | Primera aparición prevista |
| `lang-stage-04` | `C015` | Lengua | comun | Primera aparición prevista |
| `lang-stage-05` | `C016` | Lengua | comun | Primera aparición prevista |
| `lang-stage-06` | `C018` | Lengua | comun | Primera aparición prevista |
| `lang-stage-07` | `C005` | Lengua | comun | Segunda copia prevista |
| `lang-stage-08` | `C002` | Lengua | comun | Segunda copia prevista |
| `lang-stage-09` | `C017` | Lengua | rara | Primera aparición prevista |
| `lang-stage-10` | `C003` | Lengua | rara | Segunda copia prevista |
| `lang-stage-11` | `C020` | Lengua | rara | Segunda copia prevista |
| `lang-stage-12` | `C022` | Lengua | rara | Primera aparición prevista |
| `lang-stage-13` | `C018` | Lengua | comun | Segunda copia prevista |
| `lang-stage-14` | `C019` | Lengua | comun | Primera aparición prevista |
| `lang-stage-15` | `C024` | Lengua | legendaria | Segunda copia prevista |

## Fuente de verdad y claves

- El motor `AventuraFases.complete()` continúa decidiendo si una fase se ha completado por primera vez; no se introduce puntuación mínima.
- Cada fase concede como máximo una carta, con registro único `ligasaber-carta-v1-<stageId>` (JSON: `version`, `stageId`, `cardId`, `awardedAt`). Nunca existe un contador escribible compartido; el total de copias se deriva de los 30 registros individuales.
- `cartas-inventario.js` reconstruye en cada lectura las recompensas reconocidas usando el registro de concesiones **o** las fases completadas persistidas bajo `ligasaber-2026-math` y `ligasaber-2026-lang`. La reconciliación es idempotente y nunca edita los progresos educativos.
- Los registros se copian también a la base IndexedDB existente `liga-del-saber-v2`, almacén `snapshots`; la recuperación asíncrona restaura concesiones válidas del respaldo.
- Los registros conservan cartas aunque se reinicien las fases de una asignatura desde su pantalla de progreso. Repetir fases no crea copias nuevas.
- El álbum es común a portada, Matemáticas y Lengua, y refleja inmediatamente modificaciones de otra pestaña.

## Secuencia de premio

La fase se valida por el motor → se actualiza el progreso y se solicita persistencia local → se contrasta que la finalización conste en almacenamiento → se emite/reconcilia la concesión por fase → aparece la carta en la pantalla de victoria → el álbum lee el inventario actualizado. Si el progreso no es persistible y no hay concesión previa, no se comunica falsamente que la carta se ha guardado.

## Alcance deliberadamente excluido

Los poderes permanecen descriptivos e inactivos. `sync-config.js` sigue desactivado. La sincronización remota necesitará incluir el registro de concesiones o asegurar que no se pierden fases antes de su activación; esta rama no cambia el backend ni activa Supabase. En modo local no existe defensa absoluta contra usuarios que manipulen manualmente su propio almacenamiento.

## Pruebas

`node tests/cartas-coleccionables.cjs` comprueba correspondencia, exclusividad, migración, persistencia, repetición, corrupción y dos pestañas. `node tests/cartas-ui.cjs` verifica la experiencia real en Chrome con almacenamiento de prueba. El workflow de validación visual ejecuta ambas pruebas en la rama de desarrollo.
