import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const works = [
  'interference-of-realities',
  'mindshow',
  'neurobattle',
  'project-schrodinger',
  'oda-rings',
  'sync-circle',
];
const cases = ['tsiolkovsky-festival-2026', 'tsiolkovsky-laboratory-2025', 'dano-2025', 'byob-2026'];

test('all curated works and cases are real HTML pages', async ({ page }) => {
  for (const path of [...works.map((x) => `/en/works/${x}/`), ...cases.map((x) => `/en/cases/${x}/`)]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://odadream.art${path}`);
  }
});

test('language toggle preserves a work and back/forward', async ({ page }) => {
  await page.goto('/en/works/mindshow/');
  await page.getByRole('link', { name: 'Русская версия' }).click();
  await expect(page).toHaveURL(/\/ru\/works\/mindshow\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await page.goBack();
  await expect(page).toHaveURL(/\/en\/works\/mindshow\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/ru\/works\/mindshow\/$/);
});

test('old query links resolve explicitly; unknown IDs do not become home', async ({ page }) => {
  await page.goto('/?internal=true&id=interference&lang=ru');
  await expect(page).toHaveURL(/\/ru\/works\/interference-of-realities\/$/);
  await page.goto('/?id=unknown-record&lang=en');
  await expect(page).toHaveURL(/\/legacy\/unavailable\/\?id=unknown-record&lang=en$/);
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex,follow');
});

test('mobile navigation, media, lightbox and contact work without horizontal overflow', async ({
  page,
  isMobile,
}) => {
  await page.goto('/en/');
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    await page.getByRole('button', { name: 'Open menu' }).click();
  }
  await expect(page.locator('.feature-split img')).toBeVisible();
  await page.getByRole('button', { name: /Enlarge: Performers/ }).click();
  await expect(page.locator('#lightbox')).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox')).not.toHaveAttribute('open', '');
  await expect(page.getByRole('button', { name: /Enlarge: Performers/ })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.goto('/en/contact/');
  await expect(page.getByRole('link', { name: 'hi@odadream.art' })).toHaveAttribute(
    'href',
    'mailto:hi@odadream.art',
  );
  await expect(page.getByRole('link', { name: /odadream_info/ })).toHaveAttribute(
    'href',
    'https://t.me/odadream_info',
  );
});

test('key pages have no serious or critical accessibility violations', async ({ page }) => {
  for (const path of [
    '/en/',
    '/ru/',
    '/en/works/interference-of-realities/',
    '/en/cases/dano-2025/',
    '/en/contact/',
  ]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const high = results.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical');
    expect(
      high.map((item) => `${item.id}: ${item.nodes.length} nodes`),
      path,
    ).toEqual([]);
  }
});
