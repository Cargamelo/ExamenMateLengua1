"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const ctx={window:{}};vm.runInNewContext(fs.readFileSync("lengua-temario.js","utf8"),ctx);
const bank=ctx.window.LigaTemarioLengua.questions,dir="qa-temario",found=new Map();
const files=fs.readdirSync(dir).filter(x=>/^grupo-\d+\.json$/.test(x));
assert.equal(files.length,12,"Falta un grupo de resultados");
for(const f of files){const data=JSON.parse(fs.readFileSync(path.join(dir,f),"utf8"));
 for(const row of data.results){
  const id=row.id+":"+row.scenario;
  assert.ok(!found.has(id),"Escenario duplicado "+id);
  found.set(id,row);
 }}
const matrix=bank.map(q=>{const a=found.get(q.id+":correct"),b=found.get(q.id+":incorrect");
 return {id:q.id,topic:q.topic,type:q.type,phases:q.phases,source:q.source,
  correct:a||{status:"NO EJECUTADA"},incorrect:b||{status:"NO EJECUTADA"},
  certified:a?.status==="VALIDADA"&&b?.status==="VALIDADA"};
});
const report={total:bank.length,passed:matrix.filter(x=>x.certified).length,
 fail:matrix.filter(x=>!x.certified).map(x=>({id:x.id,correct:x.correct.status,incorrect:x.incorrect.status})),
 scenarios:found.size,shards:files.length};
fs.writeFileSync(path.join(dir,"matriz-final.json"),JSON.stringify({report,matrix},null,2));
console.log("TEMARIO CERTIFICATION "+JSON.stringify(report));
assert.equal(report.total,157);assert.equal(report.passed,157);assert.equal(report.scenarios,314);
