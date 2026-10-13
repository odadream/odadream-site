import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import publicationIntegration from './scripts/publication-integration.mjs';
import lastmod from './src/data/lastmod.json' with { type: 'json' };
import { copyFile } from 'node:fs/promises';

export default defineConfig({
  site: 'https://odadream.art',
  output: 'static',
  outDir: process.env.ODA_BUILD_DIR || './dist',
  devToolbar: { enabled: false },
  vite: {
    server: {
      watch: {
        ignored: ['**/.local-server/**', '**/dist/**', '**/test-results/**', '**/playwright-report/**'],
      },
    },
  },
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
    {
      name: 'oda-sitemap-address',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          // Keep the submitted service address; both indexes describe the current V2 build.
          await copyFile(new URL('sitemap-index.xml', dir), new URL('sitemap.xml', dir));
        },
      },
    },
  ],
});
