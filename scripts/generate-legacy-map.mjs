import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import YAML from 'yaml';

const sourceDir = resolve(process.argv[2] || '../odadream-site-archive-2026-09-21/src/content');
const target = resolve('src/data/legacy-map.json');
const overrides = {
  neuromandala: ['/technology/#method-overview', 'Method overview / Обзор метода'],
  'event-portal-2025': ['/cases/#case-portal-2025', 'Selected historical context / Исторический контекст'],
  'event-myata-2025': [
    '/cases/#case-wildmint-2025',
    'Lecture and performance context / Контекст лекции и перформанса',
  ],
  'event-cipr-mindshow-2026': [
    '/cases/#case-cipr-2026',
    'Invited presentation context / Контекст приглашённого участия',
  ],
  'proof-award-portal-visioning': [
    '/recognition/#recognition-portal-2030-2025',
    'Bounded award record / Наградная запись',
  ],
  'proof-mipt-letter': [
    '/recognition/#recognition-mipt-letter-2025',
    'Letter record with missing scan / Запись письма без скана',
  ],
  'proof-let-hse-beautiful-brain': [
    '/recognition/#recognition-hse-letter-2025',
    'Letter for a specific lecture / Письмо о лекции',
  ],
  'proof-let-tavrida': [
    '/recognition/#recognition-tavrida-letter-2025',
    'Participation letter / Письмо об участии',
  ],
  'emomandala-os': [
    '/works/emomandala/#work-story-selection',
    'Method element within Emomandala / Метод внутри Эмомандалы',
  ],
  'media-oda-rings-story': ['/works/oda-rings/#work-story-history', 'Edited rings chronicle / История колец'],
  'media-oda-rings-drawings': [
    '/works/oda-rings/#document-oda-rings-drawings',
    'Historical manufacturing PDF / Архивный чертёж',
  ],
  'media-oda-rings-banner': [
    '/works/oda-rings/#document-oda-rings-banner',
    'Historical exhibition PDF / Архивный баннер',
  ],
  'hub-host-events': ['/formats/', 'Merged format overview / Обзор форматов'],
  'hub-lectures': ['/formats/#talk-workshop', 'Educational format / Образовательный формат'],
  'hub-institutions': [
    '/cooperation/#for-institutions',
    'Institutional scenario / Институциональный сценарий',
  ],
  'hub-galleries': ['/cooperation/#for-institutions', 'Curatorial scenario / Кураторский сценарий'],
  'hub-event-agencies': ['/cooperation/#for-events', 'Agency scenario / Сценарий для агентств'],
  'hub-business': ['/cooperation/#for-events', 'Event scenario / Сценарий событий'],
  'hub-education': ['/cooperation/#for-education', 'Educational scenario / Образовательный сценарий'],
  'hub-creators': ['/cooperation/#for-production', 'Co-production scenario / Сценарий ко-продукции'],
  'hub-home': ['/', 'Home / Главная'],
  'hub-works': ['/works/', 'Works / Работы'],
  'hub-collab': ['/cooperation/', 'Cooperation / Сотрудничество'],
  'hub-world': ['/studio/', 'Studio / Студия'],
  'hub-team': ['/studio/#people', 'People / Люди'],
  'hub-cv': ['/studio/', 'Edited duo profile / Профиль дуэта'],
  'hub-manifesto': ['/studio/#method', 'Artistic position and ethics / Позиция и этика'],
  'event-hse-beautiful-brain-2025': [
    '/studio/#teaching-hse',
    'Educational context / Образовательный контекст',
  ],
  'event-sber-lecture-2025': [
    '/studio/#teaching-sber',
    'Invited lecture context / Контекст приглашённой лекции',
  ],
  'event-mipt-terraforming-2025': [
    '/studio/#teaching-mipt',
    'Exhibition and workshop context / Выставочный и образовательный контекст',
  ],
  'hub-events': ['/cases/', 'Cases / Кейсы'],
  'hub-registry': ['/cases/', 'Cases / Кейсы'],
  'hub-letters': ['/studio/#evidence', 'Evidence policy / Подтверждения'],
  'hub-testimonials': ['/studio/#evidence', 'Evidence policy / Подтверждения'],
  'hub-contacts': ['/contact/', 'Contact / Контакт'],
  interference: ['/works/interference-of-realities/', 'Exact work / Работа'],
  mindshow: ['/works/mindshow/', 'Exact work / Работа'],
  neurobattle: ['/works/neurobattle/', 'Exact work / Работа'],
  schrodinger: ['/works/project-schrodinger/', 'Exact work / Работа'],
  'oda-rings': ['/works/oda-rings/', 'Exact work / Работа'],
  emomandala: ['/works/emomandala/', 'Exact work / Работа'],
  neurosync: ['/works/neurosynchronization/', 'Exact work / Работа'],
  ancestors: ['/works/ancestors-in-the-noise/', 'Exact work / Работа'],
  'sync-circle': ['/works/sync-circle/', 'Exact work / Работа'],
  'event-tsiolkovsky-2026': ['/cases/tsiolkovsky-festival-2026/', 'Exact case / Кейс'],
  'event-tsiolkovsky-2025': ['/cases/tsiolkovsky-laboratory-2025/', 'Exact case / Кейс'],
  'event-dano-ekoniva-2025': ['/cases/dano-2025/', 'Exact case / Кейс'],
  'event-byob-2026': ['/cases/byob-2026/', 'Exact case / Кейс'],
};
const entries = new Map();
for (const filename of (await readdir(sourceDir)).filter((name) => name.endsWith('.md')).sort()) {
  const raw = await readFile(resolve(sourceDir, filename), 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`Missing frontmatter: ${filename}`);
  const fm = YAML.parse(match[1]);
  const id = String(fm.id || '').trim();
  if (!id) throw new Error(`Missing id: ${filename}`);
  const hash = createHash('sha256').update(raw).digest('hex');
  const previous = entries.get(id);
  if (previous) {
    if (previous.hash !== hash) throw new Error(`Conflicting duplicate ID: ${id}`);
    previous.duplicateSources.push(filename);
    continue;
  }
  const [suffix, note] = overrides[id] || [null, 'Not curated for V2 / Не отобрано в V2'];
  entries.set(id, {
    id,
    source: basename(filename),
    duplicateSources: [],
    kind: fm.kind || fm.type || 'untyped',
    visibility: fm.visible === false ? 'hidden' : 'visible',
    access: fm.access || 'unspecified',
    disposition: suffix ? (suffix.includes('#') ? 'anchor' : 'page') : 'not-transferred',
    targetEn: suffix ? `/en${suffix}` : '/legacy/unavailable/',
    targetRu: suffix ? `/ru${suffix}` : '/legacy/unavailable/',
    note,
    hash,
  });
}
const rows = [...entries.values()].sort((a, b) => a.id.localeCompare(b.id, 'en'));
if (rows.length !== 238) throw new Error(`Expected 238 unique legacy IDs, got ${rows.length}`);
await writeFile(target, JSON.stringify(rows, null, 2) + '\n');
console.log(`Wrote ${rows.length} explicit legacy mappings to ${target}`);
