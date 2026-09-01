export interface Vehicle {
  id: string;
  name: string;
  type: string;
  image: string;
  gallery?: string[];
  price: string;
  passengers: number;
  luggage: number;
  description: string;
  rating: number;
  reviews: number;
  discountValue?: string;
  discountTitle?: string;
  originalPrice?: number;
}

export interface TransportationBookingData {
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
}

export const INITIAL_TRANSPORT_BOOKING: TransportationBookingData = {
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
};
