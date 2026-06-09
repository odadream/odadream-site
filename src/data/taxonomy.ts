import type { Kind, LocalizedString } from "../types";

/**
 * Subkind registry — UI metadata for known subtypes of each entity kind.
 *
 * Add a new subtype by appending an entry below + using its key in node
 * frontmatter. No TS code change is required elsewhere — unknown subkinds
 * fall back to a neutral default (see `subkindMeta`).
 *
 * Mirroring this in Obsidian: add tag `kind/<subkind>` (e.g. `product/art`)
 * to enable tag-pane filtering and Dataview queries. The site treats the
 * `subkind` frontmatter field as the source of truth; the tag is derived.
 */

export interface SubkindMeta {
  label: LocalizedString;
  /** lucide-react icon name */
  icon: string;
  /** Tailwind colour family used for badge/chip — picked from the project palette */
  color:
    | "amber"
    | "cyan"
    | "sky"
    | "purple"
    | "emerald"
    | "rose"
    | "indigo"
    | "stone"
    | "teal"
    | "fuchsia"
    | "lime"
    | "orange";
}

type SubkindMap = Record<string, SubkindMeta>;

export const TAXONOMY: Record<Kind, SubkindMap> = {
  product: {
    art:       { label: { en: "Art",        ru: "Художественные" }, icon: "Palette",    color: "amber" },
    education: { label: { en: "Education",  ru: "Образование" },    icon: "BookOpen",   color: "cyan" },
    tech:      { label: { en: "Tech",       ru: "Технологии" },     icon: "Cpu",        color: "sky" },
    game:      { label: { en: "Game",       ru: "Игра" },           icon: "Gamepad2",   color: "teal" },
  },
  event: {
    series:       { label: { en: "Event series", ru: "Серия событий" },    icon: "Layers",       color: "purple" },
    festival:     { label: { en: "Festival",     ru: "Фестиваль" },        icon: "Sparkles",     color: "purple" },
    lab:          { label: { en: "Lab",          ru: "Лаборатория" },      icon: "FlaskConical", color: "emerald" },
    exhibition:   { label: { en: "Exhibition",   ru: "Выставка" },         icon: "Image",        color: "rose" },
    forum:        { label: { en: "Forum",        ru: "Форум" },            icon: "Users",        color: "indigo" },
    lecture:      { label: { en: "Lecture",      ru: "Лекция" },           icon: "BookOpen",     color: "cyan" },
    school:       { label: { en: "School",       ru: "Школа" },            icon: "GraduationCap", color: "cyan" },
    olympiad:     { label: { en: "Olympiad",     ru: "Олимпиада" },       icon: "Trophy",       color: "amber" },
    private_show: { label: { en: "Private show", ru: "Закрытый показ" },   icon: "Lock",         color: "stone" },
    workshop:     { label: { en: "Workshop",     ru: "Воркшоп" },          icon: "Hammer",       color: "teal" },
    conference:   { label: { en: "Conference",   ru: "Конференция" },      icon: "Mic",          color: "indigo" },
    competition:  { label: { en: "Competition",  ru: "Конкурс" },          icon: "Trophy",       color: "amber" },
  },
  collaboration: {
    person:      { label: { en: "Person",      ru: "Персона" },       icon: "UserRound",     color: "fuchsia" },
    ensemble:    { label: { en: "Ensemble",    ru: "Коллектив" },     icon: "Users",         color: "purple" },
    duo:         { label: { en: "Duo",         ru: "Дуэт" },          icon: "Handshake",     color: "emerald" },
    institution: { label: { en: "Institution", ru: "Институция" },    icon: "Building2",     color: "sky" },
  },
  organizer: {
    curator:    { label: { en: "Curator",     ru: "Куратор" },       icon: "UserRound",     color: "fuchsia" },
    university: { label: { en: "University",  ru: "Университет" },   icon: "GraduationCap", color: "cyan" },
    corporate:  { label: { en: "Corporate",   ru: "Корпорация" },    icon: "Building2",     color: "sky" },
    venue:      { label: { en: "Venue",       ru: "Площадка" },      icon: "MapPin",        color: "rose" },
    gov:        { label: { en: "Government",  ru: "Государственный" }, icon: "Landmark",    color: "stone" },
    media:      { label: { en: "Media",       ru: "Медиа" },         icon: "Radio",         color: "fuchsia" },
    ngo:        { label: { en: "NGO",         ru: "НКО" },           icon: "HeartHandshake", color: "emerald" },
  },
  proof: {
    award:       { label: { en: "Award",       ru: "Награда" },         icon: "Award",       color: "amber" },
    letter:      { label: { en: "Letter",      ru: "Письмо" },          icon: "Mail",        color: "stone" },
    testimonial: { label: { en: "Testimonial", ru: "Отзыв" },           icon: "Quote",       color: "emerald" },
    press:       { label: { en: "Press",       ru: "Пресса" },          icon: "Newspaper",   color: "indigo" },
    review:      { label: { en: "Review",      ru: "Рецензия" },        icon: "BookMarked",  color: "purple" },
    interview:   { label: { en: "Interview",   ru: "Интервью" },        icon: "Mic2",        color: "fuchsia" },
  },
  media: {
    video:   { label: { en: "Video",   ru: "Видео" },    icon: "Film",       color: "rose" },
    photo:   { label: { en: "Photo",   ru: "Фото" },     icon: "Image",      color: "amber" },
    sketch:  { label: { en: "Sketch",  ru: "Эскиз" },    icon: "PencilLine", color: "stone" },
    teaser:  { label: { en: "Teaser",  ru: "Тизер" },    icon: "Sparkle",    color: "purple" },
    post:    { label: { en: "Post",    ru: "Пост" },     icon: "MessageSquare", color: "cyan" },
    text:    { label: { en: "Text",    ru: "Текст" },    icon: "FileText",   color: "stone" },
  },
};

/**
 * Bilingual labels for the kinds themselves (used as section headings).
 */
export const KIND_LABELS: Record<Kind, LocalizedString> = {
  product:   { en: "Product",    ru: "Продукт" },
  event:     { en: "Event",      ru: "Событие" },
  organizer:     { en: "Organizer",      ru: "Организатор" },
  collaboration: { en: "Collaboration",  ru: "Коллаборация" },
  proof:         { en: "Proof",          ru: "Пруф" },
  media:     { en: "Media",      ru: "Медиа" },
};

const capitalize = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

const FALLBACK_META: SubkindMeta = {
  label: { en: "—", ru: "—" },
  icon: "Tag",
  color: "stone",
};

/**
 * Resolve UI metadata for a (kind, subkind) pair. Returns a graceful fallback
 * for unknown subkinds so the UI never breaks when content evolves.
 */
export function subkindMeta(kind?: Kind, subkind?: string): SubkindMeta {
  if (!kind || !subkind) return FALLBACK_META;
  const map = TAXONOMY[kind];
  if (map && map[subkind]) return map[subkind];
  const pretty = capitalize(subkind.replace(/_/g, " "));
  return { ...FALLBACK_META, label: { en: pretty, ru: pretty } };
}
