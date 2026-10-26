import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
import { validateSeo } from '../scripts/seo-check.mjs';
const { socialImage, jsonLd } = await loadSiteModule('src/lib/seo.ts');
const routes = await loadSiteModule('src/lib/routes.ts');
const alt = { ru: 'Кадр', en: 'Frame' };

test('social cards use a video poster, never the movie, and can fall back to the next image', () => {
  const movie = { kind: 'video', src: '/film.mp4', poster: '/poster.webp', alt };
  assert.equal(socialImage([movie]).src, '/poster.webp');
  assert.equal(
    socialImage([
      { ...movie, poster: undefined },
      { kind: 'image', src: '/frame.jpg', alt },
    ]).src,
    '/frame.jpg',
  );
  assert.equal(socialImage([{ ...movie, poster: undefined }]), undefined);
});
test('JSON-LD retains exact editorial text without a raw closing script token', () => {
  const data = { name: '</script><script>example</script>' };
  const output = jsonLd(data);
  assert.ok(!output.includes('<'));
  assert.deepEqual(JSON.parse(output), data);
});
test('unknown record links lead to a real overview without double slashes or empty anchors', () => {
  for (const lang of ['ru', 'en']) {
    assert.equal(routes.workUrl(lang, 'missing'), `/${lang}/works/`);
    assert.equal(routes.programmeUrl(lang, 'missing'), `/${lang}/education/`);
    assert.equal(routes.caseUrl(lang, 'missing'), `/${lang}/cases/`);
  }
});
const html = `<head><link rel="canonical" href="https://odadream.art/ru/"><meta name="description" content="ODA"><link rel="alternate" hreflang="ru" href="https://odadream.art/ru/"><link rel="alternate" hreflang="en" href="https://odadream.art/en/"><meta property="og:url" content="https://odadream.art/ru/"><meta property="og:image" content="https://odadream.art/frame.webp"><script type="application/ld+json">{"name":"ODA"}</script></head>`;
test('emitted metadata rejects indexing blocks, wrong alternates, video images and broken structured data', () => {
  assert.equal(validateSeo(html, '/ru/'), 'https://odadream.art/frame.webp');
  assert.throws(
    () =>
      validateSeo(html.replace('</head>', '<meta name="robots" content="noindex,follow"></head>'), '/ru/'),
    /blocked/,
  );
  assert.throws(() => validateSeo(html.replace('frame.webp', 'movie.mp4'), '/ru/'), /still image/);
  assert.throws(() => validateSeo(html.replace('hreflang="en"', 'hreflang="fr"'), '/ru/'), /alternate/);
  assert.throws(() => validateSeo(html.replace('{"name":"ODA"}', '{broken'), '/ru/'), /JSON-LD/);
});
