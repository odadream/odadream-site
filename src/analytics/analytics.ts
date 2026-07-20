const RUNTIME_MARKER = "ODA_ANALYTICS_RUNTIME_V1";
const CONSENT_STORAGE_KEY = "oda_analytics_consent_v1";

export type AnalyticsConsent = "granted" | "denied" | "unknown";
type EventParameters = Record<string, string | number | boolean | undefined>;

interface AnalyticsRuntimeStatus {
  marker: string;
  enabled: boolean;
  consentRequired: boolean;
  consent: AnalyticsConsent;
  initialized: boolean;
  googleConfigured: boolean;
  googleLoaded: boolean;
  metricaConfigured: boolean;
  metricaLoaded: boolean;
  debug: boolean;
  projectId: string;
  campaignId: string;
  siteId: string;
  issues: string[];
}

interface AnalyticsDebugApi {
  status: () => AnalyticsRuntimeStatus;
  trackEvent: (name: string, parameters?: EventParameters) => void;
  trackPageView: () => void;
  setConsent: (consent: Exclude<AnalyticsConsent, "unknown">) => void;
  resetConsent: () => void;
}

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
    __ODA_ANALYTICS__?: AnalyticsDebugApi;
  }
}

const env = import.meta.env;
const query =
  typeof window === "undefined"
    ? null
    : new URLSearchParams(window.location.search);
const googleId = String(env.VITE_GA_MEASUREMENT_ID || "").trim();
const metricaId = Number.parseInt(String(env.VITE_YANDEX_METRICA_ID || ""), 10);
const enabled = String(env.VITE_ANALYTICS_ENABLED || "false") === "true";
const consentRequired =
  String(env.VITE_ANALYTICS_CONSENT_MODE || "required") !== "implicit";
const debug =
  String(env.VITE_ANALYTICS_DEBUG || "false") === "true" ||
  query?.get("analytics_debug") === "1";
const projectId = String(env.VITE_ANALYTICS_PROJECT_ID || "unknown-project");
const campaignId = String(env.VITE_ANALYTICS_CAMPAIGN_ID || "uncategorized");
const siteId = String(env.VITE_ANALYTICS_SITE_ID || window.location.hostname);
const webvisor = String(env.VITE_YANDEX_WEBVISOR || "false") === "true";

let initialized = false;
let googleLoaded = false;
let metricaLoaded = false;
let autoTrackingInstalled = false;
let lastPage = "";
let scroll75Sent = false;
let consentResetApplied = false;

function hasMetricaId(): boolean {
  return Number.isSafeInteger(metricaId) && metricaId > 0;
}

function configIssues(): string[] {
  const issues: string[] = [];
  if (!enabled) issues.push("analytics_disabled");
  if (googleId && !/^G-[A-Z0-9]+$/i.test(googleId))
    issues.push("invalid_ga_measurement_id");
  if (String(env.VITE_YANDEX_METRICA_ID || "") && !hasMetricaId()) {
    issues.push("invalid_yandex_metrica_id");
  }
  if (enabled && !googleId && !hasMetricaId())
    issues.push("no_tracker_configured");
  return issues;
}

export function getAnalyticsConsent(): AnalyticsConsent {
  if (!consentRequired) return "granted";
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : "unknown";
  } catch {
    return "unknown";
  }
}

export function isAnalyticsEnabled(): boolean {
  return enabled;
}

export function isConsentRequired(): boolean {
  return enabled && consentRequired;
}

function canTrack(): boolean {
  return (
    enabled &&
    getAnalyticsConsent() === "granted" &&
    configIssues().length === 0
  );
}

function commonParameters(): EventParameters {
  return {
    project_id: projectId,
    campaign_id: campaignId,
    site_id: siteId,
    page_language:
      document.documentElement.lang || navigator.language || "unknown",
  };
}

function emitDebug(kind: string, payload: unknown): void {
  if (debug) console.info(`[ODA analytics] ${kind}`, payload);
  window.dispatchEvent(
    new CustomEvent("oda:analytics:event", { detail: { kind, payload } }),
  );
}

function injectScript(id: string, src: string): Promise<void> {
  const existing = document.getElementById(id) as HTMLScriptElement | null;
  if (existing) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = id;
    script.async = true;
    script.src = src;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error(`Failed to load ${src}`)),
      {
        once: true,
      },
    );
    document.head.appendChild(script);
  });
}

function setupGoogle(): void {
  if (!googleId) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
  window.gtag("js", new Date());
  window.gtag("config", googleId, {
    send_page_view: false,
    ...(debug ? { debug_mode: true } : {}),
  });
  void injectScript(
    "oda-google-tag",
    `https://www.googletagmanager.com/gtag/js?id=${googleId}`,
  )
    .then(() => {
      googleLoaded = true;
      emitDebug("google_loaded", googleId);
    })
    .catch((error: unknown) => emitDebug("google_error", String(error)));
}

function setupMetrica(): void {
  if (!hasMetricaId()) return;
  if (!window.ym) {
    const queue = (...args: unknown[]) => {
      const queued = queue as typeof queue & { a?: unknown[]; l?: number };
      (queued.a ||= []).push(args);
    };
    (queue as typeof queue & { l?: number }).l = Date.now();
    window.ym = queue;
  }
  window.ym(metricaId, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor,
    defer: true,
  });
  void injectScript("oda-yandex-metrica", "https://mc.yandex.ru/metrika/tag.js")
    .then(() => {
      metricaLoaded = true;
      emitDebug("metrica_loaded", metricaId);
    })
    .catch((error: unknown) => emitDebug("metrica_error", String(error)));
}

function normalizedName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function trackEvent(
  name: string,
  parameters: EventParameters = {},
): void {
  if (!canTrack()) return;
  const eventName = normalizedName(name);
  if (!eventName) return;
  const payload = { ...commonParameters(), ...parameters };
  if (googleId)
    window.gtag?.("event", eventName, { ...payload, send_to: googleId });
  if (hasMetricaId()) window.ym?.(metricaId, "reachGoal", eventName, payload);
  emitDebug(eventName, payload);
}

export function trackPageView(): void {
  if (!canTrack()) return;
  const location = window.location.href;
  if (location === lastPage) return;
  lastPage = location;
  scroll75Sent = false;
  const payload = {
    ...commonParameters(),
    page_title: document.title,
    page_location: location,
    page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
  };
  if (googleId)
    window.gtag?.("event", "page_view", { ...payload, send_to: googleId });
  if (hasMetricaId()) {
    window.ym?.(metricaId, "hit", location, {
      title: document.title,
      params: payload,
    });
  }
  emitDebug("page_view", payload);
}

function classifyClick(element: HTMLElement): string | null {
  const explicit = element.dataset.analyticsEvent;
  if (explicit) return explicit;
  const anchor = element.closest("a") as HTMLAnchorElement | null;
  if (!anchor?.href) return null;
  const href = decodeURIComponent(anchor.href).toLowerCase();
  if (href.startsWith("mailto:")) {
    return href.includes("show inquiry") || href.includes("booking")
      ? "click_booking_email"
      : "click_email";
  }
  if (href.includes("youtube.com") || href.includes("youtu.be"))
    return "click_youtube";
  if (href.includes("vk.com") || href.includes("vkvideo.ru")) return "click_vk";
  if (href.includes("technical") || href.includes("rider"))
    return "click_technical_rider";
  try {
    return new URL(anchor.href).origin !== window.location.origin
      ? "click_external"
      : null;
  } catch {
    return null;
  }
}

function installAutoTracking(): void {
  if (autoTrackingInstalled) return;
  autoTrackingInstalled = true;

  document.addEventListener(
    "click",
    (event) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("a,button")
          : null;
      if (!target || target.dataset.analyticsIgnore === "true") return;
      const eventName = classifyClick(target);
      if (!eventName) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      trackEvent(eventName, {
        link_url: anchor?.href || "",
        link_text: (target.textContent || "").trim().slice(0, 120),
      });
    },
    true,
  );

  document.addEventListener(
    "submit",
    (event) => {
      const form = event.target instanceof HTMLFormElement ? event.target : null;
      if (!form || form.dataset.analyticsIgnore === "true") return;
      trackEvent(form.dataset.analyticsEvent || "form_submit", {
        form_id: form.id || form.name || "unnamed",
      });
    },
    true,
  );

  window.addEventListener(
    "scroll",
    () => {
      if (scroll75Sent) return;
      const available =
        document.documentElement.scrollHeight - window.innerHeight;
      if (available > 0 && window.scrollY / available >= 0.75) {
        scroll75Sent = true;
        trackEvent("scroll_75");
      }
    },
    { passive: true },
  );

  const progress = new WeakMap<HTMLVideoElement, Set<number>>();
  const trackedVideo = (event: Event): HTMLVideoElement | null => {
    const video =
      event.target instanceof HTMLVideoElement ? event.target : null;
    return video?.dataset.analyticsIgnore === "true" ? null : video;
  };
  document.addEventListener(
    "play",
    (event) => {
      const video = trackedVideo(event);
      if (!video) return;
      const sent = progress.get(video) || new Set<number>();
      if (!sent.has(0)) {
        sent.add(0);
        progress.set(video, sent);
        trackEvent(`${video.dataset.analyticsVideo || "video"}_start`, {
          video_src: video.currentSrc || video.src,
        });
      }
    },
    true,
  );
  document.addEventListener(
    "timeupdate",
    (event) => {
      const video = trackedVideo(event);
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0)
        return;
      const sent = progress.get(video) || new Set<number>();
      const percent = (video.currentTime / video.duration) * 100;
      for (const threshold of [25, 50, 75]) {
        if (percent >= threshold && !sent.has(threshold)) {
          sent.add(threshold);
          trackEvent(
            `${video.dataset.analyticsVideo || "video"}_${threshold}`,
            {
              video_src: video.currentSrc || video.src,
            },
          );
        }
      }
      progress.set(video, sent);
    },
    true,
  );
  document.addEventListener(
    "ended",
    (event) => {
      const video = trackedVideo(event);
      if (video) {
        trackEvent(`${video.dataset.analyticsVideo || "video"}_complete`, {
          video_src: video.currentSrc || video.src,
        });
      }
    },
    true,
  );

  const notifyNavigation = () => window.setTimeout(trackPageView, 0);
  for (const method of ["pushState", "replaceState"] as const) {
    type HistoryWriter = (
      data: unknown,
      unused: string,
      url?: string | URL | null,
    ) => void;
    const original = window.history[method] as HistoryWriter;
    const wrapped: HistoryWriter = (data, unused, url) => {
      original.call(window.history, data, unused, url);
      notifyNavigation();
    };
    window.history[method] = wrapped;
  }
  window.addEventListener("popstate", notifyNavigation);
  window.addEventListener("hashchange", notifyNavigation);

  let language = document.documentElement.lang;
  new MutationObserver(() => {
    const nextLanguage = document.documentElement.lang;
    if (nextLanguage && nextLanguage !== language) {
      language = nextLanguage;
      trackEvent("language_change", { language: nextLanguage });
    }
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });
}

export function analyticsStatus(): AnalyticsRuntimeStatus {
  return {
    marker: RUNTIME_MARKER,
    enabled,
    consentRequired,
    consent: getAnalyticsConsent(),
    initialized,
    googleConfigured: Boolean(googleId),
    googleLoaded,
    metricaConfigured: hasMetricaId(),
    metricaLoaded,
    debug,
    projectId,
    campaignId,
    siteId,
    issues: configIssues(),
  };
}

export function setAnalyticsConsent(
  consent: Exclude<AnalyticsConsent, "unknown">,
): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, consent);
  } catch {
    // Continue with the in-page decision even when storage is unavailable.
  }
  window.dispatchEvent(
    new CustomEvent("oda:analytics:consent", { detail: consent }),
  );
  if (consent === "granted") {
    void initAnalytics();
  } else {
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
    if (initialized && hasMetricaId()) {
      window.ym?.(metricaId, "destruct");
    }
    initialized = false;
    metricaLoaded = false;
    lastPage = "";
  }
}

export function resetAnalyticsConsent(): void {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
  window.dispatchEvent(
    new CustomEvent("oda:analytics:consent", { detail: "unknown" }),
  );
}

export async function initAnalytics(): Promise<void> {
  if (!consentResetApplied && query?.get("analytics_consent") === "reset") {
    consentResetApplied = true;
    resetAnalyticsConsent();
  }
  if (
    !enabled ||
    initialized ||
    getAnalyticsConsent() !== "granted" ||
    configIssues().length
  ) {
    emitDebug("status", analyticsStatus());
    return;
  }
  initialized = true;
  setupGoogle();
  setupMetrica();
  installAutoTracking();
  trackPageView();
  emitDebug("initialized", analyticsStatus());
}

if (typeof window !== "undefined") {
  window.__ODA_ANALYTICS__ = {
    status: analyticsStatus,
    trackEvent,
    trackPageView,
    setConsent: setAnalyticsConsent,
    resetConsent: resetAnalyticsConsent,
  };
}
