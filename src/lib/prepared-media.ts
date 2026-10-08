import { preparedMedia } from '../data/prepared-media';
import type { PreparedImage } from '../data/prepared-media-types';

export type DocumentPage = Pick<PreparedImage, 'src' | 'width' | 'height' | 'bytes'>;
export type NumberedDocumentPage = DocumentPage & { pageNumber?: number };
export function documentPages(href: string, selectedPages?: number[]): NumberedDocumentPage[] {
  return (preparedMedia[href]?.images ?? []).flatMap(({ src, width, height, bytes, pageNumber }, index) =>
    !selectedPages || selectedPages.includes(pageNumber ?? index + 1)
      ? [{ src, width, height, bytes, ...(selectedPages ? { pageNumber: pageNumber ?? index + 1 } : {}) }]
      : [],
  );
}
