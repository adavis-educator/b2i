'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { WeeklyCheckin } from '@/types';

export interface WeeklyMetrics {
  checkins: WeeklyCheckin[];
  streak: number;
  averages: {
    body: number | null;
    mind: number | null;
    work: number | null;
    energy: number | null;
  };
  isLoading: boolean;
}

export function useWeeklyMetrics(weekCount: number = 8) {
  const [checkins, setCheckins] = useState<WeeklyCheckin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  const mapRow = (row: Record<string, unknown>): WeeklyCheckin => ({
    id: row.id as string,
    weekOf: row.week_of as string,
    scoreBody: row.score_body as number | null,
    scoreMind: row.score_mind as number | null,
    scoreWork: row.score_work as number | null,
    scoreEnergy: row.score_energy as number | null,
    equanimityNote: (row.equanimity_note as string) || '',
    flagNote: (row.flag_note as string) || '',
    createdAt: row.created_at as string,
  });

  const fetchAll = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('weekly_checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('week_of', { ascending: false })
      .limit(weekCount);

    if (error) {
      console.error('Error fetching weekly metrics:', error);
    } else {
      setCheckins((data || []).map(mapRow));
    }
    setIsLoading(false);
  }, [user, supabase, weekCount]);

  useEffect(() => {
    if (!user) {
      setCheckins([]);
      setIsLoading(false);
      return;
    }
    fetchAll();
  }, [user]);

  // Calculate streak (consecutive weeks with a check-in, starting from most recent)
  const streak = (() => {
    if (checkins.length === 0) return 0;
    let count = 1;
    for (let i = 1; i < checkins.length; i++) {
      const prev = new Date(checkins[i - 1].weekOf);
      const curr = new Date(checkins[i].weekOf);
      const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
      if (Math.abs(diffDays - 7) <= 1) {
        count++;
      } else {
        break;
      }
    }
    return count;
  })();

  // Calculate averages
  const avg = (values: (number | null)[]) => {
    const valid = values.filter((v): v is number => v !== null);
    return valid.length > 0 ? Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10 : null;
  };

  const averages = {
    body: avg(checkins.map((c) => c.scoreBody)),
    mind: avg(checkins.map((c) => c.scoreMind)),
    work: avg(checkins.map((c) => c.scoreWork)),
    energy: avg(checkins.map((c) => c.scoreEnergy)),
  };

  return {
    checkins,
    streak,
    averages,
    isLoading,
  };
}
