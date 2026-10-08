import { useState } from 'react';
import type { LessonCard } from '../../content/lessons/types';
import { Rich } from '../components/Rich';
import { btnGhost, btnPrimary, card, muted } from '../styles';

/** A lesson as small cards: one idea, a tiny example, a quick check. One card per screen. */
export function CardDeck({ cards, onDone }: { cards: LessonCard[]; onDone: () => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const c = cards[i];
  const last = i === cards.length - 1;
  const answered = !c.check || picked !== null;
  // Show options in a fixed shuffled order, so the answer is not always first.
  const order = c.check ? shuffled(c.check.options.length, i * 7 + c.say.length) : [];

  const move = (to: number) => {
    setI(to);
    setPicked(null);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1" aria-hidden>
          {cards.map((_, k) => (
            <span key={k} className={`h-1.5 flex-1 rounded-full ${k <= i ? 'bg-accent dark:bg-accent-d' : 'bg-line dark:bg-line-d'}`} />
          ))}
        </div>
        <span className={`text-sm tabular-nums ${muted}`}>
          Step {i + 1} of {cards.length}
        </span>
      </div>

      <section key={i} className={`${card} flex flex-col gap-5 p-5`} aria-live="polite">
        <p className="text-xl leading-relaxed">
          <Rich text={c.say} />
        </p>

        {c.example && (
          <div className="flex flex-col gap-2 rounded-lg bg-accent-soft px-4 py-3 dark:bg-accent-soft-d">
            <p className={`text-sm font-bold uppercase tracking-wide ${muted}`}>Example</p>
            {c.example.map((line, k) => (
              <p key={k} className="text-lg leading-relaxed">
                <Rich text={line} />
              </p>
            ))}
          </div>
        )}

        {c.check && (
          <div className="flex flex-col gap-3">
            <p className="text-lg font-bold leading-relaxed">
              <Rich text={c.check.q} />
            </p>
            <div className="flex flex-col gap-2">
              {order.map((k) => {
                const o = c.check!.options[k];
                const state = picked === null ? '' : k === c.check!.answer ? 'border-good bg-good/10 dark:border-good-d' : k === picked ? 'border-bad bg-bad/10 dark:border-bad-d' : 'opacity-60';
                return (
                  <button
                    key={k}
                    disabled={picked !== null}
                    onClick={() => setPicked(k)}
                    className={`min-h-12 rounded-lg border border-line px-4 py-2 text-left text-lg dark:border-line-d ${state} ${picked === null ? 'hover:bg-accent-soft dark:hover:bg-accent-soft-d' : ''}`}
                  >
                    <Rich text={o} />
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <p className={`text-lg leading-relaxed ${picked === c.check.answer ? 'text-good dark:text-good-d' : 'text-bad dark:text-bad-d'}`}>
                <span className="font-bold">{picked === c.check.answer ? 'Correct. ' : 'Not quite. '}</span>
                <span className="text-ink dark:text-ink-d">
                  <Rich text={c.check.why} />
                </span>
              </p>
            )}
          </div>
        )}
      </section>

      <div className="flex gap-3">
        {i > 0 && (
          <button className={btnGhost} onClick={() => move(i - 1)}>
            Back
          </button>
        )}
        <button className={`${btnPrimary} flex-1 text-lg`} disabled={!answered} onClick={() => (last ? onDone() : move(i + 1))}>
          {last ? 'Finish' : 'Next'}
        </button>
      </div>
      {!answered && <p className={`text-center text-sm ${muted}`}>Pick an answer to go on.</p>}
    </div>
  );
}

function shuffled(n: number, seed: number): number[] {
  const a = Array.from({ length: n }, (_, k) => k);
  let x = seed + 1;
  for (let k = n - 1; k > 0; k--) {
    x = (x * 1103515245 + 12345) % 2147483648;
    const j = x % (k + 1);
    [a[k], a[j]] = [a[j], a[k]];
  }
  return a;
}
