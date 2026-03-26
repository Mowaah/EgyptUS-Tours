"use client";

import { useState } from "react";
import { SectionHeader, PaginationArrows } from "@/components/shared";
import Image from "next/image";
import Link from "next/link";
import styles from "./BlogsSection.module.scss";

interface Blog {
  id: string;
  category: string;
  categoryColor?: "blue" | "orange";
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

const BLOGS: Blog[] = [
  {
    id: "1",
    category: "Destinations",
    categoryColor: "blue",
    title: "Egypt in Summer vs Winter: When Is the Best Time?",
    excerpt:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    date: "03 March 2026",
    image: "/images/home/hero-bg.jpg",
  },
  {
    id: "2",
    category: "Adventure",
    categoryColor: "orange",
    title: "7 Adventures in Egypt That'll Make You Forget Everything Else",
    excerpt:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    date: "03 March 2026",
    image: "/images/home/hero-bg.jpg",
  },
  {
    id: "3",
    category: "History",
    categoryColor: "blue",
    title: "The Hidden Temples of Upper Egypt You Haven't Heard Of",
    excerpt:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    date: "10 March 2026",
    image: "/images/home/hero-bg.jpg",
  },
  {
    id: "4",
    category: "Culture",
    categoryColor: "orange",
    title: "Egyptian Street Food: A Culinary Journey Through Cairo",
    excerpt:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    date: "15 March 2026",
    image: "/images/home/hero-bg.jpg",
  },
];

const VISIBLE_COUNT = 2;

export default function BlogsSection() {
  const [startIndex, setStartIndex] = useState(0);

  const visibleBlogs = BLOGS.slice(startIndex, startIndex + VISIBLE_COUNT);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(BLOGS.length - VISIBLE_COUNT, prev + 1)
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left column */}
          <div className={styles.left}>
            <SectionHeader
              label="Blogs"
              heading="Our Latest blogs"
              description="Stay inspired with our latest articles. We bring you the best of Egypt's history, to help you discover the country.."
              align="left"
            />
            <Link href="/blogs" className={styles.viewAll}>
              View all Blogs <span>→</span>
            </Link>

            <div className={styles.nav}>
              <PaginationArrows
                layout="inline"
                size={44}
                iconWidth={16}
                iconHeight={16}
                onPrev={handlePrev}
                onNext={handleNext}
                prevDisabled={startIndex === 0}
                nextDisabled={startIndex >= BLOGS.length - VISIBLE_COUNT}
              />
            </div>
          </div>

          {/* Right column – blog cards */}
          <div className={styles.cards}>
            {visibleBlogs.map((blog) => (
              <article key={blog.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className={styles.image}
                  />
                </div>
                <div className={styles.body}>
                  <span
                    className={`${styles.category} ${blog.categoryColor === "orange" ? styles.orange : styles.blue}`}
                  >
                    {blog.category}
                  </span>
                  <h3 className={styles.title}>{blog.title}</h3>
                  <p className={styles.excerpt}>{blog.excerpt}</p>
                  <div className={styles.footer}>
                    <Link href={`/blogs/${blog.id}`} className={styles.read}>
                      Read blog <span>›</span>
                    </Link>
                    <span className={styles.date}>
                      <Image
                        src="/images/calendar.svg"
                        alt="Date"
                        width={14}
                        height={14}
                      />
                      {blog.date}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
