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
  - Page title: 2.5rem/40px (Instrument Serif)
  - Section heading: 1.75rem/28px (Instrument Serif)
  - Subsection: 1.125rem/18px (Instrument Sans, semibold)
  - Body: 1rem/16px
  - Small/metadata: 0.875rem/14px
  - Label/mono: 0.75rem/12px (JetBrains Mono, uppercase, 0.05em tracking)

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
- **Semantic:** success #059669, warning #D97706, error #DC2626, info #2563EB
- **Dark mode:** Invert surfaces (#111827 bg, #1F2937 surface, #374151 muted). Lighten accent to #F59E0B. Reduce text contrast slightly (#F9FAFB primary, #D1D5DB secondary).

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable
- **Scale:** 2xs(2px) xs(4px) sm(8px) md(16px) lg(24px) xl(32px) 2xl(48px) 3xl(64px)

## Layout
- **Approach:** Grid-disciplined
- **Grid:** Single column, centered
- **Max content width:** 720px (prose), 960px (wide sections like nav/footer)
- **Border radius:** sm:4px, md:6px, lg:8px, full:9999px

## Motion
- **Approach:** Minimal-functional
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(50-100ms) short(150ms) medium(200ms). No long animations.
- **Rule:** Only hover state transitions on links and buttons. No entrance animations, no scroll effects, no loading spinners beyond browser default.

## Design Principles
1. **The content is the design.** No decorative elements, illustrations, or stock photos. Typography and whitespace do the work.
2. **Serif headings, sans body.** The one deliberate "design move." Instrument Serif for headings gives editorial authority. Instrument Sans for everything else stays clean.
3. **Amber, not blue.** Every consultancy defaults to blue/teal. Amber is warm, confident, and rare in this space. Use it sparingly for CTAs and links only.
4. **No fake agency aesthetics.** No client logo bars, team grids, or stock photography. Solo operator authenticity beats corporate theater.
5. **Mono accents for engineering cred.** JetBrains Mono for code blocks, tech tags, section labels, and data. Reinforces "this person ships code."

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-29 | Initial design system created | Created by /design-consultation based on competitive research (thoughtbot, hashrocket, fly.io) and product positioning as solo senior engineering consultancy |
| 2026-03-29 | Instrument Serif for display | Deliberate departure from all-sans-serif category norm to signal taste and experience |
| 2026-03-29 | Amber #D97706 accent | Warm, confident alternative to ubiquitous blue/teal in tech consulting space |
| 2026-03-29 | No client logos or team photos | Authenticity for solo operator positioning, let case studies carry credibility |
