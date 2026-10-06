"""Read-only audit of owner-selected source roots; never exports proposal bodies or prices.

Requires PyMuPDF, OpenCV and NumPy. Run from V2. Outputs metadata to the existing inventory.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
import fitz
import cv2
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument('--kit', required=True)
parser.add_argument('--economics', required=True, help='Economics root; inspect only _export PDFs')
parser.add_argument('--submissions', required=True)
parser.add_argument('--sent-pdf', required=True)
args = parser.parse_args()
roots = {'agency-kit': Path(args.kit), 'economics-export': Path(args.economics) / '_export', 'submissions': Path(args.submissions)}
files = [(group, root, file) for group, root in roots.items() for file in sorted(root.rglob('*.pdf'))]
files.append(('sent-now', Path(args.sent_pdf).parent, Path(args.sent_pdf)))
detector = cv2.QRCodeDetector()
rows = []
own_hosts = {'odadream.art', 'www.odadream.art', 'odadream.ru', 'www.odadream.ru'}

def target(value, page, medium):
    address = urlsplit(value.strip())
    result = {'page': page, 'medium': medium, 'scheme': address.scheme, 'host': address.hostname}
    if address.scheme in ('mailto', 'tel') or address.hostname in ('t.me', 'wa.me'):
        result['kind'] = 'contact-or-channel'
    elif any(key.lower() in {'token', 'access_token', 'sig', 'signature', 'auth', 'password'} for key in parse_qs(address.query)):
        result['kind'] = 'protected-link'
    else:
        result['kind'] = 'main-site' if address.hostname in own_hosts else 'other'
        result['url'] = value
    return result

for group, root, file in files:
    links, qrs, printed_main, detected = [], [], [], 0
    with fitz.open(file) as document:
        for page in document:
            for item in page.get_links():
                if item.get('uri'):
                    links.append(target(item['uri'], page.number + 1, 'annotation'))
            # Text is inspected in memory only; never export CV details or commercial tables.
            for value in re.findall(r'https?://(?:www\.)?odadream\.(?:art|ru)(?:[^\s<>]*)', page.get_text()):
                printed_main.append(target(value.rstrip('.,;)'), page.number + 1, 'printed-text'))
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
            image = np.frombuffer(pix.samples, np.uint8).reshape(pix.height, pix.width, 3)
            _, values, points, _ = detector.detectAndDecodeMulti(image)
            if points is not None:
                detected += len(points)
            qrs.extend(target(value, page.number + 1, 'qr') for value in values if value)
        rows.append({'group': group, 'path': file.relative_to(root).as_posix(), 'sha256': hashlib.sha256(file.read_bytes()).hexdigest(), 'pages': len(document), 'annotationLinks': links, 'printedMainSiteLinks': printed_main, 'qrDetected': detected, 'qrTargets': qrs, 'publicCopy': False})
    print(f'{group}: {len(rows)}/{len(files)} inspected', flush=True)

inventory_path = Path('docs/migration/INVENTORY-2026-10-05.json')
inventory = json.loads(inventory_path.read_text(encoding='utf8'))
inventory['currentOutreachMaterialAudit'] = {
    'asOf': '2026-10-06', 'mode': 'read-only', 'roots': {key: str(value) for key, value in roots.items()},
    'files': rows, 'summary': {'pdfs': len(rows), 'pages': sum(row['pages'] for row in rows), 'annotationLinks': sum(len(row['annotationLinks']) for row in rows), 'qrDetected': sum(row['qrDetected'] for row in rows), 'qrDecoded': sum(len(row['qrTargets']) for row in rows)},
    'limitation': 'Exact sent attachment is independently identified; current folder content is not proof of content at send time. Automatic non-detection does not prove absence of QR/raster URLs. PDF bodies, prices, personal contact payloads and proposal files are not published. External availability is a separate check.',
}
inventory_path.write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
print(json.dumps(inventory['currentOutreachMaterialAudit']['summary']))
