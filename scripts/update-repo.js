
/**
 * Скрипт синхронизации папок и обновления Git-репозитория.
 * Использование: node update-repo.js <ПУТЬ_К_РАСПАКОВАННОЙ_ПАПКЕ> <ПУТЬ_К_РЕПОЗИТОРИЮ>
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// --- НАСТРОЙКИ ---
// Папки и файлы, которые НЕЛЬЗЯ удалять из репозитория при очистке
const PRESERVE_IN_REPO = ['.git', 'node_modules', '.env', '.DS_Store', 'dist'];
// Папки и файлы, которые НЕ НУЖНО копировать из источника (если они там случайно есть)
const IGNORE_FROM_SOURCE = ['.git', 'node_modules', 'dist'];

// --- ЛОГИКА ---

const copyRecursiveSync = (src, dest) => {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach((childItemName) => {
            if (IGNORE_FROM_SOURCE.includes(childItemName)) return;
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

const cleanRepoDir = (dir) => {
    if (!fs.existsSync(dir)) {
        console.error(`❌ Ошибка: Папка репозитория не найдена: ${dir}`);
        process.exit(1);
    }

    const items = fs.readdirSync(dir);
    items.forEach(item => {
        if (PRESERVE_IN_REPO.includes(item)) {
            return;
        }
        const curPath = path.join(dir, item);
        fs.rmSync(curPath, { recursive: true, force: true });
    });
    console.log('🧹 Репозиторий очищен от старых файлов (системные файлы сохранены).');
};

const runGitCommands = (repoPath) => {
    try {
        console.log('🤖 Запуск Git команд...');
        
        // Проверяем статус
        const status = execSync('git status --porcelain', { cwd: repoPath }).toString();
        
        if (!status) {
            console.log('✅ Нет изменений для коммита.');
            return;
        }

        // Добавляем все изменения
        execSync('git add .', { cwd: repoPath });
        console.log('   -> git add . выполнено');

        // Создаем коммит с текущей датой
        const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        const message = `Update from archive: ${date}`;
        execSync(`git commit -m "${message}"`, { cwd: repoPath });
        console.log(`   -> git commit выполнено: "${message}"`);
        
        console.log('🎉 Репозиторий успешно обновлен!');
        
        // Опционально: автоматический пуш
        // execSync('git push', { cwd: repoPath });
        // console.log('   -> git push выполнено');

    } catch (error) {
        console.error('❌ Ошибка при работе с Git:', error.message);
    }
};

// --- ЗАПУСК ---

const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('⚠️  Пожалуйста, укажите пути.');
    console.log('Пример: node scripts/update-repo.js "C:/Downloads/new-version" "C:/Projects/oda-repo"');
    process.exit(1);
}

const sourceDir = path.resolve(args[0]);
const targetRepo = path.resolve(args[1]);

console.log('------------------------------------------------');
console.log(`📂 Источник:   ${sourceDir}`);
console.log(`🎯 Репозиторий: ${targetRepo}`);
console.log('------------------------------------------------');

if (!fs.existsSync(sourceDir)) {
    console.error('❌ Папка источника не существует.');
    process.exit(1);
}
if (!fs.existsSync(path.join(targetRepo, '.git'))) {
    console.error('❌ Целевая папка не похожа на git-репозиторий (нет папки .git).');
    process.exit(1);
}

// 1. Очистка репозитория
cleanRepoDir(targetRepo);

// 2. Копирование новых файлов
console.log('📦 Копирование новых файлов...');
copyRecursiveSync(sourceDir, targetRepo);

// 3. Git
runGitCommands(targetRepo);
