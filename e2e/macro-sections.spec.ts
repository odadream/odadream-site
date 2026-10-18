import { expect, test } from '@playwright/test';

for (const theme of ['light', 'dark']) {
  test('macro roles, fields and reading order · ' + theme, async ({ page, isMobile }) => {
    test.skip(isMobile, 'The explicit width matrix runs once on desktop Chromium.');
    test.setTimeout(90_000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript((value) => localStorage.setItem('oda-theme', value), theme);
    await page.goto('/design-system/');
    await page.evaluate((value) => document.documentElement.setAttribute('data-theme', value), theme);
    await page.evaluate(() => document.fonts.ready);
    for (const width of [390, 700, 701, 797, 908, 1440, 1920]) {
      await page.setViewportSize({ width, height: 932 });
      await page.evaluate(
        () =>
          new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
      );
      const problems = await page.evaluate(() => {
        const errors: string[] = [];
        const close = (a: number, b: number, label: string) => {
          if (Math.abs(a - b) > 1) errors.push(label + ': ' + a + ' / ' + b);
        };
        const visible = (node: Element | null) =>
          !!node && getComputedStyle(node).display !== 'none' && node.getBoundingClientRect().height > 0;
        const shell = document.querySelector('.header-inner')!.getBoundingClientRect();
        const grid = document.querySelector('.section-grid, .system-grid')!;
        const style = getComputedStyle(grid);
        const axis = {
          left:
            grid.getBoundingClientRect().left +
            (innerWidth > 700 ? parseFloat(style.gridTemplateColumns) + parseFloat(style.columnGap) : 0),
        };
        const blocks = [...document.querySelectorAll<HTMLElement>('.macro-section')];
        if (
          blocks.map((b) => b.dataset.blockKind).join(',') !==
          'catalogue,editorial,process,document,action,editorial'
        )
          errors.push('missing macro role');
        if (document.documentElement.scrollWidth > innerWidth) errors.push('horizontal overflow');
        for (const block of blocks) {
          const kind = block.dataset.blockKind!;
          const body = block.querySelector<HTMLElement>(':scope > .section-body')!;
          const heading = body.querySelector('h2')!;
          const bounds = body.getBoundingClientRect();
          close(
            bounds.left,
            block.dataset.layout === 'wide' ? shell.left : axis.left,
            kind + ' material axis',
          );
          close(bounds.right, shell.right, kind + ' material right');
          close(heading.getBoundingClientRect().left, bounds.left, kind + ' title axis');
          const background = getComputedStyle(body, '::before').backgroundColor;
          if ((background === 'rgba(0, 0, 0, 0)') !== (kind !== 'process')) errors.push(kind + ' surface');
          body.querySelectorAll('.section-body').forEach((nested) => {
            if (getComputedStyle(nested, '::before').backgroundColor !== 'rgba(0, 0, 0, 0)')
              errors.push('repeated nested surface');
          });
          const reference = block.querySelector<HTMLElement>(':scope > aside');
          if (reference && !(body.compareDocumentPosition(reference) & Node.DOCUMENT_POSITION_FOLLOWING))
            errors.push('reference precedes material');
          const code = body.querySelector('.macro-section__code');
          if (visible(code) !== (innerWidth <= 700 || block.dataset.field === 'none'))
            errors.push(kind + ' heading code');
          if (innerWidth <= 700) {
            if (visible(block.querySelector('.section-rail__field'))) errors.push('mobile folio is visible');
            if (block.querySelector('.section-rail__data, [data-has-reference]')) {
              if (!reference || !visible(reference)) errors.push('reference lost');
              else if (reference.getBoundingClientRect().top < bounds.bottom - 1)
                errors.push('mobile reference overlaps material');
            } else if (visible(reference)) errors.push(kind + ' empty mobile reference');
          }
        }
        return errors;
      });
      expect(problems, theme + ' ' + width + 'px').toEqual([]);
    }
  });
}
