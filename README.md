# ORBIT — Student OS

**Web Technologies 1 — Endterm Project**

A polished, responsive student productivity web application built with HTML, CSS, Bootstrap, vanilla JavaScript and jQuery. The website is static and can be published on GitHub Pages. It does not require a backend or account.

## Start the project

1. Extract the ZIP archive.
2. Open the `ORBIT_Student_OS` folder in Visual Studio Code.
3. With the VS Code **Live Server** extension, right-click `index.html` and select **Open with Live Server** (or click **Go Live**).
4. Open the three pages using the sidebar: **Dashboard**, **Task planner**, **Focus & insights**.

You may open `index.html` directly in a browser, but using Live Server is preferable for consistent `localStorage` and URL behavior. Bootstrap CSS and Google Fonts are loaded from public CDNs; an internet connection is recommended. jQuery 3.6.1 is bundled locally in `vendor/`.

## Features

### Dashboard (`index.html`)
- Live counts for open, completed and overdue tasks, plus accumulated focus minutes.
- **Momentum Score:** transparent motivational metric (70% completion rate + up to 30% focus bonus for 300 minutes); it is not a grade.
- Shows up to five upcoming deadlines with an interactive search box.
- Suggests the next deadline to tackle.
- Completion progress bar and last-seven-days focus chart.
- jQuery accordion with study tips and animated page scroll.

### Task planner (`planner.html`)
- A Bootstrap-based form with **six fields**: title, subject, deadline, priority, estimated minutes, notes.
- Live inline validation: required fields, title length 3–80 characters, valid subject/priority, deadline not in the past, 15–240 whole minutes, and notes no longer than 240 characters.
- Errors disappear after correction, valid submit clears the form and shows success feedback.
- Create / read / update / delete tasks and mark complete / reopen.
- Search, sort and filter by status and priority, including useful empty-state feedback.
- Tasks are rendered with JavaScript DOM methods from an array of **12 demo task objects**; user entries are stored in `localStorage`.
- Demo tasks can be removed without removing personal tasks.

### Focus & insights (`focus.html`)
- Real countdown timer with 15, 25 and 50-minute study presets and 5/10-minute break presets.
- Start, pause, resume and reset; elapsed time uses wall-clock timestamps to handle inactive tabs reasonably well.
- Completed **study sessions** record duration and date in `localStorage`; breaks do not count as study time.
- Weekly focus chart, recent session history, total focus minutes and task completion metrics.
- Clear focus history with confirmation.

## Project structure

```text
ORBIT_Student_OS/
├── index.html
├── planner.html
├── focus.html
├── css/style.css
├── images/orbit-logo.svg
├── js/data.js
├── js/storage.js
├── js/effects.js
├── js/app.js
├── js/planner.js
├── js/focus.js
├── vendor/jquery.min.js
├── README.md
├── CREDITS.md
├── TESTING.md
└── GIT_PLAN.md
```

## Endterm rubric alignment

| Criterion | Implementation |
| --- | --- |
| Hosting + responsiveness + accessibility (8) | Static pages for GitHub Pages, one responsive nav, heading hierarchy, visible focus styles, form labels, semantic markup; verify 375/768/1280 px |
| Bootstrap forms + validation (12) | 6 fields, clear required + additional validation, per-field messages, no JavaScript alerts for errors |
| JS functionality (16) | 12 objects with 8+ properties; dynamic DOM cards, CRUD, search/filter/sort, timer, progress calculation, no page reload |
| jQuery effects (9) | Tips accordion `slideToggle`, messages `fadeIn`/`fadeOut`, smooth scrolling `animate`; `.stop(true, true)` for rapid clicks |
| Design and UX (10) | Original dark visual system, success/error/empty states, bespoke SVG logo and momentum score |
| Improvement history / teamwork (15) | Depends on the real Git history and instructor-approved topic choice; not automatically earned by code |
| Defense and code quality (30) | Separated files and readable functions; student must explain design and functionality in their own words |

**Important:** A complete ZIP does not guarantee a grade. You must publish it, test it, satisfy any instructor-specific topic/repository requirements and explain your own code in the live defense. The instructor's original file requires disclosure of AI assistance both on the website and in the report.

## Deploy to GitHub Pages

1. Make a new GitHub repository (or use the exact one your instructor approved).
2. Commit the project contents **from inside the project folder** so `index.html` is at the repository root.
3. Push to `main`.
4. GitHub repository → **Settings → Pages → Build and deployment → Deploy from a branch** → `main` → `/(root)` → Save.
5. Open the published URL and verify all pages and paths. Data is browser-local: using a different browser/device gives a separate workspace.

Example terminal commands, when already inside the project directory:

```bash
git init
git branch -M main
git add .
git commit -m "Add functional ORBIT Student OS starter application"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Replace the example URL with your own repository; create the empty GitHub repository first. Git configuration or authentication may be needed.

## Example defense explanation

> I built ORBIT Student OS as a static productivity app. Task objects are stored in an array and saved to localStorage. JavaScript generates cards using DOM methods, which makes filtering and updating tasks possible without refreshing the page. The form validates each field before saving. I use jQuery for three UI effects, and a separate timer module records completed focus sessions. I used ChatGPT as a coding assistant and disclosed it in the website credits and report.

See `CREDITS.md`, `TESTING.md` and `GIT_PLAN.md` before submission.
