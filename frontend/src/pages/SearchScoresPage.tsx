import { AlertCircle, FileSearch } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ScoreResultView } from '../components/scores/ScoreResultView';
import { ScoreSearchForm } from '../components/scores/ScoreSearchForm';
import { useScoreSearch } from '../hooks/useScoreSearch';

function ScoreResultSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-24 rounded-lg bg-slate-200" />
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="h-5 w-36 rounded bg-slate-200" />
        <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-28 rounded-md bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SearchScoresPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sbdFromUrl = searchParams.get('sbd') ?? '';

  const { data, isLoading, showLoadingIndicator, error, search } = useScoreSearch(sbdFromUrl);

  const handleSearch = (sbd: string) => {
    if (sbd === sbdFromUrl) {
      void search(sbd);
      return;
    }
    setSearchParams({ sbd }, { replace: true });
  };

  return (
    <div className="space-y-5">
      <ScoreSearchForm
        initialValue={sbdFromUrl}
        isLoading={showLoadingIndicator}
        onSubmit={handleSearch}
      />

      {showLoadingIndicator && !data && <ScoreResultSkeleton />}

      {!isLoading && error && (
        <section
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-900"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <div>
            <h3 className="text-sm font-semibold">
              {error.code === 'SCORE_NOT_FOUND' ? 'Registration Number Not Found' : 'Lookup Error'}
            </h3>
            <p className="mt-0.5 text-sm text-rose-700">{error.message}</p>
          </div>
        </section>
      )}

      {data && !error && (
        <div className={showLoadingIndicator ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <ScoreResultView result={data} />
        </div>
      )}

      {!isLoading && !error && !data && (
        <section className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <FileSearch className="h-7 w-7 text-brand-sky" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            Enter a registration number above to view detailed scores.
          </p>
        </section>
      )}
    </div>
  );
}
