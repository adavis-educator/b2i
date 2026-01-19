'use client';

import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'b2i-settings';

interface Settings {
  footerMessage: string;
}

const DEFAULT_SETTINGS: Settings = {
  footerMessage: 'This year, I am choosing to be a leader who is strong, healthy, and equanimous – even when it would be easier to push, rush, or take over.',
};

export function useSettings() {
  const [settings, setSettings, isHydrated] = useLocalStorage<Settings>(STORAGE_KEY, DEFAULT_SETTINGS);

  const updateFooterMessage = (message: string) => {
    setSettings(prev => ({ ...prev, footerMessage: message }));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    isHydrated,
    updateFooterMessage,
    resetToDefaults,
  };
}
