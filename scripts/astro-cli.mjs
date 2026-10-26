import { readFileSync } from 'node:fs';

// Follow the package's public CLI declaration; Astro changed its internal bin path in v7.
const packageUrl = new URL('../node_modules/astro/package.json', import.meta.url);
const pkg = JSON.parse(readFileSync(packageUrl, 'utf8'));
const bin = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.astro;
if (!bin) throw Error('Installed Astro does not declare a CLI');
await import(new URL(bin, packageUrl).href);
