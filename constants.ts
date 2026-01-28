
import { LotusNode, LocalizedString } from './types';
import * as Content from './content';
import { getMediaType } from './utils/mediaHelpers';

// --- CONFIGURATION ---

export const SITE_VERSION = "v4.0.3";

// Toggle to use online placeholders (Unsplash) vs local assets.
// Set to FALSE to use the procedurally generated SVGs (via npm run assets:generate)
const DEBUG_MODE_IMAGES = true; 

// Debug Placeholder Images (Abstract/Cyberpunk themes)
const DEBUG_IMAGES = [
    '1550684848-fac1c5b4e853', // Abstract fluid
    '1451187580459-43490279c0fa', // Network/Tech
    '1518770660439-4636190af475', // Chip/processor
    '1618005182384-a83a8bd57fbe', // Dark Liquid
    '1504333638930-c8787321dd0b', // Dark mountain/texture
    '1614850523459-c2f4c699c52e', // Abstract gradient
    '1614851093829-370557b4f5d2', // Noise/Grain
    '1534224039826-ad7a27578740', // Texture
    '1618123066360-1e42bd309f03', // Dark blue abstract
    '1550751827-4bd374c3f58b', // Cyberpunk
];

/**
 * Returns a media URL.
 * If DEBUG_MODE_IMAGES is true, generates a deterministic Unsplash URL based on ID.
 * Otherwise, expects a local SVG in /images/nodes/.
 */
const getImg = (id: string, keywords: string[] = []) => {
  if (DEBUG_MODE_IMAGES) {
    const uniqueSig = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imgId = DEBUG_IMAGES[uniqueSig % DEBUG_IMAGES.length];
    return `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&w=800&q=80`;
  }
  return `/images/nodes/${id}.svg`;
};

// --- HELPER FOR BILINGUAL NODE CREATION ---
const createNode = (
  id: string, 
  titleEn: string,
  titleRu: string,
  description: LocalizedString, 
  type: 'hub' | 'content' | 'action' | 'media', 
  children: LotusNode[] = [], 
  visible: boolean = true,
  shortTitleEn?: string,
  shortTitleRu?: string,
  imgKeywords: string[] = [],
  customMediaUrl?: string,
  lastModified?: string // Added parameter
): LotusNode => {
  const mediaUrl = customMediaUrl || getImg(id, imgKeywords.length ? imgKeywords : [type, 'abstract']);
  return {
    id,
    title: { en: titleEn, ru: titleRu },
    shortTitle: { en: shortTitleEn || titleEn, ru: shortTitleRu || titleRu },
    description,
    type,
    imageUrl: getMediaType(mediaUrl) === 'video' ? undefined : mediaUrl, // Only set imageUrl if it is an image
    mediaUrl: mediaUrl,
    mediaType: getMediaType(mediaUrl),
    visible,
    children: children.filter(c => c.visible !== false),
    lastModified
  };
};

// --- STRUCTURE DEFINITION ---

const games = createNode('games', 'Games', 'Игры', Content.works_index_md, 'hub', [
    createNode('neurobattle', 'Neurobattle', 'Нейробитва', Content.games_neurobattle_md, 'content', [], true, undefined, undefined, ['esports', 'brain'], undefined, '2023.10.15'),
    createNode('brain-hack', 'Brain Hack', 'Взлом Мозга', Content.games_brain_hack_md, 'content', [], true, undefined, undefined, ['illusion', 'mind'], undefined, '2023.11.02'),
    createNode('journey', 'Journey', 'Путешествие', Content.games_journey_md, 'content', [], true, undefined, undefined, ['vr', 'meditation']),
], true, undefined, undefined, ['gaming', 'neon']);

const lectures = createNode('lectures', 'Lectures', 'Лекции', Content.lectures_art_brain_md, 'hub', [
    createNode('art-brain', 'Art of Brain', 'Искусство Мозга', Content.lectures_art_brain_md, 'content', [], true, undefined, undefined, ['brain', 'art'], undefined, '2024.01.20'),
    createNode('sound-brain', 'Sound', 'Звук', Content.lectures_sound_brain_md, 'content', [], true, undefined, undefined, ['wave', 'sound']),
    createNode('taste-brain', 'Taste', 'Вкус', Content.lectures_taste_brain_md, 'content', [], true, undefined, undefined, ['food', 'abstract']),
    createNode('color-brain', 'Color', 'Цвет', Content.lectures_color_brain_md, 'content', [], true, undefined, undefined, ['spectrum', 'color']),
    createNode('empathy', 'Empathy', 'Эмпатия', Content.lectures_empathy_md, 'content', [], true, 'Empathy', 'Эмпатия', ['connection', 'people']),
    createNode('neuroaesthetics-lec', 'Neuroaesthetics', 'Нейроэстетика', Content.lectures_neuroaesthetics_md, 'content', [], true, undefined, undefined, ['sculpture', 'geometry']),
], true, undefined, undefined, ['lecture', 'hall']);

const workshops = createNode('workshops', 'Workshops', 'Воркшопы', Content.works_index_md, 'hub', [
    createNode('neuro-dance', 'Neuro Dance', 'Нейро Танец', Content.workshops_dance_md, 'content', [], true, undefined, undefined, ['dance', 'motion']),
    createNode('neurosync', 'Neurosync', 'Нейросинк', Content.workshops_neurosync_md, 'content', [], true, undefined, undefined, ['group', 'meditation']),
    createNode('gong', 'Gong Theater', 'Гонг Театр', Content.workshops_gong_md, 'content', [], true, undefined, undefined, ['gong', 'sound']),
    createNode('coaching', 'Coaching', 'Коучинг', Content.workshops_coaching_md, 'content', [], true, undefined, undefined, ['focus', 'business']),
    createNode('mindshow', 'Mindshow', 'Майнд-шоу', Content.workshops_mindshow_md, 'content', [], true, undefined, undefined, ['stage', 'light']),
], true, undefined, undefined, ['workshop', 'people']);

const research = createNode('research', 'Research', 'Исследования', Content.research_heritage_md, 'hub', [
    createNode('heritage', 'Heritage', 'Наследие', Content.research_heritage_md, 'content', [], true, undefined, undefined, ['history', 'craft']),
    createNode('schrodinger', 'Schrodinger', 'Шрёдингер', Content.research_schrodinger_md, 'content', [], true, undefined, undefined, ['quantum', 'box']),
    createNode('sync-circle', 'Sync Circle', 'Круг Синхронизации', Content.research_sync_circle_md, 'content', [], true, undefined, undefined, ['circle', 'social']),
    createNode('dashran', 'Dashran', 'Дашран', Content.research_dashran_md, 'content', [], true, undefined, undefined, ['spark', 'idea']),
    createNode('posustoronniy', 'Posustoronniy', 'Потусторонний', Content.research_posustoronniy_md, 'content', [], true, undefined, undefined, ['darkness', 'light']),
], true, undefined, undefined, ['lab', 'science']);

const objects = createNode('objects', 'Objects', 'Объекты', Content.objects_mom_baby_md, 'hub', [
    createNode('mom-baby', 'Mom & Baby', 'Мама и Малыш', Content.objects_mom_baby_md, 'content', [], true, undefined, undefined, ['love', 'statue']),
    createNode('jewellery', 'Jewellery', 'Ювелирка', Content.objects_jewellery_md, 'content', [], true, undefined, undefined, ['silver', 'ring']),
    createNode('emomandala', 'Emomandala', 'Эмомандала', Content.objects_emomandala_md, 'content', [], true, undefined, undefined, ['mandala', '3d']),
], true, undefined, undefined, ['object', 'artifact']);

// 2. MAIN CATEGORIES

const works = createNode('works', 'Works', 'Работы', Content.works_index_md, 'hub', [
    games,
    lectures,
    workshops,
    research,
    objects
], true, undefined, undefined, ['archive', 'library']);

const events = createNode('events', 'Events', 'События', Content.events_index_md, 'hub', [
    // Example of a Video Node directly in the grid
    createNode('chastoti', 'Chastoti', 'Частоты', Content.events_chastoti_md, 'content', [], true, undefined, undefined, ['festival', 'mountain'], 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'),
    createNode('terraforming', 'Terraforming', 'Терраформинг', Content.events_terraforming_md, 'content', [], true, undefined, undefined, ['projection', 'building']),
    createNode('portal', 'Portal', 'Портал', Content.events_portal_md, 'content', [], true, undefined, undefined, ['ar', 'city']),
    createNode('byob', 'BYOB', 'BYOB', Content.events_byob_md, 'content', [], true, undefined, undefined, ['projector', 'chaos']),
    createNode('pleinair', 'Plein Air', 'Пленэр', Content.events_pleinair_md, 'content', [], true, undefined, undefined, ['nature', 'laptop']),
], true, undefined, undefined, ['concert', 'crowd']);

const collaboration = createNode('collab', 'Collaboration', 'Сотрудничество', Content.collab_index_md, 'hub', [
    createNode('for-events', 'Events', 'Ивенты', Content.collab_events_md, 'content', [], true, undefined, undefined, ['installation', 'party']),
    createNode('for-business', 'Business', 'Бизнес', Content.collab_business_md, 'content', [], true, undefined, undefined, ['office', 'future']),
    createNode('for-galleries', 'Galleries', 'Галереи', Content.collab_galleries_md, 'content', [], true, undefined, undefined, ['gallery', 'white']),
    createNode('for-artists', 'Artists', 'Художники', Content.collab_artists_md, 'content', [], true, undefined, undefined, ['studio', 'paint']),
], true, undefined, undefined, ['handshake', 'network']);

const world = createNode('world', 'World', 'Мир', Content.world_index_md, 'hub', [
    createNode('manifesto', 'Manifesto', 'Манифест', Content.world_manifesto_md, 'content', [], true, undefined, undefined, ['text', 'manifesto'], undefined, '2024.02.01'),
    createNode('team', 'Team', 'Команда', Content.world_team_md, 'content', [], true, undefined, undefined, ['portrait', 'duo']),
    createNode('press', 'Press', 'Пресса', Content.world_press_md, 'content', [], true, undefined, undefined, ['newspaper', 'digital']),
    createNode('testimonials', 'Testimonials', 'Отзывы', Content.world_testimonials_md, 'content', [], true, undefined, undefined, ['quote', 'speech']),
    createNode('acknowledgments', 'Thanks', 'Спасибо', Content.world_acknowledgments_md, 'content', [], true, undefined, undefined, ['stars', 'sky']),
], true, undefined, undefined, ['globe', 'network']);

const neuromandala = createNode('neuromandala', 'Neuromandala', 'Нейромандала', Content.neuromandala_md, 'content', [], true, undefined, undefined, ['geometry', 'brainwave'], undefined, '2023.12.12');

const contacts = createNode('contacts', 'Contacts', 'Контакты', Content.contacts_md, 'action', [], true, undefined, undefined, ['signal', 'antenna']);

// --- DEBUG BENCH ---
// A comprehensive Hub to test all node types and their visual encoding.
const debugNode = createNode('debug', 'Debug', 'Отладка', Content.debug_root_md, 'hub', [
    // 1. Nested Hub
    createNode('debug-hub', 'Nested Hub', 'Влож. Хаб', Content.debug_hub_md, 'hub', [], true, 'HUB', 'ХАБ', ['folder', 'layers']),
    // 2. Pure Article (Type: Content, but has Image. Should show FileText icon)
    createNode('debug-article', 'Article', 'Статья', Content.debug_article_md, 'content', [], true, 'TEXT', 'ТЕКСТ', ['paper', 'read']),
    // 3. Media: Video
    createNode('debug-video', 'Video', 'Видео', Content.debug_article_md, 'media', [], true, 'VID', 'ВИДЕО', [], 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'),
    // 4. Media: Audio
    createNode('debug-audio', 'Audio', 'Аудио', Content.debug_article_md, 'media', [], true, 'MP3', 'МП3', [], 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'),
    // 5. Media: Image
    createNode('debug-image', 'Image', 'Фото', Content.debug_article_md, 'media', [], true, 'IMG', 'ФОТО', ['photo', 'camera']),
    // 6. Action
    createNode('debug-action', 'Action', 'Действие', Content.debug_article_md, 'action', [], true, 'ACT', 'ДЕЙСТВ', ['lightning', 'zap'], undefined, undefined),
], true, 'DEBUG', 'ОТЛАДКА', ['code', 'screen']);

// 3. ROOT NODE
export const ROOT_NODE = createNode('home', 'oda.dream', 'oda.dream', Content.index_md, 'hub', [
    neuromandala,
    works,
    events,
    collaboration,
    world,
    contacts,
    debugNode
], true, undefined, undefined, ['lotus', 'galaxy'], undefined, '2024.03.14');

// 4. HEADER/FOOTER ACCESS
export const QUICK_ACCESS = [
    ROOT_NODE,
    neuromandala,
    works,
    events,
    collaboration,
    world,
    contacts,
    debugNode 
];
