'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ChecklistItem } from '@/types';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'friday-shutdown-checklist';

const DEFAULT_ITEMS: ChecklistItem[] = [
  { id: 'default-1', label: 'Inbox Zero', isChecked: false, isDefault: true },
  { id: 'default-2', label: 'Paperbox Zero', isChecked: false, isDefault: true },
  { id: 'default-3', label: 'Review last week calendar - Notebook', isChecked: false, isDefault: true },
  { id: 'default-4', label: 'Review task list and reassign', isChecked: false, isDefault: true },
  { id: 'default-5', label: 'Preview calendar for conflicts', isChecked: false, isDefault: true },
  { id: 'default-6', label: 'Review To Do: Does anything need to move to In Progress?', isChecked: false, isDefault: true },
  { id: 'default-7', label: 'Review In Progress: What is next step? Place on calendar/to-do list', isChecked: false, isDefault: true },
  { id: 'default-8', label: 'Place "big rocks" on calendar', isChecked: false, isDefault: true },
  { id: 'default-9', label: 'Schedule Lunch', isChecked: false, isDefault: true },
  { id: 'default-10', label: 'Schedule workouts', isChecked: false, isDefault: true },
  { id: 'default-11', label: 'Send A9/ALT call for agenda items', isChecked: false, isDefault: true },
  { id: 'default-12', label: 'Make weekend list if necessary', isChecked: false, isDefault: true },
];

export function useChecklist() {
  const [items, setItems, isHydrated] = useLocalStorage<ChecklistItem[]>(STORAGE_KEY, DEFAULT_ITEMS);

  const toggleItem = useCallback((id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  }, [setItems]);

  const addItem = useCallback((label: string) => {
    const newItem: ChecklistItem = {
      id: generateId(),
      label,
      isChecked: false,
      isDefault: false,
    };
    setItems(prev => [...prev, newItem]);
  }, [setItems]);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, [setItems]);

  const resetAll = useCallback(() => {
    setItems(prev =>
      prev.map(item => ({ ...item, isChecked: false }))
    );
  }, [setItems]);

  const resetToDefaults = useCallback(() => {
    setItems(DEFAULT_ITEMS);
  }, [setItems]);

  const reorderItems = useCallback((startIndex: number, endIndex: number) => {
    setItems(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, [setItems]);

  return {
    items,
    isHydrated,
    toggleItem,
    addItem,
    removeItem,
    resetAll,
    resetToDefaults,
    reorderItems,
  };
}
