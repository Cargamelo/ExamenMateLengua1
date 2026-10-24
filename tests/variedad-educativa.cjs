"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const context={window:{}};for(const p of ["preguntas-drive.js","actividades-variadas.js","minijuegos.js"])vm.runInNewContext(fs.readFileSync(p,"utf8"),context);
const drive=context.window.LigaBancoDrive.questions,all=context.window.LigaVariedad.questions,mini=context.window.AventuraMini;
assert.equal(drive.length,124,"Old bank must remain unchanged");
assert.equal(all.length,61,"Expected 61 new original challenges");
assert.equal(new Set([...drive,...all].map(q=>q.id)).size,185);
const counts={},topicCount={},checks={};
for(const q of all){
 counts[q.type]=(counts[q.type]||0)+1;topicCount[q.subject+"/"+q.topic]=(topicCount[q.subject+"/"+q.topic]||0)+1;
 assert.ok(q.source&&q.hint1&&q.hint2&&q.explanation,q.id);
 assert.ok(Number.isInteger(q.minStep)&&q.minStep>=0&&q.minStep<=5,q.id);
 const enriched=mini.enrich(q,{},q.minStep),s=mini.begin(),m=enriched.mechanic;
 if(q.type==="text"){assert.equal(enriched.choices,null);assert.equal(m,null);continue;}
 assert.ok(m,q.id+" not interactive");
 const html=mini.render(enriched,s);
 assert.ok(html.includes("quest-scene"),q.id+" not rendered");
 let result;
 if(q.type==="fill"){
  result=mini.act(enriched,s,"submit-fields",JSON.stringify(q.answers));
  assert.equal(result.ok,true,q.id);const wrong=[...q.answers];wrong[0]="Respuesta incorrecta";
  assert.equal(mini.act(enriched,mini.begin(),"submit-fields",JSON.stringify(wrong)).ok,false,q.id);
  assert.equal(mini.act(enriched,mini.begin(),"submit-fields",JSON.stringify([""])).done,undefined);
 }else if(q.type==="classification"){
  q.items.forEach(([word,g],i)=>mini.act(enriched,s,"classify",i+":"+m.groups.indexOf(g)));
  result=mini.act(enriched,s,"verify-classification","");
  assert.equal(result.ok,true,q.id);
  const bad=mini.begin();
  q.items.forEach(([word,g],i)=>mini.act(enriched,bad,"classify",i+":"+(i===0?1-m.groups.indexOf(g):m.groups.indexOf(g))));
  assert.equal(mini.act(enriched,bad,"verify-classification","").ok,false,q.id);
 }else if(q.type==="guided"){
  const valid="La "+q.words.join(" y ")+" juega en el jardín.";
  result=mini.act(enriched,s,"verify-writing",valid);assert.equal(result.ok,true,q.id);
  assert.equal(mini.act(enriched,mini.begin(),"verify-writing","Una oración incompleta.").ok,false,q.id);
 }else if(q.type==="choice"){
  result=mini.act(enriched,s,"choose",String(q.choices.indexOf(q.correct)));
  assert.equal(result.ok,true,q.id);
  assert.equal(mini.act(enriched,mini.begin(),"choose",String(1-q.choices.indexOf(q.correct))).ok,false,q.id);
 }else if(q.type==="ordering"){
  for(const value of m.correct)result=mini.act(enriched,s,"pick",String(m.values.indexOf(value)));
  assert.equal(result.ok,true,q.id);
  const bad=mini.begin();for(const value of [...m.correct].reverse())result=mini.act(enriched,bad,"pick",String(m.values.indexOf(value)));
  assert.equal(result.ok,false,q.id);
 }else if(q.type==="matching"){
  for(let i=0;i<m.pairs.length;i++){mini.act(enriched,s,"left",String(i));result=mini.act(enriched,s,"right",String(m.right.indexOf(m.pairs[i][1])));}
  assert.equal(result.ok,true,q.id);
 }else throw Error("Unhandled type "+q.type);
 assert.ok(result.done,q.id);
 checks[q.id]=true;
}
const stages={math:{numeros:1,descomponer:4,comparar:6,ordinales:8,operaciones:12},lang:{sinonimos:1,antonimos:2,comunicacion:11}};
for(const q of all){
 const stage=stages[q.subject][q.topic],sign=q.requiredSign||null;
 assert.ok(context.window.LigaVariedad.questions.some(x=>x.id===q.id&&x.minStep<=q.minStep),"Unreachable question "+q.id);
 if(q.topic==="descomponer")assert.equal(context.window.LigaVariedad.pick(q.topic,{stage:5,step:5}),null);
 if(q.topic==="comunicacion")assert.equal(context.window.LigaVariedad.pick(q.topic,{stage:5,step:5}),null);
 assert.ok(stage);
}
console.log("VARIETY CONTENT "+JSON.stringify({total:all.length,math:all.filter(q=>q.subject==="math").length,lang:all.filter(q=>q.subject==="lang").length,types:counts,topics:topicCount,mechanicsVerified:Object.keys(checks).length}));
