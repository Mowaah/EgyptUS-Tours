"use client";

import { useState, useCallback } from "react";
import { useFavorites } from "@/contexts/FavoritesContext";

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
  const { isFavorite: checkFavorite, toggleFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);

  const isFav = checkFavorite(kind, slug, initialFavorite);

  const toggle = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await toggleFavorite(kind, slug);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toggleFavorite, kind, slug]);

  return { isFavorite: isFav, isLoading, toggle };
}
