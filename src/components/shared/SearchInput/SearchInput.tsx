"use client";

import Image from "next/image";
import styles from "./SearchInput.module.scss";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

export default function SearchInput({ wrapperClassName = "", className = "", ...props }: SearchInputProps) {
  return (
    <div className={`${styles.searchWrap} ${wrapperClassName}`}>
      <Image
        src="/images/search.svg"
        alt="Search"
        width={18}
        height={18}
        className={styles.searchIcon}
      />
      <input
        type="text"
        className={`${styles.searchInput} ${className}`}
        {...props}
      />
    </div>
  );
}
