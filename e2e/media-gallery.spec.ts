import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('natural tiles, protected documents and large sequences keep their proportions in both themes', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Explicit viewport matrix runs once.');
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [390, 601, 797, 1440, 1920]) {
    await page.setViewportSize({ width, height: 932 });
    await page.goto('/design-system/');
    for (const theme of ['light', 'dark']) {
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
      }, theme);
      const gallery = page.locator('#system-gallery-tiles');
      await gallery.scrollIntoViewIfNeeded();
      await gallery.locator('img').evaluateAll(async (nodes) => {
        await Promise.all(nodes.map((node) => (node as HTMLImageElement).decode().catch(() => {})));
      });
      const failures = await page.evaluate(() => {
        const failures: string[] = [];
        if (document.documentElement.scrollWidth > innerWidth) failures.push('overflow');
        document.querySelectorAll<HTMLElement>('[data-media-gallery] figure').forEach((figure) => {
          const image = figure.querySelector<HTMLImageElement>('img');
          if (!image) {
            if (!figure.querySelector('video')) failures.push('missing media');
            return;
          }
          const box = image.getBoundingClientRect();
          if (
            figure.dataset.fit === 'natural' &&
            image.naturalWidth &&
            Math.abs(box.width / box.height - image.naturalWidth / image.naturalHeight) > 0.015
          )
            failures.push(figure.dataset.mediaId!);
          if (
            ['document', 'poster', 'diagram'].includes(figure.dataset.representation!) &&
            figure.dataset.fit !== 'natural'
          )
            failures.push('cropped document');
        });
        return failures;
      });
      expect(failures, `${width} ${theme}`).toEqual([]);
      await expect(page.locator('#system-gallery-crop figure').first()).toHaveAttribute('data-fit', 'crop');
      await expect(page.locator('#system-gallery-sequence')).toHaveAttribute('data-mode', 'sequence');
    }
  }
});

test('gallery navigation stays within its selection, preserves attribution and returns focus', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/design-system/');
  const gallery = page.locator('#system-gallery-tiles');
  const buttons = gallery.locator('[data-gallery-item]');
  await buttons.first().click();
  await expect(page.locator('.lightbox-position')).toHaveText('1 / 7');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('.lightbox-position')).toHaveText('7 / 7');
  await page.locator('[data-viewer-previous]').click();
  await expect(page.locator('.lightbox-caption')).toContainText('Ольга');
  await page.keyboard.press('Escape');
  await expect(buttons.first()).toBeFocused();
  await page.goto('/ru/works/project-schrodinger/');
  const workButtons = page.locator('#work-gallery [data-lightbox]');
  const workCount = await workButtons.count();
  const credited = page.locator('#work-gallery [data-lightbox][data-credit]').first();
  const credit = await credited.getAttribute('data-credit');
  const src = await credited.getAttribute('data-src');
  const position =
    (await workButtons.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-src')))).indexOf(
      src,
    ) + 1;
  expect(credit).toBeTruthy();
  await credited.click();
  await expect(page.locator('.lightbox-position')).toHaveText(`${position} / ${workCount}`);
  await expect(page.locator('[data-viewer-next]')).toBeVisible();
  await expect(page.locator('.lightbox-caption')).toContainText(credit!);
  await page.locator('[data-viewer-zoom]').click();
  await expect(page.locator('[data-viewer-zoom]')).toHaveAttribute('aria-pressed', 'true');
  const image = page.locator('#lightbox img');
  expect(
    await image.evaluate(
      (img: HTMLImageElement) => Math.abs(img.getBoundingClientRect().width - img.naturalWidth) < 1,
    ),
  ).toBe(true);
  expect(
    await page.locator('.lightbox-stage').evaluate((node) => node.scrollHeight > node.clientHeight),
  ).toBe(true);
  await page.locator('[data-viewer-zoom]').click();
  await expect(page.locator('#lightbox')).not.toHaveAttribute('data-zoomed');
});

test('full video uses explicit playback, stops previews and releases its source on close', async ({
  page,
}) => {
  await page.goto('/design-system/');
  const button = page.locator('#system-gallery-tiles [data-kind="video"]');
  await button.click();
  const player = page.locator('#lightbox video');
  await expect(player).toBeVisible();
  expect(await player.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
  expect(
    await page
      .locator('video[data-preview]')
      .evaluateAll((rows: HTMLVideoElement[]) => rows.every((row) => row.paused)),
  ).toBe(true);
  await expect(player).toHaveAttribute('data-media-id', 'neuromandala-terra');
  await page.keyboard.press('Escape');
  await expect(player).not.toHaveAttribute('src');
  expect(await player.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
});

test('an unavailable image still offers navigation and close', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/design-system/');
  await page
    .locator('#system-gallery-tiles [data-gallery-item]')
    .first()
    .evaluate((node) => {
      (node as HTMLElement).dataset.src = '/missing-gallery-image.webp';
    });
  await page.locator('#system-gallery-tiles [data-gallery-item]').first().click();
  await expect(page.locator('.lightbox-status')).toContainText('недоступен');
  await page.locator('[data-viewer-next]').click();
  await expect(page.locator('.lightbox-status')).toHaveText('');
  await expect(page.locator('#lightbox img')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox')).not.toHaveAttribute('open');
});

test('open viewer captions and controls stay readable in either page theme, including load errors', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/design-system/', { waitUntil: 'domcontentloaded' });
  for (const theme of ['light', 'dark']) {
    await page.evaluate((theme) => localStorage.setItem('oda-theme', theme), theme);
    await page.reload({ waitUntil: 'domcontentloaded' });
    const button = page.locator('#system-gallery-tiles [data-gallery-item]').first();
    await button.focus();
    await page.keyboard.press('Enter');
    const viewer = page.getByRole('dialog');
    await expect(viewer).toBeVisible();
    await expect(viewer).toHaveCSS('color-scheme', 'dark');
    await expect(viewer.locator('[data-viewer-zoom]')).toHaveCSS('color', 'rgb(243, 241, 236)');
    const result = await new AxeBuilder({ page })
      .include('#lightbox')
      .withRules(['color-contrast'])
      .analyze();
    expect(result.violations, theme + ' open viewer').toEqual([]);
    // Axe may classify changing media/backgrounds as incomplete: also inspect the actual composited stage.
    const ratio = await viewer.locator('.lightbox-caption').evaluate((el) => {
      const c = getComputedStyle(el)
        .color.match(/[\d.]+/g)!
        .map(Number);
      const alpha = c[3] ?? 1;
      // The unchanged stage/backdrop composite lies below RGB 10 in both page themes.
      const foreground = c.slice(0, 3).map((v) => v * alpha + 10 * (1 - alpha));
      const luminance = (rgb: number[]) =>
        rgb
          .map((v) => {
            const n = v / 255;
            return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
          })
          .reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0);
      return (luminance(foreground) + 0.05) / (luminance([10, 10, 10]) + 0.05);
    });
    expect(ratio, theme + ' caption').toBeGreaterThanOrEqual(4.5);
    await page.keyboard.press('Escape');
    await expect(button).toBeFocused();
    await button.evaluate((el) => {
      (el as HTMLElement).dataset.src = '/missing-viewer-contrast.webp';
    });
    await button.click();
    await expect(viewer.locator('.lightbox-status')).toContainText('недоступен');
    await expect(viewer.locator('.lightbox-status')).toHaveCSS('color', 'rgb(243, 241, 236)');
    await page.keyboard.press('Escape');
    await expect(button).toBeFocused();
  }
});
