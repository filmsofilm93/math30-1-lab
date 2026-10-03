// Official Math 30-1 exam reference material: directing words, written-response scoring guide, formula sheet.
// Wording from Alberta Education and Childcare (Information Bulletin 2025–2026, Mathematics Directing Words,
// Mathematics 30–1 Formula Sheet), checked 2026-10-03.

export interface DirectingWord {
  word: string;
  /** Official definition, verbatim. */
  def: string;
  /** What that means in practice on a Math 30-1 written response. */
  inPractice: string;
}

export const DIRECTING_WORDS: DirectingWord[] = [
  { word: 'Algebraically', def: 'Using mathematical procedures that involve variables or symbols to represent values', inPractice: 'Show the algebra step by step. A calculator graph or table alone earns little; you may use it only to check.' },
  { word: 'Analyze', def: 'Make a mathematical examination of parts to determine the nature, proportion, function, interrelationships, and characteristics of the whole', inPractice: 'Break the situation into parts (features, cases, terms) and say how each contributes.' },
  { word: 'Classify', def: 'Arrange items or concepts in categories according to shared qualities or characteristics', inPractice: 'Name the category for each item and the property that puts it there.' },
  { word: 'Compare', def: 'Examine the character or qualities of two things by providing characteristics of both that point out their mutual similarities and differences', inPractice: 'State the feature for both things, side by side: a similarity and a difference, each with values.' },
  { word: 'Conclude', def: 'Make a logical statement based on reasoning and/or evidence', inPractice: 'End with one clear statement that follows from the work shown.' },
  { word: 'Describe', def: 'Give a written account of a concept', inPractice: 'Words, with the key values: e.g. "a horizontal stretch by a factor of 3 about the y-axis".' },
  { word: 'Determine', def: 'Find a solution, to a specified degree of accuracy, to a problem by showing appropriate formulas, procedures, and/or calculations', inPractice: 'Show the formula or method and the work, and give the answer to the accuracy asked (exact, tenth, hundredth). Technology is allowed unless the outcome rules it out.' },
  { word: 'Evaluate', def: 'Find a numerical value or equivalent for an equation, formula, or function', inPractice: 'Substitute and compute; give the value.' },
  { word: 'Explain', def: 'Make clear what is not immediately obvious or entirely known; give the cause of or reason for; make known in detail', inPractice: 'Give the reason, not just the result: "because…". Use the mathematics (a property, a law, a value) as the reason.' },
  { word: 'Illustrate', def: 'Make clear by giving an example. The form of the example will be specified in the question: e.g., a word description, sketch, or diagram', inPractice: 'Give an example in exactly the form asked for.' },
  { word: 'Interpret', def: 'Provide a meaning of something; present information in a new form that adds meaning to the original data', inPractice: 'Say what a number or feature means in the context, with units.' },
  { word: 'Justify', def: 'Indicate why a conclusion has been stated, by providing supporting reasons and/or evidence that form a mathematical argument', inPractice: 'Support the conclusion with a mathematical argument: calculations, a counterexample, or a stated property.' },
  { word: 'Model', def: 'Represent a concept or situation in a concrete or symbolic way', inPractice: 'Write the equation or function (with defined variables) that represents the situation.' },
  { word: 'Prove', def: 'Establish the truth or validity of a statement by giving factual evidence or logical argument', inPractice: 'For an identity: work one side into the other, for all permissible values, with no step that assumes the result. Substituting a value does not prove.' },
  { word: 'Sketch', def: 'Provide a drawing that represents the key features or characteristics of an object or graph', inPractice: 'Label the axes with a scale and show every key feature: intercepts, asymptotes, holes, endpoints, maximums and minimums.' },
  { word: 'Solve', def: 'Give a solution to a problem', inPractice: 'Find every solution in the stated domain, and reject any extraneous ones.' },
  { word: 'Verify', def: 'Establish, by substitution for a particular case or by geometric comparison, the truth of a statement', inPractice: 'Substitute the given value into each side separately and show both sides are equal. One case is enough; it is not a proof.' },
];

export interface ScoreLevel {
  score: number | 'NR';
  descriptor: string;
}

/** General scoring guide for written response, verbatim. Half marks (0.5, 1.5, 2.5) are "augmented" scores with no descriptor. */
export const SCORING_GUIDE: Record<2 | 3, ScoreLevel[]> = {
  2: [
    { score: 'NR', descriptor: 'No response is provided.' },
    { score: 0, descriptor: 'In the response, the student does not address the question or provides a solution that is invalid.' },
    { score: 1, descriptor: 'In the response, the student demonstrates basic mathematical understanding of the problem by applying an appropriate strategy or relevant mathematical knowledge to find a partial solution.' },
    { score: 2, descriptor: 'In the response, the student demonstrates complete mathematical understanding of the problem by applying an appropriate strategy or relevant mathematical knowledge to find a complete and correct solution.' },
  ],
  3: [
    { score: 'NR', descriptor: 'No response is provided.' },
    { score: 0, descriptor: 'In the response, the student does not address the question or provides a solution that is invalid.' },
    { score: 1, descriptor: 'In the response, the student demonstrates minimal mathematical understanding of the problem by applying an appropriate strategy or some relevant mathematical knowledge to complete initial stages of a solution.' },
    { score: 2, descriptor: 'In the response, the student demonstrates good mathematical understanding of the problem by applying an appropriate strategy or relevant mathematical knowledge to find a partial solution.' },
    { score: 3, descriptor: 'In the response, the student demonstrates complete mathematical understanding of the problem by applying an appropriate strategy or relevant mathematical knowledge to find a complete and correct solution.' },
  ],
};
export const HALF_MARK_NOTE = 'A response that does not meet the performance level of a benchmark score may receive an augmented score of 0.5, 1.5, or 2.5.';
export const FULL_MARKS_NOTE = 'For full marks, your responses must address all aspects of the question. All responses, including descriptions and/or explanations of concepts, must include pertinent ideas, calculations, formulas, and correct units.';

export interface FormulaSection {
  title: string | null;
  groups: { heading?: string; lines: string[] }[];
}

/** Mathematics 30–1 Formula Sheet, in sheet order. Lines are LaTeX. No unit circle or diagrams appear on the sheet. */
export const FORMULA_SHEET: FormulaSection[] = [
  { title: null, groups: [{ lines: ['\\text{For } ax^2 + bx + c = 0,\\quad x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'] }] },
  {
    title: 'Relations and Functions',
    groups: [
      { heading: 'Graphing Calculator Window Format', lines: ['x{:}\\ [x_{\\min}, x_{\\max}, x_{\\text{scl}}]', 'y{:}\\ [y_{\\min}, y_{\\max}, y_{\\text{scl}}]'] },
      { heading: 'Laws of Logarithms', lines: ['\\log_b(M \\times N) = \\log_b M + \\log_b N', '\\log_b\\left(\\dfrac{M}{N}\\right) = \\log_b M - \\log_b N', '\\log_b(M^n) = n\\log_b M', '\\log_a b = \\dfrac{\\log_c b}{\\log_c a}'] },
      { heading: 'Growth/Decay Formula', lines: ['y = ab^{\\frac{t}{p}}'] },
      { heading: 'General Form of a Transformed Function', lines: ['y = af[b(x - h)] + k'] },
    ],
  },
  {
    title: 'Permutations, Combinations, and the Binomial Theorem',
    groups: [
      {
        lines: [
          'n! = n(n-1)(n-2)\\ldots 3 \\times 2 \\times 1,\\ \\text{where } n \\in N \\text{ and } 0! = 1',
          '{}_nP_r = \\dfrac{n!}{(n-r)!}',
          '{}_nC_r = \\dfrac{n!}{(n-r)!\\,r!} \\qquad {}_nC_r = \\dbinom{n}{r}',
          '\\text{In the expansion of } (x+y)^n, \\text{ written in descending powers of } x, \\text{ the general term is } t_{k+1} = {}_nC_k\\, x^{n-k} y^k.',
        ],
      },
    ],
  },
  {
    title: 'Trigonometry',
    groups: [
      {
        lines: [
          '\\theta = \\dfrac{a}{r}',
          '\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta} \\qquad \\cot\\theta = \\dfrac{\\cos\\theta}{\\sin\\theta}',
          '\\csc\\theta = \\dfrac{1}{\\sin\\theta} \\qquad \\sec\\theta = \\dfrac{1}{\\cos\\theta} \\qquad \\cot\\theta = \\dfrac{1}{\\tan\\theta}',
          '\\sin^2\\theta + \\cos^2\\theta = 1',
          '1 + \\tan^2\\theta = \\sec^2\\theta',
          '1 + \\cot^2\\theta = \\csc^2\\theta',
          '\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta',
          '\\sin(\\alpha - \\beta) = \\sin\\alpha\\cos\\beta - \\cos\\alpha\\sin\\beta',
          '\\cos(\\alpha + \\beta) = \\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta',
          '\\cos(\\alpha - \\beta) = \\cos\\alpha\\cos\\beta + \\sin\\alpha\\sin\\beta',
          '\\tan(\\alpha + \\beta) = \\dfrac{\\tan\\alpha + \\tan\\beta}{1 - \\tan\\alpha\\tan\\beta}',
          '\\tan(\\alpha - \\beta) = \\dfrac{\\tan\\alpha - \\tan\\beta}{1 + \\tan\\alpha\\tan\\beta}',
          '\\sin(2\\alpha) = 2\\sin\\alpha\\cos\\alpha',
          '\\cos(2\\alpha) = \\cos^2\\alpha - \\sin^2\\alpha',
          '\\cos(2\\alpha) = 2\\cos^2\\alpha - 1',
          '\\cos(2\\alpha) = 1 - 2\\sin^2\\alpha',
          '\\tan(2\\alpha) = \\dfrac{2\\tan\\alpha}{1 - \\tan^2\\alpha}',
          'y = a\\sin[b(x - c)] + d',
          'y = a\\cos[b(x - c)] + d',
        ],
      },
    ],
  },
];
