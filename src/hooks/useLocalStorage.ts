'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to track if we've hydrated from localStorage
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize state with initial value (not from localStorage)
  // This ensures SSR/SSG renders match initial client render
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Hydrate from localStorage after mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    setIsHydrated(true);
  }, [key]);

  // Persist to localStorage whenever value changes (after hydration)
  useEffect(() => {
    if (!isHydrated) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, isHydrated]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      return valueToStore;
    });
  }, []);

  return [storedValue, setValue, isHydrated] as const;
}
