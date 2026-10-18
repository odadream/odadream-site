import type { Localized } from './site';
export type EventGenre =
  | 'festival'
  | 'conference'
  | 'forum'
  | 'exhibition'
  | 'school'
  | 'retreat'
  | 'competition'
  | 'lecture'
  | 'laboratory'
  | 'programme'
  | 'meeting'
  | 'unknown';
export interface EventContext {
  /** One edition/occasion, shared by all contributions to that event. */
  id: string;
  title: Localized;
  genre: EventGenre;
  city?: Localized;
  venue?: Localized;
}
const l = (ru: string, en: string): Localized => ({ ru, en });
const event = (
  id: string,
  genre: EventGenre,
  ru: string,
  en: string,
  city?: Localized,
  venue?: Localized,
): EventContext => ({ id, genre, title: l(ru, en), city, venue });
const moscow = l('Москва', 'Moscow');
const kaluga = l('Калуга', 'Kaluga');
const ikc = l('Инновационный культурный центр', 'Innovation Cultural Centre');
const ashram = l('Студия Ashram', 'Ashram Studio');
// Names and locations are drawn from the sourceRefs of each CaseEvent.
// Missing venue/city stays absent; contribution type is a separate field.
export const eventContexts: Record<string, EventContext> = {
  'rukami-2020': event(
    'rukami-2020',
    'festival',
    'Онлайн-фестиваль Rukami',
    'Rukami online festival',
    l('Великий Новгород', 'Veliky Novgorod'),
  ),
  'national-business-awards-2025': event(
    'national-business-awards-2025',
    'meeting',
    'Национальная бизнес-премия «Технологии и инновации»',
    'Technology and Innovation National Business Awards',
  ),
  'tsiolkovsky-2026': event(
    'tsiolkovsky-2026',
    'festival',
    'Фестиваль Циолковского',
    'Tsiolkovsky Festival',
    kaluga,
    ikc,
  ),
  'tsiolkovsky-2025': event(
    'tsiolkovsky-2025',
    'festival',
    'Фестиваль Циолковского',
    'Tsiolkovsky Festival',
    kaluga,
    ikc,
  ),
  'dano-2025': event('dano-2025', 'competition', 'Олимпиада DANO', 'DANO Olympiad', moscow),
  'byob-2026': event(
    'byob-2026',
    'festival',
    'Проекционный фестиваль BYOB — Bring Your Own Beamer',
    'BYOB projection festival — Bring Your Own Beamer',
    moscow,
  ),
  'byob-2019': event(
    'byob-2019',
    'festival',
    'Проекционный фестиваль BYOB Moscow — Bring Your Own Beamer',
    'BYOB Moscow projection festival — Bring Your Own Beamer',
    moscow,
  ),
  'byob-2020': event(
    'byob-2020',
    'festival',
    'Проекционный фестиваль BYOB Moscow — Bring Your Own Beamer',
    'BYOB Moscow projection festival — Bring Your Own Beamer',
    moscow,
  ),
  'oktava-2021': event(
    'oktava-2021',
    'lecture',
    'Лекция и демонстрация нейросинхронизации',
    'Lecture and neurosynchronization demonstration',
    l('Тула', 'Tula'),
    l('Творческий кластер «Октава»', 'Oktava creative cluster'),
  ),
  'portal-2025': event(
    'portal-2025',
    'competition',
    'Конкурс медиаарта «Портал 2030–2050»',
    'Portal 2030–2050 media-art competition',
    moscow,
  ),
  'portal-2024': event(
    'portal-2024',
    'programme',
    'Портал 2030–2050',
    'Portal 2030–2050',
    l('Сколково', 'Skolkovo'),
    l('Гиперкуб', 'Hypercube'),
  ),
  'wildmint-2025': event('wildmint-2025', 'festival', 'Фестиваль «Дикая Мята»', 'Wild Mint Festival'),
  'cipr-2026': event(
    'cipr-2026',
    'forum',
    'TechFriendly / ЦИПР',
    'TechFriendly / CIPR',
    l('Нижний Новгород', 'Nizhny Novgorod'),
  ),
  'frequencies-2025': event(
    'frequencies-2025',
    'exhibition',
    '«Комиссия по трёхтысячному году» · Частоты 6.0',
    'Commission for the Year Three Thousand · Frequencies 6.0',
    moscow,
    l('Галерея на Песчаной', 'Gallery on Peschanaya'),
  ),
  'wind-of-change-2024': event(
    'wind-of-change-2024',
    'meeting',
    'Благотворительное событие «Ветер перемен»',
    'Wind of Change charity event',
  ),
  'synergy-bali-2022': event(
    'synergy-bali-2022',
    'forum',
    'Synergy Crypto & NFT Forum',
    'Synergy Crypto & NFT Forum',
    l('Бали', 'Bali'),
  ),
  'meditation-day-2026': event(
    'meditation-day-2026',
    'programme',
    'III Международный день медитации',
    '3rd International Meditation Day',
  ),
  'ashram-birthday-2024': event(
    'ashram-birthday-2024',
    'meeting',
    'День рождения студии Ashram',
    'Ashram Studio anniversary',
    moscow,
    ashram,
  ),
  'ashram-tim': event(
    'ashram-tim',
    'programme',
    'Практики в студии Ashram',
    'Practices at Ashram Studio',
    moscow,
    ashram,
  ),
  'audi-application-2020': event(
    'audi-born-digital-2020',
    'competition',
    'Audi Born Digital',
    'Audi Born Digital',
    moscow,
    l('Audi City Moscow', 'Audi City Moscow'),
  ),
  'bauman-2025': event(
    'bauman-2025',
    'lecture',
    'Лекционная программа «Москва 2030»',
    'Moscow 2030 lecture programme',
    moscow,
    l('МГТУ им. Баумана', 'Bauman MSTU'),
  ),
  'gonchar-2024': event(
    'gonchar-2024',
    'meeting',
    'Частное событие · Ната Гончар',
    'Private event · Nata Gonchar',
    moscow,
  ),
  'gong-fest-2024': event(
    'gong-fest-2024',
    'festival',
    'Гонг Фест',
    'Gong Fest',
    l('Сергиев Посад', 'Sergiev Posad'),
  ),
  'gong-fest-2025': event(
    'gong-fest-2025',
    'festival',
    'Гонг Фест',
    'Gong Fest',
    l('Сергиев Посад', 'Sergiev Posad'),
    l('Этнопарк «Кочевник»', 'Kochevnik ethnopark'),
  ),
  'hse-2025': event(
    'hse-2025',
    'lecture',
    'Лекция «Красиво про мозг»',
    'Beautiful About the Brain lecture',
    moscow,
    l('НИУ ВШЭ', 'HSE University'),
  ),
  'itb-lab-2024': event(
    'itb-lab-2024',
    'laboratory',
    'Лаборатория нейроинтерфейсов в танце',
    'Neurointerfaces in Dance laboratory',
    kaluga,
    ikc,
  ),
  'kod-provincii-2024': event(
    'kod-provincii-2024',
    'conference',
    'Научная хореографическая конференция «КОД:Провинции»',
    'CODE:Province scientific choreography conference',
    l('Калужская область', 'Kaluga region'),
  ),
  'korablik-2020': event(
    'korablik-2020',
    'retreat',
    'Ретрит «Кораблик»',
    'Korablik retreat',
    l('Подмосковье', 'Moscow region'),
  ),
  'lamborghini-tea': event(
    'lamborghini-tea',
    'meeting',
    'Lamborghini Edition · нейродегустация чая',
    'Lamborghini Edition · neuro-tea tasting',
  ),
  'merck-2025': event(
    'merck-2025',
    'lecture',
    'Science-art лекция для Merck',
    'Science-art lecture for Merck',
    moscow,
  ),
  'mipt-2025': event(
    'mipt-2025',
    'exhibition',
    'Выставка «Терраформинг»',
    'Terraforming exhibition',
    undefined,
    l('МФТИ', 'MIPT'),
  ),
  'bashkiria-2025': event(
    'bashkiria-2025',
    'programme',
    'Первый цифровой пленэр',
    'First Digital Plein Air',
    l('Шульган-Таш · Башкортостан', 'Shulgan-Tash · Bashkortostan'),
  ),
  'metro-2024': event(
    'metro-2024',
    'programme',
    'Цифровой пленэр в московском метро',
    'Digital plein-air in the Moscow metro',
    moscow,
    l('Станция «Фонвизинская»', 'Fonvizinskaya station'),
  ),
  'sber-2025': event(
    'sber-2025',
    'lecture',
    'Science-art лекция для Сбербанка',
    'Science-art lecture for Sberbank',
    moscow,
  ),
  'tavrida-ai-2025': event(
    'tavrida-ai-2025',
    'festival',
    'Фестиваль ИИ «Культурный код России»',
    'Cultural Code of Russia AI festival',
    l('Судак', 'Sudak'),
    l('Таврида.АРТ', 'Tavrida.ART'),
  ),
  'tavrida-gastro-2025': event(
    'tavrida-gastro-2025',
    'school',
    'Арт-школа «Гастро.Юг» · Таврида.Арт',
    'Gastro.Yug art school · Tavrida.Art',
    l('Судак', 'Sudak'),
    l('Академия «Меганом»', 'Meganom Academy'),
  ),
  'tpp-2025': event(
    'tpp-2025',
    'programme',
    'Russian Digital Creative',
    'Russian Digital Creative',
    moscow,
    l('ТПП РФ', 'Russian Chamber of Commerce'),
  ),
  'techweek-2024': event(
    'techweek-2024',
    'conference',
    'Конференция Tech Week',
    'Tech Week conference',
    moscow,
  ),
  'battle-billion-2024': event(
    'battle-billion-2024',
    'forum',
    'Форум «Битва за миллиард»',
    'Battle for a Billion forum',
  ),
  'unique-russia-2026': event(
    'unique-russia-2026',
    'exhibition',
    'VI выставка-форум «Уникальная Россия»',
    '6th Unique Russia exhibition-forum',
    moscow,
    l('Гостиный двор', 'Gostiny Dvor'),
  ),
  'ossetia-2025': event(
    'ossetia-2025',
    'exhibition',
    'Мультимедийная выставка «Культурный код Северной Осетии»',
    'Cultural Code of North Ossetia multimedia exhibition',
    moscow,
  ),
  'green-door-2024': event(
    'green-door-2024',
    'lecture',
    'Лекция «Красиво про мозг»',
    'Beautiful About the Brain lecture',
    moscow,
    l('Антикафе «Зелёная Дверь»', 'Green Door anti-cafe'),
  ),
  'ashram-lecture-2025': event(
    'ashram-lecture-2025',
    'lecture',
    'Лекция «Красиво про мозг»',
    'Beautiful About the Brain lecture',
    undefined,
    ashram,
  ),
  'tskhr-lecture-2025': event(
    'tskhr-lecture-2025',
    'lecture',
    'Лекция «Красиво про мозг»',
    'Beautiful About the Brain lecture',
    moscow,
    l('Мастерская Мультимедиа ТСХР', 'TSKHR Multimedia Workshop'),
  ),
  'almaz-lecture-2026': event(
    'almaz-lecture-2026',
    'lecture',
    'Лекция «Красиво про мозг»',
    'Beautiful About the Brain lecture',
    undefined,
    l('Алмаз', 'Almaz'),
  ),
};
