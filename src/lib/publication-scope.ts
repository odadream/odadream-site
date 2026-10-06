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
  Partial<Pick<typeof import('../data/site'), 'methods' | 'cooperationPages'>>;
export interface PublicationPlan {
  version: string;
  asOf: string;
  methods?: string[];
  cooperationPages?: string[];
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
  const formats = select('formats', source.formats).map((row) => ({
    ...row,
    works: row.works.filter((id) => workIds.has(id)),
  }));
  const cases = select('cases', source.cases).filter((row) => {
    if (workIds.has(row.work)) return true;
    errors.push(`case ${row.id}: work ${row.work} is outside the published packet`);
    return false;
  });
  const methods = select('methods', source.methods ?? []).map((row) => ({
    ...row,
    works: row.works.filter((id) => workIds.has(id)),
  }));
  const methodIds = ids(methods);
  const cooperationPages = select('cooperationPages', source.cooperationPages ?? []).map((row) => ({
    ...row,
    scenarios: row.scenarios.map((scenario) => ({
      ...scenario,
      formatIds: scenario.formatIds.filter((id) => formats.some((format) => format.id === id)),
    })),
  }));
  const people = select('people', source.people);
  const recognitions = select('recognitions', source.recognitions).filter((row) => {
    if (preview || row.documentRights === 'cleared') return true;
    errors.push(`recognition ${row.id}: document rights ${row.documentRights}`);
    return false;
  });
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
        works,
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
            'type',
            'place',
            'role',
            'work',
            'organizations',
            'evidence',
            'media',
            'publication',
          ]),
        ),
        people: people.map((row) => project(row, ['id', 'legacyId', 'name', 'role', 'publication'])),
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
          ]),
          documentSource: publicSource(row.documentSource),
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
        evidence: evidence.map((row) => project(row, ['id', 'legacyId', 'kind', 'title', 'permission'])),
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
  for (const row of projected.media)
    for (const path of [row.src, row.mobileSrc, row.poster, row.previewSrc])
      if (path?.startsWith('/')) assetPaths.add(path);
  for (const row of projected.recognitions)
    if (row.previewSrc?.startsWith('/')) assetPaths.add(row.previewSrc);
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

export const isRealizedWork = (work: Work) => work.stage === 'realized';
