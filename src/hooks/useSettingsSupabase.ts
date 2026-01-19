'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

const DEFAULT_FOOTER_MESSAGE =
  'This year, I am choosing to be a leader who is strong, healthy, and equanimous – even when it would be easier to push, rush, or take over.';

interface Settings {
  footerMessage: string;
}

export function useSettingsSupabase() {
  const [settings, setSettings] = useState<Settings>({
    footerMessage: DEFAULT_FOOTER_MESSAGE,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  // Fetch settings
  useEffect(() => {
    if (!user) {
      setSettings({ footerMessage: DEFAULT_FOOTER_MESSAGE });
      setIsLoading(false);
      return;
    }

    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows found
        console.error('Error fetching settings:', error);
      }

      if (data) {
        setSettings({
          footerMessage: data.footer_message,
        });
      } else {
        // Create default settings for user
        const { data: newData, error: insertError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            footer_message: DEFAULT_FOOTER_MESSAGE,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating default settings:', insertError);
        } else if (newData) {
          setSettings({
            footerMessage: newData.footer_message,
          });
        }
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, [user]);

  const updateFooterMessage = useCallback(
    async (message: string) => {
      if (!user) return;

      const { error } = await supabase
        .from('user_settings')
        .update({
          footer_message: message,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating footer message:', error);
      } else {
        setSettings((prev) => ({ ...prev, footerMessage: message }));
      }
    },
    [user, supabase]
  );

  return {
    settings,
    isLoading,
    updateFooterMessage,
  };
}
