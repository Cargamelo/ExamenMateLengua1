/* Pure, side-effect-free validation used by the Edge Function and Node regression suite.
   Unknown fields are preserved for compatibility; unknown schema versions are rejected. */
const plain=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const nat=x=>Number.isSafeInteger(x)&&x>=0;
const fail=()=>{throw new Error("Formato de progreso inválido")};
function bounded(x,depth=0,state={nodes:0}){
 if(++state.nodes>30000||depth>18)fail();
 if(typeof x==="number"&&!Number.isFinite(x))fail();
 if(typeof x==="string"&&x.length>15000)fail();
 if(Array.isArray(x)){if(x.length>6000)fail();for(const v of x)bounded(v,depth+1,state);}
 else if(plain(x)){const keys=Object.keys(x);if(keys.length>6000)fail();for(const k of keys){if(k.length>170)fail();bounded(x[k],depth+1,state);}}
}
function validateProgress(p,subject){
 if(p===null)return;
 if(!plain(p)||!Array.isArray(p.history)||p.history.length>5000||!Array.isArray(p.misses||[])||!Array.isArray(p.badges||[]))fail();
 for(const h of p.history){if(!plain(h)||typeof h.topic!=="string"||typeof h.ok!=="boolean")fail();}
 for(const m of p.misses||[]){if(!plain(m)||typeof m.topic!=="string")fail();}
 if(p.stageJourney!==undefined){
  const j=p.stageJourney;
  if(!plain(j)||j.version!==1||!plain(j.completed)||typeof j.finalAwarded!=="boolean")fail();
  if(j.active!==undefined&&j.active!==null&&!new RegExp("^"+subject+"-stage-(0[1-9]|1[0-5])$").test(j.active))fail();
  if(j.finalAwarded&&Object.keys(j.completed).length!==15)fail();
  for(const [id,val] of Object.entries(j.completed)){
   if(!new RegExp("^"+subject+"-stage-(0[1-9]|1[0-5])$").test(id)||!plain(val))fail();
   for(const field of ["plays","best","lastScore","lastTotal"]){
    if(val[field]!==undefined&&!nat(val[field]))fail();
   }
   if(nat(val.lastScore)&&nat(val.lastTotal)&&val.lastScore>val.lastTotal)fail();
  }
 }
 if(p.adaptive!==undefined){
  const a=p.adaptive;
  if(!plain(a)||a.version!==2||!plain(a.topics)||!plain(a.rewards)||
   !nat(a.rewards.coins)||!nat(a.rewards.completed))fail();
  for(const t of Object.values(a.topics)){
   if(!plain(t)||!Number.isSafeInteger(t.step)||t.step<0||t.step>5||!Array.isArray(t.answers)||!Array.isArray(t.needs))fail();
  }
 }
}
function validateCheckpoint(c,subject){
 if(c===null)return;
 if(!plain(c)||c.version!==2||c.subject!==subject||
   !new RegExp("^"+subject+"-stage-(0[1-9]|1[0-5])$").test(c.stageId))fail();
 const s=c.session;
 if(!plain(s)||s.stageId!==c.stageId||s.finished||!Array.isArray(s.items)||!Array.isArray(s.results)||
    !Number.isSafeInteger(s.target)||s.target<1||s.target>100||!Number.isSafeInteger(c.questionIndex)||
    c.questionIndex<0||c.questionIndex>=s.items.length||s.items.length>s.target)fail();
 if(c.answered!==null&&(!plain(c.answered)||typeof c.answered.ok!=="boolean"))fail();
 if(s.results.length!==c.questionIndex+(c.answered===null?0:1))fail();
}
export function safeProgress(value){
 if(!plain(value)||!Object.hasOwn(value,"math")||!Object.hasOwn(value,"lang"))fail();
 const out={math:value.math,lang:value.lang};
 bounded(out);
 for(const subject of ["math","lang"]){
  const item=out[subject];
  if(!plain(item)||!("progress" in item)||!("checkpoint" in item))fail();
  validateProgress(item.progress,subject);
  validateCheckpoint(item.checkpoint,subject);
 }
 const json=JSON.stringify(out);
 if(json.length>220000)throw new Error("Progreso demasiado grande");
 return JSON.parse(json);
}
