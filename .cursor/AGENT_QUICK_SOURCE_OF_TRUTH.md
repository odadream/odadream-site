# Agent Quick Source Of Truth

This file is a lightweight, low-drift reference for AI agents.

## Canonical Sources

- Project version: `versions.json` -> `current`
- Runtime dependencies and scripts: `package.json`
- App constants and feature flags: `src/constants.ts`
- Core domain types: `src/types.ts`
- CI/CD behavior: `.github/workflows/deploy.yml`
- Agent behavior rules: `.cursor/rules/*.mdc`

## Operational Rules

- Do not assume version numbers from prose docs; read `versions.json` first.
- For release behavior, follow workflow YAML, not historical examples.
- For git operations:
  - commits, pushes, releases, PR creation only on explicit user request
  - never run destructive git operations unless explicitly requested

## Documentation Hygiene

When updating architecture or process:

1. Update rule files in `.cursor/rules/` first.
2. Then sync high-level docs (`AGENTS.md`, `.cursor/README.md`, `README.md`).
3. Prefer durable wording over hardcoded counts (node totals, line counts).
