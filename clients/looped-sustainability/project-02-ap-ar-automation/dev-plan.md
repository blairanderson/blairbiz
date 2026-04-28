# AP/AR Invoice Automation — Development Plan

**Client:** Looped Sustainability
**Inputs:** Dedicated AP email inbox (Google Workspace / Gmail) + QuickBooks Online
**The gap:** C-Trade has no public API — load records can't be queried directly. Every option needs a workaround for the matching step.

## Confirmed Inputs

| Question | Answer |
|---|---|
| Email provider | Google Workspace (Gmail) |
| C-Trade exports | Manual — someone exports on demand |
| Invoice volume | 20–50/week (~30–40 typical) |
| Approval rules | Dynamic — multiple rules (threshold, match status, vendor) |
| GL coding | Mix — some vendors consistent, others vary by job/load |

---

## Integration Engine Options

The integration engine is the core middleware layer — it listens for new invoices, processes and routes them, applies rules, and posts to QBO. Three distinct architectures:

---

### Engine 1 — OpenClaw (AI Agent, Self-Hosted)

**What it is:** An open-source AI agent that runs on Blair's Mac mini. Monitors Gmail, reads attachments, calls an LLM for extraction, matches against C-Trade CSVs, and posts to QBO — all driven by agent task definitions and ClawHub plugins. Blair already runs OpenClaw personally.

**Architecture:**
```
Gmail Plugin (OpenClaw monitors AP inbox label)
    ↓
New email with attachment → OpenClaw task triggered
    ↓
File Tool (download PDF → temp dir, auto-purged)
    ↓
LLM Tool Call (Claude — extract_invoice_fields)
    → vendor, invoice_number, amount, line_items[], date, due_date
    ↓
File Tool (read latest C-Trade CSV from watched folder)
    → fuzzy match: vendor name + amount ± tolerance
    → status: matched / partial / unmatched
    ↓
Rule Evaluation (OpenClaw task logic)
    → consistent-GL vendor + matched → post to QBO
    → variable-GL vendor + matched → QBO draft + notify Andrew
    → unmatched / exception → QBO draft + message Andrew via Signal/Telegram
    ↓
QBO Plugin (create Bill — draft or posted)
    ↓
Google Sheets Plugin (append audit row)
```

**Hosting:** Blair's Mac mini — same machine OpenClaw already runs on. Runs as a background agent process. Not exposed to the internet; Gmail and QBO auth via local OAuth tokens.

> ⚠️ **Security posture:** OpenClaw has a significant CVE history (138 since launch, including ClawBleed — a critical RCE via auth token theft). Acceptable here because this instance stays on Blair's Mac mini, never internet-exposed, and is firewalled from inbound connections. Do not deploy on a public VPS without hardening. Credentials stay in local env vars, not in the OpenClaw config.

**Rule management:** Rules live in OpenClaw task definition files (YAML or JSON). Version-controlled in git. Blair edits them directly. Andrew can receive rule summaries via Signal/Telegram on request.

**Cost:** $0 hosting + ~$10–20/month Claude API at invoice volume.

**Pros:**
- Blair already knows the stack — no ramp-up time
- Agent-native: handles ambiguous cases better than rigid workflow branches (can reason about edge cases)
- ClawHub plugins cover Gmail, Google Drive, Google Sheets — less plumbing from scratch
- Notify Andrew via Signal or Telegram instead of email — faster, fits how they communicate
- Reuses the same OpenClaw instance Blair runs for other tasks; new plugins benefit future Looped projects
- Full ownership, no vendor dependency beyond the LLM API

**Cons:**
- CVE history requires discipline: keep off the internet, credentials in env vars, review OpenClaw updates before applying
- Blair is the only person who can maintain or debug it
- No UI for Andrew beyond notification messages
- ClawHub plugin quality varies — QBO plugin may need custom extension

---

### Engine 2 — Make (Cloud iPaaS)

**What it is:** Fully managed cloud integration platform. Zero infrastructure — Make runs, monitors, and restarts the pipeline. Good option if Blair wants nothing to operate.

**Architecture:**
```
Gmail Watch Emails (trigger — new attachment in AP label)
    → Download Attachment
    → HTTP Module (Claude API — invoice extraction)
    → Google Drive — Get File (latest C-Trade CSV)
    → Tools — Parse CSV
    → Router
        ├── matched + consistent GL → QBO Create Bill (post)
        ├── matched + variable GL  → QBO Create Bill (draft)
        └── unmatched / exception  → Gmail Send (Andrew)
    → Google Sheets — Append Row (audit log)
```

**Hosting:** Fully managed by Make. No servers, no cron jobs, OAuth tokens auto-refreshed.

**Cost:** ~$10–20/month at 20–50 invoices/week + ~$10–15/month Claude API.

**Pros:**
- Zero infrastructure to run or monitor
- Andrew can inspect the scenario visually in the Make dashboard
- OAuth token refresh is automatic — nothing expires silently
- Fastest to ship of the three options

**Cons:**
- Per-operation pricing grows with invoice volume
- Router branching is rigid — complex rule logic gets unwieldy
- Looped depends on Make's pricing and uptime
- No version control on workflow definitions

---

### Engine 3 — Custom Python Microservice

**What it is:** A Python service that owns the full pipeline end-to-end. Blair writes it, deploys it as a daemon on the Mac mini, and it runs on a cron schedule. No platform dependencies.

**Architecture:**
```python
# launchd daemon — runs every 15 min

for email in gmail.poll(label="AP"):
    fields  = claude.extract(email.attachment)     # structured tool call
    load    = ctrade.match(fields, latest_csv)     # fuzzy match
    rule    = RuleEngine.evaluate(fields, load)    # config-driven rules
    qbo.create_bill(fields, rule.gl_code, rule.status)
    sheet.append_row(fields, rule, load)
    if rule.requires_review:
        notify.email(andrew, fields, rule.reason)
```

**Hosting:** Blair's Mac mini (launchd) or $6/month VPS (systemd). Silent background process.

**Rule management:** `RuleEngine` class backed by a JSON config file — vendor GL mappings, tolerance bands, thresholds. Fully git-controlled. Blair edits config, not code, for most rule changes.

**Cost:** $0 hosting + ~$10–20/month Claude API. Cheapest long-term.

**Pros:**
- Complete ownership — no platform, no pricing risk, no CVE surface
- Every rule is testable code, fully auditable, version-controlled
- C-Trade matching logic can be as precise as needed
- Gmail + QBO OAuth layer becomes reusable across other Looped projects (BOL parsing, freight automation)

**Cons:**
- Most upfront build time (~3–4 weeks)
- Blair is the sole maintainer
- No UI — Andrew has no visibility beyond notification emails

---

## Engine Comparison

| | Engine 1 (OpenClaw) | Engine 2 (Make) | Engine 3 (Python) |
|---|---|---|---|
| **Build time** | 1–2 weeks | 1 week | 3–4 weeks |
| **Monthly cost** | $10–20 | $20–35 | $10–20 |
| **Hosting** | Mac mini (existing) | Fully managed | Mac mini / VPS |
| **Rule flexibility** | High (agent reasoning) | Medium (router branches) | Unlimited (code) |
| **Blair maintenance** | Low (familiar stack) | Minimal | Medium |
| **Andrew visibility** | Signal / Telegram | Make dashboard | Email only |
| **Vendor dependency** | None (self-hosted) | Make | None |
| **Version control** | Full (git) | None | Full (git) |
| **Security surface** | Mac mini only — acceptable | Make's cloud | Mac mini only — cleanest |

---

## Recommendation

**Engine 1 (OpenClaw) as the build target. Engine 2 (Make) as a fast fallback if OpenClaw's QBO plugin needs too much custom work.**

OpenClaw is the right call: Blair knows it, it's already running on the Mac mini, and the agent-reasoning approach handles edge cases (unusual vendor formats, partial matches) better than rigid workflow branches. The security risk is manageable because it stays local and offline.

The only real risk is the QBO ClawHub plugin — if it doesn't cover Bill creation well enough, that one piece may need a custom HTTP tool call wrapping the QBO API directly, which is a day of work.

**Sequence:**
1. **Week 1:** Get AP inbox read access → pull sample invoices → test Claude extraction against real PDFs
2. **Week 1:** Audit QBO ClawHub plugin — assess what Bill creation coverage exists
3. **Week 2:** Build OpenClaw task: Gmail → extract → C-Trade CSV match → QBO draft for everything → notify Andrew
4. **Week 3:** Layer in rule engine — auto-post consistent-GL matched invoices, draft + notify for everything else
5. **Month 2:** Tune matching rules against real exception patterns; tighten GL mappings from QBO vendor history
6. **Month 3+:** If Engine 1 is solid, extract the rule engine into a standalone Python module (Engine 3 foundation) for reuse across other projects
