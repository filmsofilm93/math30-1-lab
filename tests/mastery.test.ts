import { describe, expect, it } from 'vitest';
import { masteryStatus } from '../src/engine/mastery';
import { gradeFor, review } from '../src/engine/srs';
import { Rating } from 'ts-fsrs';

const att = (correct: boolean, day: string, assisted = false, mode = 'practice') => ({ correct, day, assisted, mode });

describe('mastery rule', () => {
  it('needs 10 unassisted attempts', () => {
    expect(masteryStatus(Array.from({ length: 9 }, (_, i) => att(true, i < 5 ? 'd1' : 'd2'))).mastered).toBe(false);
  });
  it('needs two different days', () => {
    expect(masteryStatus(Array.from({ length: 10 }, () => att(true, 'd1'))).mastered).toBe(false);
    expect(masteryStatus(Array.from({ length: 10 }, (_, i) => att(true, i < 5 ? 'd1' : 'd2'))).mastered).toBe(true);
  });
  it('needs at least 80%', () => {
    const seven = Array.from({ length: 10 }, (_, i) => att(i >= 3, i < 5 ? 'd1' : 'd2'));
    const eight = Array.from({ length: 10 }, (_, i) => att(i >= 2, i < 5 ? 'd1' : 'd2'));
    expect(masteryStatus(seven).mastered).toBe(false);
    expect(masteryStatus(eight).mastered).toBe(true);
  });
  it('ignores assisted and faded attempts, using only the last 10', () => {
    const list = [...Array.from({ length: 10 }, () => att(false, 'd0')), ...Array.from({ length: 10 }, (_, i) => att(true, i < 5 ? 'd1' : 'd2')), att(false, 'd2', true), att(false, 'd2', false, 'faded')];
    expect(masteryStatus(list).mastered).toBe(true);
  });
});

describe('review scheduling', () => {
  it('maps confidence to grades', () => {
    expect(gradeFor(false, 'sure')).toBe(Rating.Again);
    expect(gradeFor(true, 'guess')).toBe(Rating.Hard);
    expect(gradeFor(true, 'sure')).toBe(Rating.Good);
  });
  it('schedules a guessed answer sooner than a sure one', () => {
    const now = new Date('2026-10-10T12:00:00').getTime();
    const base = review(undefined, true, 'sure', '2027-01-20', now);
    const later = now + 5 * 86_400_000;
    const sure = review(base, true, 'sure', '2027-01-20', later);
    const guess = review(base, true, 'guess', '2027-01-20', later);
    expect(guess.due).toBeLessThan(sure.due);
  });
  it('never schedules past the exam', () => {
    const exam = new Date('2027-01-21').getTime();
    let c = review(undefined, true, 'sure', '2027-01-20', new Date('2026-12-01').getTime());
    for (let i = 0; i < 8 && c.due < exam; i++) {
      c = review(c, true, 'sure', '2027-01-20', c.due);
      expect(c.due).toBeLessThanOrEqual(exam);
    }
  });
});

import { invariantPoints } from '../src/engine/invariant';
describe('invariant points', () => {
  const quad = (x: number) => x * x - 4;
  it('vertical stretch fixes the x-intercepts', () => {
    expect(invariantPoints(quad, 3, 1, 0, 0, [-8, 8]).map((p) => p[0]).sort()).toEqual([-2, 2]);
  });
  it('horizontal stretch fixes the y-intercept', () => {
    expect(invariantPoints(quad, 1, 2, 0, 0, [-8, 8])).toEqual([[0, -4]]);
  });
  it('translations fix nothing', () => {
    expect(invariantPoints(quad, 1, 1, 2, 0, [-8, 8])).toEqual([]);
    expect(invariantPoints(quad, 1, 1, 0, 0, [-8, 8])).toEqual([]);
  });
  it('vertical stretch plus translation fixes points on y = k/(1 − a)', () => {
    // y = 2f(x) + 4 → fixed y = -4: quad(x) = -4 at x = 0
    expect(invariantPoints(quad, 2, 1, 0, 4, [-8, 8])).toEqual([[0, -4]]);
  });
});
