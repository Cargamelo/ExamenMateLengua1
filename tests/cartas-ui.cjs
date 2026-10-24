"use strict";
const assert=require("node:assert/strict");
const {chromium}=require("playwright-core");
const fs=require("node:fs");
const base="http://127.0.0.1:8765";
const chrome=process.env.CHROME_BIN||["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"].find(fs.existsSync);
if(!chrome)throw Error("Chrome/Chromium no disponible");
const subjects=[["math","matematicas-sda1.html"],["lang","lengua-sda1.html"]];
async function completeFirstStage(page,subject){
 const file=subjects.find(row=>row[0]===subject)[1];
 await page.goto(base+"/"+file,{waitUntil:"networkidle"});
 await page.locator('[data-action="topics"]').first().click();
 await page.locator('[data-action="start-stage"][data-stage="'+subject+'-stage-01"]').click();
 await page.evaluate(type=>{
  const key="ligasaber-2026-"+type+"-checkpoint-v2";
  function press(selector){
   const el=document.querySelector(selector);
   if(!el)throw Error("Falta control "+selector);
   el.click();
  }
  function mini(action,value){
   const list=[...document.querySelectorAll('[data-action="mini"]')];
   const el=list.find(x=>x.dataset.mini===action&&String(x.dataset.value||"")===String(value));
   if(!el)throw Error("Falta minijuego "+action+":"+value);
   el.click();
  }
  for(let n=0;n<15;n++){
   const state=JSON.parse(localStorage.getItem(key)||"null");
   if(!state||!state.session||!state.session.items[state.questionIndex])throw Error("No se ha guardado el reto "+n);
   const q=state.session.items[state.questionIndex],m=q.mechanic;
   if(m){
    if(m.type==="digits"||m.type==="machine"){for(const digit of String(m.target))mini("digit",digit);mini("submit","✓");}
    else if(m.type==="train"){
     const used=new Set();
     for(const v of m.correct){const i=m.values.findIndex((x,j)=>String(x)===String(v)&&!used.has(j));if(i<0)throw Error("Vagón inexistente");used.add(i);mini("pick",i);}
    }else if(m.type==="links"){
     for(let i=0;i<m.pairs.length;i++){const j=m.right.findIndex(x=>x===m.pairs[i][1]);mini("left",i);mini("right",j);}
    }else if(m.type==="repair"){for(const i of m.target)mini("toggle",i);mini("verify","0");}
    else if(m.type==="scene"||m.type==="race"){
     let i=m.values.findIndex(x=>String(x)===String(q.correct));mini("choose",i<0?0:i);
    }else throw Error("Mecánica sin test "+m.type);
   }else if(q.choices){let i=q.choices.findIndex(x=>String(x)===String(q.correct));press('[data-action="choose"][data-choice="'+i+'"]');}
   else{const el=document.getElementById("response");if(!el)throw Error("Falta campo de respuesta");el.value=String(q.correct);press('[data-action="check"]');}
   press('[data-action="next"]');
  }
 },subject);
 const section=page.locator(".stage-card-earned");
 await section.waitFor();
 assert.match(await section.innerText(),/CARTA CONSEGUIDA/);
 assert.equal(await section.locator("img").count(),1);
 const won=await page.evaluate(()=>window.LigaCartas.inventory());
 assert.equal(won.rewarded,subject==="math"?1:2);
 assert.equal(won.unique,subject==="math"?1:2);
 return won;
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:chrome,args:["--no-sandbox","--disable-dev-shm-usage"]});
 const errors=[];
 try{
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();
  page.on("pageerror",e=>errors.push(e.stack||e.message));
  await page.goto(base+"/index.html",{waitUntil:"networkidle"});
  await page.locator('[data-liga-open="collection"]').click();
  assert.equal(await page.locator(".pixel-card-pending").count(),24);
  assert.match(await page.locator(".pixel-inventory-progress").innerText(),/0 \/ 24/);
  await page.locator('[data-filter="obtenidas"]').click();
  assert.equal(await page.locator(".pixel-card-tile").count(),0);
  await page.keyboard.press("Escape");
  await completeFirstStage(page,"math");
  assert.equal(await page.locator(".stage-card-earned img").getAttribute("src"),"./assets/pixel/cartas/c007.webp");
  await page.locator(".stage-card-earned [data-action='collection']").click();
  assert.equal(await page.locator(".pixel-card-owned").count(),1);
  assert.equal(await page.locator(".pixel-card-pending").count(),23);
  await page.locator('[data-filter="obtenidas"]').click();
  assert.equal(await page.locator(".pixel-card-tile").count(),1);
  await page.locator(".pixel-card-tile").first().click();
  assert.equal(await page.locator('[data-pixel-action="flip"]').count(),1);
  await page.locator('[data-pixel-action="flip"]').click();
  assert.match(await page.locator(".pixel-card-flip img").getAttribute("src"),/reversos/);
  await page.keyboard.press("Escape");await page.keyboard.press("Escape");
  await page.reload({waitUntil:"networkidle"}); // recarga durante la celebración
  await page.locator('[data-action="collection"]').first().click();
  assert.match(await page.locator(".pixel-inventory-progress").innerText(),/1 \/ 24/);
  await page.keyboard.press("Escape");
  await completeFirstStage(page,"lang");
  await page.locator('.stage-card-earned [data-action="collection"]').click();
  assert.match(await page.locator(".pixel-inventory-progress").innerText(),/2 \/ 24/);
  assert.match(await page.locator(".pixel-inventory-progress").innerText(),/2 \/ 30/);
  await page.keyboard.press("Escape");
  // Simulación de una segunda pestaña con la misma partida.
  const tab=await context.newPage();
  await tab.goto(base+"/index.html",{waitUntil:"networkidle"});
  await tab.locator('[data-liga-open="collection"]').click();
  assert.equal(await tab.locator(".pixel-card-owned").count(),2);
  await tab.close();
  // La importación de una partida histórica debe descubrir cartas sin jugar otra vez.
  const history=await browser.newContext({viewport:{width:768,height:1024}});
  const old=await history.newPage();
  await old.goto(base+"/index.html",{waitUntil:"networkidle"});
  await old.evaluate(()=>{
   for(const subject of ["math","lang"]){
    const completed={};
    for(let n=1;n<=15;n++)completed[subject+"-stage-"+String(n).padStart(2,"0")]={plays:1,best:10};
    localStorage.setItem("ligasaber-2026-"+subject,JSON.stringify({history:[],misses:[],badges:[],stageJourney:{version:1,completed}}));
   }
  });
  await old.reload({waitUntil:"networkidle"});
  await old.locator('[data-liga-open="collection"]').click();
  assert.match(await old.locator(".pixel-inventory-progress").innerText(),/24 \/ 24/);
  assert.match(await old.locator(".pixel-inventory-progress").innerText(),/30 \/ 30/);
  assert.match(await old.locator(".pixel-inventory-progress").innerText(),/6 copias repetidas/);
  assert.equal(await old.locator(".pixel-card-owned").count(),24);
  await old.locator('[data-filter="pendientes"]').click();
  assert.equal(await old.locator(".pixel-card-tile").count(),0);
  assert.deepEqual(errors,[],"Errores de JavaScript en navegador");
  await history.close();await context.close();
  console.log("OK: primer premio de Matemáticas y Lengua, recarga, álbum, filtros, teclado, dos pestañas y migración 30/30");
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
