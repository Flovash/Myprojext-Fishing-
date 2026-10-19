// Replay pages: one self-contained replay.html per lab run, so the night can be watched in a browser exactly as the lab played it.
// The page carries its own copy of the game as it was for that run, the same seed, setup and players (lab/sim.js), and the lab's
// credit totals at every minute, so it can show whether the replay is still in step with the run.
// playerlab.js calls writeReplay at the end of every run.
const fs = require('fs');
const {patchGame, labTweak, labPlayers} = require('./sim.js');
const {installDetMath, installDetSort} = require('./detmath.js');

const json = o => JSON.stringify(o).replace(/</g, '\\u003c');

// o: {file, html, label, seed, minutes, tweak: {laws, fish, plays}, settings, setup: {env, about, seats, mix}, changes, plays: [{t, play, wave}], seasons: [{t, name}], checkpoints: [[wagered, paid], ...] one per minute}
function writeReplay(o) {
  let {script} = patchGame(o.html);
  const rep = (a, b) => { if (!script.includes(a)) throw new Error('replay patch miss: ' + a.slice(0, 70)); script = script.replace(a, b); };
  // the replay drives the clock itself, and the table never resizes (that would redraw the background with the game's dice)
  rep('requestAnimationFrame(t => { last = t; frame(t); });', '');
  rep("addEventListener('resize', resize);", '');
  const data = {label: o.label, seed: o.seed, minutes: o.minutes, tweak: o.tweak, settings: Object.assign({sound: false}, o.settings), setup: o.setup,
    changes: o.changes, plays: o.plays, seasons: o.seasons, checkpoints: o.checkpoints};
  const prelude = `
window.__replay = ${json(data)};
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
Math.random = mulberry32(__replay.seed);
(${installDetMath.toString()})(Math);
(${installDetSort.toString()})(Array.prototype);
const labTweak = ${labTweak.toString()};
const labPlayers = ${labPlayers.toString()};
globalThis.__labTweak = LIB => labTweak(LIB, __replay.tweak, {laws: {}, fish: [], plays: null});
globalThis.__labSettings = __replay.settings;
globalThis.__lab = labPlayers({mix: __replay.setup.mix, seats: __replay.setup.seats});
`;
  const at = o.html.lastIndexOf('<script>'), end = o.html.lastIndexOf('</script>') + 9;
  const page = o.html.slice(0, at).replace('<title>Peacock Reef</title>', `<title>Reef Replay</title>`).replace('<div id="stage">', STYLE + PANEL + '<div id="stage">')
    + '<script>' + prelude + '</script>\n<script>' + script + '</script>\n<script>' + CONTROLLER + '</script>' + o.html.slice(end);
  fs.writeFileSync(o.file, page);
  return o.file;
}

const STYLE = `<style>
html,body{height:auto;min-height:100%;overflow:auto}
#rwrap{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:12px;padding:12px;max-width:1900px;margin:0 auto}
@media (max-width:980px){#rwrap{grid-template-columns:1fr;padding:8px}}
#rwrap #stage{position:relative;height:auto;width:100%;aspect-ratio:16/9;border-radius:12px;border:1px solid var(--line)}
#rwrap .dock{display:none}
#rshield{position:absolute;inset:0;z-index:5}
#rpanel{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px;display:grid;gap:12px;align-content:start;font-size:15px}
#rpanel h1{font:400 20px var(--display);color:var(--gold);margin:0}
#rpanel .meta{color:var(--muted);font-size:13px;margin:2px 0 0}
#rpanel .bar{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
#rpanel button{font:700 14px var(--ui);color:var(--text);background:var(--panel-2);border:1px solid var(--line);border-radius:8px;padding:6px 10px;min-height:36px;cursor:pointer}
#rpanel button[aria-pressed=true]{background:var(--gold);color:#1b1300;border-color:var(--gold)}
#rpanel button:focus-visible{outline:2px solid var(--peacock);outline-offset:2px}
#rclock{font:700 22px var(--ui);font-variant-numeric:tabular-nums}
#rseek{width:100%;accent-color:var(--gold)}
#rstats{display:grid;grid-template-columns:1fr 1fr;gap:6px}
#rstats div{background:#0a222b;border-radius:8px;padding:6px 8px}#rstats b{display:block;font-size:17px;font-variant-numeric:tabular-nums}#rstats span{color:var(--muted);font-size:12px}
#rsync{border-radius:8px;padding:8px 10px;background:#0a222b;font-size:14px}#rsync.ok{color:#7ddc6a}#rsync.bad{color:var(--coral);font-weight:700}
#rpanel h2{font:800 13px var(--ui);color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin:0}
#rseats,#rfeed,#rmarks{list-style:none;margin:0;padding:0;display:grid;gap:3px;font-size:13px;font-variant-numeric:tabular-nums}
#rseats li{display:flex;justify-content:space-between;gap:8px}#rseats i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px}
#rfeed{max-height:220px;overflow:auto}#rfeed li.play,#rmarks li.play{color:var(--gold)}#rfeed .t,#rmarks .t{color:var(--muted);margin-right:6px}
#rmarks{max-height:220px;overflow:auto}#rmarks button{min-height:28px;padding:2px 8px;font-size:13px;text-align:left;width:100%}
#rbusy{position:absolute;inset:0;z-index:6;display:grid;place-items:center;background:rgba(3,22,31,.72);font:700 20px var(--ui)}
</style>
`;
const PANEL = `<div id="rwrap"><aside id="rpanel" aria-label="Replay controls">
  <div><h1>Reef Replay</h1><p class="meta" id="rmeta"></p></div>
  <div><div id="rclock">0:00</div><input id="rseek" type="range" min="0" step="1" value="0" aria-label="Jump to minute"></div>
  <div class="bar" id="rspeeds" role="group" aria-label="Speed"><button id="rpause" type="button">Pause</button></div>
  <div id="rsync">Checking against the lab run at minute 1…</div>
  <div id="rstats"></div>
  <div><h2>Seats</h2><ul id="rseats"></ul></div>
  <div><h2>Director, live</h2><ul id="rfeed"></ul></div>
  <div><h2>Jump to</h2><ul id="rmarks"></ul></div>
</aside></div>
`;
const CONTROLLER = `(() => {
const C = window.__replay, R = window.__reef, A = globalThis.__labApi, lab = globalThis.__lab;
const $r = id => document.getElementById(id), esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
const clock = t => { t = Math.max(0, Math.floor(t)); const h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0'); };
const fmt = n => Math.round(n).toLocaleString('en-US');

// page layout: the table on the left, the panel on the right (below on a phone); the shield keeps clicks and keys off the seats
const wrap = $r('rwrap'), stage = $r('stage');
wrap.prepend(stage);
const shield = document.createElement('div'); shield.id = 'rshield'; stage.appendChild(shield);
const busy = document.createElement('div'); busy.id = 'rbusy'; busy.hidden = true; stage.appendChild(busy);

// the same start as the lab (lab/playerlab.js, RUN)
lab.setApi(A);
const feed = []; let feedDirty = true;
const addFeed = (t, html, cls) => { feed.unshift({t, html, cls}); if (feed.length > 80) feed.pop(); feedDirty = true; };
if (R.hooks) {
  R.hooks.dispatch = d => addFeed(d.t, esc(d.fish) + ' · ' + esc(d.route) + ' · ' + esc(d.formation) + ' ' + d.size + ' → ' + (d.caught + (d.poleCaught || 0)) + ' caught', d.play ? 'play' : '');
  R.hooks.play = p => addFeed(p.t, '<b>Play: ' + esc(p.play) + '</b> · wave ' + p.wave, 'play');
}
R.startGame();
R.settings.seatInput = Array(10).fill('bot');
lab.initSeats(R.seats(), R.settings);

const DT = 1 / 30, STEPS = Math.round(C.minutes * 60 / DT), PER_MIN = 1800;
const mainRng = Math.random, sideRng = mulberry32(C.seed ^ 0x5bd1e995);
let i = 0, errors = 0, okThrough = 0, badAt = null;
function step() {
  try { R.update(DT); if (i % 300 === 0) R.drawScene(); } catch (e) { errors++; if (errors < 5) console.error(e); }
  i++;
  if (i % PER_MIN === 0) {
    const cp = C.checkpoints[i / PER_MIN - 1], L = R.ledger;
    if (cp && badAt == null) { if (L.totW === cp[0] && L.totP === cp[1]) okThrough = i / PER_MIN; else badAt = i / PER_MIN; }
  }
}
// drawing between the lab's own draws uses its own dice, so watching never changes what happens
function paint() { Math.random = sideRng; try { R.drawScene(); } catch (e) {} finally { Math.random = mainRng; } }

// ---- controls ----
let speed = 1, paused = false, target = null, lastTs = null, acc = 0, uiT = 0;
const SPEEDS = [[1, '1×'], [4, '4×'], [16, '16×'], [64, '64×'], ['max', 'Max']];
const pauseBtn = $r('rpause'), seek = $r('rseek');
seek.max = C.minutes;
const setPaused = p => { paused = p; pauseBtn.textContent = p ? 'Play' : 'Pause'; pauseBtn.setAttribute('aria-pressed', String(p)); };
pauseBtn.onclick = () => setPaused(!paused);
const speedBtns = SPEEDS.map(([v, txt]) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = txt; b.onclick = () => { speed = v; acc = 0; syncSpeed(); if (paused) setPaused(false); }; $r('rspeeds').appendChild(b); return [v, b]; });
const syncSpeed = () => speedBtns.forEach(([v, b]) => b.setAttribute('aria-pressed', String(v === speed)));
syncSpeed();
// going back means starting the night over: reload and run forward to that point
function seekTo(sec) {
  sec = Math.max(0, Math.min(C.minutes * 60, sec));
  const s = Math.round(sec / DT);
  if (s < i) { try { sessionStorage.setItem('reefReplayJump', JSON.stringify({t: Math.round(sec), v: speed})); } catch (e) { location.hash = 't=' + Math.round(sec) + '&v=' + speed; } location.reload(); return; }
  target = s;
}
seek.addEventListener('change', () => seekTo(+seek.value * 60));
addEventListener('keydown', e => {
  if (e.target.closest && e.target.closest('#rpanel')) return;
  e.stopImmediatePropagation();
  if (e.code === 'Space') { e.preventDefault(); setPaused(!paused); }
}, true);
// where to start after a jump back: session storage (works on hosted pages too), else the address (#t=600&v=max)
const hash = new URLSearchParams(location.hash.slice(1));
try { const j = JSON.parse(sessionStorage.getItem('reefReplayJump') || 'null'); sessionStorage.removeItem('reefReplayJump'); if (j) { hash.set('t', j.t); hash.set('v', j.v); } } catch (e) {}
if (hash.get('v')) { const v = hash.get('v'); speed = v === 'max' ? 'max' : +v || 1; syncSpeed(); }
if (hash.get('t')) target = Math.round(+hash.get('t') / DT);

// ---- panel ----
const m = C.setup, mixTxt = m.mix ? 'players ' + m.mix.join(', ') : 'all 8 player types';
$r('rmeta').innerHTML = esc(C.label) + ' · seed ' + C.seed + ' · ' + C.minutes + ' min<br>' + m.seats.length + ' seats' + (m.env ? ' (' + esc(m.env) + ')' : '') + ' · ' + esc(mixTxt)
  + (C.changes.length ? '<br>Changes: ' + esc(C.changes.join('; ')) : '');
const marks = [...C.seasons.map(s => ({t: s.t, txt: 'Season: ' + s.name, cls: ''})), ...C.plays.map(p => ({t: p.t, txt: 'Play: ' + p.play + ' (wave ' + p.wave + ')', cls: 'play'}))].sort((a, b) => a.t - b.t);
$r('rmarks').innerHTML = marks.length ? marks.map((k, n) => '<li class="' + k.cls + '"><button type="button" data-n="' + n + '"><span class="t">' + clock(k.t) + '</span>' + esc(k.txt) + '</button></li>').join('') : '<li>No plays fired and no season changes in this run.</li>';
$r('rmarks').addEventListener('click', e => { const b = e.target.closest('button'); if (b) seekTo(marks[+b.dataset.n].t - 5); });
function ui() {
  const L = R.ledger, t = i * DT, pb = L.totW ? (100 * L.totP / L.totW).toFixed(1) + '%' : '–';
  $r('rclock').textContent = clock(t) + ' / ' + clock(C.minutes * 60);
  if (document.activeElement !== seek) seek.value = Math.floor(t / 60);
  const fired = R.PLAYS ? R.PLAYS.reduce((a, p) => a + R.playState[p.id].fired, 0) : 0;
  $r('rstats').innerHTML = [[pb, 'Table payback so far'], [(L.totW - L.totP >= 0 ? '+' : '') + fmt(L.totW - L.totP), 'House result (credits)'],
    [R.big ? R.big.wave : '–', 'Wave'], [R.season ? esc(R.season.name) : '–', 'Season'], [R.director.scene ? esc(R.director.scene.name) : '–', 'Scene'], [fired, 'Plays fired']]
    .map(([v, k]) => '<div><b>' + v + '</b><span>' + k + '</span></div>').join('');
  const sy = $r('rsync');
  if (badAt != null) { sy.className = 'bad'; sy.textContent = 'Different from the lab run at minute ' + badAt + '. What you see is no longer that night: tell Claude.'; }
  else if (okThrough) { sy.className = 'ok'; sy.textContent = 'Matches the lab run, minute by minute, through minute ' + okThrough + (okThrough >= C.minutes ? ' (the whole run).' : '.'); }
  $r('rseats').innerHTML = R.seats().map(s => { const st = lab.seatState[s.i] || {};
    const who = st.closed ? 'empty all night' : st.P ? lab.TYPES[st.type].name + ' · ' + fmt(s.points) + ' cr' : 'seat free';
    return '<li><span><i style="background:' + s.color + '"></i>Seat ' + (s.i + 1) + '</span><span>' + who + '</span></li>'; }).join('');
  if (feedDirty) { feedDirty = false; $r('rfeed').innerHTML = feed.length ? feed.map(f => '<li class="' + f.cls + '"><span class="t">' + clock(f.t) + '</span>' + f.html + '</li>').join('') : '<li>Schools appear here as they finish.</li>'; }
}

function frame(ts) {
  const el = lastTs == null ? 0 : Math.min(0.1, (ts - lastTs) / 1000); lastTs = ts;
  const t0 = performance.now();
  if (target != null) {
    while (i < target && i < STEPS && performance.now() - t0 < 40) step();
    busy.hidden = false; busy.textContent = 'Jumping to ' + clock(target * DT) + '…';
    if (i >= target || i >= STEPS) { target = null; busy.hidden = true; acc = 0; }
  } else if (!paused && i < STEPS) {
    if (speed === 'max') while (i < STEPS && performance.now() - t0 < 30) step();
    else { acc += el * speed / DT; let n = Math.floor(acc); acc -= n; while (n-- > 0 && i < STEPS) { step(); if (performance.now() - t0 > 40) { acc = 0; break; } } }
    if (i >= STEPS) setPaused(true);
  }
  if (target == null) paint();
  if (ts - uiT > 250 || target != null) { uiT = ts; ui(); }
  requestAnimationFrame(frame);
}
ui();
requestAnimationFrame(frame);
window.__replayDebug = {R, lab, step, paint, pause: () => setPaused(true), get i() { return i; }}; // for checking a replay from the browser console
window.__replayState = () => ({i, minute: i / PER_MIN, okThrough, badAt, errors, totW: R.ledger.totW, totP: R.ledger.totP});
})();`;

module.exports = {writeReplay};
