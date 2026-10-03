// T1 angles and arc length, T2 unit circle, T3 trigonometric ratios.
import { field, m, mc, pkey } from '../../framework';
import { F } from '../../frac';
import type { AnswerSpec, Draft, Generator } from '../../types';
import { Reject } from '../../types';
import { rounded } from '../u3/shared';
import { angleSet, angTex, degTex, exact, type Exact, type Fn, isSpecial, norm, PI, QNAME, quadrant, rad, radTex, refAngle, solveSpecial, SPECIAL, SPECIAL_NONAXIS } from './shared';

type R = Parameters<Generator['make']>[0];
const exNum = (e: Exact): AnswerSpec => ({ kind: 'number', value: e.value, tex: e.tex, exact: true });
const radNum = (d: number): AnswerSpec => ({ kind: 'number', value: rad(d), tex: radTex(d), exact: true });
const degNum = (d: number): AnswerSpec => ({ kind: 'number', value: d, tex: String(d), exact: true });
const fnTex = (fn: Fn, arg: string) => (arg.startsWith('-') ? `\\${fn}\\left(${arg}\\right)` : `\\${fn} ${arg}`);
/** A special angle in [0, 360) not on an axis, optionally restricted to quadrants. */
const specialAngle = (rng: R, qs = [1, 2, 3, 4]) => rng.pick(SPECIAL_NONAXIS.filter((d) => qs.includes(quadrant(d))));

// ---------------------------------------------------------------- T1.radians

const radToRad: Generator = {
  id: 'u4-rad-to-rad',
  nodeId: 'T1.radians',
  title: 'Degrees to radians',
  make(rng, tier): Draft {
    const d = tier === 1 ? rng.pick(SPECIAL.filter((x) => x > 0)) : tier === 2 ? rng.pick([-1, 1]) * rng.pick(SPECIAL_NONAXIS) + rng.pick([0, 360]) : rng.pick([20, 40, 50, 70, 80, 100, 140, 160, 200, 260, 320, 10, 75, 105, 165]);
    if (d === 0) throw new Reject();
    const f = F(d, 180);
    return {
      cognitive: 'procedural',
      stem: `Convert ${m(degTex(d))} to radians. Give an exact answer.`,
      format: 'input',
      fields: [field(radNum(d), '\\theta =')],
      hints: ['$180^\\circ = \\pi$ radians.', `Multiply by ${m('\\frac{\\pi}{180^\\circ}')}.`, `${m(`\\frac{${d}}{180} = ${f.tex()}`)}.`],
      solution: [
        { tex: m(`${degTex(d)} \\times \\frac{\\pi}{180^\\circ} = \\frac{${d}\\pi}{180}`), why: 'Multiply by π/180 to go from degrees to radians.' },
        { tex: m(`= ${radTex(d)}`), why: 'Reduce the fraction.' },
      ],
    };
  },
};

const radToDeg: Generator = {
  id: 'u4-rad-to-deg',
  nodeId: 'T1.radians',
  title: 'Radians to degrees',
  make(rng, tier): Draft {
    if (tier === 3) {
      const r = rng.int(5, 60) / 10;
      const v = (r * 180) / PI;
      const spec = rounded(v, 1);
      return {
        cognitive: 'procedural',
        stem: `Convert ${m(`${r}`)} radians to degrees, to the nearest tenth of a degree.`,
        format: 'input',
        fields: [field({ ...spec, tex: spec.tex }, '\\theta =', 'Degrees')],
        hints: ['$\\pi$ radians $= 180^\\circ$.', `Multiply by ${m('\\frac{180^\\circ}{\\pi}')}.`, 'Use the calculator value of $\\pi$, round at the end.'],
        solution: [{ tex: m(`${r} \\times \\frac{180^\\circ}{\\pi} \\approx ${spec.tex}^\\circ`), why: 'One radian is about 57.3°.' }],
      };
    }
    const d = tier === 1 ? rng.pick(SPECIAL.filter((x) => x > 0)) : rng.pick([-1, 1]) * (rng.pick(SPECIAL_NONAXIS) + rng.pick([0, 360]));
    return {
      cognitive: 'procedural',
      stem: `Convert ${m(radTex(d))} to degrees.`,
      format: 'input',
      fields: [field(degNum(d), '\\theta =', 'Degrees')],
      hints: ['$\\pi = 180^\\circ$.', 'Replace $\\pi$ with $180^\\circ$ and simplify.', `${m(`${radTex(d).replace('\\pi', '(180^\\circ)')}`)}.`],
      solution: [{ tex: m(`${radTex(d)} \\times \\frac{180^\\circ}{\\pi} = ${degTex(d)}`), why: 'Multiply by 180/π to go from radians to degrees.' }],
    };
  },
};

const radMc: Generator = {
  id: 'u4-rad-mc',
  nodeId: 'T1.radians',
  title: 'Choose the equivalent angle',
  make(rng, tier): Draft {
    const d = tier === 1 ? rng.pick([30, 45, 60, 120, 135, 150]) : rng.pick([210, 225, 240, 300, 315, 330, -150, -120, 405, 480]);
    const f = F(d, 180);
    if (f.d === 1) throw new Reject();
    const flip = F(f.d, f.n);
    const toRad = tier !== 3 || rng.chance(0.5);
    if (toRad) {
      return {
        cognitive: 'procedural',
        stem: `Which is equal to ${m(degTex(d))}?`,
        format: 'mc',
        choices: mc({ tex: m(radTex(d)), key: rad(d) }, [
          { tex: m(`\\frac{${Math.abs(flip.n) === 1 ? '' : Math.abs(flip.n)}\\pi}{${flip.d}}`.replace(/^/, flip.n < 0 ? '-' : '')), key: (flip.value * PI), mis: 'trig-rad-convert-inverse', feedback: 'Degrees to radians: multiply by $\\frac{\\pi}{180}$, so the fraction is degrees over 180.' },
          { tex: m(radTex(180 - d)), key: rad(180 - d), mis: 'ref-angle-180' },
          { tex: m(radTex(360 - d)), key: rad(360 - d), mis: 'ref-angle-180' },
          { tex: m(`${d}\\pi`), key: d * PI, mis: 'trig-deg-rad-mode' },
        ]),
        hints: ['$180^\\circ = \\pi$.', `${m(`\\frac{${d}}{180}`)} of a half-turn.`, 'Reduce the fraction.'],
        solution: [{ tex: m(`${degTex(d)} = \\frac{${d}}{180}\\pi = ${radTex(d)}`) }],
      };
    }
    return {
      cognitive: 'procedural',
      stem: `Which is equal to ${m(radTex(d))}?`,
      format: 'mc',
      choices: mc({ tex: m(degTex(d)), key: d }, [
        { tex: m(degTex(180 - d)), key: 180 - d, mis: 'ref-angle-180' },
        { tex: m(degTex(d + 180)), key: d + 180, mis: 'trig-coterminal-180' },
        { tex: m(degTex(360 - d)), key: 360 - d, mis: 'ref-angle-180' },
        { tex: m(degTex(Math.round(2 * d))), key: 2 * d, mis: 'trig-rad-convert-inverse' },
      ]),
      hints: ['$\\pi = 180^\\circ$.', 'Substitute $180^\\circ$ for $\\pi$.', 'Simplify.'],
      solution: [{ tex: m(`${radTex(d)} = ${degTex(d)}`), why: 'Replace π with 180°.' }],
    };
  },
};

// ---------------------------------------------------------------- T1.coterminal

const cotMc: Generator = {
  id: 'u4-cot-mc',
  nodeId: 'T1.coterminal',
  title: 'Recognise a coterminal angle',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.6);
    const d = rng.pick(SPECIAL_NONAXIS);
    const k = rng.pick(tier === 3 ? [-2, 2, 3] : [-1, 1]);
    const ans = d + 360 * k;
    return {
      cognitive: 'conceptual',
      stem: `Which angle is coterminal with ${m(angTex(d, inRad))}?`,
      format: 'mc',
      choices: mc({ tex: m(angTex(ans, inRad)), key: ans }, [
        { tex: m(angTex(d + 180, inRad)), key: d + 180, mis: 'trig-coterminal-180', feedback: 'Coterminal angles differ by a full turn, 360° or 2π.' },
        { tex: m(angTex(d - 180, inRad)), key: d - 180, mis: 'trig-coterminal-180' },
        { tex: m(angTex(-d, inRad)), key: -d, mis: 'ref-angle-180', feedback: 'The negative of an angle reflects it in the x-axis.' },
        { tex: m(angTex(360 - d, inRad)), key: 360 - d, mis: 'ref-angle-180' },
      ]),
      hints: ['Coterminal angles share a terminal arm.', `Add or subtract ${m(inRad ? '2\\pi' : '360^\\circ')}.`, `Check: the difference must be a whole number of turns.`],
      solution: [{ tex: m(`${angTex(ans, inRad)} = ${angTex(d, inRad)} ${k > 0 ? '+' : '-'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}(${inRad ? '2\\pi' : '360^\\circ'})`), why: 'A whole number of full turns.' }],
    };
  },
};

const cotDomain: Generator = {
  id: 'u4-cot-domain',
  nodeId: 'T1.coterminal',
  title: 'Coterminal angles in a domain',
  make(rng, tier): Draft {
    const inRad = tier > 1;
    const d = tier === 3 ? rng.pick(SPECIAL_NONAXIS) + 360 * rng.pick([1, -1]) : rng.pick(SPECIAL_NONAXIS);
    const [lo, hi] = rng.pick([[-360, 360], [-720, 360], [0, 720], [-360, 720]] as const);
    const all: number[] = [];
    for (let k = -4; k <= 4; k++) {
      const v = norm(d) + 360 * k;
      if (v >= lo && v < hi && v !== d) all.push(v);
    }
    const dom = inRad ? `${radTex(lo)} \\le \\theta < ${radTex(hi)}` : `${degTex(lo)} \\le \\theta < ${degTex(hi)}`;
    const spec = angleSet(all, inRad);
    return {
      cognitive: 'procedural',
      stem: `List all angles coterminal with ${m(angTex(d, inRad))} in the domain ${m(dom)}, other than ${m(angTex(d, inRad))} itself.`,
      format: 'input',
      fields: [field(spec, '\\theta =', 'Angles, separated by commas')],
      hints: [`Add and subtract ${m(inRad ? '2\\pi' : '360^\\circ')} repeatedly.`, 'Keep going in both directions until you leave the domain.', 'Watch the endpoints: $\\le$ includes, $<$ excludes.'],
      solution: [
        { tex: `${m(angTex(d, inRad))} ${m(`\\pm ${inRad ? '2\\pi' : '360^\\circ'}`)} gives ${m(listTex(all, inRad))}.` },
        { tex: `Only these lie in ${m(dom)}.`, why: 'Values outside the domain are not listed.' },
      ],
    };
  },
};
const listTex = (ds: number[], inRad: boolean) => [...ds].sort((a, b) => a - b).map((x) => angTex(x, inRad)).join(', ');

const cotGeneral: Generator = {
  id: 'u4-cot-general',
  nodeId: 'T1.coterminal',
  title: 'General form of coterminal angles',
  make(rng, tier): Draft {
    const inRad = tier !== 1;
    const d = tier === 3 ? rng.pick(SPECIAL_NONAXIS) + 360 * rng.pick([1, 2, -1]) : rng.pick(SPECIAL_NONAXIS);
    const P = inRad ? 2 * PI : 360;
    const r = norm(d);
    const tex = inRad ? `${radTex(r)} + 2\\pi n` : `${degTex(r)} + 360^\\circ n`;
    return {
      cognitive: 'procedural',
      stem: `Write an expression in general form for all angles coterminal with ${m(angTex(d, inRad))}${tier === 3 ? ', using the angle in $[0, 2\\pi)$ as the starting value' : ''}.`,
      format: 'input',
      fields: [field({ kind: 'general', roots: [inRad ? rad(r) : r], period: P, tex, deg: !inRad }, '\\theta =', 'Use n for an integer')],
      hints: ['Coterminal angles differ by whole turns.', `Write ${m(inRad ? '\\theta + 2\\pi n' : '\\theta \\pm 360^\\circ n')}, ${m('n \\in I')}.`, tier === 3 ? `First reduce ${m(angTex(d, inRad))} into one turn.` : 'Any one coterminal angle can be the starting value.'],
      solution: [
        ...(r !== d ? [{ tex: m(`${angTex(d, inRad)} ${d > r ? '-' : '+'} ${Math.abs(d - r) / 360 === 1 ? '' : Math.abs(d - r) / 360}(${inRad ? '2\\pi' : '360^\\circ'}) = ${angTex(r, inRad)}`) }] : []),
        { tex: m(`\\theta = ${tex},\\ n \\in I`), why: 'Every whole number of turns, in either direction.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- T1.reference

const refRad: Generator = {
  id: 'u4-ref-rad',
  nodeId: 'T1.reference',
  title: 'Reference angle in radians',
  make(rng, tier): Draft {
    const d = tier === 1 ? specialAngle(rng, [2, 3, 4]) : tier === 2 ? specialAngle(rng) + 360 * rng.pick([1, -1]) : -specialAngle(rng);
    const r = refAngle(d);
    const q = quadrant(d);
    return {
      cognitive: 'procedural',
      stem: `Determine the reference angle for ${m(`\\theta = ${radTex(d)}`)}.`,
      format: 'input',
      fields: [field(radNum(r), '\\theta_R =')],
      hints: ['The reference angle is the acute angle to the $x$-axis.', `${m(radTex(d))} is in quadrant ${QNAME[q]}.`, ((t, co) => (q === 2 ? `${m(`\\theta_R = \\pi - ${t}`)}${co}` : q === 3 ? `${m(`\\theta_R = ${t} - \\pi`)}${co}` : q === 4 ? `${m(`\\theta_R = 2\\pi - ${t}`)}${co}` : `Quadrant I: the angle is its own reference angle${co}`))(radTex(((d % 360) + 360) % 360), d >= 0 && d < 360 ? '.' : ', using the coterminal angle in one turn.')],
      solution: [
        ...(norm(d) !== d ? [{ tex: `Coterminal angle in one turn: ${m(radTex(norm(d)))}.` }] : []),
        { tex: `Quadrant ${QNAME[q]}: ${m(`\\theta_R = ${radTex(r)}`)}.`, why: 'Measure to the nearest part of the x-axis.' },
      ],
    };
  },
};

const refMc: Generator = {
  id: 'u4-ref-mc',
  nodeId: 'T1.reference',
  title: 'Choose the reference angle',
  make(rng, tier): Draft {
    const base = rng.pick([20, 35, 40, 50, 65, 70, 25, 80, 15]);
    const q = rng.int(2, 4);
    let d = [0, base, 180 - base, 180 + base, 360 - base][q];
    if (tier === 3) d -= 360;
    else if (tier === 2) d += 360;
    return {
      cognitive: 'conceptual',
      stem: `What is the reference angle of ${m(degTex(d))}?`,
      format: 'mc',
      choices: mc({ tex: m(degTex(base)), key: base }, [
        { tex: m(degTex(90 - base)), key: 90 - base, mis: 'ref-angle-measure-y', feedback: 'Measure to the x-axis, not the y-axis.' },
        { tex: m(degTex(norm(d))), key: norm(d), mis: 'trig-ref-angle-value' },
        { tex: m(degTex(Math.abs(norm(d) - 180))), key: Math.abs(norm(d) - 180) + 0.5, mis: 'ref-angle-180' },
        { tex: m(degTex(180 - base)), key: 180 - base, mis: 'ref-angle-180' },
      ]),
      hints: ['Find the coterminal angle in $[0^\\circ, 360^\\circ)$ first.', `${m(degTex(norm(d)))} is in quadrant ${QNAME[q]}.`, 'The reference angle is between the terminal arm and the $x$-axis.'],
      solution: [
        ...(norm(d) !== d ? [{ tex: `Coterminal: ${m(degTex(norm(d)))}.` }] : []),
        { tex: `Quadrant ${QNAME[q]}, so ${m(`\\theta_R = ${['', '', '180^\\circ - \\theta', '\\theta - 180^\\circ', '360^\\circ - \\theta'][q]} = ${degTex(base)}`)}.` },
      ],
    };
  },
};

const refFind: Generator = {
  id: 'u4-ref-angles-with',
  nodeId: 'T1.reference',
  title: 'Angles with a given reference angle',
  make(rng, tier): Draft {
    const r = rng.pick([30, 45, 60]);
    const qs = tier === 1 ? [1, 2, 3, 4] : rng.shuffle([1, 2, 3, 4]).slice(0, 2).sort();
    const ds = qs.map((q) => [0, r, 180 - r, 180 + r, 360 - r][q]);
    const inRad = tier !== 1;
    const qText = tier === 1 ? 'all angles' : `the angles in quadrants ${qs.map((q) => QNAME[q]).join(' and ')}`;
    return {
      cognitive: 'procedural',
      stem: `Determine ${qText} in ${m(inRad ? '0 \\le \\theta < 2\\pi' : '0^\\circ \\le \\theta < 360^\\circ')} with reference angle ${m(angTex(r, inRad))}.`,
      format: 'input',
      fields: [field(angleSet(ds, inRad), '\\theta =', 'Angles, separated by commas')],
      hints: ['Each quadrant has exactly one such angle in one turn.', `QII: ${m(inRad ? '\\pi - \\theta_R' : '180^\\circ - \\theta_R')}; QIII: ${m(inRad ? '\\pi + \\theta_R' : '180^\\circ + \\theta_R')}; QIV: ${m(inRad ? '2\\pi - \\theta_R' : '360^\\circ - \\theta_R')}.`, `${m(`\\theta_R = ${angTex(r, inRad)}`)}.`],
      solution: qs.map((q) => ({ tex: `Quadrant ${QNAME[q]}: ${m(angTex(ds[qs.indexOf(q)], inRad))}` })),
    };
  },
};

// ---------------------------------------------------------------- T1.arc-length

const arcLength: Generator = {
  id: 'u4-arc-length',
  nodeId: 'T1.arc-length',
  title: 'Arc length, radius or angle',
  make(rng, tier): Draft {
    const r = rng.int(3, 25);
    const deg = tier === 2;
    const thetaRad = deg ? rng.pick([40, 75, 110, 135, 200, 250]) : rng.int(5, 40) / 10;
    const th = deg ? rad(thetaRad) : thetaRad;
    const a = r * th;
    if (tier === 3) {
      const findR = rng.chance(0.5);
      const A = rng.int(8, 60);
      const v = findR ? A / th : A / r;
      const spec = rounded(v, 1);
      return {
        cognitive: 'procedural',
        stem: findR ? `An arc of length ${A} cm subtends a central angle of ${thetaRad} radians. What is the radius, to the nearest tenth of a centimetre?` : `An arc of length ${A} cm is on a circle of radius ${r} cm. What is the central angle in radians, to the nearest tenth?`,
        format: 'input',
        fields: [field(spec, findR ? 'r =' : '\\theta =', findR ? 'Centimetres' : 'Radians')],
        hints: ['$a = r\\theta$ with $\\theta$ in radians.', findR ? 'Solve for $r$: $r = \\frac{a}{\\theta}$.' : 'Solve for $\\theta$: $\\theta = \\frac{a}{r}$.', 'Round at the end.'],
        solution: [{ tex: m(findR ? `r = \\frac{${A}}{${thetaRad}} \\approx ${spec.tex}` : `\\theta = \\frac{${A}}{${r}} \\approx ${spec.tex}`), why: '$a = r\\theta$ rearranged.' }],
      };
    }
    const spec = rounded(a, 1);
    return {
      cognitive: 'procedural',
      stem: `A circle has radius ${r} cm. What is the length of the arc subtended by a central angle of ${deg ? m(degTex(thetaRad)) : `${thetaRad} radians`}, to the nearest tenth of a centimetre?`,
      format: 'input',
      fields: [field(spec, 'a =', 'Centimetres')],
      hints: ['$a = r\\theta$, with $\\theta$ in radians.', deg ? `Convert first: ${m(`${degTex(thetaRad)} = ${radTex(thetaRad)}`)}.` : 'Substitute directly.', `${m(`a = ${r}\\theta`)}.`],
      solution: [
        ...(deg ? [{ tex: m(`${degTex(thetaRad)} = ${radTex(thetaRad)}`), why: 'The formula needs radians.' }] : []),
        { tex: m(`a = ${r}\\left(${deg ? radTex(thetaRad) : thetaRad}\\right) \\approx ${spec.tex}`) },
      ],
    };
  },
};

const arcMc: Generator = {
  id: 'u4-arc-mc',
  nodeId: 'T1.arc-length',
  title: 'Set up an arc length',
  make(rng, tier): Draft {
    const r = rng.int(4, 12);
    const d = rng.pick(tier === 1 ? [60, 90, 120, 45] : [150, 135, 210, 240, 300, 72]);
    const ans = r * rad(d);
    const f = F(d * r, 180);
    const t = (v: number) => m(`${+v.toFixed(2)}\\text{ cm}`);
    return {
      cognitive: 'procedural',
      stem: `A sector of radius ${r} cm has central angle ${m(degTex(d))}. What is its arc length (to the nearest hundredth)?`,
      format: 'mc',
      choices: mc({ tex: t(ans), key: +ans.toFixed(2) }, [
        { tex: t(r * d), key: r * d, mis: 'trig-arc-degrees', feedback: '$a = r\\theta$ only works with $\\theta$ in radians.' },
        { tex: t(d / r), key: +(d / r).toFixed(2), mis: 'trig-arc-degrees' },
        { tex: t(rad(d) / r), key: +(rad(d) / r).toFixed(2), mis: 'trig-arc-degrees' },
        { tex: t(2 * PI * r), key: +(2 * PI * r).toFixed(2), mis: 'trig-arc-degrees' },
      ]),
      hints: ['Convert the angle to radians.', `${m(`${degTex(d)} = ${radTex(d)}`)}.`, '$a = r\\theta$.'],
      solution: [{ tex: m(`a = ${r} \\cdot ${radTex(d)} = ${f.tex().replace(/(\d+)/, '$1')}\\pi \\approx ${ans.toFixed(2)}\\text{ cm}`) }],
      verify: () => Math.abs(ans - (f.value * PI)) < 1e-9,
    };
  },
};

const arcContext: Generator = {
  id: 'u4-arc-context',
  nodeId: 'T1.arc-length',
  title: 'Arc length in context',
  make(rng, tier): Draft {
    const r = rng.pick([30, 35, 40, 45, 60]);
    if (tier === 3) {
      const rpm = rng.pick([12, 15, 20, 30]);
      const sec = rng.pick([10, 15, 20, 45]);
      const v = (2 * PI * r * rpm * sec) / 60 / 100;
      const spec = rounded(v, 1);
      return {
        cognitive: 'problemSolving',
        stem: `A wheel of radius ${r} cm turns at ${rpm} revolutions per minute. How far, in metres to the nearest tenth, does a point on the rim travel in ${sec} s?`,
        format: 'input',
        fields: [field(spec, 'd =', 'Metres')],
        hints: [`Revolutions in ${sec} s: ${m(`${rpm} \\times \\frac{${sec}}{60}`)}.`, 'Each revolution is $2\\pi$ radians: $\\theta = 2\\pi \\times$ revolutions.', '$a = r\\theta$, then convert cm to m.'],
        solution: [
          { tex: m(`\\theta = 2\\pi \\cdot ${rpm} \\cdot \\frac{${sec}}{60} = ${F(2 * rpm * sec, 60).tex()}\\pi`), why: 'Angle turned, in radians.' },
          { tex: m(`a = ${r}\\cdot ${F(2 * rpm * sec, 60).tex()}\\pi \\approx ${(v * 100).toFixed(1)}\\text{ cm} \\approx ${spec.tex}\\text{ m}`) },
        ],
      };
    }
    const rev = tier === 1 ? rng.pick([0.25, 0.5, 0.75, 1.5]) : rng.pick([2.5, 3.25, 1.75, 4.5]);
    const v = 2 * PI * r * rev;
    const spec = rounded(v, 1);
    return {
      cognitive: 'problemSolving',
      stem: `A bicycle wheel has radius ${r} cm. How far does the bicycle move when the wheel turns ${rev} revolution${rev === 1 ? '' : 's'}, to the nearest tenth of a centimetre?`,
      format: 'input',
      fields: [field(spec, 'd =', 'Centimetres')],
      hints: ['One revolution $= 2\\pi$ radians.', `${m(`\\theta = 2\\pi(${rev}) = ${2 * rev}\\pi`)}.`, '$a = r\\theta$.'],
      solution: [{ tex: m(`\\theta = ${2 * rev}\\pi`), why: 'Revolutions to radians.' }, { tex: m(`a = ${r}(${2 * rev}\\pi) \\approx ${spec.tex}\\text{ cm}`) }],
    };
  },
};

// ---------------------------------------------------------------- T2.unit-circle-eq

const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];

const ucMissing: Generator = {
  id: 'u4-uc-missing',
  nodeId: 'T2.unit-circle-eq',
  title: 'Missing coordinate on the unit circle',
  make(rng, tier): Draft {
    const q = rng.int(1, 4);
    const sx = q === 1 || q === 4 ? 1 : -1;
    const sy = q <= 2 ? 1 : -1;
    const giveX = rng.chance(0.5);
    let given: Exact, want: Exact;
    let wsq: string;
    if (tier < 3) {
      const [a, b, c] = rng.pick(TRIPLES);
      const [p, s] = rng.chance(0.5) ? [a, b] : [b, a];
      const gx = F(sx * p, c), gy = F(sy * s, c);
      [given, want] = giveX ? [{ tex: gx.tex(), value: gx.value }, { tex: gy.tex(), value: gy.value }] : [{ tex: gy.tex(), value: gy.value }, { tex: gx.tex(), value: gx.value }];
      wsq = F(giveX ? s * s : p * p, c * c).tex();
    } else {
      // x = 1/k → y = √(k² − 1)/k, simplified
      const k = rng.pick([3, 4, 5, 6, 7]);
      const rad2 = k * k - 1;
      let outside = 1;
      let inside = rad2;
      for (let f = 2; f * f <= inside; f++) while (inside % (f * f) === 0) { inside /= f * f; outside *= f; }
      const g = F(outside, k);
      const otherS = giveX ? sy : sx;
      const ownS = giveX ? sx : sy;
      given = { tex: `${ownS < 0 ? '-' : ''}\\frac{1}{${k}}`, value: ownS / k };
      const numer = `${g.n === 1 ? '' : g.n}\\sqrt{${inside}}`;
      want = { tex: `${otherS < 0 ? '-' : ''}${g.d === 1 ? numer : `\\frac{${numer}}{${g.d}}`}`, value: (otherS * Math.sqrt(rad2)) / k };
      wsq = F(rad2, k * k).tex();
    }
    const [gv, wv] = giveX ? ['x', 'y'] : ['y', 'x'];
    return {
      cognitive: 'procedural',
      stem: `The point ${m(`P(\\theta)`)} is on the unit circle in quadrant ${QNAME[q]}, and its ${m(gv)}-coordinate is ${m(given.tex)}. What is its ${m(wv)}-coordinate?`,
      format: 'input',
      fields: [field(exNum(want), `${wv} =`)],
      hints: ['$x^2 + y^2 = 1$.', `${m(`${wv}^2 = 1 - \\left(${given.tex}\\right)^2`)}.`, `Quadrant ${QNAME[q]} decides the sign of ${m(wv)}.`],
      solution: [
        { tex: m(`${wv}^2 = 1 - \\left(${given.tex}\\right)^2 = ${wsq}`), why: 'Unit circle equation.' },
        { tex: m(`${wv} = ${want.tex}`), why: `In quadrant ${QNAME[q]}, ${wv} is ${want.value > 0 ? 'positive' : 'negative'}.` },
      ],
      verify: () => Math.abs(given.value ** 2 + want.value ** 2 - 1) < 1e-9,
    };
  },
};

const ucPtheta: Generator = {
  id: 'u4-uc-ptheta',
  nodeId: 'T2.unit-circle-eq',
  title: 'Ratios from P(θ)',
  make(rng, tier): Draft {
    const [a, b, c] = rng.pick(TRIPLES);
    const q = rng.int(1, 4);
    const x = F((q === 1 || q === 4 ? 1 : -1) * a, c);
    const y = F((q <= 2 ? 1 : -1) * b, c);
    const fn = rng.pick((tier === 1 ? ['sin', 'cos'] : tier === 2 ? ['sin', 'cos', 'tan'] : ['tan', 'sec', 'csc', 'cot']) as Fn[]);
    const val = { sin: y, cos: x, tan: y.div(x), csc: F(y.d, y.n), sec: F(x.d, x.n), cot: x.div(y) }[fn];
    const swap = { sin: x, cos: y, tan: x.div(y), csc: F(x.d, x.n), sec: F(y.d, y.n), cot: y.div(x) }[fn];
    return {
      cognitive: 'conceptual',
      stem: `${m(`P(\\theta) = \\left(${x.tex()}, ${y.tex()}\\right)`)} is on the unit circle. What is ${m(`\\${fn}\\theta`)}?`,
      format: 'mc',
      choices: mc({ tex: m(val.tex()), key: val.value }, [
        { tex: m(swap.tex()), key: swap.value, mis: 'trig-unit-xy-swap', feedback: '$P(\\theta) = (\\cos\\theta, \\sin\\theta)$: $x$ first.' },
        { tex: m(val.neg().tex()), key: -val.value, mis: 'trig-cast-sign' },
        { tex: m(F(val.d, val.n).tex()), key: 1 / val.value, mis: 'trig-reciprocal-inverse' },
        { tex: m(swap.neg().tex()), key: -swap.value, mis: 'trig-unit-xy-swap' },
      ]),
      hints: ['$P(\\theta) = (\\cos\\theta, \\sin\\theta)$.', '$\\tan\\theta = \\frac{y}{x}$; the reciprocals flip these.', `Here ${m(`x = ${x.tex()}`)}, ${m(`y = ${y.tex()}`)}.`],
      solution: [{ tex: m(`\\${fn}\\theta = ${{ sin: 'y', cos: 'x', tan: '\\frac{y}{x}', csc: '\\frac{1}{y}', sec: '\\frac{1}{x}', cot: '\\frac{x}{y}' }[fn]} = ${val.tex()}`), why: 'On the unit circle r = 1.' }],
    };
  },
};

const ucSymmetry: Generator = {
  id: 'u4-uc-symmetry',
  nodeId: 'T2.unit-circle-eq',
  title: 'Symmetric points on the unit circle',
  make(rng, tier): Draft {
    const [a, b, c] = rng.pick(TRIPLES);
    const x = F(a, c), y = F(b, c);
    const kinds = tier === 1 ? ['pi'] : tier === 2 ? ['pi', 'neg', 'pi-'] : ['pi-', 'neg', 'half'];
    const k = rng.pick(kinds);
    const [X, Y, label, why] = {
      pi: [x.neg(), y.neg(), '\\theta + \\pi', 'Half a turn: both coordinates change sign.'],
      neg: [x, y.neg(), '-\\theta', 'Reflection in the x-axis: y changes sign.'],
      'pi-': [x.neg(), y, '\\pi - \\theta', 'Reflection in the y-axis: x changes sign.'],
      half: [y.neg(), x, '\\theta + \\frac{\\pi}{2}', 'A quarter turn counterclockwise sends (x, y) to (−y, x).'],
    }[k] as [typeof x, typeof x, string, string];
    return {
      cognitive: 'conceptual',
      stem: `${m(`P(\\theta) = \\left(${x.tex()}, ${y.tex()}\\right)`)}. What are the coordinates of ${m(`P\\left(${label}\\right)`)}?`,
      format: 'input',
      fields: [field({ kind: 'points', values: [[X.value, Y.value]], tex: `\\left(${X.tex()}, ${Y.tex()}\\right)` }, '', 'Point (x, y)')],
      hints: ['Sketch $\\theta$ in quadrant I, then the new angle.', 'Use symmetry of the circle.', why],
      solution: [{ tex: m(`P\\left(${label}\\right) = \\left(${X.tex()}, ${Y.tex()}\\right)`), why }],
    };
  },
};

// ---------------------------------------------------------------- T2.special-points

const spCoord: Generator = {
  id: 'u4-sp-coord',
  nodeId: 'T2.special-points',
  title: 'Exact coordinates of P(θ)',
  make(rng, tier): Draft {
    const d = tier === 1 ? specialAngle(rng, [1]) : tier === 2 ? rng.pick(SPECIAL) : specialAngle(rng) + 360 * rng.pick([-1, 1]);
    const c = exact('cos', d)!, s = exact('sin', d)!;
    return {
      cognitive: 'procedural',
      stem: `Determine the exact coordinates of ${m(`P\\left(${radTex(d)}\\right)`)} on the unit circle.`,
      format: 'input',
      fields: [field({ kind: 'points', values: [[c.value, s.value]], tex: `\\left(${c.tex}, ${s.tex}\\right)` }, '', 'Point (x, y)')],
      hints: ['$P(\\theta) = (\\cos\\theta, \\sin\\theta)$.', `Reference angle ${m(radTex(refAngle(d)))}; quadrant ${quadrant(d) ? QNAME[quadrant(d)] : 'on an axis'}.`, 'Use the reference triangle values, then CAST signs.'],
      solution: [
        { tex: `Reference angle ${m(radTex(refAngle(d)))}${quadrant(d) ? `, quadrant ${QNAME[quadrant(d)]}` : ''}.` },
        { tex: m(`P\\left(${radTex(d)}\\right) = \\left(${c.tex}, ${s.tex}\\right)`), why: 'Signs follow the quadrant.' },
      ],
    };
  },
};

const spMc: Generator = {
  id: 'u4-sp-mc',
  nodeId: 'T2.special-points',
  title: 'Choose the coordinates',
  make(rng, tier): Draft {
    const d = tier === 1 ? specialAngle(rng, [1, 2]) : specialAngle(rng);
    const r = refAngle(d);
    if (r === 45 && tier < 3) throw new Reject();
    const c = exact('cos', d)!, s = exact('sin', d)!;
    const pt = (a: Exact, b: Exact) => m(`\\left(${a.tex}, ${b.tex}\\right)`);
    const n = (e: Exact): Exact => ({ tex: e.tex.startsWith('-') ? e.tex.slice(1) : `-${e.tex}`, value: -e.value });
    return {
      cognitive: 'procedural',
      stem: `Which point is ${m(`P\\left(${radTex(d)}\\right)`)}?`,
      format: 'mc',
      choices: mc({ tex: pt(c, s), key: pkey(c.value, s.value) }, [
        { tex: pt(s, c), key: pkey(s.value, c.value), mis: 'trig-unit-xy-swap', feedback: 'The x-coordinate is cos θ.' },
        { tex: pt(n(c), s), key: pkey(-c.value, s.value), mis: 'trig-cast-sign' },
        { tex: pt(c, n(s)), key: pkey(c.value, -s.value), mis: 'trig-cast-sign' },
        { tex: pt(n(s), n(c)), key: pkey(-s.value, -c.value), mis: 'trig-special-value' },
      ]),
      hints: ['$P(\\theta) = (\\cos\\theta, \\sin\\theta)$.', `Quadrant ${QNAME[quadrant(d)]} signs.`, r === 30 ? 'At $\\frac{\\pi}{6}$ the x-coordinate is the larger one, $\\frac{\\sqrt{3}}{2}$.' : r === 60 ? 'At $\\frac{\\pi}{3}$ the y-coordinate is the larger one, $\\frac{\\sqrt{3}}{2}$.' : 'At $\\frac{\\pi}{4}$ both are $\\frac{\\sqrt{2}}{2}$ in size.'],
      solution: [{ tex: m(`P\\left(${radTex(d)}\\right) = \\left(${c.tex}, ${s.tex}\\right)`), why: `Reference angle $${radTex(r)}$ in quadrant ${QNAME[quadrant(d)]}.` }],
    };
  },
};

const spAngle: Generator = {
  id: 'u4-sp-angle',
  nodeId: 'T2.special-points',
  title: 'Angle from exact coordinates',
  make(rng, tier): Draft {
    const d = tier === 1 ? specialAngle(rng, [1, 2]) : rng.pick(SPECIAL);
    const c = exact('cos', d)!, s = exact('sin', d)!;
    const inRad = tier !== 1;
    return {
      cognitive: 'procedural',
      stem: `${m(`P(\\theta) = \\left(${c.tex}, ${s.tex}\\right)`)} on the unit circle, with ${m(inRad ? '0 \\le \\theta < 2\\pi' : '0^\\circ \\le \\theta < 360^\\circ')}. What is ${m('\\theta')}?`,
      format: 'input',
      fields: [field(inRad ? radNum(d) : degNum(d), '\\theta =')],
      hints: ['The signs of $x$ and $y$ give the quadrant.', 'The sizes of the coordinates give the reference angle.', `Reference angle ${m(angTex(refAngle(d), inRad))}.`],
      solution: [
        { tex: quadrant(d) ? `Signs put ${m('P(\\theta)')} in quadrant ${QNAME[quadrant(d)]}; reference angle ${m(angTex(refAngle(d), inRad))}.` : `The point is on an axis.` },
        { tex: m(`\\theta = ${angTex(d, inRad)}`) },
      ],
    };
  },
};

// ---------------------------------------------------------------- T3.exact-ratios

const exValue: Generator = {
  id: 'u4-ex-value',
  nodeId: 'T3.exact-ratios',
  title: 'Exact value of a trig ratio',
  make(rng, tier): Draft {
    const fn = rng.pick((tier === 1 ? ['sin', 'cos', 'tan'] : tier === 2 ? ['sin', 'cos', 'tan'] : ['csc', 'sec', 'cot']) as Fn[]);
    const d = tier === 1 ? specialAngle(rng, [1]) : tier === 2 ? specialAngle(rng) : rng.pick(SPECIAL) + (rng.chance(0.3) ? -360 : 0);
    const inRad = tier > 1 && rng.chance(0.7);
    const e = exact(fn, d);
    if (!e) throw new Reject();
    const base = { csc: 'sin', sec: 'cos', cot: 'tan' }[fn as 'csc'] ?? fn;
    return {
      cognitive: 'procedural',
      stem: `Determine the exact value of ${m(fnTex(fn, angTex(d, inRad)))}.`,
      format: 'input',
      fields: [field(exNum(e), '')],
      hints: [`Reference angle ${m(angTex(refAngle(d), inRad))}.`, quadrant(d) ? `Quadrant ${QNAME[quadrant(d)]}: use CAST for the sign.` : 'The angle is on an axis: use the point on the unit circle.', fn !== base ? `${m(`\\${fn}\\theta = \\frac{1}{\\${base}\\theta}`)}${fn === 'cot' ? ' $= \\frac{\\cos\\theta}{\\sin\\theta}$' : ''}.` : 'Use the special-triangle value.'],
      solution: [
        ...(fn !== base ? [{ tex: exact(base as Fn, d) ? m(`${fnTex(base as Fn, angTex(d, inRad))} = ${exact(base as Fn, d)!.tex}`) : `${m(fnTex(base as Fn, angTex(d, inRad)))} is not defined, so use ${m('\\cot\\theta = \\frac{\\cos\\theta}{\\sin\\theta}')}.` }] : []),
        { tex: m(`${fnTex(fn, angTex(d, inRad))} = ${e.tex}`), why: fn !== base ? 'Take the reciprocal and rationalise.' : 'Reference value with the CAST sign.' },
      ],
    };
  },
};

const exMc: Generator = {
  id: 'u4-ex-mc',
  nodeId: 'T3.exact-ratios',
  title: 'Choose the exact value',
  make(rng, tier): Draft {
    const fn = rng.pick((tier === 3 ? ['csc', 'sec'] : ['sin', 'cos']) as Fn[]);
    const d = specialAngle(rng, tier === 1 ? [1, 2] : [2, 3, 4]);
    if (refAngle(d) === 45) throw new Reject();
    const e = exact(fn, d)!;
    const other = exact(fn === 'sin' ? 'cos' : fn === 'cos' ? 'sin' : fn === 'csc' ? 'sec' : 'csc', d)!;
    const neg = (x: Exact): Exact => ({ tex: x.tex.startsWith('-') ? x.tex.slice(1) : `-${x.tex}`, value: -x.value });
    const base = exact(fn === 'csc' ? 'sin' : fn === 'sec' ? 'cos' : fn, d)!;
    const inRad = tier > 1;
    return {
      cognitive: 'procedural',
      stem: `What is the exact value of ${m(fnTex(fn, angTex(d, inRad)))}?`,
      format: 'mc',
      choices: mc({ tex: m(e.tex), key: e.value }, [
        { tex: m(other.tex), key: other.value, mis: fn === 'csc' || fn === 'sec' ? 'trig-reciprocal-inverse' : 'trig-exact-swap', feedback: 'Check which special value belongs to which ratio.' },
        { tex: m(neg(e).tex), key: -e.value, mis: 'trig-cast-sign' },
        { tex: m(neg(other).tex), key: -other.value, mis: 'trig-special-value' },
        ...(fn === 'csc' || fn === 'sec' ? [{ tex: m(base.tex), key: base.value, mis: 'trig-reciprocal-inverse', feedback: `${fn} is the reciprocal of ${fn === 'csc' ? 'sin' : 'cos'}.` }] : []),
      ]),
      hints: ['Find the reference angle and quadrant.', 'CAST gives the sign.', fn === 'csc' || fn === 'sec' ? 'Reciprocal of sine or cosine.' : 'Special triangle values.'],
      solution: [{ tex: m(`${fnTex(fn, angTex(d, inRad))} = ${e.tex}`), why: `Reference angle $${angTex(refAngle(d), inRad)}$, quadrant ${QNAME[quadrant(d)]}.` }],
    };
  },
};

const exExpr: Generator = {
  id: 'u4-ex-expr',
  nodeId: 'T3.exact-ratios',
  title: 'Evaluate an expression exactly',
  make(rng, tier): Draft {
    const a = rng.pick(tier === 1 ? [30, 60, 45] : SPECIAL_NONAXIS);
    const b = rng.pick(tier === 1 ? [30, 60, 90, 0] : SPECIAL);
    const forms = [
      { tex: (A: string, B: string) => `\\sin^2 ${A} + \\cos ${B}`, v: () => exact('sin', a)!.value ** 2 + exact('cos', b)!.value },
      { tex: (A: string, B: string) => `2\\sin ${A}\\cos ${A} - \\sin ${B}`, v: () => 2 * exact('sin', a)!.value * exact('cos', a)!.value - exact('sin', b)!.value },
      { tex: (A: string, B: string) => `\\tan^2 ${A} + \\cos^2 ${B}`, v: () => (exact('tan', a)?.value ?? NaN) ** 2 + exact('cos', b)!.value ** 2 },
    ];
    const f = rng.pick(forms);
    const v = f.v();
    if (!Number.isFinite(v)) throw new Reject();
    // keep answers rational or a simple radical
    const candidates = [0, 1, 2, 3, 4, 0.5, 1.5, 2.5, 0.25, 0.75, 1.25, 3.5, -0.5, -1, -0.25, -0.75, 4 / 3, 1 / 3, 2 / 3, 5 / 4];
    let tex: string | null = null;
    for (const c of candidates) if (Math.abs(c - v) < 1e-9) tex = F(Math.round(c * 12), 12).tex();
    const radForms: [number, string][] = [[Math.sqrt(3) / 2, '\\frac{\\sqrt{3}}{2}'], [-Math.sqrt(3) / 2, '-\\frac{\\sqrt{3}}{2}'], [0.5 + Math.sqrt(3) / 2, '\\frac{1 + \\sqrt{3}}{2}'], [0.5 - Math.sqrt(3) / 2, '\\frac{1 - \\sqrt{3}}{2}']];
    for (const [c, t] of radForms) if (!tex && Math.abs(c - v) < 1e-9) tex = t;
    if (!tex) throw new Reject();
    const inRad = tier > 1;
    const A = angTex(a, inRad), B = angTex(b, inRad);
    return {
      cognitive: 'procedural',
      stem: `Evaluate exactly: ${m(f.tex(A, B))}.`,
      format: 'input',
      fields: [field({ kind: 'number', value: v, tex, exact: true }, '')],
      hints: ['Find each exact value separately.', '$\\sin^2 x$ means $(\\sin x)^2$.', 'Substitute, then simplify.'],
      solution: [
        { tex: ([['sin', a], ['cos', a], ['tan', a], ['sin', b], ['cos', b]] as [Fn, number][]).filter(([fn, ang], i, arr) => f.tex(A, B).includes(`\\${fn}${f.tex(A, B).includes(`\\${fn}^2 ${angTex(ang, inRad)}`) ? '^2' : ''} ${angTex(ang, inRad)}`) && arr.findIndex(([g, h]) => g === fn && h === ang) === i).map(([fn, ang]) => m(`\\${fn} ${angTex(ang, inRad)} = ${exact(fn, ang)!.tex}`)).join(', ') + '.' },
        { tex: m(`${f.tex(A, B)} = ${tex}`) },
      ],
    };
  },
};

// ---------------------------------------------------------------- T3.ratio-from-point

const rpPoint: Generator = {
  id: 'u4-rp-point',
  nodeId: 'T3.ratio-from-point',
  title: 'Ratio from a point on the terminal arm',
  make(rng, tier): Draft {
    const scale = tier === 2 ? rng.int(1, 3) : 1;
    const [a, b] = tier === 3 ? [rng.int(1, 4), rng.int(1, 4)] : rng.pick(TRIPLES).map((v) => v * scale);
    const q = rng.int(1, 4);
    const x = (q === 1 || q === 4 ? 1 : -1) * a;
    const y = (q <= 2 ? 1 : -1) * b;
    const r2 = x * x + y * y;
    const r = Math.sqrt(r2);
    const fn = rng.pick((tier === 1 ? ['sin', 'cos', 'tan'] : ['sin', 'cos', 'tan', 'csc', 'sec', 'cot']) as Fn[]);
    let tex: string, value: number;
    let o = 1, i = r2;
    for (let f = 2; f * f <= i; f++) while (i % (f * f) === 0) { i /= f * f; o *= f; }
    const rTex = i === 1 ? String(o) : `${o === 1 ? '' : o}\\sqrt{${i}}`;
    const ratio = { sin: [y, 'r'], cos: [x, 'r'], tan: [y, x], csc: ['r', y], sec: ['r', x], cot: [x, y] }[fn] as [number | 'r', number | 'r'];
    value = (ratio[0] === 'r' ? r : (ratio[0] as number)) / (ratio[1] === 'r' ? r : (ratio[1] as number));
    if (ratio[0] !== 'r' && ratio[1] !== 'r') tex = F(ratio[0] as number, ratio[1] as number).tex();
    else {
      // top/(o√i) = (top/(o·i))√i and (o√i)/bot = (o/bot)√i
      const k = ratio[1] === 'r' ? F(ratio[0] as number, o * i) : F(o, ratio[1] as number);
      tex = i === 1 ? k.mul(1).tex() : radFrac(k, i);
    }
    return {
      cognitive: 'procedural',
      stem: `The point ${m(`(${x}, ${y})`)} is on the terminal arm of angle ${m('\\theta')} in standard position. Determine the exact value of ${m(`\\${fn}\\theta`)}.`,
      format: 'input',
      fields: [field({ kind: 'number', value, tex, exact: true }, `\\${fn}\\theta =`)],
      hints: ['$r = \\sqrt{x^2 + y^2}$, always positive.', `${m(`r = \\sqrt{${x * x} + ${y * y}} = ${rTex}`)}.`, `${m(`\\${fn}\\theta = ${{ sin: '\\frac{y}{r}', cos: '\\frac{x}{r}', tan: '\\frac{y}{x}', csc: '\\frac{r}{y}', sec: '\\frac{r}{x}', cot: '\\frac{x}{y}' }[fn]}`)}.`],
      solution: [
        { tex: m(`r = \\sqrt{(${x})^2 + (${y})^2} = ${rTex}`) },
        { tex: m(`\\${fn}\\theta = ${tex}`), why: 'Signs of x and y carry through; r is positive.' },
      ],
      verify: () => Math.abs(value - FN(fn, Math.atan2(y, x))) < 1e-9,
    };
  },
};
/** c·√i as tex, e.g. -\frac{2\sqrt{5}}{5}. */
function radFrac(c: F_, i: number): string {
  const n = Math.abs(c.n);
  const body = `${n === 1 ? '' : n}\\sqrt{${i}}`;
  return `${c.n < 0 ? '-' : ''}${c.d === 1 ? body : `\\frac{${body}}{${c.d}}`}`;
}
type F_ = ReturnType<typeof F>;
const FN = (fn: Fn, t: number) => ({ sin: Math.sin(t), cos: Math.cos(t), tan: Math.tan(t), csc: 1 / Math.sin(t), sec: 1 / Math.cos(t), cot: 1 / Math.tan(t) })[fn];

function fromOneRatio(rng: R) {
  const [a, b, c] = rng.pick(TRIPLES);
  const q = rng.int(1, 4);
  const x = (q === 1 || q === 4 ? 1 : -1) * a;
  const y = (q <= 2 ? 1 : -1) * b;
  return { x, y, r: c, q };
}

const rpGiven: Generator = {
  id: 'u4-rp-given',
  nodeId: 'T3.ratio-from-point',
  title: 'Ratio from another ratio and the quadrant',
  make(rng, tier): Draft {
    const { x, y, r, q } = fromOneRatio(rng);
    const givenFn = rng.pick(['sin', 'cos', 'tan'] as Fn[]);
    const wantFn = rng.pick((tier === 3 ? ['csc', 'sec', 'cot'] : ['sin', 'cos', 'tan']).filter((f) => f !== givenFn) as Fn[]);
    const val = (fn: Fn) => ({ sin: F(y, r), cos: F(x, r), tan: F(y, x), csc: F(r, y), sec: F(r, x), cot: F(x, y) })[fn];
    const g = val(givenFn), w = val(wantFn);
    const cond = tier === 1 ? `${m('\\theta')} is in quadrant ${QNAME[q]}` : givenFn === 'tan' ? `${m(y > 0 ? '\\sin\\theta > 0' : '\\sin\\theta < 0')}` : `${m(givenFn === 'sin' ? (x > 0 ? '\\cos\\theta > 0' : '\\cos\\theta < 0') : y > 0 ? '\\sin\\theta > 0' : '\\sin\\theta < 0')}`;
    return {
      cognitive: 'problemSolving',
      stem: `${m(`\\${givenFn}\\theta = ${g.tex()}`)} and ${cond}. Determine the exact value of ${m(`\\${wantFn}\\theta`)}.`,
      format: 'input',
      fields: [field({ kind: 'number', value: w.value, tex: w.tex(), exact: true }, `\\${wantFn}\\theta =`)],
      hints: ['Draw the reference triangle and label two sides from the given ratio.', '$x^2 + y^2 = r^2$ gives the third side.', `The quadrant is ${QNAME[q]}: x is ${x > 0 ? 'positive' : 'negative'}, y is ${y > 0 ? 'positive' : 'negative'}.`],
      solution: [
        { tex: `Quadrant ${QNAME[q]}: ${m(`x = ${x}`)}, ${m(`y = ${y}`)}, ${m(`r = ${r}`)}.`, why: 'Sides from the given ratio and the Pythagorean theorem; signs from the quadrant.' },
        { tex: m(`\\${wantFn}\\theta = ${w.tex()}`) },
      ],
    };
  },
};

const rpMc: Generator = {
  id: 'u4-rp-mc',
  nodeId: 'T3.ratio-from-point',
  title: 'Choose the ratio',
  make(rng, tier): Draft {
    const { x, y, r, q } = fromOneRatio(rng);
    const want: Fn = rng.pick(['sin', 'cos'] as Fn[]);
    const ans = want === 'sin' ? F(y, r) : F(x, r);
    const swap = want === 'sin' ? F(x, r) : F(y, r);
    void tier;
    return {
      cognitive: 'problemSolving',
      stem: `${m(`\\tan\\theta = ${F(y, x).tex()}`)} and ${m('\\theta')} is in quadrant ${QNAME[q]}. What is ${m(`\\${want}\\theta`)}?`,
      format: 'mc',
      choices: mc({ tex: m(ans.tex()), key: ans.value }, [
        { tex: m(ans.neg().tex()), key: -ans.value, mis: 'trig-cast-sign', feedback: `In quadrant ${QNAME[q]}, ${want} θ is ${ans.value > 0 ? 'positive' : 'negative'}.` },
        { tex: m(swap.tex()), key: swap.value, mis: 'trig-ratio-swap' },
        { tex: m(swap.neg().tex()), key: -swap.value, mis: 'trig-ratio-swap' },
        { tex: m(F(want === 'sin' ? y : x, want === 'sin' ? x : y).tex()), key: 'tanlike', mis: 'trig-ratio-swap' },
      ]),
      hints: ['$\\tan\\theta = \\frac{y}{x}$: pick $x$ and $y$ with the right signs.', `$r = \\sqrt{x^2 + y^2} = ${r}$.`, `${m(`\\${want}\\theta = \\frac{${want === 'sin' ? 'y' : 'x'}}{r}`)}.`],
      solution: [{ tex: `Quadrant ${QNAME[q]}: ${m(`x = ${x}, y = ${y}, r = ${r}`)}.` }, { tex: m(`\\${want}\\theta = ${ans.tex()}`) }],
    };
  },
};

// ---------------------------------------------------------------- T3.angle-from-ratio

const afrExact: Generator = {
  id: 'u4-afr-exact',
  nodeId: 'T3.angle-from-ratio',
  title: 'Angles from an exact ratio',
  make(rng, tier): Draft {
    const fn = rng.pick((tier === 3 ? ['tan', 'csc', 'sec'] : ['sin', 'cos', 'tan']) as Fn[]);
    const d = specialAngle(rng);
    const e = exact(fn, d);
    if (!e) throw new Reject();
    const sols = solveSpecial(fn, e.value);
    const inRad = tier > 1;
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(`\\${fn}\\theta = ${e.tex}`)} for ${m(inRad ? '0 \\le \\theta < 2\\pi' : '0^\\circ \\le \\theta < 360^\\circ')}.`,
      format: 'input',
      fields: [field(angleSet(sols, inRad), '\\theta =', 'All solutions, separated by commas')],
      hints: [`Reference angle: the acute angle with ${m(`\\${fn}`)} equal to ${m(e.tex.replace(/^-/, ''))}.`, `CAST: ${m(`\\${fn}`)} is ${e.value > 0 ? 'positive' : 'negative'} in two quadrants.`, 'One angle in each of those quadrants.'],
      solution: [
        { tex: `Reference angle ${m(angTex(refAngle(d), inRad))}; ${m(`\\${fn}`)} is ${e.value > 0 ? 'positive' : 'negative'} in quadrants ${sols.map((s) => QNAME[quadrant(s)]).join(' and ')}.` },
        { tex: m(`\\theta = ${sols.map((s) => angTex(s, inRad)).join(', ')}`) },
      ],
    };
  },
};

const afrApprox: Generator = {
  id: 'u4-afr-approx',
  nodeId: 'T3.angle-from-ratio',
  title: 'Angles from a decimal ratio',
  make(rng, tier): Draft {
    const fn = rng.pick(['sin', 'cos', 'tan'] as const);
    const v = (fn === 'tan' ? rng.nz(-30, 30) / 10 : rng.nz(-95, 95) / 100);
    const inRad = tier === 3;
    const base = fn === 'sin' ? Math.asin(v) : fn === 'cos' ? Math.acos(v) : Math.atan(v);
    const sols = (fn === 'sin' ? [base, PI - base] : fn === 'cos' ? [base, 2 * PI - base] : [base, base + PI]).map((t) => ((t % (2 * PI)) + 2 * PI) % (2 * PI)).sort((a, b) => a - b);
    const places = inRad ? 2 : 1;
    const conv = (t: number) => (inRad ? t : (t * 180) / PI);
    const vals = sols.map(conv);
    for (const x of vals) if (Math.abs(x * 10 ** places - Math.floor(x * 10 ** places) - 0.5) < 0.02) throw new Reject();
    const specs = vals.map((x) => rounded(x, places as 1 | 2));
    const ref = Math.abs(conv(fn === 'cos' ? Math.acos(Math.abs(v)) : fn === 'sin' ? Math.asin(Math.abs(v)) : Math.atan(Math.abs(v))));
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(`\\${fn}\\theta = ${v}`)} for ${m(inRad ? '0 \\le \\theta < 2\\pi' : '0^\\circ \\le \\theta < 360^\\circ')}, to the nearest ${inRad ? 'hundredth of a radian' : 'tenth of a degree'}.`,
      format: 'input',
      fields: [field(specs[0], '\\theta_1 =', 'Smaller solution'), field(specs[1], '\\theta_2 =', 'Larger solution')],
      hints: [`Reference angle: ${m(`\\${fn}^{-1}(${Math.abs(v)})`)} with the calculator in ${inRad ? 'radian' : 'degree'} mode.`, `${m(`\\${fn}`)} is ${v > 0 ? 'positive' : 'negative'}: use CAST to choose two quadrants.`, 'Build each angle from the reference angle.'],
      solution: [
        { tex: m(`\\theta_R = \\${fn}^{-1}(${Math.abs(v)}) \\approx ${ref.toFixed(places + 1)}`), why: 'Use the positive value to get the reference angle.' },
        { tex: m(`\\theta \\approx ${specs[0].tex}, ${specs[1].tex}`), why: 'One angle in each quadrant where the sign matches.' },
      ],
    };
  },
};

const afrMc: Generator = {
  id: 'u4-afr-mc',
  nodeId: 'T3.angle-from-ratio',
  title: 'Angle in a given quadrant',
  make(rng, tier): Draft {
    const fn = rng.pick(['sin', 'cos', 'tan'] as Fn[]);
    const d = specialAngle(rng);
    const e = exact(fn, d)!;
    const q = quadrant(d);
    const inRad = tier > 1;
    const r = refAngle(d);
    const other = solveSpecial(fn, e.value).find((s) => s !== d)!;
    return {
      cognitive: 'conceptual',
      stem: `${m(`\\${fn}\\theta = ${e.tex}`)} and ${m('\\theta')} is in quadrant ${QNAME[q]}, ${m(inRad ? '0 \\le \\theta < 2\\pi' : '0^\\circ \\le \\theta < 360^\\circ')}. What is ${m('\\theta')}?`,
      format: 'mc',
      choices: mc({ tex: m(angTex(d, inRad)), key: d }, [
        { tex: m(angTex(r, inRad)), key: r, mis: 'trig-ref-angle-value', feedback: 'That is the reference angle; place it in the given quadrant.' },
        { tex: m(angTex(other, inRad)), key: other, mis: 'trig-cast-sign' },
        { tex: m(angTex(norm(d + 180), inRad)), key: norm(d + 180), mis: 'trig-cast-sign' },
        { tex: m(angTex(90 - r + [0, 0, 90, 180, 270][q], inRad)), key: 90 - r + [0, 0, 90, 180, 270][q] + 0.1, mis: 'trig-special-value' },
      ]),
      hints: [`Reference angle with ${m(`\\${fn}`)} equal to ${m(e.tex.replace(/^-/, ''))}.`, `Place it in quadrant ${QNAME[q]}.`, `QII: ${m(inRad ? '\\pi - \\theta_R' : '180^\\circ - \\theta_R')}; QIII: ${m(inRad ? '\\pi + \\theta_R' : '180^\\circ + \\theta_R')}; QIV: ${m(inRad ? '2\\pi - \\theta_R' : '360^\\circ - \\theta_R')}.`],
      solution: [{ tex: `Reference angle ${m(angTex(r, inRad))}, quadrant ${QNAME[q]}: ${m(`\\theta = ${angTex(d, inRad)}`)}.` }],
    };
  },
};

export const angleGenerators: Generator[] = [radToRad, radToDeg, radMc, cotMc, cotDomain, cotGeneral, refRad, refMc, refFind, arcLength, arcMc, arcContext, ucMissing, ucPtheta, ucSymmetry, spCoord, spMc, spAngle, exValue, exMc, exExpr, rpPoint, rpGiven, rpMc, afrExact, afrApprox, afrMc];
void isSpecial;
