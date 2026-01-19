'use client';

import { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useChecklistSupabase } from '@/hooks/useChecklistSupabase';
import { ChecklistItem } from './ChecklistItem';
import { cn } from '@/lib/utils';

export function ShutdownChecklist() {
  const { items, isLoading, toggleItem, addItem, removeItem, resetAll, reorderItems } = useChecklistSupabase();
  const [isAdding, setIsAdding] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemLabel.trim()) {
      addItem(newItemLabel.trim());
      setNewItemLabel('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setNewItemLabel('');
      setIsAdding(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    reorderItems(result.source.index, result.destination.index);
  };

  const completedCount = items.filter(item => item.isChecked).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;
  const isComplete = progress === 100;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-column h-full animate-pulse">
        <div className="p-5 border-b border-sand/30">
          <div className="h-7 w-40 bg-linen rounded mb-2" />
          <div className="h-4 w-32 bg-linen/70 rounded" />
        </div>
        <div className="p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-6 bg-linen/50 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-column h-full flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-sand/30">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="font-display text-2xl text-ink">Friday Shutdown</h2>
            <p className="font-mono text-2xs uppercase tracking-[0.15em] text-muted mt-1">
              Weekly review ritual
            </p>
          </div>
          {isComplete && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-sage/10 rounded-full">
              <svg className="w-4 h-4 text-sage" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-mono text-2xs uppercase tracking-wider text-sage">Complete</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between font-mono text-2xs text-muted">
            <span>{completedCount} of {items.length} tasks</span>
            <span className={cn(
              'transition-colors duration-300',
              isComplete ? 'text-sage' : 'text-amber'
            )}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${progress}%`,
                background: isComplete
                  ? 'linear-gradient(to right, #5a7c5a, #3d6b4f)'
                  : undefined
              }}
            />
          </div>
        </div>
      </div>

      {/* Checklist items */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="checklist">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex-1 overflow-y-auto p-4 space-y-1"
            >
              {items.map((item, index) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  index={index}
                  onToggle={toggleItem}
                  onRemove={removeItem}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Footer actions */}
      <div className="p-4 border-t border-sand/30">
        {isAdding ? (
          <form onSubmit={handleAddItem} className="space-y-3">
            <input
              ref={inputRef}
              type="text"
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="New checklist item..."
              className={cn(
                'w-full px-4 py-3 text-sm text-ink bg-snow font-mono',
                'border border-sand rounded-lg',
                'focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/30',
                'placeholder:text-muted',
                'transition-all duration-200'
              )}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!newItemLabel.trim()}
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
                onClick={() => {
                  setNewItemLabel('');
                  setIsAdding(false);
                }}
                className={cn(
                  'px-4 py-2 font-mono text-xs uppercase tracking-wider',
                  'text-stone hover:text-ink hover:bg-linen',
                  'border border-sand rounded-lg',
                  'transition-all duration-200'
                )}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsAdding(true)}
              className={cn(
                'flex-1 py-2.5 font-mono text-xs uppercase tracking-wider',
                'text-muted hover:text-ink',
                'border border-dashed border-sand rounded-lg hover:border-amber/40 hover:bg-snow',
                'transition-all duration-200',
                'flex items-center justify-center gap-2'
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z" />
              </svg>
              Add Item
            </button>
            <button
              onClick={resetAll}
              className={cn(
                'px-4 py-2.5 font-mono text-xs uppercase tracking-wider',
                'text-muted hover:text-ink hover:bg-linen',
                'border border-sand rounded-lg',
                'transition-all duration-200'
              )}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
