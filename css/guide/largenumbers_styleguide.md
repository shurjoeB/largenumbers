# Design Guidelines: India’s Financial Scams Timeline

**Document type:** Visual design and implementation specification  
**Project:** Timeline of major financial scams and financial scandals in India, 1990–2026  
**Design direction:** Editorial minimalism — concept-led, data-first, calm, precise  
**Reference influences:** Information is Beautiful (visual metaphor), Our World in Data (clarity and sourcing), Financial Times (editorial restraint)

---

## 1. Product and visual intent

Create a clear, elegant visual timeline that communicates the scale of reported financial scandals by comparing each headline amount with **India’s Union Health Budget for FY 2024–25**.

The distinctive visual device is an **India-shaped silhouette as a unit of measurement**:

- `1.0×` = one fully filled India silhouette.
- `1.5×` = one fully filled silhouette plus a second filled to 50%.
- `0.4×` = one silhouette filled to 40%.
- `2.25×` = two full silhouettes plus a third filled to 25%.

The map is the data mark, not decoration. Keep silhouette dimensions and proportions consistent throughout the visualisation.

### Design principles

1. **Editorial, not dashboard-like.** Make it feel like a considered data-journalism feature.
2. **One clear idea.** The repeated India silhouette should make the budget comparison immediately understandable.
3. **Whitespace is functional.** Prefer fewer, well-spaced labels over dense annotations.
4. **Colour carries meaning.** Use colour to encode amount type or evidentiary status, not to decorate individual cases.
5. **Be explicit about uncertainty.** A reported amount is not automatically a proven loss.
6. **Source the numbers.** Make it easy to see what each amount means and where it came from.
7. **Responsive by design.** Preserve legibility on desktop, tablet and mobile rather than shrinking the entire desktop graphic.

---

## 2. Core layout

### Desktop layout

Use a wide editorial canvas, ideally around a 16:9 to 2:1 content area depending on label density.

1. **Header**
   - Eyebrow: `INDIA · 1990–2026`
   - Main headline: `The Scale of the Scam`
   - Short explanatory subtitle: explain that each India map equals one FY 2024–25 Union Health Budget.
   - A compact benchmark block showing the exact official benchmark amount and source.

2. **Legend**
   - Place directly below the header.
   - Use short labels with plain-language descriptions.
   - Do not rely on colour alone; every category needs text and/or a symbol.

3. **Main chart**
   - X-axis: year the scandal became public / was exposed.
   - Y-axis: reported amount as a multiple of the benchmark.
   - Each case is represented by one or more stacked India silhouettes.
   - Place case name, year and amount near the mark, with collision avoidance.
   - Use a linear or logarithmic scale deliberately and label it clearly. A logarithmic scale helps show small and large cases together, but map counts are easiest to understand on a linear scale. Do not mix a logarithmic axis with an interpretation that implies proportional vertical distance.

4. **Notes and methodology**
   - Explain the benchmark and formula.
   - State that headline amounts measure different things and are not directly additive.
   - Explain how missing or disputed values are handled.
   - Include sources and last-updated date.

5. **How to read the maps**
   - Show examples for `0.5×`, `1×`, `1.5×` and a value above `2×`.
   - Ensure partial fills are visually unambiguous.

### Recommended desktop proportions

- Header and benchmark: 15–20% of the initial view.
- Legend: 8–12%.
- Chart: 55–65%.
- Notes / reading key: 15–20%, below the chart if space is constrained.

These are starting proportions, not hard requirements. Content density should determine the final layout.

---

## 3. Colour system

Use a warm, paper-like background with charcoal text and a small set of muted category colours. Avoid neon colours, gradients, heavy shadows and bright multicolour palettes.

### Suggested palette

| Token | Hex | Intended use |
|---|---|---|
| `--color-paper` | `#F5F1E8` | Main page background |
| `--color-surface` | `#FFFCF6` | Cards, tooltip surfaces, benchmark panel |
| `--color-ink` | `#292D32` | Main text and headings |
| `--color-ink-muted` | `#666A6D` | Secondary labels and descriptions |
| `--color-grid` | `#D9D5CD` | Axis rules and gridlines |
| `--color-outline` | `#6F7478` | India silhouette outline |
| `--color-map-empty` | `#E5E2DC` | Unfilled part of the silhouette |
| `--color-ochre` | `#C58B2B` | Notional public loss / benchmark emphasis |
| `--color-blue` | `#41677D` | Alleged bank or financial fraud |
| `--color-red` | `#B94338` | Established fraud, only where the status is supported |
| `--color-green` | `#397A58` | Investor funds raised / refund liability |
| `--color-violet` | `#8060A0` | Debt default / financial crisis |
| `--color-focus` | `#155EEF` | Keyboard focus indicator |

These category colours are a starting system. Before publication, review every case’s classification and ensure that the colour reflects the actual `amount_type` and status. If the data model separates amount type from legal status, consider encoding amount type with colour and legal status with a small secondary badge or line style.

### Colour rules

- Use the same colour for the same semantic category everywhere.
- Use charcoal for ordinary text; do not set body copy in category colours.
- Keep gridlines low contrast but visible.
- The empty portion of every map should be neutral grey.
- Partial fills should start at the bottom and rise vertically.
- Never imply that red means “criminal” unless the case’s status supports that claim.
- Check text and interface contrast against WCAG AA where applicable.
- In grayscale, category labels and patterns must still distinguish the series.

---

## 4. Typography

Use a restrained editorial pairing: a serif display face for headlines and a highly legible sans serif for chart labels and interface text.

### Suggested font stack

```css
:root {
  --font-display: Georgia, "Times New Roman", serif;
  --font-ui: Inter, "Helvetica Neue", Arial, sans-serif;
}
```

If using web fonts, load them efficiently and define system fallbacks. Do not rely on a font that may not load for essential information.

### Type scale

| Role | Desktop starting size | Notes |
|---|---:|---|
| Main headline | 40–56 px | Serif, tight but readable line-height |
| Section heading | 24–30 px | Serif or sans serif; use sparingly |
| Case title | 14–18 px | Medium / semibold |
| Main chart labels | 12–14 px | Sans serif; do not go below 12 px on desktop |
| Axis labels | 12–14 px | Consistent weight and spacing |
| Body / methodology | 14–16 px | Comfortable line-height |
| Footnotes / source labels | 11–12 px | Use only for secondary material |

Use tabular numerals for monetary values, years, ratios and percentages where supported:

```css
font-variant-numeric: tabular-nums;
```

Avoid all-caps for long headings. Use all-caps only for small eyebrows or metadata.

---

## 5. Spacing, borders and surfaces

Use an 8 px spacing rhythm.

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;

  --border-thin: 1px solid var(--color-grid);
}
```

- Prefer open space and thin rules over boxed panels.
- Use rounded corners sparingly; avoid a generic “dashboard card” look.
- Keep the benchmark block visually distinct but quiet.
- Do not put every chart annotation in a card.
- Avoid strong drop shadows. If separation is needed, use a subtle border or slightly different surface colour.

---

## 6. Chart and timeline rules

### X-axis

- Default to **year exposed / year the case became public**, because it is usually the most intuitive event timeline.
- Store the period of underlying activity separately and show it in the case detail when relevant.
- Use evenly spaced years if the chart is a true timeline. Do not space dates according to the number of cases.
- Consider decade labels or subtle decade dividers to orient the reader.
- If multiple cases occur in the same year, offset the marks horizontally within that year while keeping the year relationship clear.

### Y-axis and benchmark

Define:

```text
multiple_of_budget = amount_original_in_INR_crore / health_budget_INR_crore
```

Use the exact official FY 2024–25 Union Health Budget figure selected for the project, in ₹ crore, and record the source URL in project metadata. Do not silently change the benchmark amount between versions.

**Scale choice:**

- **Linear scale:** best if the number of India silhouettes is the primary visual encoding and direct proportional comparison matters.
- **Logarithmic scale:** useful if values span orders of magnitude, but vertical position no longer corresponds linearly to the number of silhouettes. If using log scale, label it prominently and consider showing the ratio in a separate label.
- Do not claim that the y-position is a linear representation if a logarithmic scale is used.
- Do not truncate the axis without making the truncation unmistakable.

### India silhouette marks

- Use one accurate, consistent SVG outline for all data marks.
- Preserve the same aspect ratio and visual area for every silhouette.
- The filled part must be clipped to the map outline.
- Fill from the bottom upward, with the empty area in `--color-map-empty`.
- Each full silhouette equals `1×`.
- For a value `v`, render `floor(v)` fully filled silhouettes and one additional silhouette filled by `v - floor(v)` if the remainder is greater than zero.
- Avoid tiny fractional maps becoming illegible. For very small values, use a minimum visible mark only if the true numeric value remains explicit; never let a minimum-size mark imply a larger amount.
- Use a consistent gap between stacked silhouettes.
- Keep labels separate from the map silhouette where practical; avoid placing text inside the map.

### Labels and collisions

Each visible mark should ideally have:
- Case name
- Exposure year
- Amount in ₹ crore
- Multiple of the benchmark (for example `0.44×`)
- Amount-type label or compact category key

When labels collide:
1. Move labels above or beside the mark.
2. Use a short leader line.
3. Use an interactive tooltip or detail panel for secondary information.
4. On mobile, use a vertical list or scrollable case detail instead of shrinking labels to unreadable sizes.

Do not omit a case silently just because its label is difficult to place.

---

## 7. Data integrity and evidence rules

This is a financial and legal subject. The visual treatment must not imply that all reported amounts are proven theft.

### Keep amount types distinct

At minimum, preserve the dataset’s distinctions between:

- **Established / adjudicated fraud amount:** only where a reliable finding supports the label.
- **Alleged fraud amount:** amount alleged in an FIR, charge sheet or other proceeding; not a conviction.
- **Notional public loss:** an estimate of potential or foregone public value, not money necessarily stolen.
- **Investor funds raised / refund liability:** money collected or subject to refund proceedings; not automatically the net loss.
- **Debt default / bank exposure:** outstanding liabilities or alleged bank exposure; not automatically the fraud amount or unrecovered loss.
- **Financial crisis / accounting misstatement:** include only with a precise definition of the number being displayed.

Never add these amounts together to produce a single “total stolen” figure.

### Null, disputed and uncertain values

- If there is no defensible single amount, use `null` and show the case in a separate list, table or “amount not comparable” lane.
- Do not plot `null` as zero.
- If an amount is disputed, retain the reported value only with an explicit caveat and source.
- Do not invent precision. Use rounded figures when sources only support rounded estimates.
- If different sources give different figures, record the chosen source and the reason for using it.
- Keep source date, status date and last-updated date in the data model.
- Use cautious language such as “reported”, “alleged”, “CAG-estimated” and “subject to refund proceedings”.

### Source detail

A case detail should expose:
- Source name
- Direct URL to the relevant report, order, judgment or official release
- Publication / decision date, where available
- What the amount measures
- Caveat and legal status
- Date last verified

Prefer primary documents from CAG, SEBI, RBI, CBI, ED, courts, parliamentary reports and official ministries. Use reputable reporting as supplementary context when a primary source does not establish the commonly cited headline amount.

---

## 8. Interactions and motion

The visual should remain understandable without interaction. Interaction should add context, not hide essential meaning.

### Hover / click detail

On hover, focus or click, show a compact tooltip or side panel with:
- Case name and year
- Headline amount
- Benchmark multiple
- Amount type
- One-sentence explanation
- Status and caveat
- Source link

Support keyboard focus and click/tap. Hover must not be the only way to access information.

### Motion

- Keep transitions subtle and short (roughly 150–250 ms).
- Use motion only to explain a change, reveal a detail or connect the map to its value.
- Avoid animated map fills that delay access to the data.
- Respect `prefers-reduced-motion: reduce`.
- Do not make the entire timeline move or rearrange unexpectedly when a tooltip opens.

---

## 9. Responsive behaviour

### Large screens

- Use a wide timeline and preserve generous whitespace.
- Keep the benchmark and legend close to the chart.
- Use direct labels for the most important cases; put secondary details in tooltips.

### Tablet

- Reduce gaps, not type size first.
- Keep the main timeline readable.
- Allow labels to alternate above and below marks if needed.

### Mobile

Do not compress the full desktop chart into a narrow viewport.

Recommended mobile adaptation:
- Keep the headline and benchmark at the top.
- Present cases as a chronological vertical timeline or decade-by-decade panels.
- Retain the India-map unit for each case.
- Show the amount and multiple directly.
- Put longer caveats and sources in expandable details.
- Offer decade navigation or filters.
- Make controls comfortably tappable (around 44 × 44 px minimum target size).

---

## 10. Accessibility checklist

- [ ] Text contrast meets WCAG AA where applicable.
- [ ] Every category has a text label, not colour alone.
- [ ] All interactive marks can be reached and activated by keyboard.
- [ ] Focus indicators are visible.
- [ ] Tooltips work on click/tap and keyboard focus, not just hover.
- [ ] SVG marks have accessible labels or equivalent text.
- [ ] Partial map fills are described numerically in text.
- [ ] Screen-reader users can access a table or chronological list of the same data.
- [ ] The graphic remains understandable in grayscale and with common colour-vision deficiencies.
- [ ] Motion respects reduced-motion preferences.

---

## 11. CSS starter tokens

This is a starting token set, not a complete stylesheet.

```css
:root {
  /* Surfaces and text */
  --color-paper: #F5F1E8;
  --color-surface: #FFFCF6;
  --color-ink: #292D32;
  --color-ink-muted: #666A6D;
  --color-grid: #D9D5CD;
  --color-outline: #6F7478;
  --color-map-empty: #E5E2DC;

  /* Semantic categories — verify against the final dataset */
  --color-notional-loss: #C58B2B;
  --color-alleged-fraud: #41677D;
  --color-established-fraud: #B94338;
  --color-investor-funds: #397A58;
  --color-debt-crisis: #8060A0;

  /* Accessibility */
  --color-focus: #155EEF;

  /* Typography */
  --font-display: Georgia, "Times New Roman", serif;
  --font-ui: Inter, "Helvetica Neue", Arial, sans-serif;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  /* Shape */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;

  /* Layout */
  --content-max: 1440px;
  --page-gutter: clamp(16px, 3vw, 48px);
}

html {
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-ui);
}

body {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}

.page {
  width: min(calc(100% - 2 * var(--page-gutter)), var(--content-max));
  margin-inline: auto;
}

h1,
.display-heading {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.05;
}

.numeric,
.axis-label,
.amount-label {
  font-variant-numeric: tabular-nums;
}

.chart-gridline {
  stroke: var(--color-grid);
  stroke-width: 1;
}

:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 12. Suggested data contract for implementation

Keep the presentation layer separate from the underlying case data. Each record should retain the source fields and the original amount type. Add derived display values during data processing, not by manually editing the reported amount.

Example shape:

```json
{
  "id": "example-case",
  "name": "Example financial scandal",
  "year": 2001,
  "activity_period": "1998–2001",
  "amount_original": 10000,
  "currency": "INR",
  "amount_type": "alleged_bank_fraud",
  "amount_label": "Amount alleged in the case",
  "amount_caveat": "Allegation; not a final adjudicated loss.",
  "status": "alleged",
  "source_url": "https://example.org/source",
  "source_label": "Source title",
  "benchmark_amount_inr_crore": 90958,
  "benchmark_multiple": 0.11
}
```

The example values and URL above are placeholders only. Do not use them as factual case data. `benchmark_amount_inr_crore` must be set to the verified official FY 2024–25 benchmark used by the project. If the benchmark is stored once in global metadata, avoid duplicating it in every record.

### Rendering pseudocode

```js
const multiple = amountOriginal / healthBudgetAmount;
const fullMaps = Math.floor(multiple);
const partialFill = multiple - fullMaps;

// Render `fullMaps` fully filled silhouettes.
// If partialFill > 0, render one additional silhouette filled
// from the bottom up by `partialFill`.
// Keep the printed multiple visible even when the map is tiny.
```

If the chart uses a logarithmic y-axis, keep the silhouette stack as the **amount encoding** and explicitly explain that vertical position uses a log scale. Consider whether this double encoding is worth the added complexity; a linear timeline or a log-scaled position with direct numeric labels may be clearer.

---

## 13. Build acceptance criteria

The first release is ready for review when:

- [ ] The benchmark amount and official source are verified and fixed for the release.
- [ ] Every plotted amount has a clearly defined meaning and source.
- [ ] `null` values are not plotted as zero.
- [ ] Allegations, notional losses, investor liabilities and debt defaults remain distinguishable.
- [ ] The India silhouette is geographically accurate and uses one consistent SVG.
- [ ] Full and partial fills accurately represent the calculated multiple.
- [ ] The scale type is labelled and matches the intended interpretation.
- [ ] Labels do not overlap at the primary desktop size.
- [ ] Mobile has a deliberate layout rather than a shrunk desktop chart.
- [ ] Case detail exposes source, amount definition, caveat and status.
- [ ] Keyboard, screen-reader, contrast and reduced-motion checks are complete.
- [ ] The graphic includes a note that headline amounts are not all proven losses and are not directly additive.

---

## 14. Final art direction

**Aim for a serious, calm, editorial graphic with one memorable visual idea.** Warm ivory paper, charcoal type, restrained ochre and slate accents, precise labels, and consistent India silhouettes should do most of the work. The visual should feel confident because the information is clear—not because the design is loud.

The most important quality bar is data honesty: every map should communicate a defined financial measure, and every caveat should remain available to the reader.
