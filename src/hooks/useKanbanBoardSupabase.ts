'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { KanbanCard, ColumnId, Priority } from '@/types';

export function useKanbanBoardSupabase() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  // Fetch cards
  useEffect(() => {
    if (!user) {
      setCards([]);
      setIsLoading(false);
      return;
    }

    const fetchCards = async () => {
      const { data, error } = await supabase
        .from('kanban_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });

      if (error) {
        console.error('Error fetching cards:', error);
      } else {
        setCards(
          data.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description || undefined,
            columnId: c.column_id as ColumnId,
            priority: c.priority as Priority | undefined,
            dueDate: c.due_date || undefined,
            isArchived: c.is_archived,
            createdAt: c.created_at,
          }))
        );
      }
      setIsLoading(false);
    };

    fetchCards();
  }, [user]);

  const addCard = useCallback(
    async (title: string, columnId: ColumnId = 'todo', dueDate?: string, priority?: Priority) => {
      if (!user) return;

      // Get max position for this column
      const columnCards = cards.filter((c) => c.columnId === columnId && !c.isArchived);
      const maxPosition = columnCards.length > 0
        ? Math.max(...columnCards.map((c, i) => i)) + 1
        : 0;

      const { data, error } = await supabase
        .from('kanban_cards')
        .insert({
          user_id: user.id,
          title,
          column_id: columnId,
          due_date: dueDate || null,
          priority: priority || null,
          position: maxPosition,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding card:', error);
      } else if (data) {
        setCards((prev) => [
          ...prev,
          {
            id: data.id,
            title: data.title,
            description: data.description || undefined,
            columnId: data.column_id as ColumnId,
            priority: data.priority as Priority | undefined,
            dueDate: data.due_date || undefined,
            isArchived: data.is_archived,
            createdAt: data.created_at,
          },
        ]);
      }
    },
    [user, cards, supabase]
  );

  const updateCard = useCallback(
    async (id: string, updates: Partial<Omit<KanbanCard, 'id' | 'createdAt'>>) => {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.columnId !== undefined) dbUpdates.column_id = updates.columnId;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
      if (updates.isArchived !== undefined) dbUpdates.is_archived = updates.isArchived;

      const { error } = await supabase
        .from('kanban_cards')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        console.error('Error updating card:', error);
      } else {
        setCards((prev) =>
          prev.map((card) => (card.id === id ? { ...card, ...updates } : card))
        );
      }
    },
    [supabase]
  );

  const deleteCard = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('kanban_cards').delete().eq('id', id);

      if (error) {
        console.error('Error deleting card:', error);
      } else {
        setCards((prev) => prev.filter((card) => card.id !== id));
      }
    },
    [supabase]
  );

  const archiveCard = useCallback(
    async (id: string) => {
      await updateCard(id, { isArchived: true });
    },
    [updateCard]
  );

  const unarchiveCard = useCallback(
    async (id: string) => {
      await updateCard(id, { isArchived: false });
    },
    [updateCard]
  );

  const moveCard = useCallback(
    async (cardId: string, targetColumnId: ColumnId, targetIndex?: number) => {
      const card = cards.find((c) => c.id === cardId);
      if (!card) return;

      // Update local state immediately for responsiveness
      setCards((prev) => {
        const cardIndex = prev.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return prev;

        const updatedCard = { ...prev[cardIndex], columnId: targetColumnId };
        const otherCards = prev.filter((c) => c.id !== cardId);
        const targetColumnCards = otherCards.filter(
          (c) => c.columnId === targetColumnId && !c.isArchived
        );
        const otherColumnCards = otherCards.filter(
          (c) => c.columnId !== targetColumnId || c.isArchived
        );

        const insertIndex =
          targetIndex !== undefined ? targetIndex : targetColumnCards.length;

        const newTargetCards = [
          ...targetColumnCards.slice(0, insertIndex),
          updatedCard,
          ...targetColumnCards.slice(insertIndex),
        ];

        return [...otherColumnCards, ...newTargetCards];
      });

      // Update in database
      const { error } = await supabase
        .from('kanban_cards')
        .update({
          column_id: targetColumnId,
          position: targetIndex ?? 0,
        })
        .eq('id', cardId);

      if (error) {
        console.error('Error moving card:', error);
      }
    },
    [cards, supabase]
  );

  const getColumnCards = useCallback(
    (columnId: ColumnId): KanbanCard[] => {
      return cards.filter((card) => card.columnId === columnId && !card.isArchived);
    },
    [cards]
  );

  const getArchivedCards = useCallback((): KanbanCard[] => {
    return cards.filter((card) => card.isArchived);
  }, [cards]);

  return {
    cards,
    isLoading,
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
