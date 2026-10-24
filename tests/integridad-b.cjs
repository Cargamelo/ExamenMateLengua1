"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
function load(path,env){vm.runInNewContext(fs.readFileSync(path,"utf8"),env);return env.window}
function store(initial={}){
 const rows=new Map(Object.entries(initial));let denied=false;
 return {rows,getItem:k=>{if(denied)throw Error("blocked");return rows.get(k)??null},
  setItem:(k,v)=>{if(denied)throw Error("QuotaExceededError");rows.set(k,v)},
  removeItem:k=>rows.delete(k),block:v=>{denied=v}};
}
function fakeDB(rows){
 const db={objectStoreNames:{contains:()=>true},transaction:()=>({
   objectStore:()=>({get:k=>{const request={};queueMicrotask(()=>{request.result=rows.get(k)||null;request.onsuccess?.()});return request},
    put:(value,k)=>rows.set(k,value)})
 })};
 return {open:()=>{const request={result:db};queueMicrotask(()=>request.onsuccess?.());return request}};
}
(async()=>{
 const ls=store(),win={};load("partida-local.js",{window:win,localStorage:ls,indexedDB:null,setTimeout,clearTimeout});
 const p={history:[],misses:[],badges:[],lastDate:""};
 assert.equal(win.LigaPartida.save("math",p),true);
 assert.equal((await win.LigaPartida.recover("math")).status,"local");
 const stage={version:2,subject:"math",stageId:"math-stage-01",questionIndex:0,answered:null,
  hintCount:0,response:"",session:{stageId:"math-stage-01",target:15,items:[],results:[]}};
 assert.equal(win.LigaPartida.checkpointValid(stage,"math"),false,"no empty question list");
 assert.equal(win.LigaPartida.save("math",p,stage),false,"bad checkpoint refused");
 ls.block(true);assert.equal(win.LigaPartida.save("math",p),false);ls.block(false);
 ls.rows.set("ligasaber-2026-math",JSON.stringify({...p,stageJourney:{version:999,completed:{}}}));
 assert.equal((await win.LigaPartida.recover("math")).status,"blocked");
 const corrupt=store({"ligasaber-2026-math":"{corrupt"});
 const dbrows=new Map([["ligasaber-2026-math",{version:2,data:{history:[{topic:"numeros",ok:true}],misses:[],badges:[]}}]]);
 const w2={indexedDB:fakeDB(dbrows)};
 load("partida-local.js",{window:w2,localStorage:corrupt,setTimeout,clearTimeout,queueMicrotask});
 const recovered=await w2.LigaPartida.recover("math");
 assert.equal(recovered.status,"recovered");
 assert.equal(recovered.progress.history.length,1);
 assert.equal(corrupt.rows.get("ligasaber-2026-math-damaged-backup-v3"),"{corrupt");
 const f=load("fases.js",{window:{},Date}).AventuraFases;
 const j=f.init({},"math");
 assert.equal(f.complete("math",j,"math-stage-01",Number.NaN,15),null);
 assert.equal(f.complete("math",j,"math-stage-01",16,15),null);
 assert.equal(f.complete("math",j,"math-stage-01",0,15).first,true);
 const a=load("adaptativo.js",{window:{},Date}).AventuraAdaptive;
 const broken={adaptive:{version:2,rewards:null,topics:{}}};
 assert.throws(()=>a.init(broken,["numeros"]));
 assert.equal(broken.adaptive.rewards,null);
 const ok=a.init({history:[]},["numeros"]);
 for(let n=0;n<6;n++)a.track(ok,{topic:"numeros",prompt:"test-"+n},true);
 assert.equal(ok.topics.numeros.step,1);
 assert.equal(ok.rewards.coins,9);
 console.log("OK: guardado local, rechazo de cuota, checkpoint inválido, versiones desconocidas, recuperación IDB, respaldo, fases y recompensas.");
})().catch(e=>{console.error(e.stack);process.exitCode=1});