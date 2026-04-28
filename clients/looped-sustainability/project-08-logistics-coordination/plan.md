# project-08-logistics-coordination

## What
Automated pre-pickup coordination: send confirmation messages to facilities before scheduled pickups, detect unplanned shutdowns, and alert the team immediately if anything changes.

## Why
Every pickup requires confirming dock instructions, security codes, facility readiness, and carrier availability. Unplanned shutdowns happen. All of it goes through humans in real time. Email/text workflows are viable now; phone call AI is 12+ months from being reliable (per Blair's assessment in meeting 1).

## Scope
- Scheduled outbound messages (email/SMS) to facilities: "Confirming pickup at [time] — please reply to confirm or flag any issues"
- Inbound response parsing: extract confirmation, rescheduling request, or shutdown notice
- Alert routing: if facility is unavailable, immediately notify the relevant CS rep and carrier
- Integration with existing load schedule (C-Trade export or Trello)

## Notes
- Must be invisible to clients and facilities — the message should look like it came from Looped, not from an automation.
- Phone call automation is out of scope for now. Voice AI reliability is not there yet for this use case.

## Status
Not started
