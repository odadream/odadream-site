/**
 * One-off migration: replace inline `![[<url> | label | poster]]` embeds with
 * `![[media:<id>]]` tokens (single source: src/data/media.ts). Run once:
 *   node scripts/extract-media.js
 *
 * Logic: if `<url>` matches an asset in the registry below, replace with the
 * token. Preserve a `| label` override only if the source label is non-trivial
 * AND doesn't match the registry default (EN or RU). Preserve a `| poster`
 * override only if it differs from the registry default. Unknown URLs are left
 * untouched and logged.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(__dirname, "..", "src", "content");

// Mirror of src/data/media.ts (URL → { id, poster, titles }). Kept in this
// migration script for self-containment; safe to delete after the one-time run.
const ASSETS = [
  ["https://dzen.ru/embed/o20YLsWwKAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", "nrbt-gameplay-v9", "/images/content/neurobattle_gameplay.webp", ["Neurobattle · gameplay v9", "Нейробитва · геймплей v9", "oda.nrbt v9"]],
  ["https://dzen.ru/embed/o20ZleGMJAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", "nrbt-dano", "/images/content/neurobattle_dano.webp", ["DANO Olympiad", "Олимпиада DANO", "video", "видео"]],
  ["https://dzen.ru/embed/v1ftBaZRQUXU?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", "nrbt-veter", "/images/content/neurobattle_veter.webp", ["Wind of Change · charity gala", "Ветер Перемен · благотворительный вечер", "Wind of Change", "Ветер Перемен"]],
  ["https://dzen.ru/embed/vY9PlkGfKPUc?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", "nrbt-tnt", "/images/content/neurobattle_tnt.webp", ["TNT · You Like Me", "ТНТ · Ты как Я", "You Like Me", "Ты как Я"]],
  ["https://dzen.ru/embed/o20aog1YJAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", "mdsh-demo-v5", "/images/content/mindshow_mdsh_v5.webp", ["MindShow · demo v5", "MindShow · демо v5", "oda.mdsh v5"]],
  ["https://dzen.ru/embed/vL3M-cNgfSVo?from_block=partner&from=zen&mute=1&autoplay=1&tv=0", "mdsh-hypercube", "/images/content/mindshow_portal.webp", ["Hypercube · Portal 2030–2050, Skolkovo", "Гиперкуб · Портал 2030–2050, Сколково", "Hypercube", "Гиперкуб"]],
  ["https://dzen.ru/embed/vYcLmkD5bAxE?from_block=partner&from=zen&mute=1&autoplay=1&tv=0", "mdsh-urban-forum", "/images/content/mindshow_urban_forum.webp", ["RusUrbanForum", "РосУрбанФорум"]],
  ["https://dzen.ru/embed/o21sOdHQIAAA?from_block=partner&from=zen&mute=1&autoplay=1&tv=0", "mdsh-wildmint", "/images/content/mindshow_myata.webp", ["Wild Mint Festival", "Дикая Мята", "Wild Mint"]],
  ["https://dzen.ru/embed/o21s_fHQIAAA?from_block=partner&from=zen&mute=1&autoplay=1&tv=0", "mdsh-ashram", "/images/content/mindshow_ashram.webp", ["Ashram · Natali Osman", "Ashram · Натали Осман", "Nataly Osman", "Натали Осман"]],
  ["https://dzen.ru/embed/o21tvvnYKAAA?from_block=partner&from=zen&mute=1&autoplay=1&tv=0", "mdsh-bashkiria", "/images/content/mindshow_ufa.webp", ["Shulgan-Tash · digital plein air", "Шульган-Таш · цифровой пленэр", "Shulgan-Tash", "Шульган-Таш"]],
  ["/images/content/mindshow_metro_2.webp", "mdsh-metro", "", ["Moscow metro · digital plein air", "Московское метро · цифровой пленэр", "metro", "метро"]],
  ["/images/content/mindshow_tpp.webp", "mdsh-tpp", "", ["CCI RF · Russian Digital Creative", "ТПП РФ · Russian Digital Creative", "CCI RF", "ТПП РФ"]],
  ["https://dzen.ru/embed/vZ6STYjxZhHk?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", "lec-gonchar", "/images/content/lectures-gonchar.webp", ["Nata Gonchar · private neuro-show", "Ната Гончар · частное нейрошоу", "video", "видео"]],
  ["https://dzen.ru/embed/o20b-pOkIAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", "lec-bauman", "/images/content/lectures-moscow2030.webp", ["Bauman / Moscow 2030 · brain-hacking lecture", "Бауман / Москва 2030 · лекция о брейнхакинге", "video", "видео"]],
  ["https://dzen.ru/embed/v2Wb3fVoWW1A?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", "lec-ikc", "/images/content/lectures-ikc.webp", ["ICC Kaluga · masterclass", "ИКЦ Калуга · мастер-класс", "IKC", "ИКЦ"]],
  ["https://dzen.ru/embed/veLb095NOWiA?from_block=partner&from=zen&mute=1&autoplay=1&tv=0", "lec-tskhr", "/images/content/lectures-tshr.webp", ["TSKhR · neuroaesthetics lecture", "ТСХР · лекция о нейроэстетике", "TCA", "ТСХР"]],
  ["/images/content/lectures-tavrida.webp", "lec-tavrida", "", ["Tavrida.ART · AI festival", "Таврида.АРТ · фестиваль ИИ", "photo", "фото"]],
  ["/images/content/lectures-sber.webp", "lec-sber", "", ["Sberbank · science-art lecture", "Сбербанк · science-art лекция", "photo", "фото"]],
  ["/images/content/lectures-ashram.webp", "lec-ashram", "", ["Ashram Studio · public talk", "Студия Ashram · публичный talk", "photo", "фото"]],
  ["/images/content/neuromandala-cover.jpg", "neuromandala-cover", "", ["Neuromandala", "Нейромандала"]],
  ["/images/content/art-brain.jpg", "art-brain-cover", "", ["Art of Brain", "Искусство мозга"]],
  ["/images/content/jewellery.jpg", "jewellery-cover", "", ["Jewellery objects", "Ювелирные объекты"]],
];

const byUrl = new Map(ASSETS.map(([url, id, poster, defaults]) => [url, { id, poster, defaults }]));

let touchedFiles = 0;
let replacedEmbeds = 0;
const unknowns = new Set();

for (const f of fs.readdirSync(CONTENT)) {
  if (!f.endsWith(".md")) continue;
  const full = path.join(CONTENT, f);
  const text = fs.readFileSync(full, "utf-8");

  let mutated = false;
  const next = text.replace(
    /!\[\[\s*([^|\]]+?)\s*(?:\|\s*([^|\]]+?)\s*)?(?:\|\s*([^\]]+?)\s*)?\]\]/g,
    (match, value, label, poster) => {
      const v = value.trim();
      if (v.startsWith("media:")) return match; // already tokenized
      const asset = byUrl.get(v);
      if (!asset) {
        if (v.startsWith("http") || v.startsWith("/")) unknowns.add(v);
        return match;
      }
      const isDefaultLabel = !label || asset.defaults.some((d) => d.toLowerCase() === label.trim().toLowerCase());
      const isDefaultPoster = !poster || poster.trim() === asset.poster;

      mutated = true;
      replacedEmbeds++;
      if (isDefaultLabel && isDefaultPoster) return `![[media:${asset.id}]]`;
      if (isDefaultPoster) return `![[media:${asset.id} | ${label.trim()}]]`;
      return `![[media:${asset.id} | ${label ? label.trim() : ""} | ${poster.trim()}]]`;
    },
  );

  if (mutated) {
    fs.writeFileSync(full, next);
    touchedFiles++;
    console.log(`  ✓ ${f}`);
  }
}

console.log(`\n✨ ${replacedEmbeds} embeds tokenized across ${touchedFiles} files`);
if (unknowns.size) {
  console.log("\n  unknown media URLs (left as-is):");
  for (const u of unknowns) console.log(`    • ${u}`);
}
