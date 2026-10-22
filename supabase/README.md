# Sincronización remota de La Liga del Saber

**Estado:** sin desplegar. Requiere un proyecto Supabase conectado.

1. Crear un proyecto de Supabase de pruebas con permiso del propietario.
2. Aplicar la migración SQL y verificar los permisos RLS y REVOKE.
3. Configurar TRANSFER_PEPPER con al menos 32 caracteres aleatorios en los secretos del servidor. No publicarlo.
4. Desplegar la función partidas con la configuración de verify_jwt=false. La función valida cada token propio y opera con permisos de servicio solo en el backend.
5. Probar códigos erróneos, caducados, simultáneos, rotación de recuperación, revisión conflictiva y revocación de escritura.
6. Configurar sync-config.js con la URL HTTPS real y enabled=true solo tras las pruebas.

SUPABASE_SERVICE_ROLE_KEY, TRANSFER_PEPPER y otros secretos no deben aparecer en GitHub Pages ni en sus fuentes.

Los códigos son aleatorios y se comprueban mediante un HMAC de servidor; el código de transferencia dura diez minutos, tiene doce símbolos y se consume una sola vez. La recuperación independiente tiene veintiséis símbolos y rota en cada uso. Los RPC utilizan transacciones y bloqueo por fila. Las tablas deniegan acceso directo a anon y authenticated.

**No afirmar que la sincronización esté disponible sin un backend desplegado y comprobado.**

## Estado de seguridad de la rama de integridad (22-10-2026)

**Bloqueo de despliegue:** esta rama NO contiene aún una transferencia en dos fases validada. La operación existente `redeem/recover` cambia la titularidad antes de confirmar el guardado receptor. No activar la sincronización ni usarla con partidas reales.

El servidor utiliza el validador compartido `functions/partidas/validate-progress.mjs`, probado con casos sintéticos desde Node. Los límites de solicitud se comprueban mientras se lee el cuerpo HTTP. Esto no equivale a pruebas con PostgreSQL.

Las operaciones `create`, `issue`, `redeem` y `recover` fallan cerradas en el limitador hasta que exista `TRUSTED_CLIENT_IP_HEADER` con un valor explícito entre `cf-connecting-ip`, `x-real-ip` y `x-forwarded-for`. **Configurar una de esas cabeceras no basta:** antes de habilitar operaciones, demostrar en un backend de pruebas que el gateway la sobrescribe, elimina las cabeceras suministradas por clientes e identifica correctamente a varios clientes. Sin esta prueba, mantener el servidor inaccesible.

El protocolo de transferencia, las revisiones concurrentes, los privilegios SQL reales, las políticas RLS y la limpieza de registros temporales requieren un proyecto Supabase de pruebas autorizado. No hay migraciones nuevas aplicadas a ninguna base de datos. Comprobar `supabase test db` y los permisos efectivos, siguiendo la documentación oficial, antes de plantear despliegue.
