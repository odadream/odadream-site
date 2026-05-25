# Content Keeper — Отчёт об анализе контента

**Дата:** 2026.03.03  
**Версия:** 1.0  
**Статус:** Аудит выполнен

---

## 1. Обзор

**Всего узлов:** 57  
**Корень:** `home` (oda.dream)

**Основные ветви:**
- **Works** — games, lectures, research, practices, objects
- **Collaboration** — for-events, letters, for-business, for-artists, for-galleries
- **World** — manifesto, team, press, acknowledgments, testimonials
- **Events** — byob, chastoti, pleinair, portal, terraforming
- **Debug** — тестовые узлы (debug-action, debug-article, debug-audio, debug-hub, debug-image, debug-video)

---

## 2. Референсный контент (голос и философия)

### Сильные точки

| Файл | Оценка |
|------|--------|
| **home.md** | Фраза «Экран — не окно, а зеркало нервной системы», логика Lotus, границы сознания и кода |
| **world-manifesto.md** | Четыре принципа, краткие и чёткие формулировки |
| **collab.md** | «context → adaptation → shared experience», модель партнёрства |
| **versions.json** | Evocative titles («Лотос Перерождён», «touching water», «the arrow breathes») |

**Neurobattle, Mindshow, for-events, lectures** — проработаны, совпадают с философией, хорошая билингвальность.

---

## 3. Выявленные проблемы

### 3.1 Осиротевшие узлы (4 шт.)

Узлы ссылаются на несуществующий `parent: workshops`:

- **coaching** — parent: workshops [отсутствует]
- **neuro-dance** — parent: workshops [отсутствует]
- **gong** — parent: workshops [отсутствует]
- **neurosync** — parent: workshops [отсутствует]

**Рекомендация:** Заменить parent на `practices` или при необходимости исключить из графа.

### 3.2 Ошибки в контенте

| Узел | Проблема |
|------|----------|
| **practices.md** | Подставлен текст из Works («Archive of Artifacts», «Games, Lectures, Research, Objects»). Hub должен описывать somatic/cognitive practices, а не каталог работ |
| **objects.md** | Содержит только описание Mom and Baby, хотя это отдельный узел `mom-baby`. Hub должен иметь общее вступление к категории артефактов |
| **research.md** | `visible: visible` в frontmatter — некорректно, ожидается `true`/`false` |
| **world-manifesto.md** | Дубликат поля `date` в frontmatter (2024.02.01 и 2026.02.06) |
| **collab-events.md** | Лишняя точка: «_Communication session terminated.._» |
| **events.md** | Видео `ForBiggerBlazes.mp4` (Google sample) — placeholder, не контент ODA.dream |

### 3.3 Разрывы в нарративе

- **Practices** — в works.md указан как «coming soon», hub заполнен чужим текстом; дочерние практики существуют, но оторваны из-за неверного parent
- **Objects** — текст Mom and Baby дублируется в hub и в дочернем узле

### 3.4 Стиль и голос

- **games.md** — лаконично, но можно усилить связь с философией (есть в neurobattle)
- **events.md** — более generic («Where the digital manifests in the physical») на фоне выразительного home/manifesto

---

## 4. Сильные стороны

- **Терминология:** Lotus, hub, interface, protocol, biofeedback, neurofeedback — единообразны
- **Билингвальность:** EN и RU равнозначны по объёму и качеству
- **Философские якоря:** цитаты и формулировки согласованы
- **Cross-references:** [[neurobattle]], [[mindshow]], [[lectures]], [[for-events]], [[letters]] образуют связный граф
- **Спецификации:** технический райдер, требования — чёткие и пригодные для производных (organizer brief, tech spec)

---

## 5. Рекомендации по приоритетам

1. **Высокий:** Исправить parent у осиротевших узлов (coaching, neuro-dance, gong, neurosync)
2. **Высокий:** Переписать **practices.md** как полноценный hub Практик
3. **Средний:** Разделить контент **objects.md** (общее описание) и **mom-baby** (конкретика)
4. **Средний:** Исправить frontmatter (research, manifesto)
5. **Низкий:** Заменить placeholder-видео в events.md или убрать
6. **Низкий:** Убрать опечатку в collab-events.md

---

## 6. Чеклист Content Keeper

### Семантическая связность
- [x] Концепции совпадают с философией ODA.dream
- [x] Терминология единообразна между узлами
- [ ] Cross-references имеют смысл (есть 4 осиротевших узла)
- [ ] Нет изолированных или оторванных идей

### Нарратив
- [x] Контент встраивается в общую историю
- [ ] Переходы между узлами логичны (разрыв в practices)
- [ ] Нет резких скачков в повествовании

### Стиль
- [x] Голос в целом соответствует ODA.dream
- [x] Метафоры и точность сбалансированы
- [x] Язык не generic/corporate

### Билингвальность
- [x] EN и RU сопоставимы по глубине
- [x] Нет явных следов машинного перевода

### Непротиворечивость
- [ ] Нет конфликтующих фактов (дубликаты: objects/mom-baby, practices/works)
- [x] Даты и ссылки актуальны

### Выравнивание визуал/текст
- [x] Изображения поддерживают текст
- [ ] Один placeholder-видео в events

---

**Content Keeper Agent**  
ODA.dream Multi-Agent System  
*"Where meaning meets form."*
