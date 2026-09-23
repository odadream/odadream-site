import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const styles = fileURLToPath(new URL('../src/styles/', import.meta.url));
const files = readdirSync(styles).filter((name) => name.endsWith('.css'));
const css = files.map((name) => [name, readFileSync(styles + '/' + name, 'utf8')]);

test('component styles use profile colors and defined custom properties', () => {
  const all = css.map(([, text]) => text).join('\n');
  const definitions = new Set([...all.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]));
  for (const [name, text] of css) {
    if (name !== 'tokens.css') assert.doesNotMatch(text, /#[\da-f]{3,8}\b|\brgba?\(/i, name);
    for (const match of text.matchAll(/var\((--[\w-]+)/g)) {
      assert.ok(definitions.has(match[1]), name + ': undefined ' + match[1]);
    }
  }
});

test('technical marks use vector geometry and both statistics components use the reference tone', () => {
  const read = (name) => readFileSync(new URL('../src/components/' + name, import.meta.url), 'utf8');
  for (const name of ['StatisticsStamp.astro', 'MindDBStamp.astro']) {
    assert.match(read(name), /tone="reference"/);
  }
  assert.match(read('TechnicalMark.astro'), /viewBox="0 0 24 24"/);
  assert.match(read('TechnicalMark.astro'), /aria-hidden="true"/);
});
