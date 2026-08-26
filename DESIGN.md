---
version: 1.0
name: Webfrank Developer Profile
tokens:
  colors:
    canvas: "#111214"
    surface: "#181a1d"
    ink: "#f2f1ed"
    accent: "#6f91ff"
  typography:
    display: "Inter + Microsoft YaHei"
    body: "Inter + Microsoft YaHei"
    utility: "Inter + Microsoft YaHei"
  spacing: "8px base rhythm"
  radii: "10px controls, 14px cards, 18px feature surfaces"
  elevation: "Hairline borders and tonal shifts, no decorative shadows"
  motion: "140–240ms, restrained, causal, and reduced-motion safe"
---

# Webfrank Developer Profile

## Overview

Webfrank is Frank's bilingual personal site for developers, collaborators, and readers interested in AI agents, developer tools, automation, and reusable knowledge. The provisional preview direction is a minimal dark technical-leader profile: charcoal space, disciplined warm-white typography, one quiet blue signal, and strong evidence presented before decoration. The site should feel simple and professional while allowing visitors to conclude that Frank is exceptionally capable from the work itself.

## Colors

Charcoal is the primary canvas, slightly lighter graphite is used sparingly for contained surfaces, and warm white carries the hierarchy. Muted blue is reserved for links, focus, and one primary action. Body-sized text must retain WCAG AA contrast.

## Typography

Inter carries Latin text and Microsoft YaHei carries Chinese text for a softer, familiar developer profile. Metadata uses the same family at smaller sizes and increased tracking instead of a separate monospace face. Body text remains spacious and never below 14px.

## Layout

The main shell is at most 1120px with 32px desktop and 14px mobile page gutters. Sections use thin rules, an editorial two-column grid, and an 8px spacing rhythm. The first viewport must identify Frank, his focus, and credible proof through selected work or outcomes.

## Elevation & Depth

Hierarchy comes from typography, whitespace, one-pixel rules, and selective background shifts. Avoid floating cards, glass effects, decorative gradients, and ornamental depth.

## Shapes

Controls use 10–14px radii, project cards use 14px, and feature surfaces use 18px. Pills are reserved for technology tags; circles remain for live indicators and directional actions. Icons remain simple line icons.

## Components

Buttons have 48px minimum height, strong contrast, visible hover/focus states, and direct labels. Project cards expose index, role, title, summary, technology, repository metadata, and destination. Header and footer preserve their existing route and localization behaviors.

## Interaction

Primary navigation is immediate and keyboard accessible. External destinations are marked consistently. Hover effects reinforce direction or selection without moving essential content. Mobile navigation remains an explicit toggle with `aria-expanded`.

## Motion

Motion is quiet and local: link feedback, project preview continuity, and restrained section entry. Animate only transform and opacity where possible, and fully neutralize motion under `prefers-reduced-motion`.

## Responsive Behavior

Desktop compositions collapse to a single reading column below 900px. At 375px, actions become full width, metadata may wrap, and no horizontal scrolling is permitted. Decorative content can simplify, but orientation, project access, and language switching remain available.

## Content & Terminology

Voice is direct, personal, and understated. Use first person, short sentences, and concrete opinions instead of résumé-like descriptions. Chinese is the default; English mirrors meaning rather than word order.

## Accessibility

Meet WCAG AA contrast, preserve semantic headings and landmarks, provide visible focus rings, support keyboard navigation, and honor reduced motion. Decorative elements are hidden from assistive technology.

## Product States

GitHub metadata may show loading skeletons and reliable local fallback values. Navigation, missing routes, and external links have explicit states. Future data-driven modules must define loading, empty, failure, and stale behavior before shipping.

## Data Visualization

No chart system is currently used. Any future chart must include a textual alternative and reuse the navy/signal palette with patterns or labels rather than color alone.

## Do's and Don'ts

- Do lead with concrete outcomes, maintained projects, technical judgment, and meaningful structural rules.
- Do make selected work visible in or immediately after the first viewport.
- Don't use generic developer status widgets, coordinates, excessive technology pills, gradient hero blobs, rounded-card grids, glassmorphism, or decorative badges.
- Don't trade Chinese readability for oversized typography or force desktop compositions onto mobile.
