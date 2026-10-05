import legacyMap from '../data/legacy-map.json';

import { resolveLegacyRoutes } from '../lib/legacy-routes';
import { pages } from '../lib/routes';

export const prerender = true;

const routes = resolveLegacyRoutes(legacyMap, pages);

export function GET() {
  return new Response(JSON.stringify(routes), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
