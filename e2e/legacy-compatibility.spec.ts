import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const decisions = JSON.parse(readFileSync('docs/media-decisions.json', 'utf8'));

test('historical images keep their original URLs and bytes in editorial preview', async ({ request }) => {
  for (const [path, decision] of Object.entries(decisions) as [
    string,
    { action: string; sha256: string; mediaId?: string; legacyWorkResourceId?: string },
  ][]) {
    if (decision.action !== 'preserve' || (!decision.mediaId && !decision.legacyWorkResourceId)) continue;
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/webp');
    expect(
      createHash('sha256')
        .update(await response.body())
        .digest('hex'),
    ).toBe(decision.sha256);
  }
});

test('legacy aliases and restricted records retain both languages; internal is not an access grant', async ({
  page,
}) => {
  for (const lang of ['en', 'ru']) {
    for (const [id, target] of [
      ['neurobattle', 'works/neurobattle/'],
      ['emomandala-os', 'works/emomandala/#work-story-selection'],
      ['media-oda-rings-story', 'works/oda-rings/#work-story-history'],
      ['for-events', 'cooperation/#for-events'],
    ]) {
      await page.goto(`/?id=${id}&lang=${lang}&internal=true`);
      await expect(page).toHaveURL((url) => url.pathname + url.hash === `/${lang}/${target}`);
    }
    for (const id of ['hub-debug', 'media-interference-recording']) {
      await page.goto(`/?id=${id}&lang=${lang}&internal=true`);
      await expect(page).toHaveURL(new RegExp(`/legacy/unavailable/\\?id=${id}&lang=${lang}$`));
      await expect(page.locator('#legacy-id')).toHaveText(id);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('.legacy-contact-link')).toHaveAttribute('href', `/${lang}/contact/`);
    }
  }
  await page.route('**/legacy-map.json', (route) => route.abort());
  await page.goto('/?id=neurobattle&lang=ru');
  await expect(page).toHaveURL(/\/legacy\/unavailable\/\?id=neurobattle&lang=ru$/);
  await expect(page.locator('#legacy-id')).toHaveText('neurobattle');
});
