# Project 07 — Sales Call Transcription

**Last Updated**: 2026-04-28
**Status**: Ready for Engineering
**Priority**: #5 — High Cort priority, no infrastructure dependencies. Evaluate Granola buy-vs-build first (potentially zero build time).

---

## Problem Statement

Sales reps leave detail on the floor during calls. Trello cards created by reps are noticeably less detailed than cards Cort creates himself. Key material specs, open questions, and next steps aren't captured, which means follow-up falls on Cort and Andrew instead of being self-contained on the card. The team also actively dislikes meeting-bot UX (bot joins the call visibly, notifies all participants).

---

## Background & Context

- Blair offered to send a Granola-generated summary of the April 23 discovery call as a live demo. This was well-received by Cort and Andrew — it's the reference format for output quality.
- The preferred UX is Granola-style: background audio capture on the host machine, no bot joining the call, no notification to the other party. This is non-negotiable per client feedback.
- Calls happen on Microsoft Teams (not Zoom, not Meet).
- The output goes to Trello cards — the same integration surface as project-03 and project-09.
- Optional: coaching prompt overlay that flags missed qualifying questions during or after the call (e.g., "Did you ask about cardboard volumes?" "Did you confirm the pickup frequency?").
- This is entirely internal — the call counterparty is never aware of the capture or summary.

---

## Tech Stack

- Microsoft Teams — call platform (Confidence: confirmed)
- Granola — candidate buy option; macOS desktop app with background audio capture (Confidence: evaluate Teams support)
- Trello API — output destination for structured summary (Confidence: confirmed)
- Claude API — structured extraction and coaching prompts if building custom (Confidence: confirmed)
- OpenClaw on Mac mini — possible orchestration if building custom (Confidence: assess)
- Whisper or AssemblyAI — transcription layer if building custom (Confidence: contingent on build path)

---

## Scope

**In scope:**
- Background audio capture during Microsoft Teams calls (system audio, no bot join)
- Transcription of captured audio
- Structured summary generation covering:
  - Material type, volume, location, timing
  - Pricing signals or budget indicators mentioned
  - Open questions raised or implied
  - Agreed next steps
  - Stakeholder names and roles mentioned
- Posting the structured summary + key fields to the relevant Trello card (matched by company name or card in progress)
- Optional: coaching prompts — post-call flag of missed qualifying questions based on a configurable checklist

**Out of scope:**
- Recording the other party without their consent in any jurisdiction where this is illegal (one-party vs. two-party consent — see open questions)
- Real-time transcription during the call (post-call batch processing is sufficient)
- Video capture — audio only
- Call recording for legal or compliance purposes — this is a sales notes workflow
- Automated follow-up emails or outreach

---

## Buy vs. Build Evaluation

**Granola evaluation (do this first, 2 hours max):**

| Criteria | What to Check |
|---|---|
| Teams support | Does Granola capture audio from Microsoft Teams calls on macOS? |
| Background capture UX | Does it meet the "no bot, no notification" requirement? |
| Output quality | Is the structured summary comparable to the April 23 demo? |
| Trello integration | Does Granola post summaries to Trello, or does this require a custom integration layer? |
| Coaching prompts | Does Granola support custom qualifying question checklists? |
| Pricing | Per-seat or flat; current plans and pricing |
| Data privacy | Where is audio/transcript stored? Is EU/US data residency controllable? |

If Granola covers Teams, meets the background capture requirement, and produces output comparable to the demo — this is a buy decision. The only remaining work is a lightweight Trello integration layer if Granola doesn't post to Trello natively.

If Granola does not support Teams adequately, build custom:
- macOS background audio capture (system audio from Teams)
- Whisper (local) or AssemblyAI for transcription
- Claude API for structured extraction
- OpenClaw task to post to Trello

---

## Acceptance Criteria

1. A Teams call on a rep's machine is captured in background audio with no bot joining and no visible notification to the other party.
2. Within 10 minutes of call end, a structured summary is available containing: material type/volume/location, pricing signals, open questions, and next steps.
3. The summary is posted as a comment to the relevant Trello card, or queued for manual card association if the card cannot be auto-matched.
4. Cort reviews 5 summary outputs and rates at least 4/5 as "better detail than a rep-written card summary."
5. Coaching prompts (if implemented): after the call, the rep sees a checklist of qualifying questions with flags for any that were not covered in the transcript.
6. The capture and transcription is invisible to the call counterparty — no bots, no notifications, no watermarks in the call.
7. Legal compliance: one-party consent confirmed as sufficient for the jurisdictions Looped operates in, OR two-party consent procedure established if required.

---

## Open Questions

1. **Granola + Teams**: Does Granola currently support Microsoft Teams audio capture on macOS? This is the single most important answer before any build decision. Check Granola's current integration list and community discussions. (Blair to verify, 1 hour.)
2. **Legal — one-party vs. two-party consent**: Looped operates in multiple states. Recording a call requires one-party or two-party consent depending on jurisdiction. Which states are most of their calls in? Has Looped's attorney reviewed call recording practices? This needs a definitive answer before any recording tool is deployed.
3. **Which reps are in scope**: Are all sales reps using the same machine (Mac)? If some are on Windows, the capture approach changes. Which reps are the intended users?
4. **Trello card matching**: When a call happens, how does the system know which Trello card to attach the summary to? Is the rep expected to tag a card before the call? Is there a company name or deal ID that can be used for auto-matching?
5. **Coaching question checklist**: If coaching prompts are built, who defines the qualifying question checklist? Cort? This needs to be a documented, version-controlled list — not improvised.
6. **Output format approval**: Blair sent the April 23 Granola summary as a demo. Has that format been explicitly approved as the target, or was it just positively received? Get explicit sign-off before building to that spec.
7. **Teams account type**: Is Looped on Teams Free, Teams Essentials, or Teams via Microsoft 365? This affects what audio streams are accessible for capture.

---

## Dependencies

**Upstream (this project needs):**
- Granola evaluation decision (buy vs. build — 2 hours)
- Legal consent answer for call recording
- Trello API access (shared with project-03)
- Rep machine OS confirmation (Mac vs. Windows)

**Downstream (this project enables):**
- Nothing directly, but the Trello comment posting pattern is shared with project-03 and project-09

---

## Recommended Next Step

Blair spends 1 hour confirming Granola's Teams support status. Simultaneously, ask Cort which states the majority of their sales calls touch for the legal consent review. If Granola supports Teams, this is a same-week deploy decision.

---

## Conversation Source Log

- **2026-04-28** — Initial engagement context. Granola demo on April 23 call confirmed as well-received. No-bot requirement confirmed as non-negotiable. Teams confirmed as call platform. Coaching prompt option surfaced.
