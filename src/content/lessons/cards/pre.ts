import type { LessonCard } from '../types';

/** Lesson cards in plain words, one small idea per card. Keyed by skill node id. */
export const CARDS: Record<string, LessonCard[]> = {
  'P.exp-laws': [
    {
      say: 'An **exponent** tells how many copies of a number to multiply together. In $2^3$, the $2$ is the **base** (the number being multiplied) and the $3$ is the exponent.',
      example: ['$2^3$ means $2 \\cdot 2 \\cdot 2$.', '$2 \\cdot 2 = 4$, then $4 \\cdot 2 = 8$.', 'So $2^3 = 8$.'],
      check: { q: 'What is $3^2$?', options: ['$9$', '$6$', '$5$', '$8$'], answer: 0, why: '$3^2 = 3 \\cdot 3 = 9$. It is not $3 \\cdot 2$.' },
    },
    {
      say: 'When you **multiply** powers with the same base, **add** the exponents. Multiply the numbers in front as usual.',
      example: ['$x^2 \\cdot x^3 = (x \\cdot x)(x \\cdot x \\cdot x)$', 'That is five $x$s multiplied: $x^5$.', 'Shortcut: $2 + 3 = 5$.', 'With numbers: $(2x^4)(3x^2) = 6x^6$.'],
      check: { q: 'Simplify $x^4 \\cdot x^2$.', options: ['$x^6$', '$x^8$', '$x^2$', '$2x^6$'], answer: 0, why: 'Same base, multiplying: add the exponents. $4 + 2 = 6$.' },
    },
    {
      say: 'When you **divide** powers with the same base, **subtract** the exponents: top minus bottom. Divide the numbers in front as usual.',
      example: ['$\\frac{12x^7}{4x^3}$', 'Numbers: $12 \\div 4 = 3$.', 'Exponents: $7 - 3 = 4$.', 'Answer: $3x^4$.'],
      check: { q: 'Simplify $\\frac{10x^6}{2x^2}$.', options: ['$5x^4$', '$5x^3$', '$8x^4$', '$5x^8$'], answer: 0, why: '$10 \\div 2 = 5$ and $6 - 2 = 4$.' },
    },
    {
      say: 'A **power of a power** means you **multiply** the exponents.',
      example: ['$(x^2)^3 = x^2 \\cdot x^2 \\cdot x^2$', 'Add: $2 + 2 + 2 = 6$.', 'Shortcut: $2 \\times 3 = 6$.', 'So $(x^2)^3 = x^6$.'],
      check: { q: 'Simplify $(x^4)^2$.', options: ['$x^8$', '$x^6$', '$x^{16}$', '$2x^4$'], answer: 0, why: 'Power of a power: multiply. $4 \\times 2 = 8$.' },
    },
    {
      say: 'An exponent outside a bracket reaches **every** factor inside, including the number in front.',
      example: ['$(2x^3)^2$', 'The number: $2^2 = 4$.', 'The variable: $(x^3)^2 = x^6$.', 'Answer: $4x^6$, not $2x^6$.'],
      check: { q: 'Simplify $(3x^2)^3$.', options: ['$27x^6$', '$3x^6$', '$9x^6$', '$27x^5$'], answer: 0, why: '$3^3 = 27$ and $(x^2)^3 = x^6$.' },
    },
    {
      say: 'Any nonzero base to the exponent **zero** equals $1$: $x^0 = 1$ when $x \\ne 0$.',
      example: ['$\\frac{x^3}{x^3} = x^{3 - 3} = x^0$', 'But anything divided by itself is $1$.', 'So $x^0 = 1$. Also $5^0 = 1$.'],
      check: { q: 'What is $7^0$?', options: ['$1$', '$0$', '$7$', '$-7$'], answer: 0, why: 'Any nonzero number to the power $0$ is $1$.' },
    },
    {
      say: 'A **negative exponent** means "flip it into a fraction": $x^{-n} = \\frac{1}{x^n}$. The minus sign in the exponent does not make the answer negative.',
      example: ['$2^{-3}$', 'Flip: $\\frac{1}{2^3}$.', '$2^3 = 8$.', 'So $2^{-3} = \\frac{1}{8}$.'],
      check: { q: 'What is $5^{-2}$?', options: ['$\\frac{1}{25}$', '$-25$', '$-10$', '$\\frac{1}{10}$'], answer: 0, why: '$5^{-2} = \\frac{1}{5^2} = \\frac{1}{25}$. A negative exponent is a reciprocal.' },
    },
    {
      say: 'A **fraction exponent** is a root and a power. The **bottom** number is the root. The **top** number is the power. Take the root first to keep numbers small.',
      example: ['$8^{2/3}$: bottom $3$ means cube root, top $2$ means square.', '$\\sqrt[3]{8} = 2$, because $2 \\cdot 2 \\cdot 2 = 8$.', 'Then $2^2 = 4$.', 'So $8^{2/3} = 4$.'],
      check: { q: 'What is $27^{2/3}$?', options: ['$9$', '$18$', '$3$', '$81$'], answer: 0, why: '$\\sqrt[3]{27} = 3$, then $3^2 = 9$.' },
    },
    {
      say: 'You can turn a root into a power: $\\sqrt[n]{x^m} = x^{m/n}$. The root number goes on the **bottom**. Then the usual exponent laws work.',
      example: ['$\\sqrt{x} = x^{1/2}$ and $\\sqrt[3]{x} = x^{1/3}$.', '$\\sqrt{x} \\cdot \\sqrt[3]{x} = x^{1/2} \\cdot x^{1/3}$', 'Add: $\\frac{1}{2} + \\frac{1}{3} = \\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$.', 'Answer: $x^{5/6}$.'],
      check: { q: 'Write $\\sqrt[4]{x^3}$ as a power of $x$.', options: ['$x^{3/4}$', '$x^{4/3}$', '$x^{12}$', '$x^{-1}$'], answer: 0, why: 'The root number $4$ goes on the bottom, the power $3$ on top.' },
    },
    {
      say: 'Put it all together. With a negative fraction exponent, flip first, then take the root, then the power.',
      example: ['$16^{-3/4}$', 'Flip: $\\frac{1}{16^{3/4}}$.', 'Root: $\\sqrt[4]{16} = 2$.', 'Power: $2^3 = 8$.', 'So $16^{-3/4} = \\frac{1}{8}$.'],
      check: { q: 'What is $4^{-3/2}$?', options: ['$\\frac{1}{8}$', '$-8$', '$8$', '$-\\frac{1}{8}$'], answer: 0, why: '$\\sqrt{4} = 2$ and $2^3 = 8$. The negative exponent flips it to $\\frac{1}{8}$.' },
    },
  ],

  'P.radicals': [
    {
      say: 'A **square root** undoes squaring: $\\sqrt{36} = 6$ because $6^2 = 36$. Numbers like $1, 4, 9, 16, 25, 36, 49$ are **perfect squares**: their roots are whole numbers.',
      example: ['$\\sqrt{49}$: which number times itself is $49$?', '$7 \\cdot 7 = 49$.', 'So $\\sqrt{49} = 7$.'],
      check: { q: 'What is $\\sqrt{64}$?', options: ['$8$', '$32$', '$16$', '$6$'], answer: 0, why: '$8 \\cdot 8 = 64$.' },
    },
    {
      say: 'You can split a root over a product: $\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$ (for $a, b \\ge 0$).',
      example: ['$\\sqrt{4 \\cdot 9} = \\sqrt{4} \\cdot \\sqrt{9}$', '$= 2 \\cdot 3 = 6$', 'Check: $\\sqrt{36} = 6$ too.'],
      check: { q: 'What is $\\sqrt{4} \\cdot \\sqrt{25}$?', options: ['$10$', '$29$', '$\\sqrt{29}$', '$50$'], answer: 0, why: '$\\sqrt{4} = 2$ and $\\sqrt{25} = 5$, so the product is $10$.' },
    },
    {
      say: 'To **simplify** a root, split off a perfect square factor and take its root. The square root comes out in front.',
      example: ['$\\sqrt{72}$', '$72 = 36 \\cdot 2$, and $36$ is a perfect square.', '$\\sqrt{72} = \\sqrt{36} \\cdot \\sqrt{2}$', '$= 6\\sqrt{2}$'],
      check: { q: 'Simplify $\\sqrt{50}$.', options: ['$5\\sqrt{2}$', '$25\\sqrt{2}$', '$2\\sqrt{5}$', '$10\\sqrt{5}$'], answer: 0, why: '$50 = 25 \\cdot 2$ and $\\sqrt{25} = 5$.' },
    },
    {
      say: 'Use the **largest** perfect square you can find. If a perfect square is still hiding inside, you are not done.',
      example: ['$\\sqrt{48} = \\sqrt{4 \\cdot 12} = 2\\sqrt{12}$, but $12 = 4 \\cdot 3$.', 'Better: $48 = 16 \\cdot 3$.', '$\\sqrt{48} = 4\\sqrt{3}$', 'A number in front multiplies: $3\\sqrt{8} = 3 \\cdot 2\\sqrt{2} = 6\\sqrt{2}$.'],
      check: { q: 'Simplify $\\sqrt{32}$ fully.', options: ['$4\\sqrt{2}$', '$2\\sqrt{8}$', '$16\\sqrt{2}$', '$8\\sqrt{2}$'], answer: 0, why: '$32 = 16 \\cdot 2$ and $\\sqrt{16} = 4$. $2\\sqrt{8}$ still has a $4$ inside.' },
    },
    {
      say: 'Only **like radicals** (same number under the root) can be added or subtracted, like like terms. Add the numbers in front; the root stays. $\\sqrt{a} + \\sqrt{b}$ is not $\\sqrt{a + b}$.',
      example: ['$3\\sqrt{2} + 5\\sqrt{2} = 8\\sqrt{2}$', 'Like $3x + 5x = 8x$.', '$\\sqrt{2} + \\sqrt{3}$ cannot be combined.'],
      check: { q: 'Simplify $7\\sqrt{5} - 2\\sqrt{5}$.', options: ['$5\\sqrt{5}$', '$5$', '$9\\sqrt{5}$', '$5\\sqrt{10}$'], answer: 0, why: '$7 - 2 = 5$, and the $\\sqrt{5}$ stays.' },
    },
    {
      say: 'Roots that look different may become like radicals after you simplify. Simplify each one first, then combine.',
      example: ['$\\sqrt{12} + \\sqrt{27}$', '$\\sqrt{12} = \\sqrt{4 \\cdot 3} = 2\\sqrt{3}$', '$\\sqrt{27} = \\sqrt{9 \\cdot 3} = 3\\sqrt{3}$', '$2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}$'],
      check: { q: 'Simplify $\\sqrt{8} + \\sqrt{18}$.', options: ['$5\\sqrt{2}$', '$\\sqrt{26}$', '$6\\sqrt{2}$', '$5\\sqrt{4}$'], answer: 0, why: '$\\sqrt{8} = 2\\sqrt{2}$ and $\\sqrt{18} = 3\\sqrt{2}$, so the sum is $5\\sqrt{2}$.' },
    },
    {
      say: 'To **rationalize** a denominator means to get the root out of the bottom. For $\\frac{a}{\\sqrt{b}}$, multiply top and bottom by $\\sqrt{b}$.',
      example: ['$\\frac{6}{\\sqrt{3}} \\cdot \\frac{\\sqrt{3}}{\\sqrt{3}}$', 'Bottom: $\\sqrt{3} \\cdot \\sqrt{3} = 3$.', 'Top: $6\\sqrt{3}$.', '$\\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$'],
      check: { q: 'Rationalize $\\frac{10}{\\sqrt{5}}$.', options: ['$2\\sqrt{5}$', '$2$', '$10\\sqrt{5}$', '$\\frac{\\sqrt{5}}{2}$'], answer: 0, why: '$\\frac{10\\sqrt{5}}{5} = 2\\sqrt{5}$. The top gets multiplied by $\\sqrt{5}$ too.' },
    },
    {
      say: 'The **conjugate** of $\\sqrt{b} + c$ is $\\sqrt{b} - c$: same terms, middle sign flipped. Multiplying a pair of conjugates removes the root: $(\\sqrt{b} + c)(\\sqrt{b} - c) = b - c^2$.',
      example: ['$(\\sqrt{5} + 1)(\\sqrt{5} - 1)$', '$= 5 - \\sqrt{5} + \\sqrt{5} - 1$', 'The middle terms cancel.', '$= 4$'],
      check: { q: 'What is $(\\sqrt{7} + 2)(\\sqrt{7} - 2)$?', options: ['$3$', '$11$', '$5$', '$\\sqrt{3}$'], answer: 0, why: '$b - c^2 = 7 - 4 = 3$.' },
    },
    {
      say: 'When the bottom is a root plus or minus a number, multiply top and bottom by the **conjugate** of the bottom.',
      example: ['$\\frac{4}{\\sqrt{5} + 1}$: multiply by $\\frac{\\sqrt{5} - 1}{\\sqrt{5} - 1}$.', 'Bottom: $5 - 1 = 4$.', 'Top: $4(\\sqrt{5} - 1)$.', '$\\frac{4(\\sqrt{5} - 1)}{4} = \\sqrt{5} - 1$'],
      check: { q: 'Rationalize $\\frac{2}{\\sqrt{3} - 1}$.', options: ['$\\sqrt{3} + 1$', '$\\sqrt{3} - 1$', '$2\\sqrt{3} + 2$', '$\\frac{2}{\\sqrt{3}}$'], answer: 0, why: 'Multiply by $\\sqrt{3} + 1$: the bottom is $3 - 1 = 2$, so $\\frac{2(\\sqrt{3} + 1)}{2} = \\sqrt{3} + 1$.' },
    },
  ],

  'P.factor-basic': [
    {
      say: '**Factoring** means writing an expression as a product (things multiplied). It is expanding done backwards.',
      example: ['Expanding: $3(x + 2) = 3x + 6$.', 'Factoring goes the other way:', '$3x + 6 = 3(x + 2)$.'],
      check: { q: 'Factor $5x + 10$.', options: ['$5(x + 2)$', '$5(x + 10)$', '$x(5 + 10)$', '$5x(2)$'], answer: 0, why: '$5 \\cdot x = 5x$ and $5 \\cdot 2 = 10$.' },
    },
    {
      say: 'Always start with the **greatest common factor** (GCF): the biggest number and the lowest power of $x$ that divide every term. Take it out front, then divide each term by it.',
      example: ['$6x^3 - 9x^2$', 'Numbers $6$ and $9$: GCF is $3$.', 'Powers $x^3$ and $x^2$: lowest is $x^2$.', 'GCF $3x^2$. Divide: $6x^3 \\div 3x^2 = 2x$ and $9x^2 \\div 3x^2 = 3$.', 'Answer: $3x^2(2x - 3)$.'],
      check: { q: 'Factor out the GCF: $4x^2 + 8x$.', options: ['$4x(x + 2)$', '$4(x^2 + 2x)$', '$2x(2x + 4)$', '$4x(x + 8)$'], answer: 0, why: 'Both terms share $4$ and $x$. $4x^2 \\div 4x = x$ and $8x \\div 4x = 2$.' },
    },
    {
      say: 'If the first term is negative, take out a **negative** GCF. Every sign inside the bracket flips.',
      example: ['$-2x^2 - 6x$', 'GCF: $-2x$.', '$-2x^2 \\div (-2x) = x$', '$-6x \\div (-2x) = +3$', 'Answer: $-2x(x + 3)$.'],
      check: { q: 'Factor $-5x - 15$.', options: ['$-5(x + 3)$', '$-5(x - 3)$', '$5(x + 3)$', '$-5(x - 15)$'], answer: 0, why: '$-15 \\div (-5) = +3$, so the bracket is $x + 3$.' },
    },
    {
      say: 'A **difference of squares** is one square minus another. It factors as $A^2 - B^2 = (A - B)(A + B)$.',
      example: ['$x^2 - 25$', '$x^2$ is $x$ squared; $25$ is $5$ squared.', 'So $A = x$ and $B = 5$.', 'Answer: $(x - 5)(x + 5)$.'],
      check: { q: 'Factor $x^2 - 49$.', options: ['$(x - 7)(x + 7)$', '$(x - 7)^2$', '$(x - 49)(x + 49)$', '$(x + 7)^2$'], answer: 0, why: '$49 = 7^2$, so it is $(x - 7)(x + 7)$.' },
    },
    {
      say: 'The squares can have numbers in front. Find what was squared to get each term.',
      example: ['$9x^2 - 16$', '$9x^2 = (3x)^2$ and $16 = 4^2$.', 'So $A = 3x$ and $B = 4$.', 'Answer: $(3x - 4)(3x + 4)$.'],
      check: { q: 'Factor $4x^2 - 25$.', options: ['$(2x - 5)(2x + 5)$', '$(4x - 5)(4x + 5)$', '$(2x - 25)(2x + 25)$', '$(2x - 5)^2$'], answer: 0, why: '$4x^2 = (2x)^2$ and $25 = 5^2$.' },
    },
    {
      say: 'A **sum** of squares, like $x^2 + 9$, does **not** factor. Only a minus sign between two squares works.',
      example: ['$x^2 - 9 = (x - 3)(x + 3)$', 'Try $(x - 3)(x + 3)$ for $x^2 + 9$: it gives $x^2 - 9$. Wrong.', 'So $x^2 + 9$ stays as it is.'],
      check: { q: 'Which one does NOT factor?', options: ['$x^2 + 16$', '$x^2 - 16$', '$4x^2 - 1$', '$x^2 - 1$'], answer: 0, why: '$x^2 + 16$ is a sum of squares. The others are differences of squares.' },
    },
    {
      say: '**Factor fully** means: after one step, check every factor again. Take out a GCF first, then look for a difference of squares.',
      example: ['$2x^2 - 18$', 'GCF $2$: $2(x^2 - 9)$.', '$x^2 - 9$ is a difference of squares.', 'Answer: $2(x - 3)(x + 3)$.'],
      check: { q: 'Factor fully: $3x^2 - 12$.', options: ['$3(x - 2)(x + 2)$', '$3(x^2 - 4)$', '$3(x - 4)(x + 4)$', '$(3x - 2)(x + 2)$'], answer: 0, why: '$3x^2 - 12 = 3(x^2 - 4)$, and $x^2 - 4 = (x - 2)(x + 2)$.' },
    },
    {
      say: 'A difference of squares can appear twice. Keep factoring until no factor breaks down further.',
      example: ['$x^4 - 16 = (x^2)^2 - 4^2$', '$= (x^2 - 4)(x^2 + 4)$', '$x^2 - 4$ factors again; $x^2 + 4$ does not.', 'Answer: $(x - 2)(x + 2)(x^2 + 4)$.'],
      check: { q: 'Factor fully: $x^4 - 1$.', options: ['$(x - 1)(x + 1)(x^2 + 1)$', '$(x^2 - 1)(x^2 + 1)$', '$(x - 1)^2(x + 1)^2$', '$(x - 1)(x + 1)(x^2 - 1)$'], answer: 0, why: '$x^4 - 1 = (x^2 - 1)(x^2 + 1)$, then $x^2 - 1 = (x - 1)(x + 1)$.' },
    },
    {
      say: '**Grouping** handles four terms. Pair the terms, take a GCF out of each pair, then take out the bracket they share.',
      example: ['$x^3 + 2x^2 + 3x + 6$', 'First pair: $x^2(x + 2)$.', 'Second pair: $3(x + 2)$.', 'Shared bracket $(x + 2)$: answer $(x + 2)(x^2 + 3)$.'],
      check: { q: 'Factor $x^3 + 5x^2 + 2x + 10$.', options: ['$(x + 5)(x^2 + 2)$', '$(x + 2)(x^2 + 5)$', '$(x + 5)(x + 2)$', '$x^2(x + 5)$'], answer: 0, why: '$x^2(x + 5) + 2(x + 5) = (x + 5)(x^2 + 2)$.' },
    },
  ],

  'P.factor-trinomial': [
    {
      say: 'A **trinomial** has three terms. To factor $x^2 + bx + c$, find two numbers that **multiply** to $c$ and **add** to $b$.',
      example: ['$x^2 + 5x + 6$', 'Multiply to $6$, add to $5$: $2$ and $3$.', '$2 \\cdot 3 = 6$ and $2 + 3 = 5$.', 'Answer: $(x + 2)(x + 3)$.'],
      check: { q: 'Factor $x^2 + 7x + 10$.', options: ['$(x + 2)(x + 5)$', '$(x + 1)(x + 10)$', '$(x + 3)(x + 4)$', '$(x + 2)(x + 7)$'], answer: 0, why: '$2 \\cdot 5 = 10$ and $2 + 5 = 7$.' },
    },
    {
      say: 'Check any factoring by **expanding**: multiply each term in the first bracket by each term in the second.',
      example: ['$(x + 2)(x + 3)$', '$= x^2 + 3x + 2x + 6$', '$= x^2 + 5x + 6$ ✓'],
      check: { q: 'Expand $(x + 1)(x + 4)$.', options: ['$x^2 + 5x + 4$', '$x^2 + 4x + 5$', '$x^2 + 4$', '$x^2 + 5x + 5$'], answer: 0, why: '$x^2 + 4x + x + 4 = x^2 + 5x + 4$.' },
    },
    {
      say: 'If $c$ is positive, both numbers have the **same sign** as $b$. So when $b$ is negative, both numbers are negative.',
      example: ['$x^2 - 7x + 12$', 'Multiply to $+12$, add to $-7$.', '$(-3)(-4) = 12$ and $-3 + (-4) = -7$.', 'Answer: $(x - 3)(x - 4)$.'],
      check: { q: 'Factor $x^2 - 6x + 8$.', options: ['$(x - 2)(x - 4)$', '$(x + 2)(x + 4)$', '$(x - 2)(x + 4)$', '$(x - 1)(x - 8)$'], answer: 0, why: '$(-2)(-4) = 8$ and $-2 + (-4) = -6$.' },
    },
    {
      say: 'If $c$ is negative, the numbers have **opposite signs**. The one farther from zero takes the sign of $b$.',
      example: ['$x^2 + 2x - 15$', 'Multiply to $-15$, add to $+2$.', '$5 \\cdot (-3) = -15$ and $5 + (-3) = 2$.', 'Answer: $(x + 5)(x - 3)$.'],
      check: { q: 'Factor $x^2 - x - 12$.', options: ['$(x - 4)(x + 3)$', '$(x + 4)(x - 3)$', '$(x - 6)(x + 2)$', '$(x - 4)(x - 3)$'], answer: 0, why: '$(-4)(3) = -12$ and $-4 + 3 = -1$.' },
    },
    {
      say: 'Look for a **common factor** first. It often turns a hard trinomial into an easy one.',
      example: ['$2x^2 + 10x + 12$', 'Take out $2$: $2(x^2 + 5x + 6)$.', 'Factor the bracket: $2(x + 2)(x + 3)$.'],
      check: { q: 'Factor fully: $3x^2 - 3x - 6$.', options: ['$3(x - 2)(x + 1)$', '$3(x + 2)(x - 1)$', '$3(x - 3)(x + 2)$', '$(x - 2)(x + 1)$'], answer: 0, why: '$3(x^2 - x - 2)$, and $(-2)(1) = -2$, $-2 + 1 = -1$.' },
    },
    {
      say: 'When the first number $a$ is not $1$, use **decomposition**. Step one: find two numbers that multiply to $a \\times c$ and add to $b$.',
      example: ['$6x^2 + x - 2$: $a = 6$, $b = 1$, $c = -2$.', '$a \\times c = 6 \\times (-2) = -12$.', 'Multiply to $-12$, add to $1$: $4$ and $-3$.'],
      check: { q: 'For $2x^2 + 7x + 3$, which two numbers do you need?', options: ['$6$ and $1$', '$3$ and $1$', '$2$ and $3$', '$5$ and $2$'], answer: 0, why: '$a \\times c = 6$. $6 \\cdot 1 = 6$ and $6 + 1 = 7$.' },
    },
    {
      say: 'Step two: split the middle term using your two numbers, then factor by **grouping**.',
      example: ['$6x^2 + x - 2 = 6x^2 + 4x - 3x - 2$', 'Group: $2x(3x + 2) - 1(3x + 2)$', 'Shared bracket: $(3x + 2)(2x - 1)$.', 'Check: $6x^2 - 3x + 4x - 2 = 6x^2 + x - 2$ ✓'],
      check: { q: 'Factor $2x^2 + 7x + 3$.', options: ['$(2x + 1)(x + 3)$', '$(2x + 3)(x + 1)$', '$(x + 6)(x + 1)$', '$(2x + 1)(x + 6)$'], answer: 0, why: '$2x^2 + 6x + x + 3 = 2x(x + 3) + 1(x + 3) = (x + 3)(2x + 1)$.' },
    },
    {
      say: 'Some trinomials use $x^4$ and $x^2$. Let $u = x^2$ to see an ordinary trinomial. Factor, put $x^2$ back, then look for differences of squares.',
      example: ['$x^4 - 5x^2 + 4$, with $u = x^2$: $u^2 - 5u + 4$.', '$= (u - 1)(u - 4)$', 'Put back: $(x^2 - 1)(x^2 - 4)$.', 'Both are differences of squares:', '$(x - 1)(x + 1)(x - 2)(x + 2)$'],
      check: { q: 'Factor fully: $x^4 - 10x^2 + 9$.', options: ['$(x - 1)(x + 1)(x - 3)(x + 3)$', '$(x^2 - 1)(x^2 - 9)$', '$(x - 1)(x - 9)$', '$(x - 1)^2(x - 3)^2$'], answer: 0, why: '$u^2 - 10u + 9 = (u - 1)(u - 9)$, then $x^2 - 1$ and $x^2 - 9$ both factor again.' },
    },
  ],

  'P.quad-solve': [
    {
      say: 'A **quadratic equation** has an $x^2$ term. Before solving, move everything to one side so the other side is **zero**.',
      example: ['$x^2 + 3x = 10$', 'Subtract $10$ from both sides.', '$x^2 + 3x - 10 = 0$'],
      check: { q: 'Rewrite $x^2 = 5x - 6$ with zero on one side.', options: ['$x^2 - 5x + 6 = 0$', '$x^2 + 5x - 6 = 0$', '$x^2 - 5x - 6 = 0$', '$x^2 + 5x + 6 = 0$'], answer: 0, why: 'Subtract $5x$ and add $6$ on both sides.' },
    },
    {
      say: 'The **zero product property**: if two things multiply to zero, one of them is zero. Set each bracket equal to $0$. Watch the sign flip.',
      example: ['$(x - 4)(x + 1) = 0$', '$x - 4 = 0$, so $x = 4$.', '$x + 1 = 0$, so $x = -1$.'],
      check: { q: 'Solve $(x + 3)(x - 5) = 0$.', options: ['$x = -3$ or $x = 5$', '$x = 3$ or $x = -5$', '$x = 3$ or $x = 5$', '$x = -3$ or $x = -5$'], answer: 0, why: '$x + 3 = 0$ gives $-3$; $x - 5 = 0$ gives $5$.' },
    },
    {
      say: 'So to solve by factoring: get zero on one side, factor, then set each factor to zero.',
      example: ['$x^2 + 3x - 10 = 0$', '$(x + 5)(x - 2) = 0$', '$x = -5$ or $x = 2$'],
      check: { q: 'Solve $x^2 - x - 6 = 0$.', options: ['$x = 3$ or $x = -2$', '$x = -3$ or $x = 2$', '$x = 6$ or $x = -1$', '$x = 3$ or $x = 2$'], answer: 0, why: '$x^2 - x - 6 = (x - 3)(x + 2)$.' },
    },
    {
      say: 'If a bracket has a number in front of $x$, solve that bracket like a small equation. The answer may be a fraction.',
      example: ['$(2x - 1)(x + 3) = 0$', '$2x - 1 = 0$, so $2x = 1$, so $x = \\frac{1}{2}$.', '$x + 3 = 0$, so $x = -3$.'],
      check: { q: 'Solve $(3x + 2)(x - 1) = 0$.', options: ['$x = -\\frac{2}{3}$ or $x = 1$', '$x = -2$ or $x = 1$', '$x = \\frac{2}{3}$ or $x = -1$', '$x = -\\frac{3}{2}$ or $x = 1$'], answer: 0, why: '$3x + 2 = 0$ gives $3x = -2$, so $x = -\\frac{2}{3}$.' },
    },
    {
      say: 'If the equation is $x^2 = k$ with $k > 0$, take the square root of both sides. There are **two** answers: $x = \\pm\\sqrt{k}$.',
      example: ['$x^2 = 49$', '$x = \\pm\\sqrt{49}$', '$x = 7$ or $x = -7$, since $(-7)^2 = 49$ too.'],
      check: { q: 'Solve $x^2 - 16 = 0$.', options: ['$x = \\pm 4$', '$x = 4$', '$x = \\pm 8$', '$x = 16$'], answer: 0, why: '$x^2 = 16$, so $x = 4$ or $x = -4$.' },
    },
    {
      say: 'When factoring does not work, use the **quadratic formula** $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$. First read $a$, $b$ and $c$ from $ax^2 + bx + c = 0$, signs included.',
      example: ['$2x^2 - 3x - 5 = 0$', '$a = 2$', '$b = -3$', '$c = -5$'],
      check: { q: 'In $2x^2 - 3x + 5 = 0$, what are $a$, $b$ and $c$?', options: ['$a = 2$, $b = -3$, $c = 5$', '$a = 2$, $b = 3$, $c = 5$', '$a = 2$, $b = -3$, $c = -5$', '$a = -3$, $b = 2$, $c = 5$'], answer: 0, why: 'Each number keeps the sign in front of it: $b = -3$, $c = +5$.' },
    },
    {
      say: 'Put the numbers into the formula. Work out the part under the root first, simplify the root, then divide the **whole top** by $2a$.',
      example: ['$x^2 + 2x - 2 = 0$: $a = 1$, $b = 2$, $c = -2$.', 'Under the root: $2^2 - 4(1)(-2) = 4 + 8 = 12$.', '$x = \\frac{-2 \\pm \\sqrt{12}}{2}$, and $\\sqrt{12} = 2\\sqrt{3}$.', '$x = \\frac{-2 \\pm 2\\sqrt{3}}{2} = -1 \\pm \\sqrt{3}$'],
      check: { q: 'Solve $x^2 - 4x + 1 = 0$.', options: ['$x = 2 \\pm \\sqrt{3}$', '$x = -2 \\pm \\sqrt{3}$', '$x = 4 \\pm \\sqrt{3}$', '$x = 2 \\pm 2\\sqrt{3}$'], answer: 0, why: '$16 - 4 = 12$, so $x = \\frac{4 \\pm 2\\sqrt{3}}{2} = 2 \\pm \\sqrt{3}$.' },
    },
    {
      say: 'The **discriminant** $b^2 - 4ac$ tells how many real roots: positive means two, zero means one (a double root), negative means none. With whole-number $a$, $b$, $c$, a perfect-square discriminant means it factors.',
      example: ['$x^2 + 2x + 5 = 0$', '$b^2 - 4ac = 2^2 - 4(1)(5)$', '$= 4 - 20 = -16$', 'Negative, so no real roots.'],
      check: { q: 'How many real roots does $x^2 - 6x + 9 = 0$ have?', options: ['One (a double root)', 'Two', 'None', 'Three'], answer: 0, why: '$(-6)^2 - 4(1)(9) = 36 - 36 = 0$, so one root.' },
    },
  ],

  'P.quad-vertex': [
    {
      say: 'The graph of a quadratic is a **parabola**. Its turning point is the **vertex**. In **vertex form** $y = a(x - h)^2 + k$, the vertex is $(h, k)$.',
      example: ['$y = (x - 2)^2 + 5$', '$h = 2$ and $k = 5$.', 'Vertex: $(2, 5)$.'],
      check: { q: 'What is the vertex of $y = (x - 4)^2 + 1$?', options: ['$(4, 1)$', '$(-4, 1)$', '$(1, 4)$', '$(4, -1)$'], answer: 0, why: '$h = 4$ and $k = 1$.' },
    },
    {
      say: 'Careful with $h$: it is the number that makes the bracket **zero**. A plus in the bracket means $h$ is negative.',
      example: ['$y = 2(x + 3)^2 - 1$', '$x + 3 = 0$ when $x = -3$, so $h = -3$.', '$k = -1$.', 'Vertex: $(-3, -1)$.'],
      check: { q: 'What is the vertex of $y = (x + 5)^2 - 2$?', options: ['$(-5, -2)$', '$(5, -2)$', '$(-5, 2)$', '$(-2, -5)$'], answer: 0, why: '$x + 5 = 0$ at $x = -5$, so $h = -5$; $k = -2$.' },
    },
    {
      say: 'The **axis of symmetry** is the vertical line through the vertex, $x = h$. The parabola is a mirror image on each side of it.',
      example: ['$y = 3(x - 1)^2 + 4$', 'Vertex $(1, 4)$.', 'Axis of symmetry: $x = 1$.'],
      check: { q: 'What is the axis of symmetry of $y = -(x + 2)^2 + 7$?', options: ['$x = -2$', '$x = 2$', '$y = 7$', '$x = 7$'], answer: 0, why: 'The vertex is $(-2, 7)$, so the axis is $x = -2$.' },
    },
    {
      say: 'The sign of $a$ sets the direction. If $a > 0$ it opens **up** and $k$ is the **minimum** value. If $a < 0$ it opens **down** and $k$ is the **maximum** value.',
      example: ['$y = -2(x - 1)^2 + 6$', '$a = -2$ is negative, so it opens down.', 'The highest point is the vertex: maximum value $6$.'],
      check: { q: 'Describe $y = -(x + 2)^2 + 3$.', options: ['Opens down, maximum value $3$', 'Opens up, minimum value $3$', 'Opens down, maximum value $-2$', 'Opens up, minimum value $-2$'], answer: 0, why: '$a = -1 < 0$, so it opens down, and the top is at $y = 3$.' },
    },
    {
      say: 'The **range** comes from $k$. Opening up: $[k, \\infty)$. Opening down: $(-\\infty, k]$. The square bracket means $k$ is included.',
      example: ['$y = (x - 1)^2 - 4$', 'Opens up, lowest $y$ is $-4$.', 'Range: $[-4, \\infty)$.'],
      check: { q: 'What is the range of $y = -3(x - 2)^2 + 5$?', options: ['$(-\\infty, 5]$', '$[5, \\infty)$', '$(-\\infty, 2]$', '$(-\\infty, 5)$'], answer: 0, why: 'It opens down from $y = 5$, and $5$ is included.' },
    },
    {
      say: 'In **standard form** $y = ax^2 + bx + c$, the vertex has $x = -\\frac{b}{2a}$. Put that $x$ back in to get $y$.',
      example: ['$y = x^2 - 6x + 5$', '$x = -\\frac{-6}{2(1)} = 3$', '$y = 3^2 - 6(3) + 5 = 9 - 18 + 5 = -4$', 'Vertex: $(3, -4)$.'],
      check: { q: 'What is the vertex of $y = x^2 + 4x + 1$?', options: ['$(-2, -3)$', '$(2, 13)$', '$(-2, 13)$', '$(-4, 1)$'], answer: 0, why: '$x = -\\frac{4}{2} = -2$, and $4 - 8 + 1 = -3$.' },
    },
    {
      say: '**Completing the square** turns standard form into vertex form. When $a = 1$, take half the $x$ number, square it, then add and subtract that amount.',
      example: ['$y = x^2 + 6x + 2$', 'Half of $6$ is $3$; $3^2 = 9$.', '$y = (x^2 + 6x + 9) - 9 + 2$', '$y = (x + 3)^2 - 7$'],
      check: { q: 'Write $y = x^2 - 8x + 10$ in vertex form.', options: ['$y = (x - 4)^2 - 6$', '$y = (x + 4)^2 - 6$', '$y = (x - 4)^2 + 26$', '$y = (x - 8)^2 + 10$'], answer: 0, why: 'Half of $-8$ is $-4$, $(-4)^2 = 16$, and $10 - 16 = -6$.' },
    },
    {
      say: 'If $a \\ne 1$, factor $a$ out of the $x$ terms first. The amount you subtract inside the bracket comes out **multiplied by $a$**.',
      example: ['$y = 2x^2 + 12x + 7 = 2(x^2 + 6x) + 7$', '$y = 2(x^2 + 6x + 9 - 9) + 7$', '$y = 2(x + 3)^2 - 2(9) + 7$', '$y = 2(x + 3)^2 - 11$'],
      check: { q: 'Write $y = 3x^2 - 6x + 1$ in vertex form.', options: ['$y = 3(x - 1)^2 - 2$', '$y = 3(x - 1)^2$', '$y = 3(x + 1)^2 - 2$', '$y = 3(x - 1)^2 + 4$'], answer: 0, why: '$3(x^2 - 2x + 1 - 1) + 1 = 3(x - 1)^2 - 3 + 1$.' },
    },
  ],

  'P.func-notation': [
    {
      say: '$f(x)$ is read "f of $x$". It means the **output** of the function $f$ when the **input** is $x$. It does not mean $f$ times $x$.',
      example: ['$f(x) = 2x + 1$', '$f(3)$: put $3$ in place of $x$.', '$f(3) = 2(3) + 1 = 7$'],
      check: { q: 'If $f(x) = 4x - 5$, what is $f(2)$?', options: ['$3$', '$13$', '$-3$', '$8$'], answer: 0, why: '$4(2) - 5 = 8 - 5 = 3$.' },
    },
    {
      say: 'Put a negative input in **brackets** so the signs stay right.',
      example: ['$f(x) = x^2 - 2x$', '$f(-3) = (-3)^2 - 2(-3)$', '$= 9 + 6$', '$= 15$'],
      check: { q: 'If $f(x) = x^2 + x$, what is $f(-2)$?', options: ['$2$', '$-6$', '$6$', '$-2$'], answer: 0, why: '$(-2)^2 + (-2) = 4 - 2 = 2$.' },
    },
    {
      say: 'Each $f(\\ldots)$ is a number. Find each one on its own, then do the arithmetic.',
      example: ['$f(x) = x + 4$. Find $2f(3) - f(1)$.', '$f(3) = 7$ and $f(1) = 5$.', '$2(7) - 5 = 14 - 5 = 9$'],
      check: { q: 'If $f(x) = x^2$, what is $f(2) + f(3)$?', options: ['$13$', '$25$', '$10$', '$36$'], answer: 0, why: '$f(2) = 4$ and $f(3) = 9$, so the sum is $13$.' },
    },
    {
      say: 'Where the number sits matters. $2f(a)$ doubles the **output**. $f(2a)$ doubles the **input**. In the same way, $f(a) + 1$ and $f(a + 1)$ are different.',
      example: ['$f(x) = x^2 + 1$', '$2f(3) = 2(10) = 20$', '$f(6) = 36 + 1 = 37$', 'So $2f(3) \\ne f(2 \\cdot 3)$.'],
      check: { q: 'If $f(x) = x + 5$, what is $2f(1)$?', options: ['$12$', '$7$', '$11$', '$6$'], answer: 0, why: '$f(1) = 6$, then double it: $12$. ($f(2) = 7$ is a different thing.)' },
    },
    {
      say: 'Sometimes you know the **output** and need the input. Set $f(x)$ equal to that output and **solve** for $x$.',
      example: ['$f(x) = 3x - 2$. When is $f(x) = 10$?', '$3x - 2 = 10$', '$3x = 12$', '$x = 4$'],
      check: { q: 'If $f(x) = 2x + 5$, find $x$ when $f(x) = 11$.', options: ['$x = 3$', '$x = 27$', '$x = 8$', '$x = 16$'], answer: 0, why: '$2x + 5 = 11$, so $2x = 6$ and $x = 3$.' },
    },
    {
      say: 'When solving, find **every** input that works. With $x^2$ there are often two.',
      example: ['$f(x) = x^2 - 1$. When is $f(x) = 8$?', '$x^2 - 1 = 8$', '$x^2 = 9$', '$x = 3$ or $x = -3$'],
      check: { q: 'If $f(x) = x^2 + 2$, find all $x$ with $f(x) = 27$.', options: ['$x = 5$ or $x = -5$', '$x = 5$ only', '$x = 731$', '$x = \\pm 25$'], answer: 0, why: '$x^2 = 25$, so $x = \\pm 5$.' },
    },
    {
      say: 'From a table or graph: to **evaluate** $f(a)$, start at $x = a$ and read the $y$. To **solve** $f(x) = b$, start at $y = b$ and read the $x$.',
      example: ['Table: $x$ is $-1, 0, 1, 2$ and $f(x)$ is $3, 1, 4, 0$.', '$f(1)$: find $1$ in the $x$ row. Below it: $4$.', '$f(x) = 1$: find $1$ in the $f(x)$ row. Above it: $x = 0$.'],
      check: { q: 'Same table. Solve $f(x) = 3$.', options: ['$x = -1$', '$x = 3$', '$x = 2$', '$x = 0$'], answer: 0, why: 'Find $3$ in the $f(x)$ row. The $x$ above it is $-1$.' },
    },
  ],

  'P.domain-range': [
    {
      say: 'The **domain** is every $x$-value a function uses. The **range** is every $y$-value it produces.',
      example: ['Points: $(1, 4)$, $(2, 5)$, $(3, 6)$', 'Domain: the $x$s, $\\{1, 2, 3\\}$.', 'Range: the $y$s, $\\{4, 5, 6\\}$.'],
      check: { q: 'What is the range of $(0, 2)$, $(1, 7)$, $(5, 3)$?', options: ['$\\{2, 3, 7\\}$', '$\\{0, 1, 5\\}$', '$\\{0, 7\\}$', '$\\{2, 7\\}$'], answer: 0, why: 'The range is the $y$-values: $2$, $7$ and $3$.' },
    },
    {
      say: 'On a graph, the domain is the "shadow" on the $x$-axis: left to right. The range is the shadow on the $y$-axis: bottom to top.',
      example: ['A segment from $(-2, 1)$ to $(4, 7)$.', 'Domain: $x$ from $-2$ to $4$.', 'Range: $y$ from $1$ to $7$.'],
      check: { q: 'A segment goes from $(1, -3)$ to $(5, 2)$. What is the range?', options: ['$y$ from $-3$ to $2$', '$y$ from $1$ to $5$', '$y$ from $-3$ to $5$', '$y$ from $1$ to $2$'], answer: 0, why: 'Range uses the $y$-values: lowest $-3$, highest $2$.' },
    },
    {
      say: '**Interval notation** writes a stretch of numbers as $(\\text{start}, \\text{end})$. A **square** bracket means the endpoint is included. A **round** bracket means it is left out.',
      example: ['$-2 < x \\le 5$', '$-2$ is not included: round bracket.', '$5$ is included: square bracket.', 'Interval: $(-2, 5]$.'],
      check: { q: 'Write $3 \\le x < 8$ in interval notation.', options: ['$[3, 8)$', '$(3, 8]$', '$[3, 8]$', '$(3, 8)$'], answer: 0, why: '$3$ is included (square), $8$ is not (round).' },
    },
    {
      say: 'If there is no end, use $\\infty$ (infinity) or $-\\infty$. Infinity is never reached, so it **always** gets a round bracket.',
      example: ['$x \\ge 4$', 'Starts at $4$ (included), goes on forever.', 'Interval: $[4, \\infty)$.'],
      check: { q: 'Write $x < 1$ in interval notation.', options: ['$(-\\infty, 1)$', '$(-\\infty, 1]$', '$[-\\infty, 1)$', '$(1, \\infty)$'], answer: 0, why: 'Everything below $1$, with $1$ left out; infinity takes a round bracket.' },
    },
    {
      say: '**Set-builder notation** describes the numbers with an inequality. $\\{x \\mid -2 < x \\le 5, x \\in \\mathbb{R}\\}$ reads "all real $x$ such that $x$ is between $-2$ and $5$, including $5$".',
      example: ['$\\{x \\mid -2 < x \\le 5, x \\in \\mathbb{R}\\}$', 'is the same as $(-2, 5]$.', '$\\mathbb{R}$ means the real numbers.'],
      check: { q: 'Write $[0, 6)$ in set-builder notation.', options: ['$\\{x \\mid 0 \\le x < 6, x \\in \\mathbb{R}\\}$', '$\\{x \\mid 0 < x \\le 6, x \\in \\mathbb{R}\\}$', '$\\{x \\mid 0 \\le x \\le 6, x \\in \\mathbb{R}\\}$', '$\\{x \\mid 0 < x < 6, x \\in \\mathbb{R}\\}$'], answer: 0, why: 'Square bracket at $0$ means $\\le$; round bracket at $6$ means $<$.' },
    },
    {
      say: 'On a graph, a **solid dot** is included and a **hollow dot** is not. An arrow means the graph keeps going.',
      example: ['Graph starts at a solid dot $(1, 2)$ and rises forever to the right.', 'Domain: $[1, \\infty)$.', 'Range: $[2, \\infty)$.'],
      check: { q: 'A graph runs from a hollow dot at $x = -3$ to a solid dot at $x = 2$. What is the domain?', options: ['$(-3, 2]$', '$[-3, 2)$', '$[-3, 2]$', '$(-3, 2)$'], answer: 0, why: 'Hollow at $-3$ gives a round bracket; solid at $2$ gives a square one.' },
    },
    {
      say: 'From an equation, look for **restrictions**. A square root needs the inside (the **radicand**) to be $\\ge 0$.',
      example: ['$y = \\sqrt{x - 2} + 1$', '$x - 2 \\ge 0$, so $x \\ge 2$.', 'Domain: $[2, \\infty)$.', 'The root is never negative, so $y \\ge 1$: range $[1, \\infty)$.'],
      check: { q: 'What is the domain of $y = \\sqrt{x + 5}$?', options: ['$[-5, \\infty)$', '$[5, \\infty)$', '$(-5, \\infty)$', '$(-\\infty, -5]$'], answer: 0, why: '$x + 5 \\ge 0$ gives $x \\ge -5$, and $-5$ is included.' },
    },
    {
      say: 'If you divide an inequality by a **negative** number, flip the inequality sign.',
      example: ['$y = \\sqrt{6 - 2x}$', '$6 - 2x \\ge 0$', '$-2x \\ge -6$', 'Divide by $-2$ and flip: $x \\le 3$.', 'Domain: $(-\\infty, 3]$.'],
      check: { q: 'What is the domain of $y = \\sqrt{4 - x}$?', options: ['$(-\\infty, 4]$', '$[4, \\infty)$', '$[-4, \\infty)$', '$(-\\infty, -4]$'], answer: 0, why: '$4 - x \\ge 0$ gives $-x \\ge -4$, so $x \\le 4$.' },
    },
    {
      say: 'A **denominator** (bottom of a fraction) can never be $0$. Remove that $x$ from the domain.',
      example: ['$y = \\frac{1}{x - 3}$', '$x - 3 = 0$ when $x = 3$, so $x \\ne 3$.', 'Set-builder: $\\{x \\mid x \\ne 3, x \\in \\mathbb{R}\\}$', 'Interval: $(-\\infty, 3) \\cup (3, \\infty)$'],
      check: { q: 'What is the domain of $y = \\frac{5}{x + 4}$?', options: ['$\\{x \\mid x \\ne -4, x \\in \\mathbb{R}\\}$', '$\\{x \\mid x \\ne 4, x \\in \\mathbb{R}\\}$', '$\\{x \\mid x \\ne 5, x \\in \\mathbb{R}\\}$', '$\\{x \\mid x > -4, x \\in \\mathbb{R}\\}$'], answer: 0, why: '$x + 4 = 0$ at $x = -4$, so only $-4$ is left out.' },
    },
  ],

  'P.linear': [
    {
      say: 'The **slope** $m$ measures steepness: rise over run. Using two points, $m = \\frac{y_2 - y_1}{x_2 - x_1}$.',
      example: ['Points $(1, 2)$ and $(3, 8)$.', 'Rise: $8 - 2 = 6$.', 'Run: $3 - 1 = 2$.', '$m = \\frac{6}{2} = 3$'],
      check: { q: 'What is the slope through $(0, 1)$ and $(2, 7)$?', options: ['$3$', '$\\frac{1}{3}$', '$4$', '$6$'], answer: 0, why: '$\\frac{7 - 1}{2 - 0} = \\frac{6}{2} = 3$.' },
    },
    {
      say: 'Subtract in the **same order** on top and bottom. Put negative numbers in brackets.',
      example: ['Points $(-1, 4)$ and $(2, -2)$.', 'Top: $-2 - 4 = -6$.', 'Bottom: $2 - (-1) = 3$.', '$m = \\frac{-6}{3} = -2$'],
      check: { q: 'What is the slope through $(-2, 1)$ and $(1, 7)$?', options: ['$2$', '$-6$', '$\\frac{1}{2}$', '$6$'], answer: 0, why: '$\\frac{7 - 1}{1 - (-2)} = \\frac{6}{3} = 2$.' },
    },
    {
      say: 'A **horizontal** line has slope $0$: no rise. A **vertical** line has **undefined** slope: no run, and you cannot divide by $0$.',
      example: ['$y = 4$ is horizontal: slope $0$.', '$x = 2$ is vertical: run is $0$.', 'Slope $\\frac{\\text{rise}}{0}$ is undefined.'],
      check: { q: 'What is the slope of $x = -3$?', options: ['Undefined', '$0$', '$-3$', '$1$'], answer: 0, why: '$x = -3$ is a vertical line, so the run is $0$.' },
    },
    {
      say: '**Slope-intercept form** is $y = mx + b$. The number times $x$ is the slope $m$. The number alone is $b$, the $y$-**intercept**: where the line crosses the $y$-axis.',
      example: ['$y = -2x + 5$', 'Slope: $m = -2$.', '$y$-intercept: $b = 5$, the point $(0, 5)$.'],
      check: { q: 'For $y = \\frac{1}{2}x - 4$, what are the slope and $y$-intercept?', options: ['Slope $\\frac{1}{2}$, $y$-intercept $-4$', 'Slope $-4$, $y$-intercept $\\frac{1}{2}$', 'Slope $\\frac{1}{2}$, $y$-intercept $4$', 'Slope $2$, $y$-intercept $-4$'], answer: 0, why: 'The number times $x$ is the slope; the number alone is the intercept, sign included.' },
    },
    {
      say: 'In **general form** $Ax + By + C = 0$, or in $Ax + By = C$, the slope is hidden. Solve for $y$ first. Then the number times $x$ is the slope.',
      example: ['$2x + 3y = 6$', '$3y = -2x + 6$', '$y = -\\frac{2}{3}x + 2$', 'Slope: $-\\frac{2}{3}$.'],
      check: { q: 'What is the slope of $4x + 2y = 10$?', options: ['$-2$', '$2$', '$4$', '$-\\frac{1}{2}$'], answer: 0, why: '$2y = -4x + 10$, so $y = -2x + 5$.' },
    },
    {
      say: '**Point-slope form** $y - y_1 = m(x - x_1)$ builds a line from a slope and one point $(x_1, y_1)$. Then solve for $y$ if asked.',
      example: ['Slope $3$, point $(2, -1)$.', '$y - (-1) = 3(x - 2)$', '$y + 1 = 3x - 6$', '$y = 3x - 7$'],
      check: { q: 'Find the line with slope $2$ through $(1, 5)$.', options: ['$y = 2x + 3$', '$y = 2x - 3$', '$y = 2x + 5$', '$y = 2x + 4$'], answer: 0, why: '$y - 5 = 2(x - 1)$, so $y = 2x - 2 + 5 = 2x + 3$.' },
    },
    {
      say: 'Given two points: find the slope first, then use either point in point-slope form.',
      example: ['Points $(1, 3)$ and $(3, 7)$.', '$m = \\frac{7 - 3}{3 - 1} = 2$', '$y - 3 = 2(x - 1)$', '$y = 2x + 1$'],
      check: { q: 'Find the line through $(0, -2)$ and $(2, 4)$.', options: ['$y = 3x - 2$', '$y = 3x + 2$', '$y = \\frac{1}{3}x - 2$', '$y = 2x - 2$'], answer: 0, why: '$m = \\frac{4 - (-2)}{2 - 0} = 3$, and the line crosses the $y$-axis at $-2$.' },
    },
    {
      say: '**Parallel** lines have equal slopes. **Perpendicular** lines (meeting at a right angle) have slopes that are **negative reciprocals**: flip the fraction and change the sign. Their product is $-1$.',
      example: ['Slope $\\frac{2}{3}$.', 'Parallel slope: $\\frac{2}{3}$.', 'Perpendicular slope: $-\\frac{3}{2}$.', 'Check: $\\frac{2}{3} \\times \\left(-\\frac{3}{2}\\right) = -1$'],
      check: { q: 'What slope is perpendicular to $y = 4x - 1$?', options: ['$-\\frac{1}{4}$', '$\\frac{1}{4}$', '$-4$', '$4$'], answer: 0, why: 'Flip $4$ to $\\frac{1}{4}$ and change the sign: $-\\frac{1}{4}$.' },
    },
  ],

  'P.abs': [
    {
      say: 'The **absolute value** $|a|$ is the distance from $a$ to $0$. A distance is never negative.',
      example: ['$|7| = 7$', '$|-7| = 7$', '$|0| = 0$'],
      check: { q: 'What is $|-12|$?', options: ['$12$', '$-12$', '$0$', '$\\frac{1}{12}$'], answer: 0, why: '$-12$ is $12$ steps from $0$.' },
    },
    {
      say: 'Work out the inside of the bars **first**, then take the absolute value.',
      example: ['$|3 - 8|$', 'Inside: $3 - 8 = -5$.', '$|-5| = 5$'],
      check: { q: 'What is $|2 - 9|$?', options: ['$7$', '$-7$', '$11$', '$-11$'], answer: 0, why: '$2 - 9 = -7$, and $|-7| = 7$.' },
    },
    {
      say: 'Separate bars are separate numbers. Take each absolute value, then do the arithmetic outside. The final answer can be negative.',
      example: ['$|3| - |8|$', '$= 3 - 8$', '$= -5$', 'Compare: $|3 - 8| = 5$.'],
      check: { q: 'What is $|-3| - |-5|$?', options: ['$-2$', '$2$', '$8$', '$-8$'], answer: 0, why: '$|-3| = 3$ and $|-5| = 5$, so $3 - 5 = -2$.' },
    },
    {
      say: 'Rule: if $A \\ge 0$ then $|A| = A$ (no change). If $A < 0$ then $|A| = -A$ (change the sign, making it positive).',
      example: ['$A = 4$: $|4| = 4$.', '$A = -4$: $|-4| = -(-4) = 4$.'],
      check: { q: 'If $A < 0$, what does $|A|$ equal?', options: ['$-A$', '$A$', '$0$', '$A^2$'], answer: 0, why: 'A negative $A$ needs its sign changed, so $|A| = -A$, which is positive.' },
    },
    {
      say: 'So $y = |\\text{expression}|$ has two pieces. They switch where the inside equals **zero**.',
      example: ['$y = |2x - 6|$', 'Inside is zero: $2x - 6 = 0$, so $x = 3$.', 'For $x \\ge 3$: $y = 2x - 6$.', 'For $x < 3$: $y = -(2x - 6) = -2x + 6$.'],
      check: { q: 'Where do the two pieces of $y = |x + 4|$ switch?', options: ['$x = -4$', '$x = 4$', '$x = 0$', '$y = 4$'], answer: 0, why: '$x + 4 = 0$ when $x = -4$.' },
    },
    {
      say: 'For the negative piece, change the sign of **every** term inside, not just the first.',
      example: ['$y = |x - 5|$, switching at $x = 5$.', '$x \\ge 5$: $y = x - 5$.', '$x < 5$: $y = -(x - 5) = -x + 5$.'],
      check: { q: 'Which matches $y = |x - 5|$?', options: ['$x - 5$ if $x \\ge 5$; $-x + 5$ if $x < 5$', '$x - 5$ if $x \\ge 5$; $-x - 5$ if $x < 5$', '$x - 5$ if $x \\ge -5$; $-x + 5$ if $x < -5$', '$x + 5$ if $x \\ge 5$; $-x + 5$ if $x < 5$'], answer: 0, why: 'It switches at $x = 5$, and $-(x - 5) = -x + 5$.' },
    },
    {
      say: 'To graph $y = |f(x)|$: draw $y = f(x)$, then flip only the parts **below** the $x$-axis up above it. Points **on** the $x$-axis do not move: they are **invariant**.',
      example: ['$y = x - 2$ is at $(0, -2)$, below the axis.', 'On $y = |x - 2|$ it flips to $(0, 2)$.', '$(2, 0)$ is on the axis, so it stays.'],
      check: { q: 'Which point of $y = x - 4$ stays put on $y = |x - 4|$?', options: ['$(4, 0)$', '$(0, -4)$', '$(0, 4)$', '$(-4, 0)$'], answer: 0, why: '$(4, 0)$ is on the $x$-axis, so flipping does not move it.' },
    },
    {
      say: 'Because nothing stays below the $x$-axis, the range of $y = |f(x)|$ never goes below $0$. If $f$ dips below the axis, the lowest $y$ becomes $0$.',
      example: ['$y = x^2 - 9$ has range $[-9, \\infty)$.', 'It dips below the axis, so that part flips up.', 'Range of $y = |x^2 - 9|$: $[0, \\infty)$.', '$y = x^2 + 2$ never dips, so $|x^2 + 2|$ keeps range $[2, \\infty)$.'],
      check: { q: 'What is the range of $y = |(x + 2)^2 - 5|$?', options: ['$[0, \\infty)$', '$[-5, \\infty)$', '$[5, \\infty)$', '$[2, \\infty)$'], answer: 0, why: 'The parabola goes down to $-5$, below the axis, so after flipping the lowest $y$ is $0$.' },
    },
  ],

  'P.rat-expr': [
    {
      say: 'A **rational expression** is a fraction with $x$ in it. A **non-permissible value** is an $x$ that makes the bottom zero. Those $x$-values are not allowed.',
      example: ['$\\frac{x + 1}{x - 4}$', 'Bottom is zero when $x - 4 = 0$.', 'So $x \\ne 4$.'],
      check: { q: 'What is the non-permissible value of $\\frac{3}{x + 2}$?', options: ['$x \\ne -2$', '$x \\ne 2$', '$x \\ne 3$', '$x \\ne 0$'], answer: 0, why: '$x + 2 = 0$ when $x = -2$.' },
    },
    {
      say: '**Factor** the bottom to find every non-permissible value. Zeros of the **top** are allowed.',
      example: ['$\\frac{x}{x^2 - 9} = \\frac{x}{(x - 3)(x + 3)}$', '$x - 3 = 0$ gives $3$. $x + 3 = 0$ gives $-3$.', 'So $x \\ne 3, -3$. ($x = 0$ is fine.)'],
      check: { q: 'Non-permissible values of $\\frac{x - 1}{x^2 - 5x + 6}$?', options: ['$x \\ne 2, 3$', '$x \\ne 1, 2, 3$', '$x \\ne -2, -3$', '$x \\ne 1$'], answer: 0, why: '$x^2 - 5x + 6 = (x - 2)(x - 3)$. The top does not matter.' },
    },
    {
      say: 'To simplify, cancel **factors** (things multiplied), never **terms** (things added). Factor top and bottom first.',
      example: ['$\\frac{5(x - 2)}{(x - 2)(x + 1)}$: $(x - 2)$ is a factor of both.', 'Cancel it: $\\frac{5}{x + 1}$.', 'But $\\frac{x + 3}{3}$ is not $x$: the $3$ is added, not multiplied.'],
      check: { q: 'Which one simplifies to $x$?', options: ['$\\frac{x(x + 4)}{x + 4}$', '$\\frac{x + 4}{4}$', '$\\frac{x^2 + 4}{x + 4}$', '$\\frac{x + 4}{x}$'], answer: 0, why: 'Only there is $(x + 4)$ a factor of both top and bottom.' },
    },
    {
      say: 'Find the restrictions **before** you cancel. A cancelled factor still made the original bottom zero, so its restriction stays.',
      example: ['$\\frac{x^2 - 4}{x^2 + x - 2} = \\frac{(x - 2)(x + 2)}{(x + 2)(x - 1)}$', 'Restrictions: $x \\ne -2, 1$.', 'Cancel $(x + 2)$: $\\frac{x - 2}{x - 1}$, still $x \\ne -2, 1$.'],
      check: { q: 'Simplify $\\frac{x^2 - x}{x^2 - 1}$.', options: ['$\\frac{x}{x + 1}$, $x \\ne 1, -1$', '$\\frac{x}{x + 1}$, $x \\ne -1$', '$\\frac{x}{x + 1}$, $x \\ne 0, 1, -1$', '$-x$, $x \\ne 1, -1$'], answer: 0, why: '$\\frac{x(x - 1)}{(x - 1)(x + 1)}$. Both $1$ and $-1$ made the original bottom zero.' },
    },
    {
      say: 'To multiply, multiply tops and bottoms, then cancel factors. To **divide**, flip the second fraction and multiply. The top of the second fraction ends up on the bottom, so it is a restriction too.',
      example: ['$\\frac{x}{x - 1} \\div \\frac{x + 3}{x - 1} = \\frac{x}{x - 1} \\cdot \\frac{x - 1}{x + 3}$', 'Cancel $(x - 1)$: $\\frac{x}{x + 3}$.', 'Restrictions: $x \\ne 1$ (bottoms) and $x \\ne -3$ (top of the second fraction).'],
      check: { q: 'Simplify $\\frac{2}{x} \\div \\frac{4}{x}$.', options: ['$\\frac{1}{2}$', '$2$', '$\\frac{8}{x^2}$', '$\\frac{x}{2}$'], answer: 0, why: '$\\frac{2}{x} \\cdot \\frac{x}{4} = \\frac{2}{4} = \\frac{1}{2}$, with $x \\ne 0$.' },
    },
    {
      say: 'To add fractions with the **same** bottom, add the tops and keep the bottom. Never add the bottoms.',
      example: ['$\\frac{3}{x} + \\frac{5}{x}$', 'Tops: $3 + 5 = 8$.', 'Answer: $\\frac{8}{x}$.'],
      check: { q: 'Simplify $\\frac{2}{x + 1} + \\frac{4}{x + 1}$.', options: ['$\\frac{6}{x + 1}$', '$\\frac{6}{2x + 2}$', '$\\frac{8}{x + 1}$', '$\\frac{3}{x + 1}$'], answer: 0, why: 'Same bottom: add the tops, $2 + 4 = 6$.' },
    },
    {
      say: 'With **different** bottoms, build a **common denominator**. Multiply each fraction, top and bottom, by the factor it is missing.',
      example: ['$\\frac{2}{x - 1} + \\frac{3}{x + 2}$; common bottom $(x - 1)(x + 2)$.', 'Tops: $2(x + 2) + 3(x - 1)$', '$= 2x + 4 + 3x - 3 = 5x + 1$', 'Answer: $\\frac{5x + 1}{(x - 1)(x + 2)}$'],
      check: { q: 'Simplify $\\frac{1}{x} + \\frac{2}{x + 1}$.', options: ['$\\frac{3x + 1}{x(x + 1)}$', '$\\frac{3}{2x + 1}$', '$\\frac{3}{x(x + 1)}$', '$\\frac{2x + 1}{x(x + 1)}$'], answer: 0, why: 'Tops: $1(x + 1) + 2x = 3x + 1$, over $x(x + 1)$.' },
    },
    {
      say: 'A minus sign in front of a fraction applies to its **whole** top. Put that top in brackets before you subtract.',
      example: ['$\\frac{x + 5}{x - 1} - \\frac{x + 2}{x - 1}$', 'Tops: $(x + 5) - (x + 2)$', '$= x + 5 - x - 2 = 3$', 'Answer: $\\frac{3}{x - 1}$'],
      check: { q: 'Simplify $\\frac{2x + 1}{x + 3} - \\frac{x - 4}{x + 3}$.', options: ['$\\frac{x + 5}{x + 3}$', '$\\frac{x - 3}{x + 3}$', '$\\frac{3x - 3}{x + 3}$', '$\\frac{x + 5}{2x + 6}$'], answer: 0, why: '$2x + 1 - (x - 4) = 2x + 1 - x + 4 = x + 5$.' },
    },
  ],

  'P.rat-eq': [
    {
      say: 'A **rational equation** has $x$ in a denominator. Start by writing the **non-permissible values**: the $x$s that make any bottom zero.',
      example: ['$\\frac{3}{x - 2} = \\frac{5}{x}$', 'Bottoms: $x - 2$ and $x$.', 'So $x \\ne 2$ and $x \\ne 0$.'],
      check: { q: 'Non-permissible values of $\\frac{4}{x + 1} = \\frac{2}{x - 5}$?', options: ['$x \\ne -1, 5$', '$x \\ne 1, -5$', '$x \\ne 4, 2$', '$x \\ne -1$'], answer: 0, why: '$x + 1 = 0$ at $-1$ and $x - 5 = 0$ at $5$.' },
    },
    {
      say: 'Multiply **both sides** by the **lowest common denominator**: the smallest expression that every bottom divides into. The fractions disappear. Then solve as usual.',
      example: ['$\\frac{3}{x - 2} = \\frac{5}{x}$; multiply by $x(x - 2)$.', '$3x = 5(x - 2)$', '$3x = 5x - 10$', '$-2x = -10$, so $x = 5$.', '$5$ is permissible, so $x = 5$.'],
      check: { q: 'Solve $\\frac{2}{x} = \\frac{6}{x + 4}$.', options: ['$x = 2$', '$x = 1$', '$x = -2$', '$x = 4$'], answer: 0, why: '$2(x + 4) = 6x$, so $2x + 8 = 6x$, $8 = 4x$, $x = 2$.' },
    },
    {
      say: 'Multiply **every** term by the common denominator, including whole numbers with no fraction.',
      example: ['$\\frac{6}{x} - \\frac{2}{x - 1} = 1$; multiply by $x(x - 1)$.', '$6(x - 1) - 2x = x(x - 1)$', '$4x - 6 = x^2 - x$', '$0 = x^2 - 5x + 6 = (x - 2)(x - 3)$', '$x = 2$ or $x = 3$; both permissible.'],
      check: { q: 'Multiply $\\frac{5}{x} + 2 = \\frac{3}{x}$ by $x$. What do you get?', options: ['$5 + 2x = 3$', '$5 + 2 = 3$', '$5 + 2x = 3x$', '$5x + 2x = 3x$'], answer: 0, why: 'Each term is multiplied by $x$: $\\frac{5}{x} \\cdot x = 5$, $2 \\cdot x = 2x$, $\\frac{3}{x} \\cdot x = 3$.' },
    },
    {
      say: 'Clearing fractions can create a fake root. A root equal to a non-permissible value is **extraneous**: reject it. If no root survives, write "no solution".',
      example: ['$\\frac{x}{x - 3} = \\frac{3}{x - 3}$, with $x \\ne 3$.', 'Multiply by $(x - 3)$: $x = 3$.', 'But $3$ is not allowed.', 'No solution.'],
      check: { q: 'Restriction $x \\ne 1$. After clearing, the roots are $x = 1$ and $x = 4$. What is the solution?', options: ['$x = 4$', '$x = 1$ and $x = 4$', '$x = 1$', 'No solution'], answer: 0, why: '$x = 1$ is non-permissible, so only $x = 4$ is kept.' },
    },
    {
      say: 'Only reject roots that are non-permissible. A root that is negative or a fraction is fine if it is allowed.',
      example: ['Restrictions: $x \\ne 0, 4$.', 'Roots found: $x = -2$ and $x = \\frac{1}{2}$.', 'Neither is $0$ or $4$.', 'Keep both.'],
      check: { q: 'Restrictions $x \\ne 2, -1$. Roots found: $x = -3$ and $x = 2$. Which do you keep?', options: ['$x = -3$ only', '$x = 2$ only', 'Both', 'Neither'], answer: 0, why: '$2$ is non-permissible. $-3$ is allowed, even though it is negative.' },
    },
    {
      say: 'All together: restrictions, clear fractions, solve, then compare each root with the restrictions.',
      example: ['$\\frac{x^2}{x - 2} = \\frac{4}{x - 2}$, with $x \\ne 2$.', 'Multiply by $(x - 2)$: $x^2 = 4$.', '$x = 2$ or $x = -2$.', 'Reject $2$. Solution: $x = -2$.'],
      check: { q: 'Solve $\\frac{x^2}{x + 3} = \\frac{9}{x + 3}$.', options: ['$x = 3$', '$x = 3$ or $x = -3$', '$x = -3$', 'No solution'], answer: 0, why: '$x^2 = 9$ gives $\\pm 3$, but $x \\ne -3$.' },
    },
  ],

  'P.rad-eq': [
    {
      say: 'A **radical equation** has $x$ under a root. To undo a square root, **square** both sides.',
      example: ['$\\sqrt{x + 3} = 5$', 'Square: $x + 3 = 25$', '$x = 22$', 'Check: $\\sqrt{25} = 5$ ✓'],
      check: { q: 'Solve $\\sqrt{x - 1} = 4$.', options: ['$x = 17$', '$x = 5$', '$x = 15$', '$x = 3$'], answer: 0, why: '$x - 1 = 16$, so $x = 17$.' },
    },
    {
      say: '**Isolate** the root first: get it alone on one side. Only then square.',
      example: ['$\\sqrt{2x + 1} + 3 = 8$', 'Subtract $3$: $\\sqrt{2x + 1} = 5$', 'Square: $2x + 1 = 25$', '$2x = 24$, so $x = 12$.'],
      check: { q: 'Solve $\\sqrt{x} - 2 = 3$.', options: ['$x = 25$', '$x = 13$', '$x = 1$', '$x = 5$'], answer: 0, why: '$\\sqrt{x} = 5$, so $x = 25$.' },
    },
    {
      say: 'State the **restriction**: the inside of a square root (the **radicand**) must be $\\ge 0$.',
      example: ['$\\sqrt{x - 4} = x - 6$', 'Need $x - 4 \\ge 0$.', 'So $x \\ge 4$.'],
      check: { q: 'What is the restriction for $\\sqrt{2x - 6}$?', options: ['$x \\ge 3$', '$x \\ge 6$', '$x \\le 3$', '$x \\ge -3$'], answer: 0, why: '$2x - 6 \\ge 0$ gives $2x \\ge 6$, so $x \\ge 3$.' },
    },
    {
      say: 'A square root is never negative. If the isolated root equals a **negative** number, there is **no solution**.',
      example: ['$\\sqrt{x} + 7 = 4$', 'Isolate: $\\sqrt{x} = -3$', 'A root cannot be $-3$.', 'No solution.'],
      check: { q: 'Solve $\\sqrt{x + 2} = -5$.', options: ['No solution', '$x = 23$', '$x = -27$', '$x = 3$'], answer: 0, why: 'A square root can never equal a negative number.' },
    },
    {
      say: 'When one side is a binomial like $x - 3$, square the **whole** thing: $(x - 3)^2 = x^2 - 6x + 9$, not $x^2 + 9$.',
      example: ['$(x - 3)^2 = (x - 3)(x - 3)$', '$= x^2 - 3x - 3x + 9$', '$= x^2 - 6x + 9$'],
      check: { q: 'Expand $(x + 5)^2$.', options: ['$x^2 + 10x + 25$', '$x^2 + 25$', '$x^2 + 5x + 25$', '$x^2 + 10x + 10$'], answer: 0, why: '$(x + 5)(x + 5) = x^2 + 5x + 5x + 25$.' },
    },
    {
      say: 'Squaring can create fake roots. **Check every root in the original equation.** A root that does not work is **extraneous**.',
      example: ['$\\sqrt{x + 3} = x - 3$. Square: $x + 3 = x^2 - 6x + 9$.', '$0 = x^2 - 7x + 6 = (x - 1)(x - 6)$', '$x = 1$: $\\sqrt{4} = 2$ but $1 - 3 = -2$. Reject.', '$x = 6$: $\\sqrt{9} = 3$ and $6 - 3 = 3$ ✓', 'Solution: $x = 6$.'],
      check: { q: 'Squaring $\\sqrt{x + 2} = x$ gives roots $x = -1$ and $x = 2$. Which solve the original?', options: ['$x = 2$ only', 'Both', '$x = -1$ only', 'Neither'], answer: 0, why: '$x = 2$: $\\sqrt{4} = 2$ ✓. $x = -1$: $\\sqrt{1} = 1$, not $-1$.' },
    },
    {
      say: 'The full method: isolate, square both sides, solve, then check each root in the original.',
      example: ['$\\sqrt{2x + 7} - x = 2$. Isolate: $\\sqrt{2x + 7} = x + 2$.', 'Square: $2x + 7 = x^2 + 4x + 4$', '$0 = x^2 + 2x - 3 = (x + 3)(x - 1)$', '$x = -3$: $\\sqrt{1} = 1$ but $-3 + 2 = -1$. Reject.', '$x = 1$: $\\sqrt{9} = 3$ and $1 + 2 = 3$ ✓. Solution: $x = 1$.'],
      check: { q: 'Isolate and square $\\sqrt{x + 1} - 1 = x$. Which equation results?', options: ['$x + 1 = x^2 + 2x + 1$', '$x + 1 = x^2 + 1$', '$x + 1 = x^2$', '$x = x^2 + 2x + 1$'], answer: 0, why: 'Isolate: $\\sqrt{x + 1} = x + 1$. Then $(x + 1)^2 = x^2 + 2x + 1$.' },
    },
  ],

  'P.systems': [
    {
      say: 'A **system** is two equations at once. A **solution** is a point that is on **both** graphs: where they cross. Give both coordinates.',
      example: ['$y = 2x + 1$ and $y = x + 2$.', 'Try $(1, 3)$: $2(1) + 1 = 3$ ✓', 'and $1 + 2 = 3$ ✓', 'So $(1, 3)$ is the solution.'],
      check: { q: 'Which point is on both $y = 2x + 1$ and $y = x + 2$?', options: ['$(1, 3)$', '$(2, 5)$', '$(0, 2)$', '$(0, 1)$'], answer: 0, why: '$(1, 3)$ works in both. $(2, 5)$ works only in the first.' },
    },
    {
      say: 'To solve with algebra, set the two expressions for $y$ **equal**, solve for $x$, then find $y$.',
      example: ['$y = 3x - 1$ and $y = x + 5$', '$3x - 1 = x + 5$', '$2x = 6$, so $x = 3$.', '$y = 3 + 5 = 8$. Solution: $(3, 8)$.'],
      check: { q: 'Solve $y = 2x + 3$ and $y = -x + 9$.', options: ['$(2, 7)$', '$(7, 2)$', '$(2, 5)$', '$(4, 11)$'], answer: 0, why: '$2x + 3 = -x + 9$ gives $3x = 6$, $x = 2$, then $y = 2(2) + 3 = 7$.' },
    },
    {
      say: 'With a line and a **parabola**, setting them equal gives a quadratic. Move everything to one side and factor.',
      example: ['$y = x^2 - 1$ and $y = x + 1$', '$x^2 - 1 = x + 1$', '$x^2 - x - 2 = 0$', '$(x - 2)(x + 1) = 0$, so $x = 2$ or $x = -1$.'],
      check: { q: 'For $y = x^2$ and $y = x + 2$, what are the $x$-values?', options: ['$x = 2$ or $x = -1$', '$x = -2$ or $x = 1$', '$x = 2$ only', '$x = 1$ or $x = 2$'], answer: 0, why: '$x^2 = x + 2$ gives $x^2 - x - 2 = (x - 2)(x + 1) = 0$.' },
    },
    {
      say: 'Put each $x$ into the simpler equation (usually the line) to get its $y$. Report **every** point.',
      example: ['From above, $y = x + 1$.', '$x = 2$: $y = 3$, point $(2, 3)$.', '$x = -1$: $y = 0$, point $(-1, 0)$.', 'Two solutions: $(2, 3)$ and $(-1, 0)$.'],
      check: { q: 'You found $x = -2$ for a system with $y = 3x + 1$. What is $y$?', options: ['$-5$', '$-7$', '$7$', '$-6$'], answer: 0, why: '$3(-2) + 1 = -6 + 1 = -5$.' },
    },
    {
      say: 'A line can meet a parabola **0, 1 or 2** times. The **discriminant** $b^2 - 4ac$ of the combined quadratic tells you: negative is $0$, zero is $1$, positive is $2$.',
      example: ['$y = x^2 + 3$ and $y = 2x$', '$x^2 - 2x + 3 = 0$', '$(-2)^2 - 4(1)(3) = 4 - 12 = -8$', 'Negative, so they never meet.'],
      check: { q: 'For $y = x^2 + 2$ and $y = 2x + 1$, the combined equation is $x^2 - 2x + 1 = 0$. How many intersection points?', options: ['$1$', '$2$', '$0$', '$3$'], answer: 0, why: '$(-2)^2 - 4(1)(1) = 0$, so they touch once.' },
    },
    {
      say: 'On a graphing calculator, graph both equations and use **2nd → CALC → intersect**. Run it once per crossing point, moving the cursor near that point for the guess.',
      example: ['Graph $Y_1$ and $Y_2$.', '2nd → CALC → 5: intersect.', 'Press Enter for each curve, move near one crossing, then Enter.', 'Repeat for the other crossing.'],
      check: { q: 'A line crosses a parabola in two places. How many times do you run intersect?', options: ['Twice', 'Once', 'Four times', 'Zero times'], answer: 0, why: 'Each run finds one point, the one near your guess.' },
    },
  ],

  'P.ref-angle': [
    {
      say: 'An angle in **standard position** starts on the positive $x$-axis and turns **counterclockwise**. The axes split the plane into four **quadrants**: QI ($0^\\circ$ to $90^\\circ$), QII (to $180^\\circ$), QIII (to $270^\\circ$), QIV (to $360^\\circ$).',
      example: ['$120^\\circ$ is between $90^\\circ$ and $180^\\circ$.', 'So it ends in QII.'],
      check: { q: 'Which quadrant is $250^\\circ$ in?', options: ['QIII', 'QII', 'QIV', 'QI'], answer: 0, why: '$250^\\circ$ is between $180^\\circ$ and $270^\\circ$.' },
    },
    {
      say: 'A negative angle turns **clockwise**. Angles that end in the same place are **coterminal**: they differ by $360^\\circ$. Add or subtract $360^\\circ$ to get between $0^\\circ$ and $360^\\circ$.',
      example: ['$-60^\\circ + 360^\\circ = 300^\\circ$', '$420^\\circ - 360^\\circ = 60^\\circ$'],
      check: { q: 'Which angle between $0^\\circ$ and $360^\\circ$ is coterminal with $480^\\circ$?', options: ['$120^\\circ$', '$300^\\circ$', '$60^\\circ$', '$240^\\circ$'], answer: 0, why: '$480^\\circ - 360^\\circ = 120^\\circ$.' },
    },
    {
      say: 'The **reference angle** is the acute angle between the end of the angle (the **terminal arm**) and the **$x$-axis**. Never measure to the $y$-axis. In QII it is $180^\\circ - \\theta$.',
      example: ['$\\theta = 150^\\circ$, in QII.', '$180^\\circ - 150^\\circ = 30^\\circ$', 'Reference angle: $30^\\circ$.'],
      check: { q: 'What is the reference angle for $120^\\circ$?', options: ['$60^\\circ$', '$30^\\circ$', '$120^\\circ$', '$300^\\circ$'], answer: 0, why: '$180^\\circ - 120^\\circ = 60^\\circ$. $30^\\circ$ is measured to the $y$-axis.' },
    },
    {
      say: 'In QIII the reference angle is $\\theta - 180^\\circ$. In QIV it is $360^\\circ - \\theta$.',
      example: ['$210^\\circ$ is in QIII: $210^\\circ - 180^\\circ = 30^\\circ$.', '$300^\\circ$ is in QIV: $360^\\circ - 300^\\circ = 60^\\circ$.'],
      check: { q: 'What is the reference angle for $290^\\circ$?', options: ['$70^\\circ$', '$20^\\circ$', '$110^\\circ$', '$290^\\circ$'], answer: 0, why: '$290^\\circ$ is in QIV, so $360^\\circ - 290^\\circ = 70^\\circ$.' },
    },
    {
      say: 'For a point $(x, y)$ on the terminal arm, $r = \\sqrt{x^2 + y^2}$ is its distance from the origin. Then $\\sin\\theta = \\frac{y}{r}$, $\\cos\\theta = \\frac{x}{r}$, $\\tan\\theta = \\frac{y}{x}$.',
      example: ['Point $(-3, 4)$.', '$r = \\sqrt{9 + 16} = \\sqrt{25} = 5$', '$\\sin\\theta = \\frac{4}{5}$, $\\cos\\theta = -\\frac{3}{5}$', '$\\tan\\theta = \\frac{4}{-3} = -\\frac{4}{3}$'],
      check: { q: 'The point $(5, -12)$ is on the terminal arm. What is $\\cos\\theta$?', options: ['$\\frac{5}{13}$', '$-\\frac{12}{13}$', '$-\\frac{5}{13}$', '$-\\frac{5}{12}$'], answer: 0, why: '$r = \\sqrt{25 + 144} = 13$, and $\\cos\\theta = \\frac{x}{r} = \\frac{5}{13}$.' },
    },
    {
      say: '**CAST** tells which ratio is positive in each quadrant. QI: **A**ll. QII: **S**ine. QIII: **T**angent. QIV: **C**osine. The others are negative there.',
      example: ['In QII, $x$ is negative and $y$ is positive.', '$\\sin\\theta = \\frac{y}{r}$ is positive.', '$\\cos\\theta$ and $\\tan\\theta$ are negative.'],
      check: { q: 'Which ratio is positive in QIII?', options: ['Tangent', 'Sine', 'Cosine', 'All three'], answer: 0, why: 'CAST: QIII is T, tangent.' },
    },
    {
      say: 'Exact values come from two **special triangles**: $30^\\circ$-$60^\\circ$-$90^\\circ$ with sides $1, \\sqrt{3}, 2$, and $45^\\circ$-$45^\\circ$-$90^\\circ$ with sides $1, 1, \\sqrt{2}$.',
      example: ['$\\sin 30^\\circ = \\frac{1}{2}$, $\\cos 30^\\circ = \\frac{\\sqrt{3}}{2}$, $\\tan 30^\\circ = \\frac{\\sqrt{3}}{3}$', '$\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$, $\\cos 60^\\circ = \\frac{1}{2}$, $\\tan 60^\\circ = \\sqrt{3}$', '$\\sin 45^\\circ = \\cos 45^\\circ = \\frac{\\sqrt{2}}{2}$, $\\tan 45^\\circ = 1$'],
      check: { q: 'What is $\\sin 60^\\circ$?', options: ['$\\frac{\\sqrt{3}}{2}$', '$\\frac{1}{2}$', '$\\sqrt{3}$', '$\\frac{\\sqrt{2}}{2}$'], answer: 0, why: 'Opposite the $60^\\circ$ angle is $\\sqrt{3}$, and the hypotenuse is $2$.' },
    },
    {
      say: 'For any angle: find its reference angle, take that exact value, then give it the sign from CAST.',
      example: ['$\\cos 150^\\circ$: QII, reference angle $30^\\circ$.', '$\\cos 30^\\circ = \\frac{\\sqrt{3}}{2}$', 'Cosine is negative in QII.', '$\\cos 150^\\circ = -\\frac{\\sqrt{3}}{2}$'],
      check: { q: 'What is $\\sin 210^\\circ$?', options: ['$-\\frac{1}{2}$', '$\\frac{1}{2}$', '$-\\frac{\\sqrt{3}}{2}$', '$\\frac{\\sqrt{3}}{2}$'], answer: 0, why: 'QIII, reference $30^\\circ$, and sine is negative in QIII.' },
    },
    {
      say: 'For an angle outside $0^\\circ$ to $360^\\circ$, first find the coterminal angle. Then use the same steps.',
      example: ['$\\sin 480^\\circ$: $480^\\circ - 360^\\circ = 120^\\circ$.', '$120^\\circ$ is in QII, reference angle $60^\\circ$.', 'Sine is positive in QII.', '$\\sin 480^\\circ = \\frac{\\sqrt{3}}{2}$'],
      check: { q: 'What is $\\tan 315^\\circ$?', options: ['$-1$', '$1$', '$-\\frac{\\sqrt{2}}{2}$', '$\\sqrt{3}$'], answer: 0, why: 'QIV, reference $45^\\circ$, $\\tan 45^\\circ = 1$, and tangent is negative in QIV.' },
    },
  ],

  'P.sine-cos-law': [
    {
      say: 'In $\\triangle ABC$, each side is named with the small letter of the angle **opposite** it. Side $a$ is across from $\\angle A$.',
      example: ['$\\angle A$ faces side $a$.', '$\\angle B$ faces side $b$.', '$\\angle C$ faces side $c$.'],
      check: { q: 'Which side is opposite $\\angle B$?', options: ['$b$', '$a$', '$c$'], answer: 0, why: 'Each side shares its letter with the angle across from it.' },
    },
    {
      say: 'The **sine law** is $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$. Use it when you know a side **and its opposite angle**, plus one more piece.',
      example: ['$\\angle A = 30^\\circ$, $\\angle B = 90^\\circ$, $a = 4$. Find $b$.', '$\\frac{b}{\\sin 90^\\circ} = \\frac{4}{\\sin 30^\\circ}$', '$b = \\frac{4 \\sin 90^\\circ}{\\sin 30^\\circ} = \\frac{4(1)}{0.5}$', '$b = 8$'],
      check: { q: 'What must you know to use the sine law?', options: ['A side and the angle opposite it', 'Two sides and the angle between them', 'Three sides only', 'One angle only'], answer: 0, why: 'The sine law pairs each side with its opposite angle.' },
    },
    {
      say: 'To find an angle with the sine law, keep each side with its own angle. Solve for the sine, then use $\\sin^{-1}$ on the calculator.',
      example: ['$\\angle A = 30^\\circ$, $a = 6$, $b = 6$. Find $\\angle B$.', '$\\frac{\\sin B}{6} = \\frac{\\sin 30^\\circ}{6}$', '$\\sin B = \\frac{6(0.5)}{6} = 0.5$', '$\\angle B = \\sin^{-1}(0.5) = 30^\\circ$'],
      check: { q: '$\\angle A = 40^\\circ$, $a = 9$, $b = 7$. Which equation finds $\\angle B$?', options: ['$\\frac{\\sin B}{7} = \\frac{\\sin 40^\\circ}{9}$', '$\\frac{\\sin B}{9} = \\frac{\\sin 40^\\circ}{7}$', '$\\frac{\\sin B}{40} = \\frac{9}{7}$', '$7^2 = 9^2 - 2(9)\\cos 40^\\circ$'], answer: 0, why: '$\\angle B$ goes with side $b = 7$, and $40^\\circ$ goes with $a = 9$.' },
    },
    {
      say: 'The **cosine law** $a^2 = b^2 + c^2 - 2bc\\cos A$ finds a side when you know two sides and the angle **between** them (the **included** angle).',
      example: ['$b = 3$, $c = 5$, $\\angle A = 60^\\circ$. Find $a$.', '$a^2 = 9 + 25 - 2(3)(5)\\cos 60^\\circ$', '$a^2 = 34 - 30(0.5) = 34 - 15 = 19$', '$a = \\sqrt{19} \\approx 4.4$'],
      check: { q: '$b = 2$, $c = 3$, $\\angle A = 60^\\circ$. Find $a$.', options: ['$\\sqrt{7}$', '$\\sqrt{19}$', '$\\sqrt{13}$', '$7$'], answer: 0, why: '$a^2 = 4 + 9 - 2(2)(3)(0.5) = 13 - 6 = 7$.' },
    },
    {
      say: 'With all **three sides**, rearrange the cosine law to find an angle: $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$. The side opposite the angle you want is the one subtracted.',
      example: ['$a = 7$, $b = 5$, $c = 8$. Find $\\angle A$.', '$\\cos A = \\frac{25 + 64 - 49}{2(5)(8)}$', '$= \\frac{40}{80} = \\frac{1}{2}$', '$\\angle A = \\cos^{-1}(0.5) = 60^\\circ$'],
      check: { q: '$a = 6$, $b = 4$, $c = 5$. What is $\\cos A$?', options: ['$\\frac{1}{8}$', '$\\frac{77}{40}$', '$-\\frac{1}{8}$', '$\\frac{3}{4}$'], answer: 0, why: '$\\frac{16 + 25 - 36}{2(4)(5)} = \\frac{5}{40} = \\frac{1}{8}$.' },
    },
    {
      say: 'Choosing: a side with its opposite angle known means **sine law**. Two sides with the angle between them, or three sides, means **cosine law**.',
      example: ['Know $\\angle A$, $\\angle B$, $a$: sine law.', 'Know $b$, $c$, $\\angle A$: cosine law.', 'Know $a$, $b$, $c$: cosine law.'],
      check: { q: 'You know $b$, $c$ and $\\angle A$. Which law finds $a$?', options: ['Cosine law', 'Sine law', 'Either one', 'Neither'], answer: 0, why: '$\\angle A$ is between sides $b$ and $c$, and its opposite side is unknown.' },
    },
    {
      say: 'Set your calculator to **degree mode**. Keep full decimals until the end; round only the final answer. (This review is not tested directly on the diploma, but the habits carry over.)',
      example: ['Degree mode: $\\sin 30^\\circ = 0.5$.', 'Radian mode gives $\\sin 30 \\approx -0.988$. Wrong mode!'],
      check: { q: 'Your calculator says $\\sin 30 \\approx -0.988$. What is wrong?', options: ['It is in radian mode', '$\\sin 30^\\circ$ really is negative', 'You rounded too early', 'Nothing is wrong'], answer: 0, why: 'In degree mode $\\sin 30^\\circ = 0.5$. Here a negative value means radian mode.' },
    },
  ],
};
