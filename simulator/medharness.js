// Headless run of Peacock Reef: stub the DOM/canvas, run demo players for a long stretch, report errors and paybacks.
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const script = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));
const minutes = +(process.argv[3] || 60);

const noop = () => {};
const deep = () => new Proxy(function () {}, {
  get: (t, k) => k === Symbol.toPrimitive ? () => 0 : k === 'measureText' ? () => ({width: 50}) : deep(),
  set: () => true, apply: () => deep(), construct: () => deep(),
});
const ctx2d = deep();
function el(id) {
  return {id, hidden: false, value: '', checked: false, type: id === '#sVolume' ? 'range' : (id === '#sBounce' || id === '#sPanel') ? 'checkbox' : 'select-one',
    style: {}, innerHTML: '', textContent: '', getContext: () => ctx2d, addEventListener: noop, setPointerCapture: noop, focus: noop,
    getBoundingClientRect: () => ({width: 1600, height: 900, left: 0, top: 0}), add: noop, appendChild: noop, append: noop, setAttribute: noop,
    set onclick(v) {}, set onchange(v) {}, width: 0, height: 0};
}
const els = {};
global.document = {querySelector: s => (els[s] = els[s] || el(s)), createElement: () => el('x'), getElementById: () => null, documentElement: el('html'), fonts: {ready: Promise.resolve()}};
global.window = global;
global.localStorage = {getItem: () => null, setItem: noop};
global.navigator = {getGamepads: () => []};
global.addEventListener = noop;
global.performance = {now: () => 0};
global.requestAnimationFrame = noop;
global.Option = function () {};
global.structuredClone = o => JSON.parse(JSON.stringify(o));

let errors = 0;
eval(script);
const R = window.__reef;
R.settings.players = 10;
// every seat is a demo player with plenty of credits, running = real wagers
const seats = R.seats();
R.startGame();
R.settings.seatInput = Array(10).fill('bot');
for (const s of R.seats()) s.points = 1e9;
const dt = 1 / 30, steps = Math.round(minutes * 60 / dt);
for (let i = 0; i < steps; i++) {
  try { R.update(dt); if (i % 300 === 0) R.drawScene(); } catch (e) { errors++; if (errors < 5) console.error(e.stack); }
}
const L = R.ledger, pct = (p, w) => (w ? (100 * p / w).toFixed(2) + '%' : '-');
console.log(`simulated ${minutes} min, errors ${errors}, waves ${R.director.wave}`);
console.log(`gun:  wagered ${Math.round(L.gunW)}  paid ${Math.round(L.gunP)}  payback ${pct(L.gunP, L.gunW)}`);
console.log(`pole: wagered ${Math.round(L.poleW)}  paid ${Math.round(L.poleP)}  payback ${pct(L.poleP, L.poleW)}`);
console.log(`total payback ${pct(L.totP, L.totW)}`);
console.log('fish on screen at end:', R.fish().length);
if (R.medStats) console.log("medStats", JSON.stringify(R.medStats), "medExp", R.medExposure.map(v => v.toFixed(0)).join(" "));
if (R.bigStats) console.log("bigStats", JSON.stringify(R.bigStats), "exposure", R.bigExposure.map(v => v.toFixed(0)).join(" "));
for (const [g, o] of Object.entries(R.ledger.byGroup)) console.log(g.padEnd(8), 'hits', o.hits, 'catches', o.catches, 'hit-wager', Math.round(o.hitW), 'paid', Math.round(o.paid), 'per-hit payback', (100 * o.paid / o.hitW).toFixed(1) + '%');
for (const [b, o] of Object.entries(R.ledger.pole)) console.log(b.padEnd(9), JSON.stringify(o), 'payback', (100 * o.p / o.w).toFixed(1) + '%');
