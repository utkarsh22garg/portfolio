# Design System Document: Editorial Brutalism

## 1. Overview & Creative North Star
### The Creative North Star: "The Monolith"
This design system is built upon the philosophy of **Editorial Brutalism**. It rejects the cluttered, "component-heavy" look of traditional SaaS platforms in favor of a high-end digital editorial experience. It mimics the stark authority of a luxury broadsheet or a gallery exhibition poster.

**Breaking the Template:**
We achieve a custom, premium feel through **Extreme Scale Disparity**. By placing massive, screen-filling headlines (`display-lg`) in direct proximity to tiny, precise metadata (`label-sm`), we create a rhythmic tension that feels intentional and curated. The layout relies on vast "negative space" to force the user's eye onto content, using asymmetry to guide the narrative rather than a rigid, predictable grid.

---

## 2. Colors
The palette is strictly monochromatic (Saturation: 0), relying on tonal depth rather than hue to convey hierarchy.

- **Primary (`#FFFFFF`)**: Reserved for critical information and primary headlines.
- **Surface (`#131313`)**: The canvas. Deep, but not a pure "true black" to allow for subtle depth layering.
- **Tonal Accents**: Grays like `#6B7280` and `#333333` are used for secondary information and structural depth.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning. Structural boundaries must be defined solely through:
1. **Background Shifts:** Transitioning from `surface` to `surface-container-low`.
2. **Vertical Whitespace:** Using massive padding (e.g., 160px+) to denote a new section.
3. **Typographic Anchors:** A large headline is a boundary in itself.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
- Use `surface-container-lowest` (#0E0E0E) for recessed areas like code blocks or secondary footers.
- Use `surface-bright` (#393939) for elevated elements like floating navigation or modal surfaces.
- **The Glass & Gradient Rule:** For main CTAs or "hero" containers, apply a subtle linear gradient from `primary` (#FFFFFF) to `primary-container` (#D4D4D4) at a 45-degree angle. This provides a "metallic" or "fine paper" sheen that flat hex codes cannot replicate.

---

## 3. Typography
We use **Inter** as our typographic backbone, treated with a heavy editorial hand.

- **Display Scale (`3.5rem`+)**: These are not just titles; they are graphic elements. Set with tight letter-spacing (-0.04em) and bold weights. Use `on-primary` (#FFFFFF) or `on-surface-variant` (#C6C6C6) for a layered, faded-into-background look.
- **The Meta Contrast**: `label-sm` (0.6875rem) should be used immediately following `display-lg`. This "High-Low" pairing is the signature of the system.
- **Hierarchy of Authority**:
- **Display/Headline**: The "Hook" (Bold, Massive).
- **Title**: The "Topic" (Medium, Clear).
- **Body**: The "Narrative" (Book weight, generous line-height 1.6).
- **Label**: The "Annotation" (Uppercase, tracked out +0.1em).

---

## 4. Elevation & Depth
In this design system, "Flat is Luxury." We avoid traditional material shadows.

- **The Layering Principle:** Depth is achieved by "stacking" tonal values. Place a `surface-container-highest` (#353535) card on a `surface` (#131313) background for a natural, soft lift.
- **Ambient Shadows:** If a floating effect is mandatory, use a "Cloud Shadow": `box-shadow: 0 20px 80px rgba(0,0,0,0.5)`. Never use small, hard shadows.
- **The "Ghost Border" Fallback:** If a container requires a boundary (e.g., input fields), use `outline-variant` (#474747) at **15% opacity**. It should be felt, not seen.
- **Glassmorphism:** For top navigation or overlays, use `surface` at 70% opacity with a `backdrop-filter: blur(20px)`. This creates an "etched glass" effect that integrates the content behind it.

---

## 5. Components

### Buttons
- **Primary**: Sharp corners (`0px`). Background: `primary` (#FFFFFF), Text: `on-primary` (#1A1C1C).
- **Secondary**: Ghost style. `1px` border using `outline` at 20% opacity. Text: `primary`.
- **Tertiary**: Text-only, uppercase, with a custom `0.5px` underline that expands on hover.

### Cards & Lists
- **Rule**: Forbid divider lines.
- Separation is achieved by `surface-container` shifts or 80px+ of vertical space.
- Large images should be treated as full-bleed elements within their containers to maintain the "Editorial" feel.

### Input Fields
- Underline-only or subtle `surface-container-high` backgrounds.
- Active state: The label shifts from `on-surface-variant` to `primary` (#FFFFFF). Sharp corners always.

### Navigation (Ultra-Minimal)
- Positioned at the extreme edges of the viewport.
- Use `label-md` for nav items, uppercase, with high tracking. No icons unless strictly necessary.

---

## 6. Do's and Don'ts

### Do:
- **Do** use asymmetrical margins. If a text block is 6 columns wide, offset it by 2 columns.
- **Do** use grayscale for everything. The only allowed color is `error` (#FFB4AB) for critical failures.
- **Do** embrace the "Fold." Let large typography be cut off by the edge of the screen to create a sense of scale.

### Don't:
- **Don't** use rounded corners. The `ROUND_FOUR` (4px) is the absolute maximum for interactive elements; headers and cards must be `0px`.
- **Don't** use "Card-itus." Avoid putting everything in a boxed container. Let content float on the surface.
- **Don't** use icons as a crutch. Rely on typography to communicate meaning first.
- **Don't** use 100% opaque borders. They clutter the visual field and break the editorial flow.

### Accessibility Note:
While the system is high-contrast, ensure that `on-surface-variant` (#C6C6C6) text on `surface` (#131313) maintains a 4.5:1 ratio for body copy. Use `primary` (#FFFFFF) for all critical reading paths.
