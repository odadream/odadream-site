import { expect, test } from '@playwright/test';

test('all additional educational programmes have bilingual content, modules, outcomes and honest stages', async ({
  page,
}, testInfo) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/education/`);
    await expect(page.locator('.programme-card')).toHaveCount(17);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const id of [
      'color-brain',
      'game-brain',
      'meditation-brain',
      'self-regulation',
      'dance-feedback',
      'feedback-media-art',
      'daler-art-path',
    ]) {
      await page.goto(`/${lang}/education/${id}/`);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('#programme-content .editorial-sections article')).toHaveCount(3);
      await expect(page.locator('#programme-participation p')).toHaveCount(2);
      await expect(page.locator('#programme-conditions .record-stamp')).toHaveCount(1);
      await expect(page.locator(`.reading-parent[href="/${lang}/education/"]`)).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await expect(page.locator('#programme-participation a[href$="/studio/#person-daler"]')).toHaveCount(1);
    await expect(page.locator('#programme-participation a[href$="/studio/#person-olga"]')).toHaveCount(0);
    await page.goto(`/${lang}/education/dance-feedback/`);
    await expect(page.locator('a[href$="/works/neurosynchronization/"]')).toHaveCount(1);
    await expect(page.locator('a[href$="/cases/kod-provincii-2024/"]')).toHaveCount(1);
    if (lang === 'ru')
      await page.screenshot({ path: `.local-server/education-${testInfo.project.name}.png` });
  }
});

test('educational history preserves source dates and does not promote archived plans to delivered lectures', async ({
  page,
}) => {
  await page.goto('/ru/cases/');
  await expect(page.locator('[data-case-id="hse-2025"] .case-row__metadata')).toContainText('25 марта 2025');
  await expect(page.locator('[data-case-id="almaz-lecture-2026"]')).toHaveAttribute(
    'data-participation-status',
    'planned',
  );
  await expect(page.locator('[data-case-id="tskhr-lecture-2025"]')).toHaveAttribute(
    'data-participation-status',
    'planned',
  );
  await page.goto('/ru/cases/kod-provincii-2024/');
  await expect(page.locator('main a[href$="/education/dance-feedback/"]')).toHaveCount(1);
  await page.goto('/ru/education/beautiful-about-the-brain/');
  await expect(page.locator('a[href$="/cases/green-door-2024/"]')).toHaveCount(1);
  await expect(page.locator('a[href$="/cases/ashram-lecture-2025/"]')).toHaveCount(1);
});
