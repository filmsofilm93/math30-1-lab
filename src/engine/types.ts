import type { RealSet } from './check/realset';

export type Cognitive = 'conceptual' | 'problemSolving' | 'procedural';
export type Tier = 1 | 2 | 3;
export type Round = 'whole' | 'tenth' | 'hundredth';

/** What a single answer box expects. */
export type AnswerSpec =
  | { kind: 'number'; value: number; tex: string; exact?: boolean; round?: Round }
  | {
      kind: 'expr';
      tex: string; // canonical answer, shown in the solution
      variable: string; // usually x
      fn: (v: number) => number; // independent evaluator for the expected answer
      sample: [number, number]; // sampling window inside the domain
      /** Second branch for answers like y = 2 ± √(x − 1). */
      fnMinus?: (v: number) => number;
      exact?: boolean;
      /** Also require the typed answer to be fully factored over the integers, or a single logarithm. */
      form?: 'factored' | 'single-log' | 'simplified';
    }
  | { kind: 'set'; values: number[]; tex: string; exact?: boolean; deg?: boolean; round?: Round } // finite solution set, order-free; [] = no solution; deg: values in degrees, ° optional
  /** General solution: every root + period·n, n ∈ I. Equivalent forms are accepted (compared as sets over several periods). */
  | { kind: 'general'; roots: number[]; period: number; tex: string; deg?: boolean }
  | { kind: 'points'; values: [number, number][]; tex: string } // set of ordered pairs (one point = list of one)
  | { kind: 'interval'; value: RealSet; tex: string };

export interface Field {
  label?: string; // plain text above the box
  prefix?: string; // LaTeX before the box, e.g. "y ="
  answer: AnswerSpec;
}

export interface Choice {
  tex: string; // rich text with $math$
  correct: boolean;
  misconception?: string; // curriculum misconception id; required on distractors
  feedback?: string; // item-specific note shown when chosen
}

export interface Curve {
  fn: (x: number) => number;
  role: 'base' | 'image' | 'aux';
  label?: string;
  domain?: [number, number];
  /** x-values where the curve is broken (asymptotes, holes). */
  breaks?: number[];
  dashed?: boolean;
}

export interface GraphSpec {
  view: { x: [number, number]; y: [number, number] };
  curves: Curve[];
  points?: { x: number; y: number; label?: string; kind?: 'key' | 'invariant' | 'open' }[];
  vlines?: { x: number; dashed?: boolean }[];
  hlines?: { y: number; dashed?: boolean }[];
  /** Grid spacing and labels. Default: lines every 1, labels every 2. xUnit 'deg' adds °, 'pi' labels multiples of π. */
  ticks?: { x: number; xLabel: number; y?: number; yLabel?: number; xUnit?: 'deg' | 'pi' };
}

export interface Step {
  tex: string; // rich text with $math$
  why?: string;
}

export interface Item {
  id: string; // `${generatorId}:${tier}:${seed}`
  generatorId: string;
  seed: number;
  tier: Tier;
  nodeId: string;
  outcome: string;
  cognitive: Cognitive;
  stem: string; // rich text with $math$
  graph?: GraphSpec;
  table?: { head: string[]; rows: string[][] }; // cells are rich text
  format: 'mc' | 'input';
  choices?: Choice[];
  fields?: Field[];
  hints: [string, string, string]; // nudge, method, next step
  solution: Step[];
  /** Independent numeric check of the answer, run by the property tests (not by the app). */
  verify?: () => boolean;
}

/** What a generator returns before the framework adds ids and shuffles choices. */
export type Draft = Omit<Item, 'id' | 'generatorId' | 'seed' | 'tier' | 'nodeId' | 'outcome'>;

export interface Generator {
  id: string;
  nodeId: string;
  title: string;
  make: (rng: import('./rng').Rng, tier: Tier) => Draft;
}

/** Thrown by a generator when random parameters produce an unusable item; the framework retries. */
export class Reject extends Error {
  constructor(why = 'reject') {
    super(why);
  }
}
