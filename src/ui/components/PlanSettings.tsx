import { unitTitle } from '../../content';
import type { Settings } from '../../db/db';
import { saveSettings } from '../data';
import { btnGhost, card, muted } from '../styles';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const input = 'rounded-lg border border-line bg-paper px-2 py-1 dark:border-line-d dark:bg-paper-d';

/** Exam date, weekly hours, study days, unit order and current unit. Used by setup and settings. */
export function PlanSettings({ settings }: { settings: Settings }) {
  const save = (patch: Partial<Settings>) => saveSettings(settings, patch);
  const hours = settings.weeklyHours ?? 6;
  const days = settings.studyDays ?? [];
  const current = settings.currentUnit ?? settings.unitOrder[0];
  const row = `${card} flex flex-col gap-2 p-4`;

  function move(i: number, d: -1 | 1) {
    const order = settings.unitOrder.slice();
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    save({ unitOrder: order });
  }

  return (
    <>
      <section className={row}>
        <label className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-bold">Diploma exam date</span>
          <input type="date" value={settings.examDate} onChange={(e) => e.target.value && save({ examDate: e.target.value })} className={input} />
        </label>
        <p className={`text-sm ${muted}`}>The 2026–27 schedule lists Math 30-1 on Wednesday 20 January 2027, 9:00–12:00. Reviews are never scheduled past this date.</p>
      </section>

      <section className={row}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-bold">Study hours per week</span>
          <div className="flex items-center gap-2">
            <button className={btnGhost} aria-label="Fewer hours" onClick={() => save({ weeklyHours: Math.max(1, hours - 1) })}>
              −
            </button>
            <input type="number" inputMode="numeric" min={1} max={40} value={hours} aria-label="Study hours per week" onChange={(e) => +e.target.value > 0 && save({ weeklyHours: Math.min(40, +e.target.value) })} className={`${input} w-16 text-center tabular-nums`} />
            <button className={btnGhost} aria-label="More hours" onClick={() => save({ weeklyHours: Math.min(40, hours + 1) })}>
              +
            </button>
          </div>
        </div>
        <p className={`text-sm ${muted}`}>Be realistic: the plan assumes you manage about 80% of this.</p>
      </section>

      <section className={row}>
        <span className="font-bold">Days you can study</span>
        <div className="grid grid-cols-7 gap-1" role="group" aria-label="Study days">
          {DAYS.map((d, i) => {
            const on = days.includes(i);
            return (
              <button key={d} aria-pressed={on} onClick={() => save({ studyDays: on ? days.filter((x) => x !== i) : [...days, i].sort() })} className={`min-h-11 rounded-lg border text-sm font-bold ${on ? 'border-accent bg-accent-soft text-accent dark:border-accent-d dark:bg-accent-soft-d dark:text-accent-d' : `border-line dark:border-line-d ${muted}`}`}>
                {d}
              </button>
            );
          })}
        </div>
        {days.length === 0 && <p className="text-sm text-warn dark:text-warn-d">Pick at least one day.</p>}
      </section>

      <section className={row}>
        <span className="font-bold">Unit order and where you are now</span>
        <p className={`text-sm ${muted}`}>Match your course's order and tap the unit you are on. Units above it are treated as catch-up.</p>
        <ol className="flex flex-col divide-y divide-line dark:divide-line-d">
          {settings.unitOrder.map((u, i) => (
            <li key={u} className="flex items-center gap-2 py-1.5">
              <label className="flex min-w-0 flex-1 items-center gap-2">
                <input type="radio" name="current-unit" checked={current === u} onChange={() => save({ currentUnit: u })} className="h-5 w-5 shrink-0 accent-[var(--color-accent)]" />
                <span className="min-w-0">
                  {unitTitle(u)}
                  {current === u && <span className={`ml-1 text-xs font-bold ${muted}`}>(now)</span>}
                </span>
              </label>
              <button className={`${btnGhost} px-3`} aria-label={`Move ${unitTitle(u)} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                ↑
              </button>
              <button className={`${btnGhost} px-3`} aria-label={`Move ${unitTitle(u)} down`} disabled={i === settings.unitOrder.length - 1} onClick={() => move(i, 1)}>
                ↓
              </button>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
