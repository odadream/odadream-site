import type { Page } from './routes';

export function resolveLegacyRoutes(
  rows: { id: string; aliases?: string[]; targetEn: string; targetRu: string }[],
  pages: Pick<Page, 'path' | 'anchors'>[],
) {
  const availablePages = new Map(pages.map((page) => [page.path, page]));
  const target = (id: string, lang: string, path: string) => {
    const [base, fragment] = path.split('#');
    const page = availablePages.get(base);
    try {
      if (page && (!fragment || page.anchors?.includes(decodeURIComponent(fragment)))) return path;
    } catch {
      // A malformed fragment must not break the compatibility index for every other ID.
    }
    // Includes explicit not-transferred records: retain their identity and language too.
    return `/legacy/unavailable/?id=${encodeURIComponent(id)}&lang=${lang}`;
  };
  return Object.fromEntries(
    rows.flatMap((row) =>
      [row.id, ...(row.aliases ?? [])].map((id) => [
        id,
        [target(id, 'en', row.targetEn), target(id, 'ru', row.targetRu)],
      ]),
    ),
  );
}
