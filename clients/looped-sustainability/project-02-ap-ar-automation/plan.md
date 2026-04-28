# Project 02 — AP/AR Invoice Automation

**Last Updated**: 2026-04-28
**Status**: Ready for Engineering
**Priority**: #2 — Andrew's #1 pain point. Phase 1 ships independently — no dependency on project-10.

---

## Problem Statement

Invoices arrive in a shared Gmail AP inbox and stop. No extraction, no routing, no reconciliation — they pile up until Andrew manually processes them from CIETrade into QuickBooks, on top of his full COO responsibilities. This is the highest-urgency pain point in the engagement. Automating this pipeline frees Andrew's time and reduces posting errors.

---

## Background & Context

- Invoice volume: 20–50/week (approximately 30–40 typical)
- Email provider: Google Workspace / Gmail, shared AP inbox with a label
- CIETrade: system of record for load/job data — no public API. Phase 1 does not require CIETrade access. Phase 2 adds optional load matching via the project-10 data bridge.
- QuickBooks Online: target posting destination; has a full REST API
- GL coding is mixed: some vendors have consistent GL codes, others vary by job/load — this is the key branching condition for the rule engine
- Andrew is the current human in the loop; he approves exceptions and edge cases
- Full engine evaluation already completed in `dev-plan.md`. Engine 1 (OpenClaw) is the recommended build target.
- Engine 2 (Make) is the fallback if the QBO ClawHub plugin is insufficient for Bill creation.

---

## Tech Stack

- Gmail API (Google Workspace) — inbox monitoring and attachment download (Confidence: confirmed)
- Claude API — invoice field extraction from PDF/image attachments (Confidence: confirmed)
- CIETrade CSV extract — load matching via project-10 data bridge (Phase 2 only; not required for Phase 1)
- QuickBooks Online API — Bill creation, draft and posted (Confidence: confirmed; plugin assessment needed)
- OpenClaw on Mac mini — orchestration engine (Confidence: confirmed)
- Google Sheets — audit log (Confidence: confirmed)
- Signal or Telegram — Andrew exception notifications (Confidence: confirmed per dev-plan)

---

## Scope

### Phase 1 — Ships independently, no CIETrade required

- Monitor the AP inbox Gmail label for new emails with attachments
- Download and process PDF and image attachments (multi-page PDFs included)
- Extract: vendor name, invoice number, total amount, line items, invoice date, due date
- Create a QBO draft Bill for every successfully extracted invoice
- Notify Andrew via Signal/Telegram for every invoice, with extracted fields — he reviews and posts from QBO
- Append every processed invoice to a Google Sheets audit log (vendor, amount, action taken, timestamp)
- Notify Andrew if extraction fails (bad PDF, corrupted file) with original attachment forwarded
- Weekly summary: total processed, draft count, failed count

**Open question — confirm with Andrew before build:** Is direct-to-QBO-draft sufficient for Phase 1, or does Andrew want to keep invoices in a holding state (e.g., Google Sheet) before they appear in QBO at all? Either is buildable; this affects the QBO integration step.

### Phase 2 — Adds CIETrade matching (requires project-10)

- Match extracted invoice against CIETrade load records: fuzzy vendor name + amount within tolerance band
- Apply rule engine: auto-post consistent-GL matched invoices; draft + notify for everything else
- Routing rules (see Rule Engine Logic below)
- Weekly exception summary expands to include: auto-posted count, match rate, recurring mismatch patterns

**Out of scope (both phases):**
- AR (accounts receivable) — this project is AP only
- Outbound invoice generation
- Handling non-invoice email in the AP inbox
- Real-time web UI — notifications via Signal/Telegram only
- Automated approval for invoices above threshold — human approval always required

---

## Rule Engine Logic

*Phase 1 rule engine is simple — all roads lead to QBO draft + Andrew notification. The table below applies to Phase 2 once CIETrade matching is live.*

Phase 2 routing rules (must be confirmed with Andrew before Phase 2 build):

| Condition | Action |
|---|---|
| Matched load + consistent GL vendor | Post Bill to QBO automatically |
| Matched load + variable GL vendor | Create QBO draft Bill + notify Andrew |
| Partial match (vendor matched, amount outside tolerance) | Create QBO draft Bill + notify Andrew with discrepancy detail |
| No match found in CIETrade data | Create QBO draft Bill + notify Andrew with "no load found" |
| Extraction failed (bad PDF, corrupted file) | Notify Andrew with original attachment forwarded |
| Amount above approval threshold | Create QBO draft Bill + notify Andrew regardless of match status |

**Open question**: What is the approval threshold dollar amount? (Needs Andrew's answer before Phase 2 rule engine is finalized.)

---

## Acceptance Criteria

1. New emails arriving in the AP inbox label are picked up within 15 minutes of receipt.
2. For a clean PDF invoice from a known vendor, fields are extracted with >95% accuracy on vendor name, invoice number, and total amount (validated against 20+ real invoices in UAT).
3. **(Phase 1)** Every extracted invoice results in a QBO draft Bill within 15 minutes of email arrival, and Andrew receives a notification with enough context to review and post from QBO without opening the inbox.
   **(Phase 2)** A matched + consistent-GL invoice results in a correctly posted QBO Bill within 15 minutes of email arrival, with no human intervention required.
4. Andrew receives a Signal/Telegram notification for every invoice requiring human review, with enough context (vendor, amount, match status, reason flagged) to take action without opening QBO.
5. The Google Sheets audit log contains a row for every processed invoice with: timestamp, vendor, invoice number, amount, action taken, QBO Bill ID if created. (Phase 2 adds: match status, CIETrade load ID.)
6. The system processes at least 30 invoices in a single day without errors or manual restarts.
7. A weekly exception summary is delivered to Andrew covering: total processed, auto-posted count, draft count, flagged count, any recurring mismatches.
8. If the agent crashes or the Mac mini restarts, it recovers automatically on next boot with no duplicate processing of already-handled invoices.
9. Andrew can confirm: "I haven't manually touched the AP inbox in a week and nothing fell through."

---

## Open Questions

1. **Approval threshold**: What dollar amount triggers mandatory Andrew review regardless of match status? (Andrew to answer before build.)
2. **Consistent GL vendor list**: Who has the current vendor-to-GL-code mapping? Can Andrew or the bookkeeper provide a CSV of known vendors and their typical GL codes? This seeds the rule engine.
3. **AP inbox label**: What is the exact Gmail label name for the AP inbox? Are there sub-labels or filters currently applied?
4. **QBO ClawHub plugin assessment**: Blair needs to audit the QBO ClawHub plugin to determine if Bill creation (draft and post) is supported, or if a custom HTTP wrapper around the QBO API is required. This is week-1 task 0 — it determines whether Engine 1 (OpenClaw) proceeds or Engine 2 (Make) is needed.
5. **Signal vs. Telegram**: Andrew's preferred notification channel for AP exceptions. Both are mentioned in the dev-plan — confirm which one Andrew actually uses.
6. **Multi-page and multi-invoice PDFs**: Are there invoices where a single PDF contains multiple invoice pages or multiple distinct invoices? If yes, the extraction logic must handle splitting.
7. **Invoice formats**: How many distinct vendor invoice PDF formats are in the AP inbox? A sample of 10–20 real invoices is needed before building the extraction prompt.
8. **Direct QBO import path**: Confirm with Andrew whether invoices can go directly to QBO as drafts without any CIETrade reconciliation — i.e., Phase 1 delivers full value on its own. Is there any reason QBO draft Bills would need CIETrade context before Andrew can review them?

---

## Dependencies

**Upstream (Phase 1 needs):**
- QBO ClawHub plugin assessment (Blair, week 1)
- Gmail AP inbox read access (Google Workspace admin)
- 20+ real sample invoices for extraction UAT

**Upstream (Phase 2 needs, not required for Phase 1):**
- Project 10 (CIETrade Data Bridge) — enables load matching step
- Andrew's vendor-to-GL mapping
- Andrew's approval threshold dollar amount

**Downstream (this project unlocks):**
- Nothing directly, but establishes the QBO API integration and Gmail plugin pattern reused by other projects.

---

## Build Sequence

Per `dev-plan.md`:

1. **Week 1, task 0**: Audit QBO ClawHub plugin — determine if Bill creation is covered. If yes, proceed with Engine 1. If not, assess Engine 2 (Make) vs. custom QBO HTTP wrapper.
2. **Week 1**: Get AP inbox read access. Pull 20+ real invoices. Test Claude extraction against real PDFs — measure accuracy on vendor, amount, invoice number before writing any workflow code.
3. **Week 2**: Build OpenClaw task: Gmail → extract → QBO draft Bill for all invoices → notify Andrew with extracted fields. No CIETrade lookup, no auto-posting. This is Phase 1 complete.
4. **Phase 2 (after project-10 is live)**: Layer in CIETrade matching + rule engine. Auto-post consistent-GL matched invoices. Everything else stays on draft + notify path.
5. **Month 2**: Tune matching rules against real exception patterns. Tighten GL mappings from QBO vendor history.
6. **Month 3+**: If Engine 1 is solid, extract rule engine into standalone Python module (Engine 3 foundation) for reuse across other projects.

---

## Recommended Next Step

Blair audits the QBO ClawHub plugin this week (1–2 hours). Andrew provides the AP inbox Gmail label name and a sample of 10–20 real invoices. That's all that's needed to start the week-1 build. Vendor-to-GL mapping and approval threshold are Phase 2 inputs — don't let them slow down Phase 1.

---

## Conversation Source Log

- **2026-04-28** — Engagement context. Andrew confirmed as primary stakeholder. "That's why Andrew doesn't sleep anymore." Invoice volume, Gmail provider, QBO target confirmed. CIETrade no-API constraint confirmed.
- **2026-04-28** — `dev-plan.md` processed. Engine comparison reviewed. OpenClaw (Engine 1) confirmed as build target. Engine 2 (Make) confirmed as fallback. Build sequence incorporated.
