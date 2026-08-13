# Anti-AI Design

## Purpose
The Anti-AI Design skill exists to eradicate predictable, generic, template-driven AI aesthetic tropes from web interfaces. Its primary goal is to ensure every interface created feels authored by human design craft, contextually specific, visually striking, and structurally believable.

## When to Use
Use this master skill at the beginning, during, and at the end of every frontend design and implementation phase. It acts as an overarching quality governance layer that guides visual decisions, layout choices, component patterns, and aesthetic polish.

## Core Principles
1. **Contextual Rationale**: Never choose a visual treatment, font, or color because it is default or popular. Every pixel must serve a specific brand and usability rationale.
2. **Intentional Over Bizarre**: Do not make a design unusual simply to avoid looking AI-generated. Make it intentional, cohesive, and grounded in the domain.
3. **Institutional Integrity**: Treat the design as a real, living product for an established entity, not a 2-hour SaaS landing page demo.
4. **Authored Craftsmanship**: Strive for micro-details, typographic precision, and structural nuances that signal thoughtful human craftsmanship.

## Rules
1. **Font Banning**: Never reach for default AI font stacks (Inter, Geist, Roboto, Arial, or generic system fonts) unless explicitly mandated by an existing, hard-coded design system specification.
2. **Gradient Restriction**: Prohibit purple-to-blue AI gradients, floating ambient background blur blobs, and rainbow hover glows.
3. **Layout Diversification**: Never default to the generic template layout: Full-screen hero with centered text -> 3-column card grid -> Floating pricing table -> Centered CTA banner -> Standard links footer.
4. **Surface Control**: Limit excessive glassmorphism, heavy drop shadows, uniform full-border rounded cards (`rounded-2xl` on every container), and floating pill-shaped tags.
5. **Icon Moderation**: Do not place icons inside every single button, header, list item, or card title. Icons must clarify, not decorate.
6. **Animation Moderation**: Ban global fade-in-up animations applied indiscriminately to every DOM node (`stagger-fade-in` on page load).
7. **Copy Authenticity**: Never use generic LLM marketing slogans ("Empowering the future of X", "Unlock your potential", "Next-gen seamless solution").

## Do
- **Select Distinctive Typography**: Pair a character-rich serif or display sans with a highly legible, purposeful body typeface suited to the institution.
- **Vary Layout Rhythms**: Mix asymmetric editorial spreads, full-bleed color blocks, high-density data tables, and structured sidebars.
- **Use Structural Lines & Borders**: Prefer crisp structural dividers, hairline borders, and alignment grids over floating soft-shadow cards.
- **Incorporate Authentic Imagery**: Use realistic imagery direction (archival photography, documentary portraits, architectural stills) instead of stylized AI 3D avatars or generic stock photos.

## Don't
- **Don't** use floating background blurred color spheres (`bg-gradient-to-r from-purple-500 to-blue-500 blur-3xl`).
- **Don't** use uniform rounded corners (`rounded-3xl`) across every single UI box without scale hierarchy.
- **Don't** create oversized, empty hero sections with 4 words centered in 800px vertical space.
- **Don't** rely on pill buttons (`rounded-full`) for every action item, tag, and badge simultaneously.
- **Don't** generate uniform copy that sounds like a generic product release pitch.

## Implementation Guidance
- **CSS / Styling**:
  - Build crisp surface boundaries using explicit CSS variables for borders (`var(--border-subtle)`).
  - Use high-contrast typographic hierarchy with explicit font feature settings (`font-feature-settings: "cv02", "cv03", "zero"`).
- **DOM Structure**:
  - Semantic elements (`main`, `nav`, `aside`, `section`, `article`, `header`, `footer`) structured logically for document outlining.
- **Grid Systems**:
  - Utilize explicit 12-column grid setups or CSS grid areas (`grid-template-areas`) rather than flex wrappers with arbitrary margins.

## Review Checklist
- [ ] Is the primary typeface intentional and distinct from standard AI defaults (Inter/Geist)?
- [ ] Are all purple/blue ambient gradient blobs removed?
- [ ] Is the hero section structured with meaningful content rather than a sparse centered headline?
- [ ] Are cards structured with structural borders rather than heavy ambient blur shadows?
- [ ] Is icon usage sparse and functional rather than decorative clutter?
- [ ] Is copywriting specific, factual, and free of generic AI slogans?
- [ ] Does the UI feel like an authored, production-grade institutional product?
