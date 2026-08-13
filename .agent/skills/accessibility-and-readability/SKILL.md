# Accessibility & Readability

## Purpose
The Accessibility & Readability skill ensures every web page and component built is inherently accessible, legible, keyboard-navigable, and screen-reader compliant (WCAG 2.1 AA/AAA standards). Accessibility is treated as a fundamental architectural requirement rather than a polish phase afterthought.

## When to Use
Apply this skill continuously during DOM construction, component development, form design, color selection, modal engineering, table building, and keyboard navigation testing.

## Core Principles
1. **Universal Accessibility**: Every interactive workflow, navigation menu, form submission, and data table must be fully usable via keyboard alone and screen reader assistive technologies.
2. **Semantic Structural Integrity**: Use native HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`, `<section>`) according to their specifications.
3. **Perceivable Contrast & Legibility**: Maintain strict color contrast standards (4.5:1 minimum for body text, 7:1 for high legibility, 3:1 for large UI boundaries and focus states).
4. **Resilient Focus Management**: Provide visible, custom-styled focus indicators on all focusable controls without relying on browser default blue outlines or stripping focus rings completely.

## Rules
1. **Heading Hierarchy Rule**: Maintain strict sequential heading order (`<h1>` -> `<h2>` -> `<h3>` -> `<h4>`). Never skip heading levels (e.g., jumping from `<h1>` to `<h3>` for styling purposes). Only one `<h1>` per document.
2. **Form Control Accessibility**:
   - Every `<input>`, `<select>`, and `<textarea>` must be associated with an explicit `<label for="...">` or `aria-label`/`aria-labelledby`.
   - Inline form error messages must be linked to their input via `aria-describedby` and set `aria-invalid="true"` during error states.
3. **Interactive ARIA Attributes**:
   - Collapsible panels/menus must specify `aria-expanded="true|false"` and `aria-controls="ID"`.
   - Modals must specify `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title-id"`, and implement focus trapping.
4. **Screen Reader Text (`sr-only`)**: Provide visually hidden text for icon-only buttons (e.g., search triggers, close buttons, external link arrows).

## Do
- **Use Native Buttons**: Use `<button type="button">` or `<button type="submit">` for actions, and `<a href="...">` for page navigation. Never use `<div onClick="...">` for interactive triggers.
- **Implement Skip Links**: Provide a hidden "Skip to main content" link at the top of the document for keyboard users (`<a href="#main-content" class="sr-only focus:not-sr-only ...">`).
- **Define Table Accessibility**: Use `<caption>`, `<thead>`, `<tbody>`, `<th scope="col">`, and `<th scope="row">` on all tabular data displays.

## Don't
- **Don't** use `outline: none` or `outline: 0` in CSS without supplying a distinct, high-contrast replacement focus state (`focus-visible:ring-2 focus-visible:ring-offset-2`).
- **Don't** convey critical information (such as error states or system warnings) using color alone. Pair color shifts with clear text labels or icon indicators.
- **Don me** write non-descriptive link text like "click here", "more", or "link".

## Implementation Guidance
- **Accessible Form Input with Validation**:
  ```html
  <div class="space-y-1">
    <label for="student-id" class="block text-xs font-medium uppercase tracking-wider text-secondary">
      Student Identification Number <span class="text-error" aria-hidden="true">*</span>
    </label>
    <input
      type="text"
      id="student-id"
      name="studentId"
      required
      aria-required="true"
      aria-invalid="true"
      aria-describedby="student-id-error"
      class="w-full px-3 py-2 bg-surface border border-error text-primary focus-visible:ring-2 focus-visible:ring-error"
      value="ABC-123"
    />
    <p id="student-id-error" class="text-xs text-error flex items-center space-x-1 mt-1">
      <span aria-hidden="true">⚠</span>
      <span>Student ID must consist of 9 numerical digits (e.g., 900123456).</span>
    </p>
  </div>
  ```
- **Focus Ring CSS Utility**:
  ```css
  /* Visible Custom Focus State for Keyboard Users */
  :focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  ```

## Review Checklist
- [ ] Is there exactly 1 `<h1>` per page with strict sequential heading hierarchy (`<h2>`, `<h3>`)?
- [ ] Are all interactive elements reachable and operable via Keyboard alone (`Tab`, `Enter`, `Space`, `Esc`)?
- [ ] Do all form controls have explicit `<label>` tags and linked `aria-describedby` error descriptions?
- [ ] Is primary text contrast compliant with WCAG AA (4.5:1) / AAA (7:1) standards?
- [ ] Do icon-only buttons include visually hidden screen reader text (`sr-only`)?
- [ ] Are modal dialogs equipped with focus trap mechanisms and `role="dialog"` attributes?
