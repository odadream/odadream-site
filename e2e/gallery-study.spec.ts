import { test, expect } from '@playwright/test';
test('MindGrid framing overrides compact preview height and survives reload', async ({ page }) => {
  await page.goto('/design-system/#gallery-study');
  const study = page.locator('#gallery-study');
  const figure = study.locator('[data-media-id="archive-mindshow-byob-2019-mindgrid"]');
  const openEditor = () =>
    study
      .getByRole('button', { name: 'Кадрирование: archive-mindshow-byob-2019-mindgrid', exact: true })
      .click();
  const dialog = page.locator('[data-study-dialog]');
  for (const fit of ['contain', 'cover']) {
    await openEditor();
    await dialog.locator('[data-study-fit]').selectOption(fit);
    await dialog.locator('[data-study-y]').press('End');
    await dialog.locator('[data-study-apply]').click();
    await page.keyboard.press('Escape');
    for (const width of [390, 1380, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      if (width === 1920)
        await study.evaluate((node) => node.style.setProperty('--gallery-columns-wide', '2'));
      const frame = await figure.locator('.media-open').boundingBox();
      const image = await figure.locator('.media-open img').boundingBox();
      expect(frame!.width / frame!.height).toBeCloseTo(4 / 3, 2);
      expect(image!.height).toBeCloseTo(frame!.height, 1);
      expect(image!.width).toBeCloseTo(frame!.width, 1);
      await expect(figure.locator('img')).toHaveCSS('object-fit', fit);
      await expect(figure.locator('img')).toHaveCSS('max-height', 'none');
      await expect(figure.locator('img')).toHaveCSS('object-position', '50% 100%');
    }
    // A two-column profile exercises frames taller than the historical document cap.
    expect((await figure.locator('img').boundingBox())!.height).toBeGreaterThan(280);
    await page.reload();
    await expect(figure).toHaveAttribute('data-dev-framing', fit);
    const frame = await figure.locator('.media-open').boundingBox();
    expect((await figure.locator('img').boundingBox())!.height).toBeCloseTo(frame!.height, 1);
  }
  await openEditor();
  await dialog.locator('[data-study-reset]').click();
  await page.keyboard.press('Escape');
  await expect(figure).toHaveAttribute('data-dev-framing', 'natural');
  await expect(figure.locator('img')).toHaveCSS('max-height', 'none');
});

test('gallery study retains metadata, image opening and one applied focal point', async ({ page }) => {
  await page.goto('/design-system/#gallery-study');
  const study = page.locator('#gallery-study');
  await expect(study.locator('.media-gallery__tile')).toHaveCount(6);
  await expect(study.locator('.media-open__mark')).toHaveCount(0);
  await expect(study.locator('.media-microcaption').first()).toContainText('Демонстрация в Abrau Club');
  await expect(study.locator('.media-microcaption').first()).not.toContainText('abrau-2026-157');
  await expect(study.locator('.media-microcaption .callout-link').first()).toHaveAttribute(
    'data-link-family',
    'K',
  );
  await expect(study.locator('.media-microcaption .callout-link .callout-link-marker').first()).toBeVisible();
  await expect(study.locator('.media-microcaption__symbol > svg').first()).toHaveCSS(
    'vertical-align',
    '-1.375px',
  );
  for (const [width, columns] of [
    [320, 1],
    [390, 2],
    [797, 3],
    [1380, 4],
  ]) {
    await page.setViewportSize({ width, height: 884 });
    await expect(study.locator('.media-gallery[data-mode="tiles"]')).toHaveCSS(
      'column-count',
      String(columns),
    );
    await expect(study.locator('.media-gallery[data-mode="tiles"]')).toHaveCSS(
      'column-gap',
      width < 797 ? '8px' : '12px',
    );
    await expect(study.locator('.media-gallery__tile').first()).toHaveCSS('margin-bottom', '12px');
    const captionGap = await study
      .locator('.media-figure')
      .first()
      .evaluate((node) => {
        const image = node.querySelector('.media-open')!.getBoundingClientRect();
        const caption = node.querySelector('figcaption')!.getBoundingClientRect();
        return caption.top - image.bottom;
      });
    expect(captionGap).toBeCloseTo(4, 1);
    const surrounding = await study.evaluate((node) => {
      const gallery = node.querySelector('.media-gallery[data-mode="tiles"]')!.getBoundingClientRect();
      const intro = node.querySelector('h2 + p')!.getBoundingClientRect();
      const bounds = node.getBoundingClientRect();
      return {
        top: gallery.top - intro.bottom,
        left: gallery.left - bounds.left,
        right: bounds.right - gallery.right,
      };
    });
    expect(surrounding.top).toBeCloseTo(16, 1);
    expect(surrounding.left).toBeCloseTo(0, 1);
    expect(surrounding.right).toBeCloseTo(0, 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await study.evaluate((node) => {
    node.style.width = '560px';
  });
  await expect(study.locator('.media-gallery[data-mode="tiles"]')).toHaveCSS('column-count', '2');
  await study.evaluate((node) => {
    node.style.removeProperty('width');
  });
  for (const theme of ['light', 'dark']) {
    await page.evaluate((theme) => {
      document.documentElement.dataset.theme = theme;
    }, theme);
    await expect(study.locator('.media-microcaption').first()).toHaveCSS('font-size', '11px');
    await expect(study.locator('.media-microcaption').first()).toHaveCSS('line-height', '14.3px');
  }
  await study.locator('[data-lightbox]').first().click();
  await expect(page.locator('#lightbox')).toBeVisible();
  await expect(page.locator('.lightbox-caption')).toContainText('ID: abrau-2026-157');
  await page.keyboard.press('Escape');
  await study.locator('[data-study-crop]').first().click();
  const dialog = page.locator('[data-study-dialog]');
  await expect(dialog).toBeVisible();
  await dialog.locator('[data-study-x]').press('Home');
  await dialog.locator('[data-study-y]').press('End');
  await dialog.locator('[data-study-apply]').click();
  await expect(dialog.locator('[data-study-status]')).toContainText('0% / 100%');
  for (const image of await dialog.locator('[data-study-previews] img').all()) {
    await expect(image).toHaveCSS('object-position', '0% 100%');
  }
  await dialog.locator('[data-study-fit]').selectOption('contain');
  await dialog.locator('[data-study-apply]').click();
  await expect(dialog.locator('[data-study-previews] img').first()).toHaveCSS('object-fit', 'contain');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  const figure = study.locator('.media-figure').first();
  await expect(figure).toHaveAttribute('data-dev-framing', 'contain');
  await expect(figure.locator('.media-open img')).toHaveCSS('object-fit', 'contain');
  await expect(page.locator('[data-framing-pending]')).toHaveText('Кадрирование · 1');
  await page.reload();
  await expect(figure).toHaveAttribute('data-dev-framing', 'contain');
  await expect(page.locator('[data-framing-pending]')).toHaveText('Кадрирование · 1');
  await study.locator('[data-study-crop]').first().click();
  await expect(dialog.locator('[data-study-fit]')).toHaveValue('contain');
  await expect(dialog.locator('[data-study-y]')).toHaveValue('100');
  await dialog.locator('[data-study-reset]').click();
  await expect(page.locator('[data-framing-pending]')).toHaveText('Кадрирование · 0');
  await expect(figure).toHaveAttribute('data-dev-framing', 'natural');
  await page.keyboard.press('Escape');
});
