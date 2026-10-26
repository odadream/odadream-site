import { cases } from '../data/catalogue';
import { caseUrl } from './routes';
import type { Lang } from '../data/site';
import type { MediaItem } from './media-presentation';
/** Only a unique sourced relation becomes a date/event label; shared illustration is not evidence of a photo date. */
export function galleryMetadata(item: MediaItem, lang: Lang, contextEventId?: string) {
  const selected = cases.filter((event) =>
    event.workSelections?.some((selection) => selection.media.includes(item.id)),
  );
  const related = selected.length
    ? selected
    : cases.filter((event) => [...event.media, ...(event.presentationMedia ?? [])].includes(item.id));
  const event = related.length === 1 ? related[0] : undefined;
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
