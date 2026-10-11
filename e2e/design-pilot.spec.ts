import { expect, test } from '@playwright/test';

for (const lang of ['ru', 'en'])
  for (const theme of ['light', 'dark']) {
    test(
      'pilot macro functions and internal tracks · ' + lang + ' · ' + theme,
      async ({ page, isMobile }) => {
        test.skip(isMobile, 'The explicit matrix includes mobile widths.');
        test.setTimeout(120_000);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.route('**/*', (route) =>
          ['image', 'media'].includes(route.request().resourceType()) ? route.abort() : route.continue(),
        );
        for (const route of ['education', 'cooperation', 'recognition']) {
          await page.goto('/' + lang + '/' + route + '/', { waitUntil: 'domcontentloaded' });
          await page.evaluate(() => document.fonts.ready);
          for (const width of [390, 700, 701, 797, 908, 1440, 1920])
            for (const scale of [1, 1.125]) {
              await page.setViewportSize({ width, height: 932 });
              const errors = await page.evaluate(
                async ({ theme, scale, route }) => {
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.style.setProperty('--type-scale', String(scale));
                  await new Promise<void>((r) =>
                    requestAnimationFrame(() => requestAnimationFrame(() => r())),
                  );
                  const problems: string[] = [];
                  const rect = (node: Element) => node.getBoundingClientRect();
                  const close = (a: number, b: number, name: string) => {
                    if (Math.abs(a - b) > 1) problems.push(name + ': ' + a + ' / ' + b);
                  };
                  const expected =
                    route === 'education'
                      ? 'catalogue,editorial,document'
                      : route === 'cooperation'
                        ? 'editorial,editorial,document,process,action'
                        : 'catalogue';
                  const blocks = [...document.querySelectorAll<HTMLElement>('main .macro-section')];
                  if (blocks.map((b) => b.dataset.blockKind).join(',') !== expected)
                    problems.push('macro roles');
                  if (document.documentElement.scrollWidth > innerWidth) problems.push('overflow');
                  for (const block of blocks) {
                    const body = block.querySelector(':scope > .section-body')!;
                    const heading = body.querySelector('h2')!;
                    if (block.getAttribute('aria-labelledby') !== heading.id)
                      problems.push('section heading');
                    const bg = getComputedStyle(body, '::before').backgroundColor;
                    if ((bg === 'rgba(0, 0, 0, 0)') !== (block.dataset.blockKind !== 'process'))
                      problems.push('surface');
                    const next = heading.closest('header')!.nextElementSibling;
                    if (next)
                      close(
                        rect(next).top - rect(heading.closest('header')!).bottom,
                        32,
                        'heading / material gap',
                      );
                    const aside = block.querySelector(':scope > aside');
                    if (aside && !(body.compareDocumentPosition(aside) & Node.DOCUMENT_POSITION_FOLLOWING))
                      problems.push('reading order');
                    if (
                      innerWidth <= 700 &&
                      aside &&
                      getComputedStyle(aside).display !== 'none' &&
                      rect(aside).height > 0 &&
                      rect(aside).top < rect(body).bottom - 1
                    )
                      problems.push('reference overlaps');
                  }
                  const alignTracks = (selector: string, tracks: string[]) => {
                    const rows = new Map<number, Element[]>();
                    document.querySelectorAll(selector).forEach((card) => {
                      const key = Math.round(rect(card).top);
                      rows.set(key, [...(rows.get(key) ?? []), card]);
                    });
                    rows.forEach((cards) =>
                      cards.forEach((card) => {
                        tracks.forEach((track) =>
                          close(
                            rect(card.querySelector(track)!).top,
                            rect(cards[0].querySelector(track)!).top,
                            'shared ' + track,
                          ),
                        );
                        const elements = tracks.map((track) => card.querySelector(track)!);
                        for (let i = 1; i < elements.length; i++)
                          if (rect(elements[i]).top < rect(elements[i - 1]).bottom - 1)
                            problems.push('track overlap');
                      }),
                    );
                  };
                  alignTracks('.programme-grid > .programme-card', [
                    '.programme-card__meta',
                    'h3',
                    '.programme-card__link > p',
                  ]);
                  alignTracks('.process-steps > li', ['h3', 'p']);
                  document.querySelectorAll('.recognition-card').forEach((card) => {
                    const preview = card.querySelector(
                      '.recognition-card__image, .recognition-card__missing',
                    )!;
                    close(rect(preview).width, rect(preview).height, 'preview ratio');
                    const grid = card.parentElement!;
                    const min = 256 * scale;
                    if (rect(card).width + 1 < Math.min(rect(grid).width, min))
                      problems.push('narrow recognition');
                    const image = preview.querySelector('img');
                    if (
                      image &&
                      (getComputedStyle(image).objectFit !== 'contain' ||
                        !image.getAttribute('width') ||
                        !image.getAttribute('height'))
                    )
                      problems.push('scan geometry lost');
                  });
                  return problems;
                },
                { theme, scale, route },
              );
              expect(errors, [lang, theme, route, width, scale].join(' ')).toEqual([]);
            }
        }
      },
    );
  }

test('stand uses the same card/media rules; disclosure preserves access and credits', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/ru/works/');
  const gap = await page
    .locator('.work-grid')
    .first()
    .evaluate((el) => getComputedStyle(el).gap);
  await page.goto('/design-system/');
  expect(
    await page
      .locator('.work-grid')
      .first()
      .evaluate((el) => getComputedStyle(el).gap),
  ).toBe(gap);
  await expect(page.locator('#system-media-states .media-figure[data-fit="natural"]')).toHaveCount(2);
  expect(
    await page
      .locator('#system-media-states img')
      .first()
      .evaluate((el) => getComputedStyle(el).objectFit),
  ).not.toBe('cover');
  const sample = page.locator('#media-register-comparison .media-figure').last();
  const details = sample.locator('details');
  await expect(details).not.toHaveAttribute('open');
  await details.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  await expect(details).toContainText('IMG / rings');
  await expect(details).toContainText('px');
  expect(
    await sample.evaluate((el) => {
      const caption = el.querySelector('figcaption')!;
      const register = el.querySelector('details')!;
      return !!(caption.compareDocumentPosition(register) & Node.DOCUMENT_POSITION_FOLLOWING);
    }),
  ).toBe(true);
  await sample.locator('[data-lightbox]').click();
  await expect(page.locator('.lightbox')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(sample.locator('[data-lightbox]')).toBeFocused();
});

test('programme fallback preserves complete long titles and natural flow', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Fallback is simulated at explicit mobile and desktop widths.');
  await page.goto('/en/education/');
  await page.addStyleTag({
    content:
      '.programme-grid > .programme-card, .programme-grid > .programme-card > .programme-card__link { grid-row: auto; grid-template-rows: none; }',
  });
  await page
    .locator('.programme-card h3')
    .first()
    .evaluate(
      (el) =>
        (el.textContent =
          'A longer programme title about perception, participation and feedback between people'),
    );
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 932 });
    await page.evaluate(
      () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))),
    );
    expect(
      await page.locator('.programme-card').evaluateAll((cards) =>
        cards.every((card) => {
          const h = card.querySelector('h3')!;
          const p = card.querySelector('p')!;
          return (
            h.getBoundingClientRect().bottom <= p.getBoundingClientRect().top &&
            getComputedStyle(h).overflow === 'visible' &&
            card.getBoundingClientRect().right <= innerWidth
          );
        }),
      ),
    ).toBe(true);
  }
});

test('contextual notes have a distinct italic face while metadata stays upright', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Explicit mobile/tablet/desktop widths run once.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const lang of ['ru', 'en']) {
    await page.goto('/' + lang + '/cooperation/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('#project-brief .section-rail__folio')).toHaveText('05');
    for (const width of [390, 797, 1440])
      for (const theme of ['light', 'dark']) {
        await page.setViewportSize({ width, height: 932 });
        const errors = await page.evaluate(async (theme) => {
          document.documentElement.dataset.theme = theme;
          await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
          const errors: string[] = [];
          const notes = [...document.querySelectorAll<HTMLElement>('.reading-note')];
          if (notes.length < 2) errors.push('missing reading notes');
          for (const note of notes) {
            const style = getComputedStyle(note);
            if (
              style.fontStyle !== 'italic' ||
              parseFloat(style.fontSize) !== 12 ||
              Math.abs(parseFloat(style.lineHeight) - 19.2) > 0.1
            )
              errors.push('note role');
            if (!document.fonts.check(style.font, note.textContent!)) errors.push('italic font not loaded');
            const previous = note.previousElementSibling!;
            if (note.getBoundingClientRect().top - previous.getBoundingClientRect().bottom < 15)
              errors.push('note separation');
            if (note.getBoundingClientRect().right > innerWidth) errors.push('note overflow');
          }
          document.querySelectorAll('.small-note:not(.reading-note), .meta').forEach((note) => {
            if (getComputedStyle(note).fontStyle !== 'normal') errors.push('metadata became italic');
          });
          return errors;
        }, theme);
        expect(errors, lang + ' ' + theme + ' ' + width).toEqual([]);
      }
  }
});
