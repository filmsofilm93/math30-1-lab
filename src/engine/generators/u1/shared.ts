import { BASE, type BaseFn, type TParams, evalTransformed, ITEM_BASES } from '../../basefns';
import { F, Frac } from '../../frac';
import type { Rng } from '../../rng';
import type { GraphSpec, Tier } from '../../types';

export const fracTex = (x: Frac | number) => Frac.of(x).tex();

export function pickBase(rng: Rng, allow: readonly string[] = ITEM_BASES): BaseFn {
  return BASE[rng.pick(allow)];
}

/** Clean vertical stretch factors by tier. */
export function pickA(rng: Rng, tier: Tier, allowNeg = true): Frac {
  const pool = tier === 1 ? [F(2), F(3), F(4)] : [F(2), F(3), F(4), F(1, 2), F(1, 3), F(3, 2)];
  const a = rng.pick(pool);
  return allowNeg && tier > 1 && rng.chance(0.4) ? a.neg() : a;
}

/** Clean horizontal factors b (the stretch factor is 1/|b|). */
export function pickB(rng: Rng, tier: Tier, allowNeg = true): Frac {
  const pool = tier === 1 ? [F(2), F(3), F(1, 2)] : [F(2), F(3), F(4), F(1, 2), F(1, 3), F(1, 4)];
  const b = rng.pick(pool);
  return allowNeg && tier > 1 && rng.chance(0.4) ? b.neg() : b;
}

export const pickShift = (rng: Rng, max = 5) => F(rng.nz(-max, max));

/** Words for each parameter, in the order transformations are applied (stretches/reflections, then translations). */
export function describe(p: TParams): string[] {
  const out: string[] = [];
  if (!p.a.abs().eq(1)) out.push(`a vertical stretch about the $x$-axis by a factor of $${p.a.abs().tex()}$`);
  if (p.a.n < 0) out.push('a reflection in the $x$-axis');
  if (!p.b.abs().eq(1)) out.push(`a horizontal stretch about the $y$-axis by a factor of $${p.b.abs().inv().tex()}$`);
  if (p.b.n < 0) out.push('a reflection in the $y$-axis');
  if (p.h.n !== 0) out.push(`a horizontal translation of $${p.h.abs().tex()}$ unit${p.h.abs().eq(1) ? '' : 's'} ${p.h.n > 0 ? 'right' : 'left'}`);
  if (p.k.n !== 0) out.push(`a vertical translation of $${p.k.abs().tex()}$ unit${p.k.abs().eq(1) ? '' : 's'} ${p.k.n > 0 ? 'up' : 'down'}`);
  return out;
}

export function joinWords(parts: string[]): string {
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}

/** View window that fits the given points with a margin, rounded to integers. */
export function fitView(pts: [number, number][], pad = 2, min = 6): GraphSpec['view'] {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const span = (lo: number, hi: number): [number, number] => {
    let a = Math.floor(lo - pad);
    let b = Math.ceil(hi + pad);
    if (b - a < min) {
      const c = (a + b) / 2;
      a = Math.floor(c - min / 2);
      b = Math.ceil(c + min / 2);
    }
    return [a, b];
  };
  return { x: span(Math.min(...xs, 0), Math.max(...xs, 0)), y: span(Math.min(...ys, 0), Math.max(...ys, 0)) };
}

/** Graph of a base function and its image, with the mapped key points marked. */
export function baseAndImage(base: BaseFn, p: TParams, keyPts: [number, number][], imgPts: [number, number][], showBase = true): GraphSpec {
  const breaks = base.vAsym?.map((v) => v / p.b.value + p.h.value);
  return {
    view: fitView([...(showBase ? keyPts : []), ...imgPts]),
    curves: [
      ...(showBase ? [{ fn: base.f, role: 'base' as const, label: 'y = f(x)', breaks: base.vAsym }] : []),
      { fn: evalTransformed(base, p), role: 'image' as const, label: 'image', breaks },
    ],
    points: [...(showBase ? keyPts.map(([x, y]) => ({ x, y, kind: 'key' as const })) : []), ...imgPts.map(([x, y]) => ({ x, y, kind: 'key' as const }))],
  };
}

/** A small "mystery" function f given only by points, for point-mapping questions. */
export function pointOnF(rng: Rng): [Frac, Frac] {
  return [F(rng.nz(-6, 6)), F(rng.nz(-6, 6))];
}
