# project-04-freight-rate-automation

## What
Always-on freight quoting system that pulls lane and material from Trello or C-Trade, hits broker portals and load boards, compares options, and returns the best carriers — with 24/7 coverage.

## Why
Currently handled by one independent broker, two larger portals, and a full-time researcher in Macedonia who works 8 hrs/day. "When it's midnight there, she's off the clock." Emergency jobs (sub-24hr, sub-6hr) need quotes at any hour. They also want to expand coverage beyond existing broker relationships to load boards.

## Scope
- Input: lane (origin/destination), material type, weight, time window
- Hit: existing broker portals (2 larger ones + independent), DAT/Truckstop load boards
- Compare: rate, carrier rating, availability
- Output: ranked options returned to Trello card or ops chat
- Coverage: 24/7

## Notes
- Macedonia researcher is a human asset — automation supplements, doesn't replace. She likely adds relationship and judgment value beyond raw rate lookups.
- Proximity is a margin variable — freight cost directly affects whether Looped makes or loses money on a job.

## Status
Not started
