# Workshop Manager and Scheduler

An internal web app for employees of a company that leads in-person educational workshops at schools. Employees need to log upcoming workshops, view them on a calendar, and record results once a workshop is done.

## Current status: mockup phase

No real app exists yet. What's built so far is **3 static, no-backend visual mockups** with mock data, so the internal team can pick a visual direction before real functionality gets built.

- Requirements: [`prompts/initial-prompt.md`](prompts/initial-prompt.md) — the original brief plus a finalized clarifying-questions Q&A. Read this first; it's the source of truth for scope.
- Mockups: [`mockups/`](mockups/) — open `mockups/index.html` directly in a browser (no server needed). See [`mockups/README.md`](mockups/README.md) for how they're built.

## What the app needs to do

1. Let employees enter data about upcoming workshops they'll lead
2. Let employees view upcoming workshops (calendar-like)
3. Let employees enter data about workshops once complete
4. Let employees view data about workshops they've led

## Key decisions already made (see the Q&A in `prompts/initial-prompt.md` for full context)

- Multiple employees can be assigned to one workshop (many-to-many)
- Statuses are exactly: **Scheduled, In Progress, Awaiting Feedback, Terminated**
- Everyone can see everyone's workshops — no per-user permissions model
- No fields beyond what's listed above (no contact person, price, notes, etc.)
- Brand colors: kelly green + white, no logo yet

## Explicitly deferred to "phase 2" — do not build yet unless asked

- Authentication / login (mockups assume an already-logged-in user)
- Editing already-submitted pre- or post-workshop data
- Any real backend/persistence (mockups mutate an in-memory/sessionStorage copy only)

## Next step

The client picks one of the 3 mockup styles (or asks for changes/more options). Once a direction is chosen, the next phase is building real functionality — likely a real backend, persistence, and the phase 2 items above — using the chosen mockup's HTML/CSS as the visual reference. Nothing about a production tech stack has been decided yet; the mockups are plain static HTML/CSS/JS by choice (no stack preference was given), not a signal that production should be static.
