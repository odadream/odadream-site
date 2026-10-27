import { expect, test } from '@playwright/test';

const samples = [
  { route: 'cooperation/', selector: '.list-row > div > p:not(.small-note)', role: 'body' },
  { route: 'education/', selector: '.programme-card__link > p', role: 'summary' },
  { route: 'works/', selector: '.work-card__link > p', role: 'summary' },
  {
    route: 'cases/',
    selector: '.case-row__body > p:not(.small-note):not(.meta)',
    role: 'summary',
  },
  { route: 'recognition/', selector: '.recognition-card__claim', role: 'claim' },
  { route: 'works/oda-rings/', selector: '.editorial-sections article > p', role: 'body' },
];
// Managed quick checks limit page families, never themes, widths or profile perturbations.
// Full/release clear the override; ordinary direct runs retain the complete matrix.
const requestedFamilies = (process.env.ODA_E2E_READING_FAMILIES ?? '').split(',').filter(Boolean);
for (const family of requestedFamilies)
  if (!samples.some((sample) => sample.route === family)) throw Error('Unknown reading family: ' + family);
const selectedSamples = requestedFamilies.length
  ? samples.filter((sample) => requestedFamilies.includes(sample.route))
  : samples;

for (const lang of ['ru', 'en'])
  for (const theme of ['light', 'dark']) {
    test('reading roles and profile perturbations · ' + lang + ' · ' + theme, async ({ page, isMobile }) => {
      test.skip(isMobile, 'The explicit width matrix includes mobile widths.');
      test.setTimeout(120_000);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.route('**/*', (route) =>
        ['image', 'media'].includes(route.request().resourceType()) ? route.abort() : route.continue(),
      );
      for (const width of [390, 797, 1440, 1920]) {
        await page.setViewportSize({ width, height: 932 });
        for (const sample of selectedSamples) {
          await page.goto('/' + lang + '/' + sample.route, { waitUntil: 'load' });
          await page.evaluate(() => document.fonts.ready);
          for (const scale of [1, 1.125])
            for (const space of [4, 5])
              for (const measure of [66, 44]) {
                const errors = await page.evaluate(
                  async ({ sample, width, theme, scale, space, measure }) => {
                    const root = document.documentElement;
                    root.dataset.theme = theme;
                    root.style.setProperty('--type-scale', String(scale));
                    root.style.setProperty('--space-unit', space + 'px');
                    root.style.setProperty('--copy-measure', measure + 'ch');
                    await new Promise<void>((resolve) =>
                      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
                    );
                    const problems: string[] = [];
                    const close = (a: number, b: number, label: string) => {
                      if (Math.abs(a - b) > 1) problems.push(label + ': ' + a + ' / ' + b);
                    };
                    const nodes = [...document.querySelectorAll<HTMLElement>(sample.selector)];
                    if (!nodes.length) problems.push('missing live reading sample');
                    // A profile mutation can request a new font instance after the page's initial ready.
                    // Compare ch metrics only after that instance is available to both node and ruler.
                    if (nodes[0]) await document.fonts.load(getComputedStyle(nodes[0]).font, '0');
                    await document.fonts.ready;
                    const size = (sample.role === 'body' ? (width <= 700 ? 14 : 16) : 14) * scale;
                    const leading = sample.role === 'body' ? 1.68 : 1.6;
                    for (const node of nodes) {
                      const style = getComputedStyle(node);
                      close(parseFloat(style.fontSize), size, 'reading size');
                      close(parseFloat(style.lineHeight), size * leading, 'reading leading');
                      const ruler = document.createElement('div');
                      ruler.style.position = 'absolute';
                      ruler.style.font = style.font;
                      ruler.style.width = 'var(--copy-measure)';
                      document.body.append(ruler);
                      close(
                        parseFloat(style.maxWidth),
                        ruler.getBoundingClientRect().width,
                        'copy measure ' +
                          JSON.stringify({
                            font: style.font,
                            family: style.fontFamily,
                            size: style.fontSize,
                            rulerFont: getComputedStyle(ruler).font,
                          }),
                      );
                      ruler.remove();
                      const range = document.createRange();
                      range.selectNodeContents(node);
                      if (range.getBoundingClientRect().right > node.getBoundingClientRect().right + 1)
                        problems.push('text crosses its column');
                    }
                    document
                      .querySelectorAll('.case-row__metadata > p, .recognition-card > .meta')
                      .forEach((node) =>
                        close(parseFloat(getComputedStyle(node).fontSize), 11 * scale, 'metadata size'),
                      );
                    document.querySelectorAll<HTMLElement>('.section').forEach((section) => {
                      const afterIntro = section.previousElementSibling?.matches('.page-intro');
                      const style = getComputedStyle(section);
                      close(
                        parseFloat(style.paddingTop),
                        afterIntro ? 0 : (width <= 700 ? 10 : 16) * space,
                        'single chapter interval',
                      );
                      if (section.nextElementSibling)
                        close(parseFloat(style.paddingBottom), 0, 'no doubled chapter interval');
                    });
                    document
                      .querySelectorAll('.section-body .section-body')
                      .forEach((node) =>
                        close(parseFloat(getComputedStyle(node).paddingTop), 0, 'no repeated nested padding'),
                      );
                    document
                      .querySelectorAll<HTMLElement>('.recognition-grid, .programme-grid')
                      .forEach((grid) => {
                        const ruler = document.createElement('div');
                        ruler.style.width = grid.matches('.recognition-grid')
                          ? 'var(--recognition-tile-min)'
                          : 'var(--programme-tile-min)';
                        ruler.style.position = 'absolute';
                        document.body.append(ruler);
                        const minimum = Math.min(
                          grid.getBoundingClientRect().width,
                          ruler.getBoundingClientRect().width,
                        );
                        ruler.remove();
                        for (const card of grid.children)
                          if (card.getBoundingClientRect().width < minimum - 1)
                            problems.push('card below reading minimum');
                      });
                    if (document.documentElement.scrollWidth > innerWidth)
                      problems.push('horizontal overflow');
                    const action = document.querySelector<HTMLElement>('.menu-toggle');
                    if (
                      action &&
                      getComputedStyle(action).display !== 'none' &&
                      action.getBoundingClientRect().height < 44
                    )
                      problems.push('tap target shrank');
                    return problems;
                  },
                  { sample, width, theme, scale, space, measure },
                );
                expect(
                  errors,
                  sample.route + ' ' + width + ' ' + scale + '/' + space + '/' + measure,
                ).toEqual([]);
              }
          const independent = await page.evaluate(async (sample) => {
            const root = document.documentElement;
            root.style.setProperty('--type-body', '18px');
            root.style.setProperty('--type-summary', '17px');
            root.style.setProperty('--type-claim', '18px');
            root.style.setProperty('--type-metadata', '12px');
            await new Promise<void>((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
            );
            const expected = sample.role === 'summary' ? 17 : 18;
            const problems: string[] = [];
            document.querySelectorAll(sample.selector).forEach((node) => {
              if (parseFloat(getComputedStyle(node).fontSize) !== expected)
                problems.push(
                  'independent reading role: ' + getComputedStyle(node).fontSize + ' / ' + expected,
                );
            });
            document
              .querySelectorAll(
                '.work-card__category, .work-card__year, .programme-card .meta, .case-row__metadata > p, .recognition-card > .meta',
              )
              .forEach((node) => {
                if (parseFloat(getComputedStyle(node).fontSize) !== 12)
                  problems.push('independent metadata role');
              });
            return problems;
          }, sample);
          expect(independent, sample.route + ' independent roles').toEqual([]);
        }
        await page.goto('/' + lang + '/', { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        for (const scale of [1, 1.125])
          for (const space of [4, 5])
            for (const measure of [66, 44]) {
              const errors = await page.evaluate(
                async ({ theme, scale, space, measure }) => {
                  const root = document.documentElement;
                  root.dataset.theme = theme;
                  root.style.setProperty('--type-scale', String(scale));
                  root.style.setProperty('--space-unit', space + 'px');
                  root.style.setProperty('--copy-measure', measure + 'ch');
                  await new Promise<void>((resolve) =>
                    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
                  );
                  const problems: string[] = [];
                  const slides = [...document.querySelectorAll<HTMLElement>('.nm-slide')];
                  const hidden = slides.map((slide) => slide.hidden);
                  for (const active of slides) {
                    slides.forEach((slide) => {
                      slide.hidden = slide !== active;
                    });
                    const heading = document.querySelector('.nm-heading')!.getBoundingClientRect();
                    const caption = active.querySelector('.nm-work-caption')!.getBoundingClientRect();
                    if (heading.bottom > caption.top) problems.push('hero heading overlaps work caption');
                  }
                  slides.forEach((slide, index) => {
                    slide.hidden = hidden[index];
                  });
                  if (root.scrollWidth > innerWidth) problems.push('hero horizontal overflow');
                  return problems;
                },
                { theme, scale, space, measure },
              );
              expect(errors, 'hero ' + width + ' ' + scale + '/' + space + '/' + measure).toEqual([]);
            }
      }
    });
  }

test('specimen token readouts follow live profile and mobile roles', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 932 });
  await page.goto('/design-system/');
  await expect(page.locator('[data-css-token="--type-body"]')).toContainText('16px');
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--copy-measure', '44ch');
    document.documentElement.style.setProperty('--type-summary', '17px');
  });
  await expect(page.locator('[data-css-token="--copy-measure"]')).toHaveText('44ch');
  await expect(page.locator('#system-02 .copy-summary')).toHaveCSS('font-size', '17px');
  await page.setViewportSize({ width: 390, height: 932 });
  await expect(page.locator('[data-css-token="--type-body"]')).toContainText('14px');
});
