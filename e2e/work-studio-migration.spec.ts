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
  console.log(JSON.stringify(data.works.map(work => ({slug:work.slug, story:work.projectSite ? 0 : work.story.length, paragraphs:work.projectSite ? [] : work.story.map(section => section.body), credits:work.credits.length > 1 ? work.credits.length : 0}))));
`,
    ],
    { encoding: 'utf8', windowsHide: true },
  ),
) as { slug: string; story: number; paragraphs: { ru: string; en: string }[]; credits: number }[];

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
      await expect(page.locator('.work-main .editorial-sections > article')).toHaveCount(record.story);
      await expect(page.locator('#work-credits .list-row')).toHaveCount(record.credits);
      const paragraphs = await page.locator('.work-main .editorial-sections p').allTextContents();
      expect(paragraphs.map((text) => text.trim())).toEqual(
        record.paragraphs.map((body) => body[lang as 'ru' | 'en'].trim()),
      );
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
    await expect(page.locator('#people .studio-biographies > article.list-row')).toHaveCount(2);
    await expect(page.locator('#person-olga')).toContainText(
      lang === 'ru' ? 'Ольга Арабова' : 'Olga Arabova',
    );
    await expect(page.locator('#person-daler')).toContainText(
      lang === 'ru' ? 'Далер Арабов' : 'Daler Arabov',
    );
    await expect(page.locator('#teaching')).toHaveCount(0);
    await expect(page.locator('#legal')).toBeVisible();
    await expect(page.locator('#materials .list-row')).toHaveCount(5);
    await expect(page.locator('#materials a[download]')).toHaveCount(0);
    await page.goto(`/${lang}/cases/sber-2025/`);
    await expect(page).toHaveURL(new RegExp(`/${lang}/cases/sber-2025/$`));
    await expect(page.locator('#case-contribution')).toBeVisible();
    await page.goto(`/${lang}/works/emomandala/#work-story-selection`);
    await expect(page).toHaveURL(new RegExp(`/${lang}/works/emomandala/#work-story-selection$`));
    await expect(page.locator('#work-story-selection')).toContainText('p5.js');
  }
});
