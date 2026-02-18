/**
 * sync-dates.js
 *
 * Проходит по всем *.md файлам в src/content/ и синхронизирует
 * поле `date` во frontmatter с датой последнего изменения файла.
 *
 * Формат даты: YYYY.MM.DD (например, 2026.02.12)
 *
 * Использование:
 *   node sync-dates.js           — обновить файлы
 *   node sync-dates.js --dry-run — показать изменения без записи
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --- КОНФИГУРАЦИЯ ---

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к директории с контентом относительно расположения скрипта.
// Если скрипт лежит в корне проекта — путь такой:
const CONTENT_DIR = path.join(__dirname, "src", "content");

// Если скрипт лежит в папке scripts/ — раскомментируйте эту строку:
// const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content');

const DRY_RUN = process.argv.includes("--dry-run");

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

/**
 * Форматирует дату в строку YYYY.MM.DD
 */
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

/**
 * Парсит строку даты YYYY.MM.DD → объект Date.
 * Возвращает null при ошибке.
 */
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.trim().split(".");
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JS: месяцы с 0
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return new Date(year, month, day);
};

/**
 * Проверяет, совпадают ли два объекта Date по дню (без учёта времени)
 */
const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * Извлекает значение поля `date` из frontmatter.
 * Возвращает строку или null.
 */
const readFrontmatterDate = (content) => {
  const fmMatch = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);
  if (!fmMatch) return null;

  const dateMatch = fmMatch[1].match(/^date:\s*(.+)$/m);
  return dateMatch ? dateMatch[1].trim() : null;
};

/**
 * Возвращает новую строку контента с обновлённым (или добавленным) полем `date`.
 */
const setFrontmatterDate = (content, newDate) => {
  const fmMatch = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);

  // Frontmatter отсутствует — создаём минимальный блок в начале файла
  if (!fmMatch) {
    return `---\ndate: ${newDate}\n---\n\n${content}`;
  }

  const fullBlock = fmMatch[0];
  const fmBody = fmMatch[1];
  const hasDate = /^date:/m.test(fmBody);

  const updatedBody = hasDate
    ? fmBody.replace(/^date:\s*.*$/m, `date: ${newDate}`) // заменяем
    : fmBody + `\ndate: ${newDate}`; // добавляем

  return content.replace(fullBlock, `---\n${updatedBody}\n---`);
};

// --- ОСНОВНАЯ ЛОГИКА ---

const run = () => {
  const mode = DRY_RUN ? " [DRY RUN — файлы не изменяются]" : "";
  console.log(`\n=== СИНХРОНИЗАЦИЯ ДАТ FRONTMATTER${mode} ===`);
  console.log(`Директория: ${CONTENT_DIR}\n`);

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`❌ Директория не найдена: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  if (files.length === 0) {
    console.log("⚠️  .md файлы не найдены.");
    return;
  }

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const fileName of files) {
    const filePath = path.join(CONTENT_DIR, fileName);

    try {
      const stats = fs.statSync(filePath);
      const fileDate = new Date(stats.mtime); // дата изменения файла
      const newDateStr = formatDate(fileDate);

      const content = fs.readFileSync(filePath, "utf-8");
      const currentStr = readFrontmatterDate(content);
      const currentDate = parseDate(currentStr);

      // Даты совпадают — пропускаем
      if (currentDate && isSameDay(currentDate, fileDate)) {
        console.log(`  ⏭  ${fileName}  →  без изменений (${newDateStr})`);
        skipped++;
        continue;
      }

      // Нужно обновить
      const action = currentStr
        ? `${currentStr} → ${newDateStr}`
        : `добавлено ${newDateStr}`;

      if (!DRY_RUN) {
        const updated_content = setFrontmatterDate(content, newDateStr);
        fs.writeFileSync(filePath, updated_content, "utf-8");
      }

      console.log(
        `  ✅  ${fileName}  →  ${action}${DRY_RUN ? " [не записано]" : ""}`,
      );
      updated++;
    } catch (err) {
      console.error(`  ❌  ${fileName}  →  ошибка: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n--- ИТОГ ---`);
  console.log(`  Всего файлов : ${files.length}`);
  console.log(`  Обновлено    : ${updated}`);
  console.log(`  Пропущено    : ${skipped}`);
  if (errors) console.log(`  Ошибок       : ${errors}`);
  console.log("");
};

run();
