/* Springreens — "Build Your Plate" signature widget (vanilla, shared across all designs) */
(function () {
  var root = document.getElementById('plate-builder');
  if (!root) return;
  var BASE = root.getAttribute('data-base') || 'assets/';
  var IMG = BASE + 'img/';
  var ORDER = 'https://www.springreens.com/popmenu-order';

  // real Springreens items → photo + dietary
  var PROTEINS = [
    { id: 'baked',   name: 'Halal Baked Chicken', img: '069-p', diet: ['halal'] },
    { id: 'fried',   name: 'Halal Fried Chicken',  img: '031-p', diet: ['halal'] },
    { id: 'ribs',    name: 'Halal Beef Ribs',      img: '036-p', diet: ['halal'] },
    { id: 'wings',   name: 'Halal Party Wings',    img: '041-p', diet: ['halal'] },
    { id: 'shrimp',  name: 'Shrimp Creole',        img: '010-p', diet: ['halal', 'seafood'] },
    { id: 'whiting', name: 'Wild-Caught Whiting',  img: '029-p', diet: ['seafood'] }
  ];
  var SIDES = [
    { id: 'mac',    name: 'Mac & Cheese',      img: '067', diet: ['veg'] },
    { id: 'yams',   name: 'Candied Yams',      img: '070', diet: ['vegan'] },
    { id: 'peas',   name: 'Black-Eyed Peas',   img: '064', diet: ['vegan'] },
    { id: 'rice',   name: 'Turmeric Rice',     img: '063', diet: ['vegan'] },
    { id: 'squash', name: 'Squash & Zucchini', img: '047', diet: ['vegan'] },
    { id: 'beans',  name: 'Green Beans',       img: '038', diet: ['vegan'] },
    { id: 'greens', name: 'Southern Greens',   img: 'greens', diet: ['vegan'] }
  ];
  var MAX = 4;
  var state = { protein: null, sides: [], size: 'large' };

  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  var TAGS = [
    { key: 'halal',   label: 'Halal',         on: function (s) { return s.protein && s.protein.diet.indexOf('halal') >= 0; } },
    { key: 'sea',     label: 'Wild-Caught',   on: function (s) { return s.protein && s.protein.diet.indexOf('seafood') >= 0; } },
    { key: 'vegan',   label: 'Vegan-Friendly',on: function (s) { return !s.protein && s.sides.length > 0 && s.sides.every(function (x) { return x.diet.indexOf('vegan') >= 0; }); } },
    { key: 'veg',     label: 'Vegetarian',    on: function (s) { return !s.protein && s.sides.length > 0 && s.sides.some(function (x) { return x.diet.indexOf('vegan') < 0; }); } },
    { key: 'fresh',   label: 'Made Fresh',    on: function (s) { return s.protein || s.sides.length; } }
  ];

  function opt(item, kind, selected, disabled) {
    return '<button class="pb-opt' + (selected ? ' sel' : '') + '" type="button" data-kind="' + kind + '" data-id="' + item.id + '"' + (disabled ? ' disabled' : '') + '>' +
      '<img src="' + IMG + item.img + '.webp" alt="" loading="lazy"><span class="nm">' + item.name + '</span></button>';
  }

  function render() {
    var p = state.protein;
    root.innerHTML =
      '<div class="pb-grid">' +
        '<div class="pb-stage">' +
          '<div class="pb-plate' + ((p || state.sides.length) ? ' has' : '') + '">' +
            '<div class="pb-steam"><i></i><i></i><i></i></div>' +
            '<div class="pb-slot center' + (p ? ' filled' : '') + '">' +
              (p ? '<img src="' + IMG + p.img + '.webp" alt="' + p.name + '">' : '<span class="ph">Add a<br>protein</span>') + '</div>' +
            [0, 1, 2, 3].map(function (i) {
              var s = state.sides[i];
              return '<div class="pb-slot s' + i + (s ? ' filled' : '') + '">' +
                (s ? '<img src="' + IMG + s.img + '.webp" alt="' + s.name + '">' : '<span class="plus">+</span>') + '</div>';
            }).join('') +
          '</div>' +
          '<div class="pb-tags">' + TAGS.map(function (t) {
            return '<span class="pb-tag' + (t.on(state) ? ' on' : '') + '">' + (t.on(state) ? CHECK : '') + t.label + '</span>';
          }).join('') + '</div>' +
          priceHTML() +
          '<div class="pb-cta">' +
            '<a class="pb-btn" href="' + ORDER + '" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>Order this plate</a>' +
            '<button class="pb-btn ghost" type="button" data-act="clear">Start over</button>' +
          '</div>' +
        '</div>' +
        '<div class="pb-picker">' +
          '<div class="pb-size" role="group" aria-label="Plate size">' +
            '<button type="button" data-size="small"' + (state.size === 'small' ? ' class="on"' : '') + '>Small plate</button>' +
            '<button type="button" data-size="large"' + (state.size === 'large' ? ' class="on"' : '') + '>Large plate</button>' +
          '</div>' +
          '<div class="pb-lbl"><h4>1 · Pick a protein</h4><span>optional</span></div>' +
          '<div class="pb-opts">' + PROTEINS.map(function (x) { return opt(x, 'p', p && p.id === x.id, false); }).join('') + '</div>' +
          '<div class="pb-lbl"><h4>2 · Pick your sides</h4><span>' + state.sides.length + ' / ' + MAX + '</span></div>' +
          '<div class="pb-opts">' + SIDES.map(function (x) {
            var sel = state.sides.some(function (s) { return s.id === x.id; });
            return opt(x, 's', sel, !sel && state.sides.length >= MAX);
          }).join('') + '</div>' +
          '<p class="pb-hint">Every side is vegan-friendly · proteins are 100% halal · order online for exact pricing &amp; the full list.</p>' +
        '</div>' +
      '</div>';
  }

  function priceHTML() {
    var n = state.sides.length, sizeName = state.size === 'large' ? 'Large' : 'Small';
    if (state.protein) {
      return '<div class="pb-price">Order online for pricing<small>' + sizeName + ' plate · ' + state.protein.name + ' + ' + n + ' side' + (n === 1 ? '' : 's') + '</small></div>';
    }
    var price = state.size === 'large' ? '$15' : '$8';
    return '<div class="pb-price">' + price + '<small>' + sizeName + ' vegetable plate · ' + n + '/' + MAX + ' sides · vegan-friendly</small></div>';
  }

  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-kind],[data-size],[data-act]');
    if (!t) return;
    if (t.dataset.act === 'clear') { state = { protein: null, sides: [], size: state.size }; render(); return; }
    if (t.dataset.size) { state.size = t.dataset.size; render(); return; }
    if (t.disabled) return;
    if (t.dataset.kind === 'p') {
      var pr = PROTEINS.filter(function (x) { return x.id === t.dataset.id; })[0];
      state.protein = (state.protein && state.protein.id === pr.id) ? null : pr;
    } else if (t.dataset.kind === 's') {
      var sd = SIDES.filter(function (x) { return x.id === t.dataset.id; })[0];
      var idx = state.sides.findIndex(function (x) { return x.id === sd.id; });
      if (idx >= 0) state.sides.splice(idx, 1);
      else if (state.sides.length < MAX) state.sides.push(sd);
    }
    render();
  });

  render();
})();
