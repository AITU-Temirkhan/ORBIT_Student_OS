/* Pomodoro focus timer: real elapsed-time calculation avoids background-tab drift. */
(function () {
  'use strict';
  if (document.body.dataset.page !== 'focus') return;
  const timerLabel = document.getElementById('timerLabel');
  const timerCircle = document.querySelector('.timer-circle');
  const startButton = document.getElementById('startTimer');
  const pauseButton = document.getElementById('pauseTimer');
  const resetButton = document.getElementById('resetTimer');
  const progressCircle = document.getElementById('timerProgress');
  const sessionList = document.getElementById('sessionHistory');
  const presets = [...document.querySelectorAll('[data-focus-minutes]')];
  const taskSelect = document.getElementById('focusTaskSelect');
  function renderTaskOptions() {
    const tasks = OrbitStore.getTasks().filter(t => !t.completed);
    const previous = OrbitStore.getActiveTask();
    taskSelect.replaceChildren();
    const general = new Option('General focus session', ''); taskSelect.add(general);
    tasks.forEach(task => taskSelect.add(new Option(`${task.title} · ${task.subject}`, task.id)));
    taskSelect.value = tasks.some(t => t.id === previous) ? previous : '';
    if (previous && !taskSelect.value) OrbitStore.setActiveTask('');
    document.getElementById('selectedTaskHint').textContent = taskSelect.value ? 'Your finished focus session will be linked to this task.' : 'Choose a task to connect your focus session to your planner.';
  }
  taskSelect.addEventListener('change', () => {
    OrbitStore.setActiveTask(taskSelect.value);
    document.getElementById('selectedTaskHint').textContent = taskSelect.value ? 'Your finished focus session will be linked to this task.' : 'Choose a task to connect your focus session to your planner.';
  });
  let duration = 25 * 60;
  let mode = "work";
  let remaining = duration;
  let endAt = 0;
  let ticking = null;
  let running = false;
  const circumference = 2 * Math.PI * 98;
  progressCircle.style.strokeDasharray = String(circumference);

  function format(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }
  function updateDisplay() {
    timerLabel.textContent = format(remaining);
    document.title = `${format(remaining)} · ORBIT Focus`;
    progressCircle.style.strokeDashoffset = String(circumference * (1 - (duration ? remaining / duration : 0)));
    startButton.hidden = running;
    pauseButton.hidden = !running;
    timerCircle.classList.toggle('is-running', running);
    startButton.textContent = remaining < duration ? (mode === 'break' ? 'Resume break' : 'Resume focus') : (mode === 'break' ? 'Start break' : 'Start focus');
    const status = document.getElementById('timerStatus');
    status.textContent = running ? (mode === 'break' ? 'Take a real break — you earned it.' : 'You are in a focus session.') : (remaining < duration ? 'Paused — pick up where you left off.' : (mode === 'break' ? 'Time to recharge.' : 'Ready when you are.'));
  }
  function stopTicking() { if (ticking !== null) window.clearInterval(ticking); ticking = null; running = false; }
  function complete() {
    stopTicking();
    if (mode === 'work') {
      const sessions = OrbitStore.getSessions();
      const now = new Date();
      sessions.unshift({
        id: window.crypto?.randomUUID?.() || `session-${Date.now()}`,
        date: OrbitApp.todayISO(), time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        minutes: Math.round(duration / 60), createdAt: now.toISOString(),
        taskId: taskSelect.value || null,
        taskTitle: taskSelect.value ? OrbitStore.getTasks().find(t => t.id === taskSelect.value)?.title || '' : '' 
      });
      OrbitStore.saveSessions(sessions);
      renderSessions();
    }
    remaining = duration;
    updateDisplay();
    OrbitEffects.toast(mode === 'work' ? 'Focus session complete! Your progress is saved.' : 'Break complete. Ready for another study session?');
    document.getElementById('timerStatus').textContent = mode === 'work' ? 'Session complete. Great work!' : 'Break complete. Nice reset!';
  }
  function updateTick() {
    remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
    if (remaining === 0) { complete(); return; }
    updateDisplay();
  }
  function start() {
    if (running) return;
    running = true;
    endAt = Date.now() + remaining * 1000;
    ticking = window.setInterval(updateTick, 200);
    updateDisplay();
  }
  function pause() {
    if (!running) return;
    remaining = Math.max(1, Math.ceil((endAt - Date.now()) / 1000));
    stopTicking(); updateDisplay();
  }
  function reset() {
    stopTicking(); remaining = duration; updateDisplay();
    OrbitEffects.toast('Timer reset.');
  }
  function setPreset(minutes, button) {
    const abandoned = running || remaining < duration;
    stopTicking(); duration = minutes * 60; remaining = duration; mode = button.dataset.sessionType === 'break' ? 'break' : 'work';
    presets.forEach(b => { const selected = b === button; b.classList.toggle('active', selected); b.setAttribute('aria-pressed', String(selected)); });
    updateDisplay();
    if (abandoned) OrbitEffects.toast('Timer switched. Your unfinished session was reset.');
  }
  function renderSessions() {
    const sessions = OrbitStore.getSessions();
    const total = sessions.reduce((sum, s) => sum + (Number(s.minutes) || 0), 0);
    const today = sessions.filter(s => s.date === OrbitApp.todayISO()).reduce((sum, s) => sum + (Number(s.minutes) || 0), 0);
    const { complete, percentage } = OrbitApp.calcStats(OrbitStore.getTasks(), sessions);
    const fields = { focusMinutes: total, todayFocus: today, focusSessions: sessions.length, finishedTasks: complete, focusCompletion: `${percentage}%` };
    Object.entries(fields).forEach(([id, value]) => { const target = document.getElementById(id); if (target) target.textContent = value; });
    const goal = Number(OrbitStore.getProfile()?.dailyGoal) || 60;
    const goalPercent = Math.min(100, Math.round(today / goal * 100));
    document.getElementById('focusGoalCaption').textContent = `${today} / ${goal} min`;
    document.getElementById('focusGoalBar').style.width = `${goalPercent}%`;
    document.getElementById('focusGoalMeter').setAttribute('aria-valuenow', String(goalPercent));
    sessionList.replaceChildren();
    if (!sessions.length) {
      sessionList.append(OrbitApp.el('p', 'empty-state', 'No focus sessions yet. Complete one to start your history.'));
    } else sessions.slice(0, 7).forEach(s => {
      const item = OrbitApp.el('li', 'session-item');
      const left = OrbitApp.el('div', 'session-info');
      left.append(OrbitApp.el('strong', '', `${s.minutes} min focus`), OrbitApp.el('span', '', `${OrbitApp.humanDate(s.date)} · ${s.time}${s.taskTitle ? ' · ' + s.taskTitle : ''}`));
      const remove = OrbitApp.el('button', 'mini-button session-remove', '×');
      remove.type = 'button'; remove.dataset.sessionId = s.id;
      remove.setAttribute('aria-label', 'Remove focus session from ' + s.date);
      item.append(left, remove);
      sessionList.append(item);
    });
    renderWeek(sessions);
  }
  function renderWeek(sessions) {
    const grid = document.getElementById('focusWeekChart');
    grid.replaceChildren();
    const today = new Date(); today.setHours(12, 0, 0, 0);
    const dates = Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() - 6 + i); return d; });
    const counts = dates.map(d => {
      const dateString = [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
      return sessions.filter(s => s.date === dateString).reduce((sum, s) => sum + Number(s.minutes || 0), 0);
    });
    const max = Math.max(60, ...counts);
    dates.forEach((date, i) => {
      const col = OrbitApp.el('div', 'chart-column');
      const value = OrbitApp.el('span', 'chart-value', `${counts[i]}m`);
      const barWrap = OrbitApp.el('div', 'chart-bar-container');
      const bar = OrbitApp.el('div', 'chart-bar'); bar.style.height = `${Math.max(4, counts[i] / max * 100)}%`;
      barWrap.append(bar);
      const day = OrbitApp.el('span', 'chart-day', date.toLocaleDateString('en-US', { weekday: 'short' }));
      col.append(value, barWrap, day); grid.append(col);
    });
  }
  document.addEventListener('keydown', function(event) {
    const active = document.activeElement;
    const interactive = active.closest('input, textarea, select, button, a, [contenteditable="true"]');
    if (event.key.toLowerCase() !== 'p' || event.ctrlKey || event.altKey || event.metaKey || event.repeat || interactive) return;
    event.preventDefault();
    if (running) pause();
    else start();
  });
  presets.forEach(button => button.addEventListener('click', () => setPreset(Number(button.dataset.focusMinutes), button)));
  startButton.addEventListener('click', start);
  pauseButton.addEventListener('click', pause);
  resetButton.addEventListener('click', reset);
  document.getElementById('clearSessions').addEventListener('click', () => {
    if (!OrbitStore.getSessions().length) { OrbitEffects.toast('No sessions to clear.'); return; }
    OrbitUI.ask({ title: 'Clear focus history?', message: `Remove all ${OrbitStore.getSessions().length} completed sessions? This cannot be undone.`, accept: 'Clear history', onAccept: () => {
      OrbitStore.saveSessions([]); renderSessions(); OrbitEffects.toast('Focus history cleared.');
    }});
  });
  sessionList.addEventListener('click', event => {
    const button = event.target.closest('[data-session-id]');
    if (!button) return;
    OrbitUI.ask({ title: 'Remove this focus session?', message: 'This completed session will be removed from your study history.', accept: 'Remove session', onAccept: () => {
      OrbitStore.saveSessions(OrbitStore.getSessions().filter(s => s.id !== button.dataset.sessionId));
      renderSessions(); OrbitEffects.toast('Session removed.');
    }});
  });
  window.addEventListener('orbit:data-changed', () => { renderSessions(); /* Avoid rebuilding task options while user is selecting. */ });
  document.addEventListener('visibilitychange', () => { if (running && !document.hidden) updateTick(); });
  window.addEventListener('beforeunload', stopTicking);
  const preferred = OrbitStore.getProfile()?.studyStyle;
  const preferredMinutes = preferred === 'deep' ? 50 : preferred === 'sprint' ? 15 : 25;
  const chosen = presets.find(b => Number(b.dataset.focusMinutes) === preferredMinutes && !b.dataset.sessionType);
  if (chosen) { duration = preferredMinutes * 60; remaining = duration; presets.forEach(b => { b.classList.toggle('active', b === chosen); b.setAttribute('aria-pressed', String(b === chosen)); }); }
  renderTaskOptions(); updateDisplay(); renderSessions();
})();
