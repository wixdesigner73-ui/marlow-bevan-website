/* Marlow Bevan — restrained motion + small interactions */
(function () {
  var doc = document.documentElement;
  if (/[?&]static/.test(location.search)) doc.classList.add('static');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]static/.test(location.search);

  /* Header: solid after scroll; "light" variant over dark heroes */
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('[data-hero]');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-solid', y > 40 && !(hero && hero.dataset.hero === 'dark' && y < hero.offsetHeight - 80));
    if (hero && hero.dataset.hero === 'dark') {
      header.classList.toggle('is-light', y < hero.offsetHeight - 80);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile / tablet menu */
  var overlay = document.getElementById('overlay');
  var openBtn = document.querySelector('.menu-btn');
  var closeBtn = document.querySelector('.overlay-close');
  function setMenu(open) {
    overlay.classList.toggle('is-open', open);
    openBtn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (window.__lenis) { open ? window.__lenis.stop() : window.__lenis.start(); }
    if (open) closeBtn.focus(); else openBtn.focus();
  }
  if (overlay) {
    openBtn.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    overlay.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* Reveals */
  var targets = document.querySelectorAll('[data-reveal],[data-img],[data-write]');
  function startReveals() {
    if ('IntersectionObserver' in window && !reduce) {
      /* Elements hidden with their own clip-path report zero area to IntersectionObserver,
         so for those we observe the parent and reveal the child from there. */
      var groups = new Map();
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          (groups.get(en.target) || []).forEach(function (c) { c.classList.add('in'); });
          io.unobserve(en.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
      targets.forEach(function (t) {
        var clipped = t.hasAttribute('data-img') || t.hasAttribute('data-write');
        var host = clipped ? t.parentElement : t;
        if (!groups.has(host)) { groups.set(host, []); io.observe(host); }
        groups.get(host).push(t);
      });
    } else {
      targets.forEach(function (t) { t.classList.add('in'); });
    }
  }
  if (doc.classList.contains('is-intro')) document.addEventListener('mb:intro-done', startReveals, { once: true });
  else startReveals();

  /* Newsletter forms.
     Set data-endpoint on a form to post to a real mailing-list service.
     In Wix, replace these forms with the native Subscribe Form / Wix Forms element. */
  document.querySelectorAll('form[data-signup]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.parentElement.querySelector('.form-note');
      var email = form.querySelector('input[type=email]');
      if (!email.checkValidity()) { note.textContent = 'Please enter a valid email address.'; email.focus(); return; }
      var endpoint = form.dataset.endpoint;
      var done = function () { note.textContent = 'Thank you — you’re on the list.'; form.reset(); };
      if (!endpoint) { console.warn('Newsletter form has no data-endpoint; nothing was sent.'); return done(); }
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.value }) })
        .then(function (r) { if (!r.ok) throw 0; done(); })
        .catch(function () { note.textContent = 'Something went wrong. Please try again.'; });
    });
  });

  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
