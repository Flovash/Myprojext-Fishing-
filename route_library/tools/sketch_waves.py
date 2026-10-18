"""Sketch waves from the route library and the laws.

Usage (from the library folder):
    python3 tools/sketch_waves.py                       # waves/plan_waves_08_16.json with laws/laws.json
    python3 tools/sketch_waves.py --seed 7              # same plan, different medium choices
    python3 tools/sketch_waves.py --laws director/my_test.json --out waves/test_run

It keeps the big fish where the plan puts them, fills in the medium relay by the laws,
and writes one JSON file per wave plus a sketch page (waves.html) you can open in a browser.
"""
import argparse, glob, html, json, math, os, random

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
ap = argparse.ArgumentParser()
ap.add_argument('--laws', default=os.path.join(ROOT, 'director', 'laws.json'))
ap.add_argument('--plan', default=os.path.join(ROOT, 'waves', 'plan_waves_08_16.json'))
ap.add_argument('--out', default=os.path.join(ROOT, 'waves'))
ap.add_argument('--seed', type=int, default=816)
a = ap.parse_args()
random.seed(a.seed)
def load_fish(d):
    # fish/<id>/fish.json + routes/<route>/route.json (+ the picking rules the sketcher uses from rules.json)
    f = json.load(open(os.path.join(d, 'fish.json'))); rs = {}
    for rd in glob.glob(os.path.join(d, 'routes', '*')):
        r = json.load(open(os.path.join(rd, 'route.json'))); ru = json.load(open(os.path.join(rd, 'rules.json')))
        if ru.get('attitude'): r['attitude'] = ru['attitude']
        rs[r['id']] = r
    f['routes'] = [rs[i] for i in f['route_order']]
    return f
FISH = {os.path.basename(d): load_fish(d) for d in glob.glob(os.path.join(ROOT, 'fish', '*')) if os.path.isdir(d)}
LAWS = {l['id']: l['value'] for sect in ('big_fish', 'medium_fish') for l in json.load(open(a.laws))[sect]}
PLAN = json.load(open(a.plan))['waves']
MEDS = ['turtle', 'octopus', 'tuna', 'barracuda', 'swordfish']
FAST = {'tuna', 'barracuda', 'swordfish'}

# ---------- geometry ----------
def cr(pts, n=10):
    g = lambda i: pts[max(0, min(len(pts) - 1, i))]; o = []
    for i in range(len(pts) - 1):
        p0, p1, p2, p3 = g(i - 1), g(i), g(i + 1), g(i + 2)
        for k in range(n):
            t = k / n; t2 = t * t; t3 = t2 * t
            o.append(tuple(0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in (0, 1)))
    o.append(tuple(pts[-1])); return o
def lin(pts, n=6):
    o = []
    for i in range(len(pts) - 1):
        for k in range(n): t = k / n; o.append((pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t))
    o.append(tuple(pts[-1])); return o
def tf(pts, mx=0, my=0, rev=0):
    q = [[1 - x if mx else x, 1 - y if my else y] for x, y in pts]
    return q[::-1] if rev else q
def arclen(s):
    L = [0]
    for i in range(1, len(s)): L.append(L[-1] + math.dist(s[i], s[i - 1]))
    return L
def pos(o, t):
    if t < o['t0'] or t > o['t1']: return None
    s, L = o['s'], o['L']; tgt = (t - o['t0']) / max(.1, o['t1'] - o['t0']) * L[-1]
    for i in range(1, len(L)):
        if L[i] >= tgt: return s[i]
    return s[-1]
def onscreen(s): return [p for p in s if 0 <= p[0] <= 1 and 0 <= p[1] <= 1]
def direction(s):
    s = onscreen(s) or s; d = s[-1][0] - s[0][0]
    return 1 if d > .3 else -1 if d < -.3 else 0
def crosses_center(s): xs = [p[0] for p in s if 0 <= p[1] <= 1]; return bool(xs) and min(xs) < .47 and max(xs) > .53

# ---------- big fish from the plan ----------
def big(b):
    r = next(x for x in FISH[b['kind']]['routes'] if x['id'] == b['route'])
    pts = [p[:] for p in r['pts']]
    if b.get('lane') is not None: d = b['lane'] - pts[0][1]; pts = [[x, y + d] for x, y in pts]
    pts = tf(pts, b.get('mx', 0), b.get('my', 0), b.get('rev', 0))
    s = lin(pts) if b['kind'] == 'marlin' and b['route'] in ('dash', 'diag', 'cut') else cr(pts)
    if r.get('sway'): s = [(x, y + .03 * math.sin(i * .9)) for i, (x, y) in enumerate(s)]
    o = dict(b, name=r['name'], attitude=r.get('attitude'), pts=pts, s=s, L=arclen(s))
    o['P'] = {t: q for t in range(int(o['t0']), int(o['t1']) + 1) for q in [pos(o, t)] if q and 0 <= q[0] <= 1 and 0 <= q[1] <= 1}
    o['dir'] = 0 if b['route'] in ('patrol', 'feed', 'split', 'inspector') else direction(s)
    return o

# ---------- medium relay by the laws ----------
def variants(sp, r):
    out = []
    combos = [(mx, my, 0) for mx in (0, 1) for my in (0, 1)] if r.get('edge') else [(mx, my, rv) for mx in (0, 1) for my in (0, 1) for rv in (0, 1)]
    for mx, my, rv in combos:
        for sh in (r.get('shifts') or [0]):
            for ln in (r.get('lanes') or [0]):
                pts = tf([[x + sh, y + ln] for x, y in r['pts']], mx, my, rv)
                s = lin(pts) if r.get('sharp') else cr(pts)
                v = dict(sp=sp, id=r['id'], name=r['name'], pts=pts, s=s, L=arclen(s), x=int(r.get('crosser') or 0), twin=bool(r.get('twin')))
                if v['twin']: v['s2'] = cr(tf(pts, 0, 1, 0))
                out.append(v)
    return out
def relay(w, bigs):
    meds = []; gaps = LAWS['medium_gaps_seconds']; lane = LAWS['lane_reservation_seconds']; clear = LAWS['medium_clearance']; cw = LAWS['counterflow_weight']
    def fast_now(t):
        n = sum(1 for b in bigs if b['kind'] == 'marlin' and b['t0'] <= t <= b['t1'])
        return n + sum(m['x'] for m in meds if m['t0'] <= t <= m['t1'] and m['sp'] in FAST)
    cur = {sp: random.uniform(0, 6) for sp in MEDS}; last = {sp: None for sp in MEDS}
    while cur:
        sp = min(cur, key=cur.get); t0 = cur[sp]
        if t0 > w['dur'] - 6: del cur[sp]; continue
        routes = FISH[sp]['routes']
        d0 = min(r['dur'][0] for r in routes); d1 = max(r['dur'][1] for r in routes)
        t1 = t0 + random.uniform(d0, d1); best = None
        for r in routes:
            if r['id'] == last[sp]: continue
            for v in variants(sp, r):
                v['t0'], v['t1'] = t0, t1
                score = random.uniform(0, .4)
                if v['x'] and sp in FAST and max(fast_now(t) for t in range(int(t0), int(t1) + 1)) + v['x'] > LAWS['fast_crossers_max']: score -= 10
                for b in bigs:
                    if not (b['t0'] < t1 and b['t1'] > t0): continue
                    lim = clear[b['kind']]; worst = 9
                    ahead = {'shark': lane['shark_ahead'], 'manta': lane['manta_ahead'], 'hammerhead': lane['hammerhead_ahead']}.get(b['kind'], 0)
                    behind = lane['shark_behind'] if b['kind'] == 'shark' else 0
                    for t in range(int(max(t0, b['t0'] - 4)), int(min(t1, b['t1'] + 2)) + 1):
                        p = pos(v, t)
                        if not p or not (0 <= p[0] <= 1 and 0 <= p[1] <= 1): continue
                        qs = [q for tt, q in b['P'].items() if t - behind <= tt <= t + ahead]
                        for pp in [p] + ([(p[0], 1 - p[1])] if v['twin'] else []):
                            for q in qs: worst = min(worst, math.dist(pp, q))
                    if worst < lim: score -= 2 + 8 * (lim - worst) / lim
                    if b['kind'] == 'shark':
                        if b['route'] == 'split' and LAWS['split_rule'] and crosses_center(v['s']): score -= 10
                        if b['dir'] and v['x']:
                            md = direction(v['s']); score += cw['against'] if md == -b['dir'] else (cw['with'] if md == b['dir'] else 0)
                if best is None or score > best[0]: best = (score, v)
        if best is None or best[0] < -2.5: cur[sp] = t0 + 2; continue
        meds.append(best[1]); last[sp] = best[1]['id']; cur[sp] = t1 + random.uniform(*gaps[sp])
    return meds

# ---------- run ----------
os.makedirs(a.out, exist_ok=True)
waves = []
for w in PLAN:
    bigs = [big(b) for b in w['bigs']]
    meds = relay(w, bigs)
    opp = same = 0
    for b in bigs:
        if b['kind'] == 'shark' and b['dir']:
            for m in meds:
                if m['x'] and m['t0'] < b['t1'] and m['t1'] > b['t0']:
                    md = direction(m['s']); opp += md == -b['dir']; same += md == b['dir']
    peak = max(sum(1 for b in bigs if b['kind'] == 'marlin' and b['t0'] <= t <= b['t1']) + sum(m['x'] for m in meds if m['t0'] <= t <= m['t1'] and m['sp'] in FAST) for t in range(w['dur']))
    rec = dict(n=w['n'], seconds=w['dur'], title=w['title'], story=w['story'], seed=a.seed,
               big_fish=[dict(fish=b['kind'], route=b['route'], name=b['name'], start=b['t0'], end=b['t1'], tag=b.get('tag', ''), points=[[round(x, 3), round(y, 3)] for x, y in b['pts']]) for b in bigs],
               mediums=[dict(fish=m['sp'], route=m['id'], name=m['name'], start=round(m['t0'], 1), end=round(m['t1'], 1), direction={1: 'right', -1: 'left', 0: 'local'}[direction(m['s'])] if m['x'] else 'local', points=[[round(x, 3), round(y, 3)] for x, y in m['pts']]) for m in meds],
               checks=dict(medium_visits=len(meds), crossings_against_shark=opp, crossings_with_shark=same, peak_fast_crossers=peak))
    json.dump(rec, open(os.path.join(a.out, 'wave_%02d.json' % w['n']), 'w'), indent=1)
    waves.append((w, bigs, meds, rec))
    print('wave %d: %d medium visits, %d against / %d with the Shark, peak fast crossers %d' % (w['n'], len(meds), opp, same, peak))

# ---------- sketch page ----------
NAMES = {'tuna': 'Tuna', 'barracuda': 'Barracuda', 'octopus': 'Octopus', 'swordfish': 'Swordfish', 'turtle': 'Turtle', 'shark': 'Shark', 'manta': 'Manta', 'hammerhead': 'Hammerhead', 'marlin': 'Marlin'}
CSS = {'swordfish': 'sword', 'hammerhead': 'hammer'}
c = lambda k: CSS.get(k, k)
ROWS = ['shark', 'manta', 'hammerhead', 'marlin', 'tuna', 'barracuda', 'octopus', 'swordfish', 'turtle']
ARW = {1: ' →', -1: ' ←', 0: ''}
def Pp(p): return (20 + p[0] * 200, 15 + p[1] * 120)
def poly(s): return ' '.join('%.1f,%.1f' % Pp(p) for p in s)
def seats(): return '<path class="seat" d="' + ''.join('M%.0f %dh8' % (20 + 200 * f - 4, y) for f in (.1, .3, .5, .7, .9) for y in (15, 135)) + '"/>'
def snap(w, bigs, meds, t, cap):
    o = ['<svg viewBox="0 0 240 150" role="img" aria-label="Screen at %d seconds: %s">' % (t, html.escape(cap)), '<rect class="water" x="20" y="15" width="200" height="120" rx="6"/>', seats()]
    for b in bigs:
        if b['t0'] <= t <= b['t1']:
            if b['kind'] == 'shark': o.append('<polyline class="lane" points="%s"/>' % poly(b['s']))
            o.append('<polyline class="k-%s" style="stroke-width:%.1f" points="%s" marker-end="url(#arr)"/>' % (c(b['kind']), 2.6 if b.get('tag') == 'Shadow' else 3.2, poly(b['s'])))
    for m in meds:
        if m['t0'] <= t <= m['t1']:
            o.append('<polyline class="k-%s%s" points="%s" marker-end="url(#arr)"/>' % (c(m['sp']), ' slow' if m['sp'] in ('turtle', 'octopus') else '', poly(m['s'])))
            if m['twin']: o.append('<polyline class="k-tuna" points="%s" marker-end="url(#arr)"/>' % poly(m['s2']))
    for x_ in bigs + meds:
        p = pos(x_, t)
        if not p: continue
        k = x_.get('kind') or x_['sp']; X, Y = Pp(p)
        if not (-10 < X < 250 and -10 < Y < 160): continue
        o.append('<circle class="f-%s now" cx="%.1f" cy="%.1f" r="%.1f"/>' % (c(k), X, Y, 5 if k in ('shark', 'manta', 'hammerhead') else 3.6))
        if k == 'manta': o += ['<circle class="follower" cx="%.1f" cy="%.1f" r="1.6"/>' % (X - math.cos(i * 2.4) * (9 + i % 3 * 4) - 6, Y + math.sin(i * 2.4) * (9 + i % 3 * 4) * .7) for i in range(9)]
        if x_.get('twin'): X2, Y2 = Pp((p[0], 1 - p[1])); o.append('<circle class="f-tuna now" cx="%.1f" cy="%.1f" r="3.6"/>' % (X2, Y2))
    if w.get('wait') and w['wait'][0] <= t < w['wait'][1]: o.append('<g class="waiting"><circle class="f-shark" cx="9" cy="39" r="5"/><text x="1" y="56">waits</text></g>')
    return ''.join(o) + '</svg>'
def timeline(w, bigs, meds):
    X = lambda t: 104 + t * 640 / 75
    o = ['<svg viewBox="0 0 760 222" role="img" aria-label="Timeline of wave %d">' % w['n']]
    for b in bigs:
        if b['kind'] == 'shark' and not b.get('tag'): o.append('<rect class="shade" x="%.1f" y="2" width="%.1f" height="182"/>' % (X(b['t0']), X(b['t1']) - X(b['t0'])))
    for i, r in enumerate(ROWS): y = 6 + i * 20; o.append('<text class="rowlab" x="0" y="%d">%s</text><line class="grid" x1="104" x2="744" y1="%d" y2="%d"/>' % (y + 11, NAMES[r], y + 8, y + 8))
    if w.get('wait'): s0, s1 = w['wait']; o.append('<rect class="waitbar" x="%.1f" y="6" width="%.1f" height="16" rx="3"/><text class="barlab dark" x="%.1f" y="18">waiting</text>' % (X(s0), X(s1) - X(s0), X(s0) + 4))
    shadow = any(b.get('tag') == 'Shadow' for b in bigs)
    for b in bigs:
        if b.get('tag') == 'pair': continue
        row = ROWS.index(b['kind']); y = 6 + row * 20; h = 16
        if b['kind'] == 'shark' and shadow: h = 7; y += 9 if b.get('tag') == 'Shadow' else 0
        wd = X(min(b['t1'], 75)) - X(b['t0']); o.append('<rect class="f-%s" x="%.1f" y="%d" width="%.1f" height="%d" rx="3"/>' % (c(b['kind']), X(b['t0']), y, wd, h))
        nm = b['name'] + (' ×2' if any(x.get('tag') == 'pair' for x in bigs) and b['kind'] == 'hammerhead' else '')
        if h == 16 and wd > 6.2 * len(nm) + 8: o.append('<text class="barlab" x="%.1f" y="%d">%s</text>' % (X(b['t0']) + 4, y + 12, html.escape(nm)))
        if b.get('tag') == 'Shadow': o.append('<text class="rowlab" x="%.1f" y="%d">%s + Shadow</text>' % (X(min(b['t1'], 75)) + 6, 6 + row * 20 + 12, html.escape(b['name'])))
    for m in meds:
        row = ROWS.index(m['sp']); y = 6 + row * 20; wd = X(min(m['t1'], 75)) - X(m['t0'])
        o.append('<rect class="f-%s" x="%.1f" y="%d" width="%.1f" height="16" rx="3"/>' % (c(m['sp']), X(m['t0']), y, wd))
        for lab in (m['name'] + (ARW[direction(m['s'])] if m['x'] else ''), m['name']):
            if wd > 6.0 * len(lab) + 8: o.append('<text class="barlab" x="%.1f" y="%d">%s</text>' % (X(m['t0']) + 4, y + 12, html.escape(lab))); break
    for k, (t, cap) in enumerate(w['snaps']):
        o.append('<line class="snapline" x1="%.1f" x2="%.1f" y1="2" y2="186"/><circle class="snapdot" cx="%.1f" cy="196" r="8"/><text class="snaplab" x="%.1f" y="199.5" text-anchor="middle">%s</text>' % (X(t), X(t), X(t), X(t), 'ABC'[k]))
    o += ['<text class="tick" x="%.1f" y="216" text-anchor="middle">%ds</text>' % (X(t), t) for t in range(0, 76, 15)]
    return ''.join(o) + '</svg>'
def glance(bigs):
    o = ['<svg viewBox="0 0 240 150" aria-hidden="true"><rect class="water" x="20" y="15" width="200" height="120" rx="6"/>', seats()]
    for b in bigs:
        if b['kind'] in ('shark', 'manta') and b.get('tag') != 'Shadow':
            if b['kind'] == 'shark': o.append('<polyline class="lane" points="%s"/>' % poly(b['s']))
            o.append('<polyline class="k-%s" style="stroke-width:4" points="%s" marker-end="url(#arr)"/>' % (b['kind'], poly(b['s'])))
    return ''.join(o) + '</svg>'
def badges(w, bigs):
    ks = [b['kind'] for b in bigs]; out = []
    if 'manta' in ks: out.append(('Meeting', 'hot') if w.get('meet') else ('Manta', ''))
    if ks.count('shark') > 1: out.append(('2 Sharks', 'hot'))
    if any(b.get('tag') == 'pair' for b in bigs): out.append(('Hammerhead pair', ''))
    elif 'hammerhead' in ks: out.append(('Hammerhead', ''))
    if ks.count('marlin') > 1: out.append(('Marlin ×2', ''))
    if w.get('wait'): out.append(('Shark waits', 'hot'))
    return ''.join('<span class="badge %s">%s</span>' % (k, t) for t, k in out)
cards, tiles = [], []
for w, bigs, meds, rec in waves:
    sh = next(b for b in bigs if b['kind'] == 'shark' and not b.get('tag'))
    ch = rec['checks']
    flow = ('While the Shark was crossing, %d medium crossings went against it and %d with it.' % (ch['crossings_against_shark'], ch['crossings_with_shark'])) if ch['crossings_against_shark'] + ch['crossings_with_shark'] else 'This Shark route has no left-right direction, so mediums keep to their own side instead.'
    snaps = []
    for k, (t, cap) in enumerate(w['snaps']):
        lst = ['%s · %s%s' % (NAMES[m['sp']], m['name'], ARW[direction(m['s'])] if m['x'] else '') for m in meds if m['t0'] <= t <= m['t1']]
        snaps.append('<figure class="snap"><div class="snaphead"><span class="letter">%s</span><span class="time">%d s</span></div>%s<figcaption><strong>%s</strong><span class="onscreen">%s</span></figcaption></figure>' % ('ABC'[k], t, snap(w, bigs, meds, t, cap), html.escape(cap), html.escape('; '.join(lst)) if lst else 'No mediums on screen'))
    cards.append('<section class="wave" id="w%d"><header class="wavehead"><div class="wavenum">Wave %d</div><div class="wavetitle"><h2>%s</h2><div class="badges">%s</div></div></header><p class="story">%s</p><p class="meta">Shark: <strong>%s</strong> (%s) · %d mediums enter · %s</p><div class="tl">%s</div><div class="snaps">%s</div></section>' % (
        w['n'], w['n'], html.escape(w['title']), badges(w, bigs), html.escape(w['story']), sh['name'], sh['attitude'], len(meds), flow, timeline(w, bigs, meds), ''.join(snaps)))
    tiles.append('<a class="tile" href="#w%d"><span class="tnum">%d</span>%s<span class="tname">%s</span></a>' % (w['n'], w['n'], glance(bigs), html.escape(sh['name'])))
LEG = ''.join('<span class="leg"><i class="sw f-%s"></i>%s</span>' % (c(k), NAMES[k]) for k in ROWS)
page = open(os.path.join(HERE, 'sketch_template.html')).read().replace('%TILES%', ''.join(tiles)).replace('%CARDS%', '\n'.join(cards)).replace('%LEGEND%', LEG)
open(os.path.join(a.out, 'waves.html'), 'w').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + page + '</html>')
print('wrote', os.path.join(a.out, 'waves.html'))
