import type { LessonCard } from '../types';

/** Lesson cards in plain words, one small idea per card. Keyed by skill node id. */
export const CARDS: Record<string, LessonCard[]> = {
  'RF11.long-division': [
    {
      say: 'Dividing a polynomial by $x - a$ works like long division with numbers. You repeat four moves: **divide** the first terms, **multiply**, **subtract**, **bring down**.',
      example: ['$(x^2 + 5x + 6) \\div (x + 2)$', 'Divide first terms: $x^2 \\div x = x$.', 'Multiply: $x(x + 2) = x^2 + 2x$.', 'Subtract: $(x^2 + 5x) - (x^2 + 2x) = 3x$. Bring down $+6$: $3x + 6$.', 'Divide: $3x \\div x = 3$. Multiply: $3(x + 2) = 3x + 6$. Subtract: $0$.', 'Answer: $x + 3$.'],
      check: { q: 'You divide $x^3 - 4x^2 + x - 1$ by $x - 1$. What is the first term of the answer?', options: ['$x^2$', '$x^3$', '$x$', '$x^4$'], answer: 0, why: 'Divide the first terms: $x^3 \\div x = x^2$.' },
    },
    {
      say: 'The subtract step is where most mistakes happen. You subtract the **whole** line, so every sign in it flips.',
      example: ['$(x^2 - 3x + 5) \\div (x - 1)$', 'First term: $x$. Multiply: $x(x - 1) = x^2 - x$.', 'Subtract: $-3x - (-x) = -3x + x = -2x$. Bring down $+5$.', 'Next term: $-2$. Multiply: $-2(x - 1) = -2x + 2$.', 'Subtract: $5 - 2 = 3$.', 'Answer $x - 2$, remainder $3$.'],
      check: { q: 'You wrote $x^2 - x$ under $x^2 - 3x$. What do you get when you subtract?', options: ['$-2x$', '$-4x$', '$2x$', '$-3x$'], answer: 0, why: '$-3x - (-x) = -3x + x = -2x$.' },
    },
    {
      say: '**Write every power.** If a power of $x$ is missing, put it in with a $0$ in front. Skipping it puts every column after it in the wrong place.',
      example: ['$x^3 - 5x + 2$ has no $x^2$ term.', 'Write it as $x^3 + 0x^2 - 5x + 2$.', 'Now the powers go $3, 2, 1, 0$ with none skipped.'],
      check: { q: 'Write $2x^3 + 7$ with every power showing.', options: ['$2x^3 + 0x^2 + 0x + 7$', '$2x^3 + 0x^2 + 7$', '$2x^3 + 0x + 7$', '$2x^3 + 7x$'], answer: 0, why: 'Both $x^2$ and $x$ are missing, so each gets a $0$.' },
    },
    {
      say: 'The answer is called the **quotient**, $Q(x)$. Its degree is one less than the polynomial you started with. When you divide by $x - a$, the **remainder** $R$ is just a number.',
      example: ['Divide a degree $3$ polynomial by $x - 2$.', 'The quotient has degree $3 - 1 = 2$.', 'The remainder is a constant, like $5$ or $0$.'],
      check: { q: 'You divide a degree $4$ polynomial by $x + 3$. What is the degree of the quotient?', options: ['$3$', '$4$', '$5$', '$1$'], answer: 0, why: 'Dividing by $x + 3$ lowers the degree by one: $4 - 1 = 3$.' },
    },
    {
      say: 'You record the result as a **division statement**: $P(x) = (x - a)Q(x) + R$. It says the original equals divisor times quotient, plus remainder.',
      example: ['From the last division: $Q(x) = x - 2$, $R = 3$, divisor $x - 1$.', 'Statement: $x^2 - 3x + 5 = (x - 1)(x - 2) + 3$.'],
      check: { q: 'Dividing $P(x)$ by $x - 3$ gives $Q(x) = x + 4$ and $R = -2$. Which statement is correct?', options: ['$P(x) = (x - 3)(x + 4) - 2$', '$P(x) = (x + 4)(x - 2) - 3$', '$P(x) = (x - 3)(x - 2) + 4$', '$P(x) = (x + 3)(x + 4) - 2$'], answer: 0, why: 'Divisor times quotient, plus the remainder: $(x - 3)(x + 4) + (-2)$.' },
    },
    {
      say: 'You can also write it as a fraction: $\\frac{P(x)}{x - a} = Q(x) + \\frac{R}{x - a}$. Then you add the **restriction** $x \\ne a$, because you cannot divide by zero.',
      example: ['$\\frac{x^2 - 3x + 5}{x - 1} = x - 2 + \\frac{3}{x - 1}$', 'The bottom is zero when $x = 1$.', 'Restriction: $x \\ne 1$.'],
      check: { q: 'What is the restriction when you divide by $x + 4$?', options: ['$x \\ne -4$', '$x \\ne 4$', '$x \\ne 0$', 'There is none'], answer: 0, why: '$x + 4 = 0$ when $x = -4$, so $x$ cannot be $-4$.' },
    },
    {
      say: 'To check your division, expand $(x - a)Q(x)$ and add $R$. You should get the original polynomial back.',
      example: ['Check $x^2 - 3x + 5 = (x - 1)(x - 2) + 3$.', '$(x - 1)(x - 2) = x^2 - 2x - x + 2 = x^2 - 3x + 2$.', 'Add $3$: $x^2 - 3x + 5$. It matches.'],
      check: { q: 'Expand $(x + 2)(x + 1) + 4$.', options: ['$x^2 + 3x + 6$', '$x^2 + 3x + 2$', '$x^2 + 2x + 6$', '$x^2 + 3x + 4$'], answer: 0, why: '$(x + 2)(x + 1) = x^2 + 3x + 2$, and $2 + 4 = 6$.' },
    },
  ],

  'RF11.synthetic': [
    {
      say: '**Synthetic division** is a shortcut for dividing by $x - a$. You only write the **coefficients**, the numbers in front of each power, in order from the highest power down.',
      example: ['$x^3 - 2x^2 - 5x + 6$', 'Coefficients: $1, -2, -5, 6$.'],
      check: { q: 'What are the coefficients of $2x^2 - x + 4$?', options: ['$2, -1, 4$', '$2, 1, 4$', '$2, -1$', '$2, 0, -1, 4$'], answer: 0, why: '$2x^2$ gives $2$, $-x$ gives $-1$, and the constant is $4$.' },
    },
    {
      say: 'The number in the corner box is the **zero of the divisor**: the $x$ that makes the divisor equal $0$. For $x - 3$ use $3$. For $x + 2$ use $-2$.',
      example: ['Divisor $x - 3$: solve $x - 3 = 0$, so $x = 3$.', 'Divisor $x + 2$: solve $x + 2 = 0$, so $x = -2$.'],
      check: { q: 'You divide by $x + 5$. What goes in the corner?', options: ['$-5$', '$5$', '$1$', '$0$'], answer: 0, why: '$x + 5 = 0$ when $x = -5$.' },
    },
    {
      say: 'Just like long division, a missing power gets a $0$. Leave it out and every number after it lands in the wrong spot.',
      example: ['$x^3 - 4x + 1$ has no $x^2$ term.', 'Coefficients: $1, 0, -4, 1$.'],
      check: { q: 'What row of coefficients do you write for $x^4 + 2x - 3$?', options: ['$1, 0, 0, 2, -3$', '$1, 2, -3$', '$1, 0, 2, -3$', '$4, 2, -3$'], answer: 0, why: '$x^3$ and $x^2$ are both missing, so each gets a $0$.' },
    },
    {
      say: 'The steps: **bring down** the first coefficient. **Multiply** it by the corner number and write the answer under the next coefficient. **Add** that column. Repeat to the end.',
      example: ['Divide $x^3 - 2x^2 - 5x + 6$ by $x - 3$. Corner: $3$.', 'Bring down $1$.', '$1 \\times 3 = 3$. Add: $-2 + 3 = 1$.', '$1 \\times 3 = 3$. Add: $-5 + 3 = -2$.', '$-2 \\times 3 = -6$. Add: $6 + (-6) = 0$.', 'Bottom row: $1, 1, -2, 0$.'],
      check: { q: 'Corner $2$, coefficients $1, 4, 3$. You bring down the $1$. What number goes under the $4$?', options: ['$2$', '$1$', '$6$', '$-2$'], answer: 0, why: 'Multiply the number you brought down by the corner: $1 \\times 2 = 2$.' },
    },
    {
      say: 'Read the bottom row. The **last** number is the remainder. The other numbers are the coefficients of the quotient, which starts one power lower than $P(x)$.',
      example: ['Bottom row: $1, 1, -2, 0$ from a cubic.', 'Remainder: $0$.', 'Quotient: $1x^2 + 1x - 2 = x^2 + x - 2$.'],
      check: { q: 'Dividing a cubic gives the bottom row $2, -1, 3, 5$. What are the quotient and remainder?', options: ['$Q(x) = 2x^2 - x + 3$, $R = 5$', '$Q(x) = 2x^3 - x^2 + 3x$, $R = 5$', '$Q(x) = -x^2 + 3x + 5$, $R = 2$', '$Q(x) = 2x^2 - x + 3$, $R = 0$'], answer: 0, why: 'The last number, $5$, is the remainder. The rest start one power below $x^3$, at $x^2$.' },
    },
    {
      say: 'The classic slip is using $-3$ for $x - 3$. That divides by $x + 3$ instead. Also, synthetic division only works for divisors like $x - a$. For $2x - 1$, use long division in this course.',
      check: { q: 'Which divisor can you use synthetic division for?', options: ['$x + 4$', '$2x - 1$', '$x^2 + 1$', '$3x + 2$'], answer: 0, why: 'Synthetic division needs a divisor of the form $x - a$. Here $x + 4 = x - (-4)$.' },
    },
    {
      say: 'Put it all together: find the corner, write the coefficients, run the steps, then read the answer.',
      example: ['$(x^2 + 4x - 2) \\div (x + 1)$. Corner: $-1$.', 'Bring down $1$.', '$1 \\times (-1) = -1$. Add: $4 + (-1) = 3$.', '$3 \\times (-1) = -3$. Add: $-2 + (-3) = -5$.', '$Q(x) = x + 3$, $R = -5$.'],
      check: { q: 'Use synthetic division: $(x^2 + x + 3) \\div (x - 2)$.', options: ['$Q(x) = x + 3$, $R = 9$', '$Q(x) = x - 1$, $R = 5$', '$Q(x) = x + 3$, $R = 3$', '$Q(x) = x^2 + 3x$, $R = 9$'], answer: 0, why: 'Corner $2$: bring down $1$; $1 + 2 = 3$; $3 + 3 \\times 2 = 9$. So $x + 3$, remainder $9$.' },
    },
  ],

  'RF11.remainder-thm': [
    {
      say: 'The **remainder theorem**: when you divide $P(x)$ by $x - a$, the remainder is $P(a)$. So you can find a remainder by substituting, with no division at all.',
      example: ['Divide $P(x) = x^2 + 1$ by $x - 2$.', 'Substitute $2$: $P(2) = 2^2 + 1$.', '$4 + 1 = 5$. The remainder is $5$.'],
      check: { q: 'What is the remainder when $x^2 + x + 3$ is divided by $x - 1$?', options: ['$5$', '$3$', '$1$', '$4$'], answer: 0, why: '$P(1) = 1 + 1 + 3 = 5$.' },
    },
    {
      say: 'Why it works: $P(x) = (x - a)Q(x) + R$. Put in $x = a$. The bracket $(a - a)$ is $0$, so the whole first part is $0$. Only $R$ is left.',
      example: ['$P(x) = (x - 4)Q(x) + 7$', '$P(4) = (4 - 4)Q(4) + 7$', '$P(4) = 0 + 7 = 7$'],
      check: { q: 'If $P(x) = (x - 4)Q(x) + 7$, what is $P(4)$?', options: ['$7$', '$0$', '$4$', '$11$'], answer: 0, why: '$(4 - 4) = 0$ wipes out the first part, leaving $7$.' },
    },
    {
      say: 'Watch the sign. For $x - a$, substitute $a$. For $x + a$, substitute $-a$. Use the value that makes the divisor zero.',
      example: ['Divide $P(x) = x^3 - 2x + 1$ by $x + 2$.', 'Substitute $-2$.', '$P(-2) = (-2)^3 - 2(-2) + 1$', '$= -8 + 4 + 1 = -3$', 'The remainder is $-3$.'],
      check: { q: 'To find the remainder when dividing by $x + 3$, which value do you substitute?', options: ['$-3$', '$3$', '$0$', '$\\frac{1}{3}$'], answer: 0, why: '$x + 3 = 0$ when $x = -3$.' },
    },
    {
      say: 'Be careful with powers of negative numbers. An odd power keeps the minus sign. An even power makes it positive.',
      example: ['Divide $P(x) = x^3 + 2x^2 - 1$ by $x + 1$.', '$P(-1) = (-1)^3 + 2(-1)^2 - 1$', '$= -1 + 2(1) - 1$', '$= -1 + 2 - 1 = 0$'],
      check: { q: 'What is the remainder when $2x^3 - x^2 + 4$ is divided by $x - 2$?', options: ['$16$', '$8$', '$-16$', '$20$'], answer: 0, why: '$P(2) = 2(8) - 4 + 4 = 16 - 4 + 4 = 16$.' },
    },
    {
      say: 'The theorem can find a missing coefficient. Substitute, set $P(a)$ equal to the given remainder, then solve for the unknown.',
      example: ['$x^3 + kx - 4$ leaves remainder $6$ when divided by $x - 2$.', '$P(2) = 8 + 2k - 4 = 6$', '$2k + 4 = 6$', '$2k = 2$, so $k = 1$.'],
      check: { q: '$x^2 + kx + 1$ leaves remainder $7$ when divided by $x - 3$. Find $k$.', options: ['$-1$', '$1$', '$3$', '$-3$'], answer: 0, why: '$9 + 3k + 1 = 7$, so $3k = -3$ and $k = -1$.' },
    },
    {
      say: 'With **two** unknowns you need two remainder facts. Each one gives an equation. Then solve the two equations together.',
      example: ['$P(x) = x^3 + ax + b$. Remainder $3$ for $x - 1$, and $-5$ for $x + 1$.', '$P(1)$: $1 + a + b = 3$, so $a + b = 2$.', '$P(-1)$: $-1 - a + b = -5$, so $-a + b = -4$.', 'Add the equations: $2b = -2$, so $b = -1$.', 'Then $a + (-1) = 2$, so $a = 3$.'],
      check: { q: '$P(x) = x^3 + ax + b$ leaves remainder $5$ when divided by $x - 2$. Which equation does that give?', options: ['$8 + 2a + b = 5$', '$-8 - 2a + b = 5$', '$8 + a + b = 5$', '$6 + 2a + b = 5$'], answer: 0, why: 'Substitute $x = 2$: $2^3 + a(2) + b = 8 + 2a + b$, and that equals $5$.' },
    },
  ],

  'RF11.factor-thm': [
    {
      say: 'The **factor theorem**: $x - a$ is a factor of $P(x)$ exactly when $P(a) = 0$. A **factor** divides in evenly, with nothing left over.',
      example: ['$P(x) = x^2 - 5x + 6$. Is $x - 2$ a factor?', '$P(2) = 4 - 10 + 6 = 0$', 'Yes, $x - 2$ is a factor.'],
      check: { q: 'Is $x - 1$ a factor of $x^2 + x - 6$?', options: ['No, because $P(1) = -4$', 'Yes, because $P(1) = 0$', 'Yes, because $1$ divides $6$', 'No, because $P(-1) = -6$'], answer: 0, why: '$P(1) = 1 + 1 - 6 = -4$, which is not $0$.' },
    },
    {
      say: 'This is the remainder theorem with a remainder of $0$. No remainder means the division comes out exact, so $x - a$ is a factor.',
      check: { q: 'Dividing $P(x)$ by $x + 2$ leaves remainder $0$. What do you know?', options: ['$x + 2$ is a factor', '$x - 2$ is a factor', '$P(2) = 0$', '$P(0) = -2$'], answer: 0, why: 'Remainder $0$ means the division is exact, so $x + 2$ is a factor (and $P(-2) = 0$).' },
    },
    {
      say: 'Factors, zeros and $x$-intercepts carry the same information. If $x - a$ is a factor, then $a$ is a **zero** ($P(a) = 0$), and the graph meets the $x$-axis at $a$.',
      example: ['$x - 4$ is a factor of $P(x)$.', 'So $P(4) = 0$: $4$ is a zero.', 'So the graph meets the $x$-axis at $x = 4$.'],
      check: { q: 'You know $P(-3) = 0$. Which is a factor of $P(x)$?', options: ['$x + 3$', '$x - 3$', '$3x$', '$x - 0$'], answer: 0, why: 'A zero at $-3$ comes from $x - (-3) = x + 3$.' },
    },
    {
      say: 'To test a factor with a plus sign, like $x + 3$, substitute the negative: evaluate $P(-3)$.',
      example: ['Is $x + 3$ a factor of $x^3 + 3x^2 - x - 3$?', '$P(-3) = (-3)^3 + 3(-3)^2 - (-3) - 3$', '$= -27 + 27 + 3 - 3 = 0$', 'Yes, $x + 3$ is a factor.'],
      check: { q: 'Is $x + 1$ a factor of $x^3 + 1$?', options: ['Yes, $P(-1) = 0$', 'No, $P(-1) = 2$', 'No, $P(1) = 2$', 'Yes, $P(1) = 0$'], answer: 0, why: '$P(-1) = (-1)^3 + 1 = -1 + 1 = 0$.' },
    },
    {
      say: 'To make $x - a$ a factor when there is an unknown $k$, set $P(a) = 0$ and solve for $k$.',
      example: ['Make $x - 2$ a factor of $x^3 + kx^2 - 4$.', '$P(2) = 8 + 4k - 4 = 0$', '$4k + 4 = 0$', '$4k = -4$, so $k = -1$.'],
      check: { q: 'For which $k$ is $x - 3$ a factor of $x^2 + kx + 6$?', options: ['$-5$', '$5$', '$-15$', '$-3$'], answer: 0, why: '$9 + 3k + 6 = 0$, so $3k = -15$ and $k = -5$.' },
    },
    {
      say: 'To pick which binomial is a factor, test each one. Find the value that makes the binomial zero, substitute it, and look for $0$.',
      example: ['$P(x) = x^3 - 7x + 6$. Test $x - 1$.', '$P(1) = 1 - 7 + 6 = 0$', 'So $x - 1$ is a factor.'],
      check: { q: 'Which is a factor of $x^3 - x^2 - 4x + 4$?', options: ['$x - 2$', '$x + 1$', '$x - 4$', '$x + 4$'], answer: 0, why: '$P(2) = 8 - 4 - 8 + 4 = 0$. The others give $6$, $36$ and $-60$.' },
    },
  ],

  'RF11.integral-zero': [
    {
      say: 'An **integral zero** is a zero that is an integer. The **integral zero theorem**: if the coefficients are integers, any integer zero must divide the **constant term** (the number with no $x$).',
      example: ['$x^2 - 5x + 6 = (x - 2)(x - 3)$', 'Its zeros are $2$ and $3$.', 'Both divide the constant, $6$.'],
      check: { q: 'Which could be an integer zero of $x^3 + 2x - 5$?', options: ['$5$', '$2$', '$3$', '$10$'], answer: 0, why: 'An integer zero must divide the constant $-5$. Only $\\pm 1$ and $\\pm 5$ do.' },
    },
    {
      say: 'So the **candidates** are plus and minus every factor of the constant term. Include $\\pm 1$ and $\\pm$ the constant itself.',
      example: ['$x^3 - 2x^2 - 5x + 6$. Constant: $6$.', 'Factors of $6$: $1, 2, 3, 6$.', 'Candidates: $\\pm 1, \\pm 2, \\pm 3, \\pm 6$.'],
      check: { q: 'List the possible integer zeros of $x^3 + x - 4$.', options: ['$\\pm 1, \\pm 2, \\pm 4$', '$1, 2, 4$', '$\\pm 1, \\pm 4$', '$\\pm 4$'], answer: 0, why: 'The factors of $4$ are $1, 2, 4$, and each can be positive or negative.' },
    },
    {
      say: 'Only the constant term matters. Ignore the other coefficients when you list candidates.',
      example: ['$x^4 - 3x^3 + 10$. Constant: $10$.', 'Factors of $10$: $1, 2, 5, 10$.', 'Candidates: $\\pm 1, \\pm 2, \\pm 5, \\pm 10$.'],
      check: { q: 'List the possible integer zeros of $x^3 - 6x^2 + 11x - 6$.', options: ['$\\pm 1, \\pm 2, \\pm 3, \\pm 6$', '$\\pm 1, \\pm 11$', '$\\pm 1, \\pm 2, \\pm 3, \\pm 6, \\pm 11$', '$1, 2, 3, 6$'], answer: 0, why: 'Use only the constant, $-6$. Its factors are $1, 2, 3, 6$, with both signs.' },
    },
    {
      say: 'A candidate is only a guess. Test each one with the factor theorem, smallest first, until one gives $P(a) = 0$.',
      example: ['$P(x) = x^3 - 2x^2 - 5x + 6$', 'Try $1$: $P(1) = 1 - 2 - 5 + 6 = 0$.', 'So $1$ is a zero and $x - 1$ is a factor.'],
      check: { q: 'Which candidate is a zero of $x^3 - 2x - 4$?', options: ['$2$', '$1$', '$-1$', '$-2$'], answer: 0, why: '$P(2) = 8 - 4 - 4 = 0$. The others give $-5$, $-3$ and $-8$.' },
    },
    {
      say: 'Once one zero works, divide it out with synthetic division. Then factor the quotient to find the other zeros.',
      example: ['Divide $x^3 - 2x^2 - 5x + 6$ by $x - 1$. Corner $1$.', '$1$; $-2 + 1 = -1$; $-5 + (-1) = -6$; $6 + (-6) = 0$.', 'Quotient: $x^2 - x - 6 = (x - 3)(x + 2)$.', 'Zeros: $1$, $3$ and $-2$.'],
      check: { q: 'Factor the quotient $x^2 - x - 6$.', options: ['$(x - 3)(x + 2)$', '$(x + 3)(x - 2)$', '$(x - 6)(x + 1)$', '$(x - 3)(x - 2)$'], answer: 0, why: '$-3 \\times 2 = -6$ and $-3 + 2 = -1$.' },
    },
    {
      say: 'Some zeros are fractions, like $\\frac{1}{2}$ from a factor $2x - 1$. They are not on the integer list. They show up only after you divide out an integer zero and factor the quotient.',
      example: ['$2x^3 - x^2 - 2x + 1$ divided by $x - 1$ gives $2x^2 + x - 1$.', '$2x^2 + x - 1 = (2x - 1)(x + 1)$', '$2x - 1 = 0$ gives $x = \\frac{1}{2}$.'],
      check: { q: 'What zero comes from the factor $3x + 2$?', options: ['$-\\frac{2}{3}$', '$\\frac{2}{3}$', '$-\\frac{3}{2}$', '$-2$'], answer: 0, why: '$3x + 2 = 0$ gives $3x = -2$, so $x = -\\frac{2}{3}$.' },
    },
  ],

  'RF11.factor-full': [
    {
      say: 'To factor **completely** means no factor can be broken down any further using integers. Each piece is linear (like $x - 2$) or cannot be factored more.',
      example: ['$(x - 1)(x^2 - 4)$ is not complete.', '$x^2 - 4$ still factors: $(x - 2)(x + 2)$.', 'Complete: $(x - 1)(x - 2)(x + 2)$.'],
      check: { q: 'Which is factored completely?', options: ['$(x + 1)(x - 3)(x + 3)$', '$(x + 1)(x^2 - 9)$', '$(x^2 - 1)(x - 3)$', '$(x^2 + 4x + 3)(x - 3)$'], answer: 0, why: 'Every other choice still has a quadratic that factors.' },
    },
    {
      say: 'Always look for a **common factor** first. Pulling it out makes the numbers smaller.',
      example: ['$2x^3 - 4x^2 - 10x + 12$', 'Every term divides by $2$.', '$= 2(x^3 - 2x^2 - 5x + 6)$'],
      check: { q: 'Take out the common factor of $3x^3 + 6x^2 - 3x - 6$.', options: ['$3(x^3 + 2x^2 - x - 2)$', '$3(x^3 + 6x^2 - 3x - 6)$', '$3x(x^2 + 2x - 1)$', '$3(x^3 + 2x^2 - 3x - 2)$'], answer: 0, why: 'Divide each term by $3$: $x^3$, $2x^2$, $-x$, $-2$.' },
    },
    {
      say: '**Step 1:** find one zero. List candidates from the constant term, then test them with the factor theorem.',
      example: ['$P(x) = x^3 + 2x^2 - x - 2$. Candidates: $\\pm 1, \\pm 2$.', '$P(1) = 1 + 2 - 1 - 2 = 0$', 'So $x - 1$ is a factor.'],
      check: { q: 'For $x^3 - 4x^2 + x + 6$: $P(1) = 4$ and $P(-1) = 0$. Which factor did you find?', options: ['$x + 1$', '$x - 1$', '$x + 6$', '$x - 4$'], answer: 0, why: 'The zero is $-1$, so the factor is $x - (-1) = x + 1$.' },
    },
    {
      say: '**Step 2:** divide by that factor with synthetic division. The quotient is one degree lower.',
      example: ['Divide $x^3 + 2x^2 - x - 2$ by $x - 1$. Corner $1$.', 'Bring down $1$; $2 + 1 = 3$; $-1 + 3 = 2$; $-2 + 2 = 0$.', 'Quotient: $x^2 + 3x + 2$.'],
      check: { q: 'Divide $x^3 - 4x^2 + x + 6$ by $x + 1$. What is the quotient?', options: ['$x^2 - 5x + 6$', '$x^2 - 3x - 2$', '$x^2 + 5x + 6$', '$x^3 - 5x^2 + 6x$'], answer: 0, why: 'Corner $-1$: $1$; $-4 - 1 = -5$; $1 + 5 = 6$; $6 - 6 = 0$.' },
    },
    {
      say: '**Step 3:** factor the quadratic quotient the usual way. Then write every factor together.',
      example: ['$x^2 + 3x + 2 = (x + 1)(x + 2)$', 'With the factor from step 1:', '$x^3 + 2x^2 - x - 2 = (x - 1)(x + 1)(x + 2)$'],
      check: { q: 'Factor $x^3 - 4x^2 + x + 6$ completely. (It equals $(x + 1)(x^2 - 5x + 6)$.)', options: ['$(x + 1)(x - 2)(x - 3)$', '$(x + 1)(x + 2)(x + 3)$', '$(x - 1)(x - 2)(x - 3)$', '$(x + 1)(x - 1)(x - 6)$'], answer: 0, why: '$x^2 - 5x + 6 = (x - 2)(x - 3)$, since $-2 \\times -3 = 6$ and $-2 + (-3) = -5$.' },
    },
    {
      say: 'A factor can appear more than once. Write a **repeated factor** with an exponent.',
      example: ['$x^3 - 3x + 2$: $P(1) = 1 - 3 + 2 = 0$.', 'Divide by $x - 1$: quotient $x^2 + x - 2$.', '$x^2 + x - 2 = (x + 2)(x - 1)$', 'So $(x - 1)(x - 1)(x + 2) = (x - 1)^2(x + 2)$.'],
      check: { q: '$x^3 - 3x + 2 = (x - 1)(x^2 + x - 2)$. What is the complete factorization?', options: ['$(x - 1)^2(x + 2)$', '$(x - 1)(x + 1)(x + 2)$', '$(x + 1)^2(x - 2)$', '$(x - 1)(x^2 + x - 2)$'], answer: 0, why: '$x^2 + x - 2 = (x + 2)(x - 1)$, so $x - 1$ appears twice.' },
    },
    {
      say: 'For degree $4$ or $5$, repeat steps 1 and 2. Each division lowers the degree by one. Stop when you reach a quadratic.',
      example: ['$x^4 - 5x^2 + 4$: divide by $x - 1$, get $x^3 + x^2 - 4x - 4$.', 'That cubic: divide by $x + 1$, get $x^2 - 4$.', '$x^2 - 4 = (x - 2)(x + 2)$', 'Answer: $(x - 1)(x + 1)(x - 2)(x + 2)$.'],
      check: { q: 'How many divisions take a degree $5$ polynomial down to a quadratic?', options: ['$3$', '$2$', '$4$', '$5$'], answer: 0, why: 'Each division lowers the degree by one: $5 \\to 4 \\to 3 \\to 2$.' },
    },
    {
      say: 'Check your answer. Substitute one of your zeros into the original polynomial and make sure you get $0$. Or expand the factors.',
      example: ['Check $x = -2$ in $x^3 + 2x^2 - x - 2$.', '$(-2)^3 + 2(-2)^2 - (-2) - 2$', '$= -8 + 8 + 2 - 2 = 0$. It checks.'],
      check: { q: 'You factored $P(x)$ as $(x - 1)(x + 1)(x + 2)$. Which value should give $P(x) = 0$?', options: ['$x = -2$', '$x = 2$', '$x = 0$', '$x = 3$'], answer: 0, why: 'The factor $x + 2$ is zero at $x = -2$.' },
    },
  ],

  'RF12.characteristics': [
    {
      say: 'The **degree** is the highest power of $x$. The **leading coefficient** is the number in front of that highest power.',
      example: ['$P(x) = -2x^3 + 5x - 1$', 'Highest power: $x^3$, so the degree is $3$.', 'The number in front of $x^3$ is $-2$.'],
      check: { q: 'For $P(x) = 4 + 3x - x^4$, what are the degree and leading coefficient?', options: ['Degree $4$, leading coefficient $-1$', 'Degree $4$, leading coefficient $4$', 'Degree $1$, leading coefficient $3$', 'Degree $4$, leading coefficient $1$'], answer: 0, why: 'The highest power is $x^4$, and $-x^4$ means $-1 \\cdot x^4$.' },
    },
    {
      say: '**End behaviour** is where the graph goes at the far left and far right. We name it by **quadrants**. **Odd degree** with a **positive** leading coefficient: from quadrant III to quadrant I, like $y = x$.',
      example: ['$y = 2x^3 + 1$: degree $3$ (odd), leading $2$ (positive).', 'Far left it is low (quadrant III).', 'Far right it is high (quadrant I).'],
      check: { q: 'How does $y = x^5 - 4x$ extend?', options: ['From quadrant III to quadrant I', 'From quadrant II to quadrant IV', 'From quadrant II to quadrant I', 'From quadrant III to quadrant IV'], answer: 0, why: 'Odd degree with a positive leading coefficient goes from III to I.' },
    },
    {
      say: '**Odd degree** with a **negative** leading coefficient flips that: from quadrant II to quadrant IV, like $y = -x$. With odd degree the two ends always point opposite ways.',
      example: ['$y = -x^3 + 2x$', 'Degree $3$ (odd), leading $-1$ (negative).', 'Starts high on the left, ends low on the right: II to IV.'],
      check: { q: 'How does $y = -2x^3 + x^2$ extend?', options: ['From quadrant II to quadrant IV', 'From quadrant III to quadrant I', 'From quadrant III to quadrant IV', 'From quadrant II to quadrant I'], answer: 0, why: 'Odd degree, negative leading coefficient: II to IV.' },
    },
    {
      say: '**Even degree**: both ends point the same way. Positive leading coefficient: both up, quadrant II to quadrant I, like $y = x^2$. Negative: both down, quadrant III to quadrant IV.',
      example: ['$y = x^4 - 3x$: even, positive. Both ends up: II to I.', '$y = -x^2 + 5$: even, negative. Both ends down: III to IV.'],
      check: { q: 'How does $y = -3x^4 + x$ extend?', options: ['From quadrant III to quadrant IV', 'From quadrant II to quadrant I', 'From quadrant II to quadrant IV', 'From quadrant III to quadrant I'], answer: 0, why: 'Even degree, negative leading coefficient: both ends go down.' },
    },
    {
      say: 'In **factored form** you do not need to expand. Degree: add the exponents of $x$ in every factor. Leading coefficient: multiply the number in front by the $x$-coefficient of each factor.',
      example: ['$y = 3(x - 1)^2(2x + 1)$', 'Degree: $2 + 1 = 3$.', 'Leading coefficient: $3 \\times 1^2 \\times 2 = 6$.'],
      check: { q: 'For $y = (x + 1)^2(4 - x)$, what are the degree and leading coefficient?', options: ['Degree $3$, leading coefficient $-1$', 'Degree $3$, leading coefficient $1$', 'Degree $2$, leading coefficient $4$', 'Degree $3$, leading coefficient $4$'], answer: 0, why: 'Exponents $2 + 1 = 3$. In $(4 - x)$ the $x$ has coefficient $-1$, so $1 \\times (-1) = -1$.' },
    },
    {
      say: 'The **$y$-intercept** is where the graph crosses the $y$-axis. It is $P(0)$, the constant term. In factored form, put $0$ in for every $x$, keep the exponents, and multiply.',
      example: ['$y = 2(x - 1)^2(x + 3)$', '$P(0) = 2(0 - 1)^2(0 + 3)$', '$= 2(1)(3) = 6$'],
      check: { q: 'What is the $y$-intercept of $y = -(x + 2)(x - 3)^2$?', options: ['$-18$', '$18$', '$-6$', '$6$'], answer: 0, why: '$-(0 + 2)(0 - 3)^2 = -(2)(9) = -18$.' },
    },
    {
      say: 'A degree $n$ polynomial has at most $n$ $x$-intercepts and at most $n - 1$ **turning points** (where the graph changes from rising to falling). Odd degree always has at least one $x$-intercept. Even degree may have none.',
      example: ['Degree $3$: at most $3$ $x$-intercepts, at most $2$ turning points.', 'Its ends point opposite ways, so it must cross the $x$-axis at least once.'],
      check: { q: 'What is the most turning points a degree $5$ polynomial can have?', options: ['$4$', '$5$', '$6$', '$3$'], answer: 0, why: 'At most $n - 1 = 5 - 1 = 4$.' },
    },
  ],

  'RF12.zeros-multiplicity': [
    {
      say: 'A factor $(x - a)$ gives a **zero** at $x = a$. The zero, the **root** and the $x$-intercept are all the same number. Watch the sign flip: $(x + 4)$ gives $x = -4$.',
      example: ['$y = (x - 2)(x + 4)$', '$x - 2 = 0$ gives $x = 2$.', '$x + 4 = 0$ gives $x = -4$.'],
      check: { q: 'What are the zeros of $y = (x - 2)(x + 5)$?', options: ['$2$ and $-5$', '$-2$ and $5$', '$2$ and $5$', '$-2$ and $-5$'], answer: 0, why: '$x - 2 = 0$ gives $2$; $x + 5 = 0$ gives $-5$.' },
    },
    {
      say: 'The **multiplicity** of a zero is the exponent on its factor. It tells you how many times that factor appears.',
      example: ['$y = (x - 1)^3(x + 2)$', 'Zero $1$ has multiplicity $3$.', 'Zero $-2$ has multiplicity $1$.'],
      check: { q: 'In $y = x^2(x + 3)$, what is the multiplicity of the zero at $x = 0$?', options: ['$2$', '$1$', '$3$', '$0$'], answer: 0, why: '$x^2$ is the factor $(x - 0)$ with exponent $2$.' },
    },
    {
      say: '**Multiplicity 1**: the graph **crosses** the $x$-axis there, passing straight through like a line.',
      example: ['$y = (x - 3)(x + 1)$', 'Both zeros have multiplicity $1$.', 'The graph crosses the axis at $x = -1$ and at $x = 3$.'],
      check: { q: 'What does the graph of $y = (x + 2)(x - 5)^2$ do at $x = -2$?', options: ['It crosses the $x$-axis', 'It touches and turns back', 'It crosses and flattens', 'It does not meet the axis'], answer: 0, why: '$(x + 2)$ has exponent $1$, so the graph crosses there.' },
    },
    {
      say: '**Multiplicity 2**: the graph **touches** the axis and turns back, like a parabola at its vertex. People call this a **bounce**. The sign of $P(x)$ does not change there.',
      example: ['$y = (x - 1)^2$', 'At $x = 1$ the graph touches the axis.', 'It is positive on both sides of $x = 1$.'],
      check: { q: 'What does $y = (x - 4)^2(x + 1)$ do at $x = 4$?', options: ['It touches and turns back', 'It crosses straight through', 'It crosses and flattens', 'It does not meet the axis'], answer: 0, why: 'The exponent on $(x - 4)$ is $2$, so it bounces.' },
    },
    {
      say: '**Multiplicity 3**: the graph crosses, but it flattens out as it goes through, like $y = x^3$ at the origin.',
      example: ['$y = (x + 2)^3$', 'At $x = -2$ the graph levels off for a moment.', 'Then it keeps going to the other side of the axis.'],
      check: { q: 'What does $y = x(x - 2)^3$ do at $x = 2$?', options: ['It crosses and flattens', 'It crosses straight through', 'It touches and turns back', 'It does not meet the axis'], answer: 0, why: 'The exponent on $(x - 2)$ is $3$: a flattened crossing.' },
    },
    {
      say: 'The pattern: **odd** multiplicity, the sign of $P(x)$ changes (the graph switches sides). **Even** multiplicity, the sign stays the same (the graph stays on one side).',
      check: { q: 'At a zero of multiplicity $4$, what happens to the sign of $P(x)$?', options: ['It stays the same', 'It changes', 'It becomes zero everywhere', 'It depends on the $y$-intercept'], answer: 0, why: '$4$ is even, so the graph touches and stays on the same side.' },
    },
    {
      say: 'The degree is the sum of the multiplicities. From a graph, the **least possible degree** counts $1$ for each crossing, $2$ for each bounce and $3$ for each flattened crossing.',
      example: ['Crosses at $x = -2$: $1$.', 'Bounces at $x = 1$: $2$.', 'Flattened crossing at $x = 4$: $3$.', 'Least possible degree: $1 + 2 + 3 = 6$.'],
      check: { q: 'A graph crosses at $x = -3$, bounces at $x = 0$ and crosses at $x = 2$. What is the least possible degree?', options: ['$4$', '$3$', '$5$', '$2$'], answer: 0, why: '$1 + 2 + 1 = 4$.' },
    },
  ],

  'RF12.sketch': [
    {
      say: 'To sketch from factored form, first find each **zero** and its multiplicity. That tells you where the graph meets the $x$-axis and what it does there.',
      example: ['$P(x) = (x + 2)(x - 1)^2$', 'Zero $-2$, multiplicity $1$: crosses.', 'Zero $1$, multiplicity $2$: bounces.'],
      check: { q: 'For $P(x) = -x^2(x + 3)(x - 2)$, where does the graph bounce?', options: ['At $x = 0$', 'At $x = -3$', 'At $x = 2$', 'At $x = 3$'], answer: 0, why: '$x^2$ is the only squared factor, and it gives the zero $0$.' },
    },
    {
      say: 'Next, find the $y$-intercept, $P(0)$. Put $0$ in for every $x$.',
      example: ['$P(x) = (x + 2)(x - 1)^2$', '$P(0) = (2)(-1)^2$', '$= 2(1) = 2$'],
      check: { q: 'What is the $y$-intercept of $P(x) = (x - 3)(x + 1)^2$?', options: ['$-3$', '$3$', '$-9$', '$1$'], answer: 0, why: '$(0 - 3)(0 + 1)^2 = (-3)(1) = -3$.' },
    },
    {
      say: 'Then find the **end behaviour**. The degree is the sum of the multiplicities. Use it with the sign of the leading coefficient.',
      example: ['$P(x) = (x + 2)(x - 1)^2$', 'Degree: $1 + 2 = 3$, odd.', 'Leading coefficient $1$, positive.', 'Ends: quadrant III to quadrant I.'],
      check: { q: 'What is the end behaviour of $P(x) = -x^2(x + 3)(x - 2)$?', options: ['From quadrant III to quadrant IV', 'From quadrant II to quadrant I', 'From quadrant II to quadrant IV', 'From quadrant III to quadrant I'], answer: 0, why: 'Degree $2 + 1 + 1 = 4$ (even) and leading coefficient $-1$: both ends down.' },
    },
    {
      say: 'Now draw. Start at the left end, move right, and obey each zero: cross, bounce or flatten. Pass through the $y$-intercept on the way.',
      example: ['$P(x) = (x + 2)(x - 1)^2$', 'Start low on the left (quadrant III).', 'Cross up through $x = -2$, pass through $(0, 2)$.', 'Come down, touch at $x = 1$, turn back up.', 'End high on the right (quadrant I).'],
      check: { q: 'A graph comes from below and reaches a zero of multiplicity $2$. What does it do next?', options: ['Turns back down', 'Keeps going up', 'Flattens and keeps going up', 'Stops'], answer: 0, why: 'At an even multiplicity zero the graph touches and turns back to the side it came from.' },
    },
    {
      say: 'A **sign chart** shows where $P(x)$ is positive or negative. Start at the far right: it has the sign of the leading coefficient. Moving left, the sign changes only at **odd** multiplicity zeros.',
      example: ['$P(x) = -x^2(x + 3)(x - 2)$. Far right: negative.', 'Pass $2$ (odd): positive on $0 < x < 2$.', 'Pass $0$ (even): still positive on $-3 < x < 0$.', 'Pass $-3$ (odd): negative for $x < -3$.'],
      check: { q: 'For $P(x) = (x + 2)(x - 1)^2$, what is the sign of $P(x)$ when $x < -2$?', options: ['Negative', 'Positive', 'Zero', 'It changes'], answer: 0, why: 'Positive far right. At $1$ (even) it stays positive. At $-2$ (odd) it flips to negative.' },
    },
    {
      say: 'Use the sign chart to answer "where is $P(x) > 0$?" List the intervals with a plus sign. Leave the zeros out for $>$ or $<$. Include them for $\\ge$ or $\\le$.',
      example: ['$P(x) = -x^2(x + 3)(x - 2)$', 'Positive on $-3 < x < 0$ and $0 < x < 2$.', 'So $P(x) > 0$ on $(-3, 0) \\cup (0, 2)$.'],
      check: { q: 'For $P(x) = (x + 2)(x - 1)^2$, where is $P(x) < 0$?', options: ['$(-\\infty, -2)$', '$(-2, 1)$', '$(1, \\infty)$', '$(-\\infty, 1)$'], answer: 0, why: 'The only negative part of the sign chart is left of $-2$.' },
    },
    {
      say: 'A sketch must get the intercepts, the behaviour at each zero and the ends right. It does not need exact turning points. Those need technology.',
      check: { q: 'Which detail does a hand sketch NOT need to be exact?', options: ['The height of a turning point', 'The $x$-intercepts', 'The $y$-intercept', 'The end behaviour'], answer: 0, why: 'Turning points need a calculator. The other three you can find exactly by hand.' },
    },
  ],

  'RF12.equation-from-graph': [
    {
      say: 'Working backwards from a graph: each $x$-intercept $a$ gives a factor $(x - a)$. Watch the sign flip.',
      example: ['Intercept at $x = -2$: factor $(x + 2)$.', 'Intercept at $x = 3$: factor $(x - 3)$.'],
      check: { q: 'A graph has an $x$-intercept at $x = 5$. Which factor does that give?', options: ['$(x - 5)$', '$(x + 5)$', '$(5x)$', '$(x - 0.5)$'], answer: 0, why: 'A zero at $5$ comes from $x - 5 = 0$.' },
    },
    {
      say: 'How the graph behaves at each intercept gives the exponent. Cross: $1$. Bounce: $2$. Flattened crossing: $3$. Use these smallest exponents for the **least degree**.',
      example: ['Bounces at $x = -1$: $(x + 1)^2$.', 'Crosses at $x = 3$: $(x - 3)$.'],
      check: { q: 'A graph bounces at $x = 3$. Which factor does that give?', options: ['$(x - 3)^2$', '$(x - 3)$', '$(x + 3)^2$', '$(x - 3)^3$'], answer: 0, why: 'A bounce means multiplicity $2$, and the zero $3$ gives $x - 3$.' },
    },
    {
      say: 'Write the equation with an unknown number $a$ in front: $y = a(\\ldots)(\\ldots)$. The value $a$ stretches the graph and sets its direction.',
      example: ['Bounces at $x = -1$, crosses at $x = 3$.', '$y = a(x + 1)^2(x - 3)$'],
      check: { q: 'A graph crosses at $x = -4$ and flattens through $x = 1$. Which form fits?', options: ['$y = a(x + 4)(x - 1)^3$', '$y = a(x - 4)(x + 1)^3$', '$y = a(x + 4)^3(x - 1)$', '$y = a(x + 4)(x - 1)^2$'], answer: 0, why: 'Cross at $-4$: $(x + 4)$. Flattened crossing at $1$: $(x - 1)^3$.' },
    },
    {
      say: 'Find $a$ with a known point, usually the $y$-intercept. Put in $x = 0$, multiply out the brackets, and solve for $a$.',
      example: ['$y = a(x + 1)^2(x - 3)$, $y$-intercept $-6$.', 'At $x = 0$: $a(1)^2(-3) = -3a$.', '$-3a = -6$', '$a = 2$'],
      check: { q: '$y = a(x - 1)(x + 2)$ has $y$-intercept $4$. Find $a$.', options: ['$-2$', '$2$', '$4$', '$-4$'], answer: 0, why: 'At $x = 0$: $a(-1)(2) = -2a = 4$, so $a = -2$.' },
    },
    {
      say: 'Any point on the graph works, not only the $y$-intercept. Put in its $x$ and $y$, then solve for $a$.',
      example: ['$y = a(x - 2)(x + 1)^2$ passes through $(1, 8)$.', '$8 = a(1 - 2)(1 + 1)^2$', '$8 = a(-1)(4) = -4a$', '$a = -2$'],
      check: { q: '$y = a(x + 1)(x - 3)$ passes through $(1, 12)$. Find $a$.', options: ['$-3$', '$3$', '$12$', '$-12$'], answer: 0, why: '$(1 + 1)(1 - 3) = (2)(-2) = -4$, so $-4a = 12$ and $a = -3$.' },
    },
    {
      say: 'Check that the sign of $a$ matches the ends of the graph. An even degree graph that opens down needs $a < 0$. An odd degree graph rising to the right needs $a > 0$.',
      check: { q: 'An even degree graph has both ends going down. What must be true of $a$?', options: ['$a < 0$', '$a > 0$', '$a = 0$', '$a$ can be either sign'], answer: 0, why: 'Even degree with both ends down means a negative leading coefficient.' },
    },
    {
      say: 'Put it all together: factors from the intercepts, exponents from the behaviour, then $a$ from a point.',
      example: ['Crosses at $x = -2$, bounces at $x = 1$, $y$-intercept $-4$.', '$y = a(x + 2)(x - 1)^2$', 'At $x = 0$: $a(2)(1) = 2a = -4$, so $a = -2$.', '$y = -2(x + 2)(x - 1)^2$'],
      check: { q: 'A graph bounces at $x = 2$, crosses at $x = -1$, and has $y$-intercept $8$. Which equation fits?', options: ['$y = 2(x + 1)(x - 2)^2$', '$y = 8(x + 1)(x - 2)^2$', '$y = 2(x - 1)(x + 2)^2$', '$y = -2(x + 1)(x - 2)^2$'], answer: 0, why: 'At $x = 0$: $a(1)(4) = 4a = 8$, so $a = 2$.' },
    },
  ],

  'RF12.analyze-calc': [
    {
      say: 'When a polynomial does not factor nicely, use the graphing calculator. For any polynomial the **domain** (all allowed $x$-values) is all real numbers.',
      check: { q: 'What is the domain of $P(x) = x^4 - 3x^2 + 2x - 7$?', options: ['All real numbers', '$x \\ge 0$', '$[-7, \\infty)$', '$x \\ne 0$'], answer: 0, why: 'You can put any real number into a polynomial.' },
    },
    {
      say: 'First set a good **window**, the part of the graph the screen shows. Every turning point and every intercept must be visible. If you are unsure, zoom out first.',
      check: { q: 'Your screen shows only one turning point of a quartic. What should you do?', options: ['Zoom out or widen the window', 'Use that turning point', 'Change the equation', 'Round the answer more'], answer: 0, why: 'A quartic can have up to $3$ turning points. You must see them all before choosing.' },
    },
    {
      say: 'To find a zero, use the **zero** feature for each $x$-intercept. Round only your final answer, never in the middle.',
      example: ['TI-84 Plus: 2nd TRACE (CALC), 2:zero.', 'Set a left bound and a right bound around the intercept.', 'Press ENTER for the guess.', 'Round the result, for example to the nearest hundredth.'],
      check: { q: 'The calculator shows a zero at $x = 1.7320508$. What is it to the nearest hundredth?', options: ['$1.73$', '$1.74$', '$1.7$', '$1.732$'], answer: 0, why: 'The thousandths digit is $2$, so you keep $1.73$.' },
    },
    {
      say: 'A **local** minimum is the bottom of one valley. The **absolute** minimum is the lowest point on the whole graph. If there are two valleys, check both and take the lower one.',
      example: ['A W-shaped quartic has two local minimums.', 'Their $y$-values are $-3.20$ and $-7.50$.', 'The absolute minimum is $-7.50$, the lower one.'],
      check: { q: 'A graph has local minimums with $y$-values $4.10$ and $-2.60$. What is the absolute minimum value?', options: ['$-2.60$', '$4.10$', '$1.50$', 'There is none'], answer: 0, why: 'The absolute minimum is the lowest $y$-value: $-2.60 < 4.10$.' },
    },
    {
      say: 'An absolute **maximum** exists only for even degree opening down. An absolute minimum exists only for even degree opening up. An odd degree graph has neither, because its ends go to opposite infinities.',
      check: { q: 'Does $y = x^3 - 4x$ have an absolute maximum?', options: ['No, because it has odd degree', 'Yes, at its higher turning point', 'Yes, at its $y$-intercept', 'No, because it has no turning points'], answer: 0, why: 'Odd degree rises forever on the right, so no point is the highest.' },
    },
    {
      say: 'The **range** is all the $y$-values. Even degree with $a > 0$: $[\\text{minimum}, \\infty)$. Use a square bracket because the minimum value is reached.',
      example: ['Even degree, opens up.', 'Absolute minimum: $-7.50$.', 'Range: $[-7.50, \\infty)$.'],
      check: { q: 'An even degree polynomial with $a > 0$ has local minimums $4.10$ and $-2.60$. What is its range?', options: ['$[-2.60, \\infty)$', '$(-2.60, \\infty)$', '$[4.10, \\infty)$', '$(-\\infty, \\infty)$'], answer: 0, why: 'Use the lower minimum, with a square bracket because it is reached.' },
    },
    {
      say: 'Even degree with $a < 0$: the range is $(-\\infty, \\text{maximum}]$. Odd degree: the range is all real numbers.',
      example: ['Even degree, opens down, absolute maximum $5.25$.', 'Range: $(-\\infty, 5.25]$.', 'Odd degree: range $(-\\infty, \\infty)$.'],
      check: { q: 'A degree $4$ polynomial with $a < 0$ has absolute maximum $5.25$. What is its range?', options: ['$(-\\infty, 5.25]$', '$[5.25, \\infty)$', '$(-\\infty, 5.25)$', '$(-\\infty, \\infty)$'], answer: 0, why: 'It opens down, so every $y$-value up to and including $5.25$ is reached.' },
    },
  ],

  'RF12.model': [
    {
      say: 'A **polynomial model** turns a word problem into a function. Then the calculator finds the answer. A common one is the **open-top box**: cut a square of side $x$ from each corner of a sheet, then fold up the sides.',
      example: ['The folded-up flaps become the walls.', 'Each wall is $x$ tall.', 'So the height of the box is $x$.'],
      check: { q: 'Squares of side $x$ cm are cut from the corners. What is the height of the box?', options: ['$x$', '$2x$', '$x^2$', 'The width of the sheet'], answer: 0, why: 'The flaps you fold up are $x$ wide, so the walls are $x$ tall.' },
    },
    {
      say: 'Each side of the sheet loses a square at **both** ends. So each length goes down by $2x$, not $x$.',
      example: ['Sheet: $20$ cm by $12$ cm.', 'Length of the base: $20 - 2x$.', 'Width of the base: $12 - 2x$.'],
      check: { q: 'A sheet is $30$ cm by $18$ cm. What is the width of the base?', options: ['$18 - 2x$', '$18 - x$', '$30 - 2x$', '$18x - 2$'], answer: 0, why: 'A square comes off each end of the $18$ cm side: $18 - 2x$.' },
    },
    {
      say: 'Volume is length times width times height. So $V(x) = x(\\text{length} - 2x)(\\text{width} - 2x)$.',
      example: ['Sheet: $20$ cm by $12$ cm.', 'Height $x$, base $(20 - 2x)$ by $(12 - 2x)$.', '$V(x) = x(20 - 2x)(12 - 2x)$'],
      check: { q: 'Which function gives the volume for a $16$ cm by $10$ cm sheet?', options: ['$V(x) = x(16 - 2x)(10 - 2x)$', '$V(x) = x(16 - x)(10 - x)$', '$V(x) = (16 - 2x)(10 - 2x)$', '$V(x) = x^2(16 - 2x)(10 - 2x)$'], answer: 0, why: 'Height $x$ times the base, where each side lost $2x$.' },
    },
    {
      say: 'Every length must be positive, so $x$ is **restricted**. You need $x > 0$ and the shorter side minus $2x$ above $0$. The domain is $0 < x < \\frac{w}{2}$ for the shorter side $w$.',
      example: ['Sheet $20$ by $12$. Shorter side: $12$.', '$12 - 2x > 0$', '$12 > 2x$, so $x < 6$.', 'Domain: $0 < x < 6$.'],
      check: { q: 'What is the domain for a box made from a $30$ cm by $18$ cm sheet?', options: ['$0 < x < 9$', '$0 < x < 15$', '$0 < x < 18$', '$x > 0$'], answer: 0, why: 'The shorter side is $18$, and $18 - 2x > 0$ gives $x < 9$.' },
    },
    {
      say: 'To find the maximum volume, graph $V(x)$ with the window set to the domain and use the **maximum** feature. A turning point outside the domain does not count. Include units: cm for $x$, cm$^3$ for volume.',
      example: ['$V(x) = x(20 - 2x)(12 - 2x)$, domain $0 < x < 6$.', 'Maximum at $x \\approx 2.43$ cm.', '$V \\approx 262.7$ cm$^3$.', 'The other turning point, near $x \\approx 8.24$, is outside the domain.'],
      check: { q: 'The domain is $0 < x < 6$. The graph has turning points at $x \\approx 2.43$ and $x \\approx 8.24$. Which gives the maximum volume?', options: ['$x \\approx 2.43$', '$x \\approx 8.24$', 'Both', 'Neither'], answer: 0, why: '$8.24$ is outside the domain, where a side length would be negative.' },
    },
    {
      say: 'For **consecutive integers** (whole numbers in a row), call them $x$, $x + 1$, $x + 2$. For consecutive even or consecutive odd integers, step by $2$: $x$, $x + 2$, $x + 4$.',
      example: ['Three consecutive integers starting at $4$: $4, 5, 6$.', 'Three consecutive odd integers starting at $5$: $5, 7, 9$.'],
      check: { q: 'The smallest of three consecutive even integers is $x$. Which expression is their product?', options: ['$x(x + 2)(x + 4)$', '$x(x + 1)(x + 2)$', '$2x(2x + 1)(2x + 2)$', '$x(x + 2)(x + 3)$'], answer: 0, why: 'Even numbers in a row are $2$ apart.' },
    },
    {
      say: 'Write the product equation, expand it, and move the number to one side so it equals $0$. Then find a zero with the calculator or the integral zero theorem.',
      example: ['Product of three consecutive integers is $120$.', '$x(x + 1)(x + 2) = 120$', '$x^3 + 3x^2 + 2x - 120 = 0$', 'Try $x = 4$: $4 \\times 5 \\times 6 = 120$. It works.', 'The integers are $4, 5, 6$.'],
      check: { q: 'The product of three consecutive integers is $210$. What is the smallest?', options: ['$5$', '$6$', '$7$', '$4$'], answer: 0, why: '$5 \\times 6 \\times 7 = 30 \\times 7 = 210$.' },
    },
  ],
};
