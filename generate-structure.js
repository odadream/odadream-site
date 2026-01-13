const fs = require("fs");
const path = require("path");

const structure = {
  src: {
    "index.md": "# Главная\n",
    "about.md": "# О нас\n",
    "contacts.md": "# Контакты\n",
    events: {
      "lectures.md": "# Лекции\n",
      "workshops.md": "# Воркшопы\n",
      "performances.md": "# Перформансы\n"
    },
    portfolio: {
      "mindshow.md": "# Mindshow\n",
      "neuromandala.md": "# Нейромандала\n",
      "schrodinger.md": "# Проект Шрёдингера\n"
    }
  },
  ".eleventy.js": `module.exports = function(eleventyConfig) {
  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};`
};

function createStructure(base, obj) {
  for (const key in obj) {
    const target = path.join(base, key);

    if (typeof obj[key] === "string") {
      fs.writeFileSync(target, obj[key], "utf8");
      console.log("Создан файл:", target);
    } else {
      if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
        console.log("Создана папка:", target);
      }
      createStructure(target, obj[key]);
    }
  }
}

createStructure(process.cwd(), structure);
console.log("\nГотово! Структура сайта создана.");
