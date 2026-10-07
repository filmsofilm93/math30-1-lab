// T6 trigonometric identities: identity vs equation, NPVs, simplifying, proofs, sum/difference and double-angle exact values.
import { field, m, mc } from '../../framework';
import { F } from '../../frac';
import { compileTrig, equivalentTex, IDENTITY_PROBLEMS, npvDegrees } from '../../identity';
import type { AnswerSpec, Draft, Generator } from '../../types';
import { Reject } from '../../types';
import { rounded } from '../u3/shared';
import { angleSet, angTex, exact, listTex, norm, rad, radTex, refAngle } from './shared';

type C = { tex: string; key: string; mis: string; feedback?: string };

/** Expression answer checked numerically, with a "simplify further" form check. */
const trigExpr = (tex: string, simplified = true): AnswerSpec => {
  const c = compileTrig(tex);
  if (!c) throw new Error(`bad trig tex ${tex}`);
  return { kind: 'expr', tex, variable: 'x', fn: c.f, sample: [-3, 3], ...(simplified ? { form: 'simplified' as const } : {}) };
};

/** Keep distractors that are really not equivalent to the answer. */
const notEquiv = (answer: string, cands: C[], strip = (t: string) => t.replace(/\$/g, '')) => cands.filter((c) => !equivalentTex(strip(answer), strip(c.tex)));

// ---------------------------------------------------------------- T6.identity-vs-equation

const CLASSIFY: { eq: string; identity: boolean; at?: string }[] = [
  { eq: '\\sin^2 x + \\cos^2 x = 1', identity: true },
  { eq: '\\tan x\\cos x = \\sin x', identity: true },
  { eq: '\\sec^2 x - \\tan^2 x = 1', identity: true },
  { eq: '\\cos 2x = 1 - 2\\sin^2 x', identity: true },
  { eq: '\\frac{\\sin x}{\\tan x} = \\cos x', identity: true },
  { eq: '\\sin 2x = 2\\sin x\\cos x', identity: true },
  { eq: '\\sin x = \\cos x', identity: false, at: '\\frac{\\pi}{4}' },
  { eq: '\\sin 2x = 2\\sin x', identity: false, at: '0' },
  { eq: '(\\sin x + \\cos x)^2 = 1', identity: false, at: '0' },
  { eq: '\\cos(x + \\pi) = \\cos x + \\cos\\pi', identity: false, at: '\\frac{\\pi}{2}' },
  { eq: '\\tan x = 1', identity: false, at: '\\frac{\\pi}{4}' },
  { eq: '1 - \\tan^2 x = \\sec^2 x', identity: false, at: '0' },
];

const iveClassify: Generator = {
  id: 'u4-ive-classify',
  nodeId: 'T6.identity-vs-equation',
  title: 'Identity or equation?',
  make(rng): Draft {
    const c = rng.pick(CLASSIFY);
    const [l, r] = c.eq.split(' = ');
    if (equivalentTex(l, r) !== c.identity) throw new Error(`classify table wrong: ${c.eq}`);
    const idT = 'An identity: true for every permissible value of $x$';
    const eqT = 'An equation: true only for some values of $x$';
    return {
      cognitive: 'conceptual',
      stem: `Is ${m(c.eq)} an identity or an equation?`,
      format: 'mc',
      choices: mc({ tex: c.identity ? idT : eqT, key: 'r' }, [
        ...(c.identity
          ? [{ tex: eqT, key: 'eq', mis: 'trig-verify-is-proof', feedback: 'Try several values: both sides agree wherever they are defined.' }]
          : [
              { tex: idT, key: 'id', mis: 'trig-verify-is-proof', feedback: 'Find one value where the sides differ: that settles it.' },
              { tex: `An identity, because both sides are equal at ${m(`x = ${c.at}`)}`, key: 'at', mis: 'trig-verify-is-proof', feedback: 'Agreeing at one value does not make an identity.' },
            ]),
        { tex: 'Neither: it has no solutions', key: 'none', mis: 'trig-verify-is-proof' },
        { tex: 'Both: every equation is an identity for some values', key: 'both', mis: 'wr-directing-word' },
      ]),
      hints: ['An identity holds for every permissible value.', 'Test a value such as $x = 0$ or $x = \\frac{\\pi}{6}$ in both sides.', c.identity ? 'If it matches a known identity after rewriting, it is an identity.' : 'One counterexample shows it is not an identity.'],
      solution: c.identity
        ? [{ tex: `Rewriting with the basic identities turns one side into the other, so ${m(c.eq)} holds for all permissible ${m('x')}.` }]
        : [{ tex: `At ${m('x = \\frac{\\pi}{6}')}: left side ${m(String(+compileTrig(l)!.f(Math.PI / 6).toFixed(4)))}, right side ${m(String(+compileTrig(r)!.f(Math.PI / 6).toFixed(4)))}.`, why: 'Different values, so it is not an identity; it is an equation with specific solutions.' }],
    };
  },
};

const iveVerify: Generator = {
  id: 'u4-ive-verify',
  nodeId: 'T6.identity-vs-equation',
  title: 'Verify an identity numerically',
  make(rng, tier): Draft {
    const p = rng.pick(IDENTITY_PROBLEMS.filter((q) => tier === 3 || !q.excellence));
    const d = rng.pick(tier === 1 ? [30, 45, 60] : [20, 35, 50, 70, 110, 140, 200, 250]);
    if (npvDegrees(`${p.lhs} + ${p.rhs}`, d, d + 1).length) throw new Reject();
    const v = compileTrig(p.lhs)!.f(rad(d));
    const spec = rounded(v, 2);
    return {
      cognitive: 'procedural',
      stem: `Verify ${m(`${p.lhs} = ${p.rhs}`)} for ${m(`x = ${d}^\\circ`)}: evaluate both sides to the nearest hundredth.`,
      format: 'input',
      fields: [field(spec, '\\text{LHS} \\approx'), field(spec, '\\text{RHS} \\approx')],
      hints: ['Degree mode.', `Substitute ${m(`${d}^\\circ`)} into each side separately.`, 'Use reciprocals for csc, sec and cot: $\\sec x = 1 \\div \\cos x$.'],
      solution: [
        { tex: `Left side at ${m(`${d}^\\circ`)}: ${m(`\\approx ${spec.tex}`)}. Right side: ${m(`\\approx ${spec.tex}`)}.` },
        { tex: 'The sides agree, so the identity is verified for this value.', why: 'Verifying one value is not a proof: a proof must hold for every permissible value.' },
      ],
    };
  },
};

const iveProof: Generator = {
  id: 'u4-ive-proof',
  nodeId: 'T6.identity-vs-equation',
  title: 'Verify versus prove',
  make(rng, tier): Draft {
    const p = rng.pick(IDENTITY_PROBLEMS.filter((q) => !q.excellence));
    const id = `${p.lhs} = ${p.rhs}`;
    const v = rng.pick(['\\frac{\\pi}{6}', '\\frac{\\pi}{3}', '\\frac{\\pi}{4}']);
    if (tier === 3) {
      return {
        cognitive: 'conceptual',
        stem: `A question says: "Prove ${m(id)}." Which response answers it?`,
        format: 'mc',
        choices: mc({ tex: 'Rewrite one side, step by step with identities, until it matches the other side', key: 'r' }, [
          { tex: `Show that both sides equal the same number at ${m(`x = ${v}`)}`, key: 'v', mis: 'wr-directing-word', feedback: '"Prove" needs an argument for every permissible value. A value check answers "verify".' },
          { tex: 'Graph both sides and show the graphs overlap', key: 'g', mis: 'wr-directing-word', feedback: 'A graph verifies; it does not prove.' },
          { tex: `Multiply both sides by the same expression until the equation reads ${m('1 = 1')}`, key: 'x', mis: 'trig-prove-cross-sides', feedback: 'Operating on both sides assumes the identity is true. Work on each side separately.' },
        ]),
        hints: ['"Verify" and "prove" ask for different things.', 'A proof works for every permissible value at once.', 'Transform one side only, or each side separately.'],
        solution: [{ tex: 'A proof transforms one side (or each side separately) with known identities until both sides are the same expression.' }],
      };
    }
    return {
      cognitive: 'conceptual',
      stem: `A student substitutes ${m(`x = ${v}`)} into ${m(id)} and finds both sides equal. What has the student shown?`,
      format: 'mc',
      choices: mc({ tex: `The equation holds at ${m(`x = ${v}`)}; it is verified there, not proven`, key: 'r' }, [
        { tex: 'The identity is proven', key: 'p', mis: 'trig-verify-is-proof', feedback: 'Many equations are true at one value without being identities.' },
        { tex: 'The identity is proven if one more value also works', key: 'p2', mis: 'trig-verify-is-proof', feedback: 'Any finite number of checks is still a verification.' },
        { tex: 'Nothing: substitution is never allowed', key: 'n', mis: 'wr-directing-word', feedback: 'Substitution is how you verify; it just cannot prove.' },
      ]),
      hints: ['Compare "true at one value" with "true for every permissible value".', 'Could a non-identity pass this check?', 'For example, $\\sin x = \\cos x$ holds at $\\frac{\\pi}{4}$.'],
      solution: [{ tex: `Substitution verifies the identity at ${m(`x = ${v}`)} only.`, why: 'A proof uses identities that hold for every permissible value.' }],
    };
  },
};

// ---------------------------------------------------------------- T6.npv

/** NPV cases: denominator zeros and hidden restrictions from tan, sec, csc, cot (degrees in [0, 360)). */
const NPV_CASES: { tex: string; den: number[]; hidden: number[] }[] = [
  { tex: '\\frac{\\sin x}{1 - \\cos x}', den: [0], hidden: [] },
  { tex: '\\frac{\\tan x}{\\sin x}', den: [0, 180], hidden: [90, 270] },
  { tex: '\\frac{\\sec x}{1 + \\sin x}', den: [270], hidden: [90, 270] },
  { tex: '\\frac{\\cot x}{\\cos x}', den: [90, 270], hidden: [0, 180] },
  { tex: '\\frac{1}{1 - \\sin x} + \\frac{1}{1 + \\sin x}', den: [90, 270], hidden: [] },
  { tex: '\\tan x + \\cot x', den: [], hidden: [0, 90, 180, 270] },
  { tex: '\\frac{\\cos x}{2\\sin x - 1}', den: [30, 150], hidden: [] },
  { tex: '\\frac{\\csc x}{\\cos x}', den: [90, 270], hidden: [0, 180] },
  { tex: '\\frac{\\sin x + \\tan x}{\\cos x - 1}', den: [0], hidden: [90, 270] },
  { tex: '\\frac{1 - \\cos^2 x}{\\sin x\\cos x}', den: [0, 90, 180, 270], hidden: [] },
  { tex: '\\frac{\\sec x - 1}{\\sec x + 1}', den: [180], hidden: [90, 270] },
  { tex: '\\frac{\\sin x}{2\\cos x + \\sqrt{3}}', den: [150, 210], hidden: [] },
];
const union = (a: number[], b: number[]) => [...new Set([...a, ...b])].sort((x, y) => x - y);

const npvList: Generator = {
  id: 'u4-npv-list',
  nodeId: 'T6.npv',
  title: 'List the non-permissible values',
  make(rng, tier): Draft {
    const c = rng.pick(tier === 1 ? NPV_CASES.filter((x) => !x.hidden.length) : NPV_CASES);
    const inRad = tier > 1 || rng.chance(0.5);
    const all = union(c.den, c.hidden);
    const got = npvDegrees(c.tex);
    if (got.join() !== all.join()) throw new Error(`npv table wrong for ${c.tex}: ${got}`);
    return {
      cognitive: 'procedural',
      stem: `State the non-permissible values of ${m(c.tex)} for ${m(`0 \\le x < ${angTex(360, inRad)}`)}.`,
      format: 'input',
      fields: [field(angleSet(all, inRad), 'x \\ne', 'Separate values with commas')],
      hints: ['Every denominator must be non-zero.', '$\\tan x$ and $\\sec x$ need $\\cos x \\ne 0$; $\\cot x$ and $\\csc x$ need $\\sin x \\ne 0$.', 'Solve each restriction over the domain and combine.'],
      solution: [
        ...(c.den.length ? [{ tex: `Denominator zero at ${m(listTex(c.den, inRad))}.` }] : []),
        ...(c.hidden.length ? [{ tex: `Hidden restrictions from tan, sec, csc or cot: ${m(listTex(c.hidden, inRad))}.` }] : []),
        { tex: `${m(`x \\ne ${listTex(all, inRad)}`)}.` },
      ],
    };
  },
};

const npvGeneral: Generator = {
  id: 'u4-npv-general',
  nodeId: 'T6.npv',
  title: 'Non-permissible values in general form',
  make(rng): Draft {
    const c = rng.pick(NPV_CASES);
    const all = union(c.den, c.hidden);
    // Simplest general form: shortest step that generates the set.
    const step = [90, 180, 360].find((s) => all.every((d) => all.includes(norm(d + s))))!;
    const roots = all.filter((d) => d < step);
    const tex = roots.map((r) => `x \\ne ${r ? `${radTex(r)} + ` : ''}${radTex(step)} n`).join(',\\ ') + ',\\ n \\in I';
    return {
      cognitive: 'procedural',
      stem: `State the non-permissible values of ${m(c.tex)} in general form, in radians.`,
      format: 'input',
      fields: [field({ kind: 'general', roots: roots.map(rad), period: rad(step), tex: tex.replace(/x \\ne /g, '') }, 'x \\ne', 'Use n for the integer: a + bn, n ∈ I')],
      hints: ['Find the restrictions in one turn first.', 'Then add multiples of the period of the pattern.', `In one turn: ${m(listTex(all, true))}.`],
      solution: [{ tex: `In ${m('[0, 2\\pi)')}: ${m(listTex(all, true))}.` }, { tex: m(tex), why: 'Any equivalent general form is also correct.' }],
    };
  },
};

const npvMc: Generator = {
  id: 'u4-npv-mc',
  nodeId: 'T6.npv',
  title: 'Choose the restrictions',
  make(rng): Draft {
    const c = rng.pick(NPV_CASES.filter((x) => x.den.length && x.hidden.length && union(x.den, x.hidden).length > Math.max(x.den.length, x.hidden.length)));
    const all = union(c.den, c.hidden);
    const L = (ds: number[]) => m(`x \\ne ${listTex(ds, true)}`);
    return {
      cognitive: 'conceptual',
      stem: `Which are all the non-permissible values of ${m(c.tex)} for ${m('0 \\le x < 2\\pi')}?`,
      format: 'mc',
      choices: mc({ tex: L(all), key: all.join() }, [
        { tex: L(c.den), key: c.den.join(), mis: 'trig-npv-miss', feedback: 'Also check where tan, sec, csc or cot are not defined.' },
        { tex: L(c.hidden), key: c.hidden.join(), mis: 'trig-npv-miss', feedback: 'Also check where the denominator is zero.' },
        { tex: L(all.filter((d) => d < 180)), key: `h${all.filter((d) => d < 180).join()}`, mis: 'trig-general-period' },
        { tex: L(union(all, all.map((d) => norm(d + 90)))), key: 'x', mis: 'trig-general-period' },
      ]),
      hints: ['Two sources: denominators and the reciprocal or quotient functions.', `Denominator: ${m(`${c.tex.match(/\\frac\{.*?\}\{(.*)\}$/)?.[1] ?? ''} \\ne 0`)}.`, 'Combine both lists.'],
      solution: [{ tex: `Denominator: ${m(listTex(c.den, true))}. Hidden: ${m(listTex(c.hidden, true))}.` }, { tex: L(all) }],
    };
  },
};

// ---------------------------------------------------------------- T6.simplify

const SIMPLIFY: { tex: string; ans: string; steps: string[] }[] = [
  { tex: '\\sin x\\cot x', ans: '\\cos x', steps: ['\\sin x \\cdot \\frac{\\cos x}{\\sin x}'] },
  { tex: '\\frac{\\sec x}{\\csc x}', ans: '\\tan x', steps: ['\\frac{1/\\cos x}{1/\\sin x} = \\frac{\\sin x}{\\cos x}'] },
  { tex: '\\cos x\\tan x', ans: '\\sin x', steps: ['\\cos x \\cdot \\frac{\\sin x}{\\cos x}'] },
  { tex: '\\frac{1 - \\cos^2 x}{\\sin x}', ans: '\\sin x', steps: ['\\frac{\\sin^2 x}{\\sin x}'] },
  { tex: '\\sec^2 x - 1', ans: '\\tan^2 x', steps: ['1 + \\tan^2 x - 1'] },
  { tex: '\\frac{\\tan x}{\\sec x}', ans: '\\sin x', steps: ['\\frac{\\sin x}{\\cos x} \\cdot \\cos x'] },
  { tex: '\\frac{\\sin^2 x}{1 - \\cos x}', ans: '1 + \\cos x', steps: ['\\frac{1 - \\cos^2 x}{1 - \\cos x} = \\frac{(1 - \\cos x)(1 + \\cos x)}{1 - \\cos x}'] },
  { tex: '(\\sec x - 1)(\\sec x + 1)', ans: '\\tan^2 x', steps: ['\\sec^2 x - 1'] },
  { tex: '\\cot x\\sec x', ans: '\\csc x', steps: ['\\frac{\\cos x}{\\sin x} \\cdot \\frac{1}{\\cos x}'] },
  { tex: '\\frac{1 + \\tan^2 x}{\\tan^2 x}', ans: '\\csc^2 x', steps: ['\\frac{\\sec^2 x}{\\tan^2 x} = \\frac{1/\\cos^2 x}{\\sin^2 x/\\cos^2 x} = \\frac{1}{\\sin^2 x}'] },
  { tex: '\\sin x + \\cos x\\cot x', ans: '\\csc x', steps: ['\\sin x + \\frac{\\cos^2 x}{\\sin x} = \\frac{\\sin^2 x + \\cos^2 x}{\\sin x} = \\frac{1}{\\sin x}'] },
  { tex: '\\csc^2 x - \\cot^2 x', ans: '1', steps: ['1 + \\cot^2 x - \\cot^2 x'] },
  { tex: '\\cos^2 x\\sec x', ans: '\\cos x', steps: ['\\cos^2 x \\cdot \\frac{1}{\\cos x}'] },
  { tex: '\\frac{\\cos^2 x - 1}{\\sin x}', ans: '-\\sin x', steps: ['\\frac{-\\sin^2 x}{\\sin x}'] },
];
const POOL: C[] = [
  { tex: '\\sin x', key: 'sin', mis: 'trig-reciprocal-inverse' },
  { tex: '\\cos x', key: 'cos', mis: 'trig-reciprocal-inverse' },
  { tex: '\\tan x', key: 'tan', mis: 'trig-reciprocal-inverse' },
  { tex: '\\csc x', key: 'csc', mis: 'trig-reciprocal-inverse' },
  { tex: '\\sec x', key: 'sec', mis: 'trig-reciprocal-inverse' },
  { tex: '\\cot x', key: 'cot', mis: 'trig-reciprocal-inverse' },
  { tex: '1', key: '1', mis: 'cancel-terms' },
  { tex: '-\\tan^2 x', key: '-tan2', mis: 'trig-pyth-sign' },
  { tex: '\\tan^2 x', key: 'tan2', mis: 'trig-pyth-sign' },
  { tex: '1 - \\cos x', key: '1-cos', mis: 'trig-pyth-sign' },
  { tex: '\\sec^2 x', key: 'sec2', mis: 'trig-pyth-sign' },
  { tex: '-\\cos x', key: '-cos', mis: 'trig-pyth-sign' },
  { tex: '\\sin x', key: 'sin2', mis: 'cancel-terms' },
  { tex: '\\cot^2 x', key: 'cot2', mis: 'trig-pyth-sign' },
];

const simpMc: Generator = {
  id: 'u4-simp-mc',
  nodeId: 'T6.simplify',
  title: 'Simplify to one function',
  make(rng, tier): Draft {
    const c = rng.pick(tier === 1 ? SIMPLIFY.slice(0, 6) : SIMPLIFY);
    const cands = rng.shuffle(notEquiv(c.ans, POOL.filter((p) => p.tex !== c.ans)));
    return {
      cognitive: 'procedural',
      stem: `Simplify ${m(c.tex)}.`,
      format: 'mc',
      choices: mc({ tex: m(c.ans), key: 'r' }, cands.map((p) => ({ ...p, tex: m(p.tex) }))),
      hints: ['Rewrite everything in sine and cosine.', 'Look for a Pythagorean identity.', `${m(c.steps[0])}.`],
      solution: [...c.steps.map((s) => ({ tex: m(`${c.tex} = ${s}`) })), { tex: m(`= ${c.ans}`), why: `Valid where ${m(c.tex)} is defined.` }],
    };
  },
};

const simpInput: Generator = {
  id: 'u4-simp-input',
  nodeId: 'T6.simplify',
  title: 'Simplify and type the result',
  make(rng, tier): Draft {
    const c = rng.pick(tier === 1 ? SIMPLIFY.slice(0, 6) : SIMPLIFY.slice(4));
    return {
      cognitive: 'procedural',
      stem: `Simplify ${m(c.tex)} to a single term.`,
      format: 'input',
      fields: [field(trigExpr(c.ans))],
      hints: ['Reciprocal and quotient identities first.', 'Then look for $\\sin^2 x + \\cos^2 x = 1$ or its rearrangements.', `${m(c.steps[0])}.`],
      solution: [...c.steps.map((s) => ({ tex: m(`${c.tex} = ${s}`) })), { tex: m(`= ${c.ans}`) }],
    };
  },
};

const PYTH_FORMS: { right: string; wrong: string[] }[] = [
  { right: '\\cos^2 x = 1 - \\sin^2 x', wrong: ['\\cos^2 x = \\sin^2 x - 1', '\\cos^2 x = 1 + \\sin^2 x', '\\cos x = 1 - \\sin x'] },
  { right: '\\sec^2 x = 1 + \\tan^2 x', wrong: ['\\sec^2 x = 1 - \\tan^2 x', '\\sec^2 x = \\tan^2 x - 1', '\\csc^2 x = 1 + \\tan^2 x'] },
  { right: '\\csc^2 x - \\cot^2 x = 1', wrong: ['\\cot^2 x - \\csc^2 x = 1', '\\csc^2 x + \\cot^2 x = 1', '\\sec^2 x - \\cot^2 x = 1'] },
  { right: '\\tan^2 x = \\sec^2 x - 1', wrong: ['\\tan^2 x = 1 - \\sec^2 x', '\\tan^2 x = \\sec^2 x + 1', '\\tan^2 x = \\csc^2 x - 1'] },
  { right: '\\sin^2 x = 1 - \\cos^2 x', wrong: ['\\sin^2 x = \\cos^2 x - 1', '\\sin x = 1 - \\cos x', '\\sin^2 x = 1 + \\cos^2 x'] },
];

const simpPyth: Generator = {
  id: 'u4-simp-pyth',
  nodeId: 'T6.simplify',
  title: 'Pythagorean identity forms',
  make(rng): Draft {
    const c = rng.pick(PYTH_FORMS);
    const holds = (e: string) => equivalentTex(e.split(' = ')[0], e.split(' = ')[1]);
    if (!holds(c.right) || c.wrong.some(holds)) throw new Error('pythagorean table wrong');
    return {
      cognitive: 'conceptual',
      stem: 'Which equation is an identity?',
      format: 'mc',
      choices: mc(
        { tex: m(c.right), key: 'r' },
        c.wrong.map((w, i) => ({ tex: m(w), key: `w${i}`, mis: 'trig-pyth-sign', feedback: `Test ${m('x = \\frac{\\pi}{6}')}: the sides differ.` })),
      ),
      hints: ['Start from $\\sin^2 x + \\cos^2 x = 1$.', 'Divide by $\\cos^2 x$ to get the tan and sec form; by $\\sin^2 x$ for cot and csc.', 'Check a value such as $x = \\frac{\\pi}{6}$.'],
      solution: [{ tex: `${m(c.right)} is a rearrangement of a Pythagorean identity.`, why: 'The others fail a quick numeric check.' }],
    };
  },
};

// ---------------------------------------------------------------- T6.prove-basic

const PROOFS: { id: string; lines: string[]; why: string[] }[] = [
  { id: 'i1', lines: ['\\tan x\\cos x', '\\frac{\\sin x}{\\cos x}\\cos x', '\\sin x'], why: ['Quotient identity.', 'Cancel $\\cos x$.'] },
  { id: 'i2', lines: ['\\sec x - \\cos x', '\\frac{1}{\\cos x} - \\frac{\\cos^2 x}{\\cos x}', '\\frac{\\sin^2 x}{\\cos x}', '\\sin x\\tan x'], why: ['Reciprocal identity, common denominator.', 'Pythagorean: $1 - \\cos^2 x = \\sin^2 x$.', 'Split as $\\sin x \\cdot \\frac{\\sin x}{\\cos x}$.'] },
  { id: 'i3', lines: ['\\frac{1 - \\cos^2 x}{\\sin x\\cos x}', '\\frac{\\sin^2 x}{\\sin x\\cos x}', '\\frac{\\sin x}{\\cos x}', '\\tan x'], why: ['Pythagorean identity.', 'Cancel $\\sin x$.', 'Quotient identity.'] },
  { id: 'i4', lines: ['\\csc x - \\sin x', '\\frac{1 - \\sin^2 x}{\\sin x}', '\\frac{\\cos^2 x}{\\sin x}', '\\cos x\\cot x'], why: ['Reciprocal identity, common denominator.', 'Pythagorean identity.', 'Split as $\\cos x \\cdot \\frac{\\cos x}{\\sin x}$.'] },
  { id: 'i5', lines: ['\\frac{\\sec^2 x - 1}{\\sec^2 x}', '\\frac{\\tan^2 x}{\\sec^2 x}', '\\frac{\\sin^2 x}{\\cos^2 x}\\cos^2 x', '\\sin^2 x'], why: ['Pythagorean identity.', 'Quotient and reciprocal identities.', 'Cancel $\\cos^2 x$.'] },
  { id: 'i6', lines: ['\\tan x + \\cot x', '\\frac{\\sin x}{\\cos x} + \\frac{\\cos x}{\\sin x}', '\\frac{\\sin^2 x + \\cos^2 x}{\\sin x\\cos x}', '\\frac{1}{\\sin x\\cos x}', '\\sec x\\csc x'], why: ['Quotient identities.', 'Common denominator.', 'Pythagorean identity.', 'Reciprocal identities.'] },
];
const IDENTITY_KIND = (why: string) => (/Quotient/.test(why) ? 'quotient' : /Pythagorean/.test(why) ? 'Pythagorean' : /Reciprocal/.test(why) ? 'reciprocal' : 'algebra');
const probOf = (id: string) => IDENTITY_PROBLEMS.find((p) => p.id === id)!;

const pbStep: Generator = {
  id: 'u4-pb-step',
  nodeId: 'T6.prove-basic',
  title: 'A valid first step',
  make(rng): Draft {
    const pr = rng.pick(PROOFS);
    const p = probOf(pr.id);
    return {
      cognitive: 'conceptual',
      stem: `Which is a valid first step in proving ${m(`${p.lhs} = ${p.rhs}`)}?`,
      format: 'mc',
      choices: mc({ tex: `Rewrite the left side as ${m(pr.lines[1])}`, key: 'r' }, [
        { tex: `Multiply both sides by ${m(p.lhs.includes('\\frac') ? (p.lhs.match(/\\frac\{.*?\}\{(.*?)\}/)?.[1] ?? '\\cos x') : '\\cos x')}`, key: 'x', mis: 'trig-prove-cross-sides', feedback: 'In a proof, work on each side separately; operating on both sides assumes what you want to prove.' },
        { tex: `Substitute ${m('x = \\frac{\\pi}{4}')} into both sides`, key: 'v', mis: 'trig-verify-is-proof', feedback: 'That verifies one value; it does not prove.' },
        { tex: 'Move every term to the left side and set it equal to 0', key: 'z', mis: 'trig-prove-cross-sides' },
      ]),
      hints: ['A proof transforms one side at a time.', 'Writing everything in sine and cosine is a safe start.', p.hint],
      solution: pr.lines.slice(1).map((l, i) => ({ tex: m(`${i === 0 ? `\\text{LHS} = ` : '= '}${l}`), why: pr.why[i] })),
    };
  },
};

const pbNext: Generator = {
  id: 'u4-pb-next',
  nodeId: 'T6.prove-basic',
  title: 'Fill in the missing line',
  make(rng, tier): Draft {
    const pr = rng.pick(PROOFS.filter((q) => q.lines.length >= (tier === 1 ? 3 : 4)));
    const p = probOf(pr.id);
    const k = tier === 1 ? 1 : rng.int(1, pr.lines.length - 2);
    const shown = pr.lines.map((l, i) => (i === k ? '\\boxed{\\phantom{xx}?\\phantom{xx}}' : l));
    return {
      cognitive: 'procedural',
      stem: `Complete the proof of ${m(`${p.lhs} = ${p.rhs}`)}: ${m(`\\text{LHS} = ${shown.join(' = ')}`)}. What goes in the box?`,
      format: 'input',
      fields: [field(trigExpr(pr.lines[k], false))],
      hints: ['The missing line must be equivalent to the lines on either side.', `Step into the box: ${pr.why[k - 1]}`, `Step out of the box: ${pr.why[k] ?? 'it reaches the right side.'}`],
      solution: [{ tex: m(pr.lines[k]), why: pr.why[k - 1] }],
    };
  },
};

const pbWhich: Generator = {
  id: 'u4-pb-which',
  nodeId: 'T6.prove-basic',
  title: 'Name the identity used',
  make(rng): Draft {
    const pr = rng.pick(PROOFS);
    const i = rng.int(0, pr.why.length - 1);
    const kind = IDENTITY_KIND(pr.why[i]);
    if (kind === 'algebra') throw new Reject();
    const label: Record<string, string> = { quotient: 'Quotient identity', Pythagorean: 'Pythagorean identity', reciprocal: 'Reciprocal identity', double: 'Double-angle identity' };
    return {
      cognitive: 'conceptual',
      stem: `In a proof, the line ${m(pr.lines[i])} becomes ${m(pr.lines[i + 1])}. Which identity is used?`,
      format: 'mc',
      choices: mc(
        { tex: label[kind], key: kind },
        Object.keys(label)
          .filter((k) => k !== kind)
          .map((k) => ({ tex: label[k], key: k, mis: k === 'Pythagorean' ? 'trig-pyth-sign' : k === 'double' ? 'trig-sin2-sin-squared' : 'trig-reciprocal-inverse' })),
      ),
      hints: ['Compare the two lines: which part changed?', 'Reciprocal: csc, sec, cot as 1 over sin, cos, tan. Quotient: tan and cot as ratios of sin and cos.', 'Pythagorean: squares that sum to 1.'],
      solution: [{ tex: m(`${pr.lines[i]} = ${pr.lines[i + 1]}`), why: pr.why[i] }, { tex: `${label[kind]}.` }],
    };
  },
};

// ---------------------------------------------------------------- T6.exact-sum-double

const S6 = '\\sqrt{6}';
const S2 = '\\sqrt{2}';
/** Exact sin and cos for odd multiples of 15°. */
function exact15(fn: 'sin' | 'cos' | 'tan', d: number): { tex: string; value: number } {
  const r = refAngle(d);
  const sgn = Math.sign(Math.round((fn === 'sin' ? Math.sin(rad(d)) : fn === 'cos' ? Math.cos(rad(d)) : Math.tan(rad(d))) * 1e9));
  const small = fn === 'sin' ? r === 15 : r === 75;
  if (fn === 'tan') {
    const t = r === 15 ? (sgn < 0 ? '\\sqrt{3} - 2' : '2 - \\sqrt{3}') : sgn < 0 ? '-2 - \\sqrt{3}' : '2 + \\sqrt{3}';
    return { tex: t, value: Math.tan(rad(d)) };
  }
  const body = small ? (sgn < 0 ? `\\frac{${S2} - ${S6}}{4}` : `\\frac{${S6} - ${S2}}{4}`) : `${sgn < 0 ? '-' : ''}\\frac{${S6} + ${S2}}{4}`;
  return { tex: body, value: (fn === 'sin' ? Math.sin : Math.cos)(rad(d)) };
}
const SPLITS: Record<number, [number, number, '+' | '-']> = { 15: [45, 30, '-'], 75: [45, 30, '+'], 105: [60, 45, '+'], 165: [120, 45, '+'], 195: [150, 45, '+'], 255: [210, 45, '+'], 285: [240, 45, '+'], 345: [300, 45, '+'] };

const esdValue: Generator = {
  id: 'u4-esd-value',
  nodeId: 'T6.exact-sum-double',
  title: 'Exact value with a sum or difference identity',
  make(rng, tier): Draft {
    const d = rng.pick(tier === 1 ? [15, 75, 105] : Object.keys(SPLITS).map(Number));
    const fn = tier === 3 ? rng.pick(['sin', 'cos', 'tan'] as const) : rng.pick(['sin', 'cos'] as const);
    const inRad = tier > 1 && rng.chance(0.5);
    const [A, B, op] = SPLITS[d];
    const e = exact15(fn, d);
    const a = (f: 'sin' | 'cos' | 'tan', x: number) => exact(f, x)!.tex;
    const expand =
      fn === 'sin'
        ? `\\sin ${angTex(A, inRad)}\\cos ${angTex(B, inRad)} ${op} \\cos ${angTex(A, inRad)}\\sin ${angTex(B, inRad)}`
        : fn === 'cos'
          ? `\\cos ${angTex(A, inRad)}\\cos ${angTex(B, inRad)} ${op === '+' ? '-' : '+'} \\sin ${angTex(A, inRad)}\\sin ${angTex(B, inRad)}`
          : `\\frac{\\tan ${angTex(A, inRad)} ${op} \\tan ${angTex(B, inRad)}}{1 ${op === '+' ? '-' : '+'} \\tan ${angTex(A, inRad)}\\tan ${angTex(B, inRad)}}`;
    const nums =
      fn === 'sin'
        ? `\\left(${a('sin', A)}\\right)\\left(${a('cos', B)}\\right) ${op} \\left(${a('cos', A)}\\right)\\left(${a('sin', B)}\\right)`
        : fn === 'cos'
          ? `\\left(${a('cos', A)}\\right)\\left(${a('cos', B)}\\right) ${op === '+' ? '-' : '+'} \\left(${a('sin', A)}\\right)\\left(${a('sin', B)}\\right)`
          : `\\frac{${a('tan', A)} ${op} ${a('tan', B)}}{1 ${op === '+' ? '-' : '+'} \\left(${a('tan', A)}\\right)\\left(${a('tan', B)}\\right)}`;
    return {
      cognitive: 'procedural',
      stem: `Use a sum or difference identity to determine the exact value of ${m(`\\${fn} ${angTex(d, inRad)}`)}.`,
      format: 'input',
      fields: [field({ kind: 'number', value: e.value, tex: e.tex, exact: true })],
      hints: [`Write ${m(angTex(d, inRad))} as a sum or difference of special angles.`, `${m(`${angTex(d, inRad)} = ${angTex(A, inRad)} ${op} ${angTex(B, inRad)}`)}.`, `${m(`\\${fn}(A ${op} B) = ${fn === 'sin' ? `\\sin A\\cos B ${op} \\cos A\\sin B` : fn === 'cos' ? `\\cos A\\cos B ${op === '+' ? '-' : '+'} \\sin A\\sin B` : `\\frac{\\tan A ${op} \\tan B}{1 ${op === '+' ? '-' : '+'} \\tan A\\tan B}`}`)}.`],
      solution: [
        { tex: m(`\\${fn} ${angTex(d, inRad)} = \\${fn}\\left(${angTex(A, inRad)} ${op} ${angTex(B, inRad)}\\right)`) },
        { tex: m(`= ${expand}`), why: 'Sum or difference identity; do not distribute the function.' },
        { tex: m(`= ${nums}`) },
        { tex: m(`= ${e.tex}`) },
      ],
    };
  },
};

const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];

const esdDouble: Generator = {
  id: 'u4-esd-double',
  nodeId: 'T6.exact-sum-double',
  title: 'Double-angle exact values',
  make(rng, tier): Draft {
    if (tier === 1) {
      const A = rng.pick([15, 22.5, 75, 67.5]);
      const kind = rng.pick(['sin', 'cos'] as const);
      const twoA = 2 * A;
      const e = exact(kind, twoA)!;
      const Atex = Number.isInteger(A) ? `${A}^\\circ` : `${A}^\\circ`;
      const expr = kind === 'sin' ? `2\\sin ${Atex}\\cos ${Atex}` : rng.chance(0.5) ? `\\cos^2 ${Atex} - \\sin^2 ${Atex}` : `1 - 2\\sin^2 ${Atex}`;
      return {
        cognitive: 'procedural',
        stem: `Determine the exact value of ${m(expr)}.`,
        format: 'input',
        fields: [field({ kind: 'number', value: e.value, tex: e.tex, exact: true })],
        hints: ['Match the expression to a double-angle identity.', kind === 'sin' ? '$2\\sin A\\cos A = \\sin 2A$.' : '$\\cos^2 A - \\sin^2 A = 1 - 2\\sin^2 A = \\cos 2A$.', `${m(`2A = ${twoA}^\\circ`)}.`],
        solution: [{ tex: m(`${expr} = \\${kind} ${twoA}^\\circ`), why: 'Double-angle identity.' }, { tex: m(`= ${e.tex}`) }],
      };
    }
    const [a, b, c] = rng.pick(TRIPLES);
    const q = rng.pick([2, 3, 4]);
    const sx = q === 4 ? 1 : -1; // x sign in quadrant
    const sy = q === 2 ? 1 : -1;
    const x = sx * b;
    const y = sy * a;
    const givenSin = rng.chance(0.5);
    const want = tier === 3 ? rng.pick(['sin', 'cos', 'tan'] as const) : rng.pick(['sin', 'cos'] as const);
    const s = F(y, c);
    const co = F(x, c);
    const s2 = s.mul(co).mul(2);
    const c2 = co.mul(co).sub(s.mul(s));
    const ans = want === 'sin' ? s2 : want === 'cos' ? c2 : s2.div(c2);
    const Q = ['', 'I', 'II', 'III', 'IV'][q];
    return {
      cognitive: 'problemSolving',
      stem: `Given ${m(givenSin ? `\\sin\\theta = ${s.tex()}` : `\\cos\\theta = ${co.tex()}`)} with ${m('\\theta')} in quadrant ${Q}, determine the exact value of ${m(`\\${want} 2\\theta`)}.`,
      format: 'input',
      fields: [field({ kind: 'number', value: ans.value, tex: ans.tex(), exact: true })],
      hints: [`Sketch ${m('\\theta')} in quadrant ${Q} and find the missing side with ${m('x^2 + y^2 = r^2')}.`, `${m(`\\sin\\theta = ${s.tex()}`)}, ${m(`\\cos\\theta = ${co.tex()}`)}.`, want === 'sin' ? '$\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$.' : want === 'cos' ? '$\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta$.' : '$\\tan 2\\theta = \\frac{\\sin 2\\theta}{\\cos 2\\theta}$.'],
      solution: [
        { tex: `${m(`x = ${x}`)}, ${m(`y = ${y}`)}, ${m(`r = ${c}`)}: ${m(`\\sin\\theta = ${s.tex()}`)}, ${m(`\\cos\\theta = ${co.tex()}`)}.`, why: `Signs from quadrant ${Q}.` },
        { tex: want === 'cos' ? m(`\\cos 2\\theta = \\left(${co.tex()}\\right)^2 - \\left(${s.tex()}\\right)^2 = ${c2.tex()}`) : m(`\\sin 2\\theta = 2\\left(${s.tex()}\\right)\\left(${co.tex()}\\right) = ${s2.tex()}`) },
        ...(want === 'tan' ? [{ tex: m(`\\cos 2\\theta = ${c2.tex()}`) }, { tex: m(`\\tan 2\\theta = \\frac{${s2.tex()}}{${c2.tex()}} = ${ans.tex()}`) }] : []),
      ],
    };
  },
};

const esdCondense: Generator = {
  id: 'u4-esd-condense',
  nodeId: 'T6.exact-sum-double',
  title: 'Write as a single function',
  make(rng, tier): Draft {
    const kind = rng.pick(tier === 1 ? ['sinSum', 'double'] : ['sinSum', 'sinDiff', 'cosSum', 'cosDiff', 'double', 'cosDouble']);
    const A = rng.pick([50, 70, 80, 100, 110, 130]);
    const B = rng.pick([10, 20, 40]);
    const D = (x: number) => `${x}^\\circ`;
    let expr = '';
    let right = '';
    let cands: C[] = [];
    if (kind === 'sinSum' || kind === 'sinDiff') {
      const op = kind === 'sinSum' ? '+' : '-';
      expr = `\\sin ${D(A)}\\cos ${D(B)} ${op} \\cos ${D(A)}\\sin ${D(B)}`;
      right = `\\sin ${D(op === '+' ? A + B : A - B)}`;
      cands = [
        { tex: `\\sin ${D(op === '+' ? A - B : A + B)}`, key: 'sign', mis: 'trig-sum-distribute' },
        { tex: `\\cos ${D(op === '+' ? A + B : A - B)}`, key: 'fn', mis: 'trig-identity-sub-wrong' },
        { tex: `\\sin ${D(A)} ${op} \\sin ${D(B)}`, key: 'dist', mis: 'trig-sum-distribute' },
      ];
    } else if (kind === 'cosSum' || kind === 'cosDiff') {
      const op = kind === 'cosSum' ? '-' : '+';
      expr = `\\cos ${D(A)}\\cos ${D(B)} ${op} \\sin ${D(A)}\\sin ${D(B)}`;
      right = `\\cos ${D(op === '-' ? A + B : A - B)}`;
      cands = [
        { tex: `\\cos ${D(op === '-' ? A - B : A + B)}`, key: 'sign', mis: 'trig-sum-distribute', feedback: 'For cosine the sign flips: $\\cos(A + B) = \\cos A\\cos B - \\sin A\\sin B$.' },
        { tex: `\\sin ${D(op === '-' ? A + B : A - B)}`, key: 'fn', mis: 'trig-identity-sub-wrong' },
        { tex: `\\cos ${D(A)} ${op === '-' ? '+' : '-'} \\cos ${D(B)}`, key: 'dist', mis: 'trig-sum-distribute' },
      ];
    } else if (kind === 'double') {
      expr = `2\\sin ${D(B)}\\cos ${D(B)}`;
      right = `\\sin ${D(2 * B)}`;
      cands = [
        { tex: `2\\sin ${D(2 * B)}`, key: '2s', mis: 'trig-sin2-sin-squared' },
        { tex: `\\sin^2 ${D(B)}`, key: 'sq', mis: 'trig-sin2-sin-squared' },
        { tex: `\\cos ${D(2 * B)}`, key: 'c', mis: 'trig-identity-sub-wrong' },
      ];
    } else {
      expr = `1 - 2\\sin^2 ${D(B)}`;
      right = `\\cos ${D(2 * B)}`;
      cands = [
        { tex: `\\sin ${D(2 * B)}`, key: 's', mis: 'trig-identity-sub-wrong' },
        { tex: `\\cos^2 ${D(B)}`, key: 'c2', mis: 'trig-pyth-sign', feedback: '$1 - \\sin^2 x = \\cos^2 x$, but here the coefficient is 2.' },
        { tex: `-\\cos ${D(2 * B)}`, key: 'n', mis: 'trig-identity-sub-wrong' },
      ];
    }
    return {
      cognitive: 'procedural',
      stem: `Write ${m(expr)} as a single trigonometric function.`,
      format: 'mc',
      choices: mc({ tex: m(right), key: 'r' }, cands.map((c) => ({ ...c, tex: m(c.tex) }))),
      hints: ['Match the pattern to a sum, difference or double-angle identity.', '$\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B$; $\\cos(A \\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B$.', '$\\sin 2A = 2\\sin A\\cos A$; $\\cos 2A = 1 - 2\\sin^2 A$.'],
      solution: [{ tex: m(`${expr} = ${right}`), why: kind.startsWith('cos') && kind !== 'cosDouble' ? 'Cosine identities flip the sign between the terms.' : 'Read the identity right to left.' }],
    };
  },
};

// ---------------------------------------------------------------- T6.prove-advanced

const ADV: { tex: string; ans: string; steps: string[]; wrong: C[] }[] = [
  { tex: '\\frac{\\sin 2x}{1 + \\cos 2x}', ans: '\\tan x', steps: ['\\frac{2\\sin x\\cos x}{1 + 2\\cos^2 x - 1}', '\\frac{2\\sin x\\cos x}{2\\cos^2 x}'], wrong: [{ tex: '\\cot x', key: 'cot', mis: 'trig-identity-sub-wrong' }, { tex: '2\\tan x', key: '2t', mis: 'trig-sin2-sin-squared' }, { tex: '\\sin x', key: 's', mis: 'cancel-terms' }] },
  { tex: '\\frac{1 - \\cos 2x}{\\sin 2x}', ans: '\\tan x', steps: ['\\frac{1 - (1 - 2\\sin^2 x)}{2\\sin x\\cos x}', '\\frac{2\\sin^2 x}{2\\sin x\\cos x}'], wrong: [{ tex: '\\cot x', key: 'cot', mis: 'trig-identity-sub-wrong' }, { tex: '\\sin x', key: 's', mis: 'cancel-terms' }, { tex: '\\frac{1}{2}\\tan x', key: 'h', mis: 'trig-sin2-sin-squared' }] },
  { tex: '\\frac{\\sin 2x}{\\sin x}', ans: '2\\cos x', steps: ['\\frac{2\\sin x\\cos x}{\\sin x}'], wrong: [{ tex: '2', key: '2', mis: 'trig-sin2-sin-squared' }, { tex: '\\cos x', key: 'c', mis: 'trig-sin2-sin-squared' }, { tex: '2\\sin x', key: 's', mis: 'cancel-terms' }] },
  { tex: '\\frac{1 - \\cos 2x}{2}', ans: '\\sin^2 x', steps: ['\\frac{1 - (1 - 2\\sin^2 x)}{2}'], wrong: [{ tex: '\\cos^2 x', key: 'c2', mis: 'trig-identity-sub-wrong' }, { tex: '-\\sin^2 x', key: 'n', mis: 'trig-pyth-sign' }, { tex: '\\sin x', key: 's', mis: 'trig-sin2-sin-squared' }] },
  { tex: '\\frac{1}{1 - \\sin x} + \\frac{1}{1 + \\sin x}', ans: '2\\sec^2 x', steps: ['\\frac{(1 + \\sin x) + (1 - \\sin x)}{1 - \\sin^2 x}', '\\frac{2}{\\cos^2 x}'], wrong: [{ tex: '2', key: '2', mis: 'cancel-terms' }, { tex: '2\\csc^2 x', key: 'csc', mis: 'trig-pyth-sign' }, { tex: '\\sec^2 x', key: 's', mis: 'cancel-terms' }] },
  { tex: '\\frac{\\cos x}{1 - \\sin x} - \\tan x', ans: '\\sec x', steps: ['\\frac{\\cos^2 x - \\sin x(1 - \\sin x)}{\\cos x(1 - \\sin x)}', '\\frac{1 - \\sin x}{\\cos x(1 - \\sin x)}'], wrong: [{ tex: '\\cos x', key: 'c', mis: 'trig-reciprocal-inverse' }, { tex: '\\csc x', key: 'csc', mis: 'trig-reciprocal-inverse' }, { tex: '1', key: '1', mis: 'cancel-terms' }] },
  { tex: '(\\sin x + \\cos x)^2 - 1', ans: '\\sin 2x', steps: ['\\sin^2 x + 2\\sin x\\cos x + \\cos^2 x - 1', '2\\sin x\\cos x'], wrong: [{ tex: '0', key: '0', mis: 'trig-sum-distribute', feedback: '$(a + b)^2 \\ne a^2 + b^2$.' }, { tex: '\\cos 2x', key: 'c', mis: 'trig-identity-sub-wrong' }, { tex: '2\\sin x', key: 's', mis: 'trig-sin2-sin-squared' }] },
  { tex: '\\cos^4 x - \\sin^4 x', ans: '\\cos 2x', steps: ['(\\cos^2 x - \\sin^2 x)(\\cos^2 x + \\sin^2 x)', '\\cos^2 x - \\sin^2 x'], wrong: [{ tex: '1', key: '1', mis: 'trig-pyth-sign' }, { tex: '\\sin 2x', key: 's', mis: 'trig-identity-sub-wrong' }, { tex: '\\cos^2 2x', key: 'c2', mis: 'trig-sin2-sin-squared' }] },
  { tex: '\\frac{\\sin x}{1 - \\cos x} - \\frac{\\sin x}{1 + \\cos x}', ans: '2\\cot x', steps: ['\\frac{\\sin x(1 + \\cos x) - \\sin x(1 - \\cos x)}{1 - \\cos^2 x}', '\\frac{2\\sin x\\cos x}{\\sin^2 x}'], wrong: [{ tex: '0', key: '0', mis: 'cancel-terms' }, { tex: '2\\tan x', key: 't', mis: 'trig-reciprocal-inverse' }, { tex: '2\\csc x', key: 'csc', mis: 'trig-conjugate-misuse' }] },
];

const CONJ: { den: string; conj: string; num: string; result: string }[] = [
  { den: '1 - \\cos x', conj: '1 + \\cos x', num: '\\sin x', result: '\\frac{1 + \\cos x}{\\sin x}' },
  { den: '1 + \\cos x', conj: '1 - \\cos x', num: '\\sin x', result: '\\frac{1 - \\cos x}{\\sin x}' },
  { den: '1 - \\sin x', conj: '1 + \\sin x', num: '\\cos x', result: '\\frac{1 + \\sin x}{\\cos x}' },
  { den: '1 + \\sin x', conj: '1 - \\sin x', num: '\\cos x', result: '\\frac{1 - \\sin x}{\\cos x}' },
  { den: '\\sec x - 1', conj: '\\sec x + 1', num: '\\tan x', result: '\\frac{\\sec x + 1}{\\tan x}' },
];

const paConj: Generator = {
  id: 'u4-pa-conj',
  nodeId: 'T6.prove-advanced',
  title: 'Multiply by the conjugate',
  make(rng, tier): Draft {
    const c = rng.pick(tier === 1 ? CONJ.slice(0, 4) : CONJ);
    const expr = `\\frac{${c.num}}{${c.den}}`;
    if (!equivalentTex(expr, c.result)) throw new Error(`conjugate table wrong: ${expr}`);
    if (tier === 3) {
      return {
        cognitive: 'procedural',
        stem: `Simplify ${m(expr)} by multiplying by the conjugate. Which result is correct?`,
        format: 'mc',
        choices: mc({ tex: m(c.result), key: 'r' }, notEquiv(c.result, [
          { tex: `\\frac{${c.num}(${c.conj})}{${c.den}}`, key: 'top', mis: 'trig-conjugate-misuse', feedback: 'Multiply numerator and denominator by the conjugate, so the value stays the same.' },
          { tex: `\\frac{${c.conj}}{${c.num}}`.replace(c.conj, c.conj.replace(/[+-]/, (s) => (s === '+' ? '-' : '+'))), key: 'sign', mis: 'trig-pyth-sign' },
          { tex: `\\frac{${c.num}}{${c.conj}}`, key: 'den', mis: 'trig-conjugate-misuse' },
          { tex: `\\frac{${c.conj}}{${c.num}^2}`, key: 'sq', mis: 'trig-pyth-sign' },
        ].map((x) => ({ ...x, tex: x.tex }))).map((x) => ({ ...x, tex: m(x.tex) }))),
        hints: [`Multiply by ${m(`\\frac{${c.conj}}{${c.conj}}`)}.`, 'The denominator becomes a difference of squares.', 'Use a Pythagorean identity, then cancel.'],
        solution: [
          { tex: m(`\\frac{${c.num}}{${c.den}} \\cdot \\frac{${c.conj}}{${c.conj}} = \\frac{${c.num}(${c.conj})}{(${c.den})(${c.conj})}`), why: 'Multiply by 1 in the form conjugate over conjugate.' },
          { tex: m(`= ${c.result}`), why: 'Difference of squares, Pythagorean identity, cancel a common factor.' },
        ],
      };
    }
    return {
      cognitive: 'conceptual',
      stem: `To simplify ${m(expr)}, what should you multiply it by?`,
      format: 'mc',
      choices: mc({ tex: m(`\\frac{${c.conj}}{${c.conj}}`), key: 'r' }, [
        { tex: m(`\\frac{${c.den}}{${c.den}}`), key: 'same', mis: 'trig-conjugate-misuse', feedback: 'The conjugate changes the sign between the terms.' },
        { tex: `${m(c.conj)}, in the denominator only`, key: 'den', mis: 'trig-conjugate-misuse', feedback: 'Multiplying only the denominator changes the value of the expression.' },
        { tex: `${m(c.conj)}, on both sides of the identity`, key: 'both', mis: 'trig-prove-cross-sides' },
      ]),
      hints: ['The conjugate of $a - b$ is $a + b$.', 'It turns the denominator into a difference of squares.', 'Multiply top and bottom, so you are multiplying by 1.'],
      solution: [{ tex: m(`\\frac{${c.num}}{${c.den}} \\cdot \\frac{${c.conj}}{${c.conj}}`), why: 'The denominator becomes a single squared function by a Pythagorean identity.' }, { tex: m(`= ${c.result}`) }],
    };
  },
};

const paSimplify: Generator = {
  id: 'u4-pa-simplify',
  nodeId: 'T6.prove-advanced',
  title: 'Simplify with double angles and fractions',
  make(rng): Draft {
    const c = rng.pick(ADV);
    if (!equivalentTex(c.tex, c.ans)) throw new Error(`advanced table wrong: ${c.tex}`);
    return {
      cognitive: 'problemSolving',
      stem: `Simplify ${m(c.tex)} to a single term.`,
      format: 'input',
      fields: [field(trigExpr(c.ans))],
      hints: ['Expand, or replace any double angle with a single-angle identity.', 'Look for $\\sin^2 x + \\cos^2 x = 1$; then combine fractions or cancel a common factor.', `${m(c.steps[0])}.`],
      solution: [...c.steps.map((s, i) => ({ tex: m(`${i === 0 ? c.tex : ''} = ${s}`) })), { tex: m(`= ${c.ans}`) }],
    };
  },
};

const paMc: Generator = {
  id: 'u4-pa-mc',
  nodeId: 'T6.prove-advanced',
  title: 'Which expression is equivalent?',
  make(rng): Draft {
    const c = rng.pick(ADV);
    return {
      cognitive: 'procedural',
      stem: `Which expression is equivalent to ${m(c.tex)}?`,
      format: 'mc',
      choices: mc({ tex: m(c.ans), key: 'r' }, notEquiv(c.ans, c.wrong).map((w) => ({ ...w, tex: m(w.tex) }))),
      hints: ['Expand, or replace any double angle with a single-angle identity.', 'Look for $\\sin^2 x + \\cos^2 x = 1$; then combine fractions or cancel a common factor.', `${m(c.steps[0])}.`],
      solution: [...c.steps.map((s, i) => ({ tex: m(`${i === 0 ? c.tex : ''} = ${s}`) })), { tex: m(`= ${c.ans}`) }],
    };
  },
};


export const identityGenerators: Generator[] = [iveClassify, iveVerify, iveProof, npvList, npvGeneral, npvMc, simpMc, simpInput, simpPyth, pbStep, pbNext, pbWhich, esdValue, esdDouble, esdCondense, paConj, paSimplify, paMc];
