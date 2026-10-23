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
function character(isMath){return '<img class="world-guide" src="./assets/arte-v4/'+(isMath?"tiko-retrato":"nara-retrato")+'.webp" alt="" width="311" height="341" loading="lazy" decoding="async">';}
// Las coordenadas panorámicas son visuales y nunca reemplazan IDs persistentes.
const widescreenPaths={
 math:[[13,31],[26,23],[38,31],[52,22],[64,25],[77,33],[88,44],[85,58],[73,54],[61,66],[49,56],[37,70],[24,66],[35,83],[63,82]],
 lang:[[11,29],[22,38],[34,26],[46,39],[57,28],[68,39],[80,27],[88,48],[78,59],[64,55],[52,71],[40,63],[29,78],[52,85],[76,81]]
};
const smoothPath=(points)=>{if(points.length<2)return "";let s="M"+(points[0][0]*10)+","+(points[0][1]*10);for(let i=1;i<points.length;i++){let prev=points[i-1],curr=points[i],mid=[(prev[0]+curr[0])*5,(prev[1]+curr[1])*5];s+=" Q"+(prev[0]*10)+","+(prev[1]*10)+" "+mid.join(",");}let last=points[points.length-1];return s+" T"+(last[0]*10)+","+(last[1]*10);};
const pixelArtByStage={
 // Equivalencias visuales por concepto, no por el título histórico del ZIP.
 math:["m01","m03","m09","m06","m05","m07","m08","m10","m12","m13","m14","m15","m09","m07","m15"],
 lang:["l02","l03","l01","l04","l05","l06","l08","l12","l09","l01","l05","l08","l13","l15","l09"]
};
function render(isMath,stages,journey,escape){
 const theme=isMath?"math":"lang",type=theme;
 const active=window.AventuraFases.firstPending(type,journey)||stages[stages.length-1];
 const done=window.AventuraFases.completedCount(type,journey);
 const widescreenPositions=widescreenPaths[theme].map(([x,y])=>({x,y}));
 const wideGuide=widescreenPositions[active.number-1];
 const landmarks=(isMath?["numeros","descomponer","comparar","ordinales","operaciones"]:["sinonimos","antonimos","comunicacion","puntuacion","comprension","dictado","expresiva"]).map(id=>{
  const p=places[id];return '<div class="stage-landmark" style="--lx:'+p.left+'%;--ly:'+p.top+'%" aria-hidden="true">'+artwork(id,"stage-landmark-art")+'</div>';
 }).join("");
 const routePoints=stages.map(s=>(s.x*10)+","+(s.y*10)).join(" ");
 const desktopPos=stages.map(s=>[widescreenPositions[s.number-1].x,widescreenPositions[s.number-1].y]);
 const firstPending=stages.findIndex(s=>!journey.completed[s.id]);
 const routeThrough=firstPending<0?stages.length:Math.max(1,firstPending+1);
 const completePoints=stages.slice(0,routeThrough).map(s=>(s.x*10)+","+(s.y*10)).join(" ");
 const donePos=desktopPos.slice(0,routeThrough);
 const mobileRoad='<svg class="stage-road mobile-road" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><polyline class="stage-road-base" points="'+routePoints+'"/><polyline class="stage-road-done" points="'+completePoints+'"/></svg>';
 const desktopRoad='<svg class="stage-road desktop-road" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path class="stage-road-base" d="'+smoothPath(desktopPos)+'"/><path class="stage-road-done" d="'+smoothPath(donePos)+'"/></svg>';
 const road=mobileRoad+desktopRoad;
 const nodes=stages.map(s=>{
  const iconId=pixelArtByStage[theme]?.[s.number-1]||"";
  const wide=widescreenPositions[s.number-1];
  const stageArt=iconId?'<img src="./assets/pixel/iconos/'+iconId+'.webp" alt="" width="112" height="112" decoding="async" loading="lazy">':escape(s.icon);
  const complete=!!journey.completed[s.id],allowed=window.AventuraFases.canEnterStage(type,journey,s.id),selected=active.id===s.id&&!complete,cls=!allowed?"locked":selected?"active":complete?"completed":"pending";
  return '<button type="button" class="stage-node stage-'+cls+'" style="--stage-x:'+s.x+'%;--stage-y:'+s.y+'%;--stage-desktop-x:'+wide.x+'%;--stage-desktop-y:'+wide.y+'%" data-action="start-stage" data-stage="'+s.id+'" data-stage-number="'+s.number+'" aria-label="Fase '+s.number+': '+escape(s.title)+'. '+(!allowed?"Bloqueada. Completa las fases anteriores.":complete?"Completada, puedes repetirla.":selected?"Fase activa.":"Disponible.")+'" aria-disabled="'+(!allowed)+'" '+(selected?'aria-current="step"':"")+'>'+
   '<span class="stage-orb"><span class="stage-index">'+s.number+'</span><span class="stage-orb-icon" aria-hidden="true">'+stageArt+'</span><span class="stage-check" aria-hidden="true">'+(complete?"★":selected?"✦":"")+'</span></span>'+
   '<span class="stage-node-name">'+escape(s.title)+'</span>'+(allowed?'':'<span class="stage-lock-label" aria-hidden="true">🔒</span>')+'</button>';
 }).join("");
 return '<section class="gameworld gameworld-'+theme+' stage-gameworld" aria-label="Recorrido ilustrado de quince fases">'+
 '<div class="stage-map-progress" role="status"><strong>✦ '+done+' de 15 fases completadas</strong><span>Fase activa: '+active.number+' · '+escape(active.title)+'</span>'+(journey.finalAwarded?'<span class="stage-final-unlocked">★ Insignia de las quince fases ★</span>':"")+'</div>'+
 '<div class="stage-territories" aria-label="Territorios del mapa">'+(isMath?["Números","Descomposición","Comparación","Ordinales","Operaciones"]:["Sinónimos","Antónimos","Comunicación","Puntuación","Comprensión","Dictado","Lectura expresiva"]).map(t=>'<span class="stage-territory">'+escape(t)+'</span>').join("")+'</div>'+
 '<div class="gameworld-sky" aria-hidden="true"><span class="sky-star sky-one">✧</span><span class="sky-star sky-two">✦</span><span class="sky-cloud cloud-one"></span><span class="sky-cloud cloud-two"></span></div>'+
 '<div class="map-artscape stage-artscape"><picture class="stage-map-picture"><source media="(min-width: 900px)" srcset="./assets/escenarios/mapa-alta-fidelidad-'+(isMath?"matematicas":"lengua")+'.svg" type="image/svg+xml"><img class="map-ground-art" src="./assets/arte-v4/mapa-'+(isMath?"numeros":"palabras")+'.webp" alt="" loading="eager" decoding="async" width="1200" height="1900"></picture>'+
 '<div class="stage-landmarks">'+landmarks+'</div>'+road
 '<div class="stage-locations">'+nodes+'</div>'+
 '<div class="stage-hero-portrait" aria-hidden="true"><img src="./assets/arte-v4/'+(isMath?"tiko":"nara")+'-retrato.webp" alt="" width="311" height="341" loading="lazy"></div><div class="stage-guide" style="--guide-x:'+active.x+'%;--guide-y:'+active.y+'%;--guide-desktop-x:'+wideGuide.x+'%;--guide-desktop-y:'+wideGuide.y+'%" data-active-stage="'+active.id+'" aria-hidden="true"><img src="./assets/arte-v4/'+(isMath?"tiko":"nara")+'-sprite.webp" width="122" height="170" decoding="async" alt=""></div>'+
 '</div><p class="map-access-note">Completa cada fase para abrir la siguiente. Puedes repetir las anteriores. Los candados señalan las fases bloqueadas.</p></section>';
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
  '<img class="quest-place-art" src="./assets/pixel/iconos/'+({numeros:"m03",descomponer:"m05",comparar:"m07",ordinales:"m10",operaciones:"m13",sinonimos:"l01",antonimos:"l03",comunicacion:"l05",puntuacion:"l07",comprension:"l09",dictado:"l12",expresiva:"l14"}[topic]||"m01")+'.webp" alt="" width="112" height="112" decoding="async">'+
  '<img class="quest-guide-art" src="./assets/arte-v4/'+(isMath?"tiko-retrato":"nara-retrato")+'.webp" alt="" width="311" height="341" decoding="async">'+
  '<span class="quest-place-title">'+name+'</span>'+(won===null?'':'<span class="quest-guide-reaction '+(won?'guide-win':'guide-hint')+'" role="status">'+(won?'¡Misión resuelta! ✦':'¡Vamos a buscar otra pista!')+'</span>')+'</div>';
}
window.AventuraMapas={render,scene,artwork,places,character,focusStage};
})();