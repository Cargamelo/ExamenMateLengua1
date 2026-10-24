"use strict";
/* Cada caso abre el videojuego real. La única sustitución es la selección
   determinista de un ID permitido, inyectada en el navegador de TEST.
   El render, la corrección, las pistas y el guardado son los de producción. */
const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm");
const {chromium}=require("playwright-core");
const chrome=["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"].find(fs.existsSync);
if(!chrome)throw Error("Chromium no disponible");
const env={window:{}};vm.runInNewContext(fs.readFileSync("preguntas-drive.js","utf8"),env);
const questions=env.window.LigaBancoDrive.questions;
const reading=env.window.LigaBancoDrive.reading;
assert.equal(questions.length,124);
assert.equal(reading.qa.length,6);
const shard=Number(process.env.CERT_SHARD||0),totalShards=Number(process.env.CERT_SHARDS||8);
if(!Number.isInteger(shard)||shard<0||shard>=totalShards)throw Error("Invalid shard");
const selected=questions.filter((_,i)=>i%totalShards===shard);
const base="http://127.0.0.1:8765/";
const outDir="qa-certificacion";fs.mkdirSync(outDir,{recursive:true});
const records=[];
const fmt=(v)=>String(v||"");
const stageFor=q=>{
 if(q.subject==="math")return {numeros:1,descomponer:4,comparar:6,ordinales:8,operaciones:12}[q.topic];
 return {sinonimos:1,antonimos:2,comunicacion:11}[q.topic];
};
function inject({q,readingMode}){
 // Runs BEFORE normal application scripts; never shipped in application source.
 const phase=q.stage,subject=q.subject;
 const completed={};
 for(let n=1;n<phase;n++)completed[subject+"-stage-"+String(n).padStart(2,"0")]={plays:1,best:1,lastScore:1,lastTotal:15};
 const p={history:[],misses:[],badges:[],lastDate:"",
  stageJourney:{version:1,active:subject+"-stage-"+String(phase).padStart(2,"0"),completed,finalAwarded:false,previous:null},
  adaptive:{version:2,rewards:{coins:0,completed:0},topics:{
   [q.topic]:{step:q.minStep,answers:[],streak:0,wrong:0,sinceChange:0,concepts:{},needs:[],missions:0}
  }}};
 if(!localStorage.getItem("ligasaber-2026-"+subject))localStorage.setItem("ligasaber-2026-"+subject,JSON.stringify(p));
 if(!readingMode){
 Object.defineProperty(window,"LigaBancoDrive",{configurable:true,set(real){
   const actualPick=real.pick.bind(real);
   const wrapped={...real,pick(topic,opts={}){
    if(topic===q.topic){
     const doc=real.questions.find(x=>x.id===q.id);
     if(!doc||doc.minStep>(opts.step??0))throw Error("Inaccessible at legal step: "+q.id);
     if(opts.requiredSign&&topic==="operaciones")throw Error("Sign constrained stage forbidden: "+q.id);
     if((opts.stage===5&&topic==="descomponer")||([5,6].includes(opts.stage)&&topic==="comunicacion"))
       throw Error("Filtered stage: "+q.id);
     window.__cert_selected=(window.__cert_selected||0)+1;
     return {...doc,choices:[...doc.choices],fingerprint:doc.id};
    }
    return actualPick(topic,opts);
   }};
   Object.defineProperty(window,"LigaBancoDrive",{value:wrapped,configurable:false});
 }});
 }
}
async function completeCurrent(page,topic) {
 if(await page.locator('[data-action="mini"][data-mini="digit"]').count()){
  const n=await page.locator(".quest-slot").count();
  for(let i=0;i<n;i++)await page.locator('[data-action="mini"][data-mini="digit"][data-value="0"]').first().click();
  await page.locator('[data-action="mini"][data-mini="submit"]').click();
 }else if(await page.locator('[data-action="mini"][data-mini="left"]').count()){
  const left=await page.locator('[data-action="mini"][data-mini="left"]').allTextContents();
  const right=await page.locator('[data-action="mini"][data-mini="right"]').allTextContents();
  const matching=await page.evaluate(({words,topic})=>{
   const pairs=topic==="antonimos"?window.EDU_DATA.antonyms:window.EDU_DATA.synonyms;
   return words.map(x=>pairs.find(p=>p[0]===x.trim())?.[1]);
  },{words:left,topic});
  for(let i=0;i<left.length;i++){
   const j=right.findIndex(v=>v.trim()===matching[i]);
   assert.ok(j>=0,"Original matching choice not found: "+left[i]);
   await page.locator('[data-action="mini"][data-mini="left"]').nth(i).click();
   await page.locator('[data-action="mini"][data-mini="right"]').nth(j).click();
  }
 }else if(await page.locator('[data-action="mini"][data-mini="pick"]').count()){
  const n=await page.locator('[data-action="mini"][data-mini="pick"]').count();
  for(let i=0;i<n;i++)await page.locator('[data-action="mini"][data-mini="pick"]').nth(i).click();
 }else if(await page.locator('[data-action="mini"][data-mini="verify"]').count()){
  await page.locator('[data-action="mini"][data-mini="verify"]').click();
 }else if(await page.locator('[data-action="mini"][data-mini="choose"]').count()){
  await page.locator('[data-action="mini"][data-mini="choose"]').first().click();
 }else if(await page.locator('[data-action="choose"]').count()){
  await page.locator('[data-action="choose"]').first().click();
 }else if(await page.locator("#response").count()){
  await page.locator("#response").fill("0");
  await page.locator('[data-action="check"]').click();
 }else throw Error("Unknown existing first-question mechanism");
 await page.locator('[data-action="next"]').waitFor({timeout:7000});
}
const questionButtons=page=>page.locator('[data-action="mini"][data-mini="choose"],[data-action="choose"]');
async function checkAnswer(page,q,ok,mode){
 const elements=questionButtons(page);
 const labels=(await elements.allTextContents()).map(x=>x.trim());
 const index=labels.indexOf(fmt(q.correct));
 assert.ok(index>=0,"Correct button missing: "+q.id+" "+JSON.stringify(labels));
 assert.equal(new Set(labels).size,labels.length,"Duplicate displayed answers: "+q.id);
 const pick=ok?index:labels.findIndex((_,i)=>i!==index);
 assert.ok(pick>=0,"Missing wrong answer: "+q.id);
 if(mode==="tap")await elements.nth(pick).tap();
 else await elements.nth(pick).click();
 const feedback=page.locator(".feedback[role=status]");
 await feedback.waitFor();
 assert.equal(await feedback.locator("p").first().innerText(),fmt(q.explanation),"Wrong explanation for "+q.id);
 assert.equal(await feedback.evaluate((el)=>el.classList.contains("ok")),ok,"Incorrect grading for "+q.id);
}
function progressOf(p,subject){return p.evaluate(s=>JSON.parse(localStorage.getItem("ligasaber-2026-"+s)),subject);}
async function caseBank(browser,q,ok){
 const stage=stageFor(q);if(!stage)throw Error("No stage exists for "+q.id);
 const target={...q,stage};const isMobile=Number(q.id.slice(-2))%2===0;
 const context=await browser.newContext({viewport:isMobile?{width:390,height:844}:{width:1366,height:768},
  hasTouch:isMobile,isMobile:isMobile});
 const page=await context.newPage();page.setDefaultTimeout(7000);
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 const evidence={id:q.id,subject:q.subject,topic:q.topic,source:q.source,stage,step:q.minStep,
  scenario:ok?"correct":"incorrect",checks:{},error:null};
 try{
  await page.addInitScript(inject,{q:target,readingMode:false});
  await page.goto(base+(q.subject==="math"?"matematicas-sda1.html":"lengua-sda1.html"),{waitUntil:"domcontentloaded"});
  await page.locator('[data-action="topics"]').first().click();
  await page.locator('[data-action="start-stage"][data-stage="'+q.subject+'-stage-'+String(stage).padStart(2,"0")+'"]').click();
  await completeCurrent(page,q.topic);
  await page.locator('[data-action="next"]').click();
  await page.locator(".q-title").waitFor();
  assert.equal(await page.locator(".q-title").innerText(),q.prompt,"Not original Drive prompt");
  evidence.checks.render=true;
  assert.equal(await page.evaluate(()=>window.__cert_selected),1,"Source bank not selected exactly once");
  await page.locator('[data-action="hint"]').click();
  assert.ok((await page.locator(".help-text").innerText()).includes(q.hint1),"Hint 1 missing "+q.id);
  await page.locator('[data-action="hint"]').click();
  assert.ok((await page.locator(".help-text").innerText()).includes(q.hint2),"Hint 2 missing "+q.id);
  evidence.checks.hints=true;
  // Reabrir antes de responder debe recuperar la MISMA pregunta y sus pistas.
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator('[data-action="resume-stage"]').click();
  assert.equal(await page.locator(".q-title").innerText(),q.prompt,"Checkpoint changed question");
  assert.ok((await page.locator(".help-text").innerText()).includes(q.hint2),"Lost hint after reload");
  evidence.checks.preAnswerResume=true;
  const before=await progressOf(page,q.subject);
  await checkAnswer(page,q,ok,isMobile?"tap":"click");
  let p=await progressOf(page,q.subject);
  assert.equal(p.history.length,before.history.length+1,"Response not recorded once");
  assert.equal(p.history.at(-1).fingerprint,q.id,"Recorded wrong question");
  assert.equal(p.history.at(-1).ok,ok,"Recorded wrong grade");
  assert.equal(p.history.at(-1).hint,2,"Used hints not recorded");
  if(!ok)assert.ok(p.misses.length>=(before.misses||[]).length+1,"Missing error not recorded");
  evidence.checks.saved=true;
  // Respuestas duplicadas deben quedar bloqueadas por controles deshabilitados.
  await page.evaluate(()=>document.querySelector('[data-action="mini"][data-mini="choose"],[data-action="choose"]')?.click());
  const once=await progressOf(page,q.subject);
  assert.equal(once.history.length,p.history.length,"Second click created duplicate history");
  assert.equal(once.adaptive.rewards.coins,p.adaptive.rewards.coins,"Second click created extra coins");
  evidence.checks.idempotentClick=true;
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator('[data-action="resume-stage"]').click();
  assert.equal(await page.locator(".q-title").innerText(),q.prompt);
  assert.equal(await page.locator(".feedback").evaluate(x=>x.classList.contains("ok")),ok);
  const after=await progressOf(page,q.subject);
  assert.equal(after.history.length,p.history.length,"Reload duplicated answer");
  evidence.checks.postAnswerResume=true;
  await page.locator('[data-action="next"]').click();
  assert.ok(await page.locator(".q-title").count(),"Cannot continue");
  evidence.checks.next=true;
  assert.deepEqual(errors,[],"JavaScript page errors");
  evidence.status="VALIDADA";
 }catch(e){
  evidence.status="FALLIDA";evidence.error=String(e.stack||e.message||e);
  try{await page.screenshot({path:outDir+"/"+q.id+"-"+(ok?"ok":"wrong")+".png",fullPage:true,timeout:3000})}catch{}
 }finally{records.push(evidence);await context.close()}
}
async function caseReading(browser,ok){
 const q={subject:"lang",topic:"comprension",stage:9,minStep:0};const context=await browser.newContext({viewport:{width:768,height:1024},hasTouch:true});
 const page=await context.newPage();page.setDefaultTimeout(7500);
 const errs=[];page.on("pageerror",e=>errs.push(e.message));
 try{
  await page.addInitScript(inject,{q,readingMode:true});
  await page.goto(base+"lengua-sda1.html",{waitUntil:"domcontentloaded"});
  await page.locator('[data-action="topics"]').first().click();
  await page.locator('[data-action="start-stage"][data-stage="lang-stage-09"]').click();
  await page.locator('[data-action="pick-material"]').filter({hasText:reading.title}).click();
  for(let i=0;i<6;i++){
   const id="DRIVE-LANG-LECTURA-"+String(i+1).padStart(2,"0");
   const target={id,subject:"lang",topic:"comprension",source:reading.source,stage:9,step:0,
    scenario:ok?"correct":"incorrect",checks:{},error:null};
   try{
    const [prompt,correct]=reading.qa[i];
    assert.equal(await page.locator(".q-title").innerText(),prompt,"Wrong reading index "+i);
    assert.ok((await page.locator(".reading").innerText()).includes(reading.text.slice(0,45)),"Reading text hidden");
    assert.equal(await page.locator(".question-sub").innerText(),"Lectura: "+reading.title);
    target.checks.render=true;
    const buttons=questionButtons(page);const labels=(await buttons.allTextContents()).map(x=>x.trim());
    const index=labels.indexOf(correct);
    assert.ok(index>=0,"Correct comprehension answer absent for "+id);
    assert.equal(new Set(labels).size,labels.length,"Duplicate comprehension alternatives");
    await page.locator('[data-action="hint"]').click();
    assert.ok(await page.locator(".help-text").count());target.checks.hints=true;
    if(i===0){
      await page.reload({waitUntil:"domcontentloaded"});
      await page.locator('[data-action="resume-stage"]').click();
      assert.equal(await page.locator(".q-title").innerText(),prompt);
      target.checks.preAnswerResume=true;
    }else target.checks.preAnswerResume="NO APLICA: verified first reading question";
    const before=await progressOf(page,"lang");
    const choose=ok?index:labels.findIndex((_,k)=>k!==index);
    await questionButtons(page).nth(choose).click();
    assert.equal(await page.locator(".feedback").evaluate(x=>x.classList.contains("ok")),ok);
    assert.ok((await page.locator(".feedback").innerText()).includes(correct),"Explanation lacks answer");
    const p=await progressOf(page,"lang");assert.equal(p.history.length,before.history.length+1);
    assert.equal(p.history.at(-1).ok,ok);
    target.checks.saved=true;
    if(i===0){
     await page.reload({waitUntil:"domcontentloaded"});
     await page.locator('[data-action="resume-stage"]').click();
     assert.equal(await page.locator(".feedback").evaluate(x=>x.classList.contains("ok")),ok);
     const after=await progressOf(page,"lang");assert.equal(after.history.length,p.history.length);
     target.checks.postAnswerResume=true;
    }else target.checks.postAnswerResume="NO APLICA: verified first reading question";
    await page.locator('[data-action="next"]').click();
    target.checks.next=true;
    target.status="VALIDADA";
   }catch(e){target.status="FALLIDA";target.error=String(e.stack||e);records.push(target);break}
   records.push(target);
  }
  assert.deepEqual(errs,[],"Comprehension browser errors");
 }catch(e){records.push({id:"DRIVE-LANG-LECTURA-FLUJO",scenario:ok?"correct":"incorrect",status:"FALLIDA",error:String(e.stack||e)})}
 finally{await context.close()}
}
(async()=>{
 const browser=await chromium.launch({executablePath:chrome,headless:true,args:["--no-sandbox"]});
 try{
  for(const q of selected){
   for(const ok of [true,false])await caseBank(browser,q,ok);
   const last=records.slice(-2);
   console.log(q.id+" "+last.map(r=>r.status).join("/"));
  }
  if(shard===0)for(const ok of [true,false])await caseReading(browser,ok);
 }finally{await browser.close()}
 const path=outDir+"/certificacion-shard-"+shard+".json";fs.writeFileSync(path,JSON.stringify({shard,head:process.env.GITHUB_SHA||"local",records},null,2));
 const failed=records.filter(r=>r.status!=="VALIDADA");
 console.log("CERT SUMMARY shard="+shard+" executed="+records.length+" valid="+(records.length-failed.length)+" failed="+failed.length);
 for(const f of failed)console.error("FAIL "+f.id+" "+f.scenario+" "+f.error?.slice(0,500));
 if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=1});
