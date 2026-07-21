"use client";

import { useState } from "react";
import { SectionHeader, PaginationArrows, Button, BlogCard } from "@/components/shared";
import { Blog } from "@/types";
import Image from "next/image";
import styles from "./BlogsSection.module.scss";

const BLOGS: Blog[] = [
  {
    id: "1",
    category: "Destinations",
    categoryColor: "blue",
    title: "Egypt in Summer vs Winter: When Is the Best Time?",
    excerpt:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    date: "03 March 2026",
    image: "/images/home/hero-bg.png",
  },
  {
    id: "2",
    category: "Adventure",
    categoryColor: "orange",
    title: "7 Adventures in Egypt That'll Make You Forget Everything Else",
    excerpt:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    date: "03 March 2026",
    image: "/images/home/hero-bg.png",
  },
  {
    id: "3",
    category: "History",
    categoryColor: "blue",
    title: "The Hidden Temples of Upper Egypt You Haven't Heard Of",
    excerpt:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    date: "10 March 2026",
    image: "/images/home/hero-bg.png",
  },
  {
    id: "4",
    category: "Culture",
    categoryColor: "orange",
    title: "Egyptian Street Food: A Culinary Journey Through Cairo",
    excerpt:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    date: "15 March 2026",
    image: "/images/home/hero-bg.png",
  },
];

const VISIBLE_COUNT = 2;

interface BlogsSectionProps {
  blogs?: Blog[];
}

export default function BlogsSection({ blogs }: BlogsSectionProps) {
  const [startIndex, setStartIndex] = useState(0);

  const displayBlogs = blogs && blogs.length > 0 ? blogs : BLOGS;
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
              label="Blogs"
              heading="Our Latest blogs"
              description="Stay inspired with our latest articles. We bring you the best of Egypt's history, to help you discover the country.."
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
                View all Blogs
              </Button>
            </div>

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
          </div>

          {/* Right column – blog cards */}
          <div className={styles.cards}>
            {visibleBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
