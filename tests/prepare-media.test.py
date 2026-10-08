"""Preparation-engine tests: python tests/prepare-media.test.py."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from types import SimpleNamespace

import fitz
from PIL import Image

spec = importlib.util.spec_from_file_location('prepare_media', Path(__file__).resolve().parents[1] / 'scripts/prepare-media.py')
engine = importlib.util.module_from_spec(spec)
spec.loader.exec_module(engine)


class PreparationTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        engine.ROOT = self.root
        engine.CACHE = self.root / 'private-cache'

    def tearDown(self):
        self.temporary.cleanup()

    def pdf(self):
        source = self.root / 'source.pdf'
        with fitz.open() as document:
            document.new_page().insert_text((72, 72), 'Readable archive document')
            document.new_page()  # Scanned/empty pages must not be claimed as extracted.
            document.save(source)
        return {'source': str(source), 'href': '/documents/example.pdf', 'kind': 'pdf', 'publish': True}

    def test_page_text_association_and_private_sidecars(self):
        result = engine.prepare(self.pdf())
        self.assertEqual(len(result['published']), 2)
        self.assertEqual(result['textStatus'], 'partial')
        self.assertEqual(result['texts'][1]['status'], 'needs-ocr')
        folder = Path(result['cacheDirectory'])
        self.assertIn('Readable archive document', (folder / 'page-001.txt').read_text())
        self.assertEqual(result['sourceSha256'], engine.digest(self.root / 'source.pdf'))
        self.assertEqual(list((self.root / 'public').rglob('*.txt')), [])

    def test_reuse_does_not_render_or_extract_again_and_corruption_is_repaired(self):
        request = self.pdf()
        first = engine.prepare(request)
        cached = Path(first['cacheDirectory']) / first['images'][0]['file']
        timestamp = cached.stat().st_mtime_ns
        self.assertTrue(engine.prepare(request)['reused'])
        self.assertEqual(cached.stat().st_mtime_ns, timestamp)
        cached.write_bytes(b'corruption')
        self.assertFalse(engine.prepare(request)['reused'])
        self.assertEqual(engine.digest(cached), first['images'][0]['sha256'])
        (Path(first['cacheDirectory']) / 'manifest.json').write_text('{broken JSON')
        self.assertFalse(engine.prepare(request)['reused'])

    def test_source_and_policy_changes_create_new_cache_keys(self):
        request = self.pdf()
        first = engine.prepare(request)
        with fitz.open(request['source']) as document:
            document[0].insert_text((72, 100), 'Changed version')
            document.saveIncr()
        second = engine.prepare(request)
        self.assertNotEqual(first['key'], second['key'])
        old = engine.POLICY['version']
        try:
            engine.POLICY['version'] = old + 1
            self.assertNotEqual(second['key'], engine.prepare(request)['key'])
        finally:
            engine.POLICY['version'] = old

    def test_photographs_resize_preserve_ratio_and_leave_source_untouched(self):
        source = self.root / 'large.png'
        Image.new('RGB', (4000, 2000), 'green').save(source)
        original = engine.digest(source)
        result = engine.prepare({'source': str(source), 'href': '/images/large.png', 'kind': 'image', 'publish': False})
        self.assertEqual((result['images'][0]['width'], result['images'][0]['height']), (2000, 1000))
        self.assertEqual(result['published'], [])
        self.assertEqual(engine.digest(source), original)

    def test_ocr_reuses_text_and_changes_only_search_cache_when_model_changes(self):
        record = engine.prepare(self.pdf())
        folder = Path(record['cacheDirectory'])
        settings = {'fingerprint': 'model-one', 'executable': 'test-ocr', 'models': 'test-models'}
        image_timestamp = (folder / 'page-002.webp').stat().st_mtime_ns
        with patch.object(engine.subprocess, 'run', return_value=SimpleNamespace(stdout='Recognized scan')) as recognizer:
            result = engine.search_copy(record, folder, settings)
            self.assertEqual(result['searchStatus'], 'ocr-assisted')
            self.assertTrue(result['machineTextNeedsReview'])
            engine.search_copy(record, folder, settings)
            self.assertEqual(recognizer.call_count, 1)
            engine.search_copy(record, folder, {**settings, 'fingerprint': 'model-two'})
            self.assertEqual(recognizer.call_count, 2)
        self.assertEqual((folder / 'page-002.webp').stat().st_mtime_ns, image_timestamp)

    def test_exif_orientation_is_applied_before_measuring_dimensions(self):
        source = self.root / 'rotated.jpg'
        image = Image.new('RGB', (400, 200), 'blue')
        exif = image.getexif()
        exif[274] = 6
        image.save(source, exif=exif)
        result = engine.prepare({'source': str(source), 'href': '/images/rotated.jpg', 'kind': 'image'})
        self.assertEqual((result['images'][0]['width'], result['images'][0]['height']), (200, 400))

    def test_sparse_slide_text_uses_second_segmentation_when_paragraph_detection_fails(self):
        record = engine.prepare(self.pdf())
        configuration = {'fingerprint': 'sparse-slide', 'executable': 'test-ocr', 'models': 'test-models'}
        with patch.object(engine.subprocess, 'run', side_effect=[SimpleNamespace(stdout=''), SimpleNamespace(stdout='Slide title')]) as recognizer:
            result = engine.search_copy(record, Path(record['cacheDirectory']), configuration)
            self.assertEqual(result['searchStatus'], 'ocr-assisted')
            self.assertEqual(recognizer.call_args_list[0].args[0][-1], '3')
            self.assertEqual(recognizer.call_args_list[1].args[0][-1], '11')


if __name__ == '__main__':
    unittest.main()
