import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

test('cooperation offers the dated overview in its language, with original two-page PDF bytes', async ({
  page,
  request,
}) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/cooperation/#production-overview`);
    const row = page.locator(`#document-technical-overview-${lang}`);
    await expect(row.locator('[data-dev-note]')).toHaveCount(0);
    await expect(row).toContainText(lang === 'ru' ? '2 стр.' : '2 pp.');
    await expect(row.locator('.meta')).toContainText(lang === 'ru' ? 'КБ' : 'kB');
    const path = `/documents/oda-dream-technical-overview-${lang}.pdf`;
    await expect(row.locator('a')).toHaveAttribute('href', path);
    await expect(page.locator(`#document-technical-overview-${lang === 'ru' ? 'en' : 'ru'}`)).toHaveCount(0);
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
    expect(
      createHash('sha256')
        .update(await response.body())
        .digest('hex'),
    ).toBe(
      createHash('sha256')
        .update(readFileSync('public' + path))
        .digest('hex'),
    );
  }
});
