import type { Lesson } from './types';

/** Exam-readiness lessons: TI-84 Plus (non-CE) skills and diploma conventions. Explanations are ≤ 200 words. */
export const EXAM_LESSONS: Lesson[] = [
  {
    nodeId: 'CALC.mode-window',
    explain: [
      '**Window format** (on the formula sheet): $x{:}\\ [x_{\\min}, x_{\\max}, x_{\\text{scl}}]$, $y{:}\\ [y_{\\min}, y_{\\max}, y_{\\text{scl}}]$. The scale is the distance between tick marks.',
      'Set it with **[WINDOW]**. **[ZOOM] 6: ZStandard** gives $[-10, 10, 1]$ by $[-10, 10, 1]$; **[ZOOM] 7: ZTrig** suits radian trig graphs.',
      'A good window shows every key feature: all zeros, turning points, intercepts and asymptote behaviour. Estimate them first, then pad each side.',
      'Sinusoids: $x$ over one or two periods, ticks a quarter period apart; $y$ from below the minimum to above the maximum ($d \\pm |a|$).',
      'An exam question that gives a window expects you to use it: a feature outside it is not part of the answer.',
    ],
    examples: [
      { generatorId: 'calc-window-fit', seed: 1, tier: 2 },
      { generatorId: 'calc-window-read', seed: 2, tier: 2 },
    ],
  },
  {
    nodeId: 'CALC.mode',
    explain: [
      'The TI-84 Plus uses whatever angle mode is set. It never guesses from the question.',
      'Degree sign ($35^\\circ$, $0^\\circ \\le \\theta < 360^\\circ$): **DEGREE**. π in the domain, or a plain number ($\\cos 2.5$), or a model like $h(t) = 15\\sin\\left(\\frac{\\pi}{20}t\\right) + 17$: **RADIAN**.',
      'Check before every trig question: **[MODE]**, arrow to the RADIAN / DEGREE row, highlight, **[ENTER]**, then **[2nd] [MODE]** (QUIT).',
      'Typing π does not switch to radians. In degree mode $\\sin\\left(\\frac{2\\pi}{7}\\right)$ is $\\sin(0.898^\\circ) \\approx 0.016$, not $0.782$.',
      'Bracket fractions inside trig keys: $\\sin(2\\pi/7)$, not $\\sin(2\\pi)/7$.',
      'In exam configuration the calculator gives no exact trig values and does not simplify radicals: exact answers ($\\frac{\\sqrt{3}}{2}$, $\\frac{\\pi}{3}$) come from the unit circle by hand.',
    ],
    examples: [
      { generatorId: 'calc-mode-value', seed: 3, tier: 2 },
      { generatorId: 'calc-mode-which', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'CALC.intersect-zero',
    explain: [
      '**Zero**: graph $Y_1$, then **[2nd] [TRACE]** (CALC) **2: zero**. Move left of one crossing, **[ENTER]** (Left Bound), right of it **[ENTER]** (Right Bound), **[ENTER]** (Guess).',
      '**Intersect**: graph both sides as $Y_1$ and $Y_2$, then CALC **5: intersect**: **[ENTER]** first curve, **[ENTER]** second curve, move near the point, **[ENTER]** guess.',
      'The bounds must bracket exactly one crossing; repeat for each solution.',
      'Two methods for an equation: intersect the two sides, or move everything to one side and find the zeros of the related function. Both are accepted.',
      'Read X to the accuracy asked. Rounding happens only at the end.',
      'Check the window first: a solution off screen is easy to miss. A cubic can have three zeros; count them.',
    ],
    examples: [
      { generatorId: 'calc-zero', seed: 1, tier: 2 },
      { generatorId: 'calc-intersect', seed: 2, tier: 2 },
    ],
  },
  {
    nodeId: 'CALC.max-min',
    explain: [
      'CALC **3: minimum** and **4: maximum** find a turning point between a Left Bound and a Right Bound.',
      'The screen shows X and Y. A question asking for the **maximum value** wants Y; for the **location**, X; for the **point**, both.',
      'These find **local** extremes in the bracket. For the range of an even-degree polynomial, check every peak (or valley) and take the highest (or lowest).',
      'Values like X = 1.9999987 come from the numerical method: round as asked ($2.00$).',
      'Applications (maximum area, volume, profit): restrict the window to the domain that makes sense, then find the maximum there.',
    ],
    examples: [
      { generatorId: 'calc-max', seed: 1, tier: 2 },
      { generatorId: 'calc-range', seed: 2, tier: 3 },
    ],
  },
  {
    nodeId: 'CALC.table',
    explain: [
      '**[2nd] [WINDOW]** (TBLSET): **TblStart** is the first $x$; **ΔTbl** is the step. Indpnt and Depend on Auto.',
      '**[2nd] [GRAPH]** (TABLE) lists $x$ and $Y_1$. Scroll with the arrows; select a cell to see more digits at the bottom.',
      'A sign change in $Y_1$ between consecutive rows locates a zero between them. Then use CALC zero for the value.',
      'Tables check answers fast: substitute a solution and confirm $Y_1 = Y_2$.',
      'Exponential models: put $t$ as X, e.g. $Y_1 = 200(1.05)^X$, and read the year you need.',
    ],
    examples: [
      { generatorId: 'calc-table-value', seed: 1, tier: 2 },
      { generatorId: 'calc-table-sign', seed: 2, tier: 2 },
    ],
  },
  {
    nodeId: 'EXAM.nr-recording',
    explain: [
      'Numerical response is machine scored, one mark each. Write the answer in the boxes and fill the circles.',
      '**Left-justify**: first digit in the left-hand box; unused boxes on the right stay blank. The decimal point takes a box.',
      '**Leading zero**: a value between 0 and 1 is recorded $0.25$, never $.25$.',
      '**Rounding**: to the nearest tenth or hundredth as the question says; keep all decimals until the final answer. If the answer cannot be a decimal, give a whole number.',
      '**Negative answers**: the minus sign is printed before the boxes. Record only the digits.',
      '**Codes**: when you record item numbers, "in any order" accepts $134$ or $431$; "in the order" accepts only the order asked (e.g. $4123$). Multi-part answers go one digit per column, in the order stated.',
      'If several answers are correct, one is enough.',
    ],
    examples: [
      { generatorId: 'nr-record-value', seed: 2, tier: 3 },
      { generatorId: 'nr-code-order', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'EXAM.directing-words',
    explain: [
      'Bolded directing words in written response have fixed definitions. Do exactly the task named.',
      '**Algebraically**: show algebraic steps; a graph only checks. **Determine**: show formulas or procedures and give the accuracy asked. **Evaluate**: give the value.',
      '**Verify**: substitute the given case into each side separately and show both equal. **Prove**: a general argument for all permissible values; one side transformed into the other. A verification never proves.',
      '**Explain**: give the reason ("because…"), using the mathematics. **Justify**: support a conclusion with a mathematical argument or a counterexample.',
      '**Compare**: characteristics of both, with similarities and differences. **Describe**: words with values (factor, axis, direction, distance).',
      '**Sketch**: scaled axes and every key feature. **Solve**: every solution in the domain, extraneous ones rejected.',
      'The Directing Words trainer in Exam has the full official list with sample answers.',
    ],
    examples: [
      { generatorId: 'dw-meets', seed: 1, tier: 2 },
      { generatorId: 'dw-definition', seed: 2, tier: 2 },
    ],
  },
  {
    nodeId: 'EXAM.wr-hygiene',
    explain: [
      'Markers score what is written. These slips cost the last mark of a part.',
      '**Equation vs expression**: "the equation of the function" means $y = 2(x - 3)^2 + 1$, not $2(x - 3)^2 + 1$.',
      '**Units** on every contextual answer: $23.4$ m, $7.8$ years.',
      '**Brackets**: $(-3)^2 = 9$ but $-3^2 = -9$; $\\log(x + 2) \\ne \\log x + 2$; $(-1)^k$ in a general term.',
      '**Trig arguments**: write $\\sin\\theta$, never $\\sin$ alone.',
      '**Exact vs approximate**: exact means fractions, radicals, π or logs, no decimals; "to the nearest hundredth" means a rounded decimal.',
      '**Domain and range**: interval or set-builder notation are both accepted; $I$ and $Z$ both name the integers.',
      'Show pertinent ideas, calculations and formulas; an attempt can earn partial marks, so always write something.',
    ],
    examples: [
      { generatorId: 'wr-hygiene-brackets', seed: 1, tier: 2 },
      { generatorId: 'wr-hygiene-brackets', seed: 6, tier: 3 },
    ],
  },
  {
    nodeId: 'EXAM.sketch-standard',
    explain: [
      'A full-mark sketch shows **scaled axes** and every **key feature**, labelled with coordinates or equations.',
      'Polynomials: zeros (crossing or touching by multiplicity), $y$-intercept, end behaviour.',
      'Rational: dashed asymptotes with equations, intercepts, and holes as open circles at exact coordinates.',
      'Exponential and log: the asymptote, the intercepts, one more labelled point.',
      'Radical: the endpoint (closed dot) and the direction.',
      'Sinusoids: maximum, minimum, midline and the period, with $x$-ticks a quarter period apart (in radians when the domain uses π), and both endpoints of the stated domain.',
      'Draw curves smoothly, approach asymptotes without crossing a vertical one, and stop at domain endpoints.',
    ],
    examples: [
      { generatorId: 'sketch-hole', seed: 1, tier: 2 },
      { generatorId: 'sketch-axes', seed: 2, tier: 2 },
    ],
  },
];
