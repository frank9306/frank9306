---
version: 2.0
name: Webfrank Systems Workbench
tokens:
  colors:
    canvas-light: "#f1efe8"
    canvas-dark: "#171716"
    ink-light: "#191918"
    ink-dark: "#f2efe7"
    accent-light: "#bd3f1f"
    accent-dark: "#ff6847"
  typography:
    display: "Self-hosted Manrope + Microsoft YaHei"
    body: "Self-hosted Manrope + Microsoft YaHei"
    utility: "Self-hosted Manrope + Microsoft YaHei"
  spacing: "7px base rhythm with optical section spacing"
  radii: "Sharp rectangular geometry throughout"
  elevation: "Solid tonal blocks and overlap, no decorative shadows"
  motion: "140-760ms, hierarchy and feedback only, reduced-motion safe"
---

# Webfrank Systems Workbench

## Overview

Webfrank is Frank's bilingual portfolio for developers and collaborators interested in AI agents, developer tools, verification, and automation. The site is treated as a redesign overhaul: routes, real project facts, destinations, and localization remain stable while the visual language and page composition are rebuilt.

The visual thesis is an editorial systems workbench. Cold paper, graphite, metal, translucent routing sheets, and a single vermilion signal make abstract software work feel tangible. Original generated photography is a content asset, not decoration. The interface should feel like evidence from a working practice rather than a résumé template.

Taste Skill dials are DESIGN_VARIANCE 8, MOTION_INTENSITY 5, and VISUAL_DENSITY 4.

## Colors

Light mode uses cold paper `#f1efe8`, graphite `#191918`, and vermilion `#bd3f1f`. Dark mode uses charcoal `#171716`, warm white `#f2efe7`, and brighter vermilion `#ff6847`. The browser's color preference selects the mode. Vermilion is the only accent family and is used for actions, focus, selected states, and the final contact block.

Do not introduce blue, purple, neon, or gradient accents. Contained graphite blocks may invert type, but whole sections do not switch to a second theme.

## Typography

The project self-hosts the Latin subset of the Manrope variable font as WOFF2. Microsoft YaHei and system sans-serif fonts provide Chinese and platform fallbacks. Display type uses tight tracking, heavy variable weights, and balanced wrapping. Body text remains at least 14px, uses generous line height, and stays within roughly 65 characters when practical.

Use one sentence register: direct first-person language, concrete nouns, and active verbs. Avoid em dashes, promotional adjectives, mock-poetic metadata, invented numbers, and unsupported outcomes.

## Layout

The shell is at most 1260px with 32px desktop and 14px mobile gutters. Desktop layouts use a 12-column grid. The homepage uses five distinct families:

1. Asymmetric text-and-photography hero.
2. Three-item work map with one tall graphite block and two stacked blocks.
3. Asymmetric project matrix with alternating seven- and five-column spans.
4. Full-width process photograph with an offset text panel.
5. Full-width vermilion contact footer.

The hero must fit the initial desktop viewport, keep the headline to two visual lines where language permits, and expose the primary project action without scrolling. Below 768px, every multi-column surface becomes one strict reading column.

## Material, Shapes, and Depth

All components use sharp corners. Hierarchy comes from solid surfaces, cropped photography, block scale, controlled overlap, and whitespace. No glass panels, gradient blobs, generic cards, soft shadows, floating pills, or ornamental grid lines.

## Imagery

The hero and about sections use project-owned WebP assets generated specifically for this redesign. They depict tactile routing and modular workbench materials without screens, fake dashboards, text, robots, brains, neon nodes, or stock-office imagery. Images have meaningful localized alt text and explicit dimensions to avoid layout shift.

## Components

Buttons are at least 52px high, never wrap on desktop, and have visible hover, active, and focus states. Project cards are content blocks rather than floating containers. A full-card repository link remains keyboard accessible and receives an obvious focus-within outline. The mobile menu keeps a 44px target and accurate `aria-expanded` state.

## Interaction and Motion

Motion communicates hierarchy and feedback. The hero copy and image enter once in sequence; project blocks and buttons provide restrained pointer and pressed feedback. Only transform and opacity animate. Reduced motion collapses animations and smooth scrolling to immediate states.

Do not add scroll listeners, scroll cues, magnetic effects, perpetual loops, marquees, or motion that exists only for spectacle.

## Responsive Behavior

Desktop supports the full asymmetric composition. At tablet widths the hero remains split but uses a smaller type scale and image. Below 768px, the hero, practice blocks, project matrix, about composition, navigation, and footer links become single-column. At 375px there must be no horizontal scrolling, clipped focus ring, hidden action, or accidental one-word line.

## Accessibility

Meet WCAG AA contrast, preserve semantic landmarks and heading order, expose visible focus, retain the skip link, and support keyboard navigation. Both theme token sets must keep body text and actions readable. Generated imagery carries localized descriptive alt text. Decorative arrows are hidden from assistive technology.

## Product States

GitHub loading uses shape-matched skeletons. The fallback notice states that saved data is being shown when GitHub is unavailable. Navigation, direct routes, not-found recovery, project expansion, localization, and external links retain explicit states.

## Do's and Don'ts

- Do show real maintained projects and explain the actual friction behind them.
- Do use one vermilion accent and one sharp shape language across the site.
- Do use the generated workbench photography as real compositional content.
- Don't add location, weather, version, availability, or decorative status strips.
- Don't use equal three-card rows, repeated split headers, fake product UI, random icons, glassmorphism, gradients, or AI-purple effects.
- Don't invent clients, testimonials, metrics, outcomes, or biography.
