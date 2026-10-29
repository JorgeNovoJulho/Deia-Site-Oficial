const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.PORTAL_URL || 'http://127.0.0.1:8000/';
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    for (const width of [1440, 1024, 768, 390, 360]) {
      const page = await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('response',r=>{if(r.status()>=400 && r.url().startsWith(base)) errors.push(`${r.status()} ${r.url()}`)});
      await page.goto(base);
      await page.waitForFunction(()=>document.querySelector('#musicas .music-card-grid audio'));
      await page.locator('.v13-banner-img').waitFor({state:'visible'});
      await page.waitForFunction(()=>document.querySelector('.v13-banner-img')?.naturalWidth===1983);
      assert(await page.locator('.v9-cover').evaluate(e=>e.classList.contains('v13-banner-ready')));
      assert(await page.locator('.v13-banner-img').evaluate(e=>Math.abs(e.clientWidth/e.clientHeight-1983/793)<.04),'Banner aspect ratio');
      if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)){
        console.log('OVERFLOW',width,await page.evaluate(()=>({total:document.documentElement.scrollWidth,nodes:[...document.querySelectorAll('body *')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&e.getBoundingClientRect().right>innerWidth+1).slice(0,25).map(e=>({tag:e.tagName,cls:e.className,width:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right}))})));
        await page.screenshot({path:`/tmp/portal-overflow-${width}.png`});
      }
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow');
      if(width>1100) assert(await page.locator('#personagens').evaluate(e=>e.getBoundingClientRect().left>=132),'Rail overlaps content');
      if(width<=920){
        await page.locator('.menu-toggle').click();
        await page.locator('.nav a[href="#personagens"]').click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
        assert.equal(await page.evaluate(()=>location.hash),'#personagens');
        await page.locator('.menu-toggle').click();await page.keyboard.press('Escape');
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
      }
      const heroLinks=width<=630?'.v9-actions':'.v13-linkzones';
      for(const id of ['historia','reinos']){await page.locator(`${heroLinks} a[href="#${id}"]`).click();assert.equal(await page.evaluate(()=>location.hash),'#'+id)}
      await page.locator('[data-codex="character"][data-id="Déia"]').click();
      await page.locator('.codex-modal:not([hidden])').waitFor();
      assert.equal(await page.locator('#codex-heading').textContent(),'Déia');
      await page.getByRole('button',{name:'Aumentar zoom',exact:true}).click();
      assert.equal(await page.locator('.codex-modal:not([hidden]) [data-reset]').textContent(),'140%');
      await page.keyboard.press('Escape');
      for(const name of ['Vovó Brasa','Alderyon Valtheris','Seralyth Asterion','Elyndor','Aethrakar','Vaelor / Vael’Zhar']){
        await page.locator(`[data-codex="character"][data-id="${name}"]`).click();
        assert(await page.locator('.codex-visual').isVisible(),name+' portrait pane');
        await page.waitForFunction(()=>{const e=document.querySelector('.codex-visual img');return e.complete&&e.naturalWidth>0});
        assert((await page.locator('.codex-visual img').getAttribute('src')).includes('assets/img/personagens/'),name+' official asset');
        await page.keyboard.press('Escape');
      }
      assert.equal(await page.locator('#personagens .mystery-portrait').count(),0);
      for(const image of await page.locator('#galeria img[src*="/personagens/"]').all()){
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(e=>e.decode());
        assert(await image.evaluate(e=>e.complete&&e.naturalWidth>0));
      }
      await page.locator('#galeria img').first().click();
      await page.getByRole('button',{name:'Aumentar zoom',exact:true}).click();
      assert.equal(await page.locator('.codex-modal:not([hidden]) [data-reset]').textContent(),'140%');await page.keyboard.press('Escape');
      // Homepage world thumbnails must open the actual realm viewer.
      assert.equal(await page.locator('#inicio .v9-realms a').count(),9,'Nine homepage world cards');
      await page.locator('#inicio .v9-realms a').nth(1).click();
      await page.locator('.realm-viewer:not([hidden])').waitFor();
      assert.equal(await page.locator('.realm-viewer-title').textContent(),'Terra de Fogo');
      await page.waitForFunction(()=>document.querySelector('.realm-viewer audio')?.getAttribute('src')?.includes('terra-de-fogo-exploracao.mp3'));
      await page.locator('.realm-viewer [data-zoom="1"]').click();
      assert.equal(await page.locator('.realm-viewer [data-reset]').textContent(),'130%');
      await page.keyboard.press('Escape');
      assert(await page.locator('.realm-viewer').isHidden(),'Realm viewer closed');
      assert(await page.locator('.realm-viewer audio').evaluate(e=>e.paused),'Realm audio stopped');
      await page.locator('[data-codex="world"]').first().click();
      assert.equal(await page.locator('#codex-heading').textContent(),'Terra Encantada');await page.keyboard.press('Escape');
      await page.getByRole('button',{name:'Próximo reino',exact:true}).click();
      assert.equal(await page.locator('.spotlight-copy h3').textContent(),'Terra de Fogo');
      const musicCard='#musicas .music-entry';
      await page.locator('.sound-filter button').filter({hasText:'Exploração'}).click();
      assert(await page.locator(musicCard+':visible').count()>0,'Exploration filter returned no tracks');
      await page.locator('.sound-filter button').filter({hasText:'Todas'}).click();
      assert(await page.locator('#musicas .music-entry').count()>=80,'Music catalog cards should be present');
      
      // Every image must load, and character images must stay inside the portrait frame.
      const imageAudit=[];
      for(const image of await page.locator('img[src]:not(.codex-modal img)').all()){
        await image.scrollIntoViewIfNeeded();await image.evaluate(e=>e.decode());
        imageAudit.push(await image.evaluate(e=>({src:e.getAttribute('src'),w:e.naturalWidth,h:e.naturalHeight})));
      }
      assert(imageAudit.every(x=>x.w>0&&x.h>0),'Missing image');
      const gallerySources=await page.locator('#galeria img').evaluateAll(es=>es.map(e=>e.getAttribute('src')));assert.equal(new Set(gallerySources).size,gallerySources.length,'Duplicate gallery artwork');
      assert.equal(await page.locator('.v9-realms img[src*="/reinos/"]').count(),9,'Nine individual official landscape previews');
      for(const image of await page.locator('.codex-cover img').all()){
        assert(await image.evaluate(e=>{const p=e.parentElement.getBoundingClientRect(),i=e.getBoundingClientRect();return i.top>=p.top-1&&i.bottom<=p.bottom+1&&i.width<=p.width+1&&getComputedStyle(e).objectFit==='contain'}),'Portrait escapes frame');
      }
      for(const button of await page.locator('[data-codex="world"]').all()){
        await button.click();await page.locator('.codex-modal:not([hidden])').waitFor();
        await page.locator('.codex-visual img').evaluate(e=>e.decode());
        assert(await page.locator('.codex-visual img').evaluate(e=>e.naturalWidth===1400));
        await page.keyboard.press('Escape');
      }
      for(const button of await page.locator('[data-codex="guardian"]').all()){
        await button.click();assert(await page.locator('#codex-heading').isVisible());await page.keyboard.press('Escape');
      }
      for(const image of await page.locator('#galeria img,.v9-gallery img').all()){
        await image.click();await page.locator('.codex-visual img').evaluate(e=>e.decode());
        await page.getByRole('button',{name:'Aumentar zoom',exact:true}).click();
        assert.equal(await page.locator('.codex-modal:not([hidden]) [data-reset]').textContent(),'140%');
        await page.locator('.codex-modal:not([hidden]) [data-reset]').click();assert.equal(await page.locator('.codex-modal:not([hidden]) [data-reset]').textContent(),'100%');
        await page.keyboard.press('Escape');
      }
      for(const id of await page.locator('a[href^="#"]').evaluateAll(links=>[...new Set(links.map(a=>a.getAttribute('href')).filter(s=>s.length>1))])){
        assert.equal(await page.locator(id).count(),1,'Broken anchor '+id);
      }
      await page.locator('.sound-filter button').filter({hasText:'Encontros'}).click();
      assert(await page.locator('.music-empty').isVisible());
      await page.locator('.sound-filter button').filter({hasText:'Todas'}).click();
      assert(await page.locator('.v9-sound audio').isVisible(),'Homepage player controls missing');
      assert((await page.locator('.v9-sound audio').boundingBox()).height>=36,'Homepage player collapsed');
      // Audio playback is gesture-policy and environment dependent; verify registered tracks and UI instead.\n      console.log('IMAGE AUDIT',width,JSON.stringify(imageAudit));
      await page.locator('.v12-search-open').click();
      await page.locator('.v12-search input').fill('Fhenrir');
      assert.equal(await page.locator('.v12-results a').count(),1);await page.keyboard.press('Escape');
      await page.locator('.nav a[href="#personagens"]').count();
      await page.locator('[data-codex="character"][data-id="Vovó Brasa"]').click();
      await page.waitForFunction(()=>{const e=document.querySelector('.codex-visual img');return e.complete&&e.naturalWidth>0});
      await page.screenshot({path:`/tmp/portrait-${width}.png`});
      await page.keyboard.press('Escape');
      await page.locator('.brand').click();
      await page.screenshot({path:`/tmp/portal-${width}.png`});
      await page.locator('.nav a[href="#personagens"]').count();
      await page.locator('#personagens').scrollIntoViewIfNeeded();
      await page.screenshot({path:`/tmp/portal-characters-${width}.png`});
      assert.deepEqual(errors,[]);
      await page.goto(new URL('admin/',base).href);
      assert(await page.locator('#login').isVisible());assert(await page.locator('#console').isHidden());
      assert.equal(await page.locator('#token').getAttribute('type'),'password');
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Admin horizontal overflow');
      console.log(`PASS ${width}px: banner, menu, links, codex, gallery zoom, realms, music, search, admin login UI`);
      await page.close();
    }
  } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
