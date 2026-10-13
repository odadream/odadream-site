import { test, expect } from '@playwright/test';
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
test('DEV framing supports focus, region, profile separation, persistence, export and protected originals', async ({
  page,
}) => {
  await page.goto('/ru/works/');
  const trigger = page.locator('[data-dev-crop][data-crop-view="card"]').first();
  const mediaId = await trigger.getAttribute('data-crop-id');
  await trigger.click();
  const dialog = page.locator('[data-dev-crop-dialog]');
  await expect(dialog).toBeVisible();
  await dialog.locator('[data-crop-viewport]').selectOption('desktop');
  await dialog.locator('[data-crop-field="x"]').fill('0.2');
  // A late original-image load redraws the preview while the user is still typing.
  await dialog.locator('[data-crop-original]').evaluate((image) => image.dispatchEvent(new Event('load')));
  await expect(dialog.locator('[data-crop-field="x"]')).toHaveValue('0.2');
  await dialog.locator('[data-crop-field="x"]').press('Tab');
  await dialog.locator('[data-crop-save]').click();
  await expect(dialog.locator('[data-crop-status]')).toContainText('сохранён');
  await page.setViewportSize({ width: 601, height: 932 });
  await expect(dialog.locator('[data-crop-field="x"]')).toHaveValue('0.2');
  await dialog.locator('[data-crop-profile]').selectOption('hero');
  await expect(dialog.locator('[data-crop-field="x"]')).toHaveValue('0.5');
  await dialog.locator('[data-crop-profile]').selectOption('card');
  await dialog.locator('[data-crop-mode]').selectOption('region');
  await dialog.locator('[data-crop-field="width"]').fill('0.5');
  await dialog.locator('[data-crop-field="width"]').press('Tab');
  await expect(dialog.locator('[data-crop-status]')).toContainText('не сохранены');
  await dialog.locator('[data-crop-field="height"]').fill('0.5');
  await dialog.locator('[data-crop-field="height"]').press('Tab');
  await dialog.locator('[data-crop-save]').click();
  const download = page.waitForEvent('download');
  await dialog.locator('[data-crop-export]').click();
  expect((await download).suggestedFilename()).toBe('media-composition-draft.json');
  const data = JSON.parse(await dialog.locator('[data-crop-json]').inputValue());
  expect(data.media[mediaId!].card.desktop.region.width).toBe(0.5);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 932 });
  await page.reload();
  await trigger.click();
  await dialog.locator('[data-crop-viewport]').selectOption('desktop');
  await expect(dialog.locator('[data-crop-mode]')).toHaveValue('region');
  await expect(dialog.locator('[data-crop-field="width"]')).toHaveValue('0.5');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-work-id="mindshow"] [data-dev-crop]')).toHaveCount(0);
});
