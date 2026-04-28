import { TOTAL_QUESTIONS } from '../utils/scoring';

interface Props {
  current: number; // 1-based current question index
}

export function ProgressBar({ current }: Props) {
  const percent = Math.round(((current - 1) / TOTAL_QUESTIONS) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-brand-text-muted">
          Question <span className="text-brand-primary font-semibold">{current}</span> sur {TOTAL_QUESTIONS}
        </span>
        <span className="text-sm font-semibold text-brand-accent">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
