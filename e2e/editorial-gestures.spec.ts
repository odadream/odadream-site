import { expect, test } from '@playwright/test';

test('native touch swipes navigate fitted images while pan, pinch and cancellation keep the current item', async ({
  page,
  context,
}) => {
  await page.goto('/ru/works/project-schrodinger/');
  const first = page.locator('#work-gallery [data-lightbox]').first();
  const count = await page.locator('#work-gallery [data-lightbox]').count();
  await first.click();
  const position = page.locator('.lightbox-position');
  const zoom = page.locator('[data-viewer-zoom]');
  await expect(zoom).toBeEnabled();
  const client = await context.newCDPSession(page);
  const box = (await page.locator('.lightbox-stage').boundingBox())!;
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  const touch = (
    type: 'touchStart' | 'touchMove' | 'touchEnd' | 'touchCancel',
    points: { x: number; y: number; id?: number }[],
  ) => client.send('Input.dispatchTouchEvent', { type, touchPoints: points });
  const swipe = async (deltaX: number, deltaY = 0) => {
    await touch('touchStart', [{ x, y }]);
    await touch('touchMove', [{ x: x + deltaX / 2, y: y + deltaY / 2 }]);
    await touch('touchMove', [{ x: x + deltaX, y: y + deltaY }]);
    await touch('touchEnd', []);
  };
  await swipe(-90);
  await expect(position).toHaveText(`2 / ${count}`);
  await expect(zoom).toBeEnabled();
  await swipe(90);
  await expect(position).toHaveText(`1 / ${count}`);
  await swipe(0, 90);
  await expect(position).toHaveText(`1 / ${count}`);
  await touch('touchStart', [{ x, y }]);
  await touch('touchMove', [{ x: x - 90, y }]);
  await touch('touchCancel', []);
  await expect(position).toHaveText(`1 / ${count}`);
  await touch('touchStart', [
    { x: x - 20, y, id: 1 },
    { x: x + 20, y, id: 2 },
  ]);
  await touch('touchMove', [
    { x: x - 60, y, id: 1 },
    { x: x + 60, y, id: 2 },
  ]);
  await touch('touchEnd', []);
  await expect(zoom).toHaveAttribute('aria-pressed', 'true');
  await expect(position).toHaveText(`1 / ${count}`);
  const before = await page.locator('.lightbox-stage').evaluate((el) => el.scrollLeft);
  await swipe(-90);
  await expect(position).toHaveText(`1 / ${count}`);
  expect(await page.locator('.lightbox-stage').evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
  await page.keyboard.press('Escape');
  await expect(first).toBeFocused();
});

for (const choice of ['granted', 'denied']) {
  test(`consent ${choice} preserves the reading position and settings return focus without scrolling`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/ru/works/mindshow/?analytics_debug=1');
    await page.evaluate(() => window.scrollTo(0, 600));
    const before = await page.evaluate(() => window.scrollY);
    await page.locator(`[data-consent-choice="${choice}"]`).click();
    await expect(page.locator('[data-analytics-consent]')).toBeHidden();
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(2);
    await expect(page.locator('main')).toBeFocused();
    const settings = page.locator('[data-analytics-settings]');
    await settings.click();
    const footerPosition = await page.evaluate(() => window.scrollY);
    await page.keyboard.press('Escape');
    await expect(settings).toBeFocused();
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - footerPosition)).toBeLessThan(2);
  });
}

test('public page templates present one chronology and one programme outline without editorial logistics', async ({
  page,
}) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/cases/`);
    await expect(page.locator('main a[href$="/cases/byob-2019/"]')).toHaveCount(1);
    await expect(page.locator('#case-series')).toHaveCount(0);
    await page.goto(`/${lang}/works/mindshow/`);
    await expect(page.locator('#work-context > .facts')).toHaveCount(0);
    await page.goto(`/${lang}/education/beautiful-about-the-brain/`);
    await expect(page.locator('#programme-content > .section-content > .facts')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(
      lang === 'ru' ? 'Лекция проходила в' : 'The lecture has been presented at',
    );
    await page.goto(`/${lang}/recognition/`);
    await expect(page.locator('main')).not.toContainText(
      lang === 'ru' ? 'связь с ним не назначена' : 'no such link is assigned',
    );
  }
});

test('direct chapter entry keeps the heading below the sticky service header', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/ru/works/mindshow/#work-context');
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const target = document.querySelector('#work-context')!.getBoundingClientRect();
        const header = document.querySelector('.site-header')!.getBoundingClientRect();
        return target.top >= header.bottom && target.top < header.bottom + 80;
      }),
    )
    .toBe(true);
});
