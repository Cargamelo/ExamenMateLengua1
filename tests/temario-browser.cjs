"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),{chromium}=require("playwright-core");
const chrome=["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"].find(fs.existsSync);
if(!chrome)throw Error("Chromium no disponible");
const c={window:{}};vm.runInNewContext(fs.readFileSync("lengua-temario.js","utf8"),c);
const qs=c.window.LigaTemarioLengua.questions,shard=+process.env.TEM_SHARD||0,shards=+process.env.TEM_SHARDS||12;
const selected=qs.filter((q,i)=>i%shards===shard),folder="qa-temario";fs.mkdirSync(folder,{recursive:true});
const sizes=[[360,640],[390,844],[768,1024],[1024,768],[1366,768],[1920,1080],[2560,1440]];
const results=[];
function bootstrap(q){
 const stage=q.topic==="sinonimos"?1:q.topic==="antonimos"?2:11;
 const active="lang-stage-"+String(stage).padStart(2,"0"),completed={};
 for(let n=1;n<stage;n++)completed["lang-stage-"+String(n).padStart(2,"0")]={plays:1,best:1,lastScore:1,lastTotal:15};
 if(!sessionStorage.getItem("temario-synthetic")){
  localStorage.setItem("ligasaber-2026-lang",JSON.stringify({history:[],misses:[],badges:[],lastDate:"",
   stageJourney:{version:1,active,completed,finalAwarded:false,previous:null},
   adaptive:{version:2,rewards:{coins:0,completed:0},topics:{[q.topic]:{step:q.minStep,answers:[],streak:0,wrong:0,sinceChange:0,concepts:{},needs:[],missions:0}}}}));
  sessionStorage.setItem("temario-synthetic","1");
 }
 Object.defineProperty(window,"LigaTemarioLengua",{configurable:true,set(actual){
  const realPick=actual.pick.bind(actual);
  Object.defineProperty(window,"LigaTemarioLengua",{configurable:false,value:{...actual,
   pick(topic,options){if(topic!==q.topic)return realPick(topic,options);
    if(options.stage!==stage)return realPick(topic,options);
    if((options.step??0)<q.minStep)throw Error("Nivel no alcanzable: "+q.id);
    window.__temarioSelected=(window.__temarioSelected||0)+1;
    return {...actual.questions.find(x=>x.id===q.id),fingerprint:q.id};}}});
 }});
}
async function answer(page,q,correct){
 if(q.type==="text"){
  await page.locator("#response").fill(correct?q.correct:"respuesta errónea");
  await page.locator('[data-action="check"]').click();
 }else if(q.type==="choice"){
  const choices=(await page.locator('[data-mini="choose"]').allTextContents()).map(s=>s.trim());
  const idx=choices.indexOf(q.correct);
  await page.locator('[data-mini="choose"]').nth(correct?idx:choices.findIndex((_,i)=>i!==idx)).click();
 }else if(q.type==="fill"){
  for(let i=0;i<q.answers.length;i++)await page.locator("[data-varied-input]").nth(i).fill(correct?q.answers[i]:i?"respuesta incorrecta":"sin sentido");
  await page.locator('[data-mini="submit-fields"]').click();
  if(!correct){assert.ok(await page.locator(".varied-field-feedback").count(),"Falta ayuda por campo "+q.id);
   await page.locator('[data-mini="submit-fields"]').click();}
 }else if(q.type==="matching"){
  const left=(await page.locator('[data-mini="left"]').allTextContents()).map(s=>s.trim());
  const right=(await page.locator('[data-mini="right"]').allTextContents()).map(s=>s.trim());
  if(!correct){
   await page.locator('[data-mini="left"]').first().click();
   await page.locator('[data-mini="right"]').nth(right.findIndex(v=>v!==q.pairs.find(p=>p[0]===left[0])[1])).click();
  }
  for(let i=0;i<left.length;i++){
   const expected=q.pairs.find(p=>p[0]===left[i])?.[1],j=right.indexOf(expected);
   assert.ok(j>=0,q.id);
   await page.locator('[data-mini="left"]').nth(i).click();
   await page.locator('[data-mini="right"]').nth(j).click();
  }
 }else if(q.type==="classification"){
  for(let i=0;i<q.items.length;i++){
   const k=q.groups.indexOf(q.items[i][1]),chosen=correct||i?k:1-k;
   await page.locator('[data-mini="classify"][data-value="'+i+':'+chosen+'"]').click();
  }
  await page.locator('[data-mini="verify-classification"]').click();
 }else if(q.type==="multi"){
  const indexes=correct?q.correctIndexes:[q.options.findIndex((_,i)=>!q.correctIndexes.includes(i))];
  for(const i of indexes)await page.locator('[data-mini="toggle-multi"][data-value="'+i+'"]').click();
  await page.locator('[data-mini="verify-multi"]').click();
 }else if(q.type==="rewrite"){
  await page.locator("#varied-writing").fill(correct?q.original.replace(q.from,q.to):q.original);
  await page.locator("#varied-review").check();
  await page.locator('[data-mini="verify-rewrite"]').click();
 }else throw Error("Tipo no probado "+q.type);
 const response=page.locator(".feedback[role=status]");await response.waitFor({timeout:9000});
 assert.equal(await response.evaluate(x=>x.classList.contains("ok")),correct,q.id+" corrección");
 assert.ok((await response.innerText()).includes(q.explanation),q.id+" explicación");
}
async function test(browser,q,correct,i){
 const [width,height]=sizes[(i+shard)%sizes.length];
 const context=await browser.newContext({viewport:{width,height},hasTouch:width<=768,isMobile:width<=390});
 const page=await context.newPage();page.setDefaultTimeout(11000);
 const record={id:q.id,type:q.type,topic:q.topic,scenario:correct?"correct":"incorrect",size:width+"x"+height,status:"FALLIDA"};
 const exceptions=[];page.on("pageerror",e=>exceptions.push(e.message));
 try{
  await page.addInitScript(bootstrap,q);
  await page.goto("http://127.0.0.1:8765/lengua-sda1.html",{waitUntil:"domcontentloaded"});
  await page.locator('[data-action="topics"]').first().click();
  const phase=q.topic==="sinonimos"?1:q.topic==="antonimos"?2:11;
  await page.locator('[data-action="start-stage"][data-stage="lang-stage-'+String(phase).padStart(2,"0")+'"]').click();
  assert.equal(await page.locator(".q-title").innerText(),q.prompt,q.id+" no apareció en juego real");
  assert.equal(await page.evaluate(()=>window.__temarioSelected),1);
  await page.locator('[data-action="hint"]').click();
  assert.ok((await page.locator(".help-text").innerText()).includes(q.hint1));
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator('[data-action="resume-stage"]').click();
  assert.equal(await page.locator(".q-title").innerText(),q.prompt,"Checkpoint de reto incorrecto");
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem("ligasaber-2026-lang")).history.length);
  await answer(page,q,correct);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem("ligasaber-2026-lang")));
  assert.equal(saved.history.length,before+1);
  assert.equal(saved.history.at(-1).fingerprint,q.id);
  assert.equal(saved.history.at(-1).ok,correct);
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator('[data-action="resume-stage"]').click();
  assert.equal(await page.locator(".feedback").evaluate(x=>x.classList.contains("ok")),correct);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem("ligasaber-2026-lang")).history.length),saved.history.length);
  await page.locator('[data-action="next"]').click();
  assert.ok(await page.locator(".q-title").count(),"No avanza");
  assert.deepEqual(exceptions,[],"Errores JS");
  record.status="VALIDADA";
 }catch(e){record.error=String(e.stack||e);try{await page.screenshot({path:folder+"/"+q.id+"-"+record.scenario+".png",fullPage:true,timeout:2500})}catch{}}
 finally{await context.close();results.push(record);}
 console.log(q.id+" "+record.scenario+" "+record.status);
}
(async()=>{const browser=await chromium.launch({executablePath:chrome,headless:true,args:["--no-sandbox"]});
try{for(let i=0;i<selected.length;i++)for(const correct of [true,false])await test(browser,selected[i],correct,i);}finally{await browser.close();}
fs.writeFileSync(folder+"/grupo-"+shard+".json",JSON.stringify({shard,results},null,2));
const failed=results.filter(r=>r.status!=="VALIDADA");
console.log("TEMARIO BROWSER "+JSON.stringify({shard,executed:results.length,failed:failed.length}));
for(const x of failed)console.error(x.id+" "+x.error?.slice(0,800));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=1});
