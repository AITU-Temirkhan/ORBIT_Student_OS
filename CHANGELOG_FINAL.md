# ORBIT Final Edition — Changes since Endterm

## Teacher feedback — addressed

**Endterm issue:** Clicking a different Pomodoro preset during an active timer opened the browser-generated `confirm()` message: “Switch timer? Your current session will be reset.”

**Final fix:** Replaced the native `window.confirm()` call in `js/focus.js` with an immediate, predictable preset change and a short non-blocking ORBIT feedback toast. The old session resets rather than incorrectly counting a partial session. Timer controls now swap between a visible Start/Resume button and a visible Pause button.

**Additional UX audit:** Removed all other native `window.confirm()` calls for deleting a task, removing demo data, and clearing completed sessions. Destructive actions now use the reusable accessible `<dialog>` component (`js/ui.js`); a preset switch is *not* treated as a destructive confirmation.

## Final release feature list

1. **Light/dark themes** — nav-bar button on every page; saved as `orbit.theme.v1`; early theme initialization and complete light color treatment.
2. **My profile** — new fourth page with inline JavaScript form validation (name, track, daily focus minutes, weekly task target, study style) and personalized sidebar greeting.
3. **Focus Quest** — start focus on a specific planner task; persist the selection and link completed sessions to that task.
4. **Daily focus goal** — profile-defined progress meter on Dashboard, Focus Studio and My Profile.
5. **Weekly task mission** — completion target and calculated progress on the Profile page.
6. **Portable data** — export/import JSON backup with schema checks and styled confirmation.
7. **Task controls** — new Focus action, Clear All tasks, custom delete dialog.
8. **Focus history controls** — remove individual sessions, clear all, linked task captions.
9. **Accessibility and responsiveness** — keyboard-visible theme toggle, labeled profile inputs, accessible modal, 375/768/1280-width testing across both modes.
10. **Original improvements retained** — search, status/priority/subject filters, overdue view, task notes counter, shortcuts, jQuery visual effects and original task/session keys.

## How to demonstrate the feedback fix

Focus Studio → click **Start focus** → choose **50 min / Deep work**. The timer immediately shows `50:00`, stays on the page, and displays an unobtrusive ORBIT toast rather than a native browser pop-up.

This is an individual extension of the *same project and repository*, not a separate website.
