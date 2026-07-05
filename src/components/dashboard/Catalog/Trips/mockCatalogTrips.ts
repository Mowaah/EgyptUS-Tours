export interface CatalogTrip {
  id: string;
  tripName: string;
  category: string;
  destination: string;
  duration: string;
  startingFrom: string;
  status: "Published" | "Archived" | "Draft";
}

export const mockCatalogTrips: CatalogTrip[] = [
  {
    id: "TP-2026-001",
    tripName: "Luxor & Aswan Nile Cruise Experience",
    category: "Multi Country Tours",
    destination: "Cairo",
    duration: "8 Days - 7 Nights",
    startingFrom: "$1,299",
    status: "Published",
  },
  {
    id: "TP-2026-002",
    tripName: "Palm Jumeirah Premium Escape",
    category: "Honeymoon",
    destination: "Cairo",
    duration: "8 Days - 7 Nights",
    startingFrom: "$1,299",
    status: "Archived",
  },
  {
    id: "TP-2026-003",
    tripName: "Santorini Island Explorer",
    category: "Honeymoon",
    destination: "Cairo",
    duration: "8 Days - 7 Nights",
    startingFrom: "$1,299",
    status: "Published",
  },
  {
    id: "TP-2026-004",
    tripName: "Santorini Island Explorer",
    category: "Honeymoon",
    destination: "Cairo",
    duration: "8 Days - 7 Nights",
    startingFrom: "$1,299",
    status: "Archived",
  },
  {
    id: "TP-2026-005",
    tripName: "Santorini Island Explorer",
    category: "Honeymoon",
    destination: "Cairo",
    duration: "8 Days - 7 Nights",
    startingFrom: "$1,299",
    status: "Draft",
  },
  {
    id: "TP-2026-006",
    tripName: "Santorini Island Explorer",
    category: "Honeymoon",
    destination: "Cairo",
    duration: "8 Days - 7 Nights",
    startingFrom: "$1,299",
    status: "Published",
  },
  {
    id: "TP-2026-007",
    tripName: "Santorini Island Explorer",
    category: "Honeymoon",
    destination: "Cairo",
    duration: "8 Days - 7 Nights",
    startingFrom: "$1,299",
    status: "Draft",
  },
  {
    id: "TP-2026-008",
    tripName: "Santorini Island Explorer",
    category: "Honeymoon",
    destination: "Cairo",
    duration: "8 Days - 7 Nights",
    startingFrom: "$1,299",
    status: "Draft",
  },
];
