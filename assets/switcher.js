/* Springreens — prototype style switcher (shared across all 3 designs) */
(function () {
  var STYLES = [
    { n: 'Soul Kitchen', base: '' },
    { n: 'Fresh Market', base: 'v2/' },
    { n: 'Heritage',     base: 'v3/' }
  ];
  var path = location.pathname;
  var file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  var dir  = path.substring(0, path.lastIndexOf('/') + 1);
  var cur = 0, root = dir;
  if (/\/v2\/$/.test(dir))      { cur = 1; root = dir.replace(/v2\/$/, ''); }
  else if (/\/v3\/$/.test(dir)) { cur = 2; root = dir.replace(/v3\/$/, ''); }
  var core = ['index.html','menu.html','catering.html','about.html','events.html','gift-cards.html','vip.html','order.html','signin.html',''];
  function target(base) {
    var f = (core.indexOf(file) >= 0) ? file : 'index.html';
    if (f === '') f = 'index.html';
    return root + base + f;
  }
  var css = '' +
    '.ss-bar{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:90;' +
    'display:flex;align-items:center;gap:4px;padding:5px 6px 5px 14px;border-radius:999px;' +
    'background:rgba(20,18,15,.86);backdrop-filter:blur(12px);box-shadow:0 10px 30px -8px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.08);' +
    'font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:13px;max-width:calc(100vw - 24px)}' +
    '.ss-bar .ss-lbl{color:rgba(255,255,255,.62);font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:10px;white-space:nowrap;padding-right:2px}' +
    '.ss-bar a{display:inline-flex;align-items:center;gap:6px;color:rgba(255,255,255,.82);text-decoration:none;font-weight:600;' +
    'padding:7px 12px;border-radius:999px;white-space:nowrap;transition:background .2s,color .2s}' +
    '.ss-bar a b{display:inline-grid;place-items:center;width:17px;height:17px;border-radius:50%;background:rgba(255,255,255,.16);font-size:10px;font-weight:800}' +
    '.ss-bar a:hover{background:rgba(255,255,255,.12);color:#fff}' +
    '.ss-bar a.on{background:#fff;color:#161310}.ss-bar a.on b{background:#1B4332;color:#fff}' +
    '@media(max-width:860px){.ss-bar{bottom:80px;font-size:12px;padding:4px 5px 4px 10px}.ss-bar a{padding:6px 9px}.ss-bar a .nm{display:none}.ss-bar .ss-lbl{display:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function build() {
    var bar = document.createElement('div');
    bar.className = 'ss-bar';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Prototype design options');
    var html = '<span class="ss-lbl">Design</span>';
    STYLES.forEach(function (s, i) {
      html += '<a href="' + target(s.base) + '"' + (i === cur ? ' class="on" aria-current="true"' : '') +
        '><b>' + (i + 1) + '</b><span class="nm">' + s.n + '</span></a>';
    });
    bar.innerHTML = html;
    document.body.appendChild(bar);
  }
  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
