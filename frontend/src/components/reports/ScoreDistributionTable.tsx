import type { SubjectScoreDistribution } from '../../types/report';
import type { SubjectCategory } from '../../types/score';

const CATEGORY_LABELS: Record<SubjectCategory, string> = {
  MANDATORY: 'Mandatory',
  NATURAL_SCIENCE: 'Natural Science',
  SOCIAL_SCIENCE: 'Social Science',
};

const LEVEL_COLUMNS = [
  {
    key: 'belowAverage',
    label: 'Below Average (< 4.0)',
    colorClass: 'text-rose-700',
    paddingClass: 'px-4',
  },
  {
    key: 'average',
    label: 'Average (4.0 - 5.99)',
    colorClass: 'text-amber-700',
    paddingClass: 'px-4',
  },
  { key: 'good', label: 'Good (6.0 - 7.99)', colorClass: 'text-sky-700', paddingClass: 'px-4' },
  {
    key: 'excellent',
    label: 'Excellent (>= 8.0)',
    colorClass: 'text-emerald-700',
    paddingClass: 'px-5',
  },
] as const;

interface ScoreDistributionTableProps {
  subjects: SubjectScoreDistribution[];
}

export function ScoreDistributionTable({ subjects }: ScoreDistributionTableProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-brand-navy">Detailed Breakdown</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Subject</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Candidates</th>
              {LEVEL_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`${col.paddingClass} py-3 text-right whitespace-nowrap ${col.colorClass}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subjects.map((subject) => (
              <tr key={subject.code} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-3.5 font-semibold text-brand-navy">{subject.name}</td>
                <td className="px-4 py-3.5 text-xs font-medium text-slate-500">
                  {CATEGORY_LABELS[subject.category]}
                </td>
                <td className="px-4 py-3.5 text-right font-mono font-semibold text-brand-navy">
                  {subject.totalStudents.toLocaleString()}
                </td>
                {LEVEL_COLUMNS.map((col) => (
                  <td key={col.key} className={`${col.paddingClass} py-3.5 text-right font-mono`}>
                    <div className="font-semibold text-slate-900">
                      {subject.distribution[col.key].toLocaleString()}
                    </div>
                    <div className={`text-xs ${col.colorClass}`}>
                      {subject.percentages[col.key].toFixed(1)}%
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
