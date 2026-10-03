// Prerequisite layer: solving quadratics, vertex form.
import { iv, intervalTex } from '../../check/realset';
import { field, m, mc, pkey, type Cand } from '../../framework';
import { F, polyEval, polyTex, ptTex, shiftTex, signedTex } from '../../frac';
import type { AnswerSpec, Draft, Generator } from '../../types';
import { Reject } from '../../types';
import { gcd, gcdAll, isSquare, mulP, num, setAns, splitSquare, type Poly } from './shared';

// ---------------------------------------------------------------- P.quad-solve

const quadFactorSolve: Generator = {
  id: 'pre-quad-factor-solve',
  nodeId: 'P.quad-solve',
  title: 'Solve a quadratic by factoring',
  make(rng, tier): Draft {
    const p = tier === 1 ? 1 : rng.int(1, 3);
    const q = tier === 1 ? 1 : rng.int(1, 3);
    const r = rng.int(-7, 7);
    const s = rng.nz(-7, 7);
    if (r === 0 ? p > 1 : gcd(p, r) !== 1) throw new Reject();
    if (gcd(q, s) !== 1) throw new Reject();
    if (tier > 1 && p === 1 && q === 1) throw new Reject();
    const poly = mulP([p, -r], [q, -s]);
    const roots = [F(r, p), F(s, q)];
    const [A, B, C] = poly;
    let eq: string;
    let first: { tex: string; why?: string } | null = null;
    if (tier === 3 && C !== 0) {
      eq = `${polyTex([A, B, 0])} = ${-C}`;
      first = { tex: `Rearrange to ${m(`${polyTex(poly)} = 0`)}.`, why: 'The zero product property only works when one side is 0.' };
    } else eq = `${polyTex(poly)} = 0`;
    const fac = `\\left(${polyTex([p, -r])}\\right)\\left(${polyTex([q, -s])}\\right)`;
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(eq)}.`,
      format: 'input',
      fields: [field(setAns(roots), 'x =')],
      hints: [tier === 3 ? 'Move every term to one side first.' : 'Factor the left side.', 'If a product is 0, one of the factors is 0.', `${m(`${polyTex(poly)} = ${fac}`)}`],
      solution: [
        ...(first ? [first] : []),
        { tex: `${m(`${fac} = 0`)}`, why: 'Factor completely.' },
        { tex: `${m(`${polyTex([p, -r])} = 0`)} or ${m(`${polyTex([q, -s])} = 0`)}, so ${m(`x = ${roots[0].tex()}`)} or ${m(`x = ${roots[1].tex()}`)}.`, why: 'Zero product property. Solve each factor; watch the sign.' },
      ],
      verify: () => roots.every((x) => Math.abs(polyEval(poly)(x.value)) < 1e-9),
    };
  },
};

/** (-b ± √D)/(2a) in simplest form, LaTeX. */
function formulaTex(a: number, b: number, D: number): string {
  const [k, mm] = splitSquare(D);
  let N = -b;
  let K = k;
  let d = 2 * a;
  if (d < 0) [N, d] = [-N, -d];
  const g = gcdAll(N, K, d) || 1;
  [N, K, d] = [N / g, K / g, d / g];
  const rad = `${K === 1 ? '' : K}\\sqrt{${mm}}`;
  const top = N === 0 ? `\\pm ${rad}` : `${N} \\pm ${rad}`;
  return d === 1 ? top : `\\frac{${top}}{${d}}`;
}

const quadFormula: Generator = {
  id: 'pre-quad-formula',
  nodeId: 'P.quad-solve',
  title: 'Solve with the quadratic formula',
  make(rng, tier): Draft {
    const a = tier === 1 ? 1 : tier === 2 ? rng.pick([2, 3]) : rng.pick([-1, -2, 2, 3, 4]);
    const b = rng.int(-8, 8);
    const c = rng.int(-9, 9);
    const D = b * b - 4 * a * c;
    if (D <= 0 || isSquare(D)) throw new Reject();
    const roots = [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)];
    const ans = formulaTex(a, b, D);
    const spec: AnswerSpec = { kind: 'set', values: roots, tex: ans, exact: true };
    const [k, mm] = splitSquare(D);
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(`${polyTex([a, b, c])} = 0`)}. Give exact answers.`,
      format: 'input',
      fields: [field(spec, 'x =')],
      hints: ['The trinomial does not factor over the integers, so use the quadratic formula.', '$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$', `${m(`b^2 - 4ac = ${D}`)}`],
      solution: [
        { tex: `${m(`a = ${a},\\ b = ${b},\\ c = ${c}`)}; ${m(`b^2 - 4ac = ${b < 0 ? `(${b})` : b}^2 - 4(${a})(${c}) = ${D}`)}.`, why: 'Compute the discriminant first; it goes under the root.' },
        { tex: `${m(`x = \\frac{${b === 0 ? '' : `${-b} `}\\pm \\sqrt{${D}}}{${2 * a}}`)}`, why: 'The $-b$ and the root are both divided by $2a$.' },
        k === 1 && ans === `\\frac{${-b} \\pm \\sqrt{${D}}}{${2 * a}}` ? { tex: `${m(`\\sqrt{${D}}`)} does not simplify, so this is the answer.` } : { tex: `${k === 1 ? '' : `${m(`\\sqrt{${D}} = ${k}\\sqrt{${mm}}`)}, so `}${m(`x = ${ans}`)}.`, why: 'Simplify the radical, then divide every term of the numerator by any common factor.' },
      ],
      verify: () => roots.every((x) => Math.abs(a * x * x + b * x + c) < 1e-9),
    };
  },
};

const NATURE = ['no real roots', 'one real root (a double root)', 'two distinct real roots'];
const nature = (D: number) => (D < 0 ? 0 : D === 0 ? 1 : 2);

const quadDiscriminant: Generator = {
  id: 'pre-quad-discriminant',
  nodeId: 'P.quad-solve',
  title: 'Use the discriminant',
  make(rng, tier): Draft {
    const want = rng.int(0, 2);
    let a = rng.pick([1, 2, 3, -1, -2]);
    let b: number;
    let c: number;
    if (want === 1) {
      const r = rng.nz(-4, 4);
      const k = rng.pick([1, 2, 3]);
      a = k;
      b = -2 * k * r;
      c = k * r * r;
      if (rng.chance(0.5)) [a, b, c] = [-a, -b, -c];
    } else {
      b = rng.int(-7, 7);
      c = rng.nz(-8, 8);
    }
    if (tier === 1 && a < 0) throw new Reject();
    const D = b * b - 4 * a * c;
    if (nature(D) !== want || (tier > 1 && D === b * b + 4 * a * c)) throw new Reject();
    const opt = (d: number, n: number) => `$\\Delta = ${d}$; ${NATURE[n]}`;
    const wrong = b * b + 4 * a * c;
    const cands: Cand[] = [
      ...[0, 1, 2].filter((n) => n !== want).map((n) => ({ tex: opt(D, n), key: `${D}|${n}`, mis: 'quad-disc-count', feedback: 'Positive discriminant: two real roots. Zero: one. Negative: none.' })),
      { tex: opt(wrong, nature(wrong)), key: `${wrong}|${nature(wrong)}`, mis: 'quad-formula-sign', feedback: `The discriminant is ${m('b^2 - 4ac')}; watch the sign of ${m('c')} and ${m('a')}.` },
      { tex: opt(-D, nature(-D)), key: `${-D}|${nature(-D)}`, mis: 'quad-formula-sign' },
    ];
    return {
      cognitive: 'conceptual',
      stem: `For ${m(`${polyTex([a, b, c])} = 0`)}, determine the discriminant and the nature of the roots.`,
      format: 'mc',
      choices: mc({ tex: opt(D, want), key: `${D}|${want}` }, cands),
      hints: ['The discriminant is the expression under the root in the quadratic formula.', '$\\Delta = b^2 - 4ac$.', `${m(`\\Delta = ${b < 0 ? `(${b})` : b}^2 - 4(${a})(${c})`)}`],
      solution: [
        { tex: `${m(`\\Delta = ${b < 0 ? `(${b})` : b}^2 - 4(${a})(${c}) = ${b * b} ${-4 * a * c < 0 ? '-' : '+'} ${Math.abs(4 * a * c)} = ${D}`)}`, why: 'Brackets around negative values avoid sign errors.' },
        { tex: `${m(`\\Delta ${D > 0 ? '> 0' : D === 0 ? '= 0' : '< 0'}`)}, so there ${want === 0 ? 'are no real roots' : want === 1 ? 'is one real root' : 'are two distinct real roots'}.`, why: 'The root of a negative number is not real; the root of 0 adds and subtracts nothing.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- P.quad-vertex

const quadVertexRead: Generator = {
  id: 'pre-quad-vertex-read',
  nodeId: 'P.quad-vertex',
  title: 'Read a parabola in vertex form',
  make(rng, tier): Draft {
    const a = rng.pick([1, 2, 3, -1, -2, -3, F(1, 2).value]);
    const h = rng.nz(-6, 6);
    const k = rng.nz(-6, 6);
    if (Math.abs(h) === Math.abs(k)) throw new Reject();
    const aF = a === 0.5 ? F(1, 2) : F(a);
    const eq = `y = ${aF.eq(1) ? '' : aF.eq(-1) ? '-' : aF.tex()}\\left(${shiftTex(h)}\\right)^2 ${signedTex(k)}`;
    const opens = a > 0 ? 'up' : 'down';
    if (tier === 1) {
      return {
        cognitive: 'procedural',
        stem: `What is the vertex of ${m(eq)}?`,
        format: 'mc',
        choices: mc({ tex: m(ptTex(h, k)), key: pkey(h, k) }, [
          { tex: m(ptTex(-h, k)), key: pkey(-h, k), mis: 'quad-vertex-sign-h', feedback: `In ${m('(x - h)^2')} the vertex has $x = h$: ${m(`(${shiftTex(h)})`)} gives $x = ${h}$.` },
          { tex: m(ptTex(k, h)), key: pkey(k, h), mis: 'quad-vertex-swap' },
          { tex: m(ptTex(h, -k)), key: pkey(h, -k), mis: 'tr-k-sign', feedback: 'The $k$ outside the bracket is the $y$-coordinate as written.' },
          { tex: m(ptTex(-h, -k)), key: pkey(-h, -k), mis: 'quad-vertex-sign-h' },
        ]),
        hints: ['Compare with $y = a(x - h)^2 + k$.', 'The vertex is $(h, k)$. Read $h$ carefully: it is subtracted.', `${m(`${shiftTex(h)} = x - (${h})`)}`],
        solution: [
          { tex: `${m(`${shiftTex(h)} = x - (${h})`)}, so ${m(`h = ${h}`)}; ${m(`k = ${k}`)}.`, why: 'Write the bracket as $x - h$ to read $h$ with its sign.' },
          { tex: `Vertex ${m(ptTex(h, k))}.` },
        ],
      };
    }
    if (tier === 2) {
      const word = a > 0 ? 'minimum' : 'maximum';
      const other = a > 0 ? 'maximum' : 'minimum';
      const opt = (w: string, val: number, at: number) => `a ${w} value of $${val}$ when $x = ${at}$`;
      return {
        cognitive: 'conceptual',
        stem: `Which describes ${m(eq)}?`,
        format: 'mc',
        choices: mc({ tex: opt(word, k, h), key: `${word}${k}${h}` }, [
          { tex: opt(other, k, h), key: `${other}${k}${h}`, mis: 'quad-max-min', feedback: `${m(`a ${a > 0 ? '> 0' : '< 0'}`)}: the parabola opens ${opens}, so the vertex is a ${word}.` },
          { tex: opt(word, h, k), key: `${word}${h}${k}`, mis: 'quad-vertex-swap', feedback: 'The value of the function is the $y$-coordinate $k$, reached at $x = h$.' },
          { tex: opt(word, k, -h), key: `${word}${k}${-h}`, mis: 'quad-vertex-sign-h' },
          { tex: opt(other, h, k), key: `${other}${h}${k}`, mis: 'quad-max-min' },
        ]),
        hints: ['The sign of $a$ decides whether the parabola opens up or down.', `Here ${m(`a ${a > 0 ? '> 0' : '< 0'}`)}, so it opens ${opens}.`, `The vertex is ${m(ptTex(h, k))}.`],
        solution: [
          { tex: `${m(`a ${a > 0 ? '> 0' : '< 0'}`)}: the parabola opens ${opens}, so the vertex is the ${word}.` },
          { tex: `Vertex ${m(ptTex(h, k))}: ${opt(word, k, h)}.`, why: 'The value is the $y$-coordinate; the place is the $x$-coordinate.' },
        ],
      };
    }
    const up = a > 0;
    const ans = up ? [iv(k, Infinity, true, false)] : [iv(-Infinity, k, false, true)];
    const flip = up ? [iv(-Infinity, k, false, true)] : [iv(k, Infinity, true, false)];
    const swapped = up ? [iv(h, Infinity, true, false)] : [iv(-Infinity, h, false, true)];
    const open = up ? [iv(k, Infinity, false, false)] : [iv(-Infinity, k, false, false)];
    return {
      cognitive: 'conceptual',
      stem: `What is the range of ${m(eq)}?`,
      format: 'mc',
      choices: mc({ tex: m(intervalTex(ans)), key: intervalTex(ans) }, [
        { tex: m(intervalTex(flip)), key: intervalTex(flip), mis: 'quad-max-min', feedback: `The parabola opens ${opens}, so $y$ values are ${up ? 'at least' : 'at most'} ${k}.` },
        { tex: m(intervalTex(swapped)), key: intervalTex(swapped), mis: 'dr-swap', feedback: 'Range is about $y$-values, so it depends on $k$.' },
        { tex: m(intervalTex(open)), key: intervalTex(open), mis: 'dr-bracket-type', feedback: `The vertex value ${k} is reached, so the bracket at ${k} is square.` },
      ]),
      hints: ['Range is the set of $y$-values.', 'The vertex is the lowest or highest point.', `Vertex ${m(ptTex(h, k))}; the parabola opens ${opens}.`],
      solution: [
        { tex: `Vertex ${m(ptTex(h, k))}, opens ${opens}.` },
        { tex: `Range ${m(intervalTex(ans))}.`, why: `Every $y$-value ${up ? 'above' : 'below'} ${k} is reached, and ${k} itself is reached at the vertex.` },
      ],
    };
  },
};

const quadCompleteSquare: Generator = {
  id: 'pre-quad-complete-square',
  nodeId: 'P.quad-vertex',
  title: 'Complete the square',
  make(rng, tier): Draft {
    const a = tier === 1 ? 1 : rng.pick([2, 3, -1, -2]);
    const h = tier === 3 ? F(rng.pick([-5, -3, -1, 1, 3, 5]), 2) : F(rng.nz(-5, 5));
    const k = tier === 3 ? F(rng.int(-12, 12), 4) : F(rng.int(-9, 9));
    // y = a(x - h)^2 + k = a x^2 - 2ah x + a h^2 + k
    const B = h.mul(-2 * a);
    const C = h.mul(h).mul(a).add(k);
    if (!B.isInt || !C.isInt) throw new Reject();
    const b = B.n;
    const c = C.n;
    const half = F(b, 2 * a);
    return {
      cognitive: 'procedural',
      stem: `Write ${m(`y = ${polyTex([a, b, c])}`)} in the form ${m('y = a(x - h)^2 + k')}.`,
      format: 'input',
      fields: [field(num(a), 'a ='), field(num(h), 'h ='), field(num(k), 'k =')],
      hints: [a !== 1 ? `Factor ${a} out of the first two terms.` : 'Take half the coefficient of $x$ and square it.', `Inside the bracket, the coefficient of $x$ is ${m(F(b, a).tex())}; half of it is ${m(half.tex())}.`, `Add and subtract ${m(half.mul(half).tex())} inside the bracket.`],
      solution: [
        ...(a !== 1 ? [{ tex: `${m(`y = ${a}\\left(x^2 ${signedTex(F(b, a))}x\\right) ${signedTex(c)}`)}`, why: 'Factor $a$ from the $x^2$ and $x$ terms only.' }] : []),
        { tex: `${m(`y = ${a === 1 ? '' : a === -1 ? '-' : a}\\left(x^2 ${signedTex(F(b, a))}x + ${half.mul(half).tex()} - ${half.mul(half).tex()}\\right) ${signedTex(c)}`)}`, why: `Half of ${m(F(b, a).tex())} is ${m(half.tex())}; its square completes the square. Adding and subtracting it keeps the value the same.` },
        { tex: `${m(`y = ${a === 1 ? '' : a === -1 ? '-' : a}\\left(x ${signedTex(half)}\\right)^2 ${signedTex(C.sub(half.mul(half).mul(a)))}`)}`, why: a === 1 ? 'The first three terms in the bracket are a perfect square; combine the constants outside.' : `The ${m(`-${half.mul(half).tex()}`)} comes out of the bracket multiplied by ${a}.` },
        { tex: `So ${m(`a = ${a}`)}, ${m(`h = ${h.tex()}`)}, ${m(`k = ${k.tex()}`)}.`, why: `${m(`x ${signedTex(half)} = x - (${h.tex()})`)}, so $h$ has the opposite sign.` },
      ],
      verify: () => [0.3, 1.7, -2.2].every((x) => Math.abs(a * (x - h.value) ** 2 + k.value - (a * x * x + b * x + c)) < 1e-9),
    };
  },
};

const quadVertexStandard: Generator = {
  id: 'pre-quad-vertex-standard',
  nodeId: 'P.quad-vertex',
  title: 'Vertex from standard form',
  make(rng, tier): Draft {
    const a = tier === 1 ? rng.pick([1, -1]) : rng.pick([2, -2, 3, -3, 4]);
    const b = tier === 3 ? rng.nz(-9, 9) : 2 * a * rng.nz(-4, 4);
    const c = rng.int(-9, 9);
    const h = F(-b, 2 * a);
    const k = F(c).add(h.mul(b)).add(h.mul(h).mul(a));
    const poly: Poly = [a, b, c];
    const ans: AnswerSpec = { kind: 'points', values: [[h.value, k.value]], tex: ptTex(h, k) };
    return {
      cognitive: 'procedural',
      stem: `Determine the vertex of ${m(`y = ${polyTex(poly)}`)}.`,
      format: 'input',
      fields: [field(ans, 'vertex:')],
      hints: ['The axis of symmetry passes through the vertex.', '$x = -\\frac{b}{2a}$', `${m(`x = ${h.tex()}`)}. Substitute it to find $y$.`],
      solution: [
        { tex: `${m(`x = -\\frac{b}{2a} = -\\frac{${b}}{2(${a})} = ${h.tex()}`)}`, why: 'The vertex lies halfway between the roots, at $x = -\\frac{b}{2a}$.' },
        { tex: `${m(`y = ${a}\\left(${h.tex()}\\right)^2 ${b < 0 ? '-' : '+'} ${Math.abs(b)}\\left(${h.tex()}\\right) ${signedTex(c)} = ${k.tex()}`)}` },
        { tex: `Vertex ${m(ptTex(h, k))}.` },
      ],
      verify: () => Math.abs(polyEval(poly)(h.value) - k.value) < 1e-9 && Math.abs(polyEval(poly)(h.value + 1) - polyEval(poly)(h.value - 1)) < 1e-9,
    };
  },
};

export const preQuadGenerators: Generator[] = [quadFactorSolve, quadFormula, quadDiscriminant, quadVertexRead, quadCompleteSquare, quadVertexStandard];
