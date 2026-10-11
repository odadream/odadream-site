import { expect, test } from '@playwright/test';

import { execFileSync } from 'node:child_process';

const routes: string[] = JSON.parse(
  execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
  import { loadSiteModule } from './scripts/site-data.mjs';
  const data = await loadSiteModule();
  const { createPages } = await loadSiteModule('src/lib/routes.ts');
  console.log(JSON.stringify(createPages(data).map((page) => page.path)));
`,
    ],
    { windowsHide: true, encoding: 'utf8' },
  ),
);

const widths = [360, 390, 601, 700, 701, 797, 900, 901, 908, 1440, 1600, 1601, 1920];

for (const theme of ['light', 'dark']) {
  test(`complete responsive axes and inner tracks across every editorial page · ${theme}`, async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Explicit viewport matrix runs once on desktop Chromium.');
    test.setTimeout(600_000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // This matrix checks layout axes; loading every poster and image across the editorial routes exhausts Chromium.
    await page.route('**/*', (route) => {
      if (['image', 'media'].includes(route.request().resourceType())) return route.abort();
      return route.continue();
    });
    const folioSizes = new Map<number, Set<string>>();
    for (const route of [...routes, '/design-system/']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);
      for (const width of widths) {
        // CDP updates innerWidth before Chromium finishes dispatching resize/style invalidation.
        // Synchronize with the browser event, then measure after fonts and two rendering frames.
        if (page.viewportSize()?.width !== width) {
          await page.evaluate(() => {
            delete document.documentElement.dataset.qaResize;
            window.addEventListener(
              'resize',
              () => {
                document.documentElement.dataset.qaResize = String(innerWidth);
              },
              { once: true },
            );
          });
          await page.setViewportSize({ width, height: 932 });
          await page.waitForFunction(
            (value) => document.documentElement.dataset.qaResize === String(value),
            width,
          );
        }
        const errors = await page.evaluate(
          async ({ theme, width }) => {
            document.documentElement.dataset.theme = theme;
            await document.fonts.ready;
            await new Promise<void>((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
            );
            const problems: string[] = [];
            const rect = (e: Element) => e.getBoundingClientRect();
            const same = (a: number, b: number, name: string) => {
              if (Math.abs(a - b) > 1) problems.push(`${name}: ${a} / ${b}`);
            };
            const shell = rect(document.querySelector('.header-inner')!);
            same(innerWidth, width, 'viewport stabilization');
            document.querySelectorAll('.macro-section__label > .section-label').forEach((label) => {
              const heading = label.closest('.macro-section')?.querySelector('h2');
              if (innerWidth > 700 && heading)
                same(
                  rect(label.firstElementChild!).top - rect(heading).top,
                  parseFloat(
                    getComputedStyle(document.documentElement).getPropertyValue('--label-optical-offset'),
                  ),
                  'macro label / first heading line',
                );
            });
            document.querySelectorAll('.programme-grid, .process-steps, .work-grid').forEach((grid) => {
              const rows = new Map<number, Element[]>();
              [...grid.children].forEach((item) => {
                const key = Math.round(rect(item).top);
                rows.set(key, [...(rows.get(key) ?? []), item]);
              });
              rows.forEach((items) => {
                if (items.length < 2) return;
                for (const selector of ['h3', ':scope > a > p, :scope > p']) {
                  const parts = items.map((item) => item.querySelector(selector));
                  if (!parts.every(Boolean)) problems.push('missing shared track ' + selector);
                  else
                    parts.forEach((part) =>
                      same(rect(part!).top, rect(parts[0]!).top, 'shared row track ' + selector),
                    );
                }
              });
            });
            if (document.documentElement.scrollWidth > innerWidth) problems.push('horizontal overflow');
            document.querySelectorAll('.shell').forEach((e) => {
              const r = rect(e);
              same(r.left, shell.left, 'shell left');
              same(r.right, shell.right, 'shell right');
            });
            document.querySelectorAll('.section-body, .system-content').forEach((e) => {
              const r = rect(e),
                first = e.firstElementChild;
              if (first) same(rect(first).left, r.left, 'material axis');
              const wide = e.parentElement?.matches('.macro-section[data-layout="wide"]');
              same(
                r.left,
                wide ? shell.left : rect(document.querySelector('.footer-links')!).left,
                'material axis by layout',
              );
            });
            document.querySelectorAll('.work-main').forEach((e) => {
              same(rect(e).left, rect(document.querySelector('.footer-links')!).left, 'work / footer axis');
              same(rect(e).right, shell.right, 'work right edge');
            });
            const heading = document.querySelector('.nm-heading');
            if (heading) {
              same(rect(heading).left, shell.left, 'hero heading');
              const hero = rect(document.querySelector('.nm-hero')!);
              const data = rect(document.querySelector('.nm-data-panel')!);
              const probe = document.createElement('div');
              probe.style.paddingTop = 'var(--intro-space-start)';
              document.body.append(probe);
              const introStart = parseFloat(getComputedStyle(probe).paddingTop);
              probe.remove();
              same(rect(heading).top - hero.top, introStart, 'hero top');
              document.querySelectorAll('.nm-slide').forEach((slide) => {
                // Inspect every caption, not just whichever shuffled frame is visible.
                const wasHidden = slide.hasAttribute('hidden');
                slide.removeAttribute('hidden');
                const caption = rect(slide.querySelector('.nm-work-caption')!);
                const link = slide.querySelector('.nm-caption-link');
                same(caption.left, shell.left, 'hero caption');
                if (link) same(rect(link).left, shell.left, 'hero link');
                if (innerWidth > 700) {
                  same(data.right, shell.right, 'hero data');
                  same(caption.bottom, data.bottom, 'hero bottom');
                  if (caption.right > data.left) problems.push('hero columns overlap');
                }
                if (rect(heading).bottom > caption.top) problems.push('hero heading overlaps caption');
                if (wasHidden) slide.setAttribute('hidden', '');
              });
            }
            return problems;
          },
          { theme, width },
        );
        expect(errors, `${route}, ${theme}, ${width}px`).toEqual([]);
        if (width > 700) {
          const sizes = await page
            .locator('.section-rail__folio')
            .evaluateAll((nodes) => nodes.map((n) => getComputedStyle(n).fontSize));
          const set = folioSizes.get(width) ?? new Set<string>();
          sizes.forEach((s) => set.add(s));
          folioSizes.set(width, set);
        }
      }
    }
    folioSizes.forEach((sizes, width) => expect(sizes.size, `${width}px folio scale`).toBe(1));
  });
}
