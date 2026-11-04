---
id: ISSUE-0009
title: "Build a terminal-style GitHub profile with live public statistics"
status: done
priority: high
created: 2026-11-03
updated: 2026-11-03
closed: 2026-11-03
related_adrs: []
depends_on: []
---

# ISSUE-0009: Build a terminal-style GitHub profile with live public statistics

## Problem

The profile README is text-only and does not provide the approved ASCII portrait terminal layout or automatically refreshed public GitHub statistics.

## Desired outcome

Deliver responsive light and dark SVG profile cards, Chinese README project and contact sections, a tested Node.js generator, and an independent daily update workflow with reviewable previews.

## Acceptance criteria

- [x] The README presents the current GitHub avatar as ASCII, a Chinese terminal introduction, four real project links, contact links and an accessible text introduction.
- [x] Desktop and mobile SVG variants support light/dark themes without clipping or missing Chinese text at 375px and desktop widths.
- [x] Statistics count all public non-fork owned repositories, their Stars/Forks, followers, and public GitHub commit/PR/review contributions in the last 12 months, with explicit period and update time.
- [x] The generator paginates, excludes private/restricted contributions even with an owner token, rejects incomplete or failed API responses, and leaves the previous published assets unchanged on API failure.
- [x] A separate daily/manual GITHUB_TOKEN workflow updates only generated profile resources and does not change the website publishing workflow.
- [x] Focused behavior tests, existing project checks, live API verification, rendered theme/mobile review and read-only completion review have evidence; no local commit, push or deployment occurs.

## Out of scope

Website page code and styling, existing Issue 0008, Git history, repository permissions, personal access tokens, private activity, and publication.

## Decisions

The approved plan is the product contract. The module design is recorded under GitHub profile README in DESIGN.md before any implementation or behavior test is generated. Use Node.js ESM and the existing Vitest toolchain without new dependencies. Read current public GitHub identity/portrait; keep biography in profile/profile.json and portrait text in profile/portrait.txt. No private names, dates or contribution details are persisted.

## Implementation notes

- Fast-forwarded the initially clean local main from 8254588 to the existing remote commit 472ab015ba77280c2fff2ff99dfb24ecdd012e09 before implementation. Preserved the latest homepage-copy work and its separate Issue 0008.
- Implemented one owner for REST/GraphQL aggregation, explicit public-only filtering, calendar-clamped windows, SVG generation and schema/error validation. Manual inputs and generated resources are separate; no packages were added.
- Converted the actual GitHub avatar into a 44-column portrait, authored four theme/layout variants and restructured the Chinese README around the picture, accessible biography, projects and contacts.
- Browser acceptance exposed 8.43px body text beside a 900px GitHub-style sidebar. Widened the vertical-asset breakpoint to 1200px and protected minimum 12px text with a regression test. Fixed orphaned technology separators at mobile line breaks.
- Independent daily/manual workflow uses GITHUB_TOKEN and an explicit five-file staging list. The website source and deploy-pages workflow have no task diff.

## Verification

25 unit tests and 39 Chrome browser tests passed with lint, typecheck, 16 design checks, build, live GitHub API aggregation, real HTTP 401 snapshot preservation, Markdown sanitizer verification, four source-bound UI reports and read-only completion review.

## Activity log

### 2026-11-03 — Created

Issue created from the supplied project input.

### 2026-11-03 — Status changed from proposed to ready.

### 2026-11-03 — Status changed from ready to in-progress.

### 2026-11-03 — Status changed from in-progress to done.

## Completion summary

Delivered a Chinese terminal-style GitHub README with the current avatar as ASCII, four responsive theme/layout SVGs, tested public-only statistics generation, daily/manual update workflow, maintenance documentation and reviewable previews. No commit, push or publication performed.
