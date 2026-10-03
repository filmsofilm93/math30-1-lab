// Helpers for Unit 5 (radical and rational functions).
import { intervalTex, type RealSet } from '../../check/realset';
import { L, type RatFn } from '../../rational';
import type { Rng } from '../../rng';
import type { AnswerSpec } from '../../types';
import { Reject } from '../../types';

export const realSetAns = (value: RealSet, v = 'x'): AnswerSpec => ({ kind: 'interval', value, tex: intervalTex(value), v });

/** Distinct non-zero integers in [lo, hi], none in `avoid`. */
export function distinct(rng: Rng, n: number, lo = -5, hi = 5, avoid: number[] = []): number[] {
  const out: number[] = [];
  for (let guard = 0; out.length < n; guard++) {
    if (guard > 200) throw new Reject();
    const v = rng.int(lo, hi);
    if (v !== 0 && !out.includes(v) && !avoid.includes(v)) out.push(v);
  }
  return out;
}

export type RatKind = 'lin' | 'lin-hole' | 'const' | 'const-hole' | 'two-va' | 'line-hole' | 'square';

/**
 * A rational function of the requested kind, with integer zeros and degrees ≤ 2.
 * lin: k(x − r)/(x − p) · const: k/(x − p) · two-va: k(x − r)/((x − p)(x − q)) or k/((x − p)(x − q))
 * line-hole: (x − r)(x − h)/(x − h) · square: k/(x − p)² · *-hole: an extra (x − h)/(x − h).
 */
export function pickRat(rng: Rng, kind: RatKind, kMax = 3): RatFn {
  const k = rng.pick([1, 1, 2, -1, 3, -2].filter((v) => Math.abs(v) <= kMax));
  const [p, q, r, h] = distinct(rng, 4, -5, 5);
  const hole = (f: RatFn): RatFn => ({ k: f.k, num: [...f.num, L(h)], den: [...f.den, L(h)] });
  switch (kind) {
    case 'lin':
      return { k, num: [L(r)], den: [L(p)] };
    case 'lin-hole':
      return hole({ k, num: [L(r)], den: [L(p)] });
    case 'const':
      return { k: k * rng.pick([1, 2, 3]), num: [], den: [L(p)] };
    case 'const-hole':
      return hole({ k: k * rng.pick([1, 2]), num: [], den: [L(p)] });
    case 'two-va':
      return rng.chance(0.5) ? { k, num: [L(r)], den: [L(p), L(q)] } : { k: k * rng.pick([1, 2, 4]), num: [], den: [L(p), L(q)] };
    case 'line-hole':
      return { k: 1, num: [L(r), L(h)], den: [L(h)] };
    case 'square':
      return { k: k * rng.pick([1, 2, 4]), num: [], den: [L(p), L(p)] };
  }
}
