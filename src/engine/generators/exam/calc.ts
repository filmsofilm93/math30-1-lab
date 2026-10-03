// TI-84 Plus (non-CE) drills: mode, window, 2nd CALC (zero, intersect, maximum, minimum), table.
// Each item sets a task, gives the exact keystrokes in the solution, and checks the result you read off.
import { field, m as mTex, mc } from '../../framework';
import { polyTex } from '../../frac';
import type { Rng } from '../../rng';
import type { AnswerSpec, Draft, Generator, Round } from '../../types';
import { Reject } from '../../types';

const m = (x: string | number) => mTex(String(x));

/** Key caps as they appear on the TI-84 Plus. */
const k = (...caps: string[]) => caps.map((c) => `**[${c}]**`).join(' ');
const CALC_MENU = `${k('2nd', 'TRACE')} (CALC)`;
const QUIT = k('2nd', 'MODE');

const r2 = (x: number) => Math.round(x * 100) / 100;
const fmt = (x: number, d = 2) => String(+x.toFixed(d));
/** Reject values that sit near a rounding boundary, so the keyed answer is unambiguous. */
const clean = (x: number) => Math.abs(Math.abs((x * 100) % 1) - 0.5) > 0.06;

/** Real roots of f on [lo, hi] by sign change and bisection. */
export function rootsOn(f: (x: number) => number, lo: number, hi: number, step = 0.001): number[] {
  const out: number[] = [];
  let a = lo;
  let fa = f(a);
  for (let b = lo + step; b <= hi + 1e-12; b += step) {
    const fb = f(b);
    if (fa === 0) out.push(a);
    else if (fa * fb < 0) {
      let x0 = a;
      let x1 = b;
      for (let i = 0; i < 60; i++) {
        const mid = (x0 + x1) / 2;
        if (f(x0) * f(mid) <= 0) x1 = mid;
        else x0 = mid;
      }
      out.push((x0 + x1) / 2);
    }
    a = b;
    fa = fb;
  }
  return out;
}

/** Local extremum of f on [lo, hi] by golden-section search (max if `max`). */
function extremum(f: (x: number) => number, lo: number, hi: number, max: boolean): [number, number] {
  const g = max ? (x: number) => -f(x) : f;
  let a = lo;
  let b = hi;
  const phi = (Math.sqrt(5) - 1) / 2;
  for (let i = 0; i < 200; i++) {
    const c = b - phi * (b - a);
    const d = a + phi * (b - a);
    if (g(c) < g(d)) b = d;
    else a = c;
  }
  const x = (a + b) / 2;
  return [x, f(x)];
}

const roundSet = (vals: number[], round: Round): AnswerSpec => ({ kind: 'set', values: vals, tex: vals.map((v) => fmt(v)).join(', '), round });

const Y_EDIT = (eqs: string[]) => `${k('Y=')} and enter ${eqs.map((e, i) => m(`Y_${i + 1} = ${e}`)).join(' and ')} (use ${k('X,T,θ,n')} for ${m('x')}).`;

// ---------------------------------------------------------------- CALC.intersect-zero

const calcZero: Generator = {
  id: 'calc-zero',
  nodeId: 'CALC.intersect-zero',
  title: '2nd CALC zero',
  make(rng): Draft {
    // Cubic with three irrational real zeros: x³ + bx² + cx + d.
    const b = rng.int(-3, 3);
    const c = rng.int(-8, -3);
    const d = rng.nz(-4, 4);
    const f = (x: number) => x ** 3 + b * x * x + c * x + d;
    const zs = rootsOn(f, -10, 10);
    if (zs.length !== 3 || zs.some((z) => Number.isInteger(r2(z)) || !clean(z) || Math.abs(z) > 9)) throw new Reject();
    const eq = polyTex([1, b, c, d]);
    return {
      cognitive: 'procedural',
      stem: `Use your calculator to determine the zeros of ${m(`f(x) = ${eq}`)}, to the nearest hundredth.`,
      format: 'input',
      fields: [field(roundSet(zs.map(r2), 'hundredth'), 'x =', 'Zeros, separated by commas')],
      hints: ['A zero is an x-intercept. The calculator finds one at a time.', `${CALC_MENU} → **2: zero**, then Left Bound, Right Bound, Guess.`, 'Set a window that shows all three crossings first, e.g. ZOOM 6: ZStandard.'],
      solution: [
        { tex: Y_EDIT([eq]), why: `Type ${m('x^3')} as ${k('X,T,θ,n', '^', '3')}.` },
        { tex: `${k('ZOOM')} **6: ZStandard** to see all three crossings ([−10, 10, 1] by [−10, 10, 1]).`, why: 'A cubic has at most three zeros; check you can see them all.' },
        { tex: `${CALC_MENU} → **2: zero**. Move left of the first crossing ${k('ENTER')} (Left Bound?), right of it ${k('ENTER')} (Right Bound?), ${k('ENTER')} (Guess?). Repeat for each crossing.`, why: 'The bounds must bracket exactly one crossing.' },
        { tex: `Zeros: ${m(zs.map((z) => `x \\approx ${fmt(z)}`).join(',\\ '))}.` },
      ],
      verify: () => zs.every((z) => Math.abs(f(z)) < 1e-6),
    };
  },
};

const calcIntersect: Generator = {
  id: 'calc-intersect',
  nodeId: 'CALC.intersect-zero',
  title: '2nd CALC intersect',
  make(rng): Draft {
    const base = rng.pick([2, 3]);
    const p = rng.int(1, 3);
    const q = rng.int(1, 5);
    // b^x = px + q: typically two intersections.
    const f = (x: number) => base ** x - (p * x + q);
    const xs = rootsOn(f, -10, 6);
    if (!xs.length || xs.some((x) => !clean(x) || Number.isInteger(r2(x)))) throw new Reject();
    const left = `${base}^x`;
    const right = polyTex([p, q]);
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(`${left} = ${right}`)} graphically, to the nearest hundredth.`,
      format: 'input',
      fields: [field(roundSet(xs.map(r2), 'hundredth'), 'x =', 'Solutions, separated by commas')],
      hints: ['Graph each side as its own function.', `${CALC_MENU} → **5: intersect**.`, 'Use one intersection at a time: First curve, Second curve, Guess near the point.'],
      solution: [
        { tex: Y_EDIT([left, right]), why: `Type ${m(`${base}^x`)} as ${k(String(base), '^', 'X,T,θ,n')}.` },
        { tex: `${k('WINDOW')}: x: [−6, 6, 1], y: [−4, 20, 2], then ${k('GRAPH')}.`, why: 'Exponential growth is steep; extend y upward so both crossings show.' },
        { tex: `${CALC_MENU} → **5: intersect**: ${k('ENTER')} (First curve?), ${k('ENTER')} (Second curve?), move near one intersection ${k('ENTER')} (Guess?). Repeat near the other.` },
        { tex: `Solutions: ${m(xs.map((x) => `x \\approx ${fmt(x)}`).join(',\\ '))}.` },
      ],
      verify: () => xs.every((x) => Math.abs(f(x)) < 1e-6),
    };
  },
};

const calcIntersectTrig: Generator = {
  id: 'calc-intersect-trig',
  nodeId: 'CALC.intersect-zero',
  title: 'Intersect with a trig function (radian mode)',
  make(rng): Draft {
    const a = rng.int(2, 4);
    const c = rng.pick([0.5, 1, 1.5]);
    const d = rng.int(-1, 1);
    // a·sin x = c·x + d on [0, 2π]
    const f = (x: number) => a * Math.sin(x) - (c * x + d);
    const xs = rootsOn(f, 0, 2 * Math.PI);
    if (!xs.length || xs.length > 3 || xs.some((x) => !clean(x) || x < 0.02)) throw new Reject();
    const right = `${c === 1 ? '' : c}x${d ? (d > 0 ? ` + ${d}` : ` - ${-d}`) : ''}`;
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(`${a}\\sin x = ${right}`)} for ${m('0 \\le x \\le 2\\pi')}, to the nearest hundredth.`,
      format: 'input',
      fields: [field(roundSet(xs.map(r2), 'hundredth'), 'x =', 'Solutions, separated by commas')],
      hints: ['The domain is in radians. Check the mode first.', `Window x: [0, 2π, π/2]. Then ${CALC_MENU} → **5: intersect**.`, 'Find every intersection in the window.'],
      solution: [
        { tex: `${k('MODE')}: highlight **RADIAN** ${k('ENTER')}, then ${QUIT}.`, why: 'A domain written with π means radians.' },
        { tex: Y_EDIT([`${a}\\sin x`, right]) },
        { tex: `${k('WINDOW')}: Xmin = 0, Xmax = ${k('2', '2nd', '^')} (2π), Xscl = π/2, Ymin = −5, Ymax = 8, then ${k('GRAPH')}.` },
        { tex: `${CALC_MENU} → **5: intersect** at each crossing.` },
        { tex: `Solutions: ${m(xs.map((x) => `x \\approx ${fmt(x)}`).join(',\\ '))}.` },
      ],
      verify: () => xs.every((x) => Math.abs(f(x)) < 1e-6),
    };
  },
};

// ---------------------------------------------------------------- CALC.max-min

function cubicWithTurns(rng: Rng) {
  const a = rng.pick([1, -1]);
  const b = rng.int(-3, 3);
  const c = rng.int(-9, -2) * a;
  const d = rng.int(-5, 5);
  const f = (x: number) => a * x ** 3 + b * x * x + c * x + d;
  // Turning points: f'(x) = 3a x² + 2b x + c = 0
  const disc = 4 * b * b - 12 * a * c;
  if (disc <= 0) throw new Reject();
  const t1 = (-2 * b - Math.sqrt(disc)) / (6 * a);
  const t2 = (-2 * b + Math.sqrt(disc)) / (6 * a);
  return { f, eq: polyTex([a, b, c, d]), turns: [Math.min(t1, t2), Math.max(t1, t2)], a };
}

const calcMax: Generator = {
  id: 'calc-max',
  nodeId: 'CALC.max-min',
  title: '2nd CALC maximum',
  make(rng): Draft {
    const { f, eq, turns, a } = cubicWithTurns(rng);
    const xm = a > 0 ? turns[0] : turns[1];
    const [x, y] = extremum(f, xm - 1, xm + 1, true);
    if (!clean(x) || !clean(y) || Math.abs(y) > 25) throw new Reject();
    return {
      cognitive: 'procedural',
      stem: `Use your calculator to determine the coordinates of the local maximum of ${m(`y = ${eq}`)}, to the nearest hundredth.`,
      format: 'input',
      fields: [field({ kind: 'points', values: [[r2(x), r2(y)]], tex: `(${fmt(x)}, ${fmt(y)})` }, '', 'Local maximum (x, y)')],
      hints: ['A local maximum is a peak, higher than the points on either side.', `${CALC_MENU} → **4: maximum**.`, 'Left Bound to the left of the peak, Right Bound to the right, then Guess.'],
      solution: [
        { tex: Y_EDIT([eq]) },
        { tex: `${k('ZOOM')} **6: ZStandard**; adjust Ymax if the peak is off screen.` },
        { tex: `${CALC_MENU} → **4: maximum**: Left Bound ${k('ENTER')}, Right Bound ${k('ENTER')}, Guess ${k('ENTER')}.`, why: 'The bounds must bracket the peak only.' },
        { tex: `Local maximum ${m(`(${fmt(x)}, ${fmt(y)})`)}.`, why: 'Round each coordinate as the question asks.' },
      ],
      verify: () => f(x) >= f(x - 0.01) && f(x) >= f(x + 0.01),
    };
  },
};

const calcMin: Generator = {
  id: 'calc-min',
  nodeId: 'CALC.max-min',
  title: '2nd CALC minimum',
  make(rng): Draft {
    const { f, eq, turns, a } = cubicWithTurns(rng);
    const xm = a > 0 ? turns[1] : turns[0];
    const [x, y] = extremum(f, xm - 1, xm + 1, false);
    if (!clean(y) || Math.abs(y) > 25) throw new Reject();
    return {
      cognitive: 'procedural',
      stem: `What is the local minimum value of ${m(`y = ${eq}`)}, to the nearest hundredth?`,
      format: 'input',
      fields: [field({ kind: 'number', value: y, tex: fmt(y), round: 'hundredth' }, 'y =')],
      hints: ['The minimum value is the y-coordinate of the lowest point of the dip.', `${CALC_MENU} → **3: minimum**.`, 'Report the y-coordinate, not the x-coordinate.'],
      solution: [
        { tex: Y_EDIT([eq]) },
        { tex: `${CALC_MENU} → **3: minimum**: Left Bound ${k('ENTER')}, Right Bound ${k('ENTER')}, Guess ${k('ENTER')}.` },
        { tex: `The screen shows X = ${fmt(x, 4)}, Y = ${fmt(y, 4)}. The minimum value is ${m(`y \\approx ${fmt(y)}`)}.`, why: '"Value" means the y-coordinate.' },
      ],
      verify: () => f(x) <= f(x - 0.01) && f(x) <= f(x + 0.01),
    };
  },
};

const calcRange: Generator = {
  id: 'calc-range',
  nodeId: 'CALC.max-min',
  title: 'Range from a maximum',
  make(rng): Draft {
    // Downward quartic-like: y = -(x² + bx)² ... use y = -x⁴ + px² + q, which has an absolute maximum.
    const p = rng.int(2, 6);
    const q = rng.int(-3, 4);
    const s = rng.pick([0.5, 1, 1.5]);
    const f = (x: number) => -(x ** 4) + p * x * x + s * x + q;
    const [x1, y1] = extremum(f, 0, 3, true);
    const [x2, y2] = extremum(f, -3, 0, true);
    const ymax = Math.max(y1, y2);
    if (!clean(ymax) || Math.abs(y1 - y2) < 0.05) throw new Reject();
    const eq = `-x^4 + ${p}x^2 + ${s === 1 ? '' : s}x ${q < 0 ? `- ${-q}` : `+ ${q}`}`.replace('+ 0', '').trim();
    return {
      cognitive: 'problemSolving',
      stem: `Determine the range of ${m(`y = ${eq}`)}, to the nearest hundredth.`,
      format: 'input',
      fields: [field({ kind: 'interval', value: [{ lo: -Infinity, hi: r2(ymax), loIn: false, hiIn: true }], tex: `(-\\infty, ${fmt(ymax)}]` }, '', 'Range')],
      hints: ['Even degree, negative leading coefficient: the graph opens down, so it has an absolute maximum.', `Find both peaks with ${CALC_MENU} → **4: maximum**.`, 'The higher peak gives the top of the range.'],
      solution: [
        { tex: Y_EDIT([eq]) },
        { tex: `${CALC_MENU} → **4: maximum** at each peak: ${m(`(${fmt(x2)}, ${fmt(y2)})`)} and ${m(`(${fmt(x1)}, ${fmt(y1)})`)}.`, why: 'There are two local maximums; only the higher one is the absolute maximum.' },
        { tex: `Range ${m(`(-\\infty, ${fmt(ymax)}]`)}, or ${m(`y \\le ${fmt(ymax)}`)}.`, why: 'Both ends go down forever, so every value up to the absolute maximum is reached.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- CALC.mode

const DEG_ANGLES = [20, 35, 50, 70, 110, 140, 200, 250, 310];
const RAD_ANGLES: [string, number][] = [
  ['1.2', 1.2],
  ['2.5', 2.5],
  ['\\frac{2\\pi}{7}', (2 * Math.PI) / 7],
  ['\\frac{5\\pi}{9}', (5 * Math.PI) / 9],
  ['4', 4],
];

const modeWhich: Generator = {
  id: 'calc-mode-which',
  nodeId: 'CALC.mode',
  title: 'Which mode?',
  make(rng): Draft {
    const cases = [
      { q: `Evaluate ${m('\\cos 2.5')} to the nearest hundredth.`, mode: 'radian', why: 'No degree sign: the angle 2.5 is in radians.' },
      { q: `Solve ${m('3\\sin\\theta = 1')} for ${m('0^\\circ \\le \\theta < 360^\\circ')}.`, mode: 'degree', why: 'The domain is in degrees.' },
      { q: `Solve ${m('2\\cos x = 0.4')} for ${m('0 \\le x < 2\\pi')}.`, mode: 'radian', why: 'The domain uses π, so radians.' },
      { q: `A Ferris wheel's height is ${m('h(t) = 15\\sin\\left(\\frac{\\pi}{20}t\\right) + 17')}, ${m('t')} in seconds. Find ${m('h(7)')}.`, mode: 'radian', why: 'The argument πt/20 is a real number of radians; t is time, not an angle in degrees.' },
      { q: `Evaluate ${m('\\tan 230^\\circ')}.`, mode: 'degree', why: 'The angle has a degree sign.' },
    ];
    const c = rng.pick(cases);
    return {
      cognitive: 'conceptual',
      stem: `Which calculator mode does this question need? ${c.q}`,
      format: 'mc',
      choices: mc({ tex: c.mode === 'radian' ? 'Radian' : 'Degree', key: c.mode }, [
        { tex: c.mode === 'radian' ? 'Degree' : 'Radian', key: 'other', mis: 'calc-mode', feedback: c.why },
        { tex: 'Either; the calculator converts automatically', key: 'either', mis: 'calc-mode', feedback: 'The TI-84 Plus uses whatever mode is set. It never guesses.' },
        { tex: 'Neither; set the calculator to exact mode', key: 'exact', mis: 'calc-mode', feedback: 'There is no exact-value mode for trig in the exam configuration.' },
      ]),
      hints: ['Look for a degree sign or π.', 'A degree sign means degrees; π or a plain number means radians.', 'Check with MODE before every trig question.'],
      solution: [
        { tex: `${c.mode === 'radian' ? 'Radian' : 'Degree'} mode.`, why: c.why },
        { tex: `${k('MODE')}, arrow down to the RADIAN / DEGREE row, highlight **${c.mode.toUpperCase()}**, ${k('ENTER')}, ${QUIT}.` },
      ],
    };
  },
};

const modeValue: Generator = {
  id: 'calc-mode-value',
  nodeId: 'CALC.mode',
  title: 'Evaluate in the right mode',
  make(rng, tier): Draft {
    const deg = tier === 1 ? true : rng.chance(0.5);
    const fn = rng.pick(['sin', 'cos', 'tan'] as const);
    const F = { sin: Math.sin, cos: Math.cos, tan: Math.tan }[fn];
    const [tex, rad] = deg ? ((d) => [`${d}^\\circ`, (d * Math.PI) / 180] as [string, number])(rng.pick(DEG_ANGLES)) : rng.pick(RAD_ANGLES);
    const v = F(rad);
    const wrongV = deg ? F(Number(tex.replace('^\\circ', ''))) : F((rad * 180) / Math.PI);
    if (!clean(v) || Math.abs(v) > 20) throw new Reject();
    return {
      cognitive: 'procedural',
      stem: `Evaluate ${m(`\\${fn} ${tex}`)}, to the nearest hundredth.`,
      format: 'input',
      fields: [field({ kind: 'number', value: v, tex: fmt(v), round: 'hundredth' })],
      hints: [deg ? 'The degree sign means degree mode.' : 'No degree sign: radian mode.', `Check ${k('MODE')} first.`, `In the wrong mode you would get about ${fmt(wrongV)}.`],
      solution: [
        { tex: `${k('MODE')} → **${deg ? 'DEGREE' : 'RADIAN'}** ${k('ENTER')}, ${QUIT}.`, why: deg ? 'The angle has a degree sign.' : 'An angle with no degree sign is in radians.' },
        { tex: `${k(fn.toUpperCase())} and the angle${!deg && tex.includes('pi') ? `, using ${k('2nd', '^')} for π and brackets around the fraction` : ''}, then ${k(')', 'ENTER')}.` },
        { tex: `${m(`\\${fn} ${tex} \\approx ${fmt(v)}`)}.`, why: `In the other mode the screen shows about ${fmt(wrongV)}, a common exam error.` },
      ],
      verify: () => Math.abs(v - wrongV) > 0.01,
    };
  },
};

const modeError: Generator = {
  id: 'calc-mode-error',
  nodeId: 'CALC.mode',
  title: 'Spot the mode error',
  make(rng): Draft {
    const [tex, rad] = rng.pick(RAD_ANGLES.filter((a) => a[0].includes('pi')));
    const shown = Math.sin(rad); // correct, radian mode
    const degShown = Math.sin((rad * Math.PI) / 180); // what degree mode gives for the same keystrokes
    return {
      cognitive: 'conceptual',
      stem: `A student evaluates ${m(`\\sin ${tex}`)} and the calculator shows ${m(fmt(degShown, 4))}. The correct value is about ${m(fmt(shown, 4))}. What went wrong?`,
      format: 'mc',
      choices: mc({ tex: 'The calculator was in degree mode, so it took the angle as degrees', key: 'deg' }, [
        { tex: 'The student forgot brackets around the fraction', key: 'br', mis: 'calc-brackets', feedback: `Missing brackets give a different error: ${m('\\sin(2\\pi)/7')}, not ${m('\\sin(2\\pi/7)')}.` },
        { tex: 'The calculator was in radian mode', key: 'rad', mis: 'calc-mode', feedback: 'Radian mode gives the correct value here.' },
        { tex: 'The calculator rounds trig values to 4 decimals', key: 'rnd', mis: 'calc-mode', feedback: 'Rounding cannot change 0.78 into 0.02.' },
      ]),
      hints: ['How big is the shown value compared with the correct one?', `${m(tex)} is a small number of radians but a tiny number of degrees.`, 'A tiny result from a trig key often means degree mode.'],
      solution: [{ tex: `In degree mode, ${m(`\\sin ${tex}`)} is ${m(`\\sin(${fmt(rad, 4)}^\\circ)`)}, almost 0.`, why: 'π alone does not force radians: the calculator still uses the mode setting.' }, { tex: `Fix: ${k('MODE')} → **RADIAN**, ${QUIT}, and re-enter.` }],
    };
  },
};

// ---------------------------------------------------------------- CALC.mode-window

const windowFit: Generator = {
  id: 'calc-window-fit',
  nodeId: 'CALC.mode-window',
  title: 'Choose a window that shows every key feature',
  make(rng): Draft {
    const amp = rng.int(5, 20);
    const per = rng.pick([12, 24, 30, 40, 60]);
    const mid = amp + rng.int(2, 10);
    const eq = `h(t) = ${amp}\\sin\\left(\\frac{2\\pi}{${per}}t\\right) + ${mid}`;
    const top = mid + amp;
    const good = `x: [0, ${2 * per}, ${per / 4}], y: [0, ${top + 5}, 5]`;
    return {
      cognitive: 'conceptual',
      stem: `Which window shows two full cycles of ${m(eq)}, including the maximum and minimum?`,
      format: 'mc',
      choices: mc({ tex: good, key: 'ok' }, [
        { tex: 'x: [−10, 10, 1], y: [−10, 10, 1]', key: 'std', mis: 'calc-window', feedback: `ZStandard cuts off the graph: the maximum is ${top}.` },
        { tex: `x: [0, ${per / 2}, 1], y: [0, ${top + 5}, 5]`, key: 'half', mis: 'calc-window', feedback: 'That shows only half a cycle.' },
        { tex: `x: [0, ${2 * per}, ${per / 4}], y: [${mid - 2}, ${mid + 2}, 1]`, key: 'flat', mis: 'calc-window', feedback: `The graph goes from ${mid - amp} to ${top}; this y-window clips both.` },
      ]),
      hints: ['Two cycles need an x-window of twice the period.', `Max = ${mid} + ${amp}, min = ${mid} − ${amp}.`, 'The y-window must cover both, with a little room.'],
      solution: [
        { tex: `Period ${m(per)}, so two cycles span ${m(`0 \\le t \\le ${2 * per}`)}.` },
        { tex: `Range ${m(`[${mid - amp}, ${top}]`)}, so y from 0 to ${top + 5} works.` },
        { tex: `Window format: ${m(`x: [x_{\\min}, x_{\\max}, x_{scl}],\\ y: [y_{\\min}, y_{\\max}, y_{scl}]`)}, so ${good}.`, why: 'This is the format on the formula sheet and in exam questions.' },
      ],
    };
  },
};

const windowRead: Generator = {
  id: 'calc-window-read',
  nodeId: 'CALC.mode-window',
  title: 'Read a window setting',
  make(rng): Draft {
    const xmin = -rng.int(1, 5) * 2;
    const xmax = rng.int(2, 6) * 2;
    const xscl = rng.pick([1, 2]);
    const ymin = -rng.int(1, 4) * 5;
    const ymax = rng.int(2, 8) * 5;
    const yscl = 5;
    const ask = rng.pick(['xticks', 'yticks'] as const);
    const n = ask === 'xticks' ? xmax / xscl : ymax / yscl;
    return {
      cognitive: 'procedural',
      stem: `A calculator window is set to ${m(`x: [${xmin}, ${xmax}, ${xscl}],\\ y: [${ymin}, ${ymax}, ${yscl}]`)}. How many tick marks are on the positive ${ask === 'xticks' ? m('x') : m('y')}-axis?`,
      format: 'input',
      fields: [field({ kind: 'number', value: n, tex: String(n) })],
      hints: ['The third number in each bracket is the scale: the distance between tick marks.', `Positive ${ask === 'xticks' ? 'x' : 'y'}-axis: from 0 to ${ask === 'xticks' ? xmax : ymax}.`, 'Divide the length by the scale.'],
      solution: [
        { tex: `Format ${m('[\\text{min}, \\text{max}, \\text{scale}]')}.` },
        { tex: `${m(`${ask === 'xticks' ? xmax : ymax} \\div ${ask === 'xticks' ? xscl : yscl} = ${n}`)} tick marks.` },
      ],
    };
  },
};

const windowSet: Generator = {
  id: 'calc-window-set',
  nodeId: 'CALC.mode-window',
  title: 'Window for a polynomial',
  make(rng): Draft {
    const zs = [rng.int(-9, -4), rng.int(-2, 2), rng.int(5, 12)].sort((a, b) => a - b);
    const eq = zs.map((z) => (z === 0 ? 'x' : `(x ${z > 0 ? '-' : '+'} ${Math.abs(z)})`)).join('');
    const f = (x: number) => zs.reduce((p, z) => p * (x - z), 1);
    const ext = [extremum(f, zs[0], zs[1], true)[1], extremum(f, zs[1], zs[2], false)[1]];
    const ok = `x: [${zs[0] - 2}, ${zs[2] + 2}, 1], y: [${Math.floor(ext[1] / 50) * 50 - 50}, ${Math.ceil(ext[0] / 50) * 50 + 50}, 50]`;
    return {
      cognitive: 'conceptual',
      stem: `Which window shows all the zeros and both turning points of ${m(`y = ${eq}`)}?`,
      format: 'mc',
      choices: mc({ tex: ok, key: 'ok' }, [
        { tex: 'x: [−10, 10, 1], y: [−10, 10, 1]', key: 'std', mis: 'calc-window', feedback: `The zero at ${zs[2]} and the turning points (about ${Math.round(ext[0])} and ${Math.round(ext[1])}) are outside ZStandard.` },
        { tex: `x: [${zs[0] - 2}, ${zs[2] + 2}, 1], y: [−10, 10, 1]`, key: 'y', mis: 'calc-window', feedback: 'All zeros show, but the turning points are cut off.' },
        { tex: `x: [0, ${zs[2] + 2}, 1], y: [${Math.floor(ext[1] / 50) * 50 - 50}, ${Math.ceil(ext[0] / 50) * 50 + 50}, 50]`, key: 'x', mis: 'calc-window', feedback: `The zero at ${zs[0]} is left of x = 0.` },
      ]),
      hints: ['The x-window must include every zero.', 'The y-window must include the local maximum and minimum.', 'Estimate the turning values with TRACE or 2nd CALC.'],
      solution: [
        { tex: `Zeros ${m(zs.join(',\\ '))}: x from ${zs[0] - 2} to ${zs[2] + 2}.` },
        { tex: `Turning values about ${m(Math.round(ext[0]))} and ${m(Math.round(ext[1]))}: y from ${Math.floor(ext[1] / 50) * 50 - 50} to ${Math.ceil(ext[0] / 50) * 50 + 50}.` },
        { tex: `Window ${ok}.` },
      ],
    };
  },
};

// ---------------------------------------------------------------- CALC.table

const tableValue: Generator = {
  id: 'calc-table-value',
  nodeId: 'CALC.table',
  title: 'Read a value from the table',
  make(rng): Draft {
    const a = rng.int(50, 400);
    const b = rng.pick([1.03, 1.05, 1.08, 0.9, 0.85]);
    const t = rng.int(3, 15);
    const v = a * b ** t;
    if (!clean(v)) throw new Reject();
    const eq = `A(t) = ${a}(${b})^t`;
    return {
      cognitive: 'procedural',
      stem: `Use a table of values to evaluate ${m(eq)} at ${m(`t = ${t}`)}, to the nearest hundredth.`,
      format: 'input',
      fields: [field({ kind: 'number', value: v, tex: fmt(v), round: 'hundredth' }, `A(${t}) =`)],
      hints: ['Enter the function in Y=, using X for t.', `${k('2nd', 'WINDOW')} (TBLSET): TblStart = 0, ΔTbl = 1.`, `${k('2nd', 'GRAPH')} (TABLE) and scroll to X = ${t}.`],
      solution: [
        { tex: Y_EDIT([`${a}(${b})^x`]) },
        { tex: `${k('2nd', 'WINDOW')} (TBLSET): TblStart = 0, ΔTbl = 1, Indpnt: Auto, Depend: Auto.` },
        { tex: `${k('2nd', 'GRAPH')} (TABLE), scroll to X = ${t}: Y1 ≈ ${fmt(v, 4)}.`, why: 'The table may show fewer digits; select the cell to see more at the bottom of the screen.' },
        { tex: m(`A(${t}) \\approx ${fmt(v)}`) },
      ],
    };
  },
};

const tableSign: Generator = {
  id: 'calc-table-sign',
  nodeId: 'CALC.table',
  title: 'Locate a zero with a table',
  make(rng): Draft {
    const b = rng.int(-4, 4);
    const c = rng.int(-6, 6);
    const d = rng.nz(-9, 9);
    const f = (x: number) => x ** 3 + b * x * x + c * x + d;
    const zs = rootsOn(f, -10, 10).filter((z) => !Number.isInteger(z));
    if (zs.length !== 1) throw new Reject();
    const z = zs[0];
    const lo = Math.floor(z);
    if (!(f(lo) * f(lo + 1) < 0) || rootsOn(f, -10, 10).length !== 1) throw new Reject();
    const eq = polyTex([1, b, c, d]);
    return {
      cognitive: 'conceptual',
      stem: `A table of values for ${m(`y = ${eq}`)} with ΔTbl = 1 is used to locate its only real zero. Between which two consecutive integers does it lie?`,
      format: 'mc',
      choices: mc({ tex: m(`${lo} \\text{ and } ${lo + 1}`), key: lo }, [
        { tex: m(`${lo - 1} \\text{ and } ${lo}`), key: lo - 1, mis: 'calc-table', feedback: 'Look for where Y1 changes sign.' },
        { tex: m(`${lo + 1} \\text{ and } ${lo + 2}`), key: lo + 1, mis: 'calc-table', feedback: 'Look for where Y1 changes sign.' },
        { tex: m(`${-lo - 1} \\text{ and } ${-lo}`), key: -lo - 1, mis: 'calc-table', feedback: 'Check the sign of each Y1 value.' },
      ]),
      table: { head: ['$x$', '$y$'], rows: [lo - 1, lo, lo + 1, lo + 2].map((x) => [m(x), m(f(x))]) },
      hints: ['A zero sits where y changes sign.', 'Compare consecutive y-values in the table.', `Y1 changes sign between X = ${lo} and X = ${lo + 1}.`],
      solution: [
        { tex: `Y1 at ${m(lo)} is ${m(f(lo))}; at ${m(lo + 1)} it is ${m(f(lo + 1))}.`, why: 'Opposite signs, so the graph crosses the x-axis between them.' },
        { tex: `The zero is between ${m(lo)} and ${m(lo + 1)} (about ${m(fmt(z))}).` },
      ],
      verify: () => f(lo) * f(lo + 1) < 0,
    };
  },
};

const tableSetup: Generator = {
  id: 'calc-table-setup',
  nodeId: 'CALC.table',
  title: 'TBLSET settings',
  make(rng): Draft {
    const start = rng.int(-5, 5);
    const step = rng.pick([0.5, 2, 0.25, 5]);
    const list = [0, 1, 2, 3].map((i) => start + i * step);
    return {
      cognitive: 'conceptual',
      stem: `Which TBLSET settings make the table list ${m(`x = ${list.join(',\\ ')}, \\ldots`)}?`,
      format: 'mc',
      choices: mc({ tex: `TblStart = ${start}, ΔTbl = ${step}`, key: 'ok' }, [
        { tex: `TblStart = ${step}, ΔTbl = ${start}`, key: 'swap', mis: 'calc-table', feedback: 'TblStart is the first x-value; ΔTbl is the step.' },
        { tex: `TblStart = ${start}, ΔTbl = 1`, key: 'one', mis: 'calc-table', feedback: `The x-values go up by ${step}.` },
        { tex: `TblStart = ${list[1]}, ΔTbl = ${step}`, key: 'off', mis: 'calc-table', feedback: `The table starts at ${start}.` },
      ]),
      hints: ['TblStart is the first x-value shown.', 'ΔTbl is how much x goes up each row.', `${k('2nd', 'WINDOW')} opens TBLSET.`],
      solution: [{ tex: `First value ${m(start)}, step ${m(step)}.` }, { tex: `${k('2nd', 'WINDOW')} (TBLSET): TblStart = ${start}, ΔTbl = ${step}; then ${k('2nd', 'GRAPH')} (TABLE).` }],
    };
  },
};

export const calcGenerators: Generator[] = [calcZero, calcIntersect, calcIntersectTrig, calcMax, calcMin, calcRange, modeWhich, modeValue, modeError, windowFit, windowRead, windowSet, tableValue, tableSign, tableSetup];
