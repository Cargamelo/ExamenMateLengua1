"use strict";
(function(){
const D=window.EDU_DATA, subject=document.body.dataset.subject, isMath=subject==="math";
const modules=isMath?D.math:D.lang;
const app=document.getElementById("app");
if(!D||!app){document.body.innerHTML="<p>No se han podido cargar los contenidos.</p>";return;}
const META=isMath?{brand:"Reino de los Números",subtitle:"MATEMÁTICAS · 3.º C",hero:"La aventura de los números",intro:"Quince fases llenas de números, acertijos y operaciones.",mascot:"🧙",exam:"Martes 27 de octubre"}:{brand:"Agencia de las Palabras",subtitle:"LENGUA · 3.º C",hero:"Detectives de las palabras",intro:"Quince fases para investigar, leer, escribir y descubrir palabras.",mascot:"🕵️",exam:"Del 26 al 30 de octubre"};
const key="ligasaber-2026-"+subject;
let progress={history:[],misses:[],badges:[],lastDate:""};
try{const saved=JSON.parse(localStorage.getItem(key)||"null");if(saved&&Array.isArray(saved.history))progress={...progress,...saved};}catch(e){}
let soundEnabled=!!window.AventuraFX?.isEnabled?.(), audioContext=null, view="home", topic="", mode="practice", difficulty=2, questionStep=0, session=null, questionIndex=0, answered=null, hintCount=0, response="", materialIndex=0, dictationShow=false;
let voiceRequest=0;let voiceList=[];let memoryState=null;let dictationDraft="";let dictationChecked=false,dictationResult="",expressiveSaved=false,expressiveResult="";let miniState=null;const AD=window.AventuraAdaptive, MINI=window.AventuraMini, AV=window.AventuraFX, WORLD=window.AventuraMapas;const adaptive=AD.init(progress,modules.map(x=>x.id));const challengeSeq={};
const ST=window.AventuraFases,journey=ST.init(progress,subject);
let selectedStageId=null,guideFrom=null,dictationWasCorrect=false,expressiveScore=0;
function refreshVoices(){if("speechSynthesis" in window)voiceList=window.speechSynthesis.getVoices()||[];}
refreshVoices();
if("speechSynthesis" in window && window.speechSynthesis.addEventListener)window.speechSynthesis.addEventListener("voiceschanged",refreshVoices);
function esc(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
function rand(n){return Math.floor(Math.random()*n)}function pick(a){return a[rand(a.length)]}
function shuffle(a){let b=a.slice();for(let i=b.length-1;i>0;i--){const j=rand(i+1);[b[i],b[j]]=[b[j],b[i]];}return b;}
function unique(a){return [...new Set(a)]}function cap(s){return s.charAt(0).toUpperCase()+s.slice(1)}
function fmt(n){return Number(n).toLocaleString("es-ES",{useGrouping:true,maximumFractionDigits:0})}
function persist(){
 try{localStorage.setItem(key,JSON.stringify(progress))}catch(e){}
 window.LigaPartida?.save(subject,progress,view==="quiz"&&session?.stageId?snapshot():undefined);
}
function snapshot(){
 if(!session?.stageId||view!=="quiz"||session.finished)return null;
 return {version:2,subject,stageId:session.stageId,questionIndex,answered,
  hintCount,response,miniState,session:{...session,seen:[...(session.seen||[])]},updated:Date.now()};
}
function saveCheckpoint(){
 if(view==="quiz"&&session?.stageId)window.LigaPartida?.save(subject,progress,snapshot());
}
function resumable(){
 const c=window.LigaPartida?.readCheckpoint(subject);
 return c&&ST.canEnterStage(subject,journey,c.stageId)
  &&!c.session.finished&&c.questionIndex>=0
  &&c.questionIndex<c.session.target?c:null;
}
function resumeStage(){
 const c=resumable();if(!c){go("topics");return;}
 selectedStageId=c.stageId;session={...c.session,stage:ST.getStage(subject,c.stageId),
  seen:new Set(c.session.seen||[])};questionIndex=c.questionIndex;
 answered=c.answered;hintCount=c.hintCount;response=c.response||"";
 miniState=c.miniState||MINI.begin(session.items[questionIndex]);
 topic=session.items[questionIndex]?.topic||session.topic;mode="games";view="quiz";render();
}
function topicById(id){return modules.find(x=>x.id===id)}
function master(id){const h=progress.history.filter(x=>x.topic===id).slice(-10);const ok=h.filter(x=>x.ok).length;return {tried:h.length,percent:h.length?Math.round(100*ok/h.length):0,solid:h.length>=5&&ok/h.length>=.8};}
function stars(){return progress.history.filter(x=>x.ok).length;}
function starsLabel(){const n=stars();return n+" "+(n===1?"estrella acumulada":"estrellas acumuladas");}
function missionHud(){
 if(view!=="quiz"||!session?.items?.length)return "";
 const q=session.items[questionIndex]||session.items[0],stat=AD.status(adaptive,q.topic);
 return '<aside class="mission-hud" aria-label="Estado actual de la misión"><span class="mission-hud-star"><span aria-hidden="true">★</span><strong>'+starsLabel()+'</strong></span><span class="mission-hud-tier"><span aria-hidden="true">✦</span> '+esc(stat.name)+'</span><span class="mission-hud-clock"><span aria-hidden="true">◷</span> Sin cronómetro</span></aside>';
}
function stopSpeak(){voiceRequest++;if("speechSynthesis" in window)window.speechSynthesis.cancel();}
function speak(text){
 const status=document.getElementById("voice-status");
 const show=(message)=>{if(status)status.textContent=message;};
 if(!("speechSynthesis" in window)||typeof SpeechSynthesisUtterance==="undefined"){show("La voz no está disponible. Puedes leer el texto o pedir ayuda a un adulto.");return;}
 stopSpeak();const request=voiceRequest;
 refreshVoices();
 const u=new SpeechSynthesisUtterance(text);
 u.lang="es-ES";u.rate=.82;u.pitch=1;
 const spanish=voiceList.find(v=>v.lang.toLowerCase()==="es-es")||voiceList.find(v=>v.lang.toLowerCase().startsWith("es"));
 if(spanish)u.voice=spanish;
 u.onstart=()=>{if(request===voiceRequest)show("🔊 Reproduciendo la locución…");};
 u.onend=()=>{if(request===voiceRequest)show("Locución finalizada. Puedes volver a escucharla.");};
 u.onerror=()=>{if(request===voiceRequest)show("No se ha podido reproducir la locución. Un adulto puede ayudarte.");};
 try{show("Preparando la voz…");window.speechSynthesis.speak(u);}
 catch(e){show("La voz no está disponible. Puedes leerlo o pedir ayuda a un adulto.");}
}
function fx(ok,q=null,info=null){AV?.onResult?.(ok,q,info);}
const ICON_IDS=new Set(["mates","lengua","aprender","practicar","jugar","simulacro","errores","progreso","plan","otra","numeros","descomponer","comparar","ordinales","operaciones","sinonimos","antonimos","comunicacion","puntuacion","comprension","dictado","expresiva"]);
function graphicIcon(id,kind=""){const icon=ICON_IDS.has(id)?id:"aprender";return '<svg class="adventure-icon '+kind+'" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><use href="./assets/iconos-aventura.svg#'+icon+'"></use></svg>';}
const MODE_ICONS={"Aprender":"aprender","Practicar":"practicar","Jugar":"jugar","Simulacro":"simulacro","Mis errores":"errores","Mi progreso":"progreso","Plan de repaso":"plan","Otra asignatura":"otra","Teoría":"aprender","Actividades":"puntuacion","Comprensión":"comprension","Dictado":"dictado","Lectura expresiva":"expresiva"};
function shell(inner){
const subjectName=isMath?"Matemáticas":"Lengua";
app.innerHTML='<main class="game-container"><header class="game-header">'+
'<a class="brand" href="./index.html" aria-label="Volver a la portada de La Liga del Saber"><span class="brand-logo">'+graphicIcon(isMath?"mates":"lengua","brand-icon")+'</span><span><small>'+META.subtitle+'</small><strong>'+META.brand+'</strong></span></a>'+
'<a class="header-main-menu" href="./index.html"><span class="menu-glyph" aria-hidden="true">⌂</span> Menú principal</a>'+
'<div class="header-actions">'+(view==="quiz"?"":'<span class="pill-info" title="Respuestas acertadas">⭐ '+stars()+'</span>')+
'<button type="button" class="icon-button" data-action="sound" aria-label="'+(soundEnabled?"Desactivar efectos sonoros":"Activar efectos sonoros")+'" aria-pressed="'+soundEnabled+'">'+(soundEnabled?"🔊 Sonido":"🔇 Sonido")+'</button>'+
(soundEnabled?'<details class="sound-mixer"><summary title="Ajustar volumen" aria-label="Ajustar volumen de efectos">♫ Vol.</summary><label for="fx-volume">Volumen de efectos <output id="fx-volume-display">'+Math.round(AV.getVolume()*100)+' %</output></label><input type="range" id="fx-volume" min="0" max="100" step="5" value="'+Math.round(AV.getVolume()*100)+'" aria-label="Volumen de efectos sonoros"><small>Las lecturas en voz alta utilizan el volumen del dispositivo.</small></details>':"")+
'<button type="button" class="icon-button" data-action="collection" aria-label="Abrir la colección de cartas mágicas">🃏 Colección</button>'+
'<button type="button" class="icon-button" data-action="home" aria-label="Volver a la pantalla de '+subjectName+'">✦ '+subjectName+'</button></div>'+
'</header>'+missionHud()+'<div id="view">'+inner+'</div></main>';
}
function button(action,text,extra="",klass="primary-btn"){return '<button type="button" class="'+klass+'" data-action="'+action+'" '+extra+'>'+text+'</button>';}
function go(where){stopSpeak();view=where;answered=null;hintCount=0;response="";render();window.scrollTo({top:0,behavior:"instant"});}
function card(title,sub,icon,action,extra=""){return '<button type="button" class="menu-card" data-action="'+action+'" '+extra+'><span class="card-icon" aria-hidden="true">'+graphicIcon(MODE_ICONS[title]||"aprender")+'</span><strong>'+title+'</strong><span>'+sub+'</span></button>';}
function topBack(destination="home"){return '<div class="back-line">'+button(destination,"← Volver","","secondary-btn")+'<span class="pill-info">'+esc(META.exam)+'</span></div>';}
function render(){if(view==="home")return renderHome();if(view==="topics")return renderTopics();if(view==="lesson")return renderLesson();if(view==="setup")return renderSetup();if(view==="quiz")return renderQuiz();if(view==="result")return renderResult();if(view==="progress")return renderProgress();if(view==="schedule")return renderSchedule();if(view==="material")return renderMaterialList();if(view==="dictation")return renderDictation();if(view==="expressive")return renderExpressive();if(view==="memory")return renderMemory();}
function renderHome(){
const art=isMath?"./assets/escena-matematicas.svg":"./assets/escena-lengua.svg";
const pending=AD.pending(adaptive).length,medals=adaptive.rewards?.completed||0,resume=resumable();
shell('<section class="hero-game quest-hero"><div class="hero-copy"><div class="overline">✦ TU NUEVA AVENTURA</div><h1>'+META.hero+'</h1><p>'+META.intro+'</p><div class="quest-summary"><span>⭐ '+starsLabel()+'</span><span>🏅 '+medals+' misiones</span><span>🪙 '+(adaptive.rewards?.coins||0)+' monedas</span></div></div><img class="game-hero-art" src="'+art+'" alt="" width="920" height="550" decoding="async"><img class="hero-companion" src="./assets/portada/'+(isMath?"tiko-portada":"nara-portada")+'.webp" alt="" width="240" height="270" decoding="async"></section>'+
'<section class="adventure-actions" aria-label="Elegir aventura">'+
(resume?'<button type="button" class="adventure-launch continue-quest" data-action="resume-stage"><span class="resume-marker">↪</span><span><strong>CONTINUAR AVENTURA</strong><small>Fase '+ST.getStage(subject,resume.stageId).number+' · Reto '+(resume.questionIndex+1)+' de '+resume.session.target+'</small></span><span class="launch-arrow">→</span></button>':'')+
 '<button type="button" class="adventure-launch" data-action="topics">'+graphicIcon("jugar")+'<span><strong>JUGAR</strong><small>¡Explora los mundos y supera misiones!</small></span><span class="launch-arrow" aria-hidden="true">→</span></button>'+
'<button type="button" class="adventure-repair" data-action="errors">'+graphicIcon("errores")+'<span><strong>MIS ERRORES</strong><small>'+(pending?pending+' pistas pendientes para investigar':'Un taller para seguir aprendiendo')+'</small></span><span class="launch-arrow" aria-hidden="true">→</span></button></section>'+
'<div class="adventure-footer"><p>Sin cronómetro y sin niveles que configurar. Cada reto se adapta a lo que vas aprendiendo.</p><div class="action-row">'+button("progress","🏅 Mis logros","","quest-text-button")+button("collection","🃏 Mi colección","","quest-text-button")+'</div></div>');
}
function renderTopics(){
 const stages=ST.getStages(subject);
 const active=ST.getStage(subject,journey.active)||stages[0];
 shell(topBack()+'<header class="map-voyage-intro"><span class="map-flag">✦ EL GRAN MAPA DE LAS AVENTURAS</span>'+
 '<h1 class="section-title">'+(isMath?"El Reino de los Números":"El Archipiélago de las Palabras")+'</h1>'+
 '<p>Completa las fases por orden. Puedes repetir casillas superadas; las siguientes tienen candado.</p></header>'+
 WORLD.render(isMath,stages,journey,esc));
 persist();
 if(typeof window.requestAnimationFrame==="function"){
   const previous=guideFrom;guideFrom=null;
   window.requestAnimationFrame(()=>WORLD.focusStage(active.id,previous));
 }else guideFrom=null;
}
function startStage(id){
 const stage=ST.getStage(subject,id);if(!stage)return;
 if(!ST.canEnterStage(subject,journey,id)){
  const existing=document.getElementById("stage-locked-message");
  const note=existing||document.createElement("p");
  note.id="stage-locked-message";note.setAttribute("role","alert");note.className="stage-locked-message";
  note.textContent="Primero tienes que completar la fase anterior para continuar tu aventura.";
  (document.querySelector(".stage-map-progress")||app).append(note);
  return;
 }
 const previous=journey.active;ST.activate(subject,journey,id);
 guideFrom=previous!==id?previous:null;selectedStageId=id;topic=stage.topics[0];mode="games";
 persist();
 if(stage.special){
  materialIndex=0;dictationShow=false;dictationDraft="";dictationChecked=false;dictationResult="";
  expressiveSaved=false;expressiveResult="";dictationWasCorrect=false;expressiveScore=0;
  go("material");return;
 }
 session={title:"Fase "+stage.number+" · "+stage.title,stageId:stage.id,stage,topic:stage.topics[0],review:false,adaptive:true,target:15,items:[],results:[],seen:new Set()};
 questionIndex=0;answered=null;hintCount=0;response="";miniState=null;
 session.items.push(nextStageChallenge());view="quiz";render();saveCheckpoint();
}
function nextStageChallenge(){
 const stage=session.stage,idx=session.items.length,id=stage.topics[idx%stage.topics.length];
 return nextChallenge(id,false,stage.topics.length===1?stage.variants:null,stage.sign);
}
function finishStage(score,total){
 if(!session?.stageId||session.stageOutcome)return;
 session.stageOutcome=ST.complete(subject,journey,session.stageId,score,total);
 if(!session.stageOutcome)return;
 window.LigaPartida?.clearCheckpoint(subject,progress);
 session.stageBonus=(session.stageOutcome.first?2:0)+(session.stageOutcome.justAwarded?15:0);
 if(session.stageBonus)adaptive.rewards.coins=(adaptive.rewards.coins||0)+session.stageBonus;
 guideFrom=session.stageId;
 persist();
 session.cardReward=window.LigaCartas?.award(subject,session.stageId)||null;
}
function renderLesson(){const m=topicById(topic);if(!m){go("home");return;}shell(topBack("topics")+'<h1 class="section-title">'+graphicIcon(m.id)+' '+esc(m.title)+'</h1><article class="paper lesson narrow">'+m.lesson+'<div class="action-row">'+button("enter-world","Continuar aventura",'data-topic="'+topic+'"')+'</div></article>');}
function renderSetup(){enterWorld(topic);}
function specialStageIntro(){
 const stage=ST.getStage(subject,selectedStageId);
 return stage?.special?'<div class="stage-special-heading"><span class="map-flag">FASE '+stage.number+' DE 15</span><strong>'+esc(stage.title)+'</strong></div>':"";
}
function renderMaterialList(){let kind=topic,arr=kind==="comprension"?D.readings:kind==="dictado"?D.dictations:D.expressive;if(!arr){go("topics");return;}shell(topBack("topics")+specialStageIntro()+'<div class="material-world">'+WORLD.scene(kind,isMath)+'</div><h1 class="section-title">'+esc(topicById(kind).title)+'</h1><p class="section-lead">'+(kind==="comprension"?"Elige una lectura. Cada historia tiene seis preguntas.":kind==="dictado"?"Escucha por frases o deja que un adulto te dicte.":"Lee en voz alta. Después valora cómo te ha salido.")+'</p><div class="level-grid">'+arr.map((t,i)=>'<button type="button" class="level-card" data-action="pick-material" data-index="'+i+'"><div class="level-icon">'+graphicIcon(kind)+'</div><strong>'+esc(t.title)+'</strong><small>'+((i+1).toString()).padStart(2,"0")+' · '+(kind==="comprension"?"Seis preguntas":kind==="dictado"?"Dictado con corrección":"Lectura y autoevaluación")+'</small></button>').join("")+'</div>');}
function renderProgress(){const n=progress.history.length,correct=progress.history.filter(x=>x.ok).length,pct=n?Math.round(correct/n*100):0,solid=modules.filter(m=>master(m.id).solid).length;
const phases=ST.completedCount(subject,journey),totalStars=stars(),completed=adaptive.rewards?.completed||0,coins=adaptive.rewards?.coins||0;
shell(topBack()+'<h1 class="section-title">🏆 Mi progreso</h1><div class="stat-grid"><div class="stat"><strong>'+phases+'/15</strong><small>Fases completadas</small></div><div class="stat"><strong>'+totalStars+'</strong><small>Estrellas reales</small></div><div class="stat"><strong>'+coins+'</strong><small>Monedas acumuladas</small></div><div class="stat"><strong>'+completed+'</strong><small>Misiones terminadas</small></div><div class="stat"><strong>'+n+'</strong><small>Intentos</small></div><div class="stat"><strong>'+pct+' %</strong><small>Aciertos</small></div><div class="stat"><strong>'+solid+'/'+modules.length+'</strong><small>Territorios dominados</small></div></div><div class="paper"><h2>Mis territorios</h2>'+modules.map(m=>{const s=master(m.id);return '<div style="margin:15px 0"><div class="progress-row"><strong>'+graphicIcon(m.id)+' '+esc(m.title)+'</strong><span>'+s.percent+' %</span></div><div class="meter"><span style="width:'+s.percent+'%"></span></div><small>'+(!s.tried?"Aún no practicado":s.solid?"¡Buen dominio!":"Continúa practicando")+'</small></div>'}).join("")+'<p class="small-note">Dominio orientativo: al menos 5 ejercicios y 80 % de aciertos recientes. No es una nota del colegio.</p>'+(journey.finalAwarded?'<p class="stage-final-badge">🏆 Insignia de las 15 fases conseguida</p>':"")+'</div><div class="action-row">'+button("errors","Repasar mis errores")+button("reset-confirm","Reiniciar mi progreso","","secondary-btn")+'</div>');}
function renderSchedule(){const days=[["20–21 octubre","Descubre todos los contenidos y comprueba cuáles te cuestan."],["22–23 octubre","Practica los apartados en los que has cometido errores."],["24–25 octubre","Repaso general y simulacros de Matemáticas y teoría de Lengua."],["26 octubre","Preguntas de teoría de Lengua. Repaso breve de Matemáticas."],["27 octubre","Prueba escrita de Matemáticas. Actividades de Lengua."],["28 octubre","Lengua: comprensión lectora, escritura y puntuación."],["29 octubre","Comprensión lectora. Prepara el dictado."],["30 octubre","Dictado de Lengua."]];shell(topBack()+'<h1 class="section-title">🗓️ Plan de repaso</h1><div class="paper narrow"><p>Una propuesta para estudiar en sesiones cortas, sin agobios. Puedes jugar cualquier día a cualquier contenido.</p>'+days.map(([date,t])=>'<div class="result-item"><b>'+date+'</b>'+t+'</div>').join("")+'</div>');}
function record(q,ok,usedHints){
const status=AD.status(adaptive,q.topic);
const info=AD.track(adaptive,q,ok,usedHints);
progress.history.push({topic:q.topic,variant:q.variant||"",concept:info.concept,step:status.step,ok:!!ok,hint:usedHints,fingerprint:String(q.fingerprint||q.prompt||"").slice(0,170),date:Date.now()});
if(progress.history.length>500)progress.history=progress.history.slice(-500);
if(!ok){progress.misses.push({topic:q.topic,variant:q.variant||"",concept:info.concept,time:Date.now()});if(progress.misses.length>120)progress.misses=progress.misses.slice(-120);}
else{const i=progress.misses.findIndex(m=>m.topic===q.topic&&m.concept===info.concept);if(i>=0)progress.misses.splice(i,1);}
persist();return info;
}
function exam(){if(isMath){difficulty=2;mode="test";const qs=[];for(const m of modules)qs.push(...generate(m.id,4));startQuiz(qs,"Simulacro de Matemáticas");return;}
view="exam-lang";shell(topBack()+'<h1 class="section-title">📝 Evaluación de Lengua</h1><p class="section-lead">En clase se evaluarán contenidos distintos a lo largo de la semana. Elige el apartado que quieres preparar.</p><div class="menu-grid">'+card("Teoría","Sinónimos, antónimos y comunicación","🧠","lang-test",'data-kind="teoria"')+card("Actividades","Ejercicios variados y puntuación","✏️","lang-test",'data-kind="actividades"')+card("Comprensión","Lectura y seis preguntas","📚","lang-test",'data-kind="comprension"')+card("Dictado","Escucha y escribe","🎧","lang-test",'data-kind="dictado"')+card("Lectura expresiva","Practica la lectura en voz alta","🎭","lang-test",'data-kind="expresiva"')+'</div>');}
function startLangTest(kind){mode="test";difficulty=2;if(kind==="teoria"){const q=["sinonimos","antonimos","comunicacion"].flatMap(t=>generate(t,4));startQuiz(shuffle(q),"Teoría de Lengua");}else if(kind==="actividades"){const q=["sinonimos","antonimos","comunicacion","puntuacion"].flatMap(t=>generate(t,3));startQuiz(shuffle(q),"Actividades de Lengua");}else{topic={comprension:"comprension",dictado:"dictado",expresiva:"expresiva"}[kind];go("material");}}
function errors(){
const pending=AD.pending(adaptive).filter(p=>topicById(p.topic));
if(!pending.length){shell(topBack()+'<section class="paper narrow recovery-hub"><div class="recovery-symbol">🧰</div><h1 class="section-title">Taller de reparaciones</h1><p>No tienes pistas pendientes. Si algún reto cuesta, este taller guardará el concepto y preparará nuevos desafíos para comprenderlo.</p>'+button("topics","Volver al mapa")+'</section>');return;}
const entries=unique(pending.map(p=>p.topic));
shell(topBack()+'<section class="paper recovery-hub"><div class="recovery-symbol">'+(isMath?"⚙️":"🔍")+'</div><h1 class="section-title">'+(isMath?"Taller de reparaciones":"Laboratorio de pistas")+'</h1><p>Aquí investigamos las dificultades, sin castigos ni prisas. Para resolver una pista hay que demostrar varias veces que ya la dominas.</p><div class="repair-grid">'+entries.map(id=>{const m=topicById(id),needs=pending.filter(p=>p.topic===id);return '<button type="button" class="repair-item" data-action="review-world" data-topic="'+id+'">'+graphicIcon(id)+'<span><strong>'+esc(m.title)+'</strong><small>'+needs.length+' conceptos para practicar</small></span><span>→</span></button>'}).join("")+'</div></section>');
}
function enterWorld(id,review=false){
 selectedStageId=null;
 const m=topicById(id);if(!m)return;topic=id;mode=review?"errors":"games";
 if(["comprension","dictado","expresiva"].includes(id)){go("material");return;}
 session={title:(review?"Reparación · ":"Misión · ")+(WORLD.places[id]?.name||m.title),topic:id,review,adaptive:true,target:15,items:[],results:[],seen:new Set()};
 questionIndex=0;answered=null;hintCount=0;response="";miniState=null;
 session.items.push(nextChallenge(id,review));view="quiz";render();
}
function advancedTwoStep(){
const stock=1000+rand(3000),arrival=200+rand(1300),borrow=150+rand(1100);
const answer=stock+arrival-borrow;
let q=qObj("operaciones","contexto","La biblioteca tenía "+fmt(stock)+" libros. Llegaron "+fmt(arrival)+" libros nuevos y se prestaron "+fmt(borrow)+". ¿Cuántos quedan?",fmt(answer),"📚  "+fmt(stock)+"   +   "+fmt(arrival)+"   −   "+fmt(borrow),null,"Primero sumamos: "+fmt(stock)+" + "+fmt(arrival)+" = "+fmt(stock+arrival)+". Después restamos "+fmt(borrow)+" y quedan "+fmt(answer)+".","Resuelve primero la llegada de libros.","Después resta los libros prestados. Comprueba el resultado.",true);
q.concept="operaciones-dos-pasos";return q;
}
function nextChallenge(id,review=false,allowedVariants=null,requiredSign=null){
const st=AD.status(adaptive,id);difficulty=st.tier;questionStep=st.step;
const map={numeros:["a","b","c"],descomponer:["a","b","c"],comparar:["b","a","c"],ordinales:["c","a","b"],operaciones:["a","b","c","d"],sinonimos:["a","b"],antonimos:["a","b"],comunicacion:["a","b"],puntuacion:["a","b","c"]};
const arr=(allowedVariants?.length?allowedVariants:map[id])||["a"];let n=challengeSeq[id]||0;
let force=arr[n%arr.length];
if(review){const needs=AD.pending(adaptive).filter(x=>x.topic===id);if(needs.length&&n%2===0){const v=needs[n%needs.length].variant;if(arr.includes(v))force=v;}}
challengeSeq[id]=n+1;
let source=(id==="operaciones"&&st.step>=4&&n%3===2&&!requiredSign)?advancedTwoStep():makeQuestion(id,force);
if(requiredSign){let tries=0;while(tries++<120&&!String(source.visual).includes(requiredSign))source=makeQuestion(id,force);if(!String(source.visual).includes(requiredSign))throw Error("No se pudo generar operación de signo "+requiredSign);}
if(review&&id==="descomponer"&&AD.pending(adaptive).some(x=>x.topic===id&&x.concept==="valor-posicional-ceros")){
let tries=0;while(tries++<40&&!(String(source.correct)+" "+String(source.visual)).includes("0"))source=makeQuestion(id,"a");
}
let q=null,key="";
const phase=session?.stage?.number||0;
function relevantToStage(exercise){
 if(!phase||session.stage.topics.length!==1)return true;
 if(subject==="math"&&phase===5&&id==="descomponer"){
  const value=String(exercise.correct).replace(/[.\s]/g,"");
  return exercise.variant==="c"?value==="0":value.includes("0");
 }
 if(subject==="lang"&&id==="comunicacion"&&phase===5)return /el (emisor|receptor)\?/i.test(exercise.prompt);
 if(subject==="lang"&&id==="comunicacion"&&phase===6)return /el (mensaje|código|canal)\?/i.test(exercise.prompt);
 return true;
}
for(let attempt=0;attempt<120;attempt++){
 if(!relevantToStage(source)){source=makeQuestion(id,force);continue;}
 if(subject==="lang"&&id==="comunicacion"&&(phase===5||phase===6))source={...source,stageFocusedCommunication:true};
 q=MINI.enrich(source,D,st.step);
 if(!q)throw Error("No se pudo crear el reto de "+id);
 if(q.choices&&!q.mechanic)q.mechanic={type:"scene",values:q.choices};
 key=String(q.fingerprint||[q.topic,q.variant,q.prompt,q.visual||"",q.correct].join("|"));
 if(!session?.seen?.has(key))break;
 // No contar como reto nuevo la misma pregunta con otras opciones.
 const alternate=arr[(n+attempt+1)%arr.length];
 source=(id==="operaciones"&&st.step>=4&&attempt%5===4&&!requiredSign)?advancedTwoStep():makeQuestion(id,attempt<35?force:alternate);
 if(requiredSign){let tries=0;while(tries++<120&&!String(source.visual).includes(requiredSign))source=makeQuestion(id,force);}
 if(review&&id==="descomponer"&&AD.pending(adaptive).some(x=>x.topic===id&&x.concept==="valor-posicional-ceros")){
   let tries=0;
   while(tries++<30&&!(String(source.correct)+" "+String(source.visual)).includes("0"))source=makeQuestion(id,"a");
 }
}
if(session?.seen?.has(key))throw Error("No se pudieron generar retos distintos para "+id);
session?.seen?.add(key);
q.step=st.step;q.fingerprint=key;
miniState=MINI.begin(q);return q;
}
function startQuiz(items,title){session={items:items.map(q=>{const x=MINI.enrich(q,D,AD.status(adaptive,q.topic).step);if(x.choices&&!x.mechanic)x.mechanic={type:"scene",values:x.choices};return x;}),title:title||"Tu desafío",results:[],adaptive:false,target:items.length};questionIndex=0;answered=null;hintCount=0;response="";miniState=MINI.begin(session.items[0]);view="quiz";render();}
function generate(id,count){const out=[],seen=new Set();let attempts=0;while(out.length<count&&attempts<500){attempts++;let q=makeQuestion(id);if(!q)break;let k=q.prompt+"|"+(q.visual||"")+"|"+q.correct;if(seen.has(k))continue;seen.add(k);out.push(q);}return out;}
function sayQuestion(q){if(q.voice)speak(q.voice);else speak(q.prompt.replace(/<[^>]+>/g,""));}
function renderQuiz(){
 if(!session||!session.items.length){go("home");return;}
 const q=session.items[questionIndex],count=session.target||session.items.length,m=topicById(q.topic),ready=answered!==null;
 const meter=Math.round((questionIndex+(ready?1:0))/count*100);
 const stat=AD.status(adaptive,q.topic);
 let input="";
 if(q.mechanic){input=MINI.render(q,miniState||MINI.begin(q),ready);}
 else if(q.choices){input='<div class="options" role="group" aria-label="Respuestas">'+q.choices.map((c,i)=>'<button type="button" class="choice" data-action="choose" data-choice="'+i+'" '+(ready?"disabled":"")+'>'+esc(c)+'</button>').join("")+'</div>';}
 else {input='<label class="mini-label" for="response">'+(q.long?"Escribe tu respuesta:":"Escribe el resultado:")+'</label>'+(q.long?'<textarea id="response" class="field long" spellcheck="false" '+(ready?"disabled":"")+'>'+esc(response)+'</textarea>':'<input id="response" class="field" type="text" inputmode="'+(q.numeric?"numeric":"text")+'" value="'+esc(response)+'" '+(ready?"disabled":"")+'>')+(!ready?'<div class="action-row">'+button("check","Comprobar")+'</div>':"");}
 const avatarKey=(isMath?"tiko":"nara");
 const fb=ready?'<div class="quest-reaction '+(answered.ok?"win":"try")+'" aria-hidden="true"><img class="mission-guide-expression" src="./assets/arte-v4/'+avatarKey+'-'+(answered.ok?"celebra":"pensativo")+'.webp" alt="" width="112" height="112">'+(answered.ok?"✦ ⭐ ✦":"✦")+(answered.ok?AV.rewardMarkup():"")+'</div><div class="feedback '+(answered.ok?"ok":"bad")+'" role="status"><strong>'+(answered.ok?"¡Has conseguido activar la escena!":"Buena investigación. Vamos a entender la pista.")+'</strong><p>'+esc(q.explanation)+'</p>'+(answered.ok?"":'<p><b>Solución:</b> '+esc(q.correct)+'</p><details class="quest-help-lesson"><summary>💡 Ver una explicación con ejemplos</summary>'+m.lesson+'</details>')+'</div>':"";
 const help=!ready?'<div class="hint-tools">'+button("hint","💡 Una pista","","tag-btn")+button("speak-question","🔊 Escuchar","","tag-btn")+'</div>'+(hintCount?'<div class="help-text"><img class="hint-guide-expression" src="./assets/arte-v4/'+(isMath?"tiko":"nara")+'-pista.webp" alt="" width="112" height="112">'+esc(hintCount===1?q.hint1:(q.hint2||q.explanation))+'</div>':""):"";
 shell(topBack("topics")+'<section class="mission-stage"><div class="mission-toolbar"><div><span class="map-flag">✦ '+(session.review?"TALLER DE REPARACIÓN":"MISIÓN INTERACTIVA")+'</span><p>'+esc(session.title)+'</p></div><span class="mission-count">Reto '+(questionIndex+1)+' de '+count+'</span></div><div class="meter" aria-label="Progreso de la misión" style="margin:11px 0 22px"><span style="width:'+meter+'%"></span></div><div class="mission-layout"><div class="mission-pane">'+WORLD.scene(q.topic,isMath,ready?answered.ok:null)+'<span class="q-steps">'+graphicIcon(m.id)+' '+esc(WORLD.places[q.topic]?.name||m.title)+'</span><h1 class="q-title">'+esc(q.prompt)+'</h1>'+(q.sub?'<p class="question-sub">'+esc(q.sub)+'</p>':"")+(q.visual?'<div class="'+(q.reading?"reading":"question-visual")+'">'+esc(q.visual)+'</div>':"")+(!ready?help:"")+'</div><div class="mission-interaction">'+(q.mechanic?'<div class="quest-completion '+(ready?(answered.ok?"activated":"needs-repair"):"active") +'">'+input+'</div>':ready?"":input)+fb+(ready?'<div class="action-row">'+button("next",questionIndex===count-1?"Recibir recompensa →":"Siguiente desafío →")+'</div>':"") +'</div></div></section>');
 saveCheckpoint();
}
function grade(ok,choice,input){
 if(answered!==null)return;const q=session.items[questionIndex];
 answered={ok:!!ok,choice};response=input||"";
 session.results.push({question:q,ok:!!ok,hints:hintCount,given:q.mechanic?(input||"Respuesta interactiva"):q.choices?(q.choices[choice]??"Sin respuesta"):response});
 const info=record(q,ok,hintCount);fx(ok,q,info);renderQuiz();
}
function checkTyped(){if(!session||answered!==null)return;const el=document.getElementById("response");if(!el)return;const v=el.value.trim(),q=session.items[questionIndex];if(!v){el.focus();return;}let ok=false;if(q.numeric){const norm=s=>String(s).replace(/[\s.]/g,"");ok=/^\d+$/.test(norm(v))&&Number(norm(v))===Number(norm(q.correct));}else if(q.exact){ok=v.normalize("NFC").replace(/\s+/g," ").trim()===String(q.correct).normalize("NFC").replace(/\s+/g," ").trim();}else{ok=v.toLocaleLowerCase("es").normalize("NFC").replace(/\s+/g," ")===String(q.correct).toLocaleLowerCase("es").normalize("NFC").replace(/\s+/g," ");}grade(ok,-1,v);}
function next(){
 if(answered===null)return;
 const count=session.target||session.items.length;
 if(questionIndex>=count-1){
   if(session.finished)return;session.finished=true;
   if(session.adaptive){AD.finishMission(adaptive,session.topic,session.results.filter(r=>r.ok).length);persist();}
   finishStage(session.results.filter(r=>r.ok).length,session.results.length);
   AV?.play("mission");view="result";render();return;
 }
 questionIndex++;answered=null;hintCount=0;response="";
 AV?.play("advance");if(session.adaptive)session.items.push(session.stageId?nextStageChallenge():nextChallenge(session.topic,session.review));
 else miniState=MINI.begin(session.items[questionIndex]);
 renderQuiz();
}
function renderStageResult(){
 const stage=ST.getStage(subject,session.stageId),result=session.stageOutcome;
 if(!stage||!result){go("topics");return;}
 const ok=session.results.filter(r=>r.ok).length,count=session.results.length,perfect=ok===count&&!session.special;
 const final=result.justAwarded||(result.finalAwarded&&result.completed===15&&stage.number===15);
 const message=ST.message(subject,stage.number,perfect,result.completed);
 const nextButton=result.next?button("next-stage","▶ IR A LA SIGUIENTE FASE",'data-stage="'+result.next.id+'"',"primary-btn"):"";
 const extra=session.special?'<p class="small-note">'+esc(session.specialSummary||"Actividad realizada y guardada.")+'</p>':"";
 const prize=session.cardReward,assigned=window.LigaCartas?.getAssignment(session.stageId);
 const rewardCard=prize?.card||assigned?.card;
 const rarity=rewardCard?.rareza==="legendaria"?"Legendaria":rewardCard?.rareza==="rara"?"Rara":"Común";
 const rewardMarkup=result.first&&!prize?.alreadyGranted?
  (prize?.saved&&rewardCard?
   '<section class="stage-card-earned" aria-label="Nueva carta conseguida"><span class="stage-card-eyebrow">✦ CARTA CONSEGUIDA ✦</span>'+
   '<h2>'+(prize.duplicate?'¡Has conseguido otra copia de esta carta!':'¡Una nueva carta para tu colección!')+'</h2>'+
   '<img src="./assets/pixel/cartas/'+esc(rewardCard.id.toLowerCase())+'.webp" alt="'+esc(rewardCard.texto_alternativo)+'" width="300" height="420" decoding="async">'+
   '<h3>'+esc(rewardCard.nombre)+'</h3><p class="stage-card-rarity">✦ '+rarity+' · '+esc(rewardCard.id)+' · '+prize.copies+' '+(prize.copies===1?'copia':'copias')+'</p>'+
   '<p>'+esc(rewardCard.descripcion)+'</p><p class="stage-card-power-note">Su poder todavía no está activo en el juego.</p>'+
   button("collection","🃏 VER MI COLECCIÓN","","secondary-btn")+'</section>':
   '<p class="stage-card-warning" role="alert">No se ha podido confirmar el guardado de esta recompensa. Evita cerrar el juego y comprueba que tu navegador permite guardar datos.</p>'):
  (rewardCard?'<p class="stage-card-repeat">Esta fase ya entregó su carta: '+esc(rewardCard.nombre)+'. Puedes verla en tu colección.</p>':"");
 const score=session.special?
  '<p class="stage-score-special">'+esc(session.special==="dictado"?"1 dictado revisado":"1 lectura expresiva practicada")+'</p>':
  '<div class="score-big">'+ok+' / '+count+'</div><p>'+count+' retos realizados · '+ok+' respuestas correctas</p>';
 shell(topBack("topics")+'<section class="paper narrow mission-victory stage-victory" aria-live="polite">'+AV.missionMarkup()+
 '<span class="map-flag">FASE '+stage.number+' COMPLETADA</span>'+
 '<h1 class="section-title stage-victory-name">'+esc(stage.title)+'</h1>'+
 '<img class="victory-guide" src="./assets/portada/'+(isMath?"tiko-portada":"nara-portada")+'.webp" alt="" width="240" height="270" decoding="async">'+
 '<span class="stage-finish-medal" aria-hidden="true">★</span><span class="pixel-chest" aria-hidden="true">✧ ◆ ✧</span>'+
 '<p class="stage-victory-message">'+esc(message)+'</p>'+
 score+extra+rewardMarkup+
 '<div class="quest-summary victory-rewards"><span>⭐ '+(session.special?"Actividad completada":ok+" estrellas conseguidas")+'</span>'+
 '<span>🪙 '+(adaptive.rewards?.coins||0)+' monedas acumuladas'+(session.stageBonus?' · +'+session.stageBonus+' por nueva fase/logro':'')+'</span>'+
 '<span>✦ '+result.completed+' / 15 fases</span></div>'+
 (final?'<div class="stage-final-badge" role="status">🏆 ¡Insignia especial! Has completado las quince fases de esta aventura.</div>':"")+
 (!session.special&&session.results.some(r=>!r.ok)?'<details class="quest-review"><summary>Ver las pistas para mejorar</summary>'+
 session.results.filter(r=>!r.ok).map(x=>'<p><strong>'+esc(x.question.prompt)+'</strong><br>'+esc(x.question.explanation)+'</p>').join("")+'</details>':"")+
 '<div class="action-row">'+nextButton+
 button("topics","🗺️ VOLVER AL MAPA","","secondary-btn")+
 button("repeat-stage","↻ Repetir fase",'data-stage="'+stage.id+'"',"secondary-btn")+'</div></section>');
}
function renderResult(){
 if(!session){go("home");return;}
 if(session.stageId)return renderStageResult();
 const results=session.results,ok=results.filter(x=>x.ok).length,pct=results.length?Math.round(ok/results.length*100):0;
 const misses=results.filter(x=>!x.ok);
 const stat=AD.status(adaptive,session.topic||results[0]?.question.topic||modules[0].id);
 shell(topBack("topics")+'<section class="paper narrow mission-victory">'+AV.missionMarkup()+'<div class="victory-stars" aria-hidden="true">✦ 🏆 ✦</div><span class="map-flag">MISIÓN COMPLETADA</span><h1 class="section-title">¡El mundo celebra tu esfuerzo!</h1><div class="score-big">'+ok+' / '+results.length+'</div><p>Has descubierto nuevas pistas y ganado experiencia. '+(pct>=80?"¡Vas por buen camino!":"Repasar también forma parte de la aventura.")+'</p><div class="quest-summary victory-rewards"><span>⭐ '+ok+' estrellas</span><span>🪙 '+(adaptive.rewards?.coins||0)+' monedas acumuladas</span><span>✦ '+stat.name+'</span></div>'+
 (misses.length?'<details class="quest-review"><summary>Ver las pistas que podemos mejorar ('+misses.length+')</summary>'+misses.map(x=>'<p><strong>'+esc(x.question.prompt)+'</strong><br>'+esc(x.question.explanation)+'</p>').join("")+'</details>':"")+
 '<div class="action-row">'+(session.adaptive?button("continue-mission","▶ Otra misión en este mundo"):"")+
 button("topics","🗺️ Mapa de mundos","","secondary-btn")+button("errors","🧰 Mis errores","","secondary-btn")+'</div></section>');
}
const smallNames=["","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez","once","doce","trece","catorce","quince","dieciséis","diecisiete","dieciocho","diecinueve","veinte","veintiuno","veintidós","veintitrés","veinticuatro","veinticinco","veintiséis","veintisiete","veintiocho","veintinueve"];
const tens=["","","veinte","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"];
const hundreds=["","ciento","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];
function numberWords(n){if(n===0)return "cero";if(n>=1000){let th=Math.floor(n/1000),rest=n%1000;let pre=th===1?"mil":numberWords(th)+" mil";return pre+(rest?" "+numberWords(rest):"");}if(n===100)return "cien";if(n>=100){let h=Math.floor(n/100),rest=n%100;return hundreds[h]+(rest?" "+numberWords(rest):"");}if(n<30)return smallNames[n];let d=Math.floor(n/10),u=n%10;return tens[d]+(u?" y "+smallNames[u]:"");}
function qObj(topic,variant,prompt,correct,visual="",choices=null,explanation="",hint1="",hint2="",numeric=false){return {topic,variant,prompt,correct:String(correct),visual,choices,explanation:explanation||("La respuesta es "+correct+"."),hint1:hint1||"Lee con calma y observa los detalles.",hint2:hint2||"Busca la información importante en la pregunta.",numeric};}
function optionsFrom(correct,rest){return shuffle(unique([String(correct),...rest.map(String)]).slice(0,4));}
function numberDifficulty(){return difficulty===1?1000:difficulty===2?6000:10000;}
function randNumber(){const max=numberDifficulty();if(difficulty===1)return rand(1000);if(difficulty===2)return 1000+rand(3000+Math.min(questionStep,2)*1700);return 1000+rand(9000);}
function placeValue(n,place){return Math.floor(n/Math.pow(10,place))%10;}
function decomp(n){return [3,2,1,0].map(p=>placeValue(n,p)*Math.pow(10,p)).filter(x=>x).map(fmt).join(" + ")||"0";}
function vertical(a,b,sign){const fmtNum=n=>String(n).padStart(4," ");return sign+" "+fmtNum(a)+"\n  "+fmtNum(b)+"\n──────";}
function makeQuestion(t,forcedVariant){const topic=topicById(t);if(!topic)return null;const variant=forcedVariant||pick(t==="numeros"?["a","b","c"]:t==="descomponer"?["a","b","c"]:t==="comparar"?["a","b","c"]:t==="ordinales"?["a","b","c"]:t==="operaciones"?["a","b","c","d"]:t==="sinonimos"||t==="antonimos"?["a","b"]:t==="comunicacion"?["a","b"]:t==="puntuacion"?["a","b","c"]:["a"]);
if(t==="numeros"){let n=randNumber();if(variant==="a")return qObj(t,variant,"Escribe con cifras: «"+numberWords(n)+"»",fmt(n),"",null,"El número "+fmt(n)+" se lee «"+numberWords(n)+"».","Escucha y separa millares, centenas, decenas y unidades.","Recuerda que los ceros también ocupan un lugar.",true);
if(variant==="b"){let c=numberWords(n),alts=[n+10,n+100,n+1,n-10].filter(x=>x>=0&&x<=9999&&x!==n).map(numberWords);return qObj(t,variant,"¿Cómo se lee el número "+fmt(n)+"?",c,"",optionsFrom(c,alts),"Se lee «"+c+"».","Empieza por los millares y sigue hacia la derecha.","Fíjate en las posiciones que contienen un cero.");}
let p=rand(4),v=placeValue(n,p),labels=["unidades","decenas","centenas","unidades de millar"];return qObj(t,variant,"¿Qué cifra ocupa el lugar de las "+labels[p]+" en "+fmt(n)+"?",v,"UM   C   D   U",optionsFrom(v,[0,1,2,3,4,5,6,7,8,9].filter(x=>x!==v).sort(()=>Math.random()-.5).slice(0,3)),"En "+fmt(n)+", la cifra de las "+labels[p]+" es "+v+".","Cuenta las posiciones desde la derecha: U, D, C y UM.");}
if(t==="descomponer"){let n=randNumber(),dec=decomp(n);if(variant==="a")return qObj(t,variant,"¿Qué número forman estas cantidades?",fmt(n),dec,null,dec+" = "+fmt(n)+".","Suma millares, centenas, decenas y unidades.","Suma primero las cantidades más grandes.",true);
if(variant==="b"){let alts=unique([n+10,n+100,n-10,n+1].filter(x=>x>=0&&x<10000).map(decomp));return qObj(t,variant,"¿Cuál es la descomposición de "+fmt(n)+"?",dec,"",optionsFrom(dec,alts),"La descomposición es "+dec+".","Cada cifra vale su cantidad según la columna.","Los ceros pueden omitirse al sumar.");}
let p=rand(4),val=placeValue(n,p)*Math.pow(10,p),labels=["unidades","decenas","centenas","unidades de millar"];return qObj(t,variant,"En "+fmt(n)+", ¿cuánto valen las "+labels[p]+"?",fmt(val),"",optionsFrom(fmt(val),[placeValue(n,p),val+10,val+100,val*10].map(fmt)),"Las "+labels[p]+" aportan "+fmt(val)+" al número.","Multiplica la cifra por el valor de su posición.");}
if(t==="comparar"){let a=randNumber(),b=randNumber();if(variant==="a"){if(rand(5)===0)b=a;return qObj(t,variant,"Elige el signo correcto entre estos números",a>b?">":a<b?"<":"=",fmt(a)+"   ?   "+fmt(b),shuffle([">","<","="]),fmt(a)+(a>b?" es mayor que ":a<b?" es menor que ":" es igual que ")+fmt(b)+".","Compara primero los millares.","Si empatan, compara las centenas, decenas y unidades.");}
if(variant==="b"){let seq=unique([a,b,a+10,a+100].filter(x=>x<10000));while(seq.length<4){const x=randNumber();if(!seq.includes(x))seq.push(x);}seq=shuffle(seq).slice(0,4);let correct=seq.slice().sort((x,y)=>x-y).map(fmt).join(" → ");let opts=optionsFrom(correct,[seq.slice().sort((x,y)=>y-x).map(fmt).join(" → "),seq.map(fmt).join(" → "),shuffle(seq).map(fmt).join(" → ")]);let limit=0;while(opts.length<4&&limit++<20){const another=shuffle(seq).map(fmt).join(" → ");opts=optionsFrom(correct,[...opts,another]);}return qObj(t,variant,"¿Cuál es el orden ASCENDENTE (de menor a mayor)?",correct,seq.map(fmt).join(" · "),opts,"De menor a mayor: "+correct+".","Empieza por el número más pequeño.");}
let arr=unique([a,b,randNumber(),randNumber()]);while(arr.length<4){let x=randNumber();if(!arr.includes(x))arr.push(x);}const ask=rand(2)===0,correct=ask?Math.max(...arr):Math.min(...arr);return qObj(t,variant,ask?"¿Cuál es el número MAYOR?":"¿Cuál es el número MENOR?",fmt(correct),arr.map(fmt).join(" · "),shuffle(arr.map(fmt)),"La respuesta es "+fmt(correct)+".","Observa primero los millares.");}
if(t==="ordinales"){const masc=["primero","segundo","tercero","cuarto","quinto","sexto","séptimo","octavo","noveno","décimo"],fem=["primera","segunda","tercera","cuarta","quinta","sexta","séptima","octava","novena","décima"];let n=1+rand(10),female=rand(2)===0,words=female?fem:masc; if(variant==="a"){let opts=shuffle(unique([words[n-1],words[(n+1)%10],words[(n+3)%10],words[(n+6)%10]]));return qObj(t,variant,"¿Cómo se dice el puesto "+n+(female?".ª":".º")+"?",words[n-1],"",opts,"La posición "+n+(female?".ª":".º")+" es "+words[n-1]+".","Los ordinales indican una posición.");}
if(variant==="b"){let cardinal=rand(2)===0,word=cardinal?["uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez"][n-1]:words[n-1];return qObj(t,variant,"La palabra «"+word+"» es un número…",cardinal?"cardinal":"ordinal","",["cardinal","ordinal"],"«"+word+"» "+(cardinal?"expresa una cantidad.":"indica una posición.") ,"¿Indica cuántos hay o qué lugar ocupa?");}
let symbols=["🐢","🦊","🐸","🐰","🐼","🐨","🐻","🦉","🐯","🐙"],pos=1+rand(10);return qObj(t,variant,"En la fila, ¿qué animal ocupa el puesto "+words[pos-1]+"? (de izquierda a derecha)",symbols[pos-1],symbols.map((x,i)=>(i+1)+". "+x).join("   "),shuffle(symbols),"Cuenta los puestos desde la izquierda, empezando por uno.","El primero está más a la izquierda.");}
if(t==="operaciones"){let a,b,sign=rand(2)===0?"+":"−";let lim=difficulty===1?1000:difficulty===2?Math.min(10000,5500+questionStep*1300):10000;if(sign==="+"){a=1+rand(Math.min(lim-1,4500));b=1+rand(Math.min(lim-a,3500));}else{a=1+rand(lim-1);b=rand(a+1);}const ans=sign==="+"?a+b:a-b;const vis=(variant==="b"||variant==="d")?vertical(a,b,sign):fmt(a)+" "+sign+" "+fmt(b)+" = ?";
const exp=fmt(a)+" "+sign+" "+fmt(b)+" = "+fmt(ans)+". "+(sign==="+"?"Suma por columnas desde las unidades y recuerda llevar cuando una columna llega a diez.":"Resta por columnas desde las unidades. Si no alcanza una cifra, reagrupa la columna de la izquierda.");
if(variant==="c"){const alt=optionsFrom(fmt(ans),[ans+10,ans-10,ans+100,ans+1,ans-1].filter(x=>x>=0&&x<10000).map(fmt));return qObj(t,variant,"¿Cuál es el resultado correcto?",fmt(ans),vis,alt,exp,"Calcula desde la columna de las unidades.","Comprueba cada columna de derecha a izquierda.");}
return qObj(t,variant,sign==="+"?"Resuelve esta suma":"Resuelve esta resta",fmt(ans),vis,null,exp,"Coloca unidades debajo de unidades y empieza por la derecha.",sign==="+"?"Cuando una columna da diez o más, lleva a la siguiente.":"Si falta cantidad para restar, cambia una decena por diez unidades.",true);}
if(t==="sinonimos"||t==="antonimos"){const pool=t==="sinonimos"?D.synonyms:D.antonyms;const pair=pick(pool);const from=pair[0],correct=pair[1];const wrong=shuffle(unique(pool.filter(p=>p[0]!==from&&p[1]!==correct&&p[0]!==correct).map(p=>p[1]))).filter(x=>x.toLowerCase()!==correct.toLowerCase()&&x.toLowerCase()!==from.toLowerCase());const choices=optionsFrom(correct,wrong.slice(0,3));return qObj(t,variant,variant==="a"?"¿Cuál es el "+(t==="sinonimos"?"SINÓNIMO":"ANTÓNIMO")+" de «"+from+"»?":"Selecciona la palabra que "+(t==="sinonimos"?"significa algo parecido a":"significa lo contrario de")+" «"+from+"».",correct,"",choices,"«"+from+"» y «"+correct+"» son "+(t==="sinonimos"?"sinónimos":"antónimos")+".",t==="sinonimos"?"Piensa en otra palabra que tenga un significado parecido.":"Busca una palabra que exprese lo contrario.");}
if(t==="comunicacion"){const row=pick(D.communications);const fields=["emisor","receptor","mensaje","código","canal"],idx=1+rand(5),key=fields[idx-1],correct=row[idx];const others=unique(shuffle(D.communications.map(x=>x[idx])).filter(x=>x!==correct));const choices=optionsFrom(correct,others.slice(0,3));return qObj(t,variant,"En esta situación, ¿cuál es el "+key+"?",correct,row[0],choices,"El "+key+" es «"+correct+"». Emisor: quien envía; receptor: quien recibe; mensaje: lo que se dice; código: los signos; canal: el medio.","Piensa qué significa «"+key+"» en una comunicación.","Recuerda quién habla, a quién, qué comunica y cómo llega.");}
if(t==="puntuacion"){const row=pick(D.punctuation);if(variant==="a"){const txt=row[0].split("\n\n")[0];const wrong=txt.replace(/(^|[.!?]\s+)([A-ZÁÉÍÓÚÑ])/g,(full,p,c)=>p+c.toLowerCase());let q=qObj(t,variant,"Escribe el texto utilizando las MAYÚSCULAS correctamente.",txt,wrong,null,"Recuerda: mayúscula inicial y después de punto.","La primera letra del escrito va en mayúscula.","Después de cada punto, la siguiente oración empieza con mayúscula.",false);q.exact=true;q.long=true;return q;}
if(variant==="b"){const txt=row[0].split("\n\n")[0];const wrong=txt.charAt(0).toLowerCase()+txt.slice(1);const alts=[wrong,txt.replace(/([.!?]\s+)([A-ZÁÉÍÓÚÑ])/g,(f,p,c)=>p+c.toLowerCase()),txt.replace(/([a-záéíóúñ])([.!?])/g,(f,a,p)=>a.toUpperCase()+p)];return qObj(t,variant,"¿Qué versión utiliza bien las MAYÚSCULAS?",txt,"",optionsFrom(txt,alts),"El texto correcto es: "+txt,"La primera letra y las que van después de punto deben ser mayúsculas.");}
const isAparte=row[1]==="aparte";const visual=isAparte?row[0]:row[0].split("\n\n")[0];return qObj(t,variant,isAparte?"¿Qué tipo de punto separa el primer párrafo del segundo?":"¿Qué tipo de punto separa las dos primeras oraciones?",isAparte?"punto y aparte":"punto y seguido",visual,["punto y seguido","punto y aparte"],isAparte?"Después de ese punto comienza otro párrafo, en una línea nueva.":"Después del punto se continúa escribiendo en el mismo párrafo.","¿El texto continúa en el mismo párrafo o empieza otro?");}
return null;}
function normWord(s){return String(s).toLocaleLowerCase("es").normalize("NFC").replace(/[.,!?¡¿;:«»"“”]/g,"").trim();}
function makeReadingQuestions(i){const r=D.readings[i],pool=D.readings.filter((x,n)=>n!==i);return r.qa.map((qa,j)=>{const candidates=shuffle(unique(pool.map(p=>p.qa[j]?.[1]).filter(Boolean))).filter(a=>normWord(a)!==normWord(qa[1]));const options=optionsFrom(qa[1],candidates.slice(0,3));let q=qObj("comprension","r"+i,r.qa[j][0],qa[1],r.text,options,"Según la lectura, la respuesta es: "+qa[1],"Busca en la historia la parte relacionada con la pregunta.");q.reading=true;q.sub="Lectura: "+r.title;return q;});}
function startReading(i){
 const qs=makeReadingQuestions(i);mode=mode==="test"?"test":"practice";
 startQuiz(qs,"Lectura · "+D.readings[i].title);
 const stage=ST.getStage(subject,selectedStageId);
 if(stage?.special==="comprension"){session.stageId=stage.id;session.stage=stage;session.topic="comprension";session.title="Fase "+stage.number+" · "+stage.title+" · "+D.readings[i].title;renderQuiz();}
}
function sentences(text){return text.replace(/\n+/g," ").match(/[^.!?]+[.!?]+/g)?.map(x=>x.trim())||[text];}
function renderDictation(){const d=D.dictations[materialIndex];if(!d){go("material");return;}let ss=sentences(d.text);shell(topBack("material")+specialStageIntro()+'<h1 class="section-title">🎧 '+esc(d.title)+'</h1><div class="paper narrow"><p>Escucha cada frase tantas veces como necesites. Un adulto también puede ayudarte a dictarla.</p><p class="voice-indicator" id="voice-status" role="status" aria-live="polite">Pulsa una frase para escucharla. La voz depende de tu navegador.</p><div class="filter-row">'+ss.map((s,i)=>button("dictate-sentence","🔊 Frase "+(i+1),'data-index="'+i+'"',"secondary-btn")).join("")+'</div><div class="action-row">'+button("dictate-all","🔊 Escuchar todo")+button("adult-toggle",dictationShow?"Ocultar texto del adulto":"👪 Modo con adulto","","secondary-btn")+'</div>'+(dictationShow?'<details open><summary><b>Texto para la persona adulta</b></summary><p class="reading">'+esc(d.text)+'</p></details>':"")+'<label class="mini-label" for="dict-response">Escribe aquí tu dictado (pulsa Intro dos veces para cambiar de párrafo):</label><textarea id="dict-response" class="field long" rows="8" style="min-height:230px" spellcheck="false" placeholder="Escucha y escribe…">'+esc(dictationDraft)+'</textarea><div class="action-row">'+button("dict-check","Corregir mi dictado",dictationChecked?'disabled aria-disabled="true"':"")+'</div><div id="dict-feedback" aria-live="polite">'+dictationResult+'</div></div>');}
function normSpaces(s){return s.replace(/\r/g,"").trim().replace(/[ \t]+/g," ").replace(/[ \t]*\n[ \t]*/g,"\n");}
function dictCheck(){if(dictationChecked)return;const typed=document.getElementById("dict-response")?.value||"",correct=D.dictations[materialIndex].text;dictationDraft=typed;const root=document.getElementById("dict-feedback");if(!typed.trim()){root.innerHTML='<div class="feedback bad">Escribe primero lo que has escuchado.</div>';return;}
const a=normSpaces(typed),b=normSpaces(correct),ok=a===b;
const letters=s=>s.toLocaleLowerCase("es").normalize("NFC").replace(/[.,!?¡¿;:«»"“”]/g,"").replace(/\s+/g," ").trim();
const stripPunctuation=s=>s.replace(/[.,!?¡¿;:«»"“”]/g,"").replace(/\s+/g," ").trim();
const wordSame=letters(a)===letters(b),capSame=stripPunctuation(a)===stripPunctuation(b);
let msgs=[];if(!wordSame)msgs.push("Hay diferencias entre las palabras escritas y el texto original.");if(!capSame)msgs.push("Revisa también las mayúsculas al inicio y después de cada punto.");if((a.match(/[.!?]/g)||[]).join("")!==(b.match(/[.!?]/g)||[]).join(""))msgs.push("Comprueba los puntos y la puntuación.");if((a.match(/\n\s*\n/g)||[]).length!==(b.match(/\n\s*\n/g)||[]).length)msgs.push("Comprueba los cambios de párrafo: deja una línea en blanco entre ellos.");if(!msgs.length&&!ok)msgs.push("Hay alguna diferencia de mayúsculas, espacios o formato.");
root.innerHTML='<div class="feedback '+(ok?"ok":"bad")+'"><strong>'+(ok?"¡Dictado perfecto!":"¡Buen intento! Revisa estas pistas:")+'</strong><p>'+esc(ok?"Has escrito el texto como en el modelo.":msgs.join(" "))+'</p></div><details><summary><b>Ver dictado correcto y comparar</b></summary><div class="reading">'+esc(correct)+'</div></details><p class="small-note">La comparación es orientativa. Revisa las diferencias con un adulto si tienes dudas.</p>';
dictationResult=root.innerHTML;dictationChecked=true;dictationWasCorrect=ok;const btn=document.querySelector?.('[data-action="dict-check"]');if(btn)btn.disabled=true;const q={topic:"dictado",variant:"d"+materialIndex};record(q,ok,0);fx(ok,q);if(ok){root.classList?.add?.("dictado-celebration");root.insertAdjacentHTML?.("afterbegin",'<div class="dictado-stamp" aria-hidden="true">✦ ¡Misterio resuelto! ✦'+AV.rewardMarkup()+'</div>');}
const stage=ST.getStage(subject,selectedStageId);
if(stage?.special==="dictado"){
 root.insertAdjacentHTML("beforeend",'<div class="action-row">'+button("finish-special","★ Terminar fase y recibir recompensa →")+'</div>');
 dictationResult=root.innerHTML;
}}
function renderExpressive(){const x=D.expressive[materialIndex];if(!x){go("material");return;}shell(topBack("material")+specialStageIntro()+'<h1 class="section-title">🎭 '+esc(x.title)+'</h1><div class="paper narrow"><p>Lee en voz alta, sin prisa, como si estuvieras representando una historia.</p><p class="voice-indicator" id="voice-status" role="status" aria-live="polite">Pulsa «Escuchar ejemplo» para solicitar la locución.</p><div class="reading">'+esc(x.text)+'</div><div class="action-row">'+button("expressive-speak","🔊 Escuchar ejemplo")+'</div><h2>¿Cómo ha ido la lectura?</h2><p class="small-note">Marca con ayuda de un adulto lo que has conseguido. Esta actividad no analiza el micrófono.</p>'+["He pronunciado las palabras con claridad.","He leído a un ritmo cómodo.","He hecho pausas en los puntos.","He utilizado una entonación adecuada."].map((x,i)=>'<label class="tick"><input type="checkbox" class="self-check" value="'+i+'">'+esc(x)+'</label>').join("")+'<div class="action-row">'+button("expressive-save","Guardar mi práctica",expressiveSaved?'disabled aria-disabled="true"':"")+'</div><div id="expressive-feedback" aria-live="polite">'+expressiveResult+'</div></div>');}
function saveExpressive(){
 if(expressiveSaved)return;
 expressiveSaved=true;
 const checks=[...document.querySelectorAll(".self-check")],done=checks.filter(x=>x.checked).length;
 expressiveScore=done;
 record({topic:"expresiva",variant:"e"+materialIndex},done===4,0);
 AV?.play(done===4?"star":"select");
 const stage=ST.getStage(subject,selectedStageId);
 document.getElementById("expressive-feedback").innerHTML=
 '<div class="feedback ok"><strong>¡Lectura practicada!</strong><p>Has marcado '+done+' de 4 aspectos. '+
 (done===4?"¡Sigue así!":"Puedes volver a leer para mejorar los que faltan.")+'</p></div>'+
 (done===4?'<div class="theatre-applause" aria-hidden="true">✦ ★ ¡Bravo! ★ ✦'+AV.rewardMarkup()+'</div>':"")+
 (stage?.special==="expresiva"?'<div class="action-row">'+button("finish-special","★ Terminar fase y recibir recompensa →")+'</div>':"");
 expressiveResult=document.getElementById("expressive-feedback").innerHTML;
}
function finishSpecialStage(){
 const stage=ST.getStage(subject,selectedStageId);
 if(!stage||!["dictation","expressive"].includes(view))return;
 const dict=view==="dictation";
 if(stage.special!==(dict?"dictado":"expresiva")||(dict?!dictationChecked:!expressiveSaved))return;
 const ok=dict?dictationWasCorrect:expressiveScore===4;
 session={title:"Fase "+stage.number+" · "+stage.title,stageId:stage.id,stage,topic:stage.topics[0],
  review:false,adaptive:false,finished:true,special:stage.special,target:1,items:[],
  results:[{question:{topic:stage.topics[0],prompt:stage.title,explanation:"Actividad practicada."},ok}],
  specialSummary:dict?
   (ok?"Has revisado el dictado y coincide con el texto original.":"Has revisado el dictado y descubierto aspectos que puedes seguir practicando."):
   ("Práctica guardada: "+expressiveScore+" de 4 aspectos de autoevaluación marcados. No se ha evaluado tu pronunciación automáticamente.")
 };
 finishStage(ok?1:0,1);
 AV?.play("mission");view="result";render();
}
function startMemory(){const pool=topic==="sinonimos"?D.synonyms:D.antonyms;let selected=[],seen=new Set();for(let pair of shuffle(pool)){if(!seen.has(pair[0])&&!seen.has(pair[1])){selected.push(pair);seen.add(pair[0]);seen.add(pair[1]);}if(selected.length===4)break;}const cards=shuffle(selected.flatMap((p,i)=>[{id:i,side:0,word:p[0]},{id:i,side:1,word:p[1]}]));memoryState={cards,open:[],matched:[],attempts:0,message:""};view="memory";renderMemory();}
function renderMemory(){if(!memoryState){go("home");return;}const m=memoryState,done=m.matched.length===4;const cards=m.cards.map((c,i)=>{const shown=m.open.includes(i)||m.matched.includes(c.id);return '<button type="button" class="memory-card '+(m.matched.includes(c.id)?"memory-found":"")+'" data-action="memory-flip" data-index="'+i+'" '+(shown?"disabled":"")+' aria-label="'+(shown?esc(c.word):"Descubrir tarjeta "+(i+1))+'">'+(shown?esc(c.word):"✦ ? ✦")+'</button>';}).join("");shell(topBack("topics")+'<h1 class="section-title">🃏 Memory de '+(topic==="sinonimos"?"sinónimos":"antónimos")+'</h1><p class="section-lead">Busca cuatro parejas de palabras '+(topic==="sinonimos"?"con significado parecido":"de significado contrario")+'. Puedes pulsar las tarjetas.</p><div class="paper narrow"><div class="progress-row"><span>Parejas encontradas: '+m.matched.length+' / 4</span><span>Intentos: '+m.attempts+'</span></div><div class="memory-grid">'+cards+'</div><div class="action-row">'+(done?button("memory-start","¡Otra partida!"):m.open.length===2&&!m.matched.includes(m.cards[m.open[0]].id)?button("memory-clear","Seguir intentando"):button("topics","Volver a misiones",'data-mode="games"',"secondary-btn"))+'</div><p class="feedback '+(done?"ok":"")+'" role="status">'+esc(done?"¡Todas las parejas encontradas!":m.message||"Destapa dos tarjetas para buscar una pareja.")+'</p></div>');}
function flipMemory(i){const m=memoryState;if(!m||m.open.length>=2||m.open.includes(i)||m.matched.includes(m.cards[i]?.id))return;m.open.push(i);if(m.open.length===2){m.attempts++;const c=m.cards[m.open[0]],d=m.cards[m.open[1]];if(c.id===d.id&&c.side!==d.side){m.matched.push(c.id);m.message="¡Pareja encontrada! "+c.word+" y "+d.word+".";m.open=[];record({topic,variant:"memory"},true,0);if(m.matched.length===4)fx(true);else AV?.play("link");}else{m.message="Estas palabras no forman pareja. Observa y pulsa «Seguir intentando».";fx(false);}}renderMemory();}
let pressedControl=null;
document.addEventListener("pointerdown",e=>{
 const el=e.target.closest?.('button,a.header-main-menu,a.brand');
 if(el&&!el.disabled){pressedControl?.classList?.remove?.("is-pressed");pressedControl=el;el.classList?.add?.("is-pressed");if(el.matches?.(".header-main-menu, .brand"))AV?.play("portal");}
},{passive:true});
for(const type of ["pointerup","pointercancel","dragend"])document.addEventListener(type,e=>{
 pressedControl?.classList?.remove?.("is-pressed");pressedControl=null;
 e.target.closest?.('button,a.header-main-menu,a.brand')?.classList?.remove?.("is-pressed");
},{passive:true});
document.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;const el=e.target.closest?.('button,a.header-main-menu,a.brand');if(el&&!el.disabled)el.classList?.add?.("is-pressed");});
document.addEventListener("keyup",e=>{if(e.key!=="Enter"&&e.key!==" ")return;e.target.closest?.('button,a.header-main-menu,a.brand')?.classList?.remove?.("is-pressed");});
document.addEventListener("click",function(ev){const el=ev.target.closest("[data-action]");if(!el)return;const a=el.dataset.action;const t=el.dataset.topic;AV.onAction(a,el.dataset);if(a==="leave"){location.href="./index.html";return;}if(a==="collection"){window.LigaPixelUI?.openCollection?.();return;}if(a==="sound"){response=document.getElementById("response")?.value||response;dictationDraft=document.getElementById("dict-response")?.value??dictationDraft;soundEnabled=AV.setEnabled(!soundEnabled);if(soundEnabled){AV.unlock?.();AV.play("toggle");}render();return;}if(a==="home"){go("home");return;}if(a==="topics"){mode="games";go("topics");return;}if(a==="resume-stage"){resumeStage();return;}if(a==="start-stage"){startStage(el.dataset.stage);return;}
if(a==="next-stage"){startStage(el.dataset.stage);return;}
if(a==="repeat-stage"){startStage(el.dataset.stage);return;}
if(a==="finish-special"){finishSpecialStage();return;}
if(a==="enter-world"){enterWorld(t||topic);return;}if(a==="review-world"){enterWorld(t||topic,true);return;}if(a==="continue-mission"){enterWorld(session.topic,session.review);return;}if(a==="lesson"){topic=t;go("lesson");return;}if(a==="setup"){enterWorld(t||topic);return;}if(a==="material"){topic=t||topic;go("material");return;}if(a==="pick-material"){materialIndex=Number(el.dataset.index);dictationShow=false;dictationDraft="";dictationChecked=false;dictationResult="";expressiveSaved=false;expressiveResult="";if(topic==="comprension"){startReading(materialIndex);return;}go(topic==="dictado"?"dictation":"expressive");return;}if(a==="check"){checkTyped();return;}if(a==="mini"){if(!session||answered!==null)return;const q=session.items[questionIndex],act=el.dataset.mini,val=el.dataset.value||"",prior={digits:miniState.digits,chosen:miniState.chosen.length,linked:miniState.linked.length},out=MINI.act(q,miniState,act,val);miniState=out.state;if(out.done){grade(out.ok,-1,out.given);}else{AV?.onMini?.(act,out,q,prior);renderQuiz();try{const next=document.querySelector('[data-action="mini"][data-mini="'+act+'"][data-value="'+val+'"]');next?.focus?.({preventScroll:true});}catch(e){}}return;}if(a==="choose"){if(!session||answered!==null)return;const ix=Number(el.dataset.choice),q=session.items[questionIndex];grade(String(q.choices[ix])===String(q.correct),ix,"");return;}if(a==="next"){next();return;}if(a==="hint"){response=document.getElementById("response")?.value||response;hintCount=Math.min(2,hintCount+1);renderQuiz();return;}if(a==="speak-question"){sayQuestion(session.items[questionIndex]);return;}if(a==="exam"){exam();return;}if(a==="lang-test"){startLangTest(el.dataset.kind);return;}if(a==="errors"){errors();return;}if(a==="progress"){go("progress");return;}if(a==="schedule"){go("schedule");return;}if(a==="reset-confirm"){if(confirm("¿Seguro que quieres borrar todo el progreso de esta asignatura en este dispositivo?")){progress.history=[];progress.misses=[];progress.badges=[];AD.reset(adaptive);Object.assign(journey,{version:1,active:ST.getStages(subject)[0].id,completed:{},finalAwarded:false,previous:null});selectedStageId=null;window.LigaPartida?.clearCheckpoint(subject,progress);persist();renderProgress();}return;}if(a==="dictate-sentence"){speak(sentences(D.dictations[materialIndex].text)[Number(el.dataset.index)]||"");return;}if(a==="dictate-all"){speak(D.dictations[materialIndex].text.replace(/\n\n/g,". "));return;}if(a==="adult-toggle"){dictationDraft=document.getElementById("dict-response")?.value||"";dictationShow=!dictationShow;renderDictation();return;}if(a==="dict-check"){dictCheck();return;}if(a==="expressive-speak"){speak(D.expressive[materialIndex].text);return;}if(a==="expressive-save"){saveExpressive();el.disabled=true;return;}if(a==="memory-start"){startMemory();return;}if(a==="memory-flip"){flipMemory(Number(el.dataset.index));return;}if(a==="memory-clear"){memoryState.open=[];memoryState.message="";renderMemory();return;}});
/* Arrastrar y soltar opcional: todas las mecánicas mantienen la alternativa táctil por pulsaciones. */
document.addEventListener("dragstart",e=>{
const el=e.target.closest?.("[data-drag-kind]");
if(!el||!session||answered!==null||!e.dataTransfer)return;
e.dataTransfer.setData("text/plain",el.dataset.dragKind+":"+el.dataset.dragIndex);
e.dataTransfer.effectAllowed="move";
});
document.addEventListener("dragover",e=>{if(e.target.closest?.("[data-drop-kind]"))e.preventDefault();});
document.addEventListener("drop",e=>{
const target=e.target.closest?.("[data-drop-kind]");
if(!target||!session||answered!==null||!miniState||!e.dataTransfer)return;
e.preventDefault();
const raw=e.dataTransfer.getData("text/plain"),[kind,from]=raw.split(":"),to=Number(target.dataset.dropIndex);
const q=session.items[questionIndex];if(!q?.mechanic||kind!==target.dataset.dropKind||!Number.isInteger(Number(from)))return;
let outcome;const beforeLinked=miniState.linked.length;
if(kind==="train"&&miniState.chosen.length===to){outcome=MINI.act(q,miniState,"pick",from);}
if(kind==="links"){
 MINI.act(q,miniState,"left",from);
 outcome=MINI.act(q,miniState,"right",String(to));
}
if(!outcome)return;
miniState=outcome.state;
if(outcome.done)grade(outcome.ok,-1,outcome.given);else{AV?.play?.(kind==="train"?"dock":outcome.state.linked.length>beforeLinked?"pair":"incorrect");renderQuiz();}
});
document.addEventListener("input",e=>{const el=e.target;if(el?.id==="fx-volume"){const value=AV.setVolume(Number(el.value)/100);const display=document.getElementById("fx-volume-display");if(display)display.textContent=Math.round(value*100)+" %";}});
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.id==="response"){e.preventDefault();checkTyped();}});
render();
try{const requested=new URLSearchParams(location.search||"").get("view");if(requested==="progress")go("progress");else if(requested==="errors")errors();}catch(e){}
})();