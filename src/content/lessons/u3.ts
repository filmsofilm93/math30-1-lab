import type { Lesson } from './types';

/** Unit 3 (exponential and logarithmic functions) lessons. Explanations are ≤ 200 words; examples are generator items revealed step by step. */
export const U3_LESSONS: Lesson[] = [
  {
    nodeId: 'RF9.exp-graph',
    explore: {
      preset: { explorer: 'exp-log', b: 2 },
      predict: {
        question: 'What happens to the graph of $y = b^x$ when $b$ changes from $2$ to $\\frac{1}{2}$?',
        options: ['It reflects in the $y$-axis', 'It reflects in the $x$-axis', 'It moves down 1', 'It becomes a straight line'],
        answer: 0,
        tryIt: 'Slide $b$ from $2$ to $\\frac{1}{2}$ and watch the point at $x = 1$.',
      },
    },
    explain: [
      '$y = b^x$ with $b > 0$, $b \\ne 1$ is an exponential function.',
      '$b > 1$: **growth**, rising left to right. $0 < b < 1$: **decay**, falling. $y = \\left(\\frac{1}{b}\\right)^x = b^{-x}$ is the reflection of $y = b^x$ in the $y$-axis.',
      'Every such graph passes through $(0, 1)$, since $b^0 = 1$, and through $(1, b)$.',
      'Domain: all real numbers. Range: $y > 0$. The $x$-axis, $y = 0$, is a horizontal asymptote: the graph gets arbitrarily close but never reaches it, so there is no $x$-intercept.',
      'To find $b$ from a point $(x, y)$, solve $b^x = y$: write $y$ as a power with exponent $x$, or take the $x$-th root.',
    ],
    examples: [
      { generatorId: 'u3-expg-base', seed: 2, tier: 3 },
      { generatorId: 'u3-expg-char', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF9.exp-transform',
    explore: {
      preset: { explorer: 'exp-log', b: 2, transform: true },
      predict: {
        question: 'For $y = 2^{x - c} + d$, which slider moves the horizontal asymptote?',
        options: ['$d$ only', '$c$ only', 'Both $c$ and $d$', 'Neither'],
        answer: 0,
        tryIt: 'Move $c$, then $d$, and watch the dashed line.',
      },
    },
    explain: [
      '$y = a \\cdot b^{x - c} + d$ applies the Unit 1 transformations to $y = b^x$: $(x, y) \\to (x + c, ay + d)$.',
      '$c$ translates horizontally ($x - 3$ in the exponent means right $3$). $d$ translates vertically. $|a|$ stretches vertically; $a < 0$ reflects in the $x$-axis.',
      'Only $d$ moves the asymptote: it becomes $y = d$. Horizontal shifts slide along a horizontal line; stretches about the $x$-axis keep $y = 0$ fixed until $d$ moves it.',
      'Range: $y > d$ if $a > 0$, $y < d$ if $a < 0$. Domain stays all real numbers.',
      'Track two key points: $(0, 1)$ and $(1, b)$. Apply the mapping to both, draw the new asymptote, and sketch.',
    ],
    examples: [
      { generatorId: 'u3-expt-point', seed: 2, tier: 2 },
      { generatorId: 'u3-expt-asymptote', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'RF7.log-def',
    explore: {
      preset: { explorer: 'exp-log', b: 2, showInverse: true },
      predict: {
        question: 'The point $(3, 8)$ is on $y = 2^x$. Which point is on its inverse?',
        options: ['$(8, 3)$', '$(3, 8)$', '$(-3, 8)$', '$(3, \\frac{1}{8})$'],
        answer: 0,
        tryIt: 'Set $x = 3$ with the inverse showing, and read the red point.',
      },
    },
    explain: [
      'A **logarithm is an exponent**. $\\log_b x$ is the power you raise $b$ to in order to get $x$.',
      '$$\\log_b x = y \\iff b^y = x \\qquad (b > 0,\\ b \\ne 1,\\ x > 0)$$',
      'So $\\log_2 8 = 3$ because $2^3 = 8$. The base of the log is the base of the power; the value of the log is the exponent.',
      '$y = \\log_b x$ is the inverse of $y = b^x$: swap $x$ and $y$ in $y = b^x$ to get $x = b^y$, which is $y = \\log_b x$. Its graph is the reflection in $y = x$.',
      '$\\log x$ with no base means base $10$. To solve $\\log_b x = y$ for any one unknown, rewrite in exponential form first.',
    ],
    examples: [
      { generatorId: 'u3-logdef-solve', seed: 2, tier: 2 },
      { generatorId: 'u3-logdef-solve', seed: 7, tier: 3 },
    ],
  },
  {
    nodeId: 'RF7.log-eval',
    explain: [
      'To evaluate $\\log_b x$ without a calculator, write $x$ as a power of $b$.',
      '$\\log_3 81 = 4$ since $81 = 3^4$. $\\log_2 \\frac{1}{8} = -3$ since $\\frac{1}{8} = 2^{-3}$. $\\log_5 1 = 0$ and $\\log_b b = 1$ for every base.',
      'If both are powers of a smaller number, use it: $\\log_8 4$: $8 = 2^3$, $4 = 2^2$, so $(2^3)^y = 2^2$, $3y = 2$, $y = \\frac{2}{3}$. Roots give fractions: $\\log_3 \\sqrt{3} = \\frac{1}{2}$.',
      'To estimate, bracket $x$ between powers of $b$: $2^5 = 32 < 50 < 64 = 2^6$, so $5 < \\log_2 50 < 6$.',
      'Only positive numbers have logarithms: $\\log_2 0$ and $\\log_2(-4)$ are undefined, because $2^y$ is always positive.',
    ],
    examples: [
      { generatorId: 'u3-logeval-exact', seed: 2, tier: 3 },
      { generatorId: 'u3-logeval-between', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF9.log-graph',
    explore: {
      preset: { explorer: 'exp-log', b: 2, showInverse: true, transform: true },
      predict: {
        question: 'If $y = 2^x + 3$ has asymptote $y = 3$, what is the asymptote of its inverse?',
        options: ['$x = 3$', '$y = 3$', '$x = -3$', '$y = -3$'],
        answer: 0,
        tryIt: 'Set $d = 3$ with the inverse showing and find the red dashed line.',
      },
    },
    explain: [
      '$y = \\log_b x$ (with $b > 1$) passes through $(1, 0)$ and $(b, 1)$, increases, and has the vertical asymptote $x = 0$. Domain $x > 0$, range all real numbers.',
      'For $y = a\\log_b(x - c) + d$: $c$ moves the asymptote to $x = c$; the domain is $x > c$. Find both by solving "argument $> 0$": for $\\log(2x - 6)$, $2x - 6 > 0$ gives $x > 3$.',
      'If the argument is $c - x$, the graph is reflected in a vertical line and the domain is $x < c$.',
      'The inverse of $y = \\log_b(x - c) + d$ is $y = b^{x - d} + c$: swap $x$ and $y$, isolate the log, rewrite in exponential form. Horizontal and vertical shifts trade places.',
    ],
    examples: [
      { generatorId: 'u3-logg-inverse', seed: 2, tier: 3 },
      { generatorId: 'u3-logg-domain', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'RF8.expand',
    explore: {
      preset: { explorer: 'log-law', problem: 'e1' },
      predict: {
        question: 'Which is equal to $\\log_2\\left(\\frac{8x^3}{y}\\right)$?',
        options: ['$3 + 3\\log_2 x - \\log_2 y$', '$\\frac{3 + 3\\log_2 x}{\\log_2 y}$', '$3 + (\\log_2 x)^3 - \\log_2 y$', '$3\\log_2 8x - \\log_2 y$'],
        answer: 0,
        tryIt: 'Type one law per line and let each line be checked.',
      },
    },
    explain: [
      'Three laws, valid for positive $M$, $N$:',
      '$$\\log_b (MN) = \\log_b M + \\log_b N \\qquad \\log_b \\frac{M}{N} = \\log_b M - \\log_b N \\qquad \\log_b M^p = p\\log_b M$$',
      'They come from the exponent laws, since logs are exponents: multiplying powers adds exponents.',
      'To expand, apply the quotient law first, then the product law, then bring every exponent down as a coefficient. A root is a fractional power: $\\sqrt{A} = A^{1/2}$.',
      'Traps: $\\log(M + N)$ cannot be split. $(\\log M)^p \\ne p\\log M$: the power law needs the exponent inside the log, on $M$ only. $\\frac{\\log M}{\\log N} \\ne \\log M - \\log N$.',
      'Numbers that are powers of the base simplify: $\\log_2 8 = 3$.',
    ],
    examples: [
      { generatorId: 'u3-expand-mc', seed: 2, tier: 3 },
      { generatorId: 'u3-expand-eval', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF8.condense',
    explore: {
      preset: { explorer: 'log-law', problem: 'c1' },
      predict: {
        question: 'Which single logarithm equals $2\\log_5 x + \\log_5 y - 3\\log_5 z$?',
        options: ['$\\log_5\\left(\\frac{x^2y}{z^3}\\right)$', '$\\log_5\\left(\\frac{2xy}{3z}\\right)$', '$\\log_5\\left(x^2 + y - z^3\\right)$', '$\\frac{\\log_5 x^2y}{\\log_5 z^3}$'],
        answer: 0,
        tryIt: 'Condense one law at a time. Try the second option as a line to see it rejected.',
      },
    },
    explain: [
      'Condensing runs the laws backwards. Same base throughout.',
      '1. **Coefficients become exponents**: $2\\log_5 x = \\log_5 x^2$, $\\frac{1}{2}\\log x = \\log\\sqrt{x}$. Do this first.',
      '2. **Sums multiply** inside one log; **differences divide**: everything subtracted goes in the denominator.',
      'Constants: write them as logs of the base. $1 = \\log 10$, $2 = \\log_3 9$.',
      'A coefficient is never multiplied into the argument: $2\\log x = \\log x^2$, not $\\log 2x$.',
      'Evaluating a sum like $\\log_6 4 + \\log_6 9$: neither term is a nice value, but combined it is $\\log_6 36 = 2$. When terms look awkward, condense first.',
    ],
    examples: [
      { generatorId: 'u3-condense-input', seed: 2, tier: 3 },
      { generatorId: 'u3-condense-eval', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF8.change-base',
    explain: [
      '$$\\log_b x = \\frac{\\log_a x}{\\log_a b}$$ for any valid base $a$: argument on top, old base on the bottom.',
      'With a calculator, use base $10$: $\\log_7 20 = \\frac{\\log 20}{\\log 7} \\approx 1.54$.',
      'Without one, choose a base that makes both numbers powers: $\\log_4 8 = \\frac{\\log_2 8}{\\log_2 4} = \\frac{3}{2}$.',
      'It also simplifies products of logs: $\\log_5 6 \\cdot \\log_6 25 = \\frac{\\log 6}{\\log 5}\\cdot\\frac{\\log 25}{\\log 6} = \\log_5 25 = 2$.',
      'The flip $\\frac{\\log b}{\\log x}$ gives $\\log_x b$, the reciprocal. And $\\frac{\\log x}{\\log b}$ is not $\\log\\frac{x}{b}$.',
    ],
    examples: [
      { generatorId: 'u3-cob-exact', seed: 2, tier: 3 },
      { generatorId: 'u3-cob-exact', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF10.exp-common-base',
    explain: [
      'If $b^m = b^n$ (with $b > 0$, $b \\ne 1$) then $m = n$. So rewrite both sides with the same base, then set the exponents equal.',
      'Choose the smallest base: $4$, $8$, $16$, $32$ are powers of $2$; $9$, $27$, $81$ of $3$; $25$, $125$ of $5$. Fractions are negative powers: $\\frac{1}{9} = 3^{-2}$. Roots are fractional powers: $\\sqrt{3} = 3^{1/2}$.',
      'Multiply exponents with brackets: $8^{x+1} = (2^3)^{x+1} = 2^{3(x + 1)} = 2^{3x + 3}$. Forgetting the brackets is the most common error.',
      'If the exponent equation is quadratic, rearrange to $0$ and factor; there may be two solutions.',
      'Check by substituting into the original equation.',
    ],
    examples: [
      { generatorId: 'u3-ecb-solve', seed: 2, tier: 3 },
      { generatorId: 'u3-ecb-quad', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF10.exp-logs',
    explain: [
      'When the sides cannot share a base, take the logarithm of both sides and use the power law to bring the exponent down.',
      '$5^x = 40 \\Rightarrow x\\log 5 = \\log 40 \\Rightarrow x = \\frac{\\log 40}{\\log 5} \\approx 2.29$.',
      '**Isolate the power first.** $3(2)^x = 48$: divide by $3$ to get $2^x = 16$. Never combine $3(2)^x$ into $6^x$.',
      '**Keep brackets** on a binomial exponent: $\\log 3^{x+1} = (x + 1)\\log 3$.',
      'With $x$ on both sides, as in $3^{x + 1} = 5^x$: expand, collect the $x$ terms, factor out $x$, divide. $x\\log 3 - x\\log 5 = -\\log 3$, so $x = \\frac{\\log 3}{\\log 5 - \\log 3}$.',
      'Round only at the end.',
    ],
    examples: [
      { generatorId: 'u3-elog-solve', seed: 2, tier: 3 },
      { generatorId: 'u3-elog-solve', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF10.log-eq',
    explain: [
      'To solve a logarithmic equation with one base:',
      '1. Use the laws to collect each side into a single log.',
      '2. If it is $\\log_b M = k$, rewrite as $M = b^k$. If it is $\\log_b M = \\log_b N$, set $M = N$.',
      '3. Solve the resulting linear or quadratic equation.',
      '4. **Check every root in the original equation.** Each log argument must be positive. A root that makes any argument zero or negative is **extraneous** and is rejected, even if it satisfies the combined equation.',
      'Example: $\\log(x + 7) + \\log(x - 2) = 1$ gives $(x + 7)(x - 2) = 10$, so $x = 3$ or $x = -8$. With $x = -8$, $\\log(-1)$ is undefined: the solution is $x = 3$ only.',
    ],
    examples: [
      { generatorId: 'u3-logeq-solve', seed: 2, tier: 3 },
      { generatorId: 'u3-logeq-same', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'RF10.growth-decay',
    explain: [
      'The formula sheet gives $y = a(b)^{t/p}$.',
      '$a$: initial amount. $b$: growth factor per period ($2$ doubling, $3$ tripling, $\\frac{1}{2}$ half-life). $p$: length of one period. $t$: elapsed time, in the same units as $p$. So $\\frac{t}{p}$ counts periods.',
      'Percent change: growing $6\\%$ per period gives $b = 1.06$; losing $6\\%$ leaves $b = 0.94$.',
      'Amount after a time: substitute and evaluate. Time to reach an amount: substitute, divide by $a$, take logs, and solve for $t$.',
      'Example: half-life $8$ days, $200$ mg to $30$ mg: $\\frac{30}{200} = \\left(\\frac{1}{2}\\right)^{t/8}$, so $t = \\frac{8\\log 0.15}{\\log 0.5} \\approx 21.9$ days.',
    ],
    examples: [
      { generatorId: 'u3-gd-time', seed: 2, tier: 2 },
      { generatorId: 'u3-gd-amount', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'RF10.compound-interest',
    explain: [
      'Compound interest is growth with $A = P(1 + i)^n$, where $i$ is the rate **per compounding period** and $n$ the **number of periods**.',
      'Annual rate $r$ compounded $k$ times a year: $i = \\frac{r}{k}$ and $n = kt$. Annually $k = 1$, semi-annually $2$, quarterly $4$, monthly $12$, weekly $52$, daily $365$.',
      '$\\$2000$ at $4.8\\%$/a compounded monthly for $5$ years: $i = 0.004$, $n = 60$, $A = 2000(1.004)^{60} \\approx \\$2541.28$.',
      'To find time, isolate the power and take logs. Interest is added only at the end of a period, so round **up** to the next whole period and state the answer in periods or years as asked.',
    ],
    examples: [
      { generatorId: 'u3-ci-amount', seed: 2, tier: 2 },
      { generatorId: 'u3-ci-time', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'RF10.log-scales',
    explain: [
      'Log scales compress huge ranges. The formula is always given; differences in readings become ratios of intensities.',
      'Earthquake magnitude $M = \\log\\frac{I}{I_0}$: each $1$ unit is a factor of $10$. Magnitude $7.0$ vs $5.0$: $10^{2} = 100$ times as intense.',
      'pH $= -\\log[H^+]$: lower pH is more acidic. pH $3$ vs pH $5$: $10^{2} = 100$ times the $[H^+]$.',
      'Decibels $\\beta = 10\\log\\frac{I}{I_0}$: every $10$ dB is a factor of $10$, so a difference of $d$ dB is a ratio of $10^{d/10}$.',
      'Method: write the formula for each reading and subtract. The difference of logs is the log of the ratio. Then undo the log.',
      'Going the other way, multiplying intensity by $R$ adds $\\log R$ to the magnitude.',
    ],
    examples: [
      { generatorId: 'u3-ls-ratio', seed: 2, tier: 3 },
      { generatorId: 'u3-ls-ratio', seed: 1, tier: 2 },
    ],
  },
];
