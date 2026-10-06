import { expect, test } from '@playwright/test';

test('restored pages and other-tab preference changes cannot revive withdrawn consent', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('oda_analytics_consent_v2', 'granted');
    (window as any).__events = [];
    window.addEventListener('oda:analytics:event', (event: any) =>
      (window as any).__events.push(event.detail),
    );
  });
  await page.goto('/ru/contact/?analytics_debug=1');
  await expect
    .poll(() =>
      page.evaluate(() => (window as any).__events.filter((event: any) => event.name === 'page_view').length),
    )
    .toBe(1);
  await page.evaluate(() => {
    localStorage.setItem('oda_analytics_consent_v2', 'denied');
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
    (window as any).__ODA_ANALYTICS__.trackPageView();
  });
  expect(await page.evaluate(() => (window as any).__ODA_ANALYTICS__.status().consent)).toBe('denied');
  expect(
    await page.evaluate(
      () => (window as any).__events.filter((event: any) => event.name === 'page_view').length,
    ),
  ).toBe(1);
  await page.evaluate(() => {
    localStorage.removeItem('oda_analytics_consent_v2');
    window.dispatchEvent(new StorageEvent('storage', { key: 'oda_analytics_consent_v2', newValue: null }));
  });
  await expect(page.locator('[data-analytics-consent]')).toBeVisible();
  expect(await page.evaluate(() => (window as any).__ODA_ANALYTICS__.status().consent)).toBe('unknown');
});

test('consent uses shared button colors in both themes after transitions settle, including short screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 320 });
  await page.goto('/ru/contact/?analytics_debug=1');
  for (const [theme, color] of [
    ['dark', 'rgb(243, 241, 236)'],
    ['light', 'rgb(36, 35, 31)'],
  ]) {
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
    }, theme);
    await expect(page.locator('[data-consent-choice="granted"]')).toHaveCSS('background-color', color);
    const dimensions = await page.locator('[data-analytics-consent]').evaluate((node) => ({
      height: node.getBoundingClientRect().height,
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    expect(dimensions.height).toBeLessThanOrEqual(288);
    expect(dimensions.overflow).toBe(false);
    await page.locator('[data-consent-choice="denied"]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-consent-choice="denied"]')).toBeVisible();
  }
});
