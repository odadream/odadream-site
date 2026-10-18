import { test, expect } from '@playwright/test';

test('a deep link keeps page context and supports chapter changes, focus and mutually exclusive menus', async ({
  page,
}) => {
  let releaseFonts!: () => void;
  let fontsReady: Promise<void>;
  await page.route('**/*.woff2', async (route) => {
    await fontsReady;
    await route.continue();
  });
  for (const lang of ['ru', 'en']) {
    fontsReady = new Promise<void>((resolve) => {
      releaseFonts = resolve;
    });
    await page.goto(`/${lang}/works/oda-rings/#work-story`, { waitUntil: 'domcontentloaded' });
    releaseFonts();
    await page.evaluate(() => document.fonts.ready);
    const navigation = page.locator('[data-reading-navigation]');
    const summary = navigation.locator('summary');
    const details = navigation.locator('details');
    const story = (await page.locator('#work-story h2').textContent())!.trim();
    await expect(summary).toContainText(story);
    await expect(navigation.locator('.reading-parent')).toHaveAttribute('href', `/${lang}/works/`);
    await expect(navigation.locator('.reading-page-title')).toContainText(lang === 'ru' ? 'Кольца' : 'Rings');
    await summary.click();
    await expect(navigation.locator('[data-outline-target="work-story"]')).toHaveAttribute(
      'aria-current',
      'location',
    );
    await expect(navigation.locator('.reading-actions, .reading-contents-title')).toHaveCount(0);
    await page.screenshot({ path: test.info().outputPath(`navigation-${lang}.png`) });
    const next = navigation.locator('[data-outline-target="work-credits"]');
    await next.click();
    await expect(page).toHaveURL(/#work-credits$/);
    await expect(details).not.toHaveAttribute('open', '');
    await expect(page.locator('#work-credits h2')).toBeFocused();
    await expect(summary).toContainText((await page.locator('#work-credits h2').textContent())!.trim());
    await summary.click();
    await page.keyboard.press('Escape');
    await expect(summary).toBeFocused();
    await expect(details).not.toHaveAttribute('open', '');
    const menu = page.locator('.menu-toggle');
    if (await menu.isVisible()) {
      await summary.click();
      await menu.click();
      await expect(details).not.toHaveAttribute('open', '');
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await expect(menu).toHaveAttribute('aria-label', lang === 'ru' ? 'Закрыть меню' : 'Close menu');
      await page.keyboard.press('Escape');
      await expect(menu).toBeFocused();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('case year shortcuts and chapter anchors remain usable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto('/ru/cases/');
    await page.locator('.reading-contents summary').click();
    const years = page.locator('[data-reading-year]');
    expect(await years.count()).toBeGreaterThan(2);
    const link = years.last();
    const target = (await link.getAttribute('href'))!;
    await expect(page.locator(target)).toHaveAttribute(
      'data-case-year',
      (await link.getAttribute('data-reading-year'))!,
    );
    await link.click();
    expect(new URL(page.url()).hash).toBe(target);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  } finally {
    await context.close();
  }
});
