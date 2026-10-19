import type { EditorialSection, SourceLink } from './editorial';
interface OwnedSourceLink {
  ownerKind: 'work' | 'education';
  ownerId: string;
  link: SourceLink;
}
// Curated links from V1 media registry; no player, tracker or remote download on page load.
export const archiveSourceLinks: OwnedSourceLink[] = [
  {
    ownerKind: 'work',
    ownerId: 'neurobattle',
    link: {
      id: 'nrbt-gameplay-v9',
      title: {
        ru: 'Парадокс Успеха · архивный геймплей v9',
        en: 'Paradox of Success · archival gameplay v9',
      },
      href: 'https://dzen.ru/embed/o20YLsWwKAAA?autoplay=0&mute=0',
      kind: 'video',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'neurobattle',
    link: {
      id: 'nrbt-dano',
      title: {
        en: 'DANO Olympiad',
        ru: 'Олимпиада DANO',
      },
      href: 'https://dzen.ru/embed/o20ZleGMJAAA?autoplay=0&mute=0',
      kind: 'video',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'neurobattle',
    link: {
      id: 'nrbt-veter',
      title: {
        en: 'Wind of Change · charity gala',
        ru: 'Ветер Перемен · благотворительный вечер',
      },
      href: 'https://dzen.ru/embed/v1ftBaZRQUXU?autoplay=0&mute=0',
      kind: 'video',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'neurobattle',
    link: {
      id: 'nrbt-tnt',
      title: {
        en: 'TNT · You Like Me',
        ru: 'ТНТ · Ты как Я',
      },
      href: 'https://dzen.ru/embed/vY9PlkGfKPUc?autoplay=0&mute=0',
      kind: 'video',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'mindshow',
    link: {
      id: 'mdsh-demo-v5',
      title: {
        ru: 'MindShow · архивное демо v5',
        en: 'MindShow · archival demo v5',
      },
      href: 'https://dzen.ru/embed/o20aog1YJAAA?autoplay=0&mute=0',
      kind: 'video',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'mindshow',
    link: {
      id: 'mdsh-hypercube',
      title: {
        en: 'Hypercube · Portal 2030–2050, Skolkovo',
        ru: 'Гиперкуб · Портал 2030–2050, Сколково',
      },
      href: 'https://dzen.ru/embed/vL3M-cNgfSVo?autoplay=0&mute=0',
      kind: 'video',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'mindshow',
    link: {
      id: 'mdsh-urban-forum',
      title: {
        en: 'RusUrbanForum',
        ru: 'РосУрбанФорум',
      },
      href: 'https://dzen.ru/embed/vYcLmkD5bAxE?autoplay=0&mute=0',
      kind: 'video',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'mindshow',
    link: {
      id: 'mdsh-wildmint',
      title: {
        en: 'Wild Mint Festival',
        ru: 'Дикая Мята',
      },
      href: 'https://dzen.ru/embed/o21sOdHQIAAA?autoplay=0&mute=0',
      kind: 'video',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'mindshow',
    link: {
      id: 'mdsh-ashram',
      title: {
        en: 'Ashram · Natali Osman',
        ru: 'Ashram · Натали Осман',
      },
      href: 'https://dzen.ru/embed/o21s_fHQIAAA?autoplay=0&mute=0',
      kind: 'video',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'mindshow',
    link: {
      id: 'mdsh-bashkiria',
      title: {
        en: 'Shulgan-Tash · digital plein air',
        ru: 'Шульган-Таш · цифровой пленэр',
      },
      href: 'https://dzen.ru/embed/o21tvvnYKAAA?autoplay=0&mute=0',
      kind: 'video',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'mindshow',
    link: {
      id: 'mdsh-terraforming',
      title: {
        en: 'Terraforming — MIPT performance',
        ru: 'Терраформинг — перформанс МФТИ',
      },
      href: 'https://www.youtube.com/watch?v=xUlotjPuXPA',
      kind: 'video',
    },
  },
  {
    ownerKind: 'education',
    ownerId: 'talk-workshop',
    link: {
      id: 'lec-gonchar',
      title: {
        en: 'Nata Gonchar · private neuro-show',
        ru: 'Ната Гончар · частное нейрошоу',
      },
      href: 'https://dzen.ru/embed/vZ6STYjxZhHk?autoplay=0&mute=0',
      kind: 'video',
    },
  },
  {
    ownerKind: 'education',
    ownerId: 'talk-workshop',
    link: {
      id: 'lec-bauman',
      title: {
        en: 'Bauman / Moscow 2030 · brain-hacking lecture',
        ru: 'Бауман / Москва 2030 · лекция о брейнхакинге',
      },
      href: 'https://dzen.ru/embed/o20b-pOkIAAA?autoplay=0&mute=0',
      kind: 'video',
    },
  },
  {
    ownerKind: 'education',
    ownerId: 'talk-workshop',
    link: {
      id: 'lec-ikc',
      title: {
        en: 'ICC Kaluga · masterclass',
        ru: 'ИКЦ Калуга · мастер-класс',
      },
      href: 'https://dzen.ru/embed/v2Wb3fVoWW1A?autoplay=0&mute=0',
      kind: 'video',
    },
  },
  {
    ownerKind: 'education',
    ownerId: 'talk-workshop',
    link: {
      id: 'lec-tskhr',
      title: {
        en: 'TSKhR · neuroaesthetics lecture',
        ru: 'ТСХР · лекция о нейроэстетике',
      },
      href: 'https://dzen.ru/embed/veLb095NOWiA?autoplay=0&mute=0',
      kind: 'video',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'schrodinger',
    link: {
      id: 'schrd-teaser',
      title: {
        en: 'Project Schrödinger · how it was',
        ru: 'Проект Шрёдингер · как это было',
      },
      href: 'https://dzen.ru/video/watch/6845a4440a4ab554ebf00fb0',
      kind: 'video',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'interference',
    link: {
      id: 'intf-radio',
      title: {
        en: 'Interference · Nika FM interview',
        ru: 'Интерференция · интервью «Ника FM»',
      },
      href: 'https://vk.com/wall-220048623_232',
      kind: 'audio',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'theatre-my-name',
    link: {
      id: 'tim-dzen-part-1',
      title: {
        en: 'TIM · Part 1 — Authentic Movement',
        ru: 'ТИМ · ч. 1 — Аутентичное движение',
      },
      href: 'https://dzen.ru/a/Zv7Ih1xeTxz0-AAl',
      kind: 'article',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'theatre-my-name',
    link: {
      id: 'tim-dzen-part-2',
      title: {
        en: 'TIM · Part 2 — Family constellations',
        ru: 'ТИМ · ч. 2 — Расстановки',
      },
      href: 'https://dzen.ru/a/Zv7Jx3oJ7DdDCZtI',
      kind: 'article',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'theatre-my-name',
    link: {
      id: 'tim-dzen-part-3',
      title: {
        en: 'TIM · Part 3 — Playback & psychodrama',
        ru: 'ТИМ · ч. 3 — Плейбек и психодрама',
      },
      href: 'https://dzen.ru/a/ZwOYsUR-qk5GPdQU',
      kind: 'article',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'theatre-my-name',
    link: {
      id: 'tim-dzen-part-4',
      title: {
        en: 'TIM · Part 4 — Metaphorical cards',
        ru: 'ТИМ · ч. 4 — Метафорические карты',
      },
      href: 'https://dzen.ru/a/ZzTCFPdiD0vbmNw6',
      kind: 'article',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'sync',
    link: {
      id: 'sync-video',
      title: {
        ru: 'Синхронизация · архивное демо',
        en: 'Synchronization · archival demo',
      },
      href: 'https://www.youtube.com/watch?v=wRyzTwNqdqQ',
      kind: 'video',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'sync',
    link: {
      id: 'sync-video-lines',
      title: {
        en: 'Sync Circle · synchrony lines',
        ru: 'Круг синхронизации · линии синхронности',
      },
      href: 'https://www.youtube.com/watch?v=FisxaQxfe8c',
      kind: 'video',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'dashran',
    link: {
      id: 'dash-video',
      title: {
        en: 'Darshan Moment · concept video',
        ru: 'Момент Даршана · видео концепции',
      },
      href: 'https://dzen.ru/video/watch/67dc1059b6978c7cceec438d',
      kind: 'video',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'emomandala',
    link: {
      id: 'abundance-process',
      title: {
        ru: 'Талисман «Изобилие» · процесс создания',
        en: 'Abundance talisman · making process',
      },
      href: 'https://t.me/odadream/152',
      kind: 'article',
    },
  },
  {
    ownerKind: 'work',
    ownerId: 'interference',
    link: {
      id: 'interference-recording',
      title: {
        ru: 'Сайт спектакля «Интерференция реальностей»',
        en: 'Interference of Realities performance website',
      },
      href: 'https://interference.odadream.art/',
      kind: 'article',
    },
  },
];
export function sourceSectionsFor(
  ownerKind: OwnedSourceLink['ownerKind'],
  ownerId: string,
): EditorialSection[] {
  const links = archiveSourceLinks
    .filter((row) => row.ownerKind === ownerKind && row.ownerId === ownerId)
    .map((row) => row.link);
  return links.length
    ? [
        {
          id: 'external-materials',
          title: { ru: 'Записи и публикации', en: 'Recordings and publications' },
          body:
            ownerId === 'sync'
              ? {
                  ru: 'Демонстрации метода Нейросинхронизации, на котором основан инсталляционный концепт.',
                  en: 'Demonstrations of the Neurosynchronization method on which the installation concept is based.',
                }
              : {
                  ru: 'Записи показов, интервью и публикации о работе.',
                  en: 'Presentation recordings, interviews and publications about the work.',
                },
          links,
        },
      ]
    : [];
}
