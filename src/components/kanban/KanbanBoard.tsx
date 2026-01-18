'use client';

import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { ColumnId } from '@/types';

const COLUMNS: { id: ColumnId; title: string; subtitle: string }[] = [
  { id: 'todo', title: 'To Do', subtitle: 'Queued tasks' },
  { id: 'in-progress', title: 'In Progress', subtitle: 'Active work' },
  { id: 'complete', title: 'Complete', subtitle: 'Finished' },
];

export function KanbanBoard() {
  const { cards, isHydrated, addCard, deleteCard, moveCard, getColumnCards } = useKanbanBoard();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveCard(draggableId, destination.droppableId as ColumnId, destination.index);
  };

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {COLUMNS.map((column, index) => (
          <div
            key={column.id}
            className={`
              bg-charcoal border border-slate/30 min-h-[450px]
              animate-pulse
              ${index === 0 ? 'column-accent-todo' : ''}
              ${index === 1 ? 'column-accent-progress' : ''}
              ${index === 2 ? 'column-accent-complete' : ''}
            `}
          >
            <div className="p-4 border-b border-slate/20">
              <div className="h-5 w-20 bg-slate/50 mb-2" />
              <div className="h-3 w-28 bg-slate/30" />
            </div>
            <div className="p-3 space-y-3">
              <div className="h-20 bg-slate/20" />
              <div className="h-20 bg-slate/20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            subtitle={column.subtitle}
            cards={getColumnCards(column.id)}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
