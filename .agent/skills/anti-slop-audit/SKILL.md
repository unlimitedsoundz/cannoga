# Anti-Slop Audit

## Purpose
The Anti-Slop Audit skill is the final, mandatory quality-control gatekeeper. Before any frontend implementation, refactoring step, component build, or design update is declared complete, it must pass this 20-point human design craftsmanship verification audit.

## When to Use
Execute this audit at the end of every frontend task before presenting work to the user or declaring execution complete. If any audit question fails, the implementation must be revised to fix the deficiency.

## Core Principles
1. **Zero Tolerance for Generic Design**: Never ship generic AI slop. If an interface looks like a default v0/Cursor output or a 2024 SaaS template, it is incomplete.
2. **Intentionality Test**: Every color, font, border, padding value, animation, and image must have an authored design rationale.
3. **Credibility & Authority**: The interface must communicate institutional trust, operational efficiency, and domain authenticity.
4. **Comprehensive Evaluation**: Quality control spans visual aesthetic, spatial composition, editorial copy, mobile ergonomics, accessibility, and brand coherence.

## Rules
1. **Mandatory 20-Point Audit Checklist**: Evaluate the implementation against these 20 explicit questions:

   1. **Generic AI Aesthetic Check**: Does it look like a generic AI-generated website or template?
   2. **Uniqueness Check**: Could this design belong to 500 other unrelated tech websites without modification?
   3. **Typography Check**: Is the typography generic (e.g., default Inter/Geist without contextual character)?
   4. **Gradient Check**: Are purple/blue gradients or ambient blur blobs being used without brand rationale?
   5. **Card Overuse Check**: Are there excessive floating rounded cards (`rounded-2xl shadow-lg`) where structural borders should be used?
   6. **Pill Overuse Check**: Are there too many pill-shaped tags (`rounded-full`) cluttering the UI?
   7. **Shadow Overuse Check**: Are drop shadows excessive, heavy, or ambient instead of clean hairline dividers?
   8. **Sparsity Check**: Is the page unnecessarily sparse with huge empty gaps trying to look "modern"?
   9. **Density Check**: Is the page unnecessarily dense, unorganized, or lacking visual breathing room?
   10. **Hierarchy Check**: Is the 5-level visual hierarchy clear, with exactly 1 primary focal point per section?
   11. **Colour System Check**: Does the color system feel intentional, semantic, and contrast-compliant (WCAG AA/AAA)?
   12. **Editorial Copy Check**: Does the copy sound AI-generated ("Empowering the future...", "Unlock your potential...")?
   13. **Imagery Check**: Are images relevant, high quality, and free of generic stock or uncanny AI people?
   14. **Animation Check**: Is animation purposeful, fast (<200ms), and respectful of `prefers-reduced-motion`?
   15. **Mobile Ergonomics Check**: Does mobile feel intentionally designed rather than just a squeezed desktop view?
   16. **Domain Specificity Check**: Does the interface feel specific to the actual organization and domain?
   17. **Credibility Check**: Does the design communicate institutional authority, legibility, and trustworthiness?
   18. **Decoration Check**: Are there meaningless decorative elements (floating dots, random shapes) that add noise?
   19. **Component Variation Check**: Are components repeated mechanically without contextual adaptation?
   20. **Designer Rationale Check**: Could a senior human designer articulate a specific reason for every major visual decision?

2. **Remediation Requirement**: If 1 or more questions fail during evaluation, the agent MUST perform targeted refactoring to resolve the failure before concluding the task.

## Do
- **Run the Audit Systematically**: Methodically review the rendered UI DOM or code against all 20 questions.
- **Refactor Promptly**: Replace generic UI cards with structural hairline bands, remove default fonts, replace cliché headlines with factual copy.
- **Verify Accessibility**: Test keyboard navigation focus states and contrast ratios alongside the audit.

## Don't
- **Don't** skip the audit or mark it as passed when generic AI elements remain in the codebase.
- **Don't** consider a page complete if it fails mobile viewport layout checks.
- **Don't** accept placeholder marketing clichés in production code.

## Implementation Guidance
- **Audit Execution Log Template**:
  ```markdown
  ### Anti-Slop Audit Evaluation
  - [x] Q1: Generic AI Aesthetic -> PASSED (Custom newsreader/sans type, hairline borders)
  - [x] Q2: Uniqueness -> PASSED (Specific academic portal layout & utility bar)
  - [x] Q3: Typography -> PASSED (Newsreader serif headlines + Source Sans 3 body)
  - [x] Q4: Gradients -> PASSED (Zero AI purple/blue gradients used)
  - [x] Q5: Card Overuse -> PASSED (Hairline grid bands used instead of floating cards)
  - [x] Q6: Pill Overuse -> PASSED (Muted rectangular monospace badges used)
  - [x] Q7: Shadow Overuse -> PASSED (1px borders, zero ambient drop shadows)
  - [x] Q8: Sparsity -> PASSED (Balanced information density)
  - [x] Q9: Density -> PASSED (Structured tabular padding & clear group gutters)
  - [x] Q10: Hierarchy -> PASSED (Single Level 1 headline, clear Level 2-5 breakdown)
  - [x] Q11: Colour System -> PASSED (Academic Crimson + Slate Navy, 7.8:1 contrast)
  - [x] Q12: Copy -> PASSED (Factual institutional copy, zero marketing slogans)
  - [x] Q13: Imagery -> PASSED (Architectural photo with contrast scrim)
  - [x] Q14: Motion -> PASSED (Fast 150ms transitions, reduced motion CSS included)
  - [x] Q15: Mobile Ergonomics -> PASSED (Card transformation table + touch targets >44px)
  - [x] Q16: Domain Specificity -> PASSED (Faculty hierarchy + course codes)
  - [x] Q17: Credibility -> PASSED (Authoritative, clean visual tone)
  - [x] Q18: Decoration -> PASSED (Zero meaningless floating decorative shapes)
  - [x] Q19: Component Variation -> PASSED (Contextual card layout per data type)
  - [x] Q20: Designer Rationale -> PASSED (All color, type, & layout choices documented)
  ```

## Review Checklist
- [ ] Have all 20 audit questions been evaluated against the UI code?
- [ ] Are any audit failures resolved prior to task completion?
- [ ] Is the final result demonstrably intentional, authored, human-designed, and production-quality?
