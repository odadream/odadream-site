"""Read provider configuration and legacy-entry traffic through the owner's local hub.

Uses existing authentication in memory. Does not collect into the hub DB, change
provider settings, or export raw URLs, UTM values, contacts or credentials.
"""
import argparse
from collections import Counter
from datetime import date, timedelta
import json
from pathlib import Path
import re
import sys
from urllib.parse import parse_qs, urlsplit, quote

parser = argparse.ArgumentParser()
parser.add_argument('--hub', required=True)
parser.add_argument('--end', default=(date.today() - timedelta(days=1)).isoformat())
parser.add_argument('--start')
args = parser.parse_args()
end = date.fromisoformat(args.end)
start = date.fromisoformat(args.start) if args.start else end - timedelta(days=89)
if start > end:
    parser.error('start must not be later than end')
hub = Path(args.hub).resolve()
sys.path.insert(0, str(hub / 'src'))
from oda_analytics.cli import _load_dotenv
from oda_analytics.config import load_config
from oda_analytics.collectors import make_collector
from oda_analytics.http import JsonHttpClient, bearer

_load_dotenv(hub / '.env')
config = load_config(hub / 'config/projects/odadream.toml')
http = JsonHttpClient(timeout=20, retries=0)
inventory_path = Path('docs/migration/INVENTORY-2026-10-05.json')
inventory = json.loads(inventory_path.read_text(encoding='utf8'))
legacy = json.loads(Path('src/data/legacy-map.json').read_text(encoding='utf8'))
known_ids = {name for row in legacy for name in [row['id'], *row.get('aliases', [])]}
known_assets = {row['path'] for row in inventory['assets']['rows']}
events = {'page_view', 'contact_open', 'click_email', 'click_external', 'material_open', 'media_open', 'media_view', 'video_start', 'video_complete'}

def safe_error(exc):
    status = re.search(r'HTTP (\d{3})', str(exc))
    return {'status': 'not-verified', 'errorType': type(exc).__name__, 'httpStatus': int(status.group(1)) if status else None}

def classify(address):
    url = urlsplit(address)
    identity = parse_qs(url.query).get('id', [''])[0]
    if identity:
        return ('legacy-id', identity) if identity in known_ids else ('other', 'unknown-id-redacted')
    if url.path in known_assets:
        return ('historical-resource', url.path)
    if url.path in ('', '/', '/ru/', '/en/'):
        return ('overview', url.path or '/')
    return ('other', 'unclassified-path-redacted')

def aggregate(rows):
    totals = Counter()
    for address, count in rows:
        totals[classify(address)] += count
    return [{'kind': key[0], 'identity': key[1], 'pageViews': count} for key, count in totals.most_common()]

results = {'asOf': date.today().isoformat(), 'mode': 'read-only', 'source': str(hub), 'dateRange': {'start': start.isoformat(), 'end': end.isoformat()}, 'providers': {}}
for provider, source_id in [('google', 'odadream-site-ga4'), ('metrica', 'odadream-metrica')]:
    source = next(row for row in config.sources if row['id'] == source_id)
    try:
        token = make_collector(source['provider'], source, hub).token()
        auth = bearer(token)
        if provider == 'google':
            property_name = 'properties/' + source['property_id']
            streams = http.request('GET', 'https://analyticsadmin.googleapis.com/v1beta/' + property_name + '/dataStreams', headers=auth)
            stream = next(s for s in streams.get('dataStreams', []) if s.get('webStreamData', {}).get('measurementId') == source['measurement_id'])
            settings = http.request('GET', 'https://analyticsadmin.googleapis.com/v1alpha/' + stream['name'] + '/enhancedMeasurementSettings', headers=auth)
            result = {'status': 'read-verified', 'property': property_name, 'stream': stream['name'], 'measurementId': source['measurement_id'], 'enhancedMeasurementSettings': {key: value for key, value in settings.items() if key.endswith('Enabled')}}
            try:
                grant = http.request('GET', 'https://oauth2.googleapis.com/tokeninfo', params={'access_token': token})
                scopes = set(grant.get('scope', '').split())
                result['oauthPermissions'] = {'status': 'read-verified', 'analyticsReadOnly': 'https://www.googleapis.com/auth/analytics.readonly' in scopes, 'analyticsEdit': 'https://www.googleapis.com/auth/analytics.edit' in scopes, 'analyticsFull': 'https://www.googleapis.com/auth/analytics' in scopes}
            except Exception as exc:
                result['oauthPermissions'] = safe_error(exc)
            base = {'dateRanges': [{'startDate': start.isoformat(), 'endDate': end.isoformat()}], 'dimensionFilter': {'filter': {'fieldName': 'hostName', 'stringFilter': {'matchType': 'EXACT', 'value': source['hostname']}}}, 'limit': '10000'}
            try:
                report = http.request('POST', 'https://analyticsdata.googleapis.com/v1beta/' + property_name + ':runReport', headers=auth, json_body={**base, 'dimensions': [{'name': 'pagePathPlusQueryString'}], 'metrics': [{'name': 'screenPageViews'}]})
                rows = report.get('rows', [])
                result['traffic'] = {'status': 'read-verified', 'rowCount': report.get('rowCount', 0), 'complete': len(rows) == report.get('rowCount', 0), 'entries': aggregate((row['dimensionValues'][0]['value'], float(row['metricValues'][0]['value'])) for row in rows), 'metadata': {key: report.get('metadata', {}).get(key) for key in ('dataLossFromOtherRow', 'subjectToThresholding', 'samplingMetadatas')}}
                report = http.request('POST', 'https://analyticsdata.googleapis.com/v1beta/' + property_name + ':runReport', headers=auth, json_body={**base, 'dimensions': [{'name': 'eventName'}], 'metrics': [{'name': 'eventCount'}]})
                result['contractEvents'] = {row['dimensionValues'][0]['value']: float(row['metricValues'][0]['value']) for row in report.get('rows', []) if row['dimensionValues'][0]['value'] in events}
            except Exception as exc:
                result['traffic'] = safe_error(exc)
        else:
            counter_id = source['counter_id']
            counter = http.request('GET', 'https://api-metrika.yandex.net/management/v1/counter/' + counter_id, headers=auth)['counter']
            goals = http.request('GET', 'https://api-metrika.yandex.net/management/v1/counter/' + counter_id + '/goals', headers=auth).get('goals', [])
            options = counter.get('code_options', {})
            result = {'status': 'read-verified', 'counterId': counter_id, 'automaticGoalsEnabled': counter.get('autogoals_enabled'), 'codeOptions': {key: options.get(key) for key in ('visor', 'clickmap', 'ecommerce', 'ytm')}, 'goalCount': len(goals), 'contractGoals': [{'id': goal['id'], 'event': goal['name']} for goal in goals if goal.get('name') in events]}
            try:
                report = http.request('GET', 'https://api-metrika.yandex.net/stat/v1/data', headers=auth, params={'ids': counter_id, 'date1': start.isoformat(), 'date2': end.isoformat(), 'dimensions': 'ym:pv:URL', 'metrics': 'ym:pv:pageviews', 'filters': "ym:pv:URL=@'https://odadream.art/'", 'limit': 10000, 'accuracy': 'full'})
                rows = report.get('data', [])
                result['traffic'] = {'status': 'read-verified', 'rowCount': report.get('total_rows', 0), 'complete': len(rows) == report.get('total_rows', 0), 'sampled': report.get('sampled'), 'sampleShare': report.get('sample_share'), 'entries': aggregate((row['dimensions'][0]['name'], float(row['metrics'][0])) for row in rows)}
            except Exception as exc:
                result['traffic'] = safe_error(exc)
        results['providers'][provider] = result
    except Exception as exc:
        results['providers'][provider] = safe_error(exc)
try:
    source = next(row for row in config.sources if row['id'] == 'odadream-search-console')
    auth = bearer(make_collector(source['provider'], source, hub).token())
    report = http.request('POST', 'https://searchconsole.googleapis.com/webmasters/v3/sites/' + quote(source['site_url'], safe='') + '/searchAnalytics/query', headers=auth, json_body={'startDate': start.isoformat(), 'endDate': end.isoformat(), 'dimensions': ['page'], 'type': 'web', 'dataState': 'final', 'rowLimit': 1000, 'dimensionFilterGroups': [{'filters': [{'dimension': 'page', 'operator': 'includingRegex', 'expression': r'^https?://(?:www\.)?odadream\.art(?:/|$)'}]}]})
    totals = {}
    for row in report.get('rows', []):
        key = classify(row['keys'][0])
        total = totals.setdefault(key, {'kind': key[0], 'identity': key[1], 'clicks': 0, 'impressions': 0})
        total['clicks'] += row.get('clicks', 0)
        total['impressions'] += row.get('impressions', 0)
    results['searchConsole'] = {'status': 'read-verified', 'property': source['site_url'], 'rowsReturned': len(report.get('rows', [])), 'rowLimit': 1000, 'dataState': 'final', 'type': 'web', 'dateTimezone': 'America/Los_Angeles', 'guaranteeAllRows': False, 'entries': list(totals.values()), 'limitation': 'Search Console returns top rows, not a guarantee of all indexed/visited URLs. No observed legacy row does not prove no indexed entrance. Only page aggregates; search terms and raw query/contact values are not saved.'}
except Exception as exc:
    results['searchConsole'] = safe_error(exc)
results['limitation'] = 'Provider settings and historical aggregate traffic are not a live V2 delivery test. No observed traffic does not establish no external entrances; dates, consent, provider capture and truncation limit coverage. Unknown URLs and all query/contact payloads are redacted. No provider/hub state changed.'
inventory['currentAnalyticsPreflight'] = results
inventory_path.write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
for name, result in results['providers'].items():
    traffic = result.get('traffic', {})
    print(json.dumps({'provider': name, 'status': result['status'], 'trafficStatus': traffic.get('status'), 'rowCount': traffic.get('rowCount'), 'complete': traffic.get('complete'), 'entries': traffic.get('entries'), 'httpStatus': traffic.get('httpStatus')}, ensure_ascii=False))
print(json.dumps({'searchConsole': results['searchConsole']}, ensure_ascii=False))
