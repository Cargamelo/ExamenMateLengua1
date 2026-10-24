"use strict";
const {chromium}=require("playwright-core"),fs=require("fs");
const cases=[[1366,768],[1920,1080],[2560,1440],[3440,1440],[1024,768],[768,1024],[390,844],[360,800],[360,640]];
const chrome=["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"].find(fs.existsSync);
const base="http://127.0.0.1:8765";const fails=[];let count=0;
function check(ok,label){count++;if(!ok)fails.push(label);}
function within(a,b,tol=2){return a.left>=b.left-tol&&a.right<=b.right+tol&&a.top>=b.top-tol&&a.bottom<=b.bottom+tol;}
async function test(){
 if(!chrome)throw Error("No se encontró Chromium");
 fs.mkdirSync("qa-screenshots/portada-escalado",{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:chrome,args:["--no-sandbox","--disable-dev-shm-usage"]});
 for(const [width,height] of cases){
  const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:"reduce"});
  const p=await ctx.newPage();const jsErrors=[];
  p.on("pageerror",e=>jsErrors.push(e.message));
  p.on("response",r=>{if(r.status()===404&&r.url().startsWith(base))jsErrors.push("404 "+r.url());});
  await p.goto(base+"/index.html",{waitUntil:"networkidle"});
  const m=await p.evaluate(()=>{
    const box=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
    const scene=document.querySelector(".fantasy-cover"),title=document.querySelector(".cover-heading h1"),heading=document.querySelector(".cover-heading");
    const menus=[...document.querySelectorAll(".cover-menu button")],portals=[...document.querySelectorAll(".cover-portals a")];
    const bodyBg=getComputedStyle(document.body).backgroundImage;
    const sceneBg=getComputedStyle(document.querySelector(".fantasy-scene")).backgroundImage;
    return {scene:box(scene),heading:box(heading),title:box(title),titleContentFits:title.scrollWidth<=title.clientWidth+2,
      portals:portals.map(box),menus:menus.map(box),
      images:[...document.querySelectorAll(".fantasy-scene img")].map(x=>({name:x.getAttribute("src"),ok:x.complete&&x.naturalWidth>0})),
      bodyBg,sceneBg,scrollWidth:document.documentElement.scrollWidth};
  });
  const ratio=m.scene.width/m.scene.height;
  check(Math.abs(ratio-824/477)<.012,"Proporción deformada "+width+": "+ratio);
  check(m.scrollWidth<=width+2,"Desplazamiento horizontal "+width+": "+m.scrollWidth);
  check(!m.bodyBg.includes("escenario.webp"),"Escenario duplicado fuera del lienzo "+width);
  check(m.sceneBg.includes("escenario.webp"),"Escenario no presente "+width);
  check(m.titleContentFits&&within(m.title,m.heading,12),"Rótulo fuera de su cartel "+width);
  check(m.images.every(x=>x.ok),"Recursos no cargados "+width+": "+JSON.stringify(m.images.filter(x=>!x.ok)));
  check(m.portals.length===2&&m.portals.every(x=>within(x,m.scene,2)),"Portal fuera de la portada "+width);
  check(m.menus.length===4&&m.menus.every(x=>within(x,m.scene,3)),"Menú fuera de la portada "+width);
  check(await p.locator(".cover-portal-math").getAttribute("href")==="./matematicas-sda1.html","Enlace Matemáticas "+width);
  check(await p.locator(".cover-portal-lang").getAttribute("href")==="./lengua-sda1.html","Enlace Lengua "+width);
  check(jsErrors.length===0,"Errores JS/404 "+width+": "+jsErrors.join(", "));
  await p.screenshot({path:"qa-screenshots/portada-escalado/portada-"+width+"x"+height+".png",fullPage:true});
  await ctx.close();
 }
 await browser.close();
 const report={checks:count,failures:fails,cases};fs.writeFileSync("qa-screenshots/portada-escalado/result.json",JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));if(fails.length)process.exitCode=1;
}
test().catch(e=>{console.error(e.stack);process.exitCode=1});