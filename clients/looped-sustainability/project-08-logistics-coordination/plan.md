# Project 08 — Logistics Coordination

**Last Updated**: 2026-04-28
**Status**: Active Planning
**Priority**: #9 — Operational value is real but scope overlaps significantly with project-05 (Ops Copilot). Consolidation decision required before independent build begins.

---

## Problem Statement

Every scheduled pickup requires the CS team to manually confirm dock instructions, security codes, facility readiness, and carrier arrival windows with the facility. Unplanned shutdowns happen without warning. All of this runs through human phone calls and emails in real time. When a facility is unavailable and no one catches it, a truck is dispatched to a closed dock — wasted freight cost and a broken promise to the client.

---

## Background & Context

- This project is the outbound/inbound confirmation layer for pickups and deliveries.
- Blair's assessment from meeting 1: email and SMS automation for facility coordination is viable now. Phone call AI is 12+ months from being reliable enough. Phone calls are explicitly out of scope.
- The automation must look like it came from Looped directly — no automation artifacts, no third-party branded messages.
- CIETrade and Trello are the sources of pickup schedule data. The project-10 data bridge is needed to pull scheduled pickups from CIETrade automatically.
- **Scope overlap alert**: Project-05 (Ops Copilot) covers confirmation drafting and inbound response parsing. Project-08 covers outbound pre-pickup messages and inbound shutdown/issue detection. These are the same workflow viewed from slightly different angles. A consolidation decision is needed.

**Consolidation Options:**
- **Merge into Project-05**: Treat this project as Phase 2 of the Ops Copilot. Ops Copilot Phase 1 = intake + draft confirmations; Phase 2 = automated outbound pre-pickup messages + response parsing + escalation routing.
- **Keep Separate**: Build as an independent module that reads from the same load data source but runs on its own schedule and alert logic.

Recommendation: merge into project-05 as Phase 2 unless Andrew has a specific reason to build this independently. Avoids duplication of the confirmation email drafting and load data integration patterns.

---

## Tech Stack

- Gmail (Google Workspace) or Twilio SMS — outbound confirmation messages to facilities (Confidence: confirmed for email; SMS requires Twilio or equivalent — open question)
- CIETrade data bridge (project-10) — scheduled pickup data (Confidence: depends on project-10)
- Trello API — load card updates and CS rep alert routing (Confidence: confirmed)
- Claude API — inbound response parsing, shutdown/issue detection (Confidence: confirmed)
- OpenClaw on Mac mini — orchestration and scheduling (Confidence: assumed, consistent with stack)

---

## Scope

**In scope:**
- Read scheduled pickups from CIETrade data bridge (or Trello as fallback) on a daily or per-load basis
- Send outbound pre-pickup confirmation messages to facilities via email (and optionally SMS): "Confirming pickup at [time] — please reply to confirm or flag any issues"
- Parse inbound facility responses: extract confirmation, rescheduling request, or shutdown/closure notice
- Alert routing: if facility is unavailable, unresponsive, or flags an issue — immediately notify the relevant CS rep and carrier with the relevant load details
- Log all confirmation activity per load: message sent timestamp, response received, response content, action taken

**Out of scope:**
- Phone call coordination — email and SMS only
- Automated rebooking or rescheduling — alert the CS rep, who handles the rebooking
- Client-facing messages (to buyers/receivers) — this project covers the facility/supplier side only
- International facilities or multilingual message templates (unless flagged as needed)

---

## Acceptance Criteria

1. For every scheduled pickup in the system, an outbound confirmation message is sent to the facility at least 24 hours in advance (or per a configurable lead time).
2. A confirmed facility response is logged and the load Trello card is updated with confirmation status.
3. An unconfirmed, rescheduling, or shutdown response triggers a CS rep alert within 15 minutes of the response arriving, with load details and facility response included.
4. No truck is dispatched to a facility that has signaled a shutdown or issue through this channel without a CS rep having seen and acknowledged the alert.
5. If a facility does not respond within the confirmation window, the CS rep receives an "unresponded" alert flagging the load for manual follow-up.
6. All messages sent to facilities are indistinguishable in tone and format from manually written Looped communications.
7. CS rep confirms after 2 weeks: "I spend less time chasing facility confirmations by phone."

---

## Open Questions

1. **Consolidation decision**: Should this project be merged into project-05 as Phase 2, or built independently? Blair and Andrew to decide. This is the most important open question for this plan.
2. **Facility contact data**: Where are facility email addresses and (if SMS) phone numbers currently stored? CIETrade? Trello? A spreadsheet? This is the contact database for outbound messages.
3. **SMS requirement**: Do any facilities prefer or require SMS over email for confirmation messages? If yes, Twilio (or equivalent) integration is needed. If email-only is sufficient, skip SMS.
4. **Confirmation lead time**: How many hours in advance should the confirmation message be sent? 24 hours? 48 hours? Does this vary by facility type?
5. **Unresponsive facility threshold**: How long should the system wait for a facility response before flagging it as unresponsive? 4 hours? 8 hours? 24 hours?
6. **Message language**: Are any facilities non-English-speaking? If yes, does the message need to be localized?
7. **CIETrade bridge timing**: If project-10 is delayed, can this project pull pickup schedules from Trello cards instead? Confirm the fallback and whether Trello cards always have the facility contact and pickup time populated.

---

## Dependencies

**Upstream (this project needs):**
- Project 10 (CIETrade Data Bridge) — pickup schedule data; Trello as fallback
- Project 05 (Ops Copilot) — consolidation decision; if merged, this becomes Phase 2 of project-05
- Facility contact database (email addresses and optionally phone numbers)
- Consolidation decision before independent build begins

**Downstream (this project enables):**
- Nothing directly, but reduces manual coordination load for project-05 CS team workflows

---

## Recommended Next Step

Blair and Andrew make the consolidation decision (project-05 Phase 2 vs. standalone). Once decided, do not maintain two separate build tracks for the same confirmation workflow. If merging into project-05, close this plan and reference it from project-05's Phase 2 section.

---

## Conversation Source Log

- **2026-04-28** — Initial engagement context. Manual facility confirmation via phone confirmed. Shutdown risk identified. Email/SMS automation confirmed as viable; voice AI explicitly deferred. Overlap with project-05 noted and consolidation decision surfaced.
