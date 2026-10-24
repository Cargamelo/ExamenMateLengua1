"use strict";
/* Temario SDA1 Lengua: retos ORIGINALES que trabajan modalidades verificadas
   en las 17 fuentes adjuntas. No se incluyen imágenes/fichas editoriales. */
(function(){
const items=[],codes=new Set();
const src={
 SIN:"Act. 3 Sinónimos y antónimos.jpg, ejercicio 1, grupos de significado",
 ANT:"Act. 4 Sinónimos y antónimos.png, ejercicio 2, antónimos en contexto",
 PAR:"Act. 4 Sinónimos y antónimos.jpg, ejercicio 2, relacionar",
 SER:"Act. 7 Sinónimos y antónimos.jpg, ejercicio 1, palabra intrusa",
 DOB:"Act. 4 Sinónimos y antónimos.png, ejercicio 3, doble relación",
 TEX:"Act. 8 Sinónimos y antónimos.jpg, relato con huecos de antónimos",
 COM:"Act. 2 La comunicación.jpg, clasificación verbal/no verbal",
 TIP:"Ej. Lengua (Comunicación verbal y no verbal).pptx, diapositivas 3-12",
 ELEM:"Ejercicios de elementos de la comunicación (Del revés).pdf, páginas 1-6",
 ESC:"EJERCICIOS ELEMENTOS DE LA COMUNICACIÓN.pdf, página 2, diez escenas originales",
 DEF:"Act. 3 La comunicación.jpg, definiciones de elementos"
};
function add(subject,topic,type,prompt,correct,extra={}){
 const id="TEM-L-"+String(items.length+1).padStart(3,"0");
 const q={id,subject:"lang",topic,type,variant:"variedad",prompt,correct:String(correct),allowCorrection:type==="fill",
  source:extra.source||src[topic==="sinonimos"?"SIN":topic==="antonimos"?"ANT":"ELEM"],
  difficulty:extra.minStep||0, minStep:extra.minStep||0,
  concept:extra.concept||topic,
  hint1:extra.hint1||"Lee cada palabra y piensa en su significado dentro del ejemplo.",
  hint2:extra.hint2||"Compara las palabras o situaciones una por una.",
  explanation:extra.explanation||"Revisa el significado y comprueba por qué esa es la respuesta adecuada.",
  phases:extra.phases|| (topic==="sinonimos"?[1,3,10,15]:topic==="antonimos"?[2,4,10,15]:[5,6,11,15]),
  ...extra};
 if(codes.has(id))throw Error("ID duplicado");
 codes.add(id);items.push(q);return q;
}
const syn=[
 ["alegre","contento",["contento","feliz"]],["rápido","veloz",["veloz","ligero"]],
 ["terminar","acabar",["acabar","finalizar"]],["obsequio","regalo",["regalo"]],
 ["difícil","complicado",["complicado"]],["responder","contestar",["contestar"]],
 ["automóvil","coche",["coche","auto"]],["cabello","pelo",["pelo"]],
 ["hogar","casa",["casa","vivienda"]],["aula","clase",["clase"]],
 ["hermoso","bonito",["bonito","bello","precioso"]],["comenzar","empezar",["empezar","iniciar"]],
 ["enfadado","enojado",["enojado","molesto"]],["flaco","delgado",["delgado"]],
 ["tranquilo","sosegado",["sosegado","calmado"]],["sencillo","fácil",["fácil"]],
 ["enorme","gigante",["gigante","muy grande"]],["relatar","contar",["contar","narrar"]],
 ["cansado","fatigado",["fatigado","agotado"]],["hablar","conversar",["conversar","charlar"]],
 ["cuaderno","libreta",["libreta"]],["pastel","tarta",["tarta"]],["cristal","vidrio",["vidrio"]],
 ["amable","cordial",["cordial","atento"]]
];
syn.forEach(([w,a,accepted],i)=>add("lang","sinonimos","text",
 "Escribe un sinónimo de «"+w+"».",a,{accepted,source:i%3===0?src.SIN:"Act. 4 Sinónimos y antónimos.jpg, ejercicio 3",
 explanation:"«"+w+"» y «"+a+"» tienen significados parecidos. También pueden existir otras alternativas válidas en otros contextos.",
 hint1:"Prueba a expresar «"+w+"» con otras palabras."}));
const ant=[
 ["ancho","estrecho"],["lleno","vacío"],["encendido","apagado"],["alegre","triste"],
 ["fácil","difícil"],["largo","corto"],["claro","oscuro"],["subir","bajar"],
 ["lento","rápido"],["cerca","lejos"],["abrir","cerrar"],["grande","pequeño"],
 ["frío","caliente"],["amable","desagradable"],["silencioso","ruidoso"],
 ["encima","debajo"],["pronto","tarde"],["separar","juntar"],["famoso","desconocido"],
 ["recto","torcido"],["sucio","limpio"],["ordenado","desordenado"],
 ["valiente","cobarde"],["débil","fuerte"]
];
ant.forEach(([w,a],i)=>add("lang","antonimos","text",
 "Escribe el antónimo de «"+w+"».",a,{accepted:[a],source:src.ANT,
 explanation:"«"+w+"» y «"+a+"» expresan ideas opuestas.",hint1:"Piensa en la idea contraria a «"+w+"»."}));
const sinIntr=[
 [["alegre","feliz","contento","triste"],"triste","Las tres primeras expresan alegría; «triste» expresa lo contrario."],
 [["terminar","acabar","finalizar","empezar"],"empezar","Las tres primeras significan concluir; «empezar» significa iniciar."],
 [["casa","hogar","vivienda","escuela"],"escuela","«Escuela» no significa vivienda."],
 [["rápido","veloz","ligero","lento"],"lento","«Lento» tiene significado contrario."],
 [["bonito","hermoso","precioso","horrible"],"horrible","Las otras palabras describen belleza."],
 [["hablar","charlar","conversar","dormir"],"dormir","«Dormir» no es una forma de conversar."],
 [["fácil","sencillo","simple","difícil"],"difícil","«Difícil» es lo opuesto a las demás."],
 [["grande","enorme","gigante","pequeño"],"pequeño","«Pequeño» expresa una dimensión contraria."]
];
sinIntr.forEach(([words,wrong,why],i)=>add("lang","sinonimos","choice",
 "Encuentra la palabra intrusa: tres significan algo parecido.",wrong,
 {choices:words,source:src.SER,concept:"sinonimos-intruso",
 explanation:why,hint1:"Busca primero dos palabras con un significado muy parecido."}));
const antIntr=[
 [["claro","luminoso","brillante","oscuro"],"oscuro"],
 [["ancho","amplio","espacioso","estrecho"],"estrecho"],
 [["caliente","cálido","ardiente","frío"],"frío"],
 [["alegre","contento","feliz","triste"],"triste"],
 [["alto","elevado","de gran altura","bajo"],"bajo"],
 [["limpio","aseado","pulcro","sucio"],"sucio"]
];
antIntr.forEach(([words,wrong],i)=>add("lang","antonimos","choice",
 "En este grupo, selecciona la palabra que expresa la idea contraria.",wrong,
 {choices:words,source:src.SER,concept:"antonimos-intruso",
 explanation:"«"+wrong+"» se opone al significado común de las otras palabras."}));
const synPairs=[
 [["terminar","acabar"],["regalo","obsequio"],["libreta","cuaderno"]],
 [["casa","hogar"],["veloz","rápido"],["pelo","cabello"]],
 [["contestar","responder"],["fácil","sencillo"],["tarta","pastel"]],
 [["feliz","alegre"],["vidrio","cristal"],["comenzar","empezar"]],
 [["conversar","charlar"],["grande","enorme"],["coche","automóvil"]]
];
const antPairs=[
 [["frío","caliente"],["largo","corto"],["alto","bajo"]],
 [["limpio","sucio"],["fuerte","débil"],["lleno","vacío"]],
 [["cerca","lejos"],["ancho","estrecho"],["claro","oscuro"]],
 [["abrir","cerrar"],["rápido","lento"],["ordenado","desordenado"]],
 [["valiente","cobarde"],["pronto","tarde"],["subir","bajar"]]
];
for(const [topic,pairsSet] of [["sinonimos",synPairs],["antonimos",antPairs]])pairsSet.forEach((pairs,i)=>add(
 "lang",topic,"matching","Relaciona cada palabra con su "+(topic==="sinonimos"?"sinónimo.":"antónimo."),
 pairs.length+" parejas conectadas",{pairs,source:src.PAR,concept:topic+"-parejas",
 explanation:"Las parejas significan "+(topic==="sinonimos"?"algo igual o parecido.":"lo contrario."),hint1:"Empieza por las palabras que conoces mejor."}));
const synContexts=[
 ["El paisaje es muy hermoso.","hermoso","bonito",["bonito","precioso","bello"]],
 ["Tengo que terminar este dibujo.","terminar","acabar",["acabar","finalizar"]],
 ["Mi amiga está contenta por su regalo.","contenta","alegre",["alegre","feliz"]],
 ["Responde a la pregunta del profesor.","Responde","Contesta",["contesta"]],
 ["Ese acertijo es difícil.","difícil","complicado",["complicado"]],
 ["El ciclista era muy veloz.","veloz","rápido",["rápido"]],
 ["La profesora empezó el cuento.","empezó","comenzó",["comenzó","inició"]],
 ["El niño llevaba un obsequio.","obsequio","regalo",["regalo"]]
];
const antContexts=[
 ["La caja estaba llena.","llena","vacía",["vacía"]],
 ["Encendieron la lámpara.","Encendieron","Apagaron",["apagaron"]],
 ["El sendero era ancho.","ancho","estrecho",["estrecho"]],
 ["La camiseta estaba limpia.","limpia","sucia",["sucia"]],
 ["La tortuga era lenta.","lenta","rápida",["rápida"]],
 ["La puerta quedó abierta.","abierta","cerrada",["cerrada"]],
 ["La habitación era oscura.","oscura","clara",["clara","luminosa"]],
 ["El árbol era pequeño.","pequeño","grande",["grande"]]
];
for(const [topic,list,srcId] of [["sinonimos",synContexts,src.SIN],["antonimos",antContexts,src.ANT]])list.forEach(([sentence,focus,answer,accepted],i)=>add(
 "lang",topic,"text","En «"+sentence+"», sustituye «"+focus+"» por una palabra "+(topic==="sinonimos"?"parecida.":"contraria."),
 answer,{accepted,source:srcId,concept:topic+"-contextual",minStep:i%3===0?1:0,
 explanation:"En esta oración, «"+answer+"» "+(topic==="sinonimos"?"mantiene una idea semejante.":"expresa la idea opuesta y mantiene la concordancia."),
 hint1:"Fíjate en si se refiere a alguien o a algo femenino o masculino."}));
[
 ["alegre","contento","triste"],["rápido","veloz","lento"],["fácil","sencillo","difícil"],
 ["limpio","aseado","sucio"],["grande","enorme","pequeño"],["caliente","cálido","frío"]
].forEach(([w,s,a])=>add("lang","sinonimos","fill","Escribe un sinónimo y un antónimo de «"+w+"».",s+" / "+a,
 {fields:["Sinónimo","Antónimo"],answers:[s,a],acceptedFields:[[s],[a]],
 source:src.DOB,concept:"doble-relacion",minStep:1,
 explanation:"«"+s+"» se parece a «"+w+"» y «"+a+"» expresa una idea contraria."}));
const antStory=[
 {text:"El gato dormía en un cojín ___; al día siguiente eligió uno duro.",base:"duro",answer:"blando"},
 {text:"Al salir, Elena encontró la puerta ___; su hermano la había dejado cerrada.",base:"cerrada",answer:"abierta"},
 {text:"Ayer el patio estaba ___, pero hoy lo hemos dejado limpio.",base:"limpio",answer:"sucio"},
 {text:"En invierno el agua estaba ___ y en verano resultó caliente.",base:"caliente",answer:"fría"},
 {text:"El camino al huerto era muy ___, a diferencia de la avenida ancha.",base:"ancha",answer:"estrecho"},
 {text:"La mochila de Sara estaba ___; al sacar los libros quedó vacía.",base:"vacía",answer:"llena"}
];
antStory.forEach((v,i)=>add("lang","antonimos","fill",
 "Completa la oración con el antónimo de «"+v.base+"»: "+v.text.replace("___","_____"),
 v.answer,{fields:["Palabra que falta"],answers:[v.answer],source:src.TEX,
 explanation:"El antónimo contextual es «"+v.answer+"». Observa la concordancia."}));
const pairClasses=[
 [["contento - feliz","Sinónimos"],["alto - bajo","Antónimos"],["rápido - veloz","Sinónimos"],["sucio - limpio","Antónimos"]],
 [["libreta - cuaderno","Sinónimos"],["cerca - lejos","Antónimos"],["regalo - obsequio","Sinónimos"],["lleno - vacío","Antónimos"]],
 [["bello - bonito","Sinónimos"],["lento - rápido","Antónimos"],["coche - automóvil","Sinónimos"],["frío - caliente","Antónimos"]],
 [["enorme - grande","Sinónimos"],["ancho - estrecho","Antónimos"],["terminar - acabar","Sinónimos"],["abrir - cerrar","Antónimos"]]
];
pairClasses.forEach((pairs,i)=>add("lang",i%2?"antonimos":"sinonimos","classification",
 "Clasifica cada pareja como sinónimos o antónimos.","Clasificación correcta",
 {items:pairs,groups:["Sinónimos","Antónimos"],source:src.DOB,concept:"clasificar-parejas",
 explanation:"Los sinónimos son parecidos; los antónimos son contrarios."}));
const guided=[
 ["La niña estaba alegre.","alegre","contenta"],
 ["La historia era divertida.","divertida","entretenida"],
 ["Mi amigo terminó el dibujo.","terminó","acabó"],
 ["El camino era estrecho.","estrecho","ancho"],
 ["La mochila estaba llena.","llena","vacía"],
 ["La casa era pequeña.","pequeña","grande"]
];
guided.forEach(([original,from,to],i)=>add("lang",i<3?"sinonimos":"antonimos","rewrite",
 "Reescribe la oración y cambia «"+from+"» por «"+to+"».", "Revisión guiada",
 {original,from,to,source:i<3?src.SIN:src.ANT,concept:"reescritura-guiada",
 minStep:1,explanation:"Comprueba que hayas usado «"+to+"», que hayas sustituido «"+from+"» y que la oración conserve el sentido. El juego solo verifica requisitos objetivos: la revisión del sentido es tuya.",
 hint1:"Copia la oración con una palabra cambiada, mayúscula y punto."}));
const types=[
 ["Una niña llama por teléfono a su abuelo y habla con él.","Verbal oral","La voz transmite palabras habladas."],
 ["Un alumno escribe una nota en papel.","Verbal escrita","La nota comunica palabras escritas."],
 ["Un ciclista levanta la mano para indicar que va a girar, sin hablar.","No verbal: gesto","El gesto comunica sin palabras."],
 ["Un semáforo muestra una luz roja, sin ningún texto.","No verbal: imagen o señal","La luz de color transmite una señal."],
 ["Una ambulancia utiliza únicamente una sirena para avisar.","No verbal: sonido","Una sirena no pronuncia palabras."],
 ["Una niña lee las palabras escritas de un cartel que dice «Biblioteca».","Verbal escrita","El cartel contiene palabras escritas."],
 ["Un árbitro enseña una tarjeta roja sin hablar.","No verbal: imagen o señal","La tarjeta es una señal visual reglamentaria."],
 ["Un niño envía un correo electrónico con una frase.","Verbal escrita","Las palabras enviadas son lenguaje escrito."],
 ["Una persona hace una señal de silencio con un dedo ante los labios.","No verbal: gesto","El gesto transmite el mensaje."],
 ["Una profesora explica en voz alta cómo jugar.","Verbal oral","Utiliza lenguaje hablado."],
 ["Una persona toca un silbato para llamar la atención, sin hablar.","No verbal: sonido","El silbido es una señal acústica no lingüística."],
 ["Un periódico publica una noticia redactada con palabras.","Verbal escrita","La noticia está escrita con palabras."]
];
types.forEach(([sentence,type,why],i)=>add("lang","comunicacion","choice",
 "¿Qué forma de comunicación se utiliza? "+sentence,type,{choices:["Verbal oral","Verbal escrita","No verbal: gesto","No verbal: imagen o señal","No verbal: sonido"],
 source:i%2?src.COM:src.TIP,concept:"tipos-de-comunicacion",
 phases:[5,6,11,15],explanation:why,hint1:"Pregunta si hay palabras habladas, palabras escritas o una señal sin palabras."}));
const typeSets=[
 [["Decir algo en voz alta","Verbal oral"],["Escribir una nota","Verbal escrita"],["Mostrar una tarjeta roja sin hablar","No verbal"]],
 [["Llamar y conversar","Verbal oral"],["Leer una carta","Verbal escrita"],["Hacer un gesto de silencio","No verbal"]],
 [["Contar una noticia hablando","Verbal oral"],["Enviar un correo con palabras","Verbal escrita"],["Una sirena sin voz","No verbal"]],
 [["Explicar oralmente un juego","Verbal oral"],["Un texto en el periódico","Verbal escrita"],["Una luz roja de semáforo","No verbal"]]
];
typeSets.forEach(items=>add("lang","comunicacion","classification",
 "Clasifica las situaciones según cómo se comunica el mensaje.","Clasificación correcta",
 {items,groups:["Verbal oral","Verbal escrita","No verbal"],source:src.COM,
 concept:"clasificar-comunicacion",phases:[5,6,11,15],
 explanation:"El lenguaje puede ser oral o escrito; los gestos y señales sin palabras son comunicación no verbal."}));
const def=[
 ["Emisor","Quien produce y envía el mensaje."],
 ["Receptor","Quien recibe el mensaje."],
 ["Mensaje","La información que se transmite."],
 ["Código","El conjunto de signos y reglas para expresar el mensaje."],
 ["Canal","El medio por el que llega el mensaje."],
 ["Contexto","Las circunstancias en las que ocurre la comunicación."]
];
def.forEach(([name,definition],i)=>add("lang","comunicacion","choice",
 "¿Qué elemento es «"+definition+"»?",name,
 {choices:["Emisor","Receptor","Mensaje","Código","Canal","Contexto"],
 source:src.DEF,concept:"elementos-definiciones",phases:[6,11,15],
 explanation:name+": "+definition,hint1:"Piensa si pregunta por la persona, la información, los signos, el medio o las circunstancias."}));
const scenes=[
 {who:"Clara",to:"su abuelo",message:"Mañana iremos al parque",code:"español oral",channel:"la voz a través del teléfono",context:"una llamada familiar",text:"Clara llama a su abuelo para decirle «Mañana iremos al parque»."},
 {who:"el profesor",to:"la clase",message:"Hoy aprenderemos sobre los planetas",code:"español oral",channel:"el aire, mediante la voz",context:"una clase de Ciencias",text:"En la clase de Ciencias, el profesor dice «Hoy aprenderemos sobre los planetas»."},
 {who:"Lucía",to:"su amiga",message:"Te espero a las seis",code:"español escrito",channel:"un correo electrónico",context:"una invitación entre amigas",text:"Lucía escribe a su amiga un correo electrónico: «Te espero a las seis»."},
 {who:"el entrenador",to:"el equipo",message:"Comenzamos el entrenamiento",code:"español oral",channel:"la voz en el campo",context:"un entrenamiento deportivo",text:"En un campo deportivo, el entrenador anuncia al equipo: «Comenzamos el entrenamiento»."},
 {who:"la bibliotecaria",to:"los lectores",message:"Silencio, por favor",code:"español escrito",channel:"un cartel impreso",context:"la sala de lectura",text:"La bibliotecaria coloca en la sala de lectura un cartel con palabras: «Silencio, por favor»."},
 {who:"la jefa de estación",to:"los viajeros",message:"El tren sale por la vía dos",code:"español oral",channel:"los altavoces de megafonía",context:"la estación de tren",text:"Por la megafonía de la estación, la jefa anuncia a los viajeros: «El tren sale por la vía dos»."},
 {who:"Marta",to:"su hermano",message:"Saca al perro",code:"español escrito",channel:"una nota de papel",context:"un recordatorio en casa",text:"Marta deja una nota para su hermano en casa: «Saca al perro»."},
 {who:"el médico",to:"el paciente",message:"Toma este jarabe por la mañana",code:"español oral",channel:"la voz en la consulta",context:"una consulta médica",text:"En la consulta, el médico le explica al paciente: «Toma este jarabe por la mañana»."}
];
scenes.forEach((v,i)=>{
 const fields=["Emisor","Receptor","Mensaje","Código","Canal","Contexto"],answers=[v.who,v.to,v.message,v.code,v.channel,v.context];
 add("lang","comunicacion","fill","Analiza esta situación: "+v.text,
 answers.join(" / "),{fields,answers,source:i%2?src.ELEM:src.ESC,concept:"elementos-tabla",
 minStep:2,phases:[11,15],
 explanation:fields.map((name,j)=>name+": "+answers[j]).join(". ")+".",
 hint1:"Emisor envía, receptor recibe. Mensaje es la información; código, los signos; canal, el medio; contexto, las circunstancias."});
 const idx=i%6,field=fields[idx],answer=answers[idx];
 add("lang","comunicacion","text",
 "En esta situación, identifica el «"+field+"»: "+v.text,
 answer,{accepted:[answer],source:src.ELEM,concept:"elementos-"+field.toLowerCase(),
 minStep:0,phases:idx<2?[5,11,15]:[6,11,15],
 explanation:"El "+field.toLowerCase()+" es: "+answer+".",
 hint1:"Busca "+(idx<2?"quién interviene.":idx===2?"la información concreta.":idx===3?"los signos usados.":idx===4?"cómo llega el mensaje.":"dónde y por qué ocurre.")});
});
const multi=[
 {p:"Marca todos los ejemplos de comunicación verbal escrita.",values:["Escribir una carta","Decir un mensaje por teléfono","Leer una noticia","Enseñar una señal sin palabras"],correct:[0,2]},
 {p:"Marca todos los ejemplos de comunicación no verbal.",values:["Enseñar una tarjeta roja sin hablar","Enviar un correo con palabras","Señalar con un dedo","Escuchar un dictado hablado"],correct:[0,2]},
 {p:"Marca todos los elementos que identifican personas que participan en la comunicación.",values:["Emisor","Código","Receptor","Canal"],correct:[0,2]},
 {p:"Marca los medios que sirven como canal.",values:["Altavoces","Español escrito","Correo electrónico","Palabras en castellano"],correct:[0,2]},
 {p:"Marca los ejemplos de comunicación verbal oral.",values:["Conversar en clase","Hablar por teléfono","Mostrar una flecha sin palabras","Escribir una nota"],correct:[0,1]}
];
multi.forEach((v,i)=>add("lang","comunicacion","multi",v.p,"Selección correcta",
 {options:v.values,correctIndexes:v.correct,source:i<2?src.TIP:src.DEF,
 concept:"seleccion-multiple-comunicacion",minStep:1,phases:[5,6,11,15],
 explanation:"Cada opción correcta cumple la definición indicada. Las otras pertenecen a otra categoría.",
 hint1:"Hay más de una respuesta correcta: comprueba cada opción."}));
const errorCases=[
 ["La profesora habla a los alumnos. «Los alumnos son los emisores».","Receptor","La profesora emite; los alumnos reciben."],
 ["Una alumna escribe un mensaje en español. «Su código es el teléfono».","Código","El código es el español escrito; el teléfono puede ser un medio o canal."],
 ["Un niño lee un cuento en papel. «El canal es el idioma español».","Canal","El soporte físico de papel es el canal; el idioma es el código."],
 ["Una sirena suena sin palabras. «Es comunicación verbal oral».","No verbal","El sonido no lingüístico es comunicación no verbal."]
];
errorCases.forEach(([sentence,ans,explanation])=>add("lang","comunicacion","choice",
 "Detecta la corrección adecuada: "+sentence,ans,{choices:["Emisor","Receptor","Código","Canal","No verbal","Verbal escrita"],
 source:src.ELEM,concept:"reparar-comunicacion",minStep:1,phases:[6,11,15],
 explanation}));
function pick(topic,{stage=0,step=0,seen=[],recentTypes=[]}={}){
 const active=items.filter(q=>q.topic===topic&&q.minStep<=step&&(!stage||q.phases.includes(stage))&&!seen.includes(q.id));
 if(!active.length)return null;
 const counts={};recentTypes.forEach(t=>{counts[t]=(counts[t]||0)+1;});
 const ban=recentTypes.length>=2&&recentTypes.at(-1)===recentTypes.at(-2)?recentTypes.at(-1):null;
 const allowed=active.some(q=>q.type!==ban)?active.filter(q=>q.type!==ban):active;
 const best=Math.min(...allowed.map(q=>counts[q.type]||0));
 const pool=allowed.filter(q=>(counts[q.type]||0)===best);
 const q=pool[Math.floor(Math.random()*pool.length)];
 return {...q,choices:q.choices?[...q.choices]:null,fingerprint:q.id};
}
window.LigaTemarioLengua=Object.freeze({questions:Object.freeze(items),pick,sources:Object.freeze(src)});
})();