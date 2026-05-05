/**
 * Temporary demo data for the profile page.
 * Remove this file and wire ProfilePage to your API / server state when ready.
 */

import type {
  TripBookingCardProps,
  TripBookingDetails,
  HotelBookingDetails,
  TransportBookingDetails,
} from "@/components/shared";
import type { Trip } from "@/types";

export const mockProfileUser = {
  name: "Username",
  email: "officialprashanttt@gmail.com",
  avatar: null as string | null,
  bookingsCount: 4,
  requestsCount: 5,
};

export const mockUpcomingTrip = {
  title: "Classic Egypt Tour Cair& Luxor",
  dates: "Apr 20 — Apr 28, 2026",
  duration: "8 Days",
  type: "Private Tour",
  targetDate: new Date("2026-04-20T00:00:00"),
};

export const mockFavoriteTrips: Trip[] = [
  {
    id: "fav-1",
    title: "Luxury 5 days Luxor and Aswan Nile Cruise",
    description:
      "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    image: "/images/home/hero-bg.png",
    location: "Luxor & Aswan",
    price: 2000,
    currency: "$",
    duration: { days: 8, nights: 7 },
    isFavorite: true,
  },
  {
    id: "fav-2",
    title: "Classic Egypt: Cairo, Luxor & Abu Simbel",
    description:
      "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    image: "/images/home/hero-bg.png",
    location: "Cairo & Luxor",
    price: 1899,
    currency: "$",
    duration: { days: 10, nights: 9 },
    isFavorite: true,
  },
  {
    id: "fav-3",
    title: "Christmas Nile Cruise & Pyramids",
    description:
      "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    image: "/images/home/hero-bg.png",
    location: "Cairo & Nile",
    price: 2499,
    currency: "$",
    duration: { days: 12, nights: 11 },
    isFavorite: true,
  },
  {
    id: "fav-4",
    title: "Desert Safari & Red Sea Escape",
    description:
      "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    image: "/images/home/hero-bg.png",
    location: "Hurghada & Western Desert",
    price: 1599,
    currency: "$",
    duration: { days: 7, nights: 6 },
    isFavorite: true,
  },
];

export const profileBookingCategoryTabs = ["Trips", "Hotels", "Transportation"];

const sharedTripBookingDetails: TripBookingDetails = {
  tripName: "Mediterranean",
  destination: "Santorini, Greece",
  returnDate: "April 22, 2026",
  departureDate: "April 15, 2026",
  travelType: "Private",
  durationLabel: "7 Nights / 8 Days",
  roomType: "Single Room",
  roomExtraCount: 3,
  travelersLabel: "2 Adults",
};

export const mockTripBookings: TripBookingCardProps[] = [
  {
    imageSrc: "/images/home/hero-bg.png",
    tripTitle: "Luxury 5 days Luxor and Aswan Nile Cruise",
    timerLabel: "11d 6h 54m left",
    status: "partially_paid",
    details: sharedTripBookingDetails,
    paidAmount: 1470,
    remainingAmount: 3430,
    primaryLabel: "Complete Payment",
    primaryHref: "/trips",
  },
  {
    imageSrc: "/images/home/hero-bg.png",
    tripTitle: "Luxury 5 days Luxor and Aswan Nile Cruise",
    timerLabel: "11d 6h 54m left",
    status: "confirmed",
    details: sharedTripBookingDetails,
    totalAmount: 4900,
    primaryLabel: "View Details",
    primaryHref: "/trips",
  },
  {
    imageSrc: "/images/home/hero-bg.png",
    tripTitle: "Luxury 5 days Luxor and Aswan Nile Cruise",
    status: "cancelled",
    details: sharedTripBookingDetails,
    cancelledLabel: "Cancelled by You — Apr 1, 2026",
    primaryLabel: "View Details",
    primaryHref: "/trips",
  },
];

const sharedHotelBookingDetails: HotelBookingDetails = {
  checkIn: "Sun, Mar 15 From 15:00",
  checkOut: "Sun, Mar 22 Until 11:00",
  nights: "1 Night",
  roomType: "Single Room",
  roomExtraCount: 3,
  roomNumber: "1 Room",
  guests: "2 Guests",
};

export const mockHotelBookings: TripBookingCardProps[] = [
  {
    variant: "hotel",
    imageSrc: "/images/hotels/hotel6.png",
    tripTitle: "Pyramids View Luxury Hotel",
    timerLabel: "11d 6h 54m left",
    status: "partially_paid",
    details: sharedHotelBookingDetails,
    paidAmount: 1470,
    remainingAmount: 3430,
    primaryLabel: "Complete Payment",
    primaryHref: "/hotels",
  },
  {
    variant: "hotel",
    imageSrc: "/images/hotels/hotel6.png",
    tripTitle: "Pyramids View Luxury Hotel",
    timerLabel: "11d 6h 54m left",
    status: "confirmed",
    details: sharedHotelBookingDetails,
    totalAmount: 4900,
    primaryLabel: "View Details",
    primaryHref: "/hotels",
  },
  {
    variant: "hotel",
    imageSrc: "/images/hotels/hotel6.png",
    tripTitle: "Pyramids View Luxury Hotel",
    status: "cancelled",
    details: sharedHotelBookingDetails,
    cancelledLabel: "Cancelled by You — Apr 1, 2026",
    primaryLabel: "View Details",
    primaryHref: "/hotels",
  },
];

const sharedTransportBookingDetails: TransportBookingDetails = {
  pickupLocation: "Santorini, Greece",
  dropoffLocation: "Santorini, Greece",
  pickupDate: "April 22, 2026",
  pickupTime: "2:20 AM",
  durationLabel: "4 Hours",
  passengersLabel: "4 Passengers",
  tripType: "One Way",
  luggageLabel: "2 Bags",
};

export const mockTransportBookings: TripBookingCardProps[] = [
  {
    variant: "transport",
    imageSrc: "/images/car1.jpg",
    tripTitle: "Premium Sedan - Mercedes S-Class",
    timerLabel: "11d 6h 54m left",
    status: "partially_paid",
    details: sharedTransportBookingDetails,
    paidAmount: 1470,
    remainingAmount: 3430,
    primaryLabel: "Complete Payment",
    primaryHref: "/transportation",
  },
  {
    variant: "transport",
    imageSrc: "/images/car1.jpg",
    tripTitle: "Premium Sedan - Mercedes S-Class",
    timerLabel: "11d 6h 54m left",
    status: "confirmed",
    details: sharedTransportBookingDetails,
    totalAmount: 4900,
    primaryLabel: "View Details",
    primaryHref: "/transportation",
  },
  {
    variant: "transport",
    imageSrc: "/images/car1.jpg",
    tripTitle: "Premium Sedan - Mercedes S-Class",
    status: "cancelled",
    details: sharedTransportBookingDetails,
    cancelledLabel: "Cancelled by Admin — Apr 1, 2026",
    primaryLabel: "View Details",
    primaryHref: "/transportation",
  },
];
