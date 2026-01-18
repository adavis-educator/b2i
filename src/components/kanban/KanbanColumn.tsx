'use client';

import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard as KanbanCardType, ColumnId } from '@/types';
import { KanbanCard } from './KanbanCard';
import { AddCardForm } from './AddCardForm';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: ColumnId;
  title: string;
  subtitle: string;
  cards: KanbanCardType[];
  onAddCard: (title: string, columnId: ColumnId) => void;
  onDeleteCard: (id: string) => void;
}

const columnStyles: Record<ColumnId, { accent: string; badge: string; dropBg: string }> = {
  'todo': {
    accent: 'border-l-stone/40',
    badge: 'bg-stone/20 text-stone',
    dropBg: 'bg-stone/5',
  },
  'in-progress': {
    accent: 'border-l-azure',
    badge: 'bg-azure/20 text-sky',
    dropBg: 'bg-azure/5',
  },
  'complete': {
    accent: 'border-l-sage',
    badge: 'bg-sage/20 text-sage',
    dropBg: 'bg-sage/5',
  },
};

export function KanbanColumn({ id, title, subtitle, cards, onAddCard, onDeleteCard }: KanbanColumnProps) {
  const styles = columnStyles[id];

  return (
    <div
      className={cn(
        'flex flex-col bg-charcoal border border-slate/30 min-h-[450px]',
        'border-l-2',
        styles.accent,
        'transition-all duration-300'
      )}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-slate/20">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display text-xl text-cream">{title}</h3>
          <span className={cn(
            'font-mono text-2xs px-2 py-1',
            styles.badge
          )}>
            {cards.length}
          </span>
        </div>
        <p className="font-mono text-2xs uppercase tracking-[0.15em] text-muted">
          {subtitle}
        </p>
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
              />
            ))}
            {provided.placeholder}

            {cards.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-full min-h-[100px] flex items-center justify-center">
                <p className="font-mono text-2xs text-muted/50 uppercase tracking-wider">
                  Drop tasks here
                </p>
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Add Card Form */}
      <div className="p-3 border-t border-slate/20">
        <AddCardForm onAdd={(title) => onAddCard(title, id)} />
      </div>
    </div>
  );
}
