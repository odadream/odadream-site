// Phase G — apply STRUCTURE-PROPOSED.md to src/content/.
//
// Declarative-first: a few tables at the top describe every transformation
// the migration must perform. The runtime then applies them in a fixed
// order with explicit validation. Idempotent: rerunning after a successful
// pass is a no-op.
//
// Usage:
//   node scripts/audit/restructure.js          # dry-run (default)
//   node scripts/audit/restructure.js --write  # apply
//   node scripts/audit/restructure.js --only=stubs   # one phase

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { ROOT, CONTENT_DIR, readMd, writeMd, log } from "../migrate/lib.js";

const WRITE = process.argv.includes("--write");
const ONLY = (() => {
  const a = process.argv.find((x) => x.startsWith("--only="));
  return a ? a.split("=")[1] : null;
})();
const REGISTRY_DIR = path.join(ROOT, "data/registry");
const MEDIA_TS = path.join(ROOT, "src/data/media.ts");

// ────────────────────────────────────────────────────────────────────────
// DECLARATIVE MAPS
// ────────────────────────────────────────────────────────────────────────

const RENAMES = [
  { from: "hub-objects",                  to: "hub-materia",         aliases: ["hub-objects", "objects"] },
  { from: "hub-agents",                   to: "hub-event-agencies",  aliases: ["hub-agents", "for-agents"] },
  { from: "hub-artists",                  to: "hub-creators",        aliases: ["hub-artists", "for-artists"] },
  { from: "event-wildmint-2025",          to: "event-myata-2025",    aliases: ["event-wildmint-2025"] },
  { from: "event-moscow2030-event-portal-2025", to: "event-portal-2025",         aliases: ["event-moscow2030-event-portal-2025"] },
  { from: "empathy",                      to: "feedback-empathy-brain", aliases: ["empathy"] },
];

const TITLE_PATCHES = [
  { id: "neurobattle", title_ru: "Парадокс Успеха", aliases: ["neurobattle"] },
  { id: "neurosync",   title_ru: "Нейросинхронизация", aliases: ["neurosync-perf"] },
];

const PARENT_MOVES = {
  // Работы → Большие формы
  schrodinger:    "hub-big-forms",
  interference:   "hub-big-forms",
  // Работы → Перформансы
  mindshow:                "hub-performances",
  neurobattle:             "hub-performances",
  "cultural-neuro-code":   "hub-performances",
  "neuro-dance":           "hub-performances",
  neurosync:               "hub-performances",
  gong:                    "hub-performances",
  // Работы → Инсталляции
  dashran:        "hub-installations",
  potustoronniy:  "hub-installations",
  "sync-circle":  "hub-installations",
  // Работы → Материя (после rename hub-objects → hub-materia)
  "mom-baby":  "hub-materia",
  emomandala:  "hub-materia",
  // Технологии (multisync — это протокол, neuromandala — движок)
  multisync:     "hub-tech",
  neuromandala:  "hub-tech",
  // Лекторий
  "brain-hack":  "hub-lectures",
  journey:       "hub-lectures",
  // Лекции остаются (parent уже hub-lectures, но фиксируем в plan для clarity)
  "beautiful-brain":     "hub-lectures",
  "sound-brain":         "hub-lectures",
  "taste-brain":         "hub-lectures",
  "neuroaesthetics-lec": "hub-lectures",
  // События → Выставки (page-as-hubs из старой структуры репозиционируются)
  "hub-terraforming": "hub-exhibitions",
  "hub-chastoti":     "hub-exhibitions",
  "event-mipt-terraforming-2025": "hub-terraforming",
  // Существующий event-portal репозиционируется как series-hub под Фестивали
  "event-portal":       "hub-festivals",
  // События → Фестивали (через series)
  "event-tsiolkovsky-2026": "event-tsiolkovsky",
  "event-byob":         "hub-festivals", // BYOB — серия фестивалей
  "event-myata-2025": "hub-festivals", // Дикая Мята — фестиваль
  // События → Форумы
  "event-cipr-mindshow-2026": "hub-forums",
  "event-tpp-mindshow-2025":  "hub-forums",
  // События → Лекции и образ. программы
  "event-dano-ekoniva-2025":        "hub-edu-corporate",
  "event-sber-lecture-2025":        "hub-edu-corporate",
  "event-merck-corporate":          "hub-edu-corporate",
  "event-tavrida-ai-2025":          "hub-edu-corporate",
  "event-hse-beautiful-brain-2025": "hub-edu-corporate",
  "event-bauman-moscow2030-2025":   "hub-edu-corporate",
  // События → Закрытые показы
  "event-ashram-birthday-2024": "hub-private-shows",
  "event-gonchar-private-2024": "hub-private-shows",
  // Сотрудничество — переименованные хабы parent остаётся hub-collab.
  // hub-galleries → подгруппа hub-institutions per OPEN-6.
  "hub-galleries": "hub-institutions",
  // Перепарентим хабы, которые остались висеть после удаления промежуточных
  "hub-lectures": "hub-home",
  "hub-materia":  "hub-works",
  // Реестр организаций — административный, parent hub-registry удалён → переезжает в hub-world
  "hub-registry-orgs": "hub-world",
  // События, висевшие на registry-* hubs, поднимаются в соответствующую категорию
  "event-portal-2025":  "event-portal",
};

const SUBKIND_FIXES = {
  "event-mipt-terraforming-2025":        "exhibition",
  "event-tsiolkovsky-2026": "festival",
  "event-dano-ekoniva-2025":             "olympiad",
  "event-sber-lecture-2025":             "lecture",
  "event-merck-corporate":               "conference",
  "event-tavrida-ai-2025":               "school",
  "event-hse-beautiful-brain-2025":      "lecture",
  "event-bauman-moscow2030-2025":        "lecture",
};

const NEW_HUBS = [
  { id: "hub-big-forms",     parent: "hub-works",  title_en: "Big Forms",         title_ru: "Большие формы" },
  { id: "hub-performances",  parent: "hub-works",  title_en: "Performances",      title_ru: "Перформансы" },
  { id: "hub-installations", parent: "hub-works",  title_en: "Installations",    title_ru: "Инсталляции" },
  { id: "hub-tech",          parent: "hub-home",   title_en: "Technologies",     title_ru: "Технологии" },
  { id: "hub-exhibitions",   parent: "hub-events", title_en: "Exhibitions",      title_ru: "Выставки" },
  { id: "hub-festivals",     parent: "hub-events", title_en: "Festivals",        title_ru: "Фестивали" },
  { id: "hub-forums",        parent: "hub-events", title_en: "Forums",           title_ru: "Форумы / конф." },
  { id: "hub-edu-corporate", parent: "hub-events", title_en: "Lectures & Programs", title_ru: "Лекции и образ. программы" },
  { id: "hub-private-shows", parent: "hub-events", title_en: "Private Shows",    title_ru: "Закрытые показы" },
  { id: "event-tsiolkovsky",   parent: "hub-festivals", title_en: "Tsiolkovsky Fest", title_ru: "Циолковский" },
  // event-portal уже существует — репозиционируется через PARENT_MOVES
  { id: "event-gong-fest",     parent: "hub-festivals", title_en: "Gong Fest",       title_ru: "Гонг фест" },
  { id: "hub-collab-media",  parent: "hub-collab", title_en: "Media",             title_ru: "Медиа" },
];

const STUBS = [
  // Big forms
  { id: "ancestors", parent: "hub-big-forms", kind: "product", subkind: "art",
    title_en: "Ancestors in the Noise", title_ru: "Предки в шуме" },
  // Installations
  { id: "honors", parent: "hub-installations", kind: "product", subkind: "art",
    title_en: "Honor Board (Skolkovo)", title_ru: "Нейродоска почёта (Сколково)" },
  { id: "another-people", parent: "hub-installations", kind: "product", subkind: "art",
    title_en: "Others", title_ru: "Другие люди" },
  // Материя
  { id: "oda-rings",  parent: "hub-materia", kind: "product", subkind: "art", title_en: "ODA.dream Rings", title_ru: "Кольца ODA.dream" },
  { id: "fourth-dimension", parent: "hub-materia", kind: "product", subkind: "art", title_en: "Fourth Dimension", title_ru: "4-е измерение" },
  { id: "voronka",    parent: "hub-materia", kind: "product", subkind: "art", title_en: "Funnel",     title_ru: "Воронка" },
  { id: "happiness",  parent: "hub-materia", kind: "product", subkind: "art", title_en: "Happiness",  title_ru: "Счастье" },
  { id: "lighthouse", parent: "hub-materia", kind: "product", subkind: "art", title_en: "Lighthouse", title_ru: "Маяк" },
  // Технологии
  { id: "neuromandala-os", parent: "hub-tech", kind: "product", subkind: "tech",
    title_en: "Neuromandala OS", title_ru: "Нейромандала OS" },
  { id: "hyperscan-scene-engine", parent: "hub-tech", kind: "product", subkind: "tech",
    title_en: "Hyperscan Scene Engine", title_ru: "Hyperscan Scene Engine", aliases: ["hyperscan"] },
  // Лекторий — feedback-empathy-brain создаётся через RENAMES (empathy → feedback-empathy-brain),
  // потому что у empathy есть нетривиальный body, который надо сохранить.
  { id: "meditation-brain", parent: "hub-lectures", kind: "product", subkind: "education",
    title_en: "Brain & Meditation", title_ru: "Мозг и медитация" },
  // Выставки stubs
  { id: "unique-russia", parent: "hub-exhibitions", kind: "event", subkind: "exhibition",
    title_en: "Unique Russia 2026", title_ru: "Уникальная Россия 2026" },
  { id: "pleinair-metro", parent: "hub-exhibitions", kind: "event", subkind: "exhibition",
    title_en: "Plein-air in Metro", title_ru: "Плэнер в метро" },
  { id: "pleinair-bashkiria", parent: "hub-exhibitions", kind: "event", subkind: "exhibition",
    title_en: "Digital plein-air, Bashkiria", title_ru: "Цифровой плэнер в Башкирии" },
  // Форумы stubs
  { id: "event-kod-provincii", parent: "hub-forums", kind: "event", subkind: "forum",
    title_en: "Code of Province", title_ru: "Код провинции" },
  { id: "event-techweek", parent: "hub-forums", kind: "event", subkind: "forum",
    title_en: "TechWeek", title_ru: "TechWeek" },
  { id: "event-bitva-milliard-2024", parent: "hub-forums", kind: "event", subkind: "forum",
    title_en: "Battle for a Billion 2024", title_ru: "Битва за миллиард 2024" },
  { id: "event-brics-plus", parent: "hub-forums", kind: "event", subkind: "forum",
    title_en: "BRICS+", title_ru: "BRICS+" },
  // Series children
  { id: "event-tsiolkovsky-2025", parent: "event-tsiolkovsky", kind: "event", subkind: "festival",
    title_en: "Tsiolkovsky Fest 2025", title_ru: "Циолковский фест 2025" },
  { id: "tsiolkovsky-2026", parent: "event-tsiolkovsky", kind: "event", subkind: "festival",
    title_en: "Tsiolkovsky Fest 2026", title_ru: "Циолковский фест 2026" },
  { id: "event-portal-2024", parent: "event-portal", kind: "event", subkind: "festival",
    title_en: "Portal 2030–2050 (2024)", title_ru: "Портал 2030–2050 (2024)" },
  { id: "event-gong-fest-2024", parent: "event-gong-fest", kind: "event", subkind: "festival",
    title_en: "Gong Fest 2024", title_ru: "Гонг фест 2024" },
  { id: "event-gong-fest-2025", parent: "event-gong-fest", kind: "event", subkind: "festival",
    title_en: "Gong Fest 2025", title_ru: "Гонг фест 2025" },
  // О нас
  { id: "awards",   parent: "hub-world", title_en: "Awards",   title_ru: "Награды" },
  { id: "partners", parent: "hub-world", title_en: "Partners", title_ru: "Партнёры" },
  { id: "clients",  parent: "hub-world", title_en: "Clients",  title_ru: "Клиенты" },
  { id: "collabs",  parent: "hub-world", title_en: "Collabs",  title_ru: "Коллабы" },
];

// Re-parent these children of soon-to-be-deleted hubs.
const REPARENT_ON_HUB_DELETION = {
  // hub-edu-corporate goes under hub-events, but event-tavrida-ai's parent was hub-festivals
  // (it's now hub-festivals in moves, will need to migrate too)
};

// Bodies merged into another node before deletion.
const BODY_MERGES = [
  { from: "hub-team", into: "hub-cv", section: "## Команда / Team" },
];

const DELETIONS = [
  "hub-works-art", "hub-works-education", "hub-works-tech",
  "hub-research", "hub-practices", "hub-games", "hub-pleinair",
  "hub-registry", "hub-registry-commercial", "hub-registry-expert",
  // hub-registry-orgs и hub-letters сохраняем как реестры-архивы (cap accepted)
  "hub-team", "hub-changelog",
  "art-brain", "color-brain", "jewellery", "heritage", "coaching", "workshops",
];

// ────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────

const stats = {
  validated: 0,
  titlesPatched: 0,
  parentsMoved: 0,
  subkindsFixed: 0,
  hubsCreated: 0,
  stubsCreated: 0,
  filesRenamed: 0,
  bodiesMerged: 0,
  filesDeleted: 0,
  wikilinksPatched: 0,
};

const errors = [];

function fileForId(id) {
  return path.join(CONTENT_DIR, `${id}.md`);
}

function exists(id) {
  return fs.existsSync(fileForId(id));
}

function mergeAliases(existing, incoming) {
  const set = new Set();
  for (const a of Array.isArray(existing) ? existing : (existing ? [existing] : [])) set.add(a);
  for (const a of incoming) set.add(a);
  return [...set];
}

function safeMv(oldP, newP) {
  if (!WRITE) return;
  const rel = (p) => path.relative(process.cwd(), p).replace(/\\/g, "/");
  try { execSync(`git mv "${rel(oldP)}" "${rel(newP)}"`, { stdio: "pipe" }); }
  catch { fs.renameSync(oldP, newP); }
}

function safeRm(p) {
  if (!WRITE) return;
  const rel = path.relative(process.cwd(), p).replace(/\\/g, "/");
  try { execSync(`git rm "${rel}"`, { stdio: "pipe" }); }
  catch { fs.unlinkSync(p); }
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function textualReplaceAll(text, mapping) {
  let out = text;
  for (const [oldId, newId] of mapping) {
    const re = new RegExp(`(?<![\\w-])${escapeRe(oldId)}(?![\\w-])`, "g");
    out = out.replace(re, newId);
  }
  return out;
}

// ────────────────────────────────────────────────────────────────────────
// Phases
// ────────────────────────────────────────────────────────────────────────

function validate() {
  console.log("\n── PHASE 1: validate ───────────────────────────");
  const newHubIds = new Set(NEW_HUBS.map((h) => h.id));
  const stubIds = new Set(STUBS.map((s) => s.id));
  const renameTargets = new Set(RENAMES.map((r) => r.to));

  // 1. PARENT_MOVES: source must exist; if not, this entry is no-op (silently skip).
  for (const [child, parent] of Object.entries(PARENT_MOVES)) {
    if (!exists(child)) continue;
    if (!exists(parent) && !newHubIds.has(parent) && !stubIds.has(parent) && !renameTargets.has(parent)) {
      errors.push(`PARENT_MOVES: target parent "${parent}" (for "${child}") missing and not being created`);
    }
  }
  // 2. RENAMES: catch real conflicts only (both ends missing, or both exist).
  for (const r of RENAMES) {
    const fromOK = exists(r.from), toOK = exists(r.to);
    if (!fromOK && !toOK) errors.push(`RENAMES: neither source "${r.from}" nor target "${r.to}" found`);
    if (fromOK && toOK)   errors.push(`RENAMES: both source "${r.from}" and target "${r.to}" exist (collision)`);
  }
  // 3. STUBS / NEW_HUBS: silent skip when already created. No error.
  // 4. DELETIONS: silent skip when missing. No error.
  // 5. Deletions must not be referenced by PARENT_MOVES (as target).
  const moveTargets = new Set(Object.values(PARENT_MOVES));
  for (const d of DELETIONS) if (moveTargets.has(d)) errors.push(`DELETIONS: "${d}" is target of PARENT_MOVES`);

  stats.validated = errors.length === 0 ? 1 : 0;
  if (errors.length) {
    console.log(`  ✗ ${errors.length} error(s):`);
    for (const e of errors) console.log(`    - ${e}`);
  } else {
    console.log("  ✓ all checks passed (idempotent)");
  }
  return errors.length === 0;
}

function patchTitles() {
  console.log("\n── PHASE 2: title + alias patches ──────────────");
  for (const t of TITLE_PATCHES) {
    const p = fileForId(t.id);
    const md = readMd(p);
    if (!md) { log("warn", t.id, "not found"); continue; }
    const fm = md.fm;
    let changed = false;
    if (t.title_ru && fm.title_ru !== t.title_ru) { fm.title_ru = t.title_ru; changed = true; }
    if (t.title_en && fm.title_en !== t.title_en) { fm.title_en = t.title_en; changed = true; }
    if (t.aliases) {
      const merged = mergeAliases(fm.aliases, t.aliases);
      if (JSON.stringify(merged) !== JSON.stringify(fm.aliases ?? [])) {
        fm.aliases = merged; changed = true;
      }
    }
    if (changed) {
      writeMd(p, fm, md.body, { dryRun: !WRITE });
      stats.titlesPatched++;
      log("ok", t.id, `title/alias updated`);
    }
  }
}

function moveParents() {
  console.log("\n── PHASE 3: parent moves ──────────────────────");
  for (const [id, parent] of Object.entries(PARENT_MOVES)) {
    const p = fileForId(id);
    const md = readMd(p);
    if (!md) continue;
    if (md.fm.parent === parent) continue;
    md.fm.parent = parent;
    writeMd(p, md.fm, md.body, { dryRun: !WRITE });
    stats.parentsMoved++;
    log("ok", id, `parent → ${parent}`);
  }
}

function patchSubkinds() {
  console.log("\n── PHASE 4: subkind fixes ─────────────────────");
  for (const [id, subkind] of Object.entries(SUBKIND_FIXES)) {
    const p = fileForId(id);
    const md = readMd(p);
    if (!md) continue;
    if (md.fm.subkind === subkind) continue;
    md.fm.subkind = subkind;
    writeMd(p, md.fm, md.body, { dryRun: !WRITE });
    stats.subkindsFixed++;
    log("ok", id, `subkind → ${subkind}`);
  }
}

function createHubs() {
  console.log("\n── PHASE 5: create hubs ────────────────────────");
  for (const h of NEW_HUBS) {
    if (exists(h.id)) continue;
    const fm = {
      id: h.id,
      parent: h.parent,
      title_en: h.title_en,
      title_ru: h.title_ru,
      type: "hub",
      tags: [],
    };
    const body = `## ${h.title_en}\n\n${h.title_en}.\n\n---RU---\n\n## ${h.title_ru}\n\n${h.title_ru}.\n`;
    writeMd(fileForId(h.id), fm, body, { dryRun: !WRITE });
    stats.hubsCreated++;
    log("ok", h.id, `hub created (parent: ${h.parent})`);
  }
}

function createStubs() {
  console.log("\n── PHASE 6: create stubs ───────────────────────");
  for (const s of STUBS) {
    if (exists(s.id)) continue;
    const fm = {
      id: s.id,
      parent: s.parent,
      title_en: s.title_en,
      title_ru: s.title_ru,
      type: "content",
      tags: [],
      ...(s.kind ? { kind: s.kind } : {}),
      ...(s.subkind ? { subkind: s.subkind } : {}),
      ...(s.aliases ? { aliases: s.aliases } : {}),
    };
    const body = `## ${s.title_en}\n\nStub — created by Phase G restructure. Fill in details.\n\n---RU---\n\n## ${s.title_ru}\n\nЗаглушка — создана аудитом Phase G. Дополнить.\n`;
    writeMd(fileForId(s.id), fm, body, { dryRun: !WRITE });
    stats.stubsCreated++;
    log("ok", s.id, `stub (parent: ${s.parent})`);
  }
}

function renameFiles() {
  console.log("\n── PHASE 7: rename files + wikilink rewrite ──");
  // Build rename map for textual replace.
  const mapping = RENAMES.map((r) => [r.from, r.to]);

  for (const r of RENAMES) {
    const oldP = fileForId(r.from);
    const newP = fileForId(r.to);
    if (!fs.existsSync(oldP)) continue;
    if (fs.existsSync(newP)) { log("warn", r.from, `target ${r.to}.md exists, skipping mv`); continue; }
    safeMv(oldP, newP);
    stats.filesRenamed++;
    log("ok", `${r.from}.md → ${r.to}.md`);
    // Also patch id + aliases in the renamed file.
    if (WRITE && fs.existsSync(newP)) {
      const md = readMd(newP);
      if (md) {
        md.fm.id = r.to;
        md.fm.aliases = mergeAliases(md.fm.aliases, r.aliases);
        writeMd(newP, md.fm, md.body, { dryRun: false });
      }
    }
  }

  // Textual replace across content, registry, media.
  const walkDir = (dir, ext) => fs.readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .map((f) => path.join(dir, f));
  const patchTargets = [
    ...walkDir(CONTENT_DIR, ".md"),
    ...walkDir(REGISTRY_DIR, ".yaml"),
    MEDIA_TS,
  ];
  let patched = 0;
  for (const p of patchTargets) {
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, "utf8");
    const out = textualReplaceAll(raw, mapping);
    if (out !== raw) {
      if (WRITE) fs.writeFileSync(p, out, "utf8");
      patched++;
    }
  }
  stats.wikilinksPatched = patched;
  console.log(`  ${patched} file(s) had wikilinks rewritten`);
}

function mergeBodies() {
  console.log("\n── PHASE 8: body merges ────────────────────────");
  for (const m of BODY_MERGES) {
    const fromP = fileForId(m.from);
    const intoP = fileForId(m.into);
    if (!fs.existsSync(fromP)) continue;
    if (!fs.existsSync(intoP)) { log("warn", m.into, "destination not found"); continue; }
    const src = readMd(fromP);
    const dst = readMd(intoP);
    if (!src || !dst) continue;
    const merged = `${dst.body.trim()}\n\n${m.section}\n\n${src.body.trim()}\n`;
    writeMd(intoP, dst.fm, merged, { dryRun: !WRITE });
    stats.bodiesMerged++;
    log("ok", `${m.from} body merged into ${m.into}`);
  }
}

function deleteFiles() {
  console.log("\n── PHASE 9: delete files ───────────────────────");
  for (const id of DELETIONS) {
    const p = fileForId(id);
    if (!fs.existsSync(p)) continue;
    safeRm(p);
    stats.filesDeleted++;
    log("ok", id, "deleted");
  }
}

function summary() {
  console.log("\n══ SUMMARY ═════════════════════════════════════");
  console.log(`  ${WRITE ? "✏️  WRITE" : "🔍 DRY-RUN"}`);
  console.log(`  titles patched:        ${stats.titlesPatched}`);
  console.log(`  parents moved:         ${stats.parentsMoved}`);
  console.log(`  subkinds fixed:        ${stats.subkindsFixed}`);
  console.log(`  hubs created:          ${stats.hubsCreated}`);
  console.log(`  stubs created:         ${stats.stubsCreated}`);
  console.log(`  files renamed:         ${stats.filesRenamed}`);
  console.log(`  wikilinks file-patches:${stats.wikilinksPatched}`);
  console.log(`  bodies merged:         ${stats.bodiesMerged}`);
  console.log(`  files deleted:         ${stats.filesDeleted}`);
  console.log(`  validation:            ${stats.validated ? "passed" : "FAILED"}`);
  if (!WRITE) console.log("\n→ Run with --write to apply.");
}

// ────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────

console.log(`\nPhase G — Lotus restructure  ${WRITE ? "[WRITE]" : "[DRY-RUN]"}`);

const phases = {
  validate, titles: patchTitles, moves: moveParents, subkinds: patchSubkinds,
  hubs: createHubs, stubs: createStubs, renames: renameFiles,
  merges: mergeBodies, deletions: deleteFiles,
};

if (ONLY) {
  if (!phases[ONLY]) { console.error(`unknown phase: ${ONLY}`); process.exit(1); }
  phases[ONLY]();
} else {
  if (!validate()) {
    console.log("\n  Validation failed — fix declarative maps and re-run.\n");
    summary();
    process.exit(1);
  }
  patchTitles();
  moveParents();
  patchSubkinds();
  createHubs();
  createStubs();
  renameFiles();
  mergeBodies();
  deleteFiles();
}
summary();
