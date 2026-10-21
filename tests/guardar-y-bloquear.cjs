"use strict";
const {chromium}=require("playwright-core");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const chrome=["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"].find(fs.existsSync);
if(!chrome)throw new Error("Chrome no disponible");
(async()=>{
const browser=await chromium.launch({executablePath:chrome,headless:true,args:["--no-sandbox"]});
const errors=[];try{
 for(const item of [{subject:"math",file:"matematicas-sda1.html"},{subject:"lang",file:"lengua-sda1.html"}]){
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:8765/"+item.file,{waitUntil:"networkidle"});
  await page.locator('[data-action="topics"]').first().click();
  assert.equal(await page.locator('[data-action="start-stage"]').count(),15);
  const locked=page.locator('[data-action="start-stage"]').nth(4);
  assert.equal(await locked.getAttribute("aria-disabled"),"true");
  await locked.dispatchEvent("click"); // simulamos activación maliciosa; aria-disabled impide el clic normal
  assert.match(await page.locator("#stage-locked-message").innerText(),/fase anterior/);
  assert.equal(await page.locator(".mission-stage").count(),0,"Locked stage was entered");
  await page.locator('[data-action="start-stage"]').first().click();
  assert.equal(await page.locator(".mission-stage").count(),1);
  const original=await page.locator(".q-title").innerText();
  await page.reload({waitUntil:"networkidle"});
  assert.equal(await page.locator('[data-action="resume-stage"]').count(),1,"Continue button missing after reload");
  await page.locator('[data-action="resume-stage"]').click();
  assert.equal(await page.locator(".q-title").innerText(),original,"Question changed after reload");
  await page.goto("http://127.0.0.1:8765/"+item.file,{waitUntil:"networkidle"});
  assert.equal(await page.locator('[data-action="resume-stage"]').count(),1,"Second reload forgot checkpoint");
  await context.close();
 }
 assert.deepEqual(errors,[],"Javascript errors");
 console.log("OK: 2 worlds, locked future stage, exact resume after two reloads, no JS errors.");
}finally{await browser.close();}
})().catch(e=>{console.error(e.stack);process.exitCode=1});