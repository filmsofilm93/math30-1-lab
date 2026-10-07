// RF9 exponential and logarithmic graphs, RF7 logarithm definition and exact values.
import { intervalTex, iv } from '../../check/realset';
import { field, m, mc, pkey } from '../../framework';
import { F, Frac, ptTex, shiftTex } from '../../frac';
import type { AnswerSpec, Draft, Generator } from '../../types';
import { Reject } from '../../types';
import { num } from '../pre/shared';
import { logB, powFrac, powTex } from './shared';

const intervalAns = (lo: number, hi: number, loIn: boolean, hiIn: boolean): AnswerSpec => {
  const v = [iv(lo, hi, loIn, hiIn)];
  return { kind: 'interval', value: v, tex: intervalTex(v) };
};
const signed = (d: number) => (d === 0 ? '' : d > 0 ? ` + ${d}` : ` - ${-d}`);

// ---------------------------------------------------------------- RF9.exp-graph

const expGrowth: Generator = {
  id: 'u3-expg-growth',
  nodeId: 'RF9.exp-graph',
  title: 'Growth or decay',
  make(rng, tier): Draft {
    const decay = rng.chance(0.5);
    const pool = decay
      ? [F(1, 2), F(1, 3), F(2, 3), F(3, 4), F(2, 5), F(4, 5)]
      : [F(2), F(3), F(3, 2), F(5, 4), F(5, 2), F(4)];
    const b = rng.pick(pool);
    // Tier 3 hides it: b^{-x} flips growth and decay.
    const negExp = tier === 3 && rng.chance(0.5);
    const isDecay = decay !== negExp;
    const shown = negExp ? powTex(b, '-x') : powTex(b, 'x');
    const tierStem = tier === 1 ? 'Does the function represent exponential growth or decay?' : 'Which statement about the graph is true?';
    const right = isDecay ? 'Decay: it falls from left to right' : 'Growth: it rises from left to right';
    const wrong = isDecay ? 'Growth: it rises from left to right' : 'Decay: it falls from left to right';
    return {
      cognitive: 'conceptual',
      stem: `${m(`y = ${shown}`)}. ${tierStem}`,
      format: 'mc',
      choices: mc({ tex: right, key: 'r' }, [
        { tex: wrong, key: 'w', mis: 'exp-base-range', feedback: negExp ? `$${powTex(b, '-x')} = ${powTex(F(b.d, b.n), 'x')}$: the effective base is the reciprocal.` : `Base $${b.tex()}$ is ${b.value > 1 ? 'greater than 1' : 'between 0 and 1'}.` },
        { tex: 'Neither: it is a horizontal line', key: 'h', mis: 'exp-base-range' },
        { tex: `${isDecay ? 'Decay' : 'Growth'}, with ${m('x')}-intercept ${m('1')}`, key: 'x', mis: 'exp-asymptote', feedback: 'The graph never meets the $x$-axis; $y = b^x$ has $y$-intercept 1.' },
      ]),
      hints: ['Look at the base.', '$b > 1$ grows; $0 < b < 1$ decays.', negExp ? `Rewrite ${m(powTex(b, '-x'))} with a positive exponent.` : `Here ${m(`b = ${b.tex()}`)}.`],
      solution: [
        ...(negExp ? [{ tex: m(`${powTex(b, '-x')} = ${powTex(F(b.d, b.n), 'x')}`), why: '$b^{-x} = (1/b)^x$.' }] : []),
        { tex: `Effective base ${m((negExp ? F(b.d, b.n) : b).tex())} is ${(negExp ? 1 / b.value : b.value) > 1 ? 'greater than 1: growth' : 'between 0 and 1: decay'}.` },
      ],
    };
  },
};

const expChar: Generator = {
  id: 'u3-expg-char',
  nodeId: 'RF9.exp-graph',
  title: 'Characteristics of y = b^x',
  make(rng, tier): Draft {
    const b = rng.pick([F(2), F(3), F(5), F(1, 2), F(1, 3), F(3, 2)]);
    const ask = tier === 1 ? 'yint' : tier === 2 ? 'range' : 'asym';
    const fn = `y = ${powTex(b, 'x')}`;
    const q = { yint: `the ${m('y')}-intercept`, range: 'the range', asym: 'the equation of the asymptote' }[ask];
    const right = { yint: m('(0, 1)'), range: m('\\{y \\mid y > 0, y \\in \\mathbb{R}\\}'), asym: m('y = 0') }[ask];
    const cands = {
      yint: [
        { tex: m(`(0, ${b.tex()})`), key: 'b', mis: 'exp-asymptote', feedback: 'At $x = 0$, $b^0 = 1$.' },
        { tex: m('(1, 0)'), key: '10', mis: 'log-def-swap', feedback: '$(1, 0)$ is the $x$-intercept of $y = \\log_b x$, the inverse.' },
        { tex: m('(0, 0)'), key: '00', mis: 'exp-asymptote' },
      ],
      range: [
        { tex: m('\\{y \\mid y \\ge 0, y \\in \\mathbb{R}\\}'), key: 'ge', mis: 'exp-asymptote', feedback: '$b^x$ is never 0: the $x$-axis is an asymptote.' },
        { tex: m('\\{y \\mid y \\in \\mathbb{R}\\}'), key: 'all', mis: 'dr-swap', feedback: 'That is the domain.' },
        { tex: m('\\{y \\mid y > 1, y \\in \\mathbb{R}\\}'), key: '1', mis: 'exp-asymptote' },
      ],
      asym: [
        { tex: m('x = 0'), key: 'x0', mis: 'log-def-swap', feedback: '$x = 0$ is the asymptote of $y = \\log_b x$.' },
        { tex: m('y = 1'), key: 'y1', mis: 'exp-asymptote' },
        { tex: m(`y = ${b.tex()}`), key: 'yb', mis: 'exp-asymptote' },
      ],
    }[ask];
    return {
      cognitive: 'conceptual',
      stem: `What is ${q} of ${m(fn)}?`,
      format: 'mc',
      choices: mc({ tex: right, key: 'ok' }, cands),
      hints: ['Sketch $y = b^x$: it passes through $(0, 1)$ and $(1, b)$.', 'As $x \\to -\\infty$ (for $b > 1$) or $x \\to \\infty$ (for $b < 1$), $y$ approaches 0 but never reaches it.', 'Domain: all reals. Range: positive reals. Asymptote: the $x$-axis.'],
      solution: [
        { tex: `${m(`${powTex(b, '0')} = 1`)}, and ${m(powTex(b, 'x'))} is positive for every ${m('x')} but approaches ${m('0')}.`, why: 'A positive number raised to any power is positive.' },
        { tex: `So ${q} is ${right}.` },
      ],
    };
  },
};

const expBase: Generator = {
  id: 'u3-expg-base',
  nodeId: 'RF9.exp-graph',
  title: 'Find the base from a point',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 4, 5, 6, 8, 9]);
    const x = tier === 1 ? rng.int(2, 3) : tier === 2 ? rng.pick([-2, -1, -3]) : rng.pick([F(1, 2), F(3, 2), F(-1, 2)]);
    let y: Frac;
    if (x instanceof Frac) {
      const r = Math.sqrt(b);
      if (!Number.isInteger(r)) throw new Reject();
      y = powFrac(r, x.n);
    } else y = powFrac(b, x);
    if (y.n > 1000 || y.d > 1000) throw new Reject();
    const xt = Frac.of(x).tex();
    return {
      cognitive: 'procedural',
      stem: `The graph of ${m('y = b^x')} passes through ${m(ptTex(Frac.of(x), y))}. What is ${m('b')}?`,
      format: 'input',
      fields: [field(num(b), 'b =')],
      hints: ['Substitute the point.', `${m(`${y.tex()} = b^{${xt}}`)}.`, x instanceof Frac ? 'A fractional exponent: the denominator is a root.' : 'Write the left side as a power with the same exponent.'],
      solution: [
        { tex: m(`b^{${xt}} = ${y.tex()}`) },
        { tex: m(`${y.tex()} = ${powTex(b, xt)}`), why: 'Match the exponent on both sides.' },
        { tex: m(`b = ${b}`) },
      ],
      verify: () => Math.abs(b ** Frac.of(x).value - y.value) < 1e-9,
    };
  },
};

// ---------------------------------------------------------------- RF9.exp-transform

function expParams(rng: Parameters<Generator['make']>[0], tier: number) {
  const bF = rng.pick([F(2), F(3), F(4), F(1, 2)]);
  const b = bF.value;
  const a = tier === 1 ? 1 : rng.pick([1, -1, 2, -2, 3]);
  const c = rng.int(-4, 4);
  const d = rng.int(-5, 5);
  const at = a === 1 ? '' : a === -1 ? '-' : String(a);
  const bt = b === 0.5 ? '\\left(\\frac{1}{2}\\right)' : Math.abs(a) === 1 ? String(b) : `(${b})`;
  const tex = `y = ${at}${bt}^{${c === 0 ? 'x' : shiftTex(c)}}${signed(d)}`;
  return { a, b, bF, c, d, tex };
}

const expAsymptote: Generator = {
  id: 'u3-expt-asymptote',
  nodeId: 'RF9.exp-transform',
  title: 'Asymptote and range after a transformation',
  make(rng, tier): Draft {
    const { a, c, d, tex } = expParams(rng, tier);
    if (tier < 3) {
      return {
        cognitive: 'procedural',
        stem: `What is the equation of the horizontal asymptote of ${m(tex)}?`,
        format: 'mc',
        choices: mc({ tex: m(`y = ${d}`), key: d }, [
          { tex: m('y = 0'), key: 'y0', mis: 'exp-asymptote', feedback: `The vertical translation of ${d} moves the asymptote too.` },
          { tex: m(`y = ${-d}`), key: -d, mis: 'tr-k-sign' },
          { tex: m(`x = ${c}`), key: 'xc', mis: 'exp-asymptote', feedback: 'Exponential graphs have a horizontal asymptote; $c$ shifts left or right only.' },
          { tex: m(`y = ${d + a}`), key: d + a, mis: 'exp-asymptote' },
        ]),
        hints: ['$y = b^x$ has asymptote $y = 0$.', 'Only the vertical translation moves a horizontal line.', `Here the vertical translation is ${m(String(d))}.`],
        solution: [{ tex: `${m('y = 0')} moves with the vertical translation: ${m(`y = ${d}`)}.`, why: 'Stretches and reflections in the $x$-axis keep $y = 0$ fixed; horizontal shifts do not affect a horizontal line.' }],
      };
    }
    const range = a > 0 ? intervalAns(d, Infinity, false, false) : intervalAns(-Infinity, d, false, false);
    return {
      cognitive: 'procedural',
      stem: `State the range of ${m(tex)} in interval notation.`,
      format: 'input',
      fields: [field(range, '', 'Range')],
      hints: ['Find the asymptote first.', `Asymptote ${m(`y = ${d}`)}.`, a > 0 ? 'Positive $a$: the graph lies above the asymptote.' : 'Negative $a$: the reflection puts the graph below the asymptote.'],
      solution: [
        { tex: `Asymptote ${m(`y = ${d}`)}; ${a > 0 ? 'the graph is above it' : 'the reflection in the $x$-axis puts the graph below it'}.` },
        { tex: `Range ${m(range.tex)}.`, why: 'The asymptote value is never reached, so the bracket is round.' },
      ],
    };
  },
};

const expPoint: Generator = {
  id: 'u3-expt-point',
  nodeId: 'RF9.exp-transform',
  title: 'Image of a key point',
  make(rng, tier): Draft {
    const { a, b, bF, c, d, tex } = expParams(rng, tier);
    const start: [number, Frac] = tier === 1 ? [0, F(1)] : [1, bF];
    const X = start[0] + c;
    const Yf = start[1].mul(F(a)).add(F(d));
    const Y = Yf.value;
    const bTex = bF.tex();
    return {
      cognitive: 'procedural',
      stem: `The point ${m(ptTex(start[0], start[1]))} is on ${m(`y = ${b === 0.5 ? '\\left(\\frac{1}{2}\\right)' : b}^x`)}. What is the corresponding point on ${m(tex)}?`,
      format: tier === 1 ? 'mc' : 'input',
      ...(tier === 1
        ? {
            choices: mc({ tex: m(ptTex(X, Yf)), key: pkey(X, Y) }, [
              { tex: m(ptTex(start[0] - c, Yf)), key: pkey(start[0] - c, Y), mis: 'tr-h-sign' },
              { tex: m(ptTex(X, start[1].value - d)), key: pkey(X, start[1].value - d), mis: 'tr-k-sign' },
              { tex: m(ptTex(X + 1, Yf.add(F(1)))), key: pkey(X + 1, Y + 1), mis: 'exp-asymptote' },
              { tex: m(ptTex(Yf, X)), key: pkey(Y, X), mis: 'log-def-swap' },
            ]),
          }
        : { fields: [field({ kind: 'points', values: [[X, Y]], tex: ptTex(X, Yf) }, '', 'Point (x, y)')] }),
      hints: ['Mapping: $(x, y) \\to (x + c, ay + d)$.', `Here ${m(`c = ${c}`)}, ${m(`a = ${a}`)}, ${m(`d = ${d}`)}.`, `New ${m('x')}: ${m(`${start[0]} ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`)}.`],
      solution: [
        { tex: m(`(x, y) \\to (x ${c >= 0 ? '+' : '-'} ${Math.abs(c)},\\ ${a === 1 ? '' : a === -1 ? '-' : a}y ${d >= 0 ? '+' : '-'} ${Math.abs(d)})`) },
        { tex: m(`${ptTex(start[0], start[1])} \\to ${ptTex(X, Yf)}`), why: `Base $${bTex}$: stretch or reflect the $y$-coordinate, then translate.` },
      ],
    };
  },
};

const expEquation: Generator = {
  id: 'u3-expt-equation',
  nodeId: 'RF9.exp-transform',
  title: 'Equation from a description',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 5]);
    const reflect = tier >= 2 && rng.chance(0.6);
    const a = tier === 3 ? rng.pick([2, 3]) : 1;
    const c = rng.nz(-4, 4);
    const d = rng.nz(-5, 5);
    const desc = `${a > 1 ? `stretched vertically by a factor of ${a}, ` : ''}${reflect ? 'reflected in the $x$-axis, ' : ''}translated ${Math.abs(c)} unit${Math.abs(c) > 1 ? 's' : ''} ${c > 0 ? 'right' : 'left'} and ${Math.abs(d)} unit${Math.abs(d) > 1 ? 's' : ''} ${d > 0 ? 'up' : 'down'}`;
    const A = (reflect ? -1 : 1) * a;
    const coef = (aa: number) => (aa === 1 ? String(b) : aa === -1 ? `-${b}` : `${aa}(${b})`);
    const eq = (aa: number, cc: number, dd: number) => m(`y = ${coef(aa)}^{${shiftTex(cc)}}${signed(dd)}`);
    return {
      cognitive: 'procedural',
      stem: `The graph of ${m(`y = ${b}^x`)} is ${desc}. Which equation describes the image?`,
      format: 'mc',
      choices: mc({ tex: eq(A, c, d), key: 'ok' }, [
        { tex: eq(A, -c, d), key: 'h', mis: 'tr-h-sign', feedback: `${c > 0 ? 'Right' : 'Left'} ${Math.abs(c)} is $x ${c > 0 ? '-' : '+'} ${Math.abs(c)}$ in the exponent.` },
        { tex: eq(A, c, -d), key: 'k', mis: 'tr-k-sign' },
        { tex: eq(-A, c, d), key: 'r', mis: 'tr-reflect-axis-swap' },
        { tex: m(`y = ${coef(A)}^{-x ${c > 0 ? '+' : '-'} ${Math.abs(c)}}${signed(d)}`), key: 'y', mis: 'tr-reflect-axis-swap' },
      ]),
      hints: ['Use $y = a \\cdot b^{x - c} + d$.', 'Reflection in the $x$-axis: negative $a$. Right $c$: $x - c$.', `Here ${m(`c = ${c}`)}, ${m(`d = ${d}`)}.`],
      solution: [{ tex: `${m(`a = ${A}`)}, ${m(`c = ${c}`)}, ${m(`d = ${d}`)}: ${eq(A, c, d)}.`, why: 'The exponent shift reads opposite to the direction, like any horizontal translation.' }],
    };
  },
};

// ---------------------------------------------------------------- RF7.log-def

const par = (s: string) => (s.startsWith('-') || s.includes('\\frac') ? `\\left(${s}\\right)` : s);

function logTriple(rng: Parameters<Generator['make']>[0], tier: number) {
  const b = rng.pick([2, 3, 4, 5, 10]);
  const y = tier === 1 ? rng.int(2, 4) : rng.pick([-2, -1, 2, 3, 4]);
  const x = powFrac(b, y);
  if (x.n > 10000) throw new Reject();
  return { b, y, x };
}

const logToExp: Generator = {
  id: 'u3-logdef-to-exp',
  nodeId: 'RF7.log-def',
  title: 'Logarithmic to exponential form',
  make(rng, tier): Draft {
    const { b, y, x } = logTriple(rng, tier);
    const symbolic = tier === 3;
    const [L, X, Y] = symbolic ? [b, 'M', 'k'] : [b, x.tex(), String(y)];
    const stem = `Which is equivalent to ${m(`${logB(L)} ${X} = ${Y}`)}?`;
    return {
      cognitive: 'procedural',
      stem,
      format: 'mc',
      choices: mc({ tex: m(`${L}^{${Y}} = ${X}`), key: 'ok' }, [
        // With y = -1, (1/b)^(-1) = b is true, so use a different swap.
        y === -1 && !symbolic ? { tex: m(`${par(X)}^{${L}} = ${Y}`), key: 'a', mis: 'log-def-swap' } : { tex: m(`${par(X)}^{${Y}} = ${L}`), key: 'a', mis: 'log-def-swap' },
        { tex: m(`${par(Y)}^{${L}} = ${X}`), key: 'b', mis: 'log-def-swap' },
        { tex: m(`${L}^{${X}} = ${Y}`), key: 'c', mis: 'log-def-swap' },
      ]),
      hints: ['A logarithm is an exponent.', '$\\log_b x = y$ asks: $b$ to what power gives $x$?', 'The base stays the base; the log value is the exponent.'],
      solution: [{ tex: `${m(`${logB(L)} ${X} = ${Y} \\iff ${L}^{${Y}} = ${X}`)}.`, why: 'The base of the log is the base of the power; the answer of the log is the exponent.' }],
      verify: () => symbolic || Math.abs(b ** y - x.value) < 1e-9,
    };
  },
};

const expToLog: Generator = {
  id: 'u3-logdef-to-log',
  nodeId: 'RF7.log-def',
  title: 'Exponential to logarithmic form',
  make(rng, tier): Draft {
    const { b, y, x } = logTriple(rng, tier);
    const symbolic = tier === 3;
    const [B, X, Y] = symbolic ? [String(b), 'N', 'x - 1'] : [String(b), x.tex(), String(y)];
    const lb = (base: string) => (base === '10' ? '\\log' : `\\log_{${base}}`);
    return {
      cognitive: 'procedural',
      stem: `Write ${m(`${B}^{${Y}} = ${X}`)} in logarithmic form.`,
      format: 'mc',
      choices: mc({ tex: m(`${lb(B)} ${X} = ${Y}`), key: 'ok' }, [
        { tex: m(`${lb(B)} \\left(${Y}\\right) = ${X}`), key: 'a', mis: 'log-def-swap' },
        // With y = -1, log_{1/b} b = -1 is true, so use a sign slip instead.
        y === -1 && !symbolic ? { tex: m(`${lb(B)} ${X} = 1`), key: 'b', mis: 'log-def-swap' } : { tex: m(`${lb(X)} ${B} = ${Y}`), key: 'b', mis: 'log-def-swap' },
        { tex: m(`${lb(Y)} ${X} = ${B}`), key: 'c', mis: 'log-def-swap' },
      ]),
      hints: ['The exponent is what the logarithm equals.', '$b^y = x \\iff \\log_b x = y$.', `The base is ${m(B)}.`],
      solution: [{ tex: m(`${B}^{${Y}} = ${X} \\iff ${lb(B)} ${X} = ${Y}`), why: 'Same base; the log isolates the exponent.' }],
    };
  },
};

const logSolve: Generator = {
  id: 'u3-logdef-solve',
  nodeId: 'RF7.log-def',
  title: 'Solve using the definition',
  make(rng, tier): Draft {
    const { b, y, x } = logTriple(rng, tier);
    const unknown = tier === 1 ? 'x' : rng.pick(['x', 'b', 'y'] as const);
    if (unknown === 'b' && y <= 0) throw new Reject();
    const stem = unknown === 'x' ? `${logB(b)} x = ${y}` : unknown === 'b' ? `\\log_{b} ${x.tex()} = ${y}` : `${logB(b)} ${x.tex()} = y`;
    const ans = unknown === 'x' ? x : unknown === 'b' ? F(b) : F(y);
    return {
      cognitive: 'procedural',
      stem: `Solve ${m(stem)}.`,
      format: 'input',
      fields: [field(num(ans), `${unknown} =`)],
      hints: ['Rewrite in exponential form.', unknown === 'x' ? `${m(`x = ${b}^{${y}}`)}.` : unknown === 'b' ? `${m(`b^{${y}} = ${x.tex()}`)}.` : `${m(`${b}^y = ${x.tex()}`)}.`, unknown === 'y' ? `Write ${m(x.tex())} as a power of ${m(String(b))}.` : 'Evaluate or take the matching root.'],
      solution: [
        { tex: m(unknown === 'x' ? `x = ${b}^{${y}}` : unknown === 'b' ? `b^{${y}} = ${x.tex()}` : `${b}^y = ${x.tex()} = ${powTexSafe(b, y)}`), why: '$\\log_b x = y \\iff b^y = x$.' },
        { tex: m(`${unknown} = ${ans.tex()}`), why: unknown === 'b' ? 'The base of a logarithm must be positive, so take the positive root.' : undefined },
      ],
      verify: () => Math.abs(b ** y - x.value) < 1e-9,
    };
  },
};
const powTexSafe = (b: number, y: number) => `${b}^{${y}}`;

// ---------------------------------------------------------------- RF7.log-eval

const logExact: Generator = {
  id: 'u3-logeval-exact',
  nodeId: 'RF7.log-eval',
  title: 'Exact value of a logarithm',
  make(rng, tier): Draft {
    let b: number;
    let arg: string;
    let val: Frac;
    let steps: string;
    let xv: Frac;
    if (tier === 3) {
      // Common root base: log_9 27 = 3/2, log_8 4 = 2/3, log_4 (1/8) = −3/2
      const [root, p, q] = rng.pick([[3, 2, 3], [2, 3, 2], [2, 2, 3], [2, 2, -3], [5, 2, 3], [3, 2, -1], [2, 3, -1]] as const);
      b = root ** p;
      xv = q >= 0 ? F(root ** q) : F(1, root ** -q);
      arg = xv.tex();
      val = F(q, p);
      steps = `${m(`${b} = ${root}^{${p}}`)} and ${m(`${arg} = ${root}^{${q}}`)}, so ${m(`(${root}^{${p}})^y = ${root}^{${q}} \\Rightarrow ${p}y = ${q}`)}`;
    } else {
      b = rng.pick([2, 3, 5, 10]);
      const k = tier === 1 ? rng.int(1, 4) : rng.pick([-3, -2, -1, 0]);
      xv = powFrac(b, k);
      arg = b === 10 && k < 0 ? (10 ** k).toString() : xv.tex();
      val = F(k);
      steps = `${m(`${arg} = ${b}^{${k}}`)}`;
    }
    return {
      cognitive: 'procedural',
      stem: `Evaluate ${m(`${logB(b)} ${arg.startsWith('\\frac') ? `\\left(${arg}\\right)` : arg}`)} without a calculator.`,
      format: 'input',
      fields: [field(num(val), '')],
      hints: [`Ask: ${m(String(b))} to what power gives ${m(arg)}?`, 'Write both numbers as powers of the same base.', tier === 3 ? 'Set the exponents equal and solve.' : 'A fraction means a negative exponent; 1 means exponent 0.'],
      solution: [{ tex: steps }, { tex: m(`${logB(b)} ${arg} = ${val.tex()}`), why: 'The logarithm is the exponent.' }],
      verify: () => Math.abs(b ** val.value - xv.value) < 1e-9,
    };
  },
};

const logBetween: Generator = {
  id: 'u3-logeval-between',
  nodeId: 'RF7.log-eval',
  title: 'Estimate between integers',
  make(rng, tier): Draft {
    const b = tier === 1 ? rng.pick([2, 10]) : rng.pick([3, 4, 5, 6, 7]);
    const k = rng.int(1, b === 2 ? 5 : 3);
    const x = rng.int(b ** k + 1, b ** (k + 1) - 1);
    const lo = k;
    const pair = (a: number) => m(`${a} \\text{ and } ${a + 1}`);
    return {
      cognitive: 'conceptual',
      stem: `Without a calculator, ${m(`${logB(b)} ${x}`)} lies between which two consecutive integers?`,
      format: 'mc',
      choices: mc({ tex: pair(lo), key: lo }, [
        { tex: pair(lo - 1), key: lo - 1, mis: 'log-def-swap' },
        { tex: pair(lo + 1), key: lo + 1, mis: 'log-def-swap' },
        { tex: pair(lo + 2), key: lo + 2, mis: 'log-def-swap' },
      ]),
      hints: [`List powers of ${m(String(b))}.`, `Find the powers just below and above ${m(String(x))}.`, `${m(`${b}^{${k}} = ${b ** k}`)}.`],
      solution: [
        { tex: m(`${b}^{${k}} = ${b ** k} < ${x} < ${b ** (k + 1)} = ${b}^{${k + 1}}`) },
        { tex: `So ${m(`${k} < ${logB(b)} ${x} < ${k + 1}`)}.`, why: '$\\log_b x$ increases with $x$ for $b > 1$.' },
      ],
      verify: () => Math.log(x) / Math.log(b) > k && Math.log(x) / Math.log(b) < k + 1,
    };
  },
};

const logCombo: Generator = {
  id: 'u3-logeval-combo',
  nodeId: 'RF7.log-eval',
  title: 'Evaluate an expression with logs',
  make(rng, tier): Draft {
    const parts = Array.from({ length: tier === 1 ? 2 : 3 }, () => {
      const b = rng.pick([2, 3, 4, 5, 10]);
      const k = rng.pick(tier === 1 ? [1, 2, 3] : [-2, -1, 0, 1, 2, 3]);
      const x = powFrac(b, k);
      const sgn = rng.pick([1, -1]);
      return { b, k, x, sgn };
    });
    parts[0].sgn = 1;
    if (tier === 3) parts[2] = { ...parts[2], k: 0.5 } as never;
    const term = (p: (typeof parts)[number]) => {
      const argT = p.k === 0.5 ? `\\sqrt{${p.b}}` : p.x.tex().startsWith('\\frac') ? `\\left(${p.x.tex()}\\right)` : p.x.tex();
      return `${logB(p.b)} ${argT}`;
    };
    const expr = parts.map((p, i) => `${i ? (p.sgn > 0 ? ' + ' : ' - ') : ''}${term(p)}`).join('');
    const total = parts.reduce((s, p) => s.add(F(p.sgn).mul(p.k === 0.5 ? F(1, 2) : F(p.k))), F(0));
    if (parts.some((p, i) => i < 2 && p.x.n > 10000)) throw new Reject();
    return {
      cognitive: 'procedural',
      stem: `Evaluate ${m(expr)}.`,
      format: 'input',
      fields: [field(num(total), '')],
      hints: ['Evaluate each logarithm separately.', 'Each one is an exponent: $\\log_b b^k = k$.', tier === 3 ? '$\\sqrt{b} = b^{1/2}$.' : 'Keep track of the signs between terms.'],
      solution: [
        { tex: parts.map((p) => m(`${term(p)} = ${p.k === 0.5 ? '\\frac{1}{2}' : p.k}`)).join(', ') + '.' },
        { tex: m(`${expr} = ${total.tex()}`) },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF9.log-graph

const logAsymptote: Generator = {
  id: 'u3-logg-asymptote',
  nodeId: 'RF9.log-graph',
  title: 'Vertical asymptote of a log function',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 10]);
    const c = rng.nz(-5, 5);
    const d = rng.int(-4, 4);
    const k = tier === 3 ? rng.pick([2, 3]) : 1;
    const inner = k === 1 ? shiftTex(c) : `${k}x ${-k * c >= 0 ? '+' : '-'} ${Math.abs(k * c)}`;
    const tex = `y = ${tier >= 2 ? rng.pick(['2', '-', '3', '']) : ''}${logB(b)}\\left(${inner}\\right)${signed(d)}`;
    return {
      cognitive: 'procedural',
      stem: `What is the equation of the vertical asymptote of ${m(tex)}?`,
      format: 'mc',
      choices: mc({ tex: m(`x = ${c}`), key: c }, [
        { tex: m('x = 0'), key: 'x0', mis: 'exp-asymptote', feedback: 'The horizontal translation moves the asymptote.' },
        { tex: m(`x = ${-c}`), key: -c, mis: 'tr-h-sign' },
        { tex: m(`y = ${d}`), key: 'yd', mis: 'exp-asymptote', feedback: 'Log graphs have a vertical asymptote.' },
        { tex: m(`x = ${k * c}`), key: k * c, mis: 'tr-h-sign' },
      ]),
      hints: ['The argument of a log must be positive; the asymptote is where it equals 0.', `Solve ${m(`${inner} = 0`)}.`, k > 1 ? 'Divide by the coefficient of $x$.' : `${m(`x = ${c}`)}.`],
      solution: [{ tex: m(`${inner} = 0 \\Rightarrow x = ${c}`), why: 'The graph approaches the line where the argument becomes 0.' }],
    };
  },
};

const logDomain: Generator = {
  id: 'u3-logg-domain',
  nodeId: 'RF9.log-graph',
  title: 'Domain of a log function',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 5, 10]);
    const c = rng.nz(-6, 6);
    const reflect = tier === 3 && rng.chance(0.5);
    const inner = reflect ? `${c} - x` : shiftTex(c);
    const d = rng.int(-3, 3);
    const a = tier === 1 ? '' : rng.pick(['2', '-', '-3', '']);
    const dom = reflect ? intervalAns(-Infinity, c, false, false) : intervalAns(c, Infinity, false, false);
    return {
      cognitive: 'procedural',
      stem: `State the domain of ${m(`y = ${a}${logB(b)}\\left(${inner}\\right)${signed(d)}`)} in interval notation.`,
      format: 'input',
      fields: [field(dom, '', 'Domain')],
      hints: ['Only positive numbers have logarithms.', `Solve ${m(`${inner} > 0`)}.`, reflect ? 'Dividing by a negative reverses the inequality.' : 'Vertical stretches and translations do not change the domain.'],
      solution: [
        { tex: m(`${inner} > 0 \\Rightarrow x ${reflect ? '<' : '>'} ${c}`), why: 'The argument of a logarithm must be positive.' },
        { tex: `Domain ${m(dom.tex)}.` },
      ],
    };
  },
};

const logInverse: Generator = {
  id: 'u3-logg-inverse',
  nodeId: 'RF9.log-graph',
  title: 'Inverse of an exponential or log function',
  make(rng, tier): Draft {
    const b = rng.pick([2, 3, 5]);
    if (tier === 1) {
      const toLog = rng.chance(0.5);
      const right = toLog ? `y = ${logB(b)} x` : `y = ${b}^x`;
      const given = toLog ? `y = ${b}^x` : `y = ${logB(b)} x`;
      return {
        cognitive: 'conceptual',
        stem: `What is the inverse of ${m(given)}?`,
        format: 'mc',
        choices: mc({ tex: m(right), key: 'ok' }, [
          { tex: m(toLog ? `y = \\log_{x} ${b}` : `y = x^{${b}}`), key: 'a', mis: 'log-def-swap' },
          { tex: m(toLog ? `y = \\frac{1}{${b}^x}` : `y = \\frac{1}{${logB(b)} x}`), key: 'b', mis: 'log-def-swap', feedback: 'The inverse undoes the function; it is not the reciprocal.' },
          { tex: m(toLog ? `y = x^{${b}}` : `y = ${logB(b)} \\left(-x\\right)`), key: 'c', mis: 'log-def-swap' },
        ]),
        hints: ['Swap $x$ and $y$.', toLog ? `${m(`x = ${b}^y`)}.` : `${m(`x = ${logB(b)} y`)}.`, 'Rewrite to isolate $y$.'],
        solution: [{ tex: `Swap: ${m(toLog ? `x = ${b}^y` : `x = ${logB(b)} y`)}. Solve: ${m(right)}.`, why: 'Exponential and logarithmic functions with the same base are inverses.' }],
      };
    }
    const c = rng.nz(-4, 4);
    const d = rng.nz(-4, 4);
    // y = log_b(x − c) + d  ⇄  y = b^{x − d} + c
    const logF = `y = ${logB(b)}\\left(${shiftTex(c)}\\right)${signed(d)}`;
    const expF = (cc: number, dd: number) => `y = ${b}^{${shiftTex(dd)}}${signed(cc)}`;
    const fromLog = tier === 3 || rng.chance(0.5);
    return {
      cognitive: 'procedural',
      stem: `What is the inverse of ${m(fromLog ? logF : expF(c, d))}?`,
      format: 'mc',
      choices: mc({ tex: m(fromLog ? expF(c, d) : logF), key: 'ok' }, [
        { tex: m(fromLog ? expF(d, c) : `y = ${logB(b)}\\left(${shiftTex(d)}\\right)${signed(c)}`), key: 'swap', mis: 'tr-h-sign', feedback: 'Swapping $x$ and $y$ turns the horizontal shift into a vertical one and vice versa.' },
        { tex: m(fromLog ? expF(-c, -d) : `y = ${logB(b)}\\left(${shiftTex(-c)}\\right)${signed(-d)}`), key: 'neg', mis: 'tr-h-sign' },
        { tex: m(fromLog ? `y = x^{${b}}${signed(c - d)}` : `y = ${logB(b)} x${signed(c + d)}`), key: 'x', mis: 'log-def-swap' },
      ]),
      hints: ['Swap $x$ and $y$, then solve for $y$.', fromLog ? `${m(`x = ${logB(b)}(y ${-c >= 0 ? '+' : '-'} ${Math.abs(c)})${signed(d)}`)}: isolate the log, then write in exponential form.` : `${m(`x = ${b}^{y ${-d >= 0 ? '+' : '-'} ${Math.abs(d)}}${signed(c)}`)}: isolate the power, then take ${m(logB(b))}.`, 'Check: the asymptote of one is the reflection of the other’s.'],
      solution: [
        { tex: `Swap ${m('x')} and ${m('y')}.` },
        { tex: fromLog ? m(`x ${-d >= 0 ? '+' : '-'} ${Math.abs(d)} = ${logB(b)}(y ${-c >= 0 ? '+' : '-'} ${Math.abs(c)}) \\Rightarrow ${b}^{${shiftTex(d)}} = y ${-c >= 0 ? '+' : '-'} ${Math.abs(c)}`) : m(`x ${-c >= 0 ? '+' : '-'} ${Math.abs(c)} = ${b}^{y ${-d >= 0 ? '+' : '-'} ${Math.abs(d)}} \\Rightarrow ${logB(b)}(${shiftTex(c)}) = y ${-d >= 0 ? '+' : '-'} ${Math.abs(d)}`), why: 'Convert between forms with $b^y = x \\iff \\log_b x = y$.' },
        { tex: m(fromLog ? expF(c, d) : logF) },
      ],
      verify: () => {
        const f = (x: number) => Math.log(x - c) / Math.log(b) + d;
        const g = (x: number) => b ** (x - d) + c;
        return Math.abs(g(f(c + 3)) - (c + 3)) < 1e-9;
      },
    };
  },
};

export const expLogGraphGenerators: Generator[] = [expGrowth, expChar, expBase, expAsymptote, expPoint, expEquation, logToExp, expToLog, logSolve, logExact, logBetween, logCombo, logAsymptote, logDomain, logInverse];
