export interface CatalogTransportation {
  id: string;
  name: string;
  category: string;
  passengers: number;
  luggage: number;
  rating: string;
  startingFrom: string;
  status: "Published" | "Draft" | "Archived";
}

export const mockCatalogTransportation: CatalogTransportation[] = [
  {
    id: "VH-001",
    name: "Mercedes S-Class",
    category: "Sedan",
    passengers: 1,
    luggage: 5,
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Published",
  },
  {
    id: "VH-002",
    name: "Mercedes V-Class",
    category: "Van",
    passengers: 2,
    luggage: 5,
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Archived",
  },
  {
    id: "VH-003",
    name: "Full Size Bus",
    category: "Bus",
    passengers: 28,
    luggage: 28,
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Published",
  },
  {
    id: "VH-004",
    name: "Toyota Coaster",
    category: "Van",
    passengers: 1,
    luggage: 8,
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Archived",
  },
  {
    id: "VH-005",
    name: "Full Size Bus",
    category: "Bus",
    passengers: 28,
    luggage: 28,
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Draft",
  },
  {
    id: "VH-006",
    name: "Toyota Coaster",
    category: "Van",
    passengers: 2,
    luggage: 5,
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Published",
  },
  {
    id: "VH-007",
    name: "Full Size Bus",
    category: "Bus",
    passengers: 28,
    luggage: 28,
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Draft",
  },
  {
    id: "VH-008",
    name: "Full Size Bus",
    category: "Bus",
    passengers: 28,
    luggage: 28,
    rating: "5 Stars",
    startingFrom: "$1,299",
    status: "Draft",
  },
];
