import { test, expect } from '@playwright/test';
test('Neuromandala family keeps distinct galleries and a cross-work technology overview', async ({
  page,
}) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/works/`);
    const links = await page
      .locator('main .work-card__link')
      .evaluateAll((nodes) =>
        nodes.slice(0, 7).map((node) => node.getAttribute('href')!.split('/').filter(Boolean).pop()),
      );
    expect(links).toEqual([
      'interference-of-realities',
      'mindshow',
      'neuromandala',
      'project-schrodinger',
      'neurobattle',
      'cultural-neuro-code',
      'neurosynchronization',
    ]);
    await page.goto(`/${lang}/works/mindshow/`);
    await expect(page.locator('h1')).toContainText('MindShow');
    for (const id of [
      'event-bauman-lecture',
      'event-sber-lecture',
      'archive-gonchar-2024-lectures-gonchar',
      'archive-mindshow-byob-2019-mindgrid',
      'archive-byob-2020-projection-pentagon',
      'abrau-2026-157',
    ])
      await expect(page.locator(`main [data-media-id="${id}"]`)).toHaveCount(0);
    await page.goto(`/${lang}/technology/`);
    await expect(page.locator('#works-and-practices a[href$="/works/neuromandala/"]')).toHaveAttribute(
      'href',
      `/${lang}/works/neuromandala/`,
    );
    for (const id of ['method-raw-eeg', 'method-filtered-rhythms', 'method-power-timeline'])
      await expect(page.locator(`#signal-and-power [data-media-id="${id}"]`)).toHaveCount(1);
    for (const name of ['Muse 2', 'Muse S', 'NeuroPlay', 'Neiry Pro'])
      await expect(page.locator('#neurointerfaces')).toContainText(name);
  }
});
