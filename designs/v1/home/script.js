/* Future Right — Home v1. Vanilla JS for interactions only. No network calls. */
(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var navToggle = nav.querySelector('.nav__toggle');
  var navMenu = document.getElementById('nav-menu');

  /* ---------- Mobile nav ---------- */
  function setNav(open) {
    nav.classList.toggle('nav--open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  navToggle.addEventListener('click', function () {
    setNav(!nav.classList.contains('nav--open'));
  });
  navMenu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });

  /* ---------- Services dropdown ---------- */
  var dropdown = nav.querySelector('.nav__dropdown');
  var dropBtn = dropdown.querySelector('button');
  function setDrop(open) {
    dropdown.classList.toggle('is-open', open);
    dropBtn.setAttribute('aria-expanded', String(open));
  }
  dropBtn.addEventListener('click', function () {
    setDrop(!dropdown.classList.contains('is-open'));
  });
  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) setDrop(false);
    if (nav.classList.contains('nav--open') && !nav.contains(e.target)) setNav(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setDrop(false); setNav(false); }
  });

  /* ---------- FAQ accordion (one open at a time) ---------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq__item'));
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq__q');
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      faqItems.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Reviews carousel dots ---------- */
  var track = document.getElementById('reviews-track');
  var dots = document.getElementById('reviews-dots');
  var cards = Array.prototype.slice.call(track.querySelectorAll('.review'));
  cards.forEach(function (card, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Review ' + (i + 1) + ' of ' + cards.length);
    b.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    b.addEventListener('click', function () {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    });
    dots.appendChild(b);
  });
  var ticking = false;
  function syncDots() {
    ticking = false;
    var x = track.scrollLeft;
    var best = 0, bestDist = Infinity;
    cards.forEach(function (c, i) {
      var d = Math.abs((c.offsetLeft - track.offsetLeft) - x);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    Array.prototype.forEach.call(dots.children, function (d, i) {
      d.setAttribute('aria-current', i === best ? 'true' : 'false');
    });
  }
  track.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(syncDots); }
  }, { passive: true });

  /* ---------- Sticky CTA: hide while the booking section is on screen ---------- */
  var sticky = document.getElementById('sticky-cta');
  var bookSection = document.getElementById('book');
  if (sticky && bookSection && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      sticky.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(bookSection);
  }

  /* ---------- Guide form: fake submit, no network ---------- */
  var guideForm = document.getElementById('guide-form');
  var guideSection = document.getElementById('guide');
  var guideEmail = document.getElementById('guide-email');
  guideForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = guideEmail.value.trim();
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!ok) {
      guideEmail.setAttribute('aria-invalid', 'true');
      guideEmail.focus();
      guideEmail.style.borderColor = '#cc6333';
      return;
    }
    guideEmail.removeAttribute('aria-invalid');
    guideSection.classList.add('guide--done');
  });
  guideEmail.addEventListener('input', function () {
    guideEmail.style.borderColor = '';
    guideEmail.removeAttribute('aria-invalid');
  });

  /* ---------- Nav pill: slightly denser after scrolling ---------- */
  var lastY = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY || window.pageYOffset;
    if ((y > 40) !== (lastY > 40)) nav.classList.toggle('nav--scrolled', y > 40);
    lastY = y;
  }, { passive: true });
})();
