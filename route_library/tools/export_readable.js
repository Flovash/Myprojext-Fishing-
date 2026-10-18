// Make the readable copies of the library for phones and chat Claude (which can read Google Sheets and Docs, not JSON).
// usage (from the Fish Game Table folder): node route_library/tools/export_readable.js
// Writes route_library/readable/fish_and_routes.csv (one row per route, becomes the "Fish & Routes" Google Sheet)
// and route_library/readable/director.html (laws, seasons, plays; part of the "Start Here" Google Doc).
const fs = require('fs'), path = require('path');
const {loadLibrary, LIB} = require('./build_library.js');
const L = loadLibrary(), OUT = path.join(LIB, 'readable');
fs.mkdirSync(OUT, {recursive: true});
const cell = v => { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

// scoreboard totals per fish + route (all lab runs so far)
const board = {}, bf = path.join(LIB, 'data', 'route_scoreboard.csv');
if (fs.existsSync(bf)) {
  const rows = fs.readFileSync(bf, 'utf8').trim().split('\n').map(l => l.split(',')), h = rows.shift(), c = n => h.indexOf(n);
  for (const r of rows) {
    const k = r[c('fish')] + '|' + r[c('route')], o = board[k] = board[k] || {sends: 0, caught: 0, firstSum: 0, firstN: 0};
    const sends = +r[c('sends')]; o.sends += sends; o.caught += +r[c('avg_caught_per_send')] * sends;
    if (r[c('avg_first_catch_s')] !== '') { o.firstSum += +r[c('avg_first_catch_s')] * sends; o.firstN += sends; }
  }
}
const style = r => [r.sharp && 'straight lines', r.crosser && 'fast crosser', r.twin && 'two mirrored schools', r.edge && 'seat edges only', r.pulse && 'hops', r.sway && 'sways',
  r.shifts && `slides ${r.shifts.join('/')}`, r.lanes && `heights ${r.lanes.join('/')}`].filter(Boolean).join('; ');
const head = ['Fish', 'Group', 'Pays', 'In the game?', 'School size', 'Formations', 'Route', 'Route id', 'Seconds on screen', 'Pauses', 'Style', 'What it is for',
  'Points (x,y: 0-1 = on screen)', 'Lab: schools sent', 'Lab: caught per school', 'Lab: first catch (s)', 'Folder'];
const rows = [head];
for (const f of Object.values(L.fish)) for (const {route: r, rules, folder} of f.routes) {
  const b = board[f.id + '|' + r.id];
  rows.push([f.name, f.group, f.pays, f.status, f.group_sizes[0] === f.group_sizes[1] ? f.group_sizes[0] : f.group_sizes.join('-'), f.formations_allowed.join(', '),
    r.name, r.id, r.dur ? `${r.dur[0]}-${r.dur[1]}` : r.dynamic ? 'follows another fish' : 'by speed', (r.pauses || []).map(p => `${Math.round(p.at * 100)}% for ${p.hold.join('-')}s`).join('; '),
    [style(r), rules.attitude && `attitude ${rules.attitude}`, r.dynamic].filter(Boolean).join('; '), r.purpose + (rules.if && rules.if.length ? ' If: ' + rules.if.join(' ') : ''), r.pts.map(p => `(${p.join(', ')})`).join(' '),
    b ? b.sends : '', b && b.sends ? (b.caught / b.sends).toFixed(2) : '', b && b.firstN ? (b.firstSum / b.firstN).toFixed(1) : '', folder]);
}
fs.writeFileSync(path.join(OUT, 'fish_and_routes.csv'), rows.map(r => r.map(cell).join(',')).join('\n') + '\n');

// director: laws, seasons, plays as plain HTML tables
const esc = s => String(s ?? '').replace(/[&<>]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;'})[c]);
const val = v => esc(typeof v === 'object' ? JSON.stringify(v).replace(/[{}"]/g, '').replace(/,/g, ', ').replace(/:/g, ': ') : v);
const lawRows = ['director', 'big_fish', 'medium_fish', 'small_fish', 'specials', 'bosses'].flatMap(s => (L.laws[s] || []).map(l => `<tr><td>${esc(l.id)}</td><td>${val(l.value)}${l.unit ? ' ' + esc(l.unit) : ''}</td><td>${esc(l.what)}</td><td>${esc(l.status)}</td></tr>`)).join('');
const seasonRows = (L.seasons ? L.seasons.seasons : []).map(s => `<tr><td>${esc(s.label)}</td><td>${esc(s.story)}</td><td>${val(s.routes)}</td><td>${val(s.formations)}</td></tr>`).join('');
const playRows = L.plays.map(p => `<tr><td>${esc(p.id)}${p.enabled === false ? ' (off)' : ''}</td><td>${val(p.if)}</td><td>${esc([].concat(p.then).map(t => t.effect ? `effect for ${t.effect.seconds}s` : `send ${t.send}${t.route ? ' ' + [].concat(t.route).join('/') : ''}${t.formation ? ' in ' + t.formation : ''}${t.size ? ' size ' + t.size.join('-') : ''}${t.aim_at ? ' at ' + t.aim_at.replace('_', ' ') : ''}`).join(' + '))}</td><td>${val(p.limits)}</td><td>${esc(p.why)}</td></tr>`).join('');
fs.writeFileSync(path.join(OUT, 'director.html'), `<h2>Director laws</h2><p>${esc(L.laws.law_zero)}</p>
<table border="1"><tr><th>Law</th><th>Value</th><th>What it does</th><th>Status</th></tr>${lawRows}</table>
<h2>Seasons</h2><p>Each season lasts season_length_waves big-fish waves. Numbers are how much more (or less) often a route or formation is picked.</p>
<table border="1"><tr><th>Season</th><th>Story</th><th>Routes favored</th><th>Formations favored</th></tr>${seasonRows}</table>
<h2>Plays</h2><p>Checked every second. When all the "if" conditions hold and the limits allow, the director does "then".</p>
<table border="1"><tr><th>Play</th><th>If</th><th>Then</th><th>Limits</th><th>Why</th></tr>${playRows}</table>
`);
console.log(`readable/fish_and_routes.csv (${rows.length - 1} routes) and readable/director.html written`);
