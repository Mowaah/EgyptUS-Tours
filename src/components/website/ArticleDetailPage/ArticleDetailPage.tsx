import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared";
import FaqSection from "@/components/website/FaqSection/FaqSection";
import FacebookIcon from "@public/images/facebook-gray.svg";
import CopyLinkIcon from "@public/images/copy-link.svg";
import styles from "./ArticleDetailPage.module.scss";

export interface ArticleContent {
  id: string;
  tag: string;
  tagColor?: "blue" | "orange";
  title: string;
  author: string;
  authorRole: string;
  authorBio: string;
  date: string;
  readTime: string;
  views: string;
  heroImage: string;
  heroCaption: string;
  intro: string;
  primaryQuote: string;
  sections: {
    h2?: string;
    h3?: string;
    paragraphs: string[];
    quote?: string;
    quoteVariant?: "blue" | "orange";
  }[];
  tags: string[];
  faqs?: { question: string; answer: string }[];
  relatedArticles: {
    id: string;
    title: string;
    date: string;
    image: string;
    href: string;
  }[];
  breadcrumbs: { label: string; href?: string; isCurrent?: boolean }[];
  type: "article" | "blog";
}

interface ArticleDetailPageProps {
  content: ArticleContent;
}

export default function ArticleDetailPage({ content }: ArticleDetailPageProps) {
  const initials = content.author
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <main className={styles.page}>
      {/* ── HERO SECTION ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroInner}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumbWrap}>
            <Breadcrumb items={content.breadcrumbs} />
          </div>

          {/* Badge */}
          <span
            className={`${styles.badge} ${content.tagColor === "orange" ? styles.badgeOrange : styles.badgeBlue}`}
          >
            {content.tag}
          </span>

          {/* Title & Meta */}
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{content.title}</h1>

            <div className={styles.meta}>
              <div className={styles.topRow}>
                <div className={styles.authorWrap}>
                  <div className={styles.authorAvatar}>{initials}</div>
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>{content.author}</span>
                    <span className={styles.authorRole}>{content.authorRole}</span>
                  </div>
                </div>

                <div className={styles.shareWrap}>
                  <button className={styles.shareBtn} aria-label="Share on Facebook">
                    <FacebookIcon />
                  </button>
                  <button className={styles.shareBtn} aria-label="Copy link">
                    <CopyLinkIcon />
                  </button>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.statsWrap}>
                <span className={styles.metaItem}>{content.date}</span>
                <div className={styles.dividerInner} />
                <span className={styles.dot} />
                <span className={styles.metaItem}>{content.readTime} read</span>
                <div className={styles.dividerInner} />
                <span className={styles.dot} />
                <span className={styles.metaItem}>{content.views} views</span>
              </div>

              <div className={styles.divider} style={{ order: 4 }} />
            </div>
          </div>

          {/* Hero Image */}
          <div className={styles.heroImageBlock}>
            <div className={styles.heroImageWrap}>
              <Image
                src={content.heroImage}
                alt={content.title}
                fill
                className={styles.heroImage}
                priority
              />
              <div className={styles.heroOverlay} />
            </div>
            {content.heroCaption && (
              <p className={styles.heroCaption}>{content.heroCaption}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── BODY SECTION ── */}
      <section className={styles.bodySection}>
        <div className={styles.bodyInner}>
          {/* Main content column */}
          <article className={styles.contentCol}>
            {/* Intro paragraph */}
            <p className={styles.intro}>{content.intro}</p>

            {/* Primary blockquote */}
            {content.primaryQuote && (
              <blockquote className={styles.blockquoteBlue}>
                {content.primaryQuote}
              </blockquote>
            )}

            {/* Content sections */}
            {content.sections.map((section, i) => (
              <div key={i} className={styles.contentSection}>
                {section.h2 && <h2 className={styles.h2}>{section.h2}</h2>}
                {section.h3 && <h3 className={styles.h3}>{section.h3}</h3>}
                {section.paragraphs.map((p, j) => (
                  <p key={j} className={styles.body}>{p}</p>
                ))}
                {section.quote && (
                  <blockquote
                    className={
                      section.quoteVariant === "orange"
                        ? styles.blockquoteOrange
                        : styles.blockquoteBlue
                    }
                  >
                    {section.quote}
                  </blockquote>
                )}
              </div>
            ))}

          </article>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <h4 className={styles.relatedTitle}>
              {content.type === "blog" ? "More Blogs" : "More Articles"}
            </h4>
            <div className={styles.relatedList}>
              {content.relatedArticles.map((article) => (
                <Link
                  key={article.id}
                  href={article.href}
                  className={styles.relatedItem}
                >
                  <div className={styles.relatedImageWrap}>
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className={styles.relatedImage}
                    />
                  </div>
                  <div className={styles.relatedMeta}>
                    <h5 className={styles.relatedItemTitle}>{article.title}</h5>
                    <span className={styles.relatedDate}>{article.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      {content.faqs && content.faqs.length > 0 && (
        <FaqSection
          items={content.faqs}
          description="Find quick answers about booking, pricing and transportation details."
        />
      )}
    </main>
  );
}
