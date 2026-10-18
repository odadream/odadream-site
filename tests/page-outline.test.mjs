import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const { chapterMarker, pageChapters, caseYearLinks } = await loadSiteModule('src/lib/page-outline.ts');
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

test('case year shortcuts cover the entire dated archive without duplicate years', () => {
  const rows = [
    { date: '2025-01-01', slug: 'older', context: 'public' },
    { date: '2026-09-01', slug: 'application', context: 'application' },
    { date: '2025-12-01', slug: 'newest', context: 'public' },
    { date: '2024-03-01', slug: 'past', context: 'public' },
    { date: '2027-01-01', slug: 'lab', context: 'laboratory' },
  ];
  assert.deepEqual(caseYearLinks(rows), [
    { year: '2027', href: '#case-lab' },
    { year: '2026', href: '#case-application' },
    { year: '2025', href: '#case-newest' },
    { year: '2024', href: '#case-past' },
  ]);
  assert.equal(rows[0].slug, 'older');
});
