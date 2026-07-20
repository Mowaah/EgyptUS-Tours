"use client";

import { useState } from "react";

import BlogHero from "./components/BlogHero/BlogHero";
import BlogTrending from "./components/BlogTrending/BlogTrending";
import FaqSection from "@/components/website/FaqSection/FaqSection";
import BlogSubscribe from "./components/BlogSubscribe/BlogSubscribe";
import styles from "./BlogsPage.module.scss";

const BLOG_FAQS = [
  {
    question: "Why should I book with Egypt Us ?",
    answer: "Booking with Egypt Us means choosing experience, reliability, and personalized service. Our travel experts create well-planned itineraries, supported by licensed local guides, high-quality partners, and 24/7 customer support. Every detail is carefully managed to ensure a smooth, authentic, and memorable travel experience.",
  },
  {
    question: "Can I customize my itinerary to match my interests and budget?",
    answer: "Yes, you can request modifications or cancellations before your scheduled trip time. Our support team is available to assist you and guide you through any applicable policies.",
  },
  {
    question: "What should I do if there's an emergency during my trip?",
    answer: "In case of an emergency during your trip, we provide 24/7 support to assist you. Our team will coordinate immediate help, guide you to trusted medical services if needed, and ensure your safety and well-being throughout your journey.",
  },
  {
    question: "What happens if I need to cancel my reservation with Egypt Us ?",
    answer: "Our cancellation policy varies depending on the type of package and the notice provided. Generally, if we receive sufficient advance notice, we can refund a portion of your deposit or transfer your booking to another date. However, some rates or services may be non-refundable. Please contact us for detailed information about the specific cancellation policy for your package.",
  },
];

import { ArticleList } from "@/types/api/articles";

interface BlogsPageProps {
  initialBlogs?: ArticleList[];
  initialFeatured?: ArticleList[];
}

export default function BlogsPage({ initialBlogs = [], initialFeatured = [] }: BlogsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setTimeout(() => {
        document.getElementById("blog-trending")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  return (
    <main className={styles.page}>
      <BlogHero searchQuery={searchQuery} onSearch={handleSearch} />
      <div id="blog-trending">
        <BlogTrending 
          searchQuery={searchQuery} 
          onClearSearch={() => setSearchQuery("")} 
          initialBlogs={initialBlogs}
          initialFeatured={initialFeatured}
        />
      </div>
      <FaqSection
        items={BLOG_FAQS}
        description="Find quick answers about booking, pricing and transportation details."
      />
      <BlogSubscribe />
    </main>
  );
}
