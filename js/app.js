/* Shared app helpers + Dashboard interactions. */
(function () {
  'use strict';
  const priorityWeight = { high: 0, medium: 1, low: 2 };

  function localMidnight(iso) { return new Date(`${iso}T12:00:00`); }
  function todayISO() {
    const d = new Date();
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  }
  function daysUntil(iso) {
    const today = localMidnight(todayISO());
    return Math.round((localMidnight(iso).getTime() - today.getTime()) / 86400000);
  }
  function humanDate(iso) {
    const parsed = localMidnight(iso);
    return Number.isNaN(parsed.getTime()) ? 'Unknown date' : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  function priorityLabel(priority) { return (priority || 'medium').replace(/^./, ch => ch.toUpperCase()); }
  function dueLabel(iso, completed) {
    if (completed) return 'Completed';
    const days = daysUntil(iso);
    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  }
  function el(tag, classes, text) {
    const node = document.createElement(tag);
    if (classes) node.className = classes;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function calcStats(tasks, sessions) {
    const complete = tasks.filter(task => task.completed).length;
    const pending = tasks.filter(task => !task.completed).length;
    const overdue = tasks.filter(task => !task.completed && daysUntil(task.dueDate) < 0).length;
    const minutes = sessions.reduce((sum, session) => sum + (Number(session.minutes) || 0), 0);
    const percentage = tasks.length ? Math.round(100 * complete / tasks.length) : 0;
    // A transparent demo metric, not an academic or medical score.
    const momentum = Math.min(100, Math.round(percentage * 0.7 + Math.min(minutes, 300) / 300 * 30));
    return { complete, pending, overdue, minutes, percentage, momentum };
  }
  function upcoming(tasks, limit) {
    return tasks.filter(t => !t.completed).sort((a, b) => a.dueDate.localeCompare(b.dueDate) || priorityWeight[a.priority] - priorityWeight[b.priority]).slice(0, limit);
  }
  function taskSummaryCard(task) {
    const row = el('article', 'upcoming-row');
    const symbol = el('div', 'upcoming-symbol', task.subject.slice(0, 1));
    symbol.setAttribute('aria-hidden', 'true');
    const content = el('div', 'upcoming-copy');
    content.append(el('h3', 'upcoming-name', task.title));
    content.append(el('p', 'upcoming-meta', `${task.subject} · ${humanDate(task.dueDate)}`));
    const pill = el('span', 'due-pill' + (daysUntil(task.dueDate) < 1 ? ' due-soon' : ''), dueLabel(task.dueDate, false));
    row.append(symbol, content, pill);
    return row;
  }
  function updateTaskCount() {
    const number = document.getElementById('navTaskCount');
    if (number) number.textContent = OrbitStore.getTasks().filter(t => !t.completed).length;
  }
  function renderDashboard() {
    if (document.body.dataset.page !== 'dashboard') return;
    const tasks = OrbitStore.getTasks();
    const sessions = OrbitStore.getSessions();
    const s = calcStats(tasks, sessions);
    const bind = { statPending: s.pending, statComplete: s.complete, statMinutes: s.minutes, statOverdue: s.overdue, completionText: `${s.percentage}%`, momentumText: `${s.momentum}`, momentumCaption: `${s.percentage}% tasks done + focus bonus` };
    Object.entries(bind).forEach(([id, value]) => { const e = document.getElementById(id); if (e) e.textContent = value; });
    const ring = document.getElementById('momentumRing');
    if (ring) ring.style.setProperty('--progress', `${s.momentum}%`);
    const progress = document.getElementById('completionBar');
    if (progress) progress.style.width = `${s.percentage}%`;
    const p = document.getElementById('completionBar');
    if (p) p.parentElement.setAttribute('aria-valuenow', String(s.percentage));

    const target = document.getElementById('upcomingList');
    if (target) {
      target.replaceChildren();
      const search = (document.getElementById('dashboardSearch')?.value || '').trim().toLowerCase();
      const filtered = upcoming(tasks, tasks.length).filter(t => `${t.title} ${t.subject}`.toLowerCase().includes(search)).slice(0, 5);
      if (!filtered.length) target.append(el('p', 'empty-state', search ? 'No tasks match your search.' : 'No upcoming tasks. You are all caught up!'));
      filtered.forEach(t => target.append(taskSummaryCard(t)));
    }
    const recommended = upcoming(tasks, 1)[0];
    const title = document.getElementById('recommendationTitle');
    const meta = document.getElementById('recommendationMeta');
    if (title) title.textContent = recommended ? recommended.title : 'You are all caught up!';
    if (meta) meta.textContent = recommended ? `${recommended.subject} · ${dueLabel(recommended.dueDate, false)} · ${recommended.estimate} min` : 'Create a new task to keep moving.';

    const weekDays = document.getElementById('weekActivity');
    if (weekDays) {
      weekDays.replaceChildren();
      const reference = new Date(); reference.setHours(12, 0, 0, 0);
      const items = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(reference); d.setDate(reference.getDate() - (6 - i));
        return d;
      });
      const counts = items.map(d => {
        const day = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
        return sessions.filter(item => item.date === day).reduce((sum, item) => sum + (Number(item.minutes) || 0), 0);
      });
      const max = Math.max(60, ...counts);
      items.forEach((d, i) => {
        const col = el('div', 'week-column');
        const bar = el('div', 'week-bar');
        bar.style.height = `${Math.max(6, Math.round(counts[i] / max * 100))}%`;
        bar.title = `${counts[i]} focus minutes`;
        const label = el('span', 'week-label', d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2));
        col.append(bar, label); weekDays.append(col);
      });
    }
    updateTaskCount();
  }
  document.addEventListener('DOMContentLoaded', function () {
    const date = document.getElementById('currentDate');
    if (date) date.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const title = document.getElementById('welcomeDate');
    if (title) title.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    OrbitStore.getTasks(); // seeds demo once, never after the user clears all tasks
    updateTaskCount();
    renderDashboard();
    const dashboardSearch = document.getElementById('dashboardSearch');
    if (dashboardSearch) dashboardSearch.addEventListener('input', renderDashboard);
    window.addEventListener('orbit:data-changed', () => { updateTaskCount(); renderDashboard(); });
  });
  window.OrbitApp = { el, todayISO, daysUntil, humanDate, dueLabel, priorityLabel, calcStats, upcoming, renderDashboard, updateTaskCount };
})();
