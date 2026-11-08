# ORBIT — manual test checklist

Do these checks **in your browser** before telling your instructor the project is tested. Mark each result, record screenshots and fix any failures.

## Desktop and mobile
- [ ] GitHub Pages loads `index.html`, `planner.html`, `focus.html`, with no 404 or missing resources.
- [ ] Each page at widths **375, 768, and 1280 px** has no horizontal page scroll, cut-off content, or overlapping controls.
- [ ] Current nav item is highlighted and every nav link works.
- [ ] Keyboard Tab reaches each link, button, field, details disclosure; visible focus indicators appear.
- [ ] Browser console (F12 → Console) shows no uncaught JavaScript errors.

## Planner
- [ ] On first launch, 12 sample task cards appear (the JavaScript array contains 12 objects).
- [ ] Submit an empty form: error messages appear under the required inputs, without JavaScript alerts.
- [ ] Enter a 2-letter title: an inline title-length error is shown, then disappears after correction.
- [ ] Pick yesterday as a deadline: an inline deadline error appears.
- [ ] Enter 5 or 999 minutes: an inline duration error appears; enter 45 and it disappears.
- [ ] Submit a valid task: success text appears, form is cleared, task card appears.
- [ ] Reload: the new task remains visible.
- [ ] Search using a task title, then search a nonsensical string: filtered cards / empty-state appear.
- [ ] Sort by due date, priority, name; filter status and priority.
- [ ] Edit a task: fields populate, saving changes updates the card.
- [ ] Mark task complete / reopen; dashboard numbers update upon navigation.
- [ ] Delete a task; confirm: its card disappears; reload confirms persistence.
- [ ] Remove demo tasks: only demo items are removed.

## Focus & dashboard
- [ ] Start, pause, resume, reset the timer; break presets do not count as study sessions.
- [ ] For a quick verification, finish a 15-minute focus preset in an actual study session. The finished session appears in history and weekly stats (do not claim completion without doing it).
- [ ] Visit dashboard: completed tasks and focus totals are accurate.
- [ ] Tips accordion opens/closes smoothly, including several fast clicks.
- [ ] Success feedback fades smoothly; "Explore your priorities" scrolls to the list.
- [ ] Refresh planner/dashboard: `localStorage` preserves data in the same browser profile.
- [ ] Footer credits clearly mention ChatGPT, Bootstrap, jQuery and demo content.

## Constraints
- The app is frontend-only, with no user authentication or cross-device sync.
- LocalStorage may be blocked in some browser privacy contexts; test in normal browser mode.
- If timer tab is closed, the running session is not saved (only completed sessions are saved).
- Screenshots, repository URL, live URL and AI credits must appear in the endterm report.
