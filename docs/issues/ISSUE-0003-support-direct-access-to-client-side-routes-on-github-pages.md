---
id: ISSUE-0003
title: "Support direct access to client-side routes on GitHub Pages"
status: done
priority: high
created: 2026-08-26
updated: 2026-08-26
closed: 2026-08-26
related_adrs: []
depends_on: []
---

# ISSUE-0003: Support direct access to client-side routes on GitHub Pages

## Problem

Direct requests to https://webfrank.top/projects return the GitHub Pages platform 404 before the React application can inspect window.location.pathname.

## Desired outcome

Direct visits and refreshes for supported client-side routes load the application while genuinely unknown routes continue to render the site Not Found page.

## Acceptance criteria

- [x] A direct HTTP visit or browser refresh at `/projects` boots the application and renders the projects page.
- [x] Navigation from `/` to `/projects` continues to work without a full-page reload.
- [x] A direct visit to an unknown path boots the application and renders the existing site Not Found page.
- [x] The deployed GitHub Pages artifact contains the fallback entry required for client-side routing.
- [x] Automated verification covers direct entry at `/projects` against a production-like static server behavior.

## Out of scope

- Replacing the current pathname-based router with a routing dependency.
- Changing the custom domain or hosting provider.

## Decisions

- Proposed correction boundary: add a GitHub Pages-compatible SPA fallback to the build/deploy artifact while preserving the existing React route selection.

## Diagnosis

### Reproduction

- `curl.exe -I https://webfrank.top/` returns `200 OK` with the deployed application HTML.
- `curl.exe -I https://webfrank.top/projects` returns the GitHub Pages platform `404 Not Found` document.
- `/projects/` and an arbitrary missing path return the same platform 404 response.

### Confirmed root cause

The Pages workflow uploads `dist/` after the Vite build, but the public/build inputs contain no `404.html` fallback. GitHub Pages therefore resolves `/projects` as a physical path, fails before serving `index.html`, and never starts React. `App.tsx` can render `ProjectsPage` for `window.location.pathname === '/projects'` only after the application entry document has loaded.

### Rejected hypotheses

- The React route table is not missing `/projects`; `App.tsx` explicitly handles it and in-app navigation is covered by browser tests.
- The custom domain is not generally broken; `/` returns the current deployed application with HTTP 200.
- A trailing slash does not fix the problem; `/projects/` returns the same Pages 404.

### Regression test boundary

Build the production artifact, serve it with GitHub Pages-like fallback behavior, and assert that direct entry at `/projects` loads the projects heading rather than a platform 404.

## Implementation notes

- Added `public/404.html` to encode the requested path and redirect GitHub Pages misses through the root application entry.
- Added an early `index.html` bootstrap that accepts only safe same-origin path values, restores the original URL with `history.replaceState`, and then allows the existing React route selection to run.
- Added Playwright coverage that serves the custom document with an HTTP 404 for both `/projects` and an unknown path, proving supported and not-found routes after restoration.

## Verification

Focused TDD test, typecheck, 11 unit/component tests, lint, build artifact check, 11 design checks, and 24 browser tests passed; review found no issues.

## Activity log

### 2026-08-26 — Created

Issue created from the supplied project input.

### 2026-08-26 — Status changed from proposed to ready.

### 2026-08-26 — Status changed from ready to in-progress.

### 2026-08-26 — Status changed from in-progress to done.

## Completion summary

Added a GitHub Pages fallback that restores direct client-side routes before React starts.
