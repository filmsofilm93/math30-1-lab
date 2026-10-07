import type { LessonCard } from '../types';

/** Lesson cards in plain words, one small idea per card. Keyed by skill node id. */
export const CARDS: Record<string, LessonCard[]> = {
  'RF3.stretch-v': [
    {
      say: 'In $y = af(x)$, the $a$ sits **outside** the function. It multiplies every **output** (every $y$-value) by $a$. The $x$-values stay the same.',
      example: ['Point $(3, 4)$ on $y = f(x)$. Graph $y = 2f(x)$.', 'Keep $x$: $3$.', 'New $y$: $2 \\times 4 = 8$.', 'New point: $(3, 8)$.'],
      check: { q: '$(5, -2)$ is on $y = f(x)$. Which point is on $y = 3f(x)$?', options: ['$(5, -6)$', '$(15, -2)$', '$(15, -6)$', '$(5, 1)$'], answer: 0, why: 'Only $y$ is multiplied: $3 \\times (-2) = -6$. The $x$ stays $5$.' },
    },
    {
      say: 'This is a **vertical stretch** by a factor of $|a|$, measured from the $x$-axis. When $|a| > 1$, the graph pulls away from the $x$-axis and looks taller.',
      example: ['$y = 4f(x)$', 'Every $y$-value is 4 times as big.', 'Vertical stretch by a factor of $4$.'],
      check: { q: 'How is $y = 5f(x)$ related to $y = f(x)$?', options: ['Vertical stretch by a factor of $5$', 'Horizontal stretch by a factor of $5$', 'Vertical stretch by a factor of $\\frac{1}{5}$', 'Moved up 5'], answer: 0, why: 'The $5$ is outside, so it multiplies $y$-values by 5. That is a vertical stretch by 5.' },
    },
    {
      say: 'When $a$ is between $0$ and $1$, the stretch **squashes** the graph toward the $x$-axis. The rule is the same: multiply $y$ by $a$.',
      example: ['Point $(6, 8)$. Graph $y = \\frac{1}{2}f(x)$.', 'New $y$: $\\frac{1}{2} \\times 8 = 4$.', 'New point: $(6, 4)$.'],
      check: { q: '$(2, 10)$ is on $y = f(x)$. Which point is on $y = \\frac{1}{5}f(x)$?', options: ['$(2, 2)$', '$(2, 50)$', '$(10, 10)$', '$(\\frac{2}{5}, 10)$'], answer: 0, why: '$\\frac{1}{5} \\times 10 = 2$, and $x$ does not change.' },
    },
    {
      say: 'If $a$ is **negative**, the graph also **reflects** (flips) in the $x$-axis. Every $y$-value changes sign as well as stretching.',
      example: ['Point $(4, 3)$. Graph $y = -2f(x)$.', 'New $y$: $-2 \\times 3 = -6$.', 'New point: $(4, -6)$.', 'Stretch by 2, then flip upside down.'],
      check: { q: 'How is $y = -3f(x)$ related to $y = f(x)$?', options: ['Vertical stretch by $3$ and a reflection in the $x$-axis', 'Vertical stretch by $3$ and a reflection in the $y$-axis', 'Vertical stretch by $-3$ only', 'Moved down 3'], answer: 0, why: 'The size $3$ is the stretch. The negative sign flips the graph over the $x$-axis.' },
    },
    {
      say: 'Points with $y = 0$ never move, because $a \\times 0 = 0$. These are the $x$-intercepts. A point that does not move is called an **invariant point**.',
      example: ['Point $(-2, 0)$. Graph $y = 5f(x)$.', 'New $y$: $5 \\times 0 = 0$.', 'Still $(-2, 0)$: it is invariant.'],
      check: { q: 'Which point of $y = f(x)$ stays fixed under $y = 5f(x)$?', options: ['$(-2, 0)$', '$(0, 3)$', '$(1, 1)$', '$(4, 2)$'], answer: 0, why: 'Only a point with $y = 0$ stays put, since $5 \\times 0 = 0$.' },
    },
    {
      say: 'The **domain** (the $x$-values) does not change. The **range** (the $y$-values) changes: multiply each end of the range by $a$.',
      example: ['Domain $[0, 6]$, range $[-1, 4]$. Graph $y = 3f(x)$.', 'Domain stays $[0, 6]$.', 'Range: $3 \\times (-1) = -3$ and $3 \\times 4 = 12$.', 'New range: $[-3, 12]$.'],
      check: { q: '$y = f(x)$ has domain $[0, 6]$ and range $[2, 5]$. What are the domain and range of $y = 2f(x)$?', options: ['Domain $[0, 6]$, range $[4, 10]$', 'Domain $[0, 12]$, range $[4, 10]$', 'Domain $[0, 12]$, range $[2, 5]$', 'Domain $[0, 3]$, range $[4, 10]$'], answer: 0, why: 'Only $y$-values are doubled, so the domain stays and the range becomes $[4, 10]$.' },
    },
    {
      say: 'With a negative $a$, the range ends swap places. Multiply both ends, then write the **smaller** number first.',
      example: ['Range $[-1, 4]$. Graph $y = -2f(x)$.', '$-2 \\times (-1) = 2$', '$-2 \\times 4 = -8$', 'Smaller first: $[-8, 2]$.'],
      check: { q: 'The range of $y = f(x)$ is $[1, 3]$. What is the range of $y = -2f(x)$?', options: ['$[-6, -2]$', '$[2, 6]$', '$[-2, 6]$', '$[-1, 1]$'], answer: 0, why: '$-2 \\times 1 = -2$ and $-2 \\times 3 = -6$. Smaller first gives $[-6, -2]$.' },
    },
  ],

  'RF3.stretch-h': [
    {
      say: 'In $y = f(bx)$, the $b$ sits **inside**, right next to $x$. It changes the **inputs**, so it acts **sideways** (horizontally). The $y$-values stay the same.',
      check: { q: 'In $y = f(3x)$, which coordinate of each point changes?', options: ['Only $x$', 'Only $y$', 'Both $x$ and $y$', 'Neither'], answer: 0, why: 'The $3$ is inside with $x$, so only the $x$-values change.' },
    },
    {
      say: 'Inside works **backwards**. Instead of multiplying $x$ by $b$, you **divide** $x$ by $b$. The rule is $(x, y) \\to \\left(\\frac{x}{b}, y\\right)$.',
      example: ['Point $(6, 5)$. Graph $y = f(2x)$.', 'New $x$: $6 \\div 2 = 3$.', 'Keep $y$: $5$.', 'New point: $(3, 5)$.'],
      check: { q: '$(8, 1)$ is on $y = f(x)$. Which point is on $y = f(4x)$?', options: ['$(2, 1)$', '$(32, 1)$', '$(8, 4)$', '$(2, 4)$'], answer: 0, why: 'Divide $x$ by $b$: $8 \\div 4 = 2$. The $y$ stays $1$.' },
    },
    {
      say: 'Why divide? On $y = f(2x)$, the old input now comes from $2x$. To feed $f$ the same old input, $x$ only needs to be half as big.',
      example: ['Old graph: $f(2) = 4$.', 'New graph $y = f(2x)$ gives output $4$ when $2x = 2$.', 'So $x = 1$.', 'The point $(2, 4)$ moved to $(1, 4)$.'],
      check: { q: '$f(6) = 7$. On $y = f(3x)$, which $x$ gives the output $7$?', options: ['$2$', '$18$', '$6$', '$9$'], answer: 0, why: 'You need $3x = 6$, so $x = 2$.' },
    },
    {
      say: 'The **horizontal stretch factor** is $\\frac{1}{|b|}$, measured from the $y$-axis. So $b = 2$ means a factor of $\\frac{1}{2}$ (narrower), and $b = \\frac{1}{3}$ means a factor of $3$ (wider).',
      example: ['Point $(2, 5)$. Graph $y = f\\left(\\frac{1}{3}x\\right)$.', 'New $x$: $2 \\div \\frac{1}{3} = 2 \\times 3 = 6$.', 'New point: $(6, 5)$.', 'The graph got 3 times wider.'],
      check: { q: '$y = f(4x)$ is a horizontal stretch by what factor?', options: ['$\\frac{1}{4}$', '$4$', '$-4$', '$2$'], answer: 0, why: 'The factor is $\\frac{1}{b} = \\frac{1}{4}$. The graph gets narrower.' },
    },
    {
      say: 'Exam trap: "horizontal stretch by a factor of $3$" means $b = \\frac{1}{3}$, **not** $b = 3$. Flip the factor to get $b$.',
      example: ['Stretch horizontally by a factor of $3$.', 'Flip it: $b = \\frac{1}{3}$.', 'Equation: $y = f\\left(\\frac{1}{3}x\\right)$.'],
      check: { q: 'Stretch $y = x^2$ horizontally by a factor of $2$. Which equation do you get?', options: ['$y = \\left(\\frac{1}{2}x\\right)^2$', '$y = (2x)^2$', '$y = 2x^2$', '$y = \\frac{1}{2}x^2$'], answer: 0, why: 'A factor of $2$ means $b = \\frac{1}{2}$, placed inside with $x$.' },
    },
    {
      say: 'If $b$ is **negative**, the graph also **reflects** in the $y$-axis (flips left to right). Dividing by a negative changes the sign of $x$.',
      example: ['Point $(6, -1)$. Graph $y = f(-2x)$.', 'New $x$: $6 \\div (-2) = -3$.', 'New point: $(-3, -1)$.'],
      check: { q: '$(-4, 3)$ is on $y = f(x)$. Which point is on $y = f(-x)$?', options: ['$(4, 3)$', '$(-4, -3)$', '$(4, -3)$', '$(-4, 3)$'], answer: 0, why: 'Here $b = -1$: $-4 \\div (-1) = 4$. The $y$ stays $3$.' },
    },
    {
      say: 'Points with $x = 0$ never move, because $0 \\div b = 0$. So the $y$-intercept is the **invariant point** (the point that stays put).',
      example: ['Point $(0, 7)$. Graph $y = f(5x)$.', 'New $x$: $0 \\div 5 = 0$.', 'Still $(0, 7)$.'],
      check: { q: 'Which point of $y = f(x)$ stays fixed under $y = f(2x)$?', options: ['$(0, -3)$', '$(4, 0)$', '$(2, 2)$', '$(-1, 0)$'], answer: 0, why: 'Only a point with $x = 0$ stays put, since $0 \\div 2 = 0$.' },
    },
    {
      say: 'The **range** does not change. The **domain** ends get divided by $b$. If $b$ is negative, write the smaller number first.',
      example: ['Domain $[-4, 8]$. Graph $y = f(2x)$.', '$-4 \\div 2 = -2$ and $8 \\div 2 = 4$.', 'New domain: $[-2, 4]$.'],
      check: { q: '$y = f(x)$ has domain $[-6, 3]$ and range $[0, 5]$. What are the domain and range of $y = f(-3x)$?', options: ['Domain $[-1, 2]$, range $[0, 5]$', 'Domain $[-18, 9]$, range $[0, 5]$', 'Domain $[-1, 2]$, range $[-15, 0]$', 'Domain $[-2, 1]$, range $[0, 5]$'], answer: 0, why: '$-6 \\div (-3) = 2$ and $3 \\div (-3) = -1$. Smaller first: $[-1, 2]$. The range stays.' },
    },
  ],

  'RF5.reflect-axes': [
    {
      say: 'A minus sign **outside**, $y = -f(x)$, changes the sign of every $y$-value: $(x, y) \\to (x, -y)$. This is a **reflection in the $x$-axis**. The graph flips upside down.',
      example: ['Point $(3, 5)$. Graph $y = -f(x)$.', 'Keep $x$: $3$.', 'Change the sign of $y$: $-5$.', 'New point: $(3, -5)$.'],
      check: { q: '$(-2, 4)$ is on $y = f(x)$. Which point is on $y = -f(x)$?', options: ['$(-2, -4)$', '$(2, 4)$', '$(2, -4)$', '$(4, -2)$'], answer: 0, why: 'Only $y$ changes sign: $4$ becomes $-4$.' },
    },
    {
      say: 'A minus sign **inside**, $y = f(-x)$, changes the sign of every $x$-value: $(x, y) \\to (-x, y)$. This is a **reflection in the $y$-axis**. The graph flips left to right.',
      example: ['Point $(3, 5)$. Graph $y = f(-x)$.', 'Change the sign of $x$: $-3$.', 'Keep $y$: $5$.', 'New point: $(-3, 5)$.'],
      check: { q: '$(-2, 4)$ is on $y = f(x)$. Which point is on $y = f(-x)$?', options: ['$(2, 4)$', '$(-2, -4)$', '$(2, -4)$', '$(4, -2)$'], answer: 0, why: 'Only $x$ changes sign: $-2$ becomes $2$.' },
    },
    {
      say: 'Memory aid: a negative **outside** flips **up and down**. A negative **inside** (on the $x$) flips **left and right**.',
      example: ['$y = -\\sqrt{x}$: outside, so flip in the $x$-axis.', '$y = \\sqrt{-x}$: inside, so flip in the $y$-axis.'],
      check: { q: 'How is $y = \\sqrt{-x}$ related to $y = \\sqrt{x}$?', options: ['Reflection in the $y$-axis', 'Reflection in the $x$-axis', 'Reflection in both axes', 'Moved left 1'], answer: 0, why: 'The negative is on the $x$, inside the root, so it flips left and right.' },
    },
    {
      say: 'A negative in **both** places, $y = -f(-x)$, does both flips: $(x, y) \\to (-x, -y)$. Both coordinates change sign.',
      example: ['Point $(2, 3)$. Graph $y = -f(-x)$.', 'New $x$: $-2$.', 'New $y$: $-3$.', 'New point: $(-2, -3)$.'],
      check: { q: 'How is $y = -\\sqrt{-x}$ related to $y = \\sqrt{x}$?', options: ['Reflection in the $x$-axis and in the $y$-axis', 'Reflection in the $x$-axis only', 'Reflection in the $y$-axis only', 'No change'], answer: 0, why: 'There is a negative outside (flip up and down) and a negative on $x$ (flip left and right).' },
    },
    {
      say: 'Some points do not move. A reflection in the $x$-axis keeps the $x$-intercepts fixed. A reflection in the $y$-axis keeps the $y$-intercept fixed. These are the **invariant points**.',
      example: ['$(4, 0)$ under $y = -f(x)$: $-0 = 0$, so it stays.', '$(0, 6)$ under $y = f(-x)$: $-0 = 0$, so it stays.'],
      check: { q: '$y = f(x)$ has $x$-intercepts $-1$ and $3$ and $y$-intercept $6$. What is the invariant point of $y = f(-x)$?', options: ['$(0, 6)$', '$(-1, 0)$ and $(3, 0)$', '$(0, -6)$', '$(1, 0)$ and $(-3, 0)$'], answer: 0, why: 'A reflection in the $y$-axis keeps only the point with $x = 0$: the $y$-intercept.' },
    },
    {
      say: 'To reflect a polynomial in the $x$-axis, write $y = -f(x)$. Change the sign of **every** term.',
      example: ['$f(x) = x^2 - 3x + 2$', '$y = -(x^2 - 3x + 2)$', '$y = -x^2 + 3x - 2$'],
      check: { q: '$f(x) = 2x^2 + x - 5$. What is the reflection in the $x$-axis?', options: ['$y = -2x^2 - x + 5$', '$y = -2x^2 + x - 5$', '$y = 2x^2 - x - 5$', '$y = -2x^2 - x - 5$'], answer: 0, why: 'Every term changes sign, including the constant $-5$, which becomes $+5$.' },
    },
    {
      say: 'To reflect a polynomial in the $y$-axis, replace every $x$ with $(-x)$. **Even** powers keep their sign. **Odd** powers change sign.',
      example: ['$f(x) = x^2 - 3x + 2$', '$y = (-x)^2 - 3(-x) + 2$', '$(-x)^2 = x^2$ and $-3(-x) = +3x$.', '$y = x^2 + 3x + 2$'],
      check: { q: '$f(x) = x^3 + 4x^2 - x + 1$. What is $y = f(-x)$?', options: ['$y = -x^3 + 4x^2 + x + 1$', '$y = -x^3 - 4x^2 + x - 1$', '$y = x^3 + 4x^2 + x + 1$', '$y = -x^3 + 4x^2 - x + 1$'], answer: 0, why: 'The odd powers $x^3$ and $x$ change sign. The $x^2$ term and the constant stay.' },
    },
  ],

  'RF3.invariant': [
    {
      say: 'An **invariant point** is a point that stays exactly where it is after a transformation. It maps to itself.',
      example: ['Point $(4, 0)$. Graph $y = 3f(x)$.', 'New $y$: $3 \\times 0 = 0$.', 'New point: $(4, 0)$. Same point, so it is invariant.'],
      check: { q: 'Under $y = 2f(x)$, where does the point $(5, 0)$ go?', options: ['It stays at $(5, 0)$', '$(10, 0)$', '$(5, 2)$', '$(\\frac{5}{2}, 0)$'], answer: 0, why: 'Only $y$ is doubled, and $2 \\times 0 = 0$. So the point does not move.' },
    },
    {
      say: 'A **vertical** change ($y = af(x)$ or $y = -f(x)$) multiplies $y$. Only $y = 0$ stays the same. So the invariant points are the $x$-intercepts.',
      example: ['$y = f(x)$ has $x$-intercepts $-2$ and $5$.', 'Under $y = 4f(x)$, those points do not move.', 'Invariant points: $(-2, 0)$ and $(5, 0)$.'],
      check: { q: '$y = f(x)$ has $x$-intercepts $-3$ and $4$ and $y$-intercept $6$. List the invariant points of $y = -f(x)$.', options: ['$(-3, 0)$ and $(4, 0)$', '$(0, 6)$', '$(-3, 0)$, $(4, 0)$ and $(0, 6)$', '$(0, -6)$'], answer: 0, why: 'A vertical change fixes points with $y = 0$: the $x$-intercepts.' },
    },
    {
      say: 'A **horizontal** change ($y = f(bx)$ or $y = f(-x)$) divides $x$ by $b$. Only $x = 0$ stays the same. So the invariant point is the $y$-intercept.',
      example: ['$y = f(x)$ has $y$-intercept $6$.', 'Under $y = f(2x)$: $0 \\div 2 = 0$.', 'Invariant point: $(0, 6)$.'],
      check: { q: '$y = f(x)$ has $x$-intercepts $-3$ and $4$ and $y$-intercept $6$. List the invariant points of $y = f\\left(\\frac{1}{2}x\\right)$.', options: ['$(0, 6)$', '$(-3, 0)$ and $(4, 0)$', '$(0, 3)$', '$(-6, 0)$ and $(8, 0)$'], answer: 0, why: 'A horizontal change fixes only the point with $x = 0$: the $y$-intercept.' },
    },
    {
      say: 'A **translation** (a slide) moves every point. So a translation has **no** invariant points.',
      example: ['$y = f(x - 2)$ moves every point right 2.', '$(0, 6) \\to (2, 6)$ and $(4, 0) \\to (6, 0)$.', 'Nothing stays put.'],
      check: { q: 'Which points are invariant under $y = f(x) + 3$?', options: ['None', 'The $x$-intercepts', 'The $y$-intercept', 'Every point'], answer: 0, why: 'Moving up 3 changes every $y$-value, so no point stays put.' },
    },
    {
      say: 'To **count** invariant points of a vertical change, count the different zeros of $f$. Each zero is one $x$-intercept.',
      example: ['$f(x) = (x + 1)(x - 2)(x - 5)$', 'Zeros: $-1$, $2$ and $5$.', 'Under $y = 4f(x)$: 3 invariant points.'],
      check: { q: '$f(x) = (x + 3)(x - 1)$. How many invariant points does $y = -f(x)$ have?', options: ['$2$', '$1$', '$0$', '$3$'], answer: 0, why: 'A vertical change fixes the $x$-intercepts, and there are two zeros: $-3$ and $1$.' },
    },
    {
      say: 'For a horizontal change, there is always just **one** invariant point: the $y$-intercept. The number of zeros does not matter.',
      example: ['$f(x) = (x + 3)(x - 1)(x - 4)$', 'Three zeros, but $y = f(2x)$ is horizontal.', 'Only $(0, f(0))$ stays put.', '$f(0) = (3)(-1)(-4) = 12$, so $(0, 12)$.'],
      check: { q: '$f(x) = (x + 2)(x - 1)(x - 3)$. How many invariant points does $y = f(-x)$ have?', options: ['$1$', '$3$', '$0$', '$2$'], answer: 0, why: 'A reflection in the $y$-axis is horizontal, so only the $y$-intercept stays.' },
    },
    {
      say: 'A reflection in the line $y = x$ swaps $x$ and $y$. A point stays put only if its $x$ equals its $y$. Find these points by solving $f(x) = x$.',
      example: ['$f(x) = 2x - 3$', 'Solve $2x - 3 = x$.', '$x = 3$', 'Invariant point: $(3, 3)$.'],
      check: { q: 'What is the invariant point when $f(x) = 3x + 4$ is reflected in $y = x$?', options: ['$(-2, -2)$', '$(2, 2)$', '$(-4, -4)$', '$(0, 4)$'], answer: 0, why: '$3x + 4 = x$ gives $2x = -4$, so $x = -2$ and the point is $(-2, -2)$.' },
    },
  ],

  'RF4.combined': [
    {
      say: 'The full form is $y = af(b(x - h)) + k$. Each letter has one job. $a$: vertical stretch. $b$: horizontal stretch. $h$: left or right. $k$: up or down.',
      example: ['$y = 3f(2(x - 1)) + 5$', '$a = 3$, $b = 2$', '$h = 1$, $k = 5$'],
      check: { q: 'In $y = 4f(3(x + 2)) - 1$, what is $b$?', options: ['$3$', '$4$', '$-2$', '$-1$'], answer: 0, why: '$b$ is the number multiplying the bracket inside the function.' },
    },
    {
      say: 'Every point follows one **mapping rule**: $(x, y) \\to \\left(\\frac{x}{b} + h,\\ ay + k\\right)$. The $x$ part uses $b$ and $h$. The $y$ part uses $a$ and $k$.',
      example: ['$y = 2f(x - 4) - 1$, point $(5, 3)$.', 'Here $b = 1$: new $x = 5 + 4 = 9$.', 'New $y = 2(3) - 1 = 5$.', 'New point: $(9, 5)$.'],
      check: { q: 'For $y = 2f(x - 4) - 1$, an old point has $y = 3$. What is its new $y$?', options: ['$5$', '$4$', '$2$', '$6$'], answer: 0, why: 'New $y = ay + k = 2(3) - 1 = 5$.' },
    },
    {
      say: 'Order matters. **Stretch first, slide last.** The new $x$ is $\\frac{x}{b} + h$. It is **not** $\\frac{x + h}{b}$.',
      example: ['$x = 8$, $b = 2$, $h = 3$.', 'Divide first: $8 \\div 2 = 4$.', 'Then add $h$: $4 + 3 = 7$.', 'Not $(8 + 3) \\div 2 = 5.5$.'],
      check: { q: 'Old $x = 6$, with $b = 3$ and $h = -1$. What is the new $x$?', options: ['$1$', '$\\frac{5}{3}$', '$17$', '$3$'], answer: 0, why: '$6 \\div 3 = 2$, then $2 + (-1) = 1$.' },
    },
    {
      say: 'The same order works for $y$. The new $y$ is $ay + k$: multiply first, then add. It is **not** $a(y + k)$.',
      example: ['$y = 4$, $a = 3$, $k = -2$.', 'Multiply first: $3 \\times 4 = 12$.', 'Then add $k$: $12 - 2 = 10$.', 'Not $3(4 - 2) = 6$.'],
      check: { q: 'Old $y = 3$, with $a = -2$ and $k = 5$. What is the new $y$?', options: ['$-1$', '$-16$', '$11$', '$1$'], answer: 0, why: '$-2 \\times 3 = -6$, then $-6 + 5 = -1$.' },
    },
    {
      say: 'Put it together to move one point. Read $a$, $b$, $h$ and $k$, then work out the new $x$ and new $y$ separately.',
      example: ['$(6, -2)$ on $y = -3f(2(x + 1)) + 4$.', '$a = -3$, $b = 2$, $h = -1$, $k = 4$.', 'New $x$: $6 \\div 2 = 3$, then $3 - 1 = 2$.', 'New $y$: $-3 \\times (-2) = 6$, then $6 + 4 = 10$.', 'New point: $(2, 10)$.'],
      check: { q: '$(4, 1)$ is on $y = f(x)$. Where does it go on $y = 2f\\left(\\frac{1}{2}(x - 3)\\right) - 5$?', options: ['$(11, -3)$', '$(5, -3)$', '$(11, -8)$', '$(7, -3)$'], answer: 0, why: '$4 \\div \\frac{1}{2} = 8$ and $8 + 3 = 11$. Then $2(1) - 5 = -3$.' },
    },
    {
      say: 'To write the mapping rule, put the numbers into $\\left(\\frac{x}{b} + h,\\ ay + k\\right)$. Dividing by a fraction is the same as multiplying by its flip.',
      example: ['$y = 4f\\left(-\\frac{1}{3}(x - 2)\\right) + 1$', '$\\frac{x}{b} = x \\div \\left(-\\frac{1}{3}\\right) = -3x$', 'Rule: $(x, y) \\to (-3x + 2,\\ 4y + 1)$'],
      check: { q: 'What is the mapping rule for $y = -f(2(x + 5)) - 3$?', options: ['$(x, y) \\to \\left(\\frac{x}{2} - 5,\\ -y - 3\\right)$', '$(x, y) \\to \\left(\\frac{x}{2} + 5,\\ -y - 3\\right)$', '$(x, y) \\to (2x - 5,\\ -y - 3)$', '$(x, y) \\to \\left(\\frac{x}{2} - 5,\\ -y + 3\\right)$'], answer: 0, why: '$b = 2$ and $h = -5$ give $\\frac{x}{2} - 5$. $a = -1$ and $k = -3$ give $-y - 3$.' },
    },
    {
      say: 'To describe a combined transformation in words, go in this order: vertical stretch by $|a|$, horizontal stretch by $\\frac{1}{|b|}$, reflections from a negative $a$ or $b$, then the slides $h$ and $k$.',
      example: ['$y = -2f(3(x - 4)) + 1$', 'Vertical stretch by $2$. Horizontal stretch by $\\frac{1}{3}$.', 'Reflection in the $x$-axis (negative $a$).', 'Right 4, up 1.'],
      check: { q: 'Which describes $y = \\frac{1}{2}f(-(x + 6))$?', options: ['Vertical stretch by $\\frac{1}{2}$, reflection in the $y$-axis, left 6', 'Vertical stretch by $\\frac{1}{2}$, reflection in the $y$-axis, right 6', 'Vertical stretch by $\\frac{1}{2}$, reflection in the $x$-axis, left 6', 'Horizontal stretch by $\\frac{1}{2}$, reflection in the $y$-axis, left 6'], answer: 0, why: '$a = \\frac{1}{2}$ is vertical. $b = -1$ flips in the $y$-axis. $h = -6$ is left 6.' },
    },
  ],

  'RF4.factor-b': [
    {
      say: 'You can only read $h$ when the bracket looks like $b(x - h)$. Inside the small bracket, $x$ must stand **alone**, with no number multiplying it.',
      example: ['$y = f(3(x - 2))$', '$x$ is alone in $(x - 2)$.', 'So $b = 3$ and $h = 2$: right 2.'],
      check: { q: 'In $y = f(4(x + 1))$, what is $h$?', options: ['$-1$', '$1$', '$4$', '$-4$'], answer: 0, why: '$x + 1 = 0$ when $x = -1$, so $h = -1$ (left 1).' },
    },
    {
      say: 'If $x$ is not alone, **factor out** $b$ first. Divide each term in the bracket by $b$. Reading $h$ before factoring is the most common mistake.',
      example: ['$y = f(2x - 6)$', 'Divide each term by 2: $2x \\div 2 = x$ and $6 \\div 2 = 3$.', '$f(2(x - 3))$', 'So $h = 3$, not $6$.'],
      check: { q: 'For $y = f(3x + 12)$, what are $b$ and $h$?', options: ['$b = 3$, $h = -4$', '$b = 3$, $h = -12$', '$b = 3$, $h = 4$', '$b = 3$, $h = 12$'], answer: 0, why: '$3x + 12 = 3(x + 4)$, so $h = -4$ (left 4).' },
    },
    {
      say: 'If the $x$ term is negative, factor out the **negative** number. Every sign inside the bracket flips.',
      example: ['$y = f(-x + 4)$', 'Factor out $-1$: $-(x - 4)$.', 'Check: $-(x - 4) = -x + 4$.', 'So $b = -1$ and $h = 4$.'],
      check: { q: 'For $y = f(-2x + 6)$, what are $b$ and $h$?', options: ['$b = -2$, $h = 3$', '$b = -2$, $h = -3$', '$b = 2$, $h = 3$', '$b = -2$, $h = 6$'], answer: 0, why: '$-2x + 6 = -2(x - 3)$, so $b = -2$ and $h = 3$.' },
    },
    {
      say: 'Once it is factored, map points with the usual rule $(x, y) \\to \\left(\\frac{x}{b} + h,\\ ay + k\\right)$.',
      example: ['$(4, 5)$ on $y = f(2x - 6) + 1$.', 'Factor: $f(2(x - 3)) + 1$, so $b = 2$, $h = 3$.', 'New $x$: $4 \\div 2 + 3 = 5$.', 'New $y$: $5 + 1 = 6$.', 'New point: $(5, 6)$.'],
      check: { q: '$(6, 2)$ is on $y = f(x)$. Which point is on $y = f(3x + 3)$?', options: ['$(1, 2)$', '$(-1, 2)$', '$(17, 2)$', '$(3, 2)$'], answer: 0, why: '$3x + 3 = 3(x + 1)$, so $b = 3$ and $h = -1$. Then $6 \\div 3 - 1 = 1$.' },
    },
    {
      say: 'For a square root, the **radicand** (the part under the root) cannot be negative. Set it $\\ge 0$ and solve to get the domain.',
      example: ['$y = \\sqrt{2x - 6}$', '$2x - 6 \\ge 0$', '$2x \\ge 6$', '$x \\ge 3$'],
      check: { q: 'What is the domain of $y = \\sqrt{3x + 12}$?', options: ['$x \\ge -4$', '$x \\ge 4$', '$x \\ge -12$', '$x \\le -4$'], answer: 0, why: '$3x + 12 \\ge 0$ gives $3x \\ge -12$, so $x \\ge -4$.' },
    },
    {
      say: 'If you divide by a **negative** number, flip the inequality sign. Then the domain points left, and the graph runs to the left.',
      example: ['$y = \\sqrt{-2x + 8}$', '$-2x + 8 \\ge 0$', '$-2x \\ge -8$', 'Divide by $-2$ and flip: $x \\le 4$.'],
      check: { q: 'What is the domain of $y = \\sqrt{-3x + 9}$?', options: ['$x \\le 3$', '$x \\ge 3$', '$x \\le -3$', '$x \\ge -3$'], answer: 0, why: '$-3x \\ge -9$. Dividing by $-3$ flips the sign: $x \\le 3$.' },
    },
    {
      say: 'For the range of $y = a\\sqrt{\\ldots} + k$: a root is never negative, so the graph starts at $y = k$. It goes up if $a > 0$ and down if $a < 0$.',
      example: ['$y = -2\\sqrt{x - 1} + 5$', 'Starts at $y = 5$.', '$a = -2$ is negative, so it goes down.', 'Range: $y \\le 5$.'],
      check: { q: 'What are the domain and range of $y = 3\\sqrt{-x + 2} - 4$?', options: ['Domain $x \\le 2$, range $y \\ge -4$', 'Domain $x \\ge 2$, range $y \\ge -4$', 'Domain $x \\le 2$, range $y \\le -4$', 'Domain $x \\ge -2$, range $y \\ge 4$'], answer: 0, why: '$-x + 2 \\ge 0$ gives $x \\le 2$. $a = 3$ is positive, so $y$ goes up from $-4$.' },
    },
  ],

  'RF4.equation-from-graph': [
    {
      say: 'Start with the **anchor point**: the vertex of $x^2$ or $|x|$, the endpoint of $\\sqrt{x}$, or the centre of $x^3$. It began at $(0, 0)$, so wherever it is now gives you $(h, k)$.',
      example: ['A parabola has its vertex at $(-2, 5)$.', 'The vertex started at $(0, 0)$.', 'So $h = -2$ and $k = 5$.'],
      check: { q: 'A transformed $y = \\sqrt{x}$ has its endpoint at $(3, -1)$. What are $h$ and $k$?', options: ['$h = 3$, $k = -1$', '$h = -3$, $k = 1$', '$h = -1$, $k = 3$', '$h = 3$, $k = 1$'], answer: 0, why: 'The endpoint $(0, 0)$ moved to $(h, k) = (3, -1)$.' },
    },
    {
      say: 'To find $a$, step **one unit right** of the anchor. On the base graph you would rise $1$. On the new graph you rise $a$. A drop means $a$ is negative.',
      example: ['Vertex $(1, 3)$. The graph passes $(2, 1)$.', 'One unit right, $y$ goes from $3$ to $1$.', 'That is a drop of $2$.', 'So $a = -2$.'],
      check: { q: 'A parabola has vertex $(-1, 2)$ and passes through $(0, 5)$. What is $a$?', options: ['$3$', '$5$', '$-3$', '$2$'], answer: 0, why: 'One unit right, $y$ goes from $2$ to $5$: a rise of $3$, so $a = 3$.' },
    },
    {
      say: 'You can use a point further away. Divide the **new rise** by the **base rise**. Two units right, $x^2$ rises $4$ and $|x|$ rises $2$.',
      example: ['Parabola: vertex $(0, 1)$, passes $(2, 3)$.', 'New rise: $3 - 1 = 2$.', 'Base rise for $x^2$, two right: $2^2 = 4$.', '$a = \\frac{2}{4} = \\frac{1}{2}$'],
      check: { q: 'A transformed $y = |x|$ has vertex $(1, 0)$ and passes through $(3, -6)$. What is $a$?', options: ['$-3$', '$-6$', '$3$', '$-\\frac{1}{3}$'], answer: 0, why: 'The new graph drops $6$. Two right, $|x|$ rises $2$. So $a = \\frac{-6}{2} = -3$.' },
    },
    {
      say: 'If a square root graph runs **left** from its endpoint, it was reflected in the $y$-axis, so $b = -1$. Step one unit **left** to find $a$.',
      example: ['Endpoint $(4, 2)$. The graph runs left through $(3, 3)$.', 'Runs left, so $b = -1$.', 'One left, it rises $1$, so $a = 1$.', '$y = \\sqrt{-(x - 4)} + 2$'],
      check: { q: 'A square root graph has endpoint $(-1, 0)$ and runs left through $(-2, -2)$. Which is its equation?', options: ['$y = -2\\sqrt{-(x + 1)}$', '$y = -2\\sqrt{x + 1}$', '$y = 2\\sqrt{-(x + 1)}$', '$y = -2\\sqrt{-(x - 1)}$'], answer: 0, why: 'Runs left: $b = -1$. One left it drops $2$: $a = -2$. Endpoint gives $h = -1$, $k = 0$.' },
    },
    {
      say: 'Put the pieces into $y = af(b(x - h)) + k$. Then **check one more point** on the graph to be sure.',
      example: ['Vertex $(1, 3)$ and $a = -2$.', '$y = -2(x - 1)^2 + 3$', 'Check $x = 0$: $-2(0 - 1)^2 + 3 = -2 + 3 = 1$.', 'The graph should pass $(0, 1)$.'],
      check: { q: 'A parabola has vertex $(-2, -4)$ and $a = \\frac{1}{2}$. Which is its equation?', options: ['$y = \\frac{1}{2}(x + 2)^2 - 4$', '$y = \\frac{1}{2}(x - 2)^2 - 4$', '$y = \\frac{1}{2}(x + 2)^2 + 4$', '$y = 2(x + 2)^2 - 4$'], answer: 0, why: '$h = -2$ gives $(x + 2)$ and $k = -4$ gives $-4$.' },
    },
    {
      say: 'For $x^2$, $|x|$ and $\\sqrt{x}$, a horizontal stretch can be rewritten as a vertical one. So more than one equation can be correct. Any equivalent equation is accepted.',
      example: ['$y = (2x)^2 = 4x^2$', 'So $y = (2x)^2$ and $y = 4x^2$ are the same graph.'],
      check: { q: 'Which equation gives the same graph as $y = |3x|$?', options: ['$y = 3|x|$', '$y = 9|x|$', '$y = \\frac{1}{3}|x|$', '$y = |x| + 3$'], answer: 0, why: '$|3x| = |3| \\cdot |x| = 3|x|$.' },
    },
    {
      say: 'From a description in words, turn each phrase into one letter. Remember: horizontal stretch by a factor of $s$ means $b = \\frac{1}{s}$. Right and up are positive.',
      example: ['Horizontal stretch by $2$, right $3$.', '$b = \\frac{1}{2}$ and $h = 3$.', '$y = f\\left(\\frac{1}{2}(x - 3)\\right)$'],
      check: { q: 'Vertical stretch by $3$, reflection in the $x$-axis, left $4$, up $2$. Which is the equation?', options: ['$y = -3f(x + 4) + 2$', '$y = -3f(x - 4) + 2$', '$y = 3f(-(x + 4)) + 2$', '$y = -3f(x + 4) - 2$'], answer: 0, why: '$a = -3$, left 4 means $h = -4$ so $(x + 4)$, and up 2 means $+2$.' },
    },
    {
      say: 'For $y = af(x) + k$, each mapped point gives an equation: new $y = a(\\text{old } y) + k$. Subtract the two equations to get rid of $k$.',
      example: ['$(1, 2) \\to (1, 7)$ and $(3, 5) \\to (3, 13)$.', '$7 = 2a + k$ and $13 = 5a + k$.', 'Subtract: $6 = 3a$, so $a = 2$.', '$k = 7 - 2(2) = 3$'],
      check: { q: 'Under $y = af(x) + k$, $(0, 1) \\to (0, 4)$ and $(2, 3) \\to (2, 10)$. Find $a$ and $k$.', options: ['$a = 3$, $k = 1$', '$a = 1$, $k = 3$', '$a = 3$, $k = 4$', '$a = 2$, $k = 2$'], answer: 0, why: '$4 = a + k$ and $10 = 3a + k$. Subtract: $6 = 2a$, so $a = 3$ and $k = 1$.' },
    },
  ],

  'RF4.domain-range-image': [
    {
      say: 'Domain ends follow the $x$ part of the rule: $x \\to \\frac{x}{b} + h$. Range ends follow the $y$ part: $y \\to ay + k$.',
      example: ['Domain $[-2, 4]$, with $b = 2$ and $h = 1$.', '$-2 \\div 2 + 1 = 0$', '$4 \\div 2 + 1 = 3$', 'New domain: $[0, 3]$.'],
      check: { q: 'The range is $[1, 5]$, with $a = 3$ and $k = -2$. What is the new range?', options: ['$[1, 13]$', '$[-3, 9]$', '$[3, 15]$', '$[-1, 3]$'], answer: 0, why: '$3(1) - 2 = 1$ and $3(5) - 2 = 13$.' },
    },
    {
      say: 'After mapping, always write the **smaller** number first. A negative $a$ or $b$ swaps which end is smaller.',
      example: ['Range $[-1, 4]$, with $a = -2$ and $k = 1$.', '$-2(-1) + 1 = 3$', '$-2(4) + 1 = -7$', 'Smaller first: $[-7, 3]$.'],
      check: { q: 'The domain is $[2, 6]$, with $b = -2$ and $h = 0$. What is the new domain?', options: ['$[-3, -1]$', '$[-1, -3]$', '$[-12, -4]$', '$[1, 3]$'], answer: 0, why: '$2 \\div (-2) = -1$ and $6 \\div (-2) = -3$. Smaller first: $[-3, -1]$.' },
    },
    {
      say: 'In **interval notation**, a square bracket $[\\ ]$ means the end is included. A round bracket $(\\ )$ means it is not. Always use a round bracket next to $\\infty$.',
      example: ['$y \\ge 4$ is $[4, \\infty)$.', '$x < 2$ is $(-\\infty, 2)$.'],
      check: { q: 'How do you write $y \\le -1$ in interval notation?', options: ['$(-\\infty, -1]$', '$(-\\infty, -1)$', '$[-\\infty, -1]$', '$[-1, \\infty)$'], answer: 0, why: '$-1$ is included, so use $]$. Infinity always gets a round bracket.' },
    },
    {
      say: 'For $y = a\\sqrt{x - h} + k$, the endpoint moves from $(0, 0)$ to $(h, k)$. The domain starts at $h$. The range starts at $k$ and goes up if $a > 0$, down if $a < 0$.',
      example: ['$y = -\\sqrt{x - 2} + 4$', 'Endpoint $(2, 4)$.', 'Domain: $[2, \\infty)$.', '$a < 0$, so range: $(-\\infty, 4]$.'],
      check: { q: 'What are the domain and range of $y = -\\sqrt{x + 3} - 1$?', options: ['Domain $[-3, \\infty)$, range $(-\\infty, -1]$', 'Domain $[3, \\infty)$, range $(-\\infty, -1]$', 'Domain $[-3, \\infty)$, range $[-1, \\infty)$', 'Domain $(-\\infty, -3]$, range $(-\\infty, -1]$'], answer: 0, why: 'The endpoint is $(-3, -1)$. The negative $a$ makes it go down from $-1$.' },
    },
    {
      say: 'If the square root has a negative $b$, the graph runs **left** from the endpoint. Then the domain is $(-\\infty, h]$.',
      example: ['$y = \\sqrt{-(x - 5)} + 2$', 'Endpoint $(5, 2)$, running left.', 'Domain: $(-\\infty, 5]$.', 'Range: $[2, \\infty)$.'],
      check: { q: 'What are the domain and range of $y = 2\\sqrt{-(x + 1)} + 3$?', options: ['Domain $(-\\infty, -1]$, range $[3, \\infty)$', 'Domain $[-1, \\infty)$, range $[3, \\infty)$', 'Domain $(-\\infty, 1]$, range $[3, \\infty)$', 'Domain $(-\\infty, -1]$, range $(-\\infty, 3]$'], answer: 0, why: 'Endpoint $(-1, 3)$. $b = -1$ runs left. $a = 2 > 0$ goes up.' },
    },
    {
      say: 'For $x^2$ and $|x|$, the domain is all real numbers. The range starts at $k$: $[k, \\infty)$ if $a > 0$, or $(-\\infty, k]$ if $a < 0$.',
      example: ['$y = -3(x - 1)^2 + 6$', 'Domain: all real numbers.', 'Vertex height $k = 6$, and $a < 0$.', 'Range: $(-\\infty, 6]$.'],
      check: { q: 'What is the range of $y = 2|x + 4| - 5$?', options: ['$[-5, \\infty)$', '$(-\\infty, -5]$', '$[-4, \\infty)$', '$[5, \\infty)$'], answer: 0, why: '$k = -5$ and $a = 2 > 0$, so the graph goes up from $-5$.' },
    },
    {
      say: 'A **zero** (an $x$-intercept) has $y = 0$, so $a$ does not move it. When $k = 0$, each zero $r$ moves to $\\frac{r}{b} + h$.',
      example: ['Zeros of $f$: $-2$ and $6$. Graph $y = 3f(2(x - 1))$.', '$-2 \\div 2 + 1 = 0$', '$6 \\div 2 + 1 = 4$', 'New zeros: $0$ and $4$.'],
      check: { q: 'The zeros of $y = f(x)$ are $-3$ and $6$. What are the zeros of $y = f\\left(\\frac{1}{3}(x + 2)\\right)$?', options: ['$-11$ and $16$', '$-3$ and $0$', '$-9$ and $18$', '$-7$ and $20$'], answer: 0, why: 'Dividing by $\\frac{1}{3}$ multiplies by 3: $-9$ and $18$. Then add $h = -2$: $-11$ and $16$.' },
    },
  ],

  'RF5.reflect-yx': [
    {
      say: 'Reflecting in the line $y = x$ **swaps** the coordinates: $(x, y) \\to (y, x)$.',
      example: ['Point $(1, 2)$ on $y = 2^x$.', 'Swap: $(2, 1)$.'],
      check: { q: '$(-3, 5)$ is on $y = f(x)$. Which point is on its reflection in $y = x$?', options: ['$(5, -3)$', '$(3, -5)$', '$(-5, 3)$', '$(-3, -5)$'], answer: 0, why: 'Swap the two numbers. Keep each sign with its number.' },
    },
    {
      say: 'The reflected graph is the **inverse** of the original. To get its equation, swap $x$ and $y$: $x = f(y)$. On the diploma, this reflection is never mixed with other transformations.',
      example: ['$y = 2^x$', 'Swap $x$ and $y$.', 'Inverse: $x = 2^y$.'],
      check: { q: 'What is the equation of the reflection of $y = x^2 + 1$ in the line $y = x$?', options: ['$x = y^2 + 1$', '$y = -x^2 - 1$', '$y = x^2 - 1$', '$x = y^2 - 1$'], answer: 0, why: 'Swap $x$ and $y$ in the equation and change nothing else.' },
    },
    {
      say: 'Because $x$ and $y$ swap, the **domain** and **range** swap too.',
      example: ['$f$: domain $[-2, 3]$, range $[0, 5]$.', 'Inverse: domain $[0, 5]$, range $[-2, 3]$.'],
      check: { q: '$f$ has domain $[1, 4]$ and range $[-6, 2]$. What is the domain of its inverse?', options: ['$[-6, 2]$', '$[1, 4]$', '$[-4, -1]$', '$[-2, 6]$'], answer: 0, why: 'The domain of the inverse is the range of $f$.' },
    },
    {
      say: 'A point stays put when swapping does nothing, which happens when $x$ and $y$ are equal. So the **invariant points** are where the graph meets the line $y = x$.',
      example: ['$(2, 2)$ swaps to $(2, 2)$: no change.', '$(2, 3)$ swaps to $(3, 2)$: it moved.'],
      check: { q: 'Which point does not move when reflected in $y = x$?', options: ['$(-4, -4)$', '$(4, -4)$', '$(0, 4)$', '$(4, 0)$'], answer: 0, why: 'Its two coordinates are equal, so swapping changes nothing.' },
    },
    {
      say: 'To find the invariant points, solve $f(x) = x$. Each answer $x$ gives the point $(x, x)$.',
      example: ['$f(x) = 3x - 4$', '$3x - 4 = x$', '$2x = 4$, so $x = 2$.', 'Invariant point: $(2, 2)$.'],
      check: { q: 'What is the invariant point when $f(x) = -x + 6$ is reflected in $y = x$?', options: ['$(3, 3)$', '$(6, 6)$', '$(-3, -3)$', '$(0, 6)$'], answer: 0, why: '$-x + 6 = x$ gives $6 = 2x$, so $x = 3$.' },
    },
    {
      say: 'For a quadratic, $f(x) = x$ gives a quadratic equation. Move everything to one side, factor, and you can get **two** invariant points.',
      example: ['$f(x) = x^2 - 2$', '$x^2 - 2 = x$', '$x^2 - x - 2 = 0$', '$(x - 2)(x + 1) = 0$', '$x = 2$ or $x = -1$', 'Points: $(2, 2)$ and $(-1, -1)$.'],
      check: { q: 'What are the invariant points when $f(x) = x^2 - 6$ is reflected in $y = x$?', options: ['$(3, 3)$ and $(-2, -2)$', '$(-3, -3)$ and $(2, 2)$', '$(3, 0)$ and $(-2, 0)$', '$(0, -6)$ only'], answer: 0, why: '$x^2 - x - 6 = 0$ factors as $(x - 3)(x + 2) = 0$, so $x = 3$ or $x = -2$.' },
    },
  ],

  'RF6.inverse-alg': [
    {
      say: 'The **inverse** undoes what $f$ does. To find it: write $y = f(x)$, **swap** $x$ and $y$, then **solve for $y$**.',
      example: ['$f(x) = x + 2$', 'Write $y = x + 2$.', 'Swap: $x = y + 2$.', 'Solve: $y = x - 2$.'],
      check: { q: 'You have written $y = 5x - 1$. What is the next step to find the inverse?', options: ['Swap $x$ and $y$', 'Solve for $x$', 'Write $\\frac{1}{5x - 1}$', 'Change every sign'], answer: 0, why: 'After writing $y = f(x)$, swap $x$ and $y$. Then solve for $y$.' },
    },
    {
      say: 'To solve for $y$, undo the steps in **reverse order**. If $f$ multiplies and then adds, you subtract first, then divide.',
      example: ['$y = 3x - 6$', 'Swap: $x = 3y - 6$.', 'Add 6: $x + 6 = 3y$.', 'Divide by 3: $y = \\frac{x + 6}{3}$.'],
      check: { q: 'What is the inverse of $f(x) = 2x + 8$?', options: ['$f^{-1}(x) = \\frac{x - 8}{2}$', '$f^{-1}(x) = \\frac{x + 8}{2}$', '$f^{-1}(x) = \\frac{x}{2} + 8$', '$f^{-1}(x) = \\frac{1}{2x + 8}$'], answer: 0, why: 'Swap: $x = 2y + 8$. Subtract 8, then divide by 2.' },
    },
    {
      say: '$f^{-1}(x)$ is **not** $\\frac{1}{f(x)}$. The $-1$ is a label meaning "inverse". It is not a power.',
      example: ['$f(x) = x + 2$', '$f^{-1}(x) = x - 2$', 'Not $\\frac{1}{x + 2}$.'],
      check: { q: '$f(x) = x + 5$. What is $f^{-1}(x)$?', options: ['$x - 5$', '$\\frac{1}{x + 5}$', '$-x - 5$', '$x + 5$'], answer: 0, why: 'The inverse undoes adding 5, so it subtracts 5.' },
    },
    {
      say: '$f^{-1}(7)$ asks: which **input** gives $f$ an output of $7$? Set $f(x) = 7$ and solve.',
      example: ['$f(x) = 2x + 1$. Find $f^{-1}(7)$.', '$2x + 1 = 7$', '$2x = 6$', '$x = 3$, so $f^{-1}(7) = 3$.'],
      check: { q: '$f(x) = 3x - 2$. What is $f^{-1}(10)$?', options: ['$4$', '$28$', '$\\frac{8}{3}$', '$\\frac{1}{28}$'], answer: 0, why: '$3x - 2 = 10$ gives $3x = 12$, so $x = 4$.' },
    },
    {
      say: 'For a quadratic, swap, then undo in reverse: subtract $k$, divide by $a$, take the square root, add $h$.',
      example: ['$y = 2(x - 1)^2 + 3$', 'Swap: $x = 2(y - 1)^2 + 3$.', 'Subtract 3, divide by 2: $(y - 1)^2 = \\frac{x - 3}{2}$.', 'Square root: $y - 1 = \\pm\\sqrt{\\frac{x - 3}{2}}$.', 'Add 1: $y = 1 \\pm \\sqrt{\\frac{x - 3}{2}}$.'],
      check: { q: 'What is the inverse of $y = (x + 4)^2 - 1$?', options: ['$y = -4 \\pm \\sqrt{x + 1}$', '$y = 4 \\pm \\sqrt{x + 1}$', '$y = -4 \\pm \\sqrt{x - 1}$', '$y = -4 + \\sqrt{x - 1}$'], answer: 0, why: 'Swap: $x = (y + 4)^2 - 1$. Add 1, square root with $\\pm$, then subtract 4.' },
    },
    {
      say: 'When you take a square root to solve, you need the $\\pm$ sign. Both $3^2$ and $(-3)^2$ equal $9$. Leaving out the $\\pm$ loses half the inverse.',
      example: ['$(y - 2)^2 = 9$', '$y - 2 = \\pm 3$', '$y = 5$ or $y = -1$'],
      check: { q: 'If $(y - 2)^2 = 16$, then $y - 2$ equals…', options: ['$\\pm 4$', '$4$ only', '$\\pm 8$', '$\\pm 16$'], answer: 0, why: 'Both $4^2$ and $(-4)^2$ are $16$.' },
    },
    {
      say: 'If $a$ is negative, you divide by a negative number. Keep that negative inside the square root.',
      example: ['$y = -(x - 3)^2 + 2$', 'Swap: $x = -(y - 3)^2 + 2$.', 'Subtract 2: $x - 2 = -(y - 3)^2$.', 'Divide by $-1$: $(y - 3)^2 = -(x - 2)$.', '$y = 3 \\pm \\sqrt{-(x - 2)}$'],
      check: { q: 'What is the inverse of $y = -(x - 1)^2 + 5$?', options: ['$y = 1 \\pm \\sqrt{-(x - 5)}$', '$y = 1 \\pm \\sqrt{x - 5}$', '$y = -1 \\pm \\sqrt{-(x - 5)}$', '$y = 1 \\pm \\sqrt{-(x + 5)}$'], answer: 0, why: '$(y - 1)^2 = -(x - 5)$ after subtracting 5 and dividing by $-1$. Then root and add 1.' },
    },
    {
      say: 'Write $f^{-1}(x)$ **only** when the inverse is a function. The inverse of a parabola fails the vertical line test, so write it as $y = \\ldots$ instead.',
      example: ['$f(x) = 3x - 6$: inverse is a function.', 'Write $f^{-1}(x) = \\frac{x + 6}{3}$.', '$y = x^2$: inverse is not a function.', 'Write $y = \\pm\\sqrt{x}$.'],
      check: { q: 'How should you write the inverse of $y = (x - 1)^2$?', options: ['$y = 1 \\pm \\sqrt{x}$', '$f^{-1}(x) = 1 \\pm \\sqrt{x}$', '$y = \\frac{1}{(x - 1)^2}$', '$y = -1 \\pm \\sqrt{x}$'], answer: 0, why: 'The $\\pm$ gives two outputs, so it is not a function. Use $y =$, not $f^{-1}(x) =$.' },
    },
  ],

  'RF6.restrict': [
    {
      say: 'A parabola fails the **horizontal line test**: some horizontal lines cross it twice. So when you swap $x$ and $y$, the inverse is not a function.',
      example: ['$y = x^2$ has $(2, 4)$ and $(-2, 4)$.', 'Two inputs give the same output $4$.', 'The inverse would send $4$ to both $2$ and $-2$.'],
      check: { q: 'Why is the inverse of $y = x^2$ not a function?', options: ['Two different $x$-values give the same $y$-value', 'A parabola has no inverse', 'It has a vertex', 'Its range is all real numbers'], answer: 0, why: 'For example, $2$ and $-2$ both give $4$, so the inverse would give two outputs.' },
    },
    {
      say: 'To fix it, cut the parabola at its **vertex** and keep one half. Restrict to $x \\ge h$ or to $x \\le h$.',
      example: ['$y = (x - 2)^2 - 1$', 'Vertex: $(2, -1)$, so $h = 2$.', 'Keep $x \\ge 2$ or keep $x \\le 2$.'],
      check: { q: 'Which restriction makes the inverse of $y = (x + 3)^2 + 5$ a function?', options: ['$x \\ge -3$', '$x \\ge 3$', '$x \\ge 5$', '$y \\ge 5$'], answer: 0, why: 'The vertex is $(-3, 5)$, so cut at $x = -3$.' },
    },
    {
      say: 'Two common slips: use the vertex **$x$-coordinate** $h$, not $k$. And restrict $x$, not $y$.',
      example: ['$y = 2(x - 4)^2 - 6$', 'Vertex: $(4, -6)$.', 'Use $h = 4$: $x \\le 4$ or $x \\ge 4$.', 'Not $x \\le -6$, and not $y \\le -6$.'],
      check: { q: 'Which restriction on $f(x) = 2(x - 4)^2 - 6$ makes its inverse a function?', options: ['$x \\le 4$', '$x \\le -6$', '$y \\le -6$', '$x \\le -4$'], answer: 0, why: 'The vertex has $x$-coordinate $4$, and the restriction is on $x$.' },
    },
    {
      say: 'After you find the inverse with $\\pm$, keep one sign. If $x \\ge h$, the inverse must give outputs $\\ge h$, so keep $+$. If $x \\le h$, keep $-$.',
      example: ['$f(x) = (x - 2)^2 - 1$, with $x \\ge 2$.', 'Inverse: $y = 2 \\pm \\sqrt{x + 1}$.', 'Outputs must be $\\ge 2$, so keep $+$.', '$f^{-1}(x) = 2 + \\sqrt{x + 1}$'],
      check: { q: '$f(x) = (x + 1)^2 + 3$ with $x \\le -1$. What is $f^{-1}(x)$?', options: ['$-1 - \\sqrt{x - 3}$', '$-1 + \\sqrt{x - 3}$', '$1 - \\sqrt{x - 3}$', '$-1 - \\sqrt{x + 3}$'], answer: 0, why: 'With $x \\le -1$, the inverse must give values $\\le -1$, so keep the minus sign.' },
    },
    {
      say: 'Domain and range swap. The **domain** of $f^{-1}$ is the range of the restricted $f$. The **range** of $f^{-1}$ is the restricted domain.',
      example: ['$f(x) = (x - 2)^2 - 1$, with $x \\ge 2$.', 'Opens up from $y = -1$, so $f$ has range $y \\ge -1$.', '$f^{-1}$: domain $x \\ge -1$.', '$f^{-1}$: range $y \\ge 2$.'],
      check: { q: '$f(x) = -(x - 3)^2 + 4$ with $x \\ge 3$. What are the domain and range of $f^{-1}$?', options: ['Domain $x \\le 4$, range $y \\ge 3$', 'Domain $x \\ge 3$, range $y \\le 4$', 'Domain $x \\ge 4$, range $y \\ge 3$', 'Domain $x \\le 4$, range $y \\le 3$'], answer: 0, why: '$f$ opens down from $4$, so its range is $y \\le 4$. Swap: domain $x \\le 4$, range $y \\ge 3$.' },
    },
    {
      say: 'Now the whole job: find the inverse, then pick the sign from the restriction.',
      example: ['$f(x) = 2(x - 1)^2 + 3$, with $x \\le 1$.', 'Swap: $x = 2(y - 1)^2 + 3$.', '$(y - 1)^2 = \\frac{x - 3}{2}$', '$y = 1 \\pm \\sqrt{\\frac{x - 3}{2}}$', 'Outputs must be $\\le 1$: $f^{-1}(x) = 1 - \\sqrt{\\frac{x - 3}{2}}$'],
      check: { q: 'For that $f$ (opens up from $y = 3$, with $x \\le 1$), what is the domain of $f^{-1}$?', options: ['$x \\ge 3$', '$x \\le 1$', '$x \\ge 1$', '$x \\le 3$'], answer: 0, why: '$f$ has range $y \\ge 3$, and that becomes the domain of $f^{-1}$.' },
    },
  ],

  'RF6.params': [
    {
      say: 'A point $(p, q)$ on the inverse means $(q, p)$ is on $f$. Swap the numbers. Then $f(q) = p$.',
      example: ['$(7, 2)$ is on $f^{-1}$.', 'Swap: $(2, 7)$ is on $f$.', 'So $f(2) = 7$.'],
      check: { q: '$f^{-1}(5) = -1$. Which must be true?', options: ['$f(-1) = 5$', '$f(5) = -1$', '$f(-1) = \\frac{1}{5}$', '$f(-5) = 1$'], answer: 0, why: '$f^{-1}(5) = -1$ means the point $(5, -1)$ is on $f^{-1}$, so $(-1, 5)$ is on $f$.' },
    },
    {
      say: 'Turn that fact into an equation with the unknown letter in it. Then solve for the letter.',
      example: ['$f(x) = ax + 3$ and $f^{-1}(11) = 2$.', 'So $f(2) = 11$.', '$2a + 3 = 11$', '$2a = 8$, so $a = 4$.'],
      check: { q: '$f(x) = ax - 5$ and $f^{-1}(7) = 3$. What is $a$?', options: ['$4$', '$\\frac{8}{7}$', '$\\frac{2}{3}$', '$12$'], answer: 0, why: '$f(3) = 7$, so $3a - 5 = 7$, $3a = 12$, $a = 4$.' },
    },
    {
      say: 'Watch the signs when the numbers are negative. Put negative numbers in brackets when you substitute. Then check by putting your answer back in.',
      example: ['$f(x) = ax + 6$ and $f^{-1}(-4) = -2$.', 'So $f(-2) = -4$.', '$a(-2) + 6 = -4$', '$-2a = -10$, so $a = 5$.', 'Check: $5(-2) + 6 = -4$. Yes.'],
      check: { q: '$f(x) = ax - 2$ and $f^{-1}(4) = -3$. What is $a$?', options: ['$-2$', '$2$', '$-\\frac{2}{3}$', '$6$'], answer: 0, why: '$f(-3) = 4$, so $-3a - 2 = 4$, $-3a = 6$, $a = -2$.' },
    },
    {
      say: 'Two unknowns need two points. Swap **both** points to get points on $f$. For a line $f(x) = ax + b$, find the slope $a$, then the intercept $b$.',
      example: ['Inverse passes $(5, 1)$ and $(11, 3)$.', '$f$ passes $(1, 5)$ and $(3, 11)$.', 'Slope: $a = \\frac{11 - 5}{3 - 1} = 3$.', '$5 = 3(1) + b$, so $b = 2$.'],
      check: { q: 'The inverse of $f(x) = ax + b$ passes through $(1, 0)$ and $(7, 2)$. Find $a$ and $b$.', options: ['$a = 3$, $b = 1$', '$a = \\frac{1}{3}$, $b = -\\frac{1}{3}$', '$a = 3$, $b = 0$', '$a = 2$, $b = 1$'], answer: 0, why: '$f$ passes $(0, 1)$ and $(2, 7)$. Slope $\\frac{6}{2} = 3$, and $b = 1$ from $(0, 1)$.' },
    },
    {
      say: 'The same idea works for other functions. Swap the point, substitute it into $f$, and solve.',
      example: ['$f(x) = ax^2 - 4$, $x \\ge 0$. $f^{-1}$ passes $(14, 3)$.', 'So $f(3) = 14$.', '$a(3)^2 - 4 = 14$', '$9a = 18$, so $a = 2$.'],
      check: { q: '$f(x) = ax^2 + 1$, $x \\ge 0$. $f^{-1}$ passes through $(-7, 2)$. What is $a$?', options: ['$-2$', '$\\frac{1}{49}$', '$-4$', '$2$'], answer: 0, why: '$f(2) = -7$, so $4a + 1 = -7$, $4a = -8$, $a = -2$.' },
    },
  ],

  'RF1.ops-eval': [
    {
      say: 'You can add two functions: $(f + g)(x) = f(x) + g(x)$. To find $(f + g)(a)$, find $f(a)$ and $g(a)$ first, then add the two **outputs**.',
      example: ['$f(1) = 4$ and $g(1) = 6$.', '$(f + g)(1) = 4 + 6 = 10$'],
      check: { q: '$f(3) = -2$ and $g(3) = 7$. What is $(f + g)(3)$?', options: ['$5$', '$-9$', '$8$', '$-14$'], answer: 0, why: 'Add the outputs: $-2 + 7 = 5$.' },
    },
    {
      say: 'Subtract, multiply and divide work the same way. Find both outputs at the same input, then combine them.',
      example: ['$f(4) = 10$ and $g(4) = 2$.', '$(f - g)(4) = 10 - 2 = 8$', '$(f \\cdot g)(4) = 10 \\times 2 = 20$', '$\\left(\\frac{f}{g}\\right)(4) = \\frac{10}{2} = 5$'],
      check: { q: '$f(0) = 6$ and $g(0) = -3$. What is $\\left(\\frac{f}{g}\\right)(0)$?', options: ['$-2$', '$-\\frac{1}{2}$', '$3$', '$-18$'], answer: 0, why: '$\\frac{6}{-3} = -2$.' },
    },
    {
      say: 'Order matters for subtracting and dividing. $(g - f)(x)$ is not the same as $(f - g)(x)$.',
      example: ['$f(2) = 9$ and $g(2) = 4$.', '$(f - g)(2) = 9 - 4 = 5$', '$(g - f)(2) = 4 - 9 = -5$'],
      check: { q: '$f(1) = 3$ and $g(1) = 8$. What is $(g - f)(1)$?', options: ['$5$', '$-5$', '$11$', '$24$'], answer: 0, why: '$g$ comes first: $8 - 3 = 5$.' },
    },
    {
      say: 'The input never changes. Put the same number into both functions. $(f + g)(2)$ is **not** $f(2) + g(2) + 2$.',
      example: ['$f(x) = x^2$ and $g(x) = 3x - 1$. Find $(f \\cdot g)(2)$.', '$f(2) = 2^2 = 4$', '$g(2) = 3(2) - 1 = 5$', '$(f \\cdot g)(2) = 4 \\times 5 = 20$'],
      check: { q: '$f(x) = 2x + 1$ and $g(x) = x^2 - 3$. What is $(f - g)(-1)$?', options: ['$1$', '$-3$', '$-1$', '$3$'], answer: 0, why: '$f(-1) = -1$ and $g(-1) = 1 - 3 = -2$. Then $-1 - (-2) = 1$.' },
    },
    {
      say: 'From a **table**, read the column for your input. Take the $f$ value and the $g$ value from that column, then combine.',
      example: ['$x$: $1$, $2$, $3$', '$f(x)$: $4$, $0$, $-2$', '$g(x)$: $1$, $5$, $3$', '$(f + g)(3) = -2 + 3 = 1$'],
      check: { q: 'Using that table, what is $(f \\cdot g)(1)$?', options: ['$4$', '$5$', '$1$', '$3$'], answer: 0, why: 'In the $x = 1$ column, $f(1) = 4$ and $g(1) = 1$. $4 \\times 1 = 4$.' },
    },
    {
      say: 'From **graphs**, go to your $x$-value and read the height ($y$-value) of each graph there. Combine the $y$-values, never the $x$-values.',
      example: ['$f$ passes $(2, 3)$ and $g$ passes $(2, -1)$.', '$f(2) = 3$ and $g(2) = -1$.', '$(f - g)(2) = 3 - (-1) = 4$'],
      check: { q: 'From the graphs, $f(-1) = 2$ and $g(-1) = -4$. What is $(f \\cdot g)(-1)$?', options: ['$-8$', '$-2$', '$8$', '$2$'], answer: 0, why: 'Multiply the two heights: $2 \\times (-4) = -8$.' },
    },
  ],

  'RF1.ops-equation': [
    {
      say: 'To write $f + g$ as one equation, add the two expressions and **combine like terms** (terms with the same power of $x$).',
      example: ['$f(x) = x^2 + 3x$ and $g(x) = 2x - 5$.', '$(f + g)(x) = x^2 + 3x + 2x - 5$', '$= x^2 + 5x - 5$'],
      check: { q: '$f(x) = 3x + 1$ and $g(x) = x^2 - x + 4$. What is $(f + g)(x)$?', options: ['$x^2 + 2x + 5$', '$x^2 + 4x + 5$', '$x^2 + 2x + 3$', '$4x^2 + 5$'], answer: 0, why: '$x^2$, then $3x - x = 2x$, then $1 + 4 = 5$.' },
    },
    {
      say: 'For $f - g$, put $g$ in **brackets**. The minus must reach every term of $g$.',
      example: ['$f(x) = x^2 + 3x$ and $g(x) = 2x - 5$.', '$x^2 + 3x - (2x - 5)$', '$= x^2 + 3x - 2x + 5$', '$= x^2 + x + 5$'],
      check: { q: '$f(x) = 4x + 1$ and $g(x) = x - 3$. What is $(f - g)(x)$?', options: ['$3x + 4$', '$3x - 2$', '$5x - 2$', '$3x - 4$'], answer: 0, why: '$4x + 1 - x + 3 = 3x + 4$. The minus turns $-3$ into $+3$.' },
    },
    {
      say: 'For $f \\cdot g$, multiply every term of $f$ by every term of $g$, then combine like terms.',
      example: ['$f(x) = x + 2$ and $g(x) = x - 3$.', '$(x + 2)(x - 3)$', '$= x^2 - 3x + 2x - 6$', '$= x^2 - x - 6$'],
      check: { q: '$f(x) = x - 4$ and $g(x) = x + 4$. What is $(f \\cdot g)(x)$?', options: ['$x^2 - 16$', '$x^2 + 16$', '$x^2 - 8x - 16$', '$2x$'], answer: 0, why: '$x^2 + 4x - 4x - 16 = x^2 - 16$.' },
    },
    {
      say: 'The **domain** of $f + g$, $f - g$ or $f \\cdot g$ is where **both** $f$ and $g$ work. It is the overlap of the two domains.',
      example: ['$f(x) = \\sqrt{x}$ works for $x \\ge 0$.', '$g(x) = x + 5$ works for all $x$.', 'Overlap: $x \\ge 0$, or $[0, \\infty)$.'],
      check: { q: '$f(x) = \\sqrt{x - 2}$ and $g(x) = \\sqrt{6 - x}$. What is the domain of $(f + g)(x)$?', options: ['$[2, 6]$', '$[2, \\infty)$', '$(-\\infty, 6]$', 'All real numbers'], answer: 0, why: '$f$ needs $x \\ge 2$ and $g$ needs $x \\le 6$. Both hold on $[2, 6]$.' },
    },
    {
      say: 'For $\\frac{f}{g}$, take the overlap, then also remove every $x$ that makes $g(x) = 0$. You cannot divide by zero. Factor $g$ to find those values.',
      example: ['$f(x) = x + 1$ and $g(x) = x^2 - 9$.', '$x^2 - 9 = (x - 3)(x + 3)$', '$g = 0$ when $x = 3$ or $x = -3$.', 'Domain: $x \\ne 3$, $x \\ne -3$.'],
      check: { q: '$f(x) = \\sqrt{x}$ and $g(x) = x - 5$. What is the domain of $\\frac{f}{g}$?', options: ['$[0, 5) \\cup (5, \\infty)$', '$[0, \\infty)$', '$(5, \\infty)$', 'All real numbers except $5$'], answer: 0, why: '$\\sqrt{x}$ needs $x \\ge 0$, and $g(5) = 0$, so remove $5$.' },
    },
    {
      say: 'Find the restrictions **before** you simplify. Cancelling a factor can hide a value that is not allowed, but that value is still not allowed.',
      example: ['$f(x) = x - 2$ and $g(x) = x^2 - 4$.', '$\\frac{x - 2}{(x - 2)(x + 2)} = \\frac{1}{x + 2}$', 'The simplified form hides $x = 2$.', 'Domain: $x \\ne 2$ and $x \\ne -2$.'],
      check: { q: '$f(x) = x + 1$ and $g(x) = x^2 + x$. Which values are not allowed in $\\frac{f}{g}$?', options: ['$x = 0$ and $x = -1$', '$x = 0$ only', '$x = -1$ only', 'None'], answer: 0, why: '$x^2 + x = x(x + 1)$ is zero at $0$ and $-1$, even though $x + 1$ cancels.' },
    },
    {
      say: 'Write domains in **interval notation**, like $(-\\infty, 3) \\cup (3, \\infty)$, or in **set-builder notation**, like $\\{x \\mid x \\ne 3, x \\in R\\}$. Both mean every real number except $3$.',
      example: ['All real numbers except $-2$:', '$(-\\infty, -2) \\cup (-2, \\infty)$', '$\\{x \\mid x \\ne -2, x \\in R\\}$'],
      check: { q: 'Which means "every real number except $4$"?', options: ['$(-\\infty, 4) \\cup (4, \\infty)$', '$(-\\infty, 4] \\cup [4, \\infty)$', '$(4, \\infty)$', '$\\{x \\mid x = 4\\}$'], answer: 0, why: 'Round brackets leave $4$ out of both pieces.' },
    },
  ],

  'RF1.ops-graph': [
    {
      say: 'To sketch $y = (f + g)(x)$ from two graphs, pick several $x$-values. At each one, add the heights of $f$ and $g$. Plot the sums and join them.',
      example: ['At $x = 0$: $f = 1$ and $g = 3$, so $(0, 4)$.', 'At $x = 2$: $f = 5$ and $g = -1$, so $(2, 4)$.', 'Plot these points and join them.'],
      check: { q: 'At $x = 1$, $f(1) = 2$ and $g(1) = -6$. Which point is on $y = (f + g)(x)$?', options: ['$(1, -4)$', '$(1, 8)$', '$(2, -4)$', '$(1, -12)$'], answer: 0, why: 'Keep $x = 1$ and add the heights: $2 + (-6) = -4$.' },
    },
    {
      say: 'Easy points to use: where $f$ crosses the $x$-axis, $f(x) = 0$. There the sum $f + g$ is just $g(x)$.',
      example: ['$f(3) = 0$ and $g(3) = 4$.', '$(f + g)(3) = 0 + 4 = 4$', 'So $(3, 4)$ is on the sum, right on the graph of $g$.'],
      check: { q: '$f(-2) = 0$ and $g(-2) = 5$. Which point is on $y = (f + g)(x)$?', options: ['$(-2, 5)$', '$(-2, 0)$', '$(5, -2)$', '$(0, 5)$'], answer: 0, why: '$0 + 5 = 5$, so the sum meets $g$ at $x = -2$.' },
    },
    {
      say: 'Where the graphs of $f$ and $g$ **cross**, they have the same height. So $f - g$ is zero there. That gives an $x$-intercept of $f - g$.',
      example: ['$f$ and $g$ cross at $(1, 4)$.', '$(f - g)(1) = 4 - 4 = 0$', 'So $f - g$ has a zero at $x = 1$.'],
      check: { q: '$f$ and $g$ cross at $(-3, 2)$. Where does $y = (f - g)(x)$ have a zero?', options: ['$x = -3$', '$x = 2$', '$x = 0$', '$x = -1$'], answer: 0, why: 'At $x = -3$ both heights are $2$, and $2 - 2 = 0$.' },
    },
    {
      say: 'If $f$ and $g$ are both lines, $f + g$ and $f - g$ are lines too. Add (or subtract) the slopes, and add (or subtract) the $y$-intercepts.',
      example: ['$f(x) = 2x + 1$ and $g(x) = -x + 4$.', '$f + g$: $(2 - 1)x + (1 + 4) = x + 5$', '$f - g$: $(2 + 1)x + (1 - 4) = 3x - 3$'],
      check: { q: '$f(x) = 3x - 2$ and $g(x) = x + 5$. What is $(f - g)(x)$?', options: ['$2x - 7$', '$2x + 3$', '$4x + 3$', '$2x - 3$'], answer: 0, why: 'Slopes: $3 - 1 = 2$. Intercepts: $-2 - 5 = -7$.' },
    },
    {
      say: 'A product is zero when **either** factor is zero. So $f \\cdot g$ has a zero at every zero of $f$ and every zero of $g$.',
      example: ['$f$ has a zero at $x = -1$.', '$g$ has a zero at $x = 4$.', '$f \\cdot g$ has zeros at $-1$ and $4$.'],
      check: { q: '$f$ has a zero at $2$. $g$ has zeros at $-3$ and $5$. What are the zeros of $y = (f \\cdot g)(x)$?', options: ['$-3$, $2$ and $5$', '$2$ only', '$-3$ and $5$ only', 'Where $f$ and $g$ cross'], answer: 0, why: 'If either factor is zero, the product is zero.' },
    },
    {
      say: 'The **sign** of $f \\cdot g$: positive (above the $x$-axis) where $f$ and $g$ have the same sign, negative (below) where their signs differ.',
      example: ['At $x = 0$: $f = 2$ and $g = -3$.', 'Different signs, so the product is negative.', '$(f \\cdot g)(0) = -6$, below the axis.'],
      check: { q: 'At $x = 5$, both $f$ and $g$ are below the $x$-axis. Where is $f \\cdot g$ at $x = 5$?', options: ['Above the $x$-axis', 'Below the $x$-axis', 'On the $x$-axis', 'You cannot tell'], answer: 0, why: 'A negative times a negative is positive.' },
    },
  ],

  'RF1.compose-eval': [
    {
      say: 'A **composition** feeds one function into another. $(f \\circ g)(x)$ means $f(g(x))$: do $g$ first, then put its output into $f$. Work from the **inside out**.',
      example: ['$f(g(x))$', 'Inside: $g$ goes first.', 'Outside: $f$ goes second.'],
      check: { q: 'In $f(g(x))$, which function do you use first?', options: ['$g$', '$f$', 'Both at once', 'It does not matter'], answer: 0, why: '$g$ is on the inside, so it acts on $x$ first.' },
    },
    {
      say: 'To find $f(g(a))$: work out $g(a)$, get a number, then put that number into $f$.',
      example: ['$f(x) = 2x - 1$ and $g(x) = x^2$. Find $f(g(3))$.', '$g(3) = 3^2 = 9$', '$f(9) = 2(9) - 1 = 17$'],
      check: { q: '$f(x) = x + 5$ and $g(x) = 3x$. What is $f(g(2))$?', options: ['$11$', '$21$', '$42$', '$7$'], answer: 0, why: '$g(2) = 6$, then $f(6) = 6 + 5 = 11$.' },
    },
    {
      say: 'Order matters. $g(f(x))$ means do $f$ first. It usually gives a different answer than $f(g(x))$.',
      example: ['$f(x) = 2x - 1$ and $g(x) = x^2$. Find $g(f(3))$.', '$f(3) = 2(3) - 1 = 5$', '$g(5) = 5^2 = 25$', 'Before, $f(g(3)) = 17$. Different.'],
      check: { q: '$f(x) = x - 4$ and $g(x) = x^2$. What is $g(f(1))$?', options: ['$9$', '$-3$', '$-9$', '$3$'], answer: 0, why: '$f(1) = -3$, then $g(-3) = (-3)^2 = 9$.' },
    },
    {
      say: 'A composition is **not** a product. $f(g(x))$ feeds one into the other. $f(x) \\cdot g(x)$ multiplies the two outputs.',
      example: ['$f(x) = x + 1$ and $g(x) = 2x$.', '$f(g(3))$: $g(3) = 6$, then $f(6) = 7$.', '$f(3) \\cdot g(3) = 4 \\times 6 = 24$', 'Not the same.'],
      check: { q: 'Which means the same as $(f \\circ g)(4)$?', options: ['$f(g(4))$', '$f(4) \\cdot g(4)$', '$g(f(4))$', '$f(4) + g(4)$'], answer: 0, why: 'The circle means composition: $g$ first, then $f$.' },
    },
    {
      say: 'From a **table**: find $g(a)$ in the $g$ row. Then find that number in the $x$ row, and read $f$ below it.',
      example: ['$x$: $-1$, $0$, $1$, $2$', '$f(x)$: $3$, $-2$, $0$, $5$', '$g(x)$: $2$, $1$, $-1$, $0$', '$f(g(0))$: $g(0) = 1$, then $f(1) = 0$.'],
      check: { q: 'Using that table, what is $g(f(1))$?', options: ['$1$', '$0$', '$-1$', '$2$'], answer: 0, why: '$f(1) = 0$, then $g(0) = 1$.' },
    },
    {
      say: 'From **graphs**: read $g(a)$ on the graph of $g$. Then go to that number on the $x$-axis and read the height of $f$ there.',
      example: ['Find $(f \\circ g)(2)$.', 'The graph of $g$ passes $(2, -1)$, so $g(2) = -1$.', 'The graph of $f$ passes $(-1, 4)$, so $f(-1) = 4$.', '$(f \\circ g)(2) = 4$'],
      check: { q: 'From the graphs, $g(1) = 3$, $f(3) = -2$ and $f(1) = 5$. What is $(f \\circ g)(1)$?', options: ['$-2$', '$3$', '$5$', '$-10$'], answer: 0, why: '$g(1) = 3$, then $f(3) = -2$. You do not need $f(1)$.' },
    },
    {
      say: 'Be careful with negatives. Use brackets when you substitute a negative number, especially before squaring.',
      example: ['$f(x) = x^2 - 3$ and $g(x) = 2x + 1$. Find $f(g(-2))$.', '$g(-2) = 2(-2) + 1 = -3$', '$f(-3) = (-3)^2 - 3 = 9 - 3 = 6$'],
      check: { q: '$f(x) = 3x + 2$ and $g(x) = x^2 - 5$. What is $g(f(-1))$?', options: ['$-4$', '$-10$', '$6$', '$-6$'], answer: 0, why: '$f(-1) = -3 + 2 = -1$, then $g(-1) = 1 - 5 = -4$.' },
    },
  ],

  'RF1.compose-equation': [
    {
      say: 'To write $f(g(x))$, take the equation of $f$ and replace every $x$ with $(g(x))$, in brackets.',
      example: ['$f(x) = x^2 + 1$ and $g(x) = 2x - 3$.', 'Replace $x$ in $f$ with $(2x - 3)$.', '$f(g(x)) = (2x - 3)^2 + 1$'],
      check: { q: '$f(x) = 3x + 4$ and $g(x) = x - 2$. What is $f(g(x))$?', options: ['$3x - 2$', '$3x + 2$', '$3x + 10$', '$3x^2 - 2x - 8$'], answer: 0, why: '$3(x - 2) + 4 = 3x - 6 + 4 = 3x - 2$.' },
    },
    {
      say: 'Then **simplify**: expand the brackets and combine like terms.',
      example: ['$(2x - 3)^2 + 1$', '$= (2x - 3)(2x - 3) + 1$', '$= 4x^2 - 12x + 9 + 1$', '$= 4x^2 - 12x + 10$'],
      check: { q: '$f(x) = x^2$ and $g(x) = x + 3$. What is $f(g(x))$?', options: ['$x^2 + 6x + 9$', '$x^2 + 9$', '$x^2 + 3$', '$x^2 + 3x + 9$'], answer: 0, why: '$(x + 3)^2 = x^2 + 3x + 3x + 9 = x^2 + 6x + 9$.' },
    },
    {
      say: 'For $g(f(x))$, it is the other way round: put $f(x)$ into $g$. You usually get a different function.',
      example: ['$f(x) = x^2 + 1$ and $g(x) = 2x - 3$.', '$g(f(x)) = 2(x^2 + 1) - 3$', '$= 2x^2 + 2 - 3 = 2x^2 - 1$'],
      check: { q: '$f(x) = x^2$ and $g(x) = x + 3$. What is $g(f(x))$?', options: ['$x^2 + 3$', '$x^2 + 6x + 9$', '$x^2 + 9$', '$3x^2$'], answer: 0, why: 'Put $x^2$ into $g$: $x^2 + 3$.' },
    },
    {
      say: 'The **domain** of $f(g(x))$: $x$ must be allowed in $g$, **and** the output $g(x)$ must be allowed in $f$.',
      example: ['$f(x) = \\sqrt{x}$ and $g(x) = x - 5$.', '$f(g(x)) = \\sqrt{x - 5}$', 'Need $x - 5 \\ge 0$.', 'Domain: $x \\ge 5$, or $[5, \\infty)$.'],
      check: { q: '$f(x) = \\sqrt{x}$ and $g(x) = 2x + 6$. What is the domain of $f(g(x))$?', options: ['$[-3, \\infty)$', '$[0, \\infty)$', '$[3, \\infty)$', '$[-6, \\infty)$'], answer: 0, why: '$2x + 6 \\ge 0$ gives $2x \\ge -6$, so $x \\ge -3$.' },
    },
    {
      say: 'If $f$ divides by $x$, then $g(x)$ cannot be $0$. Remove any $x$ that makes $g(x) = 0$.',
      example: ['$f(x) = \\frac{1}{x}$ and $g(x) = x + 4$.', '$f(g(x)) = \\frac{1}{x + 4}$', '$x + 4 \\ne 0$, so $x \\ne -4$.'],
      check: { q: '$f(x) = \\frac{1}{x}$ and $g(x) = 3x - 6$. Which value is not in the domain of $f(g(x))$?', options: ['$2$', '$6$', '$-2$', '$0$'], answer: 0, why: '$3x - 6 = 0$ when $x = 2$.' },
    },
    {
      say: 'Simplifying can **hide** a restriction. Always check the inner function first, even if the final formula looks fine everywhere.',
      example: ['$f(x) = \\sqrt{x}$ and $g(x) = x^2 - 3$.', '$g(f(x)) = (\\sqrt{x})^2 - 3 = x - 3$', 'But $\\sqrt{x}$ must exist first: $x \\ge 0$.', 'Domain: $[0, \\infty)$.'],
      check: { q: '$f(x) = \\sqrt{x}$ and $g(x) = x^2 + 2$. What is the domain of $g(f(x))$?', options: ['$[0, \\infty)$', 'All real numbers', '$[-2, \\infty)$', '$[2, \\infty)$'], answer: 0, why: '$g(f(x))$ simplifies to $x + 2$, but $\\sqrt{x}$ needs $x \\ge 0$ first.' },
    },
    {
      say: 'Some questions give a composition value and an unknown letter. Work out the inner function first, then write an equation and solve.',
      example: ['$f(x) = ax + 5$, $g(x) = x^2 - 1$, and $f(g(2)) = 14$.', '$g(2) = 4 - 1 = 3$', '$f(3) = 3a + 5 = 14$', '$3a = 9$, so $a = 3$.'],
      check: { q: '$f(x) = ax - 2$, $g(x) = x^2 + 1$, and $f(g(1)) = 6$. What is $a$?', options: ['$4$', '$8$', '$2$', '$3$'], answer: 0, why: '$g(1) = 2$. Then $2a - 2 = 6$, so $2a = 8$ and $a = 4$.' },
    },
  ],

  'RF1.decompose': [
    {
      say: 'To **decompose** a function, you split it back into an inside part and an outside part. Ask: what happens to $x$ **first**? That is the **inner** function.',
      example: ['$h(x) = \\sqrt{3x - 1}$', 'First: $3x - 1$. Then: take the root.', 'Inner: $g(x) = 3x - 1$.', 'Outer: $f(x) = \\sqrt{x}$.'],
      check: { q: '$h(x) = (x + 5)^2$. What is the inner function?', options: ['$x + 5$', '$x^2$', '$(x + 5)^2$', '$5$'], answer: 0, why: 'First you add 5 to $x$, then you square. Adding 5 comes first.' },
    },
    {
      say: 'Look closely at what touches $x$. In $3\\sqrt{x} - 1$, the root acts on $x$ first. Multiplying by 3 and subtracting 1 come after.',
      example: ['$h(x) = 3\\sqrt{x} - 1$', 'First: $\\sqrt{x}$.', 'Then: times 3, minus 1.', 'Inner: $\\sqrt{x}$. Outer: $3x - 1$.'],
      check: { q: '$h(x) = 2x^2 + 7$. What is the inner function?', options: ['$x^2$', '$2x + 7$', '$2x^2 + 7$', '$7$'], answer: 0, why: 'Squaring touches $x$ first. Then you multiply by 2 and add 7.' },
    },
    {
      say: 'When you are given $f$, $g$ and $k$, match each step to one of them. The function that acts first goes on the inside.',
      example: ['$f(x) = \\sqrt{x}$, $g(x) = 2x + 3$, $k(x) = x^2$.', '$\\sqrt{2x + 3}$: $g$ first, then $f$. So $f(g(x))$.', '$2\\sqrt{x} + 3$: $f$ first, then $g$. So $g(f(x))$.'],
      check: { q: 'With those $f$, $g$ and $k$, which equals $h(x) = (2x + 3)^2$?', options: ['$k(g(x))$', '$g(k(x))$', '$k(x) \\cdot g(x)$', '$f(g(x))$'], answer: 0, why: '$g$ makes $2x + 3$ first, then $k$ squares it.' },
    },
    {
      say: 'If you know the inner function, find the outer one by replacing the inner expression with a single $x$.',
      example: ['$h(x) = (3x - 1)^2 + 4$ and $g(x) = 3x - 1$.', 'Replace $3x - 1$ with $x$.', '$f(x) = x^2 + 4$'],
      check: { q: '$h(x) = f(g(x))$, where $g(x) = x + 6$ and $h(x) = -2\\sqrt{x + 6}$. What is $f(x)$?', options: ['$-2\\sqrt{x}$', '$\\sqrt{x}$', '$-2\\sqrt{x + 6}$', '$-2x$'], answer: 0, why: 'Replace $x + 6$ with $x$: $-2\\sqrt{x}$.' },
    },
    {
      say: 'Three functions can be chained. Read the steps in order, from what touches $x$ first to what happens last. The first step goes innermost.',
      example: ['$f(x) = \\sqrt{x}$, $g(x) = x + 1$, $k(x) = x^2$.', '$h(x) = \\sqrt{x^2 + 1}$', 'Square ($k$), then add 1 ($g$), then root ($f$).', '$h(x) = f(g(k(x)))$'],
      check: { q: 'With those $f$, $g$ and $k$, which equals $(\\sqrt{x} + 1)^2$?', options: ['$k(g(f(x)))$', '$f(g(k(x)))$', '$g(k(f(x)))$', '$k(f(g(x)))$'], answer: 0, why: 'Root first ($f$), then add 1 ($g$), then square ($k$).' },
    },
    {
      say: 'For a **product** or **quotient**, factor first. Then match each factor to one of the given functions.',
      example: ['$f(x) = x - 3$, $g(x) = x + 2$, $k(x) = \\sqrt{x}$.', '$h(x) = \\frac{x^2 - x - 6}{\\sqrt{x}}$', '$x^2 - x - 6 = (x - 3)(x + 2)$', '$h(x) = \\frac{f(x) \\cdot g(x)}{k(x)}$'],
      check: { q: '$f(x) = x + 1$, $g(x) = x - 4$, $k(x) = \\sqrt{x}$. Which equals $h(x) = \\frac{x^2 - 3x - 4}{\\sqrt{x}}$?', options: ['$\\frac{f(x) \\cdot g(x)}{k(x)}$', '$\\frac{k(x)}{f(x) \\cdot g(x)}$', '$\\frac{f(g(x))}{k(x)}$', '$\\frac{f(x) + g(x)}{k(x)}$'], answer: 0, why: '$x^2 - 3x - 4 = (x + 1)(x - 4)$, which is $f(x) \\cdot g(x)$.' },
    },
    {
      say: 'Check your answer by composing back. Build the composition from your pieces and see if you get the original $h(x)$.',
      example: ['Claim: $\\sqrt{3x - 1} = f(g(x))$ with $f(x) = \\sqrt{x}$ and $g(x) = 3x - 1$.', 'Put $3x - 1$ into $f$: $\\sqrt{3x - 1}$.', 'It matches, so the claim is right.'],
      check: { q: '$f(x) = x^2$ and $g(x) = x - 2$. Which composition gives $h(x) = x^2 - 2$?', options: ['$g(f(x))$', '$f(g(x))$', '$f(x) \\cdot g(x)$'], answer: 0, why: '$g(f(x)) = x^2 - 2$. But $f(g(x)) = (x - 2)^2$, which is different.' },
    },
  ],
};
