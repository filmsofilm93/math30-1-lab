"""Builds curriculum.json for Math 30-1 Lab. Run: python3 build.py OUTDIR"""
import json, sys, os

OUT = sys.argv[1]

# ---------------------------------------------------------------- misconceptions
M = {
 # prerequisite layer
 "exp-add-bases": "Multiplies powers by multiplying exponents or adds bases (a^m·a^n = a^(mn)).",
 "exp-neg-sign": "Treats a negative exponent as a negative number (a^-n = -a^n).",
 "exp-rational-root": "Swaps numerator and denominator of a rational exponent (a^(m/n) read as m-th root of a^n).",
 "rad-add-radicands": "Adds radicands: √a + √b = √(a+b).",
 "rad-conjugate-sign": "Multiplies by the wrong conjugate or forgets to multiply the numerator.",
 "fac-incomplete": "Stops factoring early (common factor left, or a difference of squares left unfactored).",
 "fac-sum-squares": "Factors a sum of squares as (a+b)(a−b) or (a+b)².",
 "fac-sign-error": "Sign error in binomial factors of a trinomial.",
 "quad-formula-sign": "Uses −b incorrectly or divides only part of the numerator by 2a.",
 "quad-vertex-sign-h": "Reads the vertex of y = a(x − h)² + k as (−h, k).",
 "npv-after-simplify": "Finds non-permissible values only after cancelling, losing restrictions.",
 "cancel-terms": "Cancels terms rather than factors ((x+3)/3 = x).",
 "extraneous-keep": "Keeps a root that fails the original equation (or a non-permissible value).",
 "extraneous-reject-valid": "Rejects a valid root, often a negative one, as extraneous.",
 "square-binomial": "Squares a binomial as a² + b² (forgets the middle term).",
 "fn-notation-mult": "Reads f(x) as f times x, or f(a+b) as f(a)+f(b).",
 "dr-bracket-type": "Uses a square bracket at an excluded endpoint or at infinity, or swaps set/interval notation.",
 "dr-swap": "Swaps domain and range.",
 "abs-negate-all": "Reflects the whole graph instead of only the part below the x-axis.",
 "ref-angle-measure-y": "Measures the reference angle from the y-axis.",

 # transformations
 "tr-h-sign": "Moves the graph in the wrong horizontal direction (sign of h).",
 "tr-k-sign": "Moves the graph in the wrong vertical direction.",
 "tr-b-not-reciprocal": "Horizontal stretch by b instead of 1/b (mapping x → bx).",
 "tr-a-horizontal": "Applies a to x-coordinates or b to y-coordinates.",
 "tr-order-translate-first": "Translates before stretching/reflecting when mapping points (x/b + h computed as (x+h)/b).",
 "tr-b-not-factored": "Reads h from f(bx − c) as c instead of c/b.",
 "tr-reflect-axis-swap": "Confuses reflection in the x-axis (y → −y) with the y-axis (x → −x).",
 "tr-invariant-only-reflection": "Believes invariant points only exist for reflections, or misses those on the line of stretch.",
 "tr-invariant-wrong-axis": "Looks for invariant points on the wrong axis (y-intercepts for a vertical stretch).",
 "tr-mapping-notation-form": "Writes mapping notation with the wrong form or order.",
 "inv-reciprocal": "Treats f⁻¹(x) as 1/f(x).",
 "inv-not-function-ok": "Writes y = f⁻¹(x) for an inverse that is not a function.",
 "inv-restrict-wrong": "Restricts the domain on the wrong side of the vertex, or restricts the range instead.",
 "inv-swap-incomplete": "Swaps x and y but solves incorrectly (e.g. takes only the positive root without restriction).",
 "inv-yx-combined": "Combines a reflection in y = x with other transformations in the wrong order.",
 "ops-compose-order": "Computes g(f(x)) instead of f(g(x)).",
 "ops-compose-multiply": "Multiplies f(x)·g(x) instead of composing.",
 "ops-domain-intersection": "Uses only one function's domain for f+g, f·g, etc.",
 "ops-quotient-zero": "Forgets to exclude zeros of the divisor from the domain of a quotient.",
 "ops-compose-domain": "Finds the domain of f(g(x)) from the simplified formula only, ignoring the domain of g.",
 "ops-graph-add-x": "Adds x-coordinates instead of y-coordinates when combining graphs.",
 "ops-product-vs-sum": "Combines the outputs with the wrong operation (adds instead of multiplies, or the reverse).",
 "ops-quotient-order": "Divides or subtracts in the wrong order (g/f instead of f/g, g − f instead of f − g).",

 # polynomials
 "poly-synthetic-sign": "Uses +a instead of −a (or vice versa) as the synthetic divisor.",
 "poly-missing-term": "Omits a zero placeholder for a missing power.",
 "poly-remainder-sign": "Evaluates P(−a) for division by (x − a).",
 "poly-izt-leading": "Tests factors of the leading coefficient instead of the constant term.",
 "poly-mult-behaviour": "Mixes up crossing vs touching: thinks even multiplicity crosses.",
 "poly-end-behaviour": "Determines end behaviour from the constant term or first factor, not from the degree and leading coefficient.",
 "poly-yint": "Takes the y-intercept as the product of zeros without the leading coefficient or signs.",
 "poly-zero-sign": "Writes the factor of zero x = a as (x + a).",
 "poly-max-local": "Reports a local maximum as the absolute maximum.",
 "poly-degree-count": "Counts the number of factors rather than summing multiplicities to get the degree.",

 # exp/log
 "log-product-sum": "Writes log(A + B) = log A + log B.",
 "log-quotient-divide": "Writes log A / log B = log(A/B) or log(A − B).",
 "log-power-wrong-place": "Applies the power law to a coefficient or to part of the argument ((log x)² = 2 log x).",
 "log-condense-coefficient": "Condenses before moving coefficients into exponents.",
 "log-def-swap": "Converts log_b(x) = y to x^y = b or y^b = x.",
 "log-negative-arg": "Accepts log of a negative number or zero.",
 "log-change-base-flip": "Inverts the change-of-base ratio.",
 "exp-asymptote": "Puts the horizontal asymptote at y = 0 after a vertical translation, or the vertical asymptote of a log at x = 0 after a horizontal translation.",
 "exp-base-range": "Believes b < 1 gives growth.",
 "exp-common-base-coeff": "Multiplies the coefficient into the base (2·3^x = 6^x).",
 "exp-take-log-exponent": "Forgets to bring the whole exponent (binomial) down in brackets.",
 "growth-p-period": "Swaps t and p, or uses the rate instead of the factor b (1.05 vs 0.05).",
 "interest-compound-period": "Uses an annual rate without dividing by the number of compounding periods.",
 "logscale-difference-ratio": "Subtracts intensities instead of finding a ratio (or vice versa) on log scales.",

 # trig
 "trig-deg-rad-mode": "Uses degree values in a radian context (or calculator in wrong mode).",
 "trig-rad-convert-inverse": "Multiplies by 180/π when converting degrees to radians.",
 "trig-coterminal-180": "Adds 180° instead of 360° for coterminal angles.",
 "trig-general-period": "Writes a general solution with the wrong period (2πn for a tangent, or πn where 2πn needed).",
 "trig-arc-degrees": "Uses degrees in a = rθ.",
 "trig-unit-xy-swap": "Swaps cos and sin coordinates (P(θ) = (sin θ, cos θ)).",
 "trig-cast-sign": "Wrong sign from CAST for the quadrant.",
 "trig-ref-angle-value": "Gives the reference angle instead of the angle in the required quadrant.",
 "trig-reciprocal-inverse": "Treats csc θ as sin⁻¹θ.",
 "trig-special-value": "Mixes up √3/2 and 1/2 for π/6 and π/3.",
 "trig-period-b": "Uses period = b or b/2π instead of 2π/|b|.",
 "trig-phase-not-factored": "Reads phase shift from sin(bx − c) as c rather than c/b.",
 "trig-amplitude-range": "Takes amplitude as max − min (not half).",
 "trig-midline-avg": "Uses the max (or the average of non-extrema) as the midline.",
 "trig-tan-asymptote": "Places tan asymptotes at multiples of π instead of π/2 + πn.",
 "trig-missing-solutions": "Finds one solution only and misses the second quadrant solution.",
 "trig-domain-ignore": "Lists solutions outside the given domain or misses them at the boundary.",
 "trig-divide-by-trig": "Divides both sides by a trig factor, losing solutions.",
 "trig-sin2-sin-squared": "Confuses sin 2x with 2 sin x or sin²x.",
 "trig-identity-sub-wrong": "Picks the wrong cos 2x form, leaving mixed functions.",
 "trig-prove-cross-sides": "Moves terms across the equal sign while proving (treats an identity as an equation).",
 "trig-verify-is-proof": "Thinks checking one value proves an identity.",
 "trig-npv-miss": "Misses non-permissible values from a denominator or from tan/sec/csc/cot.",
 "trig-sum-distribute": "Writes sin(A + B) = sin A + sin B.",
 "trig-conjugate-misuse": "Multiplies only the denominator by the conjugate.",
 "trig-pyth-sign": "Writes 1 − tan²θ = sec²θ or similar sign errors.",
 "trig-argument-missing": "Writes 'sin' without its argument.",

 # radical / rational
 "rad-invariant-wrong": "Uses invariant points other than y = 0 and y = 1 for y = √f(x).",
 "rad-sqrt-domain": "Keeps the regions where f(x) < 0 in the domain of √f(x).",
 "rad-sqrt-values": "Believes √f(x) < f(x) everywhere (forgets 0 < f(x) < 1).",
 "rat-hole-as-va": "Draws a vertical asymptote where a factor cancels (point of discontinuity).",
 "rat-va-as-hole": "Calls a non-cancelling zero of the denominator a hole.",
 "rat-ha-degree": "Finds the horizontal asymptote from constant terms instead of leading coefficients/degree.",
 "rat-range-hole": "Forgets to exclude the y-value of the hole from the range.",
 "rat-domain-hole": "Forgets to exclude the x-value of the hole from the domain.",
 "rat-xint-from-denominator": "Reads x-intercepts from the denominator.",
 "rat-xint-at-hole": "Lists the cancelled factor's zero as an x-intercept.",

 # PCBT
 "fcp-add-multiply": "Adds where 'and' requires multiplication, or multiplies 'or' cases.",
 "fcp-constraint-last": "Fills the constrained slot last instead of first.",
 "fact-simplify": "Simplifies n!/(n−2)! as n or n/2 or similar.",
 "perm-vs-comb": "Uses permutations when order does not matter (or vice versa).",
 "perm-together-internal": "Forgets to multiply by internal arrangements of a block.",
 "perm-apart-subtract": "Computes 'apart' directly with errors instead of total − together.",
 "perm-repeat-divide": "Forgets to divide by factorials of identical items.",
 "perm-case-overlap": "Double-counts overlapping cases.",
 "perm-solve-n-negative": "Keeps a negative or non-integer n, or n < r.",
 "comb-at-least-overcount": "Computes 'at least one' by fixing one item then choosing freely (overcounts).",
 "binom-term-index": "Uses k for the k-th term instead of k − 1 (t_k vs t_(k+1)).",
 "binom-coefficient-power": "Forgets to raise the coefficient (or sign) of a term to its power.",
 "binom-nonlinear-exponent": "Mis-tracks exponents when terms are non-linear (x² or 1/x).",
 "binom-pascal-row": "Uses row n+1 or n−1 of Pascal's triangle.",
 "binom-term-count": "Thinks (x + y)^n has n terms.",
 "binom-sign-alternate": "Drops the alternating sign for (x − y)^n.",

 # exam skills
 "wr-expression-for-equation": "Writes an expression when an equation is required.",
 "wr-units-missing": "Omits units in a final answer.",
 "wr-brackets": "Omits necessary brackets (e.g. −3² vs (−3)², log x + 2 vs log(x + 2)).",
 "wr-sketch-features": "Sketch missing scaled axes or key features (intercepts, asymptotes, endpoints, max/min).",
 "wr-directing-word": "Answers a different directing word (e.g. verifies when asked to prove, decimal when exact asked).",
 "calc-window": "Window omits a key feature, or wrong window format.",
 "calc-mode": "Calculator in the wrong angle mode.",
 "calc-guess-bounds": "Sets left/right bounds that do not bracket the zero/intersection.",
 "nr-rounding": "Rounds intermediate values or rounds to the wrong place.",
}

# ---------------------------------------------------------------- nodes
N = []
def node(id, outcome, title, prereqs, mis, emph=2, std="acceptable", weak=False, scope=None, explorer=None, unit=None):
    N.append(dict(id=id, outcome=outcome, unit=unit or UNIT, title=title, prerequisites=prereqs,
                  standard=std, examEmphasis=emph, weakSpot=weak, scopeLimits=scope or [],
                  misconceptions=mis, explorer=explorer))

# emphasis: 1 = occasional, 2 = regular, 3 = appears on nearly every exam (inferred, see meta)

UNIT = "PRE"
node("P.exp-laws", "M20-1/10C", "Exponent laws (integer and rational exponents)", [], ["exp-add-bases","exp-neg-sign","exp-rational-root"], 3)
node("P.radicals", "M20-1", "Simplify and operate on radicals; rationalize denominators", ["P.exp-laws"], ["rad-add-radicands","rad-conjugate-sign"], 2)
node("P.factor-basic", "M10C", "Factoring: GCF, difference of squares, grouping", [], ["fac-incomplete","fac-sum-squares"], 3)
node("P.factor-trinomial", "M10C/20-1", "Factoring trinomials ax² + bx + c (and quadratic form)", ["P.factor-basic"], ["fac-sign-error","fac-incomplete"], 3)
node("P.quad-solve", "M20-1", "Solving quadratics: factoring, formula, discriminant", ["P.factor-trinomial","P.radicals"], ["quad-formula-sign","fac-sign-error"], 3)
node("P.quad-vertex", "M20-1", "Quadratic functions in vertex form; completing the square", ["P.quad-solve"], ["quad-vertex-sign-h"], 2)
node("P.func-notation", "M10C", "Function notation; evaluating from equations, tables, graphs", [], ["fn-notation-mult"], 3)
node("P.domain-range", "M10C", "Domain and range in interval and set-builder notation", ["P.func-notation"], ["dr-bracket-type","dr-swap"], 3)
node("P.linear", "M10C", "Linear functions: slope, forms of a line", ["P.func-notation"], ["tr-k-sign"], 1)
node("P.abs", "M20-1", "Absolute value and y = |f(x)|", ["P.linear","P.domain-range"], ["abs-negate-all"], 1)
node("P.rat-expr", "M20-1", "Rational expressions: simplify, operate, non-permissible values", ["P.factor-trinomial"], ["npv-after-simplify","cancel-terms"], 3)
node("P.rat-eq", "M20-1", "Rational equations with restrictions; extraneous roots", ["P.rat-expr","P.quad-solve"], ["extraneous-keep","npv-after-simplify"], 2)
node("P.rad-eq", "M20-1", "Radical equations; extraneous roots", ["P.radicals","P.quad-solve"], ["extraneous-keep","square-binomial","extraneous-reject-valid"], 2)
node("P.systems", "M20-1", "Solving systems graphically (intersection points)", ["P.linear","P.quad-vertex"], ["calc-guess-bounds"], 1)
node("P.ref-angle", "M20-1", "Angles in standard position (degrees), reference angles, ratios of any angle", [], ["ref-angle-measure-y","trig-cast-sign"], 2)
node("P.sine-cos-law", "M20-1", "Sine and cosine laws", ["P.ref-angle"], ["trig-deg-rad-mode"], 1,
     scope=["Not directly assessed on the Math 30-1 diploma; kept as an optional review node."])

UNIT = "U1"
TR_SCOPE = ["Stretches/reflections about lines parallel to the axes are beyond scope.",
            "Base functions: x, x², x³, √x, 1/x, |x|, b^x, log x, sin x, cos x."]
node("RF2.translate", "RF2", "Translations y − k = f(x − h); effect on points, domain, range", ["P.func-notation","P.domain-range"], ["tr-h-sign","tr-k-sign"], 3, scope=TR_SCOPE, explorer="transformation-lab")
node("RF3.stretch-v", "RF3", "Vertical stretch by |a| (and reflection in x-axis)", ["RF2.translate"], ["tr-a-horizontal","tr-reflect-axis-swap"], 3, scope=TR_SCOPE, explorer="transformation-lab")
node("RF3.stretch-h", "RF3", "Horizontal stretch by 1/|b| (and reflection in y-axis)", ["RF3.stretch-v"], ["tr-b-not-reciprocal","tr-a-horizontal"], 3, weak=True, scope=TR_SCOPE, explorer="transformation-lab")
node("RF5.reflect-axes", "RF5", "Reflections in the x-axis and y-axis", ["RF3.stretch-h"], ["tr-reflect-axis-swap"], 3, scope=["Reflections about lines parallel to an axis are beyond scope."], explorer="transformation-lab")
node("RF3.invariant", "RF3/RF5", "Invariant points under stretches and reflections", ["RF5.reflect-axes"], ["tr-invariant-only-reflection","tr-invariant-wrong-axis"], 3, weak=True, explorer="transformation-lab")
node("RF4.combined", "RF4", "Combined transformations y = af(b(x − h)) + k and mapping (x, y) → (x/b + h, ay + k)", ["RF3.invariant","RF2.translate"], ["tr-order-translate-first","tr-b-not-reciprocal","tr-h-sign","tr-mapping-notation-form"], 3, weak=True, explorer="transformation-lab")
node("RF4.factor-b", "RF4", "Transformations where b must be factored out: y = f(bx − c)", ["RF4.combined","P.factor-basic"], ["tr-b-not-factored"], 2, std="excellence", weak=True, explorer="transformation-lab")
node("RF4.equation-from-graph", "RF4", "Write the transformed equation from a graph or description", ["RF4.combined"], ["tr-h-sign","tr-b-not-reciprocal"], 3, explorer="transformation-lab")
node("RF4.domain-range-image", "RF4", "Domain, range, intercepts and key points of a transformed function", ["RF4.combined"], ["dr-bracket-type","tr-a-horizontal"], 2)
node("RF5.reflect-yx", "RF5", "Reflection in y = x (x = f(y)) graphically", ["RF5.reflect-axes","P.domain-range"], ["inv-yx-combined","dr-swap"], 2,
     scope=["Reflections in y = x are not combined with any other transformation."], explorer="transformation-lab")
node("RF6.inverse-alg", "RF6", "Find the inverse algebraically (linear, quadratic, exponential, logarithmic)", ["RF5.reflect-yx","P.quad-vertex"], ["inv-reciprocal","inv-swap-incomplete"], 3,
     scope=["Algebraic inverses limited to linear, quadratic, exponential, logarithmic; graphical inverses may include polynomial, piecewise, radical, absolute value.",
            "Use y = f⁻¹(x) only when the inverse is a function; otherwise x = f(y)."], explorer="transformation-lab")
node("RF6.restrict", "RF6", "Restrict the domain so the inverse is a function", ["RF6.inverse-alg"], ["inv-restrict-wrong","inv-not-function-ok"], 2, explorer="transformation-lab")
node("RF6.params", "RF6", "Find unknown parameters from a point on the inverse", ["RF6.inverse-alg"], ["dr-swap","inv-reciprocal"], 1, std="excellence")
OPS_SCOPE = ["Original functions: linear, quadratic, cubic, radical (one linear radicand), rational (monomial/binomial), absolute value (first degree), exponential, logarithmic, piecewise.",
             "Notation: (f∘g)(x) = f(g(x)); (f+g)(x), (f−g)(x), (f·g)(x), (f/g)(x)."]
node("RF1.ops-eval", "RF1", "Evaluate f+g, f−g, f·g, f/g at a point (equations, tables, graphs)", ["P.func-notation"], ["fn-notation-mult","ops-graph-add-x"], 2, scope=OPS_SCOPE, explorer="function-ops-lab")
node("RF1.ops-equation", "RF1", "Equations of f+g, f−g, f·g, f/g with domains", ["RF1.ops-eval","P.rat-expr","P.domain-range"], ["ops-domain-intersection","ops-quotient-zero"], 3, scope=OPS_SCOPE, explorer="function-ops-lab")
node("RF1.ops-graph", "RF1", "Sketch sums, differences and products from graphs", ["RF1.ops-eval"], ["ops-graph-add-x","ops-product-vs-sum","ops-quotient-order"], 2, scope=OPS_SCOPE, explorer="function-ops-lab")
node("RF1.compose-eval", "RF1", "Evaluate compositions f(g(a)) from equations and graphs", ["RF1.ops-eval"], ["ops-compose-order","ops-compose-multiply"], 3, scope=OPS_SCOPE, explorer="function-ops-lab")
node("RF1.compose-equation", "RF1", "Equation and domain of a composition f(g(x))", ["RF1.compose-eval","RF1.ops-equation"], ["ops-compose-order","ops-compose-domain"], 3, scope=OPS_SCOPE, explorer="function-ops-lab")
node("RF1.decompose", "RF1", "Write a function as a combination/composition (incl. three functions or two compositions)", ["RF1.compose-equation"], ["ops-compose-order","ops-compose-multiply","ops-quotient-order","ops-product-vs-sum"], 1, std="excellence", scope=OPS_SCOPE)

UNIT = "U2"
POLY_SCOPE = ["Degree ≤ 5, integral coefficients.",
              "Rational zero theorem is beyond scope: at most two linear factors with leading coefficient ≠ 1."]
node("RF11.long-division", "RF11", "Polynomial long division", ["P.factor-basic"], ["poly-missing-term"], 1, scope=POLY_SCOPE)
node("RF11.synthetic", "RF11", "Synthetic division", ["RF11.long-division"], ["poly-synthetic-sign","poly-missing-term"], 2, scope=POLY_SCOPE, explorer="polynomial-lab")
node("RF11.remainder-thm", "RF11", "Remainder theorem (incl. finding an unknown coefficient)", ["RF11.synthetic","P.func-notation"], ["poly-remainder-sign"], 3, scope=POLY_SCOPE)
node("RF11.factor-thm", "RF11", "Factor theorem: is (x − a) a factor?", ["RF11.remainder-thm"], ["poly-remainder-sign","poly-zero-sign"], 3, scope=POLY_SCOPE)
node("RF11.integral-zero", "RF11", "Integral zero theorem: candidate zeros", ["RF11.factor-thm"], ["poly-izt-leading"], 2, scope=POLY_SCOPE)
node("RF11.factor-full", "RF11", "Factor polynomials of degree 3–5 completely", ["RF11.integral-zero","P.factor-trinomial"], ["fac-incomplete","poly-synthetic-sign"], 3, scope=POLY_SCOPE)
node("RF12.characteristics", "RF12", "Degree, leading coefficient, end behaviour, y-intercept", ["P.func-notation"], ["poly-end-behaviour","poly-yint","poly-degree-count"], 3, scope=["Degree ≤ 5."], explorer="polynomial-lab")
node("RF12.zeros-multiplicity", "RF12", "Zeros, roots, x-intercepts, factors; multiplicity behaviour", ["RF12.characteristics","RF11.factor-thm"], ["poly-mult-behaviour","poly-zero-sign"], 3,
     scope=["Identify when no real roots exist; computing non-real roots is beyond scope."], explorer="polynomial-lab")
node("RF12.sketch", "RF12", "Sketch and analyze from factored form", ["RF12.zeros-multiplicity","RF11.factor-full"], ["poly-mult-behaviour","poly-end-behaviour","poly-yint"], 3, explorer="polynomial-lab")
node("RF12.equation-from-graph", "RF12", "Equation in factored form from a graph or characteristics", ["RF12.sketch"], ["poly-zero-sign","poly-yint","poly-mult-behaviour"], 2, std="excellence", explorer="polynomial-lab")
node("RF12.analyze-calc", "RF12", "Absolute max/min, domain and range with the graphing calculator", ["RF12.sketch","CALC.max-min"], ["poly-max-local","dr-bracket-type"], 2,
     scope=["Maximum/minimum point means absolute maximum/minimum."])
node("RF12.model", "RF12", "Polynomial models (volume, area, number contexts)", ["RF12.analyze-calc"], ["poly-max-local","wr-units-missing"], 2)

UNIT = "U3"
LOG_SCOPE = ["Natural logarithms and base e are beyond scope."]
node("RF9.exp-graph", "RF9", "Graph and characteristics of y = b^x (growth vs decay)", ["P.exp-laws","P.domain-range"], ["exp-base-range","exp-asymptote"], 2, scope=["b > 0, b ≠ 1."], explorer="exp-log-lab")
node("RF9.exp-transform", "RF9", "Transformations of y = a·b^(x − c) + d", ["RF9.exp-graph","RF4.combined"], ["exp-asymptote","tr-h-sign"], 2, explorer="exp-log-lab")
node("RF7.log-def", "RF7", "Logarithm as the inverse of an exponential; convert between forms", ["RF9.exp-graph","RF5.reflect-yx"], ["log-def-swap"], 3, scope=LOG_SCOPE, explorer="exp-log-lab")
node("RF7.log-eval", "RF7", "Exact values of logarithms without technology; estimate with benchmarks", ["RF7.log-def","P.exp-laws"], ["log-def-swap","log-negative-arg"], 3, scope=LOG_SCOPE)
node("RF9.log-graph", "RF9", "Graph y = a·log_b(x − c) + d; relationship to the exponential", ["RF7.log-def","RF9.exp-transform"], ["exp-asymptote","log-negative-arg"], 2, scope=LOG_SCOPE+["b > 1."], explorer="exp-log-lab")
node("RF8.expand", "RF8", "Expand logarithms with product, quotient, power laws", ["RF7.log-eval"], ["log-product-sum","log-quotient-divide","log-power-wrong-place"], 3, explorer="log-law-simplifier")
node("RF8.condense", "RF8", "Combine several logs into a single logarithm", ["RF8.expand"], ["log-condense-coefficient","log-quotient-divide","log-product-sum"], 3, weak=True, explorer="log-law-simplifier")
node("RF8.change-base", "RF8", "Change of base", ["RF7.log-eval"], ["log-change-base-flip"], 2, scope=["Taught as a strategy for evaluating logarithms."])
node("RF10.exp-common-base", "RF10", "Solve exponential equations with a common base", ["P.exp-laws","P.quad-solve"], ["exp-common-base-coeff","exp-rational-root"], 3)
node("RF10.exp-logs", "RF10", "Solve exponential equations by taking logs (incl. binomial exponents, coefficients)", ["RF10.exp-common-base","RF8.expand"], ["exp-take-log-exponent","exp-common-base-coeff"], 3,
     scope=["Acceptable: monomial exponents. Excellence: non-monomial exponents or numerical coefficients."])
node("RF10.log-eq", "RF10", "Solve logarithmic equations (same base) and reject extraneous roots", ["RF8.condense","P.quad-solve"], ["extraneous-keep","log-negative-arg","log-product-sum"], 3, weak=True,
     scope=["Logarithmic equations restricted to the same base.", "Recognizing extraneous solutions is Standard of Excellence."])
node("RF10.growth-decay", "RF10", "Growth and decay y = a·b^(t/p) (half-life, doubling)", ["RF10.exp-logs"], ["growth-p-period"], 3,
     scope=["The formula is given on the formula sheet; other formulas are given in the question."])
node("RF10.compound-interest", "RF10", "Compound interest as y = a·b^(t/p)", ["RF10.growth-decay"], ["interest-compound-period","growth-p-period"], 2,
     scope=["Know compounding terms: annually, semi-annually, quarterly, monthly, weekly, daily."])
node("RF10.log-scales", "RF10", "Logarithmic scales: pH, decibels, earthquake magnitude (comparisons)", ["RF10.exp-logs"], ["logscale-difference-ratio"], 2,
     scope=["Formulas for logarithmic scales are always given."])

UNIT = "U4"
node("T1.radians", "T1", "Radian measure θ = a/r; convert degrees ↔ radians", ["P.ref-angle"], ["trig-rad-convert-inverse"], 3, explorer="unit-circle")
node("T1.coterminal", "T1", "Coterminal angles and general form θ ± 360°n, θ ± 2πn, n ∈ I", ["T1.radians"], ["trig-coterminal-180","trig-domain-ignore"], 2, explorer="unit-circle")
node("T1.reference", "T1", "Reference angles in degrees and radians", ["T1.radians"], ["ref-angle-measure-y"], 2, explorer="unit-circle")
node("T1.arc-length", "T1", "Arc length a = rθ (multi-step problems)", ["T1.radians"], ["trig-arc-degrees","wr-units-missing"], 2, explorer="unit-circle")
node("T2.unit-circle-eq", "T2", "Unit circle x² + y² = 1: missing coordinates, P(θ) = (cos θ, sin θ)", ["T1.reference","P.radicals"], ["trig-unit-xy-swap","trig-cast-sign"], 2, explorer="unit-circle")
node("T2.special-points", "T2", "Exact coordinates at multiples of π/6 and π/4", ["T2.unit-circle-eq"], ["trig-special-value","trig-unit-xy-swap"], 3, explorer="unit-circle")
node("T3.exact-ratios", "T3", "Exact values of all six ratios at special angles", ["T2.special-points"], ["trig-reciprocal-inverse","trig-special-value","trig-cast-sign"], 3, explorer="unit-circle")
node("T3.ratio-from-point", "T3", "Ratios from a point on the terminal arm or from one ratio + quadrant", ["T3.exact-ratios","P.radicals"], ["trig-cast-sign","trig-unit-xy-swap"], 2)
node("T3.angle-from-ratio", "T3", "Angles from a ratio (exact and approximate), CAST", ["T3.exact-ratios"], ["trig-ref-angle-value","trig-missing-solutions","trig-deg-rad-mode"], 3,
     scope=["Domains 0° ≤ θ < 360° or 0 ≤ θ < 2π."])
node("T4.basic-graphs", "T4", "Graphs of sin, cos, tan: period, intercepts, tan asymptotes, domain, range", ["T2.special-points"], ["trig-tan-asymptote"], 2,
     scope=["Transformations of tangent and graphs of reciprocal functions are beyond scope."], explorer="sinusoid-lab")
node("T4.parameters", "T4", "Amplitude, period 2π/|b|, phase shift, midline, max/min from y = a sin[b(x − c)] + d", ["T4.basic-graphs","RF4.combined"], ["trig-period-b","trig-amplitude-range","trig-midline-avg","tr-h-sign"], 3, explorer="sinusoid-lab")
node("T4.factor-b", "T4", "Parameters when b must be factored: sin(bx − c)", ["T4.parameters","RF4.factor-b"], ["trig-phase-not-factored"], 2, std="excellence", explorer="sinusoid-lab")
node("T4.sketch", "T4", "Sketch sinusoids with scaled axes and key features", ["T4.parameters"], ["wr-sketch-features","trig-period-b"], 2, explorer="sinusoid-lab")
node("T4.equation-from-graph", "T4", "Determine all four parameters from a graph or data", ["T4.parameters"], ["trig-amplitude-range","trig-midline-avg","trig-period-b"], 3, explorer="sinusoid-lab")
node("T4.model", "T4", "Sinusoidal models (Ferris wheel, tides, daylight)", ["T4.equation-from-graph","CALC.intersect-zero"], ["trig-midline-avg","trig-deg-rad-mode","wr-units-missing"], 3, explorer="sinusoid-lab")
T5_SCOPE = ["Identity substitutions limited to reciprocal, quotient, Pythagorean, double-angle, sum/difference.",
            "Double-angle equations solved algebraically only by substituting the identity; other multiple-angle equations beyond scope algebraically."]
node("T5.first-degree", "T5", "First-degree trig equations over a domain (degrees and radians)", ["T3.angle-from-ratio"], ["trig-missing-solutions","trig-domain-ignore","trig-deg-rad-mode"], 3, scope=T5_SCOPE, explorer="trig-equation-visualizer")
node("T5.general", "T5", "General solutions with n ∈ I", ["T5.first-degree","T1.coterminal"], ["trig-general-period"], 2, scope=T5_SCOPE, explorer="trig-equation-visualizer")
node("T5.second-degree", "T5", "Second-degree equations by factoring", ["T5.first-degree","P.factor-trinomial"], ["trig-divide-by-trig","trig-missing-solutions"], 3, scope=T5_SCOPE, explorer="trig-equation-visualizer")
node("T5.graphical", "T5", "Solve trig equations graphically on the calculator", ["T5.first-degree","CALC.intersect-zero","CALC.mode"], ["calc-mode","calc-window","trig-domain-ignore"], 2, explorer="trig-equation-visualizer")
node("T6.identity-vs-equation", "T6", "Identity vs equation; verify (numeric/graphical) vs prove", ["T3.exact-ratios"], ["trig-verify-is-proof","wr-directing-word"], 2, explorer="identity-workspace")
node("T6.npv", "T6", "Non-permissible values of trig expressions", ["T6.identity-vs-equation","T4.basic-graphs"], ["trig-npv-miss","trig-general-period"], 3, explorer="identity-workspace")
node("T6.simplify", "T6", "Simplify with reciprocal, quotient, Pythagorean identities", ["T6.identity-vs-equation","P.rat-expr"], ["trig-pyth-sign","trig-reciprocal-inverse","cancel-terms"], 3, explorer="identity-workspace")
node("T6.prove-basic", "T6", "Prove simple identities", ["T6.simplify"], ["trig-prove-cross-sides","trig-pyth-sign"], 3, explorer="identity-workspace")
node("T6.exact-sum-double", "T6", "Exact values with sum/difference and double-angle identities", ["T6.simplify","T3.ratio-from-point"], ["trig-sum-distribute","trig-sin2-sin-squared"], 2,
     scope=["Tangent sum/difference/double-angle exact values are Standard of Excellence."])
node("T6.prove-advanced", "T6", "Prove identities with double angles, conjugates, rational operations", ["T6.prove-basic","T6.exact-sum-double"], ["trig-conjugate-misuse","trig-sin2-sin-squared","trig-prove-cross-sides"], 3, std="excellence", weak=True,
     scope=["Sum/difference and double-angle identities restricted to sine, cosine, tangent."], explorer="identity-workspace")
node("T5.identity-sub", "T5", "Equations needing an identity substitution (double-angle, Pythagorean, sum/difference)", ["T5.second-degree","T6.simplify","T6.exact-sum-double"], ["trig-identity-sub-wrong","trig-divide-by-trig","trig-sin2-sin-squared"], 3, std="excellence", weak=True, scope=T5_SCOPE, explorer="trig-equation-visualizer")

UNIT = "U5"
node("RF13.sqrt-transform", "RF13", "Transformations of y = √x; equation from graph", ["RF4.combined"], ["tr-h-sign","tr-b-not-reciprocal"], 2, scope=["Square roots only; one radical."], explorer="radical-lab")
node("RF13.sqrt-of-f", "RF13", "y = √f(x) from y = f(x): domain, range, invariant points at y = 0 and y = 1", ["RF13.sqrt-transform","P.quad-vertex"], ["rad-invariant-wrong","rad-sqrt-domain","rad-sqrt-values"], 3,
     scope=["f(x) linear, quadratic, or piecewise."], explorer="radical-lab")
node("RF13.solve", "RF13", "Solve radical equations graphically and algebraically; zeros vs x-intercepts", ["RF13.sqrt-of-f","P.rad-eq","CALC.intersect-zero"], ["extraneous-keep","extraneous-reject-valid"], 2, explorer="radical-lab")
RAT_SCOPE = ["Numerators/denominators: monomials, binomials, trinomials of degree ≤ 2.",
             "No oblique asymptotes; y = 1/f(x) transformation not included.",
             "Horizontal asymptotes limited to transformations of y = 1/x and y = 1/x²."]
node("RF14.va-vs-hole", "RF14", "Vertical asymptotes vs points of discontinuity", ["P.rat-expr"], ["rat-hole-as-va","rat-va-as-hole"], 3, scope=RAT_SCOPE, explorer="rational-lab")
node("RF14.ha-intercepts", "RF14", "Horizontal asymptote and intercepts", ["RF14.va-vs-hole"], ["rat-ha-degree","rat-xint-from-denominator","rat-xint-at-hole"], 3, scope=RAT_SCOPE, explorer="rational-lab")
node("RF14.domain-range", "RF14", "Domain and range, including a point of discontinuity", ["RF14.ha-intercepts","P.domain-range"], ["rat-domain-hole","rat-range-hole","dr-bracket-type"], 3, weak=True, scope=RAT_SCOPE, explorer="rational-lab")
node("RF14.hole-y", "RF14", "y-coordinate of a point of discontinuity", ["RF14.va-vs-hole"], ["rat-range-hole","cancel-terms"], 2, std="excellence", scope=RAT_SCOPE, explorer="rational-lab")
node("RF14.sketch", "RF14", "Sketch and analyze rational functions", ["RF14.domain-range","RF14.hole-y"], ["rat-hole-as-va","wr-sketch-features"], 2, scope=RAT_SCOPE, explorer="rational-lab")
node("RF14.equation-from-graph", "RF14", "Equation from graph/characteristics (incl. a hole)", ["RF14.sketch"], ["rat-va-as-hole","rat-ha-degree"], 1, std="excellence", scope=RAT_SCOPE, explorer="rational-lab")
node("RF14.solve", "RF14", "Solve rational equations graphically and algebraically", ["RF14.ha-intercepts","P.rat-eq","CALC.intersect-zero"], ["extraneous-keep","rat-xint-at-hole"], 2, scope=RAT_SCOPE)

UNIT = "U6"
node("PCBT1.fcp", "PCBT1", "Fundamental counting principle; slot diagrams; 'and' vs 'or'", [], ["fcp-add-multiply","fcp-constraint-last"], 3,
     scope=["Tree diagrams and lists are acceptable methods."], explorer="counting-lab")
node("PCBT1.factorial", "PCBT1", "Factorial notation and simplification", ["PCBT1.fcp"], ["fact-simplify"], 2)
node("PCBT2.npr", "PCBT2", "Permutations nPr", ["PCBT1.factorial"], ["perm-vs-comb","fact-simplify"], 3, explorer="counting-lab")
node("PCBT2.constraints", "PCBT2", "Constraints: together, apart, ends, fixed positions", ["PCBT2.npr"], ["perm-together-internal","perm-apart-subtract","fcp-constraint-last"], 3,
     scope=["Circular and ring permutations are beyond scope."], explorer="counting-lab")
node("PCBT2.repeated", "PCBT2", "Identical elements and single 2-D pathways", ["PCBT2.npr"], ["perm-repeat-divide"], 3, explorer="counting-lab")
node("PCBT2.cases", "PCBT2", "Three or more constraints or multiple cases", ["PCBT2.constraints","PCBT2.repeated"], ["perm-case-overlap","fcp-add-multiply","perm-together-internal"], 3, std="excellence", weak=True, explorer="counting-lab")
node("PCBT2.solve-n", "PCBT2", "Solve for n in nPr equations", ["PCBT1.factorial","P.quad-solve"], ["perm-solve-n-negative","fact-simplify"], 2,
     scope=["One occurrence of nPr with r ≤ 3 (Acceptable)."])
node("PCBT3.ncr", "PCBT3", "Combinations nCr (both nCr and (n r) notation)", ["PCBT2.npr"], ["perm-vs-comb"], 3, explorer="counting-lab")
node("PCBT3.at-least", "PCBT3", "'At least' / 'at most' problems", ["PCBT3.ncr"], ["comb-at-least-overcount","perm-case-overlap"], 3)
node("PCBT3.mixed", "PCBT3", "Problems mixing permutations and combinations", ["PCBT3.at-least","PCBT2.constraints"], ["perm-vs-comb","fcp-add-multiply"], 2, std="excellence")
node("PCBT3.solve-n", "PCBT3", "Solve for n in nCr equations", ["PCBT3.ncr","PCBT2.solve-n"], ["perm-solve-n-negative"], 1)
node("PCBT4.pascal", "PCBT4", "Pascal's triangle and patterns in expansions", ["PCBT3.ncr"], ["binom-pascal-row","binom-term-count"], 2, explorer="counting-lab")
node("PCBT4.expand", "PCBT4", "Expand (x + y)^n", ["PCBT4.pascal","P.exp-laws"], ["binom-coefficient-power","binom-sign-alternate"], 2, explorer="counting-lab",
     scope=["Exponents are natural numbers."])
node("PCBT4.general-term", "PCBT4", "Specific term with t(k+1) = nCk·x^(n−k)·y^k", ["PCBT4.expand"], ["binom-term-index","binom-coefficient-power","binom-sign-alternate"], 3, explorer="counting-lab")
node("PCBT4.nonlinear-term", "PCBT4", "Specific/constant terms with non-linear terms, e.g. (2x² − 1/x)^n", ["PCBT4.general-term"], ["binom-nonlinear-exponent","binom-coefficient-power","binom-sign-alternate"], 3, weak=True, explorer="counting-lab")
node("PCBT4.find-unknown", "PCBT4", "Find x, y or n given a term", ["PCBT4.nonlinear-term"], ["binom-term-index"], 1, std="excellence")

UNIT = "EXAM"
node("CALC.mode-window", None, "TI-84 Plus: angle mode check and window [xmin, xmax, xscl] × [ymin, ymax, yscl]", [], ["calc-window","calc-mode"], 3)
node("CALC.mode", None, "TI-84 Plus: radian vs degree mode before every trig question", ["CALC.mode-window"], ["calc-mode","trig-deg-rad-mode"], 3)
node("CALC.intersect-zero", None, "TI-84 Plus: 2nd CALC intersect and zero", ["CALC.mode-window"], ["calc-guess-bounds","calc-window"], 3)
node("CALC.max-min", None, "TI-84 Plus: 2nd CALC maximum and minimum", ["CALC.intersect-zero"], ["calc-guess-bounds","poly-max-local"], 2)
node("CALC.table", None, "TI-84 Plus: table setup", ["CALC.mode-window"], ["calc-window"], 1)
node("EXAM.nr-recording", None, "Numerical-response recording rules (rounding, leading zero, digit codes)", [], ["nr-rounding"], 3)
node("EXAM.directing-words", None, "Directing words (determine, explain, justify, prove, sketch, verify…)", [], ["wr-directing-word"], 3)
node("EXAM.wr-hygiene", None, "Written-response hygiene: equations vs expressions, units, brackets, angle arguments", ["EXAM.directing-words"], ["wr-expression-for-equation","wr-units-missing","wr-brackets","trig-argument-missing"], 3, weak=True)
node("EXAM.sketch-standard", None, "Sketches with scaled axes and all key features", ["EXAM.wr-hygiene"], ["wr-sketch-features"], 3, weak=True)

# ---------------------------------------------------------------- outcomes
OUTCOMES = [
 # code, strand, short statement (paraphrase of the Program of Studies)
 ("RF1","RF","Operations on, and compositions of, functions."),
 ("RF2","RF","Effects of horizontal and vertical translations on graphs and equations."),
 ("RF3","RF","Effects of horizontal and vertical stretches on graphs and equations."),
 ("RF4","RF","Apply translations and stretches to graphs and equations."),
 ("RF5","RF","Effects of reflections in the x-axis, y-axis and the line y = x."),
 ("RF6","RF","Inverses of relations."),
 ("RF7","RF","Logarithms."),
 ("RF8","RF","Product, quotient and power laws of logarithms."),
 ("RF9","RF","Graph and analyze exponential and logarithmic functions."),
 ("RF10","RF","Solve problems involving exponential and logarithmic equations."),
 ("RF11","RF","Factor polynomials of degree > 2 (degree ≤ 5, integral coefficients)."),
 ("RF12","RF","Graph and analyze polynomial functions (degree ≤ 5)."),
 ("RF13","RF","Graph and analyze radical functions (one radical)."),
 ("RF14","RF","Graph and analyze rational functions (monomial, binomial, trinomial numerators/denominators)."),
 ("T1","T","Angles in standard position in degrees and radians."),
 ("T2","T","Develop and apply the equation of the unit circle."),
 ("T3","T","Solve problems using the six trigonometric ratios (degrees and radians)."),
 ("T4","T","Graph and analyze sine, cosine and tangent to solve problems."),
 ("T5","T","Solve first- and second-degree trigonometric equations algebraically and graphically."),
 ("T6","T","Prove trigonometric identities (reciprocal, quotient, Pythagorean, sum/difference, double-angle)."),
 ("PCBT1","PCBT","Apply the fundamental counting principle."),
 ("PCBT2","PCBT","Permutations of n elements taken r at a time."),
 ("PCBT3","PCBT","Combinations of n different elements taken r at a time."),
 ("PCBT4","PCBT","Expand powers of a binomial, including the binomial theorem (natural-number exponents)."),
]

UNITS = [
 # id, title, default order, estimated share of diploma (inferred; see meta.estimates)
 ("PRE","Prerequisite layer (Math 10C / 20-1)", 0, None),
 ("U1","Transformations and function operations", 1, 0.19),
 ("U2","Polynomial functions", 2, 0.09),
 ("U3","Exponential and logarithmic functions", 3, 0.16),
 ("U4","Trigonometry", 4, 0.30),
 ("U5","Radical and rational functions", 5, 0.10),
 ("U6","Permutations, combinations, and binomial theorem", 6, 0.16),
 ("EXAM","Exam skills (calculator, NR, written response)", 7, None),
]

doc = {
 "schemaVersion": 1,
 "meta": {
  "title": "Math 30-1 Lab curriculum map",
  "generated": "2026-10-03",
  "sources": [
   {"name": "Information Bulletin, Mathematics 30-1, 2025-2026", "url": "https://www.alberta.ca/system/files/custom_downloaded_images/edc-math-30-1-info-bulletin.pdf", "note": "2026-2027 edition not yet found; blueprint unchanged across recent years."},
   {"name": "Assessment Standards and Exemplars, Mathematics 30-1 (2023)", "url": "https://www.alberta.ca/system/files/custom_downloaded_images/edc-math30-1-assessment-standards-exemplars.pdf"},
   {"name": "Written-Response Information, Mathematics 30-1 (2018-2019)", "url": "https://education.alberta.ca/media/3704398/10-math30-1-written-response-info-2018-19_20171206.pdf"},
   {"name": "Diploma Exam Schedule 2026-2027", "url": "https://www.alberta.ca/system/files/custom_downloaded_images/edc-diploma-exam-schedule.pdf"},
   {"name": "Mathematics 10-12 Program of Studies", "url": "https://open.alberta.ca/publications/9780778564393"},
   {"name": "Mathematics 30-1 Practice Test 2022 (format reference only)", "url": "https://www.alberta.ca/system/files/custom_downloaded_images/edc-mathematics-30-1-practice-test.pdf"}
  ],
  "exam": {
   "date": "2027-01-20", "time": "09:00-12:00", "note": "From the 2026-2027 schedule; confirm in the setup wizard.",
   "machineScored": {"mc": 24, "nr": 8, "weight": 0.75},
   "writtenResponse": {"questions": 3, "parts": [2, 3], "halfMarks": True, "weight": 0.25},
   "minutes": 180, "maxMinutes": 360,
   "finalMarkWeight": 0.30,
   "topicWeights": {"RF": [0.53, 0.58], "T": [0.27, 0.33], "PCBT": [0.14, 0.18]},
   "cognitiveMix": {"conceptual": 0.34, "problemSolving": 0.36, "procedural": 0.30}
  },
  "estimates": {
   "unitShare": "Unit shares are my estimate split from the official strand ranges, not official numbers. Used only by the planner.",
   "examEmphasis": "1 = occasional, 2 = regular, 3 = nearly every exam. Inferred from the blueprint, the standards document and released-item patterns; not official."
  },
  "notation": {"integers": "n ∈ I (Z also accepted)", "domainRange": "interval and set-builder notation", "naturalNumbers": "N", "wholeNumbers": "W"}
 },
 "units": [dict(id=u, title=t, defaultOrder=o, estimatedExamShare=s) for u,t,o,s in UNITS],
 "outcomes": [dict(code=c, strand=s, statement=t) for c,s,t in OUTCOMES],
 "misconceptions": [dict(id=k, description=v) for k,v in M.items()],
 "nodes": N,
}

os.makedirs(OUT, exist_ok=True)
with open(os.path.join(OUT, "curriculum.json"), "w") as f:
    json.dump(doc, f, ensure_ascii=False, indent=1)

# ---------------------------------------------------------------- validation
ids = {n["id"] for n in N}
errs = []
if len(ids) != len(N): errs.append("duplicate node ids")
for n in N:
    for p in n["prerequisites"]:
        if p not in ids: errs.append(f"{n['id']}: unknown prereq {p}")
    for m in n["misconceptions"]:
        if m not in M: errs.append(f"{n['id']}: unknown misconception {m}")
    if n["outcome"] and n["outcome"].split("/")[0] not in {o[0] for o in OUTCOMES} and not n["outcome"].startswith("M"):
        errs.append(f"{n['id']}: unknown outcome {n['outcome']}")
# cycles
state = {}
def visit(i, stack):
    if state.get(i) == 1: errs.append("cycle: " + " -> ".join(stack + [i])); return
    if state.get(i) == 2: return
    state[i] = 1
    for p in next(n for n in N if n["id"] == i)["prerequisites"]: visit(p, stack + [i])
    state[i] = 2
for i in ids: visit(i, [])
covered = {o.split("/")[0] for n in N if n["outcome"] for o in n["outcome"].split("/")}
for c,_,_ in OUTCOMES:
    if c not in covered: errs.append(f"outcome {c} has no node")
used = {m for n in N for m in n["misconceptions"]}
unused = set(M) - used
print("nodes", len(N), "misconceptions", len(M), "unused", sorted(unused))
print("errors", errs or "none")
