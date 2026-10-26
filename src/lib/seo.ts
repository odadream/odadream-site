import type { MediaItem } from './media-presentation';

/** Open Graph images must be still images, including when the page opens with video. */
export function socialImage(items: (MediaItem | undefined)[]) {
  for (const item of items) {
    if (!item) continue;
    const src = item.kind === 'image' ? item.src : item.poster;
    if (src) return { src, alt: item.alt };
  }
  return undefined;
}

/** Keep editorial text from terminating an HTML script element. */
export const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
