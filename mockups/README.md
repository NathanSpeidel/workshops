# Mockups

Three static, no-build, no-backend visual mockups of the Workshop Manager app, all rendering the same mock dataset so they're a fair side-by-side comparison. See the top-level [`../README.md`](../README.md) and [`../prompts/initial-prompt.md`](../prompts/initial-prompt.md) for product context.

**Open `index.html` directly in a browser** (double-click it — no server, no `npm install`, nothing to build). It links to all 3 variants.

## The 3 variants

| Folder | Direction |
|---|---|
| `command-center/` | Dense admin dashboard — fixed green sidebar, tables, status pills, compact dot-indicator calendar |
| `field-notebook/` | Spacious editorial/list-first — no sidebar, centered column, serif headings, minimal-line calendar |
| `playful-cards/` | Bright app-like — top tab nav, rounded cards, hero header, chip-filled Google-Calendar-style month grid |

Each variant folder has the same 5 pages, its own `styles.css`, and its own `app.js` (DOM rendering only — no business logic lives here, see below):

- `index.html` — dashboard: stat tiles + a "needs follow-up" list (past workshops still Scheduled/In Progress, i.e. missing post-workshop data) + next-up list
- `upcoming.html` — List ⇄ Calendar toggle (client-side, no reload)
- `new-workshop.html` — pre-workshop data entry form (capability 1)
- `workshop.html?id=w001` — detail view; shows an inline "Log Post-Workshop Data" form if results haven't been logged yet (capability 3)
- `my-workshops.html` — a "Viewing as: [employee]" dropdown filters to that employee's workshops (capability 4, stands in for real auth)

## Shared code (`shared/`)

All business logic and data live here so the three variants can't drift out of sync on anything but pixels. Loaded via classic `<script src>` (not ES modules) specifically so the site works over `file://` — modules and `fetch()` get blocked by browser CORS rules when double-clicked locally; classic scripts don't.

- **`data.js`** — defines `window.WS` and sets `WS.TODAY = "2026-07-10"` (pinned "today" for the demo), `WS.EMPLOYEES` (6 mock employees), `WS.SCHOOLS`, `WS.SERVICES`, `WS.STATUSES`, and `WS.WORKSHOPS` (~18 baseline mock workshops with a deliberate mix of statuses/dates — see the comment above the array in `data.js` for the intent behind specific rows).
- **`helpers.js`** — everything else hangs off `WS`:
  - `WS.getWorkshops()` / `WS.addWorkshop()` / `WS.updateWorkshop(id, patch)` / `WS.resetDemoData()` — a tiny sessionStorage-backed "database". Forms mutate a session copy, **never** `WS.WORKSHOPS` itself, so a page refresh always has a clean baseline available via reset. sessionStorage (not a plain in-memory JS variable) is used deliberately because this is a multi-page site — every navigation is a full page reload, which would wipe a plain JS variable.
  - `WS.formatDate`, `WS.formatDateLong`, `WS.formatTime`, `WS.statusSlug`, `WS.escapeHtml` — formatting/rendering helpers. `escapeHtml` matters because forms let a reviewer type arbitrary text that then gets rendered back via `innerHTML`.
  - `WS.isPast`, `WS.isToday`, `WS.needsFollowUp(workshop)` — date logic, all relative to `WS.TODAY`, not the real system clock.
  - `WS.sortByDate`, `WS.upcoming`, `WS.filterByEmployee` — list helpers.
  - `WS.buildMonthGrid(year, month, workshops)` — the one function all 3 calendar views render from. Returns `{ year, month, label, weeks }`; each cell is `{ date, day, inMonth, isToday, workshops }`. Each variant's `app.js` renders this into its own markup — the *logic* (which day is which, which workshops land where) is identical across all 3; only the DOM/CSS differs.
  - `WS.addMonths`, `WS.getQueryParam`, `WS.newWorkshopId` — misc.

If you add a 4th page or fix a calendar/date bug, fix it once in `shared/helpers.js` — don't reimplement date math per variant.

## Adding a 4th visual variant

Copy an existing variant folder as a starting point, keep the same 5 filenames and the same element `id`s that `app.js` looks up (each variant's `app.js` is a near-identical copy that only changes what HTML strings it builds — see any existing `app.js` for the pattern: one `init<Page>()` function per page, dispatched from a `data-page` attribute on `<body>`). Only restyle `styles.css` and the DOM structure/classes in `app.js`; don't touch `shared/`. Add a card for it in `index.html`.

## Known limitations (by design, not oversights)

- No login/auth — `my-workshops.html`'s "Viewing as" dropdown stands in for it. This is explicitly a phase 2 item per the client.
- No editing of already-submitted data — also explicitly phase 2.
- Data doesn't persist beyond the browser tab's session (sessionStorage). Use each page's "Reset demo data" link to clear anything you've added back to the `shared/data.js` baseline.
- "Today" is hardcoded to 2026-07-10 in `shared/data.js` (`WS.TODAY`), not the real date — the mock data (needs-follow-up rows, in-progress rows, calendar highlighting) is built around that date. If you change it, some mock rows may stop making narrative sense (e.g. rows meant to look "past-due" could become future dates) and should be re-dated too.

## How this was verified

No test framework — verified with headless Chrome (`google-chrome --headless=new --dump-dom` / `--screenshot`) driving each page directly, plus a scratch iframe harness (not committed) to exercise the List⇄Calendar toggle and the two form-submission flows end-to-end. Re-check after material changes:
1. Each variant's Home stats match `shared/data.js` counts.
2. `upcoming.html` calendar month grid highlights `WS.TODAY` and stacks same-day events correctly.
3. Submitting `new-workshop.html` creates a workshop and its "View it" link resolves on `workshop.html`.
4. Logging results on `workshop.html` replaces the form with a read-only results block and updates the status pill.
5. No console errors on any of the 15 pages.
