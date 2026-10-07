import type { Localized, Publication } from './site';

export interface SourceReference {
  file: string;
  sha256: string;
  snapshot: string;
}
export interface EditorialSection {
  id: string;
  title: Localized;
  body: Localized;
}
export interface Method {
  id: string;
  legacyId: string;
  title: Localized;
  summary: Localized;
  sections: EditorialSection[];
  steps: EditorialSection[];
  participation: EditorialSection[];
  limitations: Record<'en' | 'ru', string[]>;
  works: string[];
  media: string[];
  sourceRefs: SourceReference[];
  source: string;
  publication: Publication;
}
export interface ParticipationDetail {
  story: Localized;
  participation: Localized;
  outcome: Localized;
  conditions: {
    id: string;
    label: Localized;
    value: Localized;
    state: 'historical' | 'per-brief' | 'conflict';
  }[];
  studioProvides: Record<'en' | 'ru', string[]>;
  venueProvides: Record<'en' | 'ru', string[]>;
  topics: Localized[];
  reviewNotes: Localized[];
  sourceRefs: SourceReference[];
}
export interface CooperationPage {
  id: string;
  legacyId: string;
  title: Localized;
  summary: Localized;
  scenarios: (EditorialSection & {
    request: Localized;
    configurationIds: string[];
    programmeIds: string[];
  })[];
  modes: EditorialSection[];
  process: EditorialSection[];
  studioProvides: Record<'en' | 'ru', string[]>;
  venueProvides: Record<'en' | 'ru', string[]>;
  briefFields: Localized[];
  sourceRefs: SourceReference[];
  source: string;
  publication: Publication;
}

// Exact bytes of dated V1 and owner-provided editorial snapshots, not current availability claims.
export const sourceSnapshots: Record<string, SourceReference> = {
  'org-merck.md': {
    file: 'org-merck.md',
    sha256: '3ae16c99e3a42a3804ac619f2310c0ab745e5c9f6e5b0d20fec6f51524ac34ce',
    snapshot: '2026-10-07',
  },
  'proof-let-bashkiria.md': {
    file: 'proof-let-bashkiria.md',
    sha256: '2d22029b2649b1a0dbf812acf03a12e08fd230c07f91fe4113f3af9d3433e05e',
    snapshot: '2026-10-07',
  },
  'proof-press-tskhr-bashkiria.md': {
    file: 'proof-press-tskhr-bashkiria.md',
    sha256: 'f3519304910cb11d7f1bbc07bf6aaa68a8ac5137fcc9137a4750b6e31f08083c',
    snapshot: '2026-10-07',
  },
  'proof-press-ntv-metro.md': {
    file: 'proof-press-ntv-metro.md',
    sha256: '0c92923e3d08eec5adfe3724514cb11cea45e45ad929390c548e3869a4455eb7',
    snapshot: '2026-10-07',
  },

  'event-ashram-birthday-2024.md': {
    file: 'event-ashram-birthday-2024.md',
    sha256: '56f2d859100bc5c4f0a006592af2ce1c7a1ce5978e05c48368e76acaaa44dd59',
    snapshot: '2026-10-07',
  },
  'event-ashram-tim.md': {
    file: 'event-ashram-tim.md',
    sha256: '50f820c87d5d1503fa67ced2539180473b9ae5b681e9aea85abaf27d40a71952',
    snapshot: '2026-10-07',
  },
  'event-audi-brand-2024.md': {
    file: 'event-audi-brand-2024.md',
    sha256: '5efae18508eec59b4e59b34c1a3a9d42051d14ef2b9be58b7ba07fe798f60be6',
    snapshot: '2026-10-07',
  },
  'event-bauman-moscow2030-2025.md': {
    file: 'event-bauman-moscow2030-2025.md',
    sha256: '3440b118ba5ba4bb03ef8a65b22433c0acf3dbca7809168b9f5448b91139788f',
    snapshot: '2026-10-07',
  },
  'event-bitva-milliard-2024.md': {
    file: 'event-bitva-milliard-2024.md',
    sha256: 'cb2f255a8c1e74baf7180f6cc962b8d941bba48a6f04cf3c223cb1846fc12d11',
    snapshot: '2026-10-07',
  },
  'event-brics-plus.md': {
    file: 'event-brics-plus.md',
    sha256: 'b4714caaaa659980fa0d4a94c8f795311cd1dae77b59e46584dbb4cc02858aaf',
    snapshot: '2026-10-07',
  },
  'event-byob.md': {
    file: 'event-byob.md',
    sha256: 'a72e66836a521be021775ff55fb3dbc37002cca5af3b3efbb15f277138ba7331',
    snapshot: '2026-10-07',
  },
  'event-byob-2019.md': {
    file: 'event-byob-2019.md',
    sha256: 'a56707d5ed6478a2bdaea7cd9eb6dfd1ef81f0d2f05ba65faceeb694f264c9a4',
    snapshot: '2026-10-07',
  },
  'event-byob-2020.md': {
    file: 'event-byob-2020.md',
    sha256: 'a86ae37d6bae492273c5a37ba3e02112b1df72d722a07968240e67e7fb7a5f29',
    snapshot: '2026-10-07',
  },
  'event-gonchar-private-2024.md': {
    file: 'event-gonchar-private-2024.md',
    sha256: '05ab0a96dcce3dc84dbaa433c9df0ab684eb0363afcf93e05d6d2820816e2934',
    snapshot: '2026-10-07',
  },
  'event-gong-fest.md': {
    file: 'event-gong-fest.md',
    sha256: '9a854f621f3db8040006f1dc741b84cb60c3bd78c560f990d6d5e8b0c98759ab',
    snapshot: '2026-10-07',
  },
  'event-gong-fest-2024.md': {
    file: 'event-gong-fest-2024.md',
    sha256: '33491ce50f1b290d31e39028f34b8b5a901ffcf31ecb98ba3973147296a18d33',
    snapshot: '2026-10-07',
  },
  'event-gong-fest-2025.md': {
    file: 'event-gong-fest-2025.md',
    sha256: '0a09f298a6198429b97e77605beff38bf05fd0f17130a893a6dc3298b5ac14c8',
    snapshot: '2026-10-07',
  },
  'event-itb-lab-2024-11.md': {
    file: 'event-itb-lab-2024-11.md',
    sha256: 'f6be722e96737e0172a801989e7fd3570d49921160ffa6a639ee9354a51821f8',
    snapshot: '2026-10-07',
  },
  'event-kod-provincii.md': {
    file: 'event-kod-provincii.md',
    sha256: 'e32a5397f0e905427e2eced5eb2bf15c8a001cfb1fa6bea08043056174efcc5d',
    snapshot: '2026-10-07',
  },
  'event-korablik-2020.md': {
    file: 'event-korablik-2020.md',
    sha256: '5f8c0e3375d9bb34cff2057172dd678d6529d56aaa80a69c8705592c1a84ed55',
    snapshot: '2026-10-07',
  },
  'event-lamborghini-brand-2024.md': {
    file: 'event-lamborghini-brand-2024.md',
    sha256: 'e4e95c03c7f15b604495e646e396eabb48dbb25f15bc7b70440c12950a796629',
    snapshot: '2026-10-07',
  },
  'event-merck-corporate.md': {
    file: 'event-merck-corporate.md',
    sha256: '613d094041ce19ce81ac419f3c5fcf664e8a00437ba4c81db3c69f09a038474f',
    snapshot: '2026-10-07',
  },
  'event-pleinair-bashkiria-2025.md': {
    file: 'event-pleinair-bashkiria-2025.md',
    sha256: '1fe0b69012db966e7f13cc645402fdc4734682586201897b4ecdce0d09e83f1d',
    snapshot: '2026-10-07',
  },
  'event-pleinair-metro-2024.md': {
    file: 'event-pleinair-metro-2024.md',
    sha256: '9595703d8f1ce2edcd649925897d9f8115d457fc327e2a740cdbe088b1c65e48',
    snapshot: '2026-10-07',
  },
  'event-portal.md': {
    file: 'event-portal.md',
    sha256: 'e456d764a42b8c94062f316e4bca79351926b786fe1a56eb8cb55f620a272dcb',
    snapshot: '2026-10-07',
  },
  'event-portal-2024.md': {
    file: 'event-portal-2024.md',
    sha256: 'd4ce4ae350b1a6a5a9a43928c4e506dcab08ce4ea8020ad611da3e8262fede1a',
    snapshot: '2026-10-07',
  },
  'event-tavrida-ai-2025.md': {
    file: 'event-tavrida-ai-2025.md',
    sha256: '2854c5acc27d251c5d65655b687d7a252a4bf16025f539eb2797d36a9f7bdc28',
    snapshot: '2026-10-07',
  },
  'event-techweek.md': {
    file: 'event-techweek.md',
    sha256: 'fce4833daf6ff06d6fdaf70092d0e27760e0e7d38f9a899b06666e8870b1caac',
    snapshot: '2026-10-07',
  },
  'event-tpp-mindshow-2025.md': {
    file: 'event-tpp-mindshow-2025.md',
    sha256: '90ae4e8842bf7a3b8bd05f19b277acbe3ce58e1f7d6d40393c36eaaa34fd6a2f',
    snapshot: '2026-10-07',
  },
  'event-tsiolkovsky.md': {
    file: 'event-tsiolkovsky.md',
    sha256: 'f888c2e572c0bdaa689ae530e96bd78c06c7cab9632bed87fd08e793571d8ddc',
    snapshot: '2026-10-07',
  },
  'unique-russia.md': {
    file: 'unique-russia.md',
    sha256: '4b33a58d4ac65ee85e07f36af8d750c59782b036df2778fa42794425767c2548',
    snapshot: '2026-10-07',
  },
  'Golem_Event_Ashram_2024.md': {
    file: 'Golem_Event_Ashram_2024.md',
    sha256: 'a2b3ee13c67fac54178ccb87e2c3582e2e59cb67b15acd0e368477a79695918c',
    snapshot: '2026-10-07',
  },
  'Golem_Event_Audi_2020.md': {
    file: 'Golem_Event_Audi_2020.md',
    sha256: '323dfe27efcdfe884fae6e58a876fb996507b5af4dd5727ec8fc284755a700b0',
    snapshot: '2026-10-07',
  },
  'Golem_Event_Gong_2024.md': {
    file: 'Golem_Event_Gong_2024.md',
    sha256: 'bb533741b045335c50160a911c31a297e7d6a2d74ba27b04c72d0f861f686cbc',
    snapshot: '2026-10-07',
  },
  'Golem_Event_Gong_2025.md': {
    file: 'Golem_Event_Gong_2025.md',
    sha256: '6bd55838e230925e8cb17c1d5b505ab839177850be7faadbd420ee689827be2b',
    snapshot: '2026-10-07',
  },
  'Golem_Event_Terraforming_2025.md': {
    file: 'Golem_Event_Terraforming_2025.md',
    sha256: 'baa78d96680d5cc8157163b136f946b427c65f87869e894212e7c7e086921795',
    snapshot: '2026-10-07',
  },
  'Golem_Event_Tavrida_AI_2025.md': {
    file: 'Golem_Event_Tavrida_AI_2025.md',
    sha256: '46d379b4c959636cf7f70a01ee5eb0d51ba314c79e313d83e98cf700e0404222',
    snapshot: '2026-10-07',
  },
  'Golem_Event_TechWeek_2024.md': {
    file: 'Golem_Event_TechWeek_2024.md',
    sha256: 'c8995c569b92aad4457dbe9c647d290033afcddbedf755073f57d25df7f126b3',
    snapshot: '2026-10-07',
  },
  'Golem_Event_Battle_Billion_2024.md': {
    file: 'Golem_Event_Battle_Billion_2024.md',
    sha256: '8409deaf5b31eb49217f0fb2a6fd45a24b1cf00fe4fda05e23d691ee56e48727',
    snapshot: '2026-10-07',
  },
  'Golem_Event_Unique_Russia_2026.md': {
    file: 'Golem_Event_Unique_Russia_2026.md',
    sha256: 'ece0582f039b5bc9574057ec1662e2f39a4ef17a34ed50bab922f8befb94c0fa',
    snapshot: '2026-10-07',
  },
  'Golem_Telegram_Lamborghini.json': {
    file: 'Golem_Telegram_Lamborghini.json',
    sha256: '55246123ce95ba4cff35e8caa4f2cbc532b83886a41f8645566684f4dcadd4d1',
    snapshot: '2026-10-07',
  },

  'multisync.md': {
    file: 'multisync.md',
    sha256: 'b20b33f486d9275c84aea8dcc36fdc99c3f1c8b70f16d116b606decc9faf86e8',
    snapshot: '2026-10-07',
  },
  'another-people.md': {
    file: 'another-people.md',
    sha256: 'c86255153891004552e8ee7a831674568c315c38468e97d0935a4e76d14ff5cc',
    snapshot: '2026-10-07',
  },
  'dashran.md': {
    file: 'dashran.md',
    sha256: 'b810a523a89a8546fa8821e2d3dceed2f95f002db19f9c19198a97989efcb6b8',
    snapshot: '2026-10-07',
  },
  'fourth-dimension.md': {
    file: 'fourth-dimension.md',
    sha256: 'e9ee2286ddd413a345d1a4b3d21a83488f31c1065c4a3ee7bb4592a3a6bfa4b8',
    snapshot: '2026-10-07',
  },
  'mom-baby.md': {
    file: 'mom-baby.md',
    sha256: '8fa3cefd1b16af4e0bbe37ab1b0de0a23ca7842e0d9a8dc34db38fbaf4250d0e',
    snapshot: '2026-10-07',
  },
  'happiness.md': {
    file: 'happiness.md',
    sha256: '6d75c2c2a5b7dca88e66773ff9d741cf09511da492da067fbae0e5b776744aff',
    snapshot: '2026-10-07',
  },
  'voronka.md': {
    file: 'voronka.md',
    sha256: '12c02692eded4af9a3dae2af337f2ccc3bc02e44953c6abd7b64f71c4c820f98',
    snapshot: '2026-10-07',
  },
  'lighthouse.md': {
    file: 'lighthouse.md',
    sha256: 'c7a9c8122737fc5a2f48fc63d208a53a039d6a3f665aa8a0f46fd489e3f289ff',
    snapshot: '2026-10-07',
  },
  'potustoronniy.md': {
    file: 'potustoronniy.md',
    sha256: '5176229008c5cf339b72e0485c414056302efdd1a8ce331a6b73319f00bd297b',
    snapshot: '2026-10-07',
  },
  'honors.md': {
    file: 'honors.md',
    sha256: '2ae359bdd7cbb24aa8b2e7b11065d3379840526cb3e4eeaaade98361973250c0',
    snapshot: '2026-10-07',
  },
  'theatre-my-name.md': {
    file: 'theatre-my-name.md',
    sha256: 'd68e41bb4f46e7c4457db74233f18e2bef0aa0bc472ba54cc1524b66f1bd6dd0',
    snapshot: '2026-10-07',
  },
  'cultural-neuro-code.md': {
    file: 'cultural-neuro-code.md',
    sha256: '4c7f4a1c058baaba2056dd06d1b340616cf63e2dbf919de2d77cac43ac423168',
    snapshot: '2026-10-07',
  },
  'brain-hack.md': {
    file: 'brain-hack.md',
    sha256: 'adb2f3a84f0a944581cf7c4d60d3ab7cf3e1f174303ad02659646bee7c7e580c',
    snapshot: '2026-10-07',
  },
  'journey.md': {
    file: 'journey.md',
    sha256: '6d5b8a8886f6646cbf25ed0dce180a949f360bddde0dc71158c8ff26956fbc95',
    snapshot: '2026-10-07',
  },
  'Golem_Work_Roles.json': {
    file: 'Golem_Work_Roles.json',
    sha256: '4ed3247ce620e8c9101557ba3b01f1622bc487078313fb85dcb9acf0bb6938d1',
    snapshot: '2026-10-07',
  },
  'Ossetia_2025_Golem_Source.md': {
    file: 'Ossetia_2025_Golem_Source.md',
    sha256: '7d81a0d0faa1fb6ee5655f77bf370f9bbc344fb3030955a059590e4b1bf225e5',
    snapshot: '2026-10-07',
  },

  'beautiful-brain.md': {
    file: 'beautiful-brain.md',
    sha256: '8506aa9cf6bbcb3e283f807b1d3b44e9606fa27ee9010eddf460ee4a6ff9fe81',
    snapshot: '2026-10-07',
  },
  'neuroaesthetics-lec.md': {
    file: 'neuroaesthetics-lec.md',
    sha256: '9cd85af87006acf612703cd34c842e8666a062f22276db03ec1f2561b1f98048',
    snapshot: '2026-10-07',
  },
  'sound-brain.md': {
    file: 'sound-brain.md',
    sha256: 'd91a3061003393265021e51d55a109afae5df2def49c67a115ca92e6c6dffe23',
    snapshot: '2026-10-07',
  },
  'taste-brain.md': {
    file: 'taste-brain.md',
    sha256: 'a8802e9082d05bbb292866396e92bd32eb9787257a57b8628aea8ce7c62d6764',
    snapshot: '2026-10-07',
  },
  'feedback-empathy-brain.md': {
    file: 'feedback-empathy-brain.md',
    sha256: '1fffeb3417a8550b6d9db0a534c15294360eafc5662309644d370797d49330e7',
    snapshot: '2026-10-07',
  },
  'gong.md': {
    file: 'gong.md',
    sha256: '8d7e6a3fdd64527a44e151fcb6195a4cd8ca0ad50579b9a8c6d45b724e19200b',
    snapshot: '2026-10-07',
  },
  'Olga_Arabova_CV.md': {
    file: 'Olga_Arabova_CV.md',
    sha256: '2966e4351153df8bb69ef364bfaa8bd3fdb0cb5a5172bc025d426de6614192dd',
    snapshot: '2026-10-06',
  },
  'Daler_Arabov_CV.md': {
    file: 'Daler_Arabov_CV.md',
    sha256: '1b885da92ecf1da2d8fe07d9a0c8f5672e3c0a7444bcf2918a84f4f25e1db6ae',
    snapshot: '2026-10-06',
  },

  'neuromandala.md': {
    file: 'neuromandala.md',
    sha256: '273d875e1851366b5587e8331265e90c2fb5a5b56392b4cdf49bc2226c621457',
    snapshot: '2026-10-06',
  },
  'mindshow.md': {
    file: 'mindshow.md',
    sha256: '2f1ec367646d8a7bc439ce55ec4e96454bbec005807d4c535f8335b0e03d5ffa',
    snapshot: '2026-10-06',
  },
  'neurobattle.md': {
    file: 'neurobattle.md',
    sha256: '4d8e095213544cda0de10d4450ed4f1714a95917b66ef69fadcd3f52655ecc98',
    snapshot: '2026-10-06',
  },
  'hub-host-events.md': {
    file: 'hub-host-events.md',
    sha256: 'ad1457377cb0f05148e726ac485cdfebcbb4ac7fb8886fd933a3a844a27e500e',
    snapshot: '2026-10-06',
  },
  'hub-lectures.md': {
    file: 'hub-lectures.md',
    sha256: '8640c12613c002b01bbe5ee7c54bf202d647c979ea4ba3e2f22078d8cfb411f4',
    snapshot: '2026-10-06',
  },
  'hub-collab.md': {
    file: 'hub-collab.md',
    sha256: '12f7d5307ee36168fca26eeef06ef7545e241ae02327d84b1e72250398ee1fef',
    snapshot: '2026-10-06',
  },
  'hub-institutions.md': {
    file: 'hub-institutions.md',
    sha256: '4c7c7585fca2fd1bcc25a3fb3e8686ffe24015df29e77ed7ec5c0a6f83449cb9',
    snapshot: '2026-10-06',
  },
  'hub-galleries.md': {
    file: 'hub-galleries.md',
    sha256: '589b5f9d9f1f8358fac90af050129f2f80e7de67ba202882f8e71b39312973ee',
    snapshot: '2026-10-06',
  },
  'hub-event-agencies.md': {
    file: 'hub-event-agencies.md',
    sha256: 'a2ad89edc59edfb4486e4a253b8abc1f0dba1da17af009644cd053b515019491',
    snapshot: '2026-10-06',
  },
  'hub-business.md': {
    file: 'hub-business.md',
    sha256: '0707d9a96cf473bd57671644b8250069ef60f2537259381480663e5fb5d73440',
    snapshot: '2026-10-06',
  },
  'hub-education.md': {
    file: 'hub-education.md',
    sha256: '9ddef4b4459c23304b1c5568f08b7c066587043439bf5183caa265b52b4670ae',
    snapshot: '2026-10-06',
  },
  'hub-creators.md': {
    file: 'hub-creators.md',
    sha256: '355a1b04f6fcb97bc7fc82622acf0c403054ecf237b4fee9aac0afec364fdff4',
    snapshot: '2026-10-06',
  },
  'neurosync.md': {
    file: 'neurosync.md',
    sha256: '965010bb4daf6292719a2d05a46b5431d04f946d0640580b39a22dc73c0cf2c8',
    snapshot: '2026-10-06',
  },
  'interference.md': {
    file: 'interference.md',
    sha256: '635a13274ff2b9e8d98d470464efe758a30d0b60e1c9db2a2d4aeb1d8118333e',
    snapshot: '2026-10-06',
  },
  'schrodinger.md': {
    file: 'schrodinger.md',
    sha256: '6cbf183b79cbf422b2230a1e676f337c0eb9c9e1f792f2600b0fab2fb44845cd',
    snapshot: '2026-10-06',
  },
  'oda-rings.md': {
    file: 'oda-rings.md',
    sha256: '9efd555b796918ae7206bc5b36ff2ca4d919b9bfd28ae8e418e6c53f3a3214fa',
    snapshot: '2026-10-06',
  },
  'media-oda-rings-story.md': {
    file: 'media-oda-rings-story.md',
    sha256: '6486812194330172ddd7434181bd8867ce7ff3a7776416083d89085abe5f3e8a',
    snapshot: '2026-10-06',
  },
  'emomandala.md': {
    file: 'emomandala.md',
    sha256: 'e68e539158480d3c1ea9573fca543008cf32164daaaf143e6a0c78c3a26b640b',
    snapshot: '2026-10-06',
  },
  'emomandala-os.md': {
    file: 'emomandala-os.md',
    sha256: '7c2036536bd9e54decc4342816af2729dbc1156e1cb5a5e9f692522400eecda9',
    snapshot: '2026-10-06',
  },
  'sync-circle.md': {
    file: 'sync-circle.md',
    sha256: '3578b0c23ad53ef52ac2b8f25bbafdac751a5ba16e757fd09ddec1b8dd42538d',
    snapshot: '2026-10-06',
  },
  'ancestors.md': {
    file: 'ancestors.md',
    sha256: 'e5abe407a26962672638b83847acd894d008d7b4fecc52e418c3040e92c210eb',
    snapshot: '2026-10-06',
  },
  'hub-cv.md': {
    file: 'hub-cv.md',
    sha256: '6386eb90ddae81ad262c97580849703a7627069ea6c8a103e29aaf4eed0f1c6e',
    snapshot: '2026-10-06',
  },
  'hub-manifesto.md': {
    file: 'hub-manifesto.md',
    sha256: 'c4f600813ecadde929a6547e04eda26ed53720b0dfc74b2567d5edbccdf26eb4',
    snapshot: '2026-10-06',
  },
  'event-hse-beautiful-brain-2025.md': {
    file: 'event-hse-beautiful-brain-2025.md',
    sha256: 'faabc98a69ed979bd1ef47c80de439ea529acaf247d6aa527d4a656f74eea5f4',
    snapshot: '2026-10-06',
  },
  'event-sber-lecture-2025.md': {
    file: 'event-sber-lecture-2025.md',
    sha256: '28d62adfd4ba872753ae9f493025d6d41c56915b4df13238223ec142ec5698c8',
    snapshot: '2026-10-06',
  },
  'event-mipt-terraforming-2025.md': {
    file: 'event-mipt-terraforming-2025.md',
    sha256: '7e457443d870a3c473b79a399d583f6cd313be34317eb067f4f357116fdf8324',
    snapshot: '2026-10-06',
  },
  'event-tsiolkovsky-2026.md': {
    file: 'event-tsiolkovsky-2026.md',
    sha256: '51ed45eb5ba2516b29efb59c50f5fc564b63c0e88e253ebe9816d886b4935e31',
    snapshot: '2026-10-06',
  },
  'event-tsiolkovsky-2025.md': {
    file: 'event-tsiolkovsky-2025.md',
    sha256: '93ff388a0afa6fd40f1e50eef3549a7bb4764bef26db28ad1a9731936656a6ae',
    snapshot: '2026-10-06',
  },
  'event-dano-ekoniva-2025.md': {
    file: 'event-dano-ekoniva-2025.md',
    sha256: '10c72da82b3b50203219ab086cd8bce286ba578e6d1eb8301b53b8574294f4a5',
    snapshot: '2026-10-06',
  },
  'event-byob-2026.md': {
    file: 'event-byob-2026.md',
    sha256: '1bca3361594638165e795284518c4bf6fe33262f94f23c4e04f75050bc2009fb',
    snapshot: '2026-10-06',
  },
  'event-portal-2025.md': {
    file: 'event-portal-2025.md',
    sha256: '838dcff35d2615a0817bfbee1d99baeb3ff0777792b68d548072b18b1cc8f302',
    snapshot: '2026-10-06',
  },
  'proof-award-portal-visioning.md': {
    file: 'proof-award-portal-visioning.md',
    sha256: '3e58790c95fd528240e7073e88c604af2cab639a8e4d12fe5e7d868e6b813602',
    snapshot: '2026-10-06',
  },
  'event-myata-2025.md': {
    file: 'event-myata-2025.md',
    sha256: 'f2a2a01c03293a1ddc95d2ab8f8014c125fc48e022c5f7b0345247ab8ae01d9d',
    snapshot: '2026-10-06',
  },
  'proof-let-wildmint.md': {
    file: 'proof-let-wildmint.md',
    sha256: '0c31e831894a652618ba381ffb75c48d81c5777639ebf179f816d0e0113f00bc',
    snapshot: '2026-10-06',
  },
  'event-cipr-mindshow-2026.md': {
    file: 'event-cipr-mindshow-2026.md',
    sha256: '587eebd47098e6f9b2f86da80b0d34942394f441187b75dffd95be38e1f788cc',
    snapshot: '2026-10-06',
  },
  'proof-tst-cipr-techfriendly.md': {
    file: 'proof-tst-cipr-techfriendly.md',
    sha256: '2e3d1f89c5d3e55c47992d6890fef5c0b30f56d0047e6a5f7f585264872babdd',
    snapshot: '2026-10-06',
  },
  'hub-letters.md': {
    file: 'hub-letters.md',
    sha256: 'f1b6541f16a38346a46bb3b33f92415edce96b850c1cdd0399c0640e95bb4705',
    snapshot: '2026-10-06',
  },
  'proof-mipt-letter.md': {
    file: 'proof-mipt-letter.md',
    sha256: '6e0713a7014d65b8e374471c248349f46f288fd329fab9dbdbab2a88ab83d14a',
    snapshot: '2026-10-06',
  },
  'proof-let-tavrida.md': {
    file: 'proof-let-tavrida.md',
    sha256: '1be420106451eca6a000e985259684cdb0c35b221e510a5bdbbe1ecc1bf386bc',
    snapshot: '2026-10-06',
  },
  'proof-let-hse-beautiful-brain.md': {
    file: 'proof-let-hse-beautiful-brain.md',
    sha256: 'af359fd754fac9ccfbb13837f339a2df0db22db29fb6ff299b510485d59acfdb',
    snapshot: '2026-10-06',
  },
  'org-kalashnikova.md': {
    file: 'org-kalashnikova.md',
    sha256: 'b4ac17971ff4a83b0b06ec318d4f90619efbcc3bd873701a8acfcea197e6579b',
    snapshot: '2026-10-06',
  },
  'org-ashram.md': {
    file: 'org-ashram.md',
    sha256: '6e2f945c50b65ccac27eb6ef859934ddb66d149db28d3ff6014027d3f2e88951',
    snapshot: '2026-10-06',
  },
  'media-oda-rings-drawings.md': {
    file: 'media-oda-rings-drawings.md',
    sha256: '5dcee125dab875ae7a1a41c96c79986f51158bc9af94ae2df23267530bf71940',
    snapshot: '2026-10-06',
  },
  'media-oda-rings-banner.md': {
    file: 'media-oda-rings-banner.md',
    sha256: '1f33aaff1eb64014e3aedc59ca79d55032909a06f75b9309c97380c9243b7f15',
    snapshot: '2026-10-06',
  },
};
const refs = (...files: string[]) => files.map((file) => sourceSnapshots[file]);
const l = (ru: string, en: string): Localized => ({ ru, en });

export const methods: Method[] = [
  {
    id: 'neuromandala',
    legacyId: 'neuromandala',
    title: l('Нейромандала', 'Neuromandala'),
    summary: l(
      'Нейромандала — авторская система ODA.dream: параметры биосигналов участвуют в создании изображения, звука и художественной среды. Участник наблюдает отклик и становится соавтором процесса.',
      'Neuromandala is ODA.dream’s system for using biosignal parameters to shape image, sound and an artistic environment. A participant observes its response and becomes a co-author of the process.',
    ),
    sections: [
      {
        id: 'method-overview',
        title: l('Метод и художественная позиция', 'Method and artistic position'),
        body: l(
          'Нейромандала связывает измерение, художественные правила и участие человека. Это общий технологический и художественный слой разных произведений, а не отдельное событие или универсальный пакет заказа. История показов относится к работам и конкретным кейсам. MultiSync / гиперсканирование обозначает связанный контур одновременной записи нескольких ЭЭГ-потоков и сопоставления исследовательских маркеров для коллективной визуальной, световой или звуковой среды.',
          'Neuromandala connects measurement, artistic rules and human participation. It is a shared technological and artistic layer across works, rather than an event or a universal commission package. Presentation history belongs to artworks and specific cases. MultiSync / hyperscanning denotes a related system for simultaneously capturing several EEG streams and juxtaposing research markers for collective visual, light or sound environments.',
        ),
      },
      {
        id: 'visual-language',
        title: l('Что видно на экране', 'What appears on screen'),
        body: l(
          'Изменения параметров могут влиять на движение, ритм, цвет и композицию. Орнаментальные и абстрактные формы — художественный перевод, заданный конкретной конфигурацией. В некоторых версиях MindShow участник добавляет словесный рассказ, из которого развивается отдельный образный слой. Готовый видеопример показывает эту визуальную логику, а не текущий сигнал посетителя сайта.',
          'Changes in parameters can affect movement, rhythm, colour and composition. Ornamental and abstract forms are an artistic mapping defined by a specific configuration. In some MindShow versions, the participant adds a verbal narrative that develops into a separate imagery layer. A recorded example shows this visual logic, not a live signal from the website visitor.',
        ),
      },
      {
        id: 'encounter',
        title: l('Роль участника', 'The participant’s role'),
        body: l(
          'В центре работы — встреча человека с отзывчивой средой: наблюдение, внимание, рассказ и взаимодействие с другими. Участие с датчиком, роль зрителя и возможность входа без измерения определяются для каждого формата. Нейроинтерфейс — часть художественной ситуации, а не тест личности.',
          'The work centres on an encounter with a responsive environment: observation, attention, narrative and interaction with others. Sensor participation, the audience role and participation without measurement are specified for each format. The neural interface is part of an artistic situation, not a personality test.',
        ),
      },
    ],
    steps: [
      {
        id: 'signal',
        title: l('Сигнал', 'Signal'),
        body: l(
          'Датчик регистрирует ограниченные физиологические параметры. В ЭЭГ-конфигурациях исходным материалом служит электрическая активность мозга.',
          'A sensor records limited physiological parameters. EEG configurations use electrical brain activity as their source material.',
        ),
      },
      {
        id: 'mapping',
        title: l('Художественное правило', 'Artistic rule'),
        body: l(
          'Выбранные параметры связываются с характеристиками изображения или звука. Правило задаёт произведение, а не универсальная интерпретация состояния человека.',
          'Selected parameters are mapped to image or sound characteristics. The rule is defined by the artwork, not by a universal interpretation of a person’s state.',
        ),
      },
      {
        id: 'render',
        title: l('Отзывчивая среда', 'Responsive environment'),
        body: l(
          'Генеративная система меняет композицию во времени. Подготовленный видеоряд и живой отклик различаются в подписях материалов.',
          'The generative system changes the composition over time. Captions distinguish recorded footage from a live response.',
        ),
      },
      {
        id: 'feedback',
        title: l('Обратная связь', 'Feedback'),
        body: l(
          'Участник видит или слышит изменения, исследует их и влияет на развитие ситуации своим участием.',
          'The participant sees or hears changes, explores them and contributes to how the situation develops.',
        ),
      },
    ],
    participation: [
      {
        id: 'individual',
        title: l('Индивидуальное участие', 'Individual participation'),
        body: l(
          'В MindShow один человек проходит сессию наблюдения и, в зависимости от версии, добавляет личный рассказ. Результат может стать цифровым артефактом.',
          'In MindShow, one person enters an observation session and may add a personal narrative, depending on the version. The result can become a digital artefact.',
        ),
      },
      {
        id: 'group',
        title: l('Совместное поле', 'Shared field'),
        body: l(
          'В «Нейросинхронизации» и сценических работах взаимодействие нескольких людей становится частью общего визуального процесса. Число измеряемых участников и число зрителей — разные параметры.',
          'In Neurosynchronization and stage works, interaction among several people becomes part of a shared visual process. The number of measured participants differs from the audience size.',
        ),
      },
      {
        id: 'audience',
        title: l('Наблюдение и диалог', 'Observation and dialogue'),
        body: l(
          'Зритель может наблюдать процесс, обсуждать увиденное и участвовать в публичном разговоре. Присутствие в зале само по себе не означает измерение биосигналов.',
          'An audience member can observe the process, discuss what they see and join a public conversation. Being present does not itself mean having biosignals measured.',
        ),
      },
    ],
    limitations: {
      ru: [
        'Измерение не объясняет мысли, эмоции, личность или здоровье человека.',
        'Общее изображение не доказывает психологическую или физиологическую «синхронность» группы.',
        'Согласие, запись, хранение данных и выдача артефакта определяются отдельно для каждого показа.',
        'Ритмы и численные показатели в архивном видео не являются статистикой посетителя сайта или текущей базы.',
      ],
      en: [
        'Measurement does not explain a person’s thoughts, emotions, personality or health.',
        'A shared image does not prove psychological or physiological “synchrony” in a group.',
        'Consent, recording, data retention and artefact delivery are specified for each presentation.',
        'Rhythms and numbers in archival footage are not statistics about the website visitor or a current database.',
      ],
    },
    works: ['neuromandala', 'mindshow', 'neurosync', 'interference', 'neurobattle'],
    media: ['neuromandala-frequencies'],
    sourceRefs: refs(
      'neuromandala.md',
      'multisync.md',
      'mindshow.md',
      'neurobattle.md',
      'hub-lectures.md',
      'neurosync.md',
      'interference.md',
    ),
    source: 'neuromandala.md; mindshow.md; neurobattle.md; hub-lectures.md',
    publication: 'published',
  },
];

export const participationDetails: Record<string, ParticipationDetail> = {
  'mindshow-installation': {
    story: l(
      'Участник входит в короткую сессию наблюдения: параметры сигнала становятся основой отзывчивого визуального поля. В версиях с нарративом добавляются ассоциации или рассказ, из которых развивается образная анимация.',
      'A participant enters a short observation session: signal parameters become the basis of a responsive visual field. Narrative versions add associations or a story that develops into an imagery animation.',
    ),
    participation: l(
      'Основная стендовая конфигурация рассчитана на последовательные индивидуальные сессии. Остальные посетители могут наблюдать процесс; сценическая и VJ-версии согласуются отдельно.',
      'The main stand configuration uses successive individual sessions. Other visitors can observe; stage and VJ versions are scoped separately.',
    ),
    outcome: l(
      'Отзывчивый аудиовизуальный опыт; запись или персональный цифровой артефакт — по выбранной конфигурации и условиям согласия.',
      'A responsive audiovisual experience; a recording or personal digital artefact depends on the selected configuration and consent terms.',
    ),
    conditions: [
      {
        id: 'space',
        label: l('Пространство', 'Space'),
        value: l(
          'В архивном райдере — зона от 6 м². Фактическая планировка и очередь согласуются с площадкой.',
          'The archival rider specifies an area from 6 m². Actual layout and queueing are agreed with the venue.',
        ),
        state: 'historical',
      },
      {
        id: 'session',
        label: l('Длительность сессии', 'Session duration'),
        value: l(
          'Источники расходятся: 7 ± 2 минуты в MindShow и около 1,5 минуты в обзоре событий. Актуальный режим уточняется.',
          'Sources differ: 7 ± 2 minutes in MindShow and around 1.5 minutes in the events overview. The current mode needs clarification.',
        ),
        state: 'conflict',
      },
      {
        id: 'flow',
        label: l('Поток посетителей', 'Visitor flow'),
        value: l(
          'Обзор событий указывает 15–20 человек в час. Это архивная оценка конфигурации, не обещание для любой площадки.',
          'The events overview gives 15–20 people per hour. This is an archival configuration estimate, not a promise for every venue.',
        ),
        state: 'historical',
      },
      {
        id: 'operation',
        label: l('Эксплуатация', 'Operation'),
        value: l(
          'Смены операторов, санитарные паузы, длительная работа и выдача результата согласуются в брифе.',
          'Operator shifts, hygiene breaks, long-running operation and result delivery are agreed in the brief.',
        ),
        state: 'per-brief',
      },
    ],
    studioProvides: {
      ru: [
        'Нейроинтерфейс, ноутбук и авторское ПО',
        'Художественная настройка, оператор и ведущий по конфигурации',
      ],
      en: [
        'Neural interface, laptop and authored software',
        'Artistic configuration, operator and facilitator as scoped',
      ],
    },
    venueProvides: {
      ru: [
        'Экран/TV и HDMI; в архивном райдере — от 65″',
        'Стол, стул, питание и согласованная зона',
        'Звук и организация очереди по выбранной конфигурации',
      ],
      en: [
        'Screen/TV and HDMI; the archival rider specifies 65″ or larger',
        'Table, chair, power and agreed area',
        'Sound and queue coordination as scoped',
      ],
    },
    topics: [],
    reviewNotes: [
      l(
        'Число одновременно измеряемых участников не равно размеру аудитории. Пропускная способность подтверждается после выбора режима.',
        'Simultaneously measured participants are not the audience size. Throughput is confirmed after selecting the mode.',
      ),
    ],
    sourceRefs: refs('mindshow.md', 'hub-host-events.md', 'hub-collab.md'),
  },
  'neurobattle-game': {
    story: l(
      'Два человека управляют общим виртуальным объектом. Игровое правило переводит изменения сигнала в движение, а зрители наблюдают поединок и обсуждают стратегии.',
      'Two people control a shared virtual object. A game rule translates signal changes into movement, while the audience watches the duel and discusses strategies.',
    ),
    participation: l(
      'Одна игровая точка — два участника одновременно. Возможны отдельные поединки или турнирная последовательность; зрительская аудитория учитывается отдельно.',
      'One game station has two simultaneous participants. Individual duels or a tournament sequence are possible; the audience is counted separately.',
    ),
    outcome: l(
      'Совместный игровой опыт и обсуждение способов участия. Игровой результат не является оценкой интеллекта или качества человека.',
      'A shared game experience and a discussion of ways to participate. The game result is not an assessment of intelligence or personal worth.',
    ),
    conditions: [
      {
        id: 'players',
        label: l('Участники', 'Participants'),
        value: l(
          'Два игрока на одну точку; число зрителей зависит от площадки.',
          'Two players per station; audience size depends on the venue.',
        ),
        state: 'historical',
      },
      {
        id: 'round',
        label: l('Игровой раунд', 'Game round'),
        value: l(
          'В архивной спецификации — 90 секунд. Инструктаж и смена участников учитываются дополнительно.',
          'The archival specification gives 90 seconds. Briefing and participant changeover require additional time.',
        ),
        state: 'historical',
      },
      {
        id: 'flow',
        label: l('Пропускная способность', 'Throughput'),
        value: l(
          'Архивный ориентир — 5–8 пар за 30 минут на одну точку, с учётом цикла проведения.',
          'The archival reference is 5–8 pairs per 30 minutes at one station, including the facilitation cycle.',
        ),
        state: 'historical',
      },
      {
        id: 'space',
        label: l('Пространство', 'Space'),
        value: l(
          'В обзоре — зона от 9 м²; планировка и зрительский поток уточняются.',
          'The overview specifies an area from 9 m²; layout and audience flow need confirmation.',
        ),
        state: 'historical',
      },
    ],
    studioProvides: {
      ru: ['Два нейроинтерфейса, ноутбук и авторское ПО', 'В архивной конфигурации — техник и ведущий'],
      en: [
        'Two neural interfaces, laptop and authored software',
        'The archival configuration includes a technician and a facilitator',
      ],
    },
    venueProvides: {
      ru: [
        'Экран или проектор, HDMI и согласованный звук',
        'Стол, два стула, питание и игровая зона',
        'Организация зрительского потока',
      ],
      en: [
        'Screen or projector, HDMI and agreed sound',
        'Table, two chairs, power and game area',
        'Audience-flow coordination',
      ],
    },
    topics: [],
    reviewNotes: [
      l(
        'Параллельные точки, бюджет, брендирование и технический состав подтверждаются отдельно. Исторические названия игры сохранены как алиасы.',
        'Parallel stations, budget, branding and technical scope are confirmed separately. Historical game names remain aliases.',
      ),
    ],
    sourceRefs: refs('neurobattle.md', 'hub-host-events.md', 'hub-collab.md'),
  },
  'talk-workshop': {
    story: l(
      'Образовательная встреча соединяет разговор об искусстве и восприятии с демонстрацией Нейромандалы и практикой наблюдения. Тема и участие аудитории определяют программу, а не набор несвязанных технических эффектов.',
      'An educational encounter combines a conversation about art and perception with a Neuromandala demonstration and observation practice. The topic and audience participation shape the programme rather than a collection of unrelated technical effects.',
    ),
    participation: l(
      'Лекция допускает наблюдение из зала и добровольное участие в демонстрации. Практикум включает обсуждение и работу участников; размер группы не означает одновременное измерение всех людей.',
      'A talk supports observation from the audience and voluntary participation in a demonstration. A workshop includes discussion and participant work; group size does not mean that everyone is measured simultaneously.',
    ),
    outcome: l(
      'Знакомство с художественным методом, опыт наблюдения и обсуждения; для лаборатории — согласованный результат собственной работы участников.',
      'An introduction to the artistic method and an experience of observation and discussion; a laboratory adds an agreed outcome from participants’ own work.',
    ),
    conditions: [
      {
        id: 'talk-duration',
        label: l('Лекция', 'Talk'),
        value: l(
          'Источники указывают 30–90 и 45–90 минут. Нижняя граница зависит от версии; длительность согласуется под программу.',
          'Sources give 30–90 and 45–90 minutes. The lower bound depends on the version; duration is agreed for the programme.',
        ),
        state: 'conflict',
      },
      {
        id: 'workshop-duration',
        label: l('Практикум', 'Workshop'),
        value: l(
          'Архивное описание — 1,5–3 часа; группа 10–30 человек. Это отдельная конфигурация, не тайминг лекции.',
          'The archival description gives 1.5–3 hours and a group of 10–30 people. This is a separate configuration, not a talk duration.',
        ),
        state: 'historical',
      },
      {
        id: 'preparation',
        label: l('Подготовка', 'Setup'),
        value: l(
          'Архивный райдер лекций указывает около 30 минут. Монтаж и доступ к площадке уточняются.',
          'The archival talk rider gives around 30 minutes. Setup and access to the venue need confirmation.',
        ),
        state: 'historical',
      },
      {
        id: 'programme',
        label: l('Лаборатория / цикл', 'Laboratory / series'),
        value: l(
          'Программа, возраст аудитории, число встреч, оборудование и результаты согласуются отдельно. Предложенная программа не обозначается как уже проведённая.',
          'Programme, audience age, number of sessions, equipment and outcomes are scoped separately. A proposed programme is not described as already delivered.',
        ),
        state: 'per-brief',
      },
    ],
    studioProvides: {
      ru: [
        'Ведущие, нейроинтерфейсы, ноутбук и авторское ПО по программе',
        'Сценарий демонстрации и фасилитация практики',
      ],
      en: [
        'Facilitators, neural interfaces, laptop and authored software as scoped',
        'Demonstration plan and practice facilitation',
      ],
    },
    venueProvides: {
      ru: [
        'Экран/проектор, HDMI и электропитание',
        'Для сценического варианта — микрофоны и звук',
        'Мебель, размещение группы и доступ для монтажа',
      ],
      en: [
        'Screen/projector, HDMI and power',
        'Microphones and sound for the stage configuration',
        'Furniture, group accommodation and setup access',
      ],
    },
    topics: [
      l('Искусство и восприятие', 'Art and perception'),
      l('Звук, цвет и мультисенсорный опыт', 'Sound, colour and multisensory experience'),
      l('Внимание, обратная связь и эмпатия', 'Attention, feedback and empathy'),
      l('Нейроэстетика и художественный эксперимент', 'Neuroaesthetics and artistic experimentation'),
    ],
    reviewNotes: [
      l(
        'Тему, оплату, демонстрацию, запись, доступность и условия участия фиксируют для каждого приглашения. Формат не обещает диагностического или терапевтического результата.',
        'Topic, payment, demonstration, recording, accessibility and participation terms are fixed for each invitation. The format does not promise diagnostic or therapeutic outcomes.',
      ),
    ],
    sourceRefs: refs('hub-lectures.md', 'hub-education.md', 'hub-host-events.md', 'hub-collab.md'),
  },
};

export const cooperationPages: CooperationPage[] = [
  {
    id: 'cooperation',
    legacyId: 'hub-collab',
    title: l('Сотрудничество', 'Cooperation'),
    summary: l(
      'Показ, адаптация формата или совместная разработка начинаются с художественной задачи и контекста. ODA.dream отвечает за свою художественную и техническую часть; состав работ и инфраструктура площадки фиксируются в предложении.',
      'A presentation, format adaptation or co-development begins with an artistic question and context. ODA.dream delivers its artistic and technical contribution; the scope and venue infrastructure are fixed in the proposal.',
    ),
    scenarios: [
      {
        id: 'institutions',
        title: l('Кураторам, музеям и резиденциям', 'Curators, museums and residencies'),
        body: l(
          'Показ существующей работы, новая работа для пространства, публичная программа или ко-продукция. Важны художественный вопрос, опыт участника, авторство и условия показа.',
          'Present an existing artwork, commission a work for a space, develop a public programme or co-produce. The artistic question, participant experience, authorship and presentation conditions matter.',
        ),
        request: l(
          'Пришлите концепцию, пространство, даты, рамку финансирования и требуемый вид документации.',
          'Send the concept, space, dates, funding framework and required documentation.',
        ),
        configurationIds: ['mindshow-installation'],
        programmeIds: [],
      },
      {
        id: 'events',
        title: l('Агентствам, брендам и событиям', 'Agencies, brands and events'),
        body: l(
          'Интерактивная зона, игровая точка или выступление в программе события. Механику участия, очереди и зрительский поток планируют отдельно; агентство координирует клиента и общую инфраструктуру.',
          'An interactive area, game station or programme appearance. Participation mechanics, queues and audience flow are planned separately; the agency coordinates the client and overall infrastructure.',
        ),
        request: l(
          'Нужны дата и город, программа, аудитория, длительность работы зоны, план площадки и бюджетный диапазон.',
          'Provide date and city, programme, audience, operating duration, venue plan and budget range.',
        ),
        configurationIds: ['mindshow-installation', 'neurobattle-game'],
        programmeIds: [],
      },
      {
        id: 'production',
        title: l('Продюсерам и творческим командам', 'Producers and creative teams'),
        body: l(
          'Совместная разработка или адаптация художественного замысла. Авторство, этапы, границы программной и пространственной работы, local production и обслуживание обсуждаются до фиксации состава проекта.',
          'Co-develop or adapt an artistic concept. Authorship, phases, software and spatial responsibilities, local production and operation are discussed before fixing the project scope.',
        ),
        request: l(
          'Опишите концепцию, стадию, предполагаемое пространство, поток посетителей, команду и недостающую часть производства.',
          'Describe the concept, stage, intended space, visitor flow, team and missing production contribution.',
        ),
        configurationIds: ['mindshow-installation'],
        programmeIds: [],
      },
      {
        id: 'education',
        title: l('Образовательным программам', 'Educational programmes'),
        body: l(
          'Лекция, практикум или лаборатория вокруг искусства, восприятия и обратной связи. Сначала определяют аудиторию, учебную задачу и результат, затем демонстрацию, практику и ресурсную рамку.',
          'A talk, workshop or laboratory around art, perception and feedback. Define the audience, learning question and outcome first, then the demonstration, practice and resources.',
        ),
        request: l(
          'Укажите возраст и размер группы, цели, число встреч, оборудование, доступность и рамку оплаты.',
          'Specify audience age and size, objectives, number of sessions, equipment, accessibility and payment framework.',
        ),
        configurationIds: [],
        programmeIds: [
          'beautiful-brain',
          'neuroaesthetics-lec',
          'sound-brain',
          'taste-brain',
          'feedback-empathy-brain',
          'gong',
          'neuromandala-workshop',
          'neuro-laboratory',
        ],
      },
    ],
    modes: [
      {
        id: 'present',
        title: l('Показ существующей работы', 'Present an existing work'),
        body: l(
          'Выбираем произведение и проверяем соответствие площадке, авторские роли, технические условия и документацию.',
          'Select the work and check its fit with the venue, authorship, technical conditions and documentation.',
        ),
      },
      {
        id: 'adapt',
        title: l('Адаптация формата', 'Adapt a format'),
        body: l(
          'Используем существующую конфигурацию как исходную точку. Тайминг, аудитория, оборудование и состав команды уточняются в брифе.',
          'Use an existing configuration as a starting point. Timing, audience, equipment and team are clarified in the brief.',
        ),
      },
      {
        id: 'develop',
        title: l('Совместная разработка', 'Co-develop'),
        body: l(
          'Новая концепция, адаптация под павильон или программа курса оформляются как отдельная проектная работа с этапами, ответственностью и бюджетом.',
          'A new concept, pavilion adaptation or course programme is scoped as separate project work with phases, responsibilities and budget.',
        ),
      },
    ],
    process: [
      {
        id: 'brief',
        title: l('Контекст', 'Context'),
        body: l(
          'Получаем художественную или программную задачу и известные ограничения.',
          'Receive the artistic or programme question and known constraints.',
        ),
      },
      {
        id: 'scope',
        title: l('Состав', 'Scope'),
        body: l(
          'Выбираем работу или формат, отмечаем неизвестные параметры и границы сторон.',
          'Choose the work or format, identify unknown parameters and define each party’s responsibilities.',
        ),
      },
      {
        id: 'proposal',
        title: l('Предложение', 'Proposal'),
        body: l(
          'Фиксируем конфигурацию, производство, сроки, стоимость и права в адресном документе. Отправленная версия сохраняется в рабочем архиве.',
          'Fix configuration, production, schedule, cost and rights in an addressed document. The sent version remains in the working archive.',
        ),
      },
      {
        id: 'delivery',
        title: l('Подготовка и показ', 'Preparation and presentation'),
        body: l(
          'Согласуем монтаж, проведение, демонтаж и допустимую документацию. Результат связывается с конкретным событием, а не с обещанием в переписке.',
          'Agree setup, delivery, teardown and permitted documentation. The outcome is linked to a specific event, not to a promise in correspondence.',
        ),
      },
    ],
    studioProvides: {
      ru: [
        'Художественный метод, нейроинтерфейсы, ноутбук и авторское ПО по выбранной конфигурации',
        'Настройка собственного контура, операторы и фасилитация по составу предложения',
        'Документация и согласованный райдер',
      ],
      en: [
        'Artistic method, neural interfaces, laptop and authored software as scoped',
        'Configuration of its own system, operators and facilitation as proposed',
        'Documentation and agreed rider',
      ],
    },
    venueProvides: {
      ru: [
        'Пространство, экран/проектор, AV, питание и мебель по райдеру',
        'Локальный продакшн, доступ, размещение и поток посетителей',
        'Согласованные условия работы команды и инфраструктуры',
      ],
      en: [
        'Space, screen/projector, AV, power and furniture as required by the rider',
        'Local production, access, accommodation and visitor flow',
        'Agreed team and infrastructure operating conditions',
      ],
    },
    briefFields: [
      l('Задача, формат или художественная концепция', 'Question, format or artistic concept'),
      l('Даты, город, пространство и план площадки', 'Dates, city, space and venue plan'),
      l('Аудитория, участие и ожидаемый поток', 'Audience, participation and expected flow'),
      l('Команда, инфраструктура и длительность эксплуатации', 'Team, infrastructure and operating duration'),
      l(
        'Бюджетная рамка, необходимые документы и разрешения на запись',
        'Budget framework, required documents and recording permissions',
      ),
    ],
    sourceRefs: refs(
      'hub-collab.md',
      'hub-institutions.md',
      'hub-galleries.md',
      'hub-event-agencies.md',
      'hub-business.md',
      'hub-education.md',
      'hub-creators.md',
    ),
    source:
      'hub-collab.md; hub-institutions.md; hub-galleries.md; hub-event-agencies.md; hub-business.md; hub-education.md; hub-creators.md',
    publication: 'published',
  },
];
