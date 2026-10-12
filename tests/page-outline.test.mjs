import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const { chapterMarker, pageChapters } = await loadSiteModule('src/lib/page-outline.ts');
test('outline preserves rendered chapter order, Unicode and punctuation; excludes unmarked material', () => {
  const chapters = [
    { id: 'works', title: 'Работы «ODA» & <art>', family: 'H', section: 1 },
    { id: 'method', title: 'Method', family: 'H', section: 2 },
  ];
  const html = chapters
    .map(
      (chapter) =>
        '<section data-page-chapter="' +
        chapterMarker(chapter) +
        '"><h2>Heading</h2><article id="card"><h3>Card</h3></article></section>',
    )
    .join('');
  assert.deepEqual(
    pageChapters(html + '<section data-page-chapter="' + chapterMarker(chapters[0]) + '"></section>'),
    chapters,
  );
  assert.deepEqual(pageChapters('<main><h2>No sections</h2></main>'), []);
});
