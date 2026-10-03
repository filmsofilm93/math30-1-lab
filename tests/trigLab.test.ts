import { describe, expect, it } from 'vitest';
import { angleLabel, castInfo, coterminals, generalSolution, matchTarget, sameCurve, solveFn, unitPoint } from '../src/engine/trigLab';
import { Rng } from '../src/engine/rng';

describe('trig lab helpers', () => {
  it('labels angles', () => {
    expect(angleLabel(150, true)).toBe('\\frac{5\\pi}{6}');
    expect(angleLabel(150, false)).toBe('150^\\circ');
    expect(angleLabel(100, true)).toBe('1.75');
  });

  it('gives exact unit-circle points at special angles', () => {
    expect(unitPoint(135)).toMatchObject({ x: { tex: '-\\frac{\\sqrt{2}}{2}' }, y: { tex: '\\frac{\\sqrt{2}}{2}' }, exact: true });
    expect(unitPoint(100).exact).toBe(false);
    expect(castInfo(200)).toEqual({ q: 3, positive: 'tangent (and cot)' });
    expect(coterminals(30, 1)).toEqual([-330, 30, 390]);
  });

  it('recognises equivalent sinusoids', () => {
    expect(sameCurve({ f: 'sin', a: 2, b: 1, c: 0, d: 0 }, { f: 'cos', a: 2, b: 1, c: 90, d: 0 })).toBe(true);
    expect(sameCurve({ f: 'sin', a: 2, b: 1, c: 0, d: 0 }, { f: 'sin', a: -2, b: 1, c: 180, d: 0 })).toBe(true);
    expect(sameCurve({ f: 'sin', a: 2, b: 2, c: 0, d: 0 }, { f: 'sin', a: 2, b: 1, c: 0, d: 0 })).toBe(false);
    const rng = new Rng(4);
    for (let i = 0; i < 20; i++) expect(Math.abs(matchTarget(() => rng.next()).a)).toBeGreaterThan(1);
  });

  it('solves fn x = k exactly or numerically', () => {
    expect(solveFn('sin', 0.5, 0, 360)).toEqual({ xs: [30, 150], exact: true });
    expect(solveFn('cos', 0, -360, 360, true).xs).toEqual([-270, -90, 90, 270]);
    expect(solveFn('tan', 1, 0, 720).xs).toEqual([45, 225, 405, 585]);
    expect(solveFn('sin', 2, 0, 360)).toEqual({ xs: [], exact: true });
    const s = solveFn('sin', 0.3, 0, 360);
    expect(s.exact).toBe(false);
    expect(s.xs.map((x) => +x.toFixed(1))).toEqual([17.5, 162.5]);
  });

  it('collapses general solutions', () => {
    expect(generalSolution('sin', 0)).toEqual({ roots: [0], period: 180, exact: true });
    expect(generalSolution('cos', 0.5)).toEqual({ roots: [60, 300], period: 360, exact: true });
    expect(generalSolution('cos', 3)).toBeNull();
  });
});
