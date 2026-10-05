import { readdir, unlink } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSiteModule } from './site-data.mjs';

export async function publicFiles(root) {
  const paths = [];
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (entry.isFile()) paths.push('/' + relative(root, path).split(sep).join('/'));
    }
  }
  await visit(root);
  return paths;
}

export default function publicationIntegration() {
  let publicRoot;
  return {
    name: 'oda-publication-scope',
    hooks: {
      'astro:config:setup': ({ command, config, injectRoute }) => {
        publicRoot = fileURLToPath(config.publicDir);
        if (command === 'dev')
          injectRoute({
            pattern: '/design-system/',
            entrypoint: fileURLToPath(new URL('../src/views/DesignSystem.astro', import.meta.url)),
          });
      },
      'astro:build:done': async ({ dir, logger }) => {
        const { catalogue } = await loadSiteModule('src/data/catalogue.ts');
        const root = fileURLToPath(dir);
        let excluded = 0;
        for (const path of await publicFiles(publicRoot)) {
          if (catalogue.assetPaths.has(path)) continue;
          const target = resolve(root, path.slice(1));
          if (!target.startsWith(resolve(root) + sep))
            throw new Error(`Asset outside build directory: ${path}`);
          await unlink(target).catch((error) => {
            if (error.code !== 'ENOENT') throw error;
          });
          excluded++;
        }
        logger.info(`Public packet: ${catalogue.works.length} works; ${excluded} deferred files excluded.`);
      },
    },
  };
}
