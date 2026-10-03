import { NODE, unitTitle } from '../../content';
import { localDay } from '../../db/db';
import { blockOn } from '../../engine/planner';
import { planFor, useLearner, useSettings } from '../data';
import { btnGhost, card, h1, h2, muted } from '../styles';

export const fmtDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });

export function PlanPage() {
  const settings = useSettings();
  const learner = useLearner();
  if (!settings || !learner) return null;
  const today = localDay();
  const plan = planFor(settings, learner.states, learner.diag, today);
  const now = blockOn(plan, today);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <a href="#/" className={`text-sm ${muted} hover:underline`}>
          ← Today
        </a>
        <h1 className={h1}>Plan to the diploma</h1>
        <p className={muted}>
          {plan.daysLeft} days left · {settings.weeklyHours} h a week on {plan.learnStudyDays + plan.reviewStudyDays} study days · review starts {fmtDate(plan.reviewStart)}
        </p>
      </header>

      {plan.fits && (
        <section className={`${card} flex flex-col gap-1 p-4`}>
          <p className="font-bold">The plan fits.</p>
          <p className="text-sm">
            About {Math.round(plan.neededHours)} h of learning needed; about {Math.round(plan.availableHours)} h available before review ({plan.learnStudyDays} study days × {plan.hoursPerDay} h × 80%).
          </p>
        </section>
      )}

      {plan.warnings.map((w) => (
        <p key={w} className="rounded-xl border border-warn bg-warn-soft p-4 text-sm dark:border-warn-d dark:bg-warn-soft-d">
          {w}
        </p>
      ))}

      <section className="flex flex-col gap-2">
        <h2 className={h2}>Timeline</h2>
        <ol className="flex flex-col gap-2">
          {plan.blocks.map((b) => {
            const current = b === now;
            return (
              <li key={b.unit + b.start} className={`${card} flex flex-col gap-1 p-4 ${current ? 'ring-2 ring-accent dark:ring-accent-d' : ''}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="font-bold">
                    {b.kind === 'review' ? 'Mixed review and mock exams' : unitTitle(b.unit)}
                    {b.kind === 'catch-up' && <span className={`ml-1 text-xs ${muted}`}>(catch-up)</span>}
                    {current && <span className="ml-1 text-xs text-accent dark:text-accent-d">(now)</span>}
                  </span>
                  <span className={`text-sm tabular-nums ${muted}`}>
                    {fmtDate(b.start)} – {fmtDate(b.end)}
                  </span>
                </div>
                {b.kind === 'review' ? (
                  <p className="text-sm">
                    Mock exams: {plan.mockDates.map(fmtDate).join(', ') || 'none fit'}. Between mocks: mixed questions from every unit, weighted to your weakest skills. Full mock exams arrive in M6.
                  </p>
                ) : (
                  <p className="text-sm">
                    {b.skills} skill{b.skills === 1 ? '' : 's'} to learn · about {Math.round(b.hours)} h
                  </p>
                )}
                {b.repair.length > 0 && (
                  <p className="text-sm">
                    Repair first:{' '}
                    {b.repair.map((id, i) => (
                      <span key={id}>
                        {i > 0 && ', '}
                        <a className="text-accent hover:underline dark:text-accent-d" href={`#/repair/${id}`}>
                          {NODE.get(id)?.title}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <details className={`${card} p-4 text-sm`}>
        <summary className="cursor-pointer font-bold">How the estimate works</summary>
        <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
          <li>The last 3 weeks are held back for mixed review and at least 3 mock exams.</li>
          <li>Each unmastered skill gets 1 to 1.75 h (more for skills that appear on most exams and known weak spots), scaled by the unit's share of the exam. Unit shares are my estimate from the official strand ranges.</li>
          <li>Units before your current one count as catch-up at 60% of the time, since you have seen them in class.</li>
          <li>Prerequisite repairs: 1 h for a weak skill, 30 min for a shaky one, scheduled before the first unit that needs it.</li>
          <li>Only 80% of your weekly hours count, leaving room for missed days and daily reviews.</li>
        </ul>
      </details>

      <a className={`${btnGhost} self-start`} href="#/settings">
        Change hours, days or units
      </a>
    </div>
  );
}
