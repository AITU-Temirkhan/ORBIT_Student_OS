/* Sample data for the first launch. All records are clearly labeled demo tasks in the UI. */
(function () {
  'use strict';
  const SUBJECTS = ['Web Technologies', 'Computer Architecture', 'Discrete Mathematics', 'English', 'Macroeconomics', 'Personal'];
  const DAY = 86400000;
  function relativeDate(days) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }
  function sampleTasks() {
    const rows = [
      ['Finish responsive layout', 'Web Technologies', 1, 'high', 60, false, 'Check mobile, tablet and desktop layouts.'],
      ['Practice JavaScript events', 'Web Technologies', 2, 'high', 45, false, 'Revise click, input and submit events.'],
      ['Review network layers', 'Computer Architecture', 4, 'medium', 40, false, 'Study TCP/IP and basic routing.'],
      ['Solve graph theory exercises', 'Discrete Mathematics', 3, 'medium', 75, false, 'Finish five homework questions.'],
      ['Study 15 English phrases', 'English', 5, 'low', 25, false, 'Write one example for each phrase.'],
      ['Prepare macroeconomics notes', 'Macroeconomics', 6, 'medium', 50, false, 'Summarize fiscal multipliers.'],
      ['Check GitHub Pages deployment', 'Web Technologies', 7, 'high', 30, false, 'Test navigation and URLs.'],
      ['Plan next study week', 'Personal', 8, 'low', 30, false, 'Prioritize work by deadline.'],
      ['Set up a project folder', 'Web Technologies', -3, 'low', 20, true, 'Organize the CSS and JS files.'],
      ['Read JavaScript basics', 'Web Technologies', -2, 'medium', 50, true, 'Variables, arrays and conditions.'],
      ['Review CPU architecture', 'Computer Architecture', -1, 'low', 35, true, 'Cores, threads and memory.'],
      ['Complete an English exercise', 'English', 0, 'low', 25, true, 'Practice present tenses.']
    ];
    return rows.map((r, index) => ({
      id: `demo-${index + 1}`, title: r[0], subject: r[1], dueDate: relativeDate(r[2]),
      priority: r[3], estimate: r[4], completed: r[5], notes: r[6],
      createdAt: new Date().toISOString(), completedAt: r[5] ? new Date().toISOString() : null,
      isDemo: true
    }));
  }
  window.OrbitData = { subjects: SUBJECTS, sampleTasks };
})();
