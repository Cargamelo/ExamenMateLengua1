"use strict";
const { chromium } = require("playwright-core");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const base = process.env.TEST_URL || "http://127.0.0.1:8765";
const errors = [];
const screenshots = "test-screenshots";
fs.mkdirSync(screenshots, {recursive:true});
async function inspect(page, name) {
 const broken = await page.locator('img').evaluateAll(items => items.filter(img => {let e=img;while(e&&e!==document.body){if(getComputedStyle(e).display==='none'||getComputedStyle(e).visibility==='hidden')return false;e=e.parentElement;}return img.complete&&img.naturalWidth===0}).map(img=>img.getAttribute('src')));
 assert.equal(broken.length,0, name+" contiene imágenes no disponibles: "+broken.join(", "));
 const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth+3);
 assert.equal(overflow,false,name+" presenta desplazamiento horizontal");
}
async function test() {
 const chrome = process.env.CHROME_BIN || "/usr/bin/google-chrome";
 const browser = await chromium.launch({headless:true,executablePath:chrome,args:["--no-sandbox","--disable-dev-shm-usage"]});
 try {
  for(const vp of [{width:1366,height:768},{width:390,height:844}]) {
   const context=await browser.newContext({viewport:vp,deviceScaleFactor:1});
   const page=await context.newPage();
   page.on("pageerror",e=>errors.push(vp.width+" JS: "+e.message));
   page.on("console",m=>{if(m.type()==="error"&&!m.text().includes("fonts.googleapis")) errors.push(vp.width+" console: "+m.text())});
   await page.goto(base+"/index.html",{waitUntil:"networkidle"});
   assert(await page.getByRole("heading",{name:/LA LIGA/i}).count()>0);
   assert.equal(await page.locator(".pixel-portal").count(),2);
   await page.screenshot({path:screenshots+"/portada-"+vp.width+".png",fullPage:true});
   await inspect(page,"Portada");
   await page.locator('[data-liga-open="collection"]').click();
   assert.equal(await page.locator(".pixel-card-tile").count(),24);
   await page.locator('[data-filter="matematicas"]').click();
   assert.equal(await page.locator(".pixel-card-tile").count(),5);
   await page.locator(".pixel-card-tile").first().click();
   await page.locator('[data-pixel-action="flip"]').click();
   assert(await page.locator(".pixel-card-flip img").getAttribute("src").then(s=>s.includes("reversos")));
   await page.keyboard.press("Escape");
   await page.keyboard.press("Escape");
   assert.equal(await page.locator(".pixel-dialog").count(),0);
   await page.locator('[data-liga-open="errors"]').click();
   assert.equal(await page.locator(".pixel-hub-choices a").count(),2);
   await page.keyboard.press("Escape");
   for(const game of ["matematicas-sda1.html","lengua-sda1.html"]){
    await page.goto(base+"/"+game,{waitUntil:"networkidle"});
    assert(await page.locator('[data-action="topics"]').count()>0);
    await page.locator('[data-action="topics"]').first().click();
    assert.equal(await page.locator('[data-action="start-stage"]').count(),15);
    await inspect(page,game+" mapa");
    await page.screenshot({path:screenshots+"/"+(game.startsWith("m")?"matematicas":"lengua")+"-mapa-"+vp.width+".png",fullPage:true});
    await page.locator('[data-action="start-stage"]').first().click();
    assert(await page.locator(".mission-stage").count()>0);
    await page.screenshot({path:screenshots+"/"+(game.startsWith("m")?"matematicas":"lengua")+"-reto-"+vp.width+".png",fullPage:true});
    await inspect(page,game+" reto");
    const hint=page.locator('[data-action="hint"]');
    if(await hint.count())await hint.first().click();
    await page.locator('[data-action="collection"]').click();
    assert.equal(await page.locator(".pixel-card-tile").count(),24);
    await page.keyboard.press("Escape");
   }
   await context.close();
  }
  const c=await browser.newContext({viewport:{width:1280,height:800}});
  const page=await c.newPage(); page.on("pageerror",e=>errors.push("Misión: "+e.message));
  await page.goto(base+"/matematicas-sda1.html",{waitUntil:"networkidle"});
  await page.locator('[data-action="topics"]').first().click();
  await page.locator('[data-action="start-stage"][data-stage="math-stage-01"]').click();
  for(let round=0;round<15;round++){
   let next=page.locator('[data-action="next"]');
   if(!await next.count()){
     if(await page.locator('[data-mini="digit"]').count()){
      for(let j=0;j<4;j++)await page.locator('[data-mini="digit"][data-value="0"]').click();
      await page.locator('[data-mini="submit"]').click();
     }else if(await page.locator('[data-mini="choose"]').count()){
      await page.locator('[data-mini="choose"]').first().click();
     }else if(await page.locator('[data-action="choose"]').count()){
      await page.locator('[data-action="choose"]').first().click();
     }else if(await page.locator("#response").count()){
      await page.locator("#response").fill("1000");
      await page.locator('[data-action="check"]').click();
     }else throw Error("Reto "+(round+1)+" sin forma de responder");
   }
   assert(await page.locator('[data-action="next"]').count()>0,"No avanzó el reto "+(round+1));
   await page.locator('[data-action="next"]').click();
  }
  assert(await page.locator(".stage-victory").count()>0, "Falta pantalla de victoria al completar 15 retos");
  assert(await page.locator('[data-action="repeat-stage"]').count()>0);
  await page.screenshot({path:screenshots+"/resultado.png",fullPage:true});
  await c.close();
  assert.deepEqual(errors,[],"Errores de consola: "+errors.join(" | "));
  console.log("OK: Portada desktop/móvil, 24 cartas, filtros/reversos, ambos mapas, ambos ejercicios, pistas, 15 retos de matemáticas, progreso y victoria.");
 }finally{await browser.close();}
}
test().catch(e=>{console.error(e);process.exitCode=1});
