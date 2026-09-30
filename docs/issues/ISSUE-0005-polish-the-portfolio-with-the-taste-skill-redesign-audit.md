---
id: ISSUE-0005
title: "Polish the portfolio with the Taste Skill redesign audit"
status: done
priority: high
created: 2026-09-30
updated: 2026-09-30
closed: 2026-09-30
related_adrs: []
depends_on: []
---

# ISSUE-0005: Polish the portfolio with the Taste Skill redesign audit

## Problem

The current portfolio is coherent but still uses generic Inter typography, template-like hero metadata, and reveal behavior that can leave below-the-fold content invisible in full-page captures or non-scrolling previews.

## Desired outcome

Apply focused Taste Skill-inspired refinements that strengthen typographic identity, evidence hierarchy, interaction polish, and reliable content visibility while preserving the approved dark technical profile, routes, localization, data behavior, and dependencies.

## Acceptance criteria

- [x] The homepage uses a more distinctive, bilingual-safe typographic hierarchy without adding a package dependency.
- [x] The hero removes template-like decorative symbols and presents identity, focus, primary actions, and contact context in a clearer asymmetric composition.
- [x] Project rows provide obvious hover, pressed, and keyboard-focus feedback while retaining real repository content and destinations.
- [x] Below-the-fold content remains visible without requiring a successful scroll-observer callback, including reduced-motion and full-page capture contexts.
- [x] Routes, localization, GitHub fallback behavior, accessibility, and responsive layouts remain functional at desktop and 375px.

## Out of scope

- New dependencies, routes, content systems, project imagery, or deployment changes.
- Replacing the approved dark technical profile with the repository's aggressive GSAP or image-led variants.

## Decisions

- Use the linked repository's `redesign-existing-projects` audit as contextual guidance, not as a replacement for the project-owned `DESIGN.md`.
- Preserve React, TypeScript, Vite, and plain CSS; prefer type, spacing, structure, and interaction feedback over decorative effects.

## Implementation notes

- Replaced Inter with Manrope for Latin glyphs while retaining Microsoft YaHei and system fallbacks for Chinese and offline resilience.
- Tightened the shell, hero grid, type scale, accent, radii, section rhythm, and project evidence rows around the existing charcoal editorial direction.
- Replaced the hero's decorative glyphs with readable context labels and removed generic section kickers plus duplicate footer destinations.
- Expanded every project destination to the full row and added hover, pressed, and full-row keyboard-focus feedback.
- Removed observer-dependent reveal hiding so routes and below-the-fold sections are immediately present in the document and reliable in full-page captures.
- Added conditional Vitest worker arguments for Node 25+ so jsdom owns Web Storage during tests without affecting Node 22 and earlier.

## Verification

11 unit/component tests, lint, typecheck, production build, 11 design checks, a zero-finding static design scan, and 30 desktop/tablet/mobile browser tests passed; desktop and bilingual 375px captures were visually inspected; read-only diff review found no findings.

## Activity log

### 2026-09-30 — Created

Issue created from the supplied project input.

### 2026-09-30 — Status changed from proposed to ready.

### 2026-09-30 — Status changed from ready to in-progress.

### 2026-09-30 — Status changed from in-progress to done.

## Completion summary

Applied a focused Taste Skill-inspired redesign polish with stronger bilingual typography, a clearer asymmetric hero, full-row project interaction states, simplified footer content, and reliable below-the-fold visibility.
