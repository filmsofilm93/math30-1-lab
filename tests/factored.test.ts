import { describe, expect, it } from 'vitest';
import { checkField, parseNumberList } from '../src/engine/check';
import { isFullyFactored } from '../src/engine/check/factored';

describe('isFullyFactored', () => {
  it.each(['2(x+1)(x-3)', '(x+1)^2(x-3)', '-(x+2)(x-2)', 'x(x+4)', '(2x+1)(x-3)', '3x^2(x-1)', '(x^2+4)(x-2)(x+2)', '-2(x-1)(x+5)', 'x^2+3', '\\left(x+1\\right)\\left(x-3\\right)', '(x^2-3)(x+1)', '5'])('accepts %s', (t) => {
    expect(isFullyFactored(t)).toBe(true);
  });
  it.each(['x^2+2x', '(2x+2)(x+3)', '(x^2-4)(x+1)', 'x^2-5x+6', '3x+6', '(x^4-1)', 'x^3+x', '(x+\\frac{1}{2})(x-1)'])('rejects %s', (t) => {
    expect(isFullyFactored(t)).toBe(false);
  });
});

describe('factored answers', () => {
  const spec = { kind: 'expr' as const, tex: '2(x-1)(x+3)', variable: 'x', fn: (x: number) => 2 * (x - 1) * (x + 3), sample: [-5, 5] as [number, number], form: 'factored' as const };
  it('accepts any order of factors', () => expect(checkField(spec, '2(x+3)(x-1)').ok).toBe(true));
  it('flags the expanded form as not factored', () => expect(checkField(spec, '2x^2+4x-6')).toMatchObject({ ok: false, reason: 'form' }));
  it('flags a missing common factor', () => expect(checkField(spec, '(2x-2)(x+3)')).toMatchObject({ ok: false, reason: 'form' }));
  it('marks a wrong factorization wrong', () => expect(checkField(spec, '2(x+1)(x-3)').reason).toBe('wrong'));
});

describe('solution sets with ±', () => {
  it('expands ±', () => {
    const v = parseNumberList('\\frac{3\\pm\\sqrt{5}}{2}')!.sort();
    expect(v[0]).toBeCloseTo((3 - Math.sqrt(5)) / 2, 12);
    expect(v[1]).toBeCloseTo((3 + Math.sqrt(5)) / 2, 12);
  });
  it('rejects decimals in exact sets', () => {
    const spec = { kind: 'set' as const, values: [1 + Math.sqrt(2), 1 - Math.sqrt(2)], tex: '1\\pm\\sqrt{2}', exact: true };
    expect(checkField(spec, '1\\pm\\sqrt{2}').ok).toBe(true);
    expect(checkField(spec, 'x=1+\\sqrt{2}, x=1-\\sqrt{2}').ok).toBe(true);
    expect(checkField(spec, '2.414, -0.414').reason).toBe('exact');
  });
});
