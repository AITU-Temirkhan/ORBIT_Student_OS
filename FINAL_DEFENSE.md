# Two-minute Final defense — ORBIT Student OS

**Keep your browser and VS Code open before your name is called.** The teacher may inspect *any* page or function.

## Suggested 90-second presentation (English)

> Hello! My project is ORBIT Student OS, a personal productivity website for students. This Final Edition improves my Endterm website rather than changing its topic.
>
> I fixed the main feedback: changing the Pomodoro timer no longer shows a browser confirmation popup. The preset switches smoothly and only finished sessions are saved.
>
> I added fully designed light and dark themes that persist across every page. I also built a new My Profile page, where users can set their name, study goals and preferred focus style, and export or restore their workspace as JSON.
>
> In Task Planner I can create, validate, filter, edit, complete and delete tasks. The new Focus action takes a selected task to Focus Studio, where its study time can be recorded.
>
> The Dashboard now shows a personal focus mission and daily goal progress. All information is stored locally using localStorage. I used Bootstrap for forms and layout, JavaScript for logic and jQuery for animations. I tested mobile and desktop layouts and credited my AI assistance.

## Live route (90 seconds)

- **0–15 s Dashboard:** personalized mission, progress and live counts.
- **15–30 s Theme:** switch to light, navigate to Profile, show persistent mode.
- **30–48 s Profile:** saved name/goals and backup controls.
- **48–67 s Planner:** create/form validation, filters, green Focus action.
- **67–80 s Focus:** start timer, switch to 50 min **without native popup**, show connected task.
- **80–90 s Mobile:** prepared 375 px DevTools view and jQuery tip animation.

## Likely code questions

| Teacher asks | Show | Short answer |
|---|---|---|
| Where did you remove the popup? | `js/focus.js` → `setPreset()` | I removed `window.confirm()`. `stopTicking()` clears the interval and I update the preset and display immediately. |
| How do themes work? | `js/theme-init.js`, `js/ui.js`, `css/final.css` | A data-theme attribute selects CSS variables. The choice is stored in localStorage. |
| Where is the profile saved? | `js/storage.js` → `saveProfile()` | The profile object is serialized as JSON under `orbit.profile.v1`. |
| How is focus linked to a task? | `js/planner.js` → `onCardClick()`, `js/focus.js` → `complete()` | The selected task ID is saved; when a full session completes, its task ID and title are added to the session record. |
| What is calculated? | `js/app.js` → `calcStats()` | The dashboard calculates completion percentage and momentum from tasks and focus minutes. |
| What is jQuery used for? | `js/effects.js` | `slideToggle()`, `fadeIn()/fadeOut()`, and `animate()` for helpful transitions. |
| What if localStorage is empty? | `js/storage.js` → `getTasks()` | It creates sample tasks once; profiles/sessions start empty. After clearing tasks, they stay empty. |
| What happens after a page reload? | Theme/profile/storage logic | Stored tasks, profiles, sessions and theme remain; a partial timer is intentionally not saved. |
| What does the JSON backup do? | `js/profile.js` | It exports the local data and validates supported JSON before replacing it. |
| How do you debug? | Chrome DevTools | I inspect Console errors, Elements, Network, and Application → Local Storage. |

## Important honesty

Mention the ChatGPT assistance stated in the website footer and `CREDITS.md`. This is a local demo, not a secure authentication system and not synced to the cloud. If pressed, explain that switching the timer **discards an unfinished session**, but does not delete a completed logged session.
