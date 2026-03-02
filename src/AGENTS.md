# ODA.dream Multi-Agent System | Мультиагентная система

**Version:** 1.0.0  
**Status:** Production Ready  
**Philosophy:** Tech Noir Intelligence

---

## Overview | Обзор

This document describes the multi-agent architecture for managing the ODA.dream website in Cursor AI. The system consists of a main DevOps Lead Agent that coordinates specialized agents for content management, code quality, deployment, and testing.

Этот документ описывает мультиагентную архитектуру для управления сайтом ODA.dream в Cursor AI. Система состоит из главного DevOps Lead агента, который координирует специализированных агентов для управления контентом, качества кода, деплоя и тестирования.

---

## Agent Hierarchy | Иерархия агентов

```
DevOps Lead Agent (Coordinator)
├── Content Manager Agent
├── Code Quality Agent
├── Deploy & Release Agent
└── Testing Agent
```

---

## Agents | Агенты

### 1. DevOps Lead Agent

**Role:** Main coordinator with full project knowledge  
**Роль:** Главный координатор с полным знанием проекта

**Responsibilities | Обязанности:**
- Accept user requests and analyze task scope
- Delegate tasks to specialized agents
- Coordinate complex operations (releases, major updates)
- Make strategic architectural decisions
- Ensure quality and consistency across all changes

**Activation:** Always active (`alwaysApply: true`)  
**Configuration:** `.cursor/rules/devops-lead.mdc`

---

### 2. Content Manager Agent

**Role:** Specialist in Lotus CMS and bilingual content  
**Роль:** Специалист по Lotus CMS и билингвальному контенту

**Responsibilities | Обязанности:**
- Create and edit `.md` files in `src/content/`
- Maintain bilingual content (EN/RU)
- Generate procedural SVG assets
- Validate frontmatter and graph structure
- Sync dates and ensure content consistency

**Activation:** When working with `src/content/**/*.md`  
**Configuration:** `.cursor/rules/content-manager.mdc`, `.cursor/rules/lotus-cms.mdc`

**Key Commands:**
```bash
npm run assets:generate  # Generate SVG backgrounds
npm run assets:map       # Visualize content tree
npm run dates:sync       # Synchronize dates
```

---

### 3. Code Quality Agent

**Role:** Guardian of code standards and architecture  
**Роль:** Хранитель стандартов кода и архитектуры

**Responsibilities | Обязанности:**
- Refactor and optimize code
- Perform code reviews before commits
- Maintain TypeScript types and architecture
- Configure linting (ESLint, Prettier)
- Improve performance and accessibility

**Activation:** When working with `src/**/*.{ts,tsx}`  
**Configuration:** `.cursor/rules/code-quality.mdc`

**Standards:**
- TypeScript strict mode
- Functional React components
- Custom hooks for reusable logic
- Performance optimization (memoization, lazy loading)

---

### 4. Deploy & Release Agent

**Role:** Release management and CI/CD specialist  
**Роль:** Специалист по релизам и CI/CD

**Responsibilities | Обязанности:**
- Manage versions through `versions.json`
- Synchronize versions across all files
- Work with GitHub Actions workflows
- Create releases and tags
- Monitor deployments to GitHub Pages

**Activation:** When working with `versions.json`, `.github/workflows/`, `scripts/`  
**Configuration:** `.cursor/rules/deploy-release.mdc`

**Release Workflow:**
1. Update `versions.json` (add new version to `history[0]`)
2. Run `npm run version:sync`
3. Commit changes
4. Push to `main` → GitHub Actions deploys automatically

---

### 5. Testing Agent

**Role:** Quality assurance and validation specialist  
**Роль:** Специалист по обеспечению качества и валидации

**Responsibilities | Обязанности:**
- Set up testing framework (Vitest)
- Write unit and E2E tests
- Validate builds
- Check content integrity (orphaned nodes, broken links)

**Activation:** When working with tests  
**Configuration:** `.cursor/rules/testing-standards.mdc`

**Priority Areas:**
- Lotus Graph navigation
- Frontmatter parsing
- Asset generation
- Bilingual content handling

---

## Delegation Protocol | Протокол делегирования

The DevOps Lead Agent uses the following logic to delegate tasks:

```
IF task involves content (.md files, assets, graph structure)
  → Delegate to Content Manager Agent

IF task involves code (TypeScript, React, architecture)
  → Delegate to Code Quality Agent

IF task involves versions, releases, CI/CD
  → Delegate to Deploy & Release Agent

IF task involves testing, validation
  → Delegate to Testing Agent

IF task is complex (multiple areas)
  → Coordinate multiple agents sequentially or in parallel
```

---

## Autonomy Level | Уровень автономности

**Full Autonomy** (as configured):
- Agents make decisions independently
- Execute changes without confirmation
- Create commits automatically
- Deploy when necessary

**Exceptions** (require notification):
- Major versions (breaking changes)
- Content deletion
- CI/CD configuration changes
- Force push to main

---

## Project Glossary | Глоссарий проекта

### Lotus Graph Terminology

- **Node (Узел)**: Basic content unit
- **Hub**: Folder node with children (`type: hub`)
- **Content**: Article node (`type: content`)
- **Media**: Media node (`type: media`)
- **Action**: Action node (`type: action`)
- **Parent**: Parent node (defines hierarchy)
- **Order**: Sort order in grid (0-8)

### Key Concepts

- **Bilingual Content**: All content is EN/RU with `---RU---` separator
- **Frontmatter**: YAML metadata at the top of `.md` files
- **Wiki-link**: Custom syntax for media embedding `![[url|title|poster]]`
- **Procedural Generation**: Automatic SVG background creation based on node ID
- **Unified Graph**: Complete content tree built from individual `.md` files

---

## Workflow Examples | Примеры рабочих процессов

### Scenario 1: Add New Content

**User Request:** "Add a new lecture about neuroplasticity"

**DevOps Lead Actions:**
1. Delegates to Content Manager Agent
2. Content Manager creates `src/content/lectures-neuroplasticity.md`
3. Fills frontmatter and bilingual content
4. Runs `npm run assets:generate`
5. Validates with `npm run assets:map`
6. DevOps Lead confirms and commits

### Scenario 2: Create Release

**User Request:** "Create release 1.0.2 with new lectures"

**DevOps Lead Actions:**
1. Coordinates sequence:
   - Content Manager: finalizes content
   - Code Quality Agent: reviews changes
   - Testing Agent: validates build
2. Deploy & Release Agent:
   - Updates `versions.json`
   - Runs `npm run version:sync`
   - Creates commit and pushes to main
3. Monitors GitHub Actions
4. Verifies deployment at odadream.art

### Scenario 3: Refactor Component

**User Request:** "Optimize LotusGrid.tsx"

**DevOps Lead Actions:**
1. Delegates to Code Quality Agent
2. Code Quality Agent analyzes and refactors
3. Testing Agent validates navigation still works
4. DevOps Lead performs final review and commits

---

## Pre-Release Checklist | Чеклист перед релизом

- [ ] All new content has bilingual titles and descriptions
- [ ] `npm run assets:generate` executed for new nodes
- [ ] `npm run assets:map` shows no orphaned nodes
- [ ] `versions.json` updated with bilingual changelog
- [ ] `npm run version:sync` executed
- [ ] Local build successful (`npm run build`)
- [ ] No TypeScript errors (`tsc --noEmit`)

---

## Post-Deployment Checklist | Чеклист после деплоя

- [ ] GitHub Actions workflow completed successfully
- [ ] Site accessible at odadream.art
- [ ] New content displays correctly
- [ ] Navigation works (no 404s)
- [ ] GitHub Release created with correct tag

---

## Technical Reference | Техническая справка

### Critical Files

- [`package.json`](package.json) - Dependencies and npm scripts
- [`versions.json`](versions.json) - Version history with bilingual descriptions
- [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) - CI/CD pipeline
- [`src/constants.ts`](src/constants.ts) - Application configuration
- [`src/types.ts`](src/types.ts) - TypeScript types for Lotus Graph
- [`scripts/`](scripts/) - Automation utilities

### Key Constants

```typescript
SITE_VERSION = "v1.0.1"
ENABLE_THEME_SWITCHER = false
LOTUS_SORT_MODE = "by-mention"
LOTUS_GRID_LIMIT = 8
```

### npm Scripts

```bash
npm run dev              # Vite dev server
npm run build            # Full build with assets
npm run assets:generate  # Generate SVG backgrounds
npm run assets:clean     # Remove generated assets
npm run assets:map       # Visualize content tree
npm run version:sync     # Sync version across files
npm run dates:sync       # Sync dates in content
```

---

## Configuration Files | Файлы конфигурации

All agent rules are stored in `.cursor/rules/`:

- `devops-lead.mdc` - Main coordinator (always active)
- `content-manager.mdc` - Content management specialist
- `code-quality.mdc` - Code standards and architecture
- `deploy-release.mdc` - Release and deployment
- `testing-standards.mdc` - Testing strategy
- `project-architecture.mdc` - Core architecture knowledge (always active)
- `lotus-cms.mdc` - Lotus CMS specifics

---

## Philosophy | Философия

**"Tech Noir Intelligence"**

- **Autonomy**: Agents make decisions independently
- **Specialization**: Each agent is an expert in their domain
- **Coordination**: DevOps Lead knows when to delegate
- **Transparency**: All actions are logged and explained
- **Evolution**: Agents learn from project history

**Tone of Voice:**
- Technical, precise, concise
- Bilingual (EN/RU) like the project
- Uses project terminology (Lotus, Hub, Node)
- References specific files and code lines

---

**© 2018 - 2026 ODA.dream** | _Wellness Art Tech_
