"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const mock=Object.create(Math);let tick=0;mock.random=()=>((tick++)%997)/997;
const window={};vm.runInNewContext(fs.readFileSync("preguntas-drive.js","utf8"),{window,Math:mock});
const bank=window.LigaBancoDrive,items=bank.questions,seen=new Set();
assert.equal(items.length,124);
const stages={
 numeros:1,descomponer:4,comparar:6,ordinales:8,operaciones:12,
 sinonimos:1,antonimos:2,comunicacion:11
};
for(const topic of new Set(items.map(x=>x.topic))){
 const pool=items.filter(q=>q.topic===topic),stage=stages[topic];
 assert.ok(stage,"No reachable stage "+topic);
 for(let step=0;step<=5;step++){
  const required=pool.filter(q=>q.minStep<=step),visited=new Set();
  for(let i=0;i<997;i++){
   const q=bank.pick(topic,{stage,step,requiredSign:null});
   if(q){
    assert.equal(q.topic,topic);assert.ok(q.minStep<=step);
    assert.ok(q.choices.includes(q.correct));
    visited.add(q.id);seen.add(q.id);
   }
  }
  for(const q of required)assert.ok(visited.has(q.id),"Legitimate pick cannot reach "+q.id+" at step "+step);
 }
}
assert.equal(seen.size,124,"Some ID never returned by the unmodified bank selector");
assert.equal(bank.pick("comunicacion",{stage:5,step:5}),null,"Stage 5 has a constrained communication mechanism");
assert.equal(bank.pick("descomponer",{stage:5,step:5}),null,"Stage 5 has a constrained zero mechanism");
assert.equal(bank.pick("operaciones",{stage:10,step:5,requiredSign:"+"}),null,"Stage 10 requires a specific sign");
console.log("REACHABILITY 124/124 IDs selectable by original pick() on legitimate phases at their minimum adaptive steps.");
