/* Future Right — Home v2. Vanilla JS for interactions only. No network calls. */
(function () {
  'use strict';

  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  var reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  /* ---------- Header: solid once the page scrolls ---------- */
  var nav = document.getElementById('nav');
  function syncNav() { nav.classList.toggle('nav--scrolled', (window.scrollY || window.pageYOffset) > 24); }
  window.addEventListener('scroll', syncNav, { passive: true });
  syncNav();

  /* ---------- Mobile menu drawer ---------- */
  var navToggle = nav.querySelector('.nav__toggle');
  var navMenu = document.getElementById('nav-menu');
  var navClose = document.getElementById('nav-close');
  var navBackdrop = document.getElementById('nav-backdrop');
  function setNav(open, restoreFocus) {
    var wasOpen = nav.classList.contains('nav--open');
    nav.classList.toggle('nav--open', open);
    document.body.classList.toggle('nav-lock', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) navClose.focus();
    if (!open && wasOpen && restoreFocus) navToggle.focus();
  }
  navToggle.addEventListener('click', function () { setNav(!nav.classList.contains('nav--open'), true); });
  navClose.addEventListener('click', function () { setNav(false, true); });
  navBackdrop.addEventListener('click', function () { setNav(false, true); });
  navMenu.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false, false); });

  /* ---------- Services dropdown ---------- */
  var dropdown = nav.querySelector('.nav__dropdown');
  var dropBtn = dropdown.querySelector('button');
  function setDrop(open) {
    dropdown.classList.toggle('is-open', open);
    dropBtn.setAttribute('aria-expanded', String(open));
  }
  dropBtn.addEventListener('click', function () { setDrop(!dropdown.classList.contains('is-open')); });
  document.addEventListener('click', function (e) { if (!dropdown.contains(e.target)) setDrop(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    setDrop(false);
    setNav(false, true);
  });

  /* ---------- Background videos: play in view, pause control, respect reduced motion ---------- */
  qsa('.js-bg-video').forEach(function (video) {
    var btn = document.querySelector('[data-video="' + video.id + '"]');
    var inView = false;
    var userPaused = reduceMotion.matches; // with reduced motion the poster shows until the visitor presses play
    video.muted = true;

    function syncBtn() {
      if (!btn) return;
      btn.classList.toggle('is-paused', video.paused);
      btn.setAttribute('aria-label', video.paused ? 'Play background video' : 'Pause background video');
    }
    function update() {
      if (inView && !userPaused) {
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        video.pause();
      }
    }
    video.addEventListener('play', syncBtn);
    video.addEventListener('pause', syncBtn);
    if (btn) {
      btn.hidden = false;
      btn.addEventListener('click', function () { userPaused = !video.paused; update(); });
    }
    syncBtn();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        update();
      }, { threshold: 0.2 }).observe(video);
    } else {
      inView = true;
      update();
    }
  });

  /* ---------- Client stories carousel ---------- */
  var track = document.getElementById('reviews-track');
  var dots = document.getElementById('reviews-dots');
  var cards = qsa('.review', track);
  function cardLeft(card) { return card.offsetLeft - cards[0].offsetLeft; }
  cards.forEach(function (card, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Review ' + (i + 1) + ' of ' + cards.length);
    b.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    b.addEventListener('click', function () { track.scrollTo({ left: cardLeft(card), behavior: 'smooth' }); });
    dots.appendChild(b);
  });
  var ticking = false;
  function syncDots() {
    ticking = false;
    var x = track.scrollLeft;
    var atEnd = x + track.clientWidth >= track.scrollWidth - 4;
    var best = 0, bestDist = Infinity;
    cards.forEach(function (c, i) {
      var d = Math.abs(cardLeft(c) - x);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    if (atEnd) best = cards.length - 1;
    qsa('button', dots).forEach(function (d, i) { d.setAttribute('aria-current', i === best ? 'true' : 'false'); });
  }
  track.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(syncDots); }
  }, { passive: true });
  function scrollByCard(dir) { track.scrollBy({ left: (cards[1].offsetWidth + 20) * dir, behavior: 'smooth' }); }
  document.getElementById('reviews-prev').addEventListener('click', function () { scrollByCard(-1); });
  document.getElementById('reviews-next').addEventListener('click', function () { scrollByCard(1); });

  /* Drag to scroll with a mouse (touch and trackpads already scroll natively) */
  (function () {
    var DRAG_START = 6;      // px of movement before a press becomes a drag
    var down = false, dragging = false, startX = 0, startScroll = 0, lastX = 0, lastT = 0, velocity = 0;
    var settleTimer = null, suppressClick = false;

    function endSettle() {
      window.clearTimeout(settleTimer);
      track.classList.remove('is-settling');
    }
    function nearestCardLeft(x) {
      var max = track.scrollWidth - track.clientWidth;
      var best = 0, bestDist = Infinity;
      cards.forEach(function (c) {
        var left = Math.min(cardLeft(c), max);
        var d = Math.abs(left - x);
        if (d < bestDist) { bestDist = d; best = left; }
      });
      return best;
    }

    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; dragging = false;
      startX = lastX = e.clientX; lastT = e.timeStamp; velocity = 0;
      startScroll = track.scrollLeft;
    });
    track.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_START) return;
        dragging = true;
        endSettle();
        track.classList.add('is-dragging');
        track.setPointerCapture(e.pointerId);
        var sel = window.getSelection && window.getSelection();
        if (sel && sel.removeAllRanges) sel.removeAllRanges();
      }
      var dt = e.timeStamp - lastT;
      if (dt > 0) velocity = 0.7 * velocity + 0.3 * ((e.clientX - lastX) / dt);
      lastX = e.clientX; lastT = e.timeStamp;
      track.scrollLeft = startScroll - dx;
    });
    function release(e) {
      if (!down) return;
      down = false;
      if (!dragging) return;
      dragging = false;
      suppressClick = true;
      window.setTimeout(function () { suppressClick = false; }, 0);
      if (track.hasPointerCapture && track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
      // Glide to the card nearest to where the drag was heading, then switch snapping back on
      var target = nearestCardLeft(track.scrollLeft - velocity * 160);
      track.classList.remove('is-dragging');
      track.classList.add('is-settling');
      track.scrollTo({ left: target, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      settleTimer = window.setTimeout(endSettle, 700);
    }
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);
    track.addEventListener('scrollend', function () { if (!dragging) endSettle(); });
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });
    track.addEventListener('click', function (e) {
      if (suppressClick) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  })();

  /* ---------- How it works: three-step stepper ---------- */
  (function () {
    var section = document.getElementById('how-it-works');
    var list = document.getElementById('steps');
    if (!section || !list) return;
    var steps = qsa('.step', list);
    var panels = qsa('[data-step-card]', section);
    var current = 0;

    function show(i) {
      current = i;
      steps.forEach(function (s, n) {
        s.classList.toggle('is-active', n === i);
        s.querySelector('.step__btn').setAttribute('aria-pressed', String(n === i));
      });
      panels.forEach(function (p, n) { p.classList.toggle('is-active', n === i); });
    }
    steps.forEach(function (s, i) {
      s.querySelector('.step__btn').addEventListener('click', function () { show(i); });
      s.querySelector('.step__fill').addEventListener('animationend', function () {
        if (i === current) show((i + 1) % steps.length);
      });
    });

    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      list.classList.add('steps--static');
      return;
    }
    new IntersectionObserver(function (entries) {
      section.classList.toggle('is-inview', entries[0].isIntersecting);
    }, { threshold: 0.3 }).observe(section);
  })();

  /* ---------- FAQ accordion (one open at a time) ---------- */
  var faqItems = qsa('.faq__item');
  function setFaq(item, open) {
    item.classList.toggle('is-open', open);
    item.querySelector('.faq__q').setAttribute('aria-expanded', String(open));
  }
  function openFaq(item) {
    faqItems.forEach(function (other) { setFaq(other, other === item); });
  }
  faqItems.forEach(function (item) {
    item.querySelector('.faq__q').addEventListener('click', function () {
      if (item.classList.contains('is-open')) { setFaq(item, false); } else { openFaq(item); }
    });
  });
  // Question cards and deep links such as #q-life open the matching answer
  function openFaqFromHash(hash) {
    if (!hash || hash.length < 2) return;
    var target = document.getElementById(hash.slice(1));
    if (target && target.classList.contains('faq__item')) openFaq(target);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#q-"]');
    if (a) openFaqFromHash(a.getAttribute('href'));
  });
  openFaqFromHash(window.location.hash);

  /* ---------- Sticky mobile bar: hide while the booking section is on screen ---------- */
  var sticky = document.getElementById('sticky-cta');
  var bookSection = document.getElementById('book');
  if (sticky && bookSection && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      sticky.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(bookSection);
  }

  /* ---------- Guide form: demo submit, no network ---------- */
  var guideForm = document.getElementById('guide-form');
  var guideSection = document.getElementById('guide');
  var guideEmail = document.getElementById('guide-email');
  guideForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guideEmail.value.trim())) {
      guideEmail.setAttribute('aria-invalid', 'true');
      guideEmail.focus();
      return;
    }
    guideEmail.removeAttribute('aria-invalid');
    guideSection.classList.add('guide--done');
  });
  guideEmail.addEventListener('input', function () { guideEmail.removeAttribute('aria-invalid'); });

  /* ---------- Booking calendar: demo flow, no network ----------
     Day -> time -> name/email -> confirmation. Availability is generated, not real. */
  (function () {
    var cal = document.getElementById('booking-cal');
    if (!cal) return;
    var head = cal.querySelector('.booking__cal-head');
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
      return ((d.getDate() * 7 + d.getMonth()) % 5) !== 0;   // a few weekdays shown as fully booked
    }
    function fmtDay(d) { return DOWS[d.getDay()] + ', ' + d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3); }
    function sameDay(a, b) { return !!a && !!b && a.getTime() === b.getTime(); }

    function renderMonth() {
      labelEl.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
      qsa('.booking__day, .booking__pad', daysEl).forEach(function (n) { n.remove(); });
      var first = new Date(view.getFullYear(), view.getMonth(), 1);
      var pad = (first.getDay() + 6) % 7; // Monday-first
      for (var p = 0; p < pad; p++) {
        var s = document.createElement('span');
        s.className = 'booking__pad';
        daysEl.appendChild(s);
      }
      var count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      for (var i = 1; i <= count; i++) {
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
      qsa('.booking__day', daysEl).forEach(function (b) {
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
      qsa('.booking__slot', slotsEl).forEach(function (c) { c.setAttribute('aria-pressed', c === btn ? 'true' : 'false'); });
      summary.textContent = fmtDay(picked.date) + ' at ' + t;
      form.hidden = false;
      nameEl.focus();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameOk = !!nameEl.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim());
      if (nameOk) { nameEl.removeAttribute('aria-invalid'); } else { nameEl.setAttribute('aria-invalid', 'true'); }
      if (emailOk) { emailEl.removeAttribute('aria-invalid'); } else { emailEl.setAttribute('aria-invalid', 'true'); }
      if (!nameOk || !emailOk) { (nameOk ? emailEl : nameEl).focus(); return; }
      var firstName = nameEl.value.trim().split(' ')[0];
      doneText.textContent = firstName + ', your free consultation is set for ' + fmtDay(picked.date) + ' ' + picked.date.getFullYear() + ' at ' + picked.slot + ' PT.';
      doneEmail.textContent = emailEl.value.trim();
      daysEl.hidden = true; stepTime.hidden = true; form.hidden = true; head.hidden = true; done.hidden = false;
    });
    [nameEl, emailEl].forEach(function (el) {
      el.addEventListener('input', function () { el.removeAttribute('aria-invalid'); });
    });

    changeBtn.addEventListener('click', function () {
      form.hidden = true; picked.slot = null;
      qsa('.booking__slot', slotsEl).forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
    });
    resetBtn.addEventListener('click', function () {
      picked = { date: null, slot: null }; nameEl.value = ''; emailEl.value = '';
      done.hidden = true; daysEl.hidden = false; head.hidden = false;
      renderMonth();
    });
    prevBtn.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderMonth(); });
    nextBtn.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderMonth(); });

    renderMonth();
  })();
})();
