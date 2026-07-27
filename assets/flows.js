/* Springreens prototype — self-contained flows: checkout, gift cards, VIP, sign-in.
   Renders into #checkout-app / #gift-app / #vip-app / #signin-app when present.
   All client-side; no real payment/auth — a working demo of the owned experience. */
(function () {
  function money(v) { return '$' + Number(v).toFixed(2).replace(/\.00$/, ''); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function r4() { return String(Math.floor(1000 + Math.random() * 9000)); }
  function field(label, name, type, ph, req) {
    return '<label class="fx-field"><span>' + label + '</span><input name="' + name + '" type="' + type + '" placeholder="' + ph + '"' + (req ? ' required' : '') + '></label>';
  }
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  function done(el, kicker, big, body, btn, href) {
    el.innerHTML = '<div class="fx-done"><div class="fx-check">' + CHECK + '</div><p class="fx-kicker">' + kicker + '</p><h2>' + big + '</h2><div class="fx-dbody">' + body + '</div><a class="fx-btn" href="' + href + '">' + btn + '</a></div>';
    window.scrollTo(0, 0);
  }
  var SR = window.SRCart;

  // ---------------- CHECKOUT ----------------
  var co = document.getElementById('checkout-app');
  if (co) {
    var base = co.getAttribute('data-base') || 'assets/';
    var cart = SR ? SR.get() : [];
    if (!cart.length) {
      co.innerHTML = '<div class="fx-empty"><h2>Your cart is empty</h2><p>Add a few dishes from the menu and they’ll appear here, ready for pickup.</p><a class="fx-btn" href="order.html">Browse the menu</a></div>';
    } else {
      var TIMES = ['As soon as possible (~20 min)', 'Today · 5:00 PM', 'Today · 5:30 PM', 'Today · 6:00 PM', 'Today · 6:30 PM', 'Today · 7:00 PM'];
      var sub = SR.subtotal(), mk = SR.marketCount();
      var lines = cart.map(function (i) {
        var per = i.market ? ('Market price' + (i.qty > 1 ? ' × ' + i.qty : '')) : money(i.val) + ' × ' + i.qty;
        var amt = i.market ? '—' : money(i.val * i.qty);
        var ph = i.img ? '<img src="' + base + 'img/' + i.img + '.webp" alt="">' : '<span class="fx-lph"></span>';
        return '<div class="fx-line">' + ph + '<div class="fx-ln"><b>' + i.n + '</b><span>' + per + '</span></div><em>' + amt + '</em></div>';
      }).join('');
      co.innerHTML =
        '<div class="fx-grid">' +
          '<form class="fx-card" id="fx-checkout" novalidate>' +
            '<h2>Pickup details</h2>' +
            field('Full name', 'fullname', 'text', 'Your name', true) +
            field('Mobile number', 'phone', 'tel', '(470) 000-0000', true) +
            '<label class="fx-field"><span>Pickup time</span><select name="time">' + TIMES.map(function (t) { return '<option>' + t + '</option>'; }).join('') + '</select></label>' +
            '<label class="fx-field"><span>Order notes (optional)</span><textarea name="notes" rows="2" placeholder="Allergies, extra sauce, no onions…"></textarea></label>' +
            '<button class="fx-btn full" type="submit">Place order · ' + money(sub) + (mk ? '+' : '') + '</button>' +
            '<p class="fx-fine">Prototype checkout — no real charge. A live demo of your future ordering flow.</p>' +
          '</form>' +
          '<aside class="fx-card sum">' +
            '<h3>Your order</h3><div class="fx-lines">' + lines + '</div>' +
            '<div class="fx-tot"><span>Subtotal</span><b>' + money(sub) + (mk ? '<sup>+</sup>' : '') + '</b></div>' +
            (mk ? '<p class="fx-fine">+ ' + mk + ' market-priced item' + (mk === 1 ? '' : 's') + ', finalized at pickup.</p>' : '') +
          '</aside>' +
        '</div>';
      co.querySelector('#fx-checkout').addEventListener('submit', function (e) {
        e.preventDefault();
        var f = e.target;
        if (!f.fullname.value.trim() || !f.phone.value.trim()) { (!f.fullname.value.trim() ? f.fullname : f.phone).focus(); return; }
        var num = 'SR-' + r4(), tm = f.time.value, nm = f.fullname.value.trim(), ph = f.phone.value.trim();
        SR.clear();
        done(co, 'Order placed', 'Thank you, ' + esc(nm) + '! 🎉',
          '<p>Order <b>#' + num + '</b> is confirmed for <b>' + esc(tm) + '</b>.</p><p>We’ll text <b>' + esc(ph) + '</b> when it’s ready at 566 Fayetteville Rd SE.</p>',
          'Back to menu', 'order.html');
      });
    }
  }

  // ---------------- GIFT CARDS ----------------
  var gc = document.getElementById('gift-app');
  if (gc) {
    gc.innerHTML =
      '<form class="fx-card wide" id="fx-gift" novalidate>' +
        '<h2>Send a Springreens gift card</h2><p class="fx-sub">A little soul food, delivered by email — redeemable on any order.</p>' +
        '<div class="fx-amts">' + [25, 50, 75, 100].map(function (a, i) { return '<label class="fx-amt"><input type="radio" name="amt" value="' + a + '"' + (i === 1 ? ' checked' : '') + '><span>$' + a + '</span></label>'; }).join('') +
          '<label class="fx-amt"><input type="radio" name="amt" value="custom"><span>Custom</span></label></div>' +
        '<div class="fx-two">' + field('To — recipient', 'to', 'text', 'Their name', true) + field('From', 'gfrom', 'text', 'Your name', true) + '</div>' +
        field('Recipient email', 'email', 'email', 'name@email.com', true) +
        '<label class="fx-field"><span>Message (optional)</span><textarea name="msg" rows="2" placeholder="Enjoy a plate on me!"></textarea></label>' +
        '<button class="fx-btn full" type="submit">Purchase gift card</button>' +
        '<p class="fx-fine">Prototype — no real charge. Demonstrates gift cards on your own site.</p>' +
      '</form>';
    gc.querySelector('#fx-gift').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target;
      if (!f.to.value.trim() || !f.gfrom.value.trim() || !f.email.value.trim()) return;
      var amt = f.amt.value === 'custom' ? 'your chosen amount' : '$' + f.amt.value;
      done(gc, 'Gift card sent', 'On its way to ' + esc(f.to.value.trim()) + ' 💚',
        '<p>A <b>' + amt + '</b> Springreens gift card was emailed to <b>' + esc(f.email.value.trim()) + '</b> from <b>' + esc(f.gfrom.value.trim()) + '</b>.</p><p class="fx-code">SPRG-' + r4() + '-' + r4() + '</p>',
        'Send another', 'gift-cards.html');
    });
  }

  // ---------------- VIP ----------------
  var vp = document.getElementById('vip-app');
  if (vp) {
    vp.innerHTML =
      '<form class="fx-card wide" id="fx-vip" novalidate>' +
        '<h2>Become a Springreens VIP</h2><p class="fx-sub">Early access to specials, a birthday treat, and first dibs on Ramadan &amp; catering.</p>' +
        '<div class="fx-two">' + field('First name', 'first', 'text', 'Your name', true) + field('Mobile', 'phone', 'tel', '(470) 000-0000', true) + '</div>' +
        field('Email', 'email', 'email', 'name@email.com', true) +
        '<label class="fx-field"><span>Birthday — for your birthday perk (optional)</span><input name="bday" type="text" placeholder="MM / DD"></label>' +
        '<label class="fx-check2"><input type="checkbox" name="sms" checked><span>Text me exclusive VIP offers</span></label>' +
        '<button class="fx-btn full" type="submit">Join the VIP list</button>' +
        '<p class="fx-fine">Prototype — demonstrates VIP signup on your own site (nothing is stored).</p>' +
      '</form>';
    vp.querySelector('#fx-vip').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target;
      if (!f.first.value.trim() || !f.email.value.trim()) return;
      done(vp, 'You’re in', 'Welcome to the fam, ' + esc(f.first.value.trim()) + '! 🎉',
        '<p>You’re VIP <b>#' + String(Math.floor(100 + Math.random() * 900)) + '</b>. Here’s your welcome perk:</p><p class="fx-code">10% OFF · code WELCOME10</p><ul class="fx-perks"><li>Early access to weekly specials</li><li>A treat on your birthday</li><li>First dibs on Ramadan &amp; catering</li></ul>',
        'Back home', 'index.html');
    });
  }

  // ---------------- SIGN IN ----------------
  var si = document.getElementById('signin-app');
  if (si) {
    function account(name) {
      si.innerHTML = '<div class="fx-card acct">' +
        '<div class="fx-avatar">' + esc(name.charAt(0).toUpperCase()) + '</div>' +
        '<h2>Welcome, ' + esc(name) + '!</h2><p class="fx-sub">Your Springreens account</p>' +
        '<div class="fx-acct-grid">' +
          '<div class="fx-tile"><span>VIP status</span><b>Gold · 320 pts</b></div>' +
          '<div class="fx-tile"><span>Saved pickup</span><b>566 Fayetteville Rd SE</b></div>' +
          '<div class="fx-tile"><span>Last order</span><b>Full Breakfast + 2 sides</b></div>' +
          '<div class="fx-tile"><span>Next reward</span><b>Free side at 400 pts</b></div>' +
        '</div>' +
        '<div class="fx-acct-cta"><a class="fx-btn" href="order.html">Start an order</a><button class="fx-btn ghost" type="button" data-signout>Sign out</button></div>' +
      '</div>';
      si.querySelector('[data-signout]').addEventListener('click', function () { form('in'); });
    }
    function form(mode) {
      var isNew = mode === 'new';
      si.innerHTML =
        '<form class="fx-card" id="fx-signin" novalidate>' +
          '<div class="fx-tabs"><button type="button" data-tab="in"' + (!isNew ? ' class="on"' : '') + '>Sign in</button><button type="button" data-tab="new"' + (isNew ? ' class="on"' : '') + '>Create account</button></div>' +
          (isNew ? field('Full name', 'fullname', 'text', 'Your name', true) : '') +
          field('Email', 'email', 'email', 'name@email.com', true) +
          field('Password', 'pw', 'password', '••••••••', true) +
          '<button class="fx-btn full" type="submit">' + (isNew ? 'Create account' : 'Sign in') + '</button>' +
          '<p class="fx-fine">Prototype — demonstrates accounts on your own site (no real authentication).</p>' +
        '</form>';
      si.querySelector('.fx-tabs').addEventListener('click', function (e) { var b = e.target.closest('[data-tab]'); if (b) form(b.dataset.tab === 'new' ? 'new' : 'in'); });
      si.querySelector('#fx-signin').addEventListener('submit', function (e) {
        e.preventDefault();
        var f = e.target;
        if (!f.email.value.trim() || !f.pw.value) return;
        var nm = isNew ? (f.fullname.value.trim() || 'friend') : (f.email.value.split('@')[0] || 'friend');
        account(nm);
      });
    }
    form('in');
  }
})();
