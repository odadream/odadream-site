import { cases } from '../data/catalogue';
import { caseUrl } from './routes';
import type { Lang } from '../data/site';
import type { MediaItem } from './media-presentation';
type Event = (typeof cases)[number];
const related = new Map<string, Set<Event>>();
const selected = new Map<string, Set<Event>>();
const add = (index: Map<string, Set<Event>>, id: string, event: Event) => {
  if (!index.has(id)) index.set(id, new Set());
  index.get(id)!.add(event);
};
// Index the immutable publication catalogue once, rather than scanning it for every rendered frame.
for (const event of cases) {
  for (const id of new Set([...event.media, ...(event.presentationMedia ?? [])])) add(related, id, event);
  for (const selection of event.workSelections ?? [])
    for (const id of selection.media) add(selected, id, event);
}
/** Only a unique sourced relation becomes a date/event label; shared illustration is not evidence of a photo date. */
export function galleryMetadata(item: MediaItem, lang: Lang, contextEventId?: string) {
  const matches = selected.get(item.id) ?? related.get(item.id);
  const event = matches?.size === 1 ? matches.values().next().value : undefined;
  return {
    title:
      item.description?.[lang] ??
      (item.representation === 'photograph' && item.alt[lang] !== item.caption[lang]
        ? item.alt[lang]
        : item.caption[lang]),
    event:
      event && event.id !== contextEventId
        ? {
            id: event.id,
            title: event.title[lang],
            date: event.date.slice(0, 4),
            href: caseUrl(lang, event.id),
          }
        : undefined,
  };
}
