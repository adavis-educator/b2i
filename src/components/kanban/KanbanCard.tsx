'use client';

import { Draggable } from '@hello-pangea/dnd';
import { KanbanCard as KanbanCardType } from '@/types';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  card: KanbanCardType;
  index: number;
  onDelete: (id: string) => void;
}

export function KanbanCard({ card, index, onDelete }: KanbanCardProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'group relative bg-graphite border border-slate/40 p-4 mb-3',
            'hover:border-amber/30 hover:shadow-card transition-all duration-200',
            snapshot.isDragging && 'shadow-elevated border-amber/40 scale-[1.02]'
          )}
        >
          {/* Accent line on hover */}
          <div className={cn(
            'absolute left-0 top-0 bottom-0 w-0.5 bg-amber',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            snapshot.isDragging && 'opacity-100'
          )} />

          <div className="pr-8">
            <p className="text-sm text-cream font-medium leading-relaxed">
              {card.title}
            </p>
            {card.description && (
              <p className="font-mono text-xs text-stone mt-2 line-clamp-2 leading-relaxed">
                {card.description}
              </p>
            )}
          </div>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className={cn(
              'absolute top-3 right-3 w-7 h-7 flex items-center justify-center',
              'text-muted hover:text-rose hover:bg-rose/10',
              'opacity-0 group-hover:opacity-100 transition-all duration-200'
            )}
            aria-label="Delete card"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </Draggable>
  );
}
