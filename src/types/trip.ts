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
}
