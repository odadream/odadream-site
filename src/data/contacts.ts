/**
 * Single source of truth for ODA.dream contacts. Change `href` or `label` here
 * once → all content resolves the new value at render time via tokens like
 * `{{telegram}}` (atomic) or `{{contacts-cta}}` (the repeated outreach block).
 */

export type Contact = { href: string; label: string };

export const CONTACTS: Record<string, Contact> = {
  telegram:        { href: "https://t.me/odadream_info",            label: "t.me/odadream_info" },
  "telegram-news": { href: "https://t.me/odadream",                  label: "t.me/odadream" },
  email:           { href: "mailto:hi@odadream.art",                 label: "hi@odadream.art" },
  behance:         { href: "https://www.behance.net/chudodey",       label: "behance.net/chudodey" },
  youtube:         { href: "https://www.youtube.com/@odadreamart",   label: "@odadreamart" },
  dzen:            { href: "https://dzen.ru/odadream",               label: "dzen.ru/odadream" },
  site:            { href: "https://odadream.art",                   label: "odadream.art" },
};

/**
 * The standard collab-page outreach block. Bilingual; chosen via current language
 * by the token resolver. Tweaks here propagate to every page using `{{contacts-cta}}`.
 */
export const CONTACTS_CTA: Record<"en" | "ru", string> = {
  en: [
    `**Telegram:** [${CONTACTS.telegram.label}](${CONTACTS.telegram.href}) ← fastest response  `,
    `**Email:** [${CONTACTS.email.label}](${CONTACTS.email.href})`,
    ``,
    `Tell us: event type · audience · what you want guests to feel or take away  `,
    `We respond within 24 hours.`,
  ].join("\n"),
  ru: [
    `**Telegram:** [${CONTACTS.telegram.label}](${CONTACTS.telegram.href}) ← быстрее всего  `,
    `**Email:** [${CONTACTS.email.label}](${CONTACTS.email.href})`,
    ``,
    `Расскажите: тип события · аудитория · что должны почувствовать или вынести гости  `,
    `Отвечаем в течение 24 часов.`,
  ].join("\n"),
};
