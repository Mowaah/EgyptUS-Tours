export interface TripHotel {
  name: string;
  location: string;
  description: string;
  image: string;
  photos?: string[];
  rating: number;
  reviewCount: number;
  amenities: string[];
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  price: number;
  currency: string;
  priceLabel?: string;
  duration: {
    days: number;
    nights: number;
  };
  countries?: number;
  isFavorite?: boolean;

  // ── Detail-page fields ──────────────────────────────────────
  images?: string[];
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  privatePrice?: number;
  groupPrice?: number;

  overview?: {
    description: string;
    culturalValue: string;
    whoIsItFor: string;
  };

  included?: string[];
  excluded?: string[];

  itinerary?: Array<{
    day: number;
    title: string;
    subtitle?: string;
    description: string;
    image?: string;
    value?: number;
    durationHours?: number;
    meals?: number;
    highlights?: string[];
  }>;

  availability?: Array<{
    dates: string; // e.g. "March 15-19, 2026"
    duration: string; // e.g. "5 Days / 4 Nights"
    spotsLeft: number;
    totalSpots: number;
  }>;

  vipExperiences?: Array<{
    title: string;
    description: string;
    image: string;
    rating: number;
    reviewCount: number;
    originalPrice: number;
    discountedPrice: number;
    savings: number;
    badge?: string; // "MOST POPULAR" | "BEST VALUE" | "LIMITED SPOTS" | "PREMIUM EXPERIENCE"
    features: string[];
    added?: boolean;
  }>;

  importantLinks?: Array<{
    label: string;
    href: string;
  }>;

  pricing?: Array<{
    season: string; // e.g. "Sep – May"
    tiers: Array<{
      label: string; // e.g. "Per Single Cabin"
      price: number;
    }>;
  }>;

  travelerPhotos?: string[];

  hotels?: TripHotel[];
}
