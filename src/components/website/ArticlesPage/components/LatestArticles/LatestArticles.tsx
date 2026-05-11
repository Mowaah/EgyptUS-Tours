"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionHeader, EmptyState, BlogCard } from "@/components/shared";
import { Blog } from "@/types";
import styles from "./LatestArticles.module.scss";

interface LatestArticlesProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

// Mock data based on Figma
const FEATURED_ARTICLE = {
  id: "featured-1",
  tag: "Travel Insights",
  title: "The Seasonal Showdown\nChoosing Between Egypt’s Sun and Breeze.",
  author: "Ahmed Hassan",
  date: "03 March 2026",
  image: "/images/article.jpg" // Placeholder image
};

const SMALL_ARTICLES = [
  {
    id: "small-1",
    tag: "Cultural Events",
    title: "10 Most Important Artifacts to See in the Egyptian Museum.",
    author: "Sara Ibrahim",
    date: "14 April 2026",
    image: "/images/article.jpg"
  },
  {
    id: "small-2",
    tag: "Travel Tips",
    title: "How to Haggle the Right Way at Khan el-Khalili Bazaar.",
    author: "Omar Youssef",
    date: "22 February 2026",
    image: "/images/article.jpg"
  },
  {
    id: "small-3",
    tag: "Luxury Travel",
    title: "Cruising the Nile: A Review of the Top 5 Luxury Yachts.",
    author: "Nadine Safwat",
    date: "05 January 2026",
    image: "/images/article.jpg"
  },
  {
    id: "small-4",
    tag: "History",
    title: "The Pharaohs’ Curse: Fact or Fiction? Unraveling the Myth.",
    author: "Khaled Zaki",
    date: "12 May 2026",
    image: "/images/article.jpg"
  }
];

export default function LatestArticles({ searchQuery = "", onClearSearch }: LatestArticlesProps) {
  const isSearching = !!searchQuery.trim();

  // Unified list maps articles to Blog interface for the active search UI grid
  const ALL_ARTICLES: Blog[] = [FEATURED_ARTICLE, ...SMALL_ARTICLES].map(a => ({
    id: a.id,
    category: a.tag.split(" ")[0] || "Travel", // Just roughly matching standard Blog category
    categoryColor: "blue",
    title: a.title,
    excerpt: "loreumipsum loreumipsum loreumipsum loreumipsum loreumipsum loreumipsum loreumipsum loreumipsum",
    date: a.date,
    image: a.image
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
            <Link href={`/articles/${FEATURED_ARTICLE.id}`} className={styles.featuredCard}>
              <div className={styles.featuredImageWrap}>
                <Image
                  src={FEATURED_ARTICLE.image}
                  alt={FEATURED_ARTICLE.title}
                  fill
                  className={styles.image}
                  style={{ objectFit: "cover" }}
                />
                <div className={styles.gradientOverlay}></div>
              </div>
              <div className={styles.featuredContent}>
                <div className={styles.tag}>{FEATURED_ARTICLE.tag}</div>
                <h3 className={styles.featuredTitle}>{FEATURED_ARTICLE.title}</h3>
                <p className={styles.meta}>By {FEATURED_ARTICLE.author} &bull; {FEATURED_ARTICLE.date}</p>
              </div>
            </Link>

            {/* Small Articles Grid */}
            <div className={styles.grid}>
              {SMALL_ARTICLES.map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`} className={styles.smallCard}>
                  <div className={styles.smallImageWrap}>
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className={styles.image}
                      style={{ objectFit: "cover" }}
                    />
                    <div className={styles.gradientOverlay}></div>
                  </div>
                  <div className={styles.smallContent}>
                    <div className={styles.tagSmall}>{article.tag}</div>
                    <h4 className={styles.smallTitle}>{article.title}</h4>
                    <p className={styles.metaSmall}>By {article.author} &bull; {article.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
