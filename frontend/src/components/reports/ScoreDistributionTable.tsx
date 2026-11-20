import type { SubjectScoreDistribution } from '../../types/report';
import type { SubjectCategory } from '../../types/score';

const CATEGORY_LABELS: Record<SubjectCategory, string> = {
  MANDATORY: 'Mandatory',
  NATURAL_SCIENCE: 'Natural Science',
  SOCIAL_SCIENCE: 'Social Science',
};

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
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Subject</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Candidates</th>
              <th className="px-4 py-3 text-right text-emerald-700">&gt;= 8.0</th>
              <th className="px-4 py-3 text-right text-sky-700">6.0 - 7.99</th>
              <th className="px-4 py-3 text-right text-amber-700">4.0 - 5.99</th>
              <th className="px-5 py-3 text-right text-rose-700">&lt; 4.0</th>
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
                <td className="px-4 py-3.5 text-right font-mono">
                  <div className="font-semibold text-slate-900">
                    {subject.distribution.excellent.toLocaleString()}
                  </div>
                  <div className="text-xs text-emerald-700">
                    {subject.percentages.excellent.toFixed(1)}%
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right font-mono">
                  <div className="font-semibold text-slate-900">
                    {subject.distribution.good.toLocaleString()}
                  </div>
                  <div className="text-xs text-sky-700">
                    {subject.percentages.good.toFixed(1)}%
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right font-mono">
                  <div className="font-semibold text-slate-900">
                    {subject.distribution.average.toLocaleString()}
                  </div>
                  <div className="text-xs text-amber-700">
                    {subject.percentages.average.toFixed(1)}%
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right font-mono">
                  <div className="font-semibold text-slate-900">
                    {subject.distribution.poor.toLocaleString()}
                  </div>
                  <div className="text-xs text-rose-700">
                    {subject.percentages.poor.toFixed(1)}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
