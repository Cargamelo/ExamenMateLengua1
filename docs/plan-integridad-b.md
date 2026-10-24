# Informe de correcciones Chat B — rama de trabajo

Fecha: 2026-10-22. Base: `main@164786b5b8f49a1e65c3f0fe1409f7b3bdaba544`.

**ESTADO: PR BORRADOR; NO APTO PARA DESPLIEGUE NI FUSIÓN.** La sincronización remota sigue desactivada. Estas modificaciones no cambian fases, contenidos, personajes, cartas ni CSS.

## Inventario y decisiones

- Progreso local: `ligasaber-2026-math`, `ligasaber-2026-lang`; checkpoint `-checkpoint-v2`. IndexedDB `liga-del-saber-v2` / `snapshots` conserva copias legibles de formato 2.
- Preferencia segura: una partida válida en localStorage NO se sustituye por un snapshot divergente solo porque tenga fecha posterior. Si el origen está corrupto o ausente, se intenta restaurar desde IDB después de validar. El origen corrupto se conserva en `-damaged-backup-v3`.
- Si una versión de datos es desconocida, el juego bloquea la carga en lugar de migrarla destructivamente. No se eliminan claves heredadas.
- `confirmedEvents` conserva identificadores de las últimas 3000 operaciones para evitar repetir premios por una respuesta/misión/finalización confirmada. Esta lista no sustituye una transacción atómica interalmacenes; los casos de corte en puntos críticos requieren pruebas adicionales.
- `specialCheckpoint` contiene el estado de dictados y lectura expresiva dentro del progreso de Lengua. No representa evaluación automática de micrófono.
- El historial sigue truncándose a 500 respuestas y errores generales a 120 entradas. La evolución adaptativa y necesidades se mantienen por separado. La pérdida de detalle anterior a ese límite es una política preexistente que requiere aprobación pedagógica para cambiarse.
- `datos/correspondencia-fases-v1.json` documenta los 30 pares de IDs sin renombrarlos. Las etiquetas artísticas y los títulos funcionales difieren: el mapeo POR ORDEN no implica que sean curricularmente equivalentes.

## Seguimiento por incidencia

| ID | Acción | Estado |
|---|---|---|
| B-001 | Restauración de snapshots IDB al faltar/corromperse localStorage | Parcial: no resuelve copia local válida pero antigua o divergencias ambiguas |
| B-002 | `save()` reporta fallos y el juego presenta aviso | Parcial: sin prueba de cierre físico o transacción parcialmente confirmada |
| B-003 | Transferencia irreversible antes de confirmación | BLOQUEADA: necesita protocolo de prepare/commit y PostgreSQL aislado |
| B-004 | Evento de guardado conectado a `LigaSync.queueSave()` | Parcial: falta cola remota durable y simulación offline |
| B-005 | Validación profunda en `validate-progress.mjs` y cuerpo limitado por streaming | Probado en Node con casos sintéticos, no en Edge Function desplegada |
| B-006 | Bloqueo de versiones incompatibles sin reinicio | Parcial: migraciones idempotentes de todas las versiones históricas no definidas |
| B-007 | Se detecta conflicto de revisión antes de adoptar un valor remoto | Parcial: falta reconciliación probada y concurrencia entre pestañas |
| B-008 | Índices, preguntas y respuestas de checkpoint validados | Probado sintéticamente y en navegador para progreso normal |
| B-009 | Estados adaptativos inválidos bloqueados sin poner monedas a cero | Probado sintéticamente |
| B-010 | Puntuaciones anómalas rechazadas antes de `complete()` | Probado sintéticamente |
| B-011 | Dictados y expresiva recuperan borradores y casillas | Prueba de navegador añadida; requiere comprobar resultado CI |
| B-012 | Mapeo reversible 30 pares | Artefacto validado estructuralmente, equivalencia pedagógica pendiente |
| B-013 | El limitador falla cerrado si falta cabecera confiable configurada | Pendiente de validación del gateway; bloqueo obligatorio |
| B-014 | CI de rama: pruebas sintéticas, fases, navegador y QA visual | Integrado |
| B-015 | Política de limpieza temporal | Pendiente de diseño SQL, entorno aislado y retención aprobada |
| B-016 | Retención histórica documentada | Pendiente de decisión pedagógica, sin borrar datos extra |

## Pruebas e instrucciones

Ejecutar desde la raíz con Node 22:

```sh
node --check juego.js
node --check partida-local.js
node --check adaptativo.js
node --check fases.js
node --check sincronizacion.js
node tests/integridad-b.cjs
node tests/validacion-remota-b.cjs
node tests/fases-secuenciales.cjs
```

Las pruebas de navegador `tests/guardar-y-bloquear.cjs`, `tests/actividades-especiales-b.cjs` y `qa-pixel.js` necesitan Playwright, Chrome/Chromium y servidor HTTP local en el puerto 8765. El workflow `.github/workflows/validar-progreso.yml` las ejecuta en cada push de esta rama. Revisar la conclusión de la última ejecución, no la de un commit anterior.

## Condiciones para pasar el PR a revisión final

1. Probar recuperación de datos divergentes, corte en cada escritura, cuota, IndexedDB bloqueado y cierre del navegador.
2. Diseñar transferencia en dos fases e idempotencia durable, y probar con PostgreSQL Supabase de pruebas.
3. Verificar privacidad, permisos reales, RLS, seguridad de `SECURITY DEFINER` y configuración de gateway.
4. Validar las funciones para códigos caducados/reutilizados, dos dispositivos y dos pestañas.
5. Revisar con Chat E equivalencia artística, ejercicio y reglas de retención, sin cambiar el temario.
6. Ejecutar smoke completo y comprobar que `sync-config.js` continúa con `enabled:false`.

No aplicar migraciones, no fusionar, no publicar, no tocar partidas reales.
