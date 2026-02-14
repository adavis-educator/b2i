'use client';

import { cn } from '@/lib/utils';

interface ScoreInputProps {
  label: string;
  question: string;
  value: number | null;
  onChange: (value: number | null) => void;
}

export function ScoreInput({ label, question, value, onChange }: ScoreInputProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <span className="font-mono text-2xs uppercase tracking-wider text-stone">{label}</span>
        <p className="text-sm text-charcoal truncate">{question}</p>
      </div>
      <div className="flex gap-1.5 shrink-0">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(value === score ? null : score)}
            className={cn(
              'w-8 h-8 rounded-full font-mono text-sm transition-all',
              value === score
                ? score >= 4
                  ? 'bg-sage text-white shadow-sm'
                  : score >= 3
                  ? 'bg-amber text-white shadow-sm'
                  : 'bg-rose text-white shadow-sm'
                : 'bg-snow border border-sand text-muted hover:border-amber hover:text-ink'
            )}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  );
}
