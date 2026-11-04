/* Future Right — Home v1. Vanilla JS for interactions only. No network calls. */
(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var navToggle = nav.querySelector('.nav__toggle');
  var navMenu = document.getElementById('nav-menu');

  /* ---------- Mobile nav ---------- */
  var navClose = document.getElementById('nav-close');
  var navBackdrop = document.getElementById('nav-backdrop');
  function setNav(open) {
    nav.classList.toggle('nav--open', open);
    document.body.classList.toggle('nav-lock', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open && navClose) navClose.focus();
    if (!open) navToggle.focus();
  }
  navToggle.addEventListener('click', function () {
    setNav(!nav.classList.contains('nav--open'));
  });
  if (navClose) navClose.addEventListener('click', function () { setNav(false); });
  if (navBackdrop) navBackdrop.addEventListener('click', function () { setNav(false); });
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

  function scrollByCard(dir) {
    var step = cards[0].offsetWidth + 20;
    track.scrollBy({ left: step * dir, behavior: 'smooth' });
  }
  var prevBtn = document.getElementById('reviews-prev');
  var nextBtn = document.getElementById('reviews-next');
  if (prevBtn) prevBtn.addEventListener('click', function () { scrollByCard(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { scrollByCard(1); });

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

  /* ---------- Booking calendar: dummy flow, no network ----------
     Day -> time -> name/email -> confirmation. Availability is generated, not real. */
  (function () {
    var cal = document.getElementById('booking-cal');
    if (!cal) return;
    var daysEl = document.getElementById('cal-days');
    var labelEl = document.getElementById('cal-label');
    var prevBtn = document.getElementById('cal-prev');
    var nextBtn = document.getElementById('cal-next');
    var stepTime = document.getElementById('cal-step-time');
    var dayLabel = document.getElementById('cal-day-label');
    var slotsEl = document.getElementById('cal-slots');
    var form = document.getElementById('cal-form');
    var summary = document.getElementById('cal-summary');
    var nameEl = document.getElementById('cal-name');
    var emailEl = document.getElementById('cal-email');
    var changeBtn = document.getElementById('cal-change');
    var done = document.getElementById('cal-done');
    var doneText = document.getElementById('cal-done-text');
    var doneEmail = document.getElementById('cal-done-email');
    var resetBtn = document.getElementById('cal-reset');

    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var DOWS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var SLOTS = ['9:00 am', '10:30 am', '1:00 pm', '2:30 pm', '4:00 pm', '5:30 pm'];

    var today = new Date(); today.setHours(0, 0, 0, 0);
    var minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    var maxMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    var view = new Date(minMonth);
    var picked = { date: null, slot: null };

    function isAvailable(d) {
      if (d < today) return false;
      var dow = d.getDay();
      if (dow === 0 || dow === 6) return false;              // weekends off
      return ((d.getDate() * 7 + d.getMonth()) % 5) !== 0;   // a few weekdays "fully booked" for realism
    }
    function fmtDay(d) { return DOWS[d.getDay()] + ', ' + d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3); }
    function sameDay(a, b) { return a && b && a.getTime() === b.getTime(); }

    function renderMonth() {
      labelEl.innerHTML = '<svg class="icon" aria-hidden="true" style="vertical-align:-3px;margin-right:6px"><use href="#i-calendar"/></svg>' + MONTHS[view.getMonth()] + ' ' + view.getFullYear();
      Array.prototype.slice.call(daysEl.querySelectorAll('.booking__day, .booking__pad')).forEach(function (n) { n.remove(); });
      var first = new Date(view.getFullYear(), view.getMonth(), 1);
      var pad = (first.getDay() + 6) % 7; // Monday-first
      for (var p = 0; p < pad; p++) { var s = document.createElement('span'); s.className = 'booking__pad'; daysEl.appendChild(s); }
      var days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      for (var i = 1; i <= days; i++) {
        var d = new Date(view.getFullYear(), view.getMonth(), i);
        var b = document.createElement('button');
        b.type = 'button'; b.textContent = String(i); b.className = 'booking__day';
        var avail = isAvailable(d);
        if (avail) { b.classList.add('booking__day--avail'); } else { b.disabled = true; }
        if (sameDay(d, today)) b.classList.add('booking__day--today');
        b.setAttribute('aria-pressed', sameDay(d, picked.date) ? 'true' : 'false');
        b.setAttribute('aria-label', fmtDay(d) + (avail ? '' : ', unavailable'));
        (function (date) { b.addEventListener('click', function () { pickDay(date); }); })(d);
        daysEl.appendChild(b);
      }
      prevBtn.disabled = view <= minMonth;
      nextBtn.disabled = view >= maxMonth;
    }

    function pickDay(date) {
      picked.date = date; picked.slot = null;
      Array.prototype.forEach.call(daysEl.querySelectorAll('.booking__day'), function (b) {
        b.setAttribute('aria-pressed', b.textContent === String(date.getDate()) ? 'true' : 'false');
      });
      dayLabel.textContent = fmtDay(date);
      slotsEl.innerHTML = '';
      SLOTS.forEach(function (t, idx) {
        if (((date.getDate() + idx) % 4) === 0) return; // hide a slot or two per day
        var s = document.createElement('button');
        s.type = 'button'; s.className = 'booking__slot'; s.textContent = t; s.setAttribute('aria-pressed', 'false');
        s.addEventListener('click', function () { pickSlot(t, s); });
        slotsEl.appendChild(s);
      });
      stepTime.hidden = false; form.hidden = true; done.hidden = true;
    }

    function pickSlot(t, btn) {
      picked.slot = t;
      Array.prototype.forEach.call(slotsEl.children, function (c) { c.setAttribute('aria-pressed', c === btn ? 'true' : 'false'); });
      summary.textContent = fmtDay(picked.date) + ' at ' + t;
      form.hidden = false;
      nameEl.focus();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      if (!nameEl.value.trim()) { nameEl.setAttribute('aria-invalid', 'true'); ok = false; } else { nameEl.removeAttribute('aria-invalid'); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) { emailEl.setAttribute('aria-invalid', 'true'); ok = false; } else { emailEl.removeAttribute('aria-invalid'); }
      if (!ok) { (nameEl.getAttribute('aria-invalid') ? nameEl : emailEl).focus(); return; }
      var first = nameEl.value.trim().split(' ')[0];
      doneText.textContent = first + ', your free consultation is set for ' + fmtDay(picked.date) + ' ' + picked.date.getFullYear() + ' at ' + picked.slot + ' PT.';
      doneEmail.textContent = emailEl.value.trim();
      daysEl.hidden = true; stepTime.hidden = true; form.hidden = true; done.hidden = false;
      cal.querySelector('.booking__cal-head').hidden = true;
    });
    [nameEl, emailEl].forEach(function (el) { el.addEventListener('input', function () { el.removeAttribute('aria-invalid'); }); });

    changeBtn.addEventListener('click', function () { form.hidden = true; picked.slot = null; Array.prototype.forEach.call(slotsEl.children, function (c) { c.setAttribute('aria-pressed', 'false'); }); });
    resetBtn.addEventListener('click', function () {
      picked = { date: null, slot: null }; nameEl.value = ''; emailEl.value = '';
      done.hidden = true; daysEl.hidden = false; cal.querySelector('.booking__cal-head').hidden = false;
      renderMonth();
    });
    prevBtn.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderMonth(); });
    nextBtn.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderMonth(); });

    renderMonth();
  })();

  /* ---------- Nav pill: slightly denser after scrolling ---------- */
  var lastY = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY || window.pageYOffset;
    if ((y > 40) !== (lastY > 40)) nav.classList.toggle('nav--scrolled', y > 40);
    lastY = y;
  }, { passive: true });
})();
