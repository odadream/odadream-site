import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import { loadSiteModule } from './site-data.mjs';
import { technicalOverviewInput, cvInput } from './document-input.mjs';
const asOf = process.argv[process.argv.indexOf('--as-of') + 1];
if (!process.argv.includes('--as-of') || !/^\d{4}-\d{2}-\d{2}$/.test(asOf))
  throw Error('Usage: node scripts/prepare-reference-documents.mjs --as-of YYYY-MM-DD');
await mkdir('.local-server', { recursive: true });
const data = await loadSiteModule();
const documents = data.referenceDocuments.map((row) => ({ ...row, asOf }));
await writeFile(
  '.local-server/overview-input.json',
  JSON.stringify({ input: technicalOverviewInput(data, asOf) }),
);
await writeFile(
  '.local-server/cv-input.json',
  JSON.stringify(
    documents
      .filter((row) => row.kind === 'cv')
      .map((document) => ({ document, input: cvInput(data, document) })),
  ),
);
const result = spawnSync(
  process.env.ODA_MEDIA_PYTHON ?? 'python',
  ['-X', 'utf8', 'scripts/prepare-reference-documents.py'],
  { stdio: 'inherit' },
);
if (result.error) throw result.error;
if (result.status !== 0) throw Error('Reference document rendering failed');
const outputs = [
  ...JSON.parse(await readFile('.local-server/overview-output.json', 'utf8')),
  ...JSON.parse(await readFile('.local-server/cv-output.json', 'utf8')),
];
const file = 'src/data/reference-documents.ts';
let text = await readFile(file, 'utf8');
const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
const edits = [];
function walk(node) {
  if (ts.isObjectLiteralExpression(node)) {
    const property = (name) =>
      node.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText(source) === name);
    const id = property('id')?.initializer.text;
    const document = documents.find((row) => row.id === id);
    if (document) {
      const output = outputs.find((row) => row.href === document.href);
      if (!output) throw Error('Missing output: ' + id);
      const input = document.kind === 'cv' ? cvInput(data, document) : technicalOverviewInput(data, asOf);
      const updates = {
        asOf,
        bytes: output.bytes,
        pages: output.pages,
        sha256: output.sha256,
        contentFingerprint: createHash('sha256').update(JSON.stringify(input)).digest('hex'),
      };
      for (const [key, value] of Object.entries(updates)) {
        const field = property(key);
        if (!field) throw Error('Missing metadata: ' + id + '.' + key);
        edits.push({
          start: field.initializer.getStart(source),
          end: field.initializer.end,
          text: JSON.stringify(value),
        });
      }
    }
  }
  ts.forEachChild(node, walk);
}
walk(source);
for (const edit of edits.sort((a, b) => b.start - a.start))
  text = text.slice(0, edit.start) + edit.text + text.slice(edit.end);
await writeFile(file, text);
for (const output of outputs) await copyFile(output.path, 'public' + output.href);
console.log(
  'Updated ' +
    outputs.length +
    ' reference PDFs. Run media:prepare to refresh their page images and text sidecars.',
);
