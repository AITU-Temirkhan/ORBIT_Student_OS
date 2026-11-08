/* Three distinct, purposeful jQuery effects: accordion, feedback fade, smooth scroll. */
(function () {
  'use strict';
  function setup() {
    if (!window.jQuery) return;
    const $ = window.jQuery;
    $('.tips-panel').each(function () { this.hidden = false; $(this).hide(); });

    $(document).on('click', '.js-tips-toggle', function () {
      const control = $(this);
      const panel = $('#' + control.attr('aria-controls'));
      const isOpening = control.attr('aria-expanded') !== 'true';
      control.attr('aria-expanded', String(isOpening));
      panel.stop(true, true).slideToggle(220);
    });

    $(document).on('click', '.js-smooth-scroll', function (event) {
      const id = $(this).attr('data-target');
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      const distance = Math.max(0, $(target).offset().top - 28);
      $('html, body').stop(true).animate({ scrollTop: distance }, 420);
    });
  }
  function toast(message, type) {
    const el = document.getElementById('globalToast');
    if (!el) return;
    const variant = type === 'error' ? 'toast-error' : 'toast-success';
    el.hidden = false;
    el.className = 'global-toast ' + variant;
    el.textContent = message;
    if (window.jQuery) {
      window.jQuery(el).stop(true, true).hide().fadeIn(180).delay(2600).fadeOut(350);
    } else {
      el.hidden = false;
      setTimeout(() => { el.hidden = true; }, 2800);
    }
  }
  document.addEventListener('DOMContentLoaded', setup);
  window.OrbitEffects = { toast };
})();
