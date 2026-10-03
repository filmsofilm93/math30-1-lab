import { describe, expect, it } from 'vitest';
import { LOG_PROBLEMS, checkStep, isCondensed, isExpanded } from '../src/engine/loglaw';

describe('log-law simplifier', () => {
  it.each(LOG_PROBLEMS.map((p) => [p.id, p] as const))('%s: start is equivalent but unfinished; answer finishes', (_id, p) => {
    expect(checkStep(p, p.start)).toMatchObject({ ok: true, done: false });
    expect(checkStep(p, p.answer)).toMatchObject({ ok: true, done: true });
  });
  it('rejects common law errors', () => {
    const e1 = LOG_PROBLEMS.find((p) => p.id === 'e1')!;
    expect(checkStep(e1, '3+3\\log_2 x+\\log_2 y').ok).toBe(false); // quotient sign
    expect(checkStep(e1, '3+(\\log_2 x)^3-\\log_2 y').ok).toBe(false); // power in the wrong place
    const c1 = LOG_PROBLEMS.find((p) => p.id === 'c1')!;
    expect(checkStep(c1, '\\log_5\\left(\\frac{2xy}{3z}\\right)').ok).toBe(false); // coefficient as a factor
    expect(checkStep(c1, '\\log_5 x^2+\\log_5 y-\\log_5 z^3')).toMatchObject({ ok: true, done: false });
  });
  it('detects finished forms', () => {
    expect(isExpanded('2\\log_3 x+\\log_3(x-1)')).toBe(true);
    expect(isExpanded('\\log_2 8x')).toBe(false);
    expect(isExpanded('\\log x^2')).toBe(false);
    expect(isCondensed('\\log x+1')).toBe(false);
    expect(isCondensed('\\log_2\\left(\\frac{x}{3}\\right)')).toBe(true);
  });
});
