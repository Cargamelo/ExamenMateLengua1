"use strict";
const fs=require("fs"),{chromium}=require("playwright-core");
const sizes=[[1366,768],[1920,1080],[2560,1440],[1024,768],[768,1024],[390,844],[360,800]];
const chrome=["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"].find(fs.existsSync);
const url="http://127.0.0.1:8765/";
let checks=0;const errors=[];
function assert(bool,msg){checks++;if(!bool)errors.push(msg)}
async function run(){
if(!chrome)throw Error("Chromium no disponible");
fs.mkdirSync("qa-screenshots/portada-v8",{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:chrome,args:["--no-sandbox","--disable-gpu"]});
for(const [width,height] of sizes){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:"reduce"});
 const page=await context.newPage();let jsErrors=[];
 page.on("pageerror",e=>jsErrors.push(e.message));page.on("response",r=>{if(r.status()===404&&r.url().startsWith(url))jsErrors.push("404 "+r.url())});
 await page.goto(url+"index.html",{waitUntil:"networkidle"});
 await page.locator(".cover-portal-math").waitFor();
 const links=page.locator(".cover-portals>a");assert(await links.count()===2,"Dos portales "+width);
 const buttons=page.locator(".cover-menu>button");assert(await buttons.count()===4,"Cuatro accesos "+width);
 const disabled=page.locator(".cover-secondary-actions button:disabled");assert(await disabled.count()===4,"Recuperación no configurada "+width);
 const images=await page.locator(".fantasy-scene img").evaluateAll(nodes=>nodes.filter(i=>i.getClientRects().length>0).map(i=>({file:i.getAttribute("src"),ok:i.complete&&i.naturalWidth>0})));
 assert(images.every(i=>i.ok),"Imágenes cargadas "+width+" "+JSON.stringify(images.filter(i=>!i.ok)));
 const {scrollWidth}=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth}));
 assert(scrollWidth<=width+2,"Sin scroll horizontal "+width+": "+scrollWidth);
 const title=await page.locator("#pixel-home-title").textContent();assert(title.includes("LA LIGA DEL SABER"),"Título accesible "+width);
 const stats=await page.locator("body").innerText();assert(!stats.includes("128")&&!stats.includes("340"),"Sin cifras ficticias "+width);
 const rect=await page.locator(".fantasy-cover").boundingBox();
 assert(rect.width>width*(width<900?0.92:0.83),"Escenario con presencia visual "+width);
 await page.screenshot({path:"qa-screenshots/portada-v8/portada-"+width+"x"+height+".png",fullPage:true});
 await page.locator(".cover-portal-math").focus();
 const focus=await page.locator(".cover-portal-math").evaluate(n=>getComputedStyle(n).outlineStyle);
 assert(focus!=="none","Foco visible "+width);
 await page.keyboard.press("Enter");
 await page.waitForURL(/matematicas-sda1\.html/);
 assert(page.url().includes("matematicas-sda1.html"),"Teclado Matemáticas "+width);
 await page.goto(url+"index.html",{waitUntil:"networkidle"});
 await page.locator(".cover-portal-lang").click();
 await page.waitForURL(/lengua-sda1\.html/);
 assert(page.url().includes("lengua-sda1.html"),"Ratón Lengua "+width);
 await page.goto(url+"index.html",{waitUntil:"networkidle"});
 for(const [action,selector] of [["collection",".pixel-card-tile"],["errors",".pixel-dialog"],["progress",".pixel-dialog"],["settings",".pixel-dialog"]]){
   await page.locator('[data-liga-open="'+action+'"]').click();await page.locator(selector).first().waitFor();
   if(action==="collection")assert(await page.locator(".pixel-card-tile").count()===24,"24 cartas "+width);
   assert(await page.locator(".pixel-dialog").count()>0,"Abre "+action+" "+width);
   await page.keyboard.press("Escape");assert(await page.locator(".pixel-dialog").count()===0,"Cierra "+action+" "+width);
 }
 for(const err of jsErrors)errors.push("JS "+width+" "+err);
 await context.close();
}
await browser.close();
const result={checks,errors};fs.writeFileSync("qa-screenshots/portada-v8/qa-v8.json",JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(errors.length)process.exitCode=1;
}
run().catch(e=>{console.error(e.stack);process.exitCode=1});