// Build everything that is made from the route library folders.
// usage (from the Fish Game Table folder): node route_library/tools/build_library.js
//   - ROUTES.md (readable index) and one sketch.svg per route
//   - CATALOG.html: one scrollable, searchable page of every fish, route, formation, pole setting, ritual and law
//   - the generated data block inside game/peacock_reef.html (routes, formations, laws, seasons, plays)
// Edit the JSON files in fish/ and director/, then run this. Never edit the generated parts by hand.
const fs = require('fs'), path = require('path');

const LIB = path.resolve(__dirname, '..'), ROOT = path.resolve(LIB, '..');
const J = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const FISH_ORDER = ['shark', 'manta', 'hammerhead', 'marlin', 'tuna', 'barracuda', 'octopus', 'swordfish', 'turtle', 'sardine', 'angelfish',
  'anchovy', 'clownfish', 'butterflyfish', 'minnow', 'pufferfish', 'lionfish', 'seahorse', 'bombcrab', 'eel', 'healer', 'megalodon', 'giantsquid', 'kraken'];

// ================= LOAD =================
function loadFish(id) {
  const dir = path.join(LIB, 'fish', id), f = J(path.join(dir, 'fish.json'));
  f.formations = J(path.join(dir, 'formations.json')).formations;
  const routes = {};
  for (const rd of fs.readdirSync(path.join(dir, 'routes'))) {
    const p = path.join(dir, 'routes', rd);
    if (!fs.statSync(p).isDirectory()) continue;
    const route = J(path.join(p, 'route.json')), rules = J(path.join(p, 'rules.json'));
    routes[route.id] = {route, rules, folder: path.relative(LIB, p)};
  }
  const missing = f.route_order.filter(r => !routes[r]), extra = Object.keys(routes).filter(r => !f.route_order.includes(r));
  if (missing.length || extra.length) throw new Error(`${id}: route_order out of step with routes/ (missing ${missing}, not listed ${extra})`);
  f.routes = f.route_order.map(r => routes[r]);
  return f;
}
const optJ = p => fs.existsSync(p) ? J(p) : null;
function loadRituals() {
  const dir = path.join(LIB, 'rituals'); if (!fs.existsSync(dir)) return null;
  const shared = optJ(path.join(dir, 'rituals.json')) || {}, list = loadDir(dir).filter(r => r.id);
  return {shared, list: Object.fromEntries(list.map(r => [r.id, r]))};
}
function loadDir(dir) { return fs.existsSync(dir) ? fs.readdirSync(dir).filter(n => n.endsWith('.json')).sort().map(n => J(path.join(dir, n))) : []; }
function loadLibrary() {
  const ids = fs.readdirSync(path.join(LIB, 'fish')).filter(n => fs.statSync(path.join(LIB, 'fish', n)).isDirectory());
  const order = [...FISH_ORDER.filter(i => ids.includes(i)), ...ids.filter(i => !FISH_ORDER.includes(i)).sort()];
  const fish = Object.fromEntries(order.map(id => [id, loadFish(id)]));
  const director = path.join(LIB, 'director');
  return {
    fish,
    laws: J(path.join(director, 'laws.json')),
    seasons: fs.existsSync(path.join(director, 'seasons.json')) ? J(path.join(director, 'seasons.json')) : null,
    plays: loadDir(path.join(director, 'plays')),
    show: optJ(path.join(director, 'show.json')),
    diving: optJ(path.join(director, 'diving.json')),
    pole: Object.fromEntries(['bite_styles', 'feeding', 'underwater', 'deep_visitors', 'market', 'golden_koi'].map(k => [k, optJ(path.join(LIB, 'pole', k + '.json'))]).filter(e => e[1])),
    rituals: loadRituals(),
    notDesigned: fs.existsSync(path.join(LIB, 'fish', '_not_designed_yet.json')) ? J(path.join(LIB, 'fish', '_not_designed_yet.json')).not_designed_yet : {},
  };
}

// ================= ROUTES.md =================
function routesMd(L) {
  const out = ['# Route index', '',
    'Every fish, every route, and what each route is for. Points are screen fractions: x 0 = left edge, 1 = right edge; y 0 = top seat row, 1 = bottom seat row. Values below 0 or above 1 are off screen, where fish enter and leave. Every route can also be flipped left-right, top-bottom or run backwards unless its notes say otherwise. Each fish has a folder in `fish/` with a picture of all its routes (`sketch.svg`) and one folder per route (route, rules, tracked stats, sketch).',
    '', '_Made by `tools/build_library.js` from the folders. Edit the JSON files, not this page._', ''];
  for (const f of Object.values(L.fish)) {
    out.push(`## ${f.name}  ·  ${f.group}  ·  pays ${f.pays}`, '');
    out.push(`**Role:** ${f.role}  `, `**Home:** ${f.home}  `, `**Habit:** ${f.habit}  `, `**Status:** ${f.status}  `);
    out.push(`**School size:** ${f.group_sizes[0] === f.group_sizes[1] ? f.group_sizes[0] : f.group_sizes.join('-')} · **Formations:** ${f.formations_allowed.join(', ')}  `);
    if (f.rules) out.push(`**Rules:** ${f.rules.join(' ')}  `);
    if (f.phases) out.push(`**Fight stages:** ${f.phases.join(' → ')}  `);
    out.push(`**Sketch:** \`fish/${f.id}/sketch.svg\``, '');
    const att = f.routes.some(r => r.rules.attitude);
    out.push(att ? '| Route | Attitude | On screen | What it is for |' : '| Route | On screen | What it is for |', att ? '|---|---|---|---|' : '|---|---|---|');
    for (const {route: r, rules} of f.routes) {
      const dur = r.dur ? `${r.dur[0]}-${r.dur[1]} s` : r.dynamic ? r.dynamic : 'by speed';
      const what = r.purpose + (rules.if && rules.if.length ? ` _If:_ ${rules.if.join(' ')}` : '');
      out.push(att ? `| ${r.name} (\`${r.id}\`) | ${rules.attitude || ''} | ${dur} | ${what} |` : `| ${r.name} (\`${r.id}\`) | ${dur} | ${what} |`);
    }
    if (f.reactions) out.push('', `**Reactions:** ${f.reactions.map(x => `${x.name}: ${x.effect} (${x.trigger})`).join('; ')}`);
    if (f.co_paths) out.push('', `**Second Shark moves:** ${f.co_paths.map(x => `${x.name} (${x.status})`).join('; ')}`);
    out.push('');
  }
  if (Object.keys(L.notDesigned).length) out.push('## Not designed yet', '');
  for (const [k, v] of Object.entries(L.notDesigned)) out.push(`- **${k}:** ${v}`);
  return out.join('\n') + '\n';
}

// ================= ROUTE SKETCHES =================
const COLOR = {shark: '#D85A30', manta: '#3C3489', hammerhead: '#5F5E5A', marlin: '#E24B4A', tuna: '#0F6E56', barracuda: '#BA7517', octopus: '#993556', swordfish: '#185FA5', turtle: '#3B6D11', sardine: '#5F7F8C', angelfish: '#2C6FA0',
  anchovy: '#6F8A96', clownfish: '#D9641E', butterflyfish: '#C9A21A', minnow: '#7A8A55', pufferfish: '#B08A2E', lionfish: '#B5452F', seahorse: '#C2577A', bombcrab: '#A33A2A', eel: '#4F6FD1', healer: '#8E5BC2', megalodon: '#38434A', giantsquid: '#A0476B', kraken: '#5A2E6E'};
function catmull(pts, n = 12) {
  const g = i => pts[Math.max(0, Math.min(pts.length - 1, i))], o = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      o.push([0, 1].map(j => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  o.push(pts[pts.length - 1]); return o;
}
function routeSvg(f, r) {
  const X = x => 20 + x * 200, Y = y => 22 + y * 120, c = COLOR[f.id] || '#0e2a2e';
  const line = (r.sharp ? r.pts : catmull(r.pts)).map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(' ');
  const seats = [0.1, 0.3, 0.5, 0.7, 0.9].flatMap(s => [22, 142].map(y => `<rect x="${X(s) - 5}" y="${y - 2}" width="10" height="4" rx="1" fill="#5d7c78"/>`)).join('');
  const pauses = (r.pauses || []).map(p => {
    const s = r.sharp ? r.pts : catmull(r.pts); let L = [0]; for (let i = 1; i < s.length; i++) L.push(L[i - 1] + Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]));
    const tgt = p.at * L[L.length - 1], i = L.findIndex(l => l >= tgt), q = s[Math.max(0, i)];
    return `<circle cx="${X(q[0]).toFixed(1)}" cy="${Y(q[1]).toFixed(1)}" r="4" fill="#fff" stroke="${c}" stroke-width="2"/>`;
  }).join('');
  const esc = s => String(s).replace(/[&<>]/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;'})[ch]);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 172" font-family="sans-serif"><rect width="100%" height="100%" fill="#ffffff"/>
<defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="${c}" stroke-width="1.8"/></marker></defs>
<text x="8" y="14" font-size="11" font-weight="700" fill="#0e2a2e">${esc(f.name)} · ${esc(r.name)}${r.dur ? ` · ${r.dur[0]}-${r.dur[1]} s` : ''}</text>
<rect x="20" y="22" width="200" height="120" rx="5" fill="#d3e9e4" stroke="#86b2aa"/>${seats}
<polyline points="${line}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#a)"${r.twin ? '' : ''}/>
${r.twin ? `<polyline points="${(catmull(r.pts.map(([x, y]) => [x, 1 - y]))).map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(' ')}" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="5 3" marker-end="url(#a)"/>` : ''}${pauses}
<text x="8" y="164" font-size="9" fill="#4d696b">${r.pauses ? 'White dots: pauses. ' : ''}${r.flips && !r.flips.rev ? 'Mirrors, never runs backwards.' : 'Can be mirrored and run backwards.'}</text>
</svg>
`;
}

// ================= GAME DATA BLOCK =================
// The game is one HTML file that opens from disk, so it cannot load the JSON files itself; this copies what it needs inside it.
const START = '// ===== ROUTE LIBRARY (generated by route_library/tools/build_library.js; edit the library, not this block) =====';
const END = '// ===== END ROUTE LIBRARY =====';
function gameData(L) {
  const fish = {};
  for (const f of Object.values(L.fish)) {
    fish[f.game_id] = {lib: f.id, group: f.group, sizes: f.group_sizes, formations: Object.fromEntries(f.formations_allowed.map(k => [k, f.formations[k]])), allFormations: f.formations,
      routes: Object.fromEntries(f.routes.map(({route, rules}) => [route.id, Object.assign({}, route, {rules})]))};
    if (f.pole) fish[f.game_id].pole = f.pole;
    if (f.dive) fish[f.game_id].dive = f.dive;
  }
  // fish that are in the game but not in the library keep their game defaults; strip the "about" notes from settings files
  const bare = o => { if (!o) return o; const c = Object.assign({}, o); delete c.about; return c; };
  const laws = {};
  for (const sect of ['big_fish', 'medium_fish', 'director']) for (const l of L.laws[sect] || []) laws[l.id] = l.value;
  return {fish, laws, seasons: L.seasons, plays: L.plays, show: bare(L.show), diving: bare(L.diving),
    pole: Object.fromEntries(Object.entries(L.pole || {}).map(([k, v]) => [k, bare(v)])), rituals: L.rituals ? {shared: bare(L.rituals.shared), list: L.rituals.list} : null};
}
function writeGame(L) {
  const file = path.join(ROOT, 'game', 'peacock_reef.html');
  const html = fs.readFileSync(file, 'utf8'), a = html.indexOf(START), b = html.indexOf(END);
  if (a < 0 || b < 0) { console.log('game: no route library block yet, skipped'); return; }
  const block = `${START}\nconst LIB = ${JSON.stringify(gameData(L))};\n`;
  fs.writeFileSync(file, html.slice(0, a) + block + html.slice(b));
  console.log('game: route library block updated');
}

// ================= RUN =================
if (require.main === module) {
  const L = loadLibrary();
  fs.writeFileSync(path.join(LIB, 'ROUTES.md'), routesMd(L));
  let n = 0;
  for (const f of Object.values(L.fish)) for (const r of f.routes) { fs.writeFileSync(path.join(LIB, r.folder, 'sketch.svg'), routeSvg(f, r.route)); n++; }
  console.log(`ROUTES.md + ${n} route sketches written`);
  fs.writeFileSync(path.join(LIB, 'CATALOG.html'), require('./catalog.js').catalogHtml(L, routeSvg, COLOR));
  console.log('CATALOG.html written');
  if (!process.argv.includes('--no-game')) writeGame(L);
}
module.exports = {loadLibrary, gameData, LIB, ROOT};
