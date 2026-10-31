(()=>{'use strict';const spotlight=document.querySelector('#reinos .world-spotlight');if(!spotlight)return;
const names=['Terra Encantada','Terra de Fogo','Terra do Gelo','Terra dos Doces','Cavernas Obscuras','Terra dos Mortos','Pântano Venenoso','Terra dos Dinossauros','Terra do Futuro'];
const base='assets/img/';const scenarioFolders=['01_terra_encantada','02_terra_de_fogo','03_terra_do_gelo','04_terra_dos_doces','05_cavernas_obscuras','08_terra_dos_mortos','07_pantano_venenoso','06_terra_dos_dinossauros','09_terra_do_futuro'];let catalog=[],active=null,previousFocus=null,zoom=1,slide=0,timer=null,paused=false;const scenePath=(i,n)=>'assets/img/cenarios/'+scenarioFolders[i]+'/area_0'+n+'.webp?v=33';
const modal=document.createElement('div');modal.className='realm-viewer';modal.hidden=true;modal.innerHTML='<div class="realm-viewer-shade" data-close></div><section class="realm-viewer-dialog" role="dialog" aria-modal="true" aria-label="Arte ampliada do reino"><header><div><span class="realm-viewer-kicker">OS NOVE REINOS MAJESTOSOS</span><h2 class="realm-viewer-title"></h2></div><button type="button" class="realm-viewer-close" data-close aria-label="Fechar imagem e parar música">×</button></header><div class="realm-viewer-stage"><div class="realm-viewer-canvas"><img alt="" draggable="false"></div></div><div class="realm-gallery-v32" role="group" aria-label="Carrossel de cenários"><button type="button" data-slide="-1" aria-label="Imagem anterior">‹</button><button type="button" data-pause aria-pressed="false">Pausar</button><span class="realm-gallery-counter" aria-live="polite">1 / 5</span><button type="button" data-slide="1" aria-label="Próxima imagem">›</button></div><footer><div class="realm-viewer-audio"><div class="realm-audio-choice" role="group" aria-label="Escolher trilha"><button type="button" data-music="exploracao" aria-pressed="true">Exploração</button><button type="button" data-music="boss" aria-pressed="false">Batalha do boss</button></div><span class="realm-viewer-status" role="status">Carregando...</span><audio controls preload="none" controlslist="nodownload noplaybackrate" aria-label="Tema de exploração do reino"></audio></div><div class="realm-viewer-tools"><button type="button" data-zoom="-1" aria-label="Reduzir zoom">−</button><button type="button" data-reset>100%</button><button type="button" data-zoom="1" aria-label="Aumentar zoom">+</button></div></footer></section>';
document.body.append(modal);const $=s=>modal.querySelector(s);const audio=$('audio'),image=$('.realm-viewer-stage img'),stage=$('.realm-viewer-stage'),stageCanvas=$('.realm-viewer-canvas'),status=$('.realm-viewer-status');let panDrag=null;let pending=0;let selectedKind='exploracao';
fetch('content/music-catalog.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(data=>{catalog=Array.isArray(data.tracks)?data.tracks:[];if(active!==null)setupAudio(active,selectedKind)}).catch(()=>{catalog=[];if(active!==null){status.textContent='Trilha indisponível no momento';audio.hidden=true}});
const trackFor=(i,kind)=>catalog.find(t=>t.scope===names[i]&&t.kind===kind&&typeof t.src==='string'&&t.src.startsWith('assets/audio/'));
function updateChoices(i){modal.querySelectorAll('[data-music]').forEach(b=>{const kind=b.dataset.music;const published=!!trackFor(i,kind);b.disabled=!published;b.setAttribute('aria-pressed',String(kind===selectedKind));b.title=published?'Ouvir '+b.textContent:'Faixa ainda não publicada'});}
function stop(){audio.pause();audio.currentTime=0;audio.removeAttribute('src');audio.load()}
function setupAudio(i,kind='exploracao'){if(active!==i)return;selectedKind=kind;stop();updateChoices(i);const t=trackFor(i,kind);if(!t){status.textContent=kind==='boss'?'Tema de batalha ainda não publicado':'Tema de exploração ainda não publicado';audio.hidden=true;return}status.textContent=t.title;audio.hidden=false;audio.setAttribute('aria-label',kind==='boss'?'Tema da batalha contra o boss':'Tema de exploração do reino');audio.src=t.src.split('/').map(encodeURIComponent).join('/');audio.load();const promise=audio.play();if(promise?.catch)promise.catch(()=>{if(active===i&&selectedKind===kind)status.textContent=t.title+' · Clique em reproduzir para ouvir'})}
function setZoom(n){
 if(n>1&&active!==null&&!paused){paused=true;updatePause();stopSlides()}
 const previousWidth=Math.max(1,stageCanvas.scrollWidth),previousHeight=Math.max(1,stageCanvas.scrollHeight);
 const cx=(stage.scrollLeft+stage.clientWidth/2)/previousWidth,cy=(stage.scrollTop+stage.clientHeight/2)/previousHeight;
 zoom=Math.max(1,Math.min(4,Math.round(n*100)/100));
 const w=image.naturalWidth||1400,h=image.naturalHeight||1000;
 const vw=stage.clientWidth,vh=stage.clientHeight;
 if(vw>0&&vh>0){
  const fit=Math.min((vw-12)/w,(vh-12)/h);
  const dw=Math.max(1,Math.round(w*fit*zoom)),dh=Math.max(1,Math.round(h*fit*zoom));
  stageCanvas.style.width=Math.max(vw,dw)+'px';
  stageCanvas.style.height=Math.max(vh,dh)+'px';
  image.style.width=dw+'px';image.style.height=dh+'px';image.style.transform='none';
  image.style.left=Math.max(0,(Math.max(vw,dw)-dw)/2)+'px';
  image.style.top=Math.max(0,(Math.max(vh,dh)-dh)/2)+'px';
  stage.scrollLeft=zoom===1?0:Math.max(0,cx*stageCanvas.scrollWidth-vw/2);
  stage.scrollTop=zoom===1?0:Math.max(0,cy*stageCanvas.scrollHeight-vh/2);
 }
 $('[data-reset]').textContent=Math.round(zoom*100)+'%';
}
function stopSlides(){if(timer!==null){clearInterval(timer);timer=null}}
function updatePause(){const b=$('[data-pause]');b.textContent=paused?'Reproduzir':'Pausar';b.setAttribute('aria-pressed',String(paused))}
function advance(n){if(active===null)return;slide=(n+5)%5;zoom=1;image.onload=()=>{if(active!==null)setZoom(1)};image.src=slide===0?base+'world_'+active+'.webp?v=33':scenePath(active,slide);image.alt=slide===0?'Prancha oficial de '+names[active]:'Cenário de exploração '+slide+' de '+names[active];$('.realm-gallery-counter').textContent=(slide+1)+' / 5';setZoom(1)}
function startSlides(){stopSlides();if(!paused&&active!==null)timer=setInterval(()=>{if(!document.hidden&&active!==null)advance(slide+1)},5000)}
function open(i,origin){previousFocus=origin||document.activeElement;active=i;selectedKind='exploracao';pending++;modal.hidden=false;document.body.classList.add('realm-viewer-open');$('.realm-viewer-title').textContent=names[i];image.src=base+'world_'+i+'.webp?v=33';image.alt='Prancha oficial de '+names[i]+' em resolução original';image.onload=()=>{if(active===i)setZoom(zoom)};slide=0;paused=false;updatePause();$('.realm-gallery-counter').textContent='1 / 5';setZoom(1);startSlides();document.querySelectorAll('audio').forEach(a=>{if(a!==audio)a.pause()});if(catalog.length)setupAudio(i,'exploracao');else{stop();audio.hidden=true;modal.querySelectorAll('[data-music]').forEach(b=>b.disabled=true);status.textContent='Verificando trilha de exploração...'}$('.realm-viewer-close').focus()}
function close(){if(modal.hidden)return;stopSlides();stop();modal.hidden=true;active=null;document.body.classList.remove('realm-viewer-open');setZoom(1);previousFocus?.focus?.()}
spotlight.querySelector('.spotlight-picture img')?.addEventListener('click',e=>{const name=spotlight.querySelector('.spotlight-copy h3')?.textContent?.trim();const i=names.indexOf(name);if(i>=0)open(i,e.currentTarget)});
const spotlightImg=spotlight.querySelector('.spotlight-picture img');if(spotlightImg){spotlightImg.tabIndex=0;spotlightImg.setAttribute('role','button');spotlightImg.setAttribute('aria-label','Ampliar arte do reino e ouvir tema de exploração');spotlightImg.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();const i=names.indexOf(spotlight.querySelector('.spotlight-copy h3')?.textContent?.trim());if(i>=0)open(i,spotlightImg)}})}
document.querySelectorAll('#inicio .v9-realms a').forEach((link,i)=>{if(i>8)return;link.setAttribute('aria-label','Ampliar '+names[i]+' e ouvir tema de exploração');link.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();open(i,link)})});
document.querySelectorAll('#reinos .codex-world').forEach((card,i)=>{const img=card.querySelector('img');if(!img||i>8)return;img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Ampliar arte de '+names[i]+' e ouvir exploração');img.addEventListener('click',()=>open(i,img));img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(i,img)}})});
modal.querySelectorAll('[data-slide]').forEach(b=>b.addEventListener('click',()=>{advance(slide+Number(b.dataset.slide));startSlides()}));$('[data-pause]').addEventListener('click',()=>{paused=!paused;updatePause();startSlides()});document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSlides();else if(active!==null)startSlides()});modal.querySelectorAll('[data-music]').forEach(b=>b.addEventListener('click',()=>{if(active!==null&&!b.disabled&&b.dataset.music!==selectedKind)setupAudio(active,b.dataset.music)}));modal.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',close));modal.querySelectorAll('[data-zoom]').forEach(b=>b.addEventListener('click',()=>setZoom(zoom+Number(b.dataset.zoom)*.3)));$('[data-reset]').addEventListener('click',()=>setZoom(1));audio.addEventListener('error',()=>{status.textContent='Não foi possível carregar o áudio deste reino'});
stage.addEventListener('pointerdown',e=>{
 if(modal.hidden||(e.pointerType==='mouse'&&e.button!==0))return;
 panDrag={id:e.pointerId,x:e.clientX,y:e.clientY,l:stage.scrollLeft,t:stage.scrollTop};
 stage.setPointerCapture(e.pointerId);stage.classList.add('is-dragging');e.preventDefault();
});
stage.addEventListener('pointermove',e=>{
 if(!panDrag||panDrag.id!==e.pointerId)return;
 stage.scrollLeft=panDrag.l+panDrag.x-e.clientX;
 stage.scrollTop=panDrag.t+panDrag.y-e.clientY;e.preventDefault();
});
['pointerup','pointercancel','lostpointercapture'].forEach(name=>stage.addEventListener(name,e=>{
 if(panDrag&&e.pointerId!==undefined&&e.pointerId!==panDrag.id)return;
 panDrag=null;stage.classList.remove('is-dragging');
}));
window.addEventListener('resize',()=>{if(!modal.hidden&&image.naturalWidth)setZoom(zoom)});
stage.addEventListener('wheel',e=>{if(modal.hidden)return;e.preventDefault();setZoom(zoom+(e.deltaY<0?.2:-.2))},{passive:false});document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape'){e.preventDefault();close();return}if(e.key==='Tab'){const controls=[...modal.querySelectorAll('button:not([hidden])')];const first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
})();