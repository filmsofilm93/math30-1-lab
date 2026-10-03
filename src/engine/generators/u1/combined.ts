// RF4 combined transformations y = af(b(x − h)) + k
import { BASE, TP, type TParams, evalTransformed, keyFrac, mapPoint, mappingTex, transformedFTex, transformedTex } from '../../basefns';
import { iv, intervalTex, ALL } from '../../check/realset';
import { field, m, mc, pkey } from '../../framework';
import { coefTex, F, Frac, ptTex, shiftTex, signedTex } from '../../frac';
import type { Rng } from '../../rng';
import type { AnswerSpec, Draft, Generator, Tier } from '../../types';
import { Reject } from '../../types';
import { ivAns, pt } from './basics';
import { describe, fitView, joinWords, pickA, pickB, pickShift } from './shared';

function pickParams(rng: Rng, tier: Tier, opts: { a?: boolean; b?: boolean } = { a: true, b: true }): TParams {
  const a = opts.a === false ? F(1) : tier === 1 && rng.chance(0.4) ? F(1) : pickA(rng, tier);
  const b = opts.b === false ? F(1) : tier === 1 && !a.eq(1) ? F(1) : pickB(rng, tier);
  return TP(a, b, pickShift(rng), pickShift(rng));
}

const bForm = (b: Frac) => (b.eq(1) ? '' : b.eq(-1) ? '-' : b.tex());

// ---------------------------------------------------------------- RF4.combined

const mapCombined: Generator = {
  id: 'rf4-map-point',
  nodeId: 'RF4.combined',
  title: 'Image of a point under combined transformations',
  make(rng, tier): Draft {
    const p = pickParams(rng, tier);
    if (p.a.eq(1) && p.b.eq(1)) throw new Reject();
    const x = F(rng.nz(-4, 4) * Math.abs(p.b.n));
    const y = F(rng.nz(-5, 5) * p.a.d);
    const [X, Y] = mapPoint(x, y, p);
    const eq = `y = ${transformedFTex(p)}`;
    const verify = () => { const f = (t: number) => y.value + 3 * (t - x.value); return Math.abs(p.a.value * f(p.b.value * (X.value - p.h.value)) + p.k.value - Y.value) < 1e-9; };
    const stem = `The point ${m(ptTex(x, y))} is on the graph of $y = f(x)$. Determine the corresponding point on ${m(eq)}.`;
    const hints: [string, string, string] = [
      'Handle $x$ and $y$ separately. Inside the bracket affects $x$; outside affects $y$.',
      'Use the mapping $(x, y) \\to \\left(\\frac{x}{b} + h,\\ ay + k\\right)$: stretch/reflect first, then translate.',
      `Here $a = ${p.a.tex()}$, $b = ${p.b.tex()}$, $h = ${p.h.tex()}$, $k = ${p.k.tex()}$.`,
    ];
    const solution = [
      { tex: `Read the parameters: $a = ${p.a.tex()}$, $b = ${p.b.tex()}$, $h = ${p.h.tex()}$, $k = ${p.k.tex()}$.`, why: 'Compare with $y = af(b(x - h)) + k$. The sign of $h$ is the opposite of what appears in the bracket.' },
      { tex: `Mapping: ${m(mappingTex(p))}.`, why: 'Inside the function the operations are undone in reverse: divide by $b$, then add $h$. Outside they happen as written: multiply by $a$, then add $k$.' },
      { tex: `New $x$: ${m(`\\frac{${x.tex()}}{${p.b.tex()}} ${signedTex(p.h)} = ${X.tex()}`)}. New $y$: ${m(`${p.a.tex()}(${y.tex()}) ${signedTex(p.k)} = ${Y.tex()}`)}.` },
      { tex: `Image: ${m(ptTex(X, Y))}.` },
    ];
    if (tier === 1) {
      const cand = (cx: Frac, cy: Frac, mis: string, feedback?: string) => ({ tex: m(ptTex(cx, cy)), key: pkey(cx.value, cy.value), mis, feedback });
      return {
        cognitive: 'procedural',
        stem,
        verify,
        format: 'mc',
        choices: mc({ tex: m(ptTex(X, Y)), key: pkey(X.value, Y.value) }, [
          cand(x.mul(p.b).add(p.h), Y, 'tr-b-not-reciprocal', 'Inside the bracket, $b$ divides the $x$-coordinate.'),
          cand(x.add(p.h).div(p.b), Y, 'tr-order-translate-first', 'Stretch first, then translate: $\\frac{x}{b} + h$, not $\\frac{x + h}{b}$.'),
          cand(x.div(p.b).sub(p.h), Y, 'tr-h-sign'),
          cand(X, y.add(p.k).mul(p.a), 'tr-order-translate-first', 'Multiply by $a$ first, then add $k$.'),
          cand(x.div(p.b).add(p.h), y.mul(p.a).sub(p.k), 'tr-k-sign'),
        ]),
        hints,
        solution,
      };
    }
    return { cognitive: 'procedural', stem, verify, format: 'input', fields: [field(pt(X, Y), '', 'Point (x, y)')], hints, solution };
  },
};

const mappingRule: Generator = {
  id: 'rf4-mapping-rule',
  nodeId: 'RF4.combined',
  title: 'Write the mapping notation',
  make(rng, tier): Draft {
    const p = pickParams(rng, tier);
    if (p.a.eq(1) && p.b.eq(1)) throw new Reject();
    const eq = `y = ${transformedFTex(p)}`;
    const xs = `${coefTex(p.b.inv())}x${signedTex(p.h)}`;
    const ys = `${coefTex(p.a)}y${signedTex(p.k)}`;
    return {
      cognitive: 'procedural',
      stem: `Write the mapping notation that takes $y = f(x)$ to ${m(eq)}: $(x, y) \\to (\\square, \\square)$.`,
      format: 'input',
      fields: [
        field({ kind: 'expr', tex: xs, variable: 'x', fn: (v) => v / p.b.value + p.h.value, sample: [-6, 6] }, '(x, y) \\to (', 'New x-coordinate (in terms of x)'),
        field({ kind: 'expr', tex: ys, variable: 'y', fn: (v) => p.a.value * v + p.k.value, sample: [-6, 6] }, ',', 'New y-coordinate (in terms of y)'),
      ],
      hints: [
        'The new $x$ depends only on $b$ and $h$; the new $y$ only on $a$ and $k$.',
        'Mapping: $(x, y) \\to \\left(\\frac{x}{b} + h,\\ ay + k\\right)$.',
        `$b = ${p.b.tex()}$, so the new $x$ starts with $\\frac{x}{${p.b.tex()}}$, which is $${coefTex(p.b.inv())}x$.`,
      ],
      solution: [
        { tex: `$a = ${p.a.tex()}$, $b = ${p.b.tex()}$, $h = ${p.h.tex()}$, $k = ${p.k.tex()}$.` },
        { tex: `${m(mappingTex(p))}`, why: 'Horizontal: divide by $b$ (it acts in reverse) then add $h$. Vertical: multiply by $a$ then add $k$.' },
      ],
    };
  },
};

const describeCombined: Generator = {
  id: 'rf4-describe',
  nodeId: 'RF4.combined',
  title: 'Describe combined transformations',
  make(rng, tier): Draft {
    const p = pickParams(rng, tier);
    if (p.a.abs().eq(1) && p.b.abs().eq(1)) throw new Reject();
    const right = describe(p);
    const wrongB = describe({ ...p, b: p.b.inv() });
    const wrongH = describe({ ...p, h: p.h.neg() });
    const swapped = describe({ ...p, a: p.b.abs().inv().mul(p.a.n < 0 ? -1 : 1), b: p.a.abs().inv().mul(p.b.n < 0 ? -1 : 1) });
    const wrongK = describe({ ...p, k: p.k.neg() });
    const cap = (s: string[]) => joinWords(s).replace(/^a/, 'A');
    return {
      cognitive: 'conceptual',
      stem: `Which describes how the graph of $y = f(x)$ is transformed to ${m(`y = ${transformedFTex(p)}`)}?`,
      format: 'mc',
      choices: mc({ tex: cap(right), key: cap(right) }, [
        { tex: cap(wrongB), key: cap(wrongB), mis: 'tr-b-not-reciprocal' },
        { tex: cap(wrongH), key: cap(wrongH), mis: 'tr-h-sign' },
        { tex: cap(swapped), key: cap(swapped), mis: 'tr-a-horizontal' },
        { tex: cap(wrongK), key: cap(wrongK), mis: 'tr-k-sign' },
      ]),
      hints: [
        'Work through $a$, $b$, $h$, $k$ one at a time.',
        'Vertical factor $|a|$. Horizontal factor $\\frac{1}{|b|}$. Negative $a$: reflect in $x$-axis. Negative $b$: reflect in $y$-axis.',
        `$b = ${p.b.tex()}$, so the horizontal factor is $${p.b.abs().inv().tex()}$.`,
      ],
      solution: [
        { tex: `$a = ${p.a.tex()}$, $b = ${p.b.tex()}$, $h = ${p.h.tex()}$, $k = ${p.k.tex()}$.` },
        { tex: `${cap(right)}.`, why: 'Horizontal effects come from inside the bracket and act in reverse; vertical effects come from outside and act as written.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF4.factor-b

const factorBParams: Generator = {
  id: 'rf4-factor-b-params',
  nodeId: 'RF4.factor-b',
  title: 'Factor out b to find the horizontal translation',
  make(rng, tier): Draft {
    const b = F(rng.pick(tier === 1 ? [2, 3, 4] : [2, 3, 4, -2, -3]));
    const h = pickShift(rng, 4);
    const c = b.mul(h).neg(); // b(x - h) = bx + c
    const inner = `${bForm(b)}x${signedTex(c)}`;
    const g = `y = f(${inner})`;
    return {
      cognitive: 'procedural',
      stem: `For ${m(g)}, write the bracket in the form $b(x - h)$. State $b$ and $h$.`,
      format: 'input',
      fields: [field({ kind: 'number', value: b.value, tex: b.tex(), exact: true }, 'b =', 'b'), field({ kind: 'number', value: h.value, tex: h.tex(), exact: true }, 'h =', 'h')],
      hints: [
        'The horizontal translation is not the constant you see in the bracket.',
        `Factor $${b.tex()}$ out of $${inner}$.`,
        `$${inner} = ${b.tex()}\\left(x ${signedTex(c.div(b))}\\right)$`,
      ],
      solution: [
        { tex: `${m(`${inner} = ${b.tex()}\\left(${shiftTex(h)}\\right)`)}`, why: 'Factoring makes the translation visible: $x - h$ must have coefficient $1$ on $x$.' },
        { tex: `$b = ${b.tex()}$ and $h = ${h.tex()}$: a horizontal translation of $${h.abs().tex()}$ ${h.n > 0 ? 'right' : 'left'}.`, why: `Reading $${c.neg().tex()}$ from the unfactored bracket would give the wrong translation.` },
      ],
    };
  },
};

const factorBPoint: Generator = {
  id: 'rf4-factor-b-point',
  nodeId: 'RF4.factor-b',
  title: 'Map a point when b is not factored',
  make(rng, tier): Draft {
    const b = F(rng.pick(tier === 1 ? [2, 3] : [2, 3, -2, -3, 4]));
    const h = pickShift(rng, 4);
    const a = tier === 1 ? F(1) : pickA(rng, 2);
    const k = pickShift(rng, 5);
    const c = b.mul(h).neg();
    const p = TP(a, b, h, k);
    const x = F(rng.nz(-4, 4) * Math.abs(b.n));
    const y = F(rng.nz(-5, 5) * a.d);
    const [X, Y] = mapPoint(x, y, p);
    const g = `y = ${coefTex(a)}f(${bForm(b)}x${signedTex(c)})${signedTex(k)}`;
    const cand = (cx: Frac, mis: string, feedback?: string) => ({ tex: m(ptTex(cx, Y)), key: pkey(cx.value, Y.value), mis, feedback });
    return {
      cognitive: 'procedural',
      verify: () => { const f = (t: number) => y.value + 3 * (t - x.value); return Math.abs(a.value * f(b.value * X.value + c.value) + k.value - Y.value) < 1e-9; },
      stem: `The point ${m(ptTex(x, y))} is on $y = f(x)$. What is the corresponding point on ${m(g)}?`,
      format: 'mc',
      choices: mc({ tex: m(ptTex(X, Y)), key: pkey(X.value, Y.value) }, [
        cand(x.div(b).sub(c), 'tr-b-not-factored', `The translation is not $${c.neg().tex()}$. Factor first: $${b.tex()}(${shiftTex(h)})$.`),
        cand(x.div(b).sub(h), 'tr-h-sign'),
        cand(x.mul(b).add(h), 'tr-b-not-reciprocal'),
        cand(x.sub(c).div(b).add(h), 'tr-order-translate-first'),
      ]),
      hints: [
        'Before reading $h$, the coefficient of $x$ in the bracket must be $1$.',
        `Factor: $${bForm(b)}x${signedTex(c)} = ${b.tex()}(${shiftTex(h)})$, then use $(x, y) \\to \\left(\\frac{x}{b} + h, ay + k\\right)$.`,
        `New $x = \\frac{${x.tex()}}{${b.tex()}} ${signedTex(h)}$.`,
      ],
      solution: [
        { tex: `Factor: ${m(`y = ${transformedFTex(p)}`)}, so $a = ${a.tex()}$, $b = ${b.tex()}$, $h = ${h.tex()}$, $k = ${k.tex()}$.`, why: 'The factored form shows the true horizontal translation.' },
        { tex: `New $x$: ${m(`\\frac{${x.tex()}}{${b.tex()}} ${signedTex(h)} = ${X.tex()}`)}; new $y$: ${m(`${a.tex()}(${y.tex()}) ${signedTex(k)} = ${Y.tex()}`)}.` },
        { tex: `Image: ${m(ptTex(X, Y))}.` },
      ],
    };
  },
};

const factorBDomain: Generator = {
  id: 'rf4-factor-b-domain',
  nodeId: 'RF4.factor-b',
  title: 'Domain of y = √(bx + c)',
  make(rng, tier): Draft {
    const b = F(rng.pick(tier === 1 ? [2, 3, -1] : [2, 3, -2, -3, 4, -4]));
    const h = pickShift(rng, 5);
    const c = b.mul(h).neg();
    const a = tier === 3 ? pickA(rng, 2) : F(1);
    const k = tier === 1 ? F(0) : pickShift(rng);
    const g = `y = ${coefTex(a)}\\sqrt{${bForm(b)}x${signedTex(c)}}${signedTex(k)}`;
    const dom = b.n > 0 ? [iv(h.value, Infinity, true)] : [iv(-Infinity, h.value, false, true)];
    const ran = a.n > 0 ? [iv(k.value, Infinity, true)] : [iv(-Infinity, k.value, false, true)];
    return {
      cognitive: 'conceptual',
      stem: `State the domain and range of ${m(g)}.`,
      format: 'input',
      fields: [field({ kind: 'interval', value: dom, tex: intervalTex(dom) }, '', 'Domain'), field({ kind: 'interval', value: ran, tex: intervalTex(ran) }, '', 'Range')],
      hints: [
        'The expression under a square root cannot be negative.',
        `Solve $${bForm(b)}x${signedTex(c)} \\ge 0$. Remember to flip the inequality if you divide by a negative.`,
        `Factored: $${b.tex()}(${shiftTex(h)}) \\ge 0$.`,
      ],
      solution: [
        { tex: `${m(`${bForm(b)}x${signedTex(c)} \\ge 0 \\Rightarrow ${b.n > 0 ? `x \\ge ${h.tex()}` : `x \\le ${h.tex()}`}`)}`, why: b.n < 0 ? 'Dividing by a negative number reverses the inequality.' : undefined },
        { tex: `Domain: ${m(intervalTex(dom))}.`, why: b.n < 0 ? 'A negative $b$ reflects the graph in the $y$-axis, so it extends to the left.' : undefined },
        { tex: `The root is $\\ge 0$; ${a.n < 0 ? 'the negative $a$ flips it, then ' : ''}add $${k.tex()}$. Range: ${m(intervalTex(ran))}.` },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF4.equation-from-graph

const fromGraph: Generator = {
  id: 'rf4-equation-from-graph',
  nodeId: 'RF4.equation-from-graph',
  title: 'Equation of a transformed graph',
  make(rng, tier): Draft {
    const base = BASE[rng.pick(tier === 3 ? ['sqrt', 'quad', 'abs'] : ['quad', 'abs', 'sqrt'])];
    const a = tier === 1 ? F(rng.sign()) : rng.pick([F(2), F(-2), F(1, 2), F(-1, 2), F(-1), F(3)]);
    const b = tier === 3 && base.id === 'sqrt' ? F(-1) : F(1);
    const p = TP(a, b, pickShift(rng, 4), pickShift(rng, 4));
    const keys = base.keys.map(keyFrac).filter(([x]) => (base.id === 'sqrt' ? x.value <= 4 : Math.abs(x.value) <= 2));
    const img = keys.map(([x, y]) => mapPoint(x, y, p));
    if (img.some(([x, y]) => !x.isInt || !y.isInt)) throw new Reject('non-integer key points');
    const tex = transformedTex(base, p);
    const vertex = img[base.id === 'sqrt' ? 0 : Math.floor(img.length / 2)];
    const sample: [number, number] = base.id === 'sqrt' ? (b.n > 0 ? [p.h.value, p.h.value + 10] : [p.h.value - 10, p.h.value]) : [p.h.value - 6, p.h.value + 6];
    const view = fitView(img.map(([x, y]) => [x.value, y.value]));
    return {
      cognitive: 'problemSolving',
      stem: `The graph shows a transformation of ${m(base.name)}. Write its equation.`,
      verify: () => img.every(([x, y]) => Math.abs(evalTransformed(base, p)(x.value) - y.value) < 1e-9),
      graph: {
        view,
        curves: [{ fn: evalTransformed(base, p), role: 'image' }],
        points: img.map(([x, y]) => ({ x: x.value, y: y.value, label: `(${x.value}, ${y.value})`, kind: 'key' as const })),
      },
      format: 'input',
      fields: [field({ kind: 'expr', tex, variable: 'x', fn: evalTransformed(base, p), sample }, 'y =')],
      hints: [
        `Find the ${base.id === 'sqrt' ? 'endpoint' : 'vertex'} first: it gives $h$ and $k$.`,
        `The ${base.id === 'sqrt' ? 'endpoint' : 'vertex'} of ${m(base.name)} is $(0, 0)$, so it moved to $(h, k)$. Then compare another point to find the stretch${tier === 3 ? ' and any reflection' : ''}.`,
        `${base.id === 'sqrt' ? 'Endpoint' : 'Vertex'}: ${m(ptTex(vertex[0], vertex[1]))}.`,
      ],
      solution: [
        { tex: `${base.id === 'sqrt' ? 'Endpoint' : 'Vertex'} ${m(ptTex(vertex[0], vertex[1]))}, so $h = ${p.h.tex()}$, $k = ${p.k.tex()}$.` },
        { tex: `Moving $1$ unit ${b.n < 0 ? 'left' : 'right'} of the ${base.id === 'sqrt' ? 'endpoint' : 'vertex'}, the graph ${a.n > 0 ? 'rises' : 'falls'} $${a.abs().tex()}$ unit${a.abs().eq(1) ? '' : 's'}, so $a = ${a.tex()}$${b.n < 0 ? ' and $b = -1$' : ''}.`, why: `On ${m(base.name)}, one unit from the ${base.id === 'sqrt' ? 'endpoint' : 'vertex'} gives a rise of $1$. The image's rise is $a$ times that.` },
        { tex: `${m(`y = ${tex}`)}` },
      ],
    };
  },
};

const fromDescription: Generator = {
  id: 'rf4-equation-from-description',
  nodeId: 'RF4.equation-from-graph',
  title: 'Equation from a description in words',
  make(rng, tier): Draft {
    const p = pickParams(rng, Math.max(tier, 2) as Tier);
    if (p.b.abs().eq(1) && p.a.abs().eq(1)) throw new Reject();
    const words = joinWords(describe(p));
    const right = transformedFTex(p);
    const alt = (q: TParams) => transformedFTex(q);
    const notFactored = `${coefTex(p.a)}f\\left(${bForm(p.b)}x${signedTex(p.h.neg())}\\right)${signedTex(p.k)}`;
    return {
      cognitive: 'conceptual',
      stem: `The graph of $y = f(x)$ undergoes ${words}. Which is the equation of the image?`,
      format: 'mc',
      choices: mc({ tex: m(`y = ${right}`), key: right }, [
        { tex: m(`y = ${alt({ ...p, b: p.b.inv() })}`), key: alt({ ...p, b: p.b.inv() }), mis: 'tr-b-not-reciprocal' },
        { tex: m(`y = ${alt({ ...p, h: p.h.neg() })}`), key: alt({ ...p, h: p.h.neg() }), mis: 'tr-h-sign' },
        { tex: m(`y = ${notFactored}`), key: notFactored, mis: 'tr-b-not-factored', feedback: 'Without the bracket around $x - h$, the translation gets multiplied by $b$.' },
        { tex: m(`y = ${alt({ ...p, k: p.k.neg() })}`), key: alt({ ...p, k: p.k.neg() }), mis: 'tr-k-sign' },
      ]),
      hints: [
        'Turn each phrase into one parameter.',
        'Horizontal stretch by factor $s$ means $b = \\frac{1}{s}$. Write the translation as $x - h$ inside a bracket multiplied by $b$.',
        `Here $b = ${p.b.tex()}$ and $h = ${p.h.tex()}$.`,
      ],
      solution: [
        { tex: `$a = ${p.a.tex()}$, $b = ${p.b.tex()}$, $h = ${p.h.tex()}$, $k = ${p.k.tex()}$.`, why: 'Right/up are positive $h$/$k$. A horizontal stretch factor is the reciprocal of $|b|$.' },
        { tex: `${m(`y = ${right}`)}` },
      ],
    };
  },
};

const fromTwoPoints: Generator = {
  id: 'rf4-find-a-k',
  nodeId: 'RF4.equation-from-graph',
  title: 'Find a and k from mapped points',
  make(rng, tier): Draft {
    const a = tier === 1 ? F(rng.pick([2, 3, -1])) : rng.pick([F(2), F(3), F(-2), F(-3), F(1, 2)]);
    const k = pickShift(rng, 6);
    const x1 = rng.nz(-5, 5);
    let x2 = rng.nz(-5, 5);
    if (x2 === x1) x2 = -x1 || 3;
    const y1 = F(rng.nz(-6, 6) * a.d);
    let y2 = F(rng.nz(-6, 6) * a.d);
    if (y2.eq(y1)) y2 = y1.add(2 * a.d);
    const Y1 = y1.mul(a).add(k);
    const Y2 = y2.mul(a).add(k);
    return {
      cognitive: 'problemSolving',
      verify: () => Math.abs(a.value * y1.value + k.value - Y1.value) < 1e-9 && Math.abs(a.value * y2.value + k.value - Y2.value) < 1e-9,
      stem: `Under the transformation $y = af(x) + k$, the point ${m(ptTex(x1, y1))} on $y = f(x)$ maps to ${m(ptTex(x1, Y1))}, and ${m(ptTex(x2, y2))} maps to ${m(ptTex(x2, Y2))}. Determine $a$ and $k$.`,
      format: 'input',
      fields: [field({ kind: 'number', value: a.value, tex: a.tex(), exact: true }, 'a ='), field({ kind: 'number', value: k.value, tex: k.tex(), exact: true }, 'k =')],
      hints: [
        'Each point gives an equation: new $y = a(\\text{old } y) + k$.',
        'Subtract the two equations to eliminate $k$.',
        `${m(`${Y1.tex()} = ${y1.tex()}a + k`)} and ${m(`${Y2.tex()} = ${y2.tex()}a + k`)}.`,
      ],
      solution: [
        { tex: `${m(`${Y1.tex()} = ${y1.tex()}a + k`)} and ${m(`${Y2.tex()} = ${y2.tex()}a + k`)}.`, why: 'The mapping is $(x, y) \\to (x, ay + k)$.' },
        { tex: `Subtract: ${m(`${Y1.sub(Y2).tex()} = ${y1.sub(y2).tex()}a`)}, so $a = ${a.tex()}$.` },
        { tex: `Substitute: ${m(`k = ${Y1.tex()} - (${a.tex()})(${y1.tex()}) = ${k.tex()}`)}.` },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF4.domain-range-image

const drBaseImage: Generator = {
  id: 'rf4-dr-base-image',
  nodeId: 'RF4.domain-range-image',
  title: 'Domain and range of a transformed base function',
  make(rng, tier): Draft {
    const base = BASE[rng.pick(tier === 1 ? ['sqrt', 'quad', 'abs'] : ['sqrt', 'quad', 'abs', 'sqrt'])];
    const a = tier === 1 ? F(rng.pick([2, 3, -1])) : pickA(rng, 3);
    const b = base.id === 'sqrt' && tier > 1 && rng.chance(0.5) ? F(-1) : F(1);
    const p = TP(a, b, pickShift(rng), pickShift(rng));
    const tex = transformedTex(base, p);
    const dom = base.id === 'sqrt' ? (b.n > 0 ? [iv(p.h.value, Infinity)] : [iv(-Infinity, p.h.value)]) : ALL;
    const ran = a.n > 0 ? [iv(p.k.value, Infinity)] : [iv(-Infinity, p.k.value)];
    return {
      cognitive: 'conceptual',
      stem: `State the domain and range of ${m(`y = ${tex}`)}.`,
      format: 'input',
      fields: [field({ kind: 'interval', value: dom, tex: intervalTex(dom) }, '', 'Domain'), field({ kind: 'interval', value: ran, tex: intervalTex(ran) }, '', 'Range')],
      hints: [
        `Start from ${m(base.name)}: domain ${m(intervalTex(base.domain[0] === -Infinity ? ALL : [iv(0, Infinity)]))}, range ${m(intervalTex([iv(0, Infinity)]))}.`,
        'Horizontal changes ($b$, $h$) move the domain; vertical changes ($a$, $k$) move the range. A negative $a$ flips the range.',
        `The ${base.id === 'sqrt' ? 'endpoint' : 'vertex'} moves to $(${p.h.tex()}, ${p.k.tex()})$.`,
      ],
      solution: [
        { tex: `${base.id === 'sqrt' ? 'Endpoint' : 'Vertex'}: ${m(ptTex(p.h, p.k))}.`, why: '$(0, 0)$ maps to $(h, k)$.' },
        { tex: `Domain: ${m(intervalTex(dom))}.`, why: base.id === 'sqrt' ? (b.n < 0 ? 'Reflected in the $y$-axis, the graph runs left from the endpoint.' : 'The graph runs right from the endpoint.') : 'Stretches and translations never limit the domain of a polynomial or absolute value.' },
        { tex: `Range: ${m(intervalTex(ran))}.`, why: a.n < 0 ? 'Negative $a$: the graph opens down from $y = k$.' : 'Positive $a$: the graph goes up from $y = k$.' },
      ],
    };
  },
};

const drMystery: Generator = {
  id: 'rf4-dr-mystery',
  nodeId: 'RF4.domain-range-image',
  title: 'Domain and range after all four parameters',
  make(rng, tier): Draft {
    const p = pickParams(rng, tier);
    const bn = Math.abs(p.b.n);
    const lo = F(rng.int(-3, 0) * bn);
    const hi = lo.add(F(rng.int(2, 4) * bn));
    const c = F(rng.int(-4, 0) * p.a.d);
    const d = c.add(F(rng.int(2, 4) * p.a.d));
    const [d1, d2] = [lo.div(p.b).add(p.h), hi.div(p.b).add(p.h)].sort((u, v) => u.value - v.value);
    const [r1, r2] = [c.mul(p.a).add(p.k), d.mul(p.a).add(p.k)].sort((u, v) => u.value - v.value);
    return {
      cognitive: 'problemSolving',
      stem: `$y = f(x)$ has domain ${m(`[${lo.tex()}, ${hi.tex()}]`)} and range ${m(`[${c.tex()}, ${d.tex()}]`)}. State the domain and range of ${m(`y = ${transformedFTex(p)}`)}.`,
      format: 'input',
      fields: [field(ivAns(d1, d2), '', 'Domain'), field(ivAns(r1, r2), '', 'Range')],
      hints: [
        'Domain endpoints follow the $x$-mapping; range endpoints follow the $y$-mapping.',
        `Use ${m(mappingTex(p))} on each endpoint, then put the smaller value first.`,
        `${m(`\\frac{${lo.tex()}}{${p.b.tex()}} ${signedTex(p.h)} = ${lo.div(p.b).add(p.h).tex()}`)}`,
      ],
      solution: [
        { tex: `Mapping: ${m(mappingTex(p))}.` },
        { tex: `Domain endpoints: ${m(`${lo.tex()} \\to ${lo.div(p.b).add(p.h).tex()}`)}, ${m(`${hi.tex()} \\to ${hi.div(p.b).add(p.h).tex()}`)}. Domain ${m(`[${d1.tex()}, ${d2.tex()}]`)}.`, why: p.b.n < 0 ? 'A negative $b$ swaps the order of the endpoints.' : undefined },
        { tex: `Range endpoints: ${m(`${c.tex()} \\to ${c.mul(p.a).add(p.k).tex()}`)}, ${m(`${d.tex()} \\to ${d.mul(p.a).add(p.k).tex()}`)}. Range ${m(`[${r1.tex()}, ${r2.tex()}]`)}.`, why: p.a.n < 0 ? 'A negative $a$ swaps the order of the endpoints.' : undefined },
      ],
    };
  },
};

const zerosImage: Generator = {
  id: 'rf4-zeros-image',
  nodeId: 'RF4.domain-range-image',
  title: 'x-intercepts after a horizontal change',
  make(rng, tier): Draft {
    const b = tier === 1 ? F(1) : pickB(rng, tier);
    const h = pickShift(rng, 4);
    const a = tier === 3 ? pickA(rng, 3) : F(1);
    const bn = Math.abs(b.n);
    const r = rng.sample([-4, -3, -2, -1, 1, 2, 3, 4], 2).map((v) => F(v * bn));
    const zs = r.map((z) => z.div(b).add(h));
    const p = TP(a, b, h, 0);
    const tex = zs.map((z) => z.tex()).join(', ');
    const ans: AnswerSpec = { kind: 'set', values: zs.map((z) => z.value), tex };
    return {
      cognitive: 'problemSolving',
      verify: () => zs.every((z) => Math.abs(a.value * (b.value * (z.value - h.value) - r[0].value) * (b.value * (z.value - h.value) - r[1].value)) < 1e-9),
      stem: `The zeros of $y = f(x)$ are $${r[0].tex()}$ and $${r[1].tex()}$. Determine the zeros of ${m(`y = ${transformedFTex(p)}`)}.`,
      format: 'input',
      fields: [field(ans, '', 'Zeros, separated by commas')],
      hints: [
        'Zeros are points $(x, 0)$. What happens to them under each parameter?',
        `$a$ doesn't move points with $y = 0$, and $k = 0$. Only $x \\to \\frac{x}{b} + h$ matters.`,
        `${m(`\\frac{${r[0].tex()}}{${b.tex()}} ${signedTex(h)}`)}`,
      ],
      solution: [
        { tex: `The zeros map by ${m(`x \\to \\frac{x}{${b.tex()}} ${signedTex(h)}`)}.`, why: 'A zero has $y = 0$ and $a \\cdot 0 = 0$, so $a$ leaves it on the $x$-axis.' },
        { tex: `${m(`${r[0].tex()} \\to ${zs[0].tex()}`)}, ${m(`${r[1].tex()} \\to ${zs[1].tex()}`)}.` },
      ],
    };
  },
};

export const combinedGenerators: Generator[] = [mapCombined, mappingRule, describeCombined, factorBParams, factorBPoint, factorBDomain, fromGraph, fromDescription, fromTwoPoints, drBaseImage, drMystery, zerosImage];
