import Image from "next/image";
import styles from "./SearchInput.module.scss";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  /**
   * `toolbar` â€” next to sort/filters: flexes in a row (no fixed min-width);
   * use in page toolbars. `default` â€” full width of parent.
   */
  variant?: "default" | "toolbar";
}

export default function SearchInput({
  wrapperClassName = "",
  className = "",
  variant = "default",
  ...props
}: SearchInputProps) {
  const wrapClass =
    variant === "toolbar"
      ? `${styles.searchWrap} ${styles.wrapToolbar} ${wrapperClassName}`.trim()
      : `${styles.searchWrap} ${wrapperClassName}`.trim();

  return (
    <div className={wrapClass}>
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
