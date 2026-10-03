// T5 trigonometric equations: first degree, general solutions, second degree, graphical, identity substitution.
import { field, m, mc } from '../../framework';
import type { AnswerSpec, Draft, Generator } from '../../types';
import { Reject } from '../../types';
import { nearBoundary, roundTo } from '../u3/shared';
import { angleSet, angTex, exact, type Exact, type Fn, FN_VALUE, listTex, norm, PI, QNAME, rad, solveSpecial, SPECIAL_NONAXIS } from './shared';

type R = Parameters<Generator['make']>[0];

/** a·fn x = rhs for each positive exact value, so the equation has integer or surd coefficients. */
const EQ_FORM: Record<string, [string, string]> = {
  '0': ['', '0'],
  '1': ['', '1'],
  '\\frac{1}{2}': ['2', '1'],
  '\\frac{\\sqrt{2}}{2}': ['\\sqrt{2}', '1'],
  '\\frac{\\sqrt{3}}{2}': ['2', '\\sqrt{3}'],
  '\\frac{\\sqrt{3}}{3}': ['\\sqrt{3}', '1'],
  '\\sqrt{3}': ['', '\\sqrt{3}'],
  '2': ['', '2'],
  '\\sqrt{2}': ['', '\\sqrt{2}'],
  '\\frac{2\\sqrt{3}}{3}': ['\\sqrt{3}', '2'],
};

/** Equation whose solution is fn x = e. Tier 1 isolates the function; tier 2+ moves the constant across. */
function eqTex(fn: Fn, e: Exact, moved: boolean): string {
  const neg = e.value < 0;
  const [coef, rhs] = EQ_FORM[neg ? e.tex.slice(1) : e.tex];
  const lhs = `${coef}\\${fn} x`;
  if (rhs === '0') return `${lhs} = 0`;
  if (!moved) return `${lhs} = ${neg ? '-' : ''}${rhs}`;
  return `${lhs} ${neg ? '+' : '-'} ${rhs} = 0`;
}

const domTex = (lo: number, hi: number, inRad: boolean, hiIn = false) => `${angTex(lo, inRad)} \\le x ${hiIn ? '\\le' : '<'} ${angTex(hi, inRad)}`;

/** Roots of f on [lo, hi) (radians) by sign change and bisection. */
function roots(f: (x: number) => number, lo: number, hi: number, n = 4000): number[] {
  const out: number[] = [];
  let x0 = lo;
  let y0 = f(lo);
  if (Math.abs(y0) < 1e-12) out.push(lo);
  for (let i = 1; i <= n; i++) {
    const x1 = lo + ((hi - lo) * i) / n;
    const y1 = f(x1);
    if (Number.isFinite(y0) && Number.isFinite(y1) && Math.abs(y1 - y0) < 5) {
      if (Math.abs(y1) < 1e-12 && i < n) out.push(x1);
      else if (y0 * y1 < 0) {
        let [a, b] = [x0, x1];
        for (let k = 0; k < 60; k++) {
          const mid = (a + b) / 2;
          if (f(a) * f(mid) <= 0) b = mid;
          else a = mid;
        }
        out.push((a + b) / 2);
      }
    }
    x0 = x1;
    y0 = y1;
  }
  return out;
}

/** Rounded solution set: degrees to the tenth, radians to the hundredth. Rejects values near a rounding boundary. */
function roundedSet(xsRad: number[], inRad: boolean): AnswerSpec {
  const places = inRad ? 2 : 1;
  const vals = xsRad.map((x) => (inRad ? x : (x * 180) / PI)).sort((a, b) => a - b);
  if (vals.some((v) => nearBoundary(v, places))) throw new Reject('near rounding boundary');
  const r = vals.map((v) => roundTo(v, places));
  return { kind: 'set', values: vals, tex: r.length ? r.map((v) => v.toFixed(places)).join(', ') : '\\varnothing', round: inRad ? 'hundredth' : 'tenth', deg: !inRad };
}

const pickFn = (rng: R, tier: number): Fn => rng.pick(tier === 3 ? ['sin', 'cos', 'tan', 'csc', 'sec', 'cot'] : ['sin', 'cos', 'tan']);
const ratioFn: Record<string, Fn> = { csc: 'sin', sec: 'cos', cot: 'tan' };

/** A special angle and the exact value of fn there (non-axis for sin/cos to give two solutions mostly). */
function exactEq(rng: R, fn: Fn): { d: number; e: Exact } {
  for (let t = 0; t < 20; t++) {
    const d = rng.pick(SPECIAL_NONAXIS);
    const e = exact(fn, d);
    if (e && EQ_FORM[e.value < 0 ? e.tex.slice(1) : e.tex]) return { d, e };
  }
  throw new Reject();
}

// ---------------------------------------------------------------- T5.first-degree

const fdExact: Generator = {
  id: 'u4-fd-exact',
  nodeId: 'T5.first-degree',
  title: 'Solve for exact angles',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.6);
    const fn = pickFn(rng, tier);
    const { e } = exactEq(rng, fn);
    const [lo, hi, hiIn] = tier === 3 ? rng.pick([[-180, 180, true], [0, 720, false], [-360, 0, true]] as [number, number, boolean][]) : [0, 360, false];
    const sol = solveSpecial(fn, e.value, lo, hiIn ? hi + 1 : hi);
    const base = ratioFn[fn];
    const refD = solveSpecial(fn, Math.abs(e.value), 0, 91)[0];
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(eqTex(fn, e, tier > 1))} for ${m(domTex(lo, hi, inRad, hiIn))}. Give exact values.`,
      format: 'input',
      fields: [field(angleSet(sol, inRad), 'x =', 'Separate solutions with commas')],
      hints: [
        `Isolate ${m(`\\${fn} x`)}.`,
        base ? `${m(`\\${fn} x = ${e.tex}`)} means ${m(`\\${base} x = ${exact(base, sol[0])!.tex}`)}.` : `The reference angle has ${m(`\\${fn} = ${e.tex.replace(/^-/, '')}`)}: ${m(angTex(refD, inRad))}.`,
        `${m(`\\${fn}`)} is ${e.value > 0 ? 'positive' : 'negative'} in two quadrants (CAST). Then list every solution in the domain.`,
      ],
      solution: [
        { tex: m(`\\${fn} x = ${e.tex}`), why: 'Isolate the function.' },
        { tex: `Reference angle ${m(angTex(refD, inRad))}; ${e.value > 0 ? 'positive' : 'negative'} in quadrants ${[...new Set(sol.map((d) => Math.floor(norm(d) / 90) + 1))].sort().map((q) => QNAME[q]).join(' and ')}.`, why: 'CAST.' },
        { tex: `${m(`x = ${listTex(sol, inRad)}`)}.`, why: 'Add or subtract whole periods to reach every solution in the domain.' },
      ],
    };
  },
};

const fdApprox: Generator = {
  id: 'u4-fd-approx',
  nodeId: 'T5.first-degree',
  title: 'Solve with a calculator',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.5);
    const fn = rng.pick(['sin', 'cos', 'tan'] as const);
    const a = rng.int(2, 5);
    const r = fn === 'tan' ? rng.pick([-1, 1]) * rng.int(2, 40) / 10 : rng.pick([-1, 1]) * rng.int(1, 9) / 10;
    const k = tier === 1 ? 0 : rng.int(-5, 5);
    const rhs = roundTo(a * r + k, 2);
    if (k === 0 && tier > 1) throw new Reject();
    const val = (rhs - k) / a;
    if ([0, 0.5, 1].includes(Math.abs(val))) throw new Reject();
    const sols = roots((x) => FN_VALUE[fn](x) - val, 0, 2 * PI);
    const fields = [field(roundedSet(sols, inRad), 'x =', inRad ? 'Radians, to the nearest hundredth' : 'Degrees, to the nearest tenth')];
    const lhs = `${a}\\${fn} x${k ? (k > 0 ? ` + ${k}` : ` - ${-k}`) : ''}`;
    const ref = Math.abs(fn === 'sin' ? Math.asin(val) : fn === 'cos' ? Math.acos(Math.abs(val)) : Math.atan(val));
    const refShow = inRad ? ref.toFixed(4) : `${((ref * 180) / PI).toFixed(2)}^\\circ`;
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(`${lhs} = ${rhs}`)} for ${m(domTex(0, 360, inRad))}. Round to the nearest ${inRad ? 'hundredth of a radian' : 'tenth of a degree'}.`,
      format: 'input',
      fields,
      hints: [`Isolate ${m(`\\${fn} x`)}.`, `Find the reference angle with ${m(`\\${fn}^{-1}`)} of the positive value, in ${inRad ? 'radian' : 'degree'} mode.`, `Place it in the two quadrants where ${m(`\\${fn}`)} is ${val > 0 ? 'positive' : 'negative'}.`],
      solution: [
        { tex: m(`\\${fn} x = \\frac{${rhs}${k ? (k > 0 ? ` - ${k}` : ` + ${-k}`) : ''}}{${a}} = ${roundTo(val, 4)}`), why: 'Isolate the function.' },
        { tex: `Reference angle ${m(`\\${fn}^{-1}(${roundTo(Math.abs(val), 4)}) \\approx ${refShow}`)}.`, why: 'Use the positive value for the reference angle.' },
        { tex: `${m(`x \\approx ${fields[0].answer.tex}`)}.`, why: `${m(`\\${fn}`)} is ${val > 0 ? 'positive' : 'negative'} in ${fn === 'tan' ? (val > 0 ? 'I and III' : 'II and IV') : fn === 'sin' ? (val > 0 ? 'I and II' : 'III and IV') : val > 0 ? 'I and IV' : 'II and III'}.` },
      ],
    };
  },
};

const fdMc: Generator = {
  id: 'u4-fd-mc',
  nodeId: 'T5.first-degree',
  title: 'Choose the complete solution set',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.6);
    const fn = rng.pick(['sin', 'cos', 'tan'] as Fn[]);
    const { e } = exactEq(rng, fn);
    const hi = tier === 3 ? 720 : 360;
    const sol = solveSpecial(fn, e.value, 0, hi);
    const opp = solveSpecial(fn, -e.value, 0, hi);
    const L = (ds: number[]) => m(listTex(ds, inRad));
    return {
      cognitive: 'conceptual',
      stem: `Which is the solution set of ${m(eqTex(fn, e, tier > 1))} for ${m(domTex(0, hi, inRad))}?`,
      format: 'mc',
      choices: mc({ tex: L(sol), key: sol.join() }, [
        { tex: L([sol[0]]), key: String(sol[0]), mis: 'trig-missing-solutions', feedback: `${m(`\\${fn}`)} has the same value in two quadrants per cycle.` },
        { tex: L(opp), key: opp.join(), mis: 'trig-cast-sign', feedback: `${m(`\\${fn} x`)} is ${e.value > 0 ? 'positive' : 'negative'}: check CAST.` },
        { tex: L([...sol, sol[0] + hi]), key: [...sol, sol[0] + hi].join(), mis: 'trig-domain-ignore', feedback: `${m(angTex(sol[0] + hi, inRad))} is outside the domain.` },
        { tex: L(sol.slice(0, sol.length / 2)), key: `h${sol.slice(0, sol.length / 2).join()}`, mis: 'trig-domain-ignore', feedback: 'The domain covers more than one cycle.' },
      ]),
      hints: [`Isolate ${m(`\\${fn} x`)}.`, 'Find the reference angle, then the quadrants from CAST.', `Count the cycles in the domain: each one adds solutions.`],
      solution: [{ tex: `${m(`\\${fn} x = ${e.tex}`)}.` }, { tex: `${L(sol)}.`, why: 'Both quadrants, every cycle in the domain.' }],
    };
  },
};

// ---------------------------------------------------------------- T5.general

/** General solution for fn x = e: the roots in one period and the period (degrees). */
function general(fn: Fn, v: number): { roots: number[]; period: number } {
  const P = fn === 'tan' || fn === 'cot' ? 180 : 360;
  const rs = solveSpecial(fn, v, 0, P);
  // Two roots exactly half a period apart collapse to one with half the period (e.g. sin x = 0).
  if (rs.length === 2 && rs[1] - rs[0] === P / 2) return { roots: [rs[0]], period: P / 2 };
  return { roots: rs, period: P };
}
const genTex = (g: { roots: number[]; period: number }, inRad: boolean) => g.roots.map((r) => `x = ${r === 0 ? '' : `${angTex(r, inRad)} + `}${angTex(g.period, inRad)} n`).join(',\\ ') + ',\\ n \\in I';

const genWrite: Generator = {
  id: 'u4-gen-write',
  nodeId: 'T5.general',
  title: 'Write the general solution',
  make(rng, tier): Draft {
    const inRad = tier > 1;
    const fn = pickFn(rng, tier);
    const { e } = exactEq(rng, fn);
    const g = general(fn, e.value);
    const spec: AnswerSpec = { kind: 'general', roots: g.roots.map((r) => (inRad ? rad(r) : r)), period: inRad ? rad(g.period) : g.period, tex: genTex(g, inRad), deg: !inRad };
    return {
      cognitive: 'procedural',
      stem: `Determine the general solution of ${m(eqTex(fn, e, tier > 1))}${inRad ? ', in radians' : ', in degrees'}.`,
      format: 'input',
      fields: [field(spec, undefined, 'Use n for the integer: x = a + bn, n ∈ I')],
      hints: [`Solve over one period first: ${m(`0 \\le x < ${angTex(g.period === 180 ? 180 : 360, inRad)}`)}.`, `${fn === 'tan' || fn === 'cot' ? 'Tangent and cotangent repeat' : 'Sine, cosine and their reciprocals repeat'} every ${m(angTex(fn === 'tan' || fn === 'cot' ? 180 : 360, inRad))}.`, 'Add the period times n to each solution.'],
      solution: [
        { tex: `${m(`\\${fn} x = ${e.tex}`)} in one period: ${m(listTex(solveSpecial(fn, e.value, 0, fn === 'tan' || fn === 'cot' ? 180 : 360), inRad))}.` },
        { tex: m(genTex(g, inRad)), why: g.period === 180 && fn !== 'tan' && fn !== 'cot' ? 'The two roots are half a cycle apart, so one term with half the period covers both.' : 'Add whole periods.' },
      ],
    };
  },
};

const genMc: Generator = {
  id: 'u4-gen-mc',
  nodeId: 'T5.general',
  title: 'Choose the general solution',
  make(rng, tier): Draft {
    const inRad = tier > 1 || rng.chance(0.5);
    const fn = rng.pick(tier === 1 ? (['sin', 'cos'] as Fn[]) : (['sin', 'cos', 'tan'] as Fn[]));
    const { e } = exactEq(rng, fn);
    const g = general(fn, e.value);
    const P = g.period;
    const wrongP = fn === 'tan' ? 360 : 180;
    const opp = general(fn, -e.value);
    const T = (x: { roots: number[]; period: number }) => m(genTex(x, inRad));
    return {
      cognitive: 'conceptual',
      stem: `Which is the general solution of ${m(eqTex(fn, e, true))}?`,
      format: 'mc',
      choices: mc({ tex: T(g), key: 'r' }, [
        { tex: T({ roots: g.roots, period: wrongP }), key: 'p', mis: 'trig-general-period', feedback: fn === 'tan' ? 'Tangent repeats every half turn.' : `Adding ${m(angTex(180, inRad))} to a solution of a sine or cosine equation changes the sign.` },
        ...(g.roots.length > 1 ? [{ tex: T({ roots: [g.roots[0]], period: P }), key: 'one', mis: 'trig-missing-solutions', feedback: 'Each cycle has two solutions.' }] : []),
        { tex: T(opp), key: 'opp', mis: 'trig-cast-sign' },
        { tex: T({ roots: g.roots, period: P / 2 }), key: 'half', mis: 'trig-general-period' },
      ]),
      hints: ['Solve over one period first.', `Period of ${m(`\\${fn}`)}: ${m(angTex(fn === 'tan' ? 180 : 360, inRad))}.`, 'Add the period times n to each solution.'],
      solution: [{ tex: `One period: ${m(listTex(solveSpecial(fn, e.value, 0, fn === 'tan' ? 180 : 360), inRad))}.` }, { tex: T(g), why: 'Add whole periods to each.' }],
    };
  },
};

const genList: Generator = {
  id: 'u4-gen-list',
  nodeId: 'T5.general',
  title: 'From general solution to a domain',
  make(rng, tier): Draft {
    const inRad = tier > 1;
    const fn = rng.pick(['sin', 'cos', 'tan'] as Fn[]);
    const { e } = exactEq(rng, fn);
    const g = general(fn, e.value);
    const [lo, hi] = tier === 3 ? rng.pick([[-360, 360], [-720, 0], [-180, 540]]) : rng.pick([[0, 720], [-360, 360]]);
    const sol: number[] = [];
    for (const r of g.roots) for (let n = -10; n <= 10; n++) {
      const v = r + g.period * n;
      if (v >= lo && v <= hi) sol.push(v);
    }
    return {
      cognitive: 'procedural',
      stem: `The general solution of an equation is ${m(genTex(g, inRad))}. List the solutions with ${m(domTex(lo, hi, inRad, true))}.`,
      format: 'input',
      fields: [field(angleSet(sol, inRad), 'x =', 'Separate solutions with commas')],
      hints: ['Substitute integers for $n$: 0, ±1, ±2, …', 'Keep values inside the domain, including the endpoints.', `Each step changes ${m('x')} by ${m(angTex(g.period, inRad))}.`],
      solution: [{ tex: `Try ${m('n = \\ldots, -2, -1, 0, 1, 2, \\ldots')} in each term.` }, { tex: `${m(`x = ${listTex(sol, inRad)}`)}.`, why: 'Only values inside the domain.' }],
    };
  },
};

// ---------------------------------------------------------------- T5.second-degree

/** Factor (p·u − q) as [p, q] with surd-free values u = q/p. */
const ROOTS: Record<string, { v: number; p: number; q: number }> = {
  '0': { v: 0, p: 1, q: 0 },
  '1': { v: 1, p: 1, q: 1 },
  '-1': { v: -1, p: 1, q: -1 },
  '\\frac{1}{2}': { v: 0.5, p: 2, q: 1 },
  '-\\frac{1}{2}': { v: -0.5, p: 2, q: -1 },
  '2': { v: 2, p: 1, q: 2 },
  '-2': { v: -2, p: 1, q: -2 },
  '3': { v: 3, p: 1, q: 3 },
};

const sq = (fn: string) => `\\${fn}^2 x`;
/** Quadratic in u = fn x from two roots: (p1 u − q1)(p2 u − q2). */
function quad(fn: Fn, r1: string, r2: string) {
  const A = ROOTS[r1];
  const B = ROOTS[r2];
  const a = A.p * B.p;
  const b = -(A.p * B.q + A.q * B.p);
  const c = A.q * B.q;
  const term = (k: number, body: string, first: boolean) => (k === 0 ? '' : `${first ? (k < 0 ? '-' : '') : k < 0 ? ' - ' : ' + '}${Math.abs(k) === 1 && body ? '' : Math.abs(k)}${body}`);
  const tex = `${term(a, sq(fn), true)}${term(b, `\\${fn} x`, false)}${term(c, '', false)} = 0`;
  const fac = (r: { p: number; q: number }) => (r.q === 0 ? `\\${fn} x` : `\\left(${r.p === 1 ? '' : r.p}\\${fn} x ${r.q > 0 ? '-' : '+'} ${Math.abs(r.q)}\\right)`);
  return { tex, factored: `${fac(A)}${fac(B)} = 0`, vals: [A.v, B.v], keys: [r1, r2] };
}

function sdCase(rng: R, tier: number) {
  const fn = rng.pick(tier === 3 ? (['sin', 'cos', 'tan'] as Fn[]) : (['sin', 'cos'] as Fn[]));
  const keys = Object.keys(ROOTS);
  const pool = tier === 1 ? ['0'] : keys.filter((k) => k !== '0');
  const r1 = rng.pick(pool);
  const r2 = rng.pick(keys.filter((k) => k !== r1 && (fn === 'tan' || Math.abs(ROOTS[k].v) <= 1 || ROOTS[r1].v !== ROOTS[k].v)));
  if (fn === 'tan' && (Math.abs(ROOTS[r1].v) === 0.5 || Math.abs(ROOTS[r2].v) === 0.5 || Math.abs(ROOTS[r1].v) >= 2 || Math.abs(ROOTS[r2].v) >= 2)) throw new Reject();
  if (fn !== 'tan' && Math.abs(ROOTS[r1].v) > 1 && Math.abs(ROOTS[r2].v) > 1) throw new Reject();
  const q = quad(fn, r1, r2);
  return { fn, ...q };
}
const solveVals = (fn: Fn, vals: number[], lo: number, hi: number) => [...new Set(vals.flatMap((v) => (fn === 'tan' || Math.abs(v) <= 1 ? solveSpecial(fn, v, lo, hi) : [])))].sort((a, b) => a - b);

const sdFactor: Generator = {
  id: 'u4-sd-factor',
  nodeId: 'T5.second-degree',
  title: 'Solve by factoring',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.6);
    const { fn, tex, factored, vals, keys } = sdCase(rng, tier);
    const sol = solveVals(fn, vals, 0, 360);
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(tex)} for ${m(domTex(0, 360, inRad))}. Give exact values.`,
      format: 'input',
      fields: [field(angleSet(sol, inRad), 'x =', 'Separate solutions with commas; type ∅ if there are none')],
      hints: [`Let ${m(`u = \\${fn} x`)}: it is a quadratic in ${m('u')}.`, `Factor: ${m(factored)}.`, `Solve each factor. ${fn !== 'tan' ? `${m(`\\${fn} x`)} cannot be outside ${m('[-1, 1]')}.` : ''}`],
      solution: [
        { tex: m(factored), why: tier === 1 ? 'Common factor. Do not divide by it: that loses solutions.' : 'Factor as a quadratic in the trig function.' },
        ...vals.map((v, i) => ({ tex: `${m(`\\${fn} x = ${keys[i]}`)}: ${fn !== 'tan' && Math.abs(v) > 1 ? 'no solution, outside the range.' : m(listTex(solveSpecial(fn, v, 0, 360), inRad))}` })),
        { tex: `${m(`x = ${listTex(sol, inRad)}`)}.` },
      ],
    };
  },
};

const sdMc: Generator = {
  id: 'u4-sd-mc',
  nodeId: 'T5.second-degree',
  title: 'Divide or factor?',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.5);
    // k·sin x·cos x = r·cos x  →  cos x (k sin x − r) = 0
    const [g, h] = rng.pick([['sin', 'cos'], ['cos', 'sin']] as [Fn, Fn][]);
    const [k, r, v] = rng.pick([[2, '1', 0.5], [2, '-1', -0.5], [2, '\\sqrt{3}', Math.sqrt(3) / 2], ['\\sqrt{2}', '1', Math.SQRT1_2]] as [number | string, string, number][]);
    const eq = `${k}\\${g} x\\${h} x = ${r === '1' ? '' : r === '-1' ? '-' : r}\\${h} x`;
    const zero = solveSpecial(h, 0, 0, 360);
    const rest = solveSpecial(g, v, 0, 360);
    const all = [...new Set([...zero, ...rest])].sort((a, b) => a - b);
    const L = (ds: number[]) => m(listTex([...new Set(ds)].sort((a, b) => a - b), inRad));
    return {
      cognitive: 'conceptual',
      stem: `Which is the solution set of ${m(eq)} for ${m(domTex(0, 360, inRad))}?`,
      format: 'mc',
      choices: mc({ tex: L(all), key: all.join() }, [
        { tex: L(rest), key: rest.join(), mis: 'trig-divide-by-trig', feedback: `Dividing by ${m(`\\${h} x`)} loses the solutions of ${m(`\\${h} x = 0`)}. Factor instead.` },
        { tex: L([...zero, rest[0]]), key: [...zero, rest[0]].join(), mis: 'trig-missing-solutions' },
        { tex: L(zero), key: zero.join(), mis: 'trig-missing-solutions' },
        { tex: L([...solveSpecial(g, -v, 0, 360), ...zero]), key: `o${solveSpecial(g, -v, 0, 360).join()}`, mis: 'trig-cast-sign' },
      ]),
      hints: ['Never divide by an expression that can be zero.', `Move everything to one side and factor out ${m(`\\${h} x`)}.`, `${m(`\\${h} x\\left(${k}\\${g} x - ${r}\\right) = 0`)}.`],
      solution: [
        { tex: m(`\\${h} x\\left(${k}\\${g} x ${r.startsWith('-') ? '+' : '-'} ${r.replace('-', '')}\\right) = 0`), why: 'Factor; dividing would lose solutions.' },
        { tex: `${m(`\\${h} x = 0`)}: ${L(zero)}. ${m(`\\${g} x = ${exact(g, rest[0])!.tex}`)}: ${L(rest)}.` },
        { tex: `${L(all)}.` },
      ],
    };
  },
};

const sdApprox: Generator = {
  id: 'u4-sd-approx',
  nodeId: 'T5.second-degree',
  title: 'Second degree with a calculator root',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.5);
    const fn = rng.pick(['sin', 'cos'] as Fn[]);
    const p = rng.pick([3, 4, 5]);
    const q = rng.pick([-1, 1]) * rng.int(1, p - 1);
    if (Math.abs(q / p) === 0.5) throw new Reject();
    const exactKey = rng.pick(tier === 1 ? ['1', '-1'] : ['1', '-1', '\\frac{1}{2}', '-\\frac{1}{2}', '2', '-2']);
    const E = ROOTS[exactKey];
    // (p u − q)(E.p u − E.q)
    const a = p * E.p;
    const b = -(p * E.q + q * E.p);
    const c = q * E.q;
    const term = (kk: number, body: string, first: boolean) => (kk === 0 ? '' : `${first ? (kk < 0 ? '-' : '') : kk < 0 ? ' - ' : ' + '}${Math.abs(kk) === 1 && body ? '' : Math.abs(kk)}${body}`);
    const tex = `${term(a, sq(fn), true)}${term(b, `\\${fn} x`, false)}${term(c, '', false)} = 0`;
    const fac = (pp: number, qq: number) => `\\left(${pp === 1 ? '' : pp}\\${fn} x ${qq > 0 ? '-' : '+'} ${Math.abs(qq)}\\right)`;
    const xs = [...roots((x) => FN_VALUE[fn](x) - q / p, 0, 2 * PI), ...(Math.abs(E.v) <= 1 ? solveSpecial(fn, E.v, 0, 360).map(rad) : [])];
    const spec = roundedSet(xs, inRad);
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(tex)} for ${m(domTex(0, 360, inRad))}. Round to the nearest ${inRad ? 'hundredth of a radian' : 'tenth of a degree'}.`,
      format: 'input',
      fields: [field(spec, 'x =', 'Separate solutions with commas')],
      hints: [`Factor as a quadratic in ${m(`\\${fn} x`)}.`, `${m(`${fac(p, q)}${fac(E.p, E.q)} = 0`)}.`, `One factor gives an exact angle${Math.abs(E.v) > 1 ? ' (or none)' : ''}; the other needs ${m(`\\${fn}^{-1}`)}.`],
      solution: [
        { tex: m(`${fac(p, q)}${fac(E.p, E.q)} = 0`), why: 'Factor.' },
        { tex: `${m(`\\${fn} x = \\frac{${q}}{${p}}`)}: two solutions from the reference angle ${m(`\\${fn}^{-1}\\left(\\frac{${Math.abs(q)}}{${p}}\\right)`)}.` },
        { tex: `${m(`\\${fn} x = ${exactKey}`)}: ${Math.abs(E.v) > 1 ? 'no solution, outside the range of ' + m(`\\${fn}`) + '.' : m(listTex(solveSpecial(fn, E.v, 0, 360), inRad))}` },
        { tex: `${m(`x \\approx ${spec.tex}`)}.` },
      ],
    };
  },
};

// ---------------------------------------------------------------- T5.graphical

const grIntersect: Generator = {
  id: 'u4-gr-intersect',
  nodeId: 'T5.graphical',
  title: 'Solve graphically',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.6);
    const a = rng.int(2, 4);
    const k = rng.int(-2, 3);
    const form = tier === 1 ? 'shift' : rng.pick(['mixed', 'double', 'shift']);
    let tex = '';
    let f: (x: number) => number;
    if (form === 'shift') {
      const fn = rng.pick(['sin', 'cos'] as const);
      const c = rng.int(1, 9) / 10 * rng.pick([-1, 1]) * a;
      tex = `${a}\\${fn} x ${k >= 0 ? '+' : '-'} ${Math.abs(k)} = ${roundTo(c + k, 2)}`;
      f = (x) => a * FN_VALUE[fn](x) + k - roundTo(c + k, 2);
    } else if (form === 'mixed') {
      const b = rng.int(1, 3);
      tex = `${a}\\sin x = ${b}\\cos x ${k >= 0 ? '+' : '-'} ${Math.abs(k)}`;
      f = (x) => a * Math.sin(x) - b * Math.cos(x) - k;
    } else {
      const v = rng.int(1, 9) / 10 * rng.pick([-1, 1]);
      tex = `${a}\\sin 2x = ${roundTo(a * v, 1)}`;
      f = (x) => a * Math.sin(2 * x) - roundTo(a * v, 1);
    }
    const xs = roots(f, 0, 2 * PI);
    if (!xs.length) throw new Reject();
    // Reject near-tangent intersections: the graphs must cross clearly.
    if (xs.some((x) => Math.abs(f(x + 1e-3) - f(x - 1e-3)) < 2e-4)) throw new Reject();
    const spec = roundedSet(xs, inRad);
    return {
      cognitive: 'procedural',
      stem: `Use a graphing calculator to solve ${m(tex)} for ${m(domTex(0, 360, inRad))}. Round to the nearest ${inRad ? 'hundredth' : 'tenth of a degree'}.`,
      format: 'input',
      fields: [field(spec, 'x =', 'Separate solutions with commas')],
      hints: [`${inRad ? 'Radian' : 'Degree'} mode. Enter each side as ${m('Y_1')} and ${m('Y_2')}.`, `Window: x from 0 to ${inRad ? '2π' : '360'}, y wide enough for both graphs.`, 'Use 2nd TRACE, intersect, once for each crossing.'],
      solution: [
        { tex: `${m(`Y_1 = ${tex.split(' = ')[0]}`)}, ${m(`Y_2 = ${tex.split(' = ')[1]}`)}, ${inRad ? 'radian' : 'degree'} mode, ${m(`0 \\le x \\le ${inRad ? '2\\pi' : '360'}`)}.` },
        { tex: `Intersections at ${m(`x \\approx ${spec.tex}`)}.`, why: `${xs.length} crossing${xs.length === 1 ? '' : 's'} in the domain.` },
      ],
    };
  },
};

const grWindow: Generator = {
  id: 'u4-gr-window',
  nodeId: 'T5.graphical',
  title: 'Calculator mode and window',
  make(rng, tier): Draft {
    const inRad = tier === 1 ? rng.chance(0.5) : rng.chance(0.6);
    const a = rng.int(2, 5);
    const d = rng.int(-3, 6);
    const hi = tier === 3 ? 2 : 1;
    const xMax = inRad ? (hi === 2 ? '4\\pi' : '2\\pi') : String(360 * hi);
    const fnTex = `${a}\\sin x ${d >= 0 ? '+' : '-'} ${Math.abs(d)}`;
    const win = (mode: string, x: string, y: [number, number]) => `${mode} mode; ${m(`x: [0, ${x}]`)}, ${m(`y: [${y[0]}, ${y[1]}]`)}`;
    const yOk: [number, number] = [d - a - 2, d + a + 2];
    const yLo = Math.max(1, d + 1);
    return {
      cognitive: 'conceptual',
      stem: `To solve ${m(`${fnTex} = 0`)} for ${m(`0 \\le x < ${inRad ? xMax : `${xMax}^\\circ`}`)} graphically, which calculator setting shows every solution?`,
      format: 'mc',
      choices: mc({ tex: win(inRad ? 'Radian' : 'Degree', xMax, yOk), key: 'r' }, [
        { tex: win(inRad ? 'Degree' : 'Radian', xMax, yOk), key: 'mode', mis: 'calc-mode', feedback: 'The mode must match the units of the domain.' },
        { tex: win(inRad ? 'Radian' : 'Degree', inRad ? String(360 * hi) : hi === 2 ? '4\\pi' : '2\\pi', yOk), key: 'x', mis: 'calc-mode', feedback: inRad ? `${360 * hi} radians is about ${Math.round((360 * hi) / (2 * Math.PI))} turns.` : `In degree mode, $x$ must run to ${xMax}.` },
        { tex: win(inRad ? 'Radian' : 'Degree', xMax, [yLo, yLo + 2 * a]), key: 'y', mis: 'calc-window', feedback: `The graph runs from ${m(String(d - a))} to ${m(String(d + a))}; the window must include where it crosses ${m('y = 0')}.` },
        { tex: win(inRad ? 'Radian' : 'Degree', inRad ? (hi === 2 ? '2\\pi' : '\\pi') : String(180 * hi), yOk), key: 'half', mis: 'trig-domain-ignore' },
      ]),
      hints: ['Match the mode to the units.', 'The x-window is the domain.', `The y-window must include the range ${m(`[${d - a}, ${d + a}]`)} or at least the crossing.`],
      solution: [{ tex: `${inRad ? 'Radian' : 'Degree'} mode, ${m(`x: [0, ${xMax}]`)}, and a ${m('y')}-window that covers ${m(`${d - a} \\le y \\le ${d + a}`)}.` }],
    };
  },
};

const grCount: Generator = {
  id: 'u4-gr-count',
  nodeId: 'T5.graphical',
  title: 'Count the solutions from a graph',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.6);
    const b = rng.pick(tier === 1 ? [1, 2] : [2, 3, 4]);
    const a = rng.int(2, 4);
    const d = rng.int(-1, 2);
    const k = d + rng.pick([-1, 1]) * rng.int(1, 2 * a - 1) / 2;
    if (Math.abs(k - d) >= a) throw new Reject();
    const fn = rng.pick(['sin', 'cos'] as const);
    const f = (x: number) => a * FN_VALUE[fn](b * x) + d;
    const n = roots((x) => f(x) - k, 0, 2 * PI).length;
    const K = inRad ? 1 : 180 / PI;
    return {
      cognitive: 'conceptual',
      stem: `The graphs of ${m(`y = ${a}\\${fn} ${b === 1 ? '' : b}x ${d ? (d > 0 ? `+ ${d}` : `- ${-d}`) : ''}`)} and ${m(`y = ${k}`)} are shown. How many solutions does ${m(`${a}\\${fn} ${b === 1 ? '' : b}x ${d ? (d > 0 ? `+ ${d}` : `- ${-d}`) : ''} = ${k}`)} have for ${m(domTex(0, 360, inRad))}?`,
      graph: {
        view: { x: [-0.2 * K, 2 * PI * K + 0.2 * K], y: [Math.min(0, d - a) - 1, Math.max(0, d + a) + 1] },
        curves: [
          { fn: (x) => f(x / K), role: 'image', domain: [0, 2 * PI * K] },
          { fn: () => k, role: 'aux', domain: [0, 2 * PI * K] },
        ],
        ticks: { x: (inRad ? PI / 4 : 45), xLabel: inRad ? PI / 2 : 90, xUnit: inRad ? 'pi' : 'deg' },
      },
      format: 'mc',
      choices: mc({ tex: String(n), key: n }, [
        { tex: String(n / b), key: n / b, mis: 'trig-missing-solutions', feedback: `${m(`b = ${b}`)} fits ${b} cycles into the domain.` },
        { tex: String(n + 1), key: n + 1, mis: 'trig-domain-ignore', feedback: `${m(`x = ${inRad ? '2\\pi' : '360^\\circ'}`)} is not in the domain.` },
        { tex: String(n - 1), key: n - 1, mis: 'trig-domain-ignore' },
        { tex: String(2 * n), key: 2 * n, mis: 'trig-domain-ignore' },
      ]),
      hints: ['Count where the line crosses the curve.', `The curve has period ${m(angTex(360 / b, inRad))}: ${b} cycle${b === 1 ? '' : 's'} in the domain.`, 'A horizontal line strictly between the max and min crosses each cycle twice.'],
      solution: [{ tex: `Period ${m(angTex(360 / b, inRad))}, so ${b} cycle${b === 1 ? '' : 's'}; two crossings per cycle.` }, { tex: `${m(String(n))} solutions.` }],
    };
  },
};

// ---------------------------------------------------------------- T5.identity-sub

type Part = { fn: Fn; v: number; shift?: number };
type SubCase = { eq: string; sub: string; steps: string[]; parts: Part[]; note?: string; wrong: [string, string, string] };
const S3 = Math.sqrt(3) / 2;
const DOUBLE: SubCase[] = [
  { eq: '\\sin 2x = \\sin x', sub: '\\sin 2x = 2\\sin x\\cos x', steps: ['2\\sin x\\cos x - \\sin x = 0', '\\sin x\\left(2\\cos x - 1\\right) = 0'], parts: [{ fn: 'sin', v: 0 }, { fn: 'cos', v: 0.5 }], wrong: ['2\\sin x', '\\sin^2 x', '\\cos^2 x - \\sin^2 x'] },
  { eq: '\\sin 2x = \\cos x', sub: '\\sin 2x = 2\\sin x\\cos x', steps: ['2\\sin x\\cos x - \\cos x = 0', '\\cos x\\left(2\\sin x - 1\\right) = 0'], parts: [{ fn: 'cos', v: 0 }, { fn: 'sin', v: 0.5 }], wrong: ['2\\sin x', '\\sin^2 x', '2\\cos^2 x - 1'] },
  { eq: '\\sin 2x + \\sqrt{3}\\cos x = 0', sub: '\\sin 2x = 2\\sin x\\cos x', steps: ['2\\sin x\\cos x + \\sqrt{3}\\cos x = 0', '\\cos x\\left(2\\sin x + \\sqrt{3}\\right) = 0'], parts: [{ fn: 'cos', v: 0 }, { fn: 'sin', v: -S3 }], wrong: ['2\\sin x', '\\sin^2 x', '1 - 2\\sin^2 x'] },
  { eq: '\\cos 2x = \\cos x', sub: '\\cos 2x = 2\\cos^2 x - 1', steps: ['2\\cos^2 x - \\cos x - 1 = 0', '\\left(2\\cos x + 1\\right)\\left(\\cos x - 1\\right) = 0'], parts: [{ fn: 'cos', v: -0.5 }, { fn: 'cos', v: 1 }], wrong: ['1 - 2\\sin^2 x', '2\\cos x', '\\cos^2 x + \\sin^2 x'] },
  { eq: '\\cos 2x + \\sin x = 0', sub: '\\cos 2x = 1 - 2\\sin^2 x', steps: ['1 - 2\\sin^2 x + \\sin x = 0', '2\\sin^2 x - \\sin x - 1 = 0', '\\left(2\\sin x + 1\\right)\\left(\\sin x - 1\\right) = 0'], parts: [{ fn: 'sin', v: -0.5 }, { fn: 'sin', v: 1 }], wrong: ['2\\cos^2 x - 1', '2\\cos x', '\\cos^2 x + \\sin^2 x'] },
  { eq: '\\cos 2x = \\sin x', sub: '\\cos 2x = 1 - 2\\sin^2 x', steps: ['2\\sin^2 x + \\sin x - 1 = 0', '\\left(2\\sin x - 1\\right)\\left(\\sin x + 1\\right) = 0'], parts: [{ fn: 'sin', v: 0.5 }, { fn: 'sin', v: -1 }], wrong: ['2\\cos^2 x - 1', '2\\cos x', '1 - \\sin^2 x'] },
  { eq: '\\cos 2x + 3\\cos x + 2 = 0', sub: '\\cos 2x = 2\\cos^2 x - 1', steps: ['2\\cos^2 x + 3\\cos x + 1 = 0', '\\left(2\\cos x + 1\\right)\\left(\\cos x + 1\\right) = 0'], parts: [{ fn: 'cos', v: -0.5 }, { fn: 'cos', v: -1 }], wrong: ['1 - 2\\sin^2 x', '2\\cos x', '\\cos^2 x + \\sin^2 x'] },
  { eq: '\\cos x\\cos\\frac{\\pi}{4} - \\sin x\\sin\\frac{\\pi}{4} = \\frac{1}{2}', sub: '\\cos A\\cos B - \\sin A\\sin B = \\cos(A + B)', steps: ['\\cos\\left(x + \\frac{\\pi}{4}\\right) = \\frac{1}{2}', 'x + \\frac{\\pi}{4} = \\frac{\\pi}{3} \\text{ or } \\frac{5\\pi}{3} \\ (+2\\pi n)'], parts: [{ fn: 'cos', v: 0.5, shift: 45 }], wrong: ['\\cos(x - B) \\text{ (the difference identity)}', '\\cos x + \\cos\\frac{\\pi}{4} \\text{ (distribute cos)}', '\\sin(x + B)'] },
];
const PYTH: SubCase[] = [
  { eq: '2\\sin^2 x = 3\\cos x', sub: '\\sin^2 x = 1 - \\cos^2 x', steps: ['2 - 2\\cos^2 x = 3\\cos x', '2\\cos^2 x + 3\\cos x - 2 = 0', '\\left(2\\cos x - 1\\right)\\left(\\cos x + 2\\right) = 0'], parts: [{ fn: 'cos', v: 0.5 }], note: '$\\cos x = -2$ has no solution.', wrong: ['\\cos^2 x - 1', '1 + \\cos^2 x', '1 - \\cos x'] },
  { eq: '\\sec^2 x - \\tan x - 1 = 0', sub: '\\sec^2 x = 1 + \\tan^2 x', steps: ['1 + \\tan^2 x - \\tan x - 1 = 0', '\\tan x\\left(\\tan x - 1\\right) = 0'], parts: [{ fn: 'tan', v: 0 }, { fn: 'tan', v: 1 }], wrong: ['1 - \\tan^2 x', '\\tan^2 x - 1', '1 + \\tan x'] },
  { eq: '2\\cos^2 x + 3\\sin x - 3 = 0', sub: '\\cos^2 x = 1 - \\sin^2 x', steps: ['2 - 2\\sin^2 x + 3\\sin x - 3 = 0', '2\\sin^2 x - 3\\sin x + 1 = 0', '\\left(2\\sin x - 1\\right)\\left(\\sin x - 1\\right) = 0'], parts: [{ fn: 'sin', v: 0.5 }, { fn: 'sin', v: 1 }], wrong: ['\\sin^2 x - 1', '1 + \\sin^2 x', '1 - \\sin x'] },
  { eq: '2\\sin^2 x + \\cos x - 1 = 0', sub: '\\sin^2 x = 1 - \\cos^2 x', steps: ['2 - 2\\cos^2 x + \\cos x - 1 = 0', '2\\cos^2 x - \\cos x - 1 = 0', '\\left(2\\cos x + 1\\right)\\left(\\cos x - 1\\right) = 0'], parts: [{ fn: 'cos', v: -0.5 }, { fn: 'cos', v: 1 }], wrong: ['\\cos^2 x - 1', '1 + \\cos^2 x', '1 - \\cos x'] },
  { eq: '\\sin x = \\sqrt{3}\\cos x', sub: '\\tan x = \\frac{\\sin x}{\\cos x}', steps: ['\\frac{\\sin x}{\\cos x} = \\sqrt{3} \\quad (\\cos x \\ne 0)', '\\tan x = \\sqrt{3}'], parts: [{ fn: 'tan', v: Math.sqrt(3) }], note: 'Dividing by $\\cos x$ is safe here: if $\\cos x = 0$ then $\\sin x = \\pm 1$, which does not satisfy the equation.', wrong: ['\\tan x = \\frac{\\cos x}{\\sin x}', '\\sin^2 x + \\cos^2 x = 1', '\\cot x = \\frac{\\sin x}{\\cos x}'] },
];

function caseSolutions(c: SubCase, lo: number, hi: number): number[] {
  const out = c.parts.flatMap((p) => solveSpecial(p.fn, p.v, lo + (p.shift ?? 0), hi + (p.shift ?? 0)).map((s) => s - (p.shift ?? 0)));
  return [...new Set(out)].sort((a, b) => a - b);
}

function subGen(id: string, title: string, cases: SubCase[]): Generator {
  return {
    id,
    nodeId: 'T5.identity-sub',
    title,
    make(rng, tier): Draft {
      const c = rng.pick(cases.filter((x) => tier > 1 || !x.parts.some((p) => p.shift)));
      const inRad = c.parts.some((p) => p.shift) || (tier > 1 && rng.chance(0.6));
      const [lo, hi, hiIn] = tier === 3 ? ([-180, 180, true] as const) : ([0, 360, false] as const);
      const sol = caseSolutions(c, lo, hiIn ? hi + 1 : hi);
      return {
        cognitive: 'problemSolving',
        stem: `Solve ${m(c.eq)} algebraically for ${m(domTex(lo, hi, inRad, hiIn))}. Give exact values.`,
        format: 'input',
        fields: [field(angleSet(sol, inRad), 'x =', 'Separate solutions with commas')],
        hints: [`Substitute ${m(c.sub)} so only one function remains (or a product you can factor).`, `${m(c.steps[c.steps.length - 1])}.`, 'Solve each factor over the domain; reject values outside the range of sine or cosine.'],
        solution: [
          { tex: m(c.sub), why: 'Choose the identity that leaves a single function or a common factor.' },
          ...c.steps.map((s) => ({ tex: m(s) })),
          ...(c.note ? [{ tex: c.note }] : []),
          { tex: `${m(`x = ${listTex(sol, inRad)}`)}.` },
        ],
      };
    },
  };
}

const isDouble = subGen('u4-is-double', 'Double-angle and sum identities in equations', DOUBLE);
const isPyth = subGen('u4-is-pyth', 'Pythagorean and quotient identities in equations', PYTH);

const isMc: Generator = {
  id: 'u4-is-mc',
  nodeId: 'T5.identity-sub',
  title: 'Choose the substitution',
  make(rng, tier): Draft {
    const c = rng.pick((tier === 1 ? DOUBLE.slice(0, 7) : [...DOUBLE, ...PYTH]).filter((x) => x.eq.includes(x.sub.split(' = ')[0].replace(/^\\\\tan x$/, '#'))));
    const left = c.sub.split(' = ')[0];
    const right = c.sub.split(' = ').slice(1).join(' = ');
    const mis = (w: string) => (/2\\(sin|cos) x$|\^2 x$/.test(w) && c.eq.includes('2x') ? 'trig-sin2-sin-squared' : /distribute/.test(w) ? 'trig-sum-distribute' : c.sub.includes('^2 x = ') || c.sub.includes('\\sec') ? 'trig-pyth-sign' : 'trig-identity-sub-wrong');
    return {
      cognitive: 'conceptual',
      stem: `To solve ${m(c.eq)} algebraically, which replacement for ${m(left)} is the best first step?`,
      format: 'mc',
      choices: mc(
        { tex: m(right), key: 'r' },
        c.wrong.map((w, i) => ({ tex: m(w), key: `w${i}`, mis: mis(w), feedback: mis(w) === 'trig-identity-sub-wrong' ? 'That leaves two different functions, or is not an identity.' : mis(w) === 'trig-sin2-sin-squared' ? (left.includes('\\sin 2x') ? '$\\sin 2x = 2\\sin x\\cos x$: not $2\\sin x$ or $\\sin^2 x$.' : `That is not equal to ${m(left)}: a double angle is not double the function or its square.`) : mis(w) === 'trig-pyth-sign' ? 'Check the signs and squares against $\\sin^2 x + \\cos^2 x = 1$.' : undefined })),
      ),
      hints: ['Aim for one trig function, or a common factor.', 'Look at the other terms in the equation.', `Pick the form of ${m(left)} that matches them.`],
      solution: [{ tex: m(c.sub), why: 'It leaves a single function or a factorable product.' }, { tex: m(c.steps[c.steps.length - 1]) }],
    };
  },
};

export const trigEquationGenerators: Generator[] = [fdExact, fdApprox, fdMc, genWrite, genMc, genList, sdFactor, sdMc, sdApprox, grIntersect, grWindow, grCount, isDouble, isPyth, isMc];
