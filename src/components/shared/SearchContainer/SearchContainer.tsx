"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./SearchContainer.module.scss";

interface SearchContainerProps {
  placeholder?: string;
  description?: string;
  value?: string;
  onSearch?: (query: string) => void;
}

export default function SearchContainer({
  placeholder = "Search Article here",
  description = "Explore our insider guides and professional tips to make the most of every destination and elevate your travel experience",
  value,
  onSearch,
}: SearchContainerProps) {
  const [localValue, setLocalValue] = useState(value || "");

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  const handleSearchSubmit = () => {
    onSearch?.(localValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <div className={styles.searchBox}>
      {/* Decorative elements */}
      <div className={styles.planeDecoration}>
        <Image src="/images/paper-plane.svg" alt="" fill className={styles.imageContain} />
      </div>
      <div className={styles.bubblesDecoration}>
        <Image src="/images/chat-bubble.svg" alt="" fill className={styles.imageContain} />
      </div>
      <div className={styles.dottedDecoration}>
        <Image src="/images/dotted-line-blue.svg" alt="" fill className={styles.imageContain} />
      </div>
      <div className={styles.blueCircle} />

      <div className={styles.searchContentBox}>
        <div className={styles.searchInputRow}>
          <div className={styles.inputOuterWrap}>
            <div className={styles.inputInnerWrap}>
              <Image src="/images/search.svg" alt="Search" width={24} height={24} className={styles.searchIcon} />
              <input
                type="text"
                placeholder={placeholder}
                className={styles.input}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className={styles.searchBtnWrap}>
            <button className={styles.searchBtn} onClick={handleSearchSubmit}>
              Search
            </button>
          </div>
        </div>

        {description && (
          <p className={styles.searchDesc}>{description}</p>
        )}
      </div>
    </div>
  );
}
