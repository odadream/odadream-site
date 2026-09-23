import { expect, test } from '@playwright/test';

const sections = [
  'works',
  'formats',
  'cooperation',
  'studio',
  'cases',
  'contact',
  'technology',
  'recognition',
];
const works = [
  'interference-of-realities',
  'mindshow',
  'neurobattle',
  'project-schrodinger',
  'oda-rings',
  'sync-circle',
];
const cases = ['tsiolkovsky-festival-2026', 'tsiolkovsky-laboratory-2025', 'dano-2025', 'byob-2026'];
const routes = ['en', 'ru'].flatMap((lang) => [
  `/${lang}/`,
  ...sections.map((s) => `/${lang}/${s}/`),
  ...works.map((s) => `/${lang}/works/${s}/`),
  ...cases.map((s) => `/${lang}/cases/${s}/`),
]);

for (const width of [360, 797, 1529, 1920]) {
  test(`shared axes and folio scale at ${width}px across every public page`, async ({ page, isMobile }) => {
    test.skip(isMobile, 'Explicit viewport matrix runs once on desktop Chromium.');
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 912 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const folioSizes = new Set<string>();
    for (const route of [...routes, '/design-system/']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const errors = await page.evaluate(() => {
        const problems: string[] = [];
        const rect = (e: Element) => e.getBoundingClientRect();
        const same = (a: number, b: number, name: string) => {
          if (Math.abs(a - b) > 1) problems.push(`${name}: ${a} / ${b}`);
        };
        const shell = rect(document.querySelector('.header-inner')!);
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
          same(r.left, rect(document.querySelector('.footer-links')!).left, 'footer / material axis');
        });
        document.querySelectorAll('.work-main').forEach((e) => {
          same(rect(e).left, rect(document.querySelector('.footer-links')!).left, 'work / footer axis');
          same(rect(e).right, shell.right, 'work right edge');
        });
        const heading = document.querySelector('.nm-heading');
        if (heading) {
          same(rect(heading).left, shell.left, 'hero heading');
          const hero = rect(document.querySelector('.nm-hero')!);
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
            const link = rect(slide.querySelector('.nm-caption-link')!);
            const data = rect(slide.querySelector('.nm-data-panel')!);
            same(caption.left, shell.left, 'hero caption');
            same(link.left, shell.left, 'hero link');
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
      });
      expect(errors, route).toEqual([]);
      if (width > 700) {
        const sizes = await page
          .locator('.section-rail__folio')
          .evaluateAll((nodes) => nodes.map((n) => getComputedStyle(n).fontSize));
        sizes.forEach((s) => folioSizes.add(s));
      }
    }
    if (width > 700) expect(folioSizes.size).toBe(1);
  });
}
