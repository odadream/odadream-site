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
      await expect(page.locator('#case-story .editorial-sections article')).toHaveCount(
        slug === 'tsiolkovsky-festival-2026' ? 3 : 2,
      );
      await expect(page.locator('#case-evidence .provenance')).toHaveCount(1);
      await expect(page.locator('#case-evidence')).not.toContainText('src/content/');
    }
    await page.goto(`/${lang}/cases/`);
    await expect(page.locator('main .case-row')).toHaveCount(45);
    await expect(page.locator('#case-portal-2025 .meta')).toContainText('2025');
    await expect(page.locator('#case-portal-2025 .meta')).not.toContainText('01-01');
    await expect(page.locator('#case-wildmint-2025 h3 a')).toHaveAttribute(
      'href',
      `/${lang}/cases/wildmint-2025/`,
    );
    await page.goto(`/${lang}/cases/#case-portal-2025`);
    await expect(page).toHaveURL(new RegExp(`/${lang}/cases/#case-portal-2025$`));
    await page.goto(`/${lang}/recognition/`);
    await expect(page.locator('.recognition-card')).toHaveCount(18);
    await expect(page.locator('#recognition-portal-2030-2025 .recognition-card__image')).toBeVisible();
    await expect(page.locator('#recognition-culttech-school-grant-2026')).toHaveClass(
      /recognition-card--text/,
    );
    await expect(
      page.locator('#recognition-culttech-school-grant-2026 .recognition-card__missing'),
    ).toHaveCount(0);
    await expect(page.locator('#recognition-portal-2030-2025')).toContainText(
      lang === 'ru' ? 'Первое место' : 'First prize',
    );
  }
});
