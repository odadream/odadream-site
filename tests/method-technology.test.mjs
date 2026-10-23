import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadSiteModule } from '../scripts/site-data.mjs';

const source = await loadSiteModule();
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const scope = createPublicationScope(source, publicationPlan);
const method = scope.methods.find((row) => row.id === 'neuromandala');

test('the reading guide preserves its cover, explanatory galleries and public primary source in both languages', () => {
  assert.ok(method);
  assert.ok(method.media.includes(method.coverMediaId));
  for (const section of method.sections) {
    assert.ok(section.body.ru && section.body.en);
    for (const id of section.media ?? []) {
      assert.ok(method.media.includes(id), id);
      assert.ok(
        scope.media.some((item) => item.id === id),
        id,
      );
    }
  }
  assert.equal(method.sections.find((row) => row.id === 'archive-examples').media.length, 3);
  const reading = method.sections.find((row) => row.id === 'visual-language');
  assert.ok(reading.media.includes('neuromandala-frequencies'));
  assert.equal(reading.links[0].href, 'https://dzen.ru/a/Z47CgD1reSEUc43b');
  assert.match(
    method.sections.find((row) => row.id === 'signal-and-power').body.ru,
    /Мощность ритма и частота/,
  );
  assert.match(reading.body.en, /absolute power has not fallen/);
});

test('only prepared anonymous visual examples enter the public packet, not source movies or source locators', async () => {
  assert.doesNotMatch(JSON.stringify(method), /sourceRefs|sourcePath|\/srv\/data|D:\//);
  const selection = JSON.parse(await readFile('docs/METHOD-MEDIA-SELECTION.json', 'utf8'));
  assert.equal(selection.minddbSources.length, 3);
  for (const input of selection.imageInputs) {
    const bytes = await readFile('public' + input.source);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), input.sha256);
    const media = scope.media.find((row) => row.id === input.id);
    assert.ok(media.src.startsWith('/images/prepared/'));
    assert.ok(scope.assetPaths.has(media.src));
    assert.ok(!scope.assetPaths.has(input.source));
  }
  for (const row of selection.minddbSources) {
    assert.match(row.sourceSha256, /^[a-f0-9]{64}$/);
    assert.equal(row.frameSeconds, 90);
    assert.ok(!JSON.stringify(scope.media).includes(row.source));
  }
});
