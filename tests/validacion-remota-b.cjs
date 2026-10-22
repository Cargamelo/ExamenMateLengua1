"use strict";
const assert=require("node:assert/strict");
(async()=>{
 const {safeProgress}=await import("../supabase/functions/partidas/validate-progress.mjs");
 const empty=()=>({history:[],misses:[],badges:[]});
 const base={math:{progress:empty(),checkpoint:null},lang:{progress:null,checkpoint:null}};
 assert.equal(safeProgress(base).math.progress.history.length,0);
 const malformed=[
  {math:{progress:{history:"corrupt"},checkpoint:null},lang:base.lang},
  {math:{progress:{...empty(),stageJourney:{version:2,completed:{}}},checkpoint:null},lang:base.lang},
  {math:{progress:{...empty(),adaptive:{version:2,rewards:{coins:-1,completed:0},topics:{}}},checkpoint:null},lang:base.lang},
  {math:{progress:{...empty(),stageJourney:{version:1,active:"math-stage-17",completed:{},finalAwarded:false}},checkpoint:null},lang:base.lang},
  {math:{progress:{...empty(),stageJourney:{version:1,active:"math-stage-01",completed:{"lang-stage-01":{plays:1}},finalAwarded:false}},checkpoint:null},lang:base.lang},
  {math:{progress:empty(),checkpoint:{version:2,subject:"math",stageId:"math-stage-01",questionIndex:0,answered:null,session:{stageId:"math-stage-01",target:15,items:[],results:[]}}},lang:base.lang}
 ];
 for(const item of malformed)assert.throws(()=>safeProgress(item));
 assert.throws(()=>safeProgress({math:base.math}));
 assert.throws(()=>safeProgress({math:{progress:{...empty(),history:Array(6001).fill({topic:"numeros",ok:true})},checkpoint:null},lang:base.lang}));
 const ok={...empty(),stageJourney:{version:1,active:"math-stage-02",completed:{"math-stage-01":{best:4,plays:1,lastScore:4,lastTotal:15}},finalAwarded:false},
   adaptive:{version:2,rewards:{coins:50,completed:2},topics:{numeros:{step:0,answers:[],needs:[],concepts:{}}}}};
 assert.equal(safeProgress({math:{progress:ok,checkpoint:null},lang:base.lang}).math.progress.adaptive.rewards.coins,50);
 console.log("OK: JSON remoto legítimo, formatos antiguos, 8 casos inválidos y límites de estructura.");
})().catch(e=>{console.error(e.stack);process.exitCode=1});