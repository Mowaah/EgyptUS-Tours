// Shared booking data types used across BookPrivateTripPage, BookGroupTripPage, etc.

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  rooms: Record<string, number>;
  specialRequests: string;
  termsAccepted: boolean;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
  // Group trips specific fields
  departureMonth?: string;
  departureDateId?: string;
  roomCustomizations?: Record<string, string[]>;
}

export const INITIAL_BOOKING_DATA: BookingData = {
  name: "",
  email: "",
  phone: "",
  nationality: "",
  startDate: "",
  endDate: "",
  adults: 0,
  children: 0,
  infants: 0,
  rooms: { single: 0, double: 0, triple: 0 },
  specialRequests: "",
  termsAccepted: false,
  cardNumber: "",
  cardName: "",
  expiry: "",
  cvv: "",
  departureMonth: "",
  departureDateId: "",
  roomCustomizations: {},
};
