"use strict";
const {chromium}=require("playwright-core"),fs=require("fs");
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"/usr/bin/chromium",args:["--no-sandbox","--disable-gpu"]});
 fs.mkdirSync("preview-v7",{recursive:true});const summary=[];
 for(const [width,height] of [[1920,1080],[390,844]]){
 const context=await browser.newContext({viewport:{width,height},serviceWorkers:"block",reducedMotion:"reduce"});
 const page=await context.newPage();const errs=[];page.on("pageerror",e=>errs.push(e.message));
 const base="http://127.0.0.1:8765/";
 await page.goto(base+"index.html",{waitUntil:"domcontentloaded"});
 await page.locator(".pixel-portal.math").waitFor();
 await page.screenshot({path:"preview-v7/01-portada-"+width+".png",fullPage:true,animations:"disabled"});
 await page.locator('[data-liga-open="collection"]').click();
 await page.locator(".pixel-card-tile").first().waitFor();
 await page.screenshot({path:"preview-v7/05-coleccion-"+width+".png",fullPage:true,animations:"disabled"});
 await page.locator(".pixel-card-tile").first().click();
 await page.screenshot({path:"preview-v7/05-detalle-"+width+".png",fullPage:true,animations:"disabled"});
 for(const [subject,file] of [["matematicas","matematicas-sda1.html"],["lengua","lengua-sda1.html"]]){
 await page.goto(base+file,{waitUntil:"domcontentloaded"});
 await page.locator('[data-action="topics"]').waitFor();
 await page.locator('[data-action="topics"]').click();
 await page.locator(".stage-node").first().waitFor();
 await page.locator(".map-ground-art").evaluate(img=>img.decode().catch(()=>{}));
 await page.screenshot({path:"preview-v7/0"+(subject==="matematicas"?2:3)+"-mapa-"+subject+"-"+width+".png",fullPage:true,animations:"disabled"});
 await page.locator(".stage-node").first().click();
 await page.locator(".mission-stage").waitFor();
 await page.screenshot({path:"preview-v7/04-ejercicio-"+subject+"-"+width+".png",fullPage:true,animations:"disabled"});
 summary.push({width,subject,nodes:await page.locator(".stage-node").count(),errors:errs});
 }await context.close();
 }
 await browser.close();fs.writeFileSync("preview-v7/estado.json",JSON.stringify(summary,null,2));
})().catch(e=>{console.error(e.stack);process.exitCode=1});
