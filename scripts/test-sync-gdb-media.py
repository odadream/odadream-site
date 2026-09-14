import hashlib,json,tempfile,unittest
from pathlib import Path
import importlib.util
P=Path(__file__).with_name('sync-gdb-media.py');s=importlib.util.spec_from_file_location('sync_gdb_media',P);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
class SyncTests(unittest.TestCase):
 def test_checksum_provenance_and_preview_gate(self):
  with tempfile.TemporaryDirectory() as td:
   r=Path(td);raw=b'\x89PNG\r\n\x1a\nimage';sha=hashlib.sha256(raw).hexdigest();b=r/'b'/sha[:2]/sha;b.parent.mkdir(parents=True);b.write_bytes(raw)
   snap={'audience':'trusted_internal','receipt_sha256':'rev','as_of':'now','media':[{'name':'hero.png','sha256':sha,'role':'Hero','rationale':'chosen','resolution_status':'resolved','selected_media':{'artifact_id':'a','revision_id':'r'},'original':{'sha256':'o'}}]}
   p=r/'s.json';p.write_text(json.dumps(snap),encoding='utf-8');snapshot_sha=hashlib.sha256(p.read_bytes()).hexdigest();out=r/'out';result=m.sync(p,r/'b',out,snapshot_sha)
   self.assertEqual(result['publication_status'],'preview_only');self.assertEqual(result['items'][0]['revision_id'],'r');self.assertEqual((out/'assets'/Path(result['items'][0]['url']).name).read_bytes(),raw)
   self.assertEqual(Path(result['items'][0]['url']).suffix,'.png');self.assertEqual(result['source_snapshot_sha256'],snapshot_sha)
   with self.assertRaisesRegex(ValueError,'snapshot checksum mismatch'): m.sync(p,r/'b',r/'bad','0'*64)
if __name__=='__main__':unittest.main()
