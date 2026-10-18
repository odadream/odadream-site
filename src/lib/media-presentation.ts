import type { Media } from '../data/site';
export type MediaItem = Pick<
  Media,
  | 'id'
  | 'src'
  | 'mobileSrc'
  | 'width'
  | 'height'
  | 'poster'
  | 'previewSrc'
  | 'alt'
  | 'caption'
  | 'kind'
  | 'representation'
  | 'credit'
  | 'focalPoint'
  | 'focalPosition'
>;
export function mediaPositionStyle(item?: MediaItem): string | undefined {
  const geometry = item?.width && item.height ? `--media-ratio:${item.width / item.height};` : '';
  if (!item?.focalPosition) return geometry || undefined;
  const { desktop, mobile = desktop } = item.focalPosition;
  for (const point of [desktop, mobile])
    if (![point.x, point.y].every((value) => Number.isFinite(value) && value >= 0 && value <= 1))
      throw Error('Invalid media focal position');
  return `${geometry}--media-position-desktop:${desktop.x * 100}% ${desktop.y * 100}%;--media-position-mobile:${mobile.x * 100}% ${mobile.y * 100}%`;
}
export type MediaFit = 'natural' | 'crop';
export const fullFrameRepresentations = new Set(['diagram', 'poster', 'document', 'screenshot']);
export function mediaFit(item: MediaItem, requested: MediaFit): MediaFit {
  return fullFrameRepresentations.has(item.representation ?? '') || (requested === 'crop' && !item.focalPoint)
    ? 'natural'
    : requested;
}
