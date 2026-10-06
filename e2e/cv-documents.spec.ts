import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

test('both biographies expose a dated CV in the page language with matching PDF bytes', async ({
  page,
  request,
}) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/studio/#people`);
    for (const person of ['olga', 'daler']) {
      const row = page.locator(`#document-cv-${person}-${lang}`);
      await expect(row).toContainText(lang === 'ru' ? '1 стр.' : '1 pp.');
      await expect(page.locator(`#document-cv-${person}-${lang === 'ru' ? 'en' : 'ru'}`)).toHaveCount(0);
      const path = `/documents/oda-dream-cv-${person}-${lang}.pdf`;
      await expect(row.locator('a')).toHaveAttribute('href', path);
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
      await expect(page.locator(`#person-${person}`)).toContainText(
        lang === 'ru' ? 'Текущая рабочая база' : 'Current working base',
      );
    }
  }
});
