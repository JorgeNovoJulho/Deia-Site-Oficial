const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.PORTAL_URL || 'http://127.0.0.1:8000/';
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    for (const width of [1440, 1024, 390, 360]) {
      const page = await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('response',r=>{if(r.status()>=400 && r.url().startsWith(base)) errors.push(`${r.status()} ${r.url()}`)});
      await page.goto(base);
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
      assert.equal(await page.locator('[data-reset]').textContent(),'140%');
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
      assert.equal(await page.locator('[data-reset]').textContent(),'140%');await page.keyboard.press('Escape');
      await page.locator('[data-codex="world"]').first().click();
      assert.equal(await page.locator('#codex-heading').textContent(),'Terra Encantada');await page.keyboard.press('Escape');
      await page.getByRole('button',{name:'Próximo reino',exact:true}).click();
      assert.equal(await page.locator('.spotlight-copy h3').textContent(),'Terra de Fogo');
      await page.locator('.sound-filter button').filter({hasText:'Exploração'}).click();
      assert(await page.locator('.track:visible').count()>0,'Exploration filter returned no tracks');
      await page.locator('.sound-filter button').filter({hasText:'Todas'}).click();
      assert.equal(await page.locator('.track:visible').count(),87);
      
      await page.locator('.v12-search-open').click();
      await page.locator('.v12-search input').fill('Fhenrir');
      assert.equal(await page.locator('.v12-results a').count(),1);await page.keyboard.press('Escape');
      await page.locator('.brand').click();
      await page.screenshot({path:`/tmp/portal-${width}.png`});
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
