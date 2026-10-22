"use strict";
/* Configuración del recorrido, independiente del contenido y del algoritmo adaptativo. */
(function(){
const raw={
math:[
["La puerta de los números","numeros","a,b","🔢"],
["Las torres de las cifras","numeros","c","🏰"],
["La caja fuerte secreta","numeros","a","🔐"],
["La montaña de los millares","descomponer","a,b","⛰️"],
["Los cristales del cero","descomponer","a,c","💎"],
["El puente de los gigantes","comparar","a,c","🌉"],
["El camino ordenado","comparar","b","🚂"],
["El castillo de las posiciones","ordinales","a,b","🏯"],
["La carrera del podio","ordinales","c","🏅"],
["La fábrica de sumas","operaciones","a,b,c,d","➕","+",null],
["El taller de las restas","operaciones","a,b,c,d","➖","−",null],
["Los engranajes mágicos","operaciones","a,b,c,d","⚙️"],
["La cámara de los enigmas","numeros,descomponer","a,b,c","🗝️"],
["El gran desafío matemático","comparar,operaciones","a,b,c,d","🧩"],
["El castillo de la gran estrella","numeros,descomponer,comparar,ordinales,operaciones","a,b,c,d","🌟"]
],
lang:[
["El laboratorio de las palabras","sinonimos","a,b","🔤"],
["El bosque de los contrarios","antonimos","a,b","🌳"],
["Los cristales amigos","sinonimos","a,b","💎"],
["El sendero de los opuestos","antonimos","a,b","🧭"],
["La agencia de mensajes","comunicacion","a,b","✉️"],
["El correo misterioso","comunicacion","a,b","📨"],
["El taller de las mayúsculas","puntuacion","a,b","✒️"],
["El pergamino de los puntos","puntuacion","c","📜"],
["La biblioteca secreta","comprension","a","📚",null,"comprension"],
["El cofre de las palabras","sinonimos,antonimos","a,b","🗝️"],
["La central de comunicación","comunicacion","a,b","📡"],
["La imprenta encantada","puntuacion","a,b,c","🖨️"],
["La sala de los dictados","dictado","a","🎧",null,"dictado"],
["El teatro de las voces","expresiva","a","🎭",null,"expresiva"],
["El gran misterio final","sinonimos,antonimos,comunicacion,puntuacion","a,b,c","🔍"]
]};
const POSITIONS={
 math:[[39,8],[60,14],[39,20],[60,26],[39,32],[60,38],[39,44],[60,50],[39,56],[60,62],[39,68],[60,74],[39,80],[60,86],[39,92]],
 lang:[[40,6],[60,12.3],[40,18.6],[60,24.9],[40,31.2],[60,37.5],[40,43.8],[60,50.1],[40,56.4],[60,62.7],[40,69],[60,75.3],[40,81.6],[60,87.9],[40,94.2]]
};
const catalogs={};
for(const type of ["math","lang"]){
 catalogs[type]=raw[type].map((entry,i)=>{
 const [title,topics,variants,icon,sign=null,special=null]=entry,[x,y]=POSITIONS[type][i];
 return Object.freeze({id:type+"-stage-"+String(i+1).padStart(2,"0"),number:i+1,title,topics:topics.split(","),variants:variants.split(","),icon,sign,special,x,y});
 });
 Object.freeze(catalogs[type]);
}
const getStages=type=>catalogs[type]||[];
const getStage=(type,id)=>getStages(type).find(s=>s.id===id)||null;
function init(progress,type){
 let j=progress.stageJourney;
 if(!j){
  j={version:1,active:getStages(type)[0].id,completed:{},finalAwarded:false,previous:null};
  progress.stageJourney=j;
 }else if(j.version!==1||!j.completed||typeof j.completed!=="object"||Array.isArray(j.completed)){
  throw new Error("Versión de progreso incompatible: se conserva sin modificar");
 }
 j.active=firstPending(type,j)?.id||getStages(type)[getStages(type).length-1].id;
 return j;
}
const completedCount=(type,j)=>getStages(type).filter(s=>!!j.completed[s.id]).length;
/* Nunca dar acceso por el estado visual de un botón: el recorrido se comprueba en el motor. */
function firstPending(type,j){
 const stages=getStages(type);
 return stages.find(s=>!j.completed[s.id])||null;
}
function canEnterStage(type,j,id){
 const stage=getStage(type,id),pending=firstPending(type,j);
 if(!stage||!j||!j.completed||!Array.isArray(getStages(type)))return false;
 return !pending||stage.number<=pending.number;
}
function status(j,id,type){
 const stages=type?getStages(type):[...getStages("math"),...getStages("lang")];
 const stage=stages.find(s=>s.id===id);
 const pending=stages.find(s=>!j.completed[s.id]);
 if(!stage)return "locked";
 if(pending&&stage.number>pending.number)return "locked";
 return j.completed[id]?"completed":pending?.id===id?"active":"pending";
}
function activate(type,j,id){
 if(!canEnterStage(type,j,id))return false;
 j.previous=j.active;
 j.active=firstPending(type,j)?.id||id;
 return true;
}
function complete(type,j,id,score,total){
 const s=getStage(type,id);
 if(!s||!canEnterStage(type,j,id)||!Number.isSafeInteger(total)||total<1||total>100||
  !Number.isSafeInteger(score)||score<0||score>total)return null;
 const existed=!!j.completed[id],entry=j.completed[id]||{plays:0,best:0};
 if(!Number.isSafeInteger(entry.plays)||entry.plays<0||entry.plays>=Number.MAX_SAFE_INTEGER)return null;
 entry.plays++;entry.best=Math.max(Number(entry.best)||0,score);
 entry.lastScore=score;entry.lastTotal=total;entry.lastAt=Date.now();
 j.completed[id]=entry;j.previous=id;
 const next=firstPending(type,j);
 j.active=next?.id||id;
 const justAwarded=completedCount(type,j)===15&&!j.finalAwarded;
 if(justAwarded)j.finalAwarded=true;
 return {first:!existed,next,justAwarded,finalAwarded:j.finalAwarded,completed:completedCount(type,j)};
}
function message(type,number,perfect=false,completed=0){
 if(completed===15)return "¡Has recorrido las quince fases! Tu esfuerzo ha hecho brillar todo el mapa.";
 if(perfect)return type==="math"?"¡Fantástico! Has resuelto todos los retos. ¡Tu estrella brilla con fuerza!":"¡Fantástico, detective! Has resuelto todas las pistas de esta fase.";
 const msgs=type==="math"?[
 "¡Misión superada! Has avanzado un paso más por el reino de los números.",
 "¡Buen trabajo! Las cifras esconden nuevas aventuras.",
 "¡Qué gran esfuerzo! Cada reto te ayuda a seguir descubriendo.",
 "¡Una fase más en el mapa! Vamos a explorar la siguiente.",
 "¡El camino de los números sigue abierto para ti!"
 ]:[
 "¡Buen trabajo, detective! Tu investigación continúa.",
 "¡Fase superada! Has encontrado nuevas pistas de las palabras.",
 "¡Una estrella más para tu aventura de Lengua!",
 "¡Cada reto enseña algo! Hay más misterios por explorar.",
 "¡Tu esfuerzo ha hecho brillar esta fase!"
 ];
 return msgs[(number-1)%msgs.length];
}
window.AventuraFases={getStages,getStage,init,status,firstPending,canEnterStage,activate,complete,completedCount,message};
})();