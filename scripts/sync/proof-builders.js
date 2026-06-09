/**
 * Pure builders for the proof ledger (awards, press, testimonials, letters)
 * and the per-work "dossier" module. Extracted from sync-registry.js to
 * keep the orchestration file focused on data loading and content writing.
 */

const TIER_RANK = { flagship: 0, strong: 1, standard: 2 };

const L = {
  shown:  { en: "Shown at",   ru: "Показывали" },
  awards: { en: "Recognition", ru: "Награды" },
  press:  { en: "Press",       ru: "Пресса" },
  voices: { en: "Voices",      ru: "Отзывы" },
  lead:   { en: "Track record at a glance:", ru: "След и признание вкратце:" },
  full:   { en: "Full footprint", ru: "Весь след" },
};

// --- shared helpers ---

function orgNames(ids, omap, lang) {
  if (!ids?.length) return "—";
  return ids
    .map((id) => {
      const o = omap.get(id);
      if (!o) return id;
      return lang === "ru" ? o.name_ru : o.name_en;
    })
    .join(", ");
}

function pYear(p) {
  return String(p.date || "").slice(0, 4);
}

function sortProofs(a, b) {
  const t = (TIER_RANK[a.tier] ?? 9) - (TIER_RANK[b.tier] ?? 9);
  return t !== 0 ? t : String(b.date).localeCompare(String(a.date));
}

function txt(p, key, lang) {
  return lang === "ru" ? p[`${key}_ru`] : p[`${key}_en`];
}

// Issuer / outlet name: prefer linked org, else free-text source, else eng's org.
function proofSource(p, omap, engById, lang) {
  if (p.org && omap.get(p.org)) {
    return lang === "ru" ? omap.get(p.org).name_ru : omap.get(p.org).name_en;
  }
  const s = lang === "ru" ? p.source_ru : p.source_en;
  if (s) return s;
  if (p.eng && engById.get(p.eng)) {
    const o = orgNames(engById.get(p.eng).orgs, omap, lang);
    if (o && o !== "—") return o;
  }
  return "";
}

function proofLedgerKind(p, kind) {
  if (kind === "press") return p.kind === "press" || p.kind === "hub-press";
  return p.kind === kind;
}

function proofsOf(proofs, kind, workId) {
  return proofs
    .filter(
      (p) =>
        proofLedgerKind(p, kind) && (workId ? p.work === workId : true),
    )
    .sort(sortProofs);
}

// --- inline highlight strings (used inside the dossier module) ---

function casesInline(work, engagements, omap, lang, limit) {
  const keys = work.format_keys || [];
  if (!keys.length) return "";
  return engagements
    .filter((e) => keys.includes(e.format))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, limit)
    .map((e) => {
      const t = lang === "ru" ? e.title_ru : e.title_en;
      const org = orgNames(e.orgs, omap, lang);
      const tail = org && org !== "—" ? ` (${org}, ${pYear(e)})` : ` (${pYear(e)})`;
      return `[[${e.id}|${t}]]${tail}`;
    })
    .join(" · ");
}

function awardsInline(proofs, workId, lang, limit) {
  return proofsOf(proofs, "award", workId)
    .slice(0, limit)
    .map((p) => `${txt(p, "title", lang)} (${pYear(p)})`)
    .join(" · ");
}

function pressInline(proofs, omap, engById, workId, lang, limit) {
  return proofsOf(proofs, "press", workId)
    .slice(0, limit)
    .map((p) => {
      const src = proofSource(p, omap, engById, lang) || txt(p, "title", lang);
      return p.url ? `[${src}](${p.url})` : src;
    })
    .join(" · ");
}

function topTestimonial(proofs, omap, engById, workId, lang) {
  const p = proofsOf(proofs, "testimonial", workId)[0];
  if (!p) return "";
  const src = proofSource(p, omap, engById, lang);
  return `> «${txt(p, "quote", lang)}»${src ? ` — ${src} (${pYear(p)})` : ""}`;
}

// --- per-work dossier module ---

export function buildDossier(work, proofs, engagements, omap, engById, lang) {
  const lines = [];
  const cases = casesInline(work, engagements, omap, lang, 3);
  const aw = awardsInline(proofs, work.id, lang, 2);
  const pr = pressInline(proofs, omap, engById, work.id, lang, 3);
  const voice = topTestimonial(proofs, omap, engById, work.id, lang);
  if (cases) lines.push(`**${L.shown[lang]}:** ${cases}`);
  if (aw) lines.push(`**${L.awards[lang]}:** ${aw}`);
  if (pr) lines.push(`**${L.press[lang]}:** ${pr}`);
  if (!lines.length && !voice) return "";
  const segs = [`*${L.lead[lang]}*`];
  if (lines.length) segs.push(lines.join("\n\n"));
  if (voice) segs.push(voice);
  segs.push(
    `${L.full[lang]} → [[press|${lang === "ru" ? "Пресса" : "Press"}]] · [[testimonials|${lang === "ru" ? "Отзывы" : "Testimonials"}]] · [[letters|${lang === "ru" ? "Признание" : "Recognition"}]]`,
  );
  return segs.join("\n\n");
}

// --- studio-level full lists (for world pages) ---

export function listAwards(proofs, lang) {
  return proofsOf(proofs, "award")
    .map((p) => {
      const note = txt(p, "note", lang);
      return `- **${txt(p, "title", lang)}** (${pYear(p)})${note ? ` — ${note}` : ""}`;
    })
    .join("\n");
}

export function buildAwardsTable(proofs, omap, engById, lang) {
  const header =
    lang === "ru"
      ? "| Год | Награда / признание | Кто вручил | Работа | Участие | Детали |\n|-----|-------------------|------------|--------|---------|--------|"
      : "| Year | Award / recognition | Issuer | Work | Engagement | Details |\n|------|---------------------|--------|------|------------|---------|";

  const rows = proofsOf(proofs, "award")
    .map((p) => {
      const title = txt(p, "title", lang);
      const year = pYear(p) || "—";
      const source = proofSource(p, omap, engById, lang) || "—";
      const work = p.work ? `[[${p.work}]]` : "—";
      const eng = p.eng ? `[[${p.eng}]]` : "—";
      const note = txt(p, "note", lang) || "—";
      return `| ${year} | ${title} | ${source} | ${work} | ${eng} | ${note} |`;
    })
    .join("\n");

  return { header, rows };
}

export function listPress(proofs, omap, engById, lang) {
  return proofsOf(proofs, "press")
    .map((p) => {
      const src = proofSource(p, omap, engById, lang);
      const title = txt(p, "title", lang);
      const head = p.url ? `[${title}](${p.url})` : title;
      return `- **${src || title}** — ${head} (${pYear(p)})`;
    })
    .join("\n");
}

export function listTestimonials(proofs, omap, engById, lang) {
  return proofsOf(proofs, "testimonial")
    .map((p) => {
      const src = proofSource(p, omap, engById, lang);
      return `> «${txt(p, "quote", lang)}»\n>\n> — ${src} (${pYear(p)})`;
    })
    .join("\n\n");
}

export function listLetters(proofs, omap, engById, lang) {
  return proofsOf(proofs, "letter")
    .map((p) => {
      const src = proofSource(p, omap, engById, lang) || "";
      const title = txt(p, "title", lang);
      const head = p.site_node ? `[[${p.site_node}|${title}]]` : `**${title}**`;
      const media = p.media ? ` ![[${p.media} | ${title}]]` : "";
      return `- ${head}${src ? ` — ${src}` : ""} (${pYear(p)})${media}`;
    })
    .join("\n");
}
