import { Languages } from 'lucide-react';
import type { StudentScoreDetail, SubjectCategory } from '../../types/score';
import { SCORE_LEVEL_CONFIG, ScoreLevelBadge } from './ScoreLevelBadge';

const CATEGORY_LABELS: Record<SubjectCategory, string> = {
  MANDATORY: 'Mandatory',
  NATURAL_SCIENCE: 'Natural Science',
  SOCIAL_SCIENCE: 'Social Science',
};

function getCandidateTrack(result: StudentScoreDetail): string | null {
  const hasNatural = result.subjects.some((s) => s.category === 'NATURAL_SCIENCE');
  const hasSocial = result.subjects.some((s) => s.category === 'SOCIAL_SCIENCE');

  if (hasNatural && hasSocial) return 'Natural & Social Science';
  if (hasNatural) return 'Natural Science';
  if (hasSocial) return 'Social Science';
  return null;
}

interface ScoreResultViewProps {
  result: StudentScoreDetail;
}

export function ScoreResultView({ result }: ScoreResultViewProps) {
  const candidateTrack = getCandidateTrack(result);

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-brand-navy bg-brand-navy px-5 py-4 text-white sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-brand-sky">
              Registration Number
            </span>
            <div className="mt-1 flex flex-wrap items-center gap-2.5">
              <h3 className="font-mono text-2xl font-bold tracking-wider text-brand-yellow">
                {result.sbd}
              </h3>
              {candidateTrack && (
                <span className="inline-flex items-center rounded border border-brand-sky/40 bg-brand-sky/15 px-2 py-0.5 text-xs font-medium text-brand-sky">
                  {candidateTrack}
                </span>
              )}
              {result.foreignLanguageCode && (
                <span className="inline-flex items-center gap-1 rounded border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-medium text-white">
                  <Languages className="h-3.5 w-3.5 text-brand-sky" />
                  {result.foreignLanguageCode}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center divide-x divide-white/15 border-t border-white/10 pt-3 sm:border-t-0 sm:pt-0">
            <div className="pr-5">
              <span className="block text-xs text-slate-300">Subjects</span>
              <span className="mt-0.5 block text-xl font-bold">{result.subjectCount}</span>
            </div>
            <div className="pl-5">
              <span className="block text-xs text-slate-300">Average</span>
              <span className="mt-0.5 block text-xl font-bold text-brand-yellow">
                {result.averageScore !== null ? result.averageScore.toFixed(2) : '—'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-base font-semibold text-brand-navy">Detailed Scores</h3>

        <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {result.subjects.map((subject) => {
            const levelStyle = SCORE_LEVEL_CONFIG[subject.level];
            const progressPct = Math.min(100, Math.max(0, (subject.score / 10) * 100));

            return (
              <article
                key={subject.code}
                className="flex flex-col justify-between rounded-md border border-slate-200 bg-slate-50/40 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      {CATEGORY_LABELS[subject.category]}
                    </span>
                    <h4 className="mt-0.5 text-sm font-bold text-brand-navy">{subject.name}</h4>
                    <p className="text-xs text-slate-500">
                      {subject.vietnameseName}
                      {subject.metadata?.foreignLanguageName
                        ? ` · ${subject.metadata.foreignLanguageName}`
                        : ''}
                    </p>
                  </div>
                  <ScoreLevelBadge level={subject.level} />
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold tracking-tight text-brand-navy">
                      {subject.score.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400">/ 10</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-xs bg-slate-200">
                    <div
                      className={`h-full ${levelStyle.barClass}`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {result.examGroups.length > 0 && (
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-base font-semibold text-brand-navy">Exam Group Totals</h3>

          <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {result.examGroups.map((group) => (
              <div
                key={group.groupCode}
                className="rounded-md border border-slate-200 bg-slate-50/40 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-brand-yellow px-2 py-0.5 font-mono text-xs font-semibold text-brand-navy">
                      {group.groupCode}
                    </span>
                    <span className="text-xs font-medium text-slate-600">{group.groupName}</span>
                  </div>
                  <span className="shrink-0 text-lg font-bold text-brand-navy">
                    {group.totalScore.toFixed(2)}
                    <span className="text-xs font-normal text-slate-400"> / 30</span>
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {group.subjects.map((sub) => (
                    <span
                      key={sub.code}
                      className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600"
                    >
                      {sub.vietnameseName}:{' '}
                      <strong className="text-brand-navy">{sub.score.toFixed(2)}</strong>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
