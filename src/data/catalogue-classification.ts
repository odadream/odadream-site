import type { CaseEvent, Localized, Work } from './site';
import type { Programme } from './programmes';

// Owner corrections, 2026-10-16. Archive records retain their IDs and provenance;
// this is the single canonical classification boundary, before publication/counting.
export const educationalWorkIds = ['theatre-my-name', 'brain-hack', 'journey'];
const l = (ru: string, en: string): Localized => ({ ru, en });
const unique = (items: string[]) => [...new Set(items)];

export function classifyCatalogue(workRecords: Work[], programmeRecords: Programme[], events: CaseEvent[]) {
  const moved = workRecords.filter((row) => educationalWorkIds.includes(row.id));
  const gong = programmeRecords.find((row) => row.id === 'gong');
  if (!gong || moved.length !== educationalWorkIds.length) throw Error('Classification source missing');
  const cases: CaseEvent[] = events.map((row) => ({
    ...row,
    detailPage: true,
    sourceUrl: row.source.startsWith('https://') ? row.source : undefined,
    workSelections:
      row.id === 'portal-2024'
        ? [{ workId: 'mindshow', media: ['archive-portal-2024-mindshow-portal'] }]
        : row.workSelections,
    work:
      row.work && educationalWorkIds.includes(row.work)
        ? undefined
        : row.programme === 'gong'
          ? 'gong'
          : row.work,
    programme:
      row.work && educationalWorkIds.includes(row.work)
        ? row.work
        : row.programme === 'gong'
          ? undefined
          : row.programme,
    relatedWorks: unique([
      ...(row.relatedWorks ?? []).filter((id) => !educationalWorkIds.includes(id)),
      ...(row.relatedProgrammes?.includes('gong') ? ['gong'] : []),
    ]),
    relatedProgrammes: unique([
      ...(row.relatedProgrammes ?? []).filter((id) => id !== 'gong'),
      ...(row.relatedWorks ?? []).filter((id) => educationalWorkIds.includes(id)),
    ]),
  }));
  const programmes: Programme[] = [
    ...programmeRecords.filter((row) => row.id !== 'gong'),
    ...moved.map((row): Programme => ({
      id: row.id,
      legacyId: row.legacyId,
      slug: row.slug,
      title: row.title,
      programmeType: 'workshop',
      deliveryStatus: row.stage === 'realized' ? 'documented' : 'proposed',
      summary:
        row.id === 'journey'
          ? l(
              'Практикум о дыхании, внимании и внутреннем темпе. Архивный сценарий исследует взаимодействие с виртуальной средой.',
              'A workshop about breathing, attention and internal pace. The archived scenario explores interaction with a virtual environment.',
            )
          : row.summary,
      story: row.experience,
      participation: row.experience,
      outcome:
        row.id === 'theatre-my-name'
          ? l(
              'Совместный танец, обратная связь и личная интерпретация опыта.',
              'Collective dance, feedback and personal interpretation of the experience.',
            )
          : l(
              'Наблюдение за собственным восприятием и обсуждение опыта. Сценарий сохраняется в проектной стадии.',
              'Observation of one’s own perception and discussion of the experience. The scenario remains at the proposal stage.',
            ),
      scope: l(
        'Состав группы, длительность и условия участия обсуждаются для конкретной встречи.',
        'Group size, duration and participation arrangements are discussed for each encounter.',
      ),
      audience: l(
        'Аудитория определяется при подготовке практикума.',
        'The audience is defined when preparing the workshop.',
      ),
      authorsNote: l(
        row.credits.map((credit) => `${credit.name.ru} — ${credit.role.ru}`).join('; '),
        row.credits.map((credit) => `${credit.name.en} — ${credit.role.en}`).join('; '),
      ),
      modules: [
        ...row.story,
        {
          id: 'archive-context',
          title: l('Архивный контекст', 'Archived context'),
          body: l(row.facts.ru.join('\n\n'), row.facts.en.join('\n\n')),
        },
      ],
      conditions: [
        {
          id: 'session',
          label: l('Условия встречи', 'Session arrangements'),
          value: l(
            'Длительность, площадку, ведущих и оборудование согласуем отдельно.',
            'Duration, venue, facilitators and equipment are agreed individually.',
          ),
          state: 'per-brief',
        },
      ],
      studioProvides: {
        ru: ['Состав участия студии согласуется при подготовке встречи.'],
        en: ['The studio’s contribution is agreed when preparing the encounter.'],
      },
      venueProvides: {
        ru: ['Требования к площадке согласуются для выбранного сценария.'],
        en: ['Venue requirements are agreed for the chosen scenario.'],
      },
      topics: [row.question],
      reviewNotes: row.reviewNotes,
      sourceRefs: row.sourceRefs,
      media: row.media,
      cases: row.cases,
      works: row.relatedWorks.filter((id) => !educationalWorkIds.includes(id)),
      source: `${row.source}; owner classification 2026-10-16`,
      publication: row.publication,
    })),
  ].map((row) => ({
    ...row,
    works: row.works.filter((id) => !educationalWorkIds.includes(id)),
    cases: unique([
      ...row.cases,
      ...cases
        .filter((event) => event.programme === row.id || event.relatedProgrammes?.includes(row.id))
        .map((event) => event.id),
    ]),
  }));
  const gongWork: Work = {
    id: 'gong',
    legacyId: gong.legacyId!,
    slug: 'neuro-gong-theatre',
    title: l('Нейро-гонг-театр', 'Neuro Gong Theatre'),
    category: l('Перформанс', 'Performance'),
    summary: l(
      'Перформанс ODA.dream с Николаем Льговским: живой звук и нейровизуальная среда.',
      'A performance by ODA.dream with Nikolay Lgovsky: live sound and a neurovisual environment.',
    ),
    experience: gong.summary,
    question: l(
      'Как живой звук и нейровизуальная среда встречаются в перформансе?',
      'How do live sound and a neurovisual environment meet in a performance?',
    ),
    stage: 'realized',
    workType: 'performance',
    aliases: ['Гонг Театр', 'Gong Theatre'],
    basedOn: [],
    year: null,
    featuredOnHome: false,
    inRepertoire: false,
    bookable: false,
    rnd: false,
    availability: l(
      'Условия показа обсуждаются со студией.',
      'Presentation arrangements are discussed with the studio.',
    ),
    facts: {
      ru: ['Совместная работа ODA.dream и Николая Льговского'],
      en: ['A collaboration between ODA.dream and Nikolay Lgovsky'],
    },
    story: [
      {
        id: 'performance',
        title: l('Звук и нейровизуальная среда', 'Sound and neurovisual environment'),
        body: gong.story,
      },
    ],
    credits: [
      { name: l('ODA.dream', 'ODA.dream'), role: l('Участие в перформансе', 'Performance contribution') },
      {
        name: l('Николай Льговский', 'Nikolay Lgovsky'),
        role: l('Участие в перформансе', 'Performance contribution'),
      },
    ],
    relatedWorks: ['neuromandala'],
    reviewNotes: [
      l(
        'Звуковая и нейровизуальная среда — художественный материал; она не предназначена для диагностики или обещания определённого состояния.',
        'The sound and neurovisual environment is artistic material; it is not intended for diagnosis or to promise a particular state.',
      ),
    ],
    media: gong.media,
    mediaNote: l(
      'Фото и видео перформанса пока не добавлены.',
      'Photographs and video of the performance have not yet been added.',
    ),
    cases: gong.cases,
    configurations: [],
    source: `${gong.source}; owner confirmation of performance and collaborator 2026-10-16`,
    sourceRefs: gong.sourceRefs,
    publication: gong.publication,
  };
  const works = [...workRecords.filter((row) => !educationalWorkIds.includes(row.id)), gongWork].map(
    (row) => ({
      ...row,
      relatedWorks: row.relatedWorks.filter((id) => !educationalWorkIds.includes(id)),
      media:
        row.id === 'neuromandala'
          ? unique([...row.media, 'neurosync-session'])
          : row.media.filter((id) => id !== 'neurosync-session'),
      relatedProgrammes: educationalWorkIds.filter(
        (id) =>
          row.relatedWorks.includes(id) ||
          programmes.some((programme) => programme.id === id && programme.works.includes(row.id)),
      ),
      cases: unique([
        ...row.cases,
        ...cases
          .filter((event) => event.work === row.id || event.relatedWorks?.includes(row.id))
          .map((event) => event.id),
      ]),
    }),
  );
  return { works, programmes, cases };
}
