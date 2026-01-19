'use client';

import { useState } from 'react';
import { KanbanCard, Priority } from '@/types';
import { cn } from '@/lib/utils';

interface ArchiveSectionProps {
  archivedCards: KanbanCard[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-sage',
  medium: 'bg-amber',
  high: 'bg-rose',
};

export function ArchiveSection({ archivedCards, onRestore, onDelete }: ArchiveSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (archivedCards.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3',
          'bg-linen/50 hover:bg-linen rounded-lg',
          'transition-all duration-200'
        )}
      >
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 text-stone"
          >
            <path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z" />
            <path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.802a2 2 0 01-1.99-1.79L2 7.5zM7 11a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-mono text-xs uppercase tracking-wider text-stone">
            Archive
          </span>
          <span className="font-mono text-2xs px-2 py-0.5 bg-stone/10 text-stone rounded-full">
            {archivedCards.length}
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={cn(
            'w-5 h-5 text-stone transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2 animate-fade-in">
          {archivedCards.map((card) => (
            <div
              key={card.id}
              className={cn(
                'relative flex items-center justify-between p-3',
                'bg-white/60 rounded-lg border border-sand/30',
                'hover:bg-white transition-all duration-200'
              )}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {card.priority && (
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full flex-shrink-0',
                      priorityColors[card.priority]
                    )}
                  />
                )}
                <span className="text-sm text-stone truncate">{card.title}</span>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                <button
                  onClick={() => onRestore(card.id)}
                  className={cn(
                    'px-3 py-1.5 font-mono text-2xs uppercase tracking-wider',
                    'text-azure hover:bg-azure/10 rounded',
                    'transition-all duration-200'
                  )}
                  title="Restore to board"
                >
                  Restore
                </button>
                <button
                  onClick={() => onDelete(card.id)}
                  className={cn(
                    'p-1.5 rounded',
                    'text-muted hover:text-rose hover:bg-rose/10',
                    'transition-all duration-200'
                  )}
                  title="Delete permanently"
                  aria-label="Delete permanently"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 3.25V4H2.75a.75.75 0 000 1.5h.3l.815 8.15A1.5 1.5 0 005.357 15h5.285a1.5 1.5 0 001.493-1.35l.815-8.15h.3a.75.75 0 000-1.5H11v-.75A2.25 2.25 0 008.75 1h-1.5A2.25 2.25 0 005 3.25zm2.25-.75a.75.75 0 00-.75.75V4h3v-.75a.75.75 0 00-.75-.75h-1.5zM6.05 6a.75.75 0 01.787.713l.275 5.5a.75.75 0 01-1.498.075l-.275-5.5A.75.75 0 016.05 6zm3.9 0a.75.75 0 01.712.787l-.275 5.5a.75.75 0 01-1.498-.075l.275-5.5a.75.75 0 01.786-.711z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
