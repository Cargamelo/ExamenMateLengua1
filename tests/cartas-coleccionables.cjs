"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const cardsCode=fs.readFileSync("datos-cartas.js","utf8");
const phasesCode=fs.readFileSync("fases.js","utf8");
const inventoryCode=fs.readFileSync("cartas-inventario.js","utf8");
function storage(seed=new Map(),options={}){
 let writes=0;
 return {
  getItem:key=>seed.has(key)?seed.get(key):null,
  setItem(key,value){if(options.fail?.(key))throw Error("Storage unavailable");writes++;seed.set(key,String(value))},
  removeItem:key=>seed.delete(key),
  data:seed,
  get writes(){return writes}
 };
}
function tab(localStorage){
 const window={dispatchEvent(){},addEventListener(){}};
 const ctx=vm.createContext({window,localStorage,console,Date,Promise,Event:class Event{constructor(type){this.type=type}}});
 for(const code of [cardsCode,phasesCode,inventoryCode])vm.runInContext(code,ctx);
 return window;
}
function setProgress(ls,type,ids){
 ls.setItem("ligasaber-2026-"+type,JSON.stringify({history:[],misses:[],badges:[],
  stageJourney:{version:1,active:type+"-stage-15",completed:Object.fromEntries(ids.map(id=>[id,{plays:1,best:4}])),finalAwarded:false}}));
}
const ls=storage(),game=tab(ls),lib=game.LigaCartas,rows=lib.assignments;
assert.equal(lib.validate().ok,true);
assert.equal(rows.length,30);
assert.equal(new Set(rows.map(x=>x.cardId)).size,24);
assert.equal(lib.inventory().rewarded,0);
assert.equal(lib.award("math","lang-stage-01").saved,false);
assert.equal(lib.award("math","math-stage-01").saved,false);
for(const type of ["math","lang"]){
 const ids=[];
 for(const row of rows.filter(x=>x.subject===type)){
  ids.push(row.stageId);setProgress(ls,type,ids);
  const earned=lib.award(type,row.stageId);
  assert.equal(earned.saved,true,"no se concede: "+row.stageId);
  assert.equal(earned.cardId,row.cardId,"carta incorrecta: "+row.stageId);
  const oldCount=lib.inventory().rewarded;
  assert.equal(lib.award(type,row.stageId).saved,true);
  assert.equal(lib.inventory().rewarded,oldCount,"repetir fase suma carta "+row.stageId);
 }
}
let state=lib.inventory();
assert.equal(state.unique,24);assert.equal(state.rewarded,30);assert.equal(state.duplicates,6);
assert.equal(Object.values(state.byId).reduce((s,n)=>s+n,0),30);
const writes=ls.writes;for(let i=0;i<5;i++)lib.inventory();
assert.equal(ls.writes,writes,"reconciliación idempotente sin escrituras redundantes");
// Todas las recompensas persisten entre pestañas y recargas.
const second=tab(ls).LigaCartas.inventory();
assert.equal(second.unique,24);assert.equal(second.rewarded,30);
// Reiniciar progreso educativo no debe eliminar cartas ya entregadas.
setProgress(ls,"math",[]);setProgress(ls,"lang",[]);
assert.equal(tab(ls).LigaCartas.inventory().rewarded,30);
// Corrupción aislada de una entrada: el progreso histórico sigue reconstruyendo la carta.
const corrupt=storage();
setProgress(corrupt,"lang",["lang-stage-01","lang-stage-02"]);
corrupt.setItem("ligasaber-carta-v1-lang-stage-01","{corrupt");
const migrate=tab(corrupt).LigaCartas;
assert.equal(migrate.inventory().rewarded,2);
assert.equal(migrate.inventory().unique,2);
const before=corrupt.writes;for(let i=0;i<3;i++)migrate.inventory();
assert.equal(corrupt.writes,before,"migración no idempotente");
// Partidas completas previas a la funcionalidad: 24 únicas y seis copias.
const historic=storage();
for(const type of ["math","lang"])setProgress(historic,type,rows.filter(x=>x.subject===type).map(x=>x.stageId));
const old=tab(historic).LigaCartas.inventory();
assert.equal(old.rewarded,30);assert.equal(old.unique,24);assert.equal(old.duplicates,6);
// Dos pestañas con el mismo almacenamiento, una por asignatura.
const twin=storage(),a=tab(twin).LigaCartas,b=tab(twin).LigaCartas;
setProgress(twin,"math",["math-stage-01"]);
assert.equal(a.award("math","math-stage-01").saved,true);
setProgress(twin,"lang",["lang-stage-01"]);
assert.equal(b.award("lang","lang-stage-01").saved,true);
assert.equal(a.inventory().rewarded,2);assert.equal(b.inventory().rewarded,2);
// Escritura de concesión fallida: la fase persistida sigue siendo fuente recuperable.
const fail=storage(new Map(),{fail:key=>key.startsWith("ligasaber-carta-v1-")});
setProgress(fail,"math",["math-stage-01"]);
const degraded=tab(fail).LigaCartas;
assert.equal(degraded.inventory().rewarded,1);
assert.equal(degraded.inventory().writeWarnings,1);
assert.equal(degraded.award("math","math-stage-01").saved,true);
// Un fallo de guardado de fase no se puede convertir en falsa carta.
const empty=storage(new Map(),{fail:key=>key.startsWith("ligasaber-2026-")});
assert.throws(()=>setProgress(empty,"math",["math-stage-01"]));
assert.equal(tab(empty).LigaCartas.award("math","math-stage-01").saved,false);
// Seguridad de compatibilidad: ninguna carta cruza exclusividad de asignatura.
for(const row of rows){
 assert.ok(row.card);
 assert.ok(row.card.asignatura==="universal"||row.card.asignatura===(row.subject==="math"?"matematicas":"lengua"));
 assert.ok(game.AventuraFases.getStage(row.subject,row.stageId));
}
console.log("OK: 30 recompensas, 24 cartas, 6 copias, migración, persistencia, corrupción, fallos y dos pestañas");
