// One-off: merge chat Claude's patterns_part2_inbox/patterns_part2.json (13 fish, Shark co-paths, 3 law sections) into the library.
// usage (from the Fish Game Table folder): node route_library/tools/merge_patterns_part2.js
// Fish already in fish/ are skipped. The design's pauses {at, s} become {at, hold: [s, s]}; a route's "if" rules go to its rules.json.
const fs = require('fs'), path = require('path');
const LIB = path.resolve(__dirname, '..'), ROOT = path.resolve(LIB, '..');
const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'patterns_part2_inbox', 'patterns_part2.json'), 'utf8'));
const W = (p, o) => { fs.mkdirSync(path.dirname(p), {recursive: true}); fs.writeFileSync(p, JSON.stringify(o, null, 1) + '\n'); };
const J = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const snake = s => s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

// the game's own species ids, and school sizes read from each fish's habit
const GAME_ID = {clownfish: 'clown', butterflyfish: 'butterfly', pufferfish: 'puffer', lionfish: 'lion', bombcrab: 'crab', giantsquid: 'gsquid'};
const SIZES = {anchovy: [5, 8], clownfish: [3, 6], butterflyfish: [3, 6], minnow: [3, 6], pufferfish: [1, 3], lionfish: [1, 3], seahorse: [1, 2]};
const GEOMETRY = ['id', 'name', 'dur', 'pts', 'pauses', 'speed', 'pulse', 'sharp', 'shifts', 'lanes', 'sway', 'crosser', 'twin', 'edge', 'dynamic', 'purpose'];

let added = 0;
for (const [id, f] of Object.entries(d.fish)) {
  const dir = path.join(LIB, 'fish', id);
  if (fs.existsSync(dir)) { console.log(`fish/${id} already there, skipped`); continue; }
  const sizes = SIZES[id] || [1, 1];
  const formations = sizes[1] > 1
    ? {[f.group === 'tiny' ? 'school' : 'loose']: {sizes, lag: 0.9, lat: 0.8, what: 'One behind the other with a little sideways wander.'}}
    : {single: {sizes, lag: 0, lat: 0, what: 'Alone.'}};
  const fish = {name: f.name, group: f.group, pays: f.pays, role: f.role, home: f.home, habit: f.habit, status: f.status || 'designed, not in game yet'};
  for (const k of ['rules', 'reactions', 'phases']) if (f[k]) fish[k] = f[k];
  Object.assign(fish, {id, game_id: GAME_ID[id] || id, group_sizes: sizes, formations_allowed: Object.keys(formations), route_order: f.routes.map(r => r.id), designed_by: 'chat Claude (patterns part 2)'});
  W(path.join(dir, 'fish.json'), fish);
  W(path.join(dir, 'formations.json'), {about: 'Formations this fish may swim in. sizes = school size limits; lag and lat = spacing behind and beside, in body lengths and heights.', formations});
  for (const r of f.routes) {
    const rd = path.join(dir, 'routes', snake(r.id)), route = {};
    for (const k of GEOMETRY) if (r[k] !== undefined) route[k] = r[k];
    if (route.pauses) route.pauses = route.pauses.map(p => p.hold ? p : {at: p.at, hold: [p.s, p.s]});
    route.flips = {mx: true, my: true, rev: true};
    W(path.join(rd, 'route.json'), route);
    const rules = {route: r.id, weight: 1, never_twice_in_a_row: true, if: r.rules || []};
    if (r.status) rules.status = r.status;
    W(path.join(rd, 'rules.json'), Object.assign(rules, {seasons: {}, why: r.purpose}));
    fs.writeFileSync(path.join(rd, 'stats.csv'), 'run,when,seed,minutes,formation,size,via,sends,caught,catch_rate_per_fish,avg_first_catch_s,avg_hits_to_catch,wagered,paid,payback\n');
  }
  added++; console.log(`fish/${id}: ${f.routes.length} routes`);
}

// second-Shark moves, now with descriptions
const sharkFile = path.join(LIB, 'fish', 'shark', 'fish.json'), shark = J(sharkFile);
shark.co_paths = d.shark_co_paths; W(sharkFile, shark);
console.log(`shark: ${d.shark_co_paths.length} second-Shark moves`);

// new law sections (kept out of the game: build_library only copies big_fish, medium_fish and director laws)
const lawFile = path.join(LIB, 'director', 'laws.json'), laws = J(lawFile);
for (const [sect, list] of Object.entries(d.new_law_sections)) { laws[sect] = list; console.log(`laws.${sect}: ${list.length}`); }
W(lawFile, laws);

const nd = path.join(LIB, 'fish', '_not_designed_yet.json');
if (fs.existsSync(nd)) { fs.unlinkSync(nd); console.log('fish/_not_designed_yet.json removed (every fish is designed now)'); }
console.log(`${added} fish added`);
