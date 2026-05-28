/**
 * Single source of truth for media assets (videos, images, audio) referenced
 * across content. Change a URL or poster here once → it propagates everywhere
 * via the `![[media:<id>]]` token (resolved at render time by contentProcessor).
 *
 * Each entry holds the canonical URL, optional poster, and a bilingual default
 * title. Inline overrides are still allowed: `![[media:<id> | Custom Label]]`.
 */

export type MediaAsset = {
  url: string;
  poster?: string;
  title?: { en: string; ru: string };
};

export const MEDIA: Record<string, MediaAsset> = {
  // --- Neurobattle / Paradox of Victory ---
  "nrbt-gameplay-v9": {
    url: "https://dzen.ru/embed/o20YLsWwKAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/neurobattle_gameplay.webp",
    title: { en: "Neurobattle · gameplay v9", ru: "Нейробитва · геймплей v9" },
  },
  "nrbt-dano": {
    url: "https://dzen.ru/embed/o20ZleGMJAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/neurobattle_dano.webp",
    title: { en: "DANO Olympiad", ru: "Олимпиада DANO" },
  },
  "nrbt-veter": {
    url: "https://dzen.ru/embed/v1ftBaZRQUXU?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/neurobattle_veter.webp",
    title: { en: "Wind of Change · charity gala", ru: "Ветер Перемен · благотворительный вечер" },
  },
  "nrbt-tnt": {
    url: "https://dzen.ru/embed/vY9PlkGfKPUc?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/neurobattle_tnt.webp",
    title: { en: "TNT · You Like Me", ru: "ТНТ · Ты как Я" },
  },

  // --- MindShow ---
  "mdsh-demo-v5": {
    url: "https://dzen.ru/embed/o20aog1YJAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/mindshow_mdsh_v5.webp",
    title: { en: "MindShow · demo v5", ru: "MindShow · демо v5" },
  },
  "mdsh-hypercube": {
    url: "https://dzen.ru/embed/vL3M-cNgfSVo?from_block=partner&from=zen&mute=1&autoplay=1&tv=0",
    poster: "/images/content/mindshow_portal.webp",
    title: { en: "Hypercube · Portal 2030–2050, Skolkovo", ru: "Гиперкуб · Портал 2030–2050, Сколково" },
  },
  "mdsh-urban-forum": {
    url: "https://dzen.ru/embed/vYcLmkD5bAxE?from_block=partner&from=zen&mute=1&autoplay=1&tv=0",
    poster: "/images/content/mindshow_urban_forum.webp",
    title: { en: "RusUrbanForum", ru: "РосУрбанФорум" },
  },
  "mdsh-wildmint": {
    url: "https://dzen.ru/embed/o21sOdHQIAAA?from_block=partner&from=zen&mute=1&autoplay=1&tv=0",
    poster: "/images/content/mindshow_myata.webp",
    title: { en: "Wild Mint Festival", ru: "Дикая Мята" },
  },
  "mdsh-ashram": {
    url: "https://dzen.ru/embed/o21s_fHQIAAA?from_block=partner&from=zen&mute=1&autoplay=1&tv=0",
    poster: "/images/content/mindshow_ashram.webp",
    title: { en: "Ashram · Natali Osman", ru: "Ashram · Натали Осман" },
  },
  "mdsh-bashkiria": {
    url: "https://dzen.ru/embed/o21tvvnYKAAA?from_block=partner&from=zen&mute=1&autoplay=1&tv=0",
    poster: "/images/content/mindshow_ufa.webp",
    title: { en: "Shulgan-Tash · digital plein air", ru: "Шульган-Таш · цифровой пленэр" },
  },
  "mdsh-metro": {
    url: "/images/content/mindshow_metro_2.webp",
    title: { en: "Moscow metro · digital plein air", ru: "Московское метро · цифровой пленэр" },
  },
  "mdsh-tpp": {
    url: "/images/content/mindshow_tpp.webp",
    title: { en: "CCI RF · Russian Digital Creative", ru: "ТПП РФ · Russian Digital Creative" },
  },

  // --- Lectures (event clips & cover photos) ---
  "lec-gonchar": {
    url: "https://dzen.ru/embed/vZ6STYjxZhHk?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/lectures-gonchar.webp",
    title: { en: "Nata Gonchar · private neuro-show", ru: "Ната Гончар · частное нейрошоу" },
  },
  "lec-bauman": {
    url: "https://dzen.ru/embed/o20b-pOkIAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/lectures-moscow2030.webp",
    title: { en: "Bauman / Moscow 2030 · brain-hacking lecture", ru: "Бауман / Москва 2030 · лекция о брейнхакинге" },
  },
  "lec-ikc": {
    url: "https://dzen.ru/embed/v2Wb3fVoWW1A?from_block=partner&from=zen&mute=0&autoplay=0&tv=0",
    poster: "/images/content/lectures-ikc.webp",
    title: { en: "ICC Kaluga · masterclass", ru: "ИКЦ Калуга · мастер-класс" },
  },
  "lec-tskhr": {
    url: "https://dzen.ru/embed/veLb095NOWiA?from_block=partner&from=zen&mute=1&autoplay=1&tv=0",
    poster: "/images/content/lectures-tshr.webp",
    title: { en: "TSKhR · neuroaesthetics lecture", ru: "ТСХР · лекция о нейроэстетике" },
  },
  "lec-tavrida": {
    url: "/images/content/lectures-tavrida.webp",
    title: { en: "Tavrida.ART · AI festival", ru: "Таврида.АРТ · фестиваль ИИ" },
  },
  "lec-sber": {
    url: "/images/content/lectures-sber.webp",
    title: { en: "Sberbank · science-art lecture", ru: "Сбербанк · science-art лекция" },
  },
  "lec-ashram": {
    url: "/images/content/lectures-ashram.webp",
    title: { en: "Ashram Studio · public talk", ru: "Студия Ashram · публичный talk" },
  },

  // --- Covers / generic ---
  "neuromandala-cover": {
    url: "/images/content/neuromandala-cover.jpg",
    title: { en: "Neuromandala", ru: "Нейромандала" },
  },
  "art-brain-cover": {
    url: "/images/content/art-brain.jpg",
    title: { en: "Art of Brain", ru: "Искусство мозга" },
  },
  "jewellery-cover": {
    url: "/images/content/jewellery.jpg",
    title: { en: "Jewellery objects", ru: "Ювелирные объекты" },
  },
};

