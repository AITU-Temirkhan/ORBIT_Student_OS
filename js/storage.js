/* Local-only persistence: no accounts, server or cross-device syncing. */
(function () {
  'use strict';
  const TASK_KEY = 'orbit.tasks.v1';
  const SESSION_KEY = 'orbit.focusSessions.v1';
  const memoryFallback = {};

  function read(key) {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) return JSON.parse(value);
    } catch (error) { console.warn('ORBIT: localStorage read unavailable', error); }
    return Object.prototype.hasOwnProperty.call(memoryFallback, key) ? memoryFallback[key] : null;
  }
  function write(key, value) {
    memoryFallback[key] = value;
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (error) { console.warn('ORBIT: changes may not persist after reload', error); }
    window.dispatchEvent(new CustomEvent('orbit:data-changed'));
  }
  function getTasks() {
    let tasks = read(TASK_KEY);
    if (!Array.isArray(tasks)) {
      tasks = window.OrbitData.sampleTasks();
      write(TASK_KEY, tasks);
    }
    return tasks;
  }
  function saveTasks(tasks) { if (Array.isArray(tasks)) write(TASK_KEY, tasks); }
  function getSessions() { const sessions = read(SESSION_KEY); return Array.isArray(sessions) ? sessions : []; }
  function saveSessions(sessions) { if (Array.isArray(sessions)) write(SESSION_KEY, sessions); }
  function clearSampleTasks() { saveTasks(getTasks().filter(task => !task.isDemo)); }
  window.OrbitStore = { getTasks, saveTasks, getSessions, saveSessions, clearSampleTasks };
})();
