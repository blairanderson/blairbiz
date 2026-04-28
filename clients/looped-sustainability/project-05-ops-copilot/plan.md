# Project 05 — Ops Copilot

**Last Updated**: 2026-04-28
**Status**: Active Planning
**Priority**: #8 — High operational value but depends on project-10 (CIETrade data bridge) and benefits from project-06 (BOL parsing) being live first. Scope is broad — needs narrowing before build.

---

## Problem Statement

The CS team manages account operations entirely through real-time phone calls and manual steps: scheduling trucks, confirming dock instructions, tracking weights, generating documents. Two new CS reps were recently hired and are learning these workflows from scratch. There is no structured intake, no templated confirmation flow, and no status tracking layer — everything exists in people's heads and phone conversations. This creates errors, delays, and excessive dependency on individual knowledge.

---

## Background & Context

- Two new CS reps just hired — they are learning the workflow now. This is the best moment to document and systematize it (also why project-01 workflow audit is a high-priority parallel track).
- The CS team is the internal user here. Client-facing behavior must not change — all automation is invisible to clients and facilities.
- The scope for this project is intentionally broad in the original plan. It needs to be narrowed to a specific MVP before build begins.
- Overlaps with project-08 (Logistics Coordination) for outbound confirmation and inbound response handling. Decision needed: does ops copilot absorb project-08, or do they stay separate?
- CIETrade is the system of record for load status. The ops copilot can only track status from CIETrade if the project-10 data bridge is live.
- BOL parsing (project-06) produces structured data that the ops copilot consumes. Sequencing matters.

---

## Tech Stack

- Gmail (Google Workspace) — inbound email parsing and draft generation (Confidence: confirmed)
- CIETrade data bridge (project-10) — load schedule and status data input (Confidence: depends on project-10)
- Trello API — load card status updates (Confidence: confirmed)
- Claude API — intake parsing, confirmation drafting, document generation (Confidence: confirmed)
- OpenClaw on Mac mini — orchestration (Confidence: assumed, consistent with stack)
- Google Sheets or Google Docs — document output (confirmations, summaries; Confidence: assumed)
- Twilio or similar — SMS for confirmation messages (Confidence: open question, needed for project-08 overlap)

---

## Scope (Proposed MVP — Needs Andrew Confirmation)

This project's scope is intentionally narrowed to a first-phase MVP. Later phases can expand.

**Phase 1 MVP — In scope:**
- Structured intake: parse inbound emails requesting a load pickup or delivery, extract fields (facility, material type, weight, requested date/time), and create or update the corresponding Trello card
- Confirmation drafting: for a scheduled load, auto-draft a confirmation email to the facility with: pickup date/time, driver/carrier name (if known), dock instructions to confirm, CS rep contact
- Draft is posted to Trello card for CS rep review and one-click send — reps do not write confirmations from scratch
- Load status tracking: maintain a simple status field (scheduled / confirmed / in transit / complete) per load in a Google Sheet or Trello card, updated based on email responses and BOL receipt

**Phase 1 MVP — Out of scope:**
- Full document generation (BOL drafts, weight tickets) — covered by project-06
- Automated sending without CS rep approval — drafts only in Phase 1
- Real-time load tracking via CIETrade — depends on project-10; deferred to Phase 2
- Phone call intake parsing — email and message-based only
- Escalation alert routing — covered by project-08

**Phase 2 (post-MVP, define after Phase 1 is live):**
- Pull load status directly from CIETrade bridge (project-10 dependency)
- Auto-escalate if confirmation not received within defined window
- Generate BOL draft if project-06 extraction confirms all fields are present

---

## Acceptance Criteria (Phase 1 MVP)

1. An inbound email requesting a pickup is parsed within 15 minutes, key fields extracted, and a Trello card created or updated without manual CS rep intervention.
2. A draft confirmation email is ready on the Trello card within 15 minutes of a load being scheduled — the CS rep reviews and sends with no additional writing.
3. CS reps confirm: "I spend less time writing the same confirmation messages over and over."
4. Load status (scheduled / confirmed / in transit / complete) is tracked in one place and visible to both CS reps without calling each other.
5. New CS reps can follow the intake-to-confirmation workflow without asking a senior rep for help — the structured intake form and draft confirmation serve as the workflow guide.
6. Client-facing emails (confirmations sent to facilities) are indistinguishable in tone and format from manually written ones — no automation artifacts visible.

---

## Open Questions

1. **Scope consolidation with project-08**: Project-08 (Logistics Coordination) covers outbound pre-pickup messages and inbound response parsing. This is the same surface area as the ops copilot confirmation drafting. Should project-08 be merged into project-05 as Phase 2, or kept separate? Decision needed from Blair before build starts.
2. **Confirmation email format**: What does a current confirmation email to a facility look like? Blair or Andrew to provide 3–5 examples. This is the template for the draft generation prompt.
3. **CIETrade bridge timing**: If project-10 is delayed, can the ops copilot use Trello cards as the source of truth for load schedule data in Phase 1? Confirm the fallback.
4. **Trello card structure**: Are load jobs always represented in Trello? Or only sales-originated jobs? How does an operational job (not from a sales call) get into the system?
5. **CS rep current tools**: What tools do the new CS reps currently use day-to-day? Email, Trello, CIETrade, phone, spreadsheets? Understanding their actual workflow before build is critical — this is also what project-01 audit should surface.
6. **Document generation priority**: The original plan included BOL draft generation in scope. This is now moved to project-06. Confirm Andrew agrees with this split.
7. **Approval workflow**: In Phase 1, CS reps review and approve drafts before sending. Is one-click approval (button in Trello or email) the right UX, or do they prefer to forward from their own email client?

---

## Dependencies

**Upstream (this project needs):**
- Project 10 (CIETrade Data Bridge) — for load status data in Phase 2; Phase 1 can use Trello as fallback
- Project 06 (BOL Document Parsing) — provides structured BOL data consumed by ops copilot
- Project 01 (Workflow Audit) — documents current CS rep workflow; critical input for ops copilot scope
- Sample confirmation emails (3–5 real examples from Andrew or CS team)
- Trello API access and board structure confirmation

**Downstream (this project enables):**
- Project 08 (Logistics Coordination) — may be merged into or sequenced after ops copilot Phase 2

---

## Recommended Next Step

Run project-01 workflow audit for the CS team first (or in parallel). Andrew provides 3–5 sample confirmation emails and confirms the Trello board structure used for operational loads. Resolve the project-08 consolidation question before starting build.

---

## Conversation Source Log

- **2026-04-28** — Initial engagement context. Two new CS reps confirmed as just hired. Client-invisible automation requirement confirmed. Overlap with project-08 noted. Scope narrowed to Phase 1 MVP for build readiness.
