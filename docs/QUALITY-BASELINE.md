# V2 quality baseline — 2026-09-22

Исторические лабораторные измерения с указанной ниже датой; не описание текущих блокировок выпуска. Актуальная проверка — отчёт verify/full/release, статусы — PROJECT-BACKLOG.yaml.

Audit note — 2026-09-24: the code-level audit added lazy hero video/poster attachment and moved the legacy redirect catalogue to `/legacy-map.json`. The metrics below predate these changes and are not evidence of their performance impact. A repeatable desktop/mobile measurement is tracked as `PERF-01`; do not replace this baseline until that run is complete.

Current verification on 2026-09-24: 8 unit tests, content check, Astro check, static build verification, and 32 Playwright scenarios passed; 4 duplicate mobile viewport-matrix cases were intentionally skipped. The geometry matrix covered all 38 localized routes and the design stand at 360/797/1529/1920 px. Its image/video requests are blocked so the test measures layout axes without exhausting the local browser; other Playwright scenarios exercise media and document previews. This is a functional check, not a new Lighthouse measurement.

Production build tested locally at `http://127.0.0.1:5178/en/` with Lighthouse mobile emulation:

| Metric              | Result |
| ------------------- | -----: |
| Performance         |     99 |
| Accessibility       |    100 |
| Best Practices      |     96 |
| SEO                 |    100 |
| LCP                 | 1.97 s |
| CLS                 |  0.016 |
| Total Blocking Time |   0 ms |

The initial Best Practices score of 96 was caused solely by a missing implicit `/favicon.ico`; the layout now declares `/brand/oda-brain.svg` as its favicon. Re-run Lighthouse during final preview and after the public cutover because network, GitHub Pages caching and the production domain can change field behaviour. INP requires real interaction/field data; TBT is recorded here only as a laboratory proxy.

Automated checks at this baseline: 4 content/legacy unit tests, 10 desktop/mobile Playwright scenarios, axe serious/critical scan on five representative pages, Astro typecheck, static HTML/SEO/sitemap verification, 238 explicit legacy ID mappings, no horizontal overflow on the tested mobile viewport, and lightbox Escape/focus-return behaviour.

The release gate remains intentionally red for editorial approval, seven image-rights decisions and 172 historical media URL decisions. This baseline is for review, not permission to deploy.
