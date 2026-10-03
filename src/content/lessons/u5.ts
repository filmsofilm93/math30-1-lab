import type { Lesson } from './types';

/** Unit 5 (radical and rational functions) lessons. Explanations are ≤ 200 words; examples are generator items revealed step by step. */
export const U5_LESSONS: Lesson[] = [
  {
    nodeId: 'RF13.sqrt-transform',
    explore: {
      preset: { explorer: 'radical', mode: 'transform' },
      predict: {
        question: 'Where is the endpoint of $y = -2\\sqrt{x - 3} + 1$?',
        options: ['$(3, 1)$', '$(-3, 1)$', '$(3, -1)$', '$(0, 0)$'],
        answer: 0,
        tryIt: 'Set $a = -2$, $h = 3$, $k = 1$ and read the endpoint.',
      },
    },
    explain: [
      'For $y = a\\sqrt{b(x - h)} + k$ the mapping is $(x, y) \\to \\left(\\frac{x}{b} + h,\\ ay + k\\right)$, the same as for any base function.',
      'The **endpoint** $(0, 0)$ maps to $(h, k)$. Track two more key points, $(1, 1)$ and $(4, 2)$, to fix the shape.',
      '$b < 0$ reflects in the $y$-axis, so the graph opens **left**: domain $x \\le h$. Otherwise $x \\ge h$.',
      '$a < 0$ reflects in the $x$-axis, so the graph goes **down** from the endpoint: range $y \\le k$. Otherwise $y \\ge k$.',
      'Factor $b$ out first: $y = \\sqrt{2x - 6} = \\sqrt{2(x - 3)}$, so $h = 3$, not $6$.',
      'Equation from a graph: read $(h, k)$ at the endpoint and the direction (sign of $b$). Then substitute one more point to find $a$ (with $b = \\pm 1$) or $b$ (with $a = \\pm 1$).',
      'A vertical stretch by $a$ and a horizontal stretch by $\\frac{1}{b}$ can give the same graph: $2\\sqrt{x} = \\sqrt{4x}$.',
    ],
    examples: [
      { generatorId: 'u5-sqrt-domain-range', seed: 2, tier: 2 },
      { generatorId: 'u5-sqrt-equation', seed: 4, tier: 3 },
    ],
  },
  {
    nodeId: 'RF13.sqrt-of-f',
    explore: {
      preset: { explorer: 'radical', mode: 'sqrt-of-f', f: 'linear' },
      predict: {
        question: 'Where does the graph of $y = \\sqrt{f(x)}$ meet the graph of $y = f(x)$?',
        options: ['Where $f(x) = 0$ or $f(x) = 1$', 'Only where $f(x) = 0$', 'Where $f(x) = x$', 'Nowhere'],
        answer: 0,
        tryIt: 'Move $m$ and $c$; watch the green points.',
      },
    },
    explain: [
      'Take the square root of each $y$-value of $f$: $(x, y) \\to (x, \\sqrt{y})$, defined only where $y \\ge 0$.',
      '**Domain** of $\\sqrt{f(x)}$: the $x$-values where $f(x) \\ge 0$. Solve $f(x) \\ge 0$ or read where the graph of $f$ is on or above the $x$-axis.',
      '**Range**: the square roots of the non-negative part of the range of $f$. If $f$ has range $y \\le 9$, then $\\sqrt{f}$ has range $0 \\le y \\le 3$.',
      '**Invariant points** occur where $f(x) = 0$ or $f(x) = 1$, because $\\sqrt{0} = 0$ and $\\sqrt{1} = 1$.',
      'Where $0 < f(x) < 1$, $\\sqrt{f(x)} > f(x)$: the root graph is above. Where $f(x) > 1$, it is below.',
      'Where $f$ crosses the $x$-axis, $\\sqrt{f}$ meets it with a vertical tangent. Where $f$ has a maximum or minimum, so does $\\sqrt{f}$, at the same $x$.',
      'If $f$ has a minimum of $0$ (a vertex on the axis), $\\sqrt{f}$ is V-shaped there: $\\sqrt{(x-2)^2} = |x - 2|$.',
    ],
    examples: [
      { generatorId: 'u5-sqrtf-domain-range', seed: 3, tier: 2 },
      { generatorId: 'u5-sqrtf-invariant', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'RF13.solve',
    explore: {
      preset: { explorer: 'radical', mode: 'solve' },
      predict: {
        question: 'Squaring $\\sqrt{x + 4} = x - 2$ gives $x^2 - 5x = 0$, so $x = 0$ or $x = 5$. Which are solutions?',
        options: ['Only $5$', 'Only $0$', 'Both', 'Neither'],
        answer: 0,
        tryIt: 'Set $a = 4$, $d = -2$ and look for the red point.',
      },
    },
    explain: [
      '**Algebraically**: isolate the radical, state the restrictions, square both sides, solve, then **check every root in the original**.',
      'Squaring can add roots. If $\\sqrt{A} = B$ then $A = B^2$, but $A = B^2$ also holds when $\\sqrt{A} = -B$. A root that makes the right side negative is **extraneous**.',
      'Restrictions: the radicand $\\ge 0$, and the side equal to the root $\\ge 0$. Roots outside them are rejected.',
      'Example: $\\sqrt{x + 4} = x - 2$. Squaring gives $x + 4 = x^2 - 4x + 4$, so $x(x - 5) = 0$. At $x = 0$ the right side is $-2$: extraneous. $x = 5$ checks ($3 = 3$).',
      '**Graphically**, two ways: graph each side and find the $x$-coordinates of the intersections, or move everything to one side and find the $x$-intercepts of $y = \\sqrt{A} - B$.',
      'The **zeros** of a function, the **$x$-intercepts** of its graph and the **roots** of the equation $f(x) = 0$ are the same numbers.',
    ],
    examples: [
      { generatorId: 'u5-radsolve-algebraic', seed: 2, tier: 2 },
      { generatorId: 'u5-radsolve-graphical', seed: 3, tier: 2 },
    ],
  },
  {
    nodeId: 'RF14.va-vs-hole',
    explore: {
      preset: { explorer: 'rational', num: [2], den: [2, -3] },
      predict: {
        question: 'For $y = \\frac{x - 2}{(x - 2)(x + 3)}$, what happens at $x = 2$?',
        options: ['A hole', 'A vertical asymptote', 'An $x$-intercept', 'Nothing special'],
        answer: 0,
        tryIt: 'Tap each feature in the list. Then move the numerator factor away from 2.',
      },
    },
    explain: [
      'Factor the numerator and denominator fully. Every zero of the denominator is a **non-permissible value**: the function has no value there.',
      'If a factor $(x - a)$ appears in the denominator and also cancels with the numerator, $x = a$ is a **point of discontinuity** (a hole).',
      'If $(x - a)$ remains in the denominator after cancelling, $x = a$ is a **vertical asymptote**.',
      'Near a hole, the function approaches a finite value; near an asymptote, $|y|$ grows without bound.',
      'Holes are drawn as open circles; asymptotes as dashed lines. Neither is part of the graph.',
      'A factor that cancels only partly still leaves an asymptote: in $\\frac{x - 1}{(x - 1)^2}$, one copy remains below, so $x = 1$ is a vertical asymptote.',
    ],
    examples: [
      { generatorId: 'u5-rat-va-hole', seed: 2, tier: 2 },
      { generatorId: 'u5-rat-hole-param', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'RF14.ha-intercepts',
    explore: {
      preset: { explorer: 'rational', num: [1], den: [-2], k: 2 },
      predict: {
        question: 'What horizontal asymptote does $y = \\frac{2(x - 1)}{x + 2}$ have?',
        options: ['$y = 2$', '$y = 0$', '$y = -2$', 'None'],
        answer: 0,
        tryIt: 'Tap the horizontal asymptote. Then remove the numerator factor.',
      },
    },
    explain: [
      'Compare degrees after simplifying, as $|x| \\to \\infty$:',
      'Numerator degree **less than** denominator degree: $y \\to 0$, so the horizontal asymptote is $y = 0$.',
      '**Equal** degrees: $y \\to$ the ratio of leading coefficients. $\\frac{3x - 6}{x + 1}$ has $y = 3$; $\\frac{4x^2}{2x^2 - 8}$ has $y = 2$.',
      'Numerator degree **greater**: no horizontal asymptote.',
      'A graph can cross its horizontal asymptote at finite $x$; the asymptote describes end behaviour only.',
      '**$x$-intercepts**: zeros of the numerator that do not cancel. A cancelled zero is a hole, not an intercept.',
      '**$y$-intercept**: substitute $x = 0$, unless $0$ is a non-permissible value.',
    ],
    examples: [
      { generatorId: 'u5-rat-ha', seed: 2, tier: 2 },
      { generatorId: 'u5-rat-intercepts', seed: 3, tier: 3 },
    ],
  },
  {
    nodeId: 'RF14.domain-range',
    explore: {
      preset: { explorer: 'rational', num: [3, 1], den: [1] },
      predict: {
        question: 'What is the range of $y = \\frac{(x - 3)(x - 1)}{x - 1}$?',
        options: ['$\\{y \\mid y \\ne -2,\\ y \\in R\\}$', '$\\{y \\mid y \\in R\\}$', '$\\{y \\mid y \\ne 1,\\ y \\in R\\}$', '$\\{y \\mid y \\ne 0,\\ y \\in R\\}$'],
        answer: 0,
        tryIt: 'Read the hole. Its $y$-value is missing from the range.',
      },
    },
    explain: [
      '**Domain**: all real numbers except the non-permissible values, both holes and vertical asymptotes. Write $\\{x \\mid x \\ne 2, -3,\\ x \\in R\\}$.',
      '**Range** for $y = \\frac{ax + b}{cx + d}$: every real number except the horizontal asymptote value $\\frac{a}{c}$. A transformed $\\frac{1}{x}$ never reaches its asymptote.',
      'A **hole** also removes a $y$-value from the range, unless the graph reaches that value somewhere else.',
      'A line with a hole, such as $y = \\frac{(x - 3)(x - 1)}{x - 1}$, simplifies to $y = x - 3$ with $x \\ne 1$. Its range is all reals except $1 - 3 = -2$.',
      'For $y = \\frac{k}{(x - p)^2}$ every output has the sign of $k$: range $y > 0$ if $k > 0$, $y < 0$ if $k < 0$.',
      'Check the range with the graph: scan horizontal lines and ask whether each meets the curve.',
    ],
    examples: [
      { generatorId: 'u5-rat-domain', seed: 2, tier: 2 },
      { generatorId: 'u5-rat-range', seed: 4, tier: 3 },
    ],
  },
  {
    nodeId: 'RF14.hole-y',
    explore: {
      preset: { explorer: 'rational', num: [-1, 2], den: [-1], k: 1 },
      predict: {
        question: '$y = \\frac{(x + 1)(x - 2)}{x + 1}$ has a hole at $x = -1$. What is its $y$-coordinate?',
        options: ['$-3$', '$0$', '$\\frac{0}{0}$, so it has none', '$-1$'],
        answer: 0,
        tryIt: 'Tap the hole and read its coordinates.',
      },
    },
    explain: [
      'At a hole the original expression is $\\frac{0}{0}$, so you cannot substitute directly.',
      'Cancel the common factor first, then substitute the $x$-value into the **simplified** expression.',
      'Example: $y = \\frac{x^2 - 4}{x^2 - x - 2} = \\frac{(x - 2)(x + 2)}{(x - 2)(x + 1)}$. Simplified: $\\frac{x + 2}{x + 1}$. At $x = 2$: $y = \\frac{4}{3}$. The hole is $\\left(2, \\frac{4}{3}\\right)$.',
      'The simplified function still carries the restriction $x \\ne 2$; the two are equal everywhere else.',
      'Reverse problems: if a hole is at $(a, b)$, the factor $(x - a)$ is in both numerator and denominator, and the simplified expression equals $b$ at $x = a$. Use that to find an unknown constant.',
    ],
    examples: [
      { generatorId: 'u5-rat-holey', seed: 2, tier: 2 },
      { generatorId: 'u5-rat-hole-unknown', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'RF14.sketch',
    explore: {
      preset: { explorer: 'rational', num: [0], den: [2, -2] },
      predict: {
        question: 'Just right of the asymptote $x = 2$, is $y = \\frac{x}{(x - 2)(x + 2)}$ large positive or large negative?',
        options: ['Large positive', 'Large negative', 'Close to 0', 'It depends on $k$ only'],
        answer: 0,
        tryIt: 'Look just right of $x = 2$. Then change $k$ to $-1$.',
      },
    },
    explain: [
      'Sketch in this order: factor; mark holes (open circles) and vertical asymptotes (dashed); find the horizontal asymptote; plot the intercepts.',
      'Then decide the sign of $y$ in each interval between the zeros and vertical asymptotes. A test value in each interval is enough.',
      'Behaviour near a vertical asymptote: a factor to an **odd** power changes sign across it (one side up, the other down); an **even** power keeps the same sign on both sides.',
      'An $x$-intercept from a single factor crosses the axis.',
      'Join the pieces smoothly, approaching the asymptotes without touching the vertical ones.',
      'To match a graph to an equation, check features that differ: a hole vs an asymptote, the horizontal asymptote, the $y$-intercept.',
    ],
    examples: [
      { generatorId: 'u5-rat-behaviour', seed: 2, tier: 2 },
      { generatorId: 'u5-rat-features', seed: 3, tier: 3 },
    ],
  },
  {
    nodeId: 'RF14.equation-from-graph',
    explore: {
      preset: { explorer: 'rational', num: [3], den: [-1, 2] },
      predict: {
        question: 'A graph has vertical asymptotes $x = -1$ and $x = 2$, an $x$-intercept at $3$ and $y = 0$ as its horizontal asymptote. Which factors does its equation need?',
        options: ['$\\frac{(x - 3)}{(x + 1)(x - 2)}$', '$\\frac{(x + 1)(x - 2)}{(x - 3)}$', '$\\frac{(x - 3)(x + 1)}{(x - 2)}$', '$\\frac{(x + 3)}{(x - 1)(x + 2)}$'],
        answer: 0,
        tryIt: 'Build it with the factor steppers and compare the features.',
      },
    },
    explain: [
      'Translate each feature into a factor:',
      'Vertical asymptote $x = a$: $(x - a)$ in the denominator only.',
      'Hole at $x = a$: $(x - a)$ in both numerator and denominator.',
      '$x$-intercept $b$: $(x - b)$ in the numerator only.',
      'Horizontal asymptote: $y = 0$ needs the denominator degree higher; $y = c \\ne 0$ needs equal degrees and $k$ chosen so the ratio of leading coefficients is $c$.',
      'Finally fix $k$ using one more point, often the $y$-intercept: substitute and solve.',
      'Example: VA $x = 1$, $x$-intercept $-2$, HA $y = 3$, hole at $x = 4$: $y = \\frac{3(x + 2)(x - 4)}{(x - 1)(x - 4)}$.',
    ],
    examples: [
      { generatorId: 'u5-rat-eq-features', seed: 2, tier: 2 },
      { generatorId: 'u5-rat-eq-graph', seed: 3, tier: 3 },
    ],
  },
  {
    nodeId: 'RF14.solve',
    explain: [
      '**Algebraically**: factor every denominator and state the non-permissible values first.',
      'Multiply both sides by the lowest common denominator. The result is a polynomial equation; solve it.',
      'Reject any root that is a non-permissible value; it is **extraneous**. Example: $\\frac{x}{x - 2} = \\frac{2}{x - 2} + 3$ gives $x = 2 + 3(x - 2)$, so $x = 2$, which is rejected: no solution.',
      '**Graphically**: graph each side and find the $x$-coordinates of the intersections, or graph $y = \\text{left} - \\text{right}$ and find its $x$-intercepts.',
      'A rejected root shows on the graph as a hole or an asymptote where the curves would have met.',
      'The solutions of $f(x) = c$ are the $x$-intercepts of $y = f(x) - c$: the same idea links equations and related functions.',
      'Round graphical answers as the question asks, usually to the nearest hundredth.',
    ],
    examples: [
      { generatorId: 'u5-ratsolve-algebraic', seed: 2, tier: 2 },
      { generatorId: 'u5-ratsolve-related', seed: 1, tier: 2 },
    ],
  },
];
