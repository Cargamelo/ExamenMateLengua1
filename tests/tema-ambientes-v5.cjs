"use strict";
const {chromium}=require("playwright-core");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const chrome=["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"].find(fs.existsSync);
if(!chrome)throw Error("Chromium no disponible");
const base="http://127.0.0.1:8765";
const cases=[["matematicas-sda1.html","math"],["lengua-sda1.html","lang"]];
const resolutions=[[390,844],[768,1024],[1366,768]];
fs.mkdirSync("qa-fondos",{recursive:true});
let checks=0;
async function checkCSS(page,selector,{name,forbidWhite=true,expectImage=null}={}){
 const v=await page.locator(selector).first().evaluate(el=>{
  const style=getComputedStyle(el);return {background:style.backgroundColor,image:style.backgroundImage,color:style.color,visible:el.getBoundingClientRect().width>0};
 });
 assert.equal(v.visible,true,selector+" oculto");
 if(forbidWhite)assert(!["rgb(255, 255, 255)","rgba(255, 255, 255, 1)"].includes(v.background),selector+" tiene fondo blanco: "+JSON.stringify(v));
 if(expectImage)assert(v.image.includes(expectImage),selector+" no usa imagen: "+JSON.stringify(v));
 checks++;
 return v;
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:chrome,args:["--no-sandbox"]});
 const errors=[];
 try {
 for(const [width,height] of resolutions){
  for(const [file,subject] of cases){
   const page=await browser.newPage({viewport:{width,height}});
   page.on("pageerror",e=>errors.push(file+" @"+width+" JavaScript "+e.message));
   page.on("response",res=>{if(res.status()>=400&&res.url().startsWith(base))errors.push(file+" HTTP "+res.status()+" "+res.url())});
   const url=base+"/"+file;
   await page.goto(url,{waitUntil:"networkidle"});
   await page.waitForSelector(".adventure-launch",{timeout:18000});
   await checkCSS(page,"body.game.pixel-game",{name:"body",expectImage:"bosque-magico.webp"});
   await checkCSS(page,".adventure-launch",{name:"jugar",expectImage:"linear-gradient"});
   await checkCSS(page,".adventure-repair",{name:"errores",expectImage:"linear-gradient"});
   const sourceCSS=await page.evaluate(()=>[...document.styleSheets].some(s=>s.href?.includes("tema-ambientes-v5.css")));
   assert(sourceCSS,"No se ha cargado tema-ambientes-v5.css");checks++;
   await page.screenshot({path:"qa-fondos/"+subject+"-"+width+"-inicio.png",fullPage:true});
   await page.locator('[data-action="topics"]').click();
   await page.waitForSelector(".stage-node");
   assert.equal(await page.locator(".stage-node").count(),15);checks++;
   await checkCSS(page,".stage-gameworld",{name:"mapa"});
   await page.screenshot({path:"qa-fondos/"+subject+"-"+width+"-mapa.png",fullPage:true});
   await page.locator(".stage-node").first().click();
   await page.waitForSelector(".mission-stage");
   await checkCSS(page,".mission-stage",{name:"escena ejercicio",expectImage:"bosque-magico.webp"});
   await checkCSS(page,".mission-pane",{name:"pergamino",expectImage:"linear-gradient"});
   if(width===1366)await page.screenshot({path:"qa-fondos/"+subject+"-ejercicio.png",fullPage:true});
   await page.goto(url+"?view=errors",{waitUntil:"networkidle"});
   await page.waitForSelector(".recovery-hub");
   await checkCSS(page,".recovery-hub",{name:"mis errores"});
   await page.goto(url+"?view=progress",{waitUntil:"networkidle"});
   await page.waitForSelector(".stat-grid");
   await checkCSS(page,".stat",{name:"estadisticas"});
   await checkCSS(page,".paper",{name:"pergamino progreso"});
   if(width===1366)await page.screenshot({path:"qa-fondos/"+subject+"-logros.png",fullPage:true});
   await page.locator('[data-action="collection"]').first().click();
   await page.waitForSelector(".pixel-dialog");
   await checkCSS(page,".pixel-dialog",{name:"coleccion"});
   await page.keyboard.press("Escape");
   assert.equal(await page.locator(".pixel-dialog").count(),0);checks++;
   const over=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3);
   assert(!over,file+" tiene scroll horizontal en "+width);checks++;
   await page.close();
  }
 }
 assert.deepEqual(errors,[],"Errores: "+errors.join("\n"));
 console.log("OK: "+checks+" comprobaciones de fondos, progresión, errores, colección y responsive. Capturas en qa-fondos");
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
