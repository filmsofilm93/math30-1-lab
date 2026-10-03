// PCBT4: Pascal's triangle, binomial expansion, general term, non-linear terms, unknowns.
import { binomExpand, binomTerm, nCr, pascalRow } from '../../counting';
import { field, m, mc, type Cand } from '../../framework';
import { coefTex } from '../../frac';
import type { Rng } from '../../rng';
import type { AnswerSpec, Draft, Generator } from '../../types';
import { Reject } from '../../types';
import { num, setAns } from '../pre/shared';

const C = (n: number | string, r: number | string) => `{}_{${n}}C_{${r}}`;
const ord = (k: number) => `${k}${k % 100 >= 11 && k % 100 <= 13 ? 'th' : k % 10 === 1 ? 'st' : k % 10 === 2 ? 'nd' : k % 10 === 3 ? 'rd' : 'th'}`;
const nAns = (v: number): AnswerSpec => ({ ...num(v), tex: String(v) });

/** c·x^p as LaTeX; negative powers as fractions. */
export function monoTex(c: number, p: number, v = 'x'): string {
  if (c === 0) return '0';
  if (p === 0) return String(c);
  if (p < 0) return `${c < 0 ? '-' : ''}\\frac{${Math.abs(c)}}{${v}${p === -1 ? '' : `^{${-p}}`}}`;
  return `${coefTex(c)}${v}${p === 1 ? '' : `^{${p}}`}`;
}
/** Sum of terms, highest power first. */
export function sumTex(terms: { coef: number; pow: number }[], v = 'x'): string {
  return terms
    .filter((t) => t.coef !== 0)
    .map((t, i) => {
      const s = monoTex(Math.abs(t.coef), t.pow, v);
      return i === 0 ? (t.coef < 0 ? `-${s}` : s) : `${t.coef < 0 ? ' - ' : ' + '}${s}`;
    })
    .join('');
}
/** (a·x^p + b·x^q) as LaTeX. */
function binTex(a: number, p: number, b: number, q: number): string {
  const first = monoTex(a, p);
  const second = monoTex(Math.abs(b), q);
  return `\\left(${first} ${b < 0 ? '-' : '+'} ${second}\\right)`;
}
const monoAns = (c: number, p: number): AnswerSpec => ({ kind: 'expr', tex: monoTex(c, p), variable: 'x', fn: (x) => c * x ** p, sample: [0.5, 2], exact: true });

/** Term-by-term working of t(k+1) = nCk (first)^(n−k) (second)^k. */
function termWork(n: number, k: number | 'k', a: number, p: number, b: number, q: number): string {
  const f = monoTex(a, p);
  const s = monoTex(b, q);
  const sub = k === 'k' ? 'k+1' : k + 1;
  const e = k === 'k' ? `${n} - k` : n - k;
  return `t_{${sub}} = ${C(n, k)}\\left(${f}\\right)^{${e}}\\left(${s}\\right)^{${k}}`;
}

// ---------------------------------------------------------------- PCBT4.pascal

const pascalEntry: Generator = {
  id: 'u6-pascal-entry',
  nodeId: 'PCBT4.pascal',
  title: 'Entries of Pascal’s triangle',
  make(rng, tier): Draft {
    const n = rng.int(5, 10);
    if (tier === 3) {
      const k = rng.int(1, n - 2);
      const L = nCr(n, k);
      const R = nCr(n, k + 1);
      return {
        cognitive: 'conceptual',
        stem: `Two adjacent numbers in a row of Pascal’s triangle are ${m(String(L))} and ${m(String(R))}. What number sits directly below, between them?`,
        format: 'input',
        fields: [field(nAns(L + R))],
        hints: ['How is each number in Pascal’s triangle built?', 'Each entry is the sum of the two entries above it.', `${m(`${L} + ${R}`)}`],
        solution: [
          { tex: `Each entry is the sum of the two above it: ${m(`${L} + ${R} = ${L + R}`)}.`, why: `In ${m('C')} notation: ${m(`${C(n, k)} + ${C(n, k + 1)} = ${C(n + 1, k + 1)}`)}.` },
          { tex: `The entry is ${m(String(L + R))}.` },
        ],
        verify: () => nCr(n + 1, k + 1) === L + R,
      };
    }
    const k = rng.int(2, Math.floor(n / 2) + (tier === 2 ? 1 : 0));
    const row = pascalRow(n);
    return {
      cognitive: 'procedural',
      stem: `A row of Pascal’s triangle begins ${m(`1, ${n}, \\ldots`)}. What is the ${ord(k + 1)} number in that row?`,
      format: 'input',
      fields: [field(nAns(row[k]))],
      hints: [`The row beginning 1, ${n} holds ${m(`${C(n, 0)}, ${C(n, 1)}, ${C(n, 2)}, \\ldots`)}.`, `The ${ord(k + 1)} number is ${m(C(n, k))}.`, 'Or build the row by adding pairs from the row above.'],
      solution: [
        { tex: `Row: ${m(row.join(',\\ '))}.`, why: `The row starting 1, ${n} is ${m(`${C(n, 0)}, ${C(n, 1)}, \\ldots, ${C(n, n)}`)}.` },
        { tex: `${ord(k + 1)} number: ${m(`${C(n, k)} = ${row[k]}`)}.`, why: `The first number is ${m(C(n, 0))}, so the count of ${m('k')} starts at 0.` },
      ],
    };
  },
};

const pascalSum: Generator = {
  id: 'u6-pascal-sum',
  nodeId: 'PCBT4.pascal',
  title: 'Row sums',
  make(rng, tier): Draft {
    const n = rng.int(5, 12);
    const labelled = tier === 3;
    const R = n + 1;
    const stem = labelled ? `If row 1 of Pascal’s triangle is the single number 1, what is the sum of the numbers in row ${R}?` : `What is the sum of the numbers in the row of Pascal’s triangle that begins ${m(`1, ${n}, \\ldots`)}?`;
    const ans = 2 ** n;
    return {
      cognitive: 'conceptual',
      stem,
      format: 'mc',
      choices: mc({ tex: m(`2^{${n}} = ${ans}`), key: ans }, [
        { tex: m(`2^{${n + 1}} = ${2 ** (n + 1)}`), key: 2 ** (n + 1), mis: 'binom-pascal-row', feedback: labelled ? `Row ${R} holds the coefficients of ${m(`(x + y)^{${n}}`)}.` : 'Check the first rows: 1, 1 1, 1 2 1 sum to 1, 2, 4.' },
        { tex: m(`2^{${n - 1}} = ${2 ** (n - 1)}`), key: 2 ** (n - 1), mis: 'binom-pascal-row' },
        { tex: m(`${n}^2 = ${n * n}`), key: n * n, mis: 'binom-term-count' },
        { tex: m(String(2 * n)), key: 2 * n, mis: 'binom-term-count' },
      ]),
      hints: ['Add the first few rows: 1; 1, 1; 1, 2, 1; 1, 3, 3, 1.', 'Each row sum doubles.', labelled ? `Row ${R} contains the coefficients of ${m(`(x + y)^{${n}}`)}.` : `The row starting 1, ${n} contains the coefficients of ${m(`(x + y)^{${n}}`)}.`],
      solution: [
        { tex: `The row is ${m(`${C(n, 0)}, ${C(n, 1)}, \\ldots, ${C(n, n)}`)}${labelled ? `, since row 1 is ${m(C(0, 0))}` : ''}.` },
        { tex: `Sum ${m(`= 2^{${n}} = ${ans}`)}.`, why: `Set ${m('x = y = 1')} in ${m(`(x + y)^{${n}}`)}: every coefficient appears once.` },
      ],
      verify: () => pascalRow(n).reduce((s, v) => s + v, 0) === ans,
    };
  },
};

const pascalTerms: Generator = {
  id: 'u6-pascal-terms',
  nodeId: 'PCBT4.pascal',
  title: 'Terms, rows and powers',
  make(rng, tier): Draft {
    const n = rng.int(4, 12);
    if (tier === 1) {
      return {
        cognitive: 'conceptual',
        stem: `How many terms are in the expansion of ${m(`(x + y)^{${n}}`)}?`,
        format: 'mc',
        choices: mc({ tex: m(String(n + 1)), key: n + 1 }, [
          { tex: m(String(n)), key: n, mis: 'binom-term-count', feedback: `The powers of ${m('y')} run from 0 to ${n}: that is ${n + 1} values.` },
          { tex: m(String(n - 1)), key: n - 1, mis: 'binom-term-count' },
          { tex: m(String(2 * n)), key: 2 * n, mis: 'binom-term-count' },
        ]),
        hints: ['Look at small cases: $(x + y)^2$ has 3 terms.', `The exponent of ${m('y')} goes ${m(`0, 1, \\ldots, ${n}`)}.`, 'Count those values.'],
        solution: [
          { tex: `Terms ${m(`x^{${n}}, x^{${n - 1}}y, \\ldots, y^{${n}}`)}: the power of ${m('y')} takes every value from 0 to ${n}.` },
          { tex: `${m(String(n + 1))} terms.`, why: '$(x + y)^n$ always has $n + 1$ terms.' },
        ],
      };
    }
    if (tier === 2) {
      return {
        cognitive: 'conceptual',
        stem: `Row 1 of Pascal’s triangle is the single number 1. Which row gives the coefficients of ${m(`(a + b)^{${n}}`)}?`,
        format: 'mc',
        choices: mc({ tex: `Row ${n + 1}`, key: n + 1 }, [
          { tex: `Row ${n}`, key: n, mis: 'binom-pascal-row', feedback: `Row 1 is ${m('(a + b)^0')}, so row ${m('r')} is the power ${m('r - 1')}.` },
          { tex: `Row ${n - 1}`, key: n - 1, mis: 'binom-pascal-row' },
          { tex: `Row ${n + 2}`, key: n + 2, mis: 'binom-pascal-row' },
        ]),
        hints: ['Row 1 is $(a + b)^0 = 1$.', 'Row 2 is $1, 1$: the coefficients of $(a + b)^1$.', `So the power ${n} sits in row ${m(`${n} + 1`)}.`],
        solution: [{ tex: `Row 1 ↔ power 0, row 2 ↔ power 1, …` }, { tex: `Power ${n} ↔ row ${n + 1}.`, why: 'Check the convention in each question: some sources start counting at row 0.' }],
      };
    }
    const row = pascalRow(n);
    return {
      cognitive: 'conceptual',
      stem: `The coefficients ${m(row.join(',\\ '))} come from expanding ${m('(x + y)^n')}. What is ${m('n')}?`,
      format: 'input',
      fields: [field(nAns(n), 'n =')],
      hints: ['How many coefficients are listed?', `There are ${row.length}.`, '$(x + y)^n$ has $n + 1$ terms.'],
      solution: [{ tex: `${row.length} coefficients = ${m('n + 1')} terms.` }, { tex: m(`n = ${n}`), why: 'The second entry is also $n$.' }],
    };
  },
};

// ---------------------------------------------------------------- PCBT4.expand

function pickLinBinom(rng: Rng, tier: number) {
  const n = tier === 1 ? 3 : rng.int(3, 4);
  const a = tier === 1 ? 1 : rng.pick([1, 2, 3]);
  const b = tier === 1 ? rng.nz(-3, 3) : rng.pick([1, -1, 2, -2, 3, -3]);
  return { n, a, b };
}

const expandFull: Generator = {
  id: 'u6-expand-full',
  nodeId: 'PCBT4.expand',
  title: 'Expand a binomial',
  make(rng, tier): Draft {
    const { n, a, b } = pickLinBinom(rng, tier);
    const terms = binomExpand(n, a, 1, b, 0);
    const tex = sumTex(terms);
    const row = pascalRow(n);
    return {
      cognitive: 'procedural',
      stem: `Expand and simplify ${m(`${binTex(a, 1, b, 0)}^{${n}}`)}.`,
      format: 'input',
      fields: [field({ kind: 'expr', tex, variable: 'x', fn: (x) => (a * x + b) ** n, sample: [-2, 2], exact: true, form: 'expanded' })],
      hints: [`Coefficients from Pascal’s triangle: ${m(row.join(',\\ '))}.`, `Powers of ${m(monoTex(a, 1))} go down from ${n}; powers of ${m(String(b))} go up from 0.`, `Raise the whole term, including its coefficient and sign: ${m(`(${monoTex(a, 1)})^2 = ${monoTex(a * a, 2)}`)}.`],
      solution: [
        { tex: m(row.map((c, k) => `${c}(${monoTex(a, 1)})^{${n - k}}(${b})^{${k}}`).join(' + ')), why: 'Each term is nCk (first)^(n−k) (second)^k.' },
        { tex: m(`= ${tex}`), why: b < 0 ? 'Odd powers of a negative number are negative, so the signs alternate.' : 'Multiply out each term.' },
      ],
      verify: () => [-1.5, 0.5, 2].every((x) => Math.abs(terms.reduce((s, t) => s + t.coef * x ** t.pow, 0) - (a * x + b) ** n) < 1e-6),
    };
  },
};

const expandCoef: Generator = {
  id: 'u6-expand-coef',
  nodeId: 'PCBT4.expand',
  title: 'Coefficient of one term',
  make(rng, tier): Draft {
    const n = rng.int(4, 7);
    const a = rng.pick([1, 2, 3]);
    const b = rng.pick([1, -1, 2, -2, 3, -3]);
    const j = rng.int(1, n - 1); // power of x
    const k = n - j;
    const t = binomTerm(n, k, a, 1, b, 0);
    if (Math.abs(t.coef) > 200000) throw new Reject();
    const stem = `What is the coefficient of ${m(`x^{${j}}`.replace('x^{1}', 'x'))} in the expansion of ${m(`${binTex(a, 1, b, 0)}^{${n}}`)}?`;
    const sol = [
      { tex: `${m(`x^{${j}}`.replace('x^{1}', 'x'))} needs ${m(`(${monoTex(a, 1)})^{${j}}`)}, so the second term is raised to ${m(String(k))}: ${m(termWork(n, k, a, 1, b, 0))}.` },
      { tex: m(`= ${nCr(n, k)} \\times ${a ** j} \\times ${b < 0 ? `(${b ** k})` : b ** k}\\,x^{${j}} = ${monoTex(t.coef, j)}`), why: 'Raise the coefficient and the sign, not just the variable.' },
      { tex: `Coefficient: ${m(String(t.coef))}.` },
    ];
    if (tier === 2) {
      const cands: Cand[] = [
        { tex: m(String(nCr(n, k))), key: nCr(n, k), mis: 'binom-coefficient-power', feedback: `The ${m(String(a))} and ${m(String(b))} are raised to powers too.` },
        { tex: m(String(-t.coef)), key: -t.coef, mis: 'binom-sign-alternate', feedback: `${m(`(${b})^{${k}}`)} is ${b ** k < 0 ? 'negative' : 'positive'}.` },
        { tex: m(String(binomTerm(n, k - 1, a, 1, b, 0).coef)), key: binomTerm(n, k - 1, a, 1, b, 0).coef, mis: 'binom-term-index', feedback: `Match powers: ${m(`x^{${j}}`)} comes with ${m(`k = ${k}`)}.` },
        { tex: m(String(nCr(n, k) * a * b)), key: nCr(n, k) * a * b, mis: 'binom-coefficient-power' },
      ];
      return { cognitive: 'procedural', stem, format: 'mc', choices: mc({ tex: m(String(t.coef)), key: t.coef }, cands), hints: ['General term: $t_{k+1} = {}_nC_k\\,(\\text{first})^{n-k}(\\text{second})^k$.', `The power of ${m('x')} is ${m('n - k')}.`, `Set ${m(`${n} - k = ${j}`)}.`], solution: sol };
    }
    return { cognitive: 'procedural', stem, format: 'input', fields: [field(nAns(t.coef))], hints: ['General term: $t_{k+1} = {}_nC_k\\,(\\text{first})^{n-k}(\\text{second})^k$.', `The power of ${m('x')} is ${m('n - k')}.`, `Set ${m(`${n} - k = ${j}`)}: ${m(`k = ${k}`)}.`], solution: sol, verify: () => binomExpand(n, a, 1, b, 0).find((u) => u.pow === j)?.coef === t.coef };
  },
};

const expandMc: Generator = {
  id: 'u6-expand-mc',
  nodeId: 'PCBT4.expand',
  title: 'Choose the correct expansion',
  make(rng, tier): Draft {
    const n = 3;
    const a = tier === 1 ? 1 : rng.pick([2, 3]);
    const b = rng.pick([-1, -2, -3, 2, 3]);
    const right = binomExpand(n, a, 1, b, 0);
    const noSign = binomExpand(n, a, 1, Math.abs(b), 0);
    const noPow = pascalRow(n).map((c, k) => ({ coef: c * a * (k === 0 ? 1 : b ** k) * (k === n ? 1 / a : 1), pow: n - k }));
    const noMid = [{ coef: a ** 3, pow: 3 }, { coef: b ** 3, pow: 0 }];
    const lead = pascalRow(n).map((c, k) => ({ coef: c * b ** k, pow: n - k }));
    return {
      cognitive: 'procedural',
      stem: `Which is the expansion of ${m(`${binTex(a, 1, b, 0)}^{3}`)}?`,
      format: 'mc',
      choices: mc({ tex: m(sumTex(right)), key: sumTex(right) }, [
        ...(b < 0 ? [{ tex: m(sumTex(noSign)), key: sumTex(noSign), mis: 'binom-sign-alternate', feedback: 'With a negative second term, the signs alternate.' }] : []),
        { tex: m(sumTex(noMid)), key: sumTex(noMid), mis: 'binom-coefficient-power', feedback: '$(p + q)^3 \\ne p^3 + q^3$: the middle terms are missing.' },
        ...(a > 1 ? [{ tex: m(sumTex(lead)), key: sumTex(lead), mis: 'binom-coefficient-power', feedback: `${m(`(${a}x)^3 = ${a ** 3}x^3`)}: raise the coefficient too.` }] : []),
        { tex: m(sumTex(noPow.map((t) => ({ coef: Math.round(t.coef), pow: t.pow })))), key: 'nopow' + sumTex(noPow.map((t) => ({ coef: Math.round(t.coef), pow: t.pow }))), mis: 'binom-coefficient-power' },
        { tex: m(sumTex(right.map((t, i) => ({ coef: i === 1 ? -t.coef : t.coef, pow: t.pow })))), key: 'flip', mis: 'binom-sign-alternate' },
      ]),
      hints: ['Coefficients for the power 3: 1, 3, 3, 1.', `Terms: ${m(`(${monoTex(a, 1)})^3`)}, ${m(`3(${monoTex(a, 1)})^2(${b})`)}, ${m(`3(${monoTex(a, 1)})(${b})^2`)}, ${m(`(${b})^3`)}.`, 'Evaluate each power, including signs.'],
      solution: [
        { tex: m(`(${monoTex(a, 1)})^3 + 3(${monoTex(a, 1)})^2(${b}) + 3(${monoTex(a, 1)})(${b})^2 + (${b})^3`) },
        { tex: m(`= ${sumTex(right)}`) },
      ],
    };
  },
};

// ---------------------------------------------------------------- PCBT4.general-term

const termKth: Generator = {
  id: 'u6-term-kth',
  nodeId: 'PCBT4.general-term',
  title: 'A specific term',
  make(rng, tier): Draft {
    const n = rng.int(5, 8);
    const a = tier === 1 ? 1 : rng.pick([1, 2, 3]);
    const b = tier === 1 ? rng.pick([1, 2, 3]) : rng.pick([-1, -2, 2, -3, 3]);
    const K = rng.int(2, n); // the K-th term, k = K − 1
    const k = K - 1;
    const t = binomTerm(n, k, a, 1, b, 0);
    if (Math.abs(t.coef) > 500000) throw new Reject();
    return {
      cognitive: 'procedural',
      stem: `Determine the ${ord(K)} term in the expansion of ${m(`${binTex(a, 1, b, 0)}^{${n}}`)}, in simplest form.`,
      format: 'input',
      fields: [field(monoAns(t.coef, t.pow), `t_{${K}} =`)],
      hints: ['$t_{k+1} = {}_nC_k\\,(\\text{first})^{n-k}(\\text{second})^k$.', `For the ${ord(K)} term, ${m(`k + 1 = ${K}`)}, so ${m(`k = ${k}`)}.`, m(termWork(n, k, a, 1, b, 0))],
      solution: [
        { tex: m(termWork(n, k, a, 1, b, 0)), why: `The ${ord(K)} term uses ${m(`k = ${k}`)}, one less than its position.` },
        { tex: m(`= ${nCr(n, k)}\\left(${monoTex(a ** (n - k), n - k)}\\right)\\left(${b ** k}\\right) = ${monoTex(t.coef, t.pow)}`) },
      ],
      verify: () => binomExpand(n, a, 1, b, 0).find((u) => u.pow === n - k)?.coef === t.coef,
    };
  },
};

const termKthMc: Generator = {
  id: 'u6-term-kth-mc',
  nodeId: 'PCBT4.general-term',
  title: 'Which is the term?',
  make(rng, tier): Draft {
    const n = rng.int(5, 8);
    const a = rng.pick([1, 2]);
    const b = tier === 1 ? rng.pick([2, 3]) : rng.pick([-2, -3, -1]);
    const K = rng.int(3, n);
    const k = K - 1;
    const t = binomTerm(n, k, a, 1, b, 0);
    const wrongIdx = binomTerm(n, K, a, 1, b, 0);
    const T = (c: number, p: number) => m(monoTex(c, p));
    return {
      cognitive: 'procedural',
      stem: `What is the ${ord(K)} term in the expansion of ${m(`${binTex(a, 1, b, 0)}^{${n}}`)}?`,
      format: 'mc',
      choices: mc({ tex: T(t.coef, t.pow), key: `${t.coef}|${t.pow}` }, [
        { tex: T(wrongIdx.coef, wrongIdx.pow), key: `${wrongIdx.coef}|${wrongIdx.pow}`, mis: 'binom-term-index', feedback: `The ${ord(K)} term is ${m(`t_{k+1}`)} with ${m(`k = ${k}`)}, not ${K}.` },
        { tex: T(nCr(n, k) * a * b, t.pow), key: `${nCr(n, k) * a * b}|${t.pow}`, mis: 'binom-coefficient-power', feedback: 'Raise each coefficient to its power.' },
        { tex: T(-t.coef, t.pow), key: `${-t.coef}|${t.pow}`, mis: 'binom-sign-alternate', feedback: `${m(`(${b})^{${k}}`)} is ${b ** k < 0 ? 'negative' : 'positive'}.` },
        { tex: T(nCr(n, k), t.pow), key: `${nCr(n, k)}|${t.pow}`, mis: 'binom-coefficient-power' },
      ]),
      hints: [`${m(`t_{k+1}`)} with ${m(`k + 1 = ${K}`)}.`, m(termWork(n, k, a, 1, b, 0)), 'Evaluate each power, including the sign.'],
      solution: [{ tex: m(termWork(n, k, a, 1, b, 0)) }, { tex: m(`= ${monoTex(t.coef, t.pow)}`), why: 'The term number is one more than $k$.' }],
    };
  },
};

const termMiddle: Generator = {
  id: 'u6-term-middle',
  nodeId: 'PCBT4.general-term',
  title: 'Middle term or term with a given power',
  make(rng, tier): Draft {
    const a = rng.pick([1, 2, 3]);
    const b = rng.pick([-1, -2, 2, 1, 3]);
    if (tier < 3) {
      const half = rng.int(2, 4);
      const n = 2 * half;
      const t = binomTerm(n, half, a, 1, b, 0);
      return {
        cognitive: 'problemSolving',
        stem: `Determine the middle term in the expansion of ${m(`${binTex(a, 1, b, 0)}^{${n}}`)}.`,
        format: 'input',
        fields: [field(monoAns(t.coef, t.pow), 't =')],
        hints: [`There are ${n + 1} terms.`, `The middle one is the ${ord(half + 1)}: ${m(`k = ${half}`)}.`, m(termWork(n, half, a, 1, b, 0))],
        solution: [
          { tex: `${n + 1} terms, so the middle is ${m(`t_{${half + 1}}`)}.`, why: `${half} terms on each side.` },
          { tex: m(`${termWork(n, half, a, 1, b, 0)} = ${monoTex(t.coef, t.pow)}`) },
        ],
      };
    }
    const n = rng.int(6, 9);
    const j = rng.int(2, n - 2);
    const k = n - j;
    const t = binomTerm(n, k, a, 1, b, 0);
    if (Math.abs(t.coef) > 500000) throw new Reject();
    return {
      cognitive: 'problemSolving',
      stem: `Determine the term containing ${m(`x^{${j}}`)} in the expansion of ${m(`${binTex(a, 1, b, 0)}^{${n}}`)}.`,
      format: 'input',
      fields: [field(monoAns(t.coef, t.pow), 't =')],
      hints: [`Power of ${m('x')} in ${m('t_{k+1}')}: ${m('n - k')}.`, `${m(`${n} - k = ${j}`)} gives ${m(`k = ${k}`)}.`, m(termWork(n, k, a, 1, b, 0))],
      solution: [{ tex: m(`${n} - k = ${j} \\Rightarrow k = ${k}`) }, { tex: m(`${termWork(n, k, a, 1, b, 0)} = ${monoTex(t.coef, t.pow)}`) }],
    };
  },
};

// ---------------------------------------------------------------- PCBT4.nonlinear-term

/** (a·x^p + b·x^(−q))^n with a constant term at integer k. */
function pickNonlinear(rng: Rng, needConstant: boolean) {
  for (let g = 0; g < 80; g++) {
    const p = rng.pick([1, 2, 2, 3]);
    const q = rng.pick([1, 1, 2]);
    const n = rng.int(3, 9);
    const k = (p * n) / (p + q);
    if (needConstant && !Number.isInteger(k)) continue;
    const a = rng.pick([1, 2, 3]);
    const b = rng.pick([1, -1, 2, -2]);
    if (Math.abs(binomTerm(n, Math.round(k), a, p, b, -q).coef) > 300000) continue;
    return { p, q, n, a, b, k: Math.round(k) };
  }
  throw new Reject();
}

const nlConstant: Generator = {
  id: 'u6-nl-constant',
  nodeId: 'PCBT4.nonlinear-term',
  title: 'Constant term',
  make(rng, tier): Draft {
    const { p, q, n, a, b, k } = pickNonlinear(rng, true);
    if (tier === 1 && (p !== 1 || q !== 1)) throw new Reject();
    const t = binomTerm(n, k, a, p, b, -q);
    return {
      cognitive: 'problemSolving',
      stem: `Determine the constant term in the expansion of ${m(`${binTex(a, p, b, -q)}^{${n}}`)}.`,
      format: 'input',
      fields: [field(nAns(t.coef))],
      hints: [`General term: ${m(termWork(n, 'k', a, p, b, -q))}.`, `Power of ${m('x')}: ${m(`${p}(${n} - k) - ${q}k`)}.`, `Set it to 0: ${m(`${p * n} - ${p + q}k = 0`)}.`],
      solution: [
        { tex: `Power of ${m('x')} in ${m('t_{k+1}')}: ${m(`${p}(${n} - k) - ${q}k = ${p * n} - ${p + q}k`)}.`, why: `${m(`(x^{${p}})^{${n} - k}`)} and ${m(`(x^{-${q}})^{k}`)} multiply, so exponents add.` },
        { tex: m(`${p * n} - ${p + q}k = 0 \\Rightarrow k = ${k}`) },
        { tex: m(`t_{${k + 1}} = ${C(n, k)}(${a})^{${n - k}}(${b})^{${k}} = ${t.coef}`), why: 'The powers of $x$ cancel, leaving the coefficient.' },
      ],
      verify: () => t.pow === 0,
    };
  },
};

const nlPower: Generator = {
  id: 'u6-nl-power',
  nodeId: 'PCBT4.nonlinear-term',
  title: 'Term with a given power',
  make(rng, tier): Draft {
    const { p, q, n, a, b } = pickNonlinear(rng, false);
    if (tier === 1 && q !== 1) throw new Reject();
    const k = rng.int(1, n - 1);
    const t = binomTerm(n, k, a, p, b, -q);
    if (t.pow === 0 || Math.abs(t.coef) > 300000) throw new Reject();
    const powTex = `x^{${t.pow}}`.replace('x^{1}', 'x');
    return {
      cognitive: 'problemSolving',
      stem: `Determine the term containing ${m(powTex)} in the expansion of ${m(`${binTex(a, p, b, -q)}^{${n}}`)}.`,
      format: 'input',
      fields: [field({ ...monoAns(t.coef, t.pow), tex: monoTex(t.coef, t.pow) }, 't =')],
      hints: [`Power of ${m('x')} in ${m('t_{k+1}')}: ${m(`${p}(${n} - k) - ${q}k`)}.`, `Set it equal to ${m(String(t.pow))} and solve for ${m('k')}.`, `${m(`k = ${k}`)}; now evaluate the coefficient.`],
      solution: [
        { tex: m(`${p * n} - ${p + q}k = ${t.pow} \\Rightarrow k = ${k}`), why: 'Exponents add: $p(n - k)$ from the first term and $-qk$ from the second.' },
        { tex: m(`t_{${k + 1}} = ${C(n, k)}(${monoTex(a, p)})^{${n - k}}\\left(${monoTex(b, -q)}\\right)^{${k}} = ${monoTex(t.coef, t.pow)}`) },
      ],
      verify: () => p * (n - k) - q * k === t.pow,
    };
  },
};

const nlExponent: Generator = {
  id: 'u6-nl-exponent',
  nodeId: 'PCBT4.nonlinear-term',
  title: 'Exponent in the general term',
  make(rng, tier): Draft {
    const { p, q, n, a, b } = pickNonlinear(rng, false);
    const right = `${p * n} - ${p + q}k`;
    const fn = (k: number) => p * n - (p + q) * k;
    const stem = `In the general term ${m('t_{k+1}')} of ${m(`${binTex(a, p, b, -q)}^{${n}}`)}, what is the exponent of ${m('x')}?`;
    const sol = [
      { tex: m(`\\left(${monoTex(a, p)}\\right)^{${n} - k}\\left(${monoTex(b, -q)}\\right)^{k}`), why: 'Only the powers of $x$ matter for the exponent.' },
      { tex: m(`x^{${p}(${n} - k)} \\cdot x^{-${q}k} = x^{${right}}`), why: 'Multiply powers of the same base by adding exponents.' },
    ];
    if (tier === 3)
      return { cognitive: 'conceptual', stem: stem + ' (Answer in terms of $k$.)', format: 'input', fields: [field({ kind: 'expr', tex: right, variable: 'k', fn, sample: [0, n], exact: true })], hints: [`The first term contributes ${m(`${p}(${n} - k)`)}.`, `The second contributes ${m(`-${q}k`)}.`, 'Add and simplify.'], solution: sol };
    const cands: Cand[] = [
      { tex: m(`${p * n} - ${p - q === 0 ? '' : p - q}k`.replace('- 0k', '').replace('- 1k', '- k')), key: 'pq', mis: 'binom-nonlinear-exponent', feedback: `The second term has ${m(`x^{-${q}}`)}: subtract ${m(`${q}k`)}, don’t add it.` },
      { tex: m(`${n} - ${1 + q}k`.replace('- 1k', '- k')), key: 'np', mis: 'binom-nonlinear-exponent', feedback: `The first term is ${m(`x^{${p}}`)}, so its exponent is multiplied by ${p}.` },
      { tex: m(`${p * n} - k`), key: 'k', mis: 'binom-nonlinear-exponent' },
      { tex: m(`${n} - k`), key: 'nk', mis: 'binom-nonlinear-exponent' },
    ];
    return { cognitive: 'conceptual', stem, format: 'mc', choices: mc({ tex: m(right), key: right }, cands), hints: [`${m(`(x^{${p}})^{${n} - k}`)} gives ${m(`x^{${p}(${n} - k)}`)}.`, `${m(`(x^{-${q}})^k`)} gives ${m(`x^{-${q}k}`)}.`, 'Add the exponents.'], solution: sol };
  },
};

// ---------------------------------------------------------------- PCBT4.find-unknown

const findA: Generator = {
  id: 'u6-find-a',
  nodeId: 'PCBT4.find-unknown',
  title: 'Find a constant from a term',
  make(rng, tier): Draft {
    const n = rng.int(4, 7);
    const K = tier === 1 ? 2 : rng.int(2, 4);
    const k = K - 1;
    const aVal = rng.pick([2, 3, -2, -3, 4, 5]);
    const c = nCr(n, k) * aVal ** k;
    const sols = k % 2 === 0 ? [Math.abs(aVal), -Math.abs(aVal)] : [aVal];
    const ak = k === 1 ? 'a' : `a^{${k}}`;
    return {
      cognitive: 'problemSolving',
      stem: `In the expansion of ${m(`(x + a)^{${n}}`)}, the ${ord(K)} term is ${m(monoTex(c, n - k))}. Determine all possible values of ${m('a')}.`,
      format: 'input',
      fields: [field(setAns(sols), 'a =')],
      hints: [`${m(`t_{${K}} = ${C(n, k)}x^{${n - k}}${ak}`)}.`, `${m(`${nCr(n, k)}${ak} = ${c}`)}.`, k % 2 === 0 ? 'An even power has two real roots.' : 'Solve for $a$.'],
      solution: [
        { tex: m(`t_{${K}} = ${C(n, k)}(x)^{${n - k}}(a)^{${k}} = ${nCr(n, k)}${ak}x^{${n - k}}`) },
        { tex: m(`${nCr(n, k)}${ak} = ${c} \\Rightarrow ${ak} = ${c / nCr(n, k)}`) },
        { tex: m(k % 2 === 0 ? `a = \\pm ${Math.abs(aVal)}` : `a = ${aVal}`), why: k % 2 === 0 ? 'Both signs give the same even power.' : 'An odd power keeps the sign.' },
      ],
      verify: () => sols.every((s) => nCr(n, k) * s ** k === c),
    };
  },
};

const findN: Generator = {
  id: 'u6-find-n',
  nodeId: 'PCBT4.find-unknown',
  title: 'Find the exponent n',
  make(rng, tier): Draft {
    const n = rng.int(5, 12);
    if (tier === 1) {
      const b = rng.pick([2, 3, 4, 5]);
      const c = n * b;
      return {
        cognitive: 'problemSolving',
        stem: `In the expansion of ${m(`(1 + ${b}x)^n`)}, the coefficient of ${m('x')} is ${m(String(c))}. Determine ${m('n')}.`,
        format: 'input',
        fields: [field(nAns(n), 'n =')],
        hints: [`The ${m('x')} term is ${m('t_2')}.`, `${m(`t_2 = ${C('n', 1)}(1)^{n-1}(${b}x)^1 = ${b}nx`)}`, `${m(`${b}n = ${c}`)}`],
        solution: [{ tex: m(`t_2 = ${C('n', 1)}(${b}x) = ${b}nx`) }, { tex: m(`${b}n = ${c} \\Rightarrow n = ${n}`) }],
        verify: () => binomTerm(n, 1, 1, 0, b, 1).coef === c,
      };
    }
    const c = nCr(n, 2);
    return {
      cognitive: 'problemSolving',
      stem: `In the expansion of ${m('(1 + x)^n')}, the coefficient of ${m('x^2')} is ${m(String(c))}. Determine ${m('n')}.`,
      format: 'input',
      fields: [field(nAns(n), 'n =')],
      hints: [`The ${m('x^2')} term is ${m(`${C('n', 2)}x^2`)}.`, `${m(`\\frac{n(n - 1)}{2} = ${c}`)}`, 'Solve the quadratic and reject the negative root.'],
      solution: [
        { tex: m(`${C('n', 2)} = ${c} \\Rightarrow n(n - 1) = ${2 * c}`) },
        { tex: m(`(n - ${n})(n + ${n - 1}) = 0 \\Rightarrow n = ${n}`), why: '$n$ is a natural number.' },
      ],
      verify: () => nCr(n, 2) === c,
    };
  },
};

const findNConstant: Generator = {
  id: 'u6-find-n-constant',
  nodeId: 'PCBT4.find-unknown',
  title: 'Find n from the constant term’s position',
  make(rng, tier): Draft {
    const p = tier === 1 ? 1 : rng.pick([1, 2, 3]);
    const q = tier === 1 ? 1 : rng.pick([1, 2]);
    const k = rng.int(2, 5);
    const nv = (k * (p + q)) / p;
    if (!Number.isInteger(nv) || nv > 12) throw new Reject();
    const first = p === 1 ? 'x' : `x^{${p}}`;
    const second = q === 1 ? '\\frac{1}{x}' : `\\frac{1}{x^{${q}}}`;
    return {
      cognitive: 'problemSolving',
      stem: `The ${ord(k + 1)} term in the expansion of ${m(`\\left(${first} + ${second}\\right)^n`)} is the constant term. Determine ${m('n')}.`,
      format: 'input',
      fields: [field(nAns(nv), 'n =')],
      hints: [`The ${ord(k + 1)} term has ${m(`k = ${k}`)}.`, `Its power of ${m('x')}: ${m(`${p}(n - ${k}) - ${q}(${k})`)}.`, 'Set it to 0 and solve for $n$.'],
      solution: [
        { tex: m(`t_{${k + 1}} = ${C('n', k)}\\left(${first}\\right)^{n - ${k}}\\left(${second}\\right)^{${k}}`) },
        { tex: m(`${p === 1 ? '' : p}(n - ${k}) - ${q * k} = 0 \\Rightarrow n = ${nv}`), why: 'A constant term has $x^0$.' },
      ],
      verify: () => p * (nv - k) - q * k === 0,
    };
  },
};

export const binomialGenerators: Generator[] = [pascalEntry, pascalSum, pascalTerms, expandFull, expandCoef, expandMc, termKth, termKthMc, termMiddle, nlConstant, nlPower, nlExponent, findA, findN, findNConstant];
