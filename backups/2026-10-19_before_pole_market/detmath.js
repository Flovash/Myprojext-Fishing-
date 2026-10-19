// Same-everywhere math and sorting for the lab and the replay pages.
// Browsers and node do not agree on the last digit of Math.sin, cos, atan2, exp and log2 (Chrome 155 vs node 24 differ),
// and over minutes of play that last digit grows into a different night. These are fdlibm's versions in plain JavaScript,
// which only uses + - * /, so every engine gets the same answer. installDetMath must stay self-contained: replay.js copies its source.
function installDetMath(M) {
  const F = new Float64Array(1), U = new Uint32Array(F.buffer); // U[0] low word, U[1] high word (little-endian, as on every machine we run)
  const hiw = x => { F[0] = x; return U[1] | 0; }, low = x => { F[0] = x; return U[0]; };
  const words = (h, l) => { U[1] = h; U[0] = l; return F[0]; };
  const nat = {sin: M.sin, cos: M.cos, atan2: M.atan2, exp: M.exp, log2: M.log2};

  // ---- sin / cos ----
  const S1 = -1.66666666666666324348e-01, S2 = 8.33333333332248946124e-03, S3 = -1.98412698298579493134e-04, S4 = 2.75573137070700676789e-06, S5 = -2.50507602534068634195e-08, S6 = 1.58969099521155010221e-10;
  function ksin(x, y, iy) {
    const ix = hiw(x) & 0x7fffffff;
    if (ix < 0x3e400000 && (x | 0) === 0) return x;
    const z = x * x, v = z * x, r = S2 + z * (S3 + z * (S4 + z * (S5 + z * S6)));
    return iy === 0 ? x + v * (S1 + z * r) : x - ((z * (0.5 * y - v * r) - y) - v * S1);
  }
  const C1 = 4.16666666666666019037e-02, C2 = -1.38888888888741095749e-03, C3 = 2.48015872894767294178e-05, C4 = -2.75573143513906633035e-07, C5 = 2.08757232129817482790e-09, C6 = -1.13596475577881948265e-11;
  function kcos(x, y) {
    const ix = hiw(x) & 0x7fffffff;
    if (ix < 0x3e400000 && (x | 0) === 0) return 1;
    const z = x * x, r = z * (C1 + z * (C2 + z * (C3 + z * (C4 + z * (C5 + z * C6)))));
    if (ix < 0x3FD33333) return 1 - (0.5 * z - (z * r - x * y));
    const qx = ix > 0x3fe90000 ? 0.28125 : words(ix - 0x00200000, 0), hz = 0.5 * z - qx, a = 1 - qx;
    return a - (hz - (z * r - x * y));
  }
  const invpio2 = 6.36619772367581382433e-01, pio2_1 = 1.57079632673412561417e+00, pio2_1t = 6.07710050650619224932e-11, pio2_2 = 6.07710050630396597660e-11,
    pio2_2t = 2.02226624879595063154e-21, pio2_3 = 2.02226624871116645580e-21, pio2_3t = 8.47842766036889956997e-32;
  const NPIO2_HW = [0x3FF921FB, 0x400921FB, 0x4012D97C, 0x401921FB, 0x401F6A7A, 0x4022D97C, 0x4025FDBB, 0x402921FB, 0x402C463A, 0x402F6A7A, 0x4031475C, 0x4032D97C,
    0x40346B9C, 0x4035FDBB, 0x40378FDB, 0x403921FB, 0x403AB41B, 0x403C463A, 0x403DD85A, 0x403F6A7A, 0x40407E4C, 0x4041475C, 0x4042106C, 0x4042D97C,
    0x4043A28C, 0x40446B9C, 0x404534AC, 0x4045FDBB, 0x4046C6CB, 0x40478FDB, 0x404858EB, 0x404921FB];
  const Y = [0, 0];
  // x reduced to y0 + y1 in [-pi/4, pi/4]; returns the quadrant. Only for |x| up to about 2^19 * pi/2 (the callers check).
  function remPio2(x) {
    const hx = hiw(x), ix = hx & 0x7fffffff;
    if (ix < 0x4002d97c) {
      let z;
      if (hx > 0) { z = x - pio2_1; if (ix !== 0x3ff921fb) { Y[0] = z - pio2_1t; Y[1] = (z - Y[0]) - pio2_1t; } else { z -= pio2_2; Y[0] = z - pio2_2t; Y[1] = (z - Y[0]) - pio2_2t; } return 1; }
      z = x + pio2_1; if (ix !== 0x3ff921fb) { Y[0] = z + pio2_1t; Y[1] = (z - Y[0]) + pio2_1t; } else { z += pio2_2; Y[0] = z + pio2_2t; Y[1] = (z - Y[0]) + pio2_2t; } return -1;
    }
    let t = Math.abs(x);
    const n = (t * invpio2 + 0.5) | 0, fn = n;
    let r = t - fn * pio2_1, w = fn * pio2_1t;
    if (n < 32 && ix !== NPIO2_HW[n - 1]) Y[0] = r - w;
    else {
      const j = ix >> 20; Y[0] = r - w;
      let i = j - ((hiw(Y[0]) >> 20) & 0x7ff);
      if (i > 16) {
        t = r; w = fn * pio2_2; r = t - w; w = fn * pio2_2t - ((t - r) - w); Y[0] = r - w;
        i = j - ((hiw(Y[0]) >> 20) & 0x7ff);
        if (i > 49) { t = r; w = fn * pio2_3; r = t - w; w = fn * pio2_3t - ((t - r) - w); Y[0] = r - w; }
      }
    }
    Y[1] = (r - Y[0]) - w;
    if (hx < 0) { Y[0] = -Y[0]; Y[1] = -Y[1]; return -n; }
    return n;
  }
  M.sin = function sin(x) {
    const ix = hiw(x) & 0x7fffffff;
    if (ix <= 0x3fe921fb) return ksin(x, 0, 0);
    if (ix >= 0x7ff00000) return x - x;
    if (ix > 0x413921fb) return nat.sin(x);
    switch (remPio2(x) & 3) { case 0: return ksin(Y[0], Y[1], 1); case 1: return kcos(Y[0], Y[1]); case 2: return -ksin(Y[0], Y[1], 1); default: return -kcos(Y[0], Y[1]); }
  };
  M.cos = function cos(x) {
    const ix = hiw(x) & 0x7fffffff;
    if (ix <= 0x3fe921fb) return kcos(x, 0);
    if (ix >= 0x7ff00000) return x - x;
    if (ix > 0x413921fb) return nat.cos(x);
    switch (remPio2(x) & 3) { case 0: return kcos(Y[0], Y[1]); case 1: return -ksin(Y[0], Y[1], 1); case 2: return -kcos(Y[0], Y[1]); default: return ksin(Y[0], Y[1], 1); }
  };

  // ---- atan / atan2 ----
  const ATANHI = [4.63647609000806093515e-01, 7.85398163397448278999e-01, 9.82793723247329054082e-01, 1.57079632679489655800e+00];
  const ATANLO = [2.26987774529616870924e-17, 3.06161699786838301793e-17, 1.39033110312309984516e-17, 6.12323399573676603587e-17];
  const AT = [3.33333333333329318027e-01, -1.99999999998764832476e-01, 1.42857142725034663711e-01, -1.11111104054623557880e-01, 9.09088713343650656196e-02,
    -7.69187620504482999495e-02, 6.66107313738753120669e-02, -5.83357013379057348645e-02, 4.97687799461593236017e-02, -3.65315727442169155270e-02, 1.62858201153657823623e-02];
  function atan(x) {
    const hx = hiw(x), ix = hx & 0x7fffffff;
    let id;
    if (ix >= 0x44100000) { if (x !== x) return x + x; return hx > 0 ? ATANHI[3] + ATANLO[3] : -ATANHI[3] - ATANLO[3]; }
    if (ix < 0x3fdc0000) { if (ix < 0x3e400000) return x; id = -1; }
    else {
      x = Math.abs(x);
      if (ix < 0x3ff30000) { if (ix < 0x3fe60000) { id = 0; x = (2 * x - 1) / (2 + x); } else { id = 1; x = (x - 1) / (x + 1); } }
      else if (ix < 0x40038000) { id = 2; x = (x - 1.5) / (1 + 1.5 * x); } else { id = 3; x = -1 / x; }
    }
    const z = x * x, w = z * z;
    const s1 = z * (AT[0] + w * (AT[2] + w * (AT[4] + w * (AT[6] + w * (AT[8] + w * AT[10]))))), s2 = w * (AT[1] + w * (AT[3] + w * (AT[5] + w * (AT[7] + w * AT[9]))));
    if (id < 0) return x - x * (s1 + s2);
    const r = ATANHI[id] - ((x * (s1 + s2) - ATANLO[id]) - x);
    return hx < 0 ? -r : r;
  }
  const PI = 3.1415926535897931160E+00, PI_O_2 = 1.5707963267948965580E+00, PI_LO = 1.2246467991473531772E-16, TINY = 1.0e-300;
  M.atan2 = function atan2(y, x) {
    if (x !== x || y !== y || !isFinite(x) || !isFinite(y)) return nat.atan2(y, x);
    const hx = hiw(x), ix = hx & 0x7fffffff, lx = low(x), hy = hiw(y), iy = hy & 0x7fffffff, ly = low(y);
    if (((hx - 0x3ff00000) | lx) === 0) return atan(y);
    let m = ((hy >> 31) & 1) | ((hx >> 30) & 2);
    if ((iy | ly) === 0) { switch (m) { case 0: case 1: return y; case 2: return PI + TINY; default: return -PI - TINY; } }
    if ((ix | lx) === 0) return hy < 0 ? -PI_O_2 - TINY : PI_O_2 + TINY;
    const k = (iy - ix) >> 20;
    let z;
    if (k > 60) { z = PI_O_2 + 0.5 * PI_LO; m &= 1; }
    else if (hx < 0 && k < -60) z = 0;
    else z = atan(Math.abs(y / x));
    switch (m) { case 0: return z; case 1: return -z; case 2: return PI - (z - PI_LO); default: return (z - PI_LO) - PI; }
  };

  // ---- exp ----
  const LN2HI = [6.93147180369123816490e-01, -6.93147180369123816490e-01], LN2LO = [1.90821492927058770002e-10, -1.90821492927058770002e-10], HALF = [0.5, -0.5];
  const INVLN2 = 1.44269504088896338700e+00, P1 = 1.66666666666666019037e-01, P2 = -2.77777777770155933842e-03, P3 = 6.61375632143793436117e-05, P4 = -1.65339022054652515390e-06, P5 = 4.13813679705723846039e-08;
  M.exp = function exp(x) {
    let hx = hiw(x);
    const xsb = (hx >>> 31) & 1; hx &= 0x7fffffff;
    if (hx >= 0x40862E42 || x !== x) return nat.exp(x); // huge, tiny, NaN or infinite: no game value gets here
    let hi = 0, lo = 0, k = 0;
    if (hx > 0x3fd62e42) {
      if (hx < 0x3FF0A2B2) { hi = x - LN2HI[xsb]; lo = LN2LO[xsb]; k = 1 - xsb - xsb; }
      else { k = (INVLN2 * x + HALF[xsb]) | 0; hi = x - k * LN2HI[0]; lo = k * LN2LO[0]; }
      x = hi - lo;
    } else if (hx < 0x3e300000) return 1 + x;
    const t = x * x, c = x - t * (P1 + t * (P2 + t * (P3 + t * (P4 + t * P5))));
    if (k === 0) return 1 - ((x * c) / (c - 2) - x);
    const y = 1 - ((lo - (x * c) / (2 - c)) - hi);
    if (k >= -1021) return k === 1024 ? y * 2 * 8.98846567431157953865e+307 : y * words(0x3ff00000 + (k << 20), 0);
    return y * words(0x3ff00000 + ((k + 1000) << 20), 0) * 9.33263618503218878990e-302;
  };

  // ---- log2 ----
  const LG1 = 6.666666666666735130e-01, LG2 = 3.999999999940941908e-01, LG3 = 2.857142874366239149e-01, LG4 = 2.222219843214978396e-01, LG5 = 1.818357216161805012e-01, LG6 = 1.531383769920937332e-01, LG7 = 1.479819860511658591e-01;
  const IVLN2HI = 1.44269504072144627571e+00, IVLN2LO = 1.67517131648865118353e-10, TWO54 = 1.80143985094819840000e+16;
  M.log2 = function log2(x) {
    let hx = hiw(x);
    const lx = low(x);
    let k = 0;
    if (hx < 0x00100000) { if (((hx & 0x7fffffff) | lx) === 0 || hx < 0) return nat.log2(x); k -= 54; x *= TWO54; hx = hiw(x); }
    if (hx >= 0x7ff00000) return x + x;
    if (hx === 0x3ff00000 && lx === 0) return 0;
    k += (hx >> 20) - 1023; hx &= 0x000fffff;
    const i = (hx + 0x95f64) & 0x100000;
    F[0] = x; U[1] = hx | (i ^ 0x3ff00000); x = F[0];
    k += i >> 20;
    const yk = k, f = x - 1, hfsq = 0.5 * f * f;
    const s = f / (2 + f), z = s * s, w = z * z, t1 = w * (LG2 + w * (LG4 + w * LG6)), t2 = z * (LG1 + w * (LG3 + w * (LG5 + w * LG7))), r = s * (hfsq + (t2 + t1));
    F[0] = f - hfsq; U[0] = 0; const hi = F[0];
    const lo = (f - hi) - hfsq + r;
    let valHi = hi * IVLN2HI, valLo = (lo + hi) * IVLN2LO + lo * IVLN2HI;
    const ww = yk + valHi; valLo += (yk - ww) + valHi; valHi = ww;
    return valLo + valHi;
  };
  return M;
}

// Sorting with a random comparator (the game shuffles Hammerhead candidates with sort(() => Math.random() - 0.5)) asks for a different
// number of dice rolls in different engines. Short arrays here sort exactly the way node's V8 does (a run check, then binary insertion,
// which is all V8's TimSort does below 64 items); longer ones use the engine's own sort, whose order is the same everywhere for a
// comparator that is consistent. installDetSort must stay self-contained too.
function installDetSort(P) {
  const native = P.sort;
  P.sort = function sort(cmp) {
    const a = this, n = a.length;
    if (typeof cmp !== 'function' || !Array.isArray(a) || n >= 64 || n < 2) return native.call(a, cmp);
    for (let k = 0; k < n; k++) if (!(k in a) || a[k] === undefined) return native.call(a, cmp);
    const c = (x, y) => { const v = +cmp(x, y); return v !== v ? 0 : v; };
    // CountAndMakeRun
    let run = 2;
    const desc = c(a[1], a[0]) < 0;
    for (let k = 2, prev = a[1]; k < n; k++) { const o = c(a[k], prev); if (desc ? o >= 0 : o < 0) break; prev = a[k]; run++; }
    if (desc) for (let lo = 0, hi = run - 1; lo < hi; lo++, hi--) { const t = a[lo]; a[lo] = a[hi]; a[hi] = t; }
    // BinaryInsertionSort over the rest
    for (let start = run; start < n; start++) {
      let left = 0, right = start;
      const pivot = a[start];
      while (left < right) { const mid = left + ((right - left) >> 1); if (c(pivot, a[mid]) < 0) right = mid; else left = mid + 1; }
      for (let q = start; q > left; q--) a[q] = a[q - 1];
      a[left] = pivot;
    }
    return a;
  };
}

module.exports = {installDetMath, installDetSort};
