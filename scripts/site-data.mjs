import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';

// Trusted project TypeScript only. Type-only imports disappear before dependencies load.
const modules = new Map();
const modulePaths = new Map();
async function moduleUrl(path) {
  if (modules.has(path)) return modules.get(path);
  let js = ts.transpileModule(await readFile(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  for (const match of [...js.matchAll(/\bfrom\s+(['"])(\.[^'"]+)\1/g)]) {
    const dependency = resolve(dirname(path), match[2]);
    const url = await moduleUrl(dependency.endsWith('.ts') ? dependency : `${dependency}.ts`);
    js = js.replace(match[0], `from '${url}'`);
  }
  const url = 'data:text/javascript;base64,' + Buffer.from(js).toString('base64');
  modules.set(path, url);
  modulePaths.set(url, path);
  return url;
}

export async function loadSiteModule(path = 'src/data/site.ts') {
  try {
    return await import(await moduleUrl(resolve(path)));
  } catch (error) {
    if (typeof error.stack === 'string')
      error.stack = error.stack.replace(
        /data:text\/javascript;base64,[A-Za-z0-9+/=]+/g,
        (url) => modulePaths.get(url) ?? '<site-data module>',
      );
    throw error;
  }
}
