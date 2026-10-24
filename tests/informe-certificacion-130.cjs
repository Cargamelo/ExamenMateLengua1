"use strict";
const fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const env={window:{}};vm.runInNewContext(fs.readFileSync("preguntas-drive.js","utf8"),env);
const source=env.window.LigaBancoDrive;
const expected=[...source.questions.map(q=>({...q,stage:{math:{numeros:1,descomponer:4,comparar:6,ordinales:8,operaciones:12},lang:{sinonimos:1,antonimos:2,comunicacion:11}}[q.subject]?.[q.topic]})),
 ...source.reading.qa.map(([prompt,correct],i)=>({id:"DRIVE-LANG-LECTURA-"+String(i+1).padStart(2,"0"),subject:"lang",topic:"comprension",source:source.reading.source,stage:9,minStep:0,prompt,correct,choices:null,explanation:"Según la lectura, "+correct,hint1:"Busca la parte relacionada del texto",hint2:null}))];
if(expected.length!==130||new Set(expected.map(x=>x.id)).size!==130)throw Error("Bank inventory not exactly 130");
const root=process.argv[2]||"qa-certificacion";const files=[];
function walk(dir){if(!fs.existsSync(dir))return;for(const x of fs.readdirSync(dir)){const f=path.join(dir,x),stat=fs.statSync(f);if(stat.isDirectory())walk(f);else if(/^certificacion-shard-\d+\.json$/.test(x))files.push(f)}}
walk(root);
const checks=new Map(),invalid=[];
for(const f of files){
 const data=JSON.parse(fs.readFileSync(f,"utf8"));
 for(const row of data.records||[]){
  if(!expected.some(x=>x.id===row.id)){invalid.push(row);continue;}
  const key=row.id+"|"+row.scenario;
  if(checks.has(key))throw Error("Duplicate scenario "+key);
  checks.set(key,row);
 }
}
const matrix=expected.map(x=>{
 const correct=checks.get(x.id+"|correct"),incorrect=checks.get(x.id+"|incorrect");
 return {id:x.id,asignatura:x.subject,concepto:x.topic,origen:x.source,fase:x.stage,nivelMinimo:x.minStep,
  enunciado:x.prompt,respuesta:x.correct,alternativas:x.choices,
  pista1:x.hint1||null,pista2:x.hint2||null,explicacion:x.explanation,
  escenarios:{correcta:correct||"NO EJECUTADA",incorrecta:incorrect||"NO EJECUTADA"},
  estado:correct?.status==="VALIDADA"&&incorrect?.status==="VALIDADA"?"VALIDADA":
    (correct?.status==="FALLIDA"||incorrect?.status==="FALLIDA")?"FALLIDA":"NO EJECUTADA"};
});
const summary={total:130,valid:matrix.filter(x=>x.estado==="VALIDADA").length,
 failed:matrix.filter(x=>x.estado==="FALLIDA").length,notExecuted:matrix.filter(x=>x.estado==="NO EJECUTADA").length,
 browserScenarios:checks.size,shardFiles:files.length,unexpected:invalid.length};
fs.mkdirSync("qa-certificacion",{recursive:true});
fs.writeFileSync("qa-certificacion/matriz-130.json",JSON.stringify({summary,matrix},null,2));
fs.writeFileSync("qa-certificacion/resumen.txt",JSON.stringify(summary,null,2)+"\n");
console.log("CERT REPORT "+JSON.stringify(summary));
for(const x of matrix.filter(x=>x.estado!=="VALIDADA"))console.error(x.id+" "+x.estado);
if(summary.valid!==130||summary.browserScenarios!==260||summary.shardFiles!==8||summary.unexpected)process.exitCode=1;
