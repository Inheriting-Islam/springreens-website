/* Springreens prototype — global cart engine (shared across every page & design).
   localStorage-backed cart + a slide-in drawer + a header cart button.
   Fully self-contained prototype: checkout completes on our own /checkout page.
   Exposes window.SRCart for order.js and plate-builder.js. */
(function () {
  var KEY = 'srCart_v1';
  // asset base derived from this script's own URL (works at root, /v2/, /v3/)
  var sc = document.querySelector('script[src*="cart-core.js"]');
  var BASE = sc ? sc.src.replace(/cart-core\.js.*$/, '') : 'assets/';
  var IMG = BASE + 'img/';

  var LEAF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 8-9 0 5-1 9-5 11"/><path d="M20 4C10 6 8 12 8 20"/></svg>';
  var CARTSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>';

  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function write(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} paint(); }
  function money(v) { return '$' + Number(v).toFixed(2).replace(/\.00$/, ''); }
  function keyOf(it) { return it.n + '|' + (it.label || ''); }

  var SRCart = {
    get: read,
    count: function () { return read().reduce(function (s, i) { return s + i.qty; }, 0); },
    subtotal: function () { return read().reduce(function (s, i) { return s + (i.market ? 0 : (i.val || 0) * i.qty); }, 0); },
    marketCount: function () { return read().filter(function (i) { return i.market; }).reduce(function (s, i) { return s + i.qty; }, 0); },
    add: function (it, openDrawer) {
      var a = read(), k = keyOf(it), found = false;
      for (var i = 0; i < a.length; i++) { if (keyOf(a[i]) === k) { a[i].qty += (it.qty || 1); found = true; break; } }
      if (!found) a.push({ n: it.n, img: it.img || '', label: it.label || '', val: (it.market ? null : (it.val || 0)), market: !!it.market, qty: it.qty || 1 });
      write(a);
      if (openDrawer !== false) SRCart.open();
    },
    setQty: function (k, d) {
      var a = read();
      for (var i = 0; i < a.length; i++) { if (keyOf(a[i]) === k) { a[i].qty += d; if (a[i].qty <= 0) a.splice(i, 1); break; } }
      write(a);
    },
    clear: function () { write([]); },
    open: function () { ensure(); document.querySelector('.sr-drawer').classList.add('open'); document.querySelector('.sr-back').classList.add('open'); render(); document.body.style.overflow = 'hidden'; },
    close: function () { var d = document.querySelector('.sr-drawer'); if (d) { d.classList.remove('open'); document.querySelector('.sr-back').classList.remove('open'); document.body.style.overflow = ''; } }
  };
  window.SRCart = SRCart;

  // ---------- header cart button (injected once, every page) ----------
  function injectHeaderButton() {
    var host = document.querySelector('.header-cta');
    if (!host || host.querySelector('.sr-cart-btn')) return;
    var b = document.createElement('button');
    b.className = 'sr-cart-btn';
    b.setAttribute('type', 'button');
    b.setAttribute('aria-label', 'Open cart');
    b.setAttribute('data-cart-open', '');
    b.innerHTML = CARTSVG + '<span class="sr-cart-badge" data-cart-count hidden>0</span>';
    // place right before the Order Online button if present, else at start
    var order = host.querySelector('.btn');
    host.insertBefore(b, order || host.firstChild);
  }

  function paint() {
    var n = SRCart.count();
    [].forEach.call(document.querySelectorAll('[data-cart-count]'), function (el) {
      el.textContent = n; el.hidden = n === 0;
    });
  }

  // ---------- drawer ----------
  function ensure() {
    if (document.querySelector('.sr-drawer')) return;
    var back = document.createElement('div'); back.className = 'ord-back sr-back'; back.setAttribute('data-cart-close', '');
    var d = document.createElement('aside'); d.className = 'ord-drawer sr-drawer'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Your order');
    document.body.appendChild(back); document.body.appendChild(d);
  }

  function lineHTML(it) {
    var k = keyOf(it);
    var ph = it.img ? '<img src="' + IMG + it.img + '.webp" alt="">' : '<span class="lph">' + LEAF + '</span>';
    var per = it.market ? 'Market price' : money(it.val) + ' each';
    var lbl = (it.label && it.label.charAt(0) !== '$') ? it.label + ' · ' : '';
    var lt = it.market ? '<span class="ord-lt mkt">Market</span>' : '<div class="ord-lt">' + money(it.val * it.qty) + '</div>';
    return '<div class="ord-line">' + ph +
      '<div class="ln"><b>' + it.n + '</b><span>' + lbl + per + '</span></div>' +
      '<div class="ord-stp"><button data-cq="' + k + '|-1" aria-label="Remove one">&minus;</button><span>' + it.qty + '</span><button data-cq="' + k + '|1" aria-label="Add one">+</button></div>' +
      lt + '</div>';
  }

  function render() {
    var d = document.querySelector('.sr-drawer'); if (!d) return;
    var a = read(), sub = SRCart.subtotal(), mk = SRCart.marketCount();
    var body = a.length ? a.map(lineHTML).join('') : '<div class="ord-empty">Your cart is empty.<br>Add something delicious from the menu.</div>';
    var mkNote = mk ? '<p class="ord-note2">' + mk + ' item' + (mk === 1 ? '' : 's') + ' priced by size/weight at pickup — added to your total in-store.</p>' : '<p class="ord-note2">Taxes calculated at checkout. Pickup only.</p>';
    d.innerHTML =
      '<div class="ord-dh"><h3>Your Order</h3><button class="ord-x" data-cart-close aria-label="Close">&times;</button></div>' +
      '<div class="ord-lines">' + body + '</div>' +
      '<div class="ord-df">' +
        '<div class="ord-sum"><span class="lbl">Subtotal</span><b>' + money(sub) + (mk ? '<sup>+</sup>' : '') + '</b></div>' +
        mkNote +
        (a.length ? '<a class="ord-checkout" href="checkout.html">' + CARTSVG + ' Checkout</a>' : '<button class="ord-checkout" type="button" data-cart-close>Browse the menu</button>') +
        '<div class="ord-flag">Prototype cart &middot; a live demo of your future ordering — no real charge</div>' +
      '</div>';
  }

  // ---------- events ----------
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); SRCart.open(); return; }
    if (e.target.closest('[data-cart-close]')) { SRCart.close(); return; }
    var q = e.target.closest('[data-cq]');
    if (q) { var p = q.getAttribute('data-cq').split('|'); SRCart.setQty(p[0] + '|' + p[1], parseInt(p[2], 10)); render(); return; }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') SRCart.close(); });

  injectHeaderButton();
  paint();
})();
