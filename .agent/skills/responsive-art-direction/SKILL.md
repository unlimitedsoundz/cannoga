# Responsive Art Direction

## Purpose
The Responsive Art Direction skill establishes mobile and tablet layout composition as distinct, first-class design tasks. It enforces the rule that **mobile is not a compressed desktop**, requiring thoughtful reorganization of navigation, typography scale, data density, touch controls, and structural priorities for smaller screens.

## When to Use
Apply this skill when designing responsive layouts, refactoring desktop views for mobile viewports, converting data tables to mobile-friendly formats, adapting sidebars, and tuning touch target dimensions across breakpoints.

## Core Principles
1. **Mobile is Not a Compressed Desktop**: Do not simply shrink text, scale down desktop containers, or squeeze multi-column layouts into cramped vertical stacks. Re-architect the view for mobile ergonomics.
2. **Intentional Mobile Hierarchy**: Re-evaluate content priority on mobile screens. Surface primary actions, critical alerts, and key data points immediately at the top; collapse auxiliary sidebars and secondary details into structured disclosures.
3. **Touch Ergonomics & Hit Targets**: All interactive elements (buttons, nav links, form inputs, pagination controls) must feature a minimum touch target area of 44x44px with comfortable spacing between adjacent controls.
4. **Fluid Typographic Scaling**: Scale display headings aggressively down to mobile viewports while preserving minimum 16px body text sizes to prevent auto-zooming on mobile form inputs.

## Rules
1. **Table Adaptation Rule**: Never allow wide data tables to break out of screen bounds or force overall page horizontal scrolling. Choose one of two mobile table strategies:
   - *Strategy A (Horizontal Scroll Box)*: Wrap table in a dedicated overflow container (`overflow-x-auto`) with fixed left column headers and subtle scroll indicators.
   - *Strategy B (Card List Transformation)*: Convert tabular rows into structured key-value mobile cards (`block md:table-row`).
2. **Mobile Navigation Architecture**: Replace complex multi-level desktop dropdown headers on mobile viewports with a dedicated full-screen drawer or bottom-sheet sheet navigation system featuring large touch links and clear section accordions.
3. **Sidebar Reorganization**: Desktop sidebars (e.g., table of contents, filter controls, navigation sub-menus) must stack above or below primary content with sticky trigger bars or expandable disclosure buttons.
4. **Padding & Spacing Discipline**: Reduce desktop container padding (`p-12` -> `p-4 sm:p-6`) to maximize screen real estate on mobile devices while maintaining visual breathing room.

## Do
- **Use Fluid Layout Containers**: Use CSS `grid` and flexbox with responsive breakpoint modifiers (`grid-cols-1 md:grid-cols-2 lg:grid-cols-12`).
- **Optimize Touch Form Inputs**: Ensure all mobile `<input>`, `<select>`, and `<textarea>` elements set `font-size: 16px` (or `1rem`) to prevent iOS Safari auto-zoom behavior on focus.
- **Adjust Image Aspect Ratios**: Crop hero imagery tighter on mobile viewports (`aspect-[4/3]` on mobile vs `aspect-[21/9]` on desktop) so focal points remain prominent.

## Don't
- **Don't** allow horizontal scrollbars on the `<body>` element under any circumstances.
- **Don't** hide critical actions or primary navigation links entirely on mobile views without a clear access path.
- **Don't** keep tiny desktop button padding (`px-2 py-1`) on touch screens where fingers cannot accurately tap them.
- **Don't** display 4-level nested breadcrumb trees inline on mobile viewports; collapse middle nodes (`Home / ... / Course Detail`).

## Implementation Guidance
- **Responsive Table Card Transformation Pattern**:
  ```html
  <div class="overflow-x-auto border border-subtle">
    <table class="w-full text-left text-sm">
      <thead class="bg-surface-elevated border-b border-subtle text-xs uppercase tracking-wider text-muted hidden md:table-header-group">
        <tr>
          <th class="p-4">Course Code</th>
          <th class="p-4">Title</th>
          <th class="p-4">Credits</th>
          <th class="p-4">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-subtle">
        <!-- Responsive Row: Card layout on mobile, table row on desktop -->
        <tr class="block md:table-row p-4 md:p-0">
          <td class="block md:table-cell md:p-4 text-xs font-mono text-primary font-bold md:font-normal">
            <span class="md:hidden text-muted font-normal uppercase mr-2">Code:</span>CS-301
          </td>
          <td class="block md:table-cell md:p-4 font-medium text-primary mt-1 md:mt-0">
            Algorithmic Logic & Complexity
          </td>
          <td class="block md:table-cell md:p-4 text-muted mt-1 md:mt-0">
            <span class="md:hidden text-muted font-normal uppercase mr-2">Credits:</span>3.0
          </td>
          <td class="block md:table-cell md:p-4 mt-2 md:mt-0">
            <span class="inline-block px-2 py-0.5 text-xs bg-emerald-950/40 text-emerald-400 border border-emerald-800/50">Open</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  ```

## Review Checklist
- [ ] Has the layout been explicitly designed and tested for mobile viewports (375px - 430px)?
- [ ] Are data tables adapted using horizontal scroll containers or card list transformations?
- [ ] Are touch targets at least 44x44px across interactive elements?
- [ ] Are form inputs set to at least 16px font size to prevent mobile browser auto-zoom?
- [ ] Is mobile body padding optimized to avoid wasting horizontal screen space?
