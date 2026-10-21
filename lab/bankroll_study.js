// Bankroll study: how often a player starting with N points goes up, doubles, triples, reaches +500 or 10,000.
// Reads sessions.json from lab runs made with --buyin/--betcap/--maxmin and writes a markdown table per starting amount.
// usage: node lab/bankroll_study.js reports/bankroll_2026-10-20 [> out.md]
const fs = require('fs'), path = require('path');
const dir = process.argv[2] || 'reports/bankroll';
const all = fs.readdirSync(dir).flatMap(f => { const p = path.join(dir, f, 'sessions.json'); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : []; });
const ses = all.filter(S => S.why !== 'closing'); // sessions the end of the run cut short are left out
const pct = (n, d) => d ? (100 * n / d).toFixed(0) + '%' : '–';
const med = a => { if (!a.length) return null; const b = a.slice().sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };
const mins = s => s == null ? '–' : (s / 60).toFixed(0) + ' min';
const fmt = n => n == null ? '–' : Math.round(n).toLocaleString('en-US');
const out = [`# Bankroll study`, '', `${ses.length} finished sessions from ${dir}. Every player starts with the same points, plays at most the session cap, and bets no more than the cap for that start. "Worth" counts points plus unsold fish in the bag.`, ''];
const starts = [...new Set(ses.map(S => S.buyIn))].sort((a, b) => a - b);
for (const B of starts) {
  const L = ses.filter(S => S.buyIn === B), n = L.length;
  const has = k => L.filter(S => S.marks[k] != null), when = k => med(has(k).map(S => S.marks[k]));
  const bust = L.filter(S => S.why === 'bust'), ahead = L.filter(S => (S.left ?? 0) > B);
  const swing = L.filter(S => S.high >= B * 1.2 && S.low <= B * 0.8);
  const peak = L.map(S => S.high - B);
  const at = m => { const v = L.map(S => S.at[m] != null ? S.at[m] : (S.end - S.start < m * 60 ? (S.why === 'bust' ? 0 : null) : null)).filter(x => x != null); return {med: med(v), ahead: v.filter(x => x > B).length, n: v.length}; };
  out.push(`## Starting with ${fmt(B)} points (${n} sessions)`, '',
    '| Question | Answer |', '|---|---|',
    `| Ever went above ${fmt(B)} at some point | ${pct(has('up').length, n)} (typically after ${mins(when('up'))}) |`,
    `| Went up and down (≥20% up and ≥20% down in the same session) | ${pct(swing.length, n)} |`,
    `| Reached 2x (${fmt(2 * B)}) | ${pct(has('x2').length, n)} (typically after ${mins(when('x2'))}) |`,
    `| Reached 3x (${fmt(3 * B)}) | ${pct(has('x3').length, n)} (typically after ${mins(when('x3'))}) |`,
    `| Reached +500 (${fmt(B + 500)}) | ${pct(has('p500').length, n)} (typically after ${mins(when('p500'))}) |`,
    `| Reached 10,000 | ${pct(has('k10').length, n)}${has('k10').length ? ` (typically after ${mins(when('k10'))})` : ''} |`,
    `| Highest point, typical session | +${fmt(med(peak))} above start (best 1 in 10: +${fmt(peak.slice().sort((a, b) => a - b)[Math.floor(n * 0.9)])}) |`,
    `| Left ahead (cashed out more than ${fmt(B)}) | ${pct(ahead.length, n)} |`,
    `| Went broke | ${pct(bust.length, n)} (typically after ${mins(med(bust.map(S => S.end - S.start)))}) |`,
    ...[15, 30, 60].map(m => { const a = at(m); return `| Worth after ${m} min (typical; share ahead) | ${fmt(a.med)} · ${pct(a.ahead, a.n)} ahead |`; }),
    '');
  const types = [...new Set(L.map(S => S.type))];
  out.push('| Player type | Sessions | Ever up | 2x | 3x | +500 | Broke |', '|---|---|---|---|---|---|---|');
  for (const t of types) { const T = L.filter(S => S.type === t), c = k => pct(T.filter(S => S.marks[k] != null).length, T.length); out.push(`| ${t} | ${T.length} | ${c('up')} | ${c('x2')} | ${c('x3')} | ${c('p500')} | ${pct(T.filter(S => S.why === 'bust').length, T.length)} |`); }
  out.push('');
}
console.log(out.join('\n'));
