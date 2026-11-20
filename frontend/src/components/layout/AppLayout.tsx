import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

interface NavItem {
  to: string;
  label: string;
  iconSrc: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/search', label: 'Search Scores', iconSrc: '/icons/search.png' },
  { to: '/reports', label: 'Reports', iconSrc: '/icons/report.png' },
  { to: '/leaderboard', label: 'Leaderboard', iconSrc: '/icons/leaderboard.png' },
];

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderNavLinks = (onNavigate?: () => void) => (
    <nav className="space-y-1 px-3 py-4" aria-label="Main navigation">
      {NAV_ITEMS.map(({ to, label, iconSrc }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            [
              'group flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-yellow text-brand-navy font-semibold'
                : 'text-slate-200 hover:bg-brand-sky/15 hover:text-white',
            ].join(' ')
          }
        >
          <img src={iconSrc} alt="" aria-hidden="true" className="h-5 w-5 shrink-0 object-contain" />
          <span className="truncate">{label}</span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-brand-navy bg-brand-navy text-white lg:flex">
        <div className="flex h-14 items-center gap-2.5 border-b border-white/10 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-yellow">
            <img
              src="/icons/graduation-cap.png"
              alt=""
              aria-hidden="true"
              className="h-5 w-5 object-contain"
            />
          </div>
          <span className="text-base font-bold tracking-tight text-white">G-Scores</span>
        </div>

        <div className="flex-1 overflow-y-auto">{renderNavLinks()}</div>

        <div className="border-t border-white/10 px-4 py-3 text-xs text-slate-300/80">
          <div>THPT 2024 · 1,061,605 records</div>
          <div className="mt-1 text-[11px] text-slate-400">
            Icons by{' '}
            <a
              href="https://icons8.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-brand-yellow"
            >
              Icons8
            </a>
          </div>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-brand-navy/60"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-brand-navy text-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-yellow">
                  <img
                    src="/icons/graduation-cap.png"
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 object-contain"
                  />
                </div>
                <span className="text-base font-bold">G-Scores</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer rounded-md p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {renderNavLinks(() => setMobileMenuOpen(false))}
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-col lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="cursor-pointer rounded-md border border-slate-200 p-1.5 text-brand-navy hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-yellow">
                <img
                  src="/icons/graduation-cap.png"
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4 object-contain"
                />
              </div>
              <span className="font-bold text-brand-navy">G-Scores</span>
            </div>
            <span className="hidden text-sm font-medium text-brand-navy lg:block">
              National High School Exam 2024
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
