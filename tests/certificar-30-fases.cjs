"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict"),{chromium}=require("playwright-core");
const chrome=["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"].find(fs.existsSync);
if(!chrome)throw Error("Chrome unavailable");
const root="http://127.0.0.1:8765/";
const results=[];
async function reply(page,topic){
 const next=page.locator('[data-action="next"]');
 if(await next.count())return;
 if(await page.locator('[data-action="mini"][data-mini="digit"]').count()){
  let n=await page.locator(".quest-slot").count();
  for(let i=0;i<n;i++)await page.locator('[data-action="mini"][data-mini="digit"][data-value="0"]').click();
  await page.locator('[data-action="mini"][data-mini="submit"]').click();
 }else if(await page.locator('[data-action="mini"][data-mini="left"]').count()){
  const left=(await page.locator('[data-action="mini"][data-mini="left"]').allTextContents()).map(x=>x.trim());
  const right=(await page.locator('[data-action="mini"][data-mini="right"]').allTextContents()).map(x=>x.trim());
  const prompt=await page.locator(".q-title").innerText();
  const target=await page.evaluate(({left,topic,prompt})=>{
   const variety=window.LigaVariedad?.questions?.find(q=>q.prompt===prompt&&q.type==="matching");
   const pairs=variety?.pairs||(topic==="antonimos"?window.EDU_DATA.antonyms:window.EDU_DATA.synonyms);
   return left.map(t=>pairs.find(p=>p[0]===t)?.[1]);
  },{left,topic,prompt});
  for(let i=0;i<left.length;i++){
   const index=right.indexOf(target[i]);assert.ok(index>=0,"Wrong original pair "+left[i]);
   await page.locator('[data-action="mini"][data-mini="left"]').nth(i).click();
   await page.locator('[data-action="mini"][data-mini="right"]').nth(index).click();
  }
 }else if(await page.locator('[data-action="mini"][data-mini="pick"]').count()){
  const n=await page.locator('[data-action="mini"][data-mini="pick"]').count();
  for(let i=0;i<n;i++)await page.locator('[data-action="mini"][data-mini="pick"]').nth(i).click();
 }else if(await page.locator('[data-action="mini"][data-mini="verify"]').count()){
  await page.locator('[data-action="mini"][data-mini="verify"]').click();
 }else if(await page.locator('[data-mini="submit-fields"]').count()){
  for(const item of await page.locator("[data-varied-input]").all())await item.fill("0");
  await page.locator('[data-mini="submit-fields"]').click();
 }else if(await page.locator('[data-mini="verify-classification"]').count()){
  const pairs=await page.locator('[data-mini="classify"]').evaluateAll(nodes=>nodes.map(n=>n.dataset.value));
  for(const i of [...new Set(pairs.map(x=>x.split(":")[0]))])
   await page.locator('[data-mini="classify"][data-value="'+i+':0"]').click();
  await page.locator('[data-mini="verify-classification"]').click();
 }else if(await page.locator('[data-mini="verify-writing"]').count()){
  await page.locator("#varied-writing").fill("La niña escribe y revisa una oración.");
  await page.locator('[data-mini="verify-writing"]').click();
 }else if(await page.locator('[data-action="mini"][data-mini="choose"]').count()){
  await page.locator('[data-action="mini"][data-mini="choose"]').first().click();
 }else if(await page.locator('[data-action="choose"]').count()){
  await page.locator('[data-action="choose"]').first().click();
 }else if(await page.locator("#response").count()){
  await page.locator("#response").fill("0");
  await page.locator('[data-action="check"]').click();
 }else throw Error("No input at phase topic "+topic);
 await next.waitFor({timeout:8000});
}
function prime({subject,index}){
 const completed={};
 for(let i=1;i<index;i++)completed[subject+"-stage-"+String(i).padStart(2,"0")]={plays:1,best:1,lastScore:1,lastTotal:15};
 localStorage.setItem("ligasaber-2026-"+subject,JSON.stringify({history:[],misses:[],badges:[],
  stageJourney:{version:1,active:subject+"-stage-"+String(index).padStart(2,"0"),completed,finalAwarded:false,previous:null}}));
}
const get=async(page,subject)=>page.evaluate(s=>JSON.parse(localStorage.getItem("ligasaber-2026-"+s)),subject);
(async()=>{
 const browser=await chromium.launch({executablePath:chrome,headless:true,args:["--no-sandbox"]});
 try{
  for(const subject of ["math","lang"]){
   for(let i=1;i<=15;i++){
    const context=await browser.newContext({viewport:{width:i%2?390:1366,height:i%2?844:768}});
    const page=await context.newPage();page.setDefaultTimeout(7000);
    const phase=subject+"-stage-"+String(i).padStart(2,"0");
    const evidence={subject,phase,finished:false,replay:false,locked:true,questions:0,fail:null};
    const exceptions=[];page.on("pageerror",e=>exceptions.push(e.message));
    try{
     await page.addInitScript(({subject,index})=>{
      if(!sessionStorage.getItem("qa-seeded-"+subject)){
       const completed={};for(let n=1;n<index;n++)completed[subject+"-stage-"+String(n).padStart(2,"0")]={plays:1,best:1,lastScore:1,lastTotal:15};
       localStorage.setItem("ligasaber-2026-"+subject,JSON.stringify({history:[],misses:[],badges:[],
        stageJourney:{version:1,active:subject+"-stage-"+String(index).padStart(2,"0"),completed,finalAwarded:false,previous:null}}));
       sessionStorage.setItem("qa-seeded-"+subject,"yes");
      }
     },{subject,index:i});
     await page.goto(root+(subject==="math"?"matematicas-sda1.html":"lengua-sda1.html"),{waitUntil:"domcontentloaded"});
     await page.locator('[data-action="topics"]').first().click();
     await page.locator('[data-action="start-stage"][data-stage="'+phase+'"]').click();
     const stage=await page.evaluate(({subject,phase})=>window.AventuraFases.getStage(subject,phase),{subject,phase});
     const count=stage.special==="comprension"?6:stage.special?1:15;
     evidence.questions=count;
     if(stage.special){
      await page.locator('[data-action="pick-material"]').first().click();
      if(stage.special==="comprension"){
       for(let n=0;n<6;n++){
        await reply(page,"comprension");
        await page.locator('[data-action="next"]').click();
       }
      }else if(stage.special==="dictado"){
       await page.locator("#dict-response").fill("Texto sintético de prueba.");
       await page.locator('[data-action="dict-check"]').click();
       await page.locator('[data-action="finish-special"]').click();
      }else{
       await page.locator('[data-action="expressive-save"]').click();
       await page.locator('[data-action="finish-special"]').click();
      }
     }else for(let n=0;n<15;n++){
      const topic=stage.topics[n%stage.topics.length];
      if(n%5===0&&await page.locator('[data-action="hint"]').count())await page.locator('[data-action="hint"]').click();
      await reply(page,topic);
      await page.locator('[data-action="next"]').click();
     }
     assert.equal(await page.locator(".stage-victory").count(),1,"Victory missing "+phase);
     const state=await get(page,subject);
     assert.equal(Object.keys(state.stageJourney.completed).length,i);
     assert.equal(state.stageJourney.completed[phase].plays,1);
     if(i<15){
      await page.locator('[data-action="topics"]').first().click();
      assert.equal(await page.locator('[data-action="start-stage"][data-stage="'+subject+"-stage-"+String(i+1).padStart(2,"0")+'"]').getAttribute("aria-disabled"),"false");
      if(i<14)assert.equal(await page.locator('[data-action="start-stage"][data-stage="'+subject+"-stage-"+String(i+2).padStart(2,"0")+'"]').getAttribute("aria-disabled"),"true");
     }
     evidence.finished=true;
     // Replay once for each world: full 15 questions and no duplicated first-completion bonus.
     if(i===1){
      await page.locator('[data-action="start-stage"][data-stage="'+phase+'"]').click();
      for(let n=0;n<15;n++){await reply(page,stage.topics[0]);await page.locator('[data-action="next"]').click();}
      const replay=await get(page,subject);
      assert.equal(replay.stageJourney.completed[phase].plays,2);
      assert.equal(Object.keys(replay.stageJourney.completed).length,1);
      evidence.replay=true;
     }else evidence.replay="NO APLICA: repetición completa probada fase 1 por asignatura";
     assert.deepEqual(exceptions,[]);
    }catch(e){evidence.fail=String(e.stack||e);}
    finally{results.push(evidence);await context.close();console.log(phase+" "+(evidence.fail?"FALLIDA":"VALIDADA"));}
   }
  }
 }finally{await browser.close()}
 fs.mkdirSync("qa-certificacion",{recursive:true});
 fs.writeFileSync("qa-certificacion/fases-30.json",JSON.stringify(results,null,2));
 const failures=results.filter(x=>x.fail);
 console.log("PHASE REPORT stages="+results.length+" pass="+(results.length-failures.length)+" failed="+failures.length);
 for(const x of failures)console.error(x.phase+" "+x.fail.slice(0,600));
 if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=1});
