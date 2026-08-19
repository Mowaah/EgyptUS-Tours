export interface HotelRoom {
  id: string;
  name: string;
  description: string;
  images: string[];
  features: string[];
  pricePerNight: number;
  discountPercent?: number;
  type: string;
  category?: string;
  view: string;
}

export interface HotelReview {
  title: string;
  body: string;
  author: string;
  date: string;
  rating: number;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  address?: string;
  image: string;
  images?: string[];
  stars: number;
  rating: number;
  rooms: number;
  pricePerNight: number;
  reviews: number;
  subtitle?: string;
  secondDescription?: string;
  description?: string;
  isFavorite?: boolean;
  overview?: {
    sections: { heading: string; body: string }[];
  };
  facilities?: string[];
  mapEmbedUrl?: string;
  hotelRooms?: HotelRoom[];
  hotelReviews?: HotelReview[];
  relatedTripIds?: string[];
}
