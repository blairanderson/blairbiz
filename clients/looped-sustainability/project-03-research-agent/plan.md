# Project 03 — Research Agent

**Last Updated**: 2026-04-28
**Status**: Ready for Engineering
**Priority**: #4 — High Cort priority. No hard infrastructure dependencies. Can start once Trello API access is confirmed.

---

## Problem Statement

Finding the right buyer for an unusual material load currently takes 20 hours of research per lead. Sales reps are better at calling than researching, so Cort, Andrew, and Tommy step in constantly to bridge the gap. The research effort is a bottleneck on sales throughput — more leads can't be worked because the research pipeline can't keep up.

---

## Background & Context

- Cort lit up on this project in the first meeting — it was his immediate favorite.
- The problem is particularly acute for niche or unusual loads: dead trout, raw chicken, expired butter, plastic liners. Standard databases don't cover these well.
- Cort originally suggested getVictor.com as a possible solution pre-engagement. Now that the engagement is active, the recommendation is to evaluate Victor vs. custom build. Custom gives Looped control over niche material handling and avoids per-seat SaaS pricing.
- The research output goes on a Trello card — this is entirely internal; no client or vendor ever sees the automation output directly.
- API exposure concern was raised by Cort (competitors could access Looped's research data). Addressed: data stays inside their private Trello boards.
- This project has natural overlap with project-09 (Lead List Builder) — the research agent finds who to call; the lead list builder builds the contact details. They share the same output intent and may share underlying tooling.

---

## Tech Stack

- Trello API — card watching, comment posting (full open API; Confidence: confirmed)
- Claude API — research reasoning, buyer identification, output structuring (Confidence: confirmed)
- Web search / research tools — public databases, industry directories, news sources (Confidence: needs tooling decision — see Open Questions)
- OpenClaw on Mac mini — agent orchestration (Confidence: assumed, consistent with stack; confirm)

---

## Scope

**In scope:**
- Watch a designated Trello board for new cards (webhook preferred over polling for responsiveness)
- Trigger on: new card added to a designated list, OR a specific label applied to an existing card
- Research task per trigger: given material type, volume, and location from the card title/description, identify:
  - Most viable end uses for this material
  - Buyers/processors/recyclers who handle this material type, within reasonable geography
  - Indicative pricing or value range (what the market typically pays or charges for this material)
  - Freight estimate to top buyer locations (rough, not quoted)
- Output: structured comment posted to the triggering Trello card, formatted as:
  - **Material summary**: what this material is and its disposal/value classification
  - **Top end uses**: ranked list with brief explanation
  - **Buyer options**: ranked list with company name, location, relevance note, and estimated contact approach
  - **Indicative pricing**: range with source/basis
  - **Who to call first**: top 2–3 picks with reasoning
- Handle both common materials (cardboard, food waste, cooking oil) and unusual loads (dead trout, expired dairy, plastic liners)

**Out of scope:**
- Automated outreach or emailing — output is a list for human callers
- Real-time freight quotes — project-04 handles live quoting; this project provides rough estimates only
- CRM integration beyond Trello (no Salesforce, no HubSpot)
- Replacing the Macedonia researcher's judgment on carrier selection
- getVictor.com integration unless evaluation determines it adds meaningful coverage that a custom build cannot match

---

## Acceptance Criteria

1. A new card added to the designated Trello list triggers a research run within 5 minutes.
2. The agent posts a structured comment to the card within 15 minutes of trigger (for most materials — see note on unusual loads).
3. The comment includes: material summary, at least 3 ranked buyer options with location and relevance note, indicative pricing with stated basis, and a "who to call first" recommendation.
4. For unusual/niche materials (dead trout, raw chicken, etc.), the agent either produces a useful result OR posts a comment flagging that this material requires human research — it never silently fails.
5. Cort and Andrew review 10 agent-generated research outputs against their own knowledge of the material/market and rate at least 8/10 as "useful starting point or better."
6. No research data leaves Looped's Trello — the agent does not post to external systems or share data with third parties.
7. The trigger label or list is configurable — Cort or Blair can change which board/list triggers research without code changes.
8. If the agent fails (API error, rate limit, etc.), it posts a comment to the card indicating failure so the rep knows to research manually.

---

## Victor vs. Custom Build Evaluation

Before building, spend 2–4 hours evaluating getVictor.com against the custom build:

| Criteria | Victor | Custom Build |
|---|---|---|
| Niche material coverage | Unknown — evaluate | High (LLM + web research) |
| Trello integration | Unknown — evaluate | Native (we build it) |
| Data privacy (stays in Trello) | Unknown — check terms | Confirmed |
| Monthly cost | Per-seat SaaS | ~$20–40/month Claude API |
| Build time | Near-zero if it works | 2–3 weeks |
| Customizability | Low | Full |

If Victor covers niche materials, integrates cleanly with Trello, and keeps data private — it may be worth the SaaS cost to save 2 weeks of build time. If any of those three fail, build custom.

---

## Open Questions

1. **Web research tooling**: What web search / scraping tool will the agent use to find buyers and pricing? Options: Brave Search API, SerpAPI, Exa.ai, or direct web scraping. Each has different cost, coverage, and rate limit characteristics. Decision needed before build starts.
2. **Victor evaluation**: Has anyone explored getVictor.com since the initial discovery call? Assign 2 hours to a proper evaluation before committing to the custom build path.
3. **Trigger mechanism**: Trello webhook vs. polling? Webhook is better (5-minute vs. polling interval latency) but requires a public endpoint. If Mac mini is not internet-exposed, polling is the default. Is there a lightweight reverse proxy or tunnel available (e.g., ngrok, Cloudflare Tunnel) to receive Trello webhooks?
4. **Target board and list**: Which specific Trello board and list should the agent watch? Cort or Andrew to provide board name and list name.
5. **Card data format**: What information is currently in a Trello card when a rep creates it? Is material type structured (a label, a custom field) or free text in the title? The extraction prompt depends on this.
6. **Output format approval**: The structured comment format above is proposed — has Cort seen and approved a mockup? The April 23 Granola summary demo was well-received; a similar review of the research comment format should happen before build.
7. **Volume**: How many new material cards are added per day or week on average? This drives agent compute cost estimates.
8. **OpenClaw for orchestration**: Confirm this agent runs on OpenClaw on the Mac mini, consistent with project-02 and the broader stack decision.

---

## Dependencies

**Upstream (this project needs):**
- Trello API access (board + write permissions for comment posting)
- Victor evaluation decision (2–4 hours)
- Web search tool selection and API key
- Trello card data format confirmed (what's in a card when reps create them)

**Downstream (this project enables):**
- Project 09 (Lead List Builder) — shares research approach and may share tooling; build project-03 first, then project-09 can extend it

---

## Recommended Next Step

Evaluate getVictor.com this week (2 hours max). Simultaneously, get Trello API access and pull 5–10 real material cards to understand the data format. If Victor is inadequate, kick off custom build with web search tool selection as the first decision.

---

## Conversation Source Log

- **2026-04-28** — Initial engagement context. Cort confirmed as primary stakeholder. 20-hour research time per lead confirmed. Victor.com pre-engagement suggestion noted. API exposure concern raised and addressed. Overlap with project-09 noted.
