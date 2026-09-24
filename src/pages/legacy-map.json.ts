import legacyMap from '../data/legacy-map.json';

export const prerender = true;

const routes = Object.fromEntries(legacyMap.map(({ id, targetEn, targetRu }) => [id, [targetEn, targetRu]]));

export function GET() {
  return new Response(JSON.stringify(routes), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
