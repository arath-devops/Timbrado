(function () {
  const KEY = 'erpgrp-preview-theme';
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    document.querySelectorAll('[data-theme-label]').forEach((el) => {
      el.textContent = theme === 'dark' ? 'Oscuro' : 'Claro';
    });
  }
  function init() {
    const saved = localStorage.getItem(KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    apply(saved || (prefersDark ? 'dark' : 'light'));
  }
  function toggle() {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    apply(cur === 'dark' ? 'light' : 'dark');
  }
  window.ERPTheme = { init, toggle, apply };
})();
