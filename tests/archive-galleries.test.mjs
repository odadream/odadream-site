import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadSiteModule } from '../scripts/site-data.mjs';
import { videoPreparationMatches } from '../scripts/verify-prepared-media.mjs';
import { externalMediaInput } from '../scripts/media-input.mjs';
const data = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
const { mediaFit } = await loadSiteModule('src/lib/media-presentation.ts');
const inventory = JSON.parse(await readFile('docs/migration/INVENTORY-2026-10-05.json'));
const scope = createPublicationScope(data, publicationPlan);

test('private image inputs are distinct from legacy public paths and stay outside publication data', () => {
  assert.equal(
    externalMediaInput({ archiveSource: { inputPath: 'D:/private/photo.jpg' } }),
    'D:/private/photo.jpg',
  );
  assert.equal(
    externalMediaInput({ archiveSource: { inputPath: '/video/archive/source/movie.mp4' } }),
    undefined,
  );
  const photos = data.media.filter((row) => row.id.startsWith('abrau-2026-'));
  assert.equal(photos.length, 5);
  assert.ok(photos.every((row) => row.originalAccess === 'internal' && externalMediaInput(row)));
});

test('changing a selected video segment invalidates an otherwise identical preparation receipt', async () => {
  const { preparedVideos } = await loadSiteModule('src/data/prepared-videos.ts');
  const video = data.media.find((row) => row.id === 'neurosync-lab-recording');
  const proof = preparedVideos[video.id];
  assert.ok(videoPreparationMatches(video, proof));
  const changed = structuredClone(video);
  changed.archiveSource.segment.start = 120;
  assert.ok(!videoPreparationMatches(changed, proof));
  changed.archiveSource.segment = undefined;
  assert.ok(!videoPreparationMatches(changed, proof));
  assert.ok(!videoPreparationMatches(video, { ...proof, policyVersion: 1 }));
});

test('recovered recordings keep exact owners and exclude private input paths from PUBLIC', () => {
  const video = scope.media.find((row) => row.id === 'tskhr-lecture-recording');
  assert.ok(scope.programmes.find((row) => row.id === 'beautiful-brain').media.includes(video.id));
  assert.ok(!scope.programmes.find((row) => row.id === 'neuroaesthetics-lec').media.includes(video.id));
  assert.ok(scope.assetPaths.has(video.src));
  assert.ok(!JSON.stringify(video).includes('YandexDisk'));
  const hidden = createPublicationScope(data, {
    ...publicationPlan,
    programmes: publicationPlan.programmes.filter((id) => id !== 'beautiful-brain'),
  });
  assert.ok(!hidden.media.some((row) => row.id === video.id));
  assert.ok(!hidden.assetPaths.has(video.src));
  assert.deepEqual(data.media.find((row) => row.id === 'neurosync-lab-recording').archiveSource.segment, {
    start: 180,
    duration: 30,
  });
});

test('every applied raster source has a real media record and the declared semantic owners', () => {
  const items = inventory.currentFullMediaReassessment.items.filter((row) => row.role === 'image');
  assert.equal(items.length, 178);
  for (const row of items) {
    assert.ok(row.application, row.path);
    const decision = row.application;
    if (!['applied', 'represented', 'merged'].includes(decision.action)) continue;
    const media = data.media.find((item) => item.id === decision.mediaId);
    assert.ok(media, row.path);
    assert.ok(
      scope.media.some((item) => item.id === media.id),
      row.path,
    );
    for (const owner of decision.owners ?? []) {
      const [kind, id] = owner.split(':');
      const collection = kind === 'work' ? data.works : kind === 'case' ? data.cases : data.programmes;
      const entity =
        kind === 'education' ? data.educationOverview : collection.find((item) => item.id === id);
      assert.ok(entity?.media.includes(media.id), owner + ' ' + row.path);
    }
    if (decision.action === 'merged') {
      const represented = items.find((item) => item.path === decision.representedBy);
      assert.equal(represented.application.mediaId, decision.mediaId, row.path);
    }
  }
});

test('archival gallery originals stay out of the public artifact and inherit work gates', () => {
  const original = data.media.find(
    (row) => row.archiveSource && data.works.find((work) => work.id === 'happiness').media.includes(row.id),
  );
  const visible = scope.media.find((row) => row.id === original.id);
  assert.ok(!scope.assetPaths.has(original.src));
  assert.ok(scope.assetPaths.has(visible.src));
  assert.ok(!JSON.stringify(visible).includes('archiveSource'));
  const withoutWork = createPublicationScope(data, {
    ...publicationPlan,
    works: publicationPlan.works.filter((id) => id !== 'happiness'),
  });
  assert.ok(!withoutWork.media.some((row) => row.id === original.id));
  assert.ok(!withoutWork.assetPaths.has(visible.src));
});

test('interface screenshots stay whole and educational overview media respect their own gate', () => {
  assert.equal(data.media.find((row) => row.id === 'mindshow').representation, 'screenshot');
  assert.equal(mediaFit({ representation: 'screenshot', focalPoint: 'center' }, 'crop'), 'natural');
  const withoutEducation = createPublicationScope(data, { ...publicationPlan, educationOverview: false });
  for (const id of data.educationOverview.media) {
    if (id === 'archive-talk-workshop-lectures-tavrida') continue; // Also owned by the documented programme/event.
    assert.ok(!withoutEducation.media.some((row) => row.id === id));
    const visible = scope.media.find((row) => row.id === id);
    assert.ok(!withoutEducation.assetPaths.has(visible.src));
  }
  const shared = 'archive-talk-workshop-lectures-tavrida';
  assert.ok(withoutEducation.media.some((row) => row.id === shared));
  const withoutOwners = createPublicationScope(data, {
    ...publicationPlan,
    educationOverview: false,
    programmes: publicationPlan.programmes.filter((id) => id !== 'taste-brain'),
  });
  assert.ok(!withoutOwners.cases.some((row) => row.id === 'tavrida-gastro-2025'));
  assert.ok(!withoutOwners.media.some((row) => row.id === shared));
  const source = structuredClone(
    Object.fromEntries(Object.entries(data).filter(([, value]) => typeof value !== 'function')),
  );
  const restrictedId = source.educationOverview.media[0];
  source.media.find((row) => row.id === restrictedId).rights = 'restricted';
  const restricted = createPublicationScope(source, publicationPlan);
  assert.ok(!restricted.educationOverview.media.includes(restrictedId));
  assert.ok(!restricted.assetPaths.has(scope.media.find((row) => row.id === restrictedId).src));
});
