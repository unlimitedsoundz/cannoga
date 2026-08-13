# Motion & Interaction

## Purpose
The Motion & Interaction skill ensures UI animation is purposeful, subtle, fast, and functionally meaningful. It prevents decorative animation overload, global fade-in delays, and distracting visual motion, while enforcing user motion preferences (`prefers-reduced-motion`).

## When to Use
Apply this skill when implementing UI transitions, menu toggles, modal open/close states, accordion expansions, hover micro-interactions, form validation feedback, tab switching, and toast notifications.

## Core Principles
1. **Functional Purpose**: Motion must serve 1 of 5 explicit goals: Orientation (where did this come from?), Feedback (did my action succeed?), Transition (what state am I in now?), Hierarchy (what collapsed/expanded?), or Navigation (where am I going?).
2. **Speed & Efficiency**: UI motion must be fast. Micro-interactions should execute within `100ms` – `200ms`. Complex spatial transitions must complete within `250ms` – `300ms`. Never make users wait for slow animations to finish before interacting.
3. **Domain-Calibrated Intensity**: Calibrate animation intensity to the interface context. Institutional portals and data dashboards require subtle, fast transitions; marketing spreads allow slightly more fluid spatial reveals.
4. **Accessibility First**: Respect `prefers-reduced-motion` unconditionally across all CSS transitions and JavaScript animation drivers.

## Rules
1. **Banned Motion Tropes**:
   - Prohibit global `stagger-fade-in-up` applied to every paragraph and card on page load.
   - Prohibit scroll-driven parallax effects that cause layout instability.
   - Prohibit hover scaling (`hover:scale-105`) on every static container card.
   - Prohibit infinite looping bouncing elements or pulsing CTA buttons.
2. **Motion Intensity Tiers**:
   - **Institutional / SIS / Academic Portals**: Instant or ultra-subtle (`100ms` opacity/border fade). Zero spatial displacement.
   - **Dashboards & Data Tables**: Rapid state transitions (`150ms` ease-out fill shifts). No row bounce.
   - **Form Fields & Controls**: Instant outline/border transition (`100ms` linear). Immediate validation state changes.
   - **Navigation & Modals**: Crisp slide/fade (`200ms` cubic-bezier(0.16, 1, 0.3, 1)).
3. **Bezier Curve Discipline**: Use natural easing functions (`cubic-bezier(0.16, 1, 0.3, 1)` or `ease-out`) for entering elements. Avoid linear curves for spatial motion.

## Do
- **Use Micro-Transitions for Touch / Focus**: Animate subtle border color, background tint, or opacity shifts on hover/focus.
- **Animate Disclosure Controls**: Use smooth height/opacity transitions for accordion panels and collapsible sidebars (`transition-all duration-200`).
- **Provide Instant Feedback**: Ensure buttons enter an active state (`active:scale-[0.98]`) instantly on mouse down.

## Don't
- **Don't** delay content readability by making users wait 1.5 seconds for text paragraphs to slide up onto the screen.
- **Don't** animate elements that are off-screen or out of the user's viewport.
- **Don't** use heavy spring/physics bounces on serious institutional UI components.

## Implementation Guidance
- **CSS Transitions with Reduced-Motion Support**:
  ```css
  /* Purposeful Micro-Interaction Token */
  .interactive-surface {
    transition: background-color 150ms ease-out, border-color 150ms ease-out, box-shadow 150ms ease-out;
  }

  .interactive-surface:hover {
    background-color: var(--color-surface-elevated);
    border-color: var(--color-border-hover);
  }

  .interactive-surface:active {
    transform: translateY(1px);
  }

  /* Mandatory Reduced Motion Override */
  @media (prefers-reduced-motion: reduce) {
    *,
    ::before,
    ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

## Review Checklist
- [ ] Are global fade-in-up animations and parallax scroll effects completely disabled?
- [ ] Do micro-interactions execute within `100ms` – `200ms`?
- [ ] Is motion intensity calibrated correctly for the application domain (subtle for institutional/SIS views)?
- [ ] Is `prefers-reduced-motion` implemented and tested?
- [ ] Does every animation serve an explicit functional goal (orientation, state feedback, transition)?
