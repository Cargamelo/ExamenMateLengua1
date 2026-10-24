"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const env={window:{},Math};vm.runInNewContext(fs.readFileSync("preguntas-drive.js","utf8"),env);
const data=env.window.LigaBancoDrive;
const all=data.questions;
assert.equal(all.length,124);
assert.equal(all.filter(q=>q.subject==="math").length,82);
assert.equal(all.filter(q=>q.subject==="lang").length,42);
assert.equal(new Set(all.map(x=>x.id)).size,all.length);
const validTopics={math:new Set(["numeros","descomponer","comparar","ordinales","operaciones"]),lang:new Set(["sinonimos","antonimos","comunicacion"])};
const ordinal=["noveno","décimo","undécimo","duodécimo","decimotercero","decimocuarto","decimoquinto","decimosexto","decimoséptimo","decimoctavo","decimonoveno","vigésimo"];
const fmt=n=>Number(n).toLocaleString("es-ES");
for(const q of all){
 assert.ok(validTopics[q.subject]?.has(q.topic),q.id+" invalid concept");
 assert.match(q.id,/^DRIVE-(MATH|LANG)-/);
 assert.equal(q.variant,"drive");
 assert.ok(q.source&&q.explanation&&q.hint1&&q.hint2);
 assert.ok(q.choices?.includes(q.correct),q.id+" missing right answer");
 assert.equal(new Set(q.choices).size,q.choices.length,q.id+" choices collide");
 const m=q.check||{};
 const num=Number(String(q.correct).replace(/[.\s]/g,""));
 switch(m.kind){
  case "number":assert.equal(num,m.value);break;
  case "prev":assert.equal(num,m.value-1);break;
  case "next":assert.equal(num,m.value+1);break;
  case "digit":assert.equal(num,Math.floor(m.value/m.place)%10);break;
  case "decomposition":{
   const digits=[1000,100,10,1].map(p=>Math.floor(m.value/p)%10*p).filter(Boolean).map(fmt).join(" + ");
   assert.equal(q.correct,digits);break;
  }
  case "compare":assert.equal(q.correct,m.a>m.b?">":m.a<m.b?"<":"=");break;
  case "sort":assert.equal(q.correct,[...m.values].sort((a,b)=>a-b).map(fmt).join(" → "));break;
  case "round":assert.equal(num,Math.round(m.value/m.place)*m.place);break;
  case "ordinal":assert.equal(q.correct,ordinal[m.value-9]);break;
  case "add":assert.equal(num,m.a+m.b);assert.match(q.visual,/\+/);break;
  case "subtract":assert.equal(num,m.a-m.b);assert.match(q.visual,/−/);break;
  case "lexical":assert.equal(q.correct,m.to);break;
  case "communication":assert.ok(q.correct.length>1);break;
  default:throw Error("Unhandled validation "+q.id+" "+m.kind);
 }
}
assert.equal(data.reading.qa.length,6);
assert.equal(new Set(data.reading.qa.map(q=>q[0])).size,6);
assert.ok(data.reading.qa.every(q=>q.length===2&&q[0]&&q[1]));
const d={readings:[{title:"Existing"}]};
assert.equal(data.installReading(d),true);
assert.equal(data.installReading(d),true);
assert.equal(d.readings.length,2,"Must not duplicate reading on reinit");
const s={window:{}};vm.runInNewContext(fs.readFileSync("fases.js","utf8"),s);
assert.equal(s.window.AventuraFases.getStages("math").length,15);
assert.equal(s.window.AventuraFases.getStages("lang").length,15);
const c={window:{}};vm.runInNewContext(fs.readFileSync("datos-cartas.js","utf8"),c);
assert.equal((fs.readFileSync("datos/cartas-v1.json","utf8").match(/"id"\s*:\s*"C0/g)||[]).length,24);
for(const subject of ["math","lang"]){
 for(const stage of s.window.AventuraFases.getStages(subject)){
  for(const topic of stage.topics)if(validTopics[subject].has(topic)&&!["puntuacion","comprension","dictado","expresiva"].includes(topic)){
   const q=data.pick(topic,{stage:stage.number});
   if(q){assert.equal(q.topic,topic);assert.equal(q.subject,subject)}
  }
 }
}
console.log("OK: 124 distinct source-linked questions and 6 original comprehension answers; arithmetic, digits, sorting, rounding, ordinal names, stages, reusable reading.");
