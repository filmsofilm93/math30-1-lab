import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { db, DEFAULT_SETTINGS } from '../db/db';
import { NodePage } from './learn/NodePage';
import { ErrorsPage } from './pages/ErrorsPage';
import { HomePage } from './pages/HomePage';
import { ReviewPage } from './pages/ReviewPage';
import { SettingsPage } from './pages/SettingsPage';
import { muted } from './styles';

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
  { href: '#/', label: 'Skills', key: '1' },
  { href: '#/review', label: 'Review', key: '2' },
  { href: '#/errors', label: 'Weak spots', key: '3' },
  { href: '#/settings', label: 'Settings', key: '4', short: '⚙' },
];

export function App() {
  useTheme();
  const hash = useHash();
  const path = hash.replace(/^#/, '');
  const due = useLiveQuery(() => db.nodes.filter((n) => !!n.card && n.card.due <= Date.now()).count(), [], 0);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [path]);

  // Alt+1..4 switches sections on desktop.
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

  let page;
  if (path.startsWith('/node/')) page = <NodePage nodeId={decodeURIComponent(path.slice(6))} />;
  else if (path.startsWith('/review')) page = <ReviewPage />;
  else if (path.startsWith('/errors')) page = <ErrorsPage />;
  else if (path.startsWith('/settings')) page = <SettingsPage />;
  else page = <HomePage />;

  const active = (href: string) => (href === '#/' ? path === '/' || path === '' || path.startsWith('/node') : hash.startsWith(href));

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur dark:border-line-d dark:bg-paper-d/95">
        <div className="flex items-center justify-between gap-3 py-2">
          <a href="#/" className="font-bold tracking-tight whitespace-nowrap">
            <span className="hidden sm:inline">Math </span>30-1<span className="hidden sm:inline"> Lab</span>
          </a>
          <nav className="flex gap-0.5 text-sm whitespace-nowrap sm:gap-1" aria-label="Sections">
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
      <main className="flex-1 px-4 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">{page}</main>
    </div>
  );
}
