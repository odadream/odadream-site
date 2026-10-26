import { test, expect } from '@playwright/test';

test('framing starts from source focus and other tabs update the visible preview', async ({
  page,
  context,
}) => {
  await page.goto('/ru/works/mom-and-baby/');
  const trigger = page.locator('[data-crop-id="archive-mom-baby-photo-with-statuette"]').first();
  const point = JSON.parse((await trigger.getAttribute('data-crop-point-desktop'))!);
  await trigger.click();
  const dialog = page.locator('[data-study-dialog]');
  expect(Number(await dialog.locator('[data-study-x]').inputValue())).toBeCloseTo(point.x * 100, 8);
  expect(Number(await dialog.locator('[data-study-y]').inputValue())).toBeCloseTo(point.y * 100, 8);
  await dialog.locator('[data-study-reset]').click();
  expect(Number(await dialog.locator('[data-study-y]').inputValue())).toBeCloseTo(point.y * 100, 8);
  await page.keyboard.press('Escape');
  const peer = await context.newPage();
  await peer.goto('/ru/works/mom-and-baby/');
  await peer.evaluate(() =>
    localStorage.setItem(
      'oda.media-framing.v2',
      JSON.stringify({
        schemaVersion: 2,
        media: { 'archive-mom-baby-photo-with-statuette': { x: 10, y: 80, fit: 'contain' } },
      }),
    ),
  );
  const figure = page.locator('.media-figure[data-media-id="archive-mom-baby-photo-with-statuette"]').first();
  await expect(figure).toHaveAttribute('data-dev-framing', 'contain');
  await expect(figure.locator('img')).toHaveCSS('object-position', '10% 80%');
  await peer.evaluate(() => localStorage.removeItem('oda.media-framing.v2'));
  await expect(figure).toHaveAttribute('data-dev-framing', 'natural');
  await peer.close();
});
test('collective feedback loop is readable and has a textual equivalent in both languages and themes', async ({
  page,
}) => {
  for (const lang of ['ru', 'en']) {
    await page.goto('/' + lang + '/');
    for (const width of [390, 797, 1440]) {
      await page.setViewportSize({ width, height: 932 });
      for (const theme of ['dark', 'light']) {
        await page.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
        const diagram = page.locator('#medium [data-collective-feedback]');
        await expect(diagram.locator('svg')).toHaveAccessibleName(
          lang === 'ru' ? /Круг коллективной/ : /Collective biofeedback/,
        );
        await expect(diagram.locator('figcaption')).toContainText(
          lang === 'ru' ? 'последовательно или одновременно' : 'sequential or simultaneous',
        );
        expect(
          await diagram.locator('svg').evaluate((svg) =>
            [...svg.querySelectorAll('text')].every((t) => {
              const b = t.getBBox();
              return b.x >= 0 && b.x + b.width <= 480;
            }),
          ),
        ).toBeTruthy();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
      }
    }
  }
});
test('DEV framing shares one focus across cards and galleries, with original viewer intact', async ({
  page,
}) => {
  await page.goto('/ru/works/');
  const trigger = page.locator('[data-dev-crop][data-crop-view="card"]').first();
  const mediaId = await trigger.getAttribute('data-crop-id');
  await trigger.click();
  const dialog = page.locator('[data-study-dialog]');
  await expect(dialog).toBeVisible();
  await dialog.locator('[data-study-x]').press('Home');
  await dialog.locator('[data-study-fit]').selectOption('contain');
  await dialog.locator('[data-study-apply]').click();
  await expect(dialog.locator('[data-study-status]')).toContainText('сохранён');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  const card = trigger.locator('..');
  await expect(card).toHaveAttribute('data-dev-framing', 'contain');
  await expect(card.locator('img').first()).toHaveCSS('object-position', '0% 50%');
  await page.reload();
  await trigger.click();
  await expect(dialog.locator('[data-study-x]')).toHaveValue('0');
  await expect(dialog.locator('[data-study-fit]')).toHaveValue('contain');
  await dialog.locator('[data-study-reset]').click();
  await page.keyboard.press('Escape');
  await expect(card).not.toHaveAttribute('data-dev-framing');
  expect(mediaId).toBeTruthy();
  await page.goto('/ru/works/project-schrodinger/');
  const poster = page.locator('[data-media-id="schrodinger-poster"]');
  await expect(poster).toHaveAttribute('data-fit', 'natural');
  const source = await poster.locator('[data-lightbox]').getAttribute('data-src');
  await poster.locator('[data-study-crop]').click();
  await dialog.locator('[data-study-fit]').selectOption('contain');
  await dialog.locator('[data-study-apply]').click();
  await page.keyboard.press('Escape');
  await poster.locator('[data-lightbox]').click();
  await expect(page.locator('#lightbox img')).toHaveAttribute('src', source!);
});
