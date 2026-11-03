// Regressão editorial: fonte primária e informação pública devem acompanhar o PDF revisado.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const lore = JSON.parse(fs.readFileSync(path.join(root, 'content/lore.json'), 'utf8'));
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('PDF revisado tem precedência explícita e rastreabilidade', () => {
  assert.equal(lore.canonical_source.pages, 69);
  assert.equal(lore.canonical_source.sha256, '8359f6880dbf0ccd540c89867836851b5862252ab3a96510a2cc31245f25ef34');
  assert.equal(lore.chapters.length, 11);
  assert.ok(lore.chapters.every(c => c.source_pages.length === 2 && c.source_pages[0] <= c.source_pages[1]));
  assert.match(lore.status, /capítulo final ainda não fornecido/);
});

test('cronologia e recompensas fundamentais presentes', () => {
  const all = lore.chapters.map(c => c.text).join(' ');
  for (const term of ['Vovó Brasa', 'Sir Musgoval', 'Vulkrag', 'Kaeldrath', 'Aeryndra', 'Aurorix', 'Dona Glacê Suprema', 'Nocturnox', 'Tirano Rexor', 'Crocomandra', 'Necrodrake Rei', 'Overlord Chronark', 'Reino das Sombras']) {
    assert.ok(all.includes(term), 'Ausente: ' + term);
  }
});

test('site público relata progresso real sem divulgar capítulo final inventado', () => {
  assert.match(index, /FONTE CANÔNICA · PDF REVISADO/);
  assert.match(index, /fases 01A a 01E/);
  assert.doesNotMatch(index, /02C\.10 — integração de habilidades, pausada/);
});
