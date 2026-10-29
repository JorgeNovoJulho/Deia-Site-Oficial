(()=>{'use strict';
const container=document.querySelector('#musicas .tracks');if(!container)return;
let activeAudio=null;
const status=document.createElement('p');status.className='music-catalog-status';status.setAttribute('role','status');container.before(status);
const root=document.createElement('div');root.className='music-card-grid';container.after(root);container.hidden=true;
const empty=document.createElement('p');empty.className='music-empty';empty.textContent='Nenhuma faixa desta categoria foi publicada ainda.';empty.hidden=true;root.after(empty);
const format=s=>s==='exploracao'?'Exploração':s==='boss'?'Chefe':s==='ambiente'?'Ambiente':s==='encontro'?'Encontro':'Tema';
const worlds=['Terra Encantada','Terra de Fogo','Terra do Gelo','Terra dos Doces','Cavernas Obscuras','Terra dos Mortos','Pântano Venenoso','Terra dos Dinossauros','Terra do Futuro'];
function stopOther(audio){if(activeAudio&&activeAudio!==audio){activeAudio.pause();activeAudio.currentTime=0}activeAudio=audio}
function makeCard(track){
 const card=document.createElement('article');card.className='music-entry';card.dataset.trackId=track.id;card.dataset.kind=track.kind;
 const image=document.createElement('img');image.className='music-art';image.alt='';image.loading='lazy';const world=worlds.indexOf(track.scope);image.src=world<0?'assets/img/personagens/deia-retrato-oficial.webp':`assets/img/reinos/reino-${world}-paisagem-oficial.webp`;
 const name=document.createElement('strong');name.textContent=track.title;const meta=document.createElement('span');meta.className='music-meta';meta.textContent=track.scope+' · '+format(track.kind);
 const inner=document.createElement('div');inner.className='music-entry-head';inner.append(name,meta);
 const player=document.createElement('audio');player.controls=true;player.preload='none';player.controlsList='nodownload noplaybackrate';player.src=track.src.split('/').map(encodeURIComponent).join('/');player.setAttribute('aria-label','Ouvir '+track.title);
 player.addEventListener('play',()=>stopOther(player));player.addEventListener('error',()=>{if(card.querySelector('.music-error'))return;const err=document.createElement('small');err.className='music-error';err.textContent='Não foi possível carregar esta faixa.';card.append(err)});
 card.append(image,inner,player);return card;
}
function render(tracks){
 // Planning records remain available to the existing administration panel; only actual audio is presented publicly.
 const published=tracks.filter(track=>track.src).sort((a,b)=>Date.parse(b.published_at||0)-Date.parse(a.published_at||0));root.replaceChildren(...published.map(makeCard));status.textContent=published.length+' faixas oficiais disponíveis para ouvir.';
 const filter=document.createElement('div');filter.className='sound-filter';filter.setAttribute('aria-label','Filtrar músicas');
 const categories=[['Todas',''],['Exploração','exploracao'],['Chefes','boss'],['Ambientes','ambiente'],['Encontros','encontro']];
 for(const [label,kind] of categories){const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-pressed',String(!kind));button.classList.toggle('active',!kind);button.addEventListener('click',()=>{filter.querySelectorAll('button').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});let count=0;root.querySelectorAll('.music-entry').forEach(card=>{card.hidden=!!kind&&!card.dataset.kind.startsWith(kind);if(!card.hidden)count++});empty.hidden=count>0;if(activeAudio)activeAudio.pause()});filter.append(button)}
 status.before(filter);empty.hidden=published.length>0;
 const preview=document.querySelector('.v9-sound');if(preview&&published.length){const featured=makeCard(published[0]);featured.querySelector('.music-art').remove();preview.replaceChildren(featured);const link=document.createElement('a');link.href='#musicas';link.textContent='Ouvir todas as músicas →';preview.append(link)}
 const oldNote=document.querySelector('#musicas > .note');if(oldNote)oldNote.textContent='Ouça as composições oficiais publicadas. Novas faixas aparecerão aqui quando estiverem disponíveis.';
}
fetch('content/music-catalog.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(data=>{if(!Array.isArray(data.tracks))throw Error('Catálogo inválido');render(data.tracks)}).catch(e=>{console.warn('Catálogo indisponível:',e);status.textContent='Não foi possível carregar as faixas. Atualize a página para tentar novamente.'});
})();
