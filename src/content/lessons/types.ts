import type { Tier } from '../../engine/types';

export interface TransformPreset {
  explorer: 'transformation';
  base: string;
  a?: number;
  b?: number;
  h?: number;
  k?: number;
  /** Which sliders to show. */
  sliders: ('a' | 'b' | 'h' | 'k')[];
  showInverse?: boolean;
  showInvariant?: boolean;
}

export interface OpsPreset {
  explorer: 'function-ops';
  f: string; // id from the function-ops lab
  g: string;
  op: '+' | '-' | '*' | '/' | 'compose';
}

export interface PolyPreset {
  explorer: 'polynomial';
  zeros: { r: number; m: number }[];
  lead?: number;
  /** Open on the graph or on synthetic division. */
  view?: 'graph' | 'divide';
  /** Divisor x − a for the division view. */
  a?: number;
  /** Coefficients to divide (highest power first); defaults to the polynomial built from the zeros. */
  coeffs?: number[];
}

export interface ExpLogPreset {
  explorer: 'exp-log';
  /** Base, b > 0, b ≠ 1. */
  b?: number;
  showInverse?: boolean;
  /** Show a, c, d sliders for y = a·b^(x − c) + d. */
  transform?: boolean;
}

export interface LogLawPreset {
  explorer: 'log-law';
  problem: string; // id from LOG_PROBLEMS
}

export interface UnitCirclePreset {
  explorer: 'unit-circle';
  /** Starting angle in degrees. */
  angle?: number;
  inRad?: boolean;
  /** Show the coterminal list, the arc-length panel, or all six ratios. */
  show?: ('coterminal' | 'arc' | 'ratios')[];
}

export interface SinusoidPreset {
  explorer: 'sinusoid';
  mode?: 'explore' | 'match' | 'model';
  f?: 'sin' | 'cos';
  inRad?: boolean;
  /** Offer y = tan x for the basic-graphs lesson. */
  tan?: boolean;
  /** Use bx − k (unfactored) in the equation readout. */
  unfactored?: boolean;
}

export interface TrigEquationPreset {
  explorer: 'trig-equation';
  fn?: 'sin' | 'cos' | 'tan';
  k?: number;
  /** Second factor value, for second-degree equations. */
  k2?: number;
  inRad?: boolean;
}

export interface IdentityPreset {
  explorer: 'identity';
  problem: string; // id from IDENTITY_PROBLEMS
}

export interface RadicalPreset {
  explorer: 'radical';
  mode?: 'transform' | 'sqrt-of-f' | 'solve';
  /** Starting f(x) for the √f(x) view. */
  f?: 'linear' | 'quadratic';
}

export interface RationalPreset {
  explorer: 'rational';
  /** Zeros of the numerator and denominator factors (x − r), and the constant k. */
  num: number[];
  den: number[];
  k?: number;
}

export interface CountingPreset {
  explorer: 'counting';
  mode?: 'slots' | 'arrange' | 'cases' | 'pascal' | 'term';
  /** Starting values for the slots view. */
  n?: number;
  r?: number;
  order?: boolean;
  /** Starting constraint for the arrange view. */
  constraint?: 'none' | 'together' | 'apart' | 'first';
  /** Starting binomial (a·x^p + b·x^q)^n for the term view. */
  term?: { a: number; p: number; b: number; q: number; n: number };
}

export type ExplorePreset = TransformPreset | OpsPreset | PolyPreset | ExpLogPreset | LogLawPreset | UnitCirclePreset | SinusoidPreset | TrigEquationPreset | IdentityPreset | RadicalPreset | RationalPreset | CountingPreset;

export interface Predict {
  question: string; // rich text
  options: string[]; // rich text
  answer: number;
  /** What to try in the explorer to test the prediction. */
  tryIt: string;
}

export interface Lesson {
  nodeId: string;
  explore?: { preset: ExplorePreset; predict: Predict };
  /** Concise explanation, ≤ 200 words, rich text paragraphs. */
  explain: string[];
  /** Worked examples: generator items shown step by step. */
  examples: { generatorId: string; seed: number; tier: Tier }[];
}
