// RF1 operations on and compositions of functions
import { ALL, except, intersect, iv, intervalTex, setBuilderTex, type RealSet } from '../../check/realset';
import { field, m, mc, pkey } from '../../framework';
import { F, Frac, polyEval, polyTex, ptTex, shiftTex, signedTex } from '../../frac';
import type { Rng } from '../../rng';
import type { AnswerSpec, Draft, Generator, GraphSpec, Tier } from '../../types';
import { Reject } from '../../types';

type Poly = number[]; // highest power first

const randLinear = (rng: Rng, mMax = 4, cMax = 8): Poly => [rng.nz(-mMax, mMax), rng.int(-cMax, cMax)];
const randQuad = (rng: Rng): Poly => [rng.pick([1, -1, 2]), rng.int(-5, 5), rng.int(-6, 6)];
function addP(p: Poly, q: Poly, s = 1): Poly {
  const n = Math.max(p.length, q.length);
  const a = Array(n - p.length).fill(0).concat(p);
  const b = Array(n - q.length).fill(0).concat(q);
  const out = a.map((v, i) => v + s * b[i]);
  while (out.length > 1 && out[0] === 0) out.shift();
  return out;
}
function mulP(p: Poly, q: Poly): Poly {
  const out = Array(p.length + q.length - 1).fill(0);
  p.forEach((a, i) => q.forEach((b, j) => (out[i + j] += a * b)));
  return out;
}
/** p(q(x)) */
function composeP(p: Poly, q: Poly): Poly {
  let out: Poly = [0];
  for (const c of p) out = addP(mulP(out, q), [c]);
  return out;
}
const ev = (p: Poly, x: number) => polyEval(p)(x);
const tx = (p: Poly) => polyTex(p);
const exactNum = (v: Frac): AnswerSpec => ({ kind: 'number', value: v.value, tex: v.tex(), exact: true });

type Op = '+' | '-' | '\\cdot' | '/';
const OPS: Op[] = ['+', '-', '\\cdot', '/'];
const opName: Record<Op, string> = { '+': 'f + g', '-': 'f - g', '\\cdot': 'f \\cdot g', '/': '\\frac{f}{g}' };
const apply = (op: Op, a: Frac, b: Frac): Frac => (op === '+' ? a.add(b) : op === '-' ? a.sub(b) : op === '\\cdot' ? a.mul(b) : a.div(b));
const opLabel = (op: Op, at: string) => (op === '/' ? `\\left(\\frac{f}{g}\\right)(${at})` : `(${opName[op]})(${at})`);

/** Two lines through integer lattice points, for graph-based items. */
function twoLines(rng: Rng): [Poly, Poly] {
  for (;;) {
    const f: Poly = [rng.pick([1, -1, 2, -2, F(1, 2).value]), rng.int(-4, 4)];
    const g: Poly = [rng.pick([1, -1, 2, -2]), rng.int(-4, 4)];
    if (f[0] !== g[0] && Number.isInteger(f[1]) && Number.isInteger(g[1])) return [f, g];
  }
}
function linesGraph(f: Poly, g: Poly): GraphSpec {
  return {
    view: { x: [-6, 6], y: [-8, 8] },
    curves: [
      { fn: polyEval(f), role: 'image', label: 'y = f(x)' },
      { fn: polyEval(g), role: 'base', label: 'y = g(x)' },
    ],
  };
}

// ---------------------------------------------------------------- RF1.ops-eval

const evalEquations: Generator = {
  id: 'rf1-eval-equations',
  nodeId: 'RF1.ops-eval',
  title: 'Evaluate a combined function from equations',
  make(rng, tier): Draft {
    const f = tier === 1 ? randLinear(rng) : randQuad(rng);
    const g = randLinear(rng);
    const op = rng.pick(tier === 1 ? OPS.slice(0, 3) : OPS);
    const a = rng.int(-4, 4);
    const fa = F(ev(f, a));
    const ga = F(ev(g, a));
    if (op === '/' && ga.n === 0) throw new Reject();
    const val = apply(op, fa, ga);
    return {
      cognitive: 'procedural',
      stem: `${m(`f(x) = ${tx(f)}`)} and ${m(`g(x) = ${tx(g)}`)}. Determine ${m(opLabel(op, String(a)))}.`,
      format: 'input',
      fields: [field(exactNum(val), `${opLabel(op, String(a))} =`)],
      hints: ['Evaluate each function at the input first.', `${m(opLabel(op, 'a'))} means $f(a) ${op === '/' ? '\\div' : op} g(a)$.`, `${m(`f(${a}) = ${fa.tex()}`)}`],
      solution: [
        { tex: `${m(`f(${a}) = ${fa.tex()}`)}, ${m(`g(${a}) = ${ga.tex()}`)}.` },
        { tex: `${m(`${opLabel(op, String(a))} = ${fa.tex()} ${op === '/' ? '\\div' : op} ${ga.n < 0 ? `(${ga.tex()})` : ga.tex()} = ${val.tex()}`)}`, why: 'The operation is applied to the outputs, not to the input.' },
      ],
    };
  },
};

const evalTable: Generator = {
  id: 'rf1-eval-table',
  nodeId: 'RF1.ops-eval',
  title: 'Evaluate a combined function from a table',
  make(rng, tier): Draft {
    const xs = [-2, -1, 0, 1, 2, 3];
    const fv = xs.map(() => rng.int(-6, 6));
    const gv = xs.map(() => rng.nz(-6, 6));
    const op = rng.pick(tier === 1 ? OPS.slice(0, 2) : OPS);
    const i = rng.int(0, xs.length - 1);
    const swap = op === '/' && rng.chance(0.5);
    const val = swap ? F(gv[i]).div(F(fv[i] || 1)) : apply(op, F(fv[i]), F(gv[i]));
    if (swap && fv[i] === 0) throw new Reject();
    const label = swap ? `\\left(\\frac{g}{f}\\right)(${xs[i]})` : opLabel(op, String(xs[i]));
    return {
      cognitive: 'procedural',
      stem: `Use the table to determine ${m(label)}.`,
      table: { head: ['$x$', ...xs.map((x) => `$${x}$`)], rows: [['$f(x)$', ...fv.map((v) => `$${v}$`)], ['$g(x)$', ...gv.map((v) => `$${v}$`)]] },
      format: 'input',
      fields: [field(exactNum(val), `${label} =`)],
      hints: ['Find the column for the input.', 'Read $f$ and $g$ from that column, then combine them.', `At $x = ${xs[i]}$: $f = ${fv[i]}$, $g = ${gv[i]}$.`],
      solution: [
        { tex: `${m(`f(${xs[i]}) = ${fv[i]}`)}, ${m(`g(${xs[i]}) = ${gv[i]}`)}.` },
        { tex: `${m(`${label} = ${val.tex()}`)}`, why: swap ? 'The function on top of the fraction bar goes in the numerator: $\\frac{g(x)}{f(x)}$.' : undefined },
      ],
    };
  },
};

const evalGraph: Generator = {
  id: 'rf1-eval-graph',
  nodeId: 'RF1.ops-eval',
  title: 'Evaluate a combined function from graphs',
  make(rng, tier): Draft {
    const [f, g] = twoLines(rng);
    const op = rng.pick(tier === 1 ? OPS.slice(0, 2) : OPS.slice(0, 3));
    const a = rng.int(-3, 3);
    if (!Number.isInteger(ev(f, a)) || Math.abs(ev(f, a)) > 7 || Math.abs(ev(g, a)) > 7) throw new Reject();
    const fa = F(ev(f, a));
    const ga = F(ev(g, a));
    const val = apply(op, fa, ga);
    return {
      cognitive: 'procedural',
      stem: `The graphs of $y = f(x)$ and $y = g(x)$ are shown. Determine ${m(opLabel(op, String(a)))}.`,
      graph: { ...linesGraph(f, g), points: [{ x: a, y: fa.value, kind: 'key' }, { x: a, y: ga.value, kind: 'key' }] },
      format: 'input',
      fields: [field(exactNum(val), `${opLabel(op, String(a))} =`)],
      hints: ['Read both graphs at the same $x$-value.', `Go to $x = ${a}$ on each graph and read the $y$-values.`, `${m(`f(${a}) = ${fa.tex()}`)}`],
      solution: [
        { tex: `From the graphs: ${m(`f(${a}) = ${fa.tex()}`)}, ${m(`g(${a}) = ${ga.tex()}`)}.` },
        { tex: `${m(`${opLabel(op, String(a))} = ${val.tex()}`)}`, why: 'Combine the $y$-values; the $x$-value stays the same.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF1.ops-equation

const opsEquation: Generator = {
  id: 'rf1-ops-equation',
  nodeId: 'RF1.ops-equation',
  title: 'Equation of a sum, difference or product',
  make(rng, tier): Draft {
    const f = tier === 1 ? randLinear(rng) : randQuad(rng);
    const g = randLinear(rng);
    const op = rng.pick<Op>(tier === 1 ? ['+', '-'] : ['+', '-', '\\cdot']);
    const r = op === '+' ? addP(f, g) : op === '-' ? addP(f, g, -1) : mulP(f, g);
    const label = `(${opName[op]})(x)`;
    const direct = (x: number) => (op === '+' ? ev(f, x) + ev(g, x) : op === '-' ? ev(f, x) - ev(g, x) : ev(f, x) * ev(g, x));
    return {
      verify: () => [-3, -1, 0, 2, 4].every((x) => Math.abs(ev(r, x) - direct(x)) < 1e-9),
      cognitive: 'procedural',
      stem: `${m(`f(x) = ${tx(f)}`)} and ${m(`g(x) = ${tx(g)}`)}. Write ${m(label)} in simplified form.`,
      format: 'input',
      fields: [field({ kind: 'expr', tex: tx(r), variable: 'x', fn: polyEval(r), sample: [-5, 5] }, `${label} =`)],
      hints: [
        `${m(label)} means $f(x) ${op} g(x)$.`,
        op === '-' ? 'Put $g(x)$ in brackets so the subtraction reaches every term.' : op === '\\cdot' ? 'Multiply every term of $f$ by every term of $g$.' : 'Collect like terms.',
        `${m(`(${tx(f)}) ${op} (${tx(g)})`)}`,
      ],
      solution: [
        { tex: `${m(`${label} = (${tx(f)}) ${op} (${tx(g)})`)}`, why: op === '-' ? 'Brackets matter: the minus applies to every term of $g$.' : undefined },
        { tex: `${m(`= ${tx(r)}`)}` },
      ],
    };
  },
};

const quotientDomain: Generator = {
  id: 'rf1-quotient-domain',
  nodeId: 'RF1.ops-equation',
  title: 'Domain of a quotient',
  make(rng, tier): Draft {
    const p = rng.int(-5, 3);
    const useRoot = tier > 1;
    const r1 = rng.int(-6, 6);
    const r2 = tier === 3 ? rng.int(-6, 6) : null;
    if (r2 !== null && r2 === r1) throw new Reject();
    const fTex = useRoot ? `\\sqrt{${shiftTex(p)}}` : tx(randLinear(rng));
    const g: Poly = r2 === null ? [1, -r1] : mulP([1, -r1], [1, -r2]);
    const zeros = r2 === null ? [r1] : [r1, r2];
    let dom: RealSet = useRoot ? [iv(p, Infinity)] : ALL;
    dom = except(dom, zeros);
    if (useRoot && zeros.every((z) => z < p)) throw new Reject('zeros outside domain');
    return {
      cognitive: 'conceptual',
      stem: `${m(`f(x) = ${fTex}`)} and ${m(`g(x) = ${tx(g)}`)}. State the domain of ${m('\\left(\\frac{f}{g}\\right)(x)')}.`,
      format: 'input',
      fields: [field({ kind: 'interval', value: dom, tex: intervalTex(dom) }, '', 'Domain')],
      hints: [
        'Two things can restrict the domain: the domains of $f$ and $g$, and division by zero.',
        `${useRoot ? 'The radicand must be $\\ge 0$, and ' : ''}$g(x) \\ne 0$.`,
        `Solve ${m(`${tx(g)} = 0`)}${r2 !== null ? ' by factoring' : ''}.`,
      ],
      solution: [
        ...(useRoot ? [{ tex: `Domain of $f$: ${m(`x \\ge ${p}`)}.`, why: 'A square root needs a non-negative radicand.' }] : []),
        { tex: `${m(`g(x) = 0`)} when ${m(`x = ${zeros.join(', ')}`)}${r2 !== null ? `, since ${m(`${tx(g)} = (${shiftTex(r1)})(${shiftTex(r2!)})`)}` : ''}.`, why: 'You cannot divide by zero.' },
        { tex: `Domain: ${m(intervalTex(dom))}${setBuilderTex(dom) === intervalTex(dom) ? '' : `, or ${m(setBuilderTex(dom))}`}.` },
      ],
    };
  },
};

const sumDomain: Generator = {
  id: 'rf1-sum-domain',
  nodeId: 'RF1.ops-equation',
  title: 'Domain of a sum of radicals',
  make(rng, tier): Draft {
    const p = rng.int(-6, 2);
    const q = p + rng.int(2, 8);
    const kind = tier === 3 ? rng.pick(['rr', 'rq'] as const) : 'rr';
    const fTex = `\\sqrt{${shiftTex(p)}}`;
    let gTex: string;
    let dom: RealSet;
    if (kind === 'rr') {
      gTex = `\\sqrt{${q} - x}`;
      dom = intersect([iv(p, Infinity)], [iv(-Infinity, q)]);
    } else {
      gTex = `\\frac{1}{${shiftTex(q)}}`;
      dom = except([iv(p, Infinity)], [q]);
    }
    const op = rng.pick(['+', '-', '\\cdot'] as const);
    const opText = { '+': 'f + g', '-': 'f - g', '\\cdot': 'f \\cdot g' }[op];
    return {
      cognitive: 'conceptual',
      stem: `${m(`f(x) = ${fTex}`)} and ${m(`g(x) = ${gTex}`)}. State the domain of ${m(`(${opText})(x)`)}.`,
      format: 'input',
      fields: [field({ kind: 'interval', value: dom, tex: intervalTex(dom) }, '', 'Domain')],
      hints: ['A combined function is defined only where both $f$ and $g$ are defined.', 'Find each domain, then take the overlap.', `Domain of $f$: $x \\ge ${p}$.`],
      solution: [
        { tex: `Domain of $f$: ${m(`x \\ge ${p}`)}. Domain of $g$: ${m(kind === 'rr' ? `x \\le ${q}` : `x \\ne ${q}`)}.` },
        { tex: `Overlap: ${m(intervalTex(dom))}.`, why: 'To compute $f(x) ' + op + ' g(x)$ you need both values to exist.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF1.ops-graph

const graphSumEquation: Generator = {
  id: 'rf1-graph-sum-equation',
  nodeId: 'RF1.ops-graph',
  title: 'Equation of f ± g from graphs',
  make(rng): Draft {
    const [f, g] = twoLines(rng);
    if (!Number.isInteger(f[0])) throw new Reject();
    const op = rng.pick(['+', '-'] as const);
    const r = addP(f, g, op === '+' ? 1 : -1);
    return {
      cognitive: 'problemSolving',
      stem: `The graphs of $y = f(x)$ and $y = g(x)$ are lines. Write the equation of ${m(`y = (${op === '+' ? 'f + g' : 'f - g'})(x)`)}.`,
      graph: linesGraph(f, g),
      format: 'input',
      fields: [field({ kind: 'expr', tex: tx(r), variable: 'x', fn: polyEval(r), sample: [-5, 5] }, 'y =')],
      hints: ['Find each line\'s equation from its slope and $y$-intercept.', `Then ${op === '+' ? 'add' : 'subtract'} the equations.`, `${m(`f(x) = ${tx(f)}`)}`],
      solution: [
        { tex: `${m(`f(x) = ${tx(f)}`)} and ${m(`g(x) = ${tx(g)}`)}.`, why: 'Read the $y$-intercept and the rise over run for each line.' },
        { tex: `${m(`y = (${tx(f)}) ${op} (${tx(g)}) = ${tx(r)}`)}` },
      ],
    };
  },
};

const graphProductZeros: Generator = {
  id: 'rf1-graph-product-zeros',
  nodeId: 'RF1.ops-graph',
  title: 'Zeros of a product from graphs',
  make(rng): Draft {
    const z1 = rng.int(-5, 5);
    let z2 = rng.int(-5, 5);
    if (z2 === z1) z2 = z1 === 5 ? -2 : z1 + 2;
    const f: Poly = [rng.pick([1, -1, 2]), 0];
    f[1] = -f[0] * z1;
    const g: Poly = [rng.pick([1, -1, -2]), 0];
    g[1] = -g[0] * z2;
    return {
      cognitive: 'conceptual',
      stem: `Using the graphs of $y = f(x)$ and $y = g(x)$, determine the zeros of ${m('y = (f \\cdot g)(x)')}.`,
      graph: linesGraph(f, g),
      format: 'input',
      fields: [field({ kind: 'set', values: [z1, z2], tex: `${z1}, ${z2}` }, 'x =', 'Zeros, separated by commas')],
      hints: ['A product is zero when either factor is zero.', 'So the zeros of $f \\cdot g$ are the zeros of $f$ together with the zeros of $g$.', 'Where does each line cross the $x$-axis?'],
      solution: [
        { tex: `$f$ has a zero at $x = ${z1}$; $g$ has a zero at $x = ${z2}$.` },
        { tex: `Zeros of $f \\cdot g$: ${m(`x = ${z1}, ${z2}`)}.`, why: '$f(x) \\cdot g(x) = 0$ exactly when $f(x) = 0$ or $g(x) = 0$.' },
      ],
    };
  },
};

const graphWhichPoint: Generator = {
  id: 'rf1-graph-which-point',
  nodeId: 'RF1.ops-graph',
  title: 'Which point is on the combined graph?',
  make(rng): Draft {
    const [f, g] = twoLines(rng);
    const a = rng.nz(-3, 3);
    const fa = ev(f, a);
    const ga = ev(g, a);
    if (!Number.isInteger(fa) || Math.abs(fa) > 7 || Math.abs(ga) > 7) throw new Reject();
    const op = rng.pick(['+', '-'] as const);
    const y = op === '+' ? fa + ga : fa - ga;
    const P = (x: number, yy: number) => ({ tex: m(ptTex(x, yy)), key: pkey(x, yy) });
    return {
      cognitive: 'conceptual',
      stem: `Using the graphs, which point is on the graph of ${m(`y = (${op === '+' ? 'f + g' : 'f - g'})(x)`)}?`,
      graph: linesGraph(f, g),
      format: 'mc',
      choices: mc(P(a, y), [
        { ...P(2 * a, y), mis: 'ops-graph-add-x', feedback: 'Only $y$-values are combined; $x$ stays the same.' },
        { ...P(a, fa * ga), mis: 'ops-product-vs-sum' },
        { ...P(a, op === '+' ? fa - ga : fa + ga), mis: 'ops-product-vs-sum' },
        { ...P(a, ga - fa), mis: 'ops-quotient-order' },
      ]),
      hints: ['Pick an $x$-value and read both graphs there.', `At $x = ${a}$, read $f(${a})$ and $g(${a})$.`, `${m(`f(${a}) = ${fa}`)}, ${m(`g(${a}) = ${ga}`)}.`],
      solution: [
        { tex: `At $x = ${a}$: ${m(`f(${a}) = ${fa}`)}, ${m(`g(${a}) = ${ga}`)}.` },
        { tex: `${m(`(${op === '+' ? 'f + g' : 'f - g'})(${a}) = ${y}`)}, so ${m(ptTex(a, y))} is on the graph.` },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF1.compose-eval

const composeEquations: Generator = {
  id: 'rf1-compose-equations',
  nodeId: 'RF1.compose-eval',
  title: 'Evaluate a composition from equations',
  make(rng, tier): Draft {
    const f = tier === 1 ? randLinear(rng) : randQuad(rng);
    const g = randLinear(rng, 3, 5);
    const outer = rng.chance(0.5) ? 'f' : 'g';
    const [O, I] = outer === 'f' ? [f, g] : [g, f];
    const inner = outer === 'f' ? 'g' : 'f';
    const a = rng.int(-3, 3);
    const ia = ev(I, a);
    const val = ev(O, ia);
    const label = rng.chance(0.5) ? `${outer}(${inner}(${a}))` : `(${outer} \\circ ${inner})(${a})`;
    const stem = `${m(`f(x) = ${tx(f)}`)} and ${m(`g(x) = ${tx(g)}`)}. Determine ${m(label)}.`;
    const hints: [string, string, string] = ['Work from the inside out.', `First find ${m(`${inner}(${a})`)}, then put that result into $${outer}$.`, `${m(`${inner}(${a}) = ${ia}`)}`];
    const solution = [
      { tex: `${m(`${inner}(${a}) = ${ia}`)}`, why: `In $${outer}(${inner}(x))$ the inner function $${inner}$ acts first.` },
      { tex: `${m(`${outer}(${ia}) = ${val}`)}` },
    ];
    if (tier === 1) {
      const rev = ev(I, ev(O, a));
      return {
        cognitive: 'procedural',
        stem,
        format: 'mc',
        choices: mc({ tex: m(String(val)), key: val }, [
          { tex: m(String(rev)), key: rev, mis: 'ops-compose-order', feedback: `That is $${inner}(${outer}(${a}))$.` },
          { tex: m(String(ev(O, a) * ia)), key: ev(O, a) * ia, mis: 'ops-compose-multiply' },
          { tex: m(String(ev(O, a) + ia)), key: ev(O, a) + ia, mis: 'ops-product-vs-sum' },
          { tex: m(String(ev(O, a))), key: ev(O, a), mis: 'ops-compose-order', feedback: `That is just $${outer}(${a})$.` },
        ]),
        hints,
        solution,
      };
    }
    return { cognitive: 'procedural', stem, format: 'input', fields: [field(exactNum(F(val)), `${label} =`)], hints, solution };
  },
};

const composeTable: Generator = {
  id: 'rf1-compose-table',
  nodeId: 'RF1.compose-eval',
  title: 'Evaluate a composition from a table',
  make(rng): Draft {
    const xs = [-2, -1, 0, 1, 2, 3];
    const fv = xs.map(() => rng.pick(xs));
    const gv = xs.map(() => rng.pick(xs));
    const outer = rng.pick(['f', 'g'] as const);
    const [O, I] = outer === 'f' ? [fv, gv] : [gv, fv];
    const inner = outer === 'f' ? 'g' : 'f';
    const i = rng.int(0, 5);
    const mid = I[i];
    const val = O[xs.indexOf(mid)];
    return {
      cognitive: 'procedural',
      stem: `Use the table to determine ${m(`${outer}(${inner}(${xs[i]}))`)}.`,
      table: { head: ['$x$', ...xs.map((x) => `$${x}$`)], rows: [['$f(x)$', ...fv.map((v) => `$${v}$`)], ['$g(x)$', ...gv.map((v) => `$${v}$`)]] },
      format: 'input',
      fields: [field(exactNum(F(val)), `${outer}(${inner}(${xs[i]})) =`)],
      hints: ['Inside first.', `Find ${m(`${inner}(${xs[i]})`)} in the table.`, `${m(`${inner}(${xs[i]}) = ${mid}`)}; now look up $${outer}(${mid})$.`],
      solution: [
        { tex: `${m(`${inner}(${xs[i]}) = ${mid}`)}` },
        { tex: `${m(`${outer}(${mid}) = ${val}`)}`, why: 'The output of the inner function becomes the input of the outer one; find that $x$ in the top row.' },
      ],
    };
  },
};

const composeGraph: Generator = {
  id: 'rf1-compose-graph',
  nodeId: 'RF1.compose-eval',
  title: 'Evaluate a composition from graphs',
  make(rng): Draft {
    const [f, g] = twoLines(rng);
    const a = rng.int(-3, 3);
    const ga = ev(g, a);
    const val = ev(f, ga);
    if (!Number.isInteger(ga) || Math.abs(ga) > 5 || !Number.isInteger(val) || Math.abs(val) > 8) throw new Reject();
    return {
      cognitive: 'problemSolving',
      stem: `Using the graphs, determine ${m(`(f \\circ g)(${a})`)}.`,
      graph: linesGraph(f, g),
      format: 'input',
      fields: [field(exactNum(F(val)), `(f \\circ g)(${a}) =`)],
      hints: ['$(f \\circ g)(a) = f(g(a))$.', `Read $g(${a})$ from the graph of $g$ first.`, `${m(`g(${a}) = ${ga}`)}; now read $f(${ga})$.`],
      solution: [
        { tex: `${m(`g(${a}) = ${ga}`)}`, why: 'The circle means: apply $g$ first, then $f$.' },
        { tex: `${m(`f(${ga}) = ${val}`)}` },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF1.compose-equation

const composeEquation: Generator = {
  id: 'rf1-compose-equation',
  nodeId: 'RF1.compose-equation',
  title: 'Equation of a composition',
  make(rng, tier): Draft {
    const f = tier === 1 ? randLinear(rng) : randQuad(rng);
    const g = randLinear(rng, 3, 5);
    const outer = tier === 3 ? rng.pick(['f', 'g'] as const) : 'f';
    const [O, I] = outer === 'f' ? [f, g] : [g, f];
    const inner = outer === 'f' ? 'g' : 'f';
    const r = composeP(O, I);
    return {
      verify: () => [-3, -1, 0, 2, 4].every((x) => Math.abs(ev(r, x) - ev(O, ev(I, x))) < 1e-9),
      cognitive: 'procedural',
      stem: `${m(`f(x) = ${tx(f)}`)} and ${m(`g(x) = ${tx(g)}`)}. Write ${m(`${outer}(${inner}(x))`)} in simplified form.`,
      format: 'input',
      fields: [field({ kind: 'expr', tex: tx(r), variable: 'x', fn: polyEval(r), sample: [-5, 5] }, `${outer}(${inner}(x)) =`)],
      hints: [
        `Replace every $x$ in $${outer}(x)$ with the whole expression for $${inner}(x)$.`,
        'Use brackets around the substituted expression, then expand.',
        `${m(`${outer}(${inner}(x)) = ${tx(O).replace(/x/g, `(${tx(I)})`)}`)}`,
      ],
      solution: [
        { tex: `${m(`${outer}(${inner}(x)) = ${tx(O).replace(/x/g, `(${tx(I)})`)}`)}`, why: `$${inner}(x)$ is the input to $${outer}$.` },
        { tex: `${m(`= ${tx(r)}`)}` },
      ],
    };
  },
};

const composeDomain: Generator = {
  id: 'rf1-compose-domain',
  nodeId: 'RF1.compose-equation',
  title: 'Domain of a composition',
  make(rng, tier): Draft {
    const kind = rng.pick(tier === 1 ? (['root-of-linear', 'recip-of-linear'] as const) : (['root-of-linear', 'recip-of-linear', 'square-of-root'] as const));
    const c = rng.nz(-6, 6);
    const mm = rng.pick([1, 2, -1, 3, -2]);
    let f: string, g: string, label: string, dom: RealSet, simplified: string | null = null, steps: string;
    if (kind === 'root-of-linear') {
      f = '\\sqrt{x}';
      g = tx([mm, c]);
      label = 'f(g(x))';
      const z = F(-c, mm);
      dom = mm > 0 ? [iv(z.value, Infinity)] : [iv(-Infinity, z.value)];
      steps = `${m(`f(g(x)) = \\sqrt{${g}}`)}; need ${m(`${g} \\ge 0`)}.`;
    } else if (kind === 'recip-of-linear') {
      f = '\\frac{1}{x}';
      g = tx([mm, c]);
      label = 'f(g(x))';
      const z = F(-c, mm);
      dom = except(ALL, [z.value]);
      steps = `${m(`f(g(x)) = \\frac{1}{${g}}`)}; need ${m(`${g} \\ne 0`)}.`;
    } else {
      f = '\\sqrt{x}';
      g = `x^2 ${signedTex(c)}`;
      label = 'g(f(x))';
      dom = [iv(0, Infinity)];
      simplified = `x ${signedTex(c)}`;
      steps = `${m(`g(f(x)) = (\\sqrt{x})^2 ${signedTex(c)} = ${simplified}`)}, but $f(x) = \\sqrt{x}$ must exist first.`;
    }
    return {
      cognitive: 'conceptual',
      stem: `${m(`f(x) = ${f}`)} and ${m(`g(x) = ${g}`)}. State the domain of ${m(label)}.`,
      format: 'input',
      fields: [field({ kind: 'interval', value: dom, tex: intervalTex(dom) }, '', 'Domain')],
      hints: [
        'The input must be allowed in the inner function, and the inner output must be allowed in the outer function.',
        simplified ? 'Simplifying can hide a restriction. Check the inner function first.' : 'Write the composition, then find where it is defined.',
        steps,
      ],
      solution: [
        { tex: steps, why: simplified ? 'The simplified formula looks defined everywhere, but $x < 0$ never gets past $\\sqrt{x}$.' : undefined },
        { tex: `Domain: ${m(intervalTex(dom))}.` },
      ],
    };
  },
};

const composeParam: Generator = {
  id: 'rf1-compose-param',
  nodeId: 'RF1.compose-equation',
  title: 'Find a parameter in a composition',
  make(rng): Draft {
    const a = rng.nz(-5, 5);
    const b = rng.nz(-6, 6);
    const g: Poly = [1, 0, rng.int(-5, 3)];
    const x0 = rng.int(-3, 3);
    const gx = ev(g, x0);
    if (gx === 0) throw new Reject();
    const val = a * gx + b;
    return {
      cognitive: 'problemSolving',
      stem: `${m(`f(x) = ax ${signedTex(b)}`)} and ${m(`g(x) = ${tx(g)}`)}. If ${m(`f(g(${x0})) = ${val}`)}, determine $a$.`,
      format: 'input',
      fields: [field(exactNum(F(a)), 'a =')],
      hints: ['Evaluate the inner function first.', `${m(`g(${x0}) = ${gx}`)}`, `${m(`f(${gx}) = ${gx}a ${signedTex(b)} = ${val}`)}`],
      solution: [
        { tex: `${m(`g(${x0}) = ${gx}`)}` },
        { tex: `${m(`f(${gx}) = ${gx}a ${signedTex(b)} = ${val}`)}`, why: 'Substitute the inner output into $f$.' },
        { tex: `${m(`a = ${a}`)}` },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF1.decompose

const decomposeWhich: Generator = {
  id: 'rf1-decompose-which',
  nodeId: 'RF1.decompose',
  title: 'Identify a composition',
  make(rng): Draft {
    const mm = rng.pick([2, 3, -2, 4]);
    const c = rng.nz(-5, 5);
    const lin = tx([mm, c]);
    const fx = '\\sqrt{x}';
    const kx = 'x^2';
    const target = rng.pick(['f(g(x))', 'g(f(x))', 'k(g(x))', 'g(k(x))'] as const);
    const hTex = { 'f(g(x))': `\\sqrt{${lin}}`, 'g(f(x))': `${mm}\\sqrt{x}${signedTex(c)}`, 'k(g(x))': `\\left(${lin}\\right)^2`, 'g(k(x))': `${mm}x^2${signedTex(c)}` }[target];
    const swap = { 'f(g(x))': 'g(f(x))', 'g(f(x))': 'f(g(x))', 'k(g(x))': 'g(k(x))', 'g(k(x))': 'k(g(x))' }[target];
    const prod = target.startsWith('f') || target.startsWith('g(f') ? 'f(x) \\cdot g(x)' : 'k(x) \\cdot g(x)';
    const other = target.includes('k') ? 'f(g(x))' : 'k(g(x))';
    return {
      cognitive: 'conceptual',
      stem: `${m(`f(x) = ${fx}`)}, ${m(`g(x) = ${lin}`)} and ${m(`k(x) = ${kx}`)}. Which expression equals ${m(`h(x) = ${hTex}`)}?`,
      format: 'mc',
      choices: mc({ tex: m(target), key: target }, [
        { tex: m(swap), key: swap, mis: 'ops-compose-order' },
        { tex: m(prod), key: prod, mis: 'ops-compose-multiply' },
        { tex: m(other), key: other, mis: 'ops-compose-order' },
      ]),
      hints: ['Ask: what is done to $x$ first?', 'The first operation applied to $x$ is the inner function.', `In $${hTex}$, look at what happens to $x$ before anything else.`],
      solution: [
        { tex: `${m(`h(x) = ${hTex}`)}: the ${target.slice(2, 3) === 'g' ? 'linear expression' : target.slice(2, 3) === 'f' ? 'square root' : 'square'} is applied to $x$ first.` },
        { tex: `So ${m(`h(x) = ${target}`)}.`, why: 'The inner function is the one applied first.' },
      ],
    };
  },
};

const decomposeOuter: Generator = {
  id: 'rf1-decompose-outer',
  nodeId: 'RF1.decompose',
  title: 'Find the outer function',
  make(rng): Draft {
    const mm = rng.pick([2, 3, -1, -2]);
    const c = rng.nz(-5, 5);
    const d = rng.nz(-6, 6);
    const lin = tx([mm, c]);
    const kind = rng.pick(['sq', 'root'] as const);
    const h = kind === 'sq' ? `\\left(${lin}\\right)^2 ${signedTex(d)}` : `${d < 0 ? '-' : ''}${Math.abs(d) === 1 ? '' : Math.abs(d)}\\sqrt{${lin}}`;
    const fTex = kind === 'sq' ? `x^2 ${signedTex(d)}` : `${d < 0 ? '-' : ''}${Math.abs(d) === 1 ? '' : Math.abs(d)}\\sqrt{x}`;
    const fn = kind === 'sq' ? (x: number) => x * x + d : (x: number) => d * Math.sqrt(x);
    return {
      cognitive: 'problemSolving',
      stem: `${m(`h(x) = f(g(x))`)} where ${m(`g(x) = ${lin}`)} and ${m(`h(x) = ${h}`)}. Determine $f(x)$.`,
      format: 'input',
      fields: [field({ kind: 'expr', tex: fTex, variable: 'x', fn, sample: kind === 'sq' ? [-5, 5] : [0, 12] }, 'f(x) =')],
      hints: ['$f$ is what is done to $g(x)$.', `Replace $${lin}$ in $h(x)$ with a single $x$.`, `$h(x) = f(\\text{something})$, where the something is $${lin}$.`],
      solution: [{ tex: `Wherever $${lin}$ appears in $h$, write $x$: ${m(`f(x) = ${fTex}`)}.`, why: `Check: $f(g(x)) = ${h}$.` }],
    };
  },
};

const decomposeThree: Generator = {
  id: 'rf1-decompose-three',
  nodeId: 'RF1.decompose',
  title: 'Product and quotient of three functions',
  make(rng): Draft {
    const p = rng.nz(-5, 5);
    let q = rng.nz(-5, 5);
    if (q === p || q === -p) q = p + 3 || 4;
    const f = shiftTex(p);
    const g = shiftTex(q);
    const prod = polyTex(mulP([1, -p], [1, -q]));
    return {
      cognitive: 'conceptual',
      stem: `${m(`f(x) = ${f}`)}, ${m(`g(x) = ${g}`)} and ${m(`k(x) = \\sqrt{x}`)}. Which expression equals ${m(`h(x) = \\frac{${prod}}{\\sqrt{x}}`)}?`,
      format: 'mc',
      choices: mc({ tex: m('\\frac{f(x) \\cdot g(x)}{k(x)}'), key: 'r' }, [
        { tex: m('\\frac{k(x)}{f(x) \\cdot g(x)}'), key: 'inv', mis: 'ops-quotient-order' },
        { tex: m('\\frac{f(g(x))}{k(x)}'), key: 'comp', mis: 'ops-compose-multiply' },
        { tex: m('\\frac{f(x) + g(x)}{k(x)}'), key: 'sum', mis: 'ops-product-vs-sum' },
      ]),
      hints: ['Factor the numerator.', `${m(`${prod} = (${f})(${g})`)}`, 'Match each factor to a given function.'],
      solution: [
        { tex: `${m(`h(x) = \\frac{(${f})(${g})}{\\sqrt{x}}`)}`, why: 'Factoring shows the numerator is a product.' },
        { tex: `${m(`= \\frac{f(x) \\cdot g(x)}{k(x)}`)}` },
      ],
    };
  },
};

export const opsGenerators: Generator[] = [evalEquations, evalTable, evalGraph, opsEquation, quotientDomain, sumDomain, graphSumEquation, graphProductZeros, graphWhichPoint, composeEquations, composeTable, composeGraph, composeEquation, composeDomain, composeParam, decomposeWhich, decomposeOuter, decomposeThree];

export type { Tier };
