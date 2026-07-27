/* Springreens — interactions (vanilla, no deps) */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ---- theme ---- */
  try {
    var saved = localStorage.getItem('sr-theme');
    if (saved) root.setAttribute('data-theme', saved);
  } catch (e) {}
  function toggleTheme() {
    var cur = root.getAttribute('data-theme');
    if (!cur) cur = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('sr-theme', next); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    /* theme buttons */
    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-toggle]'), function (b) {
      b.addEventListener('click', toggleTheme);
    });

    /* sticky header */
    var header = document.querySelector('.site-header');
    var onHero = header && header.classList.contains('on-hero');
    function onScroll() {
      if (!header) return;
      var solid = window.scrollY > (onHero ? Math.min(window.innerHeight * 0.7, 480) : 12);
      header.classList.toggle('solid', solid);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* mobile nav */
    var mnav = document.querySelector('.mnav');
    var burger = document.querySelector('.burger');
    function setNav(open) {
      if (!mnav) return;
      mnav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (burger) burger.addEventListener('click', function () { setNav(!mnav.classList.contains('open')); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-close-nav]'), function (el) {
      el.addEventListener('click', function () { setNav(false); });
    });
    if (mnav) mnav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });

    /* reveal on scroll */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      reveals.forEach(function (r) { io.observe(r); });
    } else {
      reveals.forEach(function (r) { r.classList.add('in'); });
    }

    /* menu section nav highlight + smooth offset */
    var menuNav = document.querySelector('.menu-nav');
    if (menuNav) {
      var links = menuNav.querySelectorAll('a');
      var sections = [];
      links.forEach(function (l) {
        var id = l.getAttribute('href').slice(1);
        var s = document.getElementById(id);
        if (s) sections.push({ id: id, el: s, link: l });
      });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) { l.classList.remove('active'); });
            var m = sections.filter(function (s) { return s.el === en.target; })[0];
            if (m) m.link.classList.add('active');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { spy.observe(s.el); });
    }

    /* catering inquiry form -> mailto (works on static hosting) */
    var form = document.querySelector('#catering-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var f = form;
        var get = function (n) { return (f.elements[n] && f.elements[n].value || '').trim(); };
        var name = get('name'), email = get('email'), phone = get('phone'),
            date = get('date'), guests = get('guests'), type = get('type'), msg = get('message');
        var to = form.getAttribute('data-to') || 'inheritingislam@gmail.com';
        var subject = 'Catering Inquiry — ' + (name || 'New guest') + (date ? ' (' + date + ')' : '');
        var body =
          'CATERING INQUIRY — Springreens\n\n' +
          'Name: ' + name + '\n' +
          'Email: ' + email + '\n' +
          'Phone: ' + phone + '\n' +
          'Event date: ' + date + '\n' +
          'Guest count: ' + guests + '\n' +
          'Event type: ' + type + '\n\n' +
          'Details:\n' + msg + '\n';
        var href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        var ok = form.querySelector('.form-success');
        var fields = form.querySelector('.form-body');
        if (ok && fields) { fields.style.display = 'none'; ok.classList.add('show'); }
        window.location.href = href;
      });
    }

    /* footer year */
    var yr = document.getElementById('year');
    if (yr) yr.textContent = new Date().getFullYear();
  });
})();

/* Menu dietary filter + newsletter (shared across all designs) */
document.addEventListener('DOMContentLoaded', function () {
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  if (chips.length) {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-diet]'));
    var sections = Array.prototype.slice.call(document.querySelectorAll('.menu-section, .msec'));
    function apply(f) {
      chips.forEach(function (x) {
        var on = x.getAttribute('data-filter') === f;
        x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      items.forEach(function (it) {
        var d = ' ' + (it.getAttribute('data-diet') || '') + ' ';
        it.style.display = (f === 'all' || d.indexOf(' ' + f + ' ') >= 0) ? '' : 'none';
      });
      sections.forEach(function (s) {
        var its = s.querySelectorAll('[data-diet]');
        if (!its.length) return;
        var any = false;
        Array.prototype.forEach.call(its, function (v) { if (v.style.display !== 'none') any = true; });
        s.style.display = any ? '' : 'none';
      });
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { apply(c.getAttribute('data-filter')); }); });
  }
  Array.prototype.forEach.call(document.querySelectorAll('form[data-newsletter]'), function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = f.querySelector('input[type=email]');
      var email = inp ? inp.value.trim() : '';
      var to = f.getAttribute('data-to') || 'inheritingislam@gmail.com';
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Springreens — newsletter signup') +
        '&body=' + encodeURIComponent('Please add me to the Springreens list: ' + email);
      var ok = f.querySelector('.nl-ok');
      if (ok) { Array.prototype.forEach.call(f.querySelectorAll('.nl-row'), function (x) { x.style.display = 'none'; }); ok.style.display = 'block'; }
    });
  });
});
