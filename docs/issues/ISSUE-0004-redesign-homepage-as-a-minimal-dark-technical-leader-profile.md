---
id: ISSUE-0004
title: "Redesign homepage as a minimal dark technical-leader profile"
status: done
priority: high
created: 2026-08-26
updated: 2026-08-26
closed: 2026-08-26
related_adrs: []
depends_on: []
---

# ISSUE-0004: Redesign homepage as a minimal dark technical-leader profile

## Problem

The current homepage uses decorative developer-template motifs and card-heavy hierarchy that do not communicate the requested simple, professional, quietly impressive identity.

## Desired outcome

Implement the approved dark homepage preview with evidence-first hierarchy while preserving routing, localization, project data behavior, accessibility, and responsive support.

## Acceptance criteria

- [x] The homepage hero identifies Frank as an AI Agent and automation tools developer and exposes direct project and GitHub actions.
- [x] The homepage presents up to four selected projects as restrained horizontal evidence rows without decorative technology-pill cards.
- [x] Navigation, footer, projects route, localization, GitHub data fallback, skip link, keyboard focus, and reduced-motion behavior remain usable.
- [x] The approved charcoal, warm-white, muted-gray, and restrained-blue design is responsive at desktop and 375px without horizontal scrolling.
- [x] Relevant component tests, lint, typecheck, build, design checks, and browser checks pass.

## Out of scope

- Adding dependencies, new routes, content management, project screenshots, or deployment changes.
- Changing GitHub API behavior or the existing project catalogue.

## Decisions

- Use the user-approved dark preview as the visual authority.
- Preserve the existing React, TypeScript, Vite, and plain-CSS stack.
- Let real project descriptions and repository links provide credibility instead of decorative claims.

## Implementation notes

- Reworked the hero into an evidence-first technical-leader introduction with direct projects and GitHub actions plus restrained contact context.
- Replaced the homepage card treatment with four horizontal selected-work rows backed by the existing GitHub and fallback data flow.
- Simplified the header, about section, footer, typography, color, spacing, radius, and motion system to match the approved charcoal preview.
- Preserved the projects route, bilingual navigation, mobile menu, fallback behavior, keyboard focus, and reduced-motion support.
- Tuned the 375px hero heading to avoid a single-character Chinese orphan while retaining the desktop hierarchy.

## Verification

Typecheck, 11 unit/component tests, lint, production build, 11 design checks, and 24 browser tests passed across desktop, tablet, and 375px mobile Chrome. Desktop and 375px screenshots were inspected; review found no unresolved findings.

## Activity log

### 2026-08-26 — Created

Issue created from the supplied project input.

### 2026-08-26 — Status changed from proposed to ready.

### 2026-08-26 — Status changed from ready to in-progress.

### 2026-08-26 — Status changed from in-progress to done.

## Completion summary

Implemented the approved minimal dark homepage redesign with a direct technical-leader hero, restrained selected-work evidence, responsive bilingual navigation, and preserved project data behavior.
