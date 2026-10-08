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
>;
export type MediaFit = 'natural' | 'crop';
export const fullFrameRepresentations = new Set(['diagram', 'poster', 'document', 'screenshot']);
export function mediaFit(item: MediaItem, requested: MediaFit): MediaFit {
  return fullFrameRepresentations.has(item.representation ?? '') || (requested === 'crop' && !item.focalPoint)
    ? 'natural'
    : requested;
}
