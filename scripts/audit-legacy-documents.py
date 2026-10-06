"""Read-only PDF inspection; write metadata into the existing migration inventory.

Requires pypdf. --qr additionally uses PyMuPDF, OpenCV and NumPy.
Run from the V2 root using the bundled Python runtime or local Python.
Does not copy PDFs, fetch external links, approve rights or decide retirement.
"""
import hashlib
import json
import re
import sys
from pathlib import Path
from pypdf import PdfReader

scan_qr = '--qr' in sys.argv
if scan_qr:
    import fitz
    import cv2
    import numpy as np
    from urllib.parse import urlsplit
    detector = cv2.QRCodeDetector()

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
    row = {
        'path': path, 'pages': len(reader.pages),
        'sha256': hashlib.sha256(file.read_bytes()).hexdigest(),
        'textExtractable': any((page.extract_text() or '').strip() for page in reader.pages),
        'embeddedFiles': sorted(reader.attachments),
        'directSourceIds': [row['id'] for row in references],
        'selectedSourceFiles': [row['source'] for row in references if row['source'] in inventory['v2SourceSnapshots']],
        'annotationLinks': links,
    }
    if scan_qr:
        qr_links = []
        detected = 0
        decoded = 0
        with fitz.open(file) as document:
            for page in document:
                raster = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
                image = np.frombuffer(raster.samples, np.uint8).reshape(raster.height, raster.width, 3)
                _, values, points, _ = detector.detectAndDecodeMulti(image)
                if points is not None:
                    detected += len(points)
                for value in values:
                    if not value:
                        continue
                    decoded += 1
                    address = urlsplit(value)
                    contact = address.hostname in ('t.me', 'wa.me') or address.scheme in ('tel', 'mailto')
                    target = {'page': page.number + 1, 'kind': 'historical-contact' if contact else 'external', 'scheme': address.scheme, 'host': address.hostname}
                    if not contact:
                        target['url'] = value
                    if target not in qr_links:
                        qr_links.append(target)
        row['qrScan'] = {'dpi': 144, 'detected': detected, 'decoded': decoded, 'targets': qr_links,
                         'limitation': 'Automated scan; no detection does not prove absence. Personal contact paths and payloads omitted; delivery/account ownership not verified.'}
        print(f'{file.name}: QR {decoded}/{detected} decoded', flush=True)
    rows.append(row)
inventory['currentDocumentAudit'] = {
    'asOf': '2026-10-06', 'documents': rows,
    'note': 'All 11 archived PDFs parsed. Annotation links inspected, not fetched. Contacts counted without address disclosure. ' +
            ('All 55 pages scanned for QR at 144 dpi; two historical personal contact codes in the selected rings banner decoded. No absence, delivery or current contact ownership inferred.' if scan_qr else 'Printed QR destinations and links hidden in raster artwork are not established by this audit.') +
            ' No publication or retirement approvals inferred.',
}
if scan_qr:
    inventory['currentOutboundAudit'] = {
        'asOf': '2026-10-06', 'knownPdfFiles': len(rows), 'pagesScanned': sum(row['pages'] for row in rows),
        'annotationLinks': sum(len(row['annotationLinks']) for row in rows),
        'qrDetected': sum(row['qrScan']['detected'] for row in rows),
        'qrDecoded': sum(row['qrScan']['decoded'] for row in rows),
        'selectedDocuments': [row['path'] for row in rows if row['selectedSourceFiles']],
        'selectedDisposition': 'Keep the two selected originals unchanged with published rings and cleared document rights. Two decoded QR targets are historical personal Telegram/WhatsApp contacts, not old site routes or current studio CTA.',
        'otherDocuments': 'Nine known PDFs belong to deferred works/applications; retain the read-only archive and decide their resource URLs in M4. Do not replace the current studio dossier with them.',
        'outreachSource': 'Dated outreach input in MIGRATION-PLAN.md reports Divent/N:OW received materials; exact sent versions and attachments are unavailable in this workspace.',
        'unresolved': ['Exact externally sent PDF/dossier versions', 'Printed links or QR not detected by the automated scan', 'Current ownership/delivery of external accounts and links'],
        'note': 'Known-file inspection only; does not close the complete outreach/QR task or authorize retirement. No personal QR payload copied into public data.'
    }
inventory_path.write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Inspected {len(rows)} PDFs, {sum(row["pages"] for row in rows)} pages and {sum(len(row["annotationLinks"]) for row in rows)} annotation links. No resources copied or external URLs fetched.')
