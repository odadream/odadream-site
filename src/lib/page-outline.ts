import type { PageFamily } from './page-codes';
export interface PageChapter {
  id: string;
  title: string;
  family: PageFamily;
  section: number;
}

/** First record of each year, using the same descending order as the archive. */
export function caseYearLinks(items: readonly { date: string; slug: string; context: string }[]) {
  const seen = new Set<string>();
  const links: { year: string; href: string }[] = [];
  for (const item of [...items].sort((a, b) => b.date.localeCompare(a.date))) {
    const year = item.date.slice(0, 4);
    if (seen.has(year)) continue;
    seen.add(year);
    links.push({ year, href: `#case-${item.slug}` });
  }
  return links;
}
/** Encoded section metadata is emitted by shared section components, then read from their rendered slot. */
export const chapterMarker = (chapter: PageChapter) => encodeURIComponent(JSON.stringify(chapter));
export function pageChapters(html: string): PageChapter[] {
  const chapters: PageChapter[] = [];
  const ids = new Set<string>();
  for (const match of html.matchAll(/data-page-chapter="([^"]+)"/g)) {
    const chapter: PageChapter = JSON.parse(decodeURIComponent(match[1]));
    if (!ids.has(chapter.id)) {
      chapters.push(chapter);
      ids.add(chapter.id);
    }
  }
  return chapters;
}
