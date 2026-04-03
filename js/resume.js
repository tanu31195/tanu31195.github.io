(function () {
  'use strict';

  /* ──────────────────────────────────────────
     Dark / light mode
  ────────────────────────────────────────── */
  const html        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');
  const themeLabel  = document.getElementById('themeLabel');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      themeIcon.className  = 'fas fa-sun';
      themeLabel.textContent = 'Light Mode';
    } else {
      themeIcon.className  = 'fas fa-moon';
      themeLabel.textContent = 'Dark Mode';
    }
  }

  // Sync button state with whatever theme was set by the anti-FOUC script
  applyTheme(html.getAttribute('data-theme') || 'light');

  themeToggle.addEventListener('click', function () {
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });


  /* ──────────────────────────────────────────
     Mobile nav toggle
  ────────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const sidebarNav = document.getElementById('sidebarNav');

  navToggle.addEventListener('click', function () {
    var open = sidebarNav.classList.toggle('open');
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // Close mobile nav when any nav link is clicked
  document.querySelectorAll('#sidebarNav .nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      sidebarNav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });


  /* ──────────────────────────────────────────
     ScrollSpy via IntersectionObserver
  ────────────────────────────────────────── */
  var navLinks = document.querySelectorAll('#sidebarNav .nav-link');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          var active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', active);
        });
      }
    });
  }, {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0
  });

  document.querySelectorAll('section[id]').forEach(function (section) {
    observer.observe(section);
  });

})();
