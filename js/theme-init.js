/* Apply saved theme before the first paint to avoid flashing between modes. */
(function () {
  'use strict';
  let mode = 'dark';
  try { mode = localStorage.getItem('orbit.theme.v1') === 'light' ? 'light' : 'dark'; } catch (_) { /* Private mode: use dark. */ }
  document.documentElement.dataset.theme = mode;
})();
