// RF13 radical functions: transformations of y = √x, y = √f(x), radical equations.
import { ALL, iv, type RealSet } from '../../check/realset';
import { argTex, BASE, mapPoint, mappingTex, TP, transformedTex, type TParams } from '../../basefns';
import { field, m, mc, pkey, type Cand } from '../../framework';
import { F, Frac, polyTex, ptTex, shiftTex, signedTex } from '../../frac';
import type { Rng } from '../../rng';
import type { AnswerSpec, Draft, Generator, GraphSpec, Tier } from '../../types';
import { Reject } from '../../types';
import { fitView } from '../u1/shared';
import { setAns, solutionText, sqrtTex, splitSquare } from '../pre/shared';
import { realSetAns } from './shared';

const SQRT = BASE.sqrt;
const lin = (r: number) => (r === 0 ? 'x' : `\\left(${shiftTex(r)}\\right)`);

/** y = a√(b(x − h)) + k with clean parameters. */
function pickSqrt(rng: Rng, tier: Tier): TParams {
  const a = tier === 1 ? rng.pick([1, 2, 3]) : rng.pick([1, 2, 3, -1, -2, F(1, 2)]);
  const b = tier === 1 ? 1 : tier === 2 ? rng.pick([1, -1, 2, 4]) : rng.pick([-1, 2, -2, 4, F(1, 4), F(1, 2), -4]);
  return TP(a, b, rng.int(-5, 5), rng.int(-5, 5));
}

function sqrtDomain(p: TParams): RealSet {
  return p.b.n > 0 ? [iv(p.h.value, Infinity, true)] : [iv(-Infinity, p.h.value, false, true)];
}
function sqrtRange(p: TParams): RealSet {
  return p.a.n > 0 ? [iv(p.k.value, Infinity, true)] : [iv(-Infinity, p.k.value, false, true)];
}
const sqrtFn = (p: TParams) => (x: number) => p.a.value * SQRT.f(p.b.value * (x - p.h.value)) + p.k.value;

function sqrtGraph(p: TParams, pts: [Frac, Frac][]): GraphSpec {
  const xy = pts.map(([x, y]) => [x.value, y.value] as [number, number]);
  return { view: fitView(xy, 2, 8), curves: [{ fn: sqrtFn(p), role: 'image' }], points: xy.map(([x, y]) => ({ x, y, kind: 'key' as const })) };
}

// ---------------------------------------------------------------- RF13.sqrt-transform

const sqrtDR: Generator = {
  id: 'u5-sqrt-domain-range',
  nodeId: 'RF13.sqrt-transform',
  title: 'Domain and range of y = a√(b(x − h)) + k',
  make(rng, tier): Draft {
    const p = pickSqrt(rng, tier);
    const tex = transformedTex(SQRT, p);
    const D = sqrtDomain(p);
    const R = sqrtRange(p);
    // Tier 3 shows the radicand expanded, so b must be factored out first.
    const shown = tier === 3 && !p.b.eq(1) && p.b.isInt ? `${p.a.eq(1) ? '' : p.a.eq(-1) ? '-' : p.a.tex()}\\sqrt{${polyTex([p.b.n, -p.b.n * p.h.value])}}${signedTex(p.k)}` : tex;
    return {
      cognitive: 'procedural',
      stem: `State the domain and range of ${m(`y = ${shown}`)}.`,
      format: 'input',
      fields: [field(realSetAns(D), '', 'Domain'), field(realSetAns(R, 'y'), '', 'Range')],
      hints: [
        'The endpoint of the graph is $(h, k)$.',
        shown !== tex ? `Factor the radicand: ${m(`${polyTex([p.b.n, -p.b.n * p.h.value])} = ${argTex(p.b, p.h).tex}`)}.` : 'The radicand must be non-negative.',
        `${p.b.n < 0 ? 'Negative $b$ reflects in the $y$-axis: the graph extends left.' : 'Positive $b$: the graph extends right.'} ${p.a.n < 0 ? 'Negative $a$ reflects in the $x$-axis: it extends down.' : 'Positive $a$: it extends up.'}`,
      ],
      solution: [
        ...(shown !== tex ? [{ tex: m(`y = ${tex}`), why: 'Factor $b$ out of the radicand to read $h$.' }] : []),
        { tex: `Endpoint ${m(ptTex(p.h, p.k))}.`, why: 'The endpoint of $y = \\sqrt{x}$ is $(0, 0)$; it maps to $(h, k)$.' },
        { tex: `Domain ${m(D.length && D[0].lo === -Infinity ? `x \\le ${p.h.tex()}` : `x \\ge ${p.h.tex()}`)}: ${m(realSetAns(D).tex)}.`, why: `Solve ${m(`${argTex(p.b, p.h).tex} \\ge 0`)}${p.b.n < 0 ? '; dividing by a negative flips the inequality' : ''}.` },
        { tex: `Range ${m(p.a.n > 0 ? `y \\ge ${p.k.tex()}` : `y \\le ${p.k.tex()}`)}: ${m(realSetAns(R).tex)}.` },
      ],
    };
  },
};

const sqrtMap: Generator = {
  id: 'u5-sqrt-mapping',
  nodeId: 'RF13.sqrt-transform',
  title: 'Image of a point on y = √x',
  make(rng, tier): Draft {
    const p = pickSqrt(rng, tier);
    const key = rng.pick([[1, 1], [4, 2], [9, 3]] as [number, number][]);
    const [X, Y] = mapPoint(key[0], key[1], p);
    const tex = transformedTex(SQRT, p);
    if (tier === 1) {
      return {
        cognitive: 'procedural',
        stem: `The point ${m(ptTex(key[0], key[1]))} is on ${m('y = \\sqrt{x}')}. What is its image on ${m(`y = ${tex}`)}?`,
        format: 'input',
        fields: [field({ kind: 'points', values: [[X.value, Y.value]], tex: ptTex(X, Y) })],
        hints: ['Use the mapping $(x, y) \\to \\left(\\frac{x}{b} + h, ay + k\\right)$.', `Here ${m(mappingTex(p))}.`, `Apply it to ${m(ptTex(key[0], key[1]))}.`],
        solution: [
          { tex: `Mapping: ${m(mappingTex(p))}.`, why: 'Read $a$, $b$, $h$, $k$ from the equation.' },
          { tex: m(`${ptTex(key[0], key[1])} \\to ${ptTex(X, Y)}`) },
        ],
        verify: () => Math.abs(sqrtFn(p)(X.value) - Y.value) < 1e-9,
      };
    }
    const wrong = (q: TParams) => mapPoint(key[0], key[1], q);
    const cand = (q: TParams, mis: string, feedback?: string): Cand => {
      const [x, y] = wrong(q);
      return { tex: m(ptTex(x, y)), key: pkey(x.value, y.value), mis, feedback };
    };
    return {
      cognitive: 'procedural',
      stem: `The point ${m(ptTex(key[0], key[1]))} is on ${m('y = \\sqrt{x}')}. Which point is on ${m(`y = ${tex}`)}?`,
      format: 'mc',
      choices: mc({ tex: m(ptTex(X, Y)), key: pkey(X.value, Y.value) }, [
        cand(TP(p.a, p.b.inv(), p.h, p.k), 'tr-b-not-reciprocal', 'The $x$-coordinate is divided by $b$, not multiplied.'),
        cand(TP(p.a, p.b, p.h.neg(), p.k), 'tr-h-sign', `${m(`x ${p.h.n > 0 ? '-' : '+'} ${p.h.abs().tex()}`)} moves the graph ${p.h.n > 0 ? 'right' : 'left'}.`),
        cand(TP(p.a, p.b, p.h.mul(p.b), p.k), 'tr-b-not-reciprocal', 'Factor $b$ out first; $h$ is read from $b(x - h)$.'),
        cand(TP(p.a.neg(), p.b, p.h, p.k), 'tr-h-sign'),
      ]),
      hints: ['Mapping: $(x, y) \\to \\left(\\frac{x}{b} + h, ay + k\\right)$.', `${m(`a = ${p.a.tex()}`)}, ${m(`b = ${p.b.tex()}`)}, ${m(`h = ${p.h.tex()}`)}, ${m(`k = ${p.k.tex()}`)}.`, `New ${m('x')}: ${m(`\\frac{${key[0]}}{${p.b.tex()}} ${signedTex(p.h)}`)}.`],
      solution: [
        { tex: `Mapping ${m(mappingTex(p))}.` },
        { tex: m(`${ptTex(key[0], key[1])} \\to ${ptTex(X, Y)}`), why: 'Stretches and reflections first, then translations.' },
      ],
      verify: () => Math.abs(sqrtFn(p)(X.value) - Y.value) < 1e-9,
    };
  },
};

const sqrtEquation: Generator = {
  id: 'u5-sqrt-equation',
  nodeId: 'RF13.sqrt-transform',
  title: 'Equation of a radical function from its graph',
  make(rng, tier): Draft {
    const h = rng.int(-4, 4);
    const k = rng.int(-4, 4);
    const left = tier === 3 && rng.chance(0.5);
    const down = tier > 1 && rng.chance(0.4);
    const a = tier === 1 ? rng.pick([2, 3]) : rng.pick([1, 2, 3, F(1, 2)]);
    const A = Frac.of(a).mul(down ? -1 : 1);
    const B = F(left ? -1 : 1);
    const p = TP(A, B, h, k);
    const dx = rng.pick([1, 4]);
    const P1: [Frac, Frac] = [F(h), F(k)];
    const P2 = mapPoint(dx, Math.sqrt(dx), TP(A, B, h, k));
    if (!P2[1].isInt || !P2[0].isInt) throw new Reject();
    const f = sqrtFn(p);
    const ans: AnswerSpec = { kind: 'expr', tex: transformedTex(SQRT, p), variable: 'x', fn: f, sample: left ? [h - 8, h - 0.05] : [h + 0.05, h + 8], exact: true };
    return {
      cognitive: 'problemSolving',
      stem: `The graph is a transformation of ${m('y = \\sqrt{x}')} through the marked points. Write its equation in the form ${m(left ? 'y = a\\sqrt{-(x - h)} + k' : 'y = a\\sqrt{x - h} + k')}.`,
      graph: sqrtGraph(p, [P1, P2]),
      format: 'input',
      fields: [field(ans, 'y =')],
      hints: [
        'The endpoint gives $h$ and $k$.',
        `Endpoint ${m(ptTex(h, k))}${left ? '; the graph extends left, so there is a reflection in the $y$-axis' : ''}.`,
        `Substitute ${m(ptTex(P2[0], P2[1]))} and solve for ${m('a')}.`,
      ],
      solution: [
        { tex: `Endpoint ${m(ptTex(h, k))}: ${m(`y = a\\sqrt{${left ? `-${lin(h)}` : shiftTex(h)}} ${signedTex(k)}`.replace(/ $/, ''))}.` },
        { tex: m(`${P2[1].tex()} = a\\sqrt{${left ? -(P2[0].value - h) : P2[0].value - h}} ${signedTex(k)} \\Rightarrow a = ${A.tex()}`), why: 'Substitute the second point.' },
        { tex: m(`y = ${ans.tex}`) },
      ],
      verify: () => Math.abs(f(P2[0].value) - P2[1].value) < 1e-9 && Math.abs(f(h) - k) < 1e-9,
    };
  },
};

// ---------------------------------------------------------------- RF13.sqrt-of-f

/** f(x) = c(x − h)² + k with both f = 0 and f = 1 solvable over small rationals (or f = 1 impossible). */
const QUADS: { c: Frac; k: number }[] = [];
for (const c of [F(1), F(-1), F(2), F(-2), F(1, 2), F(-1, 2), F(1, 4), F(-1, 4), F(-1, 9), F(1, 9)])
  for (let k = -9; k <= 9; k++) {
    const sq = (v: Frac) => v.n < 0 || (Number.isInteger(Math.sqrt(v.n)) && Number.isInteger(Math.sqrt(v.d)));
    const z = F(-k).div(c);
    const o = F(1 - k).div(c);
    if (z.n > 0 && sq(z) && sq(o)) QUADS.push({ c, k });
  }

const sqrtFrac = (v: Frac) => F(Math.round(Math.sqrt(v.n)), Math.round(Math.sqrt(v.d)));
const quadTex = (c: Frac, h: number, k: number) => `${c.eq(1) ? '' : c.eq(-1) ? '-' : c.tex()}${h === 0 ? 'x^2' : `${lin(h)}^2`}${signedTex(k)}`;

/** Solutions of c(x − h)² + k = t. */
function quadSolve(c: Frac, h: number, k: number, t: number): Frac[] {
  const v = F(t - k).div(c);
  if (v.n < 0) return [];
  if (v.n === 0) return [F(h)];
  const s = sqrtFrac(v);
  return [F(h).sub(s), F(h).add(s)];
}

const sqrtfInvariant: Generator = {
  id: 'u5-sqrtf-invariant',
  nodeId: 'RF13.sqrt-of-f',
  title: 'Invariant points of y = f(x) and y = √f(x)',
  make(rng, tier): Draft {
    let fTex: string;
    let zs: Frac[];
    let os: Frac[];
    let fn: (x: number) => number;
    if (tier === 1) {
      const s = rng.nz(-3, 3);
      const c = rng.int(-6, 6);
      fTex = polyTex([s, c]);
      zs = [F(-c, s)];
      os = [F(1 - c, s)];
      fn = (x) => s * x + c;
    } else {
      const { c, k } = rng.pick(QUADS);
      const h = rng.int(-3, 3);
      fTex = quadTex(c, h, k);
      zs = quadSolve(c, h, k, 0);
      os = quadSolve(c, h, k, 1);
      fn = (x) => c.value * (x - h) ** 2 + k;
      if (zs.length + os.length < 2) throw new Reject();
    }
    const pts = [...zs.map((x) => [x, F(0)] as [Frac, Frac]), ...os.map((x) => [x, F(1)] as [Frac, Frac])].sort((p, q) => p[0].value - q[0].value || p[1].value - q[1].value);
    const tex = pts.map(([x, y]) => ptTex(x, y)).join(', ');
    if (tier === 3) {
      const wrongPts = (ys: number[]) => ys.flatMap((y) => quadSolveSafe(fn, y, pts)).map(([x, y]) => ptTex(x, y)).join(', ');
      const noOne = pts.filter((p) => p[1].n === 0).map(([x, y]) => ptTex(x, y)).join(', ');
      return {
        cognitive: 'conceptual',
        stem: `Which list gives all the invariant points when ${m('y = \\sqrt{f(x)}')} is graphed from ${m(`f(x) = ${fTex}`)}?`,
        format: 'mc',
        choices: mc({ tex: m(tex), key: tex }, [
          { tex: m(noOne), key: noOne, mis: 'rad-invariant-wrong', feedback: 'Points with $y = 1$ are invariant too, since $\\sqrt{1} = 1$.' },
          { tex: wrongPts([0, -1]) ? m(wrongPts([0, -1])) : 'There are none', key: 'neg' + wrongPts([0, -1]), mis: 'rad-invariant-wrong', feedback: '$\\sqrt{-1}$ is not real; the invariant heights are $0$ and $1$.' },
          { tex: m(`(0, ${polyTexAt(fn)})`), key: 'yint', mis: 'rad-invariant-wrong', feedback: 'The $y$-intercept moves unless it is 0 or 1.' },
          { tex: 'There are none', key: 'none', mis: 'rad-invariant-wrong' },
        ]),
        hints: ['A point stays put when $\\sqrt{y} = y$.', '$\\sqrt{y} = y$ only for $y = 0$ and $y = 1$.', `Solve ${m(`${fTex} = 0`)} and ${m(`${fTex} = 1`)}.`],
        solution: [
          { tex: `${m('\\sqrt{y} = y')} only for ${m('y = 0')} or ${m('y = 1')}.`, why: 'Square: $y = y^2$, so $y(y - 1) = 0$.' },
          { tex: `${m(`${fTex} = 0`)}: ${zs.length ? solutionText(zs) : 'no solution'}. ${m(`${fTex} = 1`)}: ${os.length ? solutionText(os) : 'no solution'}.` },
          { tex: `Invariant points: ${m(tex)}.` },
        ],
      };
    }
    return {
      cognitive: 'procedural',
      stem: `Determine all invariant points when the graph of ${m('y = \\sqrt{f(x)}')} is drawn from ${m(`f(x) = ${fTex}`)}.`,
      format: 'input',
      fields: [field({ kind: 'points', values: pts.map(([x, y]) => [x.value, y.value]), tex })],
      hints: ['Invariant points are where $f(x) = \\sqrt{f(x)}$.', 'That happens only at $y = 0$ and $y = 1$.', `Solve ${m(`${fTex} = 0`)} and ${m(`${fTex} = 1`)}.`],
      solution: [
        { tex: `${m('\\sqrt{y} = y')} only for ${m('y = 0')} or ${m('y = 1')}.`, why: 'Square: $y = y^2$, so $y(y - 1) = 0$.' },
        { tex: `${m(`${fTex} = 0`)}: ${solutionText(zs)}.` },
        { tex: `${m(`${fTex} = 1`)}: ${os.length ? solutionText(os) : 'no solution'}.` },
        { tex: `Invariant points: ${m(tex)}.` },
      ],
      verify: () => pts.every(([x, y]) => Math.abs(fn(x.value) - y.value) < 1e-9),
    };
  },
};

/** Points (x, y) on f with f(x) = t, for distractor lists; skips points already in `avoid`. */
function quadSolveSafe(fn: (x: number) => number, t: number, avoid: [Frac, Frac][]): [Frac, Frac][] {
  const out: [Frac, Frac][] = [];
  for (let n = -96; n <= 96; n++) {
    const x = F(n, 4);
    if (Math.abs(fn(x.value) - t) < 1e-9 && !avoid.some((p) => p[0].eq(x))) out.push([x, F(t)]);
  }
  return out;
}
const polyTexAt = (fn: (x: number) => number) => {
  const v = fn(0);
  const f = [1, 2, 4, 9].map((d) => F(Math.round(v * d), d)).find((q) => Math.abs(q.value - v) < 1e-9);
  return f ? f.tex() : String(v);
};

const sqrtfDR: Generator = {
  id: 'u5-sqrtf-domain-range',
  nodeId: 'RF13.sqrt-of-f',
  title: 'Domain and range of y = √f(x)',
  make(rng, tier): Draft {
    if (tier === 1) {
      const s = rng.nz(-4, 4);
      const c = rng.int(-8, 8);
      const z = F(-c, s);
      const D: RealSet = s > 0 ? [iv(z.value, Infinity, true)] : [iv(-Infinity, z.value, false, true)];
      const R: RealSet = [iv(0, Infinity, true)];
      const fTex = polyTex([s, c]);
      return {
        cognitive: 'procedural',
        stem: `Given ${m(`f(x) = ${fTex}`)}, state the domain and range of ${m('y = \\sqrt{f(x)}')}.`,
        format: 'input',
        fields: [field(realSetAns(D), '', 'Domain'), field(realSetAns(R, 'y'), '', 'Range')],
        hints: ['$\\sqrt{f(x)}$ is defined only where $f(x) \\ge 0$.', `Solve ${m(`${fTex} \\ge 0`)}.`, 'The range of $f$ includes every value from 0 up, so the square roots do too.'],
        solution: [
          { tex: `${m(`${fTex} \\ge 0 \\Rightarrow x ${s > 0 ? '\\ge' : '\\le'} ${z.tex()}`)}.`, why: s < 0 ? 'Dividing by a negative flips the inequality.' : 'Isolate $x$.' },
          { tex: `Domain ${m(realSetAns(D).tex)}; range ${m('[0, \\infty)')}.`, why: '$f$ takes every value $\\ge 0$ on that domain, and $\\sqrt{\\ }$ maps $[0, \\infty)$ onto $[0, \\infty)$.' },
        ],
      };
    }
    // f(x) = c(x − h)² + k
    const h = rng.int(-4, 4);
    const opt = tier === 2 ? rng.pick(['up-neg', 'down-pos', 'up-pos']) : rng.pick(['up-neg', 'down-pos']);
    const sq = rng.pick([1, 2, 3]);
    const c = rng.pick([F(1), F(2), F(1, 2), F(4)]).mul(opt === 'down-pos' ? -1 : 1);
    // k chosen so the zeros are h ± sq: c·sq² + k = 0.
    const k = opt === 'up-pos' ? rng.pick([1, 4, 9]) : -c.mul(sq * sq).value;
    if (!Number.isInteger(k) || Math.abs(k) > 18) throw new Reject();
    if (opt === 'down-pos' && !Number.isInteger(Math.sqrt(k))) {
      if (tier === 2) throw new Reject();
    }
    const fTex = quadTex(c, h, k);
    let D: RealSet;
    let R: RealSet;
    if (opt === 'up-neg') {
      D = [iv(-Infinity, h - sq, false, true), iv(h + sq, Infinity, true)];
      R = [iv(0, Infinity, true)];
    } else if (opt === 'down-pos') {
      D = [iv(h - sq, h + sq)];
      R = [iv(0, Math.sqrt(k))];
    } else {
      D = ALL;
      R = [iv(Math.sqrt(k), Infinity, true)];
    }
    const [kk, kr] = splitSquare(Math.max(k, 0));
    const rootK = sqrtTex(kk, kr);
    return {
      cognitive: 'problemSolving',
      stem: `Given ${m(`f(x) = ${fTex}`)}, state the domain and range of ${m('y = \\sqrt{f(x)}')}.`,
      format: 'input',
      fields: [field(realSetAns(D), '', 'Domain'), field({ ...realSetAns(R, 'y'), tex: opt === 'down-pos' ? `[0, ${rootK}]` : opt === 'up-pos' ? `[${rootK}, \\infty)` : '[0, \\infty)' }, '', 'Range')],
      hints: [
        'Domain: where $f(x) \\ge 0$. Range: the square roots of the non-negative part of the range of $f$.',
        `The vertex of ${m('f')} is ${m(ptTex(h, k))}${opt === 'up-pos' ? '' : ` and its zeros are ${m(`x = ${h - sq}`)} and ${m(`x = ${h + sq}`)}`}.`,
        opt === 'down-pos' ? `${m('f')} has maximum ${m(String(k))}, so ${m('\\sqrt{f}')} has maximum ${m(rootK)}.` : opt === 'up-neg' ? `${m('f < 0')} between the zeros; those ${m('x')}-values are excluded.` : `${m('f \\ge ' + k)} everywhere, so ${m('\\sqrt{f} \\ge ' + rootK)}.`,
      ],
      solution: [
        { tex: `Vertex ${m(ptTex(h, k))}, opening ${c.n > 0 ? 'up' : 'down'}${opt === 'up-pos' ? '' : `; zeros ${m(`x = ${h - sq}, ${h + sq}`)}`}.` },
        { tex: `${m('f(x) \\ge 0')} for ${m(realSetAns(D).tex)}: that is the domain.`, why: 'A square root of a negative is not real.' },
        { tex: `Range of ${m('f')} restricted to ${m('y \\ge 0')} is ${m(opt === 'down-pos' ? `[0, ${k}]` : opt === 'up-neg' ? '[0, \\infty)' : `[${k}, \\infty)`)}; square roots give ${m(opt === 'down-pos' ? `[0, ${rootK}]` : opt === 'up-neg' ? '[0, \\infty)' : `[${rootK}, \\infty)`)}.` },
      ],
    };
  },
};

const sqrtfPoints: Generator = {
  id: 'u5-sqrtf-points',
  nodeId: 'RF13.sqrt-of-f',
  title: 'Points on y = √f(x) from points on y = f(x)',
  make(rng, tier): Draft {
    const x = rng.int(-6, 6);
    const y = tier === 1 ? rng.pick([4, 9, 16, 25, 36]) : tier === 2 ? rng.pick([F(1, 4), F(4, 9), F(1, 9), F(9, 16)]) : rng.pick([-4, -9, -1, 2, 3, 5]);
    const Y = Frac.of(y);
    if (tier === 3) {
      const ok = Y.n > 0;
      const r = ok ? sqrtTex(...splitSquare(Y.n)) : '';
      const right = ok ? m(`\\left(${x}, ${r}\\right)`) : `There is no corresponding point: ${m(`\\sqrt{${Y.tex()}}`)} is not real`;
      return {
        cognitive: 'conceptual',
        stem: `The point ${m(ptTex(x, Y))} is on ${m('y = f(x)')}. What is the corresponding point on ${m('y = \\sqrt{f(x)}')}?`,
        format: 'mc',
        choices: mc({ tex: right, key: 'ok' }, [
          ok
            ? { tex: `There is no corresponding point: ${m(`\\sqrt{${Y.tex()}}`)} is not real`, key: 'none', mis: 'rad-sqrt-domain', feedback: `${m(Y.tex())} is positive, so its square root is real.` }
            : { tex: m(`\\left(${x}, ${sqrtTex(...splitSquare(-Y.n))}\\right)`), key: 'abs', mis: 'rad-sqrt-domain', feedback: 'Where $f(x) < 0$, $\\sqrt{f(x)}$ is not real: the graph has no point there.' },
          { tex: m(`\\left(${x}, ${Y.mul(Y).tex()}\\right)`), key: 'sq', mis: 'rad-sqrt-values', feedback: 'The new $y$ is the square root of the old $y$, not its square.' },
          { tex: m(`\\left(${x < 0 ? '-' : ''}${sqrtTex(...splitSquare(Math.abs(x)))}, ${Y.tex()}\\right)`), key: 'x', mis: 'rad-invariant-wrong', feedback: '$x$-coordinates do not change; only $y$ is square-rooted.' },
          { tex: m(`\\left(${x}, ${Y.neg().tex()}\\right)`), key: 'neg', mis: 'rad-sqrt-values' },
        ]),
        hints: ['$(x, y) \\to (x, \\sqrt{y})$.', 'This works only for $y \\ge 0$.', `Here ${m(`y = ${Y.tex()}`)}.`],
        solution: [
          { tex: `${m('(x, y) \\to (x, \\sqrt{y})')}, defined only for ${m('y \\ge 0')}.`, why: 'Each $x$ keeps its input; the output is square-rooted.' },
          { tex: ok ? `${m(ptTex(x, Y))} ${m('\\to')} ${right}.` : `${m(`y = ${Y.tex()} < 0`)}: no point on ${m('y = \\sqrt{f(x)}')} at ${m(`x = ${x}`)}.` },
        ],
      };
    }
    const r = sqrtFrac(Y);
    return {
      cognitive: 'procedural',
      stem: `The point ${m(ptTex(x, Y))} is on ${m('y = f(x)')}. Give the corresponding point on ${m('y = \\sqrt{f(x)}')}.`,
      format: 'input',
      fields: [field({ kind: 'points', values: [[x, r.value]], tex: ptTex(x, r) })],
      hints: ['$(x, y) \\to (x, \\sqrt{y})$.', '$x$ stays the same.', `${m(`\\sqrt{${Y.tex()}} = ${r.tex()}`)}`],
      solution: [
        { tex: `${m('(x, y) \\to (x, \\sqrt{y})')}.` },
        { tex: m(`${ptTex(x, Y)} \\to ${ptTex(x, r)}`), why: tier === 2 ? 'For $0 < y < 1$, $\\sqrt{y} > y$: the point moves up.' : 'For $y > 1$, $\\sqrt{y} < y$: the point moves down.' },
      ],
      verify: () => Math.abs(r.value ** 2 - Y.value) < 1e-12,
    };
  },
};

const sqrtfCompare: Generator = {
  id: 'u5-sqrtf-compare',
  nodeId: 'RF13.sqrt-of-f',
  title: 'Where √f(x) is above f(x)',
  make(rng, tier): Draft {
    const s = rng.nz(-3, 3);
    const c = rng.int(-6, 6);
    const fTex = polyTex([s, c]);
    const z = F(-c, s);
    const o = F(1 - c, s);
    const lo = Frac.of(Math.min(z.value, o.value) === z.value ? z : o);
    const hi = lo.eq(z) ? o : z;
    const S: RealSet = [iv(lo.value, hi.value, false, false)];
    const ask = tier === 1 ? 'above' : rng.pick(['above', 'below']);
    const below: RealSet = s > 0 ? [iv(o.value, Infinity, false)] : [iv(-Infinity, o.value, false, false)];
    const ans = ask === 'above' ? S : below;
    return {
      cognitive: 'conceptual',
      stem: `For ${m(`f(x) = ${fTex}`)}, over which interval is the graph of ${m('y = \\sqrt{f(x)}')} ${ask} the graph of ${m('y = f(x)')}?`,
      format: 'input',
      fields: [field(realSetAns(ans))],
      hints: ['Compare $\\sqrt{y}$ with $y$.', '$\\sqrt{y} > y$ when $0 < y < 1$; $\\sqrt{y} < y$ when $y > 1$.', ask === 'above' ? `Solve ${m(`0 < ${fTex} < 1`)}.` : `Solve ${m(`${fTex} > 1`)}.`],
      solution: [
        { tex: `${m('\\sqrt{y} > y')} for ${m('0 < y < 1')}, and ${m('\\sqrt{y} < y')} for ${m('y > 1')}.`, why: 'E.g. $\\sqrt{0.25} = 0.5$ but $\\sqrt{4} = 2$.' },
        { tex: ask === 'above' ? `${m(`0 < ${fTex} < 1`)} gives ${m(`${lo.tex()} < x < ${hi.tex()}`)}.` : `${m(`${fTex} > 1`)} gives ${m(`x ${s > 0 ? '>' : '<'} ${o.tex()}`)}.`, why: s < 0 ? 'Dividing by a negative reverses the inequalities.' : undefined },
        { tex: `Answer: ${m(realSetAns(ans).tex)}.` },
      ],
      verify: () => {
        const mid = ans[0].lo === -Infinity ? ans[0].hi - 0.5 : ans[0].hi === Infinity ? ans[0].lo + 0.5 : (ans[0].lo + ans[0].hi) / 2;
        const fv = s * mid + c;
        return ask === 'above' ? Math.sqrt(fv) > fv : Math.sqrt(fv) < fv;
      },
    };
  },
};

// ---------------------------------------------------------------- RF13.solve

/** √(px + c) = x + d with integer roots r1, r2 of px + c = (x + d)². */
function radEq(rng: Rng, want: 'one' | 'two' | 'none' | 'any') {
  for (let guard = 0; guard < 60; guard++) {
    const d = rng.int(-5, 5);
    const [r1, r2] = [rng.int(-7, 7), rng.int(-7, 7)].sort((a, b) => a - b);
    if (r1 === r2) continue;
    const p = r1 + r2 + 2 * d;
    const c = d * d - r1 * r2;
    if (p === 0 || Math.abs(p) > 9) continue;
    const valid = [r1, r2].filter((r) => r + d >= 0);
    const kind = valid.length === 2 ? 'two' : valid.length === 1 ? 'one' : 'none';
    if (want !== 'any' && kind !== want) continue;
    return { d, r1, r2, p, c, valid, bad: [r1, r2].filter((r) => r + d < 0) };
  }
  throw new Reject();
}
const radTex = (p: number, c: number) => `\\sqrt{${polyTex([p, c])}}`;

const radSolveAlg: Generator = {
  id: 'u5-radsolve-algebraic',
  nodeId: 'RF13.solve',
  title: 'Solve a radical equation algebraically',
  make(rng, tier): Draft {
    const e = radEq(rng, tier === 1 ? 'one' : tier === 2 ? rng.pick(['one', 'two']) : rng.pick(['one', 'two', 'none']));
    const { d, r1, r2, p, c, valid, bad } = e;
    const isolated = tier === 1 || rng.chance(0.4);
    const eqShown = isolated ? `${radTex(p, c)} = ${polyTex([1, d])}` : `${radTex(p, c)} - x = ${d}`;
    const quad = [1, 2 * d - p, d * d - c];
    return {
      cognitive: 'problemSolving',
      stem: `Solve algebraically: ${m(eqShown)}.`,
      format: 'input',
      fields: [field(setAns(valid), 'x =')],
      hints: [isolated ? 'Square both sides.' : 'Isolate the radical first.', `${m(`${polyTex([p, c])} = ${lin(-d)}^2`)}`, 'Solve the quadratic, then check each root in the original equation. Type ∅ if none work.'],
      solution: [
        ...(isolated ? [] : [{ tex: m(`${radTex(p, c)} = ${polyTex([1, d])}`), why: 'Isolate the radical before squaring.' }]),
        { tex: m(`${polyTex([p, c])} = ${polyTex([1, 2 * d, d * d])}`), why: 'Square both sides; $(x + d)^2$ has a middle term.' },
        { tex: m(`${polyTex(quad)} = 0 \\Rightarrow ${lin(r1)}${lin(r2)} = 0`) },
        { tex: [r1, r2].map((r) => `${m(`x = ${r}`)}: right side ${m(String(r + d))} ${r + d >= 0 ? '✓' : '✗ (negative)'}`).join('; ') + '.', why: 'A principal square root is never negative, so a root that makes the right side negative is extraneous.' },
        { tex: valid.length ? `Solution: ${solutionText(valid)}.` : 'No solution: both roots are extraneous.' },
      ],
      verify: () => valid.every((x) => Math.abs(Math.sqrt(p * x + c) - (x + d)) < 1e-9) && bad.every((x) => Math.abs(Math.sqrt(p * x + c) - (x + d)) > 1e-6),
    };
  },
};

const radSolveGraph: Generator = {
  id: 'u5-radsolve-graphical',
  nodeId: 'RF13.solve',
  title: 'Solve a radical equation graphically',
  make(rng, tier): Draft {
    if (tier === 1) {
      const { d, p, c, valid, r1, r2 } = radEq(rng, rng.pick(['one', 'two']));
      const eq = `${radTex(p, c)} = ${polyTex([1, d])}`;
      const g = (x: number) => Math.sqrt(p * x + c) - x - d;
      const relRight = `y = ${radTex(p, c)} - x ${signedTex(-d)}`;
      return {
        cognitive: 'conceptual',
        stem: `The solutions of ${m(eq)} are the ${m('x')}-intercepts of which function?`,
        format: 'mc',
        choices: mc({ tex: m(relRight), key: 'ok' }, [
          { tex: m(`y = ${radTex(p, c)} + x ${signedTex(d)}`), key: 'sign', mis: 'related-fn-sign', feedback: 'Moving $x + d$ to the left side subtracts all of it.' },
          { tex: m(`y = ${polyTex([p, c])} - ${lin(-d)}^2`), key: 'sq', mis: 'extraneous-keep', feedback: `Squaring adds an extraneous root: this function is also zero at ${m(`x = ${[r1, r2].find((r) => !valid.includes(r)) ?? r1}`)}.` },
          { tex: m(`y = ${radTex(p, c)}`), key: 'one', mis: 'related-fn-sign', feedback: 'Its $x$-intercept solves $\\sqrt{\\ldots} = 0$, a different equation.' },
        ].filter((cnd) => cnd.key !== 'sq' || valid.length === 1)),
        hints: ['Move every term to one side so the other side is 0.', `${m(`${radTex(p, c)} - ${lin(-d)} = 0`)}`, 'The $x$-intercepts of $y = (\\text{left}) - (\\text{right})$ are the solutions.'],
        solution: [
          { tex: m(`${radTex(p, c)} - x ${signedTex(-d)} = 0`), why: 'Subtract the right side from both sides.' },
          { tex: `The zeros of ${m(relRight)} (its ${m('x')}-intercepts) are the solutions: ${solutionText(valid)}.` },
        ],
        verify: () => valid.every((x) => Math.abs(g(x)) < 1e-9),
      };
    }
    // Non-integer roots, read to the nearest hundredth.
    const p = rng.int(1, 4);
    const c = rng.int(1, 9);
    const s = rng.pick([F(1, 2), F(1), F(2), F(-1), F(-1, 2)]);
    const t = rng.int(-3, 3);
    // √(px + c) = s·x + t → s²x² + (2st − p)x + t² − c = 0
    const A = s.mul(s);
    const B = s.mul(2 * t).sub(p);
    const C = F(t * t - c);
    const disc = B.mul(B).sub(A.mul(C).mul(4)).value;
    if (disc <= 0) throw new Reject();
    const roots = [(-B.value - Math.sqrt(disc)) / (2 * A.value), (-B.value + Math.sqrt(disc)) / (2 * A.value)];
    const valid = roots.filter((x) => s.value * x + t >= 0 && p * x + c >= 0);
    if (!valid.length || valid.some((x) => Number.isInteger(Math.round(x * 100) / 100) || Math.abs(x * 100 - Math.round(x * 100)) > 0.48 || Math.abs(Math.abs(x * 100 % 1) - 0.5) < 0.02)) throw new Reject();
    const rhsTex = `${s.eq(1) ? '' : s.eq(-1) ? '-' : s.tex()}x${signedTex(t)}`;
    const eq = `${radTex(p, c)} = ${rhsTex}`;
    const f1 = (x: number) => Math.sqrt(p * x + c);
    const f2 = (x: number) => s.value * x + t;
    const xs = valid;
    const lo = Math.floor(Math.min(-c / p, ...xs) - 2);
    const hi = Math.ceil(Math.max(...xs) + 3);
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(eq)} graphically. Give the solution${valid.length > 1 ? 's' : ''} to the nearest hundredth.`,
      graph: tier === 2 ? { view: { x: [lo, hi], y: [Math.floor(Math.min(-2, f2(lo), f2(hi))), Math.ceil(Math.max(5, f1(hi) + 1))] }, curves: [{ fn: f1, role: 'image', label: 'left side' }, { fn: f2, role: 'aux', label: 'right side' }] } : undefined,
      format: 'input',
      fields: [field({ kind: 'set', values: valid, tex: valid.map((x) => (Math.round(x * 100) / 100).toFixed(2)).join(', '), round: 'hundredth' }, 'x \\approx')],
      hints: ['Graph $y_1$ = left side and $y_2$ = right side.', 'On the TI-84 Plus: 2nd TRACE (CALC), 5: intersect, at each intersection.', 'Only intersections count; the squared equation can have extra roots that are not on both graphs.'],
      solution: [
        { tex: `${m(`Y_1 = ${radTex(p, c)}`)}, ${m(`Y_2 = ${rhsTex}`)}.` },
        { tex: `Intersection${valid.length > 1 ? 's' : ''} at ${valid.map((x) => m(`x \\approx ${x.toFixed(2)}`)).join(' and ')}.`, why: 'Each intersection is an $x$ where both sides are equal.' },
        ...(valid.length < roots.length ? [{ tex: `The squared equation also gives ${m(`x \\approx ${roots.find((r) => !valid.includes(r))!.toFixed(2)}`)}, but the graphs do not meet there: it is extraneous.` }] : []),
      ],
      verify: () => valid.every((x) => Math.abs(f1(x) - f2(x)) < 1e-7),
    };
  },
};

const radSolveCount: Generator = {
  id: 'u5-radsolve-count',
  nodeId: 'RF13.solve',
  title: 'Number of solutions of a radical equation',
  make(rng, tier): Draft {
    const p = pickSqrt(rng, tier === 1 ? 1 : 2);
    const tex = transformedTex(SQRT, p);
    const R = sqrtRange(p);
    const kv = p.k.value;
    const cVal = kv + rng.pick([-3, -2, -1, 0, 1, 2, 3]);
    const n = (p.a.n > 0 ? cVal >= kv : cVal <= kv) ? 1 : 0;
    if (tier === 3) {
      const k = p.k;
      const ok = p.a.n > 0 ? k.n <= 0 : k.n >= 0;
      let x: Frac | null = null;
      if (ok) {
        const ratio = k.neg().div(p.a); // √(b(x − h)) = −k/a
        x = ratio.mul(ratio).div(p.b).add(p.h);
      }
      const ans = setAns(x ? [x] : []);
      return {
        cognitive: 'problemSolving',
        stem: `Determine the zero of ${m(`y = ${tex}`)}, if it exists. (Type ∅ if there is none.)`,
        format: 'input',
        fields: [field(ans, 'x =')],
        hints: ['A zero is an $x$ where $y = 0$: the $x$-intercept.', `Solve ${m(`${tex} = 0`)}: isolate the radical.`, `Range ${m(realSetAns(R).tex)}: does it contain 0?`],
        solution: [
          { tex: `Range ${m(realSetAns(R).tex)} ${ok ? 'contains' : 'does not contain'} ${m('0')}${ok ? '' : ', so there is no zero'}.`, why: 'The zeros of a function are the $x$-intercepts of its graph.' },
          ...(x ? [{ tex: m(`\\sqrt{${argTex(p.b, p.h).tex}} = ${k.neg().div(p.a).tex()} \\Rightarrow x = ${x.tex()}`), why: 'Isolate the radical, square, solve.' }] : [{ tex: 'No solution.' }]),
        ],
        verify: () => (x ? Math.abs(sqrtFn(p)(x.value)) < 1e-9 : true),
      };
    }
    const opts = ['0', '1', '2', 'infinitely many'];
    return {
      cognitive: 'conceptual',
      stem: `How many solutions does ${m(`${tex} = ${cVal}`)} have?`,
      format: 'mc',
      choices: mc({ tex: opts[n], key: n }, [
        { tex: opts[1 - n], key: 1 - n, mis: n ? 'extraneous-reject-valid' : 'extraneous-keep', feedback: `The range of the left side is ${m(realSetAns(R).tex)}.` },
        { tex: opts[2], key: 2, mis: 'extraneous-keep', feedback: 'A radical function is always increasing or always decreasing, so each value is reached at most once.' },
        { tex: opts[3], key: 3, mis: 'extraneous-keep' },
      ]),
      hints: ['Graph the left side and the horizontal line $y = $ right side.', `Range of the left side: ${m(realSetAns(R).tex)}.`, 'A radical function takes each value in its range exactly once.'],
      solution: [
        { tex: `${m(`y = ${tex}`)} has endpoint ${m(ptTex(p.h, p.k))} and range ${m(realSetAns(R).tex)}.` },
        { tex: `${m(`y = ${cVal}`)} is ${n ? 'inside' : 'outside'} the range, so there ${n ? 'is exactly one solution' : 'are no solutions'}.`, why: 'The line meets the curve once for each value in the range.' },
      ],
    };
  },
};

export const radicalGenerators: Generator[] = [sqrtDR, sqrtMap, sqrtEquation, sqrtfInvariant, sqrtfDR, sqrtfPoints, sqrtfCompare, radSolveAlg, radSolveGraph, radSolveCount];
