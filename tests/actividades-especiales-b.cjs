"use strict";
const assert=require("node:assert/strict");
const {chromium}=require("playwright-core");
const fs=require("node:fs");
const chrome=["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"].find(fs.existsSync);
if(!chrome)throw new Error("Chrome no disponible");
(async()=>{
 const browser=await chromium.launch({executablePath:chrome,headless:true,args:["--no-sandbox"]});
 try{
  for(const {number,kind} of [{number:13,kind:"dictado"},{number:14,kind:"expresiva"}]){
   const context=await browser.newContext();
   const page=await context.newPage(),errors=[];
   page.on("pageerror",e=>errors.push(e.message));
   await page.addInitScript(number=>{
    const completed={};
    for(let i=1;i<number;i++)completed["lang-stage-"+String(i).padStart(2,"0")]={plays:1,best:0,lastScore:0,lastTotal:15};
    if(!localStorage.getItem("ligasaber-2026-lang"))localStorage.setItem("ligasaber-2026-lang",JSON.stringify({history:[],misses:[],badges:[],
     stageJourney:{version:1,active:"lang-stage-"+number,completed,finalAwarded:false,previous:null}}));
   },number);
   await page.goto("http://127.0.0.1:8765/lengua-sda1.html",{waitUntil:"networkidle"});
   await page.locator('[data-action="topics"]').first().click();
   await page.locator('[data-action="start-stage"][data-stage="lang-stage-'+number+'"]').click();
   await page.locator('[data-action="pick-material"]').first().click();
   if(kind==="dictado"){
    await page.locator("#dict-response").fill("Mi dictado guardado antes de cerrar.");
    await page.reload({waitUntil:"networkidle"});
    assert.equal(await page.locator("#dict-response").inputValue(),"Mi dictado guardado antes de cerrar.");
   }else{
    await page.locator(".self-check").first().check();
    await page.locator(".self-check").nth(2).check();
    await page.reload({waitUntil:"networkidle"});
    assert.equal(await page.locator(".self-check").first().isChecked(),true);
    assert.equal(await page.locator(".self-check").nth(2).isChecked(),true);
    await page.locator('[data-action="expressive-save"]').click();
    await page.reload({waitUntil:"networkidle"});
    assert.equal(await page.locator('[data-action="expressive-save"]').isDisabled(),true);
   }
   assert.deepEqual(errors,[],"No browser exceptions in "+kind);
   await context.close();
  }
  console.log("OK: dictation draft and expressive self-evaluation survive reload; no browser exceptions.");
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack);process.exitCode=1});