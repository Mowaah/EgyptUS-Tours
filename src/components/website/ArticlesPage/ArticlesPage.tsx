"use client";

import { useState } from "react";

import ArticlesHero from "./components/ArticlesHero/ArticlesHero";
import LatestArticles from "./components/LatestArticles/LatestArticles";
import FaqSection from "@/components/website/FaqSection/FaqSection";
import styles from "./ArticlesPage.module.scss";

import { FaqData } from "@/services/legalHelpService";

import { ArticleList } from "@/types/api/articles";

interface ArticlesPageProps {
  initialArticles?: ArticleList[];
  initialFeatured?: ArticleList[];
  initialFaqs?: FaqData[];
}

export default function ArticlesPage({ initialArticles = [], initialFeatured = [], initialFaqs = [] }: ArticlesPageProps) {
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
        <LatestArticles 
          searchQuery={searchQuery} 
          onClearSearch={() => setSearchQuery("")} 
          initialArticles={initialArticles}
          initialFeatured={initialFeatured}
        />
      </div>
      <FaqSection
        items={initialFaqs && initialFaqs.length > 0 ? initialFaqs : undefined}
        description="Find quick answers about booking, pricing and transportation details."
      />
    </main>
  );
}
