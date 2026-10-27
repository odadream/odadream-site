import { test, expect } from '@playwright/test';

test('chronology shares baseline and rhythm in real consumers and the specimen', async ({ page }) => {
  for (const width of [390, 797, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ['light', 'dark']) {
      const gaps: number[] = [];
      for (const route of [
        '/ru/#timeline',
        '/ru/works/mindshow/#work-context',
        '/ru/cases/',
        '/design-system/#system-chronology',
      ]) {
        await page.goto(route);
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value;
        }, theme);
        await page.evaluate(() => document.fonts.ready);
        const root = route.includes('design-system')
          ? '.chronology'
          : route.includes('mindshow')
            ? '#work-context .chronology'
            : route.includes('cases')
              ? '[data-case-archive] .chronology'
              : '#timeline .chronology';
        const metrics = await page
          .locator(root)
          .first()
          .evaluate((list) => {
            const rows = [...list.querySelectorAll<HTMLElement>('.case-row:not([hidden])')];
            return {
              gap: parseFloat(getComputedStyle(list).rowGap),
              rows: rows.map((row) => {
                const year = row.querySelector<HTMLElement>('.case-row__year')!;
                const title = row.querySelector<HTMLElement>('h3')!;
                const baseline = (element: HTMLElement) => {
                  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
                  let text = walker.nextNode();
                  while (text && !text.textContent?.trim()) text = walker.nextNode();
                  if (!text) throw new Error('Missing baseline text');
                  const start = text.textContent!.search(/\S/);
                  const range = document.createRange();
                  range.setStart(text, start);
                  range.setEnd(text, start + 1);
                  const style = getComputedStyle(text.parentElement!);
                  const canvas = document.createElement('canvas').getContext('2d')!;
                  canvas.font = style.font;
                  return (
                    range.getBoundingClientRect().bottom - canvas.measureText('Hg').fontBoundingBoxDescent
                  );
                };
                return {
                  baseline: Math.abs(baseline(year) - baseline(title)),
                  gap: title.getBoundingClientRect().left - year.getBoundingClientRect().right,
                  copyGap: getComputedStyle(row.querySelector('.case-row__body > p:last-child')!).marginTop,
                  right: row.getBoundingClientRect().right,
                };
              }),
              overflow: document.documentElement.scrollWidth > innerWidth,
            };
          });
        expect(metrics.overflow).toBe(false);
        for (const row of metrics.rows) {
          expect(row.baseline, `${route}, ${width}, ${theme}`).toBeLessThanOrEqual(1);
          expect(row.gap).toBeGreaterThan(0);
          expect(row.copyGap).toBe('4px');
          expect(row.right).toBeLessThanOrEqual(width);
        }
        gaps.push(metrics.gap);
      }
      expect(new Set(gaps).size).toBe(1);
    }
  }
});

test('shared controls retain keyboard semantics, hit areas and parameter propagation', async ({ page }) => {
  await page.goto('/design-system/#system-controls');
  const controls = page.locator('#system-controls');
  const photo = controls.getByRole('checkbox', { name: 'Фотографии' });
  await photo.focus();
  await page.keyboard.press('Space');
  await expect(photo).not.toBeChecked();
  const firstRadio = controls.getByRole('radio', { name: 'Сначала новые' });
  await firstRadio.focus();
  await page.keyboard.press('ArrowDown');
  await expect(controls.getByRole('radio', { name: 'Сначала ранние' })).toBeChecked();
  for (const width of [390, 797, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ['dark', 'light']) {
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
      }, theme);
      const geometry = await controls.evaluate((root) => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        heights: [
          ...root.querySelectorAll(
            'input:not([type=checkbox]):not([type=radio]), select, textarea, .control-choice',
          ),
        ].map((element) => element.getBoundingClientRect().height),
        labelGap: getComputedStyle(root.querySelector('.control-field')!).rowGap,
        rangeBorder: getComputedStyle(root.querySelector('input[type=range]')!).borderTopWidth,
      }));
      expect(geometry.overflow).toBe(false);
      expect(geometry.heights.every((height) => height >= 44)).toBe(true);
      expect(geometry.labelGap).toBe('4px');
      expect(geometry.rangeBorder).toBe('0px');
    }
  }
  for (const route of ['/design-system/#system-controls', '/ru/cases/']) {
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.style.setProperty('--control-pad', '13px');
    });
    expect(
      await page
        .locator('.select-control > select')
        .first()
        .evaluate((select) => getComputedStyle(select).paddingLeft),
    ).toBe('13px');
  }
});
