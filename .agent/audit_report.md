# Comprehensive Design Audit — Cannoga College Project

**Audit Date**: August 13, 2026  
**Audited Against**: `.agent/skills/` Design Skills System (14 Master & Core Skills)  
**Target Repository**: `cannogauniversity` (Ottawa, Ontario, Canada)

---

## Executive Summary

This comprehensive design audit evaluates the current **Cannoga College** web application codebase (`src/app/`, `src/components/`, `globals.css`) against the 14 skills defined in `.agent/skills/`.

While the application features functional Next.js routing, Supabase data fetching, and an Ottawa land acknowledgement, its visual identity, typography, CSS architecture, layout structures, and editorial voice suffer from severe **generic AI tropes, foreign library artifacts (`aalto-*`), nuclear CSS overrides, and brand incoherence**.

---

## 1. Global Systemic & Architectural Violations

### A. Typography System (`typography-system/SKILL.md`)
1. **Font Variable Hijacking**: `src/app/layout.tsx` maps both `--font-inter` and `--font-playfair` to `'Metropolis', sans-serif`, completely disabling serif typography across the site.
2. **Nuclear CSS Font Override**: `globals.css` (lines 200–206) enforces `font-family: var(--font-sans) !important;` on all inline styled elements and CKEditor content, stripping typographic contrast.
3. **Nuclear Unbolding**: `globals.css` (line 481) sets `strong, b { font-weight: 400 !important; }`, disabling native text emphasis site-wide.
4. **Font Fragmentation**: The site switches fonts arbitrarily from `Metropolis` on public pages to `Lato` on `[data-theme="portal"]` and `[data-theme="sis"]` routes, causing visual jarring.

### B. Colour Direction (`colour-direction/SKILL.md`)
1. **Unjustified AI Accent Color**: The primary brand color in `globals.css` is defined as `#9c27b3` (a harsh electric magenta / purple). This color is applied indiscriminately to buttons, hover strokes, table headers, blockquote borders, and background banners.
2. **Brand Palette Incoherence**: Key pages use conflicting background colors—About Page hero uses olive gold (`#6c531b`), Admissions Page hero uses dark purple (`#472247`), and general sections use raw `#9c27b3`.
3. **Absence of Domain Color Rationale**: Canadian post-secondary institutions in Ottawa rely on rich, authoritative palettes (e.g., Oxford Navy, Heritage Crimson, Forest Slate, Warm Paper White). Electric magenta lacks institutional weight.

### C. Layout & Structural Mechanics (`layout-composition/SKILL.md`)
1. **Nuclear Style Overrides**:
   - `*:not(.rounded-full)... { border-radius: 0 !important; }` forces aggressive square corners on every box site-wide.
   - `*, *::before, *::after { box-shadow: none !important; transition: none !important; }` globally disables smooth hover transitions and elevation depth.
   - `[data-theme="portal"] [class*="grid-cols-2"] { grid-template-columns: 1fr !important; }` destroys multi-column form layouts on desktop viewports.
2. **Foreign Library Artifacts (`aalto-*`)**: Extensive residual classes (`.aalto-side-navigation`, `.aalto-txt-small-bold`, `.text-aalto-5`) copied directly from Aalto University (Finland) component libraries, causing naming and structural confusion.

---

## 2. Page-by-Page Audit Findings

### Page 1: Global Header & Navigation (`Header.tsx` / `ConditionalHeaderFooter.tsx`)
- **Anti-AI & Institutional Violations**: Lacks an audience-switching utility bar (Prospective Students, Current Students, Faculty & Staff, Alumni, International).
- **Colour & Micro-Details**: Uses electric purple hover highlights (`hover:text-[#9c27b3]`). Missing an institutional emergency/notice ticker band.
- **Responsiveness**: The mobile drawer menu compresses links into a single list without sub-category accordions or touch-target spacing (`44x44px`).

### Page 2: Global Footer (`Footer.tsx`)
- **Positive Elements**: Features an authentic Land Acknowledgement for the Ottawa campus (Anishinaabe Algonquin Nation territory).
- **Violations**: Uses raw un-tokenized `#191919` dark background. Lacks official accreditation badges (Ontario Ministry of Colleges and Universities - MCU, OCQAS).
- **Typography**: Section titles use raw `text-white font-bold` without distinct typographic tracking or scale hierarchy.

### Page 3: Homepage (`src/app/page.tsx`)
- **Layout Pattern**: Follows the repetitive generic template: *Hero Carousel -> 6-Card Grid -> News/Events Grid -> 4-Card School Grid -> 6-Item Resource Hub*.
- **Typography & Headline**: Section headings rely on uppercase shouting typography (`text-3xl font-black uppercase tracking-tight`).
- **Colour**: Heavy reliance on `#9c27b3` purple highlights on card hover (`hover:border-[#9c27b3]`) and icon badges (`bg-[#9c27b3]`).
- **Content**: Vague promotional copy (*"Find the right academic path tailored to your goals"*). Programs lack clear Canadian credential designations (e.g., OSSD admission requirements, Co-op indicators, PGWP status).

### Page 4: About Us (`src/app/about/page.tsx`)
- **Colour & Branding**: Hero section uses dark olive gold (`#6c531b`), while the stats banner uses full-bleed `#9c27b3` purple with giant text (`text-7xl font-black`).
- **Imagery & Art Direction**: Uses raw hash-based image filenames (`0f4315c00b2784fbddf4239ce341dd7e.jpg`) wrapped in `rounded-3xl` with an inline purple multiply overlay (`bg-[#9c27b3] opacity-20 mix-blend-multiply`).
- **Content Clichés**: Uses generic phrases ("We don't just study the future; we build it", "Vibrant Community", "Life Beyond the Classroom").
- **Canadian Context Gap**: Missing institutional governance details (Board of Governors, President's Office, Academic Senate, Strategic Plan 2025–2030, DLI #).

### Page 5: Admissions & Enrollment Hub (`src/app/admissions/page.tsx`)
- **Credential & Terminology Confusion**: Combines Bachelor's, Master's, Certificate, and Diploma admissions into a single page without clear Canadian post-secondary framing (Ontario Colleges grant Certificates, Diplomas, Advanced Diplomas, Graduate Certificates, and Honours Bachelor's Degrees).
- **Layout & Sidebar**: The Table of Contents sidebar is hidden entirely on mobile (`hidden lg:col-span-3`) without providing a mobile sticky jump menu.
- **Colour**: Hero uses dark purple `#472247`, while the Admissions Office contact box uses `#9c27b3` purple.

### Page 6: Academic Schools Pages (`src/app/schools/page.tsx` & sub-routes)
- **Visual Hierarchy**: Cards display school titles without clear metadata (faculty count, degree levels offered, department list).
- **Layout**: Standard 2-column or 4-column card grid without editorial hero spreads or split research callouts.

### Page 7: Student Information System (SIS) & Admin (`src/app/sis/...` & `src/app/admin/...`)
- **Typography & Theme Split**: Forced `Lato` font and hardcoded black/dark-mode theme (`bg-[#121212]`) creates an abrupt visual fracture from the public college site.
- **Form Controls**: Forced single-column utility in `globals.css` breaks multi-column form layouts on desktop.

---

## 3. Canadian Higher-Education Authenticity Opportunities

To elevate Cannoga College to the visual authority and operational realism of top Canadian post-secondary institutions (such as Algonquin College, Carleton University, Seneca, Humber, or University of Ottawa):

1. **Official Accreditation & Regulatory Identifiers**:
   - Display the **DLI (Designated Learning Institution) Number**, Ontario Ministry of Colleges and Universities (MCU) recognition notice, and OCQAS (Ontario College Quality Assurance Service) accreditation markers in the footer and admissions pages.
2. **Authentic Ontario Post-Secondary Credentials**:
   - Restructure program pathways according to official Ontario post-secondary credential frameworks:
     - *Ontario College Certificate* (1 year)
     - *Ontario College Diploma* (2 years)
     - *Ontario College Advanced Diploma* (3 years)
     - *Ontario College Graduate Certificate* (1 year post-grad)
     - *Honours Bachelor's Degree* (4 years)
3. **Ottawa Regional & Capital Identity**:
   - Highlight Ottawa-specific advantages: proximity to Parliament Hill, national research labs (NRC, CRC), the Kanata North Technology Park (Canada's largest tech hub), and federal government co-op placement pathways.
4. **Indigenous Services & Land Acknowledgement**:
   - Expand the Anishinaabe Algonquin Land Acknowledgement into dedicated Indigenous Student Services resources (e.g., Indigenous Resource Centre, Elder-in-Residence, Indigenous Studies pathways).
5. **Bilingual Utility & Official Language Marker**:
   - Incorporate an English / French language toggle (`EN | FR`) in the utility top-bar to reflect Ottawa's official bilingual status.
6. **IRCC Compliance & Work Permit Integration**:
   - Add explicit **Post-Graduation Work Permit (PGWP)** eligibility tags directly to every program card and admissions specs block.

---

## 4. Remediation Plan Summary

| Domain | Required Action |
| :--- | :--- |
| **Typography** | Remove nuclear font overrides in `globals.css`, restore `--font-playfair` serif headings paired with clean sans body, and re-enable `strong`/`b` font weights. |
| **Color System** | Transition from electric purple `#9c27b3` to an authoritative Canadian institutional palette (e.g., Deep Ottawa Navy `#0f2027` with Warm Gold accents and Warm Off-White backgrounds). |
| **CSS Clean-up** | Eliminate nuclear `border-radius: 0 !important;` and `transition: none !important;` overrides; purge foreign `aalto-*` library classes. |
| **Layout Rhythm** | Replace repetitive 3-column card grids with asymmetric editorial splits, structured horizontal data bands, and sticky sidebars. |
| **Editorial Copy** | Replace AI clichés with factual Ottawa campus data, precise Ontario credential names, and clear admissions criteria. |
