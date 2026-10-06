"""Read-only PDF inspection; write metadata into the existing migration inventory.

Requires pypdf. Run from the V2 root using the bundled Python runtime or local Python.
Does not copy PDFs, fetch external links, approve rights or decide retirement.
"""
import hashlib
import json
import re
from pathlib import Path
from pypdf import PdfReader

archive = Path('../odadream-site-archive-2026-09-21')
inventory_path = Path('docs/migration/INVENTORY-2026-10-05.json')
inventory = json.loads(inventory_path.read_text(encoding='utf-8'))
legacy = json.loads(Path('src/data/legacy-map.json').read_text(encoding='utf-8'))
sources = [(row, (archive / 'src/content' / row['source']).read_text(encoding='utf-8')) for row in legacy]
rows = []
for file in sorted((archive / 'public/documents').glob('*.pdf')):
    reader = PdfReader(file)
    links = []
    for number, page in enumerate(reader.pages, 1):
        for ref in page.get('/Annots', []):
            action = ref.get_object().get('/A', {})
            uri = str(action.get('/URI', ''))
            if not uri:
                continue
            kind = 'contact' if uri.startswith('mailto:') else 'legacy-site' if re.match(r'^https?://(?:www\.)?odadream\.(?:art|ru)(?:/|$)', uri) else 'external'
            link = {'page': number, 'kind': kind}
            if kind != 'contact':
                link['url'] = uri
            if link not in links:
                links.append(link)
    path = '/documents/' + file.name
    references = [row for row, raw in sources if path in raw]
    rows.append({
        'path': path, 'pages': len(reader.pages),
        'sha256': hashlib.sha256(file.read_bytes()).hexdigest(),
        'textExtractable': any((page.extract_text() or '').strip() for page in reader.pages),
        'embeddedFiles': sorted(reader.attachments),
        'directSourceIds': [row['id'] for row in references],
        'selectedSourceFiles': [row['source'] for row in references if row['source'] in inventory['v2SourceSnapshots']],
        'annotationLinks': links,
    })
inventory['currentDocumentAudit'] = {
    'asOf': '2026-10-06', 'documents': rows,
    'note': 'All 11 archived PDFs parsed. Annotation links inspected, not fetched. Contacts counted without address disclosure. Printed QR destinations and links hidden in raster artwork are not established by this audit. No publication or retirement approvals inferred.',
}
inventory_path.write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Inspected {len(rows)} PDFs, {sum(row["pages"] for row in rows)} pages and {sum(len(row["annotationLinks"]) for row in rows)} annotation links. No resources copied or external URLs fetched.')
