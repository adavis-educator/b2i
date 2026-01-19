'use client';

import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard as KanbanCardType, ColumnId, Priority } from '@/types';
import { KanbanCard } from './KanbanCard';
import { AddCardForm } from './AddCardForm';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: ColumnId;
  title: string;
  cards: KanbanCardType[];
  onAddCard: (title: string, columnId: ColumnId, dueDate?: string, priority?: Priority) => void;
  onDeleteCard: (id: string) => void;
  onArchiveCard: (id: string) => void;
}

const columnStyles: Record<ColumnId, { className: string; badge: string; dropBg: string }> = {
  'todo': {
    className: 'column-todo',
    badge: 'bg-stone/10 text-stone',
    dropBg: 'bg-stone/5',
  },
  'in-progress': {
    className: 'column-progress',
    badge: 'bg-azure/10 text-azure',
    dropBg: 'bg-azure/5',
  },
  'complete': {
    className: 'column-complete',
    badge: 'bg-sage/10 text-sage',
    dropBg: 'bg-sage/5',
  },
};

export function KanbanColumn({ id, title, cards, onAddCard, onDeleteCard, onArchiveCard }: KanbanColumnProps) {
  const styles = columnStyles[id];

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg shadow-column min-h-[400px]',
        'transition-all duration-300',
        styles.className
      )}
    >
      {/* Column Header - simplified */}
      <div className="p-4 border-b border-black/5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-ink">{title}</h3>
          <span className={cn(
            'font-mono text-2xs px-2 py-0.5 rounded-full',
            styles.badge
          )}>
            {cards.length}
          </span>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 p-3 overflow-y-auto transition-colors duration-200',
              snapshot.isDraggingOver && styles.dropBg
            )}
          >
            {cards.map((card, index) => (
              <KanbanCard
                key={card.id}
                card={card}
                index={index}
                onDelete={onDeleteCard}
                onArchive={onArchiveCard}
              />
            ))}
            {provided.placeholder}

            {cards.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-full min-h-[80px] flex items-center justify-center">
                <p className="font-mono text-2xs text-muted/60 uppercase tracking-wider">
                  Drop tasks here
                </p>
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Add Card Form */}
      <div className="p-3 border-t border-black/5 bg-white/50">
        <AddCardForm
          onAdd={(title, dueDate, priority) => onAddCard(title, id, dueDate, priority)}
          columnId={id}
        />
      </div>
    </div>
  );
}
