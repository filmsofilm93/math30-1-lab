// T4 sinusoidal functions: graphs, parameters, sketching, equations from graphs, models.
import { field, m, mc } from '../../framework';
import { F, Frac } from '../../frac';
import type { AnswerSpec, Draft, Generator, GraphSpec } from '../../types';
import { Reject } from '../../types';
import { nearBoundary, rounded } from '../u3/shared';
import { angleSet, angTex, PI, piLabel, rad, solveSpecial } from './shared';

type R = Parameters<Generator['make']>[0];
/** y = a f[b(x − c)] + d with c in whole degrees; b is unit-free. */
type Sinu = { f: 'sin' | 'cos'; a: number; b: Frac; c: number; d: number };

const period = (s: Sinu) => 360 / s.b.value;
const at = (s: Sinu, xDeg: number) => s.a * (s.f === 'sin' ? Math.sin : Math.cos)(rad(s.b.value * (xDeg - s.c))) + s.d;
const signed = (d: number) => (d === 0 ? '' : d > 0 ? ` + ${d}` : ` - ${-d}`);
const coef = (a: number) => (a === 1 ? '' : a === -1 ? '-' : String(a));
const bTex = (b: Frac) => (b.eq(1) ? '' : b.tex());
const angNum = (d: number, inRad: boolean): AnswerSpec => ({ kind: 'number', value: inRad ? rad(d) : d, tex: inRad ? angTex(d, true) : String(d), exact: true });
const intNum = (v: number): AnswerSpec => ({ kind: 'number', value: v, tex: String(v), exact: true });
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** Argument of the trig function, with the brackets the course uses. */
function argTex(b: Frac, c: number, inRad: boolean): string {
  if (c === 0) return b.d === 1 ? ` ${bTex(b)}x` : `\\left(${bTex(b)}x\\right)`;
  const inner = `x ${c > 0 ? '-' : '+'} ${angTex(Math.abs(c), inRad)}`;
  return b.eq(1) ? `\\left(${inner}\\right)` : `\\left[${bTex(b)}\\left(${inner}\\right)\\right]`;
}
const rhsTex = (s: Sinu, inRad: boolean) => `${coef(s.a)}\\${s.f}${argTex(s.b, s.c, inRad)}${signed(s.d)}`;
const sinTex = (s: Sinu, inRad: boolean) => `y = ${rhsTex(s, inRad)}`;

const B_NICE = [F(2), F(3), F(1, 2), F(1, 3), F(2, 3), F(3, 2)];

/** Random sinusoid. Periods are whole degrees divisible by 4, so quarter points are whole degrees. */
function pickSinu(rng: R, o: { withC?: boolean; bs?: Frac[]; f?: 'sin' | 'cos'; aPos?: boolean } = {}): Sinu {
  const b = rng.pick(o.bs ?? B_NICE);
  const P = 360 / b.value;
  const a = rng.int(2, 6) * (o.aPos || rng.chance(0.7) ? 1 : -1);
  const step = gcd(P / 4, 30);
  const c = o.withC ? rng.pick([-1, 1]) * step * rng.int(1, Math.max(1, Math.min(3, Math.floor(P / 2 / step)))) : 0;
  return { f: o.f ?? rng.pick(['sin', 'cos']), a, b, c, d: rng.int(-4, 5) };
}

/** First maximum at x ≥ 0 (degrees). */
function firstMax(s: Sinu): number {
  const P = period(s);
  const base = s.c + (s.f === 'sin' ? P / 4 : 0) + (s.a < 0 ? P / 2 : 0);
  return ((base % P) + P) % P;
}

const xLab = (deg: number, inRad: boolean) => (inRad ? piLabel(deg) : `${deg}°`);

/** Graph of a sinusoid over about two periods, with optional labelled points (degrees). */
function sinGraph(s: Sinu, inRad: boolean, pts: number[] = []): GraphSpec {
  const P = period(s);
  const lo = Math.min(0, ...pts) - P / 8;
  const hi = Math.max(lo + 2 * P, ...pts.map((p) => p + P / 8));
  let step = gcd(gcd(P / 4, Math.abs(s.c) || P / 4), 90);
  while ((hi - lo) / step > 18) step *= 2;
  const amp = Math.abs(s.a);
  const ylo = Math.min(0, s.d - amp) - 1;
  const yhi = Math.max(0, s.d + amp) + 1;
  const ys = yhi - ylo > 16 ? 2 : 1;
  const k = inRad ? PI / 180 : 1;
  return {
    view: { x: [lo * k, hi * k], y: [ylo, yhi] },
    curves: [{ fn: (x) => at(s, x / k), role: 'image' }],
    points: pts.map((x) => ({ x: x * k, y: at(s, x), label: `(${xLab(x, inRad)}, ${+at(s, x).toFixed(4)})`, kind: 'key' as const })),
    hlines: [{ y: s.d, dashed: true }],
    ticks: { x: step * k, xLabel: 2 * step * k, y: ys, yLabel: 2 * ys, xUnit: inRad ? 'pi' : 'deg' },
  };
}

// ---------------------------------------------------------------- T4.basic-graphs

type Base = 'sin' | 'cos' | 'tan';
const setTex = (ds: number[], inRad: boolean) => ds.map((d) => angTex(d, inRad)).join(', ');

const bgFeature: Generator = {
  id: 'u4-bg-feature',
  nodeId: 'T4.basic-graphs',
  title: 'Features of the sine, cosine and tangent graphs',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.6);
    const A = (d: number) => angTex(d, inRad);
    const fn: Base = tier === 3 ? 'tan' : rng.pick(['sin', 'cos', 'tan']);
    const ask = tier === 1 ? rng.pick(['period', 'range']) : tier === 2 ? rng.pick(fn === 'tan' ? ['zeros'] : ['zeros', 'yint']) : rng.pick(['asym', 'range', 'domain']);
    const q = { period: 'is the period', range: 'is the range', zeros: `are the ${m('x')}-intercepts for ${m(`0 \\le x \\le ${A(360)}`)}`, yint: `is the ${m('y')}-intercept`, asym: 'are the equations of the asymptotes', domain: 'is the domain' }[ask];
    let right = '';
    let cands: { tex: string; key: string; mis: string; feedback?: string }[] = [];
    const R = (lo: string, hi: string) => m(`\\{y \\mid ${lo} \\le y \\le ${hi}, y \\in \\mathbb{R}\\}`);
    const allY = m('\\{y \\mid y \\in \\mathbb{R}\\}');
    if (ask === 'period') {
      const P = fn === 'tan' ? 180 : 360;
      right = m(A(P));
      cands = [180, 360, 90, 720].filter((v) => v !== P).map((v) => ({ tex: m(A(v)), key: String(v), mis: fn === 'tan' ? 'trig-tan-asymptote' : 'trig-period-b', feedback: fn === 'tan' ? 'The tangent pattern repeats between consecutive asymptotes.' : 'One full cycle runs from one maximum to the next.' }));
    } else if (ask === 'range') {
      right = fn === 'tan' ? allY : R('-1', '1');
      cands = [
        { tex: fn === 'tan' ? R('-1', '1') : allY, key: 'swap', mis: fn === 'tan' ? 'trig-tan-asymptote' : 'trig-amplitude-range', feedback: fn === 'tan' ? '$\\tan x$ has no maximum: it grows without bound near each asymptote.' : 'Sine and cosine are bounded by 1 and −1.' },
        { tex: R('-2', '2'), key: '2', mis: 'trig-amplitude-range', feedback: 'The height from minimum to maximum is 2, but the values run from −1 to 1.' },
        { tex: R('0', '1'), key: '01', mis: 'trig-amplitude-range' },
        { tex: m('\\{y \\mid y \\ge 0, y \\in \\mathbb{R}\\}'), key: 'ge', mis: 'trig-amplitude-range' },
      ];
    } else if (ask === 'zeros') {
      const zs = fn === 'cos' ? [90, 270] : [0, 180, 360];
      right = m(setTex(zs, inRad));
      cands = [
        { tex: m(setTex(fn === 'cos' ? [0, 180, 360] : [90, 270], inRad)), key: 'swap', mis: fn === 'tan' ? 'trig-tan-asymptote' : 'trig-unit-xy-swap', feedback: fn === 'tan' ? '$\\tan x = \\frac{\\sin x}{\\cos x}$ is 0 where $\\sin x = 0$; where $\\cos x = 0$ it has asymptotes.' : '$\\sin\\theta$ is the $y$-coordinate on the unit circle and $\\cos\\theta$ the $x$-coordinate.' },
        { tex: m(setTex(fn === 'cos' ? [90] : [0, 360], inRad)), key: 'miss', mis: 'trig-missing-solutions' },
        { tex: m(setTex([0, 90, 180, 270, 360], inRad)), key: 'all', mis: 'trig-tan-asymptote' },
        { tex: m(setTex(fn === 'cos' ? [0, 360] : [180], inRad)), key: 'one', mis: 'trig-domain-ignore' },
      ];
    } else if (ask === 'yint') {
      const y = fn === 'sin' ? 0 : 1;
      right = m(`(0, ${y})`);
      cands = [
        { tex: m(`(0, ${1 - y})`), key: 'swap', mis: 'trig-unit-xy-swap', feedback: `${m(`\\${fn} 0 = ${y}`)}.` },
        { tex: m('(1, 0)'), key: '10', mis: 'trig-unit-xy-swap' },
        { tex: m('(0, -1)'), key: 'm1', mis: 'trig-cast-sign' },
      ];
    } else if (ask === 'asym') {
      right = m(`x = ${A(90)} + ${A(180)} n, n \\in I`);
      cands = [
        { tex: m(`x = ${A(180)} n, n \\in I`), key: 'pi', mis: 'trig-tan-asymptote', feedback: 'At multiples of $180^\\circ$, $\\tan x = 0$: those are the intercepts.' },
        { tex: m(`x = ${A(90)} + ${A(360)} n, n \\in I`), key: '2pi', mis: 'trig-general-period', feedback: `Asymptotes occur every ${m(A(180))}, at both ${m(A(90))} and ${m(A(270))}.` },
        { tex: m(`x = ${A(90)} n, n \\in I`), key: 'half', mis: 'trig-tan-asymptote' },
      ];
    } else {
      right = m(`\\{x \\mid x \\ne ${A(90)} + ${A(180)} n, n \\in I, x \\in \\mathbb{R}\\}`);
      cands = [
        { tex: m('\\{x \\mid x \\in \\mathbb{R}\\}'), key: 'all', mis: 'trig-tan-asymptote', feedback: '$\\tan x$ is not defined where $\\cos x = 0$.' },
        { tex: m(`\\{x \\mid x \\ne ${A(180)} n, n \\in I, x \\in \\mathbb{R}\\}`), key: 'pi', mis: 'trig-tan-asymptote' },
        { tex: m(`\\{x \\mid x \\ne ${A(90)} + ${A(360)} n, n \\in I, x \\in \\mathbb{R}\\}`), key: '2pi', mis: 'trig-general-period' },
      ];
    }
    return {
      cognitive: 'conceptual',
      stem: `For ${m(`y = \\${fn} x`)}${inRad ? ' (x in radians)' : ' (x in degrees)'}, what ${q}?`,
      format: 'mc',
      choices: mc({ tex: right, key: 'r' }, cands),
      hints: [
        'Picture one cycle of the graph from the unit circle.',
        fn === 'tan' ? '$\\tan x = \\frac{\\sin x}{\\cos x}$: zero where $\\sin x = 0$, asymptotes where $\\cos x = 0$.' : `${m(`\\${fn} x`)} is the ${fn === 'sin' ? 'y' : 'x'}-coordinate of the point on the unit circle.`,
        fn === 'tan' ? `Period ${m(A(180))}.` : `Period ${m(A(360))}, values from −1 to 1.`,
      ],
      solution: [
        {
          tex:
            fn === 'tan'
              ? `${m('\\tan x')}: period ${m(A(180))}, intercepts at ${m(`${A(180)} n`)}, asymptotes ${m(`x = ${A(90)} + ${A(180)} n`)}, range all real numbers.`
              : `${m(`\\${fn} x`)}: period ${m(A(360))}, range ${m('-1 \\le y \\le 1')}, ${fn === 'sin' ? `intercepts at ${m(`${A(180)} n`)}, passes through the origin` : `intercepts at ${m(`${A(90)} + ${A(180)} n`)}, ${m('y')}-intercept 1`}.`,
        },
        { tex: `Answer: ${right}.` },
      ],
    };
  },
};

const bgList: Generator = {
  id: 'u4-bg-list',
  nodeId: 'T4.basic-graphs',
  title: 'Intercepts, maxima and asymptotes over a domain',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.6);
    const A = (d: number) => angTex(d, inRad);
    const [lo, hi] = tier === 1 ? [0, 360] : rng.pick([[-360, 360], [0, 720], [-180, 540]]);
    const fn: Base = tier === 3 ? 'tan' : rng.pick(tier === 1 ? ['sin', 'cos'] : ['sin', 'cos', 'tan']);
    const ask = fn === 'tan' ? (tier === 3 ? 'asym' : 'zeros') : rng.pick(tier === 1 ? ['zeros', 'max'] : ['zeros', 'max', 'min']);
    const what = { zeros: `the ${m('x')}-intercepts`, max: `the ${m('x')}-values of the maximum points`, min: `the ${m('x')}-values of the minimum points`, asym: `the ${m('x')}-values of the vertical asymptotes` }[ask];
    const [f, v]: [Base, number] = ask === 'asym' ? ['cos', 0] : ask === 'max' ? [fn, 1] : ask === 'min' ? [fn, -1] : [fn === 'tan' ? 'sin' : fn, 0];
    const sol = solveSpecial(f as 'sin' | 'cos', v, lo, hi + 1);
    return {
      cognitive: 'procedural',
      stem: `For ${m(`y = \\${fn} x`)}, ${m(`${A(lo)} \\le x \\le ${A(hi)}`)}, list ${what}.`,
      format: 'input',
      fields: [field(angleSet(sol, inRad), 'x =', 'Separate values with commas')],
      hints: [
        'Sketch the graph across the whole domain.',
        ask === 'asym' ? '$\\tan x$ has asymptotes where $\\cos x = 0$.' : `${m(`\\${f} x = ${v}`)} at the ${ask === 'zeros' ? 'intercepts' : ask === 'max' ? 'maximum points' : 'minimum points'}.`,
        `The pattern repeats every ${m(A(f === 'cos' && ask === 'asym' ? 180 : ask === 'zeros' ? 180 : 360))}; include both endpoints if they qualify.`,
      ],
      solution: [
        { tex: `${ask === 'asym' ? `Asymptotes where ${m('\\cos x = 0')}` : m(`\\${f} x = ${v}`)}: ${m(ask === 'zeros' || ask === 'asym' ? `x = ${ask === 'asym' || f === 'cos' ? `${A(90)} + ` : ''}${A(180)} n` : `x = ${A(Math.min(...solveSpecial(f as 'sin' | 'cos', v, 0, 360)))} + ${A(360)} n`)}.`, why: 'Read one cycle, then add whole periods.' },
        { tex: `In the domain: ${m(sol.length ? setTex(sol, inRad) : '\\varnothing')}.` },
      ],
    };
  },
};

const BASE_FN: Record<string, (x: number) => number> = { sin: Math.sin, cos: Math.cos, tan: Math.tan, '-sin': (x) => -Math.sin(x), '-cos': (x) => -Math.cos(x) };

const bgIdentify: Generator = {
  id: 'u4-bg-identify',
  nodeId: 'T4.basic-graphs',
  title: 'Identify the graph',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.5);
    const g = rng.pick(tier === 1 ? ['sin', 'cos', 'tan'] : ['sin', 'cos', 'tan', '-sin', '-cos']);
    const k = inRad ? PI / 180 : 1;
    const f = BASE_FN[g];
    const tex = (h: string) => m(`y = ${h.startsWith('-') ? '-' : ''}\\${h.replace('-', '')} x`);
    const mis = (h: string) => (h === 'tan' || g === 'tan' ? 'trig-tan-asymptote' : h.replace('-', '') === g.replace('-', '') ? 'tr-reflect-axis-swap' : 'trig-unit-xy-swap');
    const others = ['sin', 'cos', 'tan', '-sin', '-cos'].filter((h) => h !== g);
    return {
      cognitive: 'conceptual',
      stem: `Which function is graphed? (${inRad ? 'x in radians' : 'x in degrees'})`,
      graph: {
        view: { x: [-360 * k, 360 * k], y: [-3, 3] },
        curves: [{ fn: (x) => f(x / k / (180 / PI)), role: 'image', breaks: g === 'tan' ? [-270, -90, 90, 270].map((d) => d * k) : undefined }],
        ticks: { x: 90 * k, xLabel: 180 * k, xUnit: inRad ? 'pi' : 'deg' },
      },
      format: 'mc',
      choices: mc(
        { tex: tex(g), key: g },
        rng.shuffle(others).map((h) => ({ tex: tex(h), key: h, mis: mis(h) })),
      ),
      hints: ['Start with the $y$-intercept.', '$\\sin 0 = 0$, $\\cos 0 = 1$, $\\tan 0 = 0$.', 'Vertical asymptotes mean tangent. A negative sign reflects the graph in the $x$-axis.'],
      solution: [
        { tex: `${g === 'tan' ? 'Vertical asymptotes at $x = \\pm 90^\\circ, \\pm 270^\\circ$ and an intercept at the origin' : `${m('y')}-intercept ${m(String(f(0)))}, ${g.includes('sin') ? `${g.startsWith('-') ? 'falling' : 'rising'} through the origin` : g.startsWith('-') ? 'a minimum at $x = 0$' : 'a maximum at $x = 0$'}`}.` },
        { tex: `The graph is ${tex(g)}.` },
      ],
    };
  },
};

// ---------------------------------------------------------------- T4.parameters

const parRead: Generator = {
  id: 'u4-par-read',
  nodeId: 'T4.parameters',
  title: 'Read the parameters from the equation',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.6);
    const s = pickSinu(rng, { withC: tier !== 1, bs: tier === 1 ? [...B_NICE, F(4)] : B_NICE });
    const A = (d: number) => angTex(d, inRad);
    const P = period(s);
    const amp = Math.abs(s.a);
    const fields =
      tier === 1
        ? [field(intNum(amp), undefined, 'Amplitude'), field(angNum(P, inRad), undefined, 'Period')]
        : tier === 2
          ? [field(angNum(s.c, inRad), undefined, 'Phase shift (positive = right, negative = left)'), field(intNum(s.d), 'y =', 'Midline')]
          : [field(intNum(s.d + amp), undefined, 'Maximum value'), field(intNum(s.d - amp), undefined, 'Minimum value'), field(angNum(s.c, inRad), undefined, 'Phase shift (positive = right, negative = left)')];
    return {
      cognitive: 'procedural',
      stem: `For ${m(sinTex(s, inRad))}, state the following.`,
      format: 'input',
      fields,
      hints: ['Match the equation to $y = a\\sin[b(x - c)] + d$.', `${m(`\\text{period} = \\frac{${A(360)}}{|b|}`)}; the phase shift is ${m('c')}, read with the sign inside the bracket flipped.`, `Here ${m(`a = ${s.a}`)}, ${m(`b = ${s.b.tex()}`)}, ${m(`c = ${A(s.c)}`)}, ${m(`d = ${s.d}`)}.`],
      solution: [
        { tex: `${m(`a = ${s.a}`)}, ${m(`b = ${s.b.tex()}`)}, ${m(`c = ${A(s.c)}`)}, ${m(`d = ${s.d}`)}.`, why: s.c ? `${m(`x ${s.c > 0 ? '-' : '+'} ${A(Math.abs(s.c))}`)} means a shift ${s.c > 0 ? 'right' : 'left'}.` : 'No horizontal shift.' },
        { tex: `Amplitude ${m(`|a| = ${amp}`)}; period ${m(`\\frac{${A(360)}}{${s.b.tex()}} = ${A(P)}`)}.` },
        { tex: `Midline ${m(`y = ${s.d}`)}; maximum ${m(`${s.d} + ${amp} = ${s.d + amp}`)}, minimum ${m(`${s.d} - ${amp} = ${s.d - amp}`)}.` },
      ],
    };
  },
};

const parMc: Generator = {
  id: 'u4-par-mc',
  nodeId: 'T4.parameters',
  title: 'Period, range and phase shift',
  make(rng, tier): Draft {
    const inRad = rng.chance(0.5);
    const s = pickSinu(rng, { withC: tier === 3, bs: tier === 1 ? [...B_NICE, F(4)] : B_NICE });
    const A = (d: number) => angTex(d, inRad);
    const P = period(s);
    const amp = Math.abs(s.a);
    const bv = s.b.value;
    let q = '';
    let right = '';
    let cands: { tex: string; key: string; mis: string; feedback?: string }[] = [];
    const whole = (v: number) => (Number.isInteger(v) ? v : null);
    if (tier === 1) {
      q = 'the period';
      right = m(A(P));
      cands = [360 * bv, 180 / bv, 360, 720 / bv]
        .map(whole)
        .filter((v): v is number => v !== null)
        .map((v) => ({ tex: m(A(v)), key: String(v), mis: 'trig-period-b', feedback: `Period ${m(`= \\frac{${A(360)}}{|b|}`)}, not ${m(`${A(360)} \\times b`)} or ${m(`\\frac{${A(180)}}{b}`)}.` }));
    } else if (tier === 2) {
      q = 'the range';
      const R = (lo: number, hi: number) => m(`\\{y \\mid ${lo} \\le y \\le ${hi}, y \\in \\mathbb{R}\\}`);
      right = R(s.d - amp, s.d + amp);
      cands = [
        { tex: R(-amp, amp), key: 'nod', mis: 'trig-midline-avg', feedback: `The midline is ${m(`y = ${s.d}`)}, not the ${m('x')}-axis.` },
        { tex: R(s.d - 2 * amp, s.d + 2 * amp), key: '2a', mis: 'trig-amplitude-range', feedback: 'The amplitude is the distance from the midline to a maximum, not maximum to minimum.' },
        { tex: R(Math.min(s.d, s.a), Math.max(s.d, s.a)), key: 'ad', mis: 'trig-amplitude-range' },
        { tex: R(s.d - amp + 1, s.d + amp + 1), key: 'p1', mis: 'tr-k-sign' },
      ];
    } else {
      if (s.b.eq(1)) throw new Reject();
      q = 'the phase shift';
      const dir = (v: number) => `${m(A(Math.abs(v)))} ${v > 0 ? 'right' : 'left'}`;
      right = dir(s.c);
      const bc = s.c * bv;
      const cb = s.c / bv;
      cands = [
        { tex: dir(-s.c), key: 'opp', mis: 'tr-h-sign', feedback: `${m(`x ${s.c > 0 ? '-' : '+'} ${A(Math.abs(s.c))}`)} shifts ${s.c > 0 ? 'right' : 'left'}.` },
        ...(Number.isInteger(bc) ? [{ tex: dir(bc), key: `bc${bc}`, mis: 'trig-phase-not-factored', feedback: 'The bracket already has $b$ factored out: read $c$ directly.' }] : []),
        ...(Number.isInteger(cb) ? [{ tex: dir(cb), key: `cb${cb}`, mis: 'trig-phase-not-factored', feedback: 'The bracket already has $b$ factored out: read $c$ directly.' }] : []),
        ...(Number.isInteger(bc) ? [{ tex: dir(-bc), key: `nbc${bc}`, mis: 'tr-h-sign' }] : []),
        ...(Number.isInteger(cb) ? [{ tex: dir(-cb), key: `ncb${cb}`, mis: 'tr-h-sign' }] : []),
      ];
    }
    return {
      cognitive: 'procedural',
      stem: `What is ${q} of ${m(sinTex(s, inRad))}?`,
      format: 'mc',
      choices: mc({ tex: right, key: 'r' }, cands),
      hints: ['Compare with $y = a\\sin[b(x - c)] + d$.', tier === 1 ? `${m(`\\text{period} = \\frac{${A(360)}}{|b|}`)}.` : tier === 2 ? 'The graph runs from $d - |a|$ to $d + |a|$.' : 'In $b(x - c)$, $c$ is the phase shift: positive means right.', tier === 1 ? `${m(`b = ${s.b.tex()}`)}.` : tier === 2 ? `${m(`|a| = ${amp}`)}, ${m(`d = ${s.d}`)}.` : `${m(`c = ${A(s.c)}`)}.`],
      solution: [
        { tex: `${m(`a = ${s.a}`)}, ${m(`b = ${s.b.tex()}`)}, ${m(`c = ${A(s.c)}`)}, ${m(`d = ${s.d}`)}.` },
        tier === 1
          ? { tex: m(`\\text{period} = \\frac{${A(360)}}{${s.b.tex()}} = ${A(P)}`) }
          : tier === 2
            ? { tex: `${m(`${s.d} - ${amp} \\le y \\le ${s.d} + ${amp}`)}, so ${right}.` }
            : { tex: `Phase shift ${right}.`, why: '$b$ is already factored out of the bracket.' },
      ],
    };
  },
};

const parBuild: Generator = {
  id: 'u4-par-build',
  nodeId: 'T4.parameters',
  title: 'Write the equation from its features',
  make(rng, tier): Draft {
    const s = pickSinu(rng, { withC: tier > 1, f: tier === 3 ? 'cos' : 'sin', aPos: tier < 3 });
    if (tier === 3 && s.a > 0) s.a = -s.a;
    const P = period(s);
    const fnName = s.f === 'sin' ? 'sine' : 'cosine';
    const parts = [`amplitude ${m(String(Math.abs(s.a)))}`, `period ${m(angTex(P, true))}`, ...(s.c ? [`phase shift ${m(angTex(Math.abs(s.c), true))} ${s.c > 0 ? 'right' : 'left'}`] : []), `midline ${m(`y = ${s.d}`)}`];
    return {
      cognitive: 'procedural',
      stem: `Write an equation of a ${fnName} function with ${parts.join(', ')}${tier === 3 ? ', reflected in the $x$-axis' : ''}. Use radians.`,
      format: 'input',
      fields: [field({ kind: 'expr', tex: rhsTex(s, true), variable: 'x', fn: (x) => at(s, (x * 180) / PI), sample: [-3, 3] }, 'y =')],
      hints: [`Use ${m(`y = a\\${s.f}[b(x - c)] + d`)}.`, `${m(`b = \\frac{2\\pi}{\\text{period}}`)}.`, `${m(`b = \\frac{2\\pi}{${angTex(P, true)}} = ${s.b.tex()}`)}.`],
      solution: [
        { tex: `${m(`a = ${s.a}`)}${tier === 3 ? ' (negative for the reflection)' : ''}, ${m(`b = \\frac{2\\pi}{${angTex(P, true)}} = ${s.b.tex()}`)}, ${m(`c = ${angTex(s.c, true)}`)}, ${m(`d = ${s.d}`)}.` },
        { tex: m(sinTex(s, true)), why: 'Any equivalent equation, such as a shifted cosine for a sine, is also correct.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- T4.factor-b

/** sin(bx − k) form with k = b·c. */
function factorForm(rng: R, inRad: boolean, f?: 'sin' | 'cos') {
  const b = rng.pick([F(2), F(3), F(4), F(1, 2)]);
  const c = rng.pick([-1, 1]) * rng.pick(b.eq(F(1, 2)) ? [30, 60, 90, 120] : [15, 30, 45, 60]);
  const k = c * b.value;
  if (!Number.isInteger(k) || (inRad && k % 15 !== 0)) throw new Reject();
  const s: Sinu = { f: f ?? rng.pick(['sin', 'cos']), a: rng.int(2, 5) * (rng.chance(0.75) ? 1 : -1), b, c, d: rng.int(-4, 4) };
  const unfactored = `y = ${coef(s.a)}\\${s.f}\\left(${bTex(b)}x ${k > 0 ? '-' : '+'} ${angTex(Math.abs(k), inRad)}\\right)${signed(s.d)}`;
  return { s, k, unfactored };
}

const fbPhase: Generator = {
  id: 'u4-fb-phase',
  nodeId: 'T4.factor-b',
  title: 'Period and phase shift when b must be factored',
  make(rng, tier): Draft {
    const inRad = tier > 1;
    const { s, k, unfactored } = factorForm(rng, inRad);
    const A = (d: number) => angTex(d, inRad);
    return {
      cognitive: 'procedural',
      stem: `For ${m(unfactored)}, state the period and the phase shift.`,
      format: 'input',
      fields: [field(angNum(period(s), inRad), undefined, 'Period'), field(angNum(s.c, inRad), undefined, 'Phase shift (positive = right, negative = left)')],
      hints: ['Factor $b$ out of the bracket first.', `${m(`${bTex(s.b)}x ${k > 0 ? '-' : '+'} ${A(Math.abs(k))} = ${s.b.tex()}\\left(x ${s.c > 0 ? '-' : '+'} ${A(Math.abs(s.c))}\\right)`)}.`, `Period ${m(`\\frac{${A(360)}}{${s.b.tex()}}`)}.`],
      solution: [
        { tex: m(`y = ${rhsTex(s, inRad)}`), why: `Factor ${m(`b = ${s.b.tex()}`)}: ${m(`\\frac{${A(Math.abs(k))}}{${s.b.tex()}} = ${A(Math.abs(s.c))}`)}.` },
        { tex: `Period ${m(`\\frac{${A(360)}}{${s.b.tex()}} = ${A(period(s))}`)}; phase shift ${m(A(Math.abs(s.c)))} ${s.c > 0 ? 'right' : 'left'}.` },
      ],
    };
  },
};

const fbMc: Generator = {
  id: 'u4-fb-mc',
  nodeId: 'T4.factor-b',
  title: 'Choose the phase shift',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.6);
    const { s, k, unfactored } = factorForm(rng, inRad);
    const A = (d: number) => angTex(d, inRad);
    const dir = (v: number) => `${m(A(Math.abs(v)))} ${v > 0 ? 'right' : 'left'}`;
    const kb = k * s.b.value;
    return {
      cognitive: 'conceptual',
      stem: `What is the phase shift of ${m(unfactored)}?`,
      format: 'mc',
      choices: mc({ tex: dir(s.c), key: s.c }, [
        { tex: dir(k), key: k, mis: 'trig-phase-not-factored', feedback: `Factor first: ${m(`${s.b.tex()}\\left(x ${s.c > 0 ? '-' : '+'} ${A(Math.abs(s.c))}\\right)`)}.` },
        { tex: dir(-s.c), key: -s.c, mis: 'tr-h-sign', feedback: 'Inside the bracket, $x - c$ shifts right by $c$.' },
        { tex: dir(-k), key: -k, mis: 'tr-b-not-factored' },
        ...(Number.isInteger(kb) ? [{ tex: dir(kb), key: kb, mis: 'trig-phase-not-factored' }] : []),
      ]),
      hints: ['The phase shift comes from $b(x - c)$, not $bx - k$.', `Factor ${m(s.b.tex())} out of the bracket.`, `${m(`\\frac{${A(Math.abs(k))}}{${s.b.tex()}} = ${A(Math.abs(s.c))}`)}.`],
      solution: [{ tex: m(`y = ${rhsTex(s, inRad)}`), why: 'Factor $b$ out of the argument.' }, { tex: `Phase shift ${dir(s.c)}.` }],
    };
  },
};

const fbRewrite: Generator = {
  id: 'u4-fb-rewrite',
  nodeId: 'T4.factor-b',
  title: 'Rewrite in factored form',
  make(rng, tier): Draft {
    const inRad = tier > 1;
    const { s, k, unfactored } = factorForm(rng, inRad);
    const A = (d: number) => angTex(d, inRad);
    const alt = (c: number) => `y = ${rhsTex({ ...s, c }, inRad)}`;
    return {
      cognitive: 'procedural',
      stem: `Which equation is ${m(unfactored)} written in the form ${m('y = a\\sin[b(x - c)] + d')} (or cosine)?`,
      format: 'mc',
      choices: mc({ tex: m(alt(s.c)), key: s.c }, [
        { tex: m(alt(k)), key: k, mis: 'trig-phase-not-factored', feedback: `Expanding this does not give back ${m(`${A(Math.abs(k))}`)}: divide ${m(A(Math.abs(k)))} by ${m(s.b.tex())} when factoring.` },
        { tex: m(alt(-s.c)), key: -s.c, mis: 'tr-h-sign' },
        { tex: m(`y = ${coef(s.a)}\\${s.f}\\left[${bTex(s.b)}x ${s.c > 0 ? '-' : '+'} ${A(Math.abs(s.c))}\\right]${signed(s.d)}`), key: 'nofactor', mis: 'trig-phase-not-factored', feedback: 'That divides only the constant by $b$; $b$ must multiply the whole bracket.' },
      ]),
      hints: ['Factor the coefficient of $x$ out of the argument.', `${m(`${bTex(s.b)}x ${k > 0 ? '-' : '+'} ${A(Math.abs(k))} = ${s.b.tex()}(x \\; ? \\;)`)}.`, 'Check by expanding your answer.'],
      solution: [
        { tex: m(`${bTex(s.b)}x ${k > 0 ? '-' : '+'} ${A(Math.abs(k))} = ${s.b.tex()}\\left(x ${s.c > 0 ? '-' : '+'} ${A(Math.abs(s.c))}\\right)`), why: 'Divide each term by $b$.' },
        { tex: m(alt(s.c)) },
      ],
    };
  },
};

// ---------------------------------------------------------------- T4.sketch

const skCycle: Generator = {
  id: 'u4-sk-cycle',
  nodeId: 'T4.sketch',
  title: 'Key points of one cycle',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.6);
    const s = pickSinu(rng, { withC: tier > 1, bs: [F(2), F(3), F(1, 2), F(2, 3), F(3, 2)] });
    const A = (d: number) => angTex(d, inRad);
    const P = period(s);
    const list = (start: number, q: number) => m([0, 1, 2, 3, 4].map((i) => A(start + i * q)).join(',\\ '));
    const wrongP = 360 * s.b.value;
    return {
      cognitive: 'procedural',
      stem: `To sketch one cycle of ${m(sinTex(s, inRad))}, start at the phase shift and mark points every quarter period. Which list gives the ${m('x')}-coordinates of the five key points?`,
      format: 'mc',
      choices: mc({ tex: list(s.c, P / 4), key: 'r' }, [
        ...(Number.isInteger(wrongP / 4) ? [{ tex: list(s.c, wrongP / 4), key: 'pb', mis: 'trig-period-b', feedback: `Period ${m(`\\frac{${A(360)}}{${s.b.tex()}} = ${A(P)}`)}, so a quarter period is ${m(A(P / 4))}.` }] : []),
        ...(s.c ? [{ tex: list(-s.c, P / 4), key: 'sign', mis: 'tr-h-sign', feedback: `${m(`x ${s.c > 0 ? '-' : '+'} ${A(Math.abs(s.c))}`)} moves the cycle ${s.c > 0 ? 'right' : 'left'}.` }] : []),
        { tex: list(s.c, P / 2), key: 'half', mis: 'wr-sketch-features', feedback: 'The five key points are a quarter period apart: max, midline, min, midline, max (or starting on the midline for sine).' },
        { tex: list(s.c, P), key: 'full', mis: 'wr-sketch-features' },
        { tex: list(0, P / 4), key: 'zero', mis: 'tr-h-sign' },
      ]),
      hints: [`Period ${m(`= \\frac{${A(360)}}{|b|}`)}.`, 'One cycle has five key points, a quarter period apart.', `Start at ${m(`x = ${A(s.c)}`)}, step ${m(A(P / 4))}.`],
      solution: [
        { tex: `Period ${m(`\\frac{${A(360)}}{${s.b.tex()}} = ${A(P)}`)}, quarter period ${m(A(P / 4))}.` },
        { tex: `Start at ${m(A(s.c))}: ${list(s.c, P / 4)}.`, why: s.f === 'sin' ? 'A sine cycle starts on the midline.' : 'A cosine cycle starts at a maximum (a minimum if $a < 0$).' },
      ],
    };
  },
};

const skMax: Generator = {
  id: 'u4-sk-max',
  nodeId: 'T4.sketch',
  title: 'First maximum point',
  make(rng, tier): Draft {
    const inRad = tier === 3;
    const s = pickSinu(rng, { withC: tier > 1, bs: [F(1), F(2), F(3), F(1, 2), F(2, 3), F(3, 2)] });
    const A = (d: number) => angTex(d, inRad);
    const P = period(s);
    const xm = firstMax(s);
    const amp = Math.abs(s.a);
    return {
      cognitive: 'procedural',
      stem: `State the coordinates of the first maximum point of ${m(sinTex(s, inRad))} with ${m('x \\ge 0')}.`,
      format: 'input',
      fields: [field(angNum(xm, inRad), 'x =', inRad ? 'x (exact, radians)' : 'x (degrees)'), field(intNum(s.d + amp), 'y =')],
      hints: [s.f === 'sin' ? '$y = \\sin x$ has its first maximum a quarter period after the start of a cycle.' : '$y = \\cos x$ starts its cycle at a maximum.', `${s.a < 0 ? 'Negative $a$ swaps maxima and minima: add half a period. ' : ''}Then apply the phase shift ${m(A(s.c))}.`, `Period ${m(A(P))}; add or subtract whole periods to land at the smallest ${m('x \\ge 0')}.`],
      solution: [
        { tex: `Period ${m(A(P))}. A maximum of the cycle starting at ${m(A(s.c))} is at ${m(A(s.c + (s.f === 'sin' ? P / 4 : 0) + (s.a < 0 ? P / 2 : 0)))}.`, why: `${s.f === 'sin' ? 'Sine peaks a quarter period in' : 'Cosine starts at its peak'}${s.a < 0 ? '; reflecting moves the peak half a period' : ''}.` },
        { tex: `Smallest ${m('x \\ge 0')}: ${m(`x = ${A(xm)}`)}; maximum value ${m(`${s.d} + ${amp} = ${s.d + amp}`)}.` },
      ],
    };
  },
};

const skScale: Generator = {
  id: 'u4-sk-scale',
  nodeId: 'T4.sketch',
  title: 'Scale the axes',
  make(rng, tier): Draft {
    const inRad = tier === 3 || (tier === 2 && rng.chance(0.5));
    const L = tier === 1 ? 360 : 720;
    const s = pickSinu(rng, { withC: false, bs: tier === 1 ? [F(1), F(2), F(3)] : [F(1, 2), F(3, 2), F(2), F(3)] });
    const A = (d: number) => angTex(d, inRad);
    const P = period(s);
    return {
      cognitive: 'procedural',
      stem: `You sketch ${m(sinTex(s, inRad))} on ${m(`0 \\le x \\le ${A(L)}`)} with one ${m('x')}-grid line per key point. State the grid spacing and the number of complete cycles shown.`,
      format: 'input',
      fields: [field(angNum(P / 4, inRad), undefined, 'Grid spacing (a quarter period)'), field(intNum(L / P), undefined, 'Complete cycles')],
      hints: [`Period ${m(`= \\frac{${A(360)}}{|b|}`)}.`, 'Key points are a quarter period apart.', `Cycles ${m(`= \\frac{\\text{domain length}}{\\text{period}}`)}.`],
      solution: [
        { tex: `Period ${m(`\\frac{${A(360)}}{${s.b.tex()}} = ${A(P)}`)}, so spacing ${m(A(P / 4))}.` },
        { tex: `${m(`\\frac{${A(L)}}{${A(P)}} = ${L / P}`)} complete cycles.` },
      ],
    };
  },
};

// ---------------------------------------------------------------- T4.equation-from-graph

const efgParams: Generator = {
  id: 'u4-efg-params',
  nodeId: 'T4.equation-from-graph',
  title: 'Parameters from a graph',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.6);
    const s = pickSinu(rng, { withC: tier > 1, bs: tier === 1 ? [F(1), F(2), F(1, 2)] : B_NICE });
    const A = (d: number) => angTex(d, inRad);
    const P = period(s);
    const xm = firstMax(s);
    const xn = xm + P / 2;
    const amp = Math.abs(s.a);
    const M = s.d + amp;
    const mn = s.d - amp;
    return {
      cognitive: 'procedural',
      stem: `The graph shows a sinusoidal function with a maximum at ${m(`(${A(xm)}, ${M})`)} and the next minimum at ${m(`(${A(xn)}, ${mn})`)}. State its amplitude, midline and period.`,
      graph: sinGraph(s, inRad, [xm, xn]),
      format: 'input',
      fields: [field(intNum(amp), undefined, 'Amplitude'), field(intNum(s.d), 'y =', 'Midline'), field(angNum(P, inRad), undefined, 'Period')],
      hints: ['Amplitude and midline come from the maximum and minimum values.', `${m('a = \\frac{\\max - \\min}{2}')}, ${m('d = \\frac{\\max + \\min}{2}')}.`, 'A maximum to the next minimum is half a period.'],
      solution: [
        { tex: m(`a = \\frac{${M} - (${mn})}{2} = ${amp}`), why: 'Half the vertical distance from max to min.' },
        { tex: m(`d = \\frac{${M} + (${mn})}{2} = ${s.d}`), why: 'The midline is halfway between max and min.' },
        { tex: m(`\\text{period} = 2\\left(${A(xn)} - ${A(xm)}\\right) = ${A(P)}`), why: 'Max to next min is half a cycle.' },
      ],
    };
  },
};

const efgMc: Generator = {
  id: 'u4-efg-mc',
  nodeId: 'T4.equation-from-graph',
  title: 'Choose the equation of the graph',
  make(rng, tier): Draft {
    const inRad = tier > 1 && rng.chance(0.6);
    const s = pickSinu(rng, { withC: tier === 3, bs: [F(2), F(3), F(1, 2), F(1, 3)], aPos: true });
    const A = (d: number) => angTex(d, inRad);
    const P = period(s);
    const xm = firstMax(s);
    const xn = xm + P / 2;
    const amp = Math.abs(s.a);
    const t = (o: Partial<Sinu>) => m(sinTex({ ...s, ...o }, inRad));
    return {
      cognitive: 'procedural',
      stem: 'Which equation matches the graph?',
      graph: sinGraph(s, inRad, [xm, xn]),
      format: 'mc',
      choices: mc({ tex: t({}), key: 'r' }, [
        { tex: t({ a: 2 * amp }), key: '2a', mis: 'trig-amplitude-range', feedback: `Amplitude is half of ${m(`${s.d + amp} - (${s.d - amp})`)}.` },
        { tex: t({ d: s.d + amp }), key: 'dmax', mis: 'trig-midline-avg', feedback: 'The midline is halfway between the maximum and minimum.' },
        { tex: t({ b: F(s.b.d, s.b.n) }), key: 'binv', mis: 'trig-period-b', feedback: `Period ${m(A(P))} gives ${m(`b = \\frac{${A(360)}}{${A(P)}} = ${s.b.tex()}`)}.` },
        ...(s.c ? [{ tex: t({ c: -s.c }), key: 'csign', mis: 'tr-h-sign' }] : []),
      ]),
      hints: ['Read max and min values first.', `Max ${m(String(s.d + amp))}, min ${m(String(s.d - amp))}: amplitude and midline.`, `Max to next min is half a period: ${m(`\\text{period} = ${A(P)}`)}.`],
      solution: [
        { tex: `${m(`a = \\frac{${s.d + amp} - (${s.d - amp})}{2} = ${amp}`)}, ${m(`d = ${s.d}`)}.` },
        { tex: `${m(`\\text{period} = ${A(P)}`)}, so ${m(`b = \\frac{${A(360)}}{${A(P)}} = ${s.b.tex()}`)}.` },
        { tex: `${s.f === 'sin' ? 'A sine cycle starts on the midline going up' : 'A cosine cycle starts at a maximum'}: ${m(`c = ${A(s.c)}`)}, so ${t({})}.` },
      ],
    };
  },
};

const efgData: Generator = {
  id: 'u4-efg-data',
  nodeId: 'T4.equation-from-graph',
  title: 'Equation from a maximum and a minimum',
  make(rng, tier): Draft {
    const half = rng.pick([1, 2, 3, 4, 6]);
    const amp = rng.int(2, 8);
    const D = rng.int(-3, 10);
    const x1 = tier === 1 ? 0 : rng.int(1, 5);
    const x2 = x1 + half;
    const bTex2 = half === 1 ? '\\pi' : `\\frac{\\pi}{${half}}`;
    const fn = (x: number) => amp * Math.cos((PI / half) * (x - x1)) + D;
    const minFirst = tier === 3;
    const pts = minFirst ? `a minimum at ${m(`(${x2}, ${D - amp})`)} and the previous maximum at ${m(`(${x1}, ${D + amp})`)}` : `a maximum at ${m(`(${x1}, ${D + amp})`)} and the next minimum at ${m(`(${x2}, ${D - amp})`)}`;
    const ans = `${amp}\\cos\\left[${bTex2}${x1 ? `\\left(x - ${x1}\\right)` : ' x'}\\right]${signed(D)}`;
    return {
      cognitive: 'problemSolving',
      stem: `A sinusoidal function has ${pts}. Write an equation for the function.`,
      format: 'input',
      fields: [field({ kind: 'expr', tex: ans, variable: 'x', fn, sample: [x1 - 2 * half, x1 + 2 * half] }, 'y =')],
      hints: ['Cosine starts at a maximum, so use the maximum as the start of a cycle.', `Period ${m(`= 2(${x2} - ${x1}) = ${2 * half}`)}; ${m('b = \\frac{2\\pi}{\\text{period}}')}.`, `${m(`a = \\frac{${D + amp} - (${D - amp})}{2}`)}, ${m(`d = \\frac{${D + amp} + (${D - amp})}{2}`)}.`],
      solution: [
        { tex: `${m(`a = ${amp}`)}, ${m(`d = ${D}`)}.`, why: 'Half the max-to-min distance; the average of max and min.' },
        { tex: `${m(`\\text{period} = ${2 * half}`)}, ${m(`b = \\frac{2\\pi}{${2 * half}} = ${bTex2}`)}.` },
        { tex: `Maximum at ${m(`x = ${x1}`)}: ${m(`y = ${ans}`)}.`, why: 'Any equivalent sine or cosine equation is also correct.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- T4.model

const modFerris: Generator = {
  id: 'u4-mod-ferris',
  nodeId: 'T4.model',
  title: 'Ferris wheel height',
  make(rng, tier): Draft {
    const r = rng.pick([10, 12, 15, 20, 25, 30, 40]);
    const gap = rng.int(1, 4);
    const H = r + gap;
    const T = rng.pick([2, 3, 4, 5, 6, 8, 10]);
    const h = (t: number) => -r * Math.cos(((2 * PI) / T) * t) + H;
    const bt = T === 2 ? '\\pi' : T % 2 === 0 ? `\\frac{\\pi}{${T / 2}}` : `\\frac{2\\pi}{${T}}`;
    const eq = `h(t) = -${r}\\cos\\left(${bt} t\\right) + ${H}`;
    const ctx = `A Ferris wheel has a diameter of ${2 * r} m, its lowest seat is ${gap} m above the ground, and it makes one rotation every ${T} min. A rider boards at the bottom at ${m('t = 0')}.`;
    if (tier === 1) {
      return {
        cognitive: 'problemSolving',
        stem: `${ctx} Write an equation for the rider's height ${m('h')}, in metres, after ${m('t')} minutes.`,
        format: 'input',
        fields: [field({ kind: 'expr', tex: eq.replace('h(t) = ', ''), variable: 't', fn: h, sample: [0, T] }, 'h(t) =')],
        hints: ['Starting at the bottom means a reflected cosine (or a shifted sine).', `Amplitude = radius ${m(String(r))}; the axle is at ${m(`${r} + ${gap} = ${H}`)} m.`, `${m(`b = \\frac{2\\pi}{${T}}`)}.`],
        solution: [
          { tex: `${m(`a = -${r}`)}, ${m(`d = ${H}`)}, ${m(`b = \\frac{2\\pi}{${T}} = ${bt}`)}.`, why: 'Minimum at t = 0, so use −cos.' },
          { tex: m(eq) },
        ],
      };
    }
    if (tier === 2) {
      const t0 = rng.int(1, 10 * T - 1) / 10;
      const v = h(t0);
      if (nearBoundary(v, 1) || t0 * 4 === Math.round(t0 * 4) / 1) throw new Reject();
      return {
        cognitive: 'problemSolving',
        stem: `${ctx} The height is ${m(eq)}. What is the rider's height after ${t0} min, to the nearest tenth of a metre?`,
        format: 'input',
        fields: [field(rounded(v, 1), 'h =', 'Metres')],
        hints: ['Substitute the time into the equation.', 'Put the calculator in radian mode.', `${m(`h(${t0}) = -${r}\\cos\\left(${bt} \\cdot ${t0}\\right) + ${H}`)}.`],
        solution: [{ tex: m(`h(${t0}) = -${r}\\cos\\left(${bt}(${t0})\\right) + ${H} \\approx ${rounded(v, 1).tex}`), why: 'Radian mode: the argument is in radians.' }, { tex: `About ${rounded(v, 1).tex} m.` }],
      };
    }
    const target = rng.int(gap + 2, 2 * r + gap - 2);
    const t1 = (T / (2 * PI)) * Math.acos((H - target) / r);
    if (nearBoundary(t1, 1)) throw new Reject();
    return {
      cognitive: 'problemSolving',
      stem: `${ctx} The height is ${m(eq)}. How long after boarding does the rider first reach ${target} m? Give the time to the nearest tenth of a minute.`,
      format: 'input',
      fields: [field(rounded(t1, 1), 't =', 'Minutes')],
      hints: ['Set the equation equal to the target height.', `Graph ${m(`y_1 = ${eq.replace('h(t) = ', '').replace(/(?<![a-zA-Z\\])t(?![a-zA-Z])/g, 'x')}`)} and ${m(`y_2 = ${target}`)}; find the first intersection.`, `Or solve ${m(`\\cos\\left(${bt} t\\right) = \\frac{${H} - ${target}}{${r}}`)} in radian mode.`],
      solution: [
        { tex: m(`\\cos\\left(${bt} t\\right) = \\frac{${H - target}}{${r}}`), why: 'Isolate the cosine.' },
        { tex: m(`${bt}t = \\cos^{-1}\\left(\\frac{${H - target}}{${r}}\\right) \\approx ${((2 * PI) / T * t1).toFixed(4)}`), why: 'The first solution lies in the first half-rotation.' },
        { tex: m(`t \\approx ${rounded(t1, 1).tex}`), why: 'Minutes after boarding.' },
      ],
    };
  },
};

const modTide: Generator = {
  id: 'u4-mod-tide',
  nodeId: 'T4.model',
  title: 'Tides and daylight',
  make(rng, tier): Draft {
    const amp = rng.pick([1.5, 2, 2.5, 3, 3.5, 4, 5]);
    const D = rng.pick([4, 5, 6, 7, 8, 10]);
    const t1 = rng.int(1, 5);
    const P = 12;
    const depth = (t: number) => amp * Math.cos((PI / 6) * (t - t1)) + D;
    const ctx = `In a harbour, high tide is ${D + amp} m at ${t1}:00 and the next low tide is ${D - amp} m at ${t1 + 6}:00. The depth is sinusoidal.`;
    if (tier === 1) {
      return {
        cognitive: 'problemSolving',
        stem: `${ctx} State the amplitude, the midline depth and the period in hours.`,
        format: 'input',
        fields: [field({ kind: 'number', value: amp, tex: String(amp) }, undefined, 'Amplitude (m)'), field({ kind: 'number', value: D, tex: String(D) }, 'y =', 'Midline (m)'), field(intNum(P), undefined, 'Period (h)')],
        hints: ['High to low tide is half a cycle.', `${m('a = \\frac{\\max - \\min}{2}')}, ${m('d = \\frac{\\max + \\min}{2}')}.`, 'Period = 2 × (time from high to low).'],
        solution: [{ tex: `${m(`a = \\frac{${D + amp} - ${D - amp}}{2} = ${amp}`)}, ${m(`d = \\frac{${D + amp} + ${D - amp}}{2} = ${D}`)}.` }, { tex: `Period ${m('2 \\times 6 = 12')} h.` }],
      };
    }
    const eq = `d(t) = ${amp}\\cos\\left[\\frac{\\pi}{6}(t - ${t1})\\right] + ${D}`;
    if (tier === 2) {
      const t0 = rng.int(t1 * 10 + 5, (t1 + 12) * 10) / 10;
      if (Math.abs((t0 - t1) % 3) < 1e-9) throw new Reject();
      const v = depth(t0);
      if (nearBoundary(v, 1)) throw new Reject();
      const hh = Math.floor(t0);
      const mm = Math.round((t0 - hh) * 60);
      return {
        cognitive: 'problemSolving',
        stem: `${ctx} The depth is ${m(eq)}, ${m('t')} hours after midnight. What is the depth at ${hh}:${String(mm).padStart(2, '0')}, to the nearest tenth of a metre?`,
        format: 'input',
        fields: [field(rounded(v, 1), 'd =', 'Metres')],
        hints: ['Convert the clock time to hours after midnight.', `${m(`t = ${t0}`)}.`, 'Use radian mode.'],
        solution: [{ tex: `${hh}:${String(mm).padStart(2, '0')} is ${m(`t = ${t0}`)}.` }, { tex: m(`d(${t0}) = ${amp}\\cos\\left[\\frac{\\pi}{6}(${t0} - ${t1})\\right] + ${D} \\approx ${rounded(v, 1).tex}`), why: 'Radian mode.' }],
      };
    }
    const k = rng.int(Math.ceil(D - amp) + 1, Math.floor(D + amp) - 1);
    if (k === D) throw new Reject();
    const dur = (P * Math.acos((k - D) / amp)) / PI;
    if (nearBoundary(dur, 1)) throw new Reject();
    return {
      cognitive: 'problemSolving',
      stem: `${ctx} The depth is ${m(eq)}. A ship needs at least ${k} m of water. For how many hours in each 12-hour cycle can it enter? Answer to the nearest tenth of an hour.`,
      format: 'input',
      fields: [field(rounded(dur, 1), undefined, 'Hours')],
      hints: [`Find when ${m(`d(t) = ${k}`)} on either side of high tide.`, `Graph ${m(`y_1 = ${eq.replace('d(t) = ', '').replace(/(?<![a-zA-Z\\])t(?![a-zA-Z])/g, 'x')}`)} and ${m(`y_2 = ${k}`)}; find the two intersections around ${m(`x = ${t1}`)}.`, 'The safe time is the gap between those intersections.'],
      solution: [
        { tex: m(`\\cos\\left[\\frac{\\pi}{6}(t - ${t1})\\right] = \\frac{${k} - ${D}}{${amp}}`), why: 'Isolate the cosine.' },
        { tex: m(`\\frac{\\pi}{6}(t - ${t1}) = \\pm ${Math.acos((k - D) / amp).toFixed(4)}`), why: 'Symmetric about high tide.' },
        { tex: m(`t - ${t1} = \\pm ${((6 / PI) * Math.acos((k - D) / amp)).toFixed(3)}`), why: 'So the window is twice this.' },
        { tex: `About ${m(rounded(dur, 1).tex)} h per cycle.` },
      ],
    };
  },
};

const modMc: Generator = {
  id: 'u4-mod-mc',
  nodeId: 'T4.model',
  title: 'Interpret a sinusoidal model',
  make(rng, tier): Draft {
    const a = rng.int(3, 9);
    const c = rng.int(5, 10);
    const d = rng.int(4, 18);
    const eq = `T(t) = ${a}\\sin\\left[\\frac{\\pi}{12}(t - ${c})\\right] + ${d}`;
    const ctx = `The temperature, in °C, ${m('t')} hours after midnight is modelled by ${m(eq)}.`;
    if (tier === 1) {
      return {
        cognitive: 'conceptual',
        stem: `${ctx} What is the maximum temperature?`,
        format: 'mc',
        choices: mc({ tex: `${d + a} °C`, key: d + a }, [
          { tex: `${a} °C`, key: a, mis: 'trig-amplitude-range', feedback: `The amplitude is how far above the midline ${m(String(d))} the maximum is.` },
          { tex: `${d} °C`, key: d, mis: 'trig-midline-avg', feedback: 'That is the midline, the average temperature.' },
          { tex: `${d + 2 * a} °C`, key: d + 2 * a, mis: 'trig-amplitude-range' },
        ]),
        hints: ['Maximum = midline + amplitude.', `Midline ${m(String(d))}, amplitude ${m(String(a))}.`, `${m(`${d} + ${a}`)}.`],
        solution: [{ tex: m(`T_{\\max} = d + |a| = ${d} + ${a} = ${d + a}`), why: 'The sine part is at most 1.' }],
      };
    }
    if (tier === 2) {
      const tm = c + 6;
      return {
        cognitive: 'conceptual',
        stem: `${ctx} At what time of day is the temperature highest?`,
        format: 'mc',
        choices: mc({ tex: `${tm % 24}:00`, key: tm % 24 }, [
          { tex: `${c}:00`, key: c, mis: 'tr-h-sign', feedback: `At ${m(`t = ${c}`)} the sine cycle starts on the midline, rising.` },
          { tex: `${(c + 12) % 24}:00`, key: (c + 12) % 24, mis: 'trig-period-b', feedback: 'Half a period after the start is back on the midline, falling.' },
          { tex: `${(c + 18) % 24}:00`, key: (c + 18) % 24, mis: 'trig-cast-sign', feedback: 'Three quarters of a period after the start is the minimum.' },
        ]),
        hints: ['Period = 2π ÷ (π/12) = 24 h.', `A sine cycle starts on the midline at ${m(`t = ${c}`)} and peaks a quarter period later.`, `${m(`${c} + 6`)}.`],
        solution: [{ tex: m('\\text{period} = \\frac{2\\pi}{\\pi/12} = 24'), why: 'Hours.' }, { tex: m(`t = ${c} + \\frac{24}{4} = ${tm}`), why: 'Maximum a quarter period after the start.' }],
      };
    }
    const t0 = rng.int(0, 23);
    if ((t0 - c) % 6 === 0) throw new Reject();
    const v = a * Math.sin((PI / 12) * (t0 - c)) + d;
    const vDeg2 = a * Math.sin(((PI / 12) * (t0 - c) * PI) / 180) + d;
    const vFlip = a * Math.sin((PI / 12) * (t0 + c)) + d;
    const r1 = (x: number) => x.toFixed(1);
    return {
      cognitive: 'procedural',
      stem: `${ctx} What is the temperature at ${t0}:00, to the nearest tenth of a degree?`,
      format: 'mc',
      choices: mc({ tex: `${r1(v)} °C`, key: r1(v) }, [
        { tex: `${r1(vDeg2)} °C`, key: r1(vDeg2), mis: 'trig-deg-rad-mode', feedback: 'That comes from degree mode. The model uses radians.' },
        { tex: `${r1(vFlip)} °C`, key: r1(vFlip), mis: 'tr-h-sign' },
        { tex: `${r1(d)} °C`, key: r1(d), mis: 'trig-midline-avg' },
        { tex: `${r1(-v + 2 * d)} °C`, key: r1(-v + 2 * d), mis: 'trig-cast-sign' },
      ]),
      hints: ['Substitute $t$ in hours after midnight.', 'The calculator must be in radian mode.', `${m(`T(${t0}) = ${a}\\sin\\left[\\frac{\\pi}{12}(${t0} - ${c})\\right] + ${d}`)}.`],
      solution: [{ tex: m(`T(${t0}) = ${a}\\sin\\left[\\frac{\\pi}{12}(${t0 - c})\\right] + ${d} \\approx ${r1(v)}`), why: 'Radian mode.' }],
    };
  },
};

export const graphGenerators: Generator[] = [bgFeature, bgList, bgIdentify, parRead, parMc, parBuild, fbPhase, fbMc, fbRewrite, skCycle, skMax, skScale, efgParams, efgMc, efgData, modFerris, modTide, modMc];
