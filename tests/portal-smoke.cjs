const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.PORTAL_URL||'http://127.0.0.1:8000/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [1440,1024,390]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))errors.push(r.status()+' '+r.url())});
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.locator('.v13-banner-img').waitFor({state:'visible'});
   await page.waitForFunction(()=>document.querySelector('#inicio .v9-realms a')?.querySelector('img')?.complete);
   assert.equal(await page.locator('#inicio .v9-realms a').count(),9,'nine homepage world cards');
   assert.equal(await page.locator('#inicio .v9-portraits a').count(),3,'three main portraits');
   const imgs=await page.locator('#inicio .v9-realms img').all();
   for(const im of imgs){await im.evaluate(async e=>e.decode());assert(await im.evaluate(e=>e.naturalWidth>0),'realm image missing')}
   const vael=page.locator('#inicio .v9-portraits a').nth(2).locator('img');
   assert(await vael.evaluate(e=>e.complete&&e.naturalWidth>0),'VaelZhar portrait missing');
   await page.waitForFunction(()=>document.querySelector('#musicas .music-card-grid audio'));
   await page.locator('#inicio .v9-realms a').nth(1).click();
   const viewer=page.locator('.realm-viewer:not([hidden])');
   await viewer.waitFor();
   assert.equal(await viewer.locator('.realm-viewer-title').textContent(),'Terra de Fogo');
   await viewer.locator('.realm-viewer-stage img').evaluate(async e=>e.decode());
   assert(await viewer.locator('.realm-viewer-stage img').evaluate(e=>e.naturalWidth>0));
   await page.waitForFunction(()=>document.querySelector('.realm-viewer audio')?.getAttribute('src')?.includes('terra-de-fogo-exploracao.mp3'));
   assert(await viewer.locator('[data-music="exploracao"]').isVisible(),'Exploration button must be visible');
   assert(await viewer.locator('[data-music="boss"]').isVisible(),'Boss button must be visible');
   assert(await viewer.locator('[data-music="boss"]').evaluate(e=>{const r=e.getBoundingClientRect();return r.width>=60&&r.height>=30&&r.bottom<=innerHeight+2}),'Boss button must fit viewport');
   assert.equal(await viewer.locator('[data-music="exploracao"]').getAttribute('aria-pressed'),'true');
   assert(await viewer.locator('[data-music="boss"]').isEnabled(),'published boss track should be selectable');
   await viewer.locator('[data-music="boss"]').click();
   await page.waitForFunction(()=>document.querySelector('.realm-viewer audio')?.getAttribute('src')?.includes('terra-de-fogo-boss.mp3'));
   assert.equal(await viewer.locator('[data-music="boss"]').getAttribute('aria-pressed'),'true');
   await viewer.locator('[data-music="exploracao"]').click();
   await page.waitForFunction(()=>document.querySelector('.realm-viewer audio')?.getAttribute('src')?.includes('terra-de-fogo-exploracao.mp3'));
   const originalZoomWidth=await viewer.locator('.realm-viewer-stage img').evaluate(e=>e.getBoundingClientRect().width);
   await viewer.locator('[data-zoom="1"]').click();
   assert.equal(await viewer.locator('[data-reset]').textContent(),'130%');
   assert(await viewer.locator('.realm-viewer-stage img').evaluate(e=>e.getBoundingClientRect().width)>originalZoomWidth*1.2,'Zoom should enlarge rendered image dimensions');
   await viewer.locator('[data-zoom="-1"]').click();
   assert.equal(await viewer.locator('[data-reset]').textContent(),'100%');
   await page.screenshot({path:'/tmp/portal-realm-'+width+'.png'});
   await page.keyboard.press('Escape');
   assert(await page.locator('.realm-viewer').isHidden(),'viewer remains visible');
   assert(await page.locator('.realm-viewer audio').evaluate(e=>e.paused),'realm audio still playing');
   await page.locator('#inicio .v9-realms a').nth(3).click();
   await page.locator('.realm-viewer:not([hidden])').waitFor();
   assert.equal(await page.locator('.realm-viewer-title').textContent(),'Terra dos Doces');
   assert(await page.locator('.realm-viewer audio').isHidden(),'unpublished exploration music should not fake playback');
   await page.locator('.realm-viewer-close').click();
   await page.screenshot({path:'/tmp/portal-home-'+width+'.png',fullPage:false});
   if(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2))throw Error('Horizontal overflow at '+width);
   if(errors.length)throw Error('Browser errors '+JSON.stringify(errors));
   await page.goto(new URL('admin/',base).href);
   assert(await page.locator('#login').isVisible(),'admin login missing');
   assert(await page.locator('#console').isHidden(),'admin content must require authentication');
   console.log('PASS '+width+'px homepage portraits/realms, zoom, audio binding, modal close, mobile layout, admin');
   await page.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
