const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.PORTAL_URL||'http://127.0.0.1:8000/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [1920,1440,1024,768,430,390,360,320]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))errors.push(r.status()+' '+r.url())});
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.locator('.v13-banner-img').waitFor({state:'visible'});
   await page.waitForFunction(()=>document.querySelector('#inicio .v9-realms a')?.querySelector('img')?.complete);
   assert.equal(await page.locator('#inicio .v9-realms a').count(),9,'nine homepage world cards');
   assert.equal(await page.locator('#inicio .v9-portraits a').count(),3,'three main portraits');
   assert.equal(await page.locator('#guardioes .guardian-picture-v28 img').count(),9,'Nine guardian artworks or realm context images required');
   assert.equal(await page.locator('.realm-gallery-v32').count(),1,'Realm gallery controls mounted');
   const imgs=await page.locator('#inicio .v9-realms img').all();
   for(const im of imgs){await im.evaluate(async e=>e.decode());assert(await im.evaluate(e=>e.naturalWidth>0),'realm image missing')}
   const vael=page.locator('#inicio .v9-portraits a').nth(2).locator('img');
   assert(await vael.evaluate(e=>e.complete&&e.naturalWidth>0),'VaelZhar portrait missing');
   await page.waitForFunction(()=>document.querySelector('#musicas .sound-card-v25 .sound-play-v25'));
   // Requested components must be present, not merely referenced in source.
   assert(await page.locator('#inicio .deia-video-box video').count()===1,'Homepage video element missing');
   assert(await page.locator('#inicio .deia-video-note').count()===1,'Video placeholder must exist before upload');
   const galleryFirst=page.locator('.v9-gallery img').first();
   await galleryFirst.click();
   assert(await page.locator('.v16-lightbox:not([hidden])').isVisible(),'Gallery must open in its own single lightbox');
   assert(await page.locator('.codex-modal').isHidden(),'Second gallery modal must remain closed');
   assert((await page.locator('.v16-lightbox-caption').textContent()).includes('1 / '),'Gallery item counter missing');
   await page.locator('.v35-gallery-next').click();
   assert((await page.locator('.v16-lightbox-caption').textContent()).includes('2 / '),'Gallery next failed');
   await page.keyboard.press('ArrowLeft');
   assert((await page.locator('.v16-lightbox-caption').textContent()).includes('1 / '),'Gallery previous failed');
   await page.keyboard.press('Escape');
   assert(await page.locator('.v16-lightbox').isHidden(),'Gallery did not close');
   await page.locator('#personagens [data-codex="character"][data-id="Déia"]').click();
   await page.locator('.codex-modal:not([hidden])').waitFor();
   assert(await page.locator('.codex-modal .character-gallery-tools').isVisible(),'Character gallery controls missing');
   assert(await page.locator('.codex-modal .character-sound').isVisible(),'Character soundtrack controls missing');
   const firstPortrait=await page.locator('.codex-modal .codex-visual img').getAttribute('src');
   await page.locator('.codex-modal .character-gallery-tools button').last().click();
   assert.notEqual(await page.locator('.codex-modal .codex-visual img').getAttribute('src'),firstPortrait,'Character next image did not work');
   await page.keyboard.press('Escape');
   assert(await page.locator('#inicio .v9-sound .sound-featured-v25 img').count()===1,'Featured music artwork missing');
   assert(await page.locator('#musicas .sound-play-v25').count()>=1,'Custom music player missing');
   assert(await page.locator('#musicas .sound-cover-v25').count()>=1,'Music artwork missing');
   assert(await page.locator('link[rel="stylesheet"]').count()>=1,'Site stylesheet missing');
   assert(await page.locator('#musicas .sound-cover-v25').first().evaluate(img=>img.complete&&img.naturalWidth>0),'Published track cover failed to load');
   assert(await page.locator('#musicas .sound-card-premium .sound-equalizer-v26').count()>=1,'Premium audio ornament missing');
   assert(await page.locator('#musicas .sound-card-premium .sound-kind-v26').count()>=1,'Audio track category badge missing');
   await page.locator('#inicio .v9-realms a').nth(1).click();
   const viewer=page.locator('.realm-viewer:not([hidden])');
   await viewer.waitFor();
   assert.equal(await viewer.locator('.realm-viewer-title').textContent(),'Terra de Fogo');
   assert.equal(await viewer.locator('.realm-gallery-counter').textContent(),'1 / 5');
   await viewer.locator('[data-slide="1"]').click();
   await viewer.locator('.realm-viewer-stage img').evaluate(async e=>e.decode());
   assert((await viewer.locator('.realm-viewer-stage img').getAttribute('src')).includes('02_terra_de_fogo/area_01.webp'),'exploration carousel shows wrong asset');
   await viewer.locator('[data-pause]').click();
   assert.equal(await viewer.locator('[data-pause]').getAttribute('aria-pressed'),'true','manual pause failed');
   await viewer.locator('[data-slide="-1"]').click();
   assert.equal(await viewer.locator('.realm-gallery-counter').textContent(),'1 / 5');
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
   assert.equal(await viewer.locator('[data-pause]').getAttribute('aria-pressed'),'true','zoom must pause carousel');
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
   const persistent=[];
   for(const problem of errors){
    if(/^503 https?:\/\//.test(problem)){
     const url=problem.slice(4);let recovered=false;
     for(let retry=0;retry<3;retry++){
      await page.waitForTimeout(400);
      const response=await page.request.get(url,{headers:{'Cache-Control':'no-cache'}}).catch(()=>null);
      if(response?.ok()){recovered=true;break}
     }
     if(recovered)continue;
    }
    persistent.push(problem);
   }
   if(persistent.length)throw Error('Browser errors '+JSON.stringify(persistent));
   await page.goto(new URL('admin/',base).href);
   assert(await page.locator('#login').isVisible(),'admin login missing');
   assert(await page.locator('#console').isHidden(),'admin content must require authentication');
   assert(await page.locator('#videos #videoSource').count()===1,'Admin video configuration missing');
   assert(await page.locator('#musicCover').count()===1,'Admin cover editor missing');
   console.log('PASS '+width+'px homepage portraits/realms, zoom, audio binding, modal close, mobile layout, admin');
   await page.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
