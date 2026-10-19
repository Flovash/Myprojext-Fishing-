// Player lab: run Peacock Reef headless with 8 player types rotating through 10 seats, then write a dated report and a replay page.
// usage: node lab/playerlab.js [--game game/peacock_reef.html] [--minutes 240] [--seed 1] [--label first-run]
//          [--env quiet_afternoon] (a table setup from lab/environments.json: seats, player mix, game settings)
//          [--seats 4] [--mix whale,whale,casual] [--set density=lots] (the same by hand; these win over --env)
//          [--law season_length_waves=3] (any law, repeatable; value is JSON)  [--plays on|off|only:a,b|except:a]
//          [--fish tuna.group_sizes=[2,6]] (any fish.json field, repeatable)  [--no-library] (don't write route_library/data)
//          [--out some/folder] (a trial run: the report goes there; LOG.csv, index.html and the library are left alone)
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const {patchGame, labTweak, labPlayers, spreadSeats} = require('./sim.js');
const {writeReplay} = require('./replay.js');
const {installDetMath, installDetSort} = require('./detmath.js');

const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const args = k => process.argv.flatMap((a, i) => a === '--' + k && process.argv[i + 1] ? [process.argv[i + 1]] : []);
const gameFile = path.resolve(ROOT, arg('game', 'game/peacock_reef.html'));
const minutes = +arg('minutes', 240), seed = +arg('seed', Date.now() % 1e6 | 0);
const label = String(arg('label', 'run')).replace(/[^\w-]+/g, '-');
const parseKV = s => { const i = s.indexOf('='); if (i < 1) throw new Error('expected id=value, got ' + s); const v = s.slice(i + 1); let val; try { val = JSON.parse(v); } catch (e) { val = v; } return [s.slice(0, i), val]; };
const lawOverrides = Object.fromEntries(args('law').map(parseKV));
const fishOverrides = args('fish').map(parseKV);
const playsArg = arg('plays', 'on');
const outArg = arg('out', null);
const writeLibrary = !process.argv.includes('--no-library') && !outArg;

// ================= TABLE SETUP (environment) =================
const envName = arg('env', null), ENVS = JSON.parse(fs.readFileSync(path.join(__dirname, 'environments.json'), 'utf8')).environments;
if (envName && !ENVS[envName]) throw new Error(`unknown --env ${envName} (have: ${Object.keys(ENVS).join(', ')})`);
const env = envName ? ENVS[envName] : {};
const mix = arg('mix', null) ? arg('mix').split(',') : env.mix || null;
const seatCount = +arg('seats', env.seats || 10);
const gameSettings = Object.assign({}, env.settings || {}, Object.fromEntries(args('set').map(parseKV)));
const setup = {env: envName, seats: spreadSeats(seatCount), mix, settings: gameSettings};

// ================= SEEDED RANDOM =================
// Every Math.random in the game and the lab comes from this, so a seed replays the same night.
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
Math.random = mulberry32(seed);
installDetMath(Math); installDetSort(Array.prototype); // math and sorting that give the same answer in node and every browser (lab/detmath.js)

// ================= LOAD + PATCH THE GAME =================
const html = fs.readFileSync(gameFile, 'utf8');
const {script, hasLib} = patchGame(html);
if (!hasLib && (Object.keys(lawOverrides).length || fishOverrides.length || playsArg !== 'on')) throw new Error('this game file has no route library block, so --law, --fish and --plays cannot apply');
const tweakCfg = {laws: lawOverrides, fish: fishOverrides, plays: playsArg}, tweaks = {laws: {}, fish: [], plays: null};
globalThis.__labTweak = LIB => labTweak(LIB, tweakCfg, tweaks);
const GAME_SETTING_KEYS = ['diff', 'density', 'speed', 'boss', 'fire'];
for (const k of Object.keys(gameSettings)) if (!GAME_SETTING_KEYS.includes(k)) throw new Error(`unknown --set ${k} (game settings: ${GAME_SETTING_KEYS.join(', ')})`);
if (Object.keys(gameSettings).length) globalThis.__labSettings = gameSettings;

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

// ================= PLAYERS (lab/sim.js) =================
const lab = labPlayers({mix, seats: setup.seats});
const {TYPES, ORDER, sessions, seatState, leave} = lab;
const GROUP_ORDER = ['tiny', 'small', 'medium', 'big', 'boss', 'special'];
globalThis.__lab = lab;

// ================= RUN =================
eval(script);
const R = window.__reef;
const A = globalThis.__labApi;
lab.setApi(A);
// the director's record: every school sent (when it is finished) and every play fired
const dispatches = [], playsFired = [];
if (R.hooks) { R.hooks.dispatch = d => dispatches.push(d); R.hooks.play = p => playsFired.push(p); }
const seasonsSeen = [], checkpoints = []; // checkpoints: the table's credits in and out at every minute, for the replay page
R.startGame();
R.settings.seatInput = Array(10).fill('bot');
const seats = R.seats();
if (seats.length !== 10) throw new Error('expected 10 seats, got ' + seats.length);
lab.initSeats(seats, R.settings);
const dt = 1 / 30, steps = Math.round(minutes * 60 / dt);
let errors = 0;
const t0 = Date.now();
for (let i = 0; i < steps; i++) {
  try { R.update(dt); if (i % 300 === 0) R.drawScene(); } catch (e) { errors++; if (errors < 5) console.error(e.stack); }
  if ((i + 1) % 1800 === 0) checkpoints.push([R.ledger.totW, R.ledger.totP]);
  if (R.season && (!seasonsSeen.length || seasonsSeen[seasonsSeen.length - 1].name !== R.season.name)) seasonsSeen.push({t: A.time(), name: R.season.name});
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
    meanSessionMin: list.length ? sum(list, S => (S.end - S.start) / 60) / list.length : null,
    medianBustMin: quant(busts.map(S => (S.end - S.start) / 60), 0.5),
    medianNet: quant(list.map(S => S.left - S.buyIn), 0.5),
    upShare: list.length ? 100 * list.filter(S => S.left > S.buyIn).length / list.length : null,
    wageredPerMin: activeMin ? W / activeMin : null,
    catchesPerMin: activeMin ? sum(list, S => S.catches.length) / activeMin : null,
    medianBetweenWins: quant(btw, 0.5), p90BetweenWins: quant(btw, 0.9),
    longestDry: dry.length ? Math.max(...dry) : null, medianLongestDry: quant(dry, 0.5), p90LongestDry: quant(dry, 0.9),
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
const GV = R.GAME_VERSION || 7;
const now = new Date(), z = n => String(n).padStart(2, '0');
const stamp = `${now.getFullYear()}-${z(now.getMonth() + 1)}-${z(now.getDate())}_${z(now.getHours())}${z(now.getMinutes())}`;
const reportsDir = outArg ? path.resolve(outArg) : path.join(ROOT, 'reports'), folder = `${stamp}_${label}_s${seed}`, outDir = path.join(reportsDir, folder);
fs.mkdirSync(outDir, {recursive: true});
const lawsFile = path.join(ROOT, 'route_library/director/laws.json');
const laws = fs.existsSync(lawsFile) ? JSON.parse(fs.readFileSync(lawsFile, 'utf8')) : null;
const sha = b => crypto.createHash('sha1').update(b).digest('hex').slice(0, 12);
const settingsOut = {
  ran: now.toISOString(), label, seed, minutes, errors, seats: setup.seats.length, rerun: 'node lab/playerlab.js ' + ['--minutes', minutes, '--seed', seed, '--label', label, ...process.argv.slice(2).filter((a, i, all) => !['--minutes', '--seed', '--label'].includes(a) && !['--minutes', '--seed', '--label'].includes(all[i - 1]))].map(a => /^[\w.,:=-]+$/.test(String(a)) ? a : `'${a}'`).join(' '),
  game: {file: path.relative(ROOT, gameFile), version: GV, sha1: sha(html), difficulty: R.settings.diff, groupPaybacks: Object.fromEntries(Object.entries(R.GROUPS).map(([k, g]) => [k, g.pb]))},
  laws: laws ? {file: 'route_library/director/laws.json', sha1: sha(fs.readFileSync(lawsFile)), law_zero: laws.law_zero,
    inGame: [...laws.big_fish, ...laws.medium_fish].filter(l => /in game/.test(l.status)).map(l => ({id: l.id, value: l.value}))} : null,
  director: R.LIB ? {lawsChanged: tweaks.laws, fishChanged: tweaks.fish, playsOn: tweaks.plays, laws: R.LAW, seasons: seasonsSeen.length} : null,
  setup, playerTypes: TYPES, ledgerCheck: check,
};
fs.writeFileSync(path.join(outDir, 'settings.json'), JSON.stringify(settingsOut, null, 1));
// parallel lab runs share LOG.csv and the route library's data files: take turns writing them
function withLock(fn) {
  const lock = path.join(ROOT, 'reports', '.lock'), t0 = Date.now();
  for (;;) { try { fs.mkdirSync(lock); break; } catch (e) { if (Date.now() - t0 > 120000) { fs.rmSync(lock, {recursive: true, force: true}); continue; } Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100); } }
  try { return fn(); } finally { fs.rmSync(lock, {recursive: true, force: true}); }
}

// ================= THE DIRECTOR'S RECORD =================
// One row per school sent (dispatches.csv here, appended to route_library/data/dispatch_log.csv), the route scoreboard
// rebuilt from every run so far, and this run's rows added to each route's stats.csv.
const libFolder = path.join(ROOT, 'route_library');
const libId = g => (R.LIB && R.LIB.fish[g] && R.LIB.fish[g].lib) || g;
const csvCell = v => v == null ? '' : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v;
const DISPATCH_COLS = ['run_id', 't_sent', 'wave', 'season', 'scene', 'fish', 'route', 'variant', 'formation', 'size', 'seats_passed', 'shark_on_screen', 'manta_on_screen',
  'hits', 'caught', 'escaped', 'first_catch_s', 'credits_wagered_on_it', 'credits_paid', 'players_shooting_it', 'pole_caught', 'via', 't_end'];
const bits = n => { let c = 0; while (n) { c += n & 1; n >>>= 1; } return c; };
const dispatchRows = dispatches.map(d => [folder, d.t.toFixed(1), d.wave, d.season, d.scene, libId(d.fish), d.route, d.variant, d.formation, d.size, d.seats.join(' '), d.sharkOn ? 1 : 0, d.mantaOn ? 1 : 0,
  d.hits, d.caught, d.escaped, d.firstCatch == null ? '' : d.firstCatch.toFixed(1), d.wagered, d.paid, bits(d.shooters), d.poleCaught, d.play || '', d.end.toFixed(1)]);
const toCsv = (head, rows) => [head, ...rows].map(r => r.map(csvCell).join(',')).join('\n') + '\n';
const parseCsv = text => { // small CSV reader (quotes only appear around commas in notes)
  const rows = []; for (const line of text.trim().split('\n')) { const out = []; let cur = '', q = false; for (const ch of line) { if (ch === '"') q = !q; else if (ch === ',' && !q) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); rows.push(out); } return rows; };
// group dispatch rows into scoreboard rows
function scoreRows(rows, key) {
  const g = new Map(), C = Object.fromEntries(DISPATCH_COLS.map((c, i) => [c, i]));
  for (const r of rows) {
    const k = key(r, C); if (!g.has(k)) g.set(k, {k, sends: 0, fish: 0, caught: 0, firstSum: 0, firstN: 0, hits: 0, hitsCaught: 0, w: 0, p: 0});
    const o = g.get(k), caught = +r[C.caught];
    // +x2: two mirrored schools of this size
    o.sends++; o.fish += +r[C.size] * (r[C.variant].includes('+x2') ? 2 : 1); o.caught += caught; o.hits += +r[C.hits]; o.w += +r[C.credits_wagered_on_it]; o.p += +r[C.credits_paid];
    if (caught) o.hitsCaught += caught;
    if (r[C.first_catch_s] !== '') { o.firstSum += +r[C.first_catch_s]; o.firstN++; }
  }
  return [...g.values()].map(o => ({...o, perSend: o.caught / o.sends, rate: o.fish ? o.caught / o.fish : 0, first: o.firstN ? o.firstSum / o.firstN : null,
    hitsPer: o.caught ? o.hits / o.caught : null, pb: o.w ? 100 * o.p / o.w : null}));
}
const SCORE_KEY = (r, C) => [r[C.fish], r[C.route], r[C.formation], r[C.size], r[C.via] || '-'].join('|');
const thisRunScore = scoreRows(dispatchRows, SCORE_KEY);
if (dispatches.length) {
  fs.writeFileSync(path.join(outDir, 'dispatches.csv'), toCsv(DISPATCH_COLS, dispatchRows));
  if (writeLibrary && fs.existsSync(libFolder)) withLock(() => {
    const dataDir = path.join(libFolder, 'data'), logF = path.join(dataDir, 'dispatch_log.csv');
    fs.mkdirSync(dataDir, {recursive: true});
    if (!fs.existsSync(logF)) fs.writeFileSync(logF, DISPATCH_COLS.join(',') + '\n');
    fs.appendFileSync(logF, dispatchRows.map(r => r.map(csvCell).join(',')).join('\n') + '\n');
    const all = parseCsv(fs.readFileSync(logF, 'utf8')).slice(1);
    const board = scoreRows(all, SCORE_KEY).sort((a, b) => a.k < b.k ? -1 : 1);
    const f2 = v => v == null ? '' : +v.toFixed(2);
    fs.writeFileSync(path.join(dataDir, 'route_scoreboard.csv'), toCsv(['fish', 'route', 'formation', 'size', 'via', 'sends', 'avg_caught_per_send', 'catch_rate_per_fish', 'avg_first_catch_s', 'avg_hits_to_catch', 'payback_on_it', 'wagered', 'paid'],
      board.map(o => [...o.k.split('|'), o.sends, f2(o.perSend), f2(o.rate), f2(o.first), f2(o.hitsPer), f2(o.pb), o.w, o.p])));
    // each route's own stats.csv: this run's rows by formation, size and play
    const byRoute = new Map();
    for (const o of thisRunScore) { const [fishId, route] = o.k.split('|'); const k = fishId + '|' + route; if (!byRoute.has(k)) byRoute.set(k, []); byRoute.get(k).push(o); }
    const snake = s => s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
    for (const [k, list] of byRoute) {
      const [fishId, route] = k.split('|'), sf = path.join(libFolder, 'fish', fishId, 'routes', snake(route), 'stats.csv');
      if (!fs.existsSync(sf)) continue;
      fs.appendFileSync(sf, list.map(o => { const [, , form, size, via] = o.k.split('|'); return [folder, now.toISOString(), seed, minutes, form, size, via, o.sends, o.caught, f2(o.rate), f2(o.first), f2(o.hitsPer), o.w, o.p, f2(o.pb)].map(csvCell).join(','); }).join('\n') + '\n');
    }
  });
}
// plays: how often each fired, and how its schools did against the same fish + route sent without a play
const playSummary = (R.PLAYS || []).map(p => {
  const st = R.playState[p.id], mine = dispatchRows.filter(r => r[21] === p.id), fishRoutes = new Set(mine.map(r => r[5] + '|' + r[6]));
  const others = dispatchRows.filter(r => !r[21] && fishRoutes.has(r[5] + '|' + r[6]));
  const sc = rows => { const s = scoreRows(rows, () => 'x')[0]; return s || null; };
  return {id: p.id, enabled: p.enabled, why: p.why, fired: st.fired, waited: st.waited, sent: mine.length, mine: sc(mine), others: sc(others),
    effect: [].concat(p.then).some(t => t.effect)};
});
const fired = playsFired.length;

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
const seatsLabel = `${setup.seats.length} seats${envName ? ` (${envName})` : ''}${mix ? ' · players ' + mix.join(', ') : ''}${Object.keys(gameSettings).length ? ' · ' + Object.entries(gameSettings).map(([k, v]) => k + ' ' + v).join(', ') : ''}`;
const gunPBs = bySeat.map(o => o.gunPayback).filter(v => v != null), seatSpread = Math.max(...gunPBs) - Math.min(...gunPBs);
const ranked = ORDER.filter(k => byType[k].payback != null).sort((a, b) => byType[b].payback - byType[a].payback);
const sanity = Math.abs(check.labWagered - check.gameWagered) / Math.max(1, check.gameWagered) < 0.001 && Math.abs(check.labPaid - check.gamePaid) / Math.max(1, check.gamePaid) < 0.001;
const changes = [...Object.entries(tweaks.laws).map(([k, v]) => `${k} ${JSON.stringify(v.from)} → ${JSON.stringify(v.to)}`), ...tweaks.fish.map(f => `${f.fish}.${f.field} → ${JSON.stringify(f.to)}`),
  ...(envName ? ['table ' + envName] : []), ...(arg('seats', null) ? [setup.seats.length + ' seats'] : []), ...(arg('mix', null) ? ['players ' + mix.join(' ')] : []), ...args('set').map(a => 'game ' + a)];
const playsLabel = !R.PLAYS ? 'none (old game)' : tweaks.plays.length === R.PLAYS.length ? 'all on' : tweaks.plays.length ? 'only ' + tweaks.plays.join(', ') : 'off';
// ---- replay.html: this night, watchable in a browser (lab/replay.js) ----
writeReplay({file: path.join(outDir, 'replay.html'), html, label, seed, minutes, tweak: tweakCfg, settings: gameSettings, setup, changes,
  plays: playsFired.map(p => ({t: +p.t.toFixed(1), play: p.play, wave: p.wave})), seasons: seasonsSeen.map(x => ({t: +x.t.toFixed(1), name: x.name})), checkpoints});
const notes = [
  `Whole table paid back <b>${pc(all.payback)}</b> (gun ${pc(all.gunPayback)}, pole ${pc(all.polePayback)}) over ${minutes} simulated minutes. The weekly target is about 97–98%; one night of ${minutes / 60} hours can swing about ±4% because of bosses, so compare several seeds before changing anything.`,
  `Best-paid type: <b>${TYPES[ranked[0]].name}</b> at ${pc(byType[ranked[0]].payback)}. Worst: <b>${TYPES[ranked.at(-1)].name}</b> at ${pc(byType[ranked.at(-1)].payback)}. Law zero says every gun shot plays the same odds, so gaps between gun-only types are luck plus which groups they shoot at (each group has its own payback).`,
  `Seat fairness: gun payback across the ${gunPBs.length} played seats spans ${seatSpread.toFixed(1)} points (${pc(Math.min(...gunPBs))} to ${pc(Math.max(...gunPBs))}). Every type rotates through every seat, so a seat that stays high or low across several seeds points at the routes, not the players.`,
  sanity ? 'Bookkeeping check passed: the lab’s per-player totals match the game’s own ledger.' : `<b>Bookkeeping check failed</b>: lab wagered ${f0(check.labWagered)} vs game ${f0(check.gameWagered)}, lab paid ${f0(check.labPaid)} vs game ${f0(check.gamePaid)}.`,
  errors ? `<b>${errors} errors</b> were thrown during the run (see the terminal output).` : 'No errors during the run.',
  ...(R.LIB ? [`Director: ${f0(dispatches.length)} schools tracked; plays ${esc(playsLabel)} (${fired} fired); seasons ${R.LAW.season_length_waves > 0 ? `every ${R.LAW.season_length_waves} waves (${seasonsSeen.length} seen)` : 'off'}; changes: ${changes.length ? esc(changes.join('; ')) : 'none'}. Average session ${f1(all.meanSessionMin)} min, time between wins p90 ${sec(all.p90BetweenWins)}, longest dry spell p90 ${sec(all.p90LongestDry)}.`] : []),
];
const medBoard = scoreRows(dispatchRows.filter(r => R.LIB && R.LIB.fish[Object.keys(R.LIB.fish).find(g => R.LIB.fish[g].lib === r[5])]?.group === 'medium'), (r, C) => [r[C.fish], r[C.route], r[C.formation], r[C.via] || '-'].join('|')).sort((a, b) => a.k < b.k ? -1 : 1);
const sec1 = v => v == null ? '–' : v.toFixed(1) + ' s';
const playRows = playSummary.map(o => `<tr><th scope="row">${esc(o.id)}${o.enabled ? '' : ' <span class="sub">off</span>'}</th><td>${o.fired}</td><td>${o.waited}</td><td>${o.effect ? 'effect' : o.sent}</td><td>${o.mine ? o.mine.perSend.toFixed(2) : '–'}</td><td>${o.others ? o.others.perSend.toFixed(2) : '–'}</td><td>${o.mine ? sec1(o.mine.first) : '–'}</td><td>${o.others ? sec1(o.others.first) : '–'}</td></tr>`).join('');
const boardRows = medBoard.map(o => { const [fi, ro, fo, via] = o.k.split('|'); return `<tr><th scope="row">${esc(fi)} · ${esc(ro)}</th><td>${esc(fo)}</td><td>${via === '-' ? '' : esc(via)}</td><td>${o.sends}</td><td>${o.perSend.toFixed(2)}</td><td>${pc(100 * o.rate)}</td><td>${sec1(o.first)}</td><td>${o.hitsPer == null ? '–' : o.hitsPer.toFixed(1)}</td><td class="${pbClass(o.pb)}">${pc(o.pb)}</td></tr>`; }).join('');
const directorHtml = !R.LIB ? '' : `<h2>The director</h2>
<div class="kpis">
<div class="kpi"><b>${f0(dispatches.length)}</b><span>Schools sent and finished</span></div>
<div class="kpi"><b>${seasonsSeen.length > 1 || seasonsSeen[0]?.name !== 'none' ? seasonsSeen.length : 'off'}</b><span>Seasons${R.LAW.season_length_waves > 0 ? ` (${R.LAW.season_length_waves} waves each)` : ''}</span></div>
<div class="kpi"><b>${fired}</b><span>Plays fired (${esc(playsLabel)})</span></div>
<div class="kpi"><b>${f1(all.meanSessionMin)} min</b><span>Average session</span></div>
<div class="kpi"><b>${sec(all.p90LongestDry)}</b><span>Longest dry spell, p90 of sessions</span></div>
</div>
<p class="meta">Changes from the library for this run: ${changes.length ? esc(changes.join(' · ')) : 'none'}. Every school sent is in <code>dispatches.csv</code>; the scoreboard over all runs is <code>route_library/data/route_scoreboard.csv</code>.</p>
${R.PLAYS.length ? `<h3>Plays</h3><div class="wrap"><table><thead><tr><th>Play</th><th>Fired</th><th>Waited<br><span class="sub">no safe water</span></th><th>Schools</th><th>Caught per school<br><span class="sub">play</span></th><th>Caught per school<br><span class="sub">same route, no play</span></th><th>First catch<br><span class="sub">play</span></th><th>First catch<br><span class="sub">no play</span></th></tr></thead><tbody>${playRows}</tbody></table></div>` : ''}
<h3>Medium routes this run</h3>
<div class="wrap"><table><thead><tr><th>Fish · route</th><th>Formation</th><th>Via play</th><th>Schools</th><th>Caught per school</th><th>Catch rate per fish</th><th>First catch<br><span class="sub">average</span></th><th>Hits per catch</th><th>Payback on it</th></tr></thead><tbody>${boardRows}</tbody></table></div>
<p class="meta">Payback on it counts gun bets that hit the fish and gun pays for it. Law zero: routes change where fish swim, never the odds, so payback differences here are luck and which players shoot at what.</p>`;
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
h3{font-size:15px;margin:20px 0 8px}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px}code{font-size:13px}a{color:var(--accent)}
</style></head><body><main>
<p class="meta"><a href="../index.html">All reports</a> · <a href="replay.html"><b>Watch this run (replay)</b></a></p>
<h1>Player lab: ${esc(label)}</h1>
<p class="meta">${esc(now.toLocaleString('en-US'))} · Peacock Reef v${GV} (${sha(html)}) · ${minutes} simulated minutes · ${seatsLabel} · seed ${seed} · ${done.length} player sessions</p>
<div class="kpis">
<div class="kpi"><b>${pc(all.payback)}</b><span>Table payback</span></div>
<div class="kpi"><b>${pc(all.gunPayback)}</b><span>Gun payback</span></div>
<div class="kpi"><b>${pc(all.polePayback)}</b><span>Pole payback</span></div>
<div class="kpi"><b>${f0(all.wagered)}</b><span>Credits played</span></div>
<div class="kpi"><b>${seatSpread.toFixed(1)} pts</b><span>Seat spread (gun)</span></div>
</div>
<h2>What this run says</h2><ul class="notes">${notes.map(n => `<li>${n}</li>`).join('')}</ul>
${directorHtml}
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
  `${stamp.replace('_', ' ')} · Peacock Reef v${GV} (${sha(html)}) · ${minutes} simulated min · ${seatsLabel} · ${done.length} sessions · errors ${errors}`, '',
  `- Table payback ${pc(all.payback)} (gun ${pc(all.gunPayback)}, pole ${pc(all.polePayback)}); seat spread ${seatSpread.toFixed(1)} pts`,
  `- By type: ${ORDER.map(k => `${TYPES[k].name} ${pc(byType[k].payback)}`).join(', ')}`,
  `- Bust rate: ${ORDER.map(k => `${TYPES[k].name} ${pc(byType[k].bustRate)}`).join(', ')}`,
  `- Gun per-hit payback by group (designed in brackets): ${GROUP_ORDER.filter(g => L.byGroup[g]).map(g => `${g} ${pc(pct(L.byGroup[g].paid, L.byGroup[g].hitW))} [${pc(100 * R.GROUPS[g].pb)}]`).join(', ')}`,
  ...(R.LIB ? [`- Plays: ${playSummary.map(o => `${o.id} ${o.fired}`).join(', ') || 'none'}`] : []),
  '', ...notes.map(n => '- ' + plain(n)), '',
  `Full page: report.html · numbers: numbers.csv · rerun: \`${settingsOut.rerun}\``, '',
];
fs.writeFileSync(path.join(outDir, 'summary.md'), summary.join('\n'));

// ---- banks.md: the gun bank and the pole bank, points by fish and by bet size (games from v9 on) ----
if (L.byFish) {
  const r0 = n => Math.round(n).toLocaleString('en-US'), sg = n => (n >= 0 ? '+' : '') + r0(n);
  const fishRows = Object.entries(L.byFish).sort((a, b) => (b[1].gunW + b[1].poleW) - (a[1].gunW + a[1].poleW));
  const bands = ['1', '2-9', '10-49', '50+'].filter(k => L.byBet[k]);
  const fishPoleP = sum(fishRows, ([, o]) => o.poleP);
  const banks = [
    `# Banks: ${label} (seed ${seed})`, '',
    'Each bank = points in − points out for that side (positive = the house is ahead). The gun and the pole never share money.', '',
    '| Bank | In | Out | Balance | Payback |', '|---|---|---|---|---|',
    `| Gun | ${r0(L.gunW)} | ${r0(L.gunP)} | ${sg(L.gunW - L.gunP)} | ${pc(pct(L.gunP, L.gunW))} |`,
    `| Pole | ${r0(L.poleW)} | ${r0(L.poleP)} | ${sg(L.poleW - L.poleP)} | ${pc(pct(L.poleP, L.poleW))} |`,
    `| Total | ${r0(L.totW)} | ${r0(L.totP)} | ${sg(L.totW - L.totP)} | ${pc(pct(L.totP, L.totW))} |`, '',
    `Credits added at seats (deposits): ${r0(L.deposits || 0)} · owed in bags at the end: ${r0(L.reserved || 0)}`, '',
    ...(R.market ? ['## Market', '', `Market closes (season ends): ${R.market.closes} · weight bonus paid: ${r0(L.bonusPaid || 0)} (${pc(pct(L.bonusPaid || 0, L.poleP))} of the pole's pay) · bonus rates per lb: ${Object.entries(R.MARKET.bonusPerLb).map(([g, v]) => g + ' ' + v).join(', ')}`, '',
      '| Bait | Bought | Cast | Spoiled | Took the bait | Got away | Landed | Sold | Points in | Points out | Payback |', '|---|---|---|---|---|---|---|---|---|---|---|',
      ...Object.entries(L.pole).map(([k, o]) => `| ${k} | ${o.bought || 0} | ${o.cast} | ${o.spoiled} | ${o.took} | ${o.lost} | ${o.landed} | ${o.sold || 0} | ${r0(o.w)} | ${r0(o.p)} | ${pc(pct(o.p, o.w))} |`), ''] : []),
    '## By fish', '', 'Gun in = bets on hits. Pole in = bait cost when that fish reached the bobber.', '',
    '| Fish | Gun in | Gun out | Gun payback | Hits | Caught | Pole in | Pole out | Pole payback | Bites | Landed |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...fishRows.map(([id, o]) => `| ${id} | ${r0(o.gunW)} | ${r0(o.gunP)} | ${o.gunW ? pc(pct(o.gunP, o.gunW)) : '–'} | ${o.hits} | ${o.catches} | ${r0(o.poleW)} | ${r0(o.poleP)} | ${o.poleW ? pc(pct(o.poleP, o.poleW)) : '–'} | ${o.bites} | ${o.landed} |`), '',
    '## Gun by bet size', '', '| Bet | Points in | Points out | Payback | Shots | Catches |', '|---|---|---|---|---|---|',
    ...bands.map(k => { const o = L.byBet[k]; return `| ${k} | ${r0(o.w)} | ${r0(o.p)} | ${pc(pct(o.p, o.w))} | ${r0(o.shots)} | ${r0(o.catches)} |`; }), '',
    `Check: pole paid by fish ${r0(fishPoleP)} vs pole bank out ${r0(L.poleP)} (${Math.abs(fishPoleP - L.poleP) < 1 ? 'match' : 'MISMATCH'}).`, '',
  ];
  if (R.underStats) banks.push('## Underwater and diving', '',
    `Underwater fish spawned ${r0(R.underStats.spawned)} · came up from the deep to a quiet bait ${r0(R.underStats.arrivals)} · bites ${r0(R.underStats.bites)} (took the bait ${r0(R.underStats.took)})`,
    ...(R.deep ? [`Deep visitors sent ${R.deep.sent} (the director risked ${R.deep.risked} early, held back ${R.deep.held} checks for the pole bank) · caught ${R.deep.caught}`] : []),
    ...(R.dive ? [`Dives started ${R.dive.started} (${(R.dive.started / (minutes / 60)).toFixed(1)} per hour) · never came back ${R.dive.gone} · skipped by the budget ${R.dive.skipped} · bites from a fish while it was down ${R.dive.bites}`] : []), '');
  fs.writeFileSync(path.join(outDir, 'banks.md'), banks.join('\n'));
}

// ---- running log + index ----
if (outArg) { console.log('trial run (--out): report only, LOG.csv and the library untouched'); }
const logFile = path.join(outArg ? outDir : reportsDir, 'LOG.csv');
const logHead = ['when', 'label', 'folder', 'seed', 'minutes', 'game_sha1', 'errors', 'sessions', 'payback', 'gun_payback', 'pole_payback', 'seat_spread', ...ORDER.map(k => k + '_payback'),
  'game_version', 'changes', 'plays', 'plays_fired', 'schools', 'mean_session_min', 'p90_between_wins_s', 'p90_longest_dry_s', 'catches_per_min'];
const noComma = v => String(v).replace(/,/g, ';');
withLock(() => {
  // older logs have fewer columns: rewrite the header, old rows just leave the new columns empty
  if (!fs.existsSync(logFile)) fs.writeFileSync(logFile, logHead.join(',') + '\n');
  const lines = fs.readFileSync(logFile, 'utf8').trim().split('\n');
  if (lines[0] !== logHead.join(',')) fs.writeFileSync(logFile, [logHead.join(','), ...lines.slice(1)].join('\n') + '\n');
  fs.appendFileSync(logFile, [now.toISOString(), label, folder, seed, minutes, sha(html), errors, done.length, r2(all.payback), r2(all.gunPayback), r2(all.polePayback), r2(seatSpread), ...ORDER.map(k => r2(byType[k].payback)),
    GV, noComma(changes.join('; ')), noComma(playsLabel), R.LIB ? fired : '', R.LIB ? dispatches.length : '', r2(all.meanSessionMin), r2(all.p90BetweenWins), r2(all.p90LongestDry), r2(all.catchesPerMin)].join(',') + '\n');
});
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
<div class="wrap"><table><thead><tr><th>Run</th><th>Seed</th><th>Min</th><th>Table</th><th>Gun</th><th>Pole</th><th>Seat spread</th><th>Avg session<br>min</th><th>Dry spell<br>p90 s</th><th>Plays<br>fired</th><th>Changes</th>${ORDER.map(k => `<th>${TYPES[k].name}</th>`).join('')}</tr></thead><tbody>
${logRows.reverse().map(r => `<tr><td><a href="${esc(r[col('folder')])}/report.html">${esc(r[col('folder')])}</a>${fs.existsSync(path.join(reportsDir, r[col('folder')], 'replay.html')) ? ` · <a href="${esc(r[col('folder')])}/replay.html">replay</a>` : ''}</td><td>${esc(r[col('seed')])}</td><td>${esc(r[col('minutes')])}</td><td>${esc(r[col('payback')])}</td><td>${esc(r[col('gun_payback')])}</td><td>${esc(r[col('pole_payback')])}</td><td>${esc(r[col('seat_spread')])}</td><td>${esc(r[col('mean_session_min')] ?? '')}</td><td>${esc(r[col('p90_longest_dry_s')] ?? '')}</td><td>${esc(r[col('plays_fired')] ?? '')}</td><td style="text-align:left;white-space:normal;min-width:160px">${esc(r[col('changes')] ?? '')}</td>${ORDER.map(k => `<td>${esc(r[col(k + '_payback')] ?? '')}</td>`).join('')}</tr>`).join('\n')}
</tbody></table></div></main></body></html>`;
fs.writeFileSync(path.join(reportsDir, 'index.html'), indexHtml);

// ---- terminal summary ----
console.log(`ran ${minutes} simulated min in ${((Date.now() - t0) / 1000).toFixed(0)} s, seed ${seed}, errors ${errors}, ${done.length} sessions, ledger check ${sanity ? 'ok' : 'FAILED'}`);
console.log(`table ${pc(all.payback)}  gun ${pc(all.gunPayback)}  pole ${pc(all.polePayback)}  seat spread ${seatSpread.toFixed(1)} pts`);
for (const k of ORDER) { const o = byType[k]; console.log(`${TYPES[k].name.padEnd(8)} payback ${pc(o.payback).padStart(7)}  sessions ${String(o.sessions).padStart(3)}  bust ${pc(o.bustRate).padStart(6)}  best ${f0(o.best.pts).padStart(7)}  between wins ${sec(o.medianBetweenWins).padStart(7)}  dry ${sec(o.longestDry)}`); }
for (const g of GROUP_ORDER) { const o = L.byGroup[g]; if (o) console.log(`gun ${g.padEnd(8)} per-hit payback ${pc(pct(o.paid, o.hitW)).padStart(7)}  hits ${o.hits}  catches ${o.catches}`); }
console.log('report: ' + path.relative(ROOT, path.join(outDir, 'report.html')));
