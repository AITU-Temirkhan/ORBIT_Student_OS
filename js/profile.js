/* Final: a demo study profile, calculated goals and import/export with inline feedback. */
(function () {
  'use strict';
  if (document.body.dataset.page !== 'profile') return;
  const form = document.getElementById('profileForm');
  const names = { name: 'profileName', course: 'profileCourse', dailyGoal: 'profileGoal', weeklyGoal: 'profileWeekly', studyStyle: 'profileStyle' };
  const inputs = Object.fromEntries(Object.entries(names).map(([key, id]) => [key, document.getElementById(id)]));
  const errors = Object.fromEntries(Object.entries(names).map(([key, id]) => [key, document.getElementById(id + 'Error')]));
  const profile = OrbitStore.getProfile();
  if (profile) Object.keys(inputs).forEach(key => { if (profile[key] !== undefined) inputs[key].value = profile[key]; });

  function getError(key) {
    const s = String(inputs[key].value).trim();
    switch (key) {
      case 'name': return s.length < 2 || s.length > 40 ? 'Enter a display name of 2 to 40 characters.' : '';
      case 'course': return ['Software Engineering', 'Computer Science', 'Business & Economics', 'Languages & Humanities', 'Self-study'].includes(s) ? '' : 'Please choose your study track.';
      case 'dailyGoal': return /^\d+$/.test(s) && +s >= 15 && +s <= 480 && +s % 5 === 0 ? '' : 'Use 15–480 minutes in steps of 5.';
      case 'weeklyGoal': return /^\d+$/.test(s) && +s >= 1 && +s <= 50 ? '' : 'Choose a whole number between 1 and 50.';
      case 'studyStyle': return ['balanced', 'deep', 'sprint'].includes(s) ? '' : 'Choose a valid focus style.';
      default: return '';
    }
  }
  function validate(key) {
    const message = getError(key);
    errors[key].textContent = message;
    inputs[key].classList.toggle('is-invalid', Boolean(message));
    inputs[key].setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  }
  Object.keys(inputs).forEach(key => {
    inputs[key].addEventListener('input', () => { if (inputs[key].getAttribute('aria-invalid') === 'true') validate(key); });
    inputs[key].addEventListener('change', () => validate(key));
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const results = Object.keys(inputs).map(validate);
    if (results.some(valid => !valid)) { Object.keys(inputs).find(key => getError(key)) && inputs[Object.keys(inputs).find(key => getError(key))].focus(); return; }
    const next = Object.fromEntries(Object.keys(inputs).map(key => [key, inputs[key].value.trim()]));
    next.dailyGoal = Number(next.dailyGoal);
    next.weeklyGoal = Number(next.weeklyGoal);
    OrbitStore.saveProfile(next);
    document.getElementById('profileFormStatus').textContent = 'Saved! Your dashboard and focus goals are updated.';
    OrbitEffects.toast('Your study profile has been saved.');
    render();
  });

  function weekStartISO() {
    const d = new Date(); const day = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - day);
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  }
  function render() {
    const user = OrbitStore.getProfile();
    const tasks = OrbitStore.getTasks();
    const sessions = OrbitStore.getSessions();
    const goal = Number(user?.dailyGoal) || 60;
    const today = OrbitApp.todayISO();
    const minutes = sessions.filter(s => s.date === today).reduce((sum, session) => sum + (Number(session.minutes) || 0), 0);
    const percent = Math.min(100, Math.round(minutes / goal * 100));
    document.getElementById('goalFocusText').textContent = `${minutes} / ${goal} min`;
    document.getElementById('goalFocusBar').style.width = percent + '%';
    document.getElementById('goalFocusMeter').setAttribute('aria-valuenow', String(percent));
    document.getElementById('goalTasksText').textContent = String(tasks.filter(t => t.completed).length);
    document.getElementById('goalSessionsText').textContent = String(sessions.length);
    document.getElementById('profileWelcome').textContent = user?.name ? `Welcome back, ${user.name.split(/\s+/)[0]}.` : 'Your next chapter starts here.';
    document.getElementById('profileSubtitle').textContent = user?.course ? `${user.course} · ${goal} min daily focus goal · ${user.studyStyle} rhythm.` : 'Tell ORBIT how you like to study; your progress and goals will follow you on every page.';
    const weekly = Number(user?.weeklyGoal) || 5;
    const completedThisWeek = tasks.filter(t => t.completed && typeof t.completedAt === 'string' && t.completedAt.slice(0, 10) >= weekStartISO()).length;
    const wp = Math.min(100, Math.round(completedThisWeek / weekly * 100));
    document.getElementById('weeklyGoalTitle').textContent = `${completedThisWeek} of ${weekly} tasks this week`;
    document.getElementById('weeklyGoalDetail').textContent = wp >= 100 ? 'Weekly mission complete — amazing consistency!' : `${Math.max(0, weekly - completedThisWeek)} more completions to reach your weekly target.`;
    document.getElementById('weeklyGoalBar').style.width = wp + '%';
    document.getElementById('weeklyGoalMeter').setAttribute('aria-valuenow', String(wp));
  }

  const backupFile = document.getElementById('backupFile');
  const backupError = document.getElementById('backupError');
  const backupStatus = document.getElementById('backupStatus');
  document.getElementById('exportBackup').addEventListener('click', () => {
    const data = { format: 'orbit-student-os-backup', version: 1, exportedAt: new Date().toISOString(), tasks: OrbitStore.getTasks(), sessions: OrbitStore.getSessions(), profile: OrbitStore.getProfile(), activeTask: OrbitStore.getActiveTask() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `ORBIT_Backup_${OrbitApp.todayISO()}.json`;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    backupStatus.textContent = 'Backup exported. Keep the JSON file somewhere safe.';
  });
  function validTask(task) {
    return task && typeof task === 'object' && typeof task.id === 'string' && typeof task.title === 'string' && task.title.length <= 100 && typeof task.subject === 'string' && task.subject.length <= 100 && /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate) && ['high', 'medium', 'low'].includes(task.priority) && Number.isFinite(Number(task.estimate)) && Number(task.estimate) >= 0 && Number(task.estimate) <= 240 && typeof task.completed === 'boolean' && (task.notes === undefined || typeof task.notes === 'string' && task.notes.length <= 240);
  }
  function validSession(session) {
    return session && typeof session.id === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(session.date) && Number.isFinite(Number(session.minutes)) && Number(session.minutes) > 0 && Number(session.minutes) <= 240 && typeof session.time === 'string';
  }
  document.getElementById('importBackup').addEventListener('click', async () => {
    backupError.textContent = ''; backupStatus.textContent = '';
    const file = backupFile.files[0];
    if (!file) { backupError.textContent = 'Please choose a JSON backup first.'; return; }
    if (file.size > 2 * 1024 * 1024) { backupError.textContent = 'Backup is too large (maximum 2 MB).'; return; }
    let data;
    try { data = JSON.parse(await file.text()); }
    catch (_) { backupError.textContent = 'This is not a valid JSON file.'; return; }
    if (!data || data.format !== 'orbit-student-os-backup' || data.version !== 1 || !Array.isArray(data.tasks) || !Array.isArray(data.sessions) || data.tasks.length > 500 || data.sessions.length > 2000 || !data.tasks.every(validTask) || !data.sessions.every(validSession) || (data.profile !== null && data.profile !== undefined && (typeof data.profile !== 'object' || Array.isArray(data.profile) || typeof data.profile.name !== 'string' || data.profile.name.length > 40))) {
      backupError.textContent = 'This file is not a supported ORBIT backup.'; return;
    }
    OrbitUI.ask({ title: 'Restore this workspace?', message: `This will replace ${OrbitStore.getTasks().length} tasks and ${OrbitStore.getSessions().length} sessions with ${data.tasks.length} tasks and ${data.sessions.length} sessions from your backup.`, accept: 'Restore backup', onAccept: () => {
      OrbitStore.saveTasks(data.tasks);
      OrbitStore.saveSessions(data.sessions);
      if (data.profile) OrbitStore.saveProfile(data.profile);
      else OrbitStore.clearProfile();
      OrbitStore.setActiveTask(typeof data.activeTask === 'string' ? data.activeTask : '');
      const current = OrbitStore.getProfile();
      form.reset();
      if (current) Object.keys(inputs).forEach(key => { if (current[key] !== undefined) inputs[key].value = current[key]; });
      backupFile.value = '';
      backupStatus.textContent = 'Workspace restored! Visit your planner to see imported tasks.';
      OrbitEffects.toast('ORBIT backup restored.'); render();
    }});
  });
  window.addEventListener('orbit:data-changed', render);
  render();
})();
