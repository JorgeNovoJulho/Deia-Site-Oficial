const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.PORTAL_URL||'http://127.0.0.1:8000/';
const repo='JorgeNovoJulho/Deia-Site-Oficial';
const url='https://api.github.com/repos/'+repo;
(async()=>{
const browser=await chromium.launch({headless:true});
try{
const page=await browser.newPage({viewport:{width:1280,height:850}});
const calls=[];
await page.route('https://api.github.com/**',async route=>{
 const req=route.request(),u=new URL(req.url()),p=u.pathname;
 calls.push({method:req.method(),path:p});
 if(p==='/repos/'+repo)return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({permissions:{push:true}})});
 if(p==='/repos/'+repo+'/contents/assets/audio')return route.fulfill({status:200,contentType:'application/json',body:'[]'});
 if(p==='/repos/'+repo+'/contents/assets/img/')return route.fulfill({status:200,contentType:'application/json',body:'[]'});
 if(p.startsWith('/repos/'+repo+'/contents/')){
  const file=p.slice(('/repos/'+repo+'/contents/').length);
  const known={};
  if(file==='index.html')known[file]='<!doctype html><html lang="pt-BR"><head></head><body><section id="inicio"><h2>Início</h2></section><section id="reinos"><h2>Reinos</h2></section></body></html>';
  if(file==='content/music-catalog.json')known[file]=JSON.stringify({tracks:[{id:'a',scope:'Terra Encantada',kind:'exploracao',title:'Exploração',src:null}]});
  if(file==='content/video-feature.json')known[file]=JSON.stringify({src:null,poster:'assets/img/world_0.webp'});
  if(!(file in known))return route.fulfill({status:404,contentType:'application/json',body:'{"message":"Not Found"}'});
  return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({type:'file',sha:'test-sha',content:Buffer.from(known[file]).toString('base64')})});
 }
 return route.continue();
});
await page.goto(new URL('admin/',base).href);
assert(await page.locator('#loginForm').isVisible());
assert(await page.locator('#console').isHidden());
await page.locator('#token').fill('unit-test-token-not-real');
await page.locator('#loginForm button').click();
await page.locator('#console').waitFor({state:'visible'});
assert(await page.locator('#login').isHidden());
for(const t of ['sections','musiccards','videos','media','files']){
 await page.locator('[data-tab="'+t+'"]').click();
 assert(await page.locator('#'+t).isVisible(),'Admin tab '+t+' unavailable');
}
await page.locator('#logout').click();
assert(await page.locator('#console').isHidden(),'logout must hide console');
assert(await page.locator('#login').isVisible(),'logout must return to login');
assert(!calls.some(c=>c.method!=='GET'),'mocked admin navigation must not publish or delete data');
console.log('PASS: simulated admin authentication, five tabs, logout; no write actions');
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
