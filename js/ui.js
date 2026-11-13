/* Shared UI: persistent theme, friendly profile and accessible custom confirmations. */
(function () {
  'use strict';
  const THEME_KEY = 'orbit.theme.v1';
  function theme() { return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'; }
  function applyTheme(mode) {
    const next = mode === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (_) { /* Keep UI functional if storage is blocked. */ }
    const button = document.getElementById('themeToggle');
    if (button) {
      button.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} mode`);
      button.setAttribute('aria-pressed', String(next === 'light'));
      button.querySelector('.theme-symbol').textContent = next === 'dark' ? '☀' : '☾';
      button.querySelector('.theme-copy').textContent = next === 'dark' ? 'Light mode' : 'Dark mode';
    }
  }
  function renderUser() {
    const profile = OrbitStore.getProfile();
    const firstName = profile?.name?.trim().split(/\s+/)[0] || 'Student';
    const userLabel = document.getElementById('workspaceName');
    const avatar = document.getElementById('workspaceAvatar');
    if (userLabel) userLabel.textContent = profile?.name || 'Student workspace';
    if (avatar) avatar.textContent = firstName.charAt(0).toUpperCase();
    const greeting = document.getElementById('greetingName');
    if (greeting) greeting.textContent = profile?.name ? `, ${firstName}` : '';
    const profileStatus = document.getElementById('profileStatus');
    if (profileStatus) profileStatus.textContent = profile?.name ? 'PROFILE SAVED' : 'SET UP YOUR PROFILE';
  }
  let confirmAction = null;
  function closeDialog() { const d = document.getElementById('appConfirmDialog'); if (d?.open) d.close(); }
  function ask(options) {
    const dialog = document.getElementById('appConfirmDialog');
    if (!dialog || typeof dialog.showModal !== 'function') {
      // Safe fallback: no native blocking confirm. Nonessential action is not performed.
      OrbitEffects?.toast?.('Please use a browser supporting dialog elements.', 'error');
      return;
    }
    document.getElementById('confirmTitle').textContent = options.title || 'Please confirm';
    document.getElementById('confirmMessage').textContent = options.message || '';
    document.getElementById('confirmAccept').textContent = options.accept || 'Confirm';
    confirmAction = typeof options.onAccept === 'function' ? options.onAccept : null;
    dialog.showModal();
  }
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(theme());
    renderUser();
    document.getElementById('themeToggle')?.addEventListener('click', () => applyTheme(theme() === 'dark' ? 'light' : 'dark'));
    document.getElementById('confirmCancel')?.addEventListener('click', closeDialog);
    document.getElementById('confirmAccept')?.addEventListener('click', () => { const action = confirmAction; confirmAction = null; closeDialog(); action?.(); });
    document.getElementById('appConfirmDialog')?.addEventListener('close', () => { confirmAction = null; });
    document.getElementById('appConfirmDialog')?.addEventListener('click', event => { if (event.target.id === 'appConfirmDialog') closeDialog(); });
    window.addEventListener('orbit:data-changed', renderUser);
  });
  window.OrbitUI = { ask, theme, applyTheme, renderUser };
})();
