(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────────
     Dark / light mode
  ────────────────────────────────────────── */
  var html        = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var themeIcon   = document.getElementById('themeIcon');
  var themeLabel  = document.getElementById('themeLabel');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      themeIcon.className = 'fas fa-sun';
      themeLabel.textContent = 'Light Mode';
    } else {
      themeIcon.className = 'fas fa-moon';
      themeLabel.textContent = 'Dark Mode';
    }
  }

  applyTheme(html.getAttribute('data-theme') || 'dark');

  themeToggle.addEventListener('click', function () {
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });


  /* ──────────────────────────────────────────
     Mobile nav toggle
  ────────────────────────────────────────── */
  var navToggle  = document.getElementById('navToggle');
  var sidebarNav = document.getElementById('sidebarNav');

  navToggle.addEventListener('click', function () {
    var open = sidebarNav.classList.toggle('open');
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

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

  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  document.querySelectorAll('section[id]').forEach(function (section) {
    spy.observe(section);
  });


  /* ──────────────────────────────────────────
     Typing rotator
  ────────────────────────────────────────── */
  var typed = document.getElementById('typed');
  if (typed) {
    var phrases = [
      ' Lead Developer @ HosTalky',
      ' React Native Engineer',
      ' Full-Stack Developer',
      ' iOS / Swift Developer',
      ' TypeScript Enthusiast'
    ];

    if (prefersReduced) {
      typed.textContent = phrases[0];
    } else {
      var pi = 0, ci = 0, deleting = false;

      function tick() {
        var word = phrases[pi];
        typed.textContent = word.substring(0, ci);

        if (!deleting && ci < word.length) {
          ci++;
          setTimeout(tick, 65);
        } else if (!deleting && ci === word.length) {
          deleting = true;
          setTimeout(tick, 1800);
        } else if (deleting && ci > 0) {
          ci--;
          setTimeout(tick, 30);
        } else {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(tick, 350);
        }
      }
      tick();
    }
  }


  /* ──────────────────────────────────────────
     Scroll reveal
  ────────────────────────────────────────── */
  // Auto-tag timeline items so they reveal too
  document.querySelectorAll('.timeline-item').forEach(function (el) {
    el.classList.add('reveal');
  });

  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  } else {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealEls.forEach(function (el) { revealObs.observe(el); });
  }


  /* ──────────────────────────────────────────
     Live duration for the current ("Present") role
  ────────────────────────────────────────── */
  function fmtDuration(months) {
    var y = Math.floor(months / 12), m = months % 12, out = [];
    if (y) out.push(y + (y === 1 ? ' yr' : ' yrs'));
    if (m) out.push(m + (m === 1 ? ' mo' : ' mos'));
    return out.join(' ') || '0 mos';
  }
  document.querySelectorAll('.timeline-dur[data-start]').forEach(function (el) {
    var parts = (el.getAttribute('data-start') || '').split('-');
    if (parts.length !== 2) return;
    var sy = +parts[0], sm = +parts[1], now = new Date();
    // Inclusive of both the start and current month (LinkedIn style)
    var months = (now.getFullYear() - sy) * 12 + (now.getMonth() + 1 - sm) + 1;
    if (months > 0) el.textContent = fmtDuration(months);
  });


  /* ──────────────────────────────────────────
     Bento / pointer glow tracking
  ────────────────────────────────────────── */
  if (!prefersReduced) {
    document.querySelectorAll('.bento').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

})();
