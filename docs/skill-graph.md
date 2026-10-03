# Skill graph outline

122 skill nodes across 6 units, a prerequisite layer and an exam-skills layer. Full data (scope limits, misconceptions) is in `curriculum.json`.

Legend: ⚠ = weak spot named in Alberta's exam commentary · ★ = Standard of Excellence (needed for 85%+) · emphasis 1–3 = how often it shows up (my estimate) · arrows list prerequisites; cross-unit ones are in *italics*.

## Prerequisite layer (Math 10C / 20-1)

- **P.exp-laws**  Exponent laws (integer and rational exponents) · e3
- **P.radicals**  Simplify and operate on radicals; rationalize denominators · e2  
  ← P.exp-laws
- **P.factor-basic**  Factoring: GCF, difference of squares, grouping · e3
- **P.factor-trinomial**  Factoring trinomials ax² + bx + c (and quadratic form) · e3  
  ← P.factor-basic
- **P.quad-solve**  Solving quadratics: factoring, formula, discriminant · e3  
  ← P.factor-trinomial, P.radicals
- **P.quad-vertex**  Quadratic functions in vertex form; completing the square · e2  
  ← P.quad-solve
- **P.func-notation**  Function notation; evaluating from equations, tables, graphs · e3
- **P.domain-range**  Domain and range in interval and set-builder notation · e3  
  ← P.func-notation
- **P.linear**  Linear functions: slope, forms of a line · e1  
  ← P.func-notation
- **P.abs**  Absolute value and y = |f(x)| · e1  
  ← P.linear, P.domain-range
- **P.rat-expr**  Rational expressions: simplify, operate, non-permissible values · e3  
  ← P.factor-trinomial
- **P.rat-eq**  Rational equations with restrictions; extraneous roots · e2  
  ← P.rat-expr, P.quad-solve
- **P.rad-eq**  Radical equations; extraneous roots · e2  
  ← P.radicals, P.quad-solve
- **P.systems**  Solving systems graphically (intersection points) · e1  
  ← P.linear, P.quad-vertex
- **P.ref-angle**  Angles in standard position (degrees), reference angles, ratios of any angle · e2
- **P.sine-cos-law**  Sine and cosine laws · e1  
  ← P.ref-angle

## Transformations and function operations (≈19% of exam, estimate)

- **RF2.translate**  Translations y − k = f(x − h); effect on points, domain, range · e3  
  ← *P.func-notation*, *P.domain-range*
- **RF3.stretch-v**  Vertical stretch by |a| (and reflection in x-axis) · e3  
  ← RF2.translate
- **RF3.stretch-h** ⚠ Horizontal stretch by 1/|b| (and reflection in y-axis) · e3  
  ← RF3.stretch-v
- **RF5.reflect-axes**  Reflections in the x-axis and y-axis · e3  
  ← RF3.stretch-h
- **RF3.invariant** ⚠ Invariant points under stretches and reflections · e3  
  ← RF5.reflect-axes
- **RF4.combined** ⚠ Combined transformations y = af(b(x − h)) + k and mapping (x, y) → (x/b + h, ay + k) · e3  
  ← RF3.invariant, RF2.translate
- **RF4.factor-b** ⚠★ Transformations where b must be factored out: y = f(bx − c) · e2  
  ← RF4.combined, *P.factor-basic*
- **RF4.equation-from-graph**  Write the transformed equation from a graph or description · e3  
  ← RF4.combined
- **RF4.domain-range-image**  Domain, range, intercepts and key points of a transformed function · e2  
  ← RF4.combined
- **RF5.reflect-yx**  Reflection in y = x (x = f(y)) graphically · e2  
  ← RF5.reflect-axes, *P.domain-range*
- **RF6.inverse-alg**  Find the inverse algebraically (linear, quadratic, exponential, logarithmic) · e3  
  ← RF5.reflect-yx, *P.quad-vertex*
- **RF6.restrict**  Restrict the domain so the inverse is a function · e2  
  ← RF6.inverse-alg
- **RF6.params** ★ Find unknown parameters from a point on the inverse · e1  
  ← RF6.inverse-alg
- **RF1.ops-eval**  Evaluate f+g, f−g, f·g, f/g at a point (equations, tables, graphs) · e2  
  ← *P.func-notation*
- **RF1.ops-equation**  Equations of f+g, f−g, f·g, f/g with domains · e3  
  ← RF1.ops-eval, *P.rat-expr*, *P.domain-range*
- **RF1.ops-graph**  Sketch sums, differences and products from graphs · e2  
  ← RF1.ops-eval
- **RF1.compose-eval**  Evaluate compositions f(g(a)) from equations and graphs · e3  
  ← RF1.ops-eval
- **RF1.compose-equation**  Equation and domain of a composition f(g(x)) · e3  
  ← RF1.compose-eval, RF1.ops-equation
- **RF1.decompose** ★ Write a function as a combination/composition (incl. three functions or two compositions) · e1  
  ← RF1.compose-equation

## Polynomial functions (≈9% of exam, estimate)

- **RF11.long-division**  Polynomial long division · e1  
  ← *P.factor-basic*
- **RF11.synthetic**  Synthetic division · e2  
  ← RF11.long-division
- **RF11.remainder-thm**  Remainder theorem (incl. finding an unknown coefficient) · e3  
  ← RF11.synthetic, *P.func-notation*
- **RF11.factor-thm**  Factor theorem: is (x − a) a factor? · e3  
  ← RF11.remainder-thm
- **RF11.integral-zero**  Integral zero theorem: candidate zeros · e2  
  ← RF11.factor-thm
- **RF11.factor-full**  Factor polynomials of degree 3–5 completely · e3  
  ← RF11.integral-zero, *P.factor-trinomial*
- **RF12.characteristics**  Degree, leading coefficient, end behaviour, y-intercept · e3  
  ← *P.func-notation*
- **RF12.zeros-multiplicity**  Zeros, roots, x-intercepts, factors; multiplicity behaviour · e3  
  ← RF12.characteristics, RF11.factor-thm
- **RF12.sketch**  Sketch and analyze from factored form · e3  
  ← RF12.zeros-multiplicity, RF11.factor-full
- **RF12.equation-from-graph** ★ Equation in factored form from a graph or characteristics · e2  
  ← RF12.sketch
- **RF12.analyze-calc**  Absolute max/min, domain and range with the graphing calculator · e2  
  ← RF12.sketch, *CALC.max-min*
- **RF12.model**  Polynomial models (volume, area, number contexts) · e2  
  ← RF12.analyze-calc

## Exponential and logarithmic functions (≈16% of exam, estimate)

- **RF9.exp-graph**  Graph and characteristics of y = b^x (growth vs decay) · e2  
  ← *P.exp-laws*, *P.domain-range*
- **RF9.exp-transform**  Transformations of y = a·b^(x − c) + d · e2  
  ← RF9.exp-graph, *RF4.combined*
- **RF7.log-def**  Logarithm as the inverse of an exponential; convert between forms · e3  
  ← RF9.exp-graph, *RF5.reflect-yx*
- **RF7.log-eval**  Exact values of logarithms without technology; estimate with benchmarks · e3  
  ← RF7.log-def, *P.exp-laws*
- **RF9.log-graph**  Graph y = a·log_b(x − c) + d; relationship to the exponential · e2  
  ← RF7.log-def, RF9.exp-transform
- **RF8.expand**  Expand logarithms with product, quotient, power laws · e3  
  ← RF7.log-eval
- **RF8.condense** ⚠ Combine several logs into a single logarithm · e3  
  ← RF8.expand
- **RF8.change-base**  Change of base · e2  
  ← RF7.log-eval
- **RF10.exp-common-base**  Solve exponential equations with a common base · e3  
  ← *P.exp-laws*, *P.quad-solve*
- **RF10.exp-logs**  Solve exponential equations by taking logs (incl. binomial exponents, coefficients) · e3  
  ← RF10.exp-common-base, RF8.expand
- **RF10.log-eq** ⚠ Solve logarithmic equations (same base) and reject extraneous roots · e3  
  ← RF8.condense, *P.quad-solve*
- **RF10.growth-decay**  Growth and decay y = a·b^(t/p) (half-life, doubling) · e3  
  ← RF10.exp-logs
- **RF10.compound-interest**  Compound interest as y = a·b^(t/p) · e2  
  ← RF10.growth-decay
- **RF10.log-scales**  Logarithmic scales: pH, decibels, earthquake magnitude (comparisons) · e2  
  ← RF10.exp-logs

## Trigonometry (≈30% of exam, estimate)

- **T1.radians**  Radian measure θ = a/r; convert degrees ↔ radians · e3  
  ← *P.ref-angle*
- **T1.coterminal**  Coterminal angles and general form θ ± 360°n, θ ± 2πn, n ∈ I · e2  
  ← T1.radians
- **T1.reference**  Reference angles in degrees and radians · e2  
  ← T1.radians
- **T1.arc-length**  Arc length a = rθ (multi-step problems) · e2  
  ← T1.radians
- **T2.unit-circle-eq**  Unit circle x² + y² = 1: missing coordinates, P(θ) = (cos θ, sin θ) · e2  
  ← T1.reference, *P.radicals*
- **T2.special-points**  Exact coordinates at multiples of π/6 and π/4 · e3  
  ← T2.unit-circle-eq
- **T3.exact-ratios**  Exact values of all six ratios at special angles · e3  
  ← T2.special-points
- **T3.ratio-from-point**  Ratios from a point on the terminal arm or from one ratio + quadrant · e2  
  ← T3.exact-ratios, *P.radicals*
- **T3.angle-from-ratio**  Angles from a ratio (exact and approximate), CAST · e3  
  ← T3.exact-ratios
- **T4.basic-graphs**  Graphs of sin, cos, tan: period, intercepts, tan asymptotes, domain, range · e2  
  ← T2.special-points
- **T4.parameters**  Amplitude, period 2π/|b|, phase shift, midline, max/min from y = a sin[b(x − c)] + d · e3  
  ← T4.basic-graphs, *RF4.combined*
- **T4.factor-b** ★ Parameters when b must be factored: sin(bx − c) · e2  
  ← T4.parameters, *RF4.factor-b*
- **T4.sketch**  Sketch sinusoids with scaled axes and key features · e2  
  ← T4.parameters
- **T4.equation-from-graph**  Determine all four parameters from a graph or data · e3  
  ← T4.parameters
- **T4.model**  Sinusoidal models (Ferris wheel, tides, daylight) · e3  
  ← T4.equation-from-graph, *CALC.intersect-zero*
- **T5.first-degree**  First-degree trig equations over a domain (degrees and radians) · e3  
  ← T3.angle-from-ratio
- **T5.general**  General solutions with n ∈ I · e2  
  ← T5.first-degree, T1.coterminal
- **T5.second-degree**  Second-degree equations by factoring · e3  
  ← T5.first-degree, *P.factor-trinomial*
- **T5.graphical**  Solve trig equations graphically on the calculator · e2  
  ← T5.first-degree, *CALC.intersect-zero*, *CALC.mode*
- **T6.identity-vs-equation**  Identity vs equation; verify (numeric/graphical) vs prove · e2  
  ← T3.exact-ratios
- **T6.npv**  Non-permissible values of trig expressions · e3  
  ← T6.identity-vs-equation, T4.basic-graphs
- **T6.simplify**  Simplify with reciprocal, quotient, Pythagorean identities · e3  
  ← T6.identity-vs-equation, *P.rat-expr*
- **T6.prove-basic**  Prove simple identities · e3  
  ← T6.simplify
- **T6.exact-sum-double**  Exact values with sum/difference and double-angle identities · e2  
  ← T6.simplify, T3.ratio-from-point
- **T6.prove-advanced** ⚠★ Prove identities with double angles, conjugates, rational operations · e3  
  ← T6.prove-basic, T6.exact-sum-double
- **T5.identity-sub** ⚠★ Equations needing an identity substitution (double-angle, Pythagorean, sum/difference) · e3  
  ← T5.second-degree, T6.simplify, T6.exact-sum-double

## Radical and rational functions (≈10% of exam, estimate)

- **RF13.sqrt-transform**  Transformations of y = √x; equation from graph · e2  
  ← *RF4.combined*
- **RF13.sqrt-of-f**  y = √f(x) from y = f(x): domain, range, invariant points at y = 0 and y = 1 · e3  
  ← RF13.sqrt-transform, *P.quad-vertex*
- **RF13.solve**  Solve radical equations graphically and algebraically; zeros vs x-intercepts · e2  
  ← RF13.sqrt-of-f, *P.rad-eq*, *CALC.intersect-zero*
- **RF14.va-vs-hole**  Vertical asymptotes vs points of discontinuity · e3  
  ← *P.rat-expr*
- **RF14.ha-intercepts**  Horizontal asymptote and intercepts · e3  
  ← RF14.va-vs-hole
- **RF14.domain-range** ⚠ Domain and range, including a point of discontinuity · e3  
  ← RF14.ha-intercepts, *P.domain-range*
- **RF14.hole-y** ★ y-coordinate of a point of discontinuity · e2  
  ← RF14.va-vs-hole
- **RF14.sketch**  Sketch and analyze rational functions · e2  
  ← RF14.domain-range, RF14.hole-y
- **RF14.equation-from-graph** ★ Equation from graph/characteristics (incl. a hole) · e1  
  ← RF14.sketch
- **RF14.solve**  Solve rational equations graphically and algebraically · e2  
  ← RF14.ha-intercepts, *P.rat-eq*, *CALC.intersect-zero*

## Permutations, combinations, and binomial theorem (≈16% of exam, estimate)

- **PCBT1.fcp**  Fundamental counting principle; slot diagrams; 'and' vs 'or' · e3
- **PCBT1.factorial**  Factorial notation and simplification · e2  
  ← PCBT1.fcp
- **PCBT2.npr**  Permutations nPr · e3  
  ← PCBT1.factorial
- **PCBT2.constraints**  Constraints: together, apart, ends, fixed positions · e3  
  ← PCBT2.npr
- **PCBT2.repeated**  Identical elements and single 2-D pathways · e3  
  ← PCBT2.npr
- **PCBT2.cases** ⚠★ Three or more constraints or multiple cases · e3  
  ← PCBT2.constraints, PCBT2.repeated
- **PCBT2.solve-n**  Solve for n in nPr equations · e2  
  ← PCBT1.factorial, *P.quad-solve*
- **PCBT3.ncr**  Combinations nCr (both nCr and (n r) notation) · e3  
  ← PCBT2.npr
- **PCBT3.at-least**  'At least' / 'at most' problems · e3  
  ← PCBT3.ncr
- **PCBT3.mixed** ★ Problems mixing permutations and combinations · e2  
  ← PCBT3.at-least, PCBT2.constraints
- **PCBT3.solve-n**  Solve for n in nCr equations · e1  
  ← PCBT3.ncr, PCBT2.solve-n
- **PCBT4.pascal**  Pascal's triangle and patterns in expansions · e2  
  ← PCBT3.ncr
- **PCBT4.expand**  Expand (x + y)^n · e2  
  ← PCBT4.pascal, *P.exp-laws*
- **PCBT4.general-term**  Specific term with t(k+1) = nCk·x^(n−k)·y^k · e3  
  ← PCBT4.expand
- **PCBT4.nonlinear-term** ⚠ Specific/constant terms with non-linear terms, e.g. (2x² − 1/x)^n · e3  
  ← PCBT4.general-term
- **PCBT4.find-unknown** ★ Find x, y or n given a term · e1  
  ← PCBT4.nonlinear-term

## Exam skills (calculator, NR, written response)

- **CALC.mode-window**  TI-84 Plus: angle mode check and window [xmin, xmax, xscl] × [ymin, ymax, yscl] · e3
- **CALC.mode**  TI-84 Plus: radian vs degree mode before every trig question · e3  
  ← CALC.mode-window
- **CALC.intersect-zero**  TI-84 Plus: 2nd CALC intersect and zero · e3  
  ← CALC.mode-window
- **CALC.max-min**  TI-84 Plus: 2nd CALC maximum and minimum · e2  
  ← CALC.intersect-zero
- **CALC.table**  TI-84 Plus: table setup · e1  
  ← CALC.mode-window
- **EXAM.nr-recording**  Numerical-response recording rules (rounding, leading zero, digit codes) · e3
- **EXAM.directing-words**  Directing words (determine, explain, justify, prove, sketch, verify…) · e3
- **EXAM.wr-hygiene** ⚠ Written-response hygiene: equations vs expressions, units, brackets, angle arguments · e3  
  ← EXAM.directing-words
- **EXAM.sketch-standard** ⚠ Sketches with scaled axes and all key features · e3  
  ← EXAM.wr-hygiene
