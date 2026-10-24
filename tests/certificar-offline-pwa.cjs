"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict"),{chromium}=require("playwright-core");
const chrome=["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"].find(fs.existsSync);
if(!chrome)throw Error("No Chromium");
(async()=>{
 const browser=await chromium.launch({executablePath:chrome,headless:true,args:["--no-sandbox"]});
 const context=await browser.newContext({serviceWorkers:"allow",viewport:{width:390,height:844}});
 const page=await context.newPage();const errors=[];page.on("pageerror",e=>errors.push(e.message));
 const evidence={cache:false,mathOffline:false,langOffline:false,mathSaved:false,langSaved:false,restored:false,exceptions:[]};
 try{
  for(const subject of ["math","lang"]){
   await page.goto("http://localhost:8765/"+(subject==="math"?"matematicas-sda1.html":"lengua-sda1.html"),{waitUntil:"networkidle"});
   await page.evaluate(()=>Promise.race([
    navigator.serviceWorker.ready,
    new Promise((_,reject)=>setTimeout(()=>reject(Error("SW registration timed out")),15000))
   ]));
  }
  await page.reload({waitUntil:"networkidle"});
  const stored=await page.evaluate(async()=>{
   const keys=await caches.keys();
   const names=[];
   for(const key of keys){
    const cache=await caches.open(key);
    for(const path of ["./preguntas-drive.js","./lengua-temario.js","./juego.js","./contenidos.js"]){
     if(await cache.match(new URL(path,location.href)))names.push(path);
    }
   }
   return {keys,names};
  });
  for(const p of ["./preguntas-drive.js","./juego.js","./contenidos.js"])assert.ok(stored.names.includes(p),"Missing offline asset "+p);
  evidence.cache=true;
  await context.setOffline(true);
  for(const subject of ["math","lang"]){
   await page.goto("http://localhost:8765/"+(subject==="math"?"matematicas-sda1.html":"lengua-sda1.html"),{waitUntil:"domcontentloaded"});
   await page.locator('[data-action="topics"]').first().click();
   await page.locator('[data-action="start-stage"][data-stage="'+subject+'-stage-01"]').click();
   const prompt=await page.locator(".q-title").innerText();
   assert.ok(prompt.length>8);
   await page.locator('[data-action="hint"]').click();
   assert.ok(await page.locator(".help-text").count());
   await page.reload({waitUntil:"domcontentloaded"});
   await page.locator('[data-action="resume-stage"]').click();
   assert.equal(await page.locator(".q-title").innerText(),prompt);
   const p=await page.evaluate(s=>JSON.parse(localStorage.getItem("ligasaber-2026-"+s)),subject);
   assert.ok(p?.stageJourney,"Offline storage lost");
   evidence[subject+"Offline"]=true;
   evidence[subject+"Saved"]=true;
  }
  await context.setOffline(false);
  await page.reload({waitUntil:"networkidle"});
  assert.ok(await page.locator(".adventure-launch").count());
  evidence.restored=true;
  assert.deepEqual(errors,[]);
 }catch(e){evidence.exceptions=[String(e.stack||e)];process.exitCode=1;console.error(e.stack||e)}
 finally{
  fs.mkdirSync("qa-certificacion",{recursive:true});
  fs.writeFileSync("qa-certificacion/offline-pwa.json",JSON.stringify(evidence,null,2));
  console.log("OFFLINE QA "+JSON.stringify(evidence));
  await context.close();await browser.close();
 }
})().catch(e=>{console.error(e.stack);process.exitCode=1});
