/** How qasim's class groups the course: 4 units of McGraw-Hill Ryerson Pre-Calculus 12 chapters, taught section by section. */
export const COURSE_UNITS: { n: number; title: string; chapters: number[] }[] = [
  { n: 1, title: 'Transformations, radicals and polynomials', chapters: [1, 2, 3] },
  { n: 2, title: 'Trigonometry', chapters: [4, 5, 6] },
  { n: 3, title: 'Exponents and logarithms', chapters: [7, 8] },
  { n: 4, title: 'Rational functions, function operations, counting', chapters: [9, 10, 11] },
];

/** Section titles from the textbook's table of contents. */
export const SECTION_TITLE: Record<string, string> = {
  '1.1': 'Horizontal and vertical translations',
  '1.2': 'Reflections and stretches',
  '1.3': 'Combining transformations',
  '1.4': 'Inverse of a relation',
  '2.1': 'Radical functions and transformations',
  '2.2': 'Square root of a function',
  '2.3': 'Solving radical equations graphically',
  '3.1': 'Characteristics of polynomial functions',
  '3.2': 'The remainder theorem',
  '3.3': 'The factor theorem',
  '3.4': 'Equations and graphs of polynomial functions',
  '4.1': 'Angles and angle measure',
  '4.2': 'The unit circle',
  '4.3': 'Trigonometric ratios',
  '4.4': 'Introduction to trigonometric equations',
  '5.1': 'Graphing sine and cosine functions',
  '5.2': 'Transformations of sinusoidal functions',
  '5.3': 'The tangent function',
  '5.4': 'Equations and graphs of trigonometric functions',
  '6.1': 'Reciprocal, quotient and Pythagorean identities',
  '6.2': 'Sum, difference and double-angle identities',
  '6.3': 'Proving identities',
  '6.4': 'Solving trigonometric equations using identities',
  '7.1': 'Characteristics of exponential functions',
  '7.2': 'Transformations of exponential functions',
  '7.3': 'Solving exponential equations',
  '8.1': 'Understanding logarithms',
  '8.2': 'Transformations of logarithmic functions',
  '8.3': 'Laws of logarithms',
  '8.4': 'Logarithmic and exponential equations',
  '9.1': 'Exploring rational functions using transformations',
  '9.2': 'Analysing rational functions',
  '9.3': 'Connecting graphs and rational equations',
  '10.1': 'Sums and differences of functions',
  '10.2': 'Products and quotients of functions',
  '10.3': 'Composite functions',
  '11.1': 'Permutations',
  '11.2': 'Combinations',
  '11.3': 'Binomial theorem',
};

/** Compare section labels like "2.3" and "10.1" numerically. */
export const bySection = (a: string, b: string) => {
  const [p, q] = [a.split('.').map(Number), b.split('.').map(Number)];
  return p[0] - q[0] || p[1] - q[1];
};
