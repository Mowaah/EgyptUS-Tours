"use client";

import { useState } from "react";

import { BlogCard, SectionHeader, Pagination, EmptyState } from "@/components/shared";
import { Blog } from "@/types";
import styles from "./BlogTrending.module.scss";

interface BlogTrendingProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

// Mock data based on the Figma design
const BLOGS: Blog[] = [
  {
    id: "1",
    category: "Destinations",
    categoryColor: "blue",
    title: "Egypt in Summer vs Winter: When Is the Best Time?",
    excerpt: "Should you brave the heat or aim for the breezy nights? Find out when perfectly fits your travel style.",
    date: "03 March 2026",
    image: "/images/home/hero-bg.png",
  },
  {
    id: "2",
    category: "Culture",
    categoryColor: "orange",
    title: "A Deep Dive into Ancient Pharaonic Burial Rituals",
    excerpt: "Discover the mysteries and fascinating steps that ancient Egyptians took to secure eternal life.",
    date: "12 May 2026",
    image: "/images/home/hero-bg.png",
  },
  {
    id: "3",
    category: "Adventure",
    categoryColor: "orange",
    title: "7 Adventures in Egypt That'll Make You Forget Everything Else",
    excerpt: "From dune bashing in the White Desert to snorkeling in the Red Sea, here are our top picks for thrill seekers.",
    date: "15 April 2026",
    image: "/images/home/hero-bg.png",
  },
  {
    id: "4",
    category: "Cuisine",
    categoryColor: "blue",
    title: "Top 10 Traditional Egyptian Dishes You Must Try",
    excerpt: "Koshary, Molokhia, and more! Bring an empty stomach to experience the true flavor of Cairo.",
    date: "21 July 2026",
    image: "/images/home/hero-bg.png",
  },
  {
    id: "5",
    category: "Destinations",
    categoryColor: "blue",
    title: "Hidden Gems of Alexandria: Beyond the Library",
    excerpt: "Skip the heavy crowds and explore the coastal ruins and underground catacombs of the old Greek capital.",
    date: "08 August 2026",
    image: "/images/home/hero-bg.png",
  },
  {
    id: "6",
    category: "Luxury",
    categoryColor: "orange",
    title: "The Ultimate Guide to Luxor's 5-Star River Cruises",
    excerpt: "Watch the temples glide by from a rooftop pool deck. We review the best high-end vessels on the Nile.",
    date: "29 September 2026",
    image: "/images/home/hero-bg.png",
  },
];

export default function BlogTrending({ searchQuery = "", onClearSearch }: BlogTrendingProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 15;

  const isSearching = !!searchQuery.trim();

  const filteredBlogs = BLOGS.filter((blog) => 
    !searchQuery || 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {!isSearching && (
          <div className={styles.sectionHeaderWrap}>
            <SectionHeader
              label="Blogs"
              heading="What's Trending Now"
              description="Stay ahead of the curve with our most-read stories and trending travel insights across the country"
              align="center"
            />
          </div>
        )}

        {isSearching && filteredBlogs.length > 0 && (
          <div className={styles.searchResultsWrap}>
            <h3 className={styles.searchResultsCount}>{filteredBlogs.length} Blogs Founded</h3>
          </div>
        )}

        {filteredBlogs.length === 0 ? (
          <div style={{ paddingTop: "40px", paddingBottom: "40px" }}>
            <EmptyState
              title="No Available Blogs"
              description="Sorry, no blogs matched your search. Please explore others or try different subject."
              buttonText="Clear Search"
              onButtonClick={onClearSearch}
            />
          </div>
        ) : (
          <>
            <div className={isSearching ? styles.searchResultsGrid : styles.grid}>
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            <div className={styles.paginationWrapper}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
