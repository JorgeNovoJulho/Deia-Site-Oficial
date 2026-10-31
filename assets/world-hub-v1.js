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
const terraStats=[[150,60,85,70],[120,140,60,50],[320,80,110,120],[280,90,100,90],[240,160,110,80],[200,100,120,80],[220,150,70,60],[180,80,90,70],[260,120,110,80],[180,180,90,100]];
const terraBosses=[['Sir Musgoval','Subchefe 1',[3800,1200,320,280]],['Lunacórnio Guardião','Subchefe 2',[4200,1800,360,300]],['Rainha Florabel','Chefe principal',[6800,3200,480,420]]];
function addRpgStats(box,values){box.classList.add('world-hub-rpg-card');const panel=mk('div','world-hub-rpg-stats');['HP','Mana','Ataque','Defesa'].forEach((name,i)=>{const line=mk('div','world-hub-rpg-stat');const label=mk('span','',name);const track=mk('div','world-hub-rpg-track');const fill=mk('span','world-hub-rpg-fill rpg-'+i);fill.style.width=Math.max(6,Math.min(100,values[i]/([7000,3500,550,500][i])*100))+'%';track.append(fill);line.append(label,track,mk('strong','',values[i].toLocaleString('pt-BR')));panel.append(line)});box.append(panel)}
let tracks=[];fetch('content/music-catalog.json',{cache:'no-store'}).then(r=>r.json()).then(d=>{tracks=d.tracks||[];renderAudio()}).catch(()=>{});
function renderAudio(){const zone=$('.world-hub-audio',hub);if(!zone||hub.hidden)return;zone.replaceChildren();const kinds=[['exploracao','Exploração'],['boss','Batalha do boss']];const choices=mk('div','world-hub-music-choices');const player=mk('audio');player.controls=true;player.preload='none';const msg=mk('p','world-hub-audio-status');kinds.forEach(([kind,label])=>{const btn=mk('button','',label);btn.type='button';const tr=tracks.find(t=>t.scope===realmNames[active]&&t.kind===kind&&t.src);btn.disabled=!tr;btn.addEventListener('click',()=>{if(!tr)return;player.src=tr.src;player.hidden=false;msg.textContent=tr.title;player.play().catch(()=>{msg.textContent=tr.title+' · Pressione reproduzir'})});choices.append(btn)});const available=kinds.some(([kind])=>tracks.some(t=>t.scope===realmNames[active]&&t.kind===kind&&t.src));msg.textContent=available?'Selecione a trilha para ouvir.':'Trilhas de exploração e batalha ainda não publicadas no catálogo oficial.';player.hidden=true;zone.append(choices,player,msg)}
function render(){const w=worlds[active],name=realmNames[active];$('#world-hub-title',hub).textContent=name;
const ep=$('[data-panel="enemies"]',hub);ep.replaceChildren();ep.append(mk('p','world-hub-intro',active===0?'Dez inimigos oficiais aprovados da Terra Encantada. Clique nas imagens para ampliá-las.':'O bestiário deste mundo será exibido após a homologação e publicação das artes individuais.'));const eg=mk('div','world-hub-grid');if(active===0)enemies.forEach(([n,a,id])=>{const src='assets/img/cards-rpg/terra_encantada/'+id+'.webp?v=7';const c=card(n,'Habilidade: '+a,src);c.dataset.enemy=id;c.classList.add('world-hub-rpg-art');eg.append(c)});ep.append(eg);
const bp=$('[data-panel="bosses"]',hub);bp.replaceChildren();bp.append(mk('p','world-hub-intro','Personagens e identidades aprovados. A prancha oficial pode ser ampliada para consultar detalhes sem alterar as artes.'));const bg=mk('div','world-hub-bosses');const bossNames=active===0?terraBosses.map(t=>t[0]):[...(w?.subbosses||[]),w?.boss].filter(Boolean);bossNames.forEach((n,i)=>{const id=['sir_musgoval','lunacornio_guardiao','rainha_florabel'][i];const src=active===0?'assets/img/cards-rpg/terra_encantada/'+id+'.webp?v=7':'assets/img/world_'+active+'.webp';const c=card(n,i===2?'Chefe principal':('Subchefe '+(i+1)),src);if(active===0){c.classList.add('world-hub-rpg-art','world-hub-rpg-boss-art')}else{const im=$('img',c);if(im){im.style.objectFit='cover';im.style.objectPosition=(i*50)+'% 24%'}}bg.append(c)});bp.append(bg);
const sp=$('[data-panel="scenes"]',hub);sp.replaceChildren();sp.append(mk('p','world-hub-intro','Galeria oficial de exploração. Clique para ampliar; use os botões ou a roda do mouse para zoom e arraste a imagem para examinar os detalhes.'));const sg=mk('div','world-hub-scenes');for(let i=1;i<=4;i++){const path='assets/img/cenarios/'+folders[active]+'/area_0'+i+'.webp?v=33';const f=mk('figure');const im=mk('img');im.src=path;im.alt='Cenário de exploração '+i+' — '+name;im.loading='lazy';im.addEventListener('click',()=>openImage(path,im.alt));im.addEventListener('error',()=>{f.hidden=true});f.append(im,mk('figcaption','',name+' · Cenário '+i));sg.append(f)}sp.append(sg);switchTab(selected);renderAudio()}
function switchTab(name){selected=name;$$('.world-hub-tab',hub).forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.tab===name));b.tabIndex=b.dataset.tab===name?0:-1});$$('.world-hub-panel',hub).forEach(p=>{p.hidden=p.dataset.panel!==name})}
$$('.world-hub-tab',hub).forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
function open(i,origin){if(i<0||i>=9)return;previous=origin||document.activeElement;active=i;selected='enemies';render();hub.hidden=false;document.body.classList.add('world-hub-locked');renderAudio();$('.world-hub-close',hub).focus()}
function close(){const sound=$('.world-hub-audio audio',hub);if(sound){sound.pause();sound.removeAttribute('src')}closeViewer();hub.hidden=true;document.body.classList.remove('world-hub-locked');previous?.focus?.()}
$('.world-hub-close',hub).addEventListener('click',close);hub.addEventListener('click',e=>{if(e.target===hub)close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!viewer.hidden){closeViewer();e.preventDefault()}else if(!hub.hidden){close();e.preventDefault()}}});
fetch('content/lore.json').then(r=>r.ok?r.json():null).then(data=>{worlds=(data?.worlds||[]).slice(0,9)}).catch(()=>{});
document.addEventListener('click',e=>{const b=e.target.closest('[data-codex="world"]');if(b){const i=realmNames.indexOf(b.dataset.id);if(i>=0){e.preventDefault();e.stopImmediatePropagation();open(i,b);return}}const spotlight=e.target.closest('#reinos .world-spotlight .spotlight-picture img');if(spotlight){const i=realmNames.indexOf(document.querySelector('#reinos .world-spotlight .spotlight-copy h3')?.textContent?.trim());if(i>=0){e.preventDefault();e.stopImmediatePropagation();open(i,spotlight);return}}},true);
})();
