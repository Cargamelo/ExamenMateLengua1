"use strict";
const fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const c={window:{}};vm.runInNewContext(fs.readFileSync("actividades-variadas.js","utf8"),c);
const questions=c.window.LigaVariedad.questions,seen=new Map(),unexpected=[];
const root=process.argv[2]||"qa-variedad";
const files=fs.existsSync(root)?fs.readdirSync(root).filter(x=>/^grupo-\\d+\\.json$/.test(x)):[];
for(const file of files){
 const data=JSON.parse(fs.readFileSync(path.join(root,file),"utf8"));
 for(const row of data.records||[]){
  const key=row.id+"|"+row.scenario;
  if(!questions.some(q=>q.id===row.id)||!["correct","incorrect"].includes(row.scenario))unexpected.push(row);
  if(seen.has(key))throw Error("Escenario duplicado: "+key);
  seen.set(key,row);
 }
}
const matrix=questions.map(q=>{
 const correct=seen.get(q.id+"|correct"),incorrect=seen.get(q.id+"|incorrect");
 return {id:q.id,subject:q.subject,topic:q.topic,type:q.type,source:q.source,
  minStep:q.minStep,prompt:q.prompt,correct:q.correct,
  correctScenario:correct||"NO EJECUTADA",incorrectScenario:incorrect||"NO EJECUTADA",
  status:correct?.status==="VALIDADA"&&incorrect?.status==="VALIDADA"?"VALIDADA":
   correct?.status==="FALLIDA"||incorrect?.status==="FALLIDA"?"FALLIDA":"NO EJECUTADA"};
});
const summary={total:matrix.length,validated:matrix.filter(x=>x.status==="VALIDADA").length,
 failed:matrix.filter(x=>x.status==="FALLIDA").length,
 notExecuted:matrix.filter(x=>x.status==="NO EJECUTADA").length,
 browserScenarios:seen.size,shards:files.length,unexpected:unexpected.length};
fs.mkdirSync(root,{recursive:true});
fs.writeFileSync(path.join(root,"matriz-final.json"),JSON.stringify({summary,matrix},null,2));
console.log("VARIETY CERTIFICATION "+JSON.stringify(summary));
matrix.filter(x=>x.status!=="VALIDADA").forEach(x=>console.error("PENDIENTE "+x.id+" "+x.status));
if(summary.total!==61||summary.validated!==61||summary.browserScenarios!==122||summary.shards!==8||summary.unexpected)process.exitCode=1;
