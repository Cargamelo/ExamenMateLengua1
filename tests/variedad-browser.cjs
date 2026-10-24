"use strict";
/* Cada nuevo reto se inyecta por ID SOLO desde Playwright, pero usa
   render, acciones, corrección y guardado reales del videojuego. */
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const {chromium}=require("playwright-core");
const chrome=["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"].find(fs.existsSync);
if(!chrome)throw Error("Chromium no disponible");
const ctx={window:{}};vm.runInNewContext(fs.readFileSync("actividades-variadas.js","utf8"),ctx);
const bank=ctx.window.LigaVariedad.questions;
const shard=Number(process.env.VAR_SHARD||0),shards=Number(process.env.VAR_SHARDS||8);
const selected=bank.filter((q,i)=>i%shards===shard);
const stageFor=q=>(q.subject==="math"?{numeros:1,descomponer:4,comparar:6,ordinales:8,operaciones:12}:{sinonimos:1,antonimos:2,comunicacion:11})[q.topic];
const outdir="qa-variedad";fs.mkdirSync(outdir,{recursive:true});
const records=[];
function init(q){
 const subject=q.subject,phase=q.phase,id=subject+"-stage-"+String(phase).padStart(2,"0"),completed={};
 for(let n=1;n<phase;n++)completed[subject+"-stage-"+String(n).padStart(2,"0")]={plays:1,best:1,lastScore:1,lastTotal:15};
 if(!localStorage.getItem("ligasaber-2026-"+subject))localStorage.setItem("ligasaber-2026-"+subject,
 JSON.stringify({history:[],misses:[],badges:[],lastDate:"",
  stageJourney:{version:1,active:id,completed,finalAwarded:false,previous:null},
  adaptive:{version:2,rewards:{coins:0,completed:0},topics:{[q.topic]:{step:q.minStep,
   answers:[],streak:0,wrong:0,sinceChange:0,concepts:{},needs:[],missions:0}}}}));
 Object.defineProperty(window,"LigaVariedad",{configurable:true,set(actual){
  const oldPick=actual.pick.bind(actual);
  Object.defineProperty(window,"LigaVariedad",{configurable:false,value:{...actual,
   pick(topic,options){if(topic!==q.topic)return oldPick(topic,options);
    if((options.step??0)<q.minStep)throw Error("Inaccessible level "+q.id);
    if(options.requiredSign&&options.requiredSign!==q.requiredSign)throw Error("Wrong sign "+q.id);
    window.__varietySelected=(window.__varietySelected||0)+1;
    return {...actual.questions.find(item=>item.id===q.id),fingerprint:q.id};
   }}});}});
}
async function start(page,q){
 await page.goto("http://127.0.0.1:8765/"+(q.subject==="math"?"matematicas-sda1.html":"lengua-sda1.html"),{waitUntil:"domcontentloaded"});
 await page.locator('[data-action="topics"]').first().click();
 await page.locator('[data-action="start-stage"][data-stage="'+q.subject+'-stage-'+String(q.phase).padStart(2,"0")+'"]').click();
 // Primer ejercicio clásico de la fase.
 if(await page.locator('[data-mini="digit"]').count()){
  const n=await page.locator(".quest-slot").count();
  for(let i=0;i<n;i++)await page.locator('[data-mini="digit"][data-value="0"]').first().click();
  await page.locator('[data-mini="submit"]').click();
 }else if(await page.locator('[data-mini="left"]').count()){
  const left=await page.locator('[data-mini="left"]').allTextContents(),right=await page.locator('[data-mini="right"]').allTextContents();
  const values=await page.evaluate(({words,topic})=>{
   const pairs=topic==="antonimos"?window.EDU_DATA.antonyms:window.EDU_DATA.synonyms;
   return words.map(x=>pairs.find(pair=>pair[0]===x.trim())?.[1]);
  },{words:left,topic:q.topic});
  for(let i=0;i<left.length;i++){
   const j=right.findIndex(x=>x.trim()===values[i]);assert.ok(j>=0);
   await page.locator('[data-mini="left"]').nth(i).click();await page.locator('[data-mini="right"]').nth(j).click();
  }
 }else if(await page.locator('[data-mini="pick"]').count()){
  const n=await page.locator('[data-mini="pick"]').count();
  for(let i=0;i<n;i++)await page.locator('[data-mini="pick"]').nth(i).click();
 }else if(await page.locator('[data-mini="choose"]').count())await page.locator('[data-mini="choose"]').first().click();
 else if(await page.locator('[data-action="choose"]').count())await page.locator('[data-action="choose"]').first().click();
 else if(await page.locator("#response").count()){await page.locator("#response").fill("0");await page.locator('[data-action="check"]').click();}
 else throw Error("First challenge unavailable");
 await page.locator('[data-action="next"]').click();
 // Segundo ejercicio del banco antiguo, que puede conservar un minijuego de cifras.
 if(await page.locator('[data-mini="digit"]').count()){
  const slots=await page.locator(".quest-slot").count();
  for(let i=0;i<slots;i++)await page.locator('[data-mini="digit"][data-value="0"]').first().click();
  await page.locator('[data-mini="submit"]').click();
 }else if(await page.locator('[data-mini="choose"],[data-action="choose"]').count()){
  await page.locator('[data-mini="choose"],[data-action="choose"]').first().click();
 }else if(await page.locator("#response").count()){
  await page.locator("#response").fill("0");await page.locator('[data-action="check"]').click();
 }else if(await page.locator('[data-mini="pick"]').count()){
  const n=await page.locator('[data-mini="pick"]').count();
  for(let i=0;i<n;i++)await page.locator('[data-mini="pick"]').nth(i).click();
 }else throw Error("Second legacy challenge unavailable");
 await page.locator('[data-action="next"]').click();
 assert.equal(await page.evaluate(()=>window.__varietySelected),1,"New bank not selected in real gameplay");
 assert.equal(await page.locator(".q-title").innerText(),q.prompt,q.id+" prompt changed");
}
async function answer(page,q,correct){
 const choose=page.locator('[data-mini="choose"],[data-action="choose"]');
 if(q.type==="text"){
  await page.locator("#response").fill(correct?q.correct:q.numeric?"999999":"respuesta equivocada");
  await page.locator('[data-action="check"]').click();
 }else if(q.type==="choice"){
  const texts=(await choose.allTextContents()).map(s=>s.trim());
  const ix=texts.indexOf(q.correct);
  await choose.nth(correct?ix:texts.findIndex((_,i)=>i!==ix)).click();
 }else if(q.type==="fill"){
  for(let i=0;i<q.answers.length;i++)
   await page.locator("[data-varied-input]").nth(i).fill(!correct&&i===0?"999999":q.answers[i]);
  await page.locator('[data-mini="submit-fields"]').click();
 }else if(q.type==="ordering"){
  const nums=correct?q.correct.split(" → "):[...q.correct.split(" → ")].reverse();
  const all=(await page.locator('[data-mini="pick"]').allTextContents()).map(x=>x.trim());
  for(const n of nums)await page.locator('[data-mini="pick"]').nth(all.indexOf(n)).click();
 }else if(q.type==="matching"){
  const left=(await page.locator('[data-mini="left"]').allTextContents()).map(x=>x.trim());
  const right=(await page.locator('[data-mini="right"]').allTextContents()).map(x=>x.trim());
  for(let i=0;i<left.length;i++){
   const expected=q.pairs.find(pair=>pair[0]===left[i])[1];
   await page.locator('[data-mini="left"]').nth(i).click();
   if(i===0&&!correct){const wrong=right.findIndex(v=>v!==expected);await page.locator('[data-mini="right"]').nth(wrong).click();
    await page.locator('[data-mini="left"]').nth(i).click();}
   await page.locator('[data-mini="right"]').nth(right.indexOf(expected)).click();
  }
 }else if(q.type==="classification"){
  for(let i=0;i<q.items.length;i++){
   const j=q.groups.indexOf(q.items[i][1]),chosen=correct||i!==0?j:1-j;
   await page.locator('[data-mini="classify"][data-value="'+i+':'+chosen+'"]').click();
  }
  await page.locator('[data-mini="verify-classification"]').click();
 }else if(q.type==="guided"){
  const text=correct?"La "+q.words.join(" y ")+" juega en el jardín.":"La niña juega en el jardín.";
  await page.locator("#varied-writing").fill(text);
  await page.locator('[data-mini="verify-writing"]').click();
 }else throw Error("Unknown type "+q.type);
 const feedback=page.locator(".feedback[role=status]");
 await feedback.waitFor({timeout:9000});
 assert.equal(await feedback.evaluate(x=>x.classList.contains("ok")),correct,q.id+" result");
 assert.ok((await feedback.innerText()).includes(q.explanation),q.id+" explanation not shown");
}
async function verify(browser,q,correct){
 const context=await browser.newContext({viewport:correct?{width:390,height:844}:{width:1366,height:768},
  hasTouch:correct,isMobile:correct});
 const page=await context.newPage();page.setDefaultTimeout(9000);
 const evidence={id:q.id,subject:q.subject,type:q.type,scenario:correct?"correct":"incorrect",status:"NO EJECUTADA"};
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 try{
  await page.addInitScript(init,{...q,phase:stageFor(q)});
  await start(page,{...q,phase:stageFor(q)});
  await page.locator('[data-action="hint"]').click();
  assert.ok((await page.locator(".help-text").innerText()).includes(q.hint1));
  // Primer checkpoint conserva el reto y su tipo.
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator('[data-action="resume-stage"]').click();
  assert.equal(await page.locator(".q-title").innerText(),q.prompt);
  const count=await page.evaluate(s=>JSON.parse(localStorage.getItem("ligasaber-2026-"+s)).history.length,q.subject);
  await answer(page,q,correct);
  const saved=await page.evaluate(s=>JSON.parse(localStorage.getItem("ligasaber-2026-"+s)),q.subject);
  assert.equal(saved.history.length,count+1);
  assert.equal(saved.history.at(-1).fingerprint,q.id);
  assert.equal(saved.history.at(-1).ok,correct);
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator('[data-action="resume-stage"]').click();
  assert.equal(await page.locator(".feedback").evaluate(x=>x.classList.contains("ok")),correct);
  const after=await page.evaluate(s=>JSON.parse(localStorage.getItem("ligasaber-2026-"+s)),q.subject);
  assert.equal(after.history.length,saved.history.length,"Duplicate after reload");
  await page.locator('[data-action="next"]').click();
  assert.ok(await page.locator(".q-title").count());
  assert.deepEqual(errors,[]);
  evidence.status="VALIDADA";
 }catch(e){evidence.status="FALLIDA";evidence.error=String(e.stack||e);
  try{await page.screenshot({path:outdir+"/"+q.id+"-"+evidence.scenario+".png",fullPage:true,timeout:3000})}catch{}}
 finally{await context.close();records.push(evidence);}
 console.log(q.id+" "+evidence.scenario+" "+evidence.status);
}
(async()=>{const browser=await chromium.launch({executablePath:chrome,headless:true,args:["--no-sandbox"]});
 try{for(const q of selected)for(const good of [true,false])await verify(browser,q,good);}
 finally{await browser.close();}
 fs.writeFileSync(outdir+"/grupo-"+shard+".json",JSON.stringify({shard,records},null,2));
 const failed=records.filter(x=>x.status!=="VALIDADA");
 console.log("VAR BROWSER "+JSON.stringify({shard,executed:records.length,failed:failed.length}));
 if(failed.length){for(const x of failed)console.error(x.id,x.error?.slice(0,500));process.exitCode=1;}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
