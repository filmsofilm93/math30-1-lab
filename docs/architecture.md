# Math 30-1 Lab: architecture (M0)

Static PWA, no backend. All state lives on the device in IndexedDB, with JSON export/import.

## Stack decisions

| Concern | Choice | Why |
|---|---|---|
| App | Vite + React + TypeScript + Tailwind | As specified. |
| Rendering | KaTeX | As specified. Lesson text uses `$…$` inline math rendered by a tiny in-house renderer, so no Markdown/MDX dependency. |
| Math input | MathLive | As specified; virtual keyboard works on phones. |
| Evaluation | **CortexJS Compute Engine** (not mathjs) | MathLive emits LaTeX; Compute Engine parses that LaTeX directly into MathJSON and compiles it to a JS function. mathjs cannot parse LaTeX, so it would need a fragile LaTeX → ASCII bridge. One library, same vendor as MathLive. |
| Graphs | **Mafs** (not JSXGraph) | Declarative React components, so sliders and graphs share React state with no imperative sync layer. Movable points are touch- and keyboard-accessible out of the box. Smaller bundle. Its gaps (no intersection solver, no automatic asymptote detection) don't matter here: generators already know the exact asymptotes, holes and intersections, so the app draws them explicitly and splits plots at known discontinuities. That also makes holes and asymptotes look exactly right instead of sampled. |
| Persistence | Dexie (IndexedDB) | As specified. |
| Spaced review | **FSRS** (see below) | |

## Spaced review: FSRS over SM-2

- The scheduled unit is a **skill node**, not an item. Items are freshly generated each time, so the card is "can you do RF8.condense", and every review uses a new seed.
- FSRS models retrievability R(t) explicitly. That lets the app (a) target 90% retention, (b) predict how much of each skill survives until 20 Jan 2027 for the readiness estimate, and (c) compress intervals as the exam approaches (cap intervals at the days remaining). SM-2 has no memory model to do (b) or (c).
- Confidence maps to FSRS grades: wrong → Again; correct + guess → Hard with interval halved; correct + unsure → Hard; correct + sure → Good; correct + sure + fast → Easy.
- Implementation: the `ts-fsrs` library (needs your OK) or ~120 lines of in-house FSRS with default parameters. SM-2 stays as a fallback if you prefer zero extra code.

## Code layout

```
src/
  content/          curriculum.json, lessons/<nodeId>.ts (typed data: explain text, worked examples, faded steps)
  engine/
    rng.ts          seeded PRNG (mulberry32), pick/shuffle helpers
    generators/     <unit>/<nodeId>.ts, registry.ts
    check/          expr equivalence, solution sets, intervals, general solutions, NR rules
    mastery.ts      mastery rule, prerequisite routing
    srs.ts          FSRS wrapper
    planner.ts      countdown planner, daily session builder
  db/               Dexie schema, export/import
  ui/
    explorers/      transformation-lab, function-ops-lab, polynomial-lab, ... (one folder each)
    learn/          Explore → Explain → Faded → Practice → Mastery loop components
    exam/           mock diploma, formula sheet, WR, directing words, TI-84 drills
    dashboard/
tests/              property tests per generator, checker unit tests
```

## Generator contract

```ts
type Item = {
  id: string;               // `${generatorId}:${seed}`
  nodeId: string; outcome: string;
  cognitive: 'conceptual' | 'problemSolving' | 'procedural';
  difficulty: 1 | 2 | 3;
  format: 'mc' | 'nr' | 'expr' | 'set' | 'interval' | 'wr';
  stem: string;             // KaTeX-ready
  answer: Answer;           // typed per format, exact
  distractors?: { value: Answer; misconception: string }[];   // ids from curriculum.json
  hints: [nudge: string, method: string, nextStep: string];
  solution: { step: string; why: string }[];
  checkSpec?: { domain?: Interval[]; exactOnly?: boolean; round?: 'tenth' | 'hundredth' | 'whole' };
};
type Generator = { id: string; nodeId: string; tiers: (1|2|3)[]; make(seed: number, tier: 1|2|3): Item };
```

Pure functions: same seed, same item. Parameters are chosen backwards from clean answers (pick the roots, then build the polynomial). At least 3 generators per node.

## Answer checking

- **Expressions:** compile both to functions, sample 12 random points in the item's domain (skipping non-permissible values), compare with relative tolerance 1e-9. If the item is exact-only, reject any input containing a decimal literal.
- **Solution sets:** parse `x = a, b`, `{a, b}`, or "no solution"; compare as sets after exact-numeric evaluation.
- **General solutions** (`θ = π/6 + 2πn, n ∈ I`): expand both for n ∈ [−3, 3], compare sets modulo the common period.
- **Intervals / set-builder:** small hand-written parser for `(−∞, 2) ∪ (2, ∞)` and `{x | x ≠ 2, x ∈ R}`; compare as normalized interval unions.
- **NR:** official recording rules as a separate function (rounding place, leading 0, any-order digit codes).

## Data model (Dexie)

| Table | Key fields |
|---|---|
| `attempts` | nodeId, itemId (seed), at, correct, assisted (hints/faded), confidence, misconception?, ms, mode |
| `nodeState` | nodeId, status (locked/learning/mastered), fsrs card, lastFailures |
| `sessions` | date, minutes, plan, completed |
| `settings` | examDate, weeklyHours, days, unitOrder, apiKey (local only) |
| `reports` | itemId, nodeId, note, at (from "report a problem") |
| `wr` | itemId, text/photo blob, selfScore, aiScore? |

Error log and weak-spots drill are queries over `attempts` grouped by misconception.

**Mastery:** at least 80% on the last 10 unassisted attempts, spanning 2+ calendar days. **Routing:** 2 consecutive failures → find the lowest-mastery prerequisite (walking the graph) and offer its repair lesson.

## Planner (sketch)

Days available until exam − 21 (final review block, ≥ 3 mocks) = learning window. Hours per unit ∝ estimatedExamShare × (1 + diagnostic weakness). If the sum exceeds available hours, say so and show which units would be compressed. Daily builder fills a 15/25/45/60-minute budget in this order: retrieval warm-up (3–5 items), due reviews, new learning, interleaved practice.

## Testing

Vitest + fast-check. Every generator runs 500 seeds per tier: answer satisfies the source equation, extraneous roots excluded, no distractor equals the answer, no duplicate options, all misconception ids exist. Checker tests cover tricky equivalences (e.g. `2log x` vs `log x²` with domain). Tests run in CI on every push and locally on save.

## Dependencies needing your approval (beyond the listed stack)

1. `vitest` + `fast-check`: test runner and property-based testing. Needed for the correctness requirement.
2. `vite-plugin-pwa`: service worker / offline caching.
3. `dexie-react-hooks`: live queries from Dexie into React (same project as Dexie).
4. `ts-fsrs`: FSRS scheduler (optional; I can write it in-house instead).

No router, state library, or Markdown/MDX library: hash-based routing and React context are enough.
