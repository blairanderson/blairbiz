# project-10-cietrade-data-bridge

## What
A data extraction workaround for C-Trade's lack of public API — enabling other automations to read load records, costs, and job details without manual entry.

## Why
C-Trade is the system of record for all operational data but has no API. Every other automation project (AP/AR matching, freight quoting, ops copilot, BOL parsing) is blocked or degraded without reliable access to C-Trade data. Staff currently enter everything manually after the fact.

## Scope
- Evaluate options: scheduled CSV export + watcher, browser automation/screen scraping, C-Trade vendor API inquiry
- Build lowest-friction bridge that gets load data into a queryable form (structured DB or flat file)
- Feed that data into other automation projects as a shared layer

## Notes
- This is infrastructure, not a user-facing feature. The ROI comes from what it unlocks in other projects.
- C-Trade does have mobile apps (C Location, C Click, C Bail, C Dispatch, C Mobile) they're not using — worth investigating whether any expose data hooks.
- Replacing C-Trade is explicitly out of scope for this engagement. This project works around it.

## Status
Not started
