// Test-only audit of the fishing-pole math. Reads the bait, mood and fight tables straight out of the game file
// (nothing in the game changes) and reports, for every bait and every fish that eats it, the theoretical return per
// cast once that fish reaches the bobber, then checks it with a seeded simulation of the same roll the game makes.
// usage: node lab/pole_audit.js [game.html] [--casts 200000] [--seeds 1,2,3]
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const file = args.find(a => a.endsWith('.html')) || path.join(__dirname, '..', 'game', 'peacock_reef.html');
const CASTS = +opt('--casts', 200000), SEEDS = opt('--seeds', '1,2,3').split(',').map(Number);
const html = fs.readFileSync(file, 'utf8');
const cut = (a, b) => { const i = html.indexOf(a), j = html.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found: ' + a); return html.slice(i, j); };
const src = cut('const L5 =', '// ================= SCENES');
const T = new Function(src + '; return {BAITS, POLE_MOODS, FIGHT, FIGHT_AVG, payAvg, moodEV, rollPay, pay};')();
const {BAITS, POLE_MOODS, FIGHT_AVG, payAvg, rollPay} = T;

// seeded random (mulberry32) so every seed reproduces
const seeded = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

// One cast against one row, the way the game does it: nibble roll (bite / FIGHT_AVG, max .97), the fight
// (an average player lands FIGHT_AVG of fights), Swordfish escape, then the pay roll and the Golden Angelfish swap.
function castOnce(row) {
  if (Math.random() >= Math.min(0.97, row.b / FIGHT_AVG)) return 0;
  if (Math.random() >= FIGHT_AVG) return 0;
  if (row.escape && Math.random() < row.escape) return 0;
  let pts = rollPay(row).pts;
  if (row.golden && Math.random() < row.golden[0]) pts = row.golden[1];
  return pts;
}
const theory = row => {
  const land = Math.min(0.97, row.b / FIGHT_AVG) * FIGHT_AVG * (1 - (row.escape || 0));
  const avg = row.golden ? payAvg(row) * (1 - row.golden[0]) + row.golden[1] * row.golden[0] : payAvg(row);
  return land * avg;
};

const rows = [];
for (const [bait, B] of Object.entries(BAITS)) for (const [id, e] of Object.entries(B.fish)) {
  if (e === 'pocket') { rows.push({bait, id, cost: B.cost, note: 'Golden Koi: chance set by the golden pocket balance (5% / 8.8% / 11%), pays 5000', row: null}); continue; }
  if (e === 'mood') { for (const m of POLE_MOODS[id].moods) rows.push({bait, id: `${id} (${m.n})`, cost: B.cost, row: m, share: m.t}); continue; }
  rows.push({bait, id, cost: B.cost, row: e});
}
const pct = x => (x * 100).toFixed(1) + '%';
const out = [];
out.push(`# Pole math audit`, '', `Game file: ${path.relative(process.cwd(), file)}  ·  ${CASTS.toLocaleString()} casts per row per seed  ·  seeds ${SEEDS.join(', ')}`, '',
  'Return = average points paid per cast ÷ bait cost, once that fish has reached the bobber. Spoiled bait (nothing came in 30 s) is not counted here; the lab counts it.', '',
  'Worst z = the largest gap between theory and a seed, measured in standard errors of that seed. Under 3 means the game rolls exactly what its tables say; rare big pays (Swordfish, bosses) swing more in points but not in z.', '',
  '| Bait | Cost | Fish | Theory | ' + SEEDS.map(s => `Seed ${s}`).join(' | ') + ' | Worst z |', '|---|---|---|---|' + SEEDS.map(() => '---|').join('') + '---|');
for (const r of rows) {
  if (!r.row) { out.push(`| ${r.bait} | ${r.cost} | koi | – | ${SEEDS.map(() => '–').join(' | ')} | ${r.note} |`); continue; }
  const th = theory(r.row) / r.cost;
  const zs = [], sims = SEEDS.map(seed => {
    Math.random = seeded(seed * 7919 + rows.indexOf(r)); let p = 0, q = 0;
    for (let i = 0; i < CASTS; i++) { const v = castOnce(r.row) / r.cost; p += v; q += v * v; }
    const mean = p / CASTS, se = Math.sqrt(Math.max(0, q / CASTS - mean * mean) / CASTS);
    zs.push(se > 0 ? Math.abs(mean - th) / se : 0); return mean;
  });
  r.th = th; r.z = Math.max(...zs);
  out.push(`| ${r.bait} | ${r.cost} | ${r.id} | ${pct(th)} | ${sims.map(pct).join(' | ')} | ${r.z.toFixed(1)} |`);
}
// mood-weighted average for moody fish (if the jar never blocked Wild)
out.push('', '## Moody fish, averaged over their moods', '', '| Fish | Home bait | Low | Normal | Wild | Weighted |', '|---|---|---|---|---|---|');
for (const [id, M] of Object.entries(POLE_MOODS)) {
  const ev = m => theory(m) / M.cost;
  const w = M.moods.reduce((a, m) => a + m.t * ev(m), 0);
  const by = n => { const m = M.moods.find(x => x.n === n); return m ? pct(ev(m)) : '–'; };
  out.push(`| ${id} | ${M.cost} | ${by('Low')} | ${by('Normal')} | ${M.moods.find(x => x.n === 'Frenzy') ? 'Frenzy ' + by('Frenzy') : by('Wild')} | ${pct(w)} |`);
}
const worst = Math.max(...rows.filter(r => r.z != null).map(r => r.z));
const sorted = rows.filter(r => r.th != null).sort((a, b) => a.th - b.th);
const zRows = rows.filter(r => r.z != null).length * SEEDS.length;
out.push('', `Worst z across ${zRows} seed runs: ${worst.toFixed(1)} (${worst < 4 ? 'PASS: within chance' : 'CHECK: bigger than chance alone explains'}).`,
  `Lowest return: ${sorted[0].bait} → ${sorted[0].id} ${pct(sorted[0].th)}. Highest: ${sorted.at(-1).bait} → ${sorted.at(-1).id} ${pct(sorted.at(-1).th)}.`);
const text = out.join('\n') + '\n';
const dest = opt('--out', null);
if (dest) fs.writeFileSync(dest, text);
process.stdout.write(text);
