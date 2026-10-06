import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const { analyticsConfigFrom, analyticsConfigIssues, eventParameters, isLegacyBridge } = await loadSiteModule(
  'src/lib/analytics-contract.ts',
);

test('analytics is disabled by default and activation requires real IDs and automatic-event acknowledgement', () => {
  const defaults = analyticsConfigFrom({});
  assert.equal(defaults.enabled, false);
  assert.deepEqual(analyticsConfigIssues(defaults), []);
  const config = analyticsConfigFrom({
    PUBLIC_ANALYTICS_ENABLED: 'true',
    PUBLIC_GA_MEASUREMENT_ID: 'G-XXXXXXXXXX',
    PUBLIC_YANDEX_METRICA_ID: '00000000',
  });
  assert.equal(analyticsConfigIssues(config).length, 3);
  config.googleId = 'G-TEST123';
  config.metricaId = '12345678';
  config.automaticEventsDisabled = true;
  assert.deepEqual(analyticsConfigIssues(config), []);
});

test('event payloads allow only canonical context and stable IDs, never addresses, queries or submitted text', () => {
  const payload = eventParameters(
    { pagePath: '/ru/works/oda-rings/?email=user@example.test#private', language: 'ru', workId: 'rings' },
    {
      link_url: 'mailto:user@example.test?body=private-message',
      link_text: 'Private name',
      email: 'private@example.test',
      material_id: 'oda-rings-drawings',
      work_id: 'person@example.test',
      media_id: 'rings',
      format_id: 'talk-workshop',
    },
  );
  assert.deepEqual(payload, {
    project_id: 'odadream',
    campaign_id: 'brand-site-2026',
    site_id: 'odadream-site-v2',
    page_path: '/ru/works/oda-rings/',
    page_language: 'ru',
    work_id: 'rings',
    format_id: 'talk-workshop',
    material_id: 'oda-rings-drawings',
    media_id: 'rings',
  });
  assert.equal(eventParameters({ pagePath: '/ru/user@example.test/', language: 'ru' }).page_path, '/');
});

test('legacy root is a transport entrance, not another page view or a conversion', () => {
  assert.ok(isLegacyBridge(new URL('https://odadream.art/?id=neurobattle&lang=ru&internal=true')));
  assert.ok(isLegacyBridge(new URL('https://odadream.art/?id=')));
  assert.ok(!isLegacyBridge(new URL('https://odadream.art/ru/works/neurobattle/')));
});
