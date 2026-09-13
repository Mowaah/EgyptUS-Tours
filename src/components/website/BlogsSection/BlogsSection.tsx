"use client";

import { useState } from "react";
import { SectionHeader, PaginationArrows, Button, BlogCard, EmptyState } from "@/components/shared";
import { Blog } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getBackendLocalizedArticle, getBackendLocalizedName } from "@/utils/localizedContent";
import Image from "next/image";
import styles from "./BlogsSection.module.scss";

const VISIBLE_COUNT = 2;

interface BlogsSectionProps {
  blogs?: Blog[];
}

export default function BlogsSection({ blogs = [] }: BlogsSectionProps) {
  const { t } = useTranslation("home");
  const { language } = useLanguage();
  const [startIndex, setStartIndex] = useState(0);

  const displayBlogs = blogs.map((b) => {
    const loc = getBackendLocalizedArticle(b, language);
    const categoryName = getBackendLocalizedName(
      { name: b.category, translations: b.categoryTranslations },
      language,
      b.category
    );
    return {
      ...b,
      title: loc.title || b.title,
      excerpt: loc.excerpt || b.excerpt,
      category: categoryName,
    };
  });

  const visibleBlogs = displayBlogs.slice(startIndex, startIndex + VISIBLE_COUNT);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(displayBlogs.length - VISIBLE_COUNT, prev + 1)
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left column */}
          <div className={styles.left}>
            <SectionHeader
              label={t("blogsSection.label", "Blogs")}
              heading={t("blogsSection.heading", "Our Latest blogs")}
              description={t(
                "blogsSection.description",
                "Stay inspired with our latest articles. We bring you the best of Egypt's history, to help you discover the country.."
              )}
              align="left"
              maxWidth="386px"
              headingClassName={styles.blogsHeader}
            />
            <div className={styles.viewAllBtn}>
              <Button
                variant="outline"
                href="/blogs"
                icon={
                  <Image
                    src="/images/arrows/arrow-right-blue2.svg"
                    alt=""
                    width={16}
                    height={16}
                    style={{ marginTop: "2px" }}
                  />
                }
              >
                {t("blogsSection.viewAll", "View all Blogs")}
              </Button>
            </div>

            {displayBlogs.length > VISIBLE_COUNT && (
              <div className={styles.nav}>
                <PaginationArrows
                  layout="inline"
                  size={66}
                  iconWidth={32}
                  iconHeight={32}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  prevDisabled={startIndex === 0}
                  nextDisabled={startIndex >= displayBlogs.length - VISIBLE_COUNT}
                />
              </div>
            )}
          </div>

          {displayBlogs.length === 0 ? (
            <div className={styles.empty}>
              <EmptyState
                title={t("blogsSection.emptyTitle", "No Available Blogs")}
                description={t(
                  "blogsSection.emptyDescription",
                  "There are no blog articles to show right now. Check back soon for new travel stories."
                )}
                buttonText=""
              />
            </div>
          ) : (
            <div className={styles.cards}>
              {visibleBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
