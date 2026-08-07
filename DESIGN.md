---
version: 1.0
name: Webfrank Developer Profile
tokens:
  colors:
    canvas: "#07111b"
    surface: "#0a1723"
    ink: "#e6f0f5"
    accent: "#62e6bd"
  typography:
    display: "Inter + Microsoft YaHei"
    body: "Inter + Microsoft YaHei"
    utility: "Inter + Microsoft YaHei"
  spacing: "8px base rhythm"
  radii: "10px controls, 14px cards, 18px feature surfaces"
  elevation: "Borders and offset layers, not soft shadows"
  motion: "160–500ms, causal and reduced-motion safe"
---

# Webfrank Developer Profile

## Overview

Webfrank is Frank's bilingual personal site for developers, collaborators, and readers interested in AI agents, developer tools, automation, and reusable knowledge. Its visual thesis is a dark developer profile: deep blue-black space, clear archival hierarchy, restrained technical metadata, and mint signals for active paths. The recognizable quality is its calm project-index rhythm paired with deliberate motion.

## Colors

Deep blue-black is the permanent canvas; raised surfaces use only a subtle lighter step. Cool white is primary text, muted blue-gray supports descriptions, and mint is reserved for actions, live status, focus, and short metadata. Body-sized text must retain WCAG AA contrast.

## Typography

Inter carries Latin text and Microsoft YaHei carries Chinese text for a softer, familiar developer profile. Metadata uses the same family at smaller sizes and increased tracking instead of a separate monospace face. Body text remains spacious and never below 14px.

## Layout

The main shell is at most 1120px with 32px desktop and 14px mobile page gutters. Sections use thin rules, asymmetrical grids, and an 8px spacing rhythm. The first viewport must identify Frank, his focus, and the path to projects.

## Elevation & Depth

Hierarchy comes from canvas steps, one-pixel rules, and selective background shifts. Blur is limited to the sticky navigation; avoid floating cards and decorative gradients.

## Shapes

Controls use 10–14px radii, project cards use 14px, and feature surfaces use 18px. Pills are reserved for technology tags; circles remain for live indicators and directional actions. Icons remain simple line icons.

## Components

Buttons have 48px minimum height, strong contrast, visible hover/focus states, and direct labels. Project cards expose index, role, title, summary, technology, repository metadata, and destination. Header and footer preserve their existing route and localization behaviors.

## Interaction

Primary navigation is immediate and keyboard accessible. External destinations are marked consistently. Hover effects reinforce direction or selection without moving essential content. Mobile navigation remains an explicit toggle with `aria-expanded`.

## Motion

Motion is deliberately visible through staged hero entry, scroll reveal, project focus, and directional hover feedback. Animate only transform and opacity where possible, and fully neutralize motion under `prefers-reduced-motion`.

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

- Do use archival hierarchy, technical metadata, real project content, and meaningful structural rules.
- Do keep one bold visual move per section and make projects visible early.
- Don't use generic gradient hero blobs, excessive rounded cards, glassmorphism, serif editorial styling, or decorative badges.
- Don't trade Chinese readability for oversized typography or force desktop compositions onto mobile.
