import { addTripFavorite, addHotelFavorite } from "@/lib/api";

const STORAGE_KEY = "egyptus_guest_favorites";

export interface GuestFavoritesData {
  trips: string[];
  hotels: string[];
}

export function getGuestFavorites(): GuestFavoritesData {
  if (typeof window === "undefined") {
    return { trips: [], hotels: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { trips: [], hotels: [] };
    const parsed = JSON.parse(raw);
    return {
      trips: Array.isArray(parsed?.trips) ? parsed.trips : [],
      hotels: Array.isArray(parsed?.hotels) ? parsed.hotels : [],
    };
  } catch {
    return { trips: [], hotels: [] };
  }
}

export function isGuestFavorite(kind: "trip" | "hotel", slug: string): boolean {
  const current = getGuestFavorites();
  const list = kind === "trip" ? current.trips : current.hotels;
  return list.includes(slug);
}

export function toggleGuestFavorite(kind: "trip" | "hotel", slug: string): boolean {
  if (typeof window === "undefined") return false;
  const current = getGuestFavorites();
  const list = kind === "trip" ? [...current.trips] : [...current.hotels];
  const idx = list.indexOf(slug);
  let isFav = false;

  if (idx >= 0) {
    list.splice(idx, 1);
    isFav = false;
  } else {
    list.push(slug);
    isFav = true;
  }

  const updated: GuestFavoritesData = {
    ...current,
    [kind === "trip" ? "trips" : "hotels"]: list,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent("guest_favorites_changed", {
        detail: { kind, slug, isFavorite: isFav },
      })
    );
  } catch (err) {
    console.error("Failed to save guest favorite to localStorage", err);
  }

  return isFav;
}

export function clearGuestFavorites(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("guest_favorites_changed"));
  } catch {}
}

/**
 * Transfers all guest favorites stored in localStorage to the authenticated user's account on the backend.
 */
export async function syncGuestFavoritesToServer(): Promise<void> {
  if (typeof window === "undefined") return;
  const current = getGuestFavorites();
  if (current.trips.length === 0 && current.hotels.length === 0) return;

  const tripPromises = current.trips.map((slug) =>
    addTripFavorite(slug).catch((err) => {
      console.warn(`Failed to sync trip favorite ${slug}:`, err);
    })
  );

  const hotelPromises = current.hotels.map((slug) =>
    addHotelFavorite(slug).catch((err) => {
      console.warn(`Failed to sync hotel favorite ${slug}:`, err);
    })
  );

  await Promise.allSettled([...tripPromises, ...hotelPromises]);

  // Successfully transferred; clear guest storage
  clearGuestFavorites();
  window.dispatchEvent(new Event("favorites_synced"));
}
