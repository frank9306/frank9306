---
id: ISSUE-0010
title: "Restore likeness and proportions in the GitHub ASCII portrait"
status: done
priority: medium
created: 2026-11-04
updated: 2026-11-04
closed: 2026-11-04
related_adrs: []
depends_on: []
---

# ISSUE-0010: Restore likeness and proportions in the GitHub ASCII portrait

## Problem

The 44-column portrait stretches the avatar vertically and loses the sunglasses and face silhouette; one grayscale polarity is also inverted on a dark background.

## Desired outcome

Replace the portrait with higher-resolution, aspect-correct light/dark character art derived from the existing avatar, preserving the terminal layout and statistics.

## Acceptance criteria

- [x] Derive higher-resolution character portraits from the existing avatar, preserving the crop's proportions and the recognizable hair, sunglasses, nose and mouth.
- [x] Light/dark versions preserve their intended photographic luminance instead of showing a negative on dark backgrounds.
- [x] Fit the portrait into the existing desktop/mobile slots without horizontal stretching, clipped glyphs or overlap with the introduction.
- [x] Preserve profile copy/statistics/update time and provide a before/after preview, focused regression checks and read-only review.

## Out of scope

Profile text, statistics fetching, publication, website pages and unrelated outstanding changes from Issue 0009.

## Decisions

Diagnosis: the original square source was sampled to 44x31 cells but drawn at 6.72x13.7px per cell, compressing its apparent width to approximately 70% of the source ratio. The manual coarse crop and 10-level low resolution further obscured the face. Reuse the generator owner and its existing contract; add only an optional portraitDark text input, with the existing portrait string remaining the fallback. Fit glyph size uniformly into the reserved slot using fixed cell proportions (0.6em wide, 1.2em line pitch). Sample an 80x54 grid from a 340x460px face crop, suppress source grid lines and derive the subject mask from source colors rather than geometric cutouts. Store separate light/dark density mappings. Re-render existing aggregate statistics without contacting GitHub or changing their timestamp.

## Implementation notes

- Rebuilt two 80x54 theme-specific grids from the original stored avatar. Used a median filter to remove the source grid, source-color foreground segmentation, and a 340x460 face crop. Preserved hairstyle, the tilted sunglasses, nose/mouth and jaw outline.
- Replaced independent font/line-pitch scaling with uniform 0.6em/1.2em glyph-cell scaling into the existing reserved slots. Increased portrait contrast using existing foreground tokens.
- Added the same owner's validated renderProfile operation and CLI --render-only route to regenerate artwork without HTTP, token access or statistic refresh. Existing callers retain the portrait-string fallback.
- Updated all four generated SVGs, maintenance instructions, standalone preview and original/previous/corrected comparison. Statistics JSON remains byte-for-byte identical to Issue 0009's verified snapshot.

## Verification

27 unit tests, 39 Chrome browser tests, lint, typecheck, 16 design checks, build, syntax checks, four revalidated source-bound UI reports, visual comparison and unchanged statistics SHA-256.

## Activity log

### 2026-11-04 — Created

Issue created from the supplied project input.

### 2026-11-04 — Status changed from proposed to ready.

### 2026-11-04 — Status changed from ready to in-progress.

### 2026-11-04 — Status changed from in-progress to done.

## Completion summary

Corrected portrait likeness with higher-resolution, proportionate light/dark character grids, source-derived masking and uniform glyph scaling; added offline artwork rendering and before/after previews while preserving the verified statistics snapshot.
