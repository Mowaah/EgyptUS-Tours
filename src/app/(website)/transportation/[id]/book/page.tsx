import BookTransportationPage from "@/components/website/BookTransportationPage/BookTransportationPage";
import { Vehicle } from "@/types";

// Mock data for now
const MOCK_VEHICLE: Vehicle = {
  id: "v-1",
  name: "Mercedes S-Class",
  type: "Premium Sedan",
  image: "/images/sedan.png",
  price: "$1299",
  passengers: 3,
  luggage: 2,
  description: "Experience the pinnacle of luxury travel with our Mercedes S-Class...",
  rating: 4.9,
  reviews: 248
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookTransportationRoute({ params }: Props) {
  const { id } = await params;
  
  // TODO: fetch real vehicle by id
  const vehicle = MOCK_VEHICLE;

  return <BookTransportationPage vehicle={vehicle} />;
}
