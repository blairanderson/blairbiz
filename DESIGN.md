# Design System — BLAIR.BIZ

## Product Context
- **What this is:** Marketing and credibility site for Blair Anderson's custom software agency
- **Who it's for:** Decision-makers (CTOs, founders, ops leads) evaluating a $15K/week senior engineering engagement
- **Space/industry:** Software consulting, boutique/solo engineering agencies
- **Project type:** Marketing site with blog

## Aesthetic Direction
- **Direction:** Industrial/Utilitarian
- **Decoration level:** Minimal
- **Mood:** Function-first, confident, zero fluff. Like a well-organized workspace, not a brochure. Respects the visitor's time the way a $15K/week engineer respects deadlines.
- **Reference sites:** thoughtbot.com (dark, editorial), hashrocket.com (clean, white, teal accent), fly.io (illustrative, playful). We deliberately break from all three.

## Typography
- **Display/Hero:** Instrument Serif — refined serif for headings gives authority and distinction. Every consultancy uses sans-serif. A serif says "taste and experience."
- **Body:** Instrument Sans — clean, modern, pairs perfectly with Instrument Serif. Great readability at all sizes.
- **UI/Labels:** Instrument Sans (same as body, semibold weight)
- **Data/Tables:** JetBrains Mono — reinforces the engineering identity. Supports tabular-nums.
- **Code:** JetBrains Mono
- **Loading:** Google Fonts CDN: `fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500`
- **Scale:**
  - Hero: clamp(2.5rem, 5vw, 4rem) / Instrument Serif, -0.03em tracking — homepage only
  - Page title: 2.5rem/40px (Instrument Serif, -0.02em tracking)
  - Section heading: 1.75rem/28px (Instrument Serif, -0.01em tracking)
  - Subsection: 1.125rem/18px (Instrument Sans, semibold)
  - Body: 1rem/16px
  - Small/metadata: 0.875rem/14px
  - Label/mono: 0.75rem/12px (JetBrains Mono, uppercase, 0.05em tracking)
  - Post titles: 1.25rem/20px (Instrument Serif, normal weight) — editorial authority in blog feed

## Color
- **Approach:** Restrained — one accent + neutrals, color is rare and meaningful
- **Primary text:** #111827
- **Secondary text:** #4B5563
- **Muted text:** #6B7280
- **Faint text:** #9CA3AF
- **Background:** #FFFFFF
- **Surface:** #F9FAFB
- **Muted background:** #F3F4F6
- **Border:** #E5E7EB
- **Border strong:** #D1D5DB
- **Accent:** #D97706 (warm amber, CTAs and links)
- **Accent hover:** #B45309
- **Accent light:** #FEF3C7
- **Code block background:** #0F172A (slate-900)
- **Code block text:** #E2E8F0 (slate-200)
- **Semantic:** success #059669, warning #D97706, error #DC2626, info #2563EB
- **Dark mode:** Invert surfaces (#111827 bg, #1F2937 surface, #374151 muted). Lighten accent to #F59E0B. Reduce text contrast slightly (#F9FAFB primary, #D1D5DB secondary).

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable
- **Scale:** 2xs(2px) xs(4px) sm(8px) md(16px) lg(24px) xl(32px) 2xl(48px) 3xl(64px)

## Layout
- **Approach:** Grid-disciplined
- **Grid:** Single column, centered
- **Max content width:** 720px (prose), 960px (wide sections: nav, footer, homepage hero)
- **Border radius:** sm:4px, md:6px, lg:8px, full:9999px

## Motion
- **Approach:** Minimal-functional
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(50-100ms) short(150ms) medium(200ms). No long animations.
- **Rule:** Only hover state transitions on interactive elements. No entrance animations, no scroll effects, no loading spinners beyond browser default.
- **Hover patterns:**
  - Links: color transition (150ms ease-out)
  - Buttons: background or border-color transition (150ms ease-out)
  - Cards: border-color shifts to `--color-border-strong` + subtle shadow `0 1px 4px rgba(0,0,0,0.04)` (150ms ease-out)
  - Nav links: color + amber bottom-border appear together (150ms ease-out)
  - Post titles: group-hover color transition to accent (150ms ease-out)

## Components

CSS component classes in `assets/css/main.css`. Use these instead of inline styles.

### Headings
| Class | Size | Font | Use |
|-------|------|------|-----|
| `.heading-hero` | clamp(2.5rem, 5vw, 4rem) | Instrument Serif | Homepage hero only |
| `.heading-display` | 2.5rem | Instrument Serif | Page titles |
| `.heading-section` | 1.75rem | Instrument Serif | Section headings |

### Links
| Class | Color | Hover | Use |
|-------|-------|-------|-----|
| `.link-accent` | amber | amber-hover | CTAs, "Read more", pagination |
| `.link-muted` | faint | secondary | Footer icons, low-priority links |
| `.link-subtle` | secondary | primary text | Nav-adjacent, contextual links |

### Navigation
- `.nav-link` — secondary text, amber bottom-border on hover
- `.nav-link-active` — primary text, amber bottom-border always visible

### Buttons
| Class | Style | Hover | Use |
|-------|-------|-------|-----|
| `.btn-primary` | Dark bg, white text | Amber bg | Primary CTA ("Let's Talk") |
| `.btn-secondary` | Transparent, border | Darker border | Secondary actions |
| `.btn-ghost` | Transparent, amber text | Amber-hover text | Tertiary ("See Our Work →") |

### Cards & Containers
- `.card` — surface bg, light border, 24px padding, 8px radius. Hover: stronger border + subtle shadow
- `.value-prop` — border-top separator + 1rem padding-top. Used for value proposition grids
- `.result-highlight` — 2px amber left-border + 1rem left-padding. Used for case study results

### Labels & Tags
- `.section-label` — JetBrains Mono, 0.75rem, amber, uppercase, 0.05em tracking. The mono breadcrumb above headings
- `.tech-tag` — JetBrains Mono, 0.75rem, muted bg pill. For skill tags and technology mentions
- `.value-prop-number` — JetBrains Mono, 0.75rem, faint text. For numbered sequences ("01", "02", "03")
- `.form-label` — JetBrains Mono, 0.75rem, muted, uppercase. Elevates form labels to engineering style
- `.price-callout` — JetBrains Mono, amber-light bg, amber border. For pricing emphasis

### Forms
- `.input` — full width, 10px/12px padding, border, 6px radius. Focus: amber border
- `.form-label` — see Labels above

### Content
- `.divider` — clean `<hr>`, 1px border-top, 3rem vertical margin
- `.post-title` — Instrument Serif, group-hover to amber. Blog feed editorial treatment

### Prose
Markdown content rendered inside `.prose` containers gets automatic styling:
- H2: Instrument Serif, 1.75rem, normal weight
- H3: Instrument Sans, 1.125rem, semibold
- Paragraphs: secondary text color, relaxed leading
- Links: amber with underline, hover to amber-hover
- Code blocks: slate-900 bg, slate-200 text, JetBrains Mono
- Tables: full width, bordered, left-aligned

## Design Principles
1. **The content is the design.** No decorative elements, illustrations, or stock photos. Typography and whitespace do the work.
2. **Serif headings, sans body.** The one deliberate "design move." Instrument Serif for headings gives editorial authority. Instrument Sans for everything else stays clean.
3. **Amber, not blue.** Every consultancy defaults to blue/teal. Amber is warm, confident, and rare in this space. Use it sparingly for CTAs and links only.
4. **No fake agency aesthetics.** No client logo bars, team grids, or stock photography. Solo operator authenticity beats corporate theater.
5. **Mono accents for engineering cred.** JetBrains Mono for code blocks, tech tags, section labels, and data. Reinforces "this person ships code."
6. **Mono section labels create information hierarchy.** The `.section-label` pattern (amber mono text above a serif heading) creates a two-level hierarchy that gives context before the reader reaches the main heading. Used on homepage, services, case studies, page layouts, and blog posts.
7. **Structured cards over flat markdown.** Service descriptions, case studies, and value propositions use `.card` containers with consistent internal hierarchy instead of plain markdown lists. Cards create visual rhythm and scannable structure for decision-makers who won't read every word.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-29 | Initial design system created | Created by /design-consultation based on competitive research (thoughtbot, hashrocket, fly.io) and product positioning as solo senior engineering consultancy |
| 2026-03-29 | Instrument Serif for display | Deliberate departure from all-sans-serif category norm to signal taste and experience |
| 2026-03-29 | Amber #D97706 accent | Warm, confident alternative to ubiquitous blue/teal in tech consulting space |
| 2026-03-29 | No client logos or team photos | Authenticity for solo operator positioning, let case studies carry credibility |
| 2026-03-29 | Full site refresh + component library | 14 CSS component classes added, all inline styles and JS hover handlers eliminated, 33 legacy Beautiful Jekyll files removed |
| 2026-03-29 | Post titles in Instrument Serif | Blog feed gets editorial authority — serif titles create a different visual register than the sans body text |
| 2026-03-29 | Mono section labels pattern | `.section-label` above headings creates two-level hierarchy. Used consistently across homepage, services, case studies, and page layouts |
| 2026-03-29 | Hero typography at 4rem | Homepage headline scaled to clamp(2.5rem, 5vw, 4rem) with -0.03em tracking for more commanding presence |
