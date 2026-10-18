// Medium-fish experiment: run Peacock Reef headless with a variant patched in, report payback, catch pace and dry spells.
// usage: node exp.js <game.html> <minutes> <variant> [seed-ish]
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
let script = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));
const minutes = +(process.argv[3] || 60), variant = process.argv[4] || 'base';

const rep = (a, b) => { if (!script.includes(a)) throw new Error('patch miss: ' + a.slice(0, 60)); script = script.replace(a, b); };
// instrumentation: every paid gun catch -> [time, seat, group, multiple]
rep('function kill(f, seat, reward, silent, label, golden) {',
  'function kill(f, seat, reward, silent, label, golden) { if (reward > 0 && running) (globalThis.__C = globalThis.__C || []).push([time, seat.i, f.type.group, reward / Math.max(1, seat.bet)]);');

const V = {
  // Medium Rush: a short burst, about 3x the usual mediums, faster spawns, same odds
  rush:      {pb: 1.0,  mix: 3.0, dur: '[12, 18]'},
  // same burst, odds 5% hotter while it runs (paid by the rest of the night through the director)
  rushHot:   {pb: 1.05, mix: 3.0, dur: '[12, 18]'},
  // bigger, longer burst
  rushBig:   {pb: 1.0,  mix: 4.5, dur: '[18, 24]'},
  // no rush scene, mediums simply more common all the time
  moreMed:   null,
};
if (variant.startsWith('rush')) {
  const v = V[variant];
  rep("  giants:   {name: 'Giants',",
    `  rush:     {name: 'Medium Rush', dur: ${v.dur}, pb: ${v.pb}, mix: {tiny: .5, small: .5, medium: ${v.mix}, big: .3}, rush: true},\n  giants:   {name: 'Giants',`);
  // one rush in every wave shape, right after its opening scene
  rep("  calm:    ['reef', 'parade', 'night', 'reef'],", "  calm:    ['reef', 'rush', 'parade', 'night', 'reef'],");
  rep("  spike:   ['reef', 'hunt', 'baitball', 'boss'],", "  spike:   ['reef', 'rush', 'hunt', 'baitball', 'boss'],");
  rep("  roller:  ['hunt', 'baitball', 'current', 'boss'],", "  roller:  ['hunt', 'rush', 'baitball', 'current', 'boss'],");
  rep("  tension: ['hunt', 'giants', 'boss'],", "  tension: ['hunt', 'rush', 'giants', 'boss'],");
  rep("  recover: ['hunt', 'giants', 'boss'],", "  recover: ['hunt', 'giants', 'rush', 'boss'],");
  rep("  spawnTimer = rand(0.35, 0.8);", "  spawnTimer = sc.rush ? rand(0.12, 0.25) : rand(0.35, 0.8);");
}
if (variant === 'moreMed') rep('const base = {tiny: 12, small: 10, medium: 7, big: 2};', 'const base = {tiny: 11, small: 9, medium: 10, big: 2};');

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

eval(script);
const R = window.__reef;
R.settings.players = 10;
R.startGame();
R.settings.seatInput = Array(10).fill('bot');
for (const s of R.seats()) s.points = 1e9;
const dt = 1 / 30, steps = Math.round(minutes * 60 / dt);
let errors = 0, rushTime = 0;
for (let i = 0; i < steps; i++) {
  try { R.update(dt); if (R.director.sceneKey === 'rush') rushTime += dt; } catch (e) { errors++; if (errors < 3) console.error(e.stack); }
}
const L = R.ledger, C = globalThis.__C || [];
// dry spells: seconds between paid gun catches for each seat
const gaps = [];
for (let s = 0; s < 10; s++) { const ts = C.filter(c => c[1] === s).map(c => c[0]); for (let k = 1; k < ts.length; k++) gaps.push(ts[k] - ts[k - 1]); }
gaps.sort((a, b) => a - b);
const q = p => gaps.length ? gaps[Math.floor(p * (gaps.length - 1))].toFixed(1) : '-';
const med = C.filter(c => c[2] === 'medium');
const g = L.byGroup, share = k => (g[k] ? (100 * g[k].hitW / Object.values(g).reduce((a, o) => a + o.hitW, 0)).toFixed(1) : '0');
console.log(JSON.stringify({
  variant, minutes, errors,
  gunPB: +(100 * L.gunP / L.gunW).toFixed(2),
  catchesPerMin: +(C.length / minutes).toFixed(1),
  medCatchesPerMin: +(med.length / minutes).toFixed(1),
  medPB: g.medium ? +(100 * g.medium.paid / g.medium.hitW).toFixed(1) : null,
  wagerShare: {tiny: share('tiny'), small: share('small'), medium: share('medium'), big: share('big'), boss: share('boss')},
  dryMedian: q(0.5), dry90: q(0.9), dry99: q(0.99), dryMax: gaps.length ? gaps.at(-1).toFixed(0) : '-',
  rushPct: +(100 * rushTime / (minutes * 60)).toFixed(1),
}));
