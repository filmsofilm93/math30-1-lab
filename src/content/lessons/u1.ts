import type { Lesson } from './types';

/** Unit 1 lessons. Explanations are ≤ 200 words; examples are generator items revealed step by step. */
export const U1_LESSONS: Lesson[] = [
  {
    nodeId: 'RF2.translate',
    explore: {
      preset: { explorer: 'transformation', base: 'quad', sliders: ['h', 'k'] },
      predict: {
        question: 'In $y = (x - h)^2$, what happens to the graph when $h$ changes from $0$ to $3$?',
        options: ['It moves 3 units right', 'It moves 3 units left', 'It moves 3 units up', 'It gets narrower'],
        answer: 0,
        tryIt: 'Drag $h$ to $3$ and watch the vertex.',
      },
    },
    cards: [
      {
        say: 'A **translation** slides a graph to a new place. The shape does not change. It only moves left, right, up or down.',
        check: { q: 'After a translation, the graph is…', options: ['the same shape, in a new place', 'wider', 'flipped over', 'a different shape'], answer: 0, why: 'A translation only slides the graph. Nothing stretches or flips.' },
      },
      {
        say: 'A number **added outside** the function moves the graph **up or down**. Plus means up. Minus means down.',
        example: ['$y = x^2 + 3$', 'The $+3$ is outside the square.', 'So the graph moves **up 3**.'],
        check: { q: 'Which way does $y = x^2 - 5$ move compared with $y = x^2$?', options: ['Down 5', 'Up 5', 'Left 5', 'Right 5'], answer: 0, why: 'The $-5$ is outside, so it moves the graph down 5.' },
      },
      {
        say: 'A number **inside the bracket with $x$** moves the graph **left or right**. This one works backwards: minus means right, plus means left.',
        example: ['$y = (x - 4)^2$', 'The $-4$ is inside, with the $x$.', 'Backwards: minus means **right 4**.'],
        check: { q: 'Which way does $y = (x + 2)^2$ move compared with $y = x^2$?', options: ['Left 2', 'Right 2', 'Up 2', 'Down 2'], answer: 0, why: 'Inside the bracket works backwards: $+2$ means left 2.' },
      },
      {
        say: 'A quick trick for the inside number: ask what value of $x$ makes the bracket zero. That value is $h$. It tells you how far the graph moved sideways, and which way.',
        example: ['$y = (x - 4)^2$', '$x - 4 = 0$ when $x = 4$.', 'So $h = 4$: right 4.', '$y = (x + 2)^2$', '$x + 2 = 0$ when $x = -2$.', 'So $h = -2$: left 2.'],
        check: { q: 'What value of $x$ makes $(x - 7)$ zero?', options: ['$7$', '$-7$', '$0$', '$1$'], answer: 0, why: '$7 - 7 = 0$, so the graph moved right 7.' },
      },
      {
        say: 'The general form is $y = f(x - h) + k$. The graph moves $h$ sideways and $k$ up or down.',
        example: ['$y = (x - 1)^2 + 5$', 'Inside: $-1$, so right 1. $h = 1$.', 'Outside: $+5$, so up 5. $k = 5$.'],
        check: { q: 'For $y = (x + 3)^2 - 2$, what are $h$ and $k$?', options: ['$h = -3$, $k = -2$', '$h = 3$, $k = -2$', '$h = -3$, $k = 2$', '$h = 3$, $k = 2$'], answer: 0, why: '$x + 3 = 0$ gives $h = -3$ (left 3). The $-2$ outside gives $k = -2$ (down 2).' },
      },
      {
        say: 'To move one **point**, add $h$ to its $x$ and add $k$ to its $y$.',
        example: ['Point $(2, 5)$, with $h = 3$ and $k = -1$.', 'New $x$: $2 + 3 = 5$.', 'New $y$: $5 + (-1) = 4$.', 'New point: $(5, 4)$.'],
        check: { q: 'Move $(1, 4)$ with $h = -2$ and $k = 3$.', options: ['$(-1, 7)$', '$(3, 7)$', '$(-1, 1)$', '$(3, 1)$'], answer: 0, why: '$1 + (-2) = -1$ and $4 + 3 = 7$.' },
      },
      {
        say: 'The whole graph slides, so the **domain** (the $x$-values) shifts by $h$, and the **range** (the $y$-values) shifts by $k$.',
        example: ['Domain $0 \\le x \\le 4$, and $h = 2$.', 'Add 2 to both ends: $2 \\le x \\le 6$.'],
        check: { q: 'The range is $y \\ge 1$. The graph moves down 3. What is the new range?', options: ['$y \\ge -2$', '$y \\ge 4$', '$y \\ge 1$', '$y \\le -2$'], answer: 0, why: 'Down 3 means $k = -3$, and $1 - 3 = -2$.' },
      },
    ],
    explain: [
      'A translation slides a graph without changing its shape. In $y - k = f(x - h)$, or $y = f(x - h) + k$, every point moves $h$ units horizontally and $k$ units vertically: $(x, y) \\to (x + h, y + k)$.',
      'The horizontal part feels backwards. $y = f(x - 3)$ moves the graph **right** $3$, because the new graph needs an input $3$ larger to produce the same output. Read $h$ as the value that makes the bracket zero: $x - 3 = 0$ gives $h = 3$; $x + 2 = 0$ gives $h = -2$ (left $2$).',
      'The vertical part reads directly when $k$ is added on the right: $+k$ is up. If the equation is written $y - k = \\ldots$, move $k$ to the right side first.',
      'Domain shifts by $h$, range shifts by $k$. Nothing stretches, so no point stays fixed (no invariant points) unless $h = k = 0$.',
    ],
    examples: [
      { generatorId: 'rf2-translate-point', seed: 11, tier: 3 },
      { generatorId: 'rf2-translate-domain-range', seed: 4, tier: 2 },
    ],
  },
  {
    nodeId: 'RF3.stretch-v',
    explore: {
      preset: { explorer: 'transformation', base: 'sqrt', sliders: ['a'], showInvariant: true },
      predict: {
        question: 'For $y = a\\sqrt{x}$, what happens to the point $(4, 2)$ when $a = 3$?',
        options: ['It moves to $(4, 6)$', 'It moves to $(12, 2)$', 'It moves to $(12, 6)$', 'It stays at $(4, 2)$'],
        answer: 0,
        tryIt: 'Set $a = 3$ and follow the highlighted point.',
      },
    },
    explain: [
      '$y = af(x)$ multiplies every **output** by $a$: $(x, y) \\to (x, ay)$. The $x$-values do not change.',
      'This is a vertical stretch **about the $x$-axis** by a factor of $|a|$. If $|a| > 1$ the graph pulls away from the $x$-axis; if $0 < |a| < 1$ it squashes toward it. If $a < 0$ the graph is also reflected in the $x$-axis.',
      'Points with $y = 0$ do not move, because $a \\cdot 0 = 0$. These are the **invariant points** of a vertical stretch: the $x$-intercepts.',
      'Domain is unchanged. Range endpoints get multiplied by $a$; a negative $a$ swaps their order.',
    ],
    examples: [
      { generatorId: 'rf3-vstretch-point', seed: 3, tier: 3 },
      { generatorId: 'rf3-vstretch-range', seed: 8, tier: 3 },
    ],
  },
  {
    nodeId: 'RF3.stretch-h',
    explore: {
      preset: { explorer: 'transformation', base: 'quad', sliders: ['b'], showInvariant: true },
      predict: {
        question: 'For $y = (bx)^2$, what happens to the point $(2, 4)$ when $b = 2$?',
        options: ['It moves to $(1, 4)$', 'It moves to $(4, 4)$', 'It moves to $(2, 8)$', 'It moves to $(2, 16)$'],
        answer: 0,
        tryIt: 'Set $b = 2$, then $b = \\frac{1}{2}$. Watch which way the parabola changes.',
      },
    },
    explain: [
      '$y = f(bx)$ changes **inputs**, so it acts horizontally, and in reverse: $(x, y) \\to \\left(\\frac{x}{b}, y\\right)$.',
      'Why reverse? The old graph had $f(2) = 4$. On $y = f(2x)$, you get the output $4$ when $2x = 2$, which is $x = 1$. Every $x$-coordinate is divided by $b$.',
      'This is a horizontal stretch **about the $y$-axis** by a factor of $\\frac{1}{|b|}$. So $b = 2$ is a stretch by $\\frac{1}{2}$ (narrower) and $b = \\frac{1}{3}$ is a stretch by $3$ (wider). A negative $b$ also reflects in the $y$-axis.',
      'Points with $x = 0$ do not move: the $y$-intercept is the invariant point. The range is unchanged; domain endpoints are divided by $b$.',
      'Exam trap: "stretch by a factor of $3$" means $b = \\frac{1}{3}$, not $b = 3$.',
    ],
    examples: [
      { generatorId: 'rf3-hstretch-point', seed: 5, tier: 3 },
      { generatorId: 'rf3-hstretch-equation', seed: 2, tier: 2 },
    ],
  },
  {
    nodeId: 'RF5.reflect-axes',
    explore: {
      preset: { explorer: 'transformation', base: 'sqrt', sliders: ['a', 'b'], showInvariant: true },
      predict: {
        question: 'Which equation reflects $y = \\sqrt{x}$ so the graph runs to the **left** of the origin?',
        options: ['$y = \\sqrt{-x}$', '$y = -\\sqrt{x}$', '$y = -\\sqrt{-x}$', '$y = \\frac{1}{\\sqrt{x}}$'],
        answer: 0,
        tryIt: 'Set $b = -1$, then try $a = -1$ instead.',
      },
    },
    explain: [
      '$y = -f(x)$ negates every output: $(x, y) \\to (x, -y)$. That is a reflection in the **$x$-axis**. Invariant points: the $x$-intercepts.',
      '$y = f(-x)$ negates every input: $(x, y) \\to (-x, y)$. That is a reflection in the **$y$-axis**. Invariant point: the $y$-intercept.',
      'Memory aid: a negative **outside** flips up and down; a negative **inside** flips left and right.',
      'To reflect a polynomial in the $y$-axis, replace every $x$ with $(-x)$: even powers keep their sign, odd powers change sign.',
    ],
    examples: [
      { generatorId: 'rf5-reflect-equation', seed: 6, tier: 3 },
      { generatorId: 'rf5-reflect-point', seed: 2, tier: 2 },
    ],
  },
  {
    nodeId: 'RF3.invariant',
    explore: {
      preset: { explorer: 'transformation', base: 'cubic', sliders: ['a', 'b'], showInvariant: true },
      predict: {
        question: 'For $y = 3f(x)$, which points of $y = f(x)$ stay where they are?',
        options: ['Points with $y = 0$', 'Points with $x = 0$', 'Every point', 'No points'],
        answer: 0,
        tryIt: 'Change $a$ and watch which highlighted points stay fixed. Then change $b$ instead.',
      },
    },
    explain: [
      'An **invariant point** is a point that maps to itself.',
      '**Vertical** stretch or reflection in the $x$-axis: $(x, y) \\to (x, ay)$. A point is fixed when $ay = y$, which (for $a \\ne 1$) means $y = 0$. The invariant points are the $x$-intercepts.',
      '**Horizontal** stretch or reflection in the $y$-axis: $(x, y) \\to \\left(\\frac{x}{b}, y\\right)$. Fixed when $\\frac{x}{b} = x$, so $x = 0$. The invariant point is the $y$-intercept.',
      '**Translations** move every point: no invariant points.',
      '**Reflection in $y = x$**: the invariant points lie on $y = x$. Solve $f(x) = x$.',
      'To count invariant points of a vertical change, count the distinct zeros of $f$.',
    ],
    examples: [
      { generatorId: 'rf3-invariant-count', seed: 9, tier: 3 },
      { generatorId: 'rf3-invariant-points', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF4.combined',
    explore: {
      preset: { explorer: 'transformation', base: 'sqrt', sliders: ['a', 'b', 'h', 'k'], showInvariant: true },
      predict: {
        question: 'Under $y = 2f\\left(\\frac{1}{2}(x - 1)\\right) + 3$, where does $(4, 2)$ go?',
        options: ['$(9, 7)$', '$(3, 7)$', '$(5, 10)$', '$(9, 10)$'],
        answer: 0,
        tryIt: 'Set $a = 2$, $b = \\frac{1}{2}$, $h = 1$, $k = 3$ and read the mapping.',
      },
    },
    explain: [
      'Every combined transformation $y = af(b(x - h)) + k$ follows one mapping:',
      '$$(x, y) \\to \\left(\\frac{x}{b} + h,\\ ay + k\\right)$$',
      'Order matters: stretch and reflect first, translate last. The new $x$ is $\\frac{x}{b} + h$, **not** $\\frac{x + h}{b}$. The new $y$ is $ay + k$, **not** $a(y + k)$.',
      'Read $h$ from the bracket only when $x$ has coefficient $1$ inside it. In $f(2x - 6)$, factor first: $f(2(x - 3))$, so $h = 3$, not $6$.',
      'Describe in this order: vertical stretch by $|a|$, horizontal stretch by $\\frac{1}{|b|}$, reflections from negative $a$ or $b$, then translations $h$ and $k$.',
    ],
    examples: [
      { generatorId: 'rf4-map-point', seed: 12, tier: 3 },
      { generatorId: 'rf4-mapping-rule', seed: 3, tier: 3 },
    ],
  },
  {
    nodeId: 'RF4.factor-b',
    explore: {
      preset: { explorer: 'transformation', base: 'abs', b: 2, sliders: ['b', 'h'] },
      predict: {
        question: 'In $y = |2x - 6|$, how far is the vertex from the origin horizontally?',
        options: ['$3$ units right', '$6$ units right', '$6$ units left', '$3$ units left'],
        answer: 0,
        tryIt: 'Keep $b = 2$ and move $h$ until the equation reads $|2(x - 3)|$.',
      },
    },
    explain: [
      'The parameter $h$ is only visible when the bracket looks like $b(x - h)$, with $x$ on its own inside.',
      'Factor out $b$: $f(2x - 6) = f(2(x - 3))$, so $h = 3$. Reading $6$ from the unfactored bracket is the most common error on this outcome.',
      'With a negative $b$: $f(-x + 4) = f(-(x - 4))$, so $b = -1$ and $h = 4$.',
      'For radicals, the domain comes from the radicand: $\\sqrt{-2x + 8}$ needs $-2x + 8 \\ge 0$, so $x \\le 4$. Dividing by a negative flips the inequality, and the graph runs left.',
    ],
    examples: [
      { generatorId: 'rf4-factor-b-params', seed: 5, tier: 3 },
      { generatorId: 'rf4-factor-b-domain', seed: 7, tier: 3 },
    ],
  },
  {
    nodeId: 'RF4.equation-from-graph',
    explore: {
      preset: { explorer: 'transformation', base: 'quad', a: -2, h: 1, k: 3, sliders: ['a', 'h', 'k'] },
      predict: {
        question: 'A parabola has vertex $(1, 3)$ and passes through $(2, 1)$. What is $a$?',
        options: ['$-2$', '$2$', '$-\\frac{1}{2}$', '$-1$'],
        answer: 0,
        tryIt: 'Move one unit right of the vertex and count how far the graph drops.',
      },
    },
    explain: [
      'To write an equation from a graph:',
      '1. Locate the anchor point: the vertex of $x^2$ or $|x|$, the endpoint of $\\sqrt{x}$, the centre of $x^3$. It gives $(h, k)$.',
      '2. Step one unit right from the anchor. On the base graph you would rise $1$; the image rises $a$. A drop means $a < 0$.',
      '3. If the graph runs left from a radical endpoint, $b$ is negative.',
      '4. Write $y = af(b(x - h)) + k$ and check one more point.',
      'For $x^2$, $|x|$ and $\\sqrt{x}$ a horizontal stretch can be rewritten as a vertical one, so several correct equations exist. Any equivalent equation is accepted here, as on the diploma.',
    ],
    examples: [
      { generatorId: 'rf4-equation-from-graph', seed: 4, tier: 2 },
      { generatorId: 'rf4-find-a-k', seed: 2, tier: 2 },
    ],
  },
  {
    nodeId: 'RF4.domain-range-image',
    explore: {
      preset: { explorer: 'transformation', base: 'sqrt', a: -1, h: 2, k: 4, sliders: ['a', 'b', 'h', 'k'] },
      predict: {
        question: 'What is the range of $y = -\\sqrt{x - 2} + 4$?',
        options: ['$(-\\infty, 4]$', '$[4, \\infty)$', '$[2, \\infty)$', '$(-\\infty, 2]$'],
        answer: 0,
        tryIt: 'Toggle $a$ between $1$ and $-1$ and watch the range.',
      },
    },
    explain: [
      'Domain endpoints follow the $x$-part of the mapping, $x \\to \\frac{x}{b} + h$. Range endpoints follow the $y$-part, $y \\to ay + k$.',
      'After mapping, write the smaller value first. A negative $a$ or $b$ swaps the order of the endpoints.',
      'For base functions: $\\sqrt{x}$ starts at $(0, 0)$, so the image starts at $(h, k)$; $x^2$ and $|x|$ have range starting at $k$, going up if $a > 0$ and down if $a < 0$.',
      'Zeros of the image: zeros have $y = 0$, so $a$ does not move them. With $k = 0$, each zero $r$ goes to $\\frac{r}{b} + h$.',
      'Use interval notation $[\\,]$ for included endpoints, $(\\,)$ for excluded ones and always $($ at $\\pm\\infty$.',
    ],
    examples: [
      { generatorId: 'rf4-dr-mystery', seed: 6, tier: 3 },
      { generatorId: 'rf4-zeros-image', seed: 3, tier: 3 },
    ],
  },
  {
    nodeId: 'RF5.reflect-yx',
    explore: {
      preset: { explorer: 'transformation', base: 'exp2', sliders: [], showInverse: true },
      predict: {
        question: '$(1, 2)$ is on $y = 2^x$. Which point is on its reflection in $y = x$?',
        options: ['$(2, 1)$', '$(-1, -2)$', '$(\\frac{1}{2}, 1)$', '$(1, -2)$'],
        answer: 0,
        tryIt: 'Turn on the inverse and compare the highlighted points.',
      },
    },
    explain: [
      'Reflecting in the line $y = x$ swaps coordinates: $(x, y) \\to (y, x)$. The result is the **inverse** relation.',
      'Its equation is $x = f(y)$: swap $x$ and $y$ in the original equation.',
      'Domain and range swap. Invariant points are where the graph meets $y = x$; solve $f(x) = x$.',
      'On the diploma, a reflection in $y = x$ is never combined with other transformations.',
    ],
    examples: [
      { generatorId: 'rf5-yx-invariant', seed: 2, tier: 3 },
      { generatorId: 'rf5-yx-invariant', seed: 5, tier: 1 },
    ],
  },
  {
    nodeId: 'RF6.inverse-alg',
    explore: {
      preset: { explorer: 'transformation', base: 'quad', sliders: ['a', 'h', 'k'], showInverse: true },
      predict: {
        question: 'Is the inverse of $y = x^2$ a function?',
        options: ['No: it fails the vertical line test', 'Yes: every parabola has an inverse function', 'Only if $a > 0$', 'Yes, it is $y = \\frac{1}{x^2}$'],
        answer: 0,
        tryIt: 'Show the inverse and run a vertical line across it.',
      },
    },
    explain: [
      'To find an inverse algebraically: write $y = f(x)$, **swap** $x$ and $y$, then **solve for $y$**, undoing operations in reverse order.',
      'Linear: $y = 3x - 6 \\Rightarrow x = 3y - 6 \\Rightarrow y = \\frac{x + 6}{3}$.',
      'Quadratic: $y = 2(x - 1)^2 + 3 \\Rightarrow x = 2(y - 1)^2 + 3 \\Rightarrow (y - 1)^2 = \\frac{x - 3}{2} \\Rightarrow y = 1 \\pm \\sqrt{\\frac{x - 3}{2}}$. The $\\pm$ is essential.',
      'Notation: write $f^{-1}(x)$ **only** when the inverse is a function. Otherwise write $y = \\ldots$.',
      '$f^{-1}(x)$ is not $\\frac{1}{f(x)}$. And $f^{-1}(5)$ asks: which input gives $f$ an output of $5$?',
    ],
    examples: [
      { generatorId: 'rf6-inverse-quadratic', seed: 3, tier: 3 },
      { generatorId: 'rf6-inverse-linear', seed: 8, tier: 3 },
    ],
  },
  {
    nodeId: 'RF6.restrict',
    explore: {
      preset: { explorer: 'transformation', base: 'quad', h: 2, k: -1, sliders: ['h', 'k'], showInverse: true },
      predict: {
        question: 'Which restriction makes the inverse of $y = (x - 2)^2 - 1$ a function?',
        options: ['$x \\ge 2$', '$x \\ge -1$', '$y \\ge -1$', '$x \\ge -2$'],
        answer: 0,
        tryIt: 'Turn on the domain restriction and watch half of the inverse disappear.',
      },
    },
    explain: [
      'A parabola fails the horizontal line test, so its inverse is not a function. Cut it at the **vertex**: keep $x \\ge h$ or $x \\le h$.',
      'Use the vertex\'s $x$-coordinate, not $k$, and restrict $x$, not $y$.',
      'Then choose the matching sign: with $x \\ge h$, the inverse must output values $\\ge h$, so keep $+\\sqrt{\\ }$; with $x \\le h$, keep $-\\sqrt{\\ }$.',
      'The domain of $f^{-1}$ is the range of the restricted $f$; the range of $f^{-1}$ is the restricted domain.',
    ],
    examples: [
      { generatorId: 'rf6-restricted-inverse', seed: 4, tier: 2 },
      { generatorId: 'rf6-restricted-domain-range', seed: 6, tier: 2 },
    ],
  },
  {
    nodeId: 'RF6.params',
    explore: {
      preset: { explorer: 'transformation', base: 'linear', a: 2, k: 3, sliders: ['a', 'k'], showInverse: true },
      predict: {
        question: '$f^{-1}(7) = 2$. Which must be true?',
        options: ['$f(2) = 7$', '$f(7) = 2$', '$f(2) = \\frac{1}{7}$', '$f(-2) = -7$'],
        answer: 0,
        tryIt: 'Find the point $(7, 2)$ on the inverse and its partner on $f$.',
      },
    },
    explain: [
      'A point $(p, q)$ on the inverse means $(q, p)$ is on $f$, so $f(q) = p$.',
      'Turn each inverse fact into an equation in the unknown parameters of $f$, then solve.',
      'Two unknowns need two points: swap both, then find slope and intercept (for a line) or substitute both (for other forms).',
    ],
    examples: [
      { generatorId: 'rf6-param-two-points', seed: 3, tier: 2 },
      { generatorId: 'rf6-param-quadratic', seed: 2, tier: 2 },
    ],
  },
  {
    nodeId: 'RF1.ops-eval',
    explore: {
      preset: { explorer: 'function-ops', f: 'line', g: 'parabola', op: '+' },
      predict: {
        question: 'If $f(2) = 3$ and $g(2) = -5$, what is $(f + g)(2)$?',
        options: ['$-2$', '$8$', '$-15$', '$4$'],
        answer: 0,
        tryIt: 'Drag the $x$ marker to $2$ and read all three graphs.',
      },
    },
    explain: [
      '$(f + g)(x) = f(x) + g(x)$. Likewise $f - g$, $f \\cdot g$ and $\\frac{f}{g}$ combine **outputs** at the same input.',
      'To evaluate at $x = a$: find $f(a)$ and $g(a)$ first, then combine. From a table, read the column for $a$; from graphs, read both $y$-values above $x = a$.',
      'The input never changes. $(f + g)(2)$ is not $f(2) + g(2) + 2$, and graphs combine $y$-values, never $x$-values.',
      'Watch order for $f - g$ and $\\frac{f}{g}$: $(g - f)(x)$ and $\\left(\\frac{g}{f}\\right)(x)$ are different functions.',
    ],
    examples: [
      { generatorId: 'rf1-eval-table', seed: 7, tier: 3 },
      { generatorId: 'rf1-eval-equations', seed: 2, tier: 3 },
    ],
  },
  {
    nodeId: 'RF1.ops-equation',
    explore: {
      preset: { explorer: 'function-ops', f: 'root', g: 'line', op: '/' },
      predict: {
        question: '$f(x) = \\sqrt{x}$ and $g(x) = x - 4$. Which value is **not** in the domain of $\\frac{f}{g}$?',
        options: ['$4$', '$0$', '$1$', '$9$'],
        answer: 0,
        tryIt: 'Switch to $f / g$ and look at the shaded domain.',
      },
    },
    explain: [
      'For $f + g$, $f - g$ and $f \\cdot g$, simplify by combining like terms. Use brackets for $f - g$ so the minus reaches every term of $g$.',
      '**Domain** of a sum, difference or product: where **both** $f$ and $g$ are defined (the overlap).',
      '**Domain** of $\\frac{f}{g}$: the overlap, minus every $x$ where $g(x) = 0$. Factor $g$ to find those values.',
      'Find restrictions **before** simplifying. Cancelling a factor can hide a non-permissible value, but the restriction still applies.',
      'State domains in interval or set-builder notation: $(-\\infty, 3) \\cup (3, \\infty)$ or $\\{x \\mid x \\ne 3, x \\in R\\}$.',
    ],
    examples: [
      { generatorId: 'rf1-quotient-domain', seed: 5, tier: 3 },
      { generatorId: 'rf1-ops-equation', seed: 3, tier: 3 },
    ],
  },
  {
    nodeId: 'RF1.ops-graph',
    explore: {
      preset: { explorer: 'function-ops', f: 'line', g: 'line2', op: '*' },
      predict: {
        question: 'Where are the zeros of $y = (f \\cdot g)(x)$?',
        options: ['At the zeros of $f$ and the zeros of $g$', 'Where $f$ and $g$ intersect', 'Only where both are zero at once', 'At $x = 0$'],
        answer: 0,
        tryIt: 'Switch to $f \\cdot g$ and compare its $x$-intercepts with those of $f$ and $g$.',
      },
    },
    explain: [
      'To sketch $f + g$ from graphs, add $y$-values at several $x$-values (zeros, intersections and integer points are easiest) and join them.',
      'Useful checks: where $f(x) = 0$, the sum equals $g(x)$. Where $f$ and $g$ intersect, the difference $f - g$ is zero.',
      '$f \\cdot g$ is zero wherever **either** factor is zero, and its sign is positive where $f$ and $g$ have the same sign.',
      'Sums and differences of lines are lines: add the slopes and the intercepts.',
    ],
    examples: [
      { generatorId: 'rf1-graph-sum-equation', seed: 4, tier: 2 },
      { generatorId: 'rf1-graph-product-zeros', seed: 2, tier: 2 },
    ],
  },
  {
    nodeId: 'RF1.compose-eval',
    explore: {
      preset: { explorer: 'function-ops', f: 'parabola', g: 'line', op: 'compose' },
      predict: {
        question: '$f(x) = x^2$ and $g(x) = x + 1$. What is $f(g(2))$?',
        options: ['$9$', '$5$', '$12$', '$6$'],
        answer: 0,
        tryIt: 'Use the composition view and follow the arrows from $x = 2$.',
      },
    },
    explain: [
      '$(f \\circ g)(x) = f(g(x))$: apply $g$ first, then feed its output into $f$. Work **inside out**.',
      '$f(g(2))$: find $g(2)$, then evaluate $f$ at that number.',
      'Order matters. $f(g(x))$ and $g(f(x))$ are usually different.',
      'A composition is not a product: $f(g(x)) \\ne f(x) \\cdot g(x)$.',
      'From a table or graph: look up $g(a)$, then find that value in the $x$ row (or on the $x$-axis) for $f$.',
    ],
    examples: [
      { generatorId: 'rf1-compose-table', seed: 3, tier: 2 },
      { generatorId: 'rf1-compose-graph', seed: 5, tier: 2 },
    ],
  },
  {
    nodeId: 'RF1.compose-equation',
    explore: {
      preset: { explorer: 'function-ops', f: 'root', g: 'shift', op: 'compose' },
      predict: {
        question: '$f(x) = \\sqrt{x}$ and $g(x) = x^2 - 3$. What is the domain of $g(f(x)) = x - 3$?',
        options: ['$[0, \\infty)$', 'All real numbers', '$[3, \\infty)$', '$[\\sqrt{3}, \\infty)$'],
        answer: 0,
        tryIt: 'Look at where the composed graph exists, not at its simplified formula.',
      },
    },
    explain: [
      'To write $f(g(x))$, replace every $x$ in $f$ with $(g(x))$ in brackets, then simplify.',
      'Example: $f(x) = x^2 + 1$, $g(x) = 2x - 3$: $f(g(x)) = (2x - 3)^2 + 1 = 4x^2 - 12x + 10$.',
      '**Domain** of $f(g(x))$: $x$ must be in the domain of $g$, **and** $g(x)$ must be in the domain of $f$.',
      'Simplifying can hide a restriction. $g(f(x)) = (\\sqrt{x})^2 - 3$ simplifies to $x - 3$, but its domain is still $x \\ge 0$.',
    ],
    examples: [
      { generatorId: 'rf1-compose-equation', seed: 2, tier: 3 },
      { generatorId: 'rf1-compose-domain', seed: 4, tier: 3 },
    ],
  },
  {
    nodeId: 'RF1.decompose',
    explore: {
      preset: { explorer: 'function-ops', f: 'root', g: 'line', op: 'compose' },
      predict: {
        question: '$h(x) = \\sqrt{3x - 1}$ is $f(g(x))$ with $f(x) = \\sqrt{x}$. What is $g(x)$?',
        options: ['$3x - 1$', '$\\sqrt{3x - 1}$', '$3\\sqrt{x} - 1$', '$x^2$'],
        answer: 0,
        tryIt: 'Compare the composed graph with $\\sqrt{x}$.',
      },
    },
    explain: [
      'Decomposing runs composition backwards. Ask: **what happens to $x$ first?** That is the inner function.',
      '$\\sqrt{3x - 1}$: first $3x - 1$, then the root. So the inner function is $3x - 1$ and the outer is $\\sqrt{x}$.',
      '$3\\sqrt{x} - 1$: first the root, then multiply and subtract. So the inner is $\\sqrt{x}$.',
      'For products and quotients of several functions, factor first, then match each factor to a given function.',
    ],
    examples: [
      { generatorId: 'rf1-decompose-three', seed: 3, tier: 3 },
      { generatorId: 'rf1-decompose-which', seed: 2, tier: 3 },
    ],
  },
];
