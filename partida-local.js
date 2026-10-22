"use strict";
/* Copia local sin cambios destructivos: localStorage es la escritura inmediata;
   IndexedDB es respaldo versionado. Ante divergencia ambigua, detener y conservar ambas. */
(function(){
 const PREFIX="ligasaber-2026-",CHECK="-checkpoint-v2",DB="liga-del-saber-v2",STORE="snapshots";
 let connection=null,pending={},saving=false;
 const allowed=s=>s==="math"||s==="lang";
 const key=s=>PREFIX+s, ck=s=>key(s)+CHECK;
 const safe=x=>{try{return JSON.stringify(x)}catch{return null}};
 const parse=x=>{try{return JSON.parse(x)}catch{return null}};
 function valid(p){
  if(!p||typeof p!=="object"||Array.isArray(p)||!Array.isArray(p.history)||!Array.isArray(p.misses||[])||!Array.isArray(p.badges||[]))return false;
  if(p.stageJourney&&(!Number.isSafeInteger(p.stageJourney.version)||p.stageJourney.version>1||!p.stageJourney.completed||typeof p.stageJourney.completed!=="object"||Array.isArray(p.stageJourney.completed)))return false;
  if(p.adaptive&&(!Number.isSafeInteger(p.adaptive.version)||p.adaptive.version>2))return false;
  return true;
 }
 function checkpointValid(c,subject){
  if(!c||c.version!==2||c.subject!==subject||!new RegExp("^"+subject+"-stage-(0[1-9]|1[0-5])$").test(c.stageId))return false;
  const s=c.session,i=c.questionIndex,a=c.answered;
  if(!s||s.stageId!==c.stageId||s.finished||!Array.isArray(s.items)||!Array.isArray(s.results)||!Number.isSafeInteger(s.target)||s.target<1||s.target>100)return false;
  if(!Number.isSafeInteger(i)||i<0||i>=s.target||i>=s.items.length||s.items.length>s.target||s.items.some(q=>!q||typeof q!=="object"||!q.topic))return false;
  if(!Number.isSafeInteger(c.hintCount)||c.hintCount<0||c.hintCount>2||typeof c.response!=="string")return false;
  if(a!==null&&(!a||typeof a.ok!=="boolean"))return false;
  if(s.results.length!==i+(a===null?0:1)||s.results.some(x=>!x||typeof x.ok!=="boolean"))return false;
  return true;
 }
 function openDB(){
  if(connection)return connection;
  if(!("indexedDB" in window))return Promise.resolve(null);
  connection=new Promise(resolve=>{
   let done=false,timer;
   const finish=db=>{if(done)return;done=true;clearTimeout(timer);if(!db)connection=null;resolve(db)};
   try{
    const req=window.indexedDB.open(DB,1);
    timer=setTimeout(()=>finish(null),2500);
    req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE)};
    req.onsuccess=()=>finish(req.result);req.onerror=()=>finish(null);req.onblocked=()=>finish(null);
   }catch{finish(null)}
  });return connection;
 }
 function readDB(db,k){
  if(!db)return Promise.resolve(null);
  return new Promise(resolve=>{try{const tx=db.transaction(STORE,"readonly"),r=tx.objectStore(STORE).get(k);
   r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>resolve(null);tx.onabort=()=>resolve(null);
  }catch{resolve(null)}});
 }
 function readLocal(subject){
  try{return {progress:localStorage.getItem(key(subject)),checkpoint:localStorage.getItem(ck(subject)),error:false}}
  catch{return {progress:null,checkpoint:null,error:true}};
 }
 function writeLocal(k,val){try{localStorage.setItem(k,val);return true}catch{return false}}
 async function mirror(subject,progress,checkpoint){
  const db=await openDB();if(!db)return false;
  return new Promise(resolve=>{try{
   const tx=db.transaction(STORE,"readwrite"),store=tx.objectStore(STORE),now=Date.now();
   store.put({version:2,modified:now,data:progress},key(subject));
   store.put({version:2,modified:now,data:checkpoint},ck(subject));
   tx.oncomplete=()=>resolve(true);tx.onerror=()=>resolve(false);tx.onabort=()=>resolve(false);
  }catch{resolve(false)}});
 }
 async function flush(){
  if(saving)return;saving=true;
  while(Object.keys(pending).length){
   const batch=pending;pending={};
   await Promise.all(Object.entries(batch).map(([subject,x])=>mirror(subject,x.progress,x.checkpoint)));
  }
  saving=false;
 }
 function queue(subject,progress,checkpoint){pending[subject]={progress:parse(safe(progress)),checkpoint:parse(safe(checkpoint))};void flush()}
 function save(subject,progress,checkpoint){
  if(!allowed(subject)||!valid(progress))return false;
  const p=safe(progress);if(p===null||!writeLocal(key(subject),p))return false;
  if(checkpoint!==undefined){
   if(checkpoint!==null&&!checkpointValid(checkpoint,subject))return false;
   if(!writeLocal(ck(subject),safe(checkpoint)))return false;
  }
  const raw=readLocal(subject);
  queue(subject,progress,parse(raw.checkpoint));
  return true;
 }
 function readCheckpoint(subject){
  if(!allowed(subject))return null;
  const raw=readLocal(subject);
  const c=parse(raw.checkpoint);return checkpointValid(c,subject)?c:null;
 }
 function clearCheckpoint(subject,progress){
  if(!allowed(subject)||!valid(progress))return false;
  if(!writeLocal(ck(subject),"null"))return false;
  queue(subject,progress,null);return true;
 }
 async function recover(subject){
  if(!allowed(subject))return {status:"blocked",reason:"invalid-subject"};
  const local=readLocal(subject),p=parse(local.progress),localValid=valid(p);
  if(local.error)return {status:"blocked",reason:"storage-unavailable"};
  const db=await openDB(),remote=await readDB(db,key(subject)),back=remote?.data;
  const backValid=valid(back);
  if(localValid){
   // Prefer the existing playable state. Never silently replace it with an independent snapshot.
   return {status:"local",progress:p,checkpoint:checkpointValid(parse(local.checkpoint),subject)?parse(local.checkpoint):null,
    divergent:backValid&&safe(p)!==safe(back)};
  }
  if(local.progress!==null&&!backValid)return {status:"blocked",reason:"corrupt-primary-no-recovery"};
  if(!backValid)return local.progress===null?{status:"empty",progress:null}:{status:"blocked",reason:"corrupt-backup"};
  // Keep the original bytes before writing a recovered copy; a failed backup must block recovery.
  if(local.progress!==null&&!writeLocal(key(subject)+"-damaged-backup-v3",local.progress))
   return {status:"blocked",reason:"cannot-preserve-corrupt-copy"};
  const cpRaw=await readDB(db,ck(subject)),cp=cpRaw?.data;
  if(!writeLocal(key(subject),safe(back)))return {status:"blocked",reason:"restore-write-failed"};
  if(checkpointValid(cp,subject)&&!writeLocal(ck(subject),safe(cp)))
   return {status:"blocked",reason:"checkpoint-restore-failed"};
  return {status:"recovered",progress:back,checkpoint:checkpointValid(cp,subject)?cp:null};
 }
 window.LigaPartida={save,readCheckpoint,clearCheckpoint,openDB,recover,valid,checkpointValid};
})();