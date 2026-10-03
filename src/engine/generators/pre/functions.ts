// Prerequisite layer: function notation, domain and range, linear functions, absolute value, systems.
import { ALL, except, iv, intervalTex, setBuilderTex, type RealSet } from '../../check/realset';
import { field, m, mc, type Cand } from '../../framework';
import { F, Frac, polyEval, polyTex, ptTex, shiftTex, signedTex } from '../../frac';
import type { AnswerSpec, Draft, Generator, GraphSpec } from '../../types';
import { Reject } from '../../types';
import { num, setAns } from './shared';

const intervalAns = (v: RealSet): AnswerSpec => ({ kind: 'interval', value: v, tex: intervalTex(v) });
const paren = (v: number | Frac) => {
  const f = Frac.of(v);
  return f.value < 0 ? `\\left(${f.tex()}\\right)` : f.tex();
};

// ---------------------------------------------------------------- P.func-notation

const fnEval: Generator = {
  id: 'pre-fn-eval',
  nodeId: 'P.func-notation',
  title: 'Evaluate a function',
  make(rng, tier): Draft {
    const poly = tier === 1 ? [rng.nz(-6, 6), rng.int(-9, 9)] : [rng.pick([1, 2, -1, 3]), rng.int(-6, 6), rng.int(-9, 9)];
    const f = polyEval(poly);
    const a = tier === 1 ? rng.int(-5, 5) : rng.nz(-4, -1);
    const name = `f(x) = ${polyTex(poly)}`;
    if (tier === 3) {
      const b = rng.int(1, 4);
      const k = rng.pick([2, 3]);
      const val = k * f(a) - f(b);
      return {
        cognitive: 'procedural',
        stem: `If ${m(name)}, determine ${m(`${k}f(${a}) - f(${b})`)}.`,
        format: 'input',
        fields: [field(num(val), `${k}f(${a}) - f(${b}) =`)],
        hints: ['Evaluate each function value separately, then combine.', `${m(`f(${a})`)} means replace every $x$ with ${m(paren(a))}.`, `${m(`f(${a}) = ${f(a)}`)}`],
        solution: [
          { tex: `${m(`f(${a}) = ${polyTex(poly).replace(/x/g, `\\left(${a}\\right)`)} = ${f(a)}`)}`, why: 'Brackets around a negative input keep the signs right when it is squared.' },
          { tex: `${m(`f(${b}) = ${f(b)}`)}` },
          { tex: `${m(`${k}f(${a}) - f(${b}) = ${k}(${f(a)}) - ${paren(f(b))} = ${val}`)}`, why: `${m(`${k}f(${a})`)} is ${k} times the output, not ${m(`f(${k * a})`)}.` },
        ],
        verify: () => val === k * f(a) - f(b),
      };
    }
    return {
      cognitive: 'procedural',
      stem: `If ${m(name)}, determine ${m(`f(${a})`)}.`,
      format: 'input',
      fields: [field(num(f(a)), `f(${a}) =`)],
      hints: [`${m(`f(${a})`)} is the output when the input is ${a}.`, `Replace every $x$ with ${m(paren(a))}.`, `${m(`f(${a}) = ${polyTex(poly).replace(/x/g, `\\left(${a}\\right)`)}`)}`],
      solution: [
        { tex: `${m(`f(${a}) = ${polyTex(poly).replace(/x/g, `\\left(${a}\\right)`)}`)}`, why: 'Substitute with brackets so a negative input is squared correctly.' },
        { tex: `${m(`= ${f(a)}`)}` },
      ],
    };
  },
};

const fnSolve: Generator = {
  id: 'pre-fn-solve',
  nodeId: 'P.func-notation',
  title: 'Solve f(x) = k',
  make(rng, tier): Draft {
    if (tier === 1) {
      const mm = rng.nz(-5, 5);
      const b = rng.int(-9, 9);
      const k = rng.int(-12, 12);
      const x = F(k - b, mm);
      return {
        cognitive: 'procedural',
        stem: `If ${m(`f(x) = ${polyTex([mm, b])}`)}, determine $x$ when ${m(`f(x) = ${k}`)}.`,
        format: 'input',
        fields: [field(setAns([x]), 'x =')],
        hints: [`${m(`f(x) = ${k}`)} gives the output; you need the input.`, `Solve ${m(`${polyTex([mm, b])} = ${k}`)}.`, `${m(`${polyTex([mm, 0])} = ${k - b}`)}`],
        solution: [
          { tex: `${m(`${polyTex([mm, b])} = ${k}`)}`, why: '$f(x) = k$ is an equation to solve, not a value to substitute.' },
          { tex: `${m(`${polyTex([mm, 0])} = ${k - b}`)}, so ${m(`x = ${x.tex()}`)}.` },
        ],
        verify: () => Math.abs(mm * x.value + b - k) < 1e-9,
      };
    }
    const h = tier === 2 ? 0 : rng.nz(-5, 5);
    const c = rng.int(-9, 9);
    const s = rng.int(1, 6);
    const k = c + s * s;
    const fTex = h === 0 ? polyTex([1, 0, c]) : `\\left(${shiftTex(h)}\\right)^2 ${signedTex(c)}`;
    const roots = [h - s, h + s];
    return {
      cognitive: 'procedural',
      stem: `If ${m(`f(x) = ${fTex}`)}, determine all values of $x$ for which ${m(`f(x) = ${k}`)}.`,
      format: 'input',
      fields: [field(setAns(roots), 'x =')],
      hints: ['Set the function equal to the value and solve.', 'Isolate the squared part, then take the square root of both sides.', `Remember both the positive and negative root: ${m(`\\pm ${s}`)}.`],
      solution: [
        { tex: `${m(`${fTex} = ${k}`)}, so ${m(`${h === 0 ? 'x^2' : `\\left(${shiftTex(h)}\\right)^2`} = ${s * s}`)}.` },
        { tex: `${m(`${h === 0 ? 'x' : shiftTex(h)} = \\pm ${s}`)}`, why: `Both ${s} and ${-s} square to ${s * s}.` },
        { tex: `${m(`x = ${roots[0]}`)} or ${m(`x = ${roots[1]}`)}.` },
      ],
      verify: () => roots.every((x) => (x - h) ** 2 + c === k),
    };
  },
};

const fnTable: Generator = {
  id: 'pre-fn-table',
  nodeId: 'P.func-notation',
  title: 'Function notation from a table',
  make(rng, tier): Draft {
    const xs = [-2, -1, 0, 1, 2, 3];
    const ys = rng.shuffle([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6]).slice(0, 6);
    const solve = tier >= 2 && rng.chance(0.6);
    const i = rng.int(0, 5);
    const table = { head: ['$x$', ...xs.map((x) => `$${x}$`)], rows: [['$f(x)$', ...ys.map((y) => `$${y}$`)]] };
    const cands: Cand[] = [];
    let ask: string;
    let ans: number;
    if (!solve) {
      ask = `f(${xs[i]})`;
      ans = ys[i];
      const j = xs.indexOf(ys[i]);
      const k = ys.indexOf(xs[i]);
      if (k >= 0) cands.push({ tex: m(String(xs[k])), key: xs[k], mis: 'fn-solve-vs-eval', feedback: `That is the $x$ with ${m(`f(x) = ${xs[i]}`)}. ${m(`f(${xs[i]})`)} is the output in the column ${m(`x = ${xs[i]}`)}.` });
      if (j >= 0 && j !== i) cands.push({ tex: m(String(ys[j])), key: ys[j], mis: 'fn-table-misread' });
      const mi = xs.indexOf(-xs[i]);
      if (mi >= 0) cands.push({ tex: m(String(ys[mi])), key: ys[mi], mis: 'fn-sub-sign', feedback: `That is ${m(`f(${-xs[i]})`)}.` });
      if (i > 0) cands.push({ tex: m(String(ys[i - 1])), key: ys[i - 1], mis: 'fn-table-misread' });
      if (i < 5) cands.push({ tex: m(String(ys[i + 1])), key: ys[i + 1], mis: 'fn-table-misread' });
      cands.push({ tex: m(String(xs[i])), key: xs[i], mis: 'fn-solve-vs-eval' });
    } else {
      ask = `x \\text{ such that } f(x) = ${ys[i]}`;
      ans = xs[i];
      const k = xs.indexOf(ys[i]);
      if (k >= 0) cands.push({ tex: m(String(ys[k])), key: ys[k], mis: 'fn-solve-vs-eval', feedback: `That is ${m(`f(${ys[i]})`)}. You need the input whose output is ${ys[i]}.` });
      if (i > 0) cands.push({ tex: m(String(xs[i - 1])), key: xs[i - 1], mis: 'fn-table-misread' });
      if (i < 5) cands.push({ tex: m(String(xs[i + 1])), key: xs[i + 1], mis: 'fn-table-misread' });
      cands.push({ tex: m(String(ys[i])), key: ys[i], mis: 'fn-solve-vs-eval' });
    }
    return {
      cognitive: 'conceptual',
      stem: `Use the table to determine ${m(ask)}.`,
      table,
      format: 'mc',
      choices: mc({ tex: m(String(ans)), key: ans }, cands),
      hints: ['$f(a)$ is an output: start in the $x$ row. $f(x) = b$ asks for an input: start in the $f(x)$ row.', solve ? `Find ${ys[i]} in the $f(x)$ row.` : `Find ${xs[i]} in the $x$ row.`, solve ? `It is under $x = ${xs[i]}$.` : `The entry below it is the answer.`],
      solution: [
        { tex: solve ? `Find ${m(String(ys[i]))} in the ${m('f(x)')} row; it sits under ${m(`x = ${xs[i]}`)}.` : `Find ${m(`x = ${xs[i]}`)}; the value below it is ${m(String(ys[i]))}.`, why: solve ? 'Solving $f(x) = b$ means finding the input that gives output $b$.' : '$f(a)$ is the output for input $a$.' },
        { tex: `${m(solve ? `x = ${xs[i]}` : `f(${xs[i]}) = ${ys[i]}`)}` },
      ],
    };
  },
};

// ---------------------------------------------------------------- P.domain-range

/** Piecewise-linear graph through vertices; endpoints may be open. */
function polyline(vs: [number, number][]): (x: number) => number {
  return (x) => {
    for (let i = 0; i < vs.length - 1; i++) {
      const [x0, y0] = vs[i];
      const [x1, y1] = vs[i + 1];
      if (x >= x0 - 1e-9 && x <= x1 + 1e-9) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
    return NaN;
  };
}

const drGraph: Generator = {
  id: 'pre-dr-graph',
  nodeId: 'P.domain-range',
  title: 'Domain and range from a graph',
  make(rng, tier): Draft {
    const n = tier === 3 ? 4 : 3;
    const xs = rng.sample([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6], n).sort((a, b) => a - b);
    const vs = xs.map((x) => [x, rng.int(-5, 5)] as [number, number]);
    const loIn = tier === 1 ? true : rng.chance(0.5);
    const hiIn = tier === 1 ? true : rng.chance(0.5);
    const closed = vs.map((_, i) => (i === 0 ? loIn : i === vs.length - 1 ? hiIn : true));
    const ysAll = vs.map((v) => v[1]);
    const ymin = Math.min(...ysAll);
    const ymax = Math.max(...ysAll);
    if (ymin === ymax) throw new Reject();
    const minIn = vs.some((v, i) => v[1] === ymin && closed[i]);
    const maxIn = vs.some((v, i) => v[1] === ymax && closed[i]);
    if (tier > 1 && minIn && maxIn && loIn && hiIn) throw new Reject();
    const dom = [iv(xs[0], xs[xs.length - 1], loIn, hiIn)];
    const ran = [iv(ymin, ymax, minIn, maxIn)];
    const graph: GraphSpec = {
      view: { x: [-7, 7], y: [-6, 6] },
      curves: [{ fn: polyline(vs), role: 'image', domain: [xs[0], xs[xs.length - 1]] }],
      points: [
        { x: vs[0][0], y: vs[0][1], kind: loIn ? 'key' : 'open' },
        { x: vs[vs.length - 1][0], y: vs[vs.length - 1][1], kind: hiIn ? 'key' : 'open' },
      ],
    };
    return {
      cognitive: 'procedural',
      stem: 'State the domain and range of the function shown. A hollow dot is not included.',
      graph,
      format: 'input',
      fields: [field(intervalAns(dom), undefined, 'Domain'), field(intervalAns(ran), undefined, 'Range')],
      hints: ['Domain: the $x$-values the graph covers. Range: the $y$-values.', 'Use a square bracket for an included endpoint and a round bracket for a hollow dot.', `The graph runs from $x = ${xs[0]}$ to $x = ${xs[xs.length - 1]}$; the lowest $y$ is ${ymin} and the highest is ${ymax}.`],
      solution: [
        { tex: `Domain: ${m(intervalTex(dom))}.`, why: `Left end ${loIn ? 'closed' : 'open'}, right end ${hiIn ? 'closed' : 'open'}.` },
        { tex: `Range: ${m(intervalTex(ran))}.`, why: `${!minIn || !maxIn ? 'An extreme value reached only at a hollow dot is excluded.' : 'Both the lowest and highest $y$-values are reached at solid points.'}` },
      ],
    };
  },
};

const drConvert: Generator = {
  id: 'pre-dr-convert',
  nodeId: 'P.domain-range',
  title: 'Interval and set-builder notation',
  make(rng, tier): Draft {
    let set: RealSet;
    const a = rng.int(-8, 4);
    const b = a + rng.int(2, 9);
    if (tier === 3) {
      set = rng.chance(0.5) ? except(ALL, [a]) : [iv(-Infinity, b, false, rng.chance(0.5))];
    } else set = [iv(a, b, rng.chance(0.5), rng.chance(0.5))];
    const toInterval = tier !== 2;
    const show = (s: RealSet) => (toInterval ? intervalTex(s) : setBuilderTex(s));
    const given = toInterval ? setBuilderTex(set) : intervalTex(set);
    const variants: { tex: string; mis: string; fb?: string }[] = [];
    const add = (v: RealSet, mis: string, fb?: string) => variants.push({ tex: show(v), mis, fb });
    if (set.length === 2) {
      variants.push({ tex: `(-\\infty, ${a}] \\cup [${a}, \\infty)`, mis: 'dr-bracket-type', fb: `${m(`x = ${a}`)} is excluded, so it needs round brackets on both sides.` });
      add(ALL, 'dr-restriction', `${m(`x \\ne ${a}`)} removes one value.`);
      variants.push({ tex: `(-\\infty, ${a})`, mis: 'dr-restriction', fb: 'Values greater than the excluded one are allowed too.' });
      add([iv(a, Infinity, false, false)], 'dr-restriction');
    } else {
      const I = set[0];
      const fin = (x: number) => Number.isFinite(x);
      if (fin(I.lo)) add([iv(I.lo, I.hi, !I.loIn, I.hiIn)], 'dr-bracket-type', `${I.loIn ? 'Included' : 'Excluded'} endpoint ${I.lo}: ${I.loIn ? 'square' : 'round'} bracket, ${I.loIn ? '$\\le$' : '$<$'}.`);
      if (fin(I.hi)) add([iv(I.lo, I.hi, I.loIn, !I.hiIn)], 'dr-bracket-type', `${I.hiIn ? 'Included' : 'Excluded'} endpoint ${I.hi}: ${I.hiIn ? 'square' : 'round'} bracket.`);
      if (fin(I.lo) && fin(I.hi)) add([iv(I.lo, I.hi, !I.loIn, !I.hiIn)], 'dr-bracket-type');
      if (!fin(I.lo)) {
        add([iv(I.hi, Infinity, I.hiIn, false)], 'dr-bracket-type', '$x$ less than a number extends to $-\\infty$.');
        add([iv(-Infinity, I.hi, false, !I.hiIn)], 'dr-bracket-type');
        add([iv(I.hi, Infinity, !I.hiIn, false)], 'dr-bracket-type');
      }
    }
    return {
      cognitive: 'procedural',
      stem: `Write ${m(given)} in ${toInterval ? 'interval' : 'set-builder'} notation.`,
      format: 'mc',
      choices: mc(
        { tex: m(show(set)), key: show(set) },
        variants.map((v) => ({ tex: m(v.tex), key: v.tex, mis: v.mis, feedback: v.fb })),
      ),
      hints: ['Square bracket ↔ $\\le$ or $\\ge$ (included). Round bracket ↔ $<$ or $>$ (excluded).', 'An infinite end always gets a round bracket.', 'Check each endpoint separately.'],
      solution: [
        { tex: `${m(given)} ${toInterval ? 'in interval notation is' : 'in set-builder notation is'} ${m(show(set))}.`, why: 'Each endpoint keeps its own inclusion: $\\le$ pairs with [ ], $<$ with ( ).' },
      ],
    };
  },
};

const drFunction: Generator = {
  id: 'pre-dr-function',
  nodeId: 'P.domain-range',
  title: 'Domain and range from an equation',
  make(rng, tier): Draft {
    const h = rng.nz(-6, 6);
    const k = rng.int(-6, 6);
    if (tier === 1) {
      const rev = rng.chance(0.4);
      const askRange = rng.chance(0.4);
      const eq = rev ? `y = \\sqrt{${h} - x} ${signedTex(k)}` : `y = \\sqrt{${shiftTex(h)}} ${signedTex(k)}`;
      const dom = rev ? [iv(-Infinity, h, false, true)] : [iv(h, Infinity, true, false)];
      const ran = [iv(k, Infinity, true, false)];
      const ans = askRange ? ran : dom;
      return {
        cognitive: 'procedural',
        stem: `State the ${askRange ? 'range' : 'domain'} of ${m(eq)}.`,
        format: 'input',
        fields: [field(intervalAns(ans), askRange ? 'Range:' : 'Domain:')],
        hints: [askRange ? 'A square root is never negative.' : 'The expression under a square root cannot be negative.', askRange ? `The smallest value of the root is 0, so $y$ starts at ${k}.` : `Solve ${m(rev ? `${h} - x \\ge 0` : `${shiftTex(h)} \\ge 0`)}.`, `Write the answer in interval or set-builder notation.`],
        solution: askRange
          ? [{ tex: `${m('\\sqrt{\\ldots} \\ge 0')}, so ${m(`y \\ge ${k}`)}.`, why: `Adding ${k} shifts every output.` }, { tex: `Range: ${m(intervalTex(ran))}.` }]
          : [{ tex: `${m(rev ? `${h} - x \\ge 0 \\Rightarrow x \\le ${h}` : `${shiftTex(h)} \\ge 0 \\Rightarrow x \\ge ${h}`)}`, why: rev ? 'Dividing by $-1$ reverses the inequality.' : 'The radicand must be non-negative.' }, { tex: `Domain: ${m(intervalTex(dom))}.` }],
      };
    }
    if (tier === 2) {
      const a = rng.nz(-6, 6);
      const eq = `y = \\frac{${a}}{${shiftTex(h)}} ${signedTex(k)}`;
      const dom = except(ALL, [h]);
      return {
        cognitive: 'procedural',
        stem: `State the domain of ${m(eq)}.`,
        format: 'input',
        fields: [field(intervalAns(dom), 'Domain:')],
        hints: ['A denominator cannot be zero.', `Solve ${m(`${shiftTex(h)} = 0`)} to find the excluded value.`, `Exclude ${m(`x = ${h}`)}.`],
        solution: [
          { tex: `${m(`${shiftTex(h)} = 0`)} when ${m(`x = ${h}`)}.`, why: 'Division by zero is not defined.' },
          { tex: `Domain: ${m(`\\{x \\mid x \\ne ${h}, x \\in \\mathbb{R}\\}`)}, or ${m(intervalTex(dom))}.` },
        ],
      };
    }
    // tier 3: √(mx + b) with a fractional endpoint, or range of a parabola
    if (rng.chance(0.5)) {
      const mm = rng.pick([2, 3, -2, -3, 4]);
      const b = rng.nz(-9, 9);
      const e = F(-b, mm);
      if (e.isInt) throw new Reject();
      const dom = mm > 0 ? [iv(e.value, Infinity, true, false)] : [iv(-Infinity, e.value, false, true)];
      return {
        cognitive: 'procedural',
        stem: `State the domain of ${m(`y = \\sqrt{${polyTex([mm, b])}}`)}.`,
        format: 'input',
        fields: [field(intervalAns(dom), 'Domain:')],
        hints: ['The radicand must be at least 0.', `Solve ${m(`${polyTex([mm, b])} \\ge 0`)}.`, mm < 0 ? 'Dividing by a negative number reverses the inequality.' : `${m(`x \\ge ${e.tex()}`)}`],
        solution: [
          { tex: `${m(`${polyTex([mm, b])} \\ge 0 \\Rightarrow ${polyTex([mm, 0])} \\ge ${-b} \\Rightarrow x ${mm > 0 ? '\\ge' : '\\le'} ${e.tex()}`)}`, why: mm < 0 ? 'Dividing by a negative reverses the inequality sign.' : undefined },
          { tex: `Domain: ${m(intervalTex(dom))}.` },
        ],
      };
    }
    const a = rng.pick([1, 2, -1, -3]);
    const ran = a > 0 ? [iv(k, Infinity, true, false)] : [iv(-Infinity, k, false, true)];
    return {
      cognitive: 'procedural',
      stem: `State the range of ${m(`y = ${a === 1 ? '' : a === -1 ? '-' : a}\\left(${shiftTex(h)}\\right)^2 ${signedTex(k)}`)}.`,
      format: 'input',
      fields: [field(intervalAns(ran), 'Range:')],
      hints: ['Find the vertex and the direction of opening.', `Vertex ${m(ptTex(h, k))}.`, `${m(`a ${a > 0 ? '> 0' : '< 0'}`)}: opens ${a > 0 ? 'up' : 'down'}.`],
      solution: [
        { tex: `Vertex ${m(ptTex(h, k))}; opens ${a > 0 ? 'up' : 'down'}.` },
        { tex: `Range: ${m(intervalTex(ran))}.`, why: `The vertex is the ${a > 0 ? 'lowest' : 'highest'} point.` },
      ],
    };
  },
};

// ---------------------------------------------------------------- P.linear

const linSlope: Generator = {
  id: 'pre-lin-slope',
  nodeId: 'P.linear',
  title: 'Slope',
  make(rng, tier): Draft {
    const [x1, y1, x2, y2] = [rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6)];
    if (x1 === x2 || y1 === y2) throw new Reject();
    const s = F(y2 - y1, x2 - x1);
    if (tier === 2) {
      const perp = s.inv().neg();
      return {
        cognitive: 'procedural',
        stem: `A line passes through ${m(ptTex(x1, y1))} and ${m(ptTex(x2, y2))}. What is the slope of a line perpendicular to it?`,
        format: 'input',
        fields: [field(num(perp), 'm_\\perp =')],
        hints: ['Find the slope of the given line first.', 'Perpendicular slopes are negative reciprocals.', `The given slope is ${m(s.tex())}.`],
        solution: [
          { tex: `${m(`m = \\frac{${y2} - ${paren(y1)}}{${x2} - ${paren(x1)}} = ${s.tex()}`)}` },
          { tex: `${m(`m_\\perp = -\\frac{1}{m} = ${perp.tex()}`)}`, why: 'Perpendicular slopes multiply to $-1$: flip the fraction and change the sign.' },
        ],
      };
    }
    if (tier === 3) {
      const A = rng.nz(-6, 6);
      const B = rng.nz(-6, 6);
      const C = rng.int(-12, 12);
      const sl = F(-A, B);
      return {
        cognitive: 'procedural',
        stem: `What is the slope of the line ${m(`${polyTex([A, 0])} ${B < 0 ? '-' : '+'} ${Math.abs(B) === 1 ? '' : Math.abs(B)}y = ${C}`)}?`,
        format: 'input',
        fields: [field(num(sl), 'm =')],
        hints: ['Solve for $y$.', `${m(`${B === 1 ? '' : B === -1 ? '-' : B}y = ${polyTex([-A, C])}`)}`, `Divide every term by ${B}.`],
        solution: [
          { tex: `${m(`${B === 1 ? '' : B === -1 ? '-' : B}y = ${polyTex([-A, C])}`)}` },
          { tex: `${m(`y = ${polyTex([sl, F(C, B)])}`)}, so ${m(`m = ${sl.tex()}`)}.`, why: 'In $y = mx + b$, the coefficient of $x$ is the slope.' },
        ],
      };
    }
    return {
      cognitive: 'procedural',
      stem: `Determine the slope of the line through ${m(ptTex(x1, y1))} and ${m(ptTex(x2, y2))}.`,
      format: 'input',
      fields: [field(num(s), 'm =')],
      hints: ['Slope is rise over run.', '$m = \\frac{y_2 - y_1}{x_2 - x_1}$', `${m(`\\frac{${y2} - ${paren(y1)}}{${x2} - ${paren(x1)}}`)}`],
      solution: [
        { tex: `${m(`m = \\frac{${y2} - ${paren(y1)}}{${x2} - ${paren(x1)}} = \\frac{${y2 - y1}}{${x2 - x1}}`)}`, why: 'Subtract in the same order on top and bottom.' },
        { tex: `${m(`= ${s.tex()}`)}` },
      ],
    };
  },
};

const linEquation: Generator = {
  id: 'pre-lin-equation',
  nodeId: 'P.linear',
  title: 'Equation of a line',
  make(rng, tier): Draft {
    const x1 = rng.int(-5, 5);
    const y1 = rng.int(-6, 6);
    let s: Frac;
    let stem: string;
    let first: { tex: string; why?: string };
    if (tier === 1) {
      s = F(rng.nz(-5, 5), rng.pick([1, 1, 2, 3]));
      stem = `Write the equation of the line with slope ${m(s.tex())} through ${m(ptTex(x1, y1))}.`;
      first = { tex: `Point-slope form: ${m(`y - ${paren(y1)} = ${s.tex()}\\left(x - ${paren(x1)}\\right)`)}.`, why: 'Any point and the slope fix the line.' };
    } else if (tier === 2) {
      const x2 = rng.int(-5, 5);
      const y2 = rng.int(-6, 6);
      if (x2 === x1 || y2 === y1) throw new Reject();
      s = F(y2 - y1, x2 - x1);
      stem = `Write the equation of the line through ${m(ptTex(x1, y1))} and ${m(ptTex(x2, y2))}.`;
      first = { tex: `Slope ${m(`m = \\frac{${y2} - ${paren(y1)}}{${x2} - ${paren(x1)}} = ${s.tex()}`)}.` };
    } else {
      const g = F(rng.nz(-4, 4), rng.pick([1, 2, 3]));
      const gb = rng.int(-5, 5);
      s = g.inv().neg();
      stem = `Write the equation of the line through ${m(ptTex(x1, y1))} perpendicular to ${m(`y = ${polyTex([g, gb])}`)}.`;
      first = { tex: `The given slope is ${m(g.tex())}, so ${m(`m = ${s.tex()}`)}.`, why: 'Perpendicular slopes are negative reciprocals.' };
    }
    const b = F(y1).sub(s.mul(x1));
    const tex = polyTex([s, b]);
    const sv = s.value;
    const bv = b.value;
    return {
      cognitive: 'procedural',
      stem,
      format: 'input',
      fields: [field({ kind: 'expr', tex, variable: 'x', fn: (x) => sv * x + bv, sample: [-5, 5] }, 'y =', 'Write it as y = mx + b.')],
      hints: ['You need the slope and one point.', 'Use $y - y_1 = m(x - x_1)$, then solve for $y$.', `The slope is ${m(s.tex())}.`],
      solution: [
        first,
        { tex: `${m(`y - ${paren(y1)} = ${s.tex()}\\left(x - ${paren(x1)}\\right)`)}` },
        { tex: `${m(`y = ${tex}`)}`, why: 'Expand and isolate $y$.' },
      ],
      verify: () => Math.abs(sv * x1 + bv - y1) < 1e-9,
    };
  },
};

const linRead: Generator = {
  id: 'pre-lin-read',
  nodeId: 'P.linear',
  title: 'Slope and intercept from an equation',
  make(rng, tier): Draft {
    if (tier === 3) {
      const g = F(rng.nz(-5, 5), rng.pick([1, 2, 3, 4]));
      const ans = g.inv().neg();
      return {
        cognitive: 'conceptual',
        stem: `What is the slope of a line perpendicular to ${m(`y = ${polyTex([g, rng.int(-6, 6)])}`)}?`,
        format: 'mc',
        choices: mc({ tex: m(ans.tex()), key: ans.value }, [
          { tex: m(g.neg().tex()), key: -g.value, mis: 'lin-perp-negative', feedback: 'Negative reciprocal: flip the fraction as well as changing the sign.' },
          { tex: m(g.inv().tex()), key: 1 / g.value, mis: 'lin-perp-negative', feedback: 'Flip the fraction and change the sign.' },
          { tex: m(g.tex()), key: g.value + 1e-7, mis: 'lin-perp-negative', feedback: 'Equal slopes give parallel lines.' },
        ]),
        hints: ['Perpendicular slopes multiply to $-1$.', 'Take the negative reciprocal.', `The given slope is ${m(g.tex())}.`],
        solution: [{ tex: `${m(`m_\\perp = -\\frac{1}{${g.tex()}} = ${ans.tex()}`)}`, why: `Check: ${m(`${g.tex()} \\times ${paren(ans)} = -1`)}.` }],
      };
    }
    const A = rng.nz(-6, 6);
    const B = rng.nz(-5, 5);
    const C = rng.nz(-12, 12);
    const mF = F(-A, B);
    const bF = F(C, B);
    const opt = (mm: Frac, bb: Frac) => `slope $${mm.tex()}$, $y$-intercept $${bb.tex()}$`;
    const eq = `${polyTex([A, 0])} ${B < 0 ? '-' : '+'} ${Math.abs(B) === 1 ? '' : Math.abs(B)}y = ${C}`;
    return {
      cognitive: 'procedural',
      stem: `For the line ${m(eq)}, what are the slope and the $y$-intercept?`,
      format: 'mc',
      choices: mc({ tex: opt(mF, bF), key: `${mF}|${bF}` }, [
        { tex: opt(mF.neg(), bF), key: `${mF.neg()}|${bF}`, mis: 'lin-intercept-sign', feedback: `Moving ${m(polyTex([A, 0]))} to the other side changes its sign.` },
        { tex: opt(mF, bF.neg()), key: `${mF}|${bF.neg()}`, mis: 'lin-intercept-sign' },
        { tex: opt(mF.inv(), bF), key: `${mF.inv()}|${bF}`, mis: 'lin-slope-inverse', feedback: 'Slope is the coefficient of $x$ after solving for $y$.' },
        { tex: opt(F(-A), F(C)), key: `${-A}|${C}`, mis: 'lin-intercept-sign', feedback: `Divide every term by ${B} when isolating $y$.` },
      ]),
      hints: ['Solve for $y$ to get $y = mx + b$.', `${m(`${B === 1 ? '' : B === -1 ? '-' : B}y = ${polyTex([-A, C])}`)}`, `Divide by ${B}.`],
      solution: [
        { tex: `${m(`${B === 1 ? '' : B === -1 ? '-' : B}y = ${polyTex([-A, C])}`)}` },
        { tex: `${m(`y = ${polyTex([mF, bF])}`)}`, why: `Divide every term by ${B}.` },
        { tex: `${opt(mF, bF)}.` },
      ],
    };
  },
};

// ---------------------------------------------------------------- P.abs

const absEval: Generator = {
  id: 'pre-abs-eval',
  nodeId: 'P.abs',
  title: 'Evaluate absolute values',
  make(rng, tier): Draft {
    const a = rng.int(-9, 9);
    const b = rng.int(-9, 9);
    const c = rng.int(-9, 9);
    const d = rng.int(-9, 9);
    if (a === b || c === d) throw new Reject();
    if (tier === 1) {
      if (Math.abs(a) === Math.abs(b) || (a > 0 && b > 0)) throw new Reject();
      const val = Math.abs(a) - Math.abs(b);
      return {
        cognitive: 'procedural',
        stem: `Evaluate ${m(`|${a}| - |${b}|`)}.`,
        format: 'input',
        fields: [field(num(val))],
        hints: ['The absolute value of a number is its distance from 0.', `${m(`|${a}| = ${Math.abs(a)}`)}`, `${m(`${Math.abs(a)} - ${Math.abs(b)}`)}`],
        solution: [{ tex: `${m(`|${a}| - |${b}| = ${Math.abs(a)} - ${Math.abs(b)} = ${val}`)}`, why: 'Evaluate each absolute value first; the subtraction outside can still give a negative result.' }],
      };
    }
    const k = tier === 3 ? rng.pick([-2, -3, 2, 3]) : 1;
    const val = Math.abs(a - b) + k * Math.abs(c - d);
    const e = `|${a} - ${paren(b)}| ${k < 0 ? '-' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}|${c} - ${paren(d)}|`;
    return {
      cognitive: 'procedural',
      stem: `Evaluate ${m(e)}.`,
      format: 'input',
      fields: [field(num(val))],
      hints: ['Work inside each absolute value first.', `${m(`${a} - ${paren(b)} = ${a - b}`)}`, `${m(`|${a - b}| = ${Math.abs(a - b)}`)}`],
      solution: [
        { tex: `${m(`|${a - b}| ${k < 0 ? '-' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}|${c - d}|`)}`, why: 'Simplify inside the bars before taking the absolute value; $|a - b| \\ne |a| - |b|$.' },
        { tex: `${m(`= ${Math.abs(a - b)} ${k < 0 ? '-' : '+'} ${Math.abs(k) === 1 ? '' : `${Math.abs(k)}(`}${Math.abs(c - d)}${Math.abs(k) === 1 ? '' : ')'} = ${val}`)}` },
      ],
    };
  },
};

const absPiecewise: Generator = {
  id: 'pre-abs-piecewise',
  nodeId: 'P.abs',
  title: 'Absolute value as a piecewise function',
  make(rng): Draft {
    const mm = rng.nz(-4, 4);
    const b = rng.nz(-8, 8);
    const z = F(-b, mm);
    const lin = polyTex([mm, b]);
    const neg = polyTex([-mm, -b]);
    const cases = (p: string, q: string, c1: string, c2: string) => `$y = \\begin{cases} ${p}, & ${c1} \\\\ ${q}, & ${c2} \\end{cases}$`;
    const ge = (v: Frac) => `x \\ge ${v.tex()}`;
    const lt = (v: Frac) => `x < ${v.tex()}`;
    const le = (v: Frac) => `x \\le ${v.tex()}`;
    const gt = (v: Frac) => `x > ${v.tex()}`;
    const right = mm > 0 ? cases(lin, neg, ge(z), lt(z)) : cases(lin, neg, le(z), gt(z));
    const wrongZ = z.neg();
    const cands: Cand[] = [
      { tex: mm > 0 ? cases(lin, neg, ge(wrongZ), lt(wrongZ)) : cases(lin, neg, le(wrongZ), gt(wrongZ)), key: 'wz', mis: 'abs-piecewise-boundary', feedback: `The pieces switch where ${m(`${lin} = 0`)}, at ${m(`x = ${z.tex()}`)}.` },
      { tex: mm > 0 ? cases(lin, neg, lt(z), ge(z)) : cases(lin, neg, gt(z), le(z)), key: 'sw', mis: 'abs-negate-all', feedback: `Where ${m(lin)} is already non-negative it stays as it is.` },
      { tex: cases(lin, neg, 'x \\ge 0', 'x < 0'), key: 'zero', mis: 'abs-piecewise-boundary', feedback: 'The split is at the zero of the expression inside, not at $x = 0$.' },
      { tex: mm > 0 ? cases(lin, polyTex([-mm, b]), ge(z), lt(z)) : cases(lin, polyTex([-mm, b]), le(z), gt(z)), key: 'half', mis: 'abs-negate-all', feedback: 'Negate the whole expression: $-(mx + b) = -mx - b$.' },
    ];
    if (z.n === 0) throw new Reject();
    return {
      cognitive: 'conceptual',
      stem: `Which piecewise function is equivalent to ${m(`y = |${lin}|`)}?`,
      format: 'mc',
      choices: mc({ tex: right, key: 'ok' }, cands),
      hints: ['$|A| = A$ when $A \\ge 0$ and $|A| = -A$ when $A < 0$.', `Find where ${m(`${lin} = 0`)}.`, `${m(`x = ${z.tex()}`)}; test a value on each side.`],
      solution: [
        { tex: `${m(`${lin} = 0`)} at ${m(`x = ${z.tex()}`)}.`, why: 'The absolute value only changes the part of the graph below the $x$-axis, which starts at this zero.' },
        { tex: `${m(lin)} is non-negative for ${m(mm > 0 ? ge(z) : le(z))}; there ${m(`y = ${lin}`)}. Elsewhere ${m(`y = -(${lin}) = ${neg}`)}.` },
      ],
    };
  },
};

const absGraph: Generator = {
  id: 'pre-abs-graph',
  nodeId: 'P.abs',
  title: 'Intercepts and range of y = |f(x)|',
  make(rng, tier): Draft {
    if (tier === 1) {
      const mm = rng.nz(-4, 4);
      const b = rng.nz(-9, 9);
      const askX = rng.chance(0.5);
      const z = F(-b, mm);
      return {
        cognitive: 'procedural',
        stem: `Determine the ${askX ? '$x$' : '$y$'}-intercept of ${m(`y = |${polyTex([mm, b])}|`)}.`,
        format: 'input',
        fields: [field(num(askX ? z : F(Math.abs(b))), askX ? 'x =' : 'y =')],
        hints: [askX ? '$|A| = 0$ only when $A = 0$.' : 'Set $x = 0$.', askX ? `Solve ${m(`${polyTex([mm, b])} = 0`)}.` : `${m(`y = |${b}|`)}`, askX ? `${m(`x = ${z.tex()}`)}` : 'An absolute value is never negative.'],
        solution: askX
          ? [{ tex: `${m(`${polyTex([mm, b])} = 0 \\Rightarrow x = ${z.tex()}`)}`, why: 'Points on the $x$-axis are invariant under the absolute value.' }]
          : [{ tex: `${m(`y = |${mm}(0) ${signedTex(b)}| = |${b}| = ${Math.abs(b)}`)}`, why: b < 0 ? 'The negative $y$-intercept of the line is reflected above the $x$-axis.' : 'The $y$-intercept is above the $x$-axis, so the absolute value leaves it unchanged.' }],
      };
    }
    const a = rng.pick([1, 2, -1, -2]);
    const h = rng.int(-4, 4);
    const k = rng.nz(-6, 6);
    const low = (a > 0 && k > 0) || (a < 0 && k < 0) ? Math.abs(k) : 0;
    const ran = [iv(low, Infinity, true, false)];
    return {
      cognitive: 'problemSolving',
      stem: `State the range of ${m(`y = \\left|${a === 1 ? '' : a === -1 ? '-' : a}\\left(${shiftTex(h)}\\right)^2 ${signedTex(k)}\\right|`)}.`,
      format: 'input',
      fields: [field(intervalAns(ran), 'Range:')],
      hints: ['Sketch $y = f(x)$ first: find its vertex and direction.', 'Any part below the $x$-axis is reflected above it.', `Does ${m(`y = f(x)`)} cross the $x$-axis? Vertex ${m(ptTex(h, k))}, opens ${a > 0 ? 'up' : 'down'}.`],
      solution: [
        { tex: `${m(`y = f(x)`)} has vertex ${m(ptTex(h, k))} and opens ${a > 0 ? 'up' : 'down'}, so its range is ${m(intervalTex(a > 0 ? [iv(k, Infinity, true, false)] : [iv(-Infinity, k, false, true)]))}.` },
        { tex: low === 0 ? `It takes negative values and crosses the $x$-axis, so ${m('y = |f(x)|')} reaches 0: range ${m(intervalTex(ran))}.` : `All of its values are ${a > 0 ? 'at least' : 'at most'} ${k}; absolute values are at least ${Math.abs(k)}: range ${m(intervalTex(ran))}.`, why: 'Negative outputs become positive; the smallest output of $|f(x)|$ is 0 if $f$ has a zero.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- P.systems

const sysSolve: Generator = {
  id: 'pre-sys-solve',
  nodeId: 'P.systems',
  title: 'Solve a linear-quadratic system',
  make(rng, tier): Draft {
    if (tier === 1) {
      const x0 = rng.int(-5, 5);
      const y0 = rng.int(-6, 6);
      const m1 = rng.nz(-3, 3);
      const m2 = rng.nz(-3, 3);
      if (m1 === m2) throw new Reject();
      const b1 = y0 - m1 * x0;
      const b2 = y0 - m2 * x0;
      return {
        cognitive: 'procedural',
        stem: `Solve the system: ${m(`y = ${polyTex([m1, b1])}`)} and ${m(`y = ${polyTex([m2, b2])}`)}.`,
        format: 'input',
        fields: [field({ kind: 'points', values: [[x0, y0]], tex: ptTex(x0, y0) }, '(x, y) =')],
        hints: ['Both equations give $y$, so set them equal.', `${m(`${polyTex([m1, b1])} = ${polyTex([m2, b2])}`)}`, `${m(`x = ${x0}`)}; substitute to find $y$.`],
        solution: [
          { tex: `${m(`${polyTex([m1, b1])} = ${polyTex([m2, b2])} \\Rightarrow ${polyTex([m1 - m2, 0])} = ${b2 - b1} \\Rightarrow x = ${x0}`)}` },
          { tex: `${m(`y = ${m1}(${x0}) ${signedTex(b1)} = ${y0}`)}, so the solution is ${m(ptTex(x0, y0))}.`, why: 'Give both coordinates of the intersection point.' },
        ],
      };
    }
    const a = tier === 2 ? 1 : rng.pick([1, -1, 2]);
    const r1 = rng.int(-4, 4);
    const r2 = rng.int(-4, 4);
    if (tier === 2 && r1 === r2) throw new Reject();
    const mm = rng.int(-3, 3);
    const d = rng.int(-5, 5);
    // a(x - r1)(x - r2) = quad - line  ⇒ quad = a(x−r1)(x−r2) + mx + d
    const quad = [a, -a * (r1 + r2) + mm, a * r1 * r2 + d];
    const pts = [...new Set([r1, r2])].map((x) => [x, mm * x + d] as [number, number]);
    if (pts.some(([, y]) => Math.abs(y) > 20)) throw new Reject();
    return {
      cognitive: 'procedural',
      stem: `Solve the system: ${m(`y = ${polyTex(quad)}`)} and ${m(`y = ${polyTex([mm, d])}`)}.`,
      format: 'input',
      fields: [field({ kind: 'points', values: pts, tex: pts.map(([x, y]) => ptTex(x, y)).join(', ') }, '(x, y) =')],
      hints: ['Set the two expressions for $y$ equal.', 'Move everything to one side and factor.', `${m(`${polyTex(quad)} - (${polyTex([mm, d])}) = ${polyTex([a, -a * (r1 + r2), a * r1 * r2])}`)}`],
      solution: [
        { tex: `${m(`${polyTex(quad)} = ${polyTex([mm, d])} \\Rightarrow ${polyTex([a, -a * (r1 + r2), a * r1 * r2])} = 0`)}`, why: 'Subtract the whole right side, sign by sign.' },
        { tex: `${m(`${a === 1 ? '' : a === -1 ? '-' : a}(${shiftTex(r1)})(${shiftTex(r2)}) = 0`)}, so ${m(r1 === r2 ? `x = ${r1}` : `x = ${r1}`)}${r1 === r2 ? ' (the line is tangent)' : ` or ${m(`x = ${r2}`)}`}.` },
        { tex: `Substitute into the line: ${pts.map(([x, y]) => m(ptTex(x, y))).join(' and ')}.`, why: 'Each $x$ gives one intersection point; report both coordinates.' },
      ],
      verify: () => pts.every(([x, y]) => Math.abs(polyEval(quad)(x) - y) < 1e-9),
    };
  },
};

const COUNT = ['no points of intersection', 'exactly one point of intersection', 'exactly two points of intersection', 'infinitely many points of intersection'];

const sysCount: Generator = {
  id: 'pre-sys-count',
  nodeId: 'P.systems',
  title: 'Number of solutions of a system',
  make(rng, tier): Draft {
    const want = rng.int(0, 2);
    const mm = rng.int(-3, 3);
    let b: number;
    let c: number;
    let d: number;
    if (want === 1) {
      const r = rng.int(-4, 4);
      d = rng.int(-5, 5);
      b = -2 * r + mm;
      c = r * r + d;
    } else {
      b = rng.int(-6, 6);
      c = rng.int(-6, 6);
      d = rng.int(-6, 6);
    }
    const B = b - mm;
    const C = c - d;
    const D = B * B - 4 * C;
    if ((D > 0 ? 2 : D === 0 ? 1 : 0) !== want || (tier === 1 && want === 1)) throw new Reject();
    return {
      cognitive: 'conceptual',
      stem: `How many times does the line ${m(`y = ${polyTex([mm, d])}`)} intersect the parabola ${m(`y = ${polyTex([1, b, c])}`)}?`,
      format: 'mc',
      choices: mc(
        { tex: COUNT[want], key: want },
        [0, 1, 2, 3]
          .filter((n) => n !== want)
          .map((n) => ({ tex: COUNT[n], key: n, mis: n === 3 ? 'sys-subst-error' : want === 2 && n === 1 ? 'sys-one-solution' : 'quad-disc-count', feedback: n === 3 ? 'A line and a parabola can never coincide.' : undefined })),
      ),
      hints: ['Set the expressions equal and rearrange to $ax^2 + bx + c = 0$.', 'The discriminant counts the solutions.', `${m(`${polyTex([1, B, C])} = 0`)}`],
      solution: [
        { tex: `${m(`${polyTex([1, b, c])} = ${polyTex([mm, d])} \\Rightarrow ${polyTex([1, B, C])} = 0`)}` },
        { tex: `${m(`\\Delta = ${B < 0 ? `(${B})` : B}^2 - 4(1)(${C}) = ${D}`)}`, why: 'Each real root is the $x$-coordinate of one intersection point.' },
        { tex: `${m(`\\Delta ${D > 0 ? '> 0' : D === 0 ? '= 0' : '< 0'}`)}: ${COUNT[want]}.` },
      ],
    };
  },
};

const sysGraph: Generator = {
  id: 'pre-sys-graph',
  nodeId: 'P.systems',
  title: 'Read a system from a graph',
  make(rng, tier): Draft {
    const a = tier === 1 ? 1 : rng.pick([1, -1]);
    const r1 = rng.int(-4, 3);
    const r2 = r1 + rng.int(1, 4);
    const mm = rng.int(-2, 2);
    const d = rng.int(-3, 3);
    const quad = [a, -a * (r1 + r2) + mm, a * r1 * r2 + d];
    const pts = [r1, r2].map((x) => [x, mm * x + d] as [number, number]);
    if (pts.some(([, y]) => Math.abs(y) > 6)) throw new Reject();
    const graph: GraphSpec = {
      view: { x: [-7, 7], y: [-7, 7] },
      curves: [
        { fn: polyEval(quad), role: 'image', label: 'parabola' },
        { fn: (x) => mm * x + d, role: 'aux', label: 'line' },
      ],
    };
    return {
      cognitive: 'procedural',
      stem: `The graphs of ${m(`y = ${polyTex(quad)}`)} and ${m(`y = ${polyTex([mm, d])}`)} are shown. State the solution of the system.`,
      graph,
      format: 'input',
      fields: [field({ kind: 'points', values: pts, tex: pts.map(([x, y]) => ptTex(x, y)).join(', ') }, '(x, y) =')],
      hints: ['The solutions are the intersection points.', 'Read each crossing point and check it in both equations.', `One crossing is at ${m(`x = ${r1}`)}.`],
      solution: [
        { tex: `The graphs cross at ${pts.map(([x, y]) => m(ptTex(x, y))).join(' and ')}.`, why: 'A solution must satisfy both equations, so it lies on both graphs.' },
        { tex: `Check ${m(ptTex(...pts[0]))} in both equations: ${m(`${polyTex(quad).replace(/x/g, `\\left(${r1}\\right)`)} = ${pts[0][1]}`)}.` },
      ],
      verify: () => pts.every(([x, y]) => Math.abs(polyEval(quad)(x) - y) < 1e-9),
    };
  },
};

export const preFunctionGenerators: Generator[] = [fnEval, fnSolve, fnTable, drGraph, drConvert, drFunction, linSlope, linEquation, linRead, absEval, absPiecewise, absGraph, sysSolve, sysCount, sysGraph];
