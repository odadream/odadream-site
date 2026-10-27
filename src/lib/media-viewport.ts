export function mediaFitScale(width: number, height: number, viewportWidth: number, viewportHeight: number) {
  if (Math.min(width, height, viewportWidth, viewportHeight) <= 0) return 1;
  return Math.min(1, viewportWidth / width, viewportHeight / height);
}

/** Horizontal navigation is deliberately separate from free pan and two-finger zoom. */
export function mediaSwipeDirection(
  dx: number,
  dy: number,
  elapsed: number,
  distance: number,
  duration: number,
  bias: number,
) {
  if (elapsed < 0 || elapsed > duration || Math.abs(dx) < distance || Math.abs(dx) <= Math.abs(dy) * bias)
    return 0;
  return dx < 0 ? 1 : -1;
}

interface ViewportZoom {
  width: number;
  height: number;
  viewportWidth: number;
  viewportHeight: number;
  previousViewportWidth?: number;
  previousViewportHeight?: number;
  scale: number;
  nextScale: number;
  left: number;
  top: number;
  anchorX: number;
  anchorY: number;
  previousX?: number;
  previousY?: number;
}

/** Keep the same point of the document under the gesture as scale/centroid changes. */
export function mediaZoomPosition(p: ViewportZoom) {
  const axis = (
    size: number,
    viewport: number,
    oldViewport: number,
    scroll: number,
    anchor: number,
    previous: number,
  ) => {
    const oldInset = Math.max(0, oldViewport - size * p.scale) / 2;
    const newInset = Math.max(0, viewport - size * p.nextScale) / 2;
    const point = (scroll + previous - oldInset) / p.scale;
    return Math.max(0, Math.min(size * p.nextScale - viewport, point * p.nextScale + newInset - anchor));
  };
  return {
    left: axis(
      p.width,
      p.viewportWidth,
      p.previousViewportWidth ?? p.viewportWidth,
      p.left,
      p.anchorX,
      p.previousX ?? p.anchorX,
    ),
    top: axis(
      p.height,
      p.viewportHeight,
      p.previousViewportHeight ?? p.viewportHeight,
      p.top,
      p.anchorY,
      p.previousY ?? p.anchorY,
    ),
  };
}
