---
id: ISSUE-0011
title: "Ground the public GitHub introduction in the repository portfolio"
status: done
priority: medium
created: 2026-11-04
updated: 2026-11-04
closed: 2026-11-04
related_adrs: []
depends_on: []
---

# ISSUE-0011: Ground the public GitHub introduction in the repository portfolio

## Problem

The profile introduction uses broad AI and engineering language and does not fully reflect the current public repository contents, implementation stacks and active tools.

## Desired outcome

Analyze public owned repositories and update the terminal biography and native Markdown introduction/project descriptions using verified capabilities, preserving the accepted portrait and layout.

## Acceptance criteria

- [x] Review the user's owned public repositories and authorized private sources, using README/status and implementation manifests rather than repository names alone.
- [x] Update the Chinese introduction and terminal focus/stack to describe current AI tooling, automation, personal Agent and desktop work in a direct personal voice.
- [x] Describe only publicly accessible representative projects with source-supported capabilities; use generalized experience from private work without private project names, addresses or customer information.
- [x] Preserve the accepted portrait, contact links, statistics and update time; regenerate all four cards, verify responsive rendering and provide an updated preview.

## Out of scope

Publication, GitHub account Bio/settings, repository visibility, private source publication, website page copy, portrait changes and runtime behavior changes.

## Decisions

Reuse the existing profile.json / README content ownership and renderProfile contract in DESIGN.md; this is a copy/data revision, not a new runtime behavior or module boundary, so no new behavior tests are warranted. Use public project source links as provenance. Authorized private-source review informs generalized areas of practice only; private identities and excerpts stay outside tracked documentation and output packages. Public fork repositories, empty/test repositories, data archives and learning roadmaps are not presented as original shipped products. Preserve current experience/role claims already provided by the user; do not invent expertise levels, production adoption or completion claims.

Source-backed public capabilities: agent-skills contains reusable engineering/content/operations Skills; android-use provides Android MCP/CLI and UIAutomator2 integration; codex-switch-helper provides isolated Windows Codex Profiles and shared resources with React/Tauri/Rust; MindVault documents local-first knowledge ingestion, hybrid retrieval and cited answers through LangGraph/Python/React; QuickNav provides bookmarks/search/memos through Plasmo/React/TypeScript; aTools provides desktop system/developer utilities through Tauri/React/Rust. The knowledge website provides published engineering notes. Source URLs are the corresponding public GitHub repositories linked in README.md.

## Implementation notes

Reviewed public owned repository metadata, README files and representative dependency manifests. Also reviewed authorized private repository README/status and root structure, using only general areas of practice in the public copy. Did not inspect private archive contents, decrypted vaults, credentials or user conversations. Kept source investigation under the chat's local work directory, outside Git changes and deliverable packages.

Rewrote the introduction around AI development tools, browser/Android/Windows automation, and personal Agent/knowledge work. Retained the existing experience/background claims. Updated the terminal's focus and concise stack fields and expanded public representative projects from four to six with MindVault and aTools. No production generator changes or new packages/tests were needed for this copy revision.

## Verification

27 unit tests, 39 Chrome browser tests, lint, typecheck, 16 design checks, build, four theme/layout render checks, visual content review, unchanged portrait/statistics hashes and private-name screening passed.

## Activity log

### 2026-11-04 — Created

Issue created from the supplied project input.

### 2026-11-04 — Status changed from proposed to ready.

### 2026-11-04 — Status changed from ready to in-progress.

### 2026-11-04 — Status changed from in-progress to done.

## Completion summary

Updated the public GitHub biography and terminal focus/stack using the owned repository portfolio and authorized private-source review, added source-backed MindVault/aTools descriptions, and refreshed the reviewable preview while retaining the accepted artwork and public statistics.

## Publication authorization — 2026-11-04

The user approved the reviewed result and explicitly requested committing, pushing to GitHub and updating the profile. The approved 22-file delivery matched its verification hashes before release bookkeeping; local main and origin/main both pointed to 472ab015ba77280c2fff2ff99dfb24ecdd012e09. Publish to the existing public profile repository, then verify the rendered profile and run the independent update workflow with its real GITHUB_TOKEN. Existing Pages deployment is expected to run on the main push.
