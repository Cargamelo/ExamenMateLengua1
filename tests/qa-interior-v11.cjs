"use strict";
/* V11 QA visual/fun. Prueba el DOM real; no modifica partidas guardadas. */
const fs=require("fs"),{chromium}=require("playwright-core");
const sizes=[[1366,768],[1920,1080],[2560,1440],[3440,1440],[1024,768],[768,1024],[390,844],[360,800],[844,390]];
const chrome=process.env.CHROME_BIN||["/usr/bin/chromium","/usr/bin/google-chrome","/usr/bin/google-chrome-stable"].find(fs.existsSync);
const BASE="http://127.0.0.1:8765",root="qa-screenshots/interior-v11";const errors=[];let checks=0;
function check(ok,message){checks++;if(!ok)errors.push(message)}
function themeLoaded(page){return page.evaluate(()=>!![...document.styleSheets].some(x=>x.href&&x.href.includes("tema-interior-v11.css")))}
async function overflow(page,w,context){const m=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:innerWidth}));check(m.scroll<=w+2,context+" sin scroll horizontal "+m.scroll)}
async function screenshot(page,name){await page.screenshot({path:root+"/"+name+".png",fullPage:true,animations:"disabled"})}
async function main(){
 fs.mkdirSync(root,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:chrome,args:["--no-sandbox","--disable-dev-shm-usage"]});
 for(const [width,height] of sizes){
  const ctx=await browser.newContext({viewport:{width,height},reducedMotion:"reduce",deviceScaleFactor:1});
  const p=await ctx.newPage(),runtime=[];
  p.on("pageerror",err=>runtime.push(err.message));
  p.on("response",r=>{if(r.status()===404&&r.url().startsWith(BASE))runtime.push("404 "+r.url())});
  await p.goto(BASE+"/index.html",{waitUntil:"networkidle"});
  const cover=await p.locator(".fantasy-scene").evaluate(n=>getComputedStyle(n).backgroundImage);
  check(cover.includes("escenario.webp"),"Portada V10 conserva escenario "+width);
  check(await p.locator(".cover-portals>a").count()===2,"Portada conserva 2 portales "+width);
  check(await p.locator(".cover-menu>button").count()===4,"Portada conserva 4 accesos "+width);
  await overflow(p,width,"portada "+width);
  if(width===1920||width===390)await screenshot(p,"01-portada-"+width);
  if(width===1920||width===390){
   await p.locator('[data-liga-open="collection"]').click();
   await p.locator(".pixel-card-tile").first().waitFor();
   check(await p.locator(".pixel-card-tile").count()===24,"24 cartas "+width);
   const modal=await p.locator(".pixel-dialog").evaluate(n=>getComputedStyle(n).backgroundImage);
   check(modal.includes("bosque-magico.webp"),"Colección con ambientación pictórica "+width);
   await screenshot(p,"06-biblioteca-"+width);
   await p.keyboard.press("Escape");
   await p.locator('[data-liga-open="errors"]').click();await screenshot(p,"07-errores-"+width);
   await p.keyboard.press("Escape");
   await p.locator('[data-liga-open="progress"]').count().then(async count=>{
    if(count){await p.locator('[data-liga-open="progress"]').first().click();await screenshot(p,"08-logros-"+width);await p.keyboard.press("Escape")}
   });
   await p.locator('[data-liga-open="settings"]').click();await screenshot(p,"09-ajustes-"+width);
   await p.keyboard.press("Escape");
  }
  for(const [game,html,tag] of [["math","matematicas-sda1.html","02"],["lang","lengua-sda1.html","03"]]){
   await p.goto(BASE+"/"+html,{waitUntil:"networkidle"});
   check(await themeLoaded(p),"CSS V11 cargado "+game+" "+width);
   await p.locator(".adventure-launch").first().waitFor();
   const img=await p.locator(".hero-companion").evaluate(n=>({src:n.getAttribute("src"),loaded:n.complete&&n.naturalWidth>0}));
   check(img.src.includes(game==="math"?"tiko-portada.webp":"nara-portada.webp")&&img.loaded,"Personaje V10 usado en interior "+game+" "+width);
   if(width===1366)await screenshot(p,tag+"-intro-"+game);
   await p.locator('[data-action="topics"]').click();
   await p.locator(".stage-node").first().waitFor();
   check(await p.locator(".stage-node").count()===15,"15 fases "+game+" "+width);
   const artwork=await p.locator(".map-ground-art").evaluate(async n=>{n.loading="eager";try{await n.decode()}catch(e){}return {src:n.currentSrc,loaded:n.naturalWidth>0,fit:getComputedStyle(n).objectFit}});
   check(artwork.src.includes("/arte-v4/mapa-")&&artwork.loaded&&artwork.fit==="cover","Mapa ilustrado sin estirar "+game+" "+width);
   const first=await p.locator(".stage-node").first().getAttribute("data-stage");
   check(first===(game==="math"?"math-stage-01":"lang-stage-01"),"Identificador persistente conservado "+game+" "+width);
   await overflow(p,width,"mapa "+game+" "+width);
   if([1920,768,390].includes(width))await screenshot(p,tag+"-mapa-"+game+"-"+width);
   await p.locator(".stage-node").first().click();try{await p.locator(".mission-stage").waitFor({timeout:8000})}catch(e){const hit=await p.evaluate(()=>{const n=document.querySelector(".stage-node"),r=n?.getBoundingClientRect();const t=r?document.elementFromPoint(r.left+r.width/2,r.top+r.height/2):null;return {hit:t?.className,action:t?.closest?.("[data-action]")?.getAttribute("data-action"),nodePointer:n&&getComputedStyle(n).pointerEvents,layerPointer:n?.parentElement&&getComputedStyle(n.parentElement).pointerEvents,stage:window.AventuraFases?.getStage?.(document.body.dataset.subject,n?.dataset.stage),bodySubject:document.body.dataset.subject}});throw Error("Etapa no abre "+game+" "+width+" "+JSON.stringify(hit)+" runtime="+runtime.join(";"))}
   const mission=await p.locator(".mission-stage").evaluate(n=>({bg:getComputedStyle(n).backgroundImage}));
   check(mission.bg.includes(game==="math"?"portal-numeros.webp":"portal-palabras.webp"),"Escenario de misión pintado "+game+" "+width);
   const ink=await p.locator(".mission-pane,.mission-interaction").first().evaluate(n=>getComputedStyle(n).color);
   check(!!ink,"Texto visible "+game+" "+width);
   await overflow(p,width,"misión "+game+" "+width);
   if([1920,390].includes(width))await screenshot(p,"04-mision-"+game+"-"+width);
  }
  check(runtime.length===0,"Consola limpia "+width+" "+runtime.join("; "));
  await ctx.close();
 }
 await browser.close();
 const result={checks,failures:errors,sizes};fs.writeFileSync(root+"/resultado.json",JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(errors.length)process.exitCode=1;
}
main().catch(e=>{console.error(e.stack);process.exit(1)});
