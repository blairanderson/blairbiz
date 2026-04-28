# Project 10 — CIETrade Data Bridge

**Last Updated**: 2026-04-28
**Status**: Ready for Engineering
**Priority**: #1 — High-value infrastructure. Enhances projects 02, 04, 05, 06, 08 — but none of those projects are hard-blocked waiting for it.

---

## Problem Statement

CIETrade is Looped's system of record for all load and job data, but it has no public API. Downstream automations that want to cross-reference load records, vendor history, or job status against CIETrade data need a workaround to get that data. This project creates a shared data access layer that other projects can optionally consume to add reconciliation and matching capabilities.

---

## Background & Context

- CIETrade runs at approximately $1,600/month. Replacing it is explicitly out of scope.
- The current workaround is entirely manual: staff export CSVs on demand or read screens.
- CIETrade does offer a client portal and has companion mobile apps (C Location, C Click, C Bail, C Dispatch, C Mobile) — none currently in use by Looped. These may expose undocumented data hooks.
- Multiple downstream projects (02, 04, 05, 06, 08) can use this data to add reconciliation and matching. Each of those projects can ship a useful MVP without it — the bridge unlocks Phase 2 capabilities.
- Blair runs OpenClaw on a Mac mini — the bridge output can live as watched flat files or a lightweight local SQLite DB accessible to other OpenClaw agents.

---

## Tech Stack

- CIETrade: no public API. Web UI + CSV export available. Mobile apps available but unused. (Confidence: confirmed)
- Blair's Mac mini: existing OpenClaw host. Available for scheduled tasks and file watchers. (Confidence: confirmed)
- Target consumers: OpenClaw agents (projects 02, 04, 05, 06, 08), Python scripts, Excel workflows.

---

## Scope

**In scope:**
- Research and select one access method (see options below)
- Deliver a scheduled, auto-refreshing extract of load/job records into a queryable flat file or local SQLite DB
- Schema covers: load ID, vendor/customer name, material type, origin, destination, status, amount, dates
- Output is readable by other OpenClaw agents and Python scripts without manual steps
- Basic staleness indicator: each record tagged with extraction timestamp; bridge logs last-successful-run

**Out of scope:**
- Writing data back to CIETrade
- Building a UI for this layer — it is purely infrastructure
- Real-time / sub-5-minute refresh (daily or hourly is sufficient for current use cases)
- Replacing CIETrade

---

## Options

### Option A — Scheduled CSV Export + File Watcher (Recommended starting point)

CIETrade supports manual CSV export. A human (or browser automation) exports a fresh CSV on a schedule; a file watcher detects the new file, parses it, and upserts into a local SQLite DB that other agents query.

**Tradeoffs:**
- Lowest build risk — no scraping brittleness, no undocumented APIs
- Requires a human trigger or browser automation to initiate the export (see Option B for full automation of this step)
- Export frequency limited to whatever schedule a human can maintain (initially daily is fine)
- If browser automation is added later, this option becomes fully hands-off

**Rough Timeline:**
- Phase 1 (file watcher + SQLite schema + consumer interface): 4–8 human hours, 1–2 CC hours
- Phase 2 (document export procedure for staff): 2–4 human hours

**Estimated Effort:** 6–12 human hours | 1–2 CC hours

---

### Option B — Browser Automation / Screen Scraping (Full automation)

Use a headless browser (Playwright) running on the Mac mini to log into CIETrade on a schedule, navigate to the export screen, trigger the CSV download, then hand off to the file watcher layer from Option A.

**Tradeoffs:**
- Fully hands-off once deployed — no human export step
- Fragile to CIETrade UI changes (a redesign breaks the scraper)
- CIETrade may detect and block automated logins depending on their security posture
- Higher build complexity; scraping logic needs maintenance when CIETrade updates

**Rough Timeline:**
- Build on top of Option A: adds 8–16 human hours for scraper construction and auth handling

**Estimated Effort:** 14–28 human hours total (Option A + scraper layer) | 2–4 CC hours

---

### Option C — CIETrade Vendor API Inquiry

Contact CIETrade directly to ask if a partner/vendor API exists, is on their roadmap, or can be unlocked for an additional fee.

**Tradeoffs:**
- If an API exists, this is by far the best long-term path — no scraping fragility, no CSV lag
- Zero build time if an API is available; 2–4 week delay if vendor sales cycle is required
- Outcome is uncertain and outside Blair's control
- Should be pursued in parallel with Option A, not instead of it

**Rough Timeline:** 1–2 hours to make inquiry; outcome unknown

**Estimated Effort:** 1–2 human hours to pursue | 0 CC hours

---

## Acceptance Criteria

1. A scheduled job runs at minimum once daily and produces a fresh extract of all open/recent load records from CIETrade.
2. The extract is stored in a queryable format (SQLite DB or normalized CSV) accessible at a known path on the Mac mini.
3. Each record includes: load ID, vendor name, material type, origin, destination, status, amount, date, extraction timestamp.
4. A staleness check is available: other agents can query "when was this last updated?" and act accordingly.
5. The file watcher or scheduler recovers automatically from missed runs without requiring manual intervention.
6. At least one downstream consumer (project-02 AP/AR matching) successfully reads and uses the extract in testing.
7. A brief runbook documents: how to trigger a manual refresh, how to check last-run status, and what to do if the extract is stale.

---

## Open Questions

1. **Export trigger**: Can CIETrade export be triggered by URL parameters or keyboard shortcuts that Playwright can reliably drive? Or does it require complex UI interaction? (Answer needed before committing to Option B.)
2. **CIETrade vendor API**: Has anyone contacted CIETrade to ask about API access? This should be a 15-minute email. If a vendor API exists at reasonable cost, it changes the entire approach. (Blair or Cort to pursue.)
3. **Export scope**: Which CIETrade record types need to be included in the initial extract? At minimum: open loads, vendor records, job status. Are there others (e.g., rate history, carrier assignments) that downstream projects will need?
4. **Refresh frequency**: Is daily refresh sufficient for all current downstream use cases? AP/AR matching likely fine. Freight quoting (project-04) may need closer to hourly if it needs current load status.
5. **Auth credentials**: Who holds the CIETrade login credentials? Browser automation will need a dedicated service account, not a shared staff login.
6. **Mobile apps**: CIETrade's companion apps (C Dispatch, C Mobile) — has anyone explored whether they communicate with a backend API that could be intercepted or documented? This is speculative but worth a 30-minute investigation.

---

## Dependencies

**Upstream (this project needs):**
- CIETrade login credentials for a service or dedicated account
- Sample CSV exports from CIETrade to define schema (needed before build starts)
- Answer to Open Question #3 (which record types to include)

**Downstream (these projects gain enhanced capabilities with this — none are blocked on it):**
- Project 02 (AP/AR Automation) — Phase 2: match invoices against CIETrade load records. Phase 1 ships without this.
- Project 04 (Freight Rate Automation) — Phase 2: pull lane/load data automatically. Phase 1 uses manual input or Trello card data.
- Project 05 (Ops Copilot) — Phase 2: load status lookups. Phase 1 parses incoming emails without CIETrade queries.
- Project 06 (BOL Document Parsing) — Phase 2: reconcile extracted BOL data against CIETrade records. Phase 1 outputs to Excel only.
- Project 08 (Logistics Coordination) — Phase 2: read scheduled pickups from CIETrade. Phase 1 works from a manually maintained schedule or Trello.

---

## Recommended Next Step

Blair emails CIETrade support to ask about API access (30 minutes, Option C inquiry). Simultaneously, Andrew or a staff member provides 3–5 sample CSV exports from CIETrade so Blair can define the schema before writing any code. Start building Option A (file watcher + SQLite) against the sample data — don't wait for the vendor API answer to block the build.

---

## Conversation Source Log

- **2026-04-28** — Initial engagement context and pain point mapping. CIETrade confirmed as system of record with no public API. Mac mini confirmed as OpenClaw host. Downstream dependency map established.
