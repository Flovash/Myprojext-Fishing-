// Picks each diving fish's dive window on every one of its routes and writes it into the route's rules.json as
// "dive": [from, to] (share of the route's length) or "dive": false. A dive may only start where the route runs through
// open water: away from the screen edges and the seat rows, and not in the first or last stretch, so the fish is seen
// going down and coming back up. Routes that never get far enough from the edges get no dives. Hand edits win: a route
// whose rules.json has "dive_hand": true is left alone.
// usage (from the Fish Game Table folder): node route_library/tools/dive_spots.js   then node route_library/tools/build_library.js
const fs = require('fs'), path = require('path');
const LIB = path.resolve(__dirname, '..');
const J = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const OPEN = {x0: 0.15, x1: 0.85, y0: 0.2, y1: 0.8}, MIN = 0.12, EDGE = [0.2, 0.78];
function catmull(pts, n = 16) {
  const g = i => pts[Math.max(0, Math.min(pts.length - 1, i))], o = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t; o.push([0, 1].map(j => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); }
  }
  o.push(pts[pts.length - 1]); return o;
}
function window(route) {
  if (!route.pts || route.pts.length < 2) return false;
  const s = route.sharp ? route.pts : catmull(route.pts), L = [0];
  for (let i = 1; i < s.length; i++) L.push(L[i - 1] + Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]));
  const tot = L[L.length - 1]; if (!tot) return false;
  // the longest open-water stretch inside the allowed part of the route
  let best = null, a = null;
  for (let i = 0; i < s.length; i++) {
    const f = L[i] / tot, [x, y] = s[i], ok = f >= EDGE[0] && f <= EDGE[1] && x > OPEN.x0 && x < OPEN.x1 && y > OPEN.y0 && y < OPEN.y1;
    if (ok && a == null) a = f;
    if ((!ok || i === s.length - 1) && a != null) { const b = ok ? f : L[i - 1] / tot; if (!best || b - a > best[1] - best[0]) best = [a, b]; a = null; }
  }
  if (!best || best[1] - best[0] < MIN) return false;
  return [+best[0].toFixed(2), +(best[1] - 0.04).toFixed(2)]; // leave a moment before the stretch ends
}
let set = 0, none = 0, kept = 0;
for (const id of fs.readdirSync(path.join(LIB, 'fish'))) {
  const fj = path.join(LIB, 'fish', id, 'fish.json'); if (!fs.existsSync(fj)) continue;
  const F = J(fj); if (!F.dive) continue;
  for (const rd of fs.readdirSync(path.join(LIB, 'fish', id, 'routes'))) {
    const dir = path.join(LIB, 'fish', id, 'routes', rd); if (!fs.statSync(dir).isDirectory()) continue;
    const rules = J(path.join(dir, 'rules.json')), route = J(path.join(dir, 'route.json'));
    if (rules.dive_hand) { kept++; continue; }
    const w = window(route); rules.dive = w; w ? set++ : none++;
    fs.writeFileSync(path.join(dir, 'rules.json'), JSON.stringify(rules, null, 1) + '\n');
  }
}
console.log(`dive windows: ${set} routes can dive, ${none} can't, ${kept} hand-set kept`);
