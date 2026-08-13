# Brand Consistency

## Purpose
The Brand Consistency skill governs the unified visual language, structural rules, and voice across an entire multi-page application. It prevents fragmented UI implementations where individual sub-pages, dashboards, or components adopt disjointed typography, inconsistent border radii, competing button styles, or conflicting color schemes.

## When to Use
Apply this skill when adding new pages, building shared component library items, reviewing pull requests, integrating sub-applications (e.g., public portal vs. SIS admin portal), and unifying multi-section layouts.

## Core Principles
1. **Single Unified System**: Treat the brand as a singular visual system expressed through tokenized CSS primitives (typography, color, spacing, radius, borders, surface elevation, and motion).
2. **Systemic Identity Continuity**: A user navigating from the public institutional home page into an academic department overview, course catalog, or SIS portal must feel continuous identity stewardship.
3. **Tokenized Component Primitive Rules**: All UI building blocks—buttons, form inputs, cards, tables, navigation bars, badges, and alerts—must consume global design tokens rather than defining ad-hoc local utility classes.
4. **Cohesive Voice & Tone**: Written editorial copy across forms, headers, empty states, and system notifications must maintain a uniform institutional voice.

## Rules
1. **Border Radius Standardization**: Enforce strict system-wide border radius tokens:
   - *Small Controls (Badges, Buttons, Inputs)*: `rounded-none` or `rounded-sm` (2px) or `rounded` (4px).
   - *Cards & Surface Containers*: `rounded-md` (6px) or `rounded-lg` (8px).
   - *Prohibition*: Ban introducing arbitrary `rounded-3xl` or `rounded-full` boxes on random pages while other pages use crisp square borders.
2. **Button Variant Matrix**: Standardize button styles across all views:
   - `Primary`: Solid primary brand fill, high contrast text. Max 1 per view section.
   - `Secondary`: Crisp hairline border (`border border-subtle bg-surface hover:bg-surface-elevated`).
   - `Tertiary / Ghost`: Text-only link with subtle background hover tint (`hover:bg-surface-elevated`).
   - `Danger`: Subtle error tint with explicit error border and text.
3. **Data Visualization Consistency**: All charts, metric bars, and progress indicators must consume the brand color palette tokens rather than arbitrary default library colors (e.g., Chart.js or Recharts default palettes).
4. **Spacing Token System**: Enforce consistent vertical section spacing scale (`space-y-4` for dense forms, `py-8 md:py-12` for content sections, `py-16` for major section dividers).

## Do
- **Reuse Design System Tokens**: Reference CSS variables (`var(--color-primary)`, `var(--font-heading)`) or Tailwind theme extensions (`bg-primary`, `font-heading`).
- **Standardize Form Control Styling**: Ensure all form inputs across admin, public, and student portals share identical border, background, typography, and focus ring treatments.
- **Maintain Consistent Iconography Strokes**: Use icons from a single unified set (e.g., Lucide or custom SVG set) with matching stroke width (e.g., 1.5px or 2px across all views).

## Don't
- **Don't** create a dark-mode theme on one page while hardcoding light-mode white backgrounds on another page without theme awareness.
- **Don't** mix serif headings on the homepage with geometric sans headings on subpages unless dictated by the typography system spec.
- **Don't** use different status green/red/amber shades across different portal sections.

## Implementation Guidance
- **Shared Tokenized Primitive Example**:
  ```css
  /* Global Brand Tokens (index.css) */
  :root {
    --brand-radius-sm: 2px;
    --brand-radius-md: 4px;
    --brand-radius-lg: 8px;

    --brand-border-width: 1px;
    --brand-border-color: var(--color-border);
  }

  /* Core Card Component - Enforced Everywhere */
  .brand-card {
    background-color: var(--color-surface);
    border: var(--brand-border-width) solid var(--brand-border-color);
    border-radius: var(--brand-radius-md);
    padding: 1.5rem;
  }

  /* Core Button Component - Enforced Everywhere */
  .brand-btn-primary {
    background-color: var(--color-primary);
    color: #ffffff;
    border-radius: var(--brand-radius-sm);
    padding: 0.625rem 1.25rem;
    font-weight: 500;
    transition: background-color 150ms ease-out;
  }
  ```

## Review Checklist
- [ ] Do all pages consume the unified design system tokens for colors, fonts, spacing, and border radius?
- [ ] Are button variants (Primary, Secondary, Ghost, Danger) consistent across all application sections?
- [ ] Are form inputs, dropdowns, and cards styled identically across public, student, and admin portals?
- [ ] Is iconography consistent in style, stroke weight, and sizing system-wide?
- [ ] Does the visual identity feel cohesive from page to page without jarring aesthetic shifts?
