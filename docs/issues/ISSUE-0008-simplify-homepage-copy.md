---
id: ISSUE-0008
title: "Simplify homepage copy in a natural personal voice"
status: in-progress
priority: medium
created: 2026-10-29
updated: 2026-10-29
sources: ["Paperclip CMP-11: user comment 3988a7e6-9cb7-405e-8998-37101df8f065", "Paperclip CMP-11: approval 882df4fd-f514-47ae-9914-9aea4f7a32be", "Paperclip CMP-11: homepage-copy document 15f4770b-0888-4285-a76d-4419f8248d2d"]
related_adrs: []
depends_on: []
---

# ISSUE-0008: Simplify homepage copy

## Problem and authorization

The user dislikes the homepage's AI-sounding copy and approved the suggested natural, direct direction on 2026-10-29. The subsequent authenticated answer says the project repository is configured. The current workspace contains the project and its required documentation; the deployment BINDING.md predates this verified access.

## Desired outcome and scope

Apply the accepted homepage-copy draft to corresponding existing areas, preserving layout, styling, routes, real profile/project facts and link destinations. Keep both locales semantically equivalent. No new sections or unsupported biography. Existing notes link is sufficient; do not invent a recent-articles list.

Accepted draft: hero “这里放我的项目、笔记，还有一些没做完的想法。”; projects CTA “查看项目”; project heading “我做的东西”; contact heading “联系我” and body “有事找我，或者聊聊也行。” Apply notes wording only where the existing destination supports it. Simplify remaining abstract homepage prose using facts already present in the repository.

## Acceptance criteria

- [x] Existing homepage areas use the accepted natural copy with equivalent English.
- [ ] Layout, styling, project facts, links, locale switching and routes remain functional.
- [ ] Required relevant checks pass; desktop/mobile wrapping and navigation have recorded evidence or explicit limitations.
- [x] Independent review and acceptance testing record their own findings on a frozen diff.
- [ ] User accepts delivery before closure.

## Verification

Implementation delivered by CMP-12. Frozen four-file diff against 8a5eddd18c0a53048dacbc10a58de5c003510891 has SHA-256 6117b0b5d5f0e79665d77c47e365804da3ce4448e48369e316a5dff3da43ec54 (verified by chief). Developer reports lint, build, 16 design checks and 11 unit tests passing with NODE_ENV=test; default unit command fails with production React.act. Browser tests could not launch because configured Chrome is absent; no rendered screenshots or navigation evidence yet. Independent review/testing pending. No commit, push or deployment.

## Activity

- 2026-10-29: Read project workflow, context, ADR index and completed ISSUE-0006/0007. No active local issue existed. Created ready record from the user's existing authorization, without requesting duplicate confirmation.

- 2026-10-29: Implementation returned; chief verified actual diff and fingerprint. Development write ownership released. Entered independent read-only review and acceptance testing; user acceptance remains pending.

## Independent review and acceptance testing — 2026-10-29

- CMP-13: static/copy review PASS, no identified blocking implementation defect. Shared Footer means contact text also changes on projects and 404 pages. Unit tests, lint and 16 design checks independently passed. Actual browser rendering not reviewed.
- CMP-14: acceptance NOT PASS because browser evidence is unavailable. Independently passed lint, production build, 16 design checks and 11 unit tests with NODE_ENV=test. Default npm test fails 3 App tests under inherited NODE_ENV=production; this is recorded, not counted as a passing default command.
- User-directory Playwright Chromium installation succeeded, but both full Chrome and Headless Shell lack system libraries including libglib-2.0.so.0, libnss3.so and libX11.so.6. All 30 browser cases failed during browser launch, not page assertions. No usable browser exists on PATH. No screenshots were generated. No system installation or authentication bypass was performed.
- Frozen four-file SHA-256 remains 6117b0b5d5f0e79665d77c47e365804da3ce4448e48369e316a5dff3da43ec54, rechecked by chief after both handoffs. Review and QA evidence: Paperclip CMP-13 and CMP-14; QA logs attachment 6866efa3-9f01-4f34-a4f4-4153ea1dc6c3.
- Outstanding: real bilingual desktop/tablet/mobile rendering, wrapping/clipping, navigation, and screenshots; user acceptance. CSS overflow clipping means document-width assertions alone cannot establish visual correctness.
- Current blocker: a runnable browser environment with required system libraries. Implementation is complete and reviewable; no code repair requested (homepage-copy/0). Chief retains ownership and requests environment information from the user. Local Issue remains blocked, not done; Paperclip uses in_review while awaiting human input.
- No staging, commit, push or deployment occurred. Run from the project directory with npm run dev; checks are npm run lint, npm run build, npm run design-check, NODE_ENV=test npm test. Browser verification remains pending rather than waived.

## Publication authorization — 2026-10-29

- Authenticated human response 63263cac-b6f7-401e-a4bf-409b234d6509: “发布出去吧，我知道了”, after disclosure of the missing browser runtime. This authorizes publication of the reviewed copy and the commit/push required by the existing main-branch GitHub Pages workflow. Browser acceptance remains NOT PASS; it is not relabeled as successful.
- Chief owns release bookkeeping; no business-source modifications are made during publication. The reviewed four-file fingerprint is unchanged. Remote main equals the reviewed baseline 8a5eddd18c0a53048dacbc10a58de5c003510891.
- Publishing using .github/workflows/deploy-pages.yml to https://webfrank.top/. Restore the prior copy by reverting the release commit and letting the same workflow deploy, if rollback is authorized.
