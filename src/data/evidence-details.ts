import type { Localized } from './site';
import type { SourceReference } from './editorial';
import { sourceSnapshots } from './editorial';
export interface EvidenceDetail {
  claim: Localized;
  sourceLabel: Localized;
  sourceRefs: SourceReference[];
}
export interface RecognitionDetail {
  claim: Localized;
  recipient: Localized;
  limitations: Localized;
  relatedWorks: string[];
  contextPath?: string;
  documentState: 'available' | 'missing';
  documentSha256?: string;
  sourceRefs: SourceReference[];
}
const l = (ru: string, en: string): Localized => ({ ru, en });
const refs = (...files: string[]) => files.map((file) => sourceSnapshots[file]);
const record = (file: string, ru: string, en: string): EvidenceDetail => ({
  claim: l(ru, en),
  sourceLabel: l('Архивная запись студии о событии', 'Studio event archive record'),
  sourceRefs: refs(file),
});
export const evidenceDetails: Record<string, EvidenceDetail> = {
  'tsiolkovsky-2026-record': record(
    'event-tsiolkovsky-2026.md',
    'Премьера «Интерференции реальностей» 16 мая 2026 года в Калуге, совместная постановка с ИТБ и технологическое участие Neiry.',
    'The Interference of Realities premiere on 16 May 2026 in Kaluga, co-production with Innovation Ballet Theatre and Neiry’s technology contribution.',
  ),
  'tsiolkovsky-2025-record': record(
    'event-tsiolkovsky-2025.md',
    'Закрывающая лаборатория «Проект Шрёдингер» на фестивале Циолковского 22 мая 2025 года.',
    'Project Schrödinger as the closing laboratory at the Tsiolkovsky festival on 22 May 2025.',
  ),
  'dano-2025-record': record(
    'event-dano-ekoniva-2025.md',
    'Участие игры на DANO 17 декабря 2025 года; «ЭкоНива» — заказчик, ВШЭ и Т-Банк — организаторы.',
    'The game’s DANO contribution on 17 December 2025; EkoNiva as client, HSE and T-Bank as organisers.',
  ),
  'byob-2026-record': record(
    'event-byob-2026.md',
    'Приглашённый показ MindShow на BYOB в Москве 28 февраля 2026 года.',
    'An invited MindShow presentation at BYOB in Moscow on 28 February 2026.',
  ),
};
export const recognitionDetails: Record<string, RecognitionDetail> = {
  'digital-art-ai-2026': {
    documentSha256: '0bcc494f9036c0834768d94b06d7445e4ddf84931a193e255495239aca2e3de4',
    claim: l(
      'Диплом за участие творческого дуэта ODA.dream в панельной дискуссии о цифровом искусстве, ИИ и авторском праве на VI выставке-форуме «Уникальная Россия».',
      'A diploma recognising the ODA.dream duo’s participation in a panel on digital art, AI and copyright at the sixth Unique Russia exhibition-forum.',
    ),
    recipient: l('Творческий дуэт ODA.dream', 'ODA.dream creative duo'),
    limitations: l(
      'Документ подтверждает участие в панели, а не победу в конкурсе. На документе указан период форума 23 января — 8 февраля 2026 года; отдельный день выступления не установлен.',
      'The document recognises panel participation, not a competition win. It gives the forum period as 23 January–8 February 2026; the separate presentation day is unconfirmed.',
    ),
    relatedWorks: [],
    documentState: 'available',
    sourceRefs: refs('hub-letters.md'),
  },
  'mipt-letter-2025': {
    claim: l(
      'В архиве отмечено благодарственное письмо МФТИ за участие ODA.dream в выставке «Терраформинг» в декабре 2025 года.',
      'The archive lists a MIPT letter recognising ODA.dream’s participation in the Terraforming exhibition in December 2025.',
    ),
    recipient: l('ODA.dream', 'ODA.dream'),
    contextPath: 'studio/#teaching-mipt',
    limitations: l(
      'Скан не найден. Формулировка и дата письма не сверены с оригиналом; запись не заменяет документ.',
      'The scan is missing. Wording and the letter date have not been checked against the original; this record does not replace the document.',
    ),
    relatedWorks: [],
    documentState: 'missing',
    sourceRefs: refs('proof-mipt-letter.md', 'hub-letters.md'),
  },
  'portal-2030-2025': {
    documentSha256: '92b1516d2e131b1dfce9ecd2c79a4982cb2c70fc081b2485338c44f4a531cb19',
    claim: l(
      'Наградное изображение фиксирует первое место ODA.dream в конкурсе медиаарта «Виджеинг» Портала 2030–2050.',
      'The award image records ODA.dream’s first prize in Portal 2030–2050’s VJ media-art contest.',
    ),
    recipient: l('ODA.dream', 'ODA.dream'),
    contextPath: 'cases/#case-portal-2025',
    limitations: l(
      'Это наградной документ, а не диплом участия. Год взят из архивной записи; точный день и площадка события уточняются отдельно.',
      'This is an award document, not a participation certificate. The year comes from the archive record; the exact day and event venue need separate clarification.',
    ),
    relatedWorks: ['mindshow'],
    documentState: 'available',
    sourceRefs: refs('hub-letters.md', 'proof-award-portal-visioning.md', 'event-portal-2025.md'),
  },
  'tavrida-letter-2025': {
    documentSha256: 'da56156c4bcc5e554e6a6fd6c25be87a92d1b33db673cf1706c935a50172488e',
    claim: l(
      'Письмо адресовано Ольге и Далеру Арабовым за участие в первом фестивале искусственного интеллекта «Культурный код России» на «Таврида.АРТ».',
      'The letter is addressed to Olga and Daler Arabov for participation in the first Cultural Code of Russia AI festival at Tavrida.ART.',
    ),
    recipient: l('Ольга и Далер Арабовы', 'Olga and Daler Arabov'),
    limitations: l(
      'Письмо благодарит участников фестиваля; оно не устанавливает очный показ работы, награду или результат отдельной заявки. Год — по архиву, отдельная дата не указана.',
      'The letter thanks festival participants; it does not establish an in-person presentation, an award or a particular application result. The year follows the archive; no separate date is printed.',
    ),
    relatedWorks: [],
    documentState: 'available',
    sourceRefs: refs('proof-let-tavrida.md', 'hub-letters.md'),
  },
  'hse-letter-2025': {
    documentSha256: '7bd7c1f9ee42e40be7cff3a4f1d1c7f1837fa09c0b3d1350eac09d4d033d8cc9',
    claim: l(
      'Институт развития креативных индустрий НИУ ВШЭ благодарит дуэт за иммерсивную лекцию «Красиво про мозг» для студентов.',
      'HSE University’s Institute for Creative Industries Development thanks the duo for the immersive Beautiful About the Brain lecture for students.',
    ),
    recipient: l('Ольга и Далер Арабовы', 'Olga and Daler Arabov'),
    contextPath: 'studio/#teaching-hse',
    limitations: l(
      'Документ относится к конкретной лекции. Он не подтверждает постоянную преподавательскую должность; год и месяц сохранены по архиву.',
      'The document concerns a specific lecture. It does not establish a permanent teaching position; the year and month are retained from the archive.',
    ),
    relatedWorks: [],
    documentState: 'available',
    sourceRefs: refs('proof-let-hse-beautiful-brain.md', 'hub-letters.md'),
  },
};
