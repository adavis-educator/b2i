'use client';

import { Draggable } from '@hello-pangea/dnd';
import { KanbanCard as KanbanCardType, Priority } from '@/types';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  card: KanbanCardType;
  index: number;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-sage',
  medium: 'bg-amber',
  high: 'bg-rose',
};

const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

function formatDueDate(dateString: string): { text: string; isOverdue: boolean; isDueSoon: boolean } {
  const dueDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isOverdue = diffDays < 0;
  const isDueSoon = diffDays >= 0 && diffDays <= 2;

  const formatted = dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return { text: formatted, isOverdue, isDueSoon };
}

export function KanbanCard({ card, index, onDelete, onArchive }: KanbanCardProps) {
  const dueDateInfo = card.dueDate ? formatDueDate(card.dueDate) : null;

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'group relative bg-white rounded-lg border border-sand/50 p-4 mb-3',
            'hover:border-amber/40 hover:shadow-card-hover transition-all duration-200',
            snapshot.isDragging && 'shadow-elevated border-amber/50 scale-[1.02]'
          )}
        >
          {/* Priority dot */}
          {card.priority && (
            <div
              className={cn(
                'absolute top-4 left-4 w-2 h-2 rounded-full',
                priorityColors[card.priority]
              )}
              title={`${priorityLabels[card.priority]} priority`}
            />
          )}

          {/* Accent line on hover */}
          <div className={cn(
            'absolute left-0 top-0 bottom-0 w-0.5 bg-amber rounded-l-lg',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            snapshot.isDragging && 'opacity-100'
          )} />

          <div className={cn('pr-16', card.priority && 'pl-5')}>
            <p className="text-sm text-ink font-medium leading-relaxed">
              {card.title}
            </p>
            {card.description && (
              <p className="font-mono text-xs text-stone mt-2 line-clamp-2 leading-relaxed">
                {card.description}
              </p>
            )}

            {/* Due Date Badge */}
            {dueDateInfo && (
              <div className={cn(
                'mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded font-mono text-2xs',
                dueDateInfo.isOverdue && 'bg-rose/10 text-rose',
                dueDateInfo.isDueSoon && !dueDateInfo.isOverdue && 'bg-amber/10 text-amber',
                !dueDateInfo.isOverdue && !dueDateInfo.isDueSoon && 'bg-linen text-stone'
              )}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 1.75a.75.75 0 01.75.75V3h6.5V2.5a.75.75 0 011.5 0V3h.25A2.75 2.75 0 0115.75 5.75v7.5A2.75 2.75 0 0113 16H3A2.75 2.75 0 01.25 13.25v-7.5A2.75 2.75 0 013 3h.25V2.5a.75.75 0 01.75-.75zM1.75 7.5v5.75c0 .69.56 1.25 1.25 1.25h10c.69 0 1.25-.56 1.25-1.25V7.5H1.75z"
                    clipRule="evenodd"
                  />
                </svg>
                {dueDateInfo.text}
                {dueDateInfo.isOverdue && <span className="text-2xs">(overdue)</span>}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className={cn(
            'absolute top-3 right-3 flex items-center gap-1',
            'opacity-0 group-hover:opacity-100 transition-all duration-200'
          )}>
            {/* Archive button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive(card.id);
              }}
              className={cn(
                'w-7 h-7 flex items-center justify-center rounded',
                'text-muted hover:text-azure hover:bg-azure/10',
                'transition-all duration-200'
              )}
              title="Archive card"
              aria-label="Archive card"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z" />
                <path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.802a2 2 0 01-1.99-1.79L2 7.5zM7 11a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
              }}
              className={cn(
                'w-7 h-7 flex items-center justify-center rounded',
                'text-muted hover:text-rose hover:bg-rose/10',
                'transition-all duration-200'
              )}
              title="Delete card"
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
        </div>
      )}
    </Draggable>
  );
}
