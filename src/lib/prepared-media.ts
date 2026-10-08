import { preparedMedia } from '../data/prepared-media';
import type { PreparedImage } from '../data/prepared-media-types';

export type DocumentPage = Pick<PreparedImage, 'src' | 'width' | 'height' | 'bytes'>;
export function documentPages(href: string): DocumentPage[] {
  return (preparedMedia[href]?.images ?? []).map(({ src, width, height, bytes }) => ({
    src,
    width,
    height,
    bytes,
  }));
}
