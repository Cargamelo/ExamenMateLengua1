"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict"),{chromium}=require("playwright-core");
const base=process.env.TEST_URL||"http://127.0.0.1:8765";
const sizes=[[1366,768],[1920,1080],[2560,1440],[3440,1440],[1024,768],[768,1024],[390,844],[360,800],[844,390]];
const browserPath=process.env.CHROME_BIN||["/usr/bin/google-chrome","/usr/bin/chromium"].find(fs.existsSync);
let checks=0;const failures=[];fs.mkdirSync("qa-screenshots/interiores-v11",{recursive:true});
function check(ok,msg){checks++;if(!ok)failures.push(msg)}
async function metrics(p){
 return p.evaluate(()=>{
   const rect=e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height,left:r.left,right:r.right,top:r.top,bottom:r.bottom}};
   const visible=img=>{let n=img;while(n&&n!==document.body){if(getComputedStyle(n).display==="none"||getComputedStyle(n).visibility==="hidden")return false;n=n.parentElement;}return true};
   const images=[...document.querySelectorAll("img")].filter(visible).map(i=>({src:i.currentSrc||i.src,ok:i.complete&&i.naturalWidth>0}));
   const map=document.querySelector(".stage-artscape");
   return {width:document.documentElement.scrollWidth,bodyBg:getComputedStyle(document.body).backgroundImage,
      map:map?rect(map):null,imgSrc:document.querySelector(".map-ground-art")?.currentSrc||"",
      stages:document.querySelectorAll(".stage-node").length,
      stageIds:[...document.querySelectorAll(".stage-node")].map(e=>e.getAttribute("data-stage")),
      portraits:[...document.querySelectorAll(".stage-guide img,.hero-companion,.quest-guide-art")].map(e=>e.getAttribute("src")),
      images};
 });
}
(async()=>{
 const browser=await chromium.launch({executablePath:browserPath,headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
 try{
  for(const [w,h] of sizes){
   const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:"reduce",deviceScaleFactor:1});
   const p=await ctx.newPage(),errors=[];
   p.on("pageerror",e=>errors.push(e.message));
   p.on("response",r=>{if(r.status()===404&&r.url().startsWith(base))errors.push("404 "+r.url())});
   for(const subject of ["matematicas","lengua"]){
     const math=subject==="matematicas",route=subject+"-sda1.html",code=math?"math":"lang";
     await p.goto(base+"/"+route,{waitUntil:"networkidle"});
     check(await p.locator("link[href='./v11-interiores.css']").count()===1,"Tema V11 cargado "+route+" "+w);
     check(await p.locator(".hero-companion").getAttribute("src")==="./assets/portada/"+(math?"tiko":"nara")+"-portada.webp","Personaje principal V10 "+subject+" "+w);
     await p.locator('[data-action="topics"]').first().click();
     const m=await metrics(p);
     check(m.stages===15,subject+" tiene "+m.stages+" fases "+w);
     check(m.stageIds[0]===code+"-stage-01"&&m.stageIds[14]===code+"-stage-15","IDs persistentes intactos "+subject+" "+w);
     check(m.width<=w+3,"Desbordamiento "+subject+" "+w+" -> "+m.width);
     check(m.imgSrc.includes(w>=900?("assets/v11/reino-"+(math?"matematicas":"lengua")+".webp"):("arte-v4/mapa-"+(math?"numeros":"palabras")+".webp")),"Mapa artístico responsive incorrecto "+subject+" "+w+" "+m.imgSrc);
     check(m.portraits.some(src=>src.includes("portada/"+(math?"tiko":"nara"))),"Guía de mapa V10 "+subject+" "+w);
     check(m.images.every(i=>i.ok),"Imágenes rotas "+subject+" "+w+": "+JSON.stringify(m.images.filter(i=>!i.ok)));
     check(errors.length===0,"Errores navegador "+subject+" "+w+": "+errors.join(","));
     await p.screenshot({path:"qa-screenshots/interiores-v11/"+subject+"-mapa-"+w+"x"+h+".png",fullPage:true});
     await p.locator('[data-action="start-stage"]').first().click();
     check(await p.locator(".mission-stage").count()===1,"Misión abierta "+subject+" "+w);
     const bg=await p.locator(".mission-stage").evaluate(e=>getComputedStyle(e).backgroundImage);
     check(bg.includes("assets/v11/reino-"),"Fondo de misión V11 "+subject+" "+w);
     check((await p.locator(".quest-guide-art").first().getAttribute("src")).includes("assets/portada/"),"Guía de ejercicio V10 "+subject+" "+w);
     const q=await metrics(p);check(q.width<=w+3,"Desbordamiento de ejercicio "+subject+" "+w);
     if([1366,390,360].includes(w))await p.screenshot({path:"qa-screenshots/interiores-v11/"+subject+"-ejercicio-"+w+"x"+h+".png",fullPage:true});
   }
   if([1366,390].includes(w)){
     await p.goto(base+"/index.html",{waitUntil:"networkidle"});
     const cover=await p.locator(".fantasy-scene").evaluate(e=>getComputedStyle(e).backgroundImage);
     check(cover.includes("portada/escenario.webp"),"Portada V10 sin cambios "+w);
     await p.locator('[data-liga-open="collection"]').click();
     check(await p.locator(".pixel-card-tile").count()===24,"Catálogo 24 cartas "+w);
     check(await p.locator(".pixel-card-pending").count()>0,"Cartas pendientes no falseadas "+w);
     await p.screenshot({path:"qa-screenshots/interiores-v11/coleccion-"+w+".png",fullPage:true});
   }
   await ctx.close();
  }
 }finally{await browser.close()}
 const result={checks,failures,sizes};fs.writeFileSync("qa-screenshots/interiores-v11/result.json",JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
