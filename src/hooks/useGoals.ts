'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Goal } from '@/types';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'annual-goals';

export function useGoals() {
  const [goals, setGoals, isHydrated] = useLocalStorage<Goal[]>(STORAGE_KEY, []);

  const addGoal = useCallback((title: string) => {
    const newGoal: Goal = {
      id: generateId(),
      title,
      isCompleted: false,
    };
    setGoals(prev => [...prev, newGoal]);
  }, [setGoals]);

  const updateGoal = useCallback((id: string, updates: Partial<Omit<Goal, 'id'>>) => {
    setGoals(prev =>
      prev.map(goal =>
        goal.id === id ? { ...goal, ...updates } : goal
      )
    );
  }, [setGoals]);

  const toggleGoal = useCallback((id: string) => {
    setGoals(prev =>
      prev.map(goal =>
        goal.id === id ? { ...goal, isCompleted: !goal.isCompleted } : goal
      )
    );
  }, [setGoals]);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  }, [setGoals]);

  return {
    goals,
    isHydrated,
    addGoal,
    updateGoal,
    toggleGoal,
    deleteGoal,
  };
}
