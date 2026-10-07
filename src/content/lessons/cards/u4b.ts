import type { LessonCard } from '../types';

/** Lesson cards in plain words, one small idea per card. Keyed by skill node id. */
export const CARDS: Record<string, LessonCard[]> = {
  'T4.equation-from-graph': [
    {
      say: 'The **amplitude** $a$ is half the distance from the maximum to the minimum. Subtract, then halve.',
      example: ['Maximum $7$, minimum $-1$.', 'Distance: $7 - (-1) = 8$.', 'Half: $\\frac{8}{2} = 4$.', 'So $a = 4$.'],
      check: { q: 'A sinusoid has maximum 10 and minimum 2. What is the amplitude?', options: ['$4$', '$8$', '$6$', '$5$'], answer: 0, why: '$10 - 2 = 8$, and half of 8 is 4.' },
    },
    {
      say: 'The **midline** $y = d$ is the line halfway between the maximum and the minimum. Add them, then halve. It is the average.',
      example: ['Maximum $7$, minimum $-1$.', 'Add: $7 + (-1) = 6$.', 'Half: $\\frac{6}{2} = 3$.', 'Midline: $y = 3$, so $d = 3$.'],
      check: { q: 'A sinusoid has maximum 10 and minimum 2. What is the midline?', options: ['$y = 6$', '$y = 4$', '$y = 10$', '$y = 5$'], answer: 0, why: '$\\frac{10 + 2}{2} = 6$.' },
    },
    {
      say: 'The **period** is the length of one full cycle. Measure from one maximum to the next maximum.',
      example: ['Maximums at $x = 1$ and $x = 9$.', 'Period: $9 - 1 = 8$.'],
      check: { q: 'One maximum is at $x = 2$ and the next is at $x = 14$. What is the period?', options: ['$12$', '$16$', '$6$', '$24$'], answer: 0, why: '$14 - 2 = 12$.' },
    },
    {
      say: 'From a maximum to the **next minimum** is only half a cycle. So double that gap to get the period.',
      example: ['Maximum at $x = 1$, next minimum at $x = 4$.', 'Gap: $4 - 1 = 3$.', 'Period: $2 \\times 3 = 6$.'],
      check: { q: 'A maximum is at $x = 0$ and the next minimum is at $x = 5$. What is the period?', options: ['$10$', '$5$', '$2.5$', '$20$'], answer: 0, why: 'Max to min is half a cycle, so the period is $2 \\times 5 = 10$.' },
    },
    {
      say: 'Turn the period into $b$ with $b = \\frac{2\\pi}{\\text{period}}$. In degrees, use $b = \\frac{360^\\circ}{\\text{period}}$. The period is not $b$.',
      example: ['Period $6$.', '$b = \\frac{2\\pi}{6}$.', '$b = \\frac{\\pi}{3}$.'],
      check: { q: 'The period is 4. What is $b$?', options: ['$\\frac{\\pi}{2}$', '$4$', '$\\frac{2}{\\pi}$', '$8\\pi$'], answer: 0, why: '$b = \\frac{2\\pi}{4} = \\frac{\\pi}{2}$.' },
    },
    {
      say: 'The **phase shift** $c$ for **cosine**: a cosine cycle starts at a maximum. So $c$ is the $x$-value of a maximum. Pick one near the origin.',
      example: ['A maximum is at $(2, 7)$.', 'So $c = 2$.', 'Write $y = a\\cos[b(x - 2)] + d$.'],
      check: { q: 'A maximum is at $x = 3$. In $y = a\\cos[b(x - c)] + d$, what is $c$?', options: ['$3$', '$-3$', '$0$'], answer: 0, why: 'Cosine starts at a maximum, so $c$ is the maximum $x$-value, 3.' },
    },
    {
      say: 'For **sine**: a sine cycle starts on the midline, going **up**. So $c$ is the $x$-value where the graph crosses the midline while rising.',
      example: ['Midline $y = 3$.', 'The graph rises through $(1, 3)$.', 'So $c = 1$.', 'Write $y = a\\sin[b(x - 1)] + d$.'],
      check: { q: 'A sinusoid with midline $y = 2$ rises through $\\left(\\frac{\\pi}{4}, 2\\right)$. For a sine equation, what is $c$?', options: ['$\\frac{\\pi}{4}$', '$2$', '$-\\frac{\\pi}{4}$', '$0$'], answer: 0, why: 'Sine starts on the midline going up, at $x = \\frac{\\pi}{4}$.' },
    },
    {
      say: 'Put it together: $a$ and $d$ first, then the period and $b$, then $c$. Many equations fit the same graph, and any correct one earns the mark. Test one more point to check.',
      example: ['Max $7$ at $x = 0$, next min $-1$ at $x = \\pi$.', '$a = 4$, $d = 3$.', 'Period $2\\pi$, so $b = 1$. Max at $0$, so $c = 0$.', '$y = 4\\cos x + 3$.', 'Check $x = \\pi$: $4(-1) + 3 = -1$. Correct.'],
      check: { q: 'Max 5 at $x = 0$, next min 1 at $x = 2$. Which equation fits?', options: ['$y = 2\\cos\\left(\\frac{\\pi}{2}x\\right) + 3$', '$y = 4\\cos\\left(\\frac{\\pi}{2}x\\right) + 3$', '$y = 2\\cos(\\pi x) + 3$', '$y = 2\\cos\\left(\\frac{\\pi}{2}x\\right) + 5$'], answer: 0, why: '$a = \\frac{5 - 1}{2} = 2$, $d = \\frac{5 + 1}{2} = 3$, period $2 \\times 2 = 4$, so $b = \\frac{2\\pi}{4} = \\frac{\\pi}{2}$.' },
    },
  ],

  'T4.model': [
    {
      say: 'In a story problem, the **amplitude** is half the change from highest to lowest. For a Ferris wheel, that is the **radius**: half the diameter.',
      example: ['Wheel diameter: $30$ m.', 'Radius: $\\frac{30}{2} = 15$ m.', 'So $|a| = 15$.'],
      check: { q: 'A Ferris wheel has diameter 40 m. What is the amplitude?', options: ['20 m', '40 m', '10 m', '80 m'], answer: 0, why: 'The amplitude is the radius, half of 40.' },
    },
    {
      say: 'The **midline** is halfway between highest and lowest. For a wheel, it is the height of the **axle** (the centre): lowest point plus the radius.',
      example: ['Lowest seat $2$ m, radius $15$ m.', 'Axle: $2 + 15 = 17$ m.', 'Or: highest is $2 + 30 = 32$, and $\\frac{32 + 2}{2} = 17$.', 'Midline $d = 17$.'],
      check: { q: 'A wheel has diameter 20 m and its lowest seat is 1 m up. What is the midline height?', options: ['11 m', '10 m', '21 m', '1 m'], answer: 0, why: 'Radius $10$, so the axle is at $1 + 10 = 11$ m.' },
    },
    {
      say: 'The **period** is the time for one full cycle: one turn of the wheel, or high tide to the next high tide. Then $b = \\frac{2\\pi}{\\text{period}}$.',
      example: ['One turn every $4$ min.', '$b = \\frac{2\\pi}{4} = \\frac{\\pi}{2}$.', 'High tide every $12$ h.', '$b = \\frac{2\\pi}{12} = \\frac{\\pi}{6}$.'],
      check: { q: 'A wheel turns once every 6 min. What is $b$?', options: ['$\\frac{\\pi}{3}$', '$6$', '$\\frac{\\pi}{6}$', '$12\\pi$'], answer: 0, why: '$b = \\frac{2\\pi}{6} = \\frac{\\pi}{3}$.' },
    },
    {
      say: 'Where the story starts at $t = 0$ picks the function. At the **bottom**: use $-\\cos$. At the **top**: use $\\cos$. On the midline going **up**: use $\\sin$.',
      example: ['A rider boards at the bottom.', 'The height starts at its lowest.', '$-\\cos$ starts at a minimum, so use $-\\cos$.'],
      check: { q: 'At $t = 0$ the water is at its highest. Which function fits with $c = 0$?', options: ['$\\cos$', '$-\\cos$', '$\\sin$', '$-\\sin$'], answer: 0, why: 'Cosine starts at a maximum.' },
    },
    {
      say: 'Now build the whole model: amplitude, midline, $b$, and the starting function.',
      example: ['Diameter $30$ m, lowest seat $2$ m, one turn per $4$ min, board at the bottom.', '$a = 15$, so $-15\\cos$ (bottom start).', '$d = 2 + 15 = 17$.', '$b = \\frac{2\\pi}{4} = \\frac{\\pi}{2}$.', '$h(t) = -15\\cos\\left(\\frac{\\pi}{2}t\\right) + 17$.'],
      check: { q: 'Diameter 20 m, lowest seat 1 m, one turn per 2 min, board at the bottom. Which model?', options: ['$h(t) = -10\\cos(\\pi t) + 11$', '$h(t) = 10\\cos(\\pi t) + 11$', '$h(t) = -20\\cos(\\pi t) + 11$', '$h(t) = -10\\cos(\\pi t) + 1$'], answer: 0, why: '$a = 10$ with $-\\cos$ for a bottom start, $d = 1 + 10 = 11$, $b = \\frac{2\\pi}{2} = \\pi$.' },
    },
    {
      say: 'To find the height at a time, put the time in for $t$. Use **radian mode**, because $b$ has $\\pi$ in it.',
      example: ['$h(t) = -15\\cos\\left(\\frac{\\pi}{2}t\\right) + 17$, find $h(2)$.', 'Inside: $\\frac{\\pi}{2}(2) = \\pi$.', '$\\cos\\pi = -1$.', '$h(2) = -15(-1) + 17 = 32$ m.'],
      check: { q: 'Same model. What is $h(4)$?', options: ['2 m', '32 m', '17 m'], answer: 0, why: '$\\frac{\\pi}{2}(4) = 2\\pi$ and $\\cos 2\\pi = 1$, so $h = -15 + 17 = 2$.' },
    },
    {
      say: 'To find **when** the height is $k$, graph $Y_1 = h$ and $Y_2 = k$ and find the crossings. A **duration** is the gap between two crossings. Give units, and round only at the end.',
      example: ['When is $h(t) = 25$ in the model above?', 'Crossings: $t \\approx 1.36$ and $t \\approx 2.64$.', 'Gap: $2.64 - 1.36 = 1.28$.', 'Above 25 m for about $1.28$ min.'],
      check: { q: 'A height is 20 m at $t = 3$ s and at $t = 7$ s, and above 20 m in between. For how long is it above 20 m?', options: ['4 s', '10 s', '7 s', '3 s'], answer: 0, why: 'The duration is the gap: $7 - 3 = 4$ s.' },
    },
  ],

  'T5.first-degree': [
    {
      say: 'First get the trig function **alone** on one side, like solving for $x$ in a normal equation.',
      example: ['$2\\sin x - 1 = 0$', 'Add 1: $2\\sin x = 1$.', 'Divide by 2: $\\sin x = \\frac{1}{2}$.'],
      check: { q: 'Isolate $\\cos x$ in $2\\cos x + \\sqrt{3} = 0$.', options: ['$\\cos x = -\\frac{\\sqrt{3}}{2}$', '$\\cos x = \\frac{\\sqrt{3}}{2}$', '$\\cos x = -\\sqrt{3}$', '$\\cos x = -2\\sqrt{3}$'], answer: 0, why: 'Subtract $\\sqrt{3}$, then divide by 2.' },
    },
    {
      say: 'Find the **reference angle**: the angle in quadrant I for the positive value. Ignore the sign for this step.',
      example: ['$\\cos x = -\\frac{\\sqrt{3}}{2}$', 'Positive value: $\\frac{\\sqrt{3}}{2}$.', '$\\cos\\frac{\\pi}{6} = \\frac{\\sqrt{3}}{2}$.', 'Reference angle: $\\frac{\\pi}{6}$ ($30^\\circ$).'],
      check: { q: 'What is the reference angle for $\\sin x = -\\frac{1}{2}$?', options: ['$\\frac{\\pi}{6}$', '$\\frac{\\pi}{3}$', '$-\\frac{\\pi}{6}$', '$\\frac{7\\pi}{6}$'], answer: 0, why: '$\\sin\\frac{\\pi}{6} = \\frac{1}{2}$. The reference angle is always positive.' },
    },
    {
      say: 'The sign tells you the quadrants, using **CAST**: in quadrant I all are positive, in II sine, in III tangent, in IV cosine.',
      example: ['$\\sin x = \\frac{1}{2}$ is positive.', 'Sine is positive in I and II.', '$\\cos x = -\\frac{1}{2}$ is negative.', 'Cosine is negative in II and III.'],
      check: { q: 'In which quadrants is $\\tan x$ negative?', options: ['II and IV', 'I and III', 'III and IV', 'II and III'], answer: 0, why: 'Tangent is positive in I and III, so negative in II and IV.' },
    },
    {
      say: 'Place the reference angle in each quadrant. In II use $\\pi - $ ref, in III use $\\pi + $ ref, in IV use $2\\pi - $ ref.',
      example: ['$\\cos x = -\\frac{\\sqrt{3}}{2}$, reference $\\frac{\\pi}{6}$, quadrants II and III.', 'II: $\\pi - \\frac{\\pi}{6} = \\frac{5\\pi}{6}$.', 'III: $\\pi + \\frac{\\pi}{6} = \\frac{7\\pi}{6}$.', '$x = \\frac{5\\pi}{6}, \\frac{7\\pi}{6}$.'],
      check: { q: 'Solve $\\sin x = -\\frac{\\sqrt{2}}{2}$ for $0 \\le x < 2\\pi$.', options: ['$\\frac{5\\pi}{4}, \\frac{7\\pi}{4}$', '$\\frac{\\pi}{4}, \\frac{3\\pi}{4}$', '$\\frac{3\\pi}{4}, \\frac{5\\pi}{4}$', '$-\\frac{\\pi}{4}$'], answer: 0, why: 'Reference $\\frac{\\pi}{4}$. Sine is negative in III and IV: $\\pi + \\frac{\\pi}{4}$ and $2\\pi - \\frac{\\pi}{4}$.' },
    },
    {
      say: 'A bigger domain means more answers. Each extra full turn ($2\\pi$ or $360^\\circ$) adds another pair. Tangent repeats every **half** turn ($\\pi$ or $180^\\circ$).',
      example: ['$\\sin x = \\frac{1}{2}$, $0^\\circ \\le x < 720^\\circ$.', 'First turn: $30^\\circ$, $150^\\circ$.', 'Add $360^\\circ$: $390^\\circ$, $510^\\circ$.', 'Four solutions.'],
      check: { q: 'How many solutions does $\\cos x = \\frac{1}{2}$ have for $0^\\circ \\le x < 720^\\circ$?', options: ['4', '2', '3', '8'], answer: 0, why: 'Two per turn ($60^\\circ$, $300^\\circ$), and the domain is two turns.' },
    },
    {
      say: 'Read the ends of the domain. The sign $\\le$ **includes** that end. The sign $<$ leaves it out.',
      example: ['$\\cos x = 1$ for $0 \\le x \\le 2\\pi$.', '$\\cos 0 = 1$ and $\\cos 2\\pi = 1$.', 'Both ends are included: $x = 0, 2\\pi$.'],
      check: { q: 'Solve $\\cos x = 1$ for $0 \\le x < 2\\pi$.', options: ['$x = 0$', '$x = 0, 2\\pi$', '$x = 2\\pi$', 'No solution'], answer: 0, why: 'The $<$ leaves out $2\\pi$, so only $0$ is left.' },
    },
    {
      say: 'Sine and cosine are always between $-1$ and $1$. If the isolated value is outside that, there is **no solution**.',
      example: ['$3\\sin x = 4$', '$\\sin x = \\frac{4}{3} \\approx 1.33$.', '$1.33 > 1$, so no solution.'],
      check: { q: 'Which equation has no solution?', options: ['$2\\cos x + 3 = 0$', '$2\\sin x + 1 = 0$', '$\\tan x = 5$', '$4\\cos x = 3$'], answer: 0, why: 'It gives $\\cos x = -1.5$, below $-1$. Tangent can be any number.' },
    },
    {
      say: 'For a value that is not special, get the reference angle from $\\sin^{-1}$, $\\cos^{-1}$ or $\\tan^{-1}$ of the **positive** value. Then use CAST as before. Check the calculator mode and round at the end.',
      example: ['$\\sin x = 0.4$, $0^\\circ \\le x < 360^\\circ$.', 'Reference: $\\sin^{-1}(0.4) \\approx 23.6^\\circ$.', 'Positive, so I and II.', 'I: $23.6^\\circ$. II: $180^\\circ - 23.6^\\circ = 156.4^\\circ$.'],
      check: { q: '$\\cos^{-1}(0.3) \\approx 72.5^\\circ$. Solve $\\cos x = -0.3$ for $0^\\circ \\le x < 360^\\circ$.', options: ['$107.5^\\circ, 252.5^\\circ$', '$72.5^\\circ, 287.5^\\circ$', '$107.5^\\circ$', '$72.5^\\circ, 107.5^\\circ$'], answer: 0, why: 'Negative cosine: II and III. $180 - 72.5 = 107.5$ and $180 + 72.5 = 252.5$.' },
    },
  ],

  'T5.general': [
    {
      say: 'The **general solution** lists every solution, forever. Solve over one period, then add "period times $n$". Here $n \\in I$ means $n$ is any **integer**: $\\ldots, -2, -1, 0, 1, 2, \\ldots$',
      example: ['$\\sin x = \\frac{1}{2}$', 'One turn: $\\frac{\\pi}{6}$ and $\\frac{5\\pi}{6}$.', '$x = \\frac{\\pi}{6} + 2\\pi n$ and $x = \\frac{5\\pi}{6} + 2\\pi n$, $n \\in I$.'],
      check: { q: 'In a general solution, what does $n \\in I$ mean?', options: ['$n$ is any integer', '$n$ is any real number', '$n$ is a positive whole number', '$n = 1$ only'], answer: 0, why: '$I$ is the set of integers, negative, zero and positive.' },
    },
    {
      say: 'Sine and cosine (and $\\csc$, $\\sec$) repeat every $2\\pi$. So add $2\\pi n$ to each answer from one turn.',
      example: ['$\\cos x = \\frac{1}{2}$', 'One turn: $\\frac{\\pi}{3}$ and $\\frac{5\\pi}{3}$.', '$x = \\frac{\\pi}{3} + 2\\pi n$, $x = \\frac{5\\pi}{3} + 2\\pi n$.'],
      check: { q: 'Which is the general solution of $\\sin x = \\frac{\\sqrt{2}}{2}$?', options: ['$x = \\frac{\\pi}{4} + 2\\pi n,\\ \\frac{3\\pi}{4} + 2\\pi n$', '$x = \\frac{\\pi}{4} + \\pi n$', '$x = \\frac{\\pi}{4} + 2\\pi n$', '$x = \\frac{\\pi}{4} + 2\\pi n,\\ \\frac{7\\pi}{4} + 2\\pi n$'], answer: 0, why: 'Sine is positive in I and II, and its period is $2\\pi$.' },
    },
    {
      say: 'Tangent (and $\\cot$) repeats every $\\pi$. One answer plus $\\pi n$ covers them all.',
      example: ['$\\tan x = -1$', 'Reference $\\frac{\\pi}{4}$, negative in II: $\\frac{3\\pi}{4}$.', 'Add $\\pi n$: $x = \\frac{3\\pi}{4} + \\pi n$.'],
      check: { q: 'General solution of $\\tan x = 1$?', options: ['$x = \\frac{\\pi}{4} + \\pi n$', '$x = \\frac{\\pi}{4} + 2\\pi n$', '$x = \\frac{\\pi}{4} + \\frac{\\pi}{2}n$'], answer: 0, why: 'Tangent has period $\\pi$.' },
    },
    {
      say: 'If two answers are exactly half a turn ($\\pi$) apart, one term covers both: add $\\pi n$ instead of $2\\pi n$.',
      example: ['$\\cos x = 0$: one turn gives $\\frac{\\pi}{2}$ and $\\frac{3\\pi}{2}$.', 'They are $\\pi$ apart.', 'So $x = \\frac{\\pi}{2} + \\pi n$.'],
      check: { q: 'General solution of $\\sin x = 0$?', options: ['$x = \\pi n$', '$x = 2\\pi n$', '$x = \\frac{\\pi}{2} + \\pi n$'], answer: 0, why: '$0$ and $\\pi$ are $\\pi$ apart, so $x = 0 + \\pi n$.' },
    },
    {
      say: 'In degrees, use $360^\\circ n$ for sine and cosine, and $180^\\circ n$ for tangent.',
      example: ['$\\cos x = -\\frac{1}{2}$', 'One turn: $120^\\circ$, $240^\\circ$.', '$x = 120^\\circ + 360^\\circ n$, $x = 240^\\circ + 360^\\circ n$.'],
      check: { q: 'General solution of $\\tan x = \\sqrt{3}$, in degrees?', options: ['$x = 60^\\circ + 180^\\circ n$', '$x = 60^\\circ + 360^\\circ n$', '$x = 60^\\circ + \\pi n$'], answer: 0, why: 'Tangent repeats every $180^\\circ$. Do not mix degrees with $\\pi$.' },
    },
    {
      say: 'To list the answers in a domain, put in $n = 0, 1, 2, \\ldots$ and $n = -1, -2, \\ldots$ Keep only values inside the domain.',
      example: ['$x = \\frac{\\pi}{3} + \\pi n$, $0 \\le x < 2\\pi$.', '$n = 0$: $\\frac{\\pi}{3}$. Keep.', '$n = 1$: $\\frac{4\\pi}{3}$. Keep.', '$n = 2$: $\\frac{7\\pi}{3}$. Too big.', '$n = -1$: $-\\frac{2\\pi}{3}$. Too small.'],
      check: { q: 'List $x = 30^\\circ + 180^\\circ n$ for $0^\\circ \\le x < 360^\\circ$.', options: ['$30^\\circ, 210^\\circ$', '$30^\\circ$', '$30^\\circ, 210^\\circ, 390^\\circ$', '$30^\\circ, 150^\\circ$'], answer: 0, why: '$n = 0$ gives $30^\\circ$, $n = 1$ gives $210^\\circ$, and $n = 2$ gives $390^\\circ$, outside.' },
    },
    {
      say: 'If the domain goes below zero, the negative values of $n$ matter too.',
      example: ['$x = 90^\\circ + 360^\\circ n$, $-360^\\circ \\le x < 360^\\circ$.', '$n = 0$: $90^\\circ$. Keep.', '$n = -1$: $90 - 360 = -270^\\circ$. Keep.', '$n = 1$: $450^\\circ$. Too big.'],
      check: { q: 'List $x = 60^\\circ + 360^\\circ n$ for $-360^\\circ \\le x < 360^\\circ$.', options: ['$-300^\\circ, 60^\\circ$', '$60^\\circ$', '$-60^\\circ, 60^\\circ$', '$60^\\circ, 420^\\circ$'], answer: 0, why: '$n = -1$ gives $60 - 360 = -300$, and $n = 0$ gives $60$.' },
    },
  ],

  'T5.second-degree': [
    {
      say: 'A **second-degree** trig equation has a squared trig function, like $\\sin^2 x$, which means $(\\sin x)^2$. Treat the trig function as one letter, $u$, and you get a quadratic.',
      example: ['$2\\sin^2 x - \\sin x - 1 = 0$', 'Let $u = \\sin x$.', '$2u^2 - u - 1 = 0$.'],
      check: { q: 'With $u = \\cos x$, what is $\\cos^2 x - 3\\cos x + 2 = 0$?', options: ['$u^2 - 3u + 2 = 0$', '$2u - 3u + 2 = 0$', '$u^2 - 3u = 0$', '$u - 3u + 2 = 0$'], answer: 0, why: '$\\cos^2 x$ is $u^2$ and $\\cos x$ is $u$.' },
    },
    {
      say: 'Factor the quadratic. Then set each factor equal to zero. Each one gives a first-degree equation.',
      example: ['$2u^2 - u - 1 = (2u + 1)(u - 1)$', 'So $(2\\sin x + 1)(\\sin x - 1) = 0$.', '$2\\sin x + 1 = 0$ gives $\\sin x = -\\frac{1}{2}$.', '$\\sin x - 1 = 0$ gives $\\sin x = 1$.'],
      check: { q: 'What does $(2\\cos x - 1)(\\cos x + 1) = 0$ give?', options: ['$\\cos x = \\frac{1}{2}$ or $\\cos x = -1$', '$\\cos x = -\\frac{1}{2}$ or $\\cos x = 1$', '$\\cos x = 2$ or $\\cos x = -1$', '$\\cos x = \\frac{1}{2}$ or $\\cos x = 1$'], answer: 0, why: '$2\\cos x - 1 = 0$ gives $\\frac{1}{2}$; $\\cos x + 1 = 0$ gives $-1$.' },
    },
    {
      say: 'Solve each factor over the domain. Then put all the answers together in one list.',
      example: ['$\\sin x = -\\frac{1}{2}$: $\\frac{7\\pi}{6}, \\frac{11\\pi}{6}$.', '$\\sin x = 1$: $\\frac{\\pi}{2}$.', 'All: $x = \\frac{\\pi}{2}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}$.'],
      check: { q: 'Solve $(2\\cos x - 1)(\\cos x + 1) = 0$ for $0 \\le x < 2\\pi$.', options: ['$\\frac{\\pi}{3}, \\pi, \\frac{5\\pi}{3}$', '$\\frac{\\pi}{3}, \\frac{5\\pi}{3}$', '$\\frac{\\pi}{3}, \\pi$', '$\\frac{2\\pi}{3}, \\pi, \\frac{4\\pi}{3}$'], answer: 0, why: '$\\cos x = \\frac{1}{2}$ gives $\\frac{\\pi}{3}, \\frac{5\\pi}{3}$, and $\\cos x = -1$ gives $\\pi$.' },
    },
    {
      say: 'Throw out a factor that is impossible. Sine and cosine can never be bigger than 1 or smaller than $-1$.',
      example: ['$(\\cos x - 2)(2\\cos x - 1) = 0$', '$\\cos x = 2$: impossible, no solution.', '$\\cos x = \\frac{1}{2}$: $\\frac{\\pi}{3}, \\frac{5\\pi}{3}$.', 'Answer: $x = \\frac{\\pi}{3}, \\frac{5\\pi}{3}$.'],
      check: { q: 'Solve $(\\sin x + 3)(\\sin x - 1) = 0$ for $0 \\le x < 2\\pi$.', options: ['$\\frac{\\pi}{2}$', '$\\frac{\\pi}{2}, \\frac{3\\pi}{2}$', 'No solution'], answer: 0, why: '$\\sin x = -3$ is impossible, and $\\sin x = 1$ gives $\\frac{\\pi}{2}$.' },
    },
    {
      say: 'If a trig function is in every term, **do not divide** by it. Dividing loses the answers where it equals 0. Move everything to one side and **factor it out**.',
      example: ['$2\\sin x\\cos x = \\cos x$', '$2\\sin x\\cos x - \\cos x = 0$', '$\\cos x(2\\sin x - 1) = 0$', '$\\cos x = 0$ or $\\sin x = \\frac{1}{2}$.'],
      check: { q: 'What is a good first step for $\\sin^2 x = \\sin x$?', options: ['Write $\\sin^2 x - \\sin x = 0$', 'Divide both sides by $\\sin x$', 'Take the square root of both sides'], answer: 0, why: 'Then factor: $\\sin x(\\sin x - 1) = 0$. Dividing would lose $\\sin x = 0$.' },
    },
    {
      say: 'With no middle term, isolate the square and take the square root. Remember **both** signs, $\\pm$.',
      example: ['$\\tan^2 x - 3 = 0$', '$\\tan^2 x = 3$', '$\\tan x = \\pm\\sqrt{3}$', 'For $0 \\le x < 2\\pi$: $\\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\frac{5\\pi}{3}$.'],
      check: { q: 'What does $4\\sin^2 x - 1 = 0$ give?', options: ['$\\sin x = \\pm\\frac{1}{2}$', '$\\sin x = \\frac{1}{2}$', '$\\sin x = \\pm\\frac{1}{4}$', '$\\sin x = \\pm 2$'], answer: 0, why: '$\\sin^2 x = \\frac{1}{4}$, and the square root of $\\frac{1}{4}$ is $\\pm\\frac{1}{2}$.' },
    },
    {
      say: 'Sometimes one factor needs the calculator. Round those answers. The special factor still gets its exact answers.',
      example: ['$(3\\sin x - 1)(\\sin x - 1) = 0$, $0^\\circ \\le x < 360^\\circ$.', '$\\sin x = \\frac{1}{3}$: $\\sin^{-1}\\frac{1}{3} \\approx 19.5^\\circ$.', 'I and II: $19.5^\\circ$, $180^\\circ - 19.5^\\circ = 160.5^\\circ$.', '$\\sin x = 1$: $90^\\circ$.', 'All: $19.5^\\circ, 90^\\circ, 160.5^\\circ$.'],
      check: { q: '$\\cos^{-1}(0.4) \\approx 66.4^\\circ$. Solve $(5\\cos x - 2)(\\cos x + 1) = 0$ for $0^\\circ \\le x < 360^\\circ$.', options: ['$66.4^\\circ, 180^\\circ, 293.6^\\circ$', '$66.4^\\circ, 180^\\circ$', '$66.4^\\circ, 113.6^\\circ, 180^\\circ$', '$66.4^\\circ, 293.6^\\circ$'], answer: 0, why: '$\\cos x = 0.4$ is in I and IV: $66.4^\\circ$ and $360 - 66.4 = 293.6^\\circ$. $\\cos x = -1$ gives $180^\\circ$.' },
    },
  ],

  'T5.graphical': [
    {
      say: 'First set **MODE** to match the domain: **degree** if the domain is in degrees, **radian** if it uses $\\pi$.',
      example: ['Domain $0^\\circ \\le x < 360^\\circ$: degree mode.', 'Domain $0 \\le x < 2\\pi$: radian mode.'],
      check: { q: 'The domain is $0 \\le x < 2\\pi$. Which mode?', options: ['Radian', 'Degree', 'Either one'], answer: 0, why: 'A domain written with $\\pi$ is in radians.' },
    },
    {
      say: 'Put the left side in $Y_1$ and the right side in $Y_2$. The answers are where the graphs cross. You can also move everything to one side and find the **zeros**.',
      example: ['$3\\sin x + 1 = 2.5$', '$Y_1 = 3\\sin(X) + 1$', '$Y_2 = 2.5$'],
      check: { q: 'How do you enter $4\\cos x - 1 = 2$?', options: ['$Y_1 = 4\\cos(X) - 1$, $Y_2 = 2$', '$Y_1 = 4\\cos(X)$, $Y_2 = 2$', '$Y_1 = 4\\cos(X) - 1$, $Y_2 = 0$'], answer: 0, why: 'Each side of the equation goes in its own $Y$, unchanged.' },
    },
    {
      say: 'In **WINDOW**, set the $x$-values to the domain: Xmin at the start, Xmax at the end.',
      example: ['Domain $0^\\circ \\le x < 360^\\circ$.', 'Xmin $= 0$, Xmax $= 360$.', 'For $0 \\le x < 2\\pi$: Xmax $= 2\\pi$.'],
      check: { q: 'The domain is $0^\\circ \\le x < 360^\\circ$. Which $x$ settings?', options: ['Xmin $= 0$, Xmax $= 360$', 'Xmin $= 0$, Xmax $= 2\\pi$', 'Xmin $= -10$, Xmax $= 10$', 'Xmin $= 0$, Xmax $= 180$'], answer: 0, why: 'Match the degree domain exactly.' },
    },
    {
      say: 'Set the $y$-values so you see the whole graph. The max is $d + |a|$ and the min is $d - |a|$. Go a little past both.',
      example: ['$y = 3\\sin x + 1$', 'Max: $1 + 3 = 4$. Min: $1 - 3 = -2$.', 'Ymin $= -3$, Ymax $= 5$.'],
      check: { q: 'Which $y$ settings show all of $y = 5\\cos x + 2$?', options: ['Ymin $= -4$, Ymax $= 8$', 'Ymin $= -5$, Ymax $= 5$', 'Ymin $= 0$, Ymax $= 5$', 'Ymin $= -1$, Ymax $= 3$'], answer: 0, why: 'Max $2 + 5 = 7$, min $2 - 5 = -3$. Only the first window holds both.' },
    },
    {
      say: 'Press **2nd TRACE** and choose intersect. Press ENTER for the first curve, ENTER for the second, then move the cursor near the crossing and press ENTER. Repeat once for **each** crossing.',
      example: ['For a zero, choose zero instead.', 'Set a left bound and a right bound on either side of the zero.', 'Then press ENTER for the guess.'],
      check: { q: 'You can see 3 crossings. How many times do you run intersect?', options: ['3', '1', '2'], answer: 0, why: 'Intersect finds one crossing at a time, the one near the cursor.' },
    },
    {
      say: 'Count the crossings before you start, so you know how many answers to find. A horizontal line between the max and min crosses each full cycle **twice**.',
      example: ['$y = 2\\sin 2x$ and $y = 1$, $0^\\circ \\le x < 360^\\circ$.', 'Period: $\\frac{360^\\circ}{2} = 180^\\circ$.', 'Cycles: $\\frac{360}{180} = 2$.', 'Crossings: $2 \\times 2 = 4$.'],
      check: { q: 'How many times does $y = 1$ cross $y = 3\\cos x$ for $0^\\circ \\le x < 720^\\circ$?', options: ['4', '2', '8', '3'], answer: 0, why: 'The domain holds 2 cycles, with 2 crossings each.' },
    },
    {
      say: 'Round as the question asks. Leave out any crossing that is not inside the domain.',
      example: ['$3\\sin x = 2$, $0^\\circ \\le x < 360^\\circ$.', 'Crossings: $x = 41.810\\ldots$ and $x = 138.189\\ldots$', 'To the nearest tenth: $41.8^\\circ, 138.2^\\circ$.'],
      check: { q: 'The domain is $0^\\circ \\le x < 360^\\circ$ and the graphs cross at $x = 360$. Do you list it?', options: ['No, $360$ is not in the domain', 'Yes, every crossing counts', 'Only if you round it'], answer: 0, why: 'The $<$ sign leaves out $360$.' },
    },
  ],

  'T6.identity-vs-equation': [
    {
      say: 'An **identity** is true for **every** value of $x$ that is allowed. Those allowed values are the **permissible** values.',
      example: ['$\\tan x\\cos x = \\sin x$', '$\\tan x\\cos x = \\frac{\\sin x}{\\cos x}\\cdot\\cos x$', '$= \\sin x$, for every $x$ with $\\cos x \\ne 0$.'],
      check: { q: 'Which is an identity?', options: ['$\\sin^2 x + \\cos^2 x = 1$', '$\\sin x = \\frac{1}{2}$', '$\\cos x = 0$', '$2\\sin x = 1$'], answer: 0, why: 'It is true for every $x$. The others are true only for some values.' },
    },
    {
      say: 'An **equation** is true only for **some** values. You solve it to find them.',
      example: ['$\\sin x = \\frac{1}{2}$', 'True at $x = 30^\\circ$.', 'False at $x = 0^\\circ$: $\\sin 0^\\circ = 0$.'],
      check: { q: 'Is $\\cos x = 1$ an identity or an equation?', options: ['An equation', 'An identity'], answer: 0, why: 'It is true at $0^\\circ$ but false at $90^\\circ$, so not for every value.' },
    },
    {
      say: 'To **verify** means to check one value. Put the value into each side **separately**, work each out, and write both results. Comparing graphs is another way to check.',
      example: ['Verify $\\tan x\\cos x = \\sin x$ for $x = 60^\\circ$.', 'Left: $\\sqrt{3}\\cdot\\frac{1}{2} = \\frac{\\sqrt{3}}{2}$.', 'Right: $\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$.', 'Both sides equal $\\frac{\\sqrt{3}}{2}$.'],
      check: { q: 'At $x = 45^\\circ$, what is each side of $1 + \\tan^2 x = \\sec^2 x$?', options: ['Both sides are 2', 'Both sides are 1', 'Left 2, right 1'], answer: 0, why: 'Left: $1 + 1^2 = 2$. Right: $(\\sqrt{2})^2 = 2$.' },
    },
    {
      say: 'Verifying one value does **not** prove an identity. It only shows the two sides match at that value.',
      example: ['$\\sin x = \\cos x$ works at $x = 45^\\circ$.', 'But at $0^\\circ$: $0 \\ne 1$.', 'So one match proves nothing.'],
      check: { q: 'Both sides of an identity match at $x = 30^\\circ$. What has been shown?', options: ['It holds at $30^\\circ$: a verification', 'The identity is proven', 'It is an equation, not an identity'], answer: 0, why: 'A check at one value is a verification, not a proof.' },
    },
    {
      say: 'One value where the sides **differ** is enough to show it is **not** an identity. That value is a **counterexample**.',
      example: ['Is $\\sin 2x = 2\\sin x$ an identity?', 'Try $x = 90^\\circ$.', 'Left: $\\sin 180^\\circ = 0$.', 'Right: $2\\sin 90^\\circ = 2$.', '$0 \\ne 2$, so it is not an identity.'],
      check: { q: 'Does $x = 0^\\circ$ show that $\\cos 2x = 2\\cos x$ is not an identity?', options: ['Yes: the left is 1 and the right is 2', 'No: one value never decides anything', 'No: both sides are 1'], answer: 0, why: '$\\cos 0^\\circ = 1$ but $2\\cos 0^\\circ = 2$. One counterexample is enough.' },
    },
    {
      say: 'To **prove** means to show it works for **all** permissible values, using algebra and known identities. Read the directing word: "verify for $x = \\frac{\\pi}{6}$" wants numbers; "prove" wants algebra.',
      example: ['"Verify for $x = \\frac{\\pi}{6}$": substitute and compute both sides.', '"Prove": rewrite one side step by step until it matches the other.'],
      check: { q: 'A question says "Prove $\\tan x\\cos x = \\sin x$." What should you do?', options: ['Use identities to turn one side into the other', 'Substitute $x = 30^\\circ$ into both sides', 'Solve for $x$'], answer: 0, why: 'A proof uses algebra that works for every value, not one number.' },
    },
  ],

  'T6.npv': [
    {
      say: 'A **non-permissible value** (NPV) is an $x$ where some part of the expression is not defined. Mostly, that means a denominator equals 0.',
      example: ['$\\frac{1}{\\sin x}$', 'Not defined when $\\sin x = 0$.', 'For $0 \\le x < 2\\pi$: $x = 0, \\pi$.'],
      check: { q: 'What are the NPVs of $\\frac{1}{\\cos x}$ for $0 \\le x < 2\\pi$?', options: ['$\\frac{\\pi}{2}, \\frac{3\\pi}{2}$', '$0, \\pi$', '$\\frac{\\pi}{2}$', 'None'], answer: 0, why: '$\\cos x = 0$ at $\\frac{\\pi}{2}$ and $\\frac{3\\pi}{2}$.' },
    },
    {
      say: 'Some functions hide a denominator. $\\tan x$ and $\\sec x$ have $\\cos x$ underneath, so $\\cos x \\ne 0$. $\\cot x$ and $\\csc x$ have $\\sin x$ underneath, so $\\sin x \\ne 0$.',
      example: ['$\\tan x = \\frac{\\sin x}{\\cos x}$, so $\\cos x \\ne 0$.', '$\\csc x = \\frac{1}{\\sin x}$, so $\\sin x \\ne 0$.'],
      check: { q: 'Which hidden denominator does $\\cot x$ have?', options: ['$\\sin x$', '$\\cos x$', '$\\tan x$'], answer: 0, why: '$\\cot x = \\frac{\\cos x}{\\sin x}$.' },
    },
    {
      say: 'Solve each restriction like an equation, with $\\ne$ in place of $=$.',
      example: ['$\\frac{\\cos x}{2\\sin x - 1}$', '$2\\sin x - 1 \\ne 0$', '$\\sin x \\ne \\frac{1}{2}$', '$x \\ne \\frac{\\pi}{6}, \\frac{5\\pi}{6}$'],
      check: { q: 'NPVs of $\\frac{\\sin x}{2\\cos x + \\sqrt{3}}$ for $0 \\le x < 2\\pi$?', options: ['$\\frac{5\\pi}{6}, \\frac{7\\pi}{6}$', '$\\frac{\\pi}{6}, \\frac{11\\pi}{6}$', '$\\frac{\\pi}{6}, \\frac{5\\pi}{6}$', '$\\frac{7\\pi}{6}, \\frac{11\\pi}{6}$'], answer: 0, why: '$\\cos x \\ne -\\frac{\\sqrt{3}}{2}$. Cosine is negative in II and III.' },
    },
    {
      say: 'Find **both** kinds: the real denominators and the hidden ones. List them all together.',
      example: ['$\\frac{\\tan x}{\\sin x}$, $0 \\le x < 2\\pi$', 'Denominator: $\\sin x \\ne 0$, so $x \\ne 0, \\pi$.', 'Hidden in $\\tan x$: $\\cos x \\ne 0$, so $x \\ne \\frac{\\pi}{2}, \\frac{3\\pi}{2}$.', 'NPVs: $0, \\frac{\\pi}{2}, \\pi, \\frac{3\\pi}{2}$.'],
      check: { q: 'NPVs of $\\frac{\\cot x}{\\cos x}$ for $0 \\le x < 2\\pi$?', options: ['$0, \\frac{\\pi}{2}, \\pi, \\frac{3\\pi}{2}$', '$\\frac{\\pi}{2}, \\frac{3\\pi}{2}$', '$0, \\pi$', 'None'], answer: 0, why: '$\\cos x \\ne 0$ from the denominator, and $\\sin x \\ne 0$ hidden in $\\cot x$.' },
    },
    {
      say: 'In **general form**, use $n \\in I$. $\\sin x = 0$ at $x = \\pi n$. $\\cos x = 0$ at $x = \\frac{\\pi}{2} + \\pi n$. Both together: $x = \\frac{\\pi}{2}n$.',
      example: ['$\\frac{\\tan x}{\\sin x}$', '$x \\ne \\pi n$ and $x \\ne \\frac{\\pi}{2} + \\pi n$', 'Together: $x \\ne \\frac{\\pi}{2}n$, $n \\in I$.'],
      check: { q: 'NPVs of $\\sec x$ in general form?', options: ['$x \\ne \\frac{\\pi}{2} + \\pi n$', '$x \\ne \\pi n$', '$x \\ne \\frac{\\pi}{2} + 2\\pi n$', '$x \\ne 2\\pi n$'], answer: 0, why: '$\\sec x = \\frac{1}{\\cos x}$, and $\\cos x = 0$ every $\\pi$, starting at $\\frac{\\pi}{2}$.' },
    },
    {
      say: 'Find the NPVs from the **original** expression, before you simplify. Simplifying can hide a restriction, but it is still there.',
      example: ['$\\frac{\\sin x}{\\sin x} = 1$', 'The $1$ looks fine everywhere.', 'But the original needs $\\sin x \\ne 0$.', 'So still $x \\ne \\pi n$.'],
      check: { q: '$\\frac{\\sin x\\cos x}{\\sin x}$ simplifies to $\\cos x$. Which values are still not allowed?', options: ['$x = \\pi n$', 'None', '$x = \\frac{\\pi}{2} + \\pi n$'], answer: 0, why: 'The original denominator $\\sin x$ is 0 at $x = \\pi n$.' },
    },
    {
      say: 'For an identity, take the restrictions from **both** sides together.',
      example: ['$\\tan x\\cos x = \\sin x$', 'Left: $\\tan x$ needs $\\cos x \\ne 0$.', 'Right: $\\sin x$ has no restriction.', 'NPVs: $x \\ne \\frac{\\pi}{2} + \\pi n$.'],
      check: { q: 'What are the NPVs of the identity $\\cot x\\sin x = \\cos x$?', options: ['$x \\ne \\pi n$', '$x \\ne \\frac{\\pi}{2} + \\pi n$', 'None'], answer: 0, why: '$\\cot x$ needs $\\sin x \\ne 0$, so $x \\ne \\pi n$.' },
    },
  ],

  'T6.simplify': [
    {
      say: 'The **reciprocal** identities flip a function upside down: $\\csc x = \\frac{1}{\\sin x}$, $\\sec x = \\frac{1}{\\cos x}$, $\\cot x = \\frac{1}{\\tan x}$. A reciprocal is not an inverse: $\\sec x$ is not $\\cos^{-1} x$.',
      example: ['$\\cos^2 x\\sec x$', '$= \\cos^2 x\\cdot\\frac{1}{\\cos x}$', '$= \\cos x$'],
      check: { q: 'What is $\\sec x$?', options: ['$\\frac{1}{\\cos x}$', '$\\frac{1}{\\sin x}$', '$\\cos^{-1} x$', '$\\frac{1}{\\tan x}$'], answer: 0, why: 'Secant is the reciprocal of cosine.' },
    },
    {
      say: 'The **quotient** identities: $\\tan x = \\frac{\\sin x}{\\cos x}$ and $\\cot x = \\frac{\\cos x}{\\sin x}$.',
      example: ['$\\cos x\\tan x$', '$= \\cos x\\cdot\\frac{\\sin x}{\\cos x}$', 'The $\\cos x$ factors cancel.', '$= \\sin x$'],
      check: { q: 'Simplify $\\sin x\\cot x$.', options: ['$\\cos x$', '$\\sin x$', '$1$', '$\\tan x$'], answer: 0, why: '$\\sin x\\cdot\\frac{\\cos x}{\\sin x} = \\cos x$.' },
    },
    {
      say: 'The main **Pythagorean** identity is $\\sin^2 x + \\cos^2 x = 1$. Moving a term gives $1 - \\cos^2 x = \\sin^2 x$ and $1 - \\sin^2 x = \\cos^2 x$.',
      example: ['$\\frac{1 - \\cos^2 x}{\\sin x}$', '$= \\frac{\\sin^2 x}{\\sin x}$', '$= \\sin x$'],
      check: { q: 'What is $1 - \\sin^2 x$?', options: ['$\\cos^2 x$', '$\\sin^2 x$', '$-\\cos^2 x$', '$\\cos x$'], answer: 0, why: 'Subtract $\\sin^2 x$ from both sides of $\\sin^2 x + \\cos^2 x = 1$.' },
    },
    {
      say: 'Two more Pythagorean identities: $1 + \\tan^2 x = \\sec^2 x$ and $1 + \\cot^2 x = \\csc^2 x$.',
      example: ['$\\sec^2 x - 1$', '$= (1 + \\tan^2 x) - 1$', '$= \\tan^2 x$'],
      check: { q: 'Simplify $\\csc^2 x - \\cot^2 x$.', options: ['$1$', '$-1$', '$\\tan^2 x$', '$0$'], answer: 0, why: '$\\csc^2 x = 1 + \\cot^2 x$, so $1 + \\cot^2 x - \\cot^2 x = 1$.' },
    },
    {
      say: 'Watch the signs when you move terms. $\\sec^2 x - \\tan^2 x = 1$ is true, but $1 - \\tan^2 x = \\sec^2 x$ is false. Test a rearrangement with $x = 45^\\circ$.',
      example: ['Test $1 - \\tan^2 x = \\sec^2 x$ at $45^\\circ$.', 'Left: $1 - 1 = 0$.', 'Right: $(\\sqrt{2})^2 = 2$.', '$0 \\ne 2$, so it is false.'],
      check: { q: 'Which is true?', options: ['$\\sec^2 x - \\tan^2 x = 1$', '$1 - \\tan^2 x = \\sec^2 x$', '$\\tan^2 x - \\sec^2 x = 1$', '$\\sec^2 x + \\tan^2 x = 1$'], answer: 0, why: 'Subtract $\\tan^2 x$ from both sides of $1 + \\tan^2 x = \\sec^2 x$.' },
    },
    {
      say: 'A good first move: rewrite everything in **sine and cosine**. Then simplify the fractions.',
      example: ['$\\frac{\\sec x}{\\csc x}$', '$= \\frac{1/\\cos x}{1/\\sin x}$', '$= \\frac{1}{\\cos x}\\cdot\\frac{\\sin x}{1}$', '$= \\frac{\\sin x}{\\cos x} = \\tan x$'],
      check: { q: 'Simplify $\\cot x\\sec x$.', options: ['$\\csc x$', '$\\sec x$', '$\\sin x$', '$1$'], answer: 0, why: '$\\frac{\\cos x}{\\sin x}\\cdot\\frac{1}{\\cos x} = \\frac{1}{\\sin x} = \\csc x$.' },
    },
    {
      say: 'To add fractions, use a **common denominator**. Then look for $\\sin^2 x + \\cos^2 x$, which is 1.',
      example: ['$\\sin x + \\cos x\\cot x$', '$= \\sin x + \\frac{\\cos^2 x}{\\sin x}$', '$= \\frac{\\sin^2 x + \\cos^2 x}{\\sin x}$', '$= \\frac{1}{\\sin x} = \\csc x$'],
      check: { q: 'Simplify $\\cos x + \\sin x\\tan x$.', options: ['$\\sec x$', '$\\csc x$', '$1$', '$\\cos x$'], answer: 0, why: '$\\cos x + \\frac{\\sin^2 x}{\\cos x} = \\frac{\\cos^2 x + \\sin^2 x}{\\cos x} = \\frac{1}{\\cos x}$.' },
    },
    {
      say: '**Factor**, then cancel. You may only cancel **factors** (things multiplied), never **terms** (things added).',
      example: ['$\\frac{\\sin^2 x}{1 - \\cos x}$', '$= \\frac{1 - \\cos^2 x}{1 - \\cos x}$', '$= \\frac{(1 - \\cos x)(1 + \\cos x)}{1 - \\cos x}$', '$= 1 + \\cos x$'],
      check: { q: 'Simplify $\\frac{\\cos x + \\cos x\\sin x}{\\cos x}$.', options: ['$1 + \\sin x$', '$\\sin x$', '$1$', '$\\cos x + \\sin x$'], answer: 0, why: 'Factor the top: $\\cos x(1 + \\sin x)$. Then cancel the factor $\\cos x$.' },
    },
  ],

  'T6.prove-basic': [
    {
      say: 'A **proof** is a chain of equal expressions. Start with one side, change it one step at a time, and stop when it matches the other side.',
      example: ['Prove $\\cos x\\tan x = \\sin x$.', 'Left $= \\cos x\\cdot\\frac{\\sin x}{\\cos x}$', '$= \\sin x$', '$=$ Right. Done.'],
      check: { q: 'When is a proof finished?', options: ['When one side has become the other side', 'When you get $0 = 0$ after moving terms', 'When both sides match at one value of $x$'], answer: 0, why: 'A proof ends when the chain reaches the other side exactly.' },
    },
    {
      say: 'Work on each side **separately**. Never move terms across the equal sign, and never multiply or divide both sides. Those moves assume it is already true.',
      example: ['Allowed: rewrite the left side.', 'Allowed: rewrite the right side.', 'Not allowed: add $\\cos x$ to both sides.'],
      check: { q: 'Which move is allowed in a proof?', options: ['Rewrite $\\tan x$ as $\\frac{\\sin x}{\\cos x}$ on the left', 'Add $\\cos x$ to both sides', 'Multiply both sides by $\\cos x$', 'Divide both sides by $\\sin x$'], answer: 0, why: 'Rewriting one side with an identity keeps it equal. The others treat it like an equation.' },
    },
    {
      say: 'Start with the **more complicated** side. It has more you can simplify.',
      example: ['Prove $\\frac{1 - \\cos^2 x}{\\sin x} = \\sin x$.', 'The left side has more going on.', 'Start there: $\\frac{\\sin^2 x}{\\sin x} = \\sin x$.'],
      check: { q: 'To prove $\\frac{\\sin^2 x}{1 - \\cos x} = 1 + \\cos x$, which side should you start with?', options: ['The left side', 'The right side', 'Both at once, multiplied together'], answer: 0, why: 'The left is a fraction you can simplify.' },
    },
    {
      say: 'The most useful first tool: rewrite everything in **sine and cosine**.',
      example: ['$\\sec x - \\cos x$', '$= \\frac{1}{\\cos x} - \\cos x$'],
      check: { q: 'Write $\\tan x + \\cot x$ in sine and cosine.', options: ['$\\frac{\\sin x}{\\cos x} + \\frac{\\cos x}{\\sin x}$', '$\\frac{1}{\\cos x} + \\frac{1}{\\sin x}$', '$\\frac{\\sin x + \\cos x}{\\sin x\\cos x}$'], answer: 0, why: '$\\tan x = \\frac{\\sin x}{\\cos x}$ and $\\cot x = \\frac{\\cos x}{\\sin x}$.' },
    },
    {
      say: 'Next tool: a **common denominator** turns two parts into one fraction.',
      example: ['$\\frac{1}{\\cos x} - \\cos x$', '$= \\frac{1}{\\cos x} - \\frac{\\cos^2 x}{\\cos x}$', '$= \\frac{1 - \\cos^2 x}{\\cos x}$'],
      check: { q: 'Write $\\frac{1}{\\sin x} - \\sin x$ as one fraction.', options: ['$\\frac{1 - \\sin^2 x}{\\sin x}$', '$\\frac{1 - \\sin x}{\\sin x}$', '$1 - \\sin^2 x$', '$\\frac{1 - \\sin^2 x}{\\sin^2 x}$'], answer: 0, why: '$\\sin x = \\frac{\\sin^2 x}{\\sin x}$, so subtract the tops.' },
    },
    {
      say: 'Then use a **Pythagorean** swap, and **split** the fraction to match the target.',
      example: ['$\\frac{1 - \\cos^2 x}{\\cos x}$', '$= \\frac{\\sin^2 x}{\\cos x}$', '$= \\sin x\\cdot\\frac{\\sin x}{\\cos x}$', '$= \\sin x\\tan x$. This proves $\\sec x - \\cos x = \\sin x\\tan x$.'],
      check: { q: 'Which product equals $\\frac{\\sin^2 x}{\\cos x}$?', options: ['$\\sin x\\tan x$', '$\\tan^2 x$', '$\\sin x\\sec x$', '$\\sin x\\cot x$'], answer: 0, why: '$\\sin x\\cdot\\frac{\\sin x}{\\cos x} = \\frac{\\sin^2 x}{\\cos x}$.' },
    },
    {
      say: 'Stuck? Simplify the **other** side too, on its own. If both sides reach the same expression, the proof is done. This is called meeting in the middle.',
      example: ['Prove $\\tan x + \\cot x = \\sec x\\csc x$.', 'Left: $\\frac{\\sin x}{\\cos x} + \\frac{\\cos x}{\\sin x} = \\frac{\\sin^2 x + \\cos^2 x}{\\sin x\\cos x}$', '$= \\frac{1}{\\sin x\\cos x}$.', 'Right: $\\frac{1}{\\cos x}\\cdot\\frac{1}{\\sin x} = \\frac{1}{\\sin x\\cos x}$.', 'Both match, so it is proven.'],
      check: { q: 'What does meeting in the middle mean?', options: ['Simplify each side on its own until they match', 'Move all terms to one side and solve', 'Cross-multiply the two sides'], answer: 0, why: 'Each side is changed separately, so no rule is broken.' },
    },
    {
      say: 'Also state the **restrictions**: the values where any part of the identity is undefined.',
      example: ['$\\sec x - \\cos x = \\sin x\\tan x$', '$\\sec x$ and $\\tan x$ need $\\cos x \\ne 0$.', 'So $x \\ne \\frac{\\pi}{2} + \\pi n$, $n \\in I$.'],
      check: { q: 'What restriction does $\\csc x - \\sin x = \\cos x\\cot x$ have?', options: ['$\\sin x \\ne 0$', '$\\cos x \\ne 0$', 'None'], answer: 0, why: '$\\csc x$ and $\\cot x$ both have $\\sin x$ in the denominator.' },
    },
  ],

  'T6.exact-sum-double': [
    {
      say: 'The **sum and difference** identity for sine: $\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B$. The sign in the middle matches the sign inside.',
      example: ['$\\sin(60^\\circ + 30^\\circ) = \\sin 90^\\circ = 1$.', 'Formula: $\\sin 60^\\circ\\cos 30^\\circ + \\cos 60^\\circ\\sin 30^\\circ$', '$= \\frac{\\sqrt{3}}{2}\\cdot\\frac{\\sqrt{3}}{2} + \\frac{1}{2}\\cdot\\frac{1}{2}$', '$= \\frac{3}{4} + \\frac{1}{4} = 1$. It works.'],
      check: { q: 'Expand $\\sin(A - B)$.', options: ['$\\sin A\\cos B - \\cos A\\sin B$', '$\\sin A - \\sin B$', '$\\cos A\\cos B - \\sin A\\sin B$', '$\\sin A\\cos B + \\cos A\\sin B$'], answer: 0, why: 'Same pattern as the sum, with a minus in the middle.' },
    },
    {
      say: 'For cosine, the sign **flips**: $\\cos(A + B) = \\cos A\\cos B - \\sin A\\sin B$ and $\\cos(A - B) = \\cos A\\cos B + \\sin A\\sin B$.',
      example: ['$\\cos(60^\\circ - 30^\\circ) = \\cos 30^\\circ = \\frac{\\sqrt{3}}{2}$.', 'Formula: $\\frac{1}{2}\\cdot\\frac{\\sqrt{3}}{2} + \\frac{\\sqrt{3}}{2}\\cdot\\frac{1}{2}$', '$= \\frac{\\sqrt{3}}{4} + \\frac{\\sqrt{3}}{4} = \\frac{\\sqrt{3}}{2}$. It works.'],
      check: { q: 'Expand $\\cos(A + B)$.', options: ['$\\cos A\\cos B - \\sin A\\sin B$', '$\\cos A\\cos B + \\sin A\\sin B$', '$\\cos A + \\cos B$', '$\\sin A\\cos B + \\cos A\\sin B$'], answer: 0, why: 'For cosine the sign flips: a plus inside gives a minus in the middle.' },
    },
    {
      say: 'Never **distribute** a trig function. $\\sin(A + B)$ is not $\\sin A + \\sin B$.',
      example: ['$\\sin(60^\\circ + 30^\\circ) = 1$.', 'But $\\sin 60^\\circ + \\sin 30^\\circ = \\frac{\\sqrt{3}}{2} + \\frac{1}{2} \\approx 1.37$.', 'Not the same.'],
      check: { q: 'Is $\\cos(A - B) = \\cos A - \\cos B$?', options: ['No, use $\\cos A\\cos B + \\sin A\\sin B$', 'Yes, always', 'Only for special angles'], answer: 0, why: 'A trig function cannot be split across a sum or difference.' },
    },
    {
      say: 'For an **exact value**, write the angle as a sum or difference of special angles, like $30^\\circ$, $45^\\circ$, $60^\\circ$. Then use the identity.',
      example: ['$\\sin 75^\\circ = \\sin(45^\\circ + 30^\\circ)$', '$= \\sin 45^\\circ\\cos 30^\\circ + \\cos 45^\\circ\\sin 30^\\circ$', '$= \\frac{\\sqrt{2}}{2}\\cdot\\frac{\\sqrt{3}}{2} + \\frac{\\sqrt{2}}{2}\\cdot\\frac{1}{2}$', '$= \\frac{\\sqrt{6}}{4} + \\frac{\\sqrt{2}}{4} = \\frac{\\sqrt{6} + \\sqrt{2}}{4}$'],
      check: { q: 'Find $\\cos 15^\\circ = \\cos(45^\\circ - 30^\\circ)$.', options: ['$\\frac{\\sqrt{6} + \\sqrt{2}}{4}$', '$\\frac{\\sqrt{6} - \\sqrt{2}}{4}$', '$\\frac{\\sqrt{2} - \\sqrt{3}}{2}$'], answer: 0, why: '$\\cos 45^\\circ\\cos 30^\\circ + \\sin 45^\\circ\\sin 30^\\circ = \\frac{\\sqrt{6}}{4} + \\frac{\\sqrt{2}}{4}$.' },
    },
    {
      say: 'The **double angle** identity for sine: $\\sin 2A = 2\\sin A\\cos A$. It is not $2\\sin A$.',
      example: ['$\\sin 60^\\circ = \\sin 2(30^\\circ)$', '$= 2\\sin 30^\\circ\\cos 30^\\circ$', '$= 2\\cdot\\frac{1}{2}\\cdot\\frac{\\sqrt{3}}{2} = \\frac{\\sqrt{3}}{2}$'],
      check: { q: 'What is $2\\sin 15^\\circ\\cos 15^\\circ$?', options: ['$\\frac{1}{2}$', '$\\frac{\\sqrt{3}}{2}$', '$1$'], answer: 0, why: 'It is $\\sin 2(15^\\circ) = \\sin 30^\\circ = \\frac{1}{2}$.' },
    },
    {
      say: 'For cosine, $\\cos 2A$ has three forms: $\\cos^2 A - \\sin^2 A$, or $2\\cos^2 A - 1$, or $1 - 2\\sin^2 A$. Pick the one that fits what you know.',
      example: ['$\\cos 60^\\circ$ with $A = 30^\\circ$:', '$\\cos^2 30^\\circ - \\sin^2 30^\\circ = \\frac{3}{4} - \\frac{1}{4} = \\frac{1}{2}$.', '$1 - 2\\sin^2 30^\\circ = 1 - 2\\cdot\\frac{1}{4} = \\frac{1}{2}$.'],
      check: { q: 'What is $1 - 2\\sin^2 15^\\circ$?', options: ['$\\frac{\\sqrt{3}}{2}$', '$\\frac{1}{2}$', '$-\\frac{\\sqrt{3}}{2}$'], answer: 0, why: 'It is $\\cos 2(15^\\circ) = \\cos 30^\\circ = \\frac{\\sqrt{3}}{2}$.' },
    },
    {
      say: 'Given one ratio, find the other with a triangle, and use the quadrant for its sign. Then put both into the double-angle form.',
      example: ['$\\sin\\theta = \\frac{3}{5}$, $\\theta$ in quadrant II.', 'Third side: $\\sqrt{5^2 - 3^2} = 4$.', 'Cosine is negative in II: $\\cos\\theta = -\\frac{4}{5}$.', '$\\sin 2\\theta = 2\\cdot\\frac{3}{5}\\cdot\\left(-\\frac{4}{5}\\right) = -\\frac{24}{25}$.'],
      check: { q: '$\\sin\\theta = \\frac{3}{5}$. Find $\\cos 2\\theta$ using $1 - 2\\sin^2\\theta$.', options: ['$\\frac{7}{25}$', '$-\\frac{7}{25}$', '$\\frac{24}{25}$', '$\\frac{1}{5}$'], answer: 0, why: '$1 - 2\\cdot\\frac{9}{25} = \\frac{25}{25} - \\frac{18}{25} = \\frac{7}{25}$.' },
    },
    {
      say: 'Read an identity backwards to **condense** a long expression into one function. Tangent versions of these identities are for the excellence level.',
      example: ['$\\sin 50^\\circ\\cos 20^\\circ - \\cos 50^\\circ\\sin 20^\\circ$', 'This is the pattern $\\sin A\\cos B - \\cos A\\sin B$.', '$= \\sin(50^\\circ - 20^\\circ)$', '$= \\sin 30^\\circ = \\frac{1}{2}$'],
      check: { q: 'Condense $\\cos 70^\\circ\\cos 20^\\circ - \\sin 70^\\circ\\sin 20^\\circ$.', options: ['$\\cos 90^\\circ = 0$', '$\\cos 50^\\circ$', '$\\sin 90^\\circ = 1$'], answer: 0, why: 'It matches $\\cos(A + B)$, so it is $\\cos(70^\\circ + 20^\\circ)$.' },
    },
  ],

  'T6.prove-advanced': [
    {
      say: 'When you see a **double angle**, like $\\sin 2x$, replace it first with single-angle parts: $\\sin 2x = 2\\sin x\\cos x$.',
      example: ['$\\frac{\\sin 2x}{\\sin x}$', '$= \\frac{2\\sin x\\cos x}{\\sin x}$', '$= 2\\cos x$'],
      check: { q: 'Simplify $\\frac{\\sin 2x}{\\cos x}$.', options: ['$2\\sin x$', '$2\\cos x$', '$\\tan 2x$', '$2\\tan x$'], answer: 0, why: '$\\frac{2\\sin x\\cos x}{\\cos x} = 2\\sin x$.' },
    },
    {
      say: 'Choose the $\\cos 2x$ form that cancels the 1. Next to $1 +$, use $2\\cos^2 x - 1$. Next to $1 -$, use $1 - 2\\sin^2 x$.',
      example: ['$1 + \\cos 2x = 1 + 2\\cos^2 x - 1 = 2\\cos^2 x$', '$1 - \\cos 2x = 1 - (1 - 2\\sin^2 x) = 2\\sin^2 x$'],
      check: { q: 'For $1 - \\cos 2x$, which form of $\\cos 2x$ is best?', options: ['$1 - 2\\sin^2 x$', '$2\\cos^2 x - 1$', '$\\cos^2 x - \\sin^2 x$'], answer: 0, why: 'Then $1 - (1 - 2\\sin^2 x) = 2\\sin^2 x$, a single term.' },
    },
    {
      say: 'Put the double angles together with the basic tools: replace, then cancel common factors.',
      example: ['$\\frac{\\sin 2x}{1 + \\cos 2x}$', '$= \\frac{2\\sin x\\cos x}{2\\cos^2 x}$', '$= \\frac{\\sin x}{\\cos x}$', '$= \\tan x$'],
      check: { q: 'Simplify $\\frac{1 - \\cos 2x}{\\sin 2x}$.', options: ['$\\tan x$', '$\\cot x$', '$\\sin x$', '$\\frac{1}{2}\\tan x$'], answer: 0, why: '$\\frac{2\\sin^2 x}{2\\sin x\\cos x} = \\frac{\\sin x}{\\cos x}$.' },
    },
    {
      say: 'The **conjugate** of $1 - \\cos x$ is $1 + \\cos x$: same terms, opposite sign. Multiplying them gives $1 - \\cos^2 x$, which is $\\sin^2 x$.',
      example: ['$(1 - \\cos x)(1 + \\cos x)$', '$= 1 - \\cos^2 x$', '$= \\sin^2 x$'],
      check: { q: 'What is the conjugate of $1 + \\sin x$?', options: ['$1 - \\sin x$', '$1 + \\sin x$', '$\\cos x$', '$1 + \\cos x$'], answer: 0, why: 'Keep the terms and flip the sign between them.' },
    },
    {
      say: 'With $1 \\pm \\sin x$ or $1 \\pm \\cos x$ in a denominator, multiply the **top and bottom** by the conjugate. That is multiplying by 1, so the value stays the same.',
      example: ['$\\frac{\\sin x}{1 - \\cos x}\\cdot\\frac{1 + \\cos x}{1 + \\cos x}$', '$= \\frac{\\sin x(1 + \\cos x)}{1 - \\cos^2 x}$', '$= \\frac{\\sin x(1 + \\cos x)}{\\sin^2 x}$', '$= \\frac{1 + \\cos x}{\\sin x}$'],
      check: { q: 'To simplify $\\frac{\\cos x}{1 - \\sin x}$, what do you multiply by?', options: ['$\\frac{1 + \\sin x}{1 + \\sin x}$', '$1 + \\sin x$ in the denominator only', '$\\frac{1 - \\sin x}{1 - \\sin x}$', '$1 + \\sin x$ on both sides of the identity'], answer: 0, why: 'Top and bottom by the conjugate. Only the bottom changes the value.' },
    },
    {
      say: 'To add or subtract fractions, use a **common denominator**. Often the denominators are conjugates, so their product is a Pythagorean pattern.',
      example: ['$\\frac{1}{1 - \\sin x} + \\frac{1}{1 + \\sin x}$', '$= \\frac{(1 + \\sin x) + (1 - \\sin x)}{1 - \\sin^2 x}$', '$= \\frac{2}{\\cos^2 x}$', '$= 2\\sec^2 x$'],
      check: { q: 'What is the common denominator of $\\frac{1}{1 - \\cos x} + \\frac{1}{1 + \\cos x}$, simplified?', options: ['$\\sin^2 x$', '$\\cos^2 x$', '$2$', '$1 - \\cos x$'], answer: 0, why: '$(1 - \\cos x)(1 + \\cos x) = 1 - \\cos^2 x = \\sin^2 x$.' },
    },
    {
      say: 'Look for a **difference of squares** to factor: $a^2 - b^2 = (a - b)(a + b)$. Powers of 4 are squares of squares.',
      example: ['$\\cos^4 x - \\sin^4 x$', '$= (\\cos^2 x - \\sin^2 x)(\\cos^2 x + \\sin^2 x)$', '$= (\\cos^2 x - \\sin^2 x)(1)$', '$= \\cos 2x$'],
      check: { q: 'Simplify $\\sin^4 x - \\cos^4 x$.', options: ['$-\\cos 2x$', '$\\cos 2x$', '$1$', '$\\sin 2x$'], answer: 0, why: 'It factors to $(\\sin^2 x - \\cos^2 x)(1)$, which is $-(\\cos^2 x - \\sin^2 x)$.' },
    },
    {
      say: 'Every line must equal the line before. Record restrictions from every denominator in the **original** identity.',
      example: ['$\\frac{\\sin x}{1 - \\cos x}$', '$1 - \\cos x \\ne 0$', '$\\cos x \\ne 1$', '$x \\ne 2\\pi n$, $n \\in I$'],
      check: { q: 'Which values are not allowed in $\\frac{1}{1 + \\sin x}$?', options: ['$x = \\frac{3\\pi}{2} + 2\\pi n$', '$x = \\frac{\\pi}{2} + 2\\pi n$', '$x = \\pi n$'], answer: 0, why: '$1 + \\sin x = 0$ when $\\sin x = -1$, at $\\frac{3\\pi}{2}$ plus full turns.' },
    },
  ],

  'T5.identity-sub': [
    {
      say: 'Some equations mix functions or angles, like $\\sin 2x$ and $\\sin x$. Swap in an **identity** so you get one trig function, or a common factor. Then solve as before.',
      example: ['$\\sin 2x = \\sin x$ has $2x$ and $x$.', 'Replace $\\sin 2x$ with $2\\sin x\\cos x$.', 'Now every term uses $x$ only.'],
      check: { q: 'Which equation needs an identity before you can factor?', options: ['$\\sin 2x = \\sin x$', '$2\\sin^2 x - \\sin x = 0$', '$2\\cos x - 1 = 0$'], answer: 0, why: 'It mixes $2x$ and $x$. The others already use one function of $x$.' },
    },
    {
      say: 'With $\\sin 2x$: replace it with $2\\sin x\\cos x$, move everything to one side, and factor out the common part.',
      example: ['$\\sin 2x = \\sin x$', '$2\\sin x\\cos x - \\sin x = 0$', '$\\sin x(2\\cos x - 1) = 0$', '$\\sin x = 0$ or $\\cos x = \\frac{1}{2}$'],
      check: { q: 'Substitute and factor $\\sin 2x = \\cos x$.', options: ['$\\cos x(2\\sin x - 1) = 0$', '$\\sin x(2\\cos x - 1) = 0$', '$\\cos x(2\\sin x) = 0$', '$2\\cos x(\\sin x - 1) = 0$'], answer: 0, why: '$2\\sin x\\cos x - \\cos x = 0$, and $\\cos x$ is common.' },
    },
    {
      say: 'Solve each factor over the domain, then list all the answers together.',
      example: ['$\\sin x = 0$: $x = 0, \\pi$.', '$\\cos x = \\frac{1}{2}$: $x = \\frac{\\pi}{3}, \\frac{5\\pi}{3}$.', 'For $0 \\le x < 2\\pi$: $x = 0, \\frac{\\pi}{3}, \\pi, \\frac{5\\pi}{3}$.'],
      check: { q: 'Solve $\\cos x(2\\sin x - 1) = 0$ for $0 \\le x < 2\\pi$.', options: ['$\\frac{\\pi}{6}, \\frac{\\pi}{2}, \\frac{5\\pi}{6}, \\frac{3\\pi}{2}$', '$\\frac{\\pi}{6}, \\frac{5\\pi}{6}$', '$\\frac{\\pi}{2}, \\frac{3\\pi}{2}$', '$\\frac{\\pi}{6}, \\frac{\\pi}{2}, \\frac{5\\pi}{6}$'], answer: 0, why: '$\\cos x = 0$ gives $\\frac{\\pi}{2}, \\frac{3\\pi}{2}$. $\\sin x = \\frac{1}{2}$ gives $\\frac{\\pi}{6}, \\frac{5\\pi}{6}$.' },
    },
    {
      say: 'With $\\cos 2x$, pick the form that matches the other terms. If the rest has $\\sin x$, use $1 - 2\\sin^2 x$. If the rest has $\\cos x$, use $2\\cos^2 x - 1$.',
      example: ['$\\cos 2x = \\sin x$: other term is $\\sin x$.', 'Use $1 - 2\\sin^2 x$.', '$\\cos 2x = \\cos x$: other term is $\\cos x$.', 'Use $2\\cos^2 x - 1$.'],
      check: { q: 'For $\\cos 2x + 3\\cos x + 2 = 0$, replace $\\cos 2x$ with:', options: ['$2\\cos^2 x - 1$', '$1 - 2\\sin^2 x$', '$2\\cos x$', '$\\cos^2 x$'], answer: 0, why: 'The other terms use $\\cos x$, so this form leaves only cosine.' },
    },
    {
      say: 'After the swap you often get a quadratic in one function. Move everything to one side and factor.',
      example: ['$\\cos 2x = \\sin x$', '$1 - 2\\sin^2 x = \\sin x$', '$0 = 2\\sin^2 x + \\sin x - 1$', '$0 = (2\\sin x - 1)(\\sin x + 1)$', '$\\sin x = \\frac{1}{2}$ or $\\sin x = -1$'],
      check: { q: '$\\cos 2x = \\cos x$ becomes $2\\cos^2 x - \\cos x - 1 = 0$. What does it give?', options: ['$\\cos x = -\\frac{1}{2}$ or $\\cos x = 1$', '$\\cos x = \\frac{1}{2}$ or $\\cos x = -1$', '$\\cos x = \\frac{1}{2}$ or $\\cos x = 1$', '$\\cos x = -\\frac{1}{2}$ or $\\cos x = -1$'], answer: 0, why: 'It factors as $(2\\cos x + 1)(\\cos x - 1) = 0$.' },
    },
    {
      say: 'A **Pythagorean** swap also works: replace $\\sin^2 x$ with $1 - \\cos^2 x$ (or $\\cos^2 x$ with $1 - \\sin^2 x$) so only one function is left.',
      example: ['$2\\sin^2 x = 3\\cos x$', '$2(1 - \\cos^2 x) = 3\\cos x$', '$0 = 2\\cos^2 x + 3\\cos x - 2$', '$0 = (2\\cos x - 1)(\\cos x + 2)$', '$\\cos x = \\frac{1}{2}$. Reject $\\cos x = -2$.'],
      check: { q: 'For $\\sec^2 x - \\tan x - 1 = 0$, replace $\\sec^2 x$ with:', options: ['$1 + \\tan^2 x$', '$1 - \\tan^2 x$', '$\\tan^2 x - 1$', '$1 + \\tan x$'], answer: 0, why: '$1 + \\tan^2 x = \\sec^2 x$. Then the equation is $\\tan^2 x - \\tan x = 0$.' },
    },
    {
      say: 'If you see a sum or difference pattern, **condense** it into one function first, then solve.',
      example: ['$\\cos x\\cos\\frac{\\pi}{4} - \\sin x\\sin\\frac{\\pi}{4} = \\frac{1}{2}$', 'Pattern $\\cos A\\cos B - \\sin A\\sin B = \\cos(A + B)$.', '$\\cos\\left(x + \\frac{\\pi}{4}\\right) = \\frac{1}{2}$', 'So $x + \\frac{\\pi}{4} = \\frac{\\pi}{3}$ (and more), giving $x = \\frac{\\pi}{12}$.'],
      check: { q: 'Condense $\\sin x\\cos\\frac{\\pi}{3} + \\cos x\\sin\\frac{\\pi}{3}$.', options: ['$\\sin\\left(x + \\frac{\\pi}{3}\\right)$', '$\\sin\\left(x - \\frac{\\pi}{3}\\right)$', '$\\cos\\left(x + \\frac{\\pi}{3}\\right)$', '$\\sin x + \\sin\\frac{\\pi}{3}$'], answer: 0, why: 'It matches $\\sin A\\cos B + \\cos A\\sin B = \\sin(A + B)$.' },
    },
    {
      say: 'Never divide both sides by a trig expression. You lose the answers where it is 0. Factor it out instead.',
      example: ['$\\sin 2x = \\sin x$ becomes $2\\sin x\\cos x = \\sin x$.', 'Dividing by $\\sin x$ leaves $2\\cos x = 1$ only.', 'That loses $\\sin x = 0$: $x = 0, \\pi$.'],
      check: { q: 'In $2\\sin x\\cos x = \\sin x$ on $0 \\le x < 2\\pi$, which answers are lost by dividing by $\\sin x$?', options: ['$0$ and $\\pi$', '$\\frac{\\pi}{3}$ and $\\frac{5\\pi}{3}$', '$\\frac{\\pi}{2}$ and $\\frac{3\\pi}{2}$', 'None'], answer: 0, why: 'Those are where $\\sin x = 0$.' },
    },
    {
      say: 'If you make a quotient, like $\\frac{\\sin x}{\\cos x}$, check that the value you divided out is not a solution. Equations like $\\sin 3x = \\frac{1}{2}$ are outside this course for algebra; solve those on the graphing calculator.',
      example: ['$\\sin x = \\sqrt{3}\\cos x$', 'If $\\cos x = 0$: the left is $\\pm 1$ but the right is $0$. So no answer is lost.', 'Divide: $\\tan x = \\sqrt{3}$.', 'For $0 \\le x < 2\\pi$: $x = \\frac{\\pi}{3}, \\frac{4\\pi}{3}$.'],
      check: { q: 'Solve $\\tan x = \\sqrt{3}$ for $0 \\le x < 2\\pi$.', options: ['$\\frac{\\pi}{3}, \\frac{4\\pi}{3}$', '$\\frac{\\pi}{3}, \\frac{2\\pi}{3}$', '$\\frac{\\pi}{3}, \\frac{5\\pi}{3}$', '$\\frac{\\pi}{3}$'], answer: 0, why: 'Tangent is positive in I and III: $\\frac{\\pi}{3}$ and $\\pi + \\frac{\\pi}{3}$.' },
    },
  ],
};
