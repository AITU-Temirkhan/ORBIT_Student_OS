/* All task cards are constructed dynamically from an array of objects. */
(function () {
  'use strict';
  if (document.body.dataset.page !== 'planner') return;
  const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
  const form = document.getElementById('taskForm');
  const inputs = {
    title: document.getElementById('taskTitle'),
    subject: document.getElementById('taskSubject'),
    dueDate: document.getElementById('taskDeadline'),
    priority: document.getElementById('taskPriority'),
    estimate: document.getElementById('taskEstimate'),
    notes: document.getElementById('taskNotes')
  };
  const list = document.getElementById('taskGrid');
  const empty = document.getElementById('plannerEmpty');
  const countLabel = document.getElementById('resultCount');
  const statusLabel = document.getElementById('formStatus');
  const filterSearch = document.getElementById('filterSearch');
  const filterStatus = document.getElementById('filterStatus');
  const filterPriority = document.getElementById('filterPriority');
  const filterSort = document.getElementById('filterSort');
  const filterSubject = document.getElementById('filterSubject');
  OrbitData.subjects.forEach(subject => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    filterSubject.append(option);
  });
  const touched = new Set();
  const notesCounter = document.getElementById('notesCounter');
  function updateNotesCounter() {
    notesCounter.textContent = `${inputs.notes.value.length} / 240 characters`;
  }
  inputs.notes.addEventListener('input', updateNotesCounter);
  let editingId = null;

  const fieldErrors = {
    title: document.getElementById('titleError'), subject: document.getElementById('subjectError'),
    dueDate: document.getElementById('dueDateError'), priority: document.getElementById('priorityError'),
    estimate: document.getElementById('estimateError'), notes: document.getElementById('notesError')
  };
  function value(key) { return inputs[key].value.trim(); }
  function errorFor(key) {
    const inputValue = value(key);
    switch (key) {
      case 'title':
        if (!inputValue) return 'Enter a task title.';
        if (inputValue.length < 3) return 'The title must have at least 3 characters.';
        if (inputValue.length > 80) return 'The title cannot exceed 80 characters.';
        return '';
      case 'subject': return OrbitData.subjects.includes(inputValue) ? '' : 'Choose a subject from the list.';
      case 'dueDate':
        if (!inputValue) return 'Choose a deadline.';
        if (!/^\d{4}-\d{2}-\d{2}$/.test(inputValue) || !Number.isFinite(Date.parse(`${inputValue}T12:00:00`))) return 'Choose a valid date.';
        if (inputValue < OrbitApp.todayISO()) return 'Deadline cannot be in the past.';
        return '';
      case 'priority': return ['low', 'medium', 'high'].includes(inputValue) ? '' : 'Choose a priority.';
      case 'estimate':
        if (!inputValue) return 'Enter an estimated study duration.';
        if (!/^\d+$/.test(inputValue) || Number(inputValue) < 15 || Number(inputValue) > 240) return 'Enter a whole number from 15 to 240 minutes.';
        return '';
      case 'notes': return inputValue.length > 240 ? 'Keep notes under 240 characters.' : '';
      default: return '';
    }
  }
  function showError(key) {
    const message = errorFor(key);
    fieldErrors[key].textContent = message;
    inputs[key].classList.toggle('is-invalid', Boolean(message));
    inputs[key].setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  }
  function clearErrors() {
    Object.keys(inputs).forEach(key => { fieldErrors[key].textContent = ''; inputs[key].classList.remove('is-invalid'); inputs[key].setAttribute('aria-invalid', 'false'); });
    touched.clear();
  }
  function clearForm() {
    form.reset();
    updateNotesCounter();
    editingId = null;
    inputs.dueDate.min = OrbitApp.todayISO();
    inputs.estimate.value = '45';
    inputs.priority.value = 'medium';
    document.getElementById('formTitle').textContent = 'Create a task';
    document.getElementById('submitText').textContent = 'Add task';
    document.getElementById('cancelEdit').hidden = true;
    clearErrors();
  }
  function makeBadge(text, classes) { return OrbitApp.el('span', 'task-badge ' + classes, text); }
  function buildCard(task) {
    const article = OrbitApp.el('article', 'task-card' + (task.completed ? ' task-done' : ''));
    article.dataset.taskId = task.id;
    const top = OrbitApp.el('div', 'task-top');
    const subject = makeBadge(task.subject, 'subject-tag');
    const priority = makeBadge(OrbitApp.priorityLabel(task.priority), 'priority-' + task.priority);
    top.append(subject, priority);
    const h3 = OrbitApp.el('h3', 'task-title', task.title);
    const note = OrbitApp.el('p', 'task-note', task.notes || 'No additional notes.');
    const details = OrbitApp.el('div', 'task-details');
    details.append(OrbitApp.el('span', '', `◷ ${task.estimate} min`));
    const due = OrbitApp.el('span', OrbitApp.daysUntil(task.dueDate) <= 1 && !task.completed ? 'urgent-date' : '', `▦ ${OrbitApp.humanDate(task.dueDate)} · ${OrbitApp.dueLabel(task.dueDate, task.completed)}`);
    details.append(due);
    const buttons = OrbitApp.el('div', 'task-buttons');
    const done = OrbitApp.el('button', 'mini-button task-toggle', task.completed ? '↩ Reopen' : '✓ Complete');
    done.type = 'button'; done.dataset.action = 'toggle'; done.dataset.id = task.id;
    done.setAttribute('aria-label', (task.completed ? 'Reopen ' : 'Complete ') + task.title);
    const edit = OrbitApp.el('button', 'mini-button task-edit', '✎ Edit');
    edit.type = 'button'; edit.dataset.action = 'edit'; edit.dataset.id = task.id;
    edit.setAttribute('aria-label', 'Edit ' + task.title);
    const del = OrbitApp.el('button', 'mini-button mini-danger task-delete', '× Delete');
    del.type = 'button'; del.dataset.action = 'delete'; del.dataset.id = task.id;
    del.setAttribute('aria-label', 'Delete ' + task.title);
    if (!task.completed) {
      const focus = OrbitApp.el('button', 'mini-button task-focus', '◷ Focus');
      focus.type = 'button'; focus.dataset.action = 'focus'; focus.dataset.id = task.id;
      focus.setAttribute('aria-label', 'Focus on ' + task.title);
      buttons.append(focus);
    }
    buttons.append(done, edit, del);
    article.append(top, h3, note, details, buttons);
    return article;
  }
  function filteredTasks() {
    const query = filterSearch.value.trim().toLowerCase();
    const tasks = OrbitStore.getTasks().filter(task => {
      const matchesSearch = `${task.title} ${task.subject} ${task.notes || ''}`.toLowerCase().includes(query);
      const matchesStatus =
        filterStatus.value === 'all' ||
        (filterStatus.value === 'complete' && task.completed) ||
        (filterStatus.value === 'pending' && !task.completed) ||
        (filterStatus.value === 'overdue' && !task.completed && OrbitApp.daysUntil(task.dueDate) < 0);
      const matchesPriority = filterPriority.value === 'all' || task.priority === filterPriority.value;
      const matchesSubject = filterSubject.value === 'all' || task.subject === filterSubject.value;
      return matchesSearch && matchesStatus && matchesPriority && matchesSubject;
    });
    const mode = filterSort.value;
    tasks.sort((a, b) => {
      if (mode === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.dueDate.localeCompare(b.dueDate);
      if (mode === 'title') return a.title.localeCompare(b.title);
      if (mode === 'newest') return b.createdAt.localeCompare(a.createdAt);
      return a.dueDate.localeCompare(b.dueDate) || PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    });
    return tasks;
  }
  function render() {
    const tasks = filteredTasks();
    list.replaceChildren();
    tasks.forEach(task => list.append(buildCard(task)));
    empty.hidden = tasks.length > 0;
    empty.querySelector('p').textContent = OrbitStore.getTasks().length === 0
      ? 'No tasks yet. Create your first task using the form.'
      : 'No matching tasks. Change your search or reset filters.';
    countLabel.textContent = `Showing ${tasks.length} of ${OrbitStore.getTasks().length} tasks`;
    OrbitApp.updateTaskCount();
    const stats = OrbitApp.calcStats(OrbitStore.getTasks(), OrbitStore.getSessions());
    document.getElementById('plannerPending').textContent = stats.pending;
    document.getElementById('plannerDone').textContent = stats.complete;
    document.getElementById('plannerOverdue').textContent = stats.overdue;
  }
  function editTask(task) {
    editingId = task.id;
    Object.keys(inputs).forEach(key => { inputs[key].value = task[key] ?? ''; });
    updateNotesCounter();
    document.getElementById('formTitle').textContent = 'Edit this task';
    document.getElementById('submitText').textContent = 'Save changes';
    document.getElementById('cancelEdit').hidden = false;
    statusLabel.textContent = '';
    clearErrors();
    if (window.jQuery) window.jQuery('html, body').stop(true).animate({ scrollTop: Math.max(0, window.jQuery('#taskFormSection').offset().top - 24) }, 350);
    else document.getElementById('taskFormSection').scrollIntoView({ behavior: 'smooth' });
    inputs.title.focus({ preventScroll: true });
  }
  function onCardClick(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const tasks = OrbitStore.getTasks();
    const index = tasks.findIndex(task => task.id === button.dataset.id);
    if (index === -1) return;
    const task = tasks[index];
    if (button.dataset.action === 'edit') return editTask(task);
    if (button.dataset.action === 'focus') {
      OrbitStore.setActiveTask(task.id);
      window.location.href = 'focus.html';
      return;
    }
    if (button.dataset.action === 'delete') {
      OrbitUI.ask({ title: 'Delete this task?', message: `"${task.title}" will be removed from your planner.`, accept: 'Delete task', onAccept: () => {
        const fresh = OrbitStore.getTasks().filter(item => item.id !== task.id);
        if (editingId === task.id) clearForm();
        OrbitStore.saveTasks(fresh);
        OrbitEffects.toast('Task deleted.'); render();
      }});
      return;
    } else if (button.dataset.action === 'toggle') {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : null;
      OrbitStore.saveTasks(tasks);
      OrbitEffects.toast(task.completed ? 'Task completed. Nice work!' : 'Task reopened.');
    }
    render();
  }
  Object.entries(inputs).forEach(([key, input]) => {
    input.addEventListener('blur', () => { touched.add(key); showError(key); });
    input.addEventListener('input', () => { if (touched.has(key) || fieldErrors[key].textContent) showError(key); });
    input.addEventListener('change', () => { if (touched.has(key) || fieldErrors[key].textContent) showError(key); });
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    statusLabel.textContent = '';
    const valid = Object.keys(inputs).map(key => { touched.add(key); return showError(key); }).every(Boolean);
    if (!valid) {
      const firstInvalid = Object.keys(inputs).find(key => errorFor(key));
      if (firstInvalid) inputs[firstInvalid].focus();
      return;
    }
    const tasks = OrbitStore.getTasks();
    const previous = editingId ? tasks.find(task => task.id === editingId) : null;
    const newTask = {
      id: previous?.id || (window.crypto?.randomUUID?.() || `task-${Date.now()}-${Math.floor(Math.random()*10000)}`),
      title: value('title'), subject: value('subject'), dueDate: value('dueDate'),
      priority: value('priority'), estimate: Number(value('estimate')), notes: value('notes'),
      completed: previous?.completed || false,
      completedAt: previous?.completedAt || null,
      createdAt: previous?.createdAt || new Date().toISOString(),
      isDemo: false
    };
    const wasEditing = Boolean(previous);
    if (wasEditing) tasks.splice(tasks.findIndex(task => task.id === editingId), 1, newTask);
    else tasks.unshift(newTask);
    OrbitStore.saveTasks(tasks);
    clearForm();
    statusLabel.textContent = wasEditing ? 'Your task has been updated successfully.' : 'Your new task has been added successfully.';
    OrbitEffects.toast(wasEditing ? 'Task updated!' : 'Task added!');
    render();
  });
  list.addEventListener('click', onCardClick);
  [filterSearch, filterStatus, filterPriority, filterSubject, filterSort].forEach(input => input.addEventListener(input === filterSearch ? 'input' : 'change', render));
  document.getElementById('cancelEdit').addEventListener('click', () => { clearForm(); statusLabel.textContent = ''; });
  document.getElementById('clearFilters').addEventListener('click', () => {
    filterSearch.value = ''; filterStatus.value = 'all'; filterPriority.value = 'all'; filterSubject.value = 'all'; filterSort.value = 'due'; render();
  });
  document.getElementById('clearDemo').addEventListener('click', () => {
    const sampleCount = OrbitStore.getTasks().filter(t => t.isDemo).length;
    if (!sampleCount) { OrbitEffects.toast('There are no demo tasks to remove.'); return; }
    OrbitUI.ask({ title: 'Remove starter tasks?', message: `Remove ${sampleCount} sample tasks? All of your own tasks will stay.`, accept: 'Remove samples', onAccept: () => {
      OrbitStore.clearSampleTasks(); render(); OrbitEffects.toast('Demo tasks removed.');
    }});
  });
  document.getElementById('clearAllTasks').addEventListener('click', () => {
    const total = OrbitStore.getTasks().length;
    if (!total) { OrbitEffects.toast('Your planner is already empty.'); return; }
    OrbitUI.ask({ title: 'Clear your entire planner?', message: `All ${total} tasks will be removed. Export a backup from My profile first if you want to keep them.`, accept: 'Clear all tasks', onAccept: () => {
      OrbitStore.saveTasks([]); OrbitStore.setActiveTask(''); clearForm(); render(); OrbitEffects.toast('All tasks cleared.');
    }});
  });
  // Keyboard shortcuts are ignored while typing in an input or selecting controls.
  document.addEventListener('keydown', function(event) {
    const active = document.activeElement;
    const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName);
    const hasModifier = event.ctrlKey || event.altKey || event.metaKey;
    if (hasModifier || event.repeat) return;
    if (event.key.toLowerCase() === 'n' && !typing && !['BUTTON', 'A'].includes(active.tagName)) {
      event.preventDefault();
      document.getElementById('taskFormSection').scrollIntoView({ behavior: 'smooth' });
      inputs.title.focus({ preventScroll: true });
    }
    if (event.key === '/' && !typing) {
      event.preventDefault();
      filterSearch.focus();
    }
    if (event.key === 'Escape' && active === filterSearch) {
      filterSearch.value = '';
      render();
      filterSearch.blur();
    }
  });
  inputs.dueDate.min = OrbitApp.todayISO();
  updateNotesCounter();
  render();
})();
