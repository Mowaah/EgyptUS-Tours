import TopBar from "@/components/website/TopBar/TopBar";
import Navbar from "@/components/website/Navbar/Navbar";
import Footer from "@/components/website/Footer/Footer";
import ChatBot from "@/components/website/ChatBot/ChatBot";
import { getEgyptTripCategories } from "@/services/categoriesService";
import { getAllDestinations } from "@/services/destinationsService";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

import { Suspense } from "react";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categoriesData, destinationsData] = await Promise.all([
    getEgyptTripCategories(),
    getAllDestinations(),
  ]);

  const categoryLinks = categoriesData.map((c) => ({
    label: c.name,
    href: `/egypttours?category=${c.slug || c.name.toLowerCase().replace(/\s+/g, "-")}`,
  }));

  const destinationLinks = destinationsData
    .filter((d) => {
      const name = d.name.trim().toLowerCase();
      const slug = (d.slug || "").trim().toLowerCase();
      return slug !== "egypt" && !name.includes("egypt");
    })
    .map((d) => ({
      label: d.name,
      href: `/egypttours?destination=${d.slug || d.name.toLowerCase().replace(/\s+/g, "-")}`,
    }));

  return (
    <CurrencyProvider>
      <TopBar />
      <Suspense fallback={null}>
        <Navbar categoryLinks={categoryLinks} destinationLinks={destinationLinks} />
      </Suspense>
      <main>{children}</main>
      <ChatBot />
      <Footer />
    </CurrencyProvider>
  );
}
