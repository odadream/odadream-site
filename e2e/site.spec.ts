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

test('profile parameters drive typography, spacing, signals and background statistics', async ({ page }) => {
  await page.goto('/ru/');
  const stamp = page.locator('#selected-works .record-stamp');
  await expect(stamp).toHaveClass(/record-stamp--reference/);
  await expect(page.locator('.section-rail__folio').first()).toHaveCSS('font-weight', '800');
  const before = await page
    .locator('.work-card p')
    .first()
    .evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
  const gapBefore = await page
    .locator('.work-grid')
    .first()
    .evaluate((node) => parseFloat(getComputedStyle(node).columnGap));
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--type-scale', '1.1');
    document.documentElement.style.setProperty('--space-unit', '5px');
    document.documentElement.style.setProperty('--signal-works', 'rgb(120, 180, 160)');
  });
  expect(
    await page
      .locator('.work-card p')
      .first()
      .evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
  ).toBeCloseTo(before * 1.1, 1);
  expect(
    await page
      .locator('.work-grid')
      .first()
      .evaluate((node) => parseFloat(getComputedStyle(node).columnGap)),
  ).toBeCloseTo(gapBefore * 1.25, 1);
  await expect(page.locator('[data-route="works"] .page-code__family')).toHaveCSS(
    'color',
    'rgb(120, 180, 160)',
  );
  await page.setViewportSize({ width: 797, height: 912 });
  await page.goto('/en/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test('card tracks align and anchor targets clear the header', async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/#selected-works`);
    await page.evaluate(() => document.fonts.ready);
    const header = await page.locator('.site-header').boundingBox();
    const title = await page.locator('#selected-works h2').boundingBox();
    expect(title!.y).toBeGreaterThanOrEqual(header!.height);
    if (!isMobile) {
      const rows = await page
        .locator('.work-card h3')
        .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top));
      for (let i = 0; i < rows.length; i += 2) expect(Math.abs(rows[i] - rows[i + 1])).toBeLessThan(1);
    } else {
      await page.locator('.menu-toggle').click();
      await page.keyboard.press('Escape');
      await expect(page.locator('.menu-toggle')).toBeFocused();
      await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'false');
      // Long stamp fields must expand the hero, never overlap the next section.
      await page.locator('.nm-data-panel .record-stamp dl > div:last-child dd').evaluate((node) => {
        node.textContent = 'Long annotation. '.repeat(35);
      });
      const stamp = await page.locator('.nm-data-panel').boundingBox();
      const next = await page.locator('#selected-works').boundingBox();
      expect(next!.y).toBeGreaterThanOrEqual(stamp!.y + stamp!.height - 1);
    }
  }
});

test('carousel uses unframed direction marks and stops video offscreen', async ({ page }) => {
  await page.goto('/ru/');
  const active = page.locator('.nm-slide:not([hidden])');
  expect(await page.locator('.nm-slide source[src]').count()).toBeLessThanOrEqual(1);
  await expect(page.locator('.nm-slide[hidden] source[src]')).toHaveCount(0);
  await expect(page.locator('.nm-data-panel')).toHaveCount(1);
  await expect(page.locator('[data-carousel-toggle]')).toHaveCount(0);
  await expect(active.locator('[data-carousel-prev] .technical-mark')).toHaveAttribute(
    'data-mark',
    'previous',
  );
  await expect(active.locator('[data-carousel-next] .technical-mark')).toHaveAttribute('data-mark', 'next');
  await expect(active.locator('[data-carousel-next]')).toHaveCSS('border-width', '0px');
  const before = await active.getAttribute('data-slide-id');
  await active.locator('[data-carousel-next]').click();
  expect(await active.getAttribute('data-slide-id')).not.toBe(before);
  await expect(active.locator('[data-carousel-next]')).toBeFocused();
  await expect
    .poll(() =>
      page
        .locator('.nm-slide[hidden] video')
        .evaluateAll((videos: HTMLVideoElement[]) => videos.every((video) => video.paused)),
    )
    .toBeTruthy();
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect
    .poll(() => active.locator('video').evaluate((video: HTMLVideoElement) => video.paused))
    .toBeTruthy();
});

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
  await page.locator('[data-media-id="interference-stage"] [data-lightbox]').click();
  await expect(page.locator('#lightbox')).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox')).not.toHaveAttribute('open', '');
  await expect(page.locator('[data-media-id="interference-stage"] [data-lightbox]')).toBeFocused();
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
  await expect(page.locator('[data-carousel]')).toHaveAttribute('data-carousel-ready', 'true');
  const total = String(await page.locator('.feature-slide').count()).padStart(2, '0');
  await expect(activeSlide.locator('[data-carousel-position]')).toHaveText('01 / ' + total);
  await activeSlide.getByRole('button', { name: 'Следующий кадр' }).click();
  await expect(page.locator('.feature-slide:not([hidden])')).not.toHaveAttribute(
    'data-slide-id',
    firstSlideId || '',
  );
  await expect(page.locator('.feature-slide:not([hidden]) [data-carousel-position]')).toHaveText(
    '02 / ' + total,
  );
  await expect(page.locator('header .brand img')).toHaveCount(1);
  await expect(page.locator('.feature-slide:not([hidden]) .nm-carousel-controls .eyebrow')).toContainText(
    'КАДР',
  );
  await expect(page.locator('.nm-brand-intro')).toHaveCount(0);
  await expect(page.locator('.section-rail .page-code').first()).toHaveAttribute('data-page-code', 'H.01');
  await expect(page.locator('.nm-heading .page-code').first()).toHaveAttribute('data-page-code', 'H');
  await expect(page.locator('.site-nav .page-code')).toHaveCount(10);
  await expect(page.locator('.site-nav a[data-route="home"]')).toHaveAttribute('href', '/ru/');
  await expect(page.locator('.site-nav a[data-route="home"]')).toContainText('Главная');
  await expect(page.locator('.site-nav .page-code').first()).toHaveCSS('padding', '0px');
  await expect(page.locator('.site-nav a').first()).toHaveCSS('column-gap', '8px');
  await expect(page.locator('#selected-works .work-card')).toHaveCount(6);
  await expect(page.locator('#selected-works .work-card:not([data-work-stage="realized"])')).toHaveCount(0);
  await expect(page.locator('.recognition-card')).toHaveCount(7);
  await expect(page.locator('.work-card__identity .page-code')).toHaveCount(0);
  await expect(page.locator('.process-steps .page-code')).toHaveCount(0);
  await expect(page.locator('.work-card__category').first()).not.toBeEmpty();
  await expect(page.locator('.recognition-card__image').first()).toHaveCSS('overflow', 'hidden');
  await expect(page.locator('.site-footer .social-icon').first()).toBeVisible();
  await expect(page.locator('.work-card__link').first()).toHaveCSS('text-decoration-line', 'none');
  const visibleLink = page.locator('a.callout-link:visible').first();
  await expect(visibleLink).toHaveClass(/is-drawn/);
  await expect(visibleLink).toHaveCSS('text-decoration-line', 'none');
  await expect(visibleLink.locator('.callout-link-drawing path')).toHaveAttribute('d', /H[\d. -]+ L/);
  await expect(visibleLink).toContainText('\u00a0');
  const preview = page.locator('.work-card [data-video-preview]').first();
  await expect(preview.locator('img')).toHaveAttribute('src', '/video/interference-dawn-poster.webp');
  if (isMobile) {
    await preview.evaluate((node) => {
      const box = node.getBoundingClientRect();
      window.scrollBy(0, box.top + box.height / 2 - innerHeight / 2);
    });
  } else {
    await preview.hover();
  }
  await expect(preview).toHaveClass(/is-playing/);
  await expect.poll(() => preview.locator('video').evaluate((v: HTMLVideoElement) => !v.paused)).toBeTruthy();
});

test('V5 design stand shares tokens and live components with the site', async ({ page }) => {
  await page.goto('/design-system/');
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex,follow');
  await expect(page.locator('.system-section')).toHaveCount(11);
  await expect(page.locator('.work-card__link')).toHaveCount(6);
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
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#23211e');
});

test('header and open menu use the design-system foreground material', async ({ page }) => {
  for (const scheme of ['dark', 'light'] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/design-system/');
    const specimen = await page.locator('.plane-demo > div > div').evaluate((node) => {
      const style = getComputedStyle(node);
      return { background: style.backgroundColor, shadow: style.boxShadow };
    });
    const header = await page.locator('.site-header').evaluate((node) => {
      const style = getComputedStyle(node);
      return { background: style.backgroundColor, shadow: style.boxShadow };
    });
    expect(header).toEqual(specimen);
    await page.setViewportSize({ width: 797, height: 912 });
    await page.locator('.menu-toggle').click();
    const menu = await page.locator('.site-nav.open').evaluate((node) => {
      const style = getComputedStyle(node);
      return { background: style.backgroundColor, shadow: style.boxShadow };
    });
    expect(menu).toEqual(specimen);
  }
});

test('homepage distinguishes catalogue scope and document previews', async ({ page, isMobile }) => {
  await page.goto('/ru/');
  await expect(page.locator('#selected-works h2')).toHaveText('Избранные работы');
  await expect(page.locator('.nm-data-panel .record-stamp__title')).toContainText('Статистика записей');
  await expect(page.locator('.nm-data-panel dd.record-stamp__metric')).toHaveText(['1 751', '70 ч.']);
  await expect(page.locator('.nm-data-panel dl > div:last-child')).toContainText('30.08.2026');
  if (!isMobile) {
    await page.setViewportSize({ width: 850, height: 912 });
    const cells = page.locator('.nm-data-panel dl > div');
    const labels = await cells
      .locator('dt')
      .evaluateAll((nodes) => nodes.slice(0, 2).map((node) => node.getBoundingClientRect().height));
    const metrics = await cells
      .locator('dd.record-stamp__metric')
      .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top));
    expect(Math.max(...labels)).toBeLessThan(20);
    expect(Math.abs(metrics[0] - metrics[1])).toBeLessThan(1);
  }
  await expect(page.getByText('Работы в каталоге', { exact: true })).toBeVisible();
  await expect(page.getByText('События в каталоге', { exact: true })).toBeVisible();
  await expect(page.getByText('Папки событий · Golem', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Записи признаний', { exact: true })).toBeVisible();
  await expect(page.getByText('Прежний перечень', { exact: true })).toHaveCount(0);
  await expect(page.locator('.recognition-card__image')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  const trigger = page.locator('.recognition-card__image').first();
  await trigger.click();
  await expect(page.locator('#lightbox')).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  if (isMobile) {
    await page.locator('.nm-hero').scrollIntoViewIfNeeded();
    expect(
      await page.locator('.nm-slide:not([hidden])').evaluate((slide) => {
        const video = slide.querySelector('video')?.getBoundingClientRect();
        const summary = document.querySelector('.nm-data-panel')?.getBoundingClientRect();
        return Boolean(video && summary && summary.top >= video.bottom - 2);
      }),
    ).toBeTruthy();
  }
});

test('timeline provenance code, date, event and link stay in separate grid cells at tablet width', async ({
  page,
}) => {
  await page.setViewportSize({ width: 850, height: 912 });
  await page.goto('/ru/');
  const rows = await page.locator('#timeline .case-row--overview').evaluateAll((items) =>
    items.map((item) => {
      const date = item.querySelector('.case-row__metadata')!.getBoundingClientRect();
      const description = item.querySelector('h3')!.getBoundingClientRect();
      const link = item.querySelector('.quiet-link')!.getBoundingClientRect();
      const row = item.getBoundingClientRect();
      return {
        cells: item.children.length,
        dateAndDescriptionDoNotOverlap: date.right <= description.left,
        linkFollowsDescription: link.top >= description.bottom - 1,
        descriptionFitsRow: description.right <= row.right + 1,
        linkFitsRow: link.right <= row.right + 1,
      };
    }),
  );
  expect(rows.length).toBeGreaterThan(0);
  for (const row of rows) {
    expect(row.cells).toBe(3);
    expect(row.dateAndDescriptionDoNotOverlap).toBeTruthy();
    expect(row.linkFollowsDescription).toBeTruthy();
    expect(row.descriptionFitsRow).toBeTruthy();
    expect(row.linkFitsRow).toBeTruthy();
  }
});

test('key pages have no serious or critical accessibility violations', async ({ page }) => {
  for (const path of [
    '/en/',
    '/ru/',
    '/en/works/interference-of-realities/',
    '/en/cases/dano-2025/',
    '/en/contact/',
    '/ru/education/',
    '/en/education/neuro-laboratory/',
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
    await expect(section.locator('.section-rail__folio')).toBeHidden();
    await expect(section.locator('.section-rail__spine .page-code')).toHaveAttribute(
      'data-page-code',
      'H.01',
    );
    const main = await section.locator('.section-body').boundingBox();
    const data = await section.locator('.section-rail__data').boundingBox();
    expect(data!.y).toBeGreaterThanOrEqual(main!.y + main!.height);
  }
});
