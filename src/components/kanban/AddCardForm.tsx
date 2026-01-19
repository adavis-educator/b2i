'use client';

import { useState, useRef, useEffect } from 'react';
import { Priority } from '@/types';
import { cn } from '@/lib/utils';

interface AddCardFormProps {
  onAdd: (title: string, dueDate?: string, priority?: Priority) => void;
  columnId?: string;
}

const priorityOptions: { value: Priority | ''; label: string; color: string }[] = [
  { value: '', label: 'No priority', color: 'bg-sand' },
  { value: 'low', label: 'Low', color: 'bg-sage' },
  { value: 'medium', label: 'Medium', color: 'bg-amber' },
  { value: 'high', label: 'High', color: 'bg-rose' },
];

export function AddCardForm({ onAdd, columnId = 'todo' }: AddCardFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority | ''>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), dueDate || undefined, priority || undefined);
      setTitle('');
      setDueDate('');
      setPriority('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDueDate('');
    setPriority('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        data-add-card-button={columnId}
        className={cn(
          'w-full py-2.5 px-3 font-mono text-xs uppercase tracking-wider',
          'text-muted hover:text-ink hover:bg-white/80',
          'border border-dashed border-sand hover:border-amber/40',
          'rounded-lg transition-all duration-200',
          'flex items-center justify-center gap-2'
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
        Add Task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Task title..."
        className={cn(
          'w-full px-4 py-3 text-sm text-ink bg-white',
          'border border-sand rounded-lg',
          'focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/30',
          'placeholder:text-muted font-mono',
          'transition-all duration-200'
        )}
      />

      {/* Priority and Due Date row */}
      <div className="flex items-center gap-2">
        {/* Priority selector */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-2xs uppercase tracking-wider text-muted">Priority</span>
          <div className="flex gap-1">
            {priorityOptions.map((option) => (
              <button
                key={option.value || 'none'}
                type="button"
                onClick={() => setPriority(option.value)}
                className={cn(
                  'w-5 h-5 rounded-full border-2 transition-all duration-200',
                  option.color,
                  priority === option.value
                    ? 'border-ink scale-110'
                    : 'border-transparent opacity-50 hover:opacity-100'
                )}
                title={option.label}
                aria-label={`Set priority to ${option.label}`}
              />
            ))}
          </div>
        </div>

        {/* Due Date Input */}
        <div className="flex-1 flex items-center gap-1.5">
          <span className="font-mono text-2xs uppercase tracking-wider text-muted">Due</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={cn(
              'flex-1 px-2 py-1.5 text-xs text-ink bg-white font-mono',
              'border border-sand rounded',
              'focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/30',
              'transition-all duration-200'
            )}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className={cn(
            'flex-1 px-4 py-2 font-mono text-xs uppercase tracking-wider',
            'bg-amber text-white rounded-lg hover:bg-gold',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'transition-all duration-200'
          )}
        >
          Add
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className={cn(
            'px-4 py-2 font-mono text-xs uppercase tracking-wider',
            'text-stone hover:text-ink hover:bg-linen',
            'border border-sand rounded-lg hover:border-stone/30',
            'transition-all duration-200'
          )}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
