"use client";

import { useState } from "react";

import { BlogCard, SectionHeader, Pagination, EmptyState } from "@/components/shared";
import { Blog } from "@/types";
import styles from "./BlogTrending.module.scss";

import { ArticleList } from "@/types/api/articles";

interface BlogTrendingProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  initialBlogs?: ArticleList[];
  initialFeatured?: ArticleList[];
}

export default function BlogTrending({ 
  searchQuery = "", 
  onClearSearch,
  initialBlogs = [],
  initialFeatured = []
}: BlogTrendingProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const isSearching = !!searchQuery.trim();
  
  const BLOGS: Blog[] = initialBlogs.map(a => ({
    id: a.slug,
    category: a.category?.name || "Blog", 
    categoryColor: "blue",
    title: a.title,
    excerpt: a.excerpt,
    date: new Date(a.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    image: a.featured_image || "/images/home/hero-bg.png"
  }));

  const filteredBlogs = BLOGS.filter((blog) => 
    !searchQuery || 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE) || 1;

  const currentBlogs = filteredBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
              {currentBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} href={`/blogs/${blog.id}`} />
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
