# Project 04 — Freight Rate Automation

**Last Updated**: 2026-04-28
**Status**: Active Planning
**Priority**: #6 — High operational value. Partially depends on project-10 (CIETrade data bridge) for load data. Can start portal/load board integration design in parallel.

---

## Problem Statement

Freight quoting coverage has a hard ceiling: one independent broker, two larger portals, and a Macedonia-based researcher who works 8 hours per day. When it is midnight in Macedonia, emergency jobs (sub-24hr, sub-6hr) go unquoted. Freight cost directly affects whether Looped makes or loses money on a job — it is a margin variable, not a soft preference. The team also has no coverage on load boards (DAT, Truckstop) beyond what the researcher manually checks.

---

## Background & Context

- The Macedonia researcher is a human asset who contributes relationship value and judgment beyond raw rate lookups. This system supplements her, not replaces her.
- "When it's midnight there, she's off the clock" — the gap is explicit; emergency jobs at night and on weekends have no automated coverage.
- Load input currently comes from Trello cards (for sales-originated jobs) or CIETrade (for operational jobs). Both sources need to be supported.
- Two larger broker portals are in use plus one independent broker. The portals may have APIs or form-based submission that can be automated.
- DAT and Truckstop are the primary US load boards. Both have paid API access.
- Output goes back to wherever the request originated: Trello card comment, or a message to the ops team.
- Proximity/freight cost is a direct margin variable — the system must return rates accurate enough to make a real commit decision, not just illustrative estimates.

---

## Tech Stack

- Trello API — input trigger and output destination (Confidence: confirmed)
- CIETrade data bridge (project-10) — load and lane data input for operational jobs (Confidence: depends on project-10 delivery)
- DAT load board API — carrier rate lookup (Confidence: API exists and is paid; pricing and access TBD)
- Truckstop load board API — carrier rate lookup (Confidence: API exists; access TBD)
- Broker portal APIs or form automation — 2 larger portals + independent broker (Confidence: unknown — needs investigation per broker)
- Claude API — rate comparison, output structuring, edge case handling (Confidence: confirmed)
- OpenClaw on Mac mini — orchestration (Confidence: assumed, consistent with stack)

---

## Scope

**In scope:**
- Accept a freight quote request with: origin, destination, material type, weight, time window (pickup date/urgency)
- Hit at minimum: DAT load board, Truckstop load board
- Attempt to hit: the 2 larger broker portals (API or form-based submission, if technically feasible)
- Compare results: rate, carrier rating/reliability, availability, transit time
- Return ranked carrier options to: the originating Trello card as a comment, OR a designated ops chat message
- 24/7 availability — the agent runs continuously; requests at 2am get a response within 30 minutes
- Independent broker requests: evaluate whether the independent broker can be included (likely a phone/email relationship — may not be automatable)

**Out of scope:**
- Automated carrier booking — output is a ranked list for human review and manual booking
- Replacing the Macedonia researcher — she remains the primary relationship manager and handles judgment calls
- The independent broker relationship (likely human-only; flag if this assumption is wrong)
- International freight lanes
- Hazmat or regulated material freight routing

---

## Options

### Option A — Load Boards Only (DAT + Truckstop)

Build the 24/7 quoting layer using DAT and Truckstop APIs only. No broker portal integration. This covers the "midnight coverage gap" immediately with a 2–3 week build.

**Tradeoffs:**
- Fastest to ship, lowest integration risk
- Does not replicate the full rate comparison the researcher does (no broker portal rates)
- Adds load board coverage the team doesn't currently have at all
- Can be extended with broker portal integration as a Phase 2

**Rough Timeline:** 2–3 weeks build | 16–24 human hours | 3–5 CC hours

---

### Option B — Load Boards + Broker Portal Automation

Build Option A plus automated submission to the 2 larger broker portals. This requires investigating each portal's API or form-based submission capability before committing to build.

**Tradeoffs:**
- More complete rate comparison — closer to what the researcher does manually
- Portal integration complexity is unknown until investigated (each portal may have different API quality, auth, and rate structure)
- Timeline extends by 1–2 weeks per portal depending on integration path
- Higher maintenance surface — portal UI or API changes break the integration

**Rough Timeline:** 4–6 weeks total | 30–50 human hours | 5–8 CC hours

**Pre-build requirement:** 1-week investigation sprint to assess each broker portal's technical feasibility before committing to Option B.

---

### Option C — Hybrid (Load Boards + Human-in-the-Loop Broker Escalation)

Build Option A (load boards), and when load board rates are unavailable or unsatisfactory, automatically compose a quote request email to the broker portals and flag for human follow-up. Bridges the automation gap without requiring full portal API integration.

**Tradeoffs:**
- Covers 80% of cases automatically; 20% gets a drafted email to send
- No portal API integration risk
- Adds a human handoff for complex or edge-case quotes
- Lower build complexity than Option B, faster than full manual

**Rough Timeline:** 2–3 weeks build | 18–28 human hours | 3–5 CC hours

---

## Acceptance Criteria

1. A freight quote request submitted via Trello card (with origin, destination, material type, weight) triggers an automated rate lookup without human initiation.
2. DAT and Truckstop results are returned to the originating Trello card within 30 minutes of request, including: carrier name, rate, availability window, and carrier rating if available.
3. Requests submitted at any hour (including midnight) receive a response — 24/7 coverage confirmed by testing at off-hours.
4. The output is ranked by rate, with any rate significantly outside normal range flagged for human review rather than silently presented.
5. The Macedonia researcher can see the automated results on the Trello card before her shift begins — she adds judgment and relationship context on top of the automated baseline.
6. Requests that fail (API error, no results found) post a failure notice to the card so the rep knows to escalate manually.
7. Cort and Andrew confirm the rate output is accurate enough to make a commit decision (not just directional) — validated against 5–10 real lanes they know well.

---

## Open Questions

1. **Broker portal access**: What are the 2 larger broker portals currently in use? Do they have APIs? Do they have automated submission forms? This must be investigated before committing to Option B.
2. **Independent broker integration**: Is the independent broker relationship entirely phone/email? If so, they are out of scope for automation — confirm with Andrew.
3. **DAT API access**: DAT has a paid API. What tier is needed, and what is the cost? (Typically $500–2,000/year depending on tier.) Looped to approve the cost before build.
4. **Truckstop API access**: Same question as DAT — what tier and cost?
5. **Input standardization**: How are quote requests currently initiated? Via Trello card? Phone call? Does the request always have structured fields (origin, destination, weight) or is it free text? The agent needs structured input or a way to extract structure from free text.
6. **Material type for freight**: Does material type affect carrier selection or rate? (Hazmat, refrigerated, liquid, etc.) Is any of Looped's freight regulated? (Dead trout and raw chicken may require refrigerated carriers.)
7. **Urgency tiers**: The team mentions sub-24hr and sub-6hr as emergency tiers. Are there defined urgency levels the agent should treat differently (e.g., standard 5-day, next-day, same-day)?
8. **CIETrade data bridge timing**: If project-10 is delayed, should the agent accept manual input (form, message) instead of pulling from CIETrade? Define the fallback input method.

---

## Dependencies

**Upstream (this project needs):**
- Project 10 (CIETrade Data Bridge) — for operational load data. If delayed, define manual input fallback.
- DAT API access approval and credentials
- Truckstop API access approval and credentials
- Broker portal investigation (1 week sprint if building Option B)
- Trello API access (shared with project-03)

**Downstream (this project enables):**
- Project 05 (Ops Copilot) — may consume freight rate output for load confirmations
- Project 08 (Logistics Coordination) — may use carrier confirmation data

---

## Recommended Next Step

Andrew identifies the 2 larger broker portals by name (15 minutes). Blair investigates whether DAT and Truckstop API tiers are affordable and requests access. Simultaneously, assess broker portal API availability in a 1-week investigation sprint. Start with Option A (load boards only) — add broker portal integration as Phase 2 once feasibility is confirmed.

---

## Conversation Source Log

- **2026-04-28** — Initial engagement context. Macedonia researcher confirmed as current primary. Midnight coverage gap confirmed. Emergency job urgency tiers noted. Load board coverage gap identified. Freight as direct margin variable confirmed.
