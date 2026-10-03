import type { Lesson } from './types';

/** Unit 6 (permutations, combinations, binomial theorem) lessons. Explanations are ≤ 200 words; examples are generator items revealed step by step. */
export const U6_LESSONS: Lesson[] = [
  {
    nodeId: 'PCBT1.fcp',
    explore: {
      preset: { explorer: 'counting', mode: 'slots', n: 10, r: 3, order: true },
      predict: {
        question: 'How many 3-digit codes use the digits 0–9 if digits may repeat?',
        options: ['$1000$', '$720$', '$30$', '$120$'],
        answer: 0,
        tryIt: 'Set $n = 10$, $r = 3$, tick "Repetition allowed".',
      },
    },
    explain: [
      '**Fundamental counting principle**: if one task can be done in $m$ ways and a second, independent task in $n$ ways, both together can be done in $m \\times n$ ways.',
      'Draw a **slot diagram**: one box per decision, write the number of choices in each, multiply.',
      'Fill the most restricted slot first. For odd 3-digit numbers from 1–9 without repetition: last digit 5 choices, first 8, middle 7, giving $5 \\times 8 \\times 7 = 280$.',
      '**And** (both happen, one after the other): multiply. **Or** (one case or the other, no overlap): add.',
      'Example: a meal is a soup (3) **and** a main (4): $3 \\times 4 = 12$. A meal is a soup (3) **or** a salad (2): $3 + 2 = 5$.',
      'Without repetition, each slot has one fewer choice than the previous. With repetition, every slot has the full count.',
    ],
    examples: [
      { generatorId: 'u6-fcp-constraint', seed: 2, tier: 2 },
      { generatorId: 'u6-fcp-and-or', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'PCBT1.factorial',
    explain: [
      '$n! = n(n - 1)(n - 2) \\cdots (2)(1)$ for $n \\in N$, and $0! = 1$.',
      '$n!$ counts the ways to arrange $n$ different objects in a row.',
      'Cancel instead of expanding: $\\frac{9!}{7!} = \\frac{9 \\cdot 8 \\cdot 7!}{7!} = 72$.',
      'With variables, write the larger factorial down to the smaller: $\\frac{(n + 1)!}{(n - 1)!} = \\frac{(n + 1)(n)(n - 1)!}{(n - 1)!} = n(n + 1)$.',
      'Restrictions come from the factorials: $(n - 2)!$ needs $n - 2 \\ge 0$, so $n \\ge 2$.',
      'A product of consecutive integers is a quotient of factorials: $8 \\cdot 7 \\cdot 6 = \\frac{8!}{5!}$.',
      '$n! = n(n - 1)!$ is the key step in almost every simplification.',
    ],
    examples: [
      { generatorId: 'u6-fact-simplify', seed: 2, tier: 2 },
      { generatorId: 'u6-fact-eval', seed: 3, tier: 3 },
    ],
  },
  {
    nodeId: 'PCBT2.npr',
    explore: {
      preset: { explorer: 'counting', mode: 'slots', n: 8, r: 3, order: true },
      predict: {
        question: 'A club of 8 elects a president, vice-president and treasurer. How many outcomes?',
        options: ['$336$', '$56$', '$512$', '$24$'],
        answer: 0,
        tryIt: 'Set $n = 8$, $r = 3$ with order on.',
      },
    },
    explain: [
      'A **permutation** is an arrangement where order matters.',
      '${}_nP_r = \\frac{n!}{(n - r)!}$ counts arrangements of $r$ objects chosen from $n$ different objects, $0 \\le r \\le n$.',
      'It is the slot product: ${}_8P_3 = 8 \\cdot 7 \\cdot 6 = 336$.',
      '${}_nP_n = n!$ and ${}_nP_0 = 1$.',
      'Order matters when positions differ: officers with titles, digits in a code, letters in a word, finishing places in a race.',
      'Arranging all the letters of a word with no repeated letters: $n!$. Using only $r$ of them: ${}_nP_r$.',
    ],
    examples: [
      { generatorId: 'u6-npr-officers', seed: 2, tier: 2 },
      { generatorId: 'u6-npr-words', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'PCBT2.constraints',
    explore: {
      preset: { explorer: 'counting', mode: 'arrange', constraint: 'together' },
      predict: {
        question: 'In how many ways can the letters of MATHS be arranged with M and A together?',
        options: ['$48$', '$24$', '$120$', '$72$'],
        answer: 0,
        tryIt: 'Choose "M and A together" and build a few.',
      },
    },
    explain: [
      '**Together**: glue the objects into one block. Arrange the block with the rest, then arrange inside the block. For MATHS with M, A together: $4! \\times 2! = 48$.',
      '**Apart** (not together): total minus together. $5! - 48 = 72$.',
      '**Ends or fixed positions**: fill those slots first, then arrange the rest. Vowel at each end of MATHS: only one vowel, so $0$.',
      'Starts with a consonant: $4$ choices for the first slot, then $4!$ for the rest: $96$.',
      'Several people must sit together **and** the group can be anywhere: (number of units)! $\\times$ (inside arrangements).',
      'When a constraint makes direct counting messy, count the complement and subtract.',
    ],
    examples: [
      { generatorId: 'u6-perm-together', seed: 2, tier: 2 },
      { generatorId: 'u6-perm-apart', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'PCBT2.repeated',
    explore: {
      preset: { explorer: 'counting', mode: 'arrange' },
      predict: {
        question: 'How many different arrangements of LEVEL are there?',
        options: ['$30$', '$120$', '$60$', '$20$'],
        answer: 0,
        tryIt: 'Choose LEVEL and read the formula.',
      },
    },
    explain: [
      'With identical objects, swapping two identical ones gives the same arrangement, so $n!$ over-counts.',
      'For $n$ objects with $a$ alike, $b$ alike, …: $\\frac{n!}{a!\\,b!\\cdots}$.',
      'LEVEL: two L, two E: $\\frac{5!}{2!\\,2!} = 30$.',
      '**Pathways on a grid**: every shortest route from one corner to the opposite corner of a $3 \\times 4$ block grid is an arrangement of $3$ U and $4$ R moves: $\\frac{7!}{3!\\,4!} = 35$.',
      'Through a required point: multiply the routes to it by the routes from it.',
      'Fixed letters first: arrangements of LEVEL starting with L leave L, E, V, E: $\\frac{4!}{2!} = 12$.',
    ],
    examples: [
      { generatorId: 'u6-rep-word', seed: 2, tier: 2 },
      { generatorId: 'u6-rep-grid', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'PCBT2.cases',
    explore: {
      preset: { explorer: 'counting', mode: 'cases' },
      predict: {
        question: 'How many even 3-digit numbers can be made from 0–5 without repetition?',
        options: ['$52$', '$60$', '$48$', '$100$'],
        answer: 0,
        tryIt: 'Build one case for last digit 0 and one for last digit 2 or 4.',
      },
    },
    explain: [
      'When one slot\'s count depends on another slot, split into **cases** so each case has fixed counts, then **add** the cases.',
      'Example: even 3-digit numbers from 0–5, no repeats. The last digit must be 0, 2 or 4, but 0 also cannot lead.',
      'Case 1, last digit 0: $5 \\times 4 \\times 1 = 20$.',
      'Case 2, last digit 2 or 4: first digit cannot be 0 or the last digit, so $4 \\times 4 \\times 2 = 32$.',
      'Total: $20 + 32 = 52$.',
      'Cases must not overlap and must cover every possibility. Name each case by what it fixes.',
      'Case-split also handles "$r$ letters or more", "at most 3 digits", and lengths that vary: count each length and add.',
    ],
    examples: [
      { generatorId: 'u6-cases-even', seed: 2, tier: 2 },
      { generatorId: 'u6-cases-or', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'PCBT2.solve-n',
    explain: [
      'Write ${}_nP_r$ with factorials, cancel, and solve the polynomial equation.',
      '${}_nP_2 = 30$: $\\frac{n!}{(n - 2)!} = n(n - 1) = 30$, so $n^2 - n - 30 = 0$, $(n - 6)(n + 5) = 0$.',
      'Reject roots that are not natural numbers or that break the restriction $n \\ge r$: $n = -5$ is rejected, so $n = 6$.',
      'For ${}_nP_3$, the product $n(n - 1)(n - 2)$ is three consecutive integers; find them by estimation and check.',
      'Solve for $r$ by trial: ${}_7P_r = 210 = 7 \\cdot 6 \\cdot 5$, so $r = 3$.',
      'Always state the restriction before solving and test the answer in the original.',
    ],
    examples: [
      { generatorId: 'u6-solven-npr', seed: 2, tier: 2 },
      { generatorId: 'u6-solven-npr3', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'PCBT3.ncr',
    explore: {
      preset: { explorer: 'counting', mode: 'slots', n: 8, r: 3, order: false },
      predict: {
        question: 'How many 3-person committees can be chosen from 8 people?',
        options: ['$56$', '$336$', '$24$', '$512$'],
        answer: 0,
        tryIt: 'Untick "Order matters" and read the division.',
      },
    },
    explain: [
      'A **combination** is a selection where order does not matter.',
      '${}_nC_r = \\binom{n}{r} = \\frac{n!}{(n - r)!\\,r!}$: the permutations divided by the $r!$ orderings of each selection.',
      '${}_8C_3 = \\frac{8 \\cdot 7 \\cdot 6}{3!} = 56$.',
      'Symmetry: ${}_nC_r = {}_nC_{n - r}$. Choosing 3 to take is the same as choosing 5 to leave.',
      'Committees, hands of cards, pizza toppings and groups are combinations. Officers with titles, codes and arrangements are permutations.',
      'Choosing from two groups: multiply the selections from each. 2 teachers from 5 and 3 students from 10: ${}_5C_2 \\cdot {}_{10}C_3 = 1200$.',
    ],
    examples: [
      { generatorId: 'u6-ncr-committee', seed: 2, tier: 2 },
      { generatorId: 'u6-ncr-vs-npr', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'PCBT3.at-least',
    explain: [
      '"**At least** $k$" means $k$ or more. "**At most** $k$" means $k$ or fewer.',
      '**Direct method**: list the allowed cases and add. At least 2 women on a committee of 3 from 4 women and 5 men: $\\binom{4}{2}\\binom{5}{1} + \\binom{4}{3}\\binom{5}{0} = 30 + 4 = 34$.',
      '**Indirect method**: total minus the cases that fail. At least one woman: $\\binom{9}{3} - \\binom{5}{3} = 84 - 10 = 74$.',
      'Use the indirect method when the failing cases are fewer, especially for "at least one".',
      'A common error: choosing one woman first, then any 2 of the rest, counts some committees twice.',
      'Check the cases cover every valid number exactly once.',
    ],
    examples: [
      { generatorId: 'u6-atleast-one', seed: 2, tier: 2 },
      { generatorId: 'u6-atleast-k', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'PCBT3.mixed',
    explain: [
      'Many problems have a **choose** step and an **arrange** step. Choose with ${}_nC_r$, then arrange the chosen objects with $r!$ or ${}_rP_k$.',
      'Example: choose 3 of 7 books and arrange them on a shelf: ${}_7C_3 \\times 3! = 210 = {}_7P_3$.',
      'Choose 2 vowels from 3 and 2 consonants from 5, then arrange all 4: $\\binom{3}{2}\\binom{5}{2} \\times 4! = 720$.',
      'Roles within a group: choose a committee of 5 from 9, then a chair from the 5: $\\binom{9}{5} \\times 5 = 630$.',
      'Ask of every step: does swapping two chosen objects give a different outcome? If yes, order matters.',
      'Break a complex problem into stages joined by "and" (multiply) or cases joined by "or" (add).',
    ],
    examples: [
      { generatorId: 'u6-mixed-choose-arrange', seed: 2, tier: 2 },
      { generatorId: 'u6-mixed-roles', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'PCBT3.solve-n',
    explain: [
      'Write ${}_nC_r$ with factorials, cancel the $(n - r)!$, multiply out the $r!$, and solve.',
      '${}_nC_2 = 28$: $\\frac{n(n - 1)}{2} = 28$, so $n^2 - n - 56 = 0$, $(n - 8)(n + 7) = 0$. Reject $-7$: $n = 8$.',
      'Restriction: $n \\ge r$ and $n \\in N$.',
      'Mixed equations: ${}_nP_2 = 6\\,{}_nC_3$ reduces to $n(n - 1) = n(n - 1)(n - 2)$, so $n - 2 = 1$ and $n = 3$.',
      'Handshakes: $n$ people each shaking hands once gives $\\binom{n}{2}$ handshakes; the same equation.',
      'Solving for $r$: use symmetry; ${}_{10}C_r = 45$ has $r = 2$ and $r = 8$.',
    ],
    examples: [
      { generatorId: 'u6-solven-ncr', seed: 2, tier: 2 },
      { generatorId: 'u6-solven-ncr-mixed', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'PCBT4.pascal',
    explore: {
      preset: { explorer: 'counting', mode: 'pascal' },
      predict: {
        question: 'What is the sum of the numbers in the row of Pascal\'s triangle that begins $1, 6$?',
        options: ['$64$', '$36$', '$32$', '$21$'],
        answer: 0,
        tryIt: 'Tap the row that begins 1, 6 and add its entries.',
      },
    },
    explain: [
      'Each entry is the sum of the two entries above it. The edges are 1.',
      'Rows are often counted from the top single 1 as **row 0**; some questions call it row 1. Read the question\'s convention, or identify the row by its second entry: the row beginning $1, n$ is the $n$th power.',
      'The entries of the row beginning $1, n$ are ${}_nC_0, {}_nC_1, \\ldots, {}_nC_n$: the coefficients of $(a + b)^n$.',
      'Pascal\'s identity: ${}_nC_{r} = {}_{n-1}C_{r-1} + {}_{n-1}C_{r}$.',
      'The row beginning $1, n$ has $n + 1$ entries and sums to $2^n$.',
      'Rows are symmetric because ${}_nC_r = {}_nC_{n - r}$.',
    ],
    examples: [
      { generatorId: 'u6-pascal-entry', seed: 2, tier: 2 },
      { generatorId: 'u6-pascal-sum', seed: 1, tier: 2 },
    ],
  },
  {
    nodeId: 'PCBT4.expand',
    explore: {
      preset: { explorer: 'counting', mode: 'pascal' },
      predict: {
        question: 'What is the coefficient of $a^2b^2$ in $(a + b)^4$?',
        options: ['$6$', '$4$', '$2$', '$1$'],
        answer: 0,
        tryIt: 'Tap the middle entry of the row that begins 1, 4.',
      },
    },
    explain: [
      '**Binomial theorem**: $(x + y)^n = \\sum_{k=0}^{n} {}_nC_k\\, x^{n - k} y^k$.',
      'There are $n + 1$ terms. Powers of $x$ fall from $n$ to $0$; powers of $y$ rise from $0$ to $n$; in each term they add to $n$.',
      'Put brackets around each whole term, including its coefficient and sign. $(2x - 3)^3 = (2x)^3 + 3(2x)^2(-3) + 3(2x)(-3)^2 + (-3)^3$.',
      'Simplify: $8x^3 - 36x^2 + 54x - 27$.',
      'A negative second term makes the signs alternate.',
      'Check: substitute $x = 1$ in both sides. $(2 - 3)^3 = -1$ and $8 - 36 + 54 - 27 = -1$.',
    ],
    examples: [
      { generatorId: 'u6-expand-full', seed: 2, tier: 2 },
      { generatorId: 'u6-expand-coef', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'PCBT4.general-term',
    explore: {
      preset: { explorer: 'counting', mode: 'term', term: { a: 1, p: 1, b: 2, q: 0, n: 5 } },
      predict: {
        question: 'In $(x + 2)^5$, what is the third term?',
        options: ['$40x^3$', '$10x^3$', '$80x^2$', '$20x^3$'],
        answer: 0,
        tryIt: 'Set $k = 2$ (the third term is $t_{k+1}$ with $k = 2$).',
      },
    },
    explain: [
      'The **general term** of $(x + y)^n$ is $t_{k + 1} = {}_nC_k\\, x^{n - k} y^k$.',
      'The term number is one more than $k$: the 4th term has $k = 3$.',
      'Keep each term in brackets with its sign: the 3rd term of $(2x - 1)^6$ is ${}_6C_2 (2x)^4 (-1)^2 = 15 \\cdot 16x^4 = 240x^4$.',
      'The **middle term** exists when $n$ is even: it is $t_{n/2 + 1}$. When $n$ is odd there are two middle terms.',
      'Counting from the end: the $k$th term from the end of $(x + y)^n$ is the $(n + 2 - k)$th from the start.',
    ],
    examples: [
      { generatorId: 'u6-term-kth', seed: 2, tier: 2 },
      { generatorId: 'u6-term-middle', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'PCBT4.nonlinear-term',
    explore: {
      preset: { explorer: 'counting', mode: 'term', term: { a: 2, p: 1, b: -1, q: -1, n: 6 } },
      predict: {
        question: 'Which $k$ gives the constant term of $\\left(2x - \\frac{1}{x}\\right)^6$?',
        options: ['$k = 3$', '$k = 6$', '$k = 2$', 'There is none'],
        answer: 0,
        tryIt: 'Move $k$ until the power of $x$ is 0.',
      },
    },
    explain: [
      'For $(a x^p + b x^q)^n$, the general term is ${}_nC_k\\,(a x^p)^{n - k}(b x^q)^k$.',
      'Its power of $x$ is $p(n - k) + qk$: each factor contributes its exponent times how often it is used.',
      'To find the term with $x^m$, solve $p(n - k) + qk = m$ for $k$.',
      '**Constant term**: set the power to $0$. In $\\left(2x - \\frac{1}{x}\\right)^6$: $(6 - k) - k = 0$, so $k = 3$, and the term is ${}_6C_3 (2x)^3\\left(-\\frac{1}{x}\\right)^3 = 20 \\cdot 8 \\cdot (-1) = -160$.',
      'If $k$ is not a whole number from $0$ to $n$, no such term exists.',
      'Write $\\frac{1}{x}$ as $x^{-1}$ and $\\sqrt{x}$ as $x^{1/2}$ before combining powers.',
    ],
    examples: [
      { generatorId: 'u6-nl-constant', seed: 2, tier: 2 },
      { generatorId: 'u6-nl-power', seed: 1, tier: 3 },
    ],
  },
  {
    nodeId: 'PCBT4.find-unknown',
    explain: [
      'Write the general term with the unknown left in, set it equal to what is given, and solve.',
      'Unknown constant: the coefficient of $x^2$ in $(1 + ax)^5$ is $90$. The term is ${}_5C_2 (ax)^2 = 10a^2x^2$, so $10a^2 = 90$ and $a = \\pm 3$.',
      'Keep both signs unless the question restricts them; an even power of $a$ cannot tell them apart.',
      'Unknown exponent: if the second term of $(x + 2)^n$ is $12x^5$, then ${}_nC_1 \\cdot x^{n - 1} \\cdot 2 = 2n x^{n - 1}$. Matching powers gives $n = 6$, and the coefficient checks: $2(6) = 12$.',
      'Use the power first (it often fixes $k$ or $n$), then the coefficient.',
      'Test the answer by computing the term again.',
    ],
    examples: [
      { generatorId: 'u6-find-a', seed: 2, tier: 2 },
      { generatorId: 'u6-find-n', seed: 1, tier: 3 },
    ],
  },
];
