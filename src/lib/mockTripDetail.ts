import { Trip } from "@/types";

// Placeholder images reusing existing public assets
const GALLERY = [
  "/images/pyramids4.jpg",
  "/images/pyramids2.jpg",
  "/images/pyramids3.jpg",
  "/images/pyramids.jpg",
  "/images/contact1.jpg",
];

const TRAVELER_PHOTOS = [
  "/images/pyramids2.jpg",
  "/images/pyramids3.jpg",
  "/images/contact1.jpg",
  "/images/contact2.jpg",
  "/images/contact3.jpg",
];

export const mockTripDetail: Trip = {
  id: "luxor-nile-cruise",
  title: "Luxor & Aswan Nile Cruise Experience",
  description:
    "Embark on a spectacular journey through ancient Egypt. Sail the legendary Nile River from Luxor to Aswan",
  image: "/images/pyramids4.jpg",
  images: GALLERY,
  location: "Luxor & Aswan",
  price: 1299,
  currency: "US$",
  priceLabel: "From",
  duration: { days: 8, nights: 7 },
  rating: 4.5,
  reviewCount: 3240,
  isFavorite: false,
  tags: ["Nile Cruises", "Cultural", "Luxury"],
  privatePrice: 2499,
  groupPrice: 1299,

  overview: {
    description:
      "Embark on an unforgettable journey through ancient Egypt along the legendary Nile River. Experience the magic of Luxor and Aswan with visits to magnificent temples, royal tombs, and timeless monuments. Sail aboard a luxury Nile cruise while exploring Karnak Temple, Valley of the Kings, Philae Temple, and the colossal Abu Simbel.",
    culturalValue:
      "Connect with 5,000 years of pharaonic history and ancient Egyptian civilization. Experience authentic Nubian culture, learn about hieroglyphics and ancient construction techniques, and participate in traditional felucca sailing. This journey offers insight into one of the world's oldest and most influential civilizations, with expert Egyptologist guides bringing each monument to life.",
    whoIsItFor:
      "History enthusiasts, couples seeking romantic getaways, and culture lovers looking for an authentic Egyptian experience. Ideal for those who want to explore ancient wonders, learn about pharaonic dynasties, and experience the timeless beauty of the Nile River in comfort and luxury.",
  },

  included: [
    "4 Nights Nile Cruise from Luxor to Aswan in Deluxe Cabin with Nile Views",
    "Daily Breakfast, Lunch & Dinner on Board (Traditional Egyptian & International Cuisine)",
    "Guided Tours of Karnak Temple, Luxor Temple & Valley of the Kings",
    "Visit to Philae Temple, Aswan High Dam & Unfinished Obelisk",
    "Traditional Felucca Sailing Experience Around Elephantine Island",
    "24/7 Expert Egyptologist Guide & Air-Conditioned Transportation",
  ],

  excluded: [
    "International & Domestic Flights",
    "Visa Fees & Travel Insurance",
    "Personal Expenses (Laundry, Room Service, Mini Bar)",
    "Optional Tours & Additional Activities Not Mentioned in the Itinerary",
    "Gratuities for Guide, Drivers & Cruise Staff",
    "Beverages During Meals (Unless Stated Otherwise)",
  ],

  itinerary: [
    {
      day: 1,
      title: "Arrival in Luxor",
      subtitle: "Welcome to Ancient Egypt",
      description:
        "Arrive at Luxor Airport. Meet your expert Egyptologist guide and transfer to the Nile cruise ship. Settle into your deluxe cabin, enjoy a welcome orientation and dinner on board.",
      image: "/images/pyramids4.jpg",
      value: 980,
      durationHours: 6,
      meals: 1,
      highlights: ["Airport pickup", "Nile Cruise boarding", "Welcome dinner", "Cabin orientation"],
    },
    {
      day: 2,
      title: "Valley of the Kings & Hatshepsut",
      subtitle: "Pharaohs & Royal Tombs",
      description:
        "Morning tour of the Valley of the Kings, explore the tombs of ancient pharaohs including Tutankhamun. Visit Queen Hatshepsut's Temple and the Colossi of Memnon. Afternoon sailing towards Edfu.",
      image: "/images/pyramids3.jpg",
      value: 1240,
      durationHours: 8,
      meals: 3,
      highlights: ["Valley of the Kings", "Hatshepsut Temple", "Colossi of Memnon", "Free 2 hour tour"],
    },
    {
      day: 3,
      title: "Edfu & Kom Ombo Temples",
      subtitle: "Temple Hopping Day",
      description:
        "Visit the Temple of Horus at Edfu, one of Egypt's best-preserved temples. Continue to Kom Ombo, the unique double-temple dedicated to Sobek and Haroeris.",
      image: "/images/pyramids2.jpg",
      value: 890,
      durationHours: 8,
      meals: 3,
      highlights: ["Temple of Horus", "Kom Ombo", "Crocodile Museum", "Nile sunset"],
    },
    {
      day: 4,
      title: "Aswan Highlights",
      subtitle: "Jewel of the Nile",
      description:
        "Explore Aswan's iconic attractions: the High Dam, the Unfinished Obelisk, and the island temple of Philae. Enjoy a traditional felucca sailing experience around Elephantine Island.",
      image: "/images/daybyday.jpg",
      value: 950,
      durationHours: 7,
      meals: 3,
      highlights: ["Aswan High Dam", "Philae Temple", "Unfinished Obelisk", "Felucca sailing"],
    },
    {
      day: 5,
      title: "Departure from Aswan",
      subtitle: "Farewell to Egypt",
      description:
        "Morning at leisure for last-minute shopping at the Aswan souq. Transfer to Aswan Airport for your onward journey.",
      image: "/images/daybyday2.jpg",
      value: 480,
      durationHours: 3,
      meals: 1,
      highlights: ["Aswan souq", "Airport transfer", "Departure"],
    },
    {
      day: 6,
      title: "Arrival in Cairo",
      subtitle: "City of a Thousand Minarets",
      description:
        "Arrive in Cairo and transfer to your hotel. Enjoy an evening sound and light show at the Pyramids.",
      image: "/images/pyramids4.jpg",
      value: 350,
      durationHours: 4,
      meals: 1,
      highlights: ["Hotel check-in", "Sound & Light show"],
    },
    {
      day: 7,
      title: "Giza Pyramids & Sphinx",
      subtitle: "Wonders of the Ancient World",
      description:
        "Spend the day exploring the Great Pyramids of Giza, the iconic Sphinx, and the Egyptian Museum.",
      image: "/images/pyramids2.jpg",
      value: 500,
      durationHours: 8,
      meals: 2,
      highlights: ["Great Pyramids", "Sphinx", "Egyptian Museum"],
    },
  ],

  availability: [
    { dates: "March 15-19, 2026", duration: "5 Days / 4 Nights", spotsLeft: 3, totalSpots: 16 },
    { dates: "March 22-26, 2026", duration: "5 Days / 4 Nights", spotsLeft: 8, totalSpots: 16 },
    { dates: "April 5-9, 2026", duration: "5 Days / 4 Nights", spotsLeft: 12, totalSpots: 16 },
    { dates: "April 19-23, 2026", duration: "5 Days / 4 Nights", spotsLeft: 2, totalSpots: 16 },
    { dates: "May 3-7, 2026", duration: "5 Days / 4 Nights", spotsLeft: 15, totalSpots: 16 },
    { dates: "May 17-21, 2026", duration: "5 Days / 4 Nights", spotsLeft: 10, totalSpots: 16 },
  ],

  vipExperiences: [
    {
      title: "Hot Air Balloon Ride over Luxor",
      description: "Soar above ancient wonders at sunrise – an unforgettable perspective of the Valley of the Kings",
      image: "/images/pyramids4.jpg",
      rating: 4.9,
      reviewCount: 847,
      originalPrice: 200,
      discountedPrice: 150,
      savings: 50,
      badge: "MOST POPULAR",
      features: ["45-60 min flight", "Flight certificate", "Champagne toast", "Hotel pickup"],
    },
    {
      title: "VIP Private Car with Driver",
      description: "Travel like royalty with your personal chauffeur in a premium vehicle throughout Egypt",
      image: "/images/pyramids2.jpg",
      rating: 5,
      reviewCount: 623,
      originalPrice: 200,
      discountedPrice: 150,
      savings: 50,
      badge: "BEST VALUE",
      features: ["Professional driver", "All 5 days", "Luxury vehicle", "Bottled water"],
    },
    {
      title: "Sound & Light Show at Karnak",
      description: "Watch the temple come alive with spectacular illumination and ancient pharaonic stories",
      image: "/images/pyramids3.jpg",
      rating: 4.8,
      reviewCount: 1024,
      originalPrice: 200,
      discountedPrice: 150,
      savings: 50,
      badge: "LIMITED SPOTS",
      features: ["1 hour show", "Audio guide", "Premium seating", "Reserved entry"],
    },
    {
      title: "5-Star Luxury Hotel Upgrades",
      description: "Experience opulence with Nile-view suites, spa treatments, and exclusive VIP services",
      image: "/images/contact1.jpg",
      rating: 5,
      reviewCount: 445,
      originalPrice: 450,
      discountedPrice: 300,
      savings: 50,
      badge: "PREMIUM EXPERIENCE",
      features: ["Nile view suite", "Butler service", "Spa access", "Late checkout"],
    },
  ],

  importantLinks: [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Children Policy", href: "/children-policy" },
    { label: "Booking Policy", href: "/booking-policy" },
    { label: "Tipping", href: "/tipping" },
    { label: "Cancellation Policy", href: "/cancellation" },
  ],

  pricing: [
    {
      season: "Sep – May",
      tiers: [
        { label: "Per Single in Single Room", price: 2575 },
        { label: "Per Person in Double Room", price: 1205 },
        { label: "Per Person in Triple Room", price: 1169 },
      ],
    },
    {
      season: "Jun – Aug",
      tiers: [
        { label: "Per Single in Single Room", price: 2199 },
        { label: "Per Person in Double Room", price: 1050 },
        { label: "Per Person in Triple Room", price: 999 },
      ],
    },
    {
      season: "Christmas & New Year",
      tiers: [
        { label: "Per Single Cabin", price: 2899 },
        { label: "Per Person in Double Cabin", price: 1399 },
        { label: "Per Person in Triple Cabin", price: 1349 },
      ],
    },
  ],

  travelerPhotos: TRAVELER_PHOTOS,

  hotels: [
    {
      name: "Steigenberger Nile Palace Luxor",
      location: "Luxor, Egypt",
      description:
        "Elegant 5-star hotel on the Nile with stunning temple views, outdoor pool, and rooftop terrace.",
      image: "/images/accommodation/accomodation3.jpg",
      photos: [
        "/images/accommodation/accomodation3.jpg",
        "/images/accommodation/accomodation2.jpg",
        "/images/accommodation/accomodations.jpg",
        "/images/accommodation/accomodation3.jpg",
        "/images/accommodation/accomodation2.jpg",
        "/images/accommodation/accomodations.jpg",
        "/images/accommodation/accomodation3.jpg",
        "/images/accommodation/accomodation2.jpg",
        "/images/accommodation/accomodations.jpg",
        "/images/accommodation/accomodation3.jpg",
        "/images/accommodation/accomodation2.jpg",
        "/images/accommodation/accomodations.jpg",
      ],
      rating: 4.8,
      reviewCount: 2847,
      amenities: ["Free WiFi", "Pool", "Restaurant", "Spa"],
    },
    {
      name: "Mövenpick Resort Aswan",
      location: "Aswan, Egypt",
      description:
        "Nestled on the tranquil Elephantine Island, Mövenpick Resort Aswan is a botanical paradise offering stunning panoramic views of the Nile. This 5-star resort combines Swiss hospitality with Egyptian charm, featuring lush gardens and private beach access.",
      image: "/images/accommodation/accomodation2.jpg",
      photos: [
        "/images/accommodation/accomodation2.jpg",
        "/images/accommodation/accomodation3.jpg",
        "/images/accommodation/accomodations.jpg",
        "/images/accommodation/accomodation2.jpg",
        "/images/accommodation/accomodation3.jpg",
        "/images/accommodation/accomodations.jpg",
        "/images/accommodation/accomodation2.jpg",
        "/images/accommodation/accomodation3.jpg",
        "/images/accommodation/accomodations.jpg",
        "/images/accommodation/accomodation2.jpg",
        "/images/accommodation/accomodation3.jpg",
        "/images/accommodation/accomodations.jpg",
      ],
      rating: 4.7,
      reviewCount: 1923,
      amenities: [
        "Private Beach", "3 Swimming Pools", "Fitness Center",
        "Tennis Courts", "4 Restaurants", "3 Bars",
        "Spa & Wellness Center", "Water Sports", "Free Boat Transfer",
        "Kids Club", "Free WiFi", "24-Hour Reception"
      ],
    },
    {
      name: "Sofitel Cairo Nile El Gezirah",
      location: "Cairo, Egypt (Optional Extension)",
      description:
        "Contemporary hotel on Gezira Island with floor-to-ceiling windows, dining, and Cairo Tower proximity.",
      image: "/images/accommodation/accomodations.jpg",
      photos: [
        "/images/accommodation/accomodations.jpg",
        "/images/accommodation/accomodation3.jpg",
        "/images/accommodation/accomodation2.jpg",
      ],
      rating: 4.9,
      reviewCount: 3201,
      amenities: ["Free WiFi", "Fine Dining", "Concierge", "Airport Transfer"],
    },
  ],
};
