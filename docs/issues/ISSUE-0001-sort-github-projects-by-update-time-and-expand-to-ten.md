---
id: ISSUE-0001
title: "Sort GitHub projects by update time and expand to ten"
status: done
priority: high
created: 2026-08-26
updated: 2026-08-26
closed: 2026-08-26
related_adrs: []
depends_on: []
---

# ISSUE-0001: Sort GitHub projects by update time and expand to ten

## Problem

The portfolio currently renders four fixed project definitions and only enriches them with GitHub metadata, so recently updated repositories cannot appear automatically and visitors cannot reveal more projects.

## Desired outcome

Render public GitHub repositories ordered by latest update, show four initially, and reveal up to ten after an accessible More action while preserving the current offline fallback.

## Acceptance criteria

- [x] Successful GitHub responses are converted into project cards dynamically instead of being limited to the four curated definitions.
- [x] Public, non-fork, non-archived repositories are sorted by `updated_at` descending, with deterministic ordering for equal timestamps.
- [x] The home page shows the four most recently updated repositories.
- [x] The projects page initially shows four repositories and exposes an accessible bilingual More control only when more than four are available.
- [x] Activating More reveals at most the ten most recently updated repositories without navigating or reloading the page.
- [x] Repository name, description, primary language, stars, update date, topics, and GitHub URL render safely when optional GitHub fields are absent.
- [x] Loading, cached data, and GitHub failure behavior remain explicit; an API failure retains the current four-project static fallback.
- [x] Unit and browser tests cover sorting, dynamic repository mapping, the initial limit, expansion, and fallback behavior.

## Out of scope

- Pagination beyond the ten most recently updated repositories.
- Authenticated GitHub API access or private repositories.
- Manual ranking or pinning of repositories.

## Decisions

- Treat forks and archived repositories as outside the personal project portfolio.
- Keep the home page as a four-project summary; place the More interaction on the dedicated projects page.

## Implementation notes

- Replaced fixed-definition matching with dynamic GitHub repository mapping while retaining curated metadata when a repository has a local definition.
- Filters forked and archived repositories, sorts by `updated_at` descending with repository-name tie-breaking, and supplies safe defaults for optional API fields.
- The home page slices the latest four projects; the projects page owns an accessible bilingual expansion state capped at ten.
- Bumped the local cache key to v2 so clients do not reuse the previous fixed four-project payload.

## Verification

typecheck, 11 unit/component tests, lint, production build, 11 design checks, and 18 browser tests passed; review has no unresolved findings.

## Activity log

### 2026-08-26 — Created

Issue created from the supplied project input.

### 2026-08-26 — Status changed from proposed to ready.

### 2026-08-26 — Status changed from ready to in-progress.

### 2026-08-26 — Status changed from in-progress to done.

## Completion summary

GitHub repositories now render dynamically by update time, with four shown initially and an accessible expansion to ten.
