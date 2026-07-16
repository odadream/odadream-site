import { useEffect, useState } from "react";
import {
  getAnalyticsConsent,
  isAnalyticsEnabled,
  isConsentRequired,
  setAnalyticsConsent,
  type AnalyticsConsent,
} from "./analytics";

export default function AnalyticsConsentBanner() {
  const [consent, setConsent] = useState<AnalyticsConsent>(() =>
    getAnalyticsConsent(),
  );
  const [language, setLanguage] = useState(
    () => document.documentElement.lang || "en",
  );

  useEffect(() => {
    const onConsent = (event: Event) => {
      setConsent((event as CustomEvent<AnalyticsConsent>).detail);
    };
    const observer = new MutationObserver(() => {
      setLanguage(document.documentElement.lang || "en");
    });
    window.addEventListener("oda:analytics:consent", onConsent);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });
    return () => {
      window.removeEventListener("oda:analytics:consent", onConsent);
      observer.disconnect();
    };
  }, []);

  if (!isAnalyticsEnabled() || !isConsentRequired() || consent !== "unknown")
    return null;

  const russian = language.toLowerCase().startsWith("ru");
  return (
    <aside
      className="fixed bottom-4 left-4 right-4 z-[200] mx-auto max-w-3xl border border-white/20 bg-black/95 p-4 text-white shadow-2xl backdrop-blur-md"
      role="dialog"
      aria-live="polite"
      aria-label={russian ? "Настройки аналитики" : "Analytics settings"}
    >
      <p className="m-0 text-sm leading-relaxed text-white/80">
        {russian
          ? "Мы используем аналитику посещений без Вебвизора и передачи введённых вами данных, чтобы понимать, как аудитория находит проекты ODA.dream и взаимодействует с сайтом."
          : "We use analytics without session replay or submitted personal data to understand how audiences discover ODA.dream projects and use this site."}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          className="min-h-11 border border-white bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black"
          onClick={() => setAnalyticsConsent("granted")}
        >
          {russian ? "Разрешить аналитику" : "Allow analytics"}
        </button>
        <button
          type="button"
          className="min-h-11 border border-white/40 bg-transparent px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
          onClick={() => setAnalyticsConsent("denied")}
        >
          {russian ? "Только необходимые" : "Necessary only"}
        </button>
      </div>
    </aside>
  );
}
