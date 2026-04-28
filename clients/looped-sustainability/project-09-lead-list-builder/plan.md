# Project 09 — Lead List Builder

**Last Updated**: 2026-04-28
**Status**: Active Planning
**Priority**: #10 — Natural extension of project-03 (Research Agent). Build after project-03 is live and the research tooling is established.

---

## Problem Statement

Finding the right buyer for a niche material load is relationship-dependent today. The Alabama bait-solution contact for 3 million lbs/year of dead trout was found through a personal connection — that approach doesn't scale. The sales team needs targeted, researched contact lists ("20 cattle farmers within 100 miles with their phone numbers") rather than mass-blast lists. Standard tools like LinkedIn and ZoomInfo are already in use but don't cover material-specific discovery.

---

## Background & Context

- Cort's exact framing: "finds our best options, gives us a pricing guide, and tees up exactly who we need to call."
- LinkedIn and ZoomInfo are already in active use for outbound — this project supplements, doesn't replace them.
- Output is a list for human callers — no automated outreach is in scope.
- This project is the direct complement to project-03 (Research Agent): the research agent finds buyers for a specific incoming load; the lead list builder builds ongoing targeted contact lists by material and geography for proactive sales outreach.
- They share web research tooling and may share underlying infrastructure. Build project-03 first and extract reusable components.
- This is a sales enablement tool — Cort is the primary stakeholder.

---

## Tech Stack

- Claude API — research reasoning, relevance scoring, contact enrichment (Confidence: confirmed)
- Web search and research tools — public databases, industry directories, business registries (Confidence: tool selection TBD — shared decision with project-03)
- LinkedIn / ZoomInfo — supplemental data sources already in use (Confidence: confirmed; API access TBD)
- Trello API or Google Sheets — output delivery (Confidence: Trello confirmed; format TBD)
- OpenClaw on Mac mini — orchestration (Confidence: assumed, consistent with stack)

---

## Scope

**In scope:**
- Accept a request with: material type, geography (radius in miles or state), and optional filters (size of operation, specific industry segment)
- Research and compile a list of targeted contacts who handle, buy, or process the specified material
- For each contact: company name, contact name, phone number, email if available, location, brief relevance note ("cattle operation, 200+ head, 50 miles from Yakima")
- Rank contacts by relevance and proximity
- Output as a downloadable list (Google Sheet or CSV) and/or as a Trello card comment
- Sources: public business databases, industry directories, web research, agriculture/food processing registries, recycling/processing facility databases
- Handle niche material types: dead livestock, exotic food waste, unusual plastics, industrial byproducts

**Out of scope:**
- Automated outreach or emailing — list only
- CRM integration beyond Trello/Sheets output
- Ongoing list monitoring or contact update tracking
- Buying contact data from paid databases (ZoomInfo API cost is separate from this build — confirm)
- International contacts unless Looped explicitly requests a non-US list

---

## Options

### Option A — On-Demand List Generation

Sales rep submits a request (material type + geography), agent generates the list, delivers it within 30–60 minutes. No scheduling or periodic refresh.

**Tradeoffs:**
- Simple to build; no scheduling complexity
- Rep waits 30–60 minutes for list delivery
- Each run is a fresh research pass — no deduplication against prior lists

**Rough Timeline:** 2–3 weeks (leveraging project-03 research tooling) | 12–18 human hours | 3–5 CC hours

---

### Option B — Standing List with Periodic Refresh

For high-priority material types (e.g., dead livestock, food waste), the agent maintains a standing list and refreshes it weekly. New contacts are added; stale contacts flagged.

**Tradeoffs:**
- More immediately useful for recurring material types
- More complex: requires deduplication, staleness tracking, and diff output
- Higher ongoing compute cost

**Rough Timeline:** 4–5 weeks | 20–30 human hours | 4–7 CC hours

---

### Option C — ZoomInfo / LinkedIn API Integration

Rather than pure web research, integrate directly with ZoomInfo or LinkedIn Sales Navigator API to pull structured contact records, then apply material-relevance filtering via Claude.

**Tradeoffs:**
- Faster and more reliable contact data than web research
- ZoomInfo API adds significant cost ($10K+/year typically)
- LinkedIn API for prospecting is severely limited (must go through Sales Navigator API partnership)
- Best used as a data enrichment layer on top of Option A web research, not as a replacement

**Rough Timeline:** Adds 1–2 weeks to Option A for API integration | 8–16 additional human hours

---

## Acceptance Criteria

1. A list request with material type + geography produces a ranked contact list within 60 minutes of submission.
2. Each contact includes at minimum: company name, contact name, phone number, location, and a 1-sentence relevance note.
3. Cort reviews 3 list outputs and rates at least 2/3 as "better cold call list than I could build manually in the same time."
4. The list does not include contacts that are obviously irrelevant (e.g., a pet food company on a list for industrial solvent recycling).
5. Niche material requests (dead trout, raw chicken, expired butter) produce at least 5 relevant contacts — the agent does not return an empty or near-empty list for unusual materials.
6. Output is formatted for direct use: the rep can open the list and start calling with no additional cleanup.

---

## Open Questions

1. **Request submission method**: How do sales reps submit a list request? Trello card? Slack message? Form? The UX for triggering the agent needs to match how reps actually work.
2. **ZoomInfo API access**: Looped already uses ZoomInfo for outbound. Do they have API access as part of their current subscription? If yes, this changes the data sourcing approach significantly.
3. **LinkedIn API access**: Does Looped have LinkedIn Sales Navigator? API access for programmatic contact lookup requires a partnership arrangement — this is likely not feasible unless they are already at that tier.
4. **Contact data privacy**: Are there any data handling requirements for the contact lists (GDPR, CCPA, CAN-SPAM compliance)? Since output is for human callers (no automated outreach), exposure is lower — but confirm.
5. **Overlap with project-03**: The research agent (project-03) already outputs a "who to call" list for specific incoming loads. How is the lead list builder differentiated? Is the lead list builder for proactive outbound (before a specific load exists), while the research agent is reactive (after a load comes in)? Confirm this distinction with Cort.
6. **Deduplication**: Should the agent avoid re-surfacing contacts that have already been called? If yes, a simple "contacted" tracking sheet is needed. If no, every list is a fresh pull.
7. **Web research tooling**: This is the same decision as project-03 (Brave Search, SerpAPI, Exa.ai, etc.). Make this decision once and share across both projects.

---

## Dependencies

**Upstream (this project needs):**
- Project 03 (Research Agent) — shares research tooling and contact discovery patterns; build project-03 first and extract the reusable layer
- Web research tool selection (shared decision with project-03)
- ZoomInfo API access confirmation
- Request submission UX decision

**Downstream (this project enables):**
- Nothing directly; this is a leaf-node project in the dependency graph

---

## Recommended Next Step

Confirm with Cort the distinction between project-03 (reactive research for incoming loads) and project-09 (proactive outbound list building). Confirm ZoomInfo API access status. Start project-09 build only after project-03 is live and the research tooling is proven.

---

## Conversation Source Log

- **2026-04-28** — Initial engagement context. Dead trout / Alabama bait-solution example confirmed. "Who to call" framing from Cort confirmed. LinkedIn and ZoomInfo current use confirmed. Overlap with project-03 noted. Output as human-caller list confirmed (no automated outreach).
