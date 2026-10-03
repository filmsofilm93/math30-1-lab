/** Seeded PRNG (mulberry32). Same seed, same sequence, on every device. */
export class Rng {
  private s: number;
  constructor(seed: number) {
    this.s = seed >>> 0;
  }
  next(): number {
    let t = (this.s = (this.s + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  /** Integer in [lo, hi], inclusive. */
  int(lo: number, hi: number): number {
    return lo + Math.floor(this.next() * (hi - lo + 1));
  }
  /** Non-zero integer in [lo, hi]. */
  nz(lo: number, hi: number): number {
    for (;;) {
      const v = this.int(lo, hi);
      if (v !== 0) return v;
    }
  }
  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
  chance(p: number): boolean {
    return this.next() < p;
  }
  sign(): 1 | -1 {
    return this.next() < 0.5 ? 1 : -1;
  }
  shuffle<T>(arr: readonly T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  /** k distinct picks. */
  sample<T>(arr: readonly T[], k: number): T[] {
    return this.shuffle(arr).slice(0, k);
  }
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}
