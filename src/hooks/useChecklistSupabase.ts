'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ChecklistItem } from '@/types';

const DEFAULT_ITEMS = [
  'Inbox Zero',
  'Paperbox Zero',
  'Review last week calendar - Notebook',
  'Review task list and reassign',
  'Preview calendar for conflicts',
  'Review To Do: Does anything need to move to In Progress?',
  'Review In Progress: What is next step? Place on calendar/to-do list',
  'Place "big rocks" on calendar',
  'Schedule Lunch',
  'Schedule workouts',
  'Send A9/ALT call for agenda items',
  'Make weekend list if necessary',
];

export function useChecklistSupabase() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();
  const hasInitialized = useRef(false);

  // Fetch checklist items
  useEffect(() => {
    if (!user) {
      setItems([]);
      setIsLoading(false);
      hasInitialized.current = false;
      return;
    }

    // Prevent double-initialization from React StrictMode or fast re-renders
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('checklist_items')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });

      if (error) {
        console.error('Error fetching checklist:', error);
        setIsLoading(false);
        return;
      }

      // If user has no items, create default ones
      if (data.length === 0) {
        const defaultInserts = DEFAULT_ITEMS.map((label, index) => ({
          user_id: user.id,
          label,
          is_checked: false,
          position: index,
        }));

        const { data: newData, error: insertError } = await supabase
          .from('checklist_items')
          .insert(defaultInserts)
          .select();

        if (insertError) {
          console.error('Error creating default checklist:', insertError);
        } else if (newData) {
          setItems(
            newData.map((item) => ({
              id: item.id,
              label: item.label,
              isChecked: item.is_checked,
              isDefault: false,
            }))
          );
        }
      } else {
        setItems(
          data.map((item) => ({
            id: item.id,
            label: item.label,
            isChecked: item.is_checked,
            isDefault: false,
          }))
        );
      }
      setIsLoading(false);
    };

    fetchItems();
  }, [user]);

  const toggleItem = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      const { error } = await supabase
        .from('checklist_items')
        .update({ is_checked: !item.isChecked })
        .eq('id', id);

      if (error) {
        console.error('Error toggling item:', error);
      } else {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, isChecked: !i.isChecked } : i))
        );
      }
    },
    [items, supabase]
  );

  const addItem = useCallback(
    async (label: string) => {
      if (!user) return;

      const maxPosition = items.length;

      const { data, error } = await supabase
        .from('checklist_items')
        .insert({
          user_id: user.id,
          label,
          is_checked: false,
          position: maxPosition,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding item:', error);
      } else if (data) {
        setItems((prev) => [
          ...prev,
          {
            id: data.id,
            label: data.label,
            isChecked: data.is_checked,
            isDefault: false,
          },
        ]);
      }
    },
    [user, items, supabase]
  );

  const removeItem = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from('checklist_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing item:', error);
      } else {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    },
    [supabase]
  );

  const resetAll = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from('checklist_items')
      .update({ is_checked: false })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error resetting checklist:', error);
    } else {
      setItems((prev) => prev.map((item) => ({ ...item, isChecked: false })));
    }
  }, [user, supabase]);

  const reorderItems = useCallback(
    async (startIndex: number, endIndex: number) => {
      // Update local state immediately
      setItems((prev) => {
        const result = Array.from(prev);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
      });

      // Get the reordered items and update positions in database
      const reordered = [...items];
      const [removed] = reordered.splice(startIndex, 1);
      reordered.splice(endIndex, 0, removed);

      // Update positions in database
      const updates = reordered.map((item, index) => ({
        id: item.id,
        position: index,
      }));

      for (const update of updates) {
        await supabase
          .from('checklist_items')
          .update({ position: update.position })
          .eq('id', update.id);
      }
    },
    [items, supabase]
  );

  return {
    items,
    isLoading,
    toggleItem,
    addItem,
    removeItem,
    resetAll,
    reorderItems,
  };
}
