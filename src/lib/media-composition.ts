export type CropView = 'card' | 'hero' | 'gallery';
export type CropViewport = 'desktop' | 'mobile';
export interface Composition {
  mode: 'point' | 'region';
  point: { x: number; y: number };
  region: { x: number; y: number; width: number; height: number };
}
export interface CompositionDraft {
  schemaVersion: 1;
  media: Record<string, Partial<Record<CropView, Partial<Record<CropViewport, Composition>>>>>;
}
const unit = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1;
export function validComposition(v: unknown): v is Composition {
  if (!v || typeof v !== 'object') return false;
  const c = v as Composition;
  return (
    ['point', 'region'].includes(c.mode) &&
    !!c.point &&
    !!c.region &&
    unit(c.point.x) &&
    unit(c.point.y) &&
    unit(c.region.x) &&
    unit(c.region.y) &&
    unit(c.region.width) &&
    unit(c.region.height) &&
    c.region.width > 0 &&
    c.region.height > 0 &&
    c.region.x + c.region.width <= 1.000001 &&
    c.region.y + c.region.height <= 1.000001
  );
}
export function readCompositionDraft(text: string): CompositionDraft {
  const result: CompositionDraft = { schemaVersion: 1, media: {} };
  try {
    const raw = JSON.parse(text);
    if (raw.schemaVersion !== 1 || !raw.media) return result;
    for (const [id, profiles] of Object.entries(raw.media)) {
      if (
        ['constructor', 'prototype'].includes(id) ||
        !/^[a-z0-9][a-z0-9-]*$/.test(id) ||
        !profiles ||
        typeof profiles !== 'object'
      )
        continue;
      for (const view of ['card', 'hero', 'gallery'] as const)
        for (const viewport of ['desktop', 'mobile'] as const) {
          const c = (profiles as CompositionDraft['media'][string])[view]?.[viewport];
          if (validComposition(c)) {
            result.media[id] ??= {};
            result.media[id][view] ??= {};
            result.media[id][view]![viewport] = {
              mode: c.mode,
              point: { ...c.point },
              region: { ...c.region },
            };
          }
        }
    }
  } catch {
    /* malformed local draft is ignored */
  }
  return result;
}
export const defaultComposition = (): Composition => ({
  mode: 'point',
  point: { x: 0.5, y: 0.5 },
  region: { x: 0, y: 0, width: 1, height: 1 },
});
/** Region keeps its whole selected area; mismatched output proportions use letterboxing. */
export function compositionTransform(iw: number, ih: number, fw: number, fh: number, c: Composition) {
  if (!validComposition(c) || ![iw, ih, fw, fh].every(Number.isFinite) || Math.min(iw, ih, fw, fh) <= 0)
    throw Error('Invalid composition geometry');
  if (c.mode === 'point') {
    const scale = Math.max(fw / iw, fh / ih);
    return {
      windowWidth: fw,
      windowHeight: fh,
      imageWidth: iw * scale,
      imageHeight: ih * scale,
      left: (fw - iw * scale) * c.point.x,
      top: (fh - ih * scale) * c.point.y,
    };
  }
  const r = c.region;
  const scale = Math.min(fw / (iw * r.width), fh / (ih * r.height));
  return {
    windowWidth: iw * r.width * scale,
    windowHeight: ih * r.height * scale,
    imageWidth: iw * scale,
    imageHeight: ih * scale,
    left: -iw * r.x * scale,
    top: -ih * r.y * scale,
  };
}
