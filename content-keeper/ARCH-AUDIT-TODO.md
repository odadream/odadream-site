# Architecture audit — remaining items

Picked up from the post-Phase-F audit on 2026-05-30. Items 1, 2, 3, 4, 5, 7, 8
were done in commits `2fa4bfe` and `af62fc1`. What's left:

## High-impact, deferred

### 6. Lazy `contentLoader.ts`
- **Where**: `src/utils/contentLoader.ts:11`.
- **What**: `import.meta.glob('../content/*.md', { eager: true })` parses all 154
  files synchronously at module init. Currently this work happens before the
  app can paint anything.
- **Idea**: switch to `eager: false`, return modules lazily, wrap consumers in
  Suspense. The graph would build incrementally as nodes are first visited.
- **Why deferred**: real architectural rework. Lots of code assumes `ROOT_NODE`
  is fully populated at import time (`NODE_REGISTRY`, `provenance.ts` cache,
  `findPathToNode` from URL on first render). Needs a designed migration, not
  a quick swap.
- **Estimated effort**: 1–2 days including verification.

## Medium-impact, low-priority

### 9. Branded `NodeId` type
- **Where**: `src/types.ts:135-159`.
- **What**: `presented_at`, `products`, `organizer`, `client`, `proofs`,
  `proof_of`, `about`, `issued_by`, `media` are all `string[]` — they're always
  node ids, but the type system doesn't know.
- **Idea**:
  ```ts
  type NodeId = string & { readonly __brand: "NodeId" };
  const asNodeId = (s: string): NodeId => s as NodeId;
  ```
  Update `frontmatter.ts` to wrap each id with `asNodeId`. Update field types
  to `NodeId[]`.
- **Why deferred**: no real bugs the brand would currently catch. Pure type
  hygiene, useful if more relation fields are added in the future.
- **Estimated effort**: 1–2 hours.

### 10. ESLint with strict config
- **Where**: project root — no `.eslintrc` exists.
- **What**: only `tsc --noEmit` runs in CI. ESLint would catch a small set of
  things `tsc` won't:
  - Remaining `as any` casts (the audit found one in `contentLoader.ts:33`,
    fixed in `2fa4bfe`; others may surface).
  - Missing `useEffect` / `useMemo` deps.
  - Unused vars / imports.
- **Suggested config**: `eslint:recommended` +
  `@typescript-eslint/plugin:strict` + `react-hooks/recommended`.
- **Why deferred**: not blocking, low immediate ROI, but worth doing before the
  codebase grows further.
- **Estimated effort**: 1 hour to wire up + a few hours to triage initial
  reports.

## Content quality follow-up

### Body-prose contamination from prefix migration
- **Where**: `src/content/hub-home.md` body has `"hub-research space"` — the
  textual replace (`research → hub-research`) hit a normal word in prose.
  Likely happened in other hub bodies too (`works`, `events`, `collab`).
- **What**: grep all `src/content/*.md` bodies for `hub-<word>` followed by a
  Latin/Cyrillic letter or space, surface false positives.
- **Idea**: write a one-off scan in `scripts/audit/find-prose-leaks.js` that
  reads each body, finds `hub-X` occurrences NOT inside `[[...]]`, lists them
  for manual review.
- **Estimated effort**: 30 min for the scan + 1–2 hours of manual edits.

## Phase F remainders (already tracked separately)
See `content-keeper/PHASE-F-TODO.md` — registry-data and human-decision items
(25 proofs missing `issued_by`, 16 hub pages with manual link lists,
`for-events`/`events` title duplicate, etc.). Independent from the audit list.
