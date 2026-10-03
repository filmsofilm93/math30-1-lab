// RF8 laws of logarithms, RF10 exponential and logarithmic equations and applications.
import { field, m, mc } from '../../framework';
import { F, Frac } from '../../frac';
import type { AnswerSpec, Draft, Generator } from '../../types';
import { Reject } from '../../types';
import { num, setAns, solutionText } from '../pre/shared';
import { log, logB, nearBoundary, powFrac, rounded } from './shared';

type R = Parameters<Generator['make']>[0];

/** "p" as a log coefficient: 1 → '', 1/2 → \frac{1}{2}. */
const coefT = (c: Frac) => (c.eq(1) ? '' : c.eq(-1) ? '-' : c.tex());
/** x^p, with p = 1 → x. */
const pw = (v: string, p: number) => (p === 1 ? v : `${v}^{${p}}`);
/** Signed sum of tex terms: first keeps its sign, later ones get " + " / " - ". */
function sumTex(terms: { c: Frac; t: string }[]): string {
  return terms
    .map(({ c, t }, i) => {
      const neg = c.value < 0;
      const a = neg ? c.neg() : c;
      const body = `${a.eq(1) ? '' : a.tex()}${t}`;
      return i === 0 ? (neg ? `-${body}` : body) : `${neg ? ' - ' : ' + '}${body}`;
    })
    .join('');
}
/** Number of decimals that keeps a rounded answer honest. */
const roundedOk = (v: number, places: 1 | 2) => {
  if (nearBoundary(v, places) || !Number.isFinite(v)) throw new Reject();
  return rounded(v, places);
};
/** Dollar amount as inline math (Rich has no escape for a literal dollar sign). */
const money = (v: number) => m(`\\text{\\textdollar}${v.toFixed(Number.isInteger(v) ? 0 : 2).replace(/\B(?=(\d{3})+(?!\d))/g, '{,}')}`);

/** (x − z), or x for z = 0. */
const fac = (z: number) => (z === 0 ? 'x' : `(x ${z > 0 ? '-' : '+'} ${Math.abs(z)})`);

// ---------------------------------------------------------------- RF8.expand

/** log_b(x^p y^q / z^r), optionally under a square root at tier 3. */
function expandParams(rng: R, tier: number) {
  const b = rng.pick([2, 3, 5, 10]);
  const p = rng.int(1, tier === 1 ? 2 : 4);
  const q = rng.int(1, 3);
  const r = rng.int(1, 3);
  const root = tier === 3;
  const useY = tier > 1 || rng.chance(0.5);
  const num_ = `${pw('x', p)}${useY ? pw('y', q) : ''}`;
  const inner = `\\frac{${num_}}{${pw('z', r)}}`;
  const arg = root ? `\\sqrt{${inner}}` : `\\left(${inner}\\right)`;
  const k = root ? F(1, 2) : F(1);
  const cs = { x: k.mul(F(p)), y: useY ? k.mul(F(q)) : F(0), z: k.mul(F(-r)) };
  const L = logB(b);
  const correct = sumTex([
    { c: cs.x, t: `${L} x` },
    ...(useY ? [{ c: cs.y, t: `${L} y` }] : []),
    { c: cs.z, t: `${L} z` },
  ]);
  return { b, p, q, r, root, useY, arg, cs, L, correct, num_ };
}

const expandMc: Generator = {
  id: 'u3-expand-mc',
  nodeId: 'RF8.expand',
  title: 'Expand a logarithm',
  make(rng, tier): Draft {
    const e = expandParams(rng, tier);
    const { L, p, q, r, useY, cs } = e;
    const ySum = useY ? ` + ${coefT(cs.y)}${L} y` : '';
    return {
      cognitive: 'procedural',
      stem: `Which expression is equivalent to ${m(`${L} ${e.arg}`)}?`,
      format: 'mc',
      choices: mc({ tex: m(e.correct), key: 'ok' }, [
        { tex: m(`${coefT(cs.x)}${L} x${ySum} + ${coefT(cs.z.neg())}${L} z`), key: 'sign', mis: 'log-quotient-divide', feedback: 'Division gives subtraction: $\\log_b \\frac{M}{N} = \\log_b M - \\log_b N$.' },
        { tex: m(`\\frac{${coefT(cs.x)}${L} x${ySum}}{${coefT(cs.z.neg())}${L} z}`), key: 'div', mis: 'log-quotient-divide' },
        { tex: m(`${e.root ? '\\frac{1}{2}' : ''}\\left(${L} x\\right)^{${p}}${useY ? ` + ${e.root ? '\\frac{1}{2}' : ''}\\left(${L} y\\right)^{${q}}` : ''} - ${e.root ? '\\frac{1}{2}' : ''}\\left(${L} z\\right)^{${r}}`), key: 'pow', mis: 'log-power-wrong-place', feedback: '$\\log_b x^p = p\\log_b x$: the exponent comes out front as a coefficient.' },
        ...(e.root ? [{ tex: m(`2${L} x${useY ? ` + 2${L} y` : ''} - 2${L} z`), key: 'half', mis: 'log-power-wrong-place', feedback: '$\\sqrt{A} = A^{1/2}$, so the coefficient is $\\frac{1}{2}$.' }] : []),
      ]),
      hints: ['Quotient law first: numerator minus denominator.', 'Then product law: a product inside becomes a sum.', `Then power law: ${m('\\log_b x^p = p\\log_b x')}${e.root ? '; $\\sqrt{A} = A^{1/2}$' : ''}.`],
      solution: [
        { tex: m(`${L} ${e.arg} = ${e.root ? '\\frac{1}{2}\\left(' : ''}${L} ${e.num_ === pw('x', p) ? pw('x', p) : `\\left(${e.num_}\\right)`} - ${L} ${pw('z', r)}${e.root ? '\\right)' : ''}`), why: 'Quotient law' + (e.root ? ', with $\\sqrt{A} = A^{1/2}$ brought out by the power law.' : '.') },
        { tex: m(`= ${e.correct}`), why: 'Product law, then power law on each term.' },
      ],
    };
  },
};

const expandCoeff: Generator = {
  id: 'u3-expand-coeff',
  nodeId: 'RF8.expand',
  title: 'Expansion coefficients',
  make(rng, tier): Draft {
    const e = expandParams(rng, Math.max(tier, 2));
    const { L, cs } = e;
    return {
      cognitive: 'procedural',
      stem: `${m(`${L} ${e.arg} = a${L} x + b${L} y + c${L} z`)}. Find ${m('a')}, ${m('b')} and ${m('c')}.`,
      format: 'input',
      fields: [field(num(cs.x), 'a ='), field(num(cs.y), 'b ='), field(num(cs.z), 'c =')],
      hints: ['Each exponent becomes a coefficient.', 'Factors in the denominator get a negative coefficient.', e.root ? 'The square root halves every coefficient.' : `${m('x')} has exponent ${m(String(e.p))}.`],
      solution: [{ tex: m(`${L} ${e.arg} = ${e.correct}`), why: 'Quotient, product and power laws.' }, { tex: `${m(`a = ${cs.x.tex()}`)}, ${m(`b = ${cs.y.tex()}`)}, ${m(`c = ${cs.z.tex()}`)}.` }],
    };
  },
};

const expandEval: Generator = {
  id: 'u3-expand-eval',
  nodeId: 'RF8.expand',
  title: 'Evaluate using log laws',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 5]);
    const P = rng.nz(-4, 6);
    const Q = rng.nz(-4, 6);
    const p = rng.int(1, 3);
    const q = rng.int(1, 3);
    const k = tier === 1 ? 0 : rng.int(1, 3); // factor b^k inside
    const root = tier === 3;
    const inner = `\\frac{${k ? `${b ** k}` : ''}${pw('x', p)}}{${pw('y', q)}}`;
    const arg = root ? `\\sqrt{${inner}}` : `\\left(${inner}\\right)`;
    const total = F(k + p * P - q * Q).mul(root ? F(1, 2) : F(1));
    const L = logB(b);
    return {
      cognitive: 'procedural',
      stem: `Given ${m(`${L} x = ${P}`)} and ${m(`${L} y = ${Q}`)}, evaluate ${m(`${L} ${arg}`)}.`,
      format: 'input',
      fields: [field(num(total), '')],
      hints: ['Expand first, then substitute.', `${m(`${L} ${arg} = ${root ? '\\frac{1}{2}(' : ''}${k ? `${L} ${b ** k} + ` : ''}${p === 1 ? '' : p}${L} x - ${q === 1 ? '' : q}${L} y${root ? ')' : ''}`)}.`, k ? `${m(`${L} ${b ** k} = ${k}`)}.` : 'Substitute the given values.'],
      solution: [
        { tex: m(`${L} ${arg} = ${root ? '\\frac{1}{2}\\left(' : ''}${k ? `${L} ${b ** k} + ` : ''}${p === 1 ? '' : p}${L} x - ${q === 1 ? '' : q}${L} y${root ? '\\right)' : ''}`), why: 'Log laws.' },
        { tex: m(`= ${root ? '\\frac{1}{2}\\left(' : ''}${k ? `${k} + ` : ''}${p === 1 ? '' : `${p}`}(${P}) - ${q === 1 ? '' : q}(${Q})${root ? '\\right)' : ''} = ${total.tex()}`) },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF8.condense

function condenseParams(rng: R, tier: number) {
  const b = rng.pick([2, 3, 5, 10]);
  const c = rng.int(1, 5);
  const p = tier === 1 ? 1 : rng.int(2, 3);
  const kk = tier === 3 ? rng.pick([2, 3, 5, 7]) : 0; // − log_b k
  const half = tier === 3;
  const L = logB(b);
  const terms = `${p === 1 ? '' : p}${L} x + ${half ? '\\frac{1}{2}' : ''}${L} (x + ${c})${kk ? ` - ${L} ${kk}` : ''}`;
  const top = `${pw('x', p)}${half ? `\\sqrt{x + ${c}}` : `(x + ${c})`}`;
  const ans = kk ? `${L} \\left(\\frac{${top}}{${kk}}\\right)` : `${L} \\left(${top}\\right)`;
  const fn = (x: number) => log(b, (x ** p * (half ? Math.sqrt(x + c) : x + c)) / (kk || 1));
  return { b, c, p, kk, half, L, terms, top, ans, fn };
}

const condenseInput: Generator = {
  id: 'u3-condense-input',
  nodeId: 'RF8.condense',
  title: 'Write as a single logarithm',
  make(rng, tier): Draft {
    const e = condenseParams(rng, tier);
    const spec: AnswerSpec = { kind: 'expr', tex: e.ans, variable: 'x', fn: e.fn, sample: [1, 5], exact: true, form: 'single-log' };
    return {
      cognitive: 'procedural',
      stem: `Write ${m(e.terms)} as a single logarithm.`,
      format: 'input',
      fields: [field(spec, '')],
      hints: ['Power law first: move each coefficient up as an exponent.', 'Then combine: sums multiply, differences divide.', e.half ? `${m('\\frac{1}{2}\\log_b A = \\log_b \\sqrt{A}')}.` : `${m(`${e.p === 1 ? '' : e.p}${e.L} x = ${e.L} ${pw('x', e.p)}`)}.`],
      solution: [
        ...(e.p === 1 && !e.half ? [] : [{ tex: m(`${e.L} ${pw('x', e.p)} + ${e.L} ${e.half ? `\\sqrt{x + ${e.c}}` : `(x + ${e.c})`}${e.kk ? ` - ${e.L} ${e.kk}` : ''}`), why: 'Power law: coefficients become exponents.' }]),
        { tex: m(`= ${e.ans}`), why: e.kk ? 'Product law for the sum, quotient law for the difference.' : 'Product law.' },
      ],
      verify: () => Math.abs(e.fn(2) - ((e.p * log(e.b, 2) + (e.half ? 0.5 : 1) * log(e.b, 2 + e.c) - (e.kk ? log(e.b, e.kk) : 0)))) < 1e-9,
    };
  },
};

const condenseMc: Generator = {
  id: 'u3-condense-mc',
  nodeId: 'RF8.condense',
  title: 'Choose the single logarithm',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 7, 10]);
    const L = logB(b);
    const p = rng.int(2, 3);
    const q = tier === 1 ? 1 : rng.int(2, 4);
    const sub = tier === 3;
    // p log M ± q log N with M = x, N = y
    const terms = `${p}${L} x ${sub ? '-' : '+'} ${q === 1 ? '' : q}${L} y`;
    const right = sub ? `${L} \\left(\\frac{${pw('x', p)}}{${pw('y', q)}}\\right)` : `${L} \\left(${pw('x', p)}${pw('y', q)}\\right)`;
    return {
      cognitive: 'procedural',
      stem: `Which single logarithm is equivalent to ${m(terms)}?`,
      format: 'mc',
      choices: mc({ tex: m(right), key: 'ok' }, [
        { tex: m(sub ? `${L} \\left(\\frac{${p}x}{${q === 1 ? '' : q}y}\\right)` : `${L} \\left(${p * q === p ? `${p}xy` : `${p * q}xy`}\\right)`), key: 'coef', mis: 'log-condense-coefficient', feedback: 'A coefficient becomes an exponent, not a factor: $p\\log_b x = \\log_b x^p$.' },
        { tex: m(sub ? `\\frac{${L} ${pw('x', p)}}{${L} ${pw('y', q)}}` : `${L} \\left(${pw('x', p)} + ${pw('y', q)}\\right)`), key: 'law', mis: sub ? 'log-quotient-divide' : 'log-product-sum' },
        { tex: m(sub ? `${L} \\left(${pw('x', p)} - ${pw('y', q)}\\right)` : `${L} \\left(${pw('x', p + q)}\\right)`), key: 'other', mis: sub ? 'log-quotient-divide' : 'log-product-sum' },
      ]),
      hints: ['Power law: $p\\log_b x = \\log_b x^p$.', sub ? 'Difference of logs: quotient inside.' : 'Sum of logs: product inside.', `First step: ${m(`${L} ${pw('x', p)} ${sub ? '-' : '+'} ${L} ${pw('y', q)}`)}.`],
      solution: [
        { tex: m(`${terms} = ${L} ${pw('x', p)} ${sub ? '-' : '+'} ${L} ${pw('y', q)}`), why: 'Power law.' },
        { tex: m(`= ${right}`), why: sub ? 'Quotient law.' : 'Product law.' },
      ],
    };
  },
};

const condenseEval: Generator = {
  id: 'u3-condense-eval',
  nodeId: 'RF8.condense',
  title: 'Evaluate by combining logs',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 5, 6]);
    const L = logB(b);
    const k = rng.int(1, 3);
    let expr: string;
    let combined: string;
    if (tier === 1) {
      // log u + log v = log b^k, neither a power of b
      const target = b ** k;
      const ds = [] as number[];
      for (let d = 2; d < target; d++) if (target % d === 0 && Math.round(log(b, d)) !== log(b, d)) ds.push(d);
      if (!ds.length) throw new Reject();
      const u = rng.pick(ds);
      if (Number.isInteger(log(b, target / u))) throw new Reject();
      expr = `${L} ${u} + ${L} ${target / u}`;
      combined = `${L} (${u} \\cdot ${target / u}) = ${L} ${target}`;
    } else if (tier === 2) {
      const w = rng.int(2, 7);
      if (w % b === 0) throw new Reject();
      // 2 log_b(b w) − log_b(w^2 / b^{k−2}) style: keep it plain: log_b(b^k w) − log_b w
      const twoStep = rng.chance(0.5);
      if (twoStep) {
        expr = `2${L} ${b * w} - ${L} ${w * w}`;
        combined = `${L} \\frac{${b * w}^2}{${w * w}} = ${L} ${b * b}`;
      } else {
        expr = `${L} ${b ** k * w} - ${L} ${w}`;
        combined = `${L} \\frac{${b ** k * w}}{${w}} = ${L} ${b ** k}`;
      }
      if (twoStep) return finish(expr, combined, F(2));
    } else {
      // ½ log_b(w²) + log_b(b^k / w)
      const target = b ** k;
      const ws = [] as number[];
      for (let d = 2; d < target; d++) if (target % d === 0) ws.push(d);
      if (!ws.length) throw new Reject();
      const w = rng.pick(ws);
      expr = `\\frac{1}{2}${L} ${w * w} + ${L} ${target / w === 1 ? 1 : target / w}`;
      combined = `${L} \\left(\\sqrt{${w * w}} \\cdot ${target / w}\\right) = ${L} ${target}`;
    }
    return finish(expr, combined, F(k));

    function finish(e: string, c: string, v: Frac): Draft {
      return {
        cognitive: 'procedural',
        stem: `Evaluate ${m(e)} without a calculator.`,
        format: 'input',
        fields: [field(num(v), '')],
        hints: ['Neither term is a nice value alone: combine first.', 'Power law, then product or quotient law.', `The combined argument is a power of ${m(String(b))}.`],
        solution: [{ tex: m(`${e} = ${c}`), why: 'Log laws.' }, { tex: m(`= ${v.tex()}`) }],
      };
    }
  },
};

// ---------------------------------------------------------------- RF8.change-base

const cobEval: Generator = {
  id: 'u3-cob-eval',
  nodeId: 'RF8.change-base',
  title: 'Evaluate with change of base',
  make(rng, tier): Draft {
    const b = rng.pick([3, 4, 6, 7, 9, 12]);
    const x = tier === 3 ? F(1, rng.int(2, 9)) : F(rng.int(tier === 1 ? 5 : 20, tier === 1 ? 60 : 900));
    const v = log(b, x.value);
    if (Number.isInteger(Math.round(v * 1e9) / 1e9)) throw new Reject();
    const spec = roundedOk(v, 2);
    const xt = x.d === 1 ? x.tex() : `\\left(${x.tex()}\\right)`;
    return {
      cognitive: 'procedural',
      stem: `Evaluate ${m(`\\log_{${b}} ${xt}`)} to the nearest hundredth.`,
      format: 'input',
      fields: [field(spec, '')],
      hints: ['Change of base: $\\log_b x = \\frac{\\log x}{\\log b}$.', `${m(`\\frac{\\log ${xt}}{\\log ${b}}`)}.`, 'Round only at the end.'],
      solution: [{ tex: m(`\\log_{${b}} ${xt} = \\frac{\\log ${xt}}{\\log ${b}} \\approx ${spec.tex}`), why: 'Any base works on the right; the calculator has base 10.' }],
    };
  },
};

const cobRewrite: Generator = {
  id: 'u3-cob-rewrite',
  nodeId: 'RF8.change-base',
  title: 'Rewrite with change of base',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 5, 7]);
    const x = rng.pick([6, 10, 11, 15, 20, 30].filter((v) => v !== b));
    const to = tier === 1 ? '10' : String(rng.pick([2, 3, 5].filter((v) => v !== b)));
    const lt = to === '10' ? '\\log' : `\\log_{${to}}`;
    const given = tier === 3 ? `\\frac{${lt} ${x}}{${lt} ${b}}` : `\\log_{${b}} ${x}`;
    const right = tier === 3 ? `\\log_{${b}} ${x}` : `\\frac{${lt} ${x}}{${lt} ${b}}`;
    return {
      cognitive: 'conceptual',
      stem: tier === 3 ? `Which is equivalent to ${m(given)}?` : `Which expression equals ${m(given)}?`,
      format: 'mc',
      choices: mc({ tex: m(right), key: 'ok' }, [
        { tex: m(tier === 3 ? `\\log_{${x}} ${b}` : `\\frac{${lt} ${b}}{${lt} ${x}}`), key: 'flip', mis: 'log-change-base-flip', feedback: 'The base goes in the denominator.' },
        { tex: m(tier === 3 ? `${lt} \\left(\\frac{${x}}{${b}}\\right)` : `${lt} \\left(\\frac{${x}}{${b}}\\right)`), key: 'q', mis: 'log-quotient-divide', feedback: 'A quotient of logs is not the log of a quotient.' },
        { tex: m(tier === 3 ? `${lt} ${x} - ${lt} ${b}` : `${lt} ${x} - ${lt} ${b}`), key: 'd', mis: 'log-quotient-divide' },
      ]),
      hints: ['$\\log_b x = \\frac{\\log_a x}{\\log_a b}$ for any valid base $a$.', 'Argument on top, base on the bottom.', tier === 3 ? 'Read the formula right to left.' : `New base ${m(to)}.`],
      solution: [{ tex: m(`\\log_{${b}} ${x} = \\frac{${lt} ${x}}{${lt} ${b}}`), why: 'Change of base: argument over base, both in the new base.' }],
    };
  },
};

const cobExact: Generator = {
  id: 'u3-cob-exact',
  nodeId: 'RF8.change-base',
  title: 'Exact values with change of base',
  make(rng, tier): Draft {
    if (tier === 3) {
      // log_a b · log_b c = log_a c, c = a^k
      const a = rng.pick([2, 3, 5]);
      const bb = rng.pick([7, 11, 13, 6]);
      const k = rng.nz(-3, 4);
      const c = powFrac(a, k);
      const ct = c.d === 1 ? c.tex() : `\\left(${c.tex()}\\right)`;
      return draft(`\\left(\\log_{${a}} ${bb}\\right)\\left(\\log_{${bb}} ${ct}\\right)`, [
        { tex: m(`= \\frac{\\log ${bb}}{\\log ${a}} \\cdot \\frac{\\log ${ct}}{\\log ${bb}} = \\frac{\\log ${ct}}{\\log ${a}}`), why: 'Change both to base 10; $\\log ' + bb + '$ cancels.' },
        { tex: m(`= \\log_{${a}} ${ct} = ${k}`) },
      ], F(k));
    }
    const pool: [number, number, number][] = tier === 1 ? [[2, 1, 5], [3, 1, 4], [2, 1, 6], [5, 1, 3]] : [[2, 3, 5], [2, 2, 5], [3, 2, 3], [2, 3, 2], [2, 2, 3], [5, 2, 3]];
    const [root, p, q] = rng.pick(pool);
    const b = root ** p;
    const x = root ** q;
    const shown = tier === 1 ? `\\frac{\\log ${x}}{\\log ${b}}` : `\\log_{${b}} ${x}`;
    return draft(shown, [
      { tex: m(`= \\frac{\\log_{${root}} ${x}}{\\log_{${root}} ${b}}`), why: tier === 1 ? 'Change of base, read backwards, then into base ' + root + '.' : `Change to base ${root}, where both are powers.` },
      { tex: m(`= ${p === 1 ? q : `\\frac{${q}}{${p}}`}`) },
    ], F(q, p));

    function draft(shownTex: string, steps: Draft['solution'], v: Frac): Draft {
      return {
        cognitive: 'procedural',
        stem: `Evaluate ${m(shownTex)} exactly.`,
        format: 'input',
        fields: [field(num(v), '')],
        hints: ['Change of base lets you pick any base.', 'Pick the base that makes both numbers powers.', 'Then each log is just an exponent.'],
        solution: steps,
      };
    }
  },
};

// ---------------------------------------------------------------- RF10.exp-common-base

const POW_BASES: [number, number, number][] = [
  [2, 4, 8],
  [3, 9, 27],
  [5, 25, 125],
  [2, 8, 16],
  [2, 4, 32],
];

const ecbSolve: Generator = {
  id: 'u3-ecb-solve',
  nodeId: 'RF10.exp-common-base',
  title: 'Solve with a common base',
  make(rng, tier): Draft {
    const r = rng.pick([2, 3, 5]);
    const ms = [1, 2, 3].filter((k) => r ** k <= 125);
    let L: string, Rt: string, m1: number, a1: number, c1: number, m2: number, a2: number, c2: number;
    if (tier === 1) {
      a1 = rng.int(1, 3);
      c1 = rng.int(-3, 3);
      m1 = 1;
      const k = rng.int(2, 4);
      [m2, a2, c2] = [1, 0, k];
      L = `${r}^{${a1 === 1 ? 'x' : `${a1}x`}${c1 > 0 ? ` + ${c1}` : c1 < 0 ? ` - ${-c1}` : ''}}`;
      Rt = String(r ** k);
    } else {
      m1 = rng.pick(ms);
      m2 = rng.pick(ms.filter((k) => k !== m1));
      if (m2 === undefined) throw new Reject();
      a1 = rng.int(1, 2);
      a2 = rng.int(1, 2);
      c1 = rng.int(-3, 3);
      c2 = rng.int(-3, 3);
      const neg = tier === 3 && rng.chance(0.6);
      const B1 = neg ? `\\left(\\frac{1}{${r ** m1}}\\right)` : String(r ** m1);
      if (neg) m1 = -m1;
      const ex = (a: number, c: number) => `${a === 1 ? 'x' : `${a}x`}${c > 0 ? ` + ${c}` : c < 0 ? ` - ${-c}` : ''}`;
      L = `${B1}^{${ex(a1, c1)}}`;
      Rt = `${r ** m2}^{${ex(a2, c2)}}`;
    }
    // m1(a1 x + c1) = m2(a2 x + c2)
    if (tier > 1 && a1 === a2 && c1 === c2) throw new Reject();
    const den = m1 * a1 - m2 * a2;
    if (den === 0) throw new Reject();
    const x = F(m2 * c2 - m1 * c1, den);
    if (tier < 3 && x.d !== 1) throw new Reject();
    if (x.d > 6) throw new Reject();
    const lin = (a: number, c: number) => `${a === 1 ? '' : a}x${c === 0 ? '' : ` ${c > 0 ? '+' : '-'} ${Math.abs(c)}`}`;
    const scaled = (k: number, a: number, c: number) => (k === 1 ? lin(a, c) : c === 0 ? `${k * a}x` : `${k === -1 ? '-' : k}(${lin(a, c)})`);
    const lhs = scaled(m1, a1, c1);
    const rhs = tier === 1 ? String(c2) : scaled(m2, a2, c2);
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(`${L} = ${Rt}`)}.`,
      format: 'input',
      fields: [field(num(x), 'x =')],
      hints: [`Write both sides as powers of ${m(String(r))}.`, 'Equal bases: set the exponents equal.', `${m(`${lhs} = ${rhs}`)}.`],
      solution: [
        { tex: m(`${r}^{${lhs}} = ${r}^{${rhs}}`), why: tier === 1 ? `$${r ** c2} = ${r}^{${c2}}$.` : 'Power of a power: multiply exponents.' },
        { tex: m(`${lhs} = ${rhs}`), why: 'Same base, so equal exponents.' },
        { tex: m(`x = ${x.tex()}`) },
      ],
      verify: () => Math.abs(m1 * (a1 * x.value + c1) - m2 * (a2 * x.value + c2)) < 1e-9,
    };
  },
};

const ecbQuad: Generator = {
  id: 'u3-ecb-quad',
  nodeId: 'RF10.exp-common-base',
  title: 'Common base with a quadratic exponent',
  make(rng, tier): Draft {
    const z1 = rng.int(-5, 5);
    let z2 = rng.int(-5, 5);
    if (z2 === z1) z2 = z1 + 1;
    const S = z1 + z2;
    const P = z1 * z2;
    // x² − Sx + P = 0  →  m·x² = m(Sx − P)
    const [r, mL, mR] = tier === 1 ? [rng.pick([2, 3]), 1, 1] : rng.pick([[2, 2, 1], [2, 1, 2], [3, 2, 1], [2, 3, 1], [2, 2, 3]] as [number, number, number][]);
    // r^{mL x²} = r^{mR (L x + K)}, need mL·S and mL·P divisible by mR
    if ((mL * S) % mR || (mL * P) % mR) throw new Reject();
    const Lc = (mL * S) / mR;
    const K = (-mL * P) / mR;
    const ex = `${Lc === 0 ? '' : Lc === 1 ? 'x' : Lc === -1 ? '-x' : `${Lc}x`}${K === 0 ? '' : Lc === 0 ? String(K) : K > 0 ? ` + ${K}` : ` - ${-K}`}` || '0';
    if (ex === '0') throw new Reject();
    const L = `${r ** mL}^{x^2}`;
    const R = `${r ** mR}^{${ex}}`;
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(`${L} = ${R}`)}.`,
      format: 'input',
      fields: [field(setAns([z1, z2]), 'x =', 'All solutions, separated by commas')],
      hints: [`Write both sides as powers of ${m(String(r))}.`, `${m(`${mL === 1 ? '' : mL}x^2 = ${mR === 1 ? '' : mR}(${ex})`)}.`, 'Rearrange to a quadratic equal to 0 and factor.'],
      solution: [
        { tex: m(`${r}^{${mL === 1 ? '' : mL}x^2} = ${r}^{${mR === 1 ? ex : `${mR}(${ex})`}}`), why: 'Common base.' },
        { tex: m(`x^2 ${S === 0 ? '' : S > 0 ? `- ${S === 1 ? '' : S}x` : `+ ${-S === 1 ? '' : -S}x`} ${P >= 0 ? '+' : '-'} ${Math.abs(P)} = 0`), why: 'Equate exponents, divide by the common factor, rearrange.' },
        { tex: m(`${fac(z1)}${fac(z2)} = 0`) },
        { tex: solutionText([z1, z2]) + '.' },
      ],
      verify: () => [z1, z2].every((z) => Math.abs(mL * z * z - mR * (Lc * z + K)) < 1e-9),
    };
  },
};

const ecbMc: Generator = {
  id: 'u3-ecb-mc',
  nodeId: 'RF10.exp-common-base',
  title: 'Equation of the exponents',
  make(rng, tier): Draft {
    const [r, A, B] = rng.pick(POW_BASES);
    const mA = Math.round(log(r, A));
    const mB = Math.round(log(r, B));
    const c1 = rng.nz(-3, 3);
    const c2 = tier === 1 ? 0 : rng.nz(-3, 3);
    const e1 = `x ${c1 > 0 ? '+' : '-'} ${Math.abs(c1)}`;
    const e2 = c2 === 0 ? 'x' : `x ${c2 > 0 ? '+' : '-'} ${Math.abs(c2)}`;
    const wrap = (s: string) => (s === 'x' ? 'x' : `(${s})`);
    const right = `${mA}${wrap(e1)} = ${mB}${wrap(e2)}`;
    return {
      cognitive: 'procedural',
      stem: `Writing both sides as powers of ${m(String(r))}, which equation follows from ${m(`${A}^{${e1}} = ${B}^{${e2}}`)}?`,
      format: 'mc',
      choices: mc({ tex: m(right), key: 'ok' }, [
        { tex: m(`${e1} = ${e2}`), key: 'same', mis: 'exp-common-base-coeff', feedback: `${A} and ${B} are different bases: rewrite them first.` },
        { tex: m(`${mA}x ${c1 > 0 ? '+' : '-'} ${Math.abs(c1)} = ${mB}${c2 === 0 ? 'x' : `x ${c2 > 0 ? '+' : '-'} ${Math.abs(c2)}`}`), key: 'dist', mis: 'exp-common-base-coeff', feedback: 'The power multiplies the whole exponent: use brackets.' },
        { tex: m(`${A}${wrap(e1)} = ${B}${wrap(e2)}`), key: 'base', mis: 'exp-common-base-coeff' },
        { tex: m(`${mA} + ${wrap(e1)} = ${mB} + ${wrap(e2)}`), key: 'add', mis: 'exp-power-add' },
      ]),
      hints: [`${m(`${A} = ${r}^{${mA}}`)} and ${m(`${B} = ${r}^{${mB}}`)}.`, '$(r^m)^{e} = r^{me}$.', 'Equal bases, equal exponents.'],
      solution: [
        { tex: m(`(${r}^{${mA}})^{${e1}} = (${r}^{${mB}})^{${e2}}`) },
        { tex: m(`${r}^{${mA}${wrap(e1)}} = ${r}^{${mB}${wrap(e2)}} \\Rightarrow ${right}`), why: 'Multiply exponents, then equate.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF10.exp-logs

const elogSolve: Generator = {
  id: 'u3-elog-solve',
  nodeId: 'RF10.exp-logs',
  title: 'Solve by taking logarithms',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 5, 6, 7]);
    let stem: string, x: number, steps: Draft['solution'];
    if (tier === 1) {
      const N = rng.int(5, 200);
      if (Number.isInteger(log(b, N))) throw new Reject();
      x = log(b, N);
      stem = `${b}^x = ${N}`;
      steps = [{ tex: m(`x\\log ${b} = \\log ${N}`), why: 'Take log of both sides; power law.' }, { tex: m(`x = \\frac{\\log ${N}}{\\log ${b}}`) }];
    } else if (tier === 2) {
      const a = rng.pick([2, 3, 4, 5, 6].filter((v) => v !== b));
      const c = rng.nz(-3, 3);
      const N = rng.int(a * 2, a * 60);
      x = log(b, N / a) - c;
      if (Number.isInteger(Math.round(x * 1e9) / 1e9)) throw new Reject();
      const ce = `x ${c > 0 ? '+' : '-'} ${Math.abs(c)}`;
      stem = `${a}(${b})^{${ce}} = ${N}`;
      steps = [
        { tex: m(`${b}^{${ce}} = \\frac{${N}}{${a}}`), why: 'Divide by the coefficient first.' },
        { tex: m(`(${ce})\\log ${b} = \\log \\frac{${N}}{${a}}`), why: 'Take log of both sides; power law.' },
        { tex: m(`x = \\frac{\\log (${N}/${a})}{\\log ${b}} ${c > 0 ? '-' : '+'} ${Math.abs(c)}`) },
      ];
    } else {
      const c = rng.pick([2, 3, 5, 7, 11].filter((v) => v !== b));
      const k = rng.int(1, 3);
      // b^{x + k} = c^x  →  x (log c − log b) = k log b
      x = (k * Math.log(b)) / (Math.log(c) - Math.log(b));
      stem = `${b}^{x + ${k}} = ${c}^{x}`;
      steps = [
        { tex: m(`(x + ${k})\\log ${b} = x\\log ${c}`), why: 'Take log of both sides; power law with brackets.' },
        { tex: m(`x\\log ${b} - x\\log ${c} = -${k === 1 ? '' : k}\\log ${b}`), why: 'Collect the $x$ terms.' },
        { tex: m(`x = \\frac{${k === 1 ? '' : k}\\log ${b}}{\\log ${c} - \\log ${b}}`), why: 'Factor out $x$ and divide.' },
      ];
    }
    const spec = roundedOk(x, 2);
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(stem)}, to the nearest hundredth.`,
      format: 'input',
      fields: [field(spec, 'x =')],
      hints: [tier === 2 ? 'Isolate the power before taking logs.' : 'Take the log of both sides.', 'Power law brings the exponent down: $\\log b^{e} = e\\log b$.', 'Isolate $x$; round only at the end.'],
      solution: [...steps, { tex: m(`x \\approx ${spec.tex}`) }],
    };
  },
};

const elogExact: Generator = {
  id: 'u3-elog-exact',
  nodeId: 'RF10.exp-logs',
  title: 'Exact solution with logs',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 5, 7]);
    const N = rng.pick([5, 6, 10, 11, 13, 15, 20].filter((v) => v % b !== 0));
    const c = tier === 1 ? 0 : rng.nz(-4, 4);
    const k = tier === 3 ? rng.int(2, 3) : 1;
    // b^{k x + c} = N → x = (log N / log b − c)/k
    const ex = `${k === 1 ? '' : k}x${c === 0 ? '' : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
    const fr = `\\frac{\\log ${N}}{\\log ${b}}`;
    const mk = (core: string, cc: number) => `x = ${cc === 0 ? core : `${core} ${cc > 0 ? '+' : '-'} ${Math.abs(cc)}`}`;
    const right = k === 1 ? mk(fr, -c) : `x = \\frac{1}{${k}}\\left(${fr}${c === 0 ? '' : c > 0 ? ` - ${c}` : ` + ${-c}`}\\right)`;
    const bad = (core: string, cc: number) => (k === 1 ? mk(core, cc) : `x = \\frac{1}{${k}}\\left(${core}${cc === 0 ? '' : cc > 0 ? ` + ${cc}` : ` - ${-cc}`}\\right)`);
    return {
      cognitive: 'procedural',
      stem: `Which is the exact solution of ${m(`${b}^{${ex}} = ${N}`)}?`,
      format: 'mc',
      choices: mc({ tex: m(right), key: 'ok' }, [
        { tex: m(bad(`\\log \\left(\\frac{${N}}{${b}}\\right)`, -c)), key: 'q', mis: 'log-quotient-divide', feedback: '$\\frac{\\log N}{\\log b} \\ne \\log\\frac{N}{b}$.' },
        { tex: m(bad(`\\frac{\\log ${b}}{\\log ${N}}`, -c)), key: 'flip', mis: 'log-change-base-flip' },
        c !== 0
          ? { tex: m(bad(fr, c)), key: 'sign', mis: 'exp-take-log-exponent', feedback: 'Undo the constant with the opposite operation.' }
          : { tex: m(`x = \\log ${N} - \\log ${b}`), key: 'sub', mis: 'log-quotient-divide' },
      ]),
      hints: ['Take log of both sides.', `${m(`(${ex})\\log ${b} = \\log ${N}`)}.`, 'Divide by $\\log ' + b + '$ first, then undo the constant' + (k > 1 ? ' and the coefficient.' : '.')],
      solution: [
        { tex: m(`${ex === 'x' ? 'x' : `(${ex})`}\\log ${b} = \\log ${N}`), why: 'Take log of both sides; power law.' },
        ...(ex === 'x' ? [] : [{ tex: m(`${ex} = ${fr}`) }]),
        { tex: m(right) },
      ],
    };
  },
};

const elogSteps: Generator = {
  id: 'u3-elog-steps',
  nodeId: 'RF10.exp-logs',
  title: 'Taking logs correctly',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 5]);
    if (tier < 3) {
      const a = rng.pick([3, 4, 5, 6, 7].filter((v) => v !== b));
      const N = a * rng.int(5, 40);
      return {
        cognitive: 'conceptual',
        stem: `After taking the common logarithm of both sides of ${m(`${a}(${b})^{x} = ${N}`)}, which equation is correct?`,
        format: 'mc',
        choices: mc({ tex: m(`\\log ${a} + x\\log ${b} = \\log ${N}`), key: 'ok' }, [
          { tex: m(`x\\log ${a * b} = \\log ${N}`), key: 'mult', mis: 'exp-common-base-coeff', feedback: `${m(`${a}(${b})^x \\ne ${a * b}^x`)}: the exponent applies only to ${b}.` },
          { tex: m(`${a}x\\log ${b} = \\log ${N}`), key: 'coef', mis: 'exp-take-log-exponent', feedback: 'The log of a product is a sum: $\\log(a \\cdot b^x) = \\log a + x\\log b$.' },
          { tex: m(`\\log ${a} \\cdot x\\log ${b} = \\log ${N}`), key: 'prod', mis: 'log-product-sum' },
        ]),
        hints: ['$\\log(MN) = \\log M + \\log N$.', '$\\log b^x = x\\log b$.', 'Or divide by the coefficient first, which avoids the issue.'],
        solution: [{ tex: m(`\\log\\left(${a} \\cdot ${b}^x\\right) = \\log ${a} + \\log ${b}^x = \\log ${a} + x\\log ${b}`), why: 'Product law, then power law.' }],
      };
    }
    const c = rng.pick([3, 5, 7].filter((v) => v !== b));
    const k = rng.int(1, 3);
    const e = `x + ${k}`;
    return {
      cognitive: 'conceptual',
      stem: `After taking the common logarithm of both sides of ${m(`${b}^{${e}} = ${c}^{x}`)}, which equation is correct?`,
      format: 'mc',
      choices: mc({ tex: m(`(${e})\\log ${b} = x\\log ${c}`), key: 'ok' }, [
        { tex: m(`x + ${k}\\log ${b} = x\\log ${c}`), key: 'brk', mis: 'exp-take-log-exponent', feedback: 'The whole exponent multiplies the log: keep the brackets.' },
        { tex: m(`(${e})\\log ${c} = x\\log ${b}`), key: 'swap', mis: 'exp-take-log-exponent' },
        { tex: m(`\\log (${e}) \\cdot ${b} = \\log x \\cdot ${c}`), key: 'log', mis: 'log-power-wrong-place' },
      ]),
      hints: ['$\\log b^{e} = e\\log b$ for the whole exponent $e$.', `Here ${m(`e = ${e}`)}.`, 'Brackets matter.'],
      solution: [{ tex: m(`\\log ${b}^{${e}} = (${e})\\log ${b}`), why: 'Power law on the entire exponent.' }],
    };
  },
};

// ---------------------------------------------------------------- RF10.log-eq

const logeqSolve: Generator = {
  id: 'u3-logeq-solve',
  nodeId: 'RF10.log-eq',
  title: 'Solve a logarithmic equation',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 5, 10]);
    const L = logB(b);
    if (tier === 1) {
      const a = rng.int(1, 4);
      const k = rng.int(1, b === 10 ? 2 : 4);
      const c = rng.int(-9, 9);
      const xf = F(b ** k - c, a);
      if (xf.d !== 1 && xf.d > 4) throw new Reject();
      const arg = `${a === 1 ? '' : a}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`;
      return draft(`${L}(${arg}) = ${k}`, [
        { tex: m(`${arg} = ${b}^{${k}} = ${b ** k}`), why: 'Exponential form.' },
        { tex: m(`x = ${xf.tex()}`), why: `Check: the argument is ${b ** k} > 0.` },
      ], [xf]);
    }
    if (tier === 2) {
      // log(x + p) − log(x + q) = k → x + p = b^k (x + q)
      const k = 1;
      const B = b ** k;
      const x = rng.int(1, 8);
      const q = rng.int(-x + 1, 5);
      const p = B * (x + q) - x;
      if (p === q || Math.abs(p) > 80) throw new Reject();
      const s = (v: number) => (v === 0 ? 'x' : `x ${v > 0 ? '+' : '-'} ${Math.abs(v)}`);
      return draft(`${L}(${s(p)}) - ${L}${q === 0 ? ' x' : `(${s(q)})`} = ${k}`, [
        { tex: m(`${L}\\frac{${s(p)}}{${s(q)}} = ${k}`), why: 'Quotient law.' },
        { tex: m(`${s(p)} = ${B}${q === 0 ? 'x' : `(${s(q)})`}`), why: 'Exponential form, then multiply by the denominator.' },
        { tex: m(`x = ${x}`), why: `Check: ${m(`${x + p} > 0`)} and ${m(`${x + q} > 0`)}.` },
      ], [x]);
    }
    // log(x + p) + log(x + q) = k with one extraneous root
    const k = b === 10 ? 1 : rng.int(1, b === 2 ? 4 : 2);
    const T = b ** k;
    const pairs: [number, number][] = [];
    for (let u = 1; u <= T; u++) if (T % u === 0 && u !== T / u) pairs.push([u, T / u]);
    if (!pairs.length) throw new Reject();
    const [u, v] = rng.pick(pairs);
    const x1 = rng.int(-3, 6);
    const p = u - x1;
    const q = v - x1;
    const x2 = -(p + q) - x1;
    if (x2 === x1) throw new Reject();
    const s = (w: number) => (w === 0 ? 'x' : `x ${w > 0 ? '+' : '-'} ${Math.abs(w)}`);
    const S = p + q;
    const C = p * q - T;
    return draft(`${L}(${s(p)}) + ${L}(${s(q)}) = ${k}`, [
      { tex: m(`(${s(p)})(${s(q)}) = ${b}^{${k}} = ${T}`), why: 'Product law, then exponential form.' },
      { tex: m(`x^2 ${S === 0 ? '' : S > 0 ? `+ ${S === 1 ? '' : S}x` : `- ${-S === 1 ? '' : -S}x`} ${C === 0 ? '' : C > 0 ? `+ ${C}` : `- ${-C}`} = 0`) },
      { tex: `${m(`x = ${x1}`)} or ${m(`x = ${x2}`)}.` },
      { tex: `Reject ${m(`x = ${x2}`)}: it makes ${m(s(p))} equal ${m(String(x2 + p))}, and only positive numbers have logarithms.`, why: 'Always check roots in the original equation.' },
    ], [x1]);

    function draft(eq: string, steps: Draft['solution'], sol: (number | Frac)[]): Draft {
      return {
        cognitive: 'procedural',
        stem: `Solve ${m(eq)}.`,
        format: 'input',
        fields: [field(setAns(sol), 'x =', 'All valid solutions; type ∅ if there are none')],
        hints: ['Combine into a single logarithm.', 'Convert to exponential form and solve.', 'Check every root: each log argument must be positive.'],
        solution: steps,
      };
    }
  },
};

const logeqValid: Generator = {
  id: 'u3-logeq-valid',
  nodeId: 'RF10.log-eq',
  title: 'Reject extraneous roots',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 6, 10]);
    const L = logB(b);
    const T = b === 10 ? 10 : b ** rng.int(1, 2);
    const pairs: [number, number][] = [];
    for (let u = 1; u <= T; u++) if (T % u === 0 && u !== T / u) pairs.push([u, T / u]);
    const [u, v] = rng.pick(pairs);
    const x1 = rng.int(tier === 3 ? -4 : 1, 6);
    const p = u - x1;
    const q = v - x1;
    const x2 = -(p + q) - x1;
    if (x2 === x1) throw new Reject();
    const k = Math.round(log(b, T));
    const s = (w: number) => (w === 0 ? 'x' : `x ${w > 0 ? '+' : '-'} ${Math.abs(w)}`);
    const [lo, hi] = [Math.min(x1, x2), Math.max(x1, x2)];
    const set = (xs: number[]) => (xs.length ? m(`\\{${xs.join(', ')}\\}`) : 'No solution');
    return {
      cognitive: 'conceptual',
      stem: `Solving ${m(`${L}(${s(p)}) + ${L}(${s(q)}) = ${k}`)} leads to ${m(`x = ${lo}`)} or ${m(`x = ${hi}`)}. What is the solution set?`,
      format: 'mc',
      choices: mc({ tex: set([x1]), key: 'ok' }, [
        { tex: set([lo, hi]), key: 'both', mis: 'extraneous-keep', feedback: `Substitute ${x2}: ${m(s(p))} becomes ${x2 + p}, which has no logarithm.` },
        { tex: set([x2]), key: 'other', mis: 'log-negative-arg' },
        { tex: 'No solution', key: 'none', mis: 'log-negative-arg', feedback: `${x1} works: both arguments are positive.` },
      ]),
      hints: ['Substitute each root into the original equation.', 'Every log argument must be positive.', `Try ${m(`x = ${x2}`)} in ${m(s(p))}.`],
      solution: [
        { tex: `${m(`x = ${x1}`)}: arguments ${m(String(x1 + p))} and ${m(String(x1 + q))}, both positive. Keep.` },
        { tex: `${m(`x = ${x2}`)}: arguments ${m(String(x2 + p))} and ${m(String(x2 + q))}. Reject.`, why: 'Only positive numbers have logarithms.' },
      ],
    };
  },
};

const logeqSame: Generator = {
  id: 'u3-logeq-same',
  nodeId: 'RF10.log-eq',
  title: 'Same base on both sides',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 5, 7]);
    const L = logB(b);
    if (tier === 1) {
      const a = rng.int(2, 5);
      const d = rng.int(1, a - 1);
      const x = rng.int(1, 8);
      const c = rng.int(-6, 6);
      const e = (a - d) * x + c;
      const lin = (aa: number, cc: number) => `${aa === 1 ? '' : aa}x ${cc >= 0 ? '+' : '-'} ${Math.abs(cc)}`;
      if (a * x + c <= 0) throw new Reject();
      return draft(`${L}(${lin(a, c)}) = ${L}(${lin(d, e)})`, [{ tex: m(`${lin(a, c)} = ${lin(d, e)}`), why: 'Equal logs with the same base have equal arguments.' }, { tex: m(`x = ${x}`), why: `Check: both arguments equal ${a * x + c} > 0.` }], [x]);
    }
    const z1 = rng.int(-5, 6);
    let z2 = rng.int(-5, 6);
    if (z2 === z1) z2 = z1 + 2;
    const S = z1 + z2;
    const P = z1 * z2;
    const c = rng.int(1, 9);
    // x² − c = S x − P − c
    const D = -P - c;
    const ok = [z1, z2].filter((z) => z * z - c > 0);
    if (tier === 2 && ok.length !== 2) throw new Reject();
    if (tier === 3 && ok.length === 2) throw new Reject();
    const rhs = `${S === 0 ? '' : S === 1 ? 'x' : S === -1 ? '-x' : `${S}x`}${D === 0 ? '' : S === 0 ? String(D) : D > 0 ? ` + ${D}` : ` - ${-D}`}`;
    if (!rhs) throw new Reject();
    return draft(`${L}(x^2 - ${c}) = ${L}(${rhs})`, [
      { tex: m(`x^2 - ${c} = ${rhs}`), why: 'Same base: equate the arguments.' },
      { tex: m(`${fac(z1)}${fac(z2)} = 0`) },
      ...[z1, z2].map((z) => ({ tex: `${m(`x = ${z}`)}: ${m(`x^2 - ${c} = ${z * z - c}`)}${z * z - c > 0 ? ', positive. Keep.' : ', not positive. Reject.'}` })),
    ], ok);

    function draft(eq: string, steps: Draft['solution'], sol: number[]): Draft {
      return {
        cognitive: 'procedural',
        stem: `Solve ${m(eq)}.`,
        format: 'input',
        fields: [field(setAns(sol), 'x =', 'All valid solutions; type ∅ if there are none')],
        hints: ['$\\log_b M = \\log_b N \\Rightarrow M = N$.', 'Solve the resulting equation.', 'Check each root: both arguments must be positive.'],
        solution: steps,
      };
    }
  },
};

// ---------------------------------------------------------------- RF10.growth-decay

const SUBST = ['Iodine-131', 'A radioactive sample', 'Caesium-137', 'A medication in the bloodstream'];

const gdAmount: Generator = {
  id: 'u3-gd-amount',
  nodeId: 'RF10.growth-decay',
  title: 'Amount after time t',
  make(rng, tier): Draft {
    let stem: string, a: number, bF: string, b: number, p: number, t: number, unit: string, what: string;
    if (tier === 1) {
      a = rng.pick([80, 100, 200, 240, 500]);
      p = rng.int(3, 12);
      t = p * rng.int(2, 4) + rng.int(1, p - 1);
      b = 0.5;
      bF = '\\left(\\frac{1}{2}\\right)';
      unit = 'days';
      what = 'mg';
      stem = `${rng.pick(SUBST)} has a half-life of ${p} days. Starting with ${a} mg, how much remains after ${t} days, to the nearest tenth of a milligram?`;
    } else if (tier === 2) {
      a = rng.pick([50, 120, 300, 1000]);
      p = rng.int(2, 9);
      t = rng.int(p + 1, 5 * p);
      const triple = rng.chance(0.4);
      b = triple ? 3 : 2;
      bF = String(b);
      unit = 'hours';
      what = 'bacteria';
      stem = `A culture of ${a} bacteria ${triple ? 'triples' : 'doubles'} every ${p} hours. How many bacteria are there after ${t} hours, to the nearest whole number?`;
    } else {
      a = rng.pick([1200, 2500, 4000, 15000]);
      const r = rng.pick([3, 4, 6, 8, 12]);
      const down = rng.chance(0.5);
      b = 1 + (down ? -r : r) / 100;
      bF = b.toFixed(2);
      p = 1;
      t = rng.int(4, 15);
      unit = 'years';
      what = down ? 'dollars of value' : 'people';
      stem = down ? `A car bought for ${money(a)} loses ${r}% of its value each year. What is it worth after ${t} years, to the nearest tenth of a dollar?` : `A town of ${a} people grows by ${r}% per year. What is the population after ${t} years, to the nearest whole number?`;
    }
    const v = a * b ** (t / p);
    const counts = what === 'bacteria' || what === 'people';
    if (counts && nearBoundary(v, 0)) throw new Reject();
    const spec: AnswerSpec = counts ? { kind: 'number', value: Math.round(v), tex: String(Math.round(v)), round: 'whole' } : roundedOk(v, 1);
    const model = `${a}${bF.startsWith('\\left') ? bF : `(${bF})`}^{${p === 1 ? 't' : `\\frac{t}{${p}}`}}`;
    return {
      cognitive: 'procedural',
      stem,
      format: 'input',
      fields: [field(spec, '', `Amount (${what})`)],
      hints: ['Use $y = a(b)^{t/p}$ from the formula sheet.', `${m(`a = ${a}`)}, ${m(`b = ${bF}`)}, ${m(`p = ${p}`)} ${unit === 'years' ? 'year' : unit}.`, `Substitute ${m(`t = ${t}`)}.`],
      solution: [
        { tex: m(`y = ${model}`), why: tier === 3 ? `A ${b > 1 ? 'growth' : 'decay'} of ${Math.round(Math.abs(b - 1) * 100)}% per year means $b = ${bF}$ each year.` : 'The base is the factor per period $p$.' },
        { tex: m(`y = ${a}${bF.startsWith('\\left') ? bF : `(${bF})`}^{${p === 1 ? t : `\\frac{${t}}{${p}}`}} \\approx ${counts ? v.toFixed(2) + ' \\approx ' : ''}${spec.tex}`) },
      ],
    };
  },
};

const gdTime: Generator = {
  id: 'u3-gd-time',
  nodeId: 'RF10.growth-decay',
  title: 'Time to reach an amount',
  make(rng, tier): Draft {
    if (tier === 3) {
      // Percent change per period: y = a(1 ± r)^{t/p}
      const r = rng.pick([5, 8, 12, 15, 20]);
      const pp = rng.pick([1, 2, 3]);
      const a0 = rng.pick([2000, 5000, 18000, 30000]);
      const frac = rng.pick([0.5, 0.25, 0.4, 0.3]);
      const bb = 1 - r / 100;
      const t = (pp * Math.log(frac)) / Math.log(bb);
      const spec = roundedOk(t, 1);
      const per = pp === 1 ? 'year' : `${pp} years`;
      return {
        cognitive: 'procedural',
        stem: `A machine worth ${money(a0)} loses ${r}% of its value every ${per}. How long, to the nearest tenth of a year, until it is worth ${money(a0 * frac)}?`,
        format: 'input',
        fields: [field(spec, 't =', 'Years')],
        hints: [`Losing ${r}% leaves ${100 - r}%: ${m(`b = ${bb.toFixed(2)}`)}.`, `${m(`${a0 * frac} = ${a0}(${bb.toFixed(2)})^{${pp === 1 ? 't' : `t/${pp}`}}`)}.`, 'Divide, take logs, solve for $t$.'],
        solution: [
          { tex: m(`${frac} = (${bb.toFixed(2)})^{${pp === 1 ? 't' : `\\frac{t}{${pp}}`}}`), why: 'Divide by the initial value.' },
          { tex: m(`t = \\frac{${pp === 1 ? '' : pp}\\log ${frac}}{\\log ${bb.toFixed(2)}} \\approx ${spec.tex}`), why: 'Take logs; power law.' },
        ],
      };
    }
    const decay = tier === 1;
    const a = rng.pick([100, 250, 400, 800]);
    const p = rng.int(3, 15);
    const b = decay ? 0.5 : rng.pick([2, 3]);
    const target = decay ? a * rng.pick([0.3, 0.15, 0.4, 0.1, 0.05, 0.2]) : a * rng.int(5, 40);
    if (Number.isInteger(log(b, target / a))) throw new Reject();
    const t = (p * Math.log(target / a)) / Math.log(b);
    const spec = roundedOk(t, 1);
    const bt = decay ? '\\frac{1}{2}' : String(b);
    const tgt = +target.toFixed(2);
    return {
      cognitive: 'procedural',
      stem: decay
        ? `A substance has a half-life of ${p} years. How long, to the nearest tenth of a year, until a ${a} g sample decays to ${tgt} g?`
        : `A population of ${a} ${b === 2 ? 'doubles' : 'triples'} every ${p} days. How long, to the nearest tenth of a day, until it reaches ${tgt}?`,
      format: 'input',
      fields: [field(spec, 't =', decay ? 'Years' : 'Days')],
      hints: [`${m(`${tgt} = ${a}\\left(${bt}\\right)^{t/${p}}`)}.`, 'Divide by the initial amount, then take logs.', `${m(`\\frac{t}{${p}}\\log ${decay ? '0.5' : b} = \\log \\frac{${tgt}}{${a}}`)}.`],
      solution: [
        { tex: m(`\\frac{${tgt}}{${a}} = \\left(${bt}\\right)^{t/${p}}`), why: 'Isolate the power.' },
        { tex: m(`t = \\frac{${p}\\log(${tgt}/${a})}{\\log ${decay ? '0.5' : b}} \\approx ${spec.tex}`), why: 'Take logs; power law; solve for $t$.' },
      ],
    };
  },
};

const gdModel: Generator = {
  id: 'u3-gd-model',
  nodeId: 'RF10.growth-decay',
  title: 'Choose the growth or decay model',
  make(rng, tier): Draft {
    const a = rng.pick([20, 50, 200, 600]);
    const p = rng.int(2, 9);
    if (tier === 3) {
      const r = rng.pick([4, 6, 8, 15]);
      const b = (100 - r) / 100;
      return {
        cognitive: 'conceptual',
        stem: `A lake's fish population of ${a} decreases by ${r}% every ${p} years. Which models the population ${m('P')} after ${m('t')} years?`,
        format: 'mc',
        choices: mc({ tex: m(`P = ${a}(${b.toFixed(2)})^{\\frac{t}{${p}}}`), key: 'ok' }, [
          { tex: m(`P = ${a}(${(r / 100).toFixed(2)})^{\\frac{t}{${p}}}`), key: 'r', mis: 'growth-p-period', feedback: `Losing ${r}% leaves ${100 - r}% each period: $b = ${b.toFixed(2)}$.` },
          { tex: m(`P = ${a}(${b.toFixed(2)})^{${p}t}`), key: 'pt', mis: 'growth-p-period', feedback: 'The exponent counts periods: $t/p$.' },
          { tex: m(`P = ${a}(${(1 + r / 100).toFixed(2)})^{\\frac{t}{${p}}}`), key: 'up', mis: 'growth-p-period' },
        ]),
        hints: ['$y = a(b)^{t/p}$.', `After one period, ${100 - r}% remains.`, 'The exponent is the number of periods.'],
        solution: [{ tex: `${m(`b = 1 - ${(r / 100).toFixed(2)} = ${b.toFixed(2)}`)}, period ${m(`p = ${p}`)}: ${m(`P = ${a}(${b.toFixed(2)})^{t/${p}}`)}.` }],
      };
    }
    const half = tier === 1 && rng.chance(0.5);
    const b = half ? '\\frac{1}{2}' : rng.pick(['2', '3']);
    const word = half ? `has a half-life of ${p} h` : `${b === '2' ? 'doubles' : 'triples'} every ${p} h`;
    const B = half ? `\\left(${b}\\right)` : `(${b})`;
    return {
      cognitive: 'conceptual',
      stem: `A quantity starts at ${a} and ${word}. Which models the amount ${m('A')} after ${m('t')} hours?`,
      format: 'mc',
      choices: mc({ tex: m(`A = ${a}${B}^{\\frac{t}{${p}}}`), key: 'ok' }, [
        { tex: m(`A = ${a}${B}^{${p}t}`), key: 'pt', mis: 'growth-p-period', feedback: `Every ${p} h is one period, so the number of periods is $t/${p}$.` },
        { tex: m(`A = ${a}(${p})^{\\frac{t}{${half ? 2 : b}}}`), key: 'swap', mis: 'growth-p-period' },
        { tex: m(`A = ${half ? `${a / 2}` : `${a * Number(b)}`}^{\\frac{t}{${p}}}`), key: 'merge', mis: 'exp-common-base-coeff', feedback: '$a(b)^{t/p} \\ne (ab)^{t/p}$: the exponent applies only to the base.' },
      ]),
      hints: ['$y = a(b)^{t/p}$.', `${m('b')} is the factor per period: ${half ? '$\\frac{1}{2}$' : b}.`, `${m('p')} is the length of a period: ${p} h.`],
      solution: [{ tex: `${m(`a = ${a}`)}, ${m(`b = ${b}`)}, ${m(`p = ${p}`)}: ${m(`A = ${a}${B}^{t/${p}}`)}.` }],
    };
  },
};

// ---------------------------------------------------------------- RF10.compound-interest

const FREQ: [string, number][] = [
  ['annually', 1],
  ['semi-annually', 2],
  ['quarterly', 4],
  ['monthly', 12],
];

const ciAmount: Generator = {
  id: 'u3-ci-amount',
  nodeId: 'RF10.compound-interest',
  title: 'Future value',
  make(rng, tier): Draft {
    const P = rng.pick([500, 1000, 2500, 4000, 7500, 12000]);
    const [word, n] = tier === 1 ? FREQ[0] : rng.pick(FREQ.slice(1));
    const rate = rng.pick(tier === 3 ? [2.4, 3.6, 4.8, 6] : [2, 3, 4, 5, 6]);
    const t = rng.int(3, 15);
    const i = rate / 100 / n;
    const A = P * (1 + i) ** (n * t);
    const spec = roundedOk(A, 2);
    const bt = +(1 + i).toFixed(6);
    return {
      cognitive: 'procedural',
      stem: `${money(P)} is invested at ${rate}%/a compounded ${word}. What is the value after ${t} years, to the nearest cent?`,
      format: 'input',
      fields: [field(spec, '\\text{\\textdollar}', 'Value')],
      hints: ['$A = P(1 + i)^n$ where $i$ is the rate per period.', `${m(`i = \\frac{${rate / 100}}{${n}}`)}, ${m(`n = ${n} \\times ${t}`)}.`, `${m(`A = ${P}(${bt})^{${n * t}}`)}.`],
      solution: [
        { tex: m(`i = \\frac{${rate / 100}}{${n}} = ${+i.toFixed(6)},\\quad n = ${n}(${t}) = ${n * t}`), why: 'Rate and number of compounding periods.' },
        { tex: m(`A = ${P}(${bt})^{${n * t}} \\approx ${spec.tex}`) },
      ],
    };
  },
};

const PERIOD: Record<number, string> = { 1: 'years', 2: 'half-years', 4: 'quarters', 12: 'months' };

const ciTime: Generator = {
  id: 'u3-ci-time',
  nodeId: 'RF10.compound-interest',
  title: 'Time to reach a goal',
  make(rng, tier): Draft {
    const P = rng.pick([1000, 2000, 5000]);
    const [word, n] = tier === 1 ? FREQ[0] : rng.pick(FREQ.slice(1));
    const rate = rng.pick([3, 4, 5, 6, 8]);
    const ratio = tier === 3 ? 2 : rng.pick([1.5, 1.8, 2.5, 3]);
    const goal = P * ratio;
    const i = rate / 100 / n;
    const periods = Math.log(ratio) / Math.log(1 + i);
    if (Math.abs(periods - Math.round(periods)) < 0.01) throw new Reject();
    // Interest is credited at the end of each period, so the answer is the first whole period that reaches the goal.
    const whole = Math.ceil(periods);
    const bt = +(1 + i).toFixed(6);
    const unit = PERIOD[n];
    return {
      cognitive: 'procedural',
      stem: tier === 3
        ? `An investment earns ${rate}%/a compounded ${word}. How many ${unit} until its value first doubles?`
        : `${money(P)} is invested at ${rate}%/a compounded ${word}. How many ${unit} until the investment is first worth at least ${money(goal)}?`,
      format: 'input',
      fields: [field(num(whole), 'n =', `Number of ${unit}`)],
      hints: [`${m(`${tier === 3 ? '2P' : goal} = ${tier === 3 ? 'P' : P}(${bt})^{n}`)}, where ${m('n')} counts compounding periods.`, 'Isolate the power, then take logs.', 'Interest is added only at the end of a period: round up to a whole period.'],
      solution: [
        { tex: m(`(${bt})^{n} = ${ratio} \\Rightarrow n = \\frac{\\log ${ratio}}{\\log ${bt}} \\approx ${periods.toFixed(2)}`), why: 'Divide by the principal, take logs, power law.' },
        { tex: `After ${m(String(whole - 1))} ${unit} the goal is not yet reached, so ${m(`n = ${whole}`)}.`, why: 'Round up to the next whole compounding period.' },
      ],
      verify: () => P * (1 + i) ** whole >= goal && P * (1 + i) ** (whole - 1) < goal,
    };
  },
};

const ciModel: Generator = {
  id: 'u3-ci-model',
  nodeId: 'RF10.compound-interest',
  title: 'Choose the interest model',
  make(rng, tier): Draft {
    const P = rng.pick([800, 1500, 3000]);
    const [word, n] = tier === 1 ? rng.pick(FREQ.slice(1, 3)) : rng.pick(FREQ.slice(1));
    const rate = rng.pick(n === 12 ? [2.4, 3.6, 4.8, 6] : [2, 4, 6, 8]);
    const i = +(rate / 100 / n).toFixed(6);
    const r = rate / 100;
    const f = (b: number, e: string) => m(`A = ${P}(${+b.toFixed(6)})^{${e}}`);
    return {
      cognitive: 'conceptual',
      stem: `${money(P)} is invested at ${rate}%/a compounded ${word}. Which gives the value ${m('A')} after ${m('t')} years?`,
      format: 'mc',
      choices: mc({ tex: f(1 + i, `${n}t`), key: 'ok' }, [
        { tex: f(1 + r, `${n}t`), key: 'rate', mis: 'interest-compound-period', feedback: `The rate per period is ${rate}% ÷ ${n}.` },
        { tex: f(1 + i, 't'), key: 'n', mis: 'growth-p-period', feedback: `There are ${n} periods per year, so ${n}t periods in total.` },
        { tex: f(1 + r, `\\frac{t}{${n}}`), key: 'both', mis: 'growth-p-period' },
      ]),
      hints: ['$A = P(1 + i)^n$.', `${m(`i = ${r} \\div ${n}`)}.`, `Number of periods in ${m('t')} years: ${m(`${n}t`)}.`],
      solution: [{ tex: `${m(`i = \\frac{${r}}{${n}} = ${i}`)}, ${m(`n = ${n}t`)}: ${f(1 + i, `${n}t`)}.` }],
    };
  },
};

// ---------------------------------------------------------------- RF10.log-scales

const lsRatio: Generator = {
  id: 'u3-ls-ratio',
  nodeId: 'RF10.log-scales',
  title: 'Compare intensities on a log scale',
  make(rng, tier): Draft {
    if (tier === 1) {
      const m1 = rng.int(30, 60) / 10;
      const d = rng.int(1, 3);
      const m2 = (m1 + d).toFixed(1);
      return draft(`Earthquake magnitude is ${m('M = \\log\\frac{I}{I_0}')}. How many times as intense is a magnitude ${m2} earthquake as a magnitude ${m1.toFixed(1)} earthquake?`, num(10 ** d), [
        { tex: m(`\\frac{I_2}{I_1} = 10^{${m2} - ${m1.toFixed(1)}} = 10^{${d}}`), why: 'Each unit of magnitude is a factor of 10.' },
        { tex: m(`= ${10 ** d}`) },
      ]);
    }
    if (tier === 2) {
      const p1 = rng.int(20, 90) / 10;
      const d = rng.int(5, 30) / 10;
      const p2 = +(p1 + d).toFixed(1);
      const v = 10 ** d;
      const spec = roundedOk(v, 1);
      return draft(`${m('\\text{pH} = -\\log[H^+]')}. How many times as acidic (greater ${m('[H^+]')}) is a solution with pH ${p1} as one with pH ${p2}? Answer to the nearest tenth.`, spec, [
        { tex: m(`\\frac{[H^+]_1}{[H^+]_2} = 10^{${p2} - ${p1}} = 10^{${+d.toFixed(1)}}`), why: 'Lower pH means more acidic; each unit is a factor of 10.' },
        { tex: m(`\\approx ${spec.tex}`) },
      ]);
    }
    const b1 = rng.int(40, 90);
    const d = rng.nz(4, 25);
    const v = 10 ** (d / 10);
    const spec = roundedOk(v, 1);
    return draft(`Sound level is ${m('\\beta = 10\\log\\frac{I}{I_0}')} decibels. How many times as intense is a ${b1 + d} dB sound as a ${b1} dB sound? Answer to the nearest tenth.`, spec, [
      { tex: m(`${b1 + d} - ${b1} = 10\\log\\frac{I_2}{I_1} \\Rightarrow \\log\\frac{I_2}{I_1} = ${d / 10}`), why: 'Subtract the two equations: the difference of logs is the log of the ratio.' },
      { tex: m(`\\frac{I_2}{I_1} = 10^{${d / 10}} \\approx ${spec.tex}`) },
    ]);

    function draft(stem: string, spec: AnswerSpec, steps: Draft['solution']): Draft {
      return {
        cognitive: 'procedural',
        stem,
        format: 'input',
        fields: [field(spec, '', 'Ratio')],
        hints: ['A difference on a log scale is a ratio of intensities.', 'Subtract the readings, then undo the log.', 'Ratio $= 10^{\\text{difference}}$ (divide the difference by 10 first for decibels).'],
        solution: steps,
      };
    }
  },
};

const lsMagnitude: Generator = {
  id: 'u3-ls-magnitude',
  nodeId: 'RF10.log-scales',
  title: 'New reading from a ratio',
  make(rng, tier): Draft {
    const m1 = rng.int(30, 70) / 10;
    const R = tier === 1 ? 10 ** rng.int(1, 3) : rng.pick([5, 20, 50, 250, 400, 1500, 3]);
    const sm = tier === 3;
    const M2 = sm ? m1 - Math.log10(R) : m1 + Math.log10(R);
    if (M2 <= 0) throw new Reject();
    const spec = roundedOk(M2, 1);
    return {
      cognitive: 'procedural',
      stem: `Earthquake magnitude is ${m('M = \\log\\frac{I}{I_0}')}. An earthquake has magnitude ${m1}. What is the magnitude of an earthquake ${sm ? `with ${m(`\\frac{1}{${R}}`)} of the intensity` : `${R} times as intense`}, to the nearest tenth?`,
      format: 'input',
      fields: [field(spec, 'M =')],
      hints: ['Multiplying intensity by $R$ adds $\\log R$ to the magnitude.', `${m(`\\log ${R} \\approx ${Math.log10(R).toFixed(3)}`)}.`, sm ? 'Less intense: subtract.' : 'Add.'],
      solution: [{ tex: m(`M = ${m1} ${sm ? '-' : '+'} \\log ${R} \\approx ${spec.tex}`), why: '$\\log(R \\cdot I) = \\log R + \\log I$.' }],
    };
  },
};

const lsMc: Generator = {
  id: 'u3-ls-mc',
  nodeId: 'RF10.log-scales',
  title: 'Log-scale reasoning',
  make(rng, tier): Draft {
    const m1 = rng.int(3, 6);
    const d = tier === 1 ? 2 : rng.pick([2, 3]);
    const m2 = m1 + d;
    const ratio = 10 ** d;
    const ask = tier === 3;
    if (ask) {
      // reverse: intensity ratio given, magnitude difference asked
      return {
        cognitive: 'conceptual',
        stem: `Earthquake A is ${ratio} times as intense as earthquake B. Using ${m('M = \\log\\frac{I}{I_0}')}, how do their magnitudes compare?`,
        format: 'mc',
        choices: mc({ tex: `A is ${d} greater`, key: 'ok' }, [
          { tex: `A is ${ratio} greater`, key: 'r', mis: 'logscale-difference-ratio', feedback: 'Magnitudes differ by $\\log(\\text{ratio})$.' },
          { tex: `A is ${ratio} times greater`, key: 't', mis: 'logscale-difference-ratio' },
          { tex: `A is ${d} times greater`, key: 'd', mis: 'logscale-difference-ratio' },
        ]),
        hints: ['$M_A - M_B = \\log\\frac{I_A}{I_B}$.', `${m(`\\log ${ratio}`)} = ?`, 'A ratio of intensities is a difference of magnitudes.'],
        solution: [{ tex: m(`M_A - M_B = \\log ${ratio} = ${d}`) }],
      };
    }
    return {
      cognitive: 'conceptual',
      stem: `Earthquake A has magnitude ${m2}.0 and earthquake B has magnitude ${m1}.0. Using ${m('M = \\log\\frac{I}{I_0}')}, how many times as intense is A as B?`,
      format: 'mc',
      choices: mc({ tex: m(String(ratio)), key: ratio }, [
        { tex: m(String(d)), key: d, mis: 'logscale-difference-ratio', feedback: 'A difference of magnitudes is a power of 10 in intensity.' },
        { tex: m(String(+(m2 / m1).toFixed(2))), key: 'q', mis: 'logscale-difference-ratio' },
        { tex: m(String(10 * d)), key: 10 * d, mis: 'logscale-difference-ratio' },
      ]),
      hints: ['$\\frac{I_A}{I_B} = 10^{M_A - M_B}$.', `Difference: ${m(String(d))}.`, `${m(`10^{${d}}`)}.`],
      solution: [{ tex: m(`\\frac{I_A}{I_B} = 10^{${m2} - ${m1}} = 10^{${d}} = ${ratio}`) }],
    };
  },
};

export const expLogEquationGenerators: Generator[] = [
  expandMc, expandCoeff, expandEval,
  condenseInput, condenseMc, condenseEval,
  cobEval, cobRewrite, cobExact,
  ecbSolve, ecbQuad, ecbMc,
  elogSolve, elogExact, elogSteps,
  logeqSolve, logeqValid, logeqSame,
  gdAmount, gdTime, gdModel,
  ciAmount, ciTime, ciModel,
  lsRatio, lsMagnitude, lsMc,
];
