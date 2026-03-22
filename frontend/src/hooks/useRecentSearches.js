// ============================================================
// hooks/useRecentSearches.js
// Shared hook — reads & writes recent searches from localStorage.
// Used by both Navbar (display dropdown) and HeroSection (add on generate).
// ============================================================

import { useState, useCallback } from "react";

const STORAGE_KEY = "roadmapai_recent";
const MAX_ITEMS   = 6;

export function useRecentSearches() {
  // Read from localStorage
  const read = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }, []);

  // Add a new search (dedup + trim to MAX_ITEMS)
  const add = useCallback((topic) => {
    if (!topic?.trim()) return;
    const current = (() => {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
      catch { return []; }
    })();
    const updated = [topic.trim(), ...current.filter(t => t !== topic.trim())].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  // Clear all
  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { read, add, clear };
}
