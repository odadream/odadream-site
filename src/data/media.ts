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
    subject: ["mindshow", "event-portal-2025"],
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

  // --- Project Schrödinger (neuro-theatre) ---
  "schrd-teaser": {
    url: "https://dzen.ru/video/watch/6845a4440a4ab554ebf00fb0",
    poster: "/images/content/works/schrodinger-2025-poster-thumb.webp",
    title: {
      en: "Project Schrödinger · how it was",
      ru: "Проект Шрёдингер · как это было",
    },
    subkind: "video",
    subject: ["schrodinger", "event-tsiolkovsky-2025", "media-schrodinger-teaser"],
  },
  "schrd-poster": {
    url: "/images/content/works/schrodinger-2025-poster.webp",
    poster: "/images/content/works/schrodinger-2025-poster-thumb.webp",
    title: { en: "Project Schrödinger — poster", ru: "Проект Шрёдингер — афиша" },
    subkind: "photo",
    subject: ["schrodinger", "event-tsiolkovsky-2025", "media-schrodinger-poster"],
  },
  "schrd-hero": {
    url: "/images/content/events/schrodinger-2025/schrodinger-2025-01.webp",
    title: {
      en: "Project Schrödinger 2025 — premiere",
      ru: "Проект Шрёдингер 2025 — премьера",
    },
    subject: ["schrodinger", "event-tsiolkovsky-2025", "media-schrodinger-photos"],
  },

  // --- Ancestors in the Noise (CultTech 2026) ---
  "ancestors-hero": {
    url: "/images/content/works/ancestors-hero.webp",
    poster: "/images/content/works/ancestors-hero-thumb.webp",
    title: {
      en: "Ancestors in the Noise — cover",
      ru: "Предки в шуме — обложка",
    },
    subkind: "photo",
    subject: ["ancestors"],
  },
  "ancestors-sketch": {
    url: "/images/content/works/ancestors-sketch.webp",
    poster: "/images/content/works/ancestors-sketch-thumb.webp",
    title: {
      en: "Ancestors in the Noise — concept sketch",
      ru: "Предки в шуме — концепт-эскиз",
    },
    subkind: "sketch",
    subject: ["ancestors"],
  },

  // --- Interference of Realities (neuro-theater) ---
  "intf-poster": {
    url: "/images/content/works/interference-2026-poster.webp",
    poster: "/images/content/works/interference-2026-poster-thumb.webp",
    title: { en: "Interference — poster", ru: "Интерференция — афиша" },
    subkind: "photo",
    subject: ["interference", "event-tsiolkovsky-2026", "media-interference-poster"],
  },
  "intf-hero": {
    url: "/images/content/events/interference-2026/interference-2026-01.webp",
    title: {
      en: "Interference of Realities 2026 — premiere",
      ru: "Интерференция реальностей 2026 — премьера",
    },
    subject: ["interference", "event-tsiolkovsky-2026", "media-interference-photos"],
  },
  "intf-radio": {
    url: "https://vk.com/wall-220048623_232",
    poster: "/images/content/works/interference-2026-poster-thumb.webp",
    title: {
      en: "Interference · Nika FM interview",
      ru: "Интерференция · интервью «Ника FM»",
    },
    subkind: "audio",
    subject: ["interference", "event-tsiolkovsky-2026", "media-interference-radio-nika"],
    mirrors: {
      vk: "https://vk.com/wall-220048623_232",
    },
  },

  // --- Posustoronniy (immersive shadow installation) ---
  "pos-deck-pdf": {
    url: "/documents/posustoronniy-deck.pdf",
    poster: "/images/content/works/posustoronniy/posustoronniy-cover-thumb.webp",
    title: {
      en: "Posustoronniy — presentation PDF (2008)",
      ru: "Потусторонний — презентация PDF (2008)",
    },
    subkind: "text",
    subject: ["posustoronniy", "media-posustoronniy-deck"],
  },
  "pos-hero": {
    url: "/images/content/works/posustoronniy/posustoronniy-cover.webp",
    poster: "/images/content/works/posustoronniy/posustoronniy-cover-thumb.webp",
    title: { en: "Posustoronniy — cover", ru: "Потусторонний — обложка" },
    subkind: "photo",
    subject: ["posustoronniy", "media-posustoronniy-deck"],
  },
  "pos-storyboard": {
    url: "/images/content/works/posustoronniy/posustoronniy-storyboard.webp",
    title: { en: "Posustoronniy — storyboard", ru: "Потусторонний — сториборд" },
    subkind: "sketch",
    subject: ["posustoronniy", "media-posustoronniy-deck"],
  },
  "pos-concept": {
    url: "/images/content/works/posustoronniy/posustoronniy-concept.webp",
    title: { en: "Posustoronniy — concept board", ru: "Потусторонний — концепт-борд" },
    subkind: "photo",
    subject: ["posustoronniy", "media-posustoronniy-deck"],
  },
  "pos-tech": {
    url: "/images/content/works/posustoronniy/posustoronniy-tech.webp",
    title: { en: "Posustoronniy — technical layout", ru: "Потусторонний — техническая схема" },
    subkind: "sketch",
    subject: ["posustoronniy", "media-posustoronniy-deck"],
  },

  // --- Sync Circle (group neuro-audio installation) ---
  "sync-video": {
    url: "https://www.youtube.com/watch?v=wRyzTwNqdqQ",
    poster: "/images/content/works/sync-circle/sync-circle-hero-thumb.webp",
    title: { en: "Sync Circle · installation demo", ru: "Круг синхронизации · демо инсталляции" },
    subkind: "video",
    subject: ["sync-circle", "multisync", "media-sync-circle-video"],
    mirrors: {
      youtube: "https://www.youtube.com/watch?v=wRyzTwNqdqQ",
      dzen: "https://dzen.ru/a/YFSXv_8BKDp8IHDb",
    },
  },
  "sync-video-lines": {
    url: "https://www.youtube.com/watch?v=FisxaQxfe8c",
    poster: "/images/content/works/sync-circle/sync-circle-mandala.webp",
    title: { en: "Sync Circle · synchrony lines", ru: "Круг синхронизации · линии синхронности" },
    subkind: "video",
    subject: ["sync-circle", "media-sync-circle-video"],
    mirrors: {
      youtube: "https://www.youtube.com/watch?v=FisxaQxfe8c",
    },
  },
  "sync-hero": {
    url: "/images/content/works/sync-circle/sync-circle-hero.webp",
    poster: "/images/content/works/sync-circle/sync-circle-hero-thumb.webp",
    title: { en: "Sync Circle — overview", ru: "Круг синхронизации — обзор" },
    subkind: "photo",
    subject: ["sync-circle", "media-sync-circle-gallery"],
  },
  "sync-mandala": {
    url: "/images/content/works/sync-circle/sync-circle-mandala.webp",
    title: { en: "Sync Circle — mandala-neurogram", ru: "Круг синхронизации — мандала-нейрограмма" },
    subkind: "photo",
    subject: ["sync-circle", "media-sync-circle-gallery"],
  },
  "sync-mvc": {
    url: "/images/content/works/sync-circle/sync-circle-mvc.webp",
    title: { en: "Sync Circle — MVC diagram", ru: "Круг синхронизации — схема MVC" },
    subkind: "sketch",
    subject: ["sync-circle", "media-sync-circle-gallery"],
  },

  // --- Neuro Honor Board (Skolkovo ART × TECHNOLOGY) ---
  "hon-deck-pdf": {
    url: "/documents/honors-skolkovo-presentation.pdf",
    poster: "/images/content/works/honors-skolkovo/honors-skolkovo-cover-thumb.webp",
    title: {
      en: "Neuro Honor Board — competition PDF",
      ru: "Нейродоска почёта — презентация конкурса PDF",
    },
    subkind: "text",
    subject: ["honors", "org-skolkovo", "media-honors-presentation", "proof-award-skolkovo-arttech"],
  },
  "hon-hero": {
    url: "/images/content/works/honors-skolkovo/honors-skolkovo-cover.webp",
    poster: "/images/content/works/honors-skolkovo/honors-skolkovo-cover-thumb.webp",
    title: { en: "Neuro Honor Board — cover", ru: "Нейродоска почёта — обложка" },
    subkind: "photo",
    subject: ["honors", "media-honors-presentation"],
  },
  "hon-interior": {
    url: "/images/content/works/honors-skolkovo/honors-skolkovo-interior.webp",
    title: { en: "Neuro Honor Board — pavilion interior", ru: "Нейродоска почёта — интерьер павильона" },
    subkind: "photo",
    subject: ["honors", "media-honors-presentation"],
  },
  "hon-mandala": {
    url: "/images/content/works/honors-skolkovo/honors-skolkovo-mandala.webp",
    title: { en: "Neuro Honor Board — neuromandala", ru: "Нейродоска почёта — нейромандала" },
    subkind: "photo",
    subject: ["honors", "neuromandala", "media-honors-presentation"],
  },
};
