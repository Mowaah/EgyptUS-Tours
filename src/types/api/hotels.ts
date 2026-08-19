import { PaginatedResponse } from "./index";

export interface HotelRoom {
  id: number;
  external_room_id: string;
  name: string;
  description: string;
  category_label: string;
  type_label: string;
  view_label: string;
  price_per_night: string;
  discount_percent: number;
  features: string[];
  order: number;
  images: { id: number; image: string; order: number }[];
}

export interface HotelReview {
  id: number;
  title: string;
  body: string;
  author_name: string;
  review_date: string;
  rating: string;
  photos: string[];
}

export interface HotelList {
  id: number;
  slug: string;
  name: string;
  location_text: string;
  hero_image: string | null;
  stars: number;
  rating_avg: string;
  review_count: number;
  rooms: number;
  price_per_night: string;
  currency_code: string;
  is_favorite: boolean;
}

export interface HotelDetail extends HotelList {
  subtitle: string;
  address: string;
  description: string;
  second_description: string;
  gallery_images: string[];
  overview_sections: { title: string; body: string }[];
  facilities: string[];
  map_embed_url: string;
  hotel_rooms: HotelRoom[];
  hotel_reviews: HotelReview[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export type HotelPaginatedResponse = PaginatedResponse<HotelList>;
