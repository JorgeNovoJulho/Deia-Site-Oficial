const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');const exists=p=>fs.existsSync(path.join(root,p));
const realms=['terra_encantada','terra_de_fogo','terra_do_gelo','terra_dos_doces','cavernas_obscuras','terra_dos_mortos','pantano_venenoso','terra_dos_dinossauros','terra_do_futuro'];
const scene=['01_terra_encantada','02_terra_de_fogo','03_terra_do_gelo','04_terra_dos_doces','05_cavernas_obscuras','08_terra_dos_mortos','07_pantano_venenoso','06_terra_dos_dinossauros','09_terra_do_futuro'];
const errors=[],inventory={};
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)=["']((?:assets|content)\/[^"']+)["']/g)){
 const p=match[1].split('?')[0].split('#')[0];if(!exists(p))errors.push('Missing referenced asset: '+p);
}
for(let i=0;i<9;i++){
 const dir='assets/img/cards-rpg/'+realms[i];
 const cards=exists(dir)?fs.readdirSync(path.join(root,dir)).filter(x=>x.endsWith('.webp')):[];
 const scenes=[1,2,3,4].map(n=>'assets/img/cenarios/'+scene[i]+'/area_0'+n+'.webp');
 for(const p of scenes)if(!exists(p))errors.push('Missing scenario: '+p);
 if(i<3&&cards.length!==13)errors.push('Approved realm '+realms[i]+' must keep 13 RPG cards; found '+cards.length);
 inventory[realms[i]]={cards:cards.length,scenes:scenes.filter(exists).length};
}
const music=JSON.parse(fs.readFileSync(path.join(root,'content/music-catalog.json'),'utf8')).tracks;
for(const t of music)if(t.src&&!exists(t.src))errors.push('Missing published audio '+t.src);
const admin=fs.readFileSync(path.join(root,'admin/admin.js'),'utf8');
assert(admin.includes("info.permissions?.push"),'Admin must check repository write access');
assert(admin.includes("$('#console').hidden=false"),'Admin access granted only after verification');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}
console.log(JSON.stringify({inventory,tracks:music.length,published:music.filter(x=>x.src).length,missingAudio:music.filter(x=>!x.src).length,errors},null,2));
