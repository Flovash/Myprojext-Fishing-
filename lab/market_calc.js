// Market calculator: works out the pole's numbers on paper before the lab plays them.
// For every bait and every fish it eats: catch chance, average catch value, average weight, the season-end weight bonus,
// and the return per point of bait for a player who sells right away vs one who holds to the season end.
// Reads the bait, mood and fish tables out of the game file, and the market from route_library/pole/market.json. Nothing changes.
// usage: node lab/market_calc.js [game.html] [--bonus tiny=12,small=6,medium=0.5,big=0.08,boss=0.02] [--share 0.06] [--out file.md]
//   --bonus  try other lb bonus rates (points per lb, per group) without editing the game
//   --share  print the per-group rates that would make the bonus worth this share of a fish's value on average
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const file = args.find(a => a.endsWith('.html')) || path.join(__dirname, '..', 'game', 'peacock_reef.html');
const html = fs.readFileSync(file, 'utf8');
const cut = (a, b) => { const i = html.indexOf(a), j = html.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found in game: ' + a); return html.slice(i, j); };
const species = cut('const SPECIES = [', 'const SP = ');
const pole = cut('const L5 =', '// ================= SCENES');
const hasMarket = html.includes('const MARKET = ');
const market = hasMarket ? cut('const MARKET = ', '\n// end MARKET') : 'const MARKET = {bonusPerLb: {}};';
const T = new Function(`${species}; const SP = Object.fromEntries(SPECIES.map(s => [s.id, s])); ${pole}; ${market}; return {SP, BAITS, POLE_MOODS, FIGHT_AVG, payAvg, MARKET};`)();
const {SP, BAITS, POLE_MOODS, FIGHT_AVG, payAvg, MARKET} = T;
// the route library's market file wins over the game's defaults, like in the game
const libMarket = path.join(__dirname, '..', 'route_library', 'pole', 'market.json');
if (fs.existsSync(libMarket)) { const m = JSON.parse(fs.readFileSync(libMarket, 'utf8')); delete m.about; Object.assign(MARKET, m); }

const rates = Object.assign({}, MARKET.bonusPerLb);
if (opt('--bonus')) for (const kv of opt('--bonus').split(',')) { const [g, v] = kv.split('='); rates[g] = +v; }
const pct = x => x == null ? '–' : (x * 100).toFixed(1) + '%';
const n1 = x => x >= 100 ? Math.round(x).toLocaleString('en-US') : x >= 10 ? x.toFixed(1) : x.toFixed(2);

// a row's average weight: the size roll when the pay is by weight, else the middle of the fish's weight range
const avgLb = (id, row) => row.size ? (row.size[0] + row.size[1]) / 2 : (SP[id].lb[0] + SP[id].lb[1]) / 2;
const valueAvg = row => row.golden ? payAvg(row) * (1 - row.golden[0]) + row.golden[1] * row.golden[0] : payAvg(row);
const landChance = row => Math.min(0.97, row.b / FIGHT_AVG) * FIGHT_AVG * (1 - (row.escape || 0));

const rows = [];
for (const [bait, B] of Object.entries(BAITS)) for (const [id, e] of Object.entries(B.fish)) {
  if (e === 'pocket') continue; // Golden Koi: fixed 5000, no weight bonus
  const list = e === 'mood' ? POLE_MOODS[id].moods.map(m => ({label: `${id} (${m.n})`, row: m, share: m.t})) : [{label: id, row: e, share: 1}];
  for (const it of list) {
    const g = SP[id].group, land = landChance(it.row), val = valueAvg(it.row), lb = avgLb(id, it.row), bonus = lb * (rates[g] || 0);
    rows.push({bait, cost: B.cost, id, g, label: it.label, land, val, lb, bonus, sell: land * val / B.cost, hold: land * (val + bonus) / B.cost, share: it.share});
  }
}

const out = [];
out.push('# Market calculator', '', `Game file: ${path.relative(process.cwd(), file)}${hasMarket ? '' : ' (no MARKET table yet: bonus rates only from --bonus)'}`, '',
  `Weight bonus rates (points per lb): ${['tiny', 'small', 'medium', 'big', 'boss'].map(g => `${g} ${rates[g] ?? 0}`).join(' · ')}`, '',
  'Land = chance a cast lands the fish once it reaches the bobber (nibble, fight won by an average player, escapes).',
  'Sell now = return per point of bait if the fish is sold right away (its catch value). Hold = kept to the season end (catch value + lb bonus).', '',
  '| Bait | Cost | Fish | Group | Land | Avg value | Avg lb | Avg bonus | Bonus share | Sell now | Hold |', '|---|---|---|---|---|---|---|---|---|---|---|');
for (const r of rows) out.push(`| ${r.bait} | ${r.cost} | ${r.label} | ${r.g} | ${pct(r.land)} | ${n1(r.val)} | ${n1(r.lb)} | ${n1(r.bonus)} | ${pct(r.bonus / r.val)} | ${pct(r.sell)} | ${pct(r.hold)} |`);

// per group: how big the bonus is next to the fish's value, and the rate that would hit --share
const share = +opt('--share', 0.06);
out.push('', `## By group`, '', `Suggested rate = points per lb that makes the bonus about ${pct(share)} of an average catch's value for that group.`, '',
  '| Group | Fish | Avg value | Avg lb | Rate now | Bonus share now | Suggested rate |', '|---|---|---|---|---|---|---|');
for (const g of ['tiny', 'small', 'medium', 'big', 'boss']) {
  const rs = rows.filter(r => r.g === g); if (!rs.length) continue;
  const w = r => r.share, W = rs.reduce((a, r) => a + w(r), 0);
  const val = rs.reduce((a, r) => a + w(r) * r.val, 0) / W, lb = rs.reduce((a, r) => a + w(r) * r.lb, 0) / W;
  out.push(`| ${g} | ${[...new Set(rs.map(r => r.id))].join(', ')} | ${n1(val)} | ${n1(lb)} | ${rates[g] ?? 0} | ${pct(lb * (rates[g] || 0) / val)} | ${+(share * val / lb).toPrecision(2)} |`);
}
const text = out.join('\n') + '\n';
if (opt('--out')) fs.writeFileSync(opt('--out'), text);
process.stdout.write(text);
