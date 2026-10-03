import type { Lesson } from './types';

/**
 * Prerequisite (Math 10C / 20-1) lessons. They double as ~10-minute repair lessons:
 * a short explanation, one or two worked examples, then a few practice items.
 */
export const PRE_LESSONS: Lesson[] = [
  {
    nodeId: 'P.exp-laws',
    explain: [
      'Same base: **multiply → add exponents** ($x^a x^b = x^{a+b}$), **divide → subtract** ($\\frac{x^a}{x^b} = x^{a-b}$), **power of a power → multiply** ($(x^a)^b = x^{ab}$). A power of a product reaches every factor: $(2x^3)^2 = 4x^6$, not $2x^6$.',
      '$x^0 = 1$ for $x \\ne 0$. A negative exponent is a reciprocal, never a negative number: $x^{-n} = \\frac{1}{x^n}$, so $2^{-3} = \\frac{1}{8}$.',
      'A rational exponent is a root and a power: $x^{m/n} = \\sqrt[n]{x^m} = (\\sqrt[n]{x})^m$. The **denominator is the root index**. Take the root first to keep numbers small: $8^{2/3} = (\\sqrt[3]{8})^2 = 4$.',
    ],
    examples: [
      { generatorId: 'pre-exp-simplify', seed: 3, tier: 3 },
      { generatorId: 'pre-exp-evaluate', seed: 5, tier: 3 },
    ],
  },
  {
    nodeId: 'P.radicals',
    explain: [
      '$\\sqrt{ab} = \\sqrt{a}\\sqrt{b}$ for $a, b \\ge 0$. To simplify, split off the **largest perfect square**: $\\sqrt{72} = \\sqrt{36 \\cdot 2} = 6\\sqrt{2}$. A radical is simplest when the radicand has no perfect-square factor.',
      'Only **like radicals** combine, the way like terms do: $3\\sqrt{2} + 5\\sqrt{2} = 8\\sqrt{2}$. $\\sqrt{a} + \\sqrt{b} \\ne \\sqrt{a + b}$; simplify first, then look for like radicals.',
      'To rationalize $\\frac{a}{\\sqrt{b}}$, multiply top and bottom by $\\sqrt{b}$. For a binomial denominator $\\sqrt{b} + c$, multiply by the **conjugate** $\\sqrt{b} - c$: $(\\sqrt{b} + c)(\\sqrt{b} - c) = b - c^2$, which has no root.',
    ],
    examples: [
      { generatorId: 'pre-rad-add', seed: 4, tier: 2 },
      { generatorId: 'pre-rad-rationalize', seed: 2, tier: 2 },
    ],
  },
  {
    nodeId: 'P.factor-basic',
    explain: [
      'Always take out the **greatest common factor** first: the largest number and lowest power of $x$ dividing every term. $6x^3 - 9x^2 = 3x^2(2x - 3)$. With a negative leading coefficient, take out the negative.',
      '**Difference of squares:** $A^2 - B^2 = (A - B)(A + B)$. A **sum** of squares $A^2 + B^2$ does not factor over the real numbers.',
      '**Grouping** handles four terms: pair them so each pair has a common factor, then factor out the shared binomial. $x^3 + 2x^2 + 3x + 6 = x^2(x + 2) + 3(x + 2) = (x + 2)(x^2 + 3)$.',
      '"Factor fully" means checking every factor again: $x^4 - 16 = (x^2 - 4)(x^2 + 4) = (x - 2)(x + 2)(x^2 + 4)$.',
    ],
    examples: [
      { generatorId: 'pre-fac-dos', seed: 6, tier: 2 },
      { generatorId: 'pre-fac-gcf', seed: 2, tier: 3 },
    ],
  },
  {
    nodeId: 'P.factor-trinomial',
    explain: [
      '$x^2 + bx + c = (x + m)(x + n)$ where $mn = c$ and $m + n = b$. Signs: $c > 0$ means $m, n$ share the sign of $b$; $c < 0$ means opposite signs.',
      'For $ax^2 + bx + c$ with $a \\ne 1$, use **decomposition**: find $m, n$ with $mn = ac$ and $m + n = b$, split $bx$ into $mx + nx$, then group. $6x^2 + x - 2$: $ac = -12$, so $4$ and $-3$; $6x^2 + 4x - 3x - 2 = 2x(3x + 2) - (3x + 2) = (3x + 2)(2x - 1)$.',
      'A trinomial in $x^2$, such as $x^4 - 5x^2 + 4$, is a quadratic in $u = x^2$: factor, substitute back, then look for differences of squares.',
      'Check every answer by expanding.',
    ],
    examples: [
      { generatorId: 'pre-fac-tri-leading', seed: 3, tier: 2 },
      { generatorId: 'pre-fac-tri-simple', seed: 4, tier: 3 },
    ],
  },
  {
    nodeId: 'P.quad-solve',
    explain: [
      'Get **zero on one side** first. If the quadratic factors, use the zero product property: $(x - r)(x - s) = 0$ gives $x = r$ or $x = s$. Note the sign flip: $(x + 3) = 0$ gives $x = -3$.',
      'Otherwise use the **quadratic formula** $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$. The whole numerator is divided by $2a$. Simplify the radical and reduce common factors for an exact answer.',
      'The **discriminant** $\\Delta = b^2 - 4ac$ counts real roots: $\\Delta > 0$ two, $\\Delta = 0$ one (a double root), $\\Delta < 0$ none. A perfect-square $\\Delta$ means the quadratic factors over the integers.',
      'Solving $x^2 = k$ gives $x = \\pm\\sqrt{k}$: both roots.',
    ],
    examples: [
      { generatorId: 'pre-quad-factor-solve', seed: 2, tier: 3 },
      { generatorId: 'pre-quad-formula', seed: 6, tier: 2 },
    ],
  },
  {
    nodeId: 'P.quad-vertex',
    explore: {
      preset: { explorer: 'transformation', base: 'quad', sliders: ['a', 'h', 'k'] },
      predict: {
        question: 'Where is the vertex of $y = 2(x + 3)^2 - 1$?',
        options: ['$(-3, -1)$', '$(3, -1)$', '$(-3, 1)$', '$(2, -1)$'],
        answer: 0,
        tryIt: 'Set $a = 2$, $h = -3$, $k = -1$ and read the vertex.',
      },
    },
    explain: [
      'In **vertex form** $y = a(x - h)^2 + k$ the vertex is $(h, k)$ and the axis of symmetry is $x = h$. Read $h$ as the value that makes the bracket zero: $(x + 3)^2$ gives $h = -3$.',
      '$a > 0$ opens up, so $k$ is the **minimum** and the range is $[k, \\infty)$. $a < 0$ opens down: $k$ is the maximum, range $(-\\infty, k]$.',
      'From standard form $y = ax^2 + bx + c$, the vertex has $x = -\\frac{b}{2a}$; substitute to get $y$. Or **complete the square**: factor $a$ from the $x$ terms, add and subtract $\\left(\\frac{b}{2a}\\right)^2$ inside the bracket, then move the subtracted part out (multiplied by $a$).',
    ],
    examples: [
      { generatorId: 'pre-quad-complete-square', seed: 4, tier: 2 },
      { generatorId: 'pre-quad-vertex-standard', seed: 2, tier: 2 },
    ],
  },
  {
    nodeId: 'P.func-notation',
    explain: [
      '$f(x)$ is the **output** of $f$ at input $x$; it is not $f$ times $x$. $f(3)$ means "substitute $3$ for every $x$". Substitute negatives in brackets: if $f(x) = x^2 - 2x$, then $f(-3) = (-3)^2 - 2(-3) = 15$.',
      'Two directions: **evaluate** $f(a)$ (input known, find output) versus **solve** $f(x) = b$ (output known, find every input). From a table or graph, evaluating starts on the $x$-axis or $x$ row; solving starts on the $y$ side.',
      '$2f(a)$ doubles the output. $f(2a)$ doubles the input. $f(a) + 1$ and $f(a + 1)$ differ too.',
    ],
    examples: [
      { generatorId: 'pre-fn-eval', seed: 3, tier: 3 },
      { generatorId: 'pre-fn-solve', seed: 2, tier: 3 },
    ],
  },
  {
    nodeId: 'P.domain-range',
    explore: {
      preset: { explorer: 'transformation', base: 'sqrt', sliders: ['h', 'k'] },
      predict: {
        question: 'What is the domain of $y = \\sqrt{x - 2} + 1$?',
        options: ['$[2, \\infty)$', '$[-2, \\infty)$', '$[1, \\infty)$', '$(2, \\infty)$'],
        answer: 0,
        tryIt: 'Set $h = 2$, $k = 1$ and look at where the graph starts.',
      },
    },
    explain: [
      '**Domain**: all permitted $x$-values. **Range**: all resulting $y$-values. From a graph, project onto the $x$-axis for domain and onto the $y$-axis for range.',
      '**Interval notation**: square bracket = endpoint included, round = excluded; $\\infty$ always gets a round bracket. **Set-builder**: $\\{x \\mid -2 < x \\le 5, x \\in \\mathbb{R}\\}$ is $(-2, 5]$. A hollow dot on a graph is excluded.',
      'From an equation, look for restrictions: a **square root** needs radicand $\\ge 0$; a **denominator** cannot be $0$, giving $\\{x \\mid x \\ne c, x \\in \\mathbb{R}\\}$, written $(-\\infty, c) \\cup (c, \\infty)$. Dividing an inequality by a negative reverses it.',
    ],
    examples: [
      { generatorId: 'pre-dr-graph', seed: 4, tier: 2 },
      { generatorId: 'pre-dr-function', seed: 3, tier: 1 },
    ],
  },
  {
    nodeId: 'P.linear',
    explore: {
      preset: { explorer: 'transformation', base: 'linear', sliders: ['a', 'k'] },
      predict: {
        question: 'In $y = ax + k$, what does increasing $k$ do?',
        options: ['Moves the line up', 'Makes the line steeper', 'Moves the line right', 'Rotates it about the origin'],
        answer: 0,
        tryIt: 'Drag $k$ and watch the $y$-intercept.',
      },
    },
    explain: [
      'Slope $m = \\frac{y_2 - y_1}{x_2 - x_1}$: rise over run, subtracting in the same order. Horizontal lines have slope $0$; vertical lines have undefined slope.',
      'Forms: **slope-intercept** $y = mx + b$; **point-slope** $y - y_1 = m(x - x_1)$; **general** $Ax + By + C = 0$. To read slope from $Ax + By = C$, solve for $y$: $m = -\\frac{A}{B}$.',
      'Parallel lines have equal slopes. Perpendicular slopes are **negative reciprocals**: $m_\\perp = -\\frac{1}{m}$, so their product is $-1$.',
    ],
    examples: [
      { generatorId: 'pre-lin-equation', seed: 5, tier: 3 },
      { generatorId: 'pre-lin-read', seed: 2, tier: 2 },
    ],
  },
  {
    nodeId: 'P.abs',
    explain: [
      '$|a|$ is the distance from $a$ to $0$, so it is never negative. Evaluate inside the bars first: $|3 - 8| = 5$, while $|3| - |8| = -5$.',
      '$|A| = A$ when $A \\ge 0$ and $|A| = -A$ when $A < 0$. So $y = |2x - 6|$ is $2x - 6$ for $x \\ge 3$ and $-2x + 6$ for $x < 3$: the split is at the **zero of the inside**.',
      'Graph $y = |f(x)|$ by reflecting only the parts of $y = f(x)$ **below** the $x$-axis. Points on the $x$-axis are invariant, and the range is never below $0$.',
    ],
    examples: [
      { generatorId: 'pre-abs-eval', seed: 2, tier: 3 },
      { generatorId: 'pre-abs-graph', seed: 3, tier: 2 },
    ],
  },
  {
    nodeId: 'P.rat-expr',
    explain: [
      'A **non-permissible value** makes a denominator zero. Find them by factoring the denominator **before** simplifying; cancelling a factor does not remove its restriction. Zeros of the numerator are allowed. When dividing, the numerator of the divisor also becomes a restriction.',
      'Simplify by cancelling **common factors**, never terms: $\\frac{x + 3}{3} \\ne x$.',
      'Add or subtract with a common denominator: multiply each fraction by the factor it is missing. A minus sign in front of a fraction applies to its **whole** numerator. To divide, multiply by the reciprocal of the second fraction.',
    ],
    examples: [
      { generatorId: 'pre-rat-simplify', seed: 4, tier: 2 },
      { generatorId: 'pre-rat-operate', seed: 3, tier: 2 },
    ],
  },
  {
    nodeId: 'P.rat-eq',
    explain: [
      'State the **non-permissible values first**. Then multiply every term (both sides) by the lowest common denominator to clear the fractions, and solve the resulting linear or quadratic equation.',
      'Multiplying by an expression that can be zero can create roots that do not satisfy the original equation. Any root equal to a non-permissible value is **extraneous** and is rejected. Roots that are permissible are kept, negative or not.',
      'Write the final answer with only the valid roots, or "no solution" if none survive.',
    ],
    examples: [
      { generatorId: 'pre-rateq-solve', seed: 2, tier: 2 },
      { generatorId: 'pre-rateq-solve', seed: 3, tier: 3 },
    ],
  },
  {
    nodeId: 'P.rad-eq',
    explain: [
      '**Isolate** the radical, then square both sides. Square a binomial side fully: $(x - 3)^2 = x^2 - 6x + 9$, not $x^2 + 9$.',
      'Squaring can introduce roots, because $\\sqrt{A} = B$ and $\\sqrt{A} = -B$ square to the same equation. **Check every root in the original equation.** A principal square root is never negative, so a root that makes the other side negative is extraneous.',
      'State restrictions too: the radicand must be $\\ge 0$. If the isolated radical equals a negative number, there is no solution.',
    ],
    examples: [
      { generatorId: 'pre-radeq-solve', seed: 3, tier: 3 },
      { generatorId: 'pre-radeq-check', seed: 2, tier: 2 },
    ],
  },
  {
    nodeId: 'P.systems',
    explain: [
      'A solution of a system is a point on **both** graphs, so it is an intersection point. Report both coordinates.',
      'Algebraically, set the two expressions for $y$ equal, move everything to one side and solve. Substitute each $x$ back into the simpler equation for $y$.',
      'A line and a parabola meet in $0$, $1$ or $2$ points; the discriminant of the combined quadratic tells which. On a calculator, graph both and use **2nd → CALC → intersect** once per point, guessing near each one.',
    ],
    examples: [
      { generatorId: 'pre-sys-solve', seed: 3, tier: 2 },
      { generatorId: 'pre-sys-count', seed: 2, tier: 2 },
    ],
  },
  {
    nodeId: 'P.ref-angle',
    explain: [
      'An angle in **standard position** starts on the positive $x$-axis and rotates counterclockwise (positive) or clockwise (negative). Coterminal angles differ by $360^\\circ$.',
      'The **reference angle** is the acute angle between the terminal arm and the **$x$-axis**: QII $180^\\circ - \\theta$, QIII $\\theta - 180^\\circ$, QIV $360^\\circ - \\theta$.',
      'For a point $(x, y)$ on the terminal arm, $r = \\sqrt{x^2 + y^2}$, $\\sin\\theta = \\frac{y}{r}$, $\\cos\\theta = \\frac{x}{r}$, $\\tan\\theta = \\frac{y}{x}$. **CAST** gives the positive ratio in each quadrant: QI all, QII sine, QIII tangent, QIV cosine. A ratio of $\\theta$ equals the ratio of its reference angle with the CAST sign.',
    ],
    examples: [
      { generatorId: 'pre-ref-angle', seed: 3, tier: 3 },
      { generatorId: 'pre-ref-exact', seed: 4, tier: 2 },
    ],
  },
  {
    nodeId: 'P.sine-cos-law',
    explain: [
      '**Sine law** $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$: use it when you know a side and its **opposite** angle (two angles and a side, or two sides and a non-included angle).',
      '**Cosine law** $a^2 = b^2 + c^2 - 2bc\\cos A$: use it with two sides and the **included** angle, or with three sides (rearranged: $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$).',
      'Calculator in **degree mode**. Round only the final answer. This review is not assessed directly on the diploma, but the habits carry over.',
    ],
    examples: [
      { generatorId: 'pre-law-sine', seed: 2, tier: 2 },
      { generatorId: 'pre-law-cos', seed: 3, tier: 3 },
    ],
  },
];
