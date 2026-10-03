// Prerequisite layer: exponent laws, radicals, factoring.
import { field, m, mc, type Cand } from '../../framework';
import { F, Frac, polyTex } from '../../frac';
import type { Rng } from '../../rng';
import type { Draft, Generator } from '../../types';
import { Reject } from '../../types';
import { SQUAREFREE, factoredAns, factoredTex, gcd, gcdAll, isSquare, mulP, num, scaleP, sqrtTex, type Poly } from './shared';

/** c·x^n as LaTeX. */
function monoTex(c: Frac | number, n: Frac | number): string {
  const cf = Frac.of(c);
  const nf = Frac.of(n);
  const coef = cf.eq(1) ? '' : cf.eq(-1) ? '-' : cf.tex();
  if (nf.n === 0) return cf.tex();
  const pow = nf.eq(1) ? 'x' : `x^{${nf.tex()}}`;
  return `${coef}${pow}`;
}
/** (c x^p) with brackets when needed. */
const br = (s: string) => `\\left(${s}\\right)`;
const powF = (base: Frac, e: number): Frac => {
  let r = F(1);
  for (let i = 0; i < Math.abs(e); i++) r = r.mul(base);
  return e < 0 ? r.inv() : r;
};

// ---------------------------------------------------------------- P.exp-laws

const expSimplify: Generator = {
  id: 'pre-exp-simplify',
  nodeId: 'P.exp-laws',
  title: 'Simplify with exponent laws',
  make(rng, tier): Draft {
    let stem: string;
    let a: Frac;
    let n: number;
    let steps: { tex: string; why?: string }[];
    let hint3: string;
    let evalOrig: (x: number) => number;
    if (tier === 1) {
      const c1 = rng.nz(-5, 6);
      const c2 = rng.int(2, 6);
      const p = rng.nz(-3, 6);
      const q = rng.nz(-4, 5);
      const divide = rng.chance(0.5);
      if (divide && c1 % c2 !== 0 && rng.chance(0.7)) throw new Reject();
      a = divide ? F(c1, c2) : F(c1 * c2);
      n = divide ? p - q : p + q;
      stem = divide ? `\\frac{${monoTex(c1, p)}}{${monoTex(c2, q)}}` : `${br(monoTex(c1, p))}${br(monoTex(c2, q))}`;
      evalOrig = (x) => (divide ? (c1 * x ** p) / (c2 * x ** q) : c1 * x ** p * c2 * x ** q);
      steps = [
        { tex: divide && F(c1, c2).n === c1 ? `The coefficient ${m(a.tex())} stays as it is.` : `Coefficients: ${m(divide ? `\\frac{${c1}}{${c2}} = ${a.tex()}` : `${c1}\\cdot ${c2 < 0 ? `(${c2})` : c2} = ${a.tex()}`)}.`, why: 'Numbers combine by ordinary arithmetic; only the powers of $x$ use exponent laws.' },
        { tex: `Powers: ${m(divide ? `x^{${p} - ${q < 0 ? `(${q})` : q}} = x^{${n}}` : `x^{${p} + ${q < 0 ? `(${q})` : q}} = x^{${n}}`)}.`, why: divide ? 'Same base, dividing: subtract exponents.' : 'Same base, multiplying: add exponents.' },
        { tex: `Result: ${m(monoTex(a, n))}, so ${m(`a = ${a.tex()}`)}, ${m(`n = ${n}`)}.` },
      ];
      hint3 = divide ? `Subtract the exponents: $${p} - ${q < 0 ? `(${q})` : q}$.` : `Add the exponents: $${p} + ${q < 0 ? `(${q})` : q}$.`;
    } else {
      const c = rng.pick([2, 3, -2, -3, 5]);
      const p = rng.nz(-3, 4);
      const r = tier === 2 ? rng.pick([2, 3]) : rng.pick([-2, -1, -3]);
      const q = rng.nz(-5, 5);
      if (Math.abs(c) === 5 && Math.abs(r) === 3) throw new Reject();
      a = powF(F(c), r);
      n = p * r + q;
      stem = `${br(monoTex(c, p))}^{${r}}\\cdot ${monoTex(1, q)}`;
      evalOrig = (x) => (c * x ** p) ** r * x ** q;
      steps = [
        { tex: `Power of a product: ${m(`${br(monoTex(c, p))}^{${r}} = ${c < 0 ? br(String(c)) : c}^{${r}}\\, x^{${p}\\cdot ${r < 0 ? br(String(r)) : r}} = ${monoTex(a, p * r)}`)}.`, why: r < 0 ? 'The exponent applies to the coefficient too, and a negative exponent means a reciprocal: $c^{-r} = \\frac{1}{c^{r}}$.' : 'The exponent applies to every factor inside the bracket, including the coefficient.' },
        { tex: `Multiply by ${m(monoTex(1, q))}: add exponents, ${m(`${p * r} + ${q < 0 ? `(${q})` : q} = ${n}`)}.`, why: 'Same base, multiplying: add exponents.' },
        { tex: `Result: ${m(monoTex(a, n))}, so ${m(`a = ${a.tex()}`)}, ${m(`n = ${n}`)}.` },
      ];
      hint3 = `First ${m(`${br(monoTex(c, p))}^{${r}} = ${monoTex(a, p * r)}`)}.`;
    }
    if (n === 0) throw new Reject();
    const aa = a;
    const nn = n;
    return {
      cognitive: 'procedural',
      stem: `Simplify ${m(stem)} and write it in the form ${m('ax^n')}.`,
      format: 'input',
      fields: [field(num(a), 'a ='), field(num(n), 'n =')],
      hints: ['Deal with the numbers and the powers of $x$ separately.', 'Multiplying powers: add exponents. Dividing: subtract. Power of a power: multiply.', hint3],
      solution: steps,
      verify: () => Math.abs(evalOrig(1.37) - aa.value * 1.37 ** nn) < 1e-9 * Math.max(1, Math.abs(evalOrig(1.37))),
    };
  },
};

const expEvaluate: Generator = {
  id: 'pre-exp-evaluate',
  nodeId: 'P.exp-laws',
  title: 'Evaluate a rational exponent',
  make(rng, tier): Draft {
    const r = rng.pick([2, 3, 4, 5]);
    const q = tier === 1 ? 2 : rng.pick([2, 3]);
    const b = r ** q;
    if (b > 125) throw new Reject();
    const p = tier === 3 ? rng.pick([-1, -2, -3]) : rng.pick([2, 3]);
    if (r ** Math.abs(p) > 125 || gcd(Math.abs(p), q) !== 1) throw new Reject();
    const value = powF(F(r), p);
    const e = F(p, q);
    const cands: Cand[] = [];
    if (p < 0) {
      cands.push({ tex: m(String(-(r ** -p))), key: -(r ** -p), mis: 'exp-neg-sign', feedback: 'A negative exponent means a reciprocal, not a negative number.' });
      cands.push({ tex: m(String(r ** -p)), key: r ** -p, mis: 'exp-neg-reciprocal', feedback: 'You evaluated the positive exponent; the negative sign still asks for a reciprocal.' });
    }
    const mult = F(b * p, q);
    cands.push({ tex: m(mult.tex()), key: mult.value, mis: 'exp-mult-base', feedback: 'The exponent is not a multiplier. Take the root, then the power.' });
    if (Math.abs(p) !== 1) cands.push({ tex: m(String(p < 0 ? F(1, r).tex() : r)), key: p < 0 ? 1 / r : r, mis: 'exp-rational-partial', feedback: 'That is only the root. The numerator of the exponent is a power you still need to apply.' });
    if (b ** Math.abs(p) <= 20000) {
      const pw = powF(F(b), p);
      cands.push({ tex: m(pw.tex()), key: pw.value, mis: 'exp-rational-partial', feedback: 'That applies the power but not the root.' });
    }
    if (q % Math.abs(p) === 0) {
      const sw = powF(F(b), q / p);
      if (Math.abs(sw.value) < 1e6) cands.push({ tex: m(sw.tex()), key: sw.value, mis: 'exp-rational-root', feedback: 'The denominator of the exponent is the root; the numerator is the power.' });
    }
    cands.push({ tex: m(powF(F(r), p + (p > 0 ? 1 : -1)).tex()), key: powF(F(r), p + (p > 0 ? 1 : -1)).value, mis: 'exp-rational-partial' });
    return {
      cognitive: 'procedural',
      stem: `Evaluate ${m(`${b}^{${e.tex()}}`)}.`,
      format: 'mc',
      choices: mc({ tex: m(value.tex()), key: value.value }, cands),
      hints: ['$a^{m/n}$ means the $n$th root of $a$, raised to the power $m$.', `Find ${m(`\\sqrt${q === 2 ? '' : `[${q}]`}{${b}}`)} first.`, `${m(`\\sqrt${q === 2 ? '' : `[${q}]`}{${b}} = ${r}`)}. Now raise it to the power $${p}$.`],
      solution: [
        { tex: `${m(`${b}^{${e.tex()}} = \\left(\\sqrt${q === 2 ? '' : `[${q}]`}{${b}}\\right)^{${p}}`)}`, why: 'Taking the root first keeps the numbers small.' },
        { tex: `${m(`= ${r}^{${p}}`)}` },
        { tex: `${m(`= ${value.tex()}`)}`, why: p < 0 ? 'A negative exponent gives the reciprocal: $a^{-k} = \\frac{1}{a^{k}}$.' : undefined },
      ],
      verify: () => Math.abs(b ** (p / q) - value.value) < 1e-9,
    };
  },
};

/** Radical form tex for x^{p/q}. */
function radTex(p: number, q: number): string {
  const inner = Math.abs(p) === 1 ? 'x' : `x^{${Math.abs(p)}}`;
  const rad = q === 2 ? `\\sqrt{${inner}}` : `\\sqrt[${q}]{${inner}}`;
  return p < 0 ? `\\frac{1}{${rad}}` : rad;
}
const powTex = (e: Frac) => (e.eq(1) ? 'x' : `x^{${e.tex()}}`);

const expRadicalForm: Generator = {
  id: 'pre-exp-radical-form',
  nodeId: 'P.exp-laws',
  title: 'Convert between radicals and rational exponents',
  make(rng, tier): Draft {
    if (tier === 3) {
      const mI = rng.pick([2, 3, 4]);
      const nI = rng.pick([2, 3, 5]);
      if (mI === nI) throw new Reject();
      const a = rng.int(1, 3);
      const b = rng.int(1, 3);
      const ans = F(a, mI).add(F(b, nI));
      const left = `${radTex(a, mI)}\\cdot ${radTex(b, nI)}`;
      const c1 = F(a + b, mI + nI);
      const c2 = F(a * b, mI * nI);
      const c3 = F(mI, a).add(F(nI, b));
      return {
        cognitive: 'procedural',
        stem: `Write ${m(left)} as a single power of $x$.`,
        format: 'mc',
        choices: mc({ tex: m(powTex(ans)), key: ans.value }, [
          { tex: m(powTex(c1)), key: c1.value, mis: 'exp-add-bases', feedback: 'Fractions are not added by adding numerators and denominators. Use a common denominator.' },
          { tex: m(powTex(c2)), key: c2.value, mis: 'exp-add-bases', feedback: 'Multiplying powers adds the exponents; it does not multiply them.' },
          { tex: m(powTex(c3)), key: c3.value, mis: 'exp-rational-root', feedback: 'The root index goes in the denominator of the exponent.' },
        ]),
        hints: ['Write each radical as a power first.', `${m(`${radTex(a, mI)} = x^{${F(a, mI).tex()}}`)}. Then multiply powers by adding exponents.`, `Add ${m(`${F(a, mI).tex()} + ${F(b, nI).tex()}`)} using a common denominator.`],
        solution: [
          { tex: `${m(`${left} = x^{${F(a, mI).tex()}}\\cdot x^{${F(b, nI).tex()}}`)}`, why: '$\\sqrt[n]{x^m} = x^{m/n}$: the index is the denominator.' },
          { tex: `${m(`= x^{${F(a, mI).tex()} + ${F(b, nI).tex()}} = ${powTex(ans)}`)}`, why: 'Same base, multiplying: add exponents.' },
        ],
      };
    }
    const q = rng.pick([2, 3, 4, 5]);
    const p = rng.pick([1, 2, 3, 5]);
    if (p === q || (p > 1 && gcd(p, q) !== 1)) throw new Reject();
    if (tier === 1) {
      const e = F(p, q);
      return {
        cognitive: 'conceptual',
        stem: `Write ${m(radTex(p, q))} as a power of $x$.`,
        format: 'mc',
        choices: mc({ tex: m(powTex(e)), key: e.value }, [
          { tex: m(powTex(F(q, p))), key: q / p, mis: 'exp-rational-root', feedback: 'The root index is the denominator: $\\sqrt[n]{x^m} = x^{m/n}$.' },
          { tex: m(`x^{${p * q}}`), key: p * q, mis: 'exp-rational-root', feedback: 'The root index divides the exponent; it does not multiply it.' },
          { tex: m(`x^{${p + q}}`), key: p + q + 0.5, mis: 'exp-power-add', feedback: 'A root divides the exponent by the index; it does not add to it.' },
          { tex: m(`x^{${-p}/${q}}`), key: -p / q, mis: 'exp-neg-sign' },
        ]),
        hints: ['A root is a fractional exponent.', '$\\sqrt[n]{x} = x^{1/n}$, so $\\sqrt[n]{x^m} = x^{m/n}$.', `The index is ${q}, so the denominator is ${q}.`],
        solution: [
          { tex: `${m(`${radTex(p, q)} = \\left(x^{${p}}\\right)^{${F(1, q).tex()}}`)}`, why: `Taking a ${q === 2 ? 'square' : q === 3 ? 'cube' : `${q}th`} root is raising to the power ${m(F(1, q).tex())}.` },
          { tex: `${m(`= ${powTex(e)}`)}`, why: 'Power of a power: multiply exponents.' },
        ],
      };
    }
    const e = F(-p, q);
    return {
      cognitive: 'conceptual',
      stem: `Write ${m(powTex(e))} in radical form.`,
      format: 'mc',
      choices: mc({ tex: m(radTex(-p, q)), key: 'ok' }, [
        { tex: m(`-${radTex(p, q)}`), key: 'neg', mis: 'exp-neg-sign', feedback: 'A negative exponent means reciprocal, not negative.' },
        { tex: m(radTex(p, q)), key: 'pos', mis: 'exp-neg-reciprocal', feedback: 'The negative exponent still needs a reciprocal.' },
        { tex: m(radTex(-q, p === 1 ? 1 : p).replace('\\sqrt[1]', '')), key: 'swap', mis: 'exp-rational-root', feedback: 'The denominator of the exponent is the root index.' },
      ].filter((c) => !c.tex.includes('[1]'))),
      hints: ['Handle the negative sign and the fraction separately.', '$x^{-k} = \\frac{1}{x^{k}}$ and $x^{m/n} = \\sqrt[n]{x^m}$.', `${m(`x^{${F(p, q).tex()}} = ${radTex(p, q)}`)}`],
      solution: [
        { tex: `${m(`${powTex(e)} = \\frac{1}{x^{${F(p, q).tex()}}}`)}`, why: 'A negative exponent is a reciprocal.' },
        { tex: `${m(`= ${radTex(-p, q)}`)}`, why: 'The denominator of the exponent is the index of the root; the numerator is the power.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- P.radicals

const radSimplify: Generator = {
  id: 'pre-rad-simplify',
  nodeId: 'P.radicals',
  title: 'Simplify a radical',
  make(rng, tier): Draft {
    const index = tier === 3 ? 3 : 2;
    const mm = index === 2 ? rng.pick(SQUAREFREE.slice(0, 7)) : rng.pick([2, 3, 4, 5, 6, 7, 9, 10]);
    const k = index === 2 ? rng.int(2, tier === 1 ? 5 : 7) : rng.int(2, 4);
    const c = tier === 2 ? rng.pick([2, 3, -2, 5]) : 1;
    const N = k ** index * mm;
    const a = c * k;
    const rootN = index === 2 ? `\\sqrt{${N}}` : `\\sqrt[3]{${N}}`;
    const shown = `${c === 1 ? '' : c}${rootN}`;
    const ans = sqrtTex(a, mm, index);
    return {
      cognitive: 'procedural',
      stem: `Simplify ${m(shown)} and write it as ${m(index === 2 ? 'a\\sqrt{b}' : 'a\\sqrt[3]{b}')}, with $b$ as small as possible.`,
      format: 'input',
      fields: [field(num(a), 'a ='), field(num(mm), 'b =')],
      hints: [`Look for the largest perfect ${index === 2 ? 'square' : 'cube'} that divides ${N}.`, `$${N} = ${k ** index} \\times ${mm}$, and ${k ** index} is a perfect ${index === 2 ? 'square' : 'cube'}.`, `${m(`${index === 2 ? '\\sqrt' : '\\sqrt[3]'}{${k ** index}} = ${k}`)}`],
      solution: [
        { tex: `${m(`${shown} = ${c === 1 ? '' : c}${index === 2 ? '\\sqrt' : '\\sqrt[3]'}{${k ** index}\\cdot ${mm}}`)}`, why: `Split off the largest perfect ${index === 2 ? 'square' : 'cube'} factor.` },
        { tex: `${m(c === 1 ? `= ${ans}` : `= ${c}\\cdot ${k}${index === 2 ? '\\sqrt' : '\\sqrt[3]'}{${mm}} = ${ans}`)}`, why: `${m(index === 2 ? '\\sqrt{ab} = \\sqrt{a}\\sqrt{b}' : '\\sqrt[3]{ab} = \\sqrt[3]{a}\\sqrt[3]{b}')}, and ${mm} has no perfect ${index === 2 ? 'square' : 'cube'} factor left.` },
      ],
      verify: () => Math.abs(c * N ** (1 / index) - a * mm ** (1 / index)) < 1e-9,
    };
  },
};

const radAdd: Generator = {
  id: 'pre-rad-add',
  nodeId: 'P.radicals',
  title: 'Add and subtract radicals',
  make(rng, tier): Draft {
    const mm = rng.pick([2, 3, 5, 6, 7]);
    const p = tier === 1 ? 1 : rng.int(2, 4);
    const q = rng.int(2, 5);
    if (p === q) throw new Reject();
    const a = rng.int(1, 5);
    const b = rng.int(1, 5);
    const sub = tier === 3 || (tier === 2 && rng.chance(0.4));
    const s = sub ? -1 : 1;
    const coef = a * p + s * b * q;
    if (coef === 0) throw new Reject();
    const r1 = p * p * mm;
    const r2 = q * q * mm;
    const term = (c: number, r: number) => `${c === 1 ? '' : c}\\sqrt{${r}}`;
    const expr = `${term(a, r1)} ${sub ? '-' : '+'} ${term(b, r2)}`;
    const ans = sqrtTex(coef, mm);
    const cands: Cand[] = [];
    if (!sub) cands.push({ tex: m(sqrtTex(a + b, r1 + r2)), key: (a + b) * Math.sqrt(r1 + r2), mis: 'rad-add-radicands', feedback: '$\\sqrt{a} + \\sqrt{b} \\ne \\sqrt{a + b}$. Simplify each radical, then combine like radicals.' });
    else if (r1 > r2) cands.push({ tex: m(sqrtTex(a - b, r1 - r2)), key: (a - b) * Math.sqrt(r1 - r2) + 1e-6, mis: 'rad-add-radicands', feedback: '$\\sqrt{a} - \\sqrt{b} \\ne \\sqrt{a - b}$.' });
    cands.push({ tex: m(sqrtTex(a + s * b, mm)), key: (a + s * b) * Math.sqrt(mm), mis: 'rad-simplify-partial', feedback: `The factors that come out of the roots ($${p}$ and $${q}$) multiply the coefficients.` });
    cands.push({ tex: m(sqrtTex(a * p - s * b * q, mm)), key: (a * p - s * b * q) * Math.sqrt(mm), mis: 'rad-like-terms' });
    cands.push({ tex: m(sqrtTex(a * p * p + s * b * q * q, mm)), key: (a * p * p + s * b * q * q) * Math.sqrt(mm) + 2e-6, mis: 'rad-simplify-partial', feedback: `${m(`\\sqrt{${p * p}} = ${p}`)}, not ${p * p}.` });
    return {
      cognitive: 'procedural',
      stem: `Simplify ${m(expr)}.`,
      format: 'mc',
      choices: mc({ tex: m(ans), key: coef * Math.sqrt(mm) }, cands),
      hints: ['Only like radicals (same radicand) can be combined.', 'Simplify each radical first so they have the same radicand.', `${m(`\\sqrt{${r2}} = ${q}\\sqrt{${mm}}`)}`],
      solution: [
        { tex: p === 1 ? `${m(`${term(b, r2)} = ${sqrtTex(b * q, mm)}`)}.` : `${m(`${term(a, r1)} = ${sqrtTex(a * p, mm)}`)} and ${m(`${term(b, r2)} = ${sqrtTex(b * q, mm)}`)}.`, why: `${m(`${r2} = ${q * q}\\times ${mm}`)} and ${m(`\\sqrt{${q * q}} = ${q}`)}${p === 1 ? '' : `; likewise ${m(`\\sqrt{${r1}} = ${p}\\sqrt{${mm}}`)}`}.` },
        { tex: `${m(`${sqrtTex(a * p, mm)} ${sub ? '-' : '+'} ${sqrtTex(b * q, mm)} = ${ans}`)}`, why: `Like radicals combine like like terms: add the coefficients of ${m(`\\sqrt{${mm}}`)}.` },
      ],
      verify: () => Math.abs(a * Math.sqrt(r1) + s * b * Math.sqrt(r2) - coef * Math.sqrt(mm)) < 1e-9,
    };
  },
};

/** (P√b + Q)/D reduced, as LaTeX, plus its value. */
function radFrac(P: number, Q: number, b: number, D: number): { tex: string; value: number } {
  if (D < 0) [P, Q, D] = [-P, -Q, -D];
  const g = gcdAll(P, Q, D) || 1;
  [P, Q, D] = [P / g, Q / g, D / g];
  const top = `${P === 0 ? '' : sqrtTex(P, b)}${Q === 0 ? '' : P === 0 ? String(Q) : Q > 0 ? `+${Q}` : `-${-Q}`}` || '0';
  return { tex: D === 1 ? top : `\\frac{${top}}{${D}}`, value: (P * Math.sqrt(b) + Q) / D };
}

const radRationalize: Generator = {
  id: 'pre-rad-rationalize',
  nodeId: 'P.radicals',
  title: 'Rationalize a denominator',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 5, 6, 7, 10]);
    const a = rng.int(1, 12);
    if (tier === 1) {
      const ans = radFrac(a, 0, b, b);
      return {
        cognitive: 'procedural',
        stem: `Rationalize the denominator: ${m(`\\frac{${a}}{\\sqrt{${b}}}`)}.`,
        format: 'mc',
        choices: mc({ tex: m(ans.tex), key: ans.value }, [
          { tex: m(F(a, b).tex()), key: a / b, mis: 'rad-conjugate-sign', feedback: `Multiply the numerator by ${m(`\\sqrt{${b}}`)} too.` },
          { tex: m(sqrtTex(a, b)), key: a * Math.sqrt(b), mis: 'rad-conjugate-sign', feedback: `${m(`\\sqrt{${b}}\\cdot\\sqrt{${b}} = ${b}`)}, so the denominator becomes ${b}, not 1.` },
          { tex: m(radFrac(1, 0, a * b, b).tex), key: Math.sqrt(a * b) / b, mis: 'rad-simplify-partial', feedback: `The ${a} stays outside the root.` },
          { tex: m(`\\frac{${sqrtTex(a, b)}}{${b * b}}`), key: (a * Math.sqrt(b)) / (b * b), mis: 'rad-conjugate-sign' },
        ]),
        hints: ['Multiply by a form of 1 that clears the root.', `Multiply top and bottom by ${m(`\\sqrt{${b}}`)}.`, `${m(`\\sqrt{${b}}\\cdot\\sqrt{${b}} = ${b}`)}`],
        solution: [
          { tex: `${m(`\\frac{${a}}{\\sqrt{${b}}}\\cdot\\frac{\\sqrt{${b}}}{\\sqrt{${b}}} = \\frac{${sqrtTex(a, b)}}{${b}}`)}`, why: 'Multiplying by $\\frac{\\sqrt{b}}{\\sqrt{b}} = 1$ does not change the value.' },
          { tex: `${m(`= ${ans.tex}`)}`, why: gcd(a, b) > 1 ? 'Reduce the common factor.' : 'Nothing cancels, so this is simplest form.' },
        ],
        verify: () => Math.abs(a / Math.sqrt(b) - ans.value) < 1e-9,
      };
    }
    const u = tier === 3 ? rng.sign() : 1;
    const v = rng.nz(-4, 4);
    const D = b - v * v;
    if (D === 0 || Math.abs(D) > 15) throw new Reject();
    const den = u === 1 ? `\\sqrt{${b}} ${v > 0 ? '+' : '-'} ${Math.abs(v)}` : `${v} - \\sqrt{${b}}`;
    const conj = u === 1 ? `\\sqrt{${b}} ${v > 0 ? '-' : '+'} ${Math.abs(v)}` : `${-v} - \\sqrt{${b}}`;
    // denominator u√b + v; multiply by (u√b − v): numerator a u√b − a v, denominator b − v²
    const ans = radFrac(a * u, -a * v, b, D);
    const value = a / (u * Math.sqrt(b) + v);
    const wrongConj = radFrac(a * u, a * v, b, D);
    const noNum = F(a, D);
    const denSign = radFrac(a * u, -a * v, b, b + v * v);
    return {
      cognitive: 'procedural',
      stem: `Rationalize the denominator: ${m(`\\frac{${a}}{${den}}`)}.`,
      format: 'mc',
      choices: mc({ tex: m(ans.tex), key: value }, [
        { tex: m(wrongConj.tex), key: wrongConj.value, mis: 'rad-conjugate-sign', feedback: 'The conjugate changes the sign between the terms; multiply the numerator by the same conjugate.' },
        { tex: m(noNum.tex()), key: noNum.value, mis: 'rad-conjugate-sign', feedback: 'Multiply the numerator by the conjugate as well.' },
        { tex: m(denSign.tex), key: denSign.value, mis: 'rad-conjugate-sign', feedback: `${m('(\\sqrt{b} + v)(\\sqrt{b} - v) = b - v^2')}: the product of conjugates is a difference.` },
      ]),
      hints: ['A binomial denominator with a root is cleared by its conjugate.', `Multiply top and bottom by ${m(conj)}.`, `The denominator becomes ${m(`${b} - ${v * v} = ${D}`)}.`],
      solution: [
        { tex: `Multiply by ${m(`\\frac{${conj}}{${conj}}`)}.`, why: 'Conjugates multiply to a difference of squares, which has no root.' },
        { tex: `Denominator: ${m(`(\\sqrt{${b}})^2 - ${v < 0 ? `(${v})` : v}^2 = ${D}`)}. Numerator: ${m(`${a}\\left(${conj}\\right)`)}.` },
        { tex: `${m(`= ${ans.tex}`)}`, why: 'Write with a positive denominator and reduce any common factor.' },
      ],
      verify: () => Math.abs(value - ans.value) < 1e-9,
    };
  },
};

// ---------------------------------------------------------------- P.factor-basic

const facGcf: Generator = {
  id: 'pre-fac-gcf',
  nodeId: 'P.factor-basic',
  title: 'Common factors and grouping',
  make(rng, tier): Draft {
    let k: number;
    let fs: Poly[];
    let steps: { tex: string; why?: string }[];
    if (tier === 1) {
      k = rng.int(2, 9);
      const c = rng.nz(-9, 9);
      fs = [[1, c]];
      steps = [{ tex: `The greatest common factor is ${k}.`, why: `${k} divides both coefficients, and nothing larger does.` }, { tex: `${m(factoredTex(k, fs))}` }];
    } else if (tier === 2) {
      k = rng.pick([2, 3, 4, 5, -2, -3]);
      const a = rng.nz(-6, 6);
      const b = rng.nz(-9, 9);
      if (isSquare(a * a - 4 * b)) throw new Reject();
      fs = [[1, 0], [1, a, b]];
      steps = [
        { tex: `Every term has a factor ${m(`${k}x`)}.`, why: k < 0 ? 'Taking out a negative factor makes the leading term inside positive.' : 'Take out the largest number and the lowest power of $x$.' },
        { tex: `${m(factoredTex(k, fs))}`, why: `The quadratic ${m(polyTex([1, a, b]))} does not factor further: no two integers multiply to ${b} and add to ${a}.` },
      ];
    } else {
      k = 1;
      const a = rng.nz(-6, 6);
      const sq = rng.chance(0.5);
      const s = rng.int(1, 5);
      const b = sq ? -(s * s) : rng.pick([1, 2, 3, 5, 6, 7]);
      fs = sq ? [[1, a], [1, -s], [1, s]] : [[1, a], [1, 0, b]];
      steps = [
        { tex: `Group: ${m(`\\left(x^3 ${a > 0 ? '+' : '-'} ${Math.abs(a)}x^2\\right) + \\left(${polyTex([b, a * b])}\\right)`)}.`, why: 'Pair the terms so each pair has its own common factor.' },
        { tex: `${m(`x^2(x ${a > 0 ? '+' : '-'} ${Math.abs(a)}) ${b > 0 ? '+' : '-'} ${Math.abs(b)}(x ${a > 0 ? '+' : '-'} ${Math.abs(a)}) = (x ${a > 0 ? '+' : '-'} ${Math.abs(a)})(x^2 ${b > 0 ? '+' : '-'} ${Math.abs(b)})`)}` },
        sq ? { tex: `${m(`x^2 - ${s * s} = (x - ${s})(x + ${s})`)}, so ${m(factoredTex(1, fs))}.`, why: 'Always check whether a factor is a difference of squares.' } : { tex: `${m(`x^2 + ${b}`)} does not factor, so ${m(factoredTex(1, fs))}.`, why: 'A sum $x^2 + b$ with $b > 0$ has no real factors.' },
      ];
    }
    const expanded = scaleP(mulP(...fs), k);
    return {
      cognitive: 'procedural',
      stem: `Factor fully: ${m(polyTex(expanded))}`,
      format: 'input',
      fields: [field(factoredAns(k, fs))],
      hints: tier === 3 ? ['Four terms: try grouping in pairs.', 'Take a common factor from the first two terms and from the last two.', 'The two groups should share a binomial factor.'] : ['Look for a factor common to every term.', 'Take out the greatest common factor of the coefficients and the lowest power of $x$.', `Divide each term by ${m(tier === 1 ? String(k) : `${k}x`)}.`],
      solution: steps,
    };
  },
};

const facDos: Generator = {
  id: 'pre-fac-dos',
  nodeId: 'P.factor-basic',
  title: 'Difference of squares',
  make(rng, tier): Draft {
    let k = 1;
    let fs: Poly[];
    let steps: { tex: string; why?: string }[];
    if (tier === 1) {
      const a = rng.int(1, 5);
      const b = rng.int(1, 9);
      if (gcd(a, b) !== 1) throw new Reject();
      fs = [[a, -b], [a, b]];
      steps = [
        { tex: `${m(`${a * a}x^2 - ${b * b} = (${a === 1 ? '' : a}x)^2 - ${b}^2`)}.`, why: 'Both terms are perfect squares and they are subtracted.' },
        { tex: `${m(factoredTex(1, fs))}`, why: '$A^2 - B^2 = (A - B)(A + B)$.' },
      ];
    } else if (tier === 2) {
      k = rng.pick([2, 3, 5, -2, -3]);
      const s = rng.int(1, 6);
      fs = [[1, -s], [1, s]];
      steps = [
        { tex: `Common factor first: ${m(`${k}\\left(x^2 - ${s * s}\\right)`)}.`, why: 'Take out the common factor before looking for special products.' },
        { tex: `${m(factoredTex(k, fs))}`, why: '$x^2 - s^2 = (x - s)(x + s)$.' },
      ];
    } else {
      const s = rng.int(1, 3);
      if (rng.chance(0.5)) {
        fs = [[1, 0, s * s], [1, -s], [1, s]];
        steps = [
          { tex: `${m(`x^4 - ${s ** 4} = (x^2)^2 - (${s * s})^2 = (x^2 - ${s * s})(x^2 + ${s * s})`)}`, why: 'A difference of squares in $x^2$.' },
          { tex: `${m(`x^2 - ${s * s}`)} is again a difference of squares: ${m(factoredTex(1, fs))}.`, why: `${m(`x^2 + ${s * s}`)} is a sum of squares and does not factor.` },
        ];
      } else {
        k = rng.pick([2, 3, -1, 5]);
        fs = [[1, 0], [1, -s * 2], [1, s * 2]];
        steps = [
          { tex: `Common factor ${m(`${k === -1 ? '-' : k}x`)}: ${m(`${k === -1 ? '-' : k}x\\left(x^2 - ${4 * s * s}\\right)`)}.`, why: 'Common factor first.' },
          { tex: `${m(factoredTex(k, fs))}`, why: 'Then the difference of squares.' },
        ];
      }
    }
    const expanded = scaleP(mulP(...fs), k);
    return {
      cognitive: 'procedural',
      stem: `Factor fully: ${m(polyTex(expanded))}`,
      format: 'input',
      fields: [field(factoredAns(k, fs))],
      hints: ['Look for a common factor, then for perfect squares being subtracted.', '$A^2 - B^2 = (A - B)(A + B)$.', 'After factoring, check whether any factor can be factored again.'],
      solution: steps,
    };
  },
};

const facIdentify: Generator = {
  id: 'pre-fac-identify',
  nodeId: 'P.factor-basic',
  title: 'Choose the complete factorization',
  make(rng, tier): Draft {
    const s = rng.int(2, tier === 3 ? 3 : 7);
    if (tier === 1) {
      return {
        cognitive: 'conceptual',
        stem: `Which is the complete factorization of ${m(`x^2 + ${s * s}`)} over the integers?`,
        format: 'mc',
        choices: mc({ tex: 'It does not factor.', key: 'none' }, [
          { tex: m(`(x + ${s})(x - ${s})`), key: 'dos', mis: 'fac-sum-squares', feedback: `${m(`(x + ${s})(x - ${s}) = x^2 - ${s * s}`)}: that is a difference, not a sum.` },
          { tex: m(`(x + ${s})^2`), key: 'sq', mis: 'fac-sum-squares', feedback: `${m(`(x + ${s})^2 = x^2 + ${2 * s}x + ${s * s}`)}: it has a middle term.` },
          { tex: m(`(x - ${s})^2`), key: 'sqm', mis: 'fac-dos-square', feedback: `${m(`(x - ${s})^2 = x^2 - ${2 * s}x + ${s * s}`)}.` },
        ]),
        hints: ['Expand each option and compare.', 'A sum of two squares has no real factors.', `Try ${m(`(x + ${s})(x - ${s})`)}: what is its constant term?`],
        solution: [
          { tex: `${m(`(x + ${s})(x - ${s}) = x^2 - ${s * s}`)}, and ${m(`(x \\pm ${s})^2`)} has a middle term.`, why: 'No pair of integer binomials multiplies to give a sum of squares.' },
          { tex: `So ${m(`x^2 + ${s * s}`)} does not factor over the integers.` },
        ],
      };
    }
    if (tier === 2) {
      const k = rng.int(2, 5);
      return {
        cognitive: 'procedural',
        stem: `Which is the complete factorization of ${m(`${k}x^2 - ${k * s * s}`)}?`,
        format: 'mc',
        choices: mc({ tex: m(`${k}(x - ${s})(x + ${s})`), key: 'ok' }, [
          { tex: m(`${k}(x - ${s})^2`), key: 'sq', mis: 'fac-dos-square', feedback: `${m(`(x - ${s})^2`)} has a middle term $-${2 * s}x$.` },
          { tex: m(`(x - ${s})(x + ${s})`), key: 'nok', mis: 'fac-gcf-lost', feedback: `This expands to ${m(`x^2 - ${s * s}`)}: the common factor ${k} is missing.` },
          { tex: m(`${k}(x^2 - ${s * s})`), key: 'part', mis: 'fac-incomplete', feedback: `${m(`x^2 - ${s * s}`)} still factors.` },
        ]),
        hints: ['Take out the common factor first.', `${m(`${k}x^2 - ${k * s * s} = ${k}(x^2 - ${s * s})`)}.`, 'Is what is left a difference of squares?'],
        solution: [
          { tex: `${m(`${k}x^2 - ${k * s * s} = ${k}(x^2 - ${s * s})`)}`, why: 'Common factor first.' },
          { tex: `${m(`= ${k}(x - ${s})(x + ${s})`)}`, why: 'Difference of squares.' },
        ],
      };
    }
    const q = s * s;
    return {
      cognitive: 'procedural',
      stem: `Which is the complete factorization of ${m(`x^4 - ${q * q}`)}?`,
      format: 'mc',
      choices: mc({ tex: m(`(x^2 + ${q})(x - ${s})(x + ${s})`), key: 'ok' }, [
        { tex: m(`(x^2 - ${q})(x^2 + ${q})`), key: 'part', mis: 'fac-incomplete', feedback: `${m(`x^2 - ${q}`)} is still a difference of squares.` },
        { tex: m(`(x - ${s})^2(x + ${s})^2`), key: 'sumsq', mis: 'fac-sum-squares', feedback: `That treats ${m(`x^2 + ${q}`)} as factorable; it is a sum of squares.` },
        { tex: m(`(x^2 - ${q})^2`), key: 'sq', mis: 'fac-dos-square', feedback: `${m(`(x^2 - ${q})^2`)} has a middle term.` },
      ]),
      hints: [`${m(`x^4 = (x^2)^2`)} and ${m(`${q * q} = ${q}^2`)}.`, 'Factor as a difference of squares, then look at each factor again.', `${m(`x^2 - ${q}`)} factors; ${m(`x^2 + ${q}`)} does not.`],
      solution: [
        { tex: `${m(`x^4 - ${q * q} = (x^2 - ${q})(x^2 + ${q})`)}`, why: 'Difference of squares in $x^2$.' },
        { tex: `${m(`= (x - ${s})(x + ${s})(x^2 + ${q})`)}`, why: 'Factor again where possible; a sum of squares stays.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- P.factor-trinomial

const facTriSimple: Generator = {
  id: 'pre-fac-tri-simple',
  nodeId: 'P.factor-trinomial',
  title: 'Factor x² + bx + c',
  make(rng, tier): Draft {
    if (tier === 3) {
      const r = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 9]);
      const s = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 9]);
      if (r === s) throw new Reject();
      const expand = (t: number): Poly[] => (t > 0 && isSquare(t) ? [[1, -Math.sqrt(t)], [1, Math.sqrt(t)]] : [[1, 0, -t]]);
      const fs = [...expand(r), ...expand(s)];
      const shown = polyTex([1, 0, -(r + s), 0, r * s]);
      return {
        cognitive: 'problemSolving',
        stem: `Factor fully: ${m(shown)}`,
        format: 'input',
        fields: [field(factoredAns(1, fs))],
        hints: ['This is a quadratic in $x^2$: let $u = x^2$.', `Factor ${m(polyTex([1, -(r + s), r * s], 'u'))}.`, 'Replace $u$ with $x^2$ and check whether any factor is a difference of squares.'],
        solution: [
          { tex: `Let ${m('u = x^2')}: ${m(`${polyTex([1, -(r + s), r * s], 'u')} = (u ${r > 0 ? '-' : '+'} ${Math.abs(r)})(u ${s > 0 ? '-' : '+'} ${Math.abs(s)})`)}.`, why: `Two numbers that multiply to ${r * s} and add to ${-(r + s)}.` },
          { tex: `${m(`(x^2 ${r > 0 ? '-' : '+'} ${Math.abs(r)})(x^2 ${s > 0 ? '-' : '+'} ${Math.abs(s)})`)}` },
          { tex: `${m(factoredTex(1, fs))}`, why: 'Factor any difference of squares; the other factors do not factor over the integers.' },
        ],
      };
    }
    const r = rng.nz(-9, 9);
    const s = rng.nz(-9, 9);
    const k = tier === 2 ? rng.pick([2, 3, -1, -2, 5]) : 1;
    const fs: Poly[] = [[1, -r], [1, -s]];
    const b = -(r + s);
    const c = r * s;
    const expanded = scaleP([1, b, c], k);
    return {
      cognitive: 'procedural',
      stem: `Factor fully: ${m(polyTex(expanded))}`,
      format: 'input',
      fields: [field(factoredAns(k, fs))],
      hints: [k !== 1 ? `Take out the common factor ${k} first.` : 'Find two integers that multiply to $c$ and add to $b$.', `Two integers with product ${c} and sum ${b}.`, `They are ${-r} and ${-s}.`],
      solution: [
        ...(k !== 1 ? [{ tex: `${m(`${polyTex(expanded)} = ${k === -1 ? '-' : k}\\left(${polyTex([1, b, c])}\\right)`)}`, why: k < 0 ? 'Take out a negative common factor so the leading coefficient inside is positive.' : 'Common factor first.' }] : []),
        { tex: `${m(`${-r} \\times ${-s < 0 ? `(${-s})` : -s} = ${c}`)} and ${m(`${-r} + ${-s < 0 ? `(${-s})` : -s} = ${b}`)}.` },
        { tex: `${m(factoredTex(k, fs))}`, why: 'Check by expanding.' },
      ],
    };
  },
};

const facTriLeading: Generator = {
  id: 'pre-fac-tri-leading',
  nodeId: 'P.factor-trinomial',
  title: 'Factor ax² + bx + c',
  make(rng, tier): Draft {
    const p = rng.int(1, tier === 1 ? 2 : 5);
    const q = rng.int(tier === 1 ? 1 : 2, tier === 1 ? 3 : 5);
    if (p * q < 2) throw new Reject();
    const r = rng.nz(-7, 7);
    const s = rng.nz(-7, 7);
    if (gcd(p, r) !== 1 || gcd(q, s) !== 1) throw new Reject();
    const k = tier === 3 && rng.chance(0.5) ? -1 : 1;
    const fs: Poly[] = [[p, -r], [q, -s]];
    const tri = mulP(...fs);
    const shown = scaleP(tri, k);
    const [A, B, C] = tri;
    return {
      cognitive: 'procedural',
      stem: `Factor fully: ${m(polyTex(shown))}`,
      format: 'input',
      fields: [field(factoredAns(k, fs))],
      hints: [k === -1 ? 'Factor out $-1$ first.' : 'Use decomposition: split the middle term.', `Find two integers with product ${m(`${A}\\times ${C < 0 ? `(${C})` : C} = ${A * C}`)} and sum ${B}.`, `They are ${-p * s} and ${-q * r}.`],
      solution: [
        ...(k === -1 ? [{ tex: `${m(`${polyTex(shown)} = -\\left(${polyTex(tri)}\\right)`)}` }] : []),
        { tex: `${m(`ac = ${A * C}`)}; integers ${-p * s} and ${-q * r} multiply to ${A * C} and add to ${B}.`, why: 'Decomposition: replace $bx$ with two terms whose coefficients multiply to $ac$.' },
        { tex: `${m(`${A}x^2 ${-p * s < 0 ? '-' : '+'} ${Math.abs(p * s)}x ${-q * r < 0 ? '-' : '+'} ${Math.abs(q * r)}x ${C < 0 ? '-' : '+'} ${Math.abs(C)}`)}, then group in pairs.` },
        { tex: `${m(factoredTex(k, fs))}`, why: 'Check by expanding: first × first gives the leading term, last × last the constant.' },
      ],
    };
  },
};

const facTriMc: Generator = {
  id: 'pre-fac-tri-mc',
  nodeId: 'P.factor-trinomial',
  title: 'Choose the factorization of a trinomial',
  make(rng, tier): Draft {
    const p = tier === 1 ? 1 : rng.int(1, 3);
    const q = tier === 1 ? 1 : rng.int(2, 4);
    const r = rng.nz(-6, 6);
    const s = rng.nz(-6, 6);
    if (gcd(p, r) !== 1 || gcd(q, s) !== 1 || r === s) throw new Reject();
    const f = (a: Poly, b: Poly) => `${factoredTex(1, [a, b])}`;
    const key = (a: Poly, b: Poly) => mulP(a, b).join(',');
    const ans = [[p, r], [q, s]] as [Poly, Poly];
    const tri = mulP(...ans);
    const cands: Cand[] = [
      { tex: m(f([p, -r], [q, -s])), key: key([p, -r], [q, -s]), mis: 'fac-sign-error', feedback: 'Expand to check: the middle term has the wrong sign.' },
      { tex: m(f([p, s], [q, r])), key: key([p, s], [q, r]), mis: 'fac-trinomial-leading', feedback: 'With a leading coefficient, which constant pairs with which $x$-term matters.' },
      { tex: m(f([p, r], [q, -s])), key: key([p, r], [q, -s]), mis: 'fac-sign-error' },
      { tex: m(f([1, r], [1, s])), key: key([1, r], [1, s]), mis: 'fac-trinomial-leading', feedback: 'This ignores the leading coefficient.' },
      { tex: m(f([p, -s], [q, -r])), key: key([p, -s], [q, -r]), mis: 'fac-sign-error' },
      { tex: m(f([p, -r], [q, s])), key: key([p, -r], [q, s]), mis: 'fac-sign-error' },
    ];
    return {
      cognitive: 'procedural',
      stem: `Which is the factorization of ${m(polyTex(tri))}?`,
      format: 'mc',
      choices: mc({ tex: m(f(...ans)), key: key(...ans) }, cands),
      hints: ['Expand each option, or factor directly.', 'Check the constant term and the middle term separately.', 'The middle term comes from the outer and inner products.'],
      solution: [
        { tex: `${m(`${f(...ans)} = ${polyTex(tri)}`)}`, why: `Outer + inner: ${m(`${p * s}x + ${q * r}x = ${p * s + q * r}x`)}.` },
        { tex: `So the factorization is ${m(f(...ans))}.` },
      ],
    };
  },
};

export const preAlgebraGenerators: Generator[] = [expSimplify, expEvaluate, expRadicalForm, radSimplify, radAdd, radRationalize, facGcf, facDos, facIdentify, facTriSimple, facTriLeading, facTriMc];
export type { Rng };
