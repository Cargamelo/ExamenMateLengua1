"use strict";
const assert=require("node:assert/strict"),fs=require("fs"),vm=require("vm");
const c={window:{}};for(const f of ["lengua-temario.js","minijuegos.js","preguntas-drive.js","actividades-variadas.js"])vm.runInNewContext(fs.readFileSync(f,"utf8"),c);
const qs=c.window.LigaTemarioLengua.questions,mini=c.window.AventuraMini,counts={},types={};
assert.equal(qs.length,157);assert.equal(new Set(qs.map(q=>q.id)).size,157);
assert.ok(new Set(qs.map(q=>q.prompt)).size>=130,"La variedad de enunciados es insuficiente");
assert.equal(c.window.LigaBancoDrive.questions.length,124);
assert.equal(c.window.LigaVariedad.questions.length,61);
let verified=0;
for(const q of qs){
 counts[q.topic]=(counts[q.topic]||0)+1;types[q.type]=(types[q.type]||0)+1;
 assert.ok(q.source&&q.explanation&&q.hint1&&q.hint2&&q.concept&&q.phases?.length,q.id);
 assert.ok(q.minStep>=0&&q.minStep<=5,q.id);
 const x=mini.enrich(q,{},q.minStep),s=mini.begin(),m=x.mechanic;
 if(q.type==="text"){assert.equal(m,null);assert.equal(x.choices,null);assert.ok(q.accepted.includes(q.correct));continue;}
 assert.ok(m&&mini.render(x,s).includes("quest-scene"),q.id);
 let out;
 if(q.type==="choice"){
  out=mini.act(x,s,"choose",String(q.choices.indexOf(q.correct)));
  assert.equal(mini.act(x,mini.begin(),"choose",String(q.choices.findIndex(v=>v!==q.correct))).ok,false);
 }else if(q.type==="fill"){
  out=mini.act(x,s,"submit-fields",JSON.stringify(q.answers));
  const bad=mini.begin(),wrong=q.answers.map((v,i)=>i?v:"respuesta claramente incorrecta");
  const first=mini.act(x,bad,"submit-fields",JSON.stringify(wrong));
  assert.equal(first.ok,false,q.id);
  assert.equal(first.done,undefined,"Debe permitir corregir campos");
  assert.equal(mini.act(x,bad,"submit-fields",JSON.stringify(q.answers)).ok,true);
  if(q.acceptedFields){const variants=q.answers.map((v,i)=>q.acceptedFields[i]?.at(-1)||v);
   assert.equal(mini.act(x,mini.begin(),"submit-fields",JSON.stringify(variants)).ok,true);}
 }else if(q.type==="classification"){
  q.items.forEach(([v,g],i)=>mini.act(x,s,"classify",i+":"+q.groups.indexOf(g)));
  out=mini.act(x,s,"verify-classification","");
  const bad=mini.begin();
  q.items.forEach(([v,g],i)=>mini.act(x,bad,"classify",i+":"+(i===0?1-q.groups.indexOf(g):q.groups.indexOf(g))));
  assert.equal(mini.act(x,bad,"verify-classification","").ok,false);
 }else if(q.type==="matching"){
  for(let i=0;i<q.pairs.length;i++){
   mini.act(x,s,"left",String(i));out=mini.act(x,s,"right",String(m.right.indexOf(q.pairs[i][1])));
  }
  const bad=mini.begin();
  mini.act(x,bad,"left","0");
  mini.act(x,bad,"right",String(m.right.findIndex(v=>v!==q.pairs[0][1])));
  for(let i=0;i<q.pairs.length;i++){
   mini.act(x,bad,"left",String(i));
   var negative=mini.act(x,bad,"right",String(m.right.indexOf(q.pairs[i][1])));
  }
  assert.equal(negative.ok,false);
 }else if(q.type==="multi"){
  q.correctIndexes.forEach(i=>mini.act(x,s,"toggle-multi",String(i)));
  out=mini.act(x,s,"verify-multi","");
  const bad=mini.begin();
  mini.act(x,bad,"toggle-multi",String(q.options.findIndex((_,i)=>!q.correctIndexes.includes(i))));
  assert.equal(mini.act(x,bad,"verify-multi","").ok,false);
 }else if(q.type==="rewrite"){
  const text=q.original.replace(q.from,q.to);
  out=mini.act(x,s,"verify-rewrite",JSON.stringify({text,reviewed:true}));
  assert.equal(mini.act(x,mini.begin(),"verify-rewrite",JSON.stringify({text,reviewed:false})).ok,false);
  assert.equal(mini.act(x,mini.begin(),"verify-rewrite",JSON.stringify({text:q.original,reviewed:true})).ok,false);
 }else throw Error("Sin prueba para "+q.type);
 assert.equal(out?.done,true,q.id);assert.equal(out?.ok,true,"Se rechaza "+q.id);verified++;
}
for(const stage of [1,2,3,4,5,6,10,11,15]){
 const pool=qs.filter(q=>q.phases.includes(stage)&&q.minStep===0);
 assert.ok(pool.length>=15,"Fase insuficiente "+stage);
 if([5,6,10,11,15].includes(stage))assert.ok(new Set(pool.map(q=>q.type)).size>=3);
}
for(const topic of Object.keys(counts)){
 const stage={sinonimos:1,antonimos:2,comunicacion:11}[topic],seen=[];
 for(let i=0;i<15;i++){
  const q=c.window.LigaTemarioLengua.pick(topic,{stage,step:0,seen});
  assert.ok(q&&!seen.includes(q.id),"Sin candidato "+topic);
  seen.push(q.id);
 }
}
console.log("TEMARIO CHECK "+JSON.stringify({total:qs.length,topics:counts,types,interactiveVerified:verified,oldDrive:124,oldVariety:61}));
