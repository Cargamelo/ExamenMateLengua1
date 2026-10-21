"use strict";
const assert=require("node:assert/strict");
const vm=require("node:vm");
const fs=require("node:fs");
const code=fs.readFileSync("fases.js","utf8");
const context={window:{},Date};vm.runInNewContext(code,context);
const S=context.window.AventuraFases;
for(const type of ["math","lang"]){
 const progress={},j=S.init(progress,type),all=S.getStages(type);
 assert.equal(all.length,15);
 assert.equal(S.canEnterStage(type,j,all[0].id),true);
 for(let i=1;i<15;i++)assert.equal(S.canEnterStage(type,j,all[i].id),false);
 assert.equal(S.activate(type,j,all[5].id),false);
 assert.equal(j.active,all[0].id);
 for(let i=0;i<15;i++){
  assert.equal(S.canEnterStage(type,j,all[i].id),true);
  const done=S.complete(type,j,all[i].id,4,15);
  assert.equal(done.first,true);
  assert.equal(j.completed[all[i].id].best,4);
  if(i<14){
   assert.equal(j.active,all[i+1].id);
   assert.equal(S.canEnterStage(type,j,all[i+1].id),true);
   if(i+2<15)assert.equal(S.canEnterStage(type,j,all[i+2].id),false);
  }
 }
 assert.equal(j.finalAwarded,true);
 assert.equal(S.complete(type,j,all[14].id,15,15).justAwarded,false);
 assert.equal(S.completedCount(type,j),15);
 const legacy={stageJourney:{version:1,active:all[14].id,completed:{[all[0].id]:{best:5},[all[3].id]:{best:9}},finalAwarded:false,previous:null}};
 const migrated=S.init(legacy,type);
 assert.equal(migrated.active,all[1].id);
 assert.equal(!!migrated.completed[all[3].id],true,"Do not erase historical completed stages");
 assert.equal(S.canEnterStage(type,migrated,all[3].id),false);
 assert.equal(S.canEnterStage(type,migrated,all[1].id),true);
 S.complete(type,migrated,all[1].id,3,15);
 assert.equal(migrated.active,all[2].id);
 S.complete(type,migrated,all[2].id,5,15);
 assert.equal(migrated.active,all[4].id,"Skip pre-existing completed stage, do not unlock above first hole");
}
console.log("OK: 2 worlds x 15 phases, locked paths, replay, historic gaps, completion award.");