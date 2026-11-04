# Frank's desktop

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

Frank's bilingual personal site lets visitors explore real projects, discover notes in the existing knowledge site, and contact Frank. Projects appear as applications and articles as documents. Source: owner-approved FRA-24 plan v3, exact revision `9d56f118-cfcc-4ba7-9bb1-8e8f9af412c9`, accepted 2026-11-04; implementation tracked by ISSUE-0012.

## Capabilities and Constraints

Existing React/TypeScript/Vite application, `/` and `/projects`, with useful unknown-route recovery. Chinese/English choice persists; system color and reduced-motion preferences remain supported. GitHub projects retain existing filtering, ordering, one-hour caching, timeout and local fallback; show four initially and at most ten after expansion. No accounts, backend, article synchronization or operating-system access. Each repository action names its project.

## Brand Commitments

The owner selected the colorful Windows 95/98 reference, SHA-256 `a14b2a7858765b743673e2fc3ac4e7dafac1e867d1c416f142f789076ad37c62`. The earlier Macintosh suggestion is superseded. The desktop metaphor must provide working controls and readable text, without a fake recycle bin, availability claims, or simulated project screenshots.

## Evidence on Hand

`src/data/projects.ts` supplies verified project definitions and contact destinations. `src/lib/github.ts` owns repository selection. The three knowledge-site article links were checked through Playwright MCP by FRA-24 on 2026-11-04; see ISSUE-0012 for provenance. Reference images are concepts, never runtime evidence. Do not invent biography, outcomes, metrics or translated articles.

## Accessibility & Inclusion

Keyboard and touch exploration, visible focus, reasonable focus return, drag alternatives, normal mobile scrolling, readable contrast and one foreground mobile window are explicit accepted requirements.

## Open assumptions

Developers, readers and potential collaborators are proposed audiences, not confirmed user research. Learning about Frank → opening a project or note → contacting him is a proposed success journey. These remain assumptions; this file does not promote them into verified domain context.
