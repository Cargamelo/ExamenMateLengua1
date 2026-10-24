"use strict";
/* Álbum de cartas obtenidas; los poderes permanecen desactivados. */
(function(){
const cards=Array.isArray(window.LigaCartasCatalogo)?window.LigaCartasCatalogo:[];
const categories=[['todas','Todas'],['obtenidas','Conseguidas'],['pendientes','Pendientes'],['universal','Universales'],['matematicas','Matemáticas'],['lengua','Lengua'],['rara','Raras'],['legendaria','Legendarias']];
let mode=null,filter='todas',card=null,reversed=false,opener=null,root=null;
const esc=x=>String(x??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const byId=id=>cards.find(c=>c.id===id);
const image=id=>'./assets/pixel/cartas/'+id.toLowerCase()+'.webp';
const back=r=>'./assets/pixel/reversos/'+r+'.webp';
function ensure(){if(root)return root;root=document.createElement('div');root.id='liga-pixel-overlay';root.className='pixel-overlay-root';document.body.append(root);return root;}
function open(type){opener=document.activeElement;mode=type;card=null;reversed=false;filter='todas';document.body.classList.add('pixel-dialog-open');render();}
function close(){mode=null;card=null;if(root)root.innerHTML='';document.body.classList.remove('pixel-dialog-open');opener?.focus?.();}
function header(title,subtitle){return '<div class="pixel-modal-head"><div><span class="pixel-eyebrow">✦ LA LIGA DEL SABER ✦</span><h2 id="pixel-overlay-title">'+title+'</h2><p>'+subtitle+'</p></div><button type="button" class="pixel-dialog-close" data-pixel-action="close" aria-label="Cerrar ventana">✕</button></div>';}
function tile(c,owned){
 const count=Number(owned)||0,pending=count===0;
 return '<button class="pixel-card-tile pixel-rarity-'+esc(c.rareza)+(pending?' pixel-card-pending':' pixel-card-owned')+'" type="button" data-pixel-action="card" data-id="'+esc(c.id)+'" aria-label="'+(pending?'Carta pendiente '+esc(c.id):'Consultar carta '+esc(c.nombre)+', '+count+' copias')+'">'+
 '<span class="pixel-card-image"><img src="'+(pending?back(c.rareza):image(c.id))+'" alt="'+(pending?'Carta bloqueada':esc(c.texto_alternativo))+'" loading="lazy" decoding="async" width="300" height="420">'+(pending?'<span class="pixel-card-lock" aria-hidden="true">🔒</span>':'')+'</span>'+
 '<span class="pixel-card-title">'+(pending?'Carta por descubrir':esc(c.nombre))+'</span><small>'+esc(c.id)+' · '+(pending?'Pendiente':count+' '+(count===1?'copia':'copias'))+'</small></button>';
}
function viewCollection(){
 const state=window.LigaCartas?.inventory()||{byId:{},unique:0,rewarded:0,duplicates:0,totalCards:cards.length,totalStages:30};
 const count=c=>state.byId[c.id]||0;
 const match=(c,f)=>f==='todas'||f==='obtenidas'&&count(c)>0||f==='pendientes'&&count(c)===0||c.asignatura===f||c.rareza===f;
 const shown=cards.filter(c=>match(c,filter));
 const label=id=>categories.find(([key])=>key===id)?.[1]||"Todas";
 const buttons=categories.map(([id,title])=>'<button type="button" data-pixel-action="filter" data-filter="'+id+'" aria-pressed="'+(filter===id)+'"><span>'+esc(title)+'</span><small>'+cards.filter(c=>match(c,id)).length+'</small></button>').join('');
 return header('Mi colección','¡Descubre cartas al completar fases! Las habilidades de las cartas todavía no están activas.')+
 '<div class="pixel-inventory-progress" role="status" aria-live="polite"><span><strong>'+state.unique+' / 24</strong> cartas conseguidas</span><span><strong>'+state.rewarded+' / 30</strong> fases recompensadas</span><span><strong>'+state.duplicates+'</strong> copias repetidas</span></div>'+
 (state.writeWarnings?'<p class="pixel-inventory-warning" role="alert">Hay recompensas pendientes de respaldar. Comprueba que el navegador permite guardar datos.</p>':'')+
 '<div class="pixel-album-layout">'+
 '<aside class="pixel-album-sidebar" aria-label="Filtrar por categoría"><h3>Explorar cartas</h3><div class="pixel-album-actions" role="group" aria-label="Filtros del álbum">'+buttons+'</div><p class="pixel-album-counter" role="status">'+shown.length+' cartas · '+esc(label(filter))+'</p></aside>'+
 '<div class="pixel-album-main"><div class="pixel-album-grid">'+shown.map(c=>tile(c,count(c))).join('')+'</div></div>'+
 '<aside class="pixel-album-detail" aria-label="Información de la carta seleccionada">'+(card?viewCard(state):'<div class="pixel-album-empty"><span aria-hidden="true">✦</span><h3>Elige una carta</h3><p>Las cartas conseguidas muestran su ilustración, descripción y cantidad. Las pendientes permanecen cerradas.</p></div>')+'</aside></div>';
}
function viewCard(state){
 const c=byId(card);if(!c)return '';
 const owned=state.byId[c.id]||0;
 if(!owned)return '<div class="pixel-album-empty pixel-unowned-detail"><span aria-hidden="true">🔒</span><h3>Carta pendiente</h3>'+
 '<img src="'+back(c.rareza)+'" alt="Reverso de una carta pendiente" width="180" height="252">'+
 '<p>¡Sigue completando fases para descubrir esta carta!</p><button type="button" class="pixel-fantasy-btn pixel-btn-secondary" data-pixel-action="album">← Volver al álbum</button></div>';
 return '<h3 class="pixel-selected-title">'+esc(c.nombre)+'</h3><div class="pixel-card-detail"><button type="button" class="pixel-card-flip" data-pixel-action="flip" aria-label="'+(reversed?'Ver el anverso de la carta':'Ver el reverso de la carta')+'"><img src="'+(reversed?back(c.rareza):image(c.id))+'" alt="'+esc(reversed?'Reverso de carta '+c.rareza:c.texto_alternativo)+'" width="300" height="420"></button>'+
 '<div class="pixel-card-story"><span class="pixel-card-tag">'+esc(c.asignatura==='universal'?'Universal':c.asignatura==='matematicas'?'Matemáticas':'Lengua')+' · '+esc(c.id)+' · '+esc(c.rareza)+'</span><p><strong>Conseguidas: '+owned+' '+(owned===1?'copia':'copias')+'</strong></p><h3>'+esc(c.nombre_poder)+'</h3><p>'+esc(c.descripcion)+'</p><p class="pixel-power-disabled">Poder de catálogo: todavía no está disponible para jugar.</p><button type="button" class="pixel-fantasy-btn pixel-btn-secondary" data-pixel-action="album">← Volver al álbum</button></div></div>';
}
function viewHub(){const errors=mode==='errors';return header(errors?'Mis errores':'Mis logros',errors?'Elige qué asignatura quieres repasar.':'Elige los progresos que quieres consultar.')+
 '<div class="pixel-hub-choices"><a class="pixel-fantasy-btn" href="./matematicas-sda1.html?view='+(errors?'errors':'progress')+'">✦ Matemáticas</a><a class="pixel-fantasy-btn pixel-portal-purple" href="./lengua-sda1.html?view='+(errors?'errors':'progress')+'">✦ Lengua</a></div>';
}
function viewSettings(){const av=window.AventuraFX,on=!!av?.isEnabled?.(),value=Math.round((av?.getVolume?.()??.32)*100);return header('Ajustes del sonido','Las preferencias se guardan en este dispositivo. Las lecturas usan la voz del navegador.')+
 '<div class="pixel-settings"><button type="button" class="pixel-fantasy-btn" data-pixel-action="sound" aria-pressed="'+on+'">'+(on?'🔊 Desactivar efectos sonoros':'🔇 Activar efectos sonoros')+'</button><label for="pixel-global-volume">Volumen de efectos <output id="pixel-volume-label">'+value+' %</output></label><input id="pixel-global-volume" type="range" min="0" max="100" step="5" value="'+value+'" aria-label="Volumen de efectos sonoros"></div>';
}
function render(focusAction){
 if(!mode)return;
 const node=ensure();
 node.innerHTML='<div class="pixel-modal-backdrop" data-pixel-action="close"></div><section class="pixel-dialog" role="dialog" aria-modal="true" aria-labelledby="pixel-overlay-title" tabindex="-1">'+(mode==='collection'?viewCollection():mode==='settings'?viewSettings():viewHub())+'</section>';
 const focus=focusAction==='filter'?node.querySelector('[data-pixel-action="filter"][data-filter="'+filter+'"]'):
  focusAction==='card'?node.querySelector('[data-pixel-action="card"][data-id="'+card+'"]'):
  focusAction==='flip'?node.querySelector('[data-pixel-action="flip"]'):null;
 (focus||node.querySelector('.pixel-dialog-close'))?.focus({preventScroll:true});
}
document.addEventListener('click',function(e){const openButton=e.target.closest('[data-liga-open]');if(openButton){e.preventDefault();open(openButton.dataset.ligaOpen);return;}const btn=e.target.closest('[data-pixel-action]');if(!btn||!mode)return;const action=btn.dataset.pixelAction;
if(action==='close'){close();return;}if(action==='filter'){filter=btn.dataset.filter;card=null;reversed=false;render('filter');return;}if(action==='card'){card=btn.dataset.id;reversed=false;render('card');return;}if(action==='flip'){reversed=!reversed;render('flip');return;}if(action==='album'){const old=card;card=null;render();root?.querySelector('[data-pixel-action="card"][data-id="'+old+'"]')?.focus({preventScroll:true});return;}if(action==='sound'){const av=window.AventuraFX;if(av){const on=av.setEnabled(!av.isEnabled());if(on){av.unlock?.();av.play('toggle');}}render();return;}});
document.addEventListener('input',function(e){if(e.target.id!=='pixel-global-volume')return;const v=window.AventuraFX?.setVolume?.(Number(e.target.value)/100);const o=document.getElementById('pixel-volume-label');if(o)o.textContent=Math.round((v??0)*100)+' %';});
document.addEventListener('keydown',function(e){if(!mode)return;if(e.key==='Escape'){e.preventDefault();if(card){const old=card;card=null;render();root?.querySelector('[data-pixel-action="card"][data-id="'+old+'"]')?.focus({preventScroll:true});}else close();return;}if(e.key!=='Tab')return;const dialog=root?.querySelector('.pixel-dialog');if(!dialog)return;const a=[...dialog.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled)')].filter(x=>x.offsetWidth||x.offsetHeight||x.getClientRects().length);if(!a.length)return;const first=a[0],last=a[a.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
window.addEventListener('storage',function(event){
 if(mode==='collection'&&event.key&&(event.key.startsWith('ligasaber-carta-v1-')||event.key.startsWith('ligasaber-2026-')))render();
});
window.addEventListener('liga-cartas-actualizadas',function(){if(mode==='collection')render();});
window.LigaPixelUI={openCollection:()=>open('collection'),openSettings:()=>open('settings'),openHub:mode=>open(mode==='errors'?'errors':'progress'),close};
})();