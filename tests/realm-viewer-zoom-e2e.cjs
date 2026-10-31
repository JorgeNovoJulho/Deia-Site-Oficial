const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.PORTAL_URL||'http://127.0.0.1:8000/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
   const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.locator('#inicio .v9-realms a').nth(1).click();
   const viewer=page.locator('.realm-viewer:not([hidden])');
   await viewer.waitFor({state:'visible'});
   await viewer.locator('.realm-viewer-stage img').evaluate(e=>e.decode());
   const stage=viewer.locator('.realm-viewer-stage');
   const fit=await stage.evaluate(e=>({vw:e.clientWidth,vh:e.clientHeight,w:e.querySelector('img').clientWidth,h:e.querySelector('img').clientHeight}));
   assert(fit.w<=fit.vw&&fit.h<=fit.vh,'100% artwork must fit both dimensions: '+name);
   assert.equal((await viewer.locator('[data-reset]').innerText()).trim(),'100%');
   for(let i=0;i<10;i++)await viewer.locator('[data-zoom="1"]').click();
   let before=await stage.evaluate(e=>({x:e.scrollLeft,y:e.scrollTop,sw:e.scrollWidth,sh:e.scrollHeight,cw:e.clientWidth,ch:e.clientHeight}));
   assert(before.sw>before.cw && before.sh>before.ch,'Zoomed art must extend beyond stage in two axes');
   const rect=await stage.boundingBox();
   const x=rect.x+rect.width/2,y=rect.y+rect.height/2;
   await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x-100,y-90,{steps:8});await page.mouse.up();
   const after=await stage.evaluate(e=>({x:e.scrollLeft,y:e.scrollTop}));
   assert(after.x>before.x && after.y>before.y,'Drag must freely scroll right and down: '+name);
   await viewer.locator('[data-reset]').click();
   const reset=await stage.evaluate(e=>({x:e.scrollLeft,y:e.scrollTop,sw:e.scrollWidth,sh:e.scrollHeight,cw:e.clientWidth,ch:e.clientHeight}));
   assert.equal((await viewer.locator('[data-reset]').innerText()).trim(),'100%');
   assert(reset.sw<=reset.cw+1 && reset.sh<=reset.ch+1,'Reset must show whole artwork: '+name);
   await page.screenshot({path:'/tmp/portal-realm-fit-'+name+'.png',fullPage:false});
   await viewer.locator('.realm-viewer-close').click();
   await page.close();
  }
  console.log('PASS: artwork fit and two-axis pointer drag desktop/mobile');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
