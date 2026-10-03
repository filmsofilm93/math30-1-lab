import { useRef, useState } from 'react';
import { NR_BOXES } from '../../engine/nr';

/** Four numerical-response boxes, filled from the left. Only digits and a decimal point go in; a printed sign sits before them. */
export function NRBoxes({ value, onChange, negative = false, disabled = false, onEnter, autoFocus = false, label = 'Numerical response' }: { value: string; onChange: (v: string) => void; negative?: boolean; disabled?: boolean; onEnter?: () => void; autoFocus?: boolean; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [focus, setFocus] = useState(false);
  const chars = value.slice(0, NR_BOXES).split('');
  return (
    <div className="flex items-center gap-2">
      {negative && (
        <span className="text-2xl font-bold" aria-label="printed negative sign">
          −
        </span>
      )}
      <div className="relative inline-flex gap-1.5" onClick={() => ref.current?.focus()}>
        {Array.from({ length: NR_BOXES }, (_, i) => {
          const active = focus && !disabled && i === Math.min(chars.length, NR_BOXES - 1);
          return (
            <span key={i} aria-hidden className={`flex h-12 w-11 items-center justify-center rounded-lg border-2 font-mono text-2xl tabular-nums ${active ? 'border-accent dark:border-accent-d' : 'border-line dark:border-line-d'} ${disabled ? 'opacity-70' : ''}`}>
              {chars[i] ?? ''}
            </span>
          );
        })}
        <input
          ref={ref}
          aria-label={label}
          inputMode="decimal"
          autoComplete="off"
          autoFocus={autoFocus}
          disabled={disabled}
          value={value}
          maxLength={NR_BOXES}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.\-]/g, '').slice(0, NR_BOXES))}
          onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
}
