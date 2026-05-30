/**
 * Single source of truth for media assets (videos, images, audio) referenced
 * across content. Change a URL or poster here once → it propagates everywhere
 * via the `![[media:<id>]]` token (resolved at render time by contentProcessor).
 *
 * Each entry holds the canonical URL, optional poster, bilingual default
 * title, and optional subject node ids for provenance cross-reference.
 * Inline overrides are still allowed: `![[media:<id> | Custom Label]]`.
 */

export type MediaAsset = {
  /** Primary URL used for inline embed. */
  url: string;
  poster?: string;
  title?: { en: string; ru: string };
  /** Lotus node ids this asset relates to (product / event). */
  subject?: string[];
  /** Coarse type — see taxonomy.media. */
  subkind?: "video" | "photo" | "sketch" | "teaser" | "post" | "text" | "audio";
  /** Alternative URLs for the same asset (mirrors on YT/VK/etc). Keyed by platform name. */
  mirrors?: Record<string, string>;
};

export const MEDIA: Record<string, MediaAsset> = {
  // --- Neurobattle / Paradox of Victory ---
  "nrbt-gameplay-v9": {
    url: "https://dzen.ru/embed/o20YLsWwKAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/neurobattle_gameplay.webp",
    title: { en: "Neurobattle · gameplay v9", ru: "Нейробитва · геймплей v9" },
    subject: ["neurobattle"],
  },
  "nrbt-dano": {
    url: "https://dzen.ru/embed/o20ZleGMJAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/neurobattle_dano.webp",
    title: { en: "DANO Olympiad", ru: "Олимпиада DANO" },
    subject: ["event-dano-ekoniva-2025", "hub-host-events", "neurobattle"],
  },
  "nrbt-veter": {
    url: "https://dzen.ru/embed/v1ftBaZRQUXU?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/neurobattle_veter.webp",
    title: { en: "Wind of Change · charity gala", ru: "Ветер Перемен · благотворительный вечер" },
    subject: ["neurobattle"],
  },
  "nrbt-tnt": {
    url: "https://dzen.ru/embed/vY9PlkGfKPUc?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/neurobattle_tnt.webp",
    title: { en: "TNT · You Like Me", ru: "ТНТ · Ты как Я" },
    subject: ["neurobattle"],
  },

  // --- BYOB 2026 / MindShow ---
  "byob-2026-hero": {
    url: "/images/content/hub-events/event-byob-2026/neuromandala-installation.jpg",
    title: {
      en: "Neuromandala installation — Mini BYOB 2026",
      ru: "Инсталляция Нейромандала — Мини BYOB 2026",
    },
    subject: ["event-byob-2026", "mindshow", "media-byob-2026-photos"],
  },

  // --- BYOB 2020 / MultiSync ---
  "byob-2020-hero": {
    url: "/images/content/hub-events/event-byob-2020/projection-pentagon.jpg",
    title: {
      en: "MultiSync projection — BYOB Moscow 2020",
      ru: "Проекция MultiSync — BYOB Moscow 2020",
    },
    subject: ["event-byob-2020", "multisync", "media-byob-2020-photos"],
  },

  // --- MindShow ---
  "mdsh-demo-v5": {
    url: "https://dzen.ru/embed/o20aog1YJAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/mindshow_mdsh_v5.webp",
    title: { en: "MindShow · demo v5", ru: "MindShow · демо v5" },
    subject: ["mindshow", "event-byob-2019", "event-byob-2026"],
  },
  "mdsh-hypercube": {
    url: "https://dzen.ru/embed/vL3M-cNgfSVo?from_block=partner&from=zen&mute=1&autoplay=1&tv=0",
    poster: "/images/content/mindshow_portal.webp",
    title: { en: "Hypercube · Portal 2030–2050, Skolkovo", ru: "Гиперкуб · Портал 2030–2050, Сколково" },
    subject: ["mindshow", "portal-2025"],
  },
  "mdsh-urban-forum": {
    url: "https://dzen.ru/embed/vYcLmkD5bAxE?from_block=partner&from=zen&mute=1&autoplay=1&tv=0",
    poster: "/images/content/mindshow_urban_forum.webp",
    title: { en: "RusUrbanForum", ru: "РосУрбанФорум" },
    subject: ["mindshow"],
  },
  "mdsh-wildmint": {
    url: "https://dzen.ru/embed/o21sOdHQIAAA?from_block=partner&from=zen&mute=1&autoplay=1&tv=0",
    poster: "/images/content/mindshow_myata.webp",
    title: { en: "Wild Mint Festival", ru: "Дикая Мята" },
    subject: ["mindshow"],
  },
  "mdsh-ashram": {
    url: "https://dzen.ru/embed/o21s_fHQIAAA?from_block=partner&from=zen&mute=1&autoplay=1&tv=0",
    poster: "/images/content/mindshow_ashram.webp",
    title: { en: "Ashram · Natali Osman", ru: "Ashram · Натали Осман" },
    subject: ["mindshow"],
  },
  "mdsh-bashkiria": {
    url: "https://dzen.ru/embed/o21tvvnYKAAA?from_block=partner&from=zen&mute=1&autoplay=1&tv=0",
    poster: "/images/content/mindshow_ufa.webp",
    title: { en: "Shulgan-Tash · digital plein air", ru: "Шульган-Таш · цифровой пленэр" },
    subject: ["mindshow"],
  },
  "mdsh-metro": {
    url: "/images/content/mindshow_metro_2.webp",
    title: { en: "Moscow metro · digital plein air", ru: "Московское метро · цифровой пленэр" },
    subject: ["mindshow"],
  },
  "mdsh-tpp": {
    url: "/images/content/mindshow_tpp.webp",
    title: { en: "CCI RF · Russian Digital Creative", ru: "ТПП РФ · Russian Digital Creative" },
    subject: ["event-tpp-mindshow-2025", "hub-host-events", "mindshow"],
  },
  "mdsh-terraforming": {
    url: "https://www.youtube.com/watch?v=xUlotjPuXPA",
    poster: "/images/content/neuromandala-cover.jpg",
    title: { en: "Terraforming — MIPT performance", ru: "Терраформинг — перформанс МФТИ" },
    subject: ["mindshow", "event-mipt-terraforming-2025", "neuromandala"],
  },

  // --- Lectures (event clips & cover photos) ---
  "lec-gonchar": {
    url: "https://dzen.ru/embed/vZ6STYjxZhHk?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/lectures-gonchar.webp",
    title: { en: "Nata Gonchar · private neuro-show", ru: "Ната Гончар · частное нейрошоу" },
    subject: ["hub-host-events", "hub-lectures"],
  },
  "lec-bauman": {
    url: "https://dzen.ru/embed/o20b-pOkIAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/lectures-moscow2030.webp",
    title: { en: "Bauman / Moscow 2030 · brain-hacking lecture", ru: "Бауман / Москва 2030 · лекция о брейнхакинге" },
    subject: ["hub-lectures"],
  },
  "lec-ikc": {
    url: "https://dzen.ru/embed/v2Wb3fVoWW1A?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/lectures-ikc.webp",
    title: { en: "ICC Kaluga · masterclass", ru: "ИКЦ Калуга · мастер-класс" },
    subject: ["hub-lectures"],
  },
  "lec-tskhr": {
    url: "https://dzen.ru/embed/veLb095NOWiA?from_block=partner&from=zen&mute=1&autoplay=1&tv=0",
    poster: "/images/content/lectures-tshr.webp",
    title: { en: "TSKhR · neuroaesthetics lecture", ru: "ТСХР · лекция о нейроэстетике" },
    subject: ["hub-lectures", "beautiful-brain"],
  },
  "lec-tavrida": {
    url: "/images/content/lectures-tavrida.webp",
    title: { en: "Tavrida.ART · AI festival", ru: "Таврида.АРТ · фестиваль ИИ" },
    subject: ["hub-lectures"],
  },
  "lec-sber": {
    url: "/images/content/lectures-sber.webp",
    title: { en: "Sberbank · science-art lecture", ru: "Сбербанк · science-art лекция" },
    subject: ["hub-lectures"],
  },
  "lec-ashram": {
    url: "/images/content/lectures-ashram.webp",
    title: { en: "Ashram Studio · public talk", ru: "Студия Ashram · публичный talk" },
    subject: ["hub-lectures"],
  },

  // --- Covers / generic ---
  "neuromandala-cover": {
    url: "/images/content/neuromandala-cover.jpg",
    title: { en: "Neuromandala", ru: "Нейромандала" },
    subject: ["neuromandala"],
  },
  "art-brain-cover": {
    url: "/images/content/art-brain.jpg",
    title: { en: "Art of Brain", ru: "Искусство мозга" },
    subject: ["art-brain", "beautiful-brain", "hub-debug-image", "hub-lectures"],
  },
  "jewellery-cover": {
    url: "/images/content/jewellery.jpg",
    title: { en: "Jewellery hub-materia", ru: "Ювелирные объекты" },
    subject: ["jewellery"],
  },

  // --- Interference of Realities (neuro-theater) ---
  "intf-teaser": {
    url: "https://dzen.ru/video/watch/intf-teaser-placeholder",
    poster: "/images/content/interference_teaser.webp",
    title: { en: "Interference · official teaser", ru: "Интерференция · официальный тизер" },
    subkind: "video",
    subject: ["interference", "event-interference-tsiolkovsky-2026"],
    mirrors: {
      youtube: "https://youtube.com/watch?v=intf-teaser-placeholder",
      vk: "https://vk.com/video/intf-teaser-placeholder",
    },
  },
};
