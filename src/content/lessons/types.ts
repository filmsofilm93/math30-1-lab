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

export interface Predict {
  question: string; // rich text
  options: string[]; // rich text
  answer: number;
  /** What to try in the explorer to test the prediction. */
  tryIt: string;
}

export interface Lesson {
  nodeId: string;
  explore?: { preset: TransformPreset | OpsPreset; predict: Predict };
  /** Concise explanation, ≤ 200 words, rich text paragraphs. */
  explain: string[];
  /** Worked examples: generator items shown step by step. */
  examples: { generatorId: string; seed: number; tier: Tier }[];
}
