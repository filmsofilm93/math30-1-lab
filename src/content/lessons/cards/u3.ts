import type { LessonCard } from '../types';

/** Lesson cards in plain words, one small idea per card. Keyed by skill node id. */
export const CARDS: Record<string, LessonCard[]> = {
  'RF9.exp-graph': [
    {
      say: 'An **exponential function** looks like $y = b^x$. The $x$ is up in the exponent. The **base** $b$ is a positive number that is not $1$.',
      example: ['$y = 2^x$', 'At $x = 3$: $y = 2^3 = 8$.', 'At $x = 4$: $y = 2^4 = 16$.', 'Each step right doubles $y$.'],
      check: { q: 'Which one is an exponential function?', options: ['$y = 3^x$', '$y = x^3$', '$y = 3x$', '$y = 1^x$'], answer: 0, why: 'The $x$ is in the exponent, and the base $3$ is positive and not $1$.' },
    },
    {
      say: 'If the base is **bigger than 1**, the graph rises from left to right. This is called **growth**.',
      example: ['$y = 3^x$', '$x = 0$: $y = 3^0 = 1$.', '$x = 1$: $y = 3^1 = 3$.', '$x = 2$: $y = 3^2 = 9$.', 'The $y$-values get bigger: growth.'],
      check: { q: 'Is $y = 5^x$ growth or decay?', options: ['Growth', 'Decay', 'Neither'], answer: 0, why: 'The base $5$ is bigger than $1$, so the graph rises.' },
    },
    {
      say: 'If the base is **between 0 and 1**, the graph falls from left to right. This is called **decay**.',
      example: ['$y = \\left(\\frac{1}{2}\\right)^x$', '$x = 0$: $y = 1$.', '$x = 1$: $y = \\frac{1}{2}$.', '$x = 2$: $y = \\frac{1}{4}$.', 'The $y$-values get smaller: decay.'],
      check: { q: 'Which one shows decay?', options: ['$y = \\left(\\frac{2}{3}\\right)^x$', '$y = 4^x$', '$y = \\left(\\frac{3}{2}\\right)^x$', '$y = 10^x$'], answer: 0, why: 'Only $\\frac{2}{3}$ is between $0$ and $1$.' },
    },
    {
      say: 'Flipping the base to $\\frac{1}{b}$ is the same as a negative exponent: $\\left(\\frac{1}{b}\\right)^x = b^{-x}$. Its graph is $y = b^x$ **reflected in the $y$-axis**. Growth turns into decay.',
      example: ['$\\left(\\frac{1}{2}\\right)^x = \\frac{1}{2^x} = 2^{-x}$', 'So $y = \\left(\\frac{1}{2}\\right)^x$ is $y = 2^x$ flipped left to right.', 'The point $(1, 2)$ on $y = 2^x$ becomes $(-1, 2)$.'],
      check: { q: 'Is $y = 3^{-x}$ growth or decay?', options: ['Decay', 'Growth', 'Neither'], answer: 0, why: '$3^{-x} = \\left(\\frac{1}{3}\\right)^x$, and $\\frac{1}{3}$ is between $0$ and $1$.' },
    },
    {
      say: 'Every graph $y = b^x$ passes through $(0, 1)$, because $b^0 = 1$. It also passes through $(1, b)$, because $b^1 = b$.',
      example: ['$y = 5^x$', '$x = 0$: $5^0 = 1$, so $(0, 1)$.', '$x = 1$: $5^1 = 5$, so $(1, 5)$.'],
      check: { q: 'What is the $y$-intercept of $y = 7^x$?', options: ['$(0, 1)$', '$(0, 7)$', '$(0, 0)$', '$(1, 0)$'], answer: 0, why: 'At $x = 0$, $7^0 = 1$.' },
    },
    {
      say: 'A positive base to any power is always positive. So the graph gets closer and closer to the $x$-axis but never touches it. The line $y = 0$ is a **horizontal asymptote**: a line the graph approaches but never reaches.',
      example: ['$y = 2^x$', '$x = -1$: $y = \\frac{1}{2}$.', '$x = -2$: $y = \\frac{1}{4}$.', '$x = -10$: $y = \\frac{1}{1024}$.', 'Always above $0$, so there is no $x$-intercept.'],
      check: { q: 'What is the asymptote of $y = 4^x$?', options: ['$y = 0$', '$x = 0$', '$y = 1$', '$y = 4$'], answer: 0, why: 'The graph gets close to the $x$-axis, $y = 0$, but never reaches it.' },
    },
    {
      say: 'The **domain** is the $x$-values you may use: all real numbers. The **range** is the $y$-values you get: only $y > 0$.',
      example: ['$y = 3^x$', 'Any $x$ works, even $x = -5$ or $x = 0.5$.', 'Every answer is positive, but never $0$.', 'Domain: all real numbers. Range: $y > 0$.'],
      check: { q: 'What is the range of $y = 3^x$?', options: ['$y > 0$', '$y \\ge 0$', 'All real numbers', '$y > 1$'], answer: 0, why: 'The $y$-values are always positive and never reach $0$, so $0$ is not included.' },
    },
    {
      say: 'To find $b$ from a point, put the point into $y = b^x$. Then write the $y$-value as a power with the same exponent.',
      example: ['The graph of $y = b^x$ passes through $(3, 64)$.', '$b^3 = 64$', '$64 = 4^3$', 'So $b = 4$.'],
      check: { q: 'The graph of $y = b^x$ passes through $(2, 49)$. What is $b$?', options: ['$7$', '$49$', '$24.5$', '$2$'], answer: 0, why: '$b^2 = 49$ and $7^2 = 49$, so $b = 7$.' },
    },
    {
      say: 'Some points have a negative or fraction exponent. A negative exponent means a fraction: $b^{-2} = \\frac{1}{b^2}$. An exponent of $\\frac{1}{2}$ means a square root: $b^{\\frac{1}{2}} = \\sqrt{b}$.',
      example: ['Point $\\left(-2, \\frac{1}{9}\\right)$.', '$b^{-2} = \\frac{1}{9}$', '$\\frac{1}{9} = \\frac{1}{3^2} = 3^{-2}$', 'So $b = 3$.'],
      check: { q: 'The graph of $y = b^x$ passes through $\\left(\\frac{1}{2}, 4\\right)$. What is $b$?', options: ['$16$', '$2$', '$8$', '$\\frac{1}{2}$'], answer: 0, why: '$b^{\\frac{1}{2}} = \\sqrt{b} = 4$, so $b = 4^2 = 16$.' },
    },
  ],

  'RF9.exp-transform': [
    {
      say: 'A changed exponential looks like $y = a \\cdot b^{x - c} + d$. These are the same moves as Unit 1: $a$ stretches or flips, $c$ moves left or right, $d$ moves up or down.',
      example: ['$y = 2 \\cdot 3^{x - 1} + 4$', '$a = 2$ and $b = 3$.', '$c = 1$ and $d = 4$.'],
      check: { q: 'In $y = 5 \\cdot 2^{x + 3} - 1$, what is $c$?', options: ['$-3$', '$3$', '$-1$', '$5$'], answer: 0, why: '$x + 3 = x - (-3)$, so $c = -3$.' },
    },
    {
      say: 'The number $d$ **added at the end** moves the graph **up or down**. Plus means up. Minus means down.',
      example: ['$y = 2^x + 5$', 'The $+5$ is outside the power.', 'So the graph moves **up 5**.'],
      check: { q: 'Which way does $y = 3^x - 4$ move compared with $y = 3^x$?', options: ['Down 4', 'Up 4', 'Left 4', 'Right 4'], answer: 0, why: 'The $-4$ is added at the end, so the graph moves down 4.' },
    },
    {
      say: 'The number $c$ **inside the exponent** moves the graph **left or right**, and it reads backwards. $x - 3$ means right 3. $x + 2$ means left 2.',
      example: ['$y = 2^{x - 3}$', 'The exponent is $x - 3$.', 'So the graph moves **right 3**.'],
      check: { q: 'Which way does $y = 2^{x + 5}$ move compared with $y = 2^x$?', options: ['Left 5', 'Right 5', 'Up 5', 'Down 5'], answer: 0, why: 'Inside the exponent, $+5$ reads backwards: left 5.' },
    },
    {
      say: 'The number $a$ in front multiplies every $y$-value. This is a **vertical stretch** by $|a|$. If $a$ is negative, the graph also **reflects in the $x$-axis** (flips upside down).',
      example: ['$y = -2(3)^x$', 'The point $(1, 3)$ is on $y = 3^x$.', 'New $y$: $-2 \\times 3 = -6$.', 'New point: $(1, -6)$.'],
      check: { q: 'The point $(0, 1)$ is on $y = 4^x$. Where does it go on $y = 3(4)^x$?', options: ['$(0, 3)$', '$(0, 1)$', '$(3, 1)$', '$(0, 4)$'], answer: 0, why: 'Multiply the $y$-value by $3$: $3 \\times 1 = 3$. The $x$-value stays.' },
    },
    {
      say: 'To move one **point**, use the rule $(x, y) \\to (x + c,\\ ay + d)$. Add $c$ to $x$. Multiply $y$ by $a$, then add $d$.',
      example: ['Point $(1, 2)$ on $y = 2^x$. New graph: $y = 3(2)^{x - 4} + 1$.', '$c = 4$, $a = 3$, $d = 1$.', 'New $x$: $1 + 4 = 5$.', 'New $y$: $3(2) + 1 = 7$.', 'New point: $(5, 7)$.'],
      check: { q: 'The point $(0, 1)$ is on $y = 2^x$. Where does it go on $y = 2^{x + 1} - 3$?', options: ['$(-1, -2)$', '$(1, -2)$', '$(-1, 4)$', '$(1, 4)$'], answer: 0, why: 'Here $c = -1$ and $d = -3$. New $x$: $0 - 1 = -1$. New $y$: $1 - 3 = -2$.' },
    },
    {
      say: 'Only $d$ moves the asymptote. It moves from $y = 0$ to $y = d$. Left and right moves slide along the line, and stretches keep $y = 0$ where it is.',
      example: ['$y = 5(2)^{x - 3} - 6$', 'Start: asymptote $y = 0$.', 'The $5$ and the $-3$ do not move it.', 'The $-6$ moves it down: $y = -6$.'],
      check: { q: 'What is the asymptote of $y = -3(2)^{x + 4} + 7$?', options: ['$y = 7$', '$y = 0$', '$x = -4$', '$y = -7$'], answer: 0, why: 'Only $d = 7$ moves the asymptote, so it is $y = 7$.' },
    },
    {
      say: 'The **range** depends on the asymptote $y = d$. If $a > 0$, the graph is above it: $y > d$. If $a < 0$, the graph is flipped below it: $y < d$. The domain stays all real numbers.',
      example: ['$y = -2(3)^x + 5$', 'Asymptote: $y = 5$.', '$a = -2$ is negative, so the graph is below.', 'Range: $y < 5$.'],
      check: { q: 'What is the range of $y = 4(2)^{x - 1} - 3$?', options: ['$y > -3$', '$y < -3$', '$y > 3$', '$y > 0$'], answer: 0, why: 'The asymptote is $y = -3$, and $a = 4$ is positive, so the graph is above it.' },
    },
    {
      say: 'To sketch, move two key points of $y = b^x$: $(0, 1)$ and $(1, b)$. Draw the new asymptote $y = d$. Then draw the curve through the points, bending toward the asymptote.',
      example: ['$y = -(2)^{x - 1} + 3$, so $a = -1$, $c = 1$, $d = 3$.', '$(0, 1) \\to (0 + 1,\\ -1 + 3) = (1, 2)$', '$(1, 2) \\to (1 + 1,\\ -2 + 3) = (2, 1)$', 'Asymptote $y = 3$. The graph is below it.'],
      check: { q: 'The point $(1, 3)$ is on $y = 3^x$. Where does it go on $y = 2(3)^{x + 2} - 1$?', options: ['$(-1, 5)$', '$(3, 5)$', '$(-1, 7)$', '$(3, 7)$'], answer: 0, why: 'New $x$: $1 - 2 = -1$. New $y$: $2(3) - 1 = 5$.' },
    },
  ],

  'RF7.log-def': [
    {
      say: 'A **logarithm** is an exponent. $\\log_b x$ asks: "$b$ to what power gives $x$?"',
      example: ['$\\log_2 8$ asks: $2$ to what power gives $8$?', '$2^3 = 8$', 'So $\\log_2 8 = 3$.'],
      check: { q: 'What is $\\log_3 9$?', options: ['$2$', '$3$', '$6$', '$27$'], answer: 0, why: '$3^2 = 9$, so the exponent is $2$.' },
    },
    {
      say: '$\\log_b x = y$ and $b^y = x$ say the same thing. The base of the log is the base of the power. The answer of the log is the exponent. Changing a log to a power is called **exponential form**.',
      example: ['$\\log_5 25 = 2$', 'Base: $5$. Exponent: $2$.', 'Exponential form: $5^2 = 25$.'],
      check: { q: 'Which means the same as $\\log_4 64 = 3$?', options: ['$4^3 = 64$', '$64^3 = 4$', '$3^4 = 64$', '$4^{64} = 3$'], answer: 0, why: 'The base $4$ stays the base, and the log answer $3$ is the exponent.' },
    },
    {
      say: 'You can go the other way too. In a power, the exponent is what the log equals. Changing a power to a log is called **logarithmic form**.',
      example: ['$2^5 = 32$', 'Base: $2$. Exponent: $5$.', 'Logarithmic form: $\\log_2 32 = 5$.'],
      check: { q: 'Write $3^4 = 81$ in logarithmic form.', options: ['$\\log_3 81 = 4$', '$\\log_4 81 = 3$', '$\\log_{81} 3 = 4$', '$\\log_3 4 = 81$'], answer: 0, why: 'The base $3$ stays the base. The log equals the exponent $4$.' },
    },
    {
      say: 'When no base is written, $\\log x$ means base $10$. This is called the **common logarithm**.',
      example: ['$\\log 100$ means $\\log_{10} 100$.', '$10^2 = 100$', 'So $\\log 100 = 2$.'],
      check: { q: 'What is $\\log 1000$?', options: ['$3$', '$100$', '$10$', '$2$'], answer: 0, why: '$\\log 1000$ is base $10$, and $10^3 = 1000$.' },
    },
    {
      say: 'There are rules. The base must be positive and not $1$. The number inside the log, called the **argument**, must be positive.',
      example: ['$\\log_2 8$ is fine.', '$\\log_2(-8)$ is not allowed: no power of $2$ is negative.', '$\\log_1 5$ is not allowed: $1$ to any power is $1$.'],
      check: { q: 'Which one is not allowed?', options: ['$\\log_2(-8)$', '$\\log_2 8$', '$\\log_8 2$', '$\\log 0.1$'], answer: 0, why: 'The argument $-8$ is negative, and only positive numbers have logs.' },
    },
    {
      say: 'To solve for an unknown, rewrite the log in exponential form first. If $x$ is the unknown argument, you just work out the power.',
      example: ['$\\log_3 x = 4$', 'Exponential form: $x = 3^4$.', '$3^4 = 3 \\times 3 \\times 3 \\times 3 = 81$', '$x = 81$'],
      check: { q: 'Solve $\\log_2 x = -3$.', options: ['$\\frac{1}{8}$', '$-8$', '$-6$', '$8$'], answer: 0, why: '$x = 2^{-3} = \\frac{1}{2^3} = \\frac{1}{8}$.' },
    },
    {
      say: 'If the base is the unknown, exponential form gives a power to undo. Take the matching root. The base must be positive, so use the positive root.',
      example: ['$\\log_b 49 = 2$', 'Exponential form: $b^2 = 49$.', '$b = \\sqrt{49} = 7$'],
      check: { q: 'Solve $\\log_b 125 = 3$.', options: ['$5$', '$\\frac{125}{3}$', '$25$', '$122$'], answer: 0, why: '$b^3 = 125$, and $5^3 = 125$, so $b = 5$.' },
    },
    {
      say: 'If the log answer is the unknown, exponential form asks for an exponent. Write the number as a power of the base.',
      example: ['$\\log_4 16 = y$', 'Exponential form: $4^y = 16$.', '$16 = 4^2$', 'So $y = 2$.'],
      check: { q: 'Solve $\\log_2 16 = y$.', options: ['$4$', '$8$', '$32$', '$14$'], answer: 0, why: '$2^y = 16$ and $2^4 = 16$, so $y = 4$.' },
    },
    {
      say: '$y = \\log_b x$ is the **inverse** of $y = b^x$: it undoes it. Swap $x$ and $y$ in every point. The graph is the mirror image in the line $y = x$.',
      example: ['$(3, 8)$ is on $y = 2^x$, since $2^3 = 8$.', 'Swap: $(8, 3)$.', '$(8, 3)$ is on $y = \\log_2 x$, since $\\log_2 8 = 3$.'],
      check: { q: '$(2, 9)$ is on $y = 3^x$. Which point is on $y = \\log_3 x$?', options: ['$(9, 2)$', '$(2, 9)$', '$(-2, 9)$', '$(9, -2)$'], answer: 0, why: 'The inverse swaps $x$ and $y$: $(9, 2)$. Check: $\\log_3 9 = 2$.' },
    },
  ],

  'RF7.log-eval': [
    {
      say: 'To find a log without a calculator, write the number as a power of the base. The exponent is the answer.',
      example: ['$\\log_3 81$', '$81 = 3^4$', 'So $\\log_3 81 = 4$.'],
      check: { q: 'What is $\\log_2 32$?', options: ['$5$', '$16$', '$4$', '$6$'], answer: 0, why: '$32 = 2^5$, so the answer is $5$.' },
    },
    {
      say: 'Two values come up all the time. $\\log_b 1 = 0$, because $b^0 = 1$. $\\log_b b = 1$, because $b^1 = b$.',
      example: ['$\\log_5 1 = 0$, since $5^0 = 1$.', '$\\log_5 5 = 1$, since $5^1 = 5$.'],
      check: { q: 'What is $\\log_7 1$?', options: ['$0$', '$1$', '$7$', '$-1$'], answer: 0, why: '$7^0 = 1$, so the exponent is $0$.' },
    },
    {
      say: 'A fraction like $\\frac{1}{8}$ means a **negative exponent**: $\\frac{1}{b^n} = b^{-n}$. So logs of fractions are often negative.',
      example: ['$\\log_2 \\frac{1}{8}$', '$\\frac{1}{8} = \\frac{1}{2^3} = 2^{-3}$', 'So $\\log_2 \\frac{1}{8} = -3$.'],
      check: { q: 'What is $\\log_3 \\frac{1}{9}$?', options: ['$-2$', '$2$', '$\\frac{1}{2}$', '$-3$'], answer: 0, why: '$\\frac{1}{9} = \\frac{1}{3^2} = 3^{-2}$.' },
    },
    {
      say: 'A root means a **fraction exponent**. A square root is the power $\\frac{1}{2}$. A cube root is the power $\\frac{1}{3}$.',
      example: ['$\\log_3 \\sqrt{3}$', '$\\sqrt{3} = 3^{\\frac{1}{2}}$', 'So $\\log_3 \\sqrt{3} = \\frac{1}{2}$.'],
      check: { q: 'What is $\\log_2 \\sqrt[3]{2}$?', options: ['$\\frac{1}{3}$', '$3$', '$\\frac{2}{3}$', '$-3$'], answer: 0, why: '$\\sqrt[3]{2} = 2^{\\frac{1}{3}}$.' },
    },
    {
      say: 'Sometimes the number is not a power of the base, but both are powers of a smaller number. Write both with that number, then set the exponents equal.',
      example: ['$\\log_8 4 = y$ means $8^y = 4$.', '$8 = 2^3$ and $4 = 2^2$.', '$(2^3)^y = 2^2$, so $2^{3y} = 2^2$.', '$3y = 2$', '$y = \\frac{2}{3}$'],
      check: { q: 'What is $\\log_9 27$?', options: ['$\\frac{3}{2}$', '$\\frac{2}{3}$', '$3$', '$18$'], answer: 0, why: '$9 = 3^2$ and $27 = 3^3$. So $2y = 3$ and $y = \\frac{3}{2}$.' },
    },
    {
      say: 'For an expression with several logs, find each log by itself. Then add or subtract, watching the signs.',
      example: ['$\\log_2 8 + \\log_3 9 - \\log_5 1$', '$\\log_2 8 = 3$, $\\log_3 9 = 2$, $\\log_5 1 = 0$', '$3 + 2 - 0 = 5$'],
      check: { q: 'What is $\\log 1000 + \\log_2 \\frac{1}{2}$?', options: ['$2$', '$4$', '$3$', '$1$'], answer: 0, why: '$\\log 1000 = 3$ and $\\log_2 \\frac{1}{2} = -1$. $3 + (-1) = 2$.' },
    },
    {
      say: 'To **estimate** a log, find the powers of the base just below and just above the number. The log is between those two exponents.',
      example: ['$\\log_2 50$', '$2^5 = 32$ and $2^6 = 64$.', '$32 < 50 < 64$', 'So $\\log_2 50$ is between $5$ and $6$.'],
      check: { q: '$\\log_3 50$ is between which two whole numbers?', options: ['$3$ and $4$', '$2$ and $3$', '$4$ and $5$', '$16$ and $17$'], answer: 0, why: '$3^3 = 27$ and $3^4 = 81$, and $50$ is between them.' },
    },
    {
      say: 'Only **positive** numbers have logs. $\\log_2 0$ and $\\log_2(-4)$ do not exist, because $2^y$ is always positive.',
      example: ['$\\log_2 0$: no power of $2$ gives $0$.', '$\\log_2(-4)$: no power of $2$ gives $-4$.', 'Both are **undefined**.'],
      check: { q: 'Which one has a value?', options: ['$\\log_2 \\frac{1}{4}$', '$\\log_2 0$', '$\\log_2(-4)$'], answer: 0, why: '$\\frac{1}{4}$ is positive, and $\\log_2 \\frac{1}{4} = -2$. A negative answer is fine; a negative argument is not.' },
    },
  ],

  'RF9.log-graph': [
    {
      say: 'The graph of $y = \\log_b x$ (with $b > 1$) rises from left to right. It passes through $(1, 0)$ and $(b, 1)$.',
      example: ['$y = \\log_2 x$', '$x = 1$: $y = 0$, so $(1, 0)$.', '$x = 2$: $y = 1$, so $(2, 1)$.', '$x = 4$: $y = 2$, so $(4, 2)$.'],
      check: { q: 'Which point is on $y = \\log_3 x$?', options: ['$(3, 1)$', '$(1, 3)$', '$(0, 1)$', '$(3, 0)$'], answer: 0, why: '$\\log_3 3 = 1$, so $(3, 1)$ is on the graph.' },
    },
    {
      say: 'The graph hugs the $y$-axis but never touches it. So $x = 0$ is a **vertical asymptote**. Domain: $x > 0$. Range: all real numbers. These are the domain and range of $y = b^x$, swapped.',
      example: ['$y = \\log_2 x$', '$x$ must be positive, so domain $x > 0$.', '$y$ can be any number, so range is all real numbers.', 'Asymptote: $x = 0$.'],
      check: { q: 'What is the domain of $y = \\log_5 x$?', options: ['$x > 0$', '$x \\ge 0$', 'All real numbers', '$x > 1$'], answer: 0, why: 'Only positive numbers have logs, and $0$ is not positive.' },
    },
    {
      say: 'In $y = \\log_b(x - c)$, the $c$ moves the graph left or right. The asymptote moves to $x = c$, and the domain becomes $x > c$.',
      example: ['$y = \\log_2(x - 3)$', 'Right 3.', 'Asymptote: $x = 3$.', 'Domain: $x > 3$.'],
      check: { q: 'What is the asymptote of $y = \\log(x + 4)$?', options: ['$x = -4$', '$x = 4$', '$x = 0$', '$y = -4$'], answer: 0, why: '$x + 4$ means left 4, so the asymptote is $x = -4$.' },
    },
    {
      say: 'A sure way to find the domain: the part inside the log must be positive. Set it $> 0$ and solve. The asymptote is where the inside equals $0$.',
      example: ['$y = \\log(2x - 6)$', '$2x - 6 > 0$', '$2x > 6$', '$x > 3$'],
      check: { q: 'What is the domain of $y = \\log_3(3x + 9)$?', options: ['$x > -3$', '$x > 3$', '$x > -9$', '$x > 9$'], answer: 0, why: '$3x + 9 > 0$, so $3x > -9$ and $x > -3$.' },
    },
    {
      say: 'In $y = a\\log_b(x - c) + d$, the $a$ and $d$ only stretch, flip, or move the graph up and down. They do not change the domain or the vertical asymptote.',
      example: ['$y = 5\\log_2(x - 1) + 7$', 'Inside: $x - 1 > 0$, so $x > 1$.', 'The $5$ and $7$ do not matter for the domain.', 'Domain: $x > 1$. Asymptote: $x = 1$.'],
      check: { q: 'What is the domain of $y = -2\\log(x - 6) + 4$?', options: ['$x > 6$', '$x > 4$', '$x > -6$', '$x < 6$'], answer: 0, why: 'Only the inside matters: $x - 6 > 0$ gives $x > 6$.' },
    },
    {
      say: 'If the inside is $c - x$, the graph is flipped left to right. The domain becomes $x < c$. When you divide by a negative, flip the inequality sign.',
      example: ['$y = \\log(5 - x)$', '$5 - x > 0$', '$-x > -5$', 'Divide by $-1$ and flip: $x < 5$.'],
      check: { q: 'What is the domain of $y = \\log_2(1 - x)$?', options: ['$x < 1$', '$x > 1$', '$x > -1$', '$x < -1$'], answer: 0, why: '$1 - x > 0$ gives $1 > x$, so $x < 1$.' },
    },
    {
      say: 'To find an **inverse**, swap $x$ and $y$, then solve for $y$. $y = b^x$ and $y = \\log_b x$ are inverses of each other.',
      example: ['$y = 2^x$', 'Swap: $x = 2^y$.', 'Logarithmic form: $y = \\log_2 x$.'],
      check: { q: 'What is the inverse of $y = \\log_5 x$?', options: ['$y = 5^x$', '$y = x^5$', '$y = \\frac{1}{\\log_5 x}$', '$y = \\log_x 5$'], answer: 0, why: 'Swap to get $x = \\log_5 y$, which means $y = 5^x$.' },
    },
    {
      say: 'For a moved log, swap $x$ and $y$, get the log alone, then rewrite as a power. The left-right move and the up-down move **trade places**.',
      example: ['$y = \\log_2(x - 3) + 1$', 'Swap: $x = \\log_2(y - 3) + 1$', 'Log alone: $x - 1 = \\log_2(y - 3)$', 'Power: $2^{x - 1} = y - 3$', '$y = 2^{x - 1} + 3$'],
      check: { q: 'What is the inverse of $y = \\log_3(x - 2) + 5$?', options: ['$y = 3^{x - 5} + 2$', '$y = 3^{x - 2} + 5$', '$y = 3^{x + 5} - 2$', '$y = 3^{x + 2} - 5$'], answer: 0, why: 'The shifts trade places: right 2 becomes up 2, and up 5 becomes right 5.' },
    },
    {
      say: 'Asymptotes swap too. A horizontal asymptote $y = k$ on one graph becomes a vertical asymptote $x = k$ on the inverse.',
      example: ['$y = 2^x + 3$ has asymptote $y = 3$.', 'Its inverse is $y = \\log_2(x - 3)$.', 'That has asymptote $x = 3$.'],
      check: { q: '$y = 4^x - 2$ has asymptote $y = -2$. What is the asymptote of its inverse?', options: ['$x = -2$', '$y = -2$', '$x = 2$', '$y = 2$'], answer: 0, why: 'Swapping $x$ and $y$ turns $y = -2$ into $x = -2$.' },
    },
  ],

  'RF8.expand': [
    {
      say: 'Logs are exponents, so log rules come from exponent rules. When you multiply powers, you add exponents. So the log of a product is a sum of logs.',
      example: ['$2^3 \\cdot 2^4 = 2^7$: the exponents add.', '$\\log_2 (8 \\cdot 16) = \\log_2 128 = 7$', '$\\log_2 8 + \\log_2 16 = 3 + 4 = 7$', 'Same answer.'],
      check: { q: 'What is $\\log_2(4 \\cdot 8)$?', options: ['$5$', '$6$', '$12$', '$32$'], answer: 0, why: '$\\log_2 4 + \\log_2 8 = 2 + 3 = 5$. Or $\\log_2 32 = 5$.' },
    },
    {
      say: '**Product law**: $\\log_b(MN) = \\log_b M + \\log_b N$. Things multiplied inside one log become a sum of logs.',
      example: ['$\\log_3(5x)$', '$5$ times $x$ inside.', '$= \\log_3 5 + \\log_3 x$'],
      check: { q: 'Expand $\\log(xy)$.', options: ['$\\log x + \\log y$', '$\\log x \\cdot \\log y$', '$\\log x - \\log y$'], answer: 0, why: 'A product inside becomes a sum of logs.' },
    },
    {
      say: '**Quotient law**: $\\log_b \\frac{M}{N} = \\log_b M - \\log_b N$. A fraction inside becomes log of the top minus log of the bottom.',
      example: ['$\\log_2 \\frac{x}{7}$', 'Top: $x$. Bottom: $7$.', '$= \\log_2 x - \\log_2 7$'],
      check: { q: 'Expand $\\log_2 \\frac{x}{7}$.', options: ['$\\log_2 x - \\log_2 7$', '$\\log_2 7 - \\log_2 x$', '$\\frac{\\log_2 x}{\\log_2 7}$'], answer: 0, why: 'Top minus bottom, and the answer is a difference, not a fraction.' },
    },
    {
      say: '**Power law**: $\\log_b M^p = p\\log_b M$. An exponent inside the log comes down to the front as a multiplier.',
      example: ['$\\log_5 x^3$', 'The exponent is $3$.', '$= 3\\log_5 x$'],
      check: { q: 'Expand $\\log y^4$.', options: ['$4\\log y$', '$(\\log y)^4$', '$\\log 4y$', '$\\log 4 + \\log y$'], answer: 0, why: 'The exponent $4$ comes down in front of the log.' },
    },
    {
      say: 'A root is a fraction exponent: $\\sqrt{A} = A^{\\frac{1}{2}}$ and $\\sqrt[3]{A} = A^{\\frac{1}{3}}$. Then the power law brings the fraction down.',
      example: ['$\\log \\sqrt{x}$', '$= \\log x^{\\frac{1}{2}}$', '$= \\frac{1}{2}\\log x$'],
      check: { q: 'Expand $\\log_2 \\sqrt[3]{x}$.', options: ['$\\frac{1}{3}\\log_2 x$', '$3\\log_2 x$', '$\\log_2 x - 3$'], answer: 0, why: '$\\sqrt[3]{x} = x^{\\frac{1}{3}}$, and the $\\frac{1}{3}$ comes down.' },
    },
    {
      say: 'To expand a big one, go in order. First split the fraction (quotient law). Then split the products (product law). Last, bring every exponent down (power law).',
      example: ['$\\log_2 \\frac{x^3 y}{z}$', 'Quotient: $\\log_2(x^3 y) - \\log_2 z$', 'Product: $\\log_2 x^3 + \\log_2 y - \\log_2 z$', 'Power: $3\\log_2 x + \\log_2 y - \\log_2 z$'],
      check: { q: 'Expand $\\log \\frac{a^2}{b^5}$.', options: ['$2\\log a - 5\\log b$', '$\\frac{2\\log a}{5\\log b}$', '$5\\log b - 2\\log a$', '$10\\log\\frac{a}{b}$'], answer: 0, why: 'Top minus bottom, then each exponent comes down.' },
    },
    {
      say: 'If a number inside is a power of the base, turn its log into a plain number.',
      example: ['$\\log_2(8x)$', '$= \\log_2 8 + \\log_2 x$', '$\\log_2 8 = 3$, since $2^3 = 8$.', '$= 3 + \\log_2 x$'],
      check: { q: 'Expand $\\log_3(9x)$.', options: ['$2 + \\log_3 x$', '$9 + \\log_3 x$', '$2\\log_3 x$', '$3 + \\log_3 x$'], answer: 0, why: '$\\log_3 9 = 2$, since $3^2 = 9$.' },
    },
    {
      say: 'Watch for traps. $\\log(M + N)$ cannot be split. $(\\log M)^p$ is not $p\\log M$: the exponent must be inside, on $M$ only. And $\\frac{\\log M}{\\log N}$ is not $\\log M - \\log N$.',
      example: ['$\\log x^2 = 2\\log x$ is true: the $2$ is inside.', '$(\\log x)^2$: the $2$ is outside, so it stays.', '$\\log(x + 2)$: a sum inside, so no law applies.'],
      check: { q: 'Which one is true?', options: ['$\\log x^2 = 2\\log x$', '$\\log(x + 2) = \\log x + \\log 2$', '$(\\log x)^2 = 2\\log x$', '$\\frac{\\log x}{\\log 2} = \\log x - \\log 2$'], answer: 0, why: 'The power law works because the exponent $2$ is on $x$, inside the log.' },
    },
    {
      say: 'If you are told the values of some logs, expand first. Then put the values in.',
      example: ['Given $\\log_2 x = 3$ and $\\log_2 y = 5$.', 'Find $\\log_2 \\frac{x^2}{y}$.', 'Expand: $2\\log_2 x - \\log_2 y$', 'Substitute: $2(3) - 5 = 1$'],
      check: { q: 'Given $\\log x = 2$ and $\\log y = 4$, find $\\log(xy^3)$.', options: ['$14$', '$18$', '$24$', '$10$'], answer: 0, why: '$\\log x + 3\\log y = 2 + 3(4) = 14$.' },
    },
  ],

  'RF8.condense': [
    {
      say: '**Condensing** means writing several logs as one single log. It runs the log laws backwards. All the logs must have the same base.',
      example: ['$\\log_2 x + \\log_2 y$', 'A sum of logs is the log of a product.', '$= \\log_2(xy)$'],
      check: { q: 'Write $\\log 3 + \\log x$ as one log.', options: ['$\\log 3x$', '$\\log(3 + x)$', '$3\\log x$'], answer: 0, why: 'A sum of logs becomes a product inside: $3 \\cdot x$.' },
    },
    {
      say: 'Step 1: a number in front of a log becomes an **exponent** inside. Do this first.',
      example: ['$2\\log_5 x$', 'The $2$ moves up to be the exponent of $x$.', '$= \\log_5 x^2$'],
      check: { q: 'Write $3\\log y$ as one log.', options: ['$\\log y^3$', '$\\log 3y$', '$(\\log y)^3$'], answer: 0, why: 'The front number becomes the exponent on $y$.' },
    },
    {
      say: 'A fraction in front becomes a **root**. $\\frac{1}{2}$ gives a square root. $\\frac{1}{3}$ gives a cube root.',
      example: ['$\\frac{1}{2}\\log x$', '$= \\log x^{\\frac{1}{2}}$', '$= \\log \\sqrt{x}$'],
      check: { q: 'Write $\\frac{1}{3}\\log x$ as one log.', options: ['$\\log \\sqrt[3]{x}$', '$\\log \\frac{x}{3}$', '$\\log x^3$'], answer: 0, why: 'The power $\\frac{1}{3}$ is a cube root.' },
    },
    {
      say: 'Step 2: logs that are **added** multiply inside one log. Logs that are **subtracted** go in the denominator (the bottom of the fraction).',
      example: ['$\\log_4 a - \\log_4 b$', '$b$ is subtracted, so it goes on the bottom.', '$= \\log_4 \\frac{a}{b}$'],
      check: { q: 'Write $\\log x + \\log y - \\log z$ as one log.', options: ['$\\log \\frac{xy}{z}$', '$\\log \\frac{x}{yz}$', '$\\log(x + y - z)$', '$\\log xyz$'], answer: 0, why: '$x$ and $y$ are added, so they multiply on top. $z$ is subtracted, so it goes on the bottom.' },
    },
    {
      say: 'Put the two steps together. Move all front numbers up as exponents first. Then combine into one fraction.',
      example: ['$2\\log_5 x + \\log_5 y - 3\\log_5 z$', 'Step 1: $\\log_5 x^2 + \\log_5 y - \\log_5 z^3$', 'Step 2: $\\log_5 \\frac{x^2 y}{z^3}$'],
      check: { q: 'Write $3\\log a - 2\\log b$ as one log.', options: ['$\\log \\frac{a^3}{b^2}$', '$\\log \\frac{3a}{2b}$', '$\\log(a^3 - b^2)$', '$\\frac{\\log a^3}{\\log b^2}$'], answer: 0, why: 'Exponents first: $\\log a^3 - \\log b^2$. Then subtracting means divide.' },
    },
    {
      say: 'A plain number can be written as a log of the base. $1 = \\log 10$ and $2 = \\log_3 9$. Then it combines with the other logs.',
      example: ['$\\log x + 1$', '$1 = \\log 10$, since $10^1 = 10$.', '$\\log x + \\log 10$', '$= \\log 10x$'],
      check: { q: 'Write $\\log_2 x - 3$ as one log.', options: ['$\\log_2 \\frac{x}{8}$', '$\\log_2 \\frac{x}{3}$', '$\\log_2 8x$', '$\\log_2(x - 8)$'], answer: 0, why: '$3 = \\log_2 8$, and subtracting puts the $8$ on the bottom.' },
    },
    {
      say: 'A front number is never multiplied into the inside. $2\\log x = \\log x^2$, not $\\log 2x$.',
      example: ['$2\\log x$', 'Right: $\\log x^2$.', 'Wrong: $\\log 2x$.', 'Check with $x = 10$: $2\\log 10 = 2$ and $\\log 100 = 2$, but $\\log 20 \\ne 2$.'],
      check: { q: 'Which one equals $4\\log_3 x$?', options: ['$\\log_3 x^4$', '$\\log_3 4x$', '$\\log_3(x + 4)$'], answer: 0, why: 'The $4$ becomes the exponent of $x$.' },
    },
    {
      say: 'Condensing helps you find exact values. Two logs may be awkward alone, but combined they give a nice number.',
      example: ['$\\log_6 4 + \\log_6 9$', 'Neither is a nice value alone.', '$= \\log_6(4 \\cdot 9) = \\log_6 36$', '$6^2 = 36$, so the answer is $2$.'],
      check: { q: 'What is $\\log_2 24 - \\log_2 3$?', options: ['$3$', '$8$', '$\\log_2 21$', '$4$'], answer: 0, why: '$\\log_2 \\frac{24}{3} = \\log_2 8 = 3$.' },
    },
  ],

  'RF8.change-base': [
    {
      say: 'The **change of base** formula: $\\log_b x = \\frac{\\log_a x}{\\log_a b}$. You may pick any new base $a$. The number inside goes on top. The old base goes on the bottom.',
      example: ['$\\log_3 7$', 'Pick base $10$.', 'Top: $\\log 7$. Bottom: $\\log 3$.', '$\\log_3 7 = \\frac{\\log 7}{\\log 3}$'],
      check: { q: 'Which one equals $\\log_5 12$?', options: ['$\\frac{\\log 12}{\\log 5}$', '$\\frac{\\log 5}{\\log 12}$', '$\\log \\frac{12}{5}$', '$\\log 12 - 5$'], answer: 0, why: 'The number inside, $12$, goes on top. The base $5$ goes on the bottom.' },
    },
    {
      say: 'A calculator has a base $10$ log key. Change of base lets you use it for any base. Round only at the very end.',
      example: ['$\\log_7 20 = \\frac{\\log 20}{\\log 7}$', 'Type: $\\log 20 \\div \\log 7$.', '$\\approx 1.54$', 'Makes sense: $7^1 = 7$ and $7^2 = 49$, so the answer is between $1$ and $2$.'],
      check: { q: 'Which calculator entry gives $\\log_2 10$?', options: ['$\\log 10 \\div \\log 2$', '$\\log 2 \\div \\log 10$', '$\\log(10 \\div 2)$', '$\\log 10 - \\log 2$'], answer: 0, why: 'Number inside on top, base on the bottom: $\\frac{\\log 10}{\\log 2}$.' },
    },
    {
      say: 'Without a calculator, pick a new base that makes both numbers powers. Then each log is just an exponent.',
      example: ['$\\log_4 8$', '$4 = 2^2$ and $8 = 2^3$, so pick base $2$.', '$\\frac{\\log_2 8}{\\log_2 4} = \\frac{3}{2}$'],
      check: { q: 'What is $\\log_8 16$?', options: ['$\\frac{4}{3}$', '$\\frac{3}{4}$', '$2$', '$\\frac{1}{2}$'], answer: 0, why: 'In base $2$: $\\frac{\\log_2 16}{\\log_2 8} = \\frac{4}{3}$.' },
    },
    {
      say: 'You can read the formula backwards. A fraction of two logs with the same base is one log: the bottom number becomes the base.',
      example: ['$\\frac{\\log 25}{\\log 5}$', 'Bottom number $5$ is the base.', '$= \\log_5 25$', '$= 2$'],
      check: { q: 'Which one equals $\\frac{\\log 5}{\\log 2}$?', options: ['$\\log_2 5$', '$\\log_5 2$', '$\\log \\frac{5}{2}$', '$\\log 3$'], answer: 0, why: 'The bottom number $2$ becomes the base, and the top number $5$ goes inside.' },
    },
    {
      say: 'Flipping the fraction gives a different answer. $\\frac{\\log b}{\\log x}$ is $\\log_x b$, the **reciprocal** (one over) of $\\log_b x$.',
      example: ['$\\log_2 8 = 3$', 'Flipped: $\\log_8 2 = \\frac{1}{3}$.', 'Check: $8^{\\frac{1}{3}} = \\sqrt[3]{8} = 2$.'],
      check: { q: '$\\log_3 81 = 4$. What is $\\log_{81} 3$?', options: ['$\\frac{1}{4}$', '$4$', '$-4$', '$27$'], answer: 0, why: 'Swapping the base and the inside gives the reciprocal: $\\frac{1}{4}$.' },
    },
    {
      say: 'A fraction of logs is not the log of a fraction. $\\frac{\\log x}{\\log b}$ is not $\\log \\frac{x}{b}$.',
      example: ['$\\frac{\\log 100}{\\log 10} = \\frac{2}{1} = 2$', '$\\log \\frac{100}{10} = \\log 10 = 1$', 'Different answers.'],
      check: { q: 'What is $\\frac{\\log 1000}{\\log 10}$?', options: ['$3$', '$2$', '$\\frac{1}{3}$'], answer: 0, why: '$\\log 1000 = 3$ and $\\log 10 = 1$, so it is $\\frac{3}{1} = 3$. The answer $2$ comes from $\\log \\frac{1000}{10}$, which is a different thing.' },
    },
    {
      say: 'Change of base also simplifies a product of logs. Change both to base $10$. The matching log cancels, top and bottom.',
      example: ['$\\log_5 6 \\cdot \\log_6 25$', '$= \\frac{\\log 6}{\\log 5} \\cdot \\frac{\\log 25}{\\log 6}$', 'The $\\log 6$ cancels: $\\frac{\\log 25}{\\log 5}$', '$= \\log_5 25 = 2$'],
      check: { q: 'What is $\\log_2 3 \\cdot \\log_3 8$?', options: ['$3$', '$\\log_6 24$', '$8$', '$\\frac{1}{3}$'], answer: 0, why: '$\\frac{\\log 3}{\\log 2} \\cdot \\frac{\\log 8}{\\log 3} = \\frac{\\log 8}{\\log 2} = \\log_2 8 = 3$.' },
    },
  ],

  'RF10.exp-common-base': [
    {
      say: 'If two powers with the **same base** are equal, their exponents are equal. If $b^m = b^n$, then $m = n$.',
      example: ['$3^{x + 1} = 3^7$', 'Same base $3$.', '$x + 1 = 7$', '$x = 6$'],
      check: { q: 'Solve $2^{x - 3} = 2^5$.', options: ['$8$', '$2$', '$5$', '$-2$'], answer: 0, why: '$x - 3 = 5$, so $x = 8$.' },
    },
    {
      say: 'If one side is a plain number, write it as a power of the base. Then set the exponents equal.',
      example: ['$3^{2x - 1} = 27$', '$27 = 3^3$', '$3^{2x - 1} = 3^3$', '$2x - 1 = 3$, so $2x = 4$', '$x = 2$'],
      check: { q: 'Solve $5^{x - 2} = 125$.', options: ['$5$', '$3$', '$1$', '$127$'], answer: 0, why: '$125 = 5^3$, so $x - 2 = 3$ and $x = 5$.' },
    },
    {
      say: 'When the bases differ, rewrite both sides as powers of one **smaller base**. Know these: $4, 8, 16, 32$ are powers of $2$. $9, 27, 81$ are powers of $3$. $25, 125$ are powers of $5$.',
      example: ['$4^x = 8$', '$4 = 2^2$ and $8 = 2^3$.', '$(2^2)^x = 2^3$, so $2^{2x} = 2^3$.', '$2x = 3$', '$x = \\frac{3}{2}$'],
      check: { q: 'Solve $8^x = 16$.', options: ['$\\frac{4}{3}$', '$\\frac{3}{4}$', '$2$', '$8$'], answer: 0, why: '$2^{3x} = 2^4$, so $3x = 4$ and $x = \\frac{4}{3}$.' },
    },
    {
      say: 'A power of a power **multiplies** the exponents. Put **brackets** around the whole exponent so every part gets multiplied. Forgetting the brackets is the most common mistake.',
      example: ['$8^{x + 1}$', '$= (2^3)^{x + 1}$', '$= 2^{3(x + 1)}$', '$= 2^{3x + 3}$', 'Not $2^{3x + 1}$.'],
      check: { q: 'Write $9^{x - 2}$ as a power of $3$.', options: ['$3^{2x - 4}$', '$3^{2x - 2}$', '$3^{x - 4}$', '$3^{2x + 4}$'], answer: 0, why: '$9 = 3^2$, so $3^{2(x - 2)} = 3^{2x - 4}$.' },
    },
    {
      say: 'With $x$ on both sides, rewrite both sides with one base. Set the exponents equal and solve.',
      example: ['$4^{x + 1} = 8^x$', '$2^{2(x + 1)} = 2^{3x}$', '$2x + 2 = 3x$', '$x = 2$'],
      check: { q: 'Solve $9^x = 27^{x - 1}$.', options: ['$3$', '$1$', '$-3$'], answer: 0, why: '$3^{2x} = 3^{3(x - 1)}$, so $2x = 3x - 3$ and $x = 3$.' },
    },
    {
      say: 'A fraction is a **negative power**: $\\frac{1}{9} = 3^{-2}$, and $\\left(\\frac{1}{2}\\right)^x = 2^{-x}$.',
      example: ['$\\left(\\frac{1}{2}\\right)^x = 16$', '$2^{-x} = 2^4$', '$-x = 4$', '$x = -4$'],
      check: { q: 'Solve $3^x = \\frac{1}{27}$.', options: ['$-3$', '$3$', '$\\frac{1}{3}$', '$-9$'], answer: 0, why: '$\\frac{1}{27} = \\frac{1}{3^3} = 3^{-3}$, so $x = -3$.' },
    },
    {
      say: 'A root is a **fraction power**: $\\sqrt{3} = 3^{\\frac{1}{2}}$.',
      example: ['$9^x = \\sqrt{3}$', '$9 = 3^2$ and $\\sqrt{3} = 3^{\\frac{1}{2}}$.', '$3^{2x} = 3^{\\frac{1}{2}}$', '$2x = \\frac{1}{2}$', '$x = \\frac{1}{4}$'],
      check: { q: 'Solve $2^x = \\sqrt{8}$.', options: ['$\\frac{3}{2}$', '$4$', '$\\frac{2}{3}$', '$3$'], answer: 0, why: '$\\sqrt{8} = (2^3)^{\\frac{1}{2}} = 2^{\\frac{3}{2}}$.' },
    },
    {
      say: 'If the exponent equation has an $x^2$, it is a **quadratic**. Move everything to one side so it equals $0$, then factor. There may be two answers.',
      example: ['$2^{x^2} = 2^{x + 6}$', '$x^2 = x + 6$', '$x^2 - x - 6 = 0$', '$(x - 3)(x + 2) = 0$', '$x = 3$ or $x = -2$'],
      check: { q: 'Solve $3^{x^2} = 3^{4x}$.', options: ['$x = 0$ or $x = 4$', '$x = 4$ only', '$x = 2$ or $x = -2$', '$x = -4$ or $x = 0$'], answer: 0, why: '$x^2 = 4x$, so $x^2 - 4x = 0$, $x(x - 4) = 0$. Do not divide by $x$, or you lose $x = 0$.' },
    },
    {
      say: 'Check your answer by putting it back into the **original** equation. Both sides should give the same number.',
      example: ['$3^{x + 1} = 9^{x - 1}$ gave $x = 3$.', 'Left: $3^{3 + 1} = 3^4 = 81$.', 'Right: $9^{3 - 1} = 9^2 = 81$.', 'Both are $81$, so $x = 3$ is right.'],
      check: { q: 'Is $x = 2$ a solution of $4^{x + 1} = 8^x$?', options: ['Yes, both sides are $64$', 'No, $16 \\ne 64$', 'No, the bases are different'], answer: 0, why: '$4^3 = 64$ and $8^2 = 64$.' },
    },
  ],

  'RF10.exp-logs': [
    {
      say: 'Sometimes the two sides cannot be written with the same base. Then you need logs.',
      example: ['$3^x = 81$: $81 = 3^4$, so $x = 4$. No logs needed.', '$3^x = 20$: $20$ is not a power of $3$.', 'So $3^x = 20$ needs logs.'],
      check: { q: 'Which equation needs logs to solve?', options: ['$3^x = 20$', '$3^x = 81$', '$2^x = 32$', '$5^x = \\frac{1}{25}$'], answer: 0, why: '$20$ is not a power of $3$. The others are all powers of their base.' },
    },
    {
      say: 'Take the log of both sides. The **power law** brings the exponent down: $\\log b^x = x\\log b$. Then divide to get $x$ alone.',
      example: ['$5^x = 40$', '$\\log 5^x = \\log 40$', '$x\\log 5 = \\log 40$', '$x = \\frac{\\log 40}{\\log 5}$', '$x \\approx 2.29$'],
      check: { q: 'What is the exact solution of $2^x = 7$?', options: ['$x = \\frac{\\log 7}{\\log 2}$', '$x = \\frac{\\log 2}{\\log 7}$', '$x = \\log \\frac{7}{2}$', '$x = \\frac{7}{2}$'], answer: 0, why: '$x\\log 2 = \\log 7$, so divide both sides by $\\log 2$.' },
    },
    {
      say: 'Get the power **alone first**. Divide away any number in front before taking logs. Never multiply the front number into the base.',
      example: ['$3(2)^x = 48$', 'Divide by $3$: $2^x = 16$.', '$16 = 2^4$, so $x = 4$.', 'Wrong: $3(2)^x$ is not $6^x$.'],
      check: { q: 'What is the first step for $4(3)^x = 100$?', options: ['Divide both sides by $4$', 'Rewrite as $12^x = 100$', 'Subtract $4$ from both sides'], answer: 0, why: 'The $4$ multiplies the power, so divide it away to get the power alone.' },
    },
    {
      say: 'If the exponent has two terms, keep **brackets** when it comes down. The whole exponent multiplies the log.',
      example: ['$3^{x + 1} = 20$', '$\\log 3^{x + 1} = \\log 20$', '$(x + 1)\\log 3 = \\log 20$', 'Not $x + 1\\log 3$.'],
      check: { q: 'Take the log of both sides of $5^{x - 2} = 30$.', options: ['$(x - 2)\\log 5 = \\log 30$', '$x - 2\\log 5 = \\log 30$', '$(x - 2)\\log 30 = \\log 5$', '$\\log(x - 2) \\cdot 5 = \\log 30$'], answer: 0, why: 'The whole exponent $x - 2$ comes down, in brackets, in front of $\\log 5$.' },
    },
    {
      say: 'After the brackets come down, divide by the log first. Then undo the plus or minus.',
      example: ['$(x + 1)\\log 2 = \\log 20$', '$x + 1 = \\frac{\\log 20}{\\log 2}$', '$x = \\frac{\\log 20}{\\log 2} - 1$', '$x \\approx 4.32 - 1 = 3.32$'],
      check: { q: 'What is the exact solution of $3^{x - 4} = 10$?', options: ['$x = \\frac{\\log 10}{\\log 3} + 4$', '$x = \\frac{\\log 10}{\\log 3} - 4$', '$x = \\log \\frac{10}{3} + 4$', '$x = \\frac{\\log 3}{\\log 10} + 4$'], answer: 0, why: '$x - 4 = \\frac{\\log 10}{\\log 3}$, then add $4$ to undo the minus.' },
    },
    {
      say: 'If $x$ is on both sides, take logs and expand the brackets. Move all $x$ terms to one side. Factor out $x$, then divide.',
      example: ['$3^{x + 1} = 5^x$ gives $(x + 1)\\log 3 = x\\log 5$', '$x\\log 3 + \\log 3 = x\\log 5$', '$x\\log 3 - x\\log 5 = -\\log 3$', '$x(\\log 3 - \\log 5) = -\\log 3$', '$x = \\frac{\\log 3}{\\log 5 - \\log 3} \\approx 2.15$'],
      check: { q: 'Expand $(x + 3)\\log 2$.', options: ['$x\\log 2 + 3\\log 2$', '$x\\log 2 + 3$', '$x + 3\\log 2$', '$\\log 2x + \\log 6$'], answer: 0, why: 'The $\\log 2$ multiplies both $x$ and $3$.' },
    },
    {
      say: 'Keep the full calculator values until the last step. Rounding in the middle can change your final answer.',
      example: ['$x = \\frac{\\log 20}{\\log 7}$', 'Full values: $1.30103 \\div 0.84510 \\approx 1.54$', 'Rounded early: $1.3 \\div 0.85 \\approx 1.53$', 'Early rounding gave the wrong answer.'],
      check: { q: 'When should you round?', options: ['Only at the final answer', 'Right after taking logs', 'After every step'], answer: 0, why: 'Rounding early adds small errors that can change the final digits.' },
    },
    {
      say: 'Put it together: get the power alone, take logs, bring the exponent down in brackets, then solve for $x$. If the number turns out to be a power of the base, you can skip the logs.',
      example: ['$2(3)^{x - 1} = 50$', 'Divide by $2$: $3^{x - 1} = 25$', '$(x - 1)\\log 3 = \\log 25$', '$x = \\frac{\\log 25}{\\log 3} + 1 \\approx 3.93$'],
      check: { q: 'Solve $5(2)^x = 40$.', options: ['$3$', '$8$', '$\\frac{3}{2}$'], answer: 0, why: 'Divide by $5$: $2^x = 8 = 2^3$, so $x = 3$.' },
    },
  ],

  'RF10.log-eq': [
    {
      say: 'If one log equals a number, rewrite in exponential form: $\\log_b M = k$ becomes $M = b^k$. Then solve.',
      example: ['$\\log_2(x + 3) = 4$', '$x + 3 = 2^4$', '$x + 3 = 16$', '$x = 13$'],
      check: { q: 'Solve $\\log(2x) = 2$.', options: ['$50$', '$1$', '$10$', '$200$'], answer: 0, why: 'Base $10$: $2x = 10^2 = 100$, so $x = 50$.' },
    },
    {
      say: 'If one log equals another log with the **same base**, the insides are equal: $\\log_b M = \\log_b N$ means $M = N$.',
      example: ['$\\log_3(2x - 1) = \\log_3(x + 4)$', '$2x - 1 = x + 4$', '$x = 5$'],
      check: { q: 'Solve $\\log(3x) = \\log(x + 8)$.', options: ['$4$', '$2$', '$8$'], answer: 0, why: '$3x = x + 8$, so $2x = 8$ and $x = 4$.' },
    },
    {
      say: 'If there are two logs on one side, first **condense** them into one log with the log laws. Added logs multiply inside.',
      example: ['$\\log_2 x + \\log_2(x - 2) = 3$', 'Product law: $\\log_2[x(x - 2)] = 3$', 'Exponential form: $x(x - 2) = 2^3 = 8$'],
      check: { q: 'Write $\\log x + \\log(x + 3)$ as one log.', options: ['$\\log(x^2 + 3x)$', '$\\log(2x + 3)$', '$\\log x \\cdot \\log(x + 3)$'], answer: 0, why: 'Added logs multiply inside: $x(x + 3) = x^2 + 3x$.' },
    },
    {
      say: 'You often get a **quadratic**. Move everything to one side so it equals $0$, then factor.',
      example: ['$x(x - 2) = 8$', '$x^2 - 2x - 8 = 0$', '$(x - 4)(x + 2) = 0$', '$x = 4$ or $x = -2$'],
      check: { q: 'Solve $x(x + 3) = 10$.', options: ['$x = 2$ or $x = -5$', '$x = -2$ or $x = 5$', '$x = 10$ or $x = 7$'], answer: 0, why: '$x^2 + 3x - 10 = 0$ factors as $(x + 5)(x - 2) = 0$.' },
    },
    {
      say: 'Now **check every answer** in the original equation. Each log must have a positive inside. An answer that makes any inside zero or negative is **extraneous**: a fake answer you must reject.',
      example: ['$\\log_2 x + \\log_2(x - 2) = 3$ gave $x = 4$ or $x = -2$.', '$x = 4$: insides $4$ and $2$, both positive. Keep.', '$x = -2$: $\\log_2(-2)$ is undefined. Reject.', 'Answer: $x = 4$ only.'],
      check: { q: '$\\log x + \\log(x + 3) = 1$ gives $x = 2$ or $x = -5$. What is the solution?', options: ['$x = 2$ only', '$x = -5$ only', '$x = 2$ or $x = -5$', 'No solution'], answer: 0, why: '$x = -5$ makes $\\log(-5)$, which is undefined. $x = 2$ gives insides $2$ and $5$, both positive.' },
    },
    {
      say: 'A negative $x$ is not always wrong. What matters is the **inside of each log**. If every inside is positive, keep the answer.',
      example: ['$\\log_2(x + 9) = 3$', '$x + 9 = 8$', '$x = -1$', 'Inside: $-1 + 9 = 8$, which is positive. Keep $x = -1$.'],
      check: { q: '$\\log_3(x + 10) = 2$ gives $x = -1$. Is it a real solution?', options: ['Yes, the inside $x + 10 = 9$ is positive', 'No, $x$ is negative', 'No, $\\log_3 9$ is undefined'], answer: 0, why: 'Only the inside must be positive, and $-1 + 10 = 9$.' },
    },
    {
      say: 'Subtracted logs **divide** inside. After that, write in exponential form and multiply both sides by the bottom.',
      example: ['$\\log_3(x + 6) - \\log_3 x = 1$', '$\\log_3 \\frac{x + 6}{x} = 1$', '$\\frac{x + 6}{x} = 3^1 = 3$', '$x + 6 = 3x$, so $6 = 2x$', '$x = 3$'],
      check: { q: 'Solve $\\log(x + 9) - \\log x = 1$.', options: ['$1$', '$9$', '$\\frac{1}{9}$'], answer: 0, why: '$\\frac{x + 9}{x} = 10$, so $x + 9 = 10x$, $9 = 9x$, $x = 1$.' },
    },
    {
      say: 'Here is the full method on one problem: condense, rewrite as a power, solve the quadratic, then check each root.',
      example: ['$\\log(x + 7) + \\log(x - 2) = 1$', '$(x + 7)(x - 2) = 10^1 = 10$', '$x^2 + 5x - 14 = 10$, so $x^2 + 5x - 24 = 0$', '$(x + 8)(x - 3) = 0$, so $x = -8$ or $x = 3$', '$x = -8$ gives $\\log(-1)$. Reject. Answer: $x = 3$.'],
      check: { q: 'Why is $x = -8$ rejected here?', options: ['$x + 7 = -1$, and $\\log(-1)$ is undefined', '$-8$ is negative, and $x$ can never be negative', 'It does not solve $x^2 + 5x - 24 = 0$'], answer: 0, why: 'An inside of the log becomes negative. A negative $x$ alone is not the problem.' },
    },
  ],

  'RF10.growth-decay': [
    {
      say: 'The formula sheet gives $y = a(b)^{\\frac{t}{p}}$. $a$ is the starting amount. $b$ is what it multiplies by each period. $p$ is how long one period is. $t$ is the time that has passed.',
      example: ['$100$ bacteria double every $3$ hours.', '$a = 100$ (start)', '$b = 2$ (doubles)', '$p = 3$ (hours per period)'],
      check: { q: 'A $200$ g sample has a half-life of $5$ years. What is $b$?', options: ['$\\frac{1}{2}$', '$2$', '$5$', '$200$'], answer: 0, why: 'Half-life means it is cut in half each period, so it multiplies by $\\frac{1}{2}$.' },
    },
    {
      say: 'The exponent $\\frac{t}{p}$ counts how many periods have passed. $t$ and $p$ must be in the same units, like both in days.',
      example: ['Doubles every $3$ hours. Time passed: $12$ hours.', '$\\frac{t}{p} = \\frac{12}{3} = 4$', 'So it doubled $4$ times.'],
      check: { q: 'The half-life is $6$ days. How many half-lives pass in $18$ days?', options: ['$3$', '$108$', '$12$', '$\\frac{1}{3}$'], answer: 0, why: '$\\frac{t}{p} = \\frac{18}{6} = 3$.' },
    },
    {
      say: 'To find the **amount** after some time, put the numbers in and work it out.',
      example: ['$100$ bacteria double every $3$ hours. How many after $12$ hours?', '$y = 100(2)^{\\frac{12}{3}}$', '$= 100(2)^4$', '$= 100(16) = 1600$'],
      check: { q: '$80$ mg has a half-life of $4$ days. How much is left after $8$ days?', options: ['$20$ mg', '$40$ mg', '$10$ mg', '$160$ mg'], answer: 0, why: '$\\frac{8}{4} = 2$ half-lives: $80 \\to 40 \\to 20$.' },
    },
    {
      say: 'Percent change gives $b$ too. Growing by $6\\%$ means keeping $100\\%$ and adding $6\\%$: $b = 1.06$. Losing $6\\%$ leaves $94\\%$: $b = 0.94$.',
      example: ['Grows $6\\%$: $b = 1 + 0.06 = 1.06$', 'Loses $6\\%$: $b = 1 - 0.06 = 0.94$'],
      check: { q: 'A car loses $15\\%$ of its value each year. What is $b$?', options: ['$0.85$', '$0.15$', '$1.15$', '$-0.15$'], answer: 0, why: 'Losing $15\\%$ leaves $85\\%$, so $b = 1 - 0.15 = 0.85$.' },
    },
    {
      say: 'Write the model by filling in $a$, $b$ and $p$. Leave $t$ as a letter.',
      example: ['A town of $2000$ grows $3\\%$ per year.', '$a = 2000$, $b = 1.03$, $p = 1$', '$P = 2000(1.03)^t$'],
      check: { q: 'A fish population of $500$ drops $8\\%$ every $2$ years. Which is the model?', options: ['$P = 500(0.92)^{\\frac{t}{2}}$', '$P = 500(0.08)^{\\frac{t}{2}}$', '$P = 500(0.92)^{2t}$', '$P = 500(1.08)^{\\frac{t}{2}}$'], answer: 0, why: 'Losing $8\\%$ leaves $b = 0.92$, and the period is $2$ years, so the exponent is $\\frac{t}{2}$.' },
    },
    {
      say: 'If the time is not a whole number of periods, use a calculator. Estimate first so you can spot a wrong answer.',
      example: ['$200$ mg, half-life $8$ days. Amount after $20$ days?', '$y = 200(0.5)^{\\frac{20}{8}} = 200(0.5)^{2.5}$', '$\\approx 35.4$ mg', 'Estimate: after $2$ half-lives $50$, after $3$ half-lives $25$. Fits.'],
      check: { q: '$400$ mg, half-life $10$ days. After $15$ days, about how much is left?', options: ['Between $100$ and $200$ mg', 'Between $200$ and $400$ mg', 'Less than $100$ mg'], answer: 0, why: '$15$ days is $1.5$ half-lives. After $1$: $200$. After $2$: $100$.' },
    },
    {
      say: 'To find the **time**, put in the numbers, then get the power alone: divide both sides by $a$. Take logs, bring the exponent down, and solve for $t$.',
      example: ['Half-life $8$ days. $200$ mg down to $30$ mg.', '$30 = 200\\left(\\frac{1}{2}\\right)^{\\frac{t}{8}}$', 'Divide by $200$: $0.15 = (0.5)^{\\frac{t}{8}}$', '$\\frac{t}{8}\\log 0.5 = \\log 0.15$', '$t = \\frac{8\\log 0.15}{\\log 0.5} \\approx 21.9$ days'],
      check: { q: 'What is the first step for $400 = 100(2)^{\\frac{t}{5}}$?', options: ['Divide by $100$ to get $4 = 2^{\\frac{t}{5}}$', 'Multiply to get $400 = 200^{\\frac{t}{5}}$', 'Subtract $100$ to get $300 = 2^{\\frac{t}{5}}$'], answer: 0, why: 'The $100$ multiplies the power, so divide it away first.' },
    },
    {
      say: 'If the leftover number is a power of $b$, you can skip the logs and match exponents.',
      example: ['$4 = 2^{\\frac{t}{5}}$', '$4 = 2^2$', '$\\frac{t}{5} = 2$', '$t = 10$'],
      check: { q: '$100$ g has a half-life of $3$ years. How long until $12.5$ g is left?', options: ['$9$ years', '$3$ years', '$24$ years', '$8$ years'], answer: 0, why: '$\\frac{12.5}{100} = \\frac{1}{8} = \\left(\\frac{1}{2}\\right)^3$, so $\\frac{t}{3} = 3$ and $t = 9$.' },
    },
  ],

  'RF10.compound-interest': [
    {
      say: '**Compound interest** means you earn interest on your interest. Use $A = P(1 + i)^n$. $P$ is the **principal**, the money you start with. $i$ is the rate per period as a decimal. $n$ is the number of periods. $A$ is the final amount.',
      example: ['$1000$ dollars at $5\\%$ per year for $2$ years.', '$P = 1000$, $i = 0.05$, $n = 2$', '$A = 1000(1.05)^2 = 1000(1.1025)$', '$A = 1102.50$ dollars'],
      check: { q: 'In $A = 500(1.04)^6$, what is the principal?', options: ['$500$', '$1.04$', '$6$', '$4$'], answer: 0, why: 'The principal $P$ is the starting money, in front of the brackets.' },
    },
    {
      say: '**Compounded** says how often interest is added each year. Annually: $1$ time. Semi-annually: $2$. Quarterly: $4$. Monthly: $12$. Weekly: $52$. Daily: $365$.',
      example: ['Compounded quarterly: interest is added $4$ times a year.', 'Compounded monthly: $12$ times a year.'],
      check: { q: 'How many times a year is interest added when compounded quarterly?', options: ['$4$', '$3$', '$12$', '$2$'], answer: 0, why: 'A quarter is one fourth of a year, so $4$ times.' },
    },
    {
      say: 'Rates are given per year: "$\\%$/a" means percent per year. To get $i$, the rate per period, change the percent to a decimal and divide by how many times a year it compounds.',
      example: ['$6\\%$/a compounded monthly.', '$6\\% = 0.06$', '$i = \\frac{0.06}{12} = 0.005$'],
      check: { q: 'What is $i$ for $8\\%$/a compounded quarterly?', options: ['$0.02$', '$0.08$', '$0.32$', '$2$'], answer: 0, why: '$\\frac{0.08}{4} = 0.02$.' },
    },
    {
      say: 'To get $n$, the number of periods, multiply the times per year by the number of years.',
      example: ['Compounded monthly for $5$ years.', '$n = 12 \\times 5 = 60$'],
      check: { q: 'What is $n$ for $3$ years compounded semi-annually?', options: ['$6$', '$3$', '$1.5$', '$36$'], answer: 0, why: 'Semi-annually is $2$ times a year: $2 \\times 3 = 6$.' },
    },
    {
      say: 'Now put it together: find $i$, find $n$, then work out $A$ with a calculator.',
      example: ['$2000$ dollars at $4.8\\%$/a compounded monthly for $5$ years.', '$i = \\frac{0.048}{12} = 0.004$', '$n = 12 \\times 5 = 60$', '$A = 2000(1.004)^{60} \\approx 2541.28$ dollars'],
      check: { q: '$3000$ dollars at $6\\%$/a compounded quarterly for $t$ years. Which is the model?', options: ['$A = 3000(1.015)^{4t}$', '$A = 3000(1.06)^{4t}$', '$A = 3000(1.015)^t$', '$A = 3000(1.06)^{\\frac{t}{4}}$'], answer: 0, why: '$i = \\frac{0.06}{4} = 0.015$, and there are $4t$ quarters in $t$ years.' },
    },
    {
      say: 'To find the **time**, put in the numbers and divide by $P$ to get the power alone. Then take logs and solve for $n$. For "doubles", use $2 = (1 + i)^n$: the $P$ cancels.',
      example: ['$1000$ dollars at $6\\%$/a compounded annually. When does it reach $2000$?', '$2000 = 1000(1.06)^n$', '$2 = 1.06^n$', '$n = \\frac{\\log 2}{\\log 1.06} \\approx 11.9$'],
      check: { q: '$500$ dollars at $5\\%$/a compounded annually. Which equation finds when it reaches $1500$ dollars?', options: ['$3 = 1.05^n$', '$1000 = 1.05^n$', '$3 = 0.05^n$', '$1500 = 525^n$'], answer: 0, why: '$1500 = 500(1.05)^n$. Divide by $500$: $3 = 1.05^n$.' },
    },
    {
      say: 'Interest is only added at the **end** of each period. So when you solve for $n$, round **up** to the next whole number.',
      example: ['$n \\approx 11.9$ years.', 'After $11$ years, it has not doubled yet.', 'Interest is added at the end of year $12$.', 'Answer: $12$ years.'],
      check: { q: 'You get $n \\approx 15.2$ quarters. What is the answer?', options: ['$16$ quarters', '$15$ quarters', '$15.2$ quarters'], answer: 0, why: 'After $15$ quarters it is not there yet. It gets there at the end of quarter $16$.' },
    },
    {
      say: 'Your $n$ counts periods, not years. Give the answer in the unit the question asks. To change periods to years, divide by the times per year.',
      example: ['Compounded monthly: $n = 30$ months.', 'Years: $\\frac{30}{12} = 2.5$ years.'],
      check: { q: 'Compounded semi-annually, $n = 18$. How many years is that?', options: ['$9$ years', '$36$ years', '$18$ years'], answer: 0, why: 'There are $2$ half-years in a year: $\\frac{18}{2} = 9$.' },
    },
  ],

  'RF10.log-scales': [
    {
      say: 'A **log scale** squeezes huge numbers into small ones. When the reading is just $\\log$ of the amount, each step of $1$ means **10 times** as much.',
      example: ['Intensity $10$: $\\log 10 = 1$', 'Intensity $100$: $\\log 100 = 2$', 'Intensity $1000$: $\\log 1000 = 3$', 'Each step up is $\\times 10$.'],
      check: { q: 'A log reading goes from $4$ to $5$. The amount is multiplied by what?', options: ['$10$', '$1$', '$5$', '$2$'], answer: 0, why: 'One step on a log scale is a factor of $10$.' },
    },
    {
      say: 'Earthquake **magnitude** is $M = \\log\\frac{I}{I_0}$, where $I$ is the intensity. Subtract the magnitudes. Then the ratio of intensities is $10$ to that power.',
      example: ['Magnitude $7.0$ vs magnitude $5.0$.', 'Difference: $7.0 - 5.0 = 2$', 'Ratio: $10^2 = 100$', 'The $7.0$ quake is $100$ times as intense.'],
      check: { q: 'How many times as intense is a magnitude $6.0$ quake as a magnitude $3.0$ quake?', options: ['$1000$', '$3$', '$30$', '$2$'], answer: 0, why: 'The difference is $3$, and $10^3 = 1000$. Do not divide $6$ by $3$.' },
    },
    {
      say: 'For **pH**, the formula is pH $= -\\log[H^+]$. The minus sign means a **lower** pH is **more acidic**. Each $1$ pH unit is still a factor of $10$.',
      example: ['pH $3$ vs pH $5$.', 'Difference: $5 - 3 = 2$', 'Ratio: $10^2 = 100$', 'pH $3$ has $100$ times the $[H^+]$, so it is more acidic.'],
      check: { q: 'Which is more acidic, pH $4$ or pH $6$, and by how much?', options: ['pH $4$, $100$ times', 'pH $6$, $100$ times', 'pH $4$, $2$ times', 'pH $6$, $2$ times'], answer: 0, why: 'Lower pH is more acidic. The difference is $2$, and $10^2 = 100$.' },
    },
    {
      say: 'If the difference is not a whole number, still raise $10$ to it. Use a calculator for that step.',
      example: ['pH $3.2$ vs pH $4.7$.', 'Difference: $4.7 - 3.2 = 1.5$', 'Ratio: $10^{1.5} \\approx 31.6$'],
      check: { q: 'What do you calculate to compare pH $2.4$ and pH $3.0$?', options: ['$10^{0.6}$', '$10^{5.4}$', '$0.6$', '$\\frac{3.0}{2.4}$'], answer: 0, why: 'Subtract the readings: $3.0 - 2.4 = 0.6$. Then raise $10$ to it.' },
    },
    {
      say: 'Sound in **decibels** (dB) is $\\beta = 10\\log\\frac{I}{I_0}$. Because of the $10$ in front, every $10$ dB is a factor of $10$. A difference of $d$ dB is a ratio of $10^{\\frac{d}{10}}$.',
      example: ['$80$ dB vs $60$ dB.', 'Difference: $d = 20$', 'Ratio: $10^{\\frac{20}{10}} = 10^2 = 100$'],
      check: { q: 'How many times as intense is $90$ dB as $60$ dB?', options: ['$1000$', '$30$', '$10^{30}$', '$3$'], answer: 0, why: '$d = 30$, so $10^{\\frac{30}{10}} = 10^3 = 1000$.' },
    },
    {
      say: 'Why this works: write the formula for each reading and subtract. A difference of logs is the log of a ratio. Then undo the log with a power of $10$.',
      example: ['$7 = \\log\\frac{I_1}{I_0}$ and $5 = \\log\\frac{I_2}{I_0}$', 'Subtract: $7 - 5 = \\log\\frac{I_1}{I_2}$', '$\\log\\frac{I_1}{I_2} = 2$', '$\\frac{I_1}{I_2} = 10^2 = 100$'],
      check: { q: 'If $\\log\\frac{I_1}{I_2} = 3$, what is $\\frac{I_1}{I_2}$?', options: ['$1000$', '$3$', '$30$', '$\\log 3$'], answer: 0, why: 'Undo the log: $\\frac{I_1}{I_2} = 10^3 = 1000$.' },
    },
    {
      say: 'Going the other way: if the intensity is multiplied by $R$, add $\\log R$ to the magnitude. $10$ times adds $1$. $100$ times adds $2$.',
      example: ['A magnitude $5.2$ quake. Another is $50$ times as intense.', '$\\log 50 \\approx 1.7$', 'New magnitude: $5.2 + 1.7 = 6.9$'],
      check: { q: 'A quake has magnitude $4.0$. Another is $1000$ times as intense. What is its magnitude?', options: ['$7.0$', '$1004.0$', '$12.0$', '$5.0$'], answer: 0, why: '$\\log 1000 = 3$, and $4.0 + 3 = 7.0$.' },
    },
  ],
};
