import { readFile } from 'node:fs/promises';
import YAML from 'yaml';
export const editorialStatuses = {
  pending: 'Очередь',
  draft: 'Вариант',
  awaiting_feedback: 'Ожидает отклика',
  revision: 'Доработка',
  edited: 'Отредактировано · авторская приёмка впереди',
  accepted: 'Согласовано',
  verified: 'Проверено на сайте',
};
export function validateEditorialRegister(data) {
  const errors = [];
  const ids = new Set();
  for (const unit of data.units ?? []) {
    if (!unit.id || ids.has(unit.id)) errors.push('Missing/duplicate unit: ' + unit.id);
    ids.add(unit.id);
    for (const lang of ['ru', 'en']) {
      const entry = unit[lang];
      if (!entry || !Object.hasOwn(editorialStatuses, entry.status)) {
        errors.push('Invalid language state: ' + unit.id + ':' + lang);
        continue;
      }
      const blocks = entry.blocks ?? [];
      const blockIds = new Set();
      for (const block of blocks) {
        if (!block.id || blockIds.has(block.id))
          errors.push('Missing/duplicate block: ' + unit.id + ':' + lang);
        blockIds.add(block.id);
        if (!Object.hasOwn(editorialStatuses, block.status)) errors.push('Invalid block status: ' + block.id);
        if (['accepted', 'verified'].includes(block.status) && !block.owner_decision)
          errors.push('Unapproved block: ' + block.id);
        if (block.status === 'verified' && (!block.applied_commit || block.question))
          errors.push('Unchecked block: ' + block.id);
      }
      if (entry.status === 'edited' && (!entry.coverage_complete || !entry.checked_at || !entry.pass_id))
        errors.push('Incomplete editorial pass: ' + unit.id + ':' + lang);
      if (['accepted', 'verified'].includes(entry.status)) {
        if (!entry.coverage_complete || !blocks.length)
          errors.push('Incomplete coverage: ' + unit.id + ':' + lang);
        if (
          blocks.some((block) =>
            entry.status === 'verified'
              ? block.status !== 'verified'
              : !['accepted', 'verified'].includes(block.status),
          )
        )
          errors.push('Unfinished blocks: ' + unit.id + ':' + lang);
      }
    }
  }
  return errors;
}
export async function readEditorialRegister(path) {
  const data = YAML.parse(await readFile(path, 'utf8'));
  const errors = validateEditorialRegister(data);
  if (errors.length) throw new Error(errors.join('\n'));
  return data;
}
export function editorialProgress(data, lang) {
  const states = Object.fromEntries(Object.keys(editorialStatuses).map((status) => [status, 0]));
  for (const unit of data.units) states[unit[lang].status]++;
  return {
    total: data.units.length,
    states,
    edited: states.edited + states.accepted + states.verified,
    editedPercent: Math.floor(
      (100 * (states.edited + states.accepted + states.verified)) / data.units.length,
    ),
    percent: Math.floor((100 * states.verified) / data.units.length),
  };
}
