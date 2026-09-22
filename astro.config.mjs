import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import lastmod from './src/data/lastmod.json' with { type: 'json' };

export default defineConfig({
  site: 'https://odadream.art',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/legacy/') && !page.includes('/design-system/') && page !== 'https://odadream.art/',
      serialize: (item) => ({ ...item, lastmod: lastmod[new URL(item.url).pathname] }),
    }),
  ],
});
