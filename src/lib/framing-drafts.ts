export type Framing = { x: number; y: number; fit: 'natural' | 'contain' | 'cover' };

export function parseFramingDrafts(raw: string | null): Record<string, Framing> {
  const drafts: Record<string, Framing> = Object.create(null);
  try {
    const saved = JSON.parse(raw ?? '{}');
    if (
      saved?.schemaVersion !== 2 ||
      !saved.media ||
      typeof saved.media !== 'object' ||
      Array.isArray(saved.media)
    )
      return drafts;
    for (const [id, value] of Object.entries(saved.media)) {
      const row = value as Framing | null;
      if (
        /^[a-z0-9][a-z0-9-]*$/.test(id) &&
        row &&
        ['natural', 'contain', 'cover'].includes(row.fit) &&
        [row.x, row.y].every((n) => Number.isFinite(n) && n >= 0 && n <= 100)
      )
        drafts[id] = { x: row.x, y: row.y, fit: row.fit };
    }
  } catch {
    /* Corrupt or unavailable storage never changes canonical media. */
  }
  return drafts;
}

/** The editor starts from the existing source focus, never an invented centre. */
export function canonicalFocus(position?: string, focal = 'center') {
  try {
    const point = JSON.parse(position ?? 'null');
    if (point && [point.x, point.y].every((n) => Number.isFinite(n) && n >= 0 && n <= 1))
      return { x: point.x * 100, y: point.y * 100 };
  } catch {
    /* Legacy named focal points remain supported. */
  }
  const points: Record<string, [number, number]> = {
    'top-left': [0, 0],
    top: [50, 0],
    'top-right': [100, 0],
    left: [0, 50],
    center: [50, 50],
    right: [100, 50],
    'bottom-left': [0, 100],
    bottom: [50, 100],
    'bottom-right': [100, 100],
  };
  const [x, y] = Object.hasOwn(points, focal) ? points[focal] : points.center;
  return { x, y };
}
