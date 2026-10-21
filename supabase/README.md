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
