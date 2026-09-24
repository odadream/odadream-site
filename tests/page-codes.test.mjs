import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePageCodes } from '../scripts/page-code-check.mjs';

const html = (codes, family = 'W') =>
  `<html data-page-family="${family}">${codes.map((code) => `<span data-page-code="${code}"></span>`).join('')}</html>`;

test('accepts page and section hierarchy in order', () => {
  assert.deepEqual(validatePageCodes(html(['W', 'W.01', 'W.02'])), {
    family: 'W',
    sections: 3,
    codes: 3,
  });
});

test('rejects family drift, missing sections and legacy item-level codes', () => {
  assert.throws(() => validatePageCodes(html(['F'], 'W')), /belongs to F/);
  assert.throws(() => validatePageCodes(html(['W', 'W.02'])), /skips 01/);
  assert.throws(() => validatePageCodes(html(['W', 'W.01', 'W.0102'])), /malformed code/);
  assert.throws(() => validatePageCodes(html(['W', 'W.01.01'])), /malformed code/);
});
