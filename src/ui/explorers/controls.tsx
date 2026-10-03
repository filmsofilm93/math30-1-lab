import type { ReactNode } from 'react';
import { chip } from '../styles';

/** Index slider over a list of values, with a readout. */
export function Slider({ label, n, index, onChange, show }: { label: string; n: number; index: number; onChange: (i: number) => void; show: ReactNode }) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-6 shrink-0 text-lg font-bold italic">{label}</span>
      <input type="range" min={0} max={n - 1} step={1} value={index} onChange={(e) => onChange(Number(e.target.value))} className="h-8 min-w-0 flex-1 accent-accent dark:accent-accent-d" aria-label={label} />
      <span className="w-16 shrink-0 text-right tabular-nums">{show}</span>
    </label>
  );
}

export const chipOn = 'border-accent bg-accent text-white dark:border-accent-d dark:bg-accent-d dark:text-paper-d';

/** One-of-many chip row. */
export function Chips<T extends string | number>({ label, options, value, onChange }: { label: string; options: { id: T; label: ReactNode }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={String(o.id)} className={`${chip} ${o.id === value ? chipOn : ''}`} onClick={() => onChange(o.id)} aria-pressed={o.id === value}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 shrink-0 accent-accent" />
      <span>{children}</span>
    </label>
  );
}
