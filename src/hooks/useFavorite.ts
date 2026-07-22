"use client";

import { useState, useCallback } from "react";
import { addTripFavorite, removeTripFavorite, addHotelFavorite, removeHotelFavorite } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type FavoriteKind = "trip" | "hotel";

interface UseFavoriteOptions {
  slug: string;
  kind: FavoriteKind;
  initialFavorite?: boolean;
}

interface UseFavoriteReturn {
  isFavorite: boolean;
  isLoading: boolean;
  toggle: () => Promise<void>;
}

export function useFavorite({ slug, kind, initialFavorite = false }: UseFavoriteOptions): UseFavoriteReturn {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = useCallback(async () => {
    if (!isAuthenticated) return;
    if (isLoading) return;

    const wasActive = isFavorite;
    // Optimistic update
    setIsFavorite(!wasActive);
    setIsLoading(true);

    try {
      if (wasActive) {
        if (kind === "trip") await removeTripFavorite(slug);
        else await removeHotelFavorite(slug);
      } else {
        if (kind === "trip") await addTripFavorite(slug);
        else await addHotelFavorite(slug);
      }
    } catch {
      // Rollback on failure
      setIsFavorite(wasActive);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isLoading, isFavorite, slug, kind]);

  return { isFavorite, isLoading, toggle };
}
