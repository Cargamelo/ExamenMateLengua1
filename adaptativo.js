"use strict";
/* Motor adaptativo de La Liga del Saber. Sin red, sin datos personales.
   Escalones 0-2 = intermedio; 3-5 = avanzado. Nunca hay nivel fácil. */
(function(){
const VERSION=2,MAX_STEP=5;
const clamp=n=>Math.max(0,Math.min(MAX_STEP,n));
const normalize=s=>String(s||"").trim().toLocaleLowerCase("es");
function concept(q){
 if(q.concept)return String(q.concept);
 const t=q.topic||"",v=q.variant||"";
 if(t==="descomponer")return /0/.test((q.prompt||"")+" "+(q.visual||"")+" "+(q.correct||""))?"valor-posicional-ceros":"valor-posicional";
 if(t==="numeros")return v==="a"?"escribir-cifras":v==="b"?"leer-numeros":"identificar-cifras";
 if(t==="comparar")return v==="b"?"ordenacion":v==="a"?"signos-comparacion":"mayor-menor";
 if(t==="ordinales")return v==="b"?"cardinales-ordinales":"orden-posiciones";
 if(t==="operaciones")return /resta|−/.test(q.prompt+" "+(q.visual||""))?"restas":"sumas";
 if(t==="puntuacion")return v==="c"?"punto-seguido-aparte":"mayusculas";
 if(t==="comunicacion"){const m=q.prompt.match(/el (emisor|receptor|mensaje|código|canal)/i);return m?"comunicacion-"+normalize(m[1]):"elementos-comunicacion";}
 if(t==="comprension")return "comprension-textual";
 if(t==="dictado")return "ortografia-dictado";
 if(t==="expresiva")return "lectura-en-voz-alta";
 return t+"-"+(v||"vocabulario");
}
function entry(){return {step:0,answers:[],streak:0,wrong:0,sinceChange:0,concepts:{},needs:[],missions:0};}
function init(progress,ids){
 let a=progress.adaptive;
 if(a){
  if(a.version!==VERSION||!a.topics||typeof a.topics!=="object"||Array.isArray(a.topics)||
     !a.rewards||!Number.isSafeInteger(a.rewards.coins)||a.rewards.coins<0||
     !Number.isSafeInteger(a.rewards.completed)||a.rewards.completed<0)
   throw new Error("Estado adaptativo incompatible: se conserva sin modificar");
  for(const id of ids){
   const t=a.topics[id];
   if(!t){a.topics[id]=entry();continue;}
   if(typeof t!=="object"||!Number.isSafeInteger(t.step)||t.step<0||t.step>MAX_STEP||
     !Array.isArray(t.answers)||!Array.isArray(t.needs)||!t.concepts||typeof t.concepts!=="object")
    throw new Error("Datos adaptativos incompletos: no se reinician automáticamente");
  }
  return a;
 }
 a={version:VERSION,topics:{},rewards:{coins:0,completed:0},migratedAt:Date.now()};
 ids.forEach(id=>a.topics[id]=entry());
 const history=Array.isArray(progress.history)?progress.history:[];
 for(const h of history){const v=a.topics[h.topic];if(!v)continue;const c=concept(h);let item={ok:!!h.ok,hints:Number(h.hint)||0,concept:c,step:0,date:h.date||0};v.answers.push(item);if(v.answers.length>70)v.answers.shift();const z=v.concepts[c]||(v.concepts[c]={ok:0,wrong:0,reviewed:0});if(h.ok)z.ok++;else z.wrong++;}
 const miss=Array.isArray(progress.misses)?progress.misses:[];
 for(const m of miss.slice(-60)){const v=a.topics[m.topic];if(!v)continue;const c=concept(m);let exist=v.needs.find(e=>e.concept===c);if(exist)exist.total++;else v.needs.push({concept:c,variant:m.variant||"",total:1,solved:0,fingerprints:[],last:m.time||0});}
 progress.adaptive=a;return a;
}
function topic(a,id){
 if(!a||!a.rewards||!Number.isSafeInteger(a.rewards.coins)||a.rewards.coins<0)
  throw new Error("Monedas o recompensas no válidas");
 if(!a.topics[id])a.topics[id]=entry();
 const x=a.topics[id];
 if(!Number.isSafeInteger(x.step)||x.step<0||x.step>MAX_STEP||!Array.isArray(x.answers)||!Array.isArray(x.needs))
  throw new Error("Escalón adaptativo no válido");
 return x;
}
function status(a,id){const t=topic(a,id),recent=t.answers.slice(-8),correct=recent.filter(x=>x.ok&&x.hints===0).length;
return {step:t.step,tier:t.step>=3?3:2,name:t.step>=3?"Avanzado":"Intermedio",progress:t.step/5,answered:t.answers.length,recent:recent.length,accuracy:recent.length?Math.round(correct/recent.length*100):0,pending:t.needs.length,missions:t.missions,streak:t.streak};}
function track(a,q,ok,hints=0){
 const t=topic(a,q.topic),c=concept(q),item={ok:!!ok,hints:Number(hints)||0,concept:c,step:t.step,date:Date.now()};
 t.answers.push(item);if(t.answers.length>100)t.answers.shift();t.sinceChange++;
 const clean=!!ok&&(!hints);
 t.streak=clean?t.streak+1:0;t.wrong=ok?0:t.wrong+1;
 const cs=t.concepts[c]||(t.concepts[c]={ok:0,wrong:0,reviewed:0});
 if(ok)cs.ok++;else cs.wrong++;
 let need=t.needs.find(x=>x.concept===c);
 const fingerprint=String(q.fingerprint||q.prompt||q.correct||q.variant||"").slice(0,160);
 if(!ok){if(!need){need={concept:c,variant:q.variant||"",total:0,solved:0,fingerprints:[],last:0};t.needs.push(need);}need.total++;need.solved=0;need.fingerprints=[];need.last=Date.now();need.sample={topic:q.topic,variant:q.variant||"",concept:c,prompt:String(q.prompt||"").slice(0,280),visual:String(q.visual||"").slice(0,350),correct:String(q.correct||"").slice(0,180)};}
 else if(need){if(!hints&&!need.fingerprints.includes(fingerprint)){need.solved++;need.fingerprints.push(fingerprint);cs.reviewed++;}if(need.solved>=3)t.needs=t.needs.filter(x=>x!==need);}
 const last=t.answers.slice(-8),good=last.filter(x=>x.ok&&x.hints===0).length/last.length;
 let changed=0;
 if(t.sinceChange>=5&&last.length>=6&&(t.streak>=4&&good>=.80||(last.length>=8&&good>=.85))){if(t.step<MAX_STEP){t.step++;changed=1;t.sinceChange=0;t.streak=0;t.wrong=0;}}
 else if(t.sinceChange>=5&&(t.wrong>=3||(last.length>=8&&good<.60))){if(t.step>0){t.step--;changed=-1;t.sinceChange=0;t.streak=0;t.wrong=0;}else{t.sinceChange=0;}}
 if(changed>0){a.rewards.coins=(a.rewards.coins||0)+3;}
 if(ok){a.rewards.coins=(a.rewards.coins||0)+1;}
 return {changed,step:t.step,concept:c,needs:t.needs.length};
}
function finishMission(a,id,score){const t=topic(a,id);t.missions++;a.rewards.completed=(a.rewards.completed||0)+1;if(score>=4)a.rewards.coins=(a.rewards.coins||0)+4;}
function pending(a){return Object.entries(a.topics).flatMap(([id,t])=>t.needs.map(n=>({...n,topic:id}))).sort((x,y)=>y.last-x.last);}
function reset(a){a.rewards={coins:0,completed:0};for(const id of Object.keys(a.topics))a.topics[id]=entry();}
window.AventuraAdaptive={VERSION,init,topic,status,track,pending,concept,finishMission,reset};
})();