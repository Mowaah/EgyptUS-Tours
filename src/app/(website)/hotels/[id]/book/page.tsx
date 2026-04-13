import { MOCK_HOTEL_DETAIL } from "@/data/hotelDetails";
import BookHotelPage from "@/components/website/BookHotelPage/BookHotelPage";

interface Props {
  params: { id: string };
}

export default function BookHotelRoute({ params }: Props) {
  // TODO: fetch real hotel by params.id
  const hotel = MOCK_HOTEL_DETAIL;

  return <BookHotelPage hotel={hotel} />;
}
