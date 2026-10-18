import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { loadSiteModule } from './site-data.mjs';
import { technicalOverviewInput, cvInput } from './document-input.mjs';
import { verifyPreparedMedia } from './verify-prepared-media.mjs';
import { verifySourceCoverage } from './verify-source-coverage.mjs';
import { externalMediaInput } from './media-input.mjs';

const data = await loadSiteModule();
const { preparedVideos } = await loadSiteModule('src/data/prepared-videos.ts');
const { preparedMedia } = await loadSiteModule('src/data/prepared-media.ts');
const { isLocalAssetPath } = await loadSiteModule('src/lib/publication-scope.ts');
const mediaAudit = JSON.parse(await readFile('docs/media-audit.json', 'utf8'));
const mediaDecisions = JSON.parse(await readFile('docs/media-decisions.json', 'utf8'));
const legacy = JSON.parse(await readFile('src/data/legacy-map.json', 'utf8'));
const legacyIds = new Set(legacy.map((row) => row.id));
const files = new Set(legacy.map((row) => row.source));
const errors = [];
function checkCollection(name, rows) {
  const ids = new Set();
  for (const row of rows) {
    if (ids.has(row.id)) errors.push(`${name}: duplicate id ${row.id}`);
    ids.add(row.id);
    if (row.legacyId && !legacyIds.has(row.legacyId))
      errors.push(`${name} ${row.id}: unknown legacyId ${row.legacyId}`);
    if (row.publication && !['draft', 'review', 'published'].includes(row.publication))
      errors.push(`${name} ${row.id}: invalid publication`);
    for (const [key, value] of Object.entries(row))
      if (value && typeof value === 'object' && !Array.isArray(value) && 'en' in value && 'ru' in value) {
        if (
          typeof value.en === 'string' &&
          typeof value.ru === 'string' &&
          (!value.en.trim() || !value.ru.trim())
        )
          errors.push(`${name} ${row.id}: empty locale in ${key}`);
        if (Array.isArray(value.en) && Array.isArray(value.ru) && (!value.en.length || !value.ru.length))
          errors.push(`${name} ${row.id}: empty locale array in ${key}`);
      }
    for (const match of String(row.source || '').matchAll(/([\w-]+\.md)/g))
      if (!files.has(match[1])) errors.push(`${name} ${row.id}: missing source ${match[1]}`);
  }
}
function checkLocales(value, label) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value.links)) {
    const linkIds = new Set();
    for (const link of value.links) {
      if (!link.id || linkIds.has(link.id)) errors.push(`${label}: duplicate/missing source link id`);
      linkIds.add(link.id);
      try {
        const url = new URL(link.href);
        if (url.protocol !== 'https:' || url.username || url.password) throw Error('Unsafe URL');
      } catch {
        errors.push(`${label}: unsafe source link ${link.id}`);
      }
      if (!['video', 'audio', 'article'].includes(link.kind)) errors.push(`${label}: invalid source kind`);
    }
  }
  if ('en' in value || 'ru' in value) {
    for (const lang of ['en', 'ru']) {
      const text = value[lang];
      if (
        typeof text === 'string'
          ? !text.trim()
          : !Array.isArray(text) || !text.length || text.some((row) => typeof row !== 'string' || !row.trim())
      )
        errors.push(`${label}: missing locale ${lang}`);
    }
  } else for (const [key, child] of Object.entries(value)) checkLocales(child, `${label}.${key}`);
}
const migrationInventory = JSON.parse(await readFile('docs/migration/INVENTORY-2026-10-05.json', 'utf8'));
const ownerArchive = JSON.parse(await readFile('docs/RECOGNITION-SOURCE-INVENTORY.json', 'utf8'));
const snapshots = { ...(migrationInventory.v2SourceSnapshots ?? {}), ...ownerArchive.sourceSnapshots };
// Explicitly registered owner-provided editorial snapshots, independent of the 238 V1 IDs.
for (const [file, snapshot] of Object.entries(migrationInventory.externalSourceSnapshots ?? {}))
  if (
    snapshot.kind === 'external-editorial' &&
    snapshot.sourcePath &&
    snapshot.sha256 === snapshots[file]?.sha256 &&
    snapshot.v2Migration?.sourceSha256 === snapshot.sha256 &&
    snapshot.v2Migration?.targets?.length
  )
    files.add(file);
for (const name of [
  'methods',
  'cooperationPages',
  'studioPages',
  'works',
  'configurations',
  'programmes',
  'cases',
  'evidence',
  'recognitions',
  'people',
  'organizations',
  'media',
  'workDocuments',
  'referenceDocuments',
  'legacyWorkResources',
])
  checkCollection(name, data[name]);
for (const [file, ref] of Object.entries(data.sourceSnapshots)) {
  if (
    !(files.has(file) || Object.hasOwn(ownerArchive.sourceSnapshots, file)) ||
    ref.file !== file ||
    !/^[a-f0-9]{64}$/.test(ref.sha256) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(ref.snapshot)
  )
    errors.push(`source snapshot ${file}: invalid provenance`);
  if (snapshots[file]?.sha256 !== ref.sha256) errors.push(`source snapshot ${file}: inventory drift`);
}
for (const row of [
  ...data.methods,
  ...data.cooperationPages,
  ...data.configurations,
  ...data.programmes,
  data.educationOverview,
  ...data.works,
  ...data.studioPages,
  ...data.cases,
  ...data.eventSeries,
  ...data.evidence,
  ...data.recognitions,
  ...data.people.filter((row) => row.sourceRefs),
  ...data.workDocuments,
  ...data.referenceDocuments,
]) {
  checkLocales(row, row.id);
  if (
    !row.sourceRefs.length ||
    row.sourceRefs.some((ref) => !ref || data.sourceSnapshots[ref.file]?.sha256 !== ref.sha256)
  )
    errors.push(`${row.id}: missing or inconsistent source references`);
}
for (const format of [...data.configurations, ...data.programmes, data.educationOverview]) {
  if (!format.conditions.length || !format.story || !format.participation || !format.outcome)
    errors.push(`participation ${format.id}: incomplete migrated detail`);
  const conditions = new Set();
  for (const condition of format.conditions) {
    if (conditions.has(condition.id) || !['historical', 'per-brief', 'conflict'].includes(condition.state))
      errors.push(`participation ${format.id}: invalid or duplicate condition ${condition.id}`);
    conditions.add(condition.id);
  }
}
const ids = (rows) => new Set(rows.map((row) => row.id));
for (const person of data.people.filter((row) => row.cv)) {
  if (
    !person.cv.sections.length ||
    !person.cv.base.ru ||
    !person.cv.base.en ||
    person.cv.workIds.some((id) => !data.works.some((row) => row.id === id)) ||
    person.cv.caseIds.some((id) => !data.cases.some((row) => row.id === id))
  )
    errors.push(`person ${person.id}: invalid CV facts or portfolio references`);
}
for (const studio of data.studioPages) {
  for (const id of studio.people) {
    const person = data.people.find((row) => row.id === id);
    if (!person?.biography || !person?.sourceRefs?.length)
      errors.push(`studio ${studio.id}: missing biography or source for ${id}`);
  }
  for (const item of studio.materials)
    if (!/^(works|technology|education|cooperation|cases|recognition)\/$/.test(item.path))
      errors.push(`studio ${studio.id}: invalid material destination ${item.path}`);
}
const workIds = ids(data.works),
  configurationIds = ids(data.configurations),
  programmeIds = ids(data.programmes),
  caseIds = ids(data.cases),
  mediaIds = ids(data.media),
  orgIds = ids(data.organizations),
  evidenceIds = ids(data.evidence);
for (const method of data.methods) {
  for (const id of method.works) if (!workIds.has(id)) errors.push(`method ${method.id}: missing work ${id}`);
  for (const id of method.media)
    if (!mediaIds.has(id)) errors.push(`method ${method.id}: missing media ${id}`);
}
for (const page of data.cooperationPages)
  for (const scenario of page.scenarios)
    for (const id of scenario.configurationIds)
      if (!configurationIds.has(id)) errors.push(`cooperation ${scenario.id}: missing format ${id}`);
for (const hero of data.heroVisuals) {
  if (!mediaIds.has(hero.mediaId)) errors.push(`hero ${hero.id}: missing media`);
  if (hero.target.kind === 'method' && !data.methods.some((row) => row.id === hero.target.methodId))
    errors.push(`hero ${hero.id}: missing method`);
  if (hero.target.kind === 'work' && !workIds.has(hero.target.workId))
    errors.push(`hero ${hero.id}: missing work`);
}
for (const work of data.works) {
  if (!work.story?.length || !work.credits?.length || !work.reviewNotes?.length)
    errors.push(`work ${work.id}: narrative, credits or interpretation boundaries missing`);
  const storyIds = new Set();
  for (const section of work.story ?? []) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.id) || storyIds.has(section.id))
      errors.push(`work ${work.id}: invalid or duplicate story anchor ${section.id}`);
    storyIds.add(section.id);
  }
  for (const id of work.relatedWorks ?? [])
    if (
      !workIds.has(id) ||
      id === work.id ||
      work.basedOn.includes(id) ||
      data.works.some((related) => related.id === id && related.basedOn.includes(work.id))
    )
      errors.push(`work ${work.id}: invalid or duplicate related work ${id}`);
  for (const field of ['title', 'category', 'summary', 'experience', 'question', 'availability']) {
    for (const lang of ['en', 'ru']) {
      if (typeof work[field]?.[lang] !== 'string' || !work[field][lang].trim())
        errors.push(`work ${work.id}: missing ${field}.${lang}`);
    }
  }
  if (work.methodId && !data.methods.some((row) => row.id === work.methodId))
    errors.push(`work ${work.id}: missing method ${work.methodId}`);
  if (!work.media.length && (!work.mediaNote?.ru || !work.mediaNote?.en))
    errors.push(`work ${work.id}: missing preview or explicit media availability note`);
  if (work.year !== null && (!Number.isInteger(work.year) || work.year < 1000 || work.year > 2100))
    errors.push(`work ${work.id}: year must be a documented integer or explicit null`);
  if (
    !['performance', 'installation', 'game', 'object', 'participatory-practice', 'interactive-work'].includes(
      work.workType,
    )
  )
    errors.push(`work ${work.id}: invalid work type`);
  if (!['concept', 'prototype', 'in-production', 'realized'].includes(work.stage))
    errors.push(`work ${work.id}: invalid stage`);
  if (work.featuredOnHome && work.stage !== 'realized')
    errors.push(`work ${work.id}: development work featured on home`);
  for (const id of work.basedOn)
    if (!workIds.has(id) || id === work.id) errors.push(`work ${work.id}: invalid basedOn ${id}`);
  if (work.stage !== 'realized' && work.bookable) errors.push(`work ${work.id}: R&D marked bookable`);
  if (work.inRepertoire && work.stage !== 'realized')
    errors.push(`work ${work.id}: repertoire without realization`);
  for (const id of work.media) if (!mediaIds.has(id)) errors.push(`work ${work.id}: missing media ${id}`);
  for (const id of work.cases) if (!caseIds.has(id)) errors.push(`work ${work.id}: missing case ${id}`);
  for (const id of work.configurations)
    if (!configurationIds.has(id)) errors.push(`work ${work.id}: missing format ${id}`);
}
for (const format of data.configurations)
  if (!workIds.has(format.workId))
    errors.push(`configuration ${format.id}: missing owner work ${format.workId}`);
for (const item of data.cases) {
  const datePatterns = { day: /^\d{4}-\d{2}-\d{2}$/, month: /^\d{4}-\d{2}$/, year: /^\d{4}$/ };
  if (!datePatterns[item.datePrecision]?.test(item.date))
    errors.push(`case ${item.id}: invalid date precision`);
  if (
    !['performance', 'presentation', 'participatory-format', 'lecture', 'discussion', 'laboratory'].includes(
      item.type,
    )
  )
    errors.push(`case ${item.id}: invalid event type`);
  if (
    [item.work, item.method, item.programme].filter(Boolean).length > 1 ||
    (item.work && !workIds.has(item.work)) ||
    (item.programme && !programmeIds.has(item.programme)) ||
    (item.method && !data.methods.some((row) => row.id === item.method))
  )
    errors.push(`case ${item.id}: invalid work/method target`);
  if (
    !['held', 'invited', 'submitted', 'declined', 'planned', 'recorded'].includes(item.participationStatus) ||
    !['public', 'private', 'laboratory', 'application'].includes(item.context) ||
    !['participation', 'event-window', 'series-start', 'reported-by'].includes(item.dateMeaning)
  )
    errors.push(`case ${item.id}: invalid participation status, context or date meaning`);
  if (
    item.dateEnd &&
    (!datePatterns[item.datePrecision]?.test(item.dateEnd) ||
      item.dateEnd < item.date ||
      item.dateMeaning !== 'event-window')
  )
    errors.push(`case ${item.id}: invalid event window`);
  if (item.featuredOnHome && item.participationStatus !== 'held')
    errors.push(`case ${item.id}: unconfirmed participation featured on home`);
  for (const id of item.relatedWorks ?? [])
    if (!workIds.has(id)) errors.push(`case ${item.id}: missing related work ${id}`);
  for (const id of item.relatedProgrammes ?? [])
    if (!programmeIds.has(id)) errors.push(`case ${item.id}: missing related programme ${id}`);
  if (item.detailPage && (!item.summary.ru || !item.summary.en || !item.role.ru || !item.role.en))
    errors.push(`case ${item.id}: detail page missing summary or contribution`);
  for (const selection of item.workSelections ?? []) {
    if (
      !workIds.has(selection.workId) ||
      !(item.work === selection.workId || item.relatedWorks?.includes(selection.workId))
    )
      errors.push(`case ${item.id}: selected media has unrelated work ${selection.workId}`);
    for (const id of selection.media)
      if (!item.media.includes(id))
        errors.push(`case ${item.id}: selected media ${id} is outside event gallery`);
  }
  if (typeof item.detailPage !== 'boolean' || typeof item.featuredOnHome !== 'boolean')
    errors.push(`case ${item.id}: page or selection flag missing`);
  if (
    new Set(item.organizationRoles.map((row) => row.organizationId)).size !== item.organizations.length ||
    item.organizationRoles.some((row) => !item.organizations.includes(row.organizationId))
  )
    errors.push(`case ${item.id}: context roles differ from organization links`);
  for (const id of item.organizations)
    if (!orgIds.has(id)) errors.push(`case ${item.id}: missing organization ${id}`);
  for (const id of item.evidence)
    if (!evidenceIds.has(id)) errors.push(`case ${item.id}: missing evidence ${id}`);
  for (const id of item.media) if (!mediaIds.has(id)) errors.push(`case ${item.id}: missing media ${id}`);
}
for (const series of data.eventSeries) {
  if (!series.cases.length || series.cases.some((id) => !caseIds.has(id)))
    errors.push(`series ${series.id}: missing editions`);
}
for (const item of data.recognitions) {
  if (item.event && !caseIds.has(item.event))
    errors.push(`recognition ${item.id}: unknown event ${item.event}`);
  for (const id of item.relatedWorks)
    if (!workIds.has(id)) errors.push(`recognition ${item.id}: missing work ${id}`);
  if (!item.claim || !item.recipient) errors.push(`recognition ${item.id}: attribution missing`);
  if (item.documentState === 'available' && !item.previewSrc)
    errors.push(`recognition ${item.id}: available document without file`);
  if (item.documentState === 'missing' && item.previewSrc)
    errors.push(`recognition ${item.id}: missing document with preview`);
  if (item.previewSrc)
    await readFile(resolve('public', item.previewSrc.slice(1)))
      .then((bytes) => {
        if (createHash('sha256').update(bytes).digest('hex') !== item.documentSha256)
          errors.push(`recognition ${item.id}: inspected document fingerprint changed`);
      })
      .catch(() => errors.push(`recognition ${item.id}: preview asset missing`));
}
const golem = JSON.parse(await readFile('src/data/golem-event-summary.json', 'utf8'));
if (golem.total !== Object.values(golem.connectionQuality).reduce((sum, n) => sum + n, 0))
  errors.push('Golem event summary: categories do not sum to total');
const recognitionSummary = JSON.parse(await readFile('src/data/legacy-recognition-summary.json', 'utf8'));
if (recognitionSummary.total !== Object.values(recognitionSummary.byKind).reduce((sum, n) => sum + n, 0))
  errors.push('Legacy recognition summary: categories do not sum to total');
// This is the dated V1 letters list, not a ceiling on the expanded recognition catalogue.
if (recognitionSummary.sourceSha256 !== data.sourceSnapshots['hub-letters.md']?.sha256)
  errors.push('Legacy recognition summary: source fingerprint differs from the archived letters list');
for (const item of data.media) {
  for (const size of ['width', 'height'])
    if (item[size] !== undefined && (!Number.isInteger(item[size]) || item[size] < 1))
      errors.push(`media ${item.id}: invalid ${size}`);
  if (
    item.representation &&
    !['illustration', 'photograph', 'render', 'diagram', 'poster', 'document', 'screenshot'].includes(
      item.representation,
    )
  )
    errors.push(`media ${item.id}: invalid representation`);
  if (
    item.focalPoint &&
    ![
      'top-left',
      'top',
      'top-right',
      'left',
      'center',
      'right',
      'bottom-left',
      'bottom',
      'bottom-right',
    ].includes(item.focalPoint)
  )
    errors.push(`media ${item.id}: invalid focal point`);

  if (!['cleared', 'review', 'restricted'].includes(item.rights))
    errors.push(`media ${item.id}: invalid rights`);
  if (item.originalAccess && !['public', 'internal'].includes(item.originalAccess))
    errors.push(`media ${item.id}: invalid original access`);
  if (item.archiveSource) {
    if (externalMediaInput(item)) {
      // CI validates the checked-in derivative receipt; private external originals are preparation-only.
      if (
        !/^[a-f0-9]{64}$/.test(item.archiveSource.sha256) ||
        (item.kind === 'video' ? preparedVideos[item.id] : preparedMedia[item.src])?.sourceSha256 !==
          item.archiveSource.sha256 ||
        item.originalAccess !== 'internal' ||
        !item.source
      )
        errors.push(`media ${item.id}: external media preparation receipt missing`);
    } else {
      const origin = mediaAudit.find((row) => row.path === item.archiveSource.path);
      const input = await readFile(
        resolve('public', (item.archiveSource.inputPath ?? item.src).slice(1)),
      ).catch(() => undefined);
      if (
        !origin ||
        origin.sha256 !== item.archiveSource.sha256 ||
        !input ||
        createHash('sha256').update(input).digest('hex') !== origin.sha256
      )
        errors.push(`media ${item.id}: archival source fingerprint drift`);
    }
  }
  if (item.kind === 'video' && !item.poster) errors.push(`media ${item.id}: video poster missing`);
  if (!item.src.startsWith('/')) errors.push(`media ${item.id}: source is not local`);
  else if (!(item.kind === 'image' && externalMediaInput(item)))
    await stat(resolve('public', item.src.slice(1))).catch(() =>
      errors.push(`media ${item.id}: local asset missing`),
    );
  if (item.mobileSrc)
    await stat(resolve('public', item.mobileSrc.slice(1))).catch(() =>
      errors.push(`media ${item.id}: mobile asset missing`),
    );
  for (const path of item.legacyPaths ?? []) {
    if (!isLocalAssetPath(path)) {
      errors.push(`media ${item.id}: invalid legacy path ${path}`);
      continue;
    }
    const original = mediaAudit.find((row) => row.path === path);
    const decision = mediaDecisions[path];
    if (
      !original ||
      decision?.action !== 'preserve' ||
      decision.mediaId !== item.id ||
      decision.sha256 !== original.sha256
    )
      errors.push(`media ${item.id}: missing preservation record ${path}`);
    for (const file of [path, item.src]) {
      const bytes = await readFile(resolve('public', file.slice(1))).catch(() => undefined);
      if (!bytes || createHash('sha256').update(bytes).digest('hex') !== original?.sha256)
        errors.push(`media ${item.id}: historical resource fingerprint mismatch ${file}`);
    }
  }
}
for (const [path, decision] of Object.entries(mediaDecisions))
  if (
    decision.action === 'preserve' &&
    !data.media.some(
      (item) =>
        item.id === decision.mediaId &&
        [item.src, item.mobileSrc, item.poster, item.previewSrc, ...(item.legacyPaths ?? [])].includes(path),
    ) &&
    !data.workDocuments.some((item) => item.id === decision.workDocumentId && item.href === path) &&
    !data.legacyWorkResources.some((item) => item.id === decision.legacyWorkResourceId && item.path === path)
  )
    errors.push(`Orphaned preservation record ${path}`);
for (const [path, decision] of Object.entries(mediaDecisions)) {
  if (decision.action !== 'preserve') continue;
  if (!isLocalAssetPath(path)) {
    errors.push(`Invalid preservation path ${path}`);
    continue;
  }
  const original = mediaAudit.find((row) => row.path === path);
  const bytes = await readFile(resolve('public', path.slice(1))).catch(() => undefined);
  if (
    !original ||
    decision.sha256 !== original.sha256 ||
    !bytes ||
    createHash('sha256').update(bytes).digest('hex') !== original.sha256
  )
    errors.push(`Preservation fingerprint mismatch ${path}`);
}
const archivalPaths = new Set();
for (const item of data.legacyWorkResources) {
  if (archivalPaths.has(item.path)) errors.push(`legacy work resource ${item.id}: duplicate path`);
  archivalPaths.add(item.path);
  if (
    !workIds.has(item.workId) ||
    !['cleared', 'review', 'restricted'].includes(item.rights) ||
    !item.permissionBasis
  )
    errors.push(`legacy work resource ${item.id}: invalid owner or permission record`);
  if (!isLocalAssetPath(item.path) || !item.path.startsWith('/images/') || !item.path.endsWith('.webp')) {
    errors.push(`legacy work resource ${item.id}: invalid image path`);
    continue;
  }
  const original = mediaAudit.find((row) => row.path === item.path);
  const decision = mediaDecisions[item.path];
  if (
    !original ||
    original.sha256 !== item.sha256 ||
    decision?.action !== 'preserve' ||
    decision.legacyWorkResourceId !== item.id ||
    decision.workId !== item.workId ||
    decision.sha256 !== item.sha256
  )
    errors.push(`legacy work resource ${item.id}: preservation record drift`);
  const bytes = await readFile(resolve('public', item.path.slice(1))).catch(() => undefined);
  if (!bytes || createHash('sha256').update(bytes).digest('hex') !== item.sha256)
    errors.push(`legacy work resource ${item.id}: original image missing or changed`);
}
for (const item of data.referenceDocuments) {
  const owners = item.owner.kind === 'cooperation' ? data.cooperationPages : data.studioPages;
  if (
    !['cooperation', 'studio'].includes(item.owner.kind) ||
    !owners.some((row) => row.id === item.owner.id) ||
    !['cleared', 'review', 'restricted'].includes(item.rights) ||
    (item.requiredEducationOverview && !data.educationOverview) ||
    item.requiredConfigurations.some((id) => !data.configurations.some((row) => row.id === id)) ||
    item.requiredPeople.some((id) => !data.people.some((row) => row.id === id)) ||
    (item.requiredWorks ?? []).some((id) => !data.works.some((row) => row.id === id)) ||
    (item.requiredCases ?? []).some((id) => !data.cases.some((row) => row.id === id))
  )
    errors.push(`reference document ${item.id}: invalid owner/dependencies/rights`);
  if (!isLocalAssetPath(item.href) || !item.href.startsWith('/documents/') || !item.href.endsWith('.pdf')) {
    errors.push(`reference document ${item.id}: invalid path`);
    continue;
  }
  if (
    !['technical-overview', 'cv', 'legal'].includes(item.kind) ||
    item.pages !== (item.kind === 'technical-overview' ? 2 : 1) ||
    !['en', 'ru'].includes(item.language) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(item.asOf) ||
    item.year !== Number(item.asOf.slice(0, 4))
  )
    errors.push(`reference document ${item.id}: invalid metadata`);
  if (item.kind === 'cv') {
    const person = data.people.find((row) => row.id === item.personId);
    if (
      item.owner.kind !== 'studio' ||
      !person?.cv ||
      item.requiredPeople.length !== 1 ||
      item.requiredPeople[0] !== item.personId ||
      JSON.stringify(item.requiredWorks) !== JSON.stringify(person?.cv?.workIds) ||
      JSON.stringify(item.requiredCases) !== JSON.stringify(person?.cv?.caseIds)
    )
      errors.push(`reference document ${item.id}: CV dependencies disagree with the person`);
  }
  const input = item.kind === 'cv' ? cvInput(data, item) : technicalOverviewInput(data, item.asOf);
  if (
    item.kind !== 'legal' &&
    createHash('sha256').update(JSON.stringify(input)).digest('hex') !== item.contentFingerprint
  )
    errors.push(`reference document ${item.id}: PDF is stale against current HTML facts`);
  const bytes = await readFile(resolve('public', item.href.slice(1))).catch(() => undefined);
  if (
    !bytes ||
    bytes.length !== item.bytes ||
    bytes.subarray(0, 5).toString() !== '%PDF-' ||
    createHash('sha256').update(bytes).digest('hex') !== item.sha256
  )
    errors.push(`reference document ${item.id}: prepared PDF missing or changed`);
}
for (const item of data.workDocuments) {
  if (!workIds.has(item.workId) || !['cleared', 'review', 'restricted'].includes(item.rights))
    errors.push(`work document ${item.id}: invalid work or rights`);
  if (!isLocalAssetPath(item.href) || !item.href.endsWith('.pdf')) {
    errors.push(`work document ${item.id}: invalid path`);
    continue;
  }
  if (
    !Number.isInteger(item.pages) ||
    item.pages < 1 ||
    (item.year !== null && !Number.isInteger(item.year)) ||
    !['en', 'ru'].includes(item.language)
  )
    errors.push(`work document ${item.id}: invalid metadata`);
  if (item.originalAccess && !['public', 'internal'].includes(item.originalAccess))
    errors.push(`work document ${item.id}: invalid original access`);
  if (
    item.selectedPages &&
    (!item.selectedPages.length ||
      new Set(item.selectedPages).size !== item.selectedPages.length ||
      item.selectedPages.some((page) => !Number.isInteger(page) || page < 1 || page > item.pages))
  )
    errors.push(`work document ${item.id}: invalid selected pages`);
  const original = mediaAudit.find((row) => row.path === item.href);
  const decision = mediaDecisions[item.href];
  if (
    original?.sha256 !== item.sha256 ||
    (item.originalAccess !== 'internal' &&
      (decision?.action !== 'preserve' ||
        decision.workDocumentId !== item.id ||
        decision.sha256 !== item.sha256))
  )
    errors.push(`work document ${item.id}: preservation record drift`);
  const bytes = await readFile(resolve('public', item.href.slice(1))).catch(() => undefined);
  if (
    !bytes ||
    bytes.length !== item.bytes ||
    bytes.subarray(0, 5).toString() !== '%PDF-' ||
    createHash('sha256').update(bytes).digest('hex') !== item.sha256
  )
    errors.push(`work document ${item.id}: original PDF missing or changed`);
}

for (const programme of data.programmes) {
  if (
    !['lecture', 'workshop', 'laboratory'].includes(programme.programmeType) ||
    !['documented', 'proposed'].includes(programme.deliveryStatus)
  )
    errors.push('Invalid educational type/stage ' + programme.id);
  if (
    !programme.topics.length ||
    !programme.conditions.length ||
    !programme.audience.ru ||
    !programme.audience.en ||
    !programme.authorsNote.ru ||
    !programme.authorsNote.en
  )
    errors.push('Incomplete programme ' + programme.id);
  for (const id of programme.works)
    if (!workIds.has(id)) errors.push('Programme references unknown work ' + id);
  for (const id of programme.cases)
    if (!caseIds.has(id)) errors.push('Programme references unknown case ' + id);
  for (const id of programme.media)
    if (!mediaIds.has(id)) errors.push('Programme references unknown media ' + id);
  for (const id of programme.authorIds ?? [])
    if (!data.people.some((row) => row.id === id)) errors.push('Programme references unknown author ' + id);
  if (new Set((programme.modules ?? []).map((row) => row.id)).size !== (programme.modules ?? []).length)
    errors.push('Programme module IDs repeat ' + programme.id);
}
for (const page of data.cooperationPages)
  for (const scenario of page.scenarios)
    for (const id of scenario.programmeIds)
      if (!programmeIds.has(id)) errors.push('Cooperation references unknown programme ' + id);

errors.push(...(await verifyPreparedMedia(data)));
try {
  const { catalogue } = await loadSiteModule('src/data/catalogue.ts');
  const { pages } = await loadSiteModule('src/lib/routes.ts');
  const coverage = verifySourceCoverage(migrationInventory, catalogue, pages);
  if (coverage) console.log(`Verified ${coverage.sourceIds} source dispositions against the public corpus.`);
} catch (error) {
  errors.push(error.message);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Verified ${data.works.length} works, ${data.configurations.length} configurations, ${data.programmes.length} programmes, ${data.cases.length} cases, ${data.media.length} media and relationships.`,
  );
