import { AlertCircle, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  ScoreDistributionChart,
  type CategoryFilter,
  type ChartMode,
} from '../components/reports/ScoreDistributionChart';
import { ScoreDistributionTable } from '../components/reports/ScoreDistributionTable';
import { useScoreDistribution } from '../hooks/useScoreDistribution';

function ReportsSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="h-5 w-52 rounded bg-slate-200" />
        <div className="mt-4 flex gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-7 w-24 rounded bg-slate-100" />
          ))}
        </div>
        <div className="mt-5 h-96 rounded bg-slate-100" />
      </div>
      <div className="h-72 rounded-lg border border-slate-200 bg-white" />
    </div>
  );
}

export function ReportsPage() {
  const { data, isLoading, error, retry } = useScoreDistribution();
  const [chartMode, setChartMode] = useState<ChartMode>('grouped');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');

  const filteredSubjects = useMemo(() => {
    if (!data) return [];
    if (categoryFilter === 'ALL') return data.subjects;
    return data.subjects.filter((subject) => subject.category === categoryFilter);
  }, [data, categoryFilter]);

  if (isLoading) {
    return <ReportsSkeleton />;
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
            <h2 className="text-sm font-semibold">Unable to Load Report</h2>
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

  return (
    <div className="space-y-5">
      <ScoreDistributionChart
        subjects={filteredSubjects}
        chartMode={chartMode}
        categoryFilter={categoryFilter}
        onChartModeChange={setChartMode}
        onCategoryFilterChange={setCategoryFilter}
      />
      <ScoreDistributionTable subjects={filteredSubjects} />
    </div>
  );
}
