import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { SubjectScoreDistribution } from '../../types/report';
import type { SubjectCategory } from '../../types/score';

export type ChartMode = 'grouped' | 'stacked';
export type CategoryFilter = 'ALL' | SubjectCategory;

const LEVEL_SERIES = [
  { key: 'belowAverage', label: 'Below Average (< 4.0)', color: '#E11D48' },
  { key: 'average', label: 'Average (4.0 - 5.99)', color: '#F59E0B' },
  { key: 'good', label: 'Good (6.0 - 7.99)', color: '#62A7EA' },
  { key: 'excellent', label: 'Excellent (>= 8.0)', color: '#059669' },
] as const;

const CATEGORY_TABS: Array<{ value: CategoryFilter; label: string }> = [
  { value: 'ALL', label: 'All Subjects' },
  { value: 'MANDATORY', label: 'Mandatory' },
  { value: 'NATURAL_SCIENCE', label: 'Natural Science' },
  { value: 'SOCIAL_SCIENCE', label: 'Social Science' },
];

interface ChartDatum {
  name: string;
  totalStudents: number;
  belowAverage: number;
  average: number;
  good: number;
  excellent: number;
  belowAveragePct: number;
  averagePct: number;
  goodPct: number;
  excellentPct: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDatum }>;
}

function DistributionTooltip({ active, payload }: CustomTooltipProps) {
  const item = payload?.[0]?.payload;
  if (!active || !item) return null;

  return (
    <div className="rounded-md border border-slate-200 bg-white p-3 text-xs shadow-md">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2">
        <span className="font-bold text-brand-navy">{item.name}</span>
        <span className="font-mono text-slate-500">
          {item.totalStudents.toLocaleString()} students
        </span>
      </div>
      <div className="mt-2 space-y-1.5">
        {LEVEL_SERIES.map((series) => {
          const count = item[series.key];
          const pct = item[`${series.key}Pct`];
          return (
            <div key={series.key} className="flex items-center justify-between gap-5">
              <span className="flex items-center gap-1.5 whitespace-nowrap text-slate-600">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-xs"
                  style={{ backgroundColor: series.color }}
                />
                {series.label}
              </span>
              <span className="whitespace-nowrap font-mono font-semibold text-brand-navy">
                {count.toLocaleString()}{' '}
                <span className="font-normal text-slate-400">({pct.toFixed(1)}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatAxisCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return String(value);
}

interface ScoreDistributionChartProps {
  subjects: SubjectScoreDistribution[];
  chartMode: ChartMode;
  categoryFilter: CategoryFilter;
  onChartModeChange: (mode: ChartMode) => void;
  onCategoryFilterChange: (category: CategoryFilter) => void;
}

export function ScoreDistributionChart({
  subjects,
  chartMode,
  categoryFilter,
  onChartModeChange,
  onCategoryFilterChange,
}: ScoreDistributionChartProps) {
  const chartData: ChartDatum[] = subjects.map((subject) => ({
    name: subject.name,
    totalStudents: subject.totalStudents,
    belowAverage: subject.distribution.belowAverage,
    average: subject.distribution.average,
    good: subject.distribution.good,
    excellent: subject.distribution.excellent,
    belowAveragePct: subject.percentages.belowAverage,
    averagePct: subject.percentages.average,
    goodPct: subject.percentages.good,
    excellentPct: subject.percentages.excellent,
  }));

  const stackId = chartMode === 'stacked' ? 'score-levels' : undefined;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-brand-navy">Score Distribution by Subject</h2>

        <div className="inline-flex self-start rounded-md border border-slate-200 bg-slate-50 p-0.5">
          {(['grouped', 'stacked'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onChartModeChange(mode)}
              className={[
                'cursor-pointer rounded px-3 py-1 text-xs font-semibold capitalize transition',
                chartMode === mode
                  ? 'bg-brand-navy text-white'
                  : 'text-slate-600 hover:text-brand-navy',
              ].join(' ')}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5 border-b border-slate-100 pb-4">
        {CATEGORY_TABS.map((tab) => {
          const isActive = categoryFilter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onCategoryFilterChange(tab.value)}
              className={[
                'cursor-pointer rounded px-3 py-1.5 text-xs font-semibold transition',
                isActive
                  ? 'bg-brand-yellow text-brand-navy'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-sky hover:text-brand-navy',
              ].join(' ')}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 12, left: 4, bottom: 28 }}
            barCategoryGap={chartMode === 'grouped' ? '18%' : '30%'}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#334155', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              interval={0}
              angle={subjects.length > 5 ? -20 : 0}
              textAnchor={subjects.length > 5 ? 'end' : 'middle'}
              height={subjects.length > 5 ? 56 : 32}
            />
            <YAxis
              tickFormatter={formatAxisCount}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={48}
            />
            <Tooltip content={<DistributionTooltip />} cursor={{ fill: 'rgba(98, 167, 234, 0.08)' }} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="square"
              iconSize={10}
              itemSorter={null}
              wrapperStyle={{ paddingBottom: 14, fontSize: 12 }}
            />
            {LEVEL_SERIES.map((series) => (
              <Bar
                key={series.key}
                dataKey={series.key}
                name={series.label}
                stackId={stackId}
                fill={series.color}
                radius={chartMode === 'grouped' ? [3, 3, 0, 0] : [0, 0, 0, 0]}
                maxBarSize={chartMode === 'grouped' ? 28 : 54}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
