'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { MonthlyReview } from '@/types';
import { getMonthOf } from '@/lib/utils';

export function useMonthlyReviewSupabase() {
  const [review, setReview] = useState<MonthlyReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();

  const mapRow = (row: Record<string, unknown>): MonthlyReview => ({
    id: row.id as string,
    monthOf: row.month_of as string,
    trendsNote: (row.trends_note as string) || '',
    keystoneNote: (row.keystone_note as string) || '',
    nextWhyNote: (row.next_why_note as string) || '',
    adjustNote: (row.adjust_note as string) || '',
    createdAt: row.created_at as string,
  });

  const fetchReview = useCallback(
    async (monthOf?: string) => {
      if (!user) return;
      const targetMonth = monthOf || getMonthOf();

      const { data, error } = await supabase
        .from('monthly_reviews')
        .select('*')
        .eq('user_id', user.id)
        .eq('month_of', targetMonth)
        .maybeSingle();

      if (error) {
        console.error('Error fetching monthly review:', error);
      } else {
        setReview(data ? mapRow(data) : null);
      }
    },
    [user, supabase]
  );

  useEffect(() => {
    if (!user) {
      setReview(null);
      setIsLoading(false);
      return;
    }

    const load = async () => {
      await fetchReview();
      setIsLoading(false);
    };
    load();
  }, [user]);

  const saveReview = useCallback(
    async (data: {
      trendsNote: string;
      keystoneNote: string;
      nextWhyNote: string;
      adjustNote: string;
      monthOf?: string;
    }) => {
      if (!user) return;
      setIsSaving(true);

      const monthOf = data.monthOf || getMonthOf();
      const row = {
        user_id: user.id,
        month_of: monthOf,
        trends_note: data.trendsNote,
        keystone_note: data.keystoneNote,
        next_why_note: data.nextWhyNote,
        adjust_note: data.adjustNote,
      };

      const { data: result, error } = await supabase
        .from('monthly_reviews')
        .upsert(row, { onConflict: 'user_id,month_of' })
        .select()
        .single();

      if (error) {
        console.error('Error saving monthly review:', error);
      } else if (result) {
        setReview(mapRow(result));
      }

      setIsSaving(false);
    },
    [user, supabase]
  );

  return {
    review,
    isLoading,
    isSaving,
    saveReview,
    fetchReview,
  };
}
