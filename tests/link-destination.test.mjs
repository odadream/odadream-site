import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const { linkDestination, linkTargetFamily } = await loadSiteModule('src/lib/link-destination.ts');
const current = 'http://127.0.0.1:5177/link-test/';
const site = 'https://odadream.art/';

test('canonical and local pages are internal; another language is still this site', () => {
  for (const href of [
    '/ru/works/',
    '/en/works/',
    'https://odadream.art/ru/cases/',
    'http://127.0.0.1:5177/ru/',
  ])
    assert.equal(linkDestination(href, current, site), 'internal');
});
test('only a fragment within this document is a section, including an absolute canonical URL', () => {
  for (const href of [
    '#link-context',
    '/link-test/#link-context',
    'https://odadream.art/link-test/#link-context',
  ])
    assert.equal(linkDestination(href, current, site), 'section');
  assert.equal(linkDestination('/ru/cases/#case-mipt-2025', current, site), 'internal');
});
test('origin determines external destinations, including deceptive hostnames', () => {
  for (const href of ['https://t.me/odadream_info', '//vk.ru/odadream', 'https://odadream.art.example.org/'])
    assert.equal(linkDestination(href, current, site), 'external');
});
test('local files and contact protocols retain their own meaning', () => {
  assert.equal(linkDestination('/documents/cv.PDF?version=2', current, site), 'resource');
  assert.equal(linkDestination('https://example.org/file.pdf', current, site), 'resource');
  for (const href of ['mailto:hi@odadream.art', 'tel:+70000000000'])
    assert.equal(linkDestination(href, current, site), 'contact');
});

test('target family follows the destination section, including language and canonical origin', () => {
  for (const [href, family] of [
    ['/ru/education/brain-hack/', 'E'],
    ['https://odadream.art/en/cases/lamborghini-tea/', 'K'],
    ['/en/studio/', 'S'],
    ['/ru/technology/', 'M'],
    ['/design-system/', 'D'],
    ['/ru/', 'H'],
    ['#link-context', 'D'],
  ])
    assert.equal(linkTargetFamily(href, current), family);
});
