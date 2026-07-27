/* Springreens — dismissible "Become a VIP" pop-in (bottom-right).
   Nod to the original site's VIP widget. Easy to remove: delete this file
   and its <script> include. Remembers dismissal for the session. */
(function () {
  var KEY = 'sr-vip-dismissed';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
  // find the VIP page relative to current location (root or /v2//v3/)
  var dir = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);
  var vip = 'vip.html';
  var css = '' +
    '.vip-pop{position:fixed;right:18px;bottom:18px;z-index:80;max-width:330px;width:calc(100vw - 36px);' +
    'background:#1B4332;color:#f4ecdd;border-radius:16px;padding:18px 18px 16px;box-shadow:0 20px 50px -12px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.06);' +
    'font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;transform:translateY(24px) scale(.98);opacity:0;transition:transform .45s cubic-bezier(.2,.8,.25,1),opacity .4s}' +
    '.vip-pop.in{transform:none;opacity:1}' +
    '.vip-pop .x{position:absolute;top:10px;right:10px;width:26px;height:26px;border:0;border-radius:50%;background:rgba(255,255,255,.12);color:#f4ecdd;cursor:pointer;font-size:15px;line-height:1;display:grid;place-items:center}' +
    '.vip-pop .x:hover{background:rgba(255,255,255,.22)}' +
    '.vip-pop .k{display:inline-flex;align-items:center;gap:6px;font-size:.66rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#E7B24C}' +
    '.vip-pop h4{margin:8px 0 4px;font-size:1.18rem;font-weight:800;line-height:1.15;color:#fff;font-family:Georgia,"Times New Roman",serif}' +
    '.vip-pop p{margin:0 0 13px;font-size:.86rem;line-height:1.45;color:rgba(244,236,221,.82)}' +
    '.vip-pop a.cta{display:inline-flex;align-items:center;gap:7px;background:linear-gradient(180deg,#E7B24C,#D89230);color:#2b1c07;font-weight:800;font-size:.86rem;padding:.62em 1.1em;border-radius:999px;text-decoration:none}' +
    '.vip-pop a.cta:hover{filter:saturate(1.08)}' +
    '@media(max-width:860px){.vip-pop{right:12px;bottom:80px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function show() {
    if (document.querySelector('.vip-pop')) return;
    var el = document.createElement('aside');
    el.className = 'vip-pop';
    el.setAttribute('role', 'complementary');
    el.setAttribute('aria-label', 'Become a VIP');
    el.innerHTML =
      '<button class="x" aria-label="Dismiss">&times;</button>' +
      '<span class="k"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg> Springreens VIP</span>' +
      '<h4>Join the VIP list</h4>' +
      '<p>Be first for specials, seasonal menus and Ramadan pre-orders — plus a birthday treat.</p>' +
      '<a class="cta" href="' + dir + vip + '">Become a VIP &rarr;</a>';
    document.body.appendChild(el);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); }); });
    el.querySelector('.x').addEventListener('click', function () {
      el.classList.remove('in');
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
      setTimeout(function () { el.remove(); }, 400);
    });
  }
  var t = setTimeout(show, 6500);
  window.addEventListener('scroll', function once() {
    if ((window.scrollY || 0) > window.innerHeight * 0.6) { clearTimeout(t); show(); window.removeEventListener('scroll', once); }
  }, { passive: true });
})();
