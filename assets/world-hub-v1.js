(()=>{'use strict';
const realmNames=['Terra Encantada','Terra de Fogo','Terra do Gelo','Terra dos Doces','Cavernas Obscuras','Terra dos Mortos','Pântano Venenoso','Terra dos Dinossauros','Terra do Futuro'];
const folders=['01_terra_encantada','02_terra_de_fogo','03_terra_do_gelo','04_terra_dos_doces','05_cavernas_obscuras','08_terra_dos_mortos','07_pantano_venenoso','06_terra_dos_dinossauros','09_terra_do_futuro'];
const enemies=[['Broto Esgrimista','Corte de vinha','broto_esgrimista'],['Fada do Pólen','Nuvem sonífera','fada_do_polen'],['Lesmarbor','Investida musgosa','lesmarbor'],['Sapo Lótus','Língua chicote','sapo_lotus'],['Corça Cristalina','Disparo floral','corca_cristalina'],['Abelha Rubra','Ferrão em rajada','abelha_rubra'],['Mandrágora Travessa','Grito atordoante','mandragora_travessa'],['Rato-Raiz','Escavação curta','rato_raiz'],['Corvo Orvalhante','Mergulho cortante','corvo_orvalhante'],['Cogubruxa','Esporos místicos','cogubruxa']];
const mk=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
let worlds=[],active=0,previous=null,selected='enemies';
const hub=mk('div','world-hub');hub.hidden=true;
hub.innerHTML='<section class="world-hub-dialog" role="dialog" aria-modal="true" aria-labelledby="world-hub-title"><header class="world-hub-header"><div><small>OS NOVE REINOS MAJESTOSOS</small><h2 id="world-hub-title"></h2></div><button class="world-hub-close" aria-label="Fechar ficha">×</button></header><nav class="world-hub-tabs" aria-label="Informações do mundo" role="tablist"><button class="world-hub-tab" data-tab="enemies" role="tab">Bestiário de inimigos</button><button class="world-hub-tab" data-tab="bosses" role="tab">Subchefes e boss</button><button class="world-hub-tab" data-tab="scenes" role="tab">Cenários de exploração</button></nav><section class="world-hub-panel" data-panel="enemies" role="tabpanel"></section><section class="world-hub-panel" data-panel="bosses" role="tabpanel"></section><section class="world-hub-panel" data-panel="scenes" role="tabpanel"></section><footer class="world-hub-audio" aria-label="Músicas do reino"></footer></section>';
const viewer=mk('div','world-hub-viewer');viewer.hidden=true;
viewer.innerHTML='<div class="world-hub-viewer-bar"><span class="world-hub-viewer-label">Arte oficial ampliada</span><div class="world-hub-viewer-controls"><button data-vzoom="-1" aria-label="Diminuir zoom">−</button><button data-vzoom="reset">100%</button><button data-vzoom="1" aria-label="Aumentar zoom">+</button><button data-vclose aria-label="Fechar imagem">Fechar</button></div></div><div class="world-hub-viewer-viewport"><div class="world-hub-viewer-canvas"><img class="world-hub-viewer-img" alt="" draggable="false"></div></div>';
document.body.append(hub,viewer);
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const clean=t=>String(t||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let scale=1,baseW=0,baseH=0,drag=null;
const viewport=$('.world-hub-viewer-viewport',viewer),canvas=$('.world-hub-viewer-canvas',viewer),zoomImage=$('.world-hub-viewer-img',viewer);
function renderZoom(centerX=.5,centerY=.5){
  if(!baseW||!baseH)return;
  const w=Math.max(1,Math.round(baseW*scale)),h=Math.max(1,Math.round(baseH*scale));
  const vw=viewport.clientWidth,vh=viewport.clientHeight;
  canvas.style.width=Math.max(vw,w)+'px';
  canvas.style.height=Math.max(vh,h)+'px';
  zoomImage.style.width=w+'px';
  zoomImage.style.height=h+'px';
  zoomImage.style.left=Math.max(0,(vw-w)/2)+'px';
  zoomImage.style.top=Math.max(0,(vh-h)/2)+'px';
  // A top-left scroll origin exposes all four edges, including left and top.
  viewport.scrollLeft=Math.max(0,(w-vw)*centerX);
  viewport.scrollTop=Math.max(0,(h-vh)*centerY);
  $('[data-vzoom="reset"]',viewer).textContent=Math.round(scale*100)+'%';
}
function fitSize(){
  if(!zoomImage.naturalWidth||!viewport.clientWidth||!viewport.clientHeight)return;
  const k=Math.min((viewport.clientWidth-24)/zoomImage.naturalWidth,(viewport.clientHeight-24)/zoomImage.naturalHeight);
  baseW=Math.max(1,zoomImage.naturalWidth*k);
  baseH=Math.max(1,zoomImage.naturalHeight*k);
  scale=1;
  renderZoom();
  const name=$('.world-hub-viewer-label',viewer);
  if(name)name.title='Imagem publicada: '+zoomImage.naturalWidth+' × '+zoomImage.naturalHeight+' pixels. O visualizador não pode recuperar partes ausentes do arquivo.';
}
function setZoom(n){
  const maxX=Math.max(0,canvas.offsetWidth-viewport.clientWidth),maxY=Math.max(0,canvas.offsetHeight-viewport.clientHeight);
  const cx=maxX?(viewport.scrollLeft+viewport.clientWidth/2)/canvas.offsetWidth:.5;
  const cy=maxY?(viewport.scrollTop+viewport.clientHeight/2)/canvas.offsetHeight:.5;
  scale=Math.max(1,Math.min(5,Math.round(n*100)/100));
  // Preserve the approximate position in the artwork during zoom.
  const w=baseW*scale,h=baseH*scale;
  renderZoom(w>viewport.clientWidth?Math.max(0,Math.min(1,(cx*w-viewport.clientWidth/2)/(w-viewport.clientWidth))):.5,
             h>viewport.clientHeight?Math.max(0,Math.min(1,(cy*h-viewport.clientHeight/2)/(h-viewport.clientHeight))):.5);
}
function openImage(src,label){
  if(!src)return;
  viewer.hidden=false;
  baseW=baseH=0;scale=1;
  viewport.scrollLeft=0;viewport.scrollTop=0;
  zoomImage.onload=fitSize;
  zoomImage.src=src;
  zoomImage.alt=label||'Arte oficial';
  $('.world-hub-viewer-label',viewer).textContent=label||'Arte oficial';
  if(zoomImage.complete&&zoomImage.naturalWidth)fitSize();
}
function closeViewer(){viewer.hidden=true;zoomImage.onload=null;zoomImage.removeAttribute('src')}
$$('[data-vzoom]',viewer).forEach(b=>b.addEventListener('click',()=>setZoom(b.dataset.vzoom==='reset'?1:scale+Number(b.dataset.vzoom)*.3)));
$('[data-vclose]',viewer).addEventListener('click',closeViewer);
viewport.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  drag={id:e.pointerId,x:e.clientX,y:e.clientY,l:viewport.scrollLeft,t:viewport.scrollTop};
  viewport.setPointerCapture(e.pointerId);viewport.classList.add('is-dragging');e.preventDefault();
});
viewport.addEventListener('pointermove',e=>{
  if(!drag||drag.id!==e.pointerId)return;
  viewport.scrollLeft=drag.l+drag.x-e.clientX;
  viewport.scrollTop=drag.t+drag.y-e.clientY;
  e.preventDefault();
});
['pointerup','pointercancel','lostpointercapture'].forEach(n=>viewport.addEventListener(n,e=>{
  if(drag&&e.pointerId!==undefined&&drag.id!==e.pointerId)return;
  drag=null;viewport.classList.remove('is-dragging');
}));
viewport.addEventListener('wheel',e=>{e.preventDefault();setZoom(scale+(e.deltaY<0?.2:-.2))},{passive:false});
window.addEventListener('resize',()=>{if(!viewer.hidden&&zoomImage.naturalWidth)fitSize()});
function card(title,subtitle,src,label){const box=mk('article','world-hub-card');if(src){const im=mk('img');im.src=src;im.alt='Arte oficial: '+title;im.loading='lazy';im.addEventListener('click',()=>openImage(src,title));im.style.cursor='zoom-in';im.addEventListener('error',()=>{im.replaceWith(mk('div','world-hub-art-placeholder','Card RPG ainda não publicado: '+src.split('/').pop()))},{once:true});box.append(im)}else{box.append(mk('div','world-hub-art-placeholder','Imagem oficial individual ainda não transferida para o site'))}const content=mk('div','world-hub-card-body');content.append(mk('h3','',title),mk('p','',subtitle));box.append(content);return box}
const fireEnemies=[['Brasinino Farpado','Espinhos ígneos','brasinino_farpado'],['Salamito Raivoso','Cuspe de brasa','salamito_raivoso'],['Morceflama','Mergulho em chama','morceflama'],['Escaravelho Fornalha','Rolagem incandescente','escaravelho_fornalha'],['Rochedor de Lava','Soco de magma','rochedor_de_lava'],['Serpilha Vulcânica','Bote em espiral','serpilha_vulcanica'],['Gárgula Cinzérea','Baforada quente','gargula_cinzerea'],['Tatu Basáltico','Escavação ardente','tatu_basaltico'],['Mímico da Fumaça','Salto de fuligem','mimico_da_fumaca'],['Imp Labareda','Chicote ígneo','imp_labareda']];
const fireBosses=[['Javali Magmabrasa','Subchefe 1','javali_magmabrasa'],['Salamandrix','Subchefe 2','salamandrix'],['Vulkrag, o Coração do Vulcão','Chefe principal','vulkrag_coracao_do_vulcao']];
const terraStats=[[150,60,85,70],[120,140,60,50],[320,80,110,120],[280,90,100,90],[240,160,110,80],[200,100,120,80],[220,150,70,60],[180,80,90,70],[260,120,110,80],[180,180,90,100]];
const terraBosses=[['Sir Musgoval','Subchefe 1',[3800,1200,320,280]],['Lunacórnio Guardião','Subchefe 2',[4200,1800,360,300]],['Rainha Florabel','Chefe principal',[6800,3200,480,420]]];
function addRpgStats(box,values){box.classList.add('world-hub-rpg-card');const panel=mk('div','world-hub-rpg-stats');['HP','Mana','Ataque','Defesa'].forEach((name,i)=>{const line=mk('div','world-hub-rpg-stat');const label=mk('span','',name);const track=mk('div','world-hub-rpg-track');const fill=mk('span','world-hub-rpg-fill rpg-'+i);fill.style.width=Math.max(6,Math.min(100,values[i]/([7000,3500,550,500][i])*100))+'%';track.append(fill);line.append(label,track,mk('strong','',values[i].toLocaleString('pt-BR')));panel.append(line)});box.append(panel)}
let tracks=[],playingKind=null;
const musicArea=$('.world-hub-audio',hub);
const player=mk('audio');player.controls=true;player.preload='none';player.loop=true;player.setAttribute('aria-label','Trilha do reino');
const musicChoices=mk('div','world-hub-music-choices'),musicMsg=mk('p','world-hub-audio-status');
musicArea.append(musicChoices,player,musicMsg);
function desiredKind(){return selected==='bosses'?'boss':'exploracao'}
function findTrack(kind){return tracks.find(t=>t.scope===realmNames[active]&&t.kind===kind&&typeof t.src==='string'&&t.src.startsWith('assets/audio/'))}
function playTabMusic(){
 if(hub.hidden)return;
 const kind=desiredKind(),t=findTrack(kind);
 musicChoices.replaceChildren();
 for(const [k,label] of [['exploracao','Exploração'],['boss','Batalha do boss']]){
  const btn=mk('button','',label);btn.type='button';btn.disabled=!findTrack(k);
  btn.setAttribute('aria-pressed',String(k===kind));
  btn.addEventListener('click',()=>{if(!btn.disabled)startTrack(k,true)});
  musicChoices.append(btn);
 }
 if(!t){player.pause();player.removeAttribute('src');player.load();playingKind=null;musicMsg.textContent=kind==='boss'?'Trilha de batalha ainda não publicada para este reino.':'Trilha de exploração ainda não publicada para este reino.';return}
 startTrack(kind,false);
}
function startTrack(kind,manual){
 const t=findTrack(kind);if(!t)return;
 if(playingKind!==kind||player.dataset.realm!==String(active)||player.getAttribute('src')!==t.src){
  player.pause();player.src=t.src;player.dataset.realm=String(active);playingKind=kind;player.load();
 }
 musicMsg.textContent=t.title;
 const pending=player.play();
 if(pending?.catch)pending.catch(()=>{musicMsg.textContent=t.title+' — pressione Reproduzir (autoplay bloqueado pelo navegador).'});
}
fetch('content/music-catalog.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(d=>{tracks=Array.isArray(d.tracks)?d.tracks:[];playTabMusic()}).catch(()=>{tracks=[];playTabMusic()});
function render(){const w=worlds[active],name=realmNames[active];$('#world-hub-title',hub).textContent=name;
const ep=$('[data-panel="enemies"]',hub);ep.replaceChildren();ep.append(mk('p','world-hub-intro',active<=1?'Dez inimigos oficiais em cards RPG. Clique para ampliar; use +, − e arraste para explorar os detalhes.':'O bestiário deste mundo será exibido após a homologação e publicação das artes individuais.'));const eg=mk('div','world-hub-grid');if(active<=1)(active===0?enemies:fireEnemies).forEach(([n,a,id])=>{const folder=active===0?'terra_encantada':'terra_de_fogo';const src='assets/img/cards-rpg/'+folder+'/'+id+'.webp?v=8';const c=card(n,'Habilidade: '+a,src);c.dataset.enemy=id;c.classList.add('world-hub-rpg-art');eg.append(c)});ep.append(eg);
const bp=$('[data-panel="bosses"]',hub);bp.replaceChildren();bp.append(mk('p','world-hub-intro','Personagens e identidades aprovados. A prancha oficial pode ser ampliada para consultar detalhes sem alterar as artes.'));const bg=mk('div','world-hub-bosses');const bossNames=active===0?terraBosses.map(t=>t[0]):active===1?fireBosses.map(t=>t[0]):[...(w?.subbosses||[]),w?.boss].filter(Boolean);bossNames.forEach((n,i)=>{const id=active===0?['sir_musgoval','lunacornio_guardiao','rainha_florabel'][i]:fireBosses[i]?.[2];const folder=active===0?'terra_encantada':'terra_de_fogo';const src=active<=1?'assets/img/cards-rpg/'+folder+'/'+id+'.webp?v=8':'assets/img/world_'+active+'.webp';const c=card(n,i===2?'Chefe principal':('Subchefe '+(i+1)),src);if(active<=1){c.classList.add('world-hub-rpg-art','world-hub-rpg-boss-art')}else{const im=$('img',c);if(im){im.style.objectFit='cover';im.style.objectPosition=(i*50)+'% 24%'}}bg.append(c)});bp.append(bg);
const sp=$('[data-panel="scenes"]',hub);sp.replaceChildren();sp.append(mk('p','world-hub-intro','Galeria oficial de exploração. Clique para ampliar; use os botões ou a roda do mouse para zoom e arraste a imagem para examinar os detalhes.'));const sg=mk('div','world-hub-scenes');for(let i=1;i<=4;i++){const path='assets/img/cenarios/'+folders[active]+'/area_0'+i+'.webp?v=33';const f=mk('figure');const im=mk('img');im.src=path;im.alt='Cenário de exploração '+i+' — '+name;im.loading='lazy';im.addEventListener('click',()=>openImage(path,im.alt));im.addEventListener('error',()=>{f.hidden=true});f.append(im,mk('figcaption','',name+' · Cenário '+i));sg.append(f)}sp.append(sg);switchTab(selected)}
function switchTab(name){selected=name;$$('.world-hub-tab',hub).forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.tab===name));b.tabIndex=b.dataset.tab===name?0:-1});$('.world-hub-panel',hub).forEach(p=>{p.hidden=p.dataset.panel!==name});playTabMusic()}
$$('.world-hub-tab',hub).forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
function open(i,origin){if(i<0||i>=9)return;previous=origin||document.activeElement;active=i;selected='enemies';render();hub.hidden=false;document.body.classList.add('world-hub-locked');playTabMusic();$('.world-hub-close',hub).focus()}
function close(){const sound=$('.world-hub-audio audio',hub);if(sound){sound.pause();sound.removeAttribute('src');sound.load();playingKind=null}closeViewer();hub.hidden=true;document.body.classList.remove('world-hub-locked');previous?.focus?.()}
$('.world-hub-close',hub).addEventListener('click',close);hub.addEventListener('click',e=>{if(e.target===hub)close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!viewer.hidden){closeViewer();e.preventDefault()}else if(!hub.hidden){close();e.preventDefault()}}});
fetch('content/lore.json').then(r=>r.ok?r.json():null).then(data=>{worlds=(data?.worlds||[]).slice(0,9)}).catch(()=>{});
document.addEventListener('click',e=>{const b=e.target.closest('[data-codex="world"]');if(b){const i=realmNames.indexOf(b.dataset.id);if(i>=0){e.preventDefault();e.stopImmediatePropagation();open(i,b);return}}const spotlight=e.target.closest('#reinos .world-spotlight .spotlight-picture img');if(spotlight){const i=realmNames.indexOf(document.querySelector('#reinos .world-spotlight .spotlight-copy h3')?.textContent?.trim());if(i>=0){e.preventDefault();e.stopImmediatePropagation();open(i,spotlight);return}}},true);
})();
