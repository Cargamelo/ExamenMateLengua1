"use strict";
/* Mapas de aventura 2D originales. El fondo no contiene zonas vacías clicables:
   cada edificio visible forma parte de su propio botón accesible. */
(function(){
const places={
 numeros:{name:"Castillo de los números",left:25,top:15.5,short:"Torres de cifras"},
 descomponer:{name:"Montaña de la descomposición",left:70.9,top:29,short:"Cristales de valor"},
 comparar:{name:"Puente de las comparaciones",left:26.4,top:46.5,short:"Vagones y puentes"},
 ordinales:{name:"Castillo de los ordinales",left:71.8,top:65,short:"Carreras y podios"},
 operaciones:{name:"Ciudad de las operaciones",left:29,top:83,short:"Máquinas y engranajes"},
 sinonimos:{name:"Laboratorio de sinónimos",left:27,top:11.2,short:"Cristales amigos"},
 antonimos:{name:"Bosque de los antónimos",left:73,top:24.3,short:"Las palabras opuestas"},
 comunicacion:{name:"Agencia de comunicación",left:27.7,top:39,short:"Mensajes y pistas"},
 puntuacion:{name:"Taller de escritura",left:72,top:51.5,short:"Imprenta mágica"},
 comprension:{name:"Biblioteca de misterios",left:27,top:66,short:"Historias ocultas"},
 dictado:{name:"Estudio de dictados",left:73,top:79,short:"Voces y letras"},
 expresiva:{name:"Teatro de las voces",left:32,top:91.5,short:"Un escenario para leer"}
};
const pathFor=id=>"./assets/lugar-"+id+".svg";
function artwork(id,cls=""){return '<img class="'+cls+'" src="'+pathFor(id)+'" alt="" width="240" height="210" loading="lazy" decoding="async">';}
function character(isMath){return '<img class="world-guide" src="./assets/guia-'+(isMath?"tiko":"nara")+'.svg" alt="" width="240" height="270" loading="lazy" decoding="async">';}
const pixelArtByStage={
 math:["m01","m02","m03","m04","m05","m07","m08","m10","m11","m13","m14","m15","m06","m09","m15"],
 lang:["l01","l03","l02","l04","l05","l06","l07","l08","l09","l02","l06","l08","l12","l14","l11"]
};
function render(isMath,stages,journey,escape){
 const theme=isMath?"math":"lang",type=theme;
 const active=stages.find(s=>s.id===journey.active)||stages[0];
 const done=window.AventuraFases.completedCount(type,journey);
 const landmarks=(isMath?["numeros","descomponer","comparar","ordinales","operaciones"]:["sinonimos","antonimos","comunicacion","puntuacion","comprension","dictado","expresiva"]).map(id=>{
  const p=places[id];return '<div class="stage-landmark" style="--lx:'+p.left+'%;--ly:'+p.top+'%" aria-hidden="true">'+artwork(id,"stage-landmark-art")+'</div>';
 }).join("");
 const routePoints=stages.map(s=>(s.x*10)+","+(s.y*10)).join(" ");
 const firstPending=stages.findIndex(s=>!journey.completed[s.id]);
 const routeThrough=firstPending<0?stages.length:Math.max(1,firstPending+1);
 const completePoints=stages.slice(0,routeThrough).map(s=>(s.x*10)+","+(s.y*10)).join(" ");
 const road='<svg class="stage-road" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><polyline class="stage-road-base" points="'+routePoints+'"/><polyline class="stage-road-done" points="'+completePoints+'"/></svg>';
 const nodes=stages.map(s=>{
  const iconId=pixelArtByStage[theme]?.[s.number-1]||"";
  const stageArt=iconId?'<img src="./assets/pixel/iconos/'+iconId+'.webp" alt="" width="112" height="112" decoding="async" loading="lazy">':escape(s.icon);
  const complete=!!journey.completed[s.id],selected=journey.active===s.id,cls=selected?"active":complete?"completed":"pending";
  return '<button type="button" class="stage-node stage-'+cls+'" style="--stage-x:'+s.x+'%;--stage-y:'+s.y+'%" data-action="start-stage" data-stage="'+s.id+'" data-stage-number="'+s.number+'" aria-label="Fase '+s.number+': '+escape(s.title)+'. '+(complete?"Completada, puedes repetirla.":selected?"Fase activa.":"Disponible.")+'" '+(selected?'aria-current="step"':"")+'>'+
   '<span class="stage-orb"><span class="stage-index">'+s.number+'</span><span class="stage-orb-icon" aria-hidden="true">'+stageArt+'</span><span class="stage-check" aria-hidden="true">'+(complete?"★":selected?"✦":"")+'</span></span>'+
   '<span class="stage-node-name">'+escape(s.title)+'</span></button>';
 }).join("");
 return '<section class="gameworld gameworld-'+theme+' stage-gameworld" aria-label="Recorrido ilustrado de quince fases">'+
 '<div class="stage-map-progress" role="status"><strong>✦ '+done+' de 15 fases completadas</strong><span>Fase activa: '+active.number+' · '+escape(active.title)+'</span>'+(journey.finalAwarded?'<span class="stage-final-unlocked">★ Insignia de las quince fases ★</span>':"")+'</div>'+
 '<div class="gameworld-sky" aria-hidden="true"><span class="sky-star sky-one">✧</span><span class="sky-star sky-two">✦</span><span class="sky-cloud cloud-one"></span><span class="sky-cloud cloud-two"></span></div>'+
 '<div class="map-artscape stage-artscape"><picture class="map-ground-picture"><source media="(max-width:700px)" srcset="./assets/pixel/mapa-'+(isMath?"matematicas":"lengua")+'.webp"><img class="map-ground-art" src="./assets/pixel/mapa-'+(isMath?"matematicas":"lengua")+'.webp" alt="" loading="eager" decoding="async" width="1100" height="'+(isMath?1400:1750)+'"></picture>'+
 '<div class="stage-landmarks">'+landmarks+'</div>'+road+
 '<div class="stage-locations">'+nodes+'</div>'+
 '<div class="stage-guide" style="--guide-x:'+active.x+'%;--guide-y:'+active.y+'%" data-active-stage="'+active.id+'" aria-hidden="true"><img src="./assets/guia-'+(isMath?"tiko":"nara")+'.svg" width="240" height="270" decoding="async" alt=""></div>'+
 '</div><p class="map-access-note">Todas las fases están disponibles. Pulsa una casilla o utiliza Tab y Entrar. Las estrellas indican fases completadas.</p></section>';
}
function focusStage(id,previous=null){
 const item=document.querySelector?.('[data-action="start-stage"][data-stage="'+id+'"]');
 const guide=document.querySelector?.(".stage-guide");
 if(previous&&previous!==id&&guide){
  const from=document.querySelector?.('[data-action="start-stage"][data-stage="'+previous+'"]');
  if(from&&item&&typeof from.getBoundingClientRect==="function"){
   const old=from.getBoundingClientRect(),next=item.getBoundingClientRect();
   guide.style?.setProperty?.("--travel-x",(old.left+old.width/2-next.left-next.width/2)+"px");
   guide.style?.setProperty?.("--travel-y",(old.top+old.height/2-next.top-next.height/2)+"px");
   guide.classList?.add?.("guide-travelling");
  }
 }
 if(item&&typeof window!=="undefined"&&typeof window.matchMedia==="function"&&window.matchMedia("(max-width:700px)").matches){
  try{item.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"instant":"smooth",block:"center"});}catch(e){}
 }
}
function scene(topic,isMath,won=null){
const p=places[topic],name=p?.name||"Misión de aventura";
return '<div class="quest-place-scene" aria-hidden="true"><span class="quest-place-halo"></span>'+
  artwork(topic,"quest-place-art")+
  '<img class="quest-guide-art" src="./assets/guia-'+(isMath?"tiko":"nara")+'.svg" alt="" width="240" height="270" decoding="async">'+
  '<span class="quest-place-title">'+name+'</span>'+(won===null?'':'<span class="quest-guide-reaction '+(won?'guide-win':'guide-hint')+'" role="status">'+(won?'¡Misión resuelta! ✦':'¡Vamos a buscar otra pista!')+'</span>')+'</div>';
}
window.AventuraMapas={render,scene,artwork,places,character,focusStage};
})();