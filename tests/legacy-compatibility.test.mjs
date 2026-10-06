import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadSiteModule } from '../scripts/site-data.mjs';

const rows = JSON.parse(await readFile('src/data/legacy-map.json', 'utf8'));
const source = await loadSiteModule();
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { createPages } = await loadSiteModule('src/lib/routes.ts');
const { resolveLegacyRoutes } = await loadSiteModule('src/lib/legacy-routes.ts');

test('all 238 legacy IDs retain language and identity or reach an existing page and anchor', () => {
  assert.equal(rows.length, 238);
  for (const preview of [true, false]) {
    const pages = createPages(createPublicationScope(source, publicationPlan, preview));
    const routes = resolveLegacyRoutes(rows, pages);
    assert.equal(Object.keys(routes).length, 238);
    for (const row of rows)
      for (const [index, lang] of ['en', 'ru'].entries()) {
        const target = new URL(routes[row.id][index], 'https://odadream.art');
        if (target.pathname === '/legacy/unavailable/') {
          assert.equal(target.searchParams.get('id'), row.id);
          assert.equal(target.searchParams.get('lang'), lang);
        } else {
          assert.ok(target.pathname.startsWith(`/${lang}/`));
          const page = pages.find((item) => item.path === target.pathname);
          assert.ok(page, `${row.id}: missing target`);
          if (target.hash) assert.ok(page.anchors.includes(decodeURIComponent(target.hash.slice(1))));
        }
      }
  }
});

test('malformed anchors and unavailable targets never lose or corrupt a legacy ID', () => {
  const id = 'архив & ? #';
  for (const target of ['/en/works/#%broken', '/en/works/#missing', '/legacy/unavailable/']) {
    const routes = resolveLegacyRoutes(
      [{ id, targetEn: target, targetRu: target }],
      [{ path: '/en/works/', anchors: [] }],
    );
    for (const [index, lang] of ['en', 'ru'].entries()) {
      const url = new URL(routes[id][index], 'https://odadream.art');
      assert.equal(url.pathname, '/legacy/unavailable/');
      assert.equal(url.searchParams.get('id'), id);
      assert.equal(url.searchParams.get('lang'), lang);
    }
  }
});
