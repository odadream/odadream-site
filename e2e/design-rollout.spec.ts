import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';

const records: { path: string; kind: string; family: string; anchors: string[] }[] = JSON.parse(
  execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
 import { loadSiteModule } from './scripts/site-data.mjs';
 const data = await loadSiteModule();
 const { createPages } = await loadSiteModule('src/lib/routes.ts');
 console.log(JSON.stringify(createPages(data)));
`,
    ],
    { windowsHide: true, encoding: 'utf8' },
  ),
);

for (const theme of ['light', 'dark']) {
  test('all canonical pages use functional macro/detail sections · ' + theme, async ({ page, isMobile }) => {
    test.skip(isMobile, 'Explicit 390/1440 widths include mobile.');
    test.setTimeout(180_000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route('**/*', (route) =>
      ['image', 'media'].includes(route.request().resourceType()) ? route.abort() : route.continue(),
    );
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 932 });
      for (const record of records) {
        await page.goto(record.path, { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => document.fonts.ready);
        const problems = await page.evaluate(
          async ({ theme, record }) => {
            document.documentElement.dataset.theme = theme;
            await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
            const errors: string[] = [];
            const detail = ['work', 'case'].includes(record.kind);
            const blocks = [
              ...document.querySelectorAll<HTMLElement>(
                detail ? 'main .detail-section' : 'main .macro-section',
              ),
            ];
            const patterns: Record<string, string[]> = {
              home: ['catalogue', 'process', 'catalogue', 'catalogue', 'action'],
              works: ['catalogue', 'catalogue'],
              education: ['catalogue', 'editorial', 'document'],
              programme: ['editorial', 'editorial', 'document'],
              cooperation: ['editorial', 'editorial', 'document', 'process', 'action'],
              studio: ['editorial', 'catalogue', 'editorial', 'catalogue', 'document', 'editorial'],
              cases: ['catalogue', 'catalogue', 'catalogue'],
              recognition: ['catalogue'],
              contact: ['action'],
              work: ['editorial', 'editorial', 'editorial', 'editorial', 'action'],
              case: ['editorial', 'editorial', 'editorial', 'document'],
            };
            if (!blocks.length) errors.push('missing common sections');
            if (
              record.kind !== 'technology' &&
              blocks.map((b) => b.dataset.blockKind).join(',') !== patterns[record.kind].join(',')
            )
              errors.push('functional composition');
            if (
              record.kind === 'technology' &&
              blocks.filter((b) => b.dataset.blockKind === 'process').length !== 1
            )
              errors.push('method process');
            const codes = blocks.map((block) =>
              block.querySelector('header .page-code')!.getAttribute('data-page-code'),
            );
            const expected = blocks.map((_, i) => record.family + '.' + String(i + 1).padStart(2, '0'));
            if (codes.join(',') !== expected.join(',')) errors.push('chapter sequence ' + codes.join(','));
            if (document.documentElement.scrollWidth > innerWidth) errors.push('overflow');
            for (const block of blocks) {
              const header = block.querySelector('header')!;
              const heading = header.querySelector('h2')!;
              if (block.getAttribute('aria-labelledby') !== heading.id) errors.push('unlabelled section');
              const first = header.nextElementSibling;
              if (
                first &&
                Math.abs(
                  first.getBoundingClientRect().top -
                    header.getBoundingClientRect().bottom -
                    (detail ? 24 : 32),
                ) > 1
              )
                errors.push('heading / material rhythm');
              if (!detail) {
                const field = ['works'].includes(record.kind)
                  ? 'none'
                  : ['contact', 'recognition'].includes(record.kind)
                    ? 'label'
                    : 'folio';
                if (block.dataset.field !== field) errors.push('field role');
                const body = block.querySelector(':scope > .section-body')!;
                if (
                  (getComputedStyle(body, '::before').backgroundColor === 'rgba(0, 0, 0, 0)') !==
                  (block.dataset.blockKind !== 'process')
                )
                  errors.push('surface role');
                const reference = block.querySelector(':scope > aside');
                if (
                  reference &&
                  !(body.compareDocumentPosition(reference) & Node.DOCUMENT_POSITION_FOLLOWING)
                )
                  errors.push('reference order');
              }
            }
            for (const id of record.anchors ?? [])
              if (!document.getElementById(id)) errors.push('lost anchor ' + id);
            document
              .querySelectorAll('.section-body .section-body, .detail-section .section-body')
              .forEach((el) => {
                if (
                  parseFloat(getComputedStyle(el).paddingTop) ||
                  parseFloat(getComputedStyle(el).paddingBottom)
                )
                  errors.push('nested panel padding');
              });
            document.querySelectorAll('.work-main .media-gallery .media-figure').forEach((el) => {
              if (parseFloat(getComputedStyle(el).marginTop)) errors.push('cover gap inherited by gallery');
            });
            if (
              detail &&
              (document.querySelector('.work-layout .macro-section') ||
                !document.querySelector('.work-aside .record-stamp'))
            )
              errors.push('detail passport variant lost');
            return errors;
          },
          { theme, record },
        );
        expect(problems, record.path + ' ' + theme + ' ' + width).toEqual([]);
      }
    }
  });
}

test('signal connections follow their container and keep readable steps under profile changes', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Explicit mobile/desktop and narrow desktop containers.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of ['/ru/', '/en/', '/design-system/']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    for (const width of [390, 797, 901, 1440, 1920])
      for (const scale of [1, 1.125])
        for (const unit of [4, 5]) {
          await page.setViewportSize({ width, height: 932 });
          const errors = await page.evaluate(
            async ({ scale, unit }) => {
              const root = document.documentElement;
              root.style.setProperty('--type-scale', String(scale));
              root.style.setProperty('--space-unit', unit + 'px');
              await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
              const errors: string[] = [];
              document.querySelectorAll('[data-flow="linked"]').forEach((flow) => {
                const items = [...flow.querySelectorAll('li')];
                if (items.length !== 3) errors.push('incomplete shared signal flow');
                const horizontal = items.every(
                  (li) => Math.abs(li.getBoundingClientRect().top - items[0].getBoundingClientRect().top) < 1,
                );
                items.forEach((li, i) => {
                  if (
                    li.getBoundingClientRect().width + 1 <
                    Math.min(flow.getBoundingClientRect().width, 192 * scale)
                  )
                    errors.push('narrow step');
                  if (
                    i < items.length - 1 &&
                    getComputedStyle(li, '::after').content !== (horizontal ? '"→"' : '"↓"')
                  )
                    errors.push('connection direction');
                });
              });
              return errors;
            },
            { scale, unit },
          );
          expect(errors, route + ' ' + width + ' ' + scale + ' ' + unit).toEqual([]);
        }
  }
  await page.setViewportSize({ width: 1920, height: 932 });
  const flow = page.locator('[data-flow="linked"]');
  await flow.evaluate((el) => {
    (el as HTMLElement).style.maxWidth = '520px';
  });
  await page.evaluate(
    () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))),
  );
  expect(
    await flow
      .locator('li')
      .first()
      .evaluate((el) => getComputedStyle(el, '::after').content),
  ).toBe('"↓"');
});

test('page codes expose localized names and participation headings scale with their reading role', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Explicit 390/1440 widths include mobile.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const lang of ['ru', 'en']) {
    for (const width of [390, 1440]) {
      await page.goto('/' + lang + '/cooperation/', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);
      await page.setViewportSize({ width, height: 932 });
      await expect(
        page.locator('main').getByRole('img', {
          name: lang === 'ru' ? 'Страница C, раздел 01' : 'Page C, section 01',
          exact: true,
        }),
      ).toHaveCount(1);
      await expect(
        page.locator('.page-outline').getByRole('img', {
          name: lang === 'ru' ? 'Страница C, раздел 01' : 'Page C, section 01',
          exact: true,
        }),
      ).toHaveCount(1);
      await page.goto('/' + lang + '/works/mindshow/', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);
      for (const scale of [1, 1.125]) {
        await page.evaluate(async (scale) => {
          document.documentElement.style.setProperty('--type-scale', String(scale));
          await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
        }, scale);
        const heading = page.locator('.participation-panel h4').first();
        await expect(heading).toHaveText(lang === 'ru' ? 'Участие и результат' : 'Participation and outcome');
        await expect(heading).toHaveCSS('font-size', 14 * scale + 'px');
        await expect(heading).toHaveCSS('font-weight', '500');
        await expect(heading).toHaveCSS('font-family', 'Manrope, Arial, sans-serif');
      }
    }
  }
});

test('archival status remains readable on the textured open field in both themes', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Color contrast is independent of the explicit viewport matrix.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/design-system/', { waitUntil: 'domcontentloaded' });
  for (const theme of ['light', 'dark']) {
    await page.evaluate((theme) => localStorage.setItem('oda-theme', theme), theme);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const contrast = await page.evaluate(async (theme) => {
      document.documentElement.dataset.theme = theme;
      await document.fonts.ready;
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      const label = document.querySelector('.status[data-status="archive"]')!;
      const probe = document.createElement('span');
      probe.style.setProperty('transition', 'none', 'important');
      document.body.append(probe);
      const cs = getComputedStyle(document.documentElement);
      const rgba = (value: string) => {
        probe.style.color = value;
        return getComputedStyle(probe)
          .color.match(/[\d.]+/g)!
          .map(Number);
      };
      const foreground = rgba(getComputedStyle(label).color);
      const background = rgba(cs.getPropertyValue('--bg'));
      const texture = rgba(cs.getPropertyValue('--texture-dot'));
      probe.remove();
      const composite = background
        .slice(0, 3)
        .map((value, i) => texture[i] * texture[3] + value * (1 - texture[3]));
      const luminance = (rgb: number[]) =>
        rgb
          .slice(0, 3)
          .map((value) => {
            const c = value / 255;
            return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
          })
          .reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
      const ratio = (back: number[]) => {
        const a = luminance(foreground),
          b = luminance(back);
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      };
      return Math.min(ratio(background), ratio(composite));
    }, theme);
    expect(contrast, theme + ' archival status').toBeGreaterThanOrEqual(4.5);
  }
});
