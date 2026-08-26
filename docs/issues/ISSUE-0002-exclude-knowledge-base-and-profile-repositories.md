---
id: ISSUE-0002
title: "Exclude knowledge base and profile repositories"
status: done
priority: high
created: 2026-08-26
updated: 2026-08-26
closed: 2026-08-26
related_adrs: []
depends_on: []
---

# ISSUE-0002: Exclude knowledge base and profile repositories

## Problem

The dynamic GitHub project feed currently includes the my-knowledge knowledge base repository and the frank9306 profile/homepage repository, which are navigation surfaces rather than portfolio projects.

## Desired outcome

Exclude my-knowledge and frank9306 from dynamically rendered GitHub project cards while preserving sorting, limits, expansion, and fallback behavior.

## Acceptance criteria

- [x] Dynamic GitHub repository mapping excludes `my-knowledge` and `frank9306` case-insensitively.
- [x] Other eligible repositories remain sorted by update time and retain their existing card data.
- [x] The four-project initial limit, ten-project expansion limit, and static API-failure fallback remain unchanged.
- [x] Automated tests prove both exclusions and guard an unrelated repository from accidental filtering.

## Out of scope

- Hiding other repositories or introducing a user-configurable exclusion list.
- Removing either repository from GitHub or from site navigation links.

## Decisions

- Match exclusions by exact repository name, case-insensitively.

## Implementation notes

- Added an exact lowercase exclusion set at the dynamic repository filter boundary.
- Advanced the project cache key to v3 so previously cached results containing either repository are not reused.

## Verification

typecheck, 11 unit/component tests, lint, build, 11 design checks, and 18 browser tests passed; review found no issues.

## Activity log

### 2026-08-26 — Created

Issue created from the supplied project input.

### 2026-08-26 — Status changed from proposed to ready.

### 2026-08-26 — Status changed from ready to in-progress.

### 2026-08-26 — Status changed from in-progress to done.

## Completion summary

Excluded my-knowledge and frank9306 from the dynamic GitHub project feed using exact case-insensitive repository-name matching.
