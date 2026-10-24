"use strict";
const assert=require("node:assert/strict"),{chromium}=require("playwright-core"),fs=require("node:fs");
const chrome=["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"].find(fs.existsSync);
if(!chrome)throw Error("Chrome or Chromium unavailable");
(async()=>{
 const browser=await chromium.launch({executablePath:chrome,headless:true,args:["--no-sandbox"]});
 try{
  for(const [subject,filename] of [["math","matematicas-sda1.html"],["lang","lengua-sda1.html"]]){
   const context=await browser.newContext({viewport:{width:390,height:844}});
   const page=await context.newPage(),errors=[];
   page.on("pageerror",e=>errors.push(e.message));
   await page.goto("http://127.0.0.1:8765/"+filename,{waitUntil:"networkidle"});
   const seen=await page.evaluate(subject=>({
    questions:window.LigaBancoDrive.questions.filter(x=>x.subject===subject).length,
    read:window.EDU_DATA.readings.filter(x=>x.title==="Las uvas del huerto (relato original)").length,
    enabled:window.LigaSyncConfig?.enabled
   }),subject);
   assert.ok(seen.questions>0);
   assert.equal(seen.read,1,"Original reading must be available once");
   assert.equal(seen.enabled,false,"Supabase must remain off");
   await page.locator('[data-action="topics"]').first().click();
   assert.equal(await page.locator('[data-action="start-stage"]').count(),15);
   const locked=page.locator('[data-action="start-stage"]').nth(4);
   assert.equal(await locked.getAttribute("aria-disabled"),"true");
   await page.locator('[data-action="start-stage"]').first().click();
   assert.equal(await page.locator(".mission-stage").count(),1);
   if(subject==="math"){
    for(let i=0;i<4;i++)await page.locator('[data-action="mini"][data-mini="digit"][data-value="1"]').click();
    await page.locator('[data-action="mini"][data-mini="submit"]').click();
   }else{
    const left=await page.locator('[data-action="mini"][data-mini="left"]').allTextContents();
    const right=await page.locator('[data-action="mini"][data-mini="right"]').allTextContents();
    const matching=await page.evaluate(left=>left.map(x=>window.EDU_DATA.synonyms.find(pair=>pair[0]===x.trim())?.[1]),left);
    assert.equal(left.length,3,"Three synonym matches in basic level");
    for(let i=0;i<left.length;i++){
     const rightIndex=right.findIndex(v=>v.trim()===matching[i]);
     assert.ok(rightIndex>=0,"Matching synonym must appear in second column");
     await page.locator('[data-action="mini"][data-mini="left"]').nth(i).click();
     await page.locator('[data-action="mini"][data-mini="right"]').nth(rightIndex).click();
    }
   }
   await page.locator('[data-action="next"]').click();
   const question=await page.locator(".q-title").innerText();
   const picked=await page.evaluate(prompt=>window.LigaBancoDrive.questions.find(q=>q.prompt===prompt),question);
   assert.ok(picked,"The second challenge must come from the verified Drive bank: "+subject);
   assert.equal(picked.topic,subject==="math"?"numeros":"sinonimos");
   const values=await page.locator('[data-action="mini"][data-mini="choose"]').allTextContents();
   const idx=values.findIndex(v=>v.trim()===picked.correct);
   assert.ok(idx>=0,"Correct bank answer must be displayed");
   await page.locator('[data-action="mini"][data-mini="choose"]').nth(idx).click();
   assert.equal(await page.locator(".feedback.ok").count(),1,"Correct bank grading must work");
   await page.reload({waitUntil:"networkidle"});
   assert.equal(await page.locator('[data-action="resume-stage"]').count(),1,"Checkpoint must survive reload");
   await page.locator('[data-action="resume-stage"]').click();
   assert.equal(await page.locator(".q-title").innerText(),question,"Resume must preserve bank question");
   assert.deepEqual(errors,[],"No JavaScript page errors in "+subject);
   await context.close();
  }
  console.log("OK: educational bank loaded in both worlds, 15 locked phases, correct answers, real Math/Language challenges and resume.");
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
