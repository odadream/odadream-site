# ODA.dream Project Structure

**Git Repository Root:** `D:/YandexDisk/_ODA2/Сайт/odadream-site`

**CRITICAL:** Always use `working_directory` parameter when running shell commands!

```
D:\YandexDisk\_ODA2\Сайт\odadream-site\  ← ROOT (always work from here!)
│
├── .cursor/                      # AI Agent rules (Cursor IDE config)
│   ├── rules/
│   │   ├── devops-lead.mdc
│   │   ├── content-manager.mdc
│   │   ├── code-quality.mdc
│   │   ├── deploy-release.mdc
│   │   ├── testing-standards.mdc
│   │   ├── project-architecture.mdc
│   │   └── lotus-cms.mdc
│   ├── ONBOARDING.md
│   ├── README.md
│   └── PROJECT_STRUCTURE.md
│
├── src/                          # Source code
│   ├── components/               # React components
│   │   ├── LotusGrid.tsx        # Main navigation (809 lines)
│   │   ├── LotusSidebar.tsx
│   │   ├── TextPanel.tsx
│   │   ├── Lightbox.tsx
│   │   ├── HeaderTabs.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── CyberText.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   ├── content/                  # CMS - 84 markdown files
│   │   ├── home.md
│   │   ├── lectures-*.md
│   │   ├── works-*.md
│   │   └── ...
│   │
│   ├── context/
│   │   └── NavigationContext.tsx
│   │
│   ├── hooks/
│   │   ├── useLotusLogic.ts
│   │   ├── useImageFallback.ts
│   │   └── useScrollOverflow.ts
│   │
│   ├── utils/
│   │   ├── contentLoader.ts     # Graph builder
│   │   ├── frontmatter.ts       # YAML parser
│   │   ├── contentProcessor.ts  # Markdown processor
│   │   ├── nodeHelpers.ts
│   │   └── mediaHelpers.ts
│   │
│   ├── styles/
│   │   ├── theme.ts
│   │   └── animations.ts
│   │
│   ├── constants.ts              # Configuration
│   ├── types.ts                  # TypeScript types
│   ├── index.css                 # Global styles
│   └── index.tsx                 # Entry point
│
├── public/                       # Static assets
│   └── images/
│       ├── assets/              # Logos, favicon
│       ├── content/             # Content images
│       └── nodes/               # Generated SVG backgrounds (58 files)
│
├── scripts/                      # Automation
│   ├── generate-assets.js       # SVG generation
│   ├── update-version.js        # Version sync
│   ├── generate-map.js          # Content tree
│   └── sync-dates.js            # Date sync
│
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD pipeline
│
├── dist/                         # Production build output
│
├── AGENTS.md                     # Multi-agent system docs
├── README.md                     # Project documentation
├── versions.json                 # Version history (source of truth)
├── package.json                  # Dependencies
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── index.html                   # HTML entry point

```

## Shell Command Pattern

**ALWAYS use working_directory:**

```typescript
// ✅ CORRECT
Shell({
  command: "npm run build",
  working_directory: "d:\\YandexDisk\\_ODA2\\Сайт\\odadream-site"
})

// ❌ WRONG (will drift to src/ or other subdirectories)
Shell({
  command: "cd src && npm run build"
})
```

## Key Paths

**Root:** `d:\YandexDisk\_ODA2\Сайт\odadream-site`

**Agent Rules:** `.cursor\rules\*.mdc`

**Content:** `src\content\*.md`

**Components:** `src\components\*.tsx`

**Utils:** `src\utils\*.ts`

**Scripts:** `scripts\*.js`

**Config:** Root level (vite.config.ts, package.json, etc.)

## Common Mistakes

1. ❌ Running commands without `working_directory` → drifts to `src/`
2. ❌ Using `cd` in commands → state persists, causes confusion
3. ❌ Using relative paths without verifying current directory

## Solution

✅ **Always specify `working_directory` parameter** in Shell tool
✅ **Use absolute paths** when reading/writing files
✅ **Verify location** with `git rev-parse --show-toplevel` if unsure
