"use strict";
/* Sonido ligero para móviles: Web Audio sólo tras un gesto permitido.
   Se conservan las claves locales anteriores de activación. */
(function(){
const KEY="ligasaber-sonido-2026",VK="ligasaber-volumen-2026";
let enabled=false,volume=.32,ctx=null,master=null,last={},active=new Set(),toneCount=0;
try{enabled=localStorage.getItem(KEY)==="on";const stored=localStorage.getItem(VK);if(stored!==null){const v=Number(stored);if(Number.isFinite(v)&&v>=0&&v<=1)volume=v;}}catch(e){}
const clamp=x=>Math.max(0,Math.min(1,Number(x)||0));
function save(){try{localStorage.setItem(KEY,enabled?"on":"off");localStorage.setItem(VK,String(volume));}catch(e){}}
function isEnabled(){return enabled}
function getVolume(){return volume}
function setVolume(x){volume=clamp(x);if(master)master.gain.value=volume;save();return volume}
function setEnabled(v){
 enabled=!!v;save();
 if(!enabled){if(ctx?.state==="running")try{ctx.suspend()?.catch?.(()=>{});}catch(e){}}
 return enabled;
}
function unlock(){
 if(!enabled||volume===0)return null;
 try{
  const C=window.AudioContext||window.webkitAudioContext;
  if(!C)return null;
  if(!ctx){ctx=new C();master=ctx.createGain();master.gain.value=volume;master.connect(ctx.destination);}
  if(ctx.state==="suspended")ctx.resume()?.catch?.(()=>{});
  return ctx;
 }catch(e){return null;}
}
const P={
 click:[[480,.055,0,"sine",.17]],
 tap:[[575,.055,0,"sine",.18]],
 keypad:[[680,.04,0,"triangle",.17]],
 dock:[[375,.06,0,"triangle",.18],[600,.095,.045,"sine",.15]],
 piece:[[395,.065,0,"triangle",.16],[610,.083,.052,"sine",.15]],
 pair:[[520,.065,0,"sine",.17],[790,.12,.066,"sine",.2]],
 link:[[535,.07,0,"sine",.15],[790,.09,.075,"sine",.17]],
 select:[[550,.06,0,"sine",.15]],
 advance:[[475,.075,0,"sine",.17],[660,.095,.085,"sine",.18]],
 portal:[[390,.095,0,"triangle",.2],[525,.10,.105,"sine",.18],[790,.145,.205,"sine",.21]],
 repair:[[370,.08,0,"triangle",.17],[560,.12,.10,"sine",.16]],
 safe:[[400,.085,0,"triangle",.19],[610,.12,.07,"sine",.19],[880,.16,.19,"sine",.19]],
 train:[[280,.10,0,"triangle",.18],[405,.11,.11,"sine",.20],[660,.17,.21,"sine",.20]],
 machine:[[295,.07,0,"sawtooth",.08],[395,.08,.10,"triangle",.14],[785,.18,.20,"sine",.21]],
 detective:[[640,.09,0,"sine",.16],[890,.16,.095,"sine",.17]],
 repairText:[[490,.07,0,"triangle",.12],[710,.1,.07,"sine",.17],[950,.17,.16,"sine",.17]],
 correct:[[520,.115,0,"sine",.18],[660,.12,.125,"sine",.20],[880,.18,.25,"sine",.20]],
 incorrect:[[370,.10,0,"sine",.10],[320,.13,.13,"sine",.085]],
 star:[[785,.09,0,"sine",.19],[1045,.16,.085,"sine",.21]],
 level:[[493,.095,0,"triangle",.17],[659,.12,.11,"sine",.19],[880,.13,.24,"sine",.19],[1175,.2,.37,"sine",.20]],
 mission:[[392,.12,0,"triangle",.16],[523,.11,.135,"triangle",.18],[659,.12,.27,"sine",.18],[785,.14,.42,"sine",.18],[1045,.22,.59,"sine",.20]],
 toggle:[[650,.07,0,"sine",.16],[945,.125,.10,"sine",.17]]
};
const quiet=new Set(["click","tap","keypad","dock","piece","link","pair","select"]);
function voice(c,at,hz,duration,wave,level){
 if(active.size>=16)return;
 try{
  let osc=c.createOscillator(),gain=c.createGain();
  osc.type=wave;osc.frequency.setValueAtTime(hz,at);
  gain.gain.setValueAtTime(.0001,at);
  gain.gain.exponentialRampToValueAtTime(Math.max(.0003,level),at+.015);
  gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
  osc.connect(gain);gain.connect(master);
  active.add(osc);osc.onended=()=>{active.delete(osc);try{osc.disconnect();gain.disconnect()}catch(e){}};
  osc.start(at);osc.stop(at+duration+.015);toneCount++;
 }catch(e){}
}
function play(name){
 if(!enabled||volume<=0||!P[name])return false;
 const now=Date.now(),lastTime=last[name]||0;
 if(now-lastTime<(quiet.has(name)?48:120))return false;
 last[name]=now;
 const c=unlock();if(!c)return false;
 const at=c.currentTime+.008;
 for(const [hz,len,delay,wave,level] of P[name])voice(c,at+delay,hz,len,wave,level);
 return true;
}
function onMini(action,out,q,prior){
 if(out?.done)return;
 const s=out?.state||{},m=q?.mechanic;
 if(action==="digit"&&s.digits!==prior.digits)return play("dock");
 if(action==="pick"&&s.chosen.length>prior.chosen)return play("dock");
 if(action==="right")return play(s.linked.length>prior.linked?"pair":"incorrect");
 if(action==="left")return play("select");
 if(action==="toggle")return play("piece");
 if(action==="erase"||action==="undo")return play("tap");
 return play("click");
}
function onResult(ok,q,info){
 if(info?.changed>0)return play("level");
 if(!ok)return play("incorrect");
 const kind=q?.mechanic?.type;
 return play(({digits:"safe",machine:"machine",train:"train",race:"star",links:"pair",repair:"repairText",scene:q?.topic==="comprension"?"detective":"correct"})[kind]||"correct");
}
function onAction(action,data={}){
 if(!enabled||action==="sound"||action==="mini")return;
 const map={topics:"portal",errors:"repair","review-world":"repair","enter-world":"portal","pick-material":"portal","continue-mission":"advance",next:"advance",hint:"tap","adult-toggle":"tap",home:"click",progress:"click",material:"click","memory-flip":"select","memory-clear":"tap","memory-start":"portal",check:"select","dict-check":"select","expressive-save":"select","speak-question":"tap","dictate-sentence":"tap","dictate-all":"tap","expressive-speak":"tap"};
 // Sonidos finales se producen al conocer la respuesta, no antes.
 if(["next","check","dict-check","expressive-save"].includes(action))return;
 return play(map[action]||"click");
}
function rewardMarkup(){return '<span class="fx-starfield" aria-hidden="true">'+Array.from({length:7},(_,i)=>'<i class="fx-spark fx-spark-'+(i+1)+'">✦</i>').join("")+'</span>'}
function missionMarkup(){return '<div class="fx-mission-rays" aria-hidden="true"><span>✦</span><span>★</span><span>✦</span><span>★</span><span>✦</span></div>'}
function cleanup(){if(!ctx)return;for(const o of active){try{o.stop()}catch(e){}}active.clear();}
window.AventuraFX={isEnabled,setEnabled,getVolume,setVolume,unlock,play,onMini,onResult,onAction,rewardMarkup,missionMarkup,cleanup,_diagnostics:()=>({enabled,volume,voices:active.size,tones:toneCount,contextState:ctx?.state||"none"})};
})();