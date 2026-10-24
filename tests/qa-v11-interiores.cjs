"use strict";
const {chromium}=require("playwright-core"),fs=require("fs");
const sizes=[[1366,768],[1920,1080],[2560,1440],[3440,1440],[1024,768],[768,1024],[390,844],[360,800],[844,390]];
const failures=[];let checks=0;function verify(ok,msg){checks++;if(!ok)failures.push(msg);}
(async()=>{
 fs.mkdirSync("qa-screenshots/v11",{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",args:["--no-sandbox","--disable-dev-shm-usage"]});
 for(const [w,h] of sizes)for(const [name,url] of [["matematicas","matematicas-sda1.html"],["lengua","lengua-sda1.html"]]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:"reduce",serviceWorkers:"block"}),page=await ctx.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(e.message));page.on("response",r=>{if(r.status()===404)errors.push("404 "+r.url());});
  await page.goto("http://127.0.0.1:8765/"+url,{waitUntil:"networkidle"});
  await page.locator(".quest-hero").waitFor({timeout:15000});
  const css=await page.evaluate(()=>({sheet:[...document.styleSheets].some(s=>s.href?.includes("tema-unificado-v11.css")),scroll:document.documentElement.scrollWidth,hero:getComputedStyle(document.querySelector(".quest-hero")).backgroundImage}));
  verify(css.sheet,"Tema V11 no cargado "+name+" "+w);
  verify(css.scroll<=w+3,"Scroll horizontal en inicio "+name+" "+w+":"+css.scroll);
  verify(css.hero.includes("bosque-magico.webp"),"Fondo incorrecto "+name+" "+w);
  await page.screenshot({path:"qa-screenshots/v11/"+name+"-inicio-"+w+"x"+h+".png",fullPage:true});
  await page.locator('[data-action="topics"]').click();
  await page.locator(".stage-node").first().waitFor();
  const nodes=await page.locator(".stage-node").count();verify(nodes===15,"No hay 15 fases "+name+" "+w+":"+nodes);
  const map=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,art:document.querySelector(".stage-map-picture img")?.complete}));
  verify(map.scroll<=w+3,"Scroll horizontal mapa "+name+" "+w);
  await page.screenshot({path:"qa-screenshots/v11/"+name+"-mapa-"+w+"x"+h+".png",fullPage:true});
  await page.locator(".stage-node").first().click();
  verify(await page.locator(".mission-stage").count()>0,"Ejercicio no disponible "+name+" "+w);
  await page.screenshot({path:"qa-screenshots/v11/"+name+"-ejercicio-"+w+"x"+h+".png",fullPage:true});
  verify(errors.length===0,"Errores consola "+name+" "+w+":"+errors.join(";"));
  await ctx.close();
 }
 await browser.close();const report={checks,failures,sizes};
 fs.writeFileSync("qa-screenshots/v11/resultado.json",JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=1});