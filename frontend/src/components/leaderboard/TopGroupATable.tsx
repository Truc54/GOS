import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TopGroupAStudent } from '../../types/leaderboard';

interface TopGroupATableProps {
  students: TopGroupAStudent[];
}

function getRankBadgeClass(rank: number): string {
  if (rank === 1) return 'bg-brand-yellow text-brand-navy font-bold';
  if (rank === 2) return 'bg-slate-200 text-brand-navy font-bold';
  if (rank === 3) return 'bg-amber-100 text-amber-900 font-bold';
  return 'text-slate-500 font-semibold';
}

function formatScoreClass(score: number): string {
  return score === 10 ? 'font-semibold text-emerald-700' : 'text-slate-700';
}

export function TopGroupATable({ students }: TopGroupATableProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-brand-navy">Top 10 Students - Group A00</h2>
      </div>

      {students.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-500">
          No Group A00 score records available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="w-20 px-5 py-3">Rank</th>
                <th className="px-4 py-3">Registration No.</th>
                <th className="px-4 py-3 text-right">Mathematics</th>
                <th className="px-4 py-3 text-right">Physics</th>
                <th className="px-4 py-3 text-right">Chemistry</th>
                <th className="px-4 py-3 text-right">Total Score</th>
                <th className="w-24 px-5 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.sbd} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-mono text-xs">
                    <span
                      className={`inline-flex h-6 min-w-7 items-center justify-center rounded px-1.5 ${getRankBadgeClass(student.rank)}`}
                    >
                      #{student.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-semibold text-brand-navy">
                    <Link
                      to={`/search?sbd=${student.sbd}`}
                      className="cursor-pointer transition hover:text-brand-sky hover:underline"
                    >
                      {student.sbd}
                    </Link>
                  </td>
                  <td
                    className={`px-4 py-3.5 text-right font-mono ${formatScoreClass(student.scores.toan)}`}
                  >
                    {student.scores.toan.toFixed(2)}
                  </td>
                  <td
                    className={`px-4 py-3.5 text-right font-mono ${formatScoreClass(student.scores.vat_li)}`}
                  >
                    {student.scores.vat_li.toFixed(2)}
                  </td>
                  <td
                    className={`px-4 py-3.5 text-right font-mono ${formatScoreClass(student.scores.hoa_hoc)}`}
                  >
                    {student.scores.hoa_hoc.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-brand-navy">
                    {student.totalScore.toFixed(2)}
                    <span className="ml-1 text-xs font-normal text-slate-400">/ 30</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      to={`/search?sbd=${student.sbd}`}
                      className="inline-flex cursor-pointer items-center gap-1 rounded border border-slate-200 px-2.5 py-1 text-xs font-medium text-brand-navy transition hover:border-brand-sky hover:bg-brand-sky/10"
                    >
                      View
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
