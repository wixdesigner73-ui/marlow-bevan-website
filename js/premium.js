/* Marlow Bevan — premium motion layer.
   Everything here is progressive: without JS, with reduced motion, or on touch
   devices the site is simply the calm static version. */
(function () {
  var doc = document.documentElement;
  var isStatic = /[?&]static/.test(location.search);
  var reduce = isStatic || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var wide = window.matchMedia('(min-width: 900px)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Intro (once per session) ---------- */
  var intro = $('#intro');
  function finishIntro() {
    doc.classList.remove('is-intro');
    document.dispatchEvent(new Event('mb:intro-done'));
  }
  if (doc.classList.contains('is-intro') && intro && !reduce && !location.hash) {
    try { sessionStorage.setItem('mbIntro', '1'); } catch (e) {}
    setTimeout(function () { intro.classList.add('is-done'); finishIntro(); }, 2300);
    setTimeout(function () { intro.classList.add('is-gone'); }, 3700);
  } else {
    if (intro) intro.classList.add('is-gone');
    if (doc.classList.contains('is-intro')) finishIntro();
  }

  /* ---------- Split-text headlines ---------- */
  var counter;
  function splitNode(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span'); w.className = 'w';
          var i = document.createElement('span'); i.className = 'wi'; i.style.setProperty('--i', counter++);
          i.textContent = part; w.appendChild(i); frag.appendChild(w);
        });
        node.replaceChild(frag, n);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') {
        splitNode(n);
      }
    });
  }
  $$('.display[data-reveal], .lede[data-reveal], .intro[data-reveal]').forEach(function (el) {
    if (el.matches('.sr')) return;
    counter = 0;
    el.setAttribute('data-split', '');
    el.removeAttribute('data-reveal');   /* the observer in site.js still tracks this node and adds .in */
    splitNode(el);
  });
  /* the observer keeps its own node list; make sure split nodes are watched even when gated */
  if (!('IntersectionObserver' in window) || reduce) $$('[data-split]').forEach(function (e) { e.classList.add('in'); });

  /* ---------- Scroll progress + parallax (uses `translate`, so it never fights reveal transforms) ---------- */
  var bar = $('#progress');
  $$('.gal .frame:not(.panel) img, .s .frame:not(.panel) img').forEach(function (img) {
    img.classList.add('pimg'); img.parentElement.classList.add('pimg');
    img.dataset.par = img.dataset.par || '26';
  });
  var pars = $$('[data-par]');
  var parOn = !reduce && fine && wide;
  var ticking = false;
  function frame() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + Math.min(1, y / Math.max(1, doc.scrollHeight - vh)) + ')';
    if (!parOn) return;
    pars.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -150 || r.top > vh + 150) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.translate = '0 ' + (p * -(parseFloat(el.dataset.par) || 30)).toFixed(1) + 'px';
    });
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  frame();

  /* ---------- Smooth scrolling (desktop only) ---------- */
  var lenis;
  if (window.Lenis && fine && !reduce) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
    window.__lenis = lenis;
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href*="#"]');
      if (!a) return;
      var u = new URL(a.href, location.href);
      if (u.pathname !== location.pathname || !u.hash || u.hash === '#') return;
      var t = document.getElementById(u.hash.slice(1));
      if (!t) return;
      e.preventDefault();
      lenis.scrollTo(t, { offset: -64, duration: 1.6, easing: function (x) { return 1 - Math.pow(1 - x, 4); } });
    });
  }

  /* ---------- Page transitions ---------- */
  var curtain = $('#curtain');
  if (doc.classList.contains('nav-in') && curtain) {
    requestAnimationFrame(function () { requestAnimationFrame(function () { curtain.classList.add('is-off'); }); });
    setTimeout(function () { doc.classList.remove('nav-in'); curtain.classList.remove('is-off'); }, 1300);
  }
  window.addEventListener('pageshow', function (e) { if (e.persisted && curtain) curtain.classList.remove('is-on'); });
  if (curtain && !reduce) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
      if (u.origin !== location.origin && u.protocol !== 'file:') return;
      if (u.protocol === 'file:' && u.pathname === location.pathname) return;
      if (u.pathname === location.pathname) return;
      e.preventDefault();
      try { sessionStorage.setItem('mbNav', '1'); } catch (x) {}
      if (lenis) lenis.stop();
      curtain.classList.add('is-on');
      setTimeout(function () { location.href = a.href; }, 760);
    });
  }

  /* ---------- Custom cursor ---------- */
  if (fine && !reduce) {
    var cur = document.createElement('div');
    cur.className = 'cursor is-hidden';
    cur.innerHTML = '<span class="ring"></span><span class="dot"></span>';
    document.body.appendChild(cur);
    doc.classList.add('has-cursor');
    var ring = cur.querySelector('.ring'), dot = cur.querySelector('.dot');
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY; cur.classList.remove('is-hidden');
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      var t = e.target;
      cur.classList.toggle('is-link', !!(t.closest && t.closest('a,button,input,.menu-btn')));
      cur.classList.toggle('is-view', !!(t.closest && t.closest('.frame, [data-tilt]') && !(t.closest('a,button'))));
    }, { passive: true });
    document.addEventListener('pointerdown', function () { cur.classList.add('is-down'); });
    document.addEventListener('pointerup', function () { cur.classList.remove('is-down'); });
    document.documentElement.addEventListener('pointerleave', function () { cur.classList.add('is-hidden'); });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- 3D tilt on the book renders ---------- */
  if (fine && !reduce && wide) {
    $$('[data-tilt]').forEach(function (el) {
      var g = document.createElement('span'); g.className = 'glare'; el.appendChild(g);
      var raf = 0;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          el.classList.add('is-tilting');
          el.style.transform = 'perspective(1100px) rotateY(' + ((px - .5) * 12).toFixed(2) + 'deg) rotateX(' + ((.5 - py) * 9).toFixed(2) + 'deg) scale3d(1.015,1.015,1.015)';
          g.style.setProperty('--gx', (px * 100) + '%'); g.style.setProperty('--gy', (py * 100) + '%');
        });
      });
      el.addEventListener('pointerleave', function () {
        cancelAnimationFrame(raf); el.classList.remove('is-tilting'); el.style.transform = '';
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine && !reduce) {
    $$('.btn').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .12).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .22).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
    $$('.btn').forEach(function (b) { b.style.transition += ',transform .5s cubic-bezier(.22,.7,.18,1)'; });
  }
})();
