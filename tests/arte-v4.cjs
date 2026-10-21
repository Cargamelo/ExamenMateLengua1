"use strict";
const {chromium}=require("playwright-core");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const chrome=["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"].find(fs.existsSync);
if(!chrome)throw Error("Navegador Chromium no disponible");
(async()=>{
 const browser=await chromium.launch({executablePath:chrome,headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
 const errors=[],files=[];
 try{
  for(const [w,h] of [[360,800],[390,844],[768,1024],[1366,768],[1920,1080]]){
   const page=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:2});
   page.on("pageerror",err=>errors.push(w+": "+err.message));
   page.on("response",r=>{if(r.status()>=400&&r.url().includes("127.0.0.1:8765"))errors.push("HTTP "+r.status()+" "+r.url())});
   await page.goto("http://127.0.0.1:8765/index.html",{waitUntil:"networkidle"});
   assert.equal(await page.locator(".pixel-portal").count(),2,"Portales");
   assert.equal(await page.locator(".pixel-portal-art").count(),2,"Personajes");
   const layout=await page.evaluate(()=>({
     hero:document.querySelector(".v4-portal-home")?.getBoundingClientRect().toJSON(),
     portraits:[...document.querySelectorAll(".pixel-portal-art")].map(e=>({
       width:e.getBoundingClientRect().width, height:e.getBoundingClientRect().height,
       naturalWidth:e.naturalWidth,naturalHeight:e.naturalHeight,loaded:e.complete
     })),
     forest:getComputedStyle(document.querySelector(".pixel-hero")).backgroundImage,
     links:[...document.querySelectorAll(".pixel-portal")].map(e=>e.getAttribute("href")),
     width:document.documentElement.scrollWidth
   }));
   assert(layout.hero&&layout.hero.width>0);
   assert(layout.forest.includes("bosque-magico.webp"),"Bosque fuente real");
   assert(layout.width<=w+3,"Desbordamiento en "+w+": "+layout.width);
   for(const p of layout.portraits){assert(p.loaded&&p.naturalWidth>=260&&p.naturalHeight>=330,"Retrato original no disponible");assert(p.width>100,"Retrato demasiado pequeño "+w)}
   assert(layout.links.includes("./matematicas-sda1.html")&&layout.links.includes("./lengua-sda1.html"));
   const filename="qa-screenshots/v4-portada-"+w+".png";
   await page.screenshot({path:filename,fullPage:true});files.push(filename);
   for(const file of ["matematicas-sda1.html","lengua-sda1.html"]){
    await page.goto("http://127.0.0.1:8765/"+file,{waitUntil:"networkidle"});
    await page.locator('[data-action="topics"]').click();
    const map=await page.locator(".map-ground-art").evaluate(e=>({src:e.getAttribute("src"),nw:e.naturalWidth,nh:e.naturalHeight,loaded:e.complete}));
    assert(map.loaded&&map.nw===1200&&map.nh===1900,JSON.stringify(map));
    assert(map.src.includes("arte-v4/"));
    assert.equal(await page.locator(".stage-node").count(),15);
    if(w===390||w===1366){
     const target="qa-screenshots/v4-mapa-"+(file.startsWith("matematicas")?"mates":"lengua")+"-"+w+".png";
     await page.screenshot({path:target,fullPage:true});files.push(target);
    }
    await page.locator(".stage-node").first().click();
    const guide=await page.locator(".quest-guide-art").first();
    assert(await guide.count(),"Retrato durante ejercicio");
    const src=await guide.getAttribute("src");
    assert(src?.includes("arte-v4/"),"Guía no actualizada");
   }
   await page.close();
  }
  assert.deepEqual(errors,[]);
  console.log("OK: 5 tamaños, portales, bosque, retratos, 2 mapas de 15 fases, imágenes sin 404 ni desbordamiento. Capturas: "+files.join(", "));
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
