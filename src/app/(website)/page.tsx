import { Suspense } from "react";
import HeroSection from "@/components/website/HeroSection/HeroSection";
import StatsBar from "@/components/website/StatsBar/StatsBar";
import DesertSection from "@/components/website/DesertSection/DesertSection";
import MiceSection from "@/components/website/MiceSection/MiceSection";
import CtaBanner from "@/components/website/CtaBanner/CtaBanner";
import StatsSection from "@/components/website/StatsSection/StatsSection";
import B2BSection from "@/components/website/B2BSection/B2BSection";
import DesertBannerSection from "@/components/website/DesertBannerSection/DesertBannerSection";
import WhyChooseUsSection from "@/components/website/WhyChooseUsSection/WhyChooseUsSection";
import ContactSection from "@/components/website/ContactSection/ContactSection";

import HomeTripsFetcher from "@/components/website/HomeFetchers/HomeTripsFetcher";
import HomeHotelsFetcher from "@/components/website/HomeFetchers/HomeHotelsFetcher";
import HomeTransportationFetcher from "@/components/website/HomeFetchers/HomeTransportationFetcher";
import HomeTestimonialsFetcher from "@/components/website/HomeFetchers/HomeTestimonialsFetcher";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      
      <Suspense fallback={<div style={{ padding: "4rem 2rem", textAlign: "center", color: "#666" }}>Loading trips...</div>}>
        <HomeTripsFetcher />
      </Suspense>
      
      <Suspense fallback={<div style={{ padding: "4rem 2rem", textAlign: "center", color: "#666" }}>Loading hotels...</div>}>
        <HomeHotelsFetcher />
      </Suspense>
      
      <DesertSection />
      <MiceSection />
      <CtaBanner />
      <StatsSection />
      
      <Suspense fallback={<div style={{ padding: "4rem 2rem", textAlign: "center", color: "#666" }}>Loading transportation...</div>}>
        <HomeTransportationFetcher />
      </Suspense>
      
      <B2BSection />
      <DesertBannerSection />
      <WhyChooseUsSection />
      
      <Suspense fallback={<div style={{ padding: "4rem 2rem", textAlign: "center", color: "#666" }}>Loading testimonials...</div>}>
        <HomeTestimonialsFetcher />
      </Suspense>
      
      <ContactSection />
    </>
  );
}
