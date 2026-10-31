const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.PORTAL_URL||'http://127.0.0.1:8000/';
(async()=>{
const browser=await chromium.launch({headless:true});
try{
 for(const [name,width,height] of [['desktop',1440,900],['tablet',768,1024],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  const worlds=page.locator('[data-codex="world"]');
  await worlds.first().waitFor();
  assert.equal(await worlds.count(),9,'All nine world cards must exist');
  for(let i=0;i<9;i++){
   await worlds.nth(i).click();
   const modal=page.locator('.world-hub:not([hidden])');
   await modal.waitFor({state:'visible'});
   for(const [tab,panel] of [['enemies','enemies'],['bosses','bosses'],['scenes','scenes']]){
    await modal.locator('[data-tab="'+tab+'"]').click();
    assert.equal(await modal.locator('.world-hub-panel:visible').count(),1,'Exactly one panel: '+name+' '+i+' '+tab);
    assert.equal(await modal.locator('.world-hub-panel:visible').getAttribute('data-panel'),panel);
    assert.equal(await modal.locator('.world-hub-music-choices button').count(),2,'Music switches are protected');
   }
   if(i<3){
    await modal.locator('[data-tab="enemies"]').click();
    assert.equal(await modal.locator('[data-panel="enemies"] .world-hub-card img').count(),10);
    const art=modal.locator('[data-panel="enemies"] .world-hub-card img').first();
    await art.evaluate(async e=>{await e.decode()});
    assert(await art.evaluate(e=>e.naturalWidth>0),'RPG image must load');
    await art.click();
    const viewer=page.locator('.world-hub-viewer:not([hidden])');
    await viewer.waitFor({state:'visible'});
    await viewer.locator('[data-vzoom="1"]').click();
    assert.notEqual((await viewer.locator('[data-vzoom="reset"]').innerText()).trim(),'100%');
    await viewer.locator('[data-vzoom="reset"]').click();
    assert.equal((await viewer.locator('[data-vzoom="reset"]').innerText()).trim(),'100%');
    const dims=await viewer.evaluate(el=>{const v=el.querySelector('.world-hub-viewer-viewport'),img=el.querySelector('img');return {vw:v.clientWidth,vh:v.clientHeight,w:img.clientWidth,h:img.clientHeight}});
    assert(dims.w<=dims.vw&&dims.h<=dims.vh,'Complete artwork should fit at initial zoom');
    await viewer.locator('[data-vclose]').click();
   }
   await modal.locator('.world-hub-close').click();await modal.waitFor({state:'hidden'});
  }
  await page.screenshot({path:'/tmp/portal-'+name+'-worlds.png',fullPage:false});
  assert.deepEqual(errors,[],'No client-side JavaScript errors: '+name);
  await page.close();
 }
 const page=await browser.newPage();
 await page.goto(new URL('admin/',base).href);
 assert(await page.locator('#loginForm').isVisible(),'Admin must require login');
 assert(await page.locator('#console').isHidden(),'Admin console must be hidden without credentials');
 await page.close();
 console.log('PASS: 9 worlds, isolated tabs, audio controls, 3 viewports, zoom and admin login gate');
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
