'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { WeeklyCheckin } from '@/types';
import { getWeekMonday } from '@/lib/utils';

export function useWeeklyCheckinSupabase() {
  const [checkin, setCheckin] = useState<WeeklyCheckin | null>(null);
  const [recentCheckins, setRecentCheckins] = useState<WeeklyCheckin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

  const fetchCheckin = useCallback(
    async (weekOf?: string) => {
      if (!user) return;
      const targetWeek = weekOf || getWeekMonday();

      const { data, error } = await supabase
        .from('weekly_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_of', targetWeek)
        .maybeSingle();

      if (error) {
        console.error('Error fetching weekly checkin:', error);
      } else {
        setCheckin(data ? mapRow(data) : null);
      }
    },
    [user, supabase]
  );

  const fetchRecent = useCallback(
    async (count: number = 4) => {
      if (!user) return;

      const { data, error } = await supabase
        .from('weekly_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('week_of', { ascending: false })
        .limit(count);

      if (error) {
        console.error('Error fetching recent checkins:', error);
      } else {
        setRecentCheckins((data || []).map(mapRow));
      }
    },
    [user, supabase]
  );

  useEffect(() => {
    if (!user) {
      setCheckin(null);
      setRecentCheckins([]);
      setIsLoading(false);
      return;
    }

    const load = async () => {
      await Promise.all([fetchCheckin(), fetchRecent()]);
      setIsLoading(false);
    };
    load();
  }, [user]);

  const saveCheckin = useCallback(
    async (data: {
      scoreBody: number | null;
      scoreMind: number | null;
      scoreWork: number | null;
      scoreEnergy: number | null;
      equanimityNote: string;
      flagNote: string;
      weekOf?: string;
    }) => {
      if (!user) return;
      setIsSaving(true);

      const weekOf = data.weekOf || getWeekMonday();
      const row = {
        user_id: user.id,
        week_of: weekOf,
        score_body: data.scoreBody,
        score_mind: data.scoreMind,
        score_work: data.scoreWork,
        score_energy: data.scoreEnergy,
        equanimity_note: data.equanimityNote,
        flag_note: data.flagNote,
      };

      const { data: result, error } = await supabase
        .from('weekly_checkins')
        .upsert(row, { onConflict: 'user_id,week_of' })
        .select()
        .single();

      if (error) {
        console.error('Error saving weekly checkin:', error);
      } else if (result) {
        setCheckin(mapRow(result));
        await fetchRecent();
      }

      setIsSaving(false);
    },
    [user, supabase, fetchRecent]
  );

  return {
    checkin,
    recentCheckins,
    isLoading,
    isSaving,
    saveCheckin,
    fetchCheckin,
  };
}
