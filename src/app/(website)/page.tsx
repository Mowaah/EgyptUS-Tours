import { Suspense } from "react";
import type { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seoUtils";
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
import { LoadingSpinner } from "@/components/shared";
import { ReviewModalHandler } from "@/components/website/ReviewModal";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    pageKey: "home",
    fallbackTitle: "Egypt-Us | Discover Egypt",
    fallbackDescription: "Explore the best Egypt tours, hotels, and transportation packages tailored for you.",
  });
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      
      <Suspense fallback={<LoadingSpinner size="lg" label="" />}>
        <HomeTripsFetcher />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner size="lg" label="" />}>
        <HomeHotelsFetcher />
      </Suspense>
      
      <DesertSection />
      <MiceSection />
      <CtaBanner />
      <StatsSection />
      
      <Suspense fallback={<LoadingSpinner size="lg" label="" />}>
        <HomeTransportationFetcher />
      </Suspense>
      
      <B2BSection />
      <DesertBannerSection />
      <WhyChooseUsSection />
      
      <Suspense fallback={<LoadingSpinner size="lg" label="" />}>
        <HomeTestimonialsFetcher />
      </Suspense>
      
      <ContactSection />
      <Suspense fallback={null}>
        <ReviewModalHandler />
      </Suspense>
    </>
  );
}
