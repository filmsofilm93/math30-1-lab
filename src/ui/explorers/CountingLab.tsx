import { useMemo, useState } from 'react';
import type { CountingPreset } from '../../content/lessons/types';
import { binomTerm, countDistinct, fact, nCr, pascalRow } from '../../engine/counting';
import { binTex, monoTex } from '../../engine/generators/u6/binomial';
import { Tex } from '../components/Rich';
import { btnGhost, card, good, muted } from '../styles';
import { Chips, chipOn, Slider, Toggle } from './controls';

type Mode = NonNullable<CountingPreset['mode']>;

export function CountingLab({ preset, locked = false }: { preset: CountingPreset; locked?: boolean }) {
  const [mode, setMode] = useState<Mode>(preset.mode ?? 'slots');
  return (
    <div className={`${card} flex flex-col gap-3 p-3 sm:p-4`}>
      <Chips
        label="Counting lab view"
        options={[
          { id: 'slots', label: 'Slots' },
          { id: 'arrange', label: 'Arrange' },
          { id: 'cases', label: 'Cases' },
          { id: 'pascal', label: 'Pascal' },
          { id: 'term', label: 'General term' },
        ]}
        value={mode}
        onChange={setMode}
      />
      <fieldset disabled={locked} className={`flex min-w-0 flex-col gap-3 ${locked ? 'opacity-50' : ''}`}>
        {mode === 'slots' && <SlotsView preset={preset} />}
        {mode === 'arrange' && <ArrangeView preset={preset} />}
        {mode === 'cases' && <CasesView />}
        {mode === 'pascal' && <PascalView />}
        {mode === 'term' && <TermView preset={preset} />}
      </fieldset>
    </div>
  );
}

const slotBox = 'flex min-w-11 flex-col items-center rounded-lg border-2 border-accent px-2 py-1 dark:border-accent-d';

function SlotsView({ preset }: { preset: CountingPreset }) {
  const N = Array.from({ length: 10 }, (_, i) => i + 1);
  const [ni, setNi] = useState((preset.n ?? 6) - 1);
  const [r, setR] = useState(preset.r ?? 3);
  const [order, setOrder] = useState(preset.order ?? true);
  const [rep, setRep] = useState(false);
  const n = N[ni];
  const rr = Math.min(r, rep ? 6 : n);
  const choices = Array.from({ length: rr }, (_, i) => (rep ? n : n - i));
  const prod = choices.reduce((a, b) => a * b, 1);
  const total = order ? prod : prod / fact(rr);
  return (
    <>
      <Slider label="n" n={N.length} index={ni} onChange={setNi} show={`${n} items`} />
      <Slider label="r" n={rep ? 6 : Math.min(6, n)} index={rr - 1} onChange={(i) => setR(i + 1)} show={`${rr} slots`} />
      <Toggle checked={order} onChange={(v) => (setOrder(v), v || setRep(false))}>
        Order matters (positions are different)
      </Toggle>
      {order && (
        <Toggle checked={rep} onChange={setRep}>
          Repetition allowed
        </Toggle>
      )}
      <div className="flex flex-wrap items-end gap-1.5">
        {choices.map((c, i) => (
          <span key={i} className="flex items-end gap-1.5">
            {i > 0 && <span className="pb-2">×</span>}
            <span className={slotBox}>
              <span className="text-lg font-bold tabular-nums">{c}</span>
              <span className={`text-xs ${muted}`}>slot {i + 1}</span>
            </span>
          </span>
        ))}
        <span className="pb-2">
          = <b>{prod.toLocaleString()}</b>
        </span>
      </div>
      <div className="overflow-x-auto">
        {order ? (
          <Tex src={rep ? `${n}^{${rr}} = ${total.toLocaleString()}` : `{}_{${n}}P_{${rr}} = \\frac{${n}!}{${n - rr}!} = ${total.toLocaleString()}`} display />
        ) : (
          <Tex src={`{}_{${n}}C_{${rr}} = \\frac{${n}!}{(${n} - ${rr})!\\,${rr}!} = \\frac{${prod.toLocaleString()}}{${rr}!} = ${total.toLocaleString()}`} display />
        )}
      </div>
      <p className={`text-sm ${muted}`}>
        {order
          ? rep
            ? 'Every slot has all n choices: the fundamental counting principle multiplies them.'
            : 'Each slot has one fewer choice than the one before, because an item cannot be reused.'
          : `Order doesn't matter, so each group of ${rr} was counted ${rr}! = ${fact(rr)} times in the slot product (once per ordering). Divide it out.`}
      </p>
    </>
  );
}

const WORDS = ['MATHS', 'GRAPH', 'ALBERTA', 'LEVEL', 'BOOKS'];
type Constraint = NonNullable<CountingPreset['constraint']>;
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

function constraintInfo(word: string, c: Constraint) {
  const L = word.split('');
  const [x, y] = [L[0], L[1]];
  const pred: Record<Constraint, (s: string) => boolean> = {
    none: () => true,
    together: (s) => {
      // Treat the first two letters (as tiles) by their first occurrences; only used for distinct-letter words.
      return Math.abs(s.indexOf(x) - s.indexOf(y)) === 1;
    },
    apart: (s) => Math.abs(s.indexOf(x) - s.indexOf(y)) !== 1,
    first: (s) => VOWELS.has(s[0]),
  };
  const label: Record<Constraint, string> = {
    none: 'No restriction',
    together: `${x} and ${y} together`,
    apart: `${x} and ${y} not together`,
    first: 'Starts with a vowel',
  };
  return { pred: pred[c], label: label[c], x, y };
}

function formulaFor(word: string, c: Constraint, x: string, y: string): { tex: string; note: string } {
  const n = word.length;
  const counts: Record<string, number> = {};
  for (const ch of word) counts[ch] = (counts[ch] ?? 0) + 1;
  const reps = Object.entries(counts).filter(([, v]) => v > 1);
  const den = reps.map(([, v]) => `${v}!`).join('\\,');
  const base = den ? `\\frac{${n}!}{${den}}` : `${n}!`;
  if (c === 'none') return { tex: base, note: '' };
  if (c === 'together') return { tex: `${n - 1}! \\times 2!`, note: `Glue ${x}${y} into one block, arrange the ${n - 1} units, then order inside the block.` };
  if (c === 'apart') return { tex: `${n}! - ${n - 1}!\\,2!`, note: 'All arrangements minus those with the two together.' };
  const v = Object.entries(counts).filter(([ch]) => VOWELS.has(ch));
  const parts = v.map(([ch]) => {
    const rest = { ...counts, [ch]: counts[ch] - 1 };
    const d = Object.values(rest).filter((k) => k > 1).map((k) => `${k}!`).join('\\,');
    return d ? `\\frac{${n - 1}!}{${d}}` : `${n - 1}!`;
  });
  return { tex: parts.join(' + ') || '0', note: parts.length ? 'One case for each vowel that can go first; the rest arrange behind it.' : 'No vowel, so no arrangement qualifies.' };
}

function ArrangeView({ preset }: { preset: CountingPreset }) {
  const [word, setWord] = useState(WORDS[0]);
  const [c, setC] = useState<Constraint>(preset.constraint ?? 'none');
  const [placed, setPlaced] = useState<number[]>([]);
  const distinctLetters = new Set(word).size === word.length;
  const cc = !distinctLetters && (c === 'together' || c === 'apart') ? 'none' : c;
  const info = constraintInfo(word, cc);
  const total = useMemo(() => countDistinct(word, info.pred), [word, cc]);
  const all = useMemo(() => countDistinct(word), [word]);
  const formula = formulaFor(word, cc, info.x, info.y);
  const tiles = word.split('');
  const current = placed.map((i) => tiles[i]).join('');
  const full = placed.length === tiles.length;
  const [found, setFound] = useState<string[]>([]);
  const place = (i: number) => {
    if (placed.includes(i)) return;
    const next = [...placed, i];
    setPlaced(next);
    if (next.length === tiles.length) {
      const s = next.map((j) => tiles[j]).join('');
      if (info.pred(s) && !found.includes(s)) setFound([...found, s]);
    }
  };
  const change = (fn: () => void) => {
    fn();
    setPlaced([]);
    setFound([]);
  };
  return (
    <>
      <Chips label="Word" options={WORDS.map((w) => ({ id: w, label: w }))} value={word} onChange={(w) => change(() => setWord(w))} />
      <Chips
        label="Restriction"
        options={(['none', 'together', 'apart', 'first'] as Constraint[]).filter((k) => distinctLetters || (k !== 'together' && k !== 'apart')).map((k) => ({ id: k, label: constraintInfo(word, k).label }))}
        value={cc}
        onChange={(k) => change(() => setC(k))}
      />
      <div className="flex flex-wrap gap-1.5" aria-label="Positions">
        {tiles.map((_, pos) => (
          <button key={pos} className={`${slotBox} h-12 w-11 justify-center text-lg font-bold`} aria-label={`Position ${pos + 1}${placed[pos] !== undefined ? `: ${tiles[placed[pos]]}` : ''}`} onClick={() => setPlaced(placed.slice(0, pos))}>
            {placed[pos] !== undefined ? tiles[placed[pos]] : ''}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5" aria-label="Letter tiles">
        {tiles.map((t, i) => (
          <button key={i} className={`${btnGhost} h-11 w-11 px-0 text-lg font-bold ${placed.includes(i) ? 'invisible' : ''}`} onClick={() => place(i)} aria-label={`Place ${t}`}>
            {t}
          </button>
        ))}
      </div>
      {full && (
        <p className={info.pred(current) ? good : 'text-bad dark:text-bad-d'}>
          {current} {info.pred(current) ? 'fits the restriction.' : 'breaks the restriction.'}
        </p>
      )}
      <p className={`text-sm ${muted}`}>
        Tap tiles to fill positions left to right; tap a position to clear from there. Valid arrangements you build: {found.length} of {total.toLocaleString()}.
        {found.length > 0 && <span className="block break-all">{found.join(', ')}</span>}
      </p>
      <div className="overflow-x-auto">
        <Tex src={`${formula.tex} = ${total.toLocaleString()}`} display />
      </div>
      {formula.note && <p className="text-sm">{formula.note}</p>}
      {!distinctLetters && cc === 'none' && <p className={`text-sm ${muted}`}>Repeated letters: swapping identical tiles gives the same word, so divide by the factorial of each repeat count. Without dividing: {fact(word.length).toLocaleString()} orderings for {all.toLocaleString()} distinct words.</p>}
    </>
  );
}

/** Even 3-digit or 4-digit numbers from a digit set, no repetition. Answers are brute-forced. */
const SCENARIOS = [
  { id: 'even3', label: 'Even 3-digit numbers from 0–5, no repeats', digits: [0, 1, 2, 3, 4, 5], len: 3, ok: (d: number[]) => d[0] !== 0 && d[d.length - 1] % 2 === 0 },
  { id: 'big4', label: '4-digit numbers above 4000 from 1–6, no repeats', digits: [1, 2, 3, 4, 5, 6], len: 4, ok: (d: number[]) => d[0] >= 4 },
  { id: 'odd4', label: 'Odd 4-digit numbers from 0–6, no repeats', digits: [0, 1, 2, 3, 4, 5, 6], len: 4, ok: (d: number[]) => d[0] !== 0 && d[d.length - 1] % 2 === 1 },
];
function bruteDigits(digits: number[], len: number, ok: (d: number[]) => boolean): number {
  let count = 0;
  const go = (cur: number[], used: Set<number>) => {
    if (cur.length === len) {
      if (ok(cur)) count++;
      return;
    }
    for (const d of digits) if (!used.has(d)) go([...cur, d], new Set([...used, d]));
  };
  go([], new Set());
  return count;
}

type Case = { note: string; slots: number[] };

function CasesView() {
  const [sid, setSid] = useState(SCENARIOS[0].id);
  const sc = SCENARIOS.find((s) => s.id === sid)!;
  const fresh = (): Case[] => [{ note: '', slots: Array(sc.len).fill(1) }];
  const [cases, setCases] = useState<Case[]>(fresh);
  const target = useMemo(() => bruteDigits(sc.digits, sc.len, sc.ok), [sc]);
  const sum = cases.reduce((s, c) => s + c.slots.reduce((a, b) => a * b, 1), 0);
  const edit = (ci: number, si: number, d: number) =>
    setCases(cases.map((c, i) => (i === ci ? { ...c, slots: c.slots.map((v, j) => (j === si ? Math.max(0, Math.min(9, v + d)) : v)) } : c)));
  return (
    <>
      <Chips label="Problem" options={SCENARIOS.map((s) => ({ id: s.id, label: s.label }))} value={sid} onChange={(v) => (setSid(v), setCases([{ note: '', slots: Array(SCENARIOS.find((s) => s.id === v)!.len).fill(1) }]))} />
      <p className={`text-sm ${muted}`}>Split into cases where each slot's count is fixed (fill the most restricted slot first), set the choices per slot, and add the cases.</p>
      {cases.map((c, ci) => (
        <div key={ci} className="flex flex-col gap-1.5 rounded-lg border border-line p-2 dark:border-line-d">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Case {ci + 1}</span>
            <input className="min-w-0 flex-1 rounded border border-line bg-transparent px-2 py-1 text-sm dark:border-line-d" placeholder="e.g. last digit is 0" value={c.note} onChange={(e) => setCases(cases.map((x, i) => (i === ci ? { ...x, note: e.target.value } : x)))} aria-label={`Case ${ci + 1} description`} />
            {cases.length > 1 && (
              <button className={`px-1.5 text-sm ${muted}`} aria-label={`Remove case ${ci + 1}`} onClick={() => setCases(cases.filter((_, i) => i !== ci))}>
                ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {c.slots.map((v, si) => (
              <span key={si} className="flex items-center gap-1">
                {si > 0 && '×'}
                <span className={`${slotBox} min-w-0 px-0.5`}>
                  <button className="px-1 text-sm" aria-label={`Increase case ${ci + 1} slot ${si + 1}`} onClick={() => edit(ci, si, 1)}>
                    ▲
                  </button>
                  <span className="font-bold tabular-nums">{v}</span>
                  <button className="px-1 text-sm" aria-label={`Decrease case ${ci + 1} slot ${si + 1}`} onClick={() => edit(ci, si, -1)}>
                    ▼
                  </button>
                </span>
              </span>
            ))}
            <span className="ml-1">= {c.slots.reduce((a, b) => a * b, 1)}</span>
          </div>
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <button className={`${btnGhost} px-3 py-1.5 text-sm`} onClick={() => setCases([...cases, { note: '', slots: Array(sc.len).fill(1) }])}>
          + case
        </button>
        <span>
          Total <b>{cases.map((c) => c.slots.reduce((a, b) => a * b, 1)).join(' + ')} = {sum}</b>
        </span>
      </div>
      <p className={sum === target ? good : muted}>{sum === target ? `Correct: a computer listing all of them also finds ${target}.` : 'Not yet the true count. Check each slot: has a digit already been used, or ruled out by the restriction?'}</p>
    </>
  );
}

function PascalView() {
  const [sel, setSel] = useState<[number, number]>([4, 1]);
  const [n, k] = sel;
  const rows = Array.from({ length: 9 }, (_, i) => pascalRow(i));
  const termTex = (j: number) => {
    const c = nCr(n, j);
    const a = n - j === 0 ? '' : n - j === 1 ? 'a' : `a^{${n - j}}`;
    const b = j === 0 ? '' : j === 1 ? 'b' : `b^{${j}}`;
    return `${c === 1 && (a || b) ? '' : c}${a}${b}`;
  };
  return (
    <>
      <div className="overflow-x-auto py-1">
      <div className="mx-auto flex w-max flex-col items-center gap-1" role="grid" aria-label="Pascal's triangle">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-0.5" role="row">
            {row.map((v, j) => (
              <button
                key={j}
                role="gridcell"
                aria-label={`Row ${i}, entry ${j}: ${v}`}
                className={`min-w-8 rounded-full border border-line px-1 py-0.5 text-sm tabular-nums dark:border-line-d ${i === n && j === k ? chipOn : i === n ? 'bg-accent-soft dark:bg-accent-soft-d' : ''}`}
                onClick={() => setSel([i, j])}
              >
                {v}
              </button>
            ))}
          </div>
        ))}
      </div>
      </div>
      <p className="text-sm">
        Tapped: the row that begins <Tex src={n === 0 ? '1' : `1, ${n}`} />, entry {k + 1} from the left.
      </p>
      <div className="flex flex-col gap-1 overflow-x-auto">
        <Tex src={`{}_{${n}}C_{${k}} = ${nCr(n, k)}`} />
        <Tex src={`(a + b)^{${n}} = ${Array.from({ length: n + 1 }, (_, j) => (j === k ? `\\boxed{${termTex(j)}}` : termTex(j))).join(' + ')}`} />
      </div>
      <p className={`text-xs ${muted}`}>
        Each entry is the sum of the two above it. Row n (counting the single 1 at the top as row 0) gives the coefficients of <Tex src="(a + b)^n" />; entry k (from 0) multiplies <Tex src="a^{n-k}b^k" />. The rows sum to <Tex src="2^n" />.
      </p>
    </>
  );
}

function TermView({ preset }: { preset: CountingPreset }) {
  const t0 = preset.term ?? { a: 2, p: 1, b: -1, q: -1, n: 6 };
  const AB = [-3, -2, -1, 1, 2, 3];
  const PQ = [-2, -1, 0, 1, 2, 3];
  const [a, setA] = useState(t0.a);
  const [p, setP] = useState(t0.p);
  const [b, setB] = useState(t0.b);
  const [q, setQ] = useState(t0.q);
  const [n, setN] = useState(t0.n);
  const [k, setK] = useState(1);
  const kk = Math.min(k, n);
  const t = binomTerm(n, kk, a, p, b, q);
  const first = monoTex(a, p);
  const second = monoTex(b, q);
  const paren = (s: string, e: number) => (e === 0 ? '' : e === 1 ? `\\left(${s}\\right)` : `\\left(${s}\\right)^{${e}}`);
  const same = p === q;
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Pick label="a" values={AB} value={a} onChange={setA} />
          <Pick label="p" values={PQ} value={p} onChange={setP} />
          <Pick label="b" values={AB} value={b} onChange={setB} />
          <Pick label="q" values={PQ} value={q} onChange={setQ} />
        </div>
        <Slider label="n" n={8} index={n - 2} onChange={(i) => setN(i + 2)} show={n} />
        <Slider label="k" n={n + 1} index={kk} onChange={setK} show={kk} />
      </div>
      {same ? (
        <p className={`text-sm ${muted}`}>Pick p ≠ q so the two terms are different powers of x.</p>
      ) : (
        <div className="flex flex-col gap-1.5 overflow-x-auto">
          <Tex src={`${binTex(a, p, b, q)}^{${n}}`} display />
          <Tex src={`t_{k+1} = {}_{n}C_{k}\\,(\\text{first})^{n-k}(\\text{second})^{k}`} />
          <Tex src={`t_{${kk + 1}} = {}_{${n}}C_{${kk}}\\,${paren(first, n - kk) || '1'}\\,${paren(second, kk) || ''}`} />
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm">
            <span className={muted}>coefficient</span>
            <Tex src={`${nCr(n, kk)} \\cdot ${a < 0 ? `(${a})` : a}^{${n - kk}} \\cdot ${b < 0 ? `(${b})` : b}^{${kk}} = ${t.coef}`} />
            <span className={muted}>power of x</span>
            <Tex src={`\\underbrace{${p < 0 ? `(${p})` : p}(${n - kk})}_{\\text{first}} + \\underbrace{${q < 0 ? `(${q})` : q}(${kk})}_{\\text{second}} = ${t.pow}`} />
          </div>
          <p>
            Term: <Tex src={monoTex(t.coef, t.pow)} />
            {t.pow === 0 && <span className={good}> (the constant term)</span>}
          </p>
          <p className={`text-xs ${muted}`}>
            To find the term with a given power m, solve <Tex src={`${p}(${n} - k) + ${q < 0 ? `(${q})` : q}k = m`} /> for a whole number k from 0 to {n}; if there is none, no such term exists.
          </p>
        </div>
      )}
    </>
  );
}

function Pick({ label, values, value, onChange }: { label: string; values: number[]; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-1 text-sm">
      <span className="font-bold italic">{label}</span>
      <select className="rounded border border-line bg-card px-1 py-1 dark:border-line-d dark:bg-card-d" value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {values.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </label>
  );
}

