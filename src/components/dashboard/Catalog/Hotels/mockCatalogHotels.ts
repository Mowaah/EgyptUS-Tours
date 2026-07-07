export interface CatalogHotel {
  id: string;
  hotelName: string;
  destination: string;
  rating: string;
  startingFrom: string;
  status: "Published" | "Draft" | "Archived";
}

export const mockCatalogHotels: CatalogHotel[] = [
  {
    id: "HT-2026-001",
    hotelName: "Luxor & Aswan Nile Cruise Experience",
    destination: "Cairo",
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Published",
  },
  {
    id: "HT-2026-002",
    hotelName: "Palm Jumeirah Premium Escape",
    destination: "Cairo",
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Archived",
  },
  {
    id: "HT-2026-003",
    hotelName: "Santorini Island Explorer",
    destination: "Cairo",
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Published",
  },
  {
    id: "HT-2026-004",
    hotelName: "Santorini Island Explorer",
    destination: "Cairo",
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Archived",
  },
  {
    id: "HT-2026-005",
    hotelName: "Santorini Island Explorer",
    destination: "Cairo",
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Draft",
  },
  {
    id: "HT-2026-006",
    hotelName: "Santorini Island Explorer",
    destination: "Cairo",
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Published",
  },
  {
    id: "HT-2026-007",
    hotelName: "Santorini Island Explorer",
    destination: "Cairo",
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Draft",
  },
  {
    id: "HT-2026-008",
    hotelName: "Santorini Island Explorer",
    destination: "Cairo",
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Draft",
  },
];
