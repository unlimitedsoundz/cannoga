# Human Interface Details

## Purpose
The Human Interface Details skill elevates interfaces from generic UI component libraries to bespoke, human-crafted products. It focuses on functional micro-details, explicit structural accents, domain-authentic labels, and tactile feedback that signal precision engineering and institutional authenticity.

## When to Use
Apply this skill during component construction, detail polishing, active state styling, navigation bar development, table header formatting, and fine-tuning interactive elements.

## Core Principles
1. **Purposeful Craftsmanship**: Every detail—whether a section index, hairline stroke, custom marker, or active pill—must reinforce identity, clear hierarchy, or state awareness. No meaningless decoration.
2. **Domain-Authentic Terminology**: Match micro-labels and micro-copy to the real organization's vernacular (e.g., *Ref: REG-2026-X*, *Section 04.B*, *Term II*, *Verification Stamp*).
3. **Distinctive Active & Hover States**: Reject generic blue hover overlays. Create tactile hover, focus, and active states using crisp border highlight shifts, subtle scale micro-transitions, or background tone changes.
4. **Structural Separators & Indexing**: Use explicit section numbers (`01 /`, `SEC. 02`), subtle hairline dividers, and breadcrumb markers to anchor the user's spatial orientation.

## Rules
1. **Section Indexing Pattern**: Major content sections or steps in a multi-part view should feature structured numeric prefixes styled as Level 4 metadata (e.g., `<span class="font-mono text-xs text-muted mr-2">01 //</span>`).
2. **Custom Active Navigation Markers**: Active navigation links must incorporate crisp visual anchors (such as a left border highlight `border-l-2 border-primary`, an underline anchor, or a subtle background fill shift) rather than simple text color shifts.
3. **Data Field Formatting**: Key-value data pairs (e.g., in student profiles, course specs, or transaction records) must feature distinct label-to-value styling: labels in uppercase muted tracking (`text-xs uppercase tracking-wider text-muted`), values in high-contrast medium weight (`text-sm font-medium text-primary`).
4. **Hairline Border Discipline**: Prefer 1px crisp borders using semi-transparent neutral colors (`rgba(255,255,255,0.08)` dark mode, `rgba(0,0,0,0.08)` light mode) over blurred shadows.

## Do
- **Add Breadcrumb Metadata**: Embed breadcrumb sequences with clean separator glyphs (`/` or `→` or `::`) and explicit ARIA labels.
- **Incorporate Custom Monospace Codes**: Display reference IDs, course codes, policy numbers, and timestamp badges in clean monospace type.
- **Style Table Header Hairlines**: Give data table headers subtle bottom hairline borders and distinct uppercase typography.
- **Design Touch-Friendly Hit Targets**: Ensure interactive icons, buttons, and links maintain a minimum target size of 44x44px even if the visual icon is 16x16px.

## Don't
- **Don't** add random floating decorative shapes (dots, geometric crosses, abstract waves) that serve no visual or functional purpose.
- **Don't** use standard browser default focus rings (`outline-blue-500`). Build crisp focus outlines (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`).
- **Don't** rely on generic icon libraries without adjusting stroke-width or color to match the surrounding typography.

## Implementation Guidance
- **Authored Card Header with Micro-Details**:
  ```html
  <div class="border-b border-subtle pb-4 mb-4 flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <span class="font-mono text-xs text-muted font-bold">02.A</span>
      <span class="text-xs text-muted">/</span>
      <h3 class="text-sm font-semibold uppercase tracking-wide text-primary">Prerequisite Sequence</h3>
    </div>
    <span class="inline-flex items-center px-2 py-0.5 text-xs font-mono bg-surface-elevated text-secondary border border-subtle">
      REQ-VERIFIED
    </span>
  </div>
  ```
- **Active Navigation Indicator**:
  ```html
  <nav class="space-y-1">
    <a href="/dashboard" class="flex items-center justify-between px-3 py-2 text-sm font-medium text-primary bg-surface-elevated border-l-2 border-primary">
      <span>Academic Overview</span>
      <span class="font-mono text-xs text-muted">→</span>
    </a>
    <a href="/courses" class="flex items-center justify-between px-3 py-2 text-sm font-medium text-secondary hover:text-primary hover:bg-surface transition-colors">
      <span>Enrolled Courses</span>
    </a>
  </nav>
  ```

## Review Checklist
- [ ] Are section titles complemented by clear indexing numbers or domain labels?
- [ ] Do active navigation items feature distinct structural indicators (border marks, background shifts)?
- [ ] Are key-value data displays formatted with distinct muted labels and high-contrast values?
- [ ] Are custom focus states configured for keyboard navigation accessibility (`focus-visible`)?
- [ ] Is every micro-detail functional, supporting identity or usability, rather than meaningless clutter?
