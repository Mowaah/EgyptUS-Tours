"use client";

import { useState } from "react";

import BlogHero from "./components/BlogHero/BlogHero";
import BlogTrending from "./components/BlogTrending/BlogTrending";
import FaqSection from "@/components/website/FaqSection/FaqSection";
import BlogSubscribe from "./components/BlogSubscribe/BlogSubscribe";
import styles from "./BlogsPage.module.scss";

import { FaqData } from "@/services/legalHelpService";

import { ArticleList } from "@/types/api/articles";

interface BlogsPageProps {
  initialBlogs?: ArticleList[];
  initialFeatured?: ArticleList[];
  initialFaqs?: FaqData[];
}

export default function BlogsPage({ initialBlogs = [], initialFeatured = [], initialFaqs = [] }: BlogsPageProps) {
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
        items={initialFaqs && initialFaqs.length > 0 ? initialFaqs : undefined}
        description="Find quick answers about booking, pricing and transportation details."
      />
      <BlogSubscribe />
    </main>
  );
}
