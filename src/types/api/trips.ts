export interface TripTag {
  id: number;
  name: string;
  slug: string;
  category: string;
}

export interface TripOverview {
  description: string;
  cultural_value: string;
  who_is_it_for: string;
}

export interface TripItineraryDay {
  day_number: number;
  title: string;
  subtitle: string;
  description: string;
  image: string | null;
  value_amount: string | null;
  duration_hours: number | null;
  meals_count: number | null;
  highlights: string[];
  order: number;
}

export interface TripAvailabilitySlot {
  id?: number;
  start_date: string;
  end_date: string;
  capacity_total: number;
  capacity_remaining: number;
  order: number;
}

export interface TripVipExperience {
  title: string;
  description: string;
  image: string | null;
  rating: string;
  review_count: number;
  original_price: string;
  discounted_price: string;
  savings_amount: string;
  badge: string;
  features: string[];
  is_added_default: boolean;
  order: number;
}

export interface TripImportantLink {
  label: string;
  href: string;
  order: number;
}

export interface TripSeasonTier {
  label: string;
  price: string;
  price_egp?: string | null;
  price_eur?: string | null;
  order: number;
}

export interface TripSeasonPricing {
  tour_type?: "private" | "group";
  season_label: string;
  start_date: string | null;
  end_date: string | null;
  order: number;
  tiers: TripSeasonTier[];
}

export interface TripHotelLink {
  order: number;
  hotel: {
    id: number;
    slug: string;
    name: string;
    location_text: string;
    description?: string;
    hero_image: string | null;
    rating?: string | number;
    rating_avg?: string | number;
    stars?: number;
    review_count?: number;
    amenities?: string[];
    facilities?: string[];
    photos?: string[];
  };
}

export interface TripReview {
  id: number;
  author_name: string;
  rating: string;
  title: string;
  body: string;
  review_date: string;
  is_verified_booking: boolean;
  author_country: string | null;
}

export interface TripList {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  location_text: string;
  destinations?: Array<{ name?: string; title?: string; slug?: string } | string>;
  base_price: string;
  base_price_egp?: string | null;
  base_price_eur?: string | null;
  currency_code: string;
  price_label: string;
  duration_days: number;
  duration_nights: number;
  duration: { days: number; nights: number };
  rating_avg: string;
  review_count: number;
  is_featured: boolean;
  image: string | null;
  is_favorite: boolean;
  discount_value?: string | null;
  discount_title?: string | null;
  availability_enabled?: boolean;
  tags: TripTag[];
}

export interface TripDetail extends TripList {
  description: string;
  private_price: string | null;
  private_price_egp?: string | null;
  private_price_eur?: string | null;
  group_price: string | null;
  group_price_egp?: string | null;
  group_price_eur?: string | null;
  overview: TripOverview;
  included: string[];
  excluded: string[];
  itinerary: TripItineraryDay[];
  availability: TripAvailabilitySlot[];
  vip_experiences: TripVipExperience[];
  important_links: TripImportantLink[];
  pricing: TripSeasonPricing[];
  additional_rooms?: { sea_view?: string | null; pool_view?: string | null; };
  additional_rooms_egp?: { sea_view?: string | null; pool_view?: string | null; };
  additional_rooms_eur?: { sea_view?: string | null; pool_view?: string | null; };
  images: string[];
  traveler_photos: string[];
  hotels: TripHotelLink[];
  trip_reviews: TripReview[];
  brochure_url?: string | null;
  created_at: string;
  updated_at: string;
}
