/** Invariant points: points of the graph that the mapping (x, y) → (x/b + h, ay + k) sends to themselves. */
export function invariantPoints(f: (x: number) => number, a: number, b: number, h: number, k: number, xr: [number, number]): [number, number][] {
  const xFixed = b !== 1 ? (h * b) / (b - 1) : h === 0 ? 'any' : null;
  const yFixed = a !== 1 ? k / (1 - a) : k === 0 ? 'any' : null;
  if (xFixed === null || yFixed === null || (xFixed === 'any' && yFixed === 'any')) return [];
  if (typeof xFixed === 'number' && typeof yFixed === 'number') return Math.abs(f(xFixed) - yFixed) < 1e-9 ? [[xFixed, yFixed]] : [];
  if (typeof xFixed === 'number') {
    const y = f(xFixed);
    return Number.isFinite(y) ? [[xFixed, y]] : [];
  }
  // x free, y fixed: solve f(x) = yFixed on the visible range
  const y0 = yFixed as number;
  const out: [number, number][] = [];
  const N = 2400;
  let px = xr[0];
  let pv = f(px) - y0;
  for (let i = 1; i <= N; i++) {
    const x = xr[0] + ((xr[1] - xr[0]) * i) / N;
    const v = f(x) - y0;
    if (Number.isFinite(v) && Math.abs(v) < 1e-12) out.push([x, y0]);
    else if (Number.isFinite(v) && Number.isFinite(pv) && v * pv < 0) {
      let lo = px;
      let hi = x;
      for (let j = 0; j < 60; j++) {
        const mid = (lo + hi) / 2;
        const mv = f(mid) - y0;
        if ((f(lo) - y0) * mv <= 0) hi = mid;
        else lo = mid;
      }
      const r = (lo + hi) / 2;
      if (Math.abs(f(r) - y0) < 1e-6) out.push([Math.round(r * 1e6) / 1e6, y0]);
    }
    px = x;
    pv = v;
  }
  return out.filter((p, i) => out.findIndex((q) => Math.abs(q[0] - p[0]) < 1e-4) === i);
}

