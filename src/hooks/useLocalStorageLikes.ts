"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "cr7_moments_liked_ids";

export function useLocalStorageLikes() {
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load liked moment IDs from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setLikedIds(parsed);
          }
        }
      }
    } catch {
      // Fallback if localStorage is disabled or throws
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Toggle like status for a moment
  const toggleLike = useCallback((id: string): boolean => {
    let nextLiked = false;
    setLikedIds((prev) => {
      const alreadyLiked = prev.includes(id);
      nextLiked = !alreadyLiked;
      const updated = alreadyLiked ? prev.filter((item) => item !== id) : [...prev, id];

      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
      } catch {}

      return updated;
    });

    return nextLiked;
  }, []);

  const isLiked = useCallback(
    (id: string): boolean => {
      return likedIds.includes(id);
    },
    [likedIds]
  );

  return {
    likedIds,
    toggleLike,
    isLiked,
    totalLikes: likedIds.length,
    isLoaded,
  };
}
