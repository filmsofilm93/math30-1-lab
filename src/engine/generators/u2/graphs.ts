// RF12: characteristics, zeros and multiplicity, sketching, equations from graphs, calculator analysis, models.
import { intervalTex, iv, normalize, type RealSet } from '../../check/realset';
import { field, m, mc } from '../../framework';
import { F, Frac, polyEval, polyTex } from '../../frac';
import type { AnswerSpec, Draft, Generator } from '../../types';
import type { Rng } from '../../rng';
import { Reject } from '../../types';
import { factoredTex, mulP, num, setAns } from '../pre/shared';
import { ALL_ENDS, behaviour, bisect, distinctZeros, endBehaviour, extremum, fromZeros, linFactors, nearBoundary, polyGraph, round, type Poly } from './shared';

type Z = { r: number; m: number };
const degreeOf = (zs: Z[]) => zs.reduce((s, z) => s + z.m, 0);
const yInt = (k: number, zs: Z[]) => zs.reduce((acc, z) => acc * (-z.r) ** z.m, k);
const ftex = (k: number, zs: Z[]) => factoredTex(k, [...linFactors([...zs].sort((a, b) => a.r - b.r))]);
const intervalAns = (v: RealSet): AnswerSpec => ({ kind: 'interval', value: v, tex: intervalTex(v) });

/** 2–4 distinct zeros with multiplicities 1–3, total degree ≤ 5. */
function zeroSet(rng: Rng, n: number, maxM = 3): Z[] {
  for (;;) {
    const rs = distinctZeros(rng, n, -4, 4);
    const zs = rs.map((r) => ({ r, m: rng.int(1, maxM) }));
    if (degreeOf(zs) <= 5) return zs.sort((a, b) => a.r - b.r);
  }
}

// ---------------------------------------------------------------- RF12.characteristics

const charEnd: Generator = {
  id: 'u2-char-end',
  nodeId: 'RF12.characteristics',
  title: 'End behaviour',
  make(rng, tier): Draft {
    const deg = rng.int(2, 5);
    const lead = rng.nz(-4, 4);
    let shown: string;
    let reason: string;
    if (tier === 3) {
      // Factored, with a (c − x) factor that flips the sign of the leading coefficient.
      const zs = zeroSet(rng, 2, 2);
      const c = rng.int(1, 5);
      const k = rng.pick([1, 2, -1, -3]);
      shown = `${k === 1 ? '' : k === -1 ? '-' : k}${linFactors(zs).length ? ftex(1, zs) : ''}\\left(${c}-x\\right)`;
      const d = degreeOf(zs) + 1;
      const L = -k;
      return endItem(shown, d, L, `Degree ${m(`${degreeOf(zs)} + 1 = ${d}`)}; leading coefficient ${m(`${k} \\times (-1) = ${L}`)} (the ${m(`(${c} - x)`)} factor contributes ${m('-x')}).`);
    }
    const p: Poly = [lead, ...Array.from({ length: deg }, () => rng.int(-6, 6))];
    if (tier === 1) {
      shown = polyTex(p);
      reason = `Degree ${m(String(deg))}, leading coefficient ${m(String(lead))}.`;
    } else {
      // Terms written out of order: the leading term is not first.
      const terms = p.map((c, i) => ({ c, pw: deg - i })).filter((t) => t.c !== 0);
      const order = [...terms.slice(1), terms[0]];
      shown = order
        .map((t, i) => {
          const mono = t.pw === 0 ? '' : t.pw === 1 ? 'x' : `x^{${t.pw}}`;
          const mag = Math.abs(t.c) === 1 && t.pw ? '' : String(Math.abs(t.c));
          return `${t.c < 0 ? '-' : i ? '+' : ''}${mag}${mono}`;
        })
        .join('');
      reason = `The highest power is ${m(`x^{${deg}}`)} with coefficient ${m(String(lead))}, wherever it is written.`;
    }
    return endItem(shown, deg, lead, reason);
  },
};

function endItem(shown: string, deg: number, lead: number, reason: string): Draft {
  const right = endBehaviour(deg, lead);
  return {
    cognitive: 'conceptual',
    stem: `Describe the end behaviour of ${m(`P(x) = ${shown}`)}.`,
    format: 'mc',
    choices: mc(
      { tex: `Extends from ${right}`, key: right },
      ALL_ENDS.filter((e) => e !== right).map((e) => ({ tex: `Extends from ${e}`, key: e, mis: 'poly-end-behaviour', feedback: 'End behaviour depends only on the degree (odd or even) and the sign of the leading coefficient.' })),
    ),
    hints: ['Only the leading term matters for very large $|x|$.', 'Odd degree: opposite ends. Even degree: same side. Positive leading coefficient: rises to the right.', reason],
    solution: [
      { tex: reason },
      { tex: `${deg % 2 ? 'Odd' : 'Even'} degree, ${lead > 0 ? 'positive' : 'negative'} leading coefficient: extends from ${right}.`, why: 'For large $|x|$ the leading term outgrows all the others.' },
    ],
  };
}

const charYint: Generator = {
  id: 'u2-char-yint',
  nodeId: 'RF12.characteristics',
  title: 'y-intercept from factored form',
  make(rng, tier): Draft {
    const zs = zeroSet(rng, tier === 1 ? 2 : 3, tier === 1 ? 1 : 2);
    if (zs.some((z) => z.r === 0)) throw new Reject();
    const k = tier === 1 ? 1 : rng.pick([2, -1, -2, 3, -3]);
    const b = yInt(k, zs);
    const noK = yInt(1, zs);
    const noSign = k * zs.reduce((acc, z) => acc * z.r ** z.m, 1);
    const f = ftex(k, zs);
    const stem = `What is the ${m('y')}-intercept of ${m(`P(x) = ${f}`)}?`;
    const hints: [string, string, string] = ['The $y$-intercept is $P(0)$.', 'Replace every $x$ with $0$, keeping signs and powers.', `${m(`P(0) = ${k === 1 ? '' : `${k}`}${zs.map((z) => `(${-z.r})${z.m > 1 ? `^{${z.m}}` : ''}`).join('')}`)}.`];
    const solution = [
      { tex: m(`P(0) = ${k === 1 ? '' : `${k}`}${zs.map((z) => `(${-z.r})${z.m > 1 ? `^{${z.m}}` : ''}`).join('')} = ${b}`), why: 'Each factor $(x - r)$ becomes $-r$ at $x = 0$; the leading constant stays.' },
      { tex: `The ${m('y')}-intercept is ${m(String(b))}.` },
    ];
    if (tier < 3)
      return {
        cognitive: 'procedural',
        stem,
        format: 'mc',
        choices: mc({ tex: m(String(b)), key: b }, [
          { tex: m(String(noSign)), key: noSign, mis: 'poly-yint', feedback: 'At $x = 0$, $(x - r)$ becomes $-r$, not $r$.' },
          { tex: m(String(noK)), key: noK, mis: 'poly-yint', feedback: 'Multiply by the leading constant too.' },
          { tex: m(String(-b)), key: -b, mis: 'poly-yint' },
          { tex: m(String(zs.reduce((s, z) => s + z.r, 0))), key: zs.reduce((s, z) => s + z.r, 0), mis: 'poly-yint' },
          { tex: m(String(-zs.reduce((s, z) => s + z.r, 0))), key: -zs.reduce((s, z) => s + z.r, 0), mis: 'poly-yint' },
          { tex: m(String(2 * b)), key: 2 * b, mis: 'poly-yint' },
        ]),
        hints,
        solution,
        verify: () => polyEval(fromZeros(k, zs))(0) === b,
      };
    return { cognitive: 'procedural', stem, format: 'input', fields: [field(num(b), 'y\\text{-int} =')], hints, solution, verify: () => polyEval(fromZeros(k, zs))(0) === b };
  },
};

const charDegree: Generator = {
  id: 'u2-char-degree',
  nodeId: 'RF12.characteristics',
  title: 'Degree and leading coefficient',
  make(rng, tier): Draft {
    const zs = zeroSet(rng, tier === 1 ? 2 : 3);
    const k = rng.pick([1, -1, 2, -2, 3]);
    // Tier 3 adds a (2x ± 1) factor so the leading coefficient isn't just k.
    const extra: Poly | null = tier === 3 ? [2, rng.pick([1, -1, 3])] : null;
    const fs = [...linFactors([...zs].sort((a, b) => a.r - b.r)), ...(extra ? [extra] : [])];
    const deg = degreeOf(zs) + (extra ? 1 : 0);
    if (deg > 5) throw new Reject();
    const lead = k * (extra ? 2 : 1);
    return {
      cognitive: 'procedural',
      stem: `For ${m(`P(x) = ${factoredTex(k, fs)}`)}, state the degree and the leading coefficient.`,
      format: 'input',
      fields: [field(num(deg), '\\text{degree} ='), field(num(lead), '\\text{leading coefficient} =')],
      hints: ['You do not need to expand.', 'Degree: add the exponents of $x$ from every factor (a power counts its multiplicity).', 'Leading coefficient: multiply the constant in front by each factor’s $x$-coefficient (raised to its power).'],
      solution: [
        { tex: `Degree ${m(`= ${[...zs.map((z) => z.m), ...(extra ? [1] : [])].join(' + ')} = ${deg}`)}.`, why: 'A squared factor contributes $x^2$ to the leading term, so it counts twice.' },
        { tex: extra ? `Leading coefficient ${m(`= ${k} \\times 2 = ${lead}`)}.` : `Leading coefficient ${m(`= ${lead}`)}, the constant in front (every other factor starts with ${m('x')}).` },
      ],
      verify: () => fromZeros(1, zs).length - 1 + (extra ? 1 : 0) === deg,
    };
  },
};

// ---------------------------------------------------------------- RF12.zeros-multiplicity

const multBehaviour: Generator = {
  id: 'u2-mult-behaviour',
  nodeId: 'RF12.zeros-multiplicity',
  title: 'Behaviour at a zero',
  make(rng, tier): Draft {
    const zs = zeroSet(rng, tier === 1 ? 2 : 3);
    const target = rng.pick(zs);
    const k = rng.pick([1, -1, 2, -2]);
    const opts = [1, 2, 3].map((mm) => `The graph ${behaviour(mm)}`);
    return {
      cognitive: 'conceptual',
      stem: `How does the graph of ${m(`y = ${ftex(k, zs)}`)} behave at ${m(`x = ${target.r}`)}?`,
      format: 'mc',
      choices: mc({ tex: opts[target.m - 1], key: target.m }, [
        ...[1, 2, 3].filter((mm) => mm !== target.m).map((mm) => ({ tex: opts[mm - 1], key: mm, mis: 'poly-mult-behaviour', feedback: `The factor $(${target.r < 0 ? `x+${-target.r}` : `x-${target.r}`})$ has multiplicity ${target.m}: ${target.m === 1 ? 'odd and 1, so straight through' : target.m === 2 ? 'even, so it bounces' : 'odd and more than 1, so it crosses with a flat point'}.` })),
        { tex: 'The graph does not reach the $x$-axis there', key: 0, mis: 'poly-zero-sign' },
      ]),
      hints: ['Find the factor that gives this zero and its exponent.', 'Multiplicity 1: crosses. 2: bounces. 3: crosses and flattens.', `The factor for ${m(`x = ${target.r}`)} has exponent ${m(String(target.m))}.`],
      solution: [
        { tex: `${m(`x = ${target.r}`)} has multiplicity ${m(String(target.m))}.` },
        { tex: `So the graph ${behaviour(target.m)}.`, why: 'Even multiplicity: the factor does not change sign, so neither does $y$. Odd: the sign changes.' },
      ],
    };
  },
};

const multZeros: Generator = {
  id: 'u2-mult-zeros',
  nodeId: 'RF12.zeros-multiplicity',
  title: 'Zeros from factored form',
  make(rng, tier): Draft {
    const zs = zeroSet(rng, 2, 2);
    const fs: Poly[] = linFactors(zs);
    const vals: Frac[] = zs.map((z) => F(z.r));
    const sorted = () => [...vals].sort((a, b) => a.value - b.value);
    if (tier >= 2) {
      const b = rng.pick([1, -1, 3, -3, 5]);
      fs.push([2, b]);
      vals.push(F(-b, 2));
    }
    let note = '';
    if (tier === 3) {
      const c = rng.pick([1, 4, 9]);
      fs.push([1, 0, c]);
      note = ` The factor ${m(`x^2 + ${c}`)} has no real zeros.`;
    }
    const k = rng.pick([1, -1, 2, 3]);
    if (fs.reduce((s, f) => s + f.length - 1, 0) > 5) throw new Reject();
    return {
      cognitive: 'procedural',
      stem: `List all the real zeros of ${m(`P(x) = ${factoredTex(k, fs)}`)}.`,
      format: 'input',
      fields: [field(setAns(vals), 'x =')],
      hints: ['Set each factor equal to zero.', 'A repeated factor gives one zero (listed once).', tier >= 2 ? `${m('2x + b = 0')} gives ${m('x = -\\frac{b}{2}')}.` : 'The constant in front never gives a zero.'],
      solution: [
        { tex: `Set each factor to zero.${note}`, why: 'A product is zero exactly when one of its factors is.' },
        { tex: `Zeros: ${m(sorted().map((v) => v.tex()).join(', '))}.` },
      ],
      verify: () => vals.every((v) => Math.abs(fs.reduce((a, f) => a * polyEval(f)(v.value), k)) < 1e-9),
    };
  },
};

const multLeastDegree: Generator = {
  id: 'u2-mult-least-degree',
  nodeId: 'RF12.zeros-multiplicity',
  title: 'Least possible degree from a graph',
  make(rng, tier): Draft {
    const zs = zeroSet(rng, tier === 1 ? 2 : 3);
    const k = rng.pick([1, -1]) * (degreeOf(zs) >= 4 ? 0.25 : 0.5);
    const p = fromZeros(1, zs).map((c) => c * k);
    const deg = degreeOf(zs);
    return {
      cognitive: 'conceptual',
      stem: `The graph of a polynomial function is shown. Its zeros are integers. What is the least possible degree of the function?`,
      graph: polyGraph(p, zs.map((z) => z.r)),
      format: 'input',
      fields: [field(num(deg), '\\text{degree} =')],
      hints: ['Look at how the graph meets the $x$-axis at each zero.', 'Crosses straight: multiplicity 1. Bounces: at least 2. Crosses with a flat point: at least 3.', 'Add the least multiplicities.'],
      solution: [
        ...zs.map((z) => ({ tex: `At ${m(`x = ${z.r}`)} the graph ${behaviour(z.m)}: multiplicity ${m(String(z.m))}.` })),
        { tex: `Least degree ${m(`= ${zs.map((z) => z.m).join(' + ')} = ${deg}`)}.`, why: 'The degree is the sum of the multiplicities (assuming no non-real zeros).' },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF12.sketch

const sketchDescribe: Generator = {
  id: 'u2-sketch-describe',
  nodeId: 'RF12.sketch',
  title: 'Describe the graph',
  make(rng, tier): Draft {
    const zs = zeroSet(rng, tier === 1 ? 2 : 3, 2);
    if (zs.every((z) => z.m === zs[0].m) || zs.some((z) => z.r === 0)) throw new Reject();
    const k = rng.pick([1, -1, 2, -2]);
    const deg = degreeOf(zs);
    const b = yInt(k, zs);
    const desc = (end: string, crossAt: number[], bounceAt: number[], y: number) =>
      `From ${end}; crosses at ${m(crossAt.length ? crossAt.join(', ') : '\\text{none}')}; bounces at ${m(bounceAt.length ? bounceAt.join(', ') : '\\text{none}')}; ${m('y')}-intercept ${m(String(y))}`;
    const cross = zs.filter((z) => z.m % 2).map((z) => z.r).sort((a, c) => a - c);
    const bounce = zs.filter((z) => z.m % 2 === 0).map((z) => z.r).sort((a, c) => a - c);
    const right = desc(endBehaviour(deg, k), cross, bounce, b);
    return {
      cognitive: 'conceptual',
      stem: `Which describes the graph of ${m(`P(x) = ${ftex(k, zs)}`)}?`,
      format: 'mc',
      choices: mc({ tex: right, key: 'ok' }, [
        { tex: desc(endBehaviour(deg, -k), cross, bounce, b), key: 'end', mis: 'poly-end-behaviour' },
        { tex: desc(endBehaviour(deg, k), bounce, cross, b), key: 'mult', mis: 'poly-mult-behaviour', feedback: 'Odd multiplicity crosses; even multiplicity bounces.' },
        { tex: desc(endBehaviour(deg, k), cross, bounce, -b), key: 'y', mis: 'poly-yint' },
        { tex: desc(endBehaviour(deg, k), cross.map((x) => -x), bounce.map((x) => -x), b), key: 'zero', mis: 'poly-zero-sign' },
      ]),
      hints: ['Check four things: end behaviour, each zero, each zero’s behaviour, the $y$-intercept.', `Degree ${m(String(deg))}, leading coefficient sign ${k > 0 ? 'positive' : 'negative'}.`, `${m(`P(0) = ${b}`)}.`],
      solution: [
        { tex: `Degree ${m(String(deg))}, leading coefficient ${m(String(k))}: from ${endBehaviour(deg, k)}.` },
        { tex: `Odd multiplicity (crosses): ${m(cross.join(', ') || '\\text{none}')}; even (bounces): ${m(bounce.join(', ') || '\\text{none}')}.` },
        { tex: `${m(`P(0) = ${b}`)}.` },
      ],
    };
  },
};

const sketchCheck: Generator = {
  id: 'u2-sketch-check',
  nodeId: 'RF12.sketch',
  title: 'Check a sketch',
  make(rng, tier): Draft {
    const zs = zeroSet(rng, tier === 1 ? 2 : 3, 2);
    const ones = zs.filter((z) => z.m === 1);
    const twos = zs.filter((z) => z.m === 2);
    if (!ones.length || !twos.length || zs.some((z) => z.r === 0)) throw new Reject();
    const k = rng.pick([1, -1]) * (degreeOf(zs) >= 4 ? 0.25 : 0.5);
    const b = yInt(k, zs);
    const error = rng.pick(['none', 'mult', 'yint'] as const);
    let shownZs = zs;
    let shownK = k;
    if (error === 'mult') {
      shownZs = zs.map((z) => (z === ones[0] ? { ...z, m: 2 } : z === twos[0] ? { ...z, m: 1 } : z));
      // Keep the y-intercept right so only the multiplicities are wrong.
      shownK = (k * yInt(1, zs)) / yInt(1, shownZs);
      // Swapping multiplicities can change the sign of the leading coefficient; then the end behaviour is wrong too.
      if (Math.sign(shownK) !== Math.sign(k)) throw new Reject();
    }
    if (error === 'yint') shownK = k * 2;
    const p = fromZeros(1, shownZs).map((c) => c * shownK);
    const shownB = polyEval(p)(0);
    const kTex = new Frac(Math.round(k * 4), 4).tex();
    const answers = {
      none: 'The sketch is correct',
      mult: 'The behaviour at the zeros is wrong',
      yint: 'The $y$-intercept is wrong',
      end: 'The end behaviour is wrong',
    };
    return {
      cognitive: 'conceptual',
      stem: `A student sketched ${m(`P(x) = ${kTex === '1' ? '' : kTex === '-1' ? '-' : kTex}${ftex(1, zs)}`)} as shown, with the ${m('y')}-intercept marked. Is the sketch correct?`,
      graph: polyGraph(p, zs.map((z) => z.r), [{ x: 0, y: shownB, label: `(0, ${+shownB.toFixed(2)})`, kind: 'key' }]),
      format: 'mc',
      choices: mc(
        { tex: answers[error], key: error },
        (['none', 'mult', 'yint', 'end'] as const).filter((e) => e !== error).map((e) => ({ tex: answers[e], key: e, mis: 'poly-sketch-check', feedback: e === 'end' ? 'Degree and leading coefficient match the ends of this sketch.' : undefined })),
      ),
      hints: ['Check end behaviour, the behaviour at each zero, and the $y$-intercept, one at a time.', `Multiplicities: ${zs.map((z) => `${m(`x = ${z.r}`)} has ${z.m}`).join(', ')}.`, `${m(`P(0) = ${+b.toFixed(2)}`)}.`],
      solution: [
        { tex: `End behaviour: degree ${m(String(degreeOf(zs)))}, leading coefficient ${m(kTex)}: from ${endBehaviour(degreeOf(zs), k)}. The sketch matches.` },
        { tex: `Zeros: ${zs.map((z) => `${m(`x = ${z.r}`)} should ${z.m === 1 ? 'cross' : 'bounce'}`).join('; ')}.${error === 'mult' ? ' The sketch swaps two of these.' : ' The sketch matches.'}` },
        { tex: `${m('y')}-intercept should be ${m(String(+b.toFixed(2)))}${error === 'yint' ? `, but the sketch shows ${m(String(+shownB.toFixed(2)))}` : ', as shown'}.` },
      ],
      verify: () => (error === 'yint') === (Math.abs(shownB - b) > 1e-9),
    };
  },
};

/** Where P > 0 (sign = 1) or P < 0, optionally including zeros. */
function signSet(p: Poly, zeros: number[], sign: 1 | -1, inclusive: boolean): RealSet {
  const f = polyEval(p);
  const xs = [...zeros].sort((a, b) => a - b);
  const cuts = [-Infinity, ...xs, Infinity];
  const out: RealSet = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const a = cuts[i];
    const b = cuts[i + 1];
    const mid = a === -Infinity ? b - 1 : b === Infinity ? a + 1 : (a + b) / 2;
    if (Math.sign(f(mid)) === sign) out.push(iv(a, b, inclusive, inclusive));
  }
  if (inclusive) xs.forEach((z) => out.push(iv(z, z, true, true)));
  return normalize(out);
}

const sketchSign: Generator = {
  id: 'u2-sketch-sign',
  nodeId: 'RF12.sketch',
  title: 'Where is P(x) positive or negative?',
  make(rng, tier): Draft {
    const zs = zeroSet(rng, tier === 1 ? 2 : 3, tier === 1 ? 1 : 2);
    const k = rng.pick([1, -1, 2, -1]);
    const p = fromZeros(k, zs);
    const sign = rng.pick([1, -1] as const);
    const inclusive = tier === 3 && rng.chance(0.5);
    const want = signSet(p, zs.map((z) => z.r), sign, inclusive);
    if (!want.length) throw new Reject();
    const rel = sign === 1 ? (inclusive ? '\\ge' : '>') : inclusive ? '\\le' : '<';
    return {
      cognitive: 'problemSolving',
      stem: `For ${m(`P(x) = ${ftex(k, zs)}`)}, determine the values of ${m('x')} for which ${m(`P(x) ${rel} 0`)}. Use interval notation.`,
      format: 'input',
      fields: [field(intervalAns(want), '', 'x-values')],
      hints: ['Sketch it: zeros, behaviour at each zero, end behaviour.', 'The sign changes only at zeros of odd multiplicity.', `Start from the far right, where the sign is that of the leading coefficient (${k > 0 ? 'positive' : 'negative'}).`],
      solution: [
        { tex: `Zeros ${m(zs.map((z) => z.r).sort((a, b) => a - b).join(', '))}; sign changes at the odd-multiplicity zeros only.` },
        { tex: `Reading the sign chart from the right (sign of ${m(String(k))}): ${m(`P(x) ${rel} 0`)} on ${m(intervalTex(want))}.`, why: inclusive ? 'The inequality includes 0, so the zeros themselves are included.' : 'Strict inequality: the zeros are excluded.' },
      ],
      verify: () => [-10, -3.5, -0.5, 0.5, 2.5, 10].every((x) => (want.some((i) => x > i.lo && x < i.hi) ? Math.sign(polyEval(p)(x)) === sign || polyEval(p)(x) === 0 : true)),
    };
  },
};

// ---------------------------------------------------------------- RF12.equation-from-graph

function graphPoly(rng: Rng, tier: number) {
  const zs = zeroSet(rng, tier === 1 ? 2 : 3);
  if (zs.some((z) => z.r === 0)) throw new Reject();
  const base = yInt(1, zs);
  // Pick k so the y-intercept is a small integer.
  const k = tier === 1 ? rng.pick([1, -1]) : rng.pick([1, -1, 2, -2, 0.5, -0.5]);
  const b = k * base;
  if (!Number.isInteger(b) || Math.abs(b) > 30) throw new Reject();
  return { zs, k, b, p: fromZeros(1, zs).map((c) => c * k) };
}
const kTexOf = (k: number) => new Frac(Math.round(k * 2), 2).tex();
const withK = (k: number, zs: Z[]) => {
  const t = kTexOf(k);
  return `${t === '1' ? '' : t === '-1' ? '-' : t}${ftex(1, zs)}`;
};

const eqGraphMc: Generator = {
  id: 'u2-eqgraph-mc',
  nodeId: 'RF12.equation-from-graph',
  title: 'Choose the equation of a graph',
  make(rng, tier): Draft {
    const { zs, k, b, p } = graphPoly(rng, tier);
    const flipped = zs.map((z) => ({ ...z, r: -z.r }));
    const swapped = zs.map((z, i) => (i === 0 ? { ...z, m: z.m === 1 ? 2 : 1 } : z));
    return {
      cognitive: 'problemSolving',
      stem: 'Which equation matches the graph? The marked point is the $y$-intercept.',
      graph: polyGraph(p, zs.map((z) => z.r), [{ x: 0, y: b, label: `(0, ${b})`, kind: 'key' }]),
      format: 'mc',
      choices: mc({ tex: m(`y = ${withK(k, zs)}`), key: 'ok' }, [
        { tex: m(`y = ${withK(k, flipped)}`), key: 'flip', mis: 'poly-zero-sign', feedback: 'A zero at $x = a$ comes from the factor $(x - a)$.' },
        { tex: m(`y = ${withK(-k, zs)}`), key: 'neg', mis: 'poly-yint' },
        { tex: m(`y = ${withK(k, swapped)}`), key: 'mult', mis: 'poly-mult-behaviour' },
        { tex: m(`y = ${withK(k * 2, zs)}`), key: 'k2', mis: 'poly-yint' },
      ]),
      hints: ['Read the zeros, then how the graph behaves at each.', 'Cross: power 1. Bounce: power 2. Flat crossing: power 3.', `Use the ${m('y')}-intercept ${m(String(b))} to check the leading constant.`],
      solution: [
        { tex: `Zeros and multiplicities: ${zs.map((z) => `${m(String(z.r))} (${z.m})`).join(', ')}.` },
        { tex: `${m(`y = a${ftex(1, zs)}`)}; at ${m('x = 0')}: ${m(`${b} = a(${yInt(1, zs)})`)}, so ${m(`a = ${kTexOf(k)}`)}.`, why: 'The $y$-intercept fixes the vertical stretch.' },
      ],
    };
  },
};

const eqGraphInput: Generator = {
  id: 'u2-eqgraph-input',
  nodeId: 'RF12.equation-from-graph',
  title: 'Write the equation of a graph',
  make(rng, tier): Draft {
    const { zs, k, b, p } = graphPoly(rng, tier);
    const ans: AnswerSpec = { kind: 'expr', tex: withK(k, zs), variable: 'x', fn: polyEval(p), sample: [-3, 3] };
    return {
      cognitive: 'problemSolving',
      stem: 'Write the equation of the polynomial function of least degree shown, in factored form. The zeros are integers and the marked point is the $y$-intercept.',
      graph: polyGraph(p, zs.map((z) => z.r), [{ x: 0, y: b, label: `(0, ${b})`, kind: 'key' }]),
      format: 'input',
      fields: [field(ans, 'y =')],
      hints: ['Zeros and their behaviour give the factors and their powers.', `Write ${m('y = a(\\ldots)')} with those factors.`, `Substitute ${m(`(0, ${b})`)} to find ${m('a')}.`],
      solution: [
        { tex: `Factors: ${m(ftex(1, zs))}.`, why: 'Least degree: use the smallest multiplicity that matches each behaviour.' },
        { tex: `${m(`${b} = a(${yInt(1, zs)})`)} gives ${m(`a = ${kTexOf(k)}`)}.` },
        { tex: m(`y = ${withK(k, zs)}`) },
      ],
    };
  },
};

const eqGraphA: Generator = {
  id: 'u2-eqgraph-a',
  nodeId: 'RF12.equation-from-graph',
  title: 'Find the leading coefficient from a point',
  make(rng, tier): Draft {
    const zs = zeroSet(rng, tier === 1 ? 2 : 3, 2);
    const x0 = rng.pick([-1, 1, 2, -2].filter((x) => !zs.some((z) => z.r === x)));
    if (x0 === undefined) throw new Reject();
    const base = zs.reduce((acc, z) => acc * (x0 - z.r) ** z.m, 1);
    const a = tier === 3 ? F(rng.nz(-3, 3), rng.pick([1, 2])) : F(rng.nz(-3, 3));
    const y0 = a.mul(base);
    if (!Number.isInteger(y0.value) || Math.abs(y0.value) > 200) throw new Reject();
    const desc = zs.map((z) => `${m(`x = ${z.r}`)}${z.m > 1 ? ` (multiplicity ${z.m})` : ''}`).join(zs.length === 2 ? ' and ' : ', ');
    return {
      cognitive: 'problemSolving',
      stem: `A polynomial function has zeros only at ${desc}, and its graph passes through ${m(`(${x0}, ${y0.tex()})`)}. In ${m(`y = a${ftex(1, zs)}`)}, what is ${m('a')}?`,
      format: 'input',
      fields: [field(num(a), 'a =')],
      hints: ['Substitute the point.', `${m(`${y0.tex()} = a${zs.map((z) => `(${x0} ${z.r < 0 ? '+' : '-'} ${Math.abs(z.r)})${z.m > 1 ? `^{${z.m}}` : ''}`).join('')}`)}.`, `The product of the brackets is ${m(String(base))}.`],
      solution: [
        { tex: m(`${y0.tex()} = a(${base})`) },
        { tex: m(`a = ${a.tex()}`) },
      ],
      verify: () => Math.abs(a.value * polyEval(fromZeros(1, zs))(x0) - y0.value) < 1e-9,
    };
  },
};

// ---------------------------------------------------------------- RF12.analyze-calc

const CALC_HINT = 'On the TI-84 Plus: enter it in Y=, choose a window that shows the turning points, then 2nd TRACE (CALC) and 3:minimum or 4:maximum. Set left and right bounds around the turning point, then guess.';

/** A quartic with a W shape: two local minima of different heights. */
function wQuartic(rng: Rng) {
  const a = rng.int(-4, -1);
  const b = rng.int(0, 1);
  const c = rng.int(2, 4);
  const shift = rng.int(-8, 4);
  const lead = 1;
  const p = fromZeros(1, [{ r: a, m: 1 }, { r: b, m: 1 }, { r: c, m: 1 }, { r: a + c - b + rng.pick([1, 2]), m: 1 }]).map((v) => v * lead);
  p[p.length - 1] += shift;
  const f = polyEval(p);
  // Locate the two local minima numerically by scanning.
  const mins: number[] = [];
  for (let x = -8; x < 10; x += 0.01) if (f(x) < f(x - 0.01) && f(x) < f(x + 0.01)) mins.push(extremum(f, x - 0.05, x + 0.05, -1));
  if (mins.length !== 2) throw new Reject();
  const vals = mins.map(f);
  if (Math.abs(vals[0] - vals[1]) < 0.5) throw new Reject();
  return { p, f, mins, vals };
}

const calcMin: Generator = {
  id: 'u2-calc-extreme',
  nodeId: 'RF12.analyze-calc',
  title: 'Absolute minimum or maximum with a calculator',
  make(rng, tier): Draft {
    const { p, mins, vals } = wQuartic(rng);
    const flip = tier === 3;
    const q = flip ? p.map((c) => -c) : p;
    const absI = vals[0] < vals[1] ? 0 : 1;
    const want = round(flip ? -vals[absI] : vals[absI], 2);
    if (nearBoundary(vals[absI], 2)) throw new Reject();
    const word = flip ? 'maximum' : 'minimum';
    return {
      cognitive: 'procedural',
      stem: `Use a graphing calculator to determine the absolute ${word} value of ${m(`P(x) = ${polyTex(q.map((c) => +c.toFixed(2)))}`)}, to the nearest hundredth.`,
      format: 'input',
      fields: [field({ kind: 'number', value: want, tex: want.toFixed(2), round: 'hundredth' }, `\\text{${word}} =`)],
      hints: ['There are two turning points of the same kind; the absolute one is the more extreme.', CALC_HINT, `Compare both local ${word}s before answering.`],
      solution: [
        { tex: `Local ${word}s near ${m(`x \\approx ${mins.map((x) => x.toFixed(2)).join(',\\ ')}`)}: values ${m((flip ? vals.map((v) => -v) : vals).map((v) => v.toFixed(2)).join(',\\ '))}.` },
        { tex: `Absolute ${word}: ${m(want.toFixed(2))}.`, why: `The absolute ${word} is the ${flip ? 'highest' : 'lowest'} point on the whole graph, not just the nearest turning point.` },
      ],
      verify: () => Math.abs(polyEval(q)(mins[absI]) - (flip ? -vals[absI] : vals[absI])) < 1e-6,
    };
  },
};

const calcRange: Generator = {
  id: 'u2-calc-range',
  nodeId: 'RF12.analyze-calc',
  title: 'Range of an even-degree polynomial',
  make(rng): Draft {
    const { p, vals } = wQuartic(rng);
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    if (nearBoundary(lo, 2) || nearBoundary(hi, 2)) throw new Reject();
    const L = round(lo, 2).toFixed(2);
    const H = round(hi, 2).toFixed(2);
    return {
      cognitive: 'conceptual',
      stem: `Use a graphing calculator to determine the range of ${m(`P(x) = ${polyTex(p.map((c) => +c.toFixed(2)))}`)}, with values to the nearest hundredth.`,
      format: 'mc',
      choices: mc({ tex: m(`[${L}, \\infty)`), key: 'ok' }, [
        { tex: m(`[${H}, \\infty)`), key: 'loc', mis: 'poly-max-local', feedback: 'That is the higher of the two local minimums. The range starts at the lowest point.' },
        { tex: m(`(${L}, \\infty)`), key: 'open', mis: 'dr-bracket-type', feedback: 'The minimum value is reached, so use a square bracket.' },
        { tex: m('(-\\infty, \\infty)'), key: 'all', mis: 'poly-end-behaviour', feedback: 'An even-degree polynomial with a positive leading coefficient rises at both ends, so it has a lowest value.' },
      ]),
      hints: ['Even degree, positive leading coefficient: both ends rise, so the range has a lowest value.', CALC_HINT, 'There are two local minimums; use the lower one.'],
      solution: [
        { tex: `Local minimums: ${m(L)} and ${m(H)}.` },
        { tex: `Range ${m(`[${L}, \\infty)`)}.`, why: 'The absolute minimum is the lowest $y$-value; every larger value is reached.' },
      ],
    };
  },
};

const calcZero: Generator = {
  id: 'u2-calc-zero',
  nodeId: 'RF12.analyze-calc',
  title: 'Irrational zero with a calculator',
  make(rng, tier): Draft {
    const r = rng.int(-3, 3);
    const n = rng.pick([2, 3, 5, 6, 7, 10]);
    // (x − r)(x² − n) shifted slightly in tiers 2–3 so no zero is exact.
    const p = mulP([1, -r], [1, 0, -n]);
    if (tier >= 2) p[3] += rng.pick([1, -1, 2]);
    const f = polyEval(p);
    const zeros: number[] = [];
    for (let x = -6; x < 6; x += 0.01) if (f(x) === 0 || f(x) * f(x + 0.01) < 0) zeros.push(bisect(f, x, x + 0.01));
    if (!zeros.length) throw new Reject();
    const which = zeros.length === 1 ? 'only' : rng.pick(['largest', 'smallest'] as const);
    const z = which === 'largest' ? Math.max(...zeros) : Math.min(...zeros);
    if (nearBoundary(z, 2) || Number.isInteger(round(z, 6))) throw new Reject();
    const want = round(z, 2);
    return {
      cognitive: 'procedural',
      stem: `Use a graphing calculator to determine the ${which === 'only' ? 'real' : which} zero of ${m(`P(x) = ${polyTex(p)}`)}, to the nearest hundredth.`,
      format: 'input',
      fields: [field({ kind: 'number', value: want, tex: want.toFixed(2), round: 'hundredth' }, 'x =')],
      hints: ['Graph it and find where it crosses the $x$-axis.', 'TI-84 Plus: 2nd TRACE (CALC), 2:zero, then left bound, right bound, guess.', which === 'only' ? 'It has only one real zero.' : `It has ${zeros.length} real zeros; pick the ${which}.`],
      solution: [
        { tex: `Zeros: ${m(zeros.map((x) => x.toFixed(3)).join(',\\ '))} (to 3 decimals).` },
        { tex: `${which === 'only' ? 'To' : `The ${which}, to`} the nearest hundredth: ${m(want.toFixed(2))}.`, why: 'Round only at the end.' },
      ],
      verify: () => Math.abs(f(z)) < 1e-6,
    };
  },
};

// ---------------------------------------------------------------- RF12.model

const boxExpr: Generator = {
  id: 'u2-model-box-expr',
  nodeId: 'RF12.model',
  title: 'Volume function of an open box',
  make(rng, tier): Draft {
    const L = rng.int(12, 40);
    const W = rng.int(8, L - 2);
    const sq = tier === 3;
    const right = sq ? `V(x) = x(${L} - 2x)^2` : `V(x) = x(${L} - 2x)(${W} - 2x)`;
    const s = sq ? L : W;
    return {
      cognitive: 'problemSolving',
      stem: `Squares of side ${m('x')} cm are cut from each corner of a ${sq ? `${L} cm by ${L} cm` : `${L} cm by ${W} cm`} sheet of cardboard, and the sides are folded up to make an open box. Which function gives the volume?`,
      format: 'mc',
      choices: mc({ tex: m(right), key: 'ok' }, [
        { tex: m(sq ? `V(x) = x(${L} - x)^2` : `V(x) = x(${L} - x)(${W} - x)`), key: 'once', mis: 'poly-model-cut', feedback: 'A square is cut from both ends of each side, so each dimension loses $2x$.' },
        { tex: m(sq ? `V(x) = (${L} - 2x)^2` : `V(x) = (${L} - 2x)(${W} - 2x)`), key: 'area', mis: 'wr-units-missing', feedback: 'That is the base area. Volume needs the height $x$ too.' },
        { tex: m(sq ? `V(x) = 2x(${L} - 2x)` : `V(x) = x^2(${L} - 2x)(${W} - 2x)`), key: 'h', mis: 'poly-model-cut' },
      ]),
      hints: ['Draw the net and label it.', 'The height is $x$. Each side loses $x$ at both ends.', `Base: ${m(`(${L} - 2x)`)} by ${m(`(${s} - 2x)`)}.`],
      solution: [
        { tex: `Height ${m('x')}; base ${m(`(${L} - 2x)`)} by ${m(`(${s} - 2x)`)}.`, why: 'Each fold removes $x$ from both ends of a side.' },
        { tex: `${m(right)}, with domain ${m(`0 < x < ${F(s, 2).tex()}`)}.` },
      ],
    };
  },
};

const boxMax: Generator = {
  id: 'u2-model-box-max',
  nodeId: 'RF12.model',
  title: 'Maximum volume of an open box',
  make(rng, tier): Draft {
    const L = rng.int(16, 40);
    const W = rng.int(10, L - 2);
    const V = (x: number) => x * (L - 2 * x) * (W - 2 * x);
    const xm = extremum(V, 0, W / 2, 1);
    const askX = tier === 3;
    const val = askX ? xm : V(xm);
    const places = askX ? 2 : 1;
    if (nearBoundary(val, places)) throw new Reject();
    const want = round(val, places);
    return {
      cognitive: 'problemSolving',
      stem: `An open box is made from a ${L} cm by ${W} cm sheet by cutting squares of side ${m('x')} cm from each corner. ${askX ? 'What side length gives the maximum volume, to the nearest hundredth of a centimetre?' : 'What is the maximum possible volume, to the nearest tenth of a cubic centimetre?'}`,
      format: 'input',
      fields: [field({ kind: 'number', value: want, tex: want.toFixed(places), round: askX ? 'hundredth' : 'tenth' }, askX ? 'x =' : 'V =')],
      hints: [`${m(`V(x) = x(${L} - 2x)(${W} - 2x)`)}.`, `Domain: ${m(`0 < x < ${F(W, 2).tex()}`)}. Set the window to that.`, '2nd TRACE (CALC), 4:maximum, inside the domain.'],
      solution: [
        { tex: m(`V(x) = x(${L} - 2x)(${W} - 2x),\\ 0 < x < ${F(W, 2).tex()}`), why: 'Lengths must be positive, which restricts $x$.' },
        { tex: `Maximum at ${m(`x \\approx ${xm.toFixed(2)}`)}: ${m(`V \\approx ${V(xm).toFixed(1)}`)} cm³.`, why: 'The other turning point lies outside the domain, so it is ignored.' },
        { tex: `Answer: ${m(want.toFixed(places))} ${askX ? 'cm' : 'cm³'}.` },
      ],
      verify: () => V(xm) >= V(xm - 0.01) && V(xm) >= V(xm + 0.01),
    };
  },
};

const consecutive: Generator = {
  id: 'u2-model-consecutive',
  nodeId: 'RF12.model',
  title: 'Consecutive integers',
  make(rng, tier): Draft {
    const step = tier === 1 ? 1 : 2;
    const n = tier === 3 ? 2 * rng.int(2, 9) + 1 : tier === 2 ? 2 * rng.int(2, 9) : rng.int(3, 15);
    const N = n * (n + step) * (n + 2 * step);
    const kind = tier === 1 ? 'consecutive integers' : tier === 2 ? 'consecutive even integers' : 'consecutive odd integers';
    const eq = step === 1 ? `x(x + 1)(x + 2) = ${N}` : `x(x + 2)(x + 4) = ${N}`;
    const poly: Poly = step === 1 ? [1, 3, 2, -N] : [1, 6, 8, -N];
    return {
      cognitive: 'problemSolving',
      stem: `The product of three positive ${kind} is ${m(String(N))}. What is the smallest of the three?`,
      format: 'input',
      fields: [field(num(n), 'x =')],
      hints: [`Let the smallest be ${m('x')}.`, `${m(eq)}.`, `Expand and move ${m(String(N))} over: ${m(`${polyTex(poly)} = 0`)}. Graph it or test integer zeros.`],
      solution: [
        { tex: `${m(eq)} becomes ${m(`${polyTex(poly)} = 0`)}.` },
        { tex: `${m(`x = ${n}`)} is a zero (check: ${m(`${n} \\times ${n + step} \\times ${n + 2 * step} = ${N}`)}).`, why: 'The remaining quadratic factor has no real zeros, so this is the only solution.' },
        { tex: `The integers are ${m(`${n}, ${n + step}, ${n + 2 * step}`)}; the smallest is ${m(String(n))}.` },
      ],
      verify: () => polyEval(poly)(n) === 0,
    };
  },
};

export const graphGenerators: Generator[] = [charEnd, charYint, charDegree, multBehaviour, multZeros, multLeastDegree, sketchDescribe, sketchCheck, sketchSign, eqGraphMc, eqGraphInput, eqGraphA, calcMin, calcRange, calcZero, boxExpr, boxMax, consecutive];
