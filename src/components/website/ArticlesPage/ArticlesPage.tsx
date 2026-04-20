"use client";

import { useState } from "react";

import ArticlesHero from "./components/ArticlesHero/ArticlesHero";
import LatestArticles from "./components/LatestArticles/LatestArticles";
import FaqSection from "@/components/website/FaqSection/FaqSection";
import styles from "./ArticlesPage.module.scss";

const ARTICLES_FAQ = [
  {
    question: "Why should I book with Egypt Us ?",
    answer: "Booking with Egypt Us means choosing experience, reliability, and personalized service. Our travel experts create well-planned itineraries, supported by licensed local guides, high-quality partners, and 24/7 customer support. Every detail is carefully managed to ensure a smooth, authentic, and memorable travel experience."
  },
  {
    question: "Can I customize my itinerary to match my interests and budget?",
    answer: "Yes, you can request modifications or cancellations before your scheduled trip time. Our support team is available to assist you and guide you through any applicable policies."
  },
  {
    question: "What should I do if there's an emergency during my trip?",
    answer: "In case of an emergency during your trip, we provide 24/7 support to assist you. Our team will coordinate immediate help, guide you to trusted medical services if needed, and ensure your safety and well-being throughout your journey."
  },
  {
    question: "What happens if I need to cancel my reservation with Egypt Us ?",
    answer: "Our cancellation policy varies depending on the type of package and the notice provided. Generally, if we receive sufficient advance notice, we can refund a portion of your deposit or transfer your booking to another date. However, some rates or services may be non-refundable. Please contact us for detailed information about the specific cancellation policy for your package."
  }
];

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setTimeout(() => {
        document.getElementById("latest-articles")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  return (
    <main className={styles.page}>
      <ArticlesHero searchQuery={searchQuery} onSearch={handleSearch} />
      <div id="latest-articles">
        <LatestArticles searchQuery={searchQuery} onClearSearch={() => setSearchQuery("")} />
      </div>
      <FaqSection
        items={ARTICLES_FAQ}
        description="Find quick answers about booking, pricing and transportation details."
      />
    </main>
  );
}
