import { ArrowRight, BarChart3, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-brand-navy">
          Overview & Top 10 Group A00 Leaderboard
        </h2>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link
            to="/search"
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-brand-yellow px-4 py-2 text-sm font-semibold text-brand-navy transition hover:brightness-95"
          >
            <Search className="h-4 w-4" />
            Search Scores
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/reports"
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-brand-navy transition hover:border-brand-sky hover:bg-brand-sky/10"
          >
            <BarChart3 className="h-4 w-4" />
            Reports
          </Link>
        </div>
      </section>
    </div>
  );
}
