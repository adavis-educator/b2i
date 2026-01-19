'use client';

import { useState, useRef, useEffect } from 'react';
import { useGoals } from '@/hooks/useGoals';
import { GoalItem } from './GoalItem';
import { cn } from '@/lib/utils';

export function GoalsSection() {
  const { goals, isHydrated, addGoal, toggleGoal, deleteGoal } = useGoals();
  const [isAdding, setIsAdding] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalTitle.trim()) {
      addGoal(newGoalTitle.trim());
      setNewGoalTitle('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setNewGoalTitle('');
      setIsAdding(false);
    }
  };

  const currentYear = new Date().getFullYear();

  if (!isHydrated) {
    return (
      <div className="bg-white rounded-lg shadow-column p-6 animate-pulse">
        <div className="h-7 w-48 bg-linen rounded mb-6" />
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 w-48 bg-linen/50 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-column p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-ink">
          {currentYear} Goals
        </h2>
        {!isAdding && goals.length > 0 && (
          <button
            onClick={() => setIsAdding(true)}
            className={cn(
              'px-4 py-2 font-mono text-xs uppercase tracking-wider',
              'text-amber hover:bg-amber/10 border border-amber/30 rounded-lg',
              'transition-all duration-200',
              'flex items-center gap-2'
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z" />
            </svg>
            New Goal
          </button>
        )}
      </div>

      {/* Goals grid or empty state */}
      {goals.length === 0 && !isAdding ? (
        <div className="py-12 text-center border border-dashed border-sand rounded-lg">
          <p className="font-mono text-sm text-muted mb-4">No goals set for {currentYear}</p>
          <button
            onClick={() => setIsAdding(true)}
            className={cn(
              'px-6 py-3 font-mono text-xs uppercase tracking-wider',
              'bg-amber text-white rounded-lg hover:bg-gold',
              'transition-all duration-200'
            )}
          >
            Set Your First Goal
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {goals.map((goal, index) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              index={index}
              onToggle={toggleGoal}
              onDelete={deleteGoal}
            />
          ))}

          {isAdding && (
            <form onSubmit={handleAddGoal} className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter goal..."
                className={cn(
                  'px-4 py-3 text-sm text-ink bg-snow w-64 font-mono',
                  'border border-sand rounded-lg',
                  'focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/30',
                  'placeholder:text-muted',
                  'transition-all duration-200'
                )}
              />
              <button
                type="submit"
                disabled={!newGoalTitle.trim()}
                className={cn(
                  'p-3 bg-amber text-white rounded-lg hover:bg-gold',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                  'transition-all duration-200'
                )}
                aria-label="Save goal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewGoalTitle('');
                  setIsAdding(false);
                }}
                className={cn(
                  'p-3 text-muted hover:text-ink hover:bg-linen rounded-lg',
                  'border border-sand',
                  'transition-all duration-200'
                )}
                aria-label="Cancel"
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
            </form>
          )}
        </div>
      )}
    </div>
  );
}
