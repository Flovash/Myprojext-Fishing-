// Compare groups of lab runs side by side (each group = one label, all its seeds), and write a short page about it.
// usage: node lab/compare.js --name seasons season-3 season-6 season-9
//   (labels as written in reports/LOG.csv; the newest run of each label+seed counts)
// Writes reports/compare_<name>.md and prints the same table.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), REPORTS = process.env.LAB_REPORTS || path.join(ROOT, 'reports'); // LAB_REPORTS: a trial folder (lab/testbench.js --out)
const argv = process.argv.slice(2), ni = argv.indexOf('--name');
const name = ni >= 0 ? argv[ni + 1] : 'runs', labels = argv.filter((a, i) => a !== '--name' && i !== ni + 1);
if (!labels.length) { console.log('usage: node lab/compare.js --name <name> <label> <label> ...'); process.exit(1); }

// trial runs (--out) each keep their own LOG.csv inside their folder: read those when there is no shared one
const logTexts = fs.existsSync(path.join(REPORTS, 'LOG.csv')) ? [fs.readFileSync(path.join(REPORTS, 'LOG.csv'), 'utf8')]
  : fs.readdirSync(REPORTS).map(f => path.join(REPORTS, f, 'LOG.csv')).filter(f => fs.existsSync(f)).map(f => fs.readFileSync(f, 'utf8'));
const lines = logTexts.flatMap((t, k) => t.trim().split('\n').slice(k ? 1 : 0)).map(l => l.split(','));
const head = lines.shift(), col = n => head.indexOf(n);
const parseCsv = text => text.trim().split('\n').map(l => l.split(','));

// medium fish per run, from the run's dispatches.csv
function mediumStats(folder) {
  const f = path.join(REPORTS, folder, 'dispatches.csv');
  if (!fs.existsSync(f)) return null;
  const rows = parseCsv(fs.readFileSync(f, 'utf8')), h = rows.shift(), c = n => h.indexOf(n);
  const med = rows.filter(r => ['tuna', 'barracuda', 'octopus', 'swordfish', 'turtle'].includes(r[c('fish')]));
  const fishN = med.reduce((a, r) => a + +r[c('size')] * (r[c('variant')].includes('+x2') ? 2 : 1), 0), caught = med.reduce((a, r) => a + +r[c('caught')] + +r[c('pole_caught')], 0);
  const firsts = med.map(r => r[c('first_catch_s')]).filter(v => v !== '').map(Number);
  const never = med.filter(r => +r[c('caught')] + +r[c('pole_caught')] === 0).length;
  return {schools: med.length, catchRate: fishN ? 100 * caught / fishN : null, firstCatch: firsts.length ? firsts.reduce((a, b) => a + b, 0) / firsts.length : null, untouched: med.length ? 100 * never / med.length : null};
}
const METRICS = [
  ['payback', 'Table payback %'], ['gun_payback', 'Gun payback %'], ['pole_payback', 'Pole payback %'], ['seat_spread', 'Seat spread (pts)'],
  ['mean_session_min', 'Average session (min)'], ['p90_longest_dry_s', 'Longest dry spell, p90 (s)'], ['p90_between_wins_s', 'Time between wins, p90 (s)'],
  ['catches_per_min', 'Catches per player-minute'], ['plays_fired', 'Plays fired'],
  ['med_catch_rate', 'Medium fish caught (% of fish sent)'], ['med_first_catch', 'Medium: first catch after sending (s)'], ['med_untouched', 'Medium schools with no catch (%)'],
];
const groups = labels.map(lbl => {
  const latest = new Map();
  for (const r of lines) if (r[col('label')] === lbl) latest.set(r[col('seed')], r); // newest row per seed wins
  const runs = [...latest.values()].map(r => {
    const o = Object.fromEntries(METRICS.slice(0, 9).map(([k]) => [k, r[col(k)] === '' || r[col(k)] == null ? null : +r[col(k)]]));
    const m = mediumStats(r[col('folder')]);
    o.med_catch_rate = m && m.catchRate; o.med_first_catch = m && m.firstCatch; o.med_untouched = m && m.untouched;
    o.folder = r[col('folder')]; o.minutes = +r[col('minutes')]; o.changes = r[col('changes')] || ''; o.plays = r[col('plays')] || '';
    return o;
  });
  return {label: lbl, runs};
});
const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
const cell = (g, k) => {
  const v = g.runs.map(r => r[k]).filter(x => x != null && !Number.isNaN(x));
  if (!v.length) return '–';
  const m = mean(v), lo = Math.min(...v), hi = Math.max(...v), d = Math.abs(m) >= 100 ? 0 : 1;
  return v.length > 1 ? `${m.toFixed(d)} (${lo.toFixed(d)}–${hi.toFixed(d)})` : m.toFixed(d);
};
const out = [`# Lab comparison: ${name}`, '', `Made ${new Date().toISOString().slice(0, 16).replace('T', ' ')} by \`node lab/compare.js --name ${name} ${labels.join(' ')}\`. Each cell is the average over the seeds, with the lowest and highest seed in brackets.`, ''];
out.push('| | ' + groups.map(g => `**${g.label}**`).join(' | ') + ' |', '|---|' + groups.map(() => '---').join('|') + '|');
out.push('| Runs | ' + groups.map(g => `${g.runs.length} × ${!g.runs[0] ? '–' : g.runs[0].minutes < 60 ? g.runs[0].minutes + ' min' : +(g.runs[0].minutes / 60).toFixed(1) + ' h'}`).join(' | ') + ' |');
out.push('| Changes | ' + groups.map(g => (g.runs[0] && g.runs[0].changes) || 'none').join(' | ') + ' |');
out.push('| Plays | ' + groups.map(g => (g.runs[0] && g.runs[0].plays) || '–').join(' | ') + ' |');
for (const [k, lab] of METRICS) out.push(`| ${lab} | ` + groups.map(g => cell(g, k)).join(' | ') + ' |');
out.push('', 'Runs: ' + groups.map(g => `${g.label}: ${g.runs.map(r => r.folder).join(', ')}`).join('; '), '');
fs.writeFileSync(path.join(REPORTS, `compare_${name}.md`), out.join('\n'));
console.log(out.join('\n'));
