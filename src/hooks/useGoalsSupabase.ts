'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Goal } from '@/types';

export function useGoalsSupabase() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  // Fetch goals
  useEffect(() => {
    if (!user) {
      setGoals([]);
      setIsLoading(false);
      return;
    }

    const fetchGoals = async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching goals:', error);
      } else {
        setGoals(
          data.map((g) => ({
            id: g.id,
            title: g.title,
            isCompleted: g.is_completed,
            createdAt: g.created_at,
          }))
        );
      }
      setIsLoading(false);
    };

    fetchGoals();
  }, [user]);

  const addGoal = useCallback(
    async (title: string) => {
      if (!user) return;

      const { data, error } = await supabase
        .from('goals')
        .insert({ user_id: user.id, title })
        .select()
        .single();

      if (error) {
        console.error('Error adding goal:', error);
      } else if (data) {
        setGoals((prev) => [
          ...prev,
          {
            id: data.id,
            title: data.title,
            isCompleted: data.is_completed,
            createdAt: data.created_at,
          },
        ]);
      }
    },
    [user, supabase]
  );

  const toggleGoal = useCallback(
    async (id: string) => {
      const goal = goals.find((g) => g.id === id);
      if (!goal) return;

      const { error } = await supabase
        .from('goals')
        .update({ is_completed: !goal.isCompleted })
        .eq('id', id);

      if (error) {
        console.error('Error toggling goal:', error);
      } else {
        setGoals((prev) =>
          prev.map((g) =>
            g.id === id ? { ...g, isCompleted: !g.isCompleted } : g
          )
        );
      }
    },
    [goals, supabase]
  );

  const deleteGoal = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('goals').delete().eq('id', id);

      if (error) {
        console.error('Error deleting goal:', error);
      } else {
        setGoals((prev) => prev.filter((g) => g.id !== id));
      }
    },
    [supabase]
  );

  return {
    goals,
    isLoading,
    addGoal,
    toggleGoal,
    deleteGoal,
  };
}
