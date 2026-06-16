import { ArticlesPanel } from "../ArticlesPanel/ArticlesPanel";
import styles from "./Articles.module.scss";

interface ArticlesProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function Articles({ searchQuery = "", onClearSearch }: ArticlesProps) {
  return (
    <div className={styles.page}>
      <ArticlesPanel searchQuery={searchQuery} onClearSearch={onClearSearch} />
    </div>
  );
}
