"use strict";
/* Retos originales inspirados en competencias presentes en los materiales SDA1.
   No copia fichas ni datos personales. Requiere conceptos y fases existentes. */
(function(){
const bank=[];
const put=(id,subject,topic,type,prompt,correct,extra={})=>{
 if(bank.some(q=>q.id===id))throw Error("ID repetido: "+id);
 const q={id,subject,topic,variant:"variedad",type,prompt,correct:String(correct),
  source:extra.source||"SDA1-repaso",minStep:extra.minStep||0,
  explanation:extra.explanation||"Comprueba el enunciado y revisa cada elemento.",
  hint1:extra.hint1||"Lee el enunciado con atención.",
  hint2:extra.hint2||"Resuelve una parte cada vez.",
  ...extra};
 bank.push(q);
};
const M="math",L="lang";
[
 ["siete mil cuarenta y dos",7042],["cinco mil trescientos cuatro",5304],
 ["nueve mil ocho",9008],["ocho mil doscientos dos",8202],
 ["cuatro mil quinientos",4500],["dos mil cuatrocientos ochenta y dos",2482]
].forEach(([word,num],i)=>put("VAR-M-ESCRIBIR-"+(i+1),M,"numeros","text",
 "Escribe en cifras: «"+word+"».",num,{numeric:true,
 source:"Act. 2 LECTURA DE NÚMEROS.pdf",explanation:"«"+word+"» representa "+num+".",
 hint1:"Separa millares, centenas, decenas y unidades."}));
[1000,4000,3999,2700,8050].forEach((n,i)=>put("VAR-M-VECINOS-"+(i+1),M,"numeros","fill",
 "Completa los dos vecinos de "+n+".", (n-1)+" / "+(n+1),
 {source:"CONTROL DE REPASO 1.pdf",fields:["Número anterior","Número posterior"],
 answers:[String(n-1),String(n+1)],numeric:true,
 explanation:"Anterior: "+(n-1)+". Posterior: "+(n+1)+".",
 hint1:"Para el anterior, resta una unidad.",hint2:"Para el posterior, suma una unidad."}));
[8064,7040,9305,5028].forEach((n,i)=>put("VAR-M-POSICIONAL-"+(i+1),M,"descomponer","fill",
 "Escribe las cifras que ocupan cada columna del número "+n+".",
 String(n).padStart(4,"0").split("").join(" / "),
 {source:"CONTROL DE REPASO 2.pdf",fields:["Unidad de millar","Centena","Decena","Unidad"],
 answers:String(n).padStart(4,"0").split(""),numeric:true,
 explanation:"Cada cifra pertenece a su columna: UM, C, D y U.",
 hint1:"Empieza por la cifra de la izquierda.",hint2:"No omitas las columnas que valen cero."}));
const ordered=[[4500,3402,4050,2500],[9010,9001,9100,9090],[2600,6020,2060,6200],
 [1250,1205,1520,1052],[7040,7400,7004,4700]];
ordered.forEach((nums,i)=>put("VAR-M-ORDEN-"+(i+1),M,"comparar","ordering",
 "Ordena los vagones de menor a mayor.",[...nums].sort((a,b)=>a-b).join(" → "),
 {source:"Act. 1 COMPARACIÓN DE NÚMEROS.pdf",values:nums.map(String),
 explanation:"Compara primero los millares, después centenas, decenas y unidades.",
 hint1:"Comienza por la cifra de millares.",hint2:"Si empatan, compara centenas."}));
[
 [3482,3428],[8245,8245],[2706,2760],[4099,4100]
].forEach(([a,b],i)=>put("VAR-M-SIGNO-"+(i+1),M,"comparar","choice",
 "Elige el signo: "+a+" ___ "+b,a>b?">":a<b?"<":"=",
 {source:"Act. 2 COMPARACIÓN DE NÚMEROS.jpg",choices:["<","=",">"],
 explanation:"El signo indica cómo se comparan las dos cantidades.",
 hint1:"Compara los millares antes que las unidades."}));
[[2675,10],[4859,100],[7543,1000],[8042,100],[999,10]].forEach(([n,place],i)=>{
 const ans=Math.round(n/place)*place;put("VAR-M-REDONDEO-"+(i+1),M,"comparar","text",
 "Aproxima "+n+" a "+(place===10?"decenas":place===100?"centenas":"millares")+".",ans,
 {numeric:true,minStep:1,source:"CONTROL DE REPASO 2.pdf",
 explanation:"El resultado aproximado es "+ans+".",
 hint1:"Observa la cifra inmediatamente a la derecha de la posición elegida."});
});
[["9.º","noveno"],["10.º","décimo"],["12.º","duodécimo"]].forEach(([sym,name],i)=>put(
 "VAR-M-ORDINAL-"+(i+1),M,"ordinales","text","Escribe el ordinal "+sym+" con letras.",name,
 {source:"Act. 1 NÚMEROS ORDINALES Y CARDINALES.pdf",minStep:1,
 explanation:sym+" se escribe «"+name+"».",
 hint1:"Es un puesto en una fila, no una cantidad."}));
[[235,178,"+"],[683,279,"−"],[345,456,"+"],[1005,297,"−"]].forEach(([a,b,sign],i)=>{
 const n=sign==="+"?a+b:a-b;put("VAR-M-CALCULO-"+(i+1),M,"operaciones","text",
 "Resuelve en tu cuaderno y escribe el resultado de "+a+" "+sign+" "+b+".",n,
 {numeric:true,visual:a+" "+sign+" "+b,requiredSign:sign,
 source:"FICHAS SUMAS Y RESTAS.pdf",
 explanation:"El resultado es "+n+". Puedes comprobarlo realizando la operación inversa.",
 hint1:"Coloca las unidades debajo de las unidades."});
});
[
 ["veloz","rápido",["rápido","ligero"]],["bonito","hermoso",["hermoso","bello","precioso"]],
 ["automóvil","coche",["coche","auto"]],["cabello","pelo",["pelo"]],
 ["contento","alegre",["alegre","feliz"]]
].forEach(([word,answer,accepted],i)=>put("VAR-L-SINONIMO-"+(i+1),L,"sinonimos","text",
 "Escribe un sinónimo de «"+word+"».",answer,
 {accepted,source:"Act. 1 Sinónimos y antónimos.jpg",
 explanation:"Un sinónimo es una palabra que tiene significado igual o semejante.",
 hint1:"Busca otra palabra con un significado parecido."}));
[
 ["estrecho","ancho"],["lleno","vacío"],["alto","bajo"],["rápido","lento"],["cerca","lejos"]
].forEach(([word,answer],i)=>put("VAR-L-ANTONIMO-"+(i+1),L,"antonimos","text",
 "Escribe un antónimo de «"+word+"».",answer,
 {accepted:[answer],source:"Act. 4 Sinónimos y antónimos.jpg",
 explanation:"«"+word+"» y «"+answer+"» tienen significados contrarios.",
 hint1:"Piensa en una palabra que exprese lo opuesto."}));
[
 {p:"María escribe una carta para su abuelo. Completa los elementos.",a:["María","su abuelo"],f:["Emisor","Receptor"]},
 {p:"Luis habla por teléfono con su madre. Completa los elementos.",a:["Luis","su madre"],f:["Emisor","Receptor"]},
 {p:"La profesora escribe en la pizarra «Hoy leemos». Completa los elementos.",a:["la profesora","español escrito"],f:["Emisor","Código"]},
 {p:"Ana envía un correo a su amiga. Completa los elementos.",a:["Ana","correo electrónico"],f:["Emisor","Canal"]}
].forEach((v,i)=>put("VAR-L-COMPLETAR-"+(i+1),L,"comunicacion","fill",v.p,v.a.join(" / "),
 {fields:v.f,answers:v.a,source:"EJERCICIOS ELEMENTOS DE LA COMUNICACIÓN.pdf",
 explanation:v.f.map((f,j)=>f+": "+v.a[j]).join(". ")+".",
 hint1:"Emisor es quien envía el mensaje; receptor es quien lo recibe."}));
[
 ["Un correo electrónico con palabras utiliza comunicación verbal escrita.","Verdadero",
 "Porque está formado por palabras escritas."],
 ["Una señal de tráfico que solo muestra un dibujo es comunicación verbal oral.","Falso",
 "La imagen comunica sin utilizar palabras pronunciadas."],
 ["En una llamada telefónica, el teléfono es un medio por el que circula el mensaje.","Verdadero",
 "El teléfono permite transmitir la información por un canal."],
 ["El receptor es siempre quien envía el mensaje.","Falso",
 "Emisor envía; receptor recibe."]
].forEach(([statement,result,explanation],i)=>put("VAR-L-VERDADERO-"+(i+1),L,"comunicacion","choice",
 "¿Verdadero o falso? "+statement,result,{choices:["Verdadero","Falso"],
 source:"Ej. Lengua (Comunicación verbal y no verbal).pptx",explanation,
 hint1:"Piensa si la comunicación utiliza palabras o señales."}));
[
 [["Hablar en clase","Verbal"],["Escribir una nota","Verbal"],["Levantar el pulgar","No verbal"],["Mostrar una señal sin palabras","No verbal"]],
 [["Decir «hola»","Verbal"],["Escribir una carta","Verbal"],["Mover la cabeza para asentir","No verbal"],["Encender una luz como señal","No verbal"]]
].forEach((items,i)=>put("VAR-L-CLASIFICAR-"+(i+1),L,"comunicacion","classification",
 "Clasifica cada acción según utilice palabras o señales sin palabras.","Clasificación correcta",
 {items,groups:["Verbal","No verbal"],
 source:"Act. 1 La comunicación.jpg",
 explanation:"La comunicación verbal utiliza palabras; la no verbal utiliza gestos, sonidos o imágenes.",
 hint1:"Hablar y escribir usan palabras."}));
[
 [["feliz","alegre"],["rápido","veloz"],["coche","automóvil"]],
 [["alto","bajo"],["cerca","lejos"],["lleno","vacío"]]
].forEach((pairs,i)=>put("VAR-L-PAREJAS-"+(i+1),L,i?"antonimos":"sinonimos","matching",
 "Relaciona las tres parejas de "+(i?"antónimos":"sinónimos")+".","3 parejas conectadas",
 {pairs,source:"Act. 2 Sinónimos y antónimos.jpg",
 explanation:"Las parejas tienen significado "+(i?"contrario.":"parecido."),
 hint1:"Lee las palabras de ambas columnas antes de relacionarlas."}));
[
 ["parque","amigos","pelota"],["familia","paseo","sábado"],["biblioteca","libro","niña"]
].forEach((words,i)=>put("VAR-L-ESCRITURA-"+(i+1),L,"sinonimos","guided",
 "Taller de escritura: inventa una oración con «"+words.join("», «")+"».","Práctica de escritura revisada",
 {words,source:"CONTROL DE REPASO 1.pdf",minStep:1,
 explanation:"Autoevaluación: comprueba el sentido de la oración, mayúscula y punto. Las comprobaciones automáticas no valoran toda la gramática.",
 hint1:"Empieza por una persona o un lugar y cuenta qué sucede."}));
function pick(topic,{stage=0,step=0,requiredSign=null,seen=[]}={}){
 const pool=bank.filter(q=>q.topic===topic&&q.minStep<=step
 &&(!requiredSign||q.requiredSign===requiredSign)
 &&!(topic==="descomponer"&&stage===5)
 &&!(topic==="comunicacion"&&(stage===5||stage===6))
 &&(!seen.includes(q.id)));
 if(!pool.length)return null;
 const selected=pool[Math.floor(Math.random()*pool.length)];
 return {...selected,fingerprint:selected.id,choices:selected.choices?[...selected.choices]:null};
}
window.LigaVariedad=Object.freeze({questions:Object.freeze(bank),pick});
})();