import type { Lesson } from './types';

/** Unit 2 (polynomial functions) lessons. Explanations are ≤ 200 words; examples are generator items revealed step by step. */
export const U2_LESSONS: Lesson[] = [
  {
    nodeId: 'RF11.long-division',
    explain: [
      'Dividing $P(x)$ by $x - a$ works like long division of numbers: divide the leading terms, multiply, subtract, bring down, repeat until the remainder has lower degree than the divisor.',
      '**Write every power.** If a term is missing, insert it with coefficient $0$: $x^3 - 5x + 2$ becomes $x^3 + 0x^2 - 5x + 2$. Skipping this misaligns every column after it.',
      'The result is written as the **division statement** $P(x) = (x - a)Q(x) + R$. The quotient $Q(x)$ has degree one less than $P(x)$; the remainder $R$ is a constant when dividing by a linear factor.',
      'Restrictions: $x \\ne a$ if you write it as $\\frac{P(x)}{x - a} = Q(x) + \\frac{R}{x - a}$.',
      'Check a division by expanding $(x - a)Q(x) + R$; you should get $P(x)$ back.',
    ],
    examples: [
      { generatorId: 'u2-longdiv-quotient', seed: 2, tier: 2 },
      { generatorId: 'u2-longdiv-statement', seed: 5, tier: 2 },
    ],
  },
  {
    nodeId: 'RF11.synthetic',
    explore: {
      preset: { explorer: 'polynomial', zeros: [{ r: -2, m: 1 }, { r: 1, m: 1 }, { r: 3, m: 1 }], view: 'divide', a: 3 },
      predict: {
        question: 'Dividing $P(x) = x^3 - 2x^2 - 5x + 6$ by $x - 3$ with synthetic division, which number goes in the corner box?',
        options: ['$3$', '$-3$', '$6$', '$1$'],
        answer: 0,
        tryIt: 'Step through the division with $a = 3$, then slide to $a = -3$ and compare the remainder.',
      },
    },
    explain: [
      'Synthetic division is long division by $x - a$ with only the coefficients. Put $a$ in the corner: for $x - 3$ use $3$, for $x + 2$ use $-2$ (the zero of the divisor).',
      'Write the coefficients in descending order, with $0$ for any missing power. Then: bring down the first coefficient; multiply it by $a$ and write the product under the next coefficient; add; repeat.',
      'The bottom row gives the quotient coefficients, one degree lower than $P(x)$, and the last number is the remainder.',
      'Using $-3$ for $x - 3$ is the classic slip: it divides by $x + 3$ instead. Synthetic division only works for divisors $x - a$; for $2x - 1$ you would use long division in this course.',
    ],
    examples: [
      { generatorId: 'u2-synth-quotient', seed: 3, tier: 2 },
      { generatorId: 'u2-synth-coefficient', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF11.remainder-thm',
    explain: [
      '**Remainder theorem:** when $P(x)$ is divided by $x - a$, the remainder is $P(a)$.',
      'Why: $P(x) = (x - a)Q(x) + R$. Substitute $x = a$: the first term becomes $0$, so $P(a) = R$.',
      'This turns a division into a substitution. Dividing by $x + 2$? Evaluate $P(-2)$.',
      'It also finds unknown coefficients. If $x^3 + kx - 4$ leaves remainder $6$ when divided by $x - 2$, then $P(2) = 8 + 2k - 4 = 6$, so $k = 1$. With two unknowns, two remainder conditions give two equations to solve together.',
      'Watch the sign: the divisor $x - a$ means substitute $a$; $x + a$ means substitute $-a$.',
    ],
    examples: [
      { generatorId: 'u2-rem-value', seed: 4, tier: 2 },
      { generatorId: 'u2-rem-unknown', seed: 2, tier: 2 },
    ],
  },
  {
    nodeId: 'RF11.factor-thm',
    explain: [
      '**Factor theorem:** $x - a$ is a factor of $P(x)$ exactly when $P(a) = 0$.',
      'It is the remainder theorem with remainder $0$: no remainder means the division is exact, so $x - a$ divides $P(x)$.',
      'Factors, zeros and $x$-intercepts are the same information: $x - a$ is a factor $\\iff$ $a$ is a zero $\\iff$ the graph crosses or touches the $x$-axis at $a$.',
      'To test $x + 3$, evaluate $P(-3)$. To make $x - 2$ a factor of a polynomial with an unknown $k$, solve $P(2) = 0$ for $k$.',
    ],
    examples: [
      { generatorId: 'u2-factor-k', seed: 1, tier: 2 },
      { generatorId: 'u2-factor-yesno', seed: 3, tier: 2 },
    ],
  },
  {
    nodeId: 'RF11.integral-zero',
    explain: [
      '**Integral zero theorem:** if a polynomial with integer coefficients has an integer zero $a$, then $a$ divides the constant term.',
      'So the candidates are $\\pm$ the factors of the constant term. For $x^3 - 2x^2 - 5x + 6$: $\\pm 1, \\pm 2, \\pm 3, \\pm 6$.',
      'Test candidates with the factor theorem, smallest first. Once one works, divide it out and factor the quotient.',
      'Remember both signs, and include $\\pm 1$ and $\\pm$ the constant itself.',
      'A zero that is a fraction, like $-\\frac{1}{2}$ from a factor $2x + 1$, shows up only after an integer zero has been divided out and the quotient is factored. Searching for fractional zeros directly (the rational zero theorem) is beyond this course.',
    ],
    examples: [
      { generatorId: 'u2-izt-find', seed: 2, tier: 2 },
      { generatorId: 'u2-izt-candidates', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF11.factor-full',
    explain: [
      'To factor a cubic or quartic completely:',
      '1. Find a zero $a$ with the integral zero theorem and the factor theorem.',
      '2. Divide by $x - a$ (synthetic division) to get a quotient one degree lower.',
      '3. Repeat until the quotient is a quadratic, then factor it by the usual methods. Check for a common factor at the very start.',
      '"Completely" means no factor can be factored further over the integers: $(x - 1)(x^2 - 4)$ is not complete; $(x - 1)(x - 2)(x + 2)$ is. A repeated zero shows up as a repeated factor, written with an exponent.',
      'Check by substituting one zero, or by expanding.',
    ],
    examples: [
      { generatorId: 'u2-factor-full', seed: 3, tier: 2 },
      { generatorId: 'u2-factor-given', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF12.characteristics',
    explore: {
      preset: { explorer: 'polynomial', zeros: [{ r: -1, m: 1 }, { r: 2, m: 1 }], lead: 1 },
      predict: {
        question: 'A polynomial has degree $3$ and a negative leading coefficient. How does its graph extend?',
        options: ['From quadrant II to quadrant IV', 'From quadrant III to quadrant I', 'From quadrant II to quadrant I', 'From quadrant III to quadrant IV'],
        answer: 0,
        tryIt: 'Add a zero to make degree $3$, then set the leading coefficient to $-1$.',
      },
    },
    explain: [
      'The **degree** (highest power) and the sign of the **leading coefficient** decide the end behaviour.',
      'Odd degree: the ends go opposite ways. Positive leading coefficient: quadrant III to quadrant I. Negative: quadrant II to quadrant IV.',
      'Even degree: both ends go the same way. Positive: quadrant II to quadrant I (both up). Negative: quadrant III to quadrant IV (both down).',
      'The **$y$-intercept** is the constant term, $P(0)$. In factored form, substitute $x = 0$: multiply the number in front by each factor's value at $0$, with exponents.',
      'A degree-$n$ polynomial has at most $n$ $x$-intercepts and at most $n - 1$ turning points. An odd-degree polynomial always has at least one $x$-intercept; an even-degree one may have none.',
    ],
    examples: [
      { generatorId: 'u2-char-end', seed: 2, tier: 2 },
      { generatorId: 'u2-char-yint', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'RF12.zeros-multiplicity',
    explore: {
      preset: { explorer: 'polynomial', zeros: [{ r: -2, m: 1 }, { r: 1, m: 1 }], lead: 1 },
      predict: {
        question: 'What does the graph do at $x = 1$ if the factor is $(x - 1)^2$ instead of $(x - 1)$?',
        options: ['It touches the $x$-axis and turns back', 'It crosses straight through', 'It crosses and flattens', 'It no longer meets the $x$-axis'],
        answer: 0,
        tryIt: 'Set the multiplicity of the zero at $x = 1$ to $2$, then to $3$.',
      },
    },
    explain: [
      'A factor $(x - a)^m$ gives a zero at $x = a$ of **multiplicity** $m$. The zero, root and $x$-intercept all equal $a$; note the sign flip from the factor.',
      'Multiplicity $1$: the graph crosses the $x$-axis, roughly like a line.',
      'Multiplicity $2$: it touches the axis and turns back, like a parabola at its vertex. The sign of $P(x)$ does not change there.',
      'Multiplicity $3$: it crosses but flattens out, like $y = x^3$ at the origin.',
      'Odd multiplicity: the sign changes. Even: it does not.',
      'The degree is the sum of the multiplicities. The **least possible degree** from a graph counts $1$ for each crossing, $2$ for each bounce and $3$ for each flattened crossing.',
    ],
    examples: [
      { generatorId: 'u2-mult-zeros', seed: 2, tier: 2 },
      { generatorId: 'u2-mult-least-degree', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF12.sketch',
    explore: {
      preset: { explorer: 'polynomial', zeros: [{ r: -3, m: 1 }, { r: 0, m: 2 }, { r: 2, m: 1 }], lead: -1 },
      predict: {
        question: 'For $P(x) = -x^2(x + 3)(x - 2)$, what is the sign of $P(x)$ for $x$ just right of $2$?',
        options: ['Negative', 'Positive', 'Zero', 'It depends on the scale'],
        answer: 0,
        tryIt: 'Read the graph just right of $x = 2$. Then change the leading coefficient to $1$.',
      },
    },
    explain: [
      'To sketch from factored form:',
      '1. **Zeros** and their multiplicities: mark each $x$-intercept and how the graph behaves there.',
      '2. **$y$-intercept**: $P(0)$.',
      '3. **End behaviour** from the degree (sum of multiplicities) and the sign of the leading coefficient.',
      '4. Start at the left end, travel right, and obey each zero: cross, bounce, or flatten.',
      'For a sign chart, start from the right end: positive leading coefficient means $P(x) > 0$ far right. Moving left, the sign changes at odd-multiplicity zeros only.',
      'A sketch needs correct intercepts, behaviour and ends, not exact turning points; those need technology.',
    ],
    examples: [
      { generatorId: 'u2-sketch-sign', seed: 2, tier: 2 },
      { generatorId: 'u2-sketch-describe', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF12.equation-from-graph',
    explore: {
      preset: { explorer: 'polynomial', zeros: [{ r: -1, m: 2 }, { r: 3, m: 1 }], lead: 1 },
      predict: {
        question: 'A graph bounces at $x = -1$, crosses at $x = 3$, and has $y$-intercept $-6$. What is the leading coefficient of $y = a(x + 1)^2(x - 3)$?',
        options: ['$2$', '$-2$', '$1$', '$-6$'],
        answer: 0,
        tryIt: 'Build the zeros, then read the $y$-intercept for leading coefficients $1$ and $2$.',
      },
    },
    explain: [
      'Read the graph in this order:',
      '1. Each $x$-intercept $a$ gives a factor $(x - a)$.',
      '2. Its behaviour gives the exponent: cross $1$, bounce $2$, flattened crossing $3$.',
      '3. Write $y = a(x - r_1)^{m_1}(x - r_2)^{m_2}\\cdots$ and find $a$ by substituting a known point, usually the $y$-intercept.',
      'Check the result: does the sign of $a$ match the end behaviour? An even-degree graph opening down needs $a < 0$.',
      'If the $y$-intercept is $-6$ and the factors at $x = 0$ give $(1)^2(-3) = -3$, then $a(-3) = -6$, so $a = 2$.',
    ],
    examples: [
      { generatorId: 'u2-eqgraph-a', seed: 2, tier: 2 },
      { generatorId: 'u2-eqgraph-input', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF12.analyze-calc',
    explain: [
      'When a polynomial does not factor nicely, use the graphing calculator.',
      '**Window:** make sure every turning point and intercept is visible; zoom out first if unsure.',
      '**Zeros:** use the zero (root) feature for each $x$-intercept and round only the final answer.',
      '**Maximum or minimum:** use the max/min feature. On the diploma, "maximum value" means the absolute maximum, the $y$-value of the highest point; it exists only when the graph has even degree and opens down.',
      '**Range:** even degree with $a > 0$: $[\\text{minimum}, \\infty)$. Even degree with $a < 0$: $(-\\infty, \\text{maximum}]$. Odd degree: all real numbers.',
      'Domain is always all real numbers.',
    ],
    examples: [
      { generatorId: 'u2-calc-range', seed: 2, tier: 2 },
      { generatorId: 'u2-calc-extreme', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF12.model',
    explain: [
      'A polynomial model turns a description into a function, then the calculator finds the answer.',
      '**Open-top box** from a $w \\times l$ sheet with squares of side $x$ cut from the corners: $V(x) = x(w - 2x)(l - 2x)$. The domain is $0 < x < \\frac{w}{2}$ for the shorter side $w$; outside it a length is negative.',
      '**Consecutive integers:** call them $n$, $n + 1$, $n + 2$, then expand the product condition and solve.',
      'Answer with the restriction in mind: a maximum volume comes from the maximum in the valid domain, not a turning point outside it. Include units.',
    ],
    examples: [
      { generatorId: 'u2-model-box-expr', seed: 2, tier: 2 },
      { generatorId: 'u2-model-box-max', seed: 1, tier: 2 },
    ],
  },
];
