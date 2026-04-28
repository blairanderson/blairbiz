# Project 06 — BOL Document Parsing

**Last Updated**: 2026-04-28
**Status**: Active Planning
**Priority**: #7 — Confirmed feasible in discovery. Shares extraction tooling with project-02 (AP/AR). Build after project-02 is stable to reuse the extraction layer.

---

## Problem Statement

Staff manually key weights, costs, material details, and reference numbers from paper and PDF documents (bills of lading, weight tickets, vendor docs) into CIETrade after the fact. This creates data entry errors, delays, and staff time spent on transcription rather than operations. The documents arrive in predictable formats that AI extraction handles well.

---

## Background & Context

- Confirmed feasible in the initial engagement meeting ("confirmed-feasible from meeting 1" per original plan).
- CIETrade has no public API — direct data push is not possible. Initial delivery targets Excel export for manual CIETrade import. This is acknowledged as a partial solution, not a full automation.
- This project overlaps with project-02 (AP/AR): both extract structured data from PDF attachments. The extraction tooling (Claude API + PDF handling) built for project-02 can be reused here. Build project-02 first.
- The ops side (BOL parsing) and the accounting side (AP/AR) are complementary — the same load generates both an invoice (project-02) and a BOL/weight ticket (this project).
- Once project-10 (CIETrade data bridge) exists, there is a possible path to auto-importing extracted BOL data into CIETrade via the bridge — but this is speculative and depends on what the bridge makes possible.

---

## Tech Stack

- Claude API — document field extraction (reused from project-02; Confidence: confirmed)
- Gmail / Google Drive — inbound document source (email attachments or shared drive uploads; Confidence: assumed — confirm with Andrew)
- Excel / Google Sheets — output format for CIETrade import (Confidence: confirmed)
- OpenClaw on Mac mini — orchestration (Confidence: assumed, consistent with stack)
- CIETrade data bridge (project-10) — optional future path for direct import (Confidence: speculative)

---

## Scope

**In scope:**
- Accept inbound PDFs or images via email attachment (designated inbox or label) or manual file drop to a watched folder
- Extract from bills of lading: load ID / reference number, origin facility, destination facility, material type, weight, carrier name, pickup date, delivery date, driver/carrier contact if present
- Extract from weight tickets: gross weight, tare weight, net weight, material type, facility name, scale ticket number, date
- Extract from vendor documents: as-needed field set (define after reviewing sample documents)
- Output: structured row(s) to an Excel template formatted for CIETrade import, OR to a Google Sheet reviewed by a CS rep before import
- Handle variation across vendor document formats — the extraction prompt must generalize, not hard-code vendor layouts
- Flag low-confidence extractions for human review rather than silently writing wrong data

**Out of scope:**
- Direct push to CIETrade (no API — CIETrade import is always a human-confirmed step)
- Generating BOLs or weight tickets — extraction only
- Payroll or driver-facing documents
- Real-time processing during active pickups — post-pickup batch is fine

---

## Options

### Option A — Email Attachment Trigger (Recommended)

Documents arrive as email attachments to a designated Gmail label or inbox. The agent monitors the inbox, downloads attachments, extracts fields, and appends to a Google Sheet for CS review and CIETrade import.

**Tradeoffs:**
- Consistent with the project-02 inbox monitoring pattern — reuses Gmail plugin and extraction tooling
- Requires documents to arrive via email (not all do — some are paper, faxed, or hand-delivered)
- CS rep still manually imports from the Google Sheet to CIETrade

**Rough Timeline:** 2–3 weeks (leveraging project-02 extraction base) | 12–20 human hours | 2–3 CC hours

---

### Option B — Shared Drive Drop Folder

Documents are manually uploaded to a designated Google Drive folder by CS reps or drivers. The agent watches the folder, processes new files, and outputs to the Google Sheet.

**Tradeoffs:**
- Handles documents that don't arrive via email (paper scans, camera photos)
- Requires CS reps to upload files consistently — behavioral change
- Drop folder can be mobile-accessible for field uploads

**Rough Timeline:** 2–3 weeks | 12–20 human hours | 2–3 CC hours (same effort as Option A; choose based on how docs arrive)

---

### Option C — Both Triggers

Monitor both email attachments and a drive folder. Route all documents through the same extraction pipeline.

**Tradeoffs:**
- Most coverage — catches documents regardless of how they arrive
- Slightly more build complexity (two input monitors instead of one)
- Recommended if documents currently arrive through multiple channels

**Rough Timeline:** 3–4 weeks | 16–24 human hours | 2–4 CC hours

---

## Acceptance Criteria

1. A PDF BOL or weight ticket submitted via the designated channel is processed within 15 minutes without human initiation.
2. For a standard BOL from a known carrier, all key fields (load ID, origin, destination, material, weight, carrier, date) are extracted with >90% accuracy — validated against 15+ real BOLs in UAT.
3. Weight ticket fields (gross, tare, net weight; material; facility; scale ticket number; date) are extracted correctly for the weight ticket formats in current use.
4. Low-confidence or ambiguous extractions are flagged in the output row (e.g., a "review needed" column) rather than silently written.
5. The Google Sheet output is formatted so a CS rep can import it to CIETrade in under 5 minutes per batch.
6. Documents in unrecognized formats post a notification to the CS rep rather than silently failing.
7. CS reps confirm after 2 weeks of use: "Manual data entry from BOLs has decreased noticeably."

---

## Open Questions

1. **How do BOLs currently arrive?** Email attachments, fax/scan, physical paper, driver photo? Understanding the primary channels determines whether Option A, B, or C is right.
2. **Document format variety**: How many distinct BOL and weight ticket formats are in current use? A sample of 15–20 real documents across carriers is needed before building the extraction prompt. Who can provide these?
3. **CIETrade import format**: What does a CIETrade-ready import CSV look like? Does CIETrade accept CSV import for BOL/job data, and if so, what are the required column headers? (Andrew or the CIETrade vendor to confirm.)
4. **Volume**: Approximately how many BOLs and weight tickets are processed per week? This determines whether same-day processing is needed or batch-daily is sufficient.
5. **Paper documents**: Are any BOLs still paper-only (faxed, hand-delivered)? If yes, is there a scan-to-email workflow in place, or would a mobile photo upload be needed?
6. **Project-02 timing**: This project shares the extraction layer with project-02. If project-02 is in build, should this project wait until that extraction module is extracted and reusable, or build independently and merge later?
7. **Output destination**: The plan assumes Google Sheet → manual CIETrade import. Is this acceptable to Andrew as a permanent workflow, or does he want a path to more direct CIETrade integration once the data bridge exists?

---

## Dependencies

**Upstream (this project needs):**
- Project 02 (AP/AR Automation) — shares extraction tooling; build project-02 first to avoid duplicating the PDF extraction layer
- Sample BOL and weight ticket documents (15–20 real documents from CS team)
- CIETrade import CSV format specification
- Gmail label or Google Drive folder designated for document intake

**Downstream (this project enables):**
- Project 05 (Ops Copilot) — once BOL data is structured, the ops copilot can reference it for load status and confirmation workflows
- Future: CIETrade direct import if project-10 bridge enables it

---

## Recommended Next Step

Andrew or a CS rep provides 15–20 sample BOL and weight ticket PDFs. Blair confirms the CIETrade import CSV format and whether it accepts structured CSV upload. Run extraction accuracy tests against the samples before committing to the full pipeline build.

---

## Conversation Source Log

- **2026-04-28** — Initial engagement context. Manual data entry from PDFs confirmed. CIETrade no-API constraint confirmed. Feasibility confirmed in meeting 1. Overlap with project-02 extraction tooling noted.
