import { MultiCurrencyPrice } from "@/constants/currency";

export interface Vehicle {
  id: string;
  name: string;
  title?: string;
  type: string;
  image: string;
  gallery?: string[];
  price: string;
  prices?: MultiCurrencyPrice;
  passengers: number;
  luggage: number | string;
  durationHours?: string;
  features?: string[];
  description: string;
  rating: number;
  reviews: number;
  discountValue?: string;
  discountTitle?: string;
  originalPrice?: number;
  originalPrices?: MultiCurrencyPrice;
  pricePerKm?: number;
  pricePerKmPrices?: MultiCurrencyPrice;
}

export interface VehicleRoutePublic {
  id: number;
  route_code: string;
  from_location: string;
  to_location: string;
  price: string;
  price_egp?: string;
  price_eur?: string;
  currency?: string;
}

export interface TransportationBookingData {
  routeId?: number | null;
  pickupLocation: string;
  dropoffLocation: string;
  tripType: "One Way" | "Round Trip";
  pickupDate: string;
  pickupTime: string;
  passengers: number;
  luggage: number;
  additionalServiceIds: number[];
  name: string;
  email: string;
  phone: string;
  nationality: string;
  specialRequests: string;
  termsAccepted: boolean;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
  routePrice?: number;
  routePriceEgp?: number;
  routePriceEur?: number;
  selectedRoute?: VehicleRoutePublic | null;
}

export const INITIAL_TRANSPORT_BOOKING: TransportationBookingData = {
  routeId: null,
  pickupLocation: "",
  dropoffLocation: "",
  tripType: "One Way",
  pickupDate: "",
  pickupTime: "",
  passengers: 2,
  luggage: 1,
  additionalServiceIds: [],
  name: "",
  email: "",
  phone: "",
  nationality: "",
  specialRequests: "",
  termsAccepted: false,
  cardNumber: "",
  cardName: "",
  expiry: "",
  cvv: "",
  routePrice: 0,
  routePriceEgp: undefined,
  routePriceEur: undefined,
  selectedRoute: null,
};
