# Temario de Lengua — revisión de 17 materiales adjuntos

**Ámbito:** Sinónimos, antónimos, comunicación verbal/no verbal y elementos de la comunicación de 3.º de Primaria. **Versión:** desarrollo independiente sobre PR #14.

## Inventario de fuentes y modalidades comprobadas

| Fichero adjunto | Actividades visibles relevantes | Decisión |
|---|---|---|
| Act. 1 Sinónimos y antónimos.jpg | Identificar sinónimos, relacionar términos y completar sinónimos/antónimos | Adaptación original de completar y emparejar |
| Act. 2 Sinónimos y antónimos.jpg | Escribir pares de significado parecido/contrario y clasificar por sílabas | Solo vocabulario; sílabas/acentuación excluidas |
| Act. 3 Sinónimos y antónimos.jpg | Palabras intrusas, seleccionar contrarios y completar oraciones | Nuevos retos de intrusos y sustitución contextual |
| Act. 4 Sinónimos y antónimos.jpg | Relacionar sinónimos y escribir sinónimos | Retos de emparejar y escribir |
| Act. 4 Sinónimos y antónimos.png | Sinónimo, antónimo, doble relación y reescritura | Retos de dos campos y reescritura con revisión |
| Act. 5 Sinónimos y antónimos.jpg | Antónimos en oraciones y completar parejas | Escritura y concordancia |
| Act. 6 Sinónimos y antónimos.jpg | Completar palabras, seleccionar contrarios y relacionar parejas | Variantes de completar y emparejar |
| Act. 7 Sinónimos y antónimos.jpg | Buscar la palabra intrusa y completar oraciones contextualizadas | Discriminación de grupos y vocabulario |
| Act. 8 Sinónimos y antónimos.jpg | Completar texto con antónimos, muchas palabras, concordancia | Retos de huecos en oraciones originales; no se copia el relato |
| Act. 1 La comunicación.jpg | Verbal/no verbal a partir de gestos, señales y escenas | Clasificación y elección situacional |
| Act. 2 La comunicación.jpg | Relacionar situaciones con sonidos, imágenes, gestos y lenguaje | Categorías y clasificación |
| Act. 3 La comunicación.jpg | Clasificar ejemplos y relacionar emisor, receptor, código, canal, contexto | Definiciones y distinción código/canal |
| Act. 4 La comunicación.jpg | Clasificar escenas visuales oral/escrito/señal/gesto | Escenas textuales originales |
| Ej. Lengua (Comunicación verbal y no verbal).pptx | 12 diapositivas: 2 introductorias, 10 con escenas reales para verbal y no verbal | Solo los ejemplos verificables, sin reutilizar fotografías |
| Ejercicios de elementos de la comunicación (Del revés).pdf | 6 páginas: 10 situaciones y tabla emisor/receptor/mensaje/código/canal/contexto | Tablas y análisis originales |
| EJERCICIOS ELEMENTOS DE LA COMUNICACIÓN.pdf | 2 páginas; 10 escenas a analizar más plantilla de seis elementos | Tablas completas y situaciones escritas originales |
| Elementos de la comunicación .pptx | 17 diapositivas: presentación de análisis de vídeos y múltiples preguntas de los seis elementos | Se incorpora la modalidad de análisis; **no se infieren respuestas sobre el contenido de los vídeos incrustados** |

La presentación de 12 diapositivas contiene un MOV incrustado y la de 17 contiene archivos MOV/MP4. La lectura de diapositivas y el recuento de medios incrustados no implica una revisión audiovisual completa de esas secuencias; **no se certifican escenas o diálogos no vistos**. Se han excluido también todas las materias incidentales ajenas al temario aprobado (sílaba tónica, diptongos, hiatos, etc.).

## Catálogo nuevo

- **157 actividades con ID estable** `TEM-L-001` a `TEM-L-157`: 56 de sinónimos, 54 de antónimos y 47 de comunicación.
- Tipos de respuesta: 72 de escritura breve, 36 de selección contextual, 20 de varios huecos, 10 de emparejamiento, 8 de clasificación, 6 de reescritura guiada y 5 de selección múltiple.
- Los retos de comunicación contemplan emisor, receptor, mensaje, código, canal y contexto. Los ejemplos distinguen lenguaje oral/escrito de señales y sonidos *no lingüísticos*. Un cartel con palabras se clasifica como verbal escrito.
- Escritura contextual con variantes válidas expresamente declaradas. Corrección determinista por campo; un primer error permite rectificar con el campo concreto marcado. La escritura libre realiza comprobaciones objetivas **sin proclamar corrección semántica automática** y exige autoevaluación.

Cada entrada de `docs/matriz-17-fichas-lengua.json` contiene origen, concepto, ID, fases, tipo, respuestas/alternativas y método de verificación. La correspondencia con una fuente es de **competencia y tipología**, no una reproducción literal de su material.

## Sustitución efectiva y migración

Para los tres conceptos afectados, `juego.js` consulta primero `LigaTemarioLengua.pick()` en fases normales y de repaso; los bancos antiguos dejan de competir con el nuevo catálogo en esos recorridos. El selector usa **fase**, **escalón adaptativo**, **IDs ya vistos** y **mecánicas recientes** para procurar no encadenar tres veces la misma modalidad. Cuando una fase no disponga de candidato de nuevo catálogo compatible, sigue disponible el generador original como fallback seguro.

No se eliminan los antiguos `DRIVE-LANG-*`, `VAR-L-*` ni los registros `contenidos.js`; así, los checkpoints antiguos e históricos de errores pueden referenciar sus IDs y enunciados. Tabla de correspondencia:

| Contenido anterior | Contenido vigente de la fase | Historial |
|---|---|---|
| DRIVE-LANG sinónimos y antónimos | TEM-L `sinonimos` / `antonimos` | ID antiguo intacto |
| DRIVE-LANG comunicación | TEM-L `comunicacion` | ID antiguo intacto |
| VAR-L escritura, clasificación y emparejamiento | TEM-L de tipo equivalente | ID antiguo intacto |
| Temas no afectados, actividades especiales y Matemáticas | Sin sustitución curricular | Sin cambios |

En la nueva colección las fases **1, 3 y 10** trabajan sinónimos, **2, 4 y 10** antónimos; **5, 6, 11** comunicación, y **15** repaso combinado. Las fases 7-9, 12-14 conservan su orientación propia. Se exige un mínimo de tres modalidades en las fases curriculares normales de Lengua durante la regresión completa.

## Protección de datos y producto

No se sube ninguna foto editorial, ficha íntegra, vídeo, dato personal de los ejemplos ni texto de alumnado. No se activa Supabase ni corrección remota. Los campos y autoevaluaciones se conservan en el checkpoint local actual. No se modifica `main`, la portada, los mapas, los personajes ni las cartas.

## Pruebas exigidas

- `tests/temario-lengua.cjs`: los 157 IDs y sus validadores, alternativas, fase elegible y ausencia de duplicados.
- `tests/temario-browser.cjs`: 314 recorridos Chromium correctos/incorrectos reales, con pistas, recarga, historiales, y avance.
- `tests/certificar-30-fases.cjs`: 30 fases y finalización sin duplicación de recompensas; cuantificación de mecánicas en las 9 fases curriculares indicadas.
- `tests/certificar-offline-pwa.cjs`: nuevo temario disponible offline.
- `tests/smoke-pixel.cjs`, `qa-pixel.js`, `tests/guardar-y-bloquear.cjs`: regresión del juego, responsive y persistencia.
- `tests/certificar-temario.cjs`: **falla** si no hay exactamente 157 actividades y 314 escenarios certificados, repartidos en 12 grupos.

El estado de certificación se determina únicamente por GitHub Actions sobre el SHA definitivo del PR; el catálogo no se considera publicado ni fusionado por superar pruebas.
