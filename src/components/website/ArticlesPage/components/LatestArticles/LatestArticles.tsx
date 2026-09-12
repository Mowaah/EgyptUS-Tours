"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionHeader, EmptyState, BlogCard } from "@/components/shared";
import { Blog } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getBackendLocalizedArticle, getBackendLocalizedName } from "@/utils/localizedContent";
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
  const { language } = useLanguage();
  const { t } = useTranslation("common");

  const isSearching = !!searchQuery.trim();
  const localeCode = language === "it" ? "it-IT" : language === "es" ? "es-ES" : "en-GB";

  const featured = initialArticles.length > 0 ? initialArticles[0] : null;
  const remainingArticles = initialArticles.length > 1 ? initialArticles.slice(1) : [];

  const featuredLoc = featured ? getBackendLocalizedArticle(featured, language) : null;
  const featuredTitle = featuredLoc?.title || featured?.title || "";
  const featuredCategory = featured
    ? getBackendLocalizedName(featured.category, language, featured.category?.name || "Article")
    : "Article";
  
  // Unified list maps articles to Blog interface for the active search UI grid
  const ALL_ARTICLES: Blog[] = initialArticles.map((a) => {
    const loc = getBackendLocalizedArticle(a, language);
    const categoryName = getBackendLocalizedName(a.category, language, a.category?.name || "Travel");
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
                  title={t("articles.noArticlesTitle", "No Available Articles")}
                  description={t("articles.noArticlesDescription", "Sorry, this Article is currently unavailable. Please explore others or try different subject.")}
                  buttonText={t("articles.clearSearch", "Clear Search")}
                  onButtonClick={onClearSearch}
                />
              </div>
            ) : (
              <div className={styles.searchResultsWrap}>
                <h3 className={styles.searchResultsCount}>
                  {t("articles.searchResultsCount", "{count} Articles Found", { count: filteredSearch.length })}
                </h3>
                <div className={styles.searchResultsGrid}>
                  {filteredSearch.map((article) => (
                    <BlogCard
                      key={article.id}
                      blog={article}
                      readText={t("articles.readMore", "Read more")}
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
              label={t("articles.recentlyPosted", "Recently Posted")}
              heading={t("articles.latestArticlesHeading", "Latest Articles")}
              description={t(
                "articles.latestArticlesDescription",
                "We've earned the confidence of leading organizations worldwide through consistent excellence, transparency, and dedication to our clients' success."
              )}
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
                    alt={featuredTitle}
                    fill
                    className={styles.image}
                    style={{ objectFit: "cover" }}
                  />
                  <div className={styles.gradientOverlay}></div>
                </div>
                <div className={styles.featuredContent}>
                  <div className={styles.tag}>{featuredCategory}</div>
                  <h3 className={styles.featuredTitle}>{featuredTitle}</h3>
                  <p className={styles.meta}>By {featured.display_author_name} &bull; {new Date(featured.published_at).toLocaleDateString(localeCode, { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </Link>
            )}

            {/* Small Articles Grid */}
            {remainingArticles.length > 0 && (
              <div className={styles.grid}>
                {remainingArticles.map((article) => {
                  const loc = getBackendLocalizedArticle(article, language);
                  const title = loc.title || article.title;
                  const categoryName = getBackendLocalizedName(article.category, language, article.category?.name || "Article");
                  return (
                    <Link key={article.id} href={`/articles/${article.slug}`} className={styles.smallCard}>
                      <div className={styles.smallImageWrap}>
                        <Image
                          src={article.featured_image || "/images/home/hero-bg.png"}
                          alt={title}
                          fill
                          className={styles.image}
                          style={{ objectFit: "cover" }}
                        />
                        <div className={styles.gradientOverlay}></div>
                      </div>
                      <div className={styles.smallContent}>
                        <div className={styles.tagSmall}>{categoryName}</div>
                        <h4 className={styles.smallTitle}>{title}</h4>
                        <p className={styles.metaSmall}>By {article.display_author_name} &bull; {new Date(article.published_at).toLocaleDateString(localeCode, { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
