import { AlertCircle, RefreshCw } from 'lucide-react';
import { TopGroupATable } from '../components/leaderboard/TopGroupATable';
import { useTopGroupA } from '../hooks/useTopGroupA';

function LeaderboardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-slate-200 bg-white p-5">
      <div className="h-5 w-56 rounded bg-slate-200" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="h-9 rounded bg-slate-100" />
        ))}
      </div>
    </div>
  );
}

export function LeaderboardPage() {
  const { data, isLoading, error, retry } = useTopGroupA(10);

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  if (error) {
    return (
      <section
        role="alert"
        className="flex items-start justify-between gap-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-900"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <div>
            <h2 className="text-sm font-semibold">Unable to Load Leaderboard</h2>
            <p className="mt-0.5 text-sm text-rose-700">{error}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={retry}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-100"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      </section>
    );
  }

  if (!data) return null;

  return <TopGroupATable students={data.students} />;
}
