"use strict";
const VERSION="ligasaber-static-v2-20261021";
const CORE=["./","./index.html","./matematicas-sda1.html","./lengua-sda1.html","./juego.js","./contenidos.js","./adaptativo.js","./minijuegos.js","./fases.js","./mapas.js","./coleccion.js","./datos-cartas.js","./efectos.js","./partida-local.js","./mejora-v2.css","./tema-pixel.css","./fases.css","./estilos.css","./visual.css","./acabados.css","./aventura.css","./interacciones.css","./mundos.css","./assets/portada-nitida.svg","./assets/guia-tiko-v2.svg","./assets/guia-nara-v2.svg","./assets/mapa-mates-nitido.svg","./assets/mapa-lengua-nitido.svg","./assets/portal-mates-nitido.svg","./assets/portal-lengua-nitido.svg"];
self.addEventListener("install",event=>event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("ligasaber-static-")&&key!==VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=="GET"||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 // El trabajador nunca almacena credenciales, respuestas privadas ni endpoints remotos.
 if(!/\.(?:html|js|css|svg|webp|png|json|webmanifest)$/.test(url.pathname)&&url.pathname!==new URL(self.registration.scope).pathname)return;
 if(req.mode==="navigate"){
  event.respondWith(fetch(req).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSION).then(cache=>cache.put(req,cp));}return res;}).catch(()=>caches.match(req,{ignoreSearch:true}).then(hit=>hit||caches.match("./index.html"))));
 }else{
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{if(res.ok&&res.type==="basic"){const cp=res.clone();caches.open(VERSION).then(cache=>cache.put(req,cp));}return res;})));
 }
});