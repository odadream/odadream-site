import { expect, test } from '@playwright/test';

test('case narratives and source claims use event roles and readable provenance in both languages', async ({
  page,
}) => {
  for (const lang of ['ru', 'en']) {
    for (const slug of [
      'tsiolkovsky-festival-2026',
      'tsiolkovsky-laboratory-2025',
      'dano-2025',
      'byob-2026',
    ]) {
      await page.goto(`/${lang}/cases/${slug}/`);
      await expect(page.locator('#case-story .editorial-sections article')).toHaveCount(2);
      await expect(page.locator('#case-evidence .provenance')).toHaveCount(1);
      await expect(page.locator('#case-evidence')).not.toContainText('src/content/');
      await expect(page.locator('#case-evidence .button')).toHaveAttribute('href', `/${lang}/contact/`);
    }
    await page.goto(`/${lang}/cases/`);
    await expect(page.locator('main .case-row')).toHaveCount(37);
    await expect(page.locator('#case-portal-2025 .meta')).toContainText('2025');
    await expect(page.locator('#case-portal-2025 .meta')).not.toContainText('01-01');
    await expect(page.locator('#case-wildmint-2025 > a')).toHaveAttribute('href', `/${lang}/technology/`);
    await page.goto(`/${lang}/cases/#case-portal-2025`);
    await expect(page).toHaveURL(new RegExp(`/${lang}/cases/#case-portal-2025$`));
    await page.goto(`/${lang}/recognition/`);
    await expect(page.locator('.recognition-card')).toHaveCount(14);
    await expect(page.locator('#recognition-portal-2030-2025 .recognition-card__image')).toBeVisible();
    await expect(page.locator('#recognition-mipt-letter-2025 .recognition-card__missing')).toBeVisible();
    await expect(page.locator('#recognition-portal-2030-2025')).toContainText(
      lang === 'ru' ? 'Первое место' : 'First prize',
    );
  }
});
