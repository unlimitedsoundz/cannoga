# Layout & Composition

## Purpose
The Layout & Composition skill frees web application interfaces from repetitive, predictable page assembly templates. It teaches coding agents to compose page layouts derived directly from content needs, using varied spatial structures, editorial grids, structured horizontal bands, and asymmetric density.

## When to Use
Apply this skill when planning page blueprints, structuring page sections, layout out dashboards, organizing long-form content, building news/announcement hubs, or displaying structured institutional data.

## Core Principles
1. **Content-Driven Blueprinting**: Let the content format dictate the layout structure. Do not force rich institutional data into uniform 3-column cards.
2. **Structural Rhythm**: Alternate between dense information bands, expansive lead sections, asymmetric split grids, and focused reading columns to maintain visual engagement.
3. **Architectural Grid Systems**: Utilize crisp hairline grid borders, explicit column ratios (e.g., 8/4, 7/5, 9/3 split), and aligned baseline structures.
4. **Controlled Whitespace**: Use whitespace intentionally to group related content, not as empty gaps separating identical boxes.

## Rules
1. **Template Ban**: Ban the repetitive formula: *Full-Screen Centered Hero -> 3 Equal Cards -> 3 Equal Cards -> Centered Floating CTA Box -> Standard Footer*.
2. **Layout Pattern Catalog**: Choose from these content-appropriate structures:
   - **Asymmetric Split Hero**: 60% prominent text column paired with 40% dense metadata, quick-links list, or live status panel.
   - **Editorial Sidebar Grid**: 30% sticky navigation/table of contents sidebar paired with 70% long-form structured content column.
   - **Dense Information Band**: Full-width structured summary bar displaying statistics, key dates, or status metrics across hairline dividers.
   - **Split Visual Lead**: Left side full-bleed high-quality imagery or architectural photo, right side high-density program index or institutional statement.
   - **Multi-Row Structured Directory**: Alternating full-width rows with clear key-value alignment rather than floating grid cards.
   - **Data Table / Schedule Grid**: Full-width structured grid for timetables, calendars, course prerequisites, and financial schedules.
3. **Horizontal Structure Priority**: Incorporate strong horizontal border lines (`border-t`, `border-b`) to delineate sections cleanly without requiring shadow cards.

## Do
- **Establish Baseline Alignment**: Align headings, body copy, and metadata across column boundaries to form visual axes.
- **Use Sticky Sidebars**: Provide persistent sticky navigation, quick jump links, or context panels alongside long scrolling pages.
- **Vary Section Densities**: Pair a low-density high-impact header with a high-density tabular or list section.
- **Design Full-Bleed Color Bands**: Break long white pages with full-width dark or warm tonal background bands.

## Don't
- **Don't** wrap every piece of content in a floating rounded shadow card box (`bg-white p-6 rounded-2xl shadow-lg`).
- **Don't** center alignment for long body paragraphs or multi-line section descriptions.
- **Don't** leave vast empty gutters (`gap-24`) that disconnect related visual elements.
- **Don't** use identical 3-column card grids for entirely different types of content (e.g., news, staff profiles, degree lists, features).

## Implementation Guidance
- **Asymmetric Split Layout**:
  ```html
  <section class="grid grid-cols-1 lg:grid-cols-12 border-b border-subtle">
    <!-- Main Focus (8 cols) -->
    <div class="lg:col-span-8 p-8 lg:p-12 border-r border-subtle">
      <span class="text-xs uppercase tracking-wider text-muted mb-4 block">Faculty of Architecture</span>
      <h1 class="text-h1 font-heading mb-6">Urban Planning & Sustainable Infrastructure</h1>
      <p class="text-lead max-w-2xl mb-8">An interdisciplinary degree program focused on civic design, public policy, and environmental engineering.</p>
    </div>
    <!-- Context Panel (4 cols) -->
    <div class="lg:col-span-4 p-8 bg-surface-elevated flex flex-col justify-between">
      <div class="space-y-6">
        <h3 class="text-sm font-semibold uppercase tracking-wider text-muted">Program Snapshot</h3>
        <dl class="space-y-4 text-sm divide-y divide-subtle">
          <div class="pt-3 flex justify-between"><dt class="text-muted">Degree</dt><dd class="font-medium">Master of Science (M.Sc.)</dd></div>
          <div class="pt-3 flex justify-between"><dt class="text-muted">Duration</dt><dd class="font-medium">2 Years (Full-Time)</dd></div>
          <div class="pt-3 flex justify-between"><dt class="text-muted">Campus</dt><dd class="font-medium">Main Academic Quad</dd></div>
        </dl>
      </div>
      <a href="#apply" class="btn-primary w-full text-center mt-8">Start Application</a>
    </div>
  </section>
  ```

## Review Checklist
- [ ] Does the page layout avoid the generic hero -> cards -> CTA template?
- [ ] Is layout choice directly derived from the specific content type?
- [ ] Are structural hairline borders (`border-subtle`) used to organize content areas?
- [ ] Is asymmetric column sizing (e.g., 8/4 or 7/5 split) utilized for rhythm?
- [ ] Are horizontal section bands employed to create visual momentum?
