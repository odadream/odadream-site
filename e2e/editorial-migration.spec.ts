import { test, expect } from '@playwright/test';

test('method, work configurations and education and cooperation form a connected bilingual structure', async ({
  page,
}) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/technology/`);
    await expect(page.locator('#method-overview')).toBeVisible();
    await expect(page.locator('#signal-process .process-steps > li')).toHaveCount(4);
    await expect(page.locator('#participation .list-row')).toHaveCount(3);
    await expect(page.locator('#method-boundaries .facts li')).toHaveCount(3);
    await expect(page.locator('#method-boundaries')).toContainText(lang === 'ru' ? 'Согласие' : 'Consent');
    await expect(page.locator('#visual-language video')).toHaveCount(1);
    await page.goto(`/${lang}/works/mindshow/`);
    await expect(page.locator('#mindshow-installation')).toContainText(
      lang === 'ru' ? 'Тайминг и смену участников согласуем' : 'timing and participant changeover',
    );
    await page.goto(`/${lang}/works/neurobattle/`);
    await expect(page.locator('#neurobattle-game')).toContainText('90');
    await page.goto(`/${lang}/education/`);
    await expect(page.locator('.programme-card')).toHaveCount(17);
    await expect(page.locator('#site-nav [data-route="education"]')).toHaveCount(0);
    await expect(page.locator('.reading-breadcrumbs')).toContainText(
      lang === 'ru' ? 'Образование' : 'Education',
    );
    await expect(page.locator('#site-nav [data-route="formats"]')).toHaveCount(0);
    await expect(page.locator('#education-conditions .record-stamp')).toHaveCount(1);
    await page.locator('[data-programme-id="beautiful-brain"] a').click();
    await expect(page).toHaveURL(new RegExp(`/${lang}/education/beautiful-about-the-brain/$`));
    await expect(page.locator('#site-nav [data-route="education"]')).toHaveCount(0);
    await expect(page.locator('.reading-breadcrumbs')).toContainText(
      lang === 'ru' ? 'Образование' : 'Education',
    );
    await expect(page.locator('#programme-content .facts li')).toHaveCount(0);
    await expect(page.locator('#programme-content .editorial-sections h3')).toHaveCount(3);
    await expect(page.locator('#programme-content')).not.toContainText('src/content/');
    await page.goto(`/${lang}/education/neuro-laboratory/`);
    await expect(page.locator('.page-intro .meta')).toContainText(lang === 'ru' ? 'Проект' : 'Proposed');
    await page.goto(`/${lang}/cooperation/`);
    await expect(page.locator('#cooperation-scenarios article')).toHaveCount(4);
    await expect(page.locator('#cooperation-modes .list-row')).toHaveCount(3);
    await expect(page.locator('#production-overview .record-stamp')).toHaveCount(1);
    await expect(page.locator('#project-brief .facts li')).toHaveCount(5);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('educational scenario links to programmes and method hero has a real destination', async ({ page }) => {
  await page.goto('/ru/cooperation/#for-education');
  await expect(page).toHaveURL(/\/ru\/cooperation\/#for-education$/);
  await expect(page.locator('#for-education')).toBeVisible();
  await page.goto('/ru/');
  await expect(page.locator('.nm-caption-link a[href="/ru/technology/"]')).toHaveCount(1);
});
