"use client";

import { useState, useRef, useEffect } from "react";
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

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingIndex !== null) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editingIndex]);

  useEffect(() => {
    setEditingIndex(null);
    setInputValue("");
  }, [currentPage]);

  const submitPage = (val: string) => {
    const pageNum = parseInt(val, 10);
    if (!isNaN(pageNum) && pageNum >= 1) {
      const target = Math.min(Math.max(1, pageNum), totalPages);
      if (target !== currentPage) {
        onPageChange(target);
      }
    }
    setEditingIndex(null);
    setInputValue("");
  };

  return (
    <div className={styles.root}>
      {/* Prev arrow */}
      <button
        type="button"
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
        {pages.map((page, i) => {
          if (page === "...") {
            if (editingIndex === i) {
              return (
                <input
                  key={`edit-${i}`}
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={styles.dotsInput}
                  value={inputValue}
                  placeholder={String(currentPage)}
                  aria-label="Enter page number"
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^0-9]/g, "");
                    setInputValue(clean);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submitPage(inputValue);
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      setEditingIndex(null);
                      setInputValue("");
                    }
                  }}
                  onBlur={() => {
                    if (inputValue.trim()) {
                      submitPage(inputValue);
                    } else {
                      setEditingIndex(null);
                      setInputValue("");
                    }
                  }}
                />
              );
            }

            return (
              <button
                key={`dots-${i}`}
                type="button"
                className={`${styles.pageBtn} ${styles.dots}`}
                onClick={() => {
                  setEditingIndex(i);
                  setInputValue("");
                }}
                title="Click to enter page number"
                aria-label="Enter page number"
              >
                ...
              </button>
            );
          }

          return (
            <button
              key={page}
              type="button"
              className={`${styles.pageBtn} ${page === currentPage ? styles.active : ""}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next arrow */}
      <button
        type="button"
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
