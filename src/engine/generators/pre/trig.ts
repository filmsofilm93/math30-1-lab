// Prerequisite layer: reference angles and ratios of any angle (degrees), sine and cosine laws.
import { field, m, mc, type Cand } from '../../framework';
import { F } from '../../frac';
import type { Draft, Generator } from '../../types';
import { Reject } from '../../types';

const deg = (d: number) => `${d}^\\circ`;
const rad = (d: number) => (d * Math.PI) / 180;
const quadrant = (t: number) => {
  const a = ((t % 360) + 360) % 360;
  return a < 90 ? 1 : a < 180 ? 2 : a < 270 ? 3 : 4;
};
const refOf = (t: number) => {
  const a = ((t % 360) + 360) % 360;
  return [a, 180 - a, a - 180, 360 - a][quadrant(a) - 1];
};

// ---------------------------------------------------------------- P.ref-angle

const refAngle: Generator = {
  id: 'pre-ref-angle',
  nodeId: 'P.ref-angle',
  title: 'Reference angle',
  make(rng, tier): Draft {
    const r = rng.int(1, 17) * 5;
    const q = rng.int(2, 4);
    let t = [r, 180 - r, 180 + r, 360 - r][q - 1];
    if (tier === 3) t = rng.chance(0.5) ? t - 360 : t + 360;
    const std = ((t % 360) + 360) % 360;
    const formula = ['', `180^\\circ - ${deg(std)}`, `${deg(std)} - 180^\\circ`, `360^\\circ - ${deg(std)}`][q - 1];
    return {
      cognitive: 'procedural',
      stem: `Determine the reference angle for ${m(`\\theta = ${deg(t)}`)}. Answer in degrees.`,
      format: 'input',
      fields: [field({ kind: 'number', value: r, tex: String(r), exact: true }, '\\theta_R =')],
      hints: ['The reference angle is the acute angle between the terminal arm and the $x$-axis.', tier === 3 ? 'First find a coterminal angle between $0^\\circ$ and $360^\\circ$.' : `${m(deg(t))} is in quadrant ${q === 2 ? 'II' : q === 3 ? 'III' : 'IV'}.`, `${m(`\\theta_R = ${formula}`)}`],
      solution: [
        ...(tier === 3 ? [{ tex: `Coterminal angle: ${m(`${deg(t)} ${t < 0 ? '+' : '-'} 360^\\circ = ${deg(std)}`)}.`, why: 'Adding or subtracting a full turn does not move the terminal arm.' }] : []),
        { tex: `${m(deg(std))} is in quadrant ${q === 2 ? 'II' : q === 3 ? 'III' : 'IV'}.` },
        { tex: `${m(`\\theta_R = ${formula} = ${deg(r)}`)}`, why: 'Measure to the nearest part of the $x$-axis, never the $y$-axis.' },
      ],
      verify: () => refOf(t) === r,
    };
  },
};

type Exact = { tex: string; v: number };
const EX: Record<string, Record<number, Exact>> = {
  sin: { 30: { tex: '\\frac{1}{2}', v: 0.5 }, 45: { tex: '\\frac{\\sqrt{2}}{2}', v: Math.SQRT1_2 }, 60: { tex: '\\frac{\\sqrt{3}}{2}', v: Math.sqrt(3) / 2 } },
  cos: { 30: { tex: '\\frac{\\sqrt{3}}{2}', v: Math.sqrt(3) / 2 }, 45: { tex: '\\frac{\\sqrt{2}}{2}', v: Math.SQRT1_2 }, 60: { tex: '\\frac{1}{2}', v: 0.5 } },
  tan: { 30: { tex: '\\frac{\\sqrt{3}}{3}', v: 1 / Math.sqrt(3) }, 45: { tex: '1', v: 1 }, 60: { tex: '\\sqrt{3}', v: Math.sqrt(3) } },
};
const neg = (e: Exact): Exact => ({ tex: `-${e.tex}`, v: -e.v });
const signOf = (fn: string, q: number) => (q === 1 ? 1 : fn === 'sin' ? (q === 2 ? 1 : -1) : fn === 'cos' ? (q === 4 ? 1 : -1) : q === 3 ? 1 : -1);
const signed = (e: Exact, s: number) => (s > 0 ? e : neg(e));

const refExact: Generator = {
  id: 'pre-ref-exact',
  nodeId: 'P.ref-angle',
  title: 'Exact trig values of any angle',
  make(rng, tier): Draft {
    const fn = rng.pick(['sin', 'cos', 'tan']);
    const r = rng.pick([30, 60]);
    const q = tier === 1 ? rng.pick([2, 4]) : rng.int(2, 4);
    const t = [r, 180 - r, 180 + r, 360 - r][q - 1];
    const s = signOf(fn, q);
    const ans = signed(EX[fn][r], s);
    const other = fn === 'sin' ? 'cos' : fn === 'cos' ? 'sin' : 'tan';
    const swapped = fn === 'tan' ? EX.tan[90 - r] : EX[other][r];
    const opt = (e: Exact, mis: string, feedback?: string): Cand => ({ tex: m(e.tex), key: e.v, mis, feedback });
    const cands: Cand[] = [
      opt(signed(EX[fn][r], -s), 'trig-cast-sign', `In quadrant ${['I', 'II', 'III', 'IV'][q - 1]}, ${m(`\\${fn}`)} is ${s > 0 ? 'positive' : 'negative'} (CAST).`),
      opt(signed(swapped, s), fn === 'tan' ? 'ref-angle-measure-y' : 'trig-exact-swap', fn === 'tan' ? `That is ${m(`\\tan ${deg(90 - r)}`)}; the reference angle is ${m(deg(r))}.` : `That is the exact value of ${m(`\\${other} ${deg(r)}`)}.`),
      opt(signed(swapped, -s), 'trig-cast-sign'),
    ];
    return {
      cognitive: 'procedural',
      stem: `Determine the exact value of ${m(`\\${fn} ${deg(t)}`)}.`,
      format: 'mc',
      choices: mc({ tex: m(ans.tex), key: ans.v }, cands),
      hints: ['Find the reference angle and the quadrant.', `The reference angle is ${m(deg(r))}; the angle is in quadrant ${['I', 'II', 'III', 'IV'][q - 1]}.`, `CAST: in quadrant ${['I', 'II', 'III', 'IV'][q - 1]} only ${['all', 'sine', 'tangent', 'cosine'][q - 1]} ${q === 1 ? 'are' : 'is'} positive.`],
      solution: [
        { tex: `${m(deg(t))} is in quadrant ${['I', 'II', 'III', 'IV'][q - 1]} with reference angle ${m(deg(r))}.` },
        { tex: `${m(`\\${fn} ${deg(r)} = ${EX[fn][r].tex}`)}`, why: 'Exact values come from the 30-60-90 triangle with sides 1, √3, 2.' },
        { tex: `${m(`\\${fn}`)} is ${s > 0 ? 'positive' : 'negative'} there, so ${m(`\\${fn} ${deg(t)} = ${ans.tex}`)}.` },
      ],
      verify: () => Math.abs(Math[fn as 'sin' | 'cos' | 'tan'](rad(t)) - ans.v) < 1e-9,
    };
  },
};

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
];

const refPoint: Generator = {
  id: 'pre-ref-point',
  nodeId: 'P.ref-angle',
  title: 'Trig ratios from a point on the terminal arm',
  make(rng, tier): Draft {
    const [p, q0, r] = rng.pick(TRIPLES);
    const swap = rng.chance(0.5);
    const q = tier === 1 ? 2 : rng.int(2, 4);
    const sx = q === 2 || q === 3 ? -1 : 1;
    const sy = q === 3 || q === 4 ? -1 : 1;
    const x = sx * (swap ? q0 : p);
    const y = sy * (swap ? p : q0);
    const fn = rng.pick(['sin', 'cos', 'tan']);
    const val = fn === 'sin' ? F(y, r) : fn === 'cos' ? F(x, r) : F(y, x);
    const cands: Cand[] = [
      { tex: m(val.neg().tex()), key: -val.value, mis: 'trig-cast-sign', feedback: `Use the signs of the coordinates: $x = ${x}$, $y = ${y}$.` },
      ...(fn === 'sin' ? [{ v: F(x, r), mis: 'trig-ratio-swap', fb: '$\\sin\\theta = \\frac{y}{r}$, not $\\frac{x}{r}$.' }, { v: F(y, x), mis: 'trig-ratio-swap', fb: undefined }] : fn === 'cos' ? [{ v: F(y, r), mis: 'trig-ratio-swap', fb: '$\\cos\\theta = \\frac{x}{r}$.' }, { v: F(x, y), mis: 'trig-ratio-swap', fb: undefined }] : [{ v: F(x, y), mis: 'trig-ratio-swap', fb: '$\\tan\\theta = \\frac{y}{x}$.' }, { v: F(y, r), mis: 'trig-ratio-swap', fb: undefined }]).map((c) => ({ tex: m(c.v.tex()), key: c.v.value, mis: c.mis, feedback: c.fb })),
      { tex: m(val.abs().tex()), key: Math.abs(val.value) + (val.value > 0 ? 1e-7 : 0), mis: 'trig-cast-sign' },
    ];
    const ratio = fn === 'sin' ? '\\frac{y}{r}' : fn === 'cos' ? '\\frac{x}{r}' : '\\frac{y}{x}';
    return {
      cognitive: 'procedural',
      stem: `The point ${m(`(${x}, ${y})`)} is on the terminal arm of angle ${m('\\theta')} in standard position. Determine the exact value of ${m(`\\${fn}\\theta`)}.`,
      format: 'mc',
      choices: mc({ tex: m(val.tex()), key: val.value }, cands),
      hints: [fn === 'tan' ? '$\\tan\\theta = \\frac{y}{x}$.' : 'First find $r = \\sqrt{x^2 + y^2}$.', `${m(`r = \\sqrt{${x * x} + ${y * y}} = ${r}`)}`, `${m(`\\${fn}\\theta = ${ratio}`)}`],
      solution: [
        { tex: `${m(`r = \\sqrt{(${x})^2 + (${y})^2} = ${r}`)}`, why: '$r$ is a distance, so it is always positive.' },
        { tex: `${m(`\\${fn}\\theta = ${ratio} = ${val.tex()}`)}`, why: 'The signs of $x$ and $y$ give the sign of the ratio automatically.' },
      ],
      verify: () => Math.abs(Math[fn as 'sin' | 'cos' | 'tan'](Math.atan2(y, x)) - val.value) < 1e-9,
    };
  },
};

// ---------------------------------------------------------------- P.sine-cos-law

const lawSine: Generator = {
  id: 'pre-law-sine',
  nodeId: 'P.sine-cos-law',
  title: 'Sine law',
  make(rng, tier): Draft {
    const A = rng.int(6, 16) * 5;
    const B = rng.int(4, 18) * 5;
    if (A + B >= 165 || A === B) throw new Reject();
    const a = rng.int(5, 30);
    if (tier === 3) {
      // find acute B given a, b < a, A: unique solution
      const b = rng.int(3, a - 1);
      const Bv = (Math.asin((b * Math.sin(rad(A))) / a) * 180) / Math.PI;
      return {
        cognitive: 'procedural',
        stem: `In ${m('\\triangle ABC')}, ${m(`\\angle A = ${deg(A)}`)}, ${m(`a = ${a}`)} cm and ${m(`b = ${b}`)} cm. Determine ${m('\\angle B')} to the nearest tenth of a degree.`,
        format: 'input',
        fields: [field({ kind: 'number', value: Bv, tex: Bv.toFixed(1), round: 'tenth' }, '\\angle B =')],
        hints: ['You know a side and its opposite angle: use the sine law.', `${m(`\\frac{\\sin B}{${b}} = \\frac{\\sin ${deg(A)}}{${a}}`)}`, 'Make sure your calculator is in degree mode.'],
        solution: [
          { tex: `${m(`\\frac{\\sin B}{b} = \\frac{\\sin A}{a} \\Rightarrow \\sin B = \\frac{${b}\\sin ${deg(A)}}{${a}}`)}`, why: 'Put the unknown angle in the numerator to solve for it.' },
          { tex: `${m(`B = \\sin^{-1}\\left(\\frac{${b}\\sin ${deg(A)}}{${a}}\\right) \\approx ${Bv.toFixed(1)}^\\circ`)}`, why: `Since $b < a$, $B < A$, so $B$ is acute and there is only one triangle.` },
        ],
      };
    }
    const b = (a * Math.sin(rad(B))) / Math.sin(rad(A));
    const C = 180 - A - B;
    const findC = tier === 2 && rng.chance(0.5);
    const c = (a * Math.sin(rad(C))) / Math.sin(rad(A));
    const want = findC ? c : b;
    const name = findC ? 'c' : 'b';
    return {
      cognitive: 'procedural',
      stem: `In ${m('\\triangle ABC')}, ${m(`\\angle A = ${deg(A)}`)}, ${m(`\\angle B = ${deg(B)}`)} and ${m(`a = ${a}`)} cm. Determine ${m(name)} to the nearest tenth of a centimetre.`,
      format: 'input',
      fields: [field({ kind: 'number', value: want, tex: want.toFixed(1), round: 'tenth' }, `${name} =`)],
      hints: ['Two angles and a side: use the sine law.', findC ? `First find ${m(`\\angle C = 180^\\circ - ${deg(A)} - ${deg(B)}`)}.` : `${m(`\\frac{b}{\\sin B} = \\frac{a}{\\sin A}`)}`, `${m(`${name} = \\frac{${a}\\sin ${deg(findC ? C : B)}}{\\sin ${deg(A)}}`)}`],
      solution: [
        ...(findC ? [{ tex: `${m(`\\angle C = 180^\\circ - ${deg(A)} - ${deg(B)} = ${deg(C)}`)}`, why: 'Angles in a triangle add to $180^\\circ$.' }] : []),
        { tex: `${m(`\\frac{${name}}{\\sin ${deg(findC ? C : B)}} = \\frac{${a}}{\\sin ${deg(A)}}`)}`, why: 'Each side is paired with the angle opposite it.' },
        { tex: `${m(`${name} = \\frac{${a}\\sin ${deg(findC ? C : B)}}{\\sin ${deg(A)}} \\approx ${want.toFixed(1)}`)} cm`, why: 'Degree mode; round only at the end.' },
      ],
    };
  },
};

const lawCos: Generator = {
  id: 'pre-law-cos',
  nodeId: 'P.sine-cos-law',
  title: 'Cosine law',
  make(rng, tier): Draft {
    const b = rng.int(4, 20);
    const c = rng.int(4, 20);
    if (tier === 3) {
      const a = rng.int(Math.abs(b - c) + 1, b + c - 1);
      const A = (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI;
      return {
        cognitive: 'procedural',
        stem: `In ${m('\\triangle ABC')}, ${m(`a = ${a}`)} m, ${m(`b = ${b}`)} m and ${m(`c = ${c}`)} m. Determine ${m('\\angle A')} to the nearest tenth of a degree.`,
        format: 'input',
        fields: [field({ kind: 'number', value: A, tex: A.toFixed(1), round: 'tenth' }, '\\angle A =')],
        hints: ['Three sides: use the cosine law.', `${m('\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}')}`, `${m(`\\cos A = \\frac{${b * b} + ${c * c} - ${a * a}}{${2 * b * c}}`)}`],
        solution: [
          { tex: `${m(`\\cos A = \\frac{${b}^2 + ${c}^2 - ${a}^2}{2(${b})(${c})} = \\frac{${b * b + c * c - a * a}}{${2 * b * c}}`)}`, why: 'Rearranged cosine law; $a$ is the side opposite the angle you want.' },
          { tex: `${m(`A = \\cos^{-1}\\left(\\frac{${b * b + c * c - a * a}}{${2 * b * c}}\\right) \\approx ${A.toFixed(1)}^\\circ`)}`, why: 'Inverse cosine gives the correct angle even when it is obtuse.' },
        ],
      };
    }
    const A = rng.int(tier === 1 ? 6 : 4, tier === 1 ? 17 : 30) * 5;
    if (A >= 170) throw new Reject();
    const a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(rad(A)));
    return {
      cognitive: 'procedural',
      stem: `In ${m('\\triangle ABC')}, ${m(`b = ${b}`)} m, ${m(`c = ${c}`)} m and ${m(`\\angle A = ${deg(A)}`)}. Determine ${m('a')} to the nearest tenth of a metre.`,
      format: 'input',
      fields: [field({ kind: 'number', value: a, tex: a.toFixed(1), round: 'tenth' }, 'a =')],
      hints: ['Two sides and the angle between them: use the cosine law.', `${m('a^2 = b^2 + c^2 - 2bc\\cos A')}`, `${m(`a^2 = ${b * b} + ${c * c} - ${2 * b * c}\\cos ${deg(A)}`)}`],
      solution: [
        { tex: `${m(`a^2 = ${b}^2 + ${c}^2 - 2(${b})(${c})\\cos ${deg(A)}`)}`, why: 'The angle is between the two known sides, so the sine law cannot start.' },
        { tex: `${m(`a^2 \\approx ${(a * a).toFixed(2)}`)}, so ${m(`a \\approx ${a.toFixed(1)}`)} m.`, why: 'Compute $2bc\\cos A$ as one product before subtracting.' },
      ],
    };
  },
};

const lawChoose: Generator = {
  id: 'pre-law-choose',
  nodeId: 'P.sine-cos-law',
  title: 'Choose the right law',
  make(rng, tier): Draft {
    const s1 = rng.int(5, 15);
    const s2 = rng.int(5, 15);
    const s3 = rng.int(Math.abs(s1 - s2) + 1, s1 + s2 - 1);
    const A = rng.int(7, 16) * 5;
    const B = rng.int(5, 15) * 5;
    if (A + B >= 170 || s1 === s2) throw new Reject();
    let stem: string;
    let right: string;
    let cands: Cand[];
    if (tier === 1) {
      stem = `In ${m('\\triangle ABC')}, ${m(`\\angle A = ${deg(A)}`)}, ${m(`\\angle B = ${deg(B)}`)} and ${m(`a = ${s1}`)}. Which equation can be used to find ${m('b')}?`;
      right = `\\frac{b}{\\sin ${deg(B)}} = \\frac{${s1}}{\\sin ${deg(A)}}`;
      cands = [
        { tex: m(`\\frac{b}{\\sin ${deg(A)}} = \\frac{${s1}}{\\sin ${deg(B)}}`), key: 'pair', mis: 'law-sine-pairing', feedback: 'Each side goes with the angle opposite it: $b$ with $B$, $a$ with $A$.' },
        { tex: m(`b^2 = ${s1}^2 + c^2 - 2(${s1})c\\cos ${deg(B)}`), key: 'cos', mis: 'law-wrong-law', feedback: 'This has two unknowns ($b$ and $c$). With two angles and a side, the sine law works directly.' },
        { tex: m(`\\frac{b}{\\sin ${deg(180 - A - B)}} = \\frac{${s1}}{\\sin ${deg(A)}}`), key: 'C', mis: 'law-sine-pairing', feedback: `${m(deg(180 - A - B))} is angle $C$, which is opposite $c$, not $b$.` },
      ];
    } else if (tier === 2) {
      stem = `In ${m('\\triangle ABC')}, ${m(`b = ${s1}`)}, ${m(`c = ${s2}`)} and ${m(`\\angle A = ${deg(A)}`)}. Which equation can be used to find ${m('a')}?`;
      right = `a^2 = ${s1}^2 + ${s2}^2 - 2(${s1})(${s2})\\cos ${deg(A)}`;
      cands = [
        { tex: m(`a^2 = ${s1}^2 + ${s2}^2 + 2(${s1})(${s2})\\cos ${deg(A)}`), key: 'plus', mis: 'law-cos-sign', feedback: 'The cosine law subtracts $2bc\\cos A$.' },
        { tex: m(`a^2 = \\left(${s1}^2 + ${s2}^2 - 2(${s1})(${s2})\\right)\\cos ${deg(A)}`), key: 'bracket', mis: 'law-cos-sign', feedback: 'Only the $2bc$ term is multiplied by $\\cos A$.' },
        { tex: m(`\\frac{a}{\\sin ${deg(A)}} = \\frac{${s1}}{\\sin B}`), key: 'sine', mis: 'law-wrong-law', feedback: '$\\angle B$ is unknown, so the sine law has two unknowns here.' },
      ];
    } else {
      stem = `In ${m('\\triangle ABC')}, ${m(`a = ${s3}`)}, ${m(`b = ${s1}`)} and ${m(`c = ${s2}`)}. Which equation can be used to find ${m('\\angle A')}?`;
      right = `\\cos A = \\frac{${s1}^2 + ${s2}^2 - ${s3}^2}{2(${s1})(${s2})}`;
      cands = [
        { tex: m(`\\cos A = \\frac{${s3}^2 + ${s1}^2 - ${s2}^2}{2(${s3})(${s1})}`), key: 'pair', mis: 'law-sine-pairing', feedback: 'That formula gives the angle opposite $c$. For $A$, the side subtracted is $a$.' },
        { tex: m(`\\cos A = \\frac{${s1}^2 + ${s2}^2 + ${s3}^2}{2(${s1})(${s2})}`), key: 'plus', mis: 'law-cos-sign' },
        { tex: m(`\\frac{\\sin A}{${s3}} = \\frac{\\sin B}{${s1}}`), key: 'sine', mis: 'law-wrong-law', feedback: 'No angle is known yet, so the sine law cannot start.' },
      ];
    }
    return {
      cognitive: 'conceptual',
      stem,
      format: 'mc',
      choices: mc({ tex: m(right), key: 'ok' }, cands),
      hints: ['Sine law needs a side and its opposite angle. Cosine law handles two sides with the included angle, or three sides.', 'Check which pieces are known.', tier === 1 ? 'You know $a$ and $A$: a matching pair.' : tier === 2 ? 'The known angle is between the known sides.' : 'Three sides and no angles.'],
      solution: [
        { tex: tier === 1 ? 'A side and its opposite angle are known, so use the sine law.' : tier === 2 ? 'Two sides and the included angle: cosine law.' : 'Three sides: cosine law, rearranged for the angle.' },
        { tex: `${m(right)}` },
      ],
    };
  },
};

export const preTrigGenerators: Generator[] = [refAngle, refExact, refPoint, lawSine, lawCos, lawChoose];
