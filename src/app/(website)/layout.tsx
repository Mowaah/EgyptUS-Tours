import TopBar from "@/components/website/TopBar/TopBar";
import Navbar from "@/components/website/Navbar/Navbar";
import Footer from "@/components/website/Footer/Footer";
import ChatBot from "@/components/website/ChatBot/ChatBot";
import { getAllTrips } from "@/services/tripsService";
import { getAllDestinations } from "@/services/destinationsService";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [backendTrips, backendDestinations] = await Promise.all([
    getAllTrips(),
    getAllDestinations(),
  ]);

  const tripLinks = backendTrips.slice(0, 12).map((t) => ({
    label: t.title,
    href: `/trips/${t.slug}`,
  }));

  const destinationLinks = backendDestinations.map((d) => ({
    label: d.name,
    href: `/trips?destination=${d.name}`, // passing the name to the search bar/filter
  }));

  return (
    <>
      <TopBar />
      <Navbar tripLinks={tripLinks} destinationLinks={destinationLinks} />
      <main>{children}</main>
      <ChatBot />
      <Footer />
    </>
  );
}
