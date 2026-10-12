import type { PageFamily } from './page-codes';
export interface PageChapter {
  id: string;
  title: string;
  family: PageFamily;
  section: number;
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
