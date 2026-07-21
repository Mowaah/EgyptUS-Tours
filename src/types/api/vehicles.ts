export interface VehicleReview {
  id?: number;
  title: string;
  body: string;
  author_name: string;
  review_date: string;
  rating: string;
}

export interface VehicleGalleryImage {
  id?: number;
  image: string;
  order?: number;
  is_primary?: boolean;
}

export interface VehicleList {
  id: number;
  slug: string;
  title: string;
  name: string;
  type: string;
  vehicle_type: string;
  image: string | null;
  price: string;
  price_amount: string;
  currency_code: string;
  passengers: number;
  luggage: string;
  duration_hours_min?: number;
  duration_hours_max?: number;
  rating: string;
  rating_avg: string;
  reviews: number;
  review_count: number;
  features: string[];
  is_featured: boolean;
}

export interface VehicleDetail extends VehicleList {
  description: string;
  gallery: VehicleGalleryImage[];
  duration?: {
    hours_min: number;
    hours_max: number;
  };
  vehicle_reviews: VehicleReview[];
}

export interface VehiclePaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VehicleList[];
}
