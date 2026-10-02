/* Marlow Bevan — bokeh lights + gallery carousel */
(function () {
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Bokeh: soft gold lights (echoing the string lights on the cover) */
  $$('.bokeh').forEach(function (box) {
    var n = window.innerWidth < 700 ? 9 : 18, seed = 7;
    var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span'), size = 26 + rnd() * 90;
      s.style.cssText = 'left:' + (rnd() * 100).toFixed(1) + '%;top:' + (20 + rnd() * 75).toFixed(1) + '%;width:' + size.toFixed(0) + 'px;height:' + size.toFixed(0) + 'px;' +
        '--t:' + (11 + rnd() * 12).toFixed(1) + 's;--dl:-' + (rnd() * 14).toFixed(1) + 's;--o:' + (.25 + rnd() * .5).toFixed(2) + ';--dx:' + ((rnd() - .5) * 80).toFixed(0) + 'px';
      box.appendChild(s);
    }
  });

  /* Carousel */
  $$('.car').forEach(function (car) {
    var track = car.querySelector('.car-track'), slides = $$('.slide', track), dotsBox = car.querySelector('.dots');
    var dots = slides.map(function (_, i) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Slide ' + (i + 1));
      b.addEventListener('click', function () { go(i, true); }); dotsBox.appendChild(b); return b;
    });
    var cur = 0, timer, paused = false;
    function pos(i) { return slides[i].offsetLeft - track.offsetLeft; }
    function go(i, user) {
      cur = (i + slides.length) % slides.length;
      track.scrollTo({ left: pos(cur), behavior: reduce ? 'auto' : 'smooth' });
      if (user) restart();
    }
    function mark() {
      var best = 0, d = 1e9;
      slides.forEach(function (s, i) { var x = Math.abs(pos(i) - track.scrollLeft); if (x < d) { d = x; best = i; } });
      cur = best; dots.forEach(function (b, i) { b.classList.toggle('on', i === best); });
    }
    track.addEventListener('scroll', function () { requestAnimationFrame(mark); }, { passive: true });
    car.querySelectorAll('[data-dir]').forEach(function (b) { b.addEventListener('click', function () { go(cur + (+b.dataset.dir), true); }); });
    function restart() { clearInterval(timer); if (reduce) return; timer = setInterval(function () { if (!paused) go(cur + 1); }, 3800); }
    ['pointerenter', 'focusin', 'touchstart'].forEach(function (e) { car.addEventListener(e, function () { paused = true; }, { passive: true }); });
    ['pointerleave', 'focusout', 'touchend'].forEach(function (e) { car.addEventListener(e, function () { paused = false; }, { passive: true }); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { paused = !en[0].isIntersecting; }).observe(car);
    mark(); restart();
  });
})();
