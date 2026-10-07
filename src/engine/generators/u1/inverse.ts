// RF5 reflection in y = x, RF6 inverses
import { iv, intervalTex } from '../../check/realset';
import { field, m, mc, pkey } from '../../framework';
import { coefTex, F, Frac, polyTex, ptTex, shiftTex, signedTex } from '../../frac';
import type { Draft, Generator } from '../../types';
import { Reject } from '../../types';
import { ivAns, pt } from './basics';
import { pointOnF } from './shared';

const linTex = (mm: Frac, c: Frac) => `${coefTex(mm)}x${signedTex(c)}`;
/** LaTeX for (x - c)/m written cleanly. */
const invLinTex = (mm: Frac, c: Frac) => {
  if (mm.isInt) return `\\frac{${shiftTex(c)}}{${mm.tex()}}`;
  return `${coefTex(mm.inv())}\\left(${shiftTex(c)}\\right)`;
};

// ---------------------------------------------------------------- RF5.reflect-yx

const yxPoint: Generator = {
  id: 'rf5-yx-point',
  nodeId: 'RF5.reflect-yx',
  title: 'Point on the inverse',
  make(rng, tier): Draft {
    const [x, y] = pointOnF(rng);
    if (x.eq(y) || x.eq(y.neg())) throw new Reject();
    const stem = `The point ${m(ptTex(x, y))} is on the graph of $y = f(x)$. Which point must be on the graph of its inverse?`;
    const hints: [string, string, string] = [
      'The inverse undoes $f$: inputs and outputs trade places.',
      'Reflecting in $y = x$ maps $(x, y) \\to (y, x)$.',
      'Swap the coordinates.',
    ];
    const solution = [{ tex: `Swap: ${m(`${ptTex(x, y)} \\to ${ptTex(y, x)}`)}.`, why: `$f(${x.tex()}) = ${y.tex()}$ means the inverse sends $${y.tex()}$ back to $${x.tex()}$.` }];
    if (tier < 3) {
      return {
        cognitive: 'procedural',
        stem,
        format: 'mc',
        choices: mc({ tex: m(ptTex(y, x)), key: pkey(y.value, x.value) }, [
          { tex: m(ptTex(x.inv(), y.inv())), key: pkey(1 / x.value, 1 / y.value), mis: 'inv-reciprocal', feedback: '$f^{-1}$ is not $\\frac{1}{f}$. The inverse swaps coordinates.' },
          { tex: m(ptTex(x.neg(), y.neg())), key: pkey(-x.value, -y.value), mis: 'tr-reflect-axis-swap' },
          { tex: m(ptTex(y.neg(), x.neg())), key: pkey(-y.value, -x.value), mis: 'inv-yx-combined', feedback: 'That is a reflection in $y = -x$.' },
          { tex: m(ptTex(x.neg(), y)), key: pkey(-x.value, y.value), mis: 'tr-reflect-axis-swap' },
        ]),
        hints,
        solution,
      };
    }
    return { cognitive: 'procedural', stem, format: 'input', fields: [field(pt(y, x), '', 'Point (x, y)')], hints, solution };
  },
};

const yxDomainRange: Generator = {
  id: 'rf5-yx-domain-range',
  nodeId: 'RF5.reflect-yx',
  title: 'Domain and range of the inverse',
  make(rng): Draft {
    const lo = F(rng.int(-6, 1));
    const hi = lo.add(rng.int(2, 8));
    const c = F(rng.int(-5, 2));
    const d = c.add(rng.int(2, 8));
    if (lo.eq(c) && hi.eq(d)) throw new Reject();
    return {
      cognitive: 'conceptual',
      stem: `A function $f$ has domain ${m(`[${lo.tex()}, ${hi.tex()}]`)} and range ${m(`[${c.tex()}, ${d.tex()}]`)}. State the domain and range of its inverse.`,
      format: 'input',
      fields: [field(ivAns(c, d), '', 'Domain of the inverse'), field(ivAns(lo, hi), '', 'Range of the inverse')],
      hints: ['Every point $(x, y)$ becomes $(y, x)$.', 'So the set of $x$-values and the set of $y$-values trade places.', `The inverse's domain is the original range, ${m(`[${c.tex()}, ${d.tex()}]`)}.`],
      solution: [{ tex: `Domain of inverse = range of $f$ = ${m(`[${c.tex()}, ${d.tex()}]`)}; range of inverse = domain of $f$ = ${m(`[${lo.tex()}, ${hi.tex()}]`)}.`, why: 'Reflection in $y = x$ swaps every $x$- and $y$-coordinate.' }],
    };
  },
};

const yxInvariant: Generator = {
  id: 'rf5-yx-invariant',
  nodeId: 'RF5.reflect-yx',
  title: 'Invariant points under reflection in y = x',
  make(rng, tier): Draft {
    if (tier < 3) {
      const x0 = F(rng.nz(-5, 5));
      const mm = rng.pick([F(2), F(3), F(-1), F(-2), F(1, 2), F(-3)]);
      const c = x0.sub(mm.mul(x0));
      if (c.n === 0) throw new Reject();
      return {
        cognitive: 'problemSolving',
        stem: `Determine the invariant point when the graph of ${m(`f(x) = ${linTex(mm, c)}`)} is reflected in the line $y = x$.`,
        format: 'input',
        fields: [field(pt(x0, x0), '', 'Point (x, y)')],
        hints: ['Points on the mirror line do not move.', 'Find where $f(x) = x$.', `Solve ${m(`${linTex(mm, c)} = x`)}.`],
        solution: [
          { tex: `Invariant points lie on $y = x$, so solve ${m(`${linTex(mm, c)} = x`)}.`, why: 'A point on the mirror line is its own reflection.' },
          { tex: `${m(`${mm.sub(1).tex()}x = ${c.neg().tex()} \\Rightarrow x = ${x0.tex()}`)}` },
          { tex: `Invariant point: ${m(ptTex(x0, x0))}.` },
        ],
      };
    }
    const r = rng.int(-4, 0);
    const s = 1 - r; // roots of x^2 - x + r s = 0
    const cc = r * s;
    if (cc === 0) throw new Reject();
    return {
      cognitive: 'problemSolving',
      stem: `Determine all invariant points when the graph of ${m(`f(x) = ${polyTex([1, 0, cc])}`)} is reflected in the line $y = x$.`,
      format: 'input',
      fields: [field({ kind: 'points', values: [[r, r], [s, s]], tex: `${ptTex(r, r)}, ${ptTex(s, s)}` }, '', 'Points, separated by commas')],
      hints: ['Invariant points lie on the mirror line $y = x$.', 'Solve $f(x) = x$.', `${m(`x^2 - x ${signedTex(cc)} = 0`)}. Factor.`],
      solution: [
        { tex: `Solve ${m(`${polyTex([1, 0, cc])} = x`)}: ${m(`x^2 - x ${signedTex(cc)} = 0`)}.` },
        { tex: `${m(`(${shiftTex(r)})(${shiftTex(s)}) = 0`)}, so $x = ${r}$ or $x = ${s}$.` },
        { tex: `Invariant points ${m(ptTex(r, r))} and ${m(ptTex(s, s))}.`, why: 'On $y = x$ the coordinates are equal.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF6.inverse-alg

const invLinear: Generator = {
  id: 'rf6-inverse-linear',
  nodeId: 'RF6.inverse-alg',
  title: 'Inverse of a linear function',
  make(rng, tier): Draft {
    const mm = tier === 1 ? F(rng.pick([2, 3, 4, 5, -2, -3])) : rng.pick([F(2), F(3), F(-4), F(1, 2), F(2, 3), F(-3, 4), F(5)]);
    const c = F(rng.nz(-9, 9));
    const f = linTex(mm, c);
    const inv = invLinTex(mm, c);
    const fn = (x: number) => (x - c.value) / mm.value;
    const verify = () => [-3, 0, 2, 5].every((x) => Math.abs(mm.value * fn(x) + c.value - x) < 1e-9);
    const stem = `Determine the equation of the inverse of ${m(`f(x) = ${f}`)}.`;
    const hints: [string, string, string] = ['Write $y = f(x)$, then swap $x$ and $y$.', 'After swapping, solve for $y$: undo the operations in reverse order.', `${m(`x = ${linTex(mm, c).replace(/x/, 'y')}`)}. Now isolate $y$.`];
    const solution = [
      { tex: `${m(`y = ${f}`)}. Swap: ${m(`x = ${linTex(mm, c).replace(/x/, 'y')}`)}.`, why: 'The inverse reverses inputs and outputs.' },
      { tex: `${m(`x ${signedTex(c.neg())} = ${coefTex(mm)}y`)}` },
      { tex: `${m(`f^{-1}(x) = ${inv}`)}`, why: 'The inverse of a non-horizontal line is a function, so $f^{-1}$ notation is allowed.' },
    ];
    if (tier === 1) {
      const recip = `\\frac{1}{${f}}`;
      const wrongSign = invLinTex(mm, c.neg());
      const wrongDiv = `${mm.tex()}x${signedTex(c.neg())}`;
      return {
        cognitive: 'procedural',
        stem,
        verify,
        format: 'mc',
        choices: mc({ tex: m(`f^{-1}(x) = ${inv}`), key: inv }, [
          { tex: m(`f^{-1}(x) = ${recip}`), key: recip, mis: 'inv-reciprocal' },
          { tex: m(`f^{-1}(x) = ${wrongSign}`), key: wrongSign, mis: 'inv-swap-incomplete', feedback: 'Undo $+c$ by subtracting $c$.' },
          { tex: m(`f^{-1}(x) = ${wrongDiv}`), key: wrongDiv, mis: 'inv-swap-incomplete', feedback: 'Multiplying by the coefficient does not undo multiplying by it.' },
        ]),
        hints,
        solution,
      };
    }
    return { cognitive: 'procedural', stem, verify, format: 'input', fields: [field({ kind: 'expr', tex: inv, variable: 'x', fn, sample: [-8, 8] }, 'f^{-1}(x) =')], hints, solution };
  },
};

const invQuadratic: Generator = {
  id: 'rf6-inverse-quadratic',
  nodeId: 'RF6.inverse-alg',
  title: 'Inverse of a quadratic (not a function)',
  make(rng, tier): Draft {
    const a = tier === 1 ? F(1) : rng.pick([F(1), F(2), F(-1), F(3), F(-2)]);
    const h = F(rng.nz(-5, 5));
    const k = F(rng.nz(-6, 6));
    const f = `${coefTex(a)}\\left(${shiftTex(h)}\\right)^2${signedTex(k)}`;
    const rad = a.eq(1) ? shiftTex(k) : a.eq(-1) ? `-\\left(${shiftTex(k)}\\right)` : `\\frac{${shiftTex(k)}}{${a.tex()}}`;
    const inv = `${h.tex()} \\pm \\sqrt{${rad}}`;
    const r = (x: number) => Math.sqrt((x - k.value) / a.value);
    const sample: [number, number] = a.n > 0 ? [k.value, k.value + 12] : [k.value - 12, k.value];
    return {
      cognitive: 'procedural',
      stem: `Determine the equation of the inverse of ${m(`y = ${f}`)}.`,
      verify: () => [1, 3, 7].every((d) => { const x = k.value + Math.sign(a.value) * d; const F_ = (t: number) => a.value * (t - h.value) ** 2 + k.value; return Math.abs(F_(h.value + r(x)) - x) < 1e-9 && Math.abs(F_(h.value - r(x)) - x) < 1e-9; }),
      format: 'input',
      fields: [field({ kind: 'expr', tex: inv, variable: 'x', fn: (x) => h.value + r(x), fnMinus: (x) => h.value - r(x), sample }, 'y =')],
      hints: [
        'Swap $x$ and $y$, then solve for $y$.',
        'Undo in reverse order: subtract $k$, divide by $a$, take the square root (both signs), add $h$.',
        `${m(`x = ${coefTex(a)}\\left(${shiftTex(h, 'y')}\\right)^2${signedTex(k)}`)}`,
      ],
      solution: [
        { tex: `Swap: ${m(`x = ${coefTex(a)}\\left(${shiftTex(h, 'y')}\\right)^2${signedTex(k)}`)}.` },
        { tex: `${m(`\\left(${shiftTex(h, 'y')}\\right)^2 = ${rad}`)}`, why: 'Subtract $k$, then divide by $a$.' },
        { tex: `${m(`${shiftTex(h, 'y')} = \\pm\\sqrt{${rad}}`)}`, why: 'A square root has two values, so you need $\\pm$.' },
        { tex: `${m(`y = ${inv}`)}`, why: 'The inverse is not a function (it fails the vertical line test), so write $y =$, not $f^{-1}(x) =$.' },
      ],
    };
  },
};

const invEvaluate: Generator = {
  id: 'rf6-inverse-evaluate',
  nodeId: 'RF6.inverse-alg',
  title: 'Evaluate an inverse',
  make(rng, tier): Draft {
    const mm = F(rng.pick(tier === 1 ? [2, 3, 4, 5] : [2, 3, -2, -3, 4, -5]));
    const c = F(rng.nz(-9, 9));
    const ans = F(rng.nz(-6, 6));
    const n = ans.mul(mm).add(c); // f(ans) = n
    const fn = linTex(mm, c);
    const verify = () => Math.abs(mm.value * ans.value + c.value - n.value) < 1e-9;
    const stem = `If ${m(`f(x) = ${fn}`)}, determine the value of ${m(`f^{-1}(${n.tex()})`)}.`;
    const hints: [string, string, string] = ['$f^{-1}(n)$ is the input that makes $f$ output $n$.', `Solve $f(x) = ${n.tex()}$.`, `${m(`${fn} = ${n.tex()}`)}`];
    const solution = [
      { tex: `${m(`f^{-1}(${n.tex()}) = x`)} means ${m(`f(x) = ${n.tex()}`)}.`, why: 'The inverse runs $f$ backwards.' },
      { tex: `${m(`${fn} = ${n.tex()} \\Rightarrow x = ${ans.tex()}`)}` },
    ];
    if (tier < 3) {
      const fn_n = n.mul(mm).add(c);
      return {
        cognitive: 'procedural',
        stem,
        verify,
        format: 'mc',
        choices: mc({ tex: m(ans.tex()), key: ans.value }, [
          { tex: m(fn_n.tex()), key: fn_n.value, mis: 'inv-swap-incomplete', feedback: `That is $f(${n.tex()})$, not $f^{-1}(${n.tex()})$.` },
          ...(fn_n.n !== 0 ? [{ tex: m(fn_n.inv().tex()), key: fn_n.inv().value, mis: 'inv-reciprocal' }] : []),
          { tex: m(n.add(c).div(mm).tex()), key: n.add(c).div(mm).value, mis: 'inv-swap-incomplete', feedback: 'Undo adding $c$ by subtracting it.' },
          { tex: m(n.sub(c).mul(mm).tex()), key: n.sub(c).mul(mm).value, mis: 'inv-swap-incomplete' },
        ]),
        hints,
        solution,
      };
    }
    return { cognitive: 'procedural', stem, verify, format: 'input', fields: [field({ kind: 'number', value: ans.value, tex: ans.tex(), exact: true }, `f^{-1}(${n.tex()}) =`)], hints, solution };
  },
};

// ---------------------------------------------------------------- RF6.restrict

function quadSetup(rng: import('../../rng').Rng) {
  const a = rng.pick([F(1), F(2), F(-1), F(-2), F(3)]);
  const h = F(rng.nz(-5, 5));
  let k = F(rng.nz(-6, 6));
  if (k.eq(h) || k.eq(h.neg())) k = k.add(1);
  if (k.n === 0) k = F(7);
  return { a, h, k, f: `${coefTex(a)}\\left(${shiftTex(h)}\\right)^2${signedTex(k)}` };
}

const restrictWhich: Generator = {
  id: 'rf6-restrict-which',
  nodeId: 'RF6.restrict',
  title: 'Choose a domain restriction',
  make(rng): Draft {
    const { h, k, f } = quadSetup(rng);
    // Distractors must cross the vertex, or they would also be valid restrictions (one-sided subsets of a branch).
    const ge = h.value > 0;
    const op = ge ? '\\ge' : '\\le';
    if (ge ? k.value >= h.value : k.value <= h.value) throw new Reject();
    return {
      cognitive: 'conceptual',
      stem: `Which restriction on the domain of ${m(`f(x) = ${f}`)} makes its inverse a function?`,
      format: 'mc',
      choices: mc({ tex: m(`x ${op} ${h.tex()}`), key: 'r' }, [
        { tex: m(`x ${op} ${k.tex()}`), key: 'k', mis: 'inv-restrict-wrong', feedback: '$k$ is the $y$-coordinate of the vertex. The domain restriction uses its $x$-coordinate.' },
        { tex: m(`y ${op} ${k.tex()}`), key: 'y', mis: 'inv-restrict-wrong', feedback: 'That restricts $y$, not $x$. A domain restriction is a condition on $x$.' },
        { tex: m(`x ${op} ${h.neg().tex()}`), key: 'h', mis: 'tr-h-sign' },
      ]),
      hints: ['The inverse is a function only if $f$ passes the horizontal line test.', 'Keep one half of the parabola: cut it at the vertex.', `The vertex is at $x = ${h.tex()}$.`],
      solution: [
        { tex: `Vertex: ${m(ptTex(h, k))}.` },
        { tex: `Restrict to one side of the axis of symmetry: ${m(`x ${op} ${h.tex()}`)}.`, why: 'Each half is one-to-one, so its reflection in $y = x$ passes the vertical line test.' },
      ],
    };
  },
};

const restrictedInverse: Generator = {
  id: 'rf6-restricted-inverse',
  nodeId: 'RF6.restrict',
  title: 'Inverse of a restricted quadratic',
  make(rng): Draft {
    const { a, h, k, f } = quadSetup(rng);
    const ge = rng.chance(0.5);
    const sign = ge ? '+' : '-';
    const rad = a.eq(1) ? shiftTex(k) : a.eq(-1) ? `-\\left(${shiftTex(k)}\\right)` : `\\frac{${shiftTex(k)}}{${a.tex()}}`;
    const inv = `${h.tex()} ${sign} \\sqrt{${rad}}`;
    const r = (x: number) => Math.sqrt((x - k.value) / a.value);
    return {
      cognitive: 'problemSolving',
      verify: () => [1, 4, 9].every((d) => { const x = k.value + Math.sign(a.value) * d; const y = h.value + (ge ? 1 : -1) * r(x); return Math.abs(a.value * (y - h.value) ** 2 + k.value - x) < 1e-9 && (ge ? y >= h.value : y <= h.value); }),
      stem: `${m(`f(x) = ${f}`)} with domain ${m(`x ${ge ? '\\ge' : '\\le'} ${h.tex()}`)}. Determine ${m('f^{-1}(x)')}.`,
      format: 'input',
      fields: [field({ kind: 'expr', tex: inv, variable: 'x', fn: (x) => h.value + (ge ? 1 : -1) * r(x), sample: a.n > 0 ? [k.value, k.value + 12] : [k.value - 12, k.value] }, 'f^{-1}(x) =')],
      hints: [
        'Find the inverse as usual, then decide which sign of the root to keep.',
        'The range of $f^{-1}$ equals the restricted domain of $f$.',
        `$f^{-1}$ must give values $${ge ? '\\ge' : '\\le'} ${h.tex()}$.`,
      ],
      solution: [
        { tex: `Swap and solve: ${m(`y = ${h.tex()} \\pm \\sqrt{${rad}}`)}.` },
        { tex: `Keep ${m(sign)}: ${m(`f^{-1}(x) = ${inv}`)}.`, why: `The outputs of $f^{-1}$ are the inputs of $f$, which are ${ge ? 'at least' : 'at most'} $${h.tex()}$.` },
      ],
    };
  },
};

const restrictedDR: Generator = {
  id: 'rf6-restricted-domain-range',
  nodeId: 'RF6.restrict',
  title: 'Domain and range of the restricted inverse',
  make(rng): Draft {
    const { a, h, k, f } = quadSetup(rng);
    const ge = rng.chance(0.5);
    const dom = a.n > 0 ? [iv(k.value, Infinity)] : [iv(-Infinity, k.value)];
    const ran = ge ? [iv(h.value, Infinity)] : [iv(-Infinity, h.value)];
    return {
      cognitive: 'conceptual',
      stem: `${m(`f(x) = ${f}`)} is restricted to ${m(`x ${ge ? '\\ge' : '\\le'} ${h.tex()}`)}. State the domain and range of ${m('f^{-1}')}.`,
      format: 'input',
      fields: [field({ kind: 'interval', value: dom, tex: intervalTex(dom) }, '', 'Domain of the inverse'), field({ kind: 'interval', value: ran, tex: intervalTex(ran) }, '', 'Range of the inverse')],
      hints: ['Domain and range swap between $f$ and $f^{-1}$.', 'Find the range of the restricted $f$ from its vertex and direction of opening.', `The vertex is ${m(ptTex(h, k))} and the parabola opens ${a.n > 0 ? 'up' : 'down'}.`],
      solution: [
        { tex: `Restricted $f$: domain ${m(intervalTex(ran))}, range ${m(intervalTex(dom))}.`, why: `Opening ${a.n > 0 ? 'up' : 'down'} from the vertex $y = ${k.tex()}$.` },
        { tex: `So $f^{-1}$ has domain ${m(intervalTex(dom))} and range ${m(intervalTex(ran))}.` },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF6.params

const paramSlope: Generator = {
  id: 'rf6-param-slope',
  nodeId: 'RF6.params',
  title: 'Find a parameter from the inverse',
  make(rng): Draft {
    const a = F(rng.nz(-5, 5));
    if (a.abs().eq(1)) throw new Reject();
    const c = F(rng.nz(-8, 8));
    const q = F(rng.nz(-5, 5));
    const p = a.mul(q).add(c);
    return {
      cognitive: 'problemSolving',
      stem: `${m(`f(x) = ax ${signedTex(c)}`)} and ${m(`f^{-1}(${p.tex()}) = ${q.tex()}`)}. Determine $a$.`,
      format: 'input',
      fields: [field({ kind: 'number', value: a.value, tex: a.tex(), exact: true }, 'a =')],
      hints: ['A point on the inverse gives a point on $f$ with the coordinates swapped.', `$f^{-1}(${p.tex()}) = ${q.tex()}$ means $f(${q.tex()}) = ${p.tex()}$.`, `${m(`a(${q.tex()}) ${signedTex(c)} = ${p.tex()}`)}`],
      solution: [
        { tex: `${m(`f(${q.tex()}) = ${p.tex()}`)}`, why: '$(p, q)$ on $f^{-1}$ means $(q, p)$ on $f$.' },
        { tex: `${m(`${q.tex()}a ${signedTex(c)} = ${p.tex()} \\Rightarrow a = ${a.tex()}`)}` },
      ],
    };
  },
};

const paramTwoPoints: Generator = {
  id: 'rf6-param-two-points',
  nodeId: 'RF6.params',
  title: 'Find a line from two points on its inverse',
  make(rng): Draft {
    const a = F(rng.nz(-4, 4));
    const b = F(rng.nz(-8, 8));
    const q1 = F(rng.nz(-4, 4));
    let q2 = F(rng.nz(-4, 4));
    if (q2.eq(q1)) q2 = q1.add(2);
    const p1 = a.mul(q1).add(b);
    const p2 = a.mul(q2).add(b);
    return {
      cognitive: 'problemSolving',
      stem: `The graph of the inverse of ${m('f(x) = ax + b')} passes through ${m(ptTex(p1, q1))} and ${m(ptTex(p2, q2))}. Determine $a$ and $b$.`,
      format: 'input',
      fields: [field({ kind: 'number', value: a.value, tex: a.tex(), exact: true }, 'a ='), field({ kind: 'number', value: b.value, tex: b.tex(), exact: true }, 'b =')],
      hints: ['Swap each point to get points on $f$.', `$f$ passes through ${m(ptTex(q1, p1))} and ${m(ptTex(q2, p2))}.`, 'Find the slope between them, then the intercept.'],
      solution: [
        { tex: `Points on $f$: ${m(ptTex(q1, p1))}, ${m(ptTex(q2, p2))}.` },
        { tex: `${m(`a = \\frac{${p2.tex()} - (${p1.tex()})}{${q2.tex()} - (${q1.tex()})} = ${a.tex()}`)}` },
        { tex: `${m(`b = ${p1.tex()} - (${a.tex()})(${q1.tex()}) = ${b.tex()}`)}` },
      ],
    };
  },
};

const paramQuadratic: Generator = {
  id: 'rf6-param-quadratic',
  nodeId: 'RF6.params',
  title: 'Find a stretch from a point on the inverse',
  make(rng): Draft {
    const a = F(rng.pick([2, 3, -2, -1, 4]));
    const c = F(rng.nz(-6, 6));
    const q = F(rng.int(1, 4));
    const p = a.mul(q.mul(q)).add(c);
    return {
      cognitive: 'problemSolving',
      stem: `${m(`f(x) = ax^2 ${signedTex(c)}`)}, $x \\ge 0$. The graph of ${m('f^{-1}')} passes through ${m(ptTex(p, q))}. Determine $a$.`,
      format: 'input',
      fields: [field({ kind: 'number', value: a.value, tex: a.tex(), exact: true }, 'a =')],
      hints: ['Swap the point to get a point on $f$.', `$f(${q.tex()}) = ${p.tex()}$.`, `${m(`a(${q.tex()})^2 ${signedTex(c)} = ${p.tex()}`)}`],
      solution: [
        { tex: `${m(ptTex(q, p))} is on $f$.`, why: 'Inverse points have swapped coordinates.' },
        { tex: `${m(`${q.mul(q).tex()}a ${signedTex(c)} = ${p.tex()} \\Rightarrow a = ${a.tex()}`)}` },
      ],
    };
  },
};

export const inverseGenerators: Generator[] = [yxPoint, yxDomainRange, yxInvariant, invLinear, invQuadratic, invEvaluate, restrictWhich, restrictedInverse, restrictedDR, paramSlope, paramTwoPoints, paramQuadratic];
