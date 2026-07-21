import TopBar from "@/components/website/TopBar/TopBar";
import Navbar from "@/components/website/Navbar/Navbar";
import Footer from "@/components/website/Footer/Footer";
import ChatBot from "@/components/website/ChatBot/ChatBot";
import { getAllTrips } from "@/services/tripsService";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const backendTrips = await getAllTrips();
  const tripLinks = backendTrips.slice(0, 12).map((t) => ({
    label: t.title,
    href: `/trips/${t.slug}`,
  }));

  return (
    <>
      <TopBar />
      <Navbar tripLinks={tripLinks} />
      <main>{children}</main>
      <ChatBot />
      <Footer />
    </>
  );
}
