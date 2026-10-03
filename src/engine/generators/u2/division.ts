// RF11: long and synthetic division, remainder and factor theorems, integral zero theorem, factoring.
import { field, m, mc } from '../../framework';
import { F, polyEval, polyTex, shiftTex } from '../../frac';
import type { Draft, Generator } from '../../types';
import { Reject } from '../../types';
import { addP, factoredAns, factoredTex, mulP, num, setAns, solutionText } from '../pre/shared';
import { coeffRow, distinctZeros, divisors, fromZeros, linFactors, polyAns, quotientField, synth, type Poly } from './shared';

/** Random polynomial of a degree with integer coefficients; optionally a missing middle term. */
function randPoly(rng: { int: (a: number, b: number) => number; chance: (p: number) => boolean }, deg: number, missing: boolean, lead = 1): Poly {
  const p: Poly = [lead];
  for (let i = 1; i <= deg; i++) p.push(rng.int(-6, 6));
  if (missing) p[rng.int(1, deg - 1)] = 0;
  else for (let i = 1; i < deg; i++) if (p[i] === 0) p[i] = rng.chance(0.5) ? 1 : -1;
  return p;
}

const divStatement = (p: Poly, div: string, q: Poly, r: number) => `${polyTex(p)} = \\left(${div}\\right)\\left(${polyTex(q)}\\right)${r ? (r > 0 ? ` + ${r}` : ` - ${-r}`) : ''}`;

/** Drop zero placeholders (the classic error) and redo the division. */
const dropZeros = (p: Poly) => p.filter((c, i) => c !== 0 || i === p.length - 1);

// ---------------------------------------------------------------- RF11.long-division

const longDivQuotient: Generator = {
  id: 'u2-longdiv-quotient',
  nodeId: 'RF11.long-division',
  title: 'Divide a polynomial by a binomial',
  make(rng, tier): Draft {
    // Tier 3 divides by (2x − b) with an integer quotient: build P = (2x − b)Q + R.
    if (tier === 3) {
      const b = rng.pick([1, 3, -1, -3]);
      const q = randPoly(rng, 2, false);
      const R = rng.int(-6, 6);
      const p = addP(mulP([2, -b], q), [R]);
      const div = polyTex([2, -b]);
      return {
        cognitive: 'procedural',
        stem: `Divide ${m(polyTex(p))} by ${m(div)}. Give the quotient and the remainder.`,
        format: 'input',
        fields: [quotientField(q), field(num(R), 'R =')],
        hints: ['Long division works for any binomial divisor; synthetic division needs $(x - a)$.', `Divide the leading term: ${m(`${p[0]}x^3 \\div 2x = ${q[0] === 1 ? '' : q[0] === -1 ? '-' : q[0]}x^2`)}, multiply back, subtract, repeat.`, `Check with ${m(`(${div})Q(x) + R`)}: it must expand to the original.`],
        solution: [
          { tex: `${m(`${p[0]}x^3 \\div 2x = ${polyTex([q[0], 0, 0])}`)}; multiply ${m(`${polyTex([q[0], 0, 0])}(${div})`)} and subtract.`, why: 'Each step removes the current leading term.' },
          { tex: `Continue with the remainder of each subtraction to get ${m(`Q(x) = ${polyTex(q)}`)} and ${m(`R = ${R}`)}.` },
          { tex: m(divStatement(p, div, q, R)), why: `The division statement holds for all $x$; the restriction $x \\ne ${F(b, 2).tex()}$ applies only to the fraction form.` },
        ],
        verify: () => [0, 1, 2, -1].every((x) => Math.abs(polyEval(p)(x) - ((2 * x - b) * polyEval(q)(x) + R)) < 1e-9),
      };
    }
    const a = rng.nz(-4, 4);
    const p = randPoly(rng, 3, tier === 2);
    const { q, r } = synth(p, a);
    const div = shiftTex(a);
    return {
      cognitive: 'procedural',
      stem: `Use long division to divide ${m(polyTex(p))} by ${m(div)}. Give the quotient ${m('Q(x)')} and the remainder ${m('R')}.`,
      format: 'input',
      fields: [quotientField(q), field(num(r), 'R =')],
      hints: [tier === 2 ? 'A power of $x$ is missing. Write it with coefficient $0$ before dividing.' : 'Divide leading term by leading term, multiply back, subtract, bring down.', `First term of the quotient: ${m(`x^3 \\div x = x^2`)}.`, `The quotient has degree 2; the remainder is a constant.`],
      solution: [
        { tex: `Coefficients with every power present: ${m(coeffRow(p))}.`, why: 'A $0$ placeholder for any missing power keeps the columns aligned.' },
        { tex: `Divide, multiply, subtract, bring down, three times: ${m(`Q(x) = ${polyTex(q)}`)}, ${m(`R = ${r}`)}.` },
        { tex: m(divStatement(p, div, q, r)), why: `Check: expanding the right side must give the dividend. The fraction form needs $x \\ne ${a}$.` },
      ],
      verify: () => [0, 1, 2, -3].every((x) => Math.abs(polyEval(p)(x) - ((x - a) * polyEval(q)(x) + r)) < 1e-9),
    };
  },
};

const longDivStatement: Generator = {
  id: 'u2-longdiv-statement',
  nodeId: 'RF11.long-division',
  title: 'Division statement',
  make(rng, tier): Draft {
    const a = rng.nz(-4, 4);
    const p = randPoly(rng, tier === 1 ? 3 : 4, tier >= 2);
    const { q, r } = synth(p, a);
    if (r === 0) throw new Reject();
    const div = shiftTex(a);
    const wrongZero = synth(dropZeros(p), a);
    const flip = synth(p, -a);
    const correct = `${m(`\\frac{${polyTex(p)}}{${div}} = ${polyTex(q)} ${r > 0 ? '+' : '-'} \\frac{${Math.abs(r)}}{${div}}`)}, ${m(`x \\ne ${a}`)}`;
    const opt = (qq: Poly, rr: number, restr: number) => `${m(`\\frac{${polyTex(p)}}{${div}} = ${polyTex(qq)} ${rr >= 0 ? '+' : '-'} \\frac{${Math.abs(rr)}}{${div}}`)}, ${m(`x \\ne ${restr}`)}`;
    return {
      cognitive: 'conceptual',
      stem: `Which is the correct division statement for ${m(`\\left(${polyTex(p)}\\right) \\div \\left(${div}\\right)`)}?`,
      format: 'mc',
      choices: mc({ tex: correct, key: 'ok' }, [
        { tex: opt(q, r, -a), key: 'restr', mis: 'poly-zero-sign', feedback: `The restriction comes from $${div} \\ne 0$, so $x \\ne ${a}$.` },
        ...(p.includes(0) && wrongZero.q.length === q.length - 1 ? [{ tex: opt(wrongZero.q, wrongZero.r, a), key: 'zero', mis: 'poly-missing-term', feedback: 'A missing power needs a $0$ placeholder; without it every column shifts.' }] : []),
        { tex: opt(flip.q, flip.r, a), key: 'flip', mis: 'poly-synthetic-sign', feedback: `Dividing by $${div}$ uses $${a}$, not $${-a}$.` },
        { tex: `${m(`\\frac{${polyTex(p)}}{${div}} = ${polyTex(q)} ${r >= 0 ? '+' : '-'} ${Math.abs(r)}`)}, ${m(`x \\ne ${a}`)}`, key: 'rem', mis: 'poly-division-remainder', feedback: 'The remainder is still divided by the divisor in the fraction form.' },
      ]),
      hints: ['Do the division (synthetic works here), then write dividend ÷ divisor = quotient + remainder ÷ divisor.', `Divide by $${div}$ using $${a}$ in synthetic division.`, `The quotient is ${m(polyTex(q))}.`],
      solution: [
        { tex: `Synthetic division with ${m(String(a))} on ${m(coeffRow(p))} gives quotient ${m(polyTex(q))}, remainder ${m(String(r))}.` },
        { tex: correct, why: 'The remainder over the divisor completes the fraction form; the divisor cannot be zero.' },
      ],
      verify: () => Math.abs(polyEval(p)(7) / (7 - a) - (polyEval(q)(7) + r / (7 - a))) < 1e-9,
    };
  },
};

const longDivCheck: Generator = {
  id: 'u2-longdiv-reconstruct',
  nodeId: 'RF11.long-division',
  title: 'Rebuild the dividend',
  make(rng, tier): Draft {
    const a = rng.nz(-5, 5);
    const q = randPoly(rng, tier === 1 ? 1 : 2, false, tier === 3 ? rng.pick([2, -1, 3]) : 1);
    const r = rng.int(-7, 7);
    const p = addP(mulP([1, -a], q), [r]);
    return {
      cognitive: 'conceptual',
      stem: `A polynomial ${m('P(x)')} divided by ${m(shiftTex(a))} gives quotient ${m(polyTex(q))} and remainder ${m(String(r))}. What is ${m('P(x)')}?`,
      format: 'input',
      fields: [field(polyAns(p), 'P(x) =')],
      hints: ['Dividend = divisor × quotient + remainder.', `Expand ${m(`\\left(${shiftTex(a)}\\right)\\left(${polyTex(q)}\\right)`)} first.`, `Then add ${m(String(r))}.`],
      solution: [
        { tex: m(`P(x) = \\left(${shiftTex(a)}\\right)\\left(${polyTex(q)}\\right) ${r >= 0 ? '+' : '-'} ${Math.abs(r)}`), why: 'This is the division statement, read backwards.' },
        { tex: m(`= ${polyTex(mulP([1, -a], q))} ${r >= 0 ? '+' : '-'} ${Math.abs(r)} = ${polyTex(p)}`) },
      ],
      verify: () => synth(p, a).r === r,
    };
  },
};

// ---------------------------------------------------------------- RF11.synthetic

const synthQuotient: Generator = {
  id: 'u2-synth-quotient',
  nodeId: 'RF11.synthetic',
  title: 'Synthetic division',
  make(rng, tier): Draft {
    const a = rng.nz(-4, 4);
    const deg = tier === 3 ? 4 : 3;
    const p = randPoly(rng, deg, tier >= 2, tier === 3 ? rng.pick([1, 2, -1]) : 1);
    const { q, r, mid, bottom } = synth(p, a);
    return {
      cognitive: 'procedural',
      stem: `Use synthetic division to divide ${m(polyTex(p))} by ${m(shiftTex(a))}.`,
      format: 'input',
      fields: [quotientField(q), field(num(r), 'R =')],
      hints: [`The divisor is ${m(shiftTex(a))}, so the number in the box is ${m(String(a))}.`, `Coefficients, with zeros for missing powers: ${m(coeffRow(p))}.`, 'Bring down, multiply by the box number, add; repeat. The last entry is the remainder.'],
      solution: [
        { tex: `Box ${m(String(a))}; top row ${m(coeffRow(p))}.`, why: `$x - a = 0$ gives $x = a$, the value we are effectively substituting.` },
        { tex: `Middle row ${m(mid.slice(1).join(',\\ '))}; bottom row ${m(bottom.join(',\\ '))}.` },
        { tex: `${m(`Q(x) = ${polyTex(q)}`)}, ${m(`R = ${r}`)}.`, why: 'The bottom row, except the last entry, is the quotient, one degree lower.' },
      ],
      verify: () => Math.abs(polyEval(p)(a) - r) < 1e-9,
    };
  },
};

const synthSetup: Generator = {
  id: 'u2-synth-setup',
  nodeId: 'RF11.synthetic',
  title: 'Set up synthetic division',
  make(rng, tier): Draft {
    const a = rng.nz(-5, 5);
    const p = randPoly(rng, tier === 1 ? 3 : 4, true);
    const row = (c: Poly) => m(coeffRow(c));
    const div = shiftTex(a);
    return {
      cognitive: 'conceptual',
      stem: `To divide ${m(polyTex(p))} by ${m(div)} with synthetic division, which box number and top row do you use?`,
      format: 'mc',
      choices: mc({ tex: `${m(String(a))} and ${row(p)}`, key: 'ok' }, [
        { tex: `${m(String(-a))} and ${row(p)}`, key: 's', mis: 'poly-synthetic-sign', feedback: `$${div} = 0$ when $x = ${a}$.` },
        { tex: `${m(String(a))} and ${row(dropZeros(p))}`, key: 'z', mis: 'poly-missing-term', feedback: 'Every power from the highest down to $x^0$ needs a coefficient, including $0$.' },
        { tex: `${m(String(-a))} and ${row(dropZeros(p))}`, key: 'sz', mis: 'poly-synthetic-sign' },
      ]),
      hints: ['Two things to get right: the sign of the box number and the zero placeholders.', `Solve ${m(`${div} = 0`)} for the box number.`, `List coefficients of ${m('x^' + (p.length - 1))} down to the constant.`],
      solution: [
        { tex: `${m(`${div} = 0 \\Rightarrow x = ${a}`)}, so the box holds ${m(String(a))}.` },
        { tex: `Top row ${row(p)}: a ${m('0')} stands in for each missing power.` },
      ],
    };
  },
};

const synthCoefficient: Generator = {
  id: 'u2-synth-coefficient',
  nodeId: 'RF11.synthetic',
  title: 'Read a quotient coefficient',
  make(rng, tier): Draft {
    const a = rng.nz(-4, 4);
    const deg = tier === 1 ? 3 : 4;
    const p = randPoly(rng, deg, tier === 3);
    const { q } = synth(p, a);
    const k = rng.int(0, q.length - 2);
    const power = q.length - 1 - k;
    const want = q[k];
    const wrong = synth(p, -a).q[k];
    return {
      cognitive: 'procedural',
      stem: `When ${m(polyTex(p))} is divided by ${m(shiftTex(a))}, what is the coefficient of ${m(power === 1 ? 'x' : `x^{${power}}`)} in the quotient?`,
      format: tier === 1 ? 'mc' : 'input',
      ...(tier === 1
        ? {
            choices: mc({ tex: m(String(want)), key: want }, [
              { tex: m(String(wrong)), key: wrong, mis: 'poly-synthetic-sign' },
              { tex: m(String(p[k + 1])), key: p[k + 1], mis: 'poly-division-remainder', feedback: 'That is a coefficient of the dividend, not the quotient.' },
              { tex: m(String(q[k + 1] ?? want + 1)), key: q[k + 1] ?? want + 1, mis: 'poly-degree-count', feedback: 'The quotient is one degree lower than the dividend; count positions carefully.' },
              { tex: m(String(-want)), key: -want, mis: 'poly-synthetic-sign' },
            ]),
          }
        : { fields: [field(num(want), `\\text{coefficient} =`)] }),
      hints: [`Synthetic division with ${m(String(a))}.`, `Top row ${m(coeffRow(p))}.`, `The quotient starts at ${m(`x^{${deg - 1}}`)}.`],
      solution: [
        { tex: `Bottom row: ${m(synth(p, a).bottom.join(',\\ '))}.` },
        { tex: `Quotient ${m(polyTex(q))}; the ${m(power === 1 ? 'x' : `x^{${power}}`)} coefficient is ${m(String(want))}.`, why: 'The first bottom entry is the coefficient of the power one below the dividend’s degree.' },
      ],
    };
  },
};

// ---------------------------------------------------------------- RF11.remainder-thm

const remValue: Generator = {
  id: 'u2-rem-value',
  nodeId: 'RF11.remainder-thm',
  title: 'Remainder without dividing',
  make(rng, tier): Draft {
    const deg = tier === 1 ? 3 : 4;
    const p = randPoly(rng, deg, tier >= 2, tier === 3 ? 2 : 1);
    const a = rng.nz(-3, 3);
    const R = polyEval(p)(a);
    const Rneg = polyEval(p)(-a);
    const div = shiftTex(a);
    const stem = `What is the remainder when ${m(polyTex(p))} is divided by ${m(div)}?`;
    const hints: [string, string, string] = ['You do not need to divide.', `Remainder theorem: dividing ${m('P(x)')} by ${m('x - a')} leaves ${m('P(a)')}.`, `Evaluate ${m(`P(${a})`)}.`];
    const solution = [
      { tex: `${m(`${div} = 0 \\Rightarrow x = ${a}`)}, so the remainder is ${m(`P(${a})`)}.`, why: 'From $P(x) = (x - a)Q(x) + R$: substituting $x = a$ kills the first term.' },
      { tex: m(`P(${a}) = ${R}`) },
    ];
    if (tier === 1)
      return {
        cognitive: 'procedural',
        stem,
        format: 'mc',
        choices: mc({ tex: m(String(R)), key: R }, [
          { tex: m(String(Rneg)), key: Rneg, mis: 'poly-remainder-sign', feedback: `For $${div}$ substitute $x = ${a}$, not $${-a}$.` },
          { tex: m(String(p[p.length - 1])), key: p[p.length - 1], mis: 'poly-remainder-constant' },
          { tex: m(String(p.reduce((s, c) => s + c, 0))), key: p.reduce((s, c) => s + c, 0), mis: 'poly-remainder-constant', feedback: 'The sum of the coefficients is $P(1)$, the remainder for division by $x - 1$ only.' },
          { tex: m(String(-R)), key: -R, mis: 'poly-remainder-sign' },
        ]),
        hints,
        solution,
        verify: () => synth(p, a).r === R,
      };
    return { cognitive: 'procedural', stem, format: 'input', fields: [field(num(R), 'R =')], hints, solution, verify: () => synth(p, a).r === R };
  },
};

const remUnknown: Generator = {
  id: 'u2-rem-unknown',
  nodeId: 'RF11.remainder-thm',
  title: 'Find an unknown coefficient from a remainder',
  make(rng, tier): Draft {
    const a = rng.nz(-3, 3);
    const p = randPoly(rng, 3, false, tier === 3 ? 2 : 1);
    const slot = tier === 1 ? 3 : rng.int(1, 2); // which coefficient is k
    const k = p[slot];
    const R = polyEval(p)(a);
    const shown = p.map((c, i) => (i === slot ? NaN : c));
    const terms = shown
      .map((c, i) => {
        const pw = 3 - i;
        const mono = pw === 0 ? '' : pw === 1 ? 'x' : `x^{${pw}}`;
        if (Number.isNaN(c)) return `+ k${mono}`;
        if (c === 0) return '';
        const mag = Math.abs(c) === 1 && pw ? '' : Math.abs(c);
        return `${c < 0 ? '-' : '+'} ${mag}${mono}`;
      })
      .join(' ')
      .replace(/^\+ /, '');
    const pw = 3 - slot;
    const factor = a ** pw;
    const rest = R - k * factor;
    return {
      cognitive: 'problemSolving',
      stem: `When ${m(`P(x) = ${terms}`)} is divided by ${m(shiftTex(a))}, the remainder is ${m(String(R))}. What is the value of ${m('k')}?`,
      format: 'input',
      fields: [field(num(k), 'k =')],
      hints: ['The remainder theorem turns this into an equation in $k$.', `${m(`P(${a}) = ${R}`)}.`, `Substitute ${m(`x = ${a}`)} and collect the terms without ${m('k')}.`],
      solution: [
        { tex: `${m(`P(${a}) = ${R}`)} by the remainder theorem.` },
        { tex: m(`${factor === 1 ? '' : factor === -1 ? '-' : factor}k ${rest >= 0 ? '+' : '-'} ${Math.abs(rest)} = ${R}`), why: 'Every known term becomes a number once $x$ is replaced.' },
        { tex: m(`k = ${k}`) },
      ],
      verify: () => Math.abs(polyEval(p)(a) - R) < 1e-9 && factor !== 0,
    };
  },
};

const remTwo: Generator = {
  id: 'u2-rem-two',
  nodeId: 'RF11.remainder-thm',
  title: 'Two unknowns from two remainders',
  make(rng, tier): Draft {
    const mm = rng.nz(-5, 5);
    const n = rng.nz(-6, 6);
    const lead = tier === 3 ? 2 : 1;
    const c1 = rng.int(-4, 4);
    // P(x) = lead x^3 + m x^2 + c1 x + n
    const p: Poly = [lead, mm, c1, n];
    // a² ≠ b², otherwise the two equations do not separate m and n.
    const [a, b] = tier === 1 ? rng.pick([[1, 2], [-1, 2], [1, -2]]) : rng.sample([-3, -2, -1, 1, 2, 3], 2);
    if (a * a === b * b) throw new Reject();
    const Ra = polyEval(p)(a);
    const Rb = polyEval(p)(b);
    const eq = (x: number, R: number) => `${x * x === 1 ? '' : x * x}m + n = ${R - lead * x ** 3 - c1 * x}`;
    return {
      cognitive: 'problemSolving',
      stem: `${m(`P(x) = ${lead === 1 ? '' : lead}x^3 + mx^2 ${c1 ? (c1 > 0 ? `+ ${c1 === 1 ? '' : c1}x` : `- ${c1 === -1 ? '' : -c1}x`) : ''} + n`)} leaves a remainder of ${m(String(Ra))} when divided by ${m(shiftTex(a))} and ${m(String(Rb))} when divided by ${m(shiftTex(b))}. Find ${m('m')} and ${m('n')}.`,
      format: 'input',
      fields: [field(num(mm), 'm ='), field(num(n), 'n =')],
      hints: ['Each remainder gives one equation.', `${m(`P(${a}) = ${Ra}`)} and ${m(`P(${b}) = ${Rb}`)}.`, 'Subtract the two equations to eliminate $n$.'],
      solution: [
        { tex: `${m(`P(${a}) = ${Ra}`)}: ${m(eq(a, Ra))}.` },
        { tex: `${m(`P(${b}) = ${Rb}`)}: ${m(eq(b, Rb))}.` },
        { tex: `Subtracting: ${m(`${a * a - b * b}m = ${Ra - lead * a ** 3 - c1 * a - (Rb - lead * b ** 3 - c1 * b)}`)}, so ${m(`m = ${mm}`)} and ${m(`n = ${n}`)}.` },
      ],
      verify: () => polyEval(p)(a) === Ra && polyEval(p)(b) === Rb && a * a !== b * b,
    };
  },
};

// ---------------------------------------------------------------- RF11.factor-thm

const factorWhich: Generator = {
  id: 'u2-factor-which',
  nodeId: 'RF11.factor-thm',
  title: 'Which binomial is a factor?',
  make(rng, tier): Draft {
    const zs = distinctZeros(rng, 3, tier === 1 ? -4 : -6, tier === 1 ? 4 : 6);
    if (zs.some((z) => zs.includes(-z))) throw new Reject();
    const p = fromZeros(1, zs.map((r) => ({ r, m: 1 })));
    const r = zs[0];
    return {
      cognitive: 'conceptual',
      stem: `Which binomial is a factor of ${m(polyTex(p))}?`,
      format: 'mc',
      choices: mc({ tex: m(shiftTex(r)), key: r }, [
        { tex: m(shiftTex(-r)), key: -r, mis: 'poly-zero-sign', feedback: `$P(${-r}) = ${polyEval(p)(-r)} \\ne 0$.` },
        { tex: m(shiftTex(-zs[1])), key: -zs[1], mis: 'poly-zero-sign', feedback: `$P(${-zs[1]}) = ${polyEval(p)(-zs[1])} \\ne 0$. The factor for zero $${zs[1]}$ is $(${shiftTex(zs[1])})$.` },
        { tex: m(shiftTex(-zs[2])), key: -zs[2], mis: 'poly-zero-sign' },
      ]),
      hints: ['Factor theorem: $(x - a)$ is a factor exactly when $P(a) = 0$.', 'Test each option by substituting the value that makes it zero.', `Try ${m(`P(${r})`)}.`],
      solution: [
        { tex: `${m(`P(${r}) = ${polyEval(p)(r)}`)}, so ${m(`(${shiftTex(r)})`)} is a factor.`, why: 'Remainder 0 means the division is exact.' },
        { tex: `The other options give non-zero values, e.g. ${m(`P(${-r}) = ${polyEval(p)(-r)}`)}.` },
      ],
      verify: () => polyEval(p)(r) === 0,
    };
  },
};

const factorK: Generator = {
  id: 'u2-factor-k',
  nodeId: 'RF11.factor-thm',
  title: 'Make (x − a) a factor',
  make(rng, tier): Draft {
    const a = rng.nz(-3, 3);
    const lead = tier === 3 ? rng.pick([2, 3]) : 1;
    const b = rng.int(-5, 5);
    const c = rng.int(-6, 6);
    // P(x) = lead x^3 + b x^2 + c x + k with P(a) = 0
    const k = -(lead * a ** 3 + b * a * a + c * a);
    const stemP = `${polyTex([lead, b, c, 0])} + k`;
    return {
      cognitive: 'problemSolving',
      stem: `For what value of ${m('k')} is ${m(shiftTex(a))} a factor of ${m(`P(x) = ${stemP}`)}?`,
      format: 'input',
      fields: [field(num(k), 'k =')],
      hints: ['A factor means remainder zero.', `Set ${m(`P(${a}) = 0`)}.`, `${m(`P(${a}) = ${lead * a ** 3 + b * a * a + c * a} + k`)}.`],
      solution: [
        { tex: `${m(`(${shiftTex(a)})`)} is a factor ${m('\\iff P(' + a + ') = 0')}.` },
        { tex: m(`${lead * a ** 3 + b * a * a + c * a} + k = 0 \\Rightarrow k = ${k}`) },
      ],
      verify: () => polyEval([lead, b, c, k])(a) === 0,
    };
  },
};

const factorYesNo: Generator = {
  id: 'u2-factor-yesno',
  nodeId: 'RF11.factor-thm',
  title: 'Is it a factor? Justify',
  make(rng, tier): Draft {
    const zs = distinctZeros(rng, 3, -5, 5);
    const p = fromZeros(tier === 3 ? 2 : 1, zs.map((r) => ({ r, m: 1 })));
    const yes = rng.chance(0.5);
    const a = yes ? zs[rng.int(0, 2)] : rng.pick([-6, -4, 4, 6, 7, -7].filter((v) => !zs.includes(v) && !zs.includes(-v)));
    if (a === undefined || zs.includes(-a)) throw new Reject();
    const Pa = polyEval(p)(a);
    const Pn = polyEval(p)(-a);
    const div = shiftTex(a);
    const right = yes ? `Yes, because ${m(`P(${a}) = 0`)}` : `No, because ${m(`P(${a}) = ${Pa}`)}`;
    return {
      cognitive: 'conceptual',
      stem: `Is ${m(div)} a factor of ${m(`P(x) = ${polyTex(p)}`)}?`,
      format: 'mc',
      choices: mc({ tex: right, key: 'ok' }, [
        yes ? { tex: `No, because ${m(`P(${-a}) = ${Pn}`)}`, key: 'n1', mis: 'poly-remainder-sign', feedback: `For $${div}$ test $x = ${a}$.` } : { tex: `Yes, because ${m(`${Math.abs(a)}`)} divides the constant term ${m(String(p[3]))}`, key: 'y1', mis: 'poly-izt-leading', feedback: 'Dividing the constant only makes $a$ a candidate; you still have to test it.' },
        { tex: yes ? `No, because ${m(`P(${a}) = ${Pa + 1 || 2}`)}` : `Yes, because ${m(`P(${-a}) = ${Pn}`)}`, key: 'n2', mis: 'poly-remainder-sign' },
        { tex: yes ? `Yes, because ${m(`P(${-a}) = 0`)}` : `No, because ${m(`P(${-a}) = ${Pn}`)}`, key: 'n3', mis: 'poly-remainder-sign', feedback: 'The test value is the zero of the binomial.' },
      ]),
      hints: ['Factor theorem.', `Evaluate ${m(`P(${a})`)}.`, `${m(`P(${a}) = ${Pa}`)}.`],
      solution: [
        { tex: m(`P(${a}) = ${Pa}`), why: '$(x - a)$ is a factor if and only if $P(a) = 0$.' },
        { tex: `${right}.` },
      ],
      verify: () => (Pa === 0) === yes,
    };
  },
};

// ---------------------------------------------------------------- RF11.integral-zero

const iztCandidates: Generator = {
  id: 'u2-izt-candidates',
  nodeId: 'RF11.integral-zero',
  title: 'Possible integral zeros',
  make(rng, tier): Draft {
    const c = rng.pick(tier === 1 ? [4, 6, -6, 8, -9, 10] : [12, -12, 18, -20, 15, -8]);
    const lead = tier === 3 ? rng.pick([2, 3]) : 1;
    const p: Poly = [lead, rng.int(-5, 5), rng.int(-9, 9), c];
    const ds = divisors(c);
    const pmList = (xs: number[]) => m(xs.map((d) => `\\pm ${d}`).join(', '));
    const leadDs = divisors(lead === 1 ? p[1] || 2 : lead * 2);
    return {
      cognitive: 'procedural',
      stem: `According to the integral zero theorem, which list contains all the possible integral zeros of ${m(polyTex(p))}?`,
      format: 'mc',
      choices: mc({ tex: pmList(ds), key: ds.join() }, [
        { tex: m(ds.join(', ')), key: 'pos', mis: 'poly-izt-incomplete', feedback: 'Negative divisors are candidates too.' },
        { tex: pmList(leadDs), key: 'lead:' + leadDs.join(), mis: 'poly-izt-leading', feedback: 'Candidates are the divisors of the constant term.' },
        { tex: pmList(ds.filter((d) => d !== 1 && d !== Math.abs(c))), key: 'mid', mis: 'poly-izt-incomplete', feedback: '$\\pm 1$ and $\\pm$ the constant itself always divide the constant.' },
        { tex: pmList(ds.filter((d) => d > 1)), key: 'no1', mis: 'poly-izt-incomplete' },
      ]),
      hints: ['Integral zeros divide the constant term.', `The constant term is ${m(String(c))}.`, `List every divisor of ${m(String(Math.abs(c)))} with both signs.`],
      solution: [
        { tex: `Any integral zero divides the constant term ${m(String(c))}.`, why: 'If $P(a) = 0$ with integer coefficients, $a$ divides the constant term.' },
        { tex: `Candidates: ${pmList(ds)}.${lead !== 1 ? ' (The leading coefficient does not change the integral candidates.)' : ''}` },
      ],
    };
  },
};

const iztFindZeros: Generator = {
  id: 'u2-izt-find',
  nodeId: 'RF11.integral-zero',
  title: 'Find the integral zeros',
  make(rng, tier): Draft {
    const zs = distinctZeros(rng, 3, tier === 1 ? -3 : -5, tier === 1 ? 3 : 5);
    if (zs.includes(0)) throw new Reject();
    const p = fromZeros(1, zs.map((r) => ({ r, m: 1 })));
    const first = [...zs].sort((a, b) => Math.abs(a) - Math.abs(b))[0];
    const { q } = synth(p, first);
    return {
      cognitive: 'problemSolving',
      stem: `Find all the zeros of ${m(`P(x) = ${polyTex(p)}`)}.`,
      format: 'input',
      fields: [field(setAns(zs), 'x =')],
      hints: [`Candidates are the divisors of ${m(String(p[3]))}.`, 'Test small candidates first until $P(a) = 0$, then divide.', `${m(`P(${first}) = 0`)}.`],
      solution: [
        { tex: `Test candidates: ${m(`P(${first}) = 0`)}, so ${m(`(${shiftTex(first)})`)} is a factor.` },
        { tex: `Divide: ${m(`P(x) = (${shiftTex(first)})(${polyTex(q)})`)}.` },
        { tex: `Factor the quadratic: ${m(factoredTex(1, sortFactors(linFactors(zs.map((r) => ({ r, m: 1 }))))))}, so ${solutionText(zs)}.` },
      ],
      verify: () => zs.every((z) => polyEval(p)(z) === 0),
    };
  },
};

const iztTest: Generator = {
  id: 'u2-izt-which-zero',
  nodeId: 'RF11.integral-zero',
  title: 'Which candidate is a zero?',
  make(rng, tier): Draft {
    const zs = distinctZeros(rng, tier === 3 ? 4 : 3, -4, 4);
    if (zs.includes(0)) throw new Reject();
    const k = zs.slice(1).map((z) => ({ r: z, m: 1 }));
    // One integer zero; the rest from a non-factorable quadratic for tiers 2–3.
    const quad: Poly = tier === 1 ? fromZeros(1, k) : [1, 0, rng.pick([1, 2, 3, 5])];
    const p = mulP([1, -zs[0]], quad);
    const c = p[p.length - 1];
    const cands = divisors(c).flatMap((d) => [d, -d]).filter((d) => polyEval(p)(d) !== 0);
    if (cands.length < 3) throw new Reject();
    const pick = rng.sample(cands, 3);
    return {
      cognitive: 'procedural',
      stem: `Which of these is a zero of ${m(`P(x) = ${polyTex(p)}`)}?`,
      format: 'mc',
      choices: mc(
        { tex: m(String(zs[0])), key: zs[0] },
        pick.map((d) => ({ tex: m(String(d)), key: d, mis: d === -zs[0] ? 'poly-zero-sign' : 'poly-izt-incomplete', feedback: `$P(${d}) = ${polyEval(p)(d)} \\ne 0$. Being a divisor of the constant only makes it a candidate.` })),
      ),
      hints: ['Every option divides the constant term, so each is a candidate.', 'Evaluate $P$ at each option.', 'A zero gives $P(a) = 0$.'],
      solution: [
        { tex: `${m(`P(${zs[0]}) = 0`)}.`, why: 'Factor theorem: a value that gives 0 is a zero.' },
        { tex: `The others give non-zero values, e.g. ${m(`P(${pick[0]}) = ${polyEval(p)(pick[0])}`)}.` },
      ],
      verify: () => polyEval(p)(zs[0]) === 0,
    };
  },
};

// ---------------------------------------------------------------- RF11.factor-full

/** Linear factors first, ordered by their zero; quadratics last. */
export const sortFactors = (fs: Poly[]) => [...fs].sort((a, b) => (a.length - b.length) || (-a[1] / a[0]) - (-b[1] / b[0]));

/** Factored polynomial with integer zeros, optionally one (2x ± 1) factor or an irreducible quadratic. */
function buildFactorable(rng: Parameters<Generator['make']>[0], tier: 1 | 2 | 3) {
  const zs = distinctZeros(rng, tier === 3 ? 3 : 3, -4, 4);
  const fs: Poly[] = zs.map((r) => [1, -r]);
  if (tier === 2) fs[2] = [2, rng.pick([1, -1, 3, -3])];
  if (tier === 3) {
    if (rng.chance(0.5)) fs.push([1, 0, rng.pick([1, 4, 9])]);
    else fs.push([1, -zs[0]]); // a repeated zero → degree 4
  }
  const p = mulP(...fs);
  if (Math.max(...p.map(Math.abs)) > 200) throw new Reject();
  return { fs: sortFactors(fs), p };
}

const factorFull: Generator = {
  id: 'u2-factor-full',
  nodeId: 'RF11.factor-full',
  title: 'Factor a polynomial completely',
  make(rng, tier): Draft {
    const { fs, p } = buildFactorable(rng, tier);
    const lin = fs.filter((f) => f.length === 2 && f[0] === 1);
    const first = lin.map((f) => -f[1]).sort((a, b) => Math.abs(a) - Math.abs(b))[0];
    const { q } = synth(p, first);
    return {
      cognitive: 'procedural',
      stem: `Factor completely: ${m(polyTex(p))}.`,
      format: 'input',
      fields: [field(factoredAns(1, fs), '')],
      hints: [`Try divisors of ${m(String(p[p.length - 1]))}.`, `${m(`P(${first}) = 0`)}, so divide by ${m(shiftTex(first))}.`, 'Keep factoring the quotient until every factor is linear or a quadratic that does not factor.'],
      solution: [
        { tex: `${m(`P(${first}) = 0`)}; synthetic division gives ${m(`(${shiftTex(first)})(${polyTex(q)})`)}.` },
        { tex: `Factor the quotient the same way (or as a trinomial).`, why: 'Each zero found lowers the degree by one.' },
        { tex: m(`${polyTex(p)} = ${factoredTex(1, fs)}`), why: fs.some((f) => f.length === 3) ? `$${polyTex(fs.find((f) => f.length === 3)!)}$ is a sum of squares: it does not factor over the real numbers.` : undefined },
      ],
      verify: () => [0, 1, -1, 2].every((x) => Math.abs(polyEval(p)(x) - fs.reduce((a, f) => a * polyEval(f)(x), 1)) < 1e-9),
    };
  },
};

const factorGiven: Generator = {
  id: 'u2-factor-given',
  nodeId: 'RF11.factor-full',
  title: 'Factor using a given factor',
  make(rng, tier): Draft {
    const { fs, p } = buildFactorable(rng, tier);
    const given = fs.find((f) => f.length === 2 && f[0] === 1)!;
    const { q } = synth(p, -given[1]);
    return {
      cognitive: 'procedural',
      stem: `${m(polyTex(given))} is a factor of ${m(`P(x) = ${polyTex(p)}`)}. Factor ${m('P(x)')} completely.`,
      format: 'input',
      fields: [field(factoredAns(1, fs), 'P(x) =')],
      hints: [`Divide by ${m(polyTex(given))} first.`, `Synthetic division with ${m(String(-given[1]))}.`, `Quotient: ${m(polyTex(q))}. Factor it.`],
      solution: [
        { tex: `Divide: ${m(`P(x) = (${polyTex(given)})(${polyTex(q)})`)}.` },
        { tex: `Factor ${m(polyTex(q))} fully.` },
        { tex: m(`P(x) = ${factoredTex(1, fs)}`) },
      ],
      verify: () => synth(p, -given[1]).r === 0,
    };
  },
};

const factorChoose: Generator = {
  id: 'u2-factor-choose',
  nodeId: 'RF11.factor-full',
  title: 'Choose the complete factorization',
  make(rng, tier): Draft {
    const zs = distinctZeros(rng, 3, -5, 5);
    if (zs.some((z) => zs.includes(-z))) throw new Reject();
    const k = tier === 3 ? rng.pick([2, -1, 3]) : 1;
    const fs: Poly[] = sortFactors(zs.map((r) => [1, -r]));
    const p = mulP([k], ...fs);
    const t = (ff: Poly[], kk = k) => m(factoredTex(kk, ff));
    const flipped = fs.map((f) => [1, -f[1]]);
    const partial: Poly[] = [fs[0], mulP(fs[1], fs[2])];
    return {
      cognitive: 'procedural',
      stem: `Which is the complete factorization of ${m(polyTex(p))}?`,
      format: 'mc',
      choices: mc({ tex: t(fs), key: 'ok' }, [
        { tex: t(flipped), key: 'flip', mis: 'poly-zero-sign', feedback: 'Zero $a$ gives factor $(x - a)$.' },
        { tex: t(partial), key: 'part', mis: 'fac-incomplete', feedback: 'The quadratic factor still factors.' },
        { tex: t([fs[0], fs[1], [1, -fs[2][1]]]), key: 'one', mis: 'poly-synthetic-sign' },
        { tex: t(fs, 1), key: 'k', mis: 'fac-gcf-lost' },
      ]),
      hints: ['Expand an option to check, or find the zeros.', 'Test divisors of the constant term.', `Zeros: ${m(zs.join(', '))}.`],
      solution: [
        { tex: `${solutionText(zs)} are zeros (each gives ${m('P = 0')}).` },
        { tex: `${t(fs)}.`, why: 'Each zero $a$ contributes a factor $(x - a)$; the leading coefficient stays in front.' },
      ],
      verify: () => [0, 1, -2].every((x) => Math.abs(polyEval(p)(x) - k * fs.reduce((a, f) => a * polyEval(f)(x), 1)) < 1e-9),
    };
  },
};

export const divisionGenerators: Generator[] = [longDivQuotient, longDivStatement, longDivCheck, synthQuotient, synthSetup, synthCoefficient, remValue, remUnknown, remTwo, factorWhich, factorK, factorYesNo, iztCandidates, iztFindZeros, iztTest, factorFull, factorGiven, factorChoose];
