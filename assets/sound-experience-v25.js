(()=>{'use strict';
const legacy=document.querySelector('#musicas .tracks');if(!legacy)return;
const worlds=['Terra Encantada','Terra de Fogo','Terra do Gelo','Terra dos Doces','Cavernas Obscuras','Terra dos Mortos','Pântano Venenoso','Terra dos Dinossauros','Terra do Futuro'];
const portraits={'Déia':'deia-retrato-oficial.webp','Fhenrir':'fhenrir-retrato-oficial.webp','Vovó Brasa':'vovo-brasa-aprovada.webp','Alderyon':'alderyon-valtheris-aprovado.webp','Seralyth':'seralyth-asterion-aprovada.webp','Elyndor':'elyndor-aprovado.webp','Vael’Zhar':'vaelzhar-aprovado.webp'};
let current=null,selected='all',cards=[];
const list=document.createElement('div');list.className='sound-cards-v25';legacy.after(list);legacy.hidden=true;
const toolbar=document.createElement('div');toolbar.className='sound-tools-v25';const note=document.createElement('span');note.setAttribute('role','status');
const filters=[['Todas','all'],['Exploração','exploracao'],['Chefes','boss'],['Temas','tema'],['Ambientes','ambiente'],['Encontros','encontro']];
for(const [label,key] of filters){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.filter=key;b.setAttribute('aria-pressed',String(key===selected));b.addEventListener('click',()=>{selected=key;toolbar.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderVisibility()});toolbar.append(b)}
list.before(toolbar,note);
const path=t=>{const n=worlds.indexOf(t.scope);return n>=0?'assets/img/reinos/reino-'+n+'-paisagem-oficial.webp':'assets/img/personagens/'+(portraits[t.scope]||'deia-retrato-oficial.webp')};
const url=p=>p.split('/').map(encodeURIComponent).join('/');
const fmt=t=>t.kind==='exploracao'?'Trilha de exploração':t.kind==='boss'?'Batalha do chefe':t.kind==='tema'?'Tema do personagem':t.kind==='ambiente'?'Ambiente':'Encontro';
function stop(){if(current){current.audio.pause();current.audio.currentTime=0;current.button.textContent='▶';current.button.setAttribute('aria-label','Reproduzir '+current.title);current=null}}
function clock(v){if(!Number.isFinite(v))return '0:00';return Math.floor(v/60)+':'+String(Math.floor(v%60)).padStart(2,'0')}
function card(t){const el=document.createElement('article');el.className='sound-card-v25';el.dataset.kind=t.kind;el.classList.add('sound-card-premium');
const cover=document.createElement('img');cover.src=(typeof t.cover==='string'&&/^assets\/img\/[a-zA-Z0-9_./-]+$/.test(t.cover))?t.cover:path(t);cover.alt='Arte oficial de '+t.scope;cover.loading='lazy';cover.className='sound-cover-v25';
const content=document.createElement('div');content.className='sound-content-v25';const aura=document.createElement('div');aura.className='sound-aura-v26';aura.setAttribute('aria-hidden','true');const eq=document.createElement('span');eq.className='sound-equalizer-v26';eq.setAttribute('aria-hidden','true');eq.innerHTML='<i></i><i></i><i></i><i></i><i></i>';const pill=document.createElement('span');pill.className='sound-kind-v26';pill.textContent=fmt(t);const heading=document.createElement('div');heading.className='sound-heading-v25';
const title=document.createElement('h3');title.textContent=t.title;const meta=document.createElement('small');meta.textContent=t.scope+' · '+fmt(t);heading.append(pill,title,meta);
const controls=document.createElement('div');controls.className='sound-player-v25';const button=document.createElement('button');button.type='button';button.className='sound-play-v25';button.textContent='▶';button.setAttribute('aria-label','Reproduzir '+t.title);
const progress=document.createElement('input');progress.type='range';progress.min='0';progress.max='1000';progress.value='0';progress.step='1';progress.setAttribute('aria-label','Posição da faixa '+t.title);
const time=document.createElement('span');time.className='sound-time-v25';time.textContent='0:00 / 0:00';
const vol=document.createElement('input');vol.type='range';vol.min='0';vol.max='1';vol.step='.05';vol.value='.8';vol.className='sound-volume-v25';vol.setAttribute('aria-label','Volume da faixa '+t.title);
const audio=document.createElement('audio');audio.preload='none';audio.src=url(t.src);audio.volume=.8;
const state={audio,button,title:t.title};audio.addEventListener('play',()=>{el.classList.add('is-playing')});audio.addEventListener('pause',()=>{el.classList.remove('is-playing')});button.addEventListener('click',()=>{if(current===state&&!audio.paused){audio.pause();button.textContent='▶';return}if(current&&current!==state)stop();document.querySelectorAll('audio').forEach(a=>{if(a!==audio)a.pause()});current=state;audio.play().then(()=>{button.textContent='Ⅱ';button.setAttribute('aria-label','Pausar '+t.title)}).catch(()=>{button.textContent='▶';time.textContent='Reprodução indisponível'})});
audio.addEventListener('timeupdate',()=>{progress.value=audio.duration?Math.round(audio.currentTime/audio.duration*1000):0;time.textContent=clock(audio.currentTime)+' / '+clock(audio.duration)});
audio.addEventListener('loadedmetadata',()=>time.textContent=clock(audio.currentTime)+' / '+clock(audio.duration));
audio.addEventListener('ended',()=>{button.textContent='▶';if(current===state)current=null});
audio.addEventListener('pause',()=>{button.textContent='▶'});
audio.addEventListener('error',()=>time.textContent='Arquivo indisponível');
progress.addEventListener('input',()=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=Number(progress.value)/1000*audio.duration});
vol.addEventListener('input',()=>audio.volume=Number(vol.value));
controls.append(button,progress,time,vol,audio);content.append(heading,eq,controls);el.append(aura,cover,content);return el}
function renderVisibility(){let count=0;cards.forEach(el=>{el.hidden=selected!=='all'&&el.dataset.kind!==selected;if(!el.hidden)count++});note.textContent=count+' músicas disponíveis';if(current&&current.button.closest('.sound-card-v25')?.hidden)stop()}
function sortSongs(songs){return songs.filter(t=>t.src).map((t,i)=>({...t,_i:i})).sort((a,b)=>{const at=Date.parse(a.published_at||''),bt=Date.parse(b.published_at||'');if(Number.isFinite(at)&&Number.isFinite(bt))return bt-at;if(Number.isFinite(at))return -1;if(Number.isFinite(bt))return 1;return b._i-a._i})}
fetch('content/music-catalog.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(d=>{const songs=sortSongs(d.tracks||[]);cards=songs.map(card);list.replaceChildren(...cards);renderVisibility();const home=document.querySelector('#inicio .v9-sound');if(home&&songs.length){const featured=card(songs[0]);featured.classList.add('sound-featured-v25');home.replaceChildren(featured);const link=document.createElement('a');link.href='#musicas';link.textContent='Explorar todas as músicas';home.append(link)}}).catch(e=>{note.textContent='Não foi possível carregar o catálogo musical';console.error(e)});
})();