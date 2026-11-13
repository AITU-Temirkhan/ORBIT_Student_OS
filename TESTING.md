# Final Edition — Verification Summary

## Automated checks performed in the assistant's isolated browser

The completed source files were embedded in a Chromium HTML document for local, offline verification. This environment blocks direct navigation to localhost/GitHub, so the test is **not** a live GitHub Pages integration test. JavaScript and localStorage behavior were exercised with an in-page localStorage test double. The resulting captures accurately show the locally assembled Final HTML/CSS/JS build; any CDN-specific differences must be reviewed after publishing.

**Results:** 93 of 93 assertions passed; 0 JavaScript page errors reported.

- 4 pages (`index.html`, `planner.html`, `focus.html`, `profile.html`) × 3 widths (375, 768, 1280 px) × 2 modes (dark, light): checked horizontal overflow, applied theme, and presence of shared navigation/the theme control.
- Dashboard: source data counts, dynamic recommendation, theme localStorage setting.
- Focus: task selector, Start/Pause visibility, `50:00` preset switching **without a native dialog**, reset notice.
- Planner: inline field error, valid task persistence, dynamic DOM card, cancel/accept branded delete dialog, clear-all persistence.
- Profile: saved personalized identity, daily goal storage, nav name update, JSON backup export/import, branded restore confirmation.

The package includes a separate `qa/verify_project.py` static test script that checks important HTML/JS files and the absence of native alert/confirm calls without external Python packages.

## Quick manual checks before LMS upload

1. Run the project with Live Server and open all four pages.
2. Toggle Light mode; refresh and navigate to another page. It should stay Light mode; toggle back.
3. Create a new task, submit invalid input first, verify errors below fields. Fix errors; verify success and task count.
4. Use Search, Status, Priority and Subject filters; edit, complete, delete and start Focus on a task.
5. Start the Pomodoro, then change from 25 to 50 minutes. There must be **no browser-generated confirm window**.
6. Save My Profile; verify personalized name/goal in Dashboard and Focus Studio.
7. Export JSON, clear planner, import saved JSON; verify restored tasks.
8. Check keyboard Tab focus and shortcuts (`/`, `N`, `P`), and the task/tip jQuery animations.
9. Use Chrome DevTools at 375, 768, 1280px in both themes; check horizontal scrolling and console errors.
10. Push to the **same** Endterm GitHub repository, hard refresh GitHub Pages and repeat these checks on the deployed URL.

## Known intentional limitations

- Frontend-only demo: localStorage is device/browser-specific and not a secure account database.
- No cloud synchronization. No user passwords are collected.
- An in-progress Pomodoro is **not** recorded as completed or restored after a tab closes.
- The actual deployed version is not updated until the student pushes the new source to the existing GitHub repository.
