import { useLiveQuery } from 'dexie-react-hooks';
import { lazy, Suspense, useEffect, useState } from 'react';
import { db, DEFAULT_SETTINGS } from '../db/db';
import { addStudySeconds } from '../db/db';
import { useSettings } from './data';
import { TodayPage } from './plan/TodayPage';
import { muted } from './styles';

// Pages load on first visit so the app opens fast; the service worker caches every chunk for offline use.
const NodePage = lazy(() => import('./learn/NodePage').then((m) => ({ default: m.NodePage })));
const RepairPage = lazy(() => import('./learn/RepairPage').then((m) => ({ default: m.RepairPage })));
const ErrorsPage = lazy(() => import('./pages/ErrorsPage').then((m) => ({ default: m.ErrorsPage })));
const ReviewPage = lazy(() => import('./pages/ReviewPage').then((m) => ({ default: m.ReviewPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const SkillsPage = lazy(() => import('./pages/SkillsPage').then((m) => ({ default: m.SkillsPage })));
const DiagnosticPage = lazy(() => import('./plan/DiagnosticPage').then((m) => ({ default: m.DiagnosticPage })));
const PlanPage = lazy(() => import('./plan/PlanPage').then((m) => ({ default: m.PlanPage })));
const ProgressPage = lazy(() => import('./plan/ProgressPage').then((m) => ({ default: m.ProgressPage })));
const SetupPage = lazy(() => import('./plan/SetupPage').then((m) => ({ default: m.SetupPage })));
const MockPage = lazy(() => import('./exam/MockPage').then((m) => ({ default: m.MockPage })));
const exam = () => import('./exam/ExamHub');
const ExamHub = lazy(() => exam().then((m) => ({ default: m.ExamHub })));
const FormulaPage = lazy(() => exam().then((m) => ({ default: m.FormulaPage })));
const WordsPage = lazy(() => exam().then((m) => ({ default: m.WordsPage })));
const WrPracticePage = lazy(() => exam().then((m) => ({ default: m.WrPracticePage })));

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash || '#/');
  useEffect(() => {
    const on = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
}

function useTheme() {
  const settings = useLiveQuery(() => db.settings.get('main'));
  const theme = settings?.theme ?? DEFAULT_SETTINGS.theme;
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && mq.matches));
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);
}

const NAV = [
  { href: '#/', label: 'Today', key: '1' },
  { href: '#/skills', label: 'Skills', key: '2' },
  { href: '#/review', label: 'Review', key: '3' },
  { href: '#/exam', label: 'Exam', key: '4' },
  { href: '#/progress', label: 'Progress', key: '5' },
  { href: '#/settings', label: 'Settings', key: '6', short: '⚙' },
];

const BEAT = 15;
const IDLE_MS = 90_000;

/** Counts active study time: every 15 s while the tab is visible and you interacted in the last 90 s. */
function useStudyClock() {
  useEffect(() => {
    let last = Date.now();
    const touch = () => (last = Date.now());
    const events = ['pointerdown', 'keydown', 'input', 'scroll'] as const;
    events.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - last < IDLE_MS) addStudySeconds(BEAT);
    }, BEAT * 1000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, touch));
      window.clearInterval(id);
    };
  }, []);
}

export function App() {
  useTheme();
  useStudyClock();
  const hash = useHash();
  const path = hash.replace(/^#/, '');
  const settings = useSettings();
  const needsSetup = settings !== undefined && !settings.setupDone;
  const due = useLiveQuery(() => db.nodes.filter((n) => !!n.card && n.card.due <= Date.now()).count(), [], 0);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [path]);

  // Alt+1..6 switches sections on desktop.
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      const n = NAV.find((x) => x.key === e.key);
      if (n) {
        window.location.hash = n.href;
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, []);

  const [route, query] = path.split('?');
  const params = new URLSearchParams(query);
  let page;
  if (route.startsWith('/node/')) page = <NodePage nodeId={decodeURIComponent(route.slice(6))} />;
  else if (route.startsWith('/repair/')) page = <RepairPage key={route} nodeId={decodeURIComponent(route.slice(8))} from={params.get('from') ?? undefined} />;
  else if (route.startsWith('/skills')) page = <SkillsPage />;
  else if (route.startsWith('/review')) page = <ReviewPage />;
  else if (route.startsWith('/exam/mock/')) page = <MockPage key={route} id={Number(route.slice(11))} />;
  else if (route.startsWith('/exam/wr')) page = <WrPracticePage />;
  else if (route.startsWith('/exam/words')) page = <WordsPage />;
  else if (route.startsWith('/exam/formulas')) page = <FormulaPage />;
  else if (route.startsWith('/exam')) page = <ExamHub />;
  else if (route.startsWith('/errors')) page = <ErrorsPage />;
  else if (route.startsWith('/progress')) page = <ProgressPage />;
  else if (route.startsWith('/settings')) page = <SettingsPage />;
  else if (route.startsWith('/setup')) page = <SetupPage />;
  else if (route.startsWith('/diagnostic')) page = <DiagnosticPage />;
  else if (route.startsWith('/plan')) page = <PlanPage />;
  else if (settings === undefined) page = null;
  else if (needsSetup) page = <SetupPage />;
  else page = <TodayPage />;

  const active = (href: string) =>
    href === '#/' ? route === '/' || route === '' || route.startsWith('/plan') : href === '#/skills' ? route.startsWith('/skills') || route.startsWith('/node') || route.startsWith('/repair') : href === '#/progress' ? route.startsWith('/progress') || route.startsWith('/errors') : hash.startsWith(href);

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur dark:border-line-d dark:bg-paper-d/95">
        <div className="flex items-center justify-between gap-3 py-2">
          <a href="#/" className="hidden font-bold tracking-tight whitespace-nowrap min-[420px]:inline">
            <span className="hidden sm:inline">Math </span>30-1<span className="hidden sm:inline"> Lab</span>
          </a>
          <nav className="flex flex-1 justify-between gap-0.5 text-sm whitespace-nowrap min-[420px]:flex-none sm:gap-1" aria-label="Sections">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} aria-current={active(n.href) ? 'page' : undefined} className={`relative rounded-lg px-1.5 py-1.5 font-bold sm:px-2 ${active(n.href) ? 'bg-accent-soft text-accent dark:bg-accent-soft-d dark:text-accent-d' : muted}`}>
                {n.short ? (
                  <>
                    <span className="sm:hidden" aria-label={n.label}>
                      {n.short}
                    </span>
                    <span className="hidden sm:inline">{n.label}</span>
                  </>
                ) : (
                  n.label
                )}
                {n.href === '#/review' && due > 0 && <span className="ml-1 rounded-full bg-accent px-1.5 text-xs text-white dark:bg-accent-d dark:text-paper-d">{due}</span>}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 px-4 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <Suspense fallback={<p className={`py-8 text-center ${muted}`}>Loading…</p>}>{page}</Suspense>
      </main>
    </div>
  );
}
