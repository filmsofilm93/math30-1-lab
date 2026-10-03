// RF2 translations, RF3 stretches, RF5 reflections in the axes, invariant points.
import { BASE, TP, evalTransformed, keyFrac, mapPoint, transformedTex } from '../../basefns';
import { iv, intervalTex } from '../../check/realset';
import { field, m, mc, pkey } from '../../framework';
import { F, Frac, polyTex, ptTex, shiftTex, signedTex } from '../../frac';
import type { AnswerSpec, Draft, Generator, Tier } from '../../types';
import { Reject } from '../../types';
import type { Rng } from '../../rng';
import { baseAndImage, pickA, pickB, pickBase, pickShift, pointOnF } from './shared';

export const pt = (x: Frac, y: Frac): AnswerSpec => ({ kind: 'points', values: [[x.value, y.value]], tex: ptTex(x, y) });
export const ivAns = (lo: Frac, hi: Frac, loIn = true, hiIn = true): AnswerSpec => {
  const v = [iv(lo.value, hi.value, loIn, hiIn)];
  return { kind: 'interval', value: v, tex: intervalTex(v) };
};

/** Finite domain/range pair for a "mystery" function f. */
function finiteDR(rng: Rng) {
  const lo = rng.int(-6, 0);
  const hi = lo + rng.int(3, 8);
  const c = rng.int(-5, 1);
  const d = c + rng.int(2, 7);
  return { dom: [F(lo), F(hi)] as [Frac, Frac], ran: [F(c), F(d)] as [Frac, Frac] };
}

/** Image of [lo, hi] under x → x·s + t (sorted). */
function mapInterval([lo, hi]: [Frac, Frac], s: Frac, t: Frac): [Frac, Frac] {
  const p = lo.mul(s).add(t);
  const q = hi.mul(s).add(t);
  return p.value <= q.value ? [p, q] : [q, p];
}

const intervalPlain = ([a, b]: [Frac, Frac]) => `[${a.tex()}, ${b.tex()}]`;

// ---------------------------------------------------------------- RF2.translate

const translatePoint: Generator = {
  id: 'rf2-translate-point',
  nodeId: 'RF2.translate',
  title: 'Image of a point under a translation',
  make(rng, tier): Draft {
    const [x, y] = pointOnF(rng);
    const h = pickShift(rng);
    const k = pickShift(rng);
    const form = tier === 3 ? `y ${signedTex(k.neg())} = f\\left(${shiftTex(h)}\\right)` : `y = f\\left(${shiftTex(h)}\\right)${signedTex(k)}`;
    const [X, Y] = [x.add(h), y.add(k)];
    const stem = `The point ${m(ptTex(x, y))} is on the graph of $y = f(x)$. What is the corresponding point on the graph of ${m(form)}?`;
    const verify = () => { const f = (t: number) => y.value + 3 * (t - x.value); return Math.abs(f(X.value - h.value) + k.value - Y.value) < 1e-9; };
    const solution = [
      { tex: `Read the translations: ${m(`h = ${h.tex()}`)}, ${m(`k = ${k.tex()}`)}.`, why: `In $y - k = f(x - h)$ the graph moves $h$ right and $k$ up. ${tier === 3 ? 'Here $k$ sits on the $y$ side, so move it across to see its sign.' : 'The sign inside the bracket is the opposite of the direction.'}` },
      { tex: `Mapping: ${m(`(x, y) \\to (x ${signedTex(h)}, y ${signedTex(k)})`)}.` },
      { tex: `Image: ${m(`(${x.tex()} ${signedTex(h)}, ${y.tex()} ${signedTex(k)}) = ${ptTex(X, Y)}`)}.` },
    ];
    const hints: [string, string, string] = [
      'Only translations here: the shape does not change, every point moves the same way.',
      'In $y = f(x - h) + k$ add $h$ to every $x$ and $k$ to every $y$. Watch the sign of $h$.',
      `Here $h = ${h.tex()}$, so the new $x$ is $${x.tex()} ${signedTex(h)}$.`,
    ];
    if (tier === 1) {
      return {
        cognitive: 'procedural',
        stem,
        format: 'mc',
        verify,
        choices: mc({ tex: m(ptTex(X, Y)), key: pkey(X.value, Y.value) }, [
          { tex: m(ptTex(x.sub(h), Y)), key: pkey(x.sub(h).value, Y.value), mis: 'tr-h-sign' },
          { tex: m(ptTex(X, y.sub(k))), key: pkey(X.value, y.sub(k).value), mis: 'tr-k-sign' },
          { tex: m(ptTex(x.sub(h), y.sub(k))), key: pkey(x.sub(h).value, y.sub(k).value), mis: 'tr-h-sign' },
          { tex: m(ptTex(x.add(k), y.add(h))), key: pkey(x.add(k).value, y.add(h).value), mis: 'tr-a-horizontal' },
        ]),
        hints,
        solution,
      };
    }
    return { cognitive: 'procedural', stem, verify, format: 'input', fields: [field(pt(X, Y), '', 'Point (x, y)')], hints, solution };
  },
};

const translateEquation: Generator = {
  id: 'rf2-translate-equation',
  nodeId: 'RF2.translate',
  title: 'Equation of a translated function',
  make(rng, tier): Draft {
    const base = pickBase(rng, tier === 1 ? ['quad', 'abs', 'sqrt'] : ['quad', 'abs', 'sqrt', 'cubic', 'recip']);
    const h = pickShift(rng);
    const k = pickShift(rng);
    const p = TP(1, 1, h, k);
    const tex = transformedTex(base, p);
    const words = `${h.abs().tex()} unit${h.abs().eq(1) ? '' : 's'} ${h.n > 0 ? 'right' : 'left'} and ${k.abs().tex()} unit${k.abs().eq(1) ? '' : 's'} ${k.n > 0 ? 'up' : 'down'}`;
    const keys = base.keys.map(keyFrac);
    const img = keys.map(([x, y]) => mapPoint(x, y, p));
    return {
      cognitive: 'procedural',
      stem: `The graph of ${m(base.name)} is translated ${words}. Write the equation of the image.`,
      graph: tier === 1 ? baseAndImage(base, p, keys.map(([a, b]) => [a.value, b.value]), img.map(([a, b]) => [a.value, b.value])) : undefined,
      format: 'input',
      fields: [
        field(
          {
            kind: 'expr',
            tex,
            variable: 'x',
            fn: evalTransformed(base, p),
            sample: base.id === 'sqrt' ? [h.value, h.value + 12] : [h.value - 6, h.value + 6],
          },
          'y =',
        ),
      ],
      hints: [
        'A horizontal translation changes $x$; a vertical one adds to the whole function.',
        'Replace $x$ with $(x - h)$ and add $k$: $y = f(x - h) + k$.',
        `${h.n > 0 ? 'Right' : 'Left'} ${h.abs().tex()} means $h = ${h.tex()}$, so write $${shiftTex(h)}$ inside the function.`,
      ],
      solution: [
        { tex: `$h = ${h.tex()}$ and $k = ${k.tex()}$.`, why: 'Right is positive $h$, up is positive $k$.' },
        { tex: `Replace $x$ with $(${shiftTex(h)})$ and add $${k.tex()}$.`, why: 'Inside the function, $x - h$ undoes the shift so the old key points land $h$ units over.' },
        { tex: `$y = ${tex}$` },
      ],
    };
  },
};

const translateDR: Generator = {
  id: 'rf2-translate-domain-range',
  nodeId: 'RF2.translate',
  title: 'Domain and range after a translation',
  make(rng, tier): Draft {
    const { dom, ran } = finiteDR(rng);
    const h = pickShift(rng);
    const k = pickShift(rng);
    const nd = mapInterval(dom, F(1), h);
    const nr = mapInterval(ran, F(1), k);
    const g = tier === 3 ? `y ${signedTex(k.neg())} = f\\left(${shiftTex(h)}\\right)` : `y = f\\left(${shiftTex(h)}\\right)${signedTex(k)}`;
    return {
      cognitive: 'conceptual',
      stem: `The function $y = f(x)$ has domain ${m(intervalPlain(dom))} and range ${m(intervalPlain(ran))}. State the domain and range of ${m(g)}.`,
      format: 'input',
      fields: [field(ivAns(nd[0], nd[1]), '', 'Domain'), field(ivAns(nr[0], nr[1]), '', 'Range')],
      hints: [
        'Horizontal changes affect only the domain; vertical changes affect only the range.',
        'Shift both domain endpoints by $h$ and both range endpoints by $k$.',
        `$h = ${h.tex()}$: the domain becomes $[${dom[0].tex()} ${signedTex(h)}, ${dom[1].tex()} ${signedTex(h)}]$.`,
      ],
      solution: [
        { tex: `$h = ${h.tex()}$, $k = ${k.tex()}$.` },
        { tex: `Domain: ${m(`[${dom[0].tex()} ${signedTex(h)}, ${dom[1].tex()} ${signedTex(h)}] = ${intervalPlain(nd)}`)}`, why: 'Every $x$-coordinate moves by $h$.' },
        { tex: `Range: ${m(`[${ran[0].tex()} ${signedTex(k)}, ${ran[1].tex()} ${signedTex(k)}] = ${intervalPlain(nr)}`)}`, why: 'Every $y$-coordinate moves by $k$.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF3.stretch-v

const vstretchPoint: Generator = {
  id: 'rf3-vstretch-point',
  nodeId: 'RF3.stretch-v',
  title: 'Image of a point under a vertical stretch',
  make(rng, tier): Draft {
    const [x, y] = pointOnF(rng);
    const a = pickA(rng, tier);
    const Y = y.mul(a);
    const verify = () => { const f = (t: number) => y.value + 3 * (t - x.value); return Math.abs(a.value * f(x.value) - Y.value) < 1e-9; };
    const stem = `The point ${m(ptTex(x, y))} is on $y = f(x)$. What is the corresponding point on ${m(`y = ${a.tex()}f(x)`)}?`;
    const hints: [string, string, string] = [
      'A number multiplying the whole function changes $y$-values only.',
      '$y = af(x)$ maps $(x, y) \\to (x, ay)$.',
      `Multiply the $y$-coordinate by $${a.tex()}$.`,
    ];
    const solution = [
      { tex: `Mapping: ${m(`(x, y) \\to (x, ${a.tex()}y)`)}.`, why: '$a$ is outside the function, so it acts on outputs ($y$), and the $x$-values stay put.' },
      { tex: `Image: ${m(ptTex(x, Y))}.` },
    ];
    if (tier < 3) {
      return {
        cognitive: 'procedural',
        stem,
        verify,
        format: 'mc',
        choices: mc({ tex: m(ptTex(x, Y)), key: pkey(x.value, Y.value) }, [
          { tex: m(ptTex(x.mul(a), y)), key: pkey(x.mul(a).value, y.value), mis: 'tr-a-horizontal' },
          { tex: m(ptTex(x, y.div(a))), key: pkey(x.value, y.div(a).value), mis: 'tr-b-not-reciprocal', feedback: 'Dividing by $a$ is what happens to $x$ for a horizontal factor $b$; $a$ multiplies $y$.' },
          { tex: m(ptTex(x.mul(a), y.mul(a))), key: pkey(x.mul(a).value, y.mul(a).value), mis: 'tr-a-horizontal' },
          { tex: m(ptTex(x, y.add(a))), key: pkey(x.value, y.add(a).value), mis: 'tr-k-sign', feedback: 'Adding $a$ is a translation. A stretch multiplies.' },
        ]),
        hints,
        solution,
      };
    }
    return { cognitive: 'procedural', stem, verify, format: 'input', fields: [field(pt(x, Y), '', 'Point (x, y)')], hints, solution };
  },
};

const vstretchDescribe: Generator = {
  id: 'rf3-vstretch-describe',
  nodeId: 'RF3.stretch-v',
  title: 'Describe a vertical stretch from the equation',
  make(rng, tier): Draft {
    const base = pickBase(rng, ['quad', 'abs', 'sqrt', 'cubic']);
    const a = pickA(rng, tier);
    const g = transformedTex(base, TP(a, 1, 0, 0));
    const right = `vertical stretch about the $x$-axis by a factor of $${a.abs().tex()}$${a.n < 0 ? ', and a reflection in the $x$-axis' : ''}`;
    const wrongH = `horizontal stretch about the $y$-axis by a factor of $${a.abs().tex()}$${a.n < 0 ? ', and a reflection in the $y$-axis' : ''}`;
    const wrongInv = `vertical stretch about the $x$-axis by a factor of $${a.abs().inv().tex()}$${a.n < 0 ? ', and a reflection in the $x$-axis' : ''}`;
    const wrongRefl = `vertical stretch about the $x$-axis by a factor of $${a.abs().tex()}$${a.n < 0 ? ', and a reflection in the $y$-axis' : ', and a reflection in the $x$-axis'}`;
    const wrongInvH = `horizontal stretch about the $y$-axis by a factor of $${a.abs().inv().tex()}$`;
    return {
      cognitive: 'conceptual',
      stem: `Which describes how the graph of ${m(base.name)} is transformed to give ${m(`y = ${g}`)}?`,
      format: 'mc',
      choices: mc({ tex: `A ${right}`, key: 'r' }, [
        { tex: `A ${wrongH}`, key: 'h', mis: 'tr-a-horizontal' },
        { tex: `A ${wrongInv}`, key: 'i', mis: 'tr-b-not-reciprocal', feedback: 'Only a horizontal factor gets inverted. $a$ is the vertical factor itself.' },
        { tex: `A ${wrongRefl}`, key: 'f', mis: 'tr-reflect-axis-swap' },
        { tex: `A ${wrongInvH}`, key: 'ih', mis: 'tr-a-horizontal' },
      ]),
      hints: [
        'Is the number multiplying the whole function, or multiplying $x$ inside it?',
        'Outside the function = vertical. The factor is $|a|$; a negative $a$ adds a reflection in the $x$-axis.',
        `Here the number outside is $${a.tex()}$.`,
      ],
      solution: [
        { tex: `The equation has the form $y = af(x)$ with $a = ${a.tex()}$.`, why: 'The number multiplies the output of $f$, not $x$.' },
        { tex: `So: a ${right}.`, why: 'Outputs ($y$) are multiplied by $|a|$; a negative $a$ also flips them over the $x$-axis.' },
      ],
    };
  },
};

const vstretchRange: Generator = {
  id: 'rf3-vstretch-range',
  nodeId: 'RF3.stretch-v',
  title: 'Range after a vertical stretch',
  make(rng, tier): Draft {
    const { dom, ran } = finiteDR(rng);
    const a = pickA(rng, tier === 1 ? 2 : 3);
    if (tier === 1 && a.n < 0) throw new Reject();
    const nr = mapInterval(ran, a, F(0));
    return {
      cognitive: 'conceptual',
      stem: `$y = f(x)$ has domain ${m(intervalPlain(dom))} and range ${m(intervalPlain(ran))}. State the domain and range of ${m(`y = ${a.tex()}f(x)`)}.`,
      format: 'input',
      fields: [field(ivAns(dom[0], dom[1]), '', 'Domain'), field(ivAns(nr[0], nr[1]), '', 'Range')],
      hints: [
        'A vertical stretch only touches $y$-values.',
        'Multiply both range endpoints by $a$. If $a < 0$ the order flips.',
        `$${ran[0].tex()} \\times ${a.tex()}$ and $${ran[1].tex()} \\times ${a.tex()}$.`,
      ],
      solution: [
        { tex: `Domain unchanged: ${m(intervalPlain(dom))}.`, why: '$x$-values are not affected by $a$.' },
        { tex: `Range endpoints: ${m(`${ran[0].tex()}(${a.tex()}) = ${ran[0].mul(a).tex()}`)}, ${m(`${ran[1].tex()}(${a.tex()}) = ${ran[1].mul(a).tex()}`)}.` },
        { tex: `Range: ${m(intervalPlain(nr))}.`, why: a.n < 0 ? 'A negative $a$ reverses the order, so write the smaller value first.' : 'Write the smaller value first.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF3.stretch-h

const hstretchPoint: Generator = {
  id: 'rf3-hstretch-point',
  nodeId: 'RF3.stretch-h',
  title: 'Image of a point under a horizontal stretch',
  make(rng, tier): Draft {
    const b = pickB(rng, tier);
    // choose x divisible-friendly
    const x = F(rng.nz(-4, 4)).mul(b.n);
    const y = F(rng.nz(-6, 6));
    const X = x.div(b);
    const verify = () => { const f = (t: number) => y.value + 3 * (t - x.value); return Math.abs(f(b.value * X.value) - y.value) < 1e-9; };
    const stem = `The point ${m(ptTex(x, y))} is on $y = f(x)$. What is the corresponding point on ${m(`y = f\\left(${b.eq(-1) ? '-' : b.tex()}x\\right)`)}?`;
    const hints: [string, string, string] = [
      'A number multiplying $x$ inside the function acts horizontally, and it acts backwards.',
      '$y = f(bx)$ maps $(x, y) \\to \\left(\\frac{x}{b}, y\\right)$.',
      `Divide the $x$-coordinate by $${b.tex()}$.`,
    ];
    const solution = [
      { tex: `Mapping: ${m(`(x, y) \\to \\left(\\frac{x}{${b.tex()}}, y\\right)`)}.`, why: `To get the same output as before, the input must be $${b.tex()}$ times smaller: if $f(${x.tex()}) = ${y.tex()}$, then $f(${b.tex()} \\cdot ${X.tex()}) = ${y.tex()}$.` },
      { tex: `Image: ${m(ptTex(X, y))}.` },
    ];
    if (tier < 3) {
      return {
        cognitive: 'procedural',
        stem,
        verify,
        format: 'mc',
        choices: mc({ tex: m(ptTex(X, y)), key: pkey(X.value, y.value) }, [
          { tex: m(ptTex(x.mul(b), y)), key: pkey(x.mul(b).value, y.value), mis: 'tr-b-not-reciprocal', feedback: 'Inside the function the factor works in reverse: divide $x$ by $b$.' },
          { tex: m(ptTex(x, y.div(b))), key: pkey(x.value, y.div(b).value), mis: 'tr-a-horizontal' },
          { tex: m(ptTex(x, y.mul(b))), key: pkey(x.value, y.mul(b).value), mis: 'tr-a-horizontal' },
          { tex: m(ptTex(x.mul(b).neg(), y)), key: pkey(x.mul(b).neg().value, y.value), mis: 'tr-reflect-axis-swap' },
        ]),
        hints,
        solution,
      };
    }
    return { cognitive: 'procedural', stem, verify, format: 'input', fields: [field(pt(X, y), '', 'Point (x, y)')], hints, solution };
  },
};

const hstretchEquation: Generator = {
  id: 'rf3-hstretch-equation',
  nodeId: 'RF3.stretch-h',
  title: 'Equation after a horizontal stretch',
  make(rng, tier): Draft {
    const base = pickBase(rng, ['quad', 'sqrt', 'abs', 'cubic']);
    const b = pickB(rng, tier, false);
    const factor = b.inv();
    const p = TP(1, b, 0, 0);
    const tex = transformedTex(base, p);
    return {
      cognitive: 'procedural',
      stem: `The graph of ${m(base.name)} is horizontally stretched about the $y$-axis by a factor of ${m(factor.tex())}. Write the equation of the image.`,
      format: 'input',
      fields: [field({ kind: 'expr', tex, variable: 'x', fn: evalTransformed(base, p), sample: base.id === 'sqrt' ? [0, 12] : [-6, 6] }, 'y =')],
      hints: [
        'A horizontal stretch replaces $x$ with $bx$.',
        'Stretch factor $= \\frac{1}{|b|}$, so $b$ is the reciprocal of the factor.',
        `Factor $${factor.tex()}$ means $b = ${b.tex()}$.`,
      ],
      solution: [
        { tex: `$b = \\frac{1}{${factor.tex()}} = ${b.tex()}$.`, why: 'A horizontal stretch by factor $s$ multiplies $x$-coordinates by $s$, which happens when $x$ is replaced by $\\frac{x}{s}$, so $b = \\frac{1}{s}$.' },
        { tex: `Replace $x$ with $${b.tex()}x$: $y = ${tex}$.` },
      ],
    };
  },
};

const hstretchDomain: Generator = {
  id: 'rf3-hstretch-domain',
  nodeId: 'RF3.stretch-h',
  title: 'Domain after a horizontal stretch',
  make(rng, tier): Draft {
    const b = pickB(rng, tier);
    // choose domain endpoints that divide cleanly
    const lo = F(rng.int(-3, 0)).mul(Math.abs(b.n));
    const hi = lo.add(F(rng.int(2, 4)).mul(Math.abs(b.n)));
    const ran = [F(rng.int(-4, 0)), F(rng.int(1, 5))] as [Frac, Frac];
    const nd = mapInterval([lo, hi], b.inv(), F(0));
    return {
      cognitive: 'conceptual',
      stem: `$y = f(x)$ has domain ${m(intervalPlain([lo, hi]))} and range ${m(intervalPlain(ran))}. State the domain and range of ${m(`y = f\\left(${b.eq(-1) ? '-' : b.tex()}x\\right)`)}.`,
      format: 'input',
      fields: [field(ivAns(nd[0], nd[1]), '', 'Domain'), field(ivAns(ran[0], ran[1]), '', 'Range')],
      hints: [
        'Inside changes act on $x$ only, so the range stays the same.',
        'Divide both domain endpoints by $b$. If $b < 0$ the order flips.',
        `$\\frac{${lo.tex()}}{${b.tex()}}$ and $\\frac{${hi.tex()}}{${b.tex()}}$.`,
      ],
      solution: [
        { tex: `Mapping $x \\to \\frac{x}{${b.tex()}}$: ${m(`${lo.tex()} \\to ${lo.div(b).tex()}`)}, ${m(`${hi.tex()} \\to ${hi.div(b).tex()}`)}.` },
        { tex: `Domain: ${m(intervalPlain(nd))}. Range unchanged: ${m(intervalPlain(ran))}.`, why: 'A horizontal stretch never changes $y$-values.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF5.reflect-axes

const reflectPoint: Generator = {
  id: 'rf5-reflect-point',
  nodeId: 'RF5.reflect-axes',
  title: 'Image of a point under a reflection',
  make(rng, tier): Draft {
    const [x, y] = pointOnF(rng);
    if (x.eq(y) || x.eq(y.neg())) throw new Reject('symmetric point');
    const inX = rng.chance(0.5);
    const g = inX ? 'y = -f(x)' : 'y = f(-x)';
    const [X, Y] = inX ? [x, y.neg()] : [x.neg(), y];
    const [sx, sy] = inX ? [x.neg(), y] : [x, y.neg()];
    const verify = () => { const f = (t: number) => y.value + 3 * (t - x.value); const g = inX ? (t: number) => -f(t) : (t: number) => f(-t); return Math.abs(g(X.value) - Y.value) < 1e-9; };
    const stem = `The point ${m(ptTex(x, y))} is on $y = f(x)$. What is the corresponding point on ${m(g)}?`;
    const hints: [string, string, string] = [
      'A negative outside the function flips $y$-values; a negative inside flips $x$-values.',
      inX ? '$y = -f(x)$ is a reflection in the $x$-axis: $(x, y) \\to (x, -y)$.' : '$y = f(-x)$ is a reflection in the $y$-axis: $(x, y) \\to (-x, y)$.',
      `Change the sign of the ${inX ? '$y$' : '$x$'}-coordinate only.`,
    ];
    const solution = [
      { tex: inX ? 'The negative is outside $f$: reflection in the $x$-axis, $(x, y) \\to (x, -y)$.' : 'The negative is inside $f$: reflection in the $y$-axis, $(x, y) \\to (-x, y)$.', why: 'Outside acts on outputs ($y$); inside acts on inputs ($x$).' },
      { tex: `Image: ${m(ptTex(X, Y))}.` },
    ];
    if (tier === 1) {
      return {
        cognitive: 'procedural',
        stem,
        verify,
        format: 'mc',
        choices: mc({ tex: m(ptTex(X, Y)), key: pkey(X.value, Y.value) }, [
          { tex: m(ptTex(sx, sy)), key: pkey(sx.value, sy.value), mis: 'tr-reflect-axis-swap' },
          { tex: m(ptTex(x.neg(), y.neg())), key: pkey(-x.value, -y.value), mis: 'tr-reflect-axis-swap', feedback: 'That point is a reflection in both axes.' },
          { tex: m(ptTex(y, x)), key: pkey(y.value, x.value), mis: 'inv-yx-combined', feedback: 'Swapping coordinates is a reflection in $y = x$.' },
        ]),
        hints,
        solution,
      };
    }
    return { cognitive: 'procedural', stem, verify, format: 'input', fields: [field(pt(X, Y), '', 'Point (x, y)')], hints, solution };
  },
};

const reflectEquation: Generator = {
  id: 'rf5-reflect-equation',
  nodeId: 'RF5.reflect-axes',
  title: 'Equation of a reflected polynomial',
  make(rng, tier): Draft {
    const inX = rng.chance(0.5);
    const c2 = rng.nz(-3, 3);
    const c1 = rng.nz(-6, 6);
    const c0 = rng.nz(-8, 8);
    const c3 = tier === 3 ? rng.nz(-2, 2) : 0;
    const poly = (a3: number, a2: number, a1: number, a0: number) => polyTex(a3 ? [a3, a2, a1, a0] : [a2, a1, a0]);
    const f = poly(c3, c2, c1, c0);
    const g = inX ? poly(-c3, -c2, -c1, -c0) : poly(-c3, c2, -c1, c0);
    const fn = (x: number) => c3 * x ** 3 + c2 * x * x + c1 * x + c0;
    const gfn = inX ? (x: number) => -fn(x) : (x: number) => fn(-x);
    return {
      cognitive: 'procedural',
      stem: `${m(`f(x) = ${f}`)}. Write the equation of the reflection of $y = f(x)$ in the ${inX ? '$x$' : '$y$'}-axis, in expanded form.`,
      format: 'input',
      fields: [field({ kind: 'expr', tex: g, variable: 'x', fn: gfn, sample: [-5, 5] }, 'y =')],
      hints: [
        inX ? 'A reflection in the $x$-axis negates every output.' : 'A reflection in the $y$-axis replaces $x$ with $-x$.',
        inX ? '$y = -f(x)$: change the sign of every term.' : '$y = f(-x)$: odd powers of $x$ change sign, even powers do not.',
        inX ? `Start: $y = -(${f})$.` : `Start: $y = ${f.replace(/x/g, '(-x)')}$.`,
      ],
      solution: [
        { tex: inX ? `$y = -f(x) = -\\left(${f}\\right)$` : `$y = f(-x)$`, why: inX ? 'Every $y$-value changes sign.' : 'Every $x$ is replaced by $-x$.' },
        { tex: `$y = ${g}$`, why: inX ? 'Distribute the negative.' : '$(-x)^2 = x^2$ but $(-x)^3 = -x^3$ and $-(-x) = x$.' },
      ],
    };
  },
};

const reflectDescribe: Generator = {
  id: 'rf5-reflect-describe',
  nodeId: 'RF5.reflect-axes',
  title: 'Identify the reflection from the equation',
  make(rng, tier): Draft {
    const base = pickBase(rng, tier === 1 ? ['sqrt', 'exp2'] : ['sqrt', 'exp2', 'cubic', 'log']);
    const kind = rng.pick(['x', 'y', 'both'] as const);
    const p = TP(kind === 'y' ? 1 : -1, kind === 'x' ? 1 : -1, 0, 0);
    const g = transformedTex(BASE[base.id], p);
    const label = { x: 'a reflection in the $x$-axis', y: 'a reflection in the $y$-axis', both: 'a reflection in the $x$-axis and a reflection in the $y$-axis' };
    const other = { x: 'y', y: 'x', both: 'x' } as const;
    return {
      cognitive: 'conceptual',
      stem: `The graph of ${m(base.name)} is transformed to ${m(`y = ${g}`)}. Which describes the transformation?`,
      format: 'mc',
      choices: mc({ tex: label[kind], key: kind }, [
        { tex: label[other[kind]], key: other[kind], mis: 'tr-reflect-axis-swap' },
        { tex: kind === 'both' ? label.y : label.both, key: kind === 'both' ? 'y' : 'both', mis: 'tr-reflect-axis-swap' },
        { tex: 'a reflection in the line $y = x$', key: 'yx', mis: 'inv-yx-combined' },
      ]),
      hints: [
        'Look at where each negative sign sits: on $x$, or on the whole function.',
        'Negative on $x$ (inside): reflection in the $y$-axis. Negative on the function (outside): reflection in the $x$-axis.',
        `In $${g}$, check the sign in front and the sign on $x$.`,
      ],
      solution: [
        { tex: `Compare with $y = af(bx)$: $a = ${p.a.tex()}$, $b = ${p.b.tex()}$.` },
        { tex: `So it is ${label[kind]}.`, why: '$a < 0$ flips outputs (over the $x$-axis); $b < 0$ flips inputs (over the $y$-axis).' },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF3.invariant

function invariantSetup(rng: Rng) {
  // f given by its intercepts: x-intercepts r1 < r2, y-intercept c
  const r1 = rng.int(-6, -1);
  const r2 = rng.int(1, 6);
  const c = rng.nz(-8, 8);
  return { r1, r2, c };
}

type Tkind = 'vstretch' | 'hstretch' | 'reflX' | 'reflY';

const invariantPoints: Generator = {
  id: 'rf3-invariant-points',
  nodeId: 'RF3.invariant',
  title: 'Invariant points from intercepts',
  make(rng, tier): Draft {
    const { r1, r2, c } = invariantSetup(rng);
    const kind = rng.pick<Tkind>(tier === 1 ? ['reflX', 'reflY'] : ['vstretch', 'hstretch', 'reflX', 'reflY']);
    const a = pickA(rng, 1, false);
    const b = pickB(rng, 1, false);
    const g = { vstretch: `y = ${a.tex()}f(x)`, hstretch: `y = f(${b.tex()}x)`, reflX: 'y = -f(x)', reflY: 'y = f(-x)' }[kind];
    const onX = kind === 'vstretch' || kind === 'reflX';
    const pts: [number, number][] = onX ? [[r1, 0], [r2, 0]] : [[0, c]];
    const tex = pts.map(([x, y]) => ptTex(x, y)).join(', ');
    return {
      cognitive: 'conceptual',
      stem: `The graph of $y = f(x)$ has $x$-intercepts $${r1}$ and $${r2}$ and $y$-intercept $${c}$. List all the invariant points when it is transformed to ${m(g)}.`,
      format: 'input',
      fields: [field({ kind: 'points', values: pts, tex }, '', 'Points, separated by commas')],
      hints: [
        'An invariant point is a point that does not move.',
        onX ? 'Vertical changes (multiplying $y$) leave points with $y = 0$ unchanged.' : 'Horizontal changes (multiplying $x$) leave points with $x = 0$ unchanged.',
        onX ? 'Which points have $y = 0$? The $x$-intercepts.' : 'Which point has $x = 0$? The $y$-intercept.',
      ],
      solution: [
        { tex: onX ? 'This transformation multiplies $y$-coordinates.' : 'This transformation multiplies $x$-coordinates.', why: onX ? `$(x, y) \\to (x, ${kind === 'reflX' ? '-' : a.tex()}y)$` : `$(x, y) \\to (${kind === 'reflY' ? '-x' : `\\frac{x}{${b.tex()}}`}, y)$` },
        { tex: onX ? 'A point stays fixed only if its $y$-coordinate is $0$: the $x$-intercepts.' : 'A point stays fixed only if its $x$-coordinate is $0$: the $y$-intercept.', why: onX ? '$ay = y$ only when $y = 0$ (for $a \\ne 1$).' : '$\\frac{x}{b} = x$ only when $x = 0$ (for $b \\ne 1$).' },
        { tex: `Invariant points: ${m(tex)}.` },
      ],
    };
  },
};

const invariantWhich: Generator = {
  id: 'rf3-invariant-which',
  nodeId: 'RF3.invariant',
  title: 'Which transformation keeps these points fixed?',
  make(rng): Draft {
    const { r1, r2, c } = invariantSetup(rng);
    const xs = rng.chance(0.5);
    const a = pickA(rng, 1, false);
    const b = pickB(rng, 1, false);
    const right = xs ? `y = ${a.tex()}f(x)` : `y = f(${b.tex()}x)`;
    const wrong1 = xs ? `y = f(${b.tex()}x)` : `y = ${a.tex()}f(x)`;
    const wrong2 = xs ? 'y = f(-x)' : '-y = f(x)';
    const wrong3 = xs ? `y = f(x) + ${rng.int(1, 4)}` : `y = f(x - ${rng.int(1, 4)})`;
    const which = xs ? `$(${r1}, 0)$ and $(${r2}, 0)$ the only invariant points` : `$(0, ${c})$ the only invariant point`;
    return {
      cognitive: 'conceptual',
      stem: `$y = f(x)$ has $x$-intercepts $${r1}$ and $${r2}$ and $y$-intercept $${c}$. For which transformation ${xs ? 'are' : 'is'} ${which}?`,
      format: 'mc',
      choices: mc({ tex: m(right), key: 'r' }, [
        { tex: m(wrong1), key: 'w1', mis: 'tr-invariant-wrong-axis' },
        { tex: m(wrong2), key: 'w2', mis: 'tr-invariant-wrong-axis' },
        { tex: m(wrong3), key: 'w3', mis: 'tr-invariant-only-reflection', feedback: 'A translation moves every point, so it has no invariant points.' },
      ]),
      hints: [
        xs ? 'These points all have $y = 0$.' : 'This point has $x = 0$.',
        'Vertical stretches/reflections fix points with $y = 0$. Horizontal ones fix points with $x = 0$. Translations fix nothing.',
        xs ? 'Look for a transformation that multiplies $y$ only.' : 'Look for a transformation that multiplies $x$ only.',
      ],
      solution: [
        { tex: xs ? 'Points with $y = 0$ survive any vertical stretch or reflection in the $x$-axis.' : 'Points with $x = 0$ survive any horizontal stretch or reflection in the $y$-axis.' },
        { tex: `${m(right)} is the only option that ${xs ? 'multiplies $y$-values' : 'multiplies $x$-values'}. ${m(wrong2)} ${xs ? 'is horizontal, so it fixes the $y$-intercept instead' : 'is vertical, so it fixes the $x$-intercepts instead'}.` },
      ],
    };
  },
};

const invariantCount: Generator = {
  id: 'rf3-invariant-count',
  nodeId: 'RF3.invariant',
  title: 'Count invariant points of a polynomial',
  make(rng, tier: Tier): Draft {
    // f(x) = a(x - r1)(x - r2)(x - r3) possibly with a double root; vertical stretch -> count distinct zeros
    const roots = rng.sample([-4, -3, -2, -1, 0, 1, 2, 3, 4], tier === 1 ? 2 : 3);
    const vertical = rng.chance(0.6);
    const fx = roots.map((r) => `(${shiftTex(r)})`).join('');
    const a = pickA(rng, 1, false);
    const g = vertical ? (rng.chance(0.5) ? `y = ${a.tex()}f(x)` : 'y = -f(x)') : rng.chance(0.5) ? `y = f(${pickB(rng, 1, false).tex()}x)` : 'y = f(-x)';
    const count = vertical ? roots.length : 1;
    return {
      cognitive: 'problemSolving',
      stem: `${m(`f(x) = ${fx}`)}. How many invariant points are there when $y = f(x)$ is transformed to ${m(g)}?`,
      format: 'input',
      fields: [field({ kind: 'number', value: count, tex: String(count), exact: true }, '', 'Number of invariant points')],
      hints: [
        'Decide whether the transformation is vertical or horizontal.',
        vertical ? 'Vertical: the invariant points are the $x$-intercepts.' : 'Horizontal: the only invariant point is the $y$-intercept.',
        vertical ? `The zeros are ${roots.join(', ')}.` : 'Every function has exactly one $y$-intercept (if $0$ is in the domain).',
      ],
      solution: [
        { tex: vertical ? 'The transformation acts on $y$-values, so points with $y = 0$ stay fixed.' : 'The transformation acts on $x$-values, so the point with $x = 0$ stays fixed.' },
        { tex: vertical ? `$f$ has ${roots.length} distinct zeros: ${m(roots.join(', '))}.` : `The $y$-intercept is $(0, f(0))$.`, why: vertical ? 'Each zero is an $x$-intercept.' : roots.includes(0) ? 'Here $f(0) = 0$, so the $y$-intercept is the origin, which is also a zero; still one point.' : undefined },
        { tex: `Number of invariant points: $${count}$.` },
      ],
    };
  },
};

export const basicsGenerators: Generator[] = [
  translatePoint,
  translateEquation,
  translateDR,
  vstretchPoint,
  vstretchDescribe,
  vstretchRange,
  hstretchPoint,
  hstretchEquation,
  hstretchDomain,
  reflectPoint,
  reflectEquation,
  reflectDescribe,
  invariantPoints,
  invariantWhich,
  invariantCount,
];
