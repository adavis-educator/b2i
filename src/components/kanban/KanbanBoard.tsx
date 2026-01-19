'use client';

import { useEffect, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import { ArchiveSection } from './ArchiveSection';
import { useKanbanBoardSupabase } from '@/hooks/useKanbanBoardSupabase';
import { ColumnId } from '@/types';

const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'complete', title: 'Complete' },
];

export function KanbanBoard() {
  const { cards, isLoading, addCard, deleteCard, archiveCard, unarchiveCard, moveCard, getColumnCards, getArchivedCards } = useKanbanBoardSupabase();

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

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    // 'N' - Focus on first Add Task button (todo column)
    if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      const addButton = document.querySelector('[data-add-card-button="todo"]') as HTMLButtonElement;
      addButton?.click();
    }

    // '1', '2', '3' - Focus add button for specific column
    if (e.key === '1') {
      e.preventDefault();
      const addButton = document.querySelector('[data-add-card-button="todo"]') as HTMLButtonElement;
      addButton?.click();
    }
    if (e.key === '2') {
      e.preventDefault();
      const addButton = document.querySelector('[data-add-card-button="in-progress"]') as HTMLButtonElement;
      addButton?.click();
    }
    if (e.key === '3') {
      e.preventDefault();
      const addButton = document.querySelector('[data-add-card-button="complete"]') as HTMLButtonElement;
      addButton?.click();
    }

    // '?' - Show keyboard shortcuts help (could expand this later)
    if (e.key === '?') {
      e.preventDefault();
      alert('Keyboard Shortcuts:\n\nN or 1 - Add task to To Do\n2 - Add task to In Progress\n3 - Add task to Complete\nEsc - Cancel/Close forms');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className="bg-white rounded-lg shadow-column min-h-[400px] animate-pulse"
          >
            <div className="p-4 border-b border-sand/30">
              <div className="h-5 w-20 bg-linen rounded" />
            </div>
            <div className="p-3 space-y-3">
              <div className="h-20 bg-linen/50 rounded-lg" />
              <div className="h-20 bg-linen/50 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            cards={getColumnCards(column.id)}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
            onArchiveCard={archiveCard}
          />
        ))}
      </div>
      <ArchiveSection
        archivedCards={getArchivedCards()}
        onRestore={unarchiveCard}
        onDelete={deleteCard}
      />
    </DragDropContext>
  );
}
