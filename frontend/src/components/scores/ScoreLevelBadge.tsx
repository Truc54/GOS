import type { ScoreLevel } from '../../types/score';

interface LevelConfig {
  label: string;
  range: string;
  badgeClass: string;
  barClass: string;
}

export const SCORE_LEVEL_CONFIG: Record<ScoreLevel, LevelConfig> = {
  EXCELLENT: {
    label: 'Excellent',
    range: '>= 8.0',
    badgeClass: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    barClass: 'bg-emerald-600',
  },
  GOOD: {
    label: 'Good',
    range: '6.0 - 7.99',
    badgeClass: 'bg-sky-50 text-sky-700 ring-sky-600/20',
    barClass: 'bg-sky-600',
  },
  AVERAGE: {
    label: 'Average',
    range: '4.0 - 5.99',
    badgeClass: 'bg-amber-50 text-amber-800 ring-amber-600/20',
    barClass: 'bg-amber-500',
  },
  BELOW_AVERAGE: {
    label: 'Below Average',
    range: '< 4.0',
    badgeClass: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    barClass: 'bg-rose-600',
  },
};

interface ScoreLevelBadgeProps {
  level: ScoreLevel;
}

export function ScoreLevelBadge({ level }: ScoreLevelBadgeProps) {
  const config = SCORE_LEVEL_CONFIG[level];
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${config.badgeClass}`}
    >
      {config.label}
    </span>
  );
}
