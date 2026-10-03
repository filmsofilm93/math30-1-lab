// RF14 rational functions: asymptotes vs holes, intercepts, domain and range, sketching, equations.
import { setBuilderTex, type RealSet } from '../../check/realset';
import { field, m, mc, pkey, type Cand } from '../../framework';
import { F, Frac, polyTex, ptTex, signedTex } from '../../frac';
import { analyze, evalExact, L, linTex, ratGraph, ratTex, zeroOf, type Analysis, type Lin, type RatFn } from '../../rational';
import type { Rng } from '../../rng';
import type { AnswerSpec, Draft, Generator, Tier } from '../../types';
import { Reject } from '../../types';
import { num, setAns, solutionText } from '../pre/shared';
import { distinct, pickRat, realSetAns, type RatKind } from './shared';

const fx = (r: RatFn, form: 'factored' | 'expanded') => `f(x) = ${ratTex(r, form)}`;
const formFor = (tier: Tier) => (tier === 1 ? 'factored' : 'expanded');
const xs = (vs: Frac[]) => (vs.length ? vs.map((v) => v.tex()).join(', ') : '\\text{none}');
const fracSet = (vs: Frac[]) => setAns(vs);

/** Factored form line for solutions: f(x) = …(x − h)/(…)(x − h) with the cancelled factor shown. */
function factorStep(r: RatFn, a: Analysis): string {
  const cancel = a.holes.length ? `, \\ x \\ne ${a.holes.map((h) => h.x.tex()).join(', ')}` : '';
  return `${m(`f(x) = ${ratTex(r)}`)}${a.holes.length ? ` ${m(`= ${ratTex(a.simplified)}${cancel}`)}` : ''}`;
}

/** Picks a function and rejects degenerate cases (hole on the x-axis, crowded features, huge values). */
function pick(rng: Rng, kinds: RatKind[], ok: (a: Analysis) => boolean = () => true, tier: Tier = 2): { r: RatFn; a: Analysis } {
  const r = pickRat(rng, rng.pick(kinds), tier === 1 ? 1 : 3);
  const a = analyze(r);
  if (a.holes.some((h) => h.y.n === 0)) throw new Reject();
  if (a.holes.some((h) => Math.abs(h.y.value) > 12 || h.y.d > 12)) throw new Reject();
  if (!ok(a)) throw new Reject();
  return { r, a };
}

const holeTex = (a: Analysis) => (a.holes.length ? a.holes.map((h) => ptTex(h.x, h.y)).join(', ') : '\\varnothing');

// ---------------------------------------------------------------- RF14.va-vs-hole

const ratClassify: Generator = {
  id: 'u5-rat-classify',
  nodeId: 'RF14.va-vs-hole',
  title: 'Asymptote or point of discontinuity?',
  make(rng, tier): Draft {
    const { r, a } = pick(rng, ['lin-hole', 'const-hole', 'line-hole', 'lin-hole'], undefined, tier);
    const atHole = a.vas.length === 0 || rng.chance(0.5);
    const t = atHole ? a.holes[0].x : rng.pick(a.vas);
    const ANS = { va: `a vertical asymptote at ${m(`x = ${t.tex()}`)}`, hole: `a point of discontinuity (hole) at ${m(`x = ${t.tex()}`)}`, xint: `an ${m('x')}-intercept at ${m(`x = ${t.tex()}`)}`, both: `both a vertical asymptote and a hole at ${m(`x = ${t.tex()}`)}` };
    const right = atHole ? 'hole' : 'va';
    return {
      cognitive: 'conceptual',
      stem: `What does the graph of ${m(fx(r, formFor(tier)))} have at ${m(`x = ${t.tex()}`)}?`,
      format: 'mc',
      choices: mc({ tex: ANS[right], key: right }, [
        atHole
          ? { tex: ANS.va, key: 'va', mis: 'rat-hole-as-va', feedback: `${m(linTex(L(t.n, t.d)))} cancels, so the graph is only missing one point there.` }
          : { tex: ANS.hole, key: 'hole', mis: 'rat-va-as-hole', feedback: `${m(linTex(L(t.n, t.d)))} stays in the denominator after simplifying: an asymptote.` },
        { tex: ANS.xint, key: 'xint', mis: atHole ? 'rat-xint-at-hole' : 'rat-xint-from-denominator', feedback: 'A zero of the denominator never gives an $x$-intercept: the function is not defined there.' },
        { tex: ANS.both, key: 'both', mis: atHole ? 'rat-hole-as-va' : 'rat-va-as-hole' },
      ]),
      hints: ['Factor the numerator and denominator.', 'A factor that cancels gives a hole; a denominator factor that remains gives a vertical asymptote.', `Look at the factor ${m(linTex(L(t.n, t.d)))}.`],
      solution: [
        { tex: factorStep(r, a), why: 'Factor fully, then cancel common factors.' },
        { tex: atHole ? `${m(linTex(L(t.n, t.d)))} cancels: hole at ${m(`x = ${t.tex()}`)}.` : `${m(linTex(L(t.n, t.d)))} remains in the denominator: vertical asymptote ${m(`x = ${t.tex()}`)}.`, why: atHole ? 'The simplified function is defined there, but the original is not: one missing point.' : 'Near this $x$ the denominator approaches 0 while the numerator does not, so $|y|$ grows without bound.' },
      ],
    };
  },
};

const ratFeatures: Generator = {
  id: 'u5-rat-va-hole',
  nodeId: 'RF14.va-vs-hole',
  title: 'List the asymptotes and holes',
  make(rng, tier): Draft {
    const { r, a } = pick(rng, tier === 1 ? ['lin-hole', 'const-hole', 'two-va'] : ['lin-hole', 'const-hole', 'line-hole', 'two-va', 'lin'], undefined, tier);
    return {
      cognitive: 'procedural',
      stem: `For ${m(fx(r, formFor(tier)))}, state the equation(s) of the vertical asymptote(s) and the ${m('x')}-coordinate(s) of any points of discontinuity. Type ∅ for none.`,
      format: 'input',
      fields: [field(fracSet(a.vas), 'x =', 'Vertical asymptote(s)'), field(fracSet(a.holes.map((h) => h.x)), 'x =', 'Point(s) of discontinuity')],
      hints: ['Factor the numerator and denominator completely.', 'Common factors cancel and leave holes.', 'Denominator factors left after cancelling give vertical asymptotes.'],
      solution: [
        { tex: factorStep(r, a), why: tier > 1 ? 'Factor each trinomial or difference of squares.' : 'Cancel common factors.' },
        { tex: `Vertical asymptote(s): ${a.vas.length ? m(a.vas.map((v) => `x = ${v.tex()}`).join(',\\ ')) : 'none'}. Point(s) of discontinuity: ${a.holes.length ? m(`x = ${xs(a.holes.map((h) => h.x))}`) : 'none'}.` },
      ],
    };
  },
};

const ratHoleParam: Generator = {
  id: 'u5-rat-hole-param',
  nodeId: 'RF14.va-vs-hole',
  title: 'Choose a parameter to make a hole',
  make(rng, tier): Draft {
    const [p, q] = distinct(rng, 2, -6, 6);
    const den = [L(p), L(q)];
    const denTex = polyTex([1, -(p + q), p * q]);
    if (tier < 3) {
      // f(x) = (x + k)/D: a hole when x + k cancels a factor of D.
      const ks = [-p, -q];
      return {
        cognitive: 'problemSolving',
        stem: `${m(`f(x) = \\frac{x + k}{${denTex}}`)}. For which value(s) of ${m('k')} does the graph have a point of discontinuity?`,
        format: 'input',
        fields: [field(setAns(ks), 'k =')],
        hints: ['A hole needs a factor that cancels.', `${m(`${denTex} = ${linTex(den[0])}${linTex(den[1])}`)}.`, `${m('x + k')} must equal one of those factors.`],
        solution: [
          { tex: m(`${denTex} = ${linTex(den[0])}${linTex(den[1])}`) },
          { tex: `${m('x + k')} cancels when it equals ${m(linTex(den[0]))} or ${m(linTex(den[1]))}: ${m(`k = ${Math.min(...ks)}`)} or ${m(`k = ${Math.max(...ks)}`)}.`, why: 'Any other $k$ leaves both factors in the denominator: two vertical asymptotes.' },
        ],
        verify: () => ks.every((k) => den.some((d) => d.q === -k)),
      };
    }
    // f(x) = (kx − c)/D: a hole at x = p needs kp = c.
    const k = rng.nz(-4, 4);
    const c = k * p;
    if (c === 0 || k * q === c) throw new Reject();
    const hy = F(k, p - q);
    return {
      cognitive: 'problemSolving',
      stem: `${m(`f(x) = \\frac{kx ${c > 0 ? '-' : '+'} ${Math.abs(c)}}{${denTex}}`)} has a point of discontinuity at ${m(`x = ${p}`)}. Determine ${m('k')}.`,
      format: 'input',
      fields: [field(num(k), 'k =')],
      hints: [`A hole at ${m(`x = ${p}`)} means the numerator is also 0 there.`, `Substitute ${m(`x = ${p}`)}: ${m(`${p}k ${c > 0 ? '-' : '+'} ${Math.abs(c)} = 0`)}.`, 'Solve for $k$.'],
      solution: [
        { tex: `${m(linTex(L(p)))} must be a factor of the numerator, so the numerator is ${m('0')} at ${m(`x = ${p}`)}.` },
        { tex: m(`${p}k ${c > 0 ? '-' : '+'} ${Math.abs(c)} = 0 \\Rightarrow k = ${k}`) },
        { tex: `Check: ${m(`\\frac{${polyTex([k, -c])}}{${denTex}} = \\frac{${k}${linTex(L(p))}}{${linTex(den[0])}${linTex(den[1])}}`)}, hole at ${m(ptTex(p, hy))}.` },
      ],
      verify: () => k * p - c === 0,
    };
  },
};

// ---------------------------------------------------------------- RF14.ha-intercepts

/** k(ax − b)/(cx − d) with leading coefficients that matter. */
function pickLinLin(rng: Rng): RatFn {
  const a = rng.pick([1, 2, 3]);
  const c = rng.pick([1, 1, 2]);
  const b = rng.int(-6, 6);
  const d = rng.nz(-6, 6);
  const k = rng.pick([1, 1, -1, 2]);
  if (a * d === b * c) throw new Reject();
  if (F(b, a).eq(F(d, c))) throw new Reject();
  return { k, num: [L(b, a)], den: [L(d, c)] };
}

const ratHA: Generator = {
  id: 'u5-rat-ha',
  nodeId: 'RF14.ha-intercepts',
  title: 'Horizontal asymptote',
  make(rng, tier): Draft {
    const lower = tier > 1 && rng.chance(0.35);
    const r = lower ? pickRat(rng, 'two-va') : tier === 3 ? pickRat(rng, 'lin-hole') : pickLinLin(rng);
    const a = analyze(r);
    if (!a.ha) throw new Reject();
    const numP = polyTexArr(r.num, r.k);
    const denP = polyTexArr(r.den, 1);
    const ratioConst = denP[denP.length - 1] !== 0 && numP[numP.length - 1] !== 0 ? F(numP[numP.length - 1], denP[denP.length - 1]) : F(7);
    const leadRatio = F(numP[0], denP[0]);
    const cands: Cand[] = [
      { tex: m(`y = ${ratioConst.tex()}`), key: ratioConst.value, mis: 'rat-ha-degree', feedback: 'Constant terms do not decide the end behaviour; compare degrees and leading coefficients.' },
      lower ? { tex: m(`y = ${leadRatio.tex()}`), key: leadRatio.value, mis: 'rat-ha-degree', feedback: 'The numerator has lower degree, so $y \\to 0$.' } : { tex: m('y = 0'), key: 0, mis: 'rat-ha-degree', feedback: 'Equal degrees: the asymptote is the ratio of leading coefficients, not 0.' },
      { tex: m('y = 1'), key: 1, mis: 'rat-ha-degree' },
      { tex: m(`x = ${a.vas[0].tex()}`), key: 'va', mis: 'rat-va-as-hole', feedback: 'That is a vertical asymptote.' },
    ];
    return {
      cognitive: 'procedural',
      stem: `What is the equation of the horizontal asymptote of ${m(fx(r, 'expanded'))}?`,
      format: 'mc',
      choices: mc({ tex: m(`y = ${a.ha.tex()}`), key: a.ha.value }, cands),
      hints: ['Compare the degrees of the numerator and denominator.', 'Lower degree on top: $y = 0$. Equal degrees: ratio of leading coefficients.', `Leading terms: ${m(`${polyTex([numP[0], ...Array(numP.length - 1).fill(0)])}`)} over ${m(`${polyTex([denP[0], ...Array(denP.length - 1).fill(0)])}`)}.`],
      solution: [
        { tex: `Degree of numerator ${m(String(numP.length - 1))}, denominator ${m(String(denP.length - 1))}.` },
        { tex: lower ? `Lower degree on top: ${m('y = 0')}.` : `Equal degrees: ${m(`y = \\frac{${numP[0]}}{${denP[0]}}${F(numP[0], denP[0]).tex() === `\\frac{${numP[0]}}{${denP[0]}}` ? '' : ` = ${a.ha.tex()}`}`)}.`, why: 'For large $|x|$, only the leading terms matter.' },
      ],
    };
  },
};

/** Expanded coefficients with leading zeros stripped. */
function polyTexArr(fs: Lin[], k: number): number[] {
  return fs.reduce<number[]>((acc, f) => {
    const out = Array(acc.length + 1).fill(0);
    acc.forEach((c, i) => {
      out[i] += c * f.p;
      out[i + 1] -= c * f.q;
    });
    return out;
  }, [k]);
}

const ratIntercepts: Generator = {
  id: 'u5-rat-intercepts',
  nodeId: 'RF14.ha-intercepts',
  title: 'Intercepts of a rational function',
  make(rng, tier): Draft {
    const { r, a } = pick(rng, tier === 1 ? ['lin', 'two-va'] : ['lin-hole', 'line-hole', 'lin', 'two-va'], (a) => a.yint !== null, tier);
    return {
      cognitive: 'procedural',
      stem: `Determine the ${m('x')}-intercept(s) and the ${m('y')}-intercept of the graph of ${m(fx(r, formFor(tier)))}. Type ∅ if there are no ${m('x')}-intercepts.`,
      format: 'input',
      fields: [field(fracSet(a.xints), 'x =', 'x-intercept(s)'), field(num(a.yint!), 'y =', 'y-intercept')],
      hints: ['Factor and cancel first.', '$x$-intercepts: zeros of the simplified numerator. $y$-intercept: $f(0)$.', a.holes.length ? `The cancelled factor gives a hole at ${m(`x = ${a.holes[0].x.tex()}`)}, not an intercept.` : 'The denominator never gives intercepts.'],
      solution: [
        { tex: factorStep(r, a) },
        { tex: `${m('x')}-intercept(s): ${a.xints.length ? solutionText(a.xints) : 'none (the numerator is constant)'}.`, why: 'A fraction is 0 only when its numerator is 0 and its denominator is not.' },
        { tex: `${m(`f(0) = ${a.yint!.tex()}`)}.` },
      ],
      verify: () => a.xints.every((x) => Math.abs(a.f(x.value)) < 1e-9) && Math.abs(a.f(0) - a.yint!.value) < 1e-9,
    };
  },
};

const ratXintMc: Generator = {
  id: 'u5-rat-xint-mc',
  nodeId: 'RF14.ha-intercepts',
  title: 'Which are the x-intercepts?',
  make(rng, tier): Draft {
    const { r, a } = pick(rng, tier === 1 ? ['lin', 'lin-hole'] : ['lin-hole', 'line-hole'], (a) => a.xints.length > 0, tier);
    const list = (vs: Frac[]) => (vs.length ? vs.map((v) => m(`x = ${v.tex()}`)).join(' and ') : 'none');
    const key = (vs: Frac[]) => vs.map((v) => v.value).sort((p, q) => p - q).join(',');
    const withHole = [...a.xints, ...a.holes.map((h) => h.x)].sort((p, q) => p.value - q.value);
    return {
      cognitive: 'conceptual',
      stem: `Which gives all the ${m('x')}-intercepts of ${m(fx(r, formFor(tier)))}?`,
      format: 'mc',
      choices: mc({ tex: list(a.xints), key: key(a.xints) }, [
        { tex: list(withHole), key: key(withHole), mis: 'rat-xint-at-hole', feedback: 'The cancelled factor makes a hole; the function is not defined there.' },
        { tex: list(a.vas), key: key(a.vas), mis: 'rat-xint-from-denominator', feedback: 'Zeros of the denominator give asymptotes, not intercepts.' },
        { tex: list(a.xints.map((x) => x.neg())), key: key(a.xints.map((x) => x.neg())), mis: 'tr-h-sign', feedback: `${m('(x - a) = 0')} gives ${m('x = a')}.` },
        { tex: list([...a.xints, ...a.vas].sort((p, q) => p.value - q.value)), key: 'xv' + key([...a.xints, ...a.vas]), mis: 'rat-xint-from-denominator' },
      ]),
      hints: ['Simplify first.', 'Only zeros of the simplified numerator are $x$-intercepts.', 'Check that each candidate is in the domain.'],
      solution: [
        { tex: factorStep(r, a) },
        { tex: `Simplified numerator is zero at ${list(a.xints)}${a.holes.length ? `; ${m(`x = ${a.holes[0].x.tex()}`)} is a hole` : ''}.`, why: 'An $x$-intercept must be in the domain.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF14.domain-range

const ratDomain: Generator = {
  id: 'u5-rat-domain',
  nodeId: 'RF14.domain-range',
  title: 'Domain of a rational function',
  make(rng, tier): Draft {
    const { r, a } = pick(rng, tier === 1 ? ['lin', 'const-hole', 'two-va'] : ['lin-hole', 'const-hole', 'line-hole', 'two-va'], undefined, tier);
    const excl = [...a.vas, ...a.holes.map((h) => h.x)].sort((p, q) => p.value - q.value);
    return {
      cognitive: 'procedural',
      stem: `State the domain of ${m(fx(r, formFor(tier)))}.`,
      format: 'input',
      fields: [field({ ...realSetAns(a.domain), tex: setBuilderTex(a.domain) }, '', 'Domain')],
      hints: ['Exclude every $x$ that makes the original denominator 0.', 'That includes the $x$-values of holes, not just asymptotes.', `Factor the denominator: ${m(ratTex({ k: 1, num: [], den: r.den }).replace(/^\\frac\{1\}\{(.*)\}$/, '$1'))}.`],
      solution: [
        { tex: `Denominator zero at ${m(`x = ${xs(excl)}`)}.`, why: 'Use the original function: cancelling does not make those $x$-values allowed.' },
        { tex: `Domain: ${m(setBuilderTex(a.domain))}.` },
      ],
    };
  },
};

const ratRange: Generator = {
  id: 'u5-rat-range',
  nodeId: 'RF14.domain-range',
  title: 'Range with a point of discontinuity',
  make(rng, tier): Draft {
    const kinds: RatKind[] = tier === 1 ? ['lin', 'const'] : tier === 2 ? ['lin-hole', 'const-hole', 'line-hole'] : ['lin-hole', 'const-hole', 'square'];
    const { r, a } = pick(rng, kinds, (a) => a.range !== null, tier);
    const R = a.range as RealSet;
    const holeYs = a.holes.map((h) => h.y);
    return {
      cognitive: 'problemSolving',
      stem: `State the range of ${m(fx(r, formFor(tier)))}.`,
      format: 'input',
      fields: [field({ ...realSetAns(R, 'y'), tex: setBuilderTex(R, 'y') }, '', 'Range')],
      hints: [
        a.ha ? `The horizontal asymptote is ${m(`y = ${a.ha.tex()}`)}.` : 'The simplified function is linear.',
        a.holes.length ? `There is a hole: find its ${m('y')}-coordinate from the simplified function.` : 'Which $y$-values does the graph never reach?',
        a.holes.length ? `Hole at ${m(ptTex(a.holes[0].x, a.holes[0].y))}: exclude ${m(`y = ${a.holes[0].y.tex()}`)}.` : r.den.length === 2 ? 'Both branches of $k/(x - p)^2$ lie on one side of the asymptote.' : 'A function $k/(x - p) + c$ takes every value except $c$.',
      ],
      solution: [
        { tex: factorStep(r, a) },
        ...(a.ha ? [{ tex: `Horizontal asymptote ${m(`y = ${a.ha.tex()}`)}${r.den.length === 2 && a.simplified.den.length === 2 ? `; ${m(`(x - p)^2 > 0`)}, so every ${m('y')} has the sign of ${m(String(r.k))}` : ': the simplified graph takes every other $y$-value'}.`, why: 'The simplified function never equals its horizontal asymptote here.' }] : []),
        ...(holeYs.length ? [{ tex: `Hole at ${m(holeTex(a))}: ${m(`y = ${holeYs[0].tex()}`)} is never reached either.`, why: 'The only point that would have that $y$-value is missing.' }] : []),
        { tex: `Range: ${m(setBuilderTex(R, 'y'))}.` },
      ],
    };
  },
};

const ratDrMc: Generator = {
  id: 'u5-rat-dr-mc',
  nodeId: 'RF14.domain-range',
  title: 'Domain or range: choose the correct statement',
  make(rng, tier): Draft {
    const { r, a } = pick(rng, ['lin-hole', 'const-hole'], (a) => a.range !== null && a.vas.length === 1, tier);
    const h = a.holes[0];
    const askRange = tier > 1;
    const sb = (ex: Frac[], v = 'x') => `\\{${v} \\mid ${v} \\ne ${ex.map((e) => e.tex()).join(', ')}, ${v} \\in \\mathbb{R}\\}`;
    const right = askRange ? sb([a.ha!, h.y].sort((p, q) => p.value - q.value), 'y') : sb([a.vas[0], h.x].sort((p, q) => p.value - q.value));
    const cands: Cand[] = askRange
      ? [
          { tex: m(sb([a.ha!], 'y')), key: 'noh', mis: 'rat-range-hole', feedback: `The hole ${m(ptTex(h.x, h.y))} removes ${m(`y = ${h.y.tex()}`)} too.` },
          { tex: m(sb([a.ha!, h.x].sort((p, q) => p.value - q.value), 'y')), key: 'hx', mis: 'rat-range-hole', feedback: 'Exclude the hole’s $y$-coordinate from the range, not its $x$-coordinate.' },
          { tex: m(sb([a.vas[0], h.y].sort((p, q) => p.value - q.value), 'y')), key: 'va', mis: 'rat-ha-degree', feedback: 'The range excludes the horizontal asymptote value, not the vertical one.' },
        ]
      : [
          { tex: m(sb([a.vas[0]])), key: 'noh', mis: 'rat-domain-hole', feedback: `${m(`x = ${h.x.tex()}`)} makes the original denominator 0.` },
          { tex: m(sb([a.vas[0], a.ha!].sort((p, q) => p.value - q.value))), key: 'ha', mis: 'rat-ha-degree', feedback: 'The horizontal asymptote restricts $y$, not $x$.' },
          { tex: m(sb([h.x])), key: 'nova', mis: 'rat-va-as-hole' },
        ];
    return {
      cognitive: 'conceptual',
      stem: `Which is the ${askRange ? 'range' : 'domain'} of ${m(fx(r, formFor(tier)))}?`,
      format: 'mc',
      choices: mc({ tex: m(right), key: 'ok' }, cands.filter((c) => c.tex !== m(right))),
      hints: ['Factor, cancel, and find the hole.', askRange ? 'Range: exclude the horizontal asymptote value and the hole’s $y$-value.' : 'Domain: exclude every zero of the original denominator.', `Hole at ${m(ptTex(h.x, h.y))}.`],
      solution: [
        { tex: factorStep(r, a) },
        { tex: `Vertical asymptote ${m(`x = ${a.vas[0].tex()}`)}, horizontal asymptote ${m(`y = ${a.ha!.tex()}`)}, hole ${m(ptTex(h.x, h.y))}.` },
        { tex: `${askRange ? 'Range' : 'Domain'}: ${m(right)}.`, why: askRange ? 'Neither the asymptote value nor the missing point’s $y$-value is ever reached.' : 'Every zero of the original denominator is excluded.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF14.hole-y

const ratHoleY: Generator = {
  id: 'u5-rat-holey',
  nodeId: 'RF14.hole-y',
  title: 'Coordinates of a point of discontinuity',
  make(rng, tier): Draft {
    const { r, a } = pick(rng, tier === 1 ? ['line-hole', 'const-hole'] : ['lin-hole', 'const-hole', 'line-hole'], undefined, tier);
    const h = a.holes[0];
    return {
      cognitive: 'procedural',
      stem: `Determine the coordinates of the point of discontinuity of the graph of ${m(fx(r, formFor(tier)))}.`,
      format: 'input',
      fields: [field({ kind: 'points', values: [[h.x.value, h.y.value]], tex: ptTex(h.x, h.y) })],
      hints: ['Factor and cancel the common factor.', `The cancelled factor gives ${m(`x = ${h.x.tex()}`)}.`, `Substitute ${m(`x = ${h.x.tex()}`)} into the simplified function.`],
      solution: [
        { tex: factorStep(r, a) },
        { tex: `${m(`x = ${h.x.tex()}`)}: ${m(`y = ${ratTex(a.simplified).replace(/x/g, `(${h.x.tex()})`)} = ${h.y.tex()}`)}.`, why: 'The original has no value there (0/0); the simplified function gives the height of the missing point.' },
        { tex: `Point of discontinuity ${m(ptTex(h.x, h.y))}.` },
      ],
      verify: () => Math.abs(a.s(h.x.value) - h.y.value) < 1e-9 && !Number.isFinite(a.f(h.x.value)),
    };
  },
};

const ratHoleYMc: Generator = {
  id: 'u5-rat-holey-mc',
  nodeId: 'RF14.hole-y',
  title: 'Which point is the hole?',
  make(rng, tier): Draft {
    const { r, a } = pick(rng, tier === 1 ? ['line-hole'] : ['lin-hole', 'const-hole'], undefined, tier);
    const h = a.holes[0];
    // "Cancel terms" error: drop the x's from the cancelled factor pair and evaluate what is left.
    const wrongY = evalExact({ k: a.simplified.k, num: a.simplified.num, den: a.simplified.den }, h.x.neg());
    const cands: Cand[] = [
      { tex: m(ptTex(h.x, 0)), key: pkey(h.x.value, 0), mis: 'rat-range-hole', feedback: 'A hole is not on the $x$-axis unless the simplified function is 0 there.' },
      { tex: m(ptTex(h.y, h.x)), key: pkey(h.y.value, h.x.value), mis: 'rat-range-hole', feedback: 'The $x$-coordinate comes from the cancelled factor.' },
      ...(wrongY ? [{ tex: m(ptTex(h.x.neg(), wrongY)), key: pkey(-h.x.value, wrongY.value), mis: 'tr-h-sign', feedback: `${m(linTex(L(h.x.n, h.x.d)))} is zero at ${m(`x = ${h.x.tex()}`)}.` }] : []),
      { tex: m(ptTex(h.x, a.ha ?? F(1))), key: pkey(h.x.value, (a.ha ?? F(1)).value), mis: 'rat-range-hole' },
    ];
    return {
      cognitive: 'procedural',
      stem: `Where is the point of discontinuity on the graph of ${m(fx(r, formFor(tier)))}?`,
      format: 'mc',
      choices: mc({ tex: m(ptTex(h.x, h.y)), key: pkey(h.x.value, h.y.value) }, cands),
      hints: ['Factor and cancel.', 'The cancelled factor gives the $x$-coordinate.', 'Evaluate the simplified function there for the $y$-coordinate.'],
      solution: [
        { tex: factorStep(r, a) },
        { tex: `Simplified at ${m(`x = ${h.x.tex()}`)}: ${m(`y = ${h.y.tex()}`)}. Hole ${m(ptTex(h.x, h.y))}.`, why: 'The original gives 0/0; the simplified function gives the height of the gap.' },
      ],
    };
  },
};

const ratHoleUnknown: Generator = {
  id: 'u5-rat-hole-unknown',
  nodeId: 'RF14.hole-y',
  title: 'Find coefficients from a hole',
  make(rng, tier): Draft {
    const p = rng.nz(-5, 5);
    const qv = rng.nz(-6, 6);
    const rr = p - qv; // simplified x − rr equals qv at x = p
    const b = -(p + rr);
    const c = p * rr;
    if (rr === 0 || (tier === 1 && b === 0)) throw new Reject();
    return {
      cognitive: 'problemSolving',
      stem: `The graph of ${m(`f(x) = \\frac{x^2 + bx + c}{${polyTex([1, -p])}}`)} is a line with a point of discontinuity at ${m(ptTex(p, qv))}. Determine ${m('b')} and ${m('c')}.`,
      format: 'input',
      fields: [field(num(b), 'b ='), field(num(c), 'c =')],
      hints: [`The numerator must contain the factor ${m(linTex(L(p)))}.`, `So ${m(`f(x) = x - r`)} for ${m(`x \\ne ${p}`)}, and the hole height is ${m(`${p} - r`)}.`, `${m(`${p} - r = ${qv}`)} gives ${m(`r = ${rr}`)}.`],
      solution: [
        { tex: `Numerator ${m(`${linTex(L(p))}(x - r)`)}, so ${m(`f(x) = x - r,\\ x \\ne ${p}`)}.`, why: 'Only a cancelled factor makes a hole instead of an asymptote.' },
        { tex: m(`${p} - r = ${qv} \\Rightarrow r = ${rr}`), why: 'The hole lies on the simplified line.' },
        { tex: m(`${linTex(L(p))}${linTex(L(rr))} = ${polyTex([1, b, c])}`) + `, so ${m(`b = ${b}`)}, ${m(`c = ${c}`)}.` },
      ],
      verify: () => p * p + b * p + c === 0 && p - rr === qv,
    };
  },
};

// ---------------------------------------------------------------- RF14.sketch

const ratWhichGraph: Generator = {
  id: 'u5-rat-which-graph',
  nodeId: 'RF14.sketch',
  title: 'Match a function to its graph',
  make(rng, tier): Draft {
    const { r, a } = pick(rng, tier === 1 ? ['lin', 'const'] : ['lin-hole', 'const-hole', 'two-va'], (a) => a.vas.length >= 1, tier);
    const form = tier === 3 ? 'expanded' : 'factored';
    const alt = (x: RatFn): string => ratTex(x, form);
    const flipVa: RatFn = { ...r, den: r.den.map((d, i) => (i === 0 && !r.num.some((n) => n.q === d.q) ? L(-d.q, d.p) : d)) };
    const extra = distinct(rng, 1, -5, 5, [...a.vas, ...a.xints].map((v) => v.value))[0];
    const [mutant, mutantMis]: [RatFn, string] = a.holes.length
      ? [{ ...r, num: a.simplified.num }, 'rat-hole-as-va']
      : r.num.length
        ? [{ k: r.k, num: [r.den[0]], den: [r.num[0], ...r.den.slice(1)] }, 'rat-xint-from-denominator']
        : r.den.length === 2
          ? [{ k: r.k, num: [r.den[0]], den: r.den }, 'rat-va-as-hole']
          : [{ k: r.k, num: [L(extra)], den: [...r.den, L(extra)] }, 'wr-sketch-features'];
    const negK: RatFn = { ...r, k: -r.k };
    const cands: Cand[] = [
      { tex: m(`y = ${alt(negK)}`), key: alt(negK), mis: 'wr-sketch-features', feedback: 'Test a point: the sign of $y$ on each side of the asymptote decides the branches.' },
      { tex: m(`y = ${alt(flipVa)}`), key: alt(flipVa), mis: 'tr-h-sign', feedback: `The vertical asymptote is at ${m(`x = ${a.vas[0].tex()}`)}.` },
      { tex: m(`y = ${alt(mutant)}`), key: alt(mutant), mis: mutantMis, feedback: a.holes.length ? 'Without the common factor there would be no hole.' : 'Compare the asymptotes, intercepts and holes of this function with the graph.' },
    ];
    return {
      cognitive: 'conceptual',
      stem: 'Which function has this graph? (Dashed lines are asymptotes; an open circle is a point of discontinuity.)',
      graph: ratGraph(r, a),
      format: 'mc',
      choices: mc({ tex: m(`y = ${alt(r)}`), key: alt(r) }, cands),
      hints: ['Read the asymptotes and any hole from the graph.', 'Vertical asymptotes come from denominator factors that do not cancel; a hole needs a factor in both.', 'Check a point such as the $y$-intercept.'],
      solution: [
        { tex: `Vertical asymptote${a.vas.length > 1 ? 's' : ''} ${m(a.vas.map((v) => `x = ${v.tex()}`).join(',\\ '))}${a.ha ? `, horizontal asymptote ${m(`y = ${a.ha.tex()}`)}` : ''}${a.holes.length ? `, hole ${m(holeTex(a))}` : ''}.` },
        { tex: a.yint ? `${m(`f(0) = ${a.yint.tex()}`)} matches the ${m('y')}-intercept.` : 'The branches match the sign of $f$ on each side of the asymptote.', why: 'Several functions share asymptotes; a point decides between them.' },
      ],
    };
  },
};

const ratBehaviour: Generator = {
  id: 'u5-rat-behaviour',
  nodeId: 'RF14.sketch',
  title: 'Behaviour near a vertical asymptote',
  make(rng, tier): Draft {
    const { r, a } = pick(rng, tier === 1 ? ['lin', 'const'] : ['two-va', 'lin-hole', 'square'], (a) => a.vas.length >= 1, tier);
    const v = rng.pick(a.vas);
    const side = rng.pick(['right', 'left'] as const);
    const x0 = v.value + (side === 'right' ? 1e-6 : -1e-6);
    const up = a.s(x0) > 0;
    const sideTex = side === 'right' ? `x \\to ${v.tex()}^{+}` : `x \\to ${v.tex()}^{-}`;
    const test = v.value + (side === 'right' ? 0.1 : -0.1);
    return {
      cognitive: 'problemSolving',
      stem: `For ${m(fx(r, formFor(tier)))}, what happens to ${m('f(x)')} as ${m('x')} approaches ${m(v.tex())} from the ${side}?`,
      format: 'mc',
      choices: mc({ tex: up ? `${m('f(x)')} increases without bound (${m('\\to +\\infty')})` : `${m('f(x)')} decreases without bound (${m('\\to -\\infty')})`, key: up ? 'up' : 'down' }, [
        { tex: !up ? `${m('f(x)')} increases without bound (${m('\\to +\\infty')})` : `${m('f(x)')} decreases without bound (${m('\\to -\\infty')})`, key: up ? 'down' : 'up', mis: 'wr-sketch-features', feedback: `Test ${m(`x = ${+test.toFixed(1)}`)}: ${m(`f(${+test.toFixed(1)}) \\approx ${+a.s(test).toFixed(2)}`)}.` },
        { tex: a.ha ? `${m('f(x)')} approaches ${m(a.ha.tex())}` : `${m('f(x)')} approaches ${m('0')}`, key: 'ha', mis: 'rat-ha-degree', feedback: 'Horizontal asymptotes describe $|x| \\to \\infty$, not $x$ near an asymptote.' },
        { tex: `${m('f(x)')} approaches ${m('0')} from ${side === 'right' ? 'above' : 'below'}`, key: 'zero', mis: 'rat-xint-from-denominator', feedback: 'A zero of the denominator makes $|f(x)|$ grow, not shrink.' },
        { tex: `${m('f(x)')} approaches ${m(v.tex())}`, key: 'v', mis: 'rat-va-as-hole' },
      ]),
      hints: ['Near a vertical asymptote, $|f(x)|$ grows without bound. Only the sign is in question.', `Pick a test value just to the ${side} of ${m(v.tex())}, such as ${m(String(+test.toFixed(1)))}.`, 'Find the sign of each factor there.'],
      solution: [
        { tex: factorStep(r, a) },
        { tex: `At ${m(`x = ${+test.toFixed(1)}`)}: ${m(`f(x) \\approx ${+a.s(test).toFixed(2)}`)}, which is ${up ? 'positive' : 'negative'}.`, why: 'The sign does not change between the test value and the asymptote.' },
        { tex: `As ${m(sideTex)}, ${m(`f(x) \\to ${up ? '+' : '-'}\\infty`)}.` },
      ],
    };
  },
};

const ratAllFeatures: Generator = {
  id: 'u5-rat-features',
  nodeId: 'RF14.sketch',
  title: 'All the features for a sketch',
  make(rng, tier): Draft {
    const { r, a } = pick(rng, tier === 1 ? ['lin', 'const-hole'] : ['lin-hole', 'two-va', 'const-hole'], (a) => a.ha !== null, tier);
    return {
      cognitive: 'procedural',
      stem: `To sketch ${m(fx(r, formFor(tier)))}, determine its features. Type ∅ where there are none.`,
      format: 'input',
      fields: [
        field(fracSet(a.vas), 'x =', 'Vertical asymptote(s)'),
        field(num(a.ha!), 'y =', 'Horizontal asymptote'),
        field({ kind: 'points', values: a.holes.map((h) => [h.x.value, h.y.value] as [number, number]), tex: holeTex(a) }, '', 'Point(s) of discontinuity'),
        field(fracSet(a.xints), 'x =', 'x-intercept(s)'),
      ],
      hints: ['Factor and cancel; note the hole first.', 'Asymptotes: remaining denominator zeros; horizontal from degrees.', '$x$-intercepts: zeros of the simplified numerator.'],
      solution: [
        { tex: factorStep(r, a) },
        { tex: `Vertical asymptote(s) ${m(`x = ${xs(a.vas)}`)}; horizontal asymptote ${m(`y = ${a.ha!.tex()}`)}.` },
        { tex: `Point(s) of discontinuity ${m(holeTex(a))}; ${m('x')}-intercept(s) ${m(a.xints.length ? a.xints.map((x) => x.tex()).join(', ') : '\\text{none}')}${a.yint ? `; ${m('y')}-intercept ${m(a.yint.tex())}` : ''}.`, why: 'A complete sketch shows scaled axes, every asymptote (dashed), intercepts, and holes as open circles.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF14.equation-from-graph

/** y = a(x − r)(x − h)/((x − p)(x − h)) or y = k(x − h)/((x − p)(x − h)) from features. */
function eqFromFeatures(rng: Rng, tier: Tier) {
  const [p, rr, h] = distinct(rng, 3, -5, 5);
  const hasHole = tier === 3 || (tier === 2 && rng.chance(0.4));
  const kind = tier === 1 ? 'const' : 'lin';
  const A = rng.pick([1, 2, -1, 3, -2]);
  const base: RatFn = kind === 'const' ? { k: A * rng.pick([1, 2, 3]), num: [], den: [L(p)] } : { k: A, num: [L(rr)], den: [L(p)] };
  const r: RatFn = hasHole ? { k: base.k, num: [...base.num, L(h)], den: [...base.den, L(h)] } : base;
  const a = analyze(r);
  if (a.holes.some((x) => x.y.n === 0 || x.y.d > 6)) throw new Reject();
  if (a.yint === null && kind === 'const') throw new Reject();
  return { r, a, kind, hasHole };
}

const eqAnswer = (r: RatFn, a: Analysis): AnswerSpec => {
  const ex = [...a.vas, ...a.holes.map((h) => h.x)].map((v) => v.value);
  return { kind: 'expr', tex: ratTex(r), variable: 'x', fn: a.f, sample: [Math.min(...ex) - 3.3, Math.max(...ex) + 3.3], exact: true, undefinedAt: a.holes.map((h) => h.x.value) };
};

const ratEqFeatures: Generator = {
  id: 'u5-rat-eq-features',
  nodeId: 'RF14.equation-from-graph',
  title: 'Equation from characteristics',
  make(rng, tier): Draft {
    const { r, a, kind, hasHole } = eqFromFeatures(rng, tier);
    const facts = [
      `a vertical asymptote ${m(`x = ${a.vas[0].tex()}`)}`,
      `a horizontal asymptote ${m(`y = ${a.ha!.tex()}`)}`,
      kind === 'lin' ? `an ${m('x')}-intercept at ${m(a.xints[0].tex())}` : `a ${m('y')}-intercept at ${m(a.yint!.tex())}`,
      ...(hasHole ? [`a point of discontinuity at ${m(ptTex(a.holes[0].x, a.holes[0].y))}`] : []),
    ];
    const kTex = kind === 'const' ? `y = \\frac{k}{x - p}` : `y = \\frac{a(x - r)}{x - p}`;
    return {
      cognitive: 'problemSolving',
      stem: `A rational function has ${facts.slice(0, -1).join(', ')}, and ${facts[facts.length - 1]}. Write its equation.`,
      format: 'input',
      fields: [field(eqAnswer(r, a), 'y =')],
      hints: [
        `Start from ${m(kTex)}${hasHole ? ', then multiply top and bottom by the hole factor' : ''}.`,
        kind === 'const' ? 'Horizontal asymptote $y = 0$ means a constant numerator; use the $y$-intercept to find $k$.' : 'The horizontal asymptote $y = a$ is the ratio of leading coefficients.',
        hasHole ? `The hole at ${m(`x = ${a.holes[0].x.tex()}`)} needs ${m(linTex(L(a.holes[0].x.n)))} in both numerator and denominator.` : `The vertical asymptote gives the denominator ${m(linTex(L(a.vas[0].n)))}.`,
      ],
      solution: [
        { tex: kind === 'const' ? `${m(`y = \\frac{k}{${linTex(L(a.vas[0].n), true)}}`)}; ${m(`y(0) = ${a.yint!.tex()}`)} gives ${m(`k = ${a.simplified.k}`)}.` : `${m(`y = \\frac{a${linTex(L(a.xints[0].n))}}{${linTex(L(a.vas[0].n), true)}}`)} with ${m(`a = ${a.ha!.tex()}`)} from the horizontal asymptote.`, why: 'Each feature fixes one part of the equation.' },
        ...(hasHole ? [{ tex: `Check the hole: the simplified function at ${m(`x = ${a.holes[0].x.tex()}`)} is ${m(a.holes[0].y.tex())} ✓.`, why: 'A hole’s height is fixed by the rest of the function; it must agree.' }] : []),
        { tex: m(`y = ${ratTex(r)}`) },
      ],
      verify: () => Math.abs(a.s(a.holes[0]?.x.value ?? 0) - (a.holes[0]?.y.value ?? a.s(0))) < 1e-9,
    };
  },
};

const ratEqGraphMc: Generator = {
  id: 'u5-rat-eq-graph-mc',
  nodeId: 'RF14.equation-from-graph',
  title: 'Equation from a graph with a hole',
  make(rng, tier): Draft {
    const { r, a, hasHole } = eqFromFeatures(rng, Math.max(2, tier) as Tier);
    const t = (x: RatFn) => ratTex(x, tier === 3 ? 'expanded' : 'factored');
    const h = a.holes[0];
    const noHole: RatFn = a.simplified;
    const holeAsVa: RatFn = hasHole ? { ...r, num: a.simplified.num } : { ...r, den: [...r.den, L(r.num[0]?.q ?? 1)] };
    const swapped: RatFn = { k: r.k, num: r.num.map((f) => (a.holes.some((x) => x.x.eq(zeroOf(f))) ? f : L(a.vas[0].n))), den: r.den.map((f) => (a.holes.some((x) => x.x.eq(zeroOf(f))) ? f : L(a.xints[0]?.n ?? 0))) };
    const cands: Cand[] = [
      ...(hasHole ? [{ tex: m(`y = ${t(noHole)}`), key: t(noHole), mis: 'rat-domain-hole', feedback: `This has no hole at ${m(`x = ${h.x.tex()}`)}.` }] : []),
      { tex: m(`y = ${t(holeAsVa)}`), key: t(holeAsVa), mis: hasHole ? 'rat-hole-as-va' : 'rat-xint-at-hole', feedback: 'That factor would be a vertical asymptote, not a hole.' },
      { tex: m(`y = ${t(swapped)}`), key: t(swapped), mis: 'rat-xint-from-denominator', feedback: 'The numerator gives the $x$-intercept; the denominator gives the asymptote.' },
      { tex: m(`y = ${t({ ...r, k: -r.k })}`), key: t({ ...r, k: -r.k }), mis: 'rat-ha-degree', feedback: `The horizontal asymptote is ${m(`y = ${a.ha!.tex()}`)}.` },
    ];
    return {
      cognitive: 'problemSolving',
      stem: 'Which equation matches the graph? (Dashed lines are asymptotes; an open circle is a point of discontinuity.)',
      graph: ratGraph(r, a),
      format: 'mc',
      choices: mc({ tex: m(`y = ${t(r)}`), key: t(r) }, cands),
      hints: ['List the asymptotes, intercepts and hole.', 'The hole needs the same factor in numerator and denominator.', 'Horizontal asymptote = ratio of leading coefficients.'],
      solution: [
        { tex: `Vertical asymptote ${m(`x = ${a.vas[0].tex()}`)}, horizontal asymptote ${m(`y = ${a.ha!.tex()}`)}${a.xints.length ? `, ${m('x')}-intercept ${m(a.xints[0].tex())}` : ''}${hasHole ? `, hole ${m(ptTex(h.x, h.y))}` : ''}.` },
        { tex: m(`y = ${ratTex(r)}`), why: 'Each feature matches one factor or coefficient.' },
      ],
    };
  },
};

const ratEqGraphInput: Generator = {
  id: 'u5-rat-eq-graph',
  nodeId: 'RF14.equation-from-graph',
  title: 'Write the equation from a graph',
  make(rng, tier): Draft {
    const { r, a, kind, hasHole } = eqFromFeatures(rng, tier);
    return {
      cognitive: 'problemSolving',
      stem: `Write an equation for the rational function graphed. (Dashed lines are asymptotes; an open circle is a point of discontinuity.)`,
      graph: ratGraph(r, a),
      format: 'input',
      fields: [field(eqAnswer(r, a), 'y =')],
      hints: ['Vertical asymptote → denominator factor. $x$-intercept → numerator factor.', kind === 'const' ? 'Horizontal asymptote $y = 0$: the numerator is a constant; find it from the $y$-intercept.' : 'Horizontal asymptote $y = a$: the leading coefficient of the numerator.', hasHole ? 'Put the hole factor in both numerator and denominator.' : 'Check with the $y$-intercept.'],
      solution: [
        { tex: `Vertical asymptote ${m(`x = ${a.vas[0].tex()}`)}, horizontal asymptote ${m(`y = ${a.ha!.tex()}`)}${hasHole ? `, hole ${m(holeTex(a))}` : ''}.` },
        { tex: m(`y = ${ratTex(r)}`), why: hasHole ? 'The common factor creates the hole without changing the rest of the graph.' : 'The $y$-intercept confirms the constant.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF14.solve

/** (px + q)/(x − r) = x + d with roots s1, s2 of the cleared equation. */
function ratEq(rng: Rng, extraneous: boolean) {
  const d = rng.int(-4, 4);
  const [r, s1] = distinct(rng, 2, -6, 6);
  const s2 = extraneous ? r : rng.int(-6, 6);
  if (s2 === s1 || (!extraneous && s2 === r)) throw new Reject();
  const p = d - r + s1 + s2;
  const q = -d * r - s1 * s2;
  if (p === 0 && q === 0) throw new Reject();
  const lhs = `\\frac{${polyTex([p, q])}}{${polyTex([1, -r])}}`;
  const rhs = polyTex([1, d]);
  return { d, r, s1, s2, p, q, lhs, rhs, valid: extraneous ? [s1] : [s1, s2] };
}

const ratSolveAlg: Generator = {
  id: 'u5-ratsolve-algebraic',
  nodeId: 'RF14.solve',
  title: 'Solve a rational equation algebraically',
  make(rng, tier): Draft {
    const e = ratEq(rng, tier === 2 || (tier === 3 && rng.chance(0.6)));
    const { d, r, s1, s2, p, q, lhs, rhs, valid } = e;
    const quad = [1, d - r - p, -d * r - q];
    return {
      cognitive: 'problemSolving',
      stem: `Solve algebraically: ${m(`${lhs} = ${rhs}`)}.`,
      format: 'input',
      fields: [field(setAns(valid), 'x =')],
      hints: [`Non-permissible value: ${m(`x \\ne ${r}`)}.`, `Multiply both sides by ${m(polyTex([1, -r]))}.`, `You should reach ${m(`${polyTex(quad)} = 0`)}.`],
      solution: [
        { tex: `${m(`x \\ne ${r}`)}. ${m(`${polyTex([p, q])} = ${linTex(L(-d))}${linTex(L(r))}`)}.`, why: 'Clear the denominator after recording the restriction.' },
        { tex: m(`${polyTex(quad)} = 0 \\Rightarrow ${linTex(L(s1))}${linTex(L(s2))} = 0`) },
        { tex: valid.length === 2 ? `${m(`x = ${Math.min(s1, s2)}`)} and ${m(`x = ${Math.max(s1, s2)}`)}; neither is ${m(String(r))}.` : `${m(`x = ${r}`)} is non-permissible, so the solution is ${m(`x = ${s1}`)}.`, why: 'A root equal to a non-permissible value is extraneous.' },
      ],
      verify: () => valid.every((x) => Math.abs((p * x + q) / (x - r) - (x + d)) < 1e-9) && quad[0] * s2 * s2 + quad[1] * s2 + quad[2] === 0,
    };
  },
};

const ratSolveGraph: Generator = {
  id: 'u5-ratsolve-graphical',
  nodeId: 'RF14.solve',
  title: 'Solve a rational equation graphically',
  make(rng, tier): Draft {
    // k/(x − p) = mx + b → mx² + (b − mp)x − bp − k = 0, irrational roots.
    const k = rng.nz(-6, 6);
    const p = rng.int(-4, 4);
    const mm = rng.pick([1, -1, 2, F(1, 2)]);
    const M = Frac.of(mm);
    const b = rng.int(-4, 4);
    const A = M.value;
    const B = b - M.value * p;
    const C = -b * p - k;
    const disc = B * B - 4 * A * C;
    if (disc <= 0) throw new Reject();
    const roots = [(-B - Math.sqrt(disc)) / (2 * A), (-B + Math.sqrt(disc)) / (2 * A)].sort((u, v) => u - v);
    if (roots.some((x) => Math.abs(x * 100 - Math.round(x * 100)) < 1e-6 || Math.abs(Math.abs((x * 100) % 1) - 0.5) < 0.03)) throw new Reject();
    const lhs = `\\frac{${k}}{${polyTex([1, -p])}}`;
    const rhs = `${M.eq(1) ? '' : M.eq(-1) ? '-' : M.tex()}x${signedTex(b)}`;
    const f = (x: number) => k / (x - p);
    const g = (x: number) => M.value * x + b;
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(`${lhs} = ${rhs}`)} graphically. Give the solutions to the nearest hundredth.`,
      graph: tier < 3 ? { view: { x: [Math.floor(Math.min(...roots, p) - 3), Math.ceil(Math.max(...roots, p) + 3)], y: [-10, 10] }, curves: [{ fn: f, role: 'image', breaks: [p] }, { fn: g, role: 'aux' }], vlines: [{ x: p, dashed: true }] } : undefined,
      format: 'input',
      fields: [field({ kind: 'set', values: roots, tex: roots.map((x) => (Math.round(x * 100) / 100).toFixed(2)).join(', '), round: 'hundredth' }, 'x \\approx')],
      hints: ['Enter each side as $Y_1$ and $Y_2$.', 'On the TI-84 Plus: 2nd TRACE (CALC), 5: intersect, once for each intersection.', 'Or graph $Y_1 - Y_2$ and use 2: zero.'],
      solution: [
        { tex: `${m(`Y_1 = ${lhs}`)}, ${m(`Y_2 = ${rhs}`)}.` },
        { tex: `Intersections at ${roots.map((x) => m(`x \\approx ${x.toFixed(2)}`)).join(' and ')}.`, why: `Each intersection is an ${m('x')} where both sides are equal; neither is the non-permissible value ${m(String(p))}.` },
      ],
      verify: () => roots.every((x) => Math.abs(f(x) - g(x)) < 1e-7),
    };
  },
};

const ratSolveRelated: Generator = {
  id: 'u5-ratsolve-related',
  nodeId: 'RF14.solve',
  title: 'Related function and extraneous roots',
  make(rng, tier): Draft {
    const e = ratEq(rng, tier === 3);
    const { d, r, s1, lhs, rhs, valid } = e;
    if (tier === 3) {
      const opt = (vs: number[]) => (vs.length ? solutionText(vs) : 'no solution');
      return {
        cognitive: 'conceptual',
        stem: `Solving ${m(`${lhs} = ${rhs}`)} algebraically gives ${m(`x = ${Math.min(r, s1)}`)} and ${m(`x = ${Math.max(r, s1)}`)}. The graph of the related function has a point of discontinuity at ${m(`x = ${r}`)}. What is the solution?`,
        format: 'mc',
        choices: mc({ tex: opt(valid), key: 'ok' }, [
          { tex: opt([r, s1].sort((u, v) => u - v)), key: 'both', mis: 'extraneous-keep', feedback: `${m(`x = ${r}`)} makes the denominator 0, so it is extraneous; on the graph it is a hole, not an intercept.` },
          { tex: opt([r]), key: 'r', mis: 'rat-xint-at-hole', feedback: 'A hole is not an $x$-intercept.' },
          { tex: opt([]), key: 'none', mis: 'extraneous-reject-valid', feedback: `${m(`x = ${s1}`)} checks in the original equation.` },
        ]),
        hints: ['Which root is a non-permissible value?', `${m(`x = ${r}`)} makes the denominator 0.`, 'Only $x$-intercepts of the related function are solutions; a hole is not an intercept.'],
        solution: [
          { tex: `${m(`x = ${r}`)} is non-permissible: extraneous. On the graph it appears as a hole.`, why: 'Clearing the denominator introduced it.' },
          { tex: `Solution: ${m(`x = ${s1}`)}.` },
        ],
      };
    }
    const right = `y = ${lhs} - x ${signedTex(-d)}`;
    return {
      cognitive: 'conceptual',
      stem: `The solutions of ${m(`${lhs} = ${rhs}`)} are the ${m('x')}-intercepts of which function?`,
      format: 'mc',
      choices: mc({ tex: m(right), key: 'ok' }, [
        { tex: m(`y = ${lhs} + x ${signedTex(d)}`), key: 'sign', mis: 'related-fn-sign', feedback: 'Subtract the whole right side.' },
        { tex: m(`y = ${lhs}`), key: 'lhs', mis: 'related-fn-sign', feedback: 'Its intercepts solve a different equation (left side = 0).' },
        { tex: m(`y = ${polyTex([1, -r])}`), key: 'den', mis: 'rat-xint-from-denominator', feedback: 'The denominator gives the non-permissible value, not the solutions.' },
      ]),
      hints: ['Rearrange so one side is 0.', 'Subtract the right side from both sides.', `${m(`${lhs} - (${rhs}) = 0`)}`],
      solution: [
        { tex: m(`${lhs} - x ${signedTex(-d)} = 0`), why: 'Zeros of left − right are exactly the solutions.' },
        { tex: `The ${m('x')}-intercepts of ${m(right)} are ${solutionText(valid)}.` },
      ],
      verify: () => valid.every((x) => Math.abs(e.p * x + e.q - (x + d) * (x - r)) < 1e-9),
    };
  },
};

export const rationalGenerators: Generator[] = [ratClassify, ratFeatures, ratHoleParam, ratHA, ratIntercepts, ratXintMc, ratDomain, ratRange, ratDrMc, ratHoleY, ratHoleYMc, ratHoleUnknown, ratWhichGraph, ratBehaviour, ratAllFeatures, ratEqFeatures, ratEqGraphMc, ratEqGraphInput, ratSolveAlg, ratSolveGraph, ratSolveRelated];
