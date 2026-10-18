// Test bench: run the current game in every table setup (lab/environments.json), several seeds each, optionally against director
// changes you want to try, then write one page comparing them all. Every run keeps its report and its replay page in reports/.
// usage: node lab/testbench.js --name my-test [--envs all|full_house,quiet_afternoon] [--seeds 3] [--minutes 120] [--jobs 4]
//          [--try "seasons-3: --law season_length_waves=3"] (repeatable: a name, a colon, then any player lab options)
//          [--no-now] (skip the unchanged game; only the --try versions run)  [--out some/folder] (trial: LOG.csv and the library untouched)
// Writes reports/testbench_<name>.md (or <out>/testbench_<name>.md) and prints it.
const fs = require('fs'), path = require('path'), os = require('os'), {spawn, execFileSync} = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const args = k => argv.flatMap((a, i) => a === '--' + k && argv[i + 1] ? [argv[i + 1]] : []);
const name = String(arg('name', 'bench')).replace(/[^\w-]+/g, '-');
const ENVS = JSON.parse(fs.readFileSync(path.join(__dirname, 'environments.json'), 'utf8')).environments;
const envs = arg('envs', 'all') === 'all' ? Object.keys(ENVS) : arg('envs').split(',');
for (const e of envs) if (!ENVS[e]) { console.error(`unknown environment ${e} (have: ${Object.keys(ENVS).join(', ')})`); process.exit(1); }
const seeds = +arg('seeds', 3), minutes = +arg('minutes', 120), jobs = +arg('jobs', Math.max(1, Math.min(6, os.cpus().length - 1)));
const out = arg('out', null), reportsDir = out ? path.resolve(out) : path.join(ROOT, 'reports');
// split "name: --law a=b --plays off" into a name and its options (quotes not needed inside)
const versions = [...(argv.includes('--no-now') ? [] : [{id: 'now', opts: []}]), ...args('try').map(t => {
  const i = t.indexOf(':'); if (i < 1) { console.error(`--try needs "name: options", got ${t}`); process.exit(1); }
  return {id: t.slice(0, i).trim().replace(/[^\w-]+/g, '-'), opts: t.slice(i + 1).trim().split(/\s+/).filter(Boolean)};
})];
if (!versions.length) { console.error('nothing to run: --no-now without any --try'); process.exit(1); }

const label = (v, e) => `${name}-${v.id}-${e}`;
const queue = [];
for (const v of versions) for (const e of envs) for (let s = 1; s <= seeds; s++)
  queue.push(['lab/playerlab.js', '--env', e, '--seed', String(s), '--minutes', String(minutes), '--label', label(v, e), ...v.opts, ...(out ? ['--out', out] : [])]);
const total = queue.length;
console.log(`test bench ${name}: ${versions.length} version(s) × ${envs.length} table setup(s) × ${seeds} seed(s) = ${queue.length} runs of ${minutes} min, ${jobs} at a time`);

let done = 0, failed = 0;
const t0 = Date.now();
function next() {
  const a = queue.shift(); if (!a) return Promise.resolve();
  return new Promise(res => {
    const p = spawn(process.execPath, a, {cwd: ROOT, stdio: ['ignore', 'ignore', 'pipe']});
    let err = ''; p.stderr.on('data', d => err += d);
    p.on('close', code => {
      done++; if (code) { failed++; console.error(`\nFAILED: node ${a.join(' ')}\n${err.slice(-600)}`); }
      process.stdout.write(`\r  ${done}/${total} runs done (${Math.round((Date.now() - t0) / 1000)} s)`);
      res();
    });
  }).then(next);
}
Promise.all(Array.from({length: jobs}, next)).then(() => {
  console.log();
  if (failed) console.log(`${failed} run(s) failed; the page below leaves them out.`);
  // one comparison per table setup (versions side by side), using lab/compare.js on the LOG.csv these runs wrote
  const logDir = out ? path.resolve(out) : null;
  const md = [`# Test bench: ${name}`, '', `Made ${new Date().toISOString().slice(0, 16).replace('T', ' ')} by \`node lab/testbench.js ${argv.map(a => /\s/.test(a) ? `"${a}"` : a).join(' ')}\`.`,
    `${seeds} seed(s) × ${minutes} simulated minutes per cell. Each number is the average over the seeds, lowest and highest seed in brackets.`, ''];
  md.push('## Versions', '', ...versions.map(v => `- **${v.id}**: ${v.opts.length ? '`' + v.opts.join(' ') + '`' : 'the game and library as they are now, no changes'}`), '');
  md.push('## Table payback by setup', '', '| Table setup | ' + versions.map(v => `**${v.id}**`).join(' | ') + ' |', '|---|' + versions.map(() => '---').join('|') + '|');
  const sections = [];
  for (const e of envs) {
    let text = '';
    try {
      text = execFileSync(process.execPath, ['lab/compare.js', '--name', `${name}_${e}`, ...versions.map(v => label(v, e))],
        {cwd: ROOT, encoding: 'utf8', env: Object.assign({}, process.env, logDir ? {LAB_REPORTS: logDir} : {})});
    } catch (er) { text = `(comparison failed: ${String(er.message).slice(0, 200)})`; }
    const row = text.split('\n').find(l => l.startsWith('| Table payback %'));
    md.push(`| ${e} | ` + (row ? row.split('|').slice(2, -1).map(c => c.trim()).join(' | ') : versions.map(() => '–').join(' | ')) + ' |');
    sections.push(`## ${e}`, '', ENVS[e].about, '', ...text.split('\n').filter(l => l.startsWith('|')), '');
  }
  md.push('', 'Target payback is 97-98%.', '', ...sections);
  // replay links for every run in this bench
  const folders = fs.readdirSync(reportsDir).filter(f => versions.some(v => envs.some(e => f.includes(`_${label(v, e)}_s`)))).sort();
  md.push('## Replays', '', 'Open any of these in a browser to watch that night as the lab played it:', '', ...folders.map(f => `- ${f}/replay.html`), '');
  const file = path.join(reportsDir, `testbench_${name}.md`);
  fs.writeFileSync(file, md.join('\n'));
  console.log(md.slice(0, md.indexOf('Target payback is 97-98%.')).join('\n'));
  console.log(`\nfull page: ${path.relative(ROOT, file)}`);
});
