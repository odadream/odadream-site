# ODA.dream V5 → V2 design-system contract

Approved reference: `c82a7c7:design-lab/oda-v5-prototype/design-system.html` and its `style.css`. The V5 reference remains frozen in Git. The active, noindex specimen is `/design-system/` in this branch.

The site and specimen both import `src/styles/global.css`, which imports the single semantic token source `src/styles/tokens.css`. The specimen adds `src/styles/design-system.css` only for its documentation layout. It uses the same `WorkCard`, `MediaFigure`, navigation shell, links, buttons and statuses as public pages; it does not define a competing palette.

The `/design-system/` page also documents the full-bleed moving-image hero: the header carries the brand signature once, while the hero holds the independent epigraph, artwork-led frame, secondary work caption and restrained aggregate-data panel. Hero surfaces, scrim and heights are semantic tokens. The displayed MindDB figure is a dated, review-gated snapshot; it must not be treated as approved public data, and rhythm bars remain absent until their methodology and publication are cleared.

Numbering is scoped rather than continuous: section markers render as `S·NN`, the hero carousel is explicitly labelled `КАДР / FRAME · NN / total`, and method stages render as `M·NN`. Work cards are intentionally unnumbered; category and a typed, localized status distinguish each card.

## Carried from V5

- Three tonal planes, restrained signal/accent color, ink/muted/alert/error roles.
- JetBrains Mono body and documentation; Manrope headings; Cyrillic font subsets bundled locally.
- 4 px spacing scale, 40 / 24 / 16 px gutters, 1360 px maximum container.
- No routine section rules; quiet rules for data rows; close text underlines only for editorial links.
- Distinct navigation, action, disabled and status treatments; 44 px controls and visible keyboard focus.
- Work-first cards, material captions, gallery/lightbox, citation, error and provenance patterns.

## V2 additions

The featured-work carousel, motion-preview state and three-step method explainer are new presentation patterns. They reuse V5 tokens and are demonstrated or described on the active specimen. Motion stops for reduced-motion, data saver and hidden tabs. A moving still is not labeled as footage; only verified source clips can be assigned as `previewSrc`.

When a visual rule changes, edit tokens or live component styles first, update `/design-system/` to demonstrate it, and check both RU/EN pages at desktop and mobile widths. The design-system route must remain out of sitemap and `noindex`.
