# project-06-bol-document-parsing

## What
AI reads incoming PDFs (bills of lading, weight tickets, vendor docs), extracts key fields, and outputs structured data — to Excel, to C-Trade via manual import, or directly to QuickBooks.

## Why
Staff manually enter weights, costs, and job details from paper/PDF documents into C-Trade after the fact. This is confirmed-feasible from meeting 1. Reduces data entry errors and frees CS time.

## Scope
- Input: PDF or image (email attachment or manual upload)
- Extract: weights, material type, origin/destination, dates, carrier, cost, reference numbers
- Output: structured row(s) to Excel template, or formatted for C-Trade import
- Handle variation across vendor document formats

## Notes
- C-Trade has no public API — direct push is not possible without a custom integration or screen automation. Initial delivery is likely Excel export for manual import.
- This project overlaps with project-02 (AP/AR) for the financial side. BOL parsing is the ops side; AP parsing is the accounting side. May share underlying extraction tooling.

## Status
Not started
