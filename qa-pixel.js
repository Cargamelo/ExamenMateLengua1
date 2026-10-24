"use strict";
const { chromium }=require('playwright-core');
const fs=require('fs');
const sizes=[[360,800],[390,844],[768,1024],[1024,768],[1366,768],[1920,1080],[2560,1440],[360,640]];
const errors=[];let checks=0;
const chrome=['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium'].find(x=>fs.existsSync(x));
const root='http://127.0.0.1:8765';
const ok=(v,msg)=>{checks++;if(!v)errors.push(msg)};
async function pageCheck(p,selector){await p.waitForSelector(selector,{timeout:15000});checks++}
async function overflow(p,w,name){const width=await p.evaluate(()=>document.documentElement.scrollWidth);if(width>w+2){const offenders=await p.evaluate(()=>[...document.querySelectorAll('*')].map(e=>({name:e.tagName.toLowerCase()+(e.className&&typeof e.className==='string'?'.'+e.className.trim().split(/\\s+/).slice(0,2).join('.'):'').slice(0,80),right:Math.round(e.getBoundingClientRect().right),left:Math.round(e.getBoundingClientRect().left),width:Math.round(e.getBoundingClientRect().width)})).filter(x=>x.right>innerWidth+4&&x.width>0).sort((a,b)=>b.right-a.right).slice(0,12));console.log('DESBORDAMIENTO',name,JSON.stringify(offenders));}ok(width<=w+2,name+' horizontal '+width+' > '+w)}
async function run(){
 if(!chrome)throw Error('Ningún Chromium instalado');
 fs.mkdirSync('qa-screenshots',{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:chrome,args:['--no-sandbox','--disable-gpu']});
 for(const [w,h] of sizes){
  const p=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:(w===360&&h===640?3:1)});const runtime=[];
  p.on('pageerror',e=>runtime.push(e.message));
  p.on('response',resp=>{if(resp.status()===404&&resp.url().startsWith(root))errors.push('404 '+resp.url())});
  await p.goto(root+'/index.html',{waitUntil:'networkidle'});
  await pageCheck(p,'.cover-portal-math');await pageCheck(p,'.cover-portal-lang');await overflow(p,w,'inicio '+w);
  if(w===390||w===1366)await p.screenshot({path:'qa-screenshots/01-portada-'+w+'.png',fullPage:true});
  await p.locator('[data-liga-open="collection"]').click();await pageCheck(p,'.pixel-card-tile');
  ok(await p.locator('.pixel-card-tile').count()===24,'Álbum de 24 cartas '+w);
  await p.locator('[data-pixel-action="filter"][data-filter="lengua"]').click();
  ok((await p.locator('.pixel-card-tile').count())>0 && (await p.locator('.pixel-card-tile').count())<24,'Filtro Lengua '+w);
  await p.locator('.pixel-card-tile').first().click();await pageCheck(p,'.pixel-card-flip');
  const front=await p.locator('.pixel-card-flip img').getAttribute('src');await p.locator('.pixel-card-flip').click();
  const back=await p.locator('.pixel-card-flip img').getAttribute('src');ok(front!==back&&back.includes('reversos'),'Reverso '+w);
  await p.keyboard.press('Escape');await p.keyboard.press('Escape');ok(await p.locator('.pixel-dialog').count()===0,'Escape cierra '+w);
  if(w===1366){await p.locator('[data-liga-open="collection"]').click();await p.screenshot({path:'qa-screenshots/07-coleccion.png',fullPage:true});await p.locator('[data-pixel-action="close"]').last().click()}
  for(const [name,href,code] of [['matematicas','matematicas-sda1.html','03'],['lengua','lengua-sda1.html','04']]){
   await p.goto(root+'/'+href,{waitUntil:'networkidle'});await pageCheck(p,'.adventure-launch');
   await p.locator('[data-action="topics"]').click();await pageCheck(p,'.stage-node');
   ok(await p.locator('.stage-node').count()===15,name+' 15 fases '+w);
   const artwork=await p.locator('.map-ground-art').evaluate(async n=>{n.loading='eager';try{await n.decode();}catch(_){}return {loaded:n.complete&&n.naturalWidth>0,src:n.currentSrc};});
   ok(artwork.loaded,name+' mapa cargado '+w);
   ok(artwork.src.endsWith(w>=900?'.svg':'.webp'),name+' mapa adaptable '+w+' '+artwork.src);
   await p.emulateMedia({reducedMotion:'reduce'});
   ok(await p.locator('.stage-guide img').evaluate(n=>getComputedStyle(n).animationName==='none'),name+' movimiento reducido '+w);
   await p.emulateMedia({reducedMotion:'no-preference'});
   await overflow(p,w,'mapa '+name+' '+w);
   if(w===1366||w===390)await p.screenshot({path:'qa-screenshots/'+code+'-mapa-'+name+'-'+w+'.png',fullPage:true});
   await p.locator('.stage-node').first().click();await pageCheck(p,'.mission-stage');
   ok((await p.locator('.mission-count').innerText()).includes('15'),name+' reto 1/15 '+w);await overflow(p,w,'ejercicio '+name+' '+w);
   if(w===1366)await p.screenshot({path:'qa-screenshots/'+(code==='03'?'05':'06')+'-ejercicio-'+name+'.png',fullPage:true});
   await p.locator('[data-action="collection"]').click();await pageCheck(p,'.pixel-dialog');
   await p.locator('[data-pixel-action="close"]').last().click();
   await p.goto(root+'/'+href+'?view=errors',{waitUntil:'networkidle'});await pageCheck(p,'.recovery-hub');
   if(w===1366&&code==='03')await p.screenshot({path:'qa-screenshots/08-mis-errores.png',fullPage:true});
   await p.goto(root+'/'+href+'?view=progress',{waitUntil:'networkidle'});await pageCheck(p,'.stat-grid');
   if(w===1366&&code==='03')await p.screenshot({path:'qa-screenshots/09-mis-logros.png',fullPage:true});
  }
  for(const msg of runtime)errors.push('JS '+w+': '+msg);
  await p.close();
 }
 await browser.close();
 fs.writeFileSync('qa-screenshots/informe.json',JSON.stringify({comprobaciones:checks,fallos:errors},null,2));
 console.log(JSON.stringify({comprobaciones:checks,fallos:errors},null,2));
 if(errors.length)process.exitCode=1;
}
run().catch(e=>{console.error(e.stack);process.exitCode=1});