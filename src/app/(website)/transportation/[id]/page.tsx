import TransportationDetailPage from "@/components/website/TransportationDetailPage/TransportationDetailPage";

export async function generateMetadata() {
  return {
    title: `Mercedes S-Class | EgyptUS Tours`,
    description: "Experience the pinnacle of luxury travel with our Mercedes S-Class.",
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TransportationDetailPage vehicleId={id} />;
}
