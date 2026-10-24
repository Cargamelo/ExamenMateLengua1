"use strict";
const {chromium}=require("playwright-core"),fs=require("fs");
const cases=[[1366,768],[1920,1080],[2560,1440],[3440,1440],[1024,768],[768,1024],[390,844],[360,800],[844,390]];
const root="http://127.0.0.1:8765";const fails=[];let checks=0;const target="qa-screenshots/portada-escalado";
function verify(ok,msg){checks++;if(!ok)fails.push(msg)}
function inside(a,b,tol=3){return a.left>=b.left-tol&&a.right<=b.right+tol&&a.top>=b.top-tol&&a.bottom<=b.bottom+tol}
async function metrics(page){
 return page.evaluate(()=>{
  const box=e=>{let r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
  let cover=document.querySelector(".fantasy-cover"),scene=document.querySelector(".fantasy-scene"),h=document.querySelector(".cover-heading"),title=document.querySelector(".cover-heading h1");
  const links=[...document.querySelectorAll(".cover-portal")],menus=[...document.querySelectorAll(".cover-menu button")];
  return {cover:box(cover),heading:box(h),title:box(title),titleFits:title.scrollWidth<=title.clientWidth+2,
    links:links.map(box),menus:menus.map(box),
    bodyBackground:getComputedStyle(document.body).backgroundImage,sceneBackground:getComputedStyle(scene).backgroundImage,
    backgroundSize:getComputedStyle(scene).backgroundSize,
    portalFit:links.map(x=>getComputedStyle(x.querySelector("img")).objectFit),
    ratios:links.map(x=>{let r=x.getBoundingClientRect();return r.width/r.height}),
    assets:[...scene.querySelectorAll("img")].map(i=>({src:i.getAttribute("src"),ok:i.complete&&i.naturalWidth>0})),
    scrollWidth:document.documentElement.scrollWidth
  };
 });
}
async function run(){
 fs.mkdirSync(target,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",args:["--no-sandbox","--disable-dev-shm-usage"]});
 for(const [width,height] of cases){
  const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:"reduce"});
  const p=await ctx.newPage(),errors=[];
  p.on("pageerror",e=>errors.push(e.message));
  p.on("response",r=>{if(r.status()===404&&r.url().startsWith(root))errors.push("404 "+r.url())});
  await p.goto(root+"/index.html",{waitUntil:"networkidle"});
  await p.locator(".fantasy-scene img").first().waitFor();
  const m=await metrics(p),portrait=height>width&&width<=850;
  verify(m.scrollWidth<=width+2,"desbordamiento "+width+"x"+height+" "+m.scrollWidth);
  verify(!m.bodyBackground.includes("escenario.webp"),"duplicación fuera de la escena "+width);
  verify(m.sceneBackground.includes("escenario.webp")&&m.backgroundSize.includes("cover"),"fondo no cubre "+width);
  verify(m.cover.width>=width-3,"escenario con márgenes laterales "+width+": "+m.cover.width);
  verify(portrait?m.cover.height>=1000:m.cover.height>=Math.min(520,height-70),"escenario demasiado bajo "+width);
  verify(m.titleFits&&inside(m.title,m.heading,15),"título fuera de cartel "+width);
  verify(m.assets.every(a=>a.ok),"imágenes rotas "+width+" "+JSON.stringify(m.assets.filter(a=>!a.ok)));
  verify(m.links.length===2&&m.links.every(r=>inside(r,m.cover,5)),"portales fuera del marco "+width);
  verify(m.menus.length===4&&m.menus.every(r=>inside(r,m.cover,5)),"menú fuera del marco "+width);
  verify(m.menus.every(r=>r.height>=44),"botones inferiores pequeños "+width);
  if(!portrait){
   verify(m.portalFit.every(f=>f==="contain"),"imagen de portal deformable "+width);
   verify(m.ratios.every(r=>Math.abs(r-519/765)<.05),"proporción de portal deformada "+width+": "+m.ratios.join(","));
  }
  verify(errors.length===0,"errores consola "+width+" "+errors.join(";"));
  await p.screenshot({path:target+"/portada-"+width+"x"+height+".png",fullPage:true});
  if(width===1920){await p.setViewportSize({width:3440,height:1440});const n=await metrics(p);verify(n.cover.width>=3437&&n.scrollWidth<=3442,"resize dinámico sin recarga 1920→3440");await p.setViewportSize({width:1366,height:768});const q=await metrics(p);verify(q.cover.width>=1363&&q.scrollWidth<=1368,"resize dinámico sin recarga 3440→1366");}
  await ctx.close();
 }
 await browser.close();
 const report={checks,failures:fails,cases};fs.writeFileSync(target+"/result.json",JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(fails.length)process.exitCode=1;
}
run().catch(e=>{console.error(e.stack);process.exitCode=1});