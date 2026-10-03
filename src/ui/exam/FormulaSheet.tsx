import { useEffect } from 'react';
import { FORMULA_SHEET } from '../../content/exam';
import { Tex } from '../components/Rich';
import { btnGhost, card, h2, muted } from '../styles';

/** The official Mathematics 30–1 Formula Sheet: everything on it, nothing more. */
export function FormulaSheet() {
  return (
    <div className="flex flex-col gap-4">
      <p className={`text-sm ${muted}`}>Mathematics 30–1 Formula Sheet. The diploma provides exactly this sheet; there is no unit circle on it.</p>
      {FORMULA_SHEET.map((s, i) => (
        <section key={i} className="flex flex-col gap-2">
          {s.title && <h2 className={`${h2} border-b border-line pb-1 dark:border-line-d`}>{s.title}</h2>}
          {s.groups.map((g, j) => (
            <div key={j} className="flex flex-col gap-1.5">
              {g.heading && <h3 className="text-sm font-bold italic">{g.heading}</h3>}
              {g.lines.map((l, k) => (
                <div key={k} className="overflow-x-auto py-0.5" tabIndex={0}>
                  <Tex src={l} />
                </div>
              ))}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

/** Formula sheet as an overlay, for use during a mock. */
export function FormulaOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const on = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-30 flex justify-center bg-black/40 p-2 sm:p-6" role="dialog" aria-modal="true" aria-label="Formula sheet" onClick={onClose}>
      <div className={`${card} flex max-h-full w-full max-w-2xl flex-col overflow-hidden`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-4 py-2 dark:border-line-d">
          <span className="font-bold">Formula sheet</span>
          <button className={btnGhost} onClick={onClose} autoFocus>
            Close
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-3">
          <FormulaSheet />
        </div>
      </div>
    </div>
  );
}
