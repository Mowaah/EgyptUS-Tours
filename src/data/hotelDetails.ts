import { Hotel } from "@/types";

export const MOCK_HOTEL_DETAIL: Hotel = {
  id: "nile-palace-hotel",
  name: "Nile Palace Hotel & Spa",
  location: "Cairo",
  address: "123 Corniche El Nile, Cairo, Egypt",
  image: "/images/hotels/hotel1.jpg", // Placeholder paths
  images: [
    "/images/hotels/hotel1.jpg",
    "/images/hotels/hotel2.jpg",
    "/images/hotels/hotel3.jpg",
    "/images/hotels/hotel4.jpg",
    "/images/hotels/hotel5.jpg",
  ],
  stars: 5,
  rating: 4.5,
  rooms: 324,
  pricePerNight: 180,
  reviews: 324,
  description: "Your gateway to Cairo's iconic landmarks.",
  isFavorite: false,
  overview: {
    sections: [
      {
        heading: "Prime Location & Accessibility",
        body: "Nestled in the heart of Cairo along the iconic Nile Corniche, the Nile Palace Hotel & Spa offers panoramic Nile views and direct access to the city's vibrant center. Ideally located near the Egyptian Museum, Khan El Khalili, and the Great Pyramids of Giza, guests can easily explore Egypt's most iconic landmarks."
      },
      {
        heading: "Luxury & Guest Experience",
        body: "Blending timeless Egyptian heritage with contemporary five-star comfort, the hotel offers elegant interiors, premium amenities, and exceptional hospitality. Whether traveling for leisure, romance, family vacations, or business, guests enjoy a refined atmosphere designed for relaxation, cultural discovery, and unforgettable Nile-side moments."
      }
    ]
  },
  facilities: [
    "Private Beach", "Infinity Pool", "Spa & Wellness Center", "Fitness Center", "Free WiFi",
    "Water Sports", "Fine Dining Restaurant", "Airport Transfer", "24/7 Room Service"
  ],
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.66318855416!2d31.233333!3d30.044422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzQwLjAiTiAzMcKwMTQnMDAuMCJF!5e0!3m2!1sen!2seg!4v1614567890123!5m2!1sen!2seg",
  hotelRooms: [
    {
      id: "room-1",
      name: "Superior Twin Room",
      description: "Elegant twin room offering modern amenities and relaxing vibes.",
      images: ["/images/hotels/hotel6.png"],
      features: ["Breakfast", "Free Wifi", "Sea View", "No Smoking", "Air Conditioner"],
      pricePerNight: 180,
      type: "Single",
      view: "Sea View"
    },
    {
      id: "room-2",
      name: "Superior Twin Room",
      description: "Elegant twin room offering modern amenities and relaxing vibes.",
      images: ["/images/hotels/hotel3.jpg"],
      features: ["Breakfast", "Free Wifi", "Sea View", "No Smoking", "Air Conditioner"],
      pricePerNight: 180,
      discountPercent: 10,
      type: "Double Room",
      view: "Sea View"
    }
  ],
  hotelReviews: [
    {
      title: "Unforgettable Stay by the Nile",
      body: "A beautiful hotel with stunning views, exceptional service, and a truly relaxing atmosphere. Every moment felt special.",
      author: "Sarah Jenkins",
      date: "January 10, 2025",
      rating: 5
    },
    {
      title: "Perfect Getaway in Egypt",
      body: "The location, comfort, and hospitality were outstanding. Waking up to the Nile view was simply magical.",
      author: "Anna & Marco",
      date: "January 28, 2025",
      rating: 5
    }
  ],
  relatedTripIds: ["trip-1", "trip-2"]
};
