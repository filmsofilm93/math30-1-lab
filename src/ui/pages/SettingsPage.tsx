import { useLiveQuery } from 'dexie-react-hooks';
import { useRef, useState } from 'react';
import { NODE } from '../../content';
import { PlanSettings } from '../components/PlanSettings';
import { saveSettings, useSettings } from '../data';
import { db, DEFAULT_SETTINGS, exportAll, importAll, type Report, type Settings } from '../../db/db';
import { btnGhost, card, h1, h2, muted } from '../styles';

export function SettingsPage() {
  const settings = useSettings() ?? { ...DEFAULT_SETTINGS, stored: false };
  const reports = useLiveQuery(() => db.reports.orderBy('at').reverse().toArray(), [], [] as Report[]);
  const [msg, setMsg] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const save = (patch: Partial<Settings>) => saveSettings(settings, patch);

  async function doExport() {
    const blob = new Blob([await exportAll()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `math30-1-lab-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg('Backup downloaded.');
  }

  async function doImport(f: File) {
    try {
      await importAll(await f.text());
      setMsg('Backup restored.');
    } catch (e) {
      setMsg(`Import failed: ${(e as Error).message}`);
    }
  }

  async function doReset() {
    await db.transaction('rw', [db.attempts, db.nodes, db.settings, db.reports, db.diagnostic, db.days], () => Promise.all([db.attempts.clear(), db.nodes.clear(), db.settings.clear(), db.reports.clear(), db.diagnostic.clear(), db.days.clear()]));
    setConfirmReset(false);
    setMsg('All progress erased.');
  }

  const row = `${card} flex flex-col gap-2 p-4`;
  return (
    <div className="flex flex-col gap-4">
      <h1 className={h1}>Settings</h1>
      {msg && (
        <p role="status" className="rounded-lg bg-accent-soft px-3 py-2 text-sm dark:bg-accent-soft-d">
          {msg}
        </p>
      )}

      <section className={row}>
        <span className="font-bold">Theme</span>
        <div className="flex gap-2">
          {(['system', 'light', 'dark'] as const).map((t) => (
            <button key={t} className={`${btnGhost} ${settings.theme === t ? 'bg-accent-soft text-accent dark:bg-accent-soft-d dark:text-accent-d' : ''}`} aria-pressed={settings.theme === t} onClick={() => save({ theme: t })}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <PlanSettings settings={settings} />
      <a className={`${btnGhost} self-start`} href="#/diagnostic">
        Retake the prerequisite check
      </a>

      <section className={row}>
        <span className="font-bold">Backup</span>
        <p className={`text-sm ${muted}`}>Progress lives only in this browser. Export a backup to move devices; importing replaces everything here.</p>
        <div className="flex flex-wrap gap-2">
          <button className={btnGhost} onClick={doExport}>
            Export JSON
          </button>
          <button className={btnGhost} onClick={() => fileRef.current?.click()}>
            Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) doImport(f);
              e.target.value = '';
            }}
          />
        </div>
      </section>

      <section className={row}>
        <h2 className={h2}>Reported problems</h2>
        {reports.length === 0 ? (
          <p className={`text-sm ${muted}`}>None. Use “Report a problem” under any question; the item id and seed are saved here so it can be regenerated exactly.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-line text-sm dark:divide-line-d">
            {reports.map((r) => (
              <li key={r.id} className="flex flex-col gap-0.5 py-2">
                <span className="font-mono text-xs break-all">{r.itemId}</span>
                <span className={muted}>
                  {NODE.get(r.nodeId)?.title} · {new Date(r.at).toLocaleString('en-CA')}
                </span>
                {r.note && <span>{r.note}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={row}>
        <span className="font-bold">Reset</span>
        {confirmReset ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm">Erase all attempts, mastery and settings? This cannot be undone.</span>
            <button className={`${btnGhost} text-bad dark:text-bad-d`} onClick={doReset}>
              Erase everything
            </button>
            <button className={btnGhost} onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className={`${btnGhost} self-start`} onClick={() => setConfirmReset(true)}>
            Reset progress…
          </button>
        )}
      </section>

      <p className={`text-xs ${muted}`}>Keyboard: Alt+1–5 switch sections · 1–4 pick a choice · S/U/G submit as sure/unsure/guess · H hint · Enter or N next.</p>
    </div>
  );
}
