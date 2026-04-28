# Design System — BLAIR.BIZ

## Product Context
- **What this is:** Marketing and credibility site for Blair Anderson's custom software agency
- **Who it's for:** Decision-makers (CTOs, founders, ops leads) evaluating a $5K/week senior engineering engagement
- **Space/industry:** Software consulting, boutique/solo engineering agencies
- **Project type:** Marketing site with blog

## Aesthetic Direction
- **Direction:** Engineering Tool — the site feels like it was built by the same person who builds client infrastructure. Not a brochure about engineering. Engineering.
- **Decoration level:** Minimal
- **Mood:** Precise, technical, direct. Like reading a well-maintained README from someone who has strong opinions and no patience for decoration. The mono stats lead. The numbers are real. Nothing is there to impress — everything is there to inform.
- **Reference sites:** nousresearch.com (sparse, cool-blue, monospace metadata as primary design element), freightsimple.com (clean precision SaaS, metrics-forward)

## Typography
- **Display/Hero:** Geist — Vercel's geometric sans. Developers recognize it from Next.js docs, the Vercel dashboard, tools they trust. Engineered, confident, zero editorial softness. 700–900 weight for headings.
- **Body:** Instrument Sans — clean, modern, neutral. Pairs better with Geist than it ever did with Instrument Serif.
- **UI/Labels:** Instrument Sans (same as body, semibold weight)
- **Data/Tables:** JetBrains Mono — primary voice for stats, metrics, and pricing at hero scale. Not just accents. Numbers like `$5K`, `12+`, `100%` in the hero use mono. This is the deliberate design move.
- **Code:** JetBrains Mono
- **Loading:** Google Fonts CDN: `fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;900&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500`
- **Scale:**
  - Hero: clamp(2.5rem, 5vw, 4.5rem) / Geist 700, -0.04em tracking — homepage only
  - Page title: 2.5rem/40px (Geist 600, -0.03em tracking)
  - Section heading: 1.75rem/28px (Geist 600, -0.025em tracking)
  - Subsection: 1.125rem/18px (Instrument Sans, semibold)
  - Body: 1rem/16px
  - Small/metadata: 0.875rem/14px
  - Label/mono: 0.75rem/12px (JetBrains Mono, uppercase, 0.05em tracking)
  - Hero stat: 1.5rem/24px (JetBrains Mono 700, -0.03em tracking) — for $5K, 12+, etc.
  - Post titles: 1.125rem/18px (Geist 600, -0.02em tracking) — direct, not editorial

## Color
- **Approach:** Restrained — one accent + slate neutrals, color is rare and meaningful
- **Primary text:** #0F172A
- **Secondary text:** #334155
- **Muted text:** #64748B
- **Faint text:** #94A3B8
- **Background:** #FFFFFF
- **Surface:** #F8FAFC
- **Muted background:** #F1F5F9
- **Border:** #E2E8F0
- **Border strong:** #CBD5E1
- **Accent:** #D97706 (warm amber — unchanged. Against slate neutrals it reads as a circuit indicator, not agency warmth. Same hex, different context.)
- **Accent hover:** #B45309
- **Accent light:** #FEF3C7
- **Code block background:** #0F172A (slate-900)
- **Code block text:** #E2E8F0 (slate-200)
- **Semantic:** success #059669, warning #D97706, error #DC2626, info #2563EB
- **Dark mode:** Slate surfaces (#0F172A bg, #1E293B surface, #334155 muted). Lighten accent to #FBBF24. Reduce text contrast slightly (#F8FAFC primary, #CBD5E1 secondary).

## Spacing
- **Base unit:** 8px
- **Density:** Engineer's density — comfortable but tighter than a brochure. Decision-makers scan.
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
| `.heading-hero` | clamp(2.5rem, 5vw, 4.5rem) | Geist 700 | Homepage hero only |
| `.heading-display` | 2.5rem | Geist 600 | Page titles |
| `.heading-section` | 1.75rem | Geist 600 | Section headings |

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
| `.btn-primary` | Dark slate bg (#0F172A), white text | Amber bg | Primary CTA ("Let's Talk") |
| `.btn-secondary` | Transparent, border | Darker border | Secondary actions |
| `.btn-ghost` | Transparent, amber text | Amber-hover text | Tertiary ("See Our Work →") |

### Cards & Containers
- `.card` — surface bg, light border, 24px padding, 8px radius. Hover: stronger border + subtle shadow
- `.value-prop` — border-top separator + 1rem padding-top. Used for value proposition grids
- `.result-highlight` — 2px amber left-border + 1rem left-padding. Used for case study results

### Labels & Tags
- `.section-label` — JetBrains Mono, 0.75rem, amber, uppercase, 0.05em tracking. The mono metadata above headings. Functional, not decorative — it tells you where you are.
- `.tech-tag` — JetBrains Mono, 0.75rem, muted bg pill. For skill tags and technology mentions
- `.value-prop-number` — JetBrains Mono, 0.75rem, faint text. For numbered sequences ("01", "02", "03")
- `.form-label` — JetBrains Mono, 0.75rem, muted, uppercase. Elevates form labels to engineering style
- `.price-callout` — JetBrains Mono, amber-light bg, amber border. For pricing emphasis
- `.hero-stat` — JetBrains Mono 700, 1.5rem, -0.03em tracking. For hero-level metrics ($5K, 12+, 100%)

### Forms
- `.input` — full width, 10px/12px padding, border, 6px radius. Focus: amber border
- `.form-label` — see Labels above

### Content
- `.divider` — clean `<hr>`, 1px border-top, 3rem vertical margin
- `.post-title` — Geist 600, group-hover to amber. Direct and precise in the blog feed.

### Prose
Markdown content rendered inside `.prose` containers gets automatic styling:
- H2: Geist, 1.75rem, 600 weight, -0.025em tracking
- H3: Instrument Sans, 1.125rem, semibold
- Paragraphs: secondary text color, relaxed leading
- Links: amber with underline, hover to amber-hover
- Code blocks: slate-900 bg, slate-200 text, JetBrains Mono
- Tables: full width, bordered, left-aligned

## Design Principles
1. **The content is the design.** No decorative elements, illustrations, or stock photos. Typography and whitespace do the work.
2. **Mono stats as the hero voice.** The one deliberate design move: JetBrains Mono at hero scale for pricing, metrics, and key numbers. The first thing a visitor sees is the price in a monospace font. That says more about who you are than any tagline.
3. **Geist for headings, sans for body.** Geist is what senior developers see in the tools they trust. It signals engineering authority without trying. Instrument Sans keeps body copy clean and readable.
4. **Amber, not blue.** Every consultancy defaults to blue/teal. Amber is warm, confident, and rare in this space. Against slate neutrals it sharpens into a system indicator. Use it sparingly for CTAs and links only.
5. **No fake agency aesthetics.** No client logo bars, team grids, or stock photography. Solo operator authenticity beats corporate theater.
6. **Mono accents carry the engineering identity.** JetBrains Mono for code blocks, tech tags, section labels, hero stats, and data. The mono is the brand.
7. **Mono section labels create information hierarchy.** The `.section-label` pattern (amber mono text above a Geist heading) creates a two-level hierarchy that gives context before the reader reaches the main heading. Functional metadata, not decoration.
8. **Structured cards over flat markdown.** Service descriptions, case studies, and value propositions use `.card` containers with consistent internal hierarchy instead of plain markdown lists.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-29 | Initial design system created | Created by /design-consultation based on competitive research (thoughtbot, hashrocket, fly.io) and product positioning as solo senior engineering consultancy |
| 2026-03-29 | Instrument Serif for display | Deliberate departure from all-sans-serif category norm to signal taste and experience |
| 2026-03-29 | Amber #D97706 accent | Warm, confident alternative to ubiquitous blue/teal in tech consulting space |
| 2026-03-29 | No client logos or team photos | Authenticity for solo operator positioning, let case studies carry credibility |
| 2026-03-29 | Full site refresh + component library | 14 CSS component classes added, all inline styles and JS hover handlers eliminated, 33 legacy Beautiful Jekyll files removed |
| 2026-04-27 | Drop Instrument Serif, adopt Geist | Serif was reading as editorial/literary agency. Geist is Vercel's font — developers clock it from Next.js docs and the Vercel dashboard. It says "I build the same tools you use" without saying anything. Researched: nousresearch.com, freightsimple.com, aceworkflow.io, pythian.com. |
| 2026-04-27 | Cool palette from gray-* to slate-* | Warm grays (#111827 base) were compounding the "craft agency" signal. Slate-900 (#0F172A) base is cooler and more technical. Amber at #D97706 unchanged — same hex, sharper against the new context. |
| 2026-04-27 | JetBrains Mono promoted to hero stats | Mono was only in labels and code. Now hero-level metrics ($5K, 12+, years) use `.hero-stat` — JetBrains Mono 700 at 1.5rem. The price in monospace is the first technical signal a visitor receives. |
| 2026-04-27 | Post titles from Instrument Serif to Geist 600 | Consistency with heading system. No serif anywhere in the type hierarchy. |
