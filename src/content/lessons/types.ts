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

export type ExplorePreset = TransformPreset | OpsPreset | PolyPreset | ExpLogPreset | LogLawPreset;

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
