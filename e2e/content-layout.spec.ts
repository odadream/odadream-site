import { expect, test } from '@playwright/test';

for (const width of [360, 797, 908, 1100, 1201, 1529]) {
  test(`narratives, filled passports and list rhythm at ${width}px`, async ({ page, isMobile }) => {
    test.skip(isMobile, 'Explicit viewport matrix runs once on desktop Chromium.');
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 932 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route('**/*', (route) => {
      if (['image', 'media'].includes(route.request().resourceType())) return route.abort();
      return route.continue();
    });
    for (const theme of ['dark', 'light']) {
      for (const path of [
        '/ru/cooperation/',
        '/en/cooperation/',
        '/ru/technology/',
        '/en/education/',
        '/ru/education/beautiful-about-the-brain/',
        '/en/works/mindshow/',
        '/ru/studio/',
        '/ru/works/emomandala/',
        '/en/works/emomandala/',
        '/design-system/',
      ]) {
        await page.goto(path, { waitUntil: 'domcontentloaded' });
        await page.evaluate(async (value) => {
          document.documentElement.dataset.theme = value;
          await document.fonts.ready;
        }, theme);
        const errors = await page.evaluate(() => {
          const problems: string[] = [];
          const rect = (node: Element) => node.getBoundingClientRect();
          const equal = (a: number, b: number, label: string) => {
            if (Math.abs(a - b) > 1) problems.push(`${label}: ${a} / ${b}`);
          };
          if (document.documentElement.scrollWidth > innerWidth) problems.push('horizontal overflow');
          document.querySelectorAll('.list-row:not(.case-row)').forEach((row) => {
            const children = [...row.children];
            if (children.length === 1) equal(rect(children[0]).width, rect(row).width, 'narrative width');
            else if (children.length === 3 && innerWidth <= 900)
              equal(rect(children[2]).left, rect(children[1]).left, 'record action / body axis');
          });
          document.querySelectorAll('.record-stamp > dl').forEach((stamp) => {
            const rows = new Map<number, DOMRect[]>();
            [...stamp.children].forEach((field) => {
              const r = rect(field),
                key = Math.round(r.top);
              rows.set(key, [...(rows.get(key) ?? []), r]);
            });
            rows.forEach((fields) => {
              equal(fields[0].left, rect(stamp).left, 'passport row start');
              equal(fields.at(-1)!.right, rect(stamp).right, 'passport row end');
              fields.forEach((field, index) => {
                equal(field.width, fields[0].width, 'balanced passport fields');
                if (index) equal(field.left - fields[index - 1].right, 1, 'shared passport edge');
              });
            });
          });
          document
            .querySelectorAll('.section-body > .facts, .system-content > .facts, .work-section > .facts')
            .forEach((list) => {
              const previous = list.previousElementSibling;
              if (previous && rect(list).top - rect(previous).bottom < 20)
                problems.push('heading / list gap missing');
            });
          document.querySelectorAll('.section-grid, .system-grid').forEach((section) => {
            const label = section.querySelector(
              ':scope > .section-label, :scope > .system-side > .section-label',
            );
            const heading = section.querySelector(
              ':scope > .section-body > h2:first-child, :scope > .system-content > h2:first-child',
            );
            if (!label || !heading) return;
            if (innerWidth > 700)
              equal(rect(label.firstElementChild!).top - rect(heading).top, 6, 'label / first heading line');
            else if (rect(label).bottom >= rect(heading).top) problems.push('mobile label overlaps material');
          });
          return problems;
        });
        expect(errors, `${path}, ${theme}, ${width}px`).toEqual([]);
      }
    }
  });
}
