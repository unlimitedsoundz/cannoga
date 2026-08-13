# Imagery & Art Direction

## Purpose
The Imagery & Art Direction skill governs visual assets, photography, and art selection across web applications. It prevents the inclusion of generic, uncanny AI-generated humans, glossy tech stock photos, and random placeholder imagery, replacing them with purposeful, documentary-grade visual art direction aligned with the organization's brand identity.

## When to Use
Apply this skill when selecting imagery, generating image prompts (e.g. via `generate_image`), setting aspect ratios, art-directing photo banners, styling image cards, or configuring media galleries.

## Core Principles
1. **Purposeful Art Direction**: Every image must tell an authentic story about the institution, facility, research effort, or community. Never place an image merely to fill empty whitespace.
2. **Authentic Subject Matter**: Photography should portray authentic people in real environments—such as genuine campus architecture, active research laboratories, archival collections, and authentic seminar discussions.
3. **Cohesive Visual Style**: Maintain consistent lighting, color grading, and composition across all imagery on a site (e.g., editorial natural light, architectural symmetry, archival duotone).
4. **No Synthetic AI Archetypes**: Ban glossy, smooth-skinned, uncanny AI-generated models and hyper-polished tech office stock imagery.

## Rules
1. **Art Direction Categories**: Choose imagery strictly from these authentic domain categories:
   - **Documentary / Campus Life**: Candid, natural-light captures of students in libraries, lecture halls, or quad benches.
   - **Architectural**: High-contrast exterior or interior shots highlighting institutional buildings, libraries, colonnades, or modern research labs.
   - **Laboratory & Technical**: Macro photos of actual research equipment, scientific specimens, archival manuscripts, or engineering workshops.
   - **Portraiture**: Environmental portraits of faculty members, researchers, or administrators in their actual working spaces.
   - **Archival & Historic**: High-resolution historical photographs, original documents, maps, or institutional artifacts.
   - **Cinematic Environmental**: Atmospheric landscape or campus aerial stills with natural shadow depth and rich color grading.
2. **Image Framing & Aspect Ratios**: Enforce explicit aspect ratios (`16:9`, `4:3`, `3:2`, or `1:1`) with crisp CSS container cropping (`object-cover`). Avoid arbitrary unconstrained image dimensions.
3. **Image Overlays & Treatments**: When overlaying text on imagery, use solid editorial color splits or targeted gradient overlays (`bg-gradient-to-t from-black/80 via-black/40 to-transparent`) to guarantee WCAG AAA text legibility.
4. **Alt Text Requirement**: Every visual asset must include detailed, descriptive `alt` text explaining its subject matter and context.

## Do
- **Use Real Placeholders / Artifacts**: When actual photos are unavailable, use precise architectural illustrations, domain-specific data diagrams, or archival duotone assets.
- **Apply Subtle Surface Borders**: Frame images with hairline borders (`border border-subtle`) to anchor them structurally within the page layout.
- **Implement Lazy Loading**: Apply `loading="lazy"` and explicit `width`/`height` attributes to prevent layout shifts (CLS).

## Don't
- **Don't** use stock photos of smiling business people shaking hands in front of a white glass office building.
- **Don't** use generic floating 3D glossy spheres, abstract neon rings, or glowing AI tech brains.
- **Don't** place text directly over high-contrast busy photos without a protective contrast scrim or background container.
- **Don't** stretch or distort image aspect ratios.

## Implementation Guidance
- **Editorial Hero Image Banner with Scrim**:
  ```html
  <figure class="relative overflow-hidden border border-subtle aspect-[21/9]">
    <img
      src="/assets/images/campus-architecture.jpg"
      alt="Low angle view of the historic Cannoga College quadrangle and library colonnade"
      class="w-full h-full object-cover"
      width="1600"
      height="685"
      loading="eager"
    />
    <figcaption class="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/85 via-black/50 to-transparent text-white">
      <span class="text-xs uppercase tracking-wider text-amber-400 font-mono">Archive No. 1924</span>
      <p class="text-sm font-medium mt-1">The Founders Quadrangle & Main Library Atrium, Established 1924.</p>
    </figcaption>
  </figure>
  ```

## Review Checklist
- [ ] Are generic stock photos and uncanny AI-looking people completely eliminated?
- [ ] Does every image fall into an authentic art direction category (architectural, documentary, lab, archival, portrait)?
- [ ] Is text overlaid on imagery protected by calculated contrast scrims (WCAG AAA compliant)?
- [ ] Are explicit aspect ratios and `object-cover` cropping enforced?
- [ ] Is detailed, context-rich alt text provided for every visual asset?
