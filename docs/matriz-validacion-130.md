# Matriz pública de certificación de 130 actividades

**Estado del escenario de pruebas:** las 130 actividades y ambos resultados de cada una se ejecutaron en Chromium sobre una rama aislada. Esta matriz resume los **260 escenarios registrados** en el workflow <https://github.com/Cargamelo/ExamenMateLengua1/actions/runs/40072253129> y su artefacto `informe-final-certificacion-130`.

El fichero JSON generado por el workflow incluye el enunciado, la respuesta, las opciones, las pistas y la explicación, junto con los resultados por escenario. **No sustituye la revisión pedagógica humana ni certifica producción.** La selección de IDs es determinista **solo en Playwright**; el juego mantiene su selector real. La prueba de alcanzabilidad verifica independientemente el selector original.

**En 40072253129:** 130/130 IDs con prueba ejecutada, 260/260 escenarios de respuesta correcta e incorrecta; 30/30 fases; offline Matemáticas y Lengua correcto. En un commit posterior se ha reforzado la prueba para que *las seis preguntas de comprensión* se recarguen cada una, no solo la primera: consultar el workflow más reciente para esa ampliación.

| ID | Asignatura | Concepto | Procedencia | Fase de prueba | Escalón mínimo | Caso correcto | Caso incorrecto | Grupo de evidencia |
|---|---|---|---|---:|---:|---|---|---:|
| `DRIVE-MATH-LECT-01` | Matemáticas | numeros | `MAT-LECTURA-2` | M01 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-MATH-LECT-02` | Matemáticas | numeros | `MAT-LECTURA-2` | M01 | 0 | VALIDADA | VALIDADA | 1 |
| `DRIVE-MATH-LECT-03` | Matemáticas | numeros | `MAT-LECTURA-2` | M01 | 0 | VALIDADA | VALIDADA | 2 |
| `DRIVE-MATH-LECT-04` | Matemáticas | numeros | `MAT-LECTURA-2` | M01 | 0 | VALIDADA | VALIDADA | 3 |
| `DRIVE-MATH-LECT-05` | Matemáticas | numeros | `MAT-LECTURA-2` | M01 | 0 | VALIDADA | VALIDADA | 4 |
| `DRIVE-MATH-LECT-06` | Matemáticas | numeros | `MAT-LECTURA-2` | M01 | 0 | VALIDADA | VALIDADA | 5 |
| `DRIVE-MATH-LECT-07` | Matemáticas | numeros | `MAT-LECTURA-2` | M01 | 0 | VALIDADA | VALIDADA | 6 |
| `DRIVE-MATH-LECT-08` | Matemáticas | numeros | `MAT-LECTURA-2` | M01 | 0 | VALIDADA | VALIDADA | 7 |
| `DRIVE-MATH-VEC-01` | Matemáticas | numeros | `MAT-CONTROL-1` | M01 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-MATH-VEC-02` | Matemáticas | numeros | `MAT-CONTROL-1` | M01 | 0 | VALIDADA | VALIDADA | 1 |
| `DRIVE-MATH-VEC-03` | Matemáticas | numeros | `MAT-CONTROL-1` | M01 | 0 | VALIDADA | VALIDADA | 2 |
| `DRIVE-MATH-VEC-04` | Matemáticas | numeros | `MAT-CONTROL-1` | M01 | 0 | VALIDADA | VALIDADA | 3 |
| `DRIVE-MATH-VEC-05` | Matemáticas | numeros | `MAT-CONTROL-1` | M01 | 0 | VALIDADA | VALIDADA | 4 |
| `DRIVE-MATH-VEC-06` | Matemáticas | numeros | `MAT-CONTROL-1` | M01 | 0 | VALIDADA | VALIDADA | 5 |
| `DRIVE-MATH-VEC-07` | Matemáticas | numeros | `MAT-COMPARACION-4` | M01 | 0 | VALIDADA | VALIDADA | 6 |
| `DRIVE-MATH-VEC-08` | Matemáticas | numeros | `MAT-COMPARACION-4` | M01 | 0 | VALIDADA | VALIDADA | 7 |
| `DRIVE-MATH-VEC-09` | Matemáticas | numeros | `MAT-COMPARACION-4` | M01 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-MATH-VEC-10` | Matemáticas | numeros | `MAT-COMPARACION-4` | M01 | 0 | VALIDADA | VALIDADA | 1 |
| `DRIVE-MATH-DES-01` | Matemáticas | descomponer | `MAT-CONTROL-1` | M04 | 0 | VALIDADA | VALIDADA | 2 |
| `DRIVE-MATH-DES-02` | Matemáticas | descomponer | `MAT-CONTROL-1` | M04 | 0 | VALIDADA | VALIDADA | 3 |
| `DRIVE-MATH-DES-03` | Matemáticas | descomponer | `MAT-CONTROL-1` | M04 | 0 | VALIDADA | VALIDADA | 4 |
| `DRIVE-MATH-DES-04` | Matemáticas | descomponer | `MAT-CONTROL-2` | M04 | 0 | VALIDADA | VALIDADA | 5 |
| `DRIVE-MATH-DES-05` | Matemáticas | descomponer | `MAT-CONTROL-2` | M04 | 0 | VALIDADA | VALIDADA | 6 |
| `DRIVE-MATH-DES-06` | Matemáticas | descomponer | `MAT-CONTROL-2` | M04 | 0 | VALIDADA | VALIDADA | 7 |
| `DRIVE-MATH-POS-01` | Matemáticas | descomponer | `MAT-CONTROL-2` | M04 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-MATH-POS-02` | Matemáticas | descomponer | `MAT-CONTROL-2` | M04 | 0 | VALIDADA | VALIDADA | 1 |
| `DRIVE-MATH-POS-03` | Matemáticas | descomponer | `MAT-CONTROL-2` | M04 | 0 | VALIDADA | VALIDADA | 2 |
| `DRIVE-MATH-POS-04` | Matemáticas | descomponer | `MAT-CONTROL-2` | M04 | 0 | VALIDADA | VALIDADA | 3 |
| `DRIVE-MATH-POS-05` | Matemáticas | descomponer | `MAT-CONTROL-1` | M04 | 0 | VALIDADA | VALIDADA | 4 |
| `DRIVE-MATH-POS-06` | Matemáticas | descomponer | `MAT-CONTROL-1` | M04 | 0 | VALIDADA | VALIDADA | 5 |
| `DRIVE-MATH-CMP-01` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 6 |
| `DRIVE-MATH-CMP-02` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 7 |
| `DRIVE-MATH-CMP-03` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 0 |
| `DRIVE-MATH-CMP-04` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 1 |
| `DRIVE-MATH-CMP-05` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 2 |
| `DRIVE-MATH-CMP-06` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 3 |
| `DRIVE-MATH-CMP-07` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 4 |
| `DRIVE-MATH-CMP-08` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 0 | VALIDADA | VALIDADA | 5 |
| `DRIVE-MATH-CMP-09` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 6 |
| `DRIVE-MATH-CMP-10` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 7 |
| `DRIVE-MATH-CMP-11` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-MATH-CMP-12` | Matemáticas | comparar | `MAT-COMPARACION-2` | M06 | 1 | VALIDADA | VALIDADA | 1 |
| `DRIVE-MATH-CMP-13` | Matemáticas | comparar | `MAT-COMPARACION-2` | M06 | 1 | VALIDADA | VALIDADA | 2 |
| `DRIVE-MATH-ORD-01` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 3 |
| `DRIVE-MATH-ORD-02` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 4 |
| `DRIVE-MATH-ORD-03` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 5 |
| `DRIVE-MATH-ORD-04` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 6 |
| `DRIVE-MATH-APR-01-10` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 0 | VALIDADA | VALIDADA | 7 |
| `DRIVE-MATH-APR-01-100` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 0 |
| `DRIVE-MATH-APR-01-1000` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 2 | VALIDADA | VALIDADA | 1 |
| `DRIVE-MATH-APR-02-10` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 0 | VALIDADA | VALIDADA | 2 |
| `DRIVE-MATH-APR-02-100` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 3 |
| `DRIVE-MATH-APR-02-1000` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 2 | VALIDADA | VALIDADA | 4 |
| `DRIVE-MATH-APR-03-10` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 0 | VALIDADA | VALIDADA | 5 |
| `DRIVE-MATH-APR-03-100` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 6 |
| `DRIVE-MATH-APR-03-1000` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 2 | VALIDADA | VALIDADA | 7 |
| `DRIVE-MATH-APR-04-10` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-MATH-APR-04-100` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 1 |
| `DRIVE-MATH-APR-04-1000` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 2 | VALIDADA | VALIDADA | 2 |
| `DRIVE-MATH-APR-05-10` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 0 | VALIDADA | VALIDADA | 3 |
| `DRIVE-MATH-APR-05-100` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 1 | VALIDADA | VALIDADA | 4 |
| `DRIVE-MATH-APR-05-1000` | Matemáticas | comparar | `MAT-CONTROL-2` | M06 | 2 | VALIDADA | VALIDADA | 5 |
| `DRIVE-MATH-ORDI-09` | Matemáticas | ordinales | `MAT-CONTROL-1` | M08 | 0 | VALIDADA | VALIDADA | 6 |
| `DRIVE-MATH-ORDI-10` | Matemáticas | ordinales | `MAT-CONTROL-1` | M08 | 0 | VALIDADA | VALIDADA | 7 |
| `DRIVE-MATH-ORDI-11` | Matemáticas | ordinales | `MAT-CONTROL-1` | M08 | 2 | VALIDADA | VALIDADA | 0 |
| `DRIVE-MATH-ORDI-12` | Matemáticas | ordinales | `MAT-CONTROL-1` | M08 | 2 | VALIDADA | VALIDADA | 1 |
| `DRIVE-MATH-ORDI-13` | Matemáticas | ordinales | `MAT-CONTROL-1` | M08 | 2 | VALIDADA | VALIDADA | 2 |
| `DRIVE-MATH-ORDI-14` | Matemáticas | ordinales | `MAT-CONTROL-1` | M08 | 2 | VALIDADA | VALIDADA | 3 |
| `DRIVE-MATH-ORDI-15` | Matemáticas | ordinales | `MAT-CONTROL-1` | M08 | 2 | VALIDADA | VALIDADA | 4 |
| `DRIVE-MATH-ORDI-16` | Matemáticas | ordinales | `MAT-CONTROL-1` | M08 | 2 | VALIDADA | VALIDADA | 5 |
| `DRIVE-MATH-ORDI-17` | Matemáticas | ordinales | `MAT-CONTROL-1` | M08 | 3 | VALIDADA | VALIDADA | 6 |
| `DRIVE-MATH-ORDI-18` | Matemáticas | ordinales | `MAT-CONTROL-1` | M08 | 3 | VALIDADA | VALIDADA | 7 |
| `DRIVE-MATH-ORDI-19` | Matemáticas | ordinales | `MAT-CONTROL-1` | M08 | 3 | VALIDADA | VALIDADA | 0 |
| `DRIVE-MATH-ORDI-20` | Matemáticas | ordinales | `MAT-CONTROL-1` | M08 | 3 | VALIDADA | VALIDADA | 1 |
| `DRIVE-MATH-CAL-01` | Matemáticas | operaciones | `MAT-SUMAS-RESTAS` | M12 | 1 | VALIDADA | VALIDADA | 2 |
| `DRIVE-MATH-CAL-02` | Matemáticas | operaciones | `MAT-SUMAS-RESTAS` | M12 | 1 | VALIDADA | VALIDADA | 3 |
| `DRIVE-MATH-CAL-03` | Matemáticas | operaciones | `MAT-SUMAS-RESTAS` | M12 | 1 | VALIDADA | VALIDADA | 4 |
| `DRIVE-MATH-CAL-04` | Matemáticas | operaciones | `MAT-SUMAS-RESTAS` | M12 | 2 | VALIDADA | VALIDADA | 5 |
| `DRIVE-MATH-CAL-05` | Matemáticas | operaciones | `MAT-SUMAS-RESTAS` | M12 | 2 | VALIDADA | VALIDADA | 6 |
| `DRIVE-MATH-CAL-06` | Matemáticas | operaciones | `MAT-SUMAS-RESTAS` | M12 | 2 | VALIDADA | VALIDADA | 7 |
| `DRIVE-MATH-CAL-07` | Matemáticas | operaciones | `MAT-SUMAS-RESTAS` | M12 | 2 | VALIDADA | VALIDADA | 0 |
| `DRIVE-MATH-CAL-08` | Matemáticas | operaciones | `MAT-SUMAS-RESTAS` | M12 | 2 | VALIDADA | VALIDADA | 1 |
| `DRIVE-LANG-SIN-01` | Lengua | sinonimos | `LEN-SINONIMOS-1` | L01 | 0 | VALIDADA | VALIDADA | 2 |
| `DRIVE-LANG-SIN-02` | Lengua | sinonimos | `LEN-SINONIMOS-1` | L01 | 0 | VALIDADA | VALIDADA | 3 |
| `DRIVE-LANG-SIN-03` | Lengua | sinonimos | `LEN-SINONIMOS-1` | L01 | 0 | VALIDADA | VALIDADA | 4 |
| `DRIVE-LANG-SIN-04` | Lengua | sinonimos | `LEN-CONTROL-1` | L01 | 0 | VALIDADA | VALIDADA | 5 |
| `DRIVE-LANG-SIN-05` | Lengua | sinonimos | `LEN-CONTROL-1` | L01 | 0 | VALIDADA | VALIDADA | 6 |
| `DRIVE-LANG-SIN-06` | Lengua | sinonimos | `LEN-CONTROL-1` | L01 | 0 | VALIDADA | VALIDADA | 7 |
| `DRIVE-LANG-SIN-07` | Lengua | sinonimos | `LEN-SINONIMOS-4` | L01 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-LANG-SIN-08` | Lengua | sinonimos | `LEN-SINONIMOS-4` | L01 | 0 | VALIDADA | VALIDADA | 1 |
| `DRIVE-LANG-SIN-09` | Lengua | sinonimos | `LEN-SINONIMOS-8` | L01 | 0 | VALIDADA | VALIDADA | 2 |
| `DRIVE-LANG-SIN-10` | Lengua | sinonimos | `LEN-SINONIMOS-8` | L01 | 1 | VALIDADA | VALIDADA | 3 |
| `DRIVE-LANG-SIN-11` | Lengua | sinonimos | `LEN-SINONIMOS-8` | L01 | 0 | VALIDADA | VALIDADA | 4 |
| `DRIVE-LANG-SIN-12` | Lengua | sinonimos | `LEN-SINONIMOS-8` | L01 | 0 | VALIDADA | VALIDADA | 5 |
| `DRIVE-LANG-SIN-13` | Lengua | sinonimos | `LEN-SINONIMOS-4` | L01 | 0 | VALIDADA | VALIDADA | 6 |
| `DRIVE-LANG-SIN-14` | Lengua | sinonimos | `LEN-SINONIMOS-4` | L01 | 0 | VALIDADA | VALIDADA | 7 |
| `DRIVE-LANG-ANT-01` | Lengua | antonimos | `LEN-SINONIMOS-1` | L02 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-LANG-ANT-02` | Lengua | antonimos | `LEN-SINONIMOS-1` | L02 | 0 | VALIDADA | VALIDADA | 1 |
| `DRIVE-LANG-ANT-03` | Lengua | antonimos | `LEN-SINONIMOS-1` | L02 | 0 | VALIDADA | VALIDADA | 2 |
| `DRIVE-LANG-ANT-04` | Lengua | antonimos | `LEN-SINONIMOS-1` | L02 | 0 | VALIDADA | VALIDADA | 3 |
| `DRIVE-LANG-ANT-05` | Lengua | antonimos | `LEN-SINONIMOS-1` | L02 | 0 | VALIDADA | VALIDADA | 4 |
| `DRIVE-LANG-ANT-06` | Lengua | antonimos | `LEN-SINONIMOS-1` | L02 | 0 | VALIDADA | VALIDADA | 5 |
| `DRIVE-LANG-ANT-07` | Lengua | antonimos | `LEN-SINONIMOS-4` | L02 | 0 | VALIDADA | VALIDADA | 6 |
| `DRIVE-LANG-ANT-08` | Lengua | antonimos | `LEN-SINONIMOS-4` | L02 | 0 | VALIDADA | VALIDADA | 7 |
| `DRIVE-LANG-ANT-09` | Lengua | antonimos | `LEN-SINONIMOS-4` | L02 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-LANG-ANT-10` | Lengua | antonimos | `LEN-SINONIMOS-4` | L02 | 0 | VALIDADA | VALIDADA | 1 |
| `DRIVE-LANG-ANT-11` | Lengua | antonimos | `LEN-CONTROL-1` | L02 | 0 | VALIDADA | VALIDADA | 2 |
| `DRIVE-LANG-ANT-12` | Lengua | antonimos | `LEN-CONTROL-1` | L02 | 0 | VALIDADA | VALIDADA | 3 |
| `DRIVE-LANG-ANT-13` | Lengua | antonimos | `LEN-CONTROL-1` | L02 | 0 | VALIDADA | VALIDADA | 4 |
| `DRIVE-LANG-ANT-14` | Lengua | antonimos | `LEN-CONTROL-1` | L02 | 0 | VALIDADA | VALIDADA | 5 |
| `DRIVE-LANG-COM-01` | Lengua | comunicacion | `LEN-CONTROL-3` | L11 | 0 | VALIDADA | VALIDADA | 6 |
| `DRIVE-LANG-COM-02` | Lengua | comunicacion | `LEN-CONTROL-3` | L11 | 0 | VALIDADA | VALIDADA | 7 |
| `DRIVE-LANG-COM-03` | Lengua | comunicacion | `LEN-CONTROL-3` | L11 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-LANG-COM-04` | Lengua | comunicacion | `LEN-COMUNICACION-2` | L11 | 0 | VALIDADA | VALIDADA | 1 |
| `DRIVE-LANG-COM-05` | Lengua | comunicacion | `LEN-COMUNICACION-2` | L11 | 0 | VALIDADA | VALIDADA | 2 |
| `DRIVE-LANG-COM-06` | Lengua | comunicacion | `LEN-CONTROL-1` | L11 | 0 | VALIDADA | VALIDADA | 3 |
| `DRIVE-LANG-COM-07` | Lengua | comunicacion | `LEN-COMUNICACION-2` | L11 | 0 | VALIDADA | VALIDADA | 4 |
| `DRIVE-LANG-COM-08` | Lengua | comunicacion | `LEN-CONTROL-1` | L11 | 0 | VALIDADA | VALIDADA | 5 |
| `DRIVE-LANG-COM-09` | Lengua | comunicacion | `LEN-CONTROL-1` | L11 | 0 | VALIDADA | VALIDADA | 6 |
| `DRIVE-LANG-COM-10` | Lengua | comunicacion | `LEN-CONTROL-1` | L11 | 0 | VALIDADA | VALIDADA | 7 |
| `DRIVE-LANG-COM-11` | Lengua | comunicacion | `LEN-COMUNICACION-2` | L11 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-LANG-COM-12` | Lengua | comunicacion | `LEN-COMUNICACION-2` | L11 | 0 | VALIDADA | VALIDADA | 1 |
| `DRIVE-LANG-COM-13` | Lengua | comunicacion | `LEN-CONTROL-1` | L11 | 0 | VALIDADA | VALIDADA | 2 |
| `DRIVE-LANG-COM-14` | Lengua | comunicacion | `LEN-COMUNICACION-2` | L11 | 0 | VALIDADA | VALIDADA | 3 |
| `DRIVE-LANG-LECTURA-01` | Lengua | comprension | `LEN-CONTROL-1` | L09 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-LANG-LECTURA-02` | Lengua | comprension | `LEN-CONTROL-1` | L09 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-LANG-LECTURA-03` | Lengua | comprension | `LEN-CONTROL-1` | L09 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-LANG-LECTURA-04` | Lengua | comprension | `LEN-CONTROL-1` | L09 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-LANG-LECTURA-05` | Lengua | comprension | `LEN-CONTROL-1` | L09 | 0 | VALIDADA | VALIDADA | 0 |
| `DRIVE-LANG-LECTURA-06` | Lengua | comprension | `LEN-CONTROL-1` | L09 | 0 | VALIDADA | VALIDADA | 0 |
## Alcance y restricciones

Los resultados "VALIDADA" de esta tabla se refieren a las pruebas **correcta** e **incorrecta** de cada ID ejecutadas en el videojuego, con verificación de renderizado, pistas, explicación y guardado conforme al test. La matriz JSON de cada ejecución especifica qué recargas, dobles pulsaciones y continuaciones se efectuaron en cada caso. Escenarios de concursos de dos pestañas, corrupción de almacenamiento, conciliación de nube, navegador Safari/Firefox y fallo de cuota real no quedan certificados por esta tabla.

**Bloqueos globales de publicación:** revisión pedagógica independiente; cierre de las incidencias de sincronización/conflictos del PR #2; integración final controlada. Supabase no se ha activado ni se ha publicado nada.
