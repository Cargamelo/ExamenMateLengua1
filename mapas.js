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
function render(isMath,modules,stats,escape){
 const theme=isMath?"math":"lang";
 const stops=modules.map((m,i)=>{
  const v=places[m.id];if(!v)return "";
  const stat=stats(m.id),desc=stat.pending?stat.pending+" pistas para descubrir":stat.missions?stat.missions+" misiones superadas":v.short;
  return '<button type="button" class="map-location" style="--left:'+v.left+'%;--top:'+v.top+'%;--step:'+i+'" data-action="enter-world" data-topic="'+escape(m.id)+'" aria-label="Entrar en '+escape(v.name)+'. '+escape(m.sub)+'">'+
    '<span class="map-building">'+artwork(m.id,"map-building-art")+'<span class="map-play-symbol" aria-hidden="true">▶</span></span>'+
    '<span class="map-place-name"><b>'+escape(v.name)+'</b><small>'+escape(desc)+'</small></span>'+
    '<span class="map-place-medal" aria-hidden="true">'+(stat.missions?"★":"✦")+'</span></button>';
 }).join("");
 return '<section class="gameworld gameworld-'+theme+'" aria-label="Mapa ilustrado de '+(isMath?"Matemáticas":"Lengua")+'">'+
 '<div class="gameworld-sky" aria-hidden="true"><span class="sky-star sky-one">✧</span><span class="sky-star sky-two">✦</span><span class="sky-cloud cloud-one"></span><span class="sky-cloud cloud-two"></span></div>'+
 '<div class="map-artscape"><img class="map-ground-art" src="./assets/mapa-'+theme+'.svg" alt="" loading="eager" decoding="async" width="1100" height="'+(isMath?1400:1750)+'">'+
 '<div class="map-locations">'+stops+'</div>'+
 '<div class="map-character">'+character(isMath)+'<span class="map-guide-talk">'+(isMath?"¡Te esperaba! Elige un lugar para explorar.":"¡Hola, detective! ¿Qué misterio investigamos?")+'</span></div>'+
 '</div>'+
 '<p class="map-access-note">Puedes pulsar los edificios del mapa o utilizar Tab y Entrar con un teclado. Todos los mundos están disponibles.</p>'+
 '</section>';
}
function scene(topic,isMath){
const p=places[topic],name=p?.name||"Misión de aventura";
return '<div class="quest-place-scene" aria-hidden="true"><span class="quest-place-halo"></span>'+
  artwork(topic,"quest-place-art")+
  '<img class="quest-guide-art" src="./assets/guia-'+(isMath?"tiko":"nara")+'.svg" alt="" width="240" height="270" decoding="async">'+
  '<span class="quest-place-title">'+name+'</span></div>';
}
window.AventuraMapas={render,scene,artwork,places,character};
})();