import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';

const records = JSON.parse(
  execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
  import { loadSiteModule } from './scripts/site-data.mjs';
  const data = await loadSiteModule();
  console.log(JSON.stringify(data.works.map(work => ({slug:work.slug, story:work.story.length, credits:work.credits.length}))));
`,
    ],
    { encoding: 'utf8', windowsHide: true },
  ),
) as { slug: string; story: number; credits: number }[];

test('every selected work has a readable story, attributed roles and direct contact in both languages', async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/*', (route) => {
    if (['image', 'media'].includes(route.request().resourceType())) return route.abort();
    return route.continue();
  });
  for (const lang of ['ru', 'en'])
    for (const record of records) {
      await page.goto(`/${lang}/works/${record.slug}/`);
      await expect(page.locator('#work-story .editorial-sections > article')).toHaveCount(record.story);
      await expect(page.locator('#work-credits .list-row')).toHaveCount(record.credits);
      for (const paragraph of await page.locator('#work-story .editorial-sections p').allTextContents())
        expect(paragraph.trim().length).toBeGreaterThan(80);
      await expect(page.locator('#work-availability .button')).toHaveAttribute('href', `/${lang}/contact/`);
      const errors = await page.evaluate(() => {
        const problems = [];
        if (document.documentElement.scrollWidth > innerWidth) problems.push('overflow');
        document.querySelectorAll('.editorial-sections article').forEach((article) => {
          const h = article.querySelector('h3')!.getBoundingClientRect();
          const p = article.querySelector('p')!.getBoundingClientRect();
          if (p.top - h.bottom < 12) problems.push('story heading/body gap');
        });
        return problems;
      });
      expect(errors, `${lang}/${record.slug}`).toEqual([]);
    }
});

test('studio has separate biographies, educational roles, live dossiers and exact merged entrances', async ({
  page,
}) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/studio/`);
    await expect(page.locator('#people article.list-row')).toHaveCount(2);
    await expect(page.locator('#person-olga')).toContainText(
      lang === 'ru' ? 'Ольга Арабова' : 'Olga Arabova',
    );
    await expect(page.locator('#person-daler')).toContainText(
      lang === 'ru' ? 'Далер Арабов' : 'Daler Arabov',
    );
    await expect(page.locator('#teaching .list-row')).toHaveCount(3);
    await expect(page.locator('#materials .list-row')).toHaveCount(4);
    await expect(page.locator('#materials a[download]')).toHaveCount(0);
    await page.goto(`/?id=event-sber-lecture-2025&lang=${lang}`);
    await expect(page).toHaveURL(new RegExp(`/${lang}/studio/#teaching-sber$`));
    await expect(page.locator('#teaching-sber')).toBeVisible();
    await page.goto(`/?id=emomandala-os&lang=${lang}`);
    await expect(page).toHaveURL(new RegExp(`/${lang}/works/emomandala/#work-story-selection$`));
    await expect(page.locator('#work-story-selection')).toContainText('p5.js');
  }
});
