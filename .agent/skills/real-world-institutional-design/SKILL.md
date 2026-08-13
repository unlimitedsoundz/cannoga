# Real-World Institutional Design

## Purpose
The Real-World Institutional Design skill trains AI coding agents to architect and design web interfaces for authentic, real-world organizations—such as universities, healthcare networks, financial institutions, and civic bodies—without defaulting to tech startup, crypto, or B2B SaaS template patterns.

## When to Use
Apply this skill whenever building or refining interfaces for established institutions, public sector organizations, educational entities, enterprise systems, or heritage brands where credibility, density, governance, and structured navigation take precedence over marketing fluff.

## Core Principles
1. **Domain-Specific Information Architecture**: Structure content according to the organizational domain's real operational realities (e.g., faculties, accreditation, compliance, service portals) rather than generic marketing funnels.
2. **Authority & Legibility**: Establish visual authority through refined typography, clear information hierarchy, high contrast, and structured data layouts.
3. **Information Density**: Real institutional users require efficient access to data, schedules, forms, directories, and notices. Do not dilute density with artificial empty space.
4. **Institutional Nomenclature**: Use industry-authentic terminology (e.g., *Registrar, Syllabus, Course Catalog, Faculty Council, Bursar*) rather than modern SaaS euphemisms (*Dashboard, Workflows, Solutions, Upgrade*).

## Rules
1. **No Startup Tropes**: Never use floating pricing cards, "Request Demo" sticky buttons, gamified confetti animations, or dark-mode neon glows on an institutional site.
2. **Educational Architecture Prioritization**: For higher education (universities and colleges), mandatory structural sections must include:
   - Academic Hierarchy (Faculties -> Schools -> Departments -> Degree Programs)
   - Credentials & Accreditation
   - Admissions & Financial Aid / Tuition Schedules
   - Academic Calendar & Term Dates
   - Student Services & Registrar Resources
   - Research Institutes & Publications
   - Campus Maps & Governance / Board Policies
3. **Multi-Audience Navigation**: Institutional headers must serve distinct user personas simultaneously (Prospective Students, Current Students, Faculty/Staff, Alumni, Researchers, Public/Media).
4. **Data-Rich Layouts**: Present schedules, program requirements, and directories in clear, structured tables and definition lists rather than decorative grid cards.

## Do
- **Use Multi-Tiered Header Systems**: Implement utility top-bars for targeted audience links (e.g., "Students", "Faculty & Staff", "Directory", "Library", "Portal") paired with main domain navigation.
- **Implement Structured Metadata**: Display course codes, credit hours, department affiliations, office hours, and policy reference numbers prominently.
- **Utilize Official Branding Guidelines**: Respect formal color palettes (navy, burgundy, forest green, slate, warm white) and official seals/crests.
- **Design Dense Notice Boards**: Incorporate official alerts, emergency banners, press announcements, and event calendars with timestamped metadata.

## Don't
- **Don't** group university degree offerings into a 3-tier "Basic / Pro / Enterprise" pricing table.
- **Don't** replace detailed academic program requirements with vague marketing bullet points.
- **Don't** use playful cartoon illustrations or floating 3D icons for serious institutional categories (e.g., Financial Aid, Governance).
- **Don't** hide critical operational information (deadlines, forms, policies) behind interactive modals or multistep wizards when a clear table or list is standard.

## Implementation Guidance
- **Educational Hierarchy Mapping**:
  ```html
  <nav aria-label="Institutional Hierarchy" class="breadcrumbs">
    <ol>
      <li><a href="/academics">Academics</a></li>
      <li><a href="/faculties/arts-science">Faculty of Arts & Sciences</a></li>
      <li><a href="/departments/computer-science">Department of Computer Science</a></li>
      <li aria-current="page">B.Sc. Software Engineering</li>
    </ol>
  </nav>
  ```
- **Audience Switching Utility Bar**:
  - Position an explicit utility tier above the main navigation with links tuned to explicit user groups.
- **Institutional Tables**:
  - Style tables with clean hairline borders, fixed th headers, subtle alternating row backgrounds, and explicit alignment for numeric values.

## Review Checklist
- [ ] Does the navigation structure reflect authentic institutional organization (Faculties, Departments, Services)?
- [ ] Are academic/institutional terms used correctly (e.g., Bursar, Credit Hours, Prerequisites, Syllabus)?
- [ ] Is there an audience-switching utility bar (Students, Faculty, Alumni, Visitors)?
- [ ] Are data structures (timetables, course lists, directory profiles) presented in accessible, high-density formats?
- [ ] Is the visual tone authoritative, formal, and free of startup marketing tropes?
