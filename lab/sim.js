// Shared by the player lab (node) and the replay pages (browser): the game patches, the setting tweaks and the player types.
// labTweak and labPlayers must stay self-contained (no outside names): replay.js copies their source text into each replay page.
// Every random draw goes through Math.random, so the same seed, setup and game file play the same night in both places.

// Patch the game's script so the lab can drive every seat and count every credit. Throws if the game changed under a patch.
function patchGame(html) {
  let script = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));
  const rep = (a, b) => { if (!script.includes(a)) throw new Error('patch miss: ' + a.slice(0, 70)); script = script.replace(a, b); };
  // the real cabinet has 10 seats; seats are built at load, so the default has to change before the game runs
  rep('const DEFAULTS = {players: 6,', 'const DEFAULTS = {players: 10,');
  // table setup (difficulty, fish amount, speed...) comes from the lab, never from a browser's saved settings
  rep("const saved = JSON.parse(localStorage.getItem('peacockreef.v2') || 'null');", 'const saved = globalThis.__labSettings || null;');
  // hand the lab the game's internals, and let it drive every bot seat
  rep('// ================= BOTS =================\nfunction botControl(s, dt, inp) {',
    `globalThis.__labApi = {fish: () => fish, bobbers: () => bobbers, director, gunMood, reachableFrom, aimAt, inBubble, castAt, removeBobber, fightPress, eatsBait, avgMult, pivot, BAITS,
    FIGHT_LAND: typeof startBite === 'function', // v9 bites: players land almost every fight
    under: typeof under !== 'undefined' ? () => under : null, deepInWater: typeof deepInWater === 'function' ? deepInWater : null, inNoCast: typeof inNoCast === 'function' ? inNoCast : null,
    sellBag: typeof sellBag === 'function' ? sellBag : null, cashOutBag: typeof cashOutBag === 'function' ? cashOutBag : null,
    W: () => W, H: () => H, S: () => S, time: () => time, running: () => running};
function botControl(s, dt, inp) {
  if (globalThis.__lab) return globalThis.__lab.control(s, dt, inp);`);
  // money in and out, per seat
  if (script.includes("s.points -= bet; if (!free) bookWager('gun', bet);")) rep("s.points -= bet; if (!free) bookWager('gun', bet);", "s.points -= bet; if (!free) { bookWager('gun', bet); globalThis.__lab && globalThis.__lab.wager(s, bet, 'gun'); }");
  else rep("s.points -= bet; if (!free) { bookWager('gun', bet);", "s.points -= bet; if (!free) { bookWager('gun', bet); globalThis.__lab && globalThis.__lab.wager(s, bet, 'gun');"); // v9+
  rep("bookWager('pole', B.cost);", "bookWager('pole', B.cost); globalThis.__lab && globalThis.__lab.wager(s, B.cost, 'pole');");
  rep("if (reward > 0) { seatPay(seat, reward, 'gun');", "if (reward > 0) { globalThis.__lab && globalThis.__lab.pay(seat, reward, 'gun', f.type.group, f.type.id); seatPay(seat, reward, 'gun');");
  rep("seatPay(s, pts, 'pole');", "globalThis.__lab && globalThis.__lab.pay(s, pts, 'pole', f.type.group, f.type.id); seatPay(s, pts, 'pole');");
  // the table is always 1600 x 900 in the lab, so fish paths match whatever screen a replay is watched on
  rep('const r = cv.getBoundingClientRect();\n  W = Math.max(320, r.width);', 'const r = {width: 1600, height: 900};\n  W = Math.max(320, r.width);');
  // laws, fish settings and plays are tried without editing the library: the game's copy is rewritten before it runs
  const hasLib = /\nconst LIB = .*;\n/.test(script);
  if (hasLib) script = script.replace(/\nconst LIB = (.*);\n/, (m, j) => '\nconst LIB = globalThis.__labTweak(' + j + ');\n');
  return {script, hasLib};
}

// cfg: {laws: {id: value}, fish: [[ 'tuna.group_sizes', value ]], plays: 'on' | 'off' | 'only:a,b' | 'except:a'}. Fills `tweaks` with what changed.
function labTweak(LIB, cfg, tweaks) {
  for (const [k, v] of Object.entries(cfg.laws || {})) { if (!(k in LIB.laws)) throw new Error('unknown law ' + k); tweaks.laws[k] = {from: LIB.laws[k], to: v}; LIB.laws[k] = v; }
  for (const [k, v] of cfg.fish || []) {
    const [lib, field] = k.split('.'), id = Object.keys(LIB.fish).find(g => LIB.fish[g].lib === lib || g === lib);
    if (!id) throw new Error('unknown fish ' + lib);
    const key = {group_sizes: 'sizes', formations_allowed: 'formations'}[field] || field, F = LIB.fish[id];
    if (key === 'formations') { const all = F.allFormations || F.formations; F.formations = Object.fromEntries(v.map(n => { if (!all[n]) throw new Error(`${lib} has no formation ${n}`); return [n, all[n]]; })); }
    else F[key] = v;
    tweaks.fish.push({fish: lib, field, to: v});
  }
  const [mode, list] = (cfg.plays || 'on').split(':'), names = (list || '').split(',').filter(Boolean);
  if (mode !== 'on' && mode !== 'off' && mode !== 'only' && mode !== 'except') throw new Error('--plays takes on, off, only:a,b or except:a');
  for (const p of LIB.plays || []) p.enabled = p.enabled !== false && (mode === 'on' || (mode === 'only' && names.includes(p.id)) || (mode === 'except' && !names.includes(p.id)));
  tweaks.plays = (LIB.plays || []).filter(p => p.enabled).map(p => p.id);
  return LIB;
}

// The 8 player types and the seat rotation. cfg: {mix: [type, ...] (who sits down, in turn), seats: [seat numbers 0-9 that get players]}.
function labPlayers(cfg) {
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (items, w) => { let t = 0; for (const it of items) t += w(it); let r = Math.random() * t; for (const it of items) if ((r -= w(it)) <= 0) return it; return items[items.length - 1]; };

  // buyIn: credits a new player sits down with. maxMin: when they go home if they haven't busted or quit.
  const TYPES = {
    sniper:  {name: 'Sniper',  buyIn: 2000,  maxMin: 60, about: 'Big fish and bosses only, lock-on, bet 10. Holds fire otherwise.'},
    sprayer: {name: 'Sprayer', buyIn: 1000,  maxMin: 60, about: 'Fires as fast as the gun allows at the closest fish, bet 1.'},
    chaser:  {name: 'Chaser',  buyIn: 2000,  maxMin: 60, about: 'Starts at bet 2, doubles after every 12 shots without a catch (cap 100), back to 2 after a catch.'},
    grinder: {name: 'Grinder', buyIn: 1000,  maxMin: 90, about: 'Steady bet 2, aims at mediums first, then smalls.'},
    whale:   {name: 'Whale',   buyIn: 20000, maxMin: 60, about: 'Bet 100 on bosses and Sharks, 50 on other big fish (lock-on), 10 on anything else.'},
    fisher:  {name: 'Fisher',  buyIn: 2000,  maxMin: 90, sell: 'hold', about: 'About 85% of the time on the pole with base and medium baits; lands 90% of fights (97% from v9, where the odds sit in the bite). Gun at bet 3 otherwise. Market: holds fish for the season-end bonus, sells only when short of points.'},
    casual:  {name: 'Casual',  buyIn: 1000,  maxMin: 45, sell: 'batch', about: 'Bets 1-5 on random fish, takes pauses, sometimes fishes. Leaves when down 400. Market: sells the bag once it holds 3 fish.'},
    newbie:  {name: 'Newbie',  buyIn: 500,   maxMin: 45, sell: 'now', about: 'Slow aim, fires before lined up (misses a lot), slow fire, bets 1-3. Lands 60% of fights (85% from v9). Market: sells every fish right away.'},
  };
  const ORDER = Object.keys(TYPES);
  const MIX = cfg.mix && cfg.mix.length ? cfg.mix : ORDER, SEATS = cfg.seats || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (const t of MIX) if (!TYPES[t]) throw new Error(`unknown player type ${t} (types: ${ORDER.join(', ')})`);

  let A; // game internals, set after the game loads
  const reachable = s => A.fish().filter(f => A.reachableFrom(s, f) && !A.inBubble(f));
  const closest = (s, list) => { const p = A.pivot(s); let best = null, bd = 1e18; for (const f of list) { const d = (f.x - p.x) ** 2 + (f.y - p.y) ** 2; if (d < bd) { bd = d; best = f; } } return best; };
  const isShark = f => f.type.id === 'shark';
  const bigOrBoss = f => f.type.group === 'big' || f.type.group === 'boss';

  // Free-aim gun: turn toward a target and fire when lined up within `tol`, waiting `wait` seconds between shots.
  function freeAim(s, P, dt, inp, target, rate, tol, wait) {
    if (!target) { inp.rot = Math.sign(-s.off) * (Math.abs(s.off) > 0.05 ? 0.5 : 0); return; }
    const diff = A.aimAt(s, target, dt, rate);
    P.wait -= dt;
    if (diff < tol && P.wait <= 0) { inp.fire = true; P.wait = wait(); }
  }
  // Lock-on gun: the game steers to the locked fish; fire once roughly on it.
  function lockFire(s, P, dt, inp, target) {
    if (s.lock !== target) { s.lock = target; return; }
    const diff = A.aimAt(s, target, dt, 0);
    if (diff < 0.06) inp.fire = true;
  }
  function keepTarget(s, P, test, choose) {
    if (!P.target || !A.reachableFrom(s, P.target) || A.inBubble(P.target) || !test(P.target) || Math.random() < P.dt * 0.15) {
      const c = reachable(s).filter(test);
      P.target = c.length ? choose(c) : null;
    }
    return P.target;
  }
  const weighted = c => { const sc = A.director.scene; return pick(c, f => f.type.group === 'boss' && sc && sc.boss ? 40 : Math.sqrt(f.type.group === 'special' ? 20 : A.avgMult(f.type, 'swingy'))); };

  // Pole: cast at a fish that eats the bait, ahead of where it swims; play the fight with the given landing rate.
  function poleTurn(s, P, dt, landRate) {
    const bb = s.bobber;
    if (bb && bb.state === 'fight') {
      const F = bb.fight;
      if (F.labOk === undefined) F.labOk = Math.random() < landRate;
      if (F.labOk) { if (F.phase === 'green' && !F.pressed && F.t < F.green - 0.12) A.fightPress(bb); }
      else if (F.phase === 'yellow' && F.got >= F.need - 1 && F.t < 0.2) A.fightPress(bb);
      return;
    }
    if (!bb) {
      const W = A.W(), H = A.H();
      if (A.under) { // v9: the fish that bite live under the water and can't be seen, so cast somewhere in reach, outside the deep middle
        const p = A.pivot(s); let x, y, k = 0;
        do { const ang = s.normal + rnd(-1.1, 1.1), d = rnd(H * 0.25, H * 0.75); x = p.x + Math.cos(ang) * d; y = p.y + Math.sin(ang) * d; } while (A.inNoCast(x, y) && ++k < 8);
        A.castAt(s, x, y);
      } else {
      const cand = A.fish().filter(f => !f.dead && !f.hooked && A.eatsBait(f.type.id, s.bait) && f.x > 60 && f.x < W - 60 && f.y > 80 && f.y < H - 80);
      const f = cand[Math.floor(Math.random() * cand.length)];
      if (f) A.castAt(s, f.x + Math.cos(f.heading) * f.speed * 1.2, f.y + Math.sin(f.heading) * f.speed * 1.2);
      else A.castAt(s, rnd(W * 0.25, W * 0.75), rnd(H * 0.3, H * 0.7));
      }
    } else { const a = Math.atan2(bb.y - A.pivot(s).y, bb.x - A.pivot(s).x); s.off += Math.max(-2 * dt, Math.min(2 * dt, wrap(a - s.normal) - s.off)); }
  }
  const wrap = a => ((a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
  // switch to the pole with a bait this player can afford; false if none
  function goPole(s, baits) {
    const ok = Object.keys(baits).filter(k => s.points >= A.BAITS[k].cost * 3);
    if (!ok.length) return false;
    s.mode = 'pole'; s.bait = pick(ok, k => baits[k]); s.lock = null; return true;
  }
  function goGun(s) { if (s.bobber && s.bobber.state !== 'fight') A.removeBobber(s.bobber); if (!s.bobber) s.mode = 'gun'; }

  const BRAIN = {
    sniper(s, P, dt, inp) {
      s.bet = 10;
      const t = keepTarget(s, P, bigOrBoss, c => c.reduce((a, b) => A.avgMult(b.type, 'swingy') > A.avgMult(a.type, 'swingy') ? b : a));
      if (!t) { s.lock = null; return; }
      lockFire(s, P, dt, inp, t);
    },
    sprayer(s, P, dt, inp) {
      s.bet = 1;
      P.target = closest(s, reachable(s));
      freeAim(s, P, dt, inp, P.target, 4, 0.12, () => 0);
    },
    chaser(s, P, dt, inp) {
      if (P.bet == null) P.bet = 2;
      if (P.missStreak >= 12) { P.bet = Math.min(100, P.bet * 2); P.missStreak = 0; }
      s.bet = P.bet;
      freeAim(s, P, dt, inp, keepTarget(s, P, () => true, weighted), 3, 0.08, () => rnd(0.18, 0.4));
    },
    grinder(s, P, dt, inp) {
      s.bet = 2;
      const all = reachable(s), med = all.filter(f => f.type.group === 'medium'), sm = all.filter(f => f.type.group === 'small');
      if (!P.target || !A.reachableFrom(s, P.target) || A.inBubble(P.target) || (P.target.type.group !== 'medium' && med.length)) P.target = closest(s, med.length ? med : sm.length ? sm : all);
      freeAim(s, P, dt, inp, P.target, 3, 0.08, () => rnd(0.3, 0.5));
    },
    whale(s, P, dt, inp) {
      const prize = reachable(s).filter(f => f.type.group === 'boss' || isShark(f)), big = reachable(s).filter(f => f.type.group === 'big');
      const t = prize[0] ? prize.reduce((a, b) => A.avgMult(b.type, 'swingy') > A.avgMult(a.type, 'swingy') ? b : a) : big[0];
      if (t) { s.bet = prize[0] ? 100 : 50; P.target = t; lockFire(s, P, dt, inp, t); return; }
      s.lock = null; s.bet = 10;
      freeAim(s, P, dt, inp, keepTarget(s, P, () => true, weighted), 3, 0.08, () => rnd(0.2, 0.4));
    },
    fisher(s, P, dt, inp) {
      P.switchT = (P.switchT ?? 0) - dt;
      if (P.switchT <= 0 && !s.bobber) {
        if (Math.random() < 0.85 && goPole(s, {worms: 2, shrimp: 2, squid: 3, crab: 3, live: 2, c_ws: 2, c_sc: 2})) P.switchT = rnd(60, 150);
        else { goGun(s); P.switchT = rnd(15, 40); }
      }
      // v9: a deep visitor's shadow in the water: a fisher with points to spare tries the boss bait while it lasts
      const deepNow = A.deepInWater && A.deepInWater();
      if (deepNow && !P.deepTry && !s.bobber && s.points >= A.BAITS.c_cg.cost * 3) { P.deepTry = true; if (Math.random() < 0.6) { s.mode = 'pole'; s.lock = null; s.bait = 'c_cg'; P.switchT = 40; } }
      if (!deepNow) { P.deepTry = false; if (s.bait === 'c_cg' && !s.bobber) s.bait = 'squid'; }
      if (s.mode === 'pole') { if (!s.bobber && s.points < A.BAITS[s.bait].cost) { goGun(s); P.switchT = 30; } else return poleTurn(s, P, dt, A.FIGHT_LAND ? 0.97 : 0.9); }
      s.bet = 3;
      freeAim(s, P, dt, inp, keepTarget(s, P, () => true, weighted), 3, 0.08, () => rnd(0.2, 0.4));
    },
    casual(s, P, dt, inp) {
      P.phaseT = (P.phaseT ?? rnd(30, 90)) - dt;
      if (P.phaseT <= 0) {
        P.paused = !P.paused; P.phaseT = P.paused ? rnd(10, 40) : rnd(30, 90);
        if (!P.paused && !(Math.random() < 0.2 && goPole(s, {worms: 3, shrimp: 2, squid: 1}))) goGun(s);
      }
      if (P.paused && !(s.bobber && s.bobber.state === 'fight')) return;
      if (s.mode === 'pole') { if (!s.bobber && s.points < A.BAITS[s.bait].cost) goGun(s); else return poleTurn(s, P, dt, A.FIGHT_LAND ? 0.93 : 0.8); }
      P.betT = (P.betT ?? 0) - dt;
      if (P.betT <= 0) { s.bet = pick([1, 2, 3, 5], v => ({1: 3, 2: 3, 3: 2, 5: 1})[v]); P.betT = rnd(20, 60); }
      freeAim(s, P, dt, inp, keepTarget(s, P, () => true, weighted), 2.5, 0.1, () => rnd(0.3, 0.7));
    },
    newbie(s, P, dt, inp) {
      P.switchT = (P.switchT ?? rnd(60, 180)) - dt;
      if (P.switchT <= 0 && !s.bobber) { if (s.mode === 'gun' && Math.random() < 0.3 && goPole(s, {worms: 3, shrimp: 2, squid: 2, crab: 1})) P.switchT = rnd(30, 60); else { goGun(s); P.switchT = rnd(60, 180); } }
      if (s.mode === 'pole') { if (!s.bobber && s.points < A.BAITS[s.bait].cost) goGun(s); else return poleTurn(s, P, dt, A.FIGHT_LAND ? 0.85 : 0.6); }
      P.betT = (P.betT ?? 0) - dt;
      if (P.betT <= 0) { s.bet = pick([1, 2, 3, 10], v => ({1: 5, 2: 3, 3: 2, 10: 0.5})[v]); P.betT = rnd(30, 90); }
      freeAim(s, P, dt, inp, keepTarget(s, P, () => true, weighted), 1.2, 0.35, () => rnd(0.7, 1.4));
    },
  };

  // ---- sessions ----
  // A seat holds one player at a time. When they bust, quit or go home, the seat sits empty for a short while,
  // then the next player type in the mix sits down, so every type plays every seat over a night.
  const sessions = [], seatState = [];
  function newSession(i, type, t) {
    const T = TYPES[type];
    const S = {seat: i, type, start: t, end: null, why: null, buyIn: T.buyIn, low: T.buyIn, high: T.buyIn, active: 0,
      w: {gun: 0, pole: 0}, p: {gun: 0, pole: 0}, shots: 0, casts: 0, catches: [], byGroup: {}, best: {pts: 0, x: 0, fish: null}};
    sessions.push(S);
    return S;
  }
  function sitDown(s, t) {
    const st = seatState[s.i];
    st.k = (st.k + 1) % MIX.length; st.type = MIX[st.k];
    st.session = newSession(s.i, st.type, t);
    st.P = {dt: 1 / 30, wait: 0, missStreak: 0};
    st.empty = 0;
    s.points = TYPES[st.type].buyIn; s.bet = 1; s.mode = 'gun'; s.lock = null; s.off = 0;
  }
  function leave(s, why, t) {
    const st = seatState[s.i], S = st.session;
    if (A.cashOutBag && s.bag && s.bag.length) A.cashOutBag(s);
    S.end = t; S.why = why; S.left = s.points;
    if (s.bobber) A.removeBobber(s.bobber);
    s.lock = null; s.mode = 'gun';
    st.P = null; st.empty = rnd(10, 30);
    st.last = S; // bullets still in the water keep paying this player
  }
  return {
    TYPES, ORDER, MIX, SEATS, sessions, seatState, leave,
    setApi(api) { A = api; },
    // seats not in SEATS stay empty all night ('none' in the game, so they are not drawn or driven)
    initSeats(seats, settings) {
      for (const s of seats) {
        const k = (s.i + MIX.length - 1) % MIX.length;
        seatState[s.i] = SEATS.includes(s.i) ? {k, type: MIX[k], P: null, empty: 0} : {closed: true, P: null};
        if (!SEATS.includes(s.i)) settings.seatInput[s.i] = 'none';
        s.points = 0;
      }
    },
    control(s, dt, inp) {
      const st = seatState[s.i]; if (!st || st.closed) return;
      const t = A.time();
      if (!st.P) { if ((st.empty -= dt) <= 0) sitDown(s, t); return; }
      const S = st.session, T = TYPES[st.type];
      S.low = Math.min(S.low, s.points); S.high = Math.max(S.high, s.points);
      const inFight = s.bobber && s.bobber.state === 'fight', waiting = s.bobber && s.bobber.state === 'wait';
      if (A.sellBag && s.bag && s.bag.length) { // market (v9): each type's selling style; anyone short of points sells first
        const style = T.sell || 'now', cheap = s.points < 3 * 15;
        if (style === 'now' || cheap || (style === 'batch' && s.bag.length >= 3)) A.sellBag(s, false);
      }
      if (!inFight && !waiting) {
        if (s.points < 1) return leave(s, 'bust', t);
        if (st.type === 'casual' && s.points <= T.buyIn - 400) return leave(s, 'quit', t);
        if ((t - S.start) / 60 >= T.maxMin) return leave(s, 'home', t);
      }
      st.P.dt = dt;
      if (!(st.type === 'casual' && st.P.paused)) S.active += dt;
      BRAIN[st.type](s, st.P, dt, inp);
    },
    wager(s, n, kind) {
      const st = seatState[s.i], S = st && st.P && st.session; if (!S) return;
      S.w[kind] += n; if (kind === 'gun') { S.shots++; st.P.missStreak++; } else S.casts++;
    },
    pay(s, n, kind, group, id) {
      const st = seatState[s.i]; if (!st) return;
      const S = st.P ? st.session : st.last; if (!S) return;
      S.p[kind] += n;
      const unit = kind === 'gun' ? Math.max(1, s.bet) : A.BAITS[s.bait] ? A.BAITS[s.bait].cost : 1;
      S.catches.push(S.active);
      S.byGroup[group] = (S.byGroup[group] || 0) + 1;
      if (n > S.best.pts) S.best = {pts: n, x: +(n / unit).toFixed(1), fish: id, kind};
      if (st.P) st.P.missStreak = 0, st.P.bet = null;
    },
  };
}

// Seats to fill when only some are taken: spread around the table (bottom row first, then top).
const spreadSeats = n => n >= 10 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] : [...new Set(Array.from({length: n}, (_, k) => Math.floor(k * 10 / n)))];

module.exports = {patchGame, labTweak, labPlayers, spreadSeats};
