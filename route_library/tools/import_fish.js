// Bring a fish design from new_fish_inbox/ into the route library.
// usage (from the Fish Game Table folder): node route_library/tools/import_fish.js new_fish_inbox/lanternfish.json [--replace]
// Checks the design, writes fish/<id>/ (fish.json, formations.json, one folder per route), then rebuilds ROUTES.md and sketches.
// It does not put the fish in the game: a new fish also needs a species entry (size, look, speed) in peacock_reef.html.
const fs = require('fs'), path = require('path');
const LIB = path.resolve(__dirname, '..'), ROOT = path.resolve(LIB, '..');
const file = process.argv[2], replace = process.argv.includes('--replace');
if (!file) { console.log('usage: node route_library/tools/import_fish.js new_fish_inbox/<fish>.json [--replace]'); process.exit(1); }
const d = JSON.parse(fs.readFileSync(path.resolve(ROOT, file), 'utf8'));
const problems = [];
const need = (ok, msg) => { if (!ok) problems.push(msg); };
const GROUPS = ['tiny', 'small', 'medium', 'big', 'boss', 'special'];
const isId = s => typeof s === 'string' && /^[a-z][a-zA-Z0-9]*$/.test(s);
const snake = s => s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

need(isId(d.id), 'id must be one word, lowercase start, letters and digits only (e.g. "lanternfish")');
need(d.name, 'name is missing');
need(GROUPS.includes(d.group), `group must be one of ${GROUPS.join(', ')}`);
for (const k of ['pays', 'role', 'home', 'habit']) need(typeof d[k] === 'string' && d[k], `${k} is missing (one plain sentence)`);
need(Array.isArray(d.group_sizes) && d.group_sizes.length === 2 && d.group_sizes[0] >= 1 && d.group_sizes[1] >= d.group_sizes[0], 'group_sizes must be [smallest, largest], e.g. [1, 3]');
need(Array.isArray(d.routes) && d.routes.length, 'routes: at least one route');
const ids = new Set();
for (const [i, r] of (d.routes || []).entries()) {
  const at = `route ${i + 1} (${r.id || 'no id'})`;
  need(isId(r.id), `${at}: id must be one word like "cornerRun"`);
  need(!ids.has(r.id), `${at}: id used twice`); ids.add(r.id);
  need(r.name, `${at}: name is missing`);
  need(r.purpose, `${at}: purpose is missing (what the route is for, one sentence)`);
  need(Array.isArray(r.dur) && r.dur.length === 2 && r.dur[0] > 0 && r.dur[1] >= r.dur[0], `${at}: dur must be [min, max] seconds on screen`);
  need(Array.isArray(r.pts) && r.pts.length >= 2 && r.pts.every(p => Array.isArray(p) && p.length === 2 && p.every(v => typeof v === 'number' && v >= -0.2 && v <= 1.2)), `${at}: pts must be a list of [x, y] points between -0.2 and 1.2`);
  if (Array.isArray(r.pts) && r.pts.length >= 2) {
    const off = p => p[0] < 0 || p[0] > 1 || p[1] < 0 || p[1] > 1;
    need(off(r.pts[0]) && off(r.pts[r.pts.length - 1]), `${at}: the first and last points should be off screen (below 0 or above 1) so the fish swims in and out`);
  }
  for (const p of r.pauses || []) need(p.at > 0 && p.at < 1 && Array.isArray(p.hold), `${at}: each pause needs "at" (0-1 along the route) and "hold" [min, max] seconds`);
}
const dir = path.join(LIB, 'fish', d.id || 'x');
if (fs.existsSync(dir) && !replace) problems.push(`fish/${d.id} already exists; add --replace to overwrite it`);
if (problems.length) { console.log('Not imported. Fix these in the design file:\n- ' + problems.join('\n- ')); process.exit(1); }

const W = (p, o) => { fs.mkdirSync(path.dirname(p), {recursive: true}); fs.writeFileSync(p, JSON.stringify(o, null, 1) + '\n'); };
if (replace) fs.rmSync(dir, {recursive: true, force: true});
const formations = d.formations || {[d.group_sizes[1] > 1 ? 'loose' : 'single']: {sizes: d.group_sizes, lag: 0.9, lat: 0.8, what: d.group_sizes[1] > 1 ? 'One behind the other with a little sideways wander.' : 'Alone.'}};
W(path.join(dir, 'fish.json'), {name: d.name, group: d.group, pays: d.pays, role: d.role, home: d.home, habit: d.habit, status: 'designed, not in game yet',
  id: d.id, game_id: d.game_id || d.id, group_sizes: d.group_sizes, formations_allowed: Object.keys(formations), route_order: d.routes.map(r => r.id), designed_by: d.designed_by || 'chat Claude'});
W(path.join(dir, 'formations.json'), {about: 'Formations this fish may swim in. sizes = school size limits; lag and lat = spacing behind and beside, in body lengths and heights.', formations});
const GEOMETRY = ['id', 'name', 'dur', 'pts', 'pauses', 'speed', 'pulse', 'sharp', 'shifts', 'lanes', 'sway', 'crosser', 'twin', 'edge', 'purpose'];
for (const r of d.routes) {
  const rd = path.join(dir, 'routes', snake(r.id)), route = {};
  for (const k of GEOMETRY) if (r[k] !== undefined) route[k] = r[k];
  route.flips = r.flips || (r.edge ? {mx: true, my: true, rev: false} : {mx: true, my: true, rev: true});
  W(path.join(rd, 'route.json'), route);
  W(path.join(rd, 'rules.json'), Object.assign({route: r.id, weight: 1, never_twice_in_a_row: true}, d.group === 'medium' ? {fast_crosser: r.crosser ? 1 : 0, split_safe: !!r.split_safe} : {}, {seasons: {}, why: r.purpose}));
  fs.writeFileSync(path.join(rd, 'stats.csv'), 'run,when,seed,minutes,formation,size,via,sends,caught,catch_rate_per_fish,avg_first_catch_s,avg_hits_to_catch,wagered,paid,payback\n');
}
console.log(`imported ${d.name}: ${d.routes.length} routes into route_library/fish/${d.id}/`);
require('child_process').execFileSync('node', [path.join(__dirname, 'build_library.js'), '--no-game'], {stdio: 'inherit'});
