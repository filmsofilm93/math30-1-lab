import { describe, expect, it } from 'vitest';
import { setEqual } from '../src/engine/check/realset';
import { analyze, expand, L, ratTex } from '../src/engine/rational';

describe('rational engine', () => {
  it('separates holes from vertical asymptotes', () => {
    const a = analyze({ k: 1, num: [L(2)], den: [L(2), L(-3)] });
    expect(a.holes.map((h) => [h.x.value, h.y.tex()])).toEqual([[2, '\\frac{1}{5}']]);
    expect(a.vas.map((v) => v.value)).toEqual([-3]);
    expect(a.ha!.value).toBe(0);
    expect(a.xints).toEqual([]);
  });
  it('keeps an asymptote when a squared factor cancels once', () => {
    const a = analyze({ k: 1, num: [L(1)], den: [L(1), L(1)] });
    expect(a.holes).toEqual([]);
    expect(a.vas.map((v) => v.value)).toEqual([1]);
  });
  it('gives the range of a line with a hole and of linear over linear', () => {
    const line = analyze({ k: 1, num: [L(3), L(1)], den: [L(1)] });
    expect(setEqual(line.range!, [{ lo: -Infinity, hi: -2, loIn: false, hiIn: false }, { lo: -2, hi: Infinity, loIn: false, hiIn: false }])).toBe(true);
    const lin = analyze({ k: 2, num: [L(1)], den: [L(-2)] });
    expect(lin.ha!.value).toBe(2);
    expect(lin.yint!.value).toBe(-1);
    expect(lin.range!.length).toBe(2);
  });
  it('k/(x − p)² has a one-sided range', () => {
    const a = analyze({ k: -3, num: [], den: [L(2), L(2)] });
    expect(a.range).toEqual([{ lo: -Infinity, hi: 0, loIn: false, hiIn: false }]);
  });
  it('expands and renders', () => {
    expect(expand([L(2), L(-3)])).toEqual([1, 1, -6]);
    expect(ratTex({ k: 1, num: [L(2)], den: [L(2), L(-3)] }, 'expanded')).toBe('\\frac{x-2}{x^{2}+x-6}');
  });
});
