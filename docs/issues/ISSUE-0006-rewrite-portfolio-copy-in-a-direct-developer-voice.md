---
id: ISSUE-0006
title: "Rewrite portfolio copy in a direct developer voice"
status: done
priority: high
created: 2026-09-30
updated: 2026-09-30
closed: 2026-09-30
sources: ["https://github.com/leonxlnx/taste-skill"]
related_adrs: []
depends_on: []
---

# ISSUE-0006: Rewrite portfolio copy in a direct developer voice

## Problem

The site copy is concise but several high-visibility lines rely on abstract claims and portfolio clichés such as reliable, genuinely save time, continuously building, and a problem worth solving, which makes the voice sound generic rather than personal.

## Desired outcome

Rewrite the bilingual homepage, project introduction, 404, calls to action, and metadata in a direct first-person developer voice grounded in the actual tools and problems represented by the site.

## Acceptance criteria

- [x] The Chinese and English hero copy identifies what Frank builds in direct first-person language without unsupported quality claims.
- [x] The about section names concrete problems represented by the existing projects instead of generic focus or methodology statements.
- [x] Project-page, contact, footer, 404, CTA, document-title, and metadata copy is concise, natural, and semantically equivalent across both locales.
- [x] Existing project facts, links, routes, localization, responsive layout, and accessible names remain correct.
- [x] Tests, lint, typecheck, build, design checks, and browser verification pass after the copy changes.

## Out of scope

- Inventing metrics, client claims, testimonials, project outcomes, or new biographical facts.
- Changing layout, styling, dependencies, routes, or GitHub data behavior.

## Decisions

- Prefer first person, concrete nouns, active verbs, and short sentences.
- Preserve English meaning rather than translating Chinese word order literally.
- Keep technical terms such as AI Agent, Codex, GitHub, and Agent Skills where they identify real work.

## Implementation notes

- Rewrote the bilingual hero, about, project-page, footer, contact, CTA, and 404 copy around concrete work and first-person statements.
- Updated project descriptions, document titles, and metadata without adding claims, metrics, or biographical details.
- Added focused unit and browser assertions for the revised copy and document titles.

## Verification

Unit tests, lint, typecheck, design checks, build, and 30 browser tests passed; manual desktop and mobile screenshot review found no copy overflow or material wrapping defects.

## Activity log

### 2026-09-30 — Created

Issue created from the supplied project input.

### 2026-09-30 — Status changed from proposed to ready.

### 2026-09-30 — Status changed from ready to in-progress.

### 2026-09-30 — Status changed from in-progress to done.

## Completion summary

Rewrote the bilingual portfolio copy in a direct first-person voice grounded in existing projects and concrete problems, without adding unsupported claims.
