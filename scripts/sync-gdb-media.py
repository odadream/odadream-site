#!/usr/bin/env python3
import argparse,hashlib,json,shutil
from pathlib import Path

def media_extension(raw:bytes):
 if raw.startswith(b'\x89PNG\r\n\x1a\n'): return '.png'
 if raw.startswith(b'\xff\xd8\xff'): return '.jpg'
 if raw.startswith(b'RIFF') and raw[8:12]==b'WEBP': return '.webp'
 raise ValueError('unsupported media type')

def sync(snapshot:Path,blobs:Path,out:Path,expected_snapshot_sha256:str):
 snapshot_raw=snapshot.read_bytes()
 actual_snapshot_sha256=hashlib.sha256(snapshot_raw).hexdigest()
 if actual_snapshot_sha256 != expected_snapshot_sha256: raise ValueError('snapshot checksum mismatch')
 d=json.loads(snapshot_raw.decode('utf-8'))
 if d.get('audience')!='trusted_internal': raise ValueError('expected trusted_internal core export')
 assets=out/'assets';assets.mkdir(parents=True,exist_ok=True)
 rows=[];excluded=[]
 for m in d.get('media',[]):
  sha=m.get('sha256')
  if m.get('resolution_status')!='resolved' or not sha:
   excluded.append({'name':m.get('name'),'reason':m.get('resolution_status')});continue
  src=blobs/sha[:2]/sha
  if not src.is_file(): raise FileNotFoundError(src)
  raw=src.read_bytes()
  if hashlib.sha256(raw).hexdigest()!=sha: raise ValueError('checksum mismatch '+sha)
  name=f"{len(rows)+1:02d}-{sha[:12]}{media_extension(raw)}";shutil.copyfile(src,assets/name)
  original=m.get('original') or {}
  rows.append({'url':'./assets/'+name,'sha256':sha,'role':m['role'],'rationale':m['rationale'],
   'artifact_id':m['selected_media']['artifact_id'],'revision_id':m['selected_media']['revision_id'],
   'original':{k:original.get(k) for k in ('artifact_id','revision_id','sha256','authored_locator')},
   'publication_status':'preview_only'})
 manifest={'schema_version':'gdb-site-media/1','source_snapshot_sha256':actual_snapshot_sha256,
  'source_as_of':d.get('as_of'),'publication_status':'preview_only','items':rows,'excluded':excluded}
 (out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 return manifest

def main():
 p=argparse.ArgumentParser();p.add_argument('snapshot',type=Path);p.add_argument('blobs',type=Path);p.add_argument('out',type=Path);p.add_argument('--snapshot-sha256',required=True);a=p.parse_args()
 if a.out.exists(): raise FileExistsError(a.out)
 m=sync(a.snapshot,a.blobs,a.out,a.snapshot_sha256);print(json.dumps({'items':len(m['items']),'excluded':len(m['excluded'])}))
if __name__=='__main__':main()
