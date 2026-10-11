import { test, expect } from '@playwright/test';
import { spawn, type ChildProcess } from 'node:child_process';
const publicOrigin = 'http://127.0.0.1:5178';
let owned: ChildProcess | undefined;
test.beforeAll(async ({ request }) => {
  test.setTimeout(120_000);
  const running = await request
    .get(publicOrigin + '/__editorial/status')
    .then((r) => r.ok())
    .catch(() => false);
  if (!running)
    owned = spawn(process.execPath, ['scripts/local-public.mjs'], { windowsHide: true, stdio: 'ignore' });
  await expect
    .poll(
      async () =>
        request
          .get(publicOrigin + '/__editorial/status')
          .then((r) => r.json())
          .then((s) => s.ready)
          .catch(() => false),
      { timeout: 100_000 },
    )
    .toBe(true);
});
test.afterAll(() => owned?.kill());
test('DEV notes are marked; real PUBLIC projection excludes notes, registry and analytics', async ({
  page,
  request,
}) => {
  const requests: string[] = [];
  page.on('request', (req) => {
    if (/google-analytics|googletagmanager|mc.yandex/.test(req.url())) requests.push(req.url());
  });
  await page.goto('/ru/cases/#case-audi-application-2020');
  await expect(page.locator('[data-dev-note="dev-catalogue-scope"]')).toContainText('DEV · не публикуется');
  await expect(page.locator('[data-editorial-toolbar="dev"]')).toBeVisible();
  await expect(page.locator('[data-editorial-toolbar] a').filter({ hasText: /^PUBLIC$/ })).toHaveAttribute(
    'href',
    publicOrigin + '/ru/cases/#case-audi-application-2020',
  );
  await page
    .locator('[data-editorial-toolbar] a')
    .filter({ hasText: /^PUBLIC$/ })
    .click();
  await expect(page).toHaveURL(publicOrigin + '/ru/cases/#case-audi-application-2020');
  await expect(page.locator('[data-dev-note]')).toHaveCount(0);
  await expect(page.locator('[data-editorial-toolbar="public"]')).toBeVisible();
  await page.locator('[data-editorial-toolbar] a').filter({ hasText: /^DEV$/ }).click();
  await expect(page).toHaveURL('http://127.0.0.1:5177/ru/cases/#case-audi-application-2020');
  await page.goto('/design-system/');
  await expect(
    page.locator('[data-editorial-toolbar] a').filter({ hasText: /страница отсутствует/ }),
  ).toHaveAttribute('href', publicOrigin + '/ru/');
  const endpoint = await request.get(publicOrigin + '/__editorial/status', {
    headers: { Origin: 'https://example.com' },
  });
  expect(endpoint.status()).toBe(403);
  expect((await request.get(publicOrigin + '/editorial/')).status()).toBe(404);
  expect((await request.get(publicOrigin + '/docs/EDITORIAL-REGISTER.yaml')).status()).toBe(404);
  expect(requests).toEqual([]);
});
test('catalogue filters canonical units and language statuses without claiming inventory is editorial completion', async ({
  page,
}) => {
  await page.goto('/editorial/');
  await expect(page.locator('[data-editorial-unit]')).toHaveCount(301);
  await expect(page.locator('[data-editorial-progress]')).toContainText(
    'авторская приёмка и проверка 0/301 (0%)',
  );
  await page.locator('select[name=kind]').selectOption('works');
  await expect(page.locator('[data-editorial-unit]:visible')).toHaveCount(23);
  await page.locator('input[name=query]').fill('emomandala');
  await expect(page.locator('[data-editorial-unit]:visible')).toHaveCount(1);
  await page.locator('select[name=language]').selectOption('en');
  await expect(page.locator('[data-editorial-progress]')).toContainText('EN:');
  await expect(page.locator('[data-editorial-unit]:visible h2')).toContainText('Emomandala');
  for (const theme of ['dark', 'light']) {
    await page.evaluate((theme) => (document.documentElement.dataset.theme = theme), theme);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
