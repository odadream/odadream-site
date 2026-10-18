import type { EditorialSection, SourceReference } from './editorial';
export const personalCvSections: Record<string, EditorialSection[]> = {
  daler: [
    {
      id: 'documented-training',
      title: {
        ru: 'Дополнительная подготовка',
        en: 'Additional training',
      },
      body: {
        ru: '2014 — MATLAB Fundamentals, практикум дизайна интерьера БВШД, эксплуатация лазерного оборудования. 2016 — LPKF Rapid Prototyping и основы виброиспытаний Brüel & Kjær; MTCNA получен в 2016 году (исторический сертификат со сроком действия три года). 2018 — семинары KAIZEN по производственным потокам, решению проблем и Lean Foundation.',
        en: '2014: MATLAB Fundamentals, an interior-design workshop at BHSAD and laser-equipment training. 2016: LPKF Rapid Prototyping and Brüel & Kjær vibration testing; MTCNA awarded in 2016 (historical, valid for three years). 2018: KAIZEN seminars in production flow, structured problem solving and Lean Foundation.',
      },
    },
    {
      id: 'personal-credits',
      title: {
        ru: 'Личные подтверждённые достижения',
        en: 'Documented personal credits',
      },
      body: {
        ru: '2018 — благодарность за проактивное мышление и инициативу в региональных проектах; финал команды «Древо знаний» в Hackathon 2025 (конкурс 2018 года). 2021 — письмо МГТУ подтверждает выпуск 2011 года и работу в 2011–2019 годах. 2024 — благодарности спикеру Tech Week и «КОД:Провинции». 2025 — благодарность «Москва 2030» и подтверждение участия в выставке «Комиссия по трёхтысячному году».',
        en: '2018: acknowledgement for initiative in regional projects; finalist with the Tree of Knowledge team in Hackathon 2025 (held in 2018). 2021: BMSTU letter confirms graduation in 2011 and employment in 2011–2019. 2024: speaker acknowledgements from Tech Week and Code of the Province. 2025: Moscow 2030 acknowledgement and documented participation in Commission for the Year Three Thousand.',
      },
    },
  ],
  olga: [
    {
      id: 'documented-training',
      title: {
        ru: 'Дополнительная подготовка',
        en: 'Additional training',
      },
      body: {
        ru: '2014 — «Практикум управления проектами», 32 часа. 2016 — диплом курса аргентинского танго Dana Frigoli. 2018 — семинар «Экспериментальная анатомия. Культура телесности», 24 часа, ИППиП. 2021 — «Аджилити коучинг», 190 часов, включая 20 часов менторинга; документ подтверждает обучение для подготовки к сертификации, а не присвоение ICF ACC.',
        en: '2014: Project Management Workshop, 32 hours. 2016: Dana Frigoli Argentine tango course diploma. 2018: Experimental Anatomy: Culture of Embodiment, a 24-hour IPPiP seminar. 2021: Agility Coaching, 190 hours including 20 hours of mentoring; the document confirms preparatory training, not an ICF ACC credential.',
      },
    },
    {
      id: 'personal-credits',
      title: {
        ru: 'Личные подтверждённые достижения',
        en: 'Documented personal credits',
      },
      body: {
        ru: '2020 — почётная грамота ИСК «ПетроИнжиниринг» за личный вклад в высокие показатели, профессионализм и преданность делу. 2024 — благодарности за выступления на Tech Week и «КОД:Провинции». 2025 — благодарность «Москва 2030» и подтверждение участия в выставке «Комиссия по трёхтысячному году». Эти персональные документы не входят в счётчик признаний ODA.dream.',
        en: '2020: PetroEngineering certificate of honour for personal contribution, professionalism and dedication. 2024: speaker acknowledgements from Tech Week and Code of the Province. 2025: Moscow 2030 acknowledgement and documented participation in Commission for the Year Three Thousand. These personal documents are excluded from the studio recognition count.',
      },
    },
  ],
};
export const personalCvSources: Record<string, SourceReference[]> = {
  daler: [
    {
      file: 'OwnerRecognition/Далер - 2014 Matlab 2.jpg',
      sha256: 'b3b3db9ff9f472bce212d127049e396efdbaf11051c04d947dd2fc7565d456fc',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2014 Matlab.jpg',
      sha256: 'da9f9854760a82194912100e5f396c45a8a7a4a3d3178eb22bae003ba2964ff5',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2014 Бауманка конфа.jpg',
      sha256: '28ee162ec650272a051bc57c9742b5834852e7f4d171ce4987b0e4e5b66968df',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2014 Британка.jpg',
      sha256: '9d229f6c9d25a7231c3cb6bade335e80c0ce7d77008ff5553c5b993e3b74b322',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2014 Лазер.jpg',
      sha256: '3e797ccea986f0862c628ec89db984452c00d1276ef07d8e08517490608d94ec',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2016 LPKF.jpg',
      sha256: '4f0393972c9edc997959396b02ca6debe1c5fb33b237a5cf78e390d74f26cac4',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2016 Mikrotik.jpg',
      sha256: 'fd6fd58669615f2b9ab985278752cf5cd02ce46de4999e9a8a5bf2c5e811a2df',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2016 Испытания.jpg',
      sha256: '554d6d564b5bb53e5b5ada1ebb9fa8774c0671ad9f2ef84cab35084e517748d2',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2016 Электроника.jpg',
      sha256: '249c95fd94bb66e25d6ccee1e47fc1277a717a0bd27d7cc5ad06878b2d54297d',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2017 Edcrunch.pdf',
      sha256: 'cce7aad054be29656d979c67bc72cc02a84b5836a6f269b1f67afa05364a49d9',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2017 MakerFair.jpg',
      sha256: '4a9b719be753a313286a98f8a370ec35df8e417bf54b8ac31a591ab85953c910',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2017 Бережливое.jpg',
      sha256: '0f936d8775e407efe398ca1336c1c2ba4df3b2c7004bfa4613a297c196fa7072',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2017 Тех возможности.jpg',
      sha256: 'a41b346392046b0505497a186d7c4e9e48c7429a7e7c1065b25d955d70cd7d53',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2018 Kaizen 1.jpg',
      sha256: '964931cdf13df3b7aba535346caf14df5740ab8b46f375a0c547a8e55ad92c63',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2018 Kaizen 2.jpg',
      sha256: '812eaa3039fd06e800d5b713f96e1c2e360f48cd206597262df2306dbb2c8f52',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2018 Kaizen 3.jpg',
      sha256: '26731aaa46931772492a3718aa674efeabe3df672a8074da418064e73c3a33ee',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2018 Kaizen 4.jpg',
      sha256: '115b00ee6d8aab1dce45b76d86269c7fa9a95c5982b16675ecde3723bf7bcce7',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2018 Амур.jpg',
      sha256: 'f658bf97e7693209860fe427c2c59636e139302e57df8f0fec8b4332f39bfac7',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2018 НТИ.jpg',
      sha256: '23e0f5cf2f0a1889cb522677b6fe75a26e88e6bce609c40702ce62fde98394d9',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2018 Хакатон.jpg',
      sha256: '8e22f5e603c637da61aa777e2cf23a72ffb071ac1dc4119d5e866be0e0462c15',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Далер - 2021 Благодарность Бауманка.pdf',
      sha256: 'cff1db0320d1f214600d0822e4f160af30f1ac70f944d3711c3a33e54cc77188',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/ODA - 2020 Руками - Далер.pdf',
      sha256: 'a2cdcf215903212eda6aadad49a241a436708641607160ee93e1420f38059253',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/ODA - 2024 TechWeek - Далер.pdf',
      sha256: 'b207e9363eacaf714963fc8f4e40d3fc05b6547c43cfe4734828a45f5cf484ee',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/ODA - 2024 Код провинции - Далер.jpg',
      sha256: '6d0c03ff8e86c77bb5fada393f847f1058c23ffbaae4c69f0447d518916f2918',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/ODA - 2025 Москва 2030 - Далер.png',
      sha256: 'd06570bf751663273f183c741f7e0c37badc9ffe2fff75a011c07f9a36f8e80b',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/ODA - 2025 Частоты - Далер.jpg',
      sha256: '942cf369a6b47eddbfca549e18834a93f985776bd062f717362229366250e2ab',
      snapshot: '2026-10-16',
    },
  ],
  olga: [
    {
      file: 'OwnerRecognition/Оля - 2014 Управления проектами.jpg',
      sha256: '191284695f6ee9a042398eb556ebdf10694361e9d1ab0a4ac07e8b9917e905bb',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Оля - 2016 Танцы.jpg',
      sha256: '7f0c7014c486ea38f4a1fafd03e579e4550aaf417ccb08beae4742edb0164aa8',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Оля - 2018 Фатеева.jpg',
      sha256: 'fcf7660f62c090d92d0e4201ba79cdacb8877ad9467e7f44ae8d22b19dad3c3f',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Оля - 2020 ИСК.jpg',
      sha256: '7d54f76e780f4d3190a251e20bf8e0606de8171a1a7d8d2e8ad3bf1a0773815f',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/Оля - 2021 Коучинг.jpg',
      sha256: '2233421458be2d65ee5ad069e179149274775c2d0537d7464cb3063c8349b6fa',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/ODA - 2024 TechWeek - Оля.pdf',
      sha256: '6fe088392550ebd6f2f613d02bfc8305938ed6137e1e2eaab509aae2e9d2632a',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/ODA - 2024 Код провинции - Оля.jpg',
      sha256: '9509fb5b09fd079d0a9c1cb786d5496b0dff2e770a7e3a1d94641922f80ff4da',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/ODA - 2025 Москва 2030 - Ольга.png',
      sha256: '39fb631ddedc09d963fcc27837e4e22c50826958d1cf4e80a9b92c63bdcee034',
      snapshot: '2026-10-16',
    },
    {
      file: 'OwnerRecognition/ODA - 2025 Частоты - Ольга.jpg',
      sha256: '172c2cb0dab000e31bb8a1c99f312a95800a6701843700051b3d3f00102ab93b',
      snapshot: '2026-10-16',
    },
  ],
};
