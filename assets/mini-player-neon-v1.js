(()=>{'use strict';
const CATALOG='content/music-catalog.json';
const root=document.createElement('aside');root.className='deia-mini-player';root.setAttribute('aria-label','Mini player musical do portal');
root.innerHTML='<div class="dmp-top"><span class="dmp-orb" aria-hidden="true">♫</span><div class="dmp-track"><small>TRILHA DOS NOVE REINOS</small><strong id="dmp-title">Carregando músicas...</strong><span id="dmp-status" role="status">Preparando a trilha sonora</span></div><button type="button" id="dmp-toggle" aria-label="Recolher player" title="Recolher">⌄</button></div><div class="dmp-controls"><button type="button" id="dmp-prev" aria-label="Música anterior" title="Anterior">⏮</button><button type="button" id="dmp-play" aria-label="Reproduzir" title="Reproduzir">▶</button><button type="button" id="dmp-next" aria-label="Próxima música" title="Próxima">⏭</button><label class="dmp-volume">♫ <input id="dmp-volume" type="range" min="0" max="100" step="1" value="40" aria-label="Volume do mini player"><span id="dmp-volume-value">40%</span></label></div>';
document.body.append(root);
const $=s=>root.querySelector(s),title=$('#dmp-title'),status=$('#dmp-status'),play=$('#dmp-play'),vol=$('#dmp-volume'),volValue=$('#dmp-volume-value'),audio=document.createElement('audio');
audio.preload='metadata';audio.volume=.4;audio.setAttribute('aria-label','Trilha ambiente do portal');audio.dataset.deiaMini='true';
root.append(audio);
let queue=[],index=0,blocked=false,mutedForLocal=false,started=false;
function sync(){play.textContent=audio.paused?'▶':'❚❚';play.setAttribute('aria-label',audio.paused?'Reproduzir':'Pausar');root.classList.toggle('is-playing',!audio.paused)}
function setTrack(i){if(!queue.length)return;index=(i+queue.length)%queue.length;audio.src=queue[index].src;title.textContent=queue[index].title;status.textContent=queue[index].kind==='tema'?'Tema de abertura':'Exploração — '+queue[index].scope;audio.load();sync()}
async function start(){if(!queue.length)return;mutedForLocal=false;try{await audio.play();blocked=false;started=true;sync()}catch(e){blocked=true;status.textContent='Clique em ▶ para ativar a música';sync()}}
function stopForLocal(){if(audio.paused)return;audio.pause();mutedForLocal=true;status.textContent='Música do local em destaque · ▶ para retomar';sync()}
function localIsPlaying(){return [...document.querySelectorAll('audio')].some(a=>a!==audio&&!a.paused)}
document.addEventListener('play',e=>{if(e.target instanceof HTMLAudioElement && e.target!==audio)stopForLocal()},true);
audio.addEventListener('play',()=>{for(const a of document.querySelectorAll('audio'))if(a!==audio&&!a.paused)a.pause();sync()});
audio.addEventListener('pause',sync);audio.addEventListener('ended',()=>{setTrack(index+1);start()});
audio.addEventListener('error',()=>{status.textContent='Arquivo indisponível · próxima faixa';sync()});
play.addEventListener('click',()=>{if(!audio.paused){audio.pause();status.textContent='Pausado pelo visitante'}else start()});
function navigate(delta){setTrack(index+delta);start()}
$('#dmp-prev').addEventListener('click',()=>navigate(-1));
$('#dmp-next').addEventListener('click',()=>navigate(1));
vol.addEventListener('input',()=>{audio.volume=Number(vol.value)/100;volValue.textContent=vol.value+'%'});
$('#dmp-toggle').addEventListener('click',()=>{root.classList.toggle('is-collapsed');const b=$('#dmp-toggle');b.textContent=root.classList.contains('is-collapsed')?'⌃':'⌄';b.setAttribute('aria-label',root.classList.contains('is-collapsed')?'Expandir player':'Recolher player')});
fetch(CATALOG,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Catálogo não encontrado');return r.json()}).then(data=>{
const tracks=Array.isArray(data.tracks)?data.tracks.filter(t=>typeof t.src==='string'&&t.src.startsWith('assets/audio/')):[];
const opening=tracks.find(t=>/a pequena dragonisa/i.test(t.title));
const exploration=tracks.filter(t=>t.kind==='exploracao');
queue=[...(opening?[opening]:[]),...exploration.filter(t=>t!==opening)];
if(!queue.length){title.textContent='Nenhuma faixa disponível';status.textContent='Consulte a seção Músicas';play.disabled=true;return}
setTrack(0);
if(!localIsPlaying())start();else {mutedForLocal=true;status.textContent='Música do local em destaque · ▶ para retomar'}
}).catch(()=>{title.textContent='Catálogo indisponível';status.textContent='Tente novamente mais tarde';play.disabled=true});
})();