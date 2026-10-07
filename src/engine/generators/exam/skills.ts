// Exam skills: numerical-response recording, directing words, written-response hygiene, sketch standard.
import { DIRECTING_WORDS } from '../../../content/exam';
import { field, m as mTex, mc, type Cand } from '../../framework';
import { NR_FOOTER, NR_FOOTER_ANY, NR_FOOTER_ORDER, recordValue, valueSpec } from '../../nr';
import type { Draft, Generator, Round } from '../../types';
import { Reject } from '../../types';

const m = (x: string | number) => mTex(String(x));
const ROUND_WORD: Record<Round, string> = { whole: 'the nearest whole number', tenth: 'the nearest tenth', hundredth: 'the nearest hundredth' };

// ---------------------------------------------------------------- EXAM.nr-recording

const nrRecordValue: Generator = {
  id: 'nr-record-value',
  nodeId: 'EXAM.nr-recording',
  title: 'Record a calculator value',
  make(rng, tier): Draft {
    const round = rng.pick(['tenth', 'hundredth', 'hundredth', 'whole'] as Round[]);
    const small = tier === 1 || rng.chance(0.4);
    const neg = tier === 3 && rng.chance(0.5);
    const mag = small ? rng.int(1, 999) / 1000 + rng.int(1, 9) / 100000 : rng.int(1, 99) + rng.int(1, 9999) / 10000;
    const v = (neg ? -1 : 1) * mag;
    const spec = valueSpec(v, round);
    if (!spec || spec.value === 0) throw new Reject();
    const raw = v.toFixed(7);
    return {
      cognitive: 'procedural',
      stem: `Your calculator shows ${m(raw)}. The question asks for the answer to ${ROUND_WORD[round]}${neg ? ', and a negative sign is printed before the answer boxes' : ''}. Record it as you would on the answer sheet. ${NR_FOOTER}`,
      format: 'nr',
      nr: spec,
      hints: [`Round to ${ROUND_WORD[round]} only now, at the end.`, 'Start in the left-hand box; leave unused boxes on the right blank.', spec.record.startsWith('0') ? 'A value between 0 and 1 keeps its 0 before the decimal point.' : neg ? 'The negative sign is already printed. Record only the digits.' : 'The decimal point takes a box.'],
      solution: [
        { tex: `${m(raw)} rounded to ${ROUND_WORD[round]} is ${m(roundedTex(v, round))}.` },
        ...(neg ? [{ tex: 'The sign is printed before the boxes, so record only the digits.', why: 'There is no negative bubble on the answer sheet.' }] : []),
        { tex: `Record **${spec.record}**, starting in the left-hand box.`, why: spec.record.startsWith('0') ? 'The bulletin requires the 0 before the decimal point for values between 0 and 1.' : 'Unused boxes on the right stay blank.' },
      ],
    };
  },
};
const roundedTex = (v: number, r: Round) => (v < 0 ? '-' : '') + recordValue(v, r);

/** Small facts with an integer answer: the zeros of a factored polynomial, numbered in a list. */
const nrCodeAny: Generator = {
  id: 'nr-code-any',
  nodeId: 'EXAM.nr-recording',
  title: 'Digit code in any order',
  make(rng): Draft {
    const zeros = new Set<number>();
    while (zeros.size < 3) zeros.add(rng.int(-6, 6));
    const zs = [...zeros];
    const list = new Set<number>(zs);
    while (list.size < 6) list.add(rng.int(-7, 7));
    const opts = rng.shuffle([...list]).slice(0, 6);
    // Exactly the true zeros present in the list (all three are: list includes them).
    const nums = opts.map((x, i) => ({ n: i + 1, x }));
    const yes = nums.filter((o) => zs.includes(o.x)).map((o) => o.n);
    if (yes.length !== 3) throw new Reject();
    const eq = zs.map((z) => (z === 0 ? 'x' : `(x ${z > 0 ? '-' : '+'} ${Math.abs(z)})`)).join('');
    const code = yes.join('');
    return {
      cognitive: 'conceptual',
      stem: `${nums.map((o) => `**${o.n}** ${m(o.x)}`).join(',   ')}. The numbered values above that are zeros of ${m(`f(x) = ${eq}`)} are numbered ____, ____, and ____. ${NR_FOOTER_ANY(3)}`,
      format: 'nr',
      nr: { kind: 'code', record: code, order: 'any' },
      hints: ['Record the item numbers, not the values.', 'Each factor (x − a) gives the zero x = a.', '"In any order" means 134 and 431 both score.'],
      solution: [
        { tex: `Zeros: ${m(zs.slice().sort((a, b) => a - b).join(',\\ '))}.`, why: 'Set each factor equal to 0.' },
        { tex: `They are items ${yes.join(', ')}. Record **${code}** (any order scores).`, why: 'You record the labels of the choices, one digit per box.' },
      ],
    };
  },
};

const nrCodeOrder: Generator = {
  id: 'nr-code-order',
  nodeId: 'EXAM.nr-recording',
  title: 'Digit code in a stated order',
  make(rng): Draft {
    // Four logarithms, arranged from least to greatest.
    const pairs: [number, number][] = [];
    const used = new Set<number>();
    while (pairs.length < 4) {
      const b = rng.pick([2, 3, 4, 5, 10]);
      const x = rng.int(2, 120);
      const v = Math.log(x) / Math.log(b);
      if ([...used].some((u) => Math.abs(u - v) < 0.15) || Number.isInteger(+v.toFixed(9))) continue;
      used.add(v);
      pairs.push([b, x]);
    }
    const vals = pairs.map(([b, x]) => Math.log(x) / Math.log(b));
    const order = [0, 1, 2, 3].sort((i, j) => vals[i] - vals[j]).map((i) => i + 1);
    const code = order.join('');
    const lt = (b: number, x: number) => (b === 10 ? `\\log ${x}` : `\\log_{${b}} ${x}`);
    return {
      cognitive: 'conceptual',
      stem: `${pairs.map(([b, x], i) => `**${i + 1}** ${m(lt(b, x))}`).join(',   ')}. When these values are arranged from least to greatest, the order is ____, ____, ____, and ____. ${NR_FOOTER_ORDER(4)}`,
      format: 'nr',
      nr: { kind: 'code', record: code, order: 'correct' },
      hints: ['Estimate each: between which two powers of the base does the number sit?', 'Or use the change-of-base law on the formula sheet: $\\log_b x = \\frac{\\log x}{\\log b}$.', 'Record the item numbers in the order asked.'],
      solution: [
        { tex: pairs.map(([b, x], i) => `${m(`${lt(b, x)} \\approx ${vals[i].toFixed(2)}`)}`).join(', ') + '.', why: 'Change of base: $\\log_b x = \\frac{\\log x}{\\log b}$.' },
        { tex: `Least to greatest: items ${order.join(', ')}. Record **${code}**.`, why: 'This code is scored only in the stated order.' },
      ],
    };
  },
};

const nrWhichRecord: Generator = {
  id: 'nr-which-record',
  nodeId: 'EXAM.nr-recording',
  title: 'Which recording is correct?',
  make(rng): Draft {
    const round = rng.pick(['tenth', 'hundredth'] as Round[]);
    const v = rng.int(105, 989) / 1000 + 0.00037;
    const neg = rng.chance(0.4);
    const rec = recordValue(v, round);
    const noZero = rec.slice(1);
    const raw = v.toFixed(round === 'tenth' ? 2 : 3);
    const cands: Cand[] = [
      { tex: `**${noZero}**`, key: 'nozero', mis: 'nr-leading-zero', feedback: 'Values between 0 and 1 must keep the 0 before the decimal point.' },
      { tex: `**${neg ? '-' + noZero : raw}**`, key: 'other', mis: neg ? 'nr-negative' : 'nr-rounding', feedback: neg ? 'The sign is printed for you, and the leading 0 is missing.' : `That is not rounded to the nearest ${round}.` },
      { tex: `**${v.toFixed(round === 'tenth' ? 2 : 3).slice(1)}**`, key: 'unround', mis: 'nr-rounding', feedback: `Round to the nearest ${round}, and keep the leading 0.` },
      { tex: `**${(+(v * 10 ** (round === 'tenth' ? 1 : 2)).toFixed(0))}**`, key: 'scaled', mis: 'nr-rounding', feedback: 'The decimal point must be recorded.' },
    ];
    return {
      cognitive: 'procedural',
      stem: `The answer to a numerical-response question is ${m((neg ? '-' : '') + v.toFixed(5))}, to be recorded to the nearest ${round}${neg ? ' (a negative sign is printed before the boxes)' : ''}. Which entry is recorded correctly?`,
      format: 'mc',
      choices: mc({ tex: `**${rec}**`, key: 'ok' }, cands),
      hints: ['Round first.', 'Values between 0 and 1 keep the 0.', neg ? 'A printed sign means you record only digits.' : 'The decimal point takes a box.'],
      solution: [{ tex: `To the nearest ${round}: ${m((neg ? '-' : '') + rec)}.` }, { tex: `Record **${rec}**${neg ? ', without the sign' : ''}.`, why: 'Leading 0 required; the decimal point is recorded.' }],
    };
  },
};

// ---------------------------------------------------------------- EXAM.directing-words

const dwDefinition: Generator = {
  id: 'dw-definition',
  nodeId: 'EXAM.directing-words',
  title: 'What a directing word asks for',
  make(rng): Draft {
    const core = ['Algebraically', 'Compare', 'Determine', 'Evaluate', 'Explain', 'Justify', 'Prove', 'Sketch', 'Verify', 'Describe', 'Solve', 'Interpret'];
    const pick = rng.pick(core);
    const w = DIRECTING_WORDS.find((d) => d.word === pick)!;
    const others = rng.shuffle(DIRECTING_WORDS.filter((d) => d.word !== w.word && d.word !== 'Solve' && d.word !== 'Conclude'));
    return {
      cognitive: 'conceptual',
      stem: `In a written-response question, what does **${w.word.toLowerCase()}** ask for?`,
      format: 'mc',
      choices: mc(
        { tex: w.def + '.', key: w.word },
        others.map((o) => ({ tex: o.def + '.', key: o.word, mis: 'wr-directing-word', feedback: `That is the definition of **${o.word.toLowerCase()}**.` })),
      ),
      hints: ['Directing words are bolded in written-response questions and have fixed meanings.', `Think about what a full-mark answer to "${w.word.toLowerCase()}" must contain.`, w.inPractice],
      solution: [{ tex: `**${w.word}**: ${w.def}.`, why: 'Official definition (Alberta Education and Childcare).' }, { tex: w.inPractice }],
    };
  },
};

export interface Scenario {
  word: string;
  task: string;
  meets: string;
  fails: { tex: string; why: string; mis?: string }[];
}

export const SCENARIOS: Scenario[] = [
  {
    word: 'Verify',
    task: 'Verify that $\\theta = \\frac{\\pi}{3}$ satisfies $\\cos 2\\theta = 2\\cos^2\\theta - 1$.',
    meets: 'Evaluates each side separately: L.S. $= \\cos\\frac{2\\pi}{3} = -\\frac{1}{2}$, R.S. $= 2\\left(\\frac{1}{2}\\right)^2 - 1 = -\\frac{1}{2}$, so L.S. = R.S.',
    fails: [
      { tex: 'Rewrites the left side using identities until it matches the right side.', why: 'That is a proof. Verify asks for substitution of the given value.' },
      { tex: 'Substitutes into the left side only and says "it works".', why: 'Both sides must be evaluated and shown equal.' },
      { tex: 'Graphs both sides and says the graphs overlap.', why: 'Overlapping graphs suggest an identity; the question asked for this particular value.' },
    ],
  },
  {
    word: 'Prove',
    task: 'Prove algebraically that $\\frac{\\sin 2\\theta}{1 + \\cos 2\\theta} = \\tan\\theta$.',
    meets: 'Works the left side alone: $\\frac{2\\sin\\theta\\cos\\theta}{2\\cos^2\\theta} = \\frac{\\sin\\theta}{\\cos\\theta} = \\tan\\theta$, then states L.S. = R.S.',
    fails: [
      { tex: 'Substitutes $\\theta = \\frac{\\pi}{4}$ and shows both sides equal 1.', why: 'One value verifies; it does not prove the statement for all permissible values.' },
      { tex: 'Cross-multiplies both sides at once and simplifies to $0 = 0$.', why: 'Working both sides as an equation assumes what you are proving.' },
      { tex: 'Shows the two graphs are identical on the calculator.', why: 'A graph is evidence, not an algebraic proof.' },
    ],
  },
  {
    word: 'Algebraically',
    task: 'Algebraically determine the solution of $2^{x+1} = 8^{x-1}$.',
    meets: 'Writes $2^{x+1} = 2^{3x-3}$, sets $x + 1 = 3x - 3$, and solves $x = 2$.',
    fails: [
      { tex: 'Graphs $y = 2^{x+1}$ and $y = 8^{x-1}$ and reads the intersection $x = 2$.', why: 'A graphical solution is not algebraic. It is good for checking only.' },
      { tex: 'Tries $x = 2$ in both sides and finds 8 = 8.', why: 'Guess and check is not an algebraic method.' },
      { tex: 'Writes "$x = 2$" with no work.', why: 'The method is the point of the question.' },
    ],
  },
  {
    word: 'Determine',
    task: 'Determine, to the nearest tenth of a year, how long an investment takes to double at 5% per year compounded annually.',
    meets: 'Writes $2 = 1.05^t$, takes logs to get $t = \\frac{\\log 2}{\\log 1.05} \\approx 14.2$ years.',
    fails: [
      { tex: 'Writes "$t \\approx 14.2$" only.', why: 'Determine needs the formula or procedure shown.' },
      { tex: 'Writes $2 = 1.05^t$ and $t = 14$.', why: 'Wrong degree of accuracy and missing units.' },
      { tex: 'Writes $t = \\frac{\\log 2}{\\log 1.05}$ and stops.', why: 'The answer must be given to the accuracy asked, with units.' },
    ],
  },
  {
    word: 'Explain',
    task: 'Explain why $y = \\log_2(x - 3)$ has no $y$-intercept.',
    meets: 'At $x = 0$, the argument is $-3$; a logarithm is defined only for positive arguments, so the graph never meets the $y$-axis (domain $x > 3$).',
    fails: [
      { tex: '"Because the graph doesn\'t touch the $y$-axis."', why: 'That restates the fact; it does not give the reason.' },
      { tex: '"Because there is a vertical asymptote."', why: 'Incomplete: the asymptote is at $x = 3$, and you must say why $x = 0$ is excluded.' },
      { tex: 'Draws the graph with no words.', why: 'Explain asks for the reason in words (with mathematics).' },
    ],
  },
  {
    word: 'Justify',
    task: 'Ali says $\\log(a + b) = \\log a + \\log b$. Is Ali correct? Justify your answer.',
    meets: 'No. With $a = b = 10$: $\\log 20 \\approx 1.30$ but $\\log 10 + \\log 10 = 2$. The law is $\\log(ab) = \\log a + \\log b$.',
    fails: [
      { tex: '"No, that\'s not a log law."', why: 'A claim with no supporting evidence or argument.' },
      { tex: '"Yes, logs split over addition."', why: 'Wrong conclusion.' },
      { tex: 'Tests $a = b = 10$ and concludes "Yes".', why: 'The evidence (1.30 vs 2) contradicts the conclusion.' },
    ],
  },
  {
    word: 'Compare',
    task: 'Compare the graphs of $y = \\sin x$ and $y = 3\\sin 2x$.',
    meets: 'Both have midline $y = 0$ and pass through the origin; $y = \\sin x$ has amplitude 1 and period $2\\pi$, while $y = 3\\sin 2x$ has amplitude 3 and period $\\pi$.',
    fails: [
      { tex: '"The second one is bigger."', why: 'Vague: no characteristics of both, no values.' },
      { tex: 'Lists the amplitude and period of $y = 3\\sin 2x$ only.', why: 'Compare needs the characteristics of both.' },
      { tex: 'Gives only differences (amplitude, period).', why: 'Compare asks for similarities and differences.' },
    ],
  },
  {
    word: 'Sketch',
    task: 'Sketch the graph of $y = \\frac{x - 1}{x + 2}$.',
    meets: 'Scaled axes; vertical asymptote $x = -2$ and horizontal asymptote $y = 1$ drawn dashed and labelled; intercepts $(1, 0)$ and $(0, -\\frac{1}{2})$ marked; both branches correct.',
    fails: [
      { tex: 'Correct branch shapes but no asymptotes labelled and no scale on the axes.', why: 'A sketch must show the key features with a scale.', mis: 'wr-sketch-features' },
      { tex: 'Plots a table of points and joins them across $x = -2$.', why: 'Joining across the asymptote is wrong; key features are missing.', mis: 'wr-sketch-features' },
      { tex: 'Draws asymptotes and intercepts but only the right branch.', why: 'Both branches are part of the graph.', mis: 'wr-sketch-features' },
    ],
  },
  {
    word: 'Evaluate',
    task: 'Evaluate ${}_8C_3$.',
    meets: '${}_8C_3 = \\frac{8!}{5!\\,3!} = 56$.',
    fails: [
      { tex: '${}_8C_3 = \\frac{8!}{5!\\,3!}$ (left unsimplified).', why: 'Evaluate means give the numerical value.' },
      { tex: '${}_8C_3 = 336$.', why: 'That is ${}_8P_3$: order was counted.' },
      { tex: 'Explains when to use combinations instead of permutations.', why: 'Explaining is not evaluating.' },
    ],
  },
  {
    word: 'Describe',
    task: 'Describe the transformations that map $y = f(x)$ onto $y = -2f(x - 3)$.',
    meets: 'A vertical stretch by a factor of 2 about the $x$-axis, a reflection in the $x$-axis, and a horizontal translation 3 units right.',
    fails: [
      { tex: '"Stretched, flipped and moved."', why: 'No factor, no axis, no direction or distance.' },
      { tex: 'Writes the mapping $(x, y) \\to (x + 3, -2y)$ only.', why: 'A mapping rule is not a written description.' },
      { tex: '"Stretch by 2, reflect, translate 3 left."', why: 'The translation is 3 right; the reflection axis is not named.' },
    ],
  },
];

const dwMeets: Generator = {
  id: 'dw-meets',
  nodeId: 'EXAM.directing-words',
  title: 'Which answer meets the standard?',
  make(rng): Draft {
    const s = rng.pick(SCENARIOS);
    return {
      cognitive: 'conceptual',
      stem: `${s.task.replace(s.word, `**${s.word}**`).replace(s.word.toLowerCase() + ' ', `**${s.word.toLowerCase()}** `)} Which response meets the standard for full marks?`,
      format: 'mc',
      choices: mc(
        { tex: s.meets, key: 'ok' },
        s.fails.map((f, i) => ({ tex: f.tex, key: i, mis: f.mis ?? 'wr-directing-word', feedback: f.why })),
      ),
      hints: [`What does **${s.word.toLowerCase()}** require?`, DIRECTING_WORDS.find((d) => d.word === s.word)!.inPractice, 'Rule out answers that do a different task or leave something out.'],
      solution: [{ tex: s.meets }, ...s.fails.map((f) => ({ tex: `Not: ${f.tex}`, why: f.why }))],
    };
  },
};

const RESPONSE_TYPES: { response: string; word: string }[] = [
  { response: 'Substitutes $x = \\frac{\\pi}{3}$ into each side of the equation and shows both sides equal $\\frac{1}{2}$.', word: 'Verify' },
  { response: 'Transforms the left side with identities, step by step, until it equals the right side, and states the non-permissible values.', word: 'Prove' },
  { response: 'Draws scaled axes, the curve, dashed labelled asymptotes and the intercepts.', word: 'Sketch' },
  { response: 'States that both functions have the same domain, and that one has range $y > 0$ while the other has range $y > 2$.', word: 'Compare' },
  { response: 'Rewrites both sides with base 3, equates the exponents and solves the linear equation.', word: 'Algebraically' },
  { response: 'Substitutes $t = 4$ into $h(t)$ and gives $h(4) = 12.5$ m.', word: 'Evaluate' },
  { response: 'Gives a counterexample with values showing the claim fails, and concludes the claim is false.', word: 'Justify' },
  { response: 'Says the value 17 in the model is the height of the axle above the ground, in metres.', word: 'Interpret' },
];

const dwWhichWord: Generator = {
  id: 'dw-which-word',
  nodeId: 'EXAM.directing-words',
  title: 'Which directing word was asked?',
  make(rng): Draft {
    const r = rng.pick(RESPONSE_TYPES);
    const others = rng.shuffle(['Verify', 'Prove', 'Sketch', 'Compare', 'Algebraically', 'Evaluate', 'Justify', 'Interpret', 'Explain', 'Describe'].filter((w) => w !== r.word));
    const d = DIRECTING_WORDS.find((x) => x.word === r.word)!;
    return {
      cognitive: 'conceptual',
      stem: `A full-mark response does exactly this: ${r.response} Which directing word was in the question?`,
      format: 'mc',
      choices: mc(
        { tex: `**${r.word}**`, key: r.word },
        others.map((w) => ({ tex: `**${w}**`, key: w, mis: 'wr-directing-word', feedback: DIRECTING_WORDS.find((x) => x.word === w)!.inPractice })),
      ),
      hints: ['Match the action in the response to a definition.', 'Substituting one value is different from proving for all values.', d.inPractice],
      solution: [{ tex: `**${r.word}**: ${d.def}.` }, { tex: d.inPractice }],
    };
  },
};

// ---------------------------------------------------------------- EXAM.wr-hygiene

interface Flaw {
  line: string;
  context: string;
  flaw: string;
  mis: string;
}
const FLAWS: Flaw[] = [
  { context: 'The question asks for the equation of the transformed function.', line: '$2(x - 3)^2 + 1$', flaw: 'It is an expression, not an equation: write $y = 2(x - 3)^2 + 1$.', mis: 'wr-expression-for-equation' },
  { context: 'The question asks for the height of a Ferris wheel car after 10 s, in metres.', line: '$h(10) = 23.4$', flaw: 'Units are missing: $23.4$ m.', mis: 'wr-units-missing' },
  { context: 'A student evaluates $-3^2$ intending the square of $-3$.', line: '$-3^2 = 9$', flaw: '$-3^2 = -9$; the square of $-3$ needs brackets: $(-3)^2 = 9$.', mis: 'wr-brackets' },
  { context: 'A student simplifies a trig equation.', line: '$2\\sin = 1$, so $\\sin = \\frac{1}{2}$', flaw: 'A trig function needs its argument: $\\sin\\theta = \\frac{1}{2}$.', mis: 'trig-argument-missing' },
  { context: 'A student applies a log law to $\\log(x + 2) - \\log x$.', line: '$\\log x + 2 - \\log x = 2$', flaw: 'Brackets dropped: $\\log(x + 2)$ is not $\\log x + 2$.', mis: 'wr-brackets' },
  { context: 'The question asks for the exact solutions of $\\cos x = \\frac{1}{2}$, $0 \\le x < 2\\pi$.', line: '$x \\approx 1.05, 5.24$', flaw: 'Exact values were asked: $x = \\frac{\\pi}{3}, \\frac{5\\pi}{3}$.', mis: 'wr-directing-word' },
  { context: 'The question asks for the time, in years, for a population to reach 5000.', line: '$t = 7.8$', flaw: 'Units are missing: $7.8$ years.', mis: 'wr-units-missing' },
  { context: 'A student writes the general term step for $(2x - 1)^5$.', line: '$t_{k+1} = {}_5C_k (2x)^{5-k} - 1^k$', flaw: 'The second term needs brackets with its sign: $(-1)^k$.', mis: 'wr-brackets' },
];

const hygieneFlaw: Generator = {
  id: 'wr-hygiene-flaw',
  nodeId: 'EXAM.wr-hygiene',
  title: 'Spot the written-response error',
  make(rng): Draft {
    const f = rng.pick(FLAWS);
    const generic: Cand[] = [
      { tex: 'Nothing; the line is complete and correct.', key: 'none', mis: f.mis, feedback: f.flaw },
      { tex: 'It should be rounded to the nearest hundredth.', key: 'round', mis: f.mis, feedback: 'Rounding is not the issue here.' },
      { tex: 'It needs a calculator screenshot.', key: 'calc', mis: f.mis, feedback: 'Calculator work is never required as evidence.' },
    ];
    return {
      cognitive: 'conceptual',
      stem: `${f.context} The final line reads ${f.line}. What would lose marks?`,
      format: 'mc',
      choices: mc({ tex: f.flaw, key: 'flaw' }, generic),
      hints: ['Read the line as a marker would: is it exactly what was asked?', 'Check: equation vs expression, units, brackets, trig arguments, exact vs approximate.', 'Small notation errors can cost the last mark of a part.'],
      solution: [{ tex: f.flaw, why: 'Markers score what is written, not what was meant.' }],
    };
  },
};

const hygieneBrackets: Generator = {
  id: 'wr-hygiene-brackets',
  nodeId: 'EXAM.wr-hygiene',
  title: 'Brackets change the value',
  make(rng): Draft {
    const a = rng.int(2, 6);
    const n = rng.pick([2, 4]);
    const right = -(a ** n);
    return {
      cognitive: 'procedural',
      stem: `Evaluate ${m(`-${a}^{${n}}`)}.`,
      format: 'input',
      fields: [field({ kind: 'number', value: right, tex: String(right) })],
      hints: ['Exponents come before the negative sign.', `${m(`-${a}^{${n}}`)} means ${m(`-(${a}^{${n}})`)}.`, `Only ${m(`(-${a})^{${n}}`)} would be positive.`],
      solution: [
        { tex: `${m(`-${a}^{${n}} = -(${a}^{${n}}) = ${right}`)}.`, why: 'The exponent applies to the base next to it, not to the sign.' },
        { tex: `Compare ${m(`(-${a})^{${n}} = ${a ** n}`)}. Write the brackets whenever a negative base is raised to a power.` },
      ],
    };
  },
};

const hygieneExact: Generator = {
  id: 'wr-hygiene-exact',
  nodeId: 'EXAM.wr-hygiene',
  title: 'Exact or approximate?',
  make(rng): Draft {
    const cases = [
      { q: 'Determine the **exact** value of $\\sin\\frac{5\\pi}{12}$.', ok: '$\\frac{\\sqrt{6} + \\sqrt{2}}{4}$', bad: ['$0.97$', '$0.9659$', '$\\sin 75^\\circ$'] },
      { q: 'Solve $2^x = 7$, giving an **exact** answer.', ok: '$x = \\frac{\\log 7}{\\log 2}$', bad: ['$x \\approx 2.81$', '$x = 2.807$', '$x = \\log 7 - \\log 2$'] },
      { q: 'Solve $3^{x} = 20$, to the nearest hundredth.', ok: '$x \\approx 2.73$', bad: ['$x = \\frac{\\log 20}{\\log 3}$', '$x \\approx 2.7$', '$x \\approx 2.726833$'] },
      { q: 'Determine the **exact** value of $\\cos\\frac{\\pi}{12}\\cos\\frac{\\pi}{4} - \\sin\\frac{\\pi}{12}\\sin\\frac{\\pi}{4}$.', ok: '$\\frac{1}{2}$', bad: ['$0.50$ (from the calculator)', '$\\cos\\frac{\\pi}{3}$', '$\\frac{\\sqrt{3}}{2}$'] },
    ];
    const c = rng.pick(cases);
    return {
      cognitive: 'conceptual',
      stem: `${c.q} Which final answer earns full marks?`,
      format: 'mc',
      choices: mc(
        { tex: c.ok, key: 'ok' },
        c.bad.map((b, i) => ({ tex: b, key: i, mis: 'wr-directing-word', feedback: 'Match the form the question asks for: exact means no decimals; a rounding instruction means a rounded decimal.' })),
      ),
      hints: ['Read the accuracy instruction.', 'Exact: fractions, radicals, π, logs. Approximate: a decimal rounded as asked.', 'An unevaluated expression like $\\sin 75^\\circ$ is not a final exact value.'],
      solution: [{ tex: `${c.ok}.`, why: 'Exact means simplified with no decimals; "to the nearest hundredth" means a decimal with two places.' }],
    };
  },
};

// ---------------------------------------------------------------- EXAM.sketch-standard

const FEATURE_SETS: { fn: string; need: string; missing: string[] }[] = [
  { fn: '$y = \\frac{2x}{x - 3}$', need: 'Asymptotes $x = 3$ and $y = 2$, the intercept $(0, 0)$, scaled axes', missing: ['Only the intercept $(0, 0)$ and the curve shape', 'The asymptote $x = 3$ and a scaled $x$-axis only', 'A table of values and scaled axes'] },
  { fn: '$y = (x + 2)^2(x - 1)$', need: 'Zeros $-2$ (touches) and $1$ (crosses), $y$-intercept $-4$, end behaviour, scaled axes', missing: ['The zeros only', 'The $y$-intercept and end behaviour only', 'The zeros, drawn crossing at both'] },
  { fn: '$y = 3\\sin 2x + 1$, $0 \\le x \\le 2\\pi$', need: 'Scaled axes in radians, maximum 4 and minimum $-2$, midline $y = 1$, period $\\pi$ shown, both endpoints', missing: ['The maximum and minimum only', 'The midline and one cycle', 'The curve with unscaled axes'] },
  { fn: '$y = \\log_2(x + 4)$', need: 'Asymptote $x = -4$, $x$-intercept $(-3, 0)$, $y$-intercept $(0, 2)$, scaled axes', missing: ['The $x$-intercept only', 'The asymptote only', 'The curve passing through $(1, 0)$'] },
  { fn: '$y = \\sqrt{x - 2} + 1$', need: 'Endpoint $(2, 1)$ (closed), the shape for $x > 2$, scaled axes', missing: ['A curve that starts at $(0, 1)$', 'An open circle at $(2, 1)$', 'The shape with no endpoint marked'] },
  { fn: '$y = \\frac{x^2 - 1}{x - 1}$', need: 'The line $y = x + 1$ with an open circle (hole) at $(1, 2)$, intercepts, scaled axes', missing: ['The line $y = x + 1$ with no hole', 'A vertical asymptote at $x = 1$', 'A closed point at $(1, 2)$'] },
];

const sketchFeatures: Generator = {
  id: 'sketch-features',
  nodeId: 'EXAM.sketch-standard',
  title: 'What a sketch must show',
  make(rng): Draft {
    const f = rng.pick(FEATURE_SETS);
    return {
      cognitive: 'conceptual',
      stem: `**Sketch** the graph of ${f.fn}. Which list gives everything a full-mark sketch shows?`,
      format: 'mc',
      choices: mc(
        { tex: f.need + '.', key: 'ok' },
        f.missing.map((x, i) => ({ tex: x + '.', key: i, mis: 'wr-sketch-features', feedback: 'A sketch shows every key feature with a scale.' })),
      ),
      hints: ['Sketch: scaled axes and every key feature.', 'Key features: intercepts, asymptotes, holes, endpoints, maximums and minimums.', 'An open circle marks a hole; a closed dot an included endpoint.'],
      solution: [{ tex: f.need + '.', why: 'Official definition of sketch: a drawing that represents the key features.' }],
    };
  },
};

const sketchHole: Generator = {
  id: 'sketch-hole',
  nodeId: 'EXAM.sketch-standard',
  title: 'Locate the hole to mark',
  make(rng): Draft {
    const a = rng.nz(-5, 5);
    const c = rng.int(-6, 6);
    if (c === a) throw new Reject();
    const k = rng.pick([1, 2, 3]);
    const y = k * (a - c);
    const pa = (s: number) => (s === 0 ? 'x' : `(x ${s > 0 ? '-' : '+'} ${Math.abs(s)})`);
    const kk = k === 1 ? '' : String(k);
    return {
      cognitive: 'procedural',
      stem: `A sketch of ${m(`y = \\frac{${kk}${pa(c)}${pa(a)}}{${pa(a)}}`)} must show the hole as an open circle. What are its coordinates?`,
      format: 'input',
      fields: [field({ kind: 'points', values: [[a, y]], tex: `(${a}, ${y})` }, '', 'Hole (x, y)')],
      hints: ['The common factor cancels, but its zero is still excluded from the domain.', `Cancel ${m(pa(a))}: the graph is ${m(`y = ${kk}${pa(c)}`)} with ${m(`x \\ne ${a}`)}.`, `Substitute ${m(`x = ${a}`)} into the simplified function.`],
      solution: [
        { tex: `Simplify: ${m(`y = ${kk}${pa(c)},\\ x \\ne ${a}`)}.` },
        { tex: `${m(`y(${a}) = ${((inner) => (kk ? `${kk}(${inner})` : inner))(c === 0 ? String(a) : `${a} ${c > 0 ? '-' : '+'} ${Math.abs(c)}`)} = ${y}`)}, so the open circle is at ${m(`(${a}, ${y})`)}.`, why: 'A sketch without the open circle misses a key feature.' },
      ],
      verify: () => y === k * (a - c),
    };
  },
};

const sketchAxes: Generator = {
  id: 'sketch-axes',
  nodeId: 'EXAM.sketch-standard',
  title: 'Scale the axes',
  make(rng): Draft {
    const amp = rng.int(2, 6);
    const b = rng.pick([2, 3, 4]);
    const d = rng.int(-3, 3);
    const piOver = (n: number, dd: number) => { const g = n % dd === 0 ? dd : dd % n === 0 ? n : 1; const [p, q] = [n / g, dd / g]; return `${q === 1 ? '' : '\\frac{'}${p === 1 ? '' : p}\\pi${q === 1 ? '' : `}{${q}}`}`; };
    const per = piOver(2, b);
    const step = piOver(1, 2 * b);
    const half = piOver(1, b);
    return {
      cognitive: 'conceptual',
      stem: `You sketch ${m(`y = ${amp}\\cos ${b}x${d < 0 ? ` - ${-d}` : d > 0 ? ` + ${d}` : ''}`)} for one period. Which ${m('x')}-axis scale lets you mark the maximums, minimums and midline crossings exactly on tick marks?`,
      format: 'mc',
      choices: mc({ tex: `Ticks every ${m(step)}`, key: 'q' }, [
        { tex: 'Ticks every 1', key: 'one', mis: 'wr-sketch-features', feedback: 'Key points are at fractions of $\\pi$, which fall between integer ticks.' },
        { tex: `Ticks every ${m(per)}`, key: 'per', mis: 'wr-sketch-features', feedback: 'That marks only the start and end of the period.' },
        b === 2
          ? { tex: `Ticks every ${m(half)}`, key: 'pi', mis: 'wr-sketch-features', feedback: 'That is half a period, so the midline crossings fall between ticks.' }
          : { tex: 'Ticks every $\\pi$', key: 'pi', mis: 'wr-sketch-features', feedback: `The period is ${m(per)}, so ticks every $\\pi$ skip the key points.` },
      ]),
      hints: [`Period ${m(per)}.`, 'Key points of a sinusoid are a quarter period apart.', `A quarter of ${m(per)} is ${m(step)}.`],
      solution: [{ tex: `Period ${m(`${per}`)}; quarter period ${m(step)}.`, why: 'Maximum, midline, minimum, midline, maximum are a quarter period apart.' }, { tex: `Ticks every ${m(step)}, with the range ${m(`[${d - amp}, ${d + amp}]`)} scaled on the y-axis.` }],
    };
  },
};

export const examSkillGenerators: Generator[] = [nrRecordValue, nrCodeAny, nrCodeOrder, nrWhichRecord, dwDefinition, dwMeets, dwWhichWord, hygieneFlaw, hygieneBrackets, hygieneExact, sketchFeatures, sketchHole, sketchAxes];
