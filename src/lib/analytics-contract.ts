export type Consent = 'unknown' | 'granted' | 'denied';
export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  googleId: string;
  metricaId: string;
  automaticEventsDisabled: boolean;
}
export type AnalyticsEvent =
  | 'page_view'
  | 'contact_open'
  | 'click_email'
  | 'click_external'
  | 'material_open'
  | 'media_open'
  | 'media_view'
  | 'video_start'
  | 'video_complete';
export interface AnalyticsContext {
  pagePath: string;
  language: 'ru' | 'en';
  workId?: string;
  caseId?: string;
  preview: boolean;
}
export const analyticsConfigFrom = (env: Record<string, string | undefined>): AnalyticsConfig => ({
  enabled: env.PUBLIC_ANALYTICS_ENABLED === 'true',
  debug: env.PUBLIC_ANALYTICS_DEBUG === 'true',
  googleId: (env.PUBLIC_GA_MEASUREMENT_ID ?? '').trim(),
  metricaId: (env.PUBLIC_YANDEX_METRICA_ID ?? '').trim(),
  automaticEventsDisabled: env.PUBLIC_ANALYTICS_AUTO_EVENTS_DISABLED === 'true',
});
export function analyticsConfigIssues(config: AnalyticsConfig) {
  if (!config.enabled) return [];
  const issues: string[] = [];
  if (!config.googleId && !config.metricaId) issues.push('No analytics provider configured');
  if (config.googleId && (!/^G-[A-Z0-9]+$/.test(config.googleId) || config.googleId === 'G-XXXXXXXXXX'))
    issues.push('Invalid GA measurement ID');
  if (
    config.metricaId &&
    (!/^[1-9]\d*$/.test(config.metricaId) || !Number.isSafeInteger(Number(config.metricaId)))
  )
    issues.push('Invalid Metrica ID');
  if (!config.automaticEventsDisabled)
    issues.push('Automatic provider events must be disabled before activation');
  return issues;
}
export const stableId = (value?: string) =>
  value && /^[a-z0-9][a-z0-9-]{0,79}$/.test(value) ? value : undefined;
export function eventParameters(context: AnalyticsContext, values: Record<string, unknown> = {}) {
  const parameters: Record<string, string> = {
    project_id: 'odadream',
    campaign_id: 'brand-site-2026',
    site_id: 'odadream-site-v2',
    page_path: /^\/(?:en|ru)\/(?:[a-z0-9-]+\/)*$/.test(context.pagePath.split(/[?#]/)[0])
      ? context.pagePath.split(/[?#]/)[0]
      : '/',
    page_language: context.language,
  };
  for (const [name, value] of Object.entries({
    work_id: context.workId,
    case_id: context.caseId,
    format_id: values.format_id,
    material_id: values.material_id,
    media_id: values.media_id,
    contact_channel: values.contact_channel,
  })) {
    const id = stableId(typeof value === 'string' ? value : undefined);
    if (id) parameters[name] = id;
  }
  const workId = stableId(typeof values.work_id === 'string' ? values.work_id : undefined);
  if (workId) parameters.work_id = workId;
  return parameters;
}
export const isLegacyBridge = (url: URL) => url.pathname === '/' && url.searchParams.has('id');
