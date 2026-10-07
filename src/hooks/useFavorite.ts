"use client";

import { useState, useCallback, useEffect } from "react";
import { addTripFavorite, removeTripFavorite, addHotelFavorite, removeHotelFavorite } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { isGuestFavorite, toggleGuestFavorite } from "@/utils/guestFavorites";

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
  const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    if (typeof window !== "undefined" && !isAuthenticated) {
      return isGuestFavorite(kind, slug);
    }
    return initialFavorite;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setIsFavorite(initialFavorite);
      return;
    }

    setIsFavorite(isGuestFavorite(kind, slug));

    const handleGuestChange = (e: Event) => {
      const custom = e as CustomEvent<{ kind?: string; slug?: string; isFavorite?: boolean }>;
      if (custom.detail?.kind && custom.detail?.slug) {
        if (custom.detail.kind === kind && custom.detail.slug === slug) {
          setIsFavorite(Boolean(custom.detail.isFavorite));
        }
      } else {
        setIsFavorite(isGuestFavorite(kind, slug));
      }
    };

    window.addEventListener("guest_favorites_changed", handleGuestChange);
    return () => {
      window.removeEventListener("guest_favorites_changed", handleGuestChange);
    };
  }, [isAuthenticated, initialFavorite, kind, slug]);

  const toggle = useCallback(async () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const nextState = toggleGuestFavorite(kind, slug);
      setIsFavorite(nextState);
      return;
    }

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
