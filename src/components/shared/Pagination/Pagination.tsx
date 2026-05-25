"use client";

import Image from "next/image";
import styles from "./Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total - 2, total - 1, total];
  if (current >= total - 2) return [1, 2, 3, "...", total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

const ARROW_WHITE = "/images/arrows/pagination-arrow-white.svg";
const ARROW_ORANGE = "/images/arrows/pagination-arrow.svg";

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className={styles.root}>
      {/* Prev arrow */}
      <button
        className={`${styles.arrow} ${styles.prevArrow}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        aria-label="Previous page"
      >
        <Image
          src={isFirstPage ? ARROW_ORANGE : ARROW_WHITE}
          alt=""
          width={15}
          height={15}
        />
      </button>

      {/* Page numbers */}
      <div className={styles.pages}>
        {pages.map((page, i) => (
          <button
            key={i}
            className={`${styles.pageBtn} ${page === currentPage ? styles.active : ""} ${page === "..." ? styles.dots : ""}`}
            disabled={page === "..."}
            onClick={() => typeof page === "number" && onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next arrow */}
      <button
        className={`${styles.arrow} ${styles.nextArrow}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        aria-label="Next page"
      >
        <Image
          src={isLastPage ? ARROW_ORANGE : ARROW_WHITE}
          alt=""
          width={15}
          height={15}
        />
      </button>
    </div>
  );
}
