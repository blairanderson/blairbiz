# Project 01 — Workflow Audit

**Last Updated**: 2026-04-28
**Status**: Ready for Engineering
**Priority**: #3 — Should happen early in the engagement, in parallel with projects 10 and 02. Produces the roadmap that refines all other projects.

---

## Problem Statement

Looped has multiple manual workflows across intake, research, freight, AP/AR, account management, and sales — but no complete documented picture of any of them. Pain points have been identified in discovery, but the actual step-by-step process, time-per-step, and handoff points are uncharted. Without this map, automation projects are scoped against assumptions rather than ground truth.

---

## Background & Context

- Cort (CEO) and Andrew (COO) surfaced multiple pain points in the initial discovery calls, but those were illustrative — not exhaustive.
- Two CS reps were recently hired, which means account management processes are being taught and learned right now — ideal timing to document them.
- CIETrade is the system of record. Trello is the sales pipeline. Gmail is the communication layer. QuickBooks is accounting. No single tool ties them together.
- The audit is internal — no client or vendor exposure, no risk of disrupting operations.
- This is the only project that directly produces scope refinements for all other projects. Its output is a prioritized automation roadmap, which may reorder the project sequence based on actual observed effort.

---

## Tech Stack

- No new tooling required for the audit itself.
- Deliverable is a written document (markdown or shared doc).
- Interviews and screen-shares via Microsoft Teams.

---

## Scope

**In scope:**
- Document each workflow below at the step level, with time-per-step estimate and who does it
- Intake: how a new job request arrives (email, phone call, Trello card) and what happens next
- Research flow: from "new material to place" to "qualified buyer with pricing"
- Freight quoting: from load specs to carrier selection and booking
- AP/AR: from invoice receipt to QuickBooks posting (feeds directly into project-02 scope validation)
- Account management: scheduling, confirmations, document generation, exception handling
- Sales: call → Trello card → follow-up → close

**Deliverable per workflow:**
- Step-by-step process diagram or numbered list
- Time estimate per step (ask the person doing it — don't guess)
- Who owns each step (role, not just name)
- Pain points and failure modes noted per step
- Tools touched at each step

**Final output:**
- Workflow documentation for all six areas above
- Prioritized automation opportunity list with rough effort/impact rating
- Any contradictions or gaps between what was described in discovery and what the audit reveals

**Out of scope:**
- Recommending specific tools or technical solutions (that's what the project plans are for)
- Auditing CIETrade's internal configuration or setup
- Documenting client-side or vendor-side processes

---

## Acceptance Criteria

1. All six workflow areas documented at step level with time estimates and role assignments.
2. At least one session recorded or note-taken with each of: Cort, Andrew, one CS rep, and the Macedonia researcher (freight).
3. Time estimates are sourced from the people doing the work — not estimates invented in the document.
4. Each workflow identifies: the most time-consuming step, the most error-prone step, and where work handoffs currently break down.
5. The automation opportunity list ranks opportunities by effort/impact and maps each to one of the 10 existing projects (or surfaces a new one).
6. The audit document is reviewed and acknowledged by Cort and Andrew before it is treated as final.
7. If the audit contradicts any current project scope, those contradictions are called out explicitly in the document.

---

## Open Questions

1. **Who to interview**: The Macedonia researcher does freight quoting for 8 hrs/day. Is she available for a remote interview? What language does she work in? Is there a language barrier that needs accommodation?
2. **CS rep availability**: The two new CS reps were recently hired — are they willing and able to walk through their workflows on camera? This is important for account management documentation.
3. **Recording consent**: All interviews should be recorded for accurate note-taking. Who needs to be notified and consent obtained from?
4. **Workflow documentation format**: Does Andrew or Cort have a preference for how this is presented — Notion, Google Doc, markdown in GitHub, Miro board?
5. **Time investment ask**: This audit requires 1–2 hours from Cort, 1–2 hours from Andrew, and 30–60 minutes each from CS reps. Has this been communicated and agreed to?

---

## Dependencies

**Upstream (this project needs):**
- Calendar access to schedule interviews with Cort, Andrew, CS reps, and Macedonia researcher
- Recording consent from participants

**Downstream (this project refines):**
- All other projects — the audit may reorder priorities, expand or contract scope, and surface new projects
- Most critical refinement targets: project-02 (AP/AR), project-04 (freight), project-05 (ops copilot), project-08 (logistics coordination)

---

## Recommended Next Step

Schedule 90-minute working sessions with Andrew (AP/AR + account mgmt + ops) and Cort (sales + research + strategy) in the first week of the engagement. Run the freight section with the Macedonia researcher async via screen-share recording if a live call is not viable.

---

## Conversation Source Log

- **2026-04-28** — Initial engagement context. Six workflow areas identified in discovery. Pain points surfaced but not mapped at step level. Audit scoped as engagement foundation.
