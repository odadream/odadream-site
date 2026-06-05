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
    url: "/images/content/events/byob-2026/neuromandala-installation.webp",
    title: {
      en: "Neuromandala installation — Mini BYOB 2026",
      ru: "Инсталляция Нейромандала — Мини BYOB 2026",
    },
    subject: ["event-byob-2026", "mindshow", "media-byob-2026-photos"],
  },

  // --- BYOB 2020 / MultiSync ---
  "byob-2020-hero": {
    url: "/images/content/events/byob-2020/projection-pentagon.webp",
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
    poster: "/images/content/neuromandala-cover.webp",
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
    url: "/images/content/neuromandala-cover.webp",
    title: { en: "Neuromandala", ru: "Нейромандала" },
    subject: ["neuromandala"],
  },
  "art-brain-cover": {
    url: "/images/content/art-brain.webp",
    title: { en: "Art of Brain", ru: "Искусство мозга" },
    subject: ["art-brain", "beautiful-brain", "hub-debug-image", "hub-lectures"],
  },
  "jewellery-cover": {
    url: "/images/content/jewellery.webp",
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

  // --- Beyond / Потусторонний (immersive shadow installation; id potustoronniy) ---
  "pot-deck-pdf": {
    url: "/documents/potustoronniy-deck.pdf",
    poster: "/images/content/works/potustoronniy/potustoronniy-cover-thumb.webp",
    title: {
      en: "Beyond — presentation PDF (2008)",
      ru: "Потусторонний — презентация PDF (2008)",
    },
    subkind: "text",
    subject: ["potustoronniy", "media-potustoronniy-deck"],
  },
  "pot-hero": {
    url: "/images/content/works/potustoronniy/potustoronniy-cover.webp",
    poster: "/images/content/works/potustoronniy/potustoronniy-cover-thumb.webp",
    title: { en: "Beyond — cover", ru: "Потусторонний — обложка" },
    subkind: "photo",
    subject: ["potustoronniy", "media-potustoronniy-deck"],
  },
  "pot-storyboard": {
    url: "/images/content/works/potustoronniy/potustoronniy-storyboard.webp",
    title: { en: "Beyond — storyboard", ru: "Потусторонний — сториборд" },
    subkind: "sketch",
    subject: ["potustoronniy", "media-potustoronniy-deck"],
  },
  "pot-concept": {
    url: "/images/content/works/potustoronniy/potustoronniy-concept.webp",
    title: { en: "Beyond — concept board", ru: "Потусторонний — концепт-борд" },
    subkind: "photo",
    subject: ["potustoronniy", "media-potustoronniy-deck"],
  },
  "pot-tech": {
    url: "/images/content/works/potustoronniy/potustoronniy-tech.webp",
    title: { en: "Beyond — technical layout", ru: "Потусторонний — техническая схема" },
    subkind: "sketch",
    subject: ["potustoronniy", "media-potustoronniy-deck"],
  },

  // --- Theatre of My Name (TIM) — Dzen essay series ---
  "tim-dzen-part-1": {
    url: "https://dzen.ru/a/Zv7Ih1xeTxz0-AAl",
    poster: "/images/nodes/theatre-my-name.svg",
    title: {
      en: "TIM · Part 1 — Authentic Movement",
      ru: "ТИМ · ч. 1 — Аутентичное движение",
    },
    subkind: "text",
    subject: ["theatre-my-name", "media-theatre-my-name-dzen"],
    mirrors: { dzen: "https://dzen.ru/a/Zv7Ih1xeTxz0-AAl" },
  },
  "tim-dzen-part-2": {
    url: "https://dzen.ru/a/Zv7Jx3oJ7DdDCZtI",
    poster: "/images/nodes/theatre-my-name.svg",
    title: {
      en: "TIM · Part 2 — Family constellations",
      ru: "ТИМ · ч. 2 — Расстановки",
    },
    subkind: "text",
    subject: ["theatre-my-name", "media-theatre-my-name-dzen"],
    mirrors: { dzen: "https://dzen.ru/a/Zv7Jx3oJ7DdDCZtI" },
  },
  "tim-dzen-part-3": {
    url: "https://dzen.ru/a/ZwOYsUR-qk5GPdQU",
    poster: "/images/nodes/theatre-my-name.svg",
    title: {
      en: "TIM · Part 3 — Playback & psychodrama",
      ru: "ТИМ · ч. 3 — Плейбек и психодрама",
    },
    subkind: "text",
    subject: ["theatre-my-name", "media-theatre-my-name-dzen"],
    mirrors: { dzen: "https://dzen.ru/a/ZwOYsUR-qk5GPdQU" },
  },
  "tim-dzen-part-4": {
    url: "https://dzen.ru/a/ZzTCFPdiD0vbmNw6",
    poster: "/images/nodes/theatre-my-name.svg",
    title: {
      en: "TIM · Part 4 — Metaphorical cards",
      ru: "ТИМ · ч. 4 — Метафорические карты",
    },
    subkind: "text",
    subject: ["theatre-my-name", "media-theatre-my-name-dzen"],
    mirrors: { dzen: "https://dzen.ru/a/ZzTCFPdiD0vbmNw6" },
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

  // --- Darshan Moment (R&D; video + single documentation node) ---
  "dash-video": {
    url: "https://dzen.ru/video/watch/67dc1059b6978c7cceec438d",
    poster: "/images/content/works/dashran/dashran-tech-render-b-thumb.webp",
    title: { en: "Darshan Moment · concept video", ru: "Момент Даршана · видео концепции" },
    subkind: "video",
    subject: ["dashran", "media-dashran-video"],
    mirrors: {
      dzen: "https://dzen.ru/video/watch/67dc1059b6978c7cceec438d",
    },
  },
  "dash-tech-desc-pdf": {
    url: "/documents/dashran-tech-description.pdf",
    poster: "/images/content/works/dashran/dashran-tech-render-b-thumb.webp",
    title: {
      en: "Darshan Moment — technical description PDF",
      ru: "Момент Даршана — художественно-техническое описание PDF",
    },
    subkind: "text",
    subject: ["dashran", "media-dashran-docs"],
  },
  "dash-tech-spec-pdf": {
    url: "/documents/dashran-tech-spec-nur.pdf",
    poster: "/images/content/works/dashran/dashran-tech-render-b-thumb.webp",
    title: {
      en: "Darshan Moment — full tech spec PDF (NUR)",
      ru: "Момент Даршана — полное техзадание PDF (НУР)",
    },
    subkind: "text",
    subject: ["dashran", "media-dashran-docs"],
  },
  "dash-render-b": {
    url: "/images/content/works/dashran/dashran-tech-render-b.webp",
    poster: "/images/content/works/dashran/dashran-tech-render-b-thumb.webp",
    title: { en: "Darshan Moment — spatial render", ru: "Момент Даршана — пространственный рендер" },
    subkind: "photo",
    subject: ["dashran", "media-dashran-docs"],
  },
  "dash-concept": {
    url: "/images/content/works/dashran/dashran-playda-01.webp",
    poster: "/images/content/works/dashran/dashran-playda-01-thumb.webp",
    title: { en: "Darshan Moment — concept slide", ru: "Момент Даршана — концепт" },
    subkind: "photo",
    subject: ["dashran", "media-dashran-docs"],
  },
  "dash-footprint": {
    url: "/images/content/works/dashran/dashran-tech-space.webp",
    title: { en: "Darshan Moment — footprint", ru: "Момент Даршана — габариты" },
    subkind: "sketch",
    subject: ["dashran", "media-dashran-docs"],
  },
  "dash-plan": {
    url: "/images/content/works/dashran/dashran-tech-plan.webp",
    title: { en: "Darshan Moment — floor plan", ru: "Момент Даршана — план" },
    subkind: "sketch",
    subject: ["dashran", "media-dashran-docs"],
  },
  "dash-wiring": {
    url: "/images/content/works/dashran/dashran-wiring.webp",
    title: { en: "Darshan Moment — wiring", ru: "Момент Даршана — подключение" },
    subkind: "sketch",
    subject: ["dashran", "media-dashran-docs"],
  },
  "dash-cycle": {
    url: "/images/content/works/dashran/dashran-system-flow.webp",
    title: { en: "Darshan Moment — performance cycle", ru: "Момент Даршана — цикл перформанса" },
    subkind: "sketch",
    subject: ["dashran", "media-dashran-docs"],
  },

  // --- Other People (inclusive EEG exhibition, R&D) ---
  "oth-deck-ru": {
    url: "/documents/other-people-deck-ru.pdf",
    poster: "/images/content/works/another-people/other-people-gallery-thumb.webp",
    title: { en: "Other People — deck PDF (RU)", ru: "Другие люди — презентация PDF (RU)" },
    subkind: "text",
    subject: ["another-people", "media-another-people-docs"],
  },
  "oth-deck-en": {
    url: "/documents/other-people-art-science-society.pdf",
    poster: "/images/content/works/another-people/other-people-gallery-thumb.webp",
    title: {
      en: "Other People — art · science · society PDF (EN)",
      ru: "Другие люди — art · science · society PDF (EN)",
    },
    subkind: "text",
    subject: ["another-people", "media-another-people-docs"],
  },
  "oth-gallery": {
    url: "/images/content/works/another-people/other-people-gallery.webp",
    poster: "/images/content/works/another-people/other-people-gallery-thumb.webp",
    title: { en: "Other People — exhibition layout", ru: "Другие люди — план выставки" },
    subkind: "photo",
    subject: ["another-people", "media-another-people-docs"],
  },
  "oth-character-card": {
    url: "/images/content/works/another-people/other-people-character-card.webp",
    title: { en: "Other People — character card", ru: "Другие люди — карточка персонажа" },
    subkind: "photo",
    subject: ["another-people", "neuromandala", "media-another-people-docs"],
  },
  "oth-eeg-session": {
    url: "/images/content/works/another-people/other-people-eeg-session.webp",
    title: { en: "Other People — EEG session", ru: "Другие люди — запись ЭЭГ" },
    subkind: "photo",
    subject: ["another-people", "media-another-people-docs"],
  },
  "oth-neuromandala": {
    url: "/images/content/works/another-people/other-people-neuromandala.webp",
    title: { en: "Other People — neuromandala", ru: "Другие люди — нейромандала" },
    subkind: "photo",
    subject: ["another-people", "neuromandala", "media-another-people-docs"],
  },

  // --- Materia / ODA.dream Rings (origin story) ---
  "oda-rings-cover": {
    url: "/images/content/materia/oda-rings/oda-rings-cover.webp",
    poster: "/images/content/materia/oda-rings/oda-rings-cover-thumb.webp",
    title: { en: "ODA.dream Rings", ru: "Кольца ODA.dream" },
    subkind: "photo",
    subject: ["oda-rings", "media-oda-rings-story"],
  },
  "oda-rings-drawings-pdf": {
    url: "/documents/oda-rings-drawings-v220927.pdf",
    poster: "/images/content/materia/oda-rings/oda-rings-cover-thumb.webp",
    title: { en: "Arabov rings — manufacturing drawings PDF", ru: "Кольца Арабовых — PDF чертежа" },
    subkind: "text",
    subject: ["oda-rings", "media-oda-rings-drawings"],
  },
  "oda-rings-banner-pdf": {
    url: "/documents/oda-rings-synergy-banner-2022.pdf",
    poster: "/images/content/materia/oda-rings/synergy-banner-preview-thumb.webp",
    title: { en: "ODA × dream banner — Synergy Forum 2022", ru: "Баннер ODA × dream — Synergy 2022" },
    subkind: "text",
    subject: ["oda-rings", "media-oda-rings-banner", "proof-oda-synergy-forum-2022"],
  },
  "oda-rings-synergy-preview": {
    url: "/images/content/materia/oda-rings/synergy-banner-preview.webp",
    poster: "/images/content/materia/oda-rings/synergy-banner-preview-thumb.webp",
    title: { en: "Synergy Forum banner preview", ru: "Превью баннера Synergy" },
    subkind: "photo",
    subject: ["oda-rings", "media-oda-rings-banner"],
  },
  "oda-rings-ig-01": {
    url: "/images/content/materia/oda-rings/ig-01-hero.webp",
    title: { en: "Rings — hero", ru: "Кольца — обложка" },
    subkind: "photo",
    subject: ["oda-rings", "media-oda-rings-story"],
  },
  "oda-rings-ig-02": {
    url: "/images/content/materia/oda-rings/ig-02-wedding.webp",
    title: { en: "Wedding", ru: "Свадьба" },
    subkind: "photo",
    subject: ["oda-rings", "media-oda-rings-story"],
  },
  "oda-rings-ig-03": {
    url: "/images/content/materia/oda-rings/ig-03-sketch.webp",
    title: { en: "Ring sketch", ru: "Эскиз колец" },
    subkind: "sketch",
    subject: ["oda-rings", "media-oda-rings-story"],
  },
  "oda-rings-ig-04": {
    url: "/images/content/materia/oda-rings/ig-04-workshop.webp",
    title: { en: "Workshop · forging", ru: "Мастерская · ковка" },
    subkind: "photo",
    subject: ["oda-rings", "media-oda-rings-story"],
  },
  "oda-rings-ig-05": {
    url: "/images/content/materia/oda-rings/ig-05-model-eeg.webp",
    title: { en: "3D model · EEG traces", ru: "3D-модель · ЭЭГ" },
    subkind: "photo",
    subject: ["oda-rings", "media-oda-rings-story"],
  },
  "oda-rings-ig-06": {
    url: "/images/content/materia/oda-rings/ig-06-hands.webp",
    title: { en: "Hands with rings", ru: "Руки с кольцами" },
    subkind: "photo",
    subject: ["oda-rings", "media-oda-rings-story"],
  },
  "oda-rings-ig-07": {
    url: "/images/content/materia/oda-rings/ig-07-flight.webp",
    title: { en: "Flight to Bali · Jun 2021", ru: "Перелёт на Бали · июн 2021" },
    subkind: "photo",
    subject: ["oda-rings", "media-oda-rings-story"],
  },
  "oda-rings-ig-08": {
    url: "/images/content/materia/oda-rings/ig-08-dream-photo.webp",
    title: { en: "Dream photo session · Nov 2021", ru: "Фотосессия мечты · ноя 2021" },
    subkind: "photo",
    subject: ["oda-rings", "media-oda-rings-story"],
  },
  "oda-rings-ig-09": {
    url: "/images/content/materia/oda-rings/ig-09-lempuyang.webp",
    title: { en: "Mount Lempuyang · Armand", ru: "Лемпуянг · Арманд" },
    subkind: "photo",
    subject: ["oda-rings", "media-oda-rings-story"],
  },
  "fourth-dimension-cover": {
    url: "/images/content/materia/fourth-dimension/fourth-dimension-cover.webp",
    poster: "/images/content/materia/fourth-dimension/fourth-dimension-cover-thumb.webp",
    title: { en: "Fourth Dimension pendant", ru: "Кулон 4-е измерение" },
    subkind: "photo",
    subject: ["fourth-dimension", "media-fourth-dimension-visuals"],
  },
  "fourth-dimension-neuromandala": {
    url: "/images/content/materia/fourth-dimension/neuromandala-source.webp",
    title: { en: "Source neuromandala · ~2 min window", ru: "Исходная нейромандала · окно ~2 мин" },
    subkind: "photo",
    subject: ["fourth-dimension", "media-fourth-dimension-visuals"],
  },
  "fourth-dimension-render-front": {
    url: "/images/content/materia/fourth-dimension/render-front.webp",
    title: { en: "CAD render · front", ru: "Рендер · лицевая" },
    subkind: "photo",
    subject: ["fourth-dimension", "media-fourth-dimension-visuals"],
  },
  "fourth-dimension-render-back": {
    url: "/images/content/materia/fourth-dimension/render-back.webp",
    title: { en: "CAD render · back", ru: "Рендер · оборот" },
    subkind: "photo",
    subject: ["fourth-dimension", "media-fourth-dimension-visuals"],
  },
  "fourth-dimension-photo": {
    url: "/images/content/materia/fourth-dimension/photo-product.webp",
    title: { en: "Product photo · Feb 2023", ru: "Фото изделия · фев 2023" },
    subkind: "photo",
    subject: ["fourth-dimension", "media-fourth-dimension-visuals"],
  },
  "fourth-dimension-tz-pdf": {
    url: "/documents/fourth-dimension-tz-v2.pdf",
    poster: "/images/content/materia/fourth-dimension/fourth-dimension-cover-thumb.webp",
    title: { en: "TZ v2 — pendant & pouch", ru: "ТЗ v2 — кулон и мешочек" },
    subkind: "text",
    subject: ["fourth-dimension", "media-fourth-dimension-tz"],
  },
  "voronka-cover": {
    url: "/images/content/materia/voronka/voronka-cover.webp",
    poster: "/images/content/materia/voronka/voronka-cover-thumb.webp",
    title: { en: "Funnel set · pendant and earrings", ru: "Воронка · кулон и серьги" },
    subkind: "photo",
    subject: ["voronka", "media-voronka-docs"],
  },
  "voronka-neuromandala": {
    url: "/images/content/materia/voronka/neuromandala-source.webp",
    title: { en: "Source neuromandala · dream session", ru: "Исходная нейромандала · сессия «Мечта»" },
    subkind: "photo",
    subject: ["voronka", "media-voronka-docs"],
  },
  "voronka-render-hero": {
    url: "/images/content/materia/voronka/render-hero.webp",
    title: { en: "CAD render · stepped funnel", ru: "Рендер · ступенчатая воронка" },
    subkind: "photo",
    subject: ["voronka", "media-voronka-docs"],
  },
  "voronka-render-exploded": {
    url: "/images/content/materia/voronka/render-exploded.webp",
    title: { en: "Exploded view · four layers", ru: "Взрыв-схема · четыре слоя" },
    subkind: "photo",
    subject: ["voronka", "media-voronka-docs"],
  },
  "voronka-render-section": {
    url: "/images/content/materia/voronka/render-section.webp",
    title: { en: "Section · halved geometry", ru: "Разрез · половинка воронки" },
    subkind: "photo",
    subject: ["voronka", "media-voronka-docs"],
  },
  "voronka-photo-set": {
    url: "/images/content/materia/voronka/photo-set.webp",
    title: { en: "Product photo · full set", ru: "Фото · комплект" },
    subkind: "photo",
    subject: ["voronka", "media-voronka-docs"],
  },
  "voronka-photo-detail": {
    url: "/images/content/materia/voronka/photo-detail.webp",
    title: { en: "Detail · enamel grooves", ru: "Деталь · эмаль в канавках" },
    subkind: "photo",
    subject: ["voronka", "media-voronka-docs"],
  },
  "lighthouse-cover": {
    url: "/images/content/works/lighthouse/lighthouse-cover.webp",
    poster: "/images/content/works/lighthouse/lighthouse-cover-thumb.webp",
    title: { en: "Lighthouse · shaped sections", ru: "Маяк · сечения башни" },
    subkind: "photo",
    subject: ["lighthouse", "media-lighthouse-docs"],
  },
  "lighthouse-alpha": {
    url: "/images/content/works/lighthouse/state-alpha.webp",
    title: { en: "Alpha band only", ru: "Только альфа-ритм" },
    subkind: "photo",
    subject: ["lighthouse", "media-lighthouse-docs"],
  },
  "lighthouse-theta": {
    url: "/images/content/works/lighthouse/state-theta.webp",
    title: { en: "Theta band only", ru: "Только тета-ритм" },
    subkind: "photo",
    subject: ["lighthouse", "media-lighthouse-docs"],
  },
  "lighthouse-blend-1": {
    url: "/images/content/works/lighthouse/blend-multi-1.webp",
    title: { en: "Multi-rhythm blend · 1", ru: "Смесь ритмов · 1" },
    subkind: "photo",
    subject: ["lighthouse", "media-lighthouse-docs"],
  },
  "lighthouse-blend-2": {
    url: "/images/content/works/lighthouse/blend-multi-2.webp",
    title: { en: "Multi-rhythm blend · 2", ru: "Смесь ритмов · 2" },
    subkind: "photo",
    subject: ["lighthouse", "media-lighthouse-docs"],
  },
  "lighthouse-sections": {
    url: "/images/content/works/lighthouse/sections-shaped.webp",
    title: { en: "Tower cross-sections", ru: "Сечения башни" },
    subkind: "photo",
    subject: ["lighthouse", "media-lighthouse-docs"],
  },
  "lighthouse-blended-spin": {
    url: "/media/works/lighthouse/blended-spin.m4v",
    poster: "/images/content/works/lighthouse/blend-multi-2.webp",
    title: { en: "Blended tower · spin", ru: "Blended-башня · вращение" },
    subkind: "video",
    subject: ["lighthouse", "media-lighthouse-video"],
  },
  "lighthouse-spin-twist": {
    url: "/media/works/lighthouse/spin-twist.m4v",
    poster: "/images/content/works/lighthouse/sections-shaped.webp",
    title: { en: "Tower · twist / spin", ru: "Башня · скручивание" },
    subkind: "video",
    subject: ["lighthouse", "media-lighthouse-video"],
  },
  "happiness-cover": {
    url: "/images/content/materia/happiness/happiness-cover.webp",
    poster: "/images/content/materia/happiness/happiness-cover-thumb.webp",
    title: { en: "Happiness snowflake · gift set", ru: "Снежинка Счастье · подарочный набор" },
    subkind: "photo",
    subject: ["happiness", "media-happiness-docs"],
  },
  "happiness-source-emoto": {
    url: "/images/content/materia/happiness/source-emoto-outline.webp",
    title: { en: "Emoto crystal · pendant outline", ru: "Кристалл Эмото · контур кулона" },
    subkind: "photo",
    subject: ["happiness", "media-happiness-docs"],
  },
  "happiness-photo-gift": {
    url: "/images/content/materia/happiness/photo-gift-box.webp",
    title: { en: "Gift box presentation", ru: "Подарочная коробка" },
    subkind: "photo",
    subject: ["happiness", "media-happiness-docs"],
  },
  "happiness-photo-front": {
    url: "/images/content/materia/happiness/photo-front.webp",
    title: { en: "Front · faceted snowflake", ru: "Лицевая сторона" },
    subkind: "photo",
    subject: ["happiness", "media-happiness-docs"],
  },
  "happiness-photo-back": {
    url: "/images/content/materia/happiness/photo-back.webp",
    title: { en: "Back · reverse facets", ru: "Оборотная сторона" },
    subkind: "photo",
    subject: ["happiness", "media-happiness-docs"],
  },
  "mom-baby-cover": {
    url: "/images/content/materia/mom-baby/mom-baby-cover.webp",
    poster: "/images/content/materia/mom-baby/mom-baby-cover-thumb.webp",
    title: { en: "Mom & Baby · Borzikh pendant", ru: "Мама и Малыш · кулон Борзых" },
    subkind: "photo",
    subject: ["mom-baby", "media-mom-baby-docs"],
  },
  "mom-baby-main": {
    url: "/images/content/materia/mom-baby/photo-borzikh-main.webp",
    title: { en: "Borzikh pendant · Batur-like center", ru: "Кулон Борзых · центр как Батур" },
    subkind: "photo",
    subject: ["mom-baby", "media-mom-baby-docs"],
  },
  "mom-baby-parts": {
    url: "/images/content/materia/mom-baby/photo-parts-two-pendants.webp",
    title: { en: "Two pendant parts", ru: "Две части кулона" },
    subkind: "photo",
    subject: ["mom-baby", "media-mom-baby-docs"],
  },
  "mom-baby-leaves": {
    url: "/images/content/materia/mom-baby/photo-on-leaves.webp",
    title: { en: "Pendant on leaves", ru: "Украшение на фоне листьев" },
    subkind: "photo",
    subject: ["mom-baby", "media-mom-baby-docs"],
  },
  "mom-baby-gift-set": {
    url: "/images/content/materia/mom-baby/photo-gift-set.webp",
    title: { en: "Gift set", ru: "Подарочный набор" },
    subkind: "photo",
    subject: ["mom-baby", "media-mom-baby-docs"],
  },
  "mom-baby-rhino": {
    url: "/images/content/materia/mom-baby/rhino-drawing.webp",
    title: { en: "Rhinoceros drawing", ru: "Чертеж Rhinoceros" },
    subkind: "photo",
    subject: ["mom-baby", "media-mom-baby-docs"],
  },
  "mom-baby-baby-leg": {
    url: "/images/content/materia/mom-baby/photo-baby-leg.webp",
    title: { en: "Pendant on baby leg", ru: "Украшение на ножке младенца" },
    subkind: "photo",
    subject: ["mom-baby", "media-mom-baby-docs"],
  },
  "mom-baby-statuette": {
    url: "/images/content/materia/mom-baby/photo-with-statuette.webp",
    title: { en: "Pendant with statuette", ru: "Украшение на фоне статуэтки" },
    subkind: "photo",
    subject: ["mom-baby", "media-mom-baby-docs"],
  },
  "mom-baby-photo-iowa": {
    url: "/images/content/materia/mom-baby/photo-iowa-gift.webp",
    title: { en: "Archive · IOWA gift lineage", ru: "Архив · линия подарка IOWA" },
    subkind: "photo",
    subject: ["mom-baby", "media-mom-baby-docs", "proof-mom-baby-iowa-gift"],
  },
  "mom-baby-brochure-pdf": {
    url: "/documents/mom-baby-brochure-v2.pdf",
    poster: "/images/content/materia/mom-baby/mom-baby-cover-thumb.webp",
    title: { en: "Sasha pendant · brochure PDF", ru: "Кулон «Саша» · буклет PDF" },
    subkind: "text",
    subject: ["mom-baby", "media-mom-baby-brochure"],
  },
  "mom-baby-drawings-pdf": {
    url: "/documents/mom-baby-drawings-v220920.pdf",
    poster: "/images/content/materia/mom-baby/mom-baby-cover-thumb.webp",
    title: { en: "Sasha pendant · drawings v220920", ru: "Кулон «Саша» · чертежи v220920" },
    subkind: "text",
    subject: ["mom-baby", "media-mom-baby-drawings"],
  },
  "emomandala-cover": {
    url: "/images/content/materia/emomandala/emomandala-cover.webp",
    poster: "/images/content/materia/emomandala/emomandala-cover-thumb.webp",
    title: { en: "Emomandala pendant · front", ru: "Кулон Эмомандала · лицевая" },
    subkind: "photo",
    subject: ["emomandala", "media-emomandala-docs"],
  },
  "emomandala-pendant-front": {
    url: "/images/content/materia/emomandala/photo-pendant-front.webp",
    title: { en: "Pendant · front · UV enamel", ru: "Кулон · лицевая · УФ-эмаль" },
    subkind: "photo",
    subject: ["emomandala", "media-emomandala-docs"],
  },
  "emomandala-pendant-back": {
    url: "/images/content/materia/emomandala/photo-pendant-back.webp",
    title: { en: "Pendant · back · QR passport", ru: "Кулон · оборот · QR-паспорт" },
    subkind: "photo",
    subject: ["emomandala", "media-emomandala-docs"],
  },
  "emomandala-mandala-rings": {
    url: "/images/content/materia/emomandala/mandala-ring-sizes.webp",
    title: { en: "Mandala · ring-count variants", ru: "Мандала · варианты колец" },
    subkind: "photo",
    subject: ["emomandala", "media-emomandala-docs"],
  },
  "emomandala-charm-render": {
    url: "/images/content/materia/emomandala/render-charm.webp",
    title: { en: "Charm · CAD render", ru: "Шарм · CAD-рендер" },
    subkind: "photo",
    subject: ["emomandala", "media-emomandala-docs"],
  },
  "emomandala-charm-photo": {
    url: "/images/content/materia/emomandala/photo-charm.webp",
    title: { en: "Charm · product photo", ru: "Шарм · фото изделия" },
    subkind: "photo",
    subject: ["emomandala", "media-emomandala-docs"],
  },
  "emomandala-laser-variations": {
    url: "/images/content/materia/emomandala/laser-material-variations.webp",
    title: { en: "Laser samples · multiple metals", ru: "Лазерные образцы · разные металлы" },
    subkind: "photo",
    subject: ["emomandala", "media-emomandala-docs", "collab-itmo"],
  },
  "emomandala-abundance-palette": {
    url: "/images/content/materia/emomandala/abundance-color-palette.webp",
    title: { en: "Abundance talisman · color palette", ru: "Талисман «Изобилие» · палитра" },
    subkind: "photo",
    subject: ["emomandala", "media-emomandala-docs", "proof-emomandala-abundance"],
  },
};
