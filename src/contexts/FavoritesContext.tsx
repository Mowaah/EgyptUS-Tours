"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getFavoriteTripIds,
  getFavoriteHotelIds,
  addTripFavorite,
  removeTripFavorite,
  addHotelFavorite,
  removeHotelFavorite,
} from "@/lib/api";
import {
  getGuestFavorites,
  toggleGuestFavorite,
  GuestFavoritesData,
} from "@/utils/guestFavorites";

type FavoriteKind = "trip" | "hotel";

interface FavoritesContextType {
  isFavorite: (kind: FavoriteKind, slug: string, fallback?: boolean) => boolean;
  toggleFavorite: (kind: FavoriteKind, slug: string) => Promise<boolean>;
  isLoadingFavorites: boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [guestFavorites, setGuestFavorites] = useState<GuestFavoritesData>({ trips: [], hotels: [] });
  const [userTripFavorites, setUserTripFavorites] = useState<Set<string>>(new Set());
  const [userHotelFavorites, setUserHotelFavorites] = useState<Set<string>>(new Set());
  const [hasLoadedUserFavorites, setHasLoadedUserFavorites] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

  // Keep a ref to user favorites for synchronous optimistic updates
  const userTripFavsRef = useRef(userTripFavorites);
  userTripFavsRef.current = userTripFavorites;
  const userHotelFavsRef = useRef(userHotelFavorites);
  userHotelFavsRef.current = userHotelFavorites;

  // Initialize guest favorites from localStorage on mount
  useEffect(() => {
    setGuestFavorites(getGuestFavorites());

    const handleGuestChange = () => {
      setGuestFavorites(getGuestFavorites());
    };

    window.addEventListener("guest_favorites_changed", handleGuestChange);
    return () => {
      window.removeEventListener("guest_favorites_changed", handleGuestChange);
    };
  }, []);

  // Fetch authenticated favorites from the server when logged in
  const fetchUserFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setUserTripFavorites(new Set());
      setUserHotelFavorites(new Set());
      setHasLoadedUserFavorites(false);
      return;
    }

    setIsLoadingFavorites(true);
    try {
      const [tripsSet, hotelsSet] = await Promise.all([
        getFavoriteTripIds(),
        getFavoriteHotelIds(),
      ]);
      setUserTripFavorites(tripsSet);
      setUserHotelFavorites(hotelsSet);
      setHasLoadedUserFavorites(true);
    } catch (err) {
      console.error("Failed to load user favorites:", err);
    } finally {
      setIsLoadingFavorites(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        fetchUserFavorites();
      } else {
        setHasLoadedUserFavorites(false);
        setUserTripFavorites(new Set());
        setUserHotelFavorites(new Set());
      }
    }
  }, [isAuthenticated, authLoading, fetchUserFavorites]);

  // Listen for favorites_synced event (after guest favorites transfer to server on login)
  useEffect(() => {
    const handleFavoritesSynced = () => {
      fetchUserFavorites();
    };

    window.addEventListener("favorites_synced", handleFavoritesSynced);
    return () => {
      window.removeEventListener("favorites_synced", handleFavoritesSynced);
    };
  }, [fetchUserFavorites]);

  const isFavorite = useCallback(
    (kind: FavoriteKind, slug: string, fallback: boolean = false): boolean => {
      if (!slug) return false;

      if (!isAuthenticated) {
        const list = kind === "trip" ? guestFavorites.trips : guestFavorites.hotels;
        return list.includes(slug);
      }

      const userSet = kind === "trip" ? userTripFavsRef.current : userHotelFavsRef.current;
      if (hasLoadedUserFavorites) {
        return userSet.has(slug);
      }

      // If user favorites are still loading from backend, honor optimistic set or SSR fallback
      return userSet.has(slug) || fallback;
    },
    [isAuthenticated, guestFavorites, hasLoadedUserFavorites]
  );

  const toggleFavorite = useCallback(
    async (kind: FavoriteKind, slug: string): Promise<boolean> => {
      if (!slug) return false;

      if (!isAuthenticated) {
        const nextState = toggleGuestFavorite(kind, slug);
        setGuestFavorites(getGuestFavorites());
        return nextState;
      }

      const currentSet = kind === "trip" ? userTripFavsRef.current : userHotelFavsRef.current;
      const wasFav = currentSet.has(slug);
      const nextFav = !wasFav;

      // Optimistic update
      const newSet = new Set(currentSet);
      if (nextFav) {
        newSet.add(slug);
      } else {
        newSet.delete(slug);
      }

      if (kind === "trip") {
        setUserTripFavorites(newSet);
      } else {
        setUserHotelFavorites(newSet);
      }

      try {
        if (nextFav) {
          if (kind === "trip") await addTripFavorite(slug);
          else await addHotelFavorite(slug);
        } else {
          if (kind === "trip") await removeTripFavorite(slug);
          else await removeHotelFavorite(slug);
        }
        return nextFav;
      } catch (err) {
        console.error(`Failed to toggle favorite for ${slug}:`, err);
        // Rollback on failure
        if (kind === "trip") {
          setUserTripFavorites(currentSet);
        } else {
          setUserHotelFavorites(currentSet);
        }
        return wasFav;
      }
    },
    [isAuthenticated]
  );

  return (
    <FavoritesContext.Provider
      value={{
        isFavorite,
        toggleFavorite,
        isLoadingFavorites,
        refreshFavorites: fetchUserFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
