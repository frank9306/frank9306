---
id: ISSUE-0007
title: "Redesign portfolio as an editorial systems workbench"
status: done
priority: high
created: 2026-09-30
updated: 2026-09-30
closed: 2026-09-30
sources: ["https://github.com/leonxlnx/taste-skill"]
related_adrs: []
depends_on: []
---

# ISSUE-0007: Redesign portfolio as an editorial systems workbench

## Problem

The current dark technical profile is functional but visually generic: the hero lacks a signature visual, project evidence repeats one list pattern, large empty areas weaken the first impression, and the interface does not express Frank's hands-on approach to agents, verification, and automation.

## Desired outcome

Recompose the existing bilingual portfolio into a distinctive editorial systems-workbench experience with original visual assets, clearer content hierarchy, an asymmetric responsive layout, and complete accessible interaction states while preserving routes, project data, and external destinations.

## Acceptance criteria

- [x] The first viewport presents Frank's focus, one clear projects action, and an original project-owned visual asset without generic AI imagery or decorative status copy.
- [x] The homepage uses at least four distinct layout families across the hero, practice areas, selected projects, about statement, and contact footer without repeated equal-card or split-header templates.
- [x] Chinese and English copy stays direct, specific, semantically equivalent, and free of unsupported claims, invented metrics, em dashes, and decorative location or version metadata.
- [x] The design uses one vermilion accent, one coherent shape system, light and dark theme tokens, motivated motion, and reduced-motion fallbacks.
- [x] Existing `/`, `/projects`, and not-found routes, GitHub data behavior, external destinations, localization, keyboard navigation, and accessible names remain correct.
- [x] Desktop, tablet, and 375px mobile views have no horizontal overflow, clipped focus states, unreadable contrast, or broken content wrapping.
- [x] Unit tests, lint, typecheck, design checks, production build, browser tests, and rendered screenshot review pass.

## Out of scope

- Changing route slugs, repository selection and sorting behavior, external URLs, or GitHub API contracts.
- Adding unverified biography, client work, testimonials, performance claims, metrics, legal pages, or analytics.
- Migrating the framework, CSS approach, package manager, or adding animation and component dependencies.

## Decisions

- Treat the request as a redesign-overhaul: preserve information architecture and real project facts while replacing the visual language and page composition.
- Use an editorial systems-workbench thesis: cold paper and graphite surfaces, a single vermilion signal, tactile generated photography, asymmetric grids, and sharp rectangular geometry.
- Set Taste Skill dials to DESIGN_VARIANCE 8, MOTION_INTENSITY 5, and VISUAL_DENSITY 4.
- Use native CSS and the existing React stack. Motion must communicate hierarchy or interaction feedback and must honor reduced-motion preferences.
- Generate original project-owned imagery instead of fake software screenshots, stock office scenes, abstract SVG decoration, or gradient blobs.

## Implementation notes

- Rebuilt the homepage around five distinct compositions: an asymmetric visual hero, practice map, project matrix, overlapping process image and statement, and vermilion contact footer.
- Rewrote the bilingual hero, practice, about, project, contact, metadata, and recovery copy without adding biography, metrics, clients, or outcomes.
- Generated two original tactile workbench images, converted them to optimized project-owned WebP assets, and added mobile-specific crops.
- Added automatic light and dark tokens, a single vermilion accent family, sharp geometry, self-hosted Manrope WOFF2, motivated entry and feedback motion, and reduced-motion fallbacks.
- Preserved routes, GitHub loading and fallback behavior, external URLs, language persistence, responsive navigation, and full-card repository links.
- Updated the favicon, social card, design contract, static design checks, unit expectations, and browser expectations to match the new system.

## Verification

Eleven unit tests and 30 browser tests passed with lint, typecheck, design checks, build, static frontend scan, rendered desktop and mobile review, and production Lighthouse scores of 99 performance and 100 accessibility, best practices, and SEO.

## Activity log

### 2026-09-30 — Created

Issue created from the supplied project input.

### 2026-09-30 — Status changed from proposed to ready.

### 2026-09-30 — Status changed from ready to in-progress.

### 2026-09-30 — Status changed from in-progress to done.

## Completion summary

Redesigned the bilingual portfolio as an editorial systems workbench with original optimized imagery, an asymmetric responsive layout, direct copy, automatic light and dark themes, and preserved project functionality.
