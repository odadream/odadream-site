import { analyticsConfigIssues, eventParameters, isLegacyBridge, stableId } from '../lib/analytics-contract';
import type { AnalyticsConfig, AnalyticsContext, AnalyticsEvent, Consent } from '../lib/analytics-contract';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    ym?: ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };
    __ODA_ANALYTICS__?: ReturnType<typeof createAnalytics>;
  }
}
const consentKey = 'oda_analytics_consent_v2';

/** Default preview diagnostics stay local. Network adapters need valid configuration and explicit consent. */
export function createAnalytics(config: AnalyticsConfig, context: AnalyticsContext) {
  const url = new URL(location.href);
  const debug = config.debug || url.searchParams.get('analytics_debug') === '1';
  const issues = analyticsConfigIssues(config);
  const network = config.enabled && !context.preview && !issues.length && !isLegacyBridge(url);
  const active = !isLegacyBridge(url) && (network || debug);
  let consent: Consent = 'unknown';
  try {
    const saved = localStorage.getItem(consentKey);
    if (saved === 'granted' || saved === 'denied') consent = saved;
  } catch {
    /* Storage denial still permits an explicit choice for this page. */
  }
  const panel = document.querySelector<HTMLElement>('[data-analytics-consent]');
  const settings = document.querySelector<HTMLButtonElement>('[data-analytics-settings]');
  const abort = new AbortController();
  let pageSent = false;
  let closed = false;
  const pending: { name: AnalyticsEvent; parameters: Record<string, string> }[] = [];
  const providerFailures = new Set<string>();
  let googleReady = false,
    metricaReady = false;
  let loading: Promise<void> | undefined;
  const scripts: HTMLScriptElement[] = [];
  const viewed = new Set<Element>(),
    visible = new Set<Element>();
  const started = new WeakSet<Element>(),
    completed = new WeakSet<Element>();
  const contextOf = (element: Element) => ({
    work_id: element.closest<HTMLElement>('[data-work-id]')?.dataset.workId,
    format_id: element.closest<HTMLElement>('[data-format-id]')?.dataset.formatId,
    material_id: element.closest<HTMLElement>('[data-material-id]')?.dataset.materialId,
    media_id: element.closest<HTMLElement>('[data-media-id]')?.dataset.mediaId,
  });
  function emit(name: AnalyticsEvent, values: Record<string, unknown> = {}) {
    if (!active || closed || consent !== 'granted') return;
    const parameters = eventParameters(context, values);
    if (network && (loading || (!googleReady && !metricaReady))) {
      if (pending.length < 20) pending.push({ name, parameters });
      return;
    }
    const safeLocation = location.origin + parameters.page_path;
    if (network && googleReady)
      window.gtag?.('event', name, {
        ...parameters,
        page_location: safeLocation,
        page_referrer: '',
        send_to: config.googleId,
      });
    if (network && metricaReady) {
      if (name === 'page_view')
        window.ym?.(Number(config.metricaId), 'hit', safeLocation, { params: parameters });
      else window.ym?.(Number(config.metricaId), 'reachGoal', name, parameters);
    }
    if (debug) window.dispatchEvent(new CustomEvent('oda:analytics:event', { detail: { name, parameters } }));
  }
  function pageView() {
    if (
      !active ||
      closed ||
      consent !== 'granted' ||
      pageSent ||
      (network && (loading || (!googleReady && !metricaReady)))
    )
      return;
    pageSent = true;
    emit('page_view');
  }
  function loadScript(src: string) {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.referrerPolicy = 'no-referrer';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      scripts.push(script);
      document.head.append(script);
    });
  }
  async function providers() {
    if (!network || closed || consent !== 'granted') return;
    if (loading) return loading;
    loading = Promise.all([
      (async () => {
        if (!config.googleId || googleReady) return;
        window.dataLayer ??= [];
        window.gtag ??= function () {
          window.dataLayer!.push(arguments);
        };
        window.gtag('consent', 'default', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
        window.gtag('set', {
          page_location: location.origin + eventParameters(context).page_path,
          page_referrer: '',
        });
        if (!(await loadScript(`https://www.googletagmanager.com/gtag/js?id=${config.googleId}`))) {
          providerFailures.add('google');
          return;
        }
        if (closed || consent !== 'granted') return;
        providerFailures.delete('google');
        (window as unknown as Record<string, unknown>)[`ga-disable-${config.googleId}`] = false;
        window.gtag('consent', 'update', { analytics_storage: 'granted' });
        window.gtag('js', new Date());
        window.gtag('config', config.googleId, {
          send_page_view: false,
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
        });
        googleReady = true;
      })(),
      (async () => {
        if (!config.metricaId || metricaReady) return;
        if (!window.ym) {
          const queue: NonNullable<Window['ym']> = (...args) => {
            (queue.a ??= []).push(args);
          };
          queue.l = Date.now();
          window.ym = queue;
        }
        if (!(await loadScript('https://mc.yandex.ru/metrika/tag.js'))) {
          providerFailures.add('metrica');
          return;
        }
        if (closed || consent !== 'granted') return;
        providerFailures.delete('metrica');
        window.ym(Number(config.metricaId), 'init', {
          defer: true,
          clickmap: false,
          trackLinks: false,
          webvisor: false,
          accurateTrackBounce: false,
        });
        metricaReady = true;
      })(),
    ]).then(() => {
      loading = undefined;
      pageView();
      exposures();
      if (googleReady || metricaReady)
        for (const event of pending.splice(0)) {
          emit(event.name, {
            work_id: event.parameters.work_id,
            format_id: event.parameters.format_id,
            media_id: event.parameters.media_id,
            material_id: event.parameters.material_id,
            contact_channel: event.parameters.contact_channel,
          });
        }
    });
    return loading;
  }
  function exposures() {
    if (consent !== 'granted' || (network && (loading || (!googleReady && !metricaReady)))) return;
    for (const element of visible)
      if (!viewed.has(element)) {
        viewed.add(element);
        emit('media_view', contextOf(element));
      }
  }
  const observer = active
    ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) visible.add(entry.target);
            else visible.delete(entry.target);
          }
          exposures();
        },
        { threshold: 0.5 },
      )
    : undefined;
  function closePanel() {
    const focused = panel?.contains(document.activeElement);
    if (panel) panel.hidden = true;
    settings?.setAttribute('aria-expanded', 'false');
    if (focused) settings?.focus();
  }
  function setConsent(value: 'granted' | 'denied', persist = true) {
    if (closed) return;
    consent = value;
    try {
      if (persist) localStorage.setItem(consentKey, value);
    } catch {
      /* Session-only choice. */
    }
    closePanel();
    if (value === 'granted') {
      if (googleReady && network) {
        (window as unknown as Record<string, unknown>)[`ga-disable-${config.googleId}`] = false;
        window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
      }
      if (network) void providers();
      else {
        pageView();
        exposures();
      }
    } else {
      pending.length = 0;
      if (googleReady) {
        (window as unknown as Record<string, unknown>)[`ga-disable-${config.googleId}`] = true;
        window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
      }
      if (metricaReady) {
        window.ym?.(Number(config.metricaId), 'destruct');
        metricaReady = false;
      }
    }
  }
  function syncStoredConsent() {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(consentKey);
    } catch {
      /* A restored page requests a fresh choice if storage is unavailable. */
    }
    if (saved === 'granted' || saved === 'denied') setConsent(saved, false);
    else {
      setConsent('denied', false);
      consent = 'unknown';
      if (panel) panel.hidden = false;
      settings?.setAttribute('aria-expanded', 'true');
    }
  }
  const api = {
    status: () => ({
      active: active && !closed,
      network: network && !closed,
      debug,
      consent,
      issues: [...issues],
      providerFailures: [...providerFailures],
      googleReady,
      metricaReady,
    }),
    setConsent,
    trackPageView: pageView,
    destroy() {
      if (googleReady) (window as unknown as Record<string, unknown>)[`ga-disable-${config.googleId}`] = true;
      if (metricaReady) window.ym?.(Number(config.metricaId), 'destruct');
      closed = true;
      pending.length = 0;
      abort.abort();
      observer?.disconnect();
      for (const script of scripts) script.remove();
      closePanel();
    },
  };
  if (debug) window.__ODA_ANALYTICS__ = api;
  if (!active) return api;
  if (settings) settings.hidden = false;
  if (panel && consent === 'unknown') {
    panel.hidden = false;
    settings?.setAttribute('aria-expanded', 'true');
  }
  settings?.addEventListener(
    'click',
    () => {
      if (panel) {
        panel.hidden = !panel.hidden;
        settings.setAttribute('aria-expanded', String(!panel.hidden));
        if (!panel.hidden) panel.querySelector<HTMLButtonElement>('button')?.focus();
      }
    },
    { signal: abort.signal },
  );
  panel
    ?.querySelectorAll<HTMLButtonElement>('[data-consent-choice]')
    .forEach((button) =>
      button.addEventListener(
        'click',
        () => setConsent(button.dataset.consentChoice as 'granted' | 'denied'),
        { signal: abort.signal },
      ),
    );
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && panel && !panel.hidden) closePanel();
    },
    { signal: abort.signal },
  );
  document.addEventListener(
    'click',
    (event) => {
      const element = event.target instanceof Element ? event.target.closest('a,button') : null;
      if (!element || element.closest('[data-analytics-consent]')) return;
      const values = contextOf(element);
      if (element.matches('[data-lightbox]')) {
        emit(values.material_id ? 'material_open' : 'media_open', values);
        return;
      }
      if (!(element instanceof HTMLAnchorElement)) return;
      const target = new URL(element.href, location.href);
      if (target.protocol === 'mailto:') emit('click_email', { ...values, contact_channel: 'email' });
      else if (values.material_id && target.origin === location.origin) emit('material_open', values);
      else if (target.origin !== location.origin && /^https?:$/.test(target.protocol))
        emit('click_external', {
          ...values,
          contact_channel: stableId(element.dataset.contactChannel),
        });
      else if (/^\/(?:en|ru)\/contact\/$/.test(target.pathname)) emit('contact_open', values);
    },
    { capture: true, signal: abort.signal },
  );
  document.querySelectorAll('[data-media-id]').forEach((element) => observer?.observe(element));
  for (const name of ['play', 'ended'] as const)
    document.addEventListener(
      name,
      (event) => {
        const video = event.target;
        if (
          !(video instanceof HTMLVideoElement) ||
          !video.controls ||
          !video.dataset.mediaId ||
          consent !== 'granted'
        )
          return;
        const seen = name === 'play' ? started : completed;
        if (seen.has(video)) return;
        seen.add(video);
        emit(name === 'play' ? 'video_start' : 'video_complete', contextOf(video));
      },
      { capture: true, signal: abort.signal },
    );
  window.addEventListener(
    'pageshow',
    (event) => {
      if (event.persisted) {
        pageSent = false;
        syncStoredConsent();
      }
    },
    { signal: abort.signal },
  );
  window.addEventListener(
    'storage',
    (event) => {
      if (event.key === consentKey || event.key === null) syncStoredConsent();
    },
    { signal: abort.signal },
  );
  if (consent === 'granted') {
    if (network) void providers();
    else {
      pageView();
      exposures();
    }
  }
  return api;
}
