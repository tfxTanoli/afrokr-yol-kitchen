import { useState, useEffect, useCallback } from 'react';

const RECENT_SEARCHES_STORAGE_KEY = 'afrodelicious_recent_searches_v1';
const MAX_RECENT_SEARCHES = 10;

export const DEFAULT_TRENDING_SEARCHES = [
  'Thiéboudienne',
  'Attiéké Garba',
  'Colombo de Cabri',
  'Bokit',
  'Yassa Poulet',
  'Alloco',
  'Jerk Chicken',
  'Sauce Gombo'
];

/**
 * Retrieves the stored recent searches from localStorage safely.
 */
export const getStoredRecentSearches = (): string[] => {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
    }
    return [];
  } catch (error) {
    console.error('Error reading recent searches from localStorage:', error);
    return [];
  }
};

/**
 * Saves a new search term to localStorage and returns the updated list.
 */
export const saveRecentSearch = (term: string): string[] => {
  const clean = term.trim();
  if (!clean || clean.length < 2) return getStoredRecentSearches();

  try {
    const current = getStoredRecentSearches();
    // Filter out case-insensitive duplicates
    const filtered = current.filter(item => item.toLowerCase() !== clean.toLowerCase());
    // Prepend new search term to the front
    const updated = [clean, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving recent search to localStorage:', error);
    return [];
  }
};

/**
 * Deletes a specific search term from localStorage.
 */
export const deleteRecentSearch = (term: string): string[] => {
  try {
    const current = getStoredRecentSearches();
    const updated = current.filter(item => item.toLowerCase() !== term.toLowerCase());
    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error deleting recent search from localStorage:', error);
    return [];
  }
};

/**
 * Clears all recent searches from localStorage.
 */
export const clearAllRecentSearches = (): void => {
  try {
    localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recent searches from localStorage:', error);
  }
};

/**
 * React hook to manage recent searches with reactivity and storage synchronization.
 */
export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => getStoredRecentSearches());

  // Listen for storage changes across tabs or window events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === RECENT_SEARCHES_STORAGE_KEY) {
        setRecentSearches(getStoredRecentSearches());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addSearch = useCallback((term: string) => {
    const updated = saveRecentSearch(term);
    setRecentSearches(updated);
  }, []);

  const removeSearch = useCallback((term: string) => {
    const updated = deleteRecentSearch(term);
    setRecentSearches(updated);
  }, []);

  const clearSearches = useCallback(() => {
    clearAllRecentSearches();
    setRecentSearches([]);
  }, []);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearSearches,
    trendingSearches: DEFAULT_TRENDING_SEARCHES
  };
};
