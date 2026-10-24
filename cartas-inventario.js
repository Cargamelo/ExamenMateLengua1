"use strict";
/* La Liga del Saber: inventario V1. Cada fase es una concesión única e inmutable.
   Se conservan intactos el catálogo V1, las partidas y los poderes (inactivos). */
(function(){
 const PREFIX="ligasaber-carta-v1-",PROGRESS="ligasaber-2026-";
 const TABLE=Object.freeze({
  math:Object.freeze(["C007","C001","C002","C008","C005","C009","C003","C010","C004","C011","C006","C020","C021","C023","C024"]),
  lang:Object.freeze(["C012","C013","C014","C015","C016","C018","C005","C002","C017","C003","C020","C022","C018","C019","C024"])
 });
 const catalog=Array.isArray(window.LigaCartasCatalogo)?window.LigaCartasCatalogo:[];
 const byCard=new Map(catalog.map(c=>[c.id,c]));
 const rows=Object.freeze(Object.keys(TABLE).flatMap(subject=>TABLE[subject].map((cardId,i)=>Object.freeze({
  stageId:subject+"-stage-"+String(i+1).padStart(2,"0"),subject,number:i+1,cardId,card:byCard.get(cardId)||null
 }))));
 const byStage=new Map(rows.map(row=>[row.stageId,row]));
 function get(key){try{return localStorage.getItem(key)}catch{return null}}
 function set(key,value){try{localStorage.setItem(key,value);return true}catch{return false}}
 function completed(subject){
  try{
   const data=JSON.parse(get(PROGRESS+subject)||"null");
   return data&&data.stageJourney&&data.stageJourney.completed&&typeof data.stageJourney.completed==="object"?
    data.stageJourney.completed:{};
  }catch{return {}}
 }
 function validGrant(row,value){
  if(!value)return false;
  try{const grant=JSON.parse(value);return grant.version===1&&grant.stageId===row.stageId&&grant.cardId===row.cardId}
  catch{return false}
 }
 function record(row){return {version:1,stageId:row.stageId,cardId:row.cardId,awardedAt:Date.now()}}
 function notify(){try{window.dispatchEvent(new Event("liga-cartas-actualizadas"))}catch{}}
 function backing(entries){
  if(!entries.length||!window.LigaPartida?.openDB)return Promise.resolve(false);
  return window.LigaPartida.openDB().then(db=>new Promise(resolve=>{
   if(!db){resolve(false);return}
   try{
    const tx=db.transaction("snapshots","readwrite"),store=tx.objectStore("snapshots");
    for(const entry of entries)store.put(entry,PREFIX+entry.stageId);
    tx.oncomplete=()=>resolve(true);tx.onerror=()=>resolve(false);tx.onabort=()=>resolve(false);
   }catch{resolve(false)}
  })).catch(()=>false);
 }
 function inventory(){
  const states=new Map(),byId={},bySubject={math:completed("math"),lang:completed("lang")};
  const toMirror=[];let warnings=0;
  for(const row of rows){
   const exists=validGrant(row,get(PREFIX+row.stageId));
   const fromProgress=!!bySubject[row.subject][row.stageId];
   if(!exists&&fromProgress){
    const entry=record(row);
    if(set(PREFIX+row.stageId,JSON.stringify(entry)))toMirror.push(entry);
    else warnings++;
   }
   const owned=exists||fromProgress;
   if(owned){states.set(row.stageId,row.cardId);byId[row.cardId]=(byId[row.cardId]||0)+1}
  }
  if(toMirror.length){void backing(toMirror);notify()}
  return {version:1,byId,grants:rows.filter(r=>states.has(r.stageId)).map(r=>({
   stageId:r.stageId,subject:r.subject,cardId:r.cardId
  })),unique:Object.keys(byId).length,rewarded:states.size,duplicates:states.size-Object.keys(byId).length,
  totalCards:catalog.length,totalStages:rows.length,writeWarnings:warnings};
 }
 function award(subject,stageId){
  const row=byStage.get(stageId);
  if(!row||row.subject!==subject||!row.card)return {saved:false,reason:"invalid-stage"};
  const progress=completed(subject);
  const existed=validGrant(row,get(PREFIX+row.stageId));
  // El HTML no concede cartas: se exige el progreso ya confirmado en almacenamiento.
  if(!existed&&!progress[stageId])return {saved:false,reason:"stage-not-persisted"};
  const state=inventory(),copies=state.byId[row.cardId]||0;
  return {saved:!!state.grants.find(g=>g.stageId===stageId),card:row.card,stageId,
   cardId:row.cardId,copies,duplicate:copies>1,alreadyGranted:existed};
 }
 async function recover(){
  if(!window.LigaPartida?.openDB)return 0;
  const db=await window.LigaPartida.openDB().catch(()=>null);
  if(!db)return 0;
  const found=await new Promise(resolve=>{
   const matches=[];
   try{
    const tx=db.transaction("snapshots","readonly"),store=tx.objectStore("snapshots");
    for(const row of rows){
     const req=store.get(PREFIX+row.stageId);
     req.onsuccess=()=>{const value=req.result;
      if(value&&value.version===1&&value.stageId===row.stageId&&value.cardId===row.cardId)matches.push({row,value});
     };
    }
    tx.oncomplete=()=>resolve(matches);tx.onabort=()=>resolve([]);tx.onerror=()=>resolve([]);
   }catch{resolve([])}
  });
  let recovered=0;
  for(const {row,value} of found){
   if(!validGrant(row,get(PREFIX+row.stageId))&&set(PREFIX+row.stageId,JSON.stringify(value)))recovered++;
  }
  if(recovered)notify();
  inventory();
  return recovered;
 }
 function getAssignment(stageId){return byStage.get(stageId)||null}
 function validate(){
  const ids=new Set(rows.map(x=>x.cardId));
  const missing=rows.filter(x=>!x.card).map(x=>x.stageId);
  const wrongSubject=rows.filter(x=>x.card&&x.card.asignatura!=="universal"&&x.card.asignatura!==(x.subject==="math"?"matematicas":"lengua")).map(x=>x.stageId);
  return {ok:rows.length===30&&catalog.length===24&&ids.size===24&&!missing.length&&!wrongSubject.length&&rows.every(x=>!window.AventuraFases||!!window.AventuraFases.getStage(x.subject,x.stageId)),
   rows:rows.length,unique:ids.size,duplicates:rows.length-ids.size,missing,wrongSubject};
 }
 window.LigaCartas={inventory,award,recover,getAssignment,assignments:rows,validate};
 // La migración histórica no modifica ni elimina datos educativos.
 inventory();
 void recover();
})();
