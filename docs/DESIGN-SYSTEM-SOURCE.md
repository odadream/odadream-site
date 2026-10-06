# ODA.dream V5 → V2 design-system contract

Approved reference: `c82a7c7:design-lab/oda-v5-prototype/design-system.html` and its `style.css`. The V5 reference remains frozen in Git. The active, noindex specimen is `/design-system/` in this branch.

The site and specimen both import `src/styles/global.css`, which imports the single semantic token source `src/styles/tokens.css`. The specimen adds `src/styles/design-system.css` only for its documentation layout. It uses the same `WorkCard`, `MediaFigure`, navigation shell, links, buttons and statuses as public pages; it does not define a competing palette.

The shared header and expanded mobile navigation use the specimen's foreground-material plane and `--shadow-material`. Their surfaces end at a crisp edge; the subtle separation below is a blurred shadow, never an opaque or translucent gradient strip. The browser theme color matches that foreground plane in both themes.

The primary navigation starts with an explicit `H Главная` / `H Home` entry linking to the language root. The brand mark remains a visual home link, but it is not the only route back to the base page.

The `/design-system/` page also documents the full-bleed moving-image hero: the header carries the brand signature once, while the hero holds the independent epigraph, artwork-led frame, secondary work caption and restrained aggregate-data panel. Hero surfaces, scrim and heights are semantic tokens. The displayed MindDB figure is a dated, review-gated snapshot; it must not be treated as approved public data, and rhythm bars remain absent until their methodology and publication are cleared.

Numbering follows one visible grammar with two levels: `W` is a page family and `W.01` a section. The tight-framed microchip appears in navigation, headings, and rails, not on individual content cards. Its border hugs the glyphs with no padding; the family letter takes its semantic `--signal-*` color and section digits are subdued. Machine-readable `data-page-code` uses the same form. The build validates family, shape, and continuous section numbering on every localized page and the specimen. The hero reel uses a separate `КАДР / FRAME · NN / total` counter.

Text links and media-opening affordances use the shared vector `TechnicalMark kind="open"`, aligned optically with the link text. The component inserts an explicit underlined spacer after the label, so the text underline reaches the arrow start consistently; the arrow has a diagonal shaft and a short head, with no lower horizontal shelf that could create a visible seam. The hero carousel uses the same mark family in `previous`/`next` directions: 44px hit areas, no permanent square borders, no visible pause button. Automatic frame changes pause on hover and keyboard focus. Video stops when the page is hidden or the hero is offscreen; reduced-motion and Save-Data keep the poster instead of starting video.

## Carried from V5

- Three tonal planes, restrained signal/accent color, ink/muted/alert/error roles.
- JetBrains Mono body and documentation; Manrope headings; Cyrillic font subsets bundled locally.
- 4 px spacing scale, 40 / 24 / 16 px gutters, 1360 px maximum container.
- No routine section rules; quiet rules for data rows; close text underlines only for editorial links.
- Distinct navigation, action, disabled and status treatments; 44 px controls and visible keyboard focus.
- Work-first cards, material captions, gallery/lightbox, citation, error and provenance patterns.

## V2 additions

The featured-work carousel, motion-preview state and three-step method explainer are new presentation patterns. They reuse V5 tokens and are demonstrated or described on the active specimen. Motion stops for reduced-motion, data saver and hidden tabs. A moving still is not labeled as footage; only verified source clips can be assigned as `previewSrc`.

The current specimen is linked from the navigation during local development. Its theme control is the same as the site's: system preference by default, locally saved light/dark override. Dark uses a warm near-black canvas; light uses warm paper planes. The paper dot texture, measured grid, muted per-section code colors draw from the owner-supplied studies in `odadream-site-2`; the approved ODA logo stays in place. Cell-grid statistics stamps and document previews are shared public components. Swatch readouts resolve live CSS tokens after a theme change.

When a visual rule changes, edit tokens or live component styles first, update `/design-system/` to demonstrate it, and check both RU/EN pages at desktop and mobile widths. The design-system route must remain out of sitemap and `noindex`.

## Informational marginalia

Read [DESIGN-GUIDE.md](DESIGN-GUIDE.md) for the semantic contract and reference analysis. `SectionRail` pairs a quiet filled Manrope ExtraBold folio with a vertical position code and a bottom-aligned editorial note. These marginalia disappear on mobile; `StatisticsStamp` follows the material instead. `RecordStamp` renders real fields as a continuous closed cell grid and definition list on work/event pages and in the colophon. `MediaFigure` adds a register ID and known file dimensions. Shared styles live in `annotations.css`, semantic values in `tokens.css`; section 11 of the specimen uses these same components. Open catalogue layouts, a distinct method surface and document passports establish different levels of emphasis. Large incomplete numerals are redundant navigational markers, never the sole carrier of information.

## Поля и планы — уточнение 2026-09-23

Контракт общих осей описан в DESIGN-GUIDE.md. Hero использует вычисляемый `--page-inset` вместо фиксированного поля окна; поверхность панели выступает за ось, не сдвигая текст. Сайт и стенд используют общие интервалы вступлений и секций. Все фоновые номера одного размера на данном viewport. `e2e/alignment.spec.ts` проверяет геометрию всех локализованных страниц из реестра и стенда на четырёх ширинах.

Заголовок один, в основном полотне. SectionRail содержит код, тихий фоновый номер Manrope и заметку у нижнего края. StatisticsStamp на desktop находится в поле, на mobile следует после материала; заметка и фоновые знаки скрываются. RecordStamp использует непрерывную замкнутую сетку ячеек (подпись / значение), включая выходные данные. Три плана определены в DESIGN-GUIDE.md: среда и справочные данные → паспорт/схема → материал. Стенд использует эти же компоненты, без собственной копии стилей.


### Текстовые ссылки — единая CAD-выноска

`CalloutLink.astro` рисует полки строк и финальную диагональ одним SVG-контуром; текст остаётся обычным доступным HTML. Последнее слово, один неразрывный пробел обычной ширины и место стрелки переносятся вместе. Длины берутся из браузерной раскладки и пересчитываются после загрузки шрифта, изменения ширины и темы. Общие параметры в `tokens.css`: `--link-rule-width`, `--link-offset`, `--link-mark-size`, `--link-head-size`. Цвет наследуется от контекста, hover/focus использует signal. Без JavaScript сохраняется обычное подчёркивание. Компонент без href декорирует название внутри ссылки-карточки, не создавая вложенный anchor. Отдельные технические иконки остаются `TechnicalMark`; текстовые ссылки не соединяют две независимые линии. Живые короткие и многострочные RU/EN-примеры — `/design-system/`.


Футер — служебная навигация без стрелок и подчёркиваний: только «Контакты», «Студия» и социальные ссылки текущего языка. CAD-выноски остаются в содержании страниц. Подпись: © 2018–текущий год ODA.dream®; знак регистрации надстрочный, регистр бренда сохраняется.

Знак Дзена: официальный SVG https://dzen.ru/about/images/download/dzen-dark/dark-stella.svg из https://dzen.ru/about/download, получен 2026-09-25; геометрия сохранена, цвет наследует тему. Основание для ®: архивная запись `odadream-site/src/content/proof-ip-trademark.md` (Роспатент); номер свидетельства в записи отсутствует. Начало копирайта 2018 — существующая подпись проекта в AGENTS.md архива.


Принято 2026-10-05: WorkStage обозначает стадию реализации; тип, исторические алиасы, доступность, тираж и состав — отдельные поля. «Парадокс Успеха» — каноническое имя игры; «Эмомандала» — составная интерактивная работа. «Круг синхронизации» — концепт на основе «Нейросинхронизации», «Предки в шуме» — прототип внутренней лаборатории. R&D показывается отдельной подборкой на странице «Работы» и не входит в главную. Владелец разрешил показ работ и частных заказов по умолчанию. Основания и границы: CONTENT-AND-CMS.md.


Контракт краткой карточки работы и заполненность всех девяти записей: [DESIGN-GUIDE.md](DESIGN-GUIDE.md). Превью вместе с подписью составляет один ряд; затем метаданные, название и описание. Неизвестный год явно null.

Длинный рассказ использует общий EditorialSections (контракт в DESIGN-GUIDE.md), показанный живыми данными Work в разделе 11 стенда. Авторство и биографии используют общую текстовую list-row, образовательный контекст — строку с годом и действием. Полная страница не переносит длинный рассказ в краткую карточку.

EvidenceNote показывает поддерживаемое утверждение и человекочитаемое происхождение; живой компонент добавлен в раздел 11. RecognitionCard показывает адресата, смысл документа и границы подтверждения, сохраняя просмотр исходного скана без визуальных преобразований. Контракты событий и документов описаны в DESIGN-GUIDE.md.

Уточнение 2026-10-06: правила текстовых строк, списков, оптической привязки метки и заполнения паспортов описаны в DESIGN-GUIDE.md; живые примеры — разделы 03 и 11 стенда. `e2e/content-layout.spec.ts` проверяет внутреннюю ширину строк, заполнение каждой строки паспорта, интервалы списков и положение меток, включая 908 px, RU/EN и обе темы. Стенд и сайт используют общий вертикальный ритм содержания. Меню сворачивается до 1200 px включительно, независимо от порогов сетки материала.
