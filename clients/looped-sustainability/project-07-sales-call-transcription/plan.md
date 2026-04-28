# project-07-sales-call-transcription

## What
Granola-style background audio capture for sales calls — no bot joins the meeting. Generates a structured summary, extracts material specs and open questions, and updates the relevant Trello card. Optional: coaching prompts ("did you ask about cardboard volumes?").

## Why
Sales reps leave detail on the floor. Trello cards created by the sales team are less detailed than cards Cort creates himself. Cort and Andrew disliked the intrusive meeting-bot UX from a prior tool. Granola's approach (background capture, no bot, no notification to the other party) was the specific framing they liked.

## Scope
- Background audio capture during Microsoft Teams calls (no bot join)
- Transcription → structured summary
- Extract: material type, volume, location, pricing signals, open questions, next steps
- Push summary + extracted fields to matching Trello card
- Coaching prompt overlay: flag missed qualifying questions

## Notes
- Blair offered to send a Granola-generated summary of the April 23 call as a live demo. This was well-received. Use that as the reference for the output format.
- Check: Granola's Teams integration status. If it covers Teams natively, evaluate buy vs. build. Custom build only if Granola falls short.

## Status
Not started
