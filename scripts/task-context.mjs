import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import YAML from 'yaml';
import { projectRoot } from './checks.mjs';
import { readEditorialRegister, editorialProgress, editorialStatuses } from './editorial-register.mjs';

export const contracts = {
  maintenance: ['README.md', 'docs/MAINTENANCE-AUDIT.md'],
  architecture: ['docs/CONTENT-AND-CMS.md'],
  content: ['docs/CONTENT-AND-CMS.md', 'docs/DESIGN-GUIDE.md'],
  editorial: ['docs/EDITORIAL-PLAN.md', 'docs/CONTENT-AND-CMS.md'],
  design_system: ['docs/DESIGN-GUIDE.md', 'docs/DESIGN-TOKENS.md'],
  design: ['docs/DESIGN-GUIDE.md', 'docs/DESIGN-TOKENS.md'],
  information_architecture: ['docs/SITE-PRINCIPLES.md', 'docs/CONTENT-AND-CMS.md'],
};
export function validateBacklog(backlog) {
  const tasks = new Map();
  for (const task of backlog.items ?? []) {
    if (!task.id || tasks.has(task.id)) throw Error('Duplicate or missing task ID: ' + task.id);
    if (!backlog.status_values?.includes(task.status) || !backlog.priority_values?.includes(task.priority))
      throw Error('Invalid task state: ' + task.id);
    tasks.set(task.id, task);
  }
  function visit(id, chain = []) {
    if (!tasks.has(id)) throw Error('Unknown dependency: ' + id);
    if (chain.includes(id)) throw Error('Dependency cycle: ' + [...chain, id].join(' -> '));
    for (const dependency of tasks.get(id).depends_on ?? []) visit(dependency, [...chain, id]);
  }
  for (const id of tasks.keys()) visit(id);
  return tasks;
}
export function taskCard(backlog, id) {
  const tasks = validateBacklog(backlog);
  const task = tasks.get(id);
  if (!task) throw Error('Unknown task: ' + id);
  const sources = [...(task.source ?? '').matchAll(/(?:docs\/)?[A-Z][A-Z0-9-]*\.(?:md|yaml)/g)].map(
    (match) => (match[0].startsWith('docs/') ? match[0] : 'docs/' + match[0]),
  );
  return {
    root: projectRoot,
    task: { ...task },
    dependencies: (task.depends_on ?? []).map((dependency) => ({
      id: dependency,
      status: tasks.get(dependency).status,
    })),
    read: [...new Set(['AGENTS.md', ...(contracts[task.area] ?? ['README.md']), ...sources])],
    rule: 'Task status is authoritative here. Read referenced contract sections, not all historical plans or source inventories. Owner acceptance is separate from technical completion.',
  };
}
export async function readBacklog() {
  const backlog = YAML.parse(await readFile(resolve(projectRoot, 'docs/PROJECT-BACKLOG.yaml'), 'utf8'));
  validateBacklog(backlog);
  return backlog;
}
async function main() {
  const args = process.argv.slice(2);
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (['--status', '--area', '--source'].includes(arg)) {
      if (!args[index + 1] || args[index + 1].startsWith('--')) throw Error('Missing argument: ' + arg);
      index++;
    } else if (
      !['--help', '--validate', '--texts', '--en', '--catalogue'].includes(arg) &&
      !/^[A-Z][A-Z0-9-]+$/.test(arg)
    )
      throw Error('Unknown option or task ID: ' + arg);
  }
  const backlog = await readBacklog();
  if (args.includes('--help')) {
    console.log(
      'task-context.mjs [TASK-ID] [--status STATUS] [--area AREA] [--texts [--en]] [--source V1-ID] [--catalogue] [--validate]\nWithout filters: unfinished tasks. All data comes from existing canonical sources.',
    );
    return;
  }
  const option = (name) => {
    if (!args.includes(name)) return undefined;
    const value = args[args.indexOf(name) + 1];
    if (!value || value.startsWith('--')) throw Error('Missing argument: ' + name);
    return value;
  };
  const status = option('--status');
  const area = option('--area');
  if (
    status &&
    !(args.includes('--texts') ? Object.keys(editorialStatuses) : backlog.status_values).includes(status)
  )
    throw Error('Unknown status: ' + status);
  if (area && !backlog.items.some((task) => task.area === area)) throw Error('Unknown area: ' + area);
  if (args.includes('--source')) {
    const id = option('--source');
    const inventory = JSON.parse(
      await readFile(resolve(projectRoot, 'docs/migration/INVENTORY-2026-10-05.json'), 'utf8'),
    );
    const row = inventory.entries.find((entry) => entry.id === id);
    if (!row) throw Error('Unknown source ID: ' + id);
    console.log(
      JSON.stringify(
        {
          id: row.id,
          title: row.title,
          sourceFile: row.sourceFile,
          sourceHashes: row.sourceHashes,
          application: row.currentCanonicalApplication,
        },
        null,
        2,
      ),
    );
    return;
  }
  if (args.includes('--catalogue')) {
    const { loadSiteModule } = await import('./site-data.mjs');
    const source = await loadSiteModule(resolve(projectRoot, 'src/data/site.ts'));
    const { catalogue } = await loadSiteModule(resolve(projectRoot, 'src/data/catalogue.ts'));
    const { pages } = await loadSiteModule(resolve(projectRoot, 'src/lib/routes.ts'));
    const counts = (data) =>
      Object.fromEntries(
        ['works', 'configurations', 'programmes', 'cases', 'media', 'recognitions'].map((key) => [
          key,
          data[key].length,
        ]),
      );
    console.log(
      JSON.stringify(
        { source: counts(source), public: counts(catalogue), canonicalRoutes: pages.length },
        null,
        2,
      ),
    );
    return;
  }
  if (args.includes('--validate')) {
    const registry = await readEditorialRegister(resolve(projectRoot, 'docs/EDITORIAL-REGISTER.yaml'));
    for (const paths of Object.values(contracts))
      for (const path of paths) await readFile(resolve(projectRoot, path));
    console.log(
      'Valid metadata: ' + backlog.items.length + ' tasks; ' + registry.units.length + ' editorial units.',
    );
    return;
  }
  if (args.includes('--texts')) {
    const registry = await readEditorialRegister(resolve(projectRoot, 'docs/EDITORIAL-REGISTER.yaml'));
    const lang = args.includes('--en') ? 'en' : 'ru';
    console.log(
      JSON.stringify(
        {
          progress: editorialProgress(registry, lang),
          units: registry.units
            .filter((row) => !status || row[lang].status === status)
            .map((row) => ({ id: row.id, status: row[lang].status })),
        },
        null,
        2,
      ),
    );
    return;
  }
  const id = args.find((arg) => /^[A-Z][A-Z0-9-]+$/.test(arg));
  if (id) {
    console.log(JSON.stringify(taskCard(backlog, id), null, 2));
    return;
  }
  console.log(
    JSON.stringify(
      {
        root: projectRoot,
        counts: Object.fromEntries(
          backlog.status_values.map((value) => [
            value,
            backlog.items.filter((task) => task.status === value).length,
          ]),
        ),
        tasks: backlog.items
          .filter(
            (task) =>
              (status ? task.status === status : task.status !== 'done') && (!area || task.area === area),
          )
          .map(({ id, title, status, priority, area }) => ({ id, title, status, priority, area })),
      },
      null,
      2,
    ),
  );
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
