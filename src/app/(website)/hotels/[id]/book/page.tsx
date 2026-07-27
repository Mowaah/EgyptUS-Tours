import { notFound } from "next/navigation";
import BookHotelPage from "@/components/website/BookHotelPage/BookHotelPage";
import { getFullHotelBySlug } from "@/services/hotelsService";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookHotelRoute({ params }: Props) {
  const { id } = await params;
  const hotel = await getFullHotelBySlug(id);

  if (!hotel) {
    notFound();
  }

  return <BookHotelPage hotel={hotel} />;
}
