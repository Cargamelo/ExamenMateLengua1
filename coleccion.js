"use strict";
/* Interfaz de catálogo. V1 no registra inventario ni consume poderes. */
(function(){
const cards=Array.isArray(window.LigaCartasCatalogo)?window.LigaCartasCatalogo:[];
const categories=[['todas','Todas'],['universal','Universales'],['matematicas','Matemáticas'],['lengua','Lengua'],['recompensas','Recompensas']];
let mode=null,filter='todas',card=null,reversed=false,opener=null,root=null;
const esc=x=>String(x??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const byId=id=>cards.find(c=>c.id===id);
const image=id=>'./assets/pixel/cartas/'+id.toLowerCase()+'.webp';
const back=r=>'./assets/pixel/reversos/'+r+'.webp';
function ensure(){if(root)return root;root=document.createElement('div');root.id='liga-pixel-overlay';root.className='pixel-overlay-root';document.body.append(root);return root;}
function open(type){opener=document.activeElement;mode=type;card=null;reversed=false;filter='todas';document.body.classList.add('pixel-dialog-open');render();}
function close(){mode=null;card=null;if(root)root.innerHTML='';document.body.classList.remove('pixel-dialog-open');opener?.focus?.();}
function header(title,subtitle){return '<div class="pixel-modal-head"><div><span class="pixel-eyebrow">✦ LA LIGA DEL SABER ✦</span><h2 id="pixel-overlay-title">'+title+'</h2><p>'+subtitle+'</p></div><button type="button" class="pixel-dialog-close" data-pixel-action="close" aria-label="Cerrar ventana">✕</button></div>';}
function tile(c){return '<button class="pixel-card-tile pixel-rarity-'+esc(c.rareza)+'" type="button" data-pixel-action="card" data-id="'+esc(c.id)+'" aria-label="Consultar carta '+esc(c.nombre)+'"><span class="pixel-card-image"><img src="'+image(c.id)+'" alt="'+esc(c.texto_alternativo)+'" loading="lazy" decoding="async" width="300" height="420"></span><span class="pixel-card-title">'+esc(c.nombre)+'</span><small>'+esc(c.rareza==='legendaria'?'Legendaria':c.rareza==='rara'?'Rara':'Común')+' · '+esc(c.id)+'</small></button>';}
function viewCollection(){
 const match=c=>filter==='todas'||filter==='recompensas'&&Number(c.id.slice(1))>=20||c.asignatura===filter;
 const shown=cards.filter(match);
 return header('Álbum de cartas mágicas','24 cartas originales · Vista previa del catálogo. Los poderes todavía no están activos.')+
 '<div class="pixel-album-actions" role="group" aria-label="Filtrar cartas">'+categories.map(([id,title])=>'<button type="button" data-pixel-action="filter" data-filter="'+id+'" aria-pressed="'+(filter===id)+'">'+title+'</button>').join('')+'</div>'+
 '<p class="pixel-album-counter" role="status">'+shown.length+' cartas · No se atribuyen cartas al jugador ni se gastan monedas.</p>'+
 '<div class="pixel-album-grid">'+shown.map(tile).join('')+'</div>';
}
function viewCard(){const c=byId(card);if(!c)return viewCollection();return header(esc(c.nombre),'Carta '+esc(c.id)+' · '+esc(c.rareza)+' · Catálogo de consulta')+
 '<div class="pixel-card-detail"><button type="button" class="pixel-card-flip" data-pixel-action="flip" aria-label="'+(reversed?'Ver el anverso de la carta':'Ver el reverso de la carta')+'"><img src="'+(reversed?back(c.rareza):image(c.id))+'" alt="'+(reversed?'Reverso de carta '+c.rareza:c.texto_alternativo)+'" width="300" height="420"></button><div class="pixel-card-story"><span class="pixel-card-tag">'+esc(c.asignatura==='universal'?'Universal':c.asignatura==='matematicas'?'Matemáticas':'Lengua')+'</span><h3>'+esc(c.nombre_poder)+'</h3><p>'+esc(c.descripcion)+'</p><p class="pixel-power-disabled"><span aria-hidden="true">◇</span> Este poder no está implementado. No se aplicará ningún efecto ni consumo de cartas.</p><button type="button" class="pixel-fantasy-btn pixel-btn-secondary" data-pixel-action="album">← Volver a la colección</button></div></div>';
}
function viewHub(){const errors=mode==='errors';return header(errors?'Mis errores':'Mis logros',errors?'Elige qué asignatura quieres repasar.':'Elige los progresos que quieres consultar.')+
 '<div class="pixel-hub-choices"><a class="pixel-fantasy-btn" href="./matematicas-sda1.html?view='+(errors?'errors':'progress')+'">✦ Matemáticas</a><a class="pixel-fantasy-btn pixel-portal-purple" href="./lengua-sda1.html?view='+(errors?'errors':'progress')+'">✦ Lengua</a></div>';
}
function viewSettings(){const av=window.AventuraFX,on=!!av?.isEnabled?.(),value=Math.round((av?.getVolume?.()??.32)*100);return header('Ajustes del sonido','Las preferencias se guardan en este dispositivo. Las lecturas usan la voz del navegador.')+
 '<div class="pixel-settings"><button type="button" class="pixel-fantasy-btn" data-pixel-action="sound" aria-pressed="'+on+'">'+(on?'🔊 Desactivar efectos sonoros':'🔇 Activar efectos sonoros')+'</button><label for="pixel-global-volume">Volumen de efectos <output id="pixel-volume-label">'+value+' %</output></label><input id="pixel-global-volume" type="range" min="0" max="100" step="5" value="'+value+'" aria-label="Volumen de efectos sonoros"></div>';
}
function render(){if(!mode)return;const node=ensure();node.innerHTML='<div class="pixel-modal-backdrop" data-pixel-action="close"></div><section class="pixel-dialog" role="dialog" aria-modal="true" aria-labelledby="pixel-overlay-title" tabindex="-1">'+(card&&mode==='collection'?viewCard():mode==='collection'?viewCollection():mode==='settings'?viewSettings():viewHub())+'</section>';node.querySelector('.pixel-dialog-close')?.focus({preventScroll:true});}
document.addEventListener('click',function(e){const openButton=e.target.closest('[data-liga-open]');if(openButton){e.preventDefault();open(openButton.dataset.ligaOpen);return;}const btn=e.target.closest('[data-pixel-action]');if(!btn||!mode)return;const action=btn.dataset.pixelAction;
if(action==='close'){close();return;}if(action==='filter'){filter=btn.dataset.filter;render();return;}if(action==='card'){card=btn.dataset.id;reversed=false;render();return;}if(action==='flip'){reversed=!reversed;render();return;}if(action==='album'){card=null;render();return;}if(action==='sound'){const av=window.AventuraFX;if(av){const on=av.setEnabled(!av.isEnabled());if(on){av.unlock?.();av.play('toggle');}}render();return;}});
document.addEventListener('input',function(e){if(e.target.id!=='pixel-global-volume')return;const v=window.AventuraFX?.setVolume?.(Number(e.target.value)/100);const o=document.getElementById('pixel-volume-label');if(o)o.textContent=Math.round((v??0)*100)+' %';});
document.addEventListener('keydown',function(e){if(!mode)return;if(e.key==='Escape'){e.preventDefault();if(card){card=null;render();}else close();return;}if(e.key!=='Tab')return;const dialog=root?.querySelector('.pixel-dialog');if(!dialog)return;const a=[...dialog.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled)')].filter(x=>x.offsetWidth||x.offsetHeight||x.getClientRects().length);if(!a.length)return;const first=a[0],last=a[a.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
window.LigaPixelUI={openCollection:()=>open('collection'),openSettings:()=>open('settings'),openHub:mode=>open(mode==='errors'?'errors':'progress'),close};
})();