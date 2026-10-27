import { test, expect } from '@playwright/test';

test('full chronology separates contributions, education, research and applications with readable dates', async ({
  page,
}) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/cases/`);
    await expect(page.locator('#case-tavrida-gastro-2025')).toContainText(
      lang === 'ru' ? 'Мозг и вкус' : 'Brain and Taste',
    );
    await expect(page.locator('.case-row')).toHaveCount(45);
    await expect(page.locator('[data-case-id="oktava-2021"]')).toHaveAttribute(
      'data-participation-status',
      'held',
    );
    await expect(page.locator('[data-case-id="oktava-2021"] .case-row__metadata')).toContainText(
      lang === 'ru' ? '12 апреля 2021' : '12 April 2021',
    );
    await expect(page.locator('#case-series')).toHaveCount(0);
    await expect(page.locator('main a[href$="/cases/byob-2019/"]')).toHaveCount(1);
    await expect(page.locator('#case-events [data-case-id="tavrida-ai-2025"]')).toHaveAttribute(
      'data-participation-status',
      'submitted',
    );
    await expect(page.locator('[data-case-id="audi-application-2020"]')).toContainText('2020');
    await expect(page.locator('[data-case-id="lamborghini-tea"] .case-row__metadata')).toContainText(
      lang === 'ru' ? 'Описано к' : 'Reported by',
    );
    await expect(page.locator('[data-case-id="gong-fest-2025"] .case-row__metadata')).toContainText(
      lang === 'ru' ? 'Период события' : 'Event window',
    );
    await expect(page.locator('[data-case-id="hse-2025"] h3 a[href$="/cases/hse-2025/"]')).toHaveCount(1);
    await expect(
      page.locator('[data-case-id="kod-provincii-2024"] h3 a[href$="/cases/kod-provincii-2024/"]'),
    ).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto(`/${lang}/education/sound-and-attention/`);
    await expect(page.locator('a[href$="/cases/gong-fest-2025/"]')).toHaveCount(1);
    await page.goto(`/${lang}/education/theatre-of-my-name/`);
    await expect(page.locator('#programme-conditions a[href$="/cases/korablik-2020/"]')).toHaveCount(1);
    await expect(page.locator('#programme-conditions a[href$="/cases/itb-lab-2024/"]')).toHaveCount(1);
  }
});

test('chronology fields stay above the narrative across both themes and all review widths', async ({
  page,
}, testInfo) => {
  await page.goto('/ru/cases/');
  for (const width of [390, 601, 797, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ['dark', 'light']) {
      await page.evaluate((value) => (document.documentElement.dataset.theme = value), theme);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(
        await page.locator('.case-row').evaluateAll((rows) =>
          rows.every((row) => {
            const meta = row.children[0].getBoundingClientRect();
            const narrative = row.children[1].getBoundingClientRect();
            return (
              meta.bottom <= narrative.top + 1 &&
              narrative.width > 0 &&
              row.querySelectorAll('a').length === 1
            );
          }),
        ),
      ).toBe(true);
    }
    if (width === 601 || width === 1440)
      await page.screenshot({ path: `.local-server/history-${testInfo.project.name}-${width}.png` });
  }
});
