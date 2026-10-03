// Prerequisite layer: rational expressions, rational equations, radical equations.
import { field, m, mc, type Cand } from '../../framework';
import { F, polyTex, shiftTex, signedTex } from '../../frac';
import type { Draft, Generator } from '../../types';
import { Reject } from '../../types';
import { mulP, setAns, solutionText } from './shared';

const lin = (r: number) => `\\left(${shiftTex(r)}\\right)`; // (x − r)
const den2 = (p: number, q: number) => (p === q ? `${lin(p)}^2` : `${lin(p)}${lin(q)}`);

// ---------------------------------------------------------------- P.rat-expr

const ratNpv: Generator = {
  id: 'pre-rat-npv',
  nodeId: 'P.rat-expr',
  title: 'Non-permissible values',
  make(rng, tier): Draft {
    const p = rng.int(-7, 7);
    const q = rng.int(-7, 7);
    const a = rng.int(-7, 7);
    if (p === q || a === p || a === q) throw new Reject();
    if (tier === 3) {
      const r = rng.int(-7, 7);
      const s = rng.int(-7, 7);
      if (new Set([p, q, r, s, a]).size < 5) throw new Reject();
      const expr = `\\frac{${shiftTex(a)}}{${shiftTex(p)}} \\div \\frac{${shiftTex(q)}}{${shiftTex(r)}}`;
      return {
        cognitive: 'conceptual',
        stem: `State the non-permissible values of ${m(expr)}.`,
        format: 'input',
        fields: [field(setAns([p, q, r]), 'x \\ne')],
        hints: ['A value is non-permissible if it makes any denominator zero, at any stage.', 'Dividing by a fraction means multiplying by its reciprocal, so its numerator becomes a denominator.', `Check ${m(shiftTex(p))}, ${m(shiftTex(r))} and ${m(shiftTex(q))}.`],
        solution: [
          { tex: `Denominators ${m(shiftTex(p))} and ${m(shiftTex(r))}: ${m(`x \\ne ${p}, ${r}`)}.` },
          { tex: `${m(`\\div \\frac{${shiftTex(q)}}{${shiftTex(r)}}`)} becomes ${m(`\\times \\frac{${shiftTex(r)}}{${shiftTex(q)}}`)}, so also ${m(`x \\ne ${q}`)}.`, why: 'You cannot divide by a quantity equal to zero.' },
          { tex: `${m(`x \\ne ${[p, q, r].sort((x, y) => x - y).join(', ')}`)}` },
        ],
      };
    }
    const shown = tier === 1 ? den2(p, q) : polyTex(mulP([1, -p], [1, -q]));
    return {
      cognitive: 'procedural',
      stem: `State the non-permissible values of ${m(`\\frac{${shiftTex(a)}}{${shown}}`)}.`,
      format: 'input',
      fields: [field(setAns([p, q]), 'x \\ne')],
      hints: ['Non-permissible values make the denominator zero.', tier === 2 ? 'Factor the denominator first.' : 'Set each factor of the denominator equal to zero.', `${m(`${polyTex(mulP([1, -p], [1, -q]))} = ${den2(p, q)}`)}`],
      solution: [
        ...(tier === 2 ? [{ tex: `${m(`${shown} = ${den2(p, q)}`)}` }] : []),
        { tex: `${m(`${den2(p, q)} = 0`)} when ${m(`x = ${p}`)} or ${m(`x = ${q}`)}.`, why: 'The numerator does not matter: a zero numerator is allowed.' },
        { tex: `${m(`x \\ne ${Math.min(p, q)}, ${Math.max(p, q)}`)}` },
      ],
    };
  },
};

const ratSimplify: Generator = {
  id: 'pre-rat-simplify',
  nodeId: 'P.rat-expr',
  title: 'Simplify a rational expression',
  make(rng, tier): Draft {
    const r = rng.nz(-6, 6);
    const s = rng.int(-6, 6);
    if (s === r || s === -r) throw new Reject();
    // (x − r)(x + r) / ((x − r)(x − s)) = (x + r)/(x − s), x ≠ r, s
    const num = polyTex(mulP([1, -r], [1, r]));
    const den = polyTex(mulP([1, -r], [1, -s]));
    const ans = `\\frac{${shiftTex(-r)}}{${shiftTex(s)}}`;
    const restr = (vals: number[]) => `x \\ne ${[...new Set(vals)].sort((a, b) => a - b).join(', ')}`;
    const opt = (e: string, v: number[]) => `$${e},\\ ${restr(v)}$`;
    const cands: Cand[] = [
      { tex: opt(ans, [s]), key: `ans|${s}`, mis: 'npv-after-simplify', feedback: `${m(`x = ${r}`)} made the original denominator zero; it stays non-permissible after cancelling.` },
      { tex: opt(ans, [-r, s]), key: `ans|${-r},${s}`, mis: 'npv-numerator', feedback: 'Zeros of the numerator are allowed.' },
      { tex: opt(`\\frac{${shiftTex(r)}}{${shiftTex(-s)}}`, [-r, -s]), key: `sign|${-r},${-s}`, mis: 'fac-sign-error', feedback: 'Check the signs in the factors by expanding.' },
    ];
    const b = -(r + s);
    const c = r * s;
    if (tier >= 2 && b !== 0) cands.splice(2, 0, { tex: `$\\frac{${-r * r}}{${polyTex([b, c])}},\\ x \\ne ${F(-c, b).tex()}$`, key: 'cancel', mis: 'cancel-terms', feedback: 'Only common factors cancel, never terms like $x^2$ that are added.' });
    return {
      cognitive: 'procedural',
      stem: `Simplify ${m(`\\frac{${num}}{${den}}`)} and state the non-permissible values.`,
      format: 'mc',
      choices: mc({ tex: opt(ans, [r, s]), key: `ans|${[r, s].sort((x, y) => x - y)}` }, cands),
      hints: ['Factor the numerator and the denominator.', 'State the restrictions before cancelling anything.', `${m(`${num} = ${lin(r)}${lin(-r)}`)} and ${m(`${den} = ${lin(r)}${lin(s)}`)}.`],
      solution: [
        { tex: `${m(`\\frac{${lin(r)}${lin(-r)}}{${lin(r)}${lin(s)}}`)}, so ${m(restr([r, s]))}.`, why: 'Restrictions come from the original denominator.' },
        { tex: `Cancel the common factor ${m(lin(r))}: ${m(ans)}, ${m(restr([r, s]))}.`, why: 'A common factor cancels; the restriction it caused remains.' },
      ],
    };
  },
};

const ratOperate: Generator = {
  id: 'pre-rat-operate',
  nodeId: 'P.rat-expr',
  title: 'Add, subtract and divide rational expressions',
  make(rng, tier): Draft {
    const p = rng.int(-6, 6);
    const q = rng.int(-6, 6);
    const a = rng.nz(-5, 5);
    const b = rng.int(1, 5);
    if (p === q) throw new Reject();
    const X = [7.31, 11.7];
    const key = (f: (x: number) => number) => X.map((x) => f(x).toFixed(6)).join('|');
    if (tier === 3) {
      const r = rng.int(-6, 6);
      const s = rng.int(-6, 6);
      if (new Set([p, q, r, s]).size < 4) throw new Reject();
      // (x − r)/(x − p) ÷ (x − s)/(x − q) = (x − r)(x − q)/((x − p)(x − s))
      const given = `\\frac{${shiftTex(r)}}{${shiftTex(p)}} \\div \\frac{${shiftTex(s)}}{${shiftTex(q)}}`;
      const fr = (n1: number, n2: number, d1: number, d2: number) => `\\frac{${lin(n1)}${lin(n2)}}{${lin(d1)}${lin(d2)}}`;
      const ans = fr(r, q, p, s);
      const fx = (n1: number, n2: number, d1: number, d2: number) => (x: number) => ((x - n1) * (x - n2)) / ((x - d1) * (x - d2));
      return {
        cognitive: 'procedural',
        stem: `Simplify ${m(given)}.`,
        format: 'mc',
        choices: mc({ tex: m(ans), key: key(fx(r, q, p, s)) }, [
          { tex: m(fr(r, s, p, q)), key: key(fx(r, s, p, q)), mis: 'rat-divide-flip', feedback: 'Dividing is multiplying by the reciprocal of the second fraction.' },
          { tex: m(fr(p, s, r, q)), key: key(fx(p, s, r, q)), mis: 'rat-divide-flip', feedback: 'Flip the second fraction, not the first.' },
          { tex: m(fr(p, q, r, s)), key: key(fx(p, q, r, s)), mis: 'rat-divide-flip' },
        ]),
        hints: ['Dividing by a fraction is multiplying by its reciprocal.', `Flip ${m(`\\frac{${shiftTex(s)}}{${shiftTex(q)}}`)}.`, `${m(`\\frac{${shiftTex(r)}}{${shiftTex(p)}} \\times \\frac{${shiftTex(q)}}{${shiftTex(s)}}`)}`],
        solution: [
          { tex: `${m(`\\frac{${shiftTex(r)}}{${shiftTex(p)}} \\times \\frac{${shiftTex(q)}}{${shiftTex(s)}}`)}`, why: 'Keep the first fraction, change ÷ to ×, flip the second.' },
          { tex: `${m(`= ${ans}`)}, ${m(`x \\ne ${[p, q, s].sort((x, y) => x - y).join(', ')}`)}.`, why: `${m(`x = ${s}`)} is also excluded: it would make the divisor zero.` },
        ],
      };
    }
    const sub = tier === 2;
    const s = sub ? -1 : 1;
    // a/(x − p) ± b/(x − q) = (a(x − q) ± b(x − p)) / ((x − p)(x − q))
    const numer = [a + s * b, -a * q - s * b * p];
    const den = `${lin(p)}${lin(q)}`;
    const ans = `\\frac{${polyTex(numer)}}{${den}}`;
    const f = (x: number) => a / (x - p) + (s * b) / (x - q);
    const addDen = (x: number) => (a + s * b) / (2 * x - p - q);
    const signErr = [a - b, -a * q - b * p];
    const signErrF = (x: number) => (signErr[0] * x + signErr[1]) / ((x - p) * (x - q));
    const noLcd = [a + s * b, 0];
    const cands: Cand[] = [
      { tex: m(`\\frac{${a + s * b}}{${polyTex([2, -p - q])}}`), key: key(addDen), mis: 'rat-add-denominators', feedback: 'Fractions need a common denominator; denominators are never added.' },
      { tex: m(`\\frac{${a + s * b}}{${den}}`), key: key((x) => (a + s * b) / ((x - p) * (x - q))), mis: 'rat-eq-lcd', feedback: 'Each numerator must be multiplied by the factor its denominator was missing.' },
      { tex: m(`\\frac{${polyTex(numer.map((c, i) => (i === 1 ? c + 2 * s * b * p : c)))}}{${den}}`), key: key((x) => (numer[0] * x + numer[1] + 2 * s * b * p) / ((x - p) * (x - q))), mis: sub ? 'rat-subtract-sign' : 'fac-sign-error' },
    ];
    if (sub) cands.unshift({ tex: m(`\\frac{${polyTex(signErr)}}{${den}}`), key: key(signErrF), mis: 'rat-subtract-sign', feedback: `Subtract the whole numerator: ${m(`-${b < 0 ? `(${b})` : b}${lin(p)}`)} changes the sign of both terms.` });
    void noLcd;
    if (numer[0] === 0 && numer[1] === 0) throw new Reject();
    return {
      cognitive: 'procedural',
      stem: `Simplify ${m(`\\frac{${a}}{${shiftTex(p)}} ${sub ? '-' : '+'} \\frac{${b}}{${shiftTex(q)}}`)}.`,
      format: 'mc',
      choices: mc({ tex: m(ans), key: key(f) }, cands),
      hints: ['Use the common denominator $(x - p)(x - q)$.', `Multiply ${m(String(a))} by ${m(shiftTex(q))} and ${m(String(b))} by ${m(shiftTex(p))}.`, `${m(`${a}${lin(q)} ${sub ? '-' : '+'} ${b < 0 ? `(${b})` : b}${lin(p)}`)}`],
      solution: [
        { tex: `${m(`\\frac{${a}${lin(q)} ${sub ? '-' : '+'} ${b < 0 ? `(${b})` : b}${lin(p)}}{${den}}`)}`, why: 'Each fraction is multiplied top and bottom by the factor it is missing.' },
        { tex: `${m(`= ${ans}`)}`, why: sub ? 'The subtraction applies to both terms of the second numerator.' : 'Expand and collect like terms.' },
      ],
      verify: () => Math.abs(f(3.3) - (numer[0] * 3.3 + numer[1]) / ((3.3 - p) * (3.3 - q))) < 1e-9,
    };
  },
};

// ---------------------------------------------------------------- P.rat-eq

/** x/(x − p) − (p + r)/x = p²/(x(x − p)) has roots p (non-permissible) and r. */
function extraneousFamily(p: number, r: number) {
  if (p + r === 0) throw new Reject();
  const eq = `\\frac{x}{${shiftTex(p)}} ${p + r < 0 ? '+' : '-'} \\frac{${Math.abs(p + r)}}{x} = \\frac{${p * p}}{x${lin(p)}}`;
  return { eq, quad: [1, -(p + r), p * r] };
}

const ratEqSolve: Generator = {
  id: 'pre-rateq-solve',
  nodeId: 'P.rat-eq',
  title: 'Solve a rational equation',
  make(rng, tier): Draft {
    if (tier === 1) {
      const a = rng.nz(-6, 6);
      const b = rng.nz(-6, 6);
      const p = rng.int(-6, 6);
      const q = rng.int(-6, 6);
      if (a === b || p === q) throw new Reject();
      const x = F(a * q - b * p, a - b);
      if (x.eq(p) || x.eq(q)) throw new Reject();
      return {
        cognitive: 'procedural',
        stem: `Solve ${m(`\\frac{${a}}{${shiftTex(p)}} = \\frac{${b}}{${shiftTex(q)}}`)}.`,
        format: 'input',
        fields: [field(setAns([x]), 'x =')],
        hints: [`Note the non-permissible values ${m(`x \\ne ${p}, ${q}`)}.`, 'Cross-multiply (multiply both sides by both denominators).', `${m(`${a}${lin(q)} = ${b}${lin(p)}`)}`],
        solution: [
          { tex: `${m(`x \\ne ${Math.min(p, q)}, ${Math.max(p, q)}`)}`, why: 'Record restrictions before multiplying them away.' },
          { tex: `${m(`${a}${lin(q)} = ${b}${lin(p)} \\Rightarrow ${polyTex([a - b, 0])} = ${a * q - b * p}`)}` },
          { tex: `${m(`x = ${x.tex()}`)}, which is permissible.` },
        ],
        verify: () => Math.abs(a / (x.value - p) - b / (x.value - q)) < 1e-9,
      };
    }
    if (tier === 2) {
      const p = rng.nz(-6, 6);
      const r = rng.nz(-8, 8);
      if (r === p) throw new Reject();
      const { eq, quad } = extraneousFamily(p, r);
      return {
        cognitive: 'problemSolving',
        stem: `Solve ${m(eq)}.`,
        format: 'input',
        fields: [field(setAns([r]), 'x =')],
        hints: [`Non-permissible values: ${m(`x \\ne 0, ${p}`)}.`, `Multiply every term by ${m(`x${lin(p)}`)}.`, `${m(`x^2 ${p + r < 0 ? '+' : '-'} ${Math.abs(p + r)}${lin(p)} = ${p * p}`)} simplifies to ${m(`${polyTex(quad)} = 0`)}.`],
        solution: [
          { tex: `${m(`x \\ne 0, ${p}`)}. Multiply by ${m(`x${lin(p)}`)}: ${m(`x^2 ${p + r < 0 ? '+' : '-'} ${Math.abs(p + r)}${lin(p)} = ${p * p}`)}.`, why: 'Every term, including the right side, is multiplied by the LCD.' },
          { tex: `${m(`${polyTex(quad)} = 0 \\Rightarrow ${lin(p)}${lin(r)} = 0`)}, so ${m(`x = ${p}`)} or ${m(`x = ${r}`)}.` },
          { tex: `${m(`x = ${p}`)} is non-permissible, so the only solution is ${m(`x = ${r}`)}.`, why: 'A root that makes a denominator zero is extraneous.' },
        ],
        verify: () => Math.abs(r / (r - p) - (p + r) / r - (p * p) / (r * (r - p))) < 1e-9,
      };
    }
    // a/(x − p) + b/(x − q) = 1 with two valid roots
    const p = rng.int(-5, 5);
    const q = rng.int(-5, 5);
    const r1 = rng.int(-7, 7);
    const r2 = rng.int(-7, 7);
    if (new Set([p, q, r1, r2]).size < 4) throw new Reject();
    const S = r1 + r2 - p - q;
    const P = r1 * r2 - p * q;
    if ((P - S * p) % (q - p) !== 0) throw new Reject();
    const a = (P - S * p) / (q - p);
    const b = S - a;
    if (a === 0 || b === 0) throw new Reject();
    return {
      cognitive: 'problemSolving',
      stem: `Solve ${m(`\\frac{${a}}{${shiftTex(p)}} ${b < 0 ? '-' : '+'} \\frac{${Math.abs(b)}}{${shiftTex(q)}} = 1`)}.`,
      format: 'input',
      fields: [field(setAns([r1, r2]), 'x =')],
      hints: [`Non-permissible values: ${m(`x \\ne ${Math.min(p, q)}, ${Math.max(p, q)}`)}.`, `Multiply every term by ${m(`${lin(p)}${lin(q)}`)}, including the 1.`, `You should reach ${m(`${polyTex(mulP([1, -r1], [1, -r2]))} = 0`)}.`],
      solution: [
        { tex: `${m(`${a}${lin(q)} ${b < 0 ? '-' : '+'} ${Math.abs(b)}${lin(p)} = ${lin(p)}${lin(q)}`)}`, why: 'Multiply every term by the LCD; the 1 becomes the whole LCD.' },
        { tex: `${m(`${polyTex(mulP([1, -r1], [1, -r2]))} = 0 \\Rightarrow x = ${Math.min(r1, r2)}`)} or ${m(`x = ${Math.max(r1, r2)}`)}.` },
        { tex: `Neither is ${m(String(p))} or ${m(String(q))}, so both are solutions.`, why: 'Always check roots against the non-permissible values.' },
      ],
      verify: () => [r1, r2].every((x) => Math.abs(a / (x - p) + b / (x - q) - 1) < 1e-9),
    };
  },
};

const ratEqExtraneous: Generator = {
  id: 'pre-rateq-extraneous',
  nodeId: 'P.rat-eq',
  title: 'Identify extraneous roots',
  make(rng): Draft {
    const p = rng.nz(-6, 6);
    const r = rng.nz(-8, 8);
    if (r === p) throw new Reject();
    const { eq, quad } = extraneousFamily(p, r);
    const opt = (vals: number[]) => (vals.length ? solutionText(vals) : 'no solution');
    return {
      cognitive: 'conceptual',
      stem: `Multiplying ${m(eq)} by the lowest common denominator gives ${m(`${polyTex(quad)} = 0`)}, with roots ${m(String(Math.min(p, r)))} and ${m(String(Math.max(p, r)))}. What is the solution of the original equation?`,
      format: 'mc',
      choices: mc({ tex: opt([r]), key: 'r' }, [
        { tex: opt([p, r].sort((x, y) => x - y)), key: 'both', mis: 'extraneous-keep', feedback: `${m(`x = ${p}`)} makes a denominator zero, so it is extraneous.` },
        { tex: opt([p]), key: 'p', mis: 'extraneous-reject-valid', feedback: `${m(`x = ${p}`)} is the non-permissible value; ${m(`x = ${r}`)} works.` },
        { tex: opt([]), key: 'none', mis: 'extraneous-reject-valid', feedback: `Substitute ${m(`x = ${r}`)}: both sides agree.` },
      ]),
      hints: ['List the non-permissible values of the original equation.', `The denominators are zero at ${m('x = 0')} and ${m(`x = ${p}`)}.`, `Discard any root equal to 0 or ${p}.`],
      solution: [
        { tex: `Non-permissible values: ${m(`x \\ne 0, ${p}`)}.` },
        { tex: `${m(`x = ${p}`)} is extraneous; ${m(`x = ${r}`)} is the only solution.`, why: 'Multiplying by an expression that can be zero may add roots that do not satisfy the original equation.' },
      ],
    };
  },
};

const ratEqNpvSolve: Generator = {
  id: 'pre-rateq-npv-solve',
  nodeId: 'P.rat-eq',
  title: 'Restrictions, then solve',
  make(rng): Draft {
    const p = rng.nz(-6, 6);
    const r = rng.nz(-8, 8);
    if (r === p) throw new Reject();
    const { eq, quad } = extraneousFamily(p, r);
    return {
      cognitive: 'problemSolving',
      stem: `For ${m(eq)}, state the non-permissible values, then solve.`,
      format: 'input',
      fields: [field(setAns([0, p]), 'x \\ne', 'Non-permissible values'), field(setAns([r]), 'x =', 'Solution')],
      hints: ['A value is non-permissible if any denominator is zero there.', `Multiply every term by ${m(`x${lin(p)}`)}.`, `${m(`${polyTex(quad)} = 0`)}; check each root against the restrictions.`],
      solution: [
        { tex: `Denominators ${m(shiftTex(p))}, ${m('x')}, ${m(`x${lin(p)}`)}: ${m(`x \\ne ${Math.min(0, p)}, ${Math.max(0, p)}`)}.` },
        { tex: `${m(`${polyTex(quad)} = 0 \\Rightarrow ${lin(p)}${lin(r)} = 0`)}.` },
        { tex: `${m(`x = ${p}`)} is non-permissible, so ${m(`x = ${r}`)}.`, why: 'Extraneous roots are discarded.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- P.rad-eq

/** √(x + a) = x − b with roots r (valid) and e. */
function radFamily(rng: import('../../rng').Rng, forceExtraneous: boolean) {
  const b = rng.int(-4, 4);
  const r = b + rng.int(1, 5);
  const e = 2 * b + 1 - r;
  const a = b * b - r * e;
  if (e === r) throw new Reject();
  if (r + a < 0) throw new Reject();
  const eValid = e - b >= 0;
  if (forceExtraneous && eValid) throw new Reject();
  return { a, b, r, e, eValid, quad: [1, -(2 * b + 1), b * b - a] };
}
const radEqTex = (a: number, b: number) => `\\sqrt{${shiftTex(-a)}} = ${shiftTex(b)}`;

const radEqSolve: Generator = {
  id: 'pre-radeq-solve',
  nodeId: 'P.rad-eq',
  title: 'Solve a radical equation',
  make(rng, tier): Draft {
    if (tier === 1) {
      const a = rng.pick([1, 2, 3, 4, 5]);
      const b = rng.int(-9, 9);
      const none = rng.chance(0.2);
      const c = none ? -rng.int(1, 5) : rng.int(1, 6);
      const x = F(c * c - b, a);
      const expr = `\\sqrt{${polyTex([a, b])}} = ${c}`;
      return {
        cognitive: 'procedural',
        stem: `Solve ${m(expr)}.`,
        format: 'input',
        fields: [field(setAns(none ? [] : [x]), 'x =', none ? undefined : undefined)],
        hints: [none ? 'What values can a square root take?' : 'Square both sides.', none ? 'A principal square root is never negative.' : `${m(`${polyTex([a, b])} = ${c * c}`)}`, none ? 'Type "no solution" or ∅ if there is none.' : 'Check your answer in the original equation.'],
        solution: none
          ? [{ tex: `${m('\\sqrt{\\ldots} \\ge 0')}, but the right side is ${c}.`, why: 'Squaring would give a root that fails the original equation.' }, { tex: 'No solution.' }]
          : [{ tex: `${m(`${polyTex([a, b])} = ${c * c}`)}`, why: 'Squaring undoes the root.' }, { tex: `${m(`x = ${x.tex()}`)}. Check: ${m(`\\sqrt{${c * c}} = ${c}`)}.` }],
        verify: () => none || Math.abs(Math.sqrt(a * x.value + b) - c) < 1e-9,
      };
    }
    const { a, b, r, e, eValid, quad } = radFamily(rng, tier === 2);
    const isolated = tier === 2 || rng.chance(0.4);
    const eq = isolated ? radEqTex(a, b) : `\\sqrt{${shiftTex(-a)}} ${signedTex(b)} = x`;
    const sols = eValid ? [r, e] : [r];
    return {
      cognitive: 'problemSolving',
      stem: `Solve ${m(eq)}.`,
      format: 'input',
      fields: [field(setAns(sols), 'x =')],
      hints: [isolated ? 'Square both sides.' : 'Isolate the radical first.', `${m(`x ${signedTex(a)} = ${lin(b)}^2`)}`, 'Solve the quadratic, then check every root in the original equation.'],
      solution: [
        ...(isolated ? [] : [{ tex: `${m(radEqTex(a, b))}`, why: 'Isolate the radical before squaring.' }]),
        { tex: `${m(`x ${signedTex(a)} = ${polyTex([1, -2 * b, b * b])}`)}`, why: `${m(`(x - b)^2 = x^2 - 2bx + b^2`)}; the middle term matters.` },
        { tex: `${m(`${polyTex(quad)} = 0 \\Rightarrow ${lin(r)}${lin(e)} = 0`)}` },
        { tex: eValid ? `Both roots check: ${m(`x = ${Math.min(r, e)}`)} and ${m(`x = ${Math.max(r, e)}`)}.` : `Check ${m(`x = ${e}`)}: the right side is ${m(String(e - b))}, negative, so it is extraneous. Solution ${m(`x = ${r}`)}.`, why: 'Squaring can introduce roots; a square root cannot equal a negative number.' },
      ],
      verify: () => sols.every((x) => Math.abs(Math.sqrt(x + a) - (x - b)) < 1e-9) && (eValid || Math.abs(Math.sqrt(e + a) - (e - b)) > 1e-6),
    };
  },
};

const radEqCheck: Generator = {
  id: 'pre-radeq-check',
  nodeId: 'P.rad-eq',
  title: 'Check for extraneous roots',
  make(rng): Draft {
    const { a, b, r, e, quad } = radFamily(rng, true);
    const opt = (vals: number[]) => (vals.length ? solutionText(vals) : 'no solution');
    return {
      cognitive: 'conceptual',
      stem: `Squaring both sides of ${m(radEqTex(a, b))} gives ${m(`${polyTex(quad)} = 0`)}, with roots ${m(String(Math.min(r, e)))} and ${m(String(Math.max(r, e)))}. What is the solution of the original equation?`,
      format: 'mc',
      choices: mc({ tex: opt([r]), key: 'r' }, [
        { tex: opt([r, e].sort((x, y) => x - y)), key: 'both', mis: 'extraneous-keep', feedback: `At ${m(`x = ${e}`)} the right side is ${e - b}, but a square root is never negative.` },
        { tex: opt([e]), key: 'e', mis: 'extraneous-reject-valid', feedback: `Substitute ${m(`x = ${r}`)}: ${m(`\\sqrt{${r + a}} = ${r - b}`)}. It works.` },
        { tex: opt([]), key: 'none', mis: 'extraneous-reject-valid' },
      ]),
      hints: ['Substitute each root into the original equation.', 'The left side is a principal square root, so it is never negative.', `At ${m(`x = ${e}`)}, the right side is ${m(String(e - b))}.`],
      solution: [
        { tex: `${m(`x = ${r}`)}: ${m(`\\sqrt{${r + a}} = ${r - b}`)} ✓.` },
        { tex: `${m(`x = ${e}`)}: ${m(`\\sqrt{${e + a}} = ${Math.sqrt(e + a)}`)}, but the right side is ${m(String(e - b))} ✗.`, why: 'Squaring turned $\\sqrt{A} = -B$ into $A = B^2$, which the extraneous root satisfies.' },
        { tex: `Solution: ${m(`x = ${r}`)}.` },
      ],
    };
  },
};

const radEqSquare: Generator = {
  id: 'pre-radeq-square',
  nodeId: 'P.rad-eq',
  title: 'Square both sides correctly',
  make(rng, tier): Draft {
    const a = rng.nz(-9, 9);
    const b = rng.nz(-6, 6);
    const isolated = tier !== 3;
    const eq = isolated ? radEqTex(a, b) : `\\sqrt{${shiftTex(-a)}} ${signedTex(b)} = x`;
    const right = `x ${signedTex(a)} = ${polyTex([1, -2 * b, b * b])}`;
    const cands: Cand[] = [
      { tex: m(`x ${signedTex(a)} = ${polyTex([1, 0, b * b])}`), key: 'nomid', mis: 'square-binomial', feedback: `${m(`(x ${signedTex(-b)})^2`)} has a middle term ${m(`${-2 * b}x`)}.` },
      { tex: m(`x ${signedTex(a)} = ${polyTex([1, 0, -b * b])}`), key: 'neg', mis: 'square-binomial' },
      { tex: m(`x ${signedTex(a)} = ${polyTex([1, 2 * b, b * b])}`), key: 'sign', mis: 'square-binomial', feedback: 'Check the sign of the middle term.' },
    ];
    if (!isolated) cands.unshift({ tex: m(`x ${signedTex(a)} ${signedTex(b * b)} = x^2`), key: 'iso', mis: 'rad-eq-isolate', feedback: `${m(`(\\sqrt{A} + B)^2 \\ne A + B^2`)}. Isolate the radical before squaring.` });
    return {
      cognitive: 'procedural',
      stem: `Which equation results from ${isolated ? '' : 'isolating the radical and '}squaring both sides of ${m(eq)}?`,
      format: 'mc',
      choices: mc({ tex: m(right), key: 'ok' }, cands),
      hints: [isolated ? 'Square each side as a whole.' : 'Move the constant to the right side first.', `The right side is ${m(lin(b))}, a binomial.`, `${m(`(x - b)^2 = x^2 - 2bx + b^2`)}`],
      solution: [
        ...(isolated ? [] : [{ tex: `${m(radEqTex(a, b))}`, why: 'Isolate the radical first, so squaring removes it completely.' }]),
        { tex: `${m(`\\left(\\sqrt{${shiftTex(-a)}}\\right)^2 = ${lin(b)}^2`)}` },
        { tex: `${m(right)}`, why: 'Square the binomial with FOIL: the middle term is $2 \\times x \\times (-b)$.' },
      ],
    };
  },
};

export const preEquationGenerators: Generator[] = [ratNpv, ratSimplify, ratOperate, ratEqSolve, ratEqExtraneous, ratEqNpvSolve, radEqSolve, radEqCheck, radEqSquare];
