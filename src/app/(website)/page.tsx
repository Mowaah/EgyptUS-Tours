import { Suspense } from "react";
import type { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seoUtils";
import dynamic from "next/dynamic";
import HeroSection from "@/components/website/HeroSection/HeroSection";
import StatsBar from "@/components/website/StatsBar/StatsBar";

const DesertSection = dynamic(() => import("@/components/website/DesertSection/DesertSection"));
const MiceSection = dynamic(() => import("@/components/website/MiceSection/MiceSection"));
const CtaBanner = dynamic(() => import("@/components/website/CtaBanner/CtaBanner"));
const StatsSection = dynamic(() => import("@/components/website/StatsSection/StatsSection"));
const B2BSection = dynamic(() => import("@/components/website/B2BSection/B2BSection"));
const DesertBannerSection = dynamic(() => import("@/components/website/DesertBannerSection/DesertBannerSection"));
const WhyChooseUsSection = dynamic(() => import("@/components/website/WhyChooseUsSection/WhyChooseUsSection"));
const ContactSection = dynamic(() => import("@/components/website/ContactSection/ContactSection"));

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
