# ODA.dream V5 → V2 design-system contract

Approved reference: `c82a7c7:design-lab/oda-v5-prototype/design-system.html` and its `style.css`. The V5 reference remains frozen in Git. The active, noindex specimen is `/design-system/` in this branch.

The site and specimen both import `src/styles/global.css`, which imports the single semantic token source `src/styles/tokens.css`. The specimen adds `src/styles/design-system.css` only for its documentation layout. It uses the same `WorkCard`, `MediaFigure`, navigation shell, links, buttons and statuses as public pages; it does not define a competing palette.

The `/design-system/` page also documents the full-bleed moving-image hero: the header carries the brand signature once, while the hero holds the independent epigraph, artwork-led frame, secondary work caption and restrained aggregate-data panel. Hero surfaces, scrim and heights are semantic tokens. The displayed MindDB figure is a dated, review-gated snapshot; it must not be treated as approved public data, and rhythm bars remain absent until their methodology and publication are cleared.

Numbering follows the site tree: a letter identifies the page family, a two-digit segment identifies the section, and an optional third segment identifies an element (`W / 01 / 03`). In compact card metadata the visible form is a microchip `W.0103`; each numeric segment is fixed at two digits, and the dot after the family separates the code from dates. The family letter alone takes its semantic `--signal-*` color; digits stay neutral. Non-card fields retain spaced slashes. Machine-readable `data-page-code` remains `W.01.03`. The build validates family, shape, and continuous section/item numbering on every localized page and the specimen. The hero reel uses a separate `КАДР / FRAME · NN / total` counter.

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

Контракт общих осей описан в DESIGN-GUIDE.md. Hero использует вычисляемый `--page-inset` вместо фиксированного поля окна; поверхность панели выступает за ось, не сдвигая текст. Сайт и стенд используют общие интервалы вступлений и секций. Все фоновые номера одного размера на данном viewport. `e2e/alignment.spec.ts` проверяет геометрию 38 локализованных страниц и стенда на четырёх ширинах.

Заголовок один, в основном полотне. SectionRail содержит код, тихий фоновый номер Manrope и заметку у нижнего края. StatisticsStamp на desktop находится в поле, на mobile следует после материала; заметка и фоновые знаки скрываются. RecordStamp использует непрерывную замкнутую сетку ячеек (подпись / значение), включая выходные данные. Три плана определены в DESIGN-GUIDE.md: среда и справочные данные → паспорт/схема → материал. Стенд использует эти же компоненты, без собственной копии стилей.
