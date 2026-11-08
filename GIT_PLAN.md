# Real development history — Git planning guide

A project being delivered as a complete ZIP is an initial codebase, **not** proof that it was written progressively. Do **not** backdate commits or manufacture activity to misrepresent when the work occurred. Commit the initial app honestly; add further commits whenever you make and verify real changes. It is acceptable to exceed 30 commits if they represent legitimate work.

Suggested follow-up improvements you can implement and test in separate, meaningful commits over time:

1. Improve the README with actual screenshots.
2. Add small feature documentation for the planner.
3. Add a help tooltip for priority levels.
4. Add an accessible skip-to-content link.
5. Test and refine focus indicators.
6. Improve error messages for unusual date input.
7. Add a clear-search shortcut.
8. Add subject filtering to the planner.
9. Add the task subject to dashboard recommendations.
10. Highlight due-today tasks with a distinct badge.
11. Add an overdue-only filter.
12. Add a confirmation step for clearing sample tasks (already exists; instead improve wording / accessibility).
13. Add accessible announcement for a completed task.
14. Refactor repeated DOM helpers into a single module.
15. Add unit tests for the completion metric.
16. Add unit tests for the priority sorter.
17. Add validation tests for empty title and past dates.
18. Add empty session chart labels.
19. Improve the focus preset button focus state.
20. Show a gentle notification before a timer switch.
21. Add a manual focus session export (CSV).
22. Add JSON data export.
23. Add JSON data import with validation.
24. Add a temporary undo action for task deletion.
25. Create a browser storage troubleshooting guide.
26. Improve the mobile navigation at 375 px.
27. Optimize the mobile task card action buttons.
28. Add a short onboarding walkthrough for new users.
29. Add a lightweight print stylesheet for planning.
30. Add an accessibility audit checklist with findings.
31. Add a responsive testing evidence folder.
32. Improve title/meta descriptions.
33. Update credits and final defense notes with actual work done.

Many of these are **future changes**, not features already present. Combine or split changes based on real work and logic; commit count alone does not earn a grade.
