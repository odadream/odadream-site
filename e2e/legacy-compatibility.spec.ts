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

test('obsolete addresses show a bilingual notice before returning home, without a runtime ID map', async ({
  page,
  request,
}) => {
  for (const lang of ['en', 'ru']) {
    for (const id of ['neurobattle', 'unknown-record', 'hub-debug']) {
      await page.goto(`/?id=${id}&lang=${lang}&internal=true`);
      await expect(page).toHaveURL(new RegExp(`/legacy/unavailable/\\?lang=${lang}$`));
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('h1')).toHaveText(lang === 'ru' ? 'Сайт обновился' : 'The site has changed');
      await expect(page.locator('.legacy-home-link')).toHaveAttribute('href', `/${lang}/`);
      await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex,follow');
    }
    await expect(page).toHaveURL(new RegExp(`/${lang}/$`), { timeout: 8000 });
    await page.goto(`/${lang}/formats/#mindshow-installation`);
    await expect(page.locator('[data-legacy-notice]')).toBeVisible();
    await page.locator('.legacy-home-link').click();
    await expect(page).toHaveURL(new RegExp(`/${lang}/$`));
  }
  expect((await request.get('/legacy-map.json')).status()).toBe(404);
});
