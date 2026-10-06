import { expect, test } from '@playwright/test';

test('consent withdrawal while a provider is loading blocks initialization and buffered actions', async ({
  page,
}) => {
  let finish: () => void = () => {};
  const held = new Promise<void>((resolve) => {
    finish = resolve;
  });
  await page.route('https://www.googletagmanager.com/**', async (route) => {
    await held;
    await route.fulfill({ contentType: 'application/javascript', body: 'window.__mockLoaded=true;' });
  });
  await page.goto('/en/contact/');
  await page.evaluate(async () => {
    const modulePath = '/src/scripts/analytics.ts';
    const { createAnalytics } = await import(modulePath);
    (window as any).__events = [];
    window.addEventListener('oda:analytics:event', (event: any) =>
      (window as any).__events.push(event.detail),
    );
    (window as any).__testAnalytics = createAnalytics(
      { enabled: true, debug: true, googleId: 'G-TEST123', metricaId: '', automaticEventsDisabled: true },
      { pagePath: '/en/contact/', language: 'en', preview: false },
    );
    (window as any).__testAnalytics.setConsent('granted');
    const link = document.querySelector<HTMLAnchorElement>('a[href="mailto:hi@odadream.art"]')!;
    link.addEventListener('click', (event) => event.preventDefault());
    link.click();
    (window as any).__testAnalytics.setConsent('denied');
  });
  finish();
  await expect.poll(() => page.evaluate(() => (window as any).__mockLoaded)).toBeTruthy();
  expect(await page.evaluate(() => (window as any).__events)).toEqual([]);
  expect(
    await page.evaluate(() =>
      (window as any).dataLayer
        .map((row: any) => Array.from(row))
        .filter((row: any) => row[0] === 'config' || row[0] === 'event'),
    ),
  ).toEqual([]);
  expect(await page.evaluate(() => (window as any).__testAnalytics.status().googleReady)).toBe(false);
});

test('explicit media actions carry stable IDs; background loops do not become video-start intentions', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('oda_analytics_consent_v2', 'granted');
    (window as any).__events = [];
    window.addEventListener('oda:analytics:event', (event: any) =>
      (window as any).__events.push(event.detail),
    );
  });
  await page.goto('/ru/works/oda-rings/?analytics_debug=1');
  await page.locator('[data-lightbox]').first().click();
  await expect(page.locator('#lightbox')).toBeVisible();
  expect(
    await page.evaluate(
      () => (window as any).__events.find((event: any) => event.name === 'media_open').parameters,
    ),
  ).toMatchObject({ work_id: 'rings', media_id: 'rings' });
  await page.keyboard.press('Escape');
  await page.evaluate(() => {
    const video = document.createElement('video');
    video.controls = true;
    video.dataset.mediaId = 'rings';
    document.body.append(video);
    video.dispatchEvent(new Event('play'));
    video.dispatchEvent(new Event('play'));
    video.dispatchEvent(new Event('ended'));
    video.controls = false;
    video.dispatchEvent(new Event('play'));
    video.remove();
  });
  const names = await page.evaluate(() => (window as any).__events.map((event: any) => event.name));
  expect(names.filter((name: string) => name === 'video_start')).toHaveLength(1);
  expect(names.filter((name: string) => name === 'video_complete')).toHaveLength(1);
});
