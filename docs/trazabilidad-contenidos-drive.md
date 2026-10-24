# Integración docente Google Drive — trazabilidad y límites

**Rama:** `feat/contenidos-drive-liga-saber`. **Base:** `main@54d7240fadc32f54d5a426f5f6e6a50d890cff1b`.

**Reglas:** no publicar los PDF, imágenes, solucionarios ni transcripciones de Drive. Las preguntas son enunciados originales breves sobre conceptos documentados. Este informe no contiene nombres de alumnado ni información identificativa extraída de fichas.

## A. Inventario del recorrido de carpetas

Se accedió a:
- Lengua / REPASO SDA 1-LENGUAS POR EL MUNDO- / CONTROLES DE REPASO (5 ficheros) y ACTIVIDADES (17 ficheros).
- Matemáticas / REPASO SDA 1 -¡MOLA MIL!- / CONTROLES DE REPASO (4 ficheros) y ACTIVIDADES DE REPASO (10 ficheros).
- Raíz Matemáticas: DÉCIMO DE LOTERÍA.jpg y un HTML de historial de conversación (2 ficheros).

**38 archivos enumerados en total (22 de Lengua y 16 de Matemáticas), en seis carpetas internas bajo las dos carpetas principales.** El registro completo, sin IDs ni datos personales, figura en `docs/inventario-drive-sda1.json`. Los archivos audiovisuales de las diapositivas no están interpretados. El archivo de historial de conversación se excluye intencionadamente por privacidad y por no ser un material escolar verificable.

### Matemáticas — contenidos que sustentan las preguntas

| Clave | Archivo de Drive | Contenido utilizado | Observaciones |
|---|---|---|---|
| MAT-CONTROL-1 | CONTROLES DE REPASO / CONTROL DE REPASO 1.pdf | Ordenación, descomposición, anterior/posterior y ordinales (apartados 1, 2, 3, 5, 6) | Se cotejó con SOLUCIONARIO CONTROL DE REPASO SDA 1.pdf |
| MAT-CONTROL-2 | CONTROLES DE REPASO / CONTROL DE REPASO 2.pdf | Posiciones, ordenación, redondeo, comparación y ordinales (apartados 2–9) | Cotejado con SOLCUIONARIO CONTROL DE REPASO 2.pdf; declara 4.º de Primaria, por lo que no se importan actividades de multiplicación |
| MAT-LECTURA-2 | ACTIVIDADES DE REPASO / Act. 2 LECTURA DE NÚMEROS.pdf | Números expresados en palabras, 4 cifras, ceros en decenas y centenas (apartados 1, 4) | Ficha de origen externo; no reproducida |
| MAT-COMPARACION-2 | ACTIVIDADES DE REPASO / Act. 2 COMPARACIÓN DE NÚMEROS.jpg | Mayor, menor, orden ascendente/descendente | Imagen revisada visualmente |
| MAT-COMPARACION-4 | ACTIVIDADES DE REPASO / Act. 4 COMPARACIÓN DE NÚMEROS.png | Anterior/posterior de números de cuatro cifras | Imagen revisada visualmente |
| MAT-SUMAS-RESTAS | ACTIVIDADES DE REPASO / FICHAS SUMAS Y RESTAS.pdf | Sumas y restas; ejercicios originales construidos y verificados aritméticamente | Los operandos no fueron legibles en el texto extraído; no se atribuyen ejercicios concretos al PDF |

Otros archivos identificados: Act. 1, 3 y 4 LECTURA DE NÚMEROS.pdf (sin texto extraíble, revisadas como imágenes en sus 2, 4 y 7 páginas); Act. 1 COMPARACIÓN DE NÚMEROS.pdf y Act. 1 NÚMEROS ORDINALES Y CARDINALES.pdf (sin texto extraíble, inspeccionadas visualmente); Act. 3 COMPARACIÓN DE NÚMEROS.jpg (inspección visual); los dos controles de Matemáticas y sus dos solucionarios (4). DÉCIMO DE LOTERÍA.jpg se examinó visualmente, pero no se reprodujo por sus componentes gráficos originales.

### Lengua — contenidos que sustentan las preguntas

| Clave | Archivo de Drive | Contenido utilizado | Observaciones |
|---|---|---|---|
| LEN-CONTROL-1 | CONTROLES DE REPASO / CONTROL DE REPASO 1.pdf | Comprensión de fábula, comunicación, sinónimos y antónimos | Soluciones contrastadas con SOLUCIONARIO CONTROL DE REPASO 1.pdf; fábula reescrita desde cero |
| LEN-CONTROL-3 | CONTROLES DE REPASO / CONTROL DE REPASO 3 CON SOLUCIONARIO.png | Comunicación verbal oral/escrita y no verbal, sinónimos y antónimos | Imagen revisada, con respuestas visibles |
| LEN-SINONIMOS-1 | ACTIVIDADES / Act. 1 Sinónimos y antónimos.jpg | Parejas léxicas de uso frecuente | Imagen revisada |
| LEN-SINONIMOS-4 | ACTIVIDADES / Act. 4 Sinónimos y antónimos.jpg | Sinónimos, antónimos, combinaciones | Imagen revisada |
| LEN-SINONIMOS-8 | ACTIVIDADES / Act. 8 Sinónimos y antónimos.jpg | Equivalencias de vocabulario | Imagen revisada |
| LEN-COMUNICACION-2 | ACTIVIDADES / Act. 2 La comunicación.jpg | Emisor, receptor, mensaje, código, canal, comunicación verbal/no verbal | Imagen revisada |

Otros materiales revisados visualmente: Act. 1, 3 y 4 La comunicación.jpg; Act. 2, 3, 5, 6 y 7 Sinónimos y antónimos.jpg. También se inventariaron y se intentó consultar CONTROL DE REPASO 2.png, su solucionario, la ficha Act. 4 Sinónimos y antónimos.png y Ejercicios de elementos de la comunicación (Del revés).pdf. EJERCICIOS ELEMENTOS DE LA COMUNICACIÓN.pdf no devolvió texto pero sus 2 páginas se leyeron visualmente. Se abrieron ambas presentaciones: la primera contiene 12 diapositivas sobre comunicación verbal/no verbal; la segunda, 17 sobre emisor/receptor/canal/código. **Los vídeos y recursos multimedia de las diapositivas no se han verificado**, y sus ejemplos no se incorporaron como preguntas específicas.

### Incidencias documentales

- El solucionario de Matemáticas 1 contiene una discordancia: da 8989 como anterior de 8999; el resultado aritmético correcto es **8998**. El juego usa la operación matemática verificada.
- El solucionario de Matemáticas 2 se identifica como de 4.º de Primaria y plantea multiplicaciones; se descarta esa mecánica, aunque se aprovechan ejercicios apropiados de comparación y redondeo.
- El solucionario de Lengua 1 contiene un error ortográfico en un ejemplo libre (\`plata\` por \ `playa\`); no se utiliza como solución.
- Algunas fichas proceden de editoriales/sitios externos: se utilizan únicamente como referencia de contenidos, sin incorporar sus páginas, dibujos ni transcripciones literales.
- No consta autorización para publicar íntegramente contenidos de Drive. Por ello se conserva solo trazabilidad con nombres, secciones y claves internas. El número de página no se rellena cuando no está verificado.

## B. Matriz curricular y contrato de distribución

| Fases funcionales | Conceptos derivados de Drive |
|---|---|
| Math 01–03 | Lectura y escritura hasta cuatro cifras, anterior/posterior |
| Math 04–05 | Descomposición, UM/C/D/U y cero en posiciones |
| Math 06–07 | Comparación, ordenación y aproximación |
| Math 08–09 | Ordinales y diferencia con cardinales |
| Math 10–12 | Sumas/restas convencionales existentes; actividades originales con resultados verificados |
| Math 13–15 | Repaso mixto de conceptos anteriores sin nuevas unidades |
| Lang 01–04 | Sinónimos y antónimos contextualizados |
| Lang 05–06 | Identificación de los elementos de la comunicación (se preserva el filtro original del motor) |
| Lang 07–08 | Taller previo de mayúsculas/puntos, sin material nuevo no verificado |
| Lang 09 | Comprensión: nueva lectura original con 6 preguntas, inspirada en el concepto de fábula revisado |
| Lang 10–12 | Repaso mixto de vocabulario y comunicación, manteniendo actividades previas |
| Lang 13–14 | Dictado y lectura expresiva preexistentes, sin cambios de evaluación |
| Lang 15 | Repaso final con preguntas del banco y del motor existente |

**Se mantienen los identificadores `math-stage-01..15` y `lang-stage-01..15`.** El mapeo artístico de la rama de integridad es orientativo y no cambia el currículo de las fases.

## C. Integración técnica

- `preguntas-drive.js`: 124 preguntas originales, 82 Matemáticas + 42 Lengua; referencia documental, respuesta, opciones, pistas, explicación y metadatos `check` para verificación. Añade 1 lectura original de comprensión con 6 pares pregunta-respuesta.
- `juego.js`: selecciona el banco docente en una de cada tres peticiones normales; continúa usando el generador existente cuando no corresponde o existe un filtro especial. Se preservan seis escalones y todas las reglas preexistentes.
- `matematicas-sda1.html` y `lengua-sda1.html`: incluyen el script del banco antes del motor.
- `sw.js`: nueva caché de versión que incorpora el script para PWA offline.
- `tests/contenidos-drive.cjs`: validaciones aritméticas, semánticas estructurales e identificadores; `tests/contenidos-drive-browser.cjs`: ejercicio jugable, corrección y recuperación en navegador.
- `.github/workflows/validar-contenidos-drive.yml`: comprobaciones CI de integridad del banco, las 30 fases, almacenamiento, navegador y responsive.

No se modifica el esquema de progreso, las recompensas, `adaptativo.js`, `fases.js`, las 24 cartas ni Supabase.

## D. Limitaciones para revisión

- La exactitud semántica de pares léxicos la sustenta el análisis pedagógico de las fichas, pero no un demostrador formal: requiere revisión independiente docente.
- Los vídeos incrustados en presentaciones, las imágenes con ejercicios ambiguos y el historial HTML (excluido por privacidad) no se trasladaron al banco.
- Antes de fusionar, revisar en la ejecución más reciente de CI las pruebas de escritorio/móvil, recarga y ruta PWA. La cobertura del nuevo banco no sustituye una auditoría de persistencia de Chat B.
