import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateEditorialRegister,
  editorialProgress,
  readEditorialRegister,
} from '../scripts/editorial-register.mjs';
const unit = () => ({ id: 'work:example', ru: { status: 'pending' }, en: { status: 'pending' } });
test('editorial progress counts verified content rather than inventory, drafts or acceptance', () => {
  const a = unit();
  a.ru.status = 'awaiting_feedback';
  const b = unit();
  b.id = 'work:second';
  b.ru.status = 'accepted';
  const c = unit();
  c.id = 'work:third';
  c.ru.status = 'verified';
  assert.deepEqual(editorialProgress({ units: [a, b, c] }, 'ru').percent, 33);
  assert.equal(editorialProgress({ units: [a, b, c] }, 'en').percent, 0);
});
test('a parent cannot hide unfinished blocks or count inventory as completed review', () => {
  const a = unit();
  a.ru.status = 'verified';
  assert.ok(validateEditorialRegister({ units: [a] }).some((error) => error.includes('Incomplete coverage')));
  a.ru.coverage_complete = true;
  a.ru.blocks = [{ id: 'intro', status: 'awaiting_feedback' }];
  assert.ok(validateEditorialRegister({ units: [a] }).some((error) => error.includes('Unfinished blocks')));
  a.ru.blocks[0] = {
    id: 'intro',
    status: 'verified',
    owner_decision: 'Approved by owner',
    applied_commit: 'abc123',
    question: 'Unresolved fact',
  };
  assert.ok(validateEditorialRegister({ units: [a] }).some((error) => error.includes('Unchecked block')));
  a.ru.blocks[0].question = null;
  assert.deepEqual(validateEditorialRegister({ units: [a] }), []);
});
test('register rejects unknown states, duplicate IDs and unapproved accepted blocks', () => {
  const a = unit();
  a.en.status = 'complete';
  a.ru.blocks = [{ id: 'intro', status: 'accepted' }];
  const errors = validateEditorialRegister({ units: [a, a] });
  assert.ok(errors.some((error) => error.includes('duplicate unit')));
  assert.ok(errors.some((error) => error.includes('Invalid language state')));
  assert.ok(errors.some((error) => error.includes('Unapproved block')));
});
test('canonical editorial register is valid and includes both languages', async () => {
  const registry = await readEditorialRegister(new URL('../docs/EDITORIAL-REGISTER.yaml', import.meta.url));
  assert.ok(registry.units.some((unit) => unit.kind === 'works'));
  assert.ok(registry.units.some((unit) => unit.kind === 'shared-copy'));
  assert.ok(registry.units.some((unit) => unit.kind === 'media'));
  assert.deepEqual(validateEditorialRegister(registry), []);
});
