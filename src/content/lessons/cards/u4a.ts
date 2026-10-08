import type { LessonCard } from '../types';

/** Lesson cards in plain words, one small idea per card. Keyed by skill node id. */
export const CARDS: Record<string, LessonCard[]> = {
  'T1.radians': [
    {
      say: 'A **radian** is another unit for measuring an angle. An angle of 1 radian cuts off an arc exactly as long as the radius. In general, the angle is $\\theta = \\frac{a}{r}$: arc length over radius.',
      example: ['Radius $r = 5$ cm, arc $a = 5$ cm.', '$\\theta = \\frac{a}{r} = \\frac{5}{5}$', '$\\theta = 1$ radian'],
      check: { q: 'A circle has radius 4 cm. An arc on it is 8 cm long. What is the angle?', options: ['2 radians', '$\\frac{1}{2}$ radian', '32 radians', '8 radians'], answer: 0, why: '$\\theta = \\frac{a}{r} = \\frac{8}{4} = 2$ radians.' },
    },
    {
      say: 'One full turn is $360^\\circ$. In radians, one full turn is $2\\pi$. Cut both in half and you get the key fact: $180^\\circ = \\pi$.',
      example: ['A full turn has arc $2\\pi r$.', 'Angle: $\\frac{2\\pi r}{r} = 2\\pi$.', 'So $360^\\circ = 2\\pi$.', 'Halve both: $180^\\circ = \\pi$.'],
      check: { q: 'How many radians is $90^\\circ$?', options: ['$\\frac{\\pi}{2}$', '$\\pi$', '$2\\pi$', '$\\frac{\\pi}{4}$'], answer: 0, why: '$90^\\circ$ is half of $180^\\circ$, so it is half of $\\pi$.' },
    },
    {
      say: 'To change **degrees to radians**, multiply by $\\frac{\\pi}{180^\\circ}$. Then reduce the fraction.',
      example: ['$150^\\circ \\times \\frac{\\pi}{180^\\circ}$', '$= \\frac{150\\pi}{180}$', 'Divide top and bottom by 30.', '$= \\frac{5\\pi}{6}$'],
      check: { q: 'Change $120^\\circ$ to radians.', options: ['$\\frac{2\\pi}{3}$', '$\\frac{3\\pi}{2}$', '$\\frac{\\pi}{3}$', '$\\frac{4\\pi}{3}$'], answer: 0, why: '$\\frac{120\\pi}{180} = \\frac{2\\pi}{3}$ after dividing top and bottom by 60.' },
    },
    {
      say: 'A **negative angle** converts the same way. Keep the minus sign the whole time.',
      example: ['$-225^\\circ \\times \\frac{\\pi}{180^\\circ}$', '$= -\\frac{225\\pi}{180}$', 'Divide top and bottom by 45.', '$= -\\frac{5\\pi}{4}$'],
      check: { q: 'Change $-60^\\circ$ to radians.', options: ['$-\\frac{\\pi}{3}$', '$\\frac{\\pi}{3}$', '$-\\frac{\\pi}{6}$', '$-\\frac{2\\pi}{3}$'], answer: 0, why: '$-\\frac{60\\pi}{180} = -\\frac{\\pi}{3}$.' },
    },
    {
      say: 'To change **radians to degrees**, replace $\\pi$ with $180^\\circ$. Then do the arithmetic.',
      example: ['$\\frac{7\\pi}{4}$', '$= \\frac{7(180^\\circ)}{4}$', '$= \\frac{1260^\\circ}{4}$', '$= 315^\\circ$'],
      check: { q: 'Change $\\frac{5\\pi}{3}$ to degrees.', options: ['$300^\\circ$', '$150^\\circ$', '$540^\\circ$', '$330^\\circ$'], answer: 0, why: '$\\frac{5(180^\\circ)}{3} = \\frac{900^\\circ}{3} = 300^\\circ$.' },
    },
    {
      say: 'Learn four **anchor angles**: $\\frac{\\pi}{6} = 30^\\circ$, $\\frac{\\pi}{4} = 45^\\circ$, $\\frac{\\pi}{3} = 60^\\circ$, $\\frac{\\pi}{2} = 90^\\circ$. Every special angle is a whole number of copies of one of them.',
      example: ['$\\frac{5\\pi}{6}$ is 5 copies of $\\frac{\\pi}{6}$.', 'Each copy is $30^\\circ$.', '$5 \\times 30^\\circ = 150^\\circ$'],
      check: { q: 'How many degrees is $\\frac{3\\pi}{4}$?', options: ['$135^\\circ$', '$45^\\circ$', '$120^\\circ$', '$270^\\circ$'], answer: 0, why: 'It is 3 copies of $\\frac{\\pi}{4} = 45^\\circ$, and $3 \\times 45^\\circ = 135^\\circ$.' },
    },
    {
      say: 'A radian measure does not need $\\pi$ in it. One radian is about $57.3^\\circ$. To convert, multiply by $\\frac{180^\\circ}{\\pi}$ on your calculator.',
      example: ['$2.5$ radians', '$= 2.5 \\times \\frac{180^\\circ}{\\pi}$', '$= \\frac{450^\\circ}{\\pi}$', '$\\approx 143.2^\\circ$'],
      check: { q: 'About how many degrees is 2 radians?', options: ['About $115^\\circ$', 'About $360^\\circ$', 'About $2^\\circ$', 'About $180^\\circ$'], answer: 0, why: '$2 \\times 57.3^\\circ \\approx 114.6^\\circ$, about $115^\\circ$.' },
    },
  ],

  'T1.coterminal': [
    {
      say: 'An angle in **standard position** starts on the positive $x$-axis. Its end side is the **terminal arm**. Turning counterclockwise gives a positive angle. Turning clockwise gives a negative angle.',
      example: ['$90^\\circ$: a quarter turn counterclockwise.', 'The arm points straight up.', '$-90^\\circ$: a quarter turn clockwise.', 'The arm points straight down.'],
      check: { q: 'Which way do you turn to draw $-120^\\circ$?', options: ['Clockwise', 'Counterclockwise', 'Either way works'], answer: 0, why: 'A negative angle turns clockwise.' },
    },
    {
      say: '**Coterminal** angles end on the same terminal arm. They differ by whole turns, so you add or subtract $360^\\circ$.',
      example: ['Start at $30^\\circ$.', '$30^\\circ + 360^\\circ = 390^\\circ$', '$30^\\circ - 360^\\circ = -330^\\circ$', 'All three end on the same arm.'],
      check: { q: 'Which angle is coterminal with $50^\\circ$?', options: ['$410^\\circ$', '$230^\\circ$', '$-50^\\circ$', '$310^\\circ$'], answer: 0, why: '$50^\\circ + 360^\\circ = 410^\\circ$, one full turn more.' },
    },
    {
      say: 'Adding $180^\\circ$ is only half a turn. It points the arm the opposite way, so the new angle is **not** coterminal.',
      example: ['$30^\\circ + 180^\\circ = 210^\\circ$', '$30^\\circ$ points up and to the right.', '$210^\\circ$ points down and to the left.'],
      check: { q: 'Is $\\frac{\\pi}{4} + \\pi$ coterminal with $\\frac{\\pi}{4}$?', options: ['No, $\\pi$ is only half a turn', 'Yes, any multiple of $\\pi$ works', 'Yes, they have the same reference angle'], answer: 0, why: 'Coterminal angles differ by full turns of $2\\pi$. Adding $\\pi$ points the arm the opposite way.' },
    },
    {
      say: 'In radians, a full turn is $2\\pi$. Write $2\\pi$ with the same bottom number as your angle, then add or subtract.',
      example: ['$\\frac{\\pi}{3} - 2\\pi$', '$= \\frac{\\pi}{3} - \\frac{6\\pi}{3}$', '$= -\\frac{5\\pi}{3}$'],
      check: { q: 'Which angle is coterminal with $\\frac{\\pi}{4}$?', options: ['$\\frac{9\\pi}{4}$', '$\\frac{5\\pi}{4}$', '$-\\frac{\\pi}{4}$', '$\\frac{3\\pi}{4}$'], answer: 0, why: '$\\frac{\\pi}{4} + \\frac{8\\pi}{4} = \\frac{9\\pi}{4}$, one full turn more.' },
    },
    {
      say: 'To list coterminal angles in a **domain** (an allowed interval), keep adding and subtracting full turns. Stop when you leave the domain.',
      example: ['$\\frac{\\pi}{3}$ in $-2\\pi \\le \\theta \\le 2\\pi$', 'Add: $\\frac{\\pi}{3} + \\frac{6\\pi}{3} = \\frac{7\\pi}{3}$. Too big.', 'Subtract: $\\frac{\\pi}{3} - \\frac{6\\pi}{3} = -\\frac{5\\pi}{3}$. Inside.', 'Subtract again: $-\\frac{11\\pi}{3}$. Too small.', 'Coterminal angles: $-\\frac{5\\pi}{3}$ and $\\frac{\\pi}{3}$.'],
      check: { q: 'List the angles coterminal with $100^\\circ$ in $-360^\\circ \\le \\theta \\le 360^\\circ$, other than $100^\\circ$.', options: ['$-260^\\circ$', '$-260^\\circ$ and $460^\\circ$', '$-100^\\circ$', '$280^\\circ$'], answer: 0, why: '$100^\\circ - 360^\\circ = -260^\\circ$ is inside. $460^\\circ$ is past $360^\\circ$, so it is outside.' },
    },
    {
      say: 'To find the coterminal angle from $0^\\circ$ to $360^\\circ$, add or subtract $360^\\circ$ as many times as you need.',
      example: ['$-510^\\circ + 360^\\circ = -150^\\circ$. Still negative.', '$-150^\\circ + 360^\\circ = 210^\\circ$', 'So $-510^\\circ$ ends where $210^\\circ$ does.'],
      check: { q: 'Which angle from $0^\\circ$ to $360^\\circ$ is coterminal with $800^\\circ$?', options: ['$80^\\circ$', '$440^\\circ$', '$100^\\circ$', '$260^\\circ$'], answer: 0, why: '$800^\\circ - 360^\\circ - 360^\\circ = 80^\\circ$.' },
    },
    {
      say: 'The **general form** names every coterminal angle at once: $\\theta + 360^\\circ n$, $n \\in I$. Here $n \\in I$ means $n$ is any **integer**: a whole number, positive, negative or zero.',
      example: ['Angle $210^\\circ$.', 'General form: $210^\\circ + 360^\\circ n$, $n \\in I$', '$n = 1$: $210^\\circ + 360^\\circ = 570^\\circ$', '$n = -1$: $210^\\circ - 360^\\circ = -150^\\circ$'],
      check: { q: 'Which is the general form for angles coterminal with $\\frac{\\pi}{6}$?', options: ['$\\frac{\\pi}{6} + 2\\pi n$, $n \\in I$', '$\\frac{\\pi}{6} + \\pi n$, $n \\in I$', '$\\frac{\\pi}{6} + 360n$, $n \\in I$', '$\\frac{\\pi}{6} + 2\\pi$'], answer: 0, why: 'In radians a full turn is $2\\pi$, and $n$ counts the turns.' },
    },
  ],

  'T1.reference': [
    {
      say: 'The axes split the plane into four **quadrants**, numbered counterclockwise. I: $0^\\circ$ to $90^\\circ$. II: $90^\\circ$ to $180^\\circ$. III: $180^\\circ$ to $270^\\circ$. IV: $270^\\circ$ to $360^\\circ$.',
      example: ['$\\theta = 200^\\circ$', '$200^\\circ$ is between $180^\\circ$ and $270^\\circ$.', 'So it is in quadrant III.'],
      check: { q: 'Which quadrant holds $300^\\circ$?', options: ['IV', 'III', 'II', 'I'], answer: 0, why: '$300^\\circ$ is between $270^\\circ$ and $360^\\circ$.' },
    },
    {
      say: 'The **reference angle** is the sharp (acute) angle between the terminal arm and the $x$-axis. It is always positive and between $0^\\circ$ and $90^\\circ$.',
      example: ['$\\theta = 150^\\circ$ ends in quadrant II.', 'The nearest part of the $x$-axis is at $180^\\circ$.', 'The gap is $180^\\circ - 150^\\circ = 30^\\circ$.', 'Reference angle: $30^\\circ$.'],
      check: { q: 'What is the reference angle of $135^\\circ$?', options: ['$45^\\circ$', '$135^\\circ$', '$225^\\circ$', '$35^\\circ$'], answer: 0, why: '$135^\\circ$ is in quadrant II, and $180^\\circ - 135^\\circ = 45^\\circ$.' },
    },
    {
      say: 'Each quadrant has its own rule. I: $\\theta$. II: $180^\\circ - \\theta$. III: $\\theta - 180^\\circ$. IV: $360^\\circ - \\theta$. Every rule measures to the $x$-axis, never the $y$-axis.',
      example: ['$\\theta = 300^\\circ$ is in quadrant IV.', '$360^\\circ - 300^\\circ = 60^\\circ$', 'Reference angle: $60^\\circ$.'],
      check: { q: 'What is the reference angle of $250^\\circ$?', options: ['$70^\\circ$', '$20^\\circ$', '$110^\\circ$', '$250^\\circ$'], answer: 0, why: '$250^\\circ$ is in quadrant III, so $250^\\circ - 180^\\circ = 70^\\circ$. The $20^\\circ$ is measured to the $y$-axis.' },
    },
    {
      say: 'In radians, use $\\pi$ in place of $180^\\circ$ and $2\\pi$ in place of $360^\\circ$. Give them the same bottom number as the angle before you subtract.',
      example: ['$\\theta = \\frac{5\\pi}{4}$ is between $\\pi$ and $\\frac{3\\pi}{2}$: quadrant III.', '$\\frac{5\\pi}{4} - \\pi$', '$= \\frac{5\\pi}{4} - \\frac{4\\pi}{4}$', '$= \\frac{\\pi}{4}$'],
      check: { q: 'What is the reference angle of $\\frac{5\\pi}{6}$?', options: ['$\\frac{\\pi}{6}$', '$\\frac{5\\pi}{6}$', '$\\frac{\\pi}{3}$', '$\\frac{11\\pi}{6}$'], answer: 0, why: '$\\frac{5\\pi}{6}$ is in quadrant II, so $\\pi - \\frac{5\\pi}{6} = \\frac{6\\pi}{6} - \\frac{5\\pi}{6} = \\frac{\\pi}{6}$.' },
    },
    {
      say: 'If the angle is negative or bigger than $360^\\circ$, first find its coterminal angle from $0^\\circ$ to $360^\\circ$. Then use the quadrant rule.',
      example: ['$\\theta = -120^\\circ$', '$-120^\\circ + 360^\\circ = 240^\\circ$, quadrant III.', '$240^\\circ - 180^\\circ = 60^\\circ$', 'Reference angle: $60^\\circ$.'],
      check: { q: 'What is the reference angle of $480^\\circ$?', options: ['$60^\\circ$', '$120^\\circ$', '$300^\\circ$', '$30^\\circ$'], answer: 0, why: '$480^\\circ - 360^\\circ = 120^\\circ$, in quadrant II. Then $180^\\circ - 120^\\circ = 60^\\circ$.' },
    },
    {
      say: 'You can also go backwards. One reference angle gives exactly one angle in each quadrant. Use the quadrant rules in reverse.',
      example: ['Reference angle $\\frac{\\pi}{4}$.', 'I: $\\frac{\\pi}{4}$', 'II: $\\pi - \\frac{\\pi}{4} = \\frac{3\\pi}{4}$', 'III: $\\pi + \\frac{\\pi}{4} = \\frac{5\\pi}{4}$', 'IV: $2\\pi - \\frac{\\pi}{4} = \\frac{7\\pi}{4}$'],
      check: { q: 'Which angle in quadrant III has reference angle $20^\\circ$?', options: ['$200^\\circ$', '$160^\\circ$', '$340^\\circ$', '$250^\\circ$'], answer: 0, why: 'In quadrant III, $\\theta = 180^\\circ + 20^\\circ = 200^\\circ$.' },
    },
    {
      say: 'Reference angles matter because a trig ratio of $\\theta$ equals the same ratio of its reference angle, except maybe for the sign. The quadrant decides the sign.',
      example: ['$\\sin 150^\\circ$: reference angle $30^\\circ$.', '$\\sin 30^\\circ = \\frac{1}{2}$', 'Sine is positive in quadrant II.', 'So $\\sin 150^\\circ = \\frac{1}{2}$.'],
      check: { q: 'Ignoring the sign, $\\cos 120^\\circ$ has the same value as which of these?', options: ['$\\cos 60^\\circ$', '$\\cos 30^\\circ$', '$\\cos 20^\\circ$'], answer: 0, why: 'The reference angle of $120^\\circ$ is $180^\\circ - 120^\\circ = 60^\\circ$.' },
    },
  ],

  'T1.arc-length': [
    {
      say: 'The **arc length** $a$ is the distance along the curved edge of a circle. With the angle $\\theta$ in radians, $a = r\\theta$, where $r$ is the radius.',
      example: ['$r = 4$ cm, $\\theta = 3$ radians.', '$a = r\\theta = 4 \\times 3$', '$a = 12$ cm'],
      check: { q: 'Radius 5 m, angle 2 radians. What is the arc length?', options: ['10 m', '2.5 m', '7 m', '0.4 m'], answer: 0, why: '$a = r\\theta = 5 \\times 2 = 10$ m.' },
    },
    {
      say: 'The formula only works with radians. If the angle is in degrees, change it to radians first.',
      example: ['$r = 6$ cm, $\\theta = 60^\\circ$.', '$60^\\circ = \\frac{60\\pi}{180} = \\frac{\\pi}{3}$', '$a = 6 \\times \\frac{\\pi}{3} = 2\\pi$', '$a \\approx 6.28$ cm'],
      check: { q: 'Radius 2 cm, angle $90^\\circ$. What is the arc length?', options: ['$\\pi$ cm', '$180$ cm', '$2\\pi$ cm', '$\\frac{\\pi}{2}$ cm'], answer: 0, why: '$90^\\circ = \\frac{\\pi}{2}$, so $a = 2 \\times \\frac{\\pi}{2} = \\pi$ cm. Using 90 directly gives the wrong 180.' },
    },
    {
      say: 'The arc and the radius use the same length unit. If $r$ is in metres, $a$ comes out in metres. Radians have no unit, so they do not change it.',
      example: ['$r = 2$ m, $\\theta = 0.5$ radians.', '$a = 2 \\times 0.5$', '$a = 1$ m'],
      check: { q: 'Radius 3 m, angle 1.5 radians. What is the arc length?', options: ['4.5 m', '4.5 m²', '2 m', '0.5 m'], answer: 0, why: '$a = 3 \\times 1.5 = 4.5$, in metres like the radius.' },
    },
    {
      say: 'You can rearrange the formula to find the other letters: $\\theta = \\frac{a}{r}$ and $r = \\frac{a}{\\theta}$.',
      example: ['Arc 15 cm, angle 2.5 radians. Find $r$.', '$r = \\frac{a}{\\theta}$', '$r = \\frac{15}{2.5}$', '$r = 6$ cm'],
      check: { q: 'An arc of 12 cm is on a circle of radius 4 cm. What is the angle?', options: ['3 radians', '48 radians', '$\\frac{1}{3}$ radian', '8 radians'], answer: 0, why: '$\\theta = \\frac{a}{r} = \\frac{12}{4} = 3$ radians.' },
    },
    {
      say: 'A wheel that turns once sweeps $2\\pi$ radians. A point on its rim travels one **circumference**, $2\\pi r$. For $n$ turns the angle is $2\\pi n$, so the distance is $2\\pi r n$.',
      example: ['Radius 30 cm, 5 turns.', 'Angle: $5 \\times 2\\pi = 10\\pi$ radians', '$a = 30 \\times 10\\pi = 300\\pi$', '$a \\approx 942.5$ cm'],
      check: { q: 'A wheel of radius 10 cm turns 3 times. What is the exact distance?', options: ['$60\\pi$ cm', '$30\\pi$ cm', '$30$ cm', '$20\\pi$ cm'], answer: 0, why: '$2\\pi r n = 2\\pi \\times 10 \\times 3 = 60\\pi$ cm.' },
    },
    {
      say: 'Some questions give a speed in **revolutions per minute** (rpm): turns per minute. Find the number of turns first, then the angle, then the distance.',
      example: ['Radius 20 cm, 60 rpm, for 30 s.', '30 s is half a minute: $60 \\times 0.5 = 30$ turns.', 'Angle: $30 \\times 2\\pi = 60\\pi$', '$a = 20 \\times 60\\pi = 1200\\pi$ cm', '$1200\\pi \\approx 3769.9$ cm $\\approx 37.7$ m'],
      check: { q: 'A wheel turns at 120 rpm. How many turns does it make in 15 s?', options: ['30', '1800', '8', '120'], answer: 0, why: '15 s is a quarter of a minute, and $120 \\times \\frac{1}{4} = 30$.' },
    },
    {
      say: 'Keep $\\pi$ exact through every step. Round only the final answer, so your answer does not drift.',
      example: ['Pendulum: length 90 cm, swings $40^\\circ$.', '$40^\\circ = \\frac{40\\pi}{180} = \\frac{2\\pi}{9}$', '$a = 90 \\times \\frac{2\\pi}{9} = 20\\pi$', '$a \\approx 62.8$ cm'],
      check: { q: 'Radius 9 cm, angle $\\frac{2\\pi}{3}$. What is the exact arc length?', options: ['$6\\pi$ cm', '$\\frac{2\\pi}{27}$ cm', '$18\\pi$ cm', '$6$ cm'], answer: 0, why: '$9 \\times \\frac{2\\pi}{3} = \\frac{18\\pi}{3} = 6\\pi$ cm.' },
    },
  ],

  'T2.unit-circle-eq': [
    {
      say: 'The **unit circle** is centred at the origin with radius 1. Every point $(x, y)$ on it fits the equation $x^2 + y^2 = 1$.',
      example: ['Point $(0.6, 0.8)$', '$0.6^2 + 0.8^2$', '$= 0.36 + 0.64$', '$= 1$, so the point is on the circle.'],
      check: { q: 'Which point is on the unit circle?', options: ['$(0, -1)$', '$(1, 1)$', '$(0.5, 0.5)$', '$(2, 0)$'], answer: 0, why: '$0^2 + (-1)^2 = 1$. The others give 2, 0.5 and 4.' },
    },
    {
      say: 'The terminal arm of angle $\\theta$ crosses the unit circle at one point, called $P(\\theta)$. Its $x$-coordinate is $\\cos\\theta$. Its $y$-coordinate is $\\sin\\theta$.',
      example: ['$P(\\theta) = (\\cos\\theta, \\sin\\theta)$', 'If $P(\\theta) = (0.6, 0.8)$:', '$\\cos\\theta = 0.6$ and $\\sin\\theta = 0.8$'],
      check: { q: '$P(\\theta) = \\left(-\\frac{5}{13}, \\frac{12}{13}\\right)$. What is $\\sin\\theta$?', options: ['$\\frac{12}{13}$', '$-\\frac{5}{13}$', '$-\\frac{12}{5}$', '$\\frac{5}{13}$'], answer: 0, why: 'Sine is the $y$-coordinate, the second number.' },
    },
    {
      say: 'The same point gives the other ratios. $\\tan\\theta = \\frac{y}{x}$. Three more are **reciprocals** (flipped fractions): $\\csc\\theta = \\frac{1}{y}$, $\\sec\\theta = \\frac{1}{x}$, $\\cot\\theta = \\frac{x}{y}$.',
      example: ['$P(\\theta) = \\left(-\\frac{3}{5}, \\frac{4}{5}\\right)$', '$\\tan\\theta = \\frac{4}{5} \\div \\left(-\\frac{3}{5}\\right) = -\\frac{4}{3}$', '$\\sec\\theta = 1 \\div \\left(-\\frac{3}{5}\\right) = -\\frac{5}{3}$'],
      check: { q: '$P(\\theta) = \\left(\\frac{5}{13}, -\\frac{12}{13}\\right)$. What is $\\csc\\theta$?', options: ['$-\\frac{13}{12}$', '$\\frac{13}{5}$', '$-\\frac{12}{13}$', '$\\frac{13}{12}$'], answer: 0, why: '$\\csc\\theta = \\frac{1}{y}$. Flip $-\\frac{12}{13}$ to get $-\\frac{13}{12}$.' },
    },
    {
      say: 'The quadrant tells you the signs of the coordinates. I: $(+, +)$. II: $(-, +)$. III: $(-, -)$. IV: $(+, -)$.',
      example: ['Quadrant II is up and to the left.', 'Left means $x$ is negative.', 'Up means $y$ is positive.'],
      check: { q: 'In quadrant III, what are the signs of $x$ and $y$?', options: ['Both negative', 'Both positive', '$x$ negative, $y$ positive', '$x$ positive, $y$ negative'], answer: 0, why: 'Quadrant III is down and to the left, so both coordinates are negative.' },
    },
    {
      say: 'To find a missing coordinate, put the known one into $x^2 + y^2 = 1$ and solve. The square root gives $\\pm$, so pick the sign from the quadrant.',
      example: ['$P\\left(\\frac{1}{3}, y\\right)$ in quadrant IV', '$\\left(\\frac{1}{3}\\right)^2 + y^2 = 1$', '$y^2 = 1 - \\frac{1}{9} = \\frac{8}{9}$', '$y = \\pm\\frac{\\sqrt{8}}{3} = \\pm\\frac{2\\sqrt{2}}{3}$', 'Quadrant IV: $y$ is negative, so $y = -\\frac{2\\sqrt{2}}{3}$.'],
      check: { q: '$P\\left(x, \\frac{4}{5}\\right)$ is in quadrant II. What is $x$?', options: ['$-\\frac{3}{5}$', '$\\frac{3}{5}$', '$-\\frac{1}{5}$', '$\\frac{9}{25}$'], answer: 0, why: '$x^2 = 1 - \\frac{16}{25} = \\frac{9}{25}$, so $x = \\pm\\frac{3}{5}$. Quadrant II needs $x$ negative.' },
    },
    {
      say: 'The circle is symmetric. Flip $P(\\theta) = (a, b)$ across the $y$-axis and only $x$ changes sign: $(-a, b)$. That flipped point is $P(\\pi - \\theta)$.',
      example: ['$P(\\theta) = (0.6, 0.8)$', 'Flip across the $y$-axis.', '$P(\\pi - \\theta) = (-0.6, 0.8)$'],
      check: { q: '$P(\\theta) = (0.28, 0.96)$. What is $P(\\pi - \\theta)$?', options: ['$(-0.28, 0.96)$', '$(0.28, -0.96)$', '$(-0.28, -0.96)$', '$(0.96, 0.28)$'], answer: 0, why: '$\\pi - \\theta$ is the flip across the $y$-axis, so only $x$ changes sign.' },
    },
    {
      say: 'Flip across the $x$-axis and only $y$ changes sign: $(a, -b) = P(-\\theta)$. A half turn through the origin changes both signs: $(-a, -b) = P(\\theta + \\pi)$.',
      example: ['$P(\\theta) = (0.6, 0.8)$', '$P(-\\theta) = (0.6, -0.8)$', '$P(\\theta + \\pi) = (-0.6, -0.8)$'],
      check: { q: '$P(\\theta) = \\left(\\frac{5}{13}, \\frac{12}{13}\\right)$. What is $P(\\theta + \\pi)$?', options: ['$\\left(-\\frac{5}{13}, -\\frac{12}{13}\\right)$', '$\\left(\\frac{5}{13}, -\\frac{12}{13}\\right)$', '$\\left(-\\frac{5}{13}, \\frac{12}{13}\\right)$', '$\\left(\\frac{12}{13}, \\frac{5}{13}\\right)$'], answer: 0, why: 'Adding $\\pi$ is a half turn, so both coordinates change sign.' },
    },
    {
      say: 'A quarter turn counterclockwise swaps the two numbers and makes the new $x$ negative: $P\\left(\\theta + \\frac{\\pi}{2}\\right) = (-b, a)$.',
      example: ['$P(\\theta) = (0.6, 0.8)$', 'Swap: $(0.8, 0.6)$', 'Make the new $x$ negative: $(-0.8, 0.6)$', 'So $P\\left(\\theta + \\frac{\\pi}{2}\\right) = (-0.8, 0.6)$.'],
      check: { q: '$P(\\theta) = \\left(\\frac{3}{5}, \\frac{4}{5}\\right)$. What is $P\\left(\\theta + \\frac{\\pi}{2}\\right)$?', options: ['$\\left(-\\frac{4}{5}, \\frac{3}{5}\\right)$', '$\\left(\\frac{4}{5}, -\\frac{3}{5}\\right)$', '$\\left(-\\frac{3}{5}, \\frac{4}{5}\\right)$', '$\\left(\\frac{4}{5}, \\frac{3}{5}\\right)$'], answer: 0, why: 'Swap to get $\\left(\\frac{4}{5}, \\frac{3}{5}\\right)$, then make the new $x$ negative.' },
    },
    {
      say: 'Since $x = \\cos\\theta$ and $y = \\sin\\theta$, the circle equation becomes $\\cos^2\\theta + \\sin^2\\theta = 1$. It is true for every angle, so it is called an **identity**: the first **Pythagorean identity**.',
      example: ['$\\cos^2\\theta$ means $(\\cos\\theta)^2$.', 'If $\\cos\\theta = 0.6$:', '$\\sin^2\\theta = 1 - 0.36 = 0.64$', '$\\sin\\theta = \\pm 0.8$'],
      check: { q: 'If $\\sin\\theta = \\frac{1}{2}$, what is $\\cos^2\\theta$?', options: ['$\\frac{3}{4}$', '$\\frac{1}{2}$', '$\\frac{1}{4}$', '$\\frac{\\sqrt{3}}{2}$'], answer: 0, why: '$\\cos^2\\theta = 1 - \\left(\\frac{1}{2}\\right)^2 = 1 - \\frac{1}{4} = \\frac{3}{4}$.' },
    },
  ],

  'T2.special-points': [
    {
      say: 'At $\\frac{\\pi}{6}$ ($30^\\circ$) the point is $\\left(\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$. The arm is close to the $x$-axis, so $x$ is the bigger number.',
      example: ['$\\cos\\frac{\\pi}{6} = \\frac{\\sqrt{3}}{2} \\approx 0.87$', '$\\sin\\frac{\\pi}{6} = \\frac{1}{2} = 0.5$', 'Check: $\\frac{3}{4} + \\frac{1}{4} = 1$'],
      check: { q: 'What is the $y$-coordinate of $P\\left(\\frac{\\pi}{6}\\right)$?', options: ['$\\frac{1}{2}$', '$\\frac{\\sqrt{3}}{2}$', '$\\frac{\\sqrt{2}}{2}$', '$1$'], answer: 0, why: 'The arm is close to the $x$-axis, so $y$ is the smaller number, $\\frac{1}{2}$.' },
    },
    {
      say: 'At $\\frac{\\pi}{3}$ ($60^\\circ$) the two numbers swap: $\\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$. The arm is close to the $y$-axis, so $y$ is the bigger number.',
      example: ['$\\cos\\frac{\\pi}{3} = \\frac{1}{2}$', '$\\sin\\frac{\\pi}{3} = \\frac{\\sqrt{3}}{2}$'],
      check: { q: 'Which point is $P\\left(\\frac{\\pi}{3}\\right)$?', options: ['$\\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$', '$\\left(\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$', '$\\left(\\frac{\\sqrt{2}}{2}, \\frac{\\sqrt{2}}{2}\\right)$'], answer: 0, why: 'At $\\frac{\\pi}{3}$ the arm is steep, so $y$ is the bigger number.' },
    },
    {
      say: 'At $\\frac{\\pi}{4}$ ($45^\\circ$) the arm is halfway between the axes. Both numbers are equal: $\\left(\\frac{\\sqrt{2}}{2}, \\frac{\\sqrt{2}}{2}\\right)$.',
      example: ['$x = y$, so $x^2 + x^2 = 1$.', '$2x^2 = 1$, so $x^2 = \\frac{1}{2}$.', '$x = \\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}$'],
      check: { q: 'What is the $x$-coordinate of $P\\left(\\frac{\\pi}{4}\\right)$?', options: ['$\\frac{\\sqrt{2}}{2}$', '$\\frac{1}{2}$', '$\\frac{\\sqrt{3}}{2}$', '$\\sqrt{2}$'], answer: 0, why: 'At $\\frac{\\pi}{4}$ both coordinates are $\\frac{\\sqrt{2}}{2}$.' },
    },
    {
      say: 'Angles on an axis land on easy points: $P(0) = (1, 0)$, $P\\left(\\frac{\\pi}{2}\\right) = (0, 1)$, $P(\\pi) = (-1, 0)$, $P\\left(\\frac{3\\pi}{2}\\right) = (0, -1)$.',
      example: ['$\\pi$ is half a turn.', 'The arm points left along the $x$-axis.', 'It meets the circle at $(-1, 0)$.'],
      check: { q: 'What is $P\\left(\\frac{3\\pi}{2}\\right)$?', options: ['$(0, -1)$', '$(-1, 0)$', '$(1, 0)$', '$(0, 1)$'], answer: 0, why: 'Three quarter turns point the arm straight down, to $(0, -1)$.' },
    },
    {
      say: 'For any other special angle: find the reference angle, copy its point, then attach the quadrant signs. II: $(-, +)$. III: $(-, -)$. IV: $(+, -)$.',
      example: ['$P\\left(\\frac{5\\pi}{6}\\right)$', 'Quadrant II, reference angle $\\frac{\\pi}{6}$.', 'Copy $\\left(\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$.', 'Quadrant II: make $x$ negative.', '$P\\left(\\frac{5\\pi}{6}\\right) = \\left(-\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$'],
      check: { q: 'What is $P\\left(\\frac{4\\pi}{3}\\right)$?', options: ['$\\left(-\\frac{1}{2}, -\\frac{\\sqrt{3}}{2}\\right)$', '$\\left(-\\frac{\\sqrt{3}}{2}, -\\frac{1}{2}\\right)$', '$\\left(\\frac{1}{2}, -\\frac{\\sqrt{3}}{2}\\right)$', '$\\left(-\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$'], answer: 0, why: 'Reference angle $\\frac{\\pi}{3}$ gives $\\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$. Quadrant III makes both negative.' },
    },
    {
      say: 'Quick check for the $\\frac{\\pi}{6}$ and $\\frac{\\pi}{3}$ families: the bigger number, $\\frac{\\sqrt{3}}{2}$, goes with the axis the arm is closer to. Near the $x$-axis, $x$ has size $\\frac{\\sqrt{3}}{2}$. Near the $y$-axis, $y$ does.',
      example: ['$\\frac{11\\pi}{6}$ is $30^\\circ$ below the positive $x$-axis.', 'Close to the $x$-axis, so $x$ is big.', '$P\\left(\\frac{11\\pi}{6}\\right) = \\left(\\frac{\\sqrt{3}}{2}, -\\frac{1}{2}\\right)$'],
      check: { q: 'For $P\\left(\\frac{2\\pi}{3}\\right)$, which coordinate has size $\\frac{\\sqrt{3}}{2}$?', options: ['$y$', '$x$', 'Both'], answer: 0, why: '$\\frac{2\\pi}{3}$ is $120^\\circ$, only $30^\\circ$ from the $y$-axis, so $y$ is the big one.' },
    },
    {
      say: 'If the angle is negative or more than $2\\pi$, first find its coterminal angle from $0$ to $2\\pi$. Then use the usual steps.',
      example: ['$P\\left(-\\frac{\\pi}{4}\\right)$', '$-\\frac{\\pi}{4} + \\frac{8\\pi}{4} = \\frac{7\\pi}{4}$, quadrant IV.', 'Reference $\\frac{\\pi}{4}$; make $y$ negative.', '$\\left(\\frac{\\sqrt{2}}{2}, -\\frac{\\sqrt{2}}{2}\\right)$'],
      check: { q: 'What is $P\\left(\\frac{13\\pi}{6}\\right)$?', options: ['$\\left(\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$', '$\\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$', '$\\left(-\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$', '$\\left(\\frac{\\sqrt{3}}{2}, -\\frac{1}{2}\\right)$'], answer: 0, why: '$\\frac{13\\pi}{6} - \\frac{12\\pi}{6} = \\frac{\\pi}{6}$, which is in quadrant I.' },
    },
    {
      say: 'Going backwards from a point: the sizes of the numbers give the reference angle, and the signs give the quadrant.',
      example: ['$\\left(-\\frac{\\sqrt{2}}{2}, -\\frac{\\sqrt{2}}{2}\\right)$', 'Equal sizes: reference angle $\\frac{\\pi}{4}$.', 'Both negative: quadrant III.', '$\\theta = \\pi + \\frac{\\pi}{4} = \\frac{5\\pi}{4}$'],
      check: { q: '$P(\\theta) = \\left(\\frac{1}{2}, -\\frac{\\sqrt{3}}{2}\\right)$ with $0 \\le \\theta < 2\\pi$. What is $\\theta$?', options: ['$\\frac{5\\pi}{3}$', '$\\frac{11\\pi}{6}$', '$\\frac{4\\pi}{3}$', '$\\frac{\\pi}{3}$'], answer: 0, why: '$y$ is the big one, so the reference angle is $\\frac{\\pi}{3}$. Signs $(+, -)$ mean quadrant IV: $2\\pi - \\frac{\\pi}{3} = \\frac{5\\pi}{3}$.' },
    },
  ],

  'T3.exact-ratios': [
    {
      say: 'On the unit circle, $\\sin\\theta = y$ and $\\cos\\theta = x$. The third main ratio is **tangent**: $\\tan\\theta = \\frac{y}{x}$.',
      example: ['$P\\left(\\frac{\\pi}{3}\\right) = \\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$', '$\\tan\\frac{\\pi}{3} = \\frac{\\sqrt{3}}{2} \\div \\frac{1}{2}$', '$= \\frac{\\sqrt{3}}{2} \\times 2 = \\sqrt{3}$'],
      check: { q: 'What is $\\tan\\frac{\\pi}{4}$?', options: ['$1$', '$\\frac{\\sqrt{2}}{2}$', '$\\sqrt{2}$', '$0$'], answer: 0, why: 'At $\\frac{\\pi}{4}$, $x$ and $y$ are equal, so $\\frac{y}{x} = 1$.' },
    },
    {
      say: 'Three more ratios are **reciprocals** (flipped fractions). $\\csc\\theta = \\frac{1}{\\sin\\theta}$, $\\sec\\theta = \\frac{1}{\\cos\\theta}$, $\\cot\\theta = \\frac{1}{\\tan\\theta} = \\frac{x}{y}$.',
      example: ['$\\cos\\frac{\\pi}{3} = \\frac{1}{2}$', '$\\sec\\frac{\\pi}{3} = \\frac{1}{\\cos(\\pi/3)}$', '$= 1 \\div \\frac{1}{2} = 2$'],
      check: { q: '$\\sin\\theta = \\frac{2}{3}$. What is $\\csc\\theta$?', options: ['$\\frac{3}{2}$', '$-\\frac{2}{3}$', '$\\frac{1}{3}$', '$\\sin^{-1}\\frac{2}{3}$'], answer: 0, why: 'Cosecant flips sine: $\\frac{2}{3}$ becomes $\\frac{3}{2}$.' },
    },
    {
      say: 'A reciprocal is **not** an inverse. $\\csc\\theta$ means $\\frac{1}{\\sin\\theta}$. The calculator key $\\sin^{-1}$ does something else: it finds an angle.',
      example: ['$\\csc\\theta = \\frac{1}{\\sin\\theta}$: a flipped ratio.', '$\\sin^{-1}(0.5) = 30^\\circ$: an angle.', 'So $\\csc\\theta \\ne \\sin^{-1}\\theta$.'],
      check: { q: 'Which one equals $\\sec\\theta$?', options: ['$\\frac{1}{\\cos\\theta}$', '$\\cos^{-1}\\theta$', '$\\frac{1}{\\sin\\theta}$', '$-\\cos\\theta$'], answer: 0, why: 'Secant is the reciprocal of cosine.' },
    },
    {
      say: '**CAST** tells you which ratios are positive. Quadrant I: All. II: Sine. III: Tangent. IV: Cosine. A reciprocal always has the same sign as its partner.',
      example: ['Quadrant III: only tangent (and cotangent) are positive.', 'So $\\sin\\theta < 0$ and $\\cos\\theta < 0$ there.', 'Their reciprocals $\\csc\\theta$ and $\\sec\\theta$ are negative too.'],
      check: { q: 'In quadrant IV, which ratio is positive?', options: ['$\\sec\\theta$', '$\\sin\\theta$', '$\\tan\\theta$', '$\\csc\\theta$'], answer: 0, why: 'Cosine is positive in IV, so its reciprocal secant is too.' },
    },
    {
      say: 'To find an **exact value**: find the reference angle, use its special value, then attach the CAST sign.',
      example: ['$\\cos\\frac{5\\pi}{4}$', 'Reference angle $\\frac{\\pi}{4}$, quadrant III.', '$\\cos\\frac{\\pi}{4} = \\frac{\\sqrt{2}}{2}$', 'Cosine is negative in III.', '$\\cos\\frac{5\\pi}{4} = -\\frac{\\sqrt{2}}{2}$'],
      check: { q: 'What is $\\sin 300^\\circ$?', options: ['$-\\frac{\\sqrt{3}}{2}$', '$\\frac{\\sqrt{3}}{2}$', '$-\\frac{1}{2}$', '$\\frac{1}{2}$'], answer: 0, why: 'Reference angle $60^\\circ$, and $\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$. Sine is negative in quadrant IV.' },
    },
    {
      say: 'For a reciprocal ratio, find its partner first, then flip. If a root ends up on the bottom, **rationalize**: multiply top and bottom by that root.',
      example: ['$\\csc\\frac{\\pi}{3}$', '$\\sin\\frac{\\pi}{3} = \\frac{\\sqrt{3}}{2}$', 'Flip: $\\frac{2}{\\sqrt{3}}$', '$\\frac{2}{\\sqrt{3}} \\times \\frac{\\sqrt{3}}{\\sqrt{3}} = \\frac{2\\sqrt{3}}{3}$'],
      check: { q: 'What is $\\sec\\frac{2\\pi}{3}$?', options: ['$-2$', '$2$', '$-\\frac{1}{2}$', '$-\\frac{2\\sqrt{3}}{3}$'], answer: 0, why: '$\\cos\\frac{2\\pi}{3} = -\\frac{1}{2}$ (quadrant II). Flip it: $-2$.' },
    },
    {
      say: 'A ratio is **not defined** when its bottom is 0. $\\tan\\theta = \\frac{y}{x}$ and $\\sec\\theta = \\frac{1}{x}$ fail where $x = 0$. $\\cot\\theta = \\frac{x}{y}$ and $\\csc\\theta = \\frac{1}{y}$ fail where $y = 0$.',
      example: ['$P\\left(\\frac{\\pi}{2}\\right) = (0, 1)$', '$\\tan\\frac{\\pi}{2} = \\frac{1}{0}$: not defined.', '$\\cot\\frac{\\pi}{2} = \\frac{0}{1} = 0$'],
      check: { q: 'Which one is not defined?', options: ['$\\csc\\pi$', '$\\sec\\pi$', '$\\tan\\pi$', '$\\cos\\pi$'], answer: 0, why: '$P(\\pi) = (-1, 0)$, so $\\csc\\pi = \\frac{1}{0}$. The others are $-1$, $0$ and $-1$.' },
    },
    {
      say: 'To evaluate an expression, find each exact value first, then simplify. A small 2 like $\\sin^2\\theta$ means $(\\sin\\theta)^2$.',
      example: ['$\\sin^2\\frac{\\pi}{3} + \\cos\\pi$', '$= \\left(\\frac{\\sqrt{3}}{2}\\right)^2 + (-1)$', '$= \\frac{3}{4} - 1$', '$= -\\frac{1}{4}$'],
      check: { q: 'Evaluate $\\tan^2\\frac{\\pi}{6}$.', options: ['$\\frac{1}{3}$', '$3$', '$\\frac{\\sqrt{3}}{3}$', '$\\frac{1}{9}$'], answer: 0, why: '$\\tan\\frac{\\pi}{6} = \\frac{1}{\\sqrt{3}}$, and squaring gives $\\frac{1}{3}$.' },
    },
  ],

  'T3.ratio-from-point': [
    {
      say: 'A point $(x, y)$ on the terminal arm does not have to be on the unit circle. Its distance from the origin is $r = \\sqrt{x^2 + y^2}$. $r$ is always positive.',
      example: ['Point $(-3, 4)$', '$r = \\sqrt{(-3)^2 + 4^2}$', '$= \\sqrt{9 + 16} = \\sqrt{25}$', '$r = 5$'],
      check: { q: 'The point $(5, -12)$ is on the terminal arm. What is $r$?', options: ['$13$', '$-13$', '$7$', '$\\sqrt{119}$'], answer: 0, why: '$r = \\sqrt{25 + 144} = \\sqrt{169} = 13$. It is never negative.' },
    },
    {
      say: 'Then $\\sin\\theta = \\frac{y}{r}$, $\\cos\\theta = \\frac{x}{r}$ and $\\tan\\theta = \\frac{y}{x}$. The signs of $x$ and $y$ carry the quadrant. Never put a minus sign on $r$.',
      example: ['Point $(-3, 4)$, $r = 5$', '$\\sin\\theta = \\frac{4}{5}$', '$\\cos\\theta = \\frac{-3}{5} = -\\frac{3}{5}$', '$\\tan\\theta = \\frac{4}{-3} = -\\frac{4}{3}$'],
      check: { q: 'Point $(-8, -6)$, so $r = 10$. What is $\\cos\\theta$?', options: ['$-\\frac{4}{5}$', '$\\frac{4}{5}$', '$-\\frac{3}{5}$', '$\\frac{3}{4}$'], answer: 0, why: '$\\cos\\theta = \\frac{x}{r} = \\frac{-8}{10} = -\\frac{4}{5}$.' },
    },
    {
      say: 'The reciprocal ratios flip each fraction: $\\csc\\theta = \\frac{r}{y}$, $\\sec\\theta = \\frac{r}{x}$, $\\cot\\theta = \\frac{x}{y}$.',
      example: ['Point $(-3, 4)$, $r = 5$', '$\\csc\\theta = \\frac{5}{4}$', '$\\sec\\theta = \\frac{5}{-3} = -\\frac{5}{3}$', '$\\cot\\theta = \\frac{-3}{4} = -\\frac{3}{4}$'],
      check: { q: 'Point $(5, -12)$, so $r = 13$. What is $\\sec\\theta$?', options: ['$\\frac{13}{5}$', '$-\\frac{13}{12}$', '$\\frac{5}{13}$', '$-\\frac{13}{5}$'], answer: 0, why: '$\\sec\\theta = \\frac{r}{x} = \\frac{13}{5}$. Both are positive.' },
    },
    {
      say: 'If $r$ is not a whole number, leave it as a simplified root. A root left on the bottom gets **rationalized**: multiply top and bottom by that root.',
      example: ['Point $(1, -2)$', '$r = \\sqrt{1 + 4} = \\sqrt{5}$', '$\\cos\\theta = \\frac{1}{\\sqrt{5}}$', '$= \\frac{1}{\\sqrt{5}} \\times \\frac{\\sqrt{5}}{\\sqrt{5}} = \\frac{\\sqrt{5}}{5}$'],
      check: { q: 'The point $(2, 2)$ is on the terminal arm. What is $\\sin\\theta$?', options: ['$\\frac{\\sqrt{2}}{2}$', '$1$', '$\\frac{1}{2}$', '$\\sqrt{2}$'], answer: 0, why: '$r = \\sqrt{8} = 2\\sqrt{2}$, so $\\sin\\theta = \\frac{2}{2\\sqrt{2}} = \\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}$.' },
    },
    {
      say: 'Given one ratio and the quadrant, build a point. Choose $x$ and $y$ from the fraction, give them the quadrant signs, then find $r$.',
      example: ['$\\tan\\theta = -\\frac{5}{12}$, quadrant II.', 'Quadrant II: $x < 0$, $y > 0$. So $x = -12$, $y = 5$.', '$r = \\sqrt{144 + 25} = 13$', '$\\cos\\theta = \\frac{x}{r} = -\\frac{12}{13}$'],
      check: { q: '$\\tan\\theta = \\frac{3}{4}$ in quadrant III. Which $x$ and $y$ do you use?', options: ['$x = -4$, $y = -3$', '$x = 4$, $y = 3$', '$x = -3$, $y = -4$', '$x = 4$, $y = -3$'], answer: 0, why: '$\\tan\\theta = \\frac{y}{x}$, and quadrant III makes both negative: $\\frac{-3}{-4} = \\frac{3}{4}$.' },
    },
    {
      say: 'Given sine or cosine, the fraction gives one side and $r$. Find the missing side with $x^2 + y^2 = r^2$, then give it the quadrant sign.',
      example: ['$\\sin\\theta = \\frac{3}{5}$, quadrant II.', '$y = 3$, $r = 5$', '$x^2 = 25 - 9 = 16$, so $x = \\pm 4$.', 'Quadrant II: $x = -4$.', '$\\tan\\theta = \\frac{3}{-4} = -\\frac{3}{4}$'],
      check: { q: '$\\cos\\theta = \\frac{5}{13}$ in quadrant IV. What is $\\sin\\theta$?', options: ['$-\\frac{12}{13}$', '$\\frac{12}{13}$', '$-\\frac{5}{12}$', '$\\frac{13}{12}$'], answer: 0, why: '$y^2 = 169 - 25 = 144$, so $y = \\pm 12$. Quadrant IV makes $y = -12$, and $\\frac{y}{r} = -\\frac{12}{13}$.' },
    },
    {
      say: 'Sometimes the quadrant is hidden in a clue like $\\sin\\theta < 0$. Use CAST on both signs: the quadrant that fits both is the one.',
      example: ['$\\tan\\theta = -\\frac{8}{15}$ and $\\sin\\theta > 0$.', 'Sine positive: quadrant I or II.', 'Tangent negative: quadrant II or IV.', 'Both fit only quadrant II.'],
      check: { q: '$\\cos\\theta = -\\frac{3}{5}$ and $\\sin\\theta < 0$. Which quadrant is $\\theta$ in?', options: ['III', 'II', 'IV', 'I'], answer: 0, why: 'Cosine is negative in II and III. Sine is negative in III and IV. Both fit III.' },
    },
  ],

  'T3.angle-from-ratio': [
    {
      say: 'Now go backwards: you know a ratio and want the angles. Step 1: find the **reference angle** $\\alpha$ from the value without its sign.',
      example: ['$\\sin\\theta = -\\frac{1}{2}$', 'Drop the sign: $\\sin\\alpha = \\frac{1}{2}$.', 'Reference angle $\\alpha = \\frac{\\pi}{6}$.'],
      check: { q: '$\\cos\\theta = -\\frac{\\sqrt{2}}{2}$. What is the reference angle?', options: ['$\\frac{\\pi}{4}$', '$\\frac{3\\pi}{4}$', '$-\\frac{\\pi}{4}$', '$\\frac{\\pi}{3}$'], answer: 0, why: '$\\cos\\frac{\\pi}{4} = \\frac{\\sqrt{2}}{2}$. A reference angle is always positive and acute.' },
    },
    {
      say: 'Step 2: use CAST and the sign of the value to pick **two** quadrants. Each ratio is positive in two quadrants and negative in the other two.',
      example: ['$\\sin\\theta = -\\frac{1}{2}$ is negative.', 'Sine is positive in I and II.', 'So it is negative in III and IV.'],
      check: { q: '$\\tan\\theta = -1$. Which quadrants hold the answers?', options: ['II and IV', 'I and III', 'III and IV', 'II and III'], answer: 0, why: 'Tangent is positive in I and III, so it is negative in II and IV.' },
    },
    {
      say: 'Step 3: place $\\alpha$ in each quadrant. I: $\\alpha$. II: $\\pi - \\alpha$. III: $\\pi + \\alpha$. IV: $2\\pi - \\alpha$.',
      example: ['$\\alpha = \\frac{\\pi}{6}$, quadrants III and IV.', 'III: $\\pi + \\frac{\\pi}{6} = \\frac{7\\pi}{6}$', 'IV: $2\\pi - \\frac{\\pi}{6} = \\frac{11\\pi}{6}$', 'So $\\theta = \\frac{7\\pi}{6}, \\frac{11\\pi}{6}$.'],
      check: { q: 'Reference angle $\\frac{\\pi}{3}$, quadrant II. What is $\\theta$?', options: ['$\\frac{2\\pi}{3}$', '$\\frac{4\\pi}{3}$', '$\\frac{5\\pi}{3}$', '$\\frac{\\pi}{3}$'], answer: 0, why: '$\\pi - \\frac{\\pi}{3} = \\frac{3\\pi}{3} - \\frac{\\pi}{3} = \\frac{2\\pi}{3}$.' },
    },
    {
      say: 'In degrees, the same three steps work with $180^\\circ$ and $360^\\circ$.',
      example: ['$\\cos\\theta = \\frac{1}{2}$, $0^\\circ \\le \\theta < 360^\\circ$', 'Reference angle $60^\\circ$.', 'Cosine is positive in I and IV.', 'I: $60^\\circ$. IV: $360^\\circ - 60^\\circ = 300^\\circ$.'],
      check: { q: 'Solve $\\sin\\theta = \\frac{\\sqrt{3}}{2}$ for $0^\\circ \\le \\theta < 360^\\circ$.', options: ['$60^\\circ, 120^\\circ$', '$60^\\circ, 300^\\circ$', '$30^\\circ, 150^\\circ$', '$60^\\circ, 240^\\circ$'], answer: 0, why: 'Reference angle $60^\\circ$. Sine is positive in I and II: $60^\\circ$ and $180^\\circ - 60^\\circ = 120^\\circ$.' },
    },
    {
      say: 'If the value is not special, get the reference angle from the calculator: $\\sin^{-1}$, $\\cos^{-1}$ or $\\tan^{-1}$ of the **positive** value. Use degree mode for degrees and radian mode for radians.',
      example: ['$\\cos\\theta = -0.4$, in degrees.', '$\\alpha = \\cos^{-1}(0.4) \\approx 66.4^\\circ$', 'Cosine is negative in II and III.', 'II: $180^\\circ - 66.4^\\circ = 113.6^\\circ$', 'III: $180^\\circ + 66.4^\\circ = 246.4^\\circ$'],
      check: { q: '$\\tan\\theta = 2$ gives $\\alpha \\approx 63.4^\\circ$. Which angles solve it for $0^\\circ \\le \\theta < 360^\\circ$?', options: ['$63.4^\\circ, 243.4^\\circ$', '$63.4^\\circ, 116.6^\\circ$', '$63.4^\\circ, 296.6^\\circ$', '$63.4^\\circ$ only'], answer: 0, why: 'Tangent is positive in I and III: $63.4^\\circ$ and $180^\\circ + 63.4^\\circ = 243.4^\\circ$.' },
    },
    {
      say: 'The calculator gives only one angle. For a negative value it can even give a negative angle, outside the domain. Always build your answers from the reference angle.',
      example: ['Calculator: $\\sin^{-1}(-0.5) = -30^\\circ$.', 'That is not in $0^\\circ \\le \\theta < 360^\\circ$.', 'Use $\\alpha = 30^\\circ$ in III and IV.', '$\\theta = 210^\\circ, 330^\\circ$'],
      check: { q: 'The calculator says $\\tan^{-1}(-1) = -45^\\circ$. Which answers belong in $0^\\circ \\le \\theta < 360^\\circ$?', options: ['$135^\\circ, 315^\\circ$', '$-45^\\circ$', '$45^\\circ, 225^\\circ$', '$315^\\circ$ only'], answer: 0, why: 'Reference $45^\\circ$, tangent negative in II and IV: $180^\\circ - 45^\\circ$ and $360^\\circ - 45^\\circ$.' },
    },
    {
      say: 'For a reciprocal ratio, flip it into sine, cosine or tangent first. Then solve as usual.',
      example: ['$\\csc\\theta = -2$', 'Flip: $\\sin\\theta = -\\frac{1}{2}$.', 'Reference $\\frac{\\pi}{6}$; sine is negative in III and IV.', '$\\theta = \\frac{7\\pi}{6}, \\frac{11\\pi}{6}$'],
      check: { q: 'Solve $\\sec\\theta = 2$ for $0 \\le \\theta < 2\\pi$.', options: ['$\\frac{\\pi}{3}, \\frac{5\\pi}{3}$', '$\\frac{\\pi}{3}, \\frac{2\\pi}{3}$', '$\\frac{\\pi}{6}, \\frac{11\\pi}{6}$', 'No solution'], answer: 0, why: 'Flip to $\\cos\\theta = \\frac{1}{2}$: reference $\\frac{\\pi}{3}$, cosine positive in I and IV.' },
    },
  ],

  'T4.basic-graphs': [
    {
      say: 'The graph of $y = \\sin x$ records the $y$-coordinate of the unit-circle point as the arm turns. Plot it and you get a smooth wave through the origin.',
      example: ['$\\sin 0 = 0$', '$\\sin\\frac{\\pi}{2} = 1$', '$\\sin\\pi = 0$', '$\\sin\\frac{3\\pi}{2} = -1$', '$\\sin 2\\pi = 0$'],
      check: { q: 'What is the $y$-intercept of $y = \\sin x$?', options: ['$(0, 0)$', '$(0, 1)$', '$(1, 0)$', '$(0, -1)$'], answer: 0, why: '$\\sin 0 = 0$, so the graph passes through the origin.' },
    },
    {
      say: 'The wave repeats every $2\\pi$ ($360^\\circ$). That length is the **period**. The $y$-values stay from $-1$ to $1$. That set of $y$-values is the **range**.',
      example: ['Period: $2\\pi$', 'Range: $\\{y \\mid -1 \\le y \\le 1, y \\in \\mathbb{R}\\}$'],
      check: { q: 'What is the range of $y = \\sin x$?', options: ['$-1 \\le y \\le 1$', '$-2 \\le y \\le 2$', '$0 \\le y \\le 1$', 'All real numbers'], answer: 0, why: 'Sine is a $y$-coordinate on a circle of radius 1, so it stays between $-1$ and $1$.' },
    },
    {
      say: 'The **zeros** ($x$-intercepts) of $y = \\sin x$ are at $x = \\pi n$, $n \\in I$. Its maximum, 1, is at $\\frac{\\pi}{2}$. Its minimum, $-1$, is at $\\frac{3\\pi}{2}$.',
      example: ['For $0^\\circ \\le x \\le 360^\\circ$:', 'Zeros at $0^\\circ$, $180^\\circ$, $360^\\circ$.', 'Maximum at $90^\\circ$, minimum at $270^\\circ$.'],
      check: { q: 'What are the zeros of $y = \\sin x$ for $0^\\circ \\le x \\le 360^\\circ$?', options: ['$0^\\circ, 180^\\circ, 360^\\circ$', '$90^\\circ, 270^\\circ$', '$0^\\circ, 360^\\circ$', '$180^\\circ$'], answer: 0, why: '$\\sin x = 0$ at every multiple of $180^\\circ$, and both endpoints count.' },
    },
    {
      say: 'The graph of $y = \\cos x$ records the $x$-coordinate instead. Same period, same range. It starts at its maximum, so the $y$-intercept is 1. It is the sine graph shifted left $\\frac{\\pi}{2}$.',
      example: ['$\\cos 0 = 1$: maximum', '$\\cos\\frac{\\pi}{2} = 0$', '$\\cos\\pi = -1$: minimum', '$\\cos\\frac{3\\pi}{2} = 0$', '$\\cos 2\\pi = 1$: maximum'],
      check: { q: 'What are the zeros of $y = \\cos x$ for $0 \\le x \\le 2\\pi$?', options: ['$\\frac{\\pi}{2}, \\frac{3\\pi}{2}$', '$0, \\pi, 2\\pi$', '$\\pi$', '$\\frac{\\pi}{2}$'], answer: 0, why: 'Cosine is zero at $x = \\frac{\\pi}{2} + \\pi n$. In this domain that is $\\frac{\\pi}{2}$ and $\\frac{3\\pi}{2}$.' },
    },
    {
      say: 'Over a longer domain the pattern keeps repeating. Find the points in one cycle, then add or subtract the period until you leave the domain.',
      example: ['Maximums of $y = \\cos x$, $-360^\\circ \\le x \\le 360^\\circ$.', 'One maximum is at $0^\\circ$.', 'Add $360^\\circ$: $360^\\circ$. Subtract: $-360^\\circ$.', 'Answer: $-360^\\circ, 0^\\circ, 360^\\circ$'],
      check: { q: 'Where are the maximums of $y = \\sin x$ for $0^\\circ \\le x \\le 720^\\circ$?', options: ['$90^\\circ, 450^\\circ$', '$90^\\circ$', '$90^\\circ, 270^\\circ$', '$90^\\circ, 450^\\circ, 810^\\circ$'], answer: 0, why: 'Start at $90^\\circ$ and add $360^\\circ$ to get $450^\\circ$. The next one, $810^\\circ$, is outside.' },
    },
    {
      say: '$y = \\tan x = \\frac{\\sin x}{\\cos x}$. It is zero where $\\sin x = 0$. Where $\\cos x = 0$ it is not defined, so the graph has a **vertical asymptote**: a line the curve gets close to but never touches.',
      example: ['Zeros: $\\sin x = 0$ at $x = \\pi n$, $n \\in I$', 'Asymptotes: $\\cos x = 0$ at $\\frac{\\pi}{2}, \\frac{3\\pi}{2}, \\ldots$', 'So $x = \\frac{\\pi}{2} + \\pi n$, $n \\in I$'],
      check: { q: 'Where are the asymptotes of $y = \\tan x$, in degrees?', options: ['$x = 90^\\circ + 180^\\circ n$, $n \\in I$', '$x = 180^\\circ n$, $n \\in I$', '$x = 90^\\circ + 360^\\circ n$, $n \\in I$', '$x = 90^\\circ n$, $n \\in I$'], answer: 0, why: '$\\cos x = 0$ at $90^\\circ$, $270^\\circ$, and so on: every $180^\\circ$. At $180^\\circ n$ the graph has zeros instead.' },
    },
    {
      say: 'Tangent repeats every $\\pi$ ($180^\\circ$), not $2\\pi$. Its range is all real numbers, so it has no maximum and no amplitude. Its **domain** (allowed $x$-values) leaves out the asymptotes.',
      example: ['Period: $\\pi$', 'Range: $\\{y \\mid y \\in \\mathbb{R}\\}$', 'Domain: $\\{x \\mid x \\ne \\frac{\\pi}{2} + \\pi n, n \\in I, x \\in \\mathbb{R}\\}$'],
      check: { q: 'What is the period of $y = \\tan x$, in degrees?', options: ['$180^\\circ$', '$360^\\circ$', '$90^\\circ$', '$720^\\circ$'], answer: 0, why: 'The tangent pattern repeats from one asymptote to the next, every $180^\\circ$.' },
    },
    {
      say: 'To sketch one cycle of sine or cosine, split the period into four equal parts. That gives five **key points**: the zeros, the maximum and the minimum.',
      example: ['$y = \\sin x$, period $360^\\circ$', '$360^\\circ \\div 4 = 90^\\circ$', '$(0^\\circ, 0)$, $(90^\\circ, 1)$, $(180^\\circ, 0)$', '$(270^\\circ, -1)$, $(360^\\circ, 0)$'],
      check: { q: 'For $y = \\cos x$, which key point comes right after $(0, 1)$?', options: ['$\\left(\\frac{\\pi}{2}, 0\\right)$', '$\\left(\\frac{\\pi}{2}, 1\\right)$', '$(\\pi, 0)$', '$\\left(\\frac{\\pi}{2}, -1\\right)$'], answer: 0, why: 'A quarter period later, $\\cos\\frac{\\pi}{2} = 0$.' },
    },
  ],

  'T4.parameters': [
    {
      say: 'Transformed sine and cosine graphs use the form $y = a\\sin[b(x - c)] + d$, or the same with $\\cos$. Each letter does one job.',
      example: ['$y = 3\\sin\\left[2\\left(x - \\frac{\\pi}{4}\\right)\\right] + 1$', '$a = 3$, $b = 2$', '$c = \\frac{\\pi}{4}$, $d = 1$'],
      check: { q: 'In $y = 5\\cos[3(x - 2)] - 4$, what is $d$?', options: ['$-4$', '$4$', '$5$', '$3$'], answer: 0, why: '$d$ is the number added at the end, including its sign.' },
    },
    {
      say: 'The **amplitude** is the height from the middle of the wave to its top. It is $|a|$, the size of $a$. If $a$ is negative, the graph is also flipped upside down (reflected in the $x$-axis).',
      example: ['$y = -3\\sin x$', 'Amplitude: $|-3| = 3$', 'The minus sign flips it, so it goes down first.'],
      check: { q: 'What is the amplitude of $y = -4\\cos x$?', options: ['$4$', '$-4$', '$8$', '$2$'], answer: 0, why: 'Amplitude is $|a| = |-4| = 4$. It is never negative.' },
    },
    {
      say: 'The **period** is the length of one cycle: $\\frac{2\\pi}{|b|}$ in radians, or $\\frac{360^\\circ}{|b|}$ in degrees. A bigger $b$ squeezes the wave, so the period gets shorter.',
      example: ['$y = \\sin 3x$', 'Period $= \\frac{2\\pi}{3}$', 'In degrees: $\\frac{360^\\circ}{3} = 120^\\circ$'],
      check: { q: 'What is the period of $y = \\cos 4x$, in degrees?', options: ['$90^\\circ$', '$4^\\circ$', '$1440^\\circ$', '$360^\\circ$'], answer: 0, why: '$\\frac{360^\\circ}{4} = 90^\\circ$.' },
    },
    {
      say: 'Careful: $b$ is not the period. $b$ counts how many cycles fit in $2\\pi$. A fraction $b$ stretches the wave, so the period gets longer.',
      example: ['$y = \\sin\\left(\\frac{1}{2}x\\right)$', 'Period $= 2\\pi \\div \\frac{1}{2}$', '$= 2\\pi \\times 2 = 4\\pi$'],
      check: { q: 'What is the period of $y = \\sin\\left(\\frac{2}{3}x\\right)$, in degrees?', options: ['$540^\\circ$', '$240^\\circ$', '$\\frac{2}{3}$', '$360^\\circ$'], answer: 0, why: '$360^\\circ \\div \\frac{2}{3} = 360^\\circ \\times \\frac{3}{2} = 540^\\circ$.' },
    },
    {
      say: 'The **phase shift** $c$ is a slide sideways. Read it with the sign flipped: $x - \\frac{\\pi}{4}$ means right $\\frac{\\pi}{4}$, and $x + \\frac{\\pi}{4}$ means left $\\frac{\\pi}{4}$.',
      example: ['$y = \\cos(x + 30^\\circ)$', '$x + 30^\\circ = x - (-30^\\circ)$', 'So $c = -30^\\circ$: a shift left $30^\\circ$.'],
      check: { q: 'What is the phase shift of $y = \\sin\\left(x - \\frac{\\pi}{3}\\right)$?', options: ['$\\frac{\\pi}{3}$ right', '$\\frac{\\pi}{3}$ left', '$\\frac{\\pi}{6}$ right', 'No shift'], answer: 0, why: 'Minus inside the bracket means a shift right.' },
    },
    {
      say: 'The **midline** $y = d$ is the level centre line of the wave. The maximum is $d + |a|$ and the minimum is $d - |a|$. The range runs from the minimum to the maximum.',
      example: ['$y = 2\\cos x + 5$', 'Midline: $y = 5$', 'Maximum: $5 + 2 = 7$', 'Minimum: $5 - 2 = 3$', 'Range: $3 \\le y \\le 7$'],
      check: { q: 'What is the maximum value of $y = -3\\sin x + 1$?', options: ['$4$', '$-2$', '$1$', '$-3$'], answer: 0, why: 'Use $|a| = 3$, not $-3$: $1 + 3 = 4$.' },
    },
    {
      say: 'A safe reading order: first $d$ and $|a|$ (the up and down features), then the period from $b$, then the shift $c$.',
      example: ['$y = 4\\sin[2(x + 45^\\circ)] - 1$', 'Midline $y = -1$, amplitude 4.', 'Max $-1 + 4 = 3$, min $-1 - 4 = -5$.', 'Period $\\frac{360^\\circ}{2} = 180^\\circ$.', 'Phase shift: $45^\\circ$ left.'],
      check: { q: 'What is the period of $y = 2\\cos\\left[3\\left(x - \\frac{\\pi}{6}\\right)\\right] + 4$?', options: ['$\\frac{2\\pi}{3}$', '$6\\pi$', '$3$', '$\\frac{\\pi}{6}$'], answer: 0, why: 'Period $= \\frac{2\\pi}{|b|} = \\frac{2\\pi}{3}$. The $\\frac{\\pi}{6}$ is the shift.' },
    },
    {
      say: 'To write an equation from its features, work in reverse. Get $b$ from the period: $b = \\frac{2\\pi}{\\text{period}}$.',
      example: ['Sine, amplitude 3, period $\\pi$, midline $y = 2$, no shift.', '$b = \\frac{2\\pi}{\\pi} = 2$', '$y = 3\\sin 2x + 2$'],
      check: { q: 'A cosine function has period $4\\pi$. What is $b$?', options: ['$\\frac{1}{2}$', '$4\\pi$', '$2$', '$8\\pi$'], answer: 0, why: '$b = \\frac{2\\pi}{4\\pi} = \\frac{1}{2}$.' },
    },
  ],

  'T4.factor-b': [
    {
      say: 'You read the phase shift from the form $b(x - c)$. If the bracket looks like $bx - k$, the shift is **not** $k$. You must factor out $b$ first.',
      example: ['$y = \\sin(2x - 60^\\circ)$', 'The bracket is $2x - 60^\\circ$.', 'The 2 is not yet outside, so the shift is not $60^\\circ$.'],
      check: { q: 'Which bracket is ready for reading the phase shift?', options: ['$[2(x - 30^\\circ)]$', '$(2x - 60^\\circ)$', 'Both are ready'], answer: 0, why: 'The shift can be read only when $b$ is factored outside, as in $b(x - c)$.' },
    },
    {
      say: 'To **factor** out $b$, divide each term inside the bracket by $b$, and write $b$ outside.',
      example: ['$2x - 60^\\circ$', '$= 2\\left(x - \\frac{60^\\circ}{2}\\right)$', '$= 2(x - 30^\\circ)$', 'Phase shift: $30^\\circ$ right.'],
      check: { q: 'Factor $3x - 90^\\circ$.', options: ['$3(x - 30^\\circ)$', '$3(x - 90^\\circ)$', '$3(x - 270^\\circ)$', '$3(x - 87^\\circ)$'], answer: 0, why: '$90^\\circ \\div 3 = 30^\\circ$.' },
    },
    {
      say: 'In general, $bx - k = b\\left(x - \\frac{k}{b}\\right)$. So the shift is $\\frac{k}{b}$: the number divided by $b$.',
      example: ['$\\sin(4x - \\pi)$', '$\\pi \\div 4 = \\frac{\\pi}{4}$', '$= \\sin\\left[4\\left(x - \\frac{\\pi}{4}\\right)\\right]$', 'Phase shift: $\\frac{\\pi}{4}$ right.'],
      check: { q: 'What is the phase shift of $y = \\cos(2x - \\pi)$?', options: ['$\\frac{\\pi}{2}$ right', '$\\pi$ right', '$2\\pi$ right', '$\\frac{\\pi}{2}$ left'], answer: 0, why: '$2x - \\pi = 2\\left(x - \\frac{\\pi}{2}\\right)$, a shift right $\\frac{\\pi}{2}$.' },
    },
    {
      say: 'A plus sign inside means a shift **left**. Factor the same way and keep the plus.',
      example: ['$\\cos\\left(3x + \\frac{\\pi}{2}\\right)$', '$\\frac{\\pi}{2} \\div 3 = \\frac{\\pi}{6}$', '$= \\cos\\left[3\\left(x + \\frac{\\pi}{6}\\right)\\right]$', 'Phase shift: $\\frac{\\pi}{6}$ left.'],
      check: { q: 'What is the phase shift of $y = \\sin(2x + 80^\\circ)$?', options: ['$40^\\circ$ left', '$80^\\circ$ left', '$40^\\circ$ right', '$160^\\circ$ left'], answer: 0, why: '$2x + 80^\\circ = 2(x + 40^\\circ)$. Plus means left.' },
    },
    {
      say: 'When $b$ is a fraction, dividing by it makes the number bigger. Dividing by $\\frac{1}{2}$ is the same as multiplying by 2.',
      example: ['$\\sin\\left(\\frac{1}{2}x - \\frac{\\pi}{4}\\right)$', '$\\frac{\\pi}{4} \\div \\frac{1}{2} = \\frac{\\pi}{4} \\times 2 = \\frac{\\pi}{2}$', '$= \\sin\\left[\\frac{1}{2}\\left(x - \\frac{\\pi}{2}\\right)\\right]$', 'Phase shift: $\\frac{\\pi}{2}$ right.'],
      check: { q: 'What is the phase shift of $y = \\cos\\left(\\frac{1}{3}x - 20^\\circ\\right)$?', options: ['$60^\\circ$ right', '$20^\\circ$ right', '$\\frac{20^\\circ}{3}$ right', '$60^\\circ$ left'], answer: 0, why: '$20^\\circ \\div \\frac{1}{3} = 20^\\circ \\times 3 = 60^\\circ$, and minus means right.' },
    },
    {
      say: 'Check your factored form by multiplying it back out. It must give the original bracket exactly.',
      example: ['Claim: $2x - 60^\\circ = 2(x - 30^\\circ)$', 'Expand: $2 \\times x - 2 \\times 30^\\circ$', '$= 2x - 60^\\circ$. It matches.'],
      check: { q: 'Someone writes $3x - 45^\\circ = 3(x - 45^\\circ)$. What do you get when you expand the right side?', options: ['$3x - 135^\\circ$, so it is wrong', '$3x - 45^\\circ$, so it is right', '$3x - 15^\\circ$, so it is wrong'], answer: 0, why: '$3 \\times 45^\\circ = 135^\\circ$. The correct form is $3(x - 15^\\circ)$.' },
    },
    {
      say: 'Factoring changes only how you read the shift. Amplitude, period and midline stay the same. The period is still $\\frac{2\\pi}{|b|}$.',
      example: ['$y = 5\\sin(3x - \\pi) + 2$', '$= 5\\sin\\left[3\\left(x - \\frac{\\pi}{3}\\right)\\right] + 2$', 'Period $\\frac{2\\pi}{3}$, shift $\\frac{\\pi}{3}$ right.', 'Amplitude 5, midline $y = 2$.'],
      check: { q: 'What are the period and phase shift of $y = \\cos(2x - 90^\\circ)$?', options: ['Period $180^\\circ$, shift $45^\\circ$ right', 'Period $180^\\circ$, shift $90^\\circ$ right', 'Period $720^\\circ$, shift $45^\\circ$ right', 'Period $360^\\circ$, shift $45^\\circ$ right'], answer: 0, why: 'Period $\\frac{360^\\circ}{2} = 180^\\circ$. Factor: $2(x - 45^\\circ)$, so $45^\\circ$ right.' },
    },
  ],

  'T4.sketch': [
    {
      say: 'A full-mark sketch has labelled axes with a scale. It shows every key feature in the domain: maximums, minimums, the midline and the intercepts.',
      check: { q: 'What must a full-mark sketch show?', options: ['Scaled, labelled axes and every key feature', 'Only the shape of the wave', 'Only the equation and the period'], answer: 0, why: 'Markers check the scale and each maximum, minimum, midline and intercept.' },
    },
    {
      say: 'Step 1: draw the midline $y = d$. Then draw a top line $y = d + |a|$ and a bottom line $y = d - |a|$. The wave stays between them.',
      example: ['$y = 2\\sin x + 3$', 'Midline: $y = 3$', 'Top: $y = 3 + 2 = 5$', 'Bottom: $y = 3 - 2 = 1$'],
      check: { q: 'For $y = 4\\cos x - 1$, where are the top and bottom lines?', options: ['$y = 3$ and $y = -5$', '$y = 4$ and $y = -4$', '$y = 5$ and $y = -3$', '$y = 3$ and $y = -1$'], answer: 0, why: '$-1 + 4 = 3$ and $-1 - 4 = -5$.' },
    },
    {
      say: 'Step 2: find the period and split it into four equal parts. One part is the gap between key points along the $x$-axis.',
      example: ['$y = \\cos 2x$', 'Period $= \\frac{360^\\circ}{2} = 180^\\circ$', 'Gap: $180^\\circ \\div 4 = 45^\\circ$'],
      check: { q: 'What is the gap between key points for $y = \\sin 3x$, in degrees?', options: ['$30^\\circ$', '$120^\\circ$', '$90^\\circ$', '$40^\\circ$'], answer: 0, why: 'Period $\\frac{360^\\circ}{3} = 120^\\circ$, and $120^\\circ \\div 4 = 30^\\circ$.' },
    },
    {
      say: 'Step 3: start one cycle at the phase shift $c$. Sine goes **midline, max, midline, min, midline**, one gap apart.',
      example: ['$y = \\sin(x - 30^\\circ)$: start $30^\\circ$, gap $90^\\circ$.', '$30^\\circ$: midline. $120^\\circ$: max.', '$210^\\circ$: midline. $300^\\circ$: min.', '$390^\\circ$: midline.'],
      check: { q: 'One sine cycle starts at $x = 0$ with a gap of $\\frac{\\pi}{4}$. Where is its maximum?', options: ['$x = \\frac{\\pi}{4}$', '$x = \\frac{\\pi}{2}$', '$x = 0$', '$x = \\frac{3\\pi}{4}$'], answer: 0, why: 'Sine reaches its maximum one gap after the start.' },
    },
    {
      say: 'Cosine starts at the top instead: **max, midline, min, midline, max**.',
      example: ['$y = \\cos 2x$: start $0^\\circ$, gap $45^\\circ$.', '$0^\\circ$: max. $45^\\circ$: midline.', '$90^\\circ$: min. $135^\\circ$: midline.', '$180^\\circ$: max.'],
      check: { q: 'What is the first maximum point of $y = \\cos 2x + 1$ with $x \\ge 0$?', options: ['$(0, 2)$', '$(0, 1)$', '$(45^\\circ, 2)$', '$(90^\\circ, 2)$'], answer: 0, why: 'Cosine starts at a maximum, at $x = 0$. The value is $d + |a| = 1 + 1 = 2$.' },
    },
    {
      say: 'If $a$ is negative, swap max and min. Negative sine goes midline, min, midline, max, midline. Negative cosine starts at a min.',
      example: ['$y = -\\cos x$', 'Starts at a min: $(0^\\circ, -1)$.', 'Midline at $90^\\circ$, max at $(180^\\circ, 1)$.'],
      check: { q: 'Where is the first maximum of $y = -\\sin x$ with $x \\ge 0$?', options: ['$(270^\\circ, 1)$', '$(90^\\circ, 1)$', '$(90^\\circ, -1)$', '$(180^\\circ, 1)$'], answer: 0, why: 'Flipped sine goes midline, min ($90^\\circ$), midline, then max at $270^\\circ$.' },
    },
    {
      say: 'Put the steps together to find any key point: start at the shift, step by gaps, and use $d \\pm |a|$ for the height.',
      example: ['First max of $y = 3\\sin[2(x - 15^\\circ)] + 1$, $x \\ge 0$.', 'Start $15^\\circ$. Period $180^\\circ$, gap $45^\\circ$.', 'Sine max is one gap in: $15^\\circ + 45^\\circ = 60^\\circ$.', 'Height: $1 + 3 = 4$.', 'Point: $(60^\\circ, 4)$'],
      check: { q: 'What is the first maximum point of $y = 2\\cos(x - 60^\\circ)$ with $x \\ge 0$?', options: ['$(60^\\circ, 2)$', '$(150^\\circ, 2)$', '$(0^\\circ, 2)$', '$(60^\\circ, 0)$'], answer: 0, why: 'Cosine starts at a maximum, so the max is at the shift, $60^\\circ$. Its height is $0 + 2 = 2$.' },
    },
    {
      say: 'Step 4: repeat the cycle across the whole domain and join the points with a smooth curve, not straight lines. Number of cycles $= \\frac{\\text{domain length}}{\\text{period}}$.',
      example: ['$y = \\sin 2x$ on $0^\\circ \\le x \\le 720^\\circ$', 'Period: $180^\\circ$', 'Cycles: $\\frac{720^\\circ}{180^\\circ} = 4$', 'Grid spacing: $180^\\circ \\div 4 = 45^\\circ$'],
      check: { q: 'How many cycles of $y = \\cos 3x$ fit in $0 \\le x \\le 2\\pi$?', options: ['3', '$\\frac{1}{3}$', '6', '2'], answer: 0, why: 'Period $\\frac{2\\pi}{3}$, and $2\\pi \\div \\frac{2\\pi}{3} = 3$.' },
    },
  ],
};
