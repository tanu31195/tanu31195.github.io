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


  /* ──────────────────────────────────────────
     Cursor spotlight
  ────────────────────────────────────────── */
  var glow = document.getElementById('cursorGlow');
  var fancyPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (glow && fancyPointer && !prefersReduced) {
    var glowRaf = null;
    document.addEventListener('pointermove', function (e) {
      if (glowRaf) return;
      glowRaf = requestAnimationFrame(function () {
        glow.style.background =
          'radial-gradient(560px at ' + e.clientX + 'px ' + e.clientY + 'px, rgba(81,252,0,0.055), transparent 65%)';
        glow.classList.add('on');
        glowRaf = null;
      });
    });
  }


  /* ──────────────────────────────────────────
     3D tilt on project cards
  ────────────────────────────────────────── */
  if (fancyPointer && !prefersReduced) {
    document.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
        card.classList.add('tilting');
        card.style.transform =
          'perspective(800px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-6px)';
      });
      card.addEventListener('pointerleave', function () {
        card.classList.remove('tilting');
        card.style.transform = '';
      });
    });
  }


  /* ──────────────────────────────────────────
     Section title scramble decode
  ────────────────────────────────────────── */
  var GLYPHS = '!<>-_\\/[]{}=+*^?#@$%&';

  function scramble(el) {
    if (prefersReduced || el.dataset.decoded) return;
    el.dataset.decoded = '1';
    var target = el.textContent;
    var frame = 0;
    var total = Math.max(18, target.length * 3);
    el.classList.add('decoding');

    (function step() {
      var out = '';
      for (var i = 0; i < target.length; i++) {
        var reveal = (frame / total) * target.length * 1.4;
        if (i < reveal) out += target[i];
        else if (target[i] === ' ') out += ' ';
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      el.textContent = out;
      frame++;
      if (out !== target) requestAnimationFrame(step);
      else el.classList.remove('decoding');
    })();
  }

  if ('IntersectionObserver' in window) {
    var scrambleObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          scramble(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('.section-title').forEach(function (el) { scrambleObs.observe(el); });
  }


  /* ──────────────────────────────────────────
     Matrix rain
  ────────────────────────────────────────── */
  var matrixCanvas = document.getElementById('matrixCanvas');
  var matrixTimer = null;

  function matrixStop() {
    if (!matrixTimer) return;
    clearInterval(matrixTimer);
    matrixTimer = null;
    matrixCanvas.classList.remove('on');
  }

  var CHARS = 'アイウエオカキクケコサシスセソタチツテト01<>{}=/+*#$';
  var fs = 16, drops = [];

  function matrixResize() {
    if (!matrixCanvas) return;
    // Match the drawing buffer to the element's real rendered size (handles
    // mobile viewport / URL-bar quirks better than window.innerHeight).
    var w = matrixCanvas.clientWidth || window.innerWidth;
    var h = matrixCanvas.clientHeight || window.innerHeight;
    matrixCanvas.width = w;
    matrixCanvas.height = h;
    var cols = Math.ceil(w / fs);
    drops = [];
    for (var i = 0; i < cols; i++) drops.push(Math.floor(Math.random() * (h / fs)));
  }

  function matrixStart() {
    if (prefersReduced || !matrixCanvas || matrixTimer) return;
    var ctx = matrixCanvas.getContext('2d');
    matrixCanvas.classList.add('on');
    matrixResize();
    ctx.fillStyle = 'rgba(3, 8, 4, 1)';
    ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    matrixTimer = setInterval(function () {
      ctx.fillStyle = 'rgba(3, 8, 4, 0.08)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      ctx.font = fs + 'px monospace';
      for (var i = 0; i < drops.length; i++) {
        var ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = Math.random() > 0.975 ? '#9be85a' : '#2f7a12';
        ctx.fillText(ch, i * fs, drops[i] * fs);
        if (drops[i] * fs > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }, 50);
  }

  if (matrixCanvas) {
    matrixCanvas.addEventListener('click', matrixStop);
    window.addEventListener('resize', function () { if (matrixTimer) matrixResize(); });
    window.addEventListener('orientationchange', function () { if (matrixTimer) setTimeout(matrixResize, 200); });
  }

  // Konami code → matrix rain
  var KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var kIdx = 0;
  document.addEventListener('keydown', function (e) {
    kIdx = (e.key === KONAMI[kIdx]) ? kIdx + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (kIdx === KONAMI.length) { kIdx = 0; matrixStart(); }
  });


  /* ──────────────────────────────────────────
     Interactive terminal
  ────────────────────────────────────────── */
  var term      = document.getElementById('terminal');
  var termOut   = document.getElementById('termOut');
  var termInput = document.getElementById('termInput');
  var termHint  = document.getElementById('termHint');
  var termClose = document.getElementById('termClose');
  var termHistory = [];
  var termHistIdx = -1;
  var termBooted = false;

  function tPrint(html, cls) {
    var div = document.createElement('div');
    if (cls) div.className = cls;
    div.innerHTML = html;
    termOut.appendChild(div);
    termOut.scrollTop = termOut.scrollHeight;
  }

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var COMMANDS = {
    help: function () {
      tPrint('<span class="t-head">Available commands</span>\n' +
        '  <span class="t-hi">whoami</span>      who is this guy\n' +
        '  <span class="t-hi">experience</span>  work history\n' +
        '  <span class="t-hi">skills</span>      tech stack\n' +
        '  <span class="t-hi">projects</span>    things I built\n' +
        '  <span class="t-hi">contact</span>     get in touch\n' +
        '  <span class="t-hi">cv</span>          download my resume\n' +
        '  <span class="t-hi">theme</span>       toggle light/dark\n' +
        '  <span class="t-hi">matrix</span>      follow the white rabbit\n' +
        '  <span class="t-hi">clear</span>       clear the screen\n' +
        '  <span class="t-hi">exit</span>        close terminal');
    },
    whoami: function () {
      tPrint('<span class="t-head">Tanushka Bandara</span> — Lead Developer, Software Engineering @ HosTalky\n' +
        '<span class="t-dim">Colombo, Sri Lanka · 8+ years building web &amp; mobile apps</span>\n' +
        'React Native · TypeScript · iOS · cloud-native solutions');
    },
    experience: function () {
      tPrint('<span class="t-hi">2024—now </span> Lead Developer, Software Engineering · HosTalky\n' +
        '<span class="t-hi">2023—2024</span> Senior Software Engineer · Xinfinit\n' +
        '<span class="t-hi">2021—2023</span> Software Engineer → Senior · Mitra Innovation\n' +
        '<span class="t-hi">2018—2021</span> Trainee → Associate → Software Engineer · CodeGen\n' +
        '<span class="t-dim">type</span> <span class="t-hi">exit</span> <span class="t-dim">and scroll to Experience for the full timeline</span>');
    },
    skills: function () {
      tPrint('<span class="t-head">Languages</span>   JavaScript · TypeScript · Swift · Java\n' +
        '<span class="t-head">Frameworks</span>  React Native · React · Node.js\n' +
        '<span class="t-head">Platforms</span>   iOS · Android · Firebase · GCP · Docker · MySQL\n' +
        '<span class="t-head">Practices</span>   Agile · Design Patterns · REST · CI/CD');
    },
    projects: function () {
      tPrint('<span class="t-head">CoachDesk HQ</span> — gym management app (React Native · iOS)\n' +
        '  <a href="https://apps.apple.com/us/app/coachdesk-hq/id6761045494" target="_blank" rel="noopener">App Store ↗</a>\n' +
        '<span class="t-head">More</span> — open-source work &amp; experiments\n' +
        '  <a href="https://github.com/tanu31195" target="_blank" rel="noopener">github.com/tanu31195 ↗</a>');
    },
    contact: function () {
      tPrint('email     <a href="mailto:tanushkabandara@gmail.com">tanushkabandara@gmail.com</a>\n' +
        'linkedin  <a href="https://www.linkedin.com/in/tanushka-bandara" target="_blank" rel="noopener">in/tanushka-bandara ↗</a>\n' +
        'github    <a href="https://github.com/tanu31195" target="_blank" rel="noopener">tanu31195 ↗</a>');
    },
    cv: function () {
      tPrint('<span class="t-dim">opening resume…</span>');
      window.open('img/Resume.pdf', '_blank');
    },
    theme: function () {
      themeToggle.click();
      tPrint('<span class="t-dim">theme switched to ' + html.getAttribute('data-theme') + '</span>');
    },
    matrix: function () {
      tPrint('<span class="t-hi">wake up, neo…</span> <span class="t-dim">(click anywhere to exit)</span>');
      setTimeout(function () { termHide(); matrixStart(); }, 600);
    },
    clear: function () { termOut.innerHTML = ''; },
    exit: function () { termHide(); },
    sudo: function (args) {
      if (args === 'hire') {
        tPrint('<span class="t-hi">✔ permission granted.</span> <a href="mailto:tanushkabandara@gmail.com">tanushkabandara@gmail.com</a> — let’s talk.');
      } else {
        tPrint('<span class="t-dim">user is not in the sudoers file. this incident will be reported.</span>');
      }
    }
  };
  COMMANDS.resume = COMMANDS.cv;
  COMMANDS.work = COMMANDS.experience;
  COMMANDS.about = COMMANDS.whoami;
  COMMANDS.email = COMMANDS.contact;
  COMMANDS.ls = function () { tPrint('about  experience  skills  projects  contact  cv'); };

  function termRun(raw) {
    var line = raw.trim();
    tPrint('<span class="t-dim">❯</span> <span class="t-cmd">' + esc(line) + '</span>');
    if (!line) return;
    termHistory.push(line);
    termHistIdx = termHistory.length;
    var parts = line.split(/\s+/);
    var cmd = parts[0].toLowerCase();
    var args = parts.slice(1).join(' ');
    if (COMMANDS[cmd]) COMMANDS[cmd](args);
    else tPrint('<span class="t-dim">command not found: ' + esc(cmd) + ' — try</span> <span class="t-hi">help</span>');
  }

  function termShow() {
    term.hidden = false;
    if (!termBooted) {
      termBooted = true;
      tPrint('<span class="t-dim">[ok] portfolio shell v2.0 — connected as</span> <span class="t-hi">guest</span>');
      tPrint('<span class="t-dim">type</span> <span class="t-hi">help</span> <span class="t-dim">to get started</span>');
    }
    setTimeout(function () { termInput.focus(); }, 50);
  }

  function termHide() {
    term.hidden = true;
    termHint.focus();
  }

  termHint.addEventListener('click', termShow);
  termClose.addEventListener('click', termHide);
  term.addEventListener('click', function (e) { if (e.target === term) termHide(); });

  termInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      termRun(termInput.value);
      termInput.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (termHistIdx > 0) termInput.value = termHistory[--termHistIdx] || '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (termHistIdx < termHistory.length) termInput.value = termHistory[++termHistIdx] || '';
    }
  });

  document.addEventListener('keydown', function (e) {
    var typing = /^(input|textarea|select)$/i.test((e.target.tagName || ''));
    if (e.key === '/' && !typing && term.hidden) {
      e.preventDefault();
      termShow();
    } else if (e.key === 'Escape') {
      if (!term.hidden) termHide();
      matrixStop();
    }
  });


  /* ──────────────────────────────────────────
     Tab-away title
  ────────────────────────────────────────── */
  var realTitle = document.title;
  document.addEventListener('visibilitychange', function () {
    document.title = document.hidden ? '⚠ connection idle — tanushka@portfolio' : realTitle;
  });

})();
