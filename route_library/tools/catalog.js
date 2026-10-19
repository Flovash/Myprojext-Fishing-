// Builds route_library/CATALOG.html: one scrollable, searchable page of everything in the library, sorted into tabs
// (Fish, Routes, Formations, Pole, Rituals, Director). Made by build_library.js from the folders; never edit it by hand.
const esc = s => String(s ?? '').replace(/[&<>"]/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[ch]);
const val = v => Array.isArray(v) ? (v.every(x => typeof x !== 'object') ? v.join('–') : JSON.stringify(v)) : v && typeof v === 'object' ? Object.entries(v).map(([k, x]) => `${k} ${val(x)}`).join(' · ') : String(v);
const pct = x => Math.round(x * 100) + '%';
const statusPill = s => { const live = /in game/i.test(s || ''); return `<span class="pill ${live ? 'live' : 'plan'}">${esc(s || 'designed')}</span>`; };

function catalogHtml(L, routeSvg, COLOR) {
  const fish = Object.values(L.fish);
  const bites = (L.pole.bite_styles && L.pole.bite_styles.styles) || {};
  const diveWin = r => r.rules.dive === false ? 'no dives' : Array.isArray(r.rules.dive) ? `dives ${pct(r.rules.dive[0])}–${pct(r.rules.dive[1])} along` : '';
  const counts = {fish: fish.length, routes: fish.reduce((a, f) => a + f.routes.length, 0), formations: fish.reduce((a, f) => a + Object.keys(f.formations).length, 0)};

  // ---- Fish ----
  const fishRows = fish.map(f => {
    const c = COLOR[f.id] || '#2f6f6a', bite = f.pole && f.pole.bite;
    const facts = [['Role', f.role], ['Home', f.home], ['Habit', f.habit], ...(f.rules ? [['Rules', f.rules.join(' ')]] : []),
      ['School', `${f.group_sizes[0] === f.group_sizes[1] ? f.group_sizes[0] : f.group_sizes.join('–')} · ${f.formations_allowed.join(', ')}`],
      ['Bite', bite ? `${bite}${bites[bite] ? ` · ${bites[bite].nibbles.join('–')} nibbles · tease ${pct(bites[bite].tease)} · loses as "${bites[bite].lose}"` : ''}` : 'not on the pole'],
      ['Dives', f.dive ? `1 trip in ${Math.round(1 / f.dive.chance)}` : f.pole && f.pole.deep_visitor ? 'deep visitor (shadow only)' : 'never']];
    const cards = f.routes.map(({route: r, rules}) => `<figure class="rc">${routeSvg(f, r)}<figcaption><b>${esc(r.name)}</b> <span class="mono">${r.dur ? r.dur.join('–') + ' s' : esc(r.dynamic || '')}</span><br>${esc(r.purpose)}${diveWin({rules}) ? `<br><span class="dim">${diveWin({rules})}</span>` : ''}</figcaption></figure>`).join('');
    const q = [f.name, f.group, f.status, f.role, f.habit, bite, ...f.routes.map(x => x.route.name)].join(' ').toLowerCase();
    return `<details class="row" data-q="${esc(q)}" data-group="${esc(f.group)}"><summary><i class="dot" style="background:${c}"></i><span class="nm">${esc(f.name)}</span><span class="chip">${esc(f.group)}</span><span class="mono dim">${esc(f.pays)}</span>${statusPill(f.status)}<span class="dim sm">${f.routes.length} route${f.routes.length === 1 ? '' : 's'} · ${Object.keys(f.formations).length} formation${Object.keys(f.formations).length === 1 ? '' : 's'}${bite ? ' · ' + esc(bite) + ' bite' : ''}${f.dive ? ' · dives' : ''}</span></summary>
<div class="body"><dl class="facts">${facts.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl><div class="cards">${cards}</div></div></details>`;
  }).join('\n');

  // ---- Routes (flat) ----
  const routeRows = fish.flatMap(f => f.routes.map(({route: r, rules}) => {
    const q = [f.name, r.name, r.purpose, f.group, (rules.if || []).join(' ')].join(' ').toLowerCase();
    return `<details class="row" data-q="${esc(q)}" data-group="${esc(f.group)}"><summary><i class="dot" style="background:${COLOR[f.id] || '#2f6f6a'}"></i><span class="nm">${esc(r.name)}</span><span class="dim sm">${esc(f.name)}</span><span class="mono dim">${r.dur ? r.dur.join('–') + ' s' : esc(r.dynamic || '')}</span>${rules.attitude ? `<span class="chip">${esc(rules.attitude)}</span>` : ''}${diveWin({rules}) ? `<span class="dim sm">${diveWin({rules})}</span>` : ''}</summary>
<div class="body split"><div class="sk">${routeSvg(f, r)}</div><div><p>${esc(r.purpose)}</p>${rules.if && rules.if.length ? `<p class="dim"><b>If:</b> ${esc(rules.if.join(' '))}</p>` : ''}${rules.why && rules.why !== r.purpose ? `<p class="dim">${esc(rules.why)}</p>` : ''}<p class="mono dim sm">fish/${esc(f.id)}/routes/ · ${esc(r.id)}</p></div></div></details>`;
  })).join('\n');

  // ---- Formations ----
  const formRows = fish.flatMap(f => Object.entries(f.formations).map(([k, fm]) => {
    const on = f.formations_allowed.includes(k);
    return `<div class="line" data-q="${esc([f.name, k, fm.what].join(' ').toLowerCase())}" data-group="${esc(f.group)}"><i class="dot" style="background:${COLOR[f.id] || '#2f6f6a'}"></i><span class="nm">${esc(f.name)} · ${esc(k)}</span><span class="mono dim">${fm.sizes ? fm.sizes.join('–') : ''}</span>${on ? '' : '<span class="pill plan">not allowed now</span>'}<span class="dim sm grow">${esc(fm.what || '')}</span></div>`;
  })).join('\n');

  // ---- Pole ----
  const table = (head, rows) => `<div class="tw"><table><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const who = st => fish.filter(f => f.pole && f.pole.bite === st).map(f => f.name).join(', ');
  const settings = (o) => o ? `<dl class="facts">${Object.entries(o).filter(([k]) => k !== 'about').map(([k, v]) => `<dt class="mono">${esc(k)}</dt><dd>${esc(val(v))}</dd>`).join('')}</dl>` : '';
  const block = (id, title, about, inner) => `<section class="blk" data-q="${esc((title + ' ' + (about || '')).toLowerCase())}"><h3 id="${id}">${esc(title)}</h3>${about ? `<p class="dim">${esc(about)}</p>` : ''}${inner}</section>`;
  const P = L.pole;
  const pole = [
    block('bites', 'Bite styles', P.bite_styles && P.bite_styles.about, table(['Style', 'Fish', 'Nibbles', 'Gap s', 'Circles s', 'Tease', 'When it gets away'],
      Object.entries(bites).map(([k, b]) => [`<b>${esc(k)}</b>`, esc(who(k)), b.nibbles.join('–'), b.gap.join('–'), b.circle ? b.circle.join('–') : '–', pct(b.tease), esc(b.lose)]))),
    block('feeding', 'Feeding times', P.feeding && P.feeding.about, settings(P.feeding)),
    block('underwater', 'Underwater world', P.underwater && P.underwater.about, settings(P.underwater)),
    block('deep', 'Deep visitors', P.deep_visitors && P.deep_visitors.about, settings(P.deep_visitors)),
    block('market', 'Bait market', P.market && P.market.about, settings(P.market)),
  ].join('\n');

  // ---- Rituals ----
  const R = L.rituals || {shared: {}, list: {}};
  const rituals = block('rit-shared', 'Shared settings', R.shared.about, settings(R.shared)) + table(['Ritual', 'Green light', 'Scene', 'Chance per check', 'Own cooldown', 'Why'],
    Object.values(R.list).map(r => [`<b>${esc(r.name)}</b>`, esc(r.chainOnly ? 'after ' + r.chain_from : r.green_light), esc(r.scene), pct(r.chance), r.cooldown ? r.cooldown + ' min' : '–', esc(r.why)]));

  // ---- Director ----
  const lawSecs = Object.entries(L.laws).filter(([, v]) => Array.isArray(v)).map(([sect, list]) => block('law-' + sect, sect.replace(/_/g, ' '), null,
    table(['Law', 'Value', 'What it does', 'Status'], list.map(l => [`<span class="mono">${esc(l.id)}</span>`, esc(val(l.value)) + (l.unit ? ' ' + esc(l.unit) : ''), esc(l.what), statusPill(l.status)])))).join('\n');
  const director = [
    L.laws.law_zero ? `<p class="law0"><b>Law zero.</b> ${esc(typeof L.laws.law_zero === 'string' ? L.laws.law_zero : L.laws.law_zero.what || val(L.laws.law_zero))}</p>` : '',
    lawSecs,
    block('seasons', 'Seasons', L.seasons && L.seasons.about, table(['Season', 'Label', 'Tint'], ((L.seasons && L.seasons.seasons) || []).map(s => [`<b>${esc(s.name)}</b>`, esc(s.label || ''), s.tint ? `<i class="dot" style="background:${esc(s.tint)}"></i> <span class="mono">${esc(s.tint)}</span>` : '']))),
    block('plays', 'Plays', 'If-then rules the director checks every few seconds; each sends schools or starts an effect.', table(['Play', 'If', 'Then', 'Why'], L.plays.map(p => [`<span class="mono">${esc(p.id)}</span>`, esc(val(p.if)), esc(val(p.then)), esc(p.why || '')]))),
    block('show', 'Gun show tools', L.show && L.show.about, settings(L.show)),
    block('diving', 'Dive budget', L.diving && L.diving.about, settings(L.diving)),
  ].join('\n');

  const tabs = [['fish', 'Fish', counts.fish, fishRows], ['routes', 'Routes', counts.routes, routeRows], ['formations', 'Formations', counts.formations, formRows],
    ['pole', 'Pole', null, pole], ['rituals', 'Rituals', Object.keys(R.list).length, rituals], ['director', 'Director', null, director]];

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Reef Library Catalog</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bungee&family=Baloo+2:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
/* Layout: the route library's field-guide look as a catalog. Sticky bar (title, search, tabs), then one scrollable list per tab; rows open in place. */
:root {
  --bg: #e6efed; --surface: #f6faf9; --ink: #0e2a2e; --muted: #4d696b; --line: #c4d6d2; --water: #d3e9e4; --accent: #c94f22; --live: #2f7a3a; --plan: #9a6a10;
  --display: "Bungee", "Arial Black", Impact, sans-serif; --body: "Baloo 2", "Trebuchet MS", "Segoe UI", system-ui, sans-serif; --mono: "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #0a1a1d; --surface: #0f262a; --ink: #e2efed; --muted: #93aeab; --line: #22403e; --water: #123236; --accent: #f0997b; --live: #8fd19a; --plan: #f2c36b; color-scheme: dark } }
:root[data-theme="dark"] { --bg: #0a1a1d; --surface: #0f262a; --ink: #e2efed; --muted: #93aeab; --line: #22403e; --water: #123236; --accent: #f0997b; --live: #8fd19a; --plan: #f2c36b; color-scheme: dark }
* { box-sizing: border-box }
body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--body); font-size: 16px; line-height: 1.45 }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 10; background: var(--surface) }
.bar { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: var(--surface); border-bottom: 1px solid var(--line);
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 12px 0 }
.bar-in, main { max-width: 1060px; margin: 0 auto }
.top { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: baseline; justify-content: space-between }
h1 { font-family: var(--display); font-weight: 400; font-size: 1.35rem; margin: 0; letter-spacing: .02em; text-wrap: balance }
.sub { color: var(--muted); font-size: .9rem }
.ctl { display: flex; flex-wrap: wrap; gap: 8px; margin-block: 10px }
#q { flex: 1 1 220px; min-width: 0; font: inherit; padding: 8px 12px; border-radius: 10px; border: 1px solid var(--line); background: var(--bg); color: var(--ink) }
#grp { font: inherit; padding: 8px 10px; border-radius: 10px; border: 1px solid var(--line); background: var(--bg); color: var(--ink) }
nav { display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none }
nav button { font: 600 .95rem var(--body); color: var(--muted); background: none; border: 0; border-bottom: 3px solid transparent; padding: 8px 12px; cursor: pointer; white-space: nowrap }
nav button[aria-selected="true"] { color: var(--ink); border-bottom-color: var(--accent) }
nav button .n { font: 500 .75rem var(--mono); color: var(--muted); margin-left: 4px }
button:focus-visible, summary:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }
main { padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 16px 48px; display: grid; gap: 16px }
.panel { display: grid; gap: 6px; min-width: 0 }
.row { background: var(--surface); border: 1px solid var(--line); border-radius: 10px; min-width: 0 }
.row > summary { list-style: none; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; padding: 10px 12px; cursor: pointer }
.row > summary::-webkit-details-marker { display: none }
.row > summary::after { content: "+"; margin-left: auto; font-family: var(--mono); color: var(--muted) }
.row[open] > summary::after { content: "–" }
.line { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 8px 12px; border-bottom: 1px solid var(--line) }
.dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; flex: none }
.nm { font-weight: 700 }
.chip { font-size: .78rem; text-transform: uppercase; letter-spacing: .06em; padding: 1px 8px; border-radius: 99px; background: var(--water); color: var(--ink) }
.pill { font-size: .75rem; padding: 1px 8px; border-radius: 99px; border: 1px solid currentColor }
.pill.live { color: var(--live) } .pill.plan { color: var(--plan) }
.mono { font-family: var(--mono); font-size: .82rem; font-variant-numeric: tabular-nums } .dim { color: var(--muted) } .sm { font-size: .88rem } .grow { flex: 1 1 260px; min-width: 0 }
.body { padding: 4px 12px 14px; display: grid; gap: 12px; min-width: 0 }
.facts { display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 4px 14px; margin: 0 }
.facts dt { color: var(--muted); font-size: .85rem; text-transform: uppercase; letter-spacing: .05em } .facts dd { margin: 0; min-width: 0 }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px }
.rc { margin: 0; display: grid; gap: 6px; min-width: 0 } .rc svg, .sk svg { width: 100%; height: auto; border-radius: 8px; border: 1px solid var(--line); display: block }
.rc figcaption { font-size: .9rem }
.split { grid-template-columns: minmax(0, 260px) minmax(0, 1fr); align-items: start } .split p { margin: 0 0 6px }
@media (max-width: 560px) { .split { grid-template-columns: minmax(0, 1fr) } }
.blk { display: grid; gap: 8px; min-width: 0 } .blk h3 { font-family: var(--display); font-weight: 400; font-size: 1rem; margin: 10px 0 0; letter-spacing: .02em; text-transform: capitalize } .blk p { margin: 0; max-width: 70ch }
.tw { overflow-x: auto; border: 1px solid var(--line); border-radius: 10px; background: var(--surface) }
table { border-collapse: collapse; width: 100%; font-size: .9rem } th, td { text-align: left; padding: 7px 10px; border-bottom: 1px solid var(--line); vertical-align: top } th { font-size: .78rem; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); white-space: nowrap }
.law0 { margin: 0; padding: 12px 14px; border-radius: 10px; background: var(--water); max-width: 80ch }
.empty { color: var(--muted); padding: 12px }
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto } }
</style></head><body>
<div class="bar"><div class="bar-in">
<div class="top"><h1>Reef Library Catalog</h1><span class="sub">${counts.fish} fish · ${counts.routes} routes · ${counts.formations} formations · made from <span class="mono">route_library/</span> by build_library.js</span></div>
<div class="ctl"><input id="q" type="search" placeholder="Search fish, routes, laws… (e.g. seat, Shark, dive)" aria-label="Search the catalog">
<select id="grp" aria-label="Fish group"><option value="">All groups</option>${['tiny', 'small', 'medium', 'big', 'boss', 'special'].map(g => `<option value="${g}">${g}</option>`).join('')}</select></div>
<nav role="tablist">${tabs.map(([id, name, n], i) => `<button role="tab" id="t-${id}" aria-controls="p-${id}" aria-selected="${i === 0}" data-tab="${id}">${name}${n != null ? `<span class="n">${n}</span>` : ''}</button>`).join('')}</nav>
</div></div>
<main>${tabs.map(([id, , , html], i) => `<section class="panel" role="tabpanel" id="p-${id}" aria-labelledby="t-${id}"${i ? ' hidden' : ''}>${html}<p class="empty" hidden>Nothing here matches. Clear the search or pick another group.</p></section>`).join('\n')}</main>
<script>
const tabs = [...document.querySelectorAll('nav button')], q = document.getElementById('q'), grp = document.getElementById('grp');
function show(id) {
  tabs.forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === id)));
  document.querySelectorAll('.panel').forEach(p => { p.hidden = p.id !== 'p-' + id; });
  try { localStorage.setItem('reefcat.tab', id); } catch (e) {}
  filter();
}
function filter() {
  const words = q.value.toLowerCase().split(/\\s+/).filter(Boolean), g = grp.value;
  const panel = document.querySelector('.panel:not([hidden])'); if (!panel) return;
  let shown = 0;
  panel.querySelectorAll('[data-q]').forEach(el => {
    const ok = words.every(w => el.dataset.q.includes(w)) && (!g || !el.dataset.group || el.dataset.group === g);
    el.hidden = !ok; if (ok) shown++;
  });
  panel.querySelector('.empty').hidden = shown > 0;
}
tabs.forEach(b => b.addEventListener('click', () => show(b.dataset.tab)));
q.addEventListener('input', filter); grp.addEventListener('change', filter);
let start = location.hash.slice(1);
if (!tabs.some(b => b.dataset.tab === start)) { try { start = localStorage.getItem('reefcat.tab') || 'fish'; } catch (e) { start = 'fish'; } }
show(tabs.some(b => b.dataset.tab === start) ? start : 'fish');
</script>
</body></html>
`;
}
module.exports = {catalogHtml};
