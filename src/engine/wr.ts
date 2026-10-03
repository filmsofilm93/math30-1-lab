// Written-response questions: two linked parts worth 2 and 3 marks, with a question-specific rubric and a worked solution.
import { makeItem } from './framework';
import { GENERATORS } from './generators';
import { compileTrig, IDENTITY_PROBLEMS, npvDegrees } from './identity';
import { Rng } from './rng';
import type { GraphSpec, Item, Step, Tier } from './types';

export type WrStrand = 'RF' | 'T' | 'PCBT';

/** A part built from a tested generator, or a trig proof (with a verify part before it). */
export type WrPartSpec = { kind: 'gen'; gen: string; tier: Tier; instruction: string } | { kind: 'verify' } | { kind: 'prove' };

export interface WrTemplate {
  id: string;
  title: string;
  strand: WrStrand;
  /** Generator ids used (for scoping a mock to units studied); prove/verify parts use T6 skills. */
  parts: [WrPartSpec & { gen?: string }, WrPartSpec & { gen?: string }];
}

export interface WrPart {
  marks: 2 | 3;
  prompt: string; // rich text
  graph?: GraphSpec;
  table?: Item['table'];
  /** What a full-mark response contains, mark by mark. */
  rubric: string[];
  solution: Step[];
  /** Short final answer, rich text. */
  answer: string;
  nodeId: string;
}

export interface WrQuestion {
  templateId: string;
  seed: number;
  title: string;
  strand: WrStrand;
  intro?: string;
  parts: [WrPart, WrPart];
}

const gen = (g: string, tier: Tier, instruction: string): WrPartSpec & { gen: string } => ({ kind: 'gen', gen: g, tier, instruction });
const ALG = 'Use an algebraic method and show all of your work.';
const WORK = 'Show all of your work.';
const CALC = 'You may use a calculator, but describe the method you used.';

export const WR_TEMPLATES: WrTemplate[] = [
  { id: 'wr-transform', title: 'Transformations', strand: 'RF', parts: [gen('rf4-map-point', 2, WORK), gen('rf4-equation-from-graph', 3, 'Explain how each parameter was determined.')] },
  { id: 'wr-inverse', title: 'Inverses', strand: 'RF', parts: [gen('rf6-inverse-linear', 2, ALG), gen('rf6-inverse-quadratic', 3, ALG)] },
  { id: 'wr-ops', title: 'Function operations', strand: 'RF', parts: [gen('rf1-quotient-domain', 2, 'Explain how you determined the domain.'), gen('rf1-compose-param', 3, ALG)] },
  { id: 'wr-poly', title: 'Polynomial functions', strand: 'RF', parts: [gen('u2-rem-unknown', 2, ALG), gen('u2-izt-find', 3, ALG)] },
  { id: 'wr-poly-model', title: 'Polynomial models', strand: 'RF', parts: [gen('u2-eqgraph-input', 2, 'Explain how the graph gives each factor.'), gen('u2-model-box-max', 3, CALC)] },
  { id: 'wr-exp', title: 'Exponential equations', strand: 'RF', parts: [gen('u3-ecb-solve', 2, ALG), gen('u3-elog-solve', 3, ALG)] },
  { id: 'wr-log', title: 'Logarithmic equations', strand: 'RF', parts: [gen('u3-logeq-same', 2, ALG), gen('u3-logeq-solve', 3, `${ALG} Justify any root you reject.`)] },
  { id: 'wr-radical', title: 'Radical functions', strand: 'RF', parts: [gen('u5-sqrtf-domain-range', 2, 'Explain how the graph or equation of f gives your answer.'), gen('u5-radsolve-algebraic', 3, `${ALG} Justify any root you reject.`)] },
  { id: 'wr-rational', title: 'Rational functions', strand: 'RF', parts: [gen('u5-rat-holey', 2, ALG), gen('u5-ratsolve-algebraic', 3, `${ALG} State the non-permissible values.`)] },
  { id: 'wr-rational-range', title: 'Rational functions', strand: 'RF', parts: [gen('u5-rat-intercepts', 2, WORK), gen('u5-rat-range', 3, 'Explain how the point of discontinuity affects the range.')] },
  { id: 'wr-trig-eq', title: 'Trigonometric equations', strand: 'T', parts: [gen('u4-sd-factor', 2, ALG), gen('u4-is-double', 3, ALG)] },
  { id: 'wr-trig-eq2', title: 'Trigonometric equations', strand: 'T', parts: [gen('u4-fd-exact', 2, ALG), gen('u4-is-pyth', 3, ALG)] },
  { id: 'wr-identity', title: 'Trigonometric identities', strand: 'T', parts: [{ kind: 'verify' }, { kind: 'prove' }] },
  { id: 'wr-sinusoid', title: 'Sinusoidal models', strand: 'T', parts: [gen('u4-efg-data', 2, 'Explain how you found each parameter.'), gen('u4-mod-tide', 3, CALC)] },
  { id: 'wr-permutations', title: 'Permutations', strand: 'PCBT', parts: [gen('u6-perm-together', 2, 'Explain your reasoning; a slot diagram may help.'), gen('u6-cases-three', 3, 'Show each case and how the cases combine.')] },
  { id: 'wr-binomial', title: 'Binomial theorem', strand: 'PCBT', parts: [gen('u6-expand-coef', 2, 'Use the general term and show your work.'), gen('u6-nl-constant', 3, 'Use the general term and show your work.')] },
  { id: 'wr-combinations', title: 'Combinations', strand: 'PCBT', parts: [gen('u6-mixed-roles', 2, 'Explain your reasoning.'), gen('u6-atleast-k', 3, 'Show each case, or the indirect method, clearly.')] },
];

/** Full proofs for the identity bank: each line equals the previous one; `why` names the move. */
export const PROOF_LINES: Record<string, { lines: string[]; why: string[] }> = {
  i1: { lines: ['\\tan x\\cos x', '\\frac{\\sin x}{\\cos x}\\cos x', '\\sin x'], why: ['Quotient identity.', 'Cancel $\\cos x$.'] },
  i2: { lines: ['\\sec x - \\cos x', '\\frac{1}{\\cos x} - \\frac{\\cos^2 x}{\\cos x}', '\\frac{1 - \\cos^2 x}{\\cos x}', '\\frac{\\sin^2 x}{\\cos x}', '\\frac{\\sin x}{\\cos x}\\sin x', '\\sin x\\tan x'], why: ['Reciprocal identity and a common denominator.', 'Combine the fractions.', 'Pythagorean identity.', 'Split the fraction.', 'Quotient identity.'] },
  i3: { lines: ['\\frac{1 - \\cos^2 x}{\\sin x\\cos x}', '\\frac{\\sin^2 x}{\\sin x\\cos x}', '\\frac{\\sin x}{\\cos x}', '\\tan x'], why: ['Pythagorean identity.', 'Cancel $\\sin x$.', 'Quotient identity.'] },
  i4: { lines: ['\\csc x - \\sin x', '\\frac{1}{\\sin x} - \\frac{\\sin^2 x}{\\sin x}', '\\frac{1 - \\sin^2 x}{\\sin x}', '\\frac{\\cos^2 x}{\\sin x}', '\\frac{\\cos x}{\\sin x}\\cos x', '\\cos x\\cot x'], why: ['Reciprocal identity and a common denominator.', 'Combine the fractions.', 'Pythagorean identity.', 'Split the fraction.', 'Quotient identity.'] },
  i5: { lines: ['\\frac{\\sec^2 x - 1}{\\sec^2 x}', '\\frac{\\tan^2 x}{\\sec^2 x}', '\\frac{\\sin^2 x}{\\cos^2 x}\\cdot\\cos^2 x', '\\sin^2 x'], why: ['Pythagorean identity: $\\sec^2 x - 1 = \\tan^2 x$.', 'Quotient and reciprocal identities.', 'Cancel $\\cos^2 x$.'] },
  i6: { lines: ['\\tan x + \\cot x', '\\frac{\\sin x}{\\cos x} + \\frac{\\cos x}{\\sin x}', '\\frac{\\sin^2 x + \\cos^2 x}{\\sin x\\cos x}', '\\frac{1}{\\sin x\\cos x}', '\\sec x\\csc x'], why: ['Quotient identities.', 'Common denominator.', 'Pythagorean identity.', 'Reciprocal identities.'] },
  i7: { lines: ['\\frac{\\sin x}{1 - \\cos x}', '\\frac{\\sin x}{1 - \\cos x}\\cdot\\frac{1 + \\cos x}{1 + \\cos x}', '\\frac{(1 + \\cos x)\\sin x}{1 - \\cos^2 x}', '\\frac{(1 + \\cos x)\\sin x}{\\sin^2 x}', '\\frac{1 + \\cos x}{\\sin x}'], why: ['Multiply by the conjugate of the denominator (a form of 1).', 'Difference of squares in the denominator.', 'Pythagorean identity.', 'Cancel $\\sin x$.'] },
  i8: { lines: ['\\frac{\\sin 2x}{1 + \\cos 2x}', '\\frac{2\\sin x\\cos x}{1 + 2\\cos^2 x - 1}', '\\frac{2\\sin x\\cos x}{2\\cos^2 x}', '\\frac{\\sin x}{\\cos x}', '\\tan x'], why: ['Double-angle identities, choosing $\\cos 2x = 2\\cos^2 x - 1$ so the 1s cancel.', 'Simplify the denominator.', 'Cancel $2\\cos x$.', 'Quotient identity.'] },
  i9: { lines: ['\\frac{1}{1 - \\sin x} + \\frac{1}{1 + \\sin x}', '\\frac{1 + \\sin x + 1 - \\sin x}{(1 - \\sin x)(1 + \\sin x)}', '\\frac{2}{1 - \\sin^2 x}', '\\frac{2}{\\cos^2 x}', '2\\sec^2 x'], why: ['Common denominator.', 'Simplify the numerator; difference of squares below.', 'Pythagorean identity.', 'Reciprocal identity.'] },
  i10: { lines: ['(\\sin x + \\cos x)^2', '\\sin^2 x + 2\\sin x\\cos x + \\cos^2 x', '1 + 2\\sin x\\cos x', '1 + \\sin 2x'], why: ['Expand the square.', 'Pythagorean identity.', 'Double-angle identity.'] },
  i11: { lines: ['\\cos^4 x - \\sin^4 x', '(\\cos^2 x - \\sin^2 x)(\\cos^2 x + \\sin^2 x)', '(\\cos^2 x - \\sin^2 x)(1)', '\\cos 2x'], why: ['Difference of squares.', 'Pythagorean identity.', 'Double-angle identity.'] },
  i12: { lines: ['\\frac{\\cos x}{1 - \\sin x} - \\tan x', '\\frac{\\cos x}{1 - \\sin x} - \\frac{\\sin x}{\\cos x}', '\\frac{\\cos^2 x - (1 - \\sin x)\\sin x}{(1 - \\sin x)\\cos x}', '\\frac{\\cos^2 x + \\sin^2 x - \\sin x}{(1 - \\sin x)\\cos x}', '\\frac{1 - \\sin x}{(1 - \\sin x)\\cos x}', '\\frac{1}{\\cos x}', '\\sec x'], why: ['Quotient identity.', 'Common denominator.', 'Expand the numerator.', 'Pythagorean identity.', 'Cancel $1 - \\sin x$.', 'Reciprocal identity.'] },
};

const m = (t: string) => `$${t}$`;
const VERIFY_AT: [string, number][] = [
  ['\\frac{\\pi}{6}', Math.PI / 6],
  ['\\frac{\\pi}{4}', Math.PI / 4],
  ['\\frac{\\pi}{3}', Math.PI / 3],
];
const fmt4 = (v: number) => String(+v.toFixed(4));

/** Rubric from a worked solution: early steps earn the method marks, the last mark needs the correct final answer. */
function rubricFrom(steps: Step[], marks: 2 | 3, answer: string): string[] {
  const body = steps.slice(0, -1);
  const groups = marks - 1;
  const out: string[] = [];
  for (let g = 0; g < groups; g++) {
    const part = body.slice(Math.floor((g * body.length) / groups), Math.floor(((g + 1) * body.length) / groups));
    const text = (part.length ? part : steps.slice(0, 1)).map((s) => s.why ?? s.tex).join(' ');
    out.push(`1 mark: ${text}`);
  }
  out.push(`1 mark: correct final answer, ${answer}, with correct notation.`);
  return out;
}

function answerText(it: Item): string {
  return (it.fields ?? []).map((f) => (f.prefix ? m(`${f.prefix} ${f.answer.tex}`) : m(f.answer.tex))).join('; ');
}

function genPart(spec: Extract<WrPartSpec, { kind: 'gen' }>, seed: number, marks: 2 | 3): WrPart {
  const g = GENERATORS.find((x) => x.id === spec.gen)!;
  const it = makeItem(g, seed, spec.tier);
  const answer = it.format === 'mc' ? it.choices!.find((c) => c.correct)!.tex : answerText(it);
  return { marks, prompt: `${it.stem} ${spec.instruction}`, graph: it.graph, table: it.table, rubric: rubricFrom(it.solution, marks, answer), solution: it.solution, answer, nodeId: g.nodeId };
}

/** Build the question for a template and seed. Deterministic. */
export function makeWr(templateId: string, seed: number): WrQuestion {
  const t = WR_TEMPLATES.find((x) => x.id === templateId)!;
  const rng = new Rng(seed);
  let intro: string | undefined;
  const parts = t.parts.map((spec, i) => {
    const marks = (i === 0 ? 2 : 3) as 2 | 3;
    if (spec.kind === 'gen') return genPart(spec, rng.int(1, 1_000_000), marks);
    return null;
  }) as (WrPart | null)[];

  if (t.parts[0].kind === 'verify') {
    // Pick an identity, a verification value that avoids its non-permissible values, and its full proof.
    const p = rng.pick(IDENTITY_PROBLEMS);
    const proof = PROOF_LINES[p.id];
    const L = compileTrig(p.lhs)!;
    const R = compileTrig(p.rhs)!;
    const [vt, v] = rng.pick(VERIFY_AT.filter(([, x]) => !L.npv(x, 1e-6) && !R.npv(x, 1e-6)));
    const npv = [...new Set([...npvDegrees(p.lhs), ...npvDegrees(p.rhs)])].sort((a, b) => a - b);
    const id = `${p.lhs} = ${p.rhs}`;
    intro = `Consider the identity ${m(id)}.`;
    parts[0] = {
      marks: 2,
      prompt: `Verify the identity for ${m(`x = ${vt}`)}. Show your work.`,
      rubric: [`1 mark: substitutes ${m(`x = ${vt}`)} into each side separately and evaluates the left side, ${m(`\\approx ${fmt4(L.f(v))}`)} (exact values also accepted).`, `1 mark: evaluates the right side to the same value and concludes that both sides are equal at ${m(`x = ${vt}`)}.`],
      solution: [
        { tex: `Left side at ${m(`x = ${vt}`)}: ${m(`${p.lhs.replace(/x/g, `\\left(${vt}\\right)`)} \\approx ${fmt4(L.f(v))}`)}`, why: 'Evaluate each side on its own.' },
        { tex: `Right side: ${m(`${p.rhs.replace(/x/g, `\\left(${vt}\\right)`)} \\approx ${fmt4(R.f(v))}`)}`, why: 'Same value, so the identity holds at this value. That is a verification, not a proof.' },
      ],
      answer: `Both sides ${m(`\\approx ${fmt4(L.f(v))}`)}`,
      nodeId: 'T6.identity-vs-equation',
    };
    parts[1] = {
      marks: 3,
      prompt: 'Prove the identity algebraically.',
      rubric: [
        `1 mark: correct use of identities (${[...new Set(proof.why.map((w) => w.split(/[,:(]/)[0].replace(/\.$/, '')))].slice(0, 3).join('; ')}).`,
        '1 mark: correct algebra (common denominators, factoring, cancelling) with no step that operates on both sides at once.',
        '1 mark: a complete, logical proof that transforms one side (or each side separately) until the sides match, ending with a statement such as "LHS = RHS".',
      ],
      solution: proof.lines.slice(1).map((l, i) => ({ tex: m(`${i === 0 ? '\\text{LHS} = ' : '= '}${l}`), why: proof.why[i] })).concat([{ tex: '$= \\text{RHS}$', why: `The identity holds for every permissible value${npv.length ? ` (in $0^\\circ \\le x < 360^\\circ$, x cannot be ${npv.map((d) => `$${d}^\\circ$`).join(', ')})` : ''}.` }]),
      answer: 'LHS = RHS',
      nodeId: p.excellence ? 'T6.prove-advanced' : 'T6.prove-basic',
    };
  }
  return { templateId, seed, title: t.title, strand: t.strand, intro, parts: parts as [WrPart, WrPart] };
}

/** Generator ids a template depends on, for scoping by unit. */
export const wrNodes = (t: WrTemplate): string[] =>
  t.parts[0].kind === 'verify' ? ['T6.identity-vs-equation', 'T6.prove-basic'] : t.parts.map((p) => GENERATORS.find((g) => g.id === (p as { gen: string }).gen)!.nodeId);
