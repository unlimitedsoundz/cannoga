# Typography System

## Purpose
The Typography System skill enforces typography as the foundational spine of web UI design. It ensures type selection, scale, hierarchy, line height, letter spacing, measure, and numerical rendering are contextually tailored to the brand domain rather than defaulting to ubiquitous AI font choices.

## When to Use
Apply this skill whenever creating CSS type scales, selecting Google Fonts / web fonts, styling text elements, configuring tailwind typography classes, or designing data-dense components.

## Core Principles
1. **Contextual Type Selection**: Font selection must directly reflect the sector character—whether academic, institutional, editorial, technical, or cultural—never defaulting automatically to Inter, Geist, or generic system fallbacks.
2. **Mathematical Scale & Hierarchy**: Use a defined, proportional scale ratio (e.g., Major Third 1.25, Perfect Fourth 1.333, or Golden Ratio 1.618) to ensure contrast between display, heading, body, and caption levels.
3. **Controlled Measure (Line Length)**: Maintain body text line length between 45 and 75 characters (60ch average) to maximize reading comfort.
4. **Tabular & Numerical Precision**: Enable tabular numbers (`font-variant-numeric: tabular-nums`) for data tables, metrics, prices, timestamps, and course codes.

## Rules
1. **Default Font Ban**: Prohibit defaulting to Inter or Geist without explicit contextual justification.
2. **Context-to-Font Selection Criteria**:
   - *Academic / Institutional*: High-legibility serif (e.g., Newsreader, Lora, Playfair, Source Serif Pro) paired with a structured humanist/transitional sans (e.g., Source Sans 3, Fira Sans, Libre Franklin).
   - *Governmental / Public Sector*: Highly readable, accessible, wide character-coverage sans (e.g., Public Sans, Open Sans, Atkinson Hyperlegible).
   - *Editorial / Cultural*: Character-rich serif with optical sizing or high-contrast display serif paired with crisp grotesque body.
   - *Technical / Engineering*: Clean neo-grotesque or geometric sans paired with a dedicated tabular monospace (e.g., JetBrains Mono, Fira Code).
3. **Typographic Scale Mapping**:
   - **Display / Hero**: 48px – 72px (`3rem` – `4.5rem`), line-height `1.05` – `1.15`, tracking `-0.02em` – `-0.03em`.
   - **H1**: 36px – 48px (`2.25rem` – `3rem`), line-height `1.15` – `1.2`, tracking `-0.015em`.
   - **H2**: 28px – 36px (`1.75rem` – `2.25rem`), line-height `1.2` – `1.25`, tracking `-0.01em`.
   - **H3**: 22px – 28px (`1.375rem` – `1.75rem`), line-height `1.3`, tracking `0`.
   - **Body (Primary)**: 16px – 18px (`1rem` – `1.125rem`), line-height `1.5` – `1.6`, measure `60ch`.
   - **Subheadings / Lead Paragraph**: 18px – 21px (`1.125rem` – `1.3125rem`), line-height `1.45` – `1.5`.
   - **Metadata / Labels / Navigation**: 12px – 14px (`0.75rem` – `0.875rem`), line-height `1.3` – `1.4`, weight `500` – `600`, tracking `0.02em` – `0.05em` (uppercase).
   - **Captions / Small Print**: 12px – 13px (`0.75rem` – `0.8125rem`), line-height `1.4`.
4. **Weight Restraint**: Use no more than 3 font weights per family across an entire screen (e.g., Regular 400, Medium 500, Bold 700) to prevent typographic noise.

## Do
- **Use Fluid Typography**: Employ CSS `clamp()` for headings to transition seamlessly across mobile and desktop screens without breaking line wraps.
- **Set Numeric Features**: Apply `font-feature-settings: "tnum" 1` or `font-variant-numeric: tabular-nums` on tables, timetables, stats, and monetary displays.
- **Match Line Height to Text Size**: Smaller text requires proportionally larger line height relative to font size; large display type requires tight line height.
- **Differentiate Labels & Body**: Style labels, badges, and category tags using distinct tracking, weight, or case (e.g., medium weight with subtle letter spacing).

## Don't
- **Don't** set long body paragraphs at `14px` or `12px` font sizes. Minimum comfortable body size is `16px`.
- **Don't** allow line measures to exceed 80 characters, causing eye tracking fatigue across wide desktop views.
- **Don't** set tight line-heights (`1.1` – `1.2`) on paragraph body text.
- **Don't** mix more than two distinct font families in a single application interface.

## Implementation Guidance
- **CSS System Token Setup**:
  ```css
  :root {
    /* Font Families */
    --font-heading: 'Newsreader', Georgia, serif;
    --font-body: 'Source Sans 3', system-ui, -apple-system, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;

    /* Typographic Scale */
    --text-display: clamp(2.5rem, 5vw, 4.5rem);
    --text-h1: clamp(2rem, 3.5vw, 3rem);
    --text-h2: clamp(1.5rem, 2.5vw, 2.25rem);
    --text-h3: clamp(1.25rem, 1.8vw, 1.625rem);
    --text-body: 1rem;
    --text-sm: 0.875rem;
    --text-xs: 0.75rem;

    /* Tracking & Line Heights */
    --leading-tight: 1.15;
    --leading-snug: 1.3;
    --leading-normal: 1.55;
    --leading-relaxed: 1.7;
    --tracking-tight: -0.02em;
    --tracking-normal: 0em;
    --tracking-wide: 0.04em;
  }

  body {
    font-family: var(--font-body);
    font-size: var(--text-body);
    line-height: var(--leading-normal);
  }

  h1, h2, h3, .font-heading {
    font-family: var(--font-heading);
  }

  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
  ```

## Review Checklist
- [ ] Are typefaces selected based on brand context rather than default AI fallbacks?
- [ ] Is there clear visual contrast between H1, H2, H3, Body, and Caption levels?
- [ ] Is line length (measure) for body text bounded between 45ch and 75ch?
- [ ] Are numerical figures in tables and data displays styled with `tabular-nums`?
- [ ] Are fluid font sizes implemented with `clamp()` for responsive headlines?
- [ ] Is line height appropriate for each font size tier (tight for display, relaxed for body)?
