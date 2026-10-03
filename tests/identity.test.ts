import { describe, expect, it } from 'vitest';
import { checkStep, compileTrig, equivalentTex, IDENTITY_PROBLEMS, npvDegrees, sidesMatch } from '../src/engine/identity';

describe('identity engine', () => {
  it('reads trig expressions', () => {
    expect(compileTrig('\\sin^2 x + \\cos^2 x')!.f(0.4)).toBeCloseTo(1);
    expect(compileTrig('\\frac{1}{2}\\sin 2x')!.f(0.4)).toBeCloseTo(Math.sin(0.4) * Math.cos(0.4));
    expect(compileTrig('2\\sin\\theta\\cos\\theta')!.f(0.4)).toBeCloseTo(Math.sin(0.8));
    expect(compileTrig('\\cos^{-1} x')).toBeNull();
  });

  it('every built-in identity is true', () => {
    for (const p of IDENTITY_PROBLEMS) expect(equivalentTex(p.lhs, p.rhs), p.id).toBe(true);
  });

  it('rejects non-identities', () => {
    expect(equivalentTex('\\sin 2x', '2\\sin x')).toBe(false);
    expect(equivalentTex('1 - \\tan^2 x', '\\sec^2 x')).toBe(false);
    expect(equivalentTex('(\\sin x + \\cos x)^2', '1')).toBe(false);
  });

  it('finds non-permissible values, including removable ones', () => {
    expect(npvDegrees('\\frac{\\sin x}{1 - \\cos x}')).toEqual([0]);
    expect(npvDegrees('\\tan x + \\cot x')).toEqual([0, 90, 180, 270]);
    expect(npvDegrees('\\frac{\\sin x}{\\sin x}')).toEqual([0, 180]);
    expect(npvDegrees('\\frac{\\cos x}{2\\sin x - 1}')).toEqual([30, 150]);
    expect(npvDegrees('\\sin x\\cos x')).toEqual([]);
  });

  it('checks steps and flags new restrictions', () => {
    expect(checkStep('\\tan x\\cos x', '\\frac{\\sin x}{\\cos x}\\cos x')).toEqual({ ok: true });
    expect(checkStep('\\sin x', '\\frac{\\sin x\\cos x}{\\cos x}')).toEqual({ ok: true, newNpv: [90, 270] });
    expect(checkStep('\\sec^2 x - 1', '1 - \\tan^2 x').ok).toBe(false);
  });

  it('matches sides literally or up to term order', () => {
    expect(sidesMatch('\\sin x\\tan x', '\\sin x \\tan x')).toBe(true);
    expect(sidesMatch('\\cos x\\cot x', '\\cot x\\cos x')).toBe(true);
    expect(sidesMatch('\\sin x', '\\frac{\\sin x\\cos x}{\\cos x}')).toBe(false);
  });
});
