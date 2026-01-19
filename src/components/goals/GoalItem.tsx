'use client';

import { Goal } from '@/types';
import { cn } from '@/lib/utils';

interface GoalItemProps {
  goal: Goal;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GoalItem({ goal, index, onToggle, onDelete }: GoalItemProps) {
  return (
    <div
      className={cn(
        'group relative flex items-center gap-4 px-5 py-4 rounded-lg border transition-all duration-300',
        'animate-fade-in-up opacity-0',
        goal.isCompleted
          ? 'bg-sage/5 border-sage/30'
          : 'bg-white border-sand hover:border-amber/40 hover:shadow-card'
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Achievement indicator */}
      {goal.isCompleted && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-sage rounded-l-lg" />
      )}

      <input
        type="checkbox"
        id={`goal-${goal.id}`}
        checked={goal.isCompleted}
        onChange={() => onToggle(goal.id)}
        className={cn(
          'h-5 w-5 rounded-full border-2',
          'cursor-pointer transition-all duration-200',
          goal.isCompleted
            ? 'border-sage bg-sage'
            : 'border-sand'
        )}
      />
      <label
        htmlFor={`goal-${goal.id}`}
        className={cn(
          'flex-1 text-sm font-medium cursor-pointer select-none transition-all duration-200',
          goal.isCompleted
            ? 'text-sage line-through'
            : 'text-ink'
        )}
      >
        {goal.title}
      </label>

      {/* Delete button */}
      <button
        onClick={() => onDelete(goal.id)}
        className={cn(
          'opacity-0 group-hover:opacity-100 p-2 rounded',
          'text-muted hover:text-rose hover:bg-rose/10',
          'transition-all duration-200'
        )}
        aria-label="Delete goal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
        </svg>
      </button>
    </div>
  );
}
