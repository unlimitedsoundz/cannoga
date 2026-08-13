# Visual Hierarchy

## Purpose
The Visual Hierarchy skill dictates how visual attention is prioritized across an application view. It prevents cluttered screens where every element demands focus, establishing a disciplined 5-level hierarchy that guides the human eye effortlessly through complex information landscapes.

## When to Use
Apply this skill when laying out complex pages, structuring dashboards, building detail views, designing form interfaces, or reviewing visual weight distribution across components.

## Core Principles
1. **Focal Point Discipline**: Every screen must have exactly *one* unmistakable primary focal point (Level 1). If three banners, two buttons, and a badge all scream for attention, visual hierarchy has failed.
2. **Multi-Dimensional Contrast**: Control visual order through 9 combined levers: Scale, Position, Typographic Weight, Color Contrast, Surface Elevation, Whitespace, Alignment, Visual Density, and Imagery.
3. **Structured De-Emphasis**: Secondary, tertiary, and metadata elements must be intentionally muted so the primary message stands out without requiring gaudy neon highlights.

## Rules
1. **Mandatory 5-Level Hierarchy Architecture**: Every component view or page section must categorize elements into these 5 distinct visual tiers:
   - **Level 1 — Primary Message / Focal Point**: H1 headline, main page header, or primary stat callout. Max 1 per section view. Dominant scale, crisp weight, high contrast.
   - **Level 2 — Supporting Information**: Subtitles, lead paragraphs, section H2s, primary section summary. Medium-large scale, medium contrast.
   - **Level 3 — Primary Action / Navigation**: Primary button (`.btn-primary`), core navigation links, key filter controls. Clear contrast, prominent placement, high affordance.
   - **Level 4 — Metadata & Data Labels**: Course codes, dates, timestamps, table headers, author names, tags, status badges. Small scale, medium-muted color, uppercase/tabular typography.
   - **Level 5 — Secondary Information / Footnotes**: Disclaimers, helper text, breadcrumbs, border lines, background textures. Smallest scale, muted gray/subtle tint, minimal contrast.
2. **Button Hierarchy Restraint**: Never place two filled primary action buttons adjacent to each other. Pair 1 Primary Button with Secondary (Outline) or Tertiary (Text link) actions.
3. **Badge & Pill Restraint**: Badges and status pills must serve Level 4 metadata duties. Never use prominent high-contrast badges on every line item in a table.

## Do
- **Establish Top-Left to Bottom-Right Flow**: Position Level 1 focal points along natural reading patterns (F-pattern or Z-pattern).
- **Use Spatial Separation**: Separate Level 1 headlines from Level 2 body paragraphs using generous vertical spacing (`mb-6`), while keeping Level 4 metadata closely attached (`mb-2`) to its parent element.
- **Vary Typographic Contrast**: Use font weight (e.g., `font-bold` for Level 1, `font-medium` for Level 3, `font-normal` for Level 4) to guide scanning.

## Don't
- **Don't** make section subheadings larger or bolder than the main page headline.
- **Don't** use bright accent background colors behind large blocks of Level 2 body copy.
- **Don't** allow secondary metadata (timestamps, course IDs) to compete with the primary item title in font size or weight.
- **Don't** apply pulse or bounce animations to non-critical alert elements.

## Implementation Guidance
- **Visual Weight Tiering Example**:
  ```html
  <article class="p-6 border border-subtle bg-surface">
    <!-- Level 4: Metadata Tier -->
    <div class="flex items-center space-x-3 text-xs text-muted mb-3">
      <span class="font-mono uppercase tracking-wider text-primary font-medium">CS-402</span>
      <span>•</span>
      <time datetime="2026-09-15">Fall Semester 2026</time>
      <span>•</span>
      <span>4 Credit Hours</span>
    </div>

    <!-- Level 1: Primary Title -->
    <h2 class="text-2xl font-heading font-bold text-primary mb-3">
      Advanced Distributed Systems & Consensus Protocols
    </h2>

    <!-- Level 2: Supporting Content -->
    <p class="text-secondary text-sm leading-relaxed mb-6 max-w-prose">
      In-depth exploration of fault-tolerant distributed consensus, Raft protocol mechanics, vector clocks, and partitioned database architectures.
    </p>

    <!-- Level 3 & Level 5: Action & Secondary Link Tier -->
    <div class="flex items-center justify-between pt-4 border-t border-subtle">
      <a href="/courses/cs-402" class="btn-primary">View Syllabus</a>
      <!-- Level 5: Auxiliary Link -->
      <a href="/faculty/dr-chen" class="text-xs text-muted hover:text-primary transition-colors">
        Instructor: Dr. Aris Chen
      </a>
    </div>
  </article>
  ```

## Review Checklist
- [ ] Is there exactly 1 clear Level 1 focal point per section view?
- [ ] Do headlines, body copy, actions, metadata, and footnotes fall neatly into the 5 hierarchy levels?
- [ ] Is primary action styling restricted to 1 main button per visual group?
- [ ] Is metadata (Level 4) styled with appropriate small-scale, muted-contrast typography?
- [ ] Does the eye move logically from primary information down to secondary details without visual confusion?
