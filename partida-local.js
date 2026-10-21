"use strict";
/* Persistencia local retrocompatible: la escritura sincrónica protege contra cierres inmediatos,
   IndexedDB mantiene un segundo ejemplar versionado; ninguna migración borra las claves anteriores. */
(function(){
 const PREFIX="ligasaber-2026-",CHECK="-checkpoint-v2",DB="liga-del-saber-v2";
 let connection=null;
 function openDB(){
  if(!("indexedDB" in window))return Promise.resolve(null);
  if(connection)return connection;
  connection=new Promise(resolve=>{
   try{const r=indexedDB.open(DB,1);
    r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains("snapshots"))db.createObjectStore("snapshots")};
    r.onsuccess=()=>resolve(r.result);r.onerror=()=>resolve(null);r.onblocked=()=>resolve(null);
   }catch{resolve(null)}
  });return connection;
 }
 function readJSON(key){try{return JSON.parse(localStorage.getItem(key)||"null")}catch{return null}}
 function saveJSON(key,data){try{localStorage.setItem(key,JSON.stringify(data));return true}catch{return false}}
 async function mirror(subject,progress,checkpoint){
  const db=await openDB();if(!db)return false;
  return new Promise(resolve=>{try{
   const tx=db.transaction("snapshots","readwrite"),store=tx.objectStore("snapshots");
   store.put({version:2,modified:Date.now(),data:progress},PREFIX+subject);
   store.put({version:2,modified:Date.now(),data:checkpoint},PREFIX+subject+CHECK);
   tx.oncomplete=()=>resolve(true);tx.onerror=()=>resolve(false);tx.onabort=()=>resolve(false);
  }catch{resolve(false)}});
 }
 let pending={};let saving=false;
 function flush(){if(saving)return;saving=true;const batch=pending;pending={};
  Promise.all(Object.entries(batch).map(([subject,x])=>mirror(subject,x.progress,x.checkpoint))).finally(()=>{
   saving=false;if(Object.keys(pending).length)flush();
  });
 }
 function save(subject,progress,checkpoint){
  if(!["math","lang"].includes(subject)||!progress||!Array.isArray(progress.history))return false;
  const ok=saveJSON(PREFIX+subject,progress);
  if(checkpoint!==undefined)saveJSON(PREFIX+subject+CHECK,checkpoint);
  pending[subject]={progress,checkpoint:readJSON(PREFIX+subject+CHECK)};
  flush();return ok;
 }
 function readCheckpoint(subject){const c=readJSON(PREFIX+subject+CHECK);
  if(!c||c.version!==2||c.subject!==subject||!c.stageId||!Array.isArray(c.session?.items)||!Array.isArray(c.session?.results))return null;
  return c;
 }
 function clearCheckpoint(subject,progress){
  saveJSON(PREFIX+subject+CHECK,null);pending[subject]={progress,checkpoint:null};flush();
 }
 window.LigaPartida={save,readCheckpoint,clearCheckpoint,openDB};
})();
