import { describe, expect, it } from 'vitest';
import { checkField, parseNumberList, parsePoints } from '../src/engine/check';
import { hasDecimal, numeric } from '../src/engine/check/ce';
import { ALL, except, intervalTex, iv, parseRealSet, setBuilderTex, setEqual } from '../src/engine/check/realset';
import type { AnswerSpec } from '../src/engine/types';

const expr = (fn: (x: number) => number, sample: [number, number] = [-5, 5], extra: Partial<AnswerSpec> = {}): AnswerSpec =>
  ({ kind: 'expr', tex: '', variable: 'x', fn, sample, ...extra }) as AnswerSpec;

describe('numeric', () => {
  it('evaluates exact forms', () => {
    expect(numeric('-\\frac{3}{2}')).toBeCloseTo(-1.5);
    expect(numeric('2\\sqrt{3}')).toBeCloseTo(2 * Math.sqrt(3));
    expect(numeric('\\infty')).toBe(Infinity);
    expect(numeric('-\\infty')).toBe(-Infinity);
    expect(numeric('x+1')).toBeNaN();
  });
  it('detects decimals', () => {
    expect(hasDecimal('0.5')).toBe(true);
    expect(hasDecimal('.5x')).toBe(true);
    expect(hasDecimal('\\frac{1}{2}')).toBe(false);
  });
});

describe('number answers', () => {
  it('accepts equivalent exact forms', () => {
    const s: AnswerSpec = { kind: 'number', value: 1.5, tex: '\\frac{3}{2}', exact: true };
    expect(checkField(s, '\\frac{3}{2}').ok).toBe(true);
    expect(checkField(s, '\\frac{6}{4}').ok).toBe(true);
    expect(checkField(s, 'x=\\frac{3}{2}').ok).toBe(true);
    expect(checkField(s, '1.5')).toEqual({ ok: false, reason: 'exact' });
  });
  it('applies rounding rules', () => {
    const s: AnswerSpec = { kind: 'number', value: 2.346, tex: '2.35', round: 'hundredth' };
    expect(checkField(s, '2.35').ok).toBe(true);
    expect(checkField(s, '2.34')).toEqual({ ok: false, reason: 'rounding' });
    expect(checkField(s, '2.346').ok).toBe(false);
  });
});

describe('expression answers', () => {
  it('accepts algebraically equivalent forms', () => {
    const s = expr((x) => 2 * (x - 3) ** 2 + 1);
    expect(checkField(s, 'y=2(x-3)^2+1').ok).toBe(true);
    expect(checkField(s, '2x^2-12x+19').ok).toBe(true);
    expect(checkField(s, '2(x+3)^2+1').ok).toBe(false);
  });
  it('handles radicals with a domain window', () => {
    const s = expr((x) => Math.sqrt(2 * (x - 1)), [1, 10]);
    expect(checkField(s, '\\sqrt{2x-2}').ok).toBe(true);
    expect(checkField(s, '\\sqrt{2}\\sqrt{x-1}').ok).toBe(true);
    expect(checkField(s, '\\sqrt{2x-1}').ok).toBe(false);
  });
  it('handles abs, rational and exponents', () => {
    expect(checkField(expr((x) => -Math.abs(x + 2) + 3), '-\\left|x+2\\right|+3').ok).toBe(true);
    expect(checkField(expr((x) => 1 / (x - 2)), '\\frac{1}{x-2}').ok).toBe(true);
    expect(checkField(expr((x) => 2 ** (x - 1)), '\\frac{1}{2}\\cdot2^{x}').ok).toBe(true);
  });
  it('requires both branches for ±', () => {
    const s = expr((x) => 2 + Math.sqrt(x - 1), [1, 10], { fnMinus: (x: number) => 2 - Math.sqrt(x - 1) });
    expect(checkField(s, 'y=2\\pm\\sqrt{x-1}').ok).toBe(true);
    expect(checkField(s, '\\pm\\sqrt{x-1}+2').ok).toBe(true);
    expect(checkField(s, '2+\\sqrt{x-1}')).toEqual({ ok: false, reason: 'branches' });
  });
  it('rejects other variables', () => {
    expect(checkField(expr((x) => x + 1), 'y+1').reason).toBe('variable');
  });
  it('rejects decimals when exact', () => {
    expect(checkField(expr((x) => x / 2, [-5, 5], { exact: true }), '0.5x').reason).toBe('exact');
    expect(checkField(expr((x) => x / 2), '0.5x').ok).toBe(true);
  });
});

describe('sets and points', () => {
  it('reads solution lists in several notations', () => {
    expect(parseNumberList('x=2, x=-3')).toEqual([2, -3]);
    expect(parseNumberList('\\{2,-3\\}')).toEqual([2, -3]);
    expect(parseNumberList('-\\frac{1}{2},4')).toEqual([-0.5, 4]);
    expect(parseNumberList('\\varnothing')).toEqual([]);
    expect(checkField({ kind: 'set', values: [-3, 2], tex: '' }, 'x=2,x=-3').ok).toBe(true);
    expect(checkField({ kind: 'set', values: [-3, 2], tex: '' }, '2').ok).toBe(false);
  });
  it('reads points', () => {
    expect(parsePoints('\\left(1,-2\\right),(0,\\frac{1}{2})')).toEqual([
      [1, -2],
      [0, 0.5],
    ]);
    expect(checkField({ kind: 'points', values: [[3, 4]], tex: '' }, '(3,4)').ok).toBe(true);
    expect(checkField({ kind: 'points', values: [[3, 4]], tex: '' }, '(4,3)').ok).toBe(false);
  });
});

describe('real sets', () => {
  const holeAt2 = except(ALL, [2]);
  it('parses interval notation', () => {
    expect(setEqual(parseRealSet('\\left(-\\infty,2\\right)\\cup\\left(2,\\infty\\right)')!, holeAt2)).toBe(true);
    expect(setEqual(parseRealSet('\\lbrack-2,5)')!, [iv(-2, 5, true, false)])).toBe(true);
    expect(setEqual(parseRealSet('[-\\frac{3}{2},\\infty)')!, [iv(-1.5, Infinity)])).toBe(true);
    expect(parseRealSet('[-\\infty,2)')).toBeNull();
  });
  it('parses set-builder notation', () => {
    expect(setEqual(parseRealSet('\\{x\\mid x\\ne2,x\\in\\mathbb{R}\\}')!, holeAt2)).toBe(true);
    expect(setEqual(parseRealSet('\\{x|-2\\le x<5,x\\in R\\}')!, [iv(-2, 5, true, false)])).toBe(true);
    expect(setEqual(parseRealSet('\\{x\\mid x\\ge3\\}')!, [iv(3, Infinity)])).toBe(true);
    expect(setEqual(parseRealSet('\\{x\\mid x\\ne -1, 4, x\\in\\R\\}')!, except(ALL, [-1, 4]))).toBe(true);
    expect(setEqual(parseRealSet('\\mathbb{R}')!, ALL)).toBe(true);
  });
  it('formats both notations', () => {
    expect(intervalTex(holeAt2)).toBe('(-\\infty, 2) \\cup (2, \\infty)');
    expect(setBuilderTex(holeAt2)).toBe('\\{x \\mid x \\ne 2, x \\in \\mathbb{R}\\}');
    expect(setBuilderTex([iv(-2, 5, true, false)])).toBe('\\{x \\mid -2 \\le x < 5, x \\in \\mathbb{R}\\}');
  });
});
