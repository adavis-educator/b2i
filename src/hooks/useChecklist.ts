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
  { id: 'default-6', label: 'Goal & projects', isChecked: false, isDefault: true },
  { id: 'default-7', label: 'Review waiting: Does anything need to move to active?', isChecked: false, isDefault: true },
  { id: 'default-8', label: 'Review active: What is next step? Place on calendar/to-do list', isChecked: false, isDefault: true },
  { id: 'default-9', label: 'Place "big rocks" on calendar', isChecked: false, isDefault: true },
  { id: 'default-10', label: 'Schedule Lunch', isChecked: false, isDefault: true },
  { id: 'default-11', label: 'Schedule workouts', isChecked: false, isDefault: true },
  { id: 'default-12', label: 'Send A9/ALT call for agenda items', isChecked: false, isDefault: true },
  { id: 'default-13', label: 'Make weekend list if necessary', isChecked: false, isDefault: true },
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

  return {
    items,
    isHydrated,
    toggleItem,
    addItem,
    removeItem,
    resetAll,
    resetToDefaults,
  };
}
