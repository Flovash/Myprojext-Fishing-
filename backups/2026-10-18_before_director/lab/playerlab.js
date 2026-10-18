// Player lab: run Peacock Reef headless with 8 player types rotating through 10 seats, then write a dated report.
// usage: node lab/playerlab.js [--game game/peacock_reef.html] [--minutes 240] [--seed 1] [--label first-run]
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const gameFile = path.resolve(ROOT, arg('game', 'game/peacock_reef.html'));
const minutes = +arg('minutes', 240), seed = +arg('seed', Date.now() % 1e6 | 0);
const label = String(arg('label', 'run')).replace(/[^\w-]+/g, '-');

// ================= SEEDED RANDOM =================
// Every Math.random in the game and the lab comes from this, so a seed replays the same night.
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
Math.random = mulberry32(seed);
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (items, w) => { let t = 0; for (const it of items) t += w(it); let r = Math.random() * t; for (const it of items) if ((r -= w(it)) <= 0) return it; return items[items.length - 1]; };

// ================= LOAD + PATCH THE GAME =================
const html = fs.readFileSync(gameFile, 'utf8');
let script = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));
const rep = (a, b) => { if (!script.includes(a)) throw new Error('patch miss: ' + a.slice(0, 70)); script = script.replace(a, b); };
// the real cabinet has 10 seats; seats are built at load, so the default has to change before eval
rep('const DEFAULTS = {players: 6,', 'const DEFAULTS = {players: 10,');
// hand the lab the game's internals, and let it drive every bot seat
rep('// ================= BOTS =================\nfunction botControl(s, dt, inp) {',
  `globalThis.__labApi = {fish: () => fish, bobbers: () => bobbers, director, gunMood, reachableFrom, aimAt, inBubble, castAt, removeBobber, fightPress, eatsBait, avgMult, pivot, BAITS,
    W: () => W, H: () => H, S: () => S, time: () => time, running: () => running};
function botControl(s, dt, inp) {
  if (globalThis.__lab) return globalThis.__lab.control(s, dt, inp);`);
// money in and out, per seat
rep("s.points -= bet; if (!free) bookWager('gun', bet);", "s.points -= bet; if (!free) { bookWager('gun', bet); globalThis.__lab && globalThis.__lab.wager(s, bet, 'gun'); }");
rep("bookWager('pole', B.cost);", "bookWager('pole', B.cost); globalThis.__lab && globalThis.__lab.wager(s, B.cost, 'pole');");
rep("if (reward > 0) { seatPay(seat, reward, 'gun');", "if (reward > 0) { globalThis.__lab && globalThis.__lab.pay(seat, reward, 'gun', f.type.group, f.type.id); seatPay(seat, reward, 'gun');");
rep("seatPay(s, pts, 'pole');", "globalThis.__lab && globalThis.__lab.pay(s, pts, 'pole', f.type.group, f.type.id); seatPay(s, pts, 'pole');");

// ================= DOM STUBS (same as simulator/medharness.js) =================
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

// ================= PLAYER TYPES =================
// buyIn: credits a new player sits down with. maxMin: when they go home if they haven't busted or quit.
const TYPES = {
  sniper:  {name: 'Sniper',  buyIn: 2000,  maxMin: 60, about: 'Big fish and bosses only, lock-on, bet 10. Holds fire otherwise.'},
  sprayer: {name: 'Sprayer', buyIn: 1000,  maxMin: 60, about: 'Fires as fast as the gun allows at the closest fish, bet 1.'},
  chaser:  {name: 'Chaser',  buyIn: 2000,  maxMin: 60, about: 'Starts at bet 2, doubles after every 12 shots without a catch (cap 100), back to 2 after a catch.'},
  grinder: {name: 'Grinder', buyIn: 1000,  maxMin: 90, about: 'Steady bet 2, aims at mediums first, then smalls.'},
  whale:   {name: 'Whale',   buyIn: 20000, maxMin: 60, about: 'Bet 100 on bosses and Sharks, 50 on other big fish (lock-on), 10 on anything else.'},
  fisher:  {name: 'Fisher',  buyIn: 2000,  maxMin: 90, about: 'About 85% of the time on the pole with base and medium baits; lands 90% of fights. Gun at bet 3 otherwise.'},
  casual:  {name: 'Casual',  buyIn: 1000,  maxMin: 45, about: 'Bets 1-5 on random fish, takes pauses, sometimes fishes. Leaves when down 400.'},
  newbie:  {name: 'Newbie',  buyIn: 500,   maxMin: 45, about: 'Slow aim, fires before lined up (misses a lot), slow fire, bets 1-3. Lands 60% of fights.'},
};
const ORDER = Object.keys(TYPES);
const GROUP_ORDER = ['tiny', 'small', 'medium', 'big', 'boss', 'special'];

let A; // game internals, set after eval
const reachable = s => A.fish().filter(f => A.reachableFrom(s, f) && !A.inBubble(f));
const closest = (s, list) => { const p = A.pivot(s); let best = null, bd = 1e18; for (const f of list) { const d = (f.x - p.x) ** 2 + (f.y - p.y) ** 2; if (d < bd) { bd = d; best = f; } } return best; };
const isShark = f => f.type.id === 'shark';
const bigOrBoss = f => f.type.group === 'big' || f.type.group === 'boss';

// Free-aim gun: turn toward a target and fire when lined up within `tol`, waiting `wait` seconds between shots.
function freeAim(s, P, dt, inp, target, rate, tol, wait) {
  if (!target) { inp.rot = Math.sign(-s.off) * (Math.abs(s.off) > 0.05 ? 0.5 : 0); return; }
  const diff = A.aimAt(s, target, dt, rate);
  P.wait -= dt;
  if (diff < tol && P.wait <= 0) { inp.fire = true; P.wait = wait(); }
}
// Lock-on gun: the game steers to the locked fish; fire once roughly on it.
function lockFire(s, P, dt, inp, target) {
  if (s.lock !== target) { s.lock = target; return; }
  const diff = A.aimAt(s, target, dt, 0);
  if (diff < 0.06) inp.fire = true;
}
function keepTarget(s, P, test, choose) {
  if (!P.target || !A.reachableFrom(s, P.target) || A.inBubble(P.target) || !test(P.target) || Math.random() < P.dt * 0.15) {
    const c = reachable(s).filter(test);
    P.target = c.length ? choose(c) : null;
  }
  return P.target;
}
const weighted = c => { const sc = A.director.scene; return pick(c, f => f.type.group === 'boss' && sc && sc.boss ? 40 : Math.sqrt(f.type.group === 'special' ? 20 : A.avgMult(f.type, 'swingy'))); };

// Pole: cast at a fish that eats the bait, ahead of where it swims; play the fight with the given landing rate.
function poleTurn(s, P, dt, landRate) {
  const bb = s.bobber;
  if (bb && bb.state === 'fight') {
    const F = bb.fight;
    if (F.labOk === undefined) F.labOk = Math.random() < landRate;
    if (F.labOk) { if (F.phase === 'green' && !F.pressed && F.t < F.green - 0.12) A.fightPress(bb); }
    else if (F.phase === 'yellow' && F.got >= F.need - 1 && F.t < 0.2) A.fightPress(bb);
    return;
  }
  if (!bb) {
    const W = A.W(), H = A.H();
    const cand = A.fish().filter(f => !f.dead && !f.hooked && A.eatsBait(f.type.id, s.bait) && f.x > 60 && f.x < W - 60 && f.y > 80 && f.y < H - 80);
    const f = cand[Math.floor(Math.random() * cand.length)];
    if (f) A.castAt(s, f.x + Math.cos(f.heading) * f.speed * 1.2, f.y + Math.sin(f.heading) * f.speed * 1.2);
    else A.castAt(s, rnd(W * 0.25, W * 0.75), rnd(H * 0.3, H * 0.7));
  } else { const a = Math.atan2(bb.y - A.pivot(s).y, bb.x - A.pivot(s).x); s.off += Math.max(-2 * dt, Math.min(2 * dt, wrap(a - s.normal) - s.off)); }
}
const wrap = a => ((a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
// switch to the pole with a bait this player can afford; false if none
function goPole(s, baits) {
  const ok = Object.keys(baits).filter(k => s.points >= A.BAITS[k].cost * 3);
  if (!ok.length) return false;
  s.mode = 'pole'; s.bait = pick(ok, k => baits[k]); s.lock = null; return true;
}
function goGun(s) { if (s.bobber && s.bobber.state !== 'fight') A.removeBobber(s.bobber); if (!s.bobber) s.mode = 'gun'; }

const BRAIN = {
  sniper(s, P, dt, inp) {
    s.bet = 10;
    const t = keepTarget(s, P, bigOrBoss, c => c.reduce((a, b) => A.avgMult(b.type, 'swingy') > A.avgMult(a.type, 'swingy') ? b : a));
    if (!t) { s.lock = null; return; }
    lockFire(s, P, dt, inp, t);
  },
  sprayer(s, P, dt, inp) {
    s.bet = 1;
    P.target = closest(s, reachable(s));
    freeAim(s, P, dt, inp, P.target, 4, 0.12, () => 0);
  },
  chaser(s, P, dt, inp) {
    if (P.bet == null) P.bet = 2;
    if (P.missStreak >= 12) { P.bet = Math.min(100, P.bet * 2); P.missStreak = 0; }
    s.bet = P.bet;
    freeAim(s, P, dt, inp, keepTarget(s, P, () => true, weighted), 3, 0.08, () => rnd(0.18, 0.4));
  },
  grinder(s, P, dt, inp) {
    s.bet = 2;
    const all = reachable(s), med = all.filter(f => f.type.group === 'medium'), sm = all.filter(f => f.type.group === 'small');
    if (!P.target || !A.reachableFrom(s, P.target) || A.inBubble(P.target) || (P.target.type.group !== 'medium' && med.length)) P.target = closest(s, med.length ? med : sm.length ? sm : all);
    freeAim(s, P, dt, inp, P.target, 3, 0.08, () => rnd(0.3, 0.5));
  },
  whale(s, P, dt, inp) {
    const prize = reachable(s).filter(f => f.type.group === 'boss' || isShark(f)), big = reachable(s).filter(f => f.type.group === 'big');
    const t = prize[0] ? prize.reduce((a, b) => A.avgMult(b.type, 'swingy') > A.avgMult(a.type, 'swingy') ? b : a) : big[0];
    if (t) { s.bet = prize[0] ? 100 : 50; P.target = t; lockFire(s, P, dt, inp, t); return; }
    s.lock = null; s.bet = 10;
    freeAim(s, P, dt, inp, keepTarget(s, P, () => true, weighted), 3, 0.08, () => rnd(0.2, 0.4));
  },
  fisher(s, P, dt, inp) {
    P.switchT = (P.switchT ?? 0) - dt;
    if (P.switchT <= 0 && !s.bobber) {
      if (Math.random() < 0.85 && goPole(s, {worms: 2, shrimp: 2, squid: 3, crab: 3, live: 2, c_ws: 2, c_sc: 2})) P.switchT = rnd(60, 150);
      else { goGun(s); P.switchT = rnd(15, 40); }
    }
    if (s.mode === 'pole') { if (!s.bobber && s.points < A.BAITS[s.bait].cost) { goGun(s); P.switchT = 30; } else return poleTurn(s, P, dt, 0.9); }
    s.bet = 3;
    freeAim(s, P, dt, inp, keepTarget(s, P, () => true, weighted), 3, 0.08, () => rnd(0.2, 0.4));
  },
  casual(s, P, dt, inp) {
    P.phaseT = (P.phaseT ?? rnd(30, 90)) - dt;
    if (P.phaseT <= 0) {
      P.paused = !P.paused; P.phaseT = P.paused ? rnd(10, 40) : rnd(30, 90);
      if (!P.paused && !(Math.random() < 0.2 && goPole(s, {worms: 3, shrimp: 2, squid: 1}))) goGun(s);
    }
    if (P.paused && !(s.bobber && s.bobber.state === 'fight')) return;
    if (s.mode === 'pole') { if (!s.bobber && s.points < A.BAITS[s.bait].cost) goGun(s); else return poleTurn(s, P, dt, 0.8); }
    P.betT = (P.betT ?? 0) - dt;
    if (P.betT <= 0) { s.bet = pick([1, 2, 3, 5], v => ({1: 3, 2: 3, 3: 2, 5: 1})[v]); P.betT = rnd(20, 60); }
    freeAim(s, P, dt, inp, keepTarget(s, P, () => true, weighted), 2.5, 0.1, () => rnd(0.3, 0.7));
  },
  newbie(s, P, dt, inp) {
    P.switchT = (P.switchT ?? rnd(60, 180)) - dt;
    if (P.switchT <= 0 && !s.bobber) { if (s.mode === 'gun' && Math.random() < 0.3 && goPole(s, {worms: 3, shrimp: 2, squid: 2, crab: 1})) P.switchT = rnd(30, 60); else { goGun(s); P.switchT = rnd(60, 180); } }
    if (s.mode === 'pole') { if (!s.bobber && s.points < A.BAITS[s.bait].cost) goGun(s); else return poleTurn(s, P, dt, 0.6); }
    P.betT = (P.betT ?? 0) - dt;
    if (P.betT <= 0) { s.bet = pick([1, 2, 3, 10], v => ({1: 5, 2: 3, 3: 2, 10: 0.5})[v]); P.betT = rnd(30, 90); }
    freeAim(s, P, dt, inp, keepTarget(s, P, () => true, weighted), 1.2, 0.35, () => rnd(0.7, 1.4));
  },
};

// ================= SESSIONS =================
// A seat holds one player at a time. When they bust, quit or go home, the seat sits empty for a short while,
// then the next player type in the rotation sits down, so every type plays every seat over a night.
const sessions = [], seatState = [];
function newSession(i, type, t) {
  const T = TYPES[type];
  const S = {seat: i, type, start: t, end: null, why: null, buyIn: T.buyIn, low: T.buyIn, high: T.buyIn, active: 0,
    w: {gun: 0, pole: 0}, p: {gun: 0, pole: 0}, shots: 0, casts: 0, catches: [], byGroup: {}, best: {pts: 0, x: 0, fish: null}};
  sessions.push(S);
  return S;
}
function sitDown(s, t) {
  const st = seatState[s.i];
  st.type = ORDER[(ORDER.indexOf(st.type) + 1) % ORDER.length];
  st.session = newSession(s.i, st.type, t);
  st.P = {dt: 1 / 30, wait: 0, missStreak: 0};
  st.empty = 0;
  s.points = TYPES[st.type].buyIn; s.bet = 1; s.mode = 'gun'; s.lock = null; s.off = 0;
}
function leave(s, why, t) {
  const st = seatState[s.i], S = st.session;
  S.end = t; S.why = why; S.left = s.points;
  if (s.bobber) A.removeBobber(s.bobber);
  s.lock = null; s.mode = 'gun';
  st.P = null; st.empty = rnd(10, 30);
  st.last = S; // bullets still in the water keep paying this player
}
globalThis.__lab = {
  control(s, dt, inp) {
    const st = seatState[s.i]; if (!st) return;
    const t = A.time();
    if (!st.P) { if ((st.empty -= dt) <= 0) sitDown(s, t); return; }
    const S = st.session, T = TYPES[st.type];
    S.low = Math.min(S.low, s.points); S.high = Math.max(S.high, s.points);
    const inFight = s.bobber && s.bobber.state === 'fight', waiting = s.bobber && s.bobber.state === 'wait';
    if (!inFight && !waiting) {
      if (s.points < 1) return leave(s, 'bust', t);
      if (st.type === 'casual' && s.points <= T.buyIn - 400) return leave(s, 'quit', t);
      if ((t - S.start) / 60 >= T.maxMin) return leave(s, 'home', t);
    }
    st.P.dt = dt;
    if (!(st.type === 'casual' && st.P.paused)) S.active += dt;
    BRAIN[st.type](s, st.P, dt, inp);
  },
  wager(s, n, kind) {
    const st = seatState[s.i], S = st && st.P && st.session; if (!S) return;
    S.w[kind] += n; if (kind === 'gun') { S.shots++; st.P.missStreak++; } else S.casts++;
  },
  pay(s, n, kind, group, id) {
    const st = seatState[s.i]; if (!st) return;
    const S = st.P ? st.session : st.last; if (!S) return;
    S.p[kind] += n;
    const unit = kind === 'gun' ? Math.max(1, s.bet) : A.BAITS[s.bait] ? A.BAITS[s.bait].cost : 1;
    S.catches.push(S.active);
    S.byGroup[group] = (S.byGroup[group] || 0) + 1;
    if (n > S.best.pts) S.best = {pts: n, x: +(n / unit).toFixed(1), fish: id, kind};
    if (st.P) st.P.missStreak = 0, st.P.bet = null;
  },
};

// ================= RUN =================
eval(script);
const R = window.__reef;
A = globalThis.__labApi;
R.startGame();
R.settings.seatInput = Array(10).fill('bot');
const seats = R.seats();
if (seats.length !== 10) throw new Error('expected 10 seats, got ' + seats.length);
for (const s of seats) { seatState[s.i] = {type: ORDER[(s.i + ORDER.length - 1) % ORDER.length], P: null, empty: 0}; s.points = 0; }
const dt = 1 / 30, steps = Math.round(minutes * 60 / dt);
let errors = 0;
const t0 = Date.now();
for (let i = 0; i < steps; i++) {
  try { R.update(dt); if (i % 300 === 0) R.drawScene(); } catch (e) { errors++; if (errors < 5) console.error(e.stack); }
  if (i % (steps / 10 | 0) === 0 && i) process.stdout.write(`  ${Math.round(100 * i / steps)}%`);
}
console.log();
const endT = R.director && A.time();
for (const s of seats) { const st = seatState[s.i]; if (st.P) { leave(s, 'closing', endT); } }

// ================= NUMBERS =================
const sum = (a, f) => a.reduce((x, o) => x + f(o), 0);
const pct = (p, w) => w ? 100 * p / w : null;
const quant = (a, q) => { if (!a.length) return null; const b = [...a].sort((x, y) => x - y); return b[Math.floor(q * (b.length - 1))]; };
function gaps(S) { // seconds of active play between catches, counting the stretch before the first and after the last
  const g = [], c = S.catches; let prev = 0;
  for (const t of c) { g.push(t - prev); prev = t; }
  g.push(S.active - prev);
  return {between: c.slice(1).map((t, k) => t - c[k]), dry: Math.max(...g)};
}
function summarize(list) {
  const W = sum(list, S => S.w.gun + S.w.pole), P = sum(list, S => S.p.gun + S.p.pole);
  const gW = sum(list, S => S.w.gun), gP = sum(list, S => S.p.gun), pW = sum(list, S => S.w.pole), pP = sum(list, S => S.p.pole);
  const btw = list.flatMap(S => gaps(S).between), dry = list.map(S => gaps(S).dry);
  const busts = list.filter(S => S.why === 'bust');
  const best = list.reduce((a, S) => S.best.pts > a.pts ? S.best : a, {pts: 0});
  const byGroup = {}; for (const g of GROUP_ORDER) byGroup[g] = sum(list, S => S.byGroup[g] || 0);
  const activeMin = sum(list, S => S.active) / 60;
  return {
    sessions: list.length, wagered: W, paid: P, payback: pct(P, W), gunPayback: pct(gP, gW), polePayback: pct(pP, pW), poleShare: pct(pW, W),
    bustRate: list.length ? 100 * busts.length / list.length : null,
    medianSessionMin: quant(list.map(S => (S.end - S.start) / 60), 0.5),
    medianBustMin: quant(busts.map(S => (S.end - S.start) / 60), 0.5),
    medianNet: quant(list.map(S => S.left - S.buyIn), 0.5),
    upShare: list.length ? 100 * list.filter(S => S.left > S.buyIn).length / list.length : null,
    wageredPerMin: activeMin ? W / activeMin : null,
    catchesPerMin: activeMin ? sum(list, S => S.catches.length) / activeMin : null,
    medianBetweenWins: quant(btw, 0.5), p90BetweenWins: quant(btw, 0.9),
    longestDry: dry.length ? Math.max(...dry) : null, medianLongestDry: quant(dry, 0.5),
    best, byGroup, whys: list.reduce((a, S) => (a[S.why] = (a[S.why] || 0) + 1, a), {}),
  };
}
const done = sessions.filter(S => S.active > 30); // drop seats that closed seconds after sitting down
const byType = Object.fromEntries(ORDER.map(k => [k, summarize(done.filter(S => S.type === k))]));
const bySeat = Array.from({length: 10}, (_, i) => summarize(done.filter(S => S.seat === i)));
const all = summarize(done);
const L = R.ledger;
const check = {labWagered: sum(sessions, S => S.w.gun + S.w.pole), gameWagered: L.totW, labPaid: sum(sessions, S => S.p.gun + S.p.pole), gamePaid: L.totP};

// ================= WRITE THE REPORT =================
const now = new Date(), z = n => String(n).padStart(2, '0');
const stamp = `${now.getFullYear()}-${z(now.getMonth() + 1)}-${z(now.getDate())}_${z(now.getHours())}${z(now.getMinutes())}`;
const reportsDir = path.join(ROOT, 'reports'), folder = `${stamp}_${label}_s${seed}`, outDir = path.join(reportsDir, folder);
fs.mkdirSync(outDir, {recursive: true});
const lawsFile = path.join(ROOT, 'route_library/laws/laws.json');
const laws = fs.existsSync(lawsFile) ? JSON.parse(fs.readFileSync(lawsFile, 'utf8')) : null;
const sha = b => crypto.createHash('sha1').update(b).digest('hex').slice(0, 12);
const settingsOut = {
  ran: now.toISOString(), label, seed, minutes, errors, seats: 10, rerun: `node lab/playerlab.js --minutes ${minutes} --seed ${seed} --label ${label}`,
  game: {file: path.relative(ROOT, gameFile), version: 7, sha1: sha(html), difficulty: R.settings.diff, groupPaybacks: Object.fromEntries(Object.entries(R.GROUPS).map(([k, g]) => [k, g.pb]))},
  laws: laws ? {file: 'route_library/laws/laws.json', sha1: sha(fs.readFileSync(lawsFile)), law_zero: laws.law_zero,
    inGame: [...laws.big_fish, ...laws.medium_fish].filter(l => /in game/.test(l.status)).map(l => ({id: l.id, value: l.value}))} : null,
  playerTypes: TYPES, ledgerCheck: check,
};
fs.writeFileSync(path.join(outDir, 'settings.json'), JSON.stringify(settingsOut, null, 1));

const r2 = v => v == null ? '' : typeof v === 'number' ? +v.toFixed(2) : v;
const csv = [['scope', 'name', 'metric', 'value']];
const flat = (scope, name, o) => { for (const [k, v] of Object.entries(o)) {
  if (k === 'best') { csv.push([scope, name, 'biggestWin', v.pts], [scope, name, 'biggestWinX', v.x || ''], [scope, name, 'biggestWinFish', v.fish || '']); }
  else if (k === 'byGroup') for (const [g, n] of Object.entries(v)) csv.push([scope, name, 'caught_' + g, n]);
  else if (k === 'whys') for (const [g, n] of Object.entries(v)) csv.push([scope, name, 'ended_' + g, n]);
  else csv.push([scope, name, k, r2(v)]);
} };
flat('all', 'all', all);
for (const k of ORDER) flat('type', k, byType[k]);
bySeat.forEach((o, i) => flat('seat', 'P' + (i + 1), o));
fs.writeFileSync(path.join(outDir, 'numbers.csv'), csv.map(r => r.join(',')).join('\n') + '\n');

// ---- report.html ----
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
const f1 = v => v == null ? '–' : v.toFixed(1), f0 = v => v == null ? '–' : Math.round(v).toLocaleString('en-US');
const pc = v => v == null ? '–' : v.toFixed(1) + '%';
const sec = v => v == null ? '–' : v < 90 ? v.toFixed(0) + ' s' : (v / 60).toFixed(1) + ' min';
const pbClass = v => v == null ? '' : v > 103 ? 'hot' : v < 85 ? 'cold' : '';
const typeRows = ORDER.map(k => { const o = byType[k], T = TYPES[k]; return `<tr><th scope="row">${T.name}</th><td class="${pbClass(o.payback)}">${pc(o.payback)}</td><td>${pc(o.gunPayback)}</td><td>${o.poleShare > 1 ? pc(o.polePayback) : '–'}</td><td>${o.sessions}</td><td>${pc(o.bustRate)}</td><td>${f1(o.medianBustMin)}${o.medianBustMin == null ? '' : ' min'}</td><td>${f0(o.medianNet)}</td><td>${f0(o.best.pts)}${o.best.x ? ` <span class="sub">${o.best.x}× ${esc(o.best.fish)}</span>` : ''}</td><td>${sec(o.medianBetweenWins)}</td><td>${sec(o.longestDry)}</td></tr>`; }).join('');
const groupRows = ORDER.map(k => { const o = byType[k], tot = Object.values(o.byGroup).reduce((a, b) => a + b, 0) || 1; return `<tr><th scope="row">${TYPES[k].name}</th>${GROUP_ORDER.map(g => `<td>${f0(o.byGroup[g])}<span class="bar" style="--w:${(100 * o.byGroup[g] / tot).toFixed(1)}%"></span></td>`).join('')}</tr>`; }).join('');
const groupPBRows = GROUP_ORDER.filter(g => L.byGroup[g]).map(g => { const o = L.byGroup[g]; return `<tr><th scope="row">${g[0].toUpperCase() + g.slice(1)}</th><td>${pc(100 * (R.GROUPS[g] ? R.GROUPS[g].pb : 0))}</td><td class="${pbClass(pct(o.paid, o.hitW))}">${pc(pct(o.paid, o.hitW))}</td><td>${f0(o.hits)}</td><td>${f0(o.catches)}</td><td>${f0(o.hitW)}</td><td>${f0(o.paid)}</td></tr>`; }).join('');
const seatRows = bySeat.map((o, i) => `<tr><th scope="row">P${i + 1} <span class="sub">${i < 5 ? 'bottom' : 'top'}</span></th><td class="${pbClass(o.payback)}">${pc(o.payback)}</td><td>${pc(o.gunPayback)}</td><td>${f0(o.wagered)}</td><td>${f1(o.catchesPerMin)}</td><td>${o.sessions}</td></tr>`).join('');
const gunPBs = bySeat.map(o => o.gunPayback).filter(v => v != null), seatSpread = Math.max(...gunPBs) - Math.min(...gunPBs);
const ranked = ORDER.filter(k => byType[k].payback != null).sort((a, b) => byType[b].payback - byType[a].payback);
const sanity = Math.abs(check.labWagered - check.gameWagered) / Math.max(1, check.gameWagered) < 0.001 && Math.abs(check.labPaid - check.gamePaid) / Math.max(1, check.gamePaid) < 0.001;
const notes = [
  `Whole table paid back <b>${pc(all.payback)}</b> (gun ${pc(all.gunPayback)}, pole ${pc(all.polePayback)}) over ${minutes} simulated minutes. The weekly target is about 97–98%; one night of ${minutes / 60} hours can swing about ±4% because of bosses, so compare several seeds before changing anything.`,
  `Best-paid type: <b>${TYPES[ranked[0]].name}</b> at ${pc(byType[ranked[0]].payback)}. Worst: <b>${TYPES[ranked.at(-1)].name}</b> at ${pc(byType[ranked.at(-1)].payback)}. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).`,
  `Seat fairness: gun payback across the 10 seats spans ${seatSpread.toFixed(1)} points (${pc(Math.min(...gunPBs))} to ${pc(Math.max(...gunPBs))}). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.`,
  sanity ? 'Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.' : `<b>Bookkeeping check failed</b>: lab wagered ${f0(check.labWagered)} vs game ${f0(check.gameWagered)}, lab paid ${f0(check.labPaid)} vs game ${f0(check.gamePaid)}.`,
  errors ? `<b>${errors} errors</b> were thrown during the run (see the terminal output).` : 'No errors during the run.',
];
const reportHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Player Lab ${esc(stamp)}</title>
<style>
:root{--bg:#f6f8f8;--card:#fff;--ink:#14221f;--muted:#5b6b67;--line:#dbe3e1;--accent:#0f8a78;--hot:#b4471f;--cold:#2a5fa8;--bar:#0f8a7833}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0e1514;--card:#16201e;--ink:#e6efed;--muted:#93a5a1;--line:#2a3734;--accent:#3cc7b0;--hot:#ff8a5c;--cold:#7fb0ff;--bar:#3cc7b033}}
:root[data-theme="dark"]{--bg:#0e1514;--card:#16201e;--ink:#e6efed;--muted:#93a5a1;--line:#2a3734;--accent:#3cc7b0;--hot:#ff8a5c;--cold:#7fb0ff;--bar:#3cc7b033}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,sans-serif}
main{max-width:1100px;margin:0 auto;padding:24px 16px 48px}h1{font-size:26px;margin:0 0 4px}h2{font-size:18px;margin:32px 0 8px}
.meta{color:var(--muted);font-size:13px}.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:20px 0}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 14px}.kpi b{display:block;font-size:24px;font-variant-numeric:tabular-nums}.kpi span{color:var(--muted);font-size:13px}
.wrap{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:10px}table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums;font-size:14px}
th,td{padding:8px 10px;text-align:right;border-bottom:1px solid var(--line);white-space:nowrap}th[scope=row],thead th:first-child{text-align:left}thead th{font-size:12px;color:var(--muted);font-weight:600}
tr:last-child>*{border-bottom:0}.sub{color:var(--muted);font-size:12px;font-weight:400}.hot{color:var(--hot);font-weight:700}.cold{color:var(--cold);font-weight:700}
td{position:relative}.bar{display:block;height:4px;margin-top:3px;background:linear-gradient(90deg,var(--accent) var(--w),var(--bar) var(--w));border-radius:2px}
ul.notes{padding-left:20px}ul.notes li{margin:6px 0}dl{display:grid;grid-template-columns:max-content 1fr;gap:4px 16px;margin:0}dt{font-weight:600}dd{margin:0;color:var(--muted)}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px}code{font-size:13px}a{color:var(--accent)}
</style></head><body><main>
<p class="meta"><a href="../index.html">All reports</a></p>
<h1>Player lab: ${esc(label)}</h1>
<p class="meta">${esc(now.toLocaleString('en-US'))} · Peacock Reef v7 (${sha(html)}) · ${minutes} simulated minutes · 10 seats · seed ${seed} · ${done.length} player sessions</p>
<div class="kpis">
<div class="kpi"><b>${pc(all.payback)}</b><span>Table payback</span></div>
<div class="kpi"><b>${pc(all.gunPayback)}</b><span>Gun payback</span></div>
<div class="kpi"><b>${pc(all.polePayback)}</b><span>Pole payback</span></div>
<div class="kpi"><b>${f0(all.wagered)}</b><span>Credits played</span></div>
<div class="kpi"><b>${seatSpread.toFixed(1)} pts</b><span>Seat spread (gun)</span></div>
</div>
<h2>What this run says</h2><ul class="notes">${notes.map(n => `<li>${n}</li>`).join('')}</ul>
<h2>By player type</h2>
<div class="wrap"><table><thead><tr><th>Type</th><th>Payback</th><th>Gun</th><th>Pole</th><th>Sessions</th><th>Busted</th><th>Time to bust<br><span class="sub">median</span></th><th>Net per session<br><span class="sub">median</span></th><th>Biggest win</th><th>Between wins<br><span class="sub">median</span></th><th>Longest dry spell</th></tr></thead><tbody>${typeRows}</tbody></table></div>
<p class="meta">Payback over 103% is marked warm, under 85% cool. Times between wins and dry spells count only time spent playing (a Casual's pauses don't count).</p>
<h2>Fish caught by group</h2>
<div class="wrap"><table><thead><tr><th>Type</th>${GROUP_ORDER.map(g => `<th>${g[0].toUpperCase() + g.slice(1)}</th>`).join('')}</tr></thead><tbody>${groupRows}</tbody></table></div>
<h2>Gun payback by fish group</h2>
<div class="wrap"><table><thead><tr><th>Group</th><th>Designed</th><th>Actual per hit</th><th>Hits</th><th>Catches</th><th>Wagered on hits</th><th>Paid</th></tr></thead><tbody>${groupPBRows}</tbody></table></div>
<p class="meta">Counts only bullets that hit a fish. Bullets that miss everything are wagered but never reach a fish, so the gun payback above can sit below these numbers.</p>
<h2>Seat fairness</h2>
<div class="wrap"><table><thead><tr><th>Seat</th><th>Payback</th><th>Gun</th><th>Credits played</th><th>Catches / min</th><th>Sessions</th></tr></thead><tbody>${seatRows}</tbody></table></div>
<h2>The player types</h2>
<div class="card"><dl>${ORDER.map(k => `<dt>${TYPES[k].name}</dt><dd>${esc(TYPES[k].about)} Sits down with ${f0(TYPES[k].buyIn)}, goes home after ${TYPES[k].maxMin} min.</dd>`).join('')}</dl></div>
<p class="meta">A player leaves when they bust, quit (Casual only) or hit their time limit; the seat stays empty 10–30 s, then the next type in the rotation sits down. Rerun this exact night: <code>${esc(settingsOut.rerun)}</code></p>
</main></body></html>`;
fs.writeFileSync(path.join(outDir, 'report.html'), reportHtml);

// ---- summary.md: a few plain lines the chat Claude can read through Google Drive ----
const plain = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
const summary = [
  `# Player lab: ${label} (seed ${seed})`, '',
  `${stamp.replace('_', ' ')} · Peacock Reef v7 (${sha(html)}) · ${minutes} simulated min · 10 seats · ${done.length} sessions · errors ${errors}`, '',
  `- Table payback ${pc(all.payback)} (gun ${pc(all.gunPayback)}, pole ${pc(all.polePayback)}); seat spread ${seatSpread.toFixed(1)} pts`,
  `- By type: ${ORDER.map(k => `${TYPES[k].name} ${pc(byType[k].payback)}`).join(', ')}`,
  `- Bust rate: ${ORDER.map(k => `${TYPES[k].name} ${pc(byType[k].bustRate)}`).join(', ')}`,
  `- Gun per-hit payback by group (designed in brackets): ${GROUP_ORDER.filter(g => L.byGroup[g]).map(g => `${g} ${pc(pct(L.byGroup[g].paid, L.byGroup[g].hitW))} [${pc(100 * R.GROUPS[g].pb)}]`).join(', ')}`,
  '', ...notes.map(n => '- ' + plain(n)), '',
  `Full page: report.html · numbers: numbers.csv · rerun: \`${settingsOut.rerun}\``, '',
];
fs.writeFileSync(path.join(outDir, 'summary.md'), summary.join('\n'));

// ---- running log + index ----
const logFile = path.join(reportsDir, 'LOG.csv');
const logHead = ['when', 'label', 'folder', 'seed', 'minutes', 'game_sha1', 'errors', 'sessions', 'payback', 'gun_payback', 'pole_payback', 'seat_spread', ...ORDER.map(k => k + '_payback')];
if (!fs.existsSync(logFile)) fs.writeFileSync(logFile, logHead.join(',') + '\n');
fs.appendFileSync(logFile, [now.toISOString(), label, folder, seed, minutes, sha(html), errors, done.length, r2(all.payback), r2(all.gunPayback), r2(all.polePayback), r2(seatSpread), ...ORDER.map(k => r2(byType[k].payback))].join(',') + '\n');
const logRows = fs.readFileSync(logFile, 'utf8').trim().split('\n').map(l => l.split(','));
const head = logRows.shift();
const col = n => head.indexOf(n);
const indexHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Player Lab Reports</title>
<style>:root{--bg:#f6f8f8;--card:#fff;--ink:#14221f;--muted:#5b6b67;--line:#dbe3e1;--accent:#0f8a78}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0e1514;--card:#16201e;--ink:#e6efed;--muted:#93a5a1;--line:#2a3734;--accent:#3cc7b0}}
:root[data-theme="dark"]{--bg:#0e1514;--card:#16201e;--ink:#e6efed;--muted:#93a5a1;--line:#2a3734;--accent:#3cc7b0}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,sans-serif}main{max-width:1100px;margin:0 auto;padding:24px 16px}
h1{font-size:26px}.wrap{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:10px}table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums;font-size:14px}
th,td{padding:8px 10px;text-align:right;border-bottom:1px solid var(--line);white-space:nowrap}th:first-child,td:first-child{text-align:left}thead th{font-size:12px;color:var(--muted)}a{color:var(--accent)}p{color:var(--muted)}</style></head>
<body><main><h1>Player lab reports</h1><p>One row per run, newest first. Paybacks in %. Full history in LOG.csv.</p>
<div class="wrap"><table><thead><tr><th>Run</th><th>Seed</th><th>Min</th><th>Table</th><th>Gun</th><th>Pole</th><th>Seat spread</th>${ORDER.map(k => `<th>${TYPES[k].name}</th>`).join('')}</tr></thead><tbody>
${logRows.reverse().map(r => `<tr><td><a href="${esc(r[col('folder')])}/report.html">${esc(r[col('folder')])}</a></td><td>${esc(r[col('seed')])}</td><td>${esc(r[col('minutes')])}</td><td>${esc(r[col('payback')])}</td><td>${esc(r[col('gun_payback')])}</td><td>${esc(r[col('pole_payback')])}</td><td>${esc(r[col('seat_spread')])}</td>${ORDER.map(k => `<td>${esc(r[col(k + '_payback')] ?? '')}</td>`).join('')}</tr>`).join('\n')}
</tbody></table></div></main></body></html>`;
fs.writeFileSync(path.join(reportsDir, 'index.html'), indexHtml);

// ---- terminal summary ----
console.log(`ran ${minutes} simulated min in ${((Date.now() - t0) / 1000).toFixed(0)} s, seed ${seed}, errors ${errors}, ${done.length} sessions, ledger check ${sanity ? 'ok' : 'FAILED'}`);
console.log(`table ${pc(all.payback)}  gun ${pc(all.gunPayback)}  pole ${pc(all.polePayback)}  seat spread ${seatSpread.toFixed(1)} pts`);
for (const k of ORDER) { const o = byType[k]; console.log(`${TYPES[k].name.padEnd(8)} payback ${pc(o.payback).padStart(7)}  sessions ${String(o.sessions).padStart(3)}  bust ${pc(o.bustRate).padStart(6)}  best ${f0(o.best.pts).padStart(7)}  between wins ${sec(o.medianBetweenWins).padStart(7)}  dry ${sec(o.longestDry)}`); }
for (const g of GROUP_ORDER) { const o = L.byGroup[g]; if (o) console.log(`gun ${g.padEnd(8)} per-hit payback ${pc(pct(o.paid, o.hitW)).padStart(7)}  hits ${o.hits}  catches ${o.catches}`); }
console.log('report: ' + path.relative(ROOT, path.join(outDir, 'report.html')));
