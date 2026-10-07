import type { LessonCard } from '../types';

/** Lesson cards in plain words, one small idea per card. Keyed by skill node id. */
export const CARDS: Record<string, LessonCard[]> = {
  'RF13.sqrt-transform': [
    {
      say: 'The graph of $y = \\sqrt{x}$ starts at the **endpoint** $(0, 0)$ and curves up and to the right. Three easy points on it are $(0, 0)$, $(1, 1)$ and $(4, 2)$.',
      example: ['$\\sqrt{0} = 0$, so $(0, 0)$.', '$\\sqrt{1} = 1$, so $(1, 1)$.', '$\\sqrt{4} = 2$, so $(4, 2)$.'],
      check: { q: 'Which point is on $y = \\sqrt{x}$?', options: ['$(9, 3)$', '$(3, 9)$', '$(4, 16)$', '$(2, 4)$'], answer: 0, why: '$\\sqrt{9} = 3$, so $x = 9$ gives $y = 3$.' },
    },
    {
      say: 'In $y = a\\sqrt{b(x - h)} + k$, the endpoint moves from $(0, 0)$ to $(h, k)$. Inside the root, $x - 3$ means $h = 3$. Outside, $+1$ means $k = 1$.',
      example: ['$y = \\sqrt{x - 3} + 1$', '$h = 3$ and $k = 1$.', 'Endpoint: $(3, 1)$.'],
      check: { q: 'Where is the endpoint of $y = \\sqrt{x + 2} - 4$?', options: ['$(-2, -4)$', '$(2, -4)$', '$(-2, 4)$', '$(2, 4)$'], answer: 0, why: '$x + 2 = x - (-2)$, so $h = -2$. The $-4$ outside gives $k = -4$.' },
    },
    {
      say: 'The number $a$ in front stretches the graph up and down. If $a$ is **negative**, the graph flips and goes **down** from the endpoint, so the **range** (all the $y$-values) is $y \\le k$.',
      example: ['$y = -2\\sqrt{x - 3} + 1$', 'Endpoint $(3, 1)$.', '$a = -2$ is negative, so the graph goes down.', 'Range: $y \\le 1$.'],
      check: { q: 'What is the range of $y = -\\sqrt{x} + 5$?', options: ['$y \\le 5$', '$y \\ge 5$', '$y \\le 0$', '$y \\ge -5$'], answer: 0, why: 'The endpoint is $(0, 5)$ and $a = -1$ is negative, so the graph goes down from $y = 5$.' },
    },
    {
      say: 'If $b$ is **negative**, the graph flips sideways and opens to the **left**. Then the **domain** (all the $x$-values) is $x \\le h$. If $b$ is positive, the domain is $x \\ge h$.',
      example: ['$y = \\sqrt{-(x - 2)}$', 'Endpoint $(2, 0)$.', '$b = -1$, so the graph opens left.', 'Domain: $x \\le 2$.'],
      check: { q: 'What is the domain of $y = \\sqrt{-(x + 1)} + 3$?', options: ['$x \\le -1$', '$x \\ge -1$', '$x \\le 1$', '$x \\ge 3$'], answer: 0, why: '$h = -1$ and $b$ is negative, so the graph opens left from $x = -1$.' },
    },
    {
      say: 'To move one point $(x, y)$ from $y = \\sqrt{x}$, use $(x, y) \\to \\left(\\frac{x}{b} + h,\\ ay + k\\right)$. Divide $x$ by $b$ then add $h$. Multiply $y$ by $a$ then add $k$.',
      example: ['Move $(4, 2)$ onto $y = 3\\sqrt{2(x - 1)} - 5$.', '$a = 3$, $b = 2$, $h = 1$, $k = -5$.', 'New $x$: $\\frac{4}{2} + 1 = 3$.', 'New $y$: $3(2) - 5 = 1$.', 'Image: $(3, 1)$.'],
      check: { q: 'Where does $(4, 2)$ on $y = \\sqrt{x}$ go on $y = \\sqrt{4x}$?', options: ['$(1, 2)$', '$(16, 2)$', '$(1, 8)$'], answer: 0, why: '$b = 4$, so the new $x$ is $\\frac{4}{4} = 1$. Nothing changes $y$, so it stays $2$.' },
    },
    {
      say: 'If the inside is not in the form $b(x - h)$, **factor out** $b$ first. Otherwise you read the wrong $h$.',
      example: ['$y = \\sqrt{2x - 6}$', 'Factor out 2: $2x - 6 = 2(x - 3)$.', 'So $h = 3$, not $6$.', 'Domain: $x \\ge 3$.'],
      check: { q: 'What is $h$ for $y = \\sqrt{3x + 12}$?', options: ['$-4$', '$4$', '$-12$', '$12$'], answer: 0, why: '$3x + 12 = 3(x + 4) = 3(x - (-4))$, so $h = -4$.' },
    },
    {
      say: 'To write the equation from a graph, read the endpoint to get $h$ and $k$. Check if it opens right or left. Then put in one more point and solve for $a$.',
      example: ['Endpoint $(2, 1)$, opens right, passes through $(6, 5)$.', '$y = a\\sqrt{x - 2} + 1$', '$5 = a\\sqrt{6 - 2} + 1$', '$5 = 2a + 1$, so $4 = 2a$.', '$a = 2$, so $y = 2\\sqrt{x - 2} + 1$.'],
      check: { q: 'A graph opens right from $(-1, 3)$ and passes through $(3, -1)$. In $y = a\\sqrt{x + 1} + 3$, what is $a$?', options: ['$-2$', '$2$', '$-1$', '$-4$'], answer: 0, why: '$-1 = a\\sqrt{4} + 3$, so $-4 = 2a$ and $a = -2$.' },
    },
    {
      say: 'Two different equations can draw the same graph. A stretch up by $a$ can match a squeeze sideways, because $\\sqrt{4x} = \\sqrt{4}\\sqrt{x} = 2\\sqrt{x}$.',
      example: ['$\\sqrt{4x} = \\sqrt{4} \\cdot \\sqrt{x}$', '$\\sqrt{4} = 2$', 'So $\\sqrt{4x} = 2\\sqrt{x}$.'],
      check: { q: 'Which equation has the same graph as $y = 3\\sqrt{x}$?', options: ['$y = \\sqrt{9x}$', '$y = \\sqrt{3x}$', '$y = \\sqrt{6x}$', '$y = 9\\sqrt{x}$'], answer: 0, why: '$\\sqrt{9x} = \\sqrt{9}\\sqrt{x} = 3\\sqrt{x}$.' },
    },
  ],

  'RF13.sqrt-of-f': [
    {
      say: 'To graph $y = \\sqrt{f(x)}$, keep each $x$ and take the square root of its $y$. The rule is $(x, y) \\to (x, \\sqrt{y})$.',
      example: ['$(3, 16)$ is on $y = f(x)$.', '$\\sqrt{16} = 4$.', 'So $(3, 4)$ is on $y = \\sqrt{f(x)}$.'],
      check: { q: '$(5, 9)$ is on $y = f(x)$. Which point is on $y = \\sqrt{f(x)}$?', options: ['$(5, 3)$', '$(\\sqrt{5}, 9)$', '$(5, 81)$', '$(5, 4.5)$'], answer: 0, why: 'Keep $x = 5$ and take $\\sqrt{9} = 3$.' },
    },
    {
      say: 'A negative number has no real square root. So wherever $f(x)$ is **below** the $x$-axis, $y = \\sqrt{f(x)}$ has **no point** at all.',
      example: ['$(2, -4)$ is on $y = f(x)$.', '$\\sqrt{-4}$ is not a real number.', 'So $y = \\sqrt{f(x)}$ has no point at $x = 2$.'],
      check: { q: '$(1, -9)$ is on $y = f(x)$. What is on $y = \\sqrt{f(x)}$ at $x = 1$?', options: ['No point', '$(1, -3)$', '$(1, 3)$', '$(-1, 3)$'], answer: 0, why: '$-9$ is negative, so $\\sqrt{-9}$ is not real.' },
    },
    {
      say: 'So the **domain** of $y = \\sqrt{f(x)}$ is the $x$-values where $f(x) \\ge 0$. Solve that inequality, or read where the graph of $f$ is on or above the $x$-axis.',
      example: ['$f(x) = 9 - x^2$', 'Need $9 - x^2 \\ge 0$.', 'So $x^2 \\le 9$.', 'Domain: $-3 \\le x \\le 3$.'],
      check: { q: 'If $f(x) = x + 5$, what is the domain of $y = \\sqrt{f(x)}$?', options: ['$x \\ge -5$', '$x \\ge 5$', '$x \\le -5$', 'All real numbers'], answer: 0, why: '$x + 5 \\ge 0$ gives $x \\ge -5$.' },
    },
    {
      say: 'For the **range**, throw away the negative $y$-values of $f$. Then take the square root of what is left.',
      example: ['$f$ has range $y \\le 9$.', 'Keep only $0 \\le y \\le 9$.', 'Square roots: $\\sqrt{0} = 0$ and $\\sqrt{9} = 3$.', 'Range of $\\sqrt{f(x)}$: $0 \\le y \\le 3$.'],
      check: { q: '$f(x) = x^2 - 4$ has range $y \\ge -4$. What is the range of $y = \\sqrt{f(x)}$?', options: ['$y \\ge 0$', '$y \\ge -2$', '$y \\ge 2$', '$y \\ge -4$'], answer: 0, why: 'The negative part is dropped, so the kept part is $y \\ge 0$, and $\\sqrt{0} = 0$.' },
    },
    {
      say: 'An **invariant point** stays in the same place on both graphs. This happens where $f(x) = 0$ or $f(x) = 1$, because $\\sqrt{0} = 0$ and $\\sqrt{1} = 1$.',
      example: ['$f(x) = x - 2$', '$f(x) = 0$ at $x = 2$: point $(2, 0)$.', '$f(x) = 1$ at $x = 3$: point $(3, 1)$.', 'Invariant points: $(2, 0)$ and $(3, 1)$.'],
      check: { q: 'What are the invariant points for $f(x) = x + 4$ and $y = \\sqrt{f(x)}$?', options: ['$(-4, 0)$ and $(-3, 1)$', '$(4, 0)$ and $(5, 1)$', '$(-4, 0)$ only', '$(0, 4)$ and $(1, 5)$'], answer: 0, why: '$x + 4 = 0$ at $x = -4$, and $x + 4 = 1$ at $x = -3$.' },
    },
    {
      say: 'Between 0 and 1, the root is **bigger**: the $\\sqrt{f}$ graph is **above** $f$. Above 1, the root is **smaller**: the $\\sqrt{f}$ graph is **below** $f$.',
      example: ['$f(x) = 0.25$ gives $\\sqrt{0.25} = 0.5$: above.', '$f(x) = 4$ gives $\\sqrt{4} = 2$: below.'],
      check: { q: 'Where $f(x) = 9$, is the graph of $y = \\sqrt{f(x)}$ above or below $y = f(x)$?', options: ['Below', 'Above', 'At the same point', 'There is no point'], answer: 0, why: '$\\sqrt{9} = 3$, and $3$ is less than $9$.' },
    },
    {
      say: 'A highest or lowest point of $f$ stays at the **same** $x$ on $\\sqrt{f}$. Only its height changes to the square root.',
      example: ['$f$ has a maximum at $(2, 16)$.', '$\\sqrt{16} = 4$.', '$y = \\sqrt{f(x)}$ has a maximum at $(2, 4)$.'],
      check: { q: '$f$ has a minimum at $(-3, 25)$. Where is the minimum of $y = \\sqrt{f(x)}$?', options: ['$(-3, 5)$', '$(-3, 25)$', '$(5, -3)$', '$(-3, 12.5)$'], answer: 0, why: 'Same $x = -3$, and $\\sqrt{25} = 5$.' },
    },
    {
      say: 'Where $f$ crosses the $x$-axis, $\\sqrt{f}$ meets the axis going straight up. If $f$ only touches the axis at its vertex, $\\sqrt{f}$ makes a sharp **V** there.',
      example: ['$f(x) = (x - 2)^2$ touches the axis at $x = 2$.', '$\\sqrt{(x - 2)^2} = |x - 2|$', 'At $x = 0$: $\\sqrt{4} = 2$. At $x = 4$: $\\sqrt{4} = 2$.', 'That is a V with its point at $(2, 0)$.'],
      check: { q: 'Which is the same as $\\sqrt{(x + 1)^2}$?', options: ['$|x + 1|$', '$x + 1$', '$|x - 1|$', '$(x + 1)^2$'], answer: 0, why: 'A square root is never negative, so it gives the absolute value $|x + 1|$.' },
    },
  ],

  'RF13.solve': [
    {
      say: 'To solve a **radical equation** (one with $x$ under a root), first get the root alone on one side. Then square both sides to remove it.',
      example: ['$\\sqrt{x} + 3 = 7$', 'Subtract 3: $\\sqrt{x} = 4$.', 'Square both sides: $x = 16$.', 'Check: $\\sqrt{16} + 3 = 7$. Yes.'],
      check: { q: 'What is the first step for $\\sqrt{x - 1} - 2 = 5$?', options: ['Add 2 to both sides', 'Square both sides', 'Subtract 5 from both sides', 'Add 1 to both sides'], answer: 0, why: 'Get the root alone first. Adding 2 gives $\\sqrt{x - 1} = 7$.' },
    },
    {
      say: 'Write the **restrictions** before you square. The **radicand** (the part under the root) must be $\\ge 0$. The side equal to the root must also be $\\ge 0$, because a root is never negative.',
      example: ['$\\sqrt{x + 4} = x - 2$', 'Radicand: $x + 4 \\ge 0$, so $x \\ge -4$.', 'Other side: $x - 2 \\ge 0$, so $x \\ge 2$.', 'Both together: $x \\ge 2$.'],
      check: { q: 'What are the restrictions for $\\sqrt{x - 5} = x - 7$?', options: ['$x \\ge 7$', '$x \\ge 5$', '$x \\ge -5$', 'None'], answer: 0, why: 'You need $x \\ge 5$ and $x \\ge 7$. Both are true only when $x \\ge 7$.' },
    },
    {
      say: 'When you square a side like $x - 2$, square the **whole** bracket. Use $(x - 2)(x - 2)$, not just $x^2$ and $2^2$.',
      example: ['$(x - 2)^2 = (x - 2)(x - 2)$', '$= x^2 - 2x - 2x + 4$', '$= x^2 - 4x + 4$'],
      check: { q: 'What is $(x - 3)^2$?', options: ['$x^2 - 6x + 9$', '$x^2 + 9$', '$x^2 - 9$', '$x^2 - 3x + 9$'], answer: 0, why: '$(x - 3)(x - 3) = x^2 - 3x - 3x + 9 = x^2 - 6x + 9$.' },
    },
    {
      say: 'After squaring you get a polynomial equation. Move everything to one side and factor.',
      example: ['$\\sqrt{x + 4} = x - 2$', 'Square: $x + 4 = x^2 - 4x + 4$', 'Move all to one side: $0 = x^2 - 5x$', 'Factor: $0 = x(x - 5)$', 'So $x = 0$ or $x = 5$.'],
      check: { q: 'Squaring gives $0 = x^2 - 3x$. What are the roots?', options: ['$0$ and $3$', '$3$ only', '$0$ and $-3$', '$1$ and $3$'], answer: 0, why: '$x^2 - 3x = x(x - 3)$, which is 0 when $x = 0$ or $x = 3$.' },
    },
    {
      say: 'Squaring can add a fake answer, called an **extraneous root**. Always put each answer back into the **original** equation. Reject any that fail.',
      example: ['Test $x = 0$ in $\\sqrt{x + 4} = x - 2$.', 'Left: $\\sqrt{4} = 2$. Right: $0 - 2 = -2$.', '$2 \\ne -2$, so reject $x = 0$.', 'Test $x = 5$: $\\sqrt{9} = 3$ and $5 - 2 = 3$. Keep it.'],
      check: { q: 'Squaring $\\sqrt{x} = x - 2$ gives $x = 1$ or $x = 4$. Which are solutions?', options: ['Only $4$', 'Only $1$', 'Both', 'Neither'], answer: 0, why: 'At $x = 1$: $\\sqrt{1} = 1$ but $1 - 2 = -1$. At $x = 4$: $\\sqrt{4} = 2$ and $4 - 2 = 2$.' },
    },
    {
      say: 'A square root is never negative. So if the root alone equals a negative number, there is **no solution**.',
      example: ['$\\sqrt{x - 1} = -2$', 'A root cannot equal $-2$.', 'No solution.'],
      check: { q: 'How many solutions does $\\sqrt{x + 2} = -5$ have?', options: ['0', '1', '2', 'Infinitely many'], answer: 0, why: 'A square root is never negative, so it cannot equal $-5$.' },
    },
    {
      say: 'To solve **graphically**, graph each side as its own function. The $x$-coordinates where the graphs cross are the solutions. Or move everything to one side and find the $x$-intercepts of that one graph.',
      example: ['$\\sqrt{x + 4} = x - 2$', 'Way 1: graph $y = \\sqrt{x + 4}$ and $y = x - 2$. They cross at $(5, 3)$.', 'Way 2: graph $y = \\sqrt{x + 4} - x + 2$. It crosses the $x$-axis at $5$.', 'Solution: $x = 5$.'],
      check: { q: 'The solutions of $\\sqrt{x + 1} = 3$ are the $x$-intercepts of which function?', options: ['$y = \\sqrt{x + 1} - 3$', '$y = \\sqrt{x + 1} + 3$', '$y = \\sqrt{x + 1}$', '$y = \\sqrt{x - 2}$'], answer: 0, why: 'Subtract 3 from both sides: $\\sqrt{x + 1} - 3 = 0$.' },
    },
    {
      say: 'Three names, same numbers: the **zeros** of a function, the **$x$-intercepts** of its graph, and the **roots** of the equation $f(x) = 0$.',
      example: ['$y = \\sqrt{x - 1} - 2$', 'Set $y = 0$: $\\sqrt{x - 1} = 2$.', 'Square: $x - 1 = 4$, so $x = 5$.', 'Zero: $5$. $x$-intercept: $5$. Root: $5$.'],
      check: { q: 'What is the zero of $y = \\sqrt{x + 3} - 1$?', options: ['$-2$', '$4$', '$-3$', '$1$'], answer: 0, why: '$\\sqrt{x + 3} = 1$, so $x + 3 = 1$ and $x = -2$.' },
    },
  ],

  'RF14.va-vs-hole': [
    {
      say: 'A **rational function** is a fraction with $x$ in the bottom. Any $x$ that makes the bottom zero is a **non-permissible value**: the function has no value there.',
      example: ['$y = \\frac{x + 1}{x - 4}$', 'Bottom is zero when $x - 4 = 0$.', 'So $x = 4$ is non-permissible.'],
      check: { q: 'What is the non-permissible value of $y = \\frac{3}{x + 5}$?', options: ['$-5$', '$5$', '$3$', '$0$'], answer: 0, why: '$x + 5 = 0$ when $x = -5$.' },
    },
    {
      say: 'Always **factor** the top and bottom fully first. Each bottom factor gives a non-permissible value.',
      example: ['$y = \\frac{x}{x^2 - 9}$', 'Factor: $x^2 - 9 = (x - 3)(x + 3)$.', 'Non-permissible: $x = 3$ and $x = -3$.'],
      check: { q: 'What are the non-permissible values of $y = \\frac{1}{x^2 - x - 6}$?', options: ['$3$ and $-2$', '$-3$ and $2$', '$6$ only', '$1$ and $-6$'], answer: 0, why: '$x^2 - x - 6 = (x - 3)(x + 2)$, which is zero at $3$ and $-2$.' },
    },
    {
      say: 'If the same factor is on the top **and** the bottom, it cancels. That $x$-value is a **point of discontinuity**, also called a **hole**.',
      example: ['$y = \\frac{x - 2}{(x - 2)(x + 3)}$', '$(x - 2)$ is on top and bottom.', 'It cancels, so there is a hole at $x = 2$.'],
      check: { q: 'Where is the hole in $y = \\frac{(x + 1)(x - 4)}{(x + 1)(x - 5)}$?', options: ['$x = -1$', '$x = 1$', '$x = 5$', '$x = 4$'], answer: 0, why: '$(x + 1)$ is on top and bottom, and it is zero at $x = -1$.' },
    },
    {
      say: 'A bottom factor that is **left over** after cancelling gives a **vertical asymptote**: a vertical line the graph gets close to but never touches.',
      example: ['$y = \\frac{x - 2}{(x - 2)(x + 3)}$', 'After cancelling, $(x + 3)$ is left on the bottom.', 'Vertical asymptote: $x = -3$.'],
      check: { q: 'Where is the vertical asymptote of $y = \\frac{(x + 1)(x - 4)}{(x + 1)(x - 5)}$?', options: ['$x = 5$', '$x = -1$', '$x = 4$', '$x = -5$'], answer: 0, why: '$(x - 5)$ stays on the bottom after $(x + 1)$ cancels.' },
    },
    {
      say: 'Near a hole, $y$ gets close to an ordinary number. Near a vertical asymptote, $y$ grows **huge**, positive or negative.',
      example: ['After cancelling, $y = \\frac{1}{x + 3}$.', 'Near the hole, $x = 2.01$: $y = \\frac{1}{5.01} \\approx 0.2$.', 'Near the asymptote, $x = -2.99$: $y = \\frac{1}{0.01} = 100$.'],
      check: { q: 'As $x$ gets close to $4$, $y$ keeps getting bigger without end. What is at $x = 4$?', options: ['A vertical asymptote', 'A hole', 'An $x$-intercept'], answer: 0, why: 'Values growing without bound mean an asymptote. Near a hole, $y$ settles near one number.' },
    },
    {
      say: 'On a graph, a hole is drawn as an **open circle** and an asymptote as a **dashed line**. Neither one is part of the graph.',
      check: { q: 'What does an open circle on a rational graph show?', options: ['A hole: one missing point', 'An $x$-intercept', 'A vertical asymptote', 'The $y$-intercept'], answer: 0, why: 'The open circle marks the single point where the function has no value.' },
    },
    {
      say: 'If a factor appears **more times** on the bottom than the top, one copy stays after cancelling. Then it is still a vertical asymptote, not a hole.',
      example: ['$y = \\frac{x - 1}{(x - 1)^2}$', 'Cancel one $(x - 1)$: $y = \\frac{1}{x - 1}$.', 'One $(x - 1)$ is still on the bottom.', 'So $x = 1$ is a vertical asymptote.'],
      check: { q: 'What is at $x = -2$ for $y = \\frac{x + 2}{(x + 2)^2}$?', options: ['A vertical asymptote', 'A hole', 'An $x$-intercept', 'Nothing special'], answer: 0, why: 'After cancelling one $(x + 2)$, one copy is still on the bottom.' },
    },
    {
      say: 'To **make** a hole, choose the top factor to match a bottom factor.',
      example: ['$f(x) = \\frac{x + k}{(x - 1)(x + 4)}$', 'Match $(x - 1)$: $k = -1$.', 'Match $(x + 4)$: $k = 4$.', 'So $k = -1$ or $k = 4$ gives a hole.'],
      check: { q: 'For which $k$ does $f(x) = \\frac{x + k}{x - 6}$ have a hole?', options: ['$k = -6$', '$k = 6$', '$k = 0$', '$k = 1$'], answer: 0, why: 'With $k = -6$ the top is $x - 6$, the same as the bottom.' },
    },
  ],

  'RF14.ha-intercepts': [
    {
      say: 'A **horizontal asymptote** is a flat line the graph gets close to when $x$ is very large or very small. To find it, compare the **degree** (highest power of $x$) on top and bottom.',
      example: ['$x^2 - 4$ has degree 2.', '$3x + 1$ has degree 1.', 'A plain number like $5$ has degree 0.'],
      check: { q: 'What is the degree of $5x^3 - x$?', options: ['3', '5', '1', '2'], answer: 0, why: 'The highest power of $x$ is $x^3$.' },
    },
    {
      say: 'If the top degree is **smaller** than the bottom degree, the horizontal asymptote is $y = 0$.',
      example: ['$y = \\frac{x + 2}{x^2 - 1}$', 'Top degree 1, bottom degree 2.', '$1 < 2$, so the asymptote is $y = 0$.'],
      check: { q: 'What is the horizontal asymptote of $y = \\frac{4}{x - 3}$?', options: ['$y = 0$', '$y = 4$', '$y = 3$', 'None'], answer: 0, why: 'The top has degree 0 and the bottom has degree 1, so it is $y = 0$.' },
    },
    {
      say: 'If the degrees are **equal**, divide the **leading coefficients** (the numbers in front of the highest powers). That number is the asymptote.',
      example: ['$y = \\frac{3x - 6}{x + 1}$', 'Both have degree 1.', 'Leading numbers: $3$ and $1$.', '$\\frac{3}{1} = 3$, so the asymptote is $y = 3$.'],
      check: { q: 'What is the horizontal asymptote of $y = \\frac{4x^2}{2x^2 - 8}$?', options: ['$y = 2$', '$y = 4$', '$y = \\frac{1}{2}$', '$y = 0$'], answer: 0, why: 'Equal degrees, so divide $4$ by $2$ to get $2$.' },
    },
    {
      say: 'If the top degree is **bigger** than the bottom degree, there is **no** horizontal asymptote.',
      example: ['$y = \\frac{x^2 + 1}{x - 2}$', 'Top degree 2, bottom degree 1.', '$2 > 1$, so there is none.'],
      check: { q: 'What is the horizontal asymptote of $y = \\frac{x^3}{x^2 + 1}$?', options: ['None', '$y = 1$', '$y = 0$'], answer: 0, why: 'The top degree, 3, is bigger than the bottom degree, 2.' },
    },
    {
      say: 'A horizontal asymptote only describes the **far ends** of the graph. In the middle, the graph is allowed to cross it.',
      example: ['$y = \\frac{x}{x^2 + 1}$ has asymptote $y = 0$.', 'At $x = 0$: $y = \\frac{0}{1} = 0$.', 'So the graph is on its asymptote at $(0, 0)$.'],
      check: { q: 'Can a graph cross its horizontal asymptote?', options: ['Yes, at some $x$-values in the middle', 'No, never', 'Only at $x = 0$'], answer: 0, why: 'The asymptote is about the ends only, so crossing in the middle is allowed.' },
    },
    {
      say: 'The **$x$-intercepts** come from the zeros of the **top**. But if that factor cancels with the bottom, it is a hole, not an intercept.',
      example: ['$y = \\frac{(x - 3)(x + 1)}{(x + 1)(x - 2)}$', 'Top zeros: $3$ and $-1$.', '$(x + 1)$ cancels, so $x = -1$ is a hole.', '$x$-intercept: $3$ only.'],
      check: { q: 'What are the $x$-intercepts of $y = \\frac{(x + 4)(x - 5)}{(x - 5)(x + 2)}$?', options: ['$-4$ only', '$-4$ and $5$', '$5$ only', '$-2$'], answer: 0, why: '$(x - 5)$ cancels and makes a hole. Only $(x + 4)$ gives an intercept.' },
    },
    {
      say: 'For the **$y$-intercept**, put $x = 0$ into the function. If $x = 0$ is non-permissible, there is no $y$-intercept.',
      example: ['$y = \\frac{2x - 6}{x + 3}$', '$y = \\frac{0 - 6}{0 + 3} = \\frac{-6}{3} = -2$', 'For $y = \\frac{5}{x}$, $x = 0$ is not allowed: no $y$-intercept.'],
      check: { q: 'What is the $y$-intercept of $y = \\frac{x + 8}{x - 4}$?', options: ['$-2$', '$2$', '$8$', '$-\\frac{1}{2}$'], answer: 0, why: '$\\frac{0 + 8}{0 - 4} = \\frac{8}{-4} = -2$.' },
    },
  ],

  'RF14.domain-range': [
    {
      say: 'The **domain** is every real number except the non-permissible values. Leave out **both** the holes and the vertical asymptotes. Use the original bottom, before cancelling.',
      example: ['$y = \\frac{x - 1}{(x - 2)(x + 3)}$', 'Bottom is zero at $2$ and $-3$.', 'Domain: $\\{x \\mid x \\ne 2, -3,\\ x \\in R\\}$'],
      check: { q: 'What is the domain of $y = \\frac{x + 1}{(x + 1)(x - 4)}$?', options: ['$\\{x \\mid x \\ne -1, 4,\\ x \\in R\\}$', '$\\{x \\mid x \\ne 4,\\ x \\in R\\}$', '$\\{x \\mid x \\ne 1, -4,\\ x \\in R\\}$', '$\\{x \\mid x \\in R\\}$'], answer: 0, why: 'Both $-1$ (a hole) and $4$ (an asymptote) make the original bottom zero.' },
    },
    {
      say: 'For $y = \\frac{ax + b}{cx + d}$, the graph never reaches its horizontal asymptote $y = \\frac{a}{c}$. So the **range** is every real number except $\\frac{a}{c}$.',
      example: ['$y = \\frac{2x + 1}{x - 3}$', 'Horizontal asymptote: $y = \\frac{2}{1} = 2$.', 'Range: $\\{y \\mid y \\ne 2,\\ y \\in R\\}$'],
      check: { q: 'What $y$-value is missing from the range of $y = \\frac{6x - 1}{2x + 5}$?', options: ['$3$', '$6$', '$-\\frac{5}{2}$', 'None is missing'], answer: 0, why: 'The horizontal asymptote is $y = \\frac{6}{2} = 3$.' },
    },
    {
      say: 'A hole removes one point, so it can also remove one $y$-value from the range. Find the hole by cancelling, then put its $x$ into what is left.',
      example: ['$y = \\frac{(x - 3)(x - 1)}{x - 1}$', 'Cancel: $y = x - 3$, with $x \\ne 1$.', 'Hole $y$: $1 - 3 = -2$.', 'Range: $\\{y \\mid y \\ne -2,\\ y \\in R\\}$'],
      check: { q: 'What is the range of $y = \\frac{(x + 2)(x - 5)}{x - 5}$?', options: ['$\\{y \\mid y \\ne 7,\\ y \\in R\\}$', '$\\{y \\mid y \\ne 5,\\ y \\in R\\}$', '$\\{y \\mid y \\ne -2,\\ y \\in R\\}$', '$\\{y \\mid y \\in R\\}$'], answer: 0, why: 'It is the line $y = x + 2$ with a hole at $x = 5$, where $y = 5 + 2 = 7$.' },
    },
    {
      say: 'When there is a hole **and** a horizontal asymptote, leave **both** $y$-values out of the range.',
      example: ['$y = \\frac{x - 1}{(x - 1)(x + 2)}$', 'Cancel: $y = \\frac{1}{x + 2}$. Asymptote $y = 0$.', 'Hole at $x = 1$: $y = \\frac{1}{3}$.', 'Range: $\\{y \\mid y \\ne 0, \\frac{1}{3},\\ y \\in R\\}$'],
      check: { q: 'What is the range of $y = \\frac{2(x - 3)}{(x - 3)(x - 1)}$?', options: ['$\\{y \\mid y \\ne 0, 1,\\ y \\in R\\}$', '$\\{y \\mid y \\ne 0,\\ y \\in R\\}$', '$\\{y \\mid y \\ne 0, 3,\\ y \\in R\\}$', '$\\{y \\mid y \\ne 1, 3,\\ y \\in R\\}$'], answer: 0, why: 'Cancel to $y = \\frac{2}{x - 1}$: asymptote $y = 0$. The hole at $x = 3$ has $y = \\frac{2}{2} = 1$.' },
    },
    {
      say: 'Careful: the hole $y$-value stays **in** the range if the graph reaches that same $y$ at another point.',
      example: ['$y = \\frac{x^2(x - 1)}{x - 1}$ is $y = x^2$ with a hole at $(1, 1)$.', 'But at $x = -1$, $y = (-1)^2 = 1$.', 'So $y = 1$ is still reached.', 'Range: $y \\ge 0$.'],
      check: { q: 'A graph has a hole at $(2, 4)$, but it passes through $(-2, 4)$. Is $4$ in the range?', options: ['Yes', 'No', 'Only if $x = 2$'], answer: 0, why: 'The point $(-2, 4)$ is on the graph, so $y = 4$ is reached.' },
    },
    {
      say: 'For $y = \\frac{k}{(x - p)^2}$ the bottom is a square, so it is always positive. Every $y$ has the same sign as $k$.',
      example: ['$y = \\frac{3}{(x - 1)^2}$', '$(x - 1)^2 > 0$ and $3 > 0$.', 'So every $y$ is positive: range $y > 0$.'],
      check: { q: 'What is the range of $y = \\frac{-2}{(x + 4)^2}$?', options: ['$y < 0$', '$y > 0$', '$y \\ne -4$', '$y \\ne -2$'], answer: 0, why: 'The bottom is always positive and the top is $-2$, so every $y$ is negative.' },
    },
    {
      say: 'You can check a range on the graph. Slide a flat line up and down. Any $y$-value where the line misses the curve is not in the range.',
      check: { q: 'On a graph, the flat line $y = 2$ never touches the curve. What does that tell you?', options: ['$2$ is not in the range', '$2$ is not in the domain', '$x = 2$ is an asymptote'], answer: 0, why: 'A flat line is one $y$-value. If it misses the curve, that $y$ never happens.' },
    },
  ],

  'RF14.hole-y': [
    {
      say: 'At a hole, putting the $x$-value into the original function gives $\\frac{0}{0}$. That does not tell you the $y$-value.',
      example: ['$y = \\frac{(x + 1)(x - 2)}{x + 1}$ at $x = -1$', 'Top: $(0)(-3) = 0$.', 'Bottom: $0$.', 'So you get $\\frac{0}{0}$.'],
      check: { q: 'What do you get if you put $x = 3$ straight into $\\frac{(x - 3)(x + 1)}{x - 3}$?', options: ['$\\frac{0}{0}$', '$4$', '$0$'], answer: 0, why: 'Both $(x - 3)$ factors are zero at $x = 3$.' },
    },
    {
      say: 'So **cancel** the common factor first. Then put the $x$-value into the **simplified** function. The result is the hole $y$-coordinate.',
      example: ['$y = \\frac{(x + 1)(x - 2)}{x + 1}$', 'Cancel: $y = x - 2$.', 'At $x = -1$: $y = -1 - 2 = -3$.', 'Hole: $(-1, -3)$.'],
      check: { q: 'Where is the hole in $y = \\frac{(x - 4)(x + 5)}{x - 4}$?', options: ['$(4, 9)$', '$(4, 0)$', '$(-5, 0)$', '$(4, 1)$'], answer: 0, why: 'Cancel to $y = x + 5$. At $x = 4$: $4 + 5 = 9$.' },
    },
    {
      say: 'If the function is not factored, **factor** the top and bottom first. Then cancel and substitute.',
      example: ['$y = \\frac{x^2 - 4}{x^2 - x - 2}$', 'Factor: $\\frac{(x - 2)(x + 2)}{(x - 2)(x + 1)}$', 'Cancel: $\\frac{x + 2}{x + 1}$', 'At $x = 2$: $\\frac{4}{3}$. Hole: $\\left(2, \\frac{4}{3}\\right)$.'],
      check: { q: 'Where is the hole in $y = \\frac{x^2 - 9}{x - 3}$?', options: ['$(3, 6)$', '$(3, 0)$', '$(-3, 0)$', '$(3, 9)$'], answer: 0, why: '$x^2 - 9 = (x - 3)(x + 3)$. Cancel to $x + 3$. At $x = 3$: $6$.' },
    },
    {
      say: 'The hole $y$ can be a fraction, especially when an asymptote is still there.',
      example: ['$y = \\frac{x - 1}{(x - 1)(x + 2)}$', 'Cancel: $y = \\frac{1}{x + 2}$.', 'At $x = 1$: $y = \\frac{1}{1 + 2} = \\frac{1}{3}$.', 'Hole: $\\left(1, \\frac{1}{3}\\right)$.'],
      check: { q: 'Where is the hole in $y = \\frac{3(x + 2)}{(x + 2)(x - 4)}$?', options: ['$\\left(-2, -\\frac{1}{2}\\right)$', '$\\left(-2, \\frac{1}{2}\\right)$', '$\\left(4, -\\frac{1}{2}\\right)$', '$(-2, 0)$'], answer: 0, why: 'Cancel to $\\frac{3}{x - 4}$. At $x = -2$: $\\frac{3}{-6} = -\\frac{1}{2}$.' },
    },
    {
      say: 'The simplified function is the same as the original **everywhere except** at the hole. So it keeps the restriction, like $x \\ne 2$.',
      example: ['$\\frac{(x - 2)(x + 2)}{(x - 2)(x + 1)} = \\frac{x + 2}{x + 1}$, $x \\ne 2$'],
      check: { q: 'Is $y = \\frac{(x - 2)(x + 2)}{(x - 2)(x + 1)}$ the same as $y = \\frac{x + 2}{x + 1}$?', options: ['Yes, except at $x = 2$', 'Yes, at every $x$', 'No, never'], answer: 0, why: 'They match everywhere, but the first one has no value at $x = 2$.' },
    },
    {
      say: 'You can work **backward** from a hole. A hole at $(a, b)$ means $(x - a)$ is on top and bottom, and the simplified function equals $b$ at $x = a$.',
      example: ['$\\frac{x^2 + bx + c}{x - 2}$ is a line with a hole at $(2, 5)$.', 'Top must be $(x - 2)(x + m)$, which simplifies to $x + m$.', '$2 + m = 5$, so $m = 3$.', 'Top: $(x - 2)(x + 3) = x^2 + x - 6$.', 'So $b = 1$ and $c = -6$.'],
      check: { q: '$\\frac{x^2 + bx + c}{x - 1}$ is a line with a hole at $(1, 4)$. Find $b$ and $c$.', options: ['$b = 2$, $c = -3$', '$b = -2$, $c = -3$', '$b = 4$, $c = -3$', '$b = 3$, $c = 1$'], answer: 0, why: 'The line is $x + m$ with $1 + m = 4$, so $m = 3$. Then $(x - 1)(x + 3) = x^2 + 2x - 3$.' },
    },
  ],

  'RF14.sketch': [
    {
      say: 'Sketch in this order. Factor. Mark holes (open circles) and vertical asymptotes (dashed). Find the horizontal asymptote. Plot the intercepts.',
      check: { q: 'What do you do first to sketch a rational function?', options: ['Factor the top and bottom', 'Plot the $y$-intercept', 'Draw the curve', 'Find the range'], answer: 0, why: 'Every other feature comes from the factors.' },
    },
    {
      say: 'The zeros and vertical asymptotes cut the $x$-axis into **intervals**. In each interval, test one $x$-value to see if the graph is above or below the axis.',
      example: ['$y = \\frac{x}{(x - 2)(x + 2)}$: cut points $-2$, $0$, $2$.', 'Test $x = 3$: $\\frac{3}{(1)(5)} = \\frac{3}{5}$. Positive, so above.', 'Test $x = 1$: $\\frac{1}{(-1)(3)} = -\\frac{1}{3}$. Negative, so below.'],
      check: { q: 'For $y = \\frac{x}{(x - 2)(x + 2)}$, test $x = -1$. Is the graph above or below the axis there?', options: ['Above', 'Below', 'On the axis'], answer: 0, why: '$\\frac{-1}{(-3)(1)} = \\frac{-1}{-3} = \\frac{1}{3}$, which is positive.' },
    },
    {
      say: 'Next to a vertical asymptote, the graph shoots up or down. Test an $x$ very close to it. The sign tells you which way.',
      example: ['$y = \\frac{x}{(x - 2)(x + 2)}$ near $x = 2$.', 'Test $x = 2.01$: $\\frac{2.01}{(0.01)(4.01)} \\approx 50$.', 'Large positive, so just right of 2 the graph goes **up**.'],
      check: { q: 'For the same function, test $x = 1.99$, just left of 2. Which way does the graph go?', options: ['Down (large negative)', 'Up (large positive)', 'Close to 0'], answer: 0, why: '$\\frac{1.99}{(-0.01)(3.99)} \\approx -50$, which is large negative.' },
    },
    {
      say: 'A bottom factor to an **odd** power, like $(x - 1)$, flips sign across the asymptote: one side up, the other down. An **even** power, like $(x - 1)^2$, keeps the same sign on both sides.',
      example: ['$y = \\frac{1}{x - 1}$: down on the left, up on the right.', '$y = \\frac{1}{(x - 1)^2}$: up on both sides.'],
      check: { q: 'Near $x = -3$, how does $y = \\frac{-1}{(x + 3)^2}$ behave?', options: ['Down on both sides', 'Up on both sides', 'Up on the left, down on the right', 'Down on the left, up on the right'], answer: 0, why: 'The square is always positive and the top is $-1$, so $y$ is negative on both sides.' },
    },
    {
      say: 'At an $x$-intercept from a single top factor, the graph **crosses** the $x$-axis. It changes from above to below, or below to above.',
      example: ['$y = \\frac{x - 1}{x + 2}$ has $x$-intercept $1$.', '$x = 0$: $\\frac{-1}{2}$, below.', '$x = 2$: $\\frac{1}{4}$, above.', 'So it crosses at $x = 1$.'],
      check: { q: 'What does $y = \\frac{x - 4}{x + 1}$ do at $x = 4$?', options: ['Crosses the $x$-axis', 'Touches the axis and turns back', 'Has a hole', 'Has a vertical asymptote'], answer: 0, why: '$(x - 4)$ is a single top factor that does not cancel, so the graph crosses there.' },
    },
    {
      say: 'Last, join the points with smooth curves. Each curve bends toward the asymptotes. It never touches a vertical asymptote.',
      check: { q: 'Can the curve cross a vertical asymptote?', options: ['No', 'Yes', 'Yes, but only at a hole'], answer: 0, why: 'At a vertical asymptote the function has no value, so the graph cannot be there.' },
    },
    {
      say: 'Put it all together by listing every feature before you draw.',
      example: ['$y = \\frac{2(x - 1)}{x + 2}$', 'Vertical asymptote $x = -2$. No hole.', 'Horizontal asymptote $y = \\frac{2}{1} = 2$.', '$x$-intercept $1$.', '$y$-intercept $\\frac{2(-1)}{2} = -1$.'],
      check: { q: 'Which features belong to $y = \\frac{x + 3}{x - 1}$?', options: ['VA $x = 1$, HA $y = 1$, $x$-int $-3$, $y$-int $-3$', 'VA $x = -1$, HA $y = 1$, $x$-int $3$, $y$-int $-3$', 'VA $x = 1$, HA $y = 0$, $x$-int $-3$, $y$-int $3$', 'VA $x = 1$, HA $y = 3$, $x$-int $-3$, $y$-int $-3$'], answer: 0, why: 'Bottom zero at $1$. Equal degrees: $\\frac{1}{1} = 1$. Top zero at $-3$. At $x = 0$: $\\frac{3}{-1} = -3$.' },
    },
    {
      say: 'To match a graph to an equation, look for features that differ between the choices: a hole or an asymptote, the horizontal asymptote, the $y$-intercept.',
      example: ['Graph: open circle at $x = 1$, dashed line at $x = -2$.', '$\\frac{x - 1}{(x - 1)(x + 2)}$ has a hole at 1. It fits.', '$\\frac{1}{(x - 1)(x + 2)}$ has an asymptote at 1. It does not fit.'],
      check: { q: 'A graph has horizontal asymptote $y = 2$, vertical asymptote $x = 3$ and no holes. Which equation fits?', options: ['$y = \\frac{2x}{x - 3}$', '$y = \\frac{x}{x - 3}$', '$y = \\frac{2}{x - 3}$', '$y = \\frac{2x}{x + 3}$'], answer: 0, why: 'Equal degrees with $\\frac{2}{1} = 2$, and the bottom is zero at $x = 3$.' },
    },
  ],

  'RF14.equation-from-graph': [
    {
      say: 'Each feature of the graph tells you one piece of the equation. A vertical asymptote at $x = a$ means $(x - a)$ goes in the **bottom only**.',
      example: ['Vertical asymptote $x = 2$.', 'Bottom factor: $(x - 2)$.'],
      check: { q: 'A graph has a vertical asymptote at $x = -4$. Which factor goes in the bottom?', options: ['$(x + 4)$', '$(x - 4)$', '$(x + 4)$ on top and bottom'], answer: 0, why: '$x + 4 = 0$ when $x = -4$.' },
    },
    {
      say: 'An $x$-intercept at $b$ means $(x - b)$ goes in the **top only**.',
      example: ['$x$-intercept at $3$.', 'Top factor: $(x - 3)$.'],
      check: { q: 'A graph has an $x$-intercept at $-2$. Which factor goes in the top?', options: ['$(x + 2)$', '$(x - 2)$', '$(x + 2)$ in the bottom'], answer: 0, why: '$x + 2 = 0$ when $x = -2$.' },
    },
    {
      say: 'A hole at $x = a$ means $(x - a)$ goes in the top **and** the bottom.',
      example: ['Hole at $x = 4$.', 'Put $(x - 4)$ on top and on the bottom: $\\frac{(x - 4)}{(x - 4)}$.'],
      check: { q: 'A graph has a hole at $x = 1$. Where does $(x - 1)$ go?', options: ['Top and bottom', 'Bottom only', 'Top only'], answer: 0, why: 'A factor that cancels makes a hole.' },
    },
    {
      say: 'Horizontal asymptote $y = 0$ means the bottom degree is **bigger**. Often the top is just a number $k$.',
      example: ['Vertical asymptotes $x = -1$ and $x = 2$, $x$-intercept $3$, asymptote $y = 0$.', '$y = \\frac{x - 3}{(x + 1)(x - 2)}$', 'Top degree 1, bottom degree 2, so $y = 0$ works.'],
      check: { q: 'Which function has horizontal asymptote $y = 0$?', options: ['$y = \\frac{5}{x - 1}$', '$y = \\frac{5x}{x - 1}$', '$y = \\frac{x^2}{x - 1}$'], answer: 0, why: 'The top has degree 0 and the bottom has degree 1.' },
    },
    {
      say: 'Horizontal asymptote $y = c$ (not 0) means **equal** degrees. Put $c$ in front of the top so the leading numbers divide to $c$.',
      example: ['Vertical asymptote $x = 1$, $x$-intercept $-2$, asymptote $y = 3$.', 'Top: $3(x + 2)$. Bottom: $(x - 1)$.', '$y = \\frac{3(x + 2)}{x - 1}$', 'Check: $\\frac{3}{1} = 3$.'],
      check: { q: 'Vertical asymptote $x = 4$, $x$-intercept $1$, horizontal asymptote $y = -2$. Which equation fits?', options: ['$y = \\frac{-2(x - 1)}{x - 4}$', '$y = \\frac{-2(x + 1)}{x + 4}$', '$y = \\frac{2(x - 1)}{x - 4}$', '$y = \\frac{-2(x - 4)}{x - 1}$'], answer: 0, why: '$(x - 1)$ on top for the intercept, $(x - 4)$ on the bottom for the asymptote, and $-2$ in front.' },
    },
    {
      say: 'If a number $k$ is still unknown, use one more point, often the $y$-intercept. Substitute it and solve for $k$.',
      example: ['$y = \\frac{k}{x - 3}$ with $y$-intercept $2$.', 'Put in $(0, 2)$: $2 = \\frac{k}{0 - 3}$.', '$2 = \\frac{k}{-3}$', '$k = -6$'],
      check: { q: '$y = \\frac{k}{x + 2}$ has $y$-intercept $3$. What is $k$?', options: ['$6$', '$-6$', '$\\frac{3}{2}$', '$5$'], answer: 0, why: '$3 = \\frac{k}{0 + 2}$, so $k = 3 \\times 2 = 6$.' },
    },
    {
      say: 'Put all the pieces together. Each feature adds one factor or number.',
      example: ['Vertical asymptote $x = 1$, $x$-intercept $-2$, asymptote $y = 3$, hole at $x = 4$.', 'Top: $3(x + 2)(x - 4)$.', 'Bottom: $(x - 1)(x - 4)$.', '$y = \\frac{3(x + 2)(x - 4)}{(x - 1)(x - 4)}$'],
      check: { q: 'Vertical asymptote $x = -3$, $x$-intercept $2$, asymptote $y = 1$, hole at $x = 1$. Which equation fits?', options: ['$y = \\frac{(x - 2)(x - 1)}{(x + 3)(x - 1)}$', '$y = \\frac{(x + 2)(x + 1)}{(x - 3)(x + 1)}$', '$y = \\frac{x - 2}{(x + 3)(x - 1)}$', '$y = \\frac{(x - 2)(x - 1)}{x + 3}$'], answer: 0, why: '$(x - 2)$ on top, $(x + 3)$ on the bottom, $(x - 1)$ on both, and equal degrees give $y = 1$.' },
    },
  ],

  'RF14.solve': [
    {
      say: 'To solve a **rational equation** algebraically, first factor every bottom and write the non-permissible values. Any answer equal to one of them must be thrown out later.',
      example: ['$\\frac{6}{x - 1} = x$', 'Bottom zero at $x = 1$.', 'Write $x \\ne 1$.'],
      check: { q: 'What is the non-permissible value for $\\frac{5}{x + 3} = x$?', options: ['$-3$', '$3$', '$0$', '$5$'], answer: 0, why: '$x + 3 = 0$ when $x = -3$.' },
    },
    {
      say: 'Next, multiply both sides by the **lowest common denominator**. This clears the fractions and leaves a polynomial equation.',
      example: ['$\\frac{6}{x - 1} = x$', 'Multiply both sides by $(x - 1)$.', '$6 = x(x - 1)$'],
      check: { q: 'Multiply $\\frac{4}{x + 2} = x$ by $(x + 2)$. What do you get?', options: ['$4 = x(x + 2)$', '$4 = x + 2x$', '$4(x + 2) = x$', '$4 = x^2 + 2$'], answer: 0, why: 'The left side loses its bottom. The right side $x$ is multiplied by the whole $(x + 2)$.' },
    },
    {
      say: 'Solve the polynomial. Then compare each answer with the non-permissible values.',
      example: ['$6 = x(x - 1)$', '$0 = x^2 - x - 6$', '$0 = (x - 3)(x + 2)$', '$x = 3$ or $x = -2$. Neither is $1$, so both work.'],
      check: { q: '$3 = x(x - 2)$ gives $x^2 - 2x - 3 = 0$. What are the roots?', options: ['$3$ and $-1$', '$-3$ and $1$', '$3$ and $1$', '$2$ and $3$'], answer: 0, why: '$x^2 - 2x - 3 = (x - 3)(x + 1)$, which is zero at $3$ and $-1$.' },
    },
    {
      say: 'An answer that equals a non-permissible value is **extraneous**: it came from clearing the fractions and must be rejected. Sometimes nothing is left.',
      example: ['$\\frac{x}{x - 2} = \\frac{2}{x - 2} + 3$, with $x \\ne 2$.', 'Multiply by $(x - 2)$: $x = 2 + 3(x - 2)$.', '$x = 3x - 4$, so $-2x = -4$.', '$x = 2$, which is not allowed.', 'No solution.'],
      check: { q: 'Solving gives $x = 4$ and $x = -1$, but $x = 4$ is non-permissible. What is the solution?', options: ['$x = -1$ only', '$x = 4$ and $x = -1$', '$x = 4$ only', 'No solution'], answer: 0, why: '$x = 4$ makes a bottom zero, so it is rejected. $x = -1$ stays.' },
    },
    {
      say: 'To solve **graphically**, enter the left side as $Y_1$ and the right side as $Y_2$. The $x$-coordinates of the crossing points are the solutions.',
      example: ['$\\frac{2}{x - 1} = x$', '$Y_1 = \\frac{2}{x - 1}$ and $Y_2 = x$.', 'They cross at $x = -1$ and $x = 2$.', 'Check: $\\frac{2}{-2} = -1$ and $\\frac{2}{1} = 2$.'],
      check: { q: 'When you graph each side, which part of a crossing point is a solution?', options: ['The $x$-coordinate', 'The $y$-coordinate', 'Both coordinates added'], answer: 0, why: 'The solution is the $x$-value where both sides are equal.' },
    },
    {
      say: 'Another way: move everything to one side to get the **related function** $y = \\text{left} - \\text{right}$. Its $x$-intercepts are the solutions.',
      example: ['$\\frac{6}{x - 1} = x + 2$', 'Subtract the whole right side.', 'Related function: $y = \\frac{6}{x - 1} - x - 2$.'],
      check: { q: 'The solutions of $\\frac{4}{x + 3} = x - 1$ are the $x$-intercepts of which function?', options: ['$y = \\frac{4}{x + 3} - x + 1$', '$y = \\frac{4}{x + 3} + x - 1$', '$y = \\frac{4}{x + 3}$', '$y = x + 3$'], answer: 0, why: 'Subtract $(x - 1)$: $-(x - 1) = -x + 1$.' },
    },
    {
      say: 'On the related graph, an extraneous root shows up as a **hole** or an asymptote, not as an $x$-intercept.',
      example: ['$\\frac{x}{x - 2} - \\frac{2}{x - 2} - 3$', '$= \\frac{x - 2}{x - 2} - 3 = 1 - 3 = -2$, with $x \\ne 2$.', 'The graph is the line $y = -2$ with a hole at $(2, -2)$.', 'It never meets the $x$-axis: no solution.'],
      check: { q: 'Algebra gives $x = 1$ and $x = 5$. The related graph has a hole at $x = 1$. What is the solution?', options: ['$x = 5$ only', '$x = 1$ and $x = 5$', '$x = 1$ only', 'No solution'], answer: 0, why: 'A hole is not an $x$-intercept, so $x = 1$ is extraneous.' },
    },
    {
      say: 'Graph answers are often decimals. Round them as the question asks, usually to the nearest **hundredth** (two decimal places).',
      example: ['$x \\approx 2.4142$ rounds to $2.41$.', '$x \\approx -0.4142$ rounds to $-0.41$.'],
      check: { q: 'Round $3.236$ to the nearest hundredth.', options: ['$3.24$', '$3.23$', '$3.2$', '$3.236$'], answer: 0, why: 'The third decimal is 6, so the 3 rounds up to 4.' },
    },
  ],
};
