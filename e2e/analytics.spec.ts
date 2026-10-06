import { expect, test } from '@playwright/test';

test('preview diagnostics require consent, scrub sensitive parameters and stop after revocation', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (/googletagmanager|google-analytics|mc.yandex/.test(request.url())) requests.push(request.url());
  });
  await page.addInitScript(() => {
    (window as any).__events = [];
    window.addEventListener('oda:analytics:event', (event: any) =>
      (window as any).__events.push(event.detail),
    );
  });
  await page.goto('/ru/works/oda-rings/?analytics_debug=1&email=private@example.test#private-fragment');
  await expect(page.locator('[data-analytics-consent]')).toBeVisible();
  expect(await page.evaluate(() => (window as any).__events)).toEqual([]);
  await page.locator('[data-consent-choice="granted"]').click();
  await expect
    .poll(() =>
      page.evaluate(() => (window as any).__events.filter((event: any) => event.name === 'page_view').length),
    )
    .toBe(1);
  await page.evaluate(() => {
    (window as any).__ODA_ANALYTICS__.trackPageView();
    const anchor = document.createElement('a');
    anchor.href = 'mailto:private@example.test?body=private-message';
    anchor.textContent = 'Private sender';
    document.body.append(anchor);
    anchor.addEventListener('click', (event) => event.preventDefault());
    anchor.click();
    anchor.remove();
    document
      .querySelector<HTMLAnchorElement>('#document-oda-rings-drawings a')!
      .addEventListener('click', (event) => event.preventDefault());
    document.querySelector<HTMLAnchorElement>('#document-oda-rings-drawings a')!.click();
  });
  const events = await page.evaluate(() => (window as any).__events);
  expect(events.filter((event: any) => event.name === 'page_view')).toHaveLength(1);
  expect(events.find((event: any) => event.name === 'click_email').parameters).toMatchObject({
    work_id: 'rings',
    contact_channel: 'email',
  });
  expect(events.find((event: any) => event.name === 'material_open').parameters.material_id).toBe(
    'oda-rings-drawings',
  );
  expect(JSON.stringify(events)).not.toMatch(/private|example\.test|mailto|link_text|body=/);
  await page.locator('[data-analytics-settings]').click();
  await page.locator('[data-consent-choice="denied"]').click();
  const count = await page.evaluate(() => (window as any).__events.length);
  await page.evaluate(() =>
    document.querySelector<HTMLAnchorElement>('#document-oda-rings-drawings a')!.click(),
  );
  expect(await page.evaluate(() => (window as any).__events.length)).toBe(count);
  expect(requests).toEqual([]);
});

test('default preview and declined visits never load providers; preferences remain changeable', async ({
  page,
}) => {
  const calls: string[] = [];
  page.on('request', (request) => {
    if (/googletagmanager|mc.yandex/.test(request.url())) calls.push(request.url());
  });
  await page.goto('/ru/');
  await expect(page.locator('[data-analytics-settings]')).toBeHidden();
  await expect(page.locator('[data-analytics-consent]')).toBeHidden();
  await page.goto('/ru/?analytics_debug=1');
  await page.locator('[data-consent-choice="denied"]').click();
  await page.reload();
  await expect(page.locator('[data-analytics-consent]')).toBeHidden();
  await page.locator('[data-analytics-settings]').click();
  await expect(page.locator('[data-consent-choice="granted"]')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-analytics-settings]')).toBeFocused();
  expect(calls).toEqual([]);
});

test('mocked production adapters send one canonical view, block pending-load revocation and never grant bridge access', async ({
  page,
}) => {
  await page.route('https://www.googletagmanager.com/**', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: 'window.__googleLoaded=true;' }),
  );
  await page.route('https://mc.yandex.ru/**', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: 'window.__ymCalls=[];window.ym=(...args)=>window.__ymCalls.push(args);',
    }),
  );
  await page.goto('/ru/works/oda-rings/');
  await page.evaluate(async () => {
    const modulePath = '/src/scripts/analytics.ts';
    const { createAnalytics } = await import(/* @vite-ignore */ modulePath);
    (window as any).__events = [];
    window.addEventListener('oda:analytics:event', (event: any) =>
      (window as any).__events.push(event.detail),
    );
    (window as any).__testAnalytics = createAnalytics(
      {
        enabled: true,
        debug: true,
        googleId: 'G-TEST123',
        metricaId: '12345678',
        automaticEventsDisabled: true,
      },
      { pagePath: '/ru/works/oda-rings/', language: 'ru', workId: 'rings', preview: false },
    );
    (window as any).__testAnalytics.setConsent('granted');
  });
  await expect
    .poll(() => page.evaluate(() => (window as any).__testAnalytics.status().metricaReady))
    .toBeTruthy();
  const result = await page.evaluate(() => {
    const api = (window as any).__testAnalytics;
    api.trackPageView();
    const commands = (window as any).dataLayer.map((row: any) => Array.from(row));
    const views = commands.filter((row: any) => row[0] === 'event' && row[1] === 'page_view');
    const hits = (window as any).__ymCalls.filter((row: any) => row[1] === 'hit');
    const config = commands.find((row: any) => row[0] === 'config')[2];
    api.setConsent('denied');
    api.setConsent('granted');
    const disabled = (window as any)['ga-disable-G-TEST123'];
    return { views, hits, config, disabled };
  });
  expect(result.views).toHaveLength(1);
  expect(result.hits).toHaveLength(1);
  expect(result.config).toMatchObject({
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  expect(result.disabled).toBe(false);
  await page.evaluate(async () => {
    (window as any).__testAnalytics.destroy();
    history.replaceState(null, '', '/?id=neurobattle&lang=ru&internal=true');
    const modulePath = '/src/scripts/analytics.ts';
    const { createAnalytics } = await import(/* @vite-ignore */ modulePath);
    (window as any).__bridgeAnalytics = createAnalytics(
      { enabled: true, debug: true, googleId: 'G-TEST123', metricaId: '', automaticEventsDisabled: true },
      { pagePath: '/en/', language: 'en', preview: false },
    );
  });
  expect(await page.evaluate(() => (window as any).__bridgeAnalytics.status().active)).toBe(false);
});

test('provider failure leaves contact and consent usable without a fabricated view', async ({ page }) => {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.goto('/en/contact/');
  await page.evaluate(async () => {
    const modulePath = '/src/scripts/analytics.ts';
    const { createAnalytics } = await import(/* @vite-ignore */ modulePath);
    (window as any).__testAnalytics = createAnalytics(
      { enabled: true, debug: true, googleId: 'G-TEST123', metricaId: '', automaticEventsDisabled: true },
      { pagePath: '/en/contact/', language: 'en', preview: false },
    );
    (window as any).__testAnalytics.setConsent('granted');
  });
  await expect
    .poll(() => page.evaluate(() => (window as any).__testAnalytics.status().providerFailures))
    .toContain('google');
  await expect(page.locator('a[href="mailto:hi@odadream.art"]')).toBeVisible();
  await page.locator('[data-analytics-settings]').click();
  await page.locator('[data-consent-choice="denied"]').click();
  expect(await page.evaluate(() => (window as any).__testAnalytics.status().consent)).toBe('denied');
});
