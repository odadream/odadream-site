import type { Page } from './routes';

export function resolveLegacyRoutes(
  rows: { id: string; targetEn: string; targetRu: string }[],
  pages: Pick<Page, 'path' | 'anchors'>[],
) {
  const paths = new Set(pages.map((page) => page.path));
  const target = (id: string, lang: string, path: string) => {
    const [base, fragment] = path.split('#');
    const page = pages.find((row) => row.path === base);
    if (
      (paths.has(base) && (!fragment || page?.anchors?.includes(decodeURIComponent(fragment)))) ||
      path.startsWith('/legacy/unavailable/')
    )
      return path;
    return `/legacy/unavailable/?id=${encodeURIComponent(id)}&lang=${lang}`;
  };
  return Object.fromEntries(
    rows.map((row) => [row.id, [target(row.id, 'en', row.targetEn), target(row.id, 'ru', row.targetRu)]]),
  );
}
