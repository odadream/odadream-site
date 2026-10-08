import { expect, test } from '@playwright/test';

test('reviewed dossier selections show true page numbers and no private-original download', async ({
  page,
}) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/works/other-people/`);
    const dossier = page.locator('#document-other-people-en');
    await expect(dossier).toContainText('4/5');
    await expect(dossier.locator('img')).toHaveCount(4);
    await expect(dossier.locator('a[href$=".pdf"]')).toHaveCount(0);
    await dossier.locator('[data-lightbox]').first().click();
    await expect(page.locator('.lightbox-position')).toHaveText('1 / 4');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('.lightbox-caption')).toContainText(
      lang === 'ru' ? 'Страница 4 из 5' : 'Page 4 of 5',
    );
    await page.keyboard.press('Escape');
    await page.goto(`/${lang}/works/beyond/`);
    await expect(page.locator('#document-beyond-presentation')).toContainText(
      lang === 'ru' ? 'Год не указан' : 'Year unspecified',
    );
  }
});

test('recognition corpus preserves missing-scan qualification and readable shared image viewer', async ({
  page,
}) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/recognition/`);
    await expect(page.locator('.recognition-card')).toHaveCount(17);
    await expect(page.locator('.recognition-card img')).toHaveCount(13);
    await expect(page.locator('#recognition-mipt-letter-2025 img')).toHaveCount(0);
    await expect(page.locator('#recognition-mipt-letter-2025')).toContainText(
      lang === 'ru' ? 'Скан не найден' : 'scan is missing',
    );
    const button = page.locator('#recognition-portal-2030-2025 [data-lightbox]');
    await button.click();
    await expect(page.locator('#lightbox')).toBeVisible();
    await expect(page.locator('#lightbox img')).toHaveAttribute('src', /\/images\/prepared\//);
    await page.keyboard.press('Escape');
    await expect(button).toBeFocused();
  }
});

test('Lighthouse render gallery opens the full player while previews stay muted', async ({
  page,
  isMobile,
}) => {
  await page.goto('/ru/works/lighthouse/');
  const preview = page.locator('[data-media-id="lighthouse-spin-twist"] [data-video-preview]');
  await preview.scrollIntoViewIfNeeded();
  if (isMobile)
    await preview.evaluate((node) => {
      const box = node.getBoundingClientRect();
      scrollBy(0, box.top + box.height / 2 - innerHeight / 2);
    });
  else await preview.hover();
  await expect(preview).toHaveClass(/is-playing/);
  expect(await preview.locator('video').evaluate((video: HTMLVideoElement) => video.muted)).toBe(true);
  await page.locator('[data-media-id="lighthouse-spin-twist"] [data-lightbox]').click();
  await expect(page.locator('#lightbox video')).toHaveAttribute(
    'src',
    '/video/archive/lighthouse-spin-twist.mp4',
  );
  await expect(page.locator('#lightbox video')).toHaveAttribute('controls', '');
  await expect(preview).not.toHaveClass(/is-playing/);
  await page.keyboard.press('Escape');
});
