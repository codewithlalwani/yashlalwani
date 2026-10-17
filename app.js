/* ═══════════════════════════════════════════════════════════════════════════
   Portfolio Interactions — DOM Events, Animations & Visual Enhancements
   Demonstrates: IntersectionObserver, requestAnimationFrame, event delegation,
   custom cursor, scroll-driven effects, and dynamic DOM manipulation.
   ═══════════════════════════════════════════════════════════════════════════ */
document.documentElement.classList.add('js');

/* ─── Scroll Progress Bar ─────────────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
progressBar.setAttribute('aria-hidden', 'true');
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
}, { passive: true });

/* ─── Custom Cursor (desktop only) ────────────────────────────────────── */
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
  document.body.classList.add('custom-cursor');
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx - 4 + 'px';
    dot.style.top = my - 4 + 'px';
  });

  /* Smooth ring chase using requestAnimationFrame */
  (function chase() {
    rx += (mx - rx) * .15;
    ry += (my - ry) * .15;
    ring.style.left = rx - 18 + 'px';
    ring.style.top = ry - 18 + 'px';
    requestAnimationFrame(chase);
  })();

  /* Event delegation for hover state */
  document.addEventListener('pointerover', e => {
    if (e.target.closest('a, button, summary, .featured-card, .credential')) {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    }
  });
  document.addEventListener('pointerout', e => {
    if (e.target.closest('a, button, summary, .featured-card, .credential')) {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    }
  });
}

/* ─── Hero Entrance Animation ─────────────────────────────────────────── */
const heroSection = document.querySelector('.hero');
if (heroSection) heroSection.classList.add('hero-animate');

const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) setTimeout(() => heroVisual.classList.add('float-active'), 1400);

/* ─── Typing Effect on Notes Kicker ───────────────────────────────────── */
const notesKicker = document.querySelector('.notes-kicker');
if (notesKicker) {
  const full = notesKicker.textContent;
  const h = notesKicker.offsetHeight;
  notesKicker.style.minHeight = h + 'px'; // prevent layout shift
  notesKicker.textContent = '';
  notesKicker.style.borderRight = '2px solid var(--dark-muted)';
  let ci = 0;

  function typeNext() {
    if (ci < full.length) {
      notesKicker.textContent += full[ci++];
      setTimeout(typeNext, 28 + Math.random() * 42);
    } else {
      setTimeout(() => { notesKicker.style.borderRight = 'none'; }, 1200);
    }
  }
  setTimeout(typeNext, 1100); // starts after hero visual enters
}

/* ─── Scroll-Triggered Reveal Animations (IntersectionObserver) ────────── */
function addReveals() {
  /* Standalone sections — no stagger */
  document.querySelectorAll(
    '.section-top, .experience-intro, .archive-heading, .education, .contact-heading, .contact-bottom'
  ).forEach(el => el.classList.add('reveal'));

  /* Coding panel — scale entrance */
  document.querySelectorAll('.coding-panel').forEach(el =>
    el.classList.add('reveal', 'from-scale'));

  /* Featured cards — staggered */
  document.querySelectorAll('.featured-card').forEach((el, i) =>
    el.classList.add('reveal', 'stagger-' + (i + 1)));

  /* Timeline items — slide from left */
  document.querySelectorAll('.timeline-item').forEach((el, i) =>
    el.classList.add('reveal', 'from-left', 'stagger-' + Math.min(i + 1, 8)));

  /* Skill rows */
  document.querySelectorAll('.skill-row').forEach((el, i) =>
    el.classList.add('reveal', 'stagger-' + Math.min(i + 1, 8)));

  /* Credentials — stagger in rows of 3 */
  document.querySelectorAll('.credential').forEach((el, i) =>
    el.classList.add('reveal', 'stagger-' + (i % 3 + 1)));

  /* Stats */
  document.querySelectorAll('.stats > div').forEach((el, i) =>
    el.classList.add('reveal', 'stagger-' + (i + 1)));
}
addReveals();

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: .08, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── Stats Counter Animation (requestAnimationFrame + easing) ────────── */
function countUp(el, target, suffix) {
  const dur = 2000, start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3); // cubic ease-out
    el.textContent = Math.floor(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const m = el.textContent.trim().match(/^([\d.]+)(.*)$/);
    if (m) {
      countUp(el, parseFloat(m[1]), m[2]);
      el.parentElement.classList.add('stat-counted');
    }
    statObs.unobserve(el);
  });
}, { threshold: .5 });

document.querySelectorAll('.stats strong').forEach(el => statObs.observe(el));

/* ─── Magnetic Button Effect (mousemove transform) ────────────────────── */
document.querySelectorAll('.hero-actions .button, .nav-contact').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * .18}px, ${y * .18}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

/* ─── 3D Tilt Effect on Featured Cards (perspective transform) ────────── */
document.querySelectorAll('.featured-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'box-shadow .4s ease';
  });
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform =
      `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = '';
    card.style.transform = '';
  });
});

/* ─── Project Filtering (URL state + event listeners) ─────────────────── */
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-category]')];
const count = document.querySelector('#project-count');
const filterNames = new Set(filters.map(b => b.dataset.filter));

function selectCategory(category, updateUrl = false) {
  const selected = filterNames.has(category) ? category : 'All projects';
  for (const b of filters) {
    b.setAttribute('aria-pressed', String(b.dataset.filter === selected));
  }
  let n = 0;
  for (const c of cards) {
    c.hidden = selected !== 'All projects' && c.dataset.category !== selected;
    if (!c.hidden) n++;
  }
  count.textContent = `Showing ${n} ${n === 1 ? 'project' : 'projects'}${
    selected === 'All projects' ? '' : ` in ${selected}`}`;
  if (updateUrl) {
    const url = new URL(location.href);
    if (selected === 'All projects') url.searchParams.delete('category');
    else url.searchParams.set('category', selected);
    // Some browsers restrict History on file:// previews. Filtering still works.
    try { history.replaceState(null, '', url); } catch { /* Local preview. */ }
  }
}

for (const b of filters) {
  b.addEventListener('click', () => selectCategory(b.dataset.filter, true));
}
selectCategory(new URL(location.href).searchParams.get('category'));
addEventListener('popstate', () => {
  selectCategory(new URL(location.href).searchParams.get('category'));
});

/* ─── Mobile Menu (keyboard + click-outside) ──────────────────────────── */
const header = document.querySelector('.header');
const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-navigation');

function setMenu(open) {
  menuBtn.setAttribute('aria-expanded', String(open));
  header.dataset.menuOpen = String(open);
}
menuBtn.addEventListener('click', () => {
  setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
});
nav.addEventListener('click', e => {
  if (e.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuBtn.focus();
  }
});
document.addEventListener('click', e => {
  if (!header.contains(e.target)) setMenu(false);
});

/* ─── Active Nav Section Highlight (IntersectionObserver) ─────────────── */
const navLinks = [...nav.querySelectorAll('a')];
if ('IntersectionObserver' in window) {
  const secObs = new IntersectionObserver(entries => {
    const vis = entries.filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (!vis.length) return;
    for (const l of navLinks) {
      if (l.hash === `#${vis[0].target.id}`) l.setAttribute('aria-current', 'location');
      else l.removeAttribute('aria-current');
    }
  }, { rootMargin: '-15% 0px -60% 0px' });
  for (const s of document.querySelectorAll('main section[id]')) secObs.observe(s);
}
