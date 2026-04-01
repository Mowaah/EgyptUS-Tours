"use client";

import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/types";
import styles from "./BlogCard.module.scss";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className={styles.card}>
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
      </div>
      <div className={styles.footer}>
        <Link href={`/blogs/${blog.id}`} className={styles.read}>
          Read blog
          <Image
            src="/images/arrows/arrow-right-blue3.svg"
            alt=""
            width={14}
            height={14}
          />
        </Link>
        <span className={styles.date}>
          <Image
            src="/images/clock.svg"
            alt="Date"
            width={14}
            height={14}
          />
          {blog.date}
        </span>
      </div>
    </article>
  );
}
