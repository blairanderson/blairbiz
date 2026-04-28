# project-02-ap-ar-automation

## What
Automate the AP inbox pipeline: read incoming invoice emails, extract invoice data from attachments, validate against C-Trade records, flag mismatches, and prepare QuickBooks Online postings.

## Why
Andrew's #1 pain point. Invoices hit the shared AP inbox and stop — no extraction, no routing, no reconciliation. Andrew manually posts from C-Trade to QuickBooks on top of COO duties. "That's why Andrew doesn't sleep anymore." They are aware of the gap and embarrassed by it.

## Scope
- Monitor AP email inbox for new invoice attachments (PDF, image)
- Extract: vendor, invoice number, amount, line items, dates
- Match against open loads in C-Trade (manual lookup or screen-scrape bridge)
- Flag discrepancies for human review
- Prepare QuickBooks Online draft postings or push via QBO API
- Weekly exception report

## Out of Scope
- Replacing C-Trade as the system of record
- Full AP/AR workflow redesign
- Vendor onboarding or portal setup

## Key Contacts
- Andrew Januik (COO) — primary stakeholder and day-to-day owner

## Status
Not started
