import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';

test('public localized copy excludes editorial conversations and record-management explanations', async () => {
  const data = await loadSiteModule();
  const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
  const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
  const scope = createPublicationScope(data, publicationPlan);
  const forbidden =
    /как вы просили|как мы обсуждали|связь с ним не назначена|результат выделен в наградную запись|персональная адресация сохранена|не алиас работы|as we discussed|as you requested|no such link is assigned|the result has a separate award record|appear as separate entries in the ODA archive|not an alias of the work/i;
  function inspect(value, path = 'public') {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      if ((key === 'ru' || key === 'en') && typeof child === 'string')
        assert.doesNotMatch(child, forbidden, `${path}.${key}`);
      else inspect(child, `${path}.${key}`);
    }
  }
  inspect(scope);
});
