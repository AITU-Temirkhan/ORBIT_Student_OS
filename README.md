# ORBIT — Student OS | Final Edition

A finished, responsive, client-side productivity workspace for students. The Final Edition **extends the Endterm ORBIT project** and must be published in the **same GitHub repository**, not as a new topic.

- GitHub repository: https://github.com/AITU-Temirkhan/ORBIT_Student_OS
- GitHub Pages target: https://aitu-temirkhan.github.io/ORBIT_Student_OS/
- Student: **Sagat Temirkhan** (individual project)
- Technology: HTML5, CSS3, Bootstrap 5, JavaScript, jQuery, localStorage

## What's new since Endterm

| Previous shortcoming | Final improvement |
|---|---|
| Switching an active timer triggered a blocking browser `confirm()` | Presets switch immediately; an unobtrusive in-page toast explains the reset. No native `confirm`/`alert` calls remain. |
| Only a dark presentation | Branded light **and** dark modes with a keyboard-operable toggle, early theme initialization, CSS variables and persistent choice. |
| No personal study identity | New **My profile** page saves a display name, study track, daily focus goal, weekly completion target and preferred focus style. |
| Pomodoro sessions were not connected to assignments | **Focus Quest**: choose a task in Focus Studio, or press **Focus** on a task card. Completed sessions record the linked task name and ID. |
| Only the original task/session persistence | Profile, focus selection and theme are also saved in localStorage; original Endterm keys remain compatible. |
| Limited data portability and deletion controls | Download and restore a versioned JSON backup; delete tasks/sessions individually or clear all with a branded accessible dialog. |
| Confusing disabled Start and Pause buttons | Exactly one primary timer action is shown at a time, based on the timer state. |
| Dashboard metrics were impersonal | Personalized greeting, recommended focus mission and daily-goal progress meter shared with Focus/Profile. |

## Pages

- `index.html` — Dashboard: live task counts, momentum score, priority recommendation, weekly rhythm and personal focus mission.
- `planner.html` — Task Planner: six-field validated form; create/edit/complete/delete tasks; filter by search, status, priority and subject; sort; **Focus** action; sample-data removal; clear all.
- `focus.html` — Focus Studio: work/break modes, accessible time ring, pause/resume/reset, selected task, completed sessions with per-item removal, weekly chart and daily goal.
- `profile.html` — My profile: validated preference form, personal statistics and goals, local JSON export/import.

## Run locally

1. Unzip the package, open the `ORBIT_Student_OS` folder in VS Code.
2. Right-click `index.html` and choose **Open with Live Server**, or open a terminal in that folder and run `python -m http.server 8000`.
3. Open `http://localhost:8000/index.html`.
4. Use any tab to navigate among the four pages. No account, server or build step is required.

The project includes `vendor/jquery.min.js`. Bootstrap 5 and Google Fonts use their public CDNs; internet access is useful for their styles/fonts. Original ORBIT CSS and included layout fallbacks keep the core UI functional if those services are unavailable.

## Data and privacy

No password or real registration is collected. The demo profile is a **local preference**, not a secure account. Do not enter secrets; all saved data are visible to anyone with access to the browser profile. No backend, cloud sync or database is implemented. Clearing browser site data removes the saved workspace unless you exported a backup.

| localStorage key | Data |
|---|---|
| `orbit.tasks.v1` | Planner task objects (pre-existing Endterm data kept). |
| `orbit.focusSessions.v1` | Completed focus sessions (pre-existing). |
| `orbit.profile.v1` | Name, study track, daily/weekly goals and preferred timer mode. |
| `orbit.theme.v1` | `dark` or `light`. |
| `orbit.activeTask.v1` | ID of the current focus task. |

The JSON backup export includes the tasks, sessions, profile and selected focus task. Import checks the backup format, version and basic field types before offering a **custom** confirmation dialog. Import intentionally overwrites the local workspace; export a backup first if needed.

## Deploy to the **existing** GitHub repo

**Important:** The files provided here are not automatically deployed. Do not create a new repository or change the topic.

1. Open your existing local `ORBIT_Student_OS` Git repository in VS Code.
2. Copy the **contents** of this ZIP's `ORBIT_Student_OS` directory into the existing repository folder, replacing modified files. Preserve the existing `.git` directory (it is intentionally not inside the ZIP).
3. Use Source Control to inspect changes; test them locally, then commit and push them to the existing `main` branch before the Final deadline. Do not fabricate commits or commit after the deadline.
4. Open the GitHub Pages link and hard refresh it; check `index.html`, `planner.html`, `focus.html`, `profile.html`, both modes and localStorage. GitHub Pages normally serves from the configured `main` / root directory.
5. Submit `Final_Sagat_Temirkhan.zip` and `Final_Sagat_Temirkhan.pdf` to the Final folder in Moodle/LMS.

**Git history matters.** The instructor expects regular, authentic work after Endterm, not just one late commit. See `FINAL_GIT_PLAN.md` for a truthful feature-by-feature workflow.

## Test & defense

Read `TESTING.md`, `FINAL_DEFENSE.md` and `CHANGELOG_FINAL.md`. The report contains actual captured browser previews from this local Final build. These screenshots are **not proof the Final version is already published** until step 4 above is complete.

## Credits

See `CREDITS.md` and the **Credits & AI use** disclosure in the website footer. The task data are illustrative; the ORBIT icon was created for this project.
