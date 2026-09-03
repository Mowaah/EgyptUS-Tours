"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionHeader, EmptyState, BlogCard } from "@/components/shared";
import { Blog } from "@/types";
import styles from "./LatestArticles.module.scss";

import { ArticleList } from "@/types/api/articles";

interface LatestArticlesProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  initialArticles?: ArticleList[];
}

export default function LatestArticles({ 
  searchQuery = "", 
  onClearSearch,
  initialArticles = [],
}: LatestArticlesProps) {
  const isSearching = !!searchQuery.trim();

  const featured = initialArticles.length > 0 ? initialArticles[0] : null;
  const remainingArticles = initialArticles.length > 1 ? initialArticles.slice(1) : [];
  
  // Unified list maps articles to Blog interface for the active search UI grid
  const ALL_ARTICLES: Blog[] = initialArticles.map(a => ({
    id: a.slug,
    category: a.category?.name || "Travel", 
    categoryColor: "blue",
    title: a.title,
    excerpt: a.excerpt,
    date: new Date(a.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    image: a.featured_image || "/images/home/hero-bg.png"
  }));

  const filteredSearch = isSearching
    ? ALL_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const hasSearchResults = filteredSearch.length > 0;

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {isSearching ? (
          <>
            {!hasSearchResults ? (
              <div style={{ paddingTop: "40px", paddingBottom: "40px" }}>
                <EmptyState
                  title="No Available Articles"
                  description="Sorry, this Article is currently unavailable. Please explore others or try different subject."
                  buttonText="Clear Search"
                  onButtonClick={onClearSearch}
                />
              </div>
            ) : (
              <div className={styles.searchResultsWrap}>
                <h3 className={styles.searchResultsCount}>{filteredSearch.length} Articles Founded</h3>
                <div className={styles.searchResultsGrid}>
                  {filteredSearch.map(article => (
                    <BlogCard
                      key={article.id}
                      blog={article}
                      readText="Read more"
                      href={`/articles/${article.id}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Header */}
            <SectionHeader
              label="Recently Posted"
              heading="Latest Articles"
              description="We've earned the confidence of leading organizations worldwide through consistent excellence, transparency, and dedication to our clients' success."
              align="left"
              size="large"
              descriptionMaxWidth="650px"
            />

            {/* Featured Article */}
            {featured && (
              <Link href={`/articles/${featured.slug}`} className={styles.featuredCard}>
                <div className={styles.featuredImageWrap}>
                  <Image
                    src={featured.hero_image || featured.featured_image || "/images/home/hero-bg.png"}
                    alt={featured.title}
                    fill
                    className={styles.image}
                    style={{ objectFit: "cover" }}
                  />
                  <div className={styles.gradientOverlay}></div>
                </div>
                <div className={styles.featuredContent}>
                  <div className={styles.tag}>{featured.category?.name || 'Article'}</div>
                  <h3 className={styles.featuredTitle}>{featured.title}</h3>
                  <p className={styles.meta}>By {featured.display_author_name} &bull; {new Date(featured.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </Link>
            )}

            {/* Small Articles Grid */}
            {remainingArticles.length > 0 && (
              <div className={styles.grid}>
                {remainingArticles.map((article) => (
                  <Link key={article.id} href={`/articles/${article.slug}`} className={styles.smallCard}>
                    <div className={styles.smallImageWrap}>
                      <Image
                        src={article.featured_image || "/images/home/hero-bg.png"}
                        alt={article.title}
                        fill
                        className={styles.image}
                        style={{ objectFit: "cover" }}
                      />
                      <div className={styles.gradientOverlay}></div>
                    </div>
                    <div className={styles.smallContent}>
                      <div className={styles.tagSmall}>{article.category?.name || 'Article'}</div>
                      <h4 className={styles.smallTitle}>{article.title}</h4>
                      <p className={styles.metaSmall}>By {article.display_author_name} &bull; {new Date(article.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
