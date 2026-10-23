"""Prepare immutable web derivatives. Originals and extracted text never move to public.

Use through npm run media:prepare. Pillow/PyMuPDF are preparation dependencies only;
normal site builds use checked-in derivatives and need neither Python nor the cache.
"""
import hashlib
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

import fitz
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.local-server/media-cache'
POLICY = {
    'version': 1,
    'engine': f'PyMuPDF-{fitz.VersionBind}/Pillow-{Image.__version__}',
    'photograph': {'edge': 2000, 'quality': 82, 'minimumQuality': 74, 'budget': 350000},
    'document': {'edge': 2600, 'quality': 88, 'minimumQuality': 84, 'budget': 900000},
}


def ocr_configuration():
    executable = os.environ.get('ODA_MEDIA_TESSERACT') or shutil.which('tesseract')
    if not executable and Path('C:/Program Files/Tesseract-OCR/tesseract.exe').is_file():
        executable = 'C:/Program Files/Tesseract-OCR/tesseract.exe'
    models = Path(os.environ.get('ODA_MEDIA_TESSDATA', ROOT / '.local-server/media-tools/tessdata'))
    files = [models / f'{language}.traineddata' for language in ('eng', 'rus')]
    if not executable or not all(file.is_file() for file in files):
        return None
    fingerprint = hashlib.sha256(json.dumps({'version': 2, 'engine': digest(Path(executable)),
        'languages': [digest(file) for file in files], 'psm': [3, 11]}, sort_keys=True).encode()).hexdigest()
    return {'executable': executable, 'models': str(models), 'fingerprint': fingerprint}


def search_copy(record, folder, configuration):
    """OCR has its own cache: changing recognizer/models never re-renders image pages."""
    page_records = [row for row in record['texts'] if 'page' in row]
    image_document = not page_records
    if image_document:
        page_records = [{'page': 1, 'file': None, 'status': 'needs-ocr'}]
    if not configuration or all(row['status'] == 'extracted' for row in page_records):
        if image_document:
            return {'searchText': None, 'searchStatus': 'needs-ocr'}
        return {'searchText': str(folder / 'document.txt'), 'searchStatus': record['textStatus']}
    search_folder = folder / 'ocr' / configuration['fingerprint']
    search_folder.mkdir(parents=True, exist_ok=True)
    manifest_path = search_folder / 'manifest.json'
    cached = valid_cached_record(manifest_path, search_folder, ('files',))
    if cached:
        return cached
    pages, files = [], []
    for text in page_records:
        number = text['page']
        content = (folder / text['file']).read_text(encoding='utf-8').strip() if text['file'] else ''
        status = 'extracted'
        if not content:
            image = folder / record['images'][number - 1]['file']
            # Presentations often have sparse text over photographs, unlike ordinary paragraphs.
            for segmentation in ('3', '11'):
                result = subprocess.run([configuration['executable'], str(image), 'stdout',
                    '--tessdata-dir', configuration['models'], '-l', 'eng+rus', '--psm', segmentation],
                    capture_output=True, encoding='utf-8', errors='replace', timeout=120, check=True)
                content = result.stdout.strip()
                if content:
                    break
            status = 'ocr' if content else 'no-readable-text'
        target = search_folder / f'page-{number:03}.txt'
        target.write_text(content + '\n', encoding='utf-8')
        files.append({'file': target.name, 'sha256': digest(target), 'page': number, 'status': status})
        pages.append(f'--- PAGE {number} | {status} ---\n{content}')
    combined = search_folder / 'document.txt'
    combined.write_text('\n\n'.join(pages) + '\n', encoding='utf-8')
    files.append({'file': combined.name, 'sha256': digest(combined)})
    result = {'searchText': str(combined), 'searchStatus': 'partial' if any(
        row.get('status') == 'no-readable-text' for row in files) else 'ocr-assisted',
        'ocrFingerprint': configuration['fingerprint'], 'machineTextNeedsReview': True, 'files': files}
    manifest_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return result


def digest(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def valid_cached_record(manifest, folder, artifact_fields):
    try:
        candidate = json.loads(manifest.read_text(encoding='utf-8'))
        artifacts = [row for field in artifact_fields for row in candidate[field]]
        if artifacts and all(Path(row['file']).name == row['file'] and
                (folder / row['file']).is_file() and digest(folder / row['file']) == row['sha256']
                for row in artifacts):
            return candidate
    except (OSError, ValueError, KeyError, TypeError):
        pass
    return None


def save_image(image, path, profile):
    image = ImageOps.exif_transpose(image)
    image.thumbnail((profile['edge'], profile['edge']), Image.Resampling.LANCZOS)
    if image.mode not in ('RGB', 'RGBA'):
        image = image.convert('RGBA' if 'transparency' in image.info else 'RGB')
    for quality in range(profile['quality'], profile['minimumQuality'] - 1, -2):
        output = io.BytesIO()
        image.save(output, 'WEBP', quality=quality, method=6)
        if output.tell() <= profile['budget']:
            break
    path.write_bytes(output.getvalue())
    return {'file': path.name, 'width': image.width, 'height': image.height,
            'bytes': path.stat().st_size, 'sha256': digest(path),
            'quality': quality, 'withinBudget': path.stat().st_size <= profile['budget']}


def correct_document(image, request):
    gamma = request.get('toneGamma')
    if gamma is None:
        return image
    if not 0.5 <= gamma <= 1.5:
        raise ValueError('Document gamma outside reviewed range')
    lut = [round(255 * (value / 255) ** gamma) for value in range(256)]
    return image.convert('RGB').point(lut * 3)

def prepare(request):
    source = Path(request['source']).resolve(strict=True)
    source_sha = digest(source)
    profile_name = 'document' if request['kind'] == 'pdf' else request.get('profile', 'photograph')
    key = hashlib.sha256(json.dumps({'source': source_sha, 'kind': request['kind'],
        'profile': profile_name, 'policy': POLICY, **({'rotation': request['rotation']} if request.get('rotation') else {}), **({'toneGamma': request['toneGamma']} if request.get('toneGamma') else {})}, sort_keys=True).encode()).hexdigest()
    folder = CACHE / key
    manifest = folder / 'manifest.json'
    cached = None
    candidate = valid_cached_record(manifest, folder, ('images', 'texts'))
    if candidate and candidate.get('key') == key and candidate.get('sourceSha256') == source_sha and candidate.get('images'):
        cached = candidate
    reused = cached is not None
    if cached is None:
        folder.mkdir(parents=True, exist_ok=True)
        images, texts = [], []
        text_state = 'not-applicable'
        if request['kind'] == 'pdf':
            page_texts = []
            with fitz.open(source) as document:
                if document.needs_pass:
                    raise ValueError('Encrypted PDF requires an explicitly unlocked source')
                for number, page in enumerate(document, 1):
                    edge = POLICY[profile_name]['edge']
                    scale = edge / max(page.rect.width, page.rect.height)
                    pixmap = page.get_pixmap(matrix=fitz.Matrix(scale, scale), colorspace=fitz.csRGB)
                    image = Image.frombytes('RGB', (pixmap.width, pixmap.height), pixmap.samples)
                    if request.get('rotation'):
                        image = image.rotate(request['rotation'], expand=True)
                    images.append(save_image(correct_document(image, request), folder / f'page-{number:03}.webp', POLICY[profile_name]))
                    content = page.get_text(sort=True).strip()
                    page_texts.append(content)
                    path = folder / f'page-{number:03}.txt'
                    path.write_text(content + '\n', encoding='utf-8')
                    texts.append({'file': path.name, 'sha256': digest(path), 'page': number,
                                  'status': 'extracted' if content else 'needs-ocr'})
            combined = folder / 'document.txt'
            combined.write_text('\n\n'.join(f'--- PAGE {n} ---\n{content}'
                for n, content in enumerate(page_texts, 1)) + '\n', encoding='utf-8')
            texts.append({'file': combined.name, 'sha256': digest(combined)})
            text_state = ('extracted' if all(page_texts) else 'partial' if any(page_texts) else 'needs-ocr')
        else:
            with Image.open(source) as image:
                images.append(save_image(correct_document(image, request), folder / 'image.webp', POLICY[profile_name]))
        cached = {'key': key, 'policy': POLICY, 'sourceSha256': source_sha,
                  'sourceBytes': source.stat().st_size, 'images': images, 'texts': texts,
                  'textStatus': text_state}
        manifest.write_text(json.dumps(cached, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    published = []
    if request.get('publish'):
        destination = ROOT / 'public/images/prepared' / key[:24]
        destination.mkdir(parents=True, exist_ok=True)
        for number, row in enumerate(cached['images'], 1):
            if request.get('selectedPages') and number not in request['selectedPages']:
                continue
            target = destination / row['file']
            if not target.exists() or digest(target) != row['sha256']:
                target.write_bytes((folder / row['file']).read_bytes())
            published.append({**row, 'src': '/' + target.relative_to(ROOT / 'public').as_posix(),
                **({'pageNumber': number} if request.get('selectedPages') else {})})
    return {**cached, 'source': str(source), 'href': request['href'], 'owners': request.get('owners', []),
            'published': published, 'reused': reused,
            'cacheDirectory': str(folder)}


def main():
    requests = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
    configuration = ocr_configuration()
    results = []
    for request in requests:
        result = prepare(request)
        if request['kind'] == 'pdf' or request.get('extractText'):
            result.update(search_copy(result, Path(result['cacheDirectory']), configuration))
        results.append(result)
        print(f"{request['href']}: {len(result['images'])} image(s), text {result.get('searchStatus', result['textStatus'])}, cached {result['reused']}", flush=True)
    CACHE.mkdir(parents=True, exist_ok=True)
    (CACHE / 'index.json').write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    public = {row['href']: {'sourceSha256': row['sourceSha256'], 'sourceBytes': row['sourceBytes'],
        **({'sourcePages': len(row['images'])} if row['href'].endswith('.pdf') else {}),
        'images': [{key: image[key] for key in ('src', 'width', 'height', 'bytes', 'sha256', 'pageNumber') if key in image}
                   for image in row['published']]} for row in results if row['published']}
    (ROOT / 'src/data/prepared-media.ts').write_text(
        '// Generated by npm run media:prepare. Text and source paths stay in the private cache.\n'
        "import type { PreparedAsset } from './prepared-media-types';\n"
        + 'export const preparedMedia: Record<string, PreparedAsset> = '
        + json.dumps(public, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')


if __name__ == '__main__':
    main()
