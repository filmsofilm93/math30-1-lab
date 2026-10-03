import { describe, expect, it } from 'vitest';
import { binomExpand, binomTerm, countDistinct, distinctArrangements, fact, nCr, nPr, pascalRow, subsets } from '../src/engine/counting';

describe('counting engine', () => {
  it('factorials, permutations, combinations', () => {
    expect(fact(0)).toBe(1);
    expect(fact(6)).toBe(720);
    expect(nPr(8, 3)).toBe(336);
    expect(nCr(8, 3)).toBe(56);
    expect(nCr(20, 10)).toBe(184756);
    expect(nCr(5, 6)).toBe(0);
  });
  it('agrees with enumeration', () => {
    expect([...subsets([1, 2, 3, 4, 5, 6], 3)].length).toBe(nCr(6, 3));
    expect(countDistinct('LEVEL')).toBe(30);
    expect(distinctArrangements('LEVEL')).toBe(30);
    expect(countDistinct('MATHS', (s) => Math.abs(s.indexOf('M') - s.indexOf('A')) === 1)).toBe(48);
  });
  it('binomial terms', () => {
    expect(pascalRow(4)).toEqual([1, 4, 6, 4, 1]);
    expect(binomTerm(6, 3, 2, 1, -1, -1)).toEqual({ coef: -160, pow: 0 });
    expect(binomExpand(3, 2, 1, -3, 0)).toEqual([
      { coef: 8, pow: 3 },
      { coef: -36, pow: 2 },
      { coef: 54, pow: 1 },
      { coef: -27, pow: 0 },
    ]);
  });
});
