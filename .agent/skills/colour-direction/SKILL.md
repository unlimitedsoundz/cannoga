# Colour Direction

## Purpose
The Colour Direction skill establishes color as a strategic, semantic system rather than an arbitrary decorative choice. It ensures color palettes align with brand identity, preserve contrast legibility (WCAG AAA/AA), establish clear surface depth, and steer clear of ubiquitous AI color defaults.

## When to Use
Apply this skill when defining design tokens, establishing dark/light themes, styling surfaces, setting text hierarchy contrast, and building state indicators (success, warning, error, info).

## Core Principles
1. **Semantic Rationale**: Every color token must serve a functional purpose—defining hierarchy, structural separation, interactive state, or domain identity.
2. **Surface Depth Architecture**: Establish clear elevation layers using subtle tonal shifts (Background -> Surface -> Elevated Surface -> Overlay) rather than heavy drop shadows.
3. **Contrast Compliance**: Primary text must achieve a minimum contrast ratio of 7:1 (WCAG AAA) against its background; interactive and secondary elements must achieve at least 4.5:1 (WCAG AA).
4. **Banned AI Defaults**: Prohibit uncalculated usage of trendy AI defaults: indigo (`#6366f1`), violet/purple glows, neon electric blue (`#0070f3`), cyan badges, and synthetic dark-purple dark modes.

## Rules
1. **Mandatory Palette Roles**: Every project color system must define the following explicit semantic roles:
   - `primary`: Brand anchor color (e.g., Deep Crimson, Oxford Navy, Forest Slate, Rich Umber).
   - `secondary`: Supporting brand tone.
   - `accent`: Sparse key highlight color used for primary CTAs or focus indicators.
   - `background`: Base canvas background.
   - `surface`: Card, section, and container fill.
   - `surface-elevated`: Modals, dropdowns, sticky headers, popovers.
   - `border`: Structural hairlines and input strokes.
   - `text-primary`: Highest contrast text for headings and primary content.
   - `text-secondary`: Supporting body and subtitle text.
   - `text-muted`: Captions, timestamps, disabled states, helper text.
   - `status-success`: Positive state indicator.
   - `status-warning`: Cautionary notice state.
   - `status-error`: Critical alert or inline error.
   - `status-info`: Neutral system notification.
2. **Palette Discipline**: Limit the core UI canvas to 1 primary brand tone, 1 neutral structural scale (10 shades from 50 to 950), and 1 accent color.
3. **Border Color Rationale**: Border colors must be derived from the neutral scale with calculated opacity (`rgba` or CSS `color-mix`) so they adapt gracefully across surface elevations.

## Do
- **Use Harmonious Domain Palettes**:
  - *Academic / Heritage*: Deep Navy (`#0f2027`), Crimson (`#800020`), Cream/Warm White (`#fcfbf7`), Warm Charcoal (`#1a1a1a`).
  - *Civic / Government*: Slate Navy (`#1d2a44`), Ochre Accent (`#c89211`), Neutral Gray (`#f4f5f7`), Charcoal (`#111827`).
  - *Financial / Institutional*: Deep Emerald (`#064e3b`), Forest (`#047857`), Off-White (`#f8fafc`), Dark Slate (`#0f172a`).
- **Implement Explicit Surface Tiers**: Define precise color steps for background (`#09090b`), surface (`#121215`), elevated surface (`#18181b`), and border (`#27272a`).
- **Test Contrast Ratios**: Check contrast ratios programmatically for both light and dark themes.

## Don't
- **Don't** use pure `#000000` text on pure `#ffffff` backgrounds or pure `#000000` dark modes. Prefer deep off-blacks (`#0f172a`, `#111827`) and warm off-whites (`#f8fafc`, `#fcfbf7`).
- **Don't** use multi-color gradient text (`bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600`).
- **Don't** assign status colors (red, green, amber) to decorative non-status elements.
- **Don't** use raw unadjusted hex values directly in components; reference tokenized variables.

## Implementation Guidance
- **CSS Color System Tokens**:
  ```css
  :root {
    /* Brand Tokens */
    --color-primary: #800020;         /* Academic Crimson */
    --color-primary-hover: #66001a;
    --color-accent: #c89211;          /* Gold Accent */

    /* Neutrals (Light Mode Default) */
    --color-bg: #fcfbf7;              /* Warm Paper White */
    --color-surface: #ffffff;
    --color-surface-elevated: #f4f3ee;
    --color-border: #e2e0d8;
    --color-border-subtle: #eeede6;

    /* Text Hierarchy */
    --color-text-primary: #1a1a18;    /* High Contrast Charcoal */
    --color-text-secondary: #4a4944;  /* Muted Charcoal */
    --color-text-muted: #78766f;      /* Subtitle / Metadata */

    /* Semantic States */
    --color-success: #1b5e20;
    --color-warning: #b78103;
    --color-error: #b71c1c;
    --color-info: #0d47a1;
  }

  [data-theme="dark"] {
    --color-bg: #121214;
    --color-surface: #1a1a1e;
    --color-surface-elevated: #24242a;
    --color-border: #2e2e36;
    --color-border-subtle: #222228;

    --color-text-primary: #f4f4f6;
    --color-text-secondary: #a1a1aa;
    --color-text-muted: #71717a;
  }
  ```

## Review Checklist
- [ ] Are generic AI gradients and electric indigo/purple defaults completely absent?
- [ ] Is every color mapped to an explicit semantic token in CSS?
- [ ] Does primary text achieve at least 7:1 contrast ratio against the background surface?
- [ ] Are surface elevations clearly distinguishable (Background vs. Surface vs. Elevated Surface)?
- [ ] Do status colors reserve red, green, amber, and blue strictly for functional status signaling?
