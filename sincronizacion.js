"use strict";
/* Vinculación opcional. Desactivada si falta una Edge Function verificada.
   No guarda secretos ni códigos en la URL ni en archivos públicos. */
(function(){
 const cfg=window.LigaSyncConfig||{},enabled=cfg.enabled===true&&/^https:\/\/[a-z0-9.-]+\/functions\/v1\/partidas\/?$/i.test(cfg.endpoint||"");
 const authDb="ligasaber-auth-v1";let cachedAuth=null,pendingTimer=null,busy=false,modal=null;
 function openAuth(){return new Promise((resolve,reject)=>{const r=indexedDB.open(authDb,1);r.onupgradeneeded=()=>r.result.createObjectStore("tokens");r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
 async function storage(action,value){
  const db=await openAuth();return new Promise((resolve,reject)=>{
   const tx=db.transaction("tokens",action==="get"?"readonly":"readwrite"),store=tx.objectStore("tokens");
   const r=action==="get"?store.get("current"):action==="set"?store.put(value,"current"):store.delete("current");
   r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
  });
 }
 async function auth(){if(!enabled)return null;if(cachedAuth)return cachedAuth;return cachedAuth=await storage("get")||null}
 async function send(data,token){
  const res=await fetch(cfg.endpoint,{method:"POST",mode:"cors",cache:"no-store",headers:{"content-type":"application/json",...(token?{"x-liga-token":token}:{})},body:JSON.stringify(data)});
  const json=await res.json().catch(()=>({error:"El servidor no ha respondido correctamente"}));
  if(!res.ok||json.ok===false||json.error){const e=new Error(json.error||json.reason||"Error de sincronización");e.status=res.status;throw e}
  return json;
 }
 const read=x=>{try{return JSON.parse(localStorage.getItem(x)||"null")}catch{return null}};
 function snapshot(){
  return Object.fromEntries(["math","lang"].map(subject=>[subject,{
   progress:read("ligasaber-2026-"+subject),
   checkpoint:read("ligasaber-2026-"+subject+"-checkpoint-v2")
  }]));
 }
 function signal(message){
  let status=document.getElementById("liga-sync-status");
  if(status)status.textContent=message;
 }
 async function save(){
  const a=await auth();if(!a)return false;
  if(!navigator.onLine){signal("Pendiente de conexión: avance guardado en este dispositivo");return false}
  const x=await send({action:"save",id:a.id,revision:a.revision,operation:crypto.randomUUID(),progress:snapshot()},a.deviceToken);
  a.revision=x.revision;await storage("set",a);signal("Sincronizado");return true;
 }
 function queueSave(){
  if(!enabled||!cachedAuth)return;
  signal("Guardado en este dispositivo");
  clearTimeout(pendingTimer);
  pendingTimer=setTimeout(()=>{save().catch(e=>signal(e.status===403?"Control activo en otro dispositivo":"Error de sincronización: conserva tu partida local"));},1500);
 }
 function close(){modal?.remove();modal=null}
 function show(title,html){close();const o=document.createElement("div");o.className="liga-sync-overlay";o.innerHTML='<div class="liga-sync-shade" data-sync="close"></div><section class="liga-sync-dialog" role="dialog" aria-modal="true" aria-labelledby="liga-sync-title"><button class="liga-sync-close" data-sync="close" aria-label="Cerrar">×</button><h2 id="liga-sync-title"></h2><div class="liga-sync-content">'+html+'</div><p class="liga-sync-response" role="status" aria-live="polite"></p></section>';o.querySelector("h2").textContent=title;document.body.append(o);modal=o;o.querySelector("button")?.focus()}
 function say(t){if(modal)modal.querySelector(".liga-sync-response").textContent=t}
 const btn=(op,label)=>'<button type="button" data-sync="'+op+'">'+label+'</button>';
 async function issue(){
  if(busy)return;busy=true;try{
   say("Guardando los avances…");let a=await auth(),recovery=null;
   if(!a){
    const r=await send({action:"create",progress:snapshot()});
    a={id:r.id,deviceToken:r.deviceToken,revision:r.revision};recovery=r.recoveryCode;cachedAuth=a;await storage("set",a);
   }else await save();
   const r=await send({action:"issue",id:a.id},a.deviceToken);
   const box=modal?.querySelector(".liga-sync-content");if(!box)return;
   box.replaceChildren();const p=document.createElement("p");p.textContent="Introduce este código en el otro dispositivo. Caduca en 10 minutos.";box.append(p);
   const code=document.createElement("strong");code.className="liga-transfer-code";code.textContent=r.code;box.append(code);
   const copy=document.createElement("button");copy.type="button";copy.textContent="Copiar código";copy.onclick=()=>navigator.clipboard?.writeText(r.code);box.append(copy);
   const cancel=document.createElement("button");cancel.type="button";cancel.textContent="Anular código";cancel.dataset.sync="cancel";box.append(cancel);
   if(recovery){const aside=document.createElement("p");aside.className="liga-recovery-notice";aside.textContent="Código de recuperación para el adulto: "+recovery+". Guárdalo fuera del dispositivo. Solo se muestra ahora.";box.append(aside)}
   say("Código generado. No compartas el código de recuperación.");
  }catch(e){say(e.message)}finally{busy=false}
 }
 function backupAndReplace(p){
  const old=snapshot();localStorage.setItem("liga-copia-previa-transferencia",JSON.stringify({date:Date.now(),data:old}));
  try{for(const t of ["math","lang"]){const obj=p[t];if(obj&&obj.progress&&Array.isArray(obj.progress.history)){
    localStorage.setItem("ligasaber-2026-"+t,JSON.stringify(obj.progress));
    localStorage.setItem("ligasaber-2026-"+t+"-checkpoint-v2",JSON.stringify(obj.checkpoint||null));
   }}
  }catch(e){for(const t of ["math","lang"]){const obj=old[t];if(obj?.progress)localStorage.setItem("ligasaber-2026-"+t,JSON.stringify(obj.progress));if(obj?.checkpoint)localStorage.setItem("ligasaber-2026-"+t+"-checkpoint-v2",JSON.stringify(obj.checkpoint))}throw e}
 }
 async function importGame(action){
  if(busy)return;const field=modal?.querySelector("input");const value=field?.value.trim();if(!value){say("Introduce un código");return}
  const current=snapshot(),hasLocal=["math","lang"].some(t=>current[t].progress?.history?.length||Object.keys(current[t].progress?.stageJourney?.completed||{}).length);
  if(hasLocal&&!confirm("Este dispositivo ya tiene avances. Se guardará una copia local antes de importar la partida. ¿Continuar?"))return;
  busy=true;
  try{say("Verificando…");const r=await send(action==="redeem"?{action,code:value}:{action,recoveryCode:value});
   backupAndReplace(r.progress);
   const a={id:r.id,deviceToken:r.deviceToken,revision:r.revision};await storage("set",a);cachedAuth=a;
   if(r.recoveryCode){const msg="Nuevo código de recuperación: "+r.recoveryCode+". Anótalo antes de cerrar.";alert(msg)}
   signal("Sincronizado");location.reload();
  }catch(e){say(e.message)}finally{busy=false}
 }
 function inputPanel(recovery){show(recovery?"Recuperar control":"Insertar código",'<p>'+(recovery?"Introduce el código de recuperación guardado por el adulto. Se revocará el dispositivo anterior.":"Introduce el código temporal mostrado en el otro dispositivo.")+'</p><label for="liga-code-input">Código</label><input id="liga-code-input" autocomplete="off" spellcheck="false" maxlength="40" placeholder="Introduce tu código">'+btn(recovery?"recover":"redeem",recovery?"Recuperar mi partida":"Cargar partida"))}
 document.addEventListener("click",async e=>{
  const b=e.target.closest("[data-sync]");if(!b)return;
  const action=b.dataset.sync;
  if(action==="close")return close();
  if(!enabled)return;
  if(action==="request"){show("Solicitar código","<p>Transfiere tus avances a otro dispositivo durante diez minutos.</p><p>Prepara también un código de recuperación para un adulto.</p>"+btn("issue","Generar código"));return}
  if(action==="insert")return inputPanel(false);
  if(action==="recovery")return inputPanel(true);
  if(action==="issue")return issue();
  if(action==="redeem"||action==="recover")return importGame(action);
  if(action==="cancel"){try{const a=await auth();await send({action:"cancel",id:a.id},a.deviceToken);say("Código anulado");}catch(e){say(e.message)}return}
  if(action==="logout"){
   if(!confirm("¿Cerrar sesión en este dispositivo? Se conservará la partida remota, pero necesitarás su código de recuperación para volver a acceder. Los datos locales se guardarán primero en una copia."))return;
   localStorage.setItem("liga-copia-previa-transferencia",JSON.stringify({date:Date.now(),data:snapshot()}));
   await storage("delete");cachedAuth=null;
   for(const t of ["math","lang"]){localStorage.removeItem("ligasaber-2026-"+t);localStorage.removeItem("ligasaber-2026-"+t+"-checkpoint-v2")}
   location.href="./index.html";return;
  }
 });
 document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
 document.addEventListener("DOMContentLoaded",async()=>{
  for(const b of document.querySelectorAll("[data-sync='request'],[data-sync='insert'],[data-sync='recovery'],[data-sync='logout']")){
   b.disabled=!enabled;b.title=enabled?"":"Requiere configurar y verificar el servidor de sincronización";
  }
  signal(enabled?"Guardado en este dispositivo. Consultando servidor…":"Guardado local · Transferencia pendiente de configurar");
  if(!enabled)return;
  try{const a=await auth();if(a){
   const r=await send({action:"read",id:a.id},a.deviceToken);
   a.revision=r.revision;await storage("set",a);signal("Sincronizado");
  }else signal("Partida local disponible");
  }catch(e){signal(e.status===403?"Control activo en otro dispositivo":"No se pudo comprobar la sincronización; datos locales conservados")}
 });
 window.LigaSync={enabled,queueSave};
})();
