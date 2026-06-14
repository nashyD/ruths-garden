/* Ruth's Garden — interactions */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- Footer year ----- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- Nav: transparent over hero, solid on scroll ----- */
  var nav = document.getElementById('nav');
  function syncNav() {
    if (!nav) return;
    nav.dataset.state = window.scrollY > 60 ? 'scrolled' : 'top';
  }
  syncNav();
  window.addEventListener('scroll', syncNav, { passive: true });

  /* ----- Mobile menu ----- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (menu) menu.setAttribute('aria-hidden', String(!open));
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('menu-open'));
    });
  }
  if (menu) {
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  /* ----- Scroll reveal ----- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          revealIO.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { revealIO.observe(el); });
  }

  /* ----- Scroll spy (active nav link) ----- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  if ('IntersectionObserver' in window && navLinks.length) {
    var sections = navLinks
      .map(function (l) { return document.querySelector(l.getAttribute('href')); })
      .filter(Boolean);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = '#' + en.target.id;
          navLinks.forEach(function (l) {
            l.classList.toggle('is-active', l.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ----- Hero parallax ----- */
  var heroImg = document.querySelector('.hero__media img');
  if (heroImg && !reduceMotion) {
    heroImg.style.transform = 'scale(1.14)';
    heroImg.style.willChange = 'transform';
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight) {
          var offset = Math.min(y * 0.22, window.innerHeight * 0.07);
          heroImg.style.transform = 'translate3d(0,' + offset + 'px,0) scale(1.14)';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ----- Film: click-to-play ----- */
  var frame = document.querySelector('.film__frame');
  if (frame) {
    var video = frame.querySelector('video');
    var playBtn = frame.querySelector('.film__play');
    if (video && playBtn) {
      playBtn.addEventListener('click', function () {
        video.play();
        video.setAttribute('controls', '');
      });
      video.addEventListener('play', function () { frame.classList.add('is-playing'); });
      video.addEventListener('pause', function () { frame.classList.remove('is-playing'); });
    }
  }

  /* ----- Lightbox gallery ----- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
  var lb = document.getElementById('lightbox');
  if (items.length && lb) {
    var lbImg = document.getElementById('lbImg');
    var lbCap = document.getElementById('lbCaption');
    var btnClose = document.getElementById('lbClose');
    var btnPrev = document.getElementById('lbPrev');
    var btnNext = document.getElementById('lbNext');
    var controls = [btnClose, btnPrev, btnNext];
    var idx = 0;
    var lastFocus = null;

    function preload(src) { var i = new Image(); i.src = src; }
    function render(i) {
      idx = (i + items.length) % items.length;
      var it = items[idx];
      var full = it.getAttribute('data-full');
      var img = it.querySelector('img');
      lbImg.src = full;
      lbImg.alt = img ? img.alt : '';
      lbCap.textContent = it.getAttribute('data-caption') || '';
      preload(items[(idx + 1) % items.length].getAttribute('data-full'));
      preload(items[(idx - 1 + items.length) % items.length].getAttribute('data-full'));
    }
    function openLB(i) {
      lastFocus = document.activeElement;
      render(i);
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      btnClose.focus();
    }
    function closeLB() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    items.forEach(function (it, i) {
      it.addEventListener('click', function () { openLB(i); });
    });
    btnClose.addEventListener('click', closeLB);
    btnPrev.addEventListener('click', function () { render(idx - 1); });
    btnNext.addEventListener('click', function () { render(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLB(); });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') { closeLB(); }
      else if (e.key === 'ArrowLeft') { render(idx - 1); }
      else if (e.key === 'ArrowRight') { render(idx + 1); }
      else if (e.key === 'Tab') {
        var i = controls.indexOf(document.activeElement);
        e.preventDefault();
        var next = e.shiftKey ? i - 1 : i + 1;
        controls[(next + controls.length) % controls.length].focus();
      }
    });
  }

  /* ----- Close menu on Escape ----- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false);
  });

  /* ----- JotForm auto-resize (graceful if offline) ----- */
  var jf = document.createElement('script');
  jf.src = 'https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js';
  jf.async = true;
  jf.onload = function () {
    try {
      if (window.jotformEmbedHandler) {
        window.jotformEmbedHandler("iframe[id='JotFormIFrame-232776711477061']", 'https://form.jotform.com');
      }
    } catch (e) {}
  };
  document.body.appendChild(jf);
})();
