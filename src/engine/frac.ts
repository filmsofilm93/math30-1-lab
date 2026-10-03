/** Exact rational numbers for generators, so answers like 7/2 never pass through floating point. */
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export class Frac {
  readonly n: number;
  readonly d: number;
  constructor(n: number, d = 1) {
    if (!Number.isInteger(n) || !Number.isInteger(d) || d === 0) throw new Error(`bad fraction ${n}/${d}`);
    const g = gcd(n, d);
    const s = d < 0 ? -1 : 1;
    this.n = (s * n) / g || 0;
    this.d = (s * d) / g;
  }
  static of(x: Frac | number): Frac {
    return x instanceof Frac ? x : new Frac(x);
  }
  add(o: Frac | number) {
    const b = Frac.of(o);
    return new Frac(this.n * b.d + b.n * this.d, this.d * b.d);
  }
  sub(o: Frac | number) {
    return this.add(Frac.of(o).neg());
  }
  mul(o: Frac | number) {
    const b = Frac.of(o);
    return new Frac(this.n * b.n, this.d * b.d);
  }
  div(o: Frac | number) {
    const b = Frac.of(o);
    return new Frac(this.n * b.d, this.d * b.n);
  }
  neg() {
    return new Frac(-this.n, this.d);
  }
  inv() {
    return new Frac(this.d, this.n);
  }
  abs() {
    return new Frac(Math.abs(this.n), this.d);
  }
  eq(o: Frac | number) {
    const b = Frac.of(o);
    return this.n === b.n && this.d === b.d;
  }
  get isInt() {
    return this.d === 1;
  }
  get value() {
    return this.n / this.d;
  }
  /** LaTeX: 3, -2, \frac{1}{2}, -\frac{3}{4} */
  tex(): string {
    if (this.d === 1) return String(this.n);
    return `${this.n < 0 ? '-' : ''}\\frac{${Math.abs(this.n)}}{${this.d}}`;
  }
  toString() {
    return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`;
  }
}

export const F = (n: number, d = 1) => new Frac(n, d);

/** Coefficient in front of something: 1 → "", -1 → "-", 2 → "2", 1/2 → "\frac{1}{2}" */
export function coefTex(c: Frac | number): string {
  const f = Frac.of(c);
  if (f.eq(1)) return '';
  if (f.eq(-1)) return '-';
  return f.tex();
}

/** Signed term to append: +3 → "+3", -3 → "-3", 0 → "" */
export function signedTex(c: Frac | number): string {
  const f = Frac.of(c);
  if (f.n === 0) return '';
  return f.n > 0 ? `+${f.tex()}` : `-${f.abs().tex()}`;
}

/** "x - 3", "x + 2", "x" for x − h */
export function shiftTex(h: Frac | number, v = 'x'): string {
  const f = Frac.of(h);
  if (f.n === 0) return v;
  return f.n > 0 ? `${v}-${f.tex()}` : `${v}+${f.abs().tex()}`;
}

/** Polynomial LaTeX from coefficients, highest power first: [2, 0, -3, 1] → 2x^3-3x+1 */
export function polyTex(coeffs: (Frac | number)[], v = 'x'): string {
  const deg = coeffs.length - 1;
  let out = '';
  coeffs.forEach((c, i) => {
    const f = Frac.of(c);
    if (f.n === 0) return;
    const p = deg - i;
    const mono = p === 0 ? '' : p === 1 ? v : `${v}^{${p}}`;
    const mag = p === 0 ? f.abs().tex() : coefTex(f.abs());
    const sign = f.n < 0 ? '-' : out ? '+' : '';
    out += `${sign}${mag}${mono}`;
  });
  return out || '0';
}

export const polyEval = (coeffs: number[]) => (x: number) => coeffs.reduce((acc, c) => acc * x + c, 0);

/** Point LaTeX (a, b) */
export function ptTex(x: Frac | number, y: Frac | number): string {
  return `\\left(${Frac.of(x).tex()}, ${Frac.of(y).tex()}\\right)`;
}
