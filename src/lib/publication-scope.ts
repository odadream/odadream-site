import type { Publication, Work } from '../data/site';

export type CatalogueSource = Pick<
  typeof import('../data/site'),
  | 'works'
  | 'formats'
  | 'cases'
  | 'people'
  | 'organizations'
  | 'evidence'
  | 'media'
  | 'recognitions'
  | 'heroVisuals'
  | 'minddbSnapshot'
> &
  Partial<
    Pick<
      typeof import('../data/site'),
      | 'methods'
      | 'cooperationPages'
      | 'studioPages'
      | 'workDocuments'
      | 'legacyWorkResources'
      | 'referenceDocuments'
    >
  >;
export interface PublicationPlan {
  version: string;
  asOf: string;
  methods?: string[];
  cooperationPages?: string[];
  studioPages?: string[];
  works: string[];
  formats: string[];
  cases: string[];
  people: string[];
  recognitions: string[];
  heroVisuals: string[];
  minddb: boolean;
}

const ids = (rows: { id: string }[]) => new Set(rows.map((row) => row.id));
const pick = <T, K extends keyof T>(row: T, keys: readonly K[]): Pick<T, K> =>
  Object.fromEntries(keys.map((key) => [key, row[key]])) as Pick<T, K>;
const publicSource = (source: string) => (/^https?:\/\//i.test(source) ? source : '');
export const isLocalAssetPath = (path: string) =>
  /^\/(images|video|documents)\//.test(path) &&
  !/[\\%?#]/.test(path) &&
  path
    .slice(1)
    .split('/')
    .every((part) => part && part !== '.' && part !== '..');
const project = <T extends { source: string }, K extends keyof T>(row: T, keys: readonly K[]) => ({
  ...pick(row, keys),
  source: publicSource(row.source),
});

/** One explicit packet, independent of archive size. Preview is never a deployable packet. */
export function createPublicationScope(source: CatalogueSource, plan: PublicationPlan, preview = false) {
  const errors: string[] = [];
  const select = <T extends { id: string; publication?: Publication }>(
    name: keyof PublicationPlan,
    rows: T[],
  ) => {
    if (preview) return rows;
    const selected = ((plan[name] as string[] | undefined) ?? []).map((id) => {
      const row = rows.find((item) => item.id === id);
      if (!row) errors.push(`${name} ${id}: missing packet record`);
      else if (row.publication && row.publication !== 'published')
        errors.push(`${name} ${id}: ${row.publication}`);
      return row;
    });
    return selected.filter((row): row is T => !!row && (!row.publication || row.publication === 'published'));
  };
  let works = select('works', source.works);
  const workIds = ids(works);
  const workDocuments = (source.workDocuments ?? []).filter((row) => {
    if (!workIds.has(row.workId)) return false;
    if (!isLocalAssetPath(row.href) || !row.href.endsWith('.pdf')) {
      errors.push(`work document ${row.id}: invalid local PDF path`);
      return false;
    }
    if (!preview && row.rights !== 'cleared') {
      errors.push(`work document ${row.id}: rights ${row.rights}`);
      return false;
    }
    return true;
  });
  const formats = select('formats', source.formats).map((row) => ({
    ...row,
    works: row.works.filter((id) => workIds.has(id)),
  }));
  const methods = select('methods', source.methods ?? []).map((row) => ({
    ...row,
    works: row.works.filter((id) => workIds.has(id)),
  }));
  const methodIds = ids(methods);
  const cases = select('cases', source.cases).filter((row) => {
    if (row.work && workIds.has(row.work)) return true;
    if (row.method && methodIds.has(row.method)) return true;
    errors.push(
      `case ${row.id}: ${row.method ? 'method ' + row.method : 'work ' + row.work} is outside the published packet`,
    );
    return false;
  });
  const cooperationPages = select('cooperationPages', source.cooperationPages ?? []).map((row) => ({
    ...row,
    scenarios: row.scenarios.map((scenario) => ({
      ...scenario,
      formatIds: scenario.formatIds.filter((id) => formats.some((format) => format.id === id)),
    })),
  }));
  const people = select('people', source.people);
  const studioPages = select('studioPages', source.studioPages ?? []).filter((row) => {
    const missing = row.people.filter((id) => !people.some((person) => person.id === id));
    if (!missing.length) return true;
    errors.push(`studio ${row.id}: people ${missing.join(', ')} are outside the published packet`);
    return false;
  });
  const referenceDocuments = (source.referenceDocuments ?? []).filter((row) => {
    if (!['cooperation', 'studio'].includes(row.owner.kind)) {
      errors.push(`reference document ${row.id}: invalid owner kind`);
      return false;
    }
    const owners = row.owner.kind === 'cooperation' ? cooperationPages : studioPages;
    if (!owners.some((owner) => owner.id === row.owner.id)) return false;
    if (!isLocalAssetPath(row.href) || !row.href.startsWith('/documents/') || !row.href.endsWith('.pdf')) {
      errors.push(`reference document ${row.id}: invalid PDF path`);
      return false;
    }
    if (!preview && row.rights !== 'cleared') {
      errors.push(`reference document ${row.id}: rights ${row.rights}`);
      return false;
    }
    if (
      row.requiredFormats.some((id) => !formats.some((format) => format.id === id)) ||
      row.requiredPeople.some((id) => !people.some((person) => person.id === id)) ||
      (row.requiredWorks ?? []).some((id) => !workIds.has(id)) ||
      (row.requiredCases ?? []).some((id) => !cases.some((item) => item.id === id))
    )
      return false;
    return true;
  });
  const recognitions = select('recognitions', source.recognitions)
    .filter((row) => {
      if (preview || row.documentRights === 'cleared') return true;
      errors.push(`recognition ${row.id}: document rights ${row.documentRights}`);
      return false;
    })
    .map((row) => ({
      ...row,
      relatedWorks: row.relatedWorks.filter((id) => workIds.has(id)),
      contextPath:
        preview ||
        (row.contextPath?.startsWith('studio/')
          ? studioPages.length > 0
          : cases.some((item) => row.contextPath === `cases/#case-${item.slug}`))
          ? row.contextPath
          : undefined,
    }));
  const caseIds = ids(cases);
  const heroVisuals = select('heroVisuals', source.heroVisuals).filter((row) => {
    if (row.target.kind === 'unmapped') {
      if (!preview) errors.push(`hero ${row.id}: target is unmapped`);
      return preview;
    }
    if (row.target.kind === 'method') {
      if (methodIds.has(row.target.methodId)) return true;
      if (!preview) errors.push(`hero ${row.id}: method is outside the public packet`);
      return false;
    }
    const target = row.target;
    const work = works.find((item) => item.id === target.workId);
    if (!work || work.stage !== 'realized' || (target.caseId && !caseIds.has(target.caseId))) {
      if (!preview) errors.push(`hero ${row.id}: target is outside the realized public packet`);
      return false;
    }
    return true;
  });
  const mediaIds = new Set([
    ...methods.flatMap((row) => row.media),
    ...works.flatMap((row) => row.media),
    ...cases.flatMap((row) => row.media),
    ...heroVisuals.map((row) => row.mediaId),
  ]);
  const media = preview
    ? source.media
    : [...mediaIds].flatMap((id) => {
        const row = source.media.find((item) => item.id === id);
        if (!row) {
          errors.push(`media ${id}: missing dependency`);
          return [];
        }
        if (row.rights !== 'cleared') {
          errors.push(`media ${id}: rights ${row.rights}`);
          return [];
        }
        if (row.kind === 'video' && !row.poster) errors.push(`media ${id}: video poster missing`);
        return [row];
      });
  const availableMedia = ids(media);
  const evidenceIds = new Set(cases.flatMap((row) => row.evidence));
  const evidence = preview
    ? source.evidence
    : [...evidenceIds].flatMap((id) => {
        const row = source.evidence.find((item) => item.id === id);
        if (!row) {
          errors.push(`evidence ${id}: missing dependency`);
          return [];
        }
        if (row.permission !== 'cleared') {
          errors.push(`evidence ${id}: permission ${row.permission}`);
          return [];
        }
        return [row];
      });
  const evidenceAvailable = ids(evidence);
  const organizationIds = new Set(cases.flatMap((row) => row.organizations));
  const organizations = preview
    ? source.organizations
    : [...organizationIds].flatMap((id) => {
        const row = source.organizations.find((item) => item.id === id);
        if (!row) {
          errors.push(`organization ${id}: missing dependency`);
          return [];
        }
        return [row];
      });
  const formatIds = ids(formats);
  works = works.map((row) => ({
    ...row,
    basedOn: row.basedOn.filter((id) => workIds.has(id)),
    relatedWorks: row.relatedWorks.filter((id) => workIds.has(id)),
    cases: row.cases.filter((id) => caseIds.has(id)),
    formats: row.formats.filter((id) => formatIds.has(id)),
    media: row.media.filter((id) => availableMedia.has(id)),
  }));
  const safeCases = cases.map((row) => ({
    ...row,
    evidence: row.evidence.filter((id) => evidenceAvailable.has(id)),
    media: row.media.filter((id) => availableMedia.has(id)),
  }));
  let minddbSnapshot = preview ? source.minddbSnapshot : undefined;
  if (!preview && plan.minddb) {
    if (
      source.minddbSnapshot.publication !== 'published' ||
      source.minddbSnapshot.privacyReview !== 'published'
    )
      errors.push('MindDB: publication or privacy review unresolved');
    else minddbSnapshot = source.minddbSnapshot;
  }
  const projected = preview
    ? {
        methods,
        cooperationPages,
        studioPages,
        works,
        workDocuments,
        referenceDocuments,
        formats,
        cases: safeCases,
        people,
        recognitions,
        media,
        evidence,
        organizations,
        minddbSnapshot,
      }
    : {
        referenceDocuments: referenceDocuments.map((row) => ({
          ...project(row, [
            'id',
            'kind',
            'personId',
            'title',
            'description',
            'href',
            'year',
            'language',
            'pages',
            'bytes',
            'asOf',
          ]),
          owner: { kind: row.owner.kind, id: row.owner.id },
        })),
        workDocuments: workDocuments.map((row) =>
          project(row, [
            'id',
            'legacyId',
            'workId',
            'title',
            'description',
            'href',
            'year',
            'language',
            'pages',
            'bytes',
          ]),
        ),
        studioPages: studioPages.map((row) =>
          project(row, [
            'id',
            'title',
            'summary',
            'people',
            'sections',
            'teaching',
            'materials',
            'publication',
          ]),
        ),
        methods: methods.map((row) =>
          project(row, [
            'id',
            'legacyId',
            'title',
            'summary',
            'sections',
            'steps',
            'participation',
            'limitations',
            'works',
            'media',
            'publication',
          ]),
        ),
        cooperationPages: cooperationPages.map((row) =>
          project(row, [
            'id',
            'legacyId',
            'title',
            'summary',
            'scenarios',
            'modes',
            'process',
            'studioProvides',
            'venueProvides',
            'briefFields',
            'publication',
          ]),
        ),
        works: works.map((row) =>
          project(row, [
            'id',
            'legacyId',
            'slug',
            'title',
            'category',
            'summary',
            'experience',
            'question',
            'story',
            'credits',
            'reviewNotes',
            'relatedWorks',
            'stage',
            'workType',
            'aliases',
            'basedOn',
            'components',
            'year',
            'edition',
            'featuredOnHome',
            'inRepertoire',
            'bookable',
            'rnd',
            'availability',
            'facts',
            'media',
            'cases',
            'formats',
            'publication',
          ]),
        ),
        formats: formats.map((row) =>
          project(row, [
            'id',
            'legacyId',
            'slug',
            'title',
            'summary',
            'scope',
            'works',
            'publication',
            'story',
            'participation',
            'outcome',
            'conditions',
            'studioProvides',
            'venueProvides',
            'topics',
            'reviewNotes',
          ]),
        ),
        cases: safeCases.map((row) =>
          project(row, [
            'id',
            'legacyId',
            'slug',
            'title',
            'summary',
            'date',
            'datePrecision',
            'detailPage',
            'featuredOnHome',
            'type',
            'place',
            'role',
            'work',
            'method',
            'story',
            'organizationRoles',
            'participants',
            'limitations',
            'organizations',
            'evidence',
            'media',
            'publication',
          ]),
        ),
        people: people.map((row) => ({
          ...project(row, ['id', 'legacyId', 'name', 'role', 'biography', 'publication']),
          ...(row.cv
            ? {
                cv: {
                  sections: row.cv.sections.map((section) => pick(section, ['id', 'title', 'body'])),
                  base: row.cv.base,
                  workIds: row.cv.workIds.filter((id) => workIds.has(id)),
                  caseIds: row.cv.caseIds.filter((id) => cases.some((item) => item.id === id)),
                },
              }
            : {}),
        })),
        recognitions: recognitions.map((row) => ({
          ...project(row, [
            'id',
            'legacyId',
            'kind',
            'title',
            'issuer',
            'year',
            'featuredOnHome',
            'previewSrc',
            'publication',
            'documentRights',
            'claim',
            'recipient',
            'limitations',
            'documentState',
            'relatedWorks',
            'contextPath',
          ]),
          documentSource:
            /^(?:\/images\/|\/documents\/)/.test(row.documentSource) &&
            !row.documentSource.includes('..') &&
            !row.documentSource.includes('\\')
              ? row.documentSource
              : publicSource(row.documentSource),
        })),
        media: media.map((row) =>
          project(row, [
            'id',
            'legacyId',
            'src',
            'mobileSrc',
            'width',
            'height',
            'poster',
            'previewSrc',
            'alt',
            'caption',
            'rights',
            'kind',
            'representation',
          ]),
        ),
        evidence: evidence.map((row) =>
          project(row, ['id', 'legacyId', 'kind', 'title', 'permission', 'claim', 'sourceLabel']),
        ),
        organizations: organizations.map((row) => project(row, ['id', 'legacyId', 'name', 'role'])),
        minddbSnapshot: minddbSnapshot
          ? project(minddbSnapshot, [
              'asOf',
              'sessionCount',
              'takeCount',
              'videoDurationFileCount',
              'videoDurationHours',
              'rhythmDistribution',
              'publication',
              'privacyReview',
              'rhythmNote',
            ])
          : undefined,
      };
  const assetPaths = new Set(['/CNAME', '/robots.txt', '/brand/oda-logo.svg', '/brand/oda-brain.svg']);
  for (const row of projected.workDocuments) assetPaths.add(row.href);
  for (const row of projected.referenceDocuments) assetPaths.add(row.href);
  for (const row of projected.media)
    for (const path of [row.src, row.mobileSrc, row.poster, row.previewSrc])
      if (path?.startsWith('/')) assetPaths.add(path);
  for (const row of projected.recognitions)
    for (const path of [row.previewSrc, row.documentState === 'available' ? row.documentSource : undefined])
      if (path?.startsWith('/')) assetPaths.add(path);
  // Use the already permission-checked dependency set; aliases never publish a deferred work.
  for (const row of media)
    for (const path of row.legacyPaths ?? []) {
      if (isLocalAssetPath(path)) assetPaths.add(path);
      else errors.push(`media ${row.id}: invalid legacy asset path ${path}`);
    }
  // Different archival frames are resources of their Work, not aliases of its cover image.
  for (const row of source.legacyWorkResources ?? []) {
    if (!workIds.has(row.workId)) continue;
    if (!isLocalAssetPath(row.path) || !row.path.startsWith('/images/') || !row.path.endsWith('.webp')) {
      errors.push(`legacy work resource ${row.id}: invalid image path`);
      continue;
    }
    if (!preview && row.rights !== 'cleared') {
      errors.push(`legacy work resource ${row.id}: rights ${row.rights}`);
      continue;
    }
    assetPaths.add(row.path);
  }
  return {
    ...projected,
    preview,
    errors,
    heroVisuals: heroVisuals
      .filter((row) => availableMedia.has(row.mediaId))
      .map((row) => ({ id: row.id, mediaId: row.mediaId, target: row.target })),
    assetPaths,
  };
}

export const isRealizedWork = (work: Pick<Work, 'stage'>) => work.stage === 'realized';
