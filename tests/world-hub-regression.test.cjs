// Regression guard for approved Deia world modal behavior.
// Run: node --test tests/world-hub-regression.test.cjs
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const js=fs.readFileSync('assets/world-hub-v1.js','utf8');
const css=fs.readFileSync('assets/world-hub-v1.css','utf8');
test('all three world panels are iterated, not a single node',()=>{
 assert.match(js,/\$\$\('\.world-hub-panel',hub\)\.forEach/);
 assert.doesNotMatch(js,/(?<!\$)\$\('\.world-hub-panel',hub\)\.forEach/);
});
test('one world tab at a time, including CSS hidden protection',()=>{
 assert.match(js,/p\.hidden=!visible/);
 assert.match(js,/p\.style\.setProperty\('display',visible\?'block':'none','important'\)/);
 assert.match(css,/\.world-hub-panel\[aria-hidden="true"\]/);
});
test('music selection survives updates',()=>{
 assert.match(js,/\['exploracao','Exploração'\]/);
 assert.match(js,/\['boss','Batalha do boss'\]/);
 assert.match(js,/selected==='bosses'\?'boss':'exploracao'/);
 assert.match(js,/musicChoices\.append\(btn\)/);
 assert.match(css,/\.world-hub-music-choices button\[aria-pressed="true"\]/);
});
test('approved world content and full-image viewer remain',()=>{
 for(const word of ['terra_encantada','terra_de_fogo','terra_do_gelo','world-hub-viewer-canvas'])assert.ok(js.includes(word));
});
