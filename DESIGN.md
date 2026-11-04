---
name: "Frank's desktop"
description: "A useful, colorful Windows 95/98 desktop for real projects and notes."
colors:
  desktop: "#087c7d"
  window: "#c6c6bf"
  paper: "#fffaf0"
  ink: "#161819"
  muted: "#505452"
  title: "#102775"
  inactive-title: "#243873"
  highlight: "#fffef5"
  edge: "#85867f"
  shadow: "#292c2a"
  focus: "#8d310d"
  dark-desktop: "#064c50"
  dark-window: "#454d50"
  dark-paper: "#232c2e"
  dark-ink: "#fff7e6"
  dark-muted: "#c1c9c6"
  dark-title: "#12286e"
  dark-focus: "#ffce6b"
typography:
  display:
    fontFamily: "Manrope, Microsoft YaHei, PingFang SC, sans-serif"
    fontSize: "clamp(25px, 2.55vw, 38px)"
    fontWeight: 800
    lineHeight: 1.35
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Manrope, Microsoft YaHei, PingFang SC, sans-serif"
    fontSize: "16px"
    lineHeight: 1.6
  title:
    fontFamily: "Manrope, Microsoft YaHei, PingFang SC, sans-serif"
    fontSize: "19px"
    fontWeight: 800
spacing:
  compact: "8px"
  group: "14px"
  document: "20px"
components:
  button:
    backgroundColor: "{colors.window}"
    textColor: "{colors.ink}"
    padding: "7px 15px"
    height: "44px minimum"
  titlebar:
    backgroundColor: "{colors.title}"
    textColor: "#ffffff"
    height: "37px desktop / 44px compact"
---

# Frank's desktop

## Overview

**Creative North Star: "Frank's useful desktop"**

A colorful Windows 95/98 desktop makes projects feel like applications and articles like documents. The owner-selected reference replaces the previous editorial workbench and the rejected Macintosh concept. These are real windows around live HTML; illustration supplies warmth while controls provide actual navigation and reversible exploration.

**Key Characteristics:**

- Teal desktop, navy title bars, beveled gray chrome and warm paper.
- Colorful icons on one crisp SVG grid, alongside an original pixel-art desk bitmap.
- Readable Chinese and English, system theme support and a compact single foreground window.

Authority: accepted FRA-24 plan v3, revision `9d56f118-cfcc-4ba7-9bb1-8e8f9af412c9`; implementation ISSUE-0012. This record replaces the obsolete workbench design within that authorization. Product facts remain in PRODUCT.md; route strategy remains in `.impeccable/surfaces/src-app-tsx.md`.

## Colors

Frontmatter lists implemented primitives; CSS custom properties in `src/styles.css` own runtime values. Teal is the desktop ground, navy carries titles and selection, gray carries the chrome, and warm paper carries reading. Pixel artwork uses its own small natural palette. System dark preference changes ground, chrome, paper, foreground and focus, while preserving the desktop identity.

**The Readable Paper Rule.** Body copy, secondary text, title text and button text must each reach 4.5:1 against their actual computed surface in both schemes. Browser measurements belong in test evidence; values in this document alone do not establish contrast.

## Typography

Latin text uses the existing self-hosted Manrope WOFF2. Chinese uses Microsoft YaHei/PingFang with a system fallback, as required for readable live text. Welcome headlines use the display role, project names step down to 19px desktop / 21px compact, and project summaries use the body role. Metadata and small utilities may use 11–14px, distinct from prose. Compact welcome headlines use 29px on phones and 34px on tablets. Headings balance where possible; project names and long tags wrap anywhere rather than forcing horizontal scroll.

## Layout

The menu is 50px high and the taskbar 54px on desktop. A 124px shortcut rail borders a responsive workspace. Windows have bounded, transient coordinates; their bodies scroll. Normal and maximized geometry stays inside the usable workspace. Short desktops minimize auxiliary documents; every open window has a task button.

At 1000px and below, the menu becomes a compact header, shortcuts become a horizontal launcher and one foreground window takes normal document flow. Background documents are hidden and inert. The taskbar stays fixed with horizontally scrollable task buttons. At 600px, the project browser becomes a single reading column. Document bottom padding and scroll margins reserve the taskbar's space. There is no coordinate persistence or free resizing.

## Elevation & Depth

**The Beveled Chrome Rule.** Depth comes from a two-pixel light top/left and dark bottom/right border, plus one-pixel inset edge lines. Pressed buttons reverse this relationship. This is the selected period's material, with no modern diffuse drop shadow, blur or rounded card treatment.

## Shapes

Windows, buttons and document surfaces are rectangular. Pixel icons use a shared 32-unit authored geometry and crisp edge rendering. The standalone generated desk illustration is picture content, never an SVG approximation of a picture or a simulated application screenshot.

## Components

Buttons name their action, show hover/pressed/focus states and use at least 44px touch targets in compact mode. Small desktop title controls retain period proportions; compact mode provides 44px hit areas. Window title buttons minimize, maximize/restore and close; maximize and moving controls are absent in compact mode. Menus support arrows, Home/End and Escape; equivalent preset positions and reset live in Help.

Project items include a real summary, explicit named repository link, technology and public metadata. Empty/loading/cache/fallback states are visible. Article labels lead to verified original articles, with a Chinese-content cue in English. Locale persists and metadata follows the route. Focus is visible, minimized/closed windows return it to a useful entry, and background mobile windows cannot receive it.

**The Reversible Exploration Rule.** Reopening restores one existing window; task buttons reflect actual open windows. Project links remain native anchors. Minimization preserves `/projects`; closure returns `/`; history restores the defined route state.

Only the welcome copy has a brief 240ms entrance displacement; reduced motion removes it. No boot delay, sound or perpetual animation.

## Do's and Don'ts

- Do preserve real project selection, external destinations, automatic theme and bilingual content.
- Do verify window bounds, scrolling, focus and contrast in the rendered browser at shipping sizes.
- Do retain the shipping raster's exact generation prompt in its sidecar and PNG metadata.
- Don't add a pretend recycle bin, online status, terminal input or fake project controls.
- Don't restore workbench photography, Macintosh stripes, modern rounded cards or glass blur.
- Don't rasterize page text or treat concept imagery as runtime evidence.

## GitHub profile README

This separate surface follows the approved terminal-card plan (ISSUE-0009), rather than the website's retro desktop visual system. It uses a gray ASCII portrait, blue headings, brown/orange keys, dotted leaders and a subtle rounded border. Desktop assigns roughly 35% to the portrait; mobile stacks portrait and information. Both have explicit light/dark assets selected by README picture sources, with native Markdown projects/contact links and a text biography outside the image.

### Module contract (recorded before generation)

- Owner: `scripts/profile/generate.mjs` owns public GitHub aggregation, time windows, privacy filtering, validation and SVG rendering. Its sole public operation is `generateProfile({ profile, portrait, token, now, fetch })`, returning `{ files, stats }` only after all inputs/API results and all four SVGs are valid; errors reject without returning partial output. `fetch` is the externally controlled HTTP boundary, defaults to global fetch, and is replaceable for deterministic public-contract tests. `now` is an explicit clock value. Token values never appear in errors or files.
- Hidden rules: REST pagination across public owned repositories; exclusion of forks; public-only contribution counting; calendar-clamped 12-month period; API timeouts; GraphQL errors; SVG escaping; fixed-coordinate dot leaders; layout-specific typography/wrapping. Commit contributions use monthly collection windows to bound daily connection sizes, with all group coverage checked. PR/review connections are independently paginated. Never add restricted contributions or use owner-visible totals as public totals.
- Caller lifecycle: `scripts/update-profile.mjs` reads manual configuration/portrait, invokes the owner once, stages every generated file before replacing `profile/generated/` resources, and does not write anything when API/rendering fails. The independent Action invokes this CLI, validates the result and commits only generated files after success. Callers never aggregate data or coordinate fetching/rendering. API errors fail visibly; previous assets and timestamp remain available.
- File map: `profile/profile.json` and `profile/portrait.txt` are manual inputs; `profile/generated/` contains four SVGs and aggregate-only `stats.json`; `scripts/profile/generate.mjs` is the module; `scripts/profile/generate.test.mjs` tests its public operation; `scripts/update-profile.mjs` is disk/CLI infrastructure; `.github/workflows/update-profile.yml` owns daily/manual automation. The React website does not import this module.
- Dependencies flow from the CLI to the module and from the module to built-in HTTP/Intl/string facilities only. No browser runtime, hosted stats widget, font service or new package is needed in production. ASCII uses monospace; Chinese uses explicit CJK system fallbacks. Local preview tooling is kept outside the product.
- Verification: stable public-entry tests for pagination, forks/private/restricted activity, leap-day bounds, zero values, HTTP/GraphQL errors, escaping, clipping constraints and four asset variants. Run existing `test`, `lint`, `typecheck`, `build`, `design-check` and `browser-test`; perform live public-API checks and screenshot/DOM measurements on final assets. The existing design checker covers website rules only; there is no project-wide executable architecture-boundary checker, and no new governance tool is installed.

Success walkthrough: one CLI invocation reads manual inputs, gets a complete public snapshot, and publishes all variants with one timestamp. Failure walkthrough: any HTTP/schema/render failure rejects before disk writes; the updater exits nonzero and the Action never commits. Removing the owner would force the CLI/Action to duplicate API, privacy and presentation rules, so those rules remain together.

Portrait refinement (ISSUE-0010): `generateProfile` additionally accepts optional `portraitDark`, defaulting to the existing `portrait` string for compatibility. The same owner exposes `renderProfile({ profile, portrait, portraitDark, stats })`, validating and rendering a previous aggregate snapshot without HTTP or modifying its timestamp. The CLI's `--render-only` route uses this operation to update artwork independently from statistics. The normal update still fetches and validates live data before invoking the same renderer. The CLI reads both theme assets. Character grids may contain up to 96 columns and 64 lines; uniform glyph scaling uses 0.6em character advance and 1.2em line pitch, preserving the source sampling ratio while fitting the existing slots. Theme-specific density mappings keep sunglasses dark and skin lighter in both palettes. No statistics or other layout rule moves to a new owner.
