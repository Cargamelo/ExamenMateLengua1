"use strict";(function(){
const rnd=n=>Math.floor(Math.random()*n),shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a},esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
function enrich(q,D,step=0){
 q={...q};const t=q.topic,v=q.variant;let m=null;
 if((t==="numeros"||t==="descomponer")&&v==="a"){m={type:"digits",target:q.correct.replace(/[.\s]/g,"").padStart(4,"0"),labels:["UM","C","D","U"]};q.concept=t==="numeros"?"escribir-cifras":m.target.includes("0")?"valor-posicional-ceros":"valor-posicional";q.prompt=t==="numeros"?"Abre la caja fuerte construyendo el número":"Construye con cifras el número de los bloques";}
 else if(t==="comparar"&&v==="b"){const a=q.visual.split(" · ");if(a.length===4)m={type:"train",values:a,correct:q.correct.split(" → ")};}
 else if(t==="ordinales"&&v==="c"){const a=q.visual.match(/(?:^|\s)\d+\.\s*([^\s]+)/gu)?.map(x=>x.replace(/^\s*\d+\.\s*/,""))||[];if(a.length===10)m={type:"race",values:a};}
 else if(t==="operaciones"){if(q.numeric||v==="c")m={type:"machine",target:q.correct.replace(/[.\s]/g,"")};q.concept=q.concept||(q.visual.includes("−")?"restas":"sumas");}
 else if(t==="sinonimos"||t==="antonimos"){const a=shuffle(t==="sinonimos"?D.synonyms:D.antonyms),pairs=[],used=new Set();for(const [x,y] of a){if(used.has(x)||used.has(y))continue;pairs.push([x,y]);used.add(x);used.add(y);if(pairs.length===(step>=5?5:step>=3?4:3))break;}if(pairs.length>=3){m={type:"links",pairs,left:pairs.map(x=>x[0]),right:shuffle(pairs.map(x=>x[1]))};q.prompt=t==="sinonimos"?"Une las palabras amigas":"Encuentra las parejas contrarias";q.correct=pairs.length+" parejas conectadas";q.explanation="Cada pareja tiene un significado "+(t==="sinonimos"?"parecido.":"contrario.");q.concept=t+"-parejas";q.fingerprint=pairs.map(p=>p.join("=")).join("|");}}
 else if(t==="puntuacion"&&v==="a"){const parts=q.visual.match(/\s+|\S+/g)||[],orig=q.correct.match(/\s+|\S+/g)||[];if(parts.length===orig.length){const target=[];parts.forEach((x,i)=>{if(x!==orig[i]&&/^[a-záéíóúñ]/u.test(x))target.push(i)});if(target.length){m={type:"repair",parts,target};q.prompt="Repara las mayúsculas del pergamino";q.concept="mayusculas";}}}
 else if(t==="comparar"&&v==="a")m={type:"scene",values:["<","=",">"]};
 else if(t==="puntuacion"&&v==="c")m={type:"scene",values:["punto y seguido","punto y aparte"]};
 else if(t==="comunicacion"&&step>=4){const row=D.communications.find(x=>x[0]===q.visual);const idx=step>=5?[1,2,3,5]:[1,2,5];if(row){const names=idx.map(i=>({1:"Emisor",2:"Receptor",3:"Mensaje",5:"Canal"}[i]));const pairs=idx.map((i,j)=>[names[j],row[i]]);if(new Set(pairs.map(x=>x[1])).size===pairs.length){m={type:"links",pairs,left:names,right:shuffle(pairs.map(x=>x[1]))};q.prompt="Identifica los elementos de comunicación de la escena";q.correct=pairs.length+" parejas conectadas";q.explanation="Emisor: "+row[1]+". Receptor: "+row[2]+". Canal: "+row[5]+(step>=5?". Mensaje: "+row[3]:"")+".";q.concept="comunicacion-varios-elementos";}}if(!m)m={type:"scene",values:q.choices||[]};}
 else if(t==="comunicacion"||t==="comprension")m={type:"scene",values:q.choices||[]};
 q.mechanic=m;return q;
}
const begin=()=>({digits:"",chosen:[],left:null,linked:[],mistakes:0,repaired:[],pickedIndex:null});
function btn(act,val,label,cls="quest-piece",disabled=false){return '<button type="button" class="'+cls+'" data-action="mini" data-mini="'+act+'" data-value="'+esc(val)+'"'+(["pick","left"].includes(act)?' draggable="true" data-drag-kind="'+(act==="pick"?"train":"links")+'" data-drag-index="'+esc(val)+'"':"")+(act==="right"?' data-drop-kind="links" data-drop-index="'+esc(val)+'"':"")+(disabled?" disabled":"")+(cls.includes("active")||cls.includes("selected")?' aria-pressed="true"':(["left","toggle"].includes(act)?' aria-pressed="false"':""))+'>'+esc(label)+'</button>';}
function render(q,s,complete=false){
 const m=q.mechanic;if(!m)return "";let out='<div class="quest-scene quest-'+m.type+'"><div class="quest-artifact" aria-hidden="true">'+'<img class="quest-mini-art" src="./assets/objeto-'+m.type+'.svg" alt="" width="240" height="200" decoding="async">'+'</div>';
 if(["digits","machine"].includes(m.type)){
 const n=m.type==="digits"?4:m.target.length;
 out+='<div class="quest-slot-row">'+Array.from({length:n},(_,i)=>'<div class="quest-slot'+(s.digits[i]?" filled":"")+'"><small>'+esc(m.labels?.[i]||"")+'</small><span>'+esc(s.digits[i]||"·")+'</span></div>').join("")+'</div><div class="quest-keypad">';
 for(const x of ["1","2","3","4","5","6","7","8","9","⌫","0","✓"])out+=btn(x==="⌫"?"erase":x==="✓"?"submit":"digit",x,x,"quest-key");
 out+='</div><p class="quest-instruction">Construye tu respuesta. Puedes borrar la última cifra.</p>';
 }else if(m.type==="train"){
 out+='<p class="quest-instruction">Engancha los vagones de menor a mayor.</p><div class="quest-rail">'+m.values.map((_,i)=>'<span class="quest-rail-slot'+(s.chosen[i]===undefined?"":" coupled")+'" data-drop-kind="train" data-drop-index="'+i+'">'+esc(s.chosen[i]===undefined?"?":m.values[s.chosen[i]])+'</span>').join("")+'</div><div class="quest-pieces">'+m.values.map((v,i)=>btn("pick",i,v,"quest-piece",s.chosen.includes(i))).join("")+'</div>'+btn("undo",0,"↶ Deshacer","quest-text-button");
 }else if(m.type==="race"){
 out+='<p class="quest-instruction">Toca al participante que ocupa esa posición.</p><div class="quest-racers">'+m.values.map((v,i)=>btn("choose",i,(i+1)+".º "+v,"quest-racer"+(complete&&String(v)===String(q.correct)?" winner":""))).join("")+'</div>';
 }else if(m.type==="links"){
 out+='<p class="quest-instruction">Toca una palabra de cada columna para unir la pareja.</p><div class="quest-links"><div class="quest-link-column">'+m.left.map((x,i)=>btn("left",i,x,"quest-link"+(s.left===i?" active":"")+(s.linked.some(p=>p[0]===i)?" found":""),s.linked.some(p=>p[0]===i))).join("")+'</div><div class="quest-link-column">'+m.right.map((x,i)=>btn("right",i,x,"quest-link"+(s.linked.some(p=>p[1]===i)?" found":""),s.linked.some(p=>p[1]===i))).join("")+'</div></div><div class="quest-linked-evidence" aria-label="Parejas encontradas">'+s.linked.map(p=>'<span class="quest-pair-thread">✦ '+esc(m.left[p[0]])+' ↔ '+esc(m.right[p[1]])+'</span>').join("")+'</div><p class="quest-instruction" role="status">Cristales: '+s.linked.length+'/'+m.pairs.length+''+(s.mistakes?" · Sigue investigando":"")+'</p>';
 }else if(m.type==="repair"){
 out+='<p class="quest-instruction">Toca las palabras que necesitan mayúscula y comprueba el texto.</p><div class="quest-word-board">';
 m.parts.forEach((x,i)=>{if(/^\s+$/.test(x)){out+=esc(x);return}out+=btn("toggle",i,s.repaired.includes(i)?x[0].toLocaleUpperCase("es")+x.slice(1):x,"quest-word"+(s.repaired.includes(i)?" selected":""))+" "});
 out+='</div>'+btn("verify",0,"Comprobar pergamino","primary-btn quest-verify");
 }else if(m.type==="scene"){
 out+='<p class="quest-instruction">Inspecciona los objetos y pulsa la respuesta.</p><div class="quest-artifacts">'+m.values.map((x,i)=>btn("choose",i,x,"quest-artifact-button"+(complete&&String(x)===String(q.correct)?" winner":""))).join("")+'</div>';
 }
 if(complete)out=out.replace(/<button\b([^>]*)>/g,(full,attrs)=>"<button"+attrs+(/\bdisabled(?:\s|=|$)/.test(attrs)?"":" disabled")+' aria-disabled="true">');
 return out+'</div>';
}
function act(q,s,action,value){
 const m=q.mechanic;if(!m)return {state:s};
 if(m.type==="digits"||m.type==="machine"){
  const n=m.type==="digits"?4:m.target.length;
  if(action==="erase")s.digits=s.digits.slice(0,-1);
  if(action==="digit"&&s.digits.length<n)s.digits+=value;
  if(action==="submit"&&s.digits.length===n)return {state:s,done:true,ok:s.digits===m.target,given:s.digits};
 }else if(m.type==="train"){
  if(action==="undo")s.chosen.pop();
  if(action==="pick"&&!s.chosen.includes(+value))s.chosen.push(+value);
  if(s.chosen.length===m.values.length){const given=s.chosen.map(i=>m.values[i]).join(" → ");return {state:s,done:true,ok:given===m.correct.join(" → "),given};}
 }else if(m.type==="links"){
  if(action==="left"&&!s.linked.some(p=>p[0]===+value))s.left=+value;
  if(action==="right"&&s.left!==null){const j=+value,target=m.pairs[s.left][1];if(target===m.right[j])s.linked.push([s.left,j]);else s.mistakes++;s.left=null;}
  if(s.linked.length===m.pairs.length)return {state:s,done:true,ok:s.mistakes===0,given:m.pairs.length+" parejas conectadas"};
 }else if(m.type==="repair"){
  if(action==="toggle"){const i=+value,k=s.repaired.indexOf(i);k<0?s.repaired.push(i):s.repaired.splice(k,1);}
  if(action==="verify"){const a=s.repaired.slice().sort((x,y)=>x-y),b=m.target.slice().sort((x,y)=>x-y);return {state:s,done:true,ok:a.join(",")===b.join(","),given:"Mayúsculas seleccionadas: "+a.length};}
 }else if(action==="choose"){
  let given=String(m.values[+value]);s.pickedIndex=+value;return {state:s,done:true,ok:given===String(q.correct),given};
 }return {state:s};
}
window.AventuraMini={enrich,begin,render,act};
})();