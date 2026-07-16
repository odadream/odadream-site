# Cursor AI Configuration

This folder contains the multi-agent system configuration for managing the ODA.dream project in Cursor AI.

## Overview

The configuration implements a **DevOps Lead Agent** that coordinates specialized agents for content management, code quality, deployment, and testing.

## Slash commands

В Agent chat: **`/sync-docs`** — синхронизация документации с кодом и [`CONTENT-SCHEMA.md`](../CONTENT-SCHEMA.md); drift схема↔код → [`content-keeper/BACKLOG.md`](../content-keeper/BACKLOG.md).

- Определение: [`.cursor/commands/sync-docs.md`](commands/sync-docs.md)
- Playbook: [`content-keeper/SYNC-DOCS.md`](../content-keeper/SYNC-DOCS.md)
- Журнал: [`content-keeper/SYNC-DOCS-LOG.md`](../content-keeper/SYNC-DOCS-LOG.md)

## Files

### AGENTS.md (Project Root)
Main documentation file describing the entire multi-agent system, workflows, and philosophy.

### rules/

Specialized agent rules that activate based on context:

- **devops-lead.mdc** - Main coordinator (always active)
- **project-architecture.mdc** - Core architecture knowledge (always active)
- **content-manager.mdc** - Activates when working with `src/content/**/*.md`
- **lotus-cms.mdc** - Activates when working with content files
- **code-quality.mdc** - Activates when working with `src/**/*.{ts,tsx}`
- **deploy-release.mdc** - Activates when working with versions, CI/CD
- **testing-standards.mdc** - Activates when working with tests

## How It Works

1. **DevOps Lead Agent** is always active and analyzes user requests
2. Based on the task, it delegates to appropriate specialized agents
3. Specialized agents activate automatically when relevant files are open
4. All agents work autonomously with full project knowledge

## Agent Roles

**DevOps Lead** → Main coordinator, strategic decisions
**Content Manager** → Lotus CMS, bilingual content, assets
**Code Quality** → TypeScript, React, architecture, refactoring
**Deploy & Release** → Versions, CI/CD, GitHub Actions
**Testing** → Quality assurance, validation, tests

## Quick Start

The system is ready to use. Simply:

1. Open Cursor AI in this project
2. Start working or ask questions
3. Agents will activate automatically based on context

## Examples

**"Add a new lecture about neuroplasticity"**
→ DevOps Lead delegates to Content Manager Agent

**"Optimize LotusGrid.tsx"**
→ DevOps Lead delegates to Code Quality Agent

**"Create release 1.0.2"**
→ DevOps Lead coordinates Deploy & Release Agent

## Documentation

For complete documentation, see:
- `AGENTS.md` - Multi-agent system overview
- `README.md` (project root) - Project documentation
- Individual `.mdc` files in `rules/` - Detailed agent knowledge
- `AGENT_QUICK_SOURCE_OF_TRUTH.md` - Low-drift operational reference

## Version

**System Version:** 1.2.0
**Project Version:** 1.2.0 (from `versions.json`)
**Status:** Production Ready

---

**© 2018 - 2026 ODA.dream** | _Wellness Art Tech_
