"use strict";
/* Interacciones y efectos sonoros sin archivos externos ni reproducción automática.
   La Web Audio API solo se inicializa tras la pulsación explícita del jugador. */
(function(){
const STORAGE="ligasaber-sonido-2026";
let enabled=false,volume=.32,ctx=null,last=0;
try{enabled=localStorage.getItem(STORAGE)==="on";}catch(e){}
function save(){try{localStorage.setItem(STORAGE,enabled?"on":"off");}catch(e){}}
function isEnabled(){return enabled;}
function setEnabled(value){enabled=!!value;save();if(!enabled&&ctx&&ctx.state==="running")try{ctx.suspend();}catch(e){}return enabled;}
function audioContext(){
 if(!enabled)return null;
 try{
   const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
   if(!ctx)ctx=new C();
   if(ctx.state==="suspended"){const promise=ctx.resume();promise?.catch?.(()=>{});}
   return ctx;
 }catch(e){return null;}
}
function note(context,at,hz,duration=.11,wave="sine",gain=.12){
 try{
  const o=context.createOscillator(),v=context.createGain();
  o.type=wave;o.frequency.setValueAtTime(hz,at);
  v.gain.setValueAtTime(.0001,at);
  v.gain.exponentialRampToValueAtTime(Math.max(.0002,gain*volume),at+.014);
  v.gain.exponentialRampToValueAtTime(.0001,at+duration);
  o.connect(v);v.connect(context.destination);o.start(at);o.stop(at+duration+.012);
 }catch(e){}
}
const PROFILES={
 click:[[460,.055,0,"sine",.065]],
 tap:[[590,.06,0,"sine",.075]],
 keypad:[[560,.045,0,"triangle",.068]],
 piece:[[390,.075,0,"triangle",.09],[620,.075,.055,"sine",.075]],
 link:[[540,.07,0,"sine",.08],[820,.095,.07,"sine",.09]],
 select:[[510,.07,0,"sine",.075]],
 advance:[[480,.075,0,"sine",.08],[680,.095,.085,"sine",.09]],
 portal:[[392,.10,0,"triangle",.13],[523,.10,.095,"sine",.11],[784,.16,.20,"sine",.12]],
 repair:[[370,.09,0,"triangle",.09],[550,.13,.095,"sine",.075]],
 correct:[[523,.12,0,"sine",.13],[659,.12,.12,"sine",.14],[880,.20,.24,"sine",.12]],
 incorrect:[[390,.10,0,"sine",.07],[325,.14,.12,"sine",.055]],
 star:[[780,.075,0,"sine",.09],[1046,.17,.08,"sine",.11]],
 level:[[494,.1,0,"triangle",.11],[659,.12,.10,"sine",.12],[880,.12,.23,"sine",.13],[1175,.20,.36,"sine",.12]],
 mission:[[392,.12,0,"triangle",.105],[523,.11,.13,"triangle",.105],[659,.12,.27,"sine",.105],[784,.13,.42,"sine",.105],[1046,.24,.59,"sine",.105]],
 toggle:[[620,.07,0,"sine",.09],[930,.12,.09,"sine",.08]]
};
function play(name){
 if(!enabled)return false;
 const now=Date.now(),tiny=["click","tap","keypad","select","piece","link"];
 if(tiny.includes(name)&&now-last<50)return false;
 last=now;
 const c=audioContext();if(!c)return false;
 const start=c.currentTime+.006;
 for(const [hz,len,delay,wave,gain] of PROFILES[name]||PROFILES.click)note(c,start+delay,hz,len,wave,gain);
 return true;
}
function onAction(action,detail={}){
 if(!enabled||action==="sound")return;
 if(action==="topics")return play("portal");
 if(action==="errors"||action==="review-world")return play("repair");
 if(action==="enter-world"||action==="pick-material")return play("portal");
 if(action==="continue-mission")return play("advance");
 if(action==="mini"){
   if(detail.mini==="digit")return play("keypad");
   if(detail.mini==="pick"||detail.mini==="right"||detail.mini==="toggle")return play("piece");
   if(detail.mini==="left")return play("select");
   if(detail.mini==="erase"||detail.mini==="undo")return play("tap");
   return;
 }
 if(["choose","next","check","dict-check","expressive-save"].includes(action))return;
 if(["dictate-sentence","dictate-all","expressive-speak","speak-question"].includes(action))return play("tap");
 if(["hint","adult-toggle","memory-flip","memory-clear","home","progress","material"].includes(action))return play("click");
 return play("tap");
}
function rewardMarkup(){
 return '<span class="fx-starfield" aria-hidden="true">'+Array.from({length:7},(_,i)=>'<i class="fx-spark fx-spark-'+(i+1)+'">✦</i>').join("")+'</span>';
}
function missionMarkup(){
 return '<div class="fx-mission-rays" aria-hidden="true"><span>✦</span><span>★</span><span>✦</span><span>★</span><span>✦</span></div>';
}
function cleanup(){
 if(window.speechSynthesis?.speaking){} // Los efectos no interrumpen la voz.
}
window.AventuraFX={isEnabled,setEnabled,play,onAction,rewardMarkup,missionMarkup,cleanup};
})();