import { Suspense } from "react";
import { notFound } from "next/navigation";
import BookHotelPage from "@/components/website/BookHotelPage/BookHotelPage";
import { getFullHotelBySlug } from "@/services/hotelsService";
import { LoadingSpinner } from "@/components/shared";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookHotelRoute({ params }: Props) {
  const { id } = await params;
  const hotel = await getFullHotelBySlug(id);

  if (!hotel) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingSpinner size="lg" variant="fullPage" label="" />}>
      <BookHotelPage hotel={hotel} />
    </Suspense>
  );
}
