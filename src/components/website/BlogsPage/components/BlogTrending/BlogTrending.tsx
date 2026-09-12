"use client";

import { useState } from "react";

import { BlogCard, SectionHeader, Pagination, EmptyState } from "@/components/shared";
import { Blog } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getBackendLocalizedArticle, getBackendLocalizedName } from "@/utils/localizedContent";
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
  const { language } = useLanguage();
  const { t } = useTranslation("common");
  const [currentPage, setCurrentPage] = useState(1);

  const isSearching = !!searchQuery.trim();
  const localeCode = language === "it" ? "it-IT" : language === "es" ? "es-ES" : "en-GB";

  const BLOGS: Blog[] = initialBlogs.map((a) => {
    const loc = getBackendLocalizedArticle(a, language);
    const categoryName = getBackendLocalizedName(a.category, language, a.category?.name || "Blog");
    return {
      id: a.slug,
      category: categoryName, 
      categoryColor: "blue",
      title: loc.title || a.title,
      excerpt: loc.excerpt || a.excerpt,
      date: new Date(a.published_at).toLocaleDateString(localeCode, { day: '2-digit', month: 'long', year: 'numeric' }),
      image: a.featured_image || a.hero_image || "/images/home/hero-bg.png"
    };
  });

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
              label={t("blogs.trendingLabel", "Blogs")}
              heading={t("blogs.trendingHeading", "What's Trending Now")}
              description={t("blogs.trendingDescription", "Stay ahead of the curve with our most-read stories and trending travel insights across the country")}
              align="center"
            />
          </div>
        )}

        {isSearching && filteredBlogs.length > 0 && (
          <div className={styles.searchResultsWrap}>
            <h3 className={styles.searchResultsCount}>
              {t("blogs.searchResultsCount", "{count} Blogs Found", { count: filteredBlogs.length })}
            </h3>
          </div>
        )}

        {filteredBlogs.length === 0 ? (
          <div style={{ paddingTop: "40px", paddingBottom: "40px" }}>
            <EmptyState
              title={t("blogs.noBlogsTitle", "No Available Blogs")}
              description={t("blogs.noBlogsDescription", "Sorry, no blogs matched your search. Please explore others or try different subject.")}
              buttonText={t("blogs.clearSearch", "Clear Search")}
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
