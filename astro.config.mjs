import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import publicationIntegration from './scripts/publication-integration.mjs';
import lastmod from './src/data/lastmod.json' with { type: 'json' };

export default defineConfig({
  site: 'https://odadream.art',
  output: 'static',
  outDir: process.env.ODA_BUILD_DIR || './dist',
  devToolbar: { enabled: false },
  trailingSlash: 'always',
  integrations: [
    publicationIntegration(),
    sitemap({
      filter: (page) =>
        !page.includes('/legacy/') &&
        !page.includes('/design-system/') &&
        !page.endsWith('/formats/') &&
        page !== 'https://odadream.art/',
      serialize: (item) => ({ ...item, lastmod: lastmod[new URL(item.url).pathname] }),
    }),
  ],
});
