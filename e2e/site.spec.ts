import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const works = [
  'interference-of-realities',
  'mindshow',
  'neurobattle',
  'project-schrodinger',
  'oda-rings',
  'sync-circle',
];
const cases = ['tsiolkovsky-festival-2026', 'tsiolkovsky-laboratory-2025', 'dano-2025', 'byob-2026'];

test('all curated works and cases are real HTML pages', async ({ page }) => {
  for (const path of [...works.map((x) => `/en/works/${x}/`), ...cases.map((x) => `/en/cases/${x}/`)]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://odadream.art${path}`);
  }
});

test('language toggle preserves a work and back/forward', async ({ page }) => {
  await page.goto('/en/works/mindshow/');
  await page.getByRole('link', { name: 'Русская версия' }).click();
  await expect(page).toHaveURL(/\/ru\/works\/mindshow\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await page.goBack();
  await expect(page).toHaveURL(/\/en\/works\/mindshow\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/ru\/works\/mindshow\/$/);
});

test('old query links resolve explicitly; unknown IDs do not become home', async ({ page }) => {
  await page.goto('/?internal=true&id=interference&lang=ru');
  await expect(page).toHaveURL(/\/ru\/works\/interference-of-realities\/$/);
  await page.goto('/?id=unknown-record&lang=en');
  await expect(page).toHaveURL(/\/legacy\/unavailable\/\?id=unknown-record&lang=en$/);
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex,follow');
});

test('mobile navigation, media, lightbox and contact work without horizontal overflow', async ({
  page,
  isMobile,
}) => {
  await page.goto('/en/');
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await expect(page.locator('.feature-slide:not([hidden]) video')).toBeVisible();
  await page.goto('/en/works/interference-of-realities/');
  await page.getByRole('button', { name: /Enlarge: Performers/ }).click();
  await expect(page.locator('#lightbox')).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox')).not.toHaveAttribute('open', '');
  await expect(page.getByRole('button', { name: /Enlarge: Performers/ })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.goto('/en/contact/');
  await expect(page.getByRole('link', { name: 'hi@odadream.art' })).toHaveAttribute(
    'href',
    'mailto:hi@odadream.art',
  );
  await expect(page.getByRole('link', { name: /odadream_info/ })).toHaveAttribute(
    'href',
    'https://t.me/odadream_info',
  );
});

test('featured carousel, editorial links and card media follow the design grammar', async ({
  page,
  isMobile,
}) => {
  await page.goto('/ru/');
  const activeSlide = page.locator('.feature-slide:not([hidden])');
  const firstSlideId = await activeSlide.getAttribute('data-slide-id');
  await expect(activeSlide.locator('[data-carousel-position]')).toHaveText('01 / 05');
  await activeSlide.getByRole('button', { name: 'Следующая работа' }).click();
  await expect(page.locator('.feature-slide:not([hidden])')).not.toHaveAttribute(
    'data-slide-id',
    firstSlideId || '',
  );
  await expect(page.locator('.feature-slide:not([hidden]) [data-carousel-position]')).toHaveText('02 / 05');
  await expect(page.locator('header .brand img')).toHaveCount(1);
  await expect(page.locator('.feature-slide:not([hidden]) .nm-carousel-controls .eyebrow')).toContainText(
    'КАДР',
  );
  await expect(page.locator('.nm-brand-intro')).toHaveCount(0);
  await expect(page.locator('.section-grid').nth(0).locator('.section-label .index')).toHaveText('02');
  await expect(page.locator('.work-card__status[data-work-status="research"]')).toContainText('R&D');
  await expect(page.locator('.recognition-card')).toHaveCount(4);
  await expect(page.locator('.work-card__code').first()).toHaveAttribute('aria-label', '00.02.01');
  await expect(page.locator('.work-card__meta .index')).toHaveCount(0);
  await expect(page.locator('.work-card__link').first()).toHaveCSS('text-decoration-line', 'none');
  await expect(page.locator('.quiet-link').first()).toHaveCSS('text-decoration-line', 'underline');
  if (isMobile) {
    await page.locator('.work-card').first().scrollIntoViewIfNeeded();
    await expect(page.locator('.work-card').first()).toHaveClass(/is-active/);
  } else {
    await page.locator('.work-card').first().hover();
    await expect(page.locator('.work-card').first()).toHaveClass(/is-active/);
  }
});

test('V5 design stand shares tokens and live components with the site', async ({ page }) => {
  await page.goto('/design-system/');
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex,follow');
  await expect(page.locator('.system-section')).toHaveCount(11);
  await expect(page.locator('.work-card__link')).toHaveCount(2);
  await page.locator('#system-05').scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator('#system-05 img')
        .first()
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  const back = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--plane-back').trim(),
  );
  await page.goto('/ru/');
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--plane-back').trim(),
    ),
  ).toBe(back);
});

test('header remains visible, theme follows the system and manual choice persists', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/ru/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.evaluate(() => scrollTo(0, 1200));
  await expect
    .poll(() => page.locator('.site-header').evaluate((node) => Math.round(node.getBoundingClientRect().top)))
    .toBe(0);
  await page.getByRole('button', { name: /Тема:/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'light');
  await page.getByRole('button', { name: /Тема:/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#111110');
});

test('homepage distinguishes catalogue scope and document previews', async ({ page, isMobile }) => {
  await page.goto('/ru/');
  await expect(page.getByText('Работы в каталоге', { exact: true })).toBeVisible();
  await expect(page.getByText('Папки событий · Golem', { exact: true })).toBeVisible();
  await expect(page.getByText('Прежний перечень', { exact: true })).toBeVisible();
  await expect(page.locator('.recognition-card__image')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  const trigger = page.locator('.recognition-card__image').first();
  await trigger.click();
  await expect(page.locator('#lightbox')).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  if (isMobile) {
    await page.locator('.nm-hero').scrollIntoViewIfNeeded();
    expect(
      await page.locator('.feature-slide:not([hidden])').evaluate((slide) => {
        const video = slide.querySelector('video')?.getBoundingClientRect();
        const summary = slide.querySelector('.nm-data-panel')?.getBoundingClientRect();
        return Boolean(video && summary && summary.top >= video.bottom - 2);
      }),
    ).toBeTruthy();
  }
});

test('key pages have no serious or critical accessibility violations', async ({ page }) => {
  for (const path of [
    '/en/',
    '/ru/',
    '/en/works/interference-of-realities/',
    '/en/cases/dano-2025/',
    '/en/contact/',
    '/design-system/',
  ]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const high = results.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical');
    expect(
      high.map((item) => `${item.id}: ${item.nodes.length} nodes`),
      path,
    ).toEqual([]);
  }
});
test('reference fields follow material on mobile; colophon retains a previous visit', async ({
  page,
  isMobile,
}) => {
  await page.goto('/ru/');
  await page.evaluate(() => {
    localStorage.setItem('oda-last-visit', '2026-08-20T10:00:00Z');
    sessionStorage.removeItem('oda-previous-visit');
  });
  await page.reload();
  await expect(page.locator('[data-previous-visit]')).toContainText('2026');
  const previous = await page.locator('[data-previous-visit]').textContent();
  await page.goto('/ru/works/');
  await expect(page.locator('[data-previous-visit]')).toHaveText(previous!);
  await expect(page.locator('.site-colophon > .record-stamp > dl > div')).toHaveCount(4);
  await expect(page.locator('.site-colophon')).toContainText('Astro');
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async () => {
          throw new Error('denied');
        },
      },
      configurable: true,
    }),
  );
  await page.locator('[data-copy-page-link]').click();
  await expect(page.locator('[data-copy-fallback]')).toBeVisible();
  await expect(page.locator('[data-copy-fallback]')).toHaveValue(page.url());
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (url: string) => {
          (window as Window & { copiedURL?: string }).copiedURL = url;
        },
      },
      configurable: true,
    }),
  );
  await page.locator('[data-copy-page-link]').click();
  await expect(page.locator('[data-copy-status]')).toHaveText('Ссылка скопирована');
  await expect(page.locator('[data-copy-fallback]')).toBeHidden();
  expect(await page.evaluate(() => (window as Window & { copiedURL?: string }).copiedURL)).toBe(page.url());
  await page.goto('/ru/');
  const section = page.locator('#selected-works');
  expect(
    await section.evaluate(
      (node) =>
        node.querySelector('.section-body')!.compareDocumentPosition(node.querySelector('.section-rail')!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ),
  ).toBeTruthy();
  if (isMobile) {
    await expect(section.locator('.section-rail__note')).toBeHidden();
    await expect(section.locator('.section-rail__field')).toBeHidden();
    const main = await section.locator('.section-body').boundingBox();
    const data = await section.locator('.section-rail__data').boundingBox();
    expect(data!.y).toBeGreaterThanOrEqual(main!.y + main!.height);
  }
});
