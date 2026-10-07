import type { Lesson } from './types';

/** Unit 4 (trigonometry) lessons. Explanations are ≤ 200 words; examples are generator items revealed step by step. */
export const U4_LESSONS: Lesson[] = [
  {
    nodeId: 'T1.radians',
    explore: {
      preset: { explorer: 'unit-circle', angle: 60, show: ['arc'] },
      predict: {
        question: 'On a circle of radius 1, how long is the arc cut off by one full turn?',
        options: ['$2\\pi \\approx 6.28$', '$360$', '$\\pi \\approx 3.14$', '$1$'],
        answer: 0,
        tryIt: 'Set $r = 1$ and drag the arm almost all the way around. Watch $a$.',
      },
    },
    explain: [
      'An angle of **1 radian** cuts off an arc equal to the radius. In general $\\theta = \\frac{a}{r}$, a ratio of lengths, so radians have no unit symbol.',
      'A full turn is an arc of $2\\pi r$, so $360^\\circ = 2\\pi$ and $180^\\circ = \\pi$.',
      'Degrees to radians: multiply by $\\frac{\\pi}{180^\\circ}$. $150^\\circ = \\frac{150\\pi}{180} = \\frac{5\\pi}{6}$.',
      'Radians to degrees: multiply by $\\frac{180^\\circ}{\\pi}$, or replace $\\pi$ with $180^\\circ$. $\\frac{7\\pi}{4}$ $= \\frac{7(180^\\circ)}{4}$ $= 315^\\circ$.',
      'Learn the anchors: $\\frac{\\pi}{6} = 30^\\circ$, $\\frac{\\pi}{4} = 45^\\circ$, $\\frac{\\pi}{3} = 60^\\circ$, $\\frac{\\pi}{2} = 90^\\circ$. Every special angle is a multiple of one of these.',
      'A radian measure without $\\pi$ is still valid: $2.5$ radians $\\approx 143.2^\\circ$. One radian is about $57.3^\\circ$.',
    ],
    examples: [
      { generatorId: 'u4-rad-to-rad', seed: 3, tier: 2 },
      { generatorId: 'u4-rad-to-rad', seed: 5, tier: 3 },
    ],
  },
  {
    nodeId: 'T1.coterminal',
    explore: {
      preset: { explorer: 'unit-circle', angle: 30, show: ['coterminal'] },
      predict: {
        question: 'Which angle has the same terminal arm as $30^\\circ$?',
        options: ['$-330^\\circ$', '$210^\\circ$', '$-30^\\circ$', '$150^\\circ$'],
        answer: 0,
        tryIt: 'Press − 360° and compare the arm.',
      },
    },
    explain: [
      'Angles in **standard position** start on the positive $x$-axis; counterclockwise is positive, clockwise negative.',
      '**Coterminal** angles share a terminal arm. They differ by whole turns: $\\theta + 360^\\circ n$ or $\\theta + 2\\pi n$, $n \\in I$.',
      'Adding $180^\\circ$ gives the opposite arm, not a coterminal one.',
      'To list coterminal angles in a domain, add and subtract $360^\\circ$ (or $2\\pi$) until you leave the domain. For $\\frac{\\pi}{3}$ in $-2\\pi \\le \\theta \\le 2\\pi$: $-\\frac{5\\pi}{3}$ and $\\frac{\\pi}{3}$.',
      'To find the coterminal angle in $[0^\\circ, 360^\\circ)$, add or subtract $360^\\circ$ until it lands there: $-510^\\circ + 720^\\circ = 210^\\circ$.',
      'The **general form** $\\theta = 210^\\circ + 360^\\circ n$, $n \\in I$, names every coterminal angle at once.',
    ],
    examples: [
      { generatorId: 'u4-cot-domain', seed: 2, tier: 2 },
      { generatorId: 'u4-cot-general', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'T1.reference',
    explore: {
      preset: { explorer: 'unit-circle', angle: 150 },
      predict: {
        question: 'What is the reference angle of $150^\\circ$?',
        options: ['$30^\\circ$', '$60^\\circ$', '$150^\\circ$', '$210^\\circ$'],
        answer: 0,
        tryIt: 'Read the reference angle under the circle; the green leg shows the triangle it lives in.',
      },
    },
    explain: [
      'The **reference angle** is the acute angle between the terminal arm and the $x$-axis. It is always between $0^\\circ$ and $90^\\circ$ and positive.',
      'Quadrant I: $\\theta$. II: $180^\\circ - \\theta$. III: $\\theta - 180^\\circ$. IV: $360^\\circ - \\theta$. In radians, replace $180^\\circ$ with $\\pi$.',
      'For angles outside $[0^\\circ, 360^\\circ)$, first find the coterminal angle in that range.',
      'Going backwards: the angles with reference angle $\\frac{\\pi}{4}$ in $[0, 2\\pi)$ are $\\frac{\\pi}{4}, \\frac{3\\pi}{4}, \\frac{5\\pi}{4}, \\frac{7\\pi}{4}$: one per quadrant.',
      'Reference angles matter because a trig ratio at $\\theta$ equals the ratio at its reference angle, up to sign. The sign comes from the quadrant.',
    ],
    examples: [
      { generatorId: 'u4-ref-rad', seed: 2, tier: 2 },
      { generatorId: 'u4-ref-angles-with', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T1.arc-length',
    explore: {
      preset: { explorer: 'unit-circle', angle: 90, show: ['arc'] },
      predict: {
        question: 'Double the radius, keep the angle. What happens to the arc length?',
        options: ['It doubles', 'It stays the same', 'It quadruples', 'It halves'],
        answer: 0,
        tryIt: 'Hold the arm at $90^\\circ$ and change $r$ from 3 to 6.',
      },
    },
    explain: [
      '$$a = r\\theta \\qquad (\\theta \\text{ in radians})$$',
      'The formula is the definition of a radian rearranged. With $\\theta$ in degrees it is wrong: convert first.',
      'Units: $a$ and $r$ share a length unit. If $r$ is in cm, so is $a$.',
      'Rearranged: $\\theta = \\frac{a}{r}$ and $r = \\frac{a}{\\theta}$.',
      'Multi-step problems usually hide the angle. A wheel turning $n$ times sweeps $2\\pi n$ radians, so a point on the rim travels $2\\pi r n$. A pendulum swinging through $40^\\circ$ sweeps $\\frac{2\\pi}{9}$ radians.',
      'Round only at the end. Keep $\\pi$ exact through the work, then evaluate.',
    ],
    examples: [
      { generatorId: 'u4-arc-length', seed: 2, tier: 2 },
      { generatorId: 'u4-arc-context', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'T2.unit-circle-eq',
    explore: {
      preset: { explorer: 'unit-circle', angle: 40, show: [] },
      predict: {
        question: 'For any point $(x, y)$ on the unit circle, what is $x^2 + y^2$?',
        options: ['$1$', '$x + y$', 'It depends on the angle', '$2$'],
        answer: 0,
        tryIt: 'Turn snapping off, drag anywhere, and square the coordinates.',
      },
    },
    explain: [
      'The **unit circle** is centred at the origin with radius 1: $x^2 + y^2 = 1$.',
      'The terminal arm of $\\theta$ meets it at $P(\\theta) = (\\cos\\theta, \\sin\\theta)$: the $x$-coordinate is cosine, the $y$-coordinate is sine.',
      'Missing coordinate: substitute and solve, then pick the sign from the quadrant. $P\\left(\\frac{1}{3}, y\\right)$ in quadrant IV gives $y^2 = \\frac{8}{9}$, so $y = -\\frac{2\\sqrt{2}}{3}$.',
      'Symmetry: reflecting $P(\\theta) = (a, b)$ in the $y$-axis gives $(-a, b) = P(\\pi - \\theta)$; in the $x$-axis, $(a, -b) = P(-\\theta)$; through the origin, $(-a, -b) = P(\\theta + \\pi)$.',
      'Since $\\cos^2\\theta + \\sin^2\\theta = 1$ for every angle, this equation is the first Pythagorean identity.',
    ],
    examples: [
      { generatorId: 'u4-uc-missing', seed: 2, tier: 2 },
      { generatorId: 'u4-uc-missing', seed: 4, tier: 3 },
    ],
  },
  {
    nodeId: 'T2.special-points',
    explore: {
      preset: { explorer: 'unit-circle', angle: 30, show: [] },
      predict: {
        question: 'What are the coordinates of $P\\left(\\frac{5\\pi}{6}\\right)$?',
        options: ['$\\left(-\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$', '$\\left(\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$', '$\\left(-\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$', '$\\left(\\frac{1}{2}, -\\frac{\\sqrt{3}}{2}\\right)$'],
        answer: 0,
        tryIt: 'Drag to $150^\\circ$ and compare with $30^\\circ$.',
      },
    },
    explain: [
      'Three reference triangles give every special point:',
      '$\\frac{\\pi}{6}$: $\\left(\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$. $\\frac{\\pi}{4}$: $\\left(\\frac{\\sqrt{2}}{2}, \\frac{\\sqrt{2}}{2}\\right)$. $\\frac{\\pi}{3}$: $\\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$.',
      'Axis points: $P(0) = (1, 0)$, $P\\left(\\frac{\\pi}{2}\\right) = (0, 1)$, $P(\\pi) = (-1, 0)$, $P\\left(\\frac{3\\pi}{2}\\right) = (0, -1)$.',
      'For any special angle: find the reference angle, copy its coordinates, then attach signs from the quadrant: II $(-, +)$, III $(-, -)$, IV $(+, -)$.',
      'Check: the larger coordinate goes with the axis the arm is closer to. Near the $x$-axis ($\\frac{\\pi}{6}$ family), $|x| = \\frac{\\sqrt{3}}{2}$.',
      'Going backwards, $\\left(-\\frac{\\sqrt{2}}{2}, -\\frac{\\sqrt{2}}{2}\\right)$ is $\\frac{5\\pi}{4}$: reference $\\frac{\\pi}{4}$, quadrant III.',
    ],
    examples: [
      { generatorId: 'u4-sp-coord', seed: 3, tier: 2 },
      { generatorId: 'u4-sp-angle', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T3.exact-ratios',
    explore: {
      preset: { explorer: 'unit-circle', angle: 120, show: ['ratios'] },
      predict: {
        question: 'What is $\\sec\\frac{2\\pi}{3}$?',
        options: ['$-2$', '$-\\frac{1}{2}$', '$2$', '$\\frac{2\\sqrt{3}}{3}$'],
        answer: 0,
        tryIt: 'Drag to $120^\\circ$ and read $\\cos\\theta$ and $\\sec\\theta$.',
      },
    },
    explain: [
      'On the unit circle: $\\sin\\theta = y$, $\\cos\\theta = x$, $\\tan\\theta = \\frac{y}{x}$.',
      'Reciprocals: $\\csc\\theta = \\frac{1}{\\sin\\theta}$, $\\sec\\theta = \\frac{1}{\\cos\\theta}$, $\\cot\\theta = \\frac{1}{\\tan\\theta} = \\frac{x}{y}$. They are not inverses: $\\csc\\theta \\ne \\sin^{-1}\\theta$.',
      'Exact value method: reference angle, special-triangle ratio, sign from **CAST** (quadrant I all positive, II sine, III tangent, IV cosine). Reciprocals share the sign of their partner.',
      'A ratio is **not defined** when its denominator is 0: $\\tan$ and $\\sec$ at $\\frac{\\pi}{2} + \\pi n$; $\\cot$ and $\\csc$ at $\\pi n$.',
      'Rationalize: $\\frac{1}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}$, $\\frac{2}{\\sqrt{3}} = \\frac{2\\sqrt{3}}{3}$.',
      'Expressions: evaluate each ratio exactly, then simplify. $\\sin^2\\frac{\\pi}{3}$ $= \\left(\\frac{\\sqrt{3}}{2}\\right)^2$ $= \\frac{3}{4}$.',
    ],
    examples: [
      { generatorId: 'u4-ex-value', seed: 2, tier: 3 },
      { generatorId: 'u4-ex-expr', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T3.ratio-from-point',
    explain: [
      'For a point $(x, y)$ on the terminal arm, not necessarily on the unit circle, let $r = \\sqrt{x^2 + y^2}$ (always positive). Then',
      '$$\\sin\\theta = \\frac{y}{r},\\quad \\cos\\theta = \\frac{x}{r},\\quad \\tan\\theta = \\frac{y}{x}$$',
      'and the reciprocals flip each fraction. The signs of $x$ and $y$ carry the quadrant; never put a sign on $r$.',
      'From one ratio and a quadrant: sketch the triangle. $\\tan\\theta = -\\frac{5}{12}$ in quadrant II means $x = -12$, $y = 5$, so $r = 13$ and $\\cos\\theta = -\\frac{12}{13}$.',
      'When the ratio comes from a sine or cosine, the given numerator and $r$ fix two sides; find the third with $x^2 + y^2 = r^2$ and give it the quadrant sign.',
      'Simplify radicals and rationalize: $\\frac{1}{\\sqrt{5}} = \\frac{\\sqrt{5}}{5}$.',
    ],
    examples: [
      { generatorId: 'u4-rp-point', seed: 2, tier: 3 },
      { generatorId: 'u4-rp-given', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T3.angle-from-ratio',
    explain: [
      'To solve $\\sin\\theta = k$ (or any ratio) for angles:',
      '1. **Reference angle** from the positive value: exact if $|k|$ is special, otherwise $\\sin^{-1}|k|$ on the calculator.',
      '2. **Quadrants** from CAST and the sign of $k$: two quadrants per full turn.',
      '3. **Place** the reference angle in each quadrant: II $\\pi - \\alpha$, III $\\pi + \\alpha$, IV $2\\pi - \\alpha$.',
      'The calculator returns only one angle, and for negative $k$ it is outside $[0, 2\\pi)$. Always build answers from the reference angle.',
      'Reciprocal ratios: $\\csc\\theta = -2$ means $\\sin\\theta = -\\frac{1}{2}$: reference $\\frac{\\pi}{6}$, quadrants III and IV, so $\\frac{7\\pi}{6}$ and $\\frac{11\\pi}{6}$.',
      'Mode matters: degree mode for degree answers, radian mode for radians.',
    ],
    examples: [
      { generatorId: 'u4-afr-exact', seed: 2, tier: 2 },
      { generatorId: 'u4-afr-approx', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T4.basic-graphs',
    explore: {
      preset: { explorer: 'sinusoid', f: 'sin', tan: true },
      predict: {
        question: 'Where are the vertical asymptotes of $y = \\tan x$?',
        options: ['$x = 90^\\circ + 180^\\circ n$', '$x = 180^\\circ n$', '$x = 90^\\circ + 360^\\circ n$', 'There are none'],
        answer: 0,
        tryIt: 'Choose tan and read where the curve breaks.',
      },
    },
    explain: [
      '$y = \\sin x$: period $2\\pi$, range $[-1, 1]$, zeros at $\\pi n$, maximum 1 at $\\frac{\\pi}{2}$, passes through the origin.',
      '$y = \\cos x$: period $2\\pi$, range $[-1, 1]$, zeros at $\\frac{\\pi}{2} + \\pi n$, $y$-intercept 1. It is $\\sin x$ shifted left $\\frac{\\pi}{2}$.',
      'Both are the unit-circle coordinates unrolled: the graph records $y$ (or $x$) as the arm turns.',
      '$y = \\tan x = \\frac{\\sin x}{\\cos x}$: period $\\pi$, zeros where $\\sin x = 0$ ($\\pi n$), vertical asymptotes where $\\cos x = 0$ ($x = \\frac{\\pi}{2} + \\pi n$). Domain excludes the asymptotes; range is all real numbers; no amplitude.',
      'Sketch on scaled axes: one cycle split into four equal parts gives the five key points (zeros, max, min).',
      'Transformations of tangent and graphs of the reciprocal functions are beyond this course.',
    ],
    examples: [
      { generatorId: 'u4-bg-feature', seed: 2, tier: 3 },
      { generatorId: 'u4-bg-list', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T4.parameters',
    explore: {
      preset: { explorer: 'sinusoid', f: 'sin' },
      predict: {
        question: 'In $y = \\sin bx$, what happens to the period when $b$ changes from 1 to 2?',
        options: ['It halves', 'It doubles', 'It stays $2\\pi$', 'It becomes 2'],
        answer: 0,
        tryIt: 'Move $b$ from 1 to 2 and watch the violet period bar.',
      },
    },
    explain: [
      '$$y = a\\sin[b(x - c)] + d \\quad\\text{or}\\quad y = a\\cos[b(x - c)] + d$$',
      '**Amplitude** $|a|$: midline to maximum. $a < 0$ reflects in the $x$-axis.',
      '**Period** $\\frac{2\\pi}{|b|}$ (or $\\frac{360^\\circ}{|b|}$). $b$ is the number of cycles in $2\\pi$, not the period.',
      '**Phase shift** $c$: $x - \\frac{\\pi}{4}$ shifts right $\\frac{\\pi}{4}$; $x + \\frac{\\pi}{4}$ shifts left.',
      '**Midline** $y = d$. Maximum $d + |a|$, minimum $d - |a|$; range $d - |a| \\le y \\le d + |a|$.',
      'Reading order that avoids errors: $d$ and $|a|$ from the vertical features, then the period from $b$, then the shift.',
      'Writing an equation from features reverses this: $b = \\frac{2\\pi}{\\text{period}}$.',
    ],
    examples: [
      { generatorId: 'u4-par-read', seed: 2, tier: 3 },
      { generatorId: 'u4-par-build', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T4.factor-b',
    explore: {
      preset: { explorer: 'sinusoid', f: 'sin', unfactored: true },
      predict: {
        question: 'What is the phase shift of $y = \\sin(2x - 60^\\circ)$?',
        options: ['$30^\\circ$ right', '$60^\\circ$ right', '$120^\\circ$ right', '$30^\\circ$ left'],
        answer: 0,
        tryIt: 'Set $b = 2$, then find the $c$ that makes the readout show $2x - 60^\\circ$.',
      },
    },
    explain: [
      'The phase shift is read from $b(x - c)$, not from $bx - k$.',
      'Factor $b$ out of the argument: $\\sin(2x - 60^\\circ) = \\sin[2(x - 30^\\circ)]$. The shift is $30^\\circ$ right.',
      'In general $bx - k = b\\left(x - \\frac{k}{b}\\right)$, so the shift is $\\frac{k}{b}$.',
      'Signs: $\\cos\\left(3x + \\frac{\\pi}{2}\\right)$ $= \\cos\\left[3\\left(x + \\frac{\\pi}{6}\\right)\\right]$: shift $\\frac{\\pi}{6}$ left.',
      'Check by expanding your factored form; it must reproduce the original bracket.',
      'Period and amplitude are unaffected by factoring: period is still $\\frac{2\\pi}{|b|}$.',
    ],
    examples: [
      { generatorId: 'u4-fb-phase', seed: 2, tier: 2 },
      { generatorId: 'u4-fb-rewrite', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T4.sketch',
    explore: {
      preset: { explorer: 'sinusoid', f: 'cos' },
      predict: {
        question: 'For $y = \\cos 2x$, how far apart are the five key points of one cycle?',
        options: ['$45^\\circ$', '$90^\\circ$', '$180^\\circ$', '$30^\\circ$'],
        answer: 0,
        tryIt: 'Set $b = 2$ and measure the gap between a maximum and the next midline crossing.',
      },
    },
    explain: [
      'A full-mark sketch has scaled axes with labels and every key feature: maxima, minima, midline, and intercepts in the domain.',
      'Method:',
      '1. Draw the midline $y = d$ and the lines $y = d \\pm |a|$.',
      '2. Find the period and divide it into quarters: that is the $x$-grid spacing.',
      '3. Start one cycle at the phase shift $c$. Sine: midline, max, midline, min, midline. Cosine: max, midline, min, midline, max. If $a < 0$, swap max and min.',
      '4. Repeat the cycle across the domain, then join with a smooth curve, not straight segments.',
      'Count cycles in a domain as $\\frac{\\text{domain length}}{\\text{period}}$.',
    ],
    examples: [
      { generatorId: 'u4-sk-max', seed: 2, tier: 2 },
      { generatorId: 'u4-sk-scale', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T4.equation-from-graph',
    explore: {
      preset: { explorer: 'sinusoid', mode: 'match' },
      predict: {
        question: 'A sinusoid has maximum 7 and minimum $-1$. What is its midline?',
        options: ['$y = 3$', '$y = 4$', '$y = 7$', '$y = 0$'],
        answer: 0,
        tryIt: 'Match a few graphs: set $d$ and $a$ first from the max and min.',
      },
    },
    explain: [
      'From a graph or a max and min:',
      '$$a = \\frac{\\max - \\min}{2},\\qquad d = \\frac{\\max + \\min}{2}$$',
      '**Period**: maximum to next maximum, or twice the gap from a maximum to the next minimum. Then $b = \\frac{2\\pi}{\\text{period}}$.',
      '**Phase shift**: for cosine, a maximum $x$-value; for sine, a point where the curve crosses the midline going up. Choose the one nearest the origin.',
      'Many equations describe the same graph: $c$ can move by whole periods, and a sine form can be rewritten as a cosine form. Any correct one earns the mark.',
      'Check one more point from the graph in your equation.',
    ],
    examples: [
      { generatorId: 'u4-efg-params', seed: 2, tier: 2 },
      { generatorId: 'u4-efg-data', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T4.model',
    explore: {
      preset: { explorer: 'sinusoid', mode: 'model' },
      predict: {
        question: 'A Ferris wheel has diameter 40 m and its lowest seat is 2 m up. What is the midline height?',
        options: ['22 m', '20 m', '42 m', '21 m'],
        answer: 0,
        tryIt: 'Set D = 40 and p = 2 in the Ferris wheel builder.',
      },
    },
    explain: [
      'Build the model from the context:',
      'Amplitude: half the max-to-min change (the radius of a wheel). Midline: halfway between max and min (axle height). Period: time for one cycle. $b = \\frac{2\\pi}{\\text{period}}$.',
      'Starting point picks the function: at the bottom, use $-\\cos$; at the top, $\\cos$; on the midline going up, $\\sin$.',
      'Ferris wheel, diameter 30 m, lowest seat 2 m, one turn per 4 min, boarding at the bottom: $h(t) = -15\\cos\\left(\\frac{\\pi}{2}t\\right) + 17$.',
      'Questions: evaluate at a time (radian mode), or solve $h(t) = k$ by graphing $Y_1 = h$ and $Y_2 = k$ and finding intersections. A duration is the gap between two intersections.',
      'Give units, and round only the final answer.',
    ],
    examples: [
      { generatorId: 'u4-mod-ferris', seed: 2, tier: 3 },
      { generatorId: 'u4-mod-tide', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'T5.first-degree',
    explore: {
      preset: { explorer: 'trig-equation', fn: 'sin', k: 0.5 },
      predict: {
        question: 'How many solutions does $\\sin x = \\frac{1}{2}$ have for $0^\\circ \\le x < 720^\\circ$?',
        options: ['4', '2', '1', '3'],
        answer: 0,
        tryIt: 'Pick the 0° to 720° domain and count the orange points.',
      },
    },
    explain: [
      'Isolate the trig function, then solve like an angle-from-ratio question.',
      '$2\\cos x + \\sqrt{3}$ $= 0 \\Rightarrow \\cos x$ $= -\\frac{\\sqrt{3}}{2}$. Reference $\\frac{\\pi}{6}$; cosine is negative in II and III: $x = \\frac{5\\pi}{6}, \\frac{7\\pi}{6}$.',
      'Every full turn in the domain adds another pair (tangent: one per half turn). Check endpoints: $\\le$ includes them.',
      'If the isolated value is outside $[-1, 1]$ for sine or cosine, there is no solution.',
      'Non-special values: reference angle from $\\sin^{-1}$, $\\cos^{-1}$ or $\\tan^{-1}$ of the positive value, then place it with CAST. Round at the end, in the requested unit.',
      'Common losses: stopping at the calculator angle, wrong mode, and solutions outside the domain.',
    ],
    examples: [
      { generatorId: 'u4-fd-exact', seed: 2, tier: 2 },
      { generatorId: 'u4-fd-approx', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T5.general',
    explore: {
      preset: { explorer: 'trig-equation', fn: 'tan', k: 1 },
      predict: {
        question: 'What period goes in the general solution of $\\tan x = 1$?',
        options: ['$\\pi$ ($180^\\circ$)', '$2\\pi$ ($360^\\circ$)', '$\\frac{\\pi}{2}$', '$4\\pi$'],
        answer: 0,
        tryIt: 'Read the general solution under the graph, then switch to sin.',
      },
    },
    explain: [
      'The **general solution** lists every solution: solve over one period, then add the period times $n$, $n \\in I$.',
      'Sine, cosine and their reciprocals: period $2\\pi$. $\\sin x = \\frac{\\sqrt{2}}{2}$: $x = \\frac{\\pi}{4} + 2\\pi n,\\ x$ $= \\frac{3\\pi}{4} + 2\\pi n$.',
      'Tangent and cotangent: period $\\pi$. $\\tan x = -1$: $x = \\frac{3\\pi}{4} + \\pi n$.',
      'When two solutions are exactly half a period apart, one term covers both: $\\sin x = 0$ gives $x = \\pi n$; $\\cos x = 0$ gives $x = \\frac{\\pi}{2} + \\pi n$.',
      'To list solutions in a domain from a general solution, substitute $n = 0, \\pm 1, \\pm 2, \\ldots$ and keep the values inside.',
      'In degrees, use $360^\\circ n$ and $180^\\circ n$.',
    ],
    examples: [
      { generatorId: 'u4-gen-write', seed: 2, tier: 2 },
      { generatorId: 'u4-gen-list', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T5.second-degree',
    explore: {
      preset: { explorer: 'trig-equation', fn: 'sin', k: 0.5, k2: -1 },
      predict: {
        question: 'How many solutions does $(2\\sin x - 1)(\\sin x + 1) = 0$ have for $0 \\le x < 2\\pi$?',
        options: ['3', '4', '2', '1'],
        answer: 0,
        tryIt: 'Two horizontal lines: $k = \\frac{1}{2}$ and $k_2 = -1$. Count the orange points.',
      },
    },
    explain: [
      'Treat the trig function as the variable. $2\\sin^2 x - \\sin x - 1 = 0$ is $2u^2 - u - 1 = 0$ with $u = \\sin x$.',
      'Factor: $(2\\sin x + 1)(\\sin x - 1) = 0$, so $\\sin x = -\\frac{1}{2}$ or $\\sin x = 1$. Solve each, then combine.',
      'Reject factors outside the range: $\\cos x = 2$ has no solution.',
      'Common factors: $2\\sin x\\cos x = \\cos x$. **Do not divide by $\\cos x$**; that loses $\\cos x = 0$. Move terms to one side and factor: $\\cos x(2\\sin x - 1) = 0$.',
      'Difference of squares works too: $\\tan^2 x - 3 = 0 \\Rightarrow \\tan x = \\pm\\sqrt{3}$.',
      'If a factor needs the calculator, give rounded values; the exact factor stays exact.',
    ],
    examples: [
      { generatorId: 'u4-sd-factor', seed: 2, tier: 2 },
      { generatorId: 'u4-sd-approx', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T5.graphical',
    explore: {
      preset: { explorer: 'trig-equation', fn: 'cos', k: 0.3 },
      predict: {
        question: 'With $k = 0.3$, are the solutions of $\\cos x = 0.3$ exact or rounded?',
        options: ['Rounded: 0.3 is not a special value', 'Exact', 'There are none', 'Exact in radians only'],
        answer: 0,
        tryIt: 'Compare $k = 0.3$ with $k = \\frac{1}{2}$ and read the note under the graph.',
      },
    },
    explain: [
      'On the TI-84 Plus: set **MODE** to match the domain (degree or radian).',
      'Enter each side: $Y_1 =$ left side, $Y_2 =$ right side. Or move everything to one side and find zeros.',
      '**WINDOW**: $x$ from the domain start to its end ($0$ to $360$, or $0$ to $2\\pi$); $y$ wide enough to show both graphs fully, for example a little beyond $d - |a|$ and $d + |a|$.',
      '**2nd TRACE**, intersect (or zero), once per crossing. Move the cursor near each crossing before pressing ENTER; set bounds that bracket a zero.',
      'Count crossings first so you know how many answers to find. Each cycle of a sinusoid crosses a horizontal line between its max and min twice.',
      'Round as asked. Do not list values outside the domain.',
    ],
    examples: [
      { generatorId: 'u4-gr-intersect', seed: 2, tier: 2 },
      { generatorId: 'u4-gr-count', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T6.identity-vs-equation',
    explore: {
      preset: { explorer: 'identity', problem: 'i1' },
      predict: {
        question: 'Both sides of $\\tan x\\cos x = \\sin x$ agree at $x = 0.7$. What does that show?',
        options: ['It holds at 0.7 only; that is a verification', 'The identity is proven', 'It is an equation', 'Nothing'],
        answer: 0,
        tryIt: 'Press Test a value a few times, then prove it with the moves.',
      },
    },
    explain: [
      'An **identity** holds for every permissible value: $\\tan x\\cos x = \\sin x$. An **equation** holds only for particular values: $\\sin x = \\frac{1}{2}$.',
      '**Verify** means check: substitute a value (or compare graphs) and show both sides agree. It can show an equation is not an identity, with one counterexample, but it cannot prove one.',
      '**Prove** means show for all permissible values, using known identities on each side separately.',
      'Directing words matter on the diploma: "verify for $x = \\frac{\\pi}{6}$" wants a numerical check; "prove" wants an algebraic argument.',
      'When verifying, compute each side on its own and write both results.',
    ],
    examples: [
      { generatorId: 'u4-ive-verify', seed: 2, tier: 2 },
      { generatorId: 'u4-ive-verify', seed: 4, tier: 1 },
    ],
  },
  {
    nodeId: 'T6.npv',
    explore: {
      preset: { explorer: 'identity', problem: 'i6' },
      predict: {
        question: 'Which values are non-permissible for $\\tan x + \\cot x$ on $[0, 2\\pi)$?',
        options: ['$0, \\frac{\\pi}{2}, \\pi, \\frac{3\\pi}{2}$', '$\\frac{\\pi}{2}, \\frac{3\\pi}{2}$', '$0, \\pi$', 'None'],
        answer: 0,
        tryIt: 'Type your answer in the restrictions box and check it.',
      },
    },
    explain: [
      'A value is **non-permissible** if any part of the expression is not defined there.',
      'Two sources: a denominator equal to 0, and the hidden denominators in $\\tan$ and $\\sec$ ($\\cos x \\ne 0$) and in $\\cot$ and $\\csc$ ($\\sin x \\ne 0$).',
      '$\\frac{\\tan x}{\\sin x}$: $\\sin x \\ne 0$ gives $x \\ne \\pi n$; $\\tan x$ gives $x \\ne \\frac{\\pi}{2} + \\pi n$. Combined: $x \\ne \\frac{\\pi}{2}n$.',
      'Solve each restriction like an equation, then state the NPVs over the domain or in general form.',
      'State the restrictions of the original expression before simplifying. Simplifying can hide them: $\\frac{\\sin x}{\\sin x} = 1$ still excludes $x = \\pi n$.',
      'For an identity, the restrictions of both sides together apply.',
    ],
    examples: [
      { generatorId: 'u4-npv-list', seed: 2, tier: 2 },
      { generatorId: 'u4-npv-general', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T6.simplify',
    explore: {
      preset: { explorer: 'identity', problem: 'i3' },
      predict: {
        question: 'What does $1 - \\cos^2 x$ simplify to?',
        options: ['$\\sin^2 x$', '$\\sin x$', '$-\\sin^2 x$', '$\\tan^2 x$'],
        answer: 0,
        tryIt: 'On the left side, choose Pythagorean and type $\\frac{\\sin^2 x}{\\sin x\\cos x}$.',
      },
    },
    explain: [
      'Three families of basic identities:',
      '**Reciprocal**: $\\csc x = \\frac{1}{\\sin x}$, $\\sec x = \\frac{1}{\\cos x}$, $\\cot x = \\frac{1}{\\tan x}$.',
      '**Quotient**: $\\tan x = \\frac{\\sin x}{\\cos x}$, $\\cot x = \\frac{\\cos x}{\\sin x}$.',
      '**Pythagorean**: $\\sin^2 x + \\cos^2 x = 1$, $1 + \\tan^2 x = \\sec^2 x$, $1 + \\cot^2 x = \\csc^2 x$, and rearrangements such as $1 - \\sin^2 x = \\cos^2 x$.',
      'Strategy: rewrite in sine and cosine, combine fractions, look for a Pythagorean pattern, factor, cancel factors (never terms).',
      'Signs: $\\sec^2 x - \\tan^2 x = 1$, but $1 - \\tan^2 x \\ne \\sec^2 x$. Check a rearrangement with $x = \\frac{\\pi}{4}$, not $x = 0$.',
    ],
    examples: [
      { generatorId: 'u4-simp-mc', seed: 2, tier: 2 },
      { generatorId: 'u4-simp-input', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T6.prove-basic',
    explore: {
      preset: { explorer: 'identity', problem: 'i2' },
      predict: {
        question: 'Which first step is valid for proving $\\sec x - \\cos x = \\sin x\\tan x$?',
        options: ['Write the left side as $\\frac{1}{\\cos x} - \\cos x$', 'Multiply both sides by $\\cos x$', 'Add $\\cos x$ to both sides', 'Substitute $x = \\frac{\\pi}{4}$'],
        answer: 0,
        tryIt: 'Work on the left side: Reciprocal, then Common denominator, then Pythagorean.',
      },
    },
    explain: [
      'A proof is a chain of equal expressions starting from one side and ending at the other. Work on each side separately; never move terms across the equal sign, and never multiply both sides.',
      'Start with the more complicated side.',
      'Toolkit, in order of usefulness: write in sine and cosine; common denominators; Pythagorean substitutions; factoring; splitting a fraction.',
      'Example: $\\sec x - \\cos x$ $= \\frac{1}{\\cos x} - \\frac{\\cos^2 x}{\\cos x}$ $= \\frac{1 - \\cos^2 x}{\\cos x}$ $= \\frac{\\sin^2 x}{\\cos x}$ $= \\sin x\\cdot\\frac{\\sin x}{\\cos x}$ $= \\sin x\\tan x$.',
      'If stuck, simplify the other side too until both meet in the middle.',
      'State restrictions for the identity: here $\\cos x \\ne 0$.',
    ],
    examples: [
      { generatorId: 'u4-pb-step', seed: 2, tier: 2 },
      { generatorId: 'u4-pb-which', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T6.exact-sum-double',
    explain: [
      '**Sum and difference**:',
      '$\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B$',
      '$\\cos(A \\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B$ (the sign flips)',
      '**Double angle**: $\\sin 2A = 2\\sin A\\cos A$; $\\cos 2A = \\cos^2 A - \\sin^2 A$ $= 2\\cos^2 A - 1$ $= 1 - 2\\sin^2 A$.',
      'Exact values: write the angle as a sum or difference of special angles. $\\sin 75^\\circ = \\sin(45^\\circ + 30^\\circ)$ $= \\frac{\\sqrt{2}}{2}\\cdot\\frac{\\sqrt{3}}{2} + \\frac{\\sqrt{2}}{2}\\cdot\\frac{1}{2}$ $= \\frac{\\sqrt{6} + \\sqrt{2}}{4}$.',
      'Never distribute: $\\sin(A + B) \\ne \\sin A + \\sin B$, and $\\sin 2A \\ne 2\\sin A$.',
      'From one ratio: find $\\sin\\theta$ and $\\cos\\theta$ with a triangle and the quadrant signs, then substitute into the double-angle form.',
      'Reading identities backwards condenses: $\\sin 50^\\circ\\cos 20^\\circ - \\cos 50^\\circ\\sin 20^\\circ$ $= \\sin 30^\\circ$. Tangent versions are standard of excellence.',
    ],
    examples: [
      { generatorId: 'u4-esd-value', seed: 2, tier: 2 },
      { generatorId: 'u4-esd-double', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'T6.prove-advanced',
    explore: {
      preset: { explorer: 'identity', problem: 'i7' },
      predict: {
        question: 'To simplify $\\frac{\\sin x}{1 - \\cos x}$, multiply numerator and denominator by:',
        options: ['$1 + \\cos x$', '$1 - \\cos x$', '$\\sin x$', '$\\cos x$'],
        answer: 0,
        tryIt: 'Choose Multiply by conjugate on the left and type the product.',
      },
    },
    explain: [
      'Harder proofs combine the basic toolkit with three techniques:',
      '**Double angles**: replace $\\sin 2x$ and $\\cos 2x$ first. Choose the $\\cos 2x$ form that simplifies: next to $1 +$, use $2\\cos^2 x - 1$; next to $1 -$, use $1 - 2\\sin^2 x$.',
      '**Conjugates**: for $1 \\pm \\sin x$ or $1 \\pm \\cos x$ in a denominator, multiply top and bottom by the conjugate. The denominator becomes $1 - \\sin^2 x = \\cos^2 x$ (or $\\sin^2 x$).',
      '**Rational operations**: common denominators for sums; factor numerators and denominators; difference of squares ($\\cos^4 x - \\sin^4 x$).',
      'Each line must be equivalent to the one before. Multiplying only the denominator by a conjugate changes the value.',
      'Record restrictions from every denominator that appears in the original identity.',
    ],
    examples: [
      { generatorId: 'u4-pa-simplify', seed: 2, tier: 2 },
      { generatorId: 'u4-pa-conj', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'T5.identity-sub',
    explore: {
      preset: { explorer: 'trig-equation', fn: 'sin', k: 0.5, k2: -1 },
      predict: {
        question: 'Which substitution turns $\\cos 2x = \\sin x$ into a quadratic in $\\sin x$?',
        options: ['$\\cos 2x = 1 - 2\\sin^2 x$', '$\\cos 2x = 2\\cos^2 x - 1$', '$\\cos 2x = 2\\cos x$', '$\\cos 2x = \\cos^2 x$'],
        answer: 0,
        tryIt: 'After substituting, the factors give $\\sin x = \\frac{1}{2}$ and $\\sin x = -1$: set $k$ and $k_2$ and read the solutions.',
      },
    },
    explain: [
      'Substitute an identity so the equation has one trig function (or factors), then solve as before.',
      'Double angle: $\\sin 2x = \\sin x$ $\\Rightarrow 2\\sin x\\cos x - \\sin x$ $= 0 \\Rightarrow \\sin x(2\\cos x - 1)$ $= 0$.',
      'Pick the $\\cos 2x$ form that matches the other terms: with $\\sin x$ elsewhere use $1 - 2\\sin^2 x$; with $\\cos x$ use $2\\cos^2 x - 1$.',
      'Pythagorean: $2\\sin^2 x = 3\\cos x$ $\\Rightarrow 2(1 - \\cos^2 x)$ $= 3\\cos x \\Rightarrow (2\\cos x - 1)(\\cos x + 2)$ $= 0$.',
      'Sum and difference: condense first. $\\cos x\\cos\\frac{\\pi}{4} - \\sin x\\sin\\frac{\\pi}{4}$ $= \\cos\\left(x + \\frac{\\pi}{4}\\right)$.',
      'Other multiple-angle equations, such as $\\sin 3x = \\frac{1}{2}$, are outside the algebraic scope; solve them graphically.',
      'Do not divide by a trig expression unless you first check that it being zero gives no solution; check NPVs for any quotient you introduce.',
    ],
    examples: [
      { generatorId: 'u4-is-double', seed: 2, tier: 2 },
      { generatorId: 'u4-is-pyth', seed: 1, tier: 2 },
    ],
  },
];
