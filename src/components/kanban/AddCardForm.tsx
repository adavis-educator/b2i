'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AddCardFormProps {
  onAdd: (title: string) => void;
}

export function AddCardForm({ onAdd }: AddCardFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
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
        className={cn(
          'w-full py-2.5 px-3 font-mono text-xs uppercase tracking-wider',
          'text-muted hover:text-cream hover:bg-slate/30',
          'border border-dashed border-slate/30 hover:border-amber/30',
          'transition-all duration-200',
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
          'w-full px-4 py-3 text-sm text-cream bg-graphite',
          'border border-slate/40 focus:border-amber/50',
          'focus:outline-none focus:ring-1 focus:ring-amber/30',
          'placeholder:text-muted font-mono',
          'transition-all duration-200'
        )}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className={cn(
            'flex-1 px-4 py-2 font-mono text-xs uppercase tracking-wider',
            'bg-amber text-void hover:bg-honey',
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
            'text-stone hover:text-cream hover:bg-slate/50',
            'border border-slate/30 hover:border-slate/50',
            'transition-all duration-200'
          )}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
