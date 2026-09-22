# V2 quality baseline — 2026-09-22

Production build tested locally at `http://127.0.0.1:5178/en/` with Lighthouse mobile emulation:

| Metric | Result |
|---|---:|
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 96 |
| SEO | 100 |
| LCP | 1.97 s |
| CLS | 0.016 |
| Total Blocking Time | 0 ms |

The initial Best Practices score of 96 was caused solely by a missing implicit `/favicon.ico`; the layout now declares `/brand/oda-brain.svg` as its favicon. Re-run Lighthouse during final preview and after the public cutover because network, GitHub Pages caching and the production domain can change field behaviour. INP requires real interaction/field data; TBT is recorded here only as a laboratory proxy.

Automated checks at this baseline: 4 content/legacy unit tests, 10 desktop/mobile Playwright scenarios, axe serious/critical scan on five representative pages, Astro typecheck, static HTML/SEO/sitemap verification, 238 explicit legacy ID mappings, no horizontal overflow on the tested mobile viewport, and lightbox Escape/focus-return behaviour.

The release gate remains intentionally red for editorial approval, seven image-rights decisions and 172 historical media URL decisions. This baseline is for review, not permission to deploy.
