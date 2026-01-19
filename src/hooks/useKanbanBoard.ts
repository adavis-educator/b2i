'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { KanbanCard, ColumnId, Priority } from '@/types';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'kanban-board';

export function useKanbanBoard() {
  const [cards, setCards, isHydrated] = useLocalStorage<KanbanCard[]>(STORAGE_KEY, []);

  const addCard = useCallback((title: string, columnId: ColumnId = 'todo', dueDate?: string, priority?: Priority) => {
    const newCard: KanbanCard = {
      id: generateId(),
      title,
      columnId,
      createdAt: new Date().toISOString(),
      dueDate,
      priority,
      isArchived: false,
    };
    setCards(prev => [...prev, newCard]);
  }, [setCards]);

  const updateCard = useCallback((id: string, updates: Partial<Omit<KanbanCard, 'id' | 'createdAt'>>) => {
    setCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, ...updates } : card
      )
    );
  }, [setCards]);

  const deleteCard = useCallback((id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
  }, [setCards]);

  const archiveCard = useCallback((id: string) => {
    setCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, isArchived: true } : card
      )
    );
  }, [setCards]);

  const unarchiveCard = useCallback((id: string) => {
    setCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, isArchived: false } : card
      )
    );
  }, [setCards]);

  const moveCard = useCallback((cardId: string, targetColumnId: ColumnId, targetIndex?: number) => {
    setCards(prev => {
      const cardIndex = prev.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return prev;

      const card = prev[cardIndex];
      const otherCards = prev.filter(c => c.id !== cardId);
      const updatedCard = { ...card, columnId: targetColumnId };

      // Get cards in the target column (excluding the moved card)
      const targetColumnCards = otherCards.filter(c => c.columnId === targetColumnId);
      const otherColumnCards = otherCards.filter(c => c.columnId !== targetColumnId);

      // If no target index specified, add to end
      const insertIndex = targetIndex !== undefined ? targetIndex : targetColumnCards.length;

      // Insert the card at the specified position in the target column
      const newTargetCards = [
        ...targetColumnCards.slice(0, insertIndex),
        updatedCard,
        ...targetColumnCards.slice(insertIndex),
      ];

      // Combine all cards (maintaining order: cards from other columns + reordered target column)
      return [...otherColumnCards, ...newTargetCards];
    });
  }, [setCards]);

  const getColumnCards = useCallback((columnId: ColumnId): KanbanCard[] => {
    return cards.filter(card => card.columnId === columnId && !card.isArchived);
  }, [cards]);

  const getArchivedCards = useCallback((): KanbanCard[] => {
    return cards.filter(card => card.isArchived);
  }, [cards]);

  return {
    cards,
    isHydrated,
    addCard,
    updateCard,
    deleteCard,
    archiveCard,
    unarchiveCard,
    moveCard,
    getColumnCards,
    getArchivedCards,
  };
}
