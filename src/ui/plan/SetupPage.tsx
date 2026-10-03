import { useLiveQuery } from 'dexie-react-hooks';
import { db, DEFAULT_SETTINGS } from '../../db/db';
import { PlanSettings } from '../components/PlanSettings';
import { planFor, saveSettings, useLearner, useSettings } from '../data';
import { btnGhost, btnPrimary, card, h1, muted } from '../styles';

export function SetupPage() {
  const settings = useSettings();
  const learner = useLearner();
  const diagDone = useLiveQuery(() => db.diagnostic.count(), [], 0) > 0;
  if (!settings || !learner) return null;
  const s = settings.stored ? settings : { ...DEFAULT_SETTINGS, stored: false };
  const plan = planFor(s, learner.states, learner.diag);

  async function finish(to: string) {
    await saveSettings(s, { setupDone: true });
    window.location.hash = to;
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className={h1}>Set up your plan</h1>
        <p className={muted}>Five questions. The app works backward from your exam date to a weekly plan. You can change any of this later in Settings.</p>
      </header>
      <PlanSettings settings={s} />
      <section className={`${card} flex flex-col gap-1 p-4`} aria-live="polite">
        <p className="font-bold">
          {plan.fits ? 'This fits.' : 'This does not fit yet.'} About {Math.round(plan.neededHours)} h of learning needed, about {Math.round(plan.availableHours)} h available before the final 3-week review.
        </p>
        {!plan.fits && plan.hoursToFit !== Infinity && <p className={`text-sm ${muted}`}>About {plan.hoursToFit} h a week would fit. The prerequisite check below can lower the estimate if your foundations are solid, or raise it if they need repair.</p>}
      </section>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button className={btnPrimary} disabled={!(s.studyDays ?? []).length} onClick={() => finish(diagDone ? '#/' : '#/diagnostic')}>
          {diagDone ? 'Save' : 'Save and take the 10-minute prerequisite check'}
        </button>
        {!diagDone && (
          <button className={btnGhost} disabled={!(s.studyDays ?? []).length} onClick={() => finish('#/')}>
            Skip the check for now
          </button>
        )}
      </div>
    </div>
  );
}
