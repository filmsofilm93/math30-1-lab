import type { LessonCard } from '../types';

/** Lesson cards in plain words, one small idea per card. Keyed by skill node id. */
export const CARDS: Record<string, LessonCard[]> = {
  'CALC.mode-window': [
    {
      say: 'The **window** is the part of the graph your calculator shows. The formula sheet writes it as $x{:}\\ [x_{\\min}, x_{\\max}, x_{\\text{scl}}]$ and $y{:}\\ [y_{\\min}, y_{\\max}, y_{\\text{scl}}]$.',
      example: ['$x{:}\\ [-5, 15, 1]$', 'The screen shows $x$ from $-5$ to $15$.', '$y{:}\\ [-20, 40, 10]$', 'The screen shows $y$ from $-20$ to $40$.'],
      check: { q: 'In $x{:}\\ [-2, 8, 1]$, what is the largest $x$ on the screen?', options: ['$8$', '$-2$', '$1$', '$10$'], answer: 0, why: 'The middle number is $x_{\\max}$, the right edge of the screen.' },
    },
    {
      say: 'The **scale** (scl) is the third number. It is the distance between **tick marks**, the little marks along an axis. To count the ticks on the positive side, divide the max by the scale.',
      example: ['$x{:}\\ [-4, 10, 2]$', 'The positive $x$-axis runs from $0$ to $10$.', '$10 \\div 2 = 5$', 'So there are $5$ tick marks: at $2, 4, 6, 8, 10$.'],
      check: { q: 'How many tick marks are on the positive $y$-axis for $y{:}\\ [-10, 30, 5]$?', options: ['$6$', '$8$', '$5$', '$4$'], answer: 0, why: '$30 \\div 5 = 6$. Only the part from $0$ to $30$ counts.' },
    },
    {
      say: 'Press **[WINDOW]** to type the six numbers yourself. **[ZOOM] 6: ZStandard** sets $[-10, 10, 1]$ by $[-10, 10, 1]$ in one step. **[ZOOM] 7: ZTrig** is a quick window for radian trig graphs.',
      example: ['**[WINDOW]**', 'Type Xmin, Xmax, Xscl, then Ymin, Ymax, Yscl.', 'Press **[GRAPH]** to see the result.'],
      check: {
        q: 'What window does **[ZOOM] 6: ZStandard** give?',
        options: ['$x{:}\\ [-10, 10, 1]$, $y{:}\\ [-10, 10, 1]$', '$x{:}\\ [0, 10, 1]$, $y{:}\\ [0, 10, 1]$', '$x{:}\\ [-10, 10, 2]$, $y{:}\\ [-10, 10, 2]$'],
        answer: 0,
        why: 'ZStandard runs from $-10$ to $10$ on both axes, with a tick every $1$.',
      },
    },
    {
      say: 'A good window shows every **key feature**: all the zeros, all the turning points, the intercepts, and how the graph acts near an asymptote. If a feature is off the screen, you can miss it.',
      example: ['$y = (x - 2)(x - 14)$', 'Zeros at $x = 2$ and $x = 14$.', 'ZStandard stops at $x = 10$.', 'The zero at $14$ is off screen. Bad window.'],
      check: { q: 'Which $x$-window shows both zeros of $y = (x + 3)(x - 12)$?', options: ['$[-5, 15, 1]$', '$[-10, 10, 1]$', '$[0, 15, 1]$', '$[-15, 5, 1]$'], answer: 0, why: 'The zeros are $-3$ and $12$. Only $[-5, 15]$ includes both.' },
    },
    {
      say: 'To build a window, first **estimate** where the features are. Then **pad** each side: go a little past the smallest and the largest values.',
      example: ['Zeros at $-6$, $0$, $9$. Peak near $y = 110$. Valley near $y = -222$.', '$x$: from $-6 - 2 = -8$ to $9 + 2 = 11$.', '$y$: below $-222$ and above $110$, say $-250$ to $150$.', 'Window: $x{:}\\ [-8, 11, 1]$, $y{:}\\ [-250, 150, 50]$.'],
      check: { q: 'A graph has zeros at $-4$ and $7$ and its lowest point at $y = -30$. Which $y$-window shows the lowest point?', options: ['$[-40, 10, 10]$', '$[-10, 10, 1]$', '$[0, 40, 10]$', '$[-20, 20, 5]$'], answer: 0, why: 'The window must go below $-30$. Only $[-40, 10]$ does, with room to spare.' },
    },
    {
      say: 'For a **sinusoid** (a sine or cosine wave), set $x$ to cover one or two **periods** (one period is one full wave). Make the $x$ scale a **quarter period**, so peaks, valleys and midline crossings land on ticks.',
      example: ['$h(t) = 8\\sin\\left(\\frac{2\\pi}{24}t\\right) + 12$', 'Period: $24$.', 'Two cycles: $x$ from $0$ to $2 \\times 24 = 48$.', 'Quarter period: $24 \\div 4 = 6$.', 'So $x{:}\\ [0, 48, 6]$.'],
      check: { q: 'A wave has period $40$. Which $x$-window shows two cycles, with ticks a quarter period apart?', options: ['$[0, 80, 10]$', '$[0, 40, 10]$', '$[0, 80, 40]$', '$[0, 20, 1]$'], answer: 0, why: 'Two cycles: $2 \\times 40 = 80$. Quarter period: $40 \\div 4 = 10$.' },
    },
    {
      say: 'In $y = a\\sin[b(x - c)] + d$, the wave goes from $d - |a|$ (the minimum) up to $d + |a|$ (the maximum). Set $y$ a bit below the minimum and a bit above the maximum.',
      example: ['$h(t) = 8\\sin\\left(\\frac{2\\pi}{24}t\\right) + 12$', 'Max: $12 + 8 = 20$.', 'Min: $12 - 8 = 4$.', '$y{:}\\ [0, 25, 5]$ covers both, with room.'],
      check: { q: 'Which $y$-window shows the max and min of $y = 15\\sin x + 20$?', options: ['$[0, 40, 5]$', '$[-10, 10, 1]$', '$[15, 25, 1]$', '$[0, 20, 5]$'], answer: 0, why: 'Max $20 + 15 = 35$, min $20 - 15 = 5$. Only $[0, 40]$ covers both.' },
    },
    {
      say: 'If an exam question **gives** you a window, use that window. Answer with what is inside it: a feature outside the window is not part of the answer.',
      example: ['Given window: $x{:}\\ [0, 10, 1]$.', 'The graph has zeros at $-2$ and $5$.', '$-2$ is outside the window.', 'So the answer uses only $x = 5$.'],
      check: { q: 'The given window is $x{:}\\ [-5, 5, 1]$. The graph crosses the $x$-axis at $-7$, $1$ and $4$. How many zeros count?', options: ['$2$', '$3$', '$1$', '$0$'], answer: 0, why: '$-7$ is outside $[-5, 5]$, so only $1$ and $4$ count.' },
    },
  ],

  'CALC.mode': [
    {
      say: 'Your calculator measures angles in **degrees** or **radians**, whichever **mode** is set. It never guesses from the question. The same keys give different answers in each mode.',
      example: ['$\\sin 30$ in DEGREE mode: $0.5$.', '$\\sin 30$ in RADIAN mode: about $-0.988$.', 'Same keys, very different answers.'],
      check: { q: 'You have not changed any settings. Which mode does the calculator use?', options: ['Whatever mode is already set', 'The one the question uses', 'Always degrees', 'Always radians'], answer: 0, why: 'It uses the mode setting. It never reads the question.' },
    },
    {
      say: 'A **degree sign** ($^\\circ$) on the angle or in the domain means **DEGREE** mode.',
      example: ['$\\tan 230^\\circ$: degree sign, so DEGREE.', 'Solve for $0^\\circ \\le \\theta < 360^\\circ$: degree signs, so DEGREE.'],
      check: { q: 'Which mode do you need for $\\cos 35^\\circ$?', options: ['Degree', 'Radian', 'Either one'], answer: 0, why: 'The angle has a degree sign.' },
    },
    {
      say: 'Use **RADIAN** mode when the domain uses $\\pi$, when the angle is a plain number with no degree sign, or for a model in time like $h(t)$.',
      example: ['$\\cos 2.5$: no degree sign, so RADIAN.', '$0 \\le x < 2\\pi$: $\\pi$ in the domain, so RADIAN.', '$h(t) = 15\\sin\\left(\\frac{\\pi}{20}t\\right) + 17$: RADIAN.'],
      check: { q: 'Which mode for: solve $2\\cos x = 0.4$ for $0 \\le x < 2\\pi$?', options: ['Radian', 'Degree', 'Either one'], answer: 0, why: 'The domain uses $\\pi$, so radians.' },
    },
    {
      say: 'Check the mode before **every** trig question. Press **[MODE]**, arrow down to the RADIAN / DEGREE row, highlight the one you need, press **[ENTER]**, then **[2nd] [MODE]** (QUIT).',
      example: ['**[MODE]**', 'Arrow down to the RADIAN / DEGREE row.', 'Highlight **DEGREE**, press **[ENTER]**.', '**[2nd] [MODE]** (QUIT) back to the home screen.'],
      check: { q: 'After choosing the mode, which keys take you back to the home screen?', options: ['**[2nd] [MODE]** (QUIT)', '**[ENTER]**', '**[2nd] [TRACE]**', '**[ZOOM]**'], answer: 0, why: '**[2nd] [MODE]** is QUIT. **[ENTER]** only selects the highlighted mode.' },
    },
    {
      say: 'Typing $\\pi$ does **not** switch the calculator to radians. In DEGREE mode, it reads $\\frac{2\\pi}{7}$ as about $0.898$ **degrees**, a tiny angle.',
      example: ['$\\sin\\left(\\frac{2\\pi}{7}\\right)$ in RADIAN mode: about $0.782$.', 'Same keys in DEGREE mode: $\\sin(0.898^\\circ) \\approx 0.016$.', 'A tiny answer like this is a sign the mode is wrong.'],
      check: {
        q: 'You want $\\sin\\left(\\frac{5\\pi}{9}\\right)$. The screen shows $0.030$, but the real value is about $0.985$. What went wrong?',
        options: ['The calculator was in degree mode', 'The calculator was in radian mode', 'The calculator rounds trig values'],
        answer: 0,
        why: 'In degree mode, $\\frac{5\\pi}{9}$ is read as about $1.75^\\circ$, so the sine comes out tiny.',
      },
    },
    {
      say: 'Put **brackets** around a fraction inside a trig function. Without them, the calculator takes the sine first and divides after.',
      example: ['Want: $\\sin\\left(\\frac{2\\pi}{7}\\right)$.', 'Type: $\\sin(2\\pi/7)$, closing the bracket after the $7$.', 'Wrong: $\\sin(2\\pi)/7$, which is $0 \\div 7 = 0$.'],
      check: { q: 'Which entry gives $\\cos\\left(\\frac{\\pi}{5}\\right)$?', options: ['$\\cos(\\pi/5)$', '$\\cos(\\pi)/5$', '$\\cos(\\pi)5$'], answer: 0, why: 'The whole fraction must be inside the brackets.' },
    },
    {
      say: 'On the exam the calculator gives only decimals for trig. **Exact** answers, like $\\frac{\\sqrt{3}}{2}$ or $\\frac{\\pi}{3}$, come from the unit circle, worked by hand.',
      example: ['Asked: the exact value of $\\cos\\frac{\\pi}{6}$.', 'The calculator shows $0.8660254$.', 'The unit circle gives $\\frac{\\sqrt{3}}{2}$. That is the exact answer.'],
      check: { q: 'A question asks for the **exact** value of $\\sin\\frac{\\pi}{4}$. Which answer earns the mark?', options: ['$\\frac{\\sqrt{2}}{2}$', '$0.71$', '$0.7071$', '$\\sin 45^\\circ$'], answer: 0, why: 'Exact means no decimals. $\\frac{\\sqrt{2}}{2}$ comes from the unit circle.' },
    },
    {
      say: 'Put it together: read the question, choose the mode, set it, then type the angle with brackets.',
      example: ['Evaluate $\\cos 1.2$ to the nearest hundredth.', 'No degree sign, so RADIAN.', '**[MODE]**, highlight RADIAN, **[ENTER]**, **[2nd] [MODE]**.', '$\\cos(1.2) \\approx 0.36$.'],
      check: { q: 'Evaluate $\\tan 50^\\circ$. Which mode, and about what value?', options: ['Degree, about $1.19$', 'Radian, about $-0.27$', 'Degree, about $-0.27$', 'Radian, about $1.19$'], answer: 0, why: 'The degree sign means DEGREE mode. $\\tan 50^\\circ$ is a bit more than $\\tan 45^\\circ = 1$.' },
    },
  ],

  'CALC.intersect-zero': [
    {
      say: 'A **zero** is an $x$-value where the graph crosses or touches the $x$-axis. At a zero, $y = 0$.',
      example: ['$y = x^2 - 4$', 'It crosses at $x = -2$ and $x = 2$.', 'Check: $(2)^2 - 4 = 4 - 4 = 0$.'],
      check: { q: 'Which is a zero of $y = x - 5$?', options: ['$5$', '$-5$', '$0$'], answer: 0, why: '$5 - 5 = 0$, so $y = 0$ at $x = 5$.' },
    },
    {
      say: 'To find a zero, enter the function as $Y_1$ and graph it. Then press **[2nd] [TRACE]** (CALC) and choose **2: zero**.',
      example: ['**[Y=]**, type the function in $Y_1$, **[GRAPH]**.', '**[2nd] [TRACE]** (CALC)', '**2: zero**'],
      check: { q: 'Which CALC item finds an $x$-intercept?', options: ['2: zero', '3: minimum', '4: maximum', '5: intersect'], answer: 0, why: 'An $x$-intercept is a zero, so choose 2: zero.' },
    },
    {
      say: 'The calculator then asks three things. Move left of the crossing, **[ENTER]** (Left Bound). Move right of it, **[ENTER]** (Right Bound). Press **[ENTER]** once more (Guess).',
      example: ['$Y_1 = x^2 - 2$, crossing near $x = 1.4$.', 'Left Bound: move to about $x = 1$, **[ENTER]**.', 'Right Bound: move to about $x = 2$, **[ENTER]**.', 'Guess: **[ENTER]**.', 'Screen: X = 1.4142136, Y = 0.'],
      check: { q: 'A crossing is near $x = 3$. Which bounds work?', options: ['Left $2.5$, right $3.5$', 'Left $3.5$, right $2.5$', 'Left $3.5$, right $4$', 'Left $1$, right $2$'], answer: 0, why: 'The left bound must be left of the crossing and the right bound right of it.' },
    },
    {
      say: 'The bounds must surround **exactly one** crossing. For more solutions, run CALC zero again, once for each. A **cubic** (highest power $3$) can have three zeros, so count them.',
      example: ['$y = x^3 - 4x$ crosses at $-2$, $0$ and $2$.', 'Run **2: zero** three times.', 'Bounds $-3$ to $-1$, then $-1$ to $1$, then $1$ to $3$.'],
      check: { q: 'For $y = x^3 - 4x$ you set Left Bound $-3$ and Right Bound $3$. What is wrong?', options: ['Three crossings are inside the bounds', 'Nothing, that works', 'The bounds are backwards'], answer: 0, why: 'Those bounds surround $-2$, $0$ and $2$. Bracket just one crossing each time.' },
    },
    {
      say: 'To solve an equation like $2^x = x + 3$, graph each side: the left side as $Y_1$, the right side as $Y_2$. Then use CALC **5: intersect**.',
      example: ['$Y_1 = 2^x$ and $Y_2 = x + 3$.', '**[2nd] [TRACE]** (CALC), **5: intersect**.', 'First curve? **[ENTER]**. Second curve? **[ENTER]**.', 'Move near a crossing. Guess? **[ENTER]**.', 'The X shown is a solution.'],
      check: { q: 'To solve $3^x = 10 - x$ by intersect, what goes in $Y_2$?', options: ['$10 - x$', '$3^x$', '$3^x - 10 + x$', '$0$'], answer: 0, why: '$Y_2$ holds the right side of the equation.' },
    },
    {
      say: 'Another way: move everything to one side, then find the **zeros** of the new function. Both methods give the same $x$-values, and both are accepted.',
      example: ['$2^x = x + 3$', 'Subtract $x + 3$: $2^x - x - 3 = 0$.', 'Graph $Y_1 = 2^x - x - 3$.', 'Its zeros match the intersections of $2^x$ and $x + 3$.'],
      check: { q: 'To solve $x^2 = 5$ with zeros, what do you graph?', options: ['$Y_1 = x^2 - 5$', '$Y_1 = x^2 + 5$', '$Y_1 = x^2$', '$Y_1 = 5$'], answer: 0, why: 'Subtract $5$ from both sides: $x^2 - 5 = 0$.' },
    },
    {
      say: 'Read X to the accuracy the question asks. Round only at the very end, never partway through.',
      example: ['Screen: X = 2.4449076.', 'Nearest hundredth: look at the third decimal, $4$.', '$4 < 5$, so round down.', '$x \\approx 2.44$'],
      check: { q: 'The screen shows X = $-2.8625004$. What is $x$ to the nearest hundredth?', options: ['$-2.86$', '$-2.87$', '$-2.8$', '$-2.9$'], answer: 0, why: 'The third decimal is $2$, which is less than $5$, so it stays $-2.86$.' },
    },
    {
      say: 'Before using CALC, check the window. A solution off the screen is easy to miss.',
      example: ['$Y_1 = (x + 2)(x - 12)$ in ZStandard.', 'Only the zero at $-2$ shows.', 'Change Xmax to $15$ to see the zero at $12$.', 'Now find both zeros.'],
      check: { q: 'ZStandard shows one crossing of a cubic, at $x = 1$. What should you do?', options: ['Widen the window to look for more crossings', 'Answer $x = 1$ only', 'Use 3: minimum instead'], answer: 0, why: 'A cubic can have up to three zeros, and some may be off the screen.' },
    },
  ],

  'CALC.max-min': [
    {
      say: 'A **turning point** is where the graph changes direction. A **maximum** is a peak; a **minimum** is a valley. CALC **3: minimum** and **4: maximum** find them.',
      example: ['$y = -(x - 2)^2 + 5$', 'The graph rises, then falls.', 'The peak $(2, 5)$ is a maximum.'],
      check: { q: 'Which CALC item finds the bottom of a valley?', options: ['3: minimum', '4: maximum', '2: zero', '5: intersect'], answer: 0, why: 'The bottom of a valley is a minimum.' },
    },
    {
      say: 'They work like zero: Left Bound, Right Bound, Guess. The bounds must surround only the one peak or valley you want.',
      example: ['$Y_1 = x^3 - 3x$, peak near $x = -1$.', '**[2nd] [TRACE]** (CALC), **4: maximum**.', 'Left Bound $x = -2$, Right Bound $x = 0$, then Guess.', 'Screen: X = $-1$, Y = $2$.'],
      check: { q: '$y = x^3 - 3x$ has a valley near $x = 1$. Which bounds work for 3: minimum?', options: ['Left $0$, right $2$', 'Left $-2$, right $0$', 'Left $2$, right $0$'], answer: 0, why: 'Only $0$ to $2$, in that order, surrounds the valley at $x = 1$.' },
    },
    {
      say: 'The screen shows X and Y. The **maximum value** means Y. **Where** it happens means X. The **point** means both, written $(x, y)$.',
      example: ['Screen: X = 1.5, Y = 7.25.', 'Maximum value: $7.25$.', 'Where it happens: $x = 1.5$.', 'The point: $(1.5, 7.25)$.'],
      check: { q: 'The screen shows X = 3, Y = $-4$. What is the minimum value?', options: ['$-4$', '$3$', '$(3, -4)$'], answer: 0, why: '"Value" means the $y$-coordinate.' },
    },
    {
      say: 'The calculator finds turning points by searching, so it may show X = 1.9999987 instead of 2. Round as the question asks.',
      example: ['Screen: X = 1.9999987.', 'Nearest hundredth: $2.00$.'],
      check: { q: 'The screen shows Y = 4.9999991. What is it to the nearest hundredth?', options: ['$5.00$', '$4.99$', '$4.9999991$'], answer: 0, why: 'The digits after the hundredths place round $4.99$ up to $5.00$.' },
    },
    {
      say: 'These find a **local** max or min: the highest or lowest point between your bounds only. A graph can have several peaks of different heights.',
      example: ['Peak A: $(-2, 6)$. Peak B: $(3, 10)$.', 'Both are local maximums.', 'Both ends go down, so the highest, $10$, is the **absolute** maximum.'],
      check: { q: 'A graph has peaks at $y = 4$ and $y = 9$, and both ends go down. What is the absolute maximum?', options: ['$9$', '$4$', '$13$'], answer: 0, why: 'The absolute maximum is the highest peak, $9$.' },
    },
    {
      say: 'For the **range** of a polynomial with both ends going down, find every peak and keep the highest $y$. The range is every $y$ up to that value.',
      example: ['Peaks at $y = 6$ and $y = 10$.', 'Both ends go down forever.', 'Highest peak: $10$.', 'Range: $(-\\infty, 10]$, or $y \\le 10$.'],
      check: { q: 'A quartic opens up at both ends. Its valleys are at $y = -3$ and $y = -8$. What is its range?', options: ['$[-8, \\infty)$', '$[-3, \\infty)$', '$(-\\infty, -8]$', '$[-8, -3]$'], answer: 0, why: 'Both ends go up, so take the lowest valley, $-8$. Every $y$ from $-8$ up is reached.' },
    },
    {
      say: 'In a word problem (largest area, volume or profit), only some $x$-values make sense, such as positive lengths. Set the window to that **domain**, then find the maximum there.',
      example: ['Box volume $V = x(20 - 2x)^2$, where $x$ is the cut size in cm.', 'Lengths must be positive: $0 < x < 10$.', 'Window: $x{:}\\ [0, 10, 1]$.', 'CALC **4: maximum**: $x \\approx 3.33$, $V \\approx 592.59\\text{ cm}^3$.'],
      check: { q: 'A rectangle has width $x$ and length $12 - x$. Which $x$-values make sense?', options: ['$0 < x < 12$', '$x > 12$', '$-12 < x < 12$', 'All real numbers'], answer: 0, why: 'Both the width $x$ and the length $12 - x$ must be positive.' },
    },
  ],

  'CALC.table': [
    {
      say: 'A **table of values** lists $x$-values and the matching $Y_1$ values. Set it up first with **[2nd] [WINDOW]** (TBLSET).',
      example: ['**[Y=]**: $Y_1 = 2x + 1$', '**[2nd] [WINDOW]** (TBLSET) to set it up.', '**[2nd] [GRAPH]** (TABLE) to see it.'],
      check: { q: 'Which keys open the table settings?', options: ['**[2nd] [WINDOW]** (TBLSET)', '**[2nd] [GRAPH]** (TABLE)', '**[WINDOW]**', '**[2nd] [TRACE]** (CALC)'], answer: 0, why: 'TBLSET is above the **[WINDOW]** key, so press **[2nd]** first.' },
    },
    {
      say: '**TblStart** is the first $x$ in the table. **ΔTbl** is the **step**: how much $x$ goes up each row. Leave Indpnt and Depend on Auto.',
      example: ['TblStart $= -2$, ΔTbl $= 0.5$', 'Rows: $x = -2, -1.5, -1, -0.5, \\ldots$'],
      check: { q: 'The table must list $x = 3, 5, 7, 9, \\ldots$ Which settings do that?', options: ['TblStart $= 3$, ΔTbl $= 2$', 'TblStart $= 2$, ΔTbl $= 3$', 'TblStart $= 3$, ΔTbl $= 1$', 'TblStart $= 5$, ΔTbl $= 2$'], answer: 0, why: 'The first $x$ is $3$, and each row goes up by $2$.' },
    },
    {
      say: '**[2nd] [GRAPH]** (TABLE) shows the table. Scroll with the arrow keys. Select a $Y_1$ cell to see more digits at the bottom of the screen.',
      example: ['$Y_1 = 200(1.05)^x$', 'Row X = 3 shows $231.53$.', 'Select that cell: the bottom shows $231.525$.'],
      check: { q: 'Why select a cell in the table?', options: ['To see more digits of the value', 'To change the step', 'To find a zero automatically'], answer: 0, why: 'The column is narrow; the full value shows at the bottom of the screen.' },
    },
    {
      say: 'If $Y_1$ changes **sign** (positive to negative, or negative to positive) between two rows, the graph crosses the $x$-axis between them. A zero is there.',
      example: ['$Y_1 = x^3 - 5$', 'X = 1: $1^3 - 5 = -4$', 'X = 2: $2^3 - 5 = 3$', '$-4$ then $3$: a sign change.', 'So a zero is between $1$ and $2$.'],
      check: { q: 'Rows: X = 2, Y = 5; X = 3, Y = 1; X = 4, Y = $-2$. Where is the zero?', options: ['Between $3$ and $4$', 'Between $2$ and $3$', 'At $x = 3$', 'Between $4$ and $5$'], answer: 0, why: 'Y goes from $1$ to $-2$ between X = 3 and X = 4. That is the sign change.' },
    },
    {
      say: 'The table tells you where to look. Then use CALC **2: zero**, with those two $x$-values as the bounds, to get the decimal.',
      example: ['Sign change between X = 1 and X = 2.', 'Left Bound $1$, Right Bound $2$.', 'Zero: $x \\approx 1.71$.'],
      check: { q: 'The sign changes between X = $-3$ and X = $-2$. Which bounds do you use?', options: ['Left $-3$, right $-2$', 'Left $-2$, right $-3$', 'Left $0$, right $3$'], answer: 0, why: 'Left is the smaller $x$, $-3$; right is the larger, $-2$.' },
    },
    {
      say: 'A table also **checks** a solution fast. Put each side of the equation in $Y_1$ and $Y_2$, go to your answer, and see if both columns match.',
      example: ['Claim: $x = 2$ solves $3^x = 4x + 1$.', 'Row X = 2: $Y_1 = 3^2 = 9$.', '$Y_2 = 4(2) + 1 = 9$.', 'They match, so $x = 2$ checks.'],
      check: { q: 'Does $x = 3$ solve $2^x = x + 4$?', options: ['No: $8 \\ne 7$', 'Yes: both are $8$', 'Yes: both are $7$'], answer: 0, why: '$2^3 = 8$ but $3 + 4 = 7$.' },
    },
    {
      say: 'For a growth or decay model, type the time $t$ as X. Then scroll to the time you need and read $Y_1$.',
      example: ['$A(t) = 200(1.05)^t$', '**[Y=]**: $Y_1 = 200(1.05)^X$', 'TblStart $= 0$, ΔTbl $= 1$', 'Row X = 4: $Y_1 \\approx 243.10$.'],
      check: { q: 'What does the table show for $A(2)$ when $A(t) = 100(1.1)^t$?', options: ['$121$', '$120$', '$110$', '$220$'], answer: 0, why: '$100(1.1)^2 = 100(1.21) = 121$.' },
    },
  ],

  'EXAM.nr-recording': [
    {
      say: '**Numerical response** (NR) questions are marked by a machine, one mark each. You write the answer in the boxes and fill in the matching circles.',
      example: ['Answer: $5.3$', 'Boxes: 5, then the decimal point, then 3.', 'Fill the circle under each one.'],
      check: { q: 'Why must an NR answer be in exactly the right format?', options: ['A machine scores it', 'A teacher reads your work', 'It is not marked'], answer: 0, why: 'The machine reads only the boxes and circles, so the format must be exact.' },
    },
    {
      say: '**Left-justify**: put the first digit in the left-hand box. Leave unused boxes on the right blank. The decimal point takes a box of its own.',
      example: ['Answer $17.4$ in four boxes.', 'Box 1: 1. Box 2: 7.', 'Box 3: the decimal point. Box 4: 4.'],
      check: { q: 'You record $8.5$ in four boxes. Which box stays blank?', options: ['The last box on the right', 'The first box on the left', 'None of them'], answer: 0, why: '$8.5$ uses three boxes, starting at the left. The fourth stays blank.' },
    },
    {
      say: 'A value between $0$ and $1$ keeps its **leading zero**, the $0$ before the decimal point. Record $0.25$, never $.25$.',
      example: ['Answer: $0.4$', 'Record: 0.4', 'Not: .4'],
      check: { q: 'How do you record $0.07$?', options: ['0.07', '.07', '7', '0.7'], answer: 0, why: 'Keep the leading zero and both decimal places.' },
    },
    {
      say: 'Round to the nearest tenth or hundredth, as the question says. Keep all the decimals until the final answer, then round once.',
      example: ['Calculator: $3.4567$', 'Nearest hundredth: the third decimal is $6$.', '$6 \\ge 5$, so round up.', 'Record: 3.46'],
      check: { q: 'The calculator shows $12.4349$. What do you record to the nearest tenth?', options: ['12.4', '12.43', '12.5', '124'], answer: 0, why: 'The hundredths digit is $3$, less than $5$, so the tenth stays $4$.' },
    },
    {
      say: 'If the answer cannot be a decimal, such as a number of people or arrangements, give a **whole number**.',
      example: ['How many ways can $4$ books be arranged?', '$4! = 4 \\times 3 \\times 2 \\times 1 = 24$', 'Record: 24'],
      check: { q: 'Which answer must be a whole number?', options: ['The number of committees that can be formed', 'The time for money to double', 'The height of a wave at $t = 2$'], answer: 0, why: 'You cannot form part of a committee, so the count is whole.' },
    },
    {
      say: 'For a **negative** answer, the minus sign is already printed before the boxes. Record only the digits.',
      example: ['Answer: $-2.75$', 'The minus sign is printed for you.', 'Record: 2.75'],
      check: { q: 'The answer is $-0.6$. What do you record?', options: ['0.6', '-0.6', '.6', '-.6'], answer: 0, why: 'The minus is printed already, and the leading zero stays.' },
    },
    {
      say: 'Some NR questions ask for item **numbers**, one digit per box. When the question says **any order**, the right digits in any order score.',
      example: ['Items 1, 3 and 4 are correct.', 'Record 134, or 431, or 314.', 'All of these score.'],
      check: { q: 'Items 2, 5 and 6 are the answers, in any order. Which entry scores?', options: ['625', '25', '2356', '56'], answer: 0, why: '625 uses exactly the digits 2, 5 and 6. Order does not matter here.' },
    },
    {
      say: 'When the order matters, as in "from least to greatest", only that order scores. Write one digit per box, in the order the question states.',
      example: ['Arrange items from least to greatest.', 'Item 4 is least, then 1, then 2, then 3.', 'Record 4123.', '3214 does not score.'],
      check: { q: 'From least to greatest: item 3, then item 1, then item 2. What do you record?', options: ['312', '123', '213', '321'], answer: 0, why: 'Write the item numbers in the order asked: 3, 1, 2.' },
    },
    {
      say: 'If more than one answer is correct, recording any one of them is enough.',
      example: ['Record one zero of $f(x) = (x - 2)(x - 5)$.', 'Both $2$ and $5$ are zeros.', 'Record 2 or 5. Either one scores.'],
      check: { q: 'Record a solution of $x^2 - 7x + 12 = 0$. What can you record?', options: ['3 (or 4)', '34', '7', '12'], answer: 0, why: '$(x - 3)(x - 4) = 0$, so $x = 3$ or $x = 4$. One of them is enough.' },
    },
  ],

  'EXAM.directing-words': [
    {
      say: 'In written response, a bolded **directing word** tells you exactly what job to do. Each word has a fixed meaning. Do that job, fully.',
      example: ['"**Determine**, to the nearest tenth, ..."', '"**Explain** why ..."', '"**Verify** that ..."'],
      check: { q: 'What does a bolded directing word tell you?', options: ['Exactly what the marker expects you to do', 'The answer to the question', 'Which part is worth the most'], answer: 0, why: 'Each directing word has an official meaning that sets the task.' },
    },
    {
      say: '**Algebraically** means show algebra steps with symbols. A graph or a table may only check your answer; on its own it earns little.',
      example: ['Solve $2^{x+1} = 8^{x-1}$ algebraically.', '$8 = 2^3$, so $2^{x+1} = 2^{3x - 3}$.', '$x + 1 = 3x - 3$', '$4 = 2x$, so $x = 2$.'],
      check: { q: 'Which response meets "algebraically"?', options: ['Rewrites both sides with base $2$ and solves for $x$', 'Reads $x = 2$ from a calculator graph', 'Tries $x = 2$ and says it works'], answer: 0, why: 'Only the first one shows algebra steps. The others are a graph and a guess.' },
    },
    {
      say: '**Determine** means show the formula or method, then give the answer to the accuracy asked. **Evaluate** means find the value.',
      example: ['Determine the doubling time at $5\\%$ per year, to the nearest tenth.', '$2 = 1.05^t$', '$t = \\frac{\\log 2}{\\log 1.05} \\approx 14.2$ years'],
      check: { q: 'Evaluate ${}_8C_3$. Which answer meets it?', options: ['$56$', '$\\frac{8!}{5!\\,3!}$', '$336$'], answer: 0, why: 'Evaluate wants the number. $\\frac{8!}{5!\\,3!} = 56$; $336$ is ${}_8P_3$.' },
    },
    {
      say: '**Verify** means put the given value into each side **separately**, work each side out, and show the two sides are equal.',
      example: ['Verify $\\theta = \\frac{\\pi}{3}$ in $\\cos 2\\theta = 2\\cos^2\\theta - 1$.', 'L.S. $= \\cos\\frac{2\\pi}{3} = -\\frac{1}{2}$', 'R.S. $= 2\\left(\\frac{1}{2}\\right)^2 - 1 = \\frac{1}{2} - 1 = -\\frac{1}{2}$', 'L.S. $=$ R.S.'],
      check: { q: 'A student works out the left side only and writes "it works". Does that verify?', options: ['No, both sides must be worked out and shown equal', 'Yes, one side is enough', 'Yes, if the left side is correct'], answer: 0, why: 'Verify needs both sides, each worked out on its own.' },
    },
    {
      say: '**Prove** means show it is true for **all** permissible values. Work one side alone until it becomes the other side. Checking one value never proves.',
      example: ['Prove $\\frac{\\sin 2\\theta}{1 + \\cos 2\\theta} = \\tan\\theta$.', 'L.S. $= \\frac{2\\sin\\theta\\cos\\theta}{2\\cos^2\\theta}$', '$= \\frac{\\sin\\theta}{\\cos\\theta} = \\tan\\theta$', 'L.S. $=$ R.S.'],
      check: { q: 'A student shows both sides equal $1$ when $\\theta = \\frac{\\pi}{4}$. Is the identity proved?', options: ['No, that only verifies one value', 'Yes, one value is enough', 'Yes, if a graph is added'], answer: 0, why: 'One value is a verification. A proof works for every permissible value.' },
    },
    {
      say: '**Explain** means give the reason ("because ...") using the math. **Justify** means back up a conclusion with a math argument, such as a calculation or a **counterexample** (one case that shows a claim is false).',
      example: ['Claim: $\\log(a + b) = \\log a + \\log b$.', 'Try $a = b = 10$: $\\log 20 \\approx 1.30$.', '$\\log 10 + \\log 10 = 1 + 1 = 2$.', '$1.30 \\ne 2$, so the claim is false.'],
      check: {
        q: 'Explain why $y = \\log_2(x - 3)$ has no $y$-intercept. Which answer meets explain?',
        options: ['At $x = 0$ the input is $-3$, and a log needs a positive input', 'Because the graph does not touch the $y$-axis', 'Because it is a log graph'],
        answer: 0,
        why: 'It gives the mathematical reason. The second answer only repeats the fact.',
      },
    },
    {
      say: '**Compare** means give features of **both** things: a similarity and a difference. **Describe** means use words with values: the factor, the axis, the direction and the distance.',
      example: ['Describe $y = -2f(x - 3)$ from $y = f(x)$:', 'A vertical stretch by a factor of $2$ about the $x$-axis.', 'A reflection in the $x$-axis.', 'A horizontal translation $3$ units right.'],
      check: {
        q: 'Which meets "compare $y = \\sin x$ and $y = 3\\sin 2x$"?',
        options: ['Both have midline $y = 0$; amplitudes $1$ and $3$; periods $2\\pi$ and $\\pi$', 'The second one is bigger', '$y = 3\\sin 2x$ has amplitude $3$ and period $\\pi$'],
        answer: 0,
        why: 'It gives features of both graphs, with a similarity and differences.',
      },
    },
    {
      say: '**Sketch** means scaled axes and every key feature. **Solve** means find **every** solution in the domain and reject any **extraneous** ones: answers that fail the original equation.',
      example: ['Solve $\\sqrt{x + 6} = x$.', 'Square: $x + 6 = x^2$, so $x^2 - x - 6 = 0$.', '$(x - 3)(x + 2) = 0$, so $x = 3$ or $x = -2$.', 'Check $x = -2$: $\\sqrt{4} = 2 \\ne -2$. Reject it.', 'Solution: $x = 3$.'],
      check: { q: 'A "solve" answer lists $x = 3$ and $x = -2$, but $-2$ fails the original equation. What is missing?', options: ['Rejecting the extraneous root $-2$', 'A graph of the equation', 'Units on the answer'], answer: 0, why: 'Solve means the full list of real solutions, with extraneous ones rejected.' },
    },
    {
      say: 'The Directing Words trainer in the Exam section has the full official list, with sample answers that earn full marks. Practise there to learn each word.',
    },
  ],

  'EXAM.wr-hygiene': [
    {
      say: 'Markers score what you **write**, not what you meant. Small slips often cost the last mark of a part.',
      example: ['Meant: $(-3)^2 = 9$.', 'Wrote: $-3^2 = 9$.', 'The marker reads $-3^2$, which is $-9$. Mark lost.'],
      check: { q: 'What does a marker score?', options: ['Exactly what is written', 'What you probably meant', 'Only the final answer'], answer: 0, why: 'Markers can only score what is on the page.' },
    },
    {
      say: 'An **equation** has an equals sign; an **expression** does not. When asked for "the equation of the function", write $y =$ in front.',
      example: ['Asked: the equation of the function.', 'Not enough: $2(x - 3)^2 + 1$', 'Full marks: $y = 2(x - 3)^2 + 1$'],
      check: { q: 'Which one is an equation?', options: ['$y = 4x - 7$', '$4x - 7$', '$4(x - 7)$'], answer: 0, why: 'Only $y = 4x - 7$ has an equals sign.' },
    },
    {
      say: 'Every answer in a real-world setting needs its **units**: metres, seconds, years, dollars.',
      example: ['Asked: the height of a Ferris wheel car after $10$ s.', 'Not enough: $h(10) = 23.4$', 'Full marks: $h(10) = 23.4$ m'],
      check: { q: 'A population reaches $5000$ after $7.8$ years. Which final line earns full marks?', options: ['$t = 7.8$ years', '$t = 7.8$', '$7.8$'], answer: 0, why: 'Only the first answer has its units.' },
    },
    {
      say: 'An exponent acts only on what is right next to it. $(-3)^2 = 9$, but $-3^2 = -(3^2) = -9$. Use brackets for a negative base.',
      example: ['$-2^4 = -(2^4) = -16$', '$(-2)^4 = (-2)(-2)(-2)(-2) = 16$'],
      check: { q: 'Evaluate $-5^2$.', options: ['$-25$', '$25$', '$-10$', '$10$'], answer: 0, why: 'Square first, then apply the minus: $-(5^2) = -25$.' },
    },
    {
      say: 'Brackets matter inside functions too. $\\log(x + 2)$ is not $\\log x + 2$. In a binomial general term, a negative term keeps its brackets: $(-1)^k$.',
      example: ['$(2x - 1)^5$: the second term is $-1$.', '$t_{k+1} = {}_5C_k(2x)^{5-k}(-1)^k$', 'Not $- 1^k$, which is always $-1$.'],
      check: { q: 'Which correctly means "the log of $x + 2$"?', options: ['$\\log(x + 2)$', '$\\log x + 2$', '$\\log x + \\log 2$'], answer: 0, why: 'The brackets keep the whole $x + 2$ inside the log.' },
    },
    {
      say: 'A trig function always needs its **argument**, the angle it acts on. Write $\\sin\\theta$, never $\\sin$ alone.',
      example: ['Wrong: $2\\sin = 1$, so $\\sin = \\frac{1}{2}$.', 'Right: $2\\sin\\theta = 1$, so $\\sin\\theta = \\frac{1}{2}$.'],
      check: { q: 'Which line is written correctly?', options: ['$\\cos x = \\frac{1}{2}$', '$\\cos = \\frac{1}{2}$', '$x\\cos = \\frac{1}{2}$'], answer: 0, why: 'The cosine needs its angle, $x$, right after it.' },
    },
    {
      say: '**Exact** means no decimals: use fractions, radicals, $\\pi$ or logs. "To the nearest hundredth" means a rounded decimal. Give the form the question asks for.',
      example: ['Solve $2^x = 7$, exact: $x = \\frac{\\log 7}{\\log 2}$.', 'Solve $3^x = 20$, to the nearest hundredth:', '$x = \\frac{\\log 20}{\\log 3} \\approx 2.73$'],
      check: { q: 'Give the **exact** solutions of $\\cos x = \\frac{1}{2}$, $0 \\le x < 2\\pi$.', options: ['$\\frac{\\pi}{3}, \\frac{5\\pi}{3}$', '$1.05, 5.24$', '$60^\\circ, 300^\\circ$'], answer: 0, why: 'Exact means no decimals, and the domain uses $\\pi$, so give radians.' },
    },
    {
      say: 'For domain and range, **interval** notation and **set-builder** notation are both accepted. The integers can be written $I$ or $Z$.',
      example: ['Interval: $[2, \\infty)$', 'Set-builder: $\\{x \\mid x \\ge 2, x \\in R\\}$', 'Both mean every real number $2$ or more.'],
      check: { q: 'Which interval means the same as $y \\le 10$?', options: ['$(-\\infty, 10]$', '$(-\\infty, 10)$', '$[10, \\infty)$'], answer: 0, why: '$y$ goes down forever and includes $10$, so use a square bracket at $10$.' },
    },
    {
      say: 'Show the **pertinent** (relevant) ideas, formulas and calculations. A good start can earn part marks, so always write something. A blank earns nothing.',
      check: { q: 'You are stuck on a written-response part. What should you do?', options: ['Write the formula and the first steps you can', 'Leave it blank', 'Write a guess with no work'], answer: 0, why: 'Pertinent ideas and formulas can earn part marks.' },
    },
  ],

  'EXAM.sketch-standard': [
    {
      say: 'A full-mark **sketch** has **scaled axes** (numbers at the tick marks) and every **key feature**, labelled with coordinates or equations.',
      example: ['Key features: intercepts, asymptotes, holes, endpoints, maximums, minimums.', 'Label each one, like $(0, -4)$ or $x = 3$.'],
      check: { q: 'The curve has the right shape, but the axes have no numbers. Full marks?', options: ['No, the axes need a scale', 'Yes, the shape is what counts', 'Yes, if the curve is smooth'], answer: 0, why: 'A sketch needs scaled axes so the features can be read.' },
    },
    {
      say: 'For a **polynomial**, show the zeros, the $y$-intercept and the **end behaviour** (where each end goes). At a zero with odd **multiplicity** the graph crosses; with even multiplicity it touches and turns back.',
      example: ['$y = (x + 2)^2(x - 1)$', 'Zero $-2$, squared (even): touches.', 'Zero $1$ (odd): crosses.', '$y$-intercept: $(0 + 2)^2(0 - 1) = -4$.', 'Positive cubic: falls on the left, rises on the right.'],
      check: { q: 'In $y = (x - 5)^2(x + 1)$, what does the graph do at $x = 5$?', options: ['Touches the axis and turns back', 'Crosses the axis', 'Has an asymptote'], answer: 0, why: 'The factor $(x - 5)$ is squared, an even multiplicity, so it touches.' },
    },
    {
      say: 'For a **rational** function, draw each **asymptote** as a dashed line and label its equation. Mark the intercepts too.',
      example: ['$y = \\frac{x - 1}{x + 2}$', 'Vertical asymptote: $x = -2$.', 'Horizontal asymptote: $y = 1$.', 'Intercepts: $(1, 0)$ and $\\left(0, -\\frac{1}{2}\\right)$.'],
      check: { q: 'What is the vertical asymptote of $y = \\frac{2x}{x - 3}$?', options: ['$x = 3$', '$x = -3$', '$y = 2$', '$x = 2$'], answer: 0, why: 'The denominator $x - 3$ is $0$ at $x = 3$.' },
    },
    {
      say: 'A **hole** is a single missing point, from a factor that cancels. Draw it as an **open circle** at its exact coordinates.',
      example: ['$y = \\frac{(x + 1)(x - 2)}{x - 2}$', 'Cancel: $y = x + 1$, $x \\ne 2$.', 'At $x = 2$: $y = 2 + 1 = 3$.', 'Open circle at $(2, 3)$.'],
      check: { q: 'Where is the hole in $y = \\frac{x^2 - 1}{x - 1}$?', options: ['$(1, 2)$', '$(1, 0)$', '$(-1, 0)$', '$(2, 1)$'], answer: 0, why: '$x^2 - 1 = (x - 1)(x + 1)$, so $y = x + 1$ with $x \\ne 1$. At $x = 1$, $y = 2$.' },
    },
    {
      say: 'For **exponential** and **logarithmic** graphs, show the asymptote, the intercepts and one more labelled point.',
      example: ['$y = \\log_2(x + 4)$', 'Asymptote: $x = -4$.', '$x$-intercept: $x + 4 = 1$, so $(-3, 0)$.', '$y$-intercept: $\\log_2 4 = 2$, so $(0, 2)$.', 'One more: $x = 4$ gives $\\log_2 8 = 3$, so $(4, 3)$.'],
      check: { q: 'What is the asymptote of $y = 2^x - 5$?', options: ['$y = -5$', '$x = -5$', '$y = 0$', '$y = 5$'], answer: 0, why: '$2^x$ has asymptote $y = 0$. Shifting down $5$ moves it to $y = -5$.' },
    },
    {
      say: 'For a **radical** (square root) graph, mark the **endpoint** with a closed dot and show which way the curve goes from it.',
      example: ['$y = \\sqrt{x - 2} + 1$', 'Endpoint: $(2, 1)$, closed dot.', 'The curve goes right and up from there.', 'One more: $x = 6$ gives $\\sqrt{4} + 1 = 3$, so $(6, 3)$.'],
      check: { q: 'Where is the endpoint of $y = \\sqrt{x + 3} - 4$?', options: ['$(-3, -4)$', '$(3, -4)$', '$(-3, 4)$', '$(0, -4)$'], answer: 0, why: 'The inside is $0$ at $x = -3$, and then $y = 0 - 4 = -4$.' },
    },
    {
      say: 'For a **sinusoid**, show the maximum, minimum, **midline** (the middle line) and the period. Space $x$-ticks a quarter period apart, in radians when the domain uses $\\pi$, and mark both ends of the domain.',
      example: ['$y = 3\\sin 2x + 1$, $0 \\le x \\le 2\\pi$', 'Max: $1 + 3 = 4$. Min: $1 - 3 = -2$.', 'Midline: $y = 1$.', 'Period: $\\frac{2\\pi}{2} = \\pi$. Quarter: $\\frac{\\pi}{4}$.', 'Ticks every $\\frac{\\pi}{4}$, from $0$ to $2\\pi$.'],
      check: { q: 'What $x$-tick spacing suits $y = 2\\cos 4x$?', options: ['$\\frac{\\pi}{8}$', '$\\frac{\\pi}{2}$', '$\\frac{\\pi}{4}$', '$1$'], answer: 0, why: 'The period is $\\frac{2\\pi}{4} = \\frac{\\pi}{2}$. A quarter of that is $\\frac{\\pi}{8}$.' },
    },
    {
      say: 'Draw curves smoothly. Get close to an asymptote, but never cross a **vertical** one. Stop exactly at a domain endpoint.',
      example: ['$y = \\frac{x - 1}{x + 2}$ has a vertical asymptote $x = -2$.', 'Draw two separate branches, one on each side.', 'Do not join them across $x = -2$.'],
      check: { q: 'You plotted points on both sides of a vertical asymptote at $x = -2$. Should you join them?', options: ['No, never draw across a vertical asymptote', 'Yes, join all the plotted points', 'Yes, with a straight line'], answer: 0, why: 'The function is undefined at $x = -2$, so the graph has a break there.' },
    },
  ],
};
